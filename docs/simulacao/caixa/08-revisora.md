# Rodada 08 · revisora · as seis certas, e o registro do vazamento da névoa

Medido em `c32c066`, com a árvore renormalizada (0 arquivos em CRLF).

**Duas correções de rota.** A primeira é minha: as seis que eu varri na 07 eram as
da névoa, e as pedidas eram as da tabela **"Regras de combate sem tela"** ·
Investida, agir fora de hora, interpor e desviar, dívida de Ticks, mudar efeito
posto, condição na peça. Estão varridas aqui. A segunda é de lugar: o material da
névoa foi pedido **no 07**, e o 07 já está commitado (`c32c066`). Arquivo rastreado
modificado dentro da caixa é sujeira para o `duo.mjs` e encerra o ciclo, então o
registro completo está **repetido aqui**, inteiro, para a executora não precisar
cruzar dois documentos. Se preferir no 07 mesmo, é uma edição sua.

---

## A · O vazamento da névoa · registro completo, para consertar a partir dele

**A cena, para repetir:**

    /mesa/grid?id=00000000-0000-4000-8000-0000000000aa
      &bench=12&cols=24&rows=16&nevoa=1&tempo=simultaneo&espelho=1

Botão direito em **Herói 1** → `✶ Arte` → `Fogo` → `● Brasa Retardada` → Volume `+`
três vezes → campo Velocidade (`#ag-vel`) em **6** → `Conjurar` → clique na casa
mais distante de toda peça (759 px da peça mais próxima, canto escuro do mapa).

**As duas contagens, no mesmo quadro** (`#gr-nevoa`, 384 casas = 24 × 16):

| momento | painel do efeito | `.nv-clara` | `.nv-pesada` |
|---|---|---:|---:|
| antes de conjurar | vazio | 100 | 284 |
| **declaração, Tick 0** | `Brasa Retardada de Fogo 🔥 Em chamas · montando · cai em 5 Ticks` | **112** | **272** |
| Tick 1 | `cai em 4 Ticks` | 112 | 272 |
| Tick 2 | `cai em 3 Ticks` | 112 | 272 |
| Tick 3 | `cai em 2 Ticks` | 112 | 272 |
| Tick 4 | `cai em 1 Tick` | 112 | 272 |
| Tick 5, a Arte sai | sem "montando" | 112 | 272 |

**Doze casas de escuro acesas por um fogo que ainda não existe**, e acesas os cinco
Ticks inteiros do gesto. O painel e o mapa dizem coisas contrárias no mesmo quadro:
um diz que a Arte ainda está sendo montada, o outro já a trata como fogo no chão.

**Os dois lugares que precisam do mesmo filtro**, e são dois porque a conta é feita
duas vezes:

    grid.astro:3620      for (const e of efeitosAtivos()) {
                           if (e.elemento !== 'fogo' && e.elemento !== 'luz') continue;
                           for (const h of (e.hexes || [])) perto(h.q, h.r, NEVOA.luz);
                         }
      · não filtra `montando(e, t)` nem `venceu(e, t)`

    migracao-25.sql:65   or exists (select 1 from arena_efeitos e, ... h
                           where e.arena_id = p_arena
                             and e.elemento in ('fogo', 'luz')
                             and hex_dist(...) <= coalesce((p_nevoa->>'luz')::int, 2))
      · não tem `desde_tick` nem `ate_tick` na cláusula

**Por que não é só desenho.** É o `casa_clara` que decide quais peças o jogador
recebe (`token_visao`, `migracao-25.sql:88`). Um fogo anunciado num corredor escuro
entrega ao grupo as peças que estavam lá dentro, e entrega **cinco Ticks antes de o
fogo cair**. É a informação que a névoa existe para negar, chegando pelo gesto.

**O que eu NÃO medi, e é honesto dizer:**

