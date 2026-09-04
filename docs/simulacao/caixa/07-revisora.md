# Rodada 07 · resposta da revisora · alcançabilidade da fase 1

Sem diff a revisar nesta: a rodada é a varredura de alcançabilidade pedida para a
fase 1. **Tudo aqui foi medido em `2b14bae`.** O `3fd805a`, que já está no `main`,
não foi revisado nem medido: ele mexe em `grid.astro`, então os números de tela
deste documento valem para o commit anterior a ele.

**A auditoria que eu li** é `Grid_melhorias.md:221`, seção *"O que a névoa ainda não
faz"*, linhas 223 a 235: é a única lista de **exatamente seis** ausências de tela no
repositório, e cai em cima da "vista do jogador" que a fase nomeia. Se a auditoria
for outra, é uma linha para me dizer e eu refaço.

Método: bancada com `nevoa=1` nos dois papéis, Edge sem cabeça, e o banco de mentira.
Onde a bancada não alcança, está escrito que a evidência é leitura, e de onde.

---

## BLOQUEIA

### 1 · A bancada não consegue falsificar NENHUMA das seis, e é isso que a fase 1 precisa

Com a névoa ligada, medido na cadeira do jogador (`&nevoa=1&papel=jogador`):

| o que se vê | com névoa | esperado se o corte existisse |
|---|---:|---|
| peças no tabuleiro | **12 de 12** | só as de casa clara |
| nomes na coluna "Em campo" | 12 | 12 (é o que a auditoria afirma) |
| linhas na fila de iniciativa | **12** | só as de casa clara |
| casas cobertas desenhadas | 284 de 384 | 284 |

A névoa DESENHA (284 casas pesadas) e não CORTA. O motivo é o banco de mentira: o
`token_visao` do mock é cópia do que se escreveu (`mesa-mock.mjs:475`,
`{ arena_efeitos: 'efeito_visao', combatentes: 'combate_visao', arena_tokens:
'token_visao' }`), e a função `casa_clara` da migração 25 não existe ali. E o smoke
nunca cruza os dois: a cena do jogador roda com `nevoa=0` (`test-grid.mjs:1139`).

**Enquanto isto for assim, toda afirmação sobre a vista do jogador continua sendo
leitura de SQL**, e afirmação negativa lida é justamente onde esta frente mais errou.

**Conserto:** ensinar `casa_clara` ao mock. Não é conta nova: o `grid.astro`
(`3600-3623`) já faz a mesma em JS, com os mesmos três termos (pincel, olhos do
grupo, fogo e luz mais halo). Com ela, as seis viram testáveis e a cena do jogador
com névoa pode entrar no smoke.

---

## CORRIGE

### 2 · A quarta ausência está subdimensionada, e a metade que falta é a pior

A auditoria diz: *"a luz de um efeito vencido continua acesa até ele sair do
tabuleiro"*. O fim da vida do efeito. **Medido: o começo é pior.**

Brasa Retardada de Fogo, Velocidade 6, conjurada no canto mais escuro do mapa
(cena `bench=12&cols=24&rows=16&nevoa=1&tempo=simultaneo&espelho=1`):

| momento | painel do efeito | casas claras | casas pesadas |
|---|---|---:|---:|
| antes | vazio | 100 | 284 |
| **na declaração** | `montando · cai em 5 Ticks` | **112** | **272** |
| Ticks 1 a 4 | `cai em 4, 3, 2, 1 Tick` | 112 | 272 |
| Tick 5, a Arte sai | sem "montando" | 112 | 272 |

**Doze casas de escuro acesas por um fogo que ainda não existe, e acesas durante os
cinco Ticks inteiros do gesto.** O laço da névoa percorre `efeitosAtivos()` sem
filtrar nem `montando` nem `venceu` (`grid.astro:3620`), e o `casa_clara` do banco
lê `arena_efeitos` só por `arena_id` e `elemento in ('fogo','luz')`, sem `desde_tick`
nem `ate_tick` (`migracao-25.sql:65-73`).

**E não é só desenho.** É o `casa_clara` que decide quais peças o jogador recebe
(`token_visao`, `migracao-25.sql:87`). Então um fogo anunciado entrega ao grupo as
peças que estavam no escuro, cinco Ticks antes de o fogo cair. A janela é exatamente
a que a §5.3 existe para criar, e ela cresceu com o conserto de 04/09: quanto mais
lenta a Arte, mais tempo a lanterna fica acesa antes da Arte existir.

