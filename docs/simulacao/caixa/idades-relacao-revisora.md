# Revisão: idades de raça (revisão de lore) e Régua de Relação para as oito raças

Reancoragem: `06eb0e2` (autorizado pelo Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `7e51675` (meu veredito anterior). Trabalho: `8e32fc6..06eb0e2` (dois commits).

## `8e32fc6` · Envelhecimento

- Humano ganha idade pela primeira vez (16/30/~80), Anão e Elfo ganham o marco duplo
  (adulta/maturidade). Conferido na tabela "Envelhecimento": Humano 16/30/45/60, Anão 20/100/160/220
  (Maturidade 100 realmente não mudou, só o Adulto 18→20), Elfo 25/150/300/450, Halfling 18/45/70/100
  (voltou ao Adulto antigo, resto intacto), Meio-Orc 14/30/53/70 (ganhou linha própria nas duas
  últimas colunas, Adulto/Maturidade seguem iguais ao Orc). Os números de Velho/Venerável das raças
  que mudaram são extrapolação declarada, não fórmula fechada — e o capítulo já tem o callout
  "Provisório" no topo dizendo que idades e custos das oito serão refeitos de uma vez, então isso
  não é problema desta rodada.
- `racas.json`: `descricao` do Gnomo (400+→300+) e do Halfling (300+→"cerca de 200") atualizada.
  Busquei "mais de 400"/"400+" em `src/` inteiro: zero ocorrência restante. `longevidade` de ambos
  continua `"longa"` nos dois arquivos, como o aviso disse.
- `jogador-novo-decisoes.md`: a nota na seção M-46 registra a reabertura como revisão de lore, não
  erro do conserto de 17/09 — consistente com o que aconteceu (o número mudou de novo por decisão
  nova do humano, não porque o conserto anterior estivesse errado).

## `06eb0e2` · Régua de Relação, oito raças

Montei a matriz completa das oito raças a partir dos oito parágrafos e conferi par a par:

- As assimetrias declaradas batem nos dois lados onde deveriam ser diferentes: Anão→Elfo −4
  (Hostilidade) e Elfo→Anão −3 (Rancor, dito no mesmo parágrafo); Halfling→Anão −1 sem volta (o
  parágrafo do Anão confirma que ele trata o Halfling como Neutro); Humano→Elfo/Meio-Elfo +1 e
  Humano→Orc −1, explicitamente "nenhuma recíproca" (nem o parágrafo do Elfo nem o do Orc devolvem
  o mesmo valor a Humano).
- As reciprocidades declaradas batem nos dois lados: Orc↔Elfo −2 (Desafeto) nos dois parágrafos;
  Gnomo↔Halfling +1 (Simpatia) nos dois parágrafos; Anão↔Orc +1 nos dois parágrafos.
- A regra geral do Meio-Orc (parte do Neutro com todos, é recebido em −1 por todos, exceto Orcs e
  outros Meio-Orcs) não é contradita por nenhum parágrafo dos outros sete: os parágrafos de Anão,
  Gnomo e Halfling que listam "Neutro com o resto" excluem explicitamente o Meio-Orc dessa lista
  (o próprio ponto que o commit diz ter corrigido depois de reler), e o do Orc não reivindica −1
  contra o Meio-Orc (a exceção que a regra geral já previa).
- Todos os cinco rótulos usados (+1 Simpatia, −1 Antipatia, −2 Desafeto, −3 Rancor, −4 Hostilidade)
  batem exatamente com a escada já publicada no topo do mesmo capítulo (`relacoes-sociais.md:27-32`),
  nenhum nome nem valor inventado.
- `racas.md`, frase do Meio-Orc: trocou a descrição antiga ("Neutro baixo, borda inferior da banda")
  pelo número limpo "−1 (Antipatia)", batendo com a régua nova de `relacoes-sociais.md`.
- Confirmado que nenhum código lê essas palavras: busquei "Simpatia|Antipatia|Desafeto|Rancor|
  Hostilidade" em `src/lib`, zero ocorrência. É conteúdo para o Mestre aplicar à régua já publicada,
  do mesmo jeito que a M-09 (longevidade da Firula de cortejo) não tem automação.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**PROCEDE.** As idades revisadas são consistentes internamente (tabela, prosa e `racas.json`
batendo nos três lugares) e corretamente marcadas como provisórias, sem contradizer nenhuma
decisão anterior (a mudança do Halfling é reabertura de lore, não reversão de erro). A matriz de
oito raças da Régua de Relação é internamente consistente par a par, sem contradição entre
assimetrias declaradas e reciprocidades declaradas, e usa só rótulos já existentes na escada
publicada.
