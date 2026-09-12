# Progresso · rodada 47 (L79, fechamento: travessão em src/content/**)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por arquivo varrido,
não só por parte), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 20:51 (sha 964f8f9, 0 à frente/atrás de `origin/main`): começando. Duas partes: (1)
  varrer os 253 travessões em `src/content/chapters/` (13 arquivos), frase por frase,
  commit próprio sem prosa nova junto; (2) o portão sobre `src/content/**` inteiro,
  aceitando travessão dentro de crase, com os três controles (vermelho antes, verde
  depois, negativo). Primeiro passo: medir e conferir a exceção de ficção (nenhuma
  linha deveria começar com travessão) antes de tocar em qualquer arquivo.
- 20:52 · MEDIDA FEITA: `grep -o "—" src/content/chapters/*.md | wc -l` dá 253, batendo
  exato com o Arquiteto, em 13 arquivos (aparencia-virtudes-vontade 7, armas-e-armaduras
  30, combate 77, coracao-do-sistema 12, criacao-de-personagem 9, custo-de-servico-e-itens
  25, defesas 1, folego 12, qual-sistema 2, quase-acerto 11, racas 53, relacoes-sociais 2,
  vida-ferimentos-cura 12). EXCEÇÃO DE FICÇÃO CONFERIDA COM A FERRAMENTA CERTA (Grep, não
  o `grep` do Bash, que deu um falso "1" por artefato do wrapper): zero linhas começando
  com travessão em qualquer arquivo.

  MAS a primeira checagem de tabela estava errada, e a correção é do gesto e não só do
  número: procurei "tabela com célula vazia" olhando por cima em vez de rodar um `grep`
  de verdade. Rodando certo (`\|\s*—\s*\|`), achei NOVE ocorrências reais de célula vazia
  em TRÊS arquivos (`armas-e-armaduras.md` 3, `combate.md` 5, `racas.md` 4, uma delas
  ambígua: `combate.md:35`, `| — (é a maior) | Tick 1 | — |`, onde o primeiro travessão
  pode ser célula vazia OU abertura de um parêntese explicativo, investigando antes de
  decidir). Essas NÃO fazem parte dos 253 que a regra do L79 cobre (não são pontuação de
  prosa).
- 20:54 · CLASSIFICAÇÃO COMPLETA das 15 linhas de tabela com travessão (`^\|.*—`, os 13
  arquivos): 13 OCORRÊNCIAS são célula vazia de verdade e ficam como estão
  (`armas-e-armaduras.md:40,41,111` · 1 cada; `combate.md:35` · 2, as duas células da
  linha "é a maior", inclusive a com a nota `(é a maior)` do lado, mesma convenção da
  tabela; `combate.md:128` · 2, `:129` · 1, `:230` · 1; `racas.md:32` · 2, `:37` · 2). AS
  OUTRAS 6 linhas de tabela com travessão são PONTUAÇÃO DE PROSA dentro de célula, iguais
  às de fora (`armas-e-armaduras.md:38`, `combate.md:246,247,265,266`,
  `custo-de-servico-e-itens.md:228`), e entram na troca como qualquer frase. Conta final:
  253 − 13 = **240** travessões de pontuação a trocar. Começando pelos menores.
