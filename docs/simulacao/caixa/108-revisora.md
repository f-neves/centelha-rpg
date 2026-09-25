# Rodada 108 · veredito

Pino: `fd629c7` (aviso), faixa `626cc4e..098360b`. Passo 0 pelo §0.1: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o veredito 107, `ae1c526`, estava no main), depois
`git switch -C revisora fd629c7`. Toplevel `C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`,
branch `revisora`, árvore limpa antes. Saída temporária toda em `../tmp/revisora/`.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA, nenhum CORRIGE.

- **A Compostura volta ao Atributo, e o "alvo" sai**, página por página, medido com medidor meu e
  com o controle negativo feito por mim (§1 a §3). Os números do relato batem um a um.
- **O bestiário MEDE**, com um gesto: abrir a página com um `#` na URL. Com isso ele entra na foto, e
  o conserto não mexeu em nada nele além do esperado (§4).
- **A Parte 2** está no §6: **241 links no sentido errado nas oito linhas**, mais **227** "nível" da
  Arte que o verbete do Nível descreve como Técnica, separados para o humano decidir. Com os 321:
  **562**, ou **789** contando os da Arte.

## CI (§11)

Workflow `Validar dados e regras`, lido às 16:25 (hora da máquina):

| commit | run | resultado |
|---|---|---|
| `a26fda1` (a Compostura) | `36176428665` | `completed / success` |
| `050ba5f` (o "alvo") | `36177243036` | `completed / success` |
| `098360b` (o relato) | `36178210504` | `completed / success` |
| `fd629c7` (o aviso) | `36178343403` | `completed / success` |

Os sete commits do Arquiteto entre a minha âncora e a BASE também estão `success`. O `b7fa5b2`
(seção 7 do `test-portoes.mjs`) eu não ensaiei: não era o centro, e não digo nada sobre ele.

## 1 · O instrumento

`../tmp/revisora/medir-rev108.mjs`, escrito de novo a partir do meu da 104, com as mesmas duas
defesas (só lê depois de o `ref-index.json` chegar E a contagem de `a.ref` ficar parada três
leituras; grava por página se pediu o índice e se estabilizou). Lê todos os `a.ref`. Duas diferenças:

- **o contexto sai da posição EXATA do link** (um `Range` do começo do bloco até o link). O da 104
  usava `indexOf` da palavra e, com a palavra repetida no bloco, mostrava a ocorrência errada. Para a
  leitura da Parte 2 isso importava (§9 do contrato: ler a frase, não a linha);
- **o bestiário é aberto como `bestiario/#medir-tudo`** (§4).

**Build.** Não apaguei `dist/` nem `.astro/` (regra permanente: nada de remoção recursiva de pasta).
O `astro build` esvazia o `dist/` sozinho, e a prova de que cada build estava no estado certo é a
saída dele: li o `dist/ref-index.json` depois de cada um. No pino: `dificuldade` = `["Dificuldade",
"dif"]`, `integridade` = `["Integridade"]`. No controle negativo: `["Dificuldade","dif","alvo"]` e
`["Integridade","compostura"]`.

**Três medições inteiras** (107 páginas cada, 0 erro, as mesmas 6 da `/mesa` sem índice e sem
estabilizar, que são as de `data-refs="off"`): `m-depois.json` e `m-depois2.json` no pino, **iguais
link por link** (0 diferentes em 6111, chave página+ordem+ref+href+palavra), e `m-antes.json` no
controle negativo (6389 links).

## 2 · A Compostura: 43 → 0, e o link VOLTA ao Atributo

**Página por página, a minha tabela é a do relato, as 25 linhas.** Integridade antes 43 em 25
páginas, depois 0. Atributo antes 8 em 7 páginas, depois 46 em 25. **Reencaminhados: 38**, todos
`integridade → compostura`, mesma página e palavra.

**Os 5 que perderam o link, lidos um a um na ordem do documento:** arvore, bestiario, ficha,
aparencia-virtudes-vontade e tecnicas. Nos cinco, antes, a Integridade tinha a 1ª "Compostura" do
escopo e o Atributo a 2ª; depois o Atributo tem a 1ª e a 2ª fica sem link. **É o `used` por escopo
(`Referencias.astro:54-74`), e não outra coisa.** Um detalhe que o relato chama de "bloco" e que
vale nomear: em quatro dos cinco (arvore, bestiario, ficha, tecnicas) o texto está em `DIV`/`SPAN`
fora das tags de bloco, e aí o escopo é o `main` inteiro (`:57`, o `|| scan`). É por isso que "quebra
a compostura dele" (ficha) e "recupera a compostura após um susto" (tecnicas) perderam o link: a
vaga do Atributo já tinha sido gasta noutro ponto da página.

