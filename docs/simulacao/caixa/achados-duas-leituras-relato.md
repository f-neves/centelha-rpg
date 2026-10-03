# Achados de duas leituras (Revisão 119, Leitora 3, 121) · relato da Executora

Despacho: `docs/simulacao/caixa/achados-duas-leituras-despacho.md` (`b7537302`, com o Adendo 1 em
`4049aba7`). Um bloco por commit, com o sha e o CI.

## Bloco 1 · Regras de base

### Item 1 · O preço de subir uma Proeza de nível (opção B do autor: só texto)

**A convenção de Atributos e Habilidades**, como o relato tinha de dizer:
- é **acumulativa**: `criacao-de-personagem.md:41` ("O custo é para subir ao próximo ponto, em função do
  *novo* valor"), a tabela de `:43-46` e `:58` ("Nas demais trilhas o custo é cumulativo: você paga cada
  degrau até chegar lá");
- em `regras.json`, no bloco `xp`, `atributo` e `habilidade` têm `"tipo": "acum"`.

A Proeza é `"tipo": "flat"` (`regras.json:635`): o `custoPontos` (`calc.ts:367`) cobra o preço do
nível. Parei antes de mexer, porque aplicar a convenção das Habilidades mudaria o que o código cobra:
o total de uma Técnica de nível 6 iria de 35 para 135. O autor escolheu a **opção B**: código e
JSON ficam, e só o capítulo muda.

- `criacao-de-personagem.md:35`
  - antes: "Duas trilhas não acumulam, a Proeza e o Efeito Especial: paga-se só o preço do nível
    comprado."
  - depois: "[...] paga-se no total só o preço do nível comprado (subir uma Proeza de nível paga só a
    diferença)."
