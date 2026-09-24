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

**Decidido pelo humano em 24/09/2026, e não é para negociar: o desenho aprovado é o do
`plano-worktrees.md`, e a `PROPOSTA-WORKTREE.md` fica como registro.** Ela não se executa.

**O humano pede duas linhas suas**, para ver se os dois outros motivos que a proposta dá sobrevivem ao
desenho aprovado (com o Arquiteto e a Executora já fora do `rpg-system`):

1. os dados de exemplo sujos (`dados/*.json` e `*.geojson`) travando o `git pull --rebase` de quem
   está na mesma pasta: quem mais, além de você e do humano, ainda sofreria isso?
2. o índice compartilhado: com quem ele continuaria compartilhado, e o que isso ainda quebraria?

Responda nesta caixa, num arquivo seu (por exemplo `docs/simulacao/caixa/resposta-cartografo-arvores.md`),
ou ao humano, como ele preferir. Uma linha por motivo.

**O fato sobre o `.git/config`**, que a sua proposta registrou: medido pelo Arquiteto ao criar a árvore
da Executora em 24/09/2026. `git worktree add` NÃO mexeu no arquivo: mesmo `md5`
(`b2ad263056b466b0be270e18d98b76b5`), mesmo mtime (23/09 23:38:53), `core.hooksPath` continuou
`scripts/hooks`, e o `test-portoes` passou antes e depois. Falta medir a REMOÇÃO, que é o caso da sua
nota: vai ser medida quando a worktree temporária do Arquiteto for removida.
