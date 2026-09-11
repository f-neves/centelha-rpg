# Progresso · conferência 36 (CORRIGE do vozStatus, ponto 3 da rodada 35)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Conferência curta, não é rodada nova, sem aviso na caixa. Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`.

- 01:00 — reancorada em `a4752a4c9afd041c4f8b4aa81874cc89842518ad` (passo 0 do §0 confirmado). Lendo o diff de `bf8720d`.
- 01:01 — diff lido: `textoOuvindo(ditado)` nova, chamada em `segurarVoz` e espelhada no hook
  `__TEXTO_OUVINDO`. Pontos 1/2 conferidos por leitura: o texto muda de verdade
  ("ouvindo…"/"ouvindo (ditado livre)…"), duas asserções cobrem os dois lados, nenhuma
  palavra nova em `comando-barra.json`/`.ts` (arquivos nem tocados neste commit). Falsificando
  o ponto 3 agora: revertendo `vozStatus(textoOuvindo(ditado))` para `vozStatus('ouvindo…')`
  fixo dentro de `segurarVoz` (só essa linha), rodando `test-grid.mjs` completo em segundo
  plano para ver se as duas asserções novas continuam verdes mesmo com a chamada real
  quebrada — é a prova de que o teste testa a função, não a chamada.
- 01:11 — fui direto no arquivo de saída (`/tmp/falsifica36.log`), sem esperar aviso — o
  processo já tinha terminado (confirmado com o Arquiteto lendo disco antes de mim, terceira
  vez hoje que a notificação atrasa; adotando o hábito de ir direto ao arquivo daqui pra
  frente, sem precisar perguntar). Resultado: as duas asserções novas (`e o TEXTO do status
  muda junto`, `e o texto do status volta a ser o de sempre`) continuam **✓ verdes** mesmo
  com a linha real revertida para `vozStatus('ouvindo…')` fixo — confirma a lacuna descrita.
  Revertido e conferido limpo (`git status`) antes de qualquer outra coisa. Escrevendo o
  veredito.
- 01:11 — `npm run validate`: exit 0, rodado por mim. Veredito escrito (`36-revisora.md`):
  SEGUE, sem CORRIGE novo — pontos 1/2 confirmados, ponto 3 confirmado com falsificação ao
  vivo (as duas asserções continuam verdes com a chamada real quebrada), ponto 4 (jeito
  barato): não achei, concordo com a recusa do caro pelo mesmo motivo estrutural
  (`vozCarregada()`). Commitando os dois arquivos juntos e empurrando agora. Terminado.
