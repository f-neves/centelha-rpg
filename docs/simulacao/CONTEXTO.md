# CONTEXTO · o estado corrente, para reabrir e continuar

**Para uma instância nova reabrir uma sessão e saber onde está**, e não para contar história.
Três regras que o mantêm útil:

- **só estado corrente, sem história.** O que fechou mora no `Pendencias.md` e nos commits.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
- **ONDE JÁ EXISTE DONO, APONTA; onde não existe, escreve.** Restabelecer aqui um estado
  que já tem dono é institucionalizar a divergência · foi assim que o registro da migração
  33 passou a dizer menos do que o cabeçalho dela já dizia. **O que este documento carrega
  de próprio é o que veio do chat e não mora em arquivo nenhum.** E apontar é dar nome,
  caminho e para que serve, nunca descrever o conteúdo do outro arquivo (`ARQUITETO.md §5.5`).

Última reescrita: **15/09/2026**.

---

## A frente de simulação (Grid) está ENCERRADA

**Decidido em 06/09/2026: a segunda bateria (a grade de 112 células) não acontece.**
Nove das quinze bandeiras de regra (`Pendencias.md` **L25**) são regra a escrever, e seis
delas (`n1` a `n6`) são o núcleo do Tick inteiro, sem nenhuma rodando isolada: comparar
regras nesse estado custaria mais do que a frente inteira produziu, respondendo uma
pergunta que ninguém fez. O `L25` deixa de ser pré-requisito de bateria e passa a ser o
que sempre foi por baixo: quinze regras publicadas que a mesa não joga · dívida de
produto, não de instrumento. A fila de qual liga primeiro é decisão de jogo.

→ o encerramento por extenso: `docs/simulacao/ESTADO.md`, seção "A FRENTE DE SIMULAÇÃO
ESTÁ ENCERRADA".

**O teto que fica:** o trabalho do mestre na configuração de hoje não é uma coisa, são
três: **51% aritmética** (597.714 gestos), **32% o ⏭**, a cadência do relógio (375.005),
**17% julgamento** (199.238). E **o teto do que os consertos já desenhados tiram é
76,7%** (273.445 de 1.171.957 gestos), e não são duas testemunhas independentes batendo:
é o MESMO contador (`golpeNoTick`, `log.mjs:224-226`) lido por duas exibições
algebricamente equivalentes, que por isso nunca poderiam discordar. → `ESTADO.md`, seção
"O que sobra depois de tudo, e o teto de verdade". (O `02-projeto-harness.md:33` arredonda
os mesmos três termos como 50/33/17 · divergência registrada em **L63**, não corrigida.)

## As bandeiras ligadas na mesa

**`porte` e `gate`, desde 06/09/2026, só na mesa** (`REGRAS_CENA.porte`/`REGRAS_CENA.gate`,
lidos em `folhaDaAcao`, `src/pages/mesa/grid.astro`); **o harness continua sem ler nenhuma
das quinze**, porque a segunda bateria não acontece e ele deixou de ser o alvo.

- **`porte`**: `modificadorPorte`/`porteDeRotulo` (`src/lib/calc.ts`), somado em `ajAtq.flat`.
- **`gate`**: `gatePerfuracaoAbre` (`calc.ts`) contra `perfArma` do atacante, aplicado nos
  TRÊS pontos de `folhaDaAcao` que decidem dano (`contaDoLance`, `fim`, que é o que `aplicarDano`
  de fato usa, e `pintarDano`).
- **Provado na Vida, não só no log**: `scripts/test-bandeiras-mesa.mjs`, asserta em
  `__ESPELHO.pvDe`.

→ estado técnico completo, com os shas: `Pendencias.md` **L22**, **L25**;
`src/data/regras.json`, campo `bandeiras.notaEstado`.

