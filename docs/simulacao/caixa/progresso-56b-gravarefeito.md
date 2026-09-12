# Progresso · rodada 56b · CORRIGE em gravarEfeito

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 17:35 · Rodada aberta. Veredito da Revisora em `b82ae80` (PROCEDE), com um
  achado que o Arquiteto reclassifica de ESCALA para CORRIGE, meu: a rede do
  fim de `gravarEfeito` (`ATIVOS.push(daLinha((data || [])[0] || linha))`,
  `artes-grid-mesa.ts:1524`) usava `linha`, o objeto de ANTES da degradação,
  que sempre carrega `nivel_arte`. No ramo em que o insert degradado (sem a
  coluna) tem sucesso mas não devolve `data`, o `|| linha` ressuscitava o
  número que o cliente tinha computado antes de a coluna recusar, exatamente
  o que o comentário ao lado (D01 da rodada 56, escrito por mim) promete que
  não acontece. Rodada afirma cobertura que o próprio ramo falsifica: CORRIGE,
  não causa antiga para outra frente.

  Conserto: variável nova `enviada` (tipada `typeof linha | Omit<typeof linha,
  'nivel_arte'>`), começa em `linha`, e passa a `semNivelArte` no mesmo ponto
  em que o insert degradado troca de objeto. A rede do fim vira `(data ||
  [])[0] || enviada`: o que entra em memória quando o banco não devolve nada
  é o MESMO objeto que foi de fato enviado, nunca o que se tentou antes de
  degradar. Comentário reescrito para nomear o defeito e o veredito
  (`b82ae80`) que o achou.

  `npx tsc --noEmit` quebrou na primeira tentativa (`enviada = linha` sem tipo
  explícito herdava o tipo literal de `linha`, que exige `nivel_arte`
  obrigatório, e a troca para `semNivelArte` não batia). Corrigido com a
  anotação de tipo união acima; `tsc` limpo depois.

- 17:42 · Teste novo: `test-l86b-acelerar-cura.mjs` ganhou a cena 4
  ("insert degradado que não devolve `data`"). `bancoFalso` ganhou o parâmetro
  `semRetornoNoRetry`: com `semColunaNivelArte` e `semRetornoNoRetry` juntos, o
  PRIMEIRO insert (com `nivel_arte`) falha por `PGRST204` como já simulava, e
  o SEGUNDO (o retry, sem a coluna) tem sucesso no `tabelas[...].push` mas
  devolve `data: []`, não a linha. A cena confere: a gravação não falha
  inteira, `ef.nivel_arte` sai `undefined` (não `3`), e a Arte não cura no
  Tick seguinte. 27/27 (22 + 5 novas).

  CONTROLE NEGATIVO, por pedido explícito (obrigatório nesta rodada): `git
  stash push -- src/lib/artes-grid-mesa.ts` (só esse arquivo; `Pendencias.md`,
  `Auditoria_Tecnica.md` e `docs/simulacao/CONTRATO-REVISORA.md` ficaram de
  fora do stash e intocados, o último nem é meu). Contra o código de ANTES do
  conserto:

  ```
  ✗ a linha em memória NÃO "lembra" o nivel_arte do cliente quando o banco não devolveu nada (achou: 3)
  ```

  exatamente o defeito que o veredito descreveu, e a corrida PAROU em seguida
  (`uiEscolher chamado sem resposta preparada`), porque `nivel_arte: 3`
  ressuscitado abriu a caixa de cura que a cena não preparou para abrir: o
  controle negativo não só fica vermelho, ele fica vermelho DA FORMA que a
  história do defeito prevê (a Arte tentando curar quando não devia).
  `git stash pop` devolveu o conserto; rodei de novo, 27/27, verde.

- 17:46 · `npx tsc --noEmit` limpo. `npm run validate` quebrou (16 citações
  envelhecidas: o comentário novo em `gravarEfeito` cresceu e empurrou o resto
  de `artes-grid-mesa.ts` para baixo). `node scripts/reapontar.mjs` (árvore
  sem nada em `git add`, o mesmo jeito que a rodada 56 corrigiu): 16
  citação(ões) movidas, 15 puladas por `(citação histórica)`. Conferi à mão a
  única que eu já tinha corrigido uma vez nesta história, `Pendencias.md:2677`
  (a âncora `ATIVOS.push`): o reapontador escreveu `:1527`, a linha real é
  `:1529` (dentro da janela de ±3 do portão, mas não exata); corrigida para
  `:1529`, confirmada por `Grep` como a única ocorrência de
  `ATIVOS.push(daLinha` no arquivo (o próprio texto da citação já afirma isso,
  e continua verdade). As outras 15 não reconferidas uma a uma por texto: o
  mapa é por hunk do diff, não busca de âncora (a forma que o `L65` proíbe
  seria eu procurar pelo texto de `porCondicao`/`Math.max`/`tirarCondicao`,
  que se repetem várias vezes no arquivo, e adivinhar qual ocorrência é a
  certa sem o mapa).

  `npm run validate` EXIT:0, 290 citações, zero quebrada, depois do ajuste.
  Zero travessão no meu diff (conferido por `Grep` em
  `src/lib/artes-grid-mesa.ts` e `scripts/test-l86b-acelerar-cura.mjs`, nunca
  `git diff`).

  Achado, não ação: `docs/simulacao/CONTRATO-REVISORA.md` está sujo na árvore
  (34 linhas, não minhas), fora do meu pathspec, intocado pelo stash e pelo
  reapontador (não está entre os 12 documentos que ele cobre nesta rodada).

  Fechando: commit com pathspec (`src/lib/artes-grid-mesa.ts`,
  `scripts/test-l86b-acelerar-cura.mjs`, `Pendencias.md`,
  `Auditoria_Tecnica.md`, este arquivo).
