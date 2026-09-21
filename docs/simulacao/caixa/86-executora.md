# Rodada 86 · Executora · as correções da 85, mais o item 9 no `regras.json`

Despacho: `docs/simulacao/caixa/86-despacho.md` (`099d50b`). Veredito que a origina:
`85-revisora.md`. Progresso minuto a minuto em `progresso-86.md`.

**Oito commits meus**, todos empurrados, `origin/main..HEAD` = 0 depois de cada um. Os **seis** que
mudam alguma coisa estão na tabela abaixo; os outros dois são este relatório (`08236a8`) e o
fechamento dele com o progresso (`0cd062d`). *(Dizia "Cinco commits" com seis linhas na tabela;
corrigido na rodada 87, item 8 do despacho, depois de a Revisora enumerar.)*

## ENTROU

| commit | o que muda para quem abre a mesa |
|---|---|
| `16377fa` | o roteador social (`qual-sistema.md` `:73`, `:74`, `:110`) e a nota da página `/mestre` (`mestre.astro:207`) param de ensinar que a jogada única move a régua. Mais `src/data/diagramas.json`, o cache do fluxograma desenhado no build. |
| `fd4497d` | as seis linhas do capítulo social que a revisão apontou: a fila da Sora passa de 7 para 8 intervalos, sai "lábia", sai "furar", a Folha passa a publicar o `+3` dos atos, a frase dos degraus deixa de afirmar o que é falso, e a Defesa Social deixa de dizer que "já carrega" o termo da história. |
| `d56dfa1` | os dois capítulos de Ações param de apontar para o cortejo antigo (o mapeamento Acumulada/Longa, o degrau Estação e a palavra "período"). |
| `6509801` | o `regras.json` ganha o bloco de topo `social`, o `acoes.longevidadeFirula` troca o deslocamento de degrau pelo multiplicador de intervalo, e o `acoes.escalaIntervalo` para de citar o cortejo. Nenhum código lê estas chaves; nada muda na regra, muda onde ela está escrita. |
| `f85b09e` | três pendências novas (`E9`, `E10`, `J9`) e o placar do índice refeito contando as caixas: 244 → 247 itens, 168 → 171 abertos. |
| `34e98a2` | a terceira linha da ESCALA, que eu tinha deixado passar: `:140` mandava comparar o Ataque com "o número passivo da ficha", cinco linhas antes de o capítulo dizer que a mesa soma o termo em cima. Agora as duas dizem a mesma coisa. |

Nenhum deles depende de migração.

**O deploy está no ar, e isto é lido e não suposto:** `gh run list` dá `Deploy site (GitHub Pages)`
**completed success** para `08236a8`, que já contém os grupos A a D; o `34e98a2` foi empurrado
depois deste relatório ser escrito.

**E a frase que eu escrevi sobre o outro workflow estava mal recortada · corrigida na rodada 87,
item 7 do despacho.** O que eu medi foi isto, e só isto: na leitura que fiz por volta das 20:00, o
workflow `Validar dados e regras` aparecia `in_progress` nos quatro disparos mais recentes, e o
último que tinha FECHADO até aquele instante era o do `d56dfa1`, em `success`. Escrever "o último
que fechou fechou em success" fez esse recorte parecer um veredito sobre a faixa, e ele não era:
os quatro que estavam correndo fecharam depois, e **três deles em falha**. Pior, o `fd4497d`, que
já tinha falhado, é ANTERIOR ao commit que eu citei, então a minha frase nem sequer falava do
estado da faixa. O deploy continua conferido; a leitura do CI não sustentava o "verde" que a frase
sugeria, e a causa daquelas falhas é o grupo 1 da rodada 87.

**O grupo A saiu sozinho e primeiro**, como o despacho mandou, e o terceiro arquivo dele não estava
na lista: `src/data/diagramas.json` é o cache dos fluxogramas desenhados no build, com chave de
hash do código mermaid, e `npm run validate` roda `gen-mermaid.mjs --check`. Editar as caixas do
roteador sem redesenhar deixaria o portão vermelho e a página publicando "Diagrama sem desenho
gravado".

**O que eu escrevi além da letra do despacho, e é uma linha:** o fluxograma passou a dizer que
nenhum dos dois caminhos move a régua, e não dizia em lugar nenhum quem move. A linha nova, logo
abaixo do diagrama, nomeia os atos e o cortejo.

