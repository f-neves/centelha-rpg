# Rodada 15 · resposta da revisora

Revisora: aviso em `54d337c` (fecha o aviso), `BASE ee752d7` → primeira
metade `SHA 8e88004` (porta do Preparo) → segunda metade `b5ad27b`
(D15f/D15g: porta da Recuperação + regex do `test-cobertura-lib.mjs`),
`TOPO` igual a `b5ad27b`. As duas notas do TechLead no meio (reconciliação
de `origin/main`) e a nota da Executora sobre o atraso de I/O do `smoke` não
são conteúdo de regra, tratadas só como contexto.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `54d337c2efd2fefdd21eab2fe6a10544137d6275`. Batem.
- `git log --format='%h pais:%p' ee752d7..54d337c`: 5 commits, zero merges,
  um pai cada (`8e88004`, `3e3cae7`, `9003783`, `b5ad27b`, `54d337c`).
- `git diff --stat 98fa56a574d9201f89bd59555dfe7943055a2565 b81b27196c87bd5b3b2d24da0ad091df0ef752a4`
  (1ª metade, hashes pré-rebase citados no aviso): `522 inserções, 53
  remoções, 10 arquivos`. Bate exato com o publicado.
- `git diff --stat 9003783 b5ad27b34ea0036e6bba94febf7300583889b90a` (2ª
  metade, D15f/D15g): `148 inserções, 34 remoções, 5 arquivos`. Bate exato.
- Inventário do aviso ("O QUE MUDOU") bate com os dois diffs reais, arquivo
  por arquivo.

## O que rodei

`npm run validate`: saída completa, exit 0. As únicas ocorrências de
"falha"/"✗" na saída estão dentro de descrições de teste que passam (ex.:
"--check falha (código 1) com arquivo sem o bloco de carimbo" é uma
asserção sobre o comportamento esperado, não uma falha real) — conferido
grep por grep, zero falha de verdade.

`node scripts/test-combate-tempo.mjs` e `node scripts/test-cobertura-lib.mjs`
isolados: os dois passam sozinhos, sem depender do resto da suíte.

`node scripts/test-procedencia.mjs`: confirma as 80 citações de código
conferidas pela âncora, como publicado.

`npm run smoke`: não rodei a suíte inteira de novo (é longa, e o aviso já
tinha sofrido um episódio de atraso de I/O que não quero repetir). Achei
`/tmp/smoke2.txt` (55911 bytes, timestamp de hoje) batendo exatamente com o
relatado pela Executora: 904 linhas, zero `✗`/`✘`, terminando em "✓ espelho
de motor: os dois laços concordam". A coincidência exata dos números é
evidência forte de que é o mesmo run. Mas busquei "abortar"/"forahora" nesse
arquivo e no texto: **zero ocorrência** — os 9 portões do smoke não
exercitam os diálogos do Interpor, então o que o smoke prova aqui é só "a
página carrega e o motor geral não regrediu", não "o fluxo do Interpor
funciona".

## O ataque, antes de escrever qualquer veredito

Li a seção 6 inteira do `Pendencias.md` (L34 §6) antes de olhar o código: as
seis decisões de 07/09/2026 (quem leva o dano, teste, alcance/geometria de
reta, escudo, duração, reconciliação dos dois preços) são o que o código
precisa provar, não o que ele afirma sobre si mesmo.

**Código puro, lido contra a régua:**

- `src/lib/hex.ts` (`linhaHex`/`naLinhaHex`): reta em coordenadas cúbicas,
  cada ponto da interpolação passa por `arredondarHex` (resolve empate pela
  soma zero do cubo, `q+r+s=0`) — é o algoritmo certo para "sequência exata
  de casas que o segmento cruza, sem largura nem tolerância" (decisão 3b).
  Não reusa `afastar` (que arredonda por eixo e pode pular hexágono), como a
  régua exige.
- `src/lib/alcance.ts` (`alcanceInterpor`): corpo a corpo delega a
  `alcancaNoCorpoACorpo` (reach 1, ou 2 na haste); à distância usa
  `faixaDeDistancia` da arma do AGRESSOR e só então checa `naLinha`. Bate
  com "teto = alcance da arma original, medido do agressor, e só à
  distância também a reta" (item 3, decisão final).
- `src/lib/combate-tempo.ts` (`cobreGolpe`, `interposicaoConsumida`,
  `custoInterporRecuperacao`, correção de `acaoVazia`): a chave `aid` + Tick
  ABSOLUTO do golpe é a certa para "um golpe só, o que disparou" (item 5) —
  um segundo golpe do mesmo Tick (dupla/rajada) não bate na chave. O preço
  da Recuperação (`Math.max(piso, distância)`, piso 2) bate com
  `regras.json` (`ticksPorMetro: 1`, `minimoTicks: 2`) e com o catálogo
  §4.3 ("a distância em metros, mínimo 2" é piso, não fração).
