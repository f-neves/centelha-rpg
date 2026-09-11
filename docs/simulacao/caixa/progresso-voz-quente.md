# Progresso · o caminho quente da voz (VOZ.md §10, rodada 34)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa, no instante em que ela fecha, hora lida
da máquina (`date +%H:%M`).

- 22:29 (sha 5f92c18, pós `git pull --rebase`) — começando. Li VOZ.md §9 e §10 inteiros antes de
  qualquer código. Levantamento do item 4 (o cartão vencido) feito antes de decidir construir:
  `resolverGolpeNoAr(atacante, tick)` já existe, é pura (recebe objeto, abre o `<dialog>` sozinha),
  e achar o par atacante/tick vencido sem clique é reusar `naFila()` + o mesmo desempate por ordem
  de fila que `E.devido()` já usa (`grid.astro:9995-10002`). Tamanho pequeno, item 4 fica na rodada.
  Ordem dos itens: 0 (prazo do carregamento), 1 (gramática com números/campos), 2 (folha do golpe
  recebe), 3 (cartão vencido), 4 (testes).
- 22:32 — item 0 (prazo) escrito em `comando-voz.ts`: `Promise.race` com 20s (aceitei o número do
  Arquiteto, não tenho como medir carregamento legítimo sem modelo neste ambiente, registro isso no
  aviso). Item 2 do aviso (números/campos na gramática) escrito em `comando-barra.json`
  (`numeros`/`campos`) e `comando-barra.ts` (`interpretarNumeros`, `CampoNumero`,
  `gramaticaDeVoz(campos)` com núcleo+camada). Faltam: tecla V com escuta própria, a folha do golpe
  recebendo de verdade, o cartão vencido, os testes.
- 22:58 — `grid.astro` ganhou `golpeVencidoNaFaixa()` (achado: `E.devido()` do espelho de motor só
  serve no Simultâneo, escrevi uma versão agnóstica de sistema), `camposAtivos()`,
  `aguardarDialogAberto()`, `aplicarPreenchimentos()`/`aplicarNumeros()`, o roteador `receberFala()`
  e a tecla V com escuta própria (`ligarTeclaDeVoz`, captura, ignora repeat/modificadores, solta no
  blur). `segurarVoz()` deixou de exigir `daVez()` (o caminho numérico não depende de vez).
- 23:00 — achado testando: quando nada numérico está ativo, uma fala que COMEÇA com palavra de
  campo (ex. "acerto...") caía no parser de VERBO por falta de contexto, abrindo um escolhedor de
  verbo sem sentido (e travando o teste, que aguardava escolha que nunca chega). Consertado: o
  roteador checa o CATÁLOGO inteiro de campos (não só os ativos) para decidir o domínio, e sem
  cartão vencido mostra a recusa certa da decisão 12 em vez de cair no verbo.
- 23:02 — escrito `scripts/test-comando-voz.mjs` (23 asserções, puro, sem navegador) e registrado
  em `package.json`'s `validate`. Escrito `cenaVozQuente` em `scripts/test-grid.mjs` (novo, atrás de
  `?vozteste=1` expondo `window.__RECEBER_FALA`), provando ao vivo contra a bancada: cartão vencido
  abre e preenche sem clique (decisão 12), a tecla V não deixa a letra cair no campo focado, e
  escrever pelo campo dispara o mesmo recálculo que digitar dispara (pool do dano mudou).
- 23:08 — `npm run validate` roda limpo (a exceção esperada: 27 citações de `ESTADO.md`/
  `Pendencias.md` envelheceram com o deslocamento de linhas em `grid.astro`, mesma situação da
  rodada 33 — não vou reapontar, flagueando ao Arquiteto). `node scripts/test-grid.mjs` sozinho:
  tudo verde, inclusive o cenário novo. Escrevendo o aviso da rodada 34.
- 23:14 — Arquiteto reapontou (48 citações, 3 documentos) e perguntou se `CAMPOS` no roteador
  também alargou a GRAMÁTICA (contrariaria a decisão 2). Não: só o roteamento de texto já
  reconhecido usa o catálogo inteiro; `gramaticaDeVoz(campos)` continua recebendo só
  `camposAtivos()`. Escrevi a distinção no comentário do código, como pedido — e isso deslocou
  mais 10 linhas em `grid.astro`, envelhecendo de novo os quatro documentos que ele tinha acabado
  de reapontar. Flagueando de volta antes de comitar: não vou reapontar por busca de âncora.
- 23:16 — Arquiteto refez o reaponte de uma vez só (contra `HEAD`, os 18 hunks completos, minhas 10
  linhas absorvidas por um hunk já existente): 45 citações conferidas, 0 quebradas. `test-procedencia.mjs`
  verde. Commitando o meu trabalho por pathspec e abrindo a rodada 34.
- 23:21 — rodada enviada (o aviso completo, `npm run validate` verde no pre-commit). Rodei
  `-- --enviar` duas vezes por engano no mesmo minuto; a segunda vez só reescreveu SHA/TOPO do
  próprio aviso (o script detectou e corrigiu, 2 linhas), sem duplicar conteúdo nem quebrar nada —
  registrado para o Arquiteto, sha final abaixo. Árvore limpa.
