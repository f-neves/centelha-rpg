# 143 · Revisora · Busca do site (`a9505c16` e `4711eeed`)

Pino: `4711eeed` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 4711eeed`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; `git rev-parse HEAD` e `--show-toplevel` conferidos).
Escopo: os dois commits, `src/components/Busca.astro` e `src/styles/global.css`. `git show --stat` dos dois: só esses
dois arquivos mudaram, nos dois commits (318+/33- e 6+/25-).

**Resultado: um CORRIGE (quatro pontos), uma PERGUNTA, uma ESCALA. Nada bloqueia.** O que o aviso pediu para reproduzir
reproduziu, no número. Os quatro pontos são o que a reprodução não cobria.

**CI da faixa (§11):** workflow `Validar dados e regras` no sha do trabalho: **verde** (run `37836605458`, 08/10/2026
20:03 UTC), e no `a9505c16` também verde (`37835592157`). `Deploy site (GitHub Pages)` verde nos dois. **Mas o CI não
toca a Busca:** `scripts/`, `.portoes/` e `.github/` só citam `pagefind` no `deploy.yml` (que gera o índice). Nenhum teste
lê `.busca-*`, os modos ou o Aa. O verde vale para o projeto; para a Busca, só o veredito abaixo vale.

## Como reproduzi

Não rodei `npm run build` (ele roda `gen-monsters.mjs`, que reescreve arquivos rastreados). Rodei `npx astro build` e
`npx pagefind --site dist` (pagefind **1.5.2**, 110 páginas, 6605 palavras; o índice de `/artes/` "sem `<html>`" é aviso
antigo, fora da faixa). Servi `dist/` por um servidor estático em `/centelha-rpg/` e dirigi o Edge headless
(`puppeteer-core`). O script e as saídas ficaram fora do repositório. **Só Chromium foi testado.**

Os números do aviso, no modo e na caixa pedidos:

| Busca | Resultado |
|---|---|
| "arma armadura", Palavras / Frase | **28 / 0** |
| "defesa contra projéteis", Palavras / Frase | **14 / 2** (`/equipamentos/` e `/regras/armas-e-armaduras/`) |
| "projéteis contra defesa", Frase | **0** (e "armadura arma", Frase+Aa, também 0) |
| "kael", Aa ligado / desligado | **0 / 6** ("Kael" com Aa: 6; "KAEL" com Aa: 0) |
| "absorcao" e "absorção" | **23 e 23** sem Aa; **5 e 5** com Aa |
| "armaduras" com Aa | **27**, igual a "armadura" (o plural digitado acha o singular); "armad" acha 34 (início de palavra) |
| vazio, só espaços | mensagem e lista limpas |
| só aspas (`"`, `""`, `"" ""`, `!!!`) | "Digite ao menos uma palavra." (ver ponto 4) |
| localStorage que lança `SecurityError` | busca e modos funcionam, sem erro de página; com storage normal, modo e Aa persistem no recarregar; lixo (`{{lixo`) e `null` no storage voltam ao padrão |
| 390 px e 320 px, diálogo aberto com resultados | `scrollWidth` do documento igual à largura da tela (390 e 320), do diálogo igual ao `clientWidth` (340 e 270), nenhum filho fora da caixa; aberto pelo botão da barra de cima, foco no campo |

## O que passou sem achado

- **Foco (1):** abre com o campo focado no clique (botão do menu e botão da barra), na tecla `/` com foco no corpo, na
  primeira e na segunda abertura, depois de fechar por Esc, por ✕ e por clique no fundo (que devolvem o foco ao botão). Com o
  índice atrasado em 3 s (servidor com `pagefind/` lento) o foco já está no campo, o que se digita espera o índice, e o
  resultado sai uma vez só. A `/` digitada dentro do campo da própria busca vira texto (`x/y`), e dentro de um campo da
  ficha (primeiro campo visível, `#txt`) não abre a busca. Com foco num radio do diálogo, a `/` leva o foco ao campo sem inserir
  o caractere.
