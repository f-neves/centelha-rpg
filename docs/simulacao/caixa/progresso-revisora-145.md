# Progresso 145 (Busca, terceira passada)
- Reancorada em fcd769a2fbb99576e5a32d71fd869ff3dcce1595, 2026-10-08.
- 145: test-busca verde; 23 mutacoes: 22 pegas, 1 nao (word_count menor que o texto)
- 145: scan src+dist sem lookbehind (controle detecta no 16.3); eq 1M strings 0 dif; falta sweep real, regressao curta e veredito
- 145: veredito escrito (CORRIGE x1: caso word_count menor; resto PROCEDE); commit e push
