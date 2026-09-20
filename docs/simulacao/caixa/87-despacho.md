# Rodada 87 · despacho · o bônus de Antecedente, que ficou sem chão

> ## ⛔ ESTE DESPACHO NÃO ESTÁ ABERTO
>
> Ele abre quando a **rodada 86 fechar** (relato da Executora mais veredito da Revisora).
> Escrito antes porque as decisões abaixo **são do humano, foram tomadas em 20/09/2026**, e
> decisão que existe só em mensagem de chat não é decisão neste projeto.
>
> **Não mande isto à Executora enquanto a 86 correr.** Correção que cruza trabalho em curso é o
> que fez este projeto reverter código empurrado duas vezes (`ARQUITETO.md §5.2.1`).

## O problema, com o texto original primeiro

`src/content/chapters/antecedentes.md:72-74` publica hoje:

> Uma Reputação em contexto, um Contato bem posto, uma Posição que pesa naquela sala **só entram
> nas jogadas que movem a Régua de Relação**, isto é, nas que constroem ou deslocam um vínculo.
> Eles **não** turbinam um ataque no Combate Social nem uma Habilidade solta, e somam entre si até
> um **teto de +6**, o mesmo dos modificadores de combate.

Repetido em `:195` e `:311`. E a Executora achou a mesma afirmação **no dado**, em
`src/data/regras.json:399` (`aparencia.nota`, "que só move a Régua de Relação, teto +6"), que o
veredito da 85 não tinha listado.

**Depois do lote da rodada 85, esse conjunto é vazio.** A conversa com dado não move a régua, o
Combate Social a própria frase exclui, e o cortejo com calma, que move, não tem jogada nenhuma. É
um traço comprado com **XP a ×3 por ponto, até +6**, parado em qualquer ficha que o tenha. Achado
pela Revisora na rodada 85, entregue com o alcance medido.

## As três decisões do humano, 20/09/2026

Pelo nome, na ordem em que foram tomadas. As três foram contra a recomendação do Arquiteto, e o
contra comprado está escrito em cada uma.

### 1 · O ANTECEDENTE MEXE NO PONTO DE PARTIDA DA RÉGUA

Deixa de ser bônus de jogada. **O contra comprado:** vira estado inicial em vez de bônus vivo, e
quem pagou XP ×3 aplica uma vez por pessoa e depois não sente mais.

**O que reforça a decisão depois de tomada, e não foi argumento dela:** a família já funcionava
assim nos outros membros, e está publicado. `:131` põe os contatos em Simpatia (+1), `:114` faz
cada aliado nascer em Aliança (+3) ou Devoção (+4), `:285` liga o Sangue às baselines de povo. A
cláusula do situacional era a peça fora do lugar, um bônus por rolagem enxertado numa família de
ponto de partida.

### 2 · O MECANISMO É O DESCONTO NOS PASSOS PARA ROMPER O NEUTRO

Nível N tira N dos 3 passos que separam do Neutro; com 3 ou mais, rompe de cara em **+1 Simpatia**.

**Recusada a alternativa** de deslocar o início travado no teto de vidro (±2), que era a
recomendação do Arquiteto. **O contra comprado desta:** acima de 3 pontos o traço não compra mais
nada, e casa naturalmente com fama, não com contato nem com posto.

**A favor, e é o que decidiu:** é literalmente o que `:195` já promete hoje, palavra por palavra ·
*"uma boa reputação acelera romper o Neutro com quem já ouviu falar bem de você"*.

### 3 · OS TRÊS TRAÇOS USAM O MESMO DESCONTO, E O QUE MUDA É QUEM ALCANÇA

Uma regra só. O nível desconta passos para romper o Neutro, e o escopo é diferente em cada um:

- **Reputação** · com quem já ouviu falar de você;
- **Contato** · com o círculo dele;
- **Posição** · com quem se importa com o posto.

**A favor:** mantém o teto de +6 e o "somam entre si", e o Antecedente continua sendo uma família
com regra comum, em vez de três casos. **O contra comprado, por escrito:** o Contato passa a ter
duas vias, e a contradição da Posição continua de pé (ver a seção seguinte).

## A leitura que resolve a via dupla do Contato, e ela é do Arquiteto

**Decisão minha, não do humano, e registrada como minha para ser visível se estiver errada.**

O contra que o humano comprou foi que o Contato teria duas vias para o mesmo efeito. **Lendo os dois
textos, elas não colidem: cobrem pessoas diferentes.**

- `:131` ("contatos ficam em Simpatia, +1") fala do **contato em si**, a pessoa comprada. Ela já
  nasce acima do Neutro, e o desconto é mudo para ela, porque não há Neutro a romper;
- o desconto da decisão 3 fala do **círculo dele**, que é o escopo que a própria decisão nomeia.
  Essas pessoas começam no Neutro como qualquer estranho, e é ali que o desconto morde.

É aplicação de texto já escrito e não regra nova, por isso não voltou à mesa. **Se a leitura
estiver errada, o sintoma será um contato comprado contando duas vezes com a mesma pessoa**, e aí
volta à mesa.

## O que NÃO foi decidido, e vai ao humano na próxima lista

Não escreva nada sobre estes dois.

- **A contradição da Posição**, anterior a tudo isto: a amarra dela (`:178`) promete *"bônus a
  Etiqueta, Intimidação e comando em contexto"*, e a cláusula do situacional (`:72-74`) diz que o
  traço **não** turbina *"uma Habilidade solta"*. As duas estão publicadas hoje e discordam;
- **o teto de +6 e o preço**: com o desconto útil até 3, os pontos acima de 3 não compram nada, e o
  traço custa XP ×3 por ponto até 6. Repreçar, ou dar segundo uso aos pontos altos, é decisão da
  mesa e não conserto.

## A tarefa, quando abrir

1. **`antecedentes.md:72-74`** · a cláusula do situacional é reescrita: o Antecedente mexe em onde a
   régua começa, pelo desconto nos passos do Neutro, com os três escopos nomeados. Sai "jogadas que
   movem a Régua de Relação". Fica o teto de +6 e o "somam entre si".
2. **`antecedentes.md:195`** (Reputação) e **`:311`** (a Folha) · mesma regra, mesma redação.
3. **`src/data/regras.json:399`**, `aparencia.nota` · a oração "que só move a Régua de Relação,
   teto +6" afirma a regra morta, **no dado**, que é onde ela vence o capítulo. Achado pela
   Executora na rodada 86, fora do veredito.
4. **Não toque** nas amarras de Contato (`:131`), Aliado (`:114`) e Posição (`:178`): elas
   continuam valendo como estão, e a da Posição está na lista do humano.
5. **A conferência que eu quero escrita, por nome:** varra `src/` inteiro pela afirmação, não pela
   palavra, e diga quais lugares ainda ligam Antecedente a "jogada". A Executora já achou um que o
   veredito não tinha; a pergunta é se há um terceiro.
