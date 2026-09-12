# Progresso · rodada 55 · L86a

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 12:27 · Rodada aberta (`npm run rodada`). Tarefa: as quatro Artes de cura
  soma-simples (mao-firme 1 PV/turno, acelerar-a-cura 1 PV/nível,
  cura-guardada 1 PV/ponto, maos-sobre-a-multidao 1 PV/nível em área) não
  fazem nada no tabuleiro hoje. Quatro medidas antes do código: (1) onde
  `pv_atual` é escrito hoje, ponto único ou espalhado, a cura tem que entrar
  pelo MESMO ponto que o dano; (2) existe guarda de teto `pv_max` reaproveitável
  (o `curar` do menu do mestre, `grid.astro`); (3) a volta do chão: o que
  `conferirChao` já faz quando a Vida sobe acima de zero, sem inventar regra
  nova, parar e perguntar se não estiver escrita; (4) a campainha: o caminho
  do item 1 já chama `avisarAgora`? não duplicar. Prova exigida: asserção
  própria por fórmula em 2+ níveis, teto de pv_max, caminho da volta do chão,
  controle negativo por `git stash` de pathspec (como o L84). Fora de escopo:
  L86b (transferir-dor, dreno, refazer-o-corpo), L95, qualquer coisa em
  dreno. Commitar cada eixo ao fechar; nada de commitar antes do reaponte.

