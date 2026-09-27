# Centelha, dossiê para avaliação externa das Proezas

Documento autossuficiente, escrito para quem não tem acesso ao repositório nem ao site. Cada
afirmação de regra traz a fonte entre colchetes, no formato [arquivo:linha], e um status:
**ESTÁVEL** (regra fechada, sem pendência aberta contra ela), **EM REVISÃO** (regra existe, mas
há divergência de texto ou pendência formal aberta) ou **NÃO EXISTE** (a regra não está escrita em
lugar nenhum; nada foi inventado para preencher o vazio). Ponto 7 usa também **INFERÊNCIA**, para
o que se deduz de Técnicas existentes na ausência de uma diretriz escrita.

Passo 0 (busca por um documento já compilado): não existe, em nenhum lugar do repositório, um .md
que já reúna visão geral do sistema, resumo da Centelha e guia de Proezas. `docs/MAPA.md` (o
inventário da raiz do repositório, de 08/09/2026) não lista nenhum candidato desse tipo.
`Proezas_revisao.md` é o único documento próximo do tema, mas é um **documento de trabalho**
[Proezas_revisao.md:3, "não é a versão final nem entra no site"], escrito numa numeração de 5
níveis anterior à régua atual de 6 [Proezas_revisao.md:16], e ele mesmo declara que grande parte
do texto está desatualizado [Proezas_revisao.md:705]. Este dossiê foi escrito do zero, a partir da
fonte de dados viva (`src/data/*.json`) e dos capítulos publicados (`src/content/chapters/`).

## 1. O que é o Centelha

Centelha é um sistema de RPG de mesa autoral, em D6, de fantasia heroica: o mundo é **Uldun**, e o
tom sobe do humano treinado ao sobre-humano de lenda conforme a **Centelha** (o traço central do
jogo) acende em cada personagem. A maioria das pessoas vive sem nunca tocar o sobrenatural; os
poucos que despertam a Centelha viram, aos poucos, heróis capazes de feitos que desafiam a física,
até o patamar de semideus [centelha.md:10-12, 14].

## 2. Núcleo do sistema D6

Toda ação incerta e relevante soma um **Atributo** (capacidade inerente) a uma **Habilidade**
(treino), e a metade dessa soma (arredondada para baixo) vira a quantidade de dados de 6 lados
rolados; se a soma for **ímpar**, soma-se um bônus fixo de **+2** ao resultado, e não um dado a
mais [coracao-do-sistema.md:14-16]. Soma 6, por exemplo, rola 3d6; soma 7 rola 3d6+2. **ESTÁVEL**.

**Dificuldade e sucesso:** a Dificuldade é um número fixo que o total da rolagem precisa
**superar** (empate falha). A régua vai de 5 em 5: 5 Fácil, 10 Média, 15 Difícil, 20 Limite humano,
25 Excepcional, 30 Sobre-humano [coracao-do-sistema.md:65-72]. **ESTÁVEL**.

**Margem:** a cada 6 pontos que o total supera o alvo, ganha-se uma Margem; em combate cada Margem
vale +1d6 de dano, fora dele a Margem compra um efeito melhor (mais rápido, mais fino, mais
duradouro), a critério do Mestre [coracao-do-sistema.md:78-80; acoes-e-sistema.md:31-49].
**ESTÁVEL**.

**Crítico e falha:** não existe uma regra de "crítico" nem "falha crítica" separada por valor do
dado (tipo "6 natural"): o sistema não usa esse conceito, o resultado é sempre a comparação do
total contra o alvo. **NÃO EXISTE** regra de crítico por dado; o que existe é a Margem (acima), que
cumpre esse papel de "acerto excepcional" de forma proporcional. Busca no repositório por "crítico"
como mecânica de dado não encontrou regra própria além da Margem e do estado de Vida "Crítico"
(que é outra coisa, ver item 3).