- **Paleta A única (2), a parte de código:** não sobrou `data-paleta`, `paleta B/C` nem `--pagefind-ui-*` em `src/` (Grep no
  pino). O `pagefind-ui.js/css` não é mais carregado por ninguém.
- **XSS:** cinco termos (`<img src=x onerror=alert(1)>`, `<script>…`, `"><svg onload=…>`, `&lt;b&gt;`, `javascript:…`)
  nos quatro modos (Palavras, Frase, com e sem Aa): zero `img/svg/script/[onerror]` no diálogo, `window.__x` indefinido,
  nenhum `alert`. A mensagem do termo vai por `textContent`; título, link e título de seção também; o texto do Aa passa por
  `html()` antes do `innerHTML`. O trecho do modo sem Aa é o `excerpt` do pagefind (fonte confiável, é o texto do próprio
  site). Páginas do índice com `&` e `"` no conteúdo ("Sorte & Azar") saem com `&` literal e só `<mark>` como filho.
  **Não testei texto de página com `<`: o índice atual não tem nenhuma** (varri as 110).
- **"Mostrar mais", sem corrida:** "absorção" 23 (8, 16, 23), "armadura" Aa 27 (8, 16, 24, 27), "magia" Aa 20, "Defesa" Aa 51,
  "defesa" Frase+Aa 18: a lista chega ao total da mensagem, sem URL repetida e sem salto.
- **Digitação rápida:** com latência aleatória de até 500 ms no servidor, de 1 a 4 termos em sequência, com e sem Aa,
  o resultado final é o do último termo e a lista tem 8 itens sem repetição. (Uma bateria anterior com latência injetada
  pelo interceptador de requisições do puppeteer ficou presa em "Buscando…"; refeita com latência no servidor, convergiu.
  Tratei a primeira como defeito do instrumento, e a segunda, que imita rede, como a medida.)
- **Travessão e vocabulário:** `Busca.astro` não tem travessão, e as linhas 649 a 699 de `global.css` também não (os
  travessões que o arquivo tem são de linhas antigas, fora do diff). Nenhum "Perícia" no texto novo.
- **Contraste, a parte que passa:** medi a cor computada e o fundo composto de cada elemento do diálogo, nos três temas
  (`classico`, `escuro`, `legivel`). Mínimos: Clássico: chip marcado 5,02 · destaque 5,84 · placeholder 6,81 · trecho e dica 7,50;
  Escuro: placeholder 6,34 · trecho 6,77 · destaque 9,53; Legível: destaque 6,10 · placeholder 11,69. **Nenhum
  elemento do diálogo tem `opacity` menor que 1** (o `opacity:0` é só do `<input>` do chip, invisível por desenho).

## CORRIGE

1. **Aa + "Mostrar mais" perde resultado quando se clica durante o filtro (a corrida que o aviso pediu para procurar).**
   Em `buscar()`, com Aa ligado, `ativo`, `cand`, `fila` e `ptr` são trocados **antes** do laço que carrega o texto de todos os
   candidatos (`Busca.astro:223-232`), mas a lista antiga só é limpa **depois** (`:233`), e o botão "Mostrar mais" da busca
   anterior continua visível e clicável o tempo todo. Um clique nessa janela roda `mostrarMais` contra a `fila` nova, ainda
   parcial: anexa itens da busca nova na lista da antiga e avança `ptr`. Quando o laço termina, a lista é limpa e
   `mostrarMais(minha)` começa de um `ptr` que já não é zero.
   **Medido** (latência de 700 ms por fragmento só para tornar a janela observável; 2 cliques, aos 1100 e 1250 ms depois de
   digitar): "armadura" Aa (botão visível) e, em seguida, "combate" Aa. Referência limpa de "combate" Aa: **20 resultados,
   20 na lista, 20 URLs distintas**. Com a corrida: a mensagem diz **20**, a lista mostra 8 e o botão diz "Mostrar mais (3)";
   clicando até o fim chega a **11**, e **9 páginas ficam inalcançáveis** (`/mesa/combate/`, `/regras/combate/`,
   `/glossario/`, `/regras/habilidades/` entre elas). Numa segunda tentativa a lista terminou com 8 itens e "Mostrar mais (2)"
   no lugar de "(12)". Os dois clientes acham que está completo, porque a mensagem diz o total.
   **Alcançável?** Por caminho de jogo, sim: basta clicar "Mostrar mais" enquanto a busca seguinte filtra. Quanto dura a
   janela na rede real, **não medi**: ela é o tempo de carregar o texto de todos os candidatos, 12 por vez ("de" tem 108
   candidatos, nove levas). O sem-Aa não tem o defeito (`cand`, `ptr` e a lista trocam no mesmo trecho síncrono).
   **Conserto de uma linha, e é o que o aviso chama de "resposta antiga sobrescrevendo a nova":** `mais.hidden = true` logo
   depois de `++seq` em `buscar()` (o botão some enquanto a busca nova corre; o `[hidden]` global é `!important`, então
   vale). Ou montar `cand/fila/ptr/ativo` em variáveis locais e atribuir só depois do laço. A prova que falha sem o conserto
   é a deste item: busca com `Mostrar mais` visível, segunda busca com Aa e atraso, clique no meio, e comparar o total da
   mensagem com o alcançável.

