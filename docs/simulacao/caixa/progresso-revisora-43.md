# Progresso · rodada 43 (L76: alcanceInterpor com os dois lados; L77: o raio do próprio atacante; L80/L81 registrados pelo Arquiteto)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 13:57 · antes de reancorar, conferi por conta própria (não aceitei a palavra do Arquiteto) que
  o meu `HEAD` anterior (`b8b78ae2`, o veredito da 42) estava mesmo órfão: `git merge-base
  --is-ancestor b8b78ae2 origin/main` deu falso, e `09b5c05` (o gêmeo que ele diz ter chegado ao
  `main`) deu verdadeiro. Comparei os dois diffs (`git show <sha>^..<sha>`) linha a linha: 151
  linhas cada, idênticas exceto a linha do próprio hash do commit. Confirmei que `3920074` (o
  destino que ele recomendou) é o próprio commit do aviso desta rodada, descendente de `09b5c05`
  e ancestral de `origin/main`. Fiz o checkout. Nada meu ficou pendente (`git status` limpo antes
  do gesto). Lendo o aviso agora.
- 13:57 · lido `43-executora.md` e `progresso-43-l76-l77.md` por completo. Confirmei a álgebra
  do L77 por conta própria (`alcanceDoCentro = raio + braço`, `braço = max(0, raio-0,5)`), não só
  lendo a prosa: para Médio dá zero, para Enorme (diâmetro 4) dá 3,5, batendo com "4 m"/"2,5 m"
  da tabela do humano. Lido `alcance.ts:75-153` (as duas funções, `alcancaNoCorpoACorpo` e
  `alcanceInterpor`): os parâmetros novos entram como esperado, clamp `Math.max(0,...)`
  independente nos dois lados, nunca encurta. Lido `test-combate-tempo.mjs:533-580,646-660`: a
  invariante Médio-Médio está escrita por extenso (`0, 0`), não por omissão, exatamente o que o
  Arquiteto pediu para não aceitar como prova.
- 13:59 · falsifiquei eu mesma o controle positivo de nível mesa (não aceitei o relato da
  Executora): removi `alcanceCentroExtraHex(atacante)` do `alc` em `valoresDoLance`
  (`grid.astro:10247-10248`) e rodei `test-l77-alcancecentro-mesa.mjs`. Caiu SÓ a asserção do "4
  hex" (voltou a mostrar "1 hex"); as outras seis, incluindo a do `avisoAlcance` (outro caminho de
  código), continuaram verdes. Revertido imediatamente, `git status`/`git diff --stat` limpos
  (CONTRATO §2), antes de qualquer outra coisa.
- 14:00 · risco 2 (as 11 citações de VOZ.md, reapontadas por script e conferidas por ninguém em
  tempo real, só pelo Arquiteto depois, à mão): verifiquei as 11, uma a uma, contra a janela de
  ±3 linhas em `grid.astro` (a mesma regra do portão), sem aceitar a cópia dele. As 11 batem:
  `desfazer` (11237), `ajustarMana` (10930), o comentário "O CAMPO GUARDA AS FACES..." (10005),
  `CAMPOS_ATQ` (10189, citada duas vezes na mesma linha e na tabela), `CAMPOS_ALVO` (10202),
  `document.querySelector('dialog[open]')` (11877), `a.tagName === 'INPUT'` (11876), o comentário
  "A PEÇA SELECIONADA É" (8790), `function folhaDaAcao` (9602), `const campoAlvo = MESTRE`
  (10315).
- 14:00 · risco 3 (os números do L80, 43 envelhecidas e 57 sem âncora em dez documentos): escrevi
  um script próprio (`medir-l80.mjs`, scratchpad, não entra no repo) com a MESMA heurística do
  portão (âncora mais próxima em caracteres, `split('(')[0]`, janela ±3), rodei contra os dez
  documentos nomeados na tabela do L80. Bateu EXATO: total 71/43/57, e as dez linhas da tabela
  por documento também batem uma a uma (`REVISORA.md` 22/22/18, `CONJURACAO.md` 12/8/10,
  `Grid_Mobile.md` 7/6/4, `VOZ.md` 19/2/1, `Migracao_Dominio.md` 3/1/17, `CONTEXTO.md` 4/1/1,
  `CATALOGO.md` 2/1/4, `Auditoria_Tecnica.md` 1/1/1, `Dominio.md` 1/1/0, `Regua_Relacao.md`
  0/0/1). Os três riscos do Arquiteto estão medidos por conta própria.
- 14:03 · rodei `test-combate-tempo.mjs`, `test-l77-alcancecentro-mesa.mjs` (limpo, sem
  falsificação), `test-l67-corpoacorpo-mesa.mjs` e `test-interpor-mesa.mjs`: `EXIT=0` nos
  quatro. `npm run validate`: `EXIT=0`. Travessão: zero no diff de árvore da rodada (usando o
  `BASE` corrigido, `09b5c05 b8ab3ea`). `43-revisora.md` escrito, travessão conferido nos dois
  arquivos novos antes de commitar: zero. Indo commitar.
