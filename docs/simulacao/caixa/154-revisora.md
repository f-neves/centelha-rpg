# 154 · Revisora · A 4b-bis e a D-088 final (`2ef4f5b8`, com `32924728`)

Pino: `2ef4f5b8` (branch `revisora` reancorada com `git switch -C revisora 2ef4f5b8`; o veredito 153, `4450f70c`, é ancestral). Escopo: o delta `4450f70c..2ef4f5b8`, que é `32924728` (só documento: a D-088 fechada pelo autor, a leitura c descartada,
as fontes da D-083 e da K18) e `2ef4f5b8` (a frase de Mestre em Luta desarmada e o estrago novo do teste). Fonte do julgamento: a decisão final do autor, "Punhos não bloqueiam o dano de NENHUMA arma, a não ser com aprovação do Mestre"
(`decisoes.md` D-088), a D-065 item 3, a D-087 e o `Combate_Tempo.md` §14.12/§14.13. A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, CORRIGE, PERGUNTA ou ESCALA.** Duas observações de teste, sem veredito.

**CI (§11):** `Validar dados e regras` e `Deploy` de `2ef4f5b8` estavam **em andamento** quando escrevi; **não é verde ainda e não afirmo que é**. Rodei por mim, no pino, todos verdes: `test-capitulo-armas` (**57 estragos**, como a mensagem diz),
`test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`. (O Validar de `cda8845d` que o aviso diz ter falhado por timeout do Chrome em `test-l70-ocupacao-mesa` eu não reproduzi.)

## 1 · O texto, `armas-e-armaduras.md` (Luta desarmada)

- A frase nova, no fim do parágrafo "A mão nua bloqueia qualquer ataque armado": **"Os punhos não barram o dano de arma nenhuma: só com a aprovação do Mestre a mão nua barra também o dano da arma (um antebraço com braçadeira de aço contra uma clava, por exemplo); sem ela, o dano passa."**
  Diz o que a decisão final diz, nos mesmos termos, e é **frase de Mestre com exemplo, sem regra nova** (D-087). O resto do parágrafo ficou como no 153: a Margem se perde, o dano da arma passa, a armadura funciona contra o que passa, "arma" é todo ataque que não seja desarmado.
- **A leitura c continua fora do texto**, agora por decisão, não por pendência: nenhuma frase soma punho com arma e a frase "arma ou escudo não somam com o corpo" (D-065 item 3) está lá. Controle negativo meu: injetar "Com arma na outra mão, o punho soma +1 ao Bloqueio da arma" **falha**.
- **O "o dano da arma passa" e a frase nova não se contradizem:** a primeira é a regra geral, a segunda é a exceção que o Mestre autoriza. A redundância entre "toma o dano da arma normalmente" e "sem ela, o dano passa" é leve e não confunde.
- **O resto do livro não diz o contrário.** Varri `src/` (capítulos, dados, páginas, sem o bestiário gerado) por "mão nua", "defende normalmente", "contra lâmina", "não segura", punho/desarmado junto de contundente ou bloqueio: o que sobra é `combate.md:311` ("o dano da arma passa, a Margem não"), `defesas.md:72` (só remete a Luta desarmada),
  `caminhos.json` (a pele como arma natural, que é a D-069) e a frase das fraquezas em `regras.json:2134` e `artes/regras.astro:540` ("aparar de mãos nuas fere"), que diz o mesmo. **Nada contradiz a decisão final.** Isto confirma o que o Arquiteto conferiu na mensagem, por busca minha.

## 2 · O delta de documento, `32924728`

Li o diff inteiro. A D-088 passa a "decisão final do autor", substitui por inteiro a D-057 (a frase do contundente) e o item 2 da D-065 (lâmina), a **leitura c é DESCARTADA com a D-065 item 3 como fonte**, e as leituras a, b e d seguem. A D-065 item 3 ganhou a nota de que
decide a dupla mista (vale o maior dos dois). O D-083 ganhou a fonte do "não acumula com a dupla" (`Combate_Tempo.md` §14.12, "As bordas da rajada", item 4, l.1161: **conferi, a linha 1161 é "4. **Não acumula** com a empunhadura dupla nem com Técnicas de ataques extras"**).
**O ponto 3 do aviso do Arquiteto também confere na fonte:** o §14.13 l.1173 diz "Com arma média na mão hábil: o ciclo cresce 1", a tabela de l.1186 a 1188 dá média, um golpe, 6t, e média, dupla, **7t**, e l.1263 repete "com média: ciclo +1"; **"o ciclo é o da arma mais lenta, em qualquer mão" não está no §14**, que só trata
a média na mão hábil. A `decisoes.md` agora diz isso e leva o ponto ao usuário, sem mexer no texto. **Concordo com a leitura**: não tomo a frase de `combate.md:216` como regra, só como leitura sob a D-087, e o teste a pina como redação. O insumo da K18 que o K-combate ganhou (`inabilPen: ambi ? 1 : 2` contra "−1d6 nas duas" do livro) **bate com o código** (`ficha-engine.ts`),
e é registro, não mudança.

## 3 · O teste: nove mutações minhas

O estrago novo da mensagem ("frase do Mestre sobre o dano da arma em Luta desarmada") e a asserção estendida (a cláusula "só com a aprovação do Mestre a mão nua barra também o dano da arma" e "braçadeira de aço contra uma clava") **funcionam**: o total passa de 56 para 57 e a mensagem diz isso.
Em cópia da árvore, cada uma contra `test-capitulo-armas` e `test-catalogo-distancia`: frase removida inteira **falha**; "só com a aprovação do Mestre" trocado por "sempre" **falha**; "Mestre" trocado por "jogador" **falha**; o exemplo da clava trocado por espada **falha**; "toma o dano da arma normalmente" trocado por "não toma dano" **falha**;
a leitura c injetada **falha**; a remissão de `combate.md:311` ("o dano da arma passa") trocada por "é barrado" **falha**. **Duas não pegas, em prosa que o teste não lê:** "Os punhos **não** barram o dano de arma nenhuma" trocado por "Os punhos barram" (o resto da frase, que está pinado, fica, e o período vira contraditório), e "sem ela, o dano passa" removido.
Nenhuma contradiz a mensagem, que só promete a frase e o exemplo.

## Sugestão sem veredito (D-087)

- Pinar também o começo da frase ("Os punhos não barram o dano de arma nenhuma") e o final ("sem ela, o dano passa"): hoje o teste cobra só a cláusula do meio. Uma linha de `includes` no teste que já lê o capítulo.

## O que ficou sem medir (§9)

- **Não conferi a página no navegador** nesta rodada: a frase é uma oração a mais num parágrafo que eu li em 390 e 1300 px no 153 (sem rolagem horizontal); o texto novo não muda a estrutura. Foi leitura do `.md`, não do HTML gerado.
- **CI do pino ainda em andamento** (ver acima).
- **Travessão, "Perícia" e coautoria:** varri as linhas adicionadas de `4450f70c..2ef4f5b8` em `src/`, `scripts/` e `docs/`, e as mensagens de `32924728` e `2ef4f5b8`: **nenhuma tem travessão, "Perícia" ou coautoria**.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/154-revisora.md` e `docs/simulacao/caixa/progresso-revisora-154.md`. Mutei cópias do capítulo e do teste fora do repositório; nenhum arquivo rastreado foi tocado.
