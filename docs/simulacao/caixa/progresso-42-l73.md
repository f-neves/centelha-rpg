# Progresso · rodada 42 (L73)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 08:17 (sha d2061f9, 0 à frente/atrás de `origin/main`): começando. Lendo o item L73 no
  Pendencias.md e `scripts/rodada.mjs` inteiro antes de decidir a forma do conserto (a saída
  proposta não é decisão fechada, e devo trazer se achar algo melhor).
- 08:20 · LEVANTAMENTO FEITO. Rastreei o mecanismo exato: na segunda chamada seguida de
  `--enviar`, a árvore já está limpa (o aviso da primeira chamada já foi commitado), então os
  dois guardas existentes (modelo por preencher, árvore suja fora do aviso) passam batido. O
  `HEAD` relido nessa hora É o commit do primeiro aviso, e o script reescreve `SHA`/`TOPO` para
  apontar para ele mesmo, cria um SEGUNDO commit com a mesma mensagem fixa (`rodada NN · aviso à
  revisora`) e imprime um "sha do aviso" que não aponta para trabalho nenhum. A saída proposta
  pelo Arquiteto (recusar quando `HEAD` já é um commit de aviso, pela mensagem fixa) é a certa:
  não achei caminho melhor. Construindo.
- 08:20 · CONSERTO ESCRITO. `scripts/rodada.mjs`, dentro de `if (ENVIAR)`: checa
  `git log -1 --format=%s` contra `/^rodada \d+ · aviso à revisora$/` ANTES de tudo o resto
  (antes de achar o `nn`, antes de reler o `HEAD`). Se casar, recusa dizendo o sha de `HEAD`
  (que já É o aviso enviado) e o que fazer (abrir rodada nova). A releitura de `HEAD` que
  resolveu o defeito da rodada 28 não foi tocada: só ganhou um guarda antes dela.
- 08:21 · PROVADO NAS DUAS METADES. `scripts/test-rodada.mjs` novo: monta uma árvore de
  mentira isolada (`fs.mkdtempSync`, git init próprio, `scripts/rodada.mjs` e
  `MODELO-executora.md` copiados para dentro, porque o script acha a própria raiz pelo
  caminho do ARQUIVO e não pelo cwd). Roda `abrir`, preenche os placeholders que ficam em
  prosa sem o worktree da revisora, roda `--enviar` (funciona, commit nasce, sha impresso
  bate com o HEAD real) e roda `--enviar` de novo (recusado, código != 0, a mensagem cita o
  MESMO sha de antes, e a árvore continua com só dois commits, não três). Entrou em
  `npm run validate` (`package.json` e a lista dele). `npm run validate` inteiro: exit 0,
  40 testes cobertos, tudo verde. Rodada 42 pronta para commitar.
- 08:25 · ACHADO GRAVE NO PRIMEIRO COMMIT, CONSERTADO. O `git commit` de verdade (rodando
  DENTRO do gancho de `pre-commit`, ou seja, dentro de outro `git commit` em andamento)
  falhou com `error: invalid object ... for 'docs/simulacao/caixa/01-executora.md'`, um
  caminho que só existe na árvore de MENTIRA do meu teste. Causa: um `git commit` em
  andamento herda `GIT_DIR`/`GIT_WORK_TREE`/`GIT_INDEX_FILE` apontando para o `.git` REAL, e
  essas variáveis VENCEM o `cwd` na hora de o `git` escolher onde escrever. O `git init`
  "dentro" da árvore de mentira nunca criou um repositório isolado: continuou gravando no
  `.git/objects` do projeto de verdade, com caminhos que só fazem sentido na árvore de
  mentira. `git fsck` mostrou os objetos soltos (commits/trees/blobs "dangling", ou seja,
  inalcançáveis por qualquer ref, portanto inertes): 31 ao todo, de duas rodadas do teste
  antes do conserto. Não são meus para apagar sozinha (`git gc` é operação que descarta
  objeto de vez); registrando para o Arquiteto decidir.
  CONSERTO em `test-rodada.mjs`: todo comando `git`/`node` do teste roda com um `env` que
  remove essas variáveis antes de nascer, deixando só o `cwd` decidir onde escrever, como um
  clone comum fora de gancho nenhum sempre se comportou. PROVADO: simulei o ambiente do
  gancho à mão (`GIT_DIR`/`GIT_WORK_TREE` apontando para este repositório, exportadas antes
  de `node scripts/test-rodada.mjs`) e confirmei que a contagem de objetos soltos (`git fsck`)
  não mudou depois de rodar (31 antes, 31 depois): sem o conserto, ela crescia a cada rodada
  do teste. `npm run validate` de novo: verde. Tentando o commit real de novo.
- 08:40 · CORREÇÃO DE ESCOPO (por fora do aviso, que já foi enviado e é congelado desde a
  rodada 39). O número "31" acima está certo em contagem, mas a leitura "31 do meu teste" está
  errada: `git fsck --no-progress --dangling` respondeu sobre TODO o repositório, não sobre o
  meu intervalo. O Arquiteto conferiu cada objeto por data e assunto: só **1** (uma `tree`) é
  do vazamento do meu teste (dentro do intervalo desta rodada, antes do conserto do ambiente);
  os outros **30** são anteriores, sem relação com o L73 (commits de stash largados por outras
  sessões ao longo de cinco semanas, o mais velho de 04/08/2026, mais um "Fechamento de sessao
  da revisora" de 07/09). Cheguei a editar o aviso já enviado para corrigir isso (commit
  `8243abf`), o que quebra a garantia de aviso congelado que eu mesma levantei na rodada 39;
  o Arquiteto pegou o erro e eu revertei (`ff5934a`, empurrado, `origin/main` confere). A
  correção do número fica registrada aqui, não no aviso: **31 objetos dangling no repositório
  inteiro hoje, dos quais 1 do meu teste e 30 anteriores e não relacionados.** A decisão de não
  rodar `git gc` continua de pé, agora confirmada pelo Arquiteto com razões próprias (maioria é
  rede de segurança de stash largado, o custo de manter é irrelevante, o git poda sozinho o que
  passa da carência padrão).
