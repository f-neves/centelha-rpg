# Progresso · rodada 77 · as regras publicadas param de mentir, e o typecheck ganha dono

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `b7274f2`. Seis itens: o furo novo do portão (falso verde, vem primeiro), o
`ladosVistos` que ninguém lê, o typecheck no gancho só quando há código no commit, os 7 segundos
do `CLAUDE.md`, as regras publicadas das três decisões, e a varredura de novo antes de dar a
lista por fechada.

- **22:33** · começo. `HEAD` = `b7274f2`, `origin/main..HEAD` = 0. Árvore limpa fora o
  `jogador-novo-prompt-executor.md`, que não é meu.
- **22:35** · item 1 FEITO, e o conserto é de JANELA e não de regex: são duas, e não uma. A do
  PV continua atravessando o exemplo anterior, de propósito, porque "o mesmo PV 37" e "um PV 41
  sem Centelha …, e com Centelha …" dizem o número uma vez só. A do RÓTULO passou a começar onde
  o exemplo anterior terminou, que é o que impede o segundo de herdar o "sem Centelha" do
  primeiro.
- **22:35** · item 2 FEITO no mesmo lugar, e o conserto do 2 saiu de dentro do 1: o `ladosVistos`
  ganhou LEITOR em vez de sumir. A conferência das duas testemunhas lia `ladoDe` de novo sobre a
  mesma janela, que é duas leituras da mesma coisa; agora ela pergunta ao `Set`. E o `Set` só
  recebe exemplo com RESTO, porque PV par não testemunha arredondamento nenhum.
- **22:36** · a falsificação DELA, refeita nas duas direções: "Um **PV 41** sem Centelha morre em
  **−20**, e com Centelha morre em **−20**" → `EXIT=1`, e a mensagem nomeia o lado certo
  (`comCentelha`, esperado −21). O mesmo texto com o segundo número CERTO (−21) → `EXIT=0`. O
  vermelho é do número e não da forma de escrever, que era o ponto.
- **22:37** · item 3 escrito: `scripts/hooks/pre-commit` roda `npx astro sync && npx tsc
  --noEmit` só quando `git diff --cached --name-only --diff-filter=ACMR` casa `^(src|scripts)/`.
  O `--cached` é a pergunta certa mesmo com pathspec: o git monta um índice temporário para o
  commit e aponta o `GIT_INDEX_FILE` para ele, então ele responde sobre o commit que está
  nascendo, e não sobre o índice compartilhado com a outra instância.
- **22:37** · PRIMEIRO SENTIDO do gancho, com o defeito de hoje como controle positivo: `esc` de
  volta no `ficha-engine.ts`, `git add`, `git commit` com pathspec → **`EXIT=1`, o gancho acendeu
  no passo do `tsc`**, com a linha exata (`ficha-engine.ts(2872,64)`), e o **`HEAD` não mudou**
  (conferido comparando o sha antes e depois, e não pela ausência de mensagem de erro). Desfeito,
  e o índice devolvido com `git restore --staged` do MEU arquivo, para o `add` da falsificação
  não pegar carona no commit de ninguém.