### 3 · As outras cinco, uma a uma, com duas correções de redação

| # | a afirmação | veredito | como se confere |
|---|---|---|---|
| 1 | "não é por jogador" | **verdade pela metade** | `casa_clara` não recebe usuário (só arena e névoa), mas o `token_visao` tem DUAS cláusulas por pessoa: `dono_do_personagem(...) = auth.uid()` e `criado_por = auth.uid()` (`migracao-25.sql:88-90`). A névoa é do grupo; **o que chega é de cada um**, porque a peça de cada jogador atravessa a névoa para o dono dela |
| 2 | "não conhece parede" | **verdade, e mais funda** | as duas contas usam raio, não visão: `hex_dist(...) <= visao` no banco, `perto(q, r, NEVOA.visao)` na tela (`grid.astro:3609`). E não há **onde** guardar uma parede: `mesa_arenas` tem `cols, rows, escala_m, fundo*, grade, nevoa, trilha, log, ativa` e nada mais, e nenhum dos 33 controles visíveis do mestre desenha parede ou terreno |
| 3 | "não distingue quem enxerga melhor" | **verdade** | o raio é `nevoa.visao`, da arena, e a tela aplica o mesmo a cada olho no laço de `olhosNoMapa()`. Medido também no formulário do "+ NPC": 16 campos abertos, **nenhum** sobre enxergar |
| 5 | "não esconde efeito de Arte nem marca de golpe" | **verdade, por leitura** | `efeito_visao` filtra `ativa`, `not oculto` e `eh_membro`, e não tem casa nenhuma na cláusula (`migracao-19.sql:100-108`). Não dá para medir na bancada pelo motivo do item 1 |
| 6 | "não esconde o nome na lista" | **verdade, e vaza mais que o nome** | a coluna sai do `combate_visao`, que filtra só `c.oculto = false and eh_membro(...)` (`migracao-27.sql:140`), sem arena e sem casa: junto com o nome vão `tick`, `iniciativa`, `grupo`, `retrato` e, conforme o `revelar` da mesa, o estado de Vida e as condições. A segunda metade da frase está certa: a fila some mesmo, porque `naFila()` filtra por `TOKENS[c.id]` (`grid.astro:4220`) |

Quatro das seis se sustentam como escritas. A 1 e a 6 precisam de uma linha a mais
cada, e a 4 é o item 2 acima.

### 4 · O caminho contrário: o que a tela oferece e o sistema não tem, e o oposto

Ninguém tinha feito a varredura da tela para o sistema. Medida, por papel:

| menu da peça | mestre | jogador |
|---|---:|---:|
| na peça **dele** | 10 itens | 6 itens (sem o ✚ Recuperar Vida) |
| em peça **alheia** | 10 itens | **2 itens** |

Os dois itens que o jogador tem sobre a peça de qualquer outro são
`◎ Mostrar alcance` e **`✖ Tirar Vida`**.

Do outro lado, o sistema tem o que a tela não oferece: `jogador_muda_peca`
(`migracao-22.sql:114-129`) aceita `pv_atual`, `mana_atual`, `condicoes` e `ativo`
de **qualquer membro da mesa** sobre qualquer peça, subindo ou descendo. Curar cabe
ali; o que não existe é o botão.

É a forma do L25 nas duas direções, no mesmo menu: **função escrita sem caminho na
tela** (o jogador curar) e **caminho na tela que a nota do próprio código diz não
ser dele** (o jogador tirar Vida). A decisão de qual das duas é a intenção está na
ESCALA, porque não é minha.

### 5 · A renormalização, escrita para colar · e por que não fui eu que colei

O `.gitattributes` conserta o checkout novo e não a árvore que já existe. Qualquer
clone ou worktree anterior a `c88b647` continua com CRLF no disco, com `git status`
limpo, e com os portões vermelhos. **Isso inclui a árvore da executora**: se ela não
estiver normalizada, os portões passam nela e falham em todo o resto.

O texto, pronto:

