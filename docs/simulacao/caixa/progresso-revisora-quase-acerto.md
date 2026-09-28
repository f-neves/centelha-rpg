# Progresso · revisão Regra do Quase-Acerto + Simultâneo + Vida negativa + bancada

- Reancorada em `d41483b` (branch `revisora`), 2026-09-28.
- Rodei eu mesma: espelho, validate, tsc, build, test-lance, test-quase-acerto, gen-pendencias --check. Todos verdes.
- Item 2c: controle negativo (piso revertido) reproduz os 390 divergentes exatos. Item 2e: diff campo a campo confirma só danoLiquido/pvDepois mudaram, gate resvalado (243 lances) corretamente excluído dos 390.
- Item 2d: 6 call-sites contados (não 5), incluindo os 3 achados pela própria Executora; nenhum sétimo achado.
- Item 3: tentei negative control (motor.mjs, grid.astro, os dois) e não reproduzi divergência no espelho padrão; instrumentei e confirmei "PULOU TOTAL: 0" nos cenários fixos -- o espelho não exercita esse ramo. Registrado como nota, não CORRIGE.
- Item 4/4b: limiteDaMorte em mais pontos que o relato listou, zero Math.max(0,pv) restante; SQL da migração 40 recomputado independentemente, bate.
- Item 6/H7: confirmado que faixaNaFolha é só exibição, motor não aplica penalidade de alcance de verdade.
- Item 7: 334 pendencias (327+7), todas as 6 novas citadas e no arquivo certo.
- Travessão zero (escopo correto a4a6f33a..d41483b). CI verde nos 2 commits.
- Veredito escrito: PROCEDE em todos os itens, com nota importante (não bloqueante) no item 3.
