# Fechamento da economia e restos da Reforma da Centelha · relato

Despacho em `docs/simulacao/caixa/fechamento-economia-reforma-despacho.md`. Orçamento curto,
um commit por item, CI conferido job a job com `gh run view` em cada um (nunca `gh run watch`,
e `gh run list` sem `--branch`).

## Item 1 · Restos da Reforma da Centelha

**(a) `coracao-do-sistema.md:89/91/93`.** As três sobras corrigidas juntas: a fórmula (`:89`),
o texto que ainda dizia "+1 por ponto" (`:91`) e o exemplo do guarda (`:93`), todos para
`(Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade) + Especialidade`.

**Divergência encontrada, não decidida (ordem explícita do despacho).** `:89` traz a
Especialidade DENTRO do Valor Passivo; `acoes-e-sistema.md:123` diz que ela NÃO entra (entra
por cima, quando o escopo nomeado se aplica). Deixei cada capítulo como já estava nisso: só
troquei o termo de Centelha nos dois, sem mexer em quem leva ou não a Especialidade. Fica para
o autor decidir se é divergência de fato ou dois contextos diferentes (resumo geral × o modo
Passiva especificamente).

**(b) `acoes-e-sistema.md:65` (tabela) e `:121` (fórmula)**, e `src/lib/calc.ts`:
- `valorPassivo` (`calc.ts:407-409`) trocado de `(atributo + habilidade) * 2 + centelha` para
  `(atributo + habilidade) * 2 + centelhaNaJogada(centelha, habilidade)`. Conferido: a função
  não tem CHAMADOR nenhum hoje (só é citada em comentário de `combate-resumo.ts:46` e
  `mesa-bestiario.ts:143`), então não quebra teste nem resumo em produção.
- `combate-resumo.ts:156`: o CÓDIGO (linha 157) já chamava `defesa()` (que já usa
  `centelhaNaJogada` desde a Reforma); só o COMENTÁRIO estava desatualizado ("+ Centelha" em
  vez de "2×mín(Centelha,Esquiva)"). Corrigido o comentário; o número que a ficha mostra não
  mudou.

**(c) Jogada só de Atributo.** `centelhaSoAtributo` (`calc.ts`) deixou de ser "regra de
primeira versão/pendência" no comentário: agora documenta a decisão do autor de 01/10/2026
(oficial, sem teto, porque não há Habilidade para travar o teto de `centelhaNaJogada`). Fechei
a pendência **D12** (`docs/pendencias/D-proezas-tecnicas.md`) e escrevi a regra em
`centelha.md`, item 1 (`:44`), como uma frase extra no mesmo item que já descrevia o teto geral.
`Pendencias.md` regerado (346 itens, 241 abertos, 8 anomalias pré-existentes, nenhuma nova).

**(d) Sobras do "+1 por ponto".** Conferidas as notas de `regras.json`: `escalasProeza`
(`:114`) já falava em `2×menor(Centelha,Habilidade)`, nada sobrando. Os quatro `centelhaMult`
de ataque/defesa/defesaMental/defesaSocial já tinham `centelhaNota: "DESATUALIZADO..."`
apontando para a pendência **K35**, que já cobre quem ainda lê esses campos
(`scripts/lib-tempo.mjs`, `scripts/cost-examples.mjs`): nada para corrigir ali. **Um sobrou de
verdade**: o bloco `modoDevagar` (Régua de Relação, `:2683`) ainda descrevia "Defesa parada =
... + Centelha × centelhaMult", sem nenhum código lendo esse bloco (conferido: zero
ocorrências de `modoDevagar`/`centelhaSoNaDefesa` fora do próprio JSON). Corrigido o texto para
`2×menor(Centelha,Sociabilidade)`, igual ao resto da Reforma.

**(e) Confirmado.** `acoes-e-sistema.md:107` ("A Centelha não entra na Longa") segue correto:
nem o (b) nem o (c) mexem na Longa, que continua sem termo de Centelha nenhum.

**(f) `lore/economia/estado-revisao.md:3`** corrigido de "fora do git" (`lore/economia/` não é
rastreada) para "versionado desde a rodada 111 (`508c92a3`)", que é o estado atual.

Arquivos: `src/content/chapters/coracao-do-sistema.md`, `src/content/chapters/acoes-e-sistema.md`,
`src/content/chapters/centelha.md`, `src/lib/calc.ts`, `src/lib/combate-resumo.ts`,
`src/data/regras.json`, `docs/pendencias/D-proezas-tecnicas.md`, `Pendencias.md`,
`lore/economia/estado-revisao.md`, `Regua_Relacao.md` (citação `calc.ts:164→:171`, reapontada
porque o novo comentário de `centelhaSoAtributo` empurrou `defesaSocial` três linhas).

**Produção.** Muda o número exibido pela ficha: a Defesa física passiva (resumo de combate) e
qualquer leitura futura de `valorPassivo` passam a usar o teto de Centelha certo
(2×mín(Centelha,Habilidade)) em vez do antigo "+1 por ponto" sem teto. O resumo de combate em
produção já usava `defesa()` direto (não `valorPassivo`), então o comportamento ao vivo não
muda; o que muda é o comentário que o descrevia errado. Nenhuma migração.

**Verificação:** `npm run validate`, `npx tsc --noEmit`, `npm run build` (prova no gerado:
`dist/regras/coracao-do-sistema/index.html` e `dist/regras/acoes-e-sistema/index.html` mostram
a fórmula nova), `npm run espelho` (tocou `calc.ts`). Todos verdes.

**Commit:** `8d1cbb79` · **CI:** o `8d1cbb79` subiu junto com o `f963cbf5` e não ganhou run
próprio; o Validar do `f963cbf5` (run 36922729878) passou e cobre os dois. (Conferido pela
Executora-4 com `gh run list --json`.)

### Adendo do autor (commit `f963cbf5`, após o item 1 commitado)

Unificou a fórmula do Valor Passivo nos dois capítulos: a mesma redação agora em
`coracao-do-sistema.md:89/93` e `acoes-e-sistema.md:65/121`, incluindo a Especialidade com a
ressalva por extenso: "+ Especialidade (só quando o escopo dela se aplica, somada no momento do
uso)". `acoes-e-sistema.md:123` ajustado para casar (não diz mais "a Especialidade não entra
aqui", diz "não entra no número parado que a ficha imprime", mesma explicação de sempre). O
`calc.ts` não mudou: `valorPassivo` continua sem somar Especialidade (não tem esse parâmetro), e
isso é o comportamento certo, porque a Especialidade só entra no momento do uso, não no número
parado. Guarda comum (Centelha 0, sem Especialidade) continua dando (Percepção + Prontidão) × 2,
sem mudança.

**Verificação do adendo:** `npm run validate`, `npm run build` (prova no gerado: as duas páginas
mostram a fórmula idêntica agora), zero travessão. `npx tsc`/`espelho` não repetidos porque
`calc.ts` não mudou nesta parte.

**CI do adendo `ed3ebadd`:** Validar (run 36925496143) e Deploy (run 36925496154) verdes.

**Registro do Arquiteto, para a história da rodada:** o Validar do `7975f664` (commit do
Arquiteto, só documento, run 36919784546) falhou no smoke `test-l88`, com o navegador estourando
o tempo de 30 s ("WS endpoint"). O autor considerou falha intermitente, porque os commits
seguintes passaram, e não pediu rerun.

## Item 2 · Recompensa de caça pela soma

Feito pela Executora-4 (a Executora-3 caiu com o reinício da sessão depois do item 1).

**A regra nova, onde mora.**
- `lore/economia/v2/modelo.py`: saíram `REC_BASE`, `REC_FATOR`, `REC_DEGRAUS`, o passo de
  Centelha e as fracas; entrou `REC_DESAFIOS = [40, 95, 270, 910, 3600, 14500, 57900, 231700,
  926800, 3707300]`, a tabela do autor, com o comentário de que é provisória e para no 9.
- `lore/economia/v2/gerar.py`: `recompensas.json` passa a ter `desafios` (desafio 0 a 9, `por:
  semana`, `preco.pc`) no lugar de `base`, `fator`, `degraus`, `centelha_passo`, `centelha_max`,
  `fracas_contam` e `fracas_abaixo`. Regerado pela cadeia do README (`python gerar.py`,
  `node scripts/copiar-economia.mjs`, `node scripts/gen-cap-economia.mjs`); nenhum JSON editado à
  mão. Só `recompensas.json` mudou entre os gerados.
