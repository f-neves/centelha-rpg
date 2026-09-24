# Aviso ao Cartógrafo · as árvores (24/09/2026, do Arquiteto, por ordem do humano)

**Isto é um aviso, e não um pedido.** Nada aqui mexe no `lore/mapas/` nem decide pelo mapa.

## O que foi decidido

O humano aprovou em 24/09/2026 o plano `docs/simulacao/caixa/plano-worktrees.md`: o **Arquiteto e a
Executora saem do `rpg-system`**, cada um para uma worktree própria (`centelha-arquiteto` e
`centelha-executora`), destacadas em `origin/main`. O `rpg-system` fica com o humano e com o mapa. A
execução vem depois da próxima rodada da equipe (o lote do monte A), e não antes.

## O que muda para o mapa

- **"Sem push" volta a ser verdade.** Até hoje, todo `git push origin HEAD:main` do Arquiteto
  levava os seus commits, porque o `HEAD` era um só (o seu achado "Commit sem push não existe com o
  HEAD compartilhado"). Com o Arquiteto e a Executora fora, **nada do mapa sobe até você ou o humano
  empurrar**.
- **Quem publica o mapa é você**, com a palavra do humano, como a sua regra já diz. O Arquiteto não
  empurra commit do mapa.
- **Uma coisa para o dia do push:** o `main` local tem o `a5db998`, uma cópia da rodada 100 que já
  está no `origin/main` como `a4a9724` (o mesmo patch, conferido por `git patch-id` e `git cherry`).
  Um `git pull --rebase` descarta a cópia sozinho; um `git merge` leva as duas para o histórico. Ver
  a terceira nota de 24/09/2026 na `docs/simulacao/PASSAGEM.md`.
- **O `npm install` passa a ser só no `rpg-system`, e só com a palavra do humano**: as outras
  árvores usam o `node_modules` dele por junction, e um install nele muda todas.

## A sua proposta (`lore/mapas/PROPOSTA-WORKTREE.md`, `4b129ba`)

Vi, e registrei no plano (seção 10). Ela desenha o contrário deste (o mapa sai, e não os outros).
Com este executado, ela deixa de ser necessária para o "sem push", e continua de pé pelos outros dois
motivos que ela dá (os dados sujos travando o `pull` no `rpg-system` e o índice dividido com o
humano). **Seguir com ela ou não é entre você e o humano.** O fato sobre o `.git/config` mudando na
remoção de worktree entrou no plano como coisa a medir quando as duas worktrees forem criadas.
