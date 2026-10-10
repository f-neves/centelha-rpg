# 153 · Revisora · Armas de distância e corpo a corpo: correção da 4a, rodada 4b e complemento (`0dcb1e56`)

Pino: `0dcb1e56` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada com `git switch -C revisora 0dcb1e56` depois de `merge-base --is-ancestor`
passar; o veredito 152, `83d84cf5`, é ancestral). Escopo: três commits, `6628d27b` (correção da 4a), `8a7a6eb0` (4b) e `0dcb1e56` (complemento: D-068, os dois Punhos,
D-088, Punhos 1/1/3 na ficha). Fonte do julgamento: os commits congelados contra o plano (rodada 4b), D-068 (texto de `e462681a`), D-070, D-065 item 3, D-082, D-083,
D-087, D-088, D-054, N22, K18 e o 2b §0 a §4. As mensagens dos commits tratei como hipótese.

**Resultado: PROCEDE, sem BLOQUEIA.** Os dois CORRIGE do 152 estão fechados. A reforma do corpo a corpo bate com a D-082/D-083 em tabela, texto, `regras.json` e catálogo; a leitura c
da D-088 não está no texto; a ficha não mudou a penalidade da mão inábil; Grid, `equip.ts` e `combate-resumo.ts` não foram tocados. **Um CORRIGE que existia no pino e já foi fechado depois
do pino** (a frase da dupla mista, ponto f, fechada por `cda8845d`), e quatro sugestões sem veredito.

**CI da faixa (§11):** no sha do pino, `0dcb1e56`: `Validar dados e regras` **verde**; `Deploy` **cancelado** (causa não investigada por mim; o próximo push de `main` publica o conteúdo). No `main` de agora, `85461925`: `Deploy` verde, `Validar` ainda em andamento quando escrevi. Rodei por mim, no pino, todos verdes:
`test-capitulo-armas` (56 estragos), `test-catalogo-distancia` (20), `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-kael`, `validate-data`, `test-portoes`,
`test-procedencia`, `test-travessao-capitulos`, `test-links-base`, `test-quase-acerto`, `test-folha-arremesso` e os geradores. Reexecutei os três testes de armas também em `85461925` (verdes).

## 1 · A correção da 4a, `6628d27b` (pergunta 1): os dois CORRIGE do 152 estão fechados

1. **Recarga em `regras.json`:** `combate.movimento.recarga.texto` agora diz "O tiro sai no Tick do Golpe, como em qualquer arma de tiro", e `.porque` diz "o Preparo do tiro é `velocidade - 1 - recuperação` (D-082)...
   Besta Grande (Velocidade 15, Preparo 12, Recuperação 2) fica doze Ticks comprometido". **Conferido contra a reforma do tiro:** Besta Grande V15 = 12/1/2 ✓. Casa com o capítulo (doze Ticks, Tick do Golpe).
   Mutações minhas, em cópia: o texto voltando a "último Tick do ciclo" **falha**; o `porque` voltando a "catorze Ticks" **falha**. O texto da Recarga está preso.
2. **`test-forca-arco`, a expressão inteira nas duas mãos:** as duas asserções casam agora `const capF = forcaNoArco(atk, atk.forcaCap != null ? Math.min(forca, atk.forcaCap) : forca);` e a de `capFI` com `inabilArma`.
   Mutações minhas, uma por vez no `ficha-engine.ts` (restaurado na hora): `capF` sem o `forcaCap` **falha**; `capFI` sem o `forcaCap` **falha** (era o furo do 152); `capF` ou `capFI` sem a função **falha**; a função com a arma errada **falha**.
   As outras dez do `calc.ts` e do `combate-resumo.ts` seguem como no 152 (a única que passa é "arremesso incluído", mutante equivalente, já registrado).
3. **A frase "(Arco Longo com Força 3: 250 m)":** a tabela da Máxima do capítulo dá Arco Longo, Força 3 = 250 ✓. **Não está presa por teste** (tirar a parentética passa), mas é o que a sugestão do 152 pedia, só frase.

## 2 · A rodada 4b, `8a7a6eb0` (pergunta 2)

- **A tabela "Preparo, Golpe e Recuperação" do corpo a corpo:** Leve 5 = 1/1/3, Média 6 = 2/1/3, Haste média 6 = 2/1/3, Haste de Guerra 7 = 3/1/3, Pesada 7 = 3/1/3, Punhos 5 = 1/1/3 ✓ contra a D-082 e o 2b §0;
  P + G + R = V em todas ✓; regra geral "Preparo = Velocidade − 1 − Recuperação, Golpe sempre 1 Tick" ✓. A linha da Arte ("Velocidade − 1") segue como estava (4c).
