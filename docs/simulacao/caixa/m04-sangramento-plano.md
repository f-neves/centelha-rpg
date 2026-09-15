# `M-04` · o Sangramento no relógio de cada um · PLANO, não executado

Escrito na rodada 65 pela Executora, a pedido do Arquiteto: *"se ela crescer, feche o item 1 e me
traga o item 2 como plano, sem executar"*. Ela cresceu, e o que segue é o levantamento do que o
conserto exige, medido no disco e não estimado.

O item 1 (`M-04b`, tudo em Ticks) está feito e publicado em `b6a71b7`.

---

## 1 · O que existe hoje, e por que não serve

`src/pages/mesa/combate.astro`, dentro de `avancarTick`, dispara o dano contínuo **quando o
combatente age**, e o comentário declarava a leitura que a mesa acabou de descartar. Na rodada 65
o comentário foi reescrito para dizer a verdade (que a regra decidida é outra e o gatilho ainda
não acompanhou), e o campo passou a se chamar `porSeisTicks`, mas **o gatilho continua sendo o
mesmo**: agir.

A diferença não é cosmética. Hoje, quem está sangrando e **não age** não sangra: um personagem
imobilizado, inconsciente ou simplesmente esperando atravessa a cena inteira sem perder um ponto.
É o oposto exato do que o Sangramento existe para fazer.

**E vale para cinco condições, não uma:** `sangrando` 1, `envenenado` 1, `sufocando` 2,
`em-chamas` 3, `morrendo` 1.

## 2 · O relógio contra o qual se conta, que era a minha dúvida e não é mais

As duas telas já concordam sobre o que é "agora", e isso resolve o problema mais difícil antes de
ele existir:

- no **Simultâneo**, o agora é `encontros.tick_atual`;
- no **Normal** e no **P/G/R**, o agora é o Tick de **quem está na vez**, o menor da fila.

`combate.astro:588` diz isso em prosa e `artes-grid-mesa.ts:206` implementa (`tickAtual(ctx)`),
com o aviso de que ler `encontros.tick_atual` no Grid seria a coluna errada. **A varredura do
Sangramento anda no mesmo trilho da varredura que já existe**, e não inventa relógio nenhum.

## 3 · O molde já está pronto, e é o `ate`

A `Condicao` tem um campo que só existe na instância aplicada: `ate`, o Tick em que ela vence
(`mesa-core.ts`). Quem o consome é `varrerCondicoesVencidas(ctx, t)`
(`artes-grid-mesa.ts:2047`), que percorre `c.condicoes`, separa as vencidas, grava por
`ctx.gravarCondicao` e avisa a mesa. Ela já é **só do mestre** (`if (!ctx.mestre) return`), que é
o que a RLS exige.

O Sangramento precisa do campo gêmeo: **`desde`**, o Tick da ferida. Mesma natureza (só na
instância), mesmo lugar de escrita, mesma varredura irmã.

**E a consequência que a mesa aceitou sai de graça:** `c.condicoes` é um array e a aplicação faz
`[...(c.condicoes || []), { id }]`, sem deduplicar. Duas feridas são duas entradas, cada uma com o
seu `desde`. **Não é preciso escrever nada para os dois contadores ficarem desalinhados**, e
também não é preciso proibir a fusão: ela nunca existiu.

## 4 · O que tem de ser escrito

1. **`desde` na instância**, carimbado nos quatro lugares que aplicam condição:
   `mesa-condicoes.ts:103` (a do catálogo) e `:117` (a caseira), `artes-grid-mesa.ts:1651` (a que
   vem de Arte) e `combate.astro:1352` (o `inconsciente` automático).
2. **Uma função PURA que responde "quantos tiques caem entre dois Ticks"**, fora de qualquer tela:
   `tiquesEntre(desde, de, ate)`. Ela é o coração e é a única coisa que dá para testar barato.
3. **`varrerDanoContinuo(ctx, de, ate)`**, irmã da varredura que já existe, chamada dos mesmos
   lugares que ela.
4. **Tirar o disparo ao agir** de `avancarTick`, em `combate.astro`.
5. **O desfazer**: `avancarTick` já registra um desfazer do Tick. O dano do Sangramento tem de
   entrar no MESMO registro, ou desfazer o Tick deixa o dano aplicado.

## 5 · As quatro coisas que podem dar errado, e nenhuma é hipotética

