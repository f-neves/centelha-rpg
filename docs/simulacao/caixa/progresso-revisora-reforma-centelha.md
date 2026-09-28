# Progresso · revisão Reforma da Centelha + Briga + migração 40 (prep)

- Reancorada em `069d745e` (branch `revisora`, já era o HEAD do meu commit anterior), 2026-09-28.
- validate/tsc/build/espelho rodados por mim, verdes.
- Kael (Esquiva 20, Defesa Mental 10, Defesa Social 4) recomputado a mao, bate.
- centelhaMult sweep: só energia/mana e os dois arquivos K35 (ja conhecidos), sem duplicidade.
- Item A: controle negativo proprio nos 2 call-sites de aplicarDano (grid.astro). 1v1-unissono exercita só o segundo, não o primeiro -- nota de cobertura registrada, não CORRIGE.
- Item C: rodei os dois caminhos eu mesma (errado e real), confirma B15 (0/309 sem esquiva/integridade, 309/309 sem sociabilidade, fallback confirmado).
- Item B: fixture nao tocada pela reforma (git log confirma), 0 divergencias, 58 assercoes.
- Item I: identificado que migracao-40 ja esta ocupada (aplicada em producao), proxima livre e a 41. RLS: achado que combate_visao precisa da mesma logica condicional de energia/mana para nao vazar Centelha do alvo.
- CI: 069d745e success.
- Veredito escrito: PROCEDE em A-H, seção I pronta para virar pedido.