- **a metade que a auditoria já nomeava** (a luz de um efeito vencido continua
  acesa): não deixei nenhum efeito vencer, então o `venceu` é leitura do mesmo laço,
  não medição. O filtro que conserta um conserta os dois;
- **o lado do jogador**: o `token_visao` do mock é cópia da escrita e não conhece
  `casa_clara`, então a entrega de peças não é observável na bancada. É o bloqueio
  que já foi para você.

---

## B · A forma de erro que esta frente ainda não tinha catalogado

**Um conserto correto abre um buraco em outro lugar, porque ele muda a DURAÇÃO de um
estado que outra parte lê sem saber que ele existe.**

O caso, inteiro:

1. antes de 04/09, a Arte era gravada e resolvia na declaração. O estado "efeito
   agendado e ainda não saído" existia por um instante;
2. o conserto da §5.3 está certo e faz o que promete: o efeito passa a existir
   **agendado durante todo o Preparo**, cinco Ticks numa Velocidade 6;
3. a névoa lê `arena_efeitos` sem filtro de Tick, porque **quando ela foi escrita o
   estado agendado quase não durava**. A premissa nunca esteve escrita em lugar
   nenhum: ela estava embutida no tempo que o estado durava;
4. o conserto não tocou a névoa e mesmo assim abriu nela uma janela de cinco Ticks.

**O que a distingue das outras formas já catalogadas.** O zero ambíguo é sobre um
valor que se parece com outro. O L25 é sobre uma coisa escrita que ninguém alcança.
Esta é sobre **um estado cuja duração era pequena demais para alguém reparar que
estava lendo errado**, e o conserto correto é o que a torna visível. O culpado não é
o conserto; é o leitor que nunca declarou a premissa.

**Como se procura, e é mecânico:** quando um conserto alonga a vida de um estado
intermediário, varra quem lê a mesma tabela ou a mesma lista **sem filtrar por esse
estado**. Aqui: `grep` por `arena_efeitos` e por `efeitosAtivos()` e conferir, um a
um, quem chama `montando()` e `venceu()`. Dos leitores, a varredura de mordidas
filtra (`artes-grid-mesa.ts:1625`), o painel filtra os dois (`:422` o vencido e
`:430` o que está montando), e a névoa não filtra nenhum dos dois, nos dois lados dela.

---

## C · As seis "regras de combate sem tela", uma a uma

Método: bancada com `tempo=simultaneo&espelho=1`, menu aberto nas **doze** peças (o
menu muda com a fase, então a união é o que a tela oferece de verdade), e as caixas
abertas com os campos listados.

**A união dos itens do menu, nas doze peças:** `ataque, curar, dano, mana, arte,
outra, alcance, ordem, tirar, auto, abortar`. Duas ausências têm explicação e não são
achado: `esperar` só aparece para quem tem contrapé (`grid.astro:6459`), e nenhuma
peça da bancada tinha; `encerrar` some no Simultâneo, porque o relógio é da cena.

| # | a regra | tem tela? | passos | campos abertos | travados |
|---|---|---|---|---|---|
| 1 | **Investida** | **meia, e no lugar errado** | 4, e fora do Grid | `cc-defesa` (a marca à mão) | o +1d6 e a distância não existem |
| 2 | **Agir fora de hora** | **não** | · | · | · |
| 3 | **Interpor e desviar** | **sim, e sem sistema atrás** | 2 | `ab-metros`, 3 rádios | por quem se interpõe: campo nenhum |
| 4 | **Dívida de Ticks** | **não** | · | · | · |
| 5 | **Mudar efeito posto** | **um controle só, destrutivo** | 1 | nenhum | tudo, menos apagar |
| 6 | **Condição na peça** | **sim, e não é a do tabuleiro** | 3 e uma troca de aba | 5 no formulário | no Grid, a marca é só desenho |

### 1 · Investida · a regra tem três metades e a tela tem meia

A régua está escrita com números (`regras.json:2356`): **+1d6 de dano**, **Defesa −2
além do que o Preparo cobra**, e o golpe **cobre a distância da Corrida** em vez da
de Batalha.