- **Normal:** "−2 até a próxima ação" nos Ticks da ação e custo "2 × Velocidade + 2" ✓ (D-078, C-047/C-048; sem penalidade de fase nova).
- **Investida de toda arma:** Preparo × 4 andando e × 7 investindo ✓ (Leve 1: 4 e 7 m; Média e Haste média 2: 8 e 14; Haste de Guerra e Pesada 3: 12 e 21); o exemplo da Sora (martelo, Preparo 3: 12 e 21 m) refaz ✓;
  a "carga voluntária" da leve saiu ✓. **Golpes no mesmo instante:** adagas (Preparo 1) no Tick 3 e espada longa (Preparo 2) no Tick 2, os dois Golpes no 4 ✓.
- **Rajada (D-083):** `P → G → G → … → R`, −1d6 acumulando, +1 Tick de Golpe e +1 de Recuperação por golpe extra (ciclo = V + 2 por golpe extra), teto Leve 3, Média 3, Haste média 2, Haste de Guerra 2, Pesada 2, ciclos
  5/7/9, 6/8/10, 6/8, 7/9, 7/9 ✓ (refiz cada ciclo). Só corpo a corpo ✓. Bordas (alvos diferentes, só o Preparo interrompível, sem alvo os golpes se perdem sem reembolso, uma só fonte de golpes múltiplos, Investida e Mirar só no
  primeiro golpe) batem com a D-083.
- **Empunhadura dupla:** par de leves 1/2/2 ciclo 5 e média na mão hábil 2/2/3 ciclo 7 ✓ (D-083); "o segundo Golpe come um Tick da Recuperação" no par de leves ✓; a Ambidestria ficou como estava ✓ (a frase de −2 em vez de −4
  já existia antes da 4b).
