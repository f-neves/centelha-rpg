# Progresso · rodada 64 · a fita que diz que cortou, a `M-14` e a `M-11b`

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `f6323b0`. Três frentes, nesta ordem: a fita (as duas metades que eu recomendei e ele
aprovou), a `M-14` (o par Atributo + Habilidade sai da descrição da ação) e a `M-11b` (a Firula
vira Stunt). Se a rodada ficar longa, fecho no que estiver pronto e digo o que sobrou.

- **03:38** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **03:43** · FRENTE 1 (a fita) pronta, as duas metades. `fitaHTML` ganhou uma condicao: quando
  `acao.livre > tickAgora + largura`, a ULTIMA celula leva a classe `continua` e um title que diz
  que a acao segue alem da fita; o CSS e uma mascara que desvanece para a direita, em
  `MesaCab.astro`, sem engordar a celula (mesmo motivo do `agora` usar sombra e nao borda).
  E `resumoDaAcao` passou a dizer `Golpe no t14` enquanto o Golpe esta por vir.
- **03:43** · ENSAIO DOS TRES SENTIDOS do portao novo, dentro do `test-combate-tempo.mjs`, que ja
  esta no `validate`. (1) VERMELHO hoje: guardei os tres arquivos de `src/` com pathspec e o
  portao deu 8 falhas, todas as certas. (2) VERDE com o conserto, sem tocar no arquivo do portao.
  (3) VERMELHO com regressao plantada: troquei `>` por `>=` na condicao do corte e a assercao de
  BORDA pegou (ciclo 12 na fita de 12 cabe exato e nao pode ser marcado). Restaurado do backup.
- **03:43** · e os TRES lugares conferidos, nao so o card: o token do Grid (9), a tira da fila
  (10) e o card do rastreador (12). Com ciclo 15 os tres marcam o corte, nos tres a celula do
  Golpe fica mesmo fora, e os tres dizem `Golpe no t14`. Com ciclo 6 nenhum marca e a celula do
  Golpe aparece nos tres. O portao trava os seis casos.
- **03:43** · quatro citacoes envelheceram porque eu inseri linhas no meio de dois arquivos, e o
  `validate` pegou (este par de arquivos ESTA na lista dos doze). Re-apontadas pela ancora:
  `mesa-tempo-ui.ts` 287->298 (`const SAIDAS`), 418->429 (`const verbo`), 556->567
  (`custoInterporRecuperacao`) no `Pendencias.md`, e `test-combate-tempo.mjs` 309->316
  (`T.temGesto`) no `REVISORA.md`. `validate` verde.
- **03:47** · FRENTE 2 (`M-14`) escrita. A notacao mudou no GERADOR
  (`gen-cap-pericias.mjs`, o molde `linhaPrim`): `*(Destreza . Forca)*` virou
  `*(o usual: Destreza . Forca)*`, e rodei o gerador (24 primarias regeradas, conferidas as 24).
  A regra entrou em `coracao-do-sistema.md` como secao `Quem escolhe o par`, logo depois da
  tabela do pool, com os cinco exemplos da mesa em tabela. E a frase A MAO do `habilidades.md`
  (linha 20, FORA do bloco gerado) dizia que o parenteses 'lista quais', que e leitura fechada:
  passou a dizer 'o usual, nao o possivel', com o exemplo de `Inteligencia + Briga`.
- **03:47** · e a conferencia do item 4, que era a que podia me desmentir: NENHUMA tela restringe
  o par. Varri quem le `habilidades.json`: so o `ficha-engine.ts`, e ele usa os niveis e o XP,
  nunca o campo `atributos`. O unico `select` de Atributo do site (`BestiaEditor.astro:209`)
  oferece os NOVE, montados de `ATR` em `bestiario.astro:24`, sem filtro por pericia. O que
  existe e `mesa-ficha.ts`, que fixa um Atributo por passivo (Investigacao = Percepcao): e
  resumo pre-calculado para o painel do mestre, um PADRAO oferecido, que e exatamente o que a
  decisao abencoa. Nao criei o campo `atributos` nas 66 secundarias, como ele mandou.
