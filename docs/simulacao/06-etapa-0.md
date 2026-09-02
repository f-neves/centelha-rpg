# Etapa 0 · A instrumentação

Feita em 02/09, no commit `ce5486f`. **Nada da Etapa 1 entrou nesta passada**: nenhuma bandeira,
nenhuma regra do núcleo do Tick, nenhuma migração. A Etapa 0 não muda comportamento nenhum, e é isso
que ela tem de provar antes de qualquer outra coisa.

Documentos: **P** = `02-projeto-harness.md` (o canônico), **R3** = `03-respostas.md`,
**R4** = `04-prontidao.md`, **R5** = `05-fechamento.md`.

---

## 1 · Uma correção na ordem, achada ao implementar

A ordem da P §0.6.1 dizia que a **branch congelada** era o passo **0.1**, cortada "do commit corrente,
antes de tudo". **Está errado, e o erro é do tipo que esta frente vem caçando: a prova depende de um
instrumento que não existe naquele ponto.**

O espelho de inércia compara a mesa de hoje com a mesa da branch. Se a branch for cortada **antes** da
semente existir, o lado dela rola com `Math.random`, e a comparação volta a ser exatamente o problema
que a semente foi criada para resolver. **A branch tem de ser o último passo da Etapa 0**, não o
primeiro.

O argumento do prazo, que era o motivo de ela vir cedo, sobrevive inteiro: ela continua tendo de ser
cortada **antes da primeira bandeira**, porque depois disso o estado de referência não existe mais.
O que muda é só a posição dentro da Etapa 0.

**A ordem valendo:** semente → caminho do driver → despejo → **branch**.

---

## 2 · O que foi entregue

### 2.1 · A semente, num ponto de injeção só

**`src/lib/acaso.ts`**, arquivo novo e **puro** (não toca no DOM, não lê a URL, não sabe o que é uma
mesa, exatamente como o `rolagem.ts` que ele serve):

| O que | Para quê |
|---|---|
| `acaso()` | a fonte de acaso do combate. É `Math.random` até alguém trocar |
| `semear(f)` | troca a fonte. `semear(null)` devolve o padrão |
| `semeado()` | se a cena é repetível |
| `semeadoDe(n)` | um Mulberry32 a partir de uma semente inteira |

O gerador é o Mulberry32 por um motivo que vale escrever: o harness vai ter de reproduzir **a mesma
sequência em Node e no navegador**, e um gerador que cabe em cinco linhas auditáveis a olho é a única
garantia barata de que os dois lados fazem a mesma conta.

**Os três pontos de acaso do combate passaram a usá-lo:**

| Onde | Era | Ficou |
|---|---|---|
| `rolagem.ts:11` · o `d6` | `Math.random()` | `acaso()` |
| `mesa-ficha.ts:133` · `rolarIniciativaPC` | um `d6` local, com `Math.random` embutido | o `d6` do `rolagem.ts`, e por tabela o mesmo `acaso` |
| `artes-grid.ts:1342` · `rolar`, o dano de Arte | `Math.random()` | `acaso()` |

A iniciativa de **criatura** veio de graça: `iniDeMonstro` (`mesa-bestiario.ts:55`) já usava o `d6` do
`rolagem.ts`, que aquele arquivo reexporta.

**O quarto ponto da especificação não existe ainda.** A P §0.6.1 item 2 lista o **sorteio do último
critério de N4** como quarto lugar a semear. N4 não foi escrito (é Etapa 2), então não há sorteio a
semear: ele nasce já usando o `acaso`, e isso fica anotado como cuidado do item 2.

**O que continua com `Math.random`, de propósito:** `ficha-engine.ts:211` e `mesa-core.ts:28` geram
**id**, e `mesa-tempo-real.ts:209` gera chave de presença. Nenhum dos três é acaso de combate, e
semeá-los produziria ids repetidos entre duas execuções, que é o oposto do que se quer.

### 2.2 · O caminho do driver até a semente

Em `grid.astro`, logo no início do script da página, e **só ali**: a leitura da URL não podia entrar
no `acaso.ts` sem tornar impuro um arquivo que o harness vai empacotar para rodar em Node.

| Parâmetro | O que faz |
|---|---|
| `?semente=N` | chama `semear(semeadoDe(N))`. A cena passa a ser repetível, e liga o despejo junto |
| `?despejo=1` | liga só o despejo, sem semear |
| nenhum dos dois | **nada acontece**: `semear` nunca é chamado, o `acaso` é `Math.random`, e o array do despejo não é criado |

### 2.3 · O despejo por Tick

`window.__DESPEJO`, escrito no fim de `avancarTickSimultaneo`, depois de tudo, com **um registro por
Tick**. É leitura pura do estado que já está em memória (`COMBS`, `TOKENS`, a agenda), então **não
custa consulta nenhuma** e respeita o orçamento da P §0.8.

```
semente   int | null      a semente usada, ou null
semeado   bool            se a fonte de acaso está trocada
arena     id | null
encontro  id | null
ticks[]   { t, fila[], pecas[] }
```

E por peça, em cada Tick:

