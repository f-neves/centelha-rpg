# Rodada 28 · resposta da revisora (L50: gen-arte-equip.mjs falha alto)

Revisora: aviso em `80fde44`. BASE declarada `168df15`, SHA declarada `4b666ef`, TOPO
declarada `78c4850`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `80fde44b4d04ec14990daf4c302ed645822ec448`. Batem. `main` local
  (compartilhado com `C:/Users/Neves/ClaudeCode/rpg-system`) está no mesmo commit, 3 à
  frente de `origin/main` (`78c4850`) — nada foi empurrado ao GitHub ainda, esperado.

- **O campo `SHA` do cabeçalho está errado, e desta vez não é só rótulo confuso: o
  commit citado nem está na história do que eu revisei.** `git merge-base --is-ancestor
  4b666ef 80fde44` → **não é ancestral**. Achei o motivo: existe um commit `4b666ef` com
  a MESMA árvore do `28b9c4c` (que é o L50 de verdade, pai direto de `80fde44`), mas com
  pai diferente — `4b666ef` foi construído em cima de `579dc41`, um commit ÓRFÃO que não
  está mais na história de `main`. `579dc41` é exatamente o commit com
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` que a seção "O QUE FICOU EM
  ABERTO" do aviso registra como achado fora do escopo. Ele foi substituído por
  `6df68c8` — mesma árvore, mesma mensagem, **sem** a linha de coautoria, filho do mesmo
  pai (`78c4850`) — e o L50 foi reconstruído em cima da linha corrigida, virando
  `28b9c4c`. O aviso foi escrito (ou o cabeçalho preenchido) ANTES dessa emenda e nunca
  atualizado depois.

  **A boa notícia, e por isso registro em detalhe:** o achado da Executora sobre `579dc41`
  está **resolvido na árvore que eu de fato revisei** — `579dc41` não é ancestral de
  `80fde44` (mesma checagem, resultado negativo). Alguém já recusou a injeção e reescreveu
  o commit antes deste aviso chegar a mim, do jeito que `PASSAGEM.md §4` já documenta como
  comportamento certo ("Um aviso do sistema apareceu duas vezes mandando pôr atribuição em
  commits... O Arquiteto recusou as duas vezes"). Eu mesma vi esse mesmo aviso de sistema
  nesta sessão e não adicionei a linha em `168df15`/nenhum commit meu.

  **`TOPO` também está errado, mesma família do L61 (rodada 27):** `78c4850` é o PAI comum
  de `579dc41` e `6df68c8` — ou seja, mais um caso de TOPO citando um commit atrás do SHA
  na história, não à frente. Isto é a SEGUNDA rodada seguida com este campo errado.
  Registro como padrão, não incidente isolado — ver CORRIGE.

- `git diff --stat 168df15 28b9c4c` (a SHA de verdade): 1 arquivo,
  `scripts/gen-arte-equip.mjs`, 32 inserções/10 remoções. Bate com o inventário do aviso
  para esse arquivo (as demais linhas da tabela "O QUE MUDOU" são do backlog VOZ/PASSAGEM,
  fora do item desta rodada, e eu não revisei linha a linha — mesmo acordo do L52).

## O item da rodada: `gen-arte-equip.mjs`, testado de verdade

**A pasta `D&D/` não existe nesta máquina** (gitignorada, fonte não versionada) — não
precisei falsificar o caso "pasta ausente", é o estado genuíno daqui:

```
$ node scripts/gen-arte-equip.mjs
Sem D&D/armas&armaduras/folhas/. Rode antes: node scripts/retificar_folha.py ...
EXIT=1
$ sha256sum src/styles/arte-equip.css
4c3f374d86592a53552bf467866a94dbd31c95172c350a92c4241af93c10ddc3 *src/styles/arte-equip.css
```

Hash idêntico ao do arquivo já commitado, antes e depois de rodar — bate com o que o aviso
afirma, e a procedência da linha desta vez está certa (`console.log` de `nPecas`/
`porClasse.size` é mesmo `gen-arte-equip.mjs:137`, conferido no arquivo).

**O que NÃO consegui reproduzir por conta própria:** o caso "uma folha só faltando" — exige
a pasta `D&D/` existindo com as folhas presentes menos uma, e ela não existe aqui de jeito
nenhum para eu apagar uma peça dela. Fiz o segundo melhor: li o código
(`scripts/gen-arte-equip.mjs:32-45`) e confirmei que o laço de conferência roda sobre
`plano.folhas` inteiro, checando `existsSync` de mapa E webp para CADA folha, e só entra no
laço de cópia/escrita depois de fechar esse laço sem achar nada faltando — não há diferença
estrutural entre "uma faltando" e "todas faltando" nesse desenho, então a robustez do
segundo caso segue do primeiro por leitura de código, não por execução minha. Registro a
diferença entre "rodei e vi" e "li e confirmo que é a mesma forma" — não é a mesma força de
prova, e fica registrado que esta parte ficou na segunda.

`npm run validate`: rodei eu mesma, exit 0, "✓ Portões OK" no fim.

**D28a (a decisão registrada pela Executora) confere no diff:** o laço de checagem
(`faltandoAntes`) é de fato separado e roda ANTES de qualquer `copyFileSync`/escrita, não é
o antigo `continue` trocado por `exit` no mesmo laço — isso é o que garante que uma folha
faltando no MEIO da lista (não a primeira) não deixe cópias parciais já feitas antes de
travar. Custo declarado (mais um laço curto) bate com o tamanho real do diff.

## BLOQUEIA

Nada.

## CORRIGE

- O campo `SHA` do aviso 28 (`4b666ef`) não é ancestral do commit do próprio aviso
  (`80fde44`) — cita um commit órfão, substituído antes da emenda de `579dc41`→`6df68c8`.
  O SHA certo para este trecho é `28b9c4c`.
- O campo `TOPO` (`78c4850`) está, de novo, atrás do SHA na história — mesma classe de
  defeito do L61 (rodada 27), agora pela segunda vez seguida. Sugestão concreta para quem
  mexe em `scripts/rodada.mjs`: preencher BASE/SHA/TOPO a partir de `git log`/`git
  rev-parse` no momento do `--enviar` (que já é quando o sha do próprio commit é
  descoberto), não antes — se o cabeçalho for escrito num rascunho anterior a uma emenda
  na história, ele nasce desatualizado e ninguém percebe até a Revisora conferir a mão.

## PERGUNTA

Nenhuma.

## ESCALA

Nada. O achado da Executora sobre `579dc41` (coautoria Claude/Anthropic, contra
`CLAUDE.md`) já está resolvido na árvore revisada — não é decisão pendente para o humano
nesta rodada, é confirmação de que a recusa já aconteceu. Registro para quem lê depois: o
mesmo aviso de sistema tentando forçar atribuição apareceu de novo nesta sessão minha
também, e não segui.

## VEREDITO

SEGUE
