# Rodada 122 · veredito · os achados de duas leituras (três blocos)

**Aviso:** mensagem do Arquiteto. Despacho `docs/simulacao/caixa/achados-duas-leituras-despacho.md`
(decisões do autor no topo e Adendo 1). Relato `achados-duas-leituras-relato.md`. Commits:
- `bd26f1b0` (Bloco 1);
- `ac3b197e` (Bloco 2);
- `711b7b82` (Bloco 3).

Pino `711b7b82`, o último dos três. Passo 0 pelo §0.1: `merge-base --is-ancestor HEAD origin/main` passou
(o veredito 121, `5bfd3c2c`, está no `main`). Depois, `switch -C revisora 711b7b82`. Toplevel da Revisora,
branch `revisora`, árvore limpa. Julguei o diff de `bd26f1b0~1` a `711b7b82`.

**Veredito geral: PROCEDE com três CORRIGE pequenos, todos de texto.** Ficam também duas PERGUNTAS ao
autor (as duas leituras que o Arquiteto pediu para julgar, mais uma que achei) e duas CLAREZA. Nenhum
BLOQUEIA.

## CI (§11)

Workflow `Validar dados e regras`, os três `completed / success` na primeira tentativa:
- `bd26f1b0`: `37083199172`;
- `ac3b197e`: `37084319434`;
- `711b7b82`: `37085390862`.

**Nenhum dos três toca código nem dados:** `git show --stat` dos três em `src/lib`, `src/data`, `scripts`,
`src/pages` e `src/components` sai vazio. Os commits mexem só em capítulos, `docs/pendencias/`,
`Pendencias.md` e no relato.

## 1 · Cada item contra a decisão do autor

| item | onde | diz a decisão, sem regra a mais? |
|---|---|---|
| 1 · Proeza (opção B) | `criacao:35`, `:58` | **Sim.** "custa no total o preço do nível N (5 + 5 × nível) [...] subir [...] paga só a diferença: do nível 2 (15) para o 3 (20), 5", mais a frase do porquê ("compra muitas Técnicas, e não sobe uma trilha só"). O Efeito ficou igual. `regras.json:639` e `calc.ts:370` já diziam isso. **Nenhum total de ficha muda:** o commit não toca código, e nenhum número das tabelas de exemplo mudou. |
| 2 · Centelha inicial | `criacao:23`, `:33`, `:64`, `:128`; `centelha.md:84` | **Sim.** "0 numa campanha mortal; de 1 a 3 numa heroica", e o Mestre escolhe pela campanha. Veil (4) ficou como "campanha heroica que o Mestre abre acima" da faixa, sem mudar número. Ver a CLAREZA 2. |
| 3 · Virtude sem Centelha | `aparencia:85` | **Sim.** "nem inteira, nem pelo 2 × mín". `centelha.md` não cita mais "Bravura" em parte nenhuma (procurei o capítulo inteiro). A D12 registra a decisão. |
| 4 · Provocação do orc | `racas.md:169` | **Sim.** "Força de Vontade do orc × 2 + 2 × mín(Centelha, Integridade) dele, como na Defesa Mental". Não há essa conta em `racas.json` nem em `src/lib` (procurei "provoca"). |
| 5 · Critério da D12 | `D-proezas-tecnicas.md:76-78` | **Sim**, verbatim, igual ao `centelha.md:44`. |
| 17 · D15 | `D-proezas-tecnicas.md:98-101`, `Pendencias.md` | **Sim.** [ADIADO], o Mestre faz à mão, `centelhaSoAtributo` sem chamador. O `Pendencias.md` foi regerado e conta 15 na D. |
| 6 · Rola-se ao declarar | `combate.md:86-89`, `:104-108`, `:342`, `:385` | **Sim**, menos o qualificador de classe e a Recarga: ver CORRIGE A e B. |
| 7 · Pressão | `combate.md:408` | **Sim.** "O golpe não desconta a si mesmo: o primeiro ataque recebido bate na Defesa cheia, e o segundo já pega −2". **O código não foi tocado** (o `ac3b197e` só tem `combate.md` e o relato). As linhas que o relato cita do Grid e do `motor.mjs` não refiz: ver "Não conferido". |
| 10 · Margem na Acumulada | `acoes-e-sistema:79`; `acoes-corpo:33`; `acoes-sentidos:77` | **Sim** nas três linhas, mas sobrou uma ficha: CORRIGE C. |
| 11 · Perde o que passou da faixa | `acoes-e-sistema:86-88`; `acoes-corpo:35` | **Sim.** "errou por 8, perde 2", e remete ao Quase-Acerto. Ver a CLAREZA 1. |
| 12 · Excedente de cada jogada | `acoes-e-sistema:170` | **Sim.** 12 e 10 contra 7 dão 5 + 3 = 8, e conferi a conta. |
| 13 · Cura encurta 10% | `vida:90` | **Sim.** 5 dias × 0,7 = 3,5, e conferi a conta. "Os 50% exigem Cura 5" continua coerente. |
| 15 · Seguir alguém | `custo-servicos:67`, `:107-108`; `acoes-sentidos:52` | **Sim** na letra, mas a frase nova encosta nos 70% da Acumulada: PERGUNTA 2. |
| 16 · Suspeita contra o Passivo inteiro | `acoes-sentidos:50`, `:63` | **Sim.** O exemplo do autor está com os números dele: Passivo 10, Dificuldade 7, jogada 8, avança 1, fica 2 abaixo, "abaixo por menos de 6". |

