# Plano · uma árvore por instância (24/09/2026)

**Estado: O DESENHO FINAL É O DA SEÇÃO 11** (decisão do humano de 24/09/2026, depois do conflito com a proposta do Cartógrafo). As seções 3 e 9 ficam como registro do primeiro desenho aprovado. **A árvore da Executora já existe; a do mapa foi desfeita às 02:38:56, antes da decisão final, e recriá-la está com o humano.** Pedido pelo humano em 24/09/2026, depois de a rodada 100 ter
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

## 3 · O desenho (o PRIMEIRO aprovado; SUBSTITUÍDO pela seção 11)

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

1. Antes de começar: árvore limpa (`git status --short` vazio), `git fetch origin`, e a branch
   `executora` posta no `origin/main`: `git merge-base --is-ancestor executora origin/main` (o que
   ela publicou já está lá) e então `git switch -C executora origin/main`. **Desde 24/09/2026 a
   árvore dela está na branch `executora`, e não destacada** (seção 11).
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
   **Com uma exceção decidida depois, no mesmo dia:** a árvore da Executora sai ANTES da rodada 101
   (a opção A), porque o `rpg-system` estava nove commits atrás do `origin/main`, com o `Pendencias.md`
   entre eles, e trabalhar nele seria repetir a rodada 100. O resto (a saída do Arquiteto, as regras
   nos documentos) fica para depois do lote.

**EXECUTADO em 24/09/2026, 02:25, o passo 4 (só a árvore da Executora):**
`C:/Users/Neves/ClaudeCode/centelha-executora`, destacada em `origin/main` (`db8d755`), com
`node_modules` em junction para o do `rpg-system` e o `.env` copiado (133 bytes). Conferido: árvore
limpa, 0 arquivos em CRLF, `test-portoes` verde antes (na árvore do Arquiteto) e depois (na nova).
**A medida do `.git/config` pedida pelo humano:** o `git worktree add` não mexeu nele (mesmo `md5`,
`b2ad263056b466b0be270e18d98b76b5`, mesmo mtime, 23/09 23:38:53, e `core.hooksPath` continuou
`scripts/hooks`). A remoção, que é o caso da nota do Cartógrafo, ainda não foi medida: será na remoção
da árvore temporária do Arquiteto.

## 10 · A proposta do Cartógrafo, e como as duas se fundiram

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

**Como as duas propostas se fundiram (decisão do humano, 24/09/2026, depois do conflito):** valem as
duas. Da proposta do Cartógrafo fica a saída do MAPA para uma árvore própria, com **branch própria**
(`mapa`, e não destacada), que é o que faz o "sem push" dele querer dizer alguma coisa: o trabalho do
mapa mora num ramo que ninguém mais empurra. Deste plano fica a árvore da Executora. **O que sai deste
plano:** a saída do Arquiteto do `rpg-system`. Motivo do humano: as árvores não conflitam no git, o
portão está verde em todas, e remover trabalho feito para preservar a autoria de um desenho é caro e
não compra nada. Com o mapa fora e a Executora fora, o problema original acaba: ninguém empurra
trabalho alheio por acidente. O caso do conflito está no `CATALOGO.md`, "o humano como canal único
que decide em duas janelas".

## 11 · O desenho final

| árvore | quem | ramo | estado em 24/09/2026, 02:50 |
|---|---|---|---|
| `rpg-system` | o humano e o Arquiteto | `main` | existe; o `main` local ainda carrega commits do mapa não empurrados (ver abaixo) |
| `centelha-mapa` | o Cartógrafo | `mapa` (branch própria, levando os commits do mapa) | **A RECRIAR: decisão do humano de 24/09/2026, saída (a)**, e o `main` local do `rpg-system` volta ao `origin/main`. Antes disso: criada pelo Cartógrafo e desfeita às 02:38:56, quando ele leu o aviso de que o desenho aprovado era o da seção 3. A decisão final chegou depois. Recriar é com o humano e o Cartógrafo |
| `centelha-executora` | a Executora | `executora` (branch própria, criada em 24/09/2026 depois do veredito da 101) | existe desde 02:25 |
| `centelha-techlead-revisora` | a Revisora | `revisora` (branch própria, reposta no sha de cada aviso; `CONTRATO-REVISORA.md §0.1`) | existe; passa à branch no próximo aviso |
| `centelha-arq-tmp` | o Arquiteto, provisória | destacada em `origin/main` | existe; sai quando o `rpg-system` puder publicar sem levar o mapa |

**A branch própria, APROVADA como regra para todas as árvores (humano, 24/09/2026):** toda árvore do
arranjo mora num ramo próprio, e não destacada. Commit em HEAD destacado fica alcançável só pelo sha e some da vista
no próximo `checkout --detach` (foi assim que vereditos da Revisora se orfanaram nas rodadas 27 e
28). **Executora: FEITO em 24/09/2026**, depois do veredito da 101 (`2acb5a4`): `git switch -c executora` no
`origin/main` (`1dfdcad`), sem mudar arquivo; o `.git/config` ficou com o mesmo md5 e o `test-portoes`
verde depois. Ela segue publicando por `git push origin HEAD:main`. **Revisora:** a branch `revisora`,
com o congelamento preservado, está no `CONTRATO-REVISORA.md §0.1`; entra no próximo aviso.

