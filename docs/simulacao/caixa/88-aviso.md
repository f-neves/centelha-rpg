# Rodada 88 · aviso de revisão · rodada 87 (nunca revisada) + leitura de novato + um P0

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `a6e7e41` · último ponto que a Revisora deu PROCEDE (fechamento da rodada 86) |
| **SHA do trabalho** | `4450055` · a faixa é `a6e7e41..4450055`, trinta commits fora do lore/mapas |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `4450055`, conferido por `git rev-parse origin/main` ao escrever |

**Faixa incomum, e digo por quê.** Ela carrega DUAS rodadas de trabalho diferentes, de duas
sessões de Arquiteto diferentes, nenhuma delas revisada ainda, mais um bug de produção achado e
corrigido no meio do caminho. Trato as três partes separadas abaixo. Não são a mesma decisão nem
o mesmo tipo de julgamento.

**O que NÃO está nesta faixa, e não deve ser revisado:** `96e4188` e `25ec785` (a ferramenta do
mapa, `lore/mapas/`, frente do Cartógrafo, sessão paralela, árvore própria). O `git diff --stat`
abaixo já foi tirado excluindo `lore/mapas/` e os arquivos de comando/skill do Cartógrafo.

## Parte 1 · Rodada 87, da sessão anterior, nunca chegou a revisão

`fe09550` até `7d263e3` (nove commits: `fe09550 cc1724d 3b7e210 e94cdb6 3dd2ac6 b903a26 7d263e3`,
mais `6cf5449` que já é um ajuste avulso sobre o mesmo teste). Despacho em `87-despacho.md`
(aberto com um carimbo de premissa derrubada por medição, leia o carimbo antes do resto do
arquivo), relato em `87-executora.md`, progresso em `progresso-87.md`.

**O que ela faz, em uma linha por grupo:**
- **Grupo 1** · `test-grid.mjs` tinha um `break` mudo que pulava cinco asserções de movimento sem
  avisar, então o portão dizia verde sem ter rodado a metade do que anunciava. Conserto em
  `e94cdb6`.
- **CORRIGE da rodada 86** · a Vontade da Sora na especificação (fonte do erro que a Revisora
  achou na 86), o termo da régua fora de onde não entra (`3dd2ac6`), e outros ajustes menores.
- **O Antecedente** · deixou de ser bônus de jogada e passou a descontar passos da Régua de
  Relação (`b903a26`). É mudança de regra de jogo, publicada, nunca revisada.

**Julgue por inteiro**, como se fosse a primeira vez (porque é): o `test-grid.mjs` de verdade
cobre agora o que diz cobrir, o Antecedente novo bate com o que `antecedentes.md` descreve, e os
CORRIGE da 86 realmente fecham o que a Revisora apontou naquela rodada (compare contra
`86-revisora.md`, que é o veredito original).

## Parte 2 · Leitura de novato: 56 achados, balde B e C fechados, dois redesenhos grandes

`85a97fe` até `d31ab72` (o grosso do lote), decisões registradas item a item em
`docs/simulacao/caixa/leitura-de-novato-decisoes.md` (674 linhas, seções `§1` a `§4f`, cada uma
com o texto original do site, a inconsistência e a resolução escolhida pelo humano). Esse arquivo
é a fonte de verdade das decisões; os commits abaixo são a execução delas.

**Veneno** (`034d002`) · `src/data/venenos.json` novo, modelo de pool por intervalo em vez de
dose fechada, quarta via de entrada (`toque`, penalidade fixa −4 de Potência), reescrita de
`acoes-resistir.md`. Compare o JSON contra a tabela do `§ Veneno` do documento de decisões,
número por número.

**Três itens do balde B** (`89bdddf`) · Meio-Orc (`racas.json`: relação social vira Antipatia,
Frenesi contido corrigido para "ignorando as penalidades de ferimento"), espada Excepcional
(`acoes-oficio-e-mundo.md`, célula corrigida para ~15 semanas). Confira contra `§4a`.

**Limiares de Ferimento, o redesenho grande** (`2b08d7a` capítulo, `9d0c54a` Frenesi,
`0934136`+`6e8651e` mesa) · de 6 estados com penalidade só em ponto para 5 estados com moeda
mista: Machucado é ponto (−2/−2), Grave e Crítico são dado (−1d6/−4, −2d6/−8), piso de 1d6 no
pool. **Isto é o que eu mais quero que você aperte**, porque atravessa capítulo, `regras.json` e
`mesa-core.ts` (arquivo normalmente exclusivo da frente da mesa; autorizei a travessia por ser
decisão minha, registrada em `§4f`, não a frente da mesa mexendo em território alheio). Confira:
- `regras.json` → `ferimentos`: os 5 tiers batem com a tabela do `§4b`/`§4f`?
- `mesa-core.ts`: `penTexto`, `tierCls`, o sentinela `penAcao == null` para Incapacitado, ainda
  fazem sentido com o campo novo `penAcaoDados`?