**As 2 entradas novas da Integridade** (ficha, ordem 27; bestiario, ordem 1664) são a palavra
"Integridade" no sentido certo: a vaga do verbete no escopo deixou de ser gasta pela "Compostura".

## 3 · O "alvo": 278 → 0, e os três links novos

278 em 43 páginas antes, 0 depois, nenhum reencaminhado. **Os 3 novos da Dificuldade, lidos no
bloco inteiro:**

- `mestre`: "roteie pela Régua de Relação / Combate Social: a Dif vira a Defesa Social do alvo".
  Antes, o "alvo" (4 letras) vem antes do "dif" (3) na ordem por comprimento e gastava a vaga;
- `regras/acoes-e-sistema`: "A cada 6 pontos acima do alvo, uma Margem. Ela não escolhe a
  Dificuldade";
- `regras/coracao-do-sistema`: "o total supera o alvo: a Defesa de um inimigo ou a Dificuldade de uma
  tarefa".

Os três estão no sentido certo. **Nenhum outro verbete ganhou ou perdeu link, em página nenhuma, e
agora com o bestiário dentro da conta**: a foto dá 38 reencaminhados, 283 saídas sem par (278 "alvo"
e as 5 do §2) e 5 entradas sem par (as 3 daqui e as 2 do §2). Nada mais.

## 4 · O bestiário: o ruído é real, e tem saída

**A causa que ela deu está certa, e está no código.** A página nasce com as primeiras fichas
(`ABERTAS`, `bestiario.astro:142`) e o resto vem em `<template>`, montado em fatias de 24 por quadro
(`:557-563`); ao fim são 309 fichas, contadas pelo medidor. O autolink roda
uma vez, no `requestIdleCallback` (`Referencias.astro:292`), e só linka as fichas que já existirem.

**O que eu medi no mesmo `dist/` do pino, três vezes cada:**

| como abre | links no bestiário | fichas ao fim |
|---|---|---|
| `bestiario/` | 493, 493, 493 | 309 |
| `bestiario/#medir-tudo` | 1670, 1670, 1670 | 309 |

**Não reproduzi a variação dela** (493, 882, 747, 493): na minha máquina deu 493 as três vezes. Não
sei dizer por que variou na dela, e não ofereço causa.

**A saída é o `#`.** Com hash na URL, o `bestiario.astro:568-569` monta de uma vez todas as fichas
adiadas (`montarTodas`), no corpo do script, antes do `requestIdleCallback`, e o autolink vê a página
inteira. Não depende de espera, e deu o mesmo número nas três vezes e nas três medições inteiras.

**Então dá para responder o que ela não pôde:** com o bestiário inteiro nas duas pontas, o conserto
mudou nele **exatamente duas coisas**: a "Compostura" que ia para a Integridade vai para o Atributo, e
a palavra "Integridade" ganhou o link. Nenhum outro verbete mudou no bestiário.

**O que isso diz sobre o site, e não sobre o medidor:** quem abre o bestiário sem `#` recebe
autolink só nas fichas que existiam quando o índice chegou (493 links, contra 1670 com a página
inteira). Já existia antes desta rodada, e ela não toca nisso. Registro, sem classificar como achado
da rodada: a pergunta de se isso é defeito é do humano.

## 5 · O controle negativo, por outro caminho

Num comando só: o `glossario.json` de `626cc4e` posto de volta (md5 `86b0ea5b...`), `npm run build`
verde, `git checkout -- src/data/glossario.json` (md5 `68e0631e...`, igual ao `git show 050ba5f`), e
`git status` só com o meu progresso. **Reproduziu 43 "Compostura" para `integridade` em 25 páginas e
278 "alvo" para `dificuldade` em 43.** O caminho é outro do dela em três pontos: medidor meu, build sem
apagar pasta (conferido pelo `ref-index.json`), e bestiário inteiro. Depois, build final do pino, e o
`ref-index.json` conferido de novo.

## 6 · Parte 2: os outros apelidos, medidos, SEM conserto