**Firula:** descrever a ação com criatividade rende um bônus naquele lance e devolve uma reserva
(Energia, Mana ou Força de Vontade, à escolha, uma por Firula). Nível 1: +2 fixo na jogada e
devolve 1 de Energia. Nível 2: +1d6 e devolve 2 de Energia, ou 1 de Mana, ou 1 de Força de Vontade.
Nível 3: +2d6 e devolve 5 de Energia, ou 3 de Mana, ou 3 de Força de Vontade, mais XP (quantidade
de XP ainda não decidida) [habilidades.md:99-122]. Não há teto por cena. **EM REVISÃO** no ponto do
XP do nível 3, que o próprio capítulo marca como não decidido [habilidades.md:121-122];
**ESTÁVEL** no resto.

**Bônus fixos:** entram por cima da rolagem (não são dados): a Centelha soma +1 ao ataque e a cada
uma das três Defesas [centelha.md:44]; a trilha de Proeza "Bônus" soma de +3 a +15 conforme o
nível [regras.json:119-126]; ver item 6 para como Proezas somam.

**Ações Longas:** para tarefas sem pressa (forjar, decifrar, curar), não se rola: usa-se a **média**
do pool (3,5 por dado, +2 se a soma for ímpar), somada uma vez por intervalo, contra uma Dificuldade
e um Acúmulo a atingir [acoes-e-sistema.md:90-111]. A Centelha não entra na Longa; só Proezas e
Artes quebram essa parede [acoes-e-sistema.md:107], mas a **forma** de uma Proeza entrar na Longa é
pendência aberta (ver item 6, D8/G15). **EM REVISÃO** na parte da entrada de Proeza.

**Escalas de Atributo e Habilidade:** para um humano, Atributo vai de **1** (Deficiente) a **6**
(Ápice absoluto, o limite da espécie), com **2** como a média sem treino nenhum e **3** como
"acima da média, treinado, competente" [atributos.md:18-27]. Acima de 6 só se abre pela Centelha
[atributos.md:72-74]. Habilidade não tem uma tabela de nomes própria no mesmo formato, mas usa a
mesma régua numérica nas somas (visto nos exemplos de Atributo + Habilidade). **ESTÁVEL**.

## 3. Números de combate

- **Ataque** = [(Atributo + Habilidade) ÷ 2]d6 (+2 se ímpar) + Acerto da Arma + Centelha
  [combate.md:122]. O Atributo corpo a corpo é Força ou Destreza (o maior), à escolha; arremesso
  sempre Destreza; tiro à distância sempre Percepção [combate.md:124]. **ESTÁVEL**.
- **Defesa (base da fórmula de ataque)** = (Destreza + Habilidade) × 2 + Especialidade + Centelha
  [combate.md:129]. Em detalhe, por muralha:
  - **Defesa Física, Esquiva** = (Destreza + Esquiva) × 2 + Centelha + Especialidade.
  - **Defesa Física, Bloqueio** = (Destreza + Bloqueio) × 2 + Centelha + Especialidade + defesa da
    arma/escudo [defesas.md:64-71]. **ESTÁVEL**.
  - **Defesa Social** = (Compostura + Sociabilidade) × 2 + Centelha + Especialidade (feras trocam
    Sociabilidade por Sobrevivência) [defesas.md:73-77]. **ESTÁVEL**.
  - **Defesa Mental** = Raciocínio + Integridade + Força de Vontade + Centelha + Especialidade (soma
    simples, sem ×2) [defesas.md:79-83]. **ESTÁVEL**.
- **Dano** = (Dado da Arma + Margem) + Força − Absorção; armas de uma mão somam Força simples, as
  de duas mãos o dobro, exceto hastes de estocada (Força simples) [combate.md:175-177]. **ESTÁVEL**.
- **Absorção**: natural = Vigor + Centelha contra Impacto, só Centelha contra Corte/Perfurante (um
  mortal Centelha 0 tem Absorção natural 0 contra lâminas); soma-se a Absorção da armadura, sempre
  o **maior** valor de cada categoria (Impacto/Corte/Perfuração), nunca acumulando peças
  [combate.md:191-192]. **ESTÁVEL**.
