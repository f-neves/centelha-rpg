# REVISAR — pontos a conferir do Centelha (site V1)

> Origem: gerado por `migrate-to-json.mjs`. Cada item aqui ou foi redigido
> provisoriamente, ou divergia da fonte e pedia decisão humana. Itens já
> resolvidos ficam marcados ✅ como registro histórico.

## Divergências de mecânica

- ✅ **Iniciativa do Kael (RESOLVIDO).** A fórmula é `1d6 + Raciocínio + Prontidão`.
  A divergência antiga ("doc dizia 1d6+6, mas o Kael Centelha 1 com Prontidão 2
  dava +5") **deixou de existir**: o Kael foi rebalanceado para **Centelha 2**
  (exemplo iniciante ~994 XP) com **Prontidão 3**, o que dá **1d6+6** — agora
  consistente com o doc. Derivados atuais do Kael (travados em `scripts/test-kael.mjs`):
  **PV 37 · Defesa 18 · Def. Mental 7 · Energia 24 · Mana 11 · Iniciativa 1d6+6**.

## Técnicas com prosa provisória (pendente:true) — 0

Nenhuma: todas as 398 Técnicas têm prosa vinda do catálogo `.md`.

## Bestiário — stat blocks

Os **21 NPCs** de `src/data/inimigos.json` são **gerados** por `scripts/gen-bestiario.mjs`
a partir de builds compactas — os números (PV, Defesa, Defesa Mental, Soak, Iniciativa
e pools de ataque) são **calculados pelas fórmulas de `regras.json`**, logo são
consistentes por construção.

- ✅ **Saíram de Rascunho:** `pendente` agora é `false` para todos os 21 (commit `1ebd09f`).
  Os builds foram revisados e integrados às regras táticas: o Lobo usa **Flanco −2**
  (matilha), as garras do Urso causam **Sangramento (= Margem, máx 3)** e o veneno da
  Aranha segue a resolução de "efeito de Corpo: Vigor + Convicção".
- ✅ **Regra de Horda CANONIZADA (28/jun/2026).** Deixou de ser proposta: virou regra
  oficial (modelo "esquadrão único" / Magnitude), validada por Monte Carlo
  (`scripts/sim-horda.mjs`). Magnitude = [log2(membros)] soma +Md6 ao acerto E ao dano de
  uma rolagem/rodada; Defesa do bando −2; PV = nº de membros × PV-de-horda do capanga
  (Comum 5 · Treinado 10 · Elite 15, sem o piso heroico de 25); dano acumulado vira
  baixas. Em `regras.json` (`horda`), prosa em `combate.md` (seção "Regra de Horda") e
  callout do `/bestiario` apontando para ela.

Para mexer: editar o gerador e rodar `node scripts/gen-bestiario.mjs`, ou editar o JSON direto.

## Bestiário — expansão do Bestiary 1 (PF): 137 → 308 criaturas

Importadas **171 criaturas** do `D&D/Bestiary 1 (1st Printing).pdf` (fora do repo).
Pipeline (scripts em `scratchpad`, não versionados; recriáveis):
- Parser `pymupdf` extrai cada ficha (Str/Dex/Con/Int/Wis/Cha, CR, tipo, tamanho,
  Environment, texto bruto das habilidades) → **`src/data/conversao-extra.json`** (171 stat
  blocks crus), lido pelo `gen-bestiario.mjs` junto do DATA do `conversao-monstros.html`.
- **Categoria** no molde do Bestiary 1 em **`src/data/categoria-extra.json`** (id→categoria),
  mesclada no `CAT_OVERRIDE` do `gen-monsters.mjs`.
- Habilidades/Lore/Dimensões/Terreno/Clima autoradas (12 agentes) e mescladas nos 4 satélites.
- 149 imagens de `D&D/Bestiary_Pathfinder_nomeado` → `public/bestiario/*.jpg` (600px).
- `gen-bestiario`: porte para PV/couraça agora usa a `size` real da ficha quando não há
  porte em `dimensoes-bestiario.json` (fallback). Imagem virou **opcional** no `gen-monsters`
  (flag `semImagem`, badge "Sem imagem", filtro "Só sem imagem").

**⏳ PENDÊNCIAS desta expansão:**
- **Poderes a mapear:** as 171 novas têm Habilidades descritas, mas SEM mapeamento formal
  para Proezas (Técnicas) / Feitiçarias (Artes). `PODERES` do HTML não cobre elas
  (`Convertidos sem poderes mapeados: 200`).
- **Centelha por heurística:** atribuída por `prep.py` (CR + natureza: mundano=0; senão
  1/2/3/4/5 por faixa de CR). Revisar junto com os Poderes.
- **Idades de dragão NÃO entraram:** as fichas de dragão por idade (Jovem/Adulto/Ancião de
  cada cor) estão em TABELAS de progressão no PDF, formato que o parser não captura (pegou
  uma entrada por dragão). Falta um parser dedicado dessas tabelas. Tamanhos de elemental
  entraram normalmente.
- **22 criaturas sem imagem** (`semImagem:true`): Grizzly Bear, Fire Beetle, Cheetah,
  dinossauros (Brachiosaurus/Elasmosaurus/Pteranodon/Triceratops), Drow Noble, Electric Eel,
  Raven, Toad, Viper, Weasel, Poison Frog, Dracolisk, Nessian Warhound, Bison, Pony, Monitor
  Lizard, Cauchemar, Winter Wolf, Army Ant Swarm. Filtráveis por "Só sem imagem".

## Bestiário — dados unificados em `monsters.json` (arquitetura)

- **Estado atual (modo "gerado"):** a página `/bestiario` lê **só** `src/data/monsters.json`
  (137 criaturas, todas as infos por objeto). Esse arquivo é **gerado** por
  `scripts/gen-monsters.mjs` (roda no `npm run build`), que junta os stat blocks calculados
  (`inimigos.json`, saída do `gen-bestiario.mjs`) com os arquivos-fonte autorais
  (`habilidades-bestiario.json`, `dimensoes-bestiario.json`, `lore-bestiario.json`,
  `imagens-bestiario.json`). Esses 5 arquivos seguem como **fontes editáveis**.
- **⏳ PENDÊNCIA (quando o sistema fechar):** migrar para **fonte única de verdade** =
  editar `monsters.json` direto e **aposentar os 5 arquivos-fonte** (inimigos + os 4
  satélites) mais o `gen-monsters`/`gen-bestiario` (virariam, no máximo, um script opcional
  de "recalcular stats in-place" preservando o que foi escrito à mão). Decisão do usuário:
  fazer isso só ao travar o conteúdo, para não perder o recálculo automático dos stats
  enquanto o sistema ainda muda.

## Bestiário — ecologia (tipo · terreno · clima)

- **Novo satélite `ecologia-bestiario.json`** (por id): `tipo` (taxonomia PF2e, 1 valor),
  `terreno` (array) e `clima` (array). Mesclado pelo `gen-monsters.mjs` em
  `monsters.json` como objeto `ecologia`. Fonte editável à mão, como os outros satélites.
  O `tipo` do topo de `monsters.json` continua sendo o PAPEL de combate (capanga/elite/…);
  a taxonomia fica em `ecologia.tipo` para não colidir.
- Classificação inicial dos 137 gerada por 8 autores em paralelo (rubrica de mapeamento
  PF1e/3.5 → tipos PF2e; ambiente canônico do Pathfinder quando conhecido). Distribuição:
  Humanoid 29 · Beast 19 · Fiend 17 · Animal 15 · Undead 12 · Giant 10 · Dragon 10 ·
  Celestial 6 · Fey 6 · Aberration 5 · Elemental 5 · Plant 2 · Ooze 1.
- **⏳ PENDÊNCIA (visual):** os selos são discos coloridos provisórios (`.eco-ic`). Trocar
  pelos ícones redondos do Pathfinder (extraídos em `D&D/type_icon`, fora do repo). O markup
  do card já está pronto para receber os PNGs sem mexer no dado.

## Bestiário — dano natural, filtros e cards flutuantes

- **Dano natural = Força ×1 (mudança de balanço).** O `ataqueDe` do `gen-bestiario.mjs`
  passou de `mao: 2` para `mao: 1`: o ataque natural de uma criatura soma a Força UMA vez
  (um só membro), pois a Força só dobra ao empunhar arma com vários membros. Isso reduziu
  o bônus de dano de todas as criaturas convertidas (ex.: Aboleth `3d6 +20` → `3d6 +10`).
  Criaturas com muitos membros devem ATACAR VÁRIAS VEZES, não somar mais Força por golpe.
  Explicado no topo da página (callout "Dano natural"). NPCs com arma de duas mãos seguem ×2.
- **`≈` removido** de `dimensoes-bestiario.json` (medida/peso); o "valor médio" agora é
  explicado em callout ("Valores médios") em vez do símbolo.
- **Filtros dinâmicos:** o filtro "Tipo de criatura" passou de `categoria` para o `ecologia.tipo`
  (PF2e), e foram somados filtros de **Terreno** e **Clima**, todos montados dinamicamente do
  JSON (novo valor no dado → aparece no filtro sozinho).
- **Cards flutuantes:** Habilidades, Poderes e Técnicas/Artes/Notas saíram do corpo do card
  para um segundo modal ("Habilidades & Poderes"), irmão do de "Informações", padronizando a
  altura dos cards. Conteúdo clonado de `<template class="mech-tpl">` com estilos `is:global`.

## Bestiário — pendência de balanceamento

- ✅ **Redução de dano (Absorção) por tamanho (RESOLVIDO).** Além do PV, a **Absorção
  natural agora escala com o porte** via `regras.dano.couracaPorte`: uma **Couraça** somada
  **só a Corte/Perfuração** (o Impacto a ignora, seguindo sendo o abridor de lata contra
  massa) e um **Nível de Perfuração natural** (gate) para os maiores. Tabela: Grande +2/RP0 ·
  Enorme +4/RP1 · Imenso +7/RP2 · Colossal +10/RP3 (Médio e menores = 0). Aplicada no
  `gen-bestiario.mjs` (`couracaDe`), com override pontual para bichos "grandes mas moles"
  (`COURACA_OVERRIDE`, hoje só o Roc). Efeito: soldado/arqueiro comum cravam 0 a partir de
  Imenso; heróis (montante, Proeza, Impacto) ainda arranham; Colossal exige Centelha/magia.
  Documentado no cap. Combate ("Couraça de Porte"). Commit da couraça abaixo.
