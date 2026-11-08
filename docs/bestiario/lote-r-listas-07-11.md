# Lote r-listas-07-11: os números de combate antes e depois

Da Executora, 07/11/2026, branch `lote-listas`. Antes: `origin/main` 585713cd. Depois: a árvore com a G2 (cherry-pick de 61832b57), o conversor que lê o Tamanho da arma e as 67 fichas do lote (a fênix, o planetar e o solar entraram depois, com a G7). Gerado por `tmp/executora/lote/comparar.mjs` a partir do `inimigos.json` e do `monsters.json` de antes e de depois: PV, Defesas, Absorção, Iniciativa, a Defesa com a outra arma e com o equipamento, cada ataque (jogada, dano, Velocidade, Acerto e Atributo), os poderes de regeneração e a fraqueza.

Diferenças: 64 linhas; sem causa: 0. A explicação do formato, a conta de três ataques dos gigantes e a regra da Defesa estão depois da tabela.

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
| fenix | regeneração (poderes) | Regeneração 10 + frio e mal param a regeneração | Regeneração 10 | B2 (repetições reunidas no poder principal) |
| fenix | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["água","maligno"]}] | G7 (água e maligno na lista; a ficha diz a forma, D-369) |
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
| planetar | fraqueza da regeneração | · | [{"forma":"interrompe","tipos":["maligno"],"duracao":"6 Ticks"}] | G7 (água e maligno na lista; a ficha diz a forma, D-369) |
| quasit | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["prata","arma abençoada"]}] | G5 (campo próprio) |
| sahuagin | ataque Lança | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| sahuagin | ataque Tridente | · | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | F3 (arma nova do catálogo) |
| skum-ulat-kini | ataque Lança | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | · | F3 (arma nova do catálogo) |
| skum-ulat-kini | ataque Tridente | · | 3d6+2 +5 · 1d6 +10 (P) · perf. 1 · V6 · Acerto 1 · forca | F3 (arma nova do catálogo) |
| solar | fraqueza da regeneração | · | [{"forma":"interrompe","tipos":["maligno"],"duracao":"6 Ticks"}] | G7 (água e maligno na lista; a ficha diz a forma, D-369) |
| tarrasque | regeneração (poderes) | Regeneração 40 + fogo e ácido atrasam a regeneração | Regeneração 40 | B2 (repetições reunidas no poder principal) |
| tarrasque | fraqueza da regeneração | · | [{"forma":"interrompe","tipos":["fogo","ácido"],"duracao":"6 Ticks"}] | G5 (campo próprio) |
| trol | regeneração (poderes) | Regeneração 5 + fogo e ácido param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| trol | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["fogo","ácido"]}] | G5 (campo próprio) |
| vampiro | regeneração (poderes) | Regeneração 5 + prata, fogo e sol param a regeneração | Regeneração 5 | B2 (repetições reunidas no poder principal) |
| vampiro | fraqueza da regeneração | · | [{"forma":"naoRegenera","tipos":["prata","fogo","luz do sol"]}] | G5 (campo próprio) |

## Como ler a linha de um ataque

O card e a tabela escrevem o ataque como **"jogada · dano"**. Na rocha do gigante-da-colina, "6d6 +2 · 2d6 +10 (I)":

- **"6d6 +2" é a jogada de ataque**, e não o dano. É a fórmula do Combate Físico (`combate.md:156`): "Ataque =
  [(Atributo + Habilidade) ÷ 2]d6 (+2 se a soma for ímpar) + Arma + 2 × menor(Centelha, Habilidade)". O pool é o do
  coração do sistema (`coracao-do-sistema.md:14`): metade da soma em dados, +2 se a soma for ímpar. O "+2" depois do
  espaço é o Acerto da arma mais os 2 × menor(Centelha, Habilidade) (`defesas.md`, As fórmulas).
- **"2d6 +10 (I)" é o dano**: o dado da arma e o fixo, que é a Força (× 1 numa mão, × 2 nas duas) mais a Centelha
  (`combate.md:287`: "Dano = (Dado da Arma + Margem) + Força + Centelha − Absorção"). A Margem entra no golpe que
  acerta, e por isso não está no card. A letra é o modo (I, Impacto; C, Corte; P, Perfuração).

A Força aparece nas duas metades porque entra nas duas contas: na jogada, como o Atributo (pela G2, o maior entre Força
e Destreza no arremesso); no dano, como o fixo multiplicado pela mão. O "6d6" não é a Força convertida em dados de
dano: é o pool da jogada.

## A conta de três ataques

| Ataque | Jogada | Dano |
|---|---|---|
| gigante-da-colina, **Rocha arremessada** (rocha Grande) | Força 9 + Arremesso 3 = 12, par: **6d6**; Acerto da rocha 0 + 2 × menor(Centelha 1, Arremesso 3) = **+2** | rocha Média 1d6, +1d6 por ser Grande (G1): **2d6**; Força 9 × 1 (uma mão) + Centelha 1 = **+10** |
| gigante-da-colina, **Martelo de Guerra** (arma Grande) | Força 9 + maior entre Briga 5 e Armas 0 = 14, par: **7d6**; Acerto do Martelo 0 + 2 × menor(Centelha 1, Briga 5) = **+2** | Martelo de Guerra 2d6, +1d6 por ser Grande (G1): **3d6**; Força 9 × 2 (duas mãos) + Centelha 1 = **+19** |
| gigante-das-nuvens, **Rocha arremessada** (rocha Enorme) | Força 12 + Arremesso 3 = 15, ímpar: **7d6+2**; Acerto 0 + 2 × menor(Centelha 2, Arremesso 3) = **+4** | rocha Média 1d6, +2d6 por ser Enorme, duas categorias acima (G1): **3d6**; Força 12 × 1 + Centelha 2 = **+14** |

