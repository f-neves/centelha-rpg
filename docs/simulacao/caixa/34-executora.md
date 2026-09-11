# Rodada 34 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  87c4f19a1a2213a30443793cafe372ef5251c064
SHA   4c1f7292842b918aaf482594882d59447e24ca40
TOPO  7fc49f886b020b908b2640ea176cd2d6e4d23c0b
```

**CORREÇÃO DO ARQUITETO, e leia antes de conferir os campos.** O `--enviar` rodou duas
vezes por engano, no mesmo minuto. Na segunda vez o `HEAD` já era o commit do PRIMEIRO
aviso (`1b2f8a1`), e o script, que relê o `HEAD` de propósito, reescreveu `SHA` e `TOPO`
apontando para o próprio aviso. Corrigi os dois à mão: `SHA` é o último commit de
TRABALHO (`4c1f729`) e `TOPO` é o topo do `main` agora (`7fc49f8`, o sinal de vida do
progresso, que não é código). A cobertura nunca esteve furada · `git log BASE..SHA`
trazia tudo nos dois casos; o que estava errado era o campo dizer coisa diferente do que
nomeia. Os commits a revisar são **`e22b4b3` (Executora)** e **`4c1f729` (Arquiteto)**.

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

**Dois commits nesta rodada, autores diferentes**: `e22b4b3` é da Executora (o código e os
testes do item desta rodada); `4c1f729` é do Arquiteto (reaponte de 48 citações deslocadas
pelo commit anterior, mais o `L72` e a forma nova no `CATALOGO.md`, achados enquanto ele
conferia o reaponte, não desta frente).

| arquivo | quem | o que mudou nele |
|---|---|---|
| `Pendencias.md` | Arquiteto | reaponta as citações a `grid.astro` deslocadas pelo `e22b4b3`; abre o `L72` (o portão de procedência só confere item ABERTO, e cinco citações de itens já fechados apodreceram sem acender nada) |
| `docs/simulacao/CATALOGO.md` | Arquiteto | registra a forma do achado do `L72` |
| `docs/simulacao/ESTADO.md` | Arquiteto | mesma reaponte, 8 citações |
| `docs/simulacao/VOZ.md` | Arquiteto | mesma reaponte (10 citações do §10, que cita `grid.astro` dezoito vezes) e o parágrafo novo no `L65` sobre a ORDEM do reaponte (rodar o mapa do diff duas vezes em cima de documentos já deslocados dobra o deslocamento em silêncio; o conserto é devolver ao `HEAD` e reapontar uma vez só, com o diff completo) |
| `package.json` | Executora | registra `scripts/test-comando-voz.mjs` na cadeia do `validate` |
| `scripts/test-comando-voz.mjs` | Executora | **novo**: o parser numérico provado sem navegador (23 asserções) |
| `scripts/test-grid.mjs` | Executora | ganha a cena `cenaVozQuente` (no `smoke`, atrás de `?vozteste=1`) |
| `src/data/comando-barra.json` | Executora | ganha `numeros` (as duas listas do §9.5/§10 decisão 6) e `campos` (o catálogo do §10 decisão 13) |
| `src/lib/comando-barra.ts` | Executora | ganha `interpretarNumeros`, `CampoNumero`, `comecaComPalavraDeCampo`; `gramaticaDeVoz` passa a aceitar os campos ativos |
| `src/lib/comando-voz.ts` | Executora | `carregarVoz` ganha o prazo de 20s (`L71`, `Promise.race`) |
| `src/pages/mesa/grid.astro` | Executora | **os itens desta rodada**: tecla V com escuta própria, `golpeVencidoNaFaixa`, `camposAtivos`, `aplicarPreenchimentos`/`aplicarNumeros`, o roteador `receberFala`, o hook de teste `window.__RECEBER_FALA` atrás de `?vozteste=1` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 23 asserções, 0 falhas | o parser numérico puro (`interpretarNumeros`/`comecaComPalavraDeCampo`/`gramaticaDeVoz`) | `scripts/test-comando-voz.mjs`, rodado nesta sessão; entra em `npm run validate` |
| 8 asserções, 0 falhas | a cena "o caminho quente da voz" contra a bancada de verdade | `scripts/test-grid.mjs:2557` (`cenaVozQuente`), rodado nesta sessão; entra em `npm run smoke` |
| "1d6 +2 (C)" → "[4, 2] +2 = 8" | o pool do dano ANTES e DEPOIS de preencher `al-dn` pelo campo (não por teclado) — a prova de que o preenchimento dispara o mesmo recálculo que digitar dispara | mesma cena, saída ao vivo (`scripts/test-grid.mjs:2557`, a asserção do "pool do dano mudou") |
| 45 citações conferidas, 0 quebradas | a reaponte do Arquiteto contra `HEAD`, depois da segunda volta | commit `4c1f729`; `node scripts/test-procedencia.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D34a | **ACHADO DE TESTE, FORA DO PEDIDO: `E.devido()` (o espelho de motor, `grid.astro`, dentro de `if (ESPELHO_LIGADO)`) só está certo no Simultâneo — ele lê `tickSim()` direto, e essa é a régua da CENA, que só existe naquele sistema (`SIML()`). No Normal/PGR a régua certa é `tickDaVez()`, que já sabe da diferença. Copiar `E.devido()` para o cartão vencido (a tentação óbvia, já que ele faz exatamente "o golpe vencido mais cedo, com o dono") teria achado o golpe ERRADO, ou nenhum, fora do Simultâneo — e isso só aparece rodando, nunca lendo o código dos dois em paralelo, porque as assinaturas são idênticas. Escrevi `golpeVencidoNaFaixa()` própria, agnóstica de sistema, em cima de `instanteDeGolpe()`/`tickDaVez()`. Provado ao vivo contra a bancada (`cenaVozQuente`, que roda com `adiado=1`, fora do Simultâneo): o cartão abre certo | custo: mais uma função pequena e paralela a `E.devido()`, em vez de reusar — as duas fazem quase a mesma pergunta de jeitos diferentes, e um comentário cruzado nos dois lados é o que evita alguém "simplificar" isso de volta um dia |
| D34b | **ACHADO DE TESTE, FORA DO PEDIDO: sem contexto numérico ativo (nenhuma folha aberta, nenhum cartão vencido), uma fala que COMEÇA com palavra de campo caía no parser de VERBO** por falta de contexto — "acerto quatro dois seis" abria o escolhedor de verbo (sugerindo "mover H7", "tirar"...), que não tem nada a ver com o que foi dito, e num teste headless isso TRAVA PARA SEMPRE esperando uma escolha que nunca chega (foi assim que achei: meu próprio teste travou). Consertei fazendo o roteador (`receberFala`) checar o CATÁLOGO INTEIRO de campos (`CAMPOS`) para decidir o DOMÍNIO da fala, e só depois checar `camposAtivos()` para decidir se há onde preencher — sem cartão vencido, agora mostra a recusa certa da decisão 12, nunca o palpite de verbo | custo: nenhum em produção (é estritamente uma correção); o código ganhou um comentário longo explicando a distinção abaixo, porque ela não é óbvia relendo depois |
| D34c | **A DISTINÇÃO QUE A REVISORA VAI QUERER CONFERIR, nas palavras exatas que o Arquiteto pediu**: o catálogo inteiro (`CAMPOS`) só decide o ROTEAMENTO de um texto que JÁ FOI RECONHECIDO (em `receberFala`); a GRAMÁTICA que o Vosk de fato escuta continua vindo só de `camposAtivos()` (a chamada é `gramaticaDeVoz(campos)`, dentro de `segurarVoz`, com `campos = camposAtivos()`). Sem cartão vencido nem folha aberta, a palavra "acerto" NEM ESTÁ na gramática que o reconhecedor recebe, então ele nunca a devolve de verdade — o ramo do D34b só é alcançado por uma fala que tinha contexto quando foi ouvida e o perdeu antes do resultado chegar (janela real, mas estreita), ou pela injeção de teste (`window.__RECEBER_FALA`, que não passa pelo Vosk). **A decisão 2 do §10 (duas camadas, "cada palavra a mais piora o acerto de todas as outras") fica intacta**: a camada da caixa aberta continua sendo a única que entra na gramática de verdade | custo: nenhum — é a distinção que já existia por desenho, só ficou registrada explicitamente no comentário do código depois da pergunta |
| D34d | **`camposAtivos()` devolve o CATÁLOGO INTEIRO (as 5 do caminho quente) quando há cartão vencido mas NENHUMA folha aberta ainda** (decisão 12, fala com a tela fechada), em vez de conferir no DOM quais campos a folha VAI ter — porque ela ainda não existe para conferir. É uma aproximação, não a leitura de decisão 13 ("nunca lista fixa escrita à mão") ao pé da letra nesse instante específico; funciona sem risco nesta rodada porque só existe UM tipo de caixa numérica no catálogo hoje (a folha do golpe). Quando a magia ou a ação entrarem (rodada futura, fora de escopo aqui), este ponto precisa saber qual caixa VAI abrir antes dela existir, e a aproximação para de servir — registrado para não ser esquecido | custo: nenhum agora; é uma dívida pequena e localizada, marcada em "O QUE FICOU EM ABERTO" |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O MICROFONE NÃO FOI TESTADO, e isto é por desenho, não descuido.** Nenhuma linha deste
  relatório prova reconhecimento de fala de verdade. `scripts/test-comando-voz.mjs` prova o
  parser (texto → preenchimento), puro, sem áudio. `cenaVozQuente` prova o CAMINHO inteiro
  (tecla, campo, recálculo, o cartão abrindo sozinho) injetando o texto reconhecido direto em
  `window.__RECEBER_FALA`, pulando o Vosk por completo — é teste de injeção, prova o caminho,
  não a escuta. A TAXA DE RECONHECIMENTO (as duas listas de número por extenso, o comprimento
  da sequência de faces, o nome de Arte/Efeito) é bancada do HUMANO, com a voz dele, como o
  VOZ.md §10.4 já registrava antes desta rodada.
