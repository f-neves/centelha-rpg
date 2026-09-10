# Progresso · rodada 31 (mover contra hex invalido, silencio pela barra de comando)

Arquivo de sinal de vida (ARQUITETO.md §1.2 / CONTRATO-REVISORA §6). Uma linha por etapa, com horário.

- 14:33 — reancorada em `4a36d063b164ec32460f39c3e944335cd48e76a6` (passo 0 do §0 confirmado:
  `git rev-parse --show-toplevel` e `git rev-parse HEAD` batem). Lendo o aviso
  (`31-executora.md`) e o diff do commit de trabalho `9fb409f` agora.
- 14:41 — diff lido (17 linhas, só `grid.astro`, as três checagens em `executarComando`
  antes de `porNoMapa`). Bate com o aviso. Escrevendo script próprio para testar os 3 casos
  ao vivo contra a bancada de verdade, já que o L62 (sem teste automatizado) continua aberto.
- 14:52 — os 3 casos rodados ao vivo (bancada 24×16 de verdade, não presumido): "mover Z99"
  → "fora do tabuleiro (24×16)"; "mover A1" de novo → "já está em A1"; "mover D1" (ocupada)
  → "já está ocupada". As três mensagens batem com o que o aviso cita. Script apagado depois
  de usar. `npm run validate`: exit 0, rodado por mim. Formando o veredito e as duas
  respostas que o Arquiteto pediu de frente.
- 15:05 — veredito escrito (`31-revisora.md`): SEGUE, com as duas respostas de frente
  (D31a aceito + número novo recomendado; conferência do "fora do tabuleiro" refeita ao
  vivo e confirmada). Commitando os dois arquivos agora. Terminado.