```
id, nome
q, r, chegada          a posição, e o Tick em que o trajeto encerrou
chao                   se está no chão
pv                     Vida corrente
ini                    a iniciativa rolada
fase                   faseEm(acao, T)
defesaPerdida          defesaPerdida(acao, T).total
acao                   { tipo, desde, livre, golpes[], pressao, mov{destino,alvo} }
```

**O que ele ainda não traz, e por quê.** A tabela de campos da R3 §1.1.1 pede mais três grupos, e os
três dependem de coisa que não existe:

| Falta | Depende de |
|---|---|
| a **resolução** (`def` efetiva, `errouPor`, veredito, Absorção, dano líquido) e **o que a folha calculou** (o ferimento, a Pressão, a distância) | hoje só existem dentro do modal. É o buraco **I5** da R5 §1.2, e entra com o item 6 (N6), que é quem precisa lê-los de um retrato |
| a **ordem de declaração** e a de resolução | é N4, item 2 da Etapa 2 |
| o par (Tick antes, Tick depois) de cada **deslize** | sai do mesmo lugar da re-projeção, e entra junto |

Cada um entra com o item que o cria. O despejo foi desenhado como o gancho onde eles encaixam.

### 2.4 · A branch congelada

**`sim/base-congelada`**, cortada do commit `ce5486f`, que é o da Etapa 0, e empurrada para o
`origin`. É o lado de referência do espelho de inércia: ela tem a semente e o despejo, e **não tem
bandeira nenhuma**.

---

## 3 · A prova

`scripts/test-etapa0.mjs`, chamado por `npm run etapa0`. Dirige o Edge sobre a bancada
(`astro.bancada.mjs`, com o mock de Supabase), rola a iniciativa e anda seis Ticks. **15 asserções,
todas passando.**

| O que ele prova | Como |
|---|---|
| o despejo existe e tem forma | um registro por Tick, 12 peças, e cada peça com id, fase, Defesa perdida e posição |
| **a mesma semente repete** | duas cargas da mesma cena com `?semente=1234`: a assinatura de acaso bate, e o despejo inteiro dos seis Ticks é **idêntico campo por campo** |
| **sementes diferentes divergem** | `?semente=99` dá outra sequência. Sem isto, o item acima estaria provando só que a página é determinística por não rolar nada |
| **a mesa de produção não muda** | sem `?semente=`, `semeado()` é `false` e duas cargas dão sequências **diferentes** |

**Uma armadilha que o próprio teste pegou, e vale registrar.** A primeira versão andava seis Ticks
sem rolar a iniciativa, e nessa cena **o motor não toca em dado nenhum**: o avanço de Tick é pura
aritmética de agenda. As duas execuções saíam idênticas com semente, sem semente e com sementes
diferentes, e o teste teria passado provando nada. Rolar a iniciativa antes de andar é o que faz a
cena tocar no acaso. É a mesma lição do **contador de ocasiões** da P §2.6, encontrada de outro lado:
um zero sem ocasião não é um zero.

**O resto continua verde:** `npm run validate` inteiro, `npm run build`, e as **45 asserções** do
`test-grid-simultaneo.mjs`, que é a suíte que dirige o Grid no navegador.

---

## 4 · O que o espelho de inércia já consegue provar

O espelho de inércia (D4) compara a mesa de hoje com a da branch congelada, sob a mesma semente, e
falha se qualquer campo divergir em qualquer Tick. **Com a Etapa 0 pronta, ele já é executável**, e
consegue provar:

| Consegue provar hoje | Com que material |
|---|---|
| que uma mudança **não mexeu na agenda**: golpes, `livre`, `desde`, `tipo`, Pressão | os campos de `acao` no despejo |
| que **não mexeu no tempo**: a fase de cada peça em cada Tick, e a Defesa perdida | `fase` e `defesaPerdida` |
| que **não mexeu na geometria**: a posição de cada peça ao fim de cada Tick, e o Tick em que cada trajeto encerrou | `q`, `r`, `chegada` |
| que **não mexeu nas rolagens**: a iniciativa de todo mundo, que é o primeiro número rolado da cena | `ini`, sob semente fixa |
| que **não mexeu na fila** | `fila`, a ordem em que as peças saem de `naFila()` |

**O que ele ainda não consegue provar, e é o mesmo buraco da §2.3:** que uma mudança não mexeu no
**dano**. Veredito, Absorção e dano líquido não estão no despejo porque só existem dentro do modal da
folha. Enquanto isso não entrar, o espelho prova que a mesa **conta** igual e não prova que ela
**resolve** igual.

Isso tem uma consequência prática na Etapa 1 que vale dizer agora, porque muda a ordem de entrada das
bandeiras: **as bandeiras que só mexem em dano (`margem`, `gate`) não têm prova de inércia completa
até o despejo da resolução existir.** As que mexem em Defesa, agenda ou tempo (`bloqueio`, `teto6`,
`porte`) já têm. Ou o despejo da resolução sobe antes delas, ou elas entram com a ressalva escrita.
**É a única coisa que a Etapa 0 descobriu e que a Etapa 1 vai ter de resolver.**
