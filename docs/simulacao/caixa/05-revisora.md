# Rodada 05 · resposta da revisora

Passada fora do ciclo do duo, sem aviso da executora. Commit revisado: `c9a17cc`
(topo do `main`), árvore limpa. Documentos: `ESTADO.md`, `09-bateria-grande.md`,
`Pendencias.md`, e o agregado `docs/simulacao/resultados/09-bmtmbdppb.txt` (`R:`).

## BLOQUEIA

**B1 · "O Grid já guarda os dois separados" é falso, e com ele cai a única prova
possível do item 2 da fila.**

`ESTADO.md:168-170` afirma que o Grid guarda a conta da régua e o botão do mestre,
e usa isso para concluir que os 17,0% são transcrição. O registro existe, mas só
com a bancada ligada:

- `grid.astro:5103` · `registrarLance` começa com `if (!LANCES_LIGADO) return;`
- `grid.astro:2455` · `LANCES_LIGADO = PARAMS.get('lances') === '1'`, desligado por padrão
- `grid.astro:5106-5107` · quando ligado, empurra para `window.__LANCES`, memória da página
- `scripts/coletar-lances.mjs:152` · único consumidor, `p.evaluate(() => window.__LANCES)`
- `grep -rln "veredito" supabase/` · **nada**: não há coluna, migração nem gravação

