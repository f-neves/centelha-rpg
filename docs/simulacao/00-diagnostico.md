# Diagnóstico · o combate que existe hoje, visto por quem quer rodar 1000 batalhas

Levantado em 2026-09-02 sobre o commit `cc5283c`. Toda afirmação traz caminho e linha; onde
não há evidência está escrito **NÃO ENCONTREI** e onde se procurou. Linhas citadas em
`grid.astro` e `combate-tempo.ts` valem para o estado deste commit (os dois foram editados hoje).

Fontes além do código: `Combate_Tempo.md`, `Golpe_Tardio.md`, `Combate_Simultaneo.md`,
`Grid_Automacao.md`, `Auditoria_Tecnica.md`, `Pendencias.md` (frente K), `Combate_Referencias.md`,
`combate-tempo-bench.html` (gerado de `scripts/lib-tempo.mjs` por `scripts/gen-bench-tempo.mjs`)
e `simulador-batalha.html`. São documentos de trabalho: valem como registro de decisão e de
medição, não como regra publicada. A regra publicada, para a seção 7, são os capítulos em
`src/content/chapters/`.

---

## 1. Mapa do motor de combate

**Veredito em uma frase: (b) possível após extração.** A aritmética do combate está em módulos
puros que já rodam em Node; a *resolução* de um golpe (quem rola, quem confirma, quem aplica) e o
*laço* de Ticks moram dentro de `src/pages/mesa/grid.astro`, presos a um modal, ao Supabase e ao
DOM. O que está acoplado está listado no fim desta seção.

### 1.1 Módulos, o que cada um decide, e do que depende

| Módulo | Linhas | Decide | Dependências de interface |
|---|---:|---|---|
| `src/lib/combate-tempo.ts` | 924 | A régua de tempo: classe de arma (L189-201), Preparo (L216-222), anatomia P/G/R com rajada e dupla (L257-307), agenda absoluta (L519-528, L544-547), fase e escada de Defesa (L595-634), abortar (L670-695), contrapé (L457-463), entrada por iniciativa (L355-369), ordem da fila (L399-404), e o simultâneo: passo no Golpe (L765), agenda (L794), re-projeção (L833), previsão de encontro (L862), robô (L880) | Nenhuma. Declara-se puro em L13-16; importa só `regras.json` (L21) e o catálogo `ARMA` (L22). Sem DOM, sem rede, sem timer |
| `src/lib/quase-acerto.ts` | 219 | Margem e raspão (L187-199), classe de QA por dano médio (L93-99), empilhar armaduras (L125-138), `errouPor` e `saidaDoAtaque` (L208-219) | Nenhuma (L16) |
| `src/lib/alcance.ts` | 84 | Faixas de distância e alcance corpo a corpo (L61-84) | Nenhuma (L16-17) |
| `src/lib/rolagem.ts` | 78 | O dado (L11) e a expressão `4d6+2` (L34-43); tipo de dano da expressão (L70-78) | Nenhuma (L7); `Math.random` em L11 |
| `src/lib/calc.ts` | 208 | Derivados: PV por porte (L30-34), Defesas (L37-53), Centelha no ataque (L56-59), Absorção natural e empilhamento (L106-128), gate de Perfuração (L131-135), iniciativa (L138-142), deslocamento (L145-168) | Nenhuma; importa `regras.json` (L3) |
| `src/lib/equip.ts` | 160 | Catálogo de armas, armaduras e escudos com os ajustes por peça (L90-147) | Nenhuma |
| `src/lib/combate-resumo.ts` | 127 | O bloco de combate do PC a partir da ficha: bolo de ataque (L63-72), dano com Força (L74-84), Defesa só Esquiva (L86-87), Absorção (L99-106), QA (L111), passo (L116-123) | Nenhuma |
| `src/lib/mesa-bestiario.ts` | 218 | O bloco de combate da criatura (L93-120) e a mescla com o ajuste por instância `combatentes.dados` (L127-160) | `fetch` da criatura inteira (L176), HTML do card (L188-218), `esc/u/norm` de `mesa-core` (L17). `baseResumo` e `resumoDe` em si não tocam DOM |
| `src/lib/mesa-ficha.ts` | 135 | O resumo da ficha para o mestre (L42-107); iniciativa do PC (L132-135) | `Math.random` em L133 |
| `src/lib/mesa-core.ts` | 565 | Faixas de ferimento (L94-103) e soma de condições (L164-181) | O arquivo também tem helpers de DOM (L90, L112-149); as duas funções citadas são puras |
| `src/lib/hex.ts` | 195 | Distância (L114-117), caminho guloso com veto (L131-152), o ponto além do alvo (L160-161), `dentro` (L164-167) | Nenhuma |
| `src/lib/artes-grid.ts` | 1582 | Geometria das Artes, dano no alvo com fraqueza/resistência/matéria (L1302-1337), `rolar` (L1340-1344), vida do efeito (L1348-1392) | `Math.random` em L1342 |
| `src/lib/artes-grid-mesa.ts` | 1625 | Conjurar (L703-744), as formas (chão L769, alvo L883, dissipar L897, cadeia L937, invocação L973), a saída da área (L1268-1332), a mordida (L1377) e o vencimento (L1441-1528) | `CtxGrid` exige `SB`, `tokens`, `hexNaTela`, `logar`, `repintar` (L34-100); escreve em `arena_efeitos` (L1329, L1502, L1523) e `combatentes` (L1520); abre caixas `uiEscolher`/`uiConfirmar`/`abrirNPC` (L763, L905, L995, L1280, L1482); `palco: HTMLElement` (L703) |
| `src/lib/mesa-tempo-ui.ts` | 484 | Fita, faixa de golpes no ar (L192-215), diálogo de abortar (L272-334), painel de escolha do sistema (L390-484) | HTML e `uiPainel`; grava `mesas.combate` (L475) |
| `src/pages/mesa/grid.astro` | 9266 | **A resolução.** Ataque (L6818-6887), declaração adiada (L6916-7041), golpe no ar (L7056-7110), a folha da ação (L7420-8021), dano e Absorção (L8028-8100), o avanço do Tick simultâneo (L4902-5027), o robô (L5029-5063), o relógio dos outros dois sistemas (L4075-4179), iniciativa (L4743-4798), quem levanta (L4189-4257), deslocamento pago (L5853-5868), ocupação do chão (L5880-5892) | Tudo: `dialog.showModal()` (L7022, L8019, L7372), Supabase em cada gravação (L4908, L7196, L8050, L4786, L4834), `localStorage` (L4279), `requestAnimationFrame` (L2666), `performance.now` (L6444), tempo real (L2670), animação aguardada de projétil (`await voarProjetil`, L6861, L7088), `new Date()` na ordem da fila (L4967, L4059-4064) |
| `src/pages/mesa/combate.astro` | 2172 | A aba Combate: `avancarTick` por peça (L1418-1445), diálogo de ação (L1974-2010), Pressão (L2005), sangramento por rodada (L1439-1443), encerrar encontro (L1476-1484) | DOM e Supabase |
| `scripts/lib-tempo.mjs` | 690 | **O único laço de batalha headless que existe**: `atacar` (L278-375), `cena` (L382-508), baterias (L512-587), duelo a distância em 1-D (L599-689), RNG semeado (L50-61) | Nenhuma (L9-10). Recebe o catálogo pronto; sem mapa; regras próprias em `REGRAS_PADRAO` (L75-124) |
| `scripts/sim-duelo.mjs`, `sim-grupo.mjs`, `sim-horda.mjs`, `playtest-horda.mjs`, `sim-passo-golpe.mjs`, `simulador-batalha.html` | 7,7K a 15K cada | Simuladores avulsos, cada um com a própria tabela de armas e o próprio dado (`sim-duelo.mjs:10, 18-28`; `sim-horda.mjs:16-18`; `simulador-batalha.html:143-171, 181-196`) | Nenhuma (o `.html` é calculadora de distribuição, não Monte Carlo) |

### 1.2 O que está acoplado, e onde

