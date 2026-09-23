# Rodada 93 · Executora · o `reapontar.mjs` grava onde a âncora está

Despacho: `docs/simulacao/caixa/93-despacho.md` (`bd93655`). Veredito de origem: `92-revisora.md`
(o despacho diz "§5"; a folga de ±3 está na §4 dele). Progresso com as horas lidas da máquina em
`progresso-93.md`.

## Arquivos tocados

| arquivo | o que mudou nele |
|---|---|
| `scripts/reapontar.mjs` | depois do mapa, a âncora decide a linha dentro da janela; modo `--tudo`; aviso de âncora ambígua |
| `scripts/test-reapontar.mjs` | novo: os três sentidos e o caso ambíguo, num repositório de mentira |
| `package.json` | `test-reapontar.mjs` no `validate`, logo depois do `test-artes-grid.mjs` |
| `src/lib/artes-grid.ts` | comentário de `aguentouFicarParado` (item 5) |
| 12 documentos (lista abaixo) | 107 citações de linha movidas pela varredura |
| `docs/simulacao/caixa/progresso-93.md`, `93-executora.md` | progresso e relato |

## 1 · O conserto

Com a linha mapeada em mãos, o script procura a âncora (a mesma regra do portão: o trecho entre
crases mais próximo que não seja citação nem só número, comparado pelo miolo antes do parêntese) na
janela de ±3 dela:

- se a própria linha mapeada tem a âncora, fica;
- se **uma só** linha da janela tem, grava essa;
- se **duas ou mais** têm e a mapeada não, **não escolhe**: deixa a mapeada e avisa. Escolher a mais
  próxima seria a busca que o `L65` proíbe (âncoras como `if` repetem sem parar).

Sem âncora na janela, deixa a mapeada e quem reclama é o portão. Citação de intervalo (`:a-b`) anda o
mesmo tanto nas duas pontas.

**`--tudo`** passa também pelas citações de arquivo que não mudou (acha o arquivo pelo nome em `src/`
e `scripts/`, como o portão; nome repetido fica de fora). Sem `--tudo` o script continua só nos
arquivos do diff, como antes, mas agora endireita as tortas que encontrar neles.

**Um efeito colateral bom, medido:** a segunda passada do `--tudo` sobre o mesmo diff não commitado
(o caso (b) da conferência do próprio script, que em 12/09 quebrou 39 citações) mapeou uma citação de
`artes-grid.ts` duas vezes e a âncora a trouxe de volta: "0 movidas (1 endireitada)". Não conto com
isso como proteção: vale só quando a âncora é única na janela.

## 2 · A prova, pelos três sentidos

`scripts/test-reapontar.mjs` monta, numa pasta descartável, um repositório com um arquivo de código,
um `docs/simulacao/ESTADO.md` e um `scripts/test-procedencia.mjs` reduzido ao `ALVOS`, e roda o
script de verdade lá dentro. Nada do repositório real é lido nem escrito. Três citações: uma torta
(aponta 7, a âncora está em 6), uma certa (9) e uma ambígua (aponta 13, a âncora está em 12 e em 14).

| cenário | esperado | script novo | script de HEAD |
|---|---|---|---|
| diff de +2 linhas no topo | torta 8 · certa 11 · ambígua 15 | **igual** | torta **9** (levada torta) |
| `--tudo`, sem diff | 6 · 9 · 13 | **igual** | **7** · 9 · 13 |
| `--tudo` de novo | 6 · 9 · 13 | **igual** | (herda a anterior) |
| sem diff, sem `--tudo` | 7 · 9 · 13 | **igual** | igual |

Novo: **exit 0**, 6 de 6. **Controle negativo**, o script de `HEAD` pelo `--script`: **exit 1**, 3
falhas. A certa e a ambígua passam com os dois, e é o certo: nenhuma das duas depende do conserto, e
as duas são o que prova que o conserto não mexe no que não devia.

## 3 · A varredura do repositório

Antes, `git status` dos 15 documentos do `DOCS`: todos limpos. `lore/` não está no `DOCS` e não foi
tocado. Depois, `node scripts/reapontar.mjs --tudo`:

**107 citações mudaram, 106 endireitadas pela âncora** (a outra só andou o diff do comentário de
`artes-grid.ts`). Por documento: `L-simulacao-simultaneo.md` 73, `CONJURACAO.md` 11, `Grid_Mobile.md`
6, `REVISORA.md` 4, `CATALOGO.md` 2, `CONTEXTO.md` 2, `ESTADO.md` 2, `VOZ.md` 2, `Migracao_Dominio.md`
2, `Auditoria_Tecnica.md` 1, `B-bestiario.md` 1, `K-combate-linha-do-tempo.md` 1. Deslocamentos: −1
em 50, +1 em 29, +2 em 15, +3 em 3, −3 em 2 (e 8 de `artes-grid.ts`, entre diff e âncora).

