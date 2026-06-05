# REVISAR — pontos a conferir do New RPG System D6 (site V1)

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
- ⚠️ **Ainda proposta (não estava nos docs):** a **Regra de Horda** exibida na página de
  Bestiário é sugestão minha de design — confirmar/ajustar antes de canonizar.

Para mexer: editar o gerador e rodar `node scripts/gen-bestiario.mjs`, ou editar o JSON direto.