1. **O golpe é resolvido dentro de um modal.** `folhaDaAcao` (`grid.astro:7420-8021`) monta a
   caixa `alvo-dlg`, rola quando a mesa manda (`rolaNoSite`, L7985), e devolve o resultado por uma
   `Promise` que só resolve no clique em `al-sim`/`al-qa`/`al-nao` (L7987-8006). Não existe função
   "resolver um ataque dados atacante, alvo e situação" fora dela. A aritmética que ela usa
   (`defesaPerdida`, `saidaDoAtaque`, `somarCondicoes`, `tierDe`, `rolarExpr`) é pura, mas a
   composição dela (que modificador entra, em que ordem, o que o mestre pode sobrescrever) está
   escrita só ali, misturada ao HTML.
2. **O dano vai direto ao banco.** `aplicarDano` → `baixarVida` → `gravarPeca`/`SB.rpc('jogador_dano')`
   (L8073-8100, L8045-8065). O estado da peça é a linha de `combatentes` (`supabase/migracao-2.sql:128-141`).
3. **O laço de Ticks escreve no banco a cada passo.** `avancarTickSimultaneo` grava
   `encontros.tick_atual` (L4904-4910), o token de cada peça que andou (`gravarToken`, L4970), a
   re-projeção da agenda (L5000-5010) e a ação de quem chegou (L4984-4990), e termina em
   `verificarEfeitos` (L5017), que abre `uiEscolher` quando um efeito pega alguém
   (`artes-grid-mesa.ts:1482-1492`).
4. **A ordem da fila lê um carimbo de relógio.** `naOrdem` usa `TOKENS[c.id].em` como critério de
   estabilidade (L4059-4064), e esse campo é `new Date().toISOString()` gravado no passo (L4967) e
   ao pôr no mapa (L5902).
5. **O robô decide dentro do avanço** (`decidirAutomaticas`, L5029-5063), e para declarar chama
   `declararAtaqueSimultaneo` (L5185-5233), que grava via `gravarRelogio` (L7192-7219).
6. **As Artes resolvem por caixas.** `conjurar` abre `abrirConjuracao` (L707), a saída da área abre
   `uiEscolher` (L1280-1296), o vencimento abre `uiEscolher` (L1482-1492); tudo grava em
   `arena_efeitos`.
7. **O relógio dos sistemas normal e P/G/R não é um laço**: é `min(tick de quem está de pé)`
   (`tickDaVez`, L4075-4082; `relogio`, L4138-4153) e anda quando o mestre resolve uma ação ou
   clica ⏭ (`encerrarVez`, L4830-4846; botão em L8968).

O que já roda em Node sem nada disso: `scripts/test-simultaneo.mjs:21-33` empacota
`combate-tempo.ts` e `hex.ts` com `esbuild` e os importa; o mesmo caminho serve para
`quase-acerto.ts`, `calc.ts`, `combate-resumo.ts`, `equip.ts`, `alcance.ts`, `rolagem.ts` e as
funções puras de `mesa-bestiario.ts` e `mesa-core.ts`.

---

## 2. Modelo temporal

### 2.1 O que é um Tick no código

Um inteiro, e há **dois relógios diferentes** conforme o sistema (`combate-tempo.ts:27`):

- **Normal e P/G/R:** cada peça tem o seu `combatentes.tick` (`migracao-2.sql:136`), que é "em que
  Tick esta peça volta a agir". O relógio da cena é o menor `tick` entre quem está de pé
  (`grid.astro:4075-4082`), travado pelo golpe agendado mais cedo (`relogio`, L4138-4153;
  `golpeMaisCedo`, L4163-4171). Ele não anda sozinho: anda quando uma ação grava `tick = livre`
  (`gravarRelogio`, L7192-7219, chamado por `declararNoTabuleiro` L7176) ou quando o mestre
  empurra à mão (`encerrarVez` L4830-4846, com o custo digitado em `ini-custo`, L4269-4273,
  padrão 5, guardado em `localStorage` L4279). Na aba Combate é `avancarTick(cid, quanto)`
  (`combate.astro:1418-1445`), somado da `velocidade` das condições (L1423).
- **Simultâneo:** um relógio da cena em `encontros.tick_atual` (`migracao-2.sql:124`), copiado em
  `TICK_SIM` (`grid.astro:4092-4096`), incrementado de **um em um** por clique no ⏭
  (`avancarTickSimultaneo`, L4902-4910). O botão fica desligado enquanto há golpe devido
  (L4324-4326; `instanteDeGolpe`, L4174-4179).

Quem avança o relógio é sempre um humano (mestre), exceto: (a) o robô declara *dentro* do avanço,
mas não avança (L5029); (b) `lib-tempo.mjs` avança sozinho, `for (let t = 1; t <= tetoTicks; t++)`
(L391).

### 2.2 Duração das ações

- Declarada em `regras.json`: Preparo por classe em `combate.pgr.preparo` (L2354-2381), Golpe
  sempre 1 e Recuperação o que sobra da Velocidade (`combate-tempo.ts:303-306`); Arte em
  `combate.pgr.arte` (L2382-2389; `reguaDaArte`, `combate-tempo.ts:225-230`); rajada e dupla em
  `combate.rajada`/`combate.dupla` (L2401-2432; `anatomia`, L274-299).
- A Velocidade vem de `armas.json` (`ticks`; `velocidadeDaArma`, `combate-tempo.ts:204-206`) para
  quem tem arma de catálogo, e de `combate.ataques[0].speed` de `monsters-mesa.json` para a
  criatura (`mesa-bestiario.ts:110`). Sem nenhum dos dois, `padrao = 5` (L204).
- O mestre sobrescreve o P/G/R por peça (`comOverride`, L317-330; campo `pgr` em
  `combatentes.dados`, `mesa-bestiario.ts:151`).
- "Outra coisa" tem a duração digitada (`abrirOutra`, `grid.astro:7290-7298`) e a Arte a
  Velocidade da conjuração (`declararTempo`, L8216-8239).

### 2.3 Cancelar e interromper

- **Abortar só no Preparo** (`abortar`, `combate-tempo.ts:670-695`): fica livre em
  `tick + metros × ticksPorMetro` (L685-691), os Ticks investidos são perdidos (`perdidos`, L688)
  e o resto do ciclo é devolvido (`devolvidos`, L692). No Golpe não (L676-677); na Recuperação não
  há o que abortar (L678-680). Na tela: `abrirAbortar` (`mesa-tempo-ui.ts:272-334`) e
  `abortarGesto` (`grid.astro:5241-5256`), só mestre (L6045).
- **Não há Tick parcial.** Toda conta é em inteiros; o único "meio" é a re-projeção que empurra a
  agenda inteira (`reprojetarAgenda`, `combate-tempo.ts:833-851`).
- **Interrupção por golpe alheio (o "espelho" de `combate.foraDeHora`, `regras.json:2456`):**
  implementada só na bancada (`lib-tempo.mjs:343-361`, L415-453). No Grid **NÃO ENCONTREI**: o
  campo `Acao.divida` existe (`combate-tempo.ts:129`) e nenhum lugar de `grid.astro` o escreve
  (busca por `divida`, `interromp`, `reag`: só comentários em L1663 e L7305). `Combate_Tempo.md`
  §15.4 (L1372) registra a ausência.
- **O gesto morre com quem cai:** ao levantar, os golpes no ar são apagados
  (`levantar`, `grid.astro:4238-4249`); o golpe de quem está no chão não trava a cena
  (`golpeMaisCedo`, L4166).
- **Golpe cujo alvo sumiu:** sai da agenda sem cair em ninguém (`resolverGolpeNoAr`, L7059-7065).
  Redirecionar para outro alvo, decidido em `Golpe_Tardio.md` §9 (L243-262, decisão 4), **NÃO
  ENCONTREI** no Grid; existe na bancada (`lib-tempo.mjs:471-482`).

### 2.4 Ordem de resolução quando duas coisas caem no mesmo Tick (simultâneo)

A ordem real, no código:

1. O relógio anda e é gravado (L4903-4910).
2. **Movimento**, peça a peça, na ordem de `naFila()` (L4912): tick crescente, iniciativa
   decrescente, Raciocínio decrescente, depois o carimbo `em` do token, depois o nome
   (`ordemDaFila`, `combate-tempo.ts:399-404`; `naOrdem`, `grid.astro:4059-4064`). Cada passo é
   dado contra a posição **atual** do alvo (L4919), portanto quem anda antes na fila decide onde o
   de trás mira. Duas peças disputando a mesma casa não colidem: a segunda contorna (`caminharHex`
   com veto, L4972-4988). É o item 4 da §3.2 de `Combate_Simultaneo.md`.
