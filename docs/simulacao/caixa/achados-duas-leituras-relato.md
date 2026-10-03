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

**Commit do Bloco 2:** `ac3b197e` · **CI:** Validar 37084319434 (19 de 19) e Deploy 37084319419 (2 de
2), primeira volta.

## Bloco 3 · Ações e testes

**Ficou de fora deste commit, à espera do autor:** o item 14 (Vontade, no máximo 1 ponto por jogada
ou ação, inclusive para resistir). Mandei ao Arquiteto o texto atual da tabela social
(`relacoes-sociais.md:148-156`, mais o resumo de `:275`) e três propostas de redação. Perguntei
também se o cortejo (`:276` e `regras.json` `social.modoDevagar.resistencia`, que cobra 1 + [excedente
÷ 6] por intervalo) conta como "uma ação". Nenhum código cobra Vontade de resistir: procurado em
`ficha-engine.ts`, `src/lib/mesa-*.ts` e nas páginas da mesa. `aparencia-virtudes-vontade.md:115`,
`defesas.md:104` e a tabela social não foram tocados.

### Item 10 · A Margem na Acumulada é só a leitura do excedente (Leitora D1)

- `acoes-e-sistema.md`, logo depois do exemplo da muralha (`:77`), acrescentado: "Na Acumulada, a
  **Margem é só a forma de ler o excedente**: os 10 de excedente do 17 contra 7 já são o progresso
  daquela jogada (e contêm uma Margem), e a Margem não soma progresso por cima deles."
- `acoes-corpo-e-movimento.md:33` (Escalar)
  - antes: "**A Margem compra** · altura. Cada Margem sobe **mais 3 metros** naquele intervalo."
  - depois: "**A Margem** · não compra altura por cima: o excedente da jogada já é a altura subida
    naquele intervalo, e a Margem é só a forma de lê-lo."
- `acoes-sentidos-e-engano.md:75` (Esgueirar)
  - antes: "**A Margem compra** · terreno ou tempo, à escolha do jogador: **mais 4 metros**, ou
    **congelar um intervalo** [...]"
  - depois: "**A Margem** · não compra terreno por cima: o excedente da jogada já é o terreno
    andado. Cada Margem pode, à escolha do jogador, **congelar um intervalo** [...]"
  - **Uma leitura minha, para a Revisora e o Arquiteto:** o "congelar um intervalo" ficou como efeito
    da Margem, porque não é progresso, e a decisão só tira o que soma por cima do progresso. Saíram os
    "mais 4 metros".

### Item 11 · O erro na Acumulada perde só o que passou da faixa de 6 (Leitora D2)

- `acoes-e-sistema.md:84`
  - antes: "| **6 ou mais** | **perde a diferença**. Escorregou de verdade |"
  - depois: "| **6 ou mais** | **perde o que passou da faixa de 6**. Escorregou de verdade: errou por
    8, perde 2 |"
- `:86`: "É a Margem valendo nos dois sentidos: para cima compra efeito, para baixo cobra terreno."
  passou a "É a Margem valendo nos dois sentidos, como no [Quase-Acerto](/regras/quase-acerto): os
  primeiros 6 abaixo são a faixa que só custa tempo, e só o que passa dela cobra terreno." A frase
  velha dizia que a Margem "compra efeito" para cima, o que o item 10 desfaz.
- **Varrido por mais, a mesma regra:** a Falha do Escalar (`acoes-corpo-e-movimento.md:35`) dizia
  "errar por 6 ou mais perde a diferença em metros", e passou a "perde, em metros, o que passou da
  faixa de 6 (errou por 8, desce 2)".

### Item 12 · No Trabalho em Grupo, soma-se o excedente de cada jogada

- `acoes-e-sistema.md:168`
  - antes: "Cada um faz o **próprio teste**, e os resultados somam além da Dificuldade."
  - depois: "Cada um faz o **próprio teste**, e soma-se o **excedente de cada jogada** sobre a
    Dificuldade: com Dificuldade 7, quem tira 12 e quem tira 10 somam 5 + 3 = 8 de progresso."

### Item 13 · A Cura encurta o intervalo em 10% por nível (Leitora F3)

- `vida-ferimentos-cura.md:90`
  - antes: "**cada nível de Cura** de quem cuida a acelera em **10%**"
  - depois: "**cada nível de Cura** de quem cuida **encurta o intervalo** da tabela em **10%** (com
    Cura 3, o "a cada 5 dias" vira 3,5 dias)"
- `custo-servicos.md:228` (Tratamento diário, 10 pc) não cita a aceleração, e nenhuma calculadora a
  usa: nada a mudar. A linha do Incapacitado e a piora não foram tocadas.

