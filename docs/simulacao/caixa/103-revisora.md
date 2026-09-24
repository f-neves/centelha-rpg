# Rodada 103 · veredito

Pino: `276bcad` (aviso), faixa `39a0de9..3c931fd`. Reancoragem pelo §0.1, com `HEAD` no primeiro
comando, como o aviso manda: o meu veredito da 102 (`5b51454`) estava no `origin/main`, e depois
`git switch -C revisora 276bcad`. Passo 0: toplevel é a worktree da Revisora, HEAD `276bcad587ad`,
`git branch --show-current` dá `revisora`, e a worktree estava limpa antes.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE.

- A folha cala para as 8 armas de arremesso.
- A classe que a folha recebe não deixa o mestre trazer a faixa inventada de volta (§2).
- O reapontamento está certo nas 12 citações que conferi, e três das 36 foram endireitadas por
  âncora, e não pelo diff (§4).
- **Uma ESCALA:** falta uma entrada na lista do item 4, a tabela publicada do capítulo de armas
  (§5).

## CI (§11)

Workflow `Validar dados e regras`:

- **`3c931fd` (o trabalho):** run `35967732472`, **`completed / success`**, 19 de 19 jobs verdes,
  lido às 04:15 (hora da máquina).
- **`276bcad` (o aviso):** run `35967837390`, `in_progress` na mesma hora. O commit só toca documento.
- **A base `39a0de9`:** run `35966877979`, `success`.

## 1 · O teste por texto fixo: cobre o que o rótulo diz, e a tela ficou só na medição

O teste tem duas metades de natureza diferente.

**A de função (conferências 1 a 3) é teste de verdade.** Ela importa o `alcance.ts` compilado e chama
`faixaNaFolha` e `alcanceInterpor`:

- as 8 armas a 4 m e além do máximo;
- a besta nas três situações;
- a adaga no Interpor a 11 m.

Rodei nesta árvore: verde, 16 ✓. Os controles negativos são os do relato (conserto desfeito só na
função, só na tela, e os dois), e **não os refiz**. Pelo que ele descreve, cada um derruba as
conferências que devia.

**A de tela (a 4ª) casa texto na fonte**, e tem as fraquezas da forma que o `CATALOGO.md` nomeia.
Ela fica verde, sem a folha calar, em pelo menos dois casos:

- **a linha fica, mas outra coisa decide depois dela:** o `avisoAlcance` passando a ler outro número
  que não o `fx`, ou o `fx` reatribuído abaixo;
- **o nome `classe` passa a ser outra coisa**, porque o regex casa o nome e não a origem.

E fica vermelha sem defeito a qualquer reescrita da linha (outro nome de variável, `dist` sem `!`).
Essa é a direção barata.