**O que ainda impede o Arquiteto de voltar a publicar pelo `rpg-system`:** o `main` local de lá tem
commits do mapa que não subiram (conferido às 02:50: 11 commits à frente do `origin/main`, entre eles
o `a5db998`, a cópia da rodada 100). Enquanto eles estiverem no `main` do `rpg-system`, um
`git push origin HEAD:main` dali leva o mapa. A saída depende do Cartógrafo e do humano (o mapa sair
para o ramo `mapa` leva esses commits junto, e o `main` local volta ao `origin/main`); até lá, o
Arquiteto continua publicando pela `centelha-arq-tmp`.

**FEITO em 24/09/2026, pelo Arquiteto, por decisão do humano (a opção 1):** conferido antes, por
conteúdo e não por sha (`git cherry -v mapa main`), que os 10 commits do mapa estão na `mapa` e que o
`a5db998` tem o seu equivalente no `origin/main` (`a4a9724`); o Cartógrafo conferiu o mesmo pelo lado
dele (o `lore/mapas` da `mapa` igual byte a byte ao do `4643529`). Então `git reset --keep origin/main`
no `rpg-system` (de `4643529` para `276bcad`), que guardou o `lore/mapas/dados/camadas_referencia.json`
sujo (igual nos dois pontos) e não tocou o `lore/economia/` não versionado; depois
`git worktree remove ../centelha-arq-tmp`. **A medição que ficou devendo, a da REMOÇÃO:** o
`.git/config` ficou com o mesmo md5 (`f22331122c69ca04a8f0c1342fcefc42`) e o mesmo mtime (24/09
03:55:45) antes do reset, depois dele e depois da remoção; o `.git/config.worktree` do `rpg-system`
também não mudou (`77052069529f274a440ee8312487f669`); o `core.hooksPath` lido em cada uma das quatro
árvores que ficaram deu `scripts/hooks`; o `test-portoes` passou depois. **O Arquiteto voltou a
publicar pelo `rpg-system`.** Ficam quatro árvores: `rpg-system` (`main`), `centelha-executora`,
`centelha-mapa` e `centelha-techlead-revisora`.

**O QUE A REMOÇÃO QUEBROU, e a regra que sai dela.** A `centelha-arq-tmp` tinha um junction de
`node_modules` apontando para o do `rpg-system`, e o `git worktree remove` desceu por ele: o
`rpg-system/node_modules` ficou vazio às 04:07:40, o mesmo instante da remoção. Quem usa a pasta por
junction (a Executora e o Cartógrafo) ficou sem node, e o gancho de commit parou em todas as árvores
menos na da Revisora, que tem `node_modules` próprio. **A regra, que o `CLAUDE.local.md` da
`centelha-mapa` já tinha e este plano não:** um junction se desfaz com `cmd /c rmdir <caminho>` ANTES
de remover a árvore que o contém, e nunca por remoção recursiva (`git worktree remove`, `rm -rf`,
`Remove-Item -Recurse`), que atravessa o junction e apaga o conteúdo do diretório real. O gancho de
`pre-commit` já tratava o mesmo perigo na cópia dele (`remover_link_node_modules_com_seguranca`); o
Arquiteto não levou o aviso ao gesto de remover uma árvore inteira.

**O que a medição mostrou sozinha (o humano pediu que se registre):** a Revisora foi a ÚNICA que não
caiu, porque é a única com `node_modules` próprio, e era ela que estava trabalhando (o veredito da 103
saiu durante o incidente). O junction economiza cerca de 465 MB por árvore e custou a pasta inteira
mais duas frentes paradas. **Restaurado por `npm ci` no `rpg-system`, por decisão do humano** (e não
por cópia da pasta da Revisora: "cópia de árvore que ninguém montou volta como defeito estranho daqui
a três semanas"): 18 s, 379 pacotes, 463 MB, `test-portoes` verde, e o `esbuild` carregando pela
junction da Executora e da do mapa.

**A conta que o humano pediu, para rever o junction (medida em 24/09/2026):** o disco `C:` tem 476 GB,
372 GB usados e **105 GB livres** (78%). Um `node_modules` pelo `package-lock` de hoje ocupa **463 a
466 MB** (463 no `rpg-system` recém-refeito, 466 no da Revisora). Hoje dependem do junction duas
árvores (`centelha-executora` e `centelha-mapa`); dar a cada uma a sua custa **cerca de 0,93 GB**, menos
de 1% do livre, mais um `npm ci` de uns 20 s em cada, com rede. **Cabe.** Se o humano decidir tirar o
junction, a regra do `npm install` só no `rpg-system` muda junto (cada árvore passa a instalar a sua,
pelo `npm ci`), e a regra do `rmdir` deixa de ser necessária para essas duas. **Decisão do humano;
nada foi instalado nas outras árvores.**

**O `.git/config` e a blindagem do Cartógrafo (fatos dele, medidos em 24/09/2026):**
`extensions.worktreeConfig=true` no config comum, e um `.git/config.worktree` no `rpg-system` com
`core.hooksPath=scripts/hooks`. No git 2.45.1, `git worktree add` COPIA o `config.worktree` da árvore
de onde roda, então uma árvore criada a partir do `rpg-system` nasce com a `hooksPath` própria (a da
Executora foi criada antes da blindagem, e usa o valor comum). A remoção de uma worktree junto com
`git branch -d`, às 02:38:56, trocou o mtime do `.git/config` e deixou o md5 igual. **E das 02:40:29
às 02:40:57 o valor comum ficou de propósito num caminho que não existe**, como controle negativo do
Cartógrafo: um commit de outra árvore nessa janela teria pulado o gancho. Conferido pelo Arquiteto
nos reflogs das três árvores do arranjo: nenhum commit nesse intervalo.
