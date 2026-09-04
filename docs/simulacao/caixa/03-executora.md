# Rodada 03 · aviso à revisora

> **⚠ ESTE AVISO NÃO É CONTEMPORÂNEO DO TRABALHO, e você precisa saber disso antes
> de ler o resto.** A chamada da executora que fez esta rodada **morreu por limite
> de uso da conta**, depois de rodar duas baterias, mexer em cinco arquivos e
> commitar, e antes de abrir o aviso. O `03-executora.md` foi escrito **depois, à
> mão, por cima de commits que já existiam**, por quem não se lembra de tê-los
> feito. O que está aqui é **conferência do que foi commitado contra o agregado
> versionado**, e não relato de quem fez.
>
> A consequência prática, e ela vale para o aviso inteiro: **isto preserva, não
> endossa.** Onde a conferência bateu, está dito que bateu e como. Onde não bateu,
> está marcado como **não conferido** e **não foi corrigido**: corrigir agora
> transformaria a revisão numa conversa sobre um texto que você não viu.

## COMMIT

O código a revisar:

```
5cb4dce37c6fd47b758a732fc1dc88acc72fcb51
```

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a mesma árvore de código: ele só acrescenta este arquivo. Um commit não pode
conter o próprio sha, e é por isso que são dois.

Os commits que esta rodada trouxe, e o que cada um é:

| commit | o que é | quem escreveu |
|---|---|---|
| `640f628` | o `declarar` por lado no `log.mjs`, a tabela do `G` por lado e o carimbo do agregador | a executora, antes de morrer |
| `0794bac` | o resto do trabalho dela, que estava na árvore sem commit: a `09`, o `Pendencias`, os dois agregados e o `test-procedencia.mjs` | commitado à mão, sem revisão de conteúdo |
| `301f842` | o motivo da chamada morta lê o stdout, e o custo dela deixa de valer zero | à mão, e é infraestrutura da caixa, não da medição |
| `5cb4dce` | o sétimo caso do princípio do zero ambíguo | à mão |

## O QUE MUDOU

**O alvo desta rodada foi dado pelo humano e era estreito:** produzir MEDIÇÃO e não
instrumento, com o `declarar` por lado como alvo, por ser a menor coisa que muda um
número já publicado. Os outros itens do seu CORRIGE entrariam só se coubessem no
caminho.

- **o `declarar` por lado (`log.mjs`, `paradasSubLado`)**, que é o item 1 do seu
  CORRIGE. Registra o lado da peça em TODO tipo de parada, e não só em `declarar`,
  porque a soma dos dois lados por tipo é a trava que prova que nenhuma parada
  ficou de fora. A tabela do `G` da `09` §2.4 ganhou as linhas "só o lado `a`" e
  "só o lado `b`" nos dois modos;
- **o carimbo do agregador (item 3 do seu CORRIGE)**: o `--gravar` passou a
  carimbar o commit do AGREGADOR, e não só o da bateria. O agregado da rodada 02
  dizia `80d5db7` na linha 2 enquanto o bloco que o escreveu só existia depois dele;
- **o `test-procedencia.mjs` (item 4 do seu CORRIGE)**, no `validate` e no `build`:
  para cada `linhas N a M` citada nos documentos, a linha citada do
  `resultados/*.txt` tem de conter o número citado. Quatro citações conferidas, duas
  delas bloco a bloco, número a número;
- **a hipótese do 4.409.780 (item 5 do seu CORRIGE) foi testada e CAIU.** A grade
  foi rodada na árvore de `2df566f` (worktree), e não produz o número. Ele continua
  sem origem encontrada, agora com a hipótese principal descartada em vez de por
  testar. O agregado dessa corrida está versionado em
  `resultados/09-2df566f-bmtlxrjpt.txt`;
- **o item 2 do seu CORRIGE (o sinal espelho do `ocasião · passo`) NÃO foi feito**,
  e está no `Pendencias.md`. Não cabia no caminho da medição: exige o mesmo par de
  casos de teste dos outros onze;
