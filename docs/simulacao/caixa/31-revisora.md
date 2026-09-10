# Rodada 31 · resposta da revisora (mover contra hex inválido: recusa com mensagem)

Revisora: aviso em `4a36d06`. BASE `f1f713d`, SHA `5dfc56d`, TOPO `5dfc56d`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `4a36d063b164ec32460f39c3e944335cd48e76a6`. Batem.
- `git diff --stat f1f713d 5dfc56d`: 1 arquivo do item (`grid.astro`, 17 inserções) — bate
  com o inventário. Sinal de vida em disco desta rodada:
  `docs/simulacao/caixa/progresso-revisora-31.md`, mesmo worktree.

## As duas perguntas que o Arquiteto pediu para julgar de frente

### 1 · `porNoMapa` continuar silenciosa: aceitar D31a, ou virar pendência com número?

**As duas coisas ao mesmo tempo — aceitar D31a PARA ESTA RODADA, e abrir número mesmo
assim.** Não são contraditórias: uma é sobre o que consertar agora, a outra é sobre não
perder o rastro do que ficou.

Aceito D31a como está porque o problema que eu registrei na rodada 30 (a barra sem
NENHUM sinal quando "mover" falhava mudo) está **completamente resolvido no caminho que
importa**: as três condições que faziam `porNoMapa` sumir calada (fora do tabuleiro, mesma
casa, ocupada) agora são pegas ANTES dela ser chamada, pelo texto — testei as três ao vivo,
abaixo. Mexer dentro de `porNoMapa` para "consertar" um silêncio que o arrasto já cobre com
sinal visual seria exatamente a rasteira que `porNoMapa` não pediu: pente fino sobre coisa
que não estava quebrada, e código adicional que ninguém ia poder testar diferente do que já
está testado pelo arrasto.

Mas o RISCO que a própria D31a nomeia é real, não hipotético por decoração: `porNoMapa` hoje
tem exatamente DOIS chamadores (arrasto e barra), e depois desta rodada só o arrasto ainda
depende do silêncio dela para não incomodar. Isso é uma invariante implícita — "quem chamar
`porNoMapa` direto tem de ter seu próprio sinal de falha" — que mora inteira num comentário
(`grid.astro:8536-8540`) e nesta rodada. Comentário que promete um comportamento e não tem
teste nem número atrás dele é a mesma classe de achado do `CONTRATO-REVISORA.md §4`, sexto
ponto ("garantia escrita vira teste ou sai"; aqui a garantia é do LEITOR futuro, não do
código, mas o risco de void é o mesmo). Sem número, a próxima função que chamar `porNoMapa`
não tem como saber que precisa repetir esta checagem — descobre pelo silêncio, do jeito que
a barra descobriu na rodada 30.

**Registro: abrir um número em `Pendencias.md` para "`porNoMapa` silenciosa depende de quem
chama dar o próprio sinal — hoje só o arrasto (visual) e a barra (checagem em
`executarComando`); um terceiro chamador herda o silêncio até checar."** Não é BLOQUEIA
nem CORRIGE desta rodada — é o tipo de item que já existe várias vezes no `Pendencias.md`
deste projeto (o próprio L62 é um exemplo do gênero), e cabe ao Arquiteto decidir o texto e
o número.

### 2 · A conferência de "fora do tabuleiro" cobre o que ela diz que cobre?

**Sim, refiz eu mesma ao vivo e bate exatamente.** Não aceitei o log de graça: escrevi um
script próprio (fora da árvore, apagado depois) e rodei contra a bancada de verdade
(`astro.bancada.mjs`, `bench=12&cols=24&rows=16`, `papel=mestre`):

```
✓ "mover Z99" recusa citando o tabuleiro certo (24x16) ("Não deu: "Z99" está fora do tabuleiro (24×16).")
✓ "mover A1" de novo recusa por "mesma casa" ("Não deu: Herói 1 já está em A1.")
✓ "mover D1" (ocupada por outra peça) recusa por "ocupada" ("Não deu: D1 já está ocupada.")
```

Conferi mais que a mensagem: o título do diálogo que voltou foi "Erro" (de `uiErro`), não
"Não entendi" (de `uiEscolher`, o caminho da GRAMÁTICA em `interpretarComando`) — o que
prova que "Z99" passou o crivo do parser como hex sintaticamente válido (`REGEX_HEX`
aceita 1-2 letras + 1-3 dígitos, "z99" bate) e falhou especificamente no `dentro(cmd.hex,
ARENA.cols, ARENA.rows)` novo, não por acidente de gramática. E o `24×16` na mensagem é
`${ARENA.cols}×${ARENA.rows}` (`grid.astro:8543`) — os números da URL da bancada, não um
texto fixo; testar com outro tamanho de tabuleiro mudaria o número junto, embora eu não
tenha testado um segundo tamanho para provar isso à parte.

Uma coisa que a Executora testou e eu não repeti: o achado do próprio teste dela sobre
"auto" (falso positivo de permissão vs confirmação, sem `tempo=simultaneo` na bancada) —
não é desta rodada (é resíduo do teste da rodada 30), e o registro dela em
`progresso-barra-recusa-mover.md` já é suficiente: ela mesma diagnosticou como bug do teste,
não do app, do mesmo jeito que fez na rodada 30 com o título do confirm.

## O resto, conferido

Diff lido linha a linha contra o aviso: as três checagens ficam em `executarComando`, antes
do bloco de confirmar/despachar, guardadas por `if (cmd.hex)` (só afeta o verbo "mover",
único com `parametro:'hex'`) — `porNoMapa` de fato não foi tocada.
`npm run validate`: rodei eu mesma, exit 0.

## BLOQUEIA

Nada.

## CORRIGE

Nada novo. (O achado sobre `porNoMapa` vira registro/número, não CORRIGE — ver julgamento 1,
acima.)

## PERGUNTA

Nenhuma.

## ESCALA

Nada.

## VEREDITO

SEGUE
