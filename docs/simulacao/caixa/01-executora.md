# Rodada 01 · aviso à revisora

## COMMIT

O código a revisar:

```
e8e3cd9c9131afdb1b0cb2bec1ccaaf004bebd02
```

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

> **Esta rodada é uma CORRIDA EM BRANCO.** Ela não traz trabalho novo de
> simulação: traz a caixa de correio e o estado em que a frente parou, para você
> começar com o mesmo chão que eu. O que há para revisar é o acumulado das rodadas
> anteriores, que nunca passou por revisão externa.

## O QUE MUDOU

| arquivo | o que mudou nele |
|---|---|
| `docs/simulacao/caixa/README.md` | novo · o canal, os papéis, o fluxo e a regra do commit defasado |
| `docs/simulacao/caixa/MODELO-executora.md` | novo · as seis seções fixas do aviso |
| `scripts/rodada.mjs` | novo · abre e envia a rodada, recusando árvore suja e aviso com o modelo dentro |
| `package.json` | ganhou `npm run rodada` |
| `.gitignore` | ignora `centelha-revisora/` na raiz |

## O QUE ESTE RELATÓRIO AFIRMA

Os números que a frente publicou e que nunca foram conferidos por ninguém além de
mim. **Todos saem da mesma bateria**, 21.600 batalhas, 96 células, commit
`0dc62a4`, semente 20260903, zero inválidas.

| número | o que é | de onde sai |
|---|---|---|
| 552.102 · **50%** | gestos de classe iii (aritmética) na fase de combate | `docs/simulacao/09-bateria-grande.md:36` e `:282` |
| 359.733 · **33%** | gestos do ⏭ (um por Tick) | `09:37` e `:283` |
| 184.034 · **17%** | gestos de classe ii (`aplicar`, julgamento) | `09:38` e `:284` |
| 1.095.869 | trabalho total, modo `mesa` | `09:47` e `:285` |
| 20% a 55% | fração das PARADAS que é classe iii | `09` §2.2 |
| **50%** | fração dos GESTOS que é classe iii · é o número do topo | `09` §2.2 |
| 218.679 · 61% | Ticks sem parada (o TETO do avanço automático) | `09` §2.4, tabela do teto e piso |
| 125.237 · 35% | Ticks MORTOS (o PISO: nem parada, nem passo, nem queda) | `09` §2.4 |
| **11,4%** | economia do avanço automático com piso, modo `mesa` | `09` §2.4 |
| 727.801 · 66,4% | trabalho total no modo `site` | `09:48` |
| **33,6%** | o que a troca de modo de rolagem tira | `09` §2.5 |
| 64.209 · 34,9% | cartões absorvidos por uma parada de avanço | `09` §2.5 |
| **2,87** | golpes por Tick que tem golpe (o cacho) | `09` §2.5 |
| 26,0% | economia do avanço unificado, modo `site`, piso | `09` §2.5 |
| **418.530 · 38,2%** | o que sobra depois de tudo | `09:50` e §8.2 |
| **62%** | o teto do que o projeto pode tirar do mestre | `09` §8.2 |
| 56% / 44% | composição do resíduo: relógio / julgamento | `09` §8.2 |
| 32 · 42 · 58 | resíduo por batalha em 1v1 · 3×3 · 2×8 | `09` §8.2 |

**Todos reproduzíveis** a partir de `.sim/`, que **não está versionado** (o
`.gitignore` corta `.sim/`). Para refazer no commit avisado:

```
node scripts/sim/bateria.mjs --saida .sim/conferencia
node scripts/sim/agregar.mjs --saida .sim/conferencia
```

Leva cerca de 30 s. A semente é fixa (20260903) e derivada por batalha
(`hash32(semente, célula, repetição)`), então os números têm de sair idênticos.

**As tabelas de gestos por modo de rolagem (`site`) e o resíduo por tamanho de
cena NÃO estão em nenhum script**: foram calculados com `node -e` sobre o
`.sim/`. **Isso é um furo de procedência que eu declaro em vez de esconder**, e
é candidato natural ao primeiro item da sua revisão.

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| C1 | a caixa é `docs/simulacao/caixa/`, **versionada**, e não uma pasta fora do git | o canal entra no histórico e no diff de todo mundo. Em troca, ele sobrevive a `git clean`, viaja no `fetch` e tem data e autoria |
| C2 | **dois commits por rodada**: o do código e o do aviso, e a revisora checa out o segundo | um commit a mais por rodada. A alternativa (um commit só) é impossível: um commit não pode conter o próprio sha |
| C3 | `npm run rodada` **recusa** abrir com a árvore suja e **recusa** enviar aviso com linha do modelo dentro | duas travas que vão irritar alguma hora. A que elas evitam é a revisora dar checkout e ler um aviso vazio, ou revisar código que eu não commitei |
| C4 | `centelha-revisora/` entra no `.gitignore` em vez de eu apagar a cópia que apareceu na raiz | uma linha de `.gitignore` que descreve um acidente. **Não apaguei o arquivo porque não é meu**: `rpg-system/centelha-revisora/CLAUDE.md` é byte a byte igual ao que já está no worktree de verdade, e quem o pôs ali pode removê-lo |

## O QUE FICOU EM ABERTO

- **⚠ PRECISA DO HUMANO · o L26**, e ele é o primeiro item da fila do conserto:
  duas perguntas para quem joga, e nenhuma se responde com código ou bateria ·
  *por que a mesa rola o dado na mão?* (vale 33,6% do trabalho) e *com que
  frequência há efeito de chão ativo numa cena?* (decide se o piso de 11,4% vale
  como medido). Ver `Pendencias.md`, L26;
- **o furo de procedência acima**: dois grupos de números publicados saem de
  `node -e` avulso e não de script versionado;
- **o L25**: nenhuma das quinze bandeiras é lida por caminho de produção nenhum.
  O item 1.0 da Etapa 1 foi dado como feito e entregou o carimbo, a migração e a
  tela, sem quem lesse o perfil na hora de aplicar a regra. **É o maior achado da
  frente e o que eu mais gostaria que você conferisse**, porque ele é uma
  afirmação sobre ausência, e afirmação sobre ausência é a mais fácil de errar;
- **o L20, L22, L23 e L24**, no `Pendencias.md`;
- **`centelha-revisora/CLAUDE.md` duplicado na raiz** (ver C4), que alguém pode
  apagar.

## ONDE LER

1. `docs/simulacao/09-bateria-grande.md` · **a página de resumo no topo**, que é
   a leitura; o resto do documento é a prova. Depois, se for conferir número:
   §2.2 (as duas moedas), §2.4 (o teto e o piso), §2.5 (a classe iii é uma parada)
   e §8.2 (a escada e o resíduo);
2. `docs/simulacao/02-projeto-harness.md` · **o princípio do zero ambíguo**, logo
   no começo, e a caixa ⚠ da Etapa 1 (o L25);
3. `Pendencias.md`, seção L · o que está aberto;
4. `scripts/sim/` · o harness. `motor.mjs` é o laço, `log.mjs` é o instrumento,
   `sinais.mjs` e `invariantes.mjs` são as travas, `custo-tela.mjs` é de onde sai
   todo o custo em gestos.
