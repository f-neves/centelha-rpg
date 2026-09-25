# Rodada 107 · aviso de revisão · os preços das Fases 1 a 3 (armas e armaduras)

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `639851e` · o despacho da 107 |
| **SHA do trabalho** | `6be3ba3` · a faixa é `639851e..6be3ba3` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §0.1, o §0.2, o §6 e o §7 do seu contrato valem. Progresso em `progresso-revisora-107.md`,
veredito em `107-revisora.md`. **A faixa tem dois commits, os dois da rodada:** `b475ab4` (preços,
catálogo, pendências G36 a G41, relato) e `6be3ba3` (uma hora do progresso corrigida). Entre a sua
âncora (`8a194e3`) e a BASE há só commits do Arquiteto, de registro (`ca52ca6`, o fechamento da 106) e
o despacho.

## O que esta faixa faz

Aplica a proposta de preços da revisão econômica, **aprovada pelo autor** em 24/09/2026: 24 preços
(15 armas, 9 armaduras), a lista exata no `107-despacho.md` §1. Regenera o catálogo de
`custo-de-servico-e-itens.md` e o `combate-tempo-bench.html`, ajusta uma frase do aviso "Provisório",
registra G36 a G41 como `[DECIDIR]` e reaponta duas linhas da H6. Nove arquivos, pelo `diff --stat`.

**Os preços são decisão do humano e não se reabrem.** O que se revisa é a aplicação.

Já conferido pelo Arquiteto, para você não refazer do mesmo jeito: os 32 ids do despacho (os 24 que
mudam e os 8 mantidos) contra o JSON publicado, por script, zero divergência. Refaça por outro caminho,
se quiser, e diga qual.

## O que eu mais quero que você aperte

- **A prova dos dardos.** Ela concluiu que o item é UMA unidade (peso igual ao da adaga de arremesso,
  `tipo: "arma"` e não `municao`, a tag `munição` também no arco). Confira cada perna no arquivo e diga
  se alguma outra leitura (ficha, mesa, `lib-equip`, o `(10)` da munição) contradiz.
- **"Todo lugar onde o preço aparece".** Ela diz que o `armas-e-armaduras.md` não tem preço, que o
  `gen-lista-equip.mjs` escreve fora do repositório e que o `precos.mjs` só lê o `precos.json`. Procure
  por outro caminho (preço velho por extenso: "3 po" do Sabre, "1 pl" do Martelo de Guerra, "8 po" do
  Machado Pesado, "8 pp" do Arco Curto, "2 po" da Camisa de malha; e o nome dos itens) no livro, no
  `src/`, nos benches e nos documentos de raiz. Diga o que achou.
- **O aviso "Provisório"** (`custo-de-servico-e-itens.md:10`): a frase nova diz que toda arma e armadura
  do Cap. XIII tem preço e que o catálogo traz sete armas que o Cap. XIII não descreve. Conte as duas
  afirmações.
- **G36 a G41**: as citações de cada uma, por amostra, e diga quantas conferiu; e a H6 reapontada
  (`armas.json:452` e `:470`).
- **Os dois PRECISA DE MIM dela** (Dardos no plural sob "Munição vendida em maços"; os nomes das
  armaduras no catálogo contra o "já foram traduzidos" do aviso): diga se algum é defeito da faixa ou
  se já existia antes dela.
- **O CI:** o deploy do `b475ab4` foi cancelado por ter sido ultrapassado pelo `6be3ba3`; diga o estado
  pelo run inteiro do `6be3ba3`.
