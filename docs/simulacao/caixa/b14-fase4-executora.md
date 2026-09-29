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
5. `659979d0` · relato de andamento e pendências K36/B16.
6. (este commit) · decisão do autor sobre o ritmo: as ~52 fichas dos graves mecânicas
   (ataque, atributo, elemento, porte/peso), mais Balor/Diabo do Fosso/Kraken (as três
   âncoras da Fase 5 que precisavam sair da lista das "sem nota"), mais o Basilisco (tinha
   ficado com `arte` redundante, igual o Aboleth). As outras 38 sem nota viram pendência
   B17, aplicação em rodada própria com arquivo que o autor vai mandar.

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

**19 criaturas** com Arte revertida para poder natural: as 16 do lote 1 (Deva Astral,
Diabo Barbado, Diabo de Gelo, Djinn, Efreeti, Elemental da Terra Grande, Esfinge
Ginosfinge, Fogo-fátuo, Gigante da Tempestade, Gigante das Nuvens, Salamandra, Sátiro,
Sombra, Tarrasca, Treant, Aboleth) mais **Balor, Diabo do Fosso (Pit Fiend) e Kraken**,
convertidos agora por serem as três âncoras da Fase 5 que precisavam sair da lista das
"sem nota", com a mesma qualidade das 16 (descrição em texto próprio, que o Mestre usa
sozinho, sem citar número de D&D). O Basilisco também perdeu o campo `arte` redundante
(já tinha o poder convertido e com descrição desde antes; só sobrava o campo morto).
Nenhuma das 19 está na lista de quem conjura como classe (dragões, Lich, Couatl, Ninfa,
Planetar, Solar, Ghaele, Rakshasa, Naga); os números (arte/nível) que já estavam gravados
viraram parâmetro (`base`) dos poderes naturais, sem portão de Centelha nem custo de Mana.
28 poderes naturais novos ou ajustados no total, todos com `descricao` em texto próprio.

Para Balor/Diabo do Fosso/Kraken especificamente: usei o `arte` que já estava gravado
como parâmetro (fogo N4/N5 do Balor; fogo N6/fortuna N6/espírito N4/morte N3 do Diabo do
Fosso; vento N6/fascinação N5/raio N4/água N4 do Kraken, este com apoio extra do
`artes-criaturas.md`, que já tinha "Lightning Storm" e "dominate monster só em animais"
documentados para ele) e escrevi a descrição a partir das próprias `habilidades` já na
ficha (teleporte, feitiços supremos, tempestade de raios, dominar bestas do mar). Onde não
havia base textual nenhuma (fascinação N5 do Diabo do Fosso, conjuração N6 do Diabo do
Fosso), não inventei poder: a Arte foi descartada sem virar nada.

**Onde uma nota dos graves dizia "conjuração de verdade, dentro da Centelha N"** (Deva
Astral, Diabo de Gelo, Esfinge Ginosfinge): isso foi escrito antes do despacho desta rodada
fechar a lista de quem fica caster; o item 3 desta fase revê essa parte das notas
anteriores, como o próprio despacho avisa ("isto revê a fase 3"). Registrado aqui para
quem ler o histórico depois.

**Centelha e Inteligência de 11 criaturas** ajustadas pela regra do autor (Centelha é eixo
próprio, não sai do CR): Basidirond, Pudim Negro, Corujurso, Froghemoth, Mantícora e Montão
Tropecante foram a Centelha 0; Cauchemar, Tarn Linnorm, Giant Slug, Giant Wasp, Mantícora e
Montão Tropecante tiveram a Inteligência corrigida pela fonte.

