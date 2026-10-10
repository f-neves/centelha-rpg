# 157 · Revisora · Rodada 4c: a Arte sai no Tick do Golpe (`b56d78f5`)

Pino: `b56d78f5` (branch `revisora` reancorada com `git switch -C revisora b56d78f5`; o 156 é ancestral). Escopo: o commit único da 4c (cinco arquivos: `combate.md`, `artes/regras.astro`, `regras.json`, `test-capitulo-armas.mjs`, `CONJURACAO.md`).
Fonte do julgamento: o meu 155 (a conta), a D-084, a D-082, o 2b §3 e §4 item 7, o plano (rodada 4c) e a nota do usuário (regra geral do esticar com exemplo da V5, sem tabela de V6 e V7; Abortar sem exceção para a Arte). A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, CORRIGE, PERGUNTA ou ESCALA.** A conta do 155 está escrita sem erro nos três lugares (capítulo, página, dado), o Grid e os testes que pinam o Tick antigo ficaram intocados, e o teste da 4c é forte. Cinco sugestões de teste e de redação, sem veredito.

**CI (§11):** o `Deploy` de `b56d78f5` está verde e o `Validar dados e regras` estava **em andamento** quando escrevi; **não afirmo o Validar verde**. Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (80 estragos, como a mensagem diz),
`test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, **`test-artes-grid`, `test-arte-na-mesa`, `test-simultaneo`, `test-espelho`** (os testes do Grid e da mesa que pinam o último Tick, intocados e verdes), `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`,
e `npx astro build` na minha árvore (110 páginas). **O smoke eu não rodei.**

## 1 · A conta, escrita nos três lugares

- **`combate.md`:** as três linhas da Arte na tabela de P/G/R (`Arte, graus 0 a 3 | 5 | 3 | 1 | 1`; `grau 4 | 6 | 4 | 1 | 1`; `graus 5 e 6 | 7 | 5 | 1 | 1`) batem com a D-082 e com o 2b §0 (V = P + G + R, P = V − 2). O parágrafo novo da Arte diz o Golpe na Velocidade menos um, V5 (Preparo 1 a 3, Golpe 4, Recuperação 5), V7 (Golpe 6), sinal de 4 a 6 Ticks e Recuperação a −2.
  A linha 60 da tabela de Velocidades diz "duas, três ou quatro vezes essa Velocidade (10, 15 e 20 na Velocidade 5)": é o item 5 do 155, certo (o "10, 15, 20" fica preso à V5). A frase do Normal diz "no Tick do Golpe, o penúltimo da Velocidade".
- **`regras.astro`:** "Você decide no fim" diz o Golpe do ciclo n no Tick n × V − 1, o exemplo da V5 (4, 9, 14), "só o ciclo final leva Recuperação", o sinal esticado T − 1 ("9 Ticks quando a ação passa a 10"). Os números do 155 (T − 1, 9 para V5 esticada a 10) conferem. O rótulo virou "A Arte sai no Tick do Golpe" e o callout "Os dois modos" também.
- **`regras.json`:** `tempoDaArte` (nota, regra, porque, tabela, resumo, `identificar.teste`, `semGabarito`), `esticar.decisaoTardia` e `feiticoTicksNota` batem. Os números "Velocidade 5 o Golpe é o Tick 4, na 6 é o 5 e na 7 é o 6", "decide no Tick 4 ... 9 ... (14, 19)" e "quatro a seis Ticks" refazem.
  Fica de fora o que devia: o `semGabarito` agora diz "durante o Preparo" (sem "sete Ticks": o grau 6 tem seis Ticks até o Golpe, e a frase deixou de dar número).

**(a) O exemplo da V7 sai da fonte e não virou tabela.** "Uma conjuração de 7 Ticks acontece no sexto" é literal do 2b §3 e da D-084. O parágrafo do capítulo dá **dois exemplos do primeiro ciclo (V5 e V7)** em prosa; o esticar tem **só o exemplo da V5** (4, 9, 14) e a regra geral n × V − 1. Não há tabela de V6 e V7 no esticar, em lugar nenhum
(a linha "na Velocidade 5 o Golpe é o Tick 4, na 6 é o 5 e na 7 é o 6" de `ultimoTick.regra` é o **primeiro** ciclo, consequência direta da tabela da D-082, e não o esticar). A nota do usuário está cumprida.

## 2 · Os pontos do Arquiteto

- **(b) A frase do Tick de decisão.** Em `regras.astro` ela está em **parágrafo próprio** (`<p class="muted">O Tick em que você decide esticar ainda é Preparo (−2 na Defesa), e só o Tick em que a Arte sai é Golpe (−4). Quem segura no Tick 4 da Velocidade 5 não tem Recuperação no 5: esse Tick já é Preparo do ciclo seguinte.</p>`),
  fora do callout, e sai inteira se for vetada. Em `regras.json`, `decisaoTardia` a traz como **a última frase** ("O Tick em que se decide esticar ainda é Preparo (−2 na Defesa), e só o Tick em que a Arte sai é Golpe (−4)."). A condição que o 155 pediu está lá, em dois lugares, e a parte "quem segura no Tick 4 não tem Recuperação no 5" só no parágrafo da página.
- **(c) `nomeDaChave` é útil, com um reparo de nome.** Evita que alguém renomeie `ultimoTick` (a página lê `TEMPO.ultimoTick` em cinco pontos, e os comentários do Grid e do `test-artes-grid` citam o nome, congelados pela D-054). Nenhum código lê o campo: é documentação, mora no dado, e é o lugar onde quem for renomear vai olhar. Não é ruído.
  O reparo: o repositório chama esse tipo de campo `nota` em toda parte; `nomeDaChave` é o único com esse nome. Sugestão 5, cosmética.
- **(d) `combate.pgr.reforma.arte` não é lida por nada do Grid.** Busquei `reforma` em `src/` e `scripts/`: só leem `ficha-pgr.ts` (`corpoACorpo` e `tiro`) e os testes; ninguém itera as chaves de `reforma`. Os três graus (5/3/1/1, 6/4/1/1, 7/5/1/1) batem com a D-082; `esticar` diz n × V − 1, V5 = [4, 9, 14], T − 1, "custo 2 × T + 2". Os motores congelados (`combate.pgr.preparo.arte`, `combate.pgr.arte`, `reguaDaArte`, `arcano.efeitos.ticks`) **não foram tocados**.
- **(e) "Esses Ticks são a Velocidade da conjuração"** (era "de preparo"). **Está certa e é melhor que a antiga**: com a Recuperação de 1 Tick, os 5, 6 e 7 já não são só de preparo. A troca fecha a ambiguidade que a frase velha ganhava com a conta nova. Só uma ressalva: o teste **não a pina** (sugestão 2).
- **(f) `CONJURACAO.md`.** A âncora de código (`regras.astro:315-332 · A Arte sai no Tick do Golpe`) bate com o arquivo (o rótulo está na l.315, o `resumo` na l.330 e a próxima seção na l.332), e a nota diz que o documento descreve o Grid, que segue no último Tick até a passada do Grid (N22). As duas citações reapontadas (`regras.astro:402` "Some os níveis investidos" e `:158` com `concentracao.aoSofrerDano`) caem nas linhas certas. As ocorrências de "no último Tick" que sobram no texto de `CONJURACAO.md` (l.96, 179) descrevem o Grid, e a nota da l.134 diz isso do documento inteiro.
- **(g) A sugestão 6 da 156 foi fechada.** A chamada `anatomiaDaFicha(w, regras)` agora é casada pela linha inteira: a minha mutação `anatomiaDaFicha(w, {}) /* ... */` **falha** (no 156 passava).

## 3 · O que a 4c não tocou (como prometeu)

`git diff --stat 283ad43e..b56d78f5` tem cinco arquivos e **nenhum do Grid, da mesa, do motor, de `equip.ts` ou de `combate-resumo.ts`**. Não há palavra "Abortar" em `combate.md`, então a nota "sem exceção para a Arte" está cumprida por omissão. **Nenhuma Arte foi recalibrada**: a mensagem só fala do tempo e o diff confirma. A N22 já tinha o bullet do Grid na Arte (l.146, que o 155 pediu e o Arquiteto pôs em `20ec3e89`).

## 4 · Os testes: 26 mutações minhas, 19 pegas

Em `combate.md`, `regras.astro`, `regras.json` e `ficha-engine.ts`, uma por vez no arquivo de verdade, contra `test-capitulo-armas` (restaurado cada vez; `git status` limpo). **Pegas (19):** cada célula das três linhas da Arte (Preparo da V7, Velocidade do grau 4), "4 a 6" do sinal, o Golpe no Tick 6 da V7 e no 4 da V5, a Recuperação −2 virando −4,
a frase do Normal, a linha 60 ("10, 15 e 25" e "5 a 8"), "só o ciclo final leva Recuperação" trocado, "n × V − 1" trocado, o −2 do Tick de decisão, "não tem Recuperação no 5" trocado, o link `#tempo` do callout, o Preparo do grau 4 em `reforma.arte`, "(14, 19)" de `decisaoTardia`, a chave `ultimoTick` renomeada (a página lê o nome), a nota do `tempoDaArte` e **a chamada de `anatomiaDaFicha` só em comentário**.
**Não pegas (7), todas em prosa que o teste não lê:**