## 2 · Os CORRIGE

### A · "Rola-se ao declarar, para arma Leve, Média e de Distância"

- **Onde:** `combate.md:106`.
- **O que está escrito:** "**Rola-se ao declarar**, para arma Leve, Média e de Distância: o acerto e o dano
  valem no Tick da declaração [...]".
- **Por que é CORRIGE:** a decisão do autor (item 6) é geral: no Normal, o golpe "resolve na declaração".
  Listar três classes deixa as outras quatro da tabela de Preparo (`:76-84`) sem regra escrita: Haste,
  Pesada, Arremesso e Arte. E o leitor pode entender que nelas não se rola ao declarar, o que é regra a mais.
  O qualificador veio da "correção sugerida" da Leitora B1 e foi copiado pelo despacho (`despacho:86-87`).
  A Executora seguiu o despacho, e o defeito nasceu antes dela.
- **Correção:** tirar "para arma Leve, Média e de Distância", ou trocar por "qualquer arma".

### B · A Recarga ainda põe o disparo no fim do Preparo (a pergunta do Arquiteto)

- **Onde:** `combate.md:333` ("O tiro continua saindo no último Tick do ciclo, como em toda arma de
  distância") e `:339` ("[catorze Ticks de manivela] e só então o virote sai").
- **Minha leitura: é texto do sistema Normal, e contradiz o item 6.**
  - O argumento é do próprio relato (`relato:123`): "O `combate.md` inteiro é o sistema Normal". Nenhuma
    frase da Recarga a restringe ao P/G/R.
  - O parágrafo de `:86-89`, que fala da mesma Besta Grande, já foi alinhado: "o tiro já foi rolado na
    declaração; esses Ticks marcam quanto tempo a guarda fica aberta". O exemplo de Bram (`:342`), na
    mesma seção, também.
  - Lidos no Normal, `:333` e `:339` dizem que o virote sai depois dos catorze Ticks, e o tiro já foi
    rolado no Tick da declaração. A seção fica com duas ordens no mesmo lugar.
- **Por que é CORRIGE (§8):** o item 6 prometeu alinhar o que é do Normal, e o relato mesmo concluiu que
  tudo é do Normal. A Executora viu os dois trechos e os registrou sem mexer (`relato:147-149`), o que foi
  honesto, mas eles ficam fora da promessa. O conserto é uma frase em cada.
- **Correção:** em `:333`, "o Golpe continua caindo no último Tick do ciclo (no Normal, o tiro foi rolado
  na declaração)". Em `:339`, "e só então chega o Tick do Golpe", como em `:86-89`.

### C · Nadar ainda dá "mais 5 metros" por Margem

- **Onde:** `acoes-corpo-e-movimento.md:72`. O texto: "**A Margem compra** · distância. Cada Margem avança
  **mais 5 metros**".
