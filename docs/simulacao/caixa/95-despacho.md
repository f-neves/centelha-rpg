# Rodada 95 · despacho · o CORRIGE da 94 e as três notas

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 94 fechou com **PROCEDE e um CORRIGE** (`94-revisora.md`, no `main` como `43c7ad3`,
> cherry-pick de `b646f24`). Progresso em `progresso-95.md`, relato em `95-executora.md`.

**Nada disto sobe ainda.** O push continua com o humano, por causa dos commits do Cartógrafo no
`main` local. Commite e não empurre.

## 1 · O CORRIGE: o gerador tem de acusar o que não entende

A Revisora plantou onze casos numa cópia, e seis somem da contagem sem acusação: caixa aninhada
(espaço e tab), `[~]` em subitem, `* [ ]`, `- [ ]**` colado e `- [?]`. Além disso: item dentro de cerca
de código é contado como real; sigla de outro tema no arquivo não é acusada; sigla sem negrito engole a
linha seguinte no título. O `Pendencias.md` promete que o `validate` fica vermelho se índice e temas
divergirem, e esses casos divergem em silêncio.

**O conserto:** toda linha com cara de caixa que o padrão do ITEM não casa é acusada (e o `--check`
fica vermelho com ela, não só avisa); cerca de código é pulada; sigla de letra diferente do tema é
acusada; o título para no fim da linha. **A prova:** os onze casos da Revisora (a lista está no
`94-revisora.md`) viram teste, cada um com o vermelho visto, e o repositório real continua verde.
Entra em toda lista que precisar dele.

## 2 · As três notas, no `Pendencias.md`

- **Nota 1:** sai a frase "a marca de 17/09 veio de um `grep` que este ambiente encolhe" (seção 2,
  consertos C). É causa não testada. Fica só o fato: marcados como feitos, e o defeito continua no
  fonte, conferido em 23/09.
- **Nota 2:** as seções 1 e 2 dizem que o livro entrou nas rodadas "90 a 93"; a 93 foi o
  `reapontar.mjs`. Corrija para o que cada rodada fez.
- **Nota 3:** na seção 6, "fecha a frente do Frenesi" vale para o LIVRO; o motor não tem o teste de
  Frenesi. Diga isso.

## 3 · O relato

`95-executora.md`, as quatro seções da casa. Progresso a cada etapa, com a hora da máquina.