1. A frase final do parágrafo da Arte do capítulo ("Esticar a conjuração, que se decide a cada Tick do Golpe, está em *O tempo da Arte*...") removida.
2. "9 Ticks quando a ação passa a 10" trocado por "10 Ticks" (o número do exemplo do T − 1 no callout; o teste casa só a primeira metade da frase).
3. "Esses Ticks são a Velocidade da conjuração" trocado por "de preparo" (item e).
4. O 6 do "6 quando é 4" no callout "Os dois modos" trocado por 7 (já era assim antes da 4c).
5. `reforma.arte.esticar.sinal` ("T − 1") e o "Custo total 2 × T + 2" da `nota`: campos do dado que ninguém lê.
6. `nomeDaChave` removido: passa, e é o esperado (documentação, não regra).

Nenhuma contradiz a mensagem do commit, que promete o que lista. A 4c é a rodada mais bem pinada da série: o teste novo casa **linha inteira ou frase inteira** e pina a ausência do "sétimo", do "cinco a sete" do sinal e do "ÚLTIMO".

## Sugestões sem veredito (D-087)

1. **Pinar "9 Ticks quando a ação passa a 10"** no callout do esticar (uma frase a mais na lista que o teste já tem para o callout) e a frase final do parágrafo do capítulo: são os dois lugares do texto com número que a conta do 155 produziu.
2. **Pinar "Esses Ticks são a Velocidade da conjuração"** (callout "Os dois modos"). É a frase que corrige uma inexatidão nova (o "de preparo" ficou errado com a Recuperação), e a única do ponto (e) que o teste deixa passar.
3. **O 155 pedia uma frase só sobre o Tick de decisão, e ela está em três lugares** (a página, `decisaoTardia`, `reforma.arte.esticar.nota`). Se o autor vetar, são três edições; o teste as pina nos dois primeiros e não no terceiro. Não é problema hoje; é nota para a hora do veto.
4. **`ultimoTick.regra` repete "na V5 o Golpe é o 4, na 6 o 5, na 7 o 6"** logo depois de "uma conjuração de 7 Ticks acontece no sexto". Duas frases dizendo o mesmo; a segunda é a que o Mestre procura. Sem ação.
5. **Renomear `nomeDaChave` para `nota`**, como o resto do dado.

## O que ficou sem medir (§9)

- **Só Edge headless e `dist/` local, em 390 e 1300 px**: `/regras/combate/` e `/artes/regras/`, sem erro de página e **sem rolagem horizontal da página** (scrollWidth = largura nos dois). A tabela de P/G/R tem 20 linhas e rola por dentro do quadro a 390 px (458 de conteúdo para 358), o padrão do site. Li o callout "Você decide no fim" em captura; **os outros trechos li no HTML gerado (texto), não em captura.**
- **CI do pino:** o `Validar` ainda não verde. O smoke eu não rodei.
- **Não simulei o esticar no motor** (o Grid usa outra escala, N22): a conta continua a de papel do 155.
- **Travessão, "Perícia" e coautoria:** varri as 163 linhas adicionadas de `283ad43e..b56d78f5` e a mensagem: nenhum.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/157-revisora.md` e `docs/simulacao/caixa/progresso-revisora-157.md`. Mutei `combate.md`, `regras.astro`, `regras.json` e `ficha-engine.ts` no lugar, um por vez, e os restaurei (`git status` limpo); o `dist/` da minha árvore foi rebuildado, e é meu.