**A conta dos "sete".** A tabela do meu `104-revisora.md` §5 tem dez linhas; tirando o "alvo" e a
"Compostura" sobram **oito**. O "sete" do texto está errado. Nenhum artefato da 104 dá sete: o
`al104-amb.json` tem 11 chaves (as 10 linhas, com a Defesa em duas palavras), as palavras distintas
das oito linhas são 8 e os verbetes também são 8. Não sei como cheguei ao sete, e não vou chutar uma
causa (a da Margem pode ser, e não tenho como testar).

**Método.** A medição é a `m-depois2.json` do pino. **Li todas as ocorrências de todas as linhas**,
com uma exceção declarada: as 309 "Velocidade" do bestiário, conferidas por padrão (todas casam
`Dano ... · Velocidade N`, a linha de ataque da ficha, onde a palavra é o custo em Ticks) e não uma a
uma. "Errado" é o sentido que a definição do verbete não cobre. "Limítrofe" é o que a definição
cobre em parte, e fica fora da soma, com o motivo ao lado.

| verbete ← palavra | total | bestiário | fora: páginas | errados | limítrofes | lidos |
|---|---|---|---|---|---|---|
| Ticks ← "Velocidade" | 385 | 309, todos certos | 23 | **26** | 3 | 76 + 309 por padrão |
| Nível ← "Nível" | 382 | 0 | 26 | **125** (+ 227 da Arte, à parte) | · | 382 |
| Margem ← "Margem" | 82 | 1, errado | 23 | **20** (1 no bestiário) | 0 | 82 |
| Centelha ← "poder" | 33 | 0 | 15 | **26** | 4 | 33 |
| Defesa ← "esquiva" | 32 | 1, certo | 14 | **13** | 11 | 32 |
| Defesa ← "bloqueio" | 28 | 0 | 16 | **4** | 3 | 28 |
| Valor Passivo ← "passiva" | 22 | 0 | 11 | **9** | 7 | 22 |
| Técnica ← "poder" | 12 | 0 | 8 | **11** | 1 | 12 |
| Firula ← "manobra" | 7 | 0 | 7 | **7** | 0 | 7 |
| **as oito linhas** (a da Defesa aparece em duas, "esquiva" e "bloqueio") | **983** | | | **241** (240 fora do bestiário) | **29** | **674 + 309** |

**Soma dos errados das oito linhas: 241. Com os 321 da Compostura e do "alvo": 562.** Se o humano
contar como errado o "nível" da Arte (abaixo), **789**.

**O que está dentro de cada número:**

- **Velocidade (26).** Velocidade física ou comum: "choque, velocidade e faísca", "anda na metade
  da velocidade", "a velocidade do braço satura", "o Raciocínio é a velocidade dele", a tabela de
  carga, o "× deslocamento" da Centelha, a "velocidade de Corrida por Tick" e o salto correndo.
  Limítrofes: os três "quem está coberto perde um pouco de velocidade" dos Efeitos, que não dizem se
  é Tick ou passo.
- **Nível (125 + 227).** O verbete diz "faixa de poder de uma **Técnica**, 1 a 6, o nível N exige
  Centelha ≥ N". **Certos: 30** (as Proezas até o nível N, a Técnica de nível 3, o filtro das
  Técnicas). **Errados: 125**, nível de Habilidade, de Atributo, de Especialidade, de Antecedente (32
  só nessa página), da relação social (22), da Firula, da Virtude, de Recursos, a própria Centelha
  ("o nível de poder pessoal", "O nível 2 (Desperto)"), a penalidade de ferimento, e o "Nível" da
  Resistência à Perfuração (em blocos onde o verbete da Perfuração já tinha gastado a vaga, o
  "Nível" cai no da Técnica). **À parte: 227** "nível da Arte", quase todos em `artes/efeitos` (166),
  `artes`, `artes/regras` e a criação de personagem. O verbete fala de Técnica e de portão de
  Centelha, e a Arte não tem esse portão (`artes`: "basta Centelha > 0 ... a profundidade você compra"),
  então pelo texto de hoje estão errados. Mas é o caso "misto" da 104, e quem decide se o verbete
  deve cobrir a Arte é o humano.
- **Margem (20).** 15 são a **Margem de Quase-Acerto** (`regras/quase-acerto`, `mesa/referencia`,
  `armas-e-armaduras`), outra grandeza: "Margem de QA = Bônus QA da arma + Bônus QA da armadura".
  3 são "a margem que você tem depois de cair" (`vida-ferimentos-cura`), 1 é "uma margem de azar"
  e 1 é "vive à margem dos povos" (bestiário). Esta linha é a do termo do próprio verbete, e não
  apelido.
