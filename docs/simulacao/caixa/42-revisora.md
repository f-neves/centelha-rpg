# Rodada 42 · resposta da revisora (L73: o SHA do aviso relido duas vezes seguidas)

Revisora: aviso em `ce31cd0`. BASE `a66a3e2`, SHA/TOPO `d6bd74e`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `ce31cd0d5badd82b4107a7fc776e35baf6b8ede9`. Batem.

## A correção do Arquiteto ao próprio aviso: medida, não aceita de palavra

O aviso (congelado, não reescrito) publica "31 objetos soltos" criados pelo teste. O Arquiteto
corrigiu por mensagem: o número certo é 1, os outros 30 são debris de outras sessões. Não aceitei
nenhum dos dois números de cabeça. `git fsck` (o objeto é compartilhado entre as duas worktrees,
confirmado por `git rev-parse --git-common-dir`) achou 32 dangling agora (18 commit, 9 tree, 4
blob), um a mais que os 31 do aviso, dentro do esperado para um repositório com múltiplas sessões
ativas. Peguei a data de criação de cada objeto direto do disco (`stat` no arquivo solto dentro
de `objects/xx/...`, já que `tree`/`blob` não carregam timestamp de commit): **exatamente UM**
objeto tem o instante do teste, uma `tree` criada em 2026-09-11 08:22:39. Todo o resto data de
dias e sessões diferentes, de 04/08 a hoje em horários que não são 08:22, incluindo os 18
commits soltos (17 no padrão de `git stash`, 1 "Fechamento de sessão da revisora" de 07/09,
nenhum ligado a este teste). A correção do Arquiteto procede, medida de novo do zero, e não é
suposição: é o objeto único que sobra depois de descontar tudo que já estava lá antes de hoje às
08:22. Achei também um deslize pequeno na conta verbal dele ("dezoito são stash, mais um
Fechamento de sessão" soma dezenove; o total real de commits soltos é dezoito, dezessete no
padrão de stash), sem consequência prática, registrado só pelo hábito do dia.

## A proteção continua viva, e a recusa cita o sha certo

`scripts/rodada.mjs:110-134`: o guarda novo mede a mensagem do commit em `HEAD` (regex fixa
`^rodada \d+ · aviso à revisora$`) e morre com o sha real de `HEAD` na mensagem de recusa, ANTES
da releitura legítima de `HEAD` mais abaixo (linha 167, comentada "SHA E TOPO RELIDOS AGORA, NÃO
OS QUE O `abrir` ESCREVEU"). Por estar antes e sair por `morrer()`, o guarda não desliga a
releitura para o caso normal (trabalho de verdade commitado entre abrir e enviar): só intercepta
o caso específico em que `HEAD` já é o próprio aviso anterior. A proteção que resolveu o defeito
da rodada 28 continua exercitada para todo outro caso.

## O teste, rodado por mim, e o ambiente conferido linha a linha

Rodei `node scripts/test-rodada.mjs` eu mesma: as 12 asserções passam (bate com o número
publicado). Conferi `ENV_LIMPO` (`test-rodada.mjs:52-56`): remove
`GIT_DIR`/`GIT_WORK_TREE`/`GIT_INDEX_FILE`/`GIT_OBJECT_DIRECTORY`/
`GIT_ALTERNATE_OBJECT_DIRECTORIES`/`GIT_PREFIX`/`GIT_COMMON_DIR`, e as duas funções auxiliares
(`g()`, que chama `git` direto, e `rodar()`, que chama o `node scripts/rodada.mjs` inteiro, cujos
`git` internos herdam o ambiente do processo pai) usam esse ambiente em TODA chamada, sem
excecão por "essa aqui parece perigosa". Rodei `git fsck` antes e depois da minha própria
execução do teste, e de novo depois do `npm run validate` completo (que também dispara
`test-rodada.mjs`): a contagem de dangling ficou estável (31 nas três medições), confirmando que
o vazamento de ambiente do `pre-commit` está mesmo fechado, não só nas chamadas que a Executora
suspeitou.

## Portões

`npm run validate`: `EXIT=0`. `node scripts/test-rodada.mjs`, rodado por mim: `EXIT=0`, 12
asserções.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada
(`a66a3e2 d6bd74e`), e zero nos meus dois arquivos novos (conferido antes de commitar).

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código. Registro para o Arquiteto, não para consertar agora: a conta verbal "dezoito
stash mais um Fechamento de sessão" soma dezenove, mas o total real de commits soltos é dezoito.

## O QUE FICOU EM ABERTO

`git gc` para os 31/32 objetos soltos: confirmo que a decisão de NÃO rodar agora é defensável (a
maioria é stash de outras sessões, ainda potencialmente útil para quem largou; o próprio
Arquiteto já resgatou um commit meu pelo reflog nesta mesma frente). Fica com ele, como o aviso
já registra.

## VEREDITO

O L73 está corrigido como o aviso descreve. A proteção de releitura de `HEAD` continua viva para
o caso normal, e a recusa da segunda chamada cita o sha real, não um texto genérico. O vazamento
de ambiente do gancho de `pre-commit` (`GIT_DIR` e companhia vencendo o `cwd`) está fechado em
toda chamada do teste, não só nas que pareciam arriscadas, confirmado rodando o teste eu mesma e
medindo `git fsck` antes e depois. A correção do Arquiteto ao próprio aviso (31 objetos virou 1)
procede, remedida do zero por mim contra a data de criação de cada objeto no disco, não aceita
porque ele afirmou com confiança. Nada bloqueia, nada corrige no código.
