# A bancada de desafio carrega as fichas de hoje (B14, frente 3, etapa 1)

Da Executora, 08/11/2026, branch `bancada-fichas`, saída do main 635418b9. O achado da B14
(`docs/pendencias/B-bestiario.md`): `scripts/sim/desafio-bancada.mjs` lia `ficha.attrs`, o formato de antes de 58db84be, e
não carregava as fichas de hoje; `desafio-matriz.mjs`, `desafio-5b-bateria.mjs` e `desafio-diagnostico.mjs` importam dele.

## O conserto

- `carregarCriatura` e `criaturaA2` leem `lerCriaturas()` (scripts/lib-bestiario.mjs), que passa a fonte pelo motor
  (`vistaPublicaCriatura`): a vista de compatibilidade (`attrs`, `skills`, `ataques` com `atrib`, `pericia` e `tipo`,
  `arte`) e os números do motor (`motor.stat`). O recorte de combate que o laço lê (o `combate` da mesa) é montado do
  mesmo stat, como no `gen-monsters.mjs`, e não lido dos arquivos gerados.
- A carga traz, como dado, o que o laço ainda não usa: a lista inteira de ataques (com o Tamanho da arma, G1, D-363, e o
  Atributo do arremesso, G2, D-364), os ataques sem jogada com a base e o limite de uso do poder ligado (os sopros, R36),
  o multiataque, a regeneração (o N do nome do poder e a fraqueza do campo próprio, D-362 e G5) e o perfil da Couraça.
- O ataque que o robô usa segue o primeiro da ficha, como na bancada de 07/11/2026 (`tmp/bancada/carga.mjs`): TOLERÂNCIA,
  que levanta quando o Arquiteto decidir outra regra. (Levantada na etapa 1b, abaixo: o modo "primeiro" ficou como opção,
  e o padrão passou a ser o "melhor".) Os poderes no formato antigo não existem mais, e o laço segue sem
  poder natural ofensivo, como em 07/11. A rã-venenosa e o sapo não têm ataque: carregam, e o laço não os mede.
- O laço não lê os campos novos: com o carregador novo e com ele reduzido ao que o `carga.mjs` carregava, as lutas são as
  mesmas (300 de 300 lutas iguais (5 criaturas, Centelha 0, 3 e 6, 20 sementes)).

## O teste: `scripts/test-bancada-carga.mjs` (no validate)

O esperado sai da fonte crua passada pelo motor à parte e da conta do livro e do catálogo, e não dos arquivos que o
carregador lê. Uma criatura por item: Couraça por perfil e multiataque e sopro no dragao-branco-jovem, regeneração na
marilith, o Martelo de Guerra Grande e a rocha pela Força no gigante-da-colina; mais as 324 criaturas contra o motor e o
`criaturaA2`.

Saída do positivo e dos negativos (o negativo roda o mesmo teste contra outro carregador: o antigo, do 635418b9, e
variantes que leem o esquema de hoje e perdem um item cada, em `tmp/executora/bancada/variante.mjs`):

