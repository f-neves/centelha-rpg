# Rodada 02 · aviso à revisora

## COMMIT

O código a revisar:

```
56d52f4866e50bcb1273bdc218bf46ed29f96601
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

## O QUE MUDOU

**Antes do inventário, os três itens da `01-revisora.md`.** Na hora de ler a
resposta o HEAD era `80d5db7`, nove commits depois do avisado (`278b2b0`).
Conferido com `git diff --stat 278b2b0..80d5db7`: os nove tocaram `Pendencias.md`,
`02-projeto-harness.md`, a caixa e os scripts do `duo`, e **nenhum tocou
`09-bateria-grande.md` nem `scripts/sim/`**. Os três itens valiam inteiros sobre o
HEAD, e foram tratados sobre ele.

- **BLOQUEIA · o placar não saiu do commit carimbado: CONFIRMADO, e era pior.**
  A bateria refeita no HEAD (`bmtlw3e2r`, mesmo `dados_hash` `36ff54d18bb95d9a`
  da `0dc62a4`) dá 4.825.078 re-projeções, e não as 4.409.780 do placar. Rastreei
  a origem: o placar entrou no `09` no commit `2df566f`, antes de `sinais.mjs`
  existir; o agregador daquele commit, rodado sobre os dados de hoje, também dá
  4.825.078; e **nenhuma das seis baterias guardadas em `.sim/` produz
  4.409.780** (nem contando só a fase de combate, que dá 4.642.793, nem só o mapa
  apertado, que dá 2.403.983). O placar foi transcrito de uma execução que não
  existe mais. O conserto está em `09` §4 (placar novo, copiado de arquivo
  versionado, com linha) e no `--gravar` do agregador, que é o que impede a
  repetição;
- **BLOQUEIA · o `ocasião · passo` fora do placar: CONFIRMADO.** Ele está na
  linha 392 do agregado versionado e no placar novo da `09` §4, com o número
  (16.200 de 16.200 batalhas com distância têm Tick morto menor que Tick sem
  parada). A caixa da §4 diz, por escrito, que o placar anterior não o tinha e por
  que isso importava;
- **CORRIGE · o `G` no denominador do mestre: CONFIRMADO.** A declaração à mão é
  gesto do jogador. As duas tabelas (`mesa` e `site`) agora saem com **dois
  denominadores**: o trabalho do MESTRE, que não muda com `G` (11,4% com piso e
  20,0% com teto, com qualquer `G`), e o trabalho da MESA, sobre o qual a fração
  cai (8,1% a 6,2%). O `Pendencias.md` L24 e o `custo-tela.mjs` acompanharam. E a
  mesma troca estava na `09` §2.5, no sentido inverso ("33,6% do trabalho da
  mesa"), e virou "do mestre";
- **PERGUNTA:** nada a responder.

| arquivo | o que mudou nele |
|---|---|
| `scripts/sim/agregar.mjs` | ganhou `--gravar <arquivo>` (a saída inteira vai também para um arquivo) e um bloco novo com as tabelas que estavam em `node -e`: os três pedaços nos dois modos de rolagem, o cacho, as economias no modo `site`, a escada, o `G` com dois denominadores e o resíduo por tamanho de cena; com uma trava que para o script se a recontagem no modo da bateria não bater com os gestos do log |
| `docs/simulacao/resultados/09-bmtlw3e2r.txt` | novo · a saída inteira do agregador sobre a bateria `bmtlw3e2r` (commit `80d5db7`, `dados_hash` `36ff54d18bb95d9a`), 407 linhas, versionada |
| `docs/simulacao/09-bateria-grande.md` | cabeçalho aponta o agregado versionado; §2.4 reescrita com os dois denominadores nas duas tabelas do `G`; §2.5 "trabalho da mesa" virou "do mestre"; §4 placar novo com os onze sinais, procedência por linha, e uma caixa dizendo que o anterior estava errado e por quê; §8.2 item 3 corrigido; §9 documenta o `--gravar` |
| `scripts/sim/custo-tela.mjs` | o comentário do custo da declaração à mão diz que o relatório publica dois denominadores |
| `Pendencias.md` | L24 reescrito com os dois denominadores e a lacuna do `declarar` por lado; L27 pela metade (a linha do `.gitignore` saiu, a pasta está presa por outro processo); L28 novo (o alarme do E4 inerte é o único sem teste) |
| `.gitignore` | as cinco linhas de `centelha-revisora/` saíram (L27) |

## O QUE ESTE RELATÓRIO AFIRMA

Todos os números abaixo estão em `docs/simulacao/resultados/09-bmtlw3e2r.txt`
(`R:` é linha nele) e, quando publicados, na `09` (`09:` é linha nela). O arquivo
é a saída de:

```
node scripts/sim/bateria.mjs --saida .sim/conferencia
node scripts/sim/agregar.mjs --saida .sim/conferencia --gravar <qualquer>.txt
```

no commit `80d5db7`, cuja árvore de `scripts/sim/motor.mjs`, `log.mjs`,
`bateria.mjs`, `cena.mjs` e `elenco.mjs` é idêntica à do commit avisado (só
`agregar.mjs` e `custo-tela.mjs` mudaram, e o segundo só em comentário). Refeito
no commit avisado, o arquivo tem de sair **idêntico, exceto a linha 2** (o
`run_id` e o commit da bateria). Os números que já estavam publicados (552.102,
359.733, 184.034, 1.095.869, 218.679, 125.237, 204×, 48 de 96) saíram idênticos
na bateria refeita, e não os repito na tabela.

| número | o que é | de onde sai |
|---|---|---|
| 4.825.078 | re-projeções nas células com distância (o placar) | `R:387` · `09:742` |
| 26.889 · 15.498 · 202.230 · 42.278 | fugas · redirecionamentos · raspões · Ticks em que algo caiu sem consultar ninguém | `R:388` a `R:391` · `09:743` a `09:746` |
| 16.200 de 16.200 | batalhas com distância em que o Tick morto é menor que o Tick sem parada (o `ocasião · passo`) | `R:392` · `09:747` |
| 98% · 99% | fuga-consumada em `coprimo-encostado-2x8`, apertado e aberto (o único sinal aceso) | `R:396` · `09:751` |
| 727.801 · 66,4% | trabalho do mestre no modo `site`, e a fração do de hoje | `R:165` · `09` §2.5 |
| 33,6% | o que a troca de modo tira do trabalho do mestre | `R:166` · `09:531` |
| 64.209 · 17,8% · 2,87 | Ticks com ao menos um golpe · fração dos Ticks · golpes por Tick que tem golpe (o cacho) | `R:169` e `R:170` · `09` §2.5 |
| 34,9% · 65,1% | cartões absorvidos pela parada do avanço · cartões que sobram | `R:171` · `09` §2.5 |
| 17,2% · 8,8% · 26,0% | economias no modo `site` com piso: só o avanço · só o cartão · os dois | `R:175` · `09` §2.5 |
| 30,0% · 8,8% · 38,9% | as mesmas, com teto | `R:176` · `09` §2.5 |
| 538.355 · 49,1% | o que sobra depois do avanço unificado (piso) | `R:181` · `09` §8.2 |
| 418.530 · 38,2% | o que sobra depois da folha resolver sozinha (o resíduo) | `R:182` · `09` §8.2 |
| 234.496 · 56,0% e 184.034 · 44,0% | a composição do resíduo: ⏭ que param · `aplicar` (e a soma fecha, `✓ fecha` impresso) | `R:183` · `09` §8.2 |
| 61,8% | o teto do que o projeto tira do mestre (a `09` arredonda para 62%) | `R:184` · `09` §8.2 |
| 11,4% · 20,0% | economia do avanço sobre o trabalho do MESTRE, modo `mesa`, com qualquer `G` | `R:188` · `09:435` a `09:437` |
| 1.552.533 · 8,1% · 14,1% | trabalho da MESA com `G = 2`, e as economias piso e teto sobre ele | `R:191` · `09:436` |
| 2.009.197 · 6,2% · 10,9% | o mesmo com `G = 4` | `R:192` · `09:437` |
| 17,2% · 30,0% | economia do avanço sobre o trabalho do MESTRE, modo `site`, com qualquer `G` | `R:193` · `09:473` e `09:474` |
| 1.184.465 · 10,6% · 18,5% e 1.641.129 · 7,6% · 13,3% | trabalho da MESA no modo `site` com `G = 2` e `G = 4`, e as economias | `R:196` e `R:197` · `09:479` e `09:480` |
| 32 · 42 · 58 | resíduo por batalha em 1v1 · 3×3 · 2×8 (44 · 39 · 30 Ticks; 23 · 23 · 28 ⏭ que param; 9 · 19 · 30 `aplicar`) | `R:201` a `R:203` · `09` §8.2 |
| 4.642.793 · 2.403.983 | re-projeções só da fase de combate · só do mapa apertado (as duas hipóteses para o 4.409.780, e nenhuma bate) | `node -e` sobre `.sim/conferencia`, declarado; não está em script porque é diagnóstico de um número que saiu do documento |

**Uma afirmação sobre ausência, que é a mais fácil de errar:** "nenhuma das seis
baterias guardadas em `.sim/` produz 4.409.780". O `.sim/` não é versionado, então
você não tem como refazer essa conferência; o que você tem como conferir é que o
commit avisado produz 4.825.078, e que 4.409.780 não aparece em nenhum script nem
em nenhum arquivo versionado além da caixa da `09` §4, que o cita como o erro.

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D05 | o placar da `09` §4 é um **trecho copiado** do agregado versionado, com o número da linha, e não um arquivo gerado com `--check` no build | pode desalinhar de novo se alguém refizer a bateria e não recopiar. A alternativa (gerar e conferir no build) exigiria o `.sim/` no build, e ele não é versionado. A referência de linha é o que torna o desalinhamento visível em um `diff` |
| D06 | o `--gravar` grava a **saída inteira** do agregador, texto de terminal, e não um markdown estruturado | 407 linhas sem estrutura, um arquivo por bateria publicada, e a `09` cita linha em vez de âncora. Em troca, é a mesma saída que o humano lê, sem segunda versão para desalinhar |
| D07 | a banda do `G` publica **os dois denominadores** e a fração do mestre é a manchete (11,4% não muda com `G`) | a tabela tem cinco colunas e é mais lenta de ler. E o cenário "o mestre declara os NPCs à mão" continua fora da conta, porque o log não separa `declarar` por lado |
| D08 | o bloco novo do agregador **para o script** se a recontagem no modo da bateria não bater com os gestos que o log somou | `agregar.mjs` sai com 1 no dia em que `custo-tela.mjs` mudar sem o `log.mjs` acompanhar. É de propósito: as duas tabelas discordando seria o número publicado saindo de uma e o denominador de outra |
| D09 | o L27 saiu **pela metade**: a linha do `.gitignore` saiu, a pasta ficou | uma pasta vazia na raiz, presa por outro processo, que o `.gitignore` já não esconde. Se algo aparecer dentro dela a árvore fica suja e o `npm run rodada` recusa, que é o comportamento alto que o L27 queria. Apagá-la é de quem tiver o terminal aberto nela |
| D10 | o alarme do E4 inerte virou pendência (L28) em vez de ir para `sinais.mjs` nesta rodada | mais uma rodada com um alarme sem teste. Movê-lo exige o mesmo par de casos dos outros onze e eu preferi não misturar com a rodada que trata a revisão |

## O QUE FICOU EM ABERTO

- **⚠ PRECISA DO HUMANO · o L26**, inalterado: *por que a mesa rola o dado na
  mão?* e *com que frequência há efeito de chão ativo numa cena?*;
- **⚠ PRECISA DO HUMANO · quem declara o NPC na mesa: o mestre à mão ou o robô?**
  Não é regra de jogo, é uso da mesa, e decide se parte dos `G` gestos volta para o
  mestre. A `09` §2.4 publica os dois denominadores assumindo que TODA declaração
  manual é de jogador; se o mestre declarar os NPCs à mão, a economia dele cai
  para algum ponto entre 11,4% e a fração da mesa. Nenhuma regra foi decidida por
  mim aqui: a conta está escrita com a premissa explícita;
- **o `declarar` por lado no `log.mjs`**, que é a medição que fecharia o item
  acima. Não fiz nesta rodada: mexe no log, e mexer no log obriga a bateria
  inteira de novo (D34);
- **o 4.409.780 não tem origem encontrada.** Rastreei o commit em que entrou e as
  seis baterias guardadas, e nenhuma o produz. Declaro como não explicado, e não
  como "veio de uma execução anterior", porque não tenho a execução;
- **L27, a segunda metade:** a pasta `centelha-revisora/` da raiz está presa por
  outro processo e vazia;
- **L28:** o alarme do E4 inerte é o único fora de `sinais.mjs` e sem teste;
- **o L25, L20, L22, L23 e L24**, no `Pendencias.md`, como antes.

## ONDE LER

1. `docs/simulacao/09-bateria-grande.md` · §4 (o placar novo e a caixa que diz
   por que o anterior estava errado), §2.4 "E com jogador na mesa?" e "O
   denominador importa" (os dois denominadores), §9 (o `--gravar`);
2. `docs/simulacao/resultados/09-bmtlw3e2r.txt` · linhas 160 a 203 (as tabelas
   que estavam em `node -e`) e 385 a 396 (o placar);
3. `scripts/sim/agregar.mjs` · o bloco "AS CONTAS DA §2.4, DA §2.5 E DA §8.2" e o
   `--gravar`, logo no início;
4. `Pendencias.md` · L24, L27 e L28.
