# Rodada 96 · Executora · a direção por trilhas, e dois achados de registro

Despacho: `docs/simulacao/caixa/96-despacho.md` (`d980856`, local). Progresso com as horas lidas da
máquina em `progresso-96.md`. **Commitado e não empurrado.**

## ENTROU

| arquivo | o que mudou nele |
|---|---|
| `scripts/gen-pendencias.mjs` | recusa a cerca aberta no fim do arquivo; lê `[ADIADO]`; a tabela gerada ganha as colunas DECIDIR, FAZER, AUTOR, CONSERTAR, Outra marca e Adiados |
| `scripts/test-gen-pendencias.mjs` | três casos novos: `1. [ ]` numerado, a cerca aberta antes do A1, `[ADIADO] [DECIDIR]` |
| `Pendencias.md` | a contagem sobe para uma seção 0 no topo; a seção 6 vira as três trilhas, com as cinco decisões-raiz; as seções 3 e 5 acertadas |
| `docs/pendencias/J-infraestrutura.md` | J4 fechado com prova; J0 e J10 adiados |
| `docs/pendencias/I-mesa-tempo-real.md` | o segundo I5 vira I14; I8 adiado |
| `docs/pendencias/C-trilhas-feiticaria.md`, `D-proezas-tecnicas.md`, `H-arremesso.md` | C3, D3, D6 e H4 adiados |
| `docs/pendencias/L-simulacao-simultaneo.md` | a segunda medida do L52 |
| `docs/simulacao/caixa/progresso-96.md`, `96-executora.md` | progresso e relato |

### 0 · O CORRIGE da 95: a cerca aberta

Uma cerca que abre e nunca fecha é recusada nos dois modos, com a linha onde abriu, como a linha que o
gerador não lê. No teste, a cerca vai antes do A1, sobre um índice em dia. O gerador de hoje sai com
exit 1 e aponta a linha 3. **O gerador da 95 (`HEAD`), no controle, falha nas duas asserções da
cerca.** O `1. [ ]` entrou como caso. O falso positivo do `- [x](url)` fica anotado, sem conserto,
como o despacho mandou.

### 1 · O J4: fechado

Conferido contra o `20daeea`, e não por semelhança. Os pontos que a `Auditoria_Tecnica.md` §8.2
nomeia leem hoje por `elementosCombate()` (`mesa-core.ts`): os dois do `artes-grid-mesa.ts` e o
`cardCriaturaHTML` do `mesa-bestiario.ts`. O `criaturas.astro` também passa por ela. **A busca por
`fraquezas|resistencias` em todo `.ts`/`.astro` de `src/` não achou leitor no topo da criatura.** Os
outros acertos são:

- o editor do bestiário, que escreve o campo;
- o `BestaCard`, que já lê `i.combate`;
- o `danoNoAlvo`, que recebe o campo por parâmetro.

Fechado, com a prova no tema e registrado como a forma "fechar a frente sem fechar o documento".
**Não achei caminho sem cobertura.**

### 2 · Os dois I5

O primeiro (o editor de cenário) fica com a sigla. O segundo (o anel de Vida remoto) virou **I14**, a
próxima livre depois do I13, com a renumeração registrada na própria linha, como no B13. **Ninguém
citava o segundo pela sigla velha.** As menções a "I5" em `02-projeto-harness.md` são do editor de
cenário; as de `05-fechamento.md` são de outra lista, o instrumento da simulação.

### 3 · A contagem por tipo, e onde ela diverge da do humano

As somas entram na tabela gerada e contam o que está aberto ou parcial e **não adiado**. A palavra que
vale é a primeira da casa que aparece na marcação.

**O total de hoje, depois das mudanças desta rodada:** nos temas A a K há 95 abertos e parciais.

| DECIDIR | FAZER | AUTOR | CONSERTAR | outra marca | adiados |
|---:|---:|---:|---:|---:|---:|
| 45 | 28 | 7 | 3 | 5 | 7 |

**O que só o humano move são 52** (DECIDIR mais AUTOR), contra os 61 da medida dele.

**Por que os números dele diferem, conferido tema a tema contra a tabela que ele mediu:**

1. **O `grep` dele contou também itens fechados**, porque procura a etiqueta em qualquer linha:
   - o A dele dá 13 DECIDIR, porque conta a A21 e as duas A22, que estão fechadas;
   - dá 5 FAZER, porque conta a A20, fechada.
