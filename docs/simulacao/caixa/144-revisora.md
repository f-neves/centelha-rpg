# 144 · Revisora · Busca do site, segunda passada (`6a8b5480`, `e9f57a48`, `26963b56`)

Pino: `26963b56` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 26963b56`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 143, `df57a910`, é ancestral do pino).
Escopo: os três commits, em `src/components/Busca.astro`, `src/styles/global.css`, `src/lib/busca.ts` (novo),
`scripts/test-busca.mjs` (novo), `package.json` e `scripts/mapa-cobertura.mjs`. `git diff --stat 4711eeed 26963b56`: fora
os dois arquivos de caixa do veredito 143, só esses seis mudaram.

**Resultado: um CORRIGE (dois pontos), uma ESCALA. Nada bloqueia.** Os pontos 1, 3 e 4 do veredito 143 fecharam, cada um
com o caso de reprodução que eu usei na primeira passada. A opção A do autor (Aa só filtra a caixa das palavras que o
pagefind casou) está implementada como o autor pediu, e nunca devolve mais que o sem-Aa. O que sobrou é um defeito novo de
compatibilidade (Safari antigo) e dois buracos no teste que a rodada escreveu.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde** nos três shas: `6a8b5480` (run `37841879573`),
`e9f57a48` (`37843428968`), `26963b56` (`37844226383`, 08/10/2026 21:05 UTC); `Deploy site (GitHub Pages)` verde nos três.
Diferente da primeira passada, o `validate` agora **roda o `test-busca.mjs`** (`package.json`, antes do `test-portoes`), então
o verde cobre a regra de casamento. Ele **não cobre** o que o componente faz no navegador (botão, foco, lista): ver ESCALA.

## Como reproduzi

Mesmo método da rodada 143: `npx astro build` e `npx pagefind --site dist` (pagefind 1.5.2, 110 páginas) sobre o pino, servidor
estático em `/centelha-rpg/`, Edge headless por `puppeteer-core`. A bateria é minha e ficou fora do repositório. **Só
Chromium foi testado.** A bateria de produção rodou sobre o `dist/` que o Astro gerou, com o script já empacotado e
com hash (`dist/_astro/Busca.astro_astro_type_script_index_0_lang.*.js`), não sobre o dev server.

## 1 · Os pontos do CORRIGE 143

- **Ponto 1 (Mostrar mais na busca seguinte): fechou.** `buscar()` esconde o botão logo depois de `++seq` (`Busca.astro:146`)
  e a lista e o estado (`ativo`, `cand`, `fila`, `ptr`) passam a trocar no mesmo trecho síncrono (`:166-168`). Meu caso:
  "armadura" com Aa (27, "Mostrar mais (19)"), depois "projéteis" e "combate" com Aa e 700 ms de latência por fragmento.
  Amostrei o botão a cada 100 ms: **0 amostras com o botão visível enquanto a mensagem era "Buscando…"**, e um clique de
  verdade (`page.click`) falha com "Node is either not clickable". No fim: mensagem 20, lista 20, 20 URLs distintas,
  "Mostrar mais" até o fim sem perda (a referência limpa de "combate" com Aa também é 20). **Cuidado de leitura:** a trava é
  a visibilidade do botão, não o estado. O handler (`:192`) continua chamando `mostrarMais(seq)` se alguém o disparar por
  código (`btn.click()` num botão oculto roda o handler; foi o que me enganou numa leitura intermediária e fez parecer que
  o conserto falhava). Nenhum usuário alcança isso, porque elemento `[hidden]` não recebe clique nem foco, então não é
  achado; é o motivo de eu não aceitar prova de "o botão não faz nada" por clique programático.
- **Ponto 3 (contraste): fechou.** Título "Busca": **11,23** Clássico, **10,78** Escuro, **11,77** Legível (era 3,73 no Clássico).
  Atalho `/` do botão: **7,50 / 6,77 / 12,63** e `opacity` 1 (era 3,98 efetivo no Clássico, com `opacity:.6` inline). Medi a cor
  computada e o fundo composto de cada elemento do diálogo nos três temas, como na 143; o mínimo do diálogo continua o chip
  marcado do Clássico, 5,02. Nenhum texto do diálogo com `opacity` menor que 1.
- **Ponto 4 (só aspas): fechou.** "absorção" (8 resultados e botão), depois `"`: mensagem "Digite ao menos uma palavra.", **0 linhas
  e botão oculto**. Os outros termos sem palavra (vazio, espaços, `""`, `"" ""`, `!!!`) deram o mesmo, e `"kael"` (aspas
  digitadas em volta de uma palavra) acha os 6.

