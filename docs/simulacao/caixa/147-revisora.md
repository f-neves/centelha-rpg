# 147 · Revisora · Armas de distância, rodada 1: dados do catálogo de Arremesso e tiro (`f3d52086`)

Pino: `f3d52086` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora f3d52086`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 146, `beb9b246`, é ancestral do pino).
Fonte do julgamento: o commit congelado contra o plano (`plano-reescrita-armas-distancia.md`, rodada 1), as D-072 a D-076,
D-082, D-085 e D-087 (`decisoes.md`), o `veterana-2f-distancia-e-precisao.md` (§4, §5, §6, §9, §10, com o cabeçalho de
correções) e o `adendo-2f.md`. O despacho da Executora (a mensagem do commit) tratei como hipótese.

**Resultado: um CORRIGE (dois pontos, os dois pequenos), uma ESCALA, e as respostas às seis perguntas do aviso. Os números do
catálogo estão certos nas 21 armas; o resto do que a rodada afirma procede, com os três senões abaixo.** Nada bloqueia.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde no sha do trabalho**, `f3d52086` (run `38023158795`,
10/10/2026 04:10 UTC), com os **18 jobs verdes**: `Dados e regras` e os 17 `Smoke` (entre eles `test-grid-simultaneo`,
`test-interpor-mesa`, `test-golpe-caido`, `test-espelho`, rodados num Chrome que o CI não deixa pular). `Deploy site` verde
(`38023158743`). Isso pesa na pergunta 3: é prova de Grid mais forte que a local.

## Como conferi

- **Célula a célula, de duas maneiras que não passam pelo teste da Executora.** (a) Li o `armas.json` do pino (21 armas de tiro e
  arremesso: 7 colunas por arma) contra o §10 e o §4.2 do 2f e a D-076/D-082, à mão. (b) Escrevi um leitor que extrai a tabela de
  Arremesso do próprio `.md` do 2f (Velocidade, dano, Acerto, Efetiva, Peso, Mãos, N) e compara com o `armas.json`: **12 de 13
  linhas batem**, e a 13ª (Funda, "pedra de 100 g") só diverge porque meu leitor não converte a célula "pedra de 100 g"; o catálogo
  tem 0,1 kg, que é o peso do 2f §6. Arcos e bestas contra D-082 e §4.2: **6 de 6**. `regras.json` `combate.distancia` contra a
  D-075: as três linhas da tabela dos arcos (24 números), as bestas (100, 200, 300), Força máxima padrão do Curto 3, Força acima de
  8 conta 8, ×2 da Funda e do atlatl, −3 e +1 Tick por incremento: **todos iguais**.
- **Sem dano colateral nas armas antigas.** Comparei campo a campo cada arma que já existia (`f3d52086~1` contra `f3d52086`): só
  mudaram os campos que a rodada diz (Efetiva nova; Velocidade e dano das pesadas de arremesso e dos arcos Longo e Composto; o Arco
  Curto 1d6−2 e +2; Rede 1,5 para 3 kg; adaga 0,2 para 0,25 kg; o `bumerangue` virou "Bumerangue de retorno" com 1d6−2). **Nenhum
  `distMax` mudou, nenhum campo de corpo a corpo mudou.** Entrou 8, saiu 1 (33 para 40 armas).
- **Reproduzi o que dava.** Rodei `validate-data`, `test-contrato`, `test-combate-tempo`, `test-folha-arremesso`, `test-kael`,
  `test-catalogo-distancia`, `gen-cap-itens --check` e `gen-bench-tempo --check` no pino: todos verdes. `npx astro build` do pino e
  a tabela "Armas à Distância" da página Equipamentos conferida no HTML gerado (coluna Efetiva, ordenada por ela, sem Dardos).
- **Controles negativos meus**, no `validate-data` e no teste novo (resultado nos itens abaixo).

## 1 · Os números (pergunta 1)

**Estão certos.** Efetiva par nas 21; Velocidade, dano, Acerto, Peso, Modos e Perfuração conforme o 2f §10: Shuriken, Mini-faca e
Kunai V4 · 1d6−4 · +1; Adaga V5 · 1d6−2 · +1; Plumbata V5 · 1d6−2 · +0 · 14 m · 200 g · ★P(N1) com as tags `projétil veloz` e
`bloqueável`; bumerangue de retorno (Impacto e Cortante) V5 · 1d6−2 · +1 · 20 m · 300 g; bumerangue de caça (Impacto e Cortante) V6 ·
1d6 · +0 · 16 m · 700 g; Machado V6 · 1d6 · +1 · 12 m · 700 g · ★C · I; Azagaia V6 · 1d6 · +1 · 16 m · 800 g · N1; Pilum V6 · 1d6 · +1 ·
12 m · 2 kg · N2; Boleadeira V6 · 1d6−4 · +0 · 16 m · 600 g · Impacto; Rede V6 · +0 · 4 m · 3 kg; Funda V6 · 1d6 · +1 · 26 m; Curto V6 ·
1d6−2 · +2 · 30 m; Longo V7 · 1d6 · +0 · 50 m; Composto V7 · 1d6+2 · +0 · 70 m; bestas V9, V12, V15 com 40, 60 e 80 m. O id `bumerangue`
ficou como o de retorno em Impacto, e entraram `bumerangue-de-caca`, `bumerangue-de-caca-cortante` e `bumerangue-de-retorno-cortante`.
O atlatl sai com Velocidade 8 (P5/G1/R2) nas duas contas (`regras.json` e `armas-extras.json`).

**Três coisas que a tabela não diz e eu conferi:**
- **A Rede ainda tem `dado: 1` e `danoBonus: 0`**, e a página Equipamentos a mostra com Dano **1d6**, ao lado de uma descrição que
  diz "sem dano". Não é desta rodada (a Rede já era assim e o catálogo exige `dado` ≥ 1), e a N22 já o declara; vai só para quem
  reescreve a descrição na rodada 2 (ver "Sugestões de frase", item 3).
- **As 8 armas novas não têm `preco`** (e a Plumbata perdeu o dos Dardos). O esquema o aceita ausente (`preco.optional()`), nenhum
  leitor de `src/` desreferencia `arma.preco.pc`, e a tabela de preços do capítulo gerado simplesmente não as lista. É o que o plano
  manda (rodada 2: Plumbata 35 pc, D-085; o resto espera a economia). Anoto para ninguém estranhar a lacuna na página Equipamentos
  nesse meio-tempo.
- **Shuriken, Mini-faca e Kunai trazem a tag `projétil veloz`; Machado, Azagaia e Pilum não.** O 2f §10 não lista a tag em nenhuma
  linha (a coluna Destaque diz só "Ágil, munição"), e a que a Adaga e a Funda têm vem do site. Pôr a tag nas três leves é coerente com a
  Adaga (a mesma família), mas é escolha da Executora, não do 2f; é o tipo de caso que o Mestre resolve sem pergunta (D-087), então
  só registro.

## 2 · Dardos (pergunta 2)

- **Nenhuma ficha de exemplo, fixture ou seed usa `a:dardos`** (varri `src/`, `scripts/`, `supabase/` e `public/`): o que sobra do
  plural `Dardos` são três pontos de **arte e ferramenta** e dois textos de capítulo (rodadas 2 e 4a).
- **Mas três referências ao id não foram tocadas, e a mensagem do commit diz que "foram acompanhadas":** `scripts/baixar-imagens-equip.mjs:86`
  (`{ id: 'dardos', met: 'dart', … }`), `src/styles/arte-equip.css:36` (`.arte-dardos`, a célula 100%/100% do `haste.webp`) e
  `scripts/folhas-ia.json:122` (o prompt de imagem dos "três dardos"). O plano as listava como o que "precisa acompanhar". Nada
  quebra (nenhum teste e nenhum código as lê; a CSS fica morta), e deixá-las pode ser a escolha certa, **mas o texto do commit não
  diz "deixadas"**, diz "acompanhadas", e o aviso do Arquiteto pediu para confirmar que nada aponta para o id: **três coisas ainda
  apontam.** Entra no CORRIGE 1.
- **Consequência visível, que o commit não cita:** a ficha desenha a arte de cada peça pela classe `arte-<id>`
  (`ficha-engine.ts:1281` e `:1435`), e as **8 armas novas não têm essa classe**, então o quadro da imagem fica vazio no card da
  ficha e no diálogo de adicionar. Pelo CSS e pela leitura; **não abri a ficha com a Plumbata para ver o quadro**. É arte do autor,
  não dado; vai como pendência de arte (CORRIGE 1).
- **O capítulo tocado, `custo-qualidade-e-equipamento.md`, mudou só pelo gerador:** o diff é a linha "Dardos | 5 pc" saindo e
  "Bumerangue" virando "Bumerangue de retorno" (`gen-cap-itens --check` verde, 53 itens com preço). Os outros arquivos gerados
  (`combate-tempo-bench.html`, `Pendencias.md`) e as três citações reapontadas (K, L, REVISORA) só trocaram números de linha, e conferi
  que nenhuma outra linha mudou neles.

## 3 · D-054, o Grid, a N22 e a Trava 2 (pergunta 3)

- **O que não foi tocado, confirmado por `git diff --stat`:** `equip.ts`, `alcance.ts`, `combate-tempo.ts`, qualquer arquivo do Grid, a
  mesa, `condicoes.json`, `efeitos.json`, `inimigos.json` e `monsters-mesa.json`. Em `src/` mudaram só `ficha-engine.ts` (uma linha de
  exibição: "Efetiva" quando há, "Distância" se só há `distMax`, "Defesa" no corpo a corpo), `equipamentos.astro` (a coluna e a
  ordenação) e `content.config.ts` (o campo opcional). **`distMax` intacto em todas as armas** (a comparação campo a campo acima).
- **A N22 é correta no que diz, e eu medi três coisas dela:** (a) o Grid deriva Preparo e Recuperação de `classe` + `ticks` por `regras.json`
  `combate.pgr.preparo` (distância P = V−1, arremesso P = V−2), então a pesada de arremesso sai 4/1/1 e o Longo 6/1/0, exatamente como
  ela escreve; (b) `distMax` dos arcos e bestas bate com a Máxima nova na Força 3 (120, 250, 300) e com as bestas (100, 200, 300); (c) as
  8 armas novas não têm `distMax`.
- **A N22 subestima uma consequência de (c), e eu a medi:** `alcanceInterpor` devolve `pode: true` quando `faixaDeDistancia` é nula
  (`alcance.ts:179`), **antes** de checar a linha de tiro. Com a azagaia, a adaga e os arcos, o interposto é barrado pelo alcance
  máximo e pela reta (azagaia a 20 m fora da linha: não; a 60 m: "além de 40 m"); com Plumbata, Shuriken, Boleadeira e bumerangue de
  caça, **ele passa em qualquer distância e fora da linha** (300 m, `naLinha: false`: pode). A N22 diz "avisa e não impede", o que é
  verdade; falta dizer que também some a exigência da **reta**. Uma linha na N22 resolve (CORRIGE 2). Não toca o Grid.
- **A prova da Trava 2 basta para o que a rodada mudou, com uma ressalva.** Basta porque: o formato da arma não mudou (campo novo e
  opcional), `test-contrato` volta as 40 armas por `armaDoSlot` e atravessa `resumoCombatePC` e `resumoFicha`, e o CI roda os 17 smoke
  do Grid e da mesa no Chrome sobre o `armas.json` novo (todos verdes). A ressalva: **nenhuma das provas carrega uma ficha vinda do
  banco** (a Executora o diz; o banco está fechado pela RLS), e o `test-grid` completo está desligado (D-071). Uma ficha salva que só
  traga ids que existem não muda de forma; uma que traga `a:dardos` deixa de achar a arma (aceito pelo autor).
- **Os números exatos de `distMax` das 7 armas antigas não estão presos por teste nenhum.** O `test-folha-arremesso` exige `> 0` e o
  teste novo exige `distMax >= Efetiva`; eu troquei a azagaia de 40 para 30, a Funda de 200 para 100 e o bumerangue de 50 para 20, e
  **o `test-catalogo-distancia` passa nos três** (só o pilum, de 25 para 10, cai, por ficar abaixo da Efetiva). A D-054 inteira repousa
  nesses sete números (são o que o Interpor do Grid lê). Entra no CORRIGE 2.

## 4 · O atlatl em `armas-extras.json` (pergunta 4)

**É o lugar certo.** `armas.json` é lido como lista de armas por `equip.ts` (`armaDoSlot`), pela coleção de conteúdo
(`content.config.ts`: `file('src/data/armas.json')`), pelos geradores (`gen-cap-itens`, `gen-lista-equip`, `gen-monsters`,
`gen-bench-tempo`) e pelas simulações; pôr o atlatl lá o faria aparecer como arma no seletor da ficha, na mesa e no bestiário. Procurei
quem enumera `src/data/*.json` por glob ou `readdir` (nenhum) e quem lê `armas-extras.json` (só `validate-data.mjs`, que o valida, e o teste
novo), então **nenhum outro leitor o ignora errado** e nenhum o tropeça. O esquema `S['armas-extras']` é estrito e o teste fixa
"só com a azagaia", "sem `mudaEfetiva`" e "fora de `armas.json`". O que ainda não existe é o leitor (a ficha e a mesa não o usam),
que é das rodadas 2 e seguintes; não é defeito desta.

## 5 · P/G/R só na Velocidade (pergunta 5)

**Não deixa o catálogo incoerente de um jeito que quebre ficha ou teste.** A rodada trocou as Velocidades (somas P+G+R da D-082) e deixou
o racha para a 4a; a ficha mostra só "Veloc."; o Grid deriva o racha antigo da fórmula de hoje (N22). `test-combate-tempo` ficou com o
ESPERADO "até a 4a" e comentário que diz por quê; `arco-longo` 6/1/0, `azagaia` 4/1/1, `plumbata` 3/1/1, `shuriken` 2/1/1, `boleadeira`
4/1/1 são o que a fórmula dá com as Velocidades novas, e conferi cada um à mão. As somas da D-082 batem com as Velocidades
do catálogo em todas as classes (leve 2+1+1=4, média 3+1+1=5, pesada 3+1+2=6, Funda 4+1+1=6, Curto 4+1+1=6, Longo e Composto 4+1+2=7,
bestas 7+1+1, 9+1+2, 12+1+2, atlatl 5+1+2=8). **A divisão com o plano é coerente:** a 4a lista "armas.json (P/G/R e Velocidade das
armas de tiro) e regras.json `combate.pgr.preparo`" como dados dela, e a rodada 1 fez só a Velocidade, que o catálogo e a página
Equipamentos já precisavam. O que fica incoerente é de **texto**, e é esperado: o livro (`armas-e-armaduras.md`, `combate.md`) segue com
Dardos, Distância, e as Velocidades antigas até as rodadas 2 e 4a.

## 6 · `forcaMin: 4` do Arco Composto e a D-075 (pergunta 6)

**Não é conflito real, e não vai ao autor** (D-087, pelos três filtros).
- **Os dois "mínimos" são coisas diferentes com o mesmo nome.** A D-075 fala de **armar**: Força mínima = Força máxima do arco − 3, só
  onde há Força máxima definida (Curto reforçado, arco de criatura). O `forcaMin: 4` do Composto é a **M-32** (decidida em 15/09/2026,
  implementada em `2946398`, `jogador-novo-decisoes.md`): abaixo de Força 4 o Composto **não fica proibido**, soma `Força×1` e parte de
  `+0`, que é o que um Arco Longo dá (`calc.ts`, `comRequisitoDeForca`).
- **Filtro 1 (o registro):** a D-075 não revoga a M-32, e a M-32 **não está em `decisoes.md`** (mora em
  `docs/simulacao/caixa/jogador-novo-decisoes.md`), então a busca no registro não a acha, e foi por isso que a Executora a viu como
  divergência. **Filtro 2 (a Veterana):** o 2f §2 registra o estado do site como "Composto ×2 com Força 4 ou mais" e **não o corrige**; e a
  tabela do §5.3 tem as colunas Força 1 a 3 para o Composto (120, 215, 300 m), que só fazem sentido se quem tem Força 1 a 3 pode usá-lo,
  que é o que a M-32 permite. **Filtro 3 (o Mestre):** não há caso de borda.
- **O que a mudança afetaria, se alguém tirasse o campo:** reabriria o defeito que a M-32 fechou (Força 1 com Composto = 1d6+4, contra
  1d6+1 do Longo). Os três leitores do número (`ficha-engine.ts:885`, `combate-resumo.ts:106`, `lib-tempo.mjs`) passariam a dar `×2` e
  `+2` a quem não tem Força 4, e o `test-contrato` (§9) **falharia de propósito** (`o Arco Composto continua pedindo Força 4`, e exatamente
  uma arma com `forcaMin`).
- **O risco real é de nome, não de regra:** quando os arcos reforçados entrarem (Força máxima − 3), alguém vai querer reusar o campo
  `forcaMin` para a D-075, e o campo já significa outra coisa. Vai como sugestão de frase para a rodada 2 (item 1 de "Sugestões").
  Recomendo registrar a M-32 em `decisoes.md` com a nota "convive com a D-075", para o filtro 1 achá-la da próxima vez.

## CORRIGE

1. **O que a mensagem do commit diz de `dardos` e da arte não bate com o disco.** (a) `baixar-imagens-equip.mjs:86`, `arte-equip.css:36` e
   `folhas-ia.json:122` seguem apontando para o id removido, e o commit diz que as seis referências "foram acompanhadas"; só `armas.json`,
   `test-combate-tempo` e `combate-tempo-bench.html` o foram. Nada quebra. Ou se troca (as três apontam para `plumbata`, se a arte do
   dardo servir) ou o commit e a N22 passam a dizer "deixadas, sem efeito"; o aviso do Arquiteto e o plano pediam que nada apontasse.
   (b) As 8 armas novas (Plumbata, Shuriken, Mini-faca, Kunai, Boleadeira e os três bumerangues novos) **não têm arte** (`.arte-<id>`), e o
   quadro da imagem fica vazio na ficha e no diálogo de adicionar; vale uma linha na N22 ou numa pendência de arte para ninguém achar que
   é defeito de dado.
2. **Dois furos de prova da D-054, e a N22 incompleta numa frase.** (a) **Nenhum teste prende os números de `distMax` das sete armas
   antigas** (adaga 10, machado 12, azagaia 40, Funda 200, bumerangue 50, Rede 5, pilum 25), que são o que o Interpor do Grid lê e a
   razão de a rodada tê-los deixado: três mutações minhas (azagaia, Funda, bumerangue) passam no teste novo e no `test-folha-arremesso`.
   Um objeto fixo de sete números no `test-catalogo-distancia` fecha. (b) A N22 diz "avisa e não impede" para as 8 armas sem `distMax`; **medi**
   que o `alcanceInterpor` também deixa de exigir a **reta** para elas (300 m fora da linha: pode). Dizer isso na N22, em meia linha.

## ESCALA

**A parte do dano da D-075 ("Força acima de 8 conta como 8, no alcance E no dano") não tem dado no catálogo.** O alcance está em
`regras.json` (`forcaAcimaDeContaComo: 8`, que nada lê), e o dano exigiria `forcaCap: 8` no Longo e no Composto (hoje sem `forcaCap`;
os três leitores já respeitam o campo no Curto). **O teste novo proíbe isso**: `for (const id of ['arco-longo','arco-composto']) if (forcaCap != null) f.push('… Força máxima definida por padrão (D-075 não dá)')`,
e eu confirmei que ele cai com `forcaCap: 8` no Longo. O que o teste chama "Força máxima definida" (o `forcaCap` do Curto, 3) e o "teto 8" do
adendo são duas coisas no mesmo campo. **Efeito em mesa:** só para Força 9 ou mais (criaturas e não mortais), porque os mortais vão a 6. É
decisão de quando entra (4a, com o motor, ou antes) e de que campo usar; **não é pergunta ao autor** (o adendo item 3 já decidiu).

## Sugestões de frase para o Mestre (D-087), para a rodada 2 e seguintes

1. **Arco Composto e a Força.** "O Arco Composto só rende o dobro da Força, e o bônus de +2, com Força 4 ou mais; com menos, rende como um
   Arco Longo. Isso não é a Força mínima dos arcos reforçados (Força máxima do arco menos 3), que é uma regra à parte." (Evita que a mesa
   leia as duas como a mesma.)
2. **Interposição com arma sem alcance no catálogo** e outros casos de borda de tiro são do Grid; nenhuma frase de livro é necessária.
3. **Rede.** A descrição deve dizer "não causa dano" sem depender do dado: o catálogo mostra 1d6 na coluna Dano até o esquema aceitar
   `dado: 0` ou a rodada 2 trocar a célula por um marcador de vazio.
4. **As três leves de arremesso** (Shuriken, Mini-faca, Kunai) **e `projétil veloz`:** "Armas pequenas de arremesso (shuriken, mini-faca,
   kunai) contam como projétil rápido, como a adaga de arremesso; o Mestre julga o que for diferente." Só se a rodada 2 quiser registrar a
   escolha da Executora no livro.

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **A ficha com a Plumbata e as outras novas**: vi a tabela da página Equipamentos no HTML gerado e li o código da ficha, mas **não abri a
  ficha no navegador**. A Executora a abriu (Efetiva 14 m, 30 m, 16 m); o quadro de arte vazio vem da leitura do CSS.
- **Ficha vinda do banco** (RLS fechada): não consultada, por mim e por ela. A frase "o autor diz que nenhuma ficha usa Dardos" segue
  sendo a única base.
- **Os três controles do `validate-data`** (Efetiva ímpar, Funda sem Efetiva, Efetiva na espada longa) **refiz**, mais Efetiva 0 e negativa:
  os cinco falham como deveriam. Não refiz os onze estragos internos do `test-catalogo-distancia`; confiei no `test-catalogo-distancia`
  verde e acrescentei os meus (18 mutações: 5 pegas pela tabela; 11 que ela não pega, a saber `distMax` da azagaia, da Funda e do bumerangue, `distMax` posto na
  Plumbata, as tags `prende` (Boleadeira e Rede), `ágil` e `munição`, o modo secundário do machado, o atributo da azagaia e a tag `pesada`
  da besta grande; e 2 de `forcaMin` do Composto, que o `test-contrato` pega).
- **Tags, modos secundários e atributo (`atrib`) das armas** não estão presos por teste; fecham-se na rodada 4 ou quando alguém os ler.
- **Travessão e vocabulário:** nenhuma linha adicionada no diff tem travessão, exceto o texto de célula vazia de `equipamentos.astro` (o marcador da coluna,
  herdado da linha que substituiu); a única ocorrência de "Perícia" nas linhas adicionadas é a **chave** `"pericia"` do JSON, que é o esquema,
  não texto. A mensagem do commit não tem travessão nem coautoria.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/147-revisora.md` e `docs/simulacao/caixa/progresso-revisora-147.md`. `dist/` da worktree
reconstruído (`astro build`); nenhum arquivo rastreado foi tocado (restaurei de imediato cada cópia de `armas.json` que mutei, e o
`git status` terminou limpo).
