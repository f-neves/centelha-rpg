# Centelha

Sistema de RPG autoral (D6), publicado como site estático em Astro 5.
Base do GitHub Pages: `/centelha-rpg/`, então toda URL local precisa do prefixo
(`http://localhost:4321/centelha-rpg/ficha`, não `/ficha`).

## Duas instâncias em paralelo

**Outra instância do Claude Code pode estar mexendo neste repositório agora.**
O trabalho é dividido por frente (bestiário, ficha, capítulos, lore), e as duas
compartilham a mesma árvore de arquivos, o mesmo `dist/` e o mesmo `main`.

Regras de convívio:

- **Commite com pathspec: `git commit -m "..." -- arquivo1 arquivo2`.** Nada de
  `git add -A`, `git add .` nem `git commit -a`. E **`git add` dos seus arquivos não
  basta**: o índice é compartilhado com a outra instância, então se ela já deu `add`
  nos arquivos dela, o `git commit` sobe o índice **inteiro**, não só o que você
  adicionou. A forma com `--` commita só aqueles caminhos e ignora o resto do índice.
  Isso já deu errado três vezes (a última foi `114e31c`, um commit das Artes que levou
  junto três arquivos da mesa), e as duas primeiras regras falharam porque descreviam
  o sintoma e não o mecanismo.
- **Se o `git pull --rebase` falhar com `Please commit or stash them`, tem coisa de
  outra frente no caminho.** Rode `git status --short` e confira se a coluna da
  esquerda (staged) tem arquivo que não é seu antes de commitar.
- **`git pull --rebase` antes de commitar e antes de dar push.** As duas empurram
  para `main`; sem rebase o push é recusado, e com rebase o conflito só aparece se
  ambas tocarem a mesma linha.
- **Prefira `Edit` a `Write`** em arquivo que você não criou nesta sessão. O `Edit`
  falha alto se o trecho mudou embaixo de você; o `Write` sobrescreve inteiro e
  apaga em silêncio o que a outra instância acabou de escrever.
- **Antes de `npm run build`, considere que a outra pode estar buildando.**
  `dist/` e `.astro/` são compartilhados; build simultâneo produz saída corrompida
  e erros fantasma de "Duplicate id". Se aparecerem, apague `.astro/` e refaça.
- Ao terminar, **diga em uma linha quais arquivos você tocou**, para a outra frente
  saber o que mudou debaixo dela.

### Onde as frentes se encostam

A divisão costuma ser: uma frente cuida de `/mesa` (o painel do mestre, o Grid de
combate, o Supabase), a outra cuida das regras (dados, ficha, capítulos). Elas
quase não se cruzam, exceto em quatro lugares:

- `src/layouts/Base.astro` e `src/styles/global.css`: as duas mexem, e é o encontro
  mais provável. Edite o mínimo e diga o que mudou.
- `src/lib/equip.ts`: contrato silencioso. A ficha escreve o formato da arma; o
  rastreador de combate da mesa lê esse formato por `armaDoSlot`. Mudar a forma do
  objeto não gera conflito no git e quebra o combate sem aviso.
- `src/data/*.json`: a frente das regras escreve, a frente da mesa lê. Renomear
  perícia, atributo ou chave muda o chão da outra.
- `src/lib/site.ts` é só da frente das regras (não há entrada de `/mesa` nele), e
  `src/lib/mesa-*.ts` é só da frente da mesa.

## Fim de linha · o clone que já existia

O `.gitattributes` fixa tudo em LF, **e ele só age no checkout**. Uma árvore criada
antes dele (a sua, uma worktree, a máquina de outra pessoa) continua com CRLF no
disco e com `git status` **limpo**, porque o git normaliza na comparação e não acusa
nada. O sintoma é o do defeito que ele conserta: `validate` vermelho com
`0 criatura(s) divergem`.

Renormalizar a árvore, uma vez por clone:

```sh
git status --porcelain                       # 1. tem de estar limpo, ou pare aqui
git ls-files --eol | awk '$1 !~ /-text/ && $2 ~ /crlf/ {print $NF}' > /tmp/crlf.txt
wc -l < /tmp/crlf.txt                        # 2. quantos arquivos vão ser reescritos
while IFS= read -r f; do rm -f "$f"; done < /tmp/crlf.txt
git checkout -- .                            # 3. o git reescreve, agora em LF
git ls-files --eol | awk '$1 !~ /-text/ && $2 ~ /crlf/' | wc -l   # 4. tem de dar 0
```

Apagar antes do `checkout` é o que faz funcionar: para o git os arquivos já estão em
dia, então ele só os reescreve se sumirem. E o passo 1 não é formalidade: o
`checkout -- .` descarta alteração não commitada.

## Produção

- **O deploy é automático**: todo push em `main` dispara `deploy.yml`, que roda
  `npm run build` e publica no GitHub Pages. Não há publicação manual, e o que
  está no ar é sempre o último commit cujo build passou.
- **As migrações do Supabase NÃO são automáticas.** Elas são rodadas à mão no
  SQL Editor, uma a uma, e o repositório não sabe quais já foram. Para descobrir,
  sonde o esquema pelo PostgREST com a chave anon: tabela ou coluna que não
  existe devolve `42P01` / `42703` / `PGRST202`, e a que existe e está fechada
  pela RLS devolve outra coisa. É a única leitura de produção possível daqui.
- **Todo commit que toque `src/` traz uma linha dizendo o que muda para quem está
  jogando hoje, e se depende de migração.** Quem lê a mensagem não é quem
  escreveu o código: é quem vai abrir a mesa amanhã.
- Todo caminho que dependa de migração ainda não rodada tem de degradar sem
  quebrar, e dizer qual arquivo rodar. Ver `carimbarSeFaltar` (migração 29) e o
  `sec-gravar` da aba Grupo (migração 30).

## O essencial do repositório

- `src/data/*.json` é a fonte da verdade das regras. Os capítulos em
  `src/content/chapters/` descrevem, não definem; quando os dois discordam, o JSON
  vence e o capítulo se corrige.
- `npm run validate` é o portão rápido: integridade referencial dos dados mais a
  regressão de personagem (`test-kael.mjs`). `npm run build` roda os dois antes do
  Astro, então build verde é garantia real, não formalidade.
- Catálogos de perícias nos capítulos são **gerados**, não escritos à mão:
  `node scripts/gen-cap-pericias.mjs` depois de mexer nos JSONs de habilidades.
- A ficha (`/ficha`) é montada por JS no cliente, em `src/lib/ficha-engine.ts`.
  Estilo de elemento criado em tempo de execução precisa de `<style is:global>`;
  `<style>` com escopo não alcança e falha calado.
- Renomear a chave de um traço quebra fichas salvas (a persistência é por slug).
  Toda renomeação precisa de entrada em `RENOMES`, em `ficha-engine.ts`.
- Para ver o site de verdade: `node .claude/skills/run-centelha-rpg/driver.mjs`
  (sobe o dev server, dirige o Edge headless, roda o smoke da ficha).

## Escrita

- Sem travessão (—) em nenhum texto: prosa, capítulo, comentário, mensagem de
  commit. No lugar, vírgula, dois-pontos, parênteses, ponto ou ponto-médio (·).
  A exceção é fala de personagem em ficção.
- Sem coautoria do Claude/Anthropic em commits ou PRs.