- `ajAtq` (`grid.astro`) e `ataqueAtual` (`combate.astro`): o `penAcaoDados` do ferimento soma
  certo com o `dados` que o Desgaste já contribuía, sem duplicar nem substituir?
- Frenesi/Frenesi Contido (`racas.json`, `racas.md`): o comportamento por grau bate com `§4c`?

**Escalar/Nadar** (`73c4874` nota de documentação, `c494958` redesenho de Nadar, `d31ab72`
fechamento) · Nadar deixou de ser teste sempre; água calma virou Vel. de Natação derivada
(`1 + Vigor×¾ + (Atletismo+Natação)÷2`), curva de carga própria (corte 0,5, expoente 2). Confira
contra `§4e`: a fórmula em `calc.ts`/`regras.json` bate com o texto decidido, e as três águas
bravas que sobraram como teste (Dif 11/14/18) não usam a curva nova (decisão explícita de não
duplicar calibração).

## Parte 3 · Um P0 de produção, achado no meio do caminho, já corrigido e no ar

**Não estava em nenhum despacho.** A Executora achou isto tentando recoletar a fixture de testes
depois de mexer no piso de dado (abaixo). Peço atenção extra aqui porque foi corrigido rápido,
sob pressão de ser produção, e é exatamente onde revisão rápida vale mais.

`888a196` · `roladaManual` (`src/lib/rolagem.ts`, introduzida `045f491` em 06/09/2026) tinha uma
guarda que decidia "este número é o TOTAL pronto (arma sem dado) ou é UMA FACE" testando se a
string da expressão contém `d6`. Uma arma cujo bolo nasce zero dado ainda é escrita como `"0d6
+N"` (tem a substring), então a guarda nunca disparava: o total pronto era lido como se fosse uma
face, e o fixo da arma somava por cima de novo. **Qualquer combatente com o bolo de acerto ou
dano em zero dado (Atributo+Perícia ≤ 1, ou agora Grave/Crítico empilhado) acertava/causava o
dobro do bônus fixo devido, desde 06/09/2026.** Doc completo, com a investigação inteira, em
`docs/simulacao/caixa/p0-roladamanual-flat-dobrado.md`.

**Julgue**: a correção testa o pool ajustado de verdade em vez do texto da expressão — confira
que essa é mesmo a fonte certa de verdade (compare com o que `rolarExpr`/`rolarAcerto` usam pra
decidir quantos dados rolar), e que as 3 asserções novas em `test-rolada-manual.mjs` cobrem o
caso que quebrava (`"0d6 +N"`) e o caso saudável (pool 1+ dado não pode virar falso positivo da
mesma guarda).

**Depois, item 6 de `§4f`** (`4ea9c29` doc do achado 2, `4450055` fechamento) · o piso de
`rolarExpr` deixou de zerar incondicionalmente e passou a segurar em 1 dado quando a parada base
já tinha 1+ dado. No caminho, a recoleta pós-P0 achou uma SEGUNDA lacuna, não relacionada: o Gate
de Perfuração só existe em `grid.astro`, `resolverGolpe` não o modela (achado catalogado,
`CATALOGO.md`, "dois lugares decidem dano"). Decidi excluir da comparação de dano em
`test-lance.mjs` os lances `gate && perfurante` resvalando (nos dois vereditos, acerto e
raspão), em vez de ensinar `resolverGolpe` sobre o gate agora (mudaria contrato compartilhado por
um motivo fora do escopo desta rodada). **Julgue** se essa exclusão é cirúrgica ou esconde algo
que não devia: ela precisa cobrir só os casos onde o zero vem do gate, não abrir uma porta pra
qualquer divergência futura passar despercebida.

## O que fica de fora do seu escopo nesta rodada

- **`lore/mapas/`** inteiro, e os arquivos de comando/skill do Cartógrafo · frente paralela,
  árvore própria, não revisado por você nunca.
- **A regra completa de ativação/duração/custo do Frenesi** (só o comportamento nos Limiares foi
  decidido, `§4c` mesmo diz isso explicitamente) e **dano localizado** (adiado a pedido do
  humano). Os dois estão registrados como pendentes de propósito; não são omissão para achar.
- **A travessia de `mesa-core.ts`** já está autorizada (ver Parte 2); não é um "a Executora entrou
  onde não devia" para reportar, é decisão registrada do Arquiteto.

## O de sempre

Veredito em `docs/simulacao/caixa/88-revisora.md`, commitado por você com pathspec e empurrado
antes de avisar. Me diga o sha e o `git rev-list --count origin/main..HEAD`. Progresso incremental
em `progresso-revisora-88.md`, uma linha por etapa, hora lida da máquina no instante em que fecha.

**Uma árvore suja que não é sua nem minha:** `docs/simulacao/caixa/jogador-novo-bestiario.md`, não
rastreado, de uma sessão fora do arranjo. Não encoste.
