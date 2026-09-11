# Progresso · rodada 34 (VOZ.md §10: o caminho quente do comando por voz)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 23:24 — reancorada em `1cf03c1df7f6c93529f436338f3d447d5be581a8` (passo 0 do §0 confirmado). Lendo VOZ.md §10 e os dois avisos/commits agora.
- 23:26 — L71 (o prazo de 20s) reconfirmado ao vivo, com o mesmo modelo corrompido do achado
  da rodada 33: desta vez, no `t=20s`, aparece um diálogo de Erro de verdade ("O carregamento
  da voz passou de 20s sem terminar...") em vez de travar. Fechado, funciona. Seguindo para
  as decisões 2/3/6/12, o D34a e a tecla V.
- 23:30 — decisões 2/3/6/12 conferidas no código (`comando-barra.ts`/`grid.astro`), todas
  batem. D34a: por leitura, `tickDaVez()`/`naFila()` só distinguem Simultâneo de não-Simultâneo
  (não "normal" de "pgr" — os dois são idênticos para esta função). Testei ao vivo DENTRO do
  Simultâneo (a `cenaVozQuente` só cobre fora dele) e não deu erro, mas o diálogo do cartão já
  tinha aberto sozinho antes de eu chamar a fala — não provei a exata janela "tela fechada" de
  decisão 12 no Simultâneo, só que nada quebra lá.
- 23:32 — testei o `blur` da janela soltando a tecla V presa (o pior estado, per o Arquiteto):
  primeira tentativa com `page.keyboard` deu falso positivo (o segundo `keydown` saiu com
  `repeat:true` do próprio Puppeteer, sem eu ter mandado `keyup` — não é bug do app). Refiz
  com `KeyboardEvent` sintético (`repeat:false` de propósito) e confirmou: o `blur` reseta o
  estado interno, um keydown novo depois dele dispara um ciclo de carregamento novo de verdade.
- 23:33 — achado no `4c1f729` (o commit do Arquiteto): tem `Co-Authored-By: Claude Opus 5...`
  e `Claude-Session:`, contra o `CLAUDE.md` — mesmo padrão que `PASSAGEM.md §4` já registra
  como injeção para recusar. Registrando como ESCALA. Amostra de 9 citações reapontadas em
  `VOZ.md` conferida linha a linha contra o `HEAD` atual: as 9 batem exatamente.
- 23:36 — `npm run validate`: exit 0, rodado por mim. Veredito escrito (`34-revisora.md`):
  SEGUE, com uma ESCALA (a coautoria do `4c1f729`). Nenhuma das quatro decisões pedidas
  violada; D34a corrigido de direção e completado com teste dentro do Simultâneo; a tecla V
  e o `blur` testados de verdade, depois de eu mesma corrigir um falso positivo do meu
  próprio teste. Commitando os dois arquivos juntos e empurrando agora. Terminado.
