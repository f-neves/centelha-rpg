# Rodada 109 · Executora · o tamanho da J13, e o que a regra dos dois donos derruba (J12)

- **Despacho:** `docs/simulacao/caixa/109-despacho.md` (`0d1ae49`).
- **Árvore:** branch `executora`, posta em `0d1ae49` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-109.md`, com as horas lidas da máquina.
- **Nenhum commit de código.** Nada mudou em `src/`, e `glossario.json` e `Referencias.astro` não foram
  tocados. Este relato e o progresso saem num commit só de documento.
- **Build:** `npm run build` de `0d1ae49`, sem remover pasta nenhuma, e a prova no gerado:
  `dist/ref-index.json` (gravado às 20:37:18) com `dificuldade` = `["Dificuldade","dif"]` e
  `integridade` sem "compostura".

## O instrumento (serve às duas partes)

Tudo em `../tmp/executora/`:

- **`gerar-inj.mjs`** lê `src/components/Referencias.astro` e gera `autolink-inj.js`, que é a
  `function autolink()` de `:38-94` e o `norm` de `:18`, **copiados do arquivo**, só sem os tipos do
  TypeScript. O script para se alguma troca não casar exatamente uma vez. Tem três ganchos, todos
  desligados por padrão: `dono2` (a regra da J12), `semear` (antes de varrer, põe no `used` de cada
  bloco os ids dos `a.ref` que já existem nele) e `marca`.
- **`p109.mjs`** serve o `dist/` e abre cada página num de quatro modos: `real-semear` e
  `real-ingenua` (o autolink do site, e depois uma 2ª passada injetada, com e sem `semear`),
  `inj-base` e `inj-dono2` (o `ref-index.json` do site bloqueado, e depois a passada injetada sem
  opção ou com a regra). Uma página só é lida quando já não há `<template class="besta-adiada">` e
  quando o tamanho do texto do `<main>` e o número de `a.ref` ficam parados por 8 leituras de 250 ms.
  Um `MutationObserver` anota o tamanho do texto do `<main>` no instante em que aparece o 1º link. O
  contexto de cada link é recortado na posição exata dele (um `Range` até o link), e não pelo
  `indexOf`, que casava "poder" dentro de "poderoso".
- **`cmp109.mjs`** compara duas medições por (verbete, href, página, palavra), como multiconjunto.
- **O controle do instrumento.** A passada injetada sem opção deu, por chave, **exatamente** o
  autolink do site: 4346 links contra 4346, **zero chave diferente**, nas 99 páginas que não dependem
  da hora (todas menos `bestiario` e `ficha`). As 6 páginas da `/mesa` com `data-refs="off"`
  (arquivos, combate, diario, grid, grupo, mapas) não pedem o índice e ficam fora de tudo.

## 1 · Parte 1 · J13, o tamanho

### 1.1 · Por que o autolink roda uma vez só

`start()` (`Referencias.astro:288-291`) roda uma vez, no `requestIdleCallback` (`:292`), e chama
`load().then(() => { autolink(); renderConsulta(); })`. Não há observador de DOM nem outra chamada.
O comentário de `:263-284` trata só de **quando baixar o índice**: páginas de instrumento marcam
`data-refs="off"`, porque a medida de prosa falhava no Grid e na Ficha. Ele não diz nada sobre rodar
uma vez só. **Não achei razão escrita: é como foi escrito.**

Há, porém, **uma razão técnica medida contra chamar o `autolink()` de novo do jeito que ele está.**
Ele não é idempotente. O `used` nasce vazio a cada chamada (`:54-58`), e o walker só pula o texto
que já está dentro de `.ref` (`:48`). Então uma 2ª chamada linka a próxima ocorrência de cada
verbete em todo bloco que já tinha um link dele (seção 1.2).

### 1.2 · Rodar de novo quando as fichas acabam de montar, e o que isso duplica

Medido nas 101 páginas, contando o link duplicado por bloco (o mesmo verbete duas vezes no mesmo
bloco, sendo o bloco o `closest(BLOCK)` ou o `main`):

| 2ª passada | links antes | depois | duplicados | páginas com duplicata |
|---|---|---|---|---|
| **ingênua** (o `autolink()` do site chamado de novo) | 5323 | 6757 | **646** | **47** |
| **semeada** (o `used` de cada bloco começa com os links que já existem) | 4970 | 6111 | **0** | 0 |

- **A ingênua duplica em quase metade do site:** `regras/combate` +64, `tecnicas` +53,
  `artes/efeitos` +47, `artes` e `artes/regras` +45, `ficha` +42, até `regras/defesas` +4. Os
  verbetes que mais dobram: `arte` 53, `modos-de-dano` 53, `banda` 52, `centelha` 45, `ticks` 38.
  **Fora do bestiário, ela só acrescenta duplicata** (622 links novos, 622 duplicados). No bestiário
  ela leva a página de 882 a 1694, com 24 duplicados.
- **A semeada não duplica nada, e completa o bestiário:** 616 → **1670**. Por chave, é igual ao
  bestiário montado inteiro antes do autolink (o 1670 do `#medir-tudo` da Revisora). No resto do
  site ela não muda nada, com uma exceção na `ficha`, que dá o mesmo total com um link trocado: o
  "Bloqueio" em vez de uma "Defesa" no mesmo bloco.
