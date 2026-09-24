# Rodada 99 · despacho · os consertos C que continuam abertos

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> A 98 está em revisão (aviso `37741e4`). Esta rodada não toca nenhum arquivo da faixa dela, com uma
> exceção possível (`defesas.md`, pelo C-61): se ela aparecer, mexa só na linha do C-61. Progresso
> em `progresso-99.md`, relato em `99-executora.md`. É o item 2 da trilha de EXECUÇÃO do
> `Pendencias.md` §6, na parte dos `C`.

**Nada aqui é regra nova.** Se um conserto pedir escolha entre duas leituras de regra, pare aquele
item, escreva no relato, e siga para o próximo.

## 1 · Os três marcados como feitos que não estão

A seção 2 do `Pendencias.md` diz que o defeito continua no fonte, conferido em 23/09. Não se sabe por
que foram marcados. **Antes de consertar, diga em uma linha de cada um se há commit que o consertou e
foi desfeito depois** (`git log -S` na frase), porque isso muda a leitura: conserto desfeito é outra
forma que marca esquecida.

- **C-22** · `jogador-novo-consertos.md`, seção C-22: a iniciativa social e o "Tick 0" em
  `relacoes-sociais.md`.
- **C-39** · seção C-39: `[object Object]` em `/artes/regras`. Confira no HTML gerado, não só no fonte,
  e a prova é a string ausente do `dist/` depois do build.
- **C-61** · a linha C-61 da tabela: "Esp." sem legenda em `qual-sistema.md` e `defesas.md`.

## 2 · Os abertos

- **C-23** · seção C-23: o Valor Passivo sem a Centelha no capítulo de Ações. **O dado vence.** Se o
  motor e o JSON concordarem, o capítulo se corrige; se os dois discordarem entre si, pare e me diga.
- **C-102** e **C-103** · `jogador-novo-bestiario.md`: a contagem da página do bestiário e o resumo
  da Regra de Horda. No C-102, o número tem de sair do dado em tempo de build, e não ser digitado de
  novo (digitado, ele envelhece na próxima criatura, que é o defeito que o item acusa).
- **C-104** · **decidido por mim, e é registro, não reescrita:** as 57 notas ficam como estão. Uma
  linha de comentário no topo do bloco de dados de `conversao-monstros.html` dizendo que o número de
  Centelha dentro de `note` é o de antes do +1 da Reescala (B10), e que o campo `cent` é o que vale.
  O motivo: o `note` não é publicado, e reescrever 57 comentários apaga o rastro de onde o número
  veio.

## 3 · Os parciais

**C-12, C-47, C-85:** só medir. Diga o que falta em cada um, em uma linha, e se o que falta é
execução ou decisão. Não conserte nesta rodada.

## 4 · A prova

- `npm run validate` e `npm run build` com exit 0, lidos.
- Cada C fechado ganha a caixa marcada no arquivo dele com o sha ao lado, e o `Pendencias.md` §2 é
  corrigido (os fechados saem da lista).
- **O CI do commit final lido no run inteiro**, e não job por job: se o run terminar `failure`, diga
  qual job, mesmo que seja o `test-grid` intermitente do `L97`. Na 98, o progresso citou dois jobs
  verdes de um run que terminou vermelho.
- Travessão: nenhum novo, lendo os arquivos.
- Commit que toque `src/` abre com a linha do que muda para quem abre a mesa amanhã.

## 5 · O relato

`99-executora.md`, as quatro seções da casa. Commit com pathspec, `pull --rebase` antes (se o `lore/`
sujo do Cartógrafo bloquear o pull, use `git fetch` e confira que o `main` local não ficou atrás),
push depois.
