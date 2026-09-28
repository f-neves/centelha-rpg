# Reforma da Centelha, Briga, consertos e fichas de referência · relato da Executora

Despacho: `docs/simulacao/caixa/reforma-centelha-briga-despacho.md` (commit `060bfc26`).

## Fase 1 · Regra da Centelha · FEITA

**A fórmula nova**, `centelhaNaJogada(centelha, habilidade) = 2 × min(centelha, habilidade)`,
mora em `src/lib/calc.ts` (exportada) e foi reimplementada (mesma conta, arquivos que não podem
importar TS compilado) em `scripts/lib-bestiario.mjs` (o gerador do bestiário) e
`scripts/test-kael.mjs` (a regressão que roda sem bundler). `centelhaSoAtributo(centelha)`
existe ao lado, para a regra provisória (item 1, "jogada só de Atributo"), registrada como
pendência abaixo.

**Arquivos tocados, item por item:**
- **calc.ts**: `defesa`, `defesaMental`, `defesaSocial` (Habilidade já vinha nos parâmetros,
  só troquei o termo de Centelha), `ataqueCentelha` (ganhou um segundo parâmetro,
  `habilidade`, obrigatório agora).
- **combate-resumo.ts**: `ataqueCentelha(C, habilArma)` no lugar de `ataqueCentelha(C)`; dano
  ganhou `+ C` na expressão fixa (`danoAp = forcaAp + C`).
- **ficha-engine.ts**: os três call-sites de `ataqueCentelha` (mão hábil, mão inábil na dupla)
  ganharam a Habilidade; `+ C` em todas as versões de `ap` (`versoes`, `inabilAp`).
- **lance.ts**: `EntradaLance.atacante` ganhou `centelha`; `quaseAcertoDoEncontro` agora soma a
  Centelha do atacante ao raspão (além de descontar a do alvo, que já valia desde 27/09).
- **grid.astro**: os dois construtores de `EntradaLance` (`qaEncontro`, `entradaDoLance`)
  passaram a mandar `atacante.centelha` (lido de `ra?.centelha`, o RESUMO do atacante, mesmo
  campo que o item 4 da rodada anterior já tinha acrescentado a `ResumoCombate`).
- **motor.mjs**: `entrada.atacante.centelha` lido de `c.centelha` (a peça já carrega desde a
  rodada anterior).
- **artes-grid-mesa.ts**: `morder()` (o dano de cada pulso de Arte) ganhou
  `+ centelhaConjurador` (lido de `ctx.resumo[ef.conjurador_id]?.centelha`).
- **regras.json**: `quaseAcerto.porClasseArmadura.media.reducao` 4→3, `.pesada.reducao` 6→5
  (`bonus` sem mudança, conferido igual ao pedido).
- **lib-bestiario.mjs**: as MESMAS quatro fórmulas (defesa/defesaMental/defesaSocial/ataque) e
  o dano (`+C`) do bestiário, que eram uma reimplementação PARALELA já usando o
  `centelhaMult` antigo (achado nesta rodada: não estava no despacho original nem na
  conferência prévia, mas é exatamente o padrão "dois lugares decidem a mesma conta" que já
  apareceu nas duas rodadas anteriores).

**Item 2 (Dificuldade de jogada contra efeito, Afogar/Maremoto): SEM CÓDIGO PARA TOCAR.**
Procurei em `artes-grid-mesa.ts`, `efeitos.json` (os verbetes de Afogar e Maremoto) e
`regras.json`: não existe nenhuma implementação automática dessa jogada de resistência hoje:
é um cálculo que o mestre faz à mão na mesa, sem caminho de código. A fórmula fica registrada
aqui e em `centelhaNaJogada`/`centelhaSoAtributo` (a mesma conta serve), para quando/se essa
jogada ganhar automação; não há nada a testar ou regenerar.

