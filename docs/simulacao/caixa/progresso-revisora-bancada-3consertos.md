# Progresso · revisão bancada, três consertos

- Reancorada em `de35d9c2` (branch `revisora`), 2026-09-28.
- Item 1: recomputado 1,336/1,113=1,2004; conferidas as 20 ⚑ do relatório, todas preparo-1/recuperacao-1, zero falso positivo.
- Item 2: tabela E e 6a comparadas coluna a coluna, formato compatível.
- Item 3: controle negativo próprio (cenario soma8/x4, cap=2, diferente do dela) confirma cabo ligado: total muda de -8 para -6.
- Item 4: rodei duas vezes (com/sem --pular), comparei 4 seções por extração propria: byte a byte identicas.
- src/ não tocado, travessão zero, caminhos sujos intactos, validate/tsc verdes.
- CI: de35d9c2 success; 2251724d (despacho, doc-only) deu vermelho no test-grid, mesmo padrão de ruido ja visto na rodada do Folego.
- Veredito escrito: PROCEDE nos 4 itens.
