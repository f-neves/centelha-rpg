# 146 · Revisora · Busca do site, passada final (`9366aed1`, `c9f6e2df`)

Pino: `c9f6e2df` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora c9f6e2df`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 145, `a232ed84`, é ancestral do pino).
Escopo: os dois commits, em `scripts/test-busca.mjs`, `src/lib/busca.ts` e `src/components/Busca.astro`. Nada mais mudou
na faixa além dos arquivos de caixa dos vereditos 145 (`git log --name-only a232ed84..c9f6e2df` só cita esses três).

**Resultado: um CORRIGE pequeno (um caso em que o aviso não sai); o resto PROCEDE.** O caso `k.length - 1` é pego e a mutação "só
contra o maior" falha; o aviso sai uma vez só e só quando `locations` fora do texto ou `word_count` quebram; seção sem `locations`
aparece sem `TypeError`; o caso normal não mudou; regressão curta e varredura de sintaxe limpas. O defeito é que **`locations`
ausente degrada em silêncio**, o que o commit diz que avisa.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde no sha do trabalho**, `c9f6e2df` (run `37849663669`,
08/10/2026 21:51 UTC); `Deploy site (GitHub Pages)` verde (`37849663589`). `9366aed1` não tem run próprio (o CI roda na ponta do
push). O `main` não andou depois do pino. O `test-busca.mjs` está no `validate`; o componente no navegador continua sem teste
commitado (J17, já registrada pelo Arquiteto; não repito).

## Como reproduzi

`npx astro build` e `npx pagefind --site dist` sobre o pino, servidor estático em `/centelha-rpg/`, Edge headless por
`puppeteer-core`. Para simular o pagefind quebrado, como o commit descreve, o servidor de teste entrega `pagefind.js` e
`pagefind-worker.js` com um gancho no ponto em que o pagefind monta o resultado (`fragment.sub_results=calculate_sub_results(...)`),
um servidor por modo de corrupção (a tentativa de embrulhar o módulo por interceptação de requisição travou a busca
inteira, defeito do meu instrumento, descartada; a de modificar o arquivo no servidor funciona, e com o modo "normal" os
números batem com a 145). **Só Chromium; nada foi aberto em Safari.**

## O que conferi

- **A mutação que sobrevivia, agora pega.** `test-busca.mjs` ganhou o caso `word_count` menor (`k.length - 1`), `word_count`
  zero, e a frase exata com `word_count` menor. As duas formas de guarda só-numa-direção, `contagem > palavras.length` e
  `contagem < palavras.length`, **falham no teste** (3 casos cada). Rodei de novo as 23 mutações da 145, uma por vez, mais
  as 7 novas: **29 de 30 pegas, 1 não** (a que não é pega é a "29", nas Observações).
- **As mutações do código novo:** `locaisSeguros` devolvendo o campo como veio (exceção), sem filtrar inteiros (1 caso),
  `premissaQuebrada` que nunca vira verdadeira (2 casos), verdadeira no caso normal (2), verdadeira sempre que há palavra neutra
  por falta de parentesco (1), e as duas variantes da guarda que reprova em vez de passar (7) ou que não conta `neutros` (6):
  todas **pegas**.
- **O aviso sai uma vez só, e só na quebra.** Com `word_count` +1, `word_count` −1 e posições deslocadas em +100000, três buscas
  seguidas ("kael", "Kael", "lutando"), cada uma com Aa: **exatamente 1 `console.warn`** ("Busca: os locations do pagefind não
  batem com o texto de /centelha-rpg/regras/criacao-de-p…"), 0 erros de página, e o Aa degrada para o sem-Aa ("kael" 6, "lutando"
  22). Com o pagefind **sem corrupção**, 13 consultas com Aa (palavra de ligação, frase, "A MAGIA", "kael e uldun", plural, o que não
  existe): **0 avisos**; palavra neutra por falta de parentesco **não** avisa (o caso do commit, verificado também pela mutação
  que o faria avisar, pega por 1 caso).
- **Seção sem `locations`:** com o campo removido de todos os `sub_results`, "absorção" e "armadura" com Aa: **0 erros de página**,
  seções mostradas (4 e 11, a seção sem o campo fica com o trecho do próprio pagefind), resultados 5 e 27. Sem a correção seriam os
  `s.locations.some` / `.filter` de `Busca.astro` lançando `TypeError`.
- **O caso normal não mudou.** Aa idêntico ao da 145: lutando 22 com Aa **20**, atacar 23/**23**, animais 18/**15**, magia 31/**27**,
  kael 6/**0** ("Kael" 6), uldun 2/**0** ("Uldun" 2), absorção 5, armaduras 27, "Defesa contra projéteis" em Frase 2. As seções por
  busca também são as mesmas da 145 (Kael 10, absorção 4, lutando 7, armadura 10, frase 1, "Sorte Azar" 0) e todas as marcas continuam
  nas palavras certas.
- **Regressão curta no `dist/`:** foco na 1ª e 2ª abertura (clique e `/`, índice normal e lento), `/` dentro do campo, Esc e ✕, "Mostrar
  mais" até o fim sem salto (absorção 23, armadura Aa 27, magia Aa 27, Defesa Aa 51), botão oculto durante a busca seguinte (clique real
  impossível, final 20/20), só aspas depois de resultado (0 linhas, botão oculto): **sem achado**.
- **Lookbehind e sintaxe nova:** nenhuma ocorrência de `(?<=`/`(?<!` em `src/` nem em `dist/` (63 `.js`, 111 `.html`, 600 scripts
  inline, `dist/pagefind` incluso); `esbuild.transform` com alvo `safari16.3` em tudo isso: **0 erros e 0 avisos**, e os mesmos seis
  arquivos de sempre com regex baixado a `new RegExp` (idênticos com alvo 16.4 e 15: `\p{M}` e parentes, não é coisa do 16.3). O
  controle de que o instrumento enxerga o problema (o literal com lookbehind é baixado em 16.3 e mantido em 16.4) vale desde a 145.
- **Texto novo:** nenhum travessão nem "Perícia" em `busca.ts`, `test-busca.mjs`, `Busca.astro`; nenhuma linha de coautoria nas
  mensagens dos dois commits.

## CORRIGE

1. **`locations` ausente não vira `premissaQuebrada` e não dispara o aviso; a mensagem do `c9f6e2df` diz que sim.** A mensagem afirma
   "`filtrarCaixa` devolve `premissaQuebrada: true` quando o guarda degrada (posição fora do texto, **locations ausente**, `word_count`
   diferente)". No código (`busca.ts`), `locations` que não é lista vira `[]` (`const lista = Array.isArray(locais) ? locais : []`),
   passa pelo teste de posição fora do texto sem acusar nada, e cai na conferência por palavra, onde toda palavra digitada fica neutra e o
   resultado passa com `premissaQuebrada: false`. **Medido** com `locations` removido de cada resultado (modo "semlocs"): "kael" com Aa
   dá **6** (degradou para o sem-Aa), 0 erros de página e **0 avisos** nas três buscas. É exatamente o caso que o aviso existe para
   denunciar: o pagefind deixa de trazer `locations`, o Aa para de filtrar a caixa, e nada na tela nem no console diz. O teste atual não
   pega (só afirma `.ok` para `undefined` e `null`), e uma mutação que passa a tratar a não-lista como quebra (`[-1]` no lugar de `[]`,
   que força o ramo da quebra) **passa no `test-busca.mjs`**, ou seja, nenhum caso prende a escolha. Conserto de uma linha em
   `filtrarCaixa`: `if (!Array.isArray(locais) || foraDoTexto || (contagem !== undefined && contagem !== palavras.length))`, e dois casos
   no teste (`v(k, undefined, 'kael').premissaQuebrada === true`, `v(k, null, 'kael').premissaQuebrada === true`). O caso de `locations`
   **vazia** (`[]`) é outro: não o tratei como quebra porque não sei se o pagefind devolve lista vazia num acerto legítimo (por título,
   por exemplo); nas 110 páginas nunca vi uma vazia, mas só varri buscas por palavra do corpo.

## Observações, sem veredito (continuam na lista de quem varrer depois, §9)

- **A frase exata sem sequência completa** (`busca.ts`, `if (!sequencias) return {…, premissaQuebrada: false}`) também passa em silêncio.
  Numa busca entre aspas o pagefind só devolve acerto se as palavras estão em posições consecutivas, então "nenhuma sequência" também é
  premissa quebrada na prática; hoje o caso não ocorre no índice (0 em 992 pares na 144, e nas frases desta rodada), e uma mutação que
  o marcaria como quebra passa no teste (a 29). **Não proponho como conserto**: depende de uma decisão de quem conhece o contrato do
  pagefind para frases, e eu não o verifiquei.
- **O aviso só sai com o Aa ligado**, porque só aí `filtrarCaixa` roda. Com o Aa desligado nada depende da premissa; coerente.
- **Safari de verdade e o WASM do pagefind nele** seguem sem medir; o que se sabe vem do motor de compilação com alvo `safari16.3`.
- **O instrumento de corrupção** (servidor com gancho no pagefind) simula uma quebra, não uma versão real do pagefind, e só o `wc±1`,
  as posições deslocadas, `locations` e `locations` de seção removidos. Outras formas de quebra (um `word_count` coerente com um
  `content` de outra normalização, por exemplo) não foram exercitadas.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/146-revisora.md` e `docs/simulacao/caixa/progresso-revisora-146.md`.
`dist/` da worktree reconstruído (`astro build` e `pagefind`); nenhum arquivo rastreado foi tocado.
