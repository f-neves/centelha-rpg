# Rodada 02 · resposta da revisora

Sobre o commit `56d52f4`, lido no checkout `7510511` (mesma árvore de código, mais o
aviso). Os três itens da rodada 01 foram tratados sobre o commit certo e do jeito
certo; o que segue é o que sobrou depois de atacar o relatório novo.

## BLOQUEIA

nada.

O que foi conferido antes de escrever isso, para que "nada" não seja preguiça:

- **aritmética do agregado versionado** (`resultados/09-bmtlw3e2r.txt`): os três
  pedaços somam o total nos dois modos (552.102 + 359.733 + 184.034 = 1.095.869;
  184.034 + 359.733 + 184.034 = 727.801, `R:162` a `R:165`); a escada desce por
  subtração exata (727.801 − 125.237 − 64.209 = 538.355; − 119.825 = 418.530,
  `R:179` a `R:182`); o resíduo fecha (234.496 + 184.034 = 418.530, `R:183`); as
  cinco linhas do `G` são `T + G × 228.332` e as frações batem em todas (`R:190`
  a `R:197`); o resíduo por cena soma (23 + 9, 23 + 19, 28 + 30, `R:201` a
  `R:203`); as 9.600 batalhas que terminam são 24 células coprimo × 400 no limiar
  de produção, e as 16.200 com distância são 21.600 × 3/4 (`R:3`, `R:392`);
  204× é 12,0588 / 0,0592 (`R:380`);
- **procedência**: cada linha `09:` citada no aviso existe e contém o número dito
  (`09:435` a `09:437`, `09:473` a `09:480`, `09:531`, `09:742` a `09:751`); o
  placar da `09` §4 é cópia literal de `R:386` a `R:396`;
- **identidade do código**: `git diff --stat 80d5db7 56d52f4 -- scripts/sim/`
  toca só `agregar.mjs` e `custo-tela.mjs`, como o aviso afirma. Motor, log, cena,
  elenco e bateria são os mesmos;
- **o `--gravar` captura tudo**: nem `agregar.mjs` nem `sinais.mjs` escrevem por
  `console.error` ou `process.stdout.write`, então o arquivo é a saída inteira;
- **a trava D08** compara a recontagem no modo da bateria com o `gestos` do log e
  sai com 1 se divergir (`agregar.mjs`, bloco novo). É o tipo certo de trava.

## CORRIGE

1. **O denominador da MESA conta as duas facções como declaradas à mão, e o
   texto publica isso como "com jogadores na mesa".** `agregar.mjs` faz
   `mesa = T[m] + G * decl` com `decl = sub('declarar')`, que são as 228.332
   declarações de TODAS as peças (`R:187`). Numa mesa comum os jogadores declaram
   o lado deles e o robô declara os NPCs, então só parte das 228.332 custa `G`.
   A banda de 6,2% a 8,1% (`09:435` a `09:437`, `09:440`) é o caso extremo em que
   toda peça das duas facções é de jogador. Para a mesa comum, a fração fica entre
   essa banda e os 11,4% do mestre (se as declarações se dividissem ao meio, seria
   9,5% com `G = 2` e 8,1% com `G = 4`; mas as células coprimo têm cadências
   distintas por lado, então o meio é ilustração, e não número). O aviso já viu
   metade disso ("o mestre declarando os NPCs à mão"); a outra metade é esta.
   **Conserto em dois tempos, e os dois são meus:** (a) agora, o parágrafo da
   `09` §2.4 diz que as linhas da mesa pressupõem as duas facções declaradas à
   mão, e que a mesa comum fica entre a linha da mesa e a do mestre; (b) na
   próxima bateria, `declarar` contado por lado no `log.mjs`, e a tabela ganha a
   linha "um lado à mão". D34 diz que a bateria inteira custa 37 segundos, então o
   custo real é o de re-gravar e re-apontar as linhas da `09`. **Junte com o
   L28** (E4 para `sinais.mjs`, que também muda a saída do agregador): uma
   bateria, um `--gravar`, uma passada de re-apontamento, em vez de duas.

2. **O `ocasião · passo` guarda o piso só por cima.** Ele acende quando
   `ticksMortos === semParada` em TODA batalha com distância (`sinais.mjs:139` a
   `141`), que é o `log.andou` solto. Se `andouNoTick` for marcado a mais (um
   passo declarado e não executado, um levantar do chão contado como andar), o
   Tick morto cai, o piso de 11,4% cai junto, e `difere` continua 16.200: o sinal
   fica calado. `log.mjs:233` mostra que `ticksMortos` só sobe com
   `!andouNoTick`, então a subcontagem é silenciosa. **Conserto:** o sinal
   espelho, com o mesmo par de casos de teste dos outros onze: numa célula em que
   nenhuma peça muda de casa na fase de combate, `fases.combate.ticksMortos` tem
   de ser IGUAL ao Tick sem parada em toda batalha. A candidata é
   `encostado-1v1` (as duas peças já adjacentes; a fuga é outra fase, `R:38`). Se
   o dado mostrar que ali o morto é menor que o sem parada, alguma coisa anda em
   combate encostado, e isso por si já é um achado para escrever antes de publicar
   o sinal.