- **Então dá para rodar de novo no fim da montagem (`montarAosPoucos`, quando `restam` chega a
  zero), mas não chamando o `autolink()` como está.** A 2ª passada precisa começar com o `used` de
  cada bloco já preenchido pelos links existentes: é o gancho `semear`, 4 linhas no experimento.
  Como e onde fazer isso é decisão do humano (o despacho para aqui).

**Quanto o bestiário perde hoje, por carga.** Dez cargas da página sem `#`, com o autolink do site:
493 (4 vezes), 616, 747, 882 (3 vezes) e 1138 links, contra 1670 com a página inteira. **Ele perde de
32% a 70% dos links** conforme a hora em que o índice chega.

### 1.3 · O custo, medido

`custo109.mjs`: o bestiário com o índice bloqueado e todas as fichas montadas. O cronômetro é o
`performance.now()` em volta da passada, 5 repetições e a mediana, sempre numa página nova:

| passada | links | CPU normal | CPU 4× mais lenta |
|---|---|---|---|
| sobre as 40 primeiras fichas (o que a página tem ao nascer) | 244 | **102 ms** | **463 ms** |
| sobre as 309 fichas (o caso `#medir-tudo`) | 1670 | **708 ms** | **3311 ms** |
| 2ª passada semeada, depois de 40 → 309 (o conserto possível) | 1670 | **691 ms** | **3170 ms** |

- Repetições, CPU normal: 40 fichas 99 a 109 ms; 309 fichas 697 a 712 ms; semeada 678 a 701 ms. CPU
  4×: 436 a 528, 3196 a 3415 e 2986 a 3466 ms.
- **É uma tarefa só, no principal**, sem fatia. A semeada custa quase o mesmo que a passada inteira,
  porque ela percorre o `main` inteiro de novo: semear só evita a duplicata, e não o trabalho. Uma
  passada restrita às fichas que chegaram custaria menos. Não medi, porque isso já é desenho de
  conserto.
- **O instrumento não é o que mediu os 12,7 s** do comentário de `bestiario.astro:530-541`. Esse
  comentário não diz como foi medido, e não achei o script. Usei o puppeteer do repositório com o
  `performance.now` dentro da página. Para comparar: 700 ms é cerca de um quarto dos 2,8 s que o
  comentário dá para a primeira ficha aparecer com a montagem em fatias.

### 1.4 · Que outras páginas montam conteúdo no `main` depois do autolink

**Medido nas 101 páginas:** o texto do `<main>` no instante do 1º link, contra o texto com a página
assentada. Só duas páginas crescem:

| página | texto no 1º link → final | links do site → com a 2ª passada semeada |
|---|---|---|
| `bestiario` | 73.018 → 190.609 caracteres (numa carga; varia) | 493 a 1138 → 1670 |
| `ficha` | 3.785 → 54.612 (**numa carga de 13**) | 8 → 95 nessa carga; 95 nas outras 12 |

- **A ficha também perde, mas raramente.** Na rodada completa, o autolink rodou quando a ficha tinha
  3.785 caracteres e deu 8 links, contra 95. Não se repetiu em 12 cargas depois disso (6 com a CPU
  normal e 5 com a CPU 4× mais lenta, sozinha ou com o bestiário), todas com 95 links e o texto já
  completo no 1º link. **Não investiguei a causa.** O que se sabe é que aconteceu uma vez, no meio de
  uma sequência de 107 páginas no mesmo navegador.
