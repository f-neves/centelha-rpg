# Inventário de cálculos e simulações existentes

Levantamento só de leitura, despachado em `docs/simulacao/caixa/inventario-calculos-despacho.md`,
para embasar a calibração das Proezas. Nada aqui foi editado: código, dados e documentos ficaram
como estavam. Datas de commit por `git log -1 --format=%ad --date=short`, sempre na worktree
`rpg-system` (branch `main`) salvo indicação contrária.

As três âncoras usadas para classificar ATUAL/DESATUALIZADO/INDETERMINADO:

- **3N nas Proezas**: `B(N)=3N` (3/6/9/12/15/18), decidido em 26/09/2026
  (`docs/export/proezas/chatgpt/centelha/01-regua.md:38`), substituindo a régua anterior 3/5/8/10/13/15.
- **Grupo de referência 4**: aplicado em 26/09/2026 na fórmula de recompensa (B14 fase 2), mas o
  campo `desafio` continua vazio nas 309 fichas do bestiário; a calibração em si (desafio X = grupo
  de 4 personagens de Centelha X) é uma DEFINIÇÃO ainda não testada em simulação.
- **+1 vs +2 por ponto de Centelha (D7, aberta)**: `centelha.md:44` e `:65` dizem +1; a nota de
  `regras.json:113` (`escalasProeza.nota`) diz +2. Os CAMPOS numéricos usados pelo motor
  (`regras.json:799,807,817,823` = `centelhaMult: 1`) valem +1. Isto é relatado como fato, sem
  tomar partido: a nota em prosa dentro do próprio `regras.json` já diverge do número que o mesmo
  arquivo carrega.

## 1. Motores de combate