## 2 · A opção A do autor: o Aa só filtra a caixa

Os números do aviso, pela interface do `dist/` (minúsculas digitadas):

| palavra | sem Aa | Aa (143) | Aa agora |
|---|---|---|---|
| lutando | 22 | 4 | **20** |
| atacar | 23 | 5 | **23** |
| animais | 18 | 8 | **15** |
| magia | 31 | 20 | **27** |
| kael | 6 | 0 | **0** ("Kael" com Aa: 6) |
| uldun | 2 | 0 | **0** ("Uldun" com Aa: 2) |

Bate com o que a Executora mediu (20 / 23 / 15 / 27) e com a mensagem do `26963b56`. "absorcao" e "absorção" continuam em 5 e 5
com Aa; "armaduras" acha 27, igual a "armadura". As marcas do trecho mostram a regra: "lutando" marca `luta`, `lutar`, `luto`,
`lutando`; "Kael" marca `Kael` e `ExemploKael`; a frase "Defesa contra projéteis" marca as três palavras. Trecho e seções
com Aa sempre trazem `<mark>` (0 trechos e 0 seções sem marca nas seis buscas que conferi).

**O caso em que o Aa AUMENTA em relação ao sem-Aa: não existe, e não pode existir por construção** (`fila` só recebe itens de
`cand`, e `cand` é o resultado do mesmo `pf.debouncedSearch(termo)` do sem-Aa). Medi também de fora: 992 pares
consulta-modo (400 palavras sorteadas do vocabulário do índice nas três caixas, mais 80 pares de palavras e as frases) rodando
o `filtrarCaixa` do módulo empacotado sobre os `locations` reais: **0 URLs com Aa fora do conjunto sem Aa**.

**Alinhamento dos `locations` com `content.split(' ')`, de que a regra inteira depende:** nas 110 páginas, `word_count` é igual ao
número de pedaços do `split` (nenhuma divergência, nenhum pedaço vazio, nenhum espaço duplo, tab, quebra ou espaço
inseparável no `content`), e em 4232 posições (página e seção) de 10 termos, **todas** apontam para uma palavra que contém o
radical de 3 letras digitado. É a premissa que o comentário de `busca.ts:10-11` afirma; ela vale hoje no índice, e nada a
guarda (ver ESCALA).

**A regra de "neutros":** a palavra digitada sem nenhuma palavra casada parente faz o resultado passar. Nos 992 pares, **zero**
resultados passaram por neutro (o número da mensagem do commit, "0 nos 23 termos medidos", se confirma em escala maior), e
nas frases também zero. Ou seja, a regra é uma válvula que o índice atual não aciona; **não consegui fazê-la deixar passar o
que não devia** com texto real. Duas coisas que testei de propósito: a palavra de ligação ("de" no lugar de "contra" em
"Defesa de projéteis": o pagefind ignora a palavra de ligação e devolve os mesmos 14) não vira neutra, porque "de" é parente de
"defesa"; e "Defesa CONTRA projéteis", "DEFESA contra projéteis" e "A MAGIA" dão **0** com Aa, não passam. O que a regra faria é deixar
passar uma palavra digitada que o pagefind descartou e que não tem palavra parente casada; o resultado seria o mesmo do sem-Aa
para aquela palavra, o que é coerente com "só filtra a caixa do que casou". Não consegui construir esse caso no índice real.

**O prefixo de 3 letras:** vale para a decisão de "parente" (`busca.ts:45-51`): 3 letras iguais, ou a palavra inteira se uma
das duas tiver menos de 3. Sobre o índice real não achei par de palavras que o pagefind una por radical e que divida menos de 3
letras iniciais (nenhuma entrada em `neutros`). O defeito está no **teste** dessa regra, abaixo.

