# Levantamento · Conjuração com Preparação

Não é rodada, não é revisão de aviso: é o que o Arquiteto pediu para levantar antes de
escrever a régua da Conjuração com Preparação. Reancorada em `main`,
`95a448155ebe9c64791bca173ee76448d6cc1236`. Formato: por ponto, o que existe (arquivo e
linha), o que não existe, e onde não achei o suficiente para afirmar uma coisa ou outra.

## O achado que atravessa todos os dez pontos, primeiro

**A conjuração de uma Arte pelo jogador, hoje, é SÍNCRONA do início ao fim — não há
NENHUMA suspensão de vários Ticks.** `conjurar()` (`src/lib/artes-grid-mesa.ts:767-815`) é
uma função só: abre a caixa de escolha do plano, posiciona a figura no tabuleiro, e no
mesmo `finally` (linhas 808-814) já paga a Mana (`gastarMana`) e já declara o custo em
Ticks (`declararTempo`). Tudo no mesmo instante da declaração. Não existe hoje um estado
"em Preparo, aguardando o Tick de saída" para uma Arte lançada pela interface do jogador.

Isso importa para os pontos 3, 4, 5, 6 e 7 ao mesmo tempo: **a régua nova não é um ajuste
num mecanismo que já espera vários Ticks — é a introdução desse mecanismo, que hoje só
existe para o ataque físico comum (P/G/R de arma) e para o ataque de CRIATURA que o
bestiário rotula como conjuração (classe `'arte'` em `classeDeTempo`), nunca para a Arte
que o jogador monta na caixa de escolha.** A fórmula de tempo já existe pronta
(`reguaDaArte`, ponto 3), mas não é chamada de lugar nenhum — ela foi escrita e nunca ligada
ao fluxo real.

## 1 · Efeito, Improviso, Efeito Especial, Parâmetro — e onde os Parâmetros ficam guardados

**Os quatro já são termos do sistema, com implementação atrás, e com os mesmos nomes.**

- **Improviso**: `regras.json:arcano.improviso` (a partir da linha ~1213). "A Arte crua,
  sem XP" (`regras.json:1565`). No código, `plano.efeito === null` significa improviso
  (`src/lib/artes-grid-ui.ts:182`, comentário `efeito: Efeito | null; // null = improviso`).
- **Efeito Especial**: o catálogo em `src/data/efeitos.json` (as ~140 entradas citadas na
  memória do projeto). No tipo, `interface Efeito` (`src/lib/artes-grid.ts:23-33`), com
  campo `nivel: number` próprio — um Efeito Especial JÁ TEM nível fixo de catálogo, não
  computado.
- **Parâmetro**: `interface Parametro` (`src/lib/artes-grid.ts:35-45`), com `nome`, `tipo`,
  `escala`. A régua dos graus 0-6 de cada parâmetro elemental (Alcance, Área, Alvos, Dano,
  Duração, Volume) está em `regras.json:arcano.improviso.graus`.
- **Onde os Parâmetros de uma conjuração são declarados e guardados HOJE**: na sessão de
  escolha, em `Escolhas` (`interface Escolhas { [nomeDoParametro: string]: number }`,
  `src/lib/artes-grid-ui.ts` via import de `artes-grid.ts:229`) — um mapa nome→grau
  investido, vivo só durante a caixa de diálogo (`let escolhas: Escolhas = {}`,
  `artes-grid-ui.ts:267`). Ao confirmar, vira `plano.escolhas`, e É GRAVADO no banco junto
  com o efeito: `gravarEfeito` (`src/lib/artes-grid-mesa.ts:1262-1302`) escreve a linha da
  tabela de efeitos ativos com, entre outros campos, `dano_dados`, `dano_bonus`, `angulo`,
  `figura`, `hexes` — a FORMA final dos parâmetros, não o mapa `escolhas` em si (esse mapa
  não sobrevive como objeto depois de gravado; o que sobrevive é o resultado que ele produziu).

## 2 · "NÍVEL do Efeito = o maior Parâmetro declarado" — JÁ EXISTE, com este nome de conceito

**Existe, ao pé da letra, para o improviso — achado que corrige uma leitura errada que eu
mesma tive a meio do levantamento (registro para não repetir o erro):** em
`gravarEfeito` (`src/lib/artes-grid-mesa.ts:1287-1290`):

