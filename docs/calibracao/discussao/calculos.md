# Memória de cálculo

INFERÊNCIA: enumeração exata, sem simulação; hipóteses descritas em 01-regua.md.

| Medida | Iniciante | Veterano |
|---|---:|---:|
| P(sucesso) | 0.259259 | 0.239198 |
| P com +1 | 0.375000 | 0.335648 |
| ganho P de +1 | 0.115741 | 0.096451 |
| PV esperado | 1.442130 | 0.877701 |
| PV de +1 fixo (U) | 0.685185 | 0.391590 |
| +1 dado P | 0.664352 | 0.600309 |
| +1 dado eqP | 3.500000 | 3.744000 |
| +1 dado eqPV | 4.043919 | 4.506897 |
| rerrolar menor, substitui P | 0.439815 | 0.425283 |
| rerrolar menor, substitui eqP | 1.560000 | 1.929333 |
| rerrolar menor, substitui eqPV | 1.488739 | 1.864368 |
| rerrolar menor, mantém melhor P | 0.487654 | 0.450360 |
| rerrolar menor, mantém melhor eqP | 1.973333 | 2.189333 |
| rerrolar menor, mantém melhor eqPV | 1.892455 | 2.147126 |
| parada inteira, mantém melhor P | 0.451303 | 0.421180 |
| parada inteira, mantém melhor eqP | 1.659259 | 1.886790 |
| parada inteira, mantém melhor eqPV | 1.565081 | 1.728794 |
| +1 dano eqPV | 0.378378 | 0.610837 |
| +1d6 dano eqPV | 1.324324 | 2.137931 |
| +1 absorção eqPV | 0.378378 | 0.610837 |
| +1 defesa eqPV | 0.804054 | 0.786207 |
| +1 defesa eqP | 0.840000 | 0.832000 |
| +4 defesa eqPV | 1.956081 | 2.000000 |
| +1 absorção após acerto eqPV | 1.459459 | 2.553695 |
| cura 1 eqPV | 1.459459 | 2.553695 |
| ação extra eqPV | 2.104730 | 2.241379 |
| +3 fixos eqPV | 3.385135 | 3.600000 |
| +6 fixos eqPV | 7.118243 | 8.379310 |
| +9 fixos eqPV | 10.141892 | 13.262069 |
| +1 dificuldade eqP | -0.840000 | -0.832000 |
| -1 dificuldade eqP | 1.000000 | 1.000000 |
| ignorar -2 eqP | 1.440000 | 1.472000 |
| ignorar -3 eqP | 1.840000 | 1.920000 |
| ignorar -6 eqP | 2.240000 | 2.440000 |
| D7 x1 iguais | 0.259259 | 0.239198 |
| D7 x1 vs defesa fixa | 0.259259 | 0.239198 |
| D7 x2 iguais | 0.259259 | 0.239198 |
| D7 x2 vs defesa fixa | 0.375000 | 0.664352 |

Frações exatas das unidades:

* Iniciante: ΔP=25/216; U=37/54; P=7/27.
* Veterano: ΔP=125/1296; U=1015/2592; P=155/648.

## Sensibilidade da dificuldade (tarefas, sem bônus de combate)

| Parada | D | P | ΔP(+1) | +1d6 em eqP |
|---|---:|---:|---:|---:|
| 3d6 | 5 | 0.953704 | 0.027778 | 1.527778 |
| 3d6 | 10 | 0.500000 | 0.125000 | 2.728395 |
| 3d6 | 15 | 0.046296 | 0.046296 | 6.250000 |
| 3d6 | 20 | 0.000000 | 0 | indefinido |
| 4d6 | 5 | 0.996142 | 0.003086 | 1.208333 |
| 4d6 | 10 | 0.841049 | 0.061728 | 2.050000 |
| 4d6 | 15 | 0.335648 | 0.108025 | 3.325000 |
| 4d6 | 20 | 0.027006 | 0.027006 | 7.200000 |

## D7: adversários de Centelha diferente

INFERÊNCIA: atacante 3d6, defesa sem Centelha 12, sem outros bônus.
| Centelha atacante / defensor | +1 por ponto | +2 por ponto |
|---|---:|---:|
| 1/1 | 0.259259 | 0.259259 |
| 1/4 | 0.046296 | 0.000000 |
| 4/1 | 0.625000 | 0.907407 |
| 4/4 | 0.259259 | 0.259259 |

## D8 e G15: Longa

FATO suplementar: acoes-e-sistema.md:94,109 define progresso=max(0,média-D).
INFERÊNCIA: 3d6, média 10,5; Acúmulo 30; sem Centelha; G15-A soma bônus à média; G15-B apenas permite a tentativa, sem bônus numérico.
| D | Sem bônus / G15-B | G15-A e D8 +2 | G15-A e D8 +3 |
|---|---:|---:|---:|
| 10 | 60 | 12 | 9 |
| 12 | sem avanço | 60 | 20 |
| 13 | sem avanço | sem avanço | 60 |
