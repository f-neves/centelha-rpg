# Lote r-listas-07-11: os números de combate antes e depois

Da Executora, 07/11/2026, branch `lote-listas`. Antes: `origin/main` 585713cd (o 81497c74, base da branch, só acrescenta documento). Depois: a árvore com a G2 (cherry-pick de 61832b57), o conversor que lê o Tamanho da arma e as 64 fichas do lote (a fênix, o planetar e o solar ficam como estão no main, segurados). Gerado por `tmp/executora/lote/comparar.mjs` a partir do `inimigos.json` e do `monsters.json` de antes e de depois: PV, Defesas, Absorção, Iniciativa, a Defesa com a outra arma e com o equipamento, cada ataque (jogada, dano, Velocidade, Acerto e Atributo), os poderes de regeneração e a fraqueza.

Diferenças: 60 linhas; sem causa: 0.

| Criatura | Campo | Antes | Depois | Causa |
|---|---|---|---|---|
| campones-assustado | defesa | 6 | 5 | F3 (a Defesa da arma nova: o Forcado guarda +1, o Bordão guardava +2) |
| campones-assustado | ataque Bordão | 1d6+2 +1 · 1d6 +4 (I) · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| campones-assustado | ataque Forcado | · | 1d6+2 · 1d6 +4 (P) · perf. 0 · V6 · Acerto 0 · forca | F3 (arma nova do catálogo) |
| centauro | ataque Azagaia | 3d6+2 +5 · 1d6 +9 (P) · perf. 1 · V6 · Acerto 1 · destreza | 5d6 +5 · 1d6 +9 (P) · perf. 1 · V6 · Acerto 1 · forca | G2 (arremesso pela Força) |
| ciclope | defesa | 8 | 6 | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| ciclope | defesaOutraArma | · | {"arma":"Rocha arremessada","armaPrincipal":"Martelo de Guerra","bloqueio":8,"defesa":8} | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| ciclope | ataque Rocha arremessada | 2d6+2 +2 · 2d6 +10 (I) · V7 · Acerto 0 · destreza | 6d6 +2 · 2d6 +10 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| ciclope | ataque Martelo de Guerra | · | 7d6 +2 · 3d6 +19 (I) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| diabo-barbado | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["arma abençoada","prata"]}] | G5 (campo próprio) |
| diabo-chifrudo | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["arma abençoada"]}] | G5 (campo próprio) |
| diabo-do-fosso-pit-fiend | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["arma abençoada","prata"]}] | G5 (campo próprio) |
| diabrete-imp | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["prata","arma abençoada"]}] | G5 (campo próprio) |
| duelista | ataque Lâmina leve | 5d6 +8 · 1d6 +4 (C) · V5 · Acerto 2 · destreza | · | F3 (arma nova do catálogo) |
| duelista | ataque Florete | · | 5d6 +8 · 1d6 +4 (P) · perf. 1 · V5 · Acerto 2 · destreza | F3 (arma nova do catálogo) |
| ettin | defesa | 6 | 7 | G1 (as Maças do catálogo, uma em cada mão: a Defesa da arma +1) |
| ettin | ataque Maça | · | 6d6 +1 · 2d6 +8 (I) · V6 · Acerto 1 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| gigante-da-colina | defesa | 8 | 6 | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-da-colina | defesaOutraArma | · | {"arma":"Rocha arremessada","armaPrincipal":"Martelo de Guerra","bloqueio":8,"defesa":8} | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-da-colina | ataque Rocha arremessada | 2d6+2 +2 · 2d6 +10 (I) · V7 · Acerto 0 · destreza | 6d6 +2 · 2d6 +10 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| gigante-da-colina | ataque Martelo de Guerra | · | 7d6 +2 · 3d6 +19 (I) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| gigante-da-pedra | ataque Rocha arremessada | 4d6 · 2d6 +9 (I) · V7 · Acerto 0 · destreza | 6d6+2 · 2d6 +9 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| gigante-das-nuvens | ataque Rocha arremessada | 3d6 +4 · 2d6 +14 (I) · V7 · Acerto 0 · destreza | 7d6+2 +4 · 3d6 +14 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| gigante-do-fogo | defesa | 8 | 6 | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-do-fogo | defesaOutraArma | · | {"arma":"Rocha arremessada","armaPrincipal":"Montante","bloqueio":8,"defesa":8,"vestida":5} | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-do-fogo | vestida | {"esquiva":1,"bloqueio":5,"defesa":5,"contraTiro":1,"absorcao":{"impacto":14,"corte":10,"perfuracao":6},"nivel":2,"penalidade":3} | {"esquiva":1,"bloqueio":3,"defesa":3,"contraTiro":1,"absorcao":{"impacto":14,"corte":10,"perfuracao":6},"nivel":2,"penalidade":3} | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-do-fogo | ataque Rocha arremessada | 2d6+2 +2 · 2d6 +11 (I) · V7 · Acerto 0 · destreza | 6d6+2 +2 · 2d6 +11 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| gigante-do-fogo | ataque Montante | · | 7d6+2 +2 · 3d6 +21 (C) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| gigante-do-gelo | defesa | 8 | 6 | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-do-gelo | defesaOutraArma | · | {"arma":"Rocha arremessada","armaPrincipal":"Machado Pesado","bloqueio":8,"defesa":8} | G1 (a arma de duas mãos do catálogo: −2 de Bloqueio e, com a rocha, a Defesa com a outra arma, P23) |
| gigante-do-gelo | ataque Rocha arremessada | 2d6+2 +2 · 2d6 +11 (I) · V7 · Acerto 0 · destreza | 6d6+2 +2 · 2d6 +11 (I) · V6 · Acerto 0 · forca | G1 (a rocha do catálogo, no Tamanho; V6 da classe); G2 (arremesso pela Força) |
| gigante-do-gelo | ataque Machado Pesado | · | 7d6+2 +2 · 3d6 +21 (C) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| hidra-5-cabecas | regeneração (poderes) | Regeneração 5 + fogo e ácido param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| hidra-5-cabecas | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["fogo","ácido"]}] | G5 (campo próprio) |
| kyton | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["arma abençoada","prata"]}] | G5 (campo próprio) |
| lemure | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["fogo","ácido","arma abençoada"]}] | G5 (campo próprio) |
| linnorm-do-gelo | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["ferro frio"]}] | G5 (campo próprio) |
| linnorm-dos-lagos | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["ferro frio"]}] | G5 (campo próprio) |
| linnorm-dos-penhascos | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["ferro frio"]}] | G5 (campo próprio) |
| marilith | regeneração (poderes) | Regeneração 9 + arma benta e fogo param a regeneração | Regeneração 9 | B2 (repetições reunidas no poder principal) |
| marilith | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["arma abençoada","fogo"]}] | G5 (campo próprio) |
| merfolk | defesaOutraArma | {"arma":"Besta média","armaPrincipal":"Lança","bloqueio":10,"defesa":10} | {"arma":"Besta Média","armaPrincipal":"Tridente","bloqueio":10,"defesa":10} | F3 e G3 (só os nomes: Tridente e Besta Média; os números não mudam) |
| merfolk | ataque Lança | 2d6+2 +3 · 1d6 +7 (P) · perf. 1 · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| merfolk | ataque Besta média | 2d6 +3 · 1d6 +5 (P) · perf. 1 · V12 · Acerto 1 · percepcao | · | G3 (Besta Média no nome) |
| merfolk | ataque Tridente | · | 2d6+2 +3 · 1d6 +7 (P) · perf. 1 · V6 · Acerto 1 · forca | F3 (arma nova do catálogo) |
| merfolk | ataque Besta Média | · | 2d6 +3 · 1d6 +5 (P) · perf. 1 · V12 · Acerto 1 · percepcao | G3 (Besta Média no nome) |
| ogro | ataque Martelo de Guerra | · | 5d6 · 3d6 +14 (I) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| ogro | ataque Machado Pesado | · | 5d6 · 3d6 +14 (C) · V7 · Acerto 0 · forca | G1 (Variante de gigante vira arma do catálogo, no Tamanho) |
| ogro-mago-oni | regeneração (poderes) | Regeneração 5 + fogo e ácido param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| ogro-mago-oni | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["fogo","ácido"]}] | G5 (campo próprio) |
| quasit | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["prata","arma abençoada"]}] | G5 (campo próprio) |
| sahuagin | ataque Lança | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| sahuagin | ataque Tridente | · | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | F3 (arma nova do catálogo) |
| skum-ulat-kini | ataque Lança | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| skum-ulat-kini | ataque Tridente | · | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | F3 (arma nova do catálogo) |
| tarrasque | regeneração (poderes) | Regeneração 40 + fogo e ácido atrasam a regeneração | Regeneração 40 | B2 (repetições reunidas no poder principal) |
| tarrasque | fraqueza da regeneração | · | [{"forma":"interrompe","tipos":["fogo","ácido"],"duracao":"6 Ticks"}] | G5 (campo próprio) |
| trol | regeneração (poderes) | Regeneração 5 + fogo e ácido param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| trol | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["fogo","ácido"]}] | G5 (campo próprio) |
| vampiro | regeneração (poderes) | Regeneração 5 + prata, fogo e sol param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| vampiro | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["prata","fogo","luz do sol"]}] | G5 (campo próprio) |