| Achado | Tipo | Último commit | O que calcula (entradas → saídas) | Classificação | Roda hoje | Bancada? |
|---|---|---|---|---|---|---|
| `src/lib/calc.ts` | TS, puro | 2026-09-22 | Todos os traços derivados (pool, defesas, energia, mana, soak, XP) a partir de `Atributos/Perícias/Virtudes/Centelha`, lendo os números de `src/data/regras.json` (nenhum valor hardcoded). Contém `ataqueCentelha()` (`centelhaMult`), `defesa()`, `defesaMental()`, `defesaSocial()`, `soakNatural()` etc. | ATUAL por construção: como lê `regras.json` direto, segue o valor vigente ali (`centelhaMult: 1`) automaticamente. Não decide sozinho a D7, só reflete o que o JSON tem hoje. | Sim, é importado ao vivo pelos scripts de simulação (não é um script em si). | Sim, é a base: qualquer bancada nova deveria empacotar `calc.ts`, não recopiar fórmula. |
| `src/lib/lance.ts` | TS, puro | 2026-09-05 | Resolução de um golpe: `resolverGolpe` (Margem, dano, tipo, Absorção) e `declararNoTabuleiro` (interpretação da declaração). Recebe objeto, não lê DOM (padrão "Ações recebem objeto" do CLAUDE.md). | ATUAL (não hardcoda números fora de `regras.json`/`armas.json`/`armaduras.json`). | Não é script standalone; roda dentro dos testes (`test-lance.mjs`) e do motor headless. | Sim, é peça central de qualquer simulador de golpe a golpe. |
| `src/lib/combate-tempo.ts` | TS, puro | 2026-09-15 | Agenda de Ticks do combate Simultâneo: fases (passo/declaração/retrato/resolução/fim), `avancarTickSimultaneo` na mesa. 1242 linhas, é o maior arquivo de regra de combate do repositório. | ATUAL (é a fonte viva usada pela mesa hoje). | Não roda isolado; testado por `test-combate-tempo.mjs`, `test-simultaneo.mjs`, `test-grid-simultaneo.mjs`. | Sim com ajustes: é puro mas pesado para reusar fora do motor headless já feito (ver linha seguinte). |
| `src/lib/rolagem.ts` | TS, puro | 2026-09-22 | Interpretação de pool/rolagem manual/flat, incluindo `flatDeExpr` (bug de dobra do B14 corrigido em `888a196`, ver `docs/pendencias/B-bestiario.md:105-108`). | ATUAL (bug já corrigido, com asserção em `test-rolada-manual.mjs`). | Não é standalone. | Não é bancada em si, é suporte de interpretação de string, não de cálculo de alavanca. |
| `src/lib/quase-acerto.ts` | TS, puro | 2026-08-24 | Tabela de Quase-Acerto por CLASSE de arma (dano ao "quase" acertar), lida de `regras.json` (substituiu campos por-arma/por-armadura, `096db36`). | INDETERMINADO quanto à régua nova de Proezas: não referencia Centelha nem N, então 3N não se aplica a ele diretamente; não achei decisão recente que o mexa. | Não é standalone. | Sim com ajustes, é insumo de `sim-caps.mjs`/`sim-duelo.mjs`. |
| `src/lib/forca-empurrao.ts` | TS, puro | 2026-09-17 | Física de empurrão/arremesso (a "Tabela de forças", FAH = 3×Força + Halterofilismo). Não usa Centelha nem N de Proeza. | ATUAL para o que calcula, mas fora do escopo direto da calibração de Proezas (não há alavanca de Proeza nele). | Não é standalone. | Não, escopo diferente (física de empurrão, não poder de combate por Proeza). |
| `src/lib/ficha-engine.ts` | TS, motor de UI | 2026-09-26 | Monta a ficha inteira no cliente: aplica `RENOMES`, calcula os mesmos derivados de `calc.ts` para exibição, aplica Proezas/Técnicas escolhidas. 2928 linhas. | ATUAL (é o motor de produção, mais recente dos arquivos de `src/lib` citados aqui). | Não roda fora do navegador (não é script Node). | Sim com ajustes: é a fonte de verdade de COMO uma Proeza é aplicada na ficha, mas está fundido com DOM/UI, não é chamável isolado. |
| `scripts/sim/motor.mjs` | JS, headless | 2026-09-23 | O laço de Tick da mesa, copiado (não reimplementado) para rodar sem navegador: `batalha(L, cena, log, opts)` até 2000 Ticks. Usa as peças puras de `src/lib` (`combate-tempo.ts`, `hex.ts`, `lance.ts`) empacotadas via `sim/lib-ponte.mjs`. | ATUAL: é a peça central da bancada `npm run bateria`/`npm run espelho`, com histórico de 6.000 batalhas comparadas contra a mesa real (ver comentário do arquivo). | Sim, mas com saída (roda uma bateria inteira); não testei disparo completo aqui por ser pesado — ver `scripts/sim/rodar.mjs`/`bateria.mjs` para uso, e `npm run espelho` já é validado pelo próprio portão do repositório. | **Sim, é a base recomendada** (ver Recomendação final). |
| `scripts/sim/espelho.mjs` | JS, headless | 2026-09-03 | Roda uma cena pelo `motor.mjs` e devolve o retrato no MESMO formato que `window.__DESPEJO`/`window.__LANCES` da mesa real, para comparação campo a campo (`scripts/test-espelho.mjs`, que é o portão `npm run espelho`). | ATUAL, é o mecanismo de prova de que `motor.mjs` == mesa real. | Sim (é o portão do repositório, roda a cada avaliação chamada). | Sim, é o que garante que qualquer simulação em massa feita com `motor.mjs` vale como "a mesa de verdade". |
| `scripts/sim/agregar.mjs` | JS, headless | 2026-09-06 | 56K, o maior arquivo da pasta `sim/`: agrega os resultados de uma bateria (médias, percentis, classes de parada R2 §B). | ATUAL (parte do harness ainda em uso). | Não rodado aqui (depende de uma bateria já executada; não tem sentido rodar sem uma). | Sim, é a camada de leitura de resultado da bancada recomendada. |
| `scripts/sim/bateria.mjs`, `cena.mjs`, `invariantes.mjs`, `sinais.mjs`, `custo-tela.mjs`, `elenco.mjs`, `log.mjs`, `lib-ponte.mjs`, `rodar.mjs` | JS, headless | 2026-09-02 a 2026-09-06 | Suporte do harness: monta cenas, roda lote de batalhas, checa invariantes (ex.: PV não pode ficar negativo além do limite da morte), empacota `src/lib` puro para o Node (`lib-ponte.mjs`). | ATUAL, é o mesmo pacote descrito acima. | Não rodei individualmente (fazem sentido só dentro de uma bateria; `custo-tela.mjs`/`sinais.mjs` implicam contagem de "paradas" que exige um humano simulado, não é puramente determinístico). | Sim, junto com `motor.mjs`/`espelho.mjs`/`agregar.mjs`. |
| `src/lib/hex.ts` | TS, puro | não medido à parte | Geometria hexagonal usada pelo motor (distância, vizinhança). Citado pelo comentário de `motor.mjs` como peça compartilhada. | ATUAL (é geometria, não depende de régua de Proeza). | N/A | Sim, é peça de suporte, não de alavanca em si. |

