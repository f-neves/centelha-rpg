# Progresso · rodada 51 · L87

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 02:59 · Rodada aberta (`npm run rodada`). Tarefa: o levantamento antes do
  código, três números pedidos pelo Arquiteto:
  1. dos 9 chamadores de `gravarPeca` (`grid.astro:2656`), quantos já tocam
     a campainha (`avisarAgora`) logo depois, medido por LEITURA de cada um,
     não por janela de linhas;
  2. algum chamador precisa escrever SEM avisar, de propósito?
  3. as três escritas de condição das Artes (`artes-grid-mesa.ts`) cabem no
     `gravarPeca`/`CtxGrid`?
  Regra operacional nova: nunca `git diff`/`git show` cru para varrer (o
  hook trunca); `Grep`/`Read` direto no arquivo, ou `sed -n Np` para número
  de linha. Commitar cada eixo assim que fechar, antes de abrir o próximo.

- 03:05 · LEVANTAMENTO FEITO, lendo cada um dos 9 chamadores de `gravarPeca`
  (`grid.astro:6306,7393,7413,10996,11070,11086,11158,11226,11430`) do
  começo ao fim da função que os contém, e subindo um nível quando a função
  não chama `avisarAgora` ela mesma. Os três números pedidos:

  **1. Quantos já tocam a campainha.** 7 dos 9 chamam `avisarAgora` na MESMA
  função, poucas linhas depois (nunca imediatamente colado, de 3 a 9 linhas,
  sempre depois do `if (error) return`): `levantarDoChao` (os dois, `7396` e
  `7423`), `curar` (`11090`), `ajustarMana` (`11162`), `gastarMana`
  (`11230`), `devolverVida` (`11434`), e o `gravar:` de `abrirCondicoes`
  (`11070`) por tabela: `mesa-condicoes.ts` chama o `ctx.repintar` que
  `abrirCondicoes` passa (`11072`: `pintarLista(); avisarAgora('combatentes')`)
  logo depois do `ctx.gravar` resolver, então a notificação é garantida pelo
  mesmo autor, só que por indireção.

  Os 2 que faltam (`baixarVida`, `10996`, e `marcarInvestida`, `6306`) NÃO
  chamam `avisarAgora` dentro de si: delegam para quem as chama.
  `baixarVida` tem dois chamadores (`aplicarDano:11039`, `tirarVida:11121`),
  e os DOIS avisam, então na prática ela está coberta.

  `marcarInvestida` tem dois chamadores, e SÓ UM cobre: `varrerInvestida`
  (chamada por `avancarTickSimultaneo`) não avisa ela mesma, mas
  `avancarTickSimultaneo` termina com `avisarAgora('tokens');
  avisarAgora('combatentes')` (`5869`), e isso vem DEPOIS de
  `varrerInvestida` (`5762`) no corpo da função, então cobre. O outro
  chamador, `declararAtaqueSimultaneo`, NÃO cobre: ele chama `gravarRelogio`
  primeiro (`6369`), que avisa (`8942`), e SÓ DEPOIS chama `marcarInvestida`
  (`6374`), que grava a condição sem mais nenhum aviso depois. **Esta é uma
  recusa silenciosa de verdade**: a marca de "investindo" entra no banco e
  nenhum assinante de `combatentes` é avisado disso especificamente, porque
  o único aviso da função já tinha disparado para uma gravação anterior e
  diferente (tick/ação), não para esta.

  Achei uma SEGUNDA recusa silenciosa, fora dos 9 (mas do mesmo naipe, e
  pedida pela pergunta 2): `varrerCondicoesVencidas` (`artes-grid-mesa.ts:1833`,
  chamada por `verificarEfeitos`, `:1873`) escreve `condicoes` quando uma
  condição com `ate` vence. Logo depois, `verificarEfeitos` tem
  `if (!ATIVOS.length) return;` (`:1880`) ANTES de chegar em qualquer
  `ctx.repintar()`. Se não há Arte nenhuma ativa no tabuleiro (o caso comum:
  a maioria das cenas não tem Arte no chão), a função devolve sem repintar
  nem avisar NADA. Conferi os 5 chamadores de `verificarEfeitos`
  (`rolarIniciativas:5367`, `editarIniciativa:5387`, `encerrarVez:5440`,
  `avancarTickSimultaneo:5870`, `porNoMapa:7321`): os CINCO já chamam
  `avisarAgora('combatentes')` por conta própria, mas ANTES de chamar
  `verificarEfeitos`, nunca depois. A condição que venceu por prazo, quando
  ninguém tem Arte ativa, entra e sai sem avisar ninguém, em qualquer um
  dos cinco caminhos.

  **2. Algum chamador precisa escrever SEM avisar, de propósito?** Não achei
  nenhum. Os 9 (e os dois achados acima) sempre PRETENDEM avisar ao
  sucesso; onde não avisam, é porque ninguém escreveu a linha, não porque
  alguém decidiu que não devia avisar. Os dois buracos achados são os dois
  casos reais: não são os dois que a Revisora enxergou de fora (ela não
  tinha como ver `declararAtaqueSimultaneo` nem `verificarEfeitos` sem ler
  o corpo inteiro), mas são dois buracos de verdade, medidos.

  **3. As três escritas de condição das Artes cabem no `gravarPeca`/`CtxGrid`?**
  Sim, e de um jeito mais direto do que eu esperava: `porCondicao`/
  `tirarCondicao`/`varrerCondicoesVencidas` (as três, em
  `artes-grid-mesa.ts:1451,1462,1833`) já escrevem por `ctx.SB.from
  ('combatentes').update({ condicoes })`, e `ctx.SB` JÁ É a fachada que
  desvia MESTRE/jogador (`sbDoJogador()`, `grid.astro:2719`, que chama
  `jogador_muda_peca` por baixo): não precisam de um desvio novo, só de um
  PONTO ÚNICO. O idioma já existe, é o do `gravarToken` do eixo 1: uma
  função em `grid.astro` (`gravarCondicao(cid, novas)`, ou um nome
  parecido) que grava E avisa, exposta em `CtxGrid` do mesmo jeito que
  `gravarToken` já é. Os 9 chamadores do lado do Grid passariam a chamar
  ela em vez de `gravarPeca` quando o campo é `condicoes`; os 3 da Artes
  passariam a chamar `ctx.gravarCondicao` em vez de `ctx.SB.from(...)`
  direto.

  UMA DIFERENÇA QUE PRECISA DE DECISÃO, não resposta minha: o lado do Grid
  avisa com `avisarAgora` (sempre dispara); o lado das Artes avisa com
  `ctx.repintar` → `avisarMudancas` (só dispara se uma assinatura de estado
  mudou de verdade). Unificar os dois exige escolher um dos dois
  comportamentos, ou os dois `gravarCondicao` continuam distintos por razão
  escrita. Não decidi isso, só medi.