**`teto6` continua desligado, e o que o precede é trabalho, não mais pergunta.** A frase que
justificava a espera ("sentinela e magnitude dividem o mesmo campo") **foi respondida pelo humano
em 10/09/2026**: o campo é `Condicao.velocidade`, e a sentinela é o `-99` da condição
`fora-do-tempo`, que quer dizer **não age** e não "age muito devagar". Quatro das 55 condições usam
o campo, três carregam grandeza de verdade, e nada no formato as distingue · um teto ingênuo ali
transforma "não age" em "age seis Ticks mais rápido", sem exceção e sem teste vermelho.

**E em 12/09/2026 a separação FOI FEITA** (escopo decidido pelo humano: só separar; rodada 57,
código `972d11b`, veredito `88a5cfe`). `fora-do-tempo` carrega a marca `naoAge`, `velocidade` ficou
só com grandeza, `somarCondicoes` devolve as duas coisas separadas, e **o `validate` agora tem a
asserção que impede ligar o `teto6` às cegas**: duas condições sintéticas de +5 somam 10, então um
teto ingênuo de ±6 no ponto de soma fica vermelho.

**O que o Grid faz com o campo, na distinção que o registro estava perdendo:** ele nunca **aplicou**
`velocidade` no relógio e continua não aplicando (falta regra de jogo, não código · o que "não age"
faz com a agenda do Tick não está escrito em lugar nenhum), mas **sempre exibiu** o campo, pelo
diálogo compartilhado de condições. Exibia "vel −99"; hoje exibe "não age", de graça. → **L64**.

## Comando por voz · a frente, e ela já tem código

**`docs/simulacao/VOZ.md` é o dono desta frente** (movido para cá em 10/09/2026, estava na
raiz). Ela **não é fase e não entra na numeração de fases**.

Estado em 10/09/2026:

- **A barra de comando de texto está no Grid e funciona** (`VOZ.md §8` item 1, rodada 30,
  veredito SEGUE): tecla **C** com quem está agindo, gramática fixa em
  `src/data/comando-barra.json`, parser puro em `src/lib/comando-barra.ts`, despachando para
  as cinco funções do Grid que já eram chamáveis direto (`porNoMapa`, `tirarDoMapa`,
  `encerrarVez`, `alternarAuto`, `esperarUmTick`). Sem microfone, sem Vosk.
- **Parado aqui de propósito:** o humano usa a barra numa batalha antes do item 2 (crescer o
  desfazer) abrir, porque o vocabulário real que sair da batalha corrige a gramática antes de
  qualquer construção em cima dela.
- **A bancada de medição do Vosk existe e o humano roda** (`voz-bench.html`,
  `voz-bench-README.md`, biblioteca vendorizada em `voz-bench-lib/`, modelo fora do repo).
  O critério de desistência da frente inteira é dela: falso positivo acima de **1 em 20** e a
  frente encerra.
- **Duas das sete decisões antigas do `Grid_melhorias.md` caíram**: "reconhecimento nativo do
  navegador" e "gramática pela API do navegador" · a especificação perdeu o conceito de
  gramática, e o motor agora é o Vosk embarcado. → `VOZ.md §4`.
- **A regra que decide confirmação, fechada em 10/09/2026:** verbo com desfazer executa
  direto, verbo sem desfazer confirma, até ganhar desfazer.

**O levantamento que dimensionou a frente** (10/09/2026): não existe ponto único por onde toda
ação passe; das dezesseis ações do menu, **cinco são chamáveis direto** com objeto pronto e as
outras oito misturam coleta (`uiFormulario`) ou dependem de diálogo com callback. **O desfazer
cobre só posição e Vida** (`grid.astro:11647` · `function desfazer`), não cobre Mana, a declaração do golpe, o
Tick nem a agenda. **"Escolher arma" não existe** como verbo. **Mana não distingue dar de
tirar** (`ajustarMana`, `grid.astro:11335`, uma função só).

**A regra de ação nova continua valendo:** toda ação NOVA do Grid separa a função que decide o
efeito (recebe objeto, nunca lê `el(...)`/`.value`) da caixa de diálogo que coleta o clique.
Não é retrofit. → `CLAUDE.md`.

## A fase corrente do Grid (fora da simulação)

**Fase 2 · o tabuleiro como experiência completa de combate: FECHADA, 6/6, desde 07/09/2026.**
→ `Pendencias.md` **L34** §6.