### Item 15 · Seguir alguém: a Dificuldade é o Valor Passivo do alvo

- `custo-servicos.md:67` (Trabalho de perícia), acrescentado: "Num trabalho de seguir alguém, a
  Dificuldade é o **Valor Passivo do alvo** (a Percepção Passiva dele), a mesma da cena."
- `:107` e `:108`, os dois exemplos de seguir:
  - "Dificuldade 15" passou a "Dificuldade 15, o Valor Passivo do alvo";
  - "Dificuldade 20" passou a "Dificuldade 20, o Valor Passivo do espião".
  - **O 15 fica**, agora lido como um alvo de Valor Passivo 15. Nenhum número dos exemplos mudou.
- `acoes-sentidos-e-engano.md`, logo depois da fórmula do Esgueirar (`:50`), acrescentado: "Num
  **trabalho de seguir alguém**, a Dificuldade é o **Valor Passivo do alvo** (a Percepção Passiva
  dele), na cena e no preço do trabalho", com o link para Trabalhos e recompensas.

### Item 16 · A suspeita se mede contra o Valor Passivo inteiro (opção B do autor)

- `acoes-sentidos-e-engano.md:50` (a fórmula)
  - antes: "Direta: passe do **Valor Passivo** do vigia · Acumulada: a Dificuldade é **70%** dele"
  - depois: o mesmo, mais "e a suspeita se mede contra o **Valor Passivo inteiro**".
- `:61` e `:63` (o parágrafo "O Valor Passivo não é um alarme ligado o tempo todo"), acrescentado
  antes da frase que leva à tabela de estados: "Na Acumulada, quem avança abaixo do Passivo progride
  e deixa rastro ao mesmo tempo: o progresso se conta contra a Dificuldade (os 70%), e a suspeita
  contra o Passivo inteiro. Um guarda de portão tem Passivo 10 e Dificuldade 7; uma jogada de 8 avança
  1 e fica 2 abaixo do Passivo, na coluna "abaixo por menos de 6" da tabela abaixo."

**Arquivos do Bloco 3:**
- `src/content/chapters/acoes-e-sistema.md`
- `src/content/chapters/acoes-corpo-e-movimento.md`
- `src/content/chapters/acoes-sentidos-e-engano.md`
- `src/content/chapters/vida-ferimentos-cura.md`
- `src/content/chapters/custo-servicos.md`
- este relato

**Verificação** (sobre `ac3b197e`): `npm run validate` verde ("Portões OK"); `npm run build` verde
(sem código tocado). No HTML gerado, contado no texto sem marcação:
- `acoes-e-sistema` traz "Margem é só a forma de ler o excedente", "perde o que passou da faixa de 6",
  "errou por 8, perde 2" e "5 + 3 = 8 de progresso" (1 cada), e "perde a diferença" 0 vezes;
- `acoes-corpo-e-movimento` traz "não compra altura por cima" e "errou por 8, desce 2" (1 cada), e
  "mais 3 metros" 0 vezes;
- `acoes-sentidos-e-engano` traz "não compra terreno por cima", "a suspeita se mede contra o Valor
  Passivo inteiro", "uma jogada de 8 avança 1 e fica 2 abaixo do Passivo" e "trabalho de seguir
  alguém" (1 cada), e "mais 4 metros" 0 vezes;
- `vida-ferimentos-cura` traz "encurta o intervalo" e "vira 3,5 dias" (1 cada);
- `custo-servicos` traz "Dificuldade 15, o Valor Passivo do alvo", "Dificuldade 20, o Valor Passivo
  do espião" e "a mesma da cena" (1 cada).

Nenhum travessão novo: a contagem é a mesma de antes nos cinco capítulos (o único, em
`vida-ferimentos-cura.md`, já estava lá).

**Commit do Bloco 3:** `711b7b82` · **CI:** Validar 37085390862 (19 de 19) e Deploy 37085390876 (2 de
2), primeira volta.

## Adendo 2 · Correções da rodada 122 e a F2 (`f9116f28`), um commit

Os itens 8, 9 e 14 seguem fora, com o autor.

### CORRIGE A · `combate.md:106`
- antes: "**Rola-se ao declarar**, para arma Leve, Média e de Distância: o acerto e o dano [...]"
- depois: "**Rola-se ao declarar**, em todo golpe: o acerto e o dano [...]"

### CORRIGE B · `combate.md:333` e `:339` (Recarga)
- `:333`: depois de "o que a besta perde é o passo, não o disparo." entrou "No sistema Normal, o tiro
  já foi rolado na declaração; o Preparo só marca a guarda aberta."
- `:339`: "e só então o virote sai" ganhou "(no sistema Normal ele já foi rolado na declaração, e
  esses Ticks só marcam a guarda aberta)".