**Rejeições que o Aa antigo (143) aceitava e o novo recusa: 4 em 992**, todas explicadas pela própria opção A: "Corpo" em
`/bestiario/` (o único "Corpo" de maiúscula está colado em `PorteMédio·Corpo`, palavra que o pagefind não lista em `locations`),
"Graus" em `/artes/regras/` e "Orcs" em `/regras/racas/` (o texto só tem "graus"/"orcs"; o Aa antigo aceitava por tirar o `s` do
digitado e achar "Grau" noutro lugar). Nenhum dos quatro é defeito. **O que o autor deve saber:** com a opção A o Aa passa a
depender da tokenização do pagefind, então uma ocorrência colada por `·` (como `Médio·Corpo`) que ele não reporta não satisfaz o Aa.

## 3 · A ESCALA do 143 (teste da lógica no CI) e o controle negativo que fiz

**`scripts/test-busca.mjs` existe, roda verde (`node scripts/test-busca.mjs`, saída 0), está no `validate` (`package.json`, antes do
`test-portoes`) e no `mapa-cobertura.mjs`** (`['test-busca', ['busca']]`; o mapa lista `src/lib/busca.ts` dentro do pacote
`test-busca`, 6 KB). Isso fecha a pergunta 3 do §4 para a regra de casamento.

**Controle negativo, feito por mim:** copiei `busca.ts` e o teste para uma pasta de trabalho fora do repositório (a árvore
rastreada ficou intacta, `git status` limpo), apliquei uma mutação por vez e rodei o teste contra ela. Quinze mutações, uma por vez (a função de `escHtml` e as de `segmentos`, `caixa`, `parente`, `filtrarCaixa`, `tokensDe` e `termoPagefind`):

| mutação em `busca.ts` | o teste |
|---|---|
| sem comparar a caixa | **falha** (12 casos) |
| `caixa()` sempre devolve "certa" | **falha** (12) |
| sem o escape de HTML | **falha** (1) |
| sem a separação de camelCase | **falha** (1) |
| `tokensDe` contando pontuação | **falha** (6) |
| neutro derruba o resultado | **falha** (3) |
| `estranha` tratada como `errada` | **falha** (1) |
| frase sem exigir sequência | **falha** (por exceção, `undefined`, não por asserção) |
| frase sem conferir a caixa | **falha** (2) |
| `termoPagefind` da frase sem aspas | **falha** (2) |
| sem o filtro de posições fora do texto | **falha** (por exceção) |
| só o primeiro segmento da palavra | **falha** (1) |
| mínimo de 3 letras subindo para 5 | **falha** (1) |
| **mínimo de 3 letras caindo para 1** | **PASSOU** (o teste não pega) |
| **sem a separação por pontuação em `segmentos`** | **PASSOU** (o teste não pega) |

## CORRIGE

1. **Lookbehind em literal de regex: no Safari antes do 16.4 a Busca inteira deixa de carregar.** `busca.ts:35` tem
   `/[^\p{L}\p{N}]+|(?<=\p{Ll})(?=\p{Lu})/u` como **literal**, e o `dist/` o entrega como literal no script empacotado (conferi no
   arquivo gerado, `function X(e){return e.split(/[^\p{L}\p{N}]+|(?<=\p{Ll})(?=\p{Lu})/u)…`; o esbuild não o
   transforma). Um literal de regex com sintaxe que o motor não conhece é erro de sintaxe **na leitura do módulo**, não na hora de
   chamar. Resultado esperado em Safari/iOS até 16.3: o script não executa, nenhum botão de busca abre nada e a tecla `/` não faz
   nada, **com ou sem Aa**. Na primeira passada o risco era só do Aa (o padrão era montado por `new RegExp(string)` na hora do uso);
   foi a mudança de `26963b56` que o trouxe para o parse. É o **único** lookbehind de todo `src/` (Grep). **Não testei em Safari:**
   a descrição do efeito vem do que se sabe do motor (lookbehind em Safari desde a 16.4), não de medição.
   **Conserto de uma linha, e conferi que é equivalente:** `palavra.replace(/(\p{Ll})(?=\p{Lu})/gu, '$1 ').split(/[^\p{L}\p{N}]+/u).filter(Boolean)`
   (só `lookahead`, que o Safari antigo aceita). Comparei os dois em 200 mil cadeias aleatórias de letras, maiúsculas, dígitos,
   pontuação e `·`: **0 diferenças**. **Se o autor aceita perder a busca em iPhone com iOS 16.3 ou anterior, é decisão dele; o
   que ele precisa saber é que hoje isso não degrada, derruba.**