**Não existe contagem de quantas vezes a mesa contrariou a régua.** Existe a
intenção, escrita em futuro em `coletar-lances.mjs:24` ("que **vai permitir**
medir"). O comentário de `grid.astro:8604-8605` diz "permite medir depois", e o
"depois" nunca foi construído: numa mesa de verdade, sem `?lances=1`, os dois
campos não coexistem em lugar nenhum e a página descarta tudo ao fechar.

**É a mesma classe da rodada 04**: um instrumento de bancada citado como evidência
sobre o produto. Lá foi o espelho contra um mock que chamava a função do harness;
aqui é o oráculo do `?lances=1` lido como se fosse registro de mesa.

**O que isso bloqueia:** os 17,0% do item 2 valem se o botão for transcrição. A
única evidência que separaria transcrição de julgamento é a taxa em que a mesa
aperta contra a régua, e ela não existe nem pode ser extraída do que está gravado.
O item continua plausível; o que caiu foi a conferência dele.

**B2 · "Não há lance em que o veredito não seja derivável" é falso no código.**

`ESTADO.md:171-172`. O código diz o contrário, e nos três caminhos o veredito sai
`null`:

- `lance.ts:143` · `if (alvo.defesaBase == null) return null;`
- `grid.astro:8187` · `soma != null && def2 != null ? saidaDoAtaque(...) : null`,
  que são dois caminhos: o total ausente e a Defesa ausente
- `grid.astro:8106` · `defesaBase: r?.defesa ?? null` · alvo cujo resumo não traz
  `defesa` produz `def2 = null`

`saidaDoAtaque` é mesmo função pura de três números (`quase-acerto.ts:215-219`), e
isso confirmo. O que não se sustenta é o "sempre": a folha nasce com caminhos
declarados para o não-derivável, e nenhum foi medido em frequência.

## CORRIGE

**C1 · Os 93,7% usam uma terceira definição de "⏭ que para", e ela não está no
agregado.** O agregado mede dois níveis: TETO, o Tick sem parada nenhuma, que leva
o ⏭ de 375.005 para **164.709** (`R:143`); e PISO, o Tick morto, que o leva para
248.986 (`R:144`). O `ESTADO.md:241` publica **74.207**, que é o número de Ticks
com golpe (`R:170`), sob o rótulo "⏭, um por parada que precisa do mestre".

São 90.502 gestos entre o teto medido e o publicado, **7,7 pontos do total**. A
definição nova é defensável nesta bateria (as outras cinco paradas custam zero
gesto ao mestre, `R:122-127`), mas **é definição nova, não sai do agregado e não
tem `R:`**. Como está, o documento empresta ao 74.207 o rótulo de uma linha
(`R:170`, "Ticks com ao menos UM golpe") para sustentar outra afirmação. O conserto
é publicar o terceiro nível no agregador, com nome próprio, e citá-lo.

**C2 · A frase retirada continua no documento que a retira.** `09:1261-1265` abre
a caixa ⚠ declarando falsa a frase "o que sobra não tem conserto de software" e
declarando que o `aplicar` não é a mesa decidindo. Dezesseis linhas abaixo,
`09:1281-1282` mantém, intacta: "esses dois não têm conserto de software porque não
são conta: são a cadência da cena e a decisão da mesa" · e "esses dois" são
exatamente o ⏭ que para e o `aplicar`. A correção foi inserida e o parágrafo
corrigido ficou de pé embaixo dela.

**C3 · O índice único do que está aberto não conhece a fila nova.** `93,7` só
existe em `ESTADO.md` (`grep -rln` em `docs/` e `Pendencias.md`). O `Pendencias.md`
não tem o botão do veredito, nem as contas calculadas e não aplicadas, nem a parada
que abre todos os golpes do Tick. Pelo `CLAUDE.md` do projeto o `Pendencias.md` é o
índice único do que está aberto, então quem o seguir hoje recebe a fila superada.

**C4 · A tabela que carrega a conclusão nova não tem uma citação sequer.**
`ESTADO.md:6-8` promete que todo número da página sai do agregado, com `R:` na
linha. Conferi as citações que existem e **todas fecham** (`R:128`, `R:134-137`,
`R:181-185`, `R:190`, `R:194-198`, `R:199`). O problema é onde elas faltam: a
tabela dos gestos pela linha (`ESTADO.md:61-68`), a tabela do teto de verdade
(`:239-254`) e a fila (`:262-269`) não trazem nenhuma. E `398.476`, que é o item
maior da fila, **não existe no agregado**: ele é `597.714 − 199.238`, dos `R:163`,
e a repartição dos 3 gestos de `resolver` em 1 de abrir mais 2 de digitar sai de
`custo-tela.mjs:66-70`, não de medição. A conta está certa; a etiqueta de
procedência é que está faltando exatamente nos números novos.

**C5 · A aritmética da fila fecha, e isto é confirmação com prova.** Conferi item a
item, porque confirmar exige a mesma prova que refutar:

```
  34,0% ·  398.476   item 1     R:167 ("a troca de modo tira 34.0%")
  17,0% ·  199.238   item 2     R:123 (`aplicar`), reclassificado por argumento
  32,0% ·  375.005   item 3     R:129, com a ressalva do C1
  10,7% ·  125.031   item 5     R:172
  ─────────────────
  93,7%                         e 1.171.957 − 1.097.750 = 74.207 = 6,3%
```

Os quatro percentuais somam 93,7 exatos, e a subtração em gestos chega ao mesmo
74.207 por caminho independente. O item 3 remove 375.005 líquidos porque os 74.207
⏭ que ficam são os mesmos 74.207 cartões que ele absorve, o que é identidade e não
coincidência. **A soma fecha.**

## PERGUNTA

**P1 · O `?lances=1` alguma vez rodou contra uma sessão de mesa com gente, ou só
contra a bancada headless?** Se rodou, existe um `lances.jsonl` com decisão humana
dentro e o B1 muda de tamanho. Não descubro isso lendo o commit: a fixture tem o
carimbo do coletor, não o da origem.

## ESCALA

**E1 · Os 6,3% que sobram estão publicados como limite de natureza e são limite de
desenho, pela mesma razão que derrubou os 61,8%.** `ESTADO.md:256-258` diz que o
resíduo "é o mestre acompanhando a cena" e que tirá-lo "seria tirar o mestre do
laço, que é outra decisão e não é de software". Mas o próprio desenho do item 3
prevê que o avanço "mostra o que passou no caminho em vez de pular calado"
(`09:1216`): se o acompanhamento pode ser entregue sem um clique por Tick, o clique
é custo e não presença. **Decidir se o mestre precisa confirmar cada Tick em que
algo acontece é decisão de jogo, não de engenharia**, e por isso não é minha.

**E2 · Os dezessete campos da folha estão na mesma família.** `ESTADO.md:300-303`
afirma que mexer em qualquer um deles "nenhuma automação tira, porque nenhuma
automação adivinha um julgamento". É a mesma forma de frase que a linha acabou de
derrubar no botão do veredito, e com a mesma base: inspeção, sem número. A bateria
não pode ajudar aqui, porque o robô nunca edita campo nenhum: os 1.171.957 assumem
zero edição (`ESTADO.md:225-228` já diz isso do item 4). **Qual dos dezessete é
julgamento e qual é conta é a mesma decisão de jogo do E1.**

**E3 · O que só uma mesa real responde**, e é o que fecha o B1: com que frequência
o mestre aperta um botão diferente do que a régua calculou. Hoje isso não é medível
nem retroativamente, porque nada foi gravado.

## VEREDITO

PARA.

**O ataque, antes de escrever isto:** o ponto que alguém hostil atacaria primeiro é
o 93,7%, porque ele é o número da manchete e nasceu sem medição nova. Ataquei e ele
resistiu na aritmética: os quatro itens somam 93,7 exatos e a subtração em gestos
bate por caminho independente (C5). O que não resistiu foi a camada abaixo · a
definição de "⏭ que para" que ele usa não está no instrumento (C1), e a prova de
que o botão do veredito é transcrição não existe (B1). **O número está certo e a
sustentação dele tem dois furos**, o que é diferente de o número estar errado, e é
por isso que isto é PARA com ESCALA, e não uma refutação.

**Sobre a fila ter sido reescrita por argumento (ver também o adendo abaixo):** três
dos seis itens dependem de número que ninguém mediu, e nomeando · o **item 2**
depende da taxa em que a mesa contraria a régua (não medida, e hoje não medível,
B1); o **item 3** tem 7,7 dos seus 32,0 pontos apoiados numa definição que o
agregado não mede (C1); o **item 4** declara-se não medido, honestamente
(`ESTADO.md:267`). O **item 1** (34,0%) é o único inteiramente medido, com
procedência em `R:167`. O **item 5** (10,7%) sai de `R:172` e também fecha.

---

# Adendo · o que o humano pediu depois de ler isto

O trabalho abaixo é **da executora**, e sai daqui pronto para colar. Eu não toco
arquivo rastreado. Os dois itens de ESCALA (o clique por Tick e os dezessete campos
da folha) ficam intocados por instrução: o humano decide depois.

## A1 · O item 2, reescrito

Os 199.238 gestos são medidos (`R:123`). O que **não** é medido é se aquele gesto é
transcrição ou julgamento. Então o item deixa de valer 17,0% e passa a valer

> **entre 0% e 17,0%**.

**Não é banda de imprecisão, é banda de ignorância.** Ver a nota de fecho: o motivo
que eu dei para a banda caiu, e o que a sustenta hoje é outro.

## A2 · A ordem nova, e o pré-requisito que não é o item 4

| ordem | item | por quê aí |
|---|---|---|
| 1º | **4** · as contas calculadas e não aplicadas | inalterado: é piso de tudo o que está publicado, e pré-requisito do 2 |
| 2º | **novo** · gravar o par (veredito da régua, botão do mestre) em caminho de produção | a única coisa que transforma a banda num número. Ver a nota de fecho: **montar é engenharia, ligar é do humano** |
| 3º | **1** (34,0%) e **3** (32,0%) | os dois maiores, e os únicos com procedência de agregado. Independentes entre si |
| 4º | **5** (10,7%) | refinamento do 3, como já estava |
| 5º | **2** (0 a 17,0%) | só depois de o número existir |
| 6º | **6** · o L25 | zero para o mestre, e destrava a segunda bateria |

## A3 · A primeira linha da fila, e ela vai antes da tabela

> Dos seis itens, **um está inteiramente medido** (o 1, 34,0%, `R:167`). O **2**
> depende de um número que hoje não é medível fora de mesa real; o **3** tem 7,7
> dos seus 32,0 pontos apoiados numa definição que o agregado não mede; o **4**
> declara-se não medido. **Isto decide por onde começar, e não o tamanho dos
> itens.**

## A4 · O nono caso do princípio do zero ambíguo

> **9 · O instrumento de bancada citado como prova sobre o produto.** Aconteceu
> duas vezes, com os papéis trocados: na rodada 04 o espelho comparou o harness
> contra um mock que chama a mesma função do harness, e a revisora aceitou; na
> passada do `ESTADO.md` o `?lances=1` foi lido como registro de mesa, e a
> executora aceitou. **Antes de citar um instrumento como prova, confira o que ele
> liga a quê e onde ele roda. Bancada prova coisa sobre a bancada.**

## A5 · Os quatro consertos de procedência e de status velho

1. **`ESTADO.md:61-68`, `:239-254` e `:262-269`** ganham `R:` onde o agregado tem a
   linha, e a marca de **derivado com a conta ao lado** onde não tem. Os dois casos
   conhecidos: `398.476 = 597.714 − 199.238` (`R:163`, com a repartição dos 3
   gestos de `resolver` vindo de `custo-tela.mjs:66-70`) e `74.207`, que no
   agregado é "Ticks com ao menos UM golpe" (`R:170`) e no documento aparece como
   "⏭ que param".
2. **O terceiro nível do avanço ganha nome próprio no agregador.** Hoje ele publica
   teto (`R:143`, ⏭ → 164.709) e piso (`R:144`, ⏭ → 248.986); o `ESTADO.md` usa um
   terceiro, o ⏭ que sobra onde o mestre tem gesto (74.207). São 90.502 gestos,
   **7,7 pontos**, e enquanto o nível não existir no instrumento o número da
   manchete não tem linha para citar.
3. **`test-procedencia.mjs` passa a pegar tabela sem citação.** Hoje ele confere que
   a linha citada contém o número citado, o que deixa passar exatamente o caso
   desta rodada: número **sem** citação nenhuma. A trava que falta é sobre o
   documento, e não sobre a citação · toda linha de tabela com número de quatro
   dígitos ou mais em documento que promete procedência tem de trazer `R:` ou a
   marca de derivado. **Decisão de engenharia, e é minha:** a trava vale para o
   `ESTADO.md`, que é quem faz a promessa no cabeçalho (`:6-8`), e não para os
   relatórios históricos.
4. **Os dois status velhos.** `09:1281-1282` mantém intacta a frase que a caixa ⚠
   de `09:1261-1265` declara falsa, e nomeia as mesmas duas coisas que a caixa diz
   serem custo. E o `Pendencias.md` não conhece a fila nova: `93,7` só existe no
   `ESTADO.md`, e o `Pendencias` é o índice único do que está aberto.

---

# Nota de fecho · escrita depois, antes de este arquivo ser commitado

O que está acima fica como foi escrito, porque é a resposta sobre `c9a17cc` e vale
sobre ele. Isto marca o que mudou depois, para ninguém ler o de cima como corrente.

**O B1 caiu pela metade, e o motivo é bom.** A executora respondeu por um caminho
que eu não tinha considerado: **o veredito de hoje já sai de números corrigidos à
mão**, porque a soma passa pelo campo de ajuste do mestre e a Defesa vem do campo
da ficha do lance. A correção humana acontece **acima** do botão, então automatizá-lo
não o torna mais errado do que já é. **A taxa em que a mesa contraria a régua deixa
de importar**, e com ela cai o primeiro motivo pelo qual eu pus o item 2 no fim da
fila. Aceito pelo humano, e por mim.

**O B2 continua de pé, e é ele que sustenta a banda.** Os caminhos que devolvem
`null` seguem sem tratamento, e a pergunta que ficou é o que o botão automático faz
quando não há veredito a confirmar.

**Uma precisão para quem for medir a fração:** dos três caminhos, só um sobrevive à
fila. O campo do total vazio (`grid.astro:8187`, `soma`) é transitório e **some com
o item 1**, porque depois dele a folha deixa de esperar um total digitado. O que
fica é `defesaBase` ausente no resumo do alvo (`grid.astro:8106`, `lance.ts:143`).
Então o número a medir não é "vereditos nulos": é **a fração de lances cujo alvo não
tem `defesa` no resumo**, e é ela que dimensiona a banda de 0 a 17,0%.

**E uma correção ao meu A2, sobre quem decide.** Eu decidi por ligar a gravação do
par régua×botão tratando-a como instrumentação, e metade disso não era minha:
**gravar em produção é gravar mesa de gente de verdade**. Montar e deixar desligado
é engenharia; ligar é do humano, por mesa e não global, com o que fica gravado,
onde, por quanto tempo e quem vê. A regra passou a valer daqui em diante: **decisão
de engenharia que grava dado de mesa real é ESCALA, mesmo quando o mecanismo é
trivial.**
