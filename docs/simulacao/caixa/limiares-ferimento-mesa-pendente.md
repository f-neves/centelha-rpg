# Limiares de Ferimento: o capítulo já está no modelo novo, a mesa ainda não

Achado ao implementar o item 3 do dispatch de 22/09/2026 (redesenho dos Limiares de Ferimento,
`docs/simulacao/caixa/leitura-de-novato-decisoes.md` §4b).

**O que já mudou** (`src/content/chapters/vida-ferimentos-cura.md`): a tabela de Limiares agora
tem 5 estados (Saudável/Machucado/Grave/Crítico/Incapacitado), com a moeda mista decidida pelo
Arquiteto: Machucado é ponto (−2 ação, −2 Defesa Física), Grave e Crítico são dado (−1d6/−2d6,
−4/−8 Defesa Física), piso do pool em 1d6.

**O que eu esperava e não achei**: a decisão registrada dizia "nenhum dos campos calculados
(Defesa Física, pool de ações) lê estado de ferimento ainda" — **isso está errado**. Existe
implementação de verdade: `src/data/regras.json` → `ferimentos` (array de 6 tiers, com o estado
"Ferido" que a decisão eliminou) e `src/lib/mesa-core.ts` (`tierDe`, `FERIMENTOS`, `penTexto`,
`estadoChipHTML`, `atualizarBarra`), consumidos pelo Grid/Escudo do Mestre para mostrar o chip de
estado e a penalidade de ação/Defesa do combatente. `mesa-core.ts` é arquivo exclusivo da frente
da mesa (`CLAUDE.md`: "`src/lib/mesa-*.ts` é só da frente da mesa").

**Por que parei aqui**: a `interface Tier` de `mesa-core.ts` só tem `penAcao`/`penDefesa`
numéricos — um ponto flat, nunca dado. A Defesa Física dá pra migrar sem drama (é flat nos dois
modelos: velho −1/−2/−3, novo −2/−4/−8). A ação física não: o modelo novo quer **dado** (−1d6/
−2d6) em Grave/Crítico, e não existe campo pra isso hoje. `penAcao == null` já é usado como
sentinela de "fora de combate" (`penTexto`), então zerar ou anular o campo pra Grave/Crítico
quebraria esse sentinela, não representaria "tira 1d6 do pool".

**Não fiz**: não editei `regras.json` nem `mesa-core.ts`. Renumerar `regras.json` sem migrar o
consumidor deixaria rótulo e número incoerentes de novo (o mesmo defeito que a rodada estava
corrigindo); editar `mesa-core.ts` é território da frente da mesa.

**Próximo passo, para quem pegar isto**: decidir o formato do campo novo (`penAcaoDados`? um
`penAcao` que aceita `{ pontos }` ou `{ dados }`?) e propagar em `regras.json` + `mesa-core.ts` +
onde o Grid de fato reduz o pool de ação (`grid.astro`, ainda não localizado). Até lá, a mesa
mostra a tabela de 6 estados (com "Ferido") e penalidade em ponto puro; o capítulo mostra a de 5
estados com dado. Divergência conhecida, registrada aqui.
