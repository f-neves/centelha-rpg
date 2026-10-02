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