**Duplicata sinalizada**: `calc.ts` é citado tanto diretamente por `ficha-engine.ts` (produção) quanto empacotado por `sim/lib-ponte.mjs` para os scripts headless. É a MESMA fonte, relatada duas vezes porque aparece nas duas frentes (produção e bancada), não dois cálculos diferentes.

## 2. Probabilidade de dados

| Achado | Tipo | Último commit | O que calcula | Classificação | Roda hoje | Bancada? |
|---|---|---|---|---|---|---|
| `src/lib/acaso.ts` | TS, puro | 2026-09-02 | Fonte única de aleatoriedade (`Acaso = () => number`), com `semear()` para tornar uma cena repetível. Existe especificamente para o espelho de motor poder comparar duas execuções sem ruído de RNG. | ATUAL. | N/A (é infraestrutura, não script). | Sim, é o que torna qualquer bateria reprodutível. |
| `src/pages/mestre.astro` (funções `distN`/`totais`/`pGE`/`pSucesso`/`alvo`, linhas 7-40) | Astro/TS, calculado em build | 2026-09-20 | Distribuição EXATA (por convolução, não amostragem) de `[(Atributo+Habilidade)÷2]d6 + flat`; tabelas de "qual Dificuldade dá 80/50/25% de sucesso" e a régua Fácil ×4/3 · Média ×5/3 · Difícil ×2 · sucesso = total > Dificuldade. Lê `regras.json` para os parâmetros. | ATUAL (é a página pública de referência do Mestre, mecânica travada conforme a memória do projeto). | Sim, calculado a cada build do site (não precisa rodar à parte; conferi lendo o código, não precisei buildar). | Sim, é a tabela de probabilidade base; não modela Especialidade (dados extras descartando os menores) nem Firula ainda. |
| `scripts/sim-soak.mjs` (função `nd6`) | JS | 2026-07-19 | Distribuição de N d6 por convolução + valor esperado de `max(0, dado+soma)`, usado para comparar Soak ATUAL vs PROPOSTA. | ATUAL como método (convolução exata, mesmo princípio de `mestre.astro`), mas o script em si compara uma REGRA de Soak específica, não é genérico. | Sim, rodei junto com os outros (ver seção 3), sem efeito colateral. | Sim com ajustes: a função `nd6` é reaproveitável para qualquer pool, mas o resto do arquivo é sobre a Soak, não sobre Proeza. |
| Especialidade (dados extras descartando os menores) e Firula | busca dedicada | | Não achei um SCRIPT ou TABELA dedicado a essas duas mecânicas especificamente (a Especialidade aparece como bônus situacional em `calc.ts`/`regras.json`, `especialidadeNota`, mas não há simulação isolada da distribuição "role N extra, descarte os menores"). | INDETERMINADO / lacuna. | Não aplicável. | **Não existe hoje** — é a lacuna mais concreta desta seção. |

## 3. Análises de balanceamento