```ts
// O nível efetivo: o do Efeito comprado, ou o maior parâmetro investido no
// improviso, que é a mesma regra de gating de `arcano.composta`.
nivel: plano.efeito?.nivel
  ?? Math.max(1, ...Object.values(plano.escolhas).map((n) => Number(n) || 0)),
```

É literalmente `Math.max` sobre os graus investidos, para o improviso (quando não há
Efeito comprado). Chamado de **"nível efetivo"**, não "Nível do Efeito" — o nome exato do
humano não está no código, mas o conceito e a fórmula batem. E o comentário aponta para uma
SEGUNDA confirmação, publicada: `regras.json:arcano.composta.regra` (conjuração combinando
várias Artes) diz, em texto: **"o nível efetivo para gating = o maior componente; os Ticks
seguem a escada do maior nível."** Já está decidido e publicado que TICKS seguem o MAIOR, não
a soma — mas só para a conjuração composta (múltiplas Artes numa só), que **não tem
implementação em código, só o comentário que a cita** (`grep` de `composta` em `src/lib`
só acha essa linha do `gravarEfeito`; não há função de conjuração composta).

**A ARMADILHA a evitar, e é por isso que registro os dois lados:** existe uma SEGUNDA conta
de "nível", diferente, para o CUSTO em Mana — essa é SOMA, não máximo: `interface Custo`
(`src/lib/artes-grid.ts:231-235`), campo `parametros: number // a soma dos níveis
investidos`, e a régua publicada (`src/pages/artes/regras.astro:382`): "Some os níveis
investidos: 1 ponto por nível, igual em todos os parâmetros." **Mana usa SOMA. Preparo/Ticks
já está decidido para usar MÁXIMO** (na conjuração composta, e no "nível efetivo" gravado no
tabuleiro). São duas réguas com o mesmo nome de entrada ("nível") e operações diferentes —
não é contradição do humano contra o sistema, é uma distinção que já existe e que a régua
nova PRECISA preservar (usar o "nível efetivo" para Preparo, nunca o total de Mana).

## 3 · Nível → Preparo, um Tick por Nível — a fórmula já existe, e é BASE + incremento

**Existe, em dados e em código, mas com uma BASE que o resumo do humano não menciona.**
`regras.json:2441-2444`:

```json
"preparoBase": 2, "preparoPorNivel": 1, "cicloBase": 3, "cicloPorNivel": 1
```

Consumida por `reguaDaArte(nivel, sistema)` (`src/lib/combate-tempo.ts:270-274`):
`preparo = preparoBase(2) + preparoPorNivel(1) × nível`. A nota no código: *"A Arte sai no
ÚLTIMO Tick da montagem: Preparo = 2 + nível, ciclo = nível + 3. É a §5.3 do Arcano, já no
site."* — e de fato está no site: `src/pages/artes/regras.astro:305-322`
(`regras.json:arcano.tempoDaArte.ultimoTick`), publicado como "a conjuração de 7 Ticks
acontece no sétimo", sem citar a fórmula numérica ali (o texto fica em prosa, "cinco a sete
Ticks", os números exatos só aparecem no `combate.pgr.arte` dos dados).

**O incremento (1 Tick por Nível) BATE com o que o humano descreveu. A BASE (2) é o que
precisa reconciliar**: se o humano disse só "um Tick a mais por Nível" sem mencionar base,
os dois números são: **existente = 2 + 1×Nível; humano, como relatado = 1×Nível (base
implícita 0 ou 1, não sei qual)**. Não tenho a fala literal do humano para decidir se é
divergência real ou só uma base que ele considerou óbvia e não repetiu — fica para o
Arquiteto conferir contra o que foi dito.

**Mas, como já registrado no achado que abre este documento: `reguaDaArte` não é chamada em
lugar nenhum de `src/` fora de si mesma.** A fórmula existe, está certa, está publicada —
e não gira no motor. Rodar `grep -r reguaDaArte src/` só acha a própria definição.

## 4 · O teto declarado ("declarei até aqui e posso entregar menos")

