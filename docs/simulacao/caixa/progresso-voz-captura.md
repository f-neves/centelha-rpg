# Progresso · captura de áudio sobre a barra (VOZ.md §8 item 3)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa, no instante em que ela fecha, hora lida
da máquina (`date +%H:%M`).

- 19:21 (sha 799632e, pós `git pull --rebase`) — começando. Lendo `voz-bench.html`,
  `voz-bench-README.md` e `src/data/comando-barra.json` antes de escrever qualquer linha. Só
  levantamento por enquanto.
- 19:22 — leitura terminada. Achados os três gatilhos de "pare e me diga" que o pedido listou
  (gramática não compartilhável como está, modelo inalcançável do Grid como está). Escrevendo o
  relato agora, sem tocar em código.
- 19:35 — código escrito: `src/lib/comando-voz.ts` (plumbing do Vosk, caminhos padrão
  `public/voz-modelo/`), `gramaticaDeVoz()` em `comando-barra.ts` (fonte única, sem casa),
  `public/voz-lib/` vendorizado, botão `#gr-voz` + `COMANDO_ARMADO` + `ligarCliqueDeVoz` +
  `receberFalaComando` + segurar/soltar em `grid.astro`, e o cancelamento por Esc. Testando agora.
- 19:41 — teste puppeteer contra a bancada achou um bug real: sem `public/voz-modelo/`, a
  degradação graciosa não aparecia (o Worker vendorizado nunca rejeita a promise no 404 do
  modelo, trava para sempre). Consertado em `carregarVoz()`: `fetch(modeloUrl, {method:'HEAD'})`
  antes de entregar ao Worker, intercepta o 404 direto.
- 19:43 — correção reconfirmada por teste puppeteer: mensagem de erro aparece em 504ms, sem
  `pageerror`. `gramaticaDeVoz`/`interpretarComando`/botão/clique-sem-comando-armado/Esc-sem-nada
  também confirmados. Faltam os dois fluxos de ordem de "mover" com voz de verdade (sem
  microfone/modelo neste ambiente, não é possível testar fim-a-fim). Rodando `npm run validate`.
- 19:45 — commitado (0b5dd6e) só o meu, por pathspec, depois de o Arquiteto reapontar as 39
  citações envelhecidas (ESTADO.md/Pendencias.md, ficaram de fora deste commit). Esperando a
  vez dele nos dois documentos antes de abrir a rodada.
- 19:46 — Arquiteto commitou e empurrou (ad6152a), portão verde. Commitando esta última linha
  e abrindo a rodada agora.
