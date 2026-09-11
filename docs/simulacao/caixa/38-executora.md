# Rodada 38 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  a52fdb0e0a424d75ff9868193679028d24bcfbd0
SHA   f4df8f7d7a8315670c601f59ee6c9cd4e8e5adc5
TOPO  f4df8f7d7a8315670c601f59ee6c9cd4e8e5adc5
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

**Dois commits nesta rodada, autores diferentes**: `f4df8f7` é da Executora (o código e os
testes do item desta rodada); `cd31b74` é do Arquiteto (o reaponte, feito DEPOIS do
commit da Executora, na ordem de sempre).

| arquivo | quem | o que mudou nele |
|---|---|---|
| `Pendencias.md` | Arquiteto | reaponta as citações a `grid.astro` deslocadas pelo `f4df8f7` |
| `docs/simulacao/ESTADO.md` | Arquiteto | mesma reaponte |
| `docs/simulacao/VOZ.md` | Arquiteto | mesma reaponte |
| `scripts/test-comando-voz.mjs` | Executora | de 34 para 42 asserções: centena, `permitido`, escolha de mais de uma palavra, longest-match, ambiguidade real |
| `scripts/test-grid.mjs` | Executora | ganha a cena `cenaVozMagia` (no `smoke`); e o conserto de um erro próprio (ver D38c) |
| `src/data/comando-barra.json` | Executora | `numeros` ganha `centenas` (`cento`) e `dezenas` ganha `oitenta`/`noventa` |
| `src/lib/artes-grid-ui.ts` | Executora | os nove setters extraídos (ver D38b) e `dlg.__vozConjurar` |
| `src/lib/comando-barra.ts` | Executora | `permitido` em `CampoNumero`; centena em `lerInteiro`; o ramo `escolha` casando frase de mais de uma palavra |
| `src/pages/mesa/grid.astro` | Executora | **o item desta rodada**: `camposDaMagia`/`aplicarNaMagia` (dinâmicos), `camposAtivos`/`receberFala` estendidos para a terceira tela, os hooks de teste `window.__ABRIR_CONJURAR` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 42 asserções, 0 falhas | o parser puro (centena, `permitido`, escolha multi-palavra, longest-match, ambiguidade) | `scripts/test-comando-voz.mjs`, rodado nesta sessão; entra em `npm run validate` |
| 5 asserções, 0 falhas | a cena "a voz na caixa de conjurar" contra a bancada de verdade | `scripts/test-grid.mjs:2954` (`cenaVozMagia`), rodado nesta sessão; entra em `npm run smoke` |
| 75 citações de código conferidas, 0 quebradas | `npm run validate`/`test-procedencia.mjs` no commit avisado, depois da reaponte do Arquiteto | rodado nesta sessão, neste commit; `node scripts/test-procedencia.mjs` |
| 18 citações deslocadas íntegras, 25 movidas ao todo, 0 quebradas por este diff, 5 vermelhas de antes (`L72`, itens fechados) | a contagem do PRÓPRIO reaponte, medida pelo Arquiteto | relatada por ele (commit `cd31b74`); não é número que eu medi, e a coluna anterior (75) é a que eu conferi de fora |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D38a | **O CASAMENTO DE MAIS DE UMA PALAVRA VIROU CAPACIDADE GERAL do tipo `escolha`**, não um caminho especial só para Arte/Efeito: `interpretarNumeros` procura, para cada opção, TODAS as suas frases, mede quantos tokens cada uma consome a partir da posição atual, casa a MAIS LONGA entre as que baterem, e recusa se restarem duas opções de VALORES diferentes empatadas no mesmo tamanho (VOZ.md §4, "recusa em vez de aproxima" aplicada ao caso novo). Testado com o par sintético "arma"/"arma elemental" (a longa vence quando dita, a curta vence quando é só ela) e com um par artificial de mesma frase e valores diferentes (recusa de verdade) | custo: cada opção `escolha` agora pode ter mais de uma frase e cada frase mais de uma palavra — o comentário do tipo já avisa isso, mas é mais estado para quem ler o catálogo depois entender de uma vez |
| D38b | **OS NOVE SETTERS SAÍRAM DO `onclick` PARA O ESCOPO DE FORA SEM MUDAR COMPORTAMENTO NENHUM** (`trocarArte`, `trocarEfeito`, `ajustarPar`, `setPar`, `setMolde`, `setSolido`, `setFatias`, `setAbrir`, `setAngulo`, `setCurvatura`, `artes-grid-ui.ts`). Cada um é a MESMA lógica que já vivia dentro do `onclick` (a mesma linha de clamping, a mesma chamada a `pintar()` no final), só com nome e fora do closure de `pintar()` — os `onclick` que restaram só chamam a função nomeada com os mesmos argumentos que já tiravam de `b.dataset`. Conferido de duas formas: (1) leitura do diff função por função, comparando o corpo de dentro do `onclick` antigo com o corpo do setter novo, garantindo que é cópia e não reescrita; (2) a bateria inteira de smoke continua verde, com destaque para `test-arte-na-mesa.mjs` (33 asserções, o caminho de MESA que consome o Plano que esta caixa produz) e `test-artes-grid.mjs`, nenhum dos dois tocado por esta rodada e nenhum dos dois quebrou | custo: `artes-grid-ui.ts` teve 169 linhas movidas (não escritas do zero) — é exatamente o tipo de diff grande e de baixo risco que pede leitura cuidadosa e não leitura rápida, porque "muita linha mudou" e "muito comportamento mudou" não são a mesma coisa aqui |
| D38c | **UM ERRO MEU, achado e consertado antes de reportar como pronto**: ao inserir `cenaVozMagia` em `test-grid.mjs`, uma chave `}` a mais fechou `cenaVozConsentimento` (rodada 37) cedo demais, e a segunda metade dela (o teste do "sim") ficou órfã, chamando `p.evaluate`/`p.waitForSelector` numa página que o `p.close()` anterior já tinha fechado. Achei rodando o teste (o erro aparece como excepção do Puppeteer, não como assertion falha — **é o tipo de defeito que passaria calado se a função órfã não chamasse nada que lançasse**, próximo da forma do achado do `L74`, "a costura de teste que recalcula em vez de observar": aqui não é recálculo, é execução fantasma depois do fim, mas o efeito é o mesmo, um teste que não prova nada e não avisa). Reconstruí a função original inteira (as 13 asserções da rodada 37) antes de acrescentar a nova, e reconferi as duas rodando juntas | custo: nenhum no resultado final — o achado só existe porque rodei o teste de verdade em vez de confiar na leitura do diff |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O MICROFONE NÃO FOI TESTADO, e isto é por desenho, não descuido.** `test-comando-voz.mjs`
  prova o parser puro. `cenaVozMagia` injeta texto já reconhecido em `window.__RECEBER_FALA`
  e abre a caixa por `window.__ABRIR_CONJURAR` (o mesmo caminho do menu, `usarArte`, sem
  simular clique de menu) — nenhuma linha passa pelo Vosk. A taxa de reconhecimento (nomes de
  Arte/Efeito de verdade, ditos por um humano) é bancada do humano, como sempre nesta frente.
