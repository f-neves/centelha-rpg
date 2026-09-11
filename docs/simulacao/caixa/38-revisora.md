# Rodada 38 · resposta da revisora (a voz na caixa de conjurar, VOZ.md §10 decisões 9/10/11)

Revisora: aviso em `bc7a64f`. BASE `a52fdb0`, SHA/TOPO `f4df8f7`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `bc7a64f415bba8b0e43dab486c058bd265e7a39e`. Batem. Dois commits:
`f4df8f7` (Executora) e `cd31b74` (Arquiteto, reaponte). Revisei os dois.

## D38b — os nove setters, um a um

**Reli o diff função por função, comparando o corpo de dentro de cada `onclick` antigo com
o corpo da função nova, linha a linha — não aceitei "bateria verde" como prova sozinha.**
O resultado tem uma nuance que a descrição do aviso não captura ("SEM MUDAR COMPORTAMENTO
NENHUM... a MESMA lógica, só nomeada e movida"): **oito dos nove ganharam algo que o
`onclick` original não tinha.**

- `trocarArte`: idêntico, já tinha `if (!d) return`.
- `trocarEfeito`: ganhou `if (!lista.some(e => e.id === id)) return false` — o `onclick`
  original fazia `efeitoSel = b.dataset.ef ? EFEITO[...] : null` sem checar se aquele Efeito
  cabe na Arte atual.
- `ajustarPar`: original lia `pars` de uma variável já computada fora do handler (fechada
  no closure de `pintar()`); a nova RECALCULA `parametrosAjustaveis(efeitoSel)`/
  `parametrosDoImproviso()` a cada chamada, e troca o `pars.find(...)!` (assume que acha)
  por `p ? escalaDe(p) : null` (não assume).
- `setMolde`/`setSolido`/`setFatias`/`setAbrir`/`setAngulo`/`setCurvatura`: os seis ganharam
  uma checagem de pertencimento (`MOLDE[id]`, `SOLIDO[id]`, `Number.isFinite(n) && n>=1`,
  `ABRIR_COBRA.some(...)`, `ABERTURAS.includes(...)`, `CURVATURAS.includes(...)`) que o
  `onclick` original não tinha — ele só escrevia o valor do `dataset` direto.
- `setPar`: **não tem equivalente de clique nenhum.** É capacidade nova (escreve um valor
  ABSOLUTO, não um incremento) — necessária porque clicar só tinha `+`/`−`, e a decisão 10
  pede "dano cinco" de uma vez. Não é extração, é o que a régua pediu de verdade.

**Isto não é regressão, e digo por quê antes de classificar.** As validações novas só
RECUSAM (devolvem `false`, não mutam nada) quando o valor não é válido — para o CLIQUE isso
nunca dispara, porque um botão só existe no DOM quando já representa uma opção válida
(o mesmo `MOLDE[id]` que valida agora é o catálogo que gerou o botão). A checagem é
exatamente o que a VOZ precisa e o clique nunca precisou, porque fala pode nomear
QUALQUER COISA e clique não. Rodei os dois testes que consomem este código sem serem
tocados por esta rodada, para confirmar na prática, não só na leitura: `test-arte-na-mesa.mjs`
(33 asserções, exit 0) e `test-artes-grid.mjs` (exit 0) — os dois passaram limpos.

**A resposta à pergunta específica ("algum setter dependia de algo do escopo de dentro?"):
não, e a mudança foi na direção mais segura, não na mais arriscada.** `ajustarPar` deixou de
depender de uma variável fechada por closure (que só estava certa porque `pintar()`
re-registrava tudo a cada render) e passou a recalcular por conta própria — troca staleness
possível por recomputação sempre fresca. Conferi `dlg.__vozConjurar`
(`artes-grid-ui.ts:489-502`): todas as funções penduradas ali fecham sobre variáveis do
escopo de FORA de `pintar()` (`arteSel`, `efeitoSel`, `nivelArte`, `disponiveis`,
`MOLDES_DE_CHAO`, etc.) — nada ficou preso a um closure que foi removido.

**Classificação: não é `CORRIGE`.** É um caso em que a frase do aviso simplifica demais uma
mudança que, no detalhe, é extração MAIS um reforço de segurança — vale como nota para quem
ler o histórico depois, não como achado que muda o veredito.

## D38c — o teste hoje detectaria de novo?

**Não, não de forma confiável, e digo o porquê em vez de conjecturar.** O defeito original
(uma chave a mais partiu `cenaVozConsentimento`, a segunda metade rodou órfã contra uma
página já fechada por `p.close()`) só foi PEGO porque o código órfão, por acaso, tocava algo
que já tinha sido destruído — isso lançou uma exceção do Puppeteer, visível. Se o código
órfão tivesse caído num pedaço que só lê/escreve algo AINDA vivo (por exemplo, se a divisão
acontecesse um pouco mais cedo ou mais tarde no arquivo), ele teria rodado calado, contra o
contexto errado, sem lançar nada — passando verde por acidente, não por prova.

Procurei um mecanismo estrutural que pegasse esta CLASSE de erro (não só esta instância) e
não achei nenhum: `grep -n "br.pages()"` no arquivo inteiro não bate em nada — não existe
hoje uma checagem genérica de "quantas páginas ficaram abertas no fim", que pegaria QUALQUER
cena com vazamento ou execução fantasma, independente de qual variável ela tocasse. **Ideia
barata, não implementada por mim:** uma asserção única, no fim de `test-grid.mjs`, conferindo
`(await br.pages()).length === 1` (só a página em branco inicial) fecharia essa classe
inteira de defeito de uma vez, sem precisar de disciplina de quem edita no meio das cenas.
Registro como sugestão, não decisão.

## O resto, conferido

**Decisões 9/10/11**: `camposDaMagia` (`grid.astro:8781-8857`) respeita a decisão 13 ao pé
da letra — cada grupo de campo só entra na lista se `dlg.querySelector('[data-molde]')`
(etc.) achar o botão de verdade no DOM, nunca uma suposição fixa. `aplicarNaMagia`
(`grid.astro:8864-8884`) só chama os setters — nunca um clique em "Conjurar" (decisão 9),
nunca simula N cliques (decisão 10, escreve valor absoluto direto). Decisão 11 (léxico só o
que a peça tem): `api.artes()`/`api.efeitos()` vêm de `disponiveis`/`efeitosDisponiveis(...,
ctx.comprados)`, o mesmo filtro que já limitava o clique.

**D38a (longest-match/ambiguidade) e `permitido`**: conferidos linha a linha em
`comando-barra.ts:256-293`. Casa a opção mais longa entre as candidatas na posição atual;
`valores.size > 1` entre as mais longas é o gatilho de ambiguidade de verdade (RECUSA);
`campo.permitido` (o conjunto fechado) é checado antes de `min`/`max`. Bate exatamente com
a descrição.

**O reaponte (`cd31b74`)**: amostra de 9 citações conferida contra o `HEAD` atual, uma a
uma — todas batem, linha e texto.

**Rodei tudo eu mesma**, não só li o relato: `test-arte-na-mesa.mjs` (33/33), `test-artes-grid.mjs`
(exit 0), e `test-grid.mjs` completo (exit 0, acompanhei ao vivo as quatro cenas de voz
passando, incluindo as 5 novas de `cenaVozMagia`). `npm run validate`: exit 0.

**Nada afirma que a fala foi testada.** `test-comando-voz.mjs` e `cenaVozMagia` dizem isso
com todas as letras nos próprios comentários; o aviso repete na seção "O QUE FICOU EM
ABERTO". A lacuna de cobertura (só 3 das ~9 telas dinâmicas exercitadas ao vivo, o resto só
pelo parser puro) está registrada com precisão, não escondida — o próprio aviso já diz que
não achou Efeito de zona no catálogo da bancada a tempo.

## BLOQUEIA

Nada.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

Nada.

## VEREDITO

SEGUE
