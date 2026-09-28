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

## Adendo 28/09/2026 (item 3, fechamento)

- Reancorada em `cdf4a8c6` (merge do 99652358 com meu veredito e5b5df74).
- Confirmei que E.devido (grid.astro, ESPELHO_LIGADO) era um terceiro lugar com o mesmo bug do item 3, achado pela Executora ao construir a cena determinística.
- Meu proprio controle negativo (diferente do dela): revertidos os 3 locais juntos (motor.mjs + 3 ocorrencias de DE_PE_AO_ABRIR), a cena fatal falha na asserção nova. Revertido só E.devido sozinho (motor.mjs e os outros dois intactos), falha de outro jeito (mesa para no Tick 12, laço vai ate o teto) -- reproduz exatamente o padrao que ela descreveu.
- Verifiquei efeito colateral: E.devido só existe dentro de ESPELHO_LIGADO, único chamador é o proprio test-espelho.mjs via window.__ESPELHO.devido(). Sem caminho de producao tocado.
- validate/tsc verdes, travessão zero no adendo.
- Adendo escrito no mesmo arquivo do veredito: PROCEDE, nota fechada.
