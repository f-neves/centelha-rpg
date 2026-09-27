# Levantamento de resultados e registros existentes, para a rodada de medição de pesos

Só leitura, 27/09/2026. Complementa `docs/export/proezas/09-inventario-calculos.md` (que lista
SCRIPTS de simulação); aqui o alvo são RESULTADOS já gravados e REGISTROS de intenção/custo. Nada
foi rodado de novo (nenhuma bateria). Datas por `git log -1 --date=short` quando o arquivo está no
git; por data de modificação no disco quando é `docs/export/` (não versionado, `?? docs/export/`
no `git status`).

## 1. Resultados de simulação já rodados

### 1.1. Pasta `.sim/`

Existe só na worktree `rpg-system` (`.sim/`), com conteúdo de 03/09 a 07/09/2026: `grande.txt`,
`v2.txt`, `san.txt`, `grid.txt`, `smoke.txt`, `relatorio.txt`, `conferencia-agregado.txt`, e
subpastas `2026-09-03*`, `r03` a `r09`, `ctlB`, `riso`, `test-fix*`. Não achei `.sim/` em
`../centelha-executora/` nem em `../centelha-techlead-revisora/` (comando `ls` sem saída nas
duas). **Classificação: DESATUALIZADO para a pergunta desta rodada.** Todo o conteúdo é do
projeto "automação do Grid" (quanto do trabalho do Mestre a automação tira), não de equilíbrio de
combate ou peso de Proeza; nenhum arquivo tem chance de acerto, dano líquido, Ticks até derrubar
ou vitória entre Centelhas vizinhas (itens a a e do pedido). `docs/simulacao/09-bateria-grande.md`
é o relatório que consome esses arquivos e confirma o escopo: "21.600 batalhas... Quanto do
trabalho do mestre no Grid a automação pode tirar" (`docs/simulacao/09-bateria-grande.md:33`).

### 1.2. `docs/simulacao/resultados/`

Sete arquivos `.txt`, saídas versionadas de `agregar.mjs --gravar` (ex.
`09-bmtlxp622.txt`, `10-bmtqb2vxm.txt`). Mesmo escopo do item 1.1 (automação de Mestre, não peso
de Proeza). **DESATUALIZADO para esta pergunta**, pela mesma razão.

### 1.3. Resultados já embutidos no 09 (não repetidos aqui em detalhe)

O `09-inventario-calculos.md` já registra, rodando ao vivo nesta sessão de 26/09, os únicos
números do repositório hoje que respondem a alguns dos itens a-e: `sim-caps.mjs` (ΔDefesa
C1×C2 = +5, C2×C3 = +1; win% por variante) e `sim-defesas.mjs` (E[dano]/golpe por tier, ex. T3
ofensivo: QA 72%, E[dano] atual=1,79 vs +Centelha=5,39). **Não repito a tabela aqui**; ressalto
que esses números são de linha de comando desta sessão, não gravados em arquivo: rodar de novo é
reproduzir, não reaproveitar leitura de disco.

### 1.4. `docs/export/proezas/chatgpt/calculos.md` (INFERÊNCIA, 26/09/2026, mtime)

Enumeração EXATA (não simulação, não amostragem) do valor de +1 em vários eixos, para um
personagem "iniciante" e um "veterano" hipotéticos definidos em `01-regua.md`. Números literais:

- `P(sucesso)`: iniciante 0,259259; veterano 0,239198.
- `ganho P de +1`: iniciante 0,115741; veterano 0,096451.
- `+1 dano eqPV`: iniciante 0,378378; veterano 0,610837.
- `+1 absorção eqPV`: iniciante 0,378378; veterano 0,610837 (idêntico ao dano, mesma fórmula).
- `+1 defesa eqPV`: iniciante 0,804054; veterano 0,786207.
- `ação extra eqPV`: iniciante 2,104730; veterano 2,241379.
- `+3/+6/+9 fixos eqPV`: iniciante 3,385135 / 7,118243 / 10,141892; veterano 3,600000 /
  8,379310 / 13,262069.
- Tabela D7 (Centelha atacante/defensor, +1 por ponto vs +2 por ponto): `1/4` cai de 0,046296
  para 0,000000; `4/1` sobe de 0,625000 para 0,907407, comparando as duas leituras em aberto da
  pendência D7.
- Tabela D8/G15 (Longa, Acúmulo 30, D=10/12/13): "sem bônus" leva 60 ações para D=10 e nunca
  avança em D=12; com G15-A e D8 +2, 12 ações em D=10 e 60 em D=12.

**Classificação: INDETERMINADO quanto a valer como resultado oficial.** O próprio arquivo se
rotula "INFERÊNCIA: enumeração exata, sem simulação; hipóteses descritas em 01-regua.md" (linha
3), ou seja, é cálculo fechado sobre um cenário hipotético definido por fora (não pela mesa real
nem pelo motor `sim/motor.mjs`), produzido por uma ferramenta externa (pasta `chatgpt/`, fora do
git). Responde diretamente ao item (e) do pedido (efeito de +1 em vários eixos), mas com o motor
de probabilidade e o personagem de referência de outra ferramenta, não os do repositório.

