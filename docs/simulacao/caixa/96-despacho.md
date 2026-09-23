# Rodada 96 · despacho · a camada de direção por trilhas, e dois achados de registro

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> Abre depois do veredito da 95. Progresso em `progresso-96.md`, relato em `96-executora.md`.
> **Tudo local, sem push**, enquanto o humano não decidir sobre os commits do Cartógrafo.

O pedido é do humano, escrito para o despacho 94, que já fechou. Ele vem inteiro para cá, sem
mudança de conteúdo. **Nada disto abre frente nova, e nenhum conserto que a varredura achar é
aberto.**

## 1 · O J4 está morto e continua aberto

O `J4` descreve o mesmo defeito do `B12`: o código lendo `m.fraquezas`/`m.resistencias` no topo da
criatura em vez de dentro de `combate` (zero das 309 no topo, 101 dentro), apontando para
`Auditoria_Tecnica.md` §8.2. O `B12` fechou em 08/09/2026 (`20daeea`), com `elementosCombate()`
centralizando a leitura e `test-elementos-combate.mjs` no `validate`. O J4 segue aberto e "não
corrigido de propósito, porque mexe em número de mesa".

**Confira contra o sha e feche, apontando para o B12.** Se houver caminho que o `20daeea` não
cobriu, diga qual, com arquivo e linha, em vez de fechar por semelhança. Registre como achado da
forma "fechar a frente sem fechar o documento", e não como conserto.

## 2 · Os dois I5

Em `I-mesa-tempo-real.md`, "Um editor de cenário no Grid" e "O anel de Vida remoto aparece em salto"
carregam os dois a sigla `I5`. **O primeiro fica** (é o citado de fora, `02-projeto-harness.md` §0.4
P2); **o segundo ganha sigla nova**, com o conteúdo intacto e a renumeração registrada na linha, como
no `B13`. Confira antes que ninguém cita o segundo pela sigla velha.

## 3 · A contagem por tipo, no topo

O humano mediu por `grep` em 23/09 (ponto de partida, **confira, não aceite**):

| tema | abertos | DECIDIR | FAZER | AUTOR | CONSERTAR |
|---|---:|---:|---:|---:|---:|
| A | 19 | 13 | 5 | 4 | 0 |
| B | 10 | 4 | 6 | 0 | 0 |
| C | 4 | 0 | 2 | 0 | 0 |
| D | 4 | 2 | 2 | 0 | 0 |
| E | 9 | 5 | 1 | 0 | 3 |
| F | 9 | 6 | 0 | 3 | 0 |
| G | 5 | 3 | 2 | 0 | 0 |
| H | 2 | 2 | 0 | 0 | 0 |
| I | 10 | 2 | 8 | 0 | 0 |
| J | 9 | 4 | 0 | 0 | 2 |
| K | 18 | 13 | 3 | 0 | 1 |
| L | 70 | 0 | 8 | 1 | 0 |

A leitura dele: **54 dos 99 abertos de A a K são [DECIDIR] e 7 são [AUTOR]; 61 são do humano, e
nenhuma instância pode movê-los.** É isso que explica por que a fila não anda, e tem de estar
visível logo no topo do `Pendencias.md`.

**As somas por tipo entram na tabela GERADA**, ao lado da contagem bruta, e não à mão. Onde a sua
medida divergir da dele, diga o número, a causa, e qual vale (a sua medida já mudou A, B, D, E e K
nesta semana).

## 4 · A ordem sugerida vira três trilhas

Não é uma fila só. São três trilhas que não disputam o mesmo recurso e correm ao mesmo tempo:

- **DECISÃO** · custa tempo do humano e zero token (os `[DECIDIR]`);
- **EXECUÇÃO** · custa token e zero tempo dele, quando a decisão já existe (`[FAZER]`,
  `[CONSERTAR]`, as M decididas e não feitas, a §17, a fila do Grid);
- **AUTORIA** · custa o tempo criativo dele, e não trava nada técnico (`[AUTOR]`).

Continua marcada como **proposta do Arquiteto, e não decisão**. A seção 6 atual (a ordem da 94) é
reescrita nesse molde, e o que ela tinha entra na trilha que lhe cabe.

## 5 · As cinco decisões-raiz, no topo da trilha de DECISÃO

Ordenadas por quanto destravam, e não por urgência. **Marque as cinco no índice.**

- **F7** · travar o panteão. Trava F5 e F6: uma decisão libera três itens de autoria;
- **F3** · a mecânica de clérigo, paladino e monge. Trava B4, e enquanto não sair, 47 criaturas têm
  fraqueza a sagrado que nada no jogo dispara (confira o 47);
- **a camada de Tradição** · trava C1, C2, metade do A11, e por consequência C3 e C4. O bloqueio
  mais antigo do mapa;
- **G12** · Desgaste e ferimento não se conhecem. A única que já produz dívida em mesa: o mestre
  arbitra hoje;
- **E4 com E8** · a régua de Relação. O capítulo publicado depende delas; o E8 tem o dente medido
  (15 pontos saem em 3 intervalos, 14 saem em 6).

**Não mexa no conteúdo desses itens.** Eles são do humano, e ele responde em bloco.

## 6 · O que sai da fila: ADIADO, com motivo

Proposta do humano, e não ordem. Marque cada um como **ADIADO**, com o motivo na linha, em vez de
deixar misturado:

- **C3** · o catálogo das 24 Artes; o próprio item diz que é frente do tamanho do bestiário;
- **J0** e **J10** · os travessões em dado publicado. Não destravam nada; viram lote único para o dia
  em que outra coisa já for mexer naqueles arquivos;
- **I8** · o ponteiro ao vivo; o próprio item pergunta se vale a pena;
- **H4**, **D3** e **D6** · refinamentos que ninguém sentiu falta em mesa (o H4 diz que o conserto é
  uma tecla, se incomodar).

**A marca mora no tema, e o gerador a lê**, para o ADIADO aparecer na tabela gerada e sair das somas
de trabalho (sem isso ele vira segunda lista à mão). Se o gerador precisar de marca nova, ela passa
pelo teste dele, com o caso planteado.

## 7 · A segunda medida do L52

Com o índice de pé, remeça o `L52` e registre ao lado da primeira (10/09: 120 abertos, 63 fechados,
4 parciais, 187 no total), com a nota de que a primeira nasceu inflada. **Sem percentual.** É a
primeira vez que a série diz alguma coisa.

## O que não fazer

Não reconferir os 250 itens contra o código. Não abrir nenhum conserto que a varredura achar. Não
mexer no conteúdo dos itens das decisões-raiz.

## O relato

`96-executora.md`, as quatro seções da casa, mais: a contagem por tipo com as divergências
explicadas, o J4 (fechado ou o caminho não coberto), a sigla nova do segundo I5, e as duas medidas
do L52 lado a lado.
