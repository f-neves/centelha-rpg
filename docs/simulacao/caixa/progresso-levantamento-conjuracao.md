# Progresso · levantamento da Conjuração com Preparação (não é rodada)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por ponto fechado dos dez, com horário.

- 16:13 — reancorada em `main`, `95a448155ebe9c64791bca173ee76448d6cc1236` (levantamento,
  não revisão de rodada). Começando a busca pelos dez pontos.
- 16:45 — pontos 1-3 levantados: Efeito/Improviso/Efeito Especial/Parâmetro já existem
  (`regras.json:arcano.improviso`), a régua publicada em `src/pages/artes/regras.astro`.
  Achado grande no ponto 3: `Preparo = 2 + 1×Nível` já existe em código
  (`combate-tempo.ts:270-274`) e dados (`regras.json:2441-2444`), MAS a função
  `reguaDaArte` que a implementa não é chamada em lugar nenhum de `src/` — Artes hoje
  castam sem Preparo nenhum no Grid. Achado maior ainda: "Nível do Efeito" já tem
  definição publicada e é SOMA dos parâmetros (`regras.astro:382`, `regras.json` improviso.regra),
  não o MAIOR parâmetro como o humano descreveu no ponto 2 — candidato a contradição,
  registrando para o Arquiteto reconciliar contra a fala exata do humano.
  Seguindo para os pontos 4-6.
- 17:20 — pontos 4-7 levantados. Achado central: `conjurar()` (`artes-grid-mesa.ts:767-815`)
  é síncrono do início ao fim — escolhe o plano, posiciona, paga Mana e declara tempo, tudo
  no mesmo `finally`, sem NENHUMA suspensão de vários Ticks. Isso significa que a Preparação
  com vários Ticks (o cerne do que o humano descreveu) não existe hoje para Arte lançada
  pelo jogador via a UI — `reguaDaArte` (achado do ponto 3) fica sem uso justamente porque
  não há lugar no fluxo que precise dela. Ponto 6 (abortar) tem regra publicada completa
  (`regras.json:2497-2508`) e código funcionando (`grid.astro:6165` `abortarGesto`), mas só
  serve ação física (P/G/R de arma); não há Preparo de Arte para abortar hoje. Ponto 7: Mana
  paga no mesmo instante em que o efeito é colocado no tabuleiro, não numa saída futura —
  "interromper não custa nada" ainda não é pergunta que o motor de hoje responda, porque não
  há intervalo para interromper. Seguindo para 8-10.
- 17:55 — pontos 8-10 levantados. Ponto 8: só achei um teste de "não perder por dano" ligado
  à SUSTENTAÇÃO de efeito (concentração, Vontade+Acerto Arcano), marcado como `aRevisar` se
  escala com o dano — não achei um teste genérico de "não perder o gesto/Preparo inteiro"
  por sofrer dano fora desse caso, então é "não achei" e não "não existe" (não esgotei toda
  a árvore de aplicação de dano). Ponto 9: `foraDeCombate` (`condicoes.json`) já responde
  exatamente o critério do humano, em 4 condições; não achei código que cancele um gesto em
  andamento quando a condição é aplicada no meio dele. Ponto 10: não existe "não me
  pergunte"; achei o precedente de configuração persistida por mesa
  (`combateDaMesa`/`TEMPO`, botão `#gr-tempo`, `abrirEscolhaDoTempo` em `mesa-tempo-ui.ts`) —
  é o lugar natural para um botão assim.
- 18:15 — achado tardio importante que corrige uma leitura minha de mais cedo (linha 12-15,
  acima): achei `gravarEfeito` (`artes-grid-mesa.ts:1287-1290`) calculando `nivel:
  plano.efeito?.nivel ?? Math.max(1, ...escolhas)` — "Nível do Efeito = maior Parâmetro" JÁ
  EXISTE, sob o nome "nível efetivo", implementado para Arte única e publicado (sem código)
  para conjuração composta (`regras.json:arcano.composta`, "os Ticks seguem a escada do
  maior nível"). NÃO é contradição do humano contra o sistema — é vocabulário e fórmula já
  decididos, só que com outro nome. O documento final usa esta versão corrigida.
- 18:25 — `docs/simulacao/caixa/levantamento-conjuracao.md` escrito, os dez pontos com
  arquivo e linha, "não existe" vs "não achei" distinguidos ponto a ponto, quatro achados
  de destaque ao final. Commitando e empurrando com `git push origin HEAD:main` (§7) antes
  de avisar. Terminado.