É a conta do autor: "a rocha Grande dá 2d6 de base e o martelo pesado de Grande dá 3d6; a Força entra à parte (×1 com
uma mão, ×2 com duas), e a Centelha e a Margem como em todo dano".

**Por que, na rocha da colina, só a jogada mudou.** Antes, a rocha era ataque natural Pesado da ficha: "2d6 + Força × 1
(9) + Centelha (1)", o mesmo dano de agora (a rocha Grande do catálogo também dá 2d6, e a rocha vai numa mão, Força × 1).
A jogada era "Destreza 2 + Arremesso 3" = 5, ímpar: 2d6+2, com o mesmo +2 da Centelha ("2d6+2 +2"). A G2 trocou o
Atributo da jogada pela Força 9: 12, par, 6d6. No gigante-das-nuvens mudaram as duas: a jogada pela G2 e o dado pela
G1 (a rocha Enorme dá 3d6, e a natural de antes dava 2d6).

**Conferido com a conta da Revisora** (feita à parte, 08/11/2026): colina, rocha: 12 → 6d6, +2; dano 2d6 + 9 × 1 + 1 =
2d6 +10. Colina, Martelo: Força 9 + Briga 5 = 14 → 7d6 +2; 3d6 + 9 × 2 + 1 = 3d6 +19. Nuvens, rocha Enorme: 15 →
7d6+2 +4; 3d6 + 12 + 2 = 3d6 +14. As três batem com a tabela acima.

## A Defesa de 8 para 6

Nos quatro gigantes de arma de duas mãos e rocha (ciclope, gigante-da-colina, gigante-do-fogo e gigante-do-gelo), a
Defesa cai de 8 para 6. No gigante-da-colina:

- Bloqueio = (Destreza 2 + Bloqueio 1) × 2 + 2 × menor(Centelha 1, Bloqueio 1) = **8**; Esquiva = **4**. A fórmula
  (`defesas.md`, Defesa Física): "Bloqueio = ( Destreza + Bloqueio ) × 2 + 2 × menor(Centelha, Bloqueio) + Especialidade
  + defesa da arma/escudo".
- A "defesa da arma" do Martelo de Guerra é **−2**: o Cap. XIII escreve a Defesa −2 na linha da classe Pesada ("dano que
  vence armadura, mas lenta e te expõe, com guarda baixa", `armas-e-armaduras.md:38`) e na do Martelo de Guerra
  (`armas-e-armaduras.md:85`), e diz que a "Def. (Defesa da Arma)" é "quanto a arma acrescenta ao seu Bloqueio". O
  Montante e o Machado Pesado têm a mesma Defesa −2 no catálogo.
- A criatura acompanha o catálogo (D-262: "a ficha de criatura muda com a mudança do catálogo; continua guardando a arma
  do livro pelo id"), e a arma de duas mãos ocupa as mãos (o parecer G4 da Veterana sobre a ficha, que a D-262 leva à criatura; não é a G4 do autor, D-366, "Quem empunha"). Então
  Bloqueio 8 − 2 = 6, e a Defesa é o maior entre Esquiva 4 e Bloqueio 6: **6**. Antes, sem a arma do catálogo, era 8.
- Pela D-273 (P23: "o solar só leva o −2 com o montante em uso, não de arco"), o −2 só vale com a arma de duas mãos em
  uso: com a rocha na mão, a Defesa volta a **8**, e o card mostra as duas ("Defesa com a outra arma").

Na ettin, as duas Maças (Defesa da arma +1) sobem a Defesa de 6 para 7, pela mesma fórmula.

## O que mais o lote fez, sem número de combate

- As 34 fichas da lista F1 (os 55 avisos de prefixo de campo) e as que só trocaram texto mudam a justificativa, a
  revisao do JSON-fonte e as notas da própria ficha; nenhum número de combate muda nelas (a tabela acima não as cita).
- B2: o shoggoth recupera 10 PV por minuto, sem fraqueza; as repetições "X param/atrasam a regeneração" e os poderes
  "ferida que não fecha" foram reunidos ao poder principal da Regeneração.
- G3: o merfolk diz Besta Média no nome e nas estatísticas da arma.

## A G7 (D-369) e as três fichas

- A lista fechada da G5 ganha **água** e **maligno** (o maligno cobre arma, efeito, artefato ou magia de origem maligna,
  e a ficha diz qual). A lista mora num lugar só, `regras.json` (`criatura.fraquezasDaRegeneracao`), que o conversor
  lê; o livro a escreve junto da R47.
- **`g5-regras.jsonpatch`: refeito pela G7, e entrou.** A versão de antes (seis nomes, gelo e os termos malignos) ficou
  segurada; a nova acrescenta só água e maligno, e é a que está em `regras.json`. Não há segunda cópia da lista no
  conversor.
- A fênix (água ou maligno não se regenera), o planetar (maligno interrompe a Regeneração 10 por 6 Ticks) e o solar
  (maligno interrompe a Regeneração 15 por 6 Ticks) entraram com o lote. Na prosa de antes, o planetar e o solar
  paravam a regeneração por 1 hora.

## Como foi conferido

- O conversor lê o Tamanho da arma na coluna Parte; os oito JSON de `r-listas-07-11/json-g1` (13 ataques) saem dele
  byte a byte iguais (cmp).
- As 324 fichas (as 67 do lote no lugar das de antes) reconvertidas saem iguais aos JSON da árvore (0 diferentes).
- Controle por mutação do conversor e da G2 em `tmp/executora/lote/mut.txt`, e da G7 em `tmp/executora/lote/mut-g7.txt`.
