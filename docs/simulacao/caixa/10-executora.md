# Rodada 10 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  88603aa5e6a66f019bedce2638e3c869975bd14f
SHA   47aacec764ac022a24e7ade3cb98bb1427e37c8c
TOPO  47aacec764ac022a24e7ade3cb98bb1427e37c8c
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
| `docs/simulacao/ESTADO.md` | dois parágrafos novos: o teste de circularidade (bateria de isolamento) e o desvio na métrica por Tick, os dois em resposta à objeção da rodada anterior |
| `docs/simulacao/resultados/10-bmtqb2vxm.txt` | saída publicada do agregador sobre a bateria de isolamento |
| `docs/simulacao/caixa/10-executora.md` | este aviso |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `65,74` | desvio do delta de gestos, `bmtqb2vxm` × `bmtq8zam1`, mesma regra, sementes diferentes, pareado por `b` (19.200 pares que terminam nas duas) | `docs/simulacao/ESTADO.md`, § "A CIRCULARIDADE, TESTADA" · **não está num arquivo do agregado**: script que soma os dois pares de `.jsonl` em `.sim/riso` e `.sim/r09` por `b`, exclui `fim==='estourou'`, roda no commit avisado |
| `56,58` | o mesmo cálculo, mas `r08`×`r09` (mesma semente, regra mudou), já publicado na rodada 09 | idem, script equivalente sobre `.sim/r08`/`.sim/r09` |
| `0,3553` | desvio do delta de `gestos/ticks` por batalha, `r08`×`r09`, mesmos 19.200 pares | `docs/simulacao/ESTADO.md`, § "O NÚMERO POR TICK" · script que divide `gestos` por `ticks` antes de parear, roda no commit avisado |
| `3,72` | taxa média de `gestos/ticks` no lado "antes" (`r08`) dos mesmos 19.200 pares | idem |
| `n ≈ 1 / 4 / 100` | repetições pareadas para detectar delta de 1 / 0,5 / 0,1 gesto por Tick, com `σ = 0,3553`, 95%/80% | `docs/simulacao/ESTADO.md`, tabela em "O NÚMERO POR TICK" · fórmula `n = (1,96+0,84)² · σ² / Δ²`, derivado |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D47 | rodar uma bateria nova (`bmtqb2vxm`, 21.600 batalhas, ~36s) para o isolamento, em vez de tentar aproveitar bateria já em disco | zero: nenhuma bateria existente tinha a mesma regra com semente diferente para parear |
| D48 | parear `bmtqb2vxm`×`bmtq8zam1` por `b` (índice global), e não por semente — a semente individual de cada batalha muda com o `semente_mestre`, então pareamento por semente não existe entre as duas | zero: conferido que as 21.600 células batem por `b` nas duas baterias antes de calcular qualquer delta |
| D49 | não recalcular o desvio em gestos totais (56,58) com um `n` maior — o achado da rodada é que a métrica certa (por Tick) já resolve a questão, e refazer o número errado com mais precisão não muda a decisão | zero: o número por Tick é o que decide, não o total |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **o desenho da grade de E5 continua sendo decisão do humano.** Os dois números
  desta rodada respondem "a preocupação de inviabilidade se sustenta?" com não, mas
  não decidem o desenho: quem decide é quem pediu para não decidir nada.
- **o `56,58`/`65,74` e o `0,3553` vêm de `ticksDeEntrada`, não da bandeira `margem`.**
  O piloto de `02-projeto-harness.md` continua sendo o que mede a variância do
  delta da bandeira real, agora como confirmação e não como pré-requisito bloqueante
  — mas ele não rodou nesta rodada nem em nenhuma anterior.
- **a bateria `bmtqb2vxm` fica em disco (`.sim/riso`) e não tem `run_id` citado em
  nenhum outro documento além deste aviso e do `ESTADO.md`** — se alguém precisar
  dela de novo, é este o nome.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/ESTADO.md` · "A CIRCULARIDADE, TESTADA", "O NÚMERO POR TICK", e o
  parágrafo final "O que isto significa, sem decidir nada"