Todos os scripts abaixo ficam em `scripts/sim-*.mjs` (fora da pasta `scripts/sim/`, que é o harness
de Tick a Tick da seção 1). Os marcados "rodei" foram executados agora, sem escrever nada em disco
(só imprimem no terminal); os demais foram lidos, não rodados, pela razão indicada.

| Script | Último commit | O que calcula | Classificação | Rodei? | Resultado / motivo de não rodar | Bancada? |
|---|---|---|---|---|---|---|
| `sim-caps.mjs` | 2026-09-22 | Teto de Atributo/Perícia escalado por Centelha; ataque/defesa/duelo entre tiers adjacentes (C1×C2, C2×C3), 5 variantes de regra de Defesa (flat/só-teto × QA atual/QA+Centelha). Importa `calc.ts` ao vivo via `sim/lib-ponte.mjs`. | ATUAL (lê `regras.json`/`armas.json`/`armaduras.json`/`escudos.json` ao vivo). | Sim | Rodou limpo: ΔDefesa C1×C2 = +5, C2×C3 = +1; tabela de win% por variante (ex. C2×C3 variante A: 12/88, variante B: 40/60). | **Sim**, é hoje a bancada mais próxima de "medir uma alavanca entre tiers de Centelha", mas mede TETO de Atributo, não Proeza/Técnica em si. |
| `sim-defesas.mjs` | 2026-09-22 | Compara "Centelha só na defesa" vs "Plano B: Centelha também no ataque", E[dano]/golpe com e sem bônus de Centelha, por tier (T1/T2/T3). | ATUAL. | Sim | Rodou limpo; ex. T3 ofensivo: QA 72%, E[dano] atual=1.79 vs +Centelha=5.39. | Sim com ajustes: mede a alavanca "+Centelha", não "+N de Proeza" diretamente, mas o método adaptaria fácil. |
| `sim-duelo.mjs` | 2026-08-05 | Win% arma×arma e o efeito de vestir armadura (pen −1 a −3) no duelo 1×1. | INDETERMINADO quanto à Proeza (não simula Técnica nenhuma), ATUAL quanto a armas/armaduras vigentes. | Sim | Rodou limpo; ex. Placa: 100% de win rate para quem veste vs sem armadura. | Sim com ajustes: é o duelo base sem Proeza; precisaria de um parâmetro de bônus de Técnica somado. |
| `sim-defesa-armas.mjs` | 2026-07-19 | Testa a defesa-da-arma (leve/média +1, haste +2, pesada −2, distância 0) somada ao duelo. | INDETERMINADO/possivelmente DESATUALIZADO: comentário registra a mudança de −1 para −2 nas pesadas; não confirmei se `armas.json` ainda usa esses números (não abri o JSON linha a linha neste levantamento). | Não rodei (não confirmei ausência de efeito colateral a tempo). | "não rodado, risco não descartado" | Não avaliado. |
| `sim-absorcao.mjs` | 2026-07-19 | Dano médio (determinístico, usa média dos dados) de cada arma contra cada armadura, para calibrar se a Absorção está alta. | INDETERMINADO (não testei se os catálogos de armas/armaduras mudaram desde julho a ponto de invalidar). | Não rodei. | "não rodado, risco não descartado — script é antigo (jul/2026) e o repositório mudou bastante desde então" | Não avaliado sem rodar. |
| `sim-pressao.mjs` | não medido à parte (script pequeno, 157 linhas) | Penalidade de Guarda acumulada por ataque feito/recebido, sem teto. | INDETERMINADO. | Não rodei. | "não rodado, risco não descartado" | Não avaliado. |
| `sim-passo-golpe.mjs` | não medido à parte | Se dá para andar no mesmo Tick em que se recebe um golpe (mecânica do combate Simultâneo). | ATUAL supostamente (é do mesmo lote de 22/09), mas não testei a fundo. | Não rodei. | "não rodado, risco não descartado" | Não avaliado. |
| `sim-ticks.mjs` | não medido à parte | Banco de provas em lote da revisão da linha do tempo; usa o MESMO motor de `lib-tempo.mjs` da bancada interativa. | ATUAL provavelmente (usa o motor vivo). | Não rodei (488 linhas, prefiro não rodar sem tempo de ler por completo). | "não rodado, risco não descartado" | Sim com ajustes, é teste de regressão mais que bancada de calibração. |
| `sim-morte.mjs` | não medido à parte | Quanto tempo um personagem caído (PV ≤ 0) tem antes de morrer, por limite (`M-21`). Usa `combate`/`maxDuelista`/`pvMax`/`golpe` de `sim-grupo.mjs`. | ATUAL (decisão M-21 já fechada, ver Pendencias.md). | Não rodei. | "não rodado, risco não descartado" | Não é bancada de Proeza, é de sobrevivência pós-queda. |
| `sim-folego.mjs` | não medido à parte | Calibragem do Fôlego v2 (Centelha D6), lê `regras.json.derivados.folego` ao vivo. | ATUAL (lê regras.json ao vivo; ver também `docs/simulacao/caixa/folego-revisora.md`, veredito PROCEDE recente). | Não rodei (fora do escopo direto de Proeza). | não avaliado por escopo | Não, escopo diferente (recurso de resistência, não poder ofensivo). |
| `sim-grupo.mjs` | não medido à parte | **Achado central para a D-4:** modela um GRUPO DE 3 (não 4) enfrentando um chefe de Centelha+1, ambos maximizados. O comentário do próprio arquivo diz "um GRUPO de 3". | **DESATUALIZADO** frente à decisão de 26/09/2026 (grupo de referência passou a ser 4). Ele é anterior a essa decisão. | Não rodei (quis registrar a divergência de premissa antes de gastar uma rodada). | "não rodado, risco não descartado, e resultado seria sobre a premissa velha" | **Não como está**; precisa reescrever N=3→4 antes de servir de bancada para a calibração nova do bestiário/Proezas. |
| `sim-horda.mjs` | não medido à parte | Regra de Horda: Magnitude M = floor(log2(membros)), um ataque por esquadrão. | ATUAL provavelmente (decisões travadas citadas no próprio comentário). | Não rodei. | "não rodado, risco não descartado" | Não é bancada de Proeza. |
| `scripts/cost-examples.mjs` | não medido à parte | Confere as 4 fichas-exemplo do capítulo de criação contra a régua de XP viva (empacota `calc.ts`, não reimplementa). Corrigido recentemente (era um "conferidor quebrado em silêncio", ver comentário do arquivo). | ATUAL, e é um bom exemplo de "não duplicar a régua". | Não rodei (não é sobre poder de combate, é sobre custo de XP; fora do escopo direto desta rodada, mas relevante para "curva de progressão" do item 3 do despacho). | não avaliado por escopo | Sim com ajustes, é o modelo a copiar para qualquer novo conferidor de Proeza (empacotar `calc.ts`, nunca recopiar fórmula). |
| `scripts/precos.mjs`, `scripts/dano-por-tipo.mjs` | não medidos | Aparentam ser utilitários de catálogo (preço de item, dano por tipo de arma), não simulação de combate. | Não classificado (fora do escopo desta rodada; citados aqui só para registrar que existem e não foram abertos). | Não rodei / não li a fundo | não avaliado | Não avaliado. |