### CORRIGE C · `acoes-corpo-e-movimento.md:72` (Nadar)
- antes: "**A Margem compra** · distância. Cada Margem avança **mais 5 metros**. A água devolve mais que
  a parede: quem nada bem desliza."
- depois: "**A Margem** · não compra distância por cima: o excedente da jogada já é a distância nadada
  naquele intervalo, e a Margem é só a forma de lê-lo." É o mesmo molde do Escalar e do Esgueirar.

### CLAREZA 1 · `acoes-e-sistema.md:84`
- A linha "6 ou mais" da tabela da Acumulada passou a terminar em "errou por 8, perde 2; errou por
  exatamente 6, perde 0".

### CLAREZA 2 · `criacao-de-personagem.md:33`
- A ponte: "[...] isso se conquista na história, não na planilha. Por isso a Centelha inicial também
  não se compra: na criação, é o Mestre quem a dá, pela campanha (0 numa campanha mortal; de 1 a 3
  numa heroica), e dali em diante ela sobe em jogo."

### Pergunta 1, opção C · pendência G75
- `docs/pendencias/G-acoes-sistema.md`, **G75 · [DECIDIR] Rever de uma vez todo efeito da Margem
  dentro da Acumulada**. Os casos achados, varrendo `acoes-*.md`:
  - o "congelar um intervalo" do Esgueirar;
  - a qualidade do Ofício quando ele vira Acumulada;
  - a régua geral "O que a Margem compra fora do combate" (Tempo, Qualidade, Duração), que vale
    também na Acumulada sem dizer como convive com o excedente;
  - a Margem numa Longa (o exemplo de Decifrar, a D3 da Leitora).
- O congelar do Esgueirar ficou como estava. `Pendencias.md` regerado (entra a G75).

### Pergunta 2, opção B · seguir alguém
- `acoes-sentidos-e-engano.md:52`
  - antes: "a Dificuldade é o **Valor Passivo do alvo** [...], na cena e no preço do trabalho"
  - depois: "na cena vale a regra do Esgueirar, com o alvo no lugar do vigia: na Direta, contra o
    **Valor Passivo do alvo** [...]; na Acumulada, contra 70% dele, com a suspeita medida contra o
    Passivo inteiro. O preço do trabalho usa o Valor Passivo inteiro".
- `custo-servicos.md:67`: "a mesma da cena" saiu. Agora diz: "o preço usa o **Valor Passivo inteiro
  do alvo** [...]; na cena vale a regra do Esgueirar, em que a Acumulada vai contra 70% dele." Os
  exemplos de `:107-108` ("Dificuldade 15, o Valor Passivo do alvo") não mudam.

### F2 · o mortal tem Mana e conjura Artes

**O código, conferido antes do texto. TRÊS lugares bloqueiam a Arte ou a Mana em Centelha 0, e não
mudei nenhum, porque é decisão do autor:**
1. `src/lib/ficha-engine.ts:176`: `capFor('arte2')` devolve `(S.centelha || 0) > 0 ? 6 : 0`. Na
   ficha, com Centelha 0, o teto de toda Arte é 0, e o mortal **não consegue comprar nível de Arte**.
   O comentário de `:174` diz "Basta Centelha > 0 para tocar a magia".
2. `src/pages/mesa/grid.astro:3327-3329`: `mana: R.centelha > 0 ? R.mana : 0`, com o comentário
   "Mana só existe para quem despertou". No Grid, o mortal entra com **Mana 0**.
3. `src/pages/mesa/combate.astro:1690-1696` (o rastreador): `mn = (S.centelha || 0) > 0 ? manaDe(...)
   : null`, com o comentário "Mana só para quem despertou". No rastreador, o mortal entra **sem
   Mana**.

Também diz o mesmo, ligado ao bloqueio 1, `src/components/FichaSkeleton.astro:117`: o cabeçalho da
seção de Artes na ficha, "(10 + nível×5 · exige Centelha &gt; 0)". Não mexi: é o rótulo do que a
ficha de fato faz hoje, e trocá-lo sem o código faria a ficha dizer uma coisa e fazer outra.

Não bloqueiam:
- `calc.ts` (a `mana` é Centelha × 2 + Vontade, que dá a Vontade em Centelha 0; a linha `:77` é do
  limite de morte, outro assunto);
- `artes-grid.ts` (o custo é total − Centelha, sem portão);
- `mesa-ficha.ts` (usa a `mana` da calc);
- `gen-bestiario.mjs`, `lib-bestiario.mjs` e `validate-data.mjs` (nenhuma regra de Arte por
  Centelha);
- `regras.json` `centelhaGate` (só diz que a Centelha sobe com o Mestre).