- `scripts/validate-data.mjs`: o esquema de `recompensas.json` acompanha os campos novos.
- `scripts/copiar-economia.mjs`: a `_nota` do JSON descreve a regra da soma.
- `scripts/gen-cap-economia.mjs`: a tabela do capítulo vira "Desafio 0 a 9".
- `src/lib/recompensa.ts`: a conta recebe `criaturas: [{ desafio, quantidade }]`; Valor do
  encontro = soma de valor × quantidade; Bolsa = Valor do encontro × Tom × Semanas × Tarefa ×
  Risco × Outro × 4, arredondada pela régua de sempre. Desafio fora da tabela lança erro (a
  calculadora recusa, sem extrapolar). Devolve a parte de cada criatura no bando
  (bolsa × valor dela ÷ Valor do encontro) e marca a solitária (tudo ou nada).
- `src/components/CalculadoraRecompensa.astro`: os campos "desafio da mais forte", "Centelha",
  "fortes" e "fracas" saíram; entram linhas **desafio × quantidade** digitadas pelo Mestre
  (botões "+ outra criatura" e "− última"), com o aviso de que o desafio é provisório até a
  bancada e de que as fichas ainda não o trazem. Acima do desafio 9 (ou desafio negativo ou
  fracionário) mostra "Sem bolsa: a tabela de desafio vai de 0 a 9" e não calcula. Com alguma
  criatura de desafio 5 ou mais, o recibo acrescenta a frase do autor sobre terra, título,
  direito ou favor.
- `src/pages/recompensa.astro`: "× 3" e "grupo de 3" viraram "× 4" e "grupo de 4", e a fórmula
  diz "Valor do encontro".
- `src/content/chapters/custo-servicos.md`, "Caça e recompensas": fórmula com "Valor do
  encontro"; a lista do Degrau (desafio + quantidade + Centelha) virou "Valor de cada criatura"
  (tabela gerada 0 a 9, provisória) e "Valor do encontro = a soma"; sumiu a linha "Acima de 12";
  o Tom fala em "Valor do encontro"; entrou o **Pagamento** (bando dividido pelo valor, parcial
  paga parcial, solitária tudo ou nada) e a frase do autor "A partir do desafio 5, a bolsa é
  paga em terra, título, direito ou favor, no valor da tabela."; o parágrafo que citava "o
  degrau 6 paga 250 pc" perdeu só essa frase ("Compare com personagens de Centelha parecida, não
  com um trabalhador. O que impede..."). Semanas, Tarefa, Risco e os três testes ficaram como
  estavam.
- `scripts/test-recompensa.mjs`: reescrito para a regra da soma (9 asserções): a tabela é a do
  autor, os três exemplos abaixo, a Parte por caçador para baixo com sobra, Semanas/Tarefa/Risco
  inalterados, e a recusa no desafio 10.

**O portão das tolerâncias pegou o "provisório".** Os quatro arquivos de código que dizem que a
tabela e o desafio são provisórios levam agora `TOLERÂNCIA` + `LEVANTA QUANDO: a B14 medir o
desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.`

**Escolha que NÃO fiz, de propósito.** A parte de cada criatura no bando sai exata (no exemplo do
chefe, 3.657,0 pc e 160,7 pc), sem arredondar: o arredondamento dessa parte não foi decidido.
Fica para o autor (para baixo como a Parte por caçador, régua do `arred`, ou outra).

**Os três exemplos** (Semanas 1, Tarefa matar ×1, Risco normal ×1, Tom padrão ×1, Outro ×1,
grupo de 4). Origem dos desafios: **lobo = 0**, medido na Fase 5b (1 lobo = 0). **Worg = 1 é
PROVISÓRIO e CONTRADIZ A BANCADA**: vem da âncora do autor (4 a 5 worgs = 2), e a bancada da
Fase 5b mediu **4 worgs em desafio 3**, sem medir o worg sozinho. Pela soma, 4 worgs de desafio 1
valem 380 pc por semana, entre o desafio 2 (270) e o 3 (910) da tabela, bem abaixo do 3 medido.

1. **1 lobo (desafio 0).** Valor do encontro = 40. Bolsa = 40 × 1 × 1 × 1 × 4 = **160 pc**.
   Criatura solitária: tudo ou nada. Parte por caçador = 160 ÷ 4 = 40 pc.
2. **4 worgs (desafio 1 cada, provisório).** Valor do encontro = 95 × 4 = 380. Bolsa = 380 × 1 ×
   1 × 1 × 4 = 1.520, arredondada (régua: múltiplo de 100 a partir de 1.000) = **1.500 pc**.
   Pagamento no bando: cada worg vale 95 de 380, então cada worg morto paga 1.500 × 95 ÷ 380 =
   **375 pc**. Parte por caçador = 1.500 ÷ 4 = 375 pc.
3. **Chefe de desafio 3 com 4 criaturas de desafio 0.** Valor do encontro = 910 + 4 × 40 = 1.070.
   Bolsa = 1.070 × 1 × 1 × 1 × 4 = 4.280, arredondada = **4.300 pc**. Pagamento no bando: o chefe
   paga 4.300 × 910 ÷ 1.070 = **3.657,0 pc** (3.657,01); cada menor paga 4.300 × 40 ÷ 1.070 =
   **160,7 pc** (160,75). As cinco partes somam 4.300. Parte por caçador = 4.300 ÷ 4 = 1.075 pc.

Os três números são asserções do `test-recompensa.mjs` e saíram iguais na calculadora real (Edge
headless no dev server, linhas digitadas pela tela): "Bolsa: 160 pc", "Bolsa: 1.500 pc ... desafio
1, 375 pc cada", "Bolsa: 4.300 pc ... desafio 3, 3.657,0 pc cada; desafio 0, 160,7 pc cada",
"Sem bolsa: a tabela de desafio vai de 0 a 9, e o desafio 10 não tem valor.", e a frase do
desafio 5 no recibo. Nenhum erro de script na página (só 403 de recurso estático do dev server).

**Lacuna levada ao autor pelo Arquiteto (conferência):** nenhuma ficha de `src/data/bestiario/`
traz `desafio`; a calculadora não lê ficha, recebe o desafio digitado. Nada preenchido nas fichas.

**Produção.** Para quem joga hoje: a Calculadora de Recompensa muda de entrada (linhas de desafio
× quantidade, sem Centelha nem fortes/fracas) e de valores (a tabela do autor no lugar do Degrau),
e recusa desafio acima de 9; o capítulo Custo de Serviço traz a regra nova. Nenhuma migração.

