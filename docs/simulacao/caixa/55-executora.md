# Rodada 55 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  873b772bc776428e1f1b6b3c731014072a898b0b
SHA   974925bab9da506e4b1cf139082d51aa024560c5
TOPO  974925bab9da506e4b1cf139082d51aa024560c5
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
documento da rodada; aqui é só o inventário. Dois commits no intervalo: o
código (`57f6bcb`, meu) e os documentos (`974925b`, do Arquiteto).

| arquivo | o que mudou nele |
|---|---|
| `src/lib/artes-grid.ts` | nova `curaDoEfeito(efeito)`; novo campo `Parametro.pontos` |
| `src/lib/artes-grid-mesa.ts` | nova `curarAlvo`; guarda e ramo de cura em `verificarEfeitos`; rótulo do grupo da caixa segue a ordem da resolução; `CtxGrid.gravarVida` |
| `src/pages/mesa/grid.astro` | nova `curarPv` (o teto de `pv_max`, num lugar só); `curar()` passa a chamá-la; `ctxArtes().gravarVida` |
| `src/data/efeitos.json` | `mao-firme` ganha `"pontos": 1` no parâmetro Cura |
| `package.json` | `test-l86a-cura.mjs` entra na cadeia do `validate` |
| `scripts/test-l86a-cura.mjs` | novo, 32 asserções |
| `docs/simulacao/caixa/progresso-55-l86a.md` | novo, sinal de vida da rodada |
| `Pendencias.md` | L86 remedido (a medida que faltava, a régua do `maos-sobre-a-multidao`); decisão da migração 38 (`nivel_arte`); correção do erro do Arquiteto sobre o L86; resíduo do `mao-firme` |
| `docs/simulacao/CATALOGO.md` | forma nova registrada (decisão de regra entra no dado junto com o código) |
| `Auditoria_Tecnica.md` | reaponte de citação |
| `Grid_Mobile.md` | reaponte de citação |
| `docs/simulacao/CONJURACAO.md` | reaponte de citação |
| `docs/simulacao/CONTEXTO.md` | reaponte de citação |
| `docs/simulacao/ESTADO.md` | reaponte de citação |
| `docs/simulacao/VOZ.md` | reaponte de citação |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `1 PV` | cura de `mao-firme` por disparo do gatilho `por-turno` | `src/data/efeitos.json:1706` |
| `32` | asserções verdes em `test-l86a-cura.mjs` | `node scripts/test-l86a-cura.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | `MORDIDAS` (o contador de "algo aconteceu sem diálogo", `artes-grid-mesa.ts:45`) não conta cura: o comentário dele já a define como "dano ou condição aplicados", e cura não é nenhum dos dois. | quem quiser medir "quantas curas dispararam" não acha em `contadorDeMordidas()`; precisa de um contador novo, se algum dia for preciso. |
| D02 | `curarAlvo` chama `marcarMordido` por dentro (como `morder`), e não no ponto de chamada (como o ramo de `condicao`, que chama por fora). | os três ramos do laço não ficam simétricos na forma: dois escondem a marcação dentro da função, um a faz inline. Quem ler o laço vê dois padrões, não um. |
| D03 | o botão de lote ("Resolver todos de uma vez") saiu sem `grupo`, então sempre aparece numa linha solta acima do catálogo, mesmo quando a lista tem só mordida OU só cura (não precisaria, já que só há um grupo nesses casos). | numa rodada com só mordida pendente, a caixa muda de forma em relação ao formato antigo (o botão estava dentro do grupo único); ninguém pediu essa forma para o caso de um grupo só, foi extensão minha da regra "ação sobre a lista inteira" para todos os casos. |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A migração 38 foi DECIDIDA e NÃO foi escrita, de propósito.** O humano
  escolheu a coluna `nivel_arte` para a linha do efeito guardar o nível da
  Arte de quem conjurou (`Pendencias.md:6108-6109`). Não há arquivo de
  migração neste commit e não vai haver sem ele: migração não se escreve nem
  se roda por conta própria. Precisa do humano, no SQL Editor, quando a fila
  chegar nela (a 33 e a 37 ainda esperam, à frente).
- **Duas perguntas ficaram abertas DENTRO de uma decisão que já foi tomada**,
  e não são reabertura dela (`Pendencias.md:6142-6147`): o que "nível" indexa
  no `acelerar-a-cura` (a prosa usa nível da Arte; a nota de Mana aponta para
  grau de parâmetro, que o Efeito não tem), e se a versão em área
  (`maos-sobre-a-multidao`) divide o valor entre quem está dentro (o `notas`
  do Efeito diz que sim, a anotação do resíduo do humano lê como se não).
  Ambas do humano.
- **Resíduo do `mao-firme`**: a Arte promete duas coisas na prosa (curar 1
  PV/turno e "não morrer de sangramento enquanto a sua mão estiver nele") e a
  rodada entrega só a primeira. O sangramento tem regra própria
  (`regras.json → sangramento`) que não foi encaixada. A Arte NÃO está
  registrada como pronta por causa desta linha (`Pendencias.md:6149-6155`).
- `acelerar-a-cura`, `cura-guardada` e `maos-sobre-a-multidao` continuam sem
  curar nada no tabuleiro (L86b): a primeira espera a migração 38 acima; a
  segunda precisa de um gatilho novo (`armadilha`, sem mecanismo hoje) e de
  uma ação de jogo que não existe ("o alvo escolhe a hora"); a terceira
  (`forma: "zona"`) não tem caminho de resolução nenhum no motor, nem para
  dano nem para cura.
- `npm run smoke` continua sem rodar nesta máquina (o `UnknownCompilerError`
  do Astro no Windows, defeito de máquina já documentado, não desta rodada).
  `npm run validate` cobre tudo que não depende do compilador do Astro,
  inclusive `test-l86a-cura.mjs`.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-55-l86a.md` · sinal de vida completo, do
  levantamento aos dois ajustes finais na caixa de confirmação.
- `Pendencias.md` · §L86 (o levantamento remedido, a decisão da migração 38,
  as duas perguntas abertas, o resíduo do `mao-firme`).
