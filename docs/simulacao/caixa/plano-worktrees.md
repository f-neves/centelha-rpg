# Plano · uma árvore por instância (24/09/2026)

**Estado: APROVADO pelo humano em 24/09/2026 (seção 9), não executado. Executa DEPOIS do lote do monte A, e não no meio de uma rodada.** Pedido pelo humano em 24/09/2026, depois de a rodada 100 ter
existido sob dois shas (`a5db998` no `main` local, `a4a9724` no `origin/main`) e de o Arquiteto ter
precisado de uma worktree temporária para publicar sem levar os commits do Cartógrafo. A decisão
de dar worktree própria à Executora já era do humano; este arquivo é o como.

## 1 · O problema, medido

Hoje três instâncias escrevem no mesmo diretório (`rpg-system`), no mesmo índice e no mesmo `HEAD`:
o Arquiteto, a Executora e o Cartógrafo. A Revisora já tem a dela.

- O Cartógrafo commita e não empurra. **A razão escrita não existe**: "sem push" aparece em
  `lore/mapas/CARTOGRAFO.md` e em `RELATORIO-PENDENCIAS.md` só como parte do pedido de cada rodada
  ("commit por etapa com caminhos explícitos, sem push"), nunca com um porquê. O próprio documento
  registra que com o `HEAD` compartilhado "sem push" só quer dizer "eu não empurro", e recomenda
  worktree própria para a frente do mapa ("Achados técnicos", "Commit sem push não existe com o
  HEAD compartilhado").
- Todo push de `HEAD` feito do clone principal leva os commits dele. Aconteceu nos pushes do
  Arquiteto de 23 e 24/09 (`76b0c39`, `b15dc25`, `16a83eb`, `8b1ffc6`, `5098abe` subiram assim).
- O `pull --rebase` no clone principal fica bloqueado pelo `lore/` sujo do Cartógrafo, e mexer na
  árvore suja de outro é proibido pelo `CLAUDE.md`.

## 2 · O protótipo: `C:/Users/Neves/ClaudeCode/centelha-arq-tmp`

Criada pelo Arquiteto em 24/09/2026 para publicar o `100-aviso.md` (`b4c48eb`) sem levar os
commits do Cartógrafo.

**O que funcionou:**

- `git worktree add --detach ../centelha-arq-tmp origin/main`: nasce já no que está publicado, sem
  disputar o ramo `main` (que está em uso no clone principal).
- `node_modules` como junction para `rpg-system/node_modules` (conferido: `<JUNCTION>` no `dir`).
  O `pre-commit` isolado passou por cima dela, inclusive a junction que ele mesmo cria na pasta de
  validação.
- `core.hooksPath` herdado do diretório comum (`scripts/hooks`, relativo).
- `.env` copiado do clone principal (133 bytes).
- `node scripts/gen-pendencias.mjs` rodou ali sem ajuste.
- Commit com pathspec e `git push origin HEAD:main`, fast-forward.

**O que deu trabalho ou ficou frágil:**

- Os passos foram à mão (junction e `.env`). Numa árvore permanente, é roteiro escrito.
- Detached: antes de cada trabalho novo, `git fetch` e `git checkout --detach origin/main` com a
  árvore limpa; esquecer isso é trabalhar sobre estado velho.
- **A consequência que não se vê de dentro:** o que se commita fora do clone principal não aparece
  no disco dele até alguém dar `pull` lá, e o `pull` lá está bloqueado pelo `lore/` sujo. Quem ler
  arquivo pelo `rpg-system` lê versão velha. O `ARQUITETO.md §1`, "conferir estado no disco antes
  de afirmar estado", passa a precisar dizer QUAL disco.
- A junction compartilha o `node_modules`: um `npm install` em qualquer árvore muda as outras.
- O `core.hooksPath` voltou para caminho absoluto três vezes até 23/09, causa desconhecida
  (`lore/mapas/registro-git.jsonl`). Com mais árvores, o `test-portoes` precisa ser o passo 1 de
  toda sessão, e não só do Cartógrafo.

## 3 · O desenho

| árvore | quem | ramo | observação |
|---|---|---|---|
| `rpg-system` | o humano e o Cartógrafo | `main` (local) | fica: o mapa tem cerca de 2 GB fora do git (`fonte/` 632 MB, `render/` 1,3 GB, `.venv` 126 MB, `simbolos/`) que um checkout novo não traz, e recriar o `.venv` é instalar pacote, o que a regra dele pede ok do humano |
| `centelha-executora` | a Executora | detached em `origin/main` | nova |
| `centelha-arquiteto` | o Arquiteto | detached em `origin/main` | a temporária promovida (`git worktree move ../centelha-arq-tmp ../centelha-arquiteto`) |
| `centelha-techlead-revisora` | a Revisora | detached no sha do aviso | já existe, não muda |

**Por que o Arquiteto também sai, e não só a Executora:** se ele fica no `rpg-system`, continua
dividindo `HEAD` com o Cartógrafo, e todo push dele leva o mapa. A sessão do Arquiteto continua
aberta a partir do `rpg-system` (a memória do projeto e o `.claude/CLAUDE.local.md` moram lá), e
escreve e commita na árvore dele por caminho absoluto. **Não medido:** se o teammate criado por
esta sessão enxerga o `CLAUDE.local.md` quando trabalha noutra pasta; a regra de formato vai no
prompt de criação de qualquer jeito.

## 4 · Criar a árvore da Executora (roteiro, a rodar só com o ok do humano)

```sh
git fetch origin
git worktree add --detach ../centelha-executora origin/main
cmd //c mklink /J ..\\centelha-executora\\node_modules node_modules    # junction, como no protótipo
cp .env ../centelha-executora/
git -C ../centelha-executora ls-files --eol | awk '$1 !~ /-text/ && $2 ~ /crlf/' | wc -l   # 0
(cd ../centelha-executora && node scripts/test-portoes.mjs)                                   # verde
```

**Alternativa ao junction:** `npm install` próprio (466 MB, tempo não medido). Recomendo o
junction, com a regra "`npm install` só no `rpg-system` e só com ok do humano", porque é o que o
protótipo provou; a Revisora usa `node_modules` próprio e também funciona.

## 5 · As portas

**Lido no código:** nenhum script de `scripts/` tem porta escrita, fora os três `shot` abaixo (busca
por `porta: N`, `localhost:43` e `--port 43`). Os testes de navegador sobem o servidor por
`subirDev` (`scripts/dev-server.mjs:53`), que pede `--port 0`, uma porta livre ao sistema, e o
comentário dele já diz "duas bancadas ao mesmo tempo não brigam". As portas fixas são três:

- `npm run dev` (4321, o padrão do Astro): o servidor do humano;
- `npm run bancada` (4399, `package.json:25`);
- `scripts/shot.mjs`, `shot2.mjs`, `shot3.mjs`, que apontam para `localhost:4321` escrito à mão.

**A regra:** servidor de porta fixa é do `rpg-system`. A Executora não sobe `npm run dev` nem
`npm run bancada` sem porta; quando precisar de servidor à mão, `npx astro dev --config
astro.bancada.mjs --port 4400` (e o Arquiteto, 4401). **Não medido:** se o Astro 5 pula para a
porta seguinte quando a 4321 ou a 4399 estão ocupadas, ou se recusa; a regra evita depender disso.

## 6 · Como a Executora fecha uma rodada

1. Antes de começar: árvore limpa (`git status --short` vazio), `git fetch origin`,
   `git checkout --detach origin/main`.
2. Trabalho e commits com pathspec, como hoje (o índice passa a ser só dela, e a regra fica por
   hábito e por segurança).
3. Antes de publicar: `git fetch origin` e `git rebase origin/main`. Conflito: `git rebase --abort`
   e aviso ao Arquiteto, sem resolver sozinha conflito em arquivo que não é da rodada.
4. `git push origin HEAD:main`. **Se não for fast-forward, uma volta do passo 3 e uma nova
   tentativa; recusou de novo, avisa em vez de forçar.** Nunca `--force`.
5. O relato dá o sha como está no `origin/main`, e o Arquiteto confere com
   `git merge-base --is-ancestor <sha> origin/main`.

É o `CONTRATO-REVISORA.md §7` aplicado a ela, com o mesmo porquê: quem avisa perde minutos, quem
força apaga trabalho de outra frente.

## 7 · O que muda nos documentos, para a próxima sessão nascer com quatro árvores

- `docs/simulacao/PASSAGEM.md`:
  - "Duas pastas, não três" vira a tabela da seção 3, com quem mora onde;
  - §9, o prompt de abertura: cria a Executora em `centelha-executora` e confere que a árvore
    existe (`git worktree list`), está em `origin/main` e passa no `test-portoes`, ANTES de dizer que
    a equipe está de pé; se a árvore não existir, cria pelo roteiro da seção 4;
  - a regra de leitura: o Arquiteto lê o estado publicado por `origin/main` (ou pela árvore dele
    depois de `checkout --detach origin/main`), nunca pelo disco do `rpg-system`.
- `.claude/commands/arquiteto.md`, passo 2: a Executora deixa de trabalhar "nesta mesma árvore".
- `docs/simulacao/ARQUITETO.md §1`: "conferir estado no disco" diz qual disco.
- `CLAUDE.md` da raiz, "Duas instâncias em paralelo": a lista de quem mora onde, e que push do
  `rpg-system` é só do Cartógrafo (ou de quem o humano mandar).
- `lore/mapas/CARTOGRAFO.md` é do Cartógrafo: o Arquiteto não edita; avisa pela caixa que, com o
  Arquiteto e a Executora fora, "sem push" volta a querer dizer "nada do mapa sobe até ele ou o
  humano empurrar".
- A memória do Arquiteto (`equipe-arquiteto-executora-revisora`, `executora-formato-resposta`):
  quem mora em qual pasta.

## 8 · O que decide o humano

1. O desenho da seção 3, em especial o Arquiteto também sair do `rpg-system`.
2. Junction ou `npm install` próprio.
3. Quem publica o mapa, e quando. Com o Arquiteto e a Executora fora, os commits do Cartógrafo
   deixam de subir por acidente e só sobem por um push de propósito. Quando subirem, um
   `pull --rebase` descarta sozinho o `a5db998` (cópia do `a4a9724`); um merge levaria os dois
   (`PASSAGEM.md`, terceira nota de 24/09/2026).

## 9 · Decidido pelo humano em 24/09/2026

1. **O desenho da seção 3 está aprovado, o Arquiteto saindo do `rpg-system` incluído.** A razão
   que ele aceitou: ficando, o Arquiteto divide o `HEAD` com o Cartógrafo, e todo push dele leva o
   mapa.
2. **Junction, e não `npm install` próprio. A regra que vem junto: `npm install` só no
   `rpg-system`, e só com a palavra do humano**, porque a junction faz um install mudar todas as
   árvores de uma vez.
3. **O mapa é publicado pelo Cartógrafo.** O Arquiteto não decide por ele: avisa pela caixa
   (`docs/simulacao/caixa/aviso-cartografo-arvores.md`) que, com o Arquiteto e a Executora fora do
   `rpg-system`, "sem push" volta a querer dizer que nada do mapa sobe até ele ou o humano empurrar.
4. **O achado que o humano pôs acima das três decisões** (a seção 2, "a consequência que não se vê
   de dentro") virou regra no `ARQUITETO.md §1.1a`: conferir no disco diz QUAL disco, e a fonte é o
   `origin/main`.
5. **A ordem:** primeiro o lote do monte A (uma rodada, com a Revisora fechando), depois as árvores.

## 10 · A proposta do Cartógrafo, que chegou no mesmo dia e desenha o contrário

O Cartógrafo escreveu `lore/mapas/PROPOSTA-WORKTREE.md` (commit `4b129ba`, só no `main` local do
`rpg-system`, sem push), também não executada: **ele sai** para `centelha-mapa`, com a branch própria
`mapa`, junções para `fonte/`, `render/`, `simbolos/` e `node_modules`, o `.venv` recriado e o
histórico de desfazer copiado (cerca de 216 MB novos). Os dois planos resolvem o mesmo defeito por
lados opostos: no deste, o mapa fica e saem o Arquiteto e a Executora; no dele, sai o mapa.

**O desenho aprovado é o deste arquivo.** Com ele executado, a proposta do Cartógrafo deixa de ser
necessária para o "sem push" valer, mas ela continua de pé por outros dois motivos que ela mesma dá:
os dados sujos do mapa param de travar o `pull` de quem está no `rpg-system`, e o índice deixa de ser
compartilhado com o humano. **A decisão sobre ela é do humano e do Cartógrafo, e o Arquiteto não a
toma.** Dois fatos da proposta dele que valem para esta:

- a memória do Claude Code é por pasta: uma sessão aberta noutra pasta nasce sem a memória. Aqui a
  sessão do Arquiteto continua aberta a partir do `rpg-system`, e por isso a memória não muda; a da
  Executora nasce desta sessão;
- o `.git/config` mudou às 23:38:53 de 23/09/2026, no instante em que uma worktree de agente foi
  removida (`lore/mapas/registro-git.jsonl`). Criar e remover worktrees reescreve esse arquivo, e
  não está provado que isso troca a `core.hooksPath`. Criar duas worktrees é a ocasião de medir: o
  `test-portoes` antes e depois de cada `worktree add`.