3. **Re-projeção** da agenda de quem não chegou (L4991-5011).
4. **Robôs decidem**, na ordem de `naFila()` (L5014, L5029-5063).
5. Repintura e efeitos (L5015-5017).
6. **Golpes que venceram** não resolvem no avanço: ficam na faixa, ordenados por Tick e nome
   (`mesa-tempo-ui.ts:194`), e o **mestre clica um por um**, na ordem que quiser (L4391 →
   `resolverGolpeNoAr`). Cada clique aplica dano na hora (L7107-7109); o segundo golpe do mesmo Tick
   já vê a Vida baixada pelo primeiro. `Golpe_Tardio.md` §9 decisão 7 ("tudo simultâneo, os danos se
   somam, e só depois se vê quem caiu", L243-262) **não é o que o código faz**: é sequencial por
   clique.

Determinismo: dados iguais → ordem igual, exceto pelo carimbo `em` (um `Date` real) que decide
empates de tick, iniciativa e Raciocínio (L4061-4063), e pela ordem dos cliques do mestre.

Na bancada, `lib-tempo.mjs` embaralha quem resolve no mesmo Tick com o RNG semeado (L456-460) e
marca `emGolpe` antes de resolver (L394), para a ordem não decidir quem apanha com a guarda aberta.

---

## 3. Interrupções: tudo o que para e pede decisão humana

Não existe ponto único de entrada. As paradas estão em quatro arquivos e passam por cinco
mecanismos diferentes (`dialog.showModal`, `uiEscolher`, `uiConfirmar`, `uiFormulario`, clique em
botão da faixa/mapa).

| # | Gatilho | Quem responde | Onde | O que decide |
|---|---|---|---|---|
| 1 | Atacar alguém fora do alcance, ou com Preparo > 0 no P/G/R adiado, ou qualquer ataque no simultâneo | dono da peça (mestre ou jogador) | `declararGolpe`, `grid.astro:6916-7023`, `showModal` L7022 | manobra e nº de golpes (L6974-6990); modo e m/Tick do deslocamento (L6948-6972); trajetória automática ou à mão (L6951) |
| 2 | O golpe cai (Tick agendado), ou ataque resolvido na hora | mestre (o jogador vê a caixa sem a coluna do alvo, L7829-7833) | `folhaDaAcao`, L7420-8021, `showModal` L8019 | total rolado (L7959-7966), ajuste avulso e motivo (L7610-7611), acertou / raspou / errou (L8004-8006), dano bruto e tipo (L7612-7613), 21 campos editáveis da ficha do lance (L7718-7745) e quais ficam fixos (L7761-7762) |
| 3 | Escolher o alvo (⚔ do menu) | dono da peça | `iniciarMira` L6709, `escolherAlvo` L6801-6807 | clique no alvo no mapa |
| 4 | Soltar peça em casa vazia, no simultâneo | dono da peça | `moverSimultaneo`, L5114-5183 | modo, m/Tick, automático ou à mão, ou "pôr direto" |
| 5 | Abortar o gesto (Preparo) | mestre | `abrirAbortar`, `mesa-tempo-ui.ts:272-334`; item de menu só para mestre, `grid.astro:6045` | para quê (desviar/mover/interpor) e metros |
| 6 | "Outra coisa" | dono da peça | `abrirOutra`, L7276-7374 | frase, Ticks, quando resolve, bolo, total, Dificuldade |
| 7 | Efeito de Arte pegando alguém, ao vencer um Tick | mestre | `verificarEfeitos`, `artes-grid-mesa.ts:1482-1492` | cobrar um, cobrar todos (`__todos`, L1491) ou fechar (nada, L1495) |
| 8 | Efeito de chão morde alguém | mestre | `oferecerSaida`, L1268-1332 | tentar sair (três bônus), ficar parado por coragem, ou comer inteiro |
| 9 | Conjurar | dono da peça | `abrirConjuracao` L707; alcance excedido `uiConfirmar` L763; dissipar `uiEscolher` L905; invocação `abrirNPC` L995; alvo/cadeia clique no mapa L938 | efeito, nível, parâmetros, onde |
| 10 | Rolar iniciativa | mestre | `rolarIniciativas`, `grid.astro:4743-4752` (`uiConfirmar` L4750) | confirmar |
| 11 | Avançar o Tick (simultâneo) / ⏭ próximo (normal, P/G/R) | mestre | botão `ini-prox`, L8968; desligado com golpe devido, L4324-4326 | quando o mundo anda |
| 12 | Resolver um golpe no ar | mestre | clique no cartão da faixa, L4391 → `resolverGolpeNoAr` L7056 | qual golpe cai primeiro, e a folha (#2) |
| 13 | Curar, tirar Vida, mana, editar ordem | mestre (dano: qualquer um) | `curar` L8102-8110, `tirarVida` L8134, `editarIniciativa` L4800-4818 | números à mão |
| 14 | Ação na aba Combate | mestre | `combate.astro:1974-2010` | tipo (ataque/social/mental/esperar/outra), alvo, Velocidade, dano bruto |

**Resposta automática e delegação que existem:**

- `rolaNoSite` (`combate-tempo.ts:110-111`): no modo `site` a folha já abre rolada
  (`grid.astro:7985`); no `misto`, só as criaturas. O veredito continua sendo clique (L8004-8006).
- O robô por peça (`combatentes.dados.auto`, `alternarAuto` L5065-5077): decide atacar ou fugir no
  avanço (§6). Só no simultâneo e só criatura (L6049-6050).
- Fechar a caixa de saída da área é "come inteiro" (L1298); fechar a de efeitos é "não cobra"
  (L1495); fechar a folha da ação é "desistiu, não gastou Tick" (L8015-8018).
- Levantar do chão é automático, sem pergunta (`conferirChao`, L4207-4216).
- **NÃO ENCONTREI** delegação do jogador para uma política ("jogue por mim"): o único caminho sem
  humano é o robô de criatura.

---

## 4. Aleatoriedade e reprodutibilidade

### 4.1 Fontes de acaso no combate da mesa

| Onde | O quê |
|---|---|
| `src/lib/rolagem.ts:11` | `d6 = 1 + floor(Math.random() * 6)`; usado por `rolarExpr` (L41) e, por ela, pelo acerto e dano da folha (`grid.astro:7961, 7968`), por "Outra coisa" (L7328) e pela iniciativa de criatura (`mesa-bestiario.ts:19, 59`) |
| `src/lib/mesa-ficha.ts:133` | segundo `d6` com `Math.random`, para a iniciativa do PC (L132-135) |
| `src/lib/artes-grid.ts:1342` | `rolar()` das Artes, `Math.random`; usado pela mordida (`artes-grid-mesa.ts:1379`) e pelo teste de saída (L1245) |
| `src/lib/mesa-tempo-real.ts:209`, `src/lib/mesa-core.ts:28` | ids e chave de presença (não afetam regra) |
| `grid.astro:4967, 5902` | `new Date()` gravado no token e usado como desempate da fila (L4063) |

**RNG com semente no motor da mesa: NÃO ENCONTREI.** Busca por `seed|rng|semente` em `src/`:
só os `seed` de `feTurbulence` em `artes-grid-fx.ts:133, 181` (textura SVG).

Com semente existem só fora da mesa: `lib-tempo.mjs:50-61` (xorshift, `criarRng`), usado por
`bateria`/`refrega`/`roundRobin` com `semente = 20260818` (L512, L550, L565) e por
`sim-ticks.mjs --seed` (L9, L33); `sim-horda.mjs:16-18` e `playtest-horda.mjs:6-9` (LCG próprios).
`sim-duelo.mjs:10`, `sim-grupo.mjs:16`, `sim-defesas.mjs:19`, `sim-pressao.mjs:10`,
`sim-caps.mjs:15`: `Math.random`.

### 4.2 O estado de uma batalha

Está espalhado em linhas do banco: `combatentes` (`tick`, `acao` jsonb, `pv_atual`, `condicoes`,
`dados`, `iniciativa`; `migracao-2.sql:128-141`, `migracao-11.sql:25`, `migracao-27.sql:70`),
`arena_tokens` (posição `q,r` e `em`), `encontros.tick_atual`, `arena_efeitos`. Em memória no Grid:
`COMBS`, `TOKENS`, `RESUMO`, `TICK_SIM`, `ATIVOS` (`artes-grid-mesa.ts:102`). **NÃO ENCONTREI**
função que serialize ou restaure o estado completo de uma batalha.

### 4.3 O log

`logar` (`grid.astro:8321-8335`) grava linhas de **prosa** (`txt`, `pub`) com um `inverso`
opcional para o desfazer (`aplicarDano` passa `r.inverso`, L8100; `desfazer`, L8394). Não é um log
de eventos com entradas (semente, escolhas, rolagens): as rolagens entram como texto
(`descreverRolada`, L7963). Na aba Combate, `registrarDesfazer` guarda closures (L1432-1435).
`lib-tempo.mjs` só narra com `narrar: true` (L382-385), e a narração é texto.

### 4.4 A batalha 743 de 1000

Hoje não é reexecutável: (a) o dado da mesa não tem semente; (b) a ordem da fila depende de um
`Date` real; (c) as decisões humanas não são gravadas como dados; (d) não há foto do estado. Na
bancada (`lib-tempo.mjs`) é: mesma semente, mesmas specs, mesmo resultado, mas a bancada não é o
motor da mesa (ver §7, divergências).

---

## 5. Dados de entrada

Tudo é JSON legível por máquina em `src/data/`. O que é **texto** está marcado.

| Fonte | Entradas | Campos que o motor lê | O que está em prosa |
|---|---:|---|---|
| `armas.json` | **26** | `id, nome, classe, pericia, dado, acerto, defesaArma, maos, ticks, tipoDano, pen, modos[{tipo, perf, principal}], tags[], danoBonus, distMax, alcanceLivreFrac, forcaMult, forcaCap` | `notas` |
| `armaduras.json` | **9** | `id, classe, soak{impacto,corte,perfuracao}, resistPerf, penalidade` | `notas` |
| `escudos.json` | **8** | `id, bloqCaC, habilProjetil, penalidade` | `notas` |
| `artes.json` | **24** (8 elementais, 16 universais), 6 níveis cada = 144 níveis | por Arte: `grid{elemento, cor, dadoPorNivel, danoBruto}`; por nível: `custo.mana` | `niveis[].efeito` e `exemplos` (o que a Arte faz é texto; 18 dos 144 níveis citam `Nd6` no texto) |
| `efeitos.json` | **140**, todos com bloco `grid` | `grid{forma, ancora, gatilho, alvo, persiste, materia, condicao, pegaItem, arenaInteira, dissipa, fere, cura, teste}`, `parametros[]` com escalas | `efeito` (a descrição) |
| `condicoes.json` | **55** condições em 6 grupos | `defesa, defesaCaC, defesaDist, acao, ataque, dados, soak, velocidade, porRodada, foraDeCombate` (`mesa-core.ts:152-181`) | `nota`, `fonte` |
| `tecnicas.json` | **461** (50 caminhos; passiva 88, ativa 347, reflexiva 26; níveis 1:146, 2:51, 3:107, 4:56, 5:52, 6:49) | `tipo, custo, nivel, efeito` (etiqueta: estado 370, bonus 61, dano 10, carga 7, penetracao 4, soak 4, salto 2, velocidade 2, tamanho 1) | **`texto`: a mecânica inteira é prosa** (ex.: `passo-veloz`: "custa −2 Ticks (mín. 1)") |
| `monsters-mesa.json` | **309** | `combate{pv, defesa, defesaSocial, defesaMental, absorcao{}, resistenciaPerfuracao, iniciativa (string "1d6 + 6"), deslocamento{batalha,arranque,corrida}, ataques[{nome, pool, dano, speed, classe, notas}]}`, `atributos`, `porte`, `centelha`, `artes[{id,nivel}]`, `tecnicas[]` | `ataques[].notas` (9 de 309) |
| `monsters.json` | 309 (a versão inteira, 920 KB) | o mesmo bloco | `habilidades` (309), `poderes` (93; refs a Artes por nome), `lore`, `descricao` |
| `inimigos.json` | 309 (formato anterior: `pv, defesa, soak, ataques...`) | idem | |
| `deslocamento-bestiario.json`, `dimensoes-bestiario.json`, `elementos-bestiario.json` | satélites do bestiário | passo, porte/medida, fraquezas | procedência |
| `racas.json` | 8 | caps e `deslocamentoFrac` | |
| `regras.json` | blocos | `derivados` (L629), `dano` (L773), `combateTatico` (L861), `porteAcerto` (L933), `bloqueioLimite` (L953), `sangramento` (L968), `quaseAcerto` (L981), `horda` (L1027), `combate` (L2208 em diante), `ferimentos` (L585), `dadoArmaPorPeso` (L548) | as `nota` de cada bloco |

### 5.1 As contagens pedidas

| Categoria | Quantidade | Como foi contado |
|---|---:|---|
| Arma leve (classe de tempo) | 3 | `armas.json`, campo `classe` |
| Arma média | 5 | idem |
| Arma pesada | 2 | idem |
| Arma de haste | 2 | idem |
| Arma à distância (tiro) | 6 | idem |
| Arma de arremesso | 8 | idem |
| Armas com mais de um modo | 10 | `modos.length > 1` |
| Armas com `distMax` | 14 | 6 de tiro + 8 de arremesso |
| Armadura leve / média / pesada | 2 / 3 / 3 (+ "nenhuma") | `armaduras.json` |
| Escudo hábil contra projétil | 5 de 8 | `habilProjetil: true` |
| Magia ofensiva (Efeito com `grid.fere`) | **26** (alvo 11, zona 8, cone 2, movimento 2, muro 1, aura 1, cadeia 1) | `efeitos.json` |
| Magia de cura (`grid.cura`) | **7** (alvo 5, zona 1, nenhuma 1) | idem |
| Efeito de área (forma que ocupa chão: zona 26, muro 2, aura 10, cone 2, linha 1) | **41** | idem |
| Efeito só de teste (`grid.teste`) | 47 | idem |
| Efeito que põe condição | 66 | idem |
| Criatura por porte | Miúdo 24 · Pequeno 27 · Médio 120 · Grande 92 · Enorme 31 · Imenso 10 · Colossal 5 | `monsters-mesa.json`, `porte` |
| Criatura por classe do ataque | leve 159 · média 97 · pesada 48 · distância 1 · haste 1 · arte 3 | `ataques[0].classe` |
| Criatura com mais de um ataque | **zero** (309 de 309 têm exatamente 1) | `ataques.length` |
| Criatura com Artes / Técnicas | 77 / 24 | `artes.length`, `tecnicas.length` |
| Criatura por ameaça | 1:33 · 2:65 · 3:63 · 4:66 · 5:59 · 6:23 | `ameaca` |
| Criatura com armadura vestida | **zero** (o bestiário guarda couro como Absorção; `mesa-bestiario.ts:113-116`, `quase-acerto.ts:148-152`) | |
| Criatura com alcance do ataque | **zero** (as chaves de `ataques[]` são `nome, pool, dano, speed, classe, notas`) | |
| Fichas de PC prontas para a mesa | **1** de teste (`scripts/test-kael.mjs`) e as da bancada (`scripts/mesa-mock.mjs`); em produção, o que houver em `personagens.ficha` no Supabase | `resumoCombatePC` exige o objeto `S` da ficha (`combate-resumo.ts:42`) |

Contradições internas dos dados:

- `regras.json:548` `dadoArmaPorPeso {leve:1, media:2, pesada:3}` diz que a média tem 2 dados e a
  pesada 3; `armas.json` tem 24 armas com 1 dado e 2 com 2 (nenhuma com 3). O próprio
  `quase-acerto.ts:84-88` registra que o catálogo "mudou por baixo" dessa régua.
- `simulador-batalha.html:143-157` e `sim-duelo.mjs:18-28` carregam tabelas de armas com
  `die: 2` para média e `die: 3` para pesada: são os números antigos, não os de `armas.json`.
- `combate.md:96` escreve a régua por classe ("média 1d6, pesada 2d6") em acordo com o catálogo;
  a tabela de `armas-e-armaduras.md:36-41` também. O `regras.json:548` é o que ficou para trás.

---

## 6. IA de NPC existente

Uma só, mínima, e só num dos três sistemas:

- `decisaoAutomatica` (`combate-tempo.ts:880-892`): ataca o inimigo de pé **mais próximo**
  (`reduce` por `distanciaHex`, L887-888); com Vida abaixo de `simultaneo.ia.fugirAbaixoDePct`
  (25, `regras.json:2267-2270`; L889) devolve `fugir` (L890); sem inimigo em cena, `nada` (L886).
- `decidirAutomaticas` (`grid.astro:5029-5063`): só mestre (L5030), só criatura com
  `dados.auto` (L5035), só quem está com o relógio vencido (L5036) e sem golpe no ar nem trajeto
  (L5037). "Inimigo" é quem **não é criatura** (L5033-5034). Fugir vira um destino a 4× o vetor que
  separa, em Corrida, ciclo fixo de 6 Ticks (L5046-5054); atacar chama
  `declararAtaqueSimultaneo(c, alvo, { silencioso: true })` (L5063), que usa manobra `simples`,
  modo `batalha` e trajetória automática por padrão (L5201, L5209, L5220).

O que ela **não** decide (nenhuma linha para isso em `grid.astro` nem em `combate-tempo.ts`):
mudar de alvo no meio da perseguição (o `mov.alvo` fica até chegar, L4984-4990); curar aliado;
escolher alcance, arma ou modo de dano; rajada ou dupla; Corrida contra Batalha; gastar Centelha,
Energia ou Mana; conjurar Artes (os 77 monstros com `artes` não as usam); usar Técnicas; abortar;
desengajar (só a fuga por Vida); parar de perseguir quem é mais rápido (§3.2 item 2 de
`Combate_Simultaneo.md`); respeitar a borda do tabuleiro ao fugir (§3.2 item 5).

Na bancada, `lib-tempo.mjs` tem o "robô ganancioso": alvo de menor Vida (L401, L441, L479),
ação fora de hora por gatilho configurável (L415-453), e o guerreiro que corre em linha reta
(`cenaDistancia`, L610-618). `Combate_Tempo.md:598-616` (§13, item 7): "tudo aqui é simulação com
robô ganancioso: bom para provar que não quebra, inútil para provar que é divertido".

Na aba Combate e nos sistemas normal/P/G/R: **nenhuma**.

---

## 7. Cobertura de regras

Legenda: **presente** (o motor calcula e aplica sozinho), **parcial** (calcula ou mostra, mas a
aplicação é da mesa), **ausente** (não há código), **divergente** (há código e ele discorda do
capítulo, ou dois lugares do código discordam entre si). "Mesa" = `grid.astro` +
`combate-tempo.ts` + libs puras; "bancada" = `lib-tempo.mjs`.

### 7.1 Combate Físico (`combate.md`)

| Regra publicada | Estado no código |
|---|---|
| Iniciativa = 1d6 + Raciocínio + Prontidão (L14, L27) | **presente** para PC (`mesa-ficha.ts:132-135`) e criatura, lendo o bônus da string do bloco (`mesa-bestiario.ts:55-60`) |
| Maior entra no Tick 1; um Tick a mais por degrau de 6 (L29-38) | **presente** (`ticksDeEntrada`, `combate-tempo.ts:355-369`; `derivados.iniciativa.tickDoPrimeiro = 1`). **Divergente no texto da tela:** `rolarIniciativas` diz "entra no Tick 0" (`grid.astro:4751`, comentário L4772) |
| Contrapé −1d6 por degrau, decai 1d6 por Tick (L31, L42-48) | **parcial**: calculado (`contrapeEm`, L457-463) e **mostrado** "para somar à mão" (`grid.astro:7641`); não desconta do bolo |
| Velocidade por tipo de ação (tabela L52-58) | **presente** para armas (`armas.json.ticks`); ações sem catálogo usam o número digitado (`grid.astro:7290`) |
| Ataque = (Atr+Hab)/2 + Especialidade + Arma + Centelha (L64-68) | **parcial**: bolo, arma e Centelha em `combate-resumo.ts:63-72`; **Especialidade ausente** na mesa (`resumoCombatePC` não a lê) |
| Defesa = (Des+Hab)×2 + Esp + Centelha (L70-72) | **presente** (`calc.ts:37-40`); Especialidade só como parâmetro, nunca preenchido pela mesa |
| **Margem: +1d6 de dano a cada 6 acima da Defesa** (L17, L74) | **ausente na mesa**: a folha rola só a expressão da arma (`rolarDano`, `grid.astro:7967-7972`) e o veredito só classifica acerto/raspão/erro (L7662-7668). **Presente na bancada** (`lib-tempo.mjs:322, 332`) e em `playtest-horda.mjs:25-27` |
| Empunhadura dupla: hábil −1d6, inábil **−2d6**, Ambidestria (L78-90) | **divergente**: o motor cobra **−1d6 nas duas** (`regras.json` `combate.dupla.penDados = -1`, `penDadosAmbasAsMaos = true`, L2419-2432; `anatomia`, `combate-tempo.ts:291-299`). `Pendencias.md` K18 registra a Ambidestria sem função |
| Dano = (Dado + Margem) + Força − Absorção; Força ×2 nas duas mãos, haste ×1 (L94-96) | **parcial**: Força e multiplicador em `combate-resumo.ts:74-84` (`forcaMult`, `forcaCap`); Margem ausente (linha acima) |
| Três modos; trocar para secundário −2 acerto / −1d6 dano (L98-140) | **parcial**: o resumo usa só o modo principal (`combate-resumo.ts:81-84`); a folha deixa trocar o tipo (`dnTipo`, `grid.astro:7613, 7618`) **sem penalidade**. Busca por `secund` em `src/`: só texto de `equipamentos.astro:96` |
| Absorção natural: Vigor + Centelha no Impacto, só Centelha nos letais (L108) | **presente** (`calc.ts:106-108, 125-128`; `centelhaNoSoak = 1`, `regras.json:806`; `combate-resumo.ts:99-106`) |
| Empilhar armadura: maior Absorção por categoria, maior Nível, soma das penalidades (L109) | **presente** (`empilharArmaduras`, `calc.ts:111-122`) |
| Gate de Perfuração (L111-118) | **parcial na mesa**: a função existe (`gatePerfuracaoAbre`, `calc.ts:131-135`) e a folha só **escreve** "gate N" (`grid.astro:7504`; `combate.astro:1926`); ninguém lê o `perf` da arma na resolução. **Presente na bancada** (`lib-tempo.mjs:329-336`) |
| Couraça de Porte (+2/+4/+7/+10; perfuração natural 1/2/3) (L120-136) | **ausente**: busca por `coura[cç]a|perfuracaoNatural` em `src/lib`, `src/pages/mesa` e `scripts/gen-monsters.mjs`: nada. **NÃO ENCONTREI** o número embutido na Absorção do bestiário (o gerador não o calcula) |
| Quase-Acerto (L142-144) | ver 7.3 |
| Esquivar **ou** Bloquear, a melhor das duas; Defesa da arma e escudo no Bloqueio (L146-153) | **divergente**: a resolução usa **só a Esquiva** (`combate-resumo.ts:86-87` → `RESUMO.defesa` → `grid.astro:7469-7470`). `mesa-ficha.ts:84` calcula `defBloqueio` **sem** a Defesa da arma nem o escudo, e a mesa não a usa. O escudo entra só pela penalidade (`combate-resumo.ts:53`). A bancada tem uma Defesa só e `usarDefesaArma: false` (`lib-tempo.mjs:43-46, 90`). `Pendencias.md` K14 e K25 |
| Projéteis rápidos: só Esquiva ou escudo hábil (L155-164) | **ausente na resolução**: o campo `habilProjetil` existe no catálogo e só a ficha o lê (`ficha-engine.ts:739, 755, 1552`) |
| Força e porte: quando a guarda não segura (L166-175) | **ausente no motor**: `regras.json:953` `bloqueioLimite` é lido só por `mesa/referencia.astro:39` (página de consulta) |
| Contra área, sair: Dif 5 + 5×metros, dobro para nada (L177-184) | **presente** nas Artes (`oferecerSaida`, `artes-grid-mesa.ts:1268-1332`) |
| Deslocamento de Batalha = 2 + (Des+Atl)/4 (L190) | **presente** (`calc.ts:145-168`; `combate-resumo.ts:116-123`; bestiário por `deslocamento-bestiario.json`) |
| O primeiro Tick de movimento é de graça durante outra ação; além disso cobra Tick (L192-193) | **divergente/parcial**: o Grid **não cobra** movimento em Preparo nem livre (`cobrarDeslocamento` só na Recuperação, `grid.astro:5853-5856`), e não limita a um Tick grátis. `Pendencias.md` K28: "o Grid não cobra o passo grátis, só mostra ao arrastar" (decisão de 21/08) |
| Corrida: Velocidade 3, Defesa −4, Arranque 3 Ticks (L205-221) | **parcial**: o passo de Arranque entra no simultâneo (`passoNoModo`, `grid.astro:4882-4891`); a condição `correndo` (defesa −4, `condicoes.json`) tem de ser posta à mão; **ninguém a aplica sozinho** (`Combate_Simultaneo.md` §3.2 item 3) |
| Investida: +1d6 de dano, −2 de Defesa (L223-237) | **ausente na aplicação**: `regras.json` `combate.movimento.investida` (L2331) e a condição `investindo` existem; nenhum lugar de `grid.astro` soma o dado ou a penalidade. A travessia do Golpe exige `modo === 'corrida'`, não investida (`combate-tempo.ts:765-777`) |
| Salto (L239-249) | fora do combate; fórmulas em `calc.ts:162-167` |
| Vantagem tática: cobertura, postura, flanco, surpresa (±2/±4), **teto ±6** (L253-272) | **parcial e divergente**: os modificadores são condições que o mestre põe (`condicoes.json`: cobertura-parcial +2, defesa-total +4, flanqueado −2, surpreso/cego/imobilizado −4, postura-agressiva −2/+2, terreno-alto e mirando como +2 no ataque em vez de −2 na Defesa) e `somarCondicoes` os soma (`mesa-core.ts:164-181`) **sem o teto de ±6** (`regras.json:861` `combateTatico.modificadorCap = 6` é lido só por `mesa.astro:11, 130` e `referencia.astro:37`) |
| Golpes no mesmo instante: escada pela agenda (L274-280) | **presente** (`faseDeQuemVaiAgir`, `combate-tempo.ts:430-436`; `grid.astro:7448-7455`) |
| Porte no acerto: +3 por categoria, teto +12 (L282-295) | **ausente no motor**: `regras.json:933` `porteAcerto` lido só por `referencia.astro:38`; `PORTE_M` no Grid é só o diâmetro do token (`grid.astro:2995-3012`) |
| Guarda sob pressão: −2 por ataque **feito ou recebido**, sem teto (L297-303) | **divergente entre capítulo e motor**: o motor soma Pressão só em quem **recebe** (`gravarRelogio`, `grid.astro:7201-7207`; `tirarDaAgenda` L7125-7131; `defesaPerdida`, `combate-tempo.ts:628`) e cobra quem ataca pela escada de fase (`regras.json:2390-2400`; `lib-tempo.mjs:150-155`, `atacarCustaGuarda: false`). O capítulo ainda descreve o modelo antigo |
| Regra de Horda (L305-324) | **ausente no motor**: `regras.json:1027` lido só por `referencia.astro:287-312`; simuladores próprios (`sim-horda.mjs`, `playtest-horda.mjs`) |
| Técnicas em combate: Energia, passiva/reflexiva/suplementar/independente, combos, posturas (L326-347) | **ausente**: `energia` aparece só no perfil (`grid.astro:2905, 2919`); as Técnicas são prosa (§5). Nenhuma leitura de `tecnicas.json` na resolução |
| Empilhar Proezas (L349-356) | **ausente** |
| Fôlego (módulo opcional, L251) | **ausente** no Grid (só o número no perfil, L2905) |

### 7.2 As Três Defesas (`defesas.md`)

| Regra publicada | Estado no código |
|---|---|
| Esquiva = (Des+Esquiva)×2 + Centelha + Esp (L66) | **presente** (`calc.ts:37-40`) |
| Bloqueio = (Des+Bloqueio)×2 + Centelha + Esp **+ defesa da arma/escudo** (L67) | **divergente**: `mesa-ficha.ts:84` sem arma nem escudo; a ficha soma arma **e** escudo (`Pendencias.md` K25 cita `ficha-engine.ts:1467`); a mesa não usa o Bloqueio em resolução alguma |
| Defesa Social (L73-75) | **presente** na conta (`calc.ts:48-53`); na mesa aparece como número (`combate.astro:1669`) e o diálogo de ação tem o tipo `social` (L1979) sem comparar total com Defesa |
| Defesa Mental (L79-81) | **presente** na conta (`calc.ts:42-46`; `combate-resumo.ts:92-97`); no Grid é só mostrada (`grid.astro:7502`) |
| Centelha +1 em cada defesa e no ataque (L60) | **presente** (`regras.json:670, 696`; `calc.ts:39, 56-59`) |
| Especialidade situacional, uma por golpe (L85-95) | **ausente** na mesa |
| Queimar Força de Vontade (L96-105) | **ausente** |
| Imunidade por Inteligência 0/1 (L106-116) | **ausente** (**NÃO ENCONTREI** leitura de `inteligencia` na resolução) |

### 7.3 Quase-Acerto (`quase-acerto.md`)

| Regra publicada | Estado no código |
|---|---|
| Margem = bônus da arma + bônus da armadura; errou por = (Defesa+1) − total (L14-18) | **presente** (`quase-acerto.ts:187-199, 208-211`; `grid.astro:7583-7606, 7662-7663`) |
| Dano do raspão = QA da arma − Redução, mínimo 0, fixo, ignora Absorção (L22-24) | **presente** (`quase-acerto.ts:195-196`; `aplicarDano` com `raspao` pula a Absorção, `grid.astro:8082`) |
| Classe por dano médio (L30-44) | **presente** (`quase-acerto.ts:93-99`). **Divergente na bancada**: `lib-tempo.mjs:65-68` classifica pela **classe de tempo** (`QA_ARMA[A.arma.classe]`, L316), e `sim-duelo.mjs:12` e `simulador-batalha.html:173` pelo **número de dados** (a régua revogada em 24/08) |
| Empilhar: bônus somam, Redução é a maior (L75) | **presente** (`quase-acerto.ts:125-138`) |
| Condição do raspão: errou por ≤ Margem | **divergente na bancada**: `lib-tempo.mjs:337` testa `total >= efDef − qaMargem`, um ponto mais generoso que `errouPor(total, def) <= margem` (`quase-acerto.ts:208-211`) |
| Modificadores situacionais, encantamentos, Proezas, Feitiçaria no QA (L77-86) | **ausente** (a folha permite editar a Margem à mão, `grid.astro:7583`) |

### 7.4 Armas & Armaduras (`armas-e-armaduras.md`)

| Regra publicada | Estado no código |
|---|---|
| Os números da arma (Velocidade, dado, acerto, Defesa, mãos, modos) (L14-22) | **presente** no catálogo (`armas.json`) e no resumo (`combate-resumo.ts`) |
| Modo secundário −2 / −1d6 (L21) | **ausente** (7.1) |
| Tag Ágil: usa Destreza no dano (L48) | **divergente**: o dano soma sempre Força (`combate-resumo.ts:78-80`); 3 armas têm a tag (adaga, adaga-de-arremesso, dardos) |
| Tag Versátil (L49) | **presente** (`combate-resumo.ts:77-79`) |
| Tag Sangramento igual à Margem, máx. 3 (L50) | **ausente** (sem Margem não há gatilho; a condição `sangrando` existe e é manual) |
| Arremessável, Munição, Recarga, Pesada (L51) | **ausente** no motor (só texto/tag) |
| Imobiliza (Rede) (L52) | **ausente** |
| Arcos somam Força (curto até +3, composto ×2); bestas não (L84-89) | **presente** (`forcaCap`, `forcaMult` em `armas.json`; `combate-resumo.ts:78-79`) |
| Alcance e faixas de distância | **parcial**: calculado (`alcance.ts:61-73`) e **mostrado** "para somar à mão" (`grid.astro:7550-7563`) |
| Armaduras: três Absorções, Nível, penalidade em ataque/esquiva/deslocamento (L105-123) | **presente**: Absorção e Nível no catálogo; penalidade no ataque (`combate-resumo.ts:70`), na Defesa (L87) e metade no passo (L121-122) |
| Escudo: bônus de Defesa quando usado (L127) | **divergente**: o `bloqCaC` não entra na Defesa usada pela mesa (`combate-resumo.ts:86-87` só Esquiva; escudo só como penalidade L53) |
| Pavês +3 contra projétil (L141) | **ausente** |

### 7.5 Centelha (`centelha.md`)

| Regra publicada | Estado no código |
|---|---|
| +1 no ataque e nas quatro defesas (L42) | **presente** (`calc.ts:39, 45, 52, 56-59`) |
| Reservas de Energia e Mana (L43) | **presente** na conta (`calc.ts:68-82`); a Energia não é gasta por nada no combate (7.1) |
| Atributos acima de 6 (L44) | ficha; fora do combate |
| Trilhas por nível das Técnicas (L69-79) | **ausente** no combate (as Técnicas são prosa) |

### 7.6 Ações & Sistema (`acoes-e-sistema.md`)

| Regra publicada | Estado no código |
|---|---|
| Dificuldade da tarefa e `total > Dif` (L18-27) | **parcial**: "Outra coisa" compara o total digitado com a Dificuldade digitada (`grid.astro:7316-7325`) |
| Margem fora do combate (L31-37) | **ausente** |
| Direta / Acumulada / Longa / Reflexiva / Passiva (L39-111) | **ausente** no Grid (só a Direta pela caixa acima). Passiva existe na ficha (`mesa-ficha.ts:35-72`) |
| Ajuda e teste coletivo (L142-158) | **ausente** |

### 7.7 Vida, Ferimentos & Cura (`vida-ferimentos-cura.md`)

| Regra publicada | Estado no código |
|---|---|
| PV por porte (L19-31) | **presente** (`calc.ts:30-34`; `regras.json:630`) |
| Duas trilhas, Impacto nocauteia, morte só pelo Letal acumulado (L10-15, L50-52) | **ausente**: um único `pv_atual` (`migracao-2.sql:136`); busca por `letal` em `src/`: só texto de `referencia.astro:166` |
| Limiares de ferimento com penalidade em ações e Defesa (L37-48) | **presente** (`regras.json:585`; `tierDe`, `mesa-core.ts:98-103`; aplicado na folha `grid.astro:7435, 7621`) |
| Sangramento N por rodada (L54-63) | **parcial**: a condição `sangrando` (`porRodada: 1`) é aplicada na aba Combate ao agir (`combate.astro:1439-1443`); no Grid **NÃO ENCONTREI** leitura de `porRodada`. O gatilho automático (cair a Grave por Letal; tag Sangramento × Margem) está ausente |
| Estabilizar (L65) | **ausente** |
| Cair a 0: incapacitado (L48, L52) | **presente** como `noChao` (`grid.astro:5822-5832`), que tira da fila |

### 7.8 O que `regras.json` decide e o capítulo IX ainda não escreve

Não é divergência de código, é o capítulo atrasado; conta para a simulação porque "regra
publicada" e "regra do motor" já não são a mesma coisa: P/G/R (`regras.json:2354`), escada (L2390),
rajada (L2401), dupla (L2419), abortar (L2441), Recuperação paga (L2433), golpe adiado (L2286),
simultâneo inteiro (L2247-2285). `Pendencias.md` K5 lista a fase "4 · capítulo IX" como a única
que falta, esperando K12 e K17.

---

## 8. Fim de batalha e travas

- **No Grid não existe fim.** Nenhuma condição de término em `grid.astro`: com todos no chão,
  `tickDaVez` devolve `null` (L4075-4082), `grupoDaVez` devolve `[]` (L4109) e `relogio` congela no
  maior tick (L4151-4152). O encontro só muda de estado por botão do mestre na aba Combate
  (`combate.astro:1476-1484`, `estado: 'encerrado'`, `migracao-11.sql:46-51`). O jogador não pode
  encerrar.
- **Não há teto de Ticks** no simultâneo: `avancarTickSimultaneo` incrementa sem limite (L4903-4904).
- **Perseguição que não fecha:** a agenda desliza um Tick por avanço, sem teto, por decisão de
  02/09 (`regras.json:2260-2266` `reprojecao.tetoDeAdiamento = null`; `reprojetarAgenda`,
  `combate-tempo.ts:833-851`). Dois lados fora de alcance e um deles mais rápido: o cartão do golpe
  nunca vence e o mestre precisa abortar (`Combate_Simultaneo.md` §3.2 item 2).
- **Dois lados sem se alcançar sem ninguém perseguir:** nada acontece; o relógio anda a cada
  clique e ninguém decide (no simultâneo, `grupoDaVez` devolve todo mundo livre, L4123).
- **Todos incapazes de agir:** ninguém age; `levantar` só dispara quando alguém volta a ter Vida
  (`conferirChao`, L4207-4216).
- **Proteção contra laço infinito no Grid: nenhuma.** O vaivém de `caminharHex` entre Ticks
  (corrigido hoje em `grid.astro:4943-4967`) era exatamente um laço sem fim que só não aparecia
  porque o cartão vencia na hora marcada.
- **Bancada:** `cena` termina quando um lado não tem `pv > 0` (`lib-tempo.mjs:502-505`) ou em
  `tetoTicks = 4000`, devolvendo empate (L382, L507); `cenaDistancia` em 600 (L599).
- **Efeitos de Arte** vencem por `ate_tick` (`artes-grid.ts:1392`; `verificarEfeitos` L1449) e
  peças invocadas somem com o efeito (L1518-1522).

---

## 9. Infraestrutura

- **Gerenciador:** npm (`package-lock.json`). Node v24.16.0, npm 10.8.0. Dependências:
  `astro ^5.6.1`, `@supabase/supabase-js ^2.110.7`; dev: `esbuild ^0.27.7`, `puppeteer-core ^25.1.0`,
  `zod ^3.24.1`, `pagefind`, `mermaid` (`package.json`).
- **Comandos** (`package.json`): `npm run validate` (14 verificadores em cadeia), `npm run build`
  (validate + `astro build` + pagefind), `npm run smoke` (`scripts/test-grid.mjs`, navegador),
  `npm run bancada` (dev server com o banco de mentira, `astro.bancada.mjs:1-46`).
- **Como o TypeScript roda em Node hoje:** `esbuild` empacotando o `.ts` para um `.mjs`
  temporário (`scripts/test-simultaneo.mjs:21-33`, `test-combate-tempo.mjs` idem).
- **Como a tela roda sem banco:** `astro.bancada.mjs:43` troca `@supabase/supabase-js` por
  `scripts/mesa-mock.mjs`, que monta a cena por query string (`?bench=12&cols=24&rows=16&tempo=simultaneo&papel=jogador`,
  `mesa-mock.mjs:28-48`) e é determinístico por contador (L245-251). Sobe com `scripts/dev-server.mjs`
  e dirige Edge ou Chrome por `puppeteer-core` (`test-grid-simultaneo.mjs:24-37`).

### 9.1 Testes que tocam combate, medidos nesta máquina

| Teste | O que trava | Duração medida |
|---|---|---:|
| `scripts/test-combate-tempo.mjs` | régua P/G/R, escada, iniciativa, faixas (12 blocos de asserção) | 283 ms |
| `scripts/test-simultaneo.mjs` | física herdada, agenda, passo no mapa, re-projeção, robô | 229 ms |
| `scripts/test-quase-acerto.mjs` | classes, empilhamento, exemplo do capítulo XII | 200 ms |
| `scripts/test-golpe.mjs` | projéteis do catálogo | 193 ms |
| `scripts/test-deslocamento.mjs` | passo das 309 criaturas | 100 ms |
| `scripts/test-artes-grid.mjs` | motor das Artes (24 Artes, 140 Efeitos) | 418 ms |
| `scripts/test-kael.mjs`, `test-contrato.mjs` | regressão da ficha e contrato ficha↔mesa | 91 ms, 348 ms |
| `scripts/test-grid-simultaneo.mjs` | 3 cenas no navegador, 45 asserções | **39,9 s** (sobe dev server + Edge headless) |
| `scripts/test-grid.mjs` | 8 cenas (`cena`, `cenaJogador`, `cenaRastreador`, `cenaMapas`, `cenaCelular`, `cenaGolpeAdiado`, `cenaQuaseAcerto`, `cenaFusao`; L117, 1116, 1235, 1285, 1402, 1938, 2195, 2305), 256 linhas com `ok(` | não rodado nesta sessão; exige navegador (L38-41) |
| `scripts/test-bench-tempo.mjs` | as baterias da bancada, imprime o tempo por bateria (L63-67) | não rodado |

`npm run validate` inteiro: verde neste commit (saída conferida hoje).

### 9.2 Quanto tempo leva uma batalha

- **Bancada:** `bateria` roda 8000 duelos por chamada (`lib-tempo.mjs:512`), `refrega` 3000 de 3×3
  (L550). Tempo por duelo não medido nesta sessão; `test-bench-tempo.mjs:63-67` imprime o tempo
  por bateria e é o lugar de medir.
- **Grid:** não é medível como "batalha": cada Tick é um clique do mestre, cada golpe é uma caixa,
  e o teste usa esperas fixas de 650 a 750 ms por avanço (`test-grid-simultaneo.mjs`, laço de ⏭).
  Na cena de 3 avanços mais declaração e fuga, a suíte inteira gasta 39,9 s para 3 cenas.
- **Custo de repintura por ação** (o que limita o Grid como motor): medido em
  `Auditoria_Tecnica.md` §2.2 (L204-235) e cercado por `TETOS` em `test-grid.mjs:46-60`.

---

## 10. Bloqueios

Em ordem de gravidade. "Onde mora" lista os arquivos em que o bloqueio está escrito hoje.

1. **A resolução do golpe não existe como função.** Ela é o miolo de um modal
   (`folhaDaAcao`, `grid.astro:7420-8021`) que lê o DOM para cada número, resolve por clique e
   aplica direto no Supabase (`aplicarDano`, L8073-8100). Nenhum script de Node consegue "resolver
   um ataque" sem abrir a página. Onde mora: `src/pages/mesa/grid.astro` (a folha, o dano, o
   avanço, o robô), `src/lib/artes-grid-mesa.ts` (a mordida e a saída).
2. **Nada da mesa é reprodutível.** `Math.random` em `src/lib/rolagem.ts:11`,
   `src/lib/mesa-ficha.ts:133`, `src/lib/artes-grid.ts:1342`; desempate da fila por `Date`
   (`grid.astro:4063, 4967`); log em prosa (`grid.astro:8321`); sem foto de estado. Uma batalha
   com defeito não se repete.
3. **O motor da mesa não é o sistema publicado, e a bancada não é o motor da mesa.** Na mesa
   faltam a Margem de dano, o gate, o Bloqueio com arma e escudo, a Couraça, o porte no acerto, a
   troca de modo, o teto ±6, a Investida, o Sangramento; a dupla e a Pressão do atacante discordam
   do capítulo (§7). A bancada tem Margem e gate mas classifica o QA por outra régua e raspa um
   ponto a mais (`lib-tempo.mjs:316, 337`). Mil batalhas mediriam um terceiro sistema. Onde mora:
   `src/lib/combate-resumo.ts`, `src/pages/mesa/grid.astro`, `scripts/lib-tempo.mjs`,
   `src/content/chapters/combate.md`.
4. **Não há laço que termine sozinho nem quem decida por um lado.** O Grid não tem fim de batalha,
   teto de Ticks nem trava de laço (§8); o único decisor automático ataca o mais próximo e foge a
   25% (§6), só no simultâneo, só para criatura, sem Artes, Técnicas, alcance ou troca de alvo. Do
   lado dos PCs não há política nenhuma. Onde mora: `src/lib/combate-tempo.ts:880-895`,
   `src/pages/mesa/grid.astro:5029-5063`, `scripts/lib-tempo.mjs:397-453`.
5. **Os dados não sustentam "diversos participantes e escolhas".** As 309 criaturas têm exatamente
   um ataque, nenhuma armadura, nenhum alcance e Artes/Técnicas só como referência; as 461 Técnicas
   e os 144 níveis de Arte são prosa; os Efeitos têm forma e gatilho mas o dano sai de um
   `dadoPorNivel` por Arte; existe uma ficha de PC de teste (`test-kael.mjs`) e as da bancada.
   Onde mora: `src/data/monsters-mesa.json`, `src/data/tecnicas.json`, `src/data/artes.json`,
   `src/data/efeitos.json`, `scripts/gen-monsters.mjs`, `scripts/mesa-mock.mjs`.

---

## 11. Perguntas para você

O que só você responde, e que muda o desenho da simulação conforme a resposta:

1. **Qual dos três sistemas de tempo as 1000 batalhas medem?** Só o simultâneo tem mapa e
   perseguição no motor; o normal e o P/G/R não têm geometria nenhuma (o Grid só mostra a
   distância). Se for "os três", a bancada sem mapa serve para dois e o terceiro precisa de um
   laço novo.
2. **Quando o capítulo, o `regras.json` e o motor discordam (dupla −2d6 ou −1d6; Pressão do
   atacante; Margem de dano ausente na mesa; QA da bancada), qual dos três é "o sistema" que a
   simulação deve obedecer?** A regra da casa (`CLAUDE.md`) diz que o JSON vence o capítulo, mas o
   JSON não cobre a Margem nem a Couraça, e o motor da mesa não cumpre tudo o que o JSON escreve.
3. **A simulação inclui o que a mesa hoje faz à mão** (contrapé descontado, penalidade de
   distância, Investida, Corrida −4, teto ±6, porte no acerto, Couraça), ou mede só o que o motor
   aplica sozinho? A primeira opção mede o jogo publicado; a segunda mede a ferramenta.
4. **Quem são os participantes?** Não há elenco de PCs: existe uma ficha de teste e as da bancada.
   Precisa saber se as fichas vêm do Supabase de produção (`personagens.ficha`), de arquétipos a
   gerar, ou da bancada.
5. **As criaturas usam Artes e Técnicas na simulação?** Os 77 monstros com Artes e os 24 com
   Técnicas as têm só como referência; sem uma decisão, a horda mágica luta com garras.
6. **O que a simulação está tentando medir?** "O que podemos melhorar para os jogadores" cabe em
   win rate por classe, duração em Ticks, número de decisões por combate, golpes perdidos no vazio,
   frequência de perseguição sem fim, ou tempo de mesa (cliques). Cada métrica pede um log
   diferente, e o Grid hoje não emite nenhum deles como dado.
7. **Quais das 14 paradas humanas da §3 uma política pode decidir, e quais devem ser excluídas
   das batalhas?** Abortar, sair da área, manobra, modo de deslocamento e "fixar número" são
   escolhas de jogador; uma política que as decide já é uma regra de jogo.
8. **O que é "fim de batalha"?** Um lado sem ninguém de pé, fuga bem-sucedida (o alvo mais rápido
   nunca é alcançado), teto de Ticks, ou rendição. O código não tem nenhum; o único existente é o da
   bancada (um lado a zero, ou 4000 Ticks).
9. **A bancada (`lib-tempo.mjs`, com seus presets `REGRAS_PGR`) é uma base aceitável para as
   1000 batalhas, ou o motor da simulação tem de ser o mesmo código que a mesa executa
   (`combate-tempo.ts` e o que hoje está em `grid.astro`)?** As duas medem coisas diferentes (§7.3),
   e `Combate_Tempo.md` §13 item 7 já registrou que a calibragem da bancada nunca passou por mesa.
10. **O que fica manual de propósito** (`Grid_Automacao.md` §5, L179-187: narrar, decidir se cabe,
    o dano dos jogadores) **vale também para a simulação?** Se o dano do jogador é sempre dele, uma
    simulação que rola por ele já contraria um contrato escrito do projeto.