```
### POSITIVO (o carregador novo)
  ✓ dragao-branco-jovem carrega
  ✓ Couraça por perfil (rigida, nível 6): Absorção {"impacto":13,"corte":10,"perfuracao":10}, o motor dá {"impacto":13,"corte":10,"perfuracao":10}
  ✓ o perfil muda a Absorção (o teste não passa por acaso)
  ✓ multiataque: ["garras em sequência","Multiataque"] (a fonte: ["garras em sequência","Multiataque"])
  ✓ sopro sem jogada: Sopro de frio, 6d6 +4 (gelo), base {"arte":"gelo","nivel":3,"efeito":"sopro-do-norte"}
  ✓ o sopro está na lista de ataques, marcado sem jogada
  ✓ regeneração: {"n":9,"fraqueza":{"forma":"naoRegenera","tipos":["arma abençoada","fogo"]}}
  ✓ quem não regenera carrega regeneracao null
  ✓ Martelo de Guerra Grande: 3d6 +19 (I), tamanho grande (a conta: 3d6 +19 (I))
  ✓ rocha pela Força (9 contra Destreza 2): 6d6 +2, forca (a conta: 6d6 +2)
  ✓ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (0 erradas)
  ✓ criaturaA2 carrega: 7d6 +2
✓ test-bancada-carga · a bancada carrega pelo caminho real: Couraça por perfil, multiataque, sopro sem jogada, regeneração, arma no Tamanho e arremesso pela Força
exit 0

### NEGATIVO: carga
  ✘ Couraça por perfil (rigida, nível 6): Absorção {"impacto":13,"corte":10,"perfuracao":10}, o motor dá {"impacto":13,"corte":10,"perfuracao":10}
  ✘ multiataque: [] (a fonte: ["garras em sequência","Multiataque"])
  ✘ sopro sem jogada: ausente
  ✘ o sopro está na lista de ataques, marcado sem jogada
  ✘ regeneração: null
  ✘ Martelo de Guerra Grande: ausente (a conta: 3d6 +19 (I))
  ✘ rocha pela Força (9 contra Destreza 2): ausente (a conta: 6d6 +2)
  ✘ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (152 erradas: aguia-gigante, aguia-real, alce, ankheg, arqueiro)
✘ test-bancada-carga: 8 falha(s)
exit 1

### NEGATIVO: sem-tamanho
  ✘ Martelo de Guerra Grande: 3d6 +19 (I), tamanho undefined (a conta: 3d6 +19 (I))
  ✘ rocha pela Força (9 contra Destreza 2): 6d6 +2, forca (a conta: 6d6 +2)
✘ test-bancada-carga: 2 falha(s)
exit 1

### NEGATIVO: destreza
  ✘ rocha pela Força (9 contra Destreza 2): 2d6+2 +2, destreza (a conta: 6d6 +2)
✘ test-bancada-carga: 1 falha(s)
exit 1

### NEGATIVO: sem-perfil
  ✘ Couraça por perfil (rigida, nível 6): Absorção {"impacto":10,"corte":4,"perfuracao":4}, o motor dá {"impacto":13,"corte":10,"perfuracao":10}
  ✘ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (187 erradas: aboleth, alce, ankheg, anquilossauro, aranha-das-fases)
✘ test-bancada-carga: 2 falha(s)
exit 1

### NEGATIVO: sem-regen
  ✘ regeneração: null
✘ test-bancada-carga: 1 falha(s)
exit 1

### NEGATIVO: sem-sopro
  ✘ sopro sem jogada: ausente
  ✘ o sopro está na lista de ataques, marcado sem jogada
  ✘ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (23 erradas: ankheg, behir, bralani, cao-de-guerra-nessiano, cao-infernal)
✘ test-bancada-carga: 3 falha(s)
exit 1

### NEGATIVO: sem-multi
  ✘ multiataque: [] (a fonte: ["garras em sequência","Multiataque"])
✘ test-bancada-carga: 1 falha(s)
exit 1

### NEGATIVO: o carregador antigo (scripts/sim/desafio-bancada.mjs do 635418b9)
  ✘ dragao-branco-jovem carrega: Cannot read properties of undefined (reading 'destreza')
  ✘ Couraça por perfil (rigida, nível 6): Absorção undefined, o motor dá {"impacto":13,"corte":10,"perfuracao":10}
  ✘ multiataque: [] (a fonte: ["garras em sequência","Multiataque"])
  ✘ sopro sem jogada: ausente
  ✘ o sopro está na lista de ataques, marcado sem jogada
  ✘ regeneração: undefined
  ✘ quem não regenera carrega regeneracao null
  ✘ Martelo de Guerra Grande: ausente (a conta: 3d6 +19 (I))
  ✘ rocha pela Força (9 contra Destreza 2): ausente (a conta: 6d6 +2)
  ✘ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (324 erradas: aasimar, aboleth, aguia-gigante, aguia-real, alce)
  ✘ criaturaA2 carrega: Cannot read properties of undefined (reading 'undefined')
✘ test-bancada-carga: 11 falha(s)
exit 1
```