- 03:34 · DECISÃO DO ARQUITETO: as duas campainhas não são alternativas.
  `avisarAgora` já chama `marcarEstado()` (o "por conferido" que impede
  `avisarMudancas` de tocar de novo pela mesma mudança), então o desenho é
  `gravarPeca` avisar com `avisarAgora('combatentes')` no sucesso, e o
  `ctx.repintar()` das Artes continuar existindo só para o que MAIS muda
  numa conjuração (as manchas, a névoa), sem precisar recuar.

  EIXO ÚNICO ESCRITO (a rodada inteira é um estrangulamento, não cinco):
  - `gravarPeca` (`grid.astro:2656`) virou `async`, de verdade: espera os
    dois backends, confere `error`, chama `avisarAgora('combatentes')` só
    no sucesso, devolve `{ error }`. Antes devolvia o builder do Supabase
    cru (por isso o `as any` que morava em `abrirCondicoes`, removido).
  - `gravarCondicao` nova em `CtxGrid`/`ctxArtes()`
    (`grid.astro:2801`/`artes-grid-mesa.ts:92`), mesmo idioma do
    `gravarToken` (L70): `(cid, condicoes) => gravarPeca(cid, {condicoes})`.
  - `porCondicao`/`tirarCondicao`/`varrerCondicoesVencidas`
    (`artes-grid-mesa.ts`) passam a chamar `ctx.gravarCondicao` em vez de
    `ctx.SB.from('combatentes').update(...)` direto. Isso fecha o buraco do
    `varrerCondicoesVencidas` (a condição vencida que só avisava se
    `verificarEfeitos` chegasse ao `repintar()`, e o `if (!ATIVOS.length)
    return` fazia isso nunca acontecer sem Arte ativa): agora o aviso sai
    na hora da escrita, não depende de mais nada acontecer depois.
  - 7 dos 9 chamadores do lado do Grid perderam a chamada explícita a
    `avisarAgora('combatentes')` que existia SÓ por causa desta escrita
    (`levantarDoChao` os dois, `curar`, `gastarMana`, `devolverVida`, e o
    `repintar:` de `abrirCondicoes`).
  - 2 FICARAM com a chamada explícita, e registrados com comentário
    dizendo por quê: `aplicarDano`/`tirarVida` (o lado jogador de
    `baixarVida` chama `jogador_dano` direto, sem passar por `gravarPeca`,
    e aquela é a ÚNICA campainha que aquele caminho tem) e `ajustarMana` (o
    ramo MESTRE escreve `mana_max`+`mana_atual` juntos direto em `SB`,
    também sem passar por `gravarPeca`). Os dois são "na dúvida, deixe os
    dois": dobra no ramo que já usa `gravarPeca`, sem risco de silêncio no
    ramo que não usa.
  - `marcarInvestida` ganhou o comentário explicando o buraco que fechou
    (a declaração de Investida nunca avisava essa escrita específica).

  TESTE: `test-arte-na-mesa.mjs` tinha um `ctx` de mentira sem
  `gravarCondicao` (`CtxGrid` ganhou o campo como obrigatório), e a Arte
  "Prisão" do próprio teste exercita `porCondicao`: faltava e quebrava em
  runtime (sem checagem de tipo nesses testes, bundlados por esbuild). Somei
  o mock (grava no banco de mentira, sem campainha: não há mesa de verdade
  ali para ouvir). 33 asserções continuam verdes.

  BATERIA COMPLETA RODADA: `test-arte-na-mesa` (33), `test-artes-grid`,
  `test-l70-empurrao` (15), `test-l67-corpoacorpo-mesa`,
  `test-l68-foradavez-mesa`, `test-l70-ocupacao-mesa`,
  `test-l84-caidofila-mesa`, `test-l84-levantar-mesa`,
  `test-grid-simultaneo` (79) e `test-grid.mjs` todos verdes. `test-grid.mjs`
  falhou (1 ou 2 asserções, flakiness do arrasto por mouse simulado) em duas
  das quatro rodadas, e passou nas outras duas; confirmado pré-existente via
  `git stash` dos meus dois arquivos (`grid.astro`/`artes-grid-mesa.ts`): a
  MESMA falha aparece no código de ANTES desta rodada, sem eu ter tocado
  `porNoMapa`/`gravarToken` (o caminho que aquele teste mede) nesta rodada.

  `npm run validate`: único vermelho é o portão de procedência, esperado.
  119 citações movidas (edição grande, `gravarPeca` perto do topo do
  arquivo desloca tudo abaixo), em `ESTADO.md`, `Pendencias.md`,
  `CONJURACAO.md`, `Grid_Mobile.md`, `CATALOGO.md`, `VOZ.md`,
  `CONTEXTO.md`, `Auditoria_Tecnica.md`. Não toquei nenhum. Commit pronto,
  aguardando reponte.

- 03:36 · commit BLOQUEADO pelo gancho de pre-commit, como esperado (o
  `validate` do gancho vê as 119 citações acima). Mensagem enviada ao
  Arquiteto com a contagem e os 8 documentos. Parado aqui, sem tocar nos
  documentos e sem `--no-verify`.


