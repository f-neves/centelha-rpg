# Regra do Quase-Acerto + Simultâneo + Vida negativa + bancada · veredito da Revisora

**PROCEDE em todos os itens**, com uma nota importante no item 3 (não bloqueia, mas precisa ficar
registrada).

- **Árvore:** branch `revisora`, reancorada em `d41483b`, depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (`8db4acc`,
  inventário E01/E06) já estava em `main`.
- **Despacho:** `regra-quase-acerto-bancada-despacho.md` (`a4a6f33`). **Relato:**
  `regra-quase-acerto-bancada-executora.md`. **Commits julgados:** `1b933b5` (código) e `d41483b`
  (relato final). Tratei `calibrar.mjs`/`motor.mjs`, inclusive o que veio de fora
  (`bd06f45`/`db5e7c8`/`960ad87`), como código novo, linha por linha, não só o que a Executora
  escreveu do zero, como o despacho pediu.

## O que rodei eu mesma, não só li o relato

`npm run espelho`, `npm run validate`, `npx tsc --noEmit`, `npm run build`: **todos verdes**,
rodados por mim nesta árvore. `node scripts/test-lance.mjs`: **0 divergiram, 56 asserções**,
igual ao relato. `node scripts/test-quase-acerto.mjs`: verde, o exemplo do capítulo XII bate
(couro 4→3). `node scripts/gen-pendencias.mjs --check`: 334 itens, 7 a mais que o pino anterior:
bate com as 7 pendências novas do item 7 (D9 já vinha de antes; G72, K33, A30, D10, D11, I15 são
as seis desta rodada, uma em cada tema, conferidas por citação).

## Item 2 (Regra do Quase-Acerto) · PROCEDE, com controle negativo próprio

- **2a/2b (fórmula e dado):** `regras.json.quaseAcerto.porClasseArmadura.leve.reducao` = 1,
  conferido. O desconto de Centelha está em `lance.ts`.
- **2c (o piso), controle negativo:** revertido `liquido = Math.max(entrada.danoQA, bruto -
  entrada.alvo.soak, 0)` para a forma antiga (sem o piso) em `lance.ts`, rodei
  `node scripts/test-lance.mjs`: **390 divergências**, exatamente nos mesmos 390 lances e nos
  mesmos dois campos (`danoLiquido`, `pvDepois`) que o relato reporta. Revertido de volta, teste
  volta a 0 divergências. O piso é real e é o que sustenta a contagem, não coincidência.
- **2e (fixture), reconferência independente:** diffei `lances.pre-quase-acerto-2026-09-27.jsonl`
  contra `lances.jsonl` campo a campo, nos 1315 lances: **390 mudaram, e em cada um dos 390 só
  `saida.danoLiquido` e `saida.pvDepois` diferem**: nenhum outro campo (entrada, sorteio,
  veredito, absorção) vazou pela re-derivação. Também conferi a exclusão do Gate de Perfuração:
  reconstruí `gateResvalou` a partir do próprio `test-lance.mjs` e apliquei aos 1315 lances da
  fixture antiga. **243 lances têm o gate resvalado, e nenhum deles está entre os 390
  re-derivados**, confirmando que a exclusão pedida foi respeitada.
- **Os call-sites (2d), a pergunta do Arquiteto sobre um quinto lugar:** contei seis ao todo,
  não cinco: `lance.ts` (fonte), `grid.astro` (`raspaoBase`/`margemBase`), `motor.mjs`, mais os
  **três que a própria Executora achou e corrigiu** por conta própria:
  `quase-acerto.ts::quaseAcerto()` (cards sem alvo, ganha 2b automaticamente por ler
  `regras.json`, correto não ter 2a por não ter alvo), `contaDoLance` e a caixa `pintarDano`
  (o lance ROLADO À MÃO). Verifiquei os dois últimos no código: `contaDoLance`
  (`grid.astro:10477`) tem `Math.max(e.danoQA, bruto - abs, 0)`, o mesmo piso, com um comentário
  que **admite** ser uma repetição da conta e não uma chamada à função partilhada (honestidade que
  vale registrar: não finge fonte única onde não há). Não achei um sétimo lugar: `grupo.astro` e
  `referencia.astro` também citam `quaseAcerto`/`raspão`, mas só EXIBEM a tabela lendo
  `regras.json` direto, sem reimplementar conta nenhuma: não precisam de conserto.
- **O texto do livro (2d):** `quase-acerto.md`, o exemplo do capítulo bate exatamente com
  `test-quase-acerto.mjs` (couro: 4 − 1 = 3, menos a Centelha).