2. **O teste não prende duas regras que o commit e o comentário afirmam.** Controle negativo acima: (a) o mínimo de 3 letras do
   `parente()` pode cair para 1 e o teste passa; (b) a separação de pontuação do `segmentos()` pode sair e o teste passa. A (b) tem
   consequência de verdade: sem ela, `“Kael”` (aspas curvas) e `(Kael)` viram "estranha" e o resultado **passa** com o Aa
   quando o digitado é "kael", que é o vazamento que a regra existe para evitar; o código de hoje trata certo, e nada o protege
   de uma refatoração. Dois casos fecham os dois, com a forma que o teste já usa: `ok(!v(['veja', '“Kael”', 'agora'], [1], 'kael').ok, …)`
   (com o controle negativo `frouxo`), e para o mínimo de 3 letras `ok(v(['x', 'kaxyz'], [1], 'Kael').neutros === 1, …)` (duas
   letras iguais não fazem parentesco; com o mínimo em 1 viraria "errada" e derrubaria o resultado). A regra de 3 letras está no
   comentário (`:41-44`) e na mensagem do `26963b56`, então é promessa da rodada sem asserção (§4.6).

## ESCALA

**O que o componente faz no navegador continua sem teste commitado.** O `test-busca.mjs` cobre o módulo puro, que é o que a
ESCALA do 143 pedia, e a mensagem dos commits diz que as "31 verificações da Busca" (foco, modos, "Mostrar mais", só aspas,
celular) rodaram com 0 falhas. Esse script **não está no repositório** (`scripts/` só traz o `test-busca.mjs`), então os pontos 1
e 4 do 143 (botão oculto durante a busca, lista limpa no sem-termo) e o foco ficam protegidos só por este veredito e pela lembrança
de quem o rodou. Também sem guarda: a premissa de que `locations` indexa `content.split(' ')` (confere hoje nas 110 páginas, e uma
troca de versão do pagefind ou um `&nbsp;` no conteúdo a quebraria calada, com o Aa passando por neutro). Se vale um teste de
`dist/` (um passo depois do `pagefind`, conferindo `word_count == split(' ').length` em todas as páginas e o botão oculto por
um smoke), decide o Arquiteto; não é promessa da rodada.

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **Só Chromium (Edge).** Safari e Firefox não foram abertos; o ponto 1 do CORRIGE vem da especificação do motor.
- **A varredura de 992 pares** usa o vocabulário do índice de hoje (palavras que aparecem em 2 ou mais páginas). Não cobre
  digitação com erro, nem termos que não estão no livro (esses dão "Nenhum resultado" já no pagefind).
- **Absolvição por amostra:** as seis buscas da conferência de marcas, as 19 consultas de caixa mista e de palavras de ligação e os 10 termos do
  alinhamento de `locations` são amostras. A regra de neutros foi absolvida por "zero ocorrências", que é o zero ambíguo do
  `CONTRATO §5`: o contador existe (`neutros`), e nos 992 pares ele nunca saiu de zero, o que prova que a válvula não dispara
  no índice atual e não que ela esteja certa quando dispararia.
- **Rede real:** a latência foi injetada (servidor e interceptador). A janela do "Mostrar mais" é inalcançável por clique
  enquanto o botão está oculto, qualquer que seja a duração; não preciso mais dela.
- **Texto novo:** nenhum travessão nem "Perícia" em `Busca.astro`, `busca.ts`, `test-busca.mjs` nem nas três mensagens de
  commit (Grep nos arquivos; mensagens lidas por `rtk proxy git log`); nenhuma linha de coautoria nas mensagens. As linhas novas do
  `global.css` (668 a 671) também não.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/144-revisora.md` e `docs/simulacao/caixa/progresso-revisora-144.md`.
`dist/` da worktree reconstruído (`astro build` e `pagefind`); nenhum arquivo rastreado foi tocado.