## 4. Calibração do bestiário (B14 fase 2)

| Achado | Tipo | Último commit | O que registra | Classificação | Bancada? |
|---|---|---|---|---|---|
| `docs/pendencias/B-bestiario.md` (item B14) | markdown | 2026-09-26 | A DEFINIÇÃO do autor (26/09/2026): "nível de desafio X é feito para um grupo de 4 personagens de Centelha X, com habilidades variadas, passarem dificuldade para vencer, gastando recursos e se ferindo. É absoluto, não relativo ao grupo que joga." Escala de desafio proposta: 1-12 (hoje 1-6, campo `ameaca` em `src/data/inimigos.json`); Centelha da criatura 0-12 (hoje 0-10). | **INDETERMINADO/pendência aberta**: é uma DEFINIÇÃO aprovada para decidir, ainda sem bancada que a teste. Não é um cálculo existente, é um alvo a calcular. | **Não é bancada, É O ALVO** que uma bancada precisa servir. |
| `docs/simulacao/caixa/b14-fase2-despacho.md` / `b14-fase2-executora.md` / `b14-fase2-revisora.md` | markdown | 2026-09-26 | O que a fase 2 de fato mudou: schema de `desafio` (campo novo, vazio nas 309 fichas), grupo 3→4 na fórmula de RECOMPENSA (`lore/economia/v2/modelo.py`, `CalculadoraRecompensa.astro`, `recompensas.json`), correções pontuais (Defesa Social Int 1, Centelha 0 em 3 fichas, Incorpóreos, Orc, Vontade em combate, locomoção em 83 fichas, poderes em 93 fichas). | ATUAL quanto ao que foi de fato aplicado (grupo=4 na recompensa); mas o campo `desafio` continua **vazio em todas as 309 criaturas** — a calibração de combate propriamente dita (a definição acima) não foi feita ainda. | O SCHEMA está pronto para receber o resultado de uma bancada futura, mas a bancada em si não existe. |
| `lore/economia/v2/modelo.py:447` (`REC_FATOR`) | Python | não medido à parte | Fator da recompensa de caça, hoje calibrado para desafio 1-6; o autor projeta cair de 1,75 para ~1,32 se a escala de desafio for esticada para 1-12 cobrindo o mesmo perigo em passos menores. | INDETERMINADO (é uma projeção do autor, não uma medição feita). | Não é bancada de combate, é parâmetro econômico dependente do resultado da calibração de desafio. |
| `sim-grupo.mjs` | ver seção 3 | 2026-09-22 (código anterior à decisão) | Já modela "N personagens vs 1 chefe de Centelha+1", que é estruturalmente o formato certo para testar a definição de B14, mas com N=3 fixo no comentário e (supostamente) no código. | DESATUALIZADO frente ao grupo de referência 4. | **Candidato mais próximo** a virar a bancada de calibração do bestiário, trocando N=3→4 e adaptando "chefe C+1" para "desafio X = grupo C=X". |

