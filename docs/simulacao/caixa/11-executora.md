# Rodada 11 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  9447aea12f7262b0c23e421b6f7cd727c549dfdc
SHA   86724f7b95646c43bb9e54d329a40cf7ad5caaba
TOPO  86724f7b95646c43bb9e54d329a40cf7ad5caaba
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `docs/simulacao/ESTADO.md` | corrigido o Δ da métrica por Tick (não convertido corretamente na rodada anterior), declarada a fonte de σ e ρ, e separado o pareamento por índice do pareamento por semente |
| `docs/simulacao/caixa/11-executora.md` | este aviso |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `2.527` / `10.105` / `252.618` | `n` para detectar um efeito de 1 / 0,5 / 0,1 gesto **por batalha**, convertido para a métrica por Tick pela duração média (50,495 Ticks) | `docs/simulacao/ESTADO.md`, tabela em "Refeita a tabela com o Δ equivalente a um efeito por batalha" · derivado, script abaixo |
| `50,495` | duração média das 19.200 batalhas pareadas de `r08`/`r09` | mesmo script, campo `ticks` |
| `17,94` | desvio por Tick (0,3553) reconvertido para gesto/batalha (`× 50,495`) | derivado, mesmo script |
| `05-fechamento.md:429` | a única previsão escrita do E5, e ela é por Tick, não por batalha | citação direta, conferida |
| `65,74` / `56,58` | desvio do delta de gestos, isolamento (`bmtqb2vxm`×`bmtq8zam1`) e regra (`r08`×`r09`), lado a lado | `docs/simulacao/ESTADO.md`, tabela em "A CIRCULARIDADE, TESTADA" |

**Declarando os dois insumos que a revisora recalculou a partir de fora, para ela
fechar a metade que não alcança sem ver o código:**

- **σ (o desvio do delta) e a correlação ρ vêm do campo `gestos`**, de cada
  registro de `faixa-N.jsonl` (topo do objeto, não dentro de `fases`): é o total
  de gestos da batalha inteira, combate mais fuga. Não é uma soma feita por mim a
  partir de subcampos — é um campo que o próprio `agregar`/`log.mjs` já escreve
  pronto em cada linha;
- **o comando**, rodável no commit avisado: soma-se `.sim/r08/faixa-{0..3}.jsonl` e
  `.sim/r09/faixa-{0..3}.jsonl` num `Map` chaveado por `célula|semente`, filtra-se
  `fim !== 'estourou'` nos dois lados, e sobre os pares restantes calcula-se
  `delta = gestos_depois − gestos_antes` (ou `gestos/ticks` para a versão por
  Tick). É um script de uma tela, não versionado como arquivo — reproduzível por
  qualquer um com os dois diretórios em disco;
- **quantos pares entraram: 19.200**, de 21.600 batalhas em cada bateria (as
  12 células `unissono` estouram 100% das vezes nas duas baterias e por isso saem
  do filtro; sobram as 12 `coprimo`, ×2 mapas, ×400 repetições ≈ os 19.200). O
  isolamento (`bmtqb2vxm`×`bmtq8zam1`) usa o mesmo filtro e dá o mesmo `n` de
  pares, pareado por `b` em vez de por `célula|semente`.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D50 | corrigir publicamente o `n` de 1/4/100 da rodada 10, em vez de defender a conta original | zero: a tabela errada fica no histórico do commit, a certa substitui no `ESTADO.md` |
| D51 | manter as DUAS tabelas de `n` no `ESTADO.md` (Δ por Tick literal e Δ convertido de batalha), em vez de escolher uma | zero: nenhum documento fixa qual Δ é o alvo do E5, então escolher uma escondia a ambiguidade em vez de resolvê-la |
| D52 | não rodar o piloto da bandeira `margem` nesta rodada | fica para quem decide: o Δ-alvo do E5 não está definido, e rodar o piloto sem um Δ para comparar não decide nada sozinho |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **⚑ o Δ-alvo do E5 não está escrito em lugar nenhum.** `05-fechamento.md:429`
  só fixa um teto ("menos de um gesto por Tick"), não um valor esperado. Sem um
  Δ nomeado, "o `n` basta" ou "o `n` não basta" são as duas leituras possíveis
  ao mesmo tempo, e só quem decide o desenho pode fixar qual delas importa.
- **o piloto da bandeira `margem`** (variância do delta dela, nas duas âncoras,
  `02-projeto-harness.md` § "Um fluxo só") continua sem rodar. Os números desta
  rodada são todos de `ticksDeEntrada`, um substituto, não o real.
- **o desenho da grade continua sendo decisão do humano**, e agora com menos
  certeza do que a rodada 10 sugeria: não é mais "os `n` já bastam", é "depende
  de qual Δ for o alvo, e ninguém escreveu qual".

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/ESTADO.md` · "A CIRCULARIDADE, TESTADA" (tabela lado a lado),
  "O NÚMERO POR TICK" (a correção do Δ, a segunda tabela, e "O QUE A PREVISÃO
  ESCRITA DO E5 REALMENTE DIZ"), e o parágrafo final "O que isto significa, sem
  decidir nada"