- **Por que é CORRIGE:**
  - Nadar é **Acumulada** (`:55`), e o Acúmulo é "a distância em metros" (`:70`). É o mesmo caso do
    Escalar ("mais 3 metros") e do Esgueirar ("mais 4 metros"), que a rodada consertou.
  - A frase geral que o próprio Bloco 3 escreveu, em `acoes-e-sistema:79` ("Na Acumulada, a Margem é só a
    forma de ler o excedente [...] e a Margem não soma progresso por cima deles"), fica falsa nesta ficha.
  - A Leitora D1 e o despacho só listaram as duas outras. Mas o Arquiteto pediu o capítulo inteiro, e a
    decisão do autor não é por ficha.
- **Correção:** a mesma redação do Escalar ("não compra distância por cima: o excedente já é a distância
  nadada").

**O que procurei e não precisa mexer:**
- todo "A Margem compra" e todo "Acumulada" em `src/content/chapters/`;
- Feito de força (`:173`), que é Direta;
- Ofício (`acoes-oficio-e-mundo`), onde a Margem compra qualidade, e não progresso;
- o "perde a diferença", que não sobra em lugar nenhum.

## 3 · As PERGUNTAS ao autor

### 1 · "Congelar um intervalo" no Esgueirar (a primeira leitura da Executora)

`acoes-sentidos:77`: "**A Margem** · não compra terreno por cima [...]. Cada Margem pode, à escolha do
jogador, **congelar um intervalo**". A decisão 10 tem duas metades: "é só a forma de ler o excedente; não
soma por cima do progresso". As duas leituras:

- **A:** "só a forma de ler" vale para tudo. Na Acumulada, a Margem não compra efeito nenhum, e o congelar
  sai. Nessa leitura, a qualidade por Margem do Ofício na Acumulada (`acoes-oficio-e-mundo:16`) também
  precisa ser revista.
- **B:** a decisão proíbe só **progresso** por cima. O congelar é um efeito de Tempo (o eixo de
  `acoes-e-sistema:43-47`), e não progresso, então fica.

**O que a rodada fez não é regra a mais em nenhuma das duas.** Antes, a Margem do Esgueirar comprava "mais
4 metros **ou** congelar um intervalo", por cima do excedente nos dois casos. Agora sobra só o congelar, e
ele já existia.

### 2 · Seguir alguém: o Valor Passivo inteiro, ou os 70% da Acumulada?

O item 15 entrou em `acoes-sentidos:52`, logo abaixo da fórmula do Esgueirar (`:50`). O texto: "Num
**trabalho de seguir alguém**, a Dificuldade é o **Valor Passivo do alvo** [...], **na cena** e no preço".
A linha de cima diz que, na Acumulada, a Dificuldade é **70%** do Passivo. Seguir alguém por um trecho é
o caso típico da Acumulada (`:44`). As duas leituras:

- **A:** seguir alguém é exceção, e na cena a Dificuldade é o Passivo inteiro.
- **B:** "a Dificuldade" do item 15 é a régua que dá o preço do trabalho e o vigia da cena. Na Acumulada,
  ela se aplica com os 70% e a suspeita contra o inteiro, como no item 16.

A decisão do autor diz "na cena", o que puxa para A. A ficha logo acima puxa para B.

## 4 · As CLAREZA

1. **A borda da faixa de 6** (`acoes-e-sistema:86`). A linha "**6 ou mais** | perde o que passou da faixa
   de 6" põe o "errou por 6" na linha que perde, e ele perde 0, igual à linha de cima. A conta está certa,
   mas a tabela pode ler "menos de 7 | nada", ou a linha dizer "errou por 6, perde 0".
2. **"Na história, não na planilha"** (`criacao:33`). A frase continua ao lado da nova ("na criação, quem
   decide a Centelha inicial é o Mestre, pela campanha"). Dá para ler as duas juntas: a Centelha não sai
   do XP, e o Mestre a dá. Mas quem lê só a primeira entende que o 1 não se ganha na criação.

**Uma nota sem rótulo:** o "subir uma Proeza de nível" de `criacao:35` e `:58` descreve uma operação que a
ficha não tem. Na ficha, cada Técnica tem nível fixo e é comprada pelo preço dele
(`ficha-engine.ts:2143`), e a árvore soma as Técnicas da cadeia como itens separados
(`ArvoreTecnicas.astro:120`). O texto está certo como regra, e é a decisão B do autor. Fica a nota para o
dia em que a ficha ganhar o "subir".

## 5 · Os itens 8, 9 e 14 não foram tocados

Conferi pelos trechos de cada commit:
- **item 8:** `armas-e-armaduras.md` não está em nenhum dos três, e em `acoes-sentidos-e-engano.md` os
  trechos são `:49`, `:60` e `:74`, nenhum na `:81` ("armadura pesada +4");
- **item 9:** em `combate.md` os trechos são `:86`, `:104`, `:338`, `:381` e `:404`, nenhum em `:54`,
  `:286` ou `:292-297`;
- **item 14:** em `aparencia-virtudes-vontade.md` o único trecho é a `:83` (Virtude), e `:115` não mudou;
  `defesas.md` e `relacoes-sociais.md` não estão em nenhum dos três.

## 6 · Travessão

Contei o caractere no arquivo inteiro (lendo o arquivo, não o diff), antes (`bd26f1b0~1`) e no pino, nos
onze arquivos tocados. Os números são iguais em todos:
- 0 em nove deles;
- `racas.md`: 4 e 4;
- `combate.md`: 6 e 6;
- `vida-ferimentos-cura.md`: 1 e 1.

Nenhum travessão novo.

## Não conferido

- As linhas do Grid, do rastreador e do `motor.mjs` que o relato cita no item 7 (`grid.astro:8671`,
  `:9011`, `:9122`; `combate.astro:2079`; `motor.mjs:376`, `:437`). O commit não mexe nelas e o item não
  pedia que mexesse. Não refiz a leitura.
- `npm run build` e o `dist/`: o relato traz a prova no gerado de cada bloco, e não a refiz.

## Limpeza

Só leitura e contagens com `node -e`. Nenhum arquivo versionado tocado além deste e do
`progresso-revisora-122.md`.