- **D34d (acima): `camposAtivos()` aproxima "cartão vencido, folha ainda não aberta" como o
  catálogo inteiro.** Funciona sem risco enquanto só existir uma caixa numérica no catálogo; uma
  frente futura de magia/ação precisa resolver isto antes de crescer o catálogo, não depois.
- **O prazo de 20s (`L71`, item 0) ficou no número que o Arquiteto propôs.** Não há modelo real
  neste ambiente para medir se o carregamento legítimo às vezes passa disso — quem mede é o
  humano, na bancada dele, como já estava decidido antes de eu começar.
- Nada mais precisa do humano nesta rodada; o resto é revisão de código.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/VOZ.md` · §9 (a medição e o alvo real, 51%), §10 (as treze decisões, o pedido
  desta rodada), `L65`/`L72` (o achado do Arquiteto sobre a ordem do reaponte e o portão)
- `src/pages/mesa/grid.astro` · `golpeVencidoNaFaixa` (D34a, com o comentário sobre `E.devido()`),
  `receberFala` (D34b/D34c, o comentário inteiro sobre roteamento vs. gramática),
  `camposAtivos` (D34d), `ligarTeclaDeVoz` (item 1), `aplicarPreenchimentos`/`aplicarNumeros`
  (item 3/4)
- `src/lib/comando-barra.ts` · `interpretarNumeros`, `lerInteiro`, `comecaComPalavraDeCampo`
- `src/lib/comando-voz.ts` · `carregarVoz` (o prazo de 20s)
- `scripts/test-comando-voz.mjs` e `scripts/test-grid.mjs:2557` (`cenaVozQuente`) · a prova
- `docs/simulacao/caixa/progresso-voz-quente.md` · o levantamento completo, os dois achados no
  instante em que apareceram, e a ida e volta do reaponte com os horários de cada etapa
