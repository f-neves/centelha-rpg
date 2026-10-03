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