**Não existe, em lugar nenhum do motor que eu tenha achado — e procurei além das Artes.**
O que existe, e é conceito DIFERENTE, é um teto por MAESTRIA, não por autodeclaração:
`tetoPorParametro: "nível da Arte"` (`regras.json:arcano.improviso.tetoPorParametro`) —
cada parâmetro não pode passar do nível que o personagem TEM na Arte (`nivelArte`,
`src/lib/artes-grid-ui.ts:181/265/816`, a maestria da ficha, não uma escolha da hora). Não
achei nenhuma noção de "comprometo um valor agora, e no momento de resolver posso entregar
menos do que declarei" em nenhum parâmetro, em nenhum sistema de combate (P/G/R incluído:
o Preparo de arma é fixo pela classe, não uma faixa que se decide depois). Resposta firme:
**não existe**, não "não achei" — busquei por "entregar menos", "grau menor", "reduzir
parâmetro" e variações, e o único uso de "grau menor" no repositório é sobre modificador de
Defesa por postura (`src/content/chapters/combate.md:255`), assunto não relacionado.

## 5 · Deslocamento durante um gesto em andamento

**Os quatro modos existem** (`MODOS_MOV`, `src/lib/combate-tempo.ts:998-1011`): `andar`
(1,5 m/Tick, sem combate), `batalha` ("Deslocamento de Batalha", 3 m/Tick, sem penalidade),
`corrida` (6 m/Tick, Defesa −4 até se recompor), `investida` (6 m/Tick, Defesa −4 no
Preparo, +1d6 no golpe — só existe dentro de uma declaração de ataque, não é oferecida no
diálogo de deslocamento solto, `grid.astro:5923-5930`).

**O que limita quem está comprometido:** o capítulo publicado
(`src/content/chapters/combate.md:181-184`) distingue LIVRE (sai pelas próprias pernas, um
Tick normal) de FORA DA VEZ em Preparo/Golpe/Recuperação (o desvio de emergência, 1 Tick por
metro que falte, sem escolha de modo — é sempre esse preço, não uma velocidade escolhida).
No código, quem está comprometido (`faseEm(acaoNo(c), T) !== 'livre'`) nem chega a ver o
diálogo de modo: `moverSimultaneo` (`grid.astro:5906-5913`) desvia direto para
`porNoMapa(c.id, ...)` — um posicionamento crú, sem pedir modo, sem cobrar pelo modo. O
comentário do próprio código (`grid.astro:5903-5904`) diz que esse caminho "já cobra e já
pergunta o que deve" em outro lugar, que é a regra do desvio de emergência acima, não uma
segunda pergunta de modo.

**Existe sim um caminho que força o modo sem perguntar**: a fuga automática de criatura
(`grid.astro:5827-5845`) monta o movimento com `modo: 'corrida', auto: true`
(`grid.astro:5845`) direto, sem diálogo — quem foge corre, decisão do motor, não da mesa.

## 6 · Interromper o próprio gesto (✋ Abortar)

