# B14 Fase 4 (dados do bestiário) · relato de andamento

29/09/2026. Despacho: `docs/simulacao/caixa/b14-cr-desafio-fase4-5-despacho.md` (com os
Adendos 1, 2 e 3). Este relato cobre o que está feito até agora, em commits separados; a
Fase 4 ainda não fechou (faltam pedaços dos itens 3/4/8, listados no fim).

## Commits desta fase

1. `c9beedc2` (mais `docs/simulacao/caixa/b14-cr-desafio-fase4-5-despacho.md` no repo).
2. `cb2381c3` · item 3/4/8, lote 1: 15 criaturas com Arte revertida para poder natural.
3. `6ea979bc` · Adendos 2 e 3: Tarn Linnorm/Girallon, exibição de locomoção e poderes.
4. `a4d53bdc` · item 3/4/8, lote 2: Aboleth (faltou no lote 1) e Centelha/Inteligência/peso
   de 11 criaturas dos graves.

## Item 1 · `fonte.cr`/`fonte.crConf` (feito, commit `c9beedc2`)

Gravados nas 309 fichas, a partir de `../tmp/arquiteto/b14-cr-desafio.json` (só `cr`/
`conf`; as colunas A/B/C proposta não foram usadas). Elefante corrigido (`mon-elefante.json`
já tinha conteúdo de elefante, só o nome no topo dizia "Mamute"); Mastodonte ganhou
"(Mamute)" no nome, sem ficha nova. Rato Gigante: atributos eram do rato comum, corrigidos
para o Dire Rat de verdade (Força 2, Destreza 5, Vigor 3, pela curva de conversão do
método salvo em memória).

## Item 2 · Centelha isolada (feito, commit `c9beedc2`)

Só o Worg mudou de verdade (Centelha 2→1); Orc Força e Roper Centelha já estavam nos
valores que o despacho pede.

## Item 5 · Imunidade (feito, commit `c9beedc2`)

Regra nova em `regras.json`, ao lado de fraqueza/resistência. Campo `imunidades` no schema
da criatura (mesmo vocabulário fechado), com fio até o dano de verdade (`danoNoAlvo` em
`artes-grid.ts`: dano zero, e a coexistência com fraqueza pelo mesmo tipo se cancela) e até
os quatro lugares que já liam fraqueza/resistência (`BestaCard`, `BestiaEditor` com um 4º
estado no botão, `mesa-bestiario.ts`, `criaturas.astro`), tudo pela fonte única
`elementosCombate()` (`mesa-core.ts`). Nenhuma criatura tem `imunidades` ainda: é trabalho
do item 8 (graves), abaixo.

## Item 6 · Constructo (feito, commit `c9beedc2`)

Conferido que nenhum código de combate hoje rola teste de Vigor, Resistência ou Virtude
para criatura nenhuma (grep vazio no motor da mesa); não há o que desligar. Só faltava a
flag `constructo:{semVida:true}` no Espantalho de exemplo, corrigida.

## Item 7 · Fantasma/Sombra, dano fenômeno (NÃO IMPLEMENTADO, registrado como pendência)

Fui atrás de onde "a regra das Artes já prevê" o dano fenômeno (armadura não absorve, só a
Centelha absorve) e achei que esse mecanismo existe **só** dentro do motor de Artes do
Grid (`danoNoAlvo`, `materia: null`). Não há hoje nenhum jeito de um ataque **normal** de
criatura (o `ataques[]` da ficha, resolvido por `combate-resumo.ts`/`lance.ts`, não pelo
motor de Artes) carregar essa marca. Não inventei campo novo no schema de ataque: isso é
decisão de regra fora do que o despacho cobre. Registrado como pendência nova em
`docs/pendencias/K-combate-linha-do-tempo.md` (ver seção de pendências abaixo).

## Adendo 2 (feito, commit `6ea979bc`)

Tarn Linnorm com as medidas da fonte (36 m, 11.000 kg, arredondado de "cerca de 11 t").
Girallon Centelha 4→1.

## Adendo 3 · exibição (feito, commit `6ea979bc`)

