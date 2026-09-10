# Progresso · rodada 33 (VOZ.md §8 item 3: a captura de áudio sobre a barra)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 19:50 — reancorada em `a261855f597d12060b11a81bafcc878bbbea6bc7` (passo 0 do §0 confirmado). Lendo o aviso agora.
- 19:54 — D33a testado ao vivo, achado grave: criei um `public/voz-modelo/model.tar.gz`
  falso (2 KB de lixo aleatório, não 404 — arquivo PRESENTE e corrompido) e segurei o
  microfone. O `HEAD` passa (200 OK), o carregamento entra em "carregando o modelo de voz
  (31 MB)…" e fica travado ali por 20s sem nenhum `pageerror` e sem nenhuma mensagem de
  erro — o mesmo "trava para sempre" que o conserto original resolveu, só que pelo lado que
  o `HEAD` não cobre. Script e arquivo falso apagados depois do teste. Ponto 2 (gramática):
  `gramaticaDeVoz()` lida por completo (`comando-barra.ts:105-108`), confirmada sem hexágono
  e vinda só do JSON — bate com o aviso.
- 19:57 — ponto 3: tentei achar um jeito de armar `COMANDO_ARMADO` sem voz real (como fiz no
  D32b) e não achei nenhum — só `segurarVoz()` (precisa de modelo carregado) ou
  `receberFalaComando` (precisa do callback do reconhecedor Vosk de verdade) escrevem nele,
  e não há gancho de teste exposto nem mock na bancada. Registrado com todas as letras no
  veredito o que ficou sem prova viva, e a leitura de código que substitui, até onde vale.
  Ponto 4 (D33b): custo e consequência conferem com o julgamento 1 (modelo ausente, o caso
  real de produção, degrada limpo). `npm run validate`: exit 0, rodado por mim. Veredito
  escrito (`33-revisora.md`): SEGUE, com uma ESCALA sobre o achado do julgamento 1.
  Commitando os dois arquivos juntos agora e empurrando. Terminado.