## O que mais o lote fez, sem número de combate

- As 34 fichas da lista F1 (os 55 avisos de prefixo de campo) e as que só trocaram texto mudam a justificativa, a
  revisao do JSON-fonte e as notas da própria ficha; nenhum número de combate muda nelas (a tabela acima não as cita).
- B2: o shoggoth recupera 10 PV por minuto, sem fraqueza; as sete repetições "X param/atrasam a regeneração" e os
  poderes "ferida que não fecha" foram reunidos ao poder principal da Regeneração.
- G3: o merfolk diz Besta Média no nome e nas estatísticas da arma.

## Segurados e não aplicados

- **A fênix, o planetar e o solar ficam como estão no main** (ordem do Arquiteto de 07/11/2026): a Bestiarista mudou a
  fraqueza de regeneração deles, e o autor está perguntando a ela por quê. Os três JSON do lote não entraram.
- **`g5-regras.jsonpatch`: não aplicado, segurado** (opção a do Arquiteto, 07/11/2026). Ele acrescenta à lista fechada da G5 seis nomes (gelo, mal,
  arma maligna, efeito maligno, artefato maligno, magia maligna) que só servem às três fichas seguradas, e segura junto com elas; a pergunta vai ao autor com a das três.

## Como foi conferido

- O conversor lê o Tamanho da arma na coluna Parte; os oito JSON de `r-listas-07-11/json-g1` (13 ataques) saem dele
  byte a byte iguais (cmp).
- As 324 fichas (as 64 do lote no lugar das de antes) reconvertidas saem iguais aos JSON da árvore (0 diferentes); o
  segundo passe é o mesmo.
- Controle por mutação do conversor e da G2 em `tmp/executora/lote/mut.txt`.
