# Rodada 95 · Executora · o CORRIGE da 94 e as três notas

Despacho: `docs/simulacao/caixa/95-despacho.md` (`a74793d`, local). Veredito tratado:
`94-revisora.md` (`43c7ad3`). Progresso com as horas lidas da máquina em `progresso-95.md`.
**Commitado e não empurrado**, por ordem do Arquiteto.

## ENTROU

| arquivo | o que mudou nele |
|---|---|
| `scripts/gen-pendencias.mjs` | recusa (exit 1, com a linha, sem escrever) toda linha com cara de caixa que o formato de item não casa; pula cerca de código; acusa sigla de outro tema; o título só junta linhas quando o negrito foi aberto |
| `scripts/test-gen-pendencias.mjs` | novo: os onze casos da Revisora num tema de mentira |
| `package.json` | o teste no `validate`, logo depois do `test-reapontar` |
| `Pendencias.md` | as três notas |
| `docs/simulacao/caixa/progresso-95.md`, `95-executora.md` | progresso e relato |

### O CORRIGE

A régua de "cara de caixa" é a mesma com que a Revisora varreu os temas:
`^\s*([-*+]|\d+[.)])\s*\[.?\]`. Linha que casa com ela e não casa com o item é **recusada nos dois
modos**: o gerador sai com 1, lista a linha e não escreve o índice. Recusar em vez de só listar é o
que o despacho pede ("o `--check` fica vermelho com ela, não só avisa"), e é o único jeito de o
`validate` ficar vermelho: se a linha só entrasse na lista de anomalias, regerar deixaria o `--check`
verde de novo.

O que muda nos outros casos:

- **cerca de código** (``` ou ~~~): pulada. Não conta, não recusa;
- **sigla com a letra de outro tema:** anomalia, com a caixa contada no tema onde está;
- **título:** a junção de linhas só acontece quando o negrito foi aberto na primeira, e para em
  linha em branco, cabeçalho, cerca ou qualquer coisa com cara de caixa (mesmo recuada).

**Um desvio da letra do despacho, e por quê.** O despacho diz "o título para no fim da linha". Eu
mantive a junção para o negrito que quebra de linha (L29, K28, e outros no L), e a desliguei para o
caso que a Revisora achou (sigla sem negrito). Sem a junção, o L29 volta a sair com o título
"Sete". Com ela restrita assim, o índice real sai **idêntico** ao de antes (`--check` verde, sem
regerar), e o caso da Revisora deixa de engolir a linha seguinte. Se a letra do despacho for a
intenção, basta tirar a junção: os títulos do L que quebram de linha voltam a sair cortados.

### A prova

`scripts/test-gen-pendencias.mjs` monta um tema de mentira por caso, numa pasta descartável, e roda
o gerador de verdade por `--raiz`. Nada do repositório real é lido nem escrito.

- **Os seis que sumiam** (aninhado com espaço, aninhado com tab, `[~]` em subitem, `* [ ]`, `- [ ]**`
  colado, `- [?]`): regerar sai com 1, aponta a linha e não escreve o índice. O `--check` sai com 1.
- **Os outros cinco:** `[X]` conta como fechado; a sigla sem negrito não engole a linha seguinte; a
  sigla de outro tema é acusada; o item em cerca não conta; a sigla minúscula é acusada como sem sigla.

**Um cuidado para o vermelho significar alguma coisa.** No `--check`, o índice é gerado ANTES, a
partir do tema sem a linha plantada, e só depois a linha entra. Com o índice vazio, qualquer gerador
daria vermelho, e a asserção passaria provando nada. Conferido à mão com o gerador velho: subitem
plantado sobre um índice em dia, `--check` **exit 0** ("em dia", 1 item). É o verde calado que a
Revisora achou.

| | resultado |
|---|---|
| gerador novo | exit 0, 18 de 18 |
| **controle negativo:** gerador de `HEAD`, pelo `--gerador` | exit 1, **15 falhas**: as 12 dos seis casos recusados, mais o título, a sigla de outro tema e a cerca. Passam com os dois a base, o `[X]` e a sigla minúscula, que o velho já tratava |
| repositório real | `--check` verde, com a mesma saída de antes: 249 itens, 162 abertos, 4 parciais, 83 fechados, 8 anomalias |
| `npm run validate` | exit 0. O `test-portoes` conta "os 63 testes estão no `validate` ou no `smoke`" e "11 de 16 geradores com `--check`" |

As 57 partes do `validate` conferidas por script, todas com a forma `node scripts/<nome>.mjs`. O
trecho da edição foi ancorado em palavras dos dois lados, por causa do tropeço da 94.

### As três notas

1. **Saiu a causa não testada** ("a marca de 17/09 veio de um `grep` que este ambiente encolhe").
   Ficou o fato: os três conferidos no fonte em 23/09, o C-39 também no HTML gerado (pela Revisora),
   e "não se sabe por que foram marcados como feitos".
2. **O que cada rodada fez:** o livro na 90, ajustes na 91 e na 92; o "ficar parado" na 91, com a
   comparação indo para o motor na 92. A 93 foi o `reapontar.mjs`. Nas seções 1 e 2.
3. **A seção 6** diz que a §17 fecha a frente **no livro**, e que o motor continua sem o teste de
   Frenesi, porque nenhuma tela o rola.

## PRECISA DE MIM

O desvio do título, acima. Se a intenção do despacho for "sempre no fim da linha", é uma linha a
tirar.

## QUEBROU

Nada.

## BLOQUEADO

O push, por decisão do humano sobre os commits do Cartógrafo no `main` local.