## 5. Documentos de intenção de design com número

| Achado | Tipo | Último commit | Número registrado | Classificação | Bancada? |
|---|---|---|---|---|---|
| `docs/export/proezas/chatgpt/centelha/01-regua.md:38` | markdown | não medido à parte (export recente, sessão de 26/09) | `B(N)=3N`: 3/6/9/12/15/18, substitui 3/5/8/10/13/15. | Esta É a decisão vigente mais recente (26/09/2026); é a âncora, não algo a comparar contra ela mesma. | Documento de intenção, não script. |
| `docs/export/proezas/chatgpt/centelha/05-decisoes-da-regua.md` | markdown | idem | Tabela de opções descartadas/aprovadas (P1 candidato do autor "3N" = 3,6,9,12,15,18; menções a "3N chegaria a 63/18" em cadeias somadas). | Registro de decisão, não cálculo isolado. | Documento de intenção. |
| `src/data/regras.json:113-135` (`escalasProeza`) | JSON, dado vivo | não medido à parte | A nota em prosa (`escalasProeza.nota`) fala em "+2/ponto de Centelha [que] já pesa em ataque e nas 4 defesas", mas os valores de `escalasProeza.trilhas.bonus.valores` são `["+3","+4","+6","+9","+12","+15"]`, que **não é a progressão 3N (3/6/9/12/15/18)** decidida em 26/09. | **DESATUALIZADO**: nem a nota (que fala em +2, contradizendo o campo `centelhaMult: 1` usado pelo motor) nem a tabela de valores (que ainda não é 3/6/9/12/15/18) refletem as decisões mais recentes. | É DADO, não bancada, mas é o primeiro lugar que precisa ser corrigido se/quando 3N for confirmado como vigente. |
| `docs/pendencias/D-proezas-tecnicas.md` (D7, D8) | markdown | 2026-09-26 | D7: +1 vs +2 por Centelha, aberta. D8: Mãos Hábeis +3 vs +2 em Ofícios, mesmo padrão (doc na régua velha vs Técnica na régua nova). | Pendências abertas, registradas como tal (não decididas). | Documento de intenção, aponta discrepâncias a decidir. |
| `Proezas_revisao.md` (raiz, 709 linhas) | markdown | não medido à parte | Reenquadramento de Caminhos como arquétipos, níveis 1-5 (ver memória do projeto: "banda morreu"), com valores da régua ANTERIOR a 3N. | **DESATUALIZADO** frente à sessão de 26/09 (a régua mudou de 5 para 6 níveis e de 3/5/8/10/13/15 para 3N, conforme `01-regua.md`). | Documento de intenção histórico, útil para entender a evolução, não para tirar número vigente. |
| `docs/export/proezas/centelha-dossie.md` | markdown | não medido à parte | Dossiê consolidado, não aberto linha a linha neste levantamento (fora do tempo desta rodada); listado para registro. | Não classificado. | Não avaliado. |
| `centelha.md:44,65` | markdown (conteúdo do livro) | não medido à parte | "+1 por ponto de Centelha" no ataque e nas Defesas. | Um dos dois lados da D7 (ver âncora no topo). | Documento de intenção/regra publicada, não script. |