### 1.5. `docs/export/proezas/chatgpt/distribuicao.md` e `inventario.md` (mesma origem, 26/09)

`inventario.md` (469 linhas) atribui a cada Técnica um "P" (poder linearizado: Num + ponte(Q),
líquido descontando custo de Energia/FV/ação), por exemplo `abraco-do-tita`: bruto 30,000,
líquido 21,500, sensibilidade "4,000 a 45,000" (`inventario.md:14`). `distribuicao.md` agrega isso
por nível N (1 a 6): mediana P sobe de 3,000 (N1) a 21,500 (N6), com faixas largas e até valores
negativos na sensibilidade (N5: "-3.185 a 25.250"). Contagens conferidas: 461 Técnicas, 411 com
pré-requisito, tipos ativa/passiva/reflexiva = 347/88/26 (bate com `contagens-dossie.md`, que cita
o mesmo SHA256 da fonte). **Classificação: INDETERMINADO como medida de peso oficial.** O próprio
cabeçalho avisa "Q é classificação editorial do efeito no texto... P não é regra existente" e
"Não representa um poder líquido objetivo já definido pelo livro" (`distribuicao.md:3`). É um
método de pontuação plausível para orientar a próxima bancada, não um resultado do motor de jogo.

## 2. Custos de XP: origem e justificativa

- **`src/content/chapters/criacao-de-personagem.md:37-39`** (2026-09-26, ATUAL): a fórmula vigente
  é "base + (multiplicador × nível)" para o custo de cada ponto, substituindo "nível × custo". O
  próprio texto marca os orçamentos como pendência: "**Pendente.** Os orçamentos de 1500/2000/2600
  foram calibrados na economia antiga, quando as Proezas comiam cerca de 40% do bolo. Com a curva
  nova elas se acumulam ao longo da campanha... e um personagem inicial típico fecha perto de
  **1050 XP**." Ou seja, a régua atual já sabe e já registra que os três orçamentos-exemplo estão
  desalinhados com a fórmula viva.
- **`src/content/chapters/criacao-de-personagem.md:41-43`** (tabela de custo por Atributo:
  "5 + (novo × 5)", exemplos 1→2=15, 2→3=20 etc.): ATUAL, é a régua em produção hoje.
- **`XP_revisao.md`** (raiz, último commit 2026-08-04): **DESATUALIZADO**, é o documento de
  trabalho que LEVOU à fórmula atual, não uma auditoria dela. Contém comparações "Antigo vs Novo
  proposto" (ex. `:255-263`: ficha cheia salta de 3.456 para 1.800 XP no modelo proposto, "orçamento
  mais alto do jogo passa a ser maior que a ficha inteira... é o colapso do espaço de escolha") e
  simulações de "compra gulosa" e de encaixe de Proezas num orçamento de 1500 XP (`:688-695`: com
  multiplicador 10, o padrão C3 custa 135 XP, 9% do bolo, sobra 362; com 30, custa 405, 27%, sobra
  92). Esses números são de UMA proposta entre várias discutidas, não o valor final; útil como
  histórico do raciocínio, não como peso vigente.
- Nenhum documento comparando explicitamente "valor de jogo" (poder medido) contra "preço em XP"
  de Habilidades, Especialidades, Virtudes, Antecedentes ou Artes foi encontrado, além do método de
  pontuação por Técnica do item 1.5 acima (que cobre só Técnicas, não os outros sete tipos de
  item citados no pedido). **Isto é lacuna, não achado**: não há comparação peso-vs-preço para
  Habilidade/Especialidade/Virtude/Antecedente/Efeito/Arte em nenhum arquivo encontrado.
- `scripts/cost-examples.mjs` (citado em `09-inventario-calculos.md:69`, não repetido em detalhe
  aqui): confere as fichas-exemplo do capítulo contra a régua de XP viva, mas testa consistência
  interna (a ficha bate com a fórmula), não se o preço é justo frente ao poder.

## 3. Registros de jogo real

**Não há.** Busquei por: `grep -rniE "diário de sessão|log de sessão|sessão jogada|ata de sessão|
campanha jogada"` em todo `.md` do repositório (zero ocorrências); `find lore -iname "*sessao*" -o
-iname "*campanha*"` (zero arquivos); `grep -rliE "jogamos|a mesa jogou|resumo da sessão"` (zero);
busca por dump ou export de Supabase no repositório (`find . -iname "*dump*.sql" -o -iname
"*export*.json"` cruzado com "supabase", zero). O Grid/mesa grava estado em Supabase (fora do
git, ver `CLAUDE.md`, seção Produção), e nenhuma cópia de histórico de mesa jogada foi encontrada
no repositório. **Não dá para estimar proporção combate/investigação/exploração/social por
nenhuma fonte encontrada aqui.**

## 4. Documentos de intenção numérica ainda não citados no 09

