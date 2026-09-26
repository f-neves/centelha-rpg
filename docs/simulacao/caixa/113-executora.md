# Rodada 113 · Executora · ganhar a vida pela curva B2, e o Acoes_Sistema.md alinhado

- **Despacho:** `docs/simulacao/caixa/113-despacho.md` (`8d0b281`).
- **Árvore:** branch `executora`, posta em `8d0b281` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-113.md`, com as horas lidas da máquina.
- **Publicado:** `effc917` (todo o trabalho). Este relato vai num segundo commit.
- **Não li nem toquei `lore/economia/estado-revisao.md`.** Os números saíram de
  `src/data/renda.json` e do despacho.
- **Nenhuma pendência fechou.**

**Arquivos alterados:** `src/content/chapters/acoes-oficio-e-mundo.md`,
`scripts/gen-cap-economia.mjs`, `Acoes_Sistema.md`, e `113-executora.md` e `progresso-113.md`.

## 1 · "Ganhar a vida com o ofício" (`acoes-oficio-e-mundo.md:207-254`)

A fórmula velha (`(média − 4) × 10 pc`, 65/120/170, tetos 50/150/500) **saiu inteira**. No build
novo, o `dist/` não tem mais "(média − 4) × 10".

- **a) A regra:** fórmula nova em `:211`, "Ganho por semana = o **melhor** (média − Dificuldade) ×
  valor da faixa, entre as faixas cujo Requisito a Habilidade alcança".
  **Os três valores foram lidos direto, sem conta.** O `renda.json` já guarda `valor_por_ponto`
  por Dificuldade: `dif4` 20, `dif7` 37,14 e `dif11` 66,86. O capítulo os mostra arredondados
  (20, 37, 67 pc).
- **b) O bônus e a Firula:** escritos em um parágrafo logo depois do bloco.
- **c) O exemplo:** vem de `curva_por_soma`, nas somas 6, 9 e 12 (oficial, perito e mestre, os
  três perfis da tabela de fabricação). Dá 130, 330 e 670 pc, com a média e a faixa que vence.
  Conferi a conta de cada um: perito, (16 − 7) × 37,14 = 334, arredondado a 330, contra (16 − 4) ×
  20 = 240; mestre, (21 − 11) × 66,86 = 669, arredondado a 670, contra 520 na faixa de 7.
- **d) Os tetos:** vêm de `tetos_demanda`: aldeia 100, vila 300, cidade 1.000, capital "sem teto"
  (o `preco: null`). A frase **"O teto limita o ganho, e não a venda"** abre o parágrafo, e diz que
  o teto é o valor do trabalho, já sem o material, e não o bruto vendido.
- **e) A semana de trabalho:** 6 jornadas em 8 dias, 7 ou 8 na guerra e na colheita, 5 fora de
  estação, com a renda proporcional. Não dupliquei o texto: há um link para [Semanas de
  aventura], no capítulo de custo, e a âncora resolve no `dist/`.

**Gerado, e não digitado.** As três tabelas (faixas, exemplo e tetos) estão num bloco novo,
`<!-- gen:economia-ganhar-a-vida -->`. O `scripts/gen-cap-economia.mjs` passou a escrever em dois
capítulos (13 blocos). O `--check` confere os dois e roda no `validate`. Rótulo sem faixa, teto
sem nome ou soma que falte na curva fazem o gerador falhar.

**Prova no `dist/regras/acoes-oficio-e-mundo/index.html`** (build das 01:51):
- as linhas "Oficial · 6 · 10,5 · 4 · 130 pc", "Perito · 9 · 16 · 7 · 330 pc" e "Mestre · 12 · 21
  · 11 · 670 pc";
- "Aldeia · 100 pc", "Vila · 300 pc", "Cidade · 1.000 pc", "Capital · sem teto";
- "Ofício · 7 · 37 pc";
- "O teto limita o ganho, e não a venda";
- zero "(média − 4) × 10".

## 2 · `Acoes_Sistema.md` alinhado, e a malha

Os textos novos foram **copiados do capítulo por script** (`../tmp/executora/acoes113.py`, que lê a
linha do capítulo e a cola), e não reescritos. A conferência depois:
- o parágrafo **Reparar** e a nota da carroça são **idênticos** nos dois arquivos (comparação de
  linha por script);
- as **16 linhas de tabela** do bloco gerado aparecem todas no `Acoes_Sistema.md` §7.9.

**A malha, lado a lado:**

**2a · a régua de preço por grau.**
- Capítulo, `acoes-oficio-e-mundo.md:78` e `:82`: "Requisito **+1**, no máximo 6: cada ponto acima
  vira **+3** na Dificuldade" · "Preço fixo por grau: Boa **5×**, Ótima **30×**, Excelente **70×** a
  Comum ([Qualidade de Itens]) | Tosca até **⅓**, Sucata até **⅙**".
- `Acoes_Sistema.md:1115` e `:1119`: os mesmos dois textos, sem o link (documento solto). O degrau
  "a cada dois graus" ficou como estava nos dois.
- Relíquia: capítulo de custo, `custo-de-servico-e-itens.md:341`, "**Relíquia não é grau, é
  rótulo.** ... com **piso de 100×** a peça Comum. Uma Relíquia pode ser Comum por dentro";
  `Acoes_Sistema.md:1128`, o mesmo, resumido.
- "Preço dobra / cai pela metade" não existe mais em nenhum dos dois.

**2b · o reparo.**
- Capítulo, `acoes-oficio-e-mundo.md:195`, e `Acoes_Sistema.md:1300`: o **mesmo parágrafo**,
  byte a byte ("**Dano leve:** sem Montagem e um quarto da Peça ... **Dano pesado:** metade da
  Montagem e metade da Peça ... **Arruinada** ... Montagem e Peça inteiras ... cerca de **1/10 do
  preço** ... **1/3** ... **2/3 mais o material que faltar**").
- "A Montagem se paga igual" não existe mais em nenhum dos dois. A linha da tabela de ações
  (`Acoes_Sistema.md:446`, "a mesma jogada, com o Acúmulo cortado | §7.8") não contradiz a regra
  nova.

**2c · a carroça.**
- Capítulo, `acoes-oficio-e-mundo.md:164`, "| Carroça | Carpintaria | 3 | 7 | 4 | 20 | 6,9 dias |";
  `:176`, "| Barco de pesca | ... | 7 semanas |"; e a nota em `:181`.
- `Acoes_Sistema.md:1265`, `:1277` e `:1282`: as mesmas duas linhas e a mesma nota.
- **O capítulo já estava em 6,9 dias.** O Arquiteto corrigiu em `63897c6` (CORRIGE da 110), e por
  isso não mexi. Conferi a conta: Montagem 4 + Peça 20 = 24 de Acúmulo, a 3,5 por dia do oficial,
  dá 6,86 dias. E 6,86 × (130 ÷ 6) × 1,8 = 267 pc, o avulso da nota. Os 6,3 da 110 eram os da
  espada.

**2d · a fórmula de renda.**
- Capítulo, `acoes-oficio-e-mundo.md:211` (fórmula) e `:215-248` (o bloco gerado).
- `Acoes_Sistema.md:1325` (a mesma fórmula) e as três tabelas logo abaixo, copiadas do capítulo
  **depois** de ele estar gerado, como o despacho pede, e com uma frase dizendo que os números vêm
  de `renda.json` pelo capítulo. O bônus, o teto e a semana de trabalho vêm no mesmo texto.

## 3 · As decisões antigas

- **a) A jornada por ofício faltava nos dois.** Procurei "jornada", "8 h", "10 h", "meio
  intervalo" e "Apressar". Só havia o "Dia · uma jornada" da escada de intervalos, sem as horas.
  - Escrevi perto das tabelas de fabricação, no capítulo (`acoes-oficio-e-mundo.md:137`) e, com o
    mesmo texto, no `Acoes_Sistema.md` §7.7 (`:1238`): "O 'dia' destas tabelas é uma **jornada**
    daquele ofício: **6 horas** no ofício leve (escrivão, acadêmico), **8** no artesão, **10** no
    braçal ... A linha em escala de horas converte pela jornada do próprio ofício, e **meia jornada
    é meio intervalo**".
  - O **Apressar** passou a dizer "Dobrar a jornada do próprio ofício", nos dois.
- **b) O salto entre degraus:** `Acoes_Sistema.md:216`, "de dez" virou "**de oito a sessenta
  vezes**". O `relacoes-sociais.md:215` ("8 a 24") não foi tocado.

## 4 · Verificação

- `npm run validate` e `npm run build` verdes; o gancho de commit também.
- `reapontar.mjs`: nenhuma citação a mover.
- Travessão: zero nos três arquivos, antes e depois (contado com Python).

## Achados, sem mexer

- **O `Acoes_Sistema.md` §7.10** (`:1360`) ainda diz "A tabela de `precos.json` cobre equipamento de
  aventura". O `precos.json` saiu na 110, e o item está desatualizado. Está fora deste despacho.

## PRECISA DE MIM

Nada.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