- **No motor: nada.** A palavra aparece uma vez em `combate-tempo.ts:804`, dentro de
  um comentário sobre travessia. Não há função, não há campo, não há teste;
- **No Grid: nada.** Na caixa de declaração de ataque, medido, o seletor
  `#dc-mov-modo` tem **duas** opções (`Deslocamento de Batalha · 2 m/Tick` e
  `Corrida · 2 m/Tick`) e o `#dc-manobra` tem quatro (um golpe, uma arma em cada mão,
  segura a segunda, rajada). A palavra "investida" não aparece em lugar nenhum da
  tela do tabuleiro;
- **No rastreador: meia.** A caixa de condições traz **`⇨ Investindo def −2`** na
  lista, ao lado de `» Correndo def −4`. É a metade que não muda o golpe. O +1d6 e a
  distância da Corrida continuam sem caminho, e quem quiser a Investida inteira soma
  o dado na mão e não tem onde registrar que somou.

**O caminho, contado:** Grid → aba `⚔ Combate` → o cartão da peça → `.cond-btn` →
escolher `Investindo`. Quatro passos e uma troca de aba, para metade da regra.

### 2 · Agir fora de hora · L25 puro, e a tela nomeia o que ela não sabe fazer

`podeAgirForaDeHora` (`combate-tempo.ts:684`) e `custoDeReagir` (`:742`) estão
escritas, exportadas e testadas. **Os únicos chamadores são o teste**
(`test-combate-tempo.mjs:129-131`). Nenhuma tela chama nenhuma das duas: varri
`src/pages/` e `src/lib/` inteiros.

E há um detalhe que fecha o caso: abrir o `✋ Abortar` numa peça em Recuperação
imprime a mensagem do próprio motor (`combate-tempo.ts:723`):

> "Na Recuperação não há o que abortar, o golpe já saiu. O que cabe aqui é pagar:
> uma ação fora de hora, ou 1 Tick(s) por metro para se deslocar."

**A tela diz ao mestre o nome da ação que ela não tem botão para fazer.** As duas
saídas que a frase oferece: a primeira não existe em lugar nenhum, e a segunda
(deslocamento pago na Recuperação, o K20) também não, e as duas estão em
`Combate_Tempo.md:15.4` como as duas coisas que a mesa ainda não faz.

### 3 · Interpor e desviar · a tela colhe a intenção e o sistema não a recebe

**O caminho existe e é curto:** botão direito → `✋ Abortar`, **2 passos**. Medido:
o item aparece em **7 das 12** peças, e sempre nas que estão em Preparo, o que é a
regra se ensinando pela presença do botão, como o código diz.

A caixa (medida): três rádios · `desviar`, `mover`, `interpor` · e **um** campo
editável, `#ab-metros`. A conta aparece pronta: "0 Tick(s) investidos, perdidos · 5
Tick(s) do ciclo, devolvidos".

**E o que a escolha faz.** `abortarGesto` (`grid.astro:5667`) usa do retorno
`r.novoTick` e `r.frase`, e nada mais. A saída escolhida entra na **frase do
registro** e em nenhum outro lugar. Interpor-se é entrar na frente de alguém e levar
o golpe no lugar dele: **não há campo para dizer por quem**, e não há mecanismo que
redirecione golpe nenhum. Desviar é sair da linha do golpe: o que acontece é o
mesmo que em "mover", os metros vezes 1 Tick.

É a alcançabilidade respondendo o contrário do de sempre: o caminho existe, os passos
são poucos, e o que falta é o sistema do outro lado da caixa.

### 4 · Dívida de Ticks · a conta está pronta e não tem onde aparecer