- **`Relatorio.md`** (raiz, último commit 2026-08-17, análise externa de game design já citada em
  memória do projeto): duas seções com número direto de linha de base de combate, não citadas no 09.
  - `:113-126` (Durabilidade): herói de referência (Vigor 4, PV 37) contra um par competente,
    golpes que conectam até cair: "Sem armadura ~4,6 · Couro leve ~6,2 · Malha média ~9,3", golpes
    totais incluindo erros "~8 · ~11 · ~17". Conclusão do documento: "Um duelo dura de 8 a 17
    trocas".
  - `:128-141` (taxa de acerto real): tabela de P(acerto) entre iguais por bônus de arma: "+0:
    44,4% · +1: 55,6% · +2: 66,4% · +3: 76,1%", com a conclusão "o combate real entre iguais
    acerta 50 a 66% das vezes, não 42%" (contestando uma nota de design que o documento cita como
    desatualizada já naquela época).
  - `:80-103` (bônus de Centelha no combate): registra que o bônus "passou de ×2 para +1 por
    ponto", e estima que 2 pontos de Centelha valem "≈12% de vantagem de acerto", recomendando que
    a superioridade de tier resida na Absorção (Soak), não no acerto.
  - **Classificação: INDETERMINADO/parcialmente ATUAL.** O bônus "+1 por ponto" que o documento
    descreve bate com o `centelhaMult: 1` vigente hoje em `regras.json` (confirmado no
    `09-inventario-calculos.md`, âncora 3), então essa premissa não mudou. Mas o documento é de
    17/08/2026, anterior à reescala 0-6/0-12 da Centelha e a mudanças de arma/armadura desde então;
    não confirmei se os números de P(acerto) e golpes-até-cair citados ainda reproduzem contra o
    catálogo de armas/armaduras de hoje (não rodei `sim-duelo.mjs` para checar, por instrução de
    não rodar bateria nesta tarefa). Registro os números como existentes e plausivelmente úteis de
    referência, não como confirmados vigentes.
- **`legacy/raiz/Combate_Prolongado.md`**: já arquivado por decisão anterior (zero citação, ver
  `docs/MAPA.md:49`), auto-descrito como NÃO É REGRA (ver memória do projeto). Contém só a
  observação genérica "Na maior parte dos RPGs o combate dura poucos turnos" (`:17`), sem número
  específico de Centelha novo o bastante para valer aqui. **DESATUALIZADO/abandonado.**
- **`docs/export/proezas/chatgpt/12-discussao-intencao.md`** (27/09/2026, mtime, o mais recente
  de todos os achados): é o documento de intenção mais direto para a pergunta 4 do pedido. Propõe
  ALVOS (não resultados) para a próxima bancada: "mirar 4 a 6 ações relevantes por lado, com
  mediana de 5" (duração de combate, `:19`); "70% de acerto entre iguais... faixa de 65% a 75%"
  (`:31`); "65% para X+1 e 80% para X+2" (vitória entre Centelhas vizinhas, `:45`); "aproximadamente
  60% do aumento de chance de vitória vindo de Proezas e 40% do crescimento comum" (`:57`).
  **Classificação: é PROPOSTA explícita, não regra nem resultado** ("Os números abaixo são
  PROPOSTAS de alvos para a bancada, não regras aprovadas nem resultados do simulador", `:3`).
  Responde à pergunta "o que falta medir" listando exatamente os experimentos a pedir à bancada
  (percentis 10/50/90 de ações até incapacidade, matriz de confrontos por par de Centelha,
  ablação Proeza-vs-comum), o que é diretamente reaproveitável como roteiro da próxima rodada.

## Resumo: o que já está respondido e o que falta medir

**Já respondido, com ressalva de origem:**

- (e) Efeito de +1 em Atributo/dano/Absorção/Defesa/ação extra: respondido por
  `chatgpt/calculos.md`, mas por enumeração exata sobre um cenário hipotético de ferramenta
  externa, não pelo motor `sim/motor.mjs` do repositório. Precisa reprodução no motor real para
  virar resultado oficial.
- (a)/(c) Chance de acerto entre iguais e ações/golpes até derrubar: há um número plausível em
  `Relatorio.md` (44 a 76% conforme a arma; 8 a 17 trocas), mas de 17/08/2026, anterior a mudanças
  de escala; precisa reconfirmação no motor atual antes de virar linha de base.

**Falta medir, sem nenhum resultado existente encontrado:**

- (b) Dano líquido por golpe perto da Absorção do alvo: nenhum resultado gravado achado (só o
  método de `sim-absorcao.mjs`, já listado no 09 como não rodado desde julho).
- (d) Chance de vitória entre Centelhas vizinhas: só a PROPOSTA de alvo (65%/80% em
  `12-discussao-intencao.md`), nenhum resultado medido no motor real; `sim-caps.mjs` mede teto de
  Atributo por tier, não vitória fim-a-fim entre Centelhas vizinhas com Proezas.
- Peso de XP comparado a poder para Habilidade/Especialidade/Virtude/Antecedente/Efeito/Arte
  (só Técnica tem um método de pontuação, e é rotulado como inferência editorial).
- Proporção de combate/investigação/exploração/social nas sessões: não há nenhuma fonte.
- Os orçamentos de criação (1500/2000/2600) precisam recalibração: o próprio capítulo já
  confessa isso.