## Os quatro scripts carregam

```
desafio-diagnostico exit=0 12s linhas=35
desafio-5b-bateria exit=0 27s linhas=35
desafio-matriz exit=0 76s linhas=101
```

As três rodadas repetidas saem iguais à primeira (cmp). O `desafio-bancada.mjs` não tem execução própria: os três o
importam.

## `npm run espelho`

```
    mesa: 45 Ticks, 31 lances · laço: 45 Ticks, 31 lances (teto-do-espelho)
  ✓ a mesa despejou algum Tick
  ✓ a mesa resolveu algum golpe
  ✓ sem divergência em 4x4-aberto · semente 771107

· 1v1-fatal-simultaneo (1v1, 1 hex, teto 20) · semente 10
  ✓ a mesa rodou sem erro de página
    mesa: 20 Ticks, 4 lances · laço: 20 Ticks, 4 lances (teto-do-espelho)
  ✓ a mesa despejou algum Tick
  ✓ a mesa resolveu algum golpe
  ✓ sem divergência em 1v1-fatal-simultaneo · semente 10
  ✓ os dois lados golpeiam e derrubam no MESMO Tick (12), a condição que o item 3 corrige

✓ espelho de motor: os dois laços concordam
```

# Etapa 1b: o laço luta com o que a carga traz (doses, saída de área, escolha do ataque, regeneração)

Da Executora, 08/11/2026, commit por cima do 8f9c6787 (o da etapa 1). Decisões do Arquiteto do mesmo dia: as três
respostas sobre o método (escolha, doses, regeneração), a regeneração pelo relógio do motor (a opção A), e o sopro
pela saída de área do livro.

## O que mudou no laço (`scripts/sim/desafio-bancada.mjs`)

- **A escolha do ataque tem dois modos**, por `opts.escolhaAtaque` em `rodarBatalha` (ou `BANCADA_ESCOLHA` nos scripts):
  "primeiro" é o `ataques[0]` de 07/11, e o laço é o de antes, número por número; "melhor", o padrão, é o ataque de maior
  dano esperado POR TICK contra a persona, entre todos os ataques com jogada (golpe simples e Rajada de cada um), os
  sopros enquanto houver dose e as Artes de quem conjura. A jogada vai contra a Defesa da persona, e a Defesa da própria
  criatura passa a ser a do ataque em uso (a principal com o −2 da arma de duas mãos; com a outra arma, a
  `defesaOutraArma` do motor, D-262 e D-273). A TOLERÂNCIA do primeiro ataque saiu.
  - TOLERÂNCIA que ficou: a Arte de quem conjura conta um turno (6 Ticks), porque a bancada não tem a Velocidade da Arte.
    LEVANTA QUANDO a bancada ganhar o tempo da Arte.
  - Limite conhecido: o laço é por turno e não cobra a diferença de Velocidade entre ataques (só os Ticks extra da
    Rajada); o "por Tick" decide a escolha, e não a frequência.
  - O `rodarBatalhaBando` não foi tocado: segue no caminho de antes.
- **As doses do sopro são LEITURA DE PROSA** do limite de uso, pela mesma frase que o `regras-poder-criatura.mjs` cobra
  ("guarda N doses", ou "Usos grátis: N por cena"; as duas funções novas `dosesGuardadas` e `usosGratis` ficam ali), até
  a ficha ganhar um campo de doses. Todo ataque sem jogada com limite de uso tem de dar um número; se a frase não casar, a
  carga para com o nome da criatura e o do ataque, sem valor padrão calado. Na luta, o robô gasta no máximo as doses
  guardadas (a produção, "1 dose a cada 12 horas", não cabe numa luta). As 23 criaturas com sopro leem: o ankheg 3, o
  bralani 1 (usos grátis), as outras 2 (a tartaruga-dragao pelo poder "Sopro de vapor escaldante", ligado pelo começo do
  nome).