Locomoção no card (só os modos que a criatura tem, m/Tick); poderes naturais visíveis no
card fechado (nome, usos por extenso, resiste, descrição); texto do topo do `/bestiario`
reescrito. Achado e corrigido no caminho: `gen-monsters.mjs` nunca copiava `descricao` do
poder para o `monsters.json`, então nenhum poder aparecia com descrição em lugar nenhum do
site, mesmo os que já tinham. **Prova no `dist/` gerado** (não só no código):

- Card do Roc: `<p class="besta-porte besta-loco"><span class="pt-lbl">Desloc.</span>
  <span>Terra 2 m/Tick</span><span class="pt-sep">·</span><span>Voo 8 m/Tick</span></p>`
- Card do Basilisco: `<span class="pn-nome">Olhar petrificante</span><span class="pn-meta">
  por cena · resiste corpo</span><span class="pn-desc muted">Quem cruza o olhar do
  basilisco tem de resistir...</span>`, no card FECHADO, sem abrir o flutuante.

## Item 3/4/8 · o que está feito

**16 criaturas** com Arte revertida para poder natural (Deva Astral, Diabo Barbado, Diabo
de Gelo, Djinn, Efreeti, Elemental da Terra Grande, Esfinge Ginosfinge, Fogo-fátuo, Gigante
da Tempestade, Gigante das Nuvens, Salamandra, Sátiro, Sombra, Tarrasca, Treant, Aboleth).
Nenhuma está na lista de quem conjura como classe (dragões, Lich, Couatl, Ninfa, Planetar,
Solar, Ghaele, Rakshasa, Naga); os números (arte/nível) que já estavam gravados viraram
parâmetro (`base`) dos poderes naturais, sem portão de Centelha nem custo de Mana. 22
poderes naturais novos ou ajustados, todos com `descricao` em texto próprio.

**Onde uma nota dos graves dizia "conjuração de verdade, dentro da Centelha N"** (Deva
Astral, Diabo de Gelo, Esfinge Ginosfinge): isso foi escrito antes do despacho desta rodada
fechar a lista de quem fica caster; o item 3 desta fase revê essa parte das notas
anteriores, como o próprio despacho avisa ("isto revê a fase 3"). Registrado aqui para
quem ler o histórico depois.

**Onde uma Arte do campo antigo não tinha nenhuma habilidade correspondente na ficha**
(luz N4 e forças N4 do Deva Astral; proteção N3 do Diabo de Gelo e da Esfinge Ginosfinge;
água N3 e adivinhação N2 do Aboleth), **não inventei poder**: a Arte foi descartada sem
virar nada, por falta de base textual.

**Centelha e Inteligência de 11 criaturas** ajustadas pela regra do autor (Centelha é eixo
próprio, não sai do CR): Basidirond, Pudim Negro, Corujurso, Froghemoth, Mantícora e Montão
Tropecante foram a Centelha 0; Cauchemar, Tarn Linnorm, Giant Slug, Giant Wasp, Mantícora e
Montão Tropecante tiveram a Inteligência corrigida pela fonte. Peso/porte de Anquilossauro,
Vespa Gigante, Pudim Negro e Corujurso corrigidos.

## Item 3/4/8 · o que FALTA (pendências explícitas, não decidi cortar sozinha)

- **42 criaturas com Arte gravada que NÃO têm nota nos graves.** Precisam da mesma
  reversão para poder natural (item 3), com `resiste`/`efeito`/`descricao` decididos por
  mim, sem uma nota que já diga o parâmetro certo. Lista: (as 61 do levantamento original,
  menos as 19 já feitas: 16 do lote 1 + Aboleth do lote 2, menos os 42 que restam)
  `mon-aranha-das-fases, mon-archon-cao, mon-assombracao-wraith, mon-balor, mon-basilisco
  (só faltava descrição, já feito), mon-behir, mon-besta-deslocadora, mon-bodak,
  mon-bruxa-verde-hag, mon-ciclope, mon-cocatriz, mon-diabo-do-fosso-pit-fiend,
  mon-diabo-osseo, mon-diabrete-imp, mon-doppelganger, mon-dretch, mon-driade, mon-erinia,
  mon-espectro, mon-ghast, mon-ghoul, mon-glabrezu, mon-gorgona-touro-de-ferro, mon-harpia,
  mon-hezrou, mon-kraken, mon-lamia, mon-marilith, mon-medusa, mon-monstro-da-ferrugem,
  mon-mumia, mon-ogro-mago-oni, mon-pegaso, mon-pixie, mon-quasit, mon-quimera, mon-sucubo,
  mon-unicornio, mon-vampiro, mon-vrock, mon-wight, mon-xorn`.
