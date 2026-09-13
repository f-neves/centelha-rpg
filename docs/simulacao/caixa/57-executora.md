# Rodada 57 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  b82ae800a0d249f171d0e3c5185e1089a06a51cf
SHA   972d11b20d7576276c485c8d9198b252859687ca
TOPO  972d11b20d7576276c485c8d9198b252859687ca
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
documento da rodada; aqui é só o inventário. Cinco commits no intervalo,
porque a `BASE` é o veredito anterior (`b82ae80`) e não o início desta
rodada: `3eeb8fd` (meu, o CORRIGE da rodada 56, já avisado por mensagem);
`9e28abe`, `bfcc519`, `6d8935f` (do Arquiteto, só documento); `972d11b`
(meu, o L64 desta rodada).

| arquivo | o que mudou nele |
|---|---|
| `src/data/condicoes.json` | `fora-do-tempo` troca `velocidade: -99` por `naoAge: true` |
| `src/lib/mesa-core.ts` | `Condicao.naoAge?: boolean`; `somarCondicoes` devolve a marca separada da grandeza; `condChipHTML` mostra "não age" em vez de "vel -99" |
| `src/pages/mesa/combate.astro` | `avancarTick` lê `cd.naoAge` antes da conta do Tick, em vez de depender da saturação do -99 |
| `src/pages/mesa/referencia.astro` | `modEfeito` mostra "não age" em vez de "Velocidade -99" |
| `scripts/test-artes-grid.mjs` | a asserção de `foraDoTempo` reescrita: afirma a marca, não mais `velocidade <= -50` |
| `scripts/test-l64-velocidade.mjs` | novo, a separação (catálogo, soma, as duas telas) e a asserção contra teto6 prematuro |
| `package.json` | `test-l64-velocidade.mjs` entra na cadeia do `validate` |
| `src/lib/artes-grid-mesa.ts` | (commit `3eeb8fd`, já avisado) `gravarEfeito`: a rede do fim usa o objeto de fato enviado ao banco, não o de antes da degradação |
| `scripts/test-l86b-acelerar-cura.mjs` | (commit `3eeb8fd`) cena nova: insert degradado sem `data` de volta não ressuscita `nivel_arte` |
| `Auditoria_Tecnica.md` | reaponte de citação (`3eeb8fd`) |
| `Pendencias.md` | reaponte de citação e marcação `(citação histórica)` (`3eeb8fd`, `972d11b`); registro do CORRIGE e das duas decisões de mesa de 12/09 (`9e28abe`, `bfcc519`, `6d8935f`, do Arquiteto) |
| `docs/simulacao/ARQUITETO.md` | (commit `bfcc519`, do Arquiteto) nota de instrumento sobre sequência de correções |
| `docs/simulacao/CONTEXTO.md` | (commits `9e28abe`, `6d8935f`, do Arquiteto) estado da rodada 56 fechada e as duas decisões de 12/09 |
| `docs/simulacao/CONTRATO-REVISORA.md` | (commit `9e28abe`, do Arquiteto) novo, a régua da reclassificação ESCALA→CORRIGE |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `23` | asserções verdes em `test-l64-velocidade.mjs` | `node scripts/test-l64-velocidade.mjs` |
| `naoAge: true` | a marca de `fora-do-tempo`, substituindo `velocidade: -99` | `src/data/condicoes.json:262` |
| `naoAge?: boolean` | o campo novo na interface `Condicao` | `src/lib/mesa-core.ts:177` |
| `cd.naoAge ? antes : ...` | o consumidor lendo a marca antes da conta do Tick | `src/pages/mesa/combate.astro:1411` |
| `287` | citações de código conferidas pela âncora, zero quebrada | `npm run validate` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | O nome do campo novo, `naoAge` (deixado a meu critério pela rodada). | se uma rodada futura preferir outra palavra, é busca e troca em quatro lugares (`condicoes.json`, `mesa-core.ts` ×2, `combate.astro`, `referencia.astro`), sem migração nem persistência envolvida (o campo vive só no catálogo estático). |
| D02 | `somarCondicoes` combina `naoAge` por OU e soma `velocidade` por número, INDEPENDENTES: quando um combatente tem `fora-do-tempo` e uma condição de grandeza real juntas, o retorno carrega as duas coisas cheias (marca true, número diferente de zero), e é o CONSUMIDOR quem decide dar precedência à marca. | se um consumidor novo ler `cd.velocidade` sem checar `cd.naoAge` primeiro, reproduz a confusão que o L64 resolveu, só que por esquecimento em vez de aritmética. Hoje só existe um consumidor (`avancarTick`), e ele checa; um segundo que não confira não tem guarda de tipo que avise. |
| D03 | As 4 citações que o `reapontar.mjs` não conseguiu mover (texto reescrito de propósito, não deslocado) marquei `(citação histórica)` à mão, e para manter a frase gramatical troquei tempo verbal ao redor da citação ("é"→"era", "afirma"→"afirmava") em prosa que é do Arquiteto, não minha. | é mexida em texto autoral de outra frente, não só na citação técnica; se a redação não servir, é reversão de frase, não só de número. |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **`teto6` continua desligado, de propósito.** A separação é o chão para
  ele, não o teto em si. Decisão futura, do humano, sobre quando construir.
- **O Grid continua sem ler `velocidade`/`naoAge`.** "Fora do tempo" não faz
  nada com o relógio no sistema Simultâneo hoje, e decidir o que "não age"
  faz com a agenda do Tick ali (sai da fila? fica e perde a vez? por quantos
  Ticks?) é desenho de regra que não está escrito em lugar nenhum, fora do
  escopo desta rodada por decisão explícita do Arquiteto e do humano.
- **Conferência fraca, por texto, em dois pontos**: `modEfeito`
  (`referencia.astro`) e `avancarTick` (`combate.astro`) só existem dentro
  de `.astro`, e o esbuild não os importa como módulo de Node. A prova ali é
  regex contra o código-fonte, não chamada real; prova que o código está
  escrito certo, não que ele roda certo. `condChipHTML`, que vive em
  `mesa-core.ts`, teve prova real (chamada, não texto).
- **A migração 38 da rodada 56 continua escrita e não rodada** (fila 33, 37,
  38), sem relação com o L64; citado aqui só porque está no mesmo intervalo
  avisado.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-57-l64.md` · sinal de vida completo: a
  varredura que achou os dois leitores de tela, a decisão do Arquiteto sobre
  escopo, a implementação e as três leituras do ensaio (vermelho/verde/
  vermelho de novo com a regressão de propósito).
- `docs/simulacao/caixa/progresso-56b-gravarefeito.md` · o CORRIGE do
  commit `3eeb8fd`, já avisado por mensagem antes deste aviso existir.
- `Pendencias.md` · §L64 (a separação, com as citações agora marcadas
  `(citação histórica)` onde o texto mudou de propósito, não só de linha).