- **O sopro sai pela saída de área do livro** (R36; `combate.md`, "Contra área, a saída é sair"): sem jogada de ataque e
  sem Defesa; a Dificuldade × 4 da decisão de 30/09 saiu para os sopros. Cada persona na área rola Destreza + Esquiva pela
  fórmula do pool (combate.md:156) contra 5 + 5 × os metros que faltam (passou: metade do dano) e o dobro disso (passou:
  nada); quem não passa leva tudo. A saída é a fora da vez: 1 Tick por metro, gasto passe ou não, empurra a próxima ação
  da persona. A metade é a do dano rolado, antes da Absorção; a Absorção é a do tipo físico do sopro, e no sopro de
  elemento é a do tipo do dano da criatura (a convenção que a bancada já usa no dano de Arte e de poder), com o elemento
  passando pela fraqueza, resistência e imunidade da persona. O dano rola uma vez para todos. Quem está na área: área de
  10 m ou mais pega todas as vivas; menor, só o alvo da criatura. A escada sobre os dados da saída fora da vez não entra:
  a bancada não aplica escada em jogada nenhuma.
  - TOLERÂNCIA (a única política de robô desta regra): os metros que faltam, sem mapa. LEVANTA QUANDO a bancada tiver
    espaço. A conta, a mesma para todos: linha, 1 m (a ficha não dá a largura; 1,5 m, metade 0,75, para cima); cone, a
    metade da largura no ponto do alvo, para cima, com a largura igual à distância até a criatura (o alvo colado, a 1,5 m:
    1 m; os outros a meio alcance: 3 m num cone de 12 m, 4 m num de 15 m); raio, nuvem, esfera e círculo, o raio inteiro
    para o alvo e a metade, para cima, para os outros; mínimo de 1 m; na área "à escolha" do linnorm-dos-lagos, vale a
    primeira forma escrita.
  - Consequência medida: o sopro só sai quando rende mais por Tick que o melhor golpe. Com cone ou linha abaixo de 10 m
    ele pega uma persona só, e aí quase nunca rende mais: o dragao-branco-jovem (cone de 9 m) não sopra em nenhuma
    Centelha de 0 a 6; os dragões adultos e o linnorm-do-gelo (cone de 12 m) sopram as duas doses.
  - TOLERÂNCIA: o Sopro petrificante da gorgona-touro-de-ferro não entra na luta. Ele não tem dado de dano (o efeito é a
    petrificação, um traço da B14), e a bancada só mede dano de PV. A tabela da etapa 2 marca a gorgona-touro-de-ferro
    como "sopro não medido", e não dá a ela um número que pareça completo. LEVANTA QUANDO a bancada medir condição
    (a petrificação tira a persona da luta como a queda a PV 0).
  - O Cuspe ácido do ankheg, que a versão pela Dificuldade × 4 deixava de fora por não ter `base` (o nível da Dificuldade),
    entra na luta pela saída de área, que não precisa de `base`: ele é avaliado a cada turno, e nas Centelhas de 0 a 6 a
    linha de 9 m (uma persona só) com 2d6 +2 de ácido nunca rende mais por Tick que as Mandíbulas (1d6 +8), então não sai (0 sopros em 100 lutas em cada Centelha de 0 a 6). Não é
    "não medido": é medido, e perde.
- **A regeneração (D-362) entra atrás de `opts.regeneracao`**, pelas funções do motor (`regeneracaoInicial`,
  `danoNaRegeneracao`, `regenerarAte`): N/10 PV a cada 6 Ticks, com o relógio ligado no Tick do primeiro dano, como a
  D-362 e o livro dizem ("contados a partir do Tick em que ela sofreu o primeiro dano"). Sem a opção, as lutas não mudam.
  A fraqueza da regeneração (G5) não entra: as personas só causam corte, perfuração e impacto, então ela nunca
  dispararia nesta bancada (registrado, sem conserto).