## Item 3 (Simultâneo) · PROCEDE, mas com uma nota que precisa ficar registrada

O conserto em si está certo por leitura de código: `motor.mjs` percorre `emPe` (o retrato da
abertura do Tick) em vez de reconsultar `dePe()` com uma guarda de `vivo`; `grid.astro` ganhou
`DE_PE_AO_ABRIR` para as mesmas duas funções (`golpeMaisCedo`/`golpeVencidoNaFaixa`) não perderem
o cartão de quem caiu no meio do Tick. Isto bate com o que o despacho pediu.

**Tentei um controle negativo e não consegui reproduzir a divergência.** Revertidos os dois
lados (separados e depois juntos: só `motor.mjs`, só `grid.astro`, os dois), `npm run espelho`
continuou fechando **sem nenhuma divergência** nos quatro cenários fixos de sempre, inclusive
na célula/semente que o relato cita como onde a divergência apareceu de verdade antes do
conserto (`4x4-media`/`4x4-aberto`, semente `771107`). Fui a fundo: instrumentei `motor.mjs`
(código já corrigido, sem mudar comportamento) para contar quantas vezes a condição que o `if
(!vivo(c)) continue` checava chegaria a disparar nos cenários padrão do espelho. **Resultado:
zero.** Nenhum atacante, em nenhum dos quatro cenários fixos com as duas sementes de sempre,
morre no meio de um Tick com outro golpe ainda pendente NESSE MESMO Tick. **A conclusão que dá
para sustentar: o espelho, do jeito que roda hoje (`npm run espelho`, os cenários fixos), não
exercita a correção do item 3, nem a de `motor.mjs` nem a de `grid.astro`.** Isso não quer dizer
que o conserto esteja errado (a leitura de código sustenta que está certo, e a descrição do
`decisoes-fase3`/despacho bate com o que o código faz agora); quer dizer que "o espelho continuou
verde" não é PROVA de que o item 3 funciona, é só prova de que ele não quebrou o resto. A
divergência real que o relato descreve provavelmente aconteceu num estado intermediário do
trabalho da Executora (um lado corrigido, o outro não, o que faria os dois discordarem um do
outro mesmo sem a condição "morrer no meio do Tick" disparar em si: não cheguei a reproduzir
esse estado específico). **Registro como nota, não como CORRIGE**, porque o item pede uma
correção comportamental cuja lógica está certa por inspeção; mas recomendo ao Arquiteto considerar
um cenário de bateria pequeno e determinístico desenhado especificamente para forçar "atacante cai
no Tick com golpe pendente", porque hoje esse ramo de código não tem nenhum teste automatizado que
o exercite de verdade.

Os testes vizinhos (`test-golpe-caido.mjs`, `test-l84-caidofila-mesa.mjs`,
`test-l84-levantar-mesa.mjs`) continuam verdes, então o L84 não regrediu.

## Item 4 + 4b (Vida negativa) · PROCEDE

Busquei `limiteDaMorte` no repositório inteiro e achei mais pontos do que o relato descreveu como
"5 + o do banco": `motor.mjs` (1), `artes-grid-mesa.ts` (2), `grid.astro` (pelo menos 5 chamadas
distintas de `limiteDaMorte`, cobrindo `baixarVida` nos dois ramos (mestre e jogador) e
`pintarDano`). Busquei também por `Math.max(0` associado a `pv`/`vida` no mesmo conjunto de
arquivos: **zero restantes**. A migração 40: recomputei `-Math.ceil(pvMax/2)` para os mesmos sete
PV máximos do relato (1, 5, 20, 34, 35, 40, 41) e bate exatamente com o SQL
(`v_limite := -ceil(v_pv_max::numeric / 2)`), e a leitura do "lado generoso" para Centelha
desconhecida é fiel a `limiteDaMorte()` (`centelha == null` cai em `comCentelha`, que arredonda
para cima, isto é, um limite mais negativo/generoso). `node scripts/gen-carimbo-migracoes.mjs
--check` e `node scripts/test-carimbo-migracoes.mjs`: verdes, a 40 está entre as 39 conferidas.
Concordo com a decisão de não decidir entre as duas opções de arredondamento exato (coluna nova
vs. parâmetro): as duas estão bem descritas, com o problema de privacidade da segunda exposto sem
meias-palavras, e cabe ao autor escolher.

## Item 6 (bancada) · PROCEDE, H7 conferido como parada real