**Item 5, a pendência do `quase-acerto.ts` (achado do Arquiteto, confirmado): NÃO DECIDI, NÃO
TOQUEI.** `quaseAcerto()` em `src/lib/quase-acerto.ts:187-199` continua sem termo de Centelha
nenhum (nem do atacante, nem do alvo): ela é usada pelos cards de ficha fora de combate, sem
alvo real, e mudar a assinatura dela é decisão de regra que o despacho não cobre. Registrado
como pendência, como pedido; não a resolvi.

**Item 8 (bestiário): achado sistêmico, não uma lista de exceções.** Rodei um script
descartável (`scripts/sim/_tmp-faltando.mjs`, apagado) conferindo as 309 fichas de
`src/data/bestiario/` contra os campos que a fórmula nova precisa. **309 de 309 fichas não têm
bloco `pericias` NENHUM** (`b.pericias === undefined`, não é um valor 0 escrito, é o campo
inteiro ausente). Isso significa que, hoje, a fórmula `2×min(Centelha,Habilidade)` sai **0 em
toda Defesa/ataque de criatura**, não porque a Centelha não valha para elas, mas porque a
Habilidade que a limitaria nunca foi gravada: a régua de combate das 309 fichas usa só
Atributo (+ um flat da arma), nunca perícia. Não inventei valor nenhum: a fórmula lê `pe.esquiva
|| 0` como sempre leu, e o resultado (bônus de Centelha zero em toda criatura) é uma
CONSEQUÊNCIA visível da ausência, não um erro escondido. Isto é um achado grande demais para
recalibração isolada, e confirma a nota do próprio despacho ("a recalibração do bestiário é
outro trabalho") e fica registrado aqui com a contagem exata para quem for abrir essa frente.

**Achado a mais, duas fórmulas INVERSAS que pararam de ser exatas.** A fórmula nova não é
invertível sem saber a Habilidade de antemão (o `min()` esconde se o termo foi capeado pela
Centelha ou pela própria Habilidade). Duas funções fazem essa inversão e ficaram só
APROXIMADAS, documentado no próprio código:
- `periciasDe()` (`scripts/lib-bestiario.mjs`, gera `inimigos.json`): deriva Esquiva/
  Integridade/Sociabilidade a partir da Defesa/Defesa Mental/Defesa Social publicadas. Não
  toquei a fórmula (mudar a conta ali é decisão de regra sobre COMO aproximar, que o despacho
  não cobre), mas registro que ela está lendo o termo de Centelha do jeito ANTIGO
  (`centelhaMult` linear) e por isso vai ficar levemente errada quando o termo novo for
  capeado. **Na prática não mudou nada agora**, porque nenhuma das 309 fichas tem `pericias`
  escrito (achado acima): a Esquiva/Integridade/Sociabilidade que ENTRAM na fórmula de verdade
  já são 0 hoje, e min(Centelha,0)=0 nos dois formatos, então a mesma ausência que zera o bônus
  também torna a inversão inofensiva por ora.
- `desEsqDaDefesa()` (`src/lib/artes-grid.ts`, o desvio de área contra Artes): esta EU
  atualizei, porque um teste (`test-artes-grid.mjs`) já cobrava o valor e ficou vermelho.
  Escolhi a aproximação "assume Esquiva ≥ Centelha" (usa o termo cheio, 2×Centelha, não
  capeado): quando a suposição for falsa, o número sai um pouco ALTO, nunca negativo, e o teto
  de 12 continua batendo em todo o bestiário (conferido: `fora.length === 0`). Documentado no
  próprio código como aproximação, não como fórmula exata.

## CORREÇÃO (28/09/2026, achada ao investigar o CI vermelho): o item 8 acima estava ERRADO

O "309 de 309 fichas sem `pericias`" saiu de um script descartável que passava a ficha SOURCE
(`src/data/bestiario/<id>.json`, campo `skills`) direto para `stat()`, sem passar por
`paraStat()` primeiro (é `paraStat()` quem converte `skills`→`pericias` e `willpower`→`vontade`
antes de chamar `stat()`; `gen-bestiario.mjs` sempre fez essa chamada em duas etapas, eu que
pulei a primeira ao testar). Pelo caminho real (`lerCriaturas()` → `paraStat()` → `stat()`),
conferido de novo: **0 das 309 fichas** ficam sem Esquiva ou Integridade, e o bônus de Centelha
nessas Defesas funciona (ex.: Treant, Centelha 3, Integridade 4, Defesa Mental publicada **22**,
com `centelhaNaJogada(4)=6` dentro dela). A única lacuna real é **309 de 309 sem
`skills.sociabilidade`**, e mesmo essa não zera a Defesa Social: `stat()` já cai num fallback
(a melhor perícia social presente) antes de chegar a 0. Não há recalibração de dado pendente
aqui; **B15 fechada** com esta correção (`docs/pendencias/B-bestiario.md`).

## O BUG REAL que a Fase 1 escancarou (achado, não pedido, mas corrigido)

Ao testar `npm run espelho` com a Reforma aplicada, `1v1-unissono` (dois `escudeiro` se
enfrentando) ficou vermelho: a Vida do lado `a0` na MESA parava de descer depois do primeiro
golpe, enquanto o LAÇO continuava baixando normalmente. Isolei por bissecção (revertendo um
arquivo de cada vez com `git stash push -- <arquivo>`) até achar a causa em
`src/pages/mesa/grid.astro`.

**O achado**: o item 2c da rodada anterior ("o acerto nunca dói menos que o raspão do mesmo
golpe") só tinha sido aplicado na PRÉVIA (`contaDoLance`/`pintarDano`, a caixa que o mestre vê
antes de confirmar). O valor de dano que REALMENTE ia para `aplicarDano` (e dali para
`baixarVida`, a escrita de verdade) vinha de uma conta SEPARADA
(`Math.max(0, rdDanoFim.total)`, dentro do `fim()` que fecha a folha), sem o piso nenhum. Ou
seja: **o piso do item 2c nunca valeu no jogo de verdade**, só na tela: um bug da rodada
anterior (já com veredito PROCEDE da Revisora), que só ficou grande o bastante para o espelho
notar agora, porque a Centelha do atacante somando ao raspão (item 5 desta rodada) aumentou o
piso o suficiente para ele discordar do dano rolado com frequência.

**O conserto**: `fim()` agora devolve um campo `piso` (o `danoQA()` da prévia, só no acerto
normal; no raspão o próprio `dano` já É o piso, e não precisa de mais nada); os dois
call-sites de `aplicarDano` passam esse `piso` adiante; `aplicarDano` aplica
`Math.max(opts.piso || 0, bruto - s, 0)` no lugar de `Math.max(0, bruto - s)`.

**Controle negativo, feito e desfeito**: revertendo só a linha do `Math.max` em `aplicarDano` (a
peça central do conserto), `1v1-unissono` volta a ficar vermelho nas duas sementes padrão;
restaurando, fecha limpo. `npm run espelho` inteiro (16 células + a `1v1-fatal-simultaneo` da
rodada anterior) fecha sem divergência.

## Item 9 (fixture): 0 lances afetados, mesma razão estrutural de antes

`node scripts/test-lance.mjs`: **0 divergências**, 58 asserções (56 da rodada anterior mais 2
novas, assinaladas "Reforma da Centelha", testando a soma do lado do atacante em
`quaseAcertoDoEncontro`: `resolverGolpe` não lê `atacante.centelha` diretamente, só
`quaseAcertoDoEncontro` lê, e por isso a cobertura sintética dela bastou). A fixture
(`scripts/fixtures/lances.jsonl`) guarda `entrada.atacante.ataque` como STRING JÁ CONGELADA e
`entrada.danoQA` como valor já calculado no dia da coleta: nenhum dos dois se recalcula a
partir da ficha ao rodar o replay, então uma mudança de FÓRMULA (como toda a Fase 1) não tem
como aparecer no replay de um registro antigo, a mesma limitação estrutural que a rodada
anterior já tinha identificado para os itens 2a/2b. Não há nada para versionar ou propor nesta
rodada: zero é o número certo, não um zero por acidente.

## Fase 4 · já estava coberta

Os três itens da Fase 4 batem exatamente com os três consertos já fechados no despacho anterior
(`docs/simulacao/caixa/bancada-tres-consertos-despacho.md`, commit `de35d9c2`, ainda aguardando
veredito da Revisora quando este despacho chegou): força por Tick com o ciclo pós-ajuste,
`atributo+1-destreza-espada` de volta à seção E, e o teto de Pressão confirmado ligado (com
distribuição real provando que ele só não é alcançado nesta cena). Não refiz nada; só confirmo
aqui, como pedido.

## Verificação da Fase 1

- `npx tsc --noEmit`: limpo.
- `npm run validate`: verde (precisou de `node scripts/gen-bestiario.mjs` depois da mudança de
  fórmula, e de duas rodadas de `node scripts/reapontar.mjs`: a primeira ficou com citações
  quebradas por ter rodado ANTES do conserto do bug do piso, que moveu mais linhas; corrigido
  revertendo os documentos ao commit e reapontando uma vez só, depois de todo o código da fase
  estar pronto).
- `npm run build`: 111 páginas.
- `npm run espelho`: 17 células (as 16 de sempre + `1v1-fatal-simultaneo`), zero divergência.
- Travessão: zero nas linhas novas (conferido por `git diff` + `grep`, não por `git diff` puro).

## Pendências registradas (Fase 1, sem resolver)

- Jogadas só de Atributo: `+1 × Centelha` (a regra provisória do item 1), implementada em
  `centelhaSoAtributo` mas sem caminho de código nenhum a chamando ainda (não há jogada
  identificada no motor que seja "só Atributo" hoje).
- `quase-acerto.ts`'s `quaseAcerto()`: decisão sobre incluir a Centelha do alvo, não tomada.
- O bestiário inteiro (309/309 fichas) sem bloco `pericias`: o bônus de Centelha em jogada/
  Defesa de criatura sai 0 até essa frente ser aberta.
- `periciasDe()` (inimigos.json): a inversão usa o termo de Centelha linear antigo; inofensivo
  hoje (nenhuma ficha tem pericias), mas ficaria errado se alguma ganhasse.

## Fase 2 · Livro e página do Mestre (commit `9270be6f`)

Arquivos: `src/content/chapters/centelha.md`, `combate.md`, `coracao-do-sistema.md`,
`defesas.md`, `quase-acerto.md`, `src/data/regras.json`, `src/pages/mestre.astro`.

- Reescrita a descrição da Centelha: item 1 do "O que a Centelha faz" passa a descrever o teto
  pela Habilidade e o termo sem teto no dano.
- Reescritas as fórmulas de Ataque, Defesa e Dano em `combate.md`, e as três Defesas em
  `defesas.md`, para `2×menor(Centelha,Habilidade)` (jogada/Defesa) e `+Centelha` sem teto
  (dano). Exemplo do Kael recalculado: Esquiva 17→20, Defesa Social 7→4, Defesa Mental 13→10,
  conferido linha a linha contra `scripts/test-kael.mjs` (que já tinha esses números desde a
  Fase 1).
- Completada em `quase-acerto.md` a prosa do raspão que a Fase 1 tinha deixado só na fórmula
  (linha 22): agora o parágrafo e o exemplo numérico explicam que a Centelha do atacante soma e
  a do alvo desconta.
- Acrescentados os três degraus novos de Dificuldade (35 Lendário, 40 Mítico, 45+ Semidivino) em
  `regras.json.dificuldade`, na tabela de `coracao-do-sistema.md` e nas tabelas/descrições da
  página `/mestre` (`DESC_DIF`).
- `validate`, `tsc`, `build --force` (outra frente buildando `dist/` ao mesmo tempo; build
  simultâneo estava dando "Duplicate id" fantasma, resolvido com `--force`) verdes. Prova no
  `dist/` gerado: as quatro páginas (`centelha`, `combate`, `defesas`, `coracao-do-sistema`) e
  `/mestre` trazem o texto novo. Fase 2 é só texto; `espelho` não se aplica.

## Fase 3 · Briga (commit `7bbe593d`)

Arquivos: `src/data/armas.json`, `combate-tempo-bench.html` (regenerado),
`docs/pendencias/D-proezas-tecnicas.md` (D13).

- `armas.json`, entrada `desarmado`: `acerto` 0→1, `defesaArma` 0→1. Dano (`1d6−2 + Força`),
  tipo (Impacto) e Ticks (5) sem mudança, como o despacho manda ("continuam").
- Registrada a pendência da Proeza "punho como arma média" (D13), não implementada.
- `validate`, `tsc`, `build --force` e `espelho` (17 células, zero divergência) verdes.

## Correção pós Fase 2/3 (commit `914ad390`) · varredura de "onde mais a Centelha entra"

Ao reler o despacho completo (item 7 da Fase 1, "relate cada lugar tocado"), achei dois pontos
que a varredura inicial da Fase 1 tinha deixado passar:

- **`src/lib/bestia-editor.ts`** (o preview de ataque/dano do editor de bestiário no navegador):
  `rolagemAtaque()` somava Centelha pela regra antiga (flat, sem teto de Habilidade) e não somava
  Centelha nenhuma no dano. Corrigido para usar `ataqueCentelha()` de `calc.ts` (a mesma função
  que `calc.ts`/`combate-resumo.ts` usam) e somar Centelha no dano, igual ao gerador
  (`lib-bestiario.mjs`).
- **`scripts/lib-tempo.mjs`** (o motor que calibra `combate-tempo-bench.html` e
  `scripts/sim-ticks.mjs`): continua na regra antiga, mas por um motivo estrutural, não por
  descuido: ele só guarda a soma Atributo+Habilidade (`ah`), nunca os dois valores separados, e
  a fórmula nova precisa da Habilidade sozinha para capear. Não toquei o código (decisão de
  regra/arquitetura fora do despacho); corrigi só o comentário do arquivo, que dizia seguir
  `regras.json`/`defesas.md`/`centelha.md` (deixou de ser verdade). Registrado como **K35** em
  `docs/pendencias/K-combate-linha-do-tempo.md`, junto com `scripts/cost-examples.mjs` (o
  conferidor manual de XP, fora do `validate`), que tem o mesmo problema.
- Corrigida prosa que ficou parada com a fórmula antiga: a "Folha de referência" de
  `defesas.md`, a frase do "bônus de nível" em `centelha.md`, e quatro notas de `centelhaMult`
  em `regras.json` (`defesa`/`defesaMental`/`defesaSocial`/`ataque`), marcadas `DESATUALIZADO`
  com a explicação de por que o campo continua ali (`lib-tempo.mjs`/`cost-examples.mjs` ainda o
  leem).
- Registrada **D14** (custo de Habilidades a revisar depois da Parte B, adiado pelo próprio
  despacho, texto verbatim das "Pendências a registrar").
- **Migração 40 (arredondamento exato)**: não precisou de entrada nova em `docs/pendencias/`.
  Já está documentada dentro do próprio `supabase/migracao-40.sql`, com as duas opções (a)/(b)
  relatadas para o autor escolher e nenhuma aplicada.
- `validate`, `tsc`, `build --force` e `espelho` verdes.

## Fase 4 · consertos da bancada · confirmado coberto (sem commit novo)

Os três itens desta fase (ciclo por Tick pós-`ajustarAnatomia`, `atributo+1-destreza-espada` de
volta à seção E, teto de Pressão confirmado ligado) batem com os três já fechados no despacho
anterior, commit `de35d9c2`. Não refeito; só confirmado, como já registrado na seção "Fase 4"
mais acima.

## Fase 5 · Fichas de referência e medição (commit `de96fa77`)

Arquivos: `scripts/sim/calibrar.mjs`, `docs/calibracao/16-linha-de-base-centelha.md` (novo).

- `calibrar.mjs` ganhou um modo `--centelha` que substitui a grade de soma 6/8/12 pelas quatro
  fichas de referência do despacho (Típica espada, Típica montante, Especialista ofensivo,
  Defensivo), Centelha 0-6, nas três armaduras. As seções A-E (soma-based) e o relatório 15
  ficaram intactos: é um modo à parte, não uma reescrita do arquivo inteiro.
- Duas suposições que o despacho não escreve, registradas no próprio relatório 16 (seção
  "Suposições não escritas") e aqui: (1) o Especialista ofensivo usa soma 12 (Destreza+Armas)
  também em Centelha 0, porque o texto diz "desde C1" sem dar o número de C0; (2) Especialista e
  Defensivo lutam com espada longa, a única arma que o despacho amarra por nome às Típicas.
- Achado no caminho: `golpeExato()`/`testes()` (a "camada exata" da bancada) reimplementavam a
  conta do raspão por conta própria, sem o termo de Centelha do atacante (só o do alvo, e ainda
  assim só nos casos sintéticos). Não quebrava nenhum teste porque os pontos de concordância
  usavam Centelha 0 dos dois lados, e o teste manual usava atacante e alvo com a mesma Centelha
  (o que cancelava os dois termos por coincidência). Corrigido: os dois caminhos agora chamam
  `L0.quaseAcertoDoEncontro()` (a fonte única, `src/lib/lance.ts`) em vez de reimplementar.
- **Item g (conferência de sanidade), o número que a cláusula "pare e relate" cobra prova**: o
  erudito de Centelha 6 (Destreza 2, Armas 0, Esquiva 0) perde contra a Típica espada de
  Centelha 0 (0,0% de vitória, n=1000); com Armas 2 e Esquiva 2 passa a resistir (99,4% de
  vitória). Direção bate com o esperado; não precisou parar.
- Rodado com `--n` baixo (5) para validar a forma do relatório, depois `--n 1000` uma vez para a
  entrega final, marcada RASCUNHO.
- Fase 5 é só bancada: nenhuma regra nem catálogo foi alterado. `validate` e `tsc` verdes;
  `espelho` não se aplica (nenhum código de resolução de combate foi tocado).

## Correção do CI vermelho (commits `82da902d` e `56a15544`), depois das cinco fases

O CI real (GitHub Actions, "Validar dados e regras", job "Smoke · test-editor-bestiario") ficou
vermelho em quatro commits seguidos (`adfbb5d7`, `9270be6f`, `7bbe593d`, `914ad390`) por uma
asserção específica: `Def. Mental: card 22 = modal 25` (a criatura de teste, Treant). Os portões
locais (`validate`/`tsc`/`build`/`espelho`) não cobrem esse smoke test, só o CI completo cobre;
esse foi o próprio buraco que deixou a divergência passar sem eu perceber.

**Causa real**: `scripts/lib-bestiario.mjs`'s `periciasDe()` (que gera o campo `pericias`
publicado em `monsters.json`/`inimigos.json`, lido pelo editor do bestiário ao abrir uma
criatura) invertia Defesa Mental/Defesa/Defesa Social pela fórmula LINEAR antiga, desatualizada
desde a Fase 1. Para o Treant isso estimava Integridade 7 em vez da real 4, e o modal
recalculava com o valor errado. `src/components/BestaCard.astro` tinha uma SEGUNDA cópia da
mesma inversão, só para Integridade, com o mesmo erro. Corrigido com uma inversão de duas
hipóteses (a Centelha satura o teto da Habilidade, ou não; concordam exatamente no ponto de
virada, nunca ambígua), aplicada em `periciasDe()`; `BestaCard.astro` parou de duplicar e passou
a ler `i.pericias` direto (`82da902d`).