## A regeneração contra a bancada de 07/11: duas causas, as duas testadas

A ordem era reproduzir, em 2000 lutas no C6, os 76,8% da marilith e os 78,4% do linnorm-dos-penhascos da bancada de
07/11 (`tmp/bancada/regeneracao-b1.md`, coluna "fracionado"). A margem é o intervalo de Wilson a 95%, cerca de ±1,8 pp em
2000 lutas; as sementes são 20260930 + i × 7919, no modo "primeiro", como em 07/11.

```
marilith, C6, 2000 lutas: sem regeneração 94.7% [93.6% a 95.6%] (07/11: 81.5%, FORA); com regeneração 94.2% [93.1% a 95.1%] (07/11: 76.8%, FORA)
linnorm-dos-penhascos, C6, 2000 lutas: sem regeneração 83.8% [82.1% a 85.3%] (07/11: 83.8%, dentro); com regeneração 78.4% [76.5% a 80.1%] (07/11: 78.4%, dentro)
```

O linnorm reproduz. A marilith não, por duas causas:

1. **O tipo de dano.** O `tmp/bancada/carga.mjs` de 07/11 lia `edicao.ataques[0].tipoDano`, campo que o ataque de arma
   do catálogo (a Espada longa da marilith) não tem, e caía em 'impacto'. A carga nova lê 'corte' da vista do motor.
   Forçando 'impacto', a linha sem regeneração volta aos 81,5% de 07/11:

```
marilith com tipoDano 'impacto' (o de 07/11), C6, 2000 lutas: sem regeneração 81.5% [79.7% a 83.1%] (07/11: 81.5%, dentro); com regeneração 79.5% [77.7% a 81.3%] (07/11: 76.8%, FORA)
```

2. **O relógio da regeneração.** Mesmo com 'impacto', a regeneração pelo motor dá 79,5% contra os 76,8% de 07/11. Com
   cópias temporárias do laço, trocando uma coisa de cada vez (com 'impacto'): A, o pulso da cópia de 07/11 (N/10 por
   turno desde a entrada, PV fracionário); B, o pulso do motor com o relógio ligado na entrada, e não no primeiro dano:

```
A_pulso_0711 -> marilith com tipoDano 'impacto' (o de 07/11), C6, 2000 lutas: sem regeneração 81.5% [79.7% a 83.1%] (07/11: 81.5%, dentro); com regeneração 76.8% [74.9% a 78.6%] (07/11: 76.8%, dentro)
B_motor_desde_entrada -> marilith com tipoDano 'impacto' (o de 07/11), C6, 2000 lutas: sem regeneração 81.5% [79.7% a 83.1%] (07/11: 81.5%, dentro); com regeneração 77.9% [76.0% a 79.7%] (07/11: 76.8%, dentro)
```

   A cópia de 07/11 pulsava desde a entrada; o motor segue a regra, que liga o relógio no primeiro dano. Os décimos
   inteiros do motor pesam pouco (B fica a 1,1 pp de A).

**O que isso significa:** com a carga certa ('corte'), a marilith fica em 94,7% sem regeneração e 94,2% com ela, e não
cai abaixo de 80% no C6. O teste fixa o linnorm em 78,4% e a marilith em 94,2%, cada um com o seu intervalo; os 79,5% com
'impacto' ficam só aqui, como explicação da diferença. A correção dos números da marilith no registro (D-362 e B14) é do
Arquiteto, depois do PROCEDE.

## O teste: `scripts/test-bancada-carga.mjs`, itens 7 a 9