- **Não medido, por depender de sessão:** as páginas que montam conteúdo por script depois de
  buscar dados. Sem login elas mostram o estado vazio, e o texto não cresce. Achei por código (script
  que insere no DOM): `personagem`, `mesas`, `mesa`, `mesa/compendio`, `mesa/criaturas`, `admin`,
  `configuracoes`, `marcadores`, `redefinir-senha`, `regras/[slug]` (este com uma inserção só). As da
  `/mesa` que não estão em `data-refs="off"` pedem o índice. Se o conteúdo delas chega depois dele,
  fica sem link, pela mesma forma do bestiário. Medir isso pede o mock do Supabase ou uma conta.

## 2 · Parte 2 · J12, o que a regra dos dois donos derruba

**As palavras com dois donos**, lidas do `dist/ref-index.json` (entidades com `autolink`, termo ou
apelido normalizado): **exatamente as quatro do despacho**, e nenhuma outra. `esquiva` (Defesa,
Habilidade Esquiva), `bloqueio` (Defesa, Habilidade Bloqueio), `poder` (Centelha, Técnica) e
`integridade` (termo Integridade, Habilidade Integridade, que têm o **mesmo id**, e por isso a
Habilidade nunca recebe link hoje).

**O experimento.** Modo `inj-dono2` contra `inj-base`, nas 101 páginas, com o índice do site
bloqueado, e nada versionado mudou. A regra pula a agulha cuja forma normalizada tem mais de um dono.
**O desfazer é a própria forma do experimento**: ela só existe na página aberta pelo puppeteer. O
`git status` da árvore ficou limpo (só este relato e o progresso).

