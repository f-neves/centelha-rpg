# 145 · Revisora · Busca do site, terceira passada (`62099b41`, `e8670f74`, `fcd769a2`)

Pino: `fcd769a2` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora fcd769a2`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 144, `915d64f5`, é ancestral do pino).
Escopo: os três commits, em `src/lib/busca.ts`, `src/components/Busca.astro` (uma linha: passa `d.word_count`) e
`scripts/test-busca.mjs`. `git diff --stat 26963b56 fcd769a2`: fora os dois arquivos de caixa do veredito 144, só esses três mudaram.

**Resultado: um CORRIGE pequeno (um caso de teste), o resto PROCEDE.** O lookbehind saiu de `src/` e do `dist/` e o conserto é
equivalente; as duas mutações que sobreviviam na 144 agora são pegas; a guarda dos `locations` degrada para neutro sem quebrar
e não abre brecha além do sem-Aa. Os números do Aa são os da rodada 144, exatos.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde no sha do trabalho**, `fcd769a2` (run `37847113410`,
08/10/2026 21:29 UTC), e `Deploy site (GitHub Pages)` verde (`37847113489`). `62099b41` e `e8670f74` não têm run próprio na lista
(o CI roda na ponta do push; entraram junto com o `fcd769a2`). Existe um commit mais novo no `main`, `2de31467` (só
`Pendencias.md` e `docs/pendencias/J-infraestrutura.md`, a pendência J17 sobre a lacuna de teste da Busca); o `Validar` dele ainda
rodava quando conferi. Ele não toca nenhum arquivo desta rodada. O `validate` roda o `test-busca.mjs`; o componente no navegador
continua sem teste commitado, **e isso já está registrado como J17 pelo Arquiteto**, então não repito a ESCALA da 144.

## Como reproduzi

`npx astro build` e `npx pagefind --site dist` sobre o pino (pagefind 1.5.2, 110 páginas), servidor estático em `/centelha-rpg/`,
Edge headless por `puppeteer-core`, bateria minha fora do repositório. **Só Chromium foi testado; nada foi aberto em Safari.**

## A · Lookbehind e outra sintaxe que o Safari 16.3 recusa

- **Texto bruto:** nenhuma ocorrência de `(?<=` nem `(?<!` em `src/` (Grep, e varredura de todos os `.ts/.js/.mjs/.astro`, inclusive os
  `<script>` dos `.astro`), nem em `dist/` (63 `.js`, 111 `.html`, **600 `<script>` inline**), **inclusive em `dist/pagefind/`**
  (o `pagefind.js` e o worker também estão limpos; o aviso falava só de `src/` e do bundle da Busca).
- **Pelo motor de compilação, não só por texto:** passei todos esses arquivos pelo `esbuild.transform` com `target: safari16.3`
  (erro de sintaxe que o alvo não saiba baixar, aviso, e regex literal que ele precise virar `new RegExp`). **Controle do
  instrumento:** o literal `/…|(?<=\p{Ll})(?=\p{Lu})/u`, o da 144, **é baixado** com alvo 16.3 e **fica literal** com alvo 16.4; o
  conserto novo `(\p{Ll})(?=\p{Lu})` fica literal nos dois. Ou seja, o instrumento distingue o que o Safari 16.3 recusa do que ele aceita.
  Resultado: **zero erros e zero avisos**; seis arquivos têm regex baixado (`pagefind.js`, `pagefind-worker.js`, o bundle da Busca,
  o do Grid, `busca.ts`, `comando-barra.ts`), e o conjunto é **idêntico com alvo 16.3, 16.4 e 15**. É o esbuild baixando por
  precaução as classes `\p{M}`, `\p{Diacritic}` e parentes (nos fontes `\p{M}`, `\p{Ll}`, `\p{Pd}`...), não coisa do 16.3, e o resultado
  é `new RegExp(...)`, que só poderia falhar na hora de chamar.
- **`\p{...}` com flag `u`:** não é problema conhecido no Safari 16.3. Property escapes existem no Safari desde o 11.1; as classes que o
  código usa (`\p{L}`, `\p{N}`, `\p{M}`, `\p{Ll}`, `\p{Lu}`) são categorias gerais e entram nesse suporte. O que o Safari só ganhou na 16.4 é
  o lookbehind (já removido); o que veio depois, a flag `v` e o conjunto de métodos novos de `Set`, **não aparecem** no código. Isso
  vem do que se sabe do motor, **não de medição em Safari**.
- **APIs novas no bundle da Busca e no `pagefind.js`:** `.at(`, `Object.hasOwn`, `replaceAll`, `structuredClone`, `findLast`,
  `toSorted`/`toReversed`, `Object.groupBy`, `Promise.withResolvers`, `isWellFormed`, blocos `static {}`, `??=`, `||=`, `&&=`: **0
  ocorrências** nos dois. O único recurso com piso acima do 16.3 que o componente usa é `<dialog>.showModal()` (Safari 15.4), que é
  anterior e vale para o site inteiro, não é desta rodada.
- **Equivalência do conserto:** `segmentos()` novo contra a versão com lookbehind, **1 milhão de cadeias aleatórias** (letras
  com e sem acento, maiúsculas, dígitos, `_`, hífen, `·`, aspas retas e curvas, `ñ ß ǅ ǆ`, caracteres fora do plano básico,
  japonês, marca combinante, espaço inseparável, junção de largura zero): **0 diferenças** (na 144 foram 200 mil, 0). Sobre dados reais, os
  992 pares da varredura abaixo usam o `segmentos` novo e dão os números da 144, o que fecha a equivalência no índice.
- **Não medi:** Safari de verdade, e o carregamento do WASM do pagefind nele (é código do pagefind, não nosso; o instrumento
  acima não o avalia).

## B · As duas mutações que sobreviviam, e as outras 13

Rodei **23 mutações, uma por vez**, cada uma numa cópia de `busca.ts` fora do repositório, contra o `test-busca.mjs` do pino
(`git status` limpo ao fim; o teste sem mutação sai 0).

- **As duas da 144, agora pegas:** mínimo de 3 letras caindo para 1: **falha (1 caso)**. Separação por pontuação trocada por
  `split(/ +/)`: **falha (3 casos)**.
- **As outras 13 da 144: todas pegas** (comparação de caixa 19 casos, `caixa()` sempre "certa" 19, escape de HTML 1, camelCase 1,
  `tokensDe` com pontuação 6, neutro que reprova 4, "estranha" tratada como "errada" 2, frase sem sequência e frase com blocos
  não consecutivos por exceção, frase sem caixa 2, aspas da frase 2, só o primeiro segmento 1, mínimo subindo para 5 1).
- **A guarda nova, 7 mutações:** sem o teste de posição fora do texto (exceção), sem o de inteiro (1,5 e NaN, exceção), sem o de
  negativo (exceção), sem o `word_count` (2 casos), sem o `Array.isArray` para `locations` ausente (exceção), guarda que **reprova** em
  vez de deixar passar (4 casos), guarda que não conta `neutros` (3 casos): **todas pegas**.
- **Uma sobrevive, e é a vigésima terceira:** a guarda do `word_count` trocada para só valer quando ele é **maior** que o número de
  palavras (`contagem > palavras.length`). O teste só tem o caso `k.length + 1`. O `word_count` **menor** que o texto (a outra
  direção em que a premissa do pagefind quebra) não tem caso.

## C · A guarda dos `locations`

Lida no código (`busca.ts:99-106`): com `tokens` vazios o filtro nem olha; `locais` que não seja lista vira `[]`; **uma** posição não
inteira, negativa ou além do texto, ou `word_count` presente e diferente do número de palavras, devolve
`{ ok: true, aceitos: [], neutros: tokens.length }` para o resultado inteiro. O `Busca.astro:176` passa `d.word_count`.

- **Não quebra:** rodei os dados reais com cada corrupção em memória. Posições deslocadas em +100000, `word_count` + 1, `locations`
  ausente e metade das páginas corrompidas: **nenhuma exceção** em 14 consultas e 381 resultados.
- **Efeito de cada corrupção, e é o que decide se há brecha:** a página corrompida **passa** (vira o sem-Aa para ela, sem destaque,
  com o trecho do próprio pagefind). Com tudo corrompido o Aa devolve exatamente os números do sem-Aa (`kael` 6 em vez de 0, `lutando` 22,
  `absorção` 23); com metade corrompida, o que fica no meio (`kael` 3). **Nunca passa mais que o sem-Aa**, porque a guarda só decide
  sobre resultados que o pagefind já devolveu. "Aa passa tudo" acontece **exatamente quando a premissa quebra, e só para o
  resultado cuja premissa quebrou**; é a degradação que a mensagem do commit promete.
- **A guarda não dispara em dado real:** **0 de 381** resultados reais passaram por neutro (e nos 992 pares da varredura de
  `Aa maior que sem Aa`, 0 URLs fora do conjunto sem Aa). `word_count` igual ao número de palavras e todas as posições alinhadas,
  nas 110 páginas, em 4232 posições de 10 termos (a mesma conferência da 144, repetida no build novo).
- **Números do Aa, pela interface do `dist/`, iguais aos da 144:** lutando 22 com Aa **20**, atacar 23 com Aa **23**, animais 18 com Aa
  **15**, magia 31 com Aa **27**; kael 6 com Aa **0** ("Kael": 6); uldun 2 com Aa **0** ("Uldun": 2); absorcao e absorção com Aa 5 e 5;
  armaduras 27; "Defesa contra projéteis" em Frase com Aa 2, "defesa contra projéteis" 0.
- **Quatro rejeições novo-contra-antigo, as mesmas quatro da 144** (Corpo, Graus ×2, Orcs), todas por o pagefind não listar a palavra.

## Regressão curta no `dist/`

Foco na primeira e na segunda abertura (por clique e por `/`, com índice normal e com índice atrasado em 3 s): campo focado, `/`
digitada dentro do campo vira texto, Esc e ✕ devolvem o foco ao botão. Modos Palavras e Frase exata e as contagens acima. "Mostrar mais"
até o fim sem salto nem repetição (absorção 23, armadura Aa 27, magia Aa 27, Defesa Aa 51). Corrida: "armadura" Aa e depois
"combate" com 700 ms por fragmento, botão com **0 amostras visíveis durante "Buscando…"**, clique real impossível, final 20 resultados.
Só aspas (`"`, `""`, `!!!`) e depois de uma busca com resultado: "Digite ao menos uma palavra.", 0 linhas e botão oculto; `"kael"`
acha 6. XSS (5 termos nos 4 modos): 0 elementos perigosos. **Sem achado.**

## CORRIGE

1. **Falta um caso no teste da guarda: `word_count` menor que o número de palavras.** O `test-busca.mjs` só prende a direção
   `k.length + 1` (maior), e a mutação `contagem > palavras.length` (guarda só contra o maior) **passa no teste** (mutação 23 acima).
   A mensagem do `fcd769a2` e o comentário de `busca.ts:93-97` dizem "diferente do número de palavras", que são as duas direções. A
   outra direção é a de um pagefind que **conta menos** palavras que o `split(' ')`, igualmente a premissa quebrada. Um caso fecha:
   `const menor = M.filtrarCaixa(k, [1], ['kael'], 'palavras', k.length - 1); ok(menor.ok && menor.neutros === 1, 'word_count menor que o texto: neutro')`.

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **Safari de verdade, em qualquer versão.** O ponto A vem do motor de compilação com alvo `safari16.3`, com o controle acima, e do que
  se sabe do suporte a `\p{}` e lookbehind; não houve execução num Safari.
- **A guarda é silenciosa.** `neutros` é calculado e **nenhum código o lê** (`Busca.astro` usa `v.ok` e `v.aceitos`): se a premissa do
  pagefind quebrar numa versão futura, o Aa passa a não filtrar nada e nada na tela nem no console avisa; só o número do `test-busca` e
  a varredura de quem olhar mostram. Não é defeito da rodada (ela prometeu degradar, e degrada), é o que o autor deve saber de como a
  degradação aparece: como "o Aa parou de fazer efeito". Se quiser o aviso, é um `console.warn` único quando `neutros > 0` no resultado.
- **Os `locations` das seções (`sub_results[].locations`) não passam pela guarda.** `Busca.astro:96` e `:107` fazem
  `s.locations.some(...)` e `s.locations.filter(...)` sem conferir que existe; se uma versão do pagefind deixar de trazer o campo, a
  linha lança `TypeError` dentro de `item()`. **Não reproduzi** (o campo existe hoje, nas 110 páginas), li no código.
- **A varredura de 991/992 pares** usa o vocabulário do índice de hoje, e o sorteio das frases de uma palavra usa `Math.random`, então o
  total varia de 991 a 992 entre rodadas; o resultado (0 URLs fora do sem-Aa, 0 neutros) foi o mesmo nas três vezes que rodei.
- **Texto novo:** nenhum travessão nem "Perícia" em `busca.ts`, `test-busca.mjs` e `Busca.astro` (Grep nos arquivos); as três mensagens de
  commit sem linha de coautoria e sem travessão (lidas por `rtk proxy git log`).

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/145-revisora.md` e `docs/simulacao/caixa/progresso-revisora-145.md`.
`dist/` da worktree reconstruído (`astro build` e `pagefind`); nenhum arquivo rastreado foi tocado.
