# Progresso da Revisora · rodada 58

Hora lida da máquina a cada linha, nunca estimada. Etapa sem hora é honesta; hora inventada não.

- 15:54:19 · reancorei. `git rev-parse HEAD` = `48b8bdffde039ccfa2aee650cf8680b2c103d5d7`.
  Toplevel `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`, árvore limpa antes e depois
  do `checkout --detach` (`git status --porcelain` = 0 linhas nas duas medições).
- 15:57:16 · identidade da árvore conferida ANTES de ler qualquer citação. O documento dela
  declara `BASE=SHA=TOPO=f28387f`, e eu estou em `48b8bdf`. `git diff --name-only
  f28387f..48b8bdf -- src scripts supabase` = **0 arquivos**; a faixa inteira são quatro
  documentos. Então todo `arquivo:NNN` dela é válido no meu pino, e não é o caso da "base que
  não é o HEAD".
- 15:57:16 · faixa da rodada conferida: `594f9ac..59d332f` = 2 arquivos novos, 377 inserções,
  `--name-only -- src/` = 0. A frase "nenhuma linha de `src/` mudou" procede.
- 15:57:34 · rodei o script de medição DELA, por conta própria, e os seis números batem exato:
  140 Efeitos, os 4 da família, 6 gatilhos, 27/4/13/83/4/9 (soma 140), 23 de alvo com condição,
  18/2/2/1. Conferi o que a soma pressupõe e ela não disse: os 140 TÊM bloco `grid`, zero sem,
  zero com gatilho nulo.
- 15:58:14 · varredura do QUINTO, por prosa e não por campo. O gatilho não mora no JSON: só a
  lista à mão de `gen-grid-artes.mjs:162` produz `armadilha` (li `gatilhoDe`, é o único caminho),
  então contar o campo mede a lista. Varri o texto dos 140 por 20 padrões de linguagem de
  armadilha; cinco candidatos fora dos quatro, lidos um a um, todos rejeitados com motivo.
  **Não há quinto.**
- 16:01:49 · citações conferidas uma a uma pelo número de linha: as 13 que ela dá batem exato.
- 16:02:36 · **a afirmação central, OBSERVADA e não lida.** Sonda própria (fora da árvore,
  no scratchpad) dirigindo `gravarEfeito`/`verificarEfeitos` reais com a `salvaguarda` do
  catálogo, sem editar dado nenhum: o alvo fica `protegido`, `somarCondicoes` devolve
  `soak = 3`, a marca dura até o `ate_tick` da Duração comprada, e com uma Arte chegando depois
  **a Arte faz efeito e a Salvaguarda continua intacta**. Dois controles: sem `condicao` nada
  cai; com o gatilho trocado para `passivo` o resultado é idêntico (o caminho não olha o
  gatilho). 11 observações, EXIT=0.
- 16:05 · o reúso do `dissipar` medido em vez de aceito. `plano.custo.total` (o "meu" da
  comparação) aparece **uma vez só** em `artes-grid-mesa.ts` e em `artes-grid.ts` somados, na
  linha 1051, dentro do próprio `dissipar`. Não há coluna que o guarde: li as colunas gravadas
  em `gravarEfeito` e o cabeçalho da migração 19, que diz que `nivel` é o nível do EFEITO
  (1, fixo, para a Salvaguarda), e é por ele que o Dissipar decide o que apaga.
- 16:06 · história do P6 medida: `'salvaguarda'` entre aspas simples entra no repositório
  INTEIRO num commit só, `2540221`, e as duas listas à mão (a do `armadilha` e a do
  `protegido`) nascem nele, juntas. Escopo: a história do repositório por essa string, não a
  história da divergência.
- 16:06:53 · portões: `npm run validate` EXIT=0. Travessão varrido nos ARQUIVOS (não no diff):
  `58-executora.md`, `progresso-armadilha.md`, `58-aviso.md` e este arquivo, zero em cada um.
- 16:10:03 · `test-procedencia.mjs` EXIT=0, 288 citações por âncora. **E o verde não cobre estes
  dois arquivos:** li a lista de alvos do portão (`:320-326`) e ela é fixa, doze documentos, sem
  `docs/simulacao/caixa/`. Registrado no veredito em vez de citado como se tivesse coberto.
- 16:11 · veredito escrito em `docs/simulacao/caixa/58-revisora.md`. Vai commitar e empurrar
  ANTES de eu avisar que terminei (§7).
