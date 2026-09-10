# Rodada 27 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  ae007b6f0bc242418a79dccf2e15886ea9323084
SHA   457ca829308e25bdb65c596e0e937a7a7b6fdd43
TOPO  f8f72d00a6073e5245845720917a0826d94bd8d6
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

## ENTROU

**O que este aviso cobre, e por quê:** a Revisora ficou ancorada em `ae007b6f` (07/09 21:38) esperando o aviso de `5af06f8`, que nunca chegou até ela. 28 commits se acumularam desde então. Dividido em dois blocos:

**Deste lote (verificado nesta rodada, revisar de verdade):**
- `5af06f8` · a tela da lembrança construída (fase 2.5, lote 2 item 2), pelo humano em 07/09
- reverificação de hoje pela Executora: ensaio dos três sentidos (verde/vermelho/verde), `npm run smoke` inteiro em exit 0
- `d1d70e4`, `457ca82` · Arquiteto corrige `Pendencias.md`/`CONTEXTO.md`: L34/L39 (fase 2, Interpor e grid.condicao) e L32/L33 (fase 2.5) estavam fechados no código e desatualizados no documento
- `9e66158` · Arquiteto substitui a regra de orçamento por percentual fixo pela pergunta ao humano no início de sessão (`ARQUITETO.md §0`)

**Backlog acumulado, de outras frentes, já assentado antes desta sessão ou fora dela — reancorar apenas RECONHECE que existe, não pede revisão linha a linha agora (seria reabrir descoberta que o congelamento já fechou):** B12 fraqueza/resistência (`20daeea`, `5b17e2a`, `f8f72d0`), fecha H1/H2/K28/D2 (`b694eb6`), MAPA.md e arquivamento em legacy/raiz (`4b0fa3b`, `3df21ce`, `3cc6306`), README de docs/simulacao (`c27ba32`), CONTRATO-AUDITORA.md (`7704f2b`), renomeação TechLead→Arquiteto (`7af1e7a`), mais commits de organização de contrato/worktree da própria formação da equipe (`c0e46dc`, `9f6c805`, `9b09b0c`, `efc905f`, `0aa2f94`, `1b31f8d`, `62b4dcc`, `95f8091`, `92da7c0`, `d8bf443`, `05c4a92`, `7b8e66c`).

## PRECISA DE MIM

Nada travado no humano por esta rodada: a única decisão pendente (rodar a migração 33 em produção) já está marcada como do humano, não minha, em `CONTEXTO.md`/`Pendencias.md` L33 e não precisa de aprovação nova aqui.

## QUEBROU

Nada quebrou nesta rodada. O que caiu foi premissa de DOCUMENTO, não de código: `Pendencias.md`/`CONTEXTO.md` afirmavam "a tela da lembrança nunca existiu, zero ocorrências em `src/`" (L33), e isso já era falso desde `5af06f8` (07/09). O Arquiteto já corrigiu em `457ca82`.

Achado à parte, sem relação com a lembrança: `test-grid-simultaneo.mjs` falhou uma vez com `Execution context was destroyed, most likely because of a navigation` (puppeteer) rodando `npm run smoke` inteiro; não se repetiu numa segunda rodada limpa logo em seguida. Registro para quem acompanha flakiness dos scripts de bancada — não bloqueou nada aqui.

## BLOQUEADO

