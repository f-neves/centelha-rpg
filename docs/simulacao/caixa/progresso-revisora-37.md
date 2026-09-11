# Progresso · rodada 37 (a porta antes de baixar o modelo de voz + o modelo versionado)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 02:32 — reancorada em `5b17077da3ec4ebf6d9b9d5297c25def94c0e328` (passo 0 do §0 confirmado). Lendo o aviso agora — SEM abrir o diff do `4ab1a58` (o binário de 31 MB) de olho, só `git show --stat` primeiro.
- 02:33 — ponto 1 (a ordem): confirmado por `git log`, não só pelo aviso — `85b69a3` (a porta,
  sem modelo) é anterior a `4ab1a58` (o modelo) na história linear, sem nenhum commit
  intermediário que verse o modelo sem a porta. Ponto 2 (a porta): as cinco exigências da
  decisão 15 conferidas linha a linha no código (`grid.astro`) — as três frases obrigatórias
  no `uiConfirmar`, nada baixa antes da resposta (`await` bloqueia até a escolha),
  sim/não gravados os dois, "não" não prende (`!== true` reabre a pergunta), leitura e
  escrita de `localStorage` em `try/catch` com comentário explicando o "lança no ACESSO, não
  só na chamada". Ponto 3 (`.gitignore`): o diff mexe só no bloco do `voz-modelo`, uma regra
  removida, nenhuma outra tocada. Rodando `test-grid.mjs` completo em segundo plano para
  confirmar `cenaVozConsentimento` ao vivo e cronometrar o passo 5 eu mesma.
- 02:40 — `test-grid.mjs` completo terminou (fui atrás do arquivo, exit 0, a linha final do
  "Grid OK" cita "a pergunta antes de baixar o modelo de voz"). `test-portoes.mjs` rodado por
  mim à parte: verde, sem o falso positivo do D37c. D37c: a frase reescrita ("soltar o botão
  depois é inofensivo") preserva o sentido da original, conferido lendo o texto atual.
- 02:47 — dado novo do Arquiteto: o CI do `4ab1a58` levou 13m32s contra ~3-10m40 dos runs
  anteriores. Medi eu mesma, local, com script à parte (apagado depois): o carregamento real
  do modelo presente leva ~1,3-1,4s aqui ("carregando" às 106ms, "modelo carregado" às
  1417ms) — bate com o número da Executora, confirma que o caminho real é tomado. Não
  consegui reproduzir a ORDEM DE GRANDEZA do CI (minutos) localmente — o hiato fica sem
  explicação por qualquer coisa que eu teste deste worktree. Escrevendo o veredito com essa
  ressalva e uma recomendação.
- 02:48 — `npm run validate`: exit 0, rodado por mim. Veredito escrito (`37-revisora.md`,
  nome corrigido de `38-` para `37-` para casar com o aviso): SEGUE, sem CORRIGE. Uma ESCALA
  nova (o custo do D37b em CI, com o número certo, para o humano decidir). Commitando os
  dois arquivos juntos e empurrando agora. Terminado.