- **Catálogo:** Lança passa a 1d6 e deixa de ter `forcaMult` (soma Força × 2 em duas mãos, como toda haste), Defesa +2; Alabarda V7, Acerto +0, Defesa +0; Lança Longa Defesa +0 e **segue com `forcaMult` 1** (a "exceção da Lança
  Longa", dita no texto) ✓. A tabela de Classes e a de exemplos do capítulo de Armas batem com `armas.json`. O Bastão ficou leve (V5, uma mão), e a D-082 o lista entre as hastes médias: **a Executora registrou como N22**, o que é o certo.
- **`regras.json` `combate.pgr.reforma.{corpoACorpo, investida, rajada, dupla}`:** os valores batem com o capítulo; **nada lê `reforma` senão a ficha (`linhaPGR`) e os testes** (busquei `pgr` e `reforma` em `src/` e `scripts/`).
  A fórmula velha `combate.pgr.preparo`, o `combate-tempo.ts` e o Grid não mudaram (`git diff --stat` do `src/`: cinco arquivos, nenhum do Grid, da mesa, do motor, de `equip.ts` nem de `combate-resumo.ts`).
- **N22:** os bullets novos cobrem o corpo a corpo no dado e no livro e não no Grid, o catálogo (Lança, Alabarda, Lança Longa, Bastão), a ficha mostrando a régua nova contra o Grid na velha, e a D-088 sem leitor no Grid.

## 3 · O complemento, `0dcb1e56` (pergunta 3) e os pontos de cuidado

- **(a) A leitura c da D-088 não está no texto.** O parágrafo de Luta desarmada diz que a mão nua bloqueia qualquer ataque armado, o ataque perde os dados de Margem e o dano da arma passa; "arma é todo ataque que não
  seja desarmado" (garra, mordida e chifre contam; contra um soco o Bloqueio com as mãos para tudo); a armadura funciona contra o dano que passa; a mão que conta como arma segue a D-070. **Nenhuma frase soma punho com arma**:
  a frase "arma ou escudo não somam com o corpo" (D-065 item 3) ficou. Meu controle negativo: injetei "Com uma arma na outra mão, o punho soma +1 ao Bloqueio da arma" em Luta desarmada e o teste **falha**.
- **(b) A ficha não mudou a penalidade da mão inábil.** O diff do `ficha-engine.ts` entre `83d84cf5` e `0dcb1e56` tem oito linhas, todas no `linhaPGR`; `inabilPen: ambi ? 1 : 2` está onde estava, e o "guarda −4" do "Ataque duplo" também.
  (Nenhum teste dos dois que rodei cobre `inabilPen`; mudá-lo para 3 passa, mas **o diff prova que não foi tocado**.)
- **(c) Grid, `equip.ts`, `combate-resumo.ts` intocados** ✓ (cinco arquivos em `src/`: dois capítulos, `armas.json`, `regras.json`, `ficha-engine.ts`).
- **(d) O texto da D-068 casa com `e462681a`** byte a byte (comparei o parágrafo "Nada dá ataque extra sem dizer que dá" com o do commit de origem). A posição, na seção da Rajada onde se fala de golpes a mais, é a do despacho.
- **(e) O exemplo da D-088** do autor (Bloqueio 14, +1 de cada punho = 16; Esquiva 8; acerto 15) refaz e está no texto; "arma = todo ataque que não seja desarmado" também. Mutação minha em "16" e em "perde os dados de Margem" **falham**.
- **(f) A frase da dupla mista:** o número está certo, **mas no pino ela dizia "o ciclo da espada, 7 Ticks"**, e a espada longa é V6 (ela sozinha é 6; o 7 é o ciclo da *dupla* com arma média, 2/2/3). **Era um CORRIGE no pino**, e a Executora o achou sozinha e fechou
  em `cda8845d` ("o ciclo da dupla com a espada, 7 Ticks (a Velocidade 6 dela mais 1, como na tabela acima)", e o teste acompanhou); `85461925` corrige a parentética que era do Arquiteto na D-083. Li os dois diffs: corretos.
  **O 7 está certo contra a D-082/D-083** (par de leves = 5, média na mão hábil = 7, média = V6 + 1).
- **(g) A ficha mostra Média 2/1/3 e Pesada 3/1/3 e o Grid a régua velha: medido na tela.** Edge headless contra `dist/` do pino, `/ficha` em 1300 px, mão hábil trocada arma a arma, linha "No tempo":
  Punhos e Adaga 1/1/3; Espada Longa e Lança 2/1/3; Alabarda, Montante e Martelo de Guerra 3/1/3 (e, por dados, **todas as 19 armas de corpo a corpo caem na sua classe pelo id, nenhuma pelo fallback**). Sem erro de página.
  **A divergência está na N22** (Punhos 0/1/4 no Grid) e **nada além da ficha e dos testes lê a chave nova**.
- **(h) As afirmações de prova das mensagens, contra o que eu medi:**
  - `8a7a6eb0`: "48 estragos" e "20 estragos" ✓ (hoje 56 e 20, com os 8 do complemento). "O Grid segue a régua velha" ✓. "Controle negativo feito pela Executora anterior e NÃO refeito" **é dito com a ressalva**; refiz por conta
    própria cinco dos sete (Preparo da Leve, Alabarda V6 no capítulo e no catálogo, teto da Rajada de Haste de Guerra, ciclo da dupla com média, `forcaMult` de volta na Lança): **todos falham**. Da Investida refiz a linha da Média e o exemplo da Sora, não a da Pesada, e não refiz
    "a Defesa da Alabarda no catálogo" (refiz a da Lança Longa e a da Haste de Guerra na tabela de Classes, que falham).
  - `0dcb1e56`: "8 estragos novos acusados (56 no total)" ✓; controle negativo da leitura c ✓ (refiz). "`/ficha` mostra Preparo 1 · Golpe 1 · Recuperação 3 para os Punhos" ✓ (medi). **Uma imprecisão de redação:** o resumo diz "a ficha passa a mostrar os Punhos
    (e todo o corpo a corpo) como 1/1/3"; só a Leve e os Punhos são 1/1/3, a Média é 2/1/3 e a Pesada 3/1/3 (a seção FICHA E DADOS da mesma mensagem diz certo). Sem consequência.
  - "L-simulacao-simultaneo.md: duas citações reapontadas, o arquivo estava limpo antes" ✓: o diff é de duas linhas (`ficha-engine.ts:1676-1677` para `1684-1685`), e conferi que `fah` e `faa` estão em 1684 e 1685.
  - `6628d27b`: as cinco mutações da mensagem (capF, capFI, "catorze", "último Tick do ciclo", a frase do Normal) **todas refeitas e falham**.

## 4 · Os testes: minhas mutações (pergunta 4)

Cinquenta e seis mutações (52 da 4b e do complemento, 4 da correção da 4a) em cópias da árvore (capítulos de Combate e de Armas, `armas.json`, `regras.json`, `ficha-engine.ts`), uma por vez, contra `test-capitulo-armas` e `test-catalogo-distancia`; mais as da correção da 4a.
**Pegas: 43 de 56.** Entre as pegas: cada linha da tabela de Preparo/Golpe/Recuperação (Leve, Média, Haste de Guerra, Punhos), o teto e o ciclo da Rajada, os dois ciclos da dupla, a dupla mista (7 para 6; "mais lenta" para "mais rápida"),
a cláusula dos Punhos (teto, "só as mãos"), o parágrafo da D-068 (removido e trocado), a Investida (8 m, Sora, "carga voluntária" de volta), "Tick 3" dos golpes simultâneos, "2 × Velocidade + 2", a remissão da D-088, o parágrafo da D-088
(Margem, dano, exemplo 16, "garra, mordida e chifre"), a leitura c injetada, o "Contra lâmina" de volta, a tabela da Lança e da Alabarda, a Defesa da Haste de Guerra, cada chave nova de `regras.json` e cinco campos de `armas.json`.
**Não pegas, todas em prosa ou na ficha que o teste não lê** (nenhuma contradiz a mensagem, que só promete o que lista):
`−1d6` da Rajada trocado por −2d6; "só corpo a corpo" removido; "só o Preparo é interrompível" invertido; "2 ataques para a Guarda" dos Punhos trocado por 1; "−2 em vez de −4" da dupla trocado por −3 (texto que já era anterior à 4b); a parentética "(Arco Longo com Força 3: 250 m)" removida; "Haste média +2" trocado por +1 na prosa; a exceção da Lança Longa removida da prosa;
"Esquiva 8" do exemplo da D-088; "a armadura funciona" trocado por "não funciona"; e **as três mutações do `linhaPGR`** (ler a reforma só em comentário; o `find` por id trocado; a penalidade da mão inábil). A do `linhaPGR` é a que mais interessa:
**o teste só confere que o texto `combate?.pgr?.reforma?.corpoACorpo` aparece no `ficha-engine.ts`**, o que um comentário satisfaz. Hoje a ficha está certa (medi). Entra como sugestão 1.
Mutante equivalente: ignorar os Punhos no `find` (cai no `leve`, que é 1/1/3 também).

## Sugestões de frase e de teste (D-087), sem veredito

1. **Exercitar o `linhaPGR`, não só casar o texto:** uma asserção que, para cada arma de corpo a corpo do `armas.json`, reproduza o `find` (Velocidade e id) contra `corpoACorpo` e exija Preparo/Golpe/Recuperação da classe dela, ou que a regex case
   a expressão inteira como fez o `test-forca-arco`. Hoje o furo é o mesmo do CORRIGE 2 do 152, em tamanho menor: o que protege a ficha é a leitura de quem editar.
2. **A ficha só tem a régua nova no corpo a corpo.** Com a mão trocada: Arco Curto "5/1/0" (o livro, 4/1/1), Besta Grande "14/1/0" (12/1/2), Azagaia "4/1/1" (Arremesso pesado, 3/1/2). Está declarado (a N22 diz "Distância, arremesso e Arte continuam, na ficha, na
   fórmula velha do motor"), mas a reforma do tiro já mora em `reforma.tiro` desde a 4a, e o mesmo `find` do `linhaPGR` a leria com três linhas a mais. Escolha da Executora; o que importa é que quem abre a ficha hoje vê dois critérios na mesma linha "No tempo".
3. **Pinar no texto o que já é decisão:** "−1d6 acumulando" e "só corpo a corpo" da Rajada, "2 ataques para a Guarda" dos Punhos e o "Esquiva 8" do exemplo da D-088; umas cinco linhas no teste que já lê o `combate.md` e o de Armas.
4. **Redação da mensagem do complemento:** onde diz "todo o corpo a corpo como 1/1/3", dizer "a Leve e os Punhos como 1/1/3, a Média 2/1/3, a Pesada 3/1/3".

## O que ficou sem medir (§9)

- **Só Edge headless e `dist/` local.** Leitura em 390 e 1300 px de `/regras/combate/` (tabela de P/G/R, Rajada, dupla, Investida) e `/regras/armas-e-armaduras/` (Classes, exemplos): sem erro de página, **sem rolagem horizontal da página** (scrollWidth = largura nas duas),
  as tabelas legíveis; a de P/G/R e a da dupla rolam por dentro do próprio quadro a 390 px (474 e 401 px de conteúdo para 358), que é o padrão do site. **Foi amostra, não varredura da página inteira.**
- **A Luta desarmada e o exemplo da D-088 foram lidos no HTML gerado, não conferidos em foto.**
- **A ficha ao vivo foi medida só para a mão hábil**; a mão inábil, a Ambidestria e o Ataque duplo não foram exercitados na tela (o diff prova que não foram tocados).
- **Travessão, "Perícia" e coautoria:** varri as linhas adicionadas das três faixas (`83d84cf5..6628d27b`, `..8a7a6eb0`, `..0dcb1e56`) e as três mensagens: **nenhuma tem travessão ou coautoria**; "Perícia" só aparece na nota da Executora sobre a chave `gen-cap-pericias`.
  Não revisei além do pino senão `cda8845d` e `85461925`.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/153-revisora.md` e `docs/simulacao/caixa/progresso-revisora-153.md`. Mutei cópias dos capítulos, de `armas.json`, de `regras.json`, de `ficha-engine.ts` e dos testes fora do repositório; nos três
arquivos de `src/lib` mutei o arquivo no lugar e o restaurei na hora; nenhum arquivo rastreado foi tocado ao final.