**Existe, publicado e implementado, com preço.** Regra publicada,
`regras.json:2497-2508` (`combate.pgr.abortar`): só na fase `preparo` (não no Golpe, "não
há como interromper o próprio braço no instante em que ele cai"; não na Recuperação, "não
há o que abortar"); custa **1 Tick por metro** para saída (`ticksPorMetro: 1`), o mesmo
preço do desvio de emergência; **perde os Ticks já investidos no Preparo**
(`perdeOInvestido: true` — "você fica livre no Tick de agora, e não no Tick em que
declarou"); serve só para `mover`, `desviar`, `interpor`, nunca para `atacar`
(`nuncaPara: "atacar"`); e quem quiser arriscar e continuar pode, com teste de Virtude
(`levarAdiante`, perícia ainda não decidida, marcado K12).

No código: `podeAbortar`/`abrirAbortar` (importados em `grid.astro:2445`), o botão "✋
Abortar o gesto" só aparece para o MESTRE e só quando `podeAbortar` permite
(`grid.astro:7111`), e `abortarGesto(cid)` (`grid.astro:6165-6180`+) chama `abrirAbortar`
(a caixa que já tem a nota "1 Tick por metro" em `src/lib/mesa-tempo-ui.ts:359`) e desconta
o gesto pelo Tick absoluto, preservando o contrapé.

**Mas isto é o Abortar de AÇÃO FÍSICA (P/G/R de arma/golpe).** Pela mesma lógica do achado
que abre o documento: como a Arte lançada pelo jogador não passa por um estado "em Preparo"
que dure Ticks, não há hoje NADA para abortar numa conjuração de Arte — o botão e a regra
existem para golpe de arma, e precisam de um Preparo real de Arte (que ainda não existe, ver
achado inicial) para se estender a conjuração.

## 7 · Quando a Mana é paga

**Na declaração, no mesmo instante em que o efeito é posicionado — não numa saída
futura.** `conjurar()` (`src/lib/artes-grid-mesa.ts:812`), no bloco `finally` que fecha a
função inteira (linhas 784-814): `await ctx.gastarMana?.(c.id, plano.custo.mana);`, logo
seguido por `declararTempo`. Não há um segundo momento, mais adiante no relógio, em que a
Mana seja cobrada — o gasto e a colocação da figura acontecem juntos, de forma síncrona.

**Isto decide a pergunta do humano: hoje, "interromper não custa nada" não é bem verdade
nem mentira — é uma pergunta sem objeto**, porque não existe intervalo entre declarar e
resolver em que a Mana esteja "comprometida mas ainda não gasta". A régua nova, se quiser
que a Mana seja perdida (ou não) ao abortar um Preparo de Arte, está desenhando uma
sequência de pagamento que HOJE simplesmente não existe — não é mudar um "quando", é criar
um "quando" que não há.

**Excepção registrada no próprio código** (`artes-grid-mesa.ts:791-797`): Dissipar, Invocar
e Deslocar (3 dos ~140 Efeitos) são citados como resolvendo SEMPRE na declaração "como
sempre", por precisarem de uma caixa de decisão aberta no instante da saída — nota que já
antecipa que o resto poderia um dia não resolver na declaração, mas hoje todos resolvem.

## 8 · Teste para não perder um gesto por sofrer dano

**Não achei um teste genérico disso — o único teste "ao sofrer dano" que existe é escopado
à SUSTENTAÇÃO de um efeito, não ao Preparo em si.** `regras.json:arcano.tempo` →
`improviso.combinacoes.concentracao.aoSofrerDano`: "teste de Vontade + Acerto Arcano para
segurar; falhando, o efeito cai" (publicado em `src/pages/artes/regras.astro:151`). Isso é
para quem está SUSTENTANDO uma Duração via concentração (o Jorro que continua, a vela que
vira fogueira) — não para "não perder a montagem de um Preparo comum" por ter sido
atingido.

**A dificuldade escalar com o dano: NÃO ESTÁ DECIDIDO.** O próprio dado já marca isto como
aberto: `concentracao.aRevisar`: "a dificuldade do teste (fixa ou crescendo com o tamanho do
golpe), e a perícia definitiva quando a conjuração por Tradição fechar." Não existe resposta
para "por ataque ou por Tick" nem aqui nem em nenhum outro lugar que eu tenha achado.

**Resposta mais firme, depois de segunda passada:** procurei "sustentar"/"Sustentar" em todo
o `src/` e o teste de concentração NÃO tem implementação em nenhum arquivo de
`src/lib/`/`src/pages/mesa/` — só existe como regra publicada (`regras.json`,
`regras.astro`), a mesma situação do `reguaDaArte` do ponto 3. E `abortarGesto` (o único
código que encerra um gesto em Preparo) só é chamado por clique explícito em três lugares
(`grid.astro:7165`, `combate.astro:1203`/`1510`) — nunca a partir da resolução de um golpe
ou da aplicação de dano. **Então a resposta correta é "não existe" para o teste GENÉRICO de
Preparo (não achei, e não é surpresa: nada dispara `abortarGesto` sozinho), e "existe só
como regra publicada, não implementada" para o de sustentar Duração** — nenhum dos dois
está rodando no motor hoje.

## 9 · Condições que impedem continuar

**O campo que responde exatamente ao critério do humano já existe, com esse nome
implícito.** `foraDeCombate: true` em `src/data/condicoes.json`, em quatro condições:
`inconsciente` (linha 183), `morrendo` (188), `estabilizado` (193), `morto` (198) — as
quatro em que não há "chance de continuar depois" dentro da cena. `imobilizado`
(`condicoes.json:19`) NÃO tem essa marca — travado, mas com chance de voltar a agir depois
de solto, que é exatamente a distinção que o humano descreveu.

No código, o campo é lido em três lugares: `noChao(c)` (`grid.astro:6849-6851`, junta
`foraDeCombate` com um segundo conjunto `NO_CHAO` que inclui também `caido`, que não tem o
campo — os dois mecanismos coexistem, não é só um), `combate.astro:1298`, e
`referencia.astro:74` (texto "fora de combate" no card). O TIPO (`mesa-core.ts:170`) já
declara o campo oficialmente.

**Não achei código que CANCELE um gesto em Preparo em andamento no instante em que uma
condição dessas aterrissa.** O que achei foi o uso de `noChao`/`foraDeCombate` para tirar a
peça da ocupação e da leitura de "quem está de pé" — não uma rotina que, ao aplicar
`inconsciente` a alguém no meio de um Preparo, zere `c.acao` ou aborte o gesto por conta
própria. Segunda passada, na mesma direção do ponto 8: `marcarInvestida`
(`grid.astro:6014-6026`, a condição `investindo` que a Investida põe e o relógio tira) é o
único lugar que escrevo/apaga condição olhando também para a fase do gesto, e ela cuida só
de si mesma, não de derrubar OUTRAS ações por causa de uma condição nova. Continuo sem achar
o outro lado (condição chegando de um efeito/ataque e cruzando com `c.acao` de quem a
recebeu) — **é "não achei", não "não existe"**: não segui cada caminho de aplicação de
condição (são muitos, `verificarEfeitos`, o menu de condições, o corpo a corpo) até o fim, e
a ausência de uma marca clara (um "isto derruba gesto" ao lado de `foraDeCombate`) é o
próprio motivo de eu não conseguir fechar isto com a firmeza do ponto 4.

## 10 · Modais e a configuração de mesa

**"Não me pergunte" não existe hoje, em nenhuma forma — busquei e não achei nenhum toggle
desse tipo em `src/`.** O que existe, e é o precedente direto para "onde ficaria o botão" e
para "há configuração de mesa persistida": o **Tempo da mesa** já é uma configuração
persistida por mesa (não por sessão, não por navegador) — `combateDaMesa(ctx.mesa)`
(`grid.astro:2775`) lê do próprio registro da mesa no banco, guardado em `TEMPO`
(`grid.astro:2517`), e o botão que abre a escolha (`#gr-tempo`, "Como o tempo passa nesta
mesa", `grid.astro:11015-11022`) chama `abrirEscolhaDoTempo` — uma caixa modal do mesmo
arquivo que já hospeda os diálogos de Abortar/Desviar (`src/lib/mesa-tempo-ui.ts`, que já
citei nos pontos 5 e 6). Ao escolher, `TEMPO = novo` e a mesa recarrega
(`grid.astro:11019-11021`) — é o padrão exato de "escolha feita uma vez, persistida na
mesa, lida por todo mundo que abrir a arena depois".

**Onde ficaria o botão de desligar modais**: dentro dessa mesma caixa
(`abrirEscolhaDoTempo`/`mesa-tempo-ui.ts`), pelo precedente de que é ali que configuração de
tempo-de-combate já mora, ou como um novo campo ao lado de `TEMPO` na mesma estrutura salva
na mesa — não precisaria de mecanismo novo de persistência, só de mais um campo no mesmo
lugar.

## Achados que valem destacar de novo, fora da ordem dos dez pontos

1. **O achado que abre o documento**: `conjurar()` é síncrono, sem Preparo real para Arte de
   jogador. É o fato que decide o tamanho do trabalho — não é ajustar um número, é abrir um
   estado novo no motor.
2. **`reguaDaArte` existe e está certa, e está morta.** Achado que evita trabalho em
   duplicado: a fórmula de Preparo por nível já foi escrita, testada em algum momento
   (comentário cita "já no site"), e só falta ser chamada.
3. **"Nível do Efeito = maior Parâmetro" não é vocabulário novo — já está decidido e
   parcialmente implementado**, só que sob o nome "nível efetivo" e espalhado entre
   `gravarEfeito` (implementado, só para Arte única) e `arcano.composta` (só o texto, sem
   código, para várias Artes numa conjuração). A régua nova pode e deve reusar esse nome e
   essa fórmula em vez de inventar um terceiro.
4. **Mana e Custo usam SOMA (para o quanto custa); Preparo e gating já estão decididos para
   usar MÁXIMO (para o quanto demora).** Duas réguas, dois nomes de "nível" que não são o
   mesmo número — risco real de a régua nova confundir as duas se não nomear com cuidado
   qual "nível" está usando onde.
5. **O padrão se repete uma terceira vez**: `reguaDaArte` (ponto 3) e o teste de
   concentração ao sofrer dano (ponto 8) são os dois regra-publicada-sem-chamador que achei
   procurando coisa diferente cada vez. Vale a suspeita de que há mais — quem escrever a
   régua nova devia perguntar, de cada peça que for citar como "já existe", se ela está só
   nos dados/na página ou se algum arquivo de `src/lib`/`src/pages/mesa` de fato a invoca.
