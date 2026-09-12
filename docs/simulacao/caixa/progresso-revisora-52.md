# Progresso · revisão da rodada 52

Sinal de vida, hora lida de `date +%H:%M`.

- 04:36: checkout em `5c5cf81` (aviso), HEAD/toplevel conferidos. BASE
  `71a0228` é ancestral de SHA `7b41008`; SHA é ancestral do commit do
  aviso; `git log 7b41008..origin/main` mostra o próprio `5c5cf81` e mais
  um commit do Arquiteto (`4e296bf`, L93, registro do achado 4, depois do
  aviso): TOPO = SHA continua correto para o que estou revisando, o commit
  extra chegou DEPOIS e vai exigir rebase no push, não invalida o recorte.
  Lido `52-executora.md` e `progresso-52-l88.md` inteiros. Quatro pontos de
  ceticismo pedidos, em ordem: (1) o controle negativo falha de verdade
  contra o código velho; (2) a escolha `pintarIniciativa` vs `pintarTokens`;
  (3) `POSICAO_PENDENTE` posta e retirada em TODOS os caminhos de saída de
  `porNoMapa`; (4) a leitura do Arquiteto sobre `avancarTickSimultaneo`
  (três alegações: não marca pendente, ignora o `error`, registra que
  andou mesmo quando a gravação recusou).
- 04:38: `npm run validate` verde, "281 citação(ões)... 39 marcada(s)
  (citação histórica)", exato com o aviso. `test-l88-ocupacao-detector-
  mesa.mjs` rodado, 8 asserções verdes (bate).
- 04:39: PONTO 1, falsificado por mim mesma, não aceitei o `git stash` da
  Executora de segunda mão. Troquei `src/pages/mesa/grid.astro` pela
  versão de `71a0228` (BASE), mantendo o teste novo: rodei, e das 8
  asserções exatamente as 3 do caso positivo (o grito depois de curar)
  falham contra o código velho; as outras 5, incluindo o controle negativo
  do "caso que treme", continuam passando. Não é "verde sobre nada": o
  teste discrimina de verdade. Restaurado o arquivo imediatamente, verde
  de novo nos dois lados conferido.
- 04:40: PONTO 2, conferido e depois testado ao vivo. `conferirOcupacao`
  mora em `pintarIniciativa` (`:4956-4960`), não em `pintarTokens`; `curar`
  de fato não chama `pintarTokens`, só `pintarIniciativa` (já conferido na
  rodada 51). Escrevi um teste ad hoc (`_teste-live-l88-revisora.mjs`,
  deletado depois, nunca commitado): dei "Caído" a `pa` pela caixa de
  condições (mantendo-a no chão mesmo depois de curada), curei a Vida
  (0 gritos, correto, ainda tem Caído), e REMOVI "Caído" pela mesma caixa
  (torna o par ilegal de verdade). Resultado: 0 gritos IMEDIATAMENTE depois
  da remoção; só depois de uma repintura de iniciativa não relacionada
  (curar outra peça em 1 PV) o detector gritou 1 vez. CONFIRMADO: o
  caminho "condição tirada à mão" (`abrirCondicoes`, `repintar: () => {
  pintarLista(); }`, sem `pintarIniciativa`, já achado na rodada 51) também
  escapa do L88 na tela de quem fez a ação, contradizendo a frase do
  comentário de `conferirOcupacao` ("Todos terminam em pintarIniciativa()").
  Script apagado, `git status` limpo conferido.
- 04:41: PONTO 3, lido `porNoMapa` inteiro (`:7384-7437`). Só há UM
  `.add(cid)` (`:7403`) e UM `.delete(cid)` (`:7406`), e o `delete` roda
  logo depois do `await gravarToken`, ANTES do `if (error)`: cobre os dois
  ramos (erro e sucesso) simetricamente. O retorno cedo de "largou onde já
  estava" (`:7393`) acontece ANTES do `.add`, então não precisa de
  `.delete`. Único risco residual: se `gravarToken` REJEITAR (lançar) em
  vez de resolver com `{error}`, o `.delete` nunca rodaria e a marca
  ficaria presa; isso é a mesma suposição que todo outro `await SB...`
  do arquivo já faz (nenhum tem `try/catch`), não uma fragilidade nova
  desta rodada.
- 04:42: PONTO 4, lido `avancarTickSimultaneo` (`:5849` em diante, o bloco
  de `:5897-5929`). `TOKENS[c.id] = {...}` grava OTIMISTA (`:5923`);
  `await gravarToken(c.id, novo.q, novo.r, em);` (`:5924`) descarta o
  retorno por completo, sem `const { error } =`; e a linha seguinte
  (`:5925-5928`) chama `logar` com "avança"/"atravessa" INCONDICIONALMENTE,
  sem checar se a gravação passou. As três alegações do Arquiteto
  procedem: não marca `POSICAO_PENDENTE` (confirmado no ponto 3, só
  `porNoMapa` toca aquele Set), ignora o `error`, e registra o movimento
  como acontecido mesmo quando `gravarToken` recusou. Bate com o commit
  `4e296bf` (L93) que já vi no `git log` do TOPO em diante.
- 04:43: varredura de travessão pelo diff inteiro da rodada (`71a0228..
  7b41008`, via `rtk proxy git diff`, 1168 linhas, batendo com o `--stat`
  de 544+79): zero linhas adicionadas com "—". Escrevendo o veredito.