2. **Ele procurou a etiqueta exata** (`[DECIDIR]`, `[FAZER]`) e perdeu as compostas:
   - a C1 e a C2 são "[DECIDIR, BLOQUEADO ...]": o C dele dá 0 DECIDIR, e o meu dá 2;
   - a J1b e a J3 são "[FAZER, depois de ...]": o J dele dá 0 FAZER, e o meu dá 2.
3. **As caixas fechadas desde a medida dele:**
   - rodada 94: B13, D1, E9, E10, K12, K13;
   - rodada 96: J4.
   Por isso os meus números de B, D, E, J e K são menores.
4. **Os adiados desta rodada saem das somas:** C3, D3, D6, H4, I8, J0 e J10.
5. **O item sem sigla do tema J** (a linha de fechamento do `test-grid`) tem "[DECIDIR]" no título. O
   gerador não o classifica, porque ele não tem sigla, e ele cai em "outra marca". O `grep` dele o
   contava.
6. **Os parciais** (A11, I11, I12, K28) não têm etiqueta e caem em "outra marca". O humano não os
   tinha na conta, porque o `grep` dele não pega `[~]`.

**Qual vale:** a gerada, porque sai das caixas e das etiquetas de cada item e o `validate` a mantém.
A leitura dele continua de pé com os números novos: **mais da metade dos abertos de A a K é do
humano, e nenhuma instância pode movê-los.**

### 4 e 5 · As três trilhas e as cinco decisões-raiz

A seção 6 do `Pendencias.md` foi reescrita nas três trilhas, e continua marcada como proposta do
Arquiteto:

- **DECISÃO** tem no topo as cinco decisões-raiz, na ordem do despacho: F7, F3, a camada de Tradição,
  G12, e E4 com E8. Depois delas vem a lista única;
- **EXECUÇÃO** leva a §17, as M e os C, o registro e os [FAZER]/[CONSERTAR];
- **AUTORIA** são os [AUTOR];
- ficam à parte a batalha de verdade e os adiados.

**Os números conferidos:** a F3 trava 47 criaturas, que são **47 das 309** com fraqueza a sagrado,
contadas em `monsters.json` e em `elementos-bestiario.json`. O dente do E8 está no próprio item: 15
pontos saem em 3 intervalos, e 14 saem em 6. O conteúdo desses itens não foi tocado.

A contagem gerada subiu para uma **seção 0**, no topo, com uma frase sobre por que a fila não anda. A
frase não repete número à mão.

### 6 · Os adiados

`[ADIADO]` entra antes da outra etiqueta, na primeira linha do item:
`**C3 · [ADIADO] [FAZER] ...**`. O motivo vai numa linha no fim do bloco. O gerador lê a marca, mostra
o item como "aberto, ADIADO" com a outra etiqueta ao lado, e o tira das somas de trabalho, para a
coluna Adiados. **A marca nova passa pelo teste:** o caso plantado é `[ADIADO] [DECIDIR]`, e o
gerador da 95 falha nas duas asserções dele. Os sete adiados são C3, J0, J10, I8, H4, D3 e D6,
com os motivos do despacho.

### 7 · As duas medidas do L52

| | itens | abertos | parciais | fechados |
|---|---:|---:|---:|---:|
| 08/09/2026 (a primeira, nascida inflada) | 187 | 120 | 4 | 63 |
| 23/09/2026 (esta) | 249 | 161 | 4 | 84 |

**A primeira medida é de 08/09, e não de 10/09 como o despacho diz** (o próprio L52 a data às ~19h55
de 08/09, commit `05c4a92`). Registrada no L52, sem percentual e com as notas:

- dos 21 fechados a mais, **oito** são caixas de trabalho que já estava pronto, fechadas com prova nas
  revisões da 94 e da 96;
- os 62 itens a mais são pendência nova catalogada.

Mesma regra de contagem: as três caixas na coluna 0. A primeira contava num arquivo só; esta conta
nos doze temas.

## PRECISA DE MIM

Nada.

## QUEBROU

Nada. `npm run validate` exit 0.

## BLOQUEADO

O push, pela decisão do humano sobre os commits do Cartógrafo.

## Achados, e o que não consertei

- O falso positivo do `- [x](url)` (anotado no despacho): um link que começa com `[x]` depois de um
  marcador de lista seria lido como caixa. Não consertado, por ordem do despacho.
- O item sem sigla do tema J tem "[DECIDIR]" no título e não entra na coluna DECIDIR. Dar sigla a ele
  é decisão de quem mantém o tema; a 87 o deixou nomeado e não numerado de propósito.
