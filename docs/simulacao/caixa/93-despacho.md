# Rodada 93 · despacho · o `reapontar.mjs` grava onde a âncora está

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 92 fechou com **PROCEDE** (`25ffb62`). Progresso em `progresso-93.md`, relato em
> `93-executora.md`. Leia o §5 do `92-revisora.md` antes de começar.

## O defeito, e ele é de ferramenta

O `reapontar.mjs` move uma citação **somando o deslocamento** à linha velha, e aceita a âncora até
3 linhas longe (`JANELA = 3`, `reapontar.mjs:196`). O `test-procedencia` tem a mesma janela
(`JANELA = 3`, `:282`, escolhida de propósito, comentário em `:251-253`). Resultado: uma citação
que já nasceu uma linha fora é movida e continua uma linha fora, e o portão fica verde. Foi o caso
do `const condId` (1864 contra 1865 em `84228f3`, achado pela Executora na 92). A Revisora provou:
com a citação 3 linhas fora o portão fica verde, com 4 fica vermelho.

**1 · O conserto que a Revisora propôs, e que eu quero:** quando o `reapontar.mjs` acha a âncora
dentro da janela, ele grava a linha **onde a âncora está**, e não a linha velha mais o
deslocamento. Uma citação torta passa a ser endireitada na primeira vez que o script passa por ela.

**2 · NÃO mexa na janela do `test-procedencia`.** Ela é folga deliberada do portão, e mudar o
portão é outra conversa. Se achar que a janela do portão também deveria encolher, diga no relato,
com o número de citações que ficariam vermelhas hoje.

**3 · A prova, pelos três sentidos:** uma citação de propósito uma linha fora, num arquivo de
teste (não num documento real). Com o script antigo, ela continua fora depois de reapontar; com o
novo, fica certa; e o novo não mexe em citação que já está certa. Se houver teste do
`reapontar.mjs`, a prova entra nele; se não houver, crie.

**4 · Rode o script novo uma vez no repositório inteiro** e diga quantas citações ele endireitou, e
em quais arquivos. **Antes, `git status` nesses arquivos**: se algum estiver sujo de outra frente,
não commite ele (a regra do `CLAUDE.md` sobre ferramenta que varre muitos arquivos). `lore/` fica
de fora.

**5 · Uma palavra, da nota da 92:** o comentário de `aguentouFicarParado` diz que "a caixa só coleta
e rola", mas a `oferecerSaida` ainda decide o ramo de sair (`artes-grid-mesa.ts:1796`). Ajuste o
comentário para dizer o que é verdade.

Commits com pathspec, gancho verde. `lore/` não se toca.
