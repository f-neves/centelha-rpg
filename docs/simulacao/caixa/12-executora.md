# Rodada 12 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  79c2ad5578003ba983e1627b1b054f588b275036
SHA   2c567ba4d7096d5b870fd8abb69b78055f9c6ed4
TOPO  2c567ba4d7096d5b870fd8abb69b78055f9c6ed4
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
| `docs/simulacao/CATALOGO.md` | caso novo (linha na tabela + parágrafo datado): a constante de conversão com duas candidatas plausíveis |
| `docs/simulacao/ESTADO.md` | Δ-alvo do E5 decidido, custo da grade em batalhas/tempo, reconciliação exata `56,58`/`17,94` (a PERGUNTA da rodada 11, respondida), o caso da unidade |
| `package.json` | `test-corpus-misto.mjs` entrou no `validate` |
| `scripts/rodada.mjs` | "O QUE MUDOU" passa a listar os arquivos por `git diff --name-only BASE..SHA`, e não de memória |
| `scripts/test-corpus-misto.mjs` | **novo**: autoteste do conserto do corpus misto (`agregar.mjs`, rodada 09), que a rodada 10 tinha validado só à mão |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `n ≈ 2.527` | Δ-alvo DECIDIDO (1 gesto/batalha) | `ESTADO.md`, § "DECIDIDO (06/09/2026)" · já publicado na rodada 11 |
| `18,64` / `56,22` | desvio do termo de taxa (`m·Δtaxa`) e do termo de duração (`r·Δticks`), decomposição exata de `Δ(gestos)` | `ESTADO.md`, § "A RECONCILIAÇÃO..." · **não está num arquivo**: script que soma `r08`/`r09` por par, calcula `m`/`r`/`Δtaxa`/`Δticks` por par e decompõe a variância; roda no commit avisado |
| `98,7% / 10,9% / −9,6%` | fração da variância total de `Δ(gestos)` (3.200,7) atribuída a duração, taxa e covariância | idem, mesmo script |
| `0,000000` | diferença máxima, par a par, entre `m·Δtaxa + r·Δticks` e `Δ(gestos)` direto (a identidade é exata, não aproximada) | idem |
| `112 células / 56.000 batalhas` | tamanho de hoje da grade cheia do projeto | `02-projeto-harness.md` §0.5/§3 |
| `32 células` | quantas da grade são de E5 | `09-bateria-grande.md:932` |
| `120.864 batalhas / 201,4 s` | grade nova, com `n=2.527` nas 32 de E5 | `ESTADO.md`, tabela em "O QUE ISSO FAZ COM A GRADE" · derivado |
| `600 batalhas/s` | taxa medida agora, harness atual (não é a taxa da grade real, que tem bandeiras ligadas) | `bmtqb2vxm`: 21.600 batalhas em 36,0 s, saída de `bateria.mjs` |
| `13,6× / 184×` | razão entre as duas constantes de conversão candidatas, e o quanto isso distorceu o `n` anterior | `ESTADO.md`, § "A SUA CORREÇÃO DE UNIDADE" · derivado |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D53 | responder a PERGUNTA da rodada 11 com a decomposição EXATA (`m·Δtaxa + r·Δticks`), em vez de só confirmar "sim, mesmas baterias" | zero: a identidade se conferiu par a par sem custo extra, e fecha o CORRIGE condicional por inteiro em vez de deixá-lo pela metade |
| D54 | consertar `rodada.mjs` para gerar "O QUE MUDOU" do diff, em vez de só prometer cuidado redobrado na próxima tabela manual | zero: é a mesma causa raiz que a rodada 10 já tinha nomeado (a lista vem de memória); prometer mais cuidado não muda o mecanismo |
| D55 | escrever o autoteste do corpus misto contra registros sintéticos MÍNIMOS (construídos, não copiados de bateria real) | zero: cobre exatamente os campos que `validarForma` exige, sem depender de nenhum arquivo `.sim/*` continuar existindo no disco |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **o piloto da bandeira `margem` continua sem rodar.** O Δ-alvo (1 gesto/batalha)
  e o `n` (2.527) vêm de `ticksDeEntrada`, um substituto; a bandeira real pode ter
  `σ` diferente, e só o piloto mede isso.
- **o `n=2.527` ainda não foi aplicado a `bateria.mjs`/`02-projeto-harness.md`**:
  esta rodada mede o custo da mudança, não implementa a grade nova. Fica para
  quando o piloto confirmar o `σ` real.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/ESTADO.md` · "DECIDIDO (06/09/2026)", "O QUE ISSO FAZ COM A
  GRADE", "A RECONCILIAÇÃO DE `56,58` COM `17,94`", "A SUA CORREÇÃO DE UNIDADE"
- `docs/simulacao/CATALOGO.md` · a última linha da tabela e o caso datado no fim
- `scripts/test-corpus-misto.mjs` · o autoteste em si