**A parte MECÂNICA das notas dos graves** (ataque, atributo, elemento, porte/peso,
deslocamento) aplicada em mais **37 fichas** que ainda não tinham recebido essa parte:
Objeto Animado, Anquilossauro, Vinha Assassina (+poder Emaranhar), Basidirond,
Braquiossauro, Cauchemar (+ataque de mordida, +imunidade a fogo), Couatl, Crag Linnorm,
Cubo Gelatinoso (+poder Paralisia ao toque), Leão Atroz, Froghemoth, Fantasma (+poderes
Possessão e Telecinese), Rã Gigante, Lesma Gigante, Girallon, Cavalo, Golem de Gelo,
Perseguidor Invisível (nome em português, era Invisible Stalker), Golem de Ferro, Arconte
Lanterna (+poderes Aura de ameaça, Círculo contra o mal, Teleporte), Mantícora, Marid,
Montão Tropeçante, Nabasu (+poderes Toque que envelhece, Sombras, Fascinar), Pesadelo
(+poder Viagem entre planos), Pônei, Cão de Montaria, Roper, Campeão Esquelético (nome
novo, era Skeletal Champion), os quatro Elementais Pequenos, Estegossauro, Golem de Pedra,
Tarn Linnorm (+ataque de cauda), Trol, Arconte Trombeta. Onde a nota pedia um tipo de dano
ou resistência fora do vocabulário fechado (ácido, ferro frio, prata, adamantina, "imunidade
a magia", "efeitos mentais"), NÃO inventei palavra nova: registrado em detalhe na B16.

## Item 3/4/8 · o que FALTA (pendência explícita B17, decisão do autor sobre o ritmo)

- **38 criaturas com Arte gravada que NÃO têm nota nos graves**, listadas por completo na
  pendência **B17** (`docs/pendencias/B-bestiario.md`): `mon-aranha-das-fases,
  mon-archon-cao, mon-assombracao-wraith, mon-behir, mon-besta-deslocadora, mon-bodak,
  mon-bruxa-verde-hag, mon-ciclope, mon-cocatriz, mon-diabo-osseo, mon-diabrete-imp,
  mon-doppelganger, mon-dretch, mon-driade, mon-erinia, mon-espectro, mon-ghast, mon-ghoul,
  mon-glabrezu, mon-gorgona-touro-de-ferro, mon-harpia, mon-hezrou, mon-lamia,
  mon-marilith, mon-medusa, mon-monstro-da-ferrugem, mon-mumia, mon-ogro-mago-oni,
  mon-pegaso, mon-pixie, mon-quasit, mon-quimera, mon-sucubo, mon-unicornio, mon-vampiro,
  mon-vrock, mon-wight, mon-xorn`. Decisão do autor (29/09): ele vai mandar um arquivo
  pronto com efeito, usos, resiste e descrição de cada poder; aplicação em rodada própria,
  fora desta Fase 4.
- **~30 das 67 fichas dos graves** ainda com pedaços da nota mecânica não conferidos linha
  a linha contra o texto original (a maioria já recebeu ataque/atributo/elemento; alguns
  poderes extras que as notas citam de passagem podem ter ficado de fora). Não é uma lista
  fechada; peço conferência cruzada na revisão.
- **~95 poderes naturais (contagem antes deste lote) ainda sem `descricao`** de fases
  anteriores que não vieram de Arte revertida (golems, elementais pequenos etc.); o número
  exato muda com este commit (28 a mais ganharam descrição agora); contagem nova no
  próximo relato.
- **Vocabulário fechado sem "ácido", "ferro frio", "prata"/"bem" (resistência contornada),
  "adamantina", "imunidade a magia" e "efeitos mentais"**: registrado em detalhe na B16,
  com a lista de toda criatura que esbarrou nisso até agora.

## Pendências registradas em `docs/pendencias/`

- **K36** (`K-combate-linha-do-tempo.md`): o mecanismo de dano fenômeno das Artes não
  alcança ataques normais de criatura; Fantasma/Sombra ficam sem essa marca até decidir.
- **B16** (`B-bestiario.md`): tipos de dano/resistência fora do vocabulário fechado
  (ácido, ferro frio, prata/bem, adamantina, imunidade a magia, efeitos mentais).
- **B17** (`B-bestiario.md`): as 38 criaturas com Arte sem nota dos graves, aplicação
  adiada para rodada própria por decisão do autor.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build`: verdes em todos os commits desta
  fase, incluindo este lote.
- `test-editor-bestiario.mjs` e `npm run espelho`: rodados e verdes neste lote também
  (o `validate` sozinho não cobre esses dois, e o bestiário alimenta os dois). Achei e
  corrigi no caminho um teste que ficou desatualizado pela minha própria mudança: o Cubo
  Gelatinoso perdeu a resistência a corte/perfuração (por decisão dos graves) e
  `test-elementos-combate.mjs` ainda esperava essa resistência; troquei o exemplo de
  resistência para o Rakshasa (que eu não toquei) e acrescentei uma checagem nova, do
  Cubo Gelatinoso com `imunidades`, cobrindo o campo novo desta fase.
- CI do GitHub: `cb2381c3`, `6ea979bc`, `a4d53bdc` e `659979d0` fecharam 100% verdes (os
  dois workflows, conferido por `gh run list --json conclusion`). `0cdc06db` (este lote)
  está na fila quando escrevo isto; vou conferir antes de considerar a fase fechada de
  verdade.
- Travessão: zero em todo texto novo desta fase (conferido arquivo por arquivo, não por
  `git diff` puro).

## Ritmo

O Arquiteto trouxe a decisão do autor: fazer agora a parte mecânica dos graves (feito
acima) e só Balor/Diabo do Fosso/Kraken das 42 sem nota (as âncoras da Fase 5), com as
outras 38 virando pendência B17 para uma rodada própria. Aplicado como pedido.

## É seguro dar `/clear`?

Ainda não: falta a Fase 5, que só pode começar agora que Balor/Diabo do Fosso/Kraken estão
convertidos. Vou confirmar o CI deste lote e seguir para a Fase 5 (começando pelas
âncoras, "pare e relate" antes das 309 criaturas, como o despacho pede).