## A conferência do item 12, por nome e não por contagem

As quatro chaves de `porFaixa` existem em `racas.json` e são exatamente as quatro que o campo
`longevidade` usa. **Nenhuma raça fica de fora**, e as oito se distribuem assim:

| faixa | multiplicador | povos |
|---|---:|---|
| `curta` | ×0,5 | orc, meio-orc |
| `padrao` | ×1 | humano, meio-elfo |
| `longa` | ×2 | anão, gnomo, halfling |
| `muito-longa` | ×4 | elfo |

Duas coisas que a contagem esconderia e o nome mostra:

- **a conferência é real e não formalidade**, porque `longevidade` é `.optional()` no schema de
  `racas` (`scripts/validate-data.mjs:66`). Nada impede uma raça nova nascer sem o campo, e ela
  cairia fora das quatro faixas sem nenhum portão reclamar. Hoje as oito têm.
- os nomes que eu tinha escrito na proposta da rodada 85 vieram da proposta, não de uma medida.
  Estes vieram do arquivo, lidos agora.

## O item 13, os números do bloco novo contra o capítulo publicado

Cada número do `social` sai de uma linha do capítulo, e nenhum sai da jornada que a rodada 85
deixou de fora:

| chave | valor | onde o capítulo diz |
|---|---:|---|
| `regua.min` / `regua.max` | −6 / 6 | a tabela da régua |
| `regua.passosParaRomperNeutro` | 3 | "do centro até a primeira Simpatia são três passos" |
| `regua.tetoDeVidro` | 2 | "o teto de vidro é ±2" |
| `regua.esfriaPassosPorEstacao` | 1 | "sem contato por uma estação, escorrega um passo" |
| `modoRapido.alcancePorMargem` | 1 | "a cada 6 pontos de folga, um nível acima" |
| `modoDevagar.multDefesa` / `centelhaMult` | 1 / 1 | a Folha: "Defesa parada = Compostura + Sociabilidade + Centelha + termo" |
| `modoDevagar.pisoTempoDoPasso` | 1 | `máx(1, defesa − ataque − gestos)` |
| `modoDevagar.gestosPorIntervalo` | 1 | "a trava é o calendário: um gesto por intervalo" |
| `resistencia.custoBase` / `divisorExcedente` | 1 / 6 | `1 + [máx(0, ataque + gestos − defesa) ÷ 6]` |
| `resistencia.vontadePresa` | `true` | "a Vontade investida em segurar fica presa" |
| `longevidadeFirula.intervaloBaseDias` | 8 | a tabela dos povos, linha `padrao` |

E o `dias` que saiu se reconstrói: 8 × 0,5 / 1 / 2 / 4 dá **4 / 8 / 16 / 32**, que é a coluna
"Intervalo" da tabela do capítulo, célula a célula.

**Nada aqui vem da linha "Neutro → +2 Apreço"**, que é a única que não reconstrói pela fórmula e
que o `E4` guarda: aquela linha é uma jornada medida, e o bloco novo só publica as constantes da
régua e as fórmulas.

**E o sentido contrário, que a tabela acima não mede:** o capítulo publica números que o bloco
novo **não** carrega, e nenhum deles é contradito por ele. São a escala dos gestos (0 / +1 / +2 /
+4 e a Firula Infeliz simétrica), os saltos dos atos (+2 e +3 a favor, −2 a −5 contra), o passo
que o favor cobrado desce, e a mecânica do Combate Social por lance (custo 1 + Margem de Vontade,
Peso de +0 a +3, iniciativa e as três Velocidades). Ausência não é divergência: o que o bloco
promete é a régua e o modo devagar, e o `derivados.defesaSocial` continua sendo o dono da fórmula
com dado. Se você quiser essas quatro famílias no dado também, é item novo e eu meço o custo.