- **o item 4b (os quatro lugares de status velho na `09`) foi feito em parte**: o
  cabeçalho passou a dizer que a grade rodou seis vezes e que a sexta reproduz a
  quinta. Os outros três lugares não confirmei um a um.

## O QUE ESTE RELATÓRIO AFIRMA

O agregado desta rodada é `resultados/09-bmtlxp622.txt` (417 linhas, bateria
`bmtlxp622`, commit `640f628`, agregador `640f628`, `dados_hash`
`36ff54d18bb95d9a`, o mesmo das anteriores). `R:` é linha nele.

**Conferi à mão, antes de assinar, e digo o que conferi e como:**

| afirmação | onde | conferência |
|---|---|---|
| 228.332 declarações · lado `a` 102.940 (45,1%) · lado `b` 125.392 (54,9%) | `R:188` | ✓ o bloco copiado na `09` é a linha, literal. E fecha: 102.940 + 125.392 = 228.332; 102.940/228.332 = 45,08%; 125.392/228.332 = 54,92% |
| trabalho da mesa, `G = 2`, só o lado `a` · 1.301.749 | `R:194` | ✓ 1.095.869 + 2 × 102.940 |
| trabalho da mesa, `G = 2`, só o lado `b` · 1.346.653 | `R:195` | ✓ 1.095.869 + 2 × 125.392 |
| trabalho da mesa, `G = 4`, só `a` · 1.507.629 e só `b` · 1.597.437 | `R:197` e `R:198` | ✓ 1.095.869 + 4 × 102.940 e + 4 × 125.392 |
| a banda **9,3% a 9,6%** (`G = 2`) | `R:194` e `R:195` | ✓ 125.237/1.301.749 = 9,62% e 125.237/1.346.653 = 9,30% |
| a banda **7,8% a 8,3%** (`G = 4`) | `R:197` e `R:198` | ✓ 125.237/1.507.629 = 8,31% e 125.237/1.597.437 = 7,84% |
| o denominador das duas bandas | `R:192` a `R:198` | ✓ é o **trabalho da MESA** (mestre mais os `G` gestos do lado que declara à mão), e o numerador é o **piso** (125.237 cliques poupados). O modo é `mesa`. As linhas do modo `site` são outras (`R:203` a `R:207`) e dão 12,8% a 13,4% e 10,2% a 11,0% |
| "as linhas de 6,2% a 8,1% da rodada 02 eram o caso extremo" | `09-bmtlw3e2r.txt` `R:191` e `R:192` | ✓ **confirmado por identidade aritmética**: o trabalho da mesa daquelas linhas (1.552.533 e 2.009.197) é exatamente `mestre + G × 228.332`, isto é, TODA declaração das duas facções paga em cliques. É a linha "as duas facções" desta rodada, com o mesmo número |

**E uma afirmação que NÃO passou na conferência.** Ela é de mecanismo, não de
número, e está na `09` §2.4 e no `Pendencias.md` L24:

> "não é meio a meio, por uma razão do desenho da grade e não do jogo: em metade das
> células o lado `b` anda com passo dobrado (`passoMult`, o eixo coprimo da §1), fica
> livre mais cedo e declara 22% mais vezes que o lado `a`"

- **o 22% está certo:** 125.392/102.940 = 1,218;
- **"em metade das células" está certo em número:** 48 das 96 células são `coprimo`;
- **mas o `passoMult` vale 1 em TODAS as 96 células**, conferido duas vezes: em
  `cena.mjs`, onde o eixo E4 foi tirado da grade em 03/09 com o comentário dizendo
  que ele é inerte com esta política, e no manifesto da bateria que realmente rodou
  (`.sim/r03/bateria.json`), onde o conjunto de valores de `passoMult` é `[1]`. **O
  passo dobrado não aconteceu nesta bateria.** O que o eixo `coprimo` faz é dar
  arquétipos diferentes aos dois lados (`escudeiro` contra `montanteiro`), que não
  é a mesma coisa;