- **Pontos de Vida (porte Médio)** = 25 + (Vigor × 3) [vida-ferimentos-cura.md:16-28]. Cai
  Incapacitado em 0, morre em Vida ≤ −(PV máximo ÷ 2) [vida-ferimentos-cura.md:52-60]. **ESTÁVEL**.
- **Energia** = (Vigor + Compostura + Raciocínio + Vontade) ÷ 2 + Centelha × 2
  [centelha.md:45]. Recupera-se **por cena** [aparencia-virtudes-vontade.md:115]. **ESTÁVEL**.
- **Mana** = Centelha × 2 + Vontade [centelha.md:45]. Recupera-se 1 × Centelha por hora em
  descanso normal, 2 × Centelha por hora em sono/meditação [aparencia-virtudes-vontade.md:115].
  **ESTÁVEL**.
- **Força de Vontade**: traço próprio de 0 a 12, piso 0 grátis, cada ponto gasto soma +1d6 numa
  jogada ativa ou +4 numa Defesa passiva, no máximo 1 ponto por ação [aparencia-virtudes-vontade.
  md:109-113; regras.json:332-334]. Recupera 1 por noite de sono, mais Firula (item 2), mais 1 por
  agir fiel à própria Virtude [aparencia-virtudes-vontade.md:115]. **ESTÁVEL**.
- **Recuperação de PV**: recupera o próprio Vigor em PV por dia (Saudável), a cada 3 dias
  (Machucado), a cada 5 dias (Grave), por semana (Crítico); cada nível de Cura de quem cuida
  acelera 10%, até 50% com Cura 5 [vida-ferimentos-cura.md:79-90]. **ESTÁVEL**.

**Valores típicos:** o livro não publica uma ficha de "personagem iniciante" nem "veterano" com
todos os números lado a lado; os exemplos usados nos próprios capítulos (o personagem "Kael", e
"Bram") servem de referência solta: Kael tem Destreza 4, Esquiva 3, Centelha 3, e sua Esquiva sai
em 17 [defesas.md:85]; Bram tem PV 34 [vida-ferimentos-cura.md:32]. Um herói típico leva a Força de
Vontade a 5 ou mais [aparencia-virtudes-vontade.md:111]. **NÃO EXISTE** uma tabela publicada de
"personagem nível X tem estes números"; o que existe são esses poucos exemplos espalhados pelos
capítulos, marcados aqui como tal e não como tabela de referência.

## 4. O que é a Centelha

**Na lore:** a Centelha é a "fagulha de poder" que mora, ou não, em alguém; é o eixo de tudo que é
extraordinário no mundo (Proezas, Arcano, a estatura entre mortal e semideus) [centelha.md:12].
**Quem tem:** a esmagadora maioria (~95%) tem Centelha 0 e nunca toca o sobrenatural; acendê-la é o
que torna alguém especial [centelha.md:12, 18]. **Como surge:** a régua da Centelha só sobe com
permissão do Mestre, num marco de história ou feito maior; não custa XP [centelha.md:84;
regras.json:556, 623-628]. O texto do livro não detalha uma origem sobrenatural única (não há
descrição de ritual, linhagem ou fonte cósmica da Centelha); é ausência de lore, **NÃO EXISTE**
explicação de origem além de "acende, e o Mestre concede o marco".

**Raridade (tabela do livro):** [centelha.md:14-24]

| Nível | Estatura | Raridade | O que abre |
|:---:|---|---|---|
| 0 | Mortal | ~95% das pessoas | nada de sobrenatural |
| 1 | Tocado | ~1 em 20 | Proezas nível 1; Energia e Mana |
| 2 | Desperto | raro (sem número) | Proezas nível 2 |
| 3 | Herói | mais raro (sem número) | Proezas nível 3 |
| 4 | Campeão | ~1 em 250 | Proezas nível 4 |
| 5 | Lendário | quase-mito (sem número) | Proezas nível 5 |
| 6 | Semideus | um punhado no mundo (sem número) | Proezas nível 6 (teto do jogador) |