**As duas emendas do despacho estão nos dois lados.** A frase dos degraus entrou na `nota` do
`longevidadeFirula` com a mesma restrição que o capítulo passou a publicar ("os saltos entre os
degraus que caberiam aqui multiplicam de 8 a 24 vezes cada um"), e a palavra "lábia" não está nem
no capítulo nem na `tetoDeVidroNota`.

## PRECISA DE MIM

- **O `regras.json` carrega a mesma cláusula do Antecedente que a rodada 87 vai derrubar no
  capítulo.** O bloco `aparencia`, chave `nota`, diz que a pilha situacional "só move a Régua de
  Relação, teto +6". É a frase do `antecedentes.md:72-74` do veredito, escrita no dado, e a
  varredura da Revisora não a alcançou. Registrada como `E9` e **não** consertada: você tirou o
  `antecedentes.md` desta rodada por ser regra de jogo, e esta é a mesma regra. A decisão do humano
  de 20/09 (`87-despacho.md`) nomeia só o capítulo; se ela for executada assim, o dado fica
  afirmando o modelo velho e vence o capítulo pela regra da casa.
- **O registro da M-09 continua dizendo FEITO sobre o modelo que o `6509801` substituiu**
  (`jogador-novo-decisoes.md`, seção "M-09 · tempo de um passo de Relação por povo"). Documento de
  outra frente, não toquei. Registrado como `E10`.
- **A especificação continua com `Sora (9, 7)`** (`ritmo-da-regua.md`, seção 4). O capítulo está
  certo agora; a fonte do erro não. Quem reconstruir o capítulo pela especificação traz o 7 de
  volta. Não mexi: é documento seu.
- **O `regua.passosParaRomperNeutro: 3` que eu gravei é o valor de hoje, e o `E3` é a decisão de
  trocá-lo** ("banda neutra: 5 ou 3?"). Não é conflito: o dado publica o que vale agora. Digo
  porque, com a régua no JSON, uma decisão do `E3` passa a ter dois lugares para mudar, e não um.
- **O `regras.json` tem 23 travessões (U+2014)**, todos anteriores a mim, conferidos linha a linha.
  Seis deles são células de tabela que contêm só o caractere, e mexer nelas mudaria conteúdo
  publicado (`regras.json`, linhas 248 a 253). O
  portão de travessão cobre só `src/content/**`, por decisão do humano, então ninguém vê estes.
  Não abri pendência: quero sua palavra antes, porque é edição em dado publicado.

## QUEBROU

- **O gerador de diagramas não é determinístico, e medi com controle negativo.** Rodar
  `node scripts/gen-mermaid.mjs` **sem mudar fonte nenhuma** reescreve **6 de 6** entradas do
  `src/data/diagramas.json` com bytes diferentes; o texto dos rótulos fica idêntico nas seis,
  conferido extraindo e comparando um a um. A diferença está nos pontos de controle das curvas do
  contorno das caixas. O `--check` compara só a chave (o hash da fonte), então ele nunca fica
  vermelho por isso. Consequência prática: o `16377fa` carrega cinco redesenhos que ninguém pediu,
  e qualquer commit futuro que toque um diagrama vai carregar os outros cinco. Registrado como
  `J9`. O desenho publicado está certo: isto é ruído de revisão, não defeito de leitura.
- **Uma premissa do veredito estava uma linha fora, e o fato está certo.** A Vontade 8 da Sora está
  em `criacao-de-personagem.md:117` e a `Def. Social 15` dela em `:123`; o veredito cita `:118` e
  `:113`. Confirmei quem é cada bloco pelos cabeçalhos antes de trocar o número, em vez de aceitar
  a citação. A diferença é da worktree congelada da Revisora, e não muda nada do achado.

- **Eu fechei o item 8 pela metade na primeira passada**, e o conserto está no `34e98a2`. A ESCALA
  nomeava três linhas (`:140`, `:145`, `:274`) e eu conferi o meu trabalho procurando a frase
  "já carrega", que só existia em duas delas. A terceira dizia a mesma coisa com outras palavras,
  entre parênteses, e passou. **A conferência por busca de literal só acha o que o literal
  escreve**, e é a forma que o `CATALOGO` chama de portão que casa por texto fixo, aplicada à
  minha própria revisão.

## BLOQUEADO

Nada. Os quinze itens do despacho estão feitos: 1 e 2 no `16377fa`, 3 a 8 no `fd4497d` e no
`34e98a2`, 9 a 11 no `6509801`, 12 e 13 neste relatório, 14 e 15 no `d56dfa1`.

O que não foi tocado de propósito: `antecedentes.md` (regra de jogo, decisão do humano, rodada 87),
os `E4` a `E8`, e a escala de Firula contra o `habilidades.md`.
