# Progresso · ditado livre e a tela "outra coisa" (VOZ.md §10, rodada 35)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa, no instante em que ela fecha, hora lida
da máquina (`date +%H:%M`).

- 00:06 (sha 82c4d20, pós `git pull --rebase`) — começando. Dimensionamento antes de construir,
  como pedido: item 2 (a tela "outra coisa", `abrirOutra`, `grid.astro:8956-9054`) é PEQUENO, quase
  decalque da folha do golpe da rodada 34 (mesmo contrato de campos publicados, mesmo
  `dispatchEvent`, um campo `<select>` novo). Item 3 (a tela de magia, `abrirConjuracao`,
  `artes-grid-ui.ts:256+`) é MÉDIO-GRANDE e mais arriscado: a UI reconstrói o corpo inteiro a cada
  escolha (`pintar()`), ~8 variáveis vivem só no closure da função (molde/sólido/saída/fatias/
  abertura/ângulo/curvatura/parâmetros), sem repintura isolada reaproveitável — exigiria ~8 setters
  novos dentro de uma função de 600+ linhas nunca lida antes, e vocabulários de enum que não
  existem hoje (nomes de molde, de sólido...). Reportando ao Arquiteto antes de escrever qualquer
  código: proponho cortar a rodada 35 nos itens 1+2, e abrir a magia (item 3) como rodada própria.
- 00:23 — corte aprovado, código escrito e testado. `comando-barra.json`/`.ts` ganharam `tela`
  (ataque/outra) em `CampoNumero`, o tipo `escolha` (opções fechadas, ex. `ou-quando`
  agora/fim) e as palavras de opção entrando na gramática. `comando-voz.ts`: `prepararReconhecedor`
  aceita gramática `undefined` (ditado livre, decisão 7). `grid.astro`: `camposAtivos()` agora
  decide por TELA (ataque/outra) e por visibilidade real (`ou-quando` some fora do P/G/R);
  `aplicarNumeros` abre a caixa certa (golpe vencido OU "outra coisa" pela vez, decisão 4);
  `aplicarPreenchimentos` dispara `change` num `<select>` e `input` no resto, com o comentário
  pedido; `elementoDeDitadoLivre`/`receberDitado`/`CAMPOS_DITADO_LIVRE` implementam "o modo segue
  o foco" (decisão do Arquiteto), com comentário explicando a regra. Hooks de teste novos atrás de
  `?vozteste=1`: `__MODO_DITADO`, `__RECEBER_DITADO`. `scripts/test-comando-voz.mjs`: +11
  asserções (34 no total) cobrindo `escolha`/`tela`/opções na gramática. `cenaVozDitadoEOutra` em
  `test-grid.mjs` (16 asserções): modo segue o foco, ditado escreve de verdade, `outra coisa` abre
  por voz sem clique, `<select>` responde a `change`, recálculo refeito. `npm run validate`: só o
  portão de procedência vermelho (9 citações, deslocamento de linhas de sempre) — flagueando ao
  Arquiteto, não vou reapontar por âncora.
- 00:28 — reaponte do Arquiteto (23 citações, 7d157c0) mais o gancho de coautoria (bf66f24, fora
  desta rodada). Rodada 35 enviada em um único `--enviar` (sha do aviso 082e189, sha de trabalho
  bf66f24). `test-procedencia.mjs` conferido por mim antes de publicar o número no aviso: 73
  citações, 0 quebradas.