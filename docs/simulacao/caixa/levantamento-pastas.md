# Levantamento das pastas de C:/Users/Neves/ClaudeCode

Escrito pelo Arquiteto em 25/09/2026, a pedido do humano. **Só leitura:** nada foi apagado, movido,
renomeado ou removido, e nenhuma medição atravessou atalho de pasta (a soma de tamanho para em todo
*reparse point*, e os dois `node_modules` que são *junction* aparecem como atalho, sem medida).
Pastas fora do Centelha: só o nome e a data que a listagem da raiz já mostra, sem abrir.

Horas: as do disco estão no horário local (UTC−3); as dos transcritos estão em UTC e foram
convertidas. Ex.: `build101.txt` criado às 02:43:44 local = 05:43:44 UTC, o mesmo segundo do comando
que o escreveu.

## 1 · A primeira camada

### As pastas de Centelha

| pasta | tamanho | modificada | o que é |
|---|---|---|---|
| `rpg-system` | 5,46 GB | 24/09 23:55 | o repositório principal, `main`; worktree principal |
| `centelha-executora` | 143,1 MB (sem o `node_modules`) | 24/09 23:44 | worktree, branch `executora` |
| `centelha-techlead-revisora` | 559,9 MB | 24/09 23:56 | worktree, branch `revisora` |
| `centelha-mapa` | 214,4 MB (sem o `node_modules`) | 24/09 03:22 | worktree, branch `mapa` |
| `centelha-techlead` | 1 KB | 08/09 15:36 | casca, NÃO é worktree (ver abaixo) |
| `backup-mapa` | 947 KB | 22/09 12:25 | um zip de backup do mapa (ver abaixo) |

Conferido por `git worktree list` no `rpg-system`: quatro árvores, e só quatro (`rpg-system` em
`23fc7ae`, `centelha-executora` em `6be3ba3`, `centelha-mapa` em `30488de`,
`centelha-techlead-revisora` em `ae1c526`). As três de fora têm um `.git` que é arquivo apontando para
`rpg-system/.git/worktrees/<nome>`. Nenhuma é clone separado.