- **~36 das 67 fichas dos graves ainda sem a parte MECÂNICA da nota aplicada**: o nome/tipo
  do ataque natural (a maioria das notas pede algo como "ataque vira cauda em maça,
  impacto, com atordoamento"), fraqueza/resistência/imunidade de elemento, e alguns
  poderes naturais novos que as notas pedem além dos que já apliquei (Emaranhar da Vinha
  Assassina, poderes do Cubo Gelatinoso, do Girallon etc.). Não toquei ainda porque cada
  ataque renomeado pede decidir dado/acerto/notas com cuidado, não é cópia mecânica.
- **~95 poderes naturais no total (contagem feita hoje) ainda sem `descricao`**, contando
  os que já existiam de fases anteriores e não são do lote de Arte revertida (ex.:
  Basilisco, que eu corrigi como prova do Adendo 3, mas há muitos outros: golems, elementais
  pequenos, etc.). O item 4 pede descrição em TODO poder natural, não só nos que vieram de
  Arte.
- **"Ácido" e outros tipos de dano fora do vocabulário fechado** (achado processando o
  Pudim Negro): pelo menos uma nota dos graves fala em dano de ácido como "dano
  principal", e "ácido" não está no vocabulário de `fraquezas`/`resistencias`/`imunidades`
  nem é um dos três tipos físicos (corte/perfuração/impacto). Não inventei palavra nova,
  conforme o item 8 do pedido original ("Resistências novas... só anote em pendência").

## Pendências registradas em `docs/pendencias/`

- **K36** (`K-combate-linha-do-tempo.md`): o mecanismo de dano fenômeno das Artes não
  alcança ataques normais de criatura; Fantasma/Sombra ficam sem essa marca até decidir.
- **B16** (`B-bestiario.md`): "ácido" (e possivelmente outros tipos das notas dos graves,
  ex. "necrótico" já resolvido como dreno de Força) fora do vocabulário fechado de
  elemento; registrar antes de inventar palavra nova.

(Os dois ainda serão escritos no próximo commit desta fase, junto com o resto do lote
mecânico, para não fragmentar o `Pendencias.md` regenerado em excesso.)

## Verificação até aqui

- `npm run validate`, `npx tsc --noEmit`, `npm run build`: verdes em todos os 4 commits.
- `test-editor-bestiario.mjs` e `npm run espelho`: rodados e verdes em todos os 4 commits
  (o `validate` sozinho não cobre esses dois, e o bestiário alimenta os dois).
- CI do GitHub: os 4 commits foram empurrados; a matriz de Smoke está com fila (vários
  runs em `in_progress` ao mesmo tempo quando escrevo isto). Vou conferir e colar os links
  antes de fechar a fase.
- Travessão: zero em todo texto novo desta fase (conferido arquivo por arquivo, não por
  `git diff` puro).

## Ritmo

Perguntei ao Arquiteto sobre o ritmo dos itens que faltam (42 criaturas sem nota, ~36
fichas com pendência mecânica, ~95 descrições) antes de decidir sozinha cortar escopo.
Ainda sem resposta quando escrevo isto. Continuo disponível para seguir assim que tiver
direção, ou decido eu mesma como fatiar o resto se não vier resposta em tempo razoável,
registrando a decisão aqui.

## É seguro dar `/clear`?

Ainda não: a Fase 4 está em andamento, com pendências grandes e conhecidas listadas acima
(não escondidas). Os 4 commits que já existem estão com portão local verde; falta
confirmar o CI do GitHub (fila) antes mesmo desse pedaço fechar de verdade.
