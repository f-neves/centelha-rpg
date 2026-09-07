# Rodada 17 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  bf936a7da9786f7b0473c7b8649353dc3339face
SHA   d3b2840857c884e3d831e0b0f35ba75c3149956d
TOPO  d3b2840857c884e3d831e0b0f35ba75c3149956d
```

`TOPO` igual a `SHA`: nada mais empurrou para `main` entre a `BASE` e este
trabalho (`git status` local: `ahead 1`, sem divergência, conferido com
`git fetch` antes de empurrar).

**Nota sobre onde o commit mora agora:** pela mesma razão da rodada 16 (a
suíte completa de `npm run smoke` pisca nesta máquina ao encadear ~10
navegadores em sequência, independente do que muda a cada rodada), o commit
foi empurrado no ramo descartável `interpor/e2e-recuperacao` para o CI julgar
antes deste aviso ser fechado como verde. O ramo compartilha a história com
`main` (fast-forward simples), e será apagado depois de o resultado ser
lido, deixando só o `SHA` de cima.

## O QUE MUDOU

| arquivo | o que mudou nele |
|---|---|
| `scripts/mesa-mock.mjs` | `?cena=interpor` ganha `&fase=preparo\|recuperacao`: `interp` nasce montando um gesto (Preparo) ou já tendo golpeado e se recompondo até o Tick 8 (Recuperação); `atk`/`alvo`/`interp` ganham `tick` explícito (achado: `relogio()` não lê `encontros.tick_atual` com a fila não vazia) |
| `scripts/test-interpor-mesa.mjs` | reestruturado em dois cenários (`cenarioPreparo`, `cenarioRecuperacao`) que reusam a mesma conferência em par (`resolverEConferir`); cenário novo dirige "⏱ Agir fora da vez" → checkbox "Se interpor" → escolhe o golpe → confirma |

## O QUE ESTE RELATÓRIO AFIRMA

| número | o que é | de onde sai |
|---|---|---|
| Absorção 9 mostrada na prévia (não 3), nas DUAS portas | prova de que a Absorção aplicada é a do interpositor, independente de qual porta declarou | `scripts/test-interpor-mesa.mjs`, os dois cenários, lido de `#al-dn-conta` no commit avisado |
| líquido descido = bruto rolado − 9, exato, nas DUAS portas | prova de que o dano que desce da Vida bate com a Absorção certa nos dois caminhos | mesmo teste |
| Vida do alvo original inalterada (999 → 999), nas DUAS portas | prova de que nada vaza para quem não devia levar o golpe, em nenhuma das portas | mesmo teste |
| 10 portões de navegador no `smoke` e na matriz do CI, concordando nas duas direções | `test-portoes.mjs`, rodado no commit avisado (o arquivo mudou de conteúdo, não de nome, então a contagem continua 10) | rodado no commit avisado |

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D17a | mesmo arquivo (`test-interpor-mesa.mjs`), não um segundo arquivo, para o cenário da Recuperação | os dois cenários resolvem o MESMO golpe adiado com a mesma conferência em par; separar em dois arquivos duplicaria `resolverEConferir` ou pediria um terceiro arquivo só de helpers. Custo: o arquivo cresceu (de ~120 para ~280 linhas); ainda cabe numa leitura só |
| D17b | `alvo.tick`/`atk.tick`/`interp.tick` passam a ser explícitos na cena, em vez do `tick: 0` uniforme que a rodada 16 usava | achado ao montar o cenário da Recuperação: com todo mundo em `tick: 0`, `relogio()` (`grid.astro`) sempre lia Tick 0 (o mínimo entre `tickDaVez()` e `golpeMaisCedo()`), e `interp` nunca saía da própria janela de Preparo mesmo com `golpes: [2]` escrito na ação. Não é regra nova, é a cena de teste respeitando uma invariante que a bancada padrão já respeita (`tick` de quem tem ação no ar é o fim do próprio ciclo) |

## O QUE FICOU EM ABERTO

- **Nada novo desta rodada.** O pedido original da Revisora ("cobrindo pelo
  menos um caminho de cada porta") está fechado: as duas portas do Interpor
  agora têm prova e2e, com a mesma asserção em par nas duas.
- **O bug de `roladaManual` com "0d6" literal (rodada 16, D16c/B12) continua
  sem conserto**, e continua fora do escopo desta frente. O teste novo
  também contorna, do mesmo jeito (dado de verdade em vez de valor fixo,
  total lido de `#al-dn-pool`).
- **A flakiness do `npm run smoke` completo nesta máquina** é a mesma
  descrita na rodada 16, sem mudança: os dois cenários deste arquivo passam
  limpos sempre que rodados sozinhos (`node scripts/test-interpor-mesa.mjs`),
  inclusive o ensaio dos três sentidos nos dois juntos.

## ONDE LER

- `Pendencias.md`, L34 §6 · a régua fechada
- `docs/simulacao/caixa/15-revisora.md` · o pedido original das duas portas
- `docs/simulacao/caixa/16-executora.md` · a primeira metade (porta do Preparo)
- `scripts/test-interpor-mesa.mjs` · os dois cenários e a conferência compartilhada
- `scripts/mesa-mock.mjs` · a cena `?cena=interpor`, agora com `&fase=`