- 20:55 · `defesas.md` (1) FEITO: dois-pontos, frontmatter `resumo:`. `git diff --numstat`
  1/1. `qual-sistema.md` (2) FEITO: dois-pontos, dentro de rótulo de nó do `mermaid`
  (`SOCIAL — rola vs...` → `SOCIAL: rola vs...`). ACHADO: editar o texto-fonte do
  diagrama muda o hash que `gen-mermaid.mjs --check` confere, e o `--check` ficou
  vermelho até eu rodar `node scripts/gen-mermaid.mjs` para regravar
  `src/data/diagramas.json` (383 KB, 6 desenhos). Verifiquei que só `qual-sistema.md`
  tem `` ```mermaid `` entre os 13, então é o único que precisa deste passo extra.
  `git diff --numstat` de `qual-sistema.md`: 2/2. Achado à parte, não meu: `CATALOGO.md`
  está com uma edição do Arquiteto na árvore (32 inserções); não toquei.
- 20:57 · `relacoes-sociais.md` (2) FEITO: dois-pontos nas duas (explicação/enumeração).
  `aparencia-virtudes-vontade.md` (7) FEITO: cinco dois-pontos, um par de travessões
  virou parênteses (a única forma pareada até agora). `git diff --numstat`: 2/2 e 6/6.
  Zero travessão restante nos dois. Indo para `criacao-de-personagem.md` (9).
- 21:02 · `criacao-de-personagem.md` (9) FEITO: seis dois-pontos, duas vírgulas (aposto
  curto), zero par. `git diff --numstat`: 8/8 (a linha 138 tinha duas trocas na mesma
  linha). Zero travessão restante. Indo para `coracao-do-sistema.md` (12).
- 21:03 · `coracao-do-sistema.md` (12) FEITO: nove dois-pontos, um par de travessões
  virou parênteses (aposto nomeando o *pool*), outro par virou parênteses (exemplos
  de "tarefas longas"). `git diff --numstat`: 9/9 (três linhas tinham duas trocas cada).
  Zero travessão restante. Indo para `folego.md` (12).
- 21:05 · `folego.md` (12) FEITO: nove dois-pontos, uma vírgula (aposto de limiar,
  "Fôlego 0, exausto"), duas vírgulas dentro de parênteses (exemplos numéricos, ao
  lado de dois-pontos já existentes na frase, para não empilhar dois-pontos). `git
  diff --numstat`: 10/10 (uma linha tinha três trocas). Zero travessão restante.
  Indo para `vida-ferimentos-cura.md` (12).
- 21:06 · `vida-ferimentos-cura.md` (12) FEITO: sete dois-pontos, quatro vírgulas
  (contraste/exceção/aposto, cuidado para não empilhar dois-pontos onde a frase já
  tinha um antes da tabela), um par de travessões virou parênteses (exemplos de
  cura). `git diff --numstat`: 11/11 (uma linha tinha duas trocas). Zero travessão
  restante. Indo para `quase-acerto.md` (11).
- 21:07 · `quase-acerto.md` (11) FEITO: nove dois-pontos, duas vírgulas (continuação/
  explicação de exemplo numérico). `git diff --numstat`: 10/10 (uma linha tinha duas
  trocas). Zero travessão restante. Indo para `custo-de-servico-e-itens.md` (25, com
  1 caso de prosa em célula de tabela já mapeado na linha 228).
- 21:08 · `custo-de-servico-e-itens.md` (25) FEITO: dezesseis dois-pontos, duas vírgulas,
  o caso de tabela na linha 228 (`Cerveja — barril` virou `Cerveja (barril)`, parênteses
  por ser rótulo de variante e não frase), e sete linhas de "kits" com dois travessões
  cada viraram parênteses (preço) + dois-pontos (lista de itens). `git diff --numstat`:
  18/18. Zero travessão restante. Indo para `armas-e-armaduras.md` (30, com 1 caso de
  prosa em célula na linha 38 e 3 marcadores de célula vazia nas linhas 40/41/111 a pular).
- 21:10 · `armas-e-armaduras.md` (30, das quais 3 são célula vazia e ficam intocadas)
  FEITO: 27 trocas (dezoito dois-pontos, seis vírgulas, um par virou parênteses, mais
  o caso de tabela na linha 38 por vírgula de contraste). `git diff --numstat`: 23/23.
  Confirmado com `grep -n` que só linhas 40, 41 e 111 (as três célula vazia mapeadas)
  ainda têm travessão. Indo para `racas.md` (53, com 4 marcadores de célula vazia nas
  linhas 32/37 a pular, sem caso de prosa em tabela conhecido).
- 21:13 · `racas.md` (53, das quais 4 são célula vazia e ficam intocadas) FEITO: 49
  trocas (a maioria dois-pontos anunciando o efeito de um traço racial, algumas
  vírgulas onde já havia dois-pontos na mesma frase, para não empilhar). `git diff
  --numstat`: 48/48. Confirmado com `grep -n` que só as 4 células vazias (linhas 32 e
  37, duas cada) ainda têm travessão. Indo para `combate.md` (77, o maior, com 6
  marcadores de célula vazia nas linhas 35/128/129/230 e 4 casos de prosa em tabela
  nas linhas 246/247/265/266 já mapeados).
- 21:18 · `combate.md` (77, das quais 6 são célula vazia e ficam intocadas) FEITO: 71
  trocas (a maioria dois-pontos, várias vírgulas de contraste/continuação, seis pares
  de travessão viraram parênteses, os 4 casos de prosa em tabela por vírgula ou
  parênteses). `git diff --numstat`: 55/55. Confirmado com `grep -n` que só as linhas
  35, 128, 129 e 230 (as seis células vazias mapeadas) ainda têm travessão.

  VARREDURA DOS 13 ARQUIVOS COMPLETA. Total confirmado: 253 travessões medidos, 13
  eram célula vazia (intocados), 240 eram pontuação de prosa e foram trocados um a
  um, lendo a frase, sem substituição em bloco. Próximo passo: rodar `npm run
  validate` (inclui `gen-mermaid.mjs --check`) e depois preparar o commit único da
  varredura, sem misturar nada, com pathspec nos 13 capítulos + `diagramas.json`
  regravado + este arquivo de progresso, excluindo `CATALOGO.md` (edição do
  Arquiteto na árvore, não é minha).
- 21:20 · `npm run validate` ficou verde (inclui `gen-mermaid.mjs --check`, que já
  passa porque regravei `diagramas.json` durante a varredura). Como `CATALOGO.md` do
  Arquiteto seguia sujo na árvore e bloqueava `git pull --rebase`, usei `git stash
  push -u -m rodada47-preserva-catalogo-arquiteto -- docs/simulacao/CATALOGO.md`
  (método validado pelo Arquiteto na rodada 46) para tirá-lo do caminho sem tocá-lo.
  COMMIT DA PARTE 1 FEITO: `8bcc1d1`, pathspec nos 13 capítulos + `diagramas.json` +
  este arquivo, nada mais misturado. `git pull --rebase` limpo, push confirmado
  (`git rev-list --count origin/main..HEAD` = 0 depois do push), e o stash foi
  devolvido (`git stash pop`): `CATALOGO.md` está de volta exatamente como estava,
  intocado. Indo para a parte 2: o portão sobre `src/content/**`.
- 21:25 · PORTÃO ESCRITO: `scripts/test-travessao-capitulos.mjs`. Escopo é
  `mdSob(src/content)`, recursivo por diretório (não lista de arquivo). Duas
  isenções: travessão dentro de crase inline (`` `—` ``) e o glifo de célula vazia
  em tabela (`\|\s*—\s*(?:\([^|]*\))?\s*(?=\|)`). Antes de aceitar a isenção da
  célula vazia, testei SEM ela (cópia temporária do script) contra o estado atual:
  achou exatamente as 9 linhas de tabela já mapeadas na varredura (13 ocorrências,
  armas-e-armaduras:40/41/111, combate:35/128/129/230, racas:32/37), nada mais,
  confirmando que a isenção é um padrão estrutural preciso e não uma cobertura para
  contagem errada dos 253.

  QUATRO CONTROLES, todos rodados manualmente e revertidos depois:
  1. VERMELHO ANTES: `git checkout c02dd9e -- src/content/chapters` (o commit pai da
     varredura) + rodar o portão → 203 violações. `git checkout HEAD --
     src/content/chapters` restaurou o estado pós-varredura sem sobra (`git status`
     limpo).
  2. VERDE DEPOIS: portão no estado atual (pós-varredura) → 0 violações.
  3. NEGATIVO: troquei um dois-pontos de volta por travessão em
     `coracao-do-sistema.md:10` de propósito → o portão acusou exatamente essa
     linha, 1 violação, saída 1. Revertido (`git diff --numstat` deu vazio: byte a
     byte igual ao commitado).
  4. POSITIVO DA ISENÇÃO DE CRASE (não pedido explicitamente, mas nenhum capítulo
     atual usa a crase para nomear o caractere, então a isenção nunca tinha sido
     exercitada de verdade): inseri `` `—` `` citado entre crases na mesma linha →
     portão continuou verde. Revertido do mesmo jeito, `numstat` vazio de novo.

  Registrado em `npm run validate` (entre `test-procedencia` e `test-rodada` no
  `package.json`), e o próprio `test-portoes.mjs` confirma que o novo teste está no
  portão (não sobrou órfão). `npm run validate` completo: verde, saída 0.
- 21:27 · COMMIT DA PARTE 2 FEITO: `8fb54f4`, pathspec em `package.json` +
  `scripts/test-travessao-capitulos.mjs` + este arquivo, nada mais misturado.
  `CATALOGO.md` do Arquiteto seguia sujo de novo (ele deve ter mexido entre as duas
  partes); repeti o `git stash push -u -m ... -- docs/simulacao/CATALOGO.md`, rebase
  limpo, push confirmado (`8bcc1d1..8fb54f4`), `git rev-list --count
  origin/main..HEAD` = 0, e `git stash pop` devolveu `CATALOGO.md` intocado. As duas
  partes do L79 estão em `main`. Preparando o aviso.
