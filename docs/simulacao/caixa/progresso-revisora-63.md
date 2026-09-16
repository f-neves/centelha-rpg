# Progresso da revisora · rodada 63 dela, rodada 79 do projeto

Reancorada em `27c542d3522c0a8c9e004067f7789815f445d62e` (o sha do aviso), conferido por
`git rev-parse HEAD` na worktree `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`, e ele
bate com `git rev-parse origin/main`. Árvore limpa antes e depois do checkout. Hora lida da
máquina.

- 01:58 · reancoragem terminada em `27c542d`, vinda de `587276d` (a ponta da rodada 78, que foi
  ao `main` por fast-forward). Passo 0 do contrato fechado.
- 02:00 · lidos o aviso, o relatório e os diffs (`calc.ts`, `combate.astro`).
- 02:00 · Q1: ACHEI UMA QUINTA porta, e ela não está nomeada em lugar nenhum:
  `combate.astro:2171`, o botão **Reiniciar** com a caixa "zerar PV" marcada, escreve
  `cols.pv_atual = c.pv_max` direto por `upComb`, sem passar por `mexerVida`. Com a Vida em
  −20, devolve a peça viva e cheia. E uma sexta, o formulário da peça (`:1836`), que está
  aberta de propósito e nomeada DENTRO da mensagem de erro da própria trava.
- 02:03 · Q5: o controle positivo dela confere (a frase do `fechar-feridas` COM negrito sai
  vermelha, nomeando `tecnicas.json (regra comprável)`). E achei um lugar de fora: plantei
  "dano Letal" de volta em `regras.json · arcano.cura.outrasArtes`, que é UM DOS SEIS textos
  que a família M-21 consertou, e o portão ficou VERDE. Ele vigia três blocos de `regras.json`
  e a Arte Vida mora num quarto.
- 02:03 · Q2: medi o foco do diálogo. Não há campo no corpo, então cai no `else` do
  `ui-dialog.ts:306`, e `querySelector` devolve por ORDEM DO DOCUMENTO: o cancelar vem antes,
  então o foco fica em "Não curar" e o Enter reflexo fecha a porta. Seguro hoje, e por um
  detalhe que ninguém declarou (o seletor lista `.ui-dlg-ok` primeiro).
- 02:03 · Q3: os dois ramos do desfazer conferem, e o número vem do registro nos dois.
- 02:03 · coautoria limpa, travessão zero nas 216 linhas adicionadas em `src/` e `scripts/`.
- 02:04 · veredito escrito: PROCEDE, com dois CORRIGE. Todas as falsificações desfeitas, árvore
  conferida limpa depois de cada uma.
