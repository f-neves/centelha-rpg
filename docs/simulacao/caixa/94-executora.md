# Rodada 94 · Executora · o `Pendencias.md` completo

Despacho: `docs/simulacao/caixa/94-despacho.md` (`818b8b6`). Progresso com as horas lidas da
máquina em `progresso-94.md`.

## ENTROU

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | reescrito: seis seções de direção à mão e a seção 7 gerada entre dois marcadores |
| `scripts/gen-pendencias.mjs` | novo: gera a contagem e a lista de itens a partir dos temas, acusa anomalias, `--check` e `--raiz` |
| `package.json` | `gen-pendencias.mjs --check` no `validate`, logo depois do `gen-cap-itens` |
| `docs/pendencias/A-arcano-artes.md`, `B-bestiario.md`, `D-proezas-tecnicas.md`, `E-social-mental-antecedentes.md`, `K-combate-linha-do-tempo.md` | 7 caixas fechadas com prova, cada uma com uma linha de prova no fim do bloco |
| `docs/simulacao/caixa/progresso-94.md`, `94-executora.md` | progresso e relato |

## A medição do item 1

**A contagem.** A diferença que o despacho achou (A 19 contra 20, I 10 contra 12, K 18 contra 19) é
a caixa `- [~]` (parcial): o grep de `- [ ]` e `- [x]` não a pega, e o índice velho a contava como
aberta. São quatro: A11, I11, I12 e K28. Somando os `[~]`, as doze linhas da tabela velha batiam com
as caixas. **O que não batia era a prosa ao lado**: ela somava "mais os cinco E4 a E8, mais E9, E10,
J9, J10 e a nomeada" por cima de uma tabela que já os contava.