O −1 é o caso comum: a citação apontava a primeira linha do corpo, e a âncora é o nome da função, uma
linha acima. Conferi uma amostra (uma a cada treze) lendo a linha antiga, a nova e a âncora; todas
caíram na linha que tem a âncora, por exemplo `L-simulacao-simultaneo.md:349`, `const cd =
somarCondicoes`, de `grid.astro:10037` (que é `const fer = tierDe(...)`) para 10036.

**10 ficaram, ambíguas, e o script as avisou:** `ESTADO.md:790` (`for`), `L-simulacao-simultaneo.md`
:68 e :812 (`COURACA`), :71 (`eq`), :659 (`dist`), :1188 (`paradasSubLado`), :1698 e :2454 (`if`),
:3829 (`vozStatus`), `Grid_Mobile.md:177` (`body.grid-mob`). Cada uma tem a âncora duas vezes na
janela e nenhuma na linha citada. Reapontar exige ler o que a citação afirma. Não fiz: não é do
despacho, e a escolha é justamente a que o script se recusa a fazer.

Segunda passada: nada se move. `validate` exit 0, "293 citações de código conferidas".

## 4 · A janela do portão (medida, não mexida)

Numa cópia do `test-procedencia.mjs` no scratchpad, só com a `JANELA` trocada e já depois da
varredura:

| `JANELA` | citações vermelhas hoje |
|:--:|:--:|
| 3 (a atual) | 0 |
| 2 | 0 |
| 1 | 3 |
| 0 | 10, exatamente as 10 ambíguas acima |

Minha leitura: com o `reapontar.mjs` endireitando, a folga do portão deixou de propagar desvio, e
encolhê-la hoje só acenderia as 10 ambíguas. Ela continua servindo para o que foi escrita (o
comentário acrescentado logo acima de uma linha citada). Não recomendo mexer.

## 5 · O comentário

`aguentouFicarParado` agora diz que, no ramo de ficar parado, a `oferecerSaida` só coleta e rola, e
que no ramo de tentar sair ela ainda decide sozinha, contra `difMetade` e `difNada`.

## O incidente da `.git/config`, causado por mim

**Na primeira tentativa de commit, o `test-reapontar.mjs` estragou a configuração compartilhada do
repositório, por uns dois minutos (de ~17:53 a 17:55:34).** Dentro do `pre-commit`, o processo nasce
com `GIT_DIR` e `GIT_WORK_TREE` apontando para o repositório real e para a pasta de validação, e essas
variáveis vencem o `cwd`. O `git init` e o `git config core.autocrlf false` "da árvore de mentira"
gravaram, na `.git/config` REAL, `core.worktree` (a pasta de validação, apagada logo depois) e
`core.autocrlf = false`. Nesse intervalo, todo `git` desta árvore via uma worktree que não existia:
o meu commit saiu "nothing to commit", e `git status` respondia "must be run in a work tree".

É a mesma armadilha do `L73`, escrita em `test-rodada.mjs:45-69`. Eu não li aquele teste antes de
escrever este.

**Conserto:** `git config --local --unset` das duas chaves, às 17:55:34. As duas eram minhas: estavam
depois de `hooksPath`, na ordem em que o teste as escreve. Reflog intacto (topo `e8a3411`, commit do
Arquiteto das 17:47), índice real só com os meus três arquivos novos, e nenhum commit do teste nos
objetos soltos (`git fsck --dangling`: os commits soltos de hoje são todos `WIP on main`, de stash).
O Arquiteto foi avisado na hora.

**O teste agora** roda o `git` e o script testado com um ambiente sem nenhuma variável `GIT_*` (menos
`GIT_EDITOR`), e ganhou uma asserção: a `git config --local` de quem chamou o teste tem de estar igual
no fim. **Provado sem arriscar o repositório real**, com um repositório falso no scratchpad e o
ambiente do gancho simulado (`GIT_DIR`, `GIT_WORK_TREE` e `GIT_INDEX_FILE` apontando para ele):

- teste novo: exit 0, e a config do falso continua limpa;
- **controle**, a versão anterior do teste (a que estava no índice) no mesmo ambiente: exit 1, e o
  falso ganhou `core.worktree` e `core.autocrlf`, exatamente como no incidente.

## Portões

`npm run validate` exit 0 (`test-reapontar` dentro dele). O commit toca `src/` só num comentário:
o gancho roda o `tsc`; não rodei `build`.

## Em aberto

As 10 citações ambíguas, para reapontar à mão numa rodada que peça isso.