- `criacao-de-personagem.md:58`
  - antes: "[...] subir uma Proeza do nível 2 para o 3 custa os 20 do nível 3 inteiro, não a diferença
    entre os dois."
  - depois: "Uma Técnica de nível *N* custa no total o preço do nível *N* (5 + 5 × nível), e não a
    soma dos de baixo; subir uma Proeza de nível paga só a diferença: do nível 2 (15) para o 3 (20),
    5. A Proeza não acumula como Atributo e Habilidade porque o personagem compra muitas Técnicas, e
    não sobe uma trilha só."
  - O Efeito Especial ficou como estava ("um Efeito de nível 2 custa 8 e não exige ter pago o de
    nível 1").
- `regras.json` ("Subir uma Proeza de nível paga só a diferença") e `calc.ts:373` (o mesmo, em
  comentário) já diziam isto e não mudaram. Nenhum total de ficha muda.

### Item 2 · Onde a Centelha começa (119 #15, Leitora F1)

- `criacao-de-personagem.md:23`
  - antes: "A maioria começa em 1; quem quer um herói de saga começa em 3 (Herói)."
  - depois: "O Mestre escolhe pela campanha: **Centelha 0** numa campanha mortal; de **1 a 3** numa
    campanha heroica (3 é o Herói, para quem quer um herói de saga)."
- `:33`: a frase "isso se conquista na história, não na planilha" ficou e ganhou: "Na criação, quem
  decide a Centelha inicial é o Mestre, pela campanha (0 numa campanha mortal; de 1 a 3 numa
  heroica); dali em diante ela sobe em jogo."
- `:64`
  - antes: "(a maioria dos heróis começa em 1)"
  - depois: "(o Mestre escolhe pela campanha: 0 numa campanha mortal; de 1 a 3 numa heroica)"
- `centelha.md:84` (callout do Portão da Centelha): ganhou "Na criação, o Mestre escolhe a Centelha
  inicial pela campanha: **0** numa campanha mortal; de **1 a 3** numa campanha heroica."
- **Os exemplos** (Kael 3, Sora 3, Veil 4, Bram 1): nenhum número mudou. Os de 1 e 3 cabem na faixa
  heroica. O Veil (4) já trazia a "Exceção declarada" (teto de criação 3); ela ganhou o fim: "pela
  faixa padrão (0 numa campanha mortal; de 1 a 3 numa heroica), Veil é de uma campanha heroica que o
  Mestre abre acima dela."
- A Leitora certa é a F1. A F2 (Energia e Mana do mortal) não foi tocada.

### Item 3 · Virtude e Centelha (119 #16, Leitora F6)

- `aparencia-virtudes-vontade.md`, logo depois do parágrafo "O Atributo fica de fora de propósito"
  (que segue a tabela da parada da Virtude): "A **Centelha** também não entra no teste de Virtude: nem
  inteira, nem pelo 2 × mín."
- `centelha.md` não cita mais "testes de Bravura" nem "Vontade pura" em lugar nenhum (procurado no
  capítulo inteiro: 0).
- D12 (`D-proezas-tecnicas.md`): a ressalva dos exemplos antigos ganhou que a Virtude foi decidida
  (não entra).

### Item 4 · A provocação do orc

- `racas.md:169`
  - antes: "contra **Força de Vontade do orc × 2 + Centelha dele**."
  - depois: "contra **Força de Vontade do orc × 2 + 2 × mín(Centelha, Integridade) dele**, como na
    Defesa Mental."
- Procurado em `racas.json`, na ficha e no Grid (Frenesi, provocação, Vontade): a conta não existe em
  dado nem em código. O `racas.json` só descreve o Frenesi e o +2d6 de Intimidar.

### Item 5 · O critério da D12

- `D-proezas-tecnicas.md`, no parágrafo "Precisado pelo autor em 02/10/2026", entrou verbatim: "O
  Mestre pede uma jogada de Atributo puro só quando nenhuma Habilidade do livro cobre a ação. É sempre
  o Mestre quem decide, e não o jogador. Se existe Habilidade que cubra, ela é pedida, e quem não a tem
  leva bônus 0." Conferido por Python que é a mesma frase de `centelha.md:44`. O mesmo parágrafo
  registra que a provocação do orc e o teste de Virtude foram decididos.

### Item 17 · D15 · [ADIADO] Botão de Atributo puro

- `D-proezas-tecnicas.md`, depois da D14: sem botão de Atributo puro na ficha nem no Grid por
  enquanto (decisão do autor de 02/10/2026); o Mestre faz a conta à mão; `centelhaSoAtributo`
  (`calc.ts`) segue sem chamador.

**Arquivos do Bloco 1:**
- `src/content/chapters/criacao-de-personagem.md`
- `src/content/chapters/centelha.md`
- `src/content/chapters/aparencia-virtudes-vontade.md`
- `src/content/chapters/racas.md`
- `docs/pendencias/D-proezas-tecnicas.md`
- este relato
- `Pendencias.md`, regerado (o índice ganhou a D15)

**Verificação** (sobre `4049aba7`): `npm run validate` verde ("Portões OK"); `npm run build` verde
(sem código tocado, sem `tsc`). No HTML gerado, contado no texto sem marcação:
- `criacao-de-personagem` traz "subir uma Proeza de nível paga só a diferença: do nível 2 (15) para o
  3 (20), 5", "compra muitas Técnicas, e não sobe uma trilha só", "Centelha 0 numa campanha mortal" e
  "Veil é de uma campanha heroica que o Mestre abre acima dela" (1 cada); "custa os 20 do nível 3
  inteiro" aparece 0 vezes;
- `centelha` traz "de 1 a 3 numa campanha heroica" (1);
- `aparencia-virtudes-vontade` traz "também não entra no teste de Virtude" (1);
- `racas` traz "Força de Vontade do orc × 2 + 2 × mín(Centelha, Integridade) dele" (1).

**Commit do Bloco 1:** `bd26f1b0` · **CI:** Validar 37083199172 (19 de 19) e Deploy 37083199174 (2 de
2), primeira volta.

## Bloco 2 · Combate

**Ficaram de fora deste commit, à espera do autor:**
- item 8, a armadura na Furtividade (a ficha diz +4, e o dobro da Penalidade das pesadas dá 4 ou 6);
- item 9, a Corrida (recomeçar no Arranque deixa a Velocidade de Corrida inalcançável).
`combate.md:54`, `:286`, `:297`, `armas-e-armaduras.md:131` e `acoes-sentidos-e-engano.md:81` não
foram tocados.

### Item 6 · Golpe no sistema Normal: rola-se ao declarar (Leitora B1)

O `combate.md` inteiro é o sistema Normal ("o sistema deste capítulo", `:103`). As seções de Preparo,
Golpe e Recuperação descrevem as fases que os dois sistemas usam. Por isso os quatro trechos foram
alinhados ao Normal, e nenhum foi reescrito como P/G/R:
- `:103-105` (o Normal), acrescentado: "**Rola-se ao declarar**, para arma Leve, Média e de
  Distância: o acerto e o dano valem no Tick da declaração, e o Preparo e o Golpe que vêm depois só
  marcam a Defesa em −2 e em −4."
- `:86-87`
  - antes: "a Besta Grande (Velocidade 15) passa catorze Ticks armando antes do virote sair."
  - depois: "[...] passa catorze Ticks armando, com a guarda aberta, até o Tick do Golpe. No sistema
    Normal, o padrão deste capítulo, o tiro já foi rolado na declaração (ver *Dois sistemas de
    tempo*); esses Ticks marcam quanto tempo a guarda fica aberta."
- `:339` (Bram)
  - antes: "declara o tiro no Tick 0. Ele fica dos Ticks 0 ao 10 em Preparo, sem sair do lugar, e o
    virote sai no Tick 11."
  - depois: "declara o tiro no Tick 0 e, no sistema Normal, rola ali mesmo. Ele fica dos Ticks 0 ao 10
    em Preparo, sem sair do lugar, e no Tick 11 em Golpe, com a guarda em −4."
- `:382` (as duas adagas)
  - antes: "Se uma delas fosse uma espada longa (Preparo 1) declarada no Tick 3, o golpe dela também
    cairia no 4, e valeria o mesmo."
  - depois: "[...] declarada no Tick 3, no sistema Normal ela rolaria no 3, mas o Golpe dela também
    cairia no 4: no Tick 4 a guarda dela estaria em −4, a mesma das adagas."
  - O "valeria o mesmo" saiu: no Normal o ataque da espada se rola no 3, então ele não é o mesmo
    lance das adagas. O que é igual é a guarda aberta no 4.

**Visto e não mexido:** na Recarga, `:330` ("O tiro continua saindo no último Tick do ciclo") e
`:336` ("só então o virote sai") ainda falam do disparo no fim do Preparo. Não estavam na lista do
despacho nem nos trechos da Leitora; ficam registrados para a próxima leitura.

### Item 7 · A Pressão: o golpe não desconta a si mesmo (Leitora B2)

- `combate.md:405` (callout Guarda sob pressão), acrescentado: "**O golpe não desconta a si
  mesmo:** o primeiro ataque recebido bate na Defesa cheia, e o segundo já pega −2."
- **O código, conferido; nenhum caminho desconta o golpe antes de rolá-lo:**
  - `scripts/sim/motor.mjs:376` lê a `defesaPerdida` do alvo antes de somar a pressão (`:437`);
  - no Grid, `src/pages/mesa/grid.astro:8671` chama `declararNoTabuleiro`, que soma a pressão no alvo
    (`gravarRelogio`, `:9122`), depois de o `acertou` já ter sido calculado. No caminho adiado, a
    pressão entra em `tirarDaAgenda` (`:9011`), depois da folha do golpe;
  - no rastreador, `src/pages/mesa/combate.astro:2079` soma a pressão (`somarPressao`) depois que a
    folha fechou com o resultado.
  A K37 (o Grid só conta o recebido) segue como está.

**Arquivos do Bloco 2:**
- `src/content/chapters/combate.md`
- este relato

**Verificação** (sobre `bd26f1b0`): `npm run validate` verde ("Portões OK"); `npm run build` verde
(sem código tocado). Em `dist/regras/combate/index.html`, contado no texto sem marcação:
- trazem 1 cada: "Rola-se ao declarar", "o tiro já foi rolado na declaração", "no sistema Normal,
  rola ali mesmo", "no Tick 4 a guarda dela estaria em −4" e "O golpe não desconta a si mesmo:";
- trazem 0 cada: "e valeria o mesmo" e "antes do virote sair".
Nenhum travessão novo (`combate.md` tem 6 antes e depois, os mesmos).