Três das sete linhas (Desperto, Herói, Lendário, Semideus: quatro, na verdade) não têm percentual
numérico, só qualificação em prosa. **EM REVISÃO/incompleta** nesse ponto específico; o resto da
tabela é **ESTÁVEL**.

**O que cada nível dá de fato:** cada ponto de Centelha soma **+1** ao ataque e a cada uma das três
Defesas [centelha.md:44; defesas.md:62], dimensiona Energia e Mana (item 3) e autoriza Atributos
acima do teto mortal (6), "a tabela exata de quanto cada nível libera ainda está em calibração"
[centelha.md:46]. O motor (`regras.json`) usa **+1** por ponto em todos os multiplicadores de
Centelha (`centelhaMult: 1` em Defesa Física, Mental, Social e ataque; `centelhaMult: 2` em Energia
e Mana) [regras.json:790, 798, 808, 814, 816-825, 827-829], batendo com o capítulo. **Mas** existe
uma nota de texto (não lida por nenhum código) em `regras.json:114`, dentro do bloco
`escalasProeza`, dizendo "+2/ponto de Centelha", contradizendo o resto. Há pendência formal aberta
sobre isso: `D7`, "Bônus de Centelha em ataque e defesa: +1 ou +2 por ponto?"
[docs/pendencias/D-proezas-tecnicas.md:33-36]. **EM REVISÃO.**

## 5. Escala de Centelha dos personagens hoje

A régua completa vai de **0 a 12**; a faixa jogável (a que um personagem de jogador alcança) é
**0 a 6**, e os degraus 7 a 12 pertencem só ao bestiário e à ficção (anjos maiores, dragões
ancestrais, o Tarrasque, divindades) [centelha.md:14, 26]. Cada degrau de 0 a 6 é um "salto de
tier", não um incremento suave [centelha.md:14]; acima de 6, a Centelha só engorda ataque, as três
Defesas, Energia e Mana, porque o teto de nível de Proeza é 6 e "o nível N exige Centelha ≥ N"
[centelha.md:26; regras.json:112]. **ESTÁVEL.**

**PONTO DE LIGAÇÃO:** outra instância está recalibrando o bestiário para desafio 1 a 12 e Centelha
de criatura 0 a 12 (hoje o campo `ameaca` do bestiário vai de 1 a 6 e `centelha` de 0 a 10)
[docs/pendencias/B-bestiario.md:109-113]. A definição do autor, no próprio documento de pendências,
**já está registrada com o grupo de referência em 4**, não 3: "nível de desafio X é feito para um
**grupo de 4 personagens** de Centelha X, com habilidades variadas, passarem dificuldade para
vencer, gastando recursos e se ferindo. É absoluto, não relativo ao grupo que joga."
[docs/pendencias/B-bestiario.md:118]. Este dossiê confere o texto ao vivo em 26/09/2026: a mudança
de 3 para 4 já está no documento de pendência (decisão recente, ligada aos commits mais recentes de
"B14 fase 2"); a recalibração do bestiário em si (converter as 309 criaturas para a régua 1-12)
**NÃO EXISTE** ainda, é trabalho futuro. **EM REVISÃO**, e é achado que se conecta a este dossiê
sem fazer parte do escopo das Proezas.

## 6. Proezas, a regra geral

**O que são:** Proezas são o nome coletivo das capacidades extraordinárias que a Centelha abre;
cada Proeza é composta de **Técnicas** individuais, organizadas em **Caminhos** (grupos temáticos,
50 ao todo na fonte de dados, ver Arquivo 2) [tecnicas.json; caminhos.json]. O capítulo da Centelha
chama essas capacidades de "Técnicas" no corpo do texto [centelha.md:48-61].

**Como se ganham / custo em XP:** compra-se por Técnica, sem acumular: 10·15·20·25·30·35 pontos de
XP para os níveis 1 a 6, "subir uma Proeza de nível paga só a diferença"
[regras.json:630-635]. **ESTÁVEL.**