- 12:38 · Levantamento fechado, as quatro medidas pedidas, direto no código
  (`grid.astro`, `artes-grid-mesa.ts`):

  (1) `pv_atual` tem DOIS caminhos hoje, não um. `grid.astro`'s `curar()` e
  `baixarVida()` (mestre) escrevem por `gravarPeca` (self-notifica por
  `avisarAgora`). `morder()` e `aplicarDano()`, em `artes-grid-mesa.ts:1731`
  e `:1769`, escrevem cru por `ctx.SB.from('combatentes').update(...)`,
  contando com o `ctx.repintar()` do chamador para notificar depois. É dívida
  já registrada (o bypass do L87), não coisa desta rodada para consertar. A
  cura nova mora em `artes-grid-mesa.ts`, então o caminho local é o do
  `morder`, mas replicar a escrita crua herdaria o mesmo defeito. Em vez
  disso, `CtxGrid` já tem o precedente certo: `gravarCondicao: (cid, condicoes)
  => gravarPeca(cid, {condicoes})` (`grid.astro` ~2808). Proponho um
  `gravarVida` do mesmo formato, uma linha, ao lado de `gravarCondicao`, sem
  mexer em `morder`/`aplicarDano`.

  (2) Teto de `pv_max` existe e é reaproveitável: `curar()` (`grid.astro`
  ~11250) faz `Math.min(c.pv_max ?? antesPv+q, antesPv+q)`. Mesma conta serve
  para a cura nova.

  (3) A volta do chão já está escrita e não precisa de regra nova.
  `conferirFila()` (o nome real de "conferirChao", `grid.astro` ~4792) roda
  dentro de `pintarIniciativa()`, que todo `ctx.repintar()` chama. E
  `foraDaFila(c)` (`grid.astro` ~7341) testa `pv_atual<=0` direto, sem
  depender de condição nenhuma: só de subir a Vida acima de zero já tira a
  criatura da lista de fora-da-fila, se ela não carregar uma condição
  travando (inconsciente etc.), e remover essa condição é um caminho manual
  já coberto, fora do que a cura precisa tocar. O próprio comentário de
  `conferirFila` já cita "a Arte que devolve Vida" como um dos casos
  cobertos. Resposta limpa: não inventei regra, a regra já existia.

  (4) A campainha também está resolvida de graça: `ctx.repintar()` termina
  chamando `avisarMudancas()`, que é diferencial (só dispara o que mudou
  desde a última marca). Se a cura nova terminar chamando `ctx.repintar()`
  (direto ou via `gravarVida`+`gravarPeca`), não duplica aviso, do mesmo jeito
  que `morder` já não duplica hoje.

  ACHADO NÃO PEDIDO, mas que nasce direto do item 3 (fui atrás de como cada
  Efeito dispara, para não inventar regra na hora do código): os quatro
  Efeitos têm TRÊS formas de disparo diferentes, e nenhuma tem cura
  encaixada hoje.

  - `mao-firme` e `acelerar-a-cura` (`gatilho:"por-turno"`, `forma:"alvo"`):
    passam por `grudarNoAlvo`, que só chama `gravarEfeito` e nunca resolve
    nada na hora. A resolução por turno é o laço "quem está pego e ainda não
    sofreu a mordida" dentro de `verificarEfeitos` (`artes-grid-mesa.ts`
    ~1986), e ele barra na entrada: `if (!ef.dano_dados && !ef.condicao)
    continue;` (linha 1989). Os quatro Efeitos não têm `dano_dados` nem
    `condicao`, então o laço pula os quatro hoje. Conserto ao alcance: um
    `ef.cura` no `grid` já existe como campo (tipado em `artes-grid.ts:60`,
    `true` nos quatro JSONs), só que NUNCA é lido em lugar nenhum
    (`Grep` por `\.cura\b` em `artes-grid-mesa.ts` não bate nada). Trocar a
    guarda para `if (!ef.dano_dados && !ef.condicao && !g?.cura) continue;` e
    ramificar dentro do laço (propor cura em vez de mordida, mesma lista que
    o mestre já confirma manualmente hoje, "a mordida não é automática")
    cobre os dois.

  - `cura-guardada` (`gatilho:"armadilha"`, `forma:"alvo"`): o mesmo laço
    EXCLUI esse gatilho na entrada, de propósito: `if (ef.gatilho ===
    'armadilha' || ef.gatilho === 'passivo' || ef.gatilho === 'ao-tocar')
    continue;` (linha 1994). Não existe hoje NENHUM mecanismo de
    observar-e-disparar no tabuleiro: precisa de algo novo, vigiando a
    transição para incapacitado (o mesmo tipo de borda que `conferirFila` já
    vigia para "voltou ao pé", só que para "caiu"). E tem uma segunda
    metade que não é só encaixe de código: o texto diz "quem decide a hora é
    o alvo", e hoje não existe ação, botão nem tempo de jogo para o ALVO
    escolher disparar a própria cura guardada por vontade própria (só o
    disparo automático ao cair é rastreável no estado). Isso é decisão de
    jogo, não medição de código: pergunta para o humano.

  - `maos-sobre-a-multidao` (`gatilho:"imediato"`, `forma:"zona"`): passa por
    `marcarNoChao` (`artes-grid-mesa.ts:863`), que também só desenha a
    figura e chama `gravarEfeito`, sem morder nem curar ninguém. A única
    resolução imediata que existe no arquivo é a de `grudarNoAlvo`, linha
    990, presa a `forma:"alvo"` e a `plano.danoDados`: não serve para zona
    nem para cura. Ou seja, os quatro Efeitos, não só três, estão sem
    encaixe de disparo hoje; a diferença é que os dois primeiros têm laço
    para estender, o quarto não tem laço nenhum ainda.

  SEGUNDO ACHADO, este de dado e não de código: o combinado da rodada dizia
  que `maos-sobre-a-multidao` "compartilha a mesma conta do acelerar-a-cura"
  (1 PV por nível). O `efeitos.json` discorda: o parâmetro Cura dele é
  `"tipo": "padrao"`, não um valor fixo, o que aponta para a tabela padrão
  da Cura em `regras.json` (`arcano.cura.graus.cura`: "2, 1d6, 1d6+2, 2d6,
  2d6+2, 3d6" por grau comprado) com a divisão por alvos que o próprio
  `notas` do Efeito confirma ("o valor continua sendo dividido entre todos
  os que estiverem dentro"). Isso não é soma simples, é dado mais divisão.
  Preciso de decisão: a régua padrão da Cura (dado, com divisão) ou o combinado
  original (soma simples por nível)? Sem essa resposta não dá para escrever a
  fórmula certa nem o teste dela.

  Também sobrou uma palavra sem definição: `cura-guardada` diz "1 PV por
  ponto", e "ponto" não aparece definido em nenhum outro lugar do JSON nem do
  `regras.json` (os outros três dizem "por turno" ou "por nível", claros).
  Não vou adivinhar se é o mesmo número de `plano.nivelArte` com outro nome
  ou uma coisa diferente (pontos de Mana gastos, por exemplo).

  PROPOSTA (não é pedido de permissão para tudo, é recomendação): fechar
  esta rodada em `mao-firme` e `acelerar-a-cura` (mesma forma de disparo,
  conserto do mesmo laço, fórmula sem ambiguidade) mais `maos-sobre-a-multidao`
  SE a régua for a soma simples combinada (preciso da resposta acima antes
  de contar essa terceira como dentro). `cura-guardada` fica para `L86b`: o
  gatilho novo por si só já é trabalho de motor sem precedente, e a metade
  "o alvo escolhe a hora" é pergunta de regra para o humano, não coisa que
  eu deva inventar sozinha.

- 13:03 · Veredito recebido e escopo fechado: só `mao-firme` de ponta a ponta
  nesta rodada, mais a régua que as outras chamam depois. Achado extra do
  Arquiteto, que eu não tinha medido: `parametrosAjustaveis` (`artes-grid.ts`)
  filtra parâmetro `fixo` fora de `escolhas`, então "1 PV por nível" no
  `acelerar-a-cura` não pode ser o grau de um parâmetro que é `fixo` (não tem
  grau nenhum); o "nível" ali é o nível da ARTE, e a linha gravada guarda o
  nível do EFEITO (`plano.efeito?.nivel`, uma constante do catálogo), não
  `plano.nivelArte`. Confirma por que só `mao-firme` fecha.

  Implementado nos três eixos:

  Eixo 1, a régua (`src/lib/artes-grid.ts`): `curaDoEfeito(efeito)` lê só
  `Parametro.pontos`, um campo NOVO e ESTRUTURADO (nunca interpreta a prosa
  "1 PV por turno"). Só `mao-firme` tem `pontos:1` em `src/data/efeitos.json`
  agora; os outros três continuam sem, e por isso a régua devolve `null` para
  eles sozinha, sem precisar de um `if` a mais. Conferido que
  `gen-grid-artes.mjs --check` continua passando: o gerador só reescreve o
  bloco `grid`, nunca `parametros`, então o campo novo não é apagado no
  regen (medido antes de mexer, não depois).

  Eixo 2, o ponto de aplicação: `curarPv` (novo, `grid.astro`, ao lado de
  `gravarPeca`) é o único lugar com o teto de `pv_max`; `curar()` (o menu do
  mestre) passou a chamar `curarPv` em vez de clampar por conta própria,
  MESMO comportamento, medido: a ordem de `atualizarAnel`/`pintarLista`/
  `logar`/`pintarIniciativa` não mudou, só o clamp saiu do corpo da função.
  `ctxArtes()` empresta `curarPv` como `gravarVida` no `CtxGrid`, mesmo
  formato do `gravarCondicao` que já existia. `artes-grid-mesa.ts` ganhou
  `curarAlvo`, que chama `ctx.gravarVida` (não escreve cru como `morder`/
  `aplicarDano`: o bypass do L87 é dívida antiga, não desta rodada).

  Eixo 3, o laço: a guarda de `verificarEfeitos` que só deixava
  `dano_dados`/`condicao` passar agora também deixa cura (lida via
  `EFEITO[ef.efeito_id]` + `curaDoEfeito`, então o improviso, sem
  `efeito_id`, fica de fora sozinho). O ramo de resolução ganha um terceiro
  caso. A caixa de confirmação também mudou: o rótulo do grupo agora segue o
  tipo do item ("Confirmar a mordida" ou "Confirmar a cura", não um rótulo
  fixo para os dois), e o botão de lote perdeu o grupo (fica solto, ANTES do
  catálogo, com o texto neutro "Resolver todos de uma vez") porque ele age
  sobre a lista inteira, que pode ser só mordida, só cura, ou as duas juntas.

  Medi (não assumi) se `saidaDaArte`/`planoDaSaida` precisavam de um ramo de
  cura: não precisam. As duas metades de `verificarEfeitos` (a saída no Tick
  8 e as mordidas pendentes) rodam na MESMA chamada, então o primeiro
  `verificarEfeitos` no Tick de saída já propõe a cura pela lista de
  pendentes, sem depender de `saidaDaArte` fazer nada. É o mesmo
  comportamento que qualquer Efeito de dano com gatilho `por-turno` já tinha
  (a cura não abriu exceção nova).

  Prova: `scripts/test-l86a-cura.mjs` (novo, registrado em `package.json` na
  cadeia do `validate`), 29 asserções: a régua contra o catálogo real (as
  quatro Artes, uma por uma); `mao-firme` curando por TURNO atravessando três
  rodadas (Tick 5/6/12), com o par "mesmo Tick de novo não cura" e "mesma
  rodada em Tick diferente não cura", que é o que distingue "por turno" de
  "uma vez só"; o teto de `pv_max` pela via do despacho, não só a fórmula
  solta; o chão nas duas direções pelo NÚMERO exato (-5 curando 1 vira -4,
  não 0: a fórmula real não tem piso, e um duble com `Math.max(0,...)`
  passaria essa asserção pelo motivo errado); o improviso não cura E a caixa
  de confirmação nem abre; e "uma implementação só" contra o TEXTO de
  `grid.astro` (`curarPv` tem o `Math.min` de `pv_max`, `curar()` não tem um
  próprio). Controle negativo por `git stash push -- src/lib/
  artes-grid-mesa.ts` (só esse arquivo, escopo do meu próprio pathspec): a
  régua (Eixo 1) ficou verde, as sete asserções de despacho (Eixo 2/3)
  ficaram vermelhas, restaurado com `git stash pop` depois de confirmar.
  `npm run validate` roda o arquivo novo limpo; o portão só falha na
  procedência (125 âncoras deslocadas pelas linhas que mexi, nos documentos
  do Arquiteto, esperando o reaponte, como sempre).

  RESÍDUO, não construído: a prosa de `mao-firme` tem uma segunda cláusula
  ("não morre de sangramento enquanto a sua mão estiver nele") que o
  combinado desta rodada não mencionou e que não está implementada. Registro
  para não a rodada reivindicar cobertura que não tem.

  Nada commitado. Esperando o reaponte.

- 13:13 · Correção do Arquiteto: o `tipo: "padrao"` do `maos-sobre-a-multidao`
  em `efeitos.json` não é dado autorado contra um combinado frouxo, é dado
  DESATUALIZADO. O humano decidiu em 12/09 "1 PV por nível, a mesma conta do
  `acelerar-a-cura`" (`Pendencias.md`, L86), e essa decisão nunca foi escrita
  no JSON. Não muda nada em `mao-firme` nem no escopo desta rodada
  (`maos-sobre-a-multidao` continua fora, agora só pelo motivo que já valia:
  zona não tem caminho de resolução nenhum). Corrigi só o TEXTO de duas
  mensagens de asserção e do cabeçalho em `scripts/test-l86a-cura.mjs` que
  descreviam a régua padrão como "dado com divisão" (a leitura errada);
  reexecutei o teste, continua 29/29 verde. Nada de código mudou.

- 13:20 · Dois ajustes na caixa, pedidos pelo Arquiteto depois de conferir no
  disco. (1) O rótulo do grupo (linha ~2054) perguntava `p.cura != null`
  ANTES de `dano_dados`/`condicao`, e a resolução (linha ~2066) resolve na
  ordem inversa (`dano_dados`, depois `condicao`, depois `cura`): um Efeito
  com dano E cura ao mesmo tempo (a forma do `dreno`, L86b: "1 PV a cada 2 de
  dano que passar") sairia rotulado "Confirmar a cura" e resolveria como
  dano. Troquei o rótulo para seguir a MESMA ordem da resolução:
  `p.ef.dano_dados || p.ef.condicao ? 'Confirmar a mordida' : 'Confirmar a
  cura'`. (2) A frase da caixa (`msg`) ainda dizia "Cada criatura SOFRE um
  mesmo efeito"; troquei o verbo para "RECEBE", neutro para os dois casos,
  sem virar duas frases condicionais.

  Adicionei uma sexta cena ao teste (`scripts/test-l86a-cura.mjs`), fabricando
  um Efeito sintético com dano E cura juntos (a forma do `dreno`) para provar
  as duas metades: o rótulo oferecido é "Confirmar a mordida" e a resolução
  de fato tira Vida. Um cuidado que quase me escapou: `verificarEfeitos` não
  confia no `plano.efeito` guardado para ler a cura, relê por
  `EFEITO[ef.efeito_id]`, o catálogo REAL; sem registrar o Efeito sintético
  ali (`M.EFEITO['dreno-sintetico'] = EF_DANO_E_CURA`), a cena estaria
  testando a coisa errada (cura sempre null por catálogo faltando, não pela
  ordem da guarda) e passaria mesmo com o defeito. Conferi isso na prática:
  reverti o rótulo para a versão antiga com a cena já escrita, ela pegou o
  defeito (vermelho), restaurei o conserto, voltou a verde. 32/32 no total
  agora. `npm run validate` continua limpo fora da procedência esperada.

  Nada commitado. Avisando o Arquiteto para o reaponte.