**O rótulo diz o que ela confere** ("a folha do Grid lê a faixa por `faixaNaFolha`, passando a classe
do ataque"), e o cabeçalho do teste declara "Esta é leitura de fonte". Não há promessa maior que a
conferência, então não é CORRIGE.

**O que só a medição prova:** que a caixa `al-aviso` some na tela para o arremesso (a adaga a 3, 4, 7,
15 e 30 m, e a azagaia, na `medicao-i12.md`). O smoke `test-grid` não cobre, porque a bancada não
tem peça com arma de arremesso. **Se um dia a bancada ganhar uma, é ali que a 4ª conferência vira
teste de tela.** Fica como observação, sem item.

## 2 · A classe que a folha passa: o mestre não traz a faixa de volta

A folha usa `const classe = classeAtq` (`grid.astro:10119`). Esse valor é o `classeAtqDe()` do
instante em que a folha abre, e ele é
`classeDeTempo(ra?.arma, ra?.velocidade, ra?.classe)` (`:10041`). O `classeDeTempo`
(`combate-tempo.ts:234-246`) **devolve a classe do catálogo sempre que a arma está nele, e ignora a
classe explícita.**

Medi com um script no scratchpad (`classe-folha.mjs`), que compila o `combate-tempo.ts` e o
`alcance.ts` e passa o que a ficha do lance escreveria em `ra.classe`:

| arma | classe marcada na ficha | classe que a folha recebe | `faixaNaFolha` a 7 m |
|---|---|---|---|
| `adaga-de-arremesso` | `distancia` | `arremesso` | `null` (cala) |
| `funda` | `distancia` | `arremesso` | `null` |
| "Adaga de Arremesso" (pelo nome) | `distancia` | `arremesso` | `null` |
| arma fora do catálogo | `distancia` | `distancia` | `null` (sem `distMax`, não há faixa a inventar) |
| `besta-pequena` | `arremesso` | `distancia` | a faixa da besta, que é a certa |

**E mais uma camada:** o aviso de alcance é calculado **uma vez, na abertura** (`:10158-10186`). O
`al-aviso` não é repintado por nada da ficha do lance. Uma correção de classe ou de arma feita no meio
da folha não mexe no aviso, em nenhum dos sentidos. Isso é anterior à rodada.

**Então nenhum caminho de jogo leva uma arma de arremesso do catálogo a mostrar a faixa inventada.** O
`faixaNaFolha` aceita uma combinação que a tela não produz: a arma de arremesso com classe
`distancia`. Um desenho que decidisse pela classe do catálogo da própria arma fecharia até essa
porta. É observação, sem defeito, porque ela não é alcançável.

## 3 · A funda e os dardos: calar não é perda contra a regra

**O `Arremesso.md:287-294`** diz que funda e propulsor "não são armas de arremesso: são
**alavancas**". Cada um traz um **multiplicador próprio**, que "entra **por último**, depois do peso,
da forma e do movimento". **A funda não tem alcance fixo:** o dela sai da mesma conta de quem joga,
multiplicada. Os dardos têm linhas próprias nas tabelas de alcance por Força de Arremesso
(`:205` e `:219`).

**O capítulo publicado dá número fixo às duas:** Funda 200 m e Dardos 30 m
(`armas-e-armaduras.md:91, 94`), o mesmo número do `armas.json`. Esse conflito é o I12 inteiro, e não
um caso especial da funda.

A folha calar para a funda é o mesmo que calar para a adaga: nenhuma das duas tem, na mesa, o número
da regra. **Não é achado.**

**Uma nota, para quem decidir o I12:** pelo `Arremesso.md`, a funda nem devia estar na classe
`arremesso`. Hoje isso não muda nada na folha, porque as duas classes calariam, mas é uma pergunta
que a decisão vai encontrar.

## 4 · O reapontamento: 36 trocas só de número, e três delas por âncora

**Nada além de citação mudou nos quatro documentos.** Um `git diff --word-diff` de `39a0de9` a
`3c931fd` mostra só pares `arquivo:linha` antes e depois. Não entrou edição alheia, então o caso
"pathspec protege ARQUIVO e não EDIÇÃO" não aconteceu aqui.

**Amostra contra o código novo: 12 citações, todas caem na âncora que o texto dá.**

- `alcance.ts`: `:65` (`faixaDeDistancia`), `:99` (`alcancaNoCorpoACorpo`), `:102`
  (`return hexagonos <=`), `:151` (`alcanceInterpor`), `:168` (`return alcancaNoCorpoACorpo`).
- `grid.astro`: `:10369` (`perfil: { ...REGRAS_CENA }`), `:10955` (o `rolarAcerto`/`linhas[0]`),
  `:11098` (`__TEXTO_OUVINDO`), `:11609` (`jogador_registra`), `:10622` (`CAMPOS_ALVO`), `:10735`
  (`campoAlvo = MESTRE`), `:12354` (`dialog[open]`).

**Três das 36 não vieram do diff.** O `grid.astro` só se desloca da linha 10156 em diante (a troca do
import, na 2467, tem o mesmo número de linhas). Mesmo assim, três citações anteriores a ela mudaram:

| citação | antes | agora | o que a linha nova é |
|---|---|---|---|
| L105, "o texto do `uiConfirmar`" | `:5466` | `:5465` | a chamada `uiConfirmar(`; o texto "Tick 0" continua na 5466 |
| L105, "o comentário ... diz o mesmo" | `:5487` | `:5486` | "A régua está em `derivados.iniciativa`"; o "o maior no Tick 0" continua na 5487 |
| L104, a lista lateral | `:6786-6791` | `:6788-6793` | começa no `<div class="gr-ficha`, e não no `const ficha` |

As três mudaram pelo endireitamento por âncora do `reapontar.mjs` (rodada 93, cabeçalho do script):
a âncora que o texto cita (`uiConfirmar`, `derivados.iniciativa`, `gr-ficha`) está uma ou duas
linhas acima ou abaixo. **Nenhuma ficou errada a ponto de o portão acusar**, que usa ±3. A primeira e
a terceira ficaram até mais precisas.

**A do meio ficou um pouco pior:** a frase diz que o comentário "diz o mesmo" (o Tick 0), e a linha
citada agora é a vizinha. O relato diz "pelo mapa do diff", e três não foram. Observação, sem
CORRIGE: nada no documento ficou falso fora da janela, e a mudança foi da ferramenta da casa
fazendo o que o cabeçalho dela promete.

## 5 · A lista do item 4: falta uma entrada, e é texto

Varri `src` e `scripts` por `distMax`, `alcanceDaArma`, `faixaDeDistancia`, `faixaNaFolha`,
`alcanceInterpor` e `alcanceLivreFrac`. Os consumidores de código são exatamente os da lista:

- `alcanceInterpor`, e quem o chama em `grid.astro:6617`;
- `ficha-engine.ts:1379-1380`;
- `equipamentos.astro:27, 86`;
- o `BestiaEditor`, o próprio `alcance.ts`, os dois esquemas e o tipo de `bestia-editor.ts:58`.

A lista de código está completa.

**O que falta é o capítulo publicado.** `armas-e-armaduras.md` mostra os mesmos números como
"Alcance", escritos à mão, e não lidos do dado:

- a linha da classe Arremesso: "alcance de 5 a 200 m conforme o objeto" (`:41`);
- as oito linhas do catálogo, da Funda (200 m) à Rede (5 m) (`:91-98`).

Ele não aparece na busca porque não lê `distMax`, mas é o lugar em que o jogador lê o número.
**Se o humano decidir que o máximo sai da Força de Arremesso, estas nove linhas mudam junto.**

Do outro lado, `acoes-corpo-e-movimento.md` (`:93`, `:112`) já publica tabelas de distância por
Força. É o conflito do I12 escrito nos dois capítulos.

**ESCALA:** acrescentar o capítulo à lista do item 4, que é a lista da decisão.

## 6 · Travessão, lendo os arquivos

Varri as linhas acrescentadas dos 12 arquivos da faixa, mais o aviso. Achei uma ocorrência, em
`103-executora.md:128`, e ela cita o caractere ao descrever a contagem. Não há travessão de prosa.
Controle positivo: `combate.md:35`.

## Limpeza

O script de classe ficou no scratchpad (`classe-folha.mjs`). Não buildei o site: o teste novo e o
script só leem. Não mexi em arquivo versionado. `git status --short` ao fechar: só os meus dois
arquivos da caixa.