**Verificação:** `npm run validate` (portões verdes, `test-recompensa` 9/9, economia em dia com o
modelo), `npx astro sync && npx tsc --noEmit` (sem erro), `npm run build` (prova no gerado:
`dist/regras/custo-servicos/index.html` traz "Valor do encontro × Semanas × Tarefa × Risco × 4",
a tabela até 3.707.300, a frase do desafio 5 e zero "degrau"; `dist/recompensa/index.html` traz
"Valor do encontro × Semanas × Tarefa × Risco × 4", "grupo de 4" e "provisório até a bancada
medir"). `npm run espelho` não se aplica (`calc.ts` não mudou). Zero travessão no que escrevi.

**Commit:** `5d068c65` · **CI:** Validar run 36926866092, os 19 jobs verdes (Dados e regras e os
18 smokes, conferidos job a job com `gh run view`); Deploy run 36926866039 verde.

## Item 3 · A regra da soma na bancada (só conferência, nada mudou)

Coube no orçamento: a bateria inteira rodou em uns 3 segundos. Base do Adendo 3 da Fase 5b
(`86de43ff`): `rodarBatalhaBando` de `scripts/sim/desafio-bancada.mjs`, com
`opts.semProezasPers1` (sem Proezas de Defesa, com Vontade real), Guarda sob pressão com feito e
recebido (o padrão do código), fase fora. Semente 20261001, N = 200 por Centelha do grupo, a
mesma política de bando da Fase 5b. Desafio = a menor Centelha do grupo em que ele vence 80% ou
mais (a curva para nesse ponto). O roteiro ficou fora do repositório
(`../tmp/executora/item3-soma.mjs`), porque o item não muda nada; a saída, colada:

```
mon-lobo ×1: desafio=0 · C0:100.0% · 0.1 s
mon-lobo ×2: desafio=0 · C0:100.0% · 0.1 s
mon-lobo ×4: desafio=1 · C0:0.0% C1:100.0% · 0.3 s
mon-lobo ×8: desafio=2 · C0:0.0% C1:0.0% C2:94.0% · 0.5 s
mon-worg ×1: desafio=0 · C0:100.0% · 0.0 s
mon-worg ×2: desafio=2 · C0:0.0% C1:75.5% C2:100.0% · 0.2 s
mon-worg ×4: desafio=3 · C0:0.0% C1:0.0% C2:51.0% C3:100.0% · 0.4 s
mon-worg ×8: desafio=5 · C0:0.0% C1:0.0% C2:0.0% C3:0.0% C4:6.5% C5:100.0% · 0.8 s
```

**Regressão:** 1 lobo = 0, 4 lobos = 1 e 4 worgs = 3 são os mesmos números do Adendo 3 da Fase
5b, então a bancada é a mesma.

| N | lobos | worgs |
|---|---|---|
| 1 | 0 | 0 |
| 2 | 0 | 2 |
| 4 | 1 | 3 |
| 8 | 2 | 5 |

**Quadruplicar sobe cerca de 1 desafio?**
- **Lobos: em parte.** De 1 para 4, +1 (0 para 1); de 2 para 8, +2 (0 para 2). Os dois pontos
  de partida batem no piso: 1 e 2 lobos já perdem 100% em C0, e o desafio 0 não distingue "0" de
  "abaixo de 0", então os saltos reais podem ser maiores que os medidos.
- **Worgs: não.** De 1 para 4, +3 (0 para 3); de 2 para 8, +3 (2 para 5). Quadruplicar os worgs
  sobe uns 3 desafios, não 1.

**O que isto diz da soma, sem decidir nada.** A tabela do autor cresce perto de ×4 por desafio
a partir do 3 (910, 3.600, 14.500...), e mais devagar embaixo (40, 95, 270: ×2,4 e ×2,8). Pela
soma, 4 iguais valem o mesmo que um de desafio +1. Nos lobos a bancada fica perto disso no salto de 1 para 4 (+1, com a ressalva do piso), e passa dele no de 2 para 8 (+2).
Nos worgs, não:
o bando cresce bem mais rápido do que a soma supõe. **O worg sozinho mediu 0** (o grupo vence
100% em C0), o que contradiz também o worg = 1 usado no exemplo do item 2; e 4 worgs medem 3, o
número da Fase 5b. Com worg = 0 pela bancada, a soma daria a 4 worgs 4 × 40 = 160 (entre o
desafio 1 e o 2), contra o 3 medido. Fica para o autor e a B14: se a soma precisa de um termo de
bando para criaturas como o worg, ou se a política de bando da bancada (foco de fogo, pressão
empilhada na persona engajada) pesa demais, como a Fase 5b já tinha levantado.

**Commit do item 3:** `2ea408a0` (só documento) · **CI:** Validar run 36928039875, os 19 jobs
verdes, conferidos job a job; Deploy run 36928039885 verde.

## Item 4 · As três pendências da economia (anotadas, sem execução)

A letra da economia é a **G** (`docs/pendencias/G-acoes-sistema.md`, onde estão G61 a G70 e a G71
do comércio). Com a fala do autor de 01/10/2026 citada:
- **G73 · [DECIDIR] Preços do sobre-humano: Centelha, Proezas e Magia.** Nova.
- **G74 · [DECIDIR] Poções como estoque de emergência caro.** Nova.
- **Modificador regional: anotado na G71, e não numa entrada nova.** A G71 ("Comércio e
  modificador regional", rodada 114) já é a pendência dele, então uma G75 seria duplicata. Ganhou
  um subitem "Reafirmado pelo autor em 01/10/2026". Se o Arquiteto preferir entrada própria, é
  uma linha.

`Pendencias.md` regerado (`node scripts/gen-pendencias.mjs`): 348 itens, 243 abertos, as mesmas 8
anomalias de antes (nenhuma nova).

## O que ficou pendente desta rodada

- ~~**O arredondamento da parte de cada criatura no bando** (item 2)~~: **fechado no item 2c**
  (para baixo, no pc, a sobra para a mais forte; empate só informa a sobra).
- **Worg = 1 contradiz a bancada** (itens 2 e 3): o worg sozinho mede 0, 4 worgs medem 3, e
  quadruplicar os worgs sobe 3 desafios em vez de 1. A soma, como está, subprecifica bandos de
  worgs em relação à bancada. É da B14 e do autor. (Atualizado no item 2b: a regra por
  equivalentes subprecifica ainda mais; ver a leitura do item 3 refeita.)
- **O desafio nas fichas** continua vazio; a calculadora recebe o desafio digitado (decidido na
  conferência, lacuna levada ao autor pelo Arquiteto).
- **Os `centelhaMult` ainda lidos** (item 1d): seguem na K35, só registrados.

## Item 2b · O encontro por equivalentes (Adendo 2 do autor, `ab10dfaf`)

Commit novo, sem reescrever o `5d068c65`. O Comerciante achou que a soma paga demais por bando de
fracos (100 ratazanas de desafio 0 davam 4.000); o autor trocou o Valor do encontro.

**A regra, onde mora.**
- `lore/economia/v2/modelo.py`: `REC_MEIOS = [arred(√(a × b))]` para cada par de vizinhos da
  tabela, e `divisor_por_desafio = 4`, `desafio_por_dobra = 0,5` no `OUT["recompensas"]` (os dois
  números da regra saem do modelo, não do código do site). Os meios degraus: 0,5 = 60; 1,5 = 160;
  2,5 = 500; 3,5 = 1.800; 4,5 = 7.200; 5,5 = 29.000; 6,5 = 115.800; 7,5 = 463.400;
  8,5 = 1.853.600.
- `lore/economia/v2/gerar.py`: `recompensas.json` ganha `meios` (desafio 0,5 a 8,5),
  `divisor_por_desafio` e `desafio_por_dobra`. Regerado pela cadeia do README; só
  `recompensas.json` mudou. Esquema em `scripts/validate-data.mjs` e `_nota` em
  `scripts/copiar-economia.mjs` acompanham.
- `src/lib/recompensa.ts`: `desafioDoEncontro` faz os equivalentes (a mais forte conta 1, cada
  desafio abaixo divide por 4, sem piso), a Magnitude (`floor(log2(equivalentes))`), o desafio do
  encontro (mais forte + Magnitude × 1/2) e o exato (mais forte + log4 dos equivalentes, só
  informação). `calcularRecompensa` paga pelo valor da tabela no desafio do encontro (inteiro ou
  meio degrau); criatura fora da tabela ou encontro acima de 9 lança erro. Por cabeça, cada
  criatura paga bolsa × equivalentes dela ÷ equivalentes do encontro; solitária, tudo ou nada.
- `src/components/CalculadoraRecompensa.astro`: o recibo mostra os equivalentes, a Magnitude, o
  desafio do encontro e o exato, o valor (com "meio degrau" quando for), e a parte por cabeça com a
  fração. Encontro acima de 9: "Sem bolsa: o desafio do encontro dá 9,5, e a tabela vai só até 9."
- `src/pages/recompensa.astro`: o texto do topo descreve o Valor do encontro pelo desafio do
  encontro.
- `src/content/chapters/custo-servicos.md`: a lista vira Equivalentes, Desafio do encontro
  (+ Magnitude ÷ 2, com link para a Regra de Horda e os degraus por extenso), Valor do encontro
  (com a tabela gerada em duas linhas: o desafio e o "+1/2"), Semanas, Tarefa, Risco. O Pagamento
  passa a "a fração dos seus equivalentes". Entrou uma linha de exemplos (4 lobos, 100 ratazanas,
  o chefe com 94%), para o leitor ver a conta; se o Arquiteto preferir sem, é uma linha.
- `scripts/test-recompensa.mjs`: 19 asserções (tabela, meios degraus, os seis exemplos, os 94% do
  chefe, partes somando a bolsa, o meio degrau de baixo em 2/3 e 8/15/16, o exato, a Parte por
  caçador, Semanas/Tarefa/Risco, e as duas recusas).

**Duas leituras que fiz, por estarem implícitas, e que o Arquiteto pode trocar.**
1. **"A partir do desafio 5" lê o desafio do ENCONTRO**, não o da criatura mais forte (no item 2
   era o da mais forte, porque não havia desafio de encontro). Quatro criaturas de desafio 4 dão
   encontro 5 e mostram a frase da terra e do título.
2. **Encontro acima de 9 recusa** do mesmo jeito que criatura acima de 9: 9,5 não tem vizinho de
   cima para a média geométrica, e a tabela para no 9.

**Os seis exemplos, conferidos à mão** (Valor do encontro, antes do × 4; Semanas 1, matar, risco
normal, tom padrão):

| encontro | equivalentes | Magnitude (degrau) | desafio | Valor do encontro | bolsa (× 4, arred) |
|---|---|---|---|---|---|
| 1 lobo (0) | 1 | 0 (1) | 0 | **40** | 160 |
| 4 lobos (0) | 4 | 2 (4 a 7) | 0 + 1 = 1 | **95** | 380 |
| 4 worgs (1, **provisório, contra a bancada**) | 4 | 2 (4 a 7) | 1 + 1 = 2 | **270** | 1.080, arred 1.100 |
| 100 ratazanas (0) | 100 | 6 (64 a 127) | 0 + 3 = 3 | **910** | 3.640, arred 3.600 |
| chefe (3) + 4 de desafio 0 | 1 + 4 × 1/64 = 1,0625 | 0 (1) | 3 | **910** | 3.640, arred 3.600 |
| 4 de desafio 3 | 4 | 2 (4 a 7) | 3 + 1 = 4 | **3.600** | 14.400 |

No chefe com os quatro menores, cada menor está três desafios abaixo (1/4³ = 1/64): o chefe
responde por 1 ÷ 1,0625 = **94,1%** da bolsa (3.388,2 pc dos 3.600) e cada menor por 1,5% (52,9 pc).
As cinco partes somam 3.600. O exato das 100 ratazanas é 0 + log4(100) = 3,32, pago pelo 3.

Os seis números são asserções do `test-recompensa.mjs`, e a calculadora real (Edge headless no
dev server, linhas digitadas pela tela) mostrou o mesmo: 1 lobo "Bolsa: 160 pc"; 100 ratazanas
"Magnitude 6 ÷ 2 = 3 ... o exato seria 3,32 ... 910 pc ... Bolsa: 3.600 pc"; o chefe "1 × 1 + 4 ×
0,0156 = 1,0625 ... desafio 3, 3.388,2 pc cada (94,1%); desafio 0, 52,9 pc cada (1,5%)"; 2 de
desafio 9 "Sem bolsa: o desafio do encontro dá 9,5, e a tabela vai só até 9."; desafio 10 recusado;
4 de desafio 4 com a frase do desafio 5. Nenhum erro de script (só os 403 de recurso estático do
dev server).

**Produção.** Para quem joga hoje: a Calculadora de Recompensa paga bando pelo desafio do encontro
(equivalentes e meio degrau), e não mais pela soma; bando de fracos paga bem menos (100 ratazanas:
de 4.000 para 910 por caçador e semana), e a parte por cabeça segue os equivalentes. O capítulo
traz a regra nova. Nenhuma migração.

**Verificação:** `npm run validate` (portões verdes, `test-recompensa` 19/19, economia em dia com
o modelo), `npx astro sync && npx tsc --noEmit` (sem erro), `npm run build` (prova no gerado:
`dist/regras/custo-servicos/index.html` traz a linha "Com +1/2 (pc)" até 1.853.600, o "Desafio do
encontro = desafio da mais forte + Magnitude ÷ 2", o link `/centelha-rpg/regras/combate#regra-de-horda`,
"o chefe sozinho responde por 94%" e zero "a soma dos valores"; `dist/recompensa/index.html` traz
"mais 1/2 a cada vez que os equivalentes dobram"). `calc.ts` não mudou, então sem `espelho`. Zero
travessão.

### Item 3 relido contra a regra nova ("dobrar = +1/2 desafio")

Sem rodar de novo: os N medidos (1, 2, 4 e 8) bastam. Uma ressalva de medida antes: a bancada
mede desafio só em inteiro (Centelha 0 a 6 do grupo), então um encontro de meio degrau aparece
como o inteiro de baixo ou o de cima, e não como ,5.

| N | equivalentes | regra, lobo = 0 | lobos medidos | regra, worg = 0 (bancada) | regra, worg = 1 (provisório) | worgs medidos |
|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| 2 | 2 | 0,5 | 0 | 0,5 | 1,5 | 2 |
| 4 | 4 | 1 | 1 | 1 | 2 | 3 |
| 8 | 8 | 1,5 | 2 | 1,5 | 2,5 | 5 |

- **Lobos: a regra fica perto.** 4 lobos batem exato (1); 2 lobos (0,5) medem 0, dentro da
  ressalva do inteiro; 8 lobos (1,5) medem 2, meio desafio acima. Por dobra, a bancada sobe +0, +1
  e +1 (o primeiro preso no piso do 0), contra +1/2 da regra.
- **Worgs: a regra fica longe.** A bancada sobe +2, +1 e +2 por dobra (de 1 para 8, +5), contra
  +1/2 por dobra (+1,5). Com o worg = 0 que a bancada mede, a regra dá a 8 worgs 1,5 contra 5
  medidos; mesmo com o worg = 1 do exemplo, 2,5 contra 5. **A regra por equivalentes subprecifica
  bando de worgs ainda mais que a soma** (para 4 worgs de desafio 0, a soma dava um valor entre o
  desafio 1 e o 2; a regra dá 1; a bancada mede 3).
- O que a Fase 5b já tinha levantado continua de pé: ou o worg tem algo que faz o bando dele
  crescer mais rápido que o de lobos, ou a política de bando da bancada (foco de fogo, pressão
  empilhada na persona engajada) pesa demais. Para o autor e a B14; nada decidido aqui.

**Commit do item 2b:** `c09261ce` · **CI:** Validar run 36932066683, os 19 jobs verdes, conferidos
job a job com `gh run view`; Deploy run 36932066543 verde.

## Item 2c · Adendo 3 do autor (`170f6fe4`)

Commit novo sobre o `c09261ce`.

**1. "+1/2 por dobra" fica, marcado como provisório.** No capítulo (`custo-servicos.md`, passo 2 do
Desafio do encontro: "(**provisório**: a bancada mediu bandos que sobem mais rápido, e a medida com
a Regra de Horda ainda está por fazer)") e na calculadora (o aviso do topo e a linha do recibo
"+1/2 a cada dobra dos equivalentes, para baixo, provisório até a bancada"). As marcas
`TOLERÂNCIA` do código passam a citar também o +1/2 por dobra, com o mesmo `LEVANTA QUANDO`.

**A contradição da bancada, registrada.** O item 3 mediu, para N = 1, 2, 4 e 8:

| N | lobos | worgs | regra (+1/2 por dobra, a partir de 0) |
|---|---|---|---|
| 1 | 0 | 0 | 0 |
| 2 | 0 | 2 | 0,5 |
| 4 | 1 | 3 | 1 |
| 8 | 2 | 5 | 1,5 |

Os lobos ficam perto da regra; os worgs sobem bem mais rápido (+5 de 1 para 8, contra +1,5).
**Ressalva: o N = 8 rodou como 8 indivíduos** (`rodarBatalhaBando`, a mesma política da Fase 5b),
**e não como Horda** (o esquadrão com Magnitude de `combate.md:409`). A medida certa com a Horda
foi para a fila da B14 (B18, abaixo).

**2. Worg = 0 nos exemplos.** O worg medido sozinho no item 3 deu 0. O exemplo vira: **4 worgs = 4
equivalentes, desafio 0 + 1 = 1, Valor do encontro 95** (bolsa 95 × 4 = 380). **A bancada mediu 4
worgs em 3**, e a regra paga como desafio 1. A asserção do `test-recompensa.mjs` passou de "worg =
1, desafio 2, 270" para "worg = 0, desafio 1, 95".

**3. A parte por cabeça arredonda para baixo, no pc, e a sobra vai para a mais forte.** Fecha a
pendência que o item 2 deixou aberta. Quando as mais fortes empatam, a resposta do autor (via
Arquiteto) é não regular: a divisão é do grupo, e a calculadora mostra as partes por baixo e a
sobra em pc, sem dar dono. No código (`src/lib/recompensa.ts`), cada parte é `floor(bolsa ×
equivalentes dela ÷ equivalentes do encontro)`; `sobraPartes` é o que falta para a bolsa; se a mais
forte é uma só, a sobra entra como `extra` dela; senão vira `sobraSemDono`. No capítulo: "arredondada
para baixo, no pc; a sobra fica com a criatura mais forte (se as mais fortes empatam, o grupo
decide)".

- **O chefe, refeito:** bolsa 3.600. Cada menor: 3.600 × (1/64) ÷ 1,0625 = 52,94, para baixo **52
  pc**. O chefe: 3.600 × 1 ÷ 1,0625 = 3.388,24, para baixo 3.388, mais a sobra de 3.600 − 3.388 −
  4 × 52 = **4 pc**: **3.392 pc**. Soma: 3.392 + 4 × 52 = 3.600.
- **Empate, 7 lobos:** 7 equivalentes, desafio 1, bolsa 380. Cada lobo: 380 ÷ 7 = 54,28, para baixo
  **54 pc**; sobram **2 pc**, só informados ("Sobram 2 pc: as mais fortes empatam, e o grupo decide
  de quem é").

Os dois casos são asserções do teste (21 no total).

**4. O degrau na borda da Magnitude: conhecido e aceito.** 127 equivalentes dão +3 e 128 dão +3 1/2:
uma criatura a mais muda o Valor do encontro de um degrau inteiro para o meio degrau seguinte. O
autor aceita: quem escolhe o número de criaturas é o Mestre, e a Regra de Horda tem os mesmos
degraus. Não entrou frase no capítulo (o passo 2 já lista os degraus por extenso).

**5. Fila da B14.** Nova **B18 · [FAZER]** no fim de `docs/pendencias/B-bestiario.md`, só anotada:
medir o bando com N = 1, 2, 4, 8, 16 e 32 para lobos, worgs e uma criatura de desafio 2, com a Regra
de Horda a partir de 8; informar o desafio por N e se a curva casa com +1/2 por dobra; e a
suspeita de que a Guarda sob pressão pesa demais com 2 a 4 atacantes (1 worg = 0, 2 worgs = 2).
`Pendencias.md` regerado: 349 itens, 244 abertos, as mesmas 8 anomalias.

**As duas leituras do 2b ficam como estavam** (o Arquiteto confirmou): "a partir do desafio 5" lê o
desafio do encontro, e encontro acima de 9 recusa.

**Na calculadora real** (Edge headless no dev server, linhas digitadas pela tela): 7 lobos "Bolsa:
380 pc ... desafio 0, 54 pc cada (14,3%). Sobram 2 pc: as mais fortes empatam, e o grupo decide de
quem é"; o chefe "desafio 3, 3.392 pc (3.388 pc + a sobra de 4 pc, que vai para a mais forte;
94,1%); desafio 0, 52 pc cada (1,5%)"; a linha do desafio com "provisório até a bancada". Nenhum
erro de script (só os 403 de recurso estático do dev server).

**Produção.** Para quem joga hoje: a parte de cada criatura no recibo da calculadora agora é em pc
inteiro, com a sobra na mais forte (ou informada, no empate); o capítulo e a calculadora dizem que o
+1/2 por dobra é provisório. Os valores de bolsa não mudam em relação ao 2b. Nenhuma migração.

**Verificação:** `npm run validate` (portões verdes depois de pôr a marca `TOLERÂNCIA` / `LEVANTA
QUANDO` junto da linha nova do recibo, que o portão pegou na primeira volta; `test-recompensa`
21/21), `npx astro sync && npx tsc --noEmit` (sem erro), `npm run build` (prova no gerado:
`dist/regras/custo-servicos/index.html` traz "**provisório**: a bancada mediu bandos que sobem mais
rápido..." e "arredondada para baixo, no pc; a sobra fica com a criatura mais forte (se as mais
fortes empatam, o grupo decide)"; `dist/recompensa/index.html` traz "+1/2 a cada dobra dos
equivalentes também é provisório"). Zero travessão.

**Commit do item 2c:** `d8d2fd27` · **CI:** Validar run 36962462391 verde depois de um rerun (ver o
item 2e, "O test-l84 intermitente"); Deploy verde.

## Item 2d · não entrou

O Adendo 4 (`72f344f2`, parte fixada no contrato e campo opcional de desafio conhecido) foi feito e
verificado na árvore, mas não foi commitado: o autor corrigiu o desenho antes, e o Adendo 5 o
substituiu. Do 2d só ficaram o campo de desafio (agora a entrada principal, no 2e) e o registro do
test-l84 (no item 2e). A observação do Adendo 4 sobre a oferta (a oferta de trabalho é por povoado,
e não por caçador: uma cidade de fronteira com 24 trabalhos por ano reparte esses trabalhos entre
todos os caçadores dela) fica anotada aqui como registro, sem divergência.

## Item 2e · A recompensa é o preço de UM TRABALHO (Adendo 5 e Complemento, `2f522a44` e `791cbd25`)

**A regra.** Bolsa = Valor(desafio do trabalho) × Semanas × Tarefa × Risco × 4. O desafio do
trabalho é o do pior confronto que o grupo precisa vencer para cumpri-lo; a duração entra em
Semanas. Matar sem trabalho contratado não paga nada; cumprir parte não paga parte, a não ser que o
Mestre decida; pagamento por peça fica na Tarefa "trazer parte ou prova" e na venda de partes.

**O que foi desfeito, e o que ficou.**

| de onde | o quê | no 2e |
|---|---|---|
| 2 | tabela de desafio 0 a 9 do autor, recusa acima de 9, ×4, Semanas/Tarefa/Risco/Tom, a frase do desafio 5, `TOLERÂNCIA` | **ficou** |
| 2 | Valor do encontro pela SOMA das criaturas (já trocado no 2b) | desfeito antes |
| 2 | pagamento num bando dividido pelo valor de cada criatura; solitária tudo ou nada | **desfeito** |
| 2b | meio degrau pela média geométrica (`meios` no JSON, linha "+1/2" na tabela do capítulo) | **ficou** |
| 2b | equivalentes, Magnitude ÷ 2, desafio do encontro | **ficou só como ajuda opcional** de estimar o desafio de um confronto; não paga nada |
| 2b | Valor do encontro = valor no desafio do encontro, divisão da bolsa por equivalentes, os exemplos (4 lobos, 100 ratazanas, chefe com 94%) | **desfeito** |
| 2c | "+1/2 por dobra" provisório | **ficou**, na ajuda de estimar |
| 2c | worg = 0 nos exemplos | **trocado pelo Complemento**: a matilha de 4 worgs é desafio 3 (medido), com a referência worg 0, dupla 2, matilha 3 |
| 2c | parte por cabeça para baixo, sobra na mais forte, empate só informado | **desfeito** |
| 2c | B18 na fila da B14 | **ficou**, com o ajuste do item 9 e as notas dos itens 11, 13 e 14 |
| 2d | parte fixada no contrato, parcial somando partes, `pagamentoParcial` | **não entrou** |
| 2d | campo de desafio (inteiro ou meio degrau, 0 a 9, mesmas recusas) | **ficou como a entrada principal** |

**Onde mora.**
- `src/lib/recompensa.ts`: `calcularRecompensa` recebe `desafio` (o do trabalho) em vez de
  criaturas; o Valor sai de `valorDoDesafio` (inteiro ou meio degrau; fora da tabela, erro). Saíram
  as partes por criatura, a sobra e o empate. `desafioDoEncontro` ficou, como ajuda de estimar.
- `src/components/CalculadoraRecompensa.astro`: a entrada principal é "Desafio do trabalho" (passo
  0,5, de 0 a 9); recusa fora da tabela com "Sem bolsa: a tabela de desafio vai de 0 a 9, em degraus
  inteiros e meios degraus entre eles...". A conta por equivalentes foi para um bloco que abre e
  fecha, "Estimar o desafio de um confronto com várias criaturas (ajuda opcional, provisória)", que
  só mostra a estimativa e um botão "usar como desafio do trabalho" (o Mestre escolhe se usa). O
  recibo diz "Cumprir parte do trabalho não paga parte, a não ser que o Mestre decida."
- `src/pages/recompensa.astro`: o topo traz a fórmula nova.
- `src/content/chapters/custo-servicos.md`: a fórmula nova; o passo 1 é o desafio do trabalho, com
  a frase verbatim do animal comum ("Animal comum não tem desafio próprio; a ficha traz uma nota de
  quantos formam um desafio 0 para um grupo de Centelha 0, como referência."); o passo 2 é o Valor
  pela tabela. Saiu o parágrafo do Pagamento por criatura; entrou "O que a bolsa paga" (trabalho e
  não cabeças, sem trabalho não paga, parte não paga parte salvo o Mestre, e a frase que separa
  pagamento por peça). A conta por equivalentes virou o parágrafo "Estimar o desafio de um confronto
  com várias criaturas", provisório, que "não multiplica nem divide a bolsa". Os exemplos viraram
  trabalhos.
- `lore/economia/v2/modelo.py` (só comentário) e `scripts/copiar-economia.mjs` (a `_nota` do JSON):
  descrevem a regra do trabalho. Regerado pela cadeia; `recompensas.json` mudou só na `_nota`.
- `scripts/test-recompensa.mjs`: reescrito, 16 asserções. Saíram os casos de 125/128 ratazanas,
  chefe com 94%, divisão por equivalentes e 7 lobos empatados.
- `docs/pendencias/B-bestiario.md` (B18): o ajuste do item 9, worg besta mágica e lobo animal comum
  (item 11), a nota verbatim do lobo (item 13) e a matilha de worgs (item 14). `Pendencias.md`
  regerado, sem mudança (o índice traz só a linha de resumo da B18, que não mudou).

**Os exemplos, como trabalhos** (Semanas 1, matar, risco normal, tom padrão, grupo de 4):
1. **Livrar a estrada de uma matilha de 4 worgs:** desafio 3, medido na Fase 5b, **PROVISÓRIO** até
   a medição de bando com Horda (referência: worg sozinho 0; dupla 2; matilha de 4, 3). Valor 910;
   bolsa 910 × 1 × 1 × 1 × 4 = 3.640, arred **3.600**; 900 pc por caçador. A ajuda por
   equivalentes daria 1 (Valor 95), contra o 3 medido. A frase "estimado 1 pela conta provisória; o
   Mestre escolhe" do item 7 saiu, porque o Complemento (item 12) substitui esse exemplo.
2. **Livrar o vilarejo da infestação de ratazanas:** sem desafio por criatura; o Mestre fixa o
   desafio do trabalho e as Semanas. Para ilustrar (números escolhidos aqui, não regra): desafio 1 e
   3 semanas dão 95 × 3 × 4 = 1.140, arred **1.100**.
3. **Matar o chefe de desafio 3 com o bando dele:** desafio 3, Valor 910, bolsa **3.600**.

**O test-l84 intermitente** (pendente do 2c, pedido no Adendo 4, item 4). No Validar 36962462391
(o do `d8d2fd27`, item 2c), o smoke `test-l84` falhou na primeira volta: o navegador estourou os
30 s esperando o "WS endpoint", o mesmo sintoma do `test-l88` no `7975f664`. O Arquiteto rodou de
novo só o job que falhou e deu success; o Deploy já tinha passado. São dois casos do mesmo sintoma,
em smokes diferentes, os dois em commit que não tocava o smoke.

**Verificação** (sobre `791cbd25`, 02/10): `test-recompensa` 16 asserções verdes; `npm run validate`
verde ("Portões OK"); `npx astro sync && npx tsc --noEmit` sem erro; `npm run build` verde. No
gerado, `dist/regras/custo-servicos/index.html` traz "Valor(desafio do trabalho)", a frase do
animal comum verbatim, "Cumprir parte do trabalho não paga parte" e "Livrar a estrada de uma
matilha de 4 worgs", e não traz "Valor do encontro", "fração dos seus equivalentes", "tudo ou nada"
nem "o Mestre escolhe" (contagens 1, 1, 1, 1 e 0, 0, 0, 0); `dist/recompensa/index.html` traz
"Valor(desafio do trabalho)", "Desafio do trabalho", "pior confronto" e "Estimar o desafio de um
confronto", e não traz "Valor do encontro". Zero travessão nos 10 arquivos (contado em Python, no
arquivo).

**Uma escolha de interface, que o Arquiteto pode trocar:** o botão "usar como desafio do trabalho"
na ajuda de estimar. Ele só copia a estimativa para o campo principal quando o Mestre clica; sem o
clique, a estimativa não mexe em nada.

**Commit do item 2e:** `601e1ce8` · **CI:** Validar
[37026268471](https://github.com/f-neves/centelha-rpg/actions/runs/37026268471) verde, os 19 jobs
na primeira volta (Dados e regras e 18 smokes); Deploy
[37026268494](https://github.com/f-neves/centelha-rpg/actions/runs/37026268494) verde (build e
deploy).

**Um ajuste da nova Executora no 2e, antes do commit:** a anterior morreu no meio, com a árvore
suja. Na conferência contra os 14 itens, o capítulo ainda trazia "A estimativa por equivalentes
daria 1; o Mestre escolhe.", do exemplo do item 7 que o Complemento (item 12) substituiu; a frase
saiu. O registro do test-l84 passou da seção do 2d para a do 2e.

## Item 2f · O desafio do trabalho é absoluto (Adendo 6, `5d76b91b`)

- `src/content/chapters/custo-servicos.md` (passo 1, "Desafio do trabalho") e
  `src/components/CalculadoraRecompensa.astro` (o aviso do topo) trazem o texto do autor, verbatim:
  "O desafio do trabalho é absoluto: é o da ameaça, medido contra o grupo de referência (4
  personagens de Centelha igual ao desafio), e não muda conforme o grupo que aceita o trabalho. Um
  grupo veterano que pega uma matilha de worgs recebe o mesmo que um grupo novato receberia."
  Nenhuma conta mudou.
- `docs/pendencias/G-acoes-sistema.md` (G73): pendência, sem execução, do teto próprio do preço de
  partes de criatura pela demanda de quem compra, porque hoje Prejuízo e Capacidade só limitam a
  bolsa, e bolsa mais partes não tem teto (Comerciante, 02/10). `Pendencias.md` regerado, sem
  mudança (o índice traz só o resumo da G73).
- **Verificação** (sobre `5d76b91b`): `npm run validate` verde ("Portões OK"); `npx astro sync &&
  npx tsc --noEmit` sem erro; `npm run build` verde. A frase inteira do autor aparece 1 vez em
  `dist/regras/custo-servicos/index.html` e 1 vez em `dist/recompensa/index.html`. Zero travessão
  nos 4 arquivos (contado em Python, no arquivo).

**Commit do item 2f:** `ed289426` · **CI:** Validar
[37033400033](https://github.com/f-neves/centelha-rpg/actions/runs/37033400033) verde, 19 de 19
jobs na primeira volta; Deploy
[37033399808](https://github.com/f-neves/centelha-rpg/actions/runs/37033399808) verde, 2 de 2.

## Item 2g · Semanas é a duração prevista no contrato (Adendo 7, `7c28c50d`)

O achado do Comerciante: o grupo podia escolher um método mais lento para multiplicar Semanas.

- `src/content/chapters/custo-servicos.md`, passo 3 (Semanas): a frase "É estimativa de contrato:
  se levar mais, azar de quem caça; se levar menos, sorte." saiu, e no lugar dela entrou o texto do
  autor, verbatim: "Semanas é a duração prevista no contrato, combinada antes do trabalho. Terminar
  antes ou depois não muda a bolsa: quem contrata paga pelo resultado, e não pelo tempo gasto." Foi
  o único ajuste: a frase antiga dizia o mesmo (o contrato fixa a duração, e o tempo real não mexe
  na bolsa), e manter as duas repetiria. O resto do passo ficou como estava.
- `src/components/CalculadoraRecompensa.astro`: o mesmo texto, verbatim, no aviso do topo, logo
  depois de "a duração entra em Semanas".
- Nenhuma conta mudou. O aviso do adendo (generalizar a bolsa para qualquer trabalho pontual) não
  foi executado, por ordem do despacho.
- **Uma leitura para o Arquiteto, sem mexer:** o mesmo passo segue dizendo, sobre a viagem, "A
  viagem conta metade porque é tempo gasto, não perigo: paga o tempo, sem o prêmio de risco." Ao
  lado de "paga pelo resultado, e não pelo tempo gasto", as duas falam de "tempo gasto" em
  sentidos diferentes (a viagem prevista que entra na conta, e o tempo real que não entra). Não
  troquei a redação porque seria escolha além de tirar a repetição.
- **Verificação** (sobre `7c28c50d`): `npm run validate` verde ("Portões OK"); `npx astro sync &&
  npx tsc --noEmit` sem erro; `npm run build` verde. A frase do autor aparece 1 vez em
  `dist/regras/custo-servicos/index.html` e 1 vez em `dist/recompensa/index.html`; "azar de quem
  caça" aparece 0 vez no capítulo gerado. Zero travessão nos 3 arquivos (contado em Python, no
  arquivo).


**Commit do item 2g:** `38008870` · **CI:** Validar
[37037626301](https://github.com/f-neves/centelha-rpg/actions/runs/37037626301) verde; Deploy
[37037626116](https://github.com/f-neves/centelha-rpg/actions/runs/37037626116) verde.

## Item 5 · Trabalhos e recompensas (`57cf3e8a` e `30127dcb`, com as respostas do autor)

A bolsa passa a valer para qualquer trabalho pontual, **como guia para o Mestre, e não regra de
mundo**, e o texto diz isso. Bolsa = Valor por pessoa × Semanas × Tarefa × Risco × Pessoas, com
Pessoas no padrão 4. O Valor tem dois caminhos, confronto (tabela de desafio) e perícia (tabela da
Dificuldade); com os dois, vale o maior.

**Perguntas da Executora, respondidas pelo autor antes do commit** (no despacho, "Respostas do
autor às perguntas da Executora"):
1. Dificuldade entre degraus: **interpolação geométrica** entre os degraus vizinhos, como o meio
   degrau, arredondada pela régua. Degrau novo **Dif 5 = 10** como piso; abaixo de 5 paga 10.
2. Acima de Dif 31: a fórmula segue até o desafio 9 (Dif 36-37) e recusa acima; o capítulo mostra a
   tabela até 30-31 e uma frase dizendo que a fórmula continua.
3. **Recuperar é tipo próprio**; Caçar fica com 5 variações (saiu o "recuperar" da caça).

**Onde mora.**
- `lore/economia/v2/modelo.py`: `REC_PERICIA` (gerada: os degraus 5, 10, 15 e 20 do autor, e acima
  de 20 as faixas da fórmula (Dif − 19) ÷ 2, para cima, até o desafio 9), `REC_TRABALHOS` (a Tarefa
  por tipo, aninhada), `REC_PROVISORIO_DESDE = 4` (correção D) e `pessoas_padrao = 4` no lugar do
  antigo `grupo`. `gerar.py` escreve `pericia`, `trabalhos`, `provisorio_desde` e `pessoas_padrao`
  em `recompensas.json`, regerado pela cadeia (`copiar-economia.mjs`, que leva a `_nota` nova).
  O schema em `validate-data.mjs` acompanha.
- `src/lib/recompensa.ts`: `calcularRecompensa` recebe `desafio`, `dificuldade` (um dos dois ou os
  dois), `trabalho`, `tarefa`, `semanas`, `pessoas` e `grupo` (quem vai, só divide). `valorDaPericia`
  devolve o degrau, a interpolação entre degraus ou o piso, e recusa acima de Dif 37. O resultado
  diz o caminho que valeu e se o valor é do topo provisório.
- `src/components/CalculadoraRecompensa.astro`: escolhe o caminho (confronto, perícia, os dois), o
  tipo de trabalho e a variação (a lista muda com o tipo), Semanas, viagem, Risco, Pessoas (padrão
  4), Outro, Tom e quantos vão. O recibo mostra os dois valores quando há os dois, qual valeu, a
  conta inteira e o arredondado, e os avisos (parte não paga parte; topo provisório; terra a partir
  do desafio 5; favor acima do 3). As frases dos itens 2f e 2g ficaram no aviso do topo. A ajuda de
  estimar ficou como estava.
- `src/content/chapters/custo-servicos.md`: a seção virou **"Trabalhos e recompensas"**, com as
  frases verbatim do item 3 e das correções B e C, os dois caminhos, as duas tabelas geradas (a de
  perícia é um bloco novo, `gen:economia-recompensas-pericia`, em `gen-cap-economia.mjs`), a Tarefa
  por tipo do item 4, os oito exemplos com a conta, e a frase do item 7 ("Acima do desafio 3, o
  Mestre pode pagar parte em favor, acesso ou objeto."). Correção D: o texto diz que os desafios 0
  a 3 vêm da escada de capacidade e que do 4 em diante a tabela é provisória; o desafio de cada
  criatura segue provisório até a bancada.
- `src/pages/recompensa.astro`: a fórmula nova no topo e o link para `#trabalhos-e-recompensas`. Era o
  único lugar que apontava para `#caça-e-recompensas` (procurado em `src/`, `scripts/` e no `dist/`
  gerado: zero ocorrência da âncora velha depois do build).
- `scripts/test-recompensa.mjs`: 32 asserções, com os oito exemplos, a tabela de perícia, a
  interpolação, o piso, a recusa acima de 37, o maior dos dois caminhos e Pessoas.

**Os oito exemplos** (sem viagem, tom padrão, a bolsa pela régua, por decisão do autor):

| trabalho | caminho | conta | exata | bolsa |
|---|---|---|---|---|
| seguir em segredo quem não quer ser achado e descobrir onde mora | Dif 15 | 40 × 1 sem × 1 × 1 × 1 pessoa | 40 | **40** |
| seguir um espião treinado sem ser notado e trazer prova do que ele faz | Dif 20 | 60 × 2 × 1,5 × 1 × 1 | 180 | **180** |
| roubar de um nobre sem que ele note | Dif 20 | 60 × 1 × 2 × 1,5 (alto) × 2 | 360 | **360** |
| entregar uma carta que ninguém pode saber que existe | Dif 15 | 40 × 2 × 1,5 × 1 × 1 | 120 | **120** |
| recuperar uma criança levada por goblins | desafio 1 | 95 × 1 × 1 × 1 × 4 | 380 | **380** |
| escoltar um mercador por estrada com bandidos | desafio 1 | 95 × 2 × 1 × 1 × 4 | 760 | **760** |
| proteger a aldeia de uma matilha de worgs | desafio 3 | 910 × 1 × 1 × 1 × 4 | 3.640 | **3.600** |
| invadir a torre de um mago | Dif 25 = desafio 3 | 910 × 1 × 1 × 2 (muito alto) × 4 | 7.280 | **7.300** |

**Rótulos trocados pela correção B** (sem mudar número):
- "seguir uma pessoa e achar onde mora" virou "seguir **em segredo quem não quer ser achado** e
  descobrir onde mora": seguir alguém comum é serviço de rastreador; o sigilo e o alvo que se
  esconde tiram o trabalho da rotina.
- "seguir um espião treinado, com prova" virou "seguir um espião treinado **sem ser notado** e
  trazer prova do que ele faz": só deixa explícito o sigilo e o perigo.
- "roubar de um nobre sem que note" ficou como estava, com "ele": é ilegal, e já está fora de
  Serviços.
- "entregar carta sigilosa" virou "entregar uma carta **que ninguém pode saber que existe**", com a
  observação "é o sigilo que tira o trabalho do mensageiro comum", como a correção B pede.

**O que mais mudou no capítulo, e por quê.**
- "O valor é o Livre: o custo de vida de quem caça já está descontado" e "A bolsa paga um grupo de
  4 ... se forem menos, levam mais e arriscam mais" saíram: a frase do item 3 e a da correção C
  dizem o mesmo, e as duas versões juntas se repetiriam.
- "Semanas = caçada estimada" virou "duração estimada", porque o trabalho não é mais só caça.
- O "Risco, além do que o desafio já prevê" virou "além do que o desafio ou a Dificuldade já
  preveem".
- Na explicação da perícia, a lista de quem passa até Dif 20 ganhou o **Braçal** ("Braçal, Oficial,
  Perito, Mestre de ofício"), por causa do degrau Dif 5 = 10 da resposta do autor, que é o Livre do
  Braçal × 1,8.
- Na calculadora, a variação abre na base ×1 de cada tipo (Matar, na caça), como abria antes.
- Os exemplos de antes ficaram: a matilha de worgs virou o exemplo de proteger a aldeia (o mesmo
  desafio 3, com a referência do Complemento: worg 0, dupla 2, matilha 3), e as ratazanas e o chefe
  de desafio 3 continuam no fim da lista.

**Dois números do autor que a régua não dá**, registrados sem mudar nada: Dif 5 = 10, e não
arred(7 × 1,8) = 13; e Dif 20 = 60 (o meio degrau 0,5), e não arred(35 × 1,8) = 65. O modelo grava
os números do autor e diz isso em comentário. O Dif 10 = 20 e o Dif 15 = 40 batem com a régua.

**Para o portão das tolerâncias:** os desafios do 4 em diante e o recibo que avisa disso levam
`TOLERÂNCIA` com `LEVANTA QUANDO:` (a G73 decidir os preços do sobre-humano, e o autor confirmar ou
trocar o topo da tabela). A marca velha, "até a bancada medir" para a tabela inteira, saiu.

**Verificação** (sobre `30127dcb`): `test-recompensa` 32 asserções verdes; `npm run validate`
verde ("Portões OK"); `npx astro sync && npx tsc --noEmit` sem erro; `npm run build` verde. No
gerado, `dist/regras/custo-servicos/index.html` traz `id="trabalhos-e-recompensas"`, a fórmula nova,
"guia para o Mestre: sugestão de preço, e não regra de mundo", as frases do item 3 e das correções B
e C inteiras, "a calculadora interpola as Dificuldades entre um degrau e outro", a tabela de perícia
(a faixa "22-23"), "3.600 pc", "7.300 pc", a frase do item 7 e "Do desafio 4 em diante a tabela é
provisória" (1 vez cada), e o link para `acoes-e-sistema#de-onde-sai-a-dificuldade`, que existe
como `id` na página de destino. Não traz "caça-e-recompensas" nem "Valor do encontro" (0).
`dist/recompensa/index.html` traz o link `trabalhos-e-recompensas`, a fórmula nova, "Perícia
(Dificuldade)", "Quantos vão de fato", "Guia para o Mestre, e não regra de mundo" e "Proteger um
lugar"; nenhuma âncora velha em todo o `dist/`. Nenhum travessão novo (contado em Python, no
arquivo): zero em 11 dos 12 arquivos, e os 17 de `scripts/validate-data.mjs` já estavam no
`HEAD` (contagem igual antes e depois). A página aberta no dev server (driver do projeto, modo
`shot`): a calculadora abre em Confronto, desafio 1, Caçar, Matar ×1, 1 semana e 16 dias de viagem,
4 pessoas, e o recibo dá "Bolsa: 760 pc · Parte por pessoa (vão 4): 190 pc" (95 × 2,0 × 4), com o
campo da Dificuldade escondido no caminho do confronto.

**Commit do item 5:** `d2237ae2` (rebaseado sobre `9c13c21f`).

**Emenda à correção B (`9c13c21f`), em commit à parte.** A emenda chegou ao main enquanto o item 5
era verificado, e o commit do item 5 saiu sem ela. Ela entra no commit seguinte: no capítulo, a
segunda frase da correção B foi trocada pelo texto novo, verbatim ("... recusado pelos
profissionais, ou quando não há profissional ao alcance. Acima de Dificuldade 20 nunca há: nenhum
mortal passa esses testes, e a tabela de Serviços para no Mestre de ofício (soma 12)."), seguida do
exemplo verbatim, com "Por exemplo:" na frente: "consertar a ponte da aldeia isolada, a dias de
qualquer carpinteiro: bolsa, e não Serviços". A primeira frase da correção B ficou como estava. Os
rótulos dos exemplos de perícia continuam valendo com a frase nova (sigilo, alvo que se esconde,
ilegal), e nenhum número mudou.

**Commit da emenda B:** `03149413`.

**CI do item 5:** `d2237ae2`, Validar
[37048010428](https://github.com/f-neves/centelha-rpg/actions/runs/37048010428) 19 de 19 e Deploy
[37048010789](https://github.com/f-neves/centelha-rpg/actions/runs/37048010789) 2 de 2; `03149413`,
Validar [37048406249](https://github.com/f-neves/centelha-rpg/actions/runs/37048406249) 19 de 19 e
Deploy [37048406143](https://github.com/f-neves/centelha-rpg/actions/runs/37048406143) 2 de 2. Todos
na primeira volta.

## Item 5b · Correção D com uma redação só, e Dif 5 e 20 pela régua (`5e192070`)

### 1. Correção D com uma redação só nos três lugares

O reforço do autor (os três lugares dizem a mesma coisa, do mesmo jeito) chegou depois do commit do
item 5, e as três redações tinham ficado diferentes. Uma frase só, agora igual nos três:

> Os desafios 0 a 3 da tabela de valor não são provisórios: vêm da escada de capacidade, e não da
> bancada. Do desafio 4 em diante a tabela é provisória até a G73. O desafio de cada criatura segue
> provisório até a B14.

| lugar | antes (item 5, `d2237ae2`) | agora |
|---|---|---|
| capítulo (`custo-servicos.md`, "Trabalho de confronto") | "Os valores dos desafios 0 a 3 vêm da escada de capacidade. **Do desafio 4 em diante a tabela é provisória**: o topo depende de existir onde gastar tanto dinheiro, e isso ainda está por decidir. [...] O desafio de cada criatura também é provisório, até a bancada medir." | a frase, seguida de "O topo da tabela depende de existir onde gastar tanto dinheiro." (o motivo do item 7) e "A tabela vai até o desafio 9: acima disso não há valor." |
| calculadora (aviso do topo) | "[a tabela] é **provisória do desafio 4 em diante**" | a frase, em negrito (os números 3 e 4 saem de `provisorio_desde`, e o texto renderizado é o mesmo); o recibo do topo diz "O valor do desafio N é provisório. Do desafio 4 em diante a tabela é provisória até a G73." |
| `_nota` do `recompensas.json` (via `copiar-economia.mjs`, regerado) | "Os desafios 0 a 3 vêm da escada de capacidade; do `provisorio_desde` em diante a tabela é provisória, e ela vai só até o desafio 9." | a frase, seguida de "O 4 é o `provisorio_desde`. A tabela vai só até o desafio 9." |

### 2. Dif 5 e Dif 20 pela régua

Dif 5 = arred(7 × 1,8 = 12,6) = **13**, e Dif 20 = arred(35 × 1,8 = 63) = **65**, no lugar dos 10 e
60 do pedido e da resposta 1. O modelo agora calcula os três degraus de mortal pela mesma conta,
arred(Livre do perfil × 1,8), lendo o Livre da tabela de perfis (`T_PERFIL`: Braçal 7, Oficial 12,
Mestre 35); o Dif 10 continua dando 20 (21,6 pela régua) e o Dif 15 continua sendo o desafio 0 (40).
O Dif 20 **deixou de ser** o meio degrau 0,5: na tabela de perícia do capítulo a coluna 20 traz
"·" em Desafio e 65 em Valor, e a calculadora não diz mais "desafio 0,5" para ele. O piso passou a
13 ("Abaixo de Dificuldade 5, paga 13.").

**As contas refeitas, à mão:**
- Espião (Dif 20, 2 semanas, com prova ×1,5, 1 pessoa): 65 × 2 × 1,5 × 1 × 1 = 195. **Pela régua
  (passo 10 entre 100 e 999, meio para cima), a bolsa é 200.** O despacho escreve 195, que é a
  conta antes de arredondar; a régua é a decisão do autor do item 5 (worgs 3.600, torre 7.300), e
  o capítulo mostra "= 195, arredondada: **200 pc**", como mostra nos worgs e na torre.
- Nobre (Dif 20, 1 semana, ×2, risco alto ×1,5, 2 pessoas): 65 × 1 × 2 × 1,5 × 2 = **390** (já
  múltiplo de 10).
- Dif 7, entre 5 (13) e 10 (20), a 2/5: 13 × (20/13)^0,4; ln(20/13) = 0,4308, × 0,4 = 0,1723,
  e^0,1723 = 1,1880, × 13 = 15,44; abaixo de 20 a régua é o inteiro: **15**.
- Dif 12, entre 10 (20) e 15 (40), a 2/5: 20 × 2^0,4 = 20 × 1,3195 = 26,39; passo 5: **25**.
- Dif 17, entre 15 (40) e 20 (65), a 2/5: 40 × 1,625^0,4; ln 1,625 = 0,4855, × 0,4 = 0,1942,
  e^0,1942 = 1,2143, × 40 = 48,57; passo 5: **50**.

O teste confere todos esses pela mesma fórmula (33 asserções), e também que Dif 5, 10 e 20 são
arred(7, 12 e 35 × 1,8).

**O que mais dependia de Dif 20 = 60:** só os dois exemplos de Dif 20 (espião e nobre), os casos
interpolados vizinhos (Dif 16 a 19) e o piso. Procurado no capítulo, na calculadora, na lib, no
modelo, no gerador e no teste: nada mais usava 60 nem "desafio 0,5" para a perícia. A torre (Dif
25, desafio 3) e os exemplos de Dif 15 (40) não mudam. Fica registrado que a seção "Dois números do
autor que a régua não dá", do item 5, foi substituída por esta.

**Verificação** (sobre `5e192070`): `test-recompensa` 33 asserções verdes; `npm run validate`
verde ("Portões OK"); `npx astro sync && npx tsc --noEmit` sem erro; `npm run build` verde. A frase
da correção D, contada no texto sem marcação: 1 vez em `dist/regras/custo-servicos/index.html`, 1
vez em `dist/recompensa/index.html` e 1 vez na `_nota` de `src/data/recompensas.json`. No capítulo
gerado: "Abaixo de Dificuldade 5, paga 13.", "= 195, arredondada: 200 pc" e "= 390 pc" (1 vez
cada); "paga 10", "= 180 pc" e "= 360 pc" (0); a tabela de perícia lida célula a célula: Desafio
·, ·, 0, ·, 1, 2, 3, 4, 5, 6 e Valor 13, 20, 40, 65, 95, 270, 910, 3.600, 14.500, 57.900. Zero
travessão nos 7 arquivos tocados (contado em Python, no arquivo).
