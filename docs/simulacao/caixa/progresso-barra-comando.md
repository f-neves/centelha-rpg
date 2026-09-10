# Progresso · barra de comando de texto (VOZ.md §8 item 1)

Arquivo de sinal de vida (ARQUITETO.md §1.2). Uma linha por passo, com horário.

- 13:33 — estado real conferido: o smoke de antes (`smoke-comando.mjs`) já tinha terminado
  (exit 1) antes da pergunta chegar; eu só não tinha lido o arquivo de saída ainda. 3 de 5
  casos passaram (abrir pela tecla C, recusa com sugestões, "mover B2" moveu o token de
  verdade). 1 falhou (a asserção do título do confirm de "auto" — suspeito de bug do MEU
  teste, não do app: `uiConfirmar` usa "Confirmar" como título por padrão, e eu passei o texto
  do verbo como mensagem, não como título). 1 não rodou (crashou em cadeia depois da falha
  anterior). Investigando agora, sem reportar concluído até confirmar no disco.
- 13:35 — corrigido o teste (checava o título do confirm em vez da mensagem; faltava esperar o
  diálogo fechar de vez antes de apertar C de novo). Rodando de novo agora.
- 13:41 — rodada 2: "mover" e "auto" confirmados de verdade agora (o teste estava errado, não
  o app). Travou de novo esperando `dialog[open]` sumir depois do cancelar — pode ser timing
  do MEU teste, investigando com diagnóstico extra antes de concluir que é bug do app.
- 13:44 — pergunta do humano (via Arquiteto): o "recusa com sugestões" testado até aqui só
  cobre texto ALEATÓRIO ("blablabla"), não testa uma palavra FONETICAMENTE parecida com um
  comando válido mas fora da gramática. Adicionei um caso novo ("automatica", parecido com
  "automatico" mas não está na lista de palavras do verbo "auto") antes de reportar qualquer
  veredito sobre isso. Rodando agora.
- 13:48 — rodada 3, TUDO no disco, exit 0, todos os 7 casos passaram: C abre a barra · texto
  aleatório recusa com 5 sugestões · "mover B2" moveu o token de verdade · "automatica"
  (parecido com "automatico", fora da gramática) TAMBÉM recusa e não aproxima · "auto" (sem
  desfazer) exige confirmar, mensagem cita o verbo certo · "tirar" (com desfazer) executa
  direto, sem confirmar · nenhum erro de console/página. O travamento anterior era falso
  positivo do meu teste (atributo `[open]` do `<dialog>`, não do app). Indo para
  `npm run validate` e depois `npm run rodada`.
- 13:50 — `npm run validate` verde (exit 0). Commitando com pathspec (só meus 5 arquivos) e
  abrindo a rodada.