- **e o eixo `coprimo` também não explica sozinho.** Medi a repartição separada por
  eixo, direto nas faixas da bateria: nas células `unissono`, em que os dois lados
  são o MESMO arquétipo, o lado `b` ainda declara **1,178 vez** o que o lado `a`
  declara. Com peças idênticas e passo idêntico, a assimetria continua.

**Não corrigi o texto**, por instrução: o número publicado (a repartição e as duas
bandas) está conferido e de pé, a **explicação** dele está refutada, e a causa
verdadeira eu não estabeleci. Fica como achado desta conferência, para você decidir
se é erro de redação ou assimetria do harness.

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D11 | o aviso da rodada 03 é escrito **à mão, depois**, em vez de a rodada ser refeita por uma execução nova | um aviso que não é relato de quem trabalhou. Em troca, não se paga uma execução para produzir um aviso sobre trabalho que ela não lembra de ter feito, e a alternativa (deixar a rodada aberta) travaria a caixa |
| D12 | o trabalho que estava na árvore sem commit foi **commitado sem revisão de conteúdo** (`0794bac`) | 1.034 linhas entraram na história sem ninguém ter lido linha a linha. O portão (`npm run validate`) passa, e o repositório é compartilhado: deixar 900 linhas soltas na árvore era o risco maior |
| D13 | a afirmação de mecanismo refutada fica **no texto, errada**, e marcada aqui | a `09` §2.4 e o L24 têm hoje uma frase que a conferência derrubou. Corrigir agora faria você revisar um texto diferente do que este aviso descreve |
| D14 | o custo de uma chamada morta deixa de valer zero, e o total do RESUMO passa a sair marcado como **piso** | não fecha o buraco entre execuções (o contador nasce em zero a cada `npm run duo`), e isso está escrito no `02` |

## O QUE FICOU EM ABERTO

- **o mecanismo da repartição 45,1/54,9 não está explicado.** A explicação publicada
  foi refutada, e a assimetria existe até onde os dois lados são idênticos. É o
  primeiro item da próxima rodada, na minha leitura, e pode ser um achado do harness
  e não da redação;
- **o item 2 do seu CORRIGE**, o sinal espelho do `ocasião · passo`, que hoje guarda
  o piso só por cima;
- **os três lugares de status velho na `09`** que não confirmei um a um;
- **a trava de custo entre execuções:** dentro de uma execução não há buraco, porque
  a primeira chamada morta encerra o ciclo e não há segunda. Entre execuções há, e
  quem o fecha hoje é o humano lendo o RESUMO;
- **⚠ PRECISA DO HUMANO · o L26**, inalterado: *por que a mesa rola o dado na mão?* e
  *com que frequência há efeito de chão ativo numa cena?*;
- **⚠ PRECISA DO HUMANO · quem declara o NPC na mesa.** Esta rodada mediu os dois
  cenários e a largura entre eles (0,3 ponto), então a pergunta deixou de travar
  conta nenhuma. Continua sendo escolha de uso da mesa, e não regra de jogo;
- **o L25, L20, L22, L23 e L27**, no `Pendencias.md`, como antes.

## ONDE LER

1. `docs/simulacao/resultados/09-bmtlxp622.txt` · linhas 187 a 207 (a tabela do `G`
   com a repartição por lado, nos dois modos);
2. `docs/simulacao/09-bateria-grande.md` · §2.4, o bloco novo da repartição e o
   quadro "O que a linha 'um lado à mão' NÃO é". **É aqui que mora a frase
   refutada**, no parágrafo do passo dobrado;
3. `scripts/sim/log.mjs` · `paradasSubLado`, e `scripts/sim/agregar.mjs` · a trava
   que exige a soma dos dois lados por tipo, e o `temLado` que separa "bateria velha
   não sabe o lado" de "repartição furada";
4. `scripts/test-procedencia.mjs` · a conferência de linha citada;
5. `Pendencias.md` · L24.
