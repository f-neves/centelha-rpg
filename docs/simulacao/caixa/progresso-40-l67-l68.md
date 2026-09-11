# Progresso · rodada 40 (o nono lugar do L67, depois o L68)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA, no instante em que ela fecha,
hora lida da máquina (`date +%H:%M`).

- 06:22 (sha e4cfea9, 0 à frente/atrás de `origin/main`): começando. Item 1 primeiro: o nono lugar
  (`grid.astro:10070-10072`, `valoresDoLance`, a coluna "Alcance da arma"). Antes de consertar,
  varri o arquivo inteiro por `HEX_HASTE`/`HEX_CORPO_A_CORPO` e por `alcancaNoCorpoACorpo(` em todo
  `src/`, como pedido.
- 06:26: achei mais dois antes de mexer no nono, os dois registrados e mandados ao Arquiteto, sem
  código ainda. `grid.astro:9591-9593` (`folhaDaAcao`, texto de `avisoAlcance`): o GATE já soma o
  raio desde a rodada 39, só o TEXTO da recusa mostra `HEX_CORPO_A_CORPO`/`HEX_HASTE` crus, mesma
  classe do nono (display, não decisão). `alcance.ts:126` (`alcanceInterpor`): este é gate de
  verdade, não display. Chama `alcancaNoCorpoACorpo(opts.hexagonosDoAgressor, !!opts.haste)` sem o
  terceiro parâmetro; quando o AGRESSOR é grande, o interpositor não ganha o raio do corpo dele
  (`grid.astro:6248` não passa raio nenhum na chamada). Esperando confirmação se os dois entram
  nesta rodada.
- 06:27 · RESPOSTA DO ARQUITETO: o décimo (`:9593`, o texto) ENTRA na 40. O décimo primeiro
  (`alcanceInterpor`) NÃO entra, já é L76 (a Revisora escalou na rodada 39), e as duas leituras
  discordam de QUEM é o raio que falta (eu li do agressor, ela leu do interpositor: as duas apontam
  pra pontas diferentes da mesma linha, ele registra as duas). E a varredura achou sem querer um
  terceiro, maior: o raio do PRÓPRIO ATACANTE não entra em `alcanceDaPeca`/nenhuma das cinco
  chamadas de `raioExtraHex` (todas passam só o alvo), então um Enorme atacando não alcança mais
  longe por ser grande. Não é meu para decidir (pergunta nova ao humano), o Arquiteto abre item
  próprio. Sigo só com o nono e o décimo.
- 06:35 · ITEM 1 (nono e décimo) FEITO E PROVADO AO VIVO. `grid.astro:10072`
  (`valoresDoLance`, a coluna "Alcance da arma") e `:9591-9593` (`avisoAlcance`, o
  texto da recusa) somam `raioExtraHex(alvo)`, a mesma conversão dos outros oito,
  sem copiar número. Terceira peça nova na cena `?cena=corpoacorpo` (`pv`,
  `mesa-mock.mjs`): golpe já agendado contra o Aboleth a distância 4 (fora do
  alcance de qualquer jeito), abre a folha por `window.__ESPELHO.abrir('pv', 2)`
  e lê os dois campos direto do DOM (`#al-ficha-c .al-f.lido[data-l="alc"]
  .al-f-v` e `#al-aviso`), sem recalcular por dentro. Confirmado ao vivo: os dois
  agora mostram "3 hex"/"alcança 3 hexágono(s)", não mais "1". `npm run validate`
  inteiro verde (exit 0), `test-grid-simultaneo`/`test-interpor-mesa` sem
  regressão (o Interpositor, que eu não toquei, continua passando). Começando o
  L68 (item 2), lendo o item inteiro no Pendencias.md antes de código.
