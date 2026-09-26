# Rodada 109 · veredito

**Sem arquivo de aviso nesta rodada:** o aviso foi a mensagem do Arquiteto, que nomeia o relato
(`692f6f4`) e o despacho (`0d1ae49`). Pino: `692f6f4`. Passo 0 pelo §0.1: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o `c77d6e4` da 108 estava no main), e depois
`git switch -C revisora 692f6f4`. Toplevel `C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`,
branch `revisora`, árvore limpa antes. Saída temporária toda em `../tmp/revisora/`.

**Veredito geral: PROCEDE, com dois CORRIGE de número.** Não houve conserto para aprovar.

- **As conclusões da Executora se sustentam** por um caminho independente do dela (§1): a J13 é
  real, a 2ª passada ingênua duplica, a semeada não duplica e fecha o bestiário em 1670, e a regra
  dos dois donos entra em `poder`, não entra em `bloqueio` nem em `integridade`.
- **CORRIGE 1, e ele é meu também:** a página `artes` é um redirecionamento para `artes/regras`, e
  todos os medidores desde a 104, o meu e o dela, contam `artes/regras` duas vezes (§2). Os números
  corrigidos estão aqui, prontos.
- **CORRIGE 2:** o veredito da Esquiva **não** depende da conta. O "13 contra 14" do relato compara
  bases diferentes (§4).

## CI (§11)

Workflow `Validar dados e regras`, lido às 21:46 (hora da máquina): `0d1ae49` (despacho, run
`36201565207`) e `692f6f4` (relato, run `36204492504`) estão `completed / success`, e os commits entre
os dois também (`3e8d2db`, `1860d7b`).

## 1 · O caminho independente

A Executora copiou o `autolink()` para um script e o injetou na página. **Eu instrumentei o
próprio `Referencias.astro` e buildei o site**, com o `instrumentar109.mjs`. São quatro trocas, e
cada uma tem de casar exatamente uma vez:

- `?dono2` na URL liga a regra (agulha cuja forma normalizada tem mais de um dono `tipo:id` sai);
- `op.semear` começa o `used` de cada escopo com os `a.ref` que já existem nele;
- `window.__alt` guarda o tempo da passada do site, as fichas e os links naquele instante;
- `window.__autolink` fica exposto para uma 2ª passada.

**O arquivo foi restaurado por `git checkout --` logo depois do build, no mesmo comando.** O
`git status` voltou a mostrar só o meu progresso. Depois, o pino foi buildado de novo, com a prova no
gerado: `dist/ref-index.json` com `dificuldade` = `["Dificuldade","dif"]` e `integridade` =
`["Integridade"]`, e nenhum bundle com `__autolink`.

**Controle do instrumento:** o site instrumentado, sem opção, deu **6111 = 6111 links, zero chave
diferente**, contra a minha medição do pino da 108 (`m-depois2.json`). Isso vale em **todas as
páginas**, inclusive o `bestiario` (aberto com `#`) e a `ficha`. É mais largo que o controle dela,
que tinha 99 páginas, porque aqui a passada é a do próprio site.

**As palavras de dois donos**, lidas do `dist/ref-index.json`: exatamente as quatro do relato
(`esquiva`, `bloqueio`, `poder` e `integridade`, esta com dois donos de mesmo id).

## 2 · CORRIGE 1: a página `artes` é contada duas vezes, desde a 104

`dist/artes/index.html` é um redirecionamento (`<meta http-equiv="refresh"
content="0;url=/centelha-rpg/artes/regras">`), a única página assim no `dist/`. O medidor abre
`artes/`, o navegador segue para `artes/regras`, e os links de `artes/regras` são gravados com o nome
`artes`. **Quem abre `/artes/` lê uma página só.** Achei porque a regra dos dois donos "deixou" 7
links em pé, todos na `artes`: o refresh descarta a `?dono2` da URL.

**Isto derruba números publicados, os meus e os dela.** Os da 108, recontados sem a `artes`:

| linha (108 §6) | total | errados | limítrofes | nível da Arte |
|---|---|---|---|---|
| Ticks ← "Velocidade" | 385 → **381** | 26 → **25** | 3 | · |
| Nível ← "Nível" | 382 → **357** | 125 | · | 227 → **202** |
| Margem ← "Margem" | 82 → **80** | 20 | 0 | · |
| Defesa ← "esquiva" | 32 → **30** | 13 → **12** | 11 → **10** | · |
| Defesa ← "bloqueio" | 28 → **26** | 4 | 3 | · |
| Valor Passivo ← "passiva" | 22 → **20** | 9 | 7 → **5** | · |
| as outras três (poder ×2, manobra) | sem mudança | | | |
| **soma dos errados** | | 241 → **239** | | |

