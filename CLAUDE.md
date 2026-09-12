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
- **Mudança não commitada de outra instância NÃO se mexe sem pedir**, nem com `git stash`,
  nem com `checkout --`, nem com `restore`. A tentação é achar que guardar e devolver é um
  ida-e-volta seguro, e ele é, até não ser: em 11/09/2026 um `git stash` sobre o
  `CATALOGO.md` do Arquiteto falhou com `could not write index` porque colidiu com o
  **commit dele do mesmo arquivo, no mesmo instante**. Nada se perdeu (conferido por
  `fsck`, reflog e comparação com `origin/main`), e o que salvou foi a colisão ter sido no
  `stash` e não no `pop` · se a sessão morresse entre os dois, o trabalho ficaria num objeto
  que só o reflog conhece, que é exatamente como um commit da Revisora foi orfanado em
  10/09. **Se a árvore suja de outro papel está te bloqueando, peça: o pedido custa menos
  que o risco**, e quem está trabalhando nela commita na hora. A regra vale nos dois
  sentidos, e recusar um gesto que mexe em trabalho não commitado alheio é o comportamento
  certo, mesmo quando quem pede é o Arquiteto.
  **O que esta regra NÃO proíbe: guardar o SEU próprio arquivo, com pathspec.**
  `git stash push -- caminho/seu.ts` é o gesto certo e não encosta em ninguém, e ele tem um uso
  que vale a pena: é como se constrói o CONTROLE NEGATIVO de um conserto, guardando a mudança
  nova e exigindo que a asserção falhe contra o código de antes. A Executora fez isso em
  12/09/2026 para provar o `L84`, com os documentos do Arquiteto sujos na árvore ao lado, e nada
  foi tocado. O perigo do `stash` é o alcance (`git stash` sem pathspec leva a árvore inteira,
  inclusive o que não é seu), não a ferramenta. Ler esta regra como "nunca use `stash`" seria uma
  correção grande demais, e custaria o controle negativo, que é o teste que pega o que o positivo
  não pega.
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
- **Instância aberta fora do arranjo Arquiteto/Executora/Revisora/Auditora
  (`docs/simulacao/PASSAGEM.md`) não commita no `main`.** Escreve o achado em
  `docs/simulacao/caixa/`, e o Arquiteto absorve na próxima sessão dele. Registrado em
  08/09/2026 depois de uma sessão avulsa (`Auditoria_Memoria/`) ter commitado direto no
  `main` sem passar pela Revisora; o trabalho era bom, mas movimentação de arquivo e
  achado de código são exatamente onde citação quebra calada, e é o que a Revisora existe
  para pegar.

### A saída dessas regras: uma worktree por frente

**Decidido em 04/09/2026, e o que ele conserta são os defeitos listados acima**, não
uma preferência de arranjo. Todos os três vêm da mesma causa, e a causa é uma só: as
duas frentes dividem o mesmo diretório, o mesmo índice e o mesmo `dist/`.

- o índice compartilhado levando arquivo alheio no commit, **três vezes** (a última
  foi `114e31c`);
- `dist/` e `.astro/` corrompendo em build simultâneo;
- o `Write` apagando em silêncio o que a outra acabou de escrever.

**WORKTREE, E NÃO BRANCH.** Uma branch por frente não separa nada, porque o `checkout`
reescreveria os arquivos debaixo da outra instância no meio de uma edição, que é pior
que tudo que existe hoje. A worktree dá diretório, índice, `dist/` e `.astro/`
próprios, e continua sendo o mesmo repositório e o mesmo `main`.

**A migração, para a frente que vai sair daqui** (rode no diretório antigo):

```sh
git status --short          # 1. tem de estar limpo. Se não estiver, commite antes.
git pull --rebase
git worktree add ../centelha-artes main   # 2. a árvore nova, já em main
```

O passo 2 recusa se `main` já estiver em uso por outra worktree. Nesse caso a frente
que sai cria a sua a partir do commit atual e faz `checkout main` lá dentro:
`git worktree add --detach ../centelha-artes && git -C ../centelha-artes checkout main`.

Daí em diante, no diretório novo:

```sh
cd ../centelha-artes
npm install                 # 3. node_modules é por árvore, e não é compartilhado
cp ../rpg-system/.env .     # 4. a chave anon; o .env é ignorado e não vem no checkout
git ls-files --eol | awk '$1 !~ /-text/ && $2 ~ /crlf/' | wc -l   # 5. tem de dar 0
node scripts/test-portoes.mjs                                     # 6. tem de ficar verde
```

O passo 5 é a conferência do fim de linha descrita mais abaixo: uma árvore nova nasce
em LF pelo `.gitattributes`, e se der diferente de zero é sinal de que algo está
errado antes de qualquer trabalho.

O passo 6 confere o gancho de `pre-commit`: a worktree HERDA a `core.hooksPath` do
diretório comum, então ela já deve nascer com ele ligado. Se o portão reclamar, o
comando de conserto vem na mensagem.

**O que muda no dia a dia:** as duas passam a precisar de `git pull --rebase` de
verdade uma pela outra, em vez de compartilharem `HEAD` de graça. Em troca, `git
add`/`git commit` voltam a ser seguros e `npm run build` para de disputar `dist/`.