Chequei a alegação de que o motor não modela alcance: `faixaNaFolha` (`src/lib/alcance.ts:119`)
devolve só uma FAIXA classificatória (curto/médio/longo) para exibição, nunca um modificador
numérico que entre em `resolverGolpe` ou `decisaoAutomatica`. Não achei nenhum caminho de código
onde a distância além da inicial da cena mude o resultado de um ataque à distância. A parada do
H7 é real, não preguiça: rodar Arremesso × Atirador na cena adjacente de hoje mediria o mesmo
duelo corpo a corpo com etiquetas diferentes, como o relato diz. `docs/pendencias/H-arremesso.md`
tem H7 registrado.

## O que não achei

Nenhum lugar reimplementando a conta do raspão fora dos seis já corrigidos, nenhuma fixture
vazada além de `danoLiquido`/`pvDepois`, nenhum clamp de PV em zero restante, nenhuma pendência
do item 7 fora do lugar, nenhum travessão em prosa nova (Node, escopo correto: `a4a6f33a..d41483b`,
não a faixa inteira desde meu último veredito), nenhum caminho sujo tocado.

## CI

`1b933b5` e `d41483b`: `Validar dados e regras` **success**.

## Adendo (28/09/2026) · fechamento da nota do item 3 · PROCEDE

A nota acima ficou fechada. Commit `99652358` (mesclado em `cdf4a8c6`, sem conflito): cena nova
`1v1-fatal-simultaneo` no espelho (`fatal` × `fatal`, semente 10, teto 20), com asserção própria
confirmando que os dois lados derrubam um ao outro no mesmo Tick (12): exatamente o buraco de
cobertura que eu tinha apontado. No caminho, achou um TERCEIRO lugar com o mesmo bug do item 3:
o helper `E.devido` (dentro do bloco `ESPELHO_LIGADO`, `grid.astro`), que reimplementava a busca
de golpe devido sem a exceção `DE_PE_AO_ABRIR`. Isso explica por que meu controle negativo
anterior não conseguia fazer nada divergir: eu revertia `motor.mjs` e `grid.astro`
(`golpeMaisCedo`/`golpeVencidoNaFaixa`), mas o PRÓPRIO DRIVER do espelho, por trás do bug dele
mesmo, nunca chegava a pedir o segundo golpe do duplo abate para comparar.

**Fiz meu próprio controle negativo, diferente do da Executora** (ela testou `motor.mjs` sozinho e
`E.devido` sozinho; eu testei os TRÊS lugares revertidos JUNTOS, e depois só `E.devido` sozinho
com os outros dois já corrigidos):

1. **Os três revertidos ao mesmo tempo** (`motor.mjs` de volta a `dePe()` + `if (!vivo(c))
   continue`, e as três ocorrências de `DE_PE_AO_ABRIR` em `grid.astro` voltando a `foraDaFila(c)`
   puro): a cena nova falhou exatamente na asserção nova (`✘ os dois lados golpeiam e derrubam no
   MESMO Tick`), com só 3 lances em vez de 4 nos dois lados (o segundo golpe do duplo abate
   sumiu dos dois).
2. **Só `E.devido` revertido**, com `motor.mjs` e as outras duas funções de `grid.astro` intactas:
   a cena também falhou, mas de um jeito diferente e específico do DRIVER: `sem divergência`
   ficou **vermelho** (mesa parou no Tick 12 com 3 lances, laço foi até o teto com 20 Ticks e 4
   lances), reproduzindo com exatidão o padrão que a Executora descreveu ("mesa para no Tick 12,
   laço vai até o teto"). Confirma que o achado dela é real e que os três lugares (não só dois)
   precisavam do mesmo conserto.

Revertido de volta nos dois casos, `node scripts/test-espelho.mjs` fecha limpo, incluindo a cena
nova. `npm run validate`, `npx tsc --noEmit` verdes. Travessão zero no adendo (`e5b5df74..cdf4a8c6`).

**Efeito colateral de `E.devido`, checado:** o objeto `E` que carrega esse método só existe dentro
de `if (ESPELHO_LIGADO)` (a URL `?espelho=1`), e o método é exposto em `window.__ESPELHO.devido()`.
O único chamador, no repositório inteiro, é `scripts/test-espelho.mjs` (dois `p.evaluate(() =>
window.__ESPELHO.devido())`, o driver do próprio teste). Nenhuma tela que um jogador ou mestre
real usa passa por esse helper. O achado corrige o instrumento de medição, não um caminho de
produção, e não tem como ter vazado efeito colateral para fora do espelho.

CI: `cdf4a8c6` ainda em andamento no momento deste adendo (não vi o run próprio de `99652358`
isolado, só o da mesclagem); `e5b5df74` (meu veredito anterior) e `d41483b` já confirmados
success. Se `cdf4a8c6` terminar vermelho, aviso.
