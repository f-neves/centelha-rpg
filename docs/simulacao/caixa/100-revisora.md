# Rodada 100 · veredito

Pino: `b4c48eb` (aviso), faixa `2ac8866..a4a9724`. Ficaram fora o `8e90c9a` (o meu veredito da 99),
o `17158df`, o merge `7103814` e os commits do Mapa. Passo 0 conferido: toplevel é a worktree da
Revisora, HEAD `b4c48eb2d192`, e a worktree estava limpa antes de reancorar. Revisei o `a4a9724`,
como a nota de estado pede. **Nada em `src/` nem em `scripts/` muda entre `2ac8866` e `b4c48eb`**
(`git diff --stat` vazio nas duas pastas), então a minha árvore roda o mesmo código que a Executora
testou em `6ee7f79`.

**Veredito geral: PROCEDE, com um CORRIGE e uma PERGUNTA.** Nenhum BLOQUEIA.

- **A causa se sustenta:** refiz o controle positivo com uma sonda minha, e as duas sementes caem com
  as duas assinaturas.
- **O CORRIGE:** a geometria que o relato e o L104 escrevem ("cada aboleth cobre a peça pequena
  seguinte") está errada para quatro das nove peças (§1). A cadeia causal não depende dela.
- **A PERGUNTA:** a peça coberta é alcançável pela tela, mas por um caminho que pula o L68 e o
  movimento do Simultâneo (§3).

## CI (§11)

Workflow `Validar dados e regras`, lido pelo run inteiro:

- **`a4a9724` (o trabalho):** run `35953956956`, **`completed / success`**, 19 de 19 jobs verdes.
- **`b4c48eb` (o aviso):** run `35954867930`, **ainda `in_progress`** às 01:20 (hora da máquina). O
  commit só toca documento.
- Os runs de `2ac8866`, `8e90c9a` e `7103814`, dentro do intervalo, estão todos `success`.

## 1 · O controle positivo prova a causa: sim, e a peça na vez está mesmo coberta

**A sonda é minha, e não a da Executora.** Gerei uma cópia do `scripts/test-grid.mjs` no scratchpad
(`mk-sonda.py`, que produz `sonda-rev.mjs`). As diferenças:

- imports por caminho absoluto;
- `&semente=` na URL da cena;
- só a cena de 30;
- uma leitura antes do `if (!q.naVez)`: para cada peça `.vez`, largura, se o retângulo está dentro
  do palco, e o `elementFromPoint` dos mesmos nove pontos do `pegaEm`.

Nenhum clique a mais, e nada escrito no repositório.

**Semente 1369:** caiu com `0 peça(s) na vez pegáveis, 1 na vez no palco, 2 no tabuleiro inteiro, 21
pegáveis de 10 no palco`, escolhida "Criatura 17". É a assinatura do run `35911397511`. As duas
peças na vez:

- **Criatura 13:** 29 px, retângulo dentro do palco, e os **nove** pontos caem na **Criatura 26**;
- **Criatura 22:** 29 px, dentro do palco, e os nove pontos caem na **Criatura 9**.

**Semente 767:** caiu com `0 ... pegáveis, 2 na vez no palco, 3 no tabuleiro inteiro, 21 pegáveis de 10
no palco`, escolhida "Criatura 17". É a assinatura do run `35914287185`. As três peças na vez:

- a Criatura 13, coberta pela Criatura 26;
- a Criatura 22, coberta pela Criatura 9;
- a Criatura 25, coberta pela Criatura 12.

**Nenhuma está fora do palco por outro motivo.** As três estão com o retângulo inteiro dentro do
palco. "1 na vez no palco" sai do `noPalco`, que exige 10 px de margem, e isso não é o mesmo que
estar fora.

**O CORRIGE: quem cobre não é "a aboleth anterior".** Rodei a mesma sonda na semente 1369 lendo as
30 peças, e não só as da vez. As nove sem ponto livre são as mesmas que a Executora lista (C7, C10,
C13, C16, C19, C22, C25, C28 e H4). As larguras são três: 12 peças de 29 px (os quatro heróis e as
oito aasimar), 9 de 57 px (as águias) e 9 de 115 px (as aboleths). Quem cobre cada uma:

| coberta | quem cobre | o que é |
|---|---|---|
| C7 | C20 | águia (57 px) |
| C10 | C23 | águia |
| C13 | C26 | águia |
| H4 | C17 | águia |
| C16 | C30 em 7 pontos, H3 em 2 | aboleth |
| C19 | C6 | aboleth |
| C22 | C9 | aboleth |
| C25 | C12 | aboleth |
| C28 | C15 | aboleth |

**Quatro das nove estão debaixo de uma águia gigante, e nenhuma das cobertas por aboleth está
debaixo da peça de índice anterior.** A cobertura vem da fileira vizinha (col = (i×3) % 40, então a
fileira seguinte desloca uma coluna), e não da peça do lado.

O relato (`100-executora.md`, §3, "cada uma cobre a peça pequena seguinte") e a linha nova do L104
("A cena de 30 põe cada aboleth (115 px) por cima da peça pequena seguinte") afirmam uma geometria
que a sonda dela não mediu: ela listou as cobertas, e não quem as cobre. O aviso repete a frase.

**A causa não muda**, porque depende de QUEM é coberto (todas as aasimar), e não de quem cobre. O
que muda é o conserto: quem for mexer na bancada para descobrir as pequenas tem de afastar também as
águias, e não só as aboleths.

**CORRIGE:** a linha do L104 passa a dizer "cobertas por uma águia (57 px) ou uma aboleth (115 px) da
fileira vizinha", com a lista. É o arquivo que o próximo lê.

**E um detalhe que a tabela mostra:** a Criatura 17, que o desempate escolhe, é a águia que cobre o
Herói 4. Não pesa em nada. É o `pegaveis[0]`, a primeira pegável do palco na ordem do DOM, como o
relato diz.

## 2 · A conta de 2%: confere

- **As bônus**, no `monsters.json`: `mon-aasimar` "1d6 + 6", `mon-aguia-gigante` "1d6 + 5",
  `mon-aboleth` "1d6 + 7". O `iniDeMonstro` (`mesa-bestiario.ts:54-59`) soma o número do fim.
- **Os heróis rolam d6 puro:** `rolarIniciativaPC` soma `attrs.raciocinio` e `skills.prontidao`
  (`mesa-ficha.ts:144`), e a `FICHA_PC` da bancada (`mesa-mock.mjs:305-315`) não tem nenhum dos dois.
- **A composição:** `MONS[i % 3]` (`mesa-mock.mjs:287, 350`), com os heróis em `i < 4`. Na cena de
  30 isso dá 8 aasimar (i = 6 a 27), 9 águias e 9 aboleths.

**A condição:** o máximo só cai em peças cobertas se for 12 de uma aasimar (6 + 6). A aboleth vai de 8
a 13, e com 5 ou 6 ela empata ou passa, e é pegável. A águia chega no máximo a 11, e o herói a 6.
Então: nenhuma das 9 aboleths tira 5 ou 6, e alguma das 8 aasimar tira 6.

(2/3)^9 × (1 − (5/6)^8) = 0,0260 × 0,767 ≈ **2,0%**. A conta está certa, e o relato a apresenta
como modelo, e não como medida.

## 3 · "Não é o Grid": PERGUNTA, com o tamanho

**Li no código, e não exercitei:** a peça coberta tem um segundo caminho. A lista lateral (`.gr-ficha`,
`grid.astro:6786-6791`) traz também as peças já postas (classe `posto`), e o arrasto começa de
qualquer uma (`grid.astro:6899-6906`).

**Mas esse caminho é o de "entrar em cena".** No soltar (`grid.astro:6989-7031`), o `deOnde === 'lista'`
pula as duas perguntas que a peça do mapa faz:

- a do L68 (fora da vez);
- a do Simultâneo ("como você vai até lá", o `moverSimultaneo`).

Ele vai direto ao `porNoMapa`, que teleporta. **Então, no Simultâneo, uma peça na vez que está
inteira debaixo de outra não tem o gesto normal de mover:** pelo mapa o ponteiro não a alcança, e
pela lista ela anda sem o custo de movimento que a regra cobra.

**O tamanho:** acontece quando uma peça maior invade a casa vizinha por cima de uma menor. Na bancada
são 9 de 30 peças, com as grandes a uma coluna das pequenas. Na mesa de verdade depende do porte e de
quem fica ao lado de quem. Não medi com que frequência isso ocorre.

**Não testei no navegador:** que o arrasto pela lista de uma peça já posta de fato move sem perguntar
é leitura do código, e não observação. A decisão do que fazer é sua.

## 4 · Os dois achados de passagem: um já foi mandado corrigir e não virou item, o outro não é nada ainda

**"Tick 0" em `grid.astro:5466`** (o texto do `uiConfirmar`, que o mestre lê), mais o comentário em
`:5487` e o de `test-grid.mjs:538`.

- **É conhecido desde o diagnóstico:** `00-diagnostico.md:354`, `01-diagnostico-carga.md:424` (item
  13, "a frase da caixa mente") e `02-projeto-harness.md:1544`. O último manda "Corrija a frase
  junto", e ninguém corrigiu.
- **Não há item em `docs/pendencias/` nem no `Pendencias.md`:** o Grep por "4751", "caixa de
  iniciativa" e "entra no Tick 0" só acha os documentos de diagnóstico.
- **Precisa de item.** É o mesmo defeito que o C-22 consertou no livro, agora na tela.

**"No máximo 60 KB de HTML por movimento (foram 67,1 KB)"**, uma vez em 40 voltas locais.

- **Não há item:** o Grep por "KB de HTML" só acha a asserção (`test-grid.mjs:1286`) e o relato.
- **No CI, zero nos 60 runs que li na 98:** as três falhas do `test-grid` foram todas `FALHOU (1)` e
  todas `[aquece]`.
- **Uma ocorrência local, numa sonda que roda só a cena de 30 em laço, não é item de conserto.** No
  máximo uma linha ANOTADO com o número e a volta, para o dia em que aparecer no CI. Decide você.

## 5 · O rótulo "21 pegáveis de 10 no palco": o denominador está errado nas três linhas

O `pegaveis` do `pontos()` (`test-grid.mjs:128`) é filtrado de `[...noPalco, ...resto]`, então conta
as **30** peças. O `noPalco` conta só as que estão dentro do palco com margem. As três linhas põem o
primeiro sobre o segundo:

- `:1174`: "(${pt.pegaveis} de ${pt.noPalco} peças pegáveis)";
- `:1187`: "${q.pegaveis} de ${q.noPalco} peças no palco pegáveis";
- `:1205`: "${q.pegaveis} pegáveis de ${q.noPalco} no palco".

O relato cita `:1174` e `:1187`, e a terceira é a própria mensagem do L104. **Confirmado.**

## 6 · O resto

- **As três hipóteses do humano:** cada uma tem evidência a favor e contra, e o teste que a
  derruba. A de tempo foi derrubada por uma espera de 3 s, e não refiz. A de estado de outro bloco
  foi derrubada por rodar só a cena de 30. A minha sonda faz o mesmo e reproduz, o que é uma
  segunda confirmação.
- **A coleta do CI** (67 com a linha do mover, 3 falhas, escolhida sempre uma aboleth nos verdes):
  não refiz. As três falhas batem com a minha lista da 98.
- **Travessão, lendo os arquivos:** zero nas linhas acrescentadas do relato, do progresso, do tema L
  e do aviso. Controle positivo: `leitura-de-novato-decisoes.md:209`, que é antiga e tem travessão.

## Limpeza

A sonda e os logs ficaram no scratchpad (`mk-sonda.py`, `sonda-rev.mjs`, `sonda-1369.log`,
`sonda-767.log`, `sonda-todas.log`, `todas.json`). Os `sonda-s*.log` que estavam lá são da
Executora, e não mexi neles. Não mexi em arquivo versionado. `git status --short` ao fechar: só os
meus dois arquivos da caixa.
