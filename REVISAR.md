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

## Bestiário — pendência de balanceamento

- **⏳ Redução de dano (Absorção) por tamanho:** o **PV já escala com o porte**
  (`regras.derivados.pv.porte`: Miúdo 15+V×1 … Colossal 45+V×5). Falta avaliar se a
  **Absorção natural** também deve variar com o tamanho (criaturas grandes absorvendo mais,
  miúdas menos), a decidir junto com o usuário.