- **O "alvo" da 108: 278 → 259, e 43 → 42 páginas** (19 estavam na `artes`). A Compostura não muda
  (43 em 25).
- **A soma da 108:** 562 → **541** (239 + 259 + 43). Com o nível da Arte, 789 → **743**.

**Os números da 109 que mudam:**

- a regra dos dois donos tira **168, e não 175**, links (os 7 da `artes`, que eram duplicata); ela
  devolve os mesmos 15, e aqui eu bato com ela;
- a 2ª passada ingênua duplica **600 links em 46 páginas** (100 páginas), e não 646 em 47. Tirando os
  45 da `artes` dos 646 dela, sobram 601;
- o controle dela (4346 = 4346 em 99 páginas) continua válido, porque compara o mesmo par.

**Do meu lado, o erro nasceu no medidor da 104**, que andou o `dist/` sem olhar o que a página é, e
atravessou três vereditos. O conserto do instrumento é uma linha: pular página cujo HTML é
`http-equiv="refresh"`.

## 3 · Parte 1 (J13): reproduzida, com duas nuances

**Custo no bestiário**, com o `window.__alt` do site instrumentado, 5 cargas cada:

| | CPU normal | CPU 4× mais lenta |
|---|---|---|
| a 1ª passada do site, carga normal | **262 ms** (255 a 366), com 112 a 160 fichas montadas | **3249 ms**, com as **309** montadas |
| passada cheia (`#medir-tudo`) | **681 ms** (680 a 698), 1670 links | **3317 ms** |
| 2ª passada ingênua, depois da montagem | 670 ms, **23 ou 24 duplicados** | 2887 ms, 26 duplicados |
| 2ª passada semeada | **662 ms**, 1670 links, **0 duplicado** | **2859 ms**, 0 duplicado |

**Bate com os números dela:** passada cheia 708 contra 681, semeada 691 contra 662, CPU 4× 3311
contra 3317, e os 24 duplicados do bestiário. O "102 ms sobre 40 fichas" dela é outro cenário, montado por
ela (a passada sobre as 40 fichas com que a página nasce); o meu é a passada real do site, que pegou
de 112 a 160 fichas. Os dois dão a mesma ordem de grandeza por ficha.

**Nuance 1: a perda depende da máquina, e não só da hora.** Com a CPU normal, a 1ª passada deu 616,
747 e 882 links (**perde de 47% a 63%**, dentro da faixa de 32% a 70% dela). **Com a CPU 4× mais
lenta, a 1ª passada já pegou as 309 fichas** e deu 1670 nas cinco cargas: o `requestIdleCallback` só
dispara depois que a montagem em fatias termina. **Quem perde link é quem tem a máquina rápida.** Na
108 eu escrevi que não reproduzia a variação dela (493 três vezes): agora reproduzo, no dist
instrumentado, com 616, 747 e 882.

**Nuance 2: a lista da 1.4 falta uma página, e a medida dela não pode vê-la.** A `marcadores`, sem
sessão, mostra "Nada marcado ainda. Clique no ☆ ao lado de uma Técnica ou Arte." com 2 links. Numa
carga, a 1ª passada deu **0** links e a 2ª deu 2; noutra, a 1ª já deu 2. A medida da 1.4 é "o texto
do `main` no instante do 1º link": uma página cuja 1ª passada dá zero não tem 1º link, então não
entra na conta, e o "só duas páginas crescem" é um zero ambíguo nesse ponto. O relato cita a
`marcadores` entre as que "dependem de sessão"; o estado vazio dela se mede sem sessão. É pequeno (2
links), e fica no mesmo item J13.

**A razão de rodar uma vez só:** confere. O `start()` (`Referencias.astro:288-292`) chama o
`autolink()` uma vez, e o comentário de `:263-284` fala só de quando baixar o índice. O `used` nasce
vazio (`:54-58`), e o walker só pula texto dentro de `.ref` (`:48`): é por isso que a 2ª passada
ingênua duplica.

