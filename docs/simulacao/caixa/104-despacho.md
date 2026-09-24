# Rodada 104 · despacho · o link de "Perfuração" volta a ter um sentido só

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Um conserto só, que o humano subiu na fila em 24/09/2026: é o CORRIGE da Executora no veredito da
> 102 (`5b51454`), e ele está no site agora. Progresso em `progresso-104.md`, relato em
> `104-executora.md`. A Revisora fecha. **Esta rodada pode correr junto com a revisão da 103**: não
> toca nenhum arquivo da 103.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, na branch `executora`. Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
(tem de dar verdadeiro) e `git switch -C executora origin/main`. Publicação como sempre: fetch, rebase
`origin/main`, `git push origin HEAD:main`, e aviso em vez de força se não for fast-forward. Nada de
`npm install`.

## 1 · O defeito

A 102 deu ao verbete do gate (`glossario.json`, id `perfuracao`) o termo "Perfuração", com `autolink`.
A palavra solta passou a linkar para o gate em todo o livro, **inclusive onde ela é o modo de dano**.
A Revisora mediu no navegador as 107 páginas, com build limpo (`102-revisora.md`, seção 1): **50
links para `perfuracao`, 24 no sentido errado, em 10 páginas** ("Impacto, Corte e Perfuração",
"resistem a Perfuração", a linha de Absorção da ficha, a legenda do bestiário, e o resto da tabela
dela). Antes da 102 nenhum desses 24 era link.

O humano leu assim, e é o que dá a prioridade: antes, quem procurava "Penetração" achava a regra
errada no glossário; agora, quem lê qualquer página com "Perfuração" é levado ao lugar errado em
metade das vezes.

## 2 · O que fazer

1. **O conserto pela causa, que foi o que a Revisora recomendou e o humano subiu:** o TERMO do
   verbete do gate passa a **"Nível de Perfuração"**, e a palavra "Perfuração" sozinha deixa de
   casar o autolink. Os apelidos que ficam são as expressões que só têm um dono ("resistência à
   perfuração", "r.perf", "gate"; o "nível de perfuração" vira o próprio termo). O id `perfuracao`
   **não muda**. O `.no-gloss` caso a caso NÃO é o conserto: ele fecha pelos sintomas, e cada frase
   nova sobre Absorção voltaria a linkar errado.
2. **Confira como o autolink casa** (`src/components/Referencias.astro`, `autolink()`): pelo termo e
   pelos apelidos, sem diferença de caixa? Casa pedaço de expressão? Diga no relato, porque é isso
   que decide se "Nível de Perfuração" como termo deixa de agarrar "Perfuração" solta.
3. **Os 10 acertos da palavra solta no sentido do gate** ("Perfuração nível 3+", "Perfuração
   natural", "Rest. Perfuração", o "Gate natural de Perfuração", os cabeçalhos "Perfuração (Nível)")
   vão deixar de ser link. **Liste-os com página**, e diga se algum merece virar link por outro
   caminho sem reabrir o defeito. Não mude texto de capítulo para recuperar link nesta rodada: liste.
4. **Nenhum outro verbete** ganha termo ou apelido nesta rodada. Se você achar outro verbete com a
   mesma forma (uma palavra solta com dois sentidos no livro, e `autolink`), liste e não troque.

## 3 · A prova

- **A medição refeita no navegador**, das 107 páginas, com build limpo (apague o `.astro/` da sua
  árvore antes, que foi o tropeço da Revisora na 102): quantos links para `perfuracao` e para
  `penetracao`, por página, antes e depois. **A meta: zero link para `perfuracao` onde a palavra é o
  modo de dano.** O medidor da Revisora ficou no scratchpad dela; escreva o seu, e diga onde ele
  mora e se ele pode virar portão.
- **A pergunta do humano, que vai para o `J11`:** existe portão que confira link automático depois de
  renomear termo? Procure (`scripts/test-*.mjs`, o `smoke`, o CI) e responda com o que achou. **Não
  construa o portão nesta rodada**: diga o que ele precisaria medir e quanto custaria (navegador ou
  não, tempo), para o humano decidir.
- `npm run validate` e `npm run build` verdes no fim. O commit que toca `src/` traz a linha do que
  muda para quem joga (a palavra "Perfuração" deixa de levar ao gate quando o texto fala do tipo de
  dano; sem migração). Travessão lendo os arquivos.

## 4 · O relato

`104-executora.md`, as quatro seções.

**Fora:** o texto dos capítulos, a Temperança, a decisão do I12, o K31, o monte B, a migração 33, a
fase 4 e o desfazer da voz.
