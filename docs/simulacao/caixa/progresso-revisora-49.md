# Progresso · rodada 49 (L70: a checagem de ocupação passa a morar no gravarToken)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 22:55 · reancorada em `84cc0b57ed4020e55f0646f66becec54af9cd8de` (passo 0 do §0 confirmado,
  tree limpa antes). Conferi o TOPO por conta própria: `git log 329eedb..origin/main` mostra
  três commits (dois do Arquiteto, um da Executora), `git diff --stat` confirma que só tocam
  `docs/simulacao/caixa/` (49-executora.md, README.md, progresso-49-l70.md), nenhum `src/`
  nem `scripts/`. Procede. Primeira regra nova registrada: depois do `--enviar`, o único
  commit permitido é o do progresso da própria rodada. Ponto de ataque desta rodada: o
  alcance do conserto, não o código em si (o arrasto sobre token posto pode ser interceptado
  como ataque antes de chegar no gravarToken, segundo o próprio achado da Executora), e a
  conta de 6 citações "verdes apontando para linha errada" (calculada à mão pelo Arquiteto a
  partir de cabeçalhos @@, agora justificando uma regra do L65). Lendo o aviso agora.
- 22:58 · lido `49-executora.md` e `progresso-49-l70.md` por completo. Confirmei o 66 total
  (65 grid.astro + 1 mesa-mock.mjs) rodando eu mesma o portão real no commit de código puro
  (`5a6bb93`, antes do reaponte): `EXIT=1`, 66 citações envelhecidas, 65 apontando para
  `grid.astro` e 1 para `mesa-mock.mjs`, batendo exato com a medida original da Executora.
- 22:59 · não aceitei a tabela dos "6 verdes por âncora fraca" (Pendencias.md, a entrada do
  L65) de cabeça. Tracei o primeiro caso a fundo: `rolarAcerto`, velho `grid.astro:10535`.
  Achei a função de verdade em `10441` (ANTES do L70, commit `8ba3cbb`) e confirmei que a
  citação `10535` não aponta pra função, aponta pra um COMENTÁRIO explicativo sobre o mesmo
  bug ("rolarAcerto sempre usa linhas[0]"), presente e correto em `8ba3cbb:10531-10538`. Depois
  do L70 (função foi para `10461`, +20 linhas), o comentário também deveria ter subido para
  perto de `10555` (bate exato com o número que o reaponte usou), mas a citação continuava
  em `10535`, que no estado NOVO cai por acaso perto de uma CHAMADA qualquer de
  `rolarAcerto()` (`grid.astro:10532` em `5a6bb93`), não do comentário. O texto "rolarAcerto"
  bateu ali por coincidência, não porque a citação estivesse certa: falso-verde confirmado de
  verdade, não só de tabela.
- 23:01 · lido `gravarToken` (`grid.astro:2660-2680`) e `porNoMapa` (`:7205-7228`) inteiros.
  Confirma exatamente o descrito: a checagem migrou para `gravarToken`, que devolve
  `{ error: { message } }` no mesmo formato de um erro de rede; `porNoMapa` perdeu a própria
  checagem e o bloco de erro que já existia (desfaz o otimista, `uiErro`) virou o mesmo
  caminho para a recusa. Lido o ponto de interceptação (`:6761`, "SOLTAR EM CIMA DE ALGUÉM
  É ATACAR"): confirmado que este desvio para `resolverAtaque` acontece ANTES de qualquer
  chamada a `porNoMapa`/`gravarToken`, para o gesto específico "arrastar peça já no mapa
  para cima do TOKEN de outra peça". Também confirmei que este desvio é por elemento DOM
  (`document.elementFromPoint`/`.closest('.gr-token')`), não por raio de ocupação: um
  arrasto para dentro do CORPO de uma criatura grande mas fora do elemento visual do token
  dela continuaria caindo no caminho normal (`porNoMapa`→`gravarToken`), que checa
  corretamente. O buraco é mais estreito do que "L67/L70 reabre": é especificamente
  "token sobre token vira ataque sempre", uma questão de design de interface (o mestre
  não tem como reposicionar arrastando peça sobre peça), não uma regressão do estado
  proibido que o L67/L70 existem para fechar.
- 23:02 · rodei `test-l70-ocupacao-mesa.mjs` eu mesma: `EXIT=0`. Falsifiquei o controle
  negativo por conta própria (não aceitei o relato do `git stash` da Executora): removi a
  checagem de `gravarToken` (voltando para o código sem `if (ocupadoPor...)`), rodei de
  novo: `EXIT=1`, 4 falhas: a peça se moveu SILENCIOSAMENTE para a casa ocupada, sem caixa
  de erro, e o registro logou como movimento normal, reproduzindo exatamente o padrão L66
  que o L70 existe para fechar. Revertido imediatamente, `git status`/`git diff --stat`
  limpos (CONTRATO §2), antes de qualquer outra coisa. Rodei também `test-grid-
  simultaneo.mjs` completo: `EXIT=0`, 79 asserções, sem regressão.
- 23:06 · `npm run validate`: `EXIT=0`. `49-revisora.md` escrito, travessão conferido nos
  dois arquivos novos antes de commitar: zero. Indo commitar.
