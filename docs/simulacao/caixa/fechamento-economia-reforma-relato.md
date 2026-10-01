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

**CI do adendo `ed3ebadd`:** ver o fim do item 2 (estava em andamento quando a Executora-4 nasceu).

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