- **Centelha ← "poder" (26).** Poder social, político e comum: "o jogo do poder", "Posição é poder
  de direito", "o poder bruto do corpo" (Força), "instrumento de poder", e **o verbo**: "antes de você
  poder agir de novo" (`combate`). Certos: 3 ("poder de semideus preso num objeto", "só cede a quem
  traz poder efetivamente maior", "a diferença de poder seja gritante"). Limítrofes: o "poder
  emprestado" do patrono (2), a escala de ameaça "Poder de escala regional", e "os pools de poder".
- **Esquiva (13) e Bloqueio (4).** **São a forma da Compostura.** Esquiva e Bloqueio também são
  Habilidades, com agulha do mesmo comprimento, e o glossário ganha o empate; a Habilidade só recebe
  o link quando a Defesa já gastou a vaga no escopo (31 e 21 links hoje). Os errados são a
  Habilidade: "rolam Destreza + Esquiva", "Principais Habilidades: ... Bloqueio", as listas da
  criação, "Kael tem Destreza 4, Esquiva 3", o verbete da própria Habilidade no capítulo de
  Habilidades, e os nomes de Técnica "Esquiva Profética" e "Esquiva de Vento". Limítrofes: o verbo
  "se esquiva" (6), "praticamente sem esquiva ativa" (4), as listas de Especialidade (1 em cada
  linha) e, no Bloqueio, a Penalidade de armadura "Ataque, Esquiva, Bloqueio" (2).
- **Valor Passivo ← "passiva" (9).** O tipo de Técnica ou de Efeito sempre ligado ("Reserva I:
  passiva", seis vezes; "Passiva 0 · Sempre ligada"; "o tipo (passiva, ativa, reflexiva)") e a
  "Cobertura passiva" do escudo. Certos: 6 (o modo Passiva, "notar sem procurar", Disfarçar-se,
  Contrabandear, Etiqueta, "Def Passiva (×2)"). Limítrofes: "a Defesa passiva do alvo" (6, a Defesa
  tem verbete próprio) e o "Modo · Passiva. Não se rola nada" do Resistir.
- **Técnica ← "poder" (11).** "poder" tem DOIS donos, e a Centelha vem antes no índice; a Técnica
  só pega a palavra quando a Centelha já gastou a vaga. Dos 12, o único que é Técnica, e em parte, é
  "gaste o restante em poder: as Técnicas que a Centelha destrava e ... os níveis de Arte".
- **Firula ← "manobra" (7).** Nenhum é Firula: "uma manobra marcial", a Técnica "Ler a Manobra"
  (2), "qual manobra social ele tentará" (2), "É a manobra para dois momentos" (o Fôlego) e "a manobra
  que faz uma decisão passar" (Política).

**Onde os números mudaram desde a 104:** o total de links de cada linha é o mesmo da 104 (385,
382, 82, 33, 32, 28, 22, 12, 7), mas a Velocidade tem 309 no bestiário inteiro, e na 104 eu não
separei o bestiário.

**Nada consertado.** Os três achados de forma que valem para a decisão do humano: palavra com dois
donos no glossário ("poder"), apelido que empata com o nome de outra entidade (Esquiva e Bloqueio,
como a Compostura), e verbete cuja palavra é também o nome de outra grandeza (a Margem de QA, o
nível da Arte).

## 7 · Travessão, lendo os arquivos

- **Linhas acrescentadas** ao `glossario.json` na faixa: zero.
- `108-executora.md`, `progresso-108.md` e `108-aviso.md`: **zero** no arquivo inteiro.
- `glossario.json`: 3 no arquivo, os mesmos da 104, anteriores à rodada.
- **Controle positivo:** o mesmo varredor acusa o travessão de `combate.md`.

## Limpeza

O controle negativo foi desfeito no mesmo comando, e o `dist/` refeito no pino. Em
`../tmp/revisora/`: `medir-rev108.mjs`, `foto-rev108.mjs`, `m-antes.json`, `m-depois.json`,
`m-depois2.json`, `b-sem1..3.json`, `b-hash1..3.json`, os `p2-*.txt` e os logs de build. Não mexi
em arquivo versionado além dos meus dois da caixa.
