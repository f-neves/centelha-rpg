# Progresso da Revisora · rodada 113

- 26/09 02:19 · aviso é a mensagem do Arquiteto (8d0b281, effc917, cd27068, e o ffed1d5 dele). Reancorada em `ffed1d5` pelo §0.1 (merge-base passou). Passo 0: toplevel certo, branch `revisora`, árvore limpa.
- 02:19 · a regra do capítulo refaz a curva_por_soma inteira (9 somas) a partir do valor_por_ponto e do arred(); na soma 9 as faixas 7 e 11 empatam (334,3), e o dado escolhe 7. Buildando e conferindo a malha.
- 02:21 · malha conferida por script (7 iguais, 4 com só forma diferente); dist com 130/330/670 e 100/300/1.000/sem teto; CORRIGE: teto null na aldeia passa e sai 'sem teto' (testado e restaurado). CI dos 4 success. Commitando.