**Requisitos:** o requisito formal e único registrado no motor é a **Centelha**: "o nível N exige
Centelha ≥ N" [regras.json:635; centelha.md:50]. Cada Técnica também carrega um **Atributo**
associado (ligado ao Caminho) e, em 90 das 461 Técnicas, um **pré-requisito de outra Técnica**
específica (ver Arquivo 2, campo "prereq"). Não há requisito formal de Habilidade mínima escrito na
ficha da Técnica (o campo não existe no schema de `tecnicas.json`); o texto de cada Técnica pode
mencionar uma Habilidade em prosa, mas isso não é um campo de regra verificável. **EM REVISÃO** na
parte de Habilidade (não é campo de dado, é convenção de leitura).

**Níveis de Proeza:** 6 níveis, de 1 a 6, o mesmo teto de Centelha do jogador [centelha.md:52-61].
**ESTÁVEL.**

**Limites por nível de Centelha:** o número de Técnicas que se pode ter por nível de Centelha (um
teto de "quantas Proezas dá para comprar") **NÃO EXISTE** como regra escrita; o que existe é o
portão de **acesso** (Centelha N destrava Técnicas até o nível N), não um teto de **quantidade**.

**Como se usam:** cada Técnica tem um **tipo** (`passiva`, `ativa` ou `reflexiva`, ver Arquivo 2) e
um **custo** por uso em Energia e/ou Força de Vontade, quando existe (a maioria das Técnicas,
sobretudo as passivas, não custa nada por uso) [tecnicas.json, campo `custo`]. **Não há campo de
Mana** em nenhuma das 461 Técnicas: o custo em Mana é exclusivo das Artes (item 8), não das
Proezas. Não há campo de **duração** nem de **Velocidade própria** por Técnica; a Velocidade segue
a da ação que a carrega (ataque, movimento etc.) [tecnicas.json, ausência do campo].

**Como somam com Habilidade, Firula e bônus:** a trilha "Bônus" de uma Técnica (a mais comum,
+3 a +15 por nível) soma à rolagem ou ao valor passivo, "por cima do +1 por ponto de Centelha que
já pesa em ataque e nas defesas" [centelha.md:65]. Há oito trilhas de escala diferentes conforme o
que a Técnica melhora (Bônus, Absorção, Dano, Penetração, Carga, Salto, Velocidade, Tamanho), cada
uma com sua própria progressão de 6 valores [regras.json:115-257; centelha.md:71-80]. A maioria das
Técnicas, porém, não tem número: são "estados e capacidades" (ver no escuro, voar, imune a veneno),
que resolvem por disputa de poder, não por soma [centelha.md:82]. **ESTÁVEL** nessa mecânica geral.

**Pendências D8 e G15:**
- **D8**: `tecnicas.json` dá "+3 em Ofícios" para Mãos Hábeis (nível 1, batendo com a trilha Bônus);
  `Proezas_revisao.md` (doc de trabalho) dá "+2". Pendência aberta pedindo confirmação antes de
  mexer, porque a Técnica pesa direto no ganho por Ofício
  [docs/pendencias/D-proezas-tecnicas.md:37-40]. **EM REVISÃO.**
- **G15**: como o bônus fixo de uma Proeza entra numa ação Longa não está decidido. O capítulo diz
  que Proezas e Artes "quebram a parede da Longa e levantam a média" [acoes-e-sistema.md:107], mas
  não diz a forma: um "+3 em Ofícios" soma direto à média? E as Técnicas de estado, sem número
  (como Obra Fina, Reparo Veloz), como entram? Há uma sugestão registrada e não aprovada de que a
  Proeza conte como bônus na média, com o número final ainda a definir junto com D8
  [docs/pendencias/G-acoes-sistema.md:147-150]. **NÃO EXISTE** regra fechada; pendência aberta.

## 7. O que uma Proeza deve fazer por nível

