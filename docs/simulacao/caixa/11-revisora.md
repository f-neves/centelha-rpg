# Rodada 11 · resposta da revisora

Revisora: aviso em `57fb761`, `BASE 9447aea` → `SHA 86724f7` (`TOPO` igual).

## Recorte, conferido antes de ler qualquer número

- `git log --format='%h pais:%p' 9447aea..57fb761`: 2 commits, zero merges, um pai
  cada.
- `git diff --name-only 9447aea..57fb761`: só `docs/simulacao/ESTADO.md` e o
  próprio `11-executora.md`. Inventário do aviso bate exatamente com o diff
  real desta vez (ao contrário da 10).

## O que rodei

`npm run validate`, `npm run espelho` (4 cenas) e `npm run caido`, os três
verdes. CI no commit avisado (`57fb761`, `34061209451`): `Dados e regras` e os
8 smokes de navegador verdes.

## O ataque, antes de escrever qualquer veredito

Reproduzi a aritmética das duas tabelas novas em vez de aceitar os números
prontos:

- `n = 7,84 · σ² / Δ²` com `σ = 0,3553`, `Δ = 1/50,495 = 0,019804`: dá
  `≈ 2.523`, contra os `2.527` publicados (diferença de arredondamento em
  `σ`/duração, não erro). Escalando por `Δ` (`×4`, `×100`) reproduz `10.105` e
  `252.618` dentro da mesma margem.
- Conferi a citação: `05-fechamento.md:429` diz mesmo "a carga por Tick... fica
  a menos de um gesto", por Tick e não por batalha, como o aviso afirma.
- Conferi que a correção é a certa e não só uma escolha de apresentação: `Δ`
  é uma diferença de TAXA (gesto/Tick), e converter taxa para total exige
  multiplicar por duração (Tick), não dividir por outra taxa — a rodada 10
  fez `56,58/183` (taxa por taxa, adimensional) onde precisava de
  `1 gesto/Tick × 50,495 Ticks`. A correção tem a unidade certa; a de antes
  não tinha.

**O ponto que fui atacar por conta própria, e ele não está fechado no aviso.**
A "reconciliação" (`ESTADO.md`, o parágrafo que fecha "Uma conferência a
mais...") explica a diferença entre `56,58` (medido direto em gesto/batalha) e
`17,94` (`0,3553 × 50,495`, reconvertido) como "a métrica por Tick tira parte
real da variância de duração, só que menos do que parecia" — uma leitura
qualitativa, sem conta. A reconversão por multiplicação assume `ticks_antes =
ticks_depois = 50,495` em CADA par; mas o próprio `ESTADO.md`, três parágrafos
acima da tabela nova (a seção "O QUE A DISTRIBUIÇÃO DIZ"), já publica que a
duração pareada tem desvio de **11,35 Ticks sobre uma média de ~50** — 22% de
dispersão relativa, não desprezível. Se `r08`/`r09` forem de fato as mesmas
duas baterias dessa medição (`bmtq638zo`/`bmtq8zam1` — ver PERGUNTA), a
reconversão ignora exatamente a variação de duração que o mesmo documento já
mediu como grande, e o termo cruzado (taxa × desvio de duração) é um candidato
óbvio para parte do gap `17,94`→`56,58` que a prosa deixa como "parte real,
sem quantificar". **Não muda os `n` publicados** (`2.527`/`10.105`/`252.618`
vêm direto de `σ = 0,3553` medido, não da reconversão), e por isso não
bloqueia — é o parágrafo de contexto que fica mais fraco do que o resto da
rodada, não a tabela que decide.

## CORRIGE

Nada além do ponto acima, que fica registrado ali por depender da resposta da
PERGUNTA.

## PERGUNTA

**`r08` e `r09` são as mesmas baterias `bmtq638zo` e `bmtq8zam1` da seção
anterior, ou baterias diferentes com nomes de conveniência?** Não achei essa
identidade escrita em lugar nenhum (nem em `ESTADO.md`, nem em `Pendencias.md`,
nem no aviso) — infiro pela coincidência de descrição ("mesma semente, regra
mudou no meio" bate com "sem ela"/"com ela" da entrada escalonada), mas
inferência não é procedência. Se forem as mesmas, o ponto do ataque acima vira
CORRIGE de verdade na próxima rodada (quantificar o termo cruzado, ou trocar a
reconversão por algo que não assuma duração constante por par). Se forem
baterias diferentes, o ponto cai sozinho e não preciso voltar a ele.

## ESCALA

**O Δ-alvo do E5 não está escrito em lugar nenhum, o próprio aviso marca isso
com ⚑, e a resposta muda se a grade de 500/célula serve ou não — isto não é
mais uma leitura técnica, é decisão de design que só quem desenhou o E5 pode
tomar.** Três caminhos, com o custo de cada um:

1. **Fixar o alvo em gesto/Tick, no teto literal da previsão** ("menos de um
   gesto por Tick", `05-fechamento.md:429`). `n` fica na casa das dezenas a
   centenas; os 500/célula já planejados bastam sem mudar nada na grade.
   Custo: a previsão fixa um TETO ("menos que"), não um valor esperado — tratar
   o teto como o próprio alvo é uma escolha de leitura, não uma dedução do
   texto, e ninguém decidiu isso até agora.
2. **Fixar o alvo em gesto/batalha**, a unidade em que o resto do documento
   sempre mediu trabalho do mestre (os 1.171.957 gestos totais, a fila de sete
   itens). `n` sobe para a casa dos milhares (**≈ 2.527** para 1 gesto,
   **≈ 10.105** para meio). Custo: com 500/célula a grade NÃO detecta um
   efeito desse tamanho; ou a grade cresce (~5× as repetições por célula, custo
   de bateria proporcional: minutos hoje, ficam de 5 a 10× mais em máquina), ou
   se aceita de saída que só efeitos maiores que a ordem de 2 a 5 gestos por
   batalha por célula são visíveis com o `n` atual.
3. **Rodar o piloto da bandeira `margem` antes de fixar qualquer Δ** (o real,
   não o substituto `ticksDeEntrada`), e medir o efeito esperado antes de
   dimensionar em cima de uma suposição. Custo: atrasa a decisão até o piloto
   existir (ele já está pendente desde `02-projeto-harness.md`); é a única
   opção que mede o efeito de verdade em vez de escolher uma unidade e aceitar
   o `n` que ela dá.

Escalo porque nada técnico bloqueia esta rodada (os números publicados estão
certos, dentro da ressalva da PERGUNTA), mas a pergunta que abriu esta frente
inteira, "a grade de E5 é viável como está desenhada", não tem resposta sem
esta escolha — e ela não é minha nem da executora para fazer.

## VEREDITO

PARA
