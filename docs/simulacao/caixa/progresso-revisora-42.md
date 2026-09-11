# Progresso · rodada 42 (L73: o SHA do aviso relido duas vezes, e o vazamento de ambiente do pre-commit)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 08:34 · reancorada em `ce31cd0d5badd82b4107a7fc776e35baf6b8ede9` (passo 0 do §0 confirmado,
  tree limpa antes). Lendo o aviso agora. Nota importante do Arquiteto, ainda não aplicada ao
  texto congelado do aviso (checkout é em sha fixo, correção chega só por mensagem): o número
  "31 objetos soltos" no aviso está ERRADO segundo ele; o certo é 1 (uma `tree` do próprio
  teste, no intervalo 08:22), e os outros 30 são stash/commits de OUTRAS sessões, sem relação
  com esta rodada. Vou medir com `git fsck` eu mesma, não aceitar nenhum dos dois números de
  cabeça.
- 08:37 · medido com `git fsck` de verdade (o objeto é compartilhado entre as duas worktrees,
  `git rev-parse --git-common-dir` confirma o mesmo `.git`). Achei 32 dangling agora (18
  commit, 9 tree, 4 blob), um a mais que os 31 do aviso (aceitável, outra sessão pode ter
  largado mais um stash no meio do caminho). Peguei a data de criação de cada objeto solto no
  disco (`stat` no arquivo dentro de `objects/xx/...`, já que `tree`/`blob` não têm timestamp
  de commit): SÓ UM tem o instante exato do teste (`1771e0e...`, tree, criado em
  2026-09-11 08:22:39), todo o resto data de dias/sessões diferentes (04/08, 09-10/08, e
  vários horários de hoje que não são 08:22). A correção do Arquiteto procede, medida por
  mim, não aceita por ele ter dito. E achei também que a contagem verbal dele ("dezoito são
  stash... mais um Fechamento de sessão") soma 19, mas os 18 objetos tipo commit têm só 17
  no padrão de stash mais 1 "Fechamento de sessão" = 18, não 19: deslize pequeno, sem
  consequência (o total de 18 bate), registro por hábito do dia.
- 08:38 · lida `scripts/rodada.mjs:110-134` (o guarda novo): a mensagem de recusa cita
  `shaHead`, o HEAD real no momento, e isso acontece ANTES da releitura legítima de HEAD
  (linha 167, "SHA E TOPO RELIDOS AGORA"), então o guarda não desliga a proteção, só
  intercepta o UM caso ruim antes dela. Lida `test-rodada.mjs` inteiro: `ENV_LIMPO` some as
  variáveis `GIT_DIR`/`GIT_WORK_TREE`/`GIT_INDEX_FILE`/`GIT_OBJECT_DIRECTORY`/
  `GIT_ALTERNATE_OBJECT_DIRECTORIES`/`GIT_PREFIX`/`GIT_COMMON_DIR`, e é usado em AMBAS as
  funções auxiliares (`g()` e `rodar()`), sem exceção por chamada. Rodei o teste eu mesma:
  as 12 asserções passam, e o `git fsck` do repositório real não cresceu depois (31 antes e
  depois da minha própria rodada do teste, e também depois do `npm run validate` completo,
  que também dispara `test-rodada.mjs`). Travessão: zero no diff da rodada
  (`a66a3e2 d6bd74e`). `npm run validate`: `EXIT=0`.
- 08:40 · `42-revisora.md` escrito. Travessão conferido nos dois arquivos novos ANTES de
  commitar (hábito de hoje, não corrida atrás do erro de ontem): zero nos dois. Indo
  commitar.
