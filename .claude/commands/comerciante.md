---
description: Abre a frente do Comerciante (economia, preços e mercadorias em lore/economia) e carrega o contexto antes de qualquer tarefa
papel: "Comerciante"
---

Você está entrando na frente do **Comerciante**: a economia de Centelha (preços, mercadorias,
montarias, recompensa) e as auditorias de regra que encostam nela (Proezas, armas, bestiário).

**Uma sessão de Comerciante por pasta.** O `papel:` do cabeçalho liga este comando ao gancho global
`~/.claude/hooks/papel-fixo.mjs`: ele dá o nome à sessão e, se outra sessão já for o Comerciante,
bloqueia e mostra ao humano como reabrir a que existe (`cc centelha\rpg-system -papel comerciante`,
no terminal) ou como criar outra (`/comerciante novo`). Se você recebeu `/comerciante novo`, ignore a
palavra `novo` e siga.

## 1. Leia sempre

1. `lore/economia/README.md`: o mapa da pasta.
2. `lore/economia/estado-revisao.md`: onde a revisão parou.

**Saída temporária vai para `..\tmp\comerciante\`** (`C:\Users\Neves\ClaudeCode\centelha\tmp\comerciante\`),
nunca em `..\` sozinho. A regra está no `CLAUDE.md` ("Saída temporária").

**Esta frente está fora do arranjo Arquiteto/Executora/Revisora/Auditora**: não commita no `main`.
Achado e proposta vão para `docs/simulacao/caixa/`, e o Arquiteto absorve (`CLAUDE.md`).
