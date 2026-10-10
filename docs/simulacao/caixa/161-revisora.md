# 161 · Revisora · Rodada 6: o Porte sem teto, só o menor ganha no corpo a corpo (`c0085104`)

Pino: `c0085104` (branch `revisora` reancorada com `git switch -C revisora c0085104`; o 160, `a0577466`, é ancestral). Escopo: o commit único da rodada 6 (sete arquivos: `combate.md`, `regras.json`, `glossario.json`, `mesa.astro`, `mesa/referencia.astro`, `test-capitulo-armas.mjs`, `N-grid-pendencias.md`). Fonte: D-077 e o 2f §7 (lido em `tmp/veterana/`), D-078, D-054, D-087 e o plano (rodada 6). A mensagem do commit tratei como hipótese.

**Resultado: PROCEDE. Nenhum BLOQUEIA, CORRIGE, PERGUNTA ou ESCALA.** O livro, a nota de dado, o glossário e a referência da mesa dizem a D-077 sem regra nova escondida; o Grid ficou intocado e a divergência está dita no dado e no N22; e **a varredura do porte e do ±6, que agora cobre dados e páginas da mesa, não achou resto**. Uma observação de pino, sem veredito.

**CI (§11):** `gh run list --commit c0085104` voltou **vazio** quando consultei; não afirmo. Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**131 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, **`test-bandeiras`** (o que guarda a regra velha do Grid, verde), `test-porte-raca`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`, `test-espelho`, e `npx astro build` (110 páginas). O smoke eu não rodei.

## (a) Quem lê o porte: só o Grid

Busquei `modificadorPorte`, `porteAcerto`, `porDiferenca` e `capCategorias` em `src/` e `scripts/`, e também qualquer frase de código com "porte" junto de "acerto". **O único leitor de `modificadorPorte` é `grid.astro:10268`** (via `calc.ts`), mais os testes `test-bandeiras*.mjs` e os comentários de `mesa-mock.mjs`. **A ficha (`ficha-engine.ts`), `combate-resumo.ts`, `mesa-*.ts` e o bestiário não leem nem calculam acerto de porte**; `mesa.astro` e `referencia.astro` só **mostram** (e agora leem `porteAcerto.reforma`). Logo **não há divergência de ficha que o N22 deixe de cobrir**.
**`gridNota` e a linha do N22 dizem certo:** o Grid lê `ordem`, `porDiferenca` e `capCategorias`, teto de 4 categorias (+12 e −12), simétrico também no corpo a corpo; esses três campos ficaram intactos (mutação minha em `porDiferenca` **falha** o teste, que os trava de propósito, e o `capCategorias` está na mesma asserção); a regra nova mora em `porteAcerto.reforma`; `test-bandeiras.mjs` guarda a velha (médio contra colossal +12, colossal contra médio −12, teto em 4: li as linhas 96-102) e "muda de sentido" na passada. A linha cita `calc.ts` e `grid.astro` perto da l.10268, e o `modificadorPorte` está em `grid.astro:10268`. Nota: o uso no Grid é **sob uma bandeira ligada** (comentário `grid.astro:10257`), o que diminui o alcance da divergência; a linha do N22 não diz isso, e não precisa.

## (b) +18 e as 7 categorias

`ordem` em `regras.json` tem **7** categorias (Miúdo, Pequeno, Médio, Grande, Enorme, Imenso, Colossal), então a maior diferença é **6** e **6 × 3 = +18**. A tabela da referência vai de 1 a 6 (`DIFS` sai de `ordem.length − 1`), e li na página renderizada: corpo a corpo, alvo maior `+3 +6 +9 +12 +15 +18`; alvo menor `0 0 0 0 0 0`; à distância, alvo maior `+3 … +18` e alvo menor `−3 … −18`. O exemplo do livro (Miúdo contra Colossal `+18`, "de perto ou de longe"; o Colossal que o atinge de longe, `−18`) bate.

## (c) O glossário

A definição de "Porte" diz agora "cada categoria de diferença soma +3, sem teto, só no acerto. No corpo a corpo só o menor ganha (o maior ataca o menor sem penalidade); à distância é relativo nos dois sentidos (alvo maior +3 por categoria, alvo menor −3)", e mantém, sem mudar, o limite do Bloqueio e a Couraça de Porte. **Casa com a D-077 palavra por palavra** e não traz regra a mais. No `dist/ref-index.json`: **a definição nova está** ("cada categoria de diferença soma +3, sem teto"), e **o "+3/+6/+9/+12" velho e o "teto de 4 categorias" não estão**.

## (d) "Não é modificador de Defesa, fica fora do teto de +6 dos bônus"

**Não cria regra.** A frase é a continuação direta do que o capítulo já dizia ("só no acerto: não muda a Defesa passiva do alvo, não entra no teto de ±6..."), com o teto de hoje (D-078, bônus +6); e a D-077 diz que o porte "entra só como bônus fixo no acerto". É o mesmo desenho da tag Alcance e da faixa de mira, que eu já aceitei nos pareceres 158 a 160. Mutações minhas: trocar para "entra no teto de +6" **falha**; o "teto de ±6" de volta **falha**.

## (e) A tabela, maior, igual e menor

Maior em *n*: **+3 × n** nos dois; **mesmo porte: 0 nos dois**; menor em *n*: **0** no corpo a corpo e **−3 × n** à distância. É exatamente a D-077 (e o 2f §7). Mutações minhas: o "mesmo porte" a +3 **falha**; o "menor" do corpo a corpo a −3 × n **falha**; o "menor" à distância a 0 **falha**. A Nota ao Mestre das criaturas maiores que Médio lutando entre si, e o enxame ("o tamanho que apresenta, nos dois papéis") e o "porte não escala a Efetiva", são da D-077 e do 2f §7, e estão pinados.

## (f) `bloqueioLimite` e "Força e porte: quando a guarda não segura"

**Confirmo: são outra regra e a D-077 não os toca.** A D-077 e o 2f §7 falam só do **acerto** e da Defesa de criatura; nenhum dos dois fala do Bloqueio. O parágrafo de `combate.md` continua dizendo "você não bloqueia um atacante 2 ou mais categorias de porte maior" e "Força pelo menos o dobro da sua e ao menos +4 acima", e o glossário mantém a frase. Não achei esta regra no registro de decisões (`decisoes.md` não cita `bloqueioLimite` nem "Força e porte"): é regra do livro de antes da reforma, e fica.

## Varredura própria, desta vez com dados e páginas da mesa

Procurei em `src/` (capítulos, páginas, dados, `lib/`, menos `monsters*.json` e `bestiario/`, que são fichas de criatura, D-077/B14) por: "teto de 4 categorias", "até 4 categorias", "+3/+6/+9", "±12", "+12 (teto)", "simétrico", "colosso tem", "rato tem", "alvo menor subtrai", "diferença de porte", "por categoria", "Teto de ±", "fora deste teto", "Teto de 4". **O que sobra é só o que a mensagem declara:** `porteAcerto.gridNota` e a linha do N22 (descrevem o Grid de antes), o comentário de `calc.ts:115` ("Simétrico e com teto de `capCategorias`"), e `test-bandeiras.mjs`. **A exceção `porteAcerto.nota` saiu da varredura do ±6** (mutação minha: pôr "teto ±6" de volta na `porteAcerto.nota` **falha**), e as duas páginas da mesa não dizem mais "fora deste teto" nem "Teto de 4".

## Medida a 390 e 1300 px, com a bancada (Supabase de mentira)

`astro dev --config astro.bancada.mjs`, Edge headless, `/mesa` e `/mesa/referencia`, os `<details>` abertos. Em todos os quatro casos: o corpo da mesa **abriu**, **zero erro de página**, **sem "undefined", "NaN", "Teto de 4" nem "fora deste teto"**, e a frase "O porte entra no acerto, sem teto: +3 por categoria, e no corpo a corpo só o menor ganha" na `/mesa`.
`/mesa`: rolagem da página 390 = 390 e 1300 = 1300. `/mesa/referencia`: 1300 = 1300; a **390 px a página tem rolagem horizontal (494 contra 390), que já existia e não é do porte** (é a dos blocos "Pela arma" e "Pela armadura do alvo", a mesma que mostrei no 160; a Executora mediu 483, a minha leitura deu 494, e as duas apontam o mesmo defeito de antes). **A tabela do porte rola dentro do próprio quadro** (481 contra 368), sem vazar.

## O teste: 30 mutações minhas, 29 pegas

Em `combate.md`, `regras.json`, `glossario.json`, `referencia.astro` e `mesa.astro`, uma por vez no arquivo de verdade (restaurado a cada vez, `git status` limpo). **Pegas (29):** +3 trocado por +4, "sem teto" trocado por "teto de 4", o maior com penalidade, o motivo de jogo removido, a distância sem o −3, as quatro células da tabela (menor à distância, menor no corpo a corpo, mesmo porte), o exemplo (+18 e −18), a Efetiva, o enxame, a Nota ao Mestre, Manobras, as exclusões, as duas frases do teto, `porCategoria`, `teto`, `corpoACorpo`, o ±6 na nota, `gridNota` e `porDiferenca`, a definição velha do glossário (duas), a tabela da referência (duas) e a frase da mesa.
**Passa (1), em coisa que o teste não lê:** na `referencia.astro`, o **sinal de "À distância, alvo menor"** trocado de `−` para `+` (a linha mostraria "+3 … +18" para o alvo menor). A página real está certa (li "−3 … −18"). É o mesmo tipo de buraco do 160 (a ordem das colunas), e a Executora-2 já tem a sugestão na rodada 8.

## Sugestão sem veredito (D-087)

Pinar as **células** da tabela da `referencia.astro` (a mesma pauta da sugestão 1 do 160): o teste pina a frase e a ausência do teto, mas não os sinais.

## O que ficou sem medir (§9)

- **Dev server com o Supabase de mentira**, Edge headless, 390 e 1300 px, **só as duas páginas, com os `<details>` abertos** e só o que a mesa de bancada mostra; papéis e dados reais da mesa não exercitei. Li o texto renderizado e medi com `getBoundingClientRect`; não olhei capturas de tela.
- **O Grid:** não exercitei a bandeira de porte do Grid nem o `test-bandeiras` além de rodá-lo verde; afirmo só o que li no código.
- **CI do pino** (vazio na consulta) e **o smoke:** não verifiquei.
- **Fichas e desafios de criatura** (Verme Púrpura e afins) não li: são da B14, e a D-077 os deixa de fora.
- **Travessão, "Perícia" e coautoria:** nenhum nas 127 linhas adicionadas de `8435c0ff..c0085104` nem na mensagem do commit.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/161-revisora.md` e `docs/simulacao/caixa/progresso-revisora-161.md`. Mutei `combate.md`, `regras.json`, `glossario.json`, `referencia.astro` e `mesa.astro` no lugar, um por vez, e os restaurei (`git status` limpo); subi o dev server da bancada na minha árvore (saída fora de `dist/` e `.astro/`) e rodei `npx astro sync` depois.