```
  ✓ dragao-branco-jovem carrega
  ✓ Couraça por perfil (rigida, nível 6): Absorção {"impacto":13,"corte":10,"perfuracao":10}, o motor dá {"impacto":13,"corte":10,"perfuracao":10}
  ✓ o perfil muda a Absorção (o teste não passa por acaso)
  ✓ multiataque: ["garras em sequência","Multiataque"] (a fonte: ["garras em sequência","Multiataque"])
  ✓ sopro sem jogada: Sopro de frio, 6d6 +4 (gelo), base {"arte":"gelo","nivel":3,"efeito":"sopro-do-norte"}
  ✓ o sopro está na lista de ataques, marcado sem jogada
  ✓ regeneração: {"n":9,"fraqueza":{"forma":"naoRegenera","tipos":["arma abençoada","fogo"]}}
  ✓ quem não regenera carrega regeneracao null
  ✓ Martelo de Guerra Grande: 3d6 +19 (I), tamanho grande (a conta: 3d6 +19 (I))
  ✓ rocha pela Força (9 contra Destreza 2): 6d6 +2, forca (a conta: 6d6 +2)
  ✓ as 324 criaturas carregam com PV, Defesa, Absorção e ataques do motor (0 erradas)
  ✓ criaturaA2 carrega: 7d6 +2
  ✓ o laço exporta rodarBatalha e cargaDaVista
  ✓ as 23 criaturas com sopro carregam um número de doses para cada limite de uso (0 sem número)
  ✓ ankheg: 3 ("O corpo guarda 3 doses e produz 1 dose a cada 4 horas. Cada uso gasta 1 dose. Nada acelera a produção"), lido à mão 3
  ✓ bralani: 1 ("Usos grátis: 1 por cena. Cada uso extra custa 1 de Energia"), lido à mão 1
  ✓ dragao-branco-jovem: 2 ("O corpo guarda 2 doses e produz 1 dose a cada 12 horas. Cada uso gasta 1 dose. Nada acelera a produção"), lido à mão 2
  ✓ tartaruga-dragao: 2 ("O corpo guarda 2 doses e produz 1 dose a cada 12 horas. Cada uso gasta 1 dose. Nada acelera a produção"), lido à mão 2
  ✓ limite sem número legível para a carga: dragao-branco-jovem: o ataque sem jogada "Sopro de frio" tem limite de uso sem número de doses legível ("recarrega depois de um descanso")
  ✓ dragao-vermelho-adulto (cone de 12 m, pega as quatro), C6, 300 lutas: o Sopro de fogo sai até 2 vezes por luta (doses: 2), 600 no total
  ✓ com 0 doses plantadas, o sopro não sai
  ✓ dragao-branco-jovem, C0, 300 lutas: com o cone de 9 m o sopro sai 0 vezes; num cone de 12 m plantado, 593 (até 2 por luta)
  ✓ metros para sair: linha de 18 m (alvo) = 1; linha de 18 m = 1; cone de 9 m (alvo) = 1; cone de 12 m = 3; cone de 15 m = 4; raio de 6 m (alvo) = 6; raio de 6 m = 3; linha de 18 m ou cone de 12 m, à escolha = 1; sem forma (alvo) = 1
  ✓ "melhor" com um golpe fraco na frente luta igual a quem só tem o Martelo, luta por luta (200)
  ✓ "primeiro" usa o golpe fraco: o grupo vence 200 de 200, contra 181 no "melhor"
  ✓ sem opção, a escolha é a "melhor"
  ✓ a Defesa do ataque em uso vale no "melhor" (999 plantado: o grupo não vence), e o "primeiro" segue com a de antes
  ✓ gigante-da-colina: Defesa 6 com o Martelo (duas mãos), 8 com a rocha (o motor: 6 e {"arma":"Rocha arremessada","armaPrincipal":"Martelo de Guerra","bloqueio":8,"defesa":8})
  ✓ sem a opção, a marilith luta igual a uma marilith sem regeneração, luta por luta (200)
  ✓ com a opção, a regeneração entra (272.0 PV em 200 lutas)
  ✓ linnorm-dos-penhascos, C6, 2000 lutas, com regeneração: 78.4% [76.5% a 80.1%] (fixado: 78.4%)
  ✓ marilith, C6, 2000 lutas, com regeneração: 94.2% [93.1% a 95.1%] (fixado: 94.2%)
✓ test-bancada-carga · a bancada carrega pelo caminho real (Couraça por perfil, multiataque, sopro sem jogada, regeneração, arma no Tamanho, arremesso pela Força) e luta com elas (doses, saída de área, escolha "melhor", Defesa da arma em uso, regeneração atrás da opção)
exit 0
```