- 06:52 · L68 CONSTRUÍDO E PROVADO AO VIVO NAS QUATRO FASES, mas achei uma
  regressão real em `test-grid-simultaneo.mjs` (não meu, de rodadas antigas)
  rodando o `smoke` inteiro. `fdv-dlg` novo (grid.astro), `perguntarForaDaVez`
  (o gatilho é `!grupoDaVez().some(...)`, MESTRE só), `porNoMapa` ganhou
  `motivo:{verbo:'corrigir'|'forahora'}` e `agirForaDeHora` ganhou `destino`
  opcional (pousa o token depois de gravar a dívida). Nenhuma frase escrita à
  mão: o botão usa `fase` para decidir se aparece, o texto usa `foraDeHora(...)
  .porque`. Cena nova `?cena=foradavez` (`mesa-mock.mjs`, 5 peças, uma por
  fase) e `test-l68-foradavez-mesa.mjs` novo (também na matriz do CI):
  confirmam ao vivo as 5 respostas (na vez = silêncio; livre = as duas opções,
  nenhuma cobra; recuperação = a dívida de verdade, com o token pousando
  também; preparo/golpe = só corrigir, com a frase do motor). `npm run
  validate`: só procedência (esperado). A REGRESSÃO: rodando `npm run smoke`
  inteiro, 3 asserções antigas de `test-grid-simultaneo.mjs` quebraram porque
  o bench padrão (`?bench=N`, sem `?cena=`) distribui `tick: i%4` entre as
  peças só para exercitar a fila visualmente, e com `tick_atual=0` isso deixa
  a maioria "fora da vez" por acidente de montagem, não por estado de jogo de
  verdade. Arrastar essas peças para hexágono vazio agora abre `fdv-dlg` em
  vez do `mov-dlg`/silêncio que os testes antigos esperavam. Não mexi nesses
  testes (arquivo grande, de várias rodadas, e é uma pergunta de escopo, não
  só de teste): trouxe ao Arquiteto antes de decidir sozinha.
- 07:15 · FECHADO. Medido como pedido, no bench padrão de 12: com um golpe de
  verdade no ar (`aResolver`), o gatilho de hoje (`!grupoDaVez().some(...)`)
  abriria o diálogo para as 12 peças (o grupo esvazia por inteiro); o
  predicado da peça (`chegouAVez`, novo, ao lado de `grupoDaVez`) continua nas
  mesmas 7 de antes do golpe aparecer. `chegouAVez(c)` substitui o gatilho no
  arrasto. As três asserções de `test-grid-simultaneo.mjs` (agenda
  re-projetada, oferta da Investida, a caixa do avanço forçado) ganharam uma
  linha explícita forçando `c003.tick = 0` (na vez), com comentário dizendo
  por quê, em vez de ensinar as três a fechar `fdv-dlg`. PROVA EXIGIDA: quebrei
  de propósito cada um dos três mecanismos vigiados (`reprojetarAgenda` virou
  `null`, filtrei `investida` fora do `mvModo`, forcei `moverSimultaneo` a
  nunca abrir `mov-dlg`) e confirmei as três asserções ficarem vermelhas, uma
  por vez, revertendo cada quebra antes da próxima. `npx tsc --noEmit`: sem
  erro. `npm run validate`: só procedência (esperado, grid.astro cresceu de
  novo). `npm run smoke` inteiro: verde, 0 falhas, `test-grid-simultaneo.mjs`
  com as 79 de sempre. Rodada 40 (os dois itens) pronta para commit e
  reaponte.
- 06:32: levantamento do L68 feito (por fork, conferido à mão nos pontos que importam:
  `grid.astro:6596-6632` o handler de `pointerup` do arrasto, `:6015-6067` `moverSimultaneo`,
  `:7029-7060` `porNoMapa`, `combate-tempo.ts:898` `foraDeHora`). Achei uma divergência real entre
  o texto do item e o mecanismo que ele manda reusar: `foraDeHora` só devolve `pode:true` na fase
  Recuperação; em `livre` diz "não paga nada", em `preparo` manda abortar (mecanismo diferente), em
  `golpe` recusa. O caso mais comum do L68 (peça `livre`, só ainda não chegou a vez dela no
  simultâneo) cai exatamente na fase que a régua já diz "de graça". Parei antes de codar e trouxe
  ao Arquiteto, sem escrever nada ainda.
