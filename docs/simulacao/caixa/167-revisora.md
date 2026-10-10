# 167 · Revisora · A 9-ter: o CORRIGE do 166 (`4c7067f4`)

Pino: `4c7067f4` (branch `revisora` reancorada com `git switch -C revisora 4c7067f4`; o 166, `3eb5a7f7`, é ancestral). Escopo: o commit único da 9-ter (`mesa-core.ts`, `mesa-tempo-ui.ts`, `mesa/combate.astro`, `test-capitulo-armas.mjs`, `N-grid-pendencias.md`, `L-simulacao-simultaneo.md`). Fonte: o meu 166 (o CORRIGE), D-094, D-054, D-087. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. O CORRIGE do 166 está fechado.** Nenhum BLOQUEIA, PERGUNTA ou ESCALA.

**CI (§11):** `Validar dados e regras` e `Deploy site` de `4c7067f4` **verdes** (por `headSha`). Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**262 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-bandeiras`, `test-travessao-capitulos`, `test-links-base`, `test-portoes` (agora verde: o `019f0298` está no pino), `test-procedencia`, `test-kael`, `validate-data`, `test-espelho`, `test-arte-na-mesa` e `test-simultaneo`. O smoke eu não rodei.

## 1 · As minhas três mutações do 166 agora falham

Refiz, no arquivo de verdade, uma por vez (restaurado a cada vez, `git status` limpo), as três que antes passavam: **um travessão novo no título de `mesa-core.ts`**, **em `mesa-tempo-ui.ts`** e **em `mesa/combate.astro`**. **As três falham o teste.** Também reintroduzi **dois dos cinco textos originais** (a dica da condição, "o par é perto/longe", e a frase do piso de 2 em `mesa-tempo-ui.ts`): **as duas falham**. E acrescentei **três travessões novos em arquivos que a exceção antiga também escondia**, todos "da frente da mesa" e lidos por várias abas (`mesa-ficha.ts`, `mesa-abas.ts` e a prosa de `mesa/arquivos.astro`): **as três falham**.

## 2 · O `EXCETO` ficou só com o que é do Grid

O novo `EXCETO` é `bestiario|node_modules|monsters|inimigos|ref-index|package-lock|grid.astro|artes-grid|comando-(barra|voz).ts|lance.ts|rolagem.ts`. **`mesa-*.ts` e `mesa/combate.astro` saíram da exceção.** Conferi que o que sobra é mesmo só do Grid: `grid.astro`, `artes-grid*` (lidos só por `grid.astro`), `comando-barra.ts` e `comando-voz.ts` (só o `grid.astro` os importa), e o **regex** `[−–—]` de `lance.ts` e `rolagem.ts` (código que normaliza o que o jogador digita, não texto). **Controles da exceção:** pôr um travessão novo no texto da voz de `grid.astro` e no regex de `lance.ts` **passa** o teste, como a exceção diz; é o comportamento certo.
**Varredura minha, independente do teste:** fiz a mesma contagem de texto visível (comentários descontados, a célula vazia permitida) em **todo** `src/` fora do bestiário e do `monsters`, **sem usar a exceção**: restam nove linhas, **todas** do `grid.astro` (seis, a voz) e do regex de `lance.ts` (uma) e de `rolagem.ts` (duas). **Nenhum texto visível com travessão sobrou em `mesa-*.ts`, nas abas da mesa nem no resto.**

## 3 · No navegador: o título da aba da mesa

Com a bancada (`astro dev --config astro.bancada.mjs`, mesa `MESA_BANCADA`), Edge headless: `document.title` é **"Mesa de bancada · Centelha"** em `/mesa`, **"Combate · Mesa de bancada · Centelha"**, **"Grupo · …"**, **"Criaturas · …"**, **"Referência · …"** e **"Grid · …"** nas outras abas; nenhuma tem travessão, zero erro de página, e o corpo da mesa abriu em todas. (`/mesa/referencia` tem os 13 travessões de **célula vazia de tabela**, como antes.) **A dica da condição**, que só aparece com uma condição no rastreador, eu a medi chamando o `condChipHTML` real (`mesa-core.ts` compilado) com o Prono: "…Levantar consome movimento. (ação −2 · def −2/+2) **(o par é perto/longe).**", sem travessão.

## O que mudou e o que não mudou

O diff de `src/` tem **cinco linhas**: o título, a dica, as duas frases de ajuda do rastreador de tempo e o aviso do gate de Perfuração; **só strings** (não toca lógica, nome nem estrutura). O N22 foi corrigido (a linha agora diz que `mesa-core.ts`, `mesa-tempo-ui.ts` e a aba Combate **não** são do Grid e entraram na varredura). Os cinco estragos novos (um por texto, nos três arquivos) são acusados, e eu os reproduzi na soma (257 + 5 = 262).

## Sugestão sem veredito (D-087)

A dica da condição agora sai com dois parênteses seguidos ("(ação −2 · def −2/+2) (o par é perto/longe)."). Lê-se, mas a segunda poderia ser "o par é perto/longe." sem parênteses; é questão de estilo, não de regra.

## O que ficou sem medir (§9)

- Medi só o título de seis abas da mesa com a bancada (papéis e dados reais da mesa não exercitei), e a dica da condição pela função, não pelo rastreador na tela.
- O smoke eu não rodei.
- **Travessão, "Perícia" e coautoria:** nas 14 linhas adicionadas de `src/` e `scripts/` (sem as asserções que citam o caractere), nenhum; nenhuma na mensagem do commit.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/167-revisora.md` e `docs/simulacao/caixa/progresso-revisora-167.md`. Mutei `mesa-core.ts`, `mesa-tempo-ui.ts`, `mesa/combate.astro`, `mesa-ficha.ts`, `mesa-abas.ts`, `mesa/arquivos.astro`, `grid.astro` e `lance.ts` no lugar, um por vez, e os restaurei (`git status` limpo); subi o dev server da bancada na minha árvore.
