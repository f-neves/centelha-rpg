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

## ATUALIZAÇÃO · 24/09/2026, depois das 03:15 · a decisão final do humano, saída (a)

**Você fez certo em desfazer a `centelha-mapa` quando o aviso chegou.** A recriação é consequência de
uma decisão do humano que chegou depois, e não erro seu: ele autorizou os dois desenhos em duas
janelas, com minutos de diferença, e registrou isso como caso no `CATALOGO.md` ("o humano como canal
único que decide em duas janelas"), com o seu controle negativo de 28 segundos no `core.hooksPath`
como o mérito do caso.

**O que o humano decidiu:** você recria a `centelha-mapa` na branch `mapa`, **levando os commits do
mapa**, e o `main` local do `rpg-system` volta ao `origin/main`. O motivo dele: com o mapa no
`rpg-system`, o `main` local está 11 commits à frente do `origin/main`, e enquanto isso for verdade
nenhum push dali é seguro. A branch própria leva esses commits junto e resolve a causa. O Arquiteto
fica no `rpg-system`, com o humano.

**O que o humano pede, e uma nota do Arquiteto:**

- **(do humano) registre o custo do `.venv` refeito** (tempo, disco, o que for medível), para ele ver o preço do
  que a decisão em duas janelas cobrou;
- **(do Arquiteto) o `a5db998` está no `main` local e é uma cópia do `a4a9724`**, que já está no `origin/main`
  (mesmo patch). Quando o `main` local voltar ao `origin/main`, ele sai de lá; se a branch `mapa`
  nascer do `main` local, confira se ele não vai junto para a `mapa`.

**A branch própria virou regra para todas as árvores** (a Executora já está na `executora`).

## COBRANÇA · 24/09/2026, depois do veredito da 102 · a metade que falta da saída (a)

**A saída (a) tem duas metades, e só uma está feita.** A `centelha-mapa` voltou, na branch `mapa`. O
`main` local do `rpg-system` continua em `4643529`, 11 commits à frente do `origin/main`, e não voltou.
Enquanto não voltar, o `rpg-system` é a árvore mais desatualizada das cinco (o risco do
`ARQUITETO.md §1.1a`), e o Arquiteto publica por uma worktree temporária.

**O que o Arquiteto mediu, só lendo** (`git cherry -v mapa main`, com o `origin/main` em `5b51454`):

- **os 11 commits do `main` local têm, todos, um equivalente de mesmo patch fora dele:** os 10 do
  mapa estão na branch `mapa` (reescritos por cima do `origin/main`, com shas novos: `c8a1a03` virou
  `e410c91`, e assim por diante até `4643529`, que virou `e90a69a`), e o `a5db998` tem o seu no
  `origin/main` (`a4a9724`). **A `mapa` não levou o `a5db998`**: o merge-base dela é o `8c57aea`, que
  já contém o `a4a9724`. Nenhum commit falta, pela conta do patch;
- **o arquivo sujo no `rpg-system`, `lore/mapas/dados/camadas_referencia.json`, é igual no `4643529`
  e no `origin/main`**, então pôr o `main` no `origin/main` com um gesto que guarda mudança local
  (`git reset --keep`, por exemplo) não o toca. Qual gesto usar é seu;
- **`lore/economia/` está no `rpg-system` sem ser versionado, e não é do mapa**: parece ser da
  frente do Comerciante. Não mexa nele.

**O pedido, do humano:** confirme que os commits do mapa estão na `mapa`. Se estão, o `main` local
volta ao `origin/main`. Se falta algum, diga qual, e leve antes. **Quem faz é você**: a árvore é sua,
e a hora também. O Arquiteto não toca no `rpg-system`.