`custoDeReagir(acao, tick, velocidadeDaReacao)` devolve `{ resta, total }`, que é a
dívida: o que a reação custa e o que sobra para pagar depois. Ninguém chama, fora o
teste. A palavra "dívida" não aparece na tela do Grid (varredura do `innerText`
inteiro), e a única aritmética de Tick que a tela mostra é a do abortar (perdidos e
devolvidos) e o "+5 ticks" do `⏭ Agiu`.

### 5 · Mudar efeito posto · um controle, e ele é o destrutivo

Um efeito no chão tem, na coluna, exatamente **um** controle: o `✕` com o título
"Desfazer este efeito agora" (`artes-grid-mesa.ts:450`), e o painel liga handler só
em `[data-fim]` (`:455`). Não há como mudar duração, alvos, posição ou ângulo do que
já está posto: só apagar e conjurar de novo, o que custa a Mana outra vez e escreve
duas linhas no registro.

E a função existe: `jogador_muda_efeito` (`migracao-22.sql`) está escrita e
concedida, e o único uso dela hoje é interno, a escrita dos `mordidos` pela varredura
(`grid.astro:2628`). **Escrita, concedida, e sem caminho de produção.**

### 6 · Condição na peça · tem tela, e ela não é a do tabuleiro

**No Grid, a marca é desenho.** Medido: o chip da condição é um `<span>`, sem
`onclick`, com o cursor herdado do arrasto da peça (`grab`), e clicar nele não abre
nada. `condIconesHTML` (`grid.astro:4084`) produz um `title` e mais nada.

**No rastreador, existe inteiro.** Medido em `/mesa/combate`: 12 botões `.cond-btn`
(um por peça) e 4 `.cond-x` para tirar. A caixa traz o catálogo com o modificador de
cada uma (`⤓ Caído def −2/+2`, `⛓ Imobilizado ação −2`, `▩ Cobertura pesada def +4`,
`⇨ Investindo def −2`...), um campo de busca e um formulário de condição própria com
**cinco campos abertos**: `cc-nome`, `cc-dados`, `cc-defesa`, `cc-rodada`, `cc-nota`.

**Então a afirmação da tabela precisa de uma palavra:** não é "sem tela", é **"sem
tela no tabuleiro"**. Da peça no Grid até pôr uma condição nela são três passos e uma
troca de aba, e a volta é outra troca. Numa mesa em que a luta acontece no Grid, é o
mesmo custo de não ter.

---

## BLOQUEIA

nada. O vazamento da névoa é grave e já está com você para conserto; o registro do
§A é tudo o que eu medi, e o §B diz onde procurar os irmãos dele.

## CORRIGE

1. **A tabela "Regras de combate sem tela" precisa de três correções de redação**,
   todas do §C: a Investida tem meia tela no rastreador (a marca `Investindo`, com o
   −2 e sem o +1d6); interpor e desviar **têm** tela, curta, e o que falta é o
   sistema atrás dela; condição na peça **tem** tela, e o que falta é ela estar no
   tabuleiro. As outras três (fora de hora, dívida de Ticks, mudar efeito posto)
   estão certas como escritas, e as três são a forma do L25.

2. **`jogador_muda_efeito` e as duas do fora de hora são o mesmo caso do L25**, e
   vale contá-las juntas quando a fase 1 for medir cobertura: função escrita,
   concedida ou exportada, e nenhum caminho de produção até ela.

## PERGUNTA

3. **A tabela da fase 1 tem sete linhas ou seis?** Eu varri as seis que você nomeou.
   Se a tabela tiver uma sétima que eu não vi (o deslocamento pago na Recuperação, o
   K20, é candidato: a própria mensagem do abortar o oferece junto com o fora de
   hora), ela entra na mesma varredura em uma rodada.

## ESCALA

4. **Segue aberto o item 7 da 07**, e é o único: quem pode tirar Vida de quem, com as
   três opções e o custo de cada uma. Nada novo desta rodada precisa de você.

## VEREDITO

**PARA**

Pela ESCALA que continua aberta. Tecnicamente nada aqui impede o conserto da névoa
nem a fase 1: o §A é acionável como está.