**NÃO EXISTE diretriz de poder por nível** publicada como regra de design (um texto do tipo "no
nível 3, uma Proeza deve fazer X e não mais que Y"). O que existe são as **escalas numéricas** das
oito trilhas (item 6), que fixam a faixa de número para quem já decidiu o tipo de efeito, mas não
dizem **quantos** efeitos, **quão amplo** um escopo pode ser, ou **quantos parâmetros** (alcance,
alvos, duração) uma Técnica de um dado nível pode empilhar de graça. Os parâmetros secundários
(Alcance, Alvos, Duração) têm sua própria escala de 6 valores e o texto diz que uma Técnica "pode
esticar" esses parâmetros "por cima do efeito principal", na mesma lógica do improviso do Arcano
[regras.json:259-284], mas não há regra de quantos pontos de parâmetro um dado nível de Técnica
recebe de graça.

**INFERÊNCIA**, a partir da amostra de 461 Técnicas (Arquivo 2): o **escopo** cresce visivelmente
com o nível dentro de cada Caminho (nível 1: efeitos pontuais, ex. "+3 em Ofícios"; nível 6:
efeitos que reescrevem a cena, ex. transformar-se, dominar hordas, agir fora do tempo normal), mas
essa observação não tem número fechado por trás, é leitura qualitativa do corpus. O funil também
não é uniforme: a maioria dos Caminhos tem 9 Técnicas (uma progressão razoavelmente linear por
nível), mas alguns têm 7, 10, 12 ou 14, e a densidade por nível dentro de um Caminho varia (ver
`D3`, pendência aberta sobre "densidade dos funis": Caminhos reaproveitados têm cerca de 3 Técnicas
no nível 1 contra o padrão de outros, adiado em 23/09/2026 por decisão do autor, "refinamento que
ninguém sentiu falta em mesa") [docs/pendencias/D-proezas-tecnicas.md:11-13].

## 8. Relação com Artes e Magia

**Arte** é o nome do sistema mágico (o "Arcano"): conjuração ligada a um elemento ou foco, com
custo em **Mana** por uso, geometria própria de manifestação (o feitiço "sai em fatias" do
conjurador) e tempo de conjuração medido em Ticks de combate [regras.json → arcano;
docs/pendencias/A-arcano-artes.md:1-12]. **Proeza** é capacidade pessoal do corpo, da voz ou da
mente do personagem, sem custo em Mana (item 6). A fronteira formal entre as duas: Proeza nunca
gasta Mana, Arte sempre gasta Mana quando conjurada fora do improviso grátis; Proeza não tem
geometria de manifestação (alcance/área), Arte tem [regras.json:2148-2149, nota que separa as duas
economias: "é o que separa a economia do Arcano da economia das Proezas (a Energia, essa sim, é o
combustível da cena)"]. **ESTÁVEL** nessa distinção de custo.

**Tradições e o bloqueio C1/C2:** a "Tradição" (que Habilidade rola para conjurar, como a magia se
ensina, quem pode aprender) é a camada que decide os detalhes de conjuração por escola/cultura, e
está **bloqueada**: `C1` (jogadas das Artes, casos de fronteira entre o esquema "Mirado", já em
vigor, e o "Moldado", só proposto) e `C2` (a perícia de conjuração de cada Tradição, e se existe um
traço de Fé/Devoção a criar) seguem em aberto, dependentes de `Trilhas_Feiticaria.md` §6 fechar, o
que não aconteceu [docs/pendencias/C-trilhas-feiticaria.md:5-14]. **Quem pode aprender magia hoje**:
qualquer Centelha 1+ já tem acesso a Mana e Artes [centelha.md:19], então o **acesso bruto** é
regra fechada; o que falta é a Tradição, isto é, **como** cada linhagem ensina e **qual** perícia
rola. **EM REVISÃO** (bloqueada).

## 9. Pendências abertas que afetam Proezas

- **D7** (aberto) · Bônus de Centelha em ataque/defesa: +1 (o que o motor calcula e o capítulo
  publica) ou +2 (uma nota de texto isolada em `regras.json`)? [D-proezas-tecnicas.md:33-36]
- **D8** (aberto) · Mãos Hábeis: +3 (o dado vivo, batendo com a trilha Bônus) ou +2 (o doc de
  trabalho, numeração velha)? [D-proezas-tecnicas.md:37-40]
- **G15** (aberto) · Forma de o bônus fixo de uma Proeza entrar numa ação Longa; sugestão não
  aprovada: bônus soma direto à média, número a fechar junto com D8. [G-acoes-sistema.md:147-150]
- **A4** (aberto) · Rituais: a regra antiga de "metade do Mana no Ritual" morre de vez, ou fica? há
  Efeito que só funciona no modo lento? [A-arcano-artes.md:23-25]
- **A25** (aberto) · A geometria de manifestação das Artes que não põem elemento no mundo (Cura,
  Fascinação, Adivinhação, Conjuração, Metamorfose) não está decidida; o improviso delas hoje vira
  um "Dardo" genérico. [A-arcano-artes.md:78-83]
- **C1/C2** (abertos, bloqueados) · A camada de Tradição inteira (item 8 acima).
- **D3** (adiado) · Densidade dos funis de Técnica por nível, entre Caminhos (item 7 acima).
- **D6** (adiado) · Confirmar que o custo de Técnica e de Arte fica em ×10 fora da recalibração
  geral de XP. [D-proezas-tecnicas.md:30-32]

Nenhuma dessas pendências foi fechada neste dossiê; todas seguem com o status registrado na fonte.

## 10. Glossário

- **Atributo**: capacidade inata (Força, Destreza, Vigor, Influência, Perspicácia, Compostura,
  Percepção, Inteligência, Raciocínio), 1 a 6 no humano.
- **Habilidade**: treino adquirido, soma ao Atributo para montar o pool de dados.
- **Pool**: o punhado de d6 que se rola numa jogada, derivado de Atributo + Habilidade.
- **Dificuldade**: o número fixo que uma tarefa exige superar.
- **Margem**: cada 6 pontos de sobra acima do alvo; vira +1d6 de dano em combate, ou um degrau de
  efeito fora dele.
- **Firula**: bônus concedido pelo Mestre por descrição criativa, que também devolve uma reserva.
- **Centelha**: o traço de tier de poder sobre-humano, 0 a 12, jogável de 0 a 6.
- **Proeza / Técnica**: a capacidade extraordinária pessoal (corpo/voz/mente) que a Centelha
  destrava; "Proeza" é o nome coletivo, "Técnica" é a entrada individual no dado.
  ("Proeza" e "Técnica" às vezes são usados de forma intercambiável no próprio livro.)
- **Caminho**: o grupo temático de Técnicas (50 ao todo), ex. Punho de Ferro, Sombra, Voz de Mel.
- **Arte**: a disciplina de magia (Arcano), custa Mana, tem geometria de manifestação própria.
- **Efeito Especial**: um "molde" de Arte comprado com XP, que faz algo que o improviso cru não faz.
- **Tradição**: a camada (ainda não fechada) de como cada escola/cultura ensina e conjura magia.
- **Energia**: reserva que alimenta Proezas e esforço físico; recupera por cena.
- **Mana**: reserva que alimenta Artes; recupera por hora (ou o dobro em descanso).
- **Força de Vontade**: reserva de determinação, turbina jogadas e resiste a pressão mental/social.
- **Longa**: modo de ação sem dado, por média, para tarefas sem pressa (dias/semanas).
- **Acumulada**: modo de ação com dado e Acúmulo, para tarefas sob pressão mas não instantâneas.
- **Absorção**: quanto de um golpe é descontado antes de virar dano.
- **Defesa (Física/Social/Mental)**: os três valores passivos que um ataque precisa superar.

Fim do dossiê. Ver `proezas-completas.md` para o catálogo integral das 461 Técnicas.