- **03:49** · o commit da `M-14` FALHOU com `index.lock`, e foi bom que falhasse: o Arquiteto
  estava commitando no mesmo instante, e o commit dele era `8ca6627`, **retirando o item 2 do
  despacho**. A notacao em italico das pericias NAO muda: a lista publica a INCLINACAO da
  pericia e isso ja esta certo; o que faltava era so a regra do par. Nao mexi no `index.lock`
  (nao e trabalho meu e podia ter git rodando); esperei, e trinta segundos depois ele tinha
  sumido sozinho junto com o `jogador-novo-consertos.md` que aparecia sujo na arvore.
- **03:49** · desfazendo o que a correcao retirou: o `linhaPrim` volta ao que era e o capitulo
  II e regerado. E a secao que eu ja tinha escrito no `coracao-do-sistema.md` precisa de
  reescrita, nao de conserto de virgula: ela dizia `o usual, e nao o possivel` e repetia a
  leitura da Intimidacao que ele acabou de retratar.
- **03:51** · `M-14` refeita segundo a correcao. O `gen-cap-pericias.mjs` voltou byte a byte ao
  que era (saiu do `git diff`) e o capitulo II foi regerado: zero ocorrencias de `o usual:`.
  A secao do `coracao-do-sistema.md` foi REESCRITA e nao remendada, porque o que estava errado
  nela era a tese: ela dizia `o usual, e nao o possivel` e concluia que o par legitimo de uma
  pericia social inclui a Forca, que e exatamente a leitura retratada. Agora ela separa as duas
  coisas na linguagem dele: a lista publica a INCLINACAO, e a combinacao concreta sai da
  descricao. Os cinco exemplos ficam, porque o que ele retratou foi a conclusao e nao o exemplo.
  A frase a mao do `habilidades.md` voltou a `lista quais` e ganhou a palavra inclinacao.
- **03:56** · FRENTE 3 (`M-11b`) escrita, as sete metades. A escada nova em tabela de tres colunas
  no `habilidades.md`; a escolha do jogador (uma por Firula, nao somam); SEM TETO POR CENA dito
  com todas as letras e marcado como decisao e nao esquecimento; a Firula fora do combate, com
  exemplos que nao sao de briga; e o XP do nivel 3 dito como ABERTO. No
  `aparencia-virtudes-vontade.md` os caminhos viraram TRES (o `A-12` fechado) com o numero por
  nivel (2 devolve 1, 3 devolve 3) e o relogio ao lado, que e o que da o peso: uma Firula de
  nivel 3 vale tres noites de sono. E o `relacoes-sociais.md:145` parou de prometer
  `descanso/cena` e passou a dizer a regra.
- **03:56** · no dado: `recuperacaoVontade` ganhou `firulaPorNivel`, `reguaMoral` e
  `tetoPorCena: null` (explicito, para ninguem ler o vazio como falta de numero), e o `aRevisar`
  virou `respondido` mais um `aRevisar` novo, que e so o XP. E o `quanto: 1` virou
  `quantoPorSono: 1`, porque `quanto` deixou de ser verdade no instante em que o nivel 3 passou
  a devolver 3.
- **03:56** · um defeito que a decisao CRIA e que eu nao consertei calado: o
  `arcano.recuperacaoMana.nota` dizia `A reserva nao volta por cena`, e a Firula passou a ser
  porta de Mana dentro da cena. E o mesmo caso do `relacoes-sociais:145` que ele mandou
  reescrever, entao tratei igual: entrou a chave `firula` no bloco da Mana e a nota passou a
  dizer `pelo RELOGIO a reserva nao volta por cena`. Nenhuma prosa publicada repetia a frase
  (varri os 23 capitulos). Nenhuma linha de codigo le `recuperacaoVontade` nem
  `recuperacaoMana`: sao dado de documentacao.
