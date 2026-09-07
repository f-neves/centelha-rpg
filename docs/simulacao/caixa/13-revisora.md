# Rodada 13 · resposta da revisora

Revisora: aviso em `cd0225f`, `BASE 88c9ea5` → `SHA f490aad` (`TOPO` igual).

## Recorte, conferido antes de ler qualquer número

- `git log --format='%h pais:%p' 88c9ea5..f490aad`: 1 commit, sem merge.
- `git diff --stat 88c9ea5..f490aad`: 3 arquivos (`02-projeto-harness.md`,
  `CATALOGO.md`, `ESTADO.md`), todos de documentação — nenhum arquivo de
  código nesta rodada. Inventário do aviso bate com o diff real.

## O que rodei

`npm run validate` (verde). CI no commit avisado (`f490aad`, `34067848594`):
`Dados e regras` + os 8 smokes verdes. Rodada só de texto, sem tocar
`scripts/sim/*` nem `bateria.mjs` — não há regressão de motor para checar
além do portão de sempre.

## O ataque, antes de escrever qualquer veredito

Meu CORRIGE 1 da rodada 12 era: "184× e ≈2.500× não podem ser a mesma conta
sobre o mesmo fato, e o texto trata as duas como se fossem." A resposta
escolheu a opção (b) que eu tinha deixado aberta (corrigir o texto, e não
inventar um `n≈14` histórico que nunca existiu) — conferi as contas de novo:

- `n≈14` para `Δ=1/3,72≈0,269` gesto/Tick, `σ=0,3553`: `7,849×0,3553²/0,269²
  ≈ 13,7 → 14`. `2.527/13,7 ≈ 184,5`, bate com `184×` e com `(50,495/3,72)²
  ≈ 184,2`.
- `2.527/0,988 ≈ 2.558`, próximo do `≈2.550×` publicado (a diferença é o
  arredondamento do `n=1` original, que a fórmula dá `0,988` e não `1` exato).

Os dois números agora aparecem separados, com a frase que faltava: "nenhum
`n≈14` foi publicado nesta frente" — o `184×` é uma comparação hipotética
entre duas formas de converter, e o `2.550×` é o que de fato separa os `n`
publicados. Fecha o CORRIGE sem deixar as duas leituras concorrendo.

**O ponto que fui conferir por conta própria, por causa do aviso que você me
deu no chat:** se a grade nova (`n=2.527` nas 32 células de E5) está sendo
tratada como pronta para rodar num mundo em que as bandeiras ainda não são
lidas pelo motor (**L25**). Não está — e a razão é que o documento já carregava
essa guarda antes desta rodada e ela continua de pé, sem contradição:
`02-projeto-harness.md:2374-2393` (texto **não tocado** por este diff) diz,
sem meias-palavras, que "ligar qualquer [bandeira] hoje mediria zero pelo
motivo errado" e que **68 das 112 células medem zero por dois motivos que a
leitura não separa** — as 32 de E5 estão dentro desse conjunto. O que esta
rodada acrescenta (`:2438-2450`, novo) nomeia o L25 de novo, especificamente
para a `margem`: "o `σ` usado... não é o da bandeira `margem`... a `margem`
continua no L25, sem caminho de produção que a chame." E o inventário desta
rodada não toca `scripts/sim/bateria.mjs` nem nenhum script executável: o
`n=2.527` entrou só na tabela de planejamento (`02-projeto-harness.md`
§0.10.1), não em código que rodaria 120.864 batalhas de verdade contra
células que ainda medem zero por construção. Sem achado aqui.

## CORRIGE

Nada. O CORRIGE 1 da rodada 12 foi resolvido por inteiro.

## PERGUNTA

Nenhuma.

## ESCALA

Nada. Documentação respondendo a um CORRIGE meu e registrando duas decisões
que você já tinha tomado no chat (Δ-alvo aplicado, piloto rebaixado a
confirmação) — nenhuma decisão nova de projeto nesta rodada.

## VEREDITO

SEGUE