- **Só três das ~nove telas dinâmicas foram exercitadas ao vivo** (Arte, Efeito composto, um
  parâmetro numérico). Molde, sólido, fatias, abrir-cobra, abertura e curvatura passaram pelo
  parser puro (`test-comando-voz.mjs`, a centena e o `permitido`) mas não por uma cena de
  `smoke` chamando `dlg.__vozConjurar.setMolde`/etc. de dentro do Grid rodando — não achei um
  Efeito no catálogo da bancada que manifestasse zona (a maioria dos Efeitos comprados por
  `FICHA_PC` que testei são buffs, não manifestações) a tempo de montar esse cenário nesta
  rodada. Fica registrado como lacuna de cobertura, não como incerteza sobre o mecanismo (o
  mecanismo é o MESMO `setPar`/`escalaDe` já provado para os cinco `data-par`, e os setters de
  molde/sólido/etc. são igualmente diretos).
- Nada mais precisa do humano nesta rodada; o resto é revisão de código.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/VOZ.md` · §10 decisões 9/10/11 (magia enche e para, valor direto no plano,
  léxico só o que a peça tem)
- `src/lib/artes-grid-ui.ts` · os nove setters (D38b) e `dlg.__vozConjurar`
- `src/lib/comando-barra.ts` · `permitido`, a centena em `lerInteiro`, o ramo `escolha` (D38a)
- `src/pages/mesa/grid.astro` · `camposDaMagia`/`aplicarNaMagia`
- `scripts/test-comando-voz.mjs` e `scripts/test-grid.mjs:2954` (`cenaVozMagia`) · a prova
- `docs/simulacao/caixa/progresso-voz-magia.md` · o levantamento completo e o achado D38c