## Recomendação final

**A base técnica do simulador de calibração de Proezas deveria ser o pacote `scripts/sim/motor.mjs`
+ `espelho.mjs` + `bateria.mjs` + `agregar.mjs`, com `sim-caps.mjs`/`sim-grupo.mjs` como referência
de como ligar cenários de tier de Centelha a ele.**

Por quê:
- É o único motor headless que roda o MESMO laço da mesa de verdade (não uma reimplementação
  paralela), com um portão (`npm run espelho`) que já provou essa equivalência em 6.000 batalhas.
- Já empacota `calc.ts` (a fonte viva de fórmulas) via `sim/lib-ponte.mjs`, então qualquer mudança
  de regra em `regras.json` chega à bancada sem reescrever nada.
- `sim-caps.mjs` já demonstra o padrão certo de cenário "tier de Centelha contra tier adjacente,
  maximizado", que é estruturalmente o mesmo formato da definição de desafio do bestiário (B14).

O que falta nela, especificamente para calibrar Proezas:
1. **Nenhum script hoje aplica um bônus de Técnica/Proeza (3N ou qualquer outro) num duelo
   simulado.** `sim-caps.mjs` e `sim-defesas.mjs` testam alavancas de Centelha "nua" (teto de
   Atributo, bônus de Centelha no ataque/defesa), não de Proeza. É o buraco mais direto: adaptar um
   desses dois scripts (ou escrever um cenário novo sobre `sim/motor.mjs`) para somar um bônus `3N`
   a um dos lados do duelo e medir o deslocamento de win%/E[dano] é o próximo passo natural.
2. **`sim-grupo.mjs` está fixado em grupo de 3**, e a definição de calibração do bestiário (B14)
   pede grupo de 4. Ele precisa ser ajustado (N=3→4) antes de servir de bancada para a calibração de
   desafio X = grupo 4 de Centelha X.
3. **`regras.json.escalasProeza` está desatualizado em dois sentidos**: a nota fala em +2/Centelha
   (o motor usa +1) e os valores de bônus (`+3/+4/+6/+9/+12/+15`) não são a progressão 3N aprovada
   em 26/09. Qualquer bancada que leia `escalasProeza` ao vivo (como `calc.ts` faz com o resto)
   herdaria esse número desatualizado até o dado ser corrigido.
4. **Especialidade (dados extras descartando os menores) e Firula não têm modelo de probabilidade
   isolado** nesta busca. Se a calibração de Proeza depender de saber quanto essas duas mecânicas
   valem em pontos percentuais, falta esse pedaço.

Não decidi qual documento "vence" nas divergências acima (D7, valores de `escalasProeza`,
grupo 3 vs 4 em `sim-grupo.mjs`): isso é escolha do autor, relatado aqui só como achado.