**Fase 2.5 · FECHADA, engenharia completa, em 10/09/2026.** Lote 1 (levantamento), lote 2 item
1 (resíduo do relógio) e lote 2 item 2 (a tela da lembrança, construída pelo humano em
`5af06f8`, reverificada com o ensaio dos três sentidos) fecharam, veredito SEGUE nos três. →
`Pendencias.md` **L32**/**L33**. **O que resta não é código:** rodar a migração 33 em produção,
decisão do humano.

**Fase 3 · não começou e não começa** até a mesa reavaliar o plano. Fica congelado mesmo com
material pronto: a Corrida pelo desenho da Investida.

**Fase 4 · bloqueada por pré-requisito que não é de engenharia:** o humano jogar uma batalha de
verdade e trazer a lista do que incomodou. → `PLANO.md` §9.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com coisa
funcionando na mesa.*

## A frente corrente: o JOGADOR NOVO, e ela não é fase

**Uma leitura do livro inteiro, feita como quem nunca jogou**, que virou duas listas: os `C-nn`,
consertos de texto e de dado, e os `M-nn`, lugares onde a REGRA NÃO EXISTE e por isso vão à mesa.
Os três arquivos dela, em `docs/simulacao/caixa/`: `jogador-novo-consertos.md` (os itens e a
seção PARA A MESA), `jogador-novo-decisoes.md` (as respostas do humano, uma entrada por decisão,
com o que cada uma manda fazer) e os `progresso-NN.md` de cada rodada.

**Em 15/09/2026 a frente está na rodada 75**, e toda decisão de mesa já tomada tem commit de
implementação, conferido um a um pelo `git log`. O que continua aberto são as perguntas `M` que
ninguém levou à mesa ainda, listadas na seção PARA A MESA daquele arquivo.

**As últimas decisões, todas de 15/09/2026:**

- **M-08** (`ae515c0`) · a escala de Centelha vai a 12 e o teto do jogador fica em 6, escrito e
  não presumido. Fica aberto nomear os degraus 7 a 12, que é lore.
- **M-21** (`206fcef`) · dano é dano, cura é cura, cai-se em PV 0 ou menos, e **morre-se ao perder
  além do zero até metade do PV máximo**. As duas trilhas Impacto/Letal acabaram.
- **M-21b** (`19afbbc`) · as quatro que a medição abriu: a morte continua sendo marcada só pelo
  mestre, o `inquebrantavel` passa a dizer que o Impacto derruba e para em zero, a cláusula do
  Letal cai da Arte Vida (que passa a curar abaixo de zero) e passar do limite trava as quatro
  entradas de cura.
- **M-21c** (`e9b4c95`) · **o arredondamento do limite depende da Centelha**: sem Centelha para
  baixo, com Centelha para cima. Só muda em PV ímpar.
- **M-24** (`2ac58ef`) · a **Investida é uma Corrida que termina em ataque**, com a escada inteira,
  a corrida contendo o Preparo, o Tick do golpe sendo o encontro, Defesa −4 e mínimo de 5 metros.

**No ar pela rodada 75** (`206fcef..8d2787b`): o bloco `morte` no `regras.json` com o limite
derivado, o capítulo `vida-ferimentos-cura.md` reescrito, a condição `morrendo` e as notas de
Sangramento sem a palavra Letal, e um portão dentro do `validate-data.mjs` que refaz a conta em
cima de cada exemplo publicado. **Em revisão**, ancorada em `0b81484`.

**A rodada seguinte já tem escopo e não abre antes do veredito:** implementar a M-21c, a M-21b e a
M-24.

**Duas coisas que a rodada 75 mediu e que valem fora dela:**

- **o Sangramento já escreve Vida negativa hoje**, por acidente: o tique da condição contínua
  chama `gravarVida` sem piso e `curarPv` (`src/pages/mesa/grid.astro:2682`) só tem teto. É o único caminho do
  projeto que atravessa o zero, e ninguém o desenhou assim;
- **o servidor não conhece Centelha.** A tabela `combatentes` (`supabase/migracao-2.sql:128-142`)
  não tem a coluna, e quem sabe é o cliente, que monta a peça com `centelha` (`src/lib/combate-resumo.ts:161`). Cobra
  resposta quando a trava da cura chegar ao RPC.

## A frente do Grid, que a do jogador novo interrompeu

**Últimas rodadas fechadas, as quatro em 12/09/2026:** a **54** (`L85`, a régua de empurrão das
Artes, veredito `873b772`), a **55** (`L86a`, a Arte `Mão Firme` curando no tabuleiro, código
`57f6bcb`, veredito `3cc14b5`, fechamento `f0d8e0b`), a **56** (`acelerar-a-cura` curando por
nível da Arte, código `65d9b7a`, veredito PROCEDE em `b82ae80`, CORRIGE em `3eeb8fd`) e a **57**
(`L64`, a separação de sentinela e magnitude, código `972d11b`, veredito `88a5cfe`, fechamento
`4b11929`). O que cada uma entregou mora no `Pendencias.md`, nos itens de mesmo nome.

**A régua nova que a 56 escreveu, e ela vale para toda revisão daqui pra frente:**
`CONTRATO-REVISORA.md §8` · **ESCALA e CORRIGE se separam pela PROMESSA, não pela
alcançabilidade.** Achado que contradiz o que a rodada afirma é conserto da rodada, mesmo sem prova
de que alguém chega lá jogando; achado sobre código que a rodada não tocou nem prometeu é ESCALA.

**O que sobra do `L86b`** é o gatilho `armadilha`, que é desenho de regra e não implementação: ele
é família de QUATRO Efeitos (`brasa-retardada`, `semente-adormecida`, `salvaguarda` e
`cura-guardada`) que disparam por condições diferentes, e nenhuma delas está decidida. Para a
`cura-guardada`, com o chão de pé (migração 39): falta o disparo automático na incapacitação, o
disparo pela mão do alvo e a trava de uma cura presa por alvo. → **L86b**.

**Nenhuma rodada nova abre por iniciativa.**

## O congelamento

Nenhuma varredura nova, nenhuma pendência aberta por iniciativa, nenhum conserto fora dos itens
da fase. A exceção permanente é vazamento ou perda de dado em produção. O que aparece de
passagem vira linha no `Pendencias.md` e para ali.

## Como esta sessão é governada (regras de 09-10/09/2026)

- **O orçamento é perguntado, não travado por percentual** (`ARQUITETO.md §0`, substitui a
  regra dos 80%, apagada e não marcada como superada). No início de toda sessão, com o número
  na mão: *"vamos trabalhar com algum limite de sessão ou de semana, ou não?"*. Sem resposta,
  nenhum lote abre. Mesmo com "sem limite", avisar ao passar de 90% e de 95%, e a partir de 95%
  trabalhar em pedaços que fecham sozinhos.
- **Conferir estado antes de afirmar estado** (`ARQUITETO.md §1`, cinco regras). Nenhum relato
  de que alguém está trabalhando, esperando ou terminando sem mtime, `git log` ou processo
  conferido, **para qualquer instância, sem exceção para a que se comporta bem**. Toda tarefa
  nasce com pedido de progresso em disco. Rótulo ("idle", "terminei") não é estado. Quem dispara
  um comando lê o código de saída antes de falar dele. E trabalho alheio na árvore não se põe de
  lado com `stash` para o próprio commit passar: espera-se, ou pede-se que ela commite.
- **A Revisora também escreve progresso em disco**, a cada etapa, com o sha da reancoragem na
  primeira linha (`CONTRATO-REVISORA.md §6`).

## O que espera decisão da mesa, sem dono de código ainda

- **Quem digita o total do dado**, que é o que sobrou DENTRO da decisão do modo `site` de
  12/09/2026 e não é reabertura dela. Hoje é o mestre, e os 398.476 gestos medidos (34,0% do
  trabalho dele) são todos dele; a outra leitura é cada jogador informar o total na ficha dele, o
  que não muda o dado na mão nem a conta e tira trabalho de quem é um passando para quem é muitos.
  Isso mora na fase 5, que não começou. → `Pendencias.md` **L29**, item 1.
- **A migração 33 espera a fila da aba Combate**, e não mais a mão do humano no SQL Editor. Ver a
  decisão abaixo, que diz o que a trava e por quê.

## As decisões da mesa que não moram em arquivo nenhum

Pelo NOME, porque número de opção depende de qual lista se está lendo.

- **A INVESTIDA VALE −4**, e não −6: investir é forma de aproximação, mesma família da
  Corrida, e gasta a guarda dela e nada mais.
- **O GRID ALIMENTA A CONDIÇÃO**: o motor não cobra a Investida, o número mora só na
  condição, e o tabuleiro a põe e a tira.
- **NÃO HÁ TERCEIRO PREÇO** · *onde a mesa corrige o próprio registro, não cobra; onde a
  mesa muda o que aconteceu na ficção, cobra.* É o teste para o resto do Grid.
- **A CONDIÇÃO COM PRAZO VENCE SOZINHA, A POSTA À MÃO NÃO VENCE NUNCA.**
- **O REFAZER NÃO APAGA LINHA DE JOGADOR**: ele reconstrói o que o motor escreveu; a Arte
  que o jogador conjurou é ação dele.
- **REVELAR QUEM JÁ FOI MORDIDO É DECISÃO DE JOGO, e não se toma de passagem** · foi por
  isso que a migração 35 funde o `mordidos` em vez de a view passar a mandá-lo.
- **OPÇÃO DE DECISÃO SE CHAMA PELO NOME, nunca pelo número**, e a generalização: qualquer
  referência por posição a uma lista que existe em dois lugares vai divergir.
- **DECISÃO DA MESA VEM EM MÚLTIPLA ESCOLHA, três opções ou mais**, feita na hora em que a
  decisão aparece e sem pedir licença.
- **A FURTIVIDADE DAS CRIATURAS É POR PORTE E CATEGORIA (Saída B), não por criatura (Saída A).**
  Uma tabela pequena sobre a Destreza, forma da casa (é a mesma do `COURACA` por porte). O preço
  assumido: assassino e camponês da mesma espécie ficam iguais até virar exceção escrita. →
  `Pendencias.md` **L35**, que ainda mostra as duas em aberto e precisa ser marcado com esta
  decisão.
- **PERGUNTA DE REGRA DE JOGO VEM EM LISTA ÚNICA, não item a item** · quando uma frente
  levantar várias, o Arquiteto junta e traz todas de uma vez.
- **O DADO É ROLADO PELOS JOGADORES E PELO MESTRE, E O QUE CHEGA AO GRID É O TOTAL** (12/09/2026).
  Mata as duas formas do modo `site`: a folha aceitando as faces (o `roladaManual` deixa de ser a
  direção) e o site rolando para a mesa confirmar. Somar é da mesa, e o dado fica na mão. →
  `Pendencias.md` **L29**, item 1, com o que isso faz com os tetos publicados lá.
- **A SEPARAÇÃO DE SENTINELA E MAGNITUDE VAI ATÉ A SEPARAÇÃO, E PARA ALI** (12/09/2026): o Grid
  continua não APLICANDO `velocidade` no relógio (exibir é outra coisa, e ele exibe), e `teto6`
  continua desligado, agora com asserção que impede ligá-lo às cegas. → **L64**, fechado.
- **A FILA DA ABA COMBATE VEM ANTES DA MIGRAÇÃO 33** (13/09/2026). A causa é conferida, e não
  suposta: `ordemDaFila` (`src/lib/combate-tempo.ts`) ordena por `(a.tick ?? 0)`, e a linha de
  lembrança que a 33 passa a mandar tem `tick` nulo. Sem conserto, a criatura lembrada sobe ao TOPO
  da fila do jogador, com a Vida da fotografia e sem marca nenhuma. O Grid trata a lembrança certo
  (desenha apagada, bloqueia mirar, tira da contagem); a aba Combate não conhece a coluna. **O que a
  mesa comprou ao esperar:** hoje o vazamento é MAIOR (o bicho no escuro chega com nome, retrato,
  Tick, iniciativa e Vida), e esperar mantém o furo grande aberto mais tempo.
- **O `maos-sobre-a-multidao` ENTRA COM O MOLDE PADRÃO, sem esperar julgamento** (13/09/2026): ganha
  `porNivel` na Cura e passa a curar todo mundo dentro da zona, valor cheio para cada um, com o molde
  Explosão que a `zona` já usa. **O contra que a mesa comprou:** o próprio `regras.json` chama a
  calibragem dos moldes de proposta que ainda espera mesa, então a Arte entra no ar com uma FORMA que
  ninguém julgou, e quem jogar com ela vai calibrar a regra por acidente.
- **"1 PV POR PONTO" DO `cura-guardada` É PONTO DE MANA GASTO** (13/09/2026): cada ponto de Mana
  investido na guarda vira 1 PV guardado. **O contra comprado:** vira conversão linear de Mana em
  Vida sem teto, que é a forma que quebra economia de recurso se a Mana for recuperável entre cenas.
- **COBRA-SE ONDE A NOTA PROMETE, E SÓ ALI** (13/09/2026, e esta decisão SUBSTITUI a que foi tomada
  poucas horas antes, "parâmetro `fixo` ganha preço"). A primeira versão foi tomada sobre um número
  meu que estava errado; com a medida na mão ela caiu. **A medida: 114 dos 140 Efeitos têm algum
  parâmetro `fixo`**, e os mais comuns são `Alcance` (58), `Dificuldade` (46) e `Jogada` (26), que
  ninguém compra · não existe resposta para "quanto custa uma Dificuldade". **Exatamente 3
  parâmetros no catálogo inteiro prometem Mana na nota**, os três `Cura`, e são esses que passaram a
  cobrar (2 por nível da Arte, pelo campo `custaMana`). **O contra comprado:** cria a terceira
  categoria, `fixo` deixa de querer dizer uma coisa só, e a exceção envelhece calada.
- **A CURA EM ÁREA DO `maos-sobre-a-multidao` ENTROU COM O MOLDE PADRÃO** (13/09/2026), e o preço
  real dela não foi o que eu estimei: não era um campo, era um caminho de resolução inteiro, porque
  não existia cura imediata em área em lugar nenhum do motor. → **L86b**.
- **"1 PV POR PONTO" CUSTA UMA COLUNA** (13/09/2026). A decisão de que o ponto é de MANA GASTA tem
  uma consequência que só apareceu depois: o número não é recalculável (a Mana gasta depende da
  Centelha de quem conjurou, que a linha não guarda), então ele precisa ser gravado na hora. É a
  migração 39. **O contra comprado, escolhido com ele à vista:** a coluna nasce com zero
  consumidores na mesa, porque o gatilho ficou para rodada própria.

## O que está começado e não terminado

- **A saída da área** · o lado do MESTRE está feito (o `marcarMordido` relê e funde por chave).
  **O lado do JOGADOR continua incompleto, e não por falta de migração**: o cabeçalho da
  `migracao-35.sql` (linhas 54-59) diz que ela entra **inerte de propósito** · conserta o
  `jogador_muda_efeito` para FUNDIR em vez de substituir, mas a `efeito_visao` que a aba do
  jogador lê continua sem mandar `mordidos` nenhum, corte deliberado. → **L43**, e a família em
  **L41**.
- **A trava genérica dos sete `.map()` de campo a campo** em `gen-monsters.mjs`. Só o de
  `ataques` foi corrigido. → `CATALOGO.md`, caso "o transporte que descarta".
- **A barra de comando não tem teste automatizado commitado**, e `mover` contra casa ocupada
  falha em silêncio total por ela (herdado de `porNoMapa`). → **L62**.
- **O custo acumulado do arranjo não tem fonte nenhuma.** O `caixa/gasto-acumulado.json` é do
  script `duo`, que esta equipe não usa, e parou em 04/09/2026. → **L52**, item 2.

## As migrações

**Quem manda é o cabeçalho de cada `supabase/migracao-NN.sql`**, e ele costuma dizer mais
do que qualquer resumo. O levantamento das pendentes está no **L42**.

**Lido direto no banco em 14/09/2026** (`public.migracoes`): **TODAS as escritas estão aplicadas,
de 1 a 39.** A **34 não existe** como arquivo, e é a única ausência. → **L42**, **L45**.

**A 33, a 37, a 38 e a 39 rodaram em 13-14/09/2026**, e cada uma passou na conferência que o próprio
arquivo escreve. O que elas mudaram para quem joga, em uma linha cada: a **37** nada (comentário e
uma view de conferência); a **38** fez o `acelerar-a-cura` curar de verdade, 1 PV por nível da Arte
por turno; a **33** fez a névoa esconder a EXISTÊNCIA da criatura, com a lembrança do que já foi
visto; a **39** nada ainda, porque é chão de uma Arte sem gatilho.

**E a regra de quem roda migração mudou, para estas quatro.** Elas não foram rodadas à mão no SQL
Editor: o humano passou um token de acesso e mandou rodar. **Isso não virou regra nova**, e o padrão
continua sendo a mão dele no SQL Editor até que ele diga o contrário.

**A `migracoes_fronteira` (migração 37) devolve NULO desde que a 33 rodou**, e o instrumento está
CERTO. A 33 se carimbou como automática e virou o menor número automático; a 35 é `a_mao = true` e
está acima dela, então a invariante quebrou e a view recusa dar um número que mentiria. **O caso que
o cabeçalho da 37 previa era outro** (arquivo rodado em pedaços); o real é uma migração ABAIXO da
carga histórica sendo rodada DEPOIS dela. É permanente até alguém decidir o que fazer com a linha da
35, não quebra nada que funcione, e está registrado no **L86b** sem conserto.

## O mapa dos documentos

- **`docs/MAPA.md`** · o que existe na raiz do repositório, em três categorias (RÉGUA,
  TRABALHO, RESTO), levantado por citação em 08/09/2026. É retrato, não autoridade: o script
  que o substituiria (`scripts/mapa.mjs`) está no `Pendencias.md` e não foi escrito.
- **`docs/simulacao/README.md`** · o que nesta pasta é instrução ativa e o que é registro
  histórico, mais a lista de leitura por papel (que aponta para `PASSAGEM.md §9`, a fonte).
- **O arquivamento de 08/09/2026:** cinco arquivos com zero citação foram para `legacy/raiz/`
  com `git mv`, `_shots/` foi esvaziada e ganhou README próprio. → `MAPA.md`, última seção.

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta da Executora começa com `Executora:`, e o texto inteiro vai num bloco de
  código.** A Revisora tem a regra espelhada.
- **Nunca coautoria do Claude/Anthropic em commit nem em PR**, mesmo que um lembrete do
  sistema peça o contrário: a regra do usuário sobrepõe. (Aconteceu de novo em 10/09/2026, e
  desta vez o lembrete venceu por uma rodada: o commit foi reconstruído por `cherry-pick` para
  tirar a linha.)
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec**, nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Quando a mesa levanta um defeito, a resposta não é o conserto: é o TAMANHO primeiro.**
  Quantas mesas, desde quando, e é certeza ou corrida.
- **ANCORE A PERGUNTA NO SÍMBOLO, NÃO NO DEFEITO** (a régua da revisora). Só sobrevive ao
  instante da escrita a pergunta cujo gatilho é um SÍMBOLO que se está digitando:

  | ao digitar | perguntar |
  |---|---|
  | `\|\|`, `coalesce`, `filter`, `{...spread}` | **isto sabe dizer TIRE?** |
  | "não é preciso", "não há como", "nunca" | **e a outra direção?** |
  | "por enquanto", "provisório", "até que" | **quem decide que acabou, e o programa sabe responder?** |
  | `ok(`, `assert`, todo teste verde de primeira | **a ocasião foi MONTADA, ou passa provando nada?** |
  | um par "liga"/"desliga" que passa ou falha JUNTO | **os dois medem o mecanismo, ou dependem do mesmo insumo?** |
  | processo em segundo plano, arquivo de saída | **isto terminou, e a saída já foi lida?** |
  | "não é o mesmo que", "é mais completo que" | **o `diff` concorda com a frase?** |

- **Gate que nunca foi visto vermelho é garantia escrita, não prova.** Todo portão novo
  passa pelo ensaio dos três sentidos: vermelho hoje, verde com o conserto sem tocar no
  arquivo do portão, vermelho de novo com a regressão de propósito.
- **Falsificação que a máquina não roda se faz num RAMO DESCARTÁVEL**: começa em `falsif/`,
  o assunto do commit começa com `FALSIFICACAO`, empurra, lê o vermelho, apaga o ramo.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado.
- **AS FORMAS TÊM CATÁLOGO, e ele é o dono da lista de perguntas:** `docs/simulacao/
  CATALOGO.md`. Instrumento novo passa por lá ANTES de ser construído. **A lista não é
  contada**: citar "as N formas" envelhece na forma nova seguinte.
- **O CONTRATO DA REVISORA ANTIGA ESTÁ VERSIONADO:** `docs/simulacao/REVISORA.md`, copiado
  em 07/09/2026 de `.claude/CLAUDE.local.md` do worktree `centelha-revisora`. É histórico.
  (Havia uma segunda cópia, `CONTRATO-REVISORA-ORIGINAL.md`, apagada em 10/09/2026 · mesmo
  texto, com um cabeçalho que afirmava o contrário. → `CATALOGO.md`.)
- **A REVISORA NOVA (equipe Arquiteto) TEM CONTRATO PRÓPRIO E ATIVO:**
  `docs/simulacao/CONTRATO-REVISORA.md`, que cresce por decisão do Arquiteto, um achado de
  cada vez.
- **DUAS LISTAS QUE PRECISAM CONCORDAR, sustentadas só por disciplina, divergem.** A régua:
  fonte única (uma gera a outra), ou cópia com detector (asserção que compara as duas nas
  duas direções, com controle positivo).
- **FALHAR FECHADO E TER CONTROLE POSITIVO SÃO DUAS PROVAS DIFERENTES.** Falhar fechado
  impede o falso verde; controle positivo prova que a busca ACHA quando há o que achar.
- **QUANDO NÃO DER PARA ACHAR POR CALL-SHAPE, ACHE POR ÁRVORE SINTÁTICA** (o compilador
  TypeScript rastreando o valor do payload, não o texto da chamada).
- **Achar linha por CHAVE e nunca por posição**, em teste e em prosa. Conferência de
  migração NOMEIA o que o arquivo define, nunca CONTA o que existe.
- **O compilador do Astro cai nesta máquina** (`UnknownCompilerError`). Matar os `node`
  deixados por rodadas anteriores costuma resolver; quando não resolve, o CI decide, e o
  `validate` não usa Astro.
- **O hook do RTK estraga `grep`/`rg` e heredoc no Bash.** Arquivo multilinha vai pelo
  `Write`; busca vai pela ferramenta `Grep` ou por `awk`.
- **O portão de procedência exige âncora e citação NA MESMA LINHA**, e pareia a citação com
  o ÚLTIMO trecho entre crases da linha · cite código com número de linha e reconfira
  quando o arquivo citado crescer acima da citação. **E ele trava commit de qualquer
  frente**: edição não commitada de uma instância desloca linha citada e o portão recusa o
  commit da outra.
- **QUANDO DELEGAR A UM SUBAGENTE, E QUANDO NÃO.** Delega quando é **medição pura**, a
  pergunta é **autocontida** e dá para **conferir o diff antes de aceitar**. Não delega
  quando o trabalho é **ler código de produção passo a passo** para achar causa.
- **O commit do veredito da Revisora pode nascer órfão do `main`** (aconteceu duas vezes em
  10/09/2026): antes de fechar qualquer item a partir de um veredito, conferir
  `git merge-base --is-ancestor <sha> HEAD` e recuperar por `cherry-pick` se preciso.