2. **O Aa não é "a mesma busca, só com caixa exata": ele descarta o que o pagefind acha por radical.** O comentário em
   `:88-90` diz que os padrões "espelham o que o pagefind já aceita", e a dica do diálogo (`:34`) diz que o Aa "exige a mesma
   caixa das letras digitadas". O pagefind casa por **radical** (stemmer do português); o filtro só aceita **início de
   palavra** mais o `s` final. Medido, mesma palavra digitada em minúsculas, sem Aa contra com Aa:
   "lutando" **22 → 4**, "atacar" **23 → 5**, "animais" **18 → 8**, "magia" **31 → 20** (para "magia", 9 das 11 que somem não
   têm o prefixo nem ignorando a caixa, e 2 somem pela caixa). O texto dessas páginas traz formas como "luta", "lutar",
   "ataca", "ataque", "mágica", "mágico"; **não confirmei qual palavra o pagefind casou em cada uma**, só que a página
   não tem o prefixo digitado. Quem liga o Aa
   para separar "Kael" de "kael" perde, de quebra, toda forma flexionada e vê "Tente desligar o Aa", como se o problema
   fosse a caixa. **O comentário e a dica afirmam uma garantia falsa (§4.6).** Escolha de comportamento abaixo, em PERGUNTA;
   o texto tem de mudar de qualquer jeito.
   **O que NÃO está errado, e foi conferido:** acento ignorado, início de palavra, plural digitado acha o singular,
   "kael" 0/6, as caixas de "absorção". O que o aviso prometeu entre parênteses vale; o que o texto em volta promete a mais,
   não.

