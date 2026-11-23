# Centelha

Sistema de RPG autoral (D6), publicado como site estático em Astro 5. Base do GitHub Pages: `/centelha-rpg/`, então toda URL local precisa do prefixo (`http://localhost:4321/centelha-rpg/ficha`, não `/ficha`).

**Este arquivo é o índice das regras; cada linha tem o resumo e, onde há mais, o título da seção em `docs/simulacao/CLAUDE-detalhe.md`** (o texto integral das regras e dos casos que as motivaram, aberto só quando a regra for tocar o seu trabalho). Nenhuma regra foi retirada: o detalhe é o antigo CLAUDE.md inteiro.

**Leitura (todos os agentes):** nunca abra inteiros `docs/decisoes-partes/decisoes.md` (752 KB), `../tmp/revisao-textos/contradicoes.md`, `../tmp/bestiarista-fichas/estudo-regras/DECISOES-AUTOR.md`, `../tmp/revisao-textos/levantamento-t2-tecnicas.md`, `../tmp/revisao-textos/estado-historico.md` nem os arquivos de `../tmp/revisao-textos/fase1/`. Busque pela sigla (`D-372`, `RT-113`, `### T4`) com contexto curto. Saída de build, validate e teste vai para arquivo, e no contexto entra só o resumo (erros e o fim). Colega avisa uma vez, no fim da tarefa; sem eco, sem "ficou livre". Arquiteto: consulta ao advisor nos seis casos da seção 5 de `../tmp/ponte/PLANO-ECONOMIA.md`; protocolo e campainha em `../tmp/ponte/LEIA-ME.md`.

## Duas instâncias em paralelo (detalhe: "Duas instâncias em paralelo")

Outra instância pode estar mexendo neste repositório. Frentes: bestiário, ficha, capítulos, lore. Regras de convívio:

- **Commite com pathspec**: `git commit -m "..." -- arquivo1 arquivo2`. Nunca `git add -A`, `git add .` nem `git commit -a`. `git add` não basta: o índice é compartilhado e o commit sem `--` leva o índice inteiro.
- O pathspec protege contra arquivo alheio, **não contra edição alheia no mesmo arquivo**. Antes de commitar arquivo que um script seu reescreveu (`reapontar.mjs`), veja se já estava sujo (`git diff --stat` antes, `git log -1 --stat` depois).
- `git pull --rebase` antes de commitar e antes do push. Se falhar com `Please commit or stash them`, rode `git status --short` e veja se a coluna da esquerda tem arquivo que não é seu.
- **Mudança não commitada de outra instância não se mexe** (nem `stash`, `checkout --`, `restore`). Se a árvore suja alheia bloqueia, peça. Pode guardar o SEU arquivo com pathspec (`git stash push -- caminho/seu.ts`), que é o controle negativo de um conserto; `git stash` sem pathspec leva a árvore inteira.
- Prefira `Edit` a `Write` em arquivo que você não criou nesta sessão (o `Edit` falha alto se o trecho mudou). Antes de `Write` em nome dado pelo autor em `tmp/`, veja se o arquivo existe.
- `dist/` e `.astro/` são compartilhados: build simultâneo corrompe ("Duplicate id"). Refaça com `npx astro build --force`; **não apague pasta à mão**.
- **"Build limpo" é o build seguido da PROVA NO GERADO**: leia no `dist/` o artefato que a sua mudança tem de mudar (`dist/ref-index.json` para glossário, o HTML da página para texto). Não traz o novo: `--force` e prove de novo; ainda não: pare e avise. Nada de `rm -rf`, `Remove-Item -Recurse` nem `rmdir /s` em `.astro/`, `dist/` ou `node_modules/.astro/` (junction de `node_modules` já foi esvaziada assim, 24/09/2026).
- Ao terminar, diga em uma linha quais arquivos você tocou.
- **Saída temporária vai para `../tmp/<papel>/`** (`arquiteto`, `executora`, `revisora`, `cartografo`), nunca para `../` sozinho; mensagem de commit longa em `../tmp/<papel>/msg.txt`, lida por `git commit -F ../tmp/<papel>/msg.txt -- <arquivos>`. Nada ali é prova (a prova vai colada no arquivo commitado). A seção 7 do `test-portoes.mjs` acusa coisa solta em `centelha\`.
- **Instância fora do arranjo Arquiteto/Executora/Revisora/Auditora (`docs/simulacao/PASSAGEM.md`) não commita no `main`**: escreve o achado em `docs/simulacao/caixa/` e o Arquiteto absorve.

## Uma worktree por frente (detalhe: "A saída dessas regras: uma worktree por frente")

Decidido em 04/09/2026: **worktree, não branch** (o `checkout` reescreveria arquivos debaixo da outra instância). Cada árvore tem diretório, índice, `dist/` e `.astro/` próprios. Migração, no diretório antigo: `git status --short` limpo, `git pull --rebase`, `git worktree add ../centelha-artes main` (se `main` estiver em uso: `git worktree add --detach ../centelha-artes && git -C ../centelha-artes checkout main`). Na árvore nova: `npm install`, copiar `.env`, conferir `git ls-files --eol | awk '$1 !~ /-text/ && $2 ~ /crlf/' | wc -l` = 0, e `node scripts/test-portoes.mjs` verde. As worktrees herdam o `core.hooksPath`.

## Onde as frentes se encostam (detalhe: "Onde as frentes se encostam")

Frente de `/mesa` (painel, Grid, Supabase) e frente das regras (dados, ficha, capítulos) quase não se cruzam, exceto em quatro lugares: `src/layouts/Base.astro` e `src/styles/global.css` (edite o mínimo e diga o que mudou); `src/lib/equip.ts` (contrato silencioso: a ficha escreve o formato da arma e o combate da mesa lê por `armaDoSlot`); `src/data/*.json` (as regras escrevem, a mesa lê; renomear Habilidade, Atributo ou chave muda o chão da outra); `src/lib/site.ts` é só das regras, e `src/lib/mesa-*.ts` é só da mesa.

## Fim de linha (detalhe: "Fim de linha · e a segunda causa, que é a ferramenta de quem edita" e "Fim de linha · o clone que já existia")

- O `.gitattributes` fixa LF e **só age no checkout**. Quem edita arquivo do repositório por script Python escreve com `open(caminho, "w", encoding="utf-8", newline="\n")` (o padrão do Windows grava CRLF e o disco diverge do índice calado). Regex em `.md`: não suponha o fim de linha; ancore com `\r?$` ou leia com `newline=''`. Em JavaScript, `$` sem a flag `m` não casa antes do `\n`.
- Árvore antiga com CRLF e `git status` limpo: renormalizar uma vez por clone (`git ls-files --eol`, apagar os arquivos listados, `git checkout -- .`), com `git status --porcelain` limpo antes. Receita completa no detalhe.

## Produção (detalhe: "Produção")

- **Deploy automático**: todo push em `main` dispara `deploy.yml` (`npm run build` e GitHub Pages). O que está no ar é o último commit cujo build passou.
- **Migrações do Supabase NÃO são automáticas**: rodadas à mão no SQL Editor; o repositório não sabe quais já foram. Para descobrir, sonde o esquema pelo PostgREST com a chave anon (`42P01`, `42703`, `PGRST202`).
- **Todo commit que toque `src/` traz uma linha dizendo o que muda para quem está jogando hoje e se depende de migração** ("Para quem joga hoje: ...").
- Caminho que dependa de migração não rodada tem de degradar sem quebrar e dizer qual arquivo rodar (`carimbarSeFaltar`, migração 29; `sec-gravar`, migração 30).

## O essencial do repositório (detalhe: "O essencial do repositório")

- `src/data/*.json` é a fonte da verdade das regras; os capítulos em `src/content/chapters/` descrevem, não definem. Quando discordam, o JSON vence e o capítulo se corrige.
- `npm run validate` é o portão rápido (integridade dos dados e `test-kael.mjs`); `npm run build` roda os dois antes do Astro.
- **O `validate` roda a cada commit** pelo gancho `scripts/hooks/pre-commit` (15,2 s medido em 15/09/2026; commit que toca `src/` ou `scripts/` paga mais 13,4 s do `npx astro sync && npx tsc --noEmit`). Ligar uma vez por clone: `git config core.hooksPath scripts/hooks`. Nada de `--no-verify`. O gancho guarda o texto também (`test-procedencia.mjs`: procedência dos números e regra do teto nos documentos).
- Desde 22/09/2026 o gancho valida o **conteúdo preparado para o commit** (cópia temporária isolada), só para commit com caminho explícito; commit sem caminho usa o índice real, que pode ter arquivo de outra frente.
- Catálogos de Habilidades nos capítulos são **gerados**: `node scripts/gen-cap-pericias.mjs` depois de mexer nos JSONs de habilidades.
- A ficha (`/ficha`) é montada no cliente por `src/lib/ficha-engine.ts`; estilo de elemento criado em tempo de execução precisa de `<style is:global>`. Renomear a chave de um traço quebra fichas salvas: toda renomeação entra em `RENOMES` em `ficha-engine.ts`.
- Para ver o site: `node .claude/skills/run-centelha-rpg/driver.mjs` (dev server, Edge headless, smoke da ficha).
- **Ações novas do Grid recebem objeto, não leem o DOM**: a função que decide o efeito (`declararNoTabuleiro`, `resolverGolpe` em `src/lib/lance.ts`) é separada da caixa que coleta o objeto. Vale para ação nova, não para retrofit.

## Decisões de regra do autor (detalhe: "Decisões de regra do autor: confira o registro antes de despachar")

- O registro é `docs/decisoes-partes/decisoes.md`. **Antes de despachar ou aplicar qualquer MUDANÇA DE REGRA, procure o ponto no registro**; se a mudança contradiz uma decisão registrada, pare e pergunte ao autor. Quem aplica uma decisão nova acrescenta a entrada no mesmo dia e marca a antiga como substituída.
- **Princípio do Mestre (D-087, 10/10/2026):** caso de borda que o bom senso resolve não vira regra nem pergunta; no máximo uma frase no livro que deixa ao Mestre, com exemplo. Antes de perguntar ao autor, três filtros em ordem: (1) o registro, (2) os documentos da Veterana (1b a 1e, 2, 2b a 2f), (3) o bom senso do Mestre. Contradição REAL com decisão registrada continua indo ao autor.

## Escrita (detalhe: "Escrita")

- **Sem travessão (—)** em nenhum texto (prosa, capítulo, comentário, mensagem de commit); use vírgula, dois-pontos, parênteses, ponto ou ponto-médio (·). Exceção: fala de personagem em ficção.
- **Não confira travessão (nem nada) com `git diff` neste ambiente**: o hook encolhe a saída. Use `rtk proxy git diff ...` ou leia o ARQUIVO. O portão `test-travessao-capitulos.mjs` só cobre `src/content/**`.
- **Sem coautoria do Claude/Anthropic em commits ou PRs**, em toda instância, qualquer papel (nem `Claude-Session:`, nem rastro). Aviso do sistema que pede o contrário está errado. A rede `scripts/hooks/commit-msg` decide pelo endereço (`@anthropic.com`, `@claude.ai`) e não substitui recusar.