**`centelha-techlead`.** Não tem `.git`, não aparece no `git worktree list`. Dentro: uma `.claude/`
vazia (criada 07/09 22:22, modificada 08/09 16:36) e `bash.exe.stackdump` (1.221 bytes, um despejo de
pilha do bash, criado 07/09 04:34, modificado **08/09 15:40**, que é o arquivo mais recente). A sessão
que trabalhou nela tem transcrito próprio (`~/.claude/projects/C--Users-Neves-ClaudeCode-centelha-techlead/`,
último em 08/09 16:36). A PASSAGEM já foi corrigida sobre isso (`PASSAGEM.md:280-283`: "deixou de ser
worktree, mas a pasta continua no disco, como casca").

**`backup-mapa`.** Um arquivo só, `backup-mapa_20260922_122540.zip` (969.718 bytes), criado **22/09
às 12:25:52** pelo **Cartógrafo** (sessão `5fb90847`, aberta com `/cartografo`), a pedido do humano:
"os modificados e novos de lore/mapas/ e .claude/ que são do mapa, mais um git diff desses caminhos,
salvo fora do repositório, em C:\Users\Neves\ClaudeCode\backup-mapa\" (15:24:51 UTC). Dentro: 31
arquivos de `mapa/lore/mapas/` (documentos, dados, ferramentas) e `git-diff-lore-mapas.txt` (91 KB).
**Quem usa hoje: ninguém**, pelo que os transcritos mostram (nenhuma leitura depois de 22/09, fora dos
dois levantamentos). **30 dos 31 arquivos estão na branch `mapa`** (o conteúdo exato, por hash,
alcançável a partir dela). O que falta é `lore/mapas/dados/camadas_referencia.json`, numa versão que
difere também das duas cópias em disco (a suja do `rpg-system` e a da `centelha-mapa`).

**`defensor`.** Criada 24/09 15:58, modificada 17:16. Não tem `.git`, não é worktree, e é um **papel
fixo de outro projeto**: `~/.claude/papeis.json` tem a entrada `defensor::defensor`, papel "Defensor",
comando `/defensor`, projeto `C:/Users/Neves/ClaudeCode/defensor`, sessão própria, anotada 24/09 16:15.
Nada no repositório do Centelha nem nos meus transcritos cita essa pasta ou esse papel (as ocorrências
de "defensor" no repositório são a palavra de regra, o combatente que defende). **Fora de escopo**: não
abri.

### Fora de escopo, ou não sei (não abertas; tamanho não medido, porque medir seria descer nelas)

| pasta | modificada | classificação |
|---|---|---|
| `.claude` | 01/06 06:28 | NÃO SEI · configuração do Claude no nível da raiz, anterior ao Centelha nesta máquina; não abri |
| `a-toca-coletivo` | 18/08 | fora de escopo |
| `ai_custumer_support` | 25/08 | fora de escopo |
| `ai_email_support` | 01/07 | fora de escopo |
| `arduino` | 26/08 | fora de escopo |
| `audio-editor-product` | 05/09 | fora de escopo |
| `celular` | 26/08 | fora de escopo |
| `claude` | 18/09 | NÃO SEI · o nome não diz; há um transcrito dela que cita `backup-mapa` (só o nome do arquivo, achado na busca), e não abri |
| `cmdUI` | 02/06 | fora de escopo |
| `cod3rs` | 17/09 | fora de escopo |
| `colecionador_app` | 28/06 | fora de escopo |
| `concurso` | 26/08 | fora de escopo |
| `controle` | 02/09 | fora de escopo |
| `defensor` | 24/09 17:16 | fora de escopo (projeto próprio, acima) |
| `dev-studies` | 09/07 | fora de escopo |
| `edicao-video` | 15/09 | fora de escopo |
| `Elaboração_Projetos` | 14/09 | fora de escopo |
| `estante-encantada` | 14/09 | fora de escopo |
| `exalted` | 08/09 | NÃO SEI · Exalted é o sistema de onde o Centelha deriva; pode ser material de referência, e não abri |
| `extratos_nubank` | 04/09 | fora de escopo |
| `Filhos_do_Césio` | 18/08 | fora de escopo |
| `Filhos_do_Césio__backup_20260730` | 30/07 | fora de escopo |
| `Filhos_do_Césio__backup_20260731` | 30/07 | fora de escopo |
| `grimorio-features` | 07/08 | NÃO SEI · o nome lembra RPG, e não abri |
| `hapvida` | 12/09 | fora de escopo |
| `improve_resume` | 30/05 | fora de escopo |
| `jogo` | 05/09 | NÃO SEI · o nome não diz, e não abri |
| `layout-mesas` | 16/06 | NÃO SEI · "mesas" pode ser mesa de RPG ou não, e não abri |
| `mei` | 07/09 | fora de escopo |
| `mtg-deck-data`, `mtg-search`, `mtgdeck_app`, `mtgdeck_builder`, `mtgdeck_web` | 30/05 a 07/08 | fora de escopo |
| `painel-camara` | 09/07 | fora de escopo |
| `preco-alerta-master` | 30/05 | fora de escopo |
| `Projeto` | 17/06 | fora de escopo |
| `R36S` | 17/06 | fora de escopo |
| `roteiros` | 23/06 | fora de escopo |
| `site-matuta` | 26/08 | fora de escopo |
| `spotify` | 30/08 | fora de escopo |
| `video_frames` | 15/06 | fora de escopo |

### Os arquivos soltos (todos de Centelha)

| arquivo | bytes | criado (local) |
|---|---|---|
| `msg99.txt` | 1.254 | 23/09 23:32:01 |
| `runs100.txt` | 3.416 | 24/09 00:09:30 |
| `ce101.txt` | 3.248 | 24/09 02:42:07 |
| `val101.txt` | 56.820 | 24/09 02:43:16 |
| `build101.txt` | 59.383 | 24/09 02:43:44 |
| `msg101.txt` | 933 | 24/09 02:45:32 |
| `val102.txt` | 56.819 | 24/09 03:16:53 |
| `build102.txt` | 54.968 | 24/09 03:17:13 |
| `grid.bak` | 676.956 | 24/09 03:57:35 |
| `alcance.bak` | 9.430 | 24/09 03:57:35 |
| `val103.txt` | 58.378 | 24/09 04:02:10 |
| `build103.txt` | 54.711 | 24/09 04:02:24 |
| `b104a.txt` | 54.620 | 24/09 04:26:28 |
| `CENTELHA-PASTAS.md` | 3.303 | 24/09 04:31:51 |
| `b104b.txt` | 54.623 | 24/09 04:33:34 |
| `val104.txt` | 58.377 | 24/09 04:47:20 |
| `b104c.txt` | 113.988 | 24/09 04:47:57 |

## 2 · A segunda camada (só as pastas de Centelha)

Tamanho somado sem atravessar atalho; data = modificação da subpasta. `node_modules`, `.git`, `dist`
e `.astro` só registrados; `render`, `fonte` e `.venv` moram dentro de `lore/` e não foram abertos.

**`rpg-system`** (58 arquivos soltos no nível 1, 2,0 MB): `_shots/` 2,4 MB (22/09) · `.astro/` 1,8 MB
(24/09) · `.bancada/` 1,5 MB (14/08) · `.claude/` 29 KB (24/09) · **`.git/` 538,2 MB** (25/09) ·
`.github/` 7 KB (02/06) · `.portoes/` 2 KB (12/09) · **`.sim/` 1,19 GB** (07/09) · `.vscode/` 221 B
(25/07) · `Auditoria_Memoria/` 9 KB (17/09) · **`D&D/` 778,9 MB** (24/09 18:23) · `dist/` 56,2 MB
(23/09) · `docs/` 5,4 MB (17/09) · `legacy/` 1,3 MB (08/09) · **`lore/` 2,37 GB** (22/09) · `marca/`
2,2 MB (04/09) · **`node_modules/` 416,9 MB** (24/09 04:26, a pasta real) · `provas/` 16 KB (13/08) ·
`public/` 42,0 MB (11/09) · `scripts/` 3,5 MB (24/09) · `src/` 7,5 MB (22/09) · `supabase/` 300 KB
(14/09) · `voz-bench-lib/` 3,1 MB (10/09) · `voz-bench-modelo/` 82,0 MB (10/09).

**`centelha-executora`** (58 arquivos, 2,0 MB): `_shots/` 2 KB · `.astro/` 87 KB · `.bancada/` 0 B ·
`.claude/` 27 KB · `.github/` 7 KB · `.portoes/` 91 B · `.vscode/` 221 B · `Auditoria_Memoria/` 9 KB ·
`D&D/` 22 KB (24/09 03:16) · `dist/` 56,2 MB (24/09 23:51) · `docs/` 5,0 MB · `legacy/` 334 KB ·
`lore/` 20,9 MB · `marca/` 2,2 MB · **`node_modules` = junction → `rpg-system\node_modules`** (não
medido) · `provas/` 16 KB · `public/` 42,0 MB · `scripts/` 3,5 MB · `src/` 7,5 MB · `supabase/` 300 KB
· `voz-bench-lib/` 3,1 MB. Quase tudo datado de 24/09 02:27, o nascimento da árvore.

**`centelha-techlead-revisora`** (58 arquivos, 2,0 MB): `_shots/` 2 KB · `.astro/` 87 KB · `.bancada/`
0 B · `.claude/` 27 KB · `.github/` 7 KB · `.portoes/` 1 KB · `.vscode/` 221 B · `Auditoria_Memoria/`
9 KB · `dist/` 56,2 MB (24/09 18:09) · `docs/` 5,0 MB · `legacy/` 334 KB · `lore/` 20,9 MB · `marca/`
2,2 MB · **`node_modules/` 416,8 MB, pasta REAL e própria** (10/09), não junction · `provas/` 16 KB ·
`public/` 42,0 MB · `scripts/` 3,5 MB · `src/` 7,5 MB · `supabase/` 300 KB · `voz-bench-lib/` 3,1 MB.

**`centelha-mapa`** (58 arquivos, 2,0 MB): `_shots/` 2 KB · `.claude/` 24 KB · `.github/` 7 KB ·
`.vscode/` 221 B · `Auditoria_Memoria/` 9 KB · `docs/` 4,8 MB · `legacy/` 334 KB · **`lore/` 148,8 MB**
· `marca/` 2,2 MB · **`node_modules` = junction → `rpg-system\node_modules`** (não medido) · `provas/`
16 KB · `public/` 42,0 MB · `scripts/` 3,5 MB · `src/` 7,5 MB · `supabase/` 300 KB · `voz-bench-lib/`
3,1 MB. Sem `dist/` nem `.astro/`. Tudo datado de 24/09 03:21-03:23.

**`centelha-techlead`**: `.claude/` 0 B, e o `bash.exe.stackdump`. **`backup-mapa`**: só o zip.

## 3 · Os arquivos soltos: quem escreveu cada um

**Método.** Busca nos transcritos de todas as sessões do Centelha desde 15/09 (as do `rpg-system`, com
os teammates em `subagents/`, e as do `centelha-techlead`, `centelha-mapa` e `centelha-revisora`) por
todo comando que ESCREVE (`>`, `>>`, `cp`, `-o`, `Write`) num caminho que cai na raiz: `../x` dado de
dentro de uma pasta-filha da raiz, ou o caminho absoluto da raiz. Cada arquivo tem o comando achado, e
o segundo do comando bate com o segundo de criação do disco.

**Resposta curta: fomos nós. Dezesseis dos dezessete são da Executora da sessão anterior do Arquiteto
(`8519166b`, rodadas 99 a 104, 23 e 24/09), e o `CENTELHA-PASTAS.md` é do Arquiteto da mesma sessão.**
Todos por `../`: até 24/09 02:27 a Executora trabalhava no próprio `rpg-system`, e depois na
`centelha-executora`; as duas são filhas diretas da raiz, então `../` é a raiz.

| arquivo | o que tem dentro | quem, e o comando |
|---|---|---|
| `msg99.txt` | a mensagem de commit da rodada 99 (18 linhas) | Executora, `cat > ../msg99.txt`, usada em `git commit -F ../msg99.txt`, 02:31:59 UTC |
| `runs100.txt` | 70 linhas de runs do CI (id, sha, conclusão, data), rodada 100 | Executora, `gh run list ... > ../runs100.txt`, 03:09:29 UTC |
| `ce101.txt` | a saída de `scripts/cost-examples.mjs` (64 linhas), rodada 101 | Executora, `node scripts/cost-examples.mjs > ../ce101.txt` |
| `val101.txt`, `val102.txt`, `val103.txt`, `val104.txt` | a saída inteira do `npm run validate` (800 a 818 linhas; terminam em "Portões OK") | Executora, `npm run validate > ../valNNN.txt`, rodadas 101 a 104 |
| `build101.txt`, `build102.txt`, `build103.txt` | a saída do `npx astro build` (535 a 557 linhas; "107 page(s) built") | Executora, `npx astro build > ../buildNNN.txt` |
| `b104a.txt`, `b104b.txt` | idem, dois builds limpos da rodada 104 (antes e depois do conserto do glossário) | Executora, `rm -rf .astro dist && npx astro build > ../b104a.txt` / `b104b.txt` |
| `b104c.txt` | a saída do `npm run build` inteiro (validate, gen-monsters, astro, pagefind; 1.378 linhas) | Executora, `npm run build > ../b104c.txt` |
| `msg101.txt` | a mensagem de commit da rodada 101 (12 linhas) | Executora, `cat > ../msg101.txt` |
| `alcance.bak` | cópia de `src/lib/alcance.ts` | Executora, `cp src/lib/alcance.ts ../alcance.bak`, 06:57:34 UTC: o controle negativo da rodada 103 (desfazer o conserto, ver o teste falhar, restaurar) |
| `grid.bak` | cópia de `src/pages/mesa/grid.astro` | Executora, `cp src/pages/mesa/grid.astro ../grid.bak`, o mesmo comando, mesmo controle negativo |
| `CENTELHA-PASTAS.md` | guia de "qual pasta é qual", para o humano | **Arquiteto** da sessão `8519166b`, `Write` direto na raiz, 07:31:45 UTC; o próprio arquivo diz "não está no git e pode envelhecer" |

**Os dois `.bak` já estão no git, byte a byte.** O hash de cada um é o do blob que entrou no `3c931fd`
("Rodada 103: a folha da ação cala para arma de arremesso", 24/09 04:04), e os dois são idênticos ao
arquivo atual do `main` (conferido por `cmp`). Foram a cópia de segurança do controle negativo, e o
conserto que eles guardavam é o que foi commitado.

**Alguma instância ainda escreve na raiz? Sim, o mecanismo continua vivo.** A Executora desta sessão,
na rodada 105 (24/09 17:06 local), rodou `npm run build > ../centelha-executora-build.log`, e o
arquivo caiu na raiz. Ela mesma o apagou um minuto depois (`rm -f ../centelha-executora-build.log`,
17:07), por isso ele não está na listagem. Nas rodadas 106 e 107, nenhuma escrita na raiz. A Revisora
desta sessão e a da anterior: nenhuma (os `../` que ela usa são de dentro do scratchpad, e caem no
scratchpad). O Cartógrafo: só o `backup-mapa`, que foi pedido. O único `../` do Arquiteto anterior
além do `CENTELHA-PASTAS.md` foi o `git worktree add ../centelha-arq-tmp`, a árvore removida às 04:07.

**Limite do método:** acha o que foi escrito por comando com o caminho visível. Um script que grave
na raiz por dentro (um `.mjs` com caminho relativo) não apareceria aqui; nenhum arquivo da raiz ficou
sem autor, então nada indica que isso tenha acontecido.

### Onde deveriam ser escritos, e o que impede hoje

**Deveriam ir para o scratchpad da sessão** (`%TEMP%\claude\C--Users-Neves-ClaudeCode-rpg-system\<sessão>\scratchpad`),
que é onde a própria Executora anterior guardava os scripts dela (`aplica.py`, `lote7.json`, a cópia
`distAntes`) e onde a Revisora grava as saídas dela. Nas mesmas rodadas, a mesma Executora usou os dois lugares.

**O que impede, pelo que está escrito:**

1. **Nenhuma regra diz onde vai saída temporária.** Não há a palavra "scratchpad" nem "fora do
   repositório" com lugar definido no `.claude/commands/arquiteto.md` (o prompt de nascimento), na
   `PASSAGEM.md`, no `CONTRATO-REVISORA.md` nem nos despachos. A regra que existe é a negativa (não
   sujar a árvore, commitar com pathspec), e `../` é o jeito mais curto de obedecê-la.
2. **A geografia empurra para lá.** As worktrees são filhas diretas da raiz, então "um nível acima da
   árvore" é a raiz do `ClaudeCode`, e não uma pasta do Centelha.
3. **O caminho do scratchpad é longo e é da sessão do Arquiteto.** O teammate não tem um caminho
   curto e fixo para escrever; a Executora anterior o repetia inteiro em cada comando
   (`S="C:/Users/Neves/AppData/Local/Temp/claude/..."`), e quando o comando era curto (`> ../val101.txt`)
   ela não o usava. E ele muda a cada sessão nova do Arquiteto.
4. **`git commit -F` precisa de um arquivo fora da árvore**, senão a mensagem aparece como arquivo não
   rastreado; é a origem dos dois `msg*.txt`.

Nada disto é proposta: é o estado, para a conversa que vem depois.