**O que a contagem escondia:** siglas repetidas (A22 aberta e fechada no mesmo arquivo; I5 em dois
itens diferentes; L6 e L9 com uma entrada fechada e outra aberta riscada, e a riscada contava como
aberta) e dois itens sem sigla (G "As cinco físicas de toda sessão", fechado; J "A linha de
fechamento do `test-grid`", aberto e nomeado de propósito).

**O formato dos temas:** regular. Todo item é `- [ ]`, `- [~]` ou `- [x]` na coluna 0, seguido de
`**SIGLA · ...**` (às vezes dentro de `~~ ~~`), com a sigla `[A-L]\d+[a-z]?`. Nenhuma caixa aninhada.
As marcas [DECIDIR], [FAZER], [AUTOR] e [CONSERTAR] são regulares de A a K; no L a etiqueta é texto
livre ("[FEITO em ...]", "[ANOTADO ...]").

**Quem cita o `Pendencias.md` por linha:** uma citação só, em `04-revisora.md`, "linha 1344", que é do
arquivo de antes da divisão de 17/09 e já não aponta para nada. Nenhum script lê o `Pendencias.md`.
Reescrever não deslocou nada vivo.

## A forma escolhida, e por quê

**Gerada**, porque o formato é regular. A contagem e a lista dos itens abertos e parciais (sigla,
estado, marcação, título) saem de `scripts/gen-pendencias.mjs`; os fechados aparecem só pela sigla,
para a lista não ter 249 linhas. O gerador **acusa sem consertar** as anomalias acima, numa lista
abaixo da contagem. À mão fica só a direção. Até a lista dos [DECIDIR] da seção 3 eu deixei de
escrever: ela aponta para a coluna Marcação, porque escrita à mão seria uma segunda lista.

**Um desvio pequeno do formato, tratado no gerador:** quando o negrito do título quebra de linha (o
L29, o K28), ele junta até quatro linhas seguintes; quando o negrito é só a etiqueta (o L62), o
título é o texto dela.

## O ensaio dos três sentidos

Numa cópia dos temas e do índice no scratchpad, com o `--raiz`. Nenhum arquivo real tocado:

| passo | o que fiz | `--check` |
|---|---|---|
| base | cópia recém gerada | exit 0 |
| 1 · o defeito | A1 vira `[x]` no tema, o índice fica | **exit 1**, "fora de sincronia" |
| 2 · o conserto, sem tocar no gerador | regero o índice | **exit 0** (168 abertos, 77 fechados) |
| 3 · a regressão | A1 volta a `[ ]` no tema, o índice fica | **exit 1** |

Depois, a cópia do tema voltou idêntica ao original (`cmp`). No repositório, `npm run validate` exit 0,
e o `test-portoes` contou o gerador novo sozinho ("11 de 16 geradores com `--check` no build"). O CI
roda o `validate` inteiro, então o portão novo já está nele; a matriz do CI é só do `smoke`, e o
gerador não é teste de navegador.

## A revisão: fechados com prova e suspeitos

**Fechados, 7, cada um com a prova no próprio tema.** Um subagente, só de leitura, levantou nove
candidatos. Conferi eu mesma cada prova antes de fechar:

- **A22**, a entrada de antes da decisão. A decisão é a outra A22 (AS DUAS, 19/08/2026), no mesmo
  arquivo;
- **B13**: `888a196`, com asserção em `test-rolada-manual.mjs`;
- **D1**: `971b6f4`. Conferido hoje: nenhuma Técnica tem `banda`;
- **E9**: `b903a26`. A `aparencia.nota` já diz o modelo novo;
- **E10**: `fb9310c`. A seção da M-09 está marcada;
- **K12**: pela §14 e pela §16, e no livro desde `c5dd390`;
- **K13**: `b6af150`, e o cabeçalho do `lib-tempo.mjs` diz o mesmo.

**Os dois candidatos que não fechei:**

- **J4**: é [DECIDIR], e o conserto do B12 pode não ser a decisão que ele pede;
- **C3**: a M-10 o esvazia, mas cancelar não é entregar.

**Suspeitos, deixados abertos com a evidência na seção 5 do `Pendencias.md`:**

- de A a K: J4, C3, C4, K28, K20, K27, K5, G12, G13 e E3;
- do L: 20 itens cujo próprio texto diz que algo foi feito. Destes, dez se dizem fechados por
  inteiro, com sha: L70, L71, L76, L80, L81, L84, L87, L88, L89 e L93. **Não reconferi os do L:**
  são de rodadas anteriores à 75, fora da zona que o despacho mandou olhar.

**A regra que segui:** a caixa só muda com a prova citada ao lado. O resto virou linha, e não
conserto.

## PRECISA DE MIM

Nada que só eu possa fazer. A ordem sugerida (seção 6 do `Pendencias.md`) está marcada como PROPOSTA
DO ARQUITETO, redigida por mim, **para você revisar antes de o humano ver**, como o despacho pediu.

## QUEBROU

A primeira tentativa de commit, às 20:30, foi recusada pelo gancho: o conserto do espaço no
`package.json` saiu errado (ver "Achados"). Nada chegou a ser commitado. Refeito, `npm run validate`
exit 0.

## BLOQUEADO

Nada.

## Achados, e o que não consertei

- **As marcas do humano no dossiê:** lido pela ferramenta `Artifact` em 23/09/2026 às 20:22, versão
  `1789563971-21e8`. A página guarda as marcas republicando a si mesma, sem banco (então
  `ArtifactData` não se aplica), e **o estado gravado é vazio: nenhuma marca**. As 19 perguntas dele
  foram quase todas decididas depois, por outro caminho.
- **Documentos de direção desatualizados**, listados na seção 5 do `Pendencias.md` e não editados.
  O `CONTEXTO.md` dá M-05 e M-42 como esperando mão de obra (feitas em `7db14f1` e `2520b5d`) e o item
  9 de Relações Sociais como não executado (feito em `6509801`). O §7 da `PASSAGEM.md` dá a migração
  33 como esperando o humano (rodou em 13 a 14/09). O `PLANO.md` §8 ainda tem o quadro de 20/09.
- **Três C marcados como feitos e com o defeito no fonte** (C-22, C-39, C-61, pelo subagente).
  Conferi a evidência dos três só no fonte, e não no HTML gerado. Ficam como suspeitos.
- **Achados de passagem do subagente do jogador novo, não conferidos por mim:**
  - a seção da M-47 em `jogador-novo-decisoes.md` está enxertada no meio de uma frase da M-03;
  - "perícia" minúscula sobrevive em dois capítulos (resíduo da M-47).
- **`package.json`:** no `validate`, "`test-reapontar.mjs &&node`" estava sem o espaço depois do
  `&&`. Funcionava. O defeito é meu, do commit da rodada 93 (`5134d6c`, conferido por
  `git log -S`). Consertado neste commit, porque o arquivo já estava na minha lista. **E o conserto
  quebrou na primeira tentativa:** a troca de "`&&node `" por "`&& node `" saiu "`&& nodescripts`",
  e o gancho recusou o commit às 20:30 ("'nodescripts' não é reconhecido"). A causa provável, a
  mesma da rodada 93, é a ferramenta de edição aparar o espaço do fim do trecho. **Não testei essa
  hipótese.** Refeito com o trecho ancorado em palavras dos dois lados. Conferido por script: as 56
  partes do `validate` têm todas a forma `node scripts/<nome>.mjs`. `npm run validate` exit 0.
- **O I5 são dois itens diferentes com a mesma sigla**, no tema I. Renumerar é decisão de quem mantém
  o tema; o gerador acusa.

## Os números deste relato, e de onde saem

- **249, 162, 4, 83 e 8 anomalias:** `node scripts/gen-pendencias.mjs --check` no commit desta rodada.
- **47 M e 104 C, com os estados:** levantamento do subagente, conferido por amostra (12 shas e o
  `regras.json`), no progresso das 20:20.
- **7 fechadas e as suspeitas:** as linhas de prova nos temas, e a seção 5 do `Pendencias.md`.