3. **O arquivo gravado carimba o commit da BATERIA, e não o do agregador que o
   escreveu.** A linha 2 sai de `manifesto.commit` (`agregar.mjs:84` e `85`,
   preenchido em `bateria.mjs:80`) e diz `80d5db7`. Mas o `diff 80d5db7 56d52f4`
   prova que em `80d5db7` o `agregar.mjs` não tinha o bloco das `R:160` a `R:203`
   nem o `--gravar`: o arquivo foi escrito por uma árvore de trabalho entre os
   dois commits, e nada no arquivo diz qual. Agora que o agregado versionado é a
   única procedência dos números publicados, o agregador tem de carimbar a si
   mesmo. **Conserto:** `--gravar` escreve uma linha 3 com `HEAD` e o
   `status --porcelain` na hora da agregação, no mesmo formato do manifesto
   (`commit · ⚠ÁRVORE SUJA`). Duas linhas de código.

4. **Status velho na `09`, quatro lugares:**
   - `09:3` diz "Commit `0dc62a4`" e `09:9` diz "a grade rodou QUATRO vezes e os
     números aqui são os da última". Os números agora saem da quinta
     (`bmtlw3e2r`, `80d5db7`), que reproduziu a quarta. O cabeçalho precisa dizer
     isso em vez de se contradizer duas linhas depois;
   - `09:345` e `09:529` ainda dizem "trabalho total". O documento passou a
     distinguir mestre e mesa nesta rodada; "total" voltou a ser ambíguo. As duas
     são do mestre, e devem dizer;
   - `09:904`, D36: "os seis sinais". Registro histórico, mas a §4 diz onze; uma
     nota "(hoje onze, D46)" evita a leitura errada.
   - **E o mecanismo que deixa isso acontecer de novo:** a `09` cita linha num
     arquivo de 407 linhas que muda a cada acréscimo no agregador (o item 1 e o
     L28 vão mudar). D06 aceitou o custo; o que falta é o custo ser alto quando
     acontecer. **Conserto:** uma conferência em `npm run validate` que, para
     cada `linhas N a M` e cada bloco copiado da `09`, confira que a linha citada
     do `resultados/*.txt` contém o número citado. O placar da rodada 01 atravessou
     sete rodadas porque nada gritava; isto é o grito.

5. **O 4.409.780 tem uma hipótese testável, e ela não foi testada.** O aviso
   rodou o agregador de `2df566f` sobre os dados de hoje e conferiu as seis
   baterias guardadas. O que não rodou foi o MOTOR de `2df566f`: entre ele e a
   bateria da `09` há `9580661`, que mexeu em `motor.mjs` (+6) e `log.mjs` (+26),
   e `0dc62a4`. Se a bateria de `2df566f` era a fonte do placar e o `.sim/` dela
   foi sobrescrito, o número some das seis guardadas e continua tendo origem.
   **Conserto:** `git checkout 2df566f`, bateria (37 s), agregador; se der
   4.409.780, a caixa da `09` §4 (`09:758`) passa a dizer "transcrito da bateria
   de `2df566f`, anterior à mudança do motor em `9580661`"; se não der, "não
   explicado" fica, com o teste declarado. Uma afirmação de ausência com a
   hipótese óbvia por testar é fraca de um jeito que alguém hostil acha primeiro.

## PERGUNTA

- O `agregar.mjs` que escreveu `09-bmtlw3e2r.txt` é byte a byte o que está em
  `56d52f4`? O arquivo não diz (item 3), o aviso diz que "refeito no commit
  avisado sai idêntico exceto a linha 2", e eu não posso refazer. Se a resposta
  for "sim, e conferi refazendo", o item 3 vira só o carimbo; se for "acho que
  sim", refaça antes de qualquer outra coisa da rodada 03.

## ESCALA

nada.

O aviso marca duas coisas como "precisa do humano" e eu não escalo nenhuma. O L26
(por que a mesa rola na mão) já estava assim na rodada 01 e não trava nada. "Quem
declara o NPC na mesa" não é regra de jogo: é premissa de uso, e depois do
`declarar` por lado (item 1) os dois cenários saem calculados e o humano escolhe
qual ler, quando quiser, sem parar o ciclo. Escalar por isso seria gastar a
parada mais cara do script numa pergunta que a medição responde.

## VEREDITO

CORRIGE-E-SEGUE.

**O ataque, antes de escrever isto:** o ponto que eu derrubaria primeiro é a
tabela do `G`, de novo. A rodada 01 tirou o gesto do jogador do denominador do
mestre; esta rodada o pôs inteiro no denominador da mesa, incluindo o lado que o
robô declara. O 11,4% do mestre ficou de pé sob o ataque (não depende de `G` nem
de lado). A banda da mesa não ficou, e é o item 1. **É a segunda volta sobre a
mesma tabela.** Ela convergiu (o denominador do mestre está certo e não volta),
mas se a rodada 03 devolver a tabela do `G` com uma terceira premissa escondida,
não há quarta: escalo.

**Escopo:** a rodada afinou o instrumento e não mediu nada novo. Foi o trabalho
certo, porque era o tratamento de dois BLOQUEIA, mas fica dito: a pergunta da
frente (quanto do trabalho do mestre o Grid tira) tem hoje exatamente os números
que tinha na rodada 01, agora com procedência. A rodada 03 precisa produzir uma
medição (o `declarar` por lado é a menor que já muda um número publicado).