## 4 · Parte 2 (J12): a tabela, sem a `artes`, com a minha leitura

**Li as 168 ocorrências.** As 98 do lado do glossário já tinham a minha leitura na 108 (tirei só as
da `artes`). As 70 do lado da Habilidade e da Integridade li agora, com o contexto na posição exata.
Critério da 108:

| linha | links | errados | certos | limítrofes |
|---|---|---|---|---|
| Centelha ← "poder" | 33 | 26 | 3 | 4 |
| Técnica ← "poder" | 12 | 11 | 0 | 1 |
| Defesa ← "esquiva" | 30 | 12 | 8 | 10 |
| Habilidade Esquiva ← "Esquiva" | 28 | 16 | 6 | 6 |
| Defesa ← "bloqueio" | 26 | 4 | 19 | 3 |
| Habilidade Bloqueio ← "Bloqueio" | 21 | 15 | 5 | 1 |
| Integridade ← "Integridade" | 18 | 0 | 18 | 0 |
| **total** | **168** | **84** | **59** | **25** |

**Contra os 89 / 61 / 25 dela em 175:** a diferença é de 5 errados e 2 certos. Não sei dizer
quanto dela vem dos 7 da `artes` e quanto vem de leitura diferente. O `ctx-dono2.txt` dela tem as
175 ocorrências numeradas, mas sem a classificação de cada uma, e o relato só publica os totais.
Uma diferença é conhecida: o "poder" do familiar, que ela declara como limítrofe e eu li como
errado. Nas três linhas onde a `artes` não tem ocorrência, os números batem: Técnica e Integridade
iguais, e na Centelha só o familiar (26 errados contra 25). Nas quatro linhas da Esquiva e do
Bloqueio, a `artes` entra na conta dela e não na minha, e a diferença não se separa sem a lista
dela. **Com qualquer das duas leituras, o veredito de cada
palavra é o mesmo.**

**CORRIGE 2: o veredito da Esquiva não depende da conta.** O relato diz "com a conta só do
glossário (13 contra 14), não entra". Os 13 são os errados só do lado do glossário, e os 14 são os
certos **dos dois lados** (8 + 6). Na mesma base, as duas contas dão o mesmo veredito:

| palavra | dois lados: errados × certos | só o glossário: errados × certos | veredito |
|---|---|---|---|
| `poder` | 37 × 3 | 37 × 3 | **entra** |
| `esquiva` | 28 × 14 | 12 × 8 | **entra, nas duas contas** |
| `bloqueio` | 19 × 24 | 4 × 19 | **não entra** |
| `integridade` | 0 × 18 | 0 × 18 | **não entra** |

Pela tabela dela (com a `artes`), dá 33 × 14 e 13 × 8: o mesmo veredito.

**O resto da Parte 2 confere:**

- nenhuma das ocorrências ganha outro link;
- os 15 devolvidos são 11 "Defesa", 3 "Centelha" e 1 "técnica", iguais aos dela, por chave;
- a observação final dela está certa: o defeito de Esquiva e Bloqueio é o empate decidido pela
  vaga, e não pelo sentido. Os dois lados erram.

## 5 · Travessão, lendo os arquivos

- `109-executora.md` e `progresso-109.md`: **zero**.
- `109-despacho.md` (do Arquiteto): **um**, na linha 85, logo depois de "diga isso explicitamente**" (não copio o caractere aqui,
para este arquivo não carregar um). Não é
  da Executora; é do Arquiteto consertar.

## 6 · O "feche o despacho"

Li como "feche a rodada": o veredito é o fechamento, e o despacho mesmo diz "A Revisora fecha". Não
editei o `109-despacho.md`. A faixa "ESTE DESPACHO ESTÁ ABERTO" continua lá, como continua nos da
107 e da 108. Se o pedido era mexer no arquivo, diga, que eu mexo.

## Limpeza

`Referencias.astro` restaurado no mesmo comando do build, e o pino buildado de novo com a prova no
gerado. Em `../tmp/revisora/` ficam:

- `instrumentar109.mjs`, `medir-rev109.mjs`, `custo109r.mjs`, `dup109r.mjs`, `olhar-marc.mjs`;
- `i-base.json`, `i-dono2.json`, `custo-cpu1.json`, `custo-cpu4.json`, `dup-ingenua.json`;
- os logs de build.

Não mexi em arquivo versionado além dos meus dois da caixa.