> **Se o `validate` acusar arquivo gerado fora de dia com `0 divergem`, a árvore é
> anterior ao `.gitattributes`.** O `eol=lf` só age no checkout, e arquivo que já
> estava no disco não é reescrito. Confira e conserte:
>
>     git ls-files --eol | grep -c "w/crlf"      # quantos ainda estão em CRLF
>     git ls-files --eol | grep "w/crlf" | sed 's/^[^\t]*\t//' | xargs rm -f
>     git checkout -- .
>
> O índice não muda e nenhum commit é criado: o que muda é o que está no disco.
> Aqui eram 377 arquivos, e o `grep -c` no fim tem de dar zero. Caminho com espaço
> ou acento escapa do `xargs` e sobra: aqui sobrou `legacy/Raças.txt`, que se apaga
> à mão. **`git checkout-index -a -f` não serve**: ele não reescreve arquivo que já
> está lá. É preciso apagar antes.

**Não escrevi isso no `README.md` da caixa de propósito:** ele é rastreado e mora
dentro da caixa, e o `test-duo.mjs` trata arquivo rastreado modificado aqui dentro
como resposta já commitada sendo editada, o que encerra o ciclo. Se o destino for o
`CLAUDE.md` da raiz, é fora da caixa e também não é meu. Fica aqui para a executora
levar para o lugar certo.

---

## PERGUNTA

### 6 · O K30 publicado hoje conta 27 Efeitos cumpridos. A conta é anterior ao achado da rodada 06?

`Pendencias.md:847` (no commit `3fd805a`) abre com **"A régua está cumprida para 27
dos 140 Efeitos e não para 19."** Pela medição da rodada 06 ela está cumprida para
**zero** pelo caminho novo, enquanto a marca não sobreviver ao `ATIVOS.push`: na
bancada a Prisão entra na declaração, e o painel diz "cai em 5 Ticks" no mesmo
quadro.

E o mesmo commit corrige o número por dentro, de 44 para 27, no comentário da
`saidaDaArte` (`artes-grid-mesa.ts`), **sem tocar a linha 1225**, que é onde a marca
morre. A correção de contagem entrou; a de ligação, não.

Se o texto do K30 foi escrito para o mundo depois do conserto da marca, ele vira
verdadeiro no momento em que ela sobreviver, e é só uma questão de ordem, que vale
dizer no próprio item. Se foi escrito como estado de hoje, há um número publicado que
a medição contradiz, e ele está no índice que a frente inteira lê.

---

## ESCALA

### 7 · Quem pode tirar Vida de quem, na mesa de verdade

O código diz as duas coisas, em três linhas de distância:

    grid.astro:6442   // O que é da mesa (curar, adiantar o relógio, mexer na
                      // ordem, tirar do mapa) continua sendo do mestre.
    grid.astro:6448   MESTRE ? item('curar', '✚ Recuperar Vida') : '',
    grid.astro:6449   item('dano', '✖ Tirar Vida'),

A linha 6449 não tem `MESTRE` e não tem `meu`. E o sistema concorda com ela:
`jogador_dano` (`migracao-22.sql:136-149`) confere só se quem pede é membro da mesa,
e desce a Vida de qualquer peça daquela mesa. **Um jogador tira Vida do personagem de
outro jogador**, e o `✕ Desfazer` está escondido para ele e visível para o mestre
(medido, inventário do item 4).

Isto é permissão de escrita entre pessoas numa mesa de verdade, e a fase 1 vai
desenhar a vista do jogador em cima de uma das duas leituras. As opções, com o custo:

| | o que fica | custo |
|---|---|---|
| **A · a nota está certa** | o `✖ Tirar Vida` ganha `MESTRE ?`, como o `✚`; o jogador aplica dano só pelo ⚔ Ataque, que passa pela régua | tira do jogador o caminho de lançar dano de fora do combate (queda, veneno, fogo de cena) sobre a própria peça, que hoje ele tem |
| **B · a linha está certa** | a nota se corrige, e o `✚ Recuperar Vida` desce para o jogador também, já que o `jogador_muda_peca` aceita | a mesa passa a confiar em todo mundo para os dois lados; a cura sem rolagem vira um botão a mais na mão de quem joga |
| **C · o meio** | os dois só na **própria** peça (`meu`), como já é o ⚔, o ✦ e o ✶ | é a que mais mexe: hoje o jogador tira Vida de qualquer peça, e alguma mesa pode estar usando isso para marcar o dano do inimigo |

Não recomendo nenhuma: é a mesa que decide de quem é a mão.

---

## VEREDITO

**PARA**

Pela ESCALA, e o bloqueio do item 1 anda junto: enquanto o mock não souber a névoa,
a fase 1 não consegue provar nada sobre a vista do jogador, que é metade dela.
