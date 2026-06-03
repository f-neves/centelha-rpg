# REVISAR — pontos a conferir do New RPG System D6 (site V1)

> Gerado por `migrate-to-json.mjs`. Cada item aqui ou foi redigido provisoriamente, ou diverge da fonte e precisa de decisão humana.

## Divergências de mecânica

- **Iniciativa do Kael.** A fórmula é `1d6 + Raciocínio + Prontidão`. Com os atributos do exemplo (Raciocínio 3, Prontidão 2) o resultado é **1d6+5**. O texto antigo do doc dizia "1d6+6" — mantivemos a fórmula (→ **+5**), conforme decisão do autor. PV 34 · Defesa 10 · Energia 16 · Mana 7 conferem.

## Técnicas com prosa provisória (pendente:true) — 0

Nenhuma: todas as Técnicas têm prosa vinda do catálogo `.md`.

## Bestiário — stat blocks provisórios (todos `pendente:true`)

Os 14 NPCs de `src/data/inimigos.json` foram **gerados** por `scripts/gen-bestiario.mjs`
a partir de builds compactas — os números (PV, Defesa, Defesa Mental, Soak, Iniciativa
e pools de ataque) são **calculados pelas fórmulas de `regras.json`**, então são
consistentes; mas os *builds* em si (atributos/perícias/equipamento escolhidos) são uma
**proposta de balanceamento minha** e merecem revisão de design. A **Regra de Horda**
exibida na página também é proposta (não estava nos docs). Ajustar/expandir à vontade —
editar o gerador e rodar `node scripts/gen-bestiario.mjs`, ou editar o JSON direto.

