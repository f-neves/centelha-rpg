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
  que levanta quando o Arquiteto decidir outra regra. Os poderes no formato antigo não existem mais, e o laço segue sem
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