**Decisão do autor sobre um segundo ponto** (as duas casas usavam defaults DIFERENTES para
Integridade genuinamente ausente: `0` em `bestia-editor.ts`, `2` em `stat()`): padrão único `0`,
coerente com "sem Habilidade, sem bônus". Aplicado em `stat()`; `bestia-editor.ts` já usava 0.
Prova de concordância nova: `scripts/test-bestiario-integridade.mjs`, registrado em
`npm run validate` (`56a15544`).

**Achado no caminho, e corrigido**: o item 8 da Fase 1 (acima) estava ERRADO. Eu tinha testado
passando a ficha SOURCE (campo `skills`) direto para `stat()`, pulando `paraStat()` (quem
converte `skills`→`pericias` e `willpower`→`vontade` antes). Pelo caminho real
(`lerCriaturas()`→`paraStat()`→`stat()`): **0 das 309 fichas** ficam sem Esquiva ou Integridade;
o bônus de Centelha funciona normalmente nelas. A única lacuna real é **309 de 309 sem
`skills.sociabilidade`**, sem efeito prático (`stat()` já cai num fallback de perícia social
antes de zerar). **B15 fechada** com esta correção em `docs/pendencias/B-bestiario.md`.

`quaseAcerto()` (`src/lib/quase-acerto.ts`) virou fonte única: chama `quaseAcertoDoEncontro()`,
que mudou de `lance.ts` para `quase-acerto.ts` (`lance.ts` só reexporta, sem quebrar
`grid.astro`/`motor.mjs`). Centelha do dono soma, Centelha do alvo tratada como 0 (documentado no
código; não há UI consumindo essa função hoje, só testes). Varredura por outras reimplementações
da conta do raspão: achei mais uma, `scripts/sim-defesas.mjs` (função `eDanoQA`), um script
exploratório anterior às duas rodadas de Quase-Acerto/Centelha, fora de `package.json`, `validate`
e `smoke`, não citado em pendência nenhuma. Não toquei; fica para decisão do autor se apaga.