**O que ela tira: 175 links, e devolve 15 em outras palavras** (6111 → 5951). Li as 175 ocorrências,
uma a uma, com o contexto na posição exata (`../tmp/executora/ctx-dono2.txt`, numeradas), e as 15
devolvidas. O critério é o da Revisora na 108: "errado" é o sentido que o destino do link não cobre,
e "limítrofe" fica fora da soma. Para Esquiva e Bloqueio, o link para a **Defesa** está certo quando
a palavra é o valor de Defesa ("Esquiva = (Destreza + Esquiva)×2...", o primeiro; "cada ataque baixa a
Esquiva e o Bloqueio"; "+3 ao Bloqueio"; "contra área não há Esquiva nem Bloqueio. As duas são
números"). O link para a **Habilidade** está certo quando a palavra é a Habilidade ("Destreza +
Esquiva", as listas de Habilidades, "Kael tem Esquiva 3", a lista de Habilidades de Combate da
ficha). O verbo "se esquiva", o "sem esquiva ativa", as listas de Penalidade ("Ataque, Esquiva,
Bloqueio...") e as listas de Especialidade são limítrofes.

### 2.1 · A tabela

| linha (verbete ← palavra) | links hoje | errados que a regra mata | certos que a regra mata | limítrofes | ficam sem link nenhum |
|---|---|---|---|---|---|
| Centelha ← "poder" | 33 | **25** | **3** | 5 | 33 |
| Técnica ← "poder" | 12 | **11** | **0** | 1 | 12 |
| Defesa ← "esquiva" | 32 | **13** | **8** | 11 | 32 |
| Habilidade Esquiva ← "Esquiva" | 31 | **20** | **6** | 5 | 31 |
| Defesa ← "bloqueio" | 28 | **4** | **21** | 3 | 28 |
| Habilidade Bloqueio ← "Bloqueio" | 21 | **16** | **5** | 0 | 21 |
| Integridade (glossário) ← "Integridade" | 18 | **0** | **18** | 0 | 18 |
| **as quatro palavras** | **175** | **89** | **61** | **25** | **175** |

**1 · Errados que ela mata.** Pela conta da J12, que é só o lado do glossário, **53, e não 54**: 25
de "poder" para a Centelha (a Revisora deu 26: eu li como limítrofe o "O nível mede o poder dela" do
familiar, `regras/antecedentes`, ocorrência 21), 11 para a Técnica, 13 de "esquiva" e 4 de
"bloqueio". **Mas a regra mata também o lado da Habilidade, e lá há mais 36 errados**: 20 "Esquiva"
e 16 "Bloqueio" que vão para a Habilidade quando o texto fala do valor de Defesa. Exemplos: "Defesa
(Esquiva) para acertar", "some ao seu Bloqueio, como a Defesa de uma arma", "+3 ao Bloqueio com
armas de corte", "−2 em Esquiva e em Bloqueio". É a forma da Compostura ao contrário: quando a
Defesa já gastou a vaga no bloco, a 2ª ocorrência cai na Habilidade, seja qual for o sentido. No
exemplo do Kael (`regras/defesas`), as duas estão trocadas: "Kael tem Destreza 4, Esquiva 3" vai
para a Defesa, e "Sua Esquiva é (4+3)×2 + 3 = 17" vai para a Habilidade. **Total: 89 errados.**

**2 · Certos que ela mata junto: 61.**
- **Integridade, 18 de 18.** A definição do verbete é a Habilidade ("Habilidade de firmeza moral"),
  então todo link está certo: as fórmulas da Defesa Mental, as listas de Habilidades da criação, a
  lista de Habilidades Físicas da ficha e do bestiário, o próprio verbete no capítulo de
  Habilidades. Entre eles estão os dois da 108 (bestiário e ficha).
- **Bloqueio, 26** (21 para a Defesa, 5 para a Habilidade): "+3 na Defesa por Bloqueio",
  "Bloqueio = (Destreza + Bloqueio)..." (os dois), "a rota de Bloqueio some", "−1 de Bloqueio",
  "A Habilidade que entra é Esquiva ou Bloqueio".
- **Esquiva, 14** (8 para a Defesa, 6 para a Habilidade): "resistido por Absorção/Esquiva", "só
  Esquiva ou escudo", as fórmulas, "com a habilidade Esquiva", a Esquiva da lista de combate da ficha.
- **Poder, 3**: "poder de semideus preso num objeto", "só cede a quem traz poder efetivamente maior",
  "a não ser que a diferença de poder seja gritante".

**3 · O que sobra depois dela.** **Nenhuma das 175 ocorrências ganha outro link**: a regra apaga os
dois lados, e as quatro palavras não são agulha de mais ninguém. Nas quatro linhas da J12: **33**
(Centelha ← poder), **12** (Técnica ← poder), **32** (Defesa ← esquiva) e **28** (Defesa ←
bloqueio) ocorrências ficam **sem link nenhum**, e mais as 31 + 21 do lado da Habilidade e as 18 da
Integridade.

**E o que ela devolve: 15 links em outras palavras**, na vaga que a palavra de dois donos ocupava no
bloco: 11 "Defesa", 3 "Centelha" e 1 "técnica". 9 certos ("−3 na Defesa", "(Centelha 3)", "Em valores
fixos (como uma Defesa)", "−4 na Defesa Física"), 2 errados ("a defesa diante da corte", em
`regras/habilidades`, e "enxerga a solução técnica", na ficha) e 4 limítrofes ("Centelha = +1 em cada
defesa", "defesa da arma", e duas "Defesa" que são a Social ou a Mental, que o verbete da Defesa não
descreve).

### 2.2 · O veredito por verbete (errados que mata contra certos que mata)

| palavra | errados | certos | veredito |
|---|---|---|---|
| `poder` | 36 | 3 | **entra** |
| `esquiva` | 33 (13 do glossário + 20 da Habilidade) | 14 | **entra**, contando os dois lados; **com a conta só do glossário (13 contra 14), não entra** |
| `bloqueio` | 20 (4 + 16) | **26** | **não entra: mata mais certo do que errado** |
| `integridade` | 0 | **18** | **não entra: mata mais certo do que errado** (e só certo) |

**O veredito da Esquiva depende de como se conta, e isso é do humano.** Se o que a regra mata do
lado da Habilidade conta como errado (ela mata esses links também), a Esquiva entra (33 contra 14). Se
a conta for só a das linhas da J12, ela não entra (13 contra 14). Nos outros três verbetes as duas
contas dão o mesmo veredito.

**O que a medição sugere, sem ser pedido:** em "esquiva" e "bloqueio", o defeito não é a palavra ter
dois donos. É o empate ser decidido pela ordem no índice e pela vaga do bloco, e não pelo sentido: os
dois lados erram, a Defesa 17 vezes e a Habilidade 36. A regra resolve apagando os dois lados, e junto
vão 40 links certos. Nada consertado.

## Arquivos em `../tmp/executora/`

`gerar-inj.mjs`, `autolink-inj.js`, `p109.mjs`, `cmp109.mjs`, `custo109.mjs`, `olhar.mjs`; as
medições `f-real-semear.json`, `f-real-ingenua.json`, `f-inj-base.json`, `f-inj-dono2.json` (101 a
107 páginas), `f-inj-base-ctx.json` e `f-inj-dono2-ctx.json` (as 33 páginas com as quatro palavras, com
o contexto exato; a contagem por página é igual à da rodada completa), `custo-cpu1.json`,
`custo-cpu4.json`, `ctx-dono2.txt` (as 175 ocorrências numeradas, na ordem citada acima).

## QUEBROU

Nada.

## BLOQUEADO

Nada.