- `acaoVazia` corrigida: uma ação só com `{interpoe: {...}}` deixou de
  contar como vazia. Testei a lógica das outras ~20 chamadas de
  `acaoVazia`/`acaoNo` em `grid.astro` por amostragem (não as 20 uma a uma):
  `faseEm` não é afetada porque já checa `temGesto` (que só olha `golpes`,
  não mudou) antes de qualquer outra coisa; o único lugar em que o valor
  novo muda um resultado visível é o contador `emAndamento` (linha ~10898,
  aviso de troca de sistema de tempo), e ali o efeito é o CORRETO — um
  interpositor com cobertura pendente genuinamente tem um compromisso em
  aberto que trocar o sistema afetaria. Não achei chamada que dependesse do
  comportamento antigo.

**Redirecionamento de dano em `grid.astro`, rastreado manualmente**
(`interpositorDoGolpe`, `resolverGolpeNoAr`, `folhaDaAcao`): o acerto e a
Defesa continuam calculados contra o ALVO ORIGINAL — `defesaBase`,
`ferimento`, `condicoesDefesa`, `defesaPerdida` não mudam de lado em lugar
nenhum que eu tenha achado. Só a Absorção e a Vida (`soakDe`, `pv`,
`pvMax`) trocam para `opts.alvoDano` quando há interpositor. É exatamente a
decisão do item 1: "o dano já rolado passa inteiro, e a Absorção é de quem
se interpôs" — nenhum novo teste de acerto contra o interpositor.
`aplicarDano` recebe `alvoDoImpacto` (interpositor OU alvo original) como o
parâmetro `alvo`, e como ele já lê `soakDe(alvo, tipo)` internamente, a
troca de identidade é suficiente sem reescrever a função.

**D15b (a flag `interpoe` só é limpa pelo MESTRE), conferido direto no SQL:**
li `supabase/migracao-28.sql`, função `jogador_declara` — ela só escreve a
própria `acao` (`p_comb`) e soma `pressao` no alvo (`p_alvo`); não há
caminho para um jogador limpar `interpoe` de uma peça terceira. A claim "é
inofensivo, a chave `aid`+Tick não se repete" está certa: uma flag presa
nunca vai casar com um golpe futuro por acidente.

**A investigação extra que fiz, além do pedido:** fui ver se
`scripts/test-grid.mjs` já tinha infraestrutura para testar estas duas
caixas de diálogo ponta a ponta, antes de aceitar "é fluxo de diálogo, DOM"
como razão suficiente para não ter e2e. Achei que SIM — a linha `test-grid.mjs:1023`
já clica `#tok-menu button[data-a="abortar"]` e `#ab-ok`; a linha
`test-grid.mjs:2902` já clica `data-a="forahora"`, seleciona um rádio
(`fh-alvo`) e `#fh-ok`. O padrão de clicar/selecionar/confirmar nessas duas
caixas específicas já existe no harness. Mas também busquei `golpesNoAr`/
`GOLPE_ADIADO`/`adiaGolpe` em `scripts/` inteiro e não achei NENHUM cenário
de e2e (nem em `test-golpe-caido.mjs`, que seria o lugar óbvio) que monte um
"golpe no ar" no navegador — sem essa fixture, não dá para clicar no
candidato de interposição porque a lista sai sempre vazia. Testar a
ponta-a-ponta do Interpor exige construir essa fixture primeiro, o que é
mais caro que "só adicionar mais um clique" mas mais barato que "reescrever
a infraestrutura de teste do zero".

## CORRIGE

1. **Nenhuma das duas portas do Interpor tem teste e2e (candidato →
   confirmação → golpe redirecionado) em `test-grid.mjs`/`test-espelho.mjs`.**
   Não bloqueia esta rodada: a lógica pura está coberta a fundo (`cobreGolpe`,
   `interposicaoConsumida`, `custoInterporRecuperacao`, `alcanceInterpor` nos
   dois regimes, `linhaHex`/`naLinhaHex`), a fiação em `grid.astro` foi lida
   linha a linha e é consistente com essas funções e com a régua, e o smoke
   não regrediu nada. Mas é a ÚNICA parte do mecanismo que mexe em Vida de
   uma peça terceira sem prova automatizada nenhuma — só sintaxe (`esbuild`)
   e ausência de crash (`smoke`, que nem toca o fluxo). Pedido: um cenário
   novo em `test-grid.mjs` com uma peça em golpe adiado e um interpositor ao
   alcance, cobrindo pelo menos um caminho de cada porta (Preparo e
   Recuperação) até o golpe cair e o dano aparecer na peça certa. Isto exige
   fixture nova (nenhum e2e atual monta "golpe no ar"), não é encaixe
   trivial no padrão existente.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo. As seis perguntas do Interpor já estavam fechadas antes desta
rodada (régua L34 §6), e nada no código levantou uma sétima.

## VEREDITO

CORRIGE-E-SEGUE
