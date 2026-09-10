# Progresso · rodada 32 (VOZ.md §8 item 2: o desfazer cresce)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, hora lida de `date +%H:%M` no instante em que a etapa fecha — etapa sem hora é honesta, hora inventada não é.

- 19:13 — reancorada em `55e749c729eeca03653256bf0644a94402ddcbaa` (passo 0 do §0 confirmado). Lendo o aviso agora.
- 19:15 — aviso e diff lidos (`8f3ea63`, `comando-barra.json` + `grid.astro`). Lido `relogio()`
  (`grid.astro:4521-4536`) e `verificarEfeitos` (`artes-grid-mesa.ts:1759-1804`) para julgar
  D32a por conta própria, não só o relato: confirmei que `encerrarVez` loga com `acao: null`
  (inalcançável por `desfazer()`) e que `verificarEfeitos` de fato escreve entradas próprias
  também com `acao: null` — o argumento bate com o código.
- 19:17 — D32b: tentei montar a cena em que `daVez()` cai numa criatura, para fechar a lacuna.
  Consegui: declarando "esperar" pela barra para quem estava na vez e avançando o relógio,
  `daVez()` caiu em `c009` (Criatura 10, `g-inimigo`) na segunda volta. Testei "auto" pela
  BARRA nela: sem confirmação (dialogo fechou sozinho), registro 42→43, linha "Criatura 10
  entra em modo automático", e o `Z` (desfazer) tirou a linha de volta (43→42). Fecha a
  lacuna do D32b de vez. Script apagado depois de usar.
- 19:18 — `npm run validate` rodado por mim, exit 0. Veredito escrito (`32-revisora.md`):
  SEGUE, D32a aceito com julgamento próprio, D32b fechado com prova ao vivo, ponto 3
  confirmado. Commitando e empurrando agora.