**a · O relógio pula, e a varredura não pode perder tique.** `avancarTick` anda `quanto` Ticks de
uma vez (`combate.astro:1464`), não um. Um personagem com Sangramento 1 que leve um pulo de 13
Ticks tem de perder **dois** pontos, não um e não treze. É por isso que a função pura recebe um
INTERVALO e não um instante, e é a primeira coisa a travar com teste.

**b · O que já está salvo não tem `desde`.** As condições vivas em mesas abertas hoje são objetos
sem o campo, dentro de uma coluna JSON: **nenhuma migração alcança isso**, do mesmo jeito que o
`porRodada` da rodada 65. A proposta é **carimbar `desde` com o Tick corrente na primeira
varredura que encontrar a instância sem ele**. Tratar a falta como zero seria pior: uma ferida
antiga numa cena no Tick 60 cobraria dez pontos de uma vez, no primeiro Tick depois do deploy.

**c · Só o mestre escreve.** A tela do jogador lê `combatentes` por view e apanharia da RLS. A
varredura nova herda o `if (!ctx.mestre) return` da irmã, e isso precisa estar no teste, não só no
código.

**d · A aba Combate e o Grid não podem cobrar duas vezes.** As duas telas leem o mesmo relógio e
as duas podem estar abertas. A varredura tem de ser idempotente por intervalo, e o jeito de
consegui-lo sem estado extra é gravar o último Tick pago **na própria instância** (`pago`), em vez
de confiar no intervalo que a chamadora informou.

> Isto é uma decisão de desenho e eu não a tomo sozinha: `pago` na instância custa uma escrita a
> mais por tique de sangue, e em troca torna impossível cobrar duas vezes. Sem ele, o código fica
> mais leve e a mesa com duas abas abertas pode sangrar em dobro. **Recomendo `pago`**, e o preço
> é uma gravação a mais em `combatentes.condicoes` a cada seis Ticks por ferido.

## 6 · O portão, e o ensaio dos três sentidos

A parte testável barato é a função pura, e ela cobre o caso `a`:

- **vermelho hoje:** `tiquesEntre` não existe;
- **verde com o conserto:** ferida no Tick 3, relógio de 2 para 15, tem de dar **2** (os Ticks 9 e
  15), e não 1 nem 13;
- **vermelho com regressão plantada:** trocar o intervalo por um instante faz o pulo perder tique,
  e a asserção do pulo pega.
- **controles negativos:** ferida no Tick 3 com o relógio de 4 para 8 tem de dar **0**, e uma
  instância sem `porSeisTicks` tem de dar 0 mesmo com o relógio andando.

O lugar natural é um `scripts/test-*.mjs` novo, que por causa do `test-portoes.mjs` precisa nascer
já dentro do `validate` ou do `smoke`. Ele é puro e barato, então `validate`.

## 7 · O que NÃO entra, e por quê

- **fusão de contadores:** a mesa decidiu que dois Sangramentos são dois relógios, e o array já
  faz isso sozinho;
- **o `gatilho: "por-turno"` do bloco `grid`** (9 Efeitos, `artes-grid.ts:122`,
  `gen-grid-artes.mjs:174`, `validate-data.mjs:155` e três testes): ele é identificador de código,
  mora em bloco GERADO, e o significado dele (*"volta sozinho a cada rodada em quem já está
  preso"*) muda exatamente aqui. **Renomear pertence a este item, e não ao da varredura de
  vocabulário**, que foi onde o encontrei;
- **a bandeira `porRodada` do simulador de batalha** (`bandeiras.ts:14`, `regras.json`,
  `scripts/fixtures/lances.meta.json:16` e a lista `publicadas` do `test-bandeiras.mjs:53`): é
  outro `porRodada`, com outro significado, e é nome publicado em relatório de bateria com fixture
  gravada.

## 8 · O tamanho, em uma frase

Cinco arquivos de escrita (`mesa-core.ts`, `mesa-condicoes.ts`, `artes-grid-mesa.ts`,
`combate.astro`, mais o teste novo), um campo novo na instância, uma função pura, uma varredura
irmã de uma que já existe, e **uma decisão de desenho que é sua** (o `pago`). Nada disso é
grande; o que o torna arriscado é que ele **mexe em dano aplicado e em estado gravado de mesa
viva**, e é por isso que ele vem como plano.