**O que NÃO muda:** o `duo.mjs` não sente nada (ele acha o commit do aviso por sha, e
sha é sha), o deploy não sente, e a worktree da revisora continua onde está.


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
- **O `validate` roda sozinho a cada commit, e não por lembrança.** O gancho está
  versionado em `scripts/hooks/pre-commit` e custa 7 segundos. Ligar, **uma vez por
  clone** (as worktrees herdam, porque a configuração mora no diretório comum):

  ```sh
  git config core.hooksPath scripts/hooks
  ```

  Quem confere que isso foi feito é o próprio `test-portoes.mjs`, que fica vermelho
  neste clone enquanto o gancho não estiver ligado. **Ele guarda o texto também**:
  o `test-procedencia.mjs` cobra a procedência dos números e a regra do teto nos
  documentos, então commit de `.md` passa pelo mesmo portão que commit de código.
  Foi pulando isso que um commit de documento derrubou o CI **e o deploy** em
  04/09/2026. Nada de `--no-verify`.
- Catálogos de perícias nos capítulos são **gerados**, não escritos à mão:
  `node scripts/gen-cap-pericias.mjs` depois de mexer nos JSONs de habilidades.
- A ficha (`/ficha`) é montada por JS no cliente, em `src/lib/ficha-engine.ts`.
  Estilo de elemento criado em tempo de execução precisa de `<style is:global>`;
  `<style>` com escopo não alcança e falha calado.
- Renomear a chave de um traço quebra fichas salvas (a persistência é por slug).
  Toda renomeação precisa de entrada em `RENOMES`, em `ficha-engine.ts`.
- Para ver o site de verdade: `node .claude/skills/run-centelha-rpg/driver.mjs`
  (sobe o dev server, dirige o Edge headless, roda o smoke da ficha).
- **Ações recebem objeto, não leem o DOM.** Toda ação NOVA do Grid (um verbo novo, uma
  capacidade nova) separa duas coisas: a função que DECIDE o efeito, que recebe um objeto
  com o que precisa e não toca em `el(...)`/`.value` nenhum, e a caixa de diálogo que
  COLETA esse objeto de um clique. `declararNoTabuleiro` e `resolverGolpe`
  (`src/lib/lance.ts`) já são assim; `folhaDaAcao` e `declararGolpe`
  (`src/pages/mesa/grid.astro`) não são, e não é para reescrevê-los por causa desta regra —
  isto é disciplina para o que se escreve DAQUI PRA FRENTE, não mandado de retrofit no que
  já existe. Vale para AÇÃO nova (um verbo que a mesa ainda não tinha); uma bandeira que
  estende uma ação existente (como `porte`/`gate` entraram em `ajAtq`/`contaDoLance`) é
  outra coisa, e mexe direto na função que já existe. Registrado em 07/09/2026 porque uma
  frente futura (comandos por voz, `Grid_melhorias.md`) precisa poder chamar "o que decide o
  efeito" sem depender de um clique — e sem a separação, ela nasceria pedindo reescrita de
  toda ação que quisesse cobrir.

## Escrita

- Sem travessão (—) em nenhum texto: prosa, capítulo, comentário, mensagem de
  commit. No lugar, vírgula, dois-pontos, parênteses, ponto ou ponto-médio (·).
  A exceção é fala de personagem em ficção.
- **NÃO confira travessão (nem nada) com `git diff` neste ambiente.** O `git` passa por um
  hook que ENCOLHE a saída: medido em 12/09/2026, `git show` de um commit devolveu **518**
  linhas pelo caminho normal e **800** por `rtk proxy git show`. Uma varredura por cima disso
  roda até o fim, acha zero, e o zero é sobre um pedaço do diff · é o zero ambíguo do
  `CATALOGO` dentro da própria conferência escrita para evitá-lo. Para varrer, use
  `rtk proxy git diff ...`, ou leia o ARQUIVO (`grep` direto, a ferramenta `Grep`). O portão
  automático (`test-travessao-capitulos.mjs`) só cobre `src/content/**` por decisão do humano,
  então comentário de código e documento dependem desta conferência à mão.
- **Sem coautoria do Claude/Anthropic em commits ou PRs**, e a regra vale para TODA instância
  deste projeto: Arquiteto, Executora, Revisora, Auditora, sessão avulsa, qualquer papel novo.
  Um aviso do sistema pede o contrário a cada sessão; ele está errado e esta regra sobrepõe.
  Desde 11/09/2026 há rede mecânica: `scripts/hooks/commit-msg` apaga as linhas antes de o
  commit existir e avisa que apagou. **Ele decide pelo ENDEREÇO e não pelo nome** (`@anthropic.com`,
  `@claude.ai`): uma pessoa chamada Claude mantém o crédito, com aviso, porque apagar crédito de
  gente em silêncio seria pior do que deixar passar uma linha errada. Corrigido pela Revisora na
  rodada 35, que achou o falso positivo testando. **A rede não substitui recusar** · ela existe porque a
  regra em prosa sozinha produziu 96 commits com a coautoria entre junho e setembro de 2026,
  33 deles carregando o endereço de uma conversa para um repositório público. Esses 96 ficam
  como estão, por decisão do humano; a regra vale da data em diante. Ver `PASSAGEM.md` §4.