3. **Dois textos da Busca ficam abaixo de 4,5:1 no tema Clássico, e o aviso pede 4,5 sem `opacity` em texto.**
   - **Título "Busca" (`<strong class="cinzel">`, `Busca.astro:13`): 3,73:1 no Clássico** (cor `rgb(46,140,134)` sobre `--panel`).
     Vem da regra global `h1…h4, .cinzel { color: var(--accent-texto) }` (`global.css:167`); o bloco novo de CSS cobre tudo
     no diálogo menos esse título. Tem 21 px e peso 700, então passa o 3:1 de **texto grande** do WCAG, e **não** passa o
     4,5 que o aviso fixou. Escuro: 7,85; Legível: 8,04. A frase do bloco novo ("contraste pleno … Nenhum texto usa
     opacity") fala do diálogo inteiro e não cobre este título.
   - **`<kbd style="opacity:.6">` no botão "Buscar…" do menu (`Busca.astro:6`): contraste efetivo 3,98:1 no Clássico**
     (13,79 sem a opacidade); Escuro 5,44, Legível 4,94, esses passam. **Linha antiga**, o commit não a tocou, mas ela é
     texto com `opacity` dentro do componente que o aviso manda deixar sem. Se o autor aceita essa exceção por ser dica
     de atalho, o aviso tem de dizer; do jeito que está escrito, falha no Clássico.

4. **Só aspas deixa os resultados da busca anterior na tela, sob "Digite ao menos uma palavra."** Em `buscar()`, o ramo
   `!tokens.length` (`:214`) escreve a mensagem e retorna sem limpar a lista nem esconder o botão (o ramo do termo vazio, na
   linha de cima, limpa os dois). **Medido:** "absorção" (8 resultados e "Mostrar mais (15)"), depois `"`: a mensagem muda para
   "Digite ao menos uma palavra." e as 8 linhas e o botão ficam, e o botão continua funcionando sobre a busca antiga. Limpar
   `lista` e esconder `mais` no ramo resolve; é o mesmo conserto de um traço do ponto 1.

## PERGUNTA

**Aa deve ser (a) o subconjunto exato do sem-Aa, achando as mesmas páginas e só descartando as que não têm a caixa digitada,
ou (b) o que está no ar, prefixo literal mais `s`, com a dica dizendo isso?** Em (a), o pagefind devolve em `result.data()`
posições das palavras casadas (`locations`, `word_count`); **não investiguei** se isso dá a palavra exata casada para
conferir a caixa sem reimplementar o stemmer, então não prometo que (a) seja barato. Em (b) o conserto é só texto: o
comentário passa a dizer "início de palavra e plural em s, sem as flexões que o pagefind acha", e a dica ganha o exemplo
("lutando" não acha "luta"). A escolha é do autor, porque muda o que a caixa Aa significa na mesa. Conferi o registro:
`busca`, `pagefind` e `Aa` em `docs/decisoes-partes/` dão uma única ocorrência (`B.md:175`, a palavra "busca" numa frase
sobre outro assunto), então nenhuma decisão registrada trata da Busca do site; é comportamento de ferramenta, não de regra.

## ESCALA

**A Busca nova não tem nenhum teste.** Nada em `scripts/`, `.portoes/` ou `.github/` falha se `padroes`, `norm`,
`achados` ou o filtro do Aa forem removidos, e os números que este veredito reproduziu (28/0, 14/2, 0, 0/6) só existem
na cabeça de quem leu o aviso. As funções puras (`norm`, `padroes`, `achados`, `contem`, `realcar`) vivem num script
inline do `.astro`, que não se importa, e o índice só existe depois do build. Não é da rodada (ela não prometeu teste),
é a pergunta 3 do §4 sem resposta; fica com o Arquiteto decidir se vale um teste de `dist/` (índice + padrões extraídos
para um módulo) ou se a Busca fica coberta só por veredito.

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **Só Chromium (Edge).** O `padroes` usa lookbehind (`(?<!…)`, `(?<=…)`): Safari antes da 16.4 não o compila, e `buscar()`
  quebraria no Aa com a exceção silenciosa dentro de uma `async`, deixando "Buscando…" na tela. **Não testado.**
- **Rede real:** os atrasos foram injetados no servidor local. A janela do ponto 1 na produção não foi medida.
- **Absolvição por amostra:** o XSS foi conferido em 5 termos e nos 4 modos, e o texto de página com `<` não foi
  exercitado (nenhuma das 110 páginas tem). A contagem de "sem `opacity`" olhou os elementos do diálogo e o `<kbd>`; não
  varri o resto do site.
- **Cosmético, não é achado:** a mensagem "Carregando o índice…" nunca aparece, porque `abrir()` chama `ensure()` antes de
  `buscar()` e `carga` já está setado; o usuário sempre lê "Buscando…". E o Esc, com texto no campo, apaga o texto e mantém o
  diálogo aberto (comportamento nativo do `type=search`); o segundo Esc fecha.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/143-revisora.md` e `docs/simulacao/caixa/progresso-revisora-143.md`.
A árvore `dist/` da worktree foi reconstruída (`astro build` e `pagefind`); nenhum arquivo rastreado foi tocado.