**O texto mudou:**
- `centelha.md`:
  - a linha 0 da tabela: "Nada de sobrenatural, só Atributos e Habilidades" passou a "Nenhuma
    Proeza; Artes, com a Mana, que no mortal é a própria Força de Vontade";
  - `:28`, o "Mortal": "não há Proeza nem magia" passou a "não há Proeza: o mortal tem Energia, mas
    não a usa, porque a Energia serve às Proezas. Magia ele pode estudar e conjurar, com a Mana
    [...]";
  - `:19` (Tocado, na tabela): "a Energia e a Mana que todo mortal já tem passam a servir (Proezas,
    Artes)" passou a "a Energia que todo mortal já tem passa a servir (às Proezas), e a Mana
    cresce";
  - `:30`: "É aqui que se ganham as primeiras reservas de **Energia e Mana**" passou a "É aqui que a
    **Energia** passa a servir (ela serve às Proezas), a **Mana** cresce, e chegam as primeiras
    **Proezas**".
  - O `:84` (o Portão) não fala de Arte e não mudou.
- `criacao-de-personagem.md`:
  - `:33`: "sem acesso a Técnicas ou Artes" passou a "sem acesso a Técnicas (as Artes ele pode estudar
    e conjurar, com a Mana [...])";
  - `:58`: "Arte de qualquer nível exige apenas Centelha > 0 (qualquer fagulha)" passou a "Arte de
    qualquer nível não exige Centelha: o mortal (Centelha 0) também aprende e conjura, com a Mana
    [...]";
  - `:149`: "basta **Centelha maior que 0** (uma fagulha qualquer): a Centelha é só o interruptor"
    passou a "**não é preciso Centelha**: o mortal conjura com a Mana [...], e a Centelha só engorda
    essa reserva; ela não é a medida da profundidade". O arquétipo do Bram (mortal-tocado, Centelha 1)
    ficou.
- `src/pages/artes/regras.astro:46`: "basta **Centelha > 0** (qualquer fagulha) para tocar a magia"
  passou a "não é preciso **Centelha** para tocar a magia (o mortal conjura com a Mana, que nele é a
  própria Força de Vontade)".
- `regras.json` `escalaCentelha`, que a ficha mostra como descrição do degrau:
  - degrau 0: "Sem acesso a Proezas ou Artes" passou a "Sem acesso a Proezas; conjura Artes com a
    Mana, que nele é a própria Força de Vontade. Tem Energia, mas não a usa: ela serve às Proezas.";
  - degrau 1: "ganha Energia e Mana" passou a "a Energia passa a servir e a Mana cresce".
  - É texto, e não portão: nenhum código lê esse campo para decidir nada.
- A fórmula da Mana não mudou (Centelha × 2 + Vontade).

**Verificação** (sobre `f9116f28`): `npm run validate` verde ("Portões OK"); `npx astro sync && npx
tsc --noEmit` sem erro; `npm run build` verde. No HTML gerado, contado no texto sem marcação:
- `combate` traz "em todo golpe", "o Preparo só marca a guarda aberta" e "esses Ticks só marcam a
  guarda aberta" (1 cada), e "para arma Leve, Média e de Distância" 0 vezes;
- `acoes-corpo-e-movimento` traz "não compra distância por cima" (1) e "mais 5 metros" 0 vezes;
- `acoes-e-sistema` traz "errou por exatamente 6, perde 0" (1);
- `criacao-de-personagem` traz a ponte, "não é preciso Centelha" e "Arte de qualquer nível não exige
  Centelha" (1 cada); "Centelha maior que 0" e "sem acesso a Técnicas ou Artes" aparecem 0 vezes;
- `centelha` traz "Nenhuma Proeza; Artes, com a Mana", "tem Energia, mas não a usa" e "a Energia que
  todo mortal já tem passa a servir" (1 cada), e "não há Proeza nem magia" 0 vezes;
- `acoes-sentidos-e-engano` traz "com o alvo no lugar do vigia" e "O preço do trabalho usa o Valor
  Passivo inteiro" (1 cada);
- `custo-servicos` traz "o preço usa o Valor Passivo inteiro do alvo" (1) e "a mesma da cena" 0
  vezes;
- `artes/regras` traz "não é preciso Centelha para tocar a magia" (1) e "qualquer fagulha" 0 vezes.

**Arquivos deste commit:**
- capítulos: `combate.md`, `acoes-corpo-e-movimento.md`, `acoes-e-sistema.md`,
  `criacao-de-personagem.md`, `centelha.md`, `acoes-sentidos-e-engano.md`, `custo-servicos.md`;
- `src/pages/artes/regras.astro` e `src/data/regras.json`;
- `docs/pendencias/G-acoes-sistema.md` e `Pendencias.md`;
- este relato.