Registrada **A31** (energia/mana fora da Reforma, avaliar com as Artes, texto do autor verbatim)
e corrigida a nota desatualizada `morte.estadoDaMesa` de `regras.json`.

**Confirmado ao autor, sem inferência**: a Fase 5 não usa nenhum dado do bestiário nem o código
de Defesa Mental corrigido aqui (`calibrar.mjs --centelha` constrói as quatro fichas de
referência à mão, do fixture `kael.json`, sem importar `lib-bestiario.mjs`).
`16-linha-de-base-centelha.md` não precisou ser refeito.

CI completo do GitHub conferido verde nos dois commits (`82da902d`, `56a15544`), via
`gh run view`, confirmado independentemente pelo autor.

## É seguro dar `/clear`

Sim. As cinco fases e a correção do CI estão commitadas e empurradas para `main` (`adfbb5d7`,
`9270be6f`, `7bbe593d`, `914ad390`, `de96fa77`, `82da902d`, `56a15544`), o portão local
(`validate`/`tsc`/`build`/`espelho`, conforme cada fase pedia) está verde em todos, e o CI
completo do GitHub está verde nos dois commits de correção. As pendências que exigiam decisão de
regra (o `quase-acerto.ts` sem alvo real, a jogada só-de-Atributo, `lib-tempo.mjs`/
`cost-examples.mjs` desalinhados, o custo de Habilidades, a Proeza "punho como arma média",
energia/mana fora da Reforma) estão registradas em `docs/pendencias/` (D7 fechado por
substituição; D12, D13, D14, K34, K35, A31 novas; B15 registrada e depois corrigida), não
decididas por conta própria. Nada fica pendente de commit nem de push nesta sessão.
