# Rodada 98 · despacho · a §17 no livro, no dado e no motor

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> A 97 fechou em 24/09/2026 com PROCEDE (`ee4dce1`), e o espelho está verde no CI desde `457915e`. Progresso em `progresso-98.md`, relato em `98-executora.md`.
> É o primeiro item da trilha de EXECUÇÃO do `Pendencias.md` §6.

As três decisões estão em `leitura-de-novato-decisoes.md` §17, com o contra que o humano comprou.
Leia a §17 inteira antes de começar. **Nada aqui é regra nova:** se alguma frase pedir escolha entre
duas leituras, pare e escreva no relato, que eu levo ao humano.

## 0 · Um registro que a 97 deixou

A 97 fechou com PROCEDE limpo (`ee4dce1`). A Revisora anotou um alcance: **o laço do harness continua
sem as condições e o porte que a mesa soma ao ataque**, e o espelho concorda só porque as cenas dele
não têm nenhum dos dois. Uma linha no tema L do `Pendencias.md`, com isso e sem conserto. É o mesmo
lugar por onde a §17 pode passar: se o item 1 mostrar que ela muda o ataque na mesa, o laço precisa
da mesma mudança, e o espelho só prova se a cena tiver ferimento com arma de Força.

## 1 · Medir antes de escrever

Onde cada uma das três vive hoje, com arquivo e linha, em capítulo (`src/content/chapters/`), dado
(`src/data/*.json`), código (`src/lib/`, `src/pages/`) e documento (`FRENESI.md`, a própria §16):

- **ação física:** toda definição ou uso de "Vigor ou Destreza" (e variações) como critério de
  penalidade de ferimento, do +2 da fúria, ou de "ação física";
- **tortura:** toda menção, e a tabela das Virtudes e o item Resistir de
  `aparencia-virtudes-vontade.md`;
- **Firula negativa:** toda menção, e o que o capítulo de Habilidades diz da Firula que devolve Força
  de Vontade.

**A pergunta que decide o tamanho:** o MOTOR aplica a penalidade de ferimento só a rolagens de Vigor
ou Destreza? Se aplica, a §17 muda número em mesa (o golpe das armas de Força passa a sofrer a
penalidade), e isso é o "muda para todo mundo" da decisão. Meça: quais caminhos do Grid e da ficha
filtram por atributo, e quantas armas de `armas.json` rolam Força hoje (a §17 cita 14 de 33, contagem
de antes das sete armas novas).

Escreva a medição no progresso antes de mexer.

## 2 · O conserto

- **Ação física:** "as que rolam Força, Destreza ou Vigor", em `vida-ferimentos-cura.md`, `racas.md`
  e `FRENESI.md` §5. No motor, se o filtro existir, a Força entra nele. A §16 é registro de decisão e
  não se reescreve: ganha uma linha dizendo que a §17 trocou a definição.
- **Tortura:** a tabela das Virtudes e o item Resistir dizem as duas metades (a dor do ferro é Vigor +
  Convicção; aguentar sem falar, sem ceder, é a Convicção sozinha no teste de Virtude).
- **Firula negativa:** onde ela é introduzida, uma frase dizendo que vale só no teste de Virtude (e
  no Frenesi) e não devolve nada. Ela NÃO entra no capítulo de Habilidades como regra geral.

## 3 · A prova

- Capítulo e dado: o `validate` verde, e nenhuma ocorrência restante de "Vigor ou Destreza" como
  critério de ação física (liste as que ficarem, com o porquê).
- **Se o motor mudar:** um teste em par, com uma arma de Força sob ferimento (a penalidade entra) e a
  mesma cena sem ferimento (não entra), com o vermelho visto contra o código de antes.
- **O espelho de motor (`test-espelho`) continua verde no CI** depois do commit, conferido na
  execução do CI e não por suposição.
- Todo commit que toque `src/` abre com a linha do que muda para quem abre a mesa amanhã.

## 4 · O relato

`98-executora.md`, as quatro seções da casa, com a medição do item 1 e o tamanho da mudança em mesa.
Commit com pathspec, pull `--rebase` antes, push depois.