O resultado das 2000 lutas é determinístico (sementes fixas), por isso o teste compara o número exato, e imprime o
intervalo.

## Controle negativo: uma troca de cada vez no laço

Cada mutação é uma cópia temporária do `desafio-bancada.mjs` com UMA troca (`tmp/executora/bancada/mutacoes.py`), e o
mesmo teste roda contra ela por `CENTELHA_BANCADA_TESTE`. A `dif4-de-antes` repõe, na escolha e na execução, o sopro
pela Dificuldade × 4 contra a Defesa (o controle que o Arquiteto pediu: 0 doses gastas).

```
=== dif4-de-antes: exit 1
✘ dragao-vermelho-adulto (cone de 12 m, pega as quatro), C6, 300 lutas: o Sopro de fogo sai até 0 vezes por luta (doses: 2), 0 no total
✘ test-bancada-carga: 1 falha(s)
=== dose-sem-gasto: exit 1
✘ dragao-vermelho-adulto (cone de 12 m, pega as quatro), C6, 300 lutas: o Sopro de fogo sai até 7 vezes por luta (doses: 2), 1296 no total
✘ dragao-branco-jovem, C0, 300 lutas: com o cone de 9 m o sopro sai 0 vezes; num cone de 12 m plantado, 612 (até 3 por luta)
✘ test-bancada-carga: 2 falha(s)
=== dose-calada: exit 1
✘ limite sem número legível para a carga: carregou calado
✘ test-bancada-carga: 1 falha(s)
=== padrao-primeiro: exit 1
✘ sem opção, a escolha é a "melhor"
✘ test-bancada-carga: 1 falha(s)
=== melhor-so-o-primeiro: exit 1
✘ "melhor" com um golpe fraco na frente luta igual a quem só tem o Martelo, luta por luta (200)
✘ "primeiro" usa o golpe fraco: o grupo vence 200 de 200, contra 200 no "melhor"
✘ test-bancada-carga: 2 falha(s)
=== sem-defesa-da-arma: exit 1
✘ a Defesa do ataque em uso vale no "melhor" (999 plantado: o grupo não vence), e o "primeiro" segue com a de antes
✘ test-bancada-carga: 1 falha(s)
=== regen-sem-opcao: exit 1
✘ sem a opção, a marilith luta igual a uma marilith sem regeneração, luta por luta (200)
✘ com a opção, a regeneração entra (272.0 PV em 200 lutas)
✘ test-bancada-carga: 2 falha(s)
=== relogio-na-entrada: exit 1
✘ marilith, C6, 2000 lutas, com regeneração: 93.7% [92.5% a 94.6%] (fixado: 94.2%)
✘ test-bancada-carga: 1 falha(s)
```

## O modo "primeiro" é o laço de antes

Os três scripts rodados com `BANCADA_ESCOLHA=primeiro` saem iguais, byte a byte, à saída do 8f9c6787; e rodam no padrão
"melhor":

```
desafio-diagnostico exit=0
  primeiro = 8f9c6787 (cmp)
desafio-5b-bateria exit=0
  primeiro = 8f9c6787 (cmp)
desafio-matriz exit=0
  primeiro = 8f9c6787 (cmp)
desafio-diagnostico melhor exit=0
desafio-5b-bateria melhor exit=0
desafio-matriz melhor exit=0
```
