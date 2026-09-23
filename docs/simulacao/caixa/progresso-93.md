# Rodada 93 · Executora · progresso

- **17:46** · rodada aberta. `git pull --ff-only` ok, HEAD `bd93655`. Árvore com `lore/` sujo do Cartógrafo (não encosto). Despacho e `92-revisora.md` §3 e §4 lidos (o "§5" do despacho é a §4 do veredito: a folga de ±3).
- **17:48** · lidos `reapontar.mjs` inteiro e o bloco de citações de `test-procedencia.mjs:272-387`. Não existe teste do `reapontar.mjs`. Desenho: depois do mapa do diff, procurar a âncora (a mesma do portão) na janela de ±3 da linha mapeada; se a linha mapeada tem a âncora, fica; se só UMA linha da janela tem, grava essa; se duas ou mais, não escolhe e avisa (o `L65` proíbe escolher por proximidade quando repete). Modo `--tudo` para passar por toda citação, com ou sem diff.
- **17:50** · `reapontar.mjs` alterado (`ancoraDe`, `ancorar`, `--tudo`) e `scripts/test-reapontar.mjs` novo (repositório de mentira numa pasta descartável). Novo: exit 0, 6 de 6. **Controle negativo com o script de HEAD** (`git show HEAD:scripts/reapontar.mjs`, `--script`): exit 1, 3 falhas (a torta saiu em 9 no lugar de 8; no `--tudo` ficou 7). As que passam com o antigo: a certa e a ambígua (nenhuma das duas depende do conserto). Teste ligado no `validate`. Comentário de `aguentouFicarParado` ajustado (item 5).
- **17:51** · antes da varredura, `git status` dos 15 documentos do `DOCS`: limpos. `node scripts/reapontar.mjs --tudo`: **107 citações mudaram, 106 endireitadas** pela âncora, em 12 documentos; 10 AMBÍGUAS avisadas e deixadas. Distribuição dos deslocamentos: −1 (50), +1 (29), +2 (15), +3 (3), −3 (2), mais 8 de `artes-grid.ts` pelo diff do comentário. Segunda passada: nada se move. `validate` pegou "diretório temporário" no comentário do teste como tolerância sem condição; trocado por "pasta descartável"; `validate` exit 0.
- **17:52** · medida pedida no item 2, sem mexer no portão (cópia do `test-procedencia.mjs` no scratchpad, só a `JANELA` trocada): janela 2 fica verde; janela 1 dá 3 vermelhas; janela 0 dá 10, e as 10 são exatamente as ambíguas.
- **17:53** · primeira tentativa de commit: **o meu teste estragou a `.git/config` compartilhada.** Dentro do `pre-commit`, com `GIT_DIR`/`GIT_WORK_TREE` do gancho herdados, o `git init` + `git config` da árvore de mentira gravaram `core.worktree` (a pasta de validação, que sumiu em seguida) e `core.autocrlf = false` na config REAL. O commit saiu "nothing to commit", e `git status` passou a responder "must be run in a work tree". Mesma armadilha do L73, documentada em `test-rodada.mjs:45-69`, que eu não li antes de escrever o teste.
- **17:55:34** · conserto: `git config --local --unset` das duas chaves (as duas eram minhas: apareciam depois de `hooksPath`, na ordem em que o teste as escreve). Reflog intacto (topo `e8a3411`, do Arquiteto), índice real só com os meus três `A`, nenhum commit "base" em `git fsck --dangling` (os commits soltos de hoje são `WIP on main` de stash). Arquiteto avisado na hora.
- **17:56** · teste corrigido: `ENV_LIMPO` sem nenhuma `GIT_*` (menos `GIT_EDITOR`) para o `git` e para o script testado, e uma asserção nova: a `config --local` de quem chamou o teste não muda. Prova sem arriscar o repositório real: um repositório falso no scratchpad, com o ambiente do gancho simulado (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` apontando para ele). Novo: exit 0, config do falso limpa. **Controle**, a versão anterior do teste (a que estava no índice) no mesmo ambiente: exit 1 e o falso ganhou `core.worktree` e `core.autocrlf`, igual ao incidente.
- **17:57** · commit `5134d6c` com o gancho verde (o `test-reapontar` já corrigido rodou dentro dele), `core.worktree` e `core.autocrlf` ausentes depois. Push feito.

## Registro do incidente, pedido pelo Arquiteto depois do aviso (`d79206f`)

**O quê e quando:** das ~17:53 às **17:55:34** de 23/09/2026, a `[core]` da `.git/config` real teve duas chaves a mais, gravadas pela primeira versão do `test-reapontar.mjs` rodando dentro do `pre-commit` (sem limpar as `GIT_*`):

- `core.worktree = C:/Users/Neves/AppData/Local/Temp/tmp.fhonXSAzUy`
- `core.autocrlf = false`

Removidas com `git config --local --unset`. O relato (`93-executora.md`, seção "O incidente da `.git/config`") descreve a causa, o conserto e a prova num repositório falso.

**Outros testes de `scripts/` com o mesmo risco:** procurei todo `git init`/`git config` e todo `git` que escreve (`add`, `commit`, `checkout`, `stash`, `worktree`, `reset`) em teste que monta pasta descartável (`mkdtemp`/`tmpdir()`). São dois: o `test-rodada.mjs`, que já limpa as `GIT_*` (`:65-69`), e o `test-reapontar.mjs`, agora corrigido. O `test-portoes.mjs:413` roda `git config core.hooksPath`, mas só LÊ, no repositório real, que é o que ele quer ler. Nas outras ocorrências (`test-l84-caidofila-mesa.mjs:69`, `duo.mjs:215`) o comando só aparece em comentário. **Nenhum outro teste precisa de conserto.**

**Nota:** uma tentativa de commit às 17:59:46 esbarrou no `index.lock` do commit do aviso e morreu antes do gancho; a config idêntica daquela vez não prova nada e não é contada.

### A prova dentro do gancho

`git config --local --list` lido às **18:00:31**, ANTES do commit que leva este registro (o gancho roda o `validate` inteiro, com o `test-reapontar.mjs`):

```
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
core.hookspath=scripts/hooks
remote.origin.url=git@github.com:f-neves/centelha-rpg.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.main.remote=origin
branch.main.merge=refs/heads/main
branch.combate-simultaneo.remote=origin
branch.combate-simultaneo.merge=refs/heads/combate-simultaneo
branch.sim/base-congelada.remote=origin
branch.sim/base-congelada.merge=refs/heads/sim/base-congelada
branch.worktree-agent-a61135436a32b96cc.vscode-merge-base=origin/main
```

A listagem DEPOIS vai na linha seguinte, num segundo commit deste arquivo (um commit não pode conter o que acontece durante ele).

- **18:01:25** · commit `95e4733` feito (exit 0, 54 s, que é o tempo do gancho com `validate` e `tsc`). `git config --local --list` DEPOIS dele: **as mesmas 16 linhas, idênticas byte a byte** (`cmp` sem diferença) à listagem de 18:00:31 acima. Ressalva: o `rtk` resume a saída do `git commit` a "ok", então aquela vez não guardou o texto do gancho. Este segundo commit roda por `rtk proxy git commit`, para a saída do gancho ficar inteira, e a comparação antes e depois dele sai no relato ao Arquiteto.