Nada bloqueado nesta rodada. Um achado que quase virou bloqueio e não foi: `docs/simulacao/simulacao.7z` (99,7 KB, não rastreado, mtime de 08/09, sem relação com meu trabalho) impedia `npm run rodada` abrir por árvore suja. Não decidi sozinha (não sabia a origem nem o destino certo); o Arquiteto moveu para fora do repositório, reversível, e a árvore destravou.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `.gitignore` |  |
| `Auditoria_Memoria/RELATORIO.md` |  |
| `Auditoria_Tecnica.md` |  |
| `CLAUDE.md` |  |
| `Combate_Simultaneo.md` |  |
| `Pendencias.md` |  |
| `_shots/README.md` |  |
| `docs/MAPA.md` |  |
| `docs/simulacao/ARQUITETO.md` |  |
| `docs/simulacao/CATALOGO.md` |  |
| `docs/simulacao/CONTEXTO.md` |  |
| `docs/simulacao/CONTRATO-AUDITORA.md` |  |
| `docs/simulacao/CONTRATO-REVISORA-ORIGINAL.md` |  |
| `docs/simulacao/CONTRATO-REVISORA.md` |  |
| `docs/simulacao/ESTADO.md` |  |
| `docs/simulacao/PASSAGEM.md` |  |
| `docs/simulacao/PLANO.md` |  |
| `docs/simulacao/README.md` |  |
| `legacy/raiz/Combate_Prolongado.md` |  |
| `legacy/raiz/Defesas.md` |  |
| `legacy/raiz/Miniaturas_3D.md` |  |
| `legacy/raiz/Paleta_Centelha.html` |  |
| `legacy/raiz/README.md` |  |
| `legacy/raiz/armaduras_escudos_centelha.txt` |  |
| `package.json` |  |
| `scripts/mesa-mock.mjs` |  |
| `scripts/test-elementos-combate.mjs` |  |
| `scripts/test-grid.mjs` |  |
| `src/lib/artes-grid-mesa.ts` |  |
| `src/lib/mesa-bestiario.ts` |  |
| `src/lib/mesa-core.ts` |  |
| `src/pages/mesa/criaturas.astro` |  |
| `src/pages/mesa/grid.astro` |  |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| exit 0 | `npm run smoke` inteiro (10 scripts), com o `grid.astro` como está em `main` | saída do comando, rodada nesta sessão |
| vermelho → verde → verde | o ensaio dos três sentidos na cena `a tela da lembrança`: 3 asserções falham ao remover `${lembranca ? ' lembranca' : ''}` de `pintarTokens`, e voltam a passar ao devolver a linha | `src/pages/mesa/grid.astro:4390`, `scripts/test-grid.mjs:533-545` (cenaLembranca) |
| (3,1) | a casa onde `token_visao` desenha a lembrança, simulada por `?lembranca=1` — achado: a criatura do mock nunca tem token "agora" (`c-lembr` não entra em `arena_tokens`), então esta asserção não contrasta duas posições diferentes, só confirma ausência de posição viva + presença da lembrada. Não falsifica sozinha "desenha na casa antiga e não na atual" | `scripts/test-grid.mjs:542`, `scripts/mesa-mock.mjs:377-388,821` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| (nenhuma) | esta rodada não tomou decisão de engenharia sem perguntar: parei e perguntei nas duas ocasiões em que apareceu escolha (o `.7z` não rastreado, e a opção A/B de como preencher a tabela "O QUE MUDOU") | — |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **Rodar a migração 33 em produção**: decisão do humano, não minha nem da Revisora. O gatilho da própria migração (semente existe, `token_visao`/`combate_visao` mandam `lembranca`, `npm run smoke` verde) está atendido desde 07/09; ninguém rodou ainda.
- **A asserção `(3,1)` do `cenaLembranca` é fraca** (ver a linha acima em "O QUE ESTE RELATÓRIO AFIRMA"): a criatura simulada nunca tem posição "agora" no mock, então o par "sai do lugar certo E aparece apagado no lugar antigo" não está provado pelo lado do movimento, só pelo lado da ausência/presença. Para fechar de verdade precisaria de uma segunda criatura no mock com token real numa casa escura, posição diferente da `vistos`, e a asserção comparando as duas coordenadas. Não fiz esse reforço porque não fazia parte do escopo do lote (construir a tela, que já existia); deixo para a Revisora julgar se vale rodada própria.
- **O backlog de 28 commits/32 arquivos** listado em ENTROU: reconhecido, não revisado linha a linha (decisão do Arquiteto, registrada ali).

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/CONTEXTO.md` · seção da fase 2.5 (L32/L33), corrigida em `457ca82`
- `Pendencias.md` · L32, L33
- este aviso, seção ENTROU · o que está de fato em revisão nesta rodada
