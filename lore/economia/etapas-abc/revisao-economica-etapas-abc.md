# Revisão econômica do Centelha · Etapas A, B e C (proposta completa)

Estado: PROPOSTA para o autor decidir. Nada foi aplicado no repositório. Todas as contas saem do código em `econ/` (`base.py`, `mercadorias.py`, `modelo.py`, `gerar.py`) e podem ser refeitas pelo Revisor.

## Como ler

1. Cada decisão traz **Decisão**, **Motivo**, **Prós**, **Contras**. Onde a decisão muda o que está escrito hoje no livro, no JSON ou no `Acoes_Sistema.md`, aparece a marca **[DIVERGE]**, com o texto atual e o novo.
2. Onde a regra do personagem de jogador é diferente da regra do mundo, as duas aparecem separadas: **Mundo** e **Jogador**.
3. Legenda das fontes: A = fonte histórica direta; B = compilação sem conflito; C = conta minha (material mais dias de trabalho) ou conflito entre fontes.
4. Âncora de tudo: **1 dia de braçal = 10 pc = 1,5 penny** (Inglaterra, 1300 a 1340). Logo, 1 penny = 6,67 pc; 1 xelim = 80 pc; 1 libra = 16 po.
5. Regra Misto (sua decisão): o que tem linha de fabricação no jogo segue a tabela do jogo; o resto segue a história.

## Resumo das decisões

| # | Ponto | Decisão | Muda o texto? |
|---|---|---|---|
| A1 | Munição | Flechas de guerra e virotes ficam 10 pc o maço de 10; entra Flechas rústicas (10) a 4 pc; regra de recuperação: metade | acrescenta |
| A2 | Equipamento de aventura | Preços pela tabela de mercadorias; duas linhas novas de fabricação (sapato; cadeado) | [DIVERGE] |
| A3 | Mercadorias | 190 itens, com as correções da rodada A2 do Revisor; arquivo próprio `mercadorias.json` | novo |
| A4 | Moeda | pc é a menor moeda; metais por 100 g: ferro 1,5 pc (hoje ¼), cobre 3 pc (hoje 2), prata 3 pp, ouro 3 po, platina 3 pl; joias e letras de câmbio com deságio e taxa | [DIVERGE] |
| B1 | Multiplicador | ×20 em lugar de ×10 na fórmula do ofício | [DIVERGE] |
| B2 | Curva de renda | Convexa, pelo produtor marginal: 20 / 37 / 67 pc por ponto-semana nas faixas de Dif 4 / 7 / 11 | [DIVERGE] |
| B3 | G22 | "Ganho por semana" = renda de 6 jornadas do ofício; meia jornada = meio intervalo | fecha pendência |
| B4 | Tetos e G24 | aldeia 100, vila 300, cidade 1.000, capital sem teto; o teto limita o ganho (líquido de material) | [DIVERGE] |
| B5 | Tabela de Renda | Rendas mantidas; Livre recalculado e decrescente (20% no braçal, 7% na nobreza); colunas refeitas | [DIVERGE] |
| B6 | Recursos | Mapa de faixas para Recursos 1 a 5; Destreinado passa de ●● para ● | [DIVERGE] |
| B7 | Status obrigatório | Regra de viver abaixo do nível, com Temperança, e dívida para manter o status | novo |
| B8 | Consequência nas Fases 1-3 | Placa completa sobe ~39% (Dif 11 feita pelo perito, que ganha mais que o H-×20 supunha) | [DIVERGE] |
| C4 | Custo de vida | Quatro cestas, cinco moradias, sete níveis por pessoa, pacote por família | novo |
| C5 | Montarias e animais | Preços históricos; cavalo de guerra e destrier entram; manutenção semanal | [DIVERGE] |
| C6 | Viagens | Tudo em km; velocidades; preços de passagem, frete e pedágio | [DIVERGE] |
| C7 | Serviços contratados | Tarifa = renda do perfil ÷ 6 (contrato) ou ×1,5 (avulso); lista de 38 serviços; Séquito não custa dinheiro na mesa | novo |
| C8 | Servos e escravos | Criados com salário e casa; escravos 3 a 6 vezes mais caros; sustento 15 pc/semana | [DIVERGE] |
| E1 | Qualidade | Tirar "intervalo sobe um degrau"; Piso de 1 e 2 semanas; Requisito máximo 6; preço pela régua | [DIVERGE] |
| E2 | Reparo e desgaste | Reparo em fração do preço (1/6, 1/3, 3/4); desgaste opcional por marcas | acrescenta |
| E3 | Empréstimo de XP | Regra completa: tempo, preço, dívida | novo |
| E4 | Rações | Ração de viagem 3 pc; ração de cavalo 4 pc; estábulo 7 pc | [DIVERGE] |
| E5 | Pacote inicial | Bolsa de 4 semanas de Livre na criação | novo |
| E6 | Arquivos do site | `mercadorias.json` próprio; procedência no lore; tarifas em arquivos próprios | novo |
| E7 | Correções de texto | Salto entre degraus, fórmula, tetos, Renda, Qualidade, Itens Gerais | [DIVERGE] |

---

# Etapa A · aplicação da régua

## A1. Munição

**Decisão.**

1. Flechas (10): **10 pc**, como hoje. Virotes (10): **10 pc**, como hoje.
2. Entra **Flechas rústicas (10): 4 pc**. Flecha de caça, sem ponta de aço; o Mestre pode tratá-la como qualidade Tosca contra armadura.
3. Regra de recuperação (nova): depois do combate, se o grupo controla o campo e gasta alguns minutos procurando, **recupera metade das flechas e virotes disparados**, arredondando para baixo. Flechas rústicas: um terço. Arremesso "Recuperável" (machado, azagaia) continua como está: recupera tudo que não se perdeu na ficção.

**Motivo.** A munição tem linha de fabricação no jogo, então pela regra Misto segue a tabela. Com a jornada de artesão de 8 horas:

| Linha | Horas (avulso) | Por 10, avulso | Por 10, lote | Histórico por 10 |
|---|---|---|---|---|
| Flecha de guerra (dúzia) | 2,29 | 9,3 | 7,3 | 38,9 |
| Flecha rústica (dúzia) | 1,08 | 4,4 | 3,3 |  |
| Virote (dúzia, H-peso-B 0,5/0,3) | 3,43 | 13,9 | 11,9 | 10,7 |


1. A flecha de guerra sai entre 7,3 (lote) e 9,3 (avulso) por 10. O preço atual, 10, fica 1,08 vez o avulso: dentro da regra D1 das Fases 1-3.
2. O virote não tem linha. Pela Peça da flecha escalada pelo peso (H-peso-B, 0,5 kg contra 0,3 kg), sai entre 11,9 e 13,9. O preço atual, 10, fica a 20% disso; mantido pela regra R-estável (explicada em A2). O histórico dá 10,7: bate.
3. A flecha de guerra histórica custava 3,9 vezes mais (14 d o feixe de 24, em 1341: ~39 pc por 10). É a mesma distância que já apareceu nas armaduras: **o que é fabricado no Centelha é mais barato que a história, e de forma consistente.** Não é erro da munição; é a escolha Misto funcionando.
4. Recuperação: não achei registro histórico de recolher flechas de forma sistemática, e as encomendas reais (850.000 flechas em 1359) mostram que eram tratadas como consumo. A regra da metade é de jogo: simples, dá valor ao tempo gasto depois da luta e mantém a munição como gasto real.

**Prós.** Nenhum preço muda; a flecha rústica dá opção barata ao caçador pobre.
**Contras.** A regra de recuperação é nova e não tem base histórica.

## A2. Equipamento de aventura

**Decisão.**

1. Todo item de equipamento de aventura passa a ter o preço da tabela de mercadorias (anexo). Os ids do `precos.json` são mantidos onde o item é o mesmo, para não quebrar os pacotes.
2. **R-estável:** quando o preço novo fica a menos de 30% do atual, fica o atual. Motivo: não mexer no que já estava certo por causa de arredondamento. Aplicado em 10 itens (entre eles Baú, Lâmpada, Frasco de óleo, Faca pequena, Pimenta, Cravo, Roupa fina).
3. **Refinamento da regra Misto** [DIVERGE]: a tabela de fabricação vale para armas, armaduras, escudos, munição e sela. Para objetos do dia a dia que caem numa linha genérica, quando a linha dá mais de 2 vezes o preço histórico, **cria-se uma linha própria calibrada**, em vez de encarecer o objeto. Duas linhas novas:

| Linha nova | Ofício | Req | Dif | Mont | Peça | Dias (avulso) | Avulso | Lote | Histórico |
|---|---|---|---|---|---|---|---|---|---|
| Sapato, bota de uso | Couraria, Ofícios Gerais | 1 | 4 | 2 | 4 | 0,92 | 36,0 | 25,5 | 40,0 |
| Cadeado, grilhão, dobradiça grande | Ferreiro, Serralheria | 2 | 7 | 2 | 4 | 1,71 | 66,9 | 47,4 | 44,3 |


   1. O sapato: pela linha existente "Sela, arreio, bota" (Curtume, Dif 7), uma bota sai ~134 pc, 3 vezes o sapato histórico (40). A linha nova (Dif 4) dá 26 a 36, e o preço de mercado 40 fica 1,1 vez o avulso.
   2. O cadeado: a única linha próxima era "Fechadura, engenho" (Req 5, Dif 11, fechada ao oficial), que é fechadura de segredo. A linha nova dá 47 a 67, e o derivado (45) fica logo abaixo do lote.
   3. Os outros casos que o Revisor apontou se resolvem sem linha nova: o Baú simples cai na linha "Porta, banco, mesa tosca" (~36, preço 50); a arca é o "Baú de boa qualidade" (170), na linha de móvel bem-acabado; a bota de montar fica em 100 (derivada), abaixo da linha de sela.
4. O "machado" da linha "Faca, machado, ponta de lança" (pendência G27) passa a ser **machadinha ou machado de ferramenta**, e não o machado de lenhador inteiro. Assim a linha continua sendo de peça pequena.

**Consequência que precisa estar no livro.** O equipamento básico fica mais caro. Mochila 20 → 100; corda 10 → 25; saco de dormir 10 → 60; cobertor 5 → 65; tocha 1 → 7. **Correção de uma afirmação minha:** eu tinha dito que o aventureiro se equipa com 2 a 3 semanas de braçal. Estava errado: o pacote Aventureiro, pelos preços da versão anterior, dava 489 pc, ou 8,2 semanas de renda bruta do braçal. O Revisor recalcula os sete pacotes com a versão nova.

**Prós.** Os objetos do dia a dia ficam coerentes com a comida e o salário; a regra de linha própria impede que uma linha genérica infle um sapato.
**Contras.** Duas linhas novas na tabela de fabricação; o começo de campanha fica mais caro. Se isso incomodar, a saída é o **pacote inicial pelo Recursos** (E5), não baixar o preço.

## A3. Mercadorias

**Decisão.** Tabela de 190 itens (anexo A), com as correções da rodada A2 do Revisor:

1. **Aceitos do Revisor:** o linho comum entra na cesta de subsistência no lugar do burel; a carne sai só do porco; o linho comum vira confiança C; o carvão foi refeito (incluía só a lenha); o "Mel" sai das bebidas; a frase "2 a 3 semanas" foi corrigida.
2. **Incoerências internas resolvidas** (todas conferidas por teste automático no código):
   1. Sebo (8 por libra) < vela de sebo (13). Cera (35) < vela de cera (45).
   2. Leite rebaixado para 3 pc o galão: o leite de uma libra de manteiga (~1,1 galão) fica abaixo da manteiga (9), e o de uma libra de queijo abaixo do queijo (4).
   3. Lençol (25) < saco de dormir (60) < cobertor de lã (65).
   4. Martelo (25) < machado de lenhador (35).
   5. Roupa usada (50) < roupa comum nova (220). Três jardas de burel (165) < roupa nova.
   6. Banco (17) < cadeira (20) < mesa (40). Baú (50) < cofre (100) < arca (170).
   7. Ração de viagem = 3 pc, o mesmo que três refeições de estalagem pobre, e não mais.
3. **Onde discordo do Revisor:** ele propôs o óleo de lamparina a 25, a partir do sebo da MtD (7,44 d/kg). Como o sebo da MtD estava acima da vela pronta, rebaixei o sebo, e o óleo fica em 10 (o preço do catálogo, pela R-estável).
4. **Calibração circular (ponto do Revisor):** aceito. A MtD é Hodges ×8 em 20 de 34 comparações; o acordo confirma a unidade, não o preço. A prova independente está em outro lugar: as cestas montadas com esses preços reproduzem o padrão de vida que a história econômica encontra para Londres antes da Peste (seção C4). Isso testa o conjunto, não item a item.
5. **Datas:** 10 das 12 ferramentas com data são de 1457 a 1514. O preço nominal das ferramentas em pence mudou pouco entre 1300 e 1500 (o que subiu foi o salário), então converter pela âncora de 1300 fica certo em pence. Fica marcado como [H].
6. **Itens que faltavam** (lista do Revisor): os 13 do `precos.json` e os do catálogo (cerveja ruim, vinho ruim, frutas, roupas de viajante, artista e robe, temperos, prata, ouro, alforje, animais) agora têm preço. Os que não mudam têm a nota "Mantido".

## A4. Moeda

**Decisões.**

1. **A menor moeda é o pc** (sua decisão). Tudo que valeria menos que 1 pc é vendido em lote (ovos por dúzia, arenque por meia dúzia, anzóis por dúzia) ou arredonda para 1.
2. **Metais por 100 g** [DIVERGE pequeno]: cobre **3 pc** (hoje 2), ferro **1,5 pc** (hoje ¼), prata **3 pp** (igual), ouro **3 po** (igual), platina **3 pl** (nova).
   - Motivo: com moedas de 30 g, cada metal vale quase o próprio peso. O cobre da tabela histórica sai a 2,8 pc por 100 g, e a moeda de cobre vale ~0,8 pc em metal. O cobre do Centelha é o cobre da história.
   - A prata e o ouro do Centelha valem ~15 vezes menos que na história, em dias de trabalho (na Inglaterra, 100 g de prata valiam 69 pence, ~460 pc). **É uma escolha de mundo, e boa:** um mundo onde prata e ouro são mais comuns. A razão ouro:prata de 10:1 fica perto da histórica (11:1).
   - Platina a 10 vezes o ouro fecha a série decimal: cada metal vale 10 vezes o anterior, sempre em moedas de 30 g.
3. **O peso do dinheiro** (consequência que o livro precisa dizer):

| Quantia | Peso |
|---|---|
| 100 moedas (qualquer metal) | 3 kg |
| Renda semanal do braçal (60 pc em cobre) | 1,8 kg |
| 1.000 po em ouro | 30 kg |

   Carregar fortuna em moeda é inviável. É exatamente o seu argumento para joias e cristais.
4. **Joias, cristais e metal como moeda** (regra nova, Mundo e Jogador):
   1. Uma joia ou cristal tem um **valor de avaliação** (Joalheria, ou Comerciante para uma avaliação grosseira).
   2. **Comprar** paga o valor cheio. **Vender** rende: cidade 80%; vila 60%; aldeia 40%, e só se houver quem pague.
   3. Barras de metal valem o peso pela tabela de metais, com 10% de deságio fora da cidade.
   4. **Letras de câmbio** (bancos, casas de comércio, ordens): depositar numa cidade e sacar noutra custa **2% mais 1% por mês de prazo**. O prazo é ~1 mês por 1.000 km de rota. Histórico: câmbio Bruges-Barcelona rendia ~12,5% ao ano (1399-1400), ~1% ao mês.
   5. **Troca de moeda estrangeira:** 5%.
5. **Modificador regional** (sua decisão de deixar para depois; fica só a estrutura): uma camada única para tudo, e não uma por categoria. Proposta: produto local ×0,5 a ×1; de região vizinha ×1; importado ×2; de longe ×4 a ×10; proibido ou raro, o Mestre decide. A camada vale para comida, metal, animal, especiaria, e também para o acesso das armaduras (Lamelar).

**Prós.** Os metais passam a ter preço coerente com a moeda; joias ganham regra de uso sem inventar mecânica.
**Contras.** O deságio de joia é número de jogo, sem fonte; letras de câmbio pedem que o Mestre saiba onde há casas de câmbio.

---

# Etapa B · salários

## B1. O multiplicador: ×20

**Decisão** [DIVERGE]. A fórmula do ofício passa de `(média − 4) × 10 pc` para `(média − 4) × 20 pc`. O exemplo do capítulo muda de "o oficial tira 65 pc, o perito 120, o mestre 170" para os valores da curva de B2.

**Motivo.** As três faixas de baixo da tabela de Renda já seguem ×20 (soma 4 dá 60, soma 5 dá 100). Com ×10, o braçal ganha 30 pc por semana, e só a subsistência de uma pessoa em estalagem custa 48. As Fases 1-3 já foram precificadas com ×20.

**Prós.** Uma escala só no livro inteiro; fecha a incoerência que a própria revisão do projeto já tinha achado ("o artesão treinado ganha o mesmo que o braçal").
**Contras.** Nenhum relevante; é correção de um fator 2 perdido.

## B2. A curva da renda: convexa, pelo produtor marginal

**Decisão** [DIVERGE]. Renda de trabalho por semana = **o melhor (média − Dif) × valor da faixa**, entre as faixas de Dificuldade que a Habilidade alcança pelo Requisito:

| Faixa de trabalho | Dificuldade | Requisito típico | Valor por ponto-semana |
|---|---|---|---|
| Serviço simples | 4 | nenhum | 20 pc |
| Ofício | 7 | 2 a 3 | 37 pc |
| Arte rara | 11 | 4 a 5 | 67 pc |

| Soma | Média | Linear (x20) | Proposta | Faixa de Dif | x braçal |
|---|---|---|---|---|---|
| 4 | 7,0 | 60 | 60 | 4 | 1,0 |
| 5 | 9,0 | 100 | 100 | 4 | 1,7 |
| 6 | 10,5 | 130 | 130 | 4 | 2,2 |
| 7 | 12,5 | 170 | 200 | 7 | 3,4 |
| 8 | 14,0 | 200 | 260 | 7 | 4,3 |
| 9 | 16,0 | 240 | 330 | 7 | 5,6 |
| 10 | 17,5 | 270 | 430 | 11 | 7,2 |
| 11 | 19,5 | 310 | 570 | 11 | 9,5 |
| 12 | 21,0 | 340 | 670 | 11 | 11,1 |


**De onde vêm 37 e 67, sem chute.** O preço de um produto é dado pelo **produtor mais barato que consegue fazê-lo** (é a mesma regra T3/T3-F das Fases 1-3). Para esse produtor, fazer a peça difícil tem de render o mesmo que a alternativa dele:

1. O oficial (média 10,5) pode fazer serviço simples (6,5 × 20 = 130) ou espada (Dif 7). Ele só faz espada se render o mesmo: 130 ÷ 3,5 = **37,1 pc por ponto**.
2. O perito (média 16) pode fazer peça de Dif 7 (9 × 37,1 = 334) ou de Dif 11. Idem: 334 ÷ 5 = **66,9 pc por ponto**.

Isso substitui os valores 42 e 85 que usamos antes: o 42 vinha do preço das armas (circular) e o 85 era extrapolação. Agora os dois saem de uma regra só, que já está nas Fases 1-3.

**Confere com a tabela de Renda e com a história:**

1. **A curva cabe na tabela de Renda:** Treinado 270 ≈ soma 8 (260); Especialista 550 ≈ soma 11 (570); Doutor 820 pede soma 12 com Proeza +3 (870). Não é prova independente, porque escolhi a soma de cada faixa depois; o que a conta garante é que a tabela não pede nada impossível para uma ficha.
2. **História:** o oficial (2,2 vezes o braçal) bate com o telhador (~2 vezes o ajudante) e o mestre pedreiro comum (~2,7 vezes). No topo, a curva é mais íngreme que a história: o mestre de soma 12 (Habilidade 6, "lendário") ganha 11 vezes o braçal, e só o topo raro chegava a isso (médico do rei, ~22 vezes, £40 por ano). É escolha de jogo: você pediu que habilidade alta valesse muito mais.
3. "Habilidade alta vale mais que várias baixas" (seu pedido): subir de soma 6 para 12 multiplica a renda por 5, contra 2,6 na fórmula linear.

**Regras de uso:**

1. **Bônus:** a Habilidade mais alta que cobre o trabalho entra no pool; a mais alta entre as restantes que também cobrem soma como bônus fixo; nunca mais de uma. É a lógica da §5.5 aplicada à renda.
2. **Proezas** contam se o bônus for permanente e se aplicar ao trabalho. **Firula não conta:** a renda é Longa, sem jogada.
3. O Requisito trava a faixa: quem não tem Habilidade 4 não entra na Dif 11, por mais Proeza que tenha. Um oficial com +15 fica preso na Dif 7 (690 pc), abaixo de um mestre humano com +3.

| Bônus de Proeza (mestre, soma 12) | Renda por semana |
|---|---|
| +0 | 670 |
| +3 | 870 |
| +4 | 940 |
| +6 | 1.100 |
| +9 | 1.300 |
| +12 | 1.500 |
| +15 | 1.700 |


**Prós.** Convexa como você queria; reproduz a tabela; sai da mesma régua das Fases 1-3; o valor por ponto não é mais parâmetro livre.
**Contras.** Três números de faixa em vez de um. O valor da Dif 11 depende de o perito ser o produtor marginal da arte rara; se o Mestre achar que há poucos peritos, o valor sobe (isso é o modificador regional, não a regra).

## B3. G22: o que é "Ganho por semana"

**Decisão.** "Ganho por semana" = a renda de **6 jornadas do próprio ofício** (jornada leve 6 h, artesão 8 h, braçal 10 h, decisão já tomada). É a mesma grandeza da coluna Renda/sem. Meia jornada rende meio intervalo; quem trabalha 2 dias entre aventuras ganha 2/6 da semana.

**Motivo.** Fecha a pendência sem criar grandeza nova: fórmula e tabela passam a medir a mesma coisa.

## B4. Tetos de mercado e G24

**Decisão** [DIVERGE].

1. Tetos por ofício no lugar: **aldeia 100, vila 300, cidade 1.000, capital sem teto prático** (hoje 50, 150, 500).
2. **G24:** o teto limita o **ganho** (o valor do trabalho), e não a venda bruta. O material passa por fora.
3. O teto é a demanda total daquele ofício no lugar, dividida entre quem o exerce.
4. O trabalho braçal não tem teto; é sazonal (o Mestre pode cortar pela metade no inverno).

**Motivo.** Com os tetos antigos, a aldeia não paga ao seu único artesão nem o salário do braçal (50 contra 60). Com os novos:

1. A aldeia sustenta um artesão por ofício, abaixo do oficial pleno (100 contra 130). O artesão de aldeia é meio lavrador, o que é historicamente certo.
2. A vila absorve até soma 9 (330).
3. A cidade absorve o mestre (670), e a frase do livro "o mestre armeiro se muda para a cidade" continua verdadeira.

**Prós.** Geografia de ofícios: o talento migra para onde há demanda.
**Contras.** Um mestre com Proezas passa do teto da cidade e só se realiza na capital. É desejável, mas precisa estar dito.

## B5. A tabela de Renda nova

**Decisões** (suas, 01:34): a tabela é por família; o gasto de status é obrigatório; o Livre deve cair em proporção conforme a renda sobe. Não há dízimo.

1. **As rendas ficam como estão.** A curva de B2 confirmou os valores de trabalho, e de Abastado para cima a renda é de capital ou de posição.
2. **Livre = Renda × 20% × (60 ÷ Renda)^0,2**, arredondado. Vai de 20% no braçal a 7% na nobreza.
3. **Custo = Renda − Livre**, e inclui o estilo de vida obrigatório.
4. As colunas mês e ano passam a ser 4 e 48 semanas exatas [DIVERGE]: a tabela atual tem Braçal 22 pp/mês (deveria ser 24) e Livre/ano 38 pp (deveria ser 48 a 10 pc por semana).

| Recursos | Faixa | Renda/sem | Renda/mês | Livre/sem | Livre % | Livre/mês | Livre/ano | Custo/sem | Nível de vida |
|---|---|---|---|---|---|---|---|---|---|
| ● | Braçal | 60 | 240 | 12 | 20,0% | 48 | 576 | 48 | Pobre |
| ● | Destreinado | 100 | 400 | 18 | 18,0% | 72 | 864 | 82 | Pobre |
| ●● | Treinado | 270 | 1.080 | 40 | 14,8% | 160 | 1.920 | 230 | Modesto |
| ●●● | Especialista | 550 | 2.200 | 70 | 12,7% | 280 | 3.360 | 480 | Confortável |
| ●●● | Doutor | 820 | 3.280 | 95 | 11,6% | 380 | 4.560 | 725 | Confortável |
| ●●●● | Abastado | 1.400 | 5.600 | 150 | 10,7% | 600 | 7.200 | 1.250 | Abastado |
| ●●●● | Rico | 2.700 | 10.800 | 250 | 9,3% | 1.000 | 12.000 | 2.450 | Rico |
| ●●●●● | Aristocrata | 4.200 | 16.800 | 360 | 8,6% | 1.440 | 17.280 | 3.840 | Aristocrata |
| ●●●●● | Nobreza | 10.000 | 40.000 | 720 | 7,2% | 2.880 | 34.560 | 9.280 | Aristocrata |


**O que o custo compra**, montado de baixo para cima com os preços desta revisão (família de 3 adultos-equivalentes: casal e duas crianças):

| Faixa | Custo/sem | Pacote básico | Estilo de vida (resto) | Estilo % do custo | O que o pacote cobre |
|---|---|---|---|---|---|
| Braçal | 48 | 45 | 3 | 6% | 3 adultos-equivalentes, cesta de subsistência (36); Choupana (9) |
| Destreinado | 82 | 75 | 7 | 8% | 3 AE, cesta modesta (66); Choupana (9) |
| Treinado | 230 | 181 | 49 | 21% | 3 AE, cesta respeitável (96); Casa de artesão (35); Aprendiz (19); Roupa de artesão nova para o casal, por ano (10); Mula ou cavalo dividido (meio) (21) |
| Especialista | 480 | 366 | 114 | 24% | 3 AE, cesta respeitável (96); Casa de mercador (88); 2 criados (99); Um cavalo (42); Roupa fina para o casal, por ano (42) |
| Doutor | 725 | 557 | 168 | 23% | 3 AE, cesta farta (200); Casa de mercador (88); 2 criados e 1 cozinheiro (161); Um cavalo (42); Roupa fina para o casal, por ano (42); Livros, um por ano (25) |
| Abastado | 1.250 | 1.027 | 223 | 18% | 3 AE, cesta farta (200); Casa senhorial pequena (351); 4 criados, cozinheiro, cavalariço (310); Dois cavalos (83); Roupa fina, 2 por adulto por ano (83) |
| Rico | 2.450 | 1.897 | 553 | 23% | 3 AE, cesta de luxo (693); Casa senhorial pequena (351); Valete, 4 criados, cozinheiro, 2 cavalariços (478); Quatro cavalos (166); Roupa de corte, 1 por adulto por ano (208) |
| Aristocrata | 3.840 | 3.062 | 778 | 20% | 3 AE, cesta de luxo (693); Casa senhorial (351); Mordomo, 2 valetes, 6 criados, cozinheiro, 2 cavalariços (939); 4 guardas (250); Cavalo de guerra e 3 cavalos (413); Roupa de corte, 2 por adulto por ano (417) |
| Nobreza | 9.280 | 7.535 | 1.745 | 19% | 3 AE, cesta de luxo (693); Paço (1.753); Casa: mordomo, capelão, 2 escudeiros, 6 valetes, 12 criados, 3 cozinheiros, 4 cavalariços (2.346); 12 guardas (750); 2 cavalos de guerra e 8 cavalos (909); Roupa de corte 2 e gala 1 por adulto por ano (1.083) |


**Leitura.** O "estilo de vida" é o que sobra do custo depois do pacote básico: hospitalidade, presentes, festas, hobbies, vícios, aparência. Ele é quase nada no braçal (6%) e fica em ~20% do custo a partir do Treinado. **É exatamente o seu argumento:** o pobre gasta com sobrevivência, o rico com futilidade; e em proporção o rico guarda menos.

**Conferência histórica em libras por ano:** Braçal £1,8 (Hodges: no máximo £2 c. 1300); Especialista £16,5; Doutor £25 (a renda mínima de um cavaleiro era £20 em 1278); Rico £81; Aristocrata £126 (cavaleiro bandeirado); Nobreza £300 (barão). Condes (£1.000 ou mais) ficam acima da tabela, no Recursos 6.

**Mundo.** A tabela é por família. Um artesão solteiro gasta menos em comida e mais em taverna; o Livre é o mesmo.
**Jogador.** O Livre da tabela vale para o personagem, com ou sem família. Quem não tem família gasta a diferença em estilo (o Mestre narra onde). Guardar mais que o Livre exige motivo (B7).

**Prós.** O Livre desce como você quer; a nobreza sai de 1.400 para 720 pc livres por semana; cada faixa tem um pacote verificável.
**Contras.** A potência 0,2 é escolha de design, não medida. Para o braçal, 20% de Livre é mais do que a história daria: uma família pobre real guardava quase nada. Uma semana de doença zera a poupança dele, e o Mestre pode usar isso.

## B6. Recursos

**Decisão** [DIVERGE]:

| Recursos | Faixas | Descrição do livro que confirma |
|---|---|---|
| 1 Remediado | Braçal, Destreinado | "tem o que comer e onde dormir; despesa grande dói" |
| 2 Confortável | Treinado | "artesão bem posto; talvez um cavalo" (rocim = 60 semanas de Livre) |
| 3 Próspero | Especialista, Doutor | "criados, montaria, armadura de qualidade" (o pacote tem 2 criados e cavalo) |
| 4 Rico | Abastado, Rico | "casa senhorial" (o pacote tem casa senhorial) |
| 5 Fortuna de nobre | Aristocrata, Nobreza | "uma pequena guarnição paga" (o pacote tem 4 a 12 guardas) |
| 6 Fortuna de reino | acima da tabela | o Mestre define |

1. O Destreinado passa de ●● para ●. Com 18 pc livres por semana, ele não tem nada do que o Recursos 2 descreve.
2. Recursos continua atribuído pelo Mestre (convenção já aceita). A tabela é a referência do padrão de vida, não uma conta automática.

## B7. Status obrigatório: viver abaixo do nível

**Decisão** (a partir da sua regra). Cada faixa tem um nível de vida obrigatório (última coluna da tabela de Renda).

**Mundo.** O NPC mantém o nível, e se endivida para isso. Um mercador que perde a renda continua gastando como mercador por meses, e é assim que casas quebram.

**Jogador.**

1. Viver **um nível abaixo** da faixa: uma jogada de **Temperança** por semana (Dificuldade baixa, o Mestre define). Falhou, gastou no nível normal naquela semana.
2. Viver **dois ou mais níveis abaixo:** a mesma jogada com Dificuldade maior, e enquanto durar, **não recupera Força de Vontade pelo descanso**. O Mestre pode trocar por penalidade social com os pares.
3. **Motivo declarado dispensa a jogada:** promessa, avareza escrita como traço, Virtude alta (Temperança 4 ou mais), uma meta de história. O Mestre julga se é plausível.
4. O Mestre pode gastar o dinheiro pelo personagem que tenta poupar sem motivo (sua regra, dita às 01:34).

**Prós.** O dinheiro do rico não acumula sem controle; o custo é narrativo, não contábil.
**Contras.** Exige julgamento do Mestre; a Dificuldade da jogada fica sem número fixo.

## B8. Consequência nas Fases 1-3: a Placa completa

**Decisão** [DIVERGE, recomendada]. A Placa completa (Dif 11, feita pelo perito) sobe de 2.600 para **~3.600 pc**.

**Motivo.** Nas Fases 1-3, o custo do perito entrou pelo H-×20 (240 por semana), que é a renda dele em serviço simples. Pela curva de B2, a alternativa real do perito é a Dif 7 (334). O custo dele é 39% maior, e a Placa sobe na mesma proporção. Pelo estado da revisão, é a única peça das Fases 1-3 precificada pelo perito; o Revisor confere se há outra (Transição e Articulada, pelo acesso).

**Prós.** Uma régua só para preço e renda. **Contras.** Reabre um item fechado. Se preferir não mexer, fica registrado como exceção.

---

# Etapa C · o que usa o salário como âncora

## C4. Custo de vida

**Decisão.** Quatro cestas de consumo por adulto-equivalente, cinco moradias, sete níveis de vida por pessoa e um pacote por família em cada faixa (B5). O arquivo é `custo-de-vida.json`.

**Cestas** (quantidades de Robert Allen, preços da tabela de mercadorias; a subsistência usa linho comum, pela proposta do Revisor):

| Cesta (por adulto-equivalente) | pc por ano (365 d) | pc por semana | pc por dia |
|---|---|---|---|
| Subsistência | 553 | 12,1 | 1,51 |
| Respeitável | 1.465 | 32,1 | 4,01 |
| Farta | 3.042 | 66,7 | 8,33 |
| Luxo | 10.543 | 231,1 | 28,89 |
| Modesta (meio a meio) | 1.009 | 22,1 | 2,76 |



Subsistência:

| Item | Quantidade/ano | pc/ano |
|---|---|---|
| Aveia | 155 kg | 232 |
| Feijão/ervilha | 20 kg | 27 |
| Carne | 5 kg | 22 |
| Manteiga | 3 kg | 61 |
| Sabão | 1,3 kg | 38 |
| Linho comum | 3 m | 66 |
| Velas de sebo | 1,3 kg | 38 |
| Óleo de lamparina | 1,3 L | 26 |
| Combustível |  | 44 |

Respeitável:

| Item | Quantidade/ano | pc/ano |
|---|---|---|
| Pão | 182 kg | 485 |
| Feijão/ervilha | 34 kg | 45 |
| Carne | 26 kg | 113 |
| Manteiga | 5,2 kg | 105 |
| Queijo | 5,2 kg | 48 |
| Ovos | 52 un | 14 |
| Cerveja | 182 L | 267 |
| Sabão | 2,6 kg | 76 |
| Linho comum | 5 m | 109 |
| Velas de sebo | 2,6 kg | 76 |
| Óleo de lamparina | 2,6 L | 52 |
| Combustível |  | 73 |


1. Farta = respeitável com o dobro de carne, metade da cerveja trocada por vinho, tecido de lã, velas de cera e especiarias. Luxo = vinho bom, caça, lã fina, açafrão.
2. **Calendário:** Allen e Hodges medem por ano de 365 dias. Convertido por dia e multiplicado por 8.
3. **Conferência histórica** (tudo em ano de 365 dias): o braçal ganha ~411 d. A família dele na subsistência, com choupana, custa 309 d: a renda é 1,33 vez o custo. Na cesta respeitável, com casa de artesão, custa 899 d, e a renda cobre 0,46 disso. É o quadro do trabalhador inglês antes da Peste: vive no limite, sem conforto. As cestas acima dela batem com as rações de casa senhorial de 1380 (cavalariço ~1 d por dia, escudeiro ~4 d, senhor ~7 d): a farta dá 1,3 d por dia (entre cavalariço e criado); a de luxo, 4,3 d (escudeiro).

**Moradia:**

| Moradia | Aluguel anual (hist.) | pc por semana |
|---|---|---|
| Choupana | 60 d | 8,8 |
| Casa de artesão com oficina | 240 d | 35,1 |
| Casa de mercador | 600 d | 87,7 |
| Casa senhorial pequena | 2400 d | 350,7 |
| Paço, solar fortificado | 12000 d | 1.753,4 |


**Níveis de vida por pessoa** (viajante, personagem sem casa, NPC sozinho; e a régua da regra B7):

| Nível | pc/sem (pessoa) | Composição | Estalagem + 3 refeições, por semana |
|---|---|---|---|
| Miserável | 12 | Cesta de subsistência; dorme onde der. |  |
| Pobre | 17 | Subsistência e meia choupana (ou canto alugado). | 48 |
| Modesto | 45 | Cesta respeitável e um quarto. | 128 |
| Confortável | 65 | Respeitável, meia casa, parte de um criado. | 312 |
| Abastado | 200 | Farta, meia casa de mercador, um criado, um cavalo. | 640 |
| Rico | 700 | Luxo, casa de mercador, dois valetes, cavalo, roupa de corte. | 2.320 |
| Aristocrata | 1.500 | Casa senhorial própria e séquito doméstico. | 6.240 |


**Estalagem** (mantida como está). A última coluna mostra que morar em estalagem custa 3 a 5 vezes a vida em casa do mesmo nível. É coerente: a estalagem cobra serviço e não tem a economia de cozinhar para vários. A única mudança é o nome da refeição "Rações", que passa a **Refeição pobre** (1 pc), para não confundir com a Ração de viagem (3 pc).

**Prós.** O custo de vida sai de preços verificáveis; cada faixa tem pacote.
**Contras.** A participação do combustível vem de Londres c. 1750 (marcado [H] pelo Revisor); o erro possível é de poucos pc por semana.

## C5. Montarias, animais, veículos e manutenção

**Decisão** [DIVERGE]. Preços históricos (regra Misto). O cavalo de guerra entra, em dois graus.

| Id | Nome | pc | Catálogo | Fonte | Conf. | Nota |
|---|---|---|---|---|---|---|
| ponei | Pônei ou garrano | 400 | 400 | Derivado | C | Abaixo do cavalo de carga; montaria de criança e de terreno difícil. |
| burro | Burro ou jumento | 670 | 120 | MtD | B | MtD 800 C. O catálogo tem 12 pp. |
| cavalo-carga | Cavalo de carga (sumpter) | 600 |  | Hodges | B | 5 a 10s (séc. XIII). |
| cavalo-tracao | Cavalo de tração ou de arado | 1.300 |  | Langdon | A | Farmer 1276-1300: compra média 16s 10d. |
| boi-tracao | Boi de arado | 920 |  | Langdon | A | Farmer 1276-1300: 11s 6,5d. |
| mula | Mula de sela | 2.400 |  | Derivado | C | Montaria de clérigo e mercador; valia como um rocim. |
| rocim | Rocim (cavalo de montaria comum) | 2.400 | 600 | Derivado | C | Entre o cavalo de tração (16s) e o palafrém (£4-5); £1 10s. É o 'Cavalo' do catálogo. |
| palafrem | Palafrém (montaria fina, de passo) | 7.200 |  | Hodges | B | £4 a 5. |
| corcel | Corcel (courser, caça e guerra leve) | 16.000 |  | Hodges | B | Cavalo de montaria de alta classe, £10 (séc. XIII). |
| cavalo-guerra | Cavalo de guerra de escudeiro | 11.200 |  | Ayton | A | Cavalo de escudeiro ~£7 (1282); avaliação mínima de campanha £5; a média dos homens de armas ia de £7,6 a £16,4 (1282-1364). |
| destrier | Destrier (cavalo de guerra de cavaleiro) | 48.000 |  | Ayton | A | £30 (típico de cavaleiro: £15 a £40; excepcionais £60 a £100). |
| camelo | Camelo | 6.000 | 500 | Derivado | C | Sem fonte europeia. Posto entre o rocim e o palafrém; região de origem com modificador forte para baixo. |
| elefante | Elefante adestrado | 96.000 | 2.800 | Derivado | C | Presente de reis. Sem fonte: posto no dobro de um destrier. Na região de origem, modificador forte para baixo. |
| cao-comum | Cão comum | 20 |  | Derivado | C | Vira-lata ou cão de pastor sem treino. |
| cao-guarda | Cão de guarda adestrado | 150 |  | Derivado | C | Cão comum (20) mais uma semana de adestrador oficial (130). A MtD dá ~1.300 pc, preço de cão de raça. |
| cao-caca | Cão de caça adestrado | 600 |  | Derivado | C | Luxo de senhor. |
| cao-guerra | Cão de guerra | 1.000 |  | Derivado | C |  |
| falcao | Falcão adestrado | 3.300 |  | MtD | B | Luxo nobre; falcoaria. |
| pombo | Pombo-correio treinado | 1.700 |  | MtD | B |  |


**Animais de criação:**

| Id | Nome | pc | Catálogo | Fonte | Conf. | Nota |
|---|---|---|---|---|---|---|
| galinha | Galinha | 3 | 2 | Hodges | A | 2 por 1 d (séc. XIV). |
| ganso | Ganso | 40 |  | Hodges | A | Preço legal em Londres, 1375. |
| porco | Porco | 200 | 30 | Hodges | A | 2s em Somerset, 3s em Londres (1338). |
| ovelha | Ovelha | 110 | 30 | Hodges | A | 1s 5d (meados do séc. XIV). |
| carneiro | Carneiro capado | 80 |  | MtD | B | 9 a 10 d em Somerset, 1s 5d em Londres. |
| cabra | Cabra | 65 | 50 | MtD | B |  |
| vaca | Vaca | 750 | 160 | Hodges | A | 9s 5d (meados do séc. XIV). |
| touro | Touro | 1.000 | 100 | Derivado | C | 1301: touro 8s contra vaca 6s; aplicada a mesma razão (4/3) à vaca de 9s 5d. |
| potro | Cavalo de criação (não adestrado) | 1.300 | 140 | Langdon | B | O preço do cavalo de tração sem o preço do adestramento para sela. |


**Arreios e manutenção:**

| Id | Nome | pc | Fonte | Nota |
|---|---|---|---|---|
| sela | Sela comum | 130 | Tabela do jogo | Linha 'Sela, arreio, bota' (Curtume, Req 2, Dif 7, Mont 3, Peça 9) avulsa: ~134. |
| sela-guerra | Sela de guerra (qualidade Boa) | 290 | Tabela do jogo | Sela Boa pela régua de qualidade (~2,2x). |
| arreio | Arreio e rédeas | 60 | Derivado | Metade da sela. |
| cangalha | Cangalha (sela de carga) | 45 | Derivado |  |
| ferradura | Ferragem completa (4 ferraduras, cravos, ferrador) | 40 | Hodges | 4 ferraduras a ~1,2 d, 32 cravos (20 d o milheiro, 1299-1300) e o ferrador: ~5,6 d. Langdon: 14 d por ano num cavalo de carroça (já incluído na manutenção semanal). |
| racao-cavalo | Ração de cavalo (grão e feno) | 4 | Langdon | 6,65 quarters de aveia por ano a 2s 4d: ~3,4 pc por dia, mais feno. |
| estabulo | Estábulo com ração, por noite (estalagem) | 7 | Hodges | Fodder de estalagem, 1331. |


**Veículos:**

| Id | Nome | pc | Catálogo | Fonte | Conf. | Nota |
|---|---|---|---|---|---|---|
| carroca | Carroça de duas rodas | 300 | 300 | Catálogo | B | Hodges: carroça ferrada 4s (c. 1350) = 320. Mantido 3 po. |
| carro-quatro-rodas | Carroção de quatro rodas | 800 |  | Derivado | C | Dobro de peças e eixos da carroça, com margem. |
| carruagem | Carruagem | 12.800 | 2.000 | Hodges | B | 'Chariot' £8 (1381). O catálogo tem 20 po. |
| carruagem-luxo | Carruagem de luxo | 640.000 |  | Hodges | B | Carruagem de rainha, £400. Tesouro, não mercadoria. |
| treno | Trenó | 100 | 100 | Catálogo | B | Mantido. |
| barco-remo | Barco a remo | 400 |  | Derivado | C | Sem fonte. Uma semana de carpinteiro naval e madeira. |
| barco-pesca | Barco de pesca com vela | 3.000 |  | Derivado | C | Sem fonte. Construção naval de semanas. |
| coca | Navio mercante (coca) | 400.000 |  | Derivado | C | Sem preço direto antes de 1450; posto perto das galeras reais de 1295. |
| galera | Galera de guerra (~120 remos) | 688.000 |  | Exchequer 1295 | A | £321 a £540 cada (1295); média ~£430. |


**Manutenção por semana:**

| Animal | pc por semana | Fonte |
|---|---|---|
| Cavalo comum (grão, feno, ferragem) | 42 | Langdon: 23s 8½d por ano, cavalo de carroça, 1250-1320 |
| Cavalo de guerra | 290 | 1287: 5,4 d por dia para o cavalo de guerra de um conde |
| Boi de arado | 13 | Langdon: 7s 2½d por ano |

**Consequências para o jogo:**

1. Rocim 24 po (hoje 6 po). O Treinado junta o preço em 60 semanas de Livre, o Especialista em 34. Bate com "talvez um cavalo" no Recursos 2.
2. Manter um cavalo custa 42 pc por semana, 70% da renda do braçal. Cavalo é bem de quem tem Recursos 2 para cima.
3. O destrier (480 po) é coisa de cavaleiro rico. Manter um custa 290 pc por semana. O pacote da faixa Aristocrata já inclui um.
4. O cavalo de criação (13 po) mais o adestramento (10 po, serviço em C7) explicam o rocim (24 po). O catálogo já dizia que a diferença é o adestramento; agora a diferença tem preço.

**Prós.** Você queria que o cavalo valesse mais que a espada: o rocim vale 10 espadas longas.
**Contras.** Sem fonte europeia para camelo, elefante, cães de trabalho e barcos: são contas minhas (C).

## C6. Viagens

**Decisão** [DIVERGE]. Tudo em km. As velocidades seguem as referências do mapa de Uldun (a pé 25, caravana 30, a cavalo 50 para grupo pequeno) e os tempos históricos (comitiva grande 24 a 32 km; mensageiro com troca, 110 ou mais).

| Modo | km por dia |
|---|---|
| A pé | 25 |
| A pé, marcha forçada | 40 |
| Caravana | 30 |
| Carroça pesada ou carro de bois | 15 |
| A cavalo, comitiva grande | 30 |
| A cavalo, grupo pequeno | 50 |
| Mensageiro a cavalo, sem troca | 60 |
| Mensageiro com troca de cavalos | 110 |
| Navio mercante | 120 |
| Galera | 80 |
| Barco, rio abaixo | 60 |
| Barco, rio acima | 25 |


| Id | Serviço | pc | Unidade |
|---|---|---|---|
| caravana-carroca | Caravana, lugar em carroça (bagagem até 20 kg) | 6 | 10 km |
| caravana-pe | Caravana, a pé junto (proteção e bagagem leve) | 5 | dia |
| navio | Navio, passagem no convés | 3 | 10 km |
| navio-cabine | Navio, lugar coberto | 10 | 10 km |
| barco-rio | Barco de rio, passagem | 1 | 10 km (rio abaixo); x2 rio acima |
| cavalo-aluguel | Cavalo de aluguel (hackney) | 17 | 10 km |
| carroca-aluguel | Carroça com carroceiro e parelha | 60 | dia |
| frete-terra | Frete por terra | 4 | tonelada por km |
| frete-rio | Frete por rio | 2 | tonelada por km |
| frete-mar | Frete por mar | 1 | 2 toneladas por km |
| transporte-cidade | Transporte na cidade (barqueiro, carroceiro, liteira) | 2 | trajeto curto |
| balsa | Balsa | 2 | pessoa; 5 com cavalo |
| pedagio | Pedágio de ponte ou estrada | 1 | pessoa; 3 por animal; 10 por carroça |


**Motivo e conferência:**

1. **Caravana:** uma carroça com carroceiro e parelha custa ~60 pc por dia (entre 30, pela soma de salário e manutenção, e 147, o preço pago em 1342, que inclui guerra e mais cavalos). Com 4 passageiros e 30 km por dia, o lugar sai 0,5 pc por km. O catálogo cobra 1 po por 100 milhas = **0,62 pc por km. O preço atual estava certo;** só muda a unidade (6 pc a cada 10 km).
2. **Navio:** o catálogo cobra 0,31 pc por km. O frete histórico de vinho (Bordeaux a Bristol, 8s o tonel) dá 0,7 pc por tonelada-km, e um passageiro ocupa menos que uma tonelada. Mantido (3 pc a cada 10 km).
3. **Frete:** terra, rio e mar na proporção 8:4:1 (Masschaele, c. 1300).
4. **"Municipal 6 pc por milha" sai** [DIVERGE]: não correspondia a nada identificável. Entram Transporte na cidade (2 pc o trajeto) e Cavalo de aluguel (17 pc a cada 10 km; 1396: 12 d por 30 milhas).
5. **Hospedagem na estrada** = tabela de estalagem.

**Prós.** Unidade do mapa; preço de caravana e navio confirmado.
**Contras.** As velocidades são referência, não regra de movimento; o terreno fica com o Mestre.

## C7. Serviços contratados

**Decisão.** Tarifa por perfil de quem é contratado:

1. **Contrato** (semanas ou mais): diária = renda semanal do perfil ÷ 6.
2. **Avulso** (um dia, um serviço): diária × 1,5. A história confirma: diarista ganhava mais por dia que o criado anual, que tinha casa e comida.
3. **Por hora:** diária avulsa ÷ jornada do ofício (leve 6 h, artesão 8 h, braçal 10 h). Mínimo de uma hora.
4. Comida e riscos: em contrato longo, quem contrata dá a comida ou paga a Ração de viagem. Em guerra declarada, +50% e parte do butim.

| Perfil | Soma | Renda/sem | Diária (contrato) | Diária avulsa | Hora (leve 6 h) | Hora (artesão 8 h) | Hora (braçal 10 h) |
|---|---|---|---|---|---|---|---|
| Braçal | 4 | 60 | 10,0 | 15,0 | 2,5 | 1,9 | 1,5 |
| Destreinado | 5 | 100 | 16,7 | 25,0 | 4,2 | 3,1 | 2,5 |
| Oficial | 6 | 130 | 21,7 | 32,5 | 5,4 | 4,1 | 3,2 |
| Profissional (soma 8) | 8 | 260 | 43,3 | 65,0 | 10,8 | 8,1 | 6,5 |
| Perito (soma 9) | 9 | 334 | 55,7 | 83,6 | 13,9 | 10,4 | 8,4 |
| Especialista (soma 10) | 10 | 435 | 72,4 | 108,6 | 18,1 | 13,6 | 10,9 |
| Especialista (soma 11) | 11 | 568 | 94,7 | 142,1 | 23,7 | 17,8 | 14,2 |
| Mestre (soma 12) | 12 | 669 | 111,4 | 167,1 | 27,9 | 20,9 | 16,7 |


**Conferência com o soldo histórico** (Eduardo III, 1340s), independente da curva:

| Posto (1340s) | Pagamento | pc/dia |
|---|---|---|
| Arqueiro a pé | 3 d | 20,0 |
| Lanceiro galês | 2 d | 13,3 |
| Arqueiro montado, hobelar | 6 d | 40,0 |
| Homem de armas, escudeiro | 12 d | 80,0 |
| Cavaleiro | 24 d | 160,0 |
| Cavaleiro bandeirado | 48 d | 320,0 |
| Conde | 80 d | 533,3 |


Dá para comparar dois postos: o arqueiro de 3 d (20 pc) = oficial por contrato (22); o homem de armas de 12 d (80 pc) ≈ soma 8 (43) mais a manutenção do cavalo de guerra (36). **O soldo é compatível com a curva nesses dois postos.** O teste é fraco no topo: a parte convexa da curva (Dif 7 e 11) não tem posto militar equivalente.

**Lista de serviços:**

| Grupo | Serviço | pc | Unidade | Base |
|---|---|---|---|---|
| Trabalho | Carregador, cavador, braçal | 15 | dia (avulso) | Braçal avulso: 10 x 1,5 |
| Trabalho | Braçal por contrato | 10 | dia | Braçal: 60 / 6 |
| Trabalho | Artesão (oficial) avulso | 35 | dia | Oficial: 130 / 6 x 1,5 |
| Trabalho | Artesão perito avulso | 85 | dia | Soma 9 |
| Trabalho | Mestre de ofício avulso | 170 | dia | Soma 12 |
| Trabalho | Lavar uma muda de roupa | 2 | muda | Uma hora de braçal |
| Trabalho | Barba e cabelo | 2 | vez | Meia hora, destreinado |
| Trabalho | Banho de tina (casa de banhos) | 2 | vez | Lenha e água aquecida, meia hora de servente |
| Viagem | Guia local | 35 | dia | Sobrevivência de oficial, avulso |
| Viagem | Guia de expedição (contrato) | 45 | dia | Soma 8, contrato, mais comida |
| Viagem | Mensageiro a pé | 15 | dia | Braçal avulso; ~40 km/dia. Hist.: 2 d/dia |
| Viagem | Mensageiro a cavalo | 35 | dia | Braçal avulso, cavalo e desgaste; ~60 km/dia |
| Guerra | Arqueiro ou besteiro (mercenário) | 20 | dia | Hist. 3 d (1346). = oficial por contrato |
| Guerra | Infante com lança | 15 | dia | Hist. 2 d (1346) |
| Guerra | Arqueiro montado ou batedor | 40 | dia | Hist. 6 d; inclui o próprio cavalo |
| Guerra | Homem de armas (armadura e cavalo próprios) | 80 | dia | Hist. 12 d; soma 8 (43) + cavalo de guerra (36) + desgaste |
| Guerra | Cavaleiro | 160 | dia | Hist. 2s |
| Guerra | Capitão de companhia | 320 | dia | Hist. cavaleiro bandeirado, 4s |
| Guerra | Guarda-costas (escolta na cidade) | 65 | dia | Soma 8 avulso |
| Saber | Carta redigida (com pergaminho) | 8 | carta | Uma hora de escrivão e uma folha |
| Saber | Cópia simples | 4 | página | Hist. 16-20 d o caderno (~16 páginas) |
| Saber | Página iluminada, cópia fiel | 9 | página | Linha da tabela: 2 h de oficial, jornada leve |
| Saber | Ler ou traduzir um documento | 11 | documento | Uma hora, soma 8 |
| Saber | Advogado ou notário, consulta | 18 | hora | Direito, soma 10 |
| Saber | Advogado numa causa | 430 | semana | Contrato semanal, soma 10 |
| Saber | Professor particular | ver aulas | jornada | Diária avulsa do professor |
| Saúde | Curandeiro ou barbeiro-cirurgião, atendimento | 5 | atendimento | Uma hora de Cura, oficial; material à parte |
| Saúde | Médico, consulta | 30 | consulta | Uma hora de mestre (jornada leve) |
| Saúde | Médico, tratamento diário | 85 | dia | Meia jornada de mestre por dia de recuperação |
| Saúde | Parteira | 35 | parto | Uma jornada de oficial |
| Fé | Missa encomendada | 25 | missa | Hist. 4 d |
| Fé | Bênção, oração, rito simples | 5 | vez |  |
| Fé | Casamento ou funeral | 60 | cerimônia | Uma semana de braçal, mais esmolas |
| Arte | Músico ou artista, noite de taverna | 35 | noite | Performance de oficial |
| Arte | Menestrel de corte, apresentação | 110 | apresentação | Soma 10 |
| Animais | Adestrar cavalo para sela | 1000 | cavalo | 8 semanas de adestrador oficial; explica rocim 2.400 - potro 1.300 |
| Animais | Adestrar cavalo de guerra | 5300 | cavalo | 16 semanas de perito, sobre um corcel |
| Animais | Ferrar um cavalo | 40 | vez | Ver arreios |


**Três pontos de regra que os serviços tocam:**

1. **Curandeiro contra as regras de cura.** O livro diz que "a perícia Cura acelera a recuperação", sem número. O preço está pronto (5 pc o atendimento; 30 pc a consulta de médico; 85 pc por dia de tratamento). **Falta a regra de quanto acelera.** Proposta mínima: com tratamento diário de alguém com Cura, a recuperação anda um passo mais rápido na tabela (Machucado recupera como Saudável, Grave como Machucado). Fica para você decidir; não mexi.
2. **Séquito** (Antecedente) [acrescenta]:
   - **Mundo:** o séquito de um NPC é pago pela tabela de criados e guardas.
   - **Jogador:** o Séquito não custa dinheiro na mesa. O XP pago é o que garante gente disponível e leal, e o salário deles fica dentro do custo de vida da faixa. Se o Recursos do personagem cair, o Séquito encolhe um nível até o Recursos voltar. Contratar gente além do Séquito paga a tabela de serviços.
   - Motivo: evita cobrar duas vezes (XP e pc) pela mesma coisa e mantém o antecedente com valor.
3. **Professor:** ver E3.

## C8. Servos e escravos

**Criados livres** (novo). Salário anual histórico mais casa e comida no nível da casa:

| Criado | Salário/ano (hist.) | Salário/sem | Casa e comida | Custo total/sem |
|---|---|---|---|---|
| Aprendiz, menino de recados | 48 d | 7,0 | subsistência | 19,1 |
| Criado ou criada de casa | 120 d | 17,5 | respeitável | 49,6 |
| Cavalariço | 120 d | 17,5 | respeitável | 49,6 |
| Cozinheiro | 200 d | 29,2 | respeitável | 61,3 |
| Valete, criado de casa rica | 360 d | 52,6 | farta | 119,3 |
| Guarda armado da casa | 208 d | 30,4 | respeitável | 62,5 |
| Escudeiro da casa | 240 d | 35,1 | farta | 101,7 |
| Mordomo (administrador) | 1200 d | 175,3 | farta | 242,0 |
| Capelão | 960 d | 140,3 | farta | 206,9 |


**Escravos** [DIVERGE]. Preço = 1,5 ano da renda bruta do trabalho que a pessoa faz (companhia: 2,25).

| Condição | Preço proposto | Catálogo | Renda do trabalho/sem | Nota |
|---|---|---|---|---|
| Destreinado | 43 po | 8 po | 60 | Trabalho braçal. |
| Doméstico | 72 po | 14 po | 100 | Serviço de casa, cozinha, recados. |
| Treinado (ofício) | 94 po | 20 po | 130 | Artesão comum, soma 6. |
| Especializado | 187 po |  | 260 | Soma 8: escriba, músico, artesão fino. Raro. |
| Companhia (concubina) | 108 po | 30 po | 100 | Os maiores preços dos registros eram de mulheres jovens (Florença 1366-97: 30 a 50 florins). |


1. **Conferência histórica:** Candia 1301, mulher: ~34 po. Florença 1366, mulheres de 18 a 25 anos: 72 a 120 po. Veneza 1394, menina: ~91 po. Doméstico, Treinado e Companhia caem dentro dessa faixa; Destreinado (43) fica perto do piso; Especializado (187) fica acima, porque os registros não têm escravo de ofício fino. Os preços atuais (8 a 30 po) ficam de 3 a 6 vezes abaixo.
2. **Sustento** [DIVERGE]: **15 pc por semana** (60 por mês) = cesta de subsistência mais um canto na casa. O catálogo cobra 3 po por mês (75 por semana), mais que a renda inteira do braçal livre. O escravo come como o pobre, não como o artesão.
3. **Quem é dono fica com o trabalho, menos o sustento.** Pela convenção contábil já aceita, esse excedente entra em Recursos pelo Mestre, e não em renda de ficha.
4. **Tratamento no texto:** mantenho a nota atual (tema sombrio; o uso na mesa é decisão do grupo). Sugiro acrescentar que a escravidão varia por região (legal, proibida, só para prisioneiros de guerra), pela mesma camada de modificador regional de A4.
5. **Alforria** (compra da liberdade): o preço de compra atual. Serve de gancho de história.

**Prós.** Custo e preço coerentes com salário e história; o criado livre existe como alternativa.
**Contras.** O preço da "Companhia" repete o dado histórico, mas o nome da linha pede cuidado no texto do livro.

---

# Extras descobertos no caminho

## E1. Qualidade dos itens

**O problema, com números.** A §7.5 manda, por grau acima de Comum: Requisito +1, Dificuldade +3, Montagem e Peça × 1,5, e "o intervalo sobe um degrau a cada dois graus". O preço "dobra". Calculei o preço pela régua das Fases 1-3 (o produtor capaz mais barato, com a renda de B2, × 1,8):

| Peça | Regra | Comum (avulso) | Boa | Ótima | Excepcional |
|---|---|---|---|---|---|
| Faca (linha Dif 4) | Texto atual (intervalo sobe) | 55 | 2,8x (0,6 sem, soma 6) | 37,6x (3,4 sem, soma 9) | 84,6x (3,8 sem, soma 12) |
| Faca (linha Dif 4) | Proposta (Piso, Req máx. 6) | 55 | 2,8x (0,6 sem, soma 6) | 11,1x (1,0 sem, soma 9) | 22,3x (2,0 sem, soma 9) |
| Espada (linha Dif 7) | Texto atual (intervalo sobe) | 250 | 2,3x (0,9 sem, soma 9) | 30,4x (6,2 sem, soma 12) | 72,9x (14,8 sem, soma 12) |
| Espada (linha Dif 7) | Proposta (Piso, Req máx. 6) | 250 | 2,3x (0,9 sem, soma 9) | 5,1x (1,0 sem, soma 12) | 12,2x (2,5 sem, soma 12) |
| Placa completa (Dif 11) | Texto atual (intervalo sobe) | 3.600 | 2,1x (6,4 sem, soma 12) | impossível | impossível |
| Placa completa (Dif 11) | Proposta (Piso, Req máx. 6) | 3.600 | 2,1x (6,4 sem, soma 12) | 22,5x (67,5 sem, soma 12) | impossível |


1. **O "intervalo sobe" é o que quebra.** Ele multiplica o tempo da Ótima por 6 (de dia para semana). A espada Ótima leva 6,2 semanas de um mestre e precisaria custar 30 vezes a Comum para pagar o tempo dele. Com "preço dobra" (4 vezes na Ótima), ninguém faz peça Ótima.
2. **Sem o degrau, a regra se aproxima da sua própria tabela.** Na espada: Boa ~2,3×, Ótima ~5×, Excepcional ~12×, contra 3×, 6×, 10× no capítulo. Na faca, a Ótima e a Excepcional ficam mais caras (11× e 22×), por causa do Piso de tempo. A sua intuição de preço estava perto; o que quebrava era o degrau de intervalo.
3. **A Placa completa Ótima não existe hoje.** Requisito 5 + 2 = 7, e nenhuma Habilidade humana passa de 6, "e nenhum modificador abre a porta". O mesmo vale para toda peça de Requisito 5 nos graus Ótima e Excepcional.

**Decisão** [DIVERGE]:

1. **Sai** "o intervalo sobe um degrau a cada dois graus". **Entra** um Piso: Ótima leva no mínimo 6 intervalos; Excepcional, 12. Assim a peça fina continua demorando, sem destruir a conta.
2. **Requisito máximo 6.** Cada ponto de Requisito que passaria de 6 vira +3 na Dificuldade. A Placa completa Ótima passa a existir: 67 semanas de trabalho de um mestre lendário, ~22 vezes o preço. É obra de uma vida, como deve ser.
3. **Preço pela régua**, com piso "a partir de" no livro: **Boa a partir de 2×, Ótima a partir de 5×, Excepcional a partir de 12×**. Peças pequenas ficam acima desse piso por causa do Piso de tempo (faca Ótima ~11×).
4. **Graus abaixo de Comum:** Tosca **até ⅓** do preço; Sucata **até ⅙** (a régua dá, na faca e na espada, 0,27 a 0,34 para Tosca e 0,09 a 0,17 para Sucata; conta em `modelo.py`, `qualidade_abaixo`).
5. **Relíquia deixa de ser grau.** É uma peça Ótima ou Excepcional **mais** o valor dos materiais e da joalheria, somado e não multiplicado.
6. **Nomes:** uma lista só, a da §7.5 (Sucata, Tosca, Comum, Boa, Ótima, Excepcional). A tabela do capítulo usa Péssimo, Ruim, Relíquia; o exemplo usa o masculino (Bom, Ótimo).
7. **Exemplo do Machado** (base 3 po): Boa a partir de 6 po, Ótima a partir de 15 po, Excepcional a partir de 36 po.

**Prós.** O mestre ganha o mesmo fazendo Comum ou Ótima (a peça fina deixa de ser prejuízo); três regras de preço conflitantes viram uma.
**Contras.** Mexe na §7.5, que é regra de fabricação e não só de preço; o Piso é número de design.

## E2. Reparo, manutenção e desgaste

**Reparo** (a regra do livro fica; entra o preço). O livro já diz: mesma Dificuldade e intervalo, com um quarto do Acúmulo para dano leve, metade para pesado, inteiro para peça arruinada que ainda tem material. Pela régua:

| Dano | Acúmulo | Preço do reparo por encomenda |
|---|---|---|
| Leve | ¼ | **⅙ do preço da peça** |
| Pesado | ½ | **⅓ do preço** |
| Arruinada, com material | inteiro | **¾ do preço** (o trabalho inteiro, ⅔, mais ~10% de material de reposição) |

"Ofícios Gerais devolve a peça ao uso; só o ofício devolve a qualidade": mantido.

**Desgaste (regra opcional do Mestre)**, proposta nova:

1. Ao fim de cada combate, cada arma usada e cada armadura ou escudo que absorveu dano ganha **uma marca de desgaste**. O Mestre pode dar duas num combate longo, contra armadura pesada ou contra criatura grande.
2. **3 marcas = dano leve:** −1 num número da peça (dano, absorção ou bloqueio, à escolha do Mestre) até ser reparada. **6 marcas = dano pesado:** −2. **9 marcas = arruinada.**
3. **Manutenção apaga marcas:** uma hora de trabalho com o kit (pedra de amolar, óleo, trapos) apaga uma marca, com Ofícios Gerais ou o ofício, sem jogada, se houver tempo e abrigo. Em campanha longa sem descanso, as marcas se acumulam: é aí que o desgaste aparece.
4. Kit de manutenção: pedra de amolar (7) mais um frasco de óleo (10) a cada 4 semanas de uso.
5. Manutenção por terceiros: meia hora de oficial avulso por marca, ~2 pc. Histórico: os limpadores de cota da Torre de Londres ganhavam 4 a 6 d por dia (1344-51), a limpeza de armadura era trabalho contínuo.

**Prós.** Desgaste ligado ao tempo de descanso, que já é recurso de jogo; a manutenção dá uso ao Ofícios Gerais. **Contras.** Mais uma coisa a anotar na ficha; por isso é opcional.

## E3. Empréstimo de XP (regra completa)

Já decidido por você: um ponto por vez, quitado antes do próximo; professor com pelo menos 1 ponto acima; vale para Atributo, Habilidade e Especialidade; o Mestre julga o limite e se é possível; o preço é o tempo do professor × o salário dele.

**O que decido aqui:**

1. **Tempo de aula = custo em XP do ponto ÷ 2, em jornadas.** Habilidade primária 3 → 4 (12 XP): 6 jornadas, uma semana. Atributo 3 → 4 (25 XP): 12,5 jornadas. O aluno não trabalha nesses dias.
2. **Preço = jornadas × diária avulsa do professor** (tabela de C7):

| Ponto | Novo nível | XP | Jornadas de aula | Professor (soma) | Preço (pc) |
|---|---|---|---|---|---|
| Habilidade primária | 2 | 8 | 4,0 | 6 | 130 |
| Habilidade primária | 3 | 10 | 5,0 | 8 | 330 |
| Habilidade primária | 4 | 12 | 6,0 | 9 | 500 |
| Habilidade primária | 5 | 14 | 7,0 | 11 | 990 |
| Habilidade secundária | 3 | 5 | 2,5 | 8 | 160 |
| Atributo | 3 | 20 | 10,0 | 8 | 650 |
| Atributo | 4 | 25 | 12,5 | 9 | 1.000 |
| Atributo | 5 | 30 | 15,0 | 11 | 2.100 |
| Especialidade primária | 1 | 12 | 6,0 | 9 | 500 |


3. **Dívida:** metade de todo XP ganho, de sessão ou de Firula nível 3, vai para a dívida até quitar.
4. **Se o XP não vier** (personagem aposentado, campanha que acaba): a dívida some com o fim da campanha. Se o jogador parar de jogar o personagem, o Mestre decide.
5. **"Mais rápido que sozinho":** aprender sozinho no Centelha é só gastar XP, sem tempo definido. A aula não acelera o aprendizado; ela **antecipa** o ponto. Por isso não fica rápida demais: o poder total do personagem não muda, só a ordem em que chega.
6. **Mentor** (Antecedente): ensina sem cobrar dinheiro. A dívida de XP é a mesma.
7. **Aula em grupo:** até 4 alunos no mesmo ponto; preço total × 1,5, dividido entre eles.

**Prós.** Dá uso ao dinheiro na progressão sem transformar dinheiro em poder permanente. **Contras.** O Mestre precisa anotar a dívida de cada personagem.

## E4. Rações

**Decisão** [DIVERGE]:

| Item | Hoje | Proposto | Motivo |
|---|---|---|---|
| Refeição pobre (estalagem) | "Rações" 1 pc | 1 pc | Só o nome muda |
| Ração de viagem (1 dia) | 2 pc | **3 pc** | Pão duro, queijo, toucinho: = três refeições pobres |
| Ração de cavalo (dia) | 2 pc | **4 pc** | Aveia 3,4 pc por dia mais feno (Langdon) |
| Estábulo com ração, por noite | não existe | **7 pc** | Estalagem, 1331 |

## E5. Pacote inicial pelo Recursos (Jogador)

**Proposta.** Na criação, o personagem começa com a roupa e as ferramentas do ofício no nível de vida da faixa, mais uma **bolsa de 4 semanas de Livre**. Isso resolve o começo de campanha caro (A2) sem baixar preços.

## E6. Formato dos arquivos para o site

Respostas aos pontos 3a a 3d do Revisor:

1. **Arquivo próprio `src/data/mercadorias.json`**, array no envelope já decidido (id, nome, tipo, preco {pc}, peso, tags) com o bloco `mercadoria {categoria, unidade}`. O `precos.json` deixa de ser a fonte do preço dos itens gerais; os pacotes vão para `pacotes-equipamento.json`, como a decisão já registrada manda.
2. **Peso:** preenchido em 189 dos 190 itens. O conjunto de ferramentas de armeiro não tem peso único e vai com `null`, então o esquema precisa aceitar peso nulo.
3. **Descrição:** não gerei. Se o envelope exige, o Arquiteto decide se entra vazio ou com texto.
4. **Procedência** (fonte, valor original, confiança, nota, dias de braçal, preço atual) vai para `lore/economia/mercadorias.procedencia.json`, fora do site.
5. **Tarifas não são itens:** `custo-de-vida.json`, `renda.json`, `servicos.json`, `viagens.json` e `montarias-veiculos.json` são arquivos próprios.
6. **Esquema com `.strict()`**, porque o zod sem ele descarta campo desconhecido sem avisar.
7. **Ids:** mantive os do `precos.json` quando o item é o mesmo (cantil, caixa-fogo, lampada, frasco-oleo, folha-papel, folha-pergaminho, caixa-mapas, livro-estudo, kit-refeicao, caneta-tinteiro, vidro-tinta, parafina, racao-dia, vestes, roupas-finas). Colisões de objeto diferente resolvidas: martelo → `martelo-ferramenta`; "Cobertor bom" → `cobertor-bom` (o `cobertor` segue sendo o comum); sabão agora é a barra, como no catálogo. O Revisor confere o resto do mapa.

## E7. Correções de texto que saem desta revisão

1. **Salto entre degraus da escada:** "de dez a sessenta vezes" (Acoes_Sistema.md:216) e "de 8 a 24 vezes" (relacoes-sociais.md:215). Em tempo real, os saltos são: tick → minuto e minuto → hora até 60; hora → dia 24; dia → semana 8 (a semana de Uldun); semana → estação 12. O capítulo social está certo para os degraus de que fala (hora para cima: 8 a 24). O Acoes_Sistema erra no piso: **"de oito a sessenta vezes"**. E acrescentar uma frase: no trabalho, o "dia" é uma jornada do ofício (6 a 10 horas), e não 24 horas.
2. **Fórmula do ofício** (B1) e **tetos** (B4) no capítulo de ofícios.
3. **Tabela de Renda** (B5), inclusive as colunas de mês e ano.
4. **Qualidade** (E1): §7.5, tabela do capítulo de custos e exemplo do Machado.
5. **Itens Gerais** (A4): metais por 100 g; sal 1,3 pc por 100 g (hoje 2 pp); temperos comuns 2 pc por 100 g (hoje 3 pp).

---

# O que fica em aberto (só você decide)

1. **Quanto a perícia Cura acelera a recuperação** (C7). O preço está pronto; a regra não existe.
2. **Aceitar ou não a subida da Placa completa** (B8).
3. **A curva do Livre** (potência 0,2): quer o rico ainda mais apertado ou mais folgado?
4. **O nome da linha "Concubina"** no livro (C8).
5. **Os números do modificador regional** (A4), quando chegar a vez dele.
6. **Etapa D:** auditoria final de tudo junto, depois que você aprovar esta proposta.

# Riscos que eu vejo

1. **A escala mudou muito para quem já joga.** Mochila 5×, cavalo 4×, vaca 5×, escravos 5×. Personagens existentes ficam com equipamento que "valia menos". Sugestão: não recalcular o que eles já têm.
2. **A régua de B2 depende de o oficial e o perito serem os produtores marginais.** Se o Mestre povoar uma cidade só de mestres, os preços caem, e isso é modificador regional, não falha da regra.
3. **54 dos 190 itens de mercadorias e quase todos os animais exóticos são contas minhas ou têm conflito entre fontes (confiança C).** O Revisor deve atacar esses primeiro.

---

# Anexo A · Tabela completa de mercadorias

Preço em pc; dias de braçal = preço calculado ÷ 10; Catálogo = preço atual quando existe.

#### Grãos e pão

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Trigo | alqueire (~27 kg) | 65 | 6,25 | MtD | B |  | ~6s 3d o quarter, média de c. 1300. |
| Cevada | alqueire (~22 kg) | 40 | 3,75 | MtD | B |  |  |
| Aveia | alqueire (~15 kg) | 25 | 2,25 | MtD | B |  | O grão mais barato: base da cesta de subsistência. |
| Malte | alqueire (~18 kg) | 50 | 5,00 | MtD | B |  |  |
| Feijão ou fava | alqueire (~27 kg) | 20 | 2,08 | MtD | B |  |  |
| Ervilha | alqueire (~27 kg) | 50 | 5,08 | MtD | B |  |  |
| Arroz | libra (~0,45 kg) | 10 | 1,00 | Derivado | C |  | A MtD dá 30 d por libra, mais caro que a pimenta: provável erro. Contas senhoriais do séc. XIV ficam perto de 1 a 2 d. Importado: modificador regional. |
| Farinha de trigo | 1 kg | 3 | 0,30 | Derivado | C |  | Trigo (0,35 d/kg) mais moagem (o moleiro fica com ~1/16) e perda. |
| Pão de trigo | 1 kg | 3 | 0,27 | Derivado | C |  | Trigo 0,35 d/kg de grão; 1 kg de grão rende ~1,1 kg de pão; mais padaria. |
| Pão pequeno | unidade (~0,4 kg) | 1 | 0,10 | Derivado | C | 0,5 | O pão de uma refeição. Substitui o 'Pão ½ pc' do catálogo, que pedia moeda partida. |
| Pão grosseiro (cevada, centeio, mistura) | 1 kg | 2 | 0,20 | Derivado | C |  | Cevada 0,26 d/kg de grão mais padaria. |

#### Carnes, laticínios, peixe e feira

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Carne (porco, carneiro ou boi) | 1 kg | 4 | 0,43 | Derivado | C |  | Derivado do porco (2 a 3s por 37 a 55 kg de carne); a vaca daria mais barato, o carneiro mais caro. |
| Toucinho ou carne salgada | libra (~0,45 kg) | 3 | 0,33 | Derivado | C |  | Carne mais sal e cura; dura meses. |
| Manteiga | libra (~0,45 kg) | 9 | 0,92 | MtD | B |  |  |
| Queijo | libra (~0,45 kg) | 4 | 0,42 | MtD | B | 2 | Hodges: 80 libras por 3s 4d (0,5 d/libra). |
| Ovos | dúzia | 3 | 0,33 | MtD | B |  | Hodges: 2 dúzias por 1 d. |
| Leite | galão (~4,5 L) | 3 | 0,33 | Derivado | C |  | A MtD dá 1,6 d por galão, o que faria o leite de uma libra de manteiga custar mais que a manteiga. Rebaixado para caber na manteiga e no queijo. |
| Mel | libra (~0,45 kg) | 7 | 0,67 | Derivado | C |  | Estava entre as bebidas, por galão. Mel era adoçante comum e barato perto do açúcar. |
| Arenque salgado | 6 unidades | 7 | 0,67 | Hodges | A |  | Atacado: 5 a 10 por 1 d (Londres, 1382). Meia dúzia para não cair abaixo de 1 pc. |
| Peixe fresco | 1 kg | 3 | 0,33 | Derivado | C |  | Sem fonte direta; posto entre o arenque e a carne. Litoral e rios: modificador regional forte. |
| Congro salgado | unidade | 40 | 4,00 | Hodges | A |  | 1422-1423. |
| Frango ou galinha abatida | unidade | 4 | 0,40 | Derivado | C | 2 | Galinha viva (0,5 d) mais o abate. |
| Frutas frescas (maçã, pera) | dúzia | 1 | 0,10 | Derivado | C | 3 | Sem fonte direta; fruta de pomar era barata na estação. |
| Legumes e verduras (couve, cebola, alho-poró) | maço (~1 kg) | 1 | 0,07 | Derivado | C |  | Horta: quase sem preço de mercado; valor simbólico. |
| Ração de viagem (1 dia) | 1 dia | 3 | 0,30 | Derivado | C | 2 | Pão duro, queijo e carne salgada para um dia (~0,6 kg de pão, 0,15 de queijo, 0,1 de toucinho) mais embalagem. Custa o mesmo que três refeições de estalagem pobre, e não mais. |

#### Bebidas

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Cerveja (ale), caneca | caneca (~0,5 L) | 1 | 0,08 | MtD | B | 2 | Qualquer qualidade comum. Abaixo de 1 pc não existe preço. |
| Cerveja boa, caneca | caneca (~0,5 L) | 2 | 0,17 | MtD | B | 10 | O catálogo cobrava 5x a comum; a história dá 1,5 a 2x. |
| Cerveja fraca, jarra | jarra (~2 L) | 2 | 0,22 | Hodges | A | 0,5 | 0,75 d por galão (séc. XIV). |
| Cerveja média, jarra | jarra (~2 L) | 3 | 0,29 | Hodges | A |  | 1 d por galão. |
| Cerveja boa, jarra | jarra (~2 L) | 4 | 0,45 | Hodges | A |  | 1,5 d por galão. |
| Cerveja, barril | barril (~80 L) | 120 | 12,08 | MtD | B |  |  |
| Sidra | galão (~4,5 L) | 5 | 0,50 | MtD | B |  |  |
| Hidromel | galão (~4,5 L) | 25 | 2,33 | Derivado | C |  | Mel fermentado; posto no preço do vinho comum. |
| Vinho ruim, caneca | caneca (~0,5 L) | 2 | 0,20 | Derivado | C | 2 | Vinho comum de 3,5 d o galão, um pouco abaixo. **R-estável.** |
| Vinho comum, caneca | caneca (~0,5 L) | 3 | 0,27 | Hodges | A | 8 | 3 a 4 d por galão (fim do séc. XIII). |
| Vinho bom, caneca | caneca (~0,5 L) | 7 | 0,67 | Hodges | A |  | 8 a 10 d por galão. |
| Vinho comum, galão | galão (~4,5 L) | 25 | 2,33 | Hodges | A |  |  |
| Vinho bom, galão | galão (~4,5 L) | 60 | 6,00 | Hodges | A |  |  |
| Vinho fino (safra rara ou importado) | garrafa (~1 L) | 200 | 20,00 | Derivado | C | 200 | Luxo de corte. O catálogo tem 'Vinho fino 2 po'; ficou 200 pc por garrafa. Importação: modificador regional. **R-estável.** |

#### Temperos e importados

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Sal | 1 kg | 13 | 1,27 | MtD | B |  | MtD 7 C por libra. O catálogo cobra 2 pp por 100 g, 15x o histórico. |
| Temperos comuns (mostarda, cominho, ervas secas) | 100 g | 2 | 0,20 | MtD | B | 30 | Cominho 12 C por libra. O catálogo cobra 3 pp por 100 g para 'Temperos', ~13x. |
| Pimenta | 100 g | 40 | 3,31 | MtD | B | 40 | Hodges: 1 a 4s por libra conforme a década. Catálogo 4 pp: coerente. **R-estável.** |
| Cravo | 100 g | 40 | 3,49 | MtD | B | 40 | Especiarias finas, 1 a 3s por libra. Catálogo 4 pp: coerente. **R-estável.** |
| Canela | 100 g | 40 | 4,19 | MtD | B | 60 | 20% acima das outras especiarias finas, como no catálogo. |
| Gengibre | 100 g | 35 | 3,31 | MtD | B |  |  |
| Açafrão | 10 g | 25 | 2,65 | MtD | B |  | Hodges: 12 a 15s por libra. O tempero mais caro. |
| Açúcar | libra (~0,45 kg) | 95 | 9,58 | MtD | B |  | Luxo. |
| Amêndoas | libra (~0,45 kg) | 13 | 1,33 | MtD | B |  |  |
| Tâmaras | libra (~0,45 kg) | 12 | 1,17 | MtD | B |  |  |
| Figos secos | libra (~0,45 kg) | 5 | 0,50 | MtD | B |  |  |
| Frutas secas (passas, ameixas) | libra (~0,45 kg) | 13 | 1,33 | MtD | B |  | Hodges: 1 a 4 d por libra. |

#### Tecidos, couro, metais e insumos

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Linho comum | jarda (~0,9 m) | 20 | 2,00 | Derivado | C |  | Derivado da camisa de linho de Hodges (8 d em 1313). Cesta de subsistência e respeitável. |
| Tecido grosseiro (burel, lã crua) | jarda (~0,9 m) | 55 | 5,33 | Hodges | A |  | Piso da faixa de Hodges para tecido de túnica camponesa. |
| Tecido comum (lã tingida) | jarda (~0,9 m) | 80 | 8,00 | MtD | B |  | Hodges: 8 d a 1s 3d por jarda. |
| Linho fino | jarda (~0,9 m) | 100 | 10,00 | MtD | C |  | Não cabe na camisa de 8 d de Hodges; lido como linho fino. |
| Lã fina | jarda (~0,9 m) | 400 | 40,00 | MtD | B |  | Hodges: a melhor lã, 5s por jarda (1380). |
| Seda | jarda (~0,9 m) | 880 | 88,00 | MtD | B |  | Hodges: 10 a 12s por jarda. |
| Lona | jarda quadrada (~0,84 m²) | 35 | 3,67 | MtD | B |  |  |
| Lã crua | libra (~0,45 kg) | 30 | 2,75 | MtD | B |  |  |
| Couro de vaca curtido | couro inteiro | 170 | 17,17 | MtD | B |  |  |
| Sebo | libra (~0,45 kg) | 8 | 0,80 | Derivado | C |  | A MtD dá 3,4 d, mais que a vela de sebo pronta (2 d). Rebaixado para ficar abaixo da vela. |
| Cera de abelha | libra (~0,45 kg) | 35 | 3,33 | Derivado | C |  | A MtD dá 8 d, mais que a vela de cera pronta (6,5 d). Rebaixado para ficar abaixo da vela. |
| Ferro em barra | kg | 15 | 1,47 | MtD | B |  | 1 d por libra: 1,5 pc por 100 g. O catálogo cobra ¼ pc por 100 g. |
| Aço | kg | 30 | 3,12 | MtD | B |  |  |
| Cobre | kg | 30 | 2,76 | MtD | B |  | 2,8 pc por 100 g: confirma a proposta de 3 pc por 100 g. A moeda de cobre de 30 g vale ~0,9 pc em metal. |
| Estanho | kg | 90 | 8,82 | MtD | B |  |  |
| Chumbo | kg | 13 | 1,29 | MtD | B |  |  |
| Latão | kg | 60 | 5,88 | MtD | B |  |  |
| Bronze | kg | 35 | 3,67 | MtD | B |  |  |
| Carvão vegetal | saco (~10 kg) | 25 | 2,67 | Derivado | C |  | 5 a 7 kg de lenha por kg de carvão (0,26 d) mais a queima: ~0,4 d/kg. A MtD dá ~15x isso. |
| Lenha | carga de cavalo (~100 kg) | 25 | 2,67 | Derivado | C |  | Da participação do combustível nas cestas (~0,044 d/kg). A MtD dá 1 d por libra. |
| Cânhamo | libra (~0,45 kg) | 3 | 0,33 | Derivado | C |  | Fibra para corda e lona. |

#### Roupas

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Roupa comum usada (conjunto) | conjunto | 50 | 5,00 | MtD | B | 20 | Túnica, calções e capuz de segunda mão. Era como o pobre se vestia. |
| Roupa comum nova (conjunto) | conjunto | 220 | 21,80 | Derivado | C | 20 | 3 jardas de burel (24 d) mais um dia de costura. O catálogo tem 'Comum' a 2 pp; a roupa nova custa 8x, a usada 2,5x. |
| Roupa de viajante (conjunto) | conjunto | 300 | 29,50 | Derivado | C | 50 | Roupa comum mais capa de lã e capuz forrado; sem calçado. |
| Roupa de artesão (conjunto) | conjunto | 240 | 24,00 | MtD | B |  | Hodges: tabardo e sobretúnica de artesão, 3s (1285-1290). |
| Roupa de artista (conjunto) | conjunto | 380 | 37,50 | Derivado | C | 150 | Tecido tingido de cores vivas, guizos, remendos de efeito. |
| Robe (clérigo, estudioso) | unidade | 520 | 51,90 | Derivado | C | 350 | 5 jardas de lã tingida. |
| Roupa de camponês abastado (conjunto) | conjunto | 600 | 60,00 | MtD | B |  |  |
| Conjunto de roupas finas | conjunto | 800 | 100,00 | MtD | B | 800 | O catálogo tem 'Finas' a 8 po. **R-estável.** |
| Roupa de corte (conjunto) | conjunto | 5.000 | 500,00 | Derivado | C | 1.800 | Lã fina e seda, forro de pele, bordado: ~£3. O catálogo tem 'Nobres' a 18 po. Gasto de status das faixas altas. |
| Traje de gala (conjunto) | conjunto | 16.000 | 1.600,00 | Hodges | B |  | Hodges: vestido da moda, facilmente £10, até £50. Ficou no piso, £10. |
| Vestes oficiais ou cerimoniais | conjunto | 480 | 48,00 | MtD | B | 50 | O catálogo tem 'Vestes (cerimoniais)' a 5 pp. |
| Manto | unidade | 50 | 5,00 | MtD | B |  |  |
| Camisa de linho | unidade | 55 | 5,33 | Hodges | A |  | Camponês abastado, 1313. |
| Sapatos | par | 40 | 4,00 | Hodges | A |  | Camponês abastado, 1313. Ver a linha nova de fabricação proposta. |
| Botas de montar | par | 100 | 10,40 | Derivado | C |  | Um quarto de couro de vaca (6,5 d) mais dois dias de sapateiro. A linha 'Sela, arreio, bota' da fabricação daria ~130. |
| Chapéu | unidade | 65 | 6,67 | MtD | B |  | Hodges: 10 d a 1s 2d (nobreza). |
| Bolsa de cinto | unidade | 10 | 1,00 | MtD | B |  |  |
| Fantasia | conjunto | 50 | 5,00 | Derivado | C | 30 | Roupa usada tingida e enfeitada. |

#### Casa e mobília

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Colchão de palha | unidade | 13 | 1,33 | MtD | B |  |  |
| Colchão de penas | unidade | 500 | 50,00 | MtD | B |  |  |
| Travesseiro | unidade | 7 | 0,67 | MtD | B |  |  |
| Lençol | unidade | 25 | 2,67 | MtD | B |  |  |
| Cobertor de lã grossa | unidade | 65 | 6,38 | Derivado | C | 5 | Duas jardas de lã de coberta (mais grossa e barata que o burel de roupa). Mantém o id do catálogo. |
| Cobertor bom | unidade | 100 | 10,00 | MtD | B |  |  |
| Mesa | unidade | 40 | 4,00 | MtD | B |  | Bate com a linha 'Porta, banco, mesa tosca' da fabricação (~36). |
| Cadeira | unidade | 20 | 2,00 | MtD | B |  |  |
| Banquinho | unidade | 17 | 1,67 | MtD | C |  | A MtD dá 32 C, mais que a cadeira. Posto abaixo dela. |
| Baú | unidade | 50 | 4,00 | MtD | B | 50 | Baú simples de tábua. O catálogo tem 'Baú' a 5 pp: mantido. **R-estável.** |
| Baú de boa qualidade (arca) | unidade | 170 | 17,33 | MtD | B |  | É a 'arca' da linha 'Móvel bem-acabado, arca'. |
| Cofre pequeno com fechadura | unidade | 100 | 10,21 | Derivado | C |  | Caixa reforçada de ferro mais fechadura. A MtD dá 92 C, abaixo do baú de boa qualidade, o que não fecha. |

#### Utensílios e recipientes

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Panela de barro | unidade | 3 | 0,33 | MtD | B |  |  |
| Panela de ferro | unidade | 20 | 2,00 | MtD | B |  |  |
| Panela de latão | unidade | 160 | 16,00 | MtD | B |  |  |
| Caldeirão | unidade | 330 | 33,33 | MtD | B |  |  |
| Kit de refeição (tigela, colher, caneca) | conjunto | 7 | 0,67 | Derivado | C | 5 | Madeira torneada. Mantém o id do catálogo. |
| Balde | unidade | 40 | 4,00 | MtD | B |  |  |
| Barril vazio | unidade | 20 | 2,00 | MtD | B |  |  |
| Tina | unidade | 25 | 2,67 | MtD | B |  |  |
| Cesto | unidade | 7 | 0,67 | MtD | B |  |  |
| Bacia | unidade | 13 | 1,33 | MtD | B |  |  |
| Jarra de metal | unidade | 40 | 4,00 | MtD | B |  |  |
| Garrafa | unidade | 25 | 2,67 | MtD | B |  |  |
| Frasco de vidro | unidade | 25 | 2,33 | MtD | B |  |  |
| Frasquinho (vial) | unidade | 13 | 1,33 | MtD | B |  |  |
| Cantil ou odre | unidade | 17 | 1,67 | MtD | B | 5 | Mantém o id do catálogo ('Cantil'). |
| Saco grande | unidade | 70 | 7,12 | Derivado | C |  | Jarda e meia de lona. A MtD dá 15 d. |
| Bolsinha | unidade | 7 | 0,67 | MtD | B |  |  |
| Mochila | unidade | 100 | 10,00 | MtD | B | 20 | Um quarto de couro (6,5 d) mais um dia de seleiro, com margem. |
| Alforje (par) | par | 120 | 12,22 | Derivado | C | 50 | Dois quintos de couro mais um dia e meio de seleiro. |
| Caixa para mapas ou pergaminhos | unidade | 35 | 3,33 | MtD | B | 10 | Mantém o id do catálogo. |
| Caixa de esmolas | unidade | 10 | 1,00 | Derivado | C | 10 | Caixinha de madeira com fenda. **R-estável.** |

#### Luz e fogo

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Vela de sebo | unidade | 2 | 0,17 | Hodges | A | 1 | Hodges: candles de ¼ d (1331); 1,5 a 2,5 d a libra. Mantém o id do catálogo. |
| Velas de sebo (~8) | libra (~0,45 kg) | 13 | 1,33 | MtD | B |  | Hodges: 1,5 a 2,5 d por libra (1338). |
| Velas de cera | libra (~0,45 kg) | 45 | 4,33 | MtD | B |  | Hodges: 6,5 d por libra (1406-1407). |
| Tocha | unidade | 7 | 0,67 | MtD | B | 1 | Tocha de resina ou breu, ~1 hora. Mais cara por hora que a vela. |
| Lâmpada (lamparina) | unidade | 30 | 3,33 | MtD | B | 30 | Mantém o id do catálogo. **R-estável.** |
| Lanterna coberta | unidade | 130 | 13,33 | MtD | B | 50 |  |
| Frasco de óleo de lamparina | frasco (~0,5 L) | 10 | 1,00 | Derivado | C | 10 | Óleo vegetal ou de peixe, abaixo do sebo por litro. Mantém o id do catálogo. **R-estável.** |
| Pederneira e fuzil (caixa de fogo) | unidade | 7 | 0,67 | MtD | B | 5 | Mantém o id do catálogo. |

#### Ferramentas

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Pá | unidade | 20 | 2,00 | MtD | B |  | Hodges: pá e enxada juntas, 3 d (1457). |
| Enxadão | unidade | 25 | 2,33 | MtD | B |  |  |
| Picareta | unidade | 25 | 2,33 | MtD | B |  |  |
| Machado de lenhador | unidade | 35 | 3,33 | MtD | B |  | Hodges: 5 d (1457). |
| Machadinha (ferramenta) | unidade | 25 | 2,33 | MtD | B |  |  |
| Martelo (ferramenta) | unidade | 25 | 2,36 | Derivado | C | 10 | ~0,6 kg de ferro mais meio dia de ferreiro. A MtD dá 8 d (preço de 1514), acima do machado. Id novo: 'martelo' colide com a arma. |
| Marreta | unidade | 90 | 9,23 | Derivado | C |  | ~4,5 kg de ferro mais meio dia de ferreiro. A MtD dá 50 d. |
| Pé de cabra | unidade | 50 | 4,83 | Derivado | C | 20 | ~2 kg de ferro mais meio dia de ferreiro. |
| Faca pequena | unidade | 20 | 2,00 | Tabela do jogo | B | 20 | Linha 'Faca, machado, ponta de lança' (Dif 4) no lote. Mantida. **R-estável.** |
| Formão | unidade | 25 | 2,67 | MtD | B |  | Hodges: 2 formões, 8 d (1514). |
| Trado (broca) | unidade | 20 | 2,00 | MtD | B |  | Hodges: 3 d (1457). |
| Foice | unidade | 20 | 2,00 | MtD | B |  |  |
| Gadanha | unidade | 50 | 5,25 | Derivado | C |  | A MtD dá 30 d, 10x a foice. Derivado: lâmina longa de ~1,5 kg mais um dia de ferreiro. |
| Relha de arado | unidade | 35 | 3,33 | MtD | B |  | Hodges: 5 d (c. 1350). |
| Pedra de amolar | unidade | 7 | 0,67 | MtD | B |  |  |
| Agulha e 12 alfinetes | conjunto | 13 | 1,33 | MtD | B |  |  |
| Linha (3 m) | 3 m | 1 | 0,10 | Catálogo | B | 1 | Mantido. |
| Pregos | 100 unidades | 11 | 1,10 | MtD | B |  | MtD 132 C o milheiro. |
| Anzóis | dúzia | 10 | 1,00 | MtD | B |  | Vendido em dúzia para não cair abaixo de 1 pc. |
| Rede de pesca | m² (~11 pés²) | 18 | 1,79 | MtD | B |  |  |
| Roda de fiar | unidade | 65 | 6,67 | MtD | B |  | Hodges: 10 d (1457). |
| Balança de mercador | unidade | 330 | 33,33 | MtD | B |  |  |
| Ampulheta | unidade | 120 | 11,67 | MtD | B |  |  |
| Ferramenta de pedreiro | unidade | 20 | 2,00 | MtD | B |  | Hodges: 3 ferramentas, 9 d (c. 1350). |
| Bigorna | unidade | 1.600 | 160,00 | MtD | B |  | Hodges: 20s (1514). |
| Fole de forja | unidade | 2.400 | 240,00 | MtD | B |  | Hodges: 30s (1514). |
| Morsa | unidade | 1.100 | 106,67 | MtD | B |  | Hodges: 13s 4d (1514). |
| Ferramentas completas de armeiro | conjunto | 22.200 | 2.215,33 | MtD | B |  | Hodges: £13 16s 11d (1514). Referência para montar oficina. |

#### Aventura e viagem

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Saco de dormir (rolo de lona e lã) | unidade | 60 | 5,98 | Derivado | C | 10 | Uma jarda quadrada de lona (5,5 d), manta fina de enchimento (1 d) e costura. Fica acima do lençol e abaixo do cobertor de lã. |
| Tenda pequena (2 pessoas) | unidade | 470 | 47,40 | Derivado | C |  | ~10 jardas quadradas de lona (5,5 d cada) mais varas e um dia de costura. A MtD dá 200 d, provável pavilhão. |
| Pavilhão de lona | unidade | 1.300 | 133,33 | MtD | B |  | A 'tenda' da MtD. |
| Corda de cânhamo (15 m) | 15 m (~1,7 kg) | 25 | 2,28 | Derivado | C | 10 | 3,75 libras de cânhamo mais o cordoeiro. A MtD daria ~94 d, provável cabo de navio. Mantém o id do catálogo. |
| Corrente leve | 1 m | 40 | 3,83 | Derivado | C |  | ~0,7 kg de ferro mais um dia de ferreiro por metro. |
| Gancho de escalada (arpéu) | unidade | 40 | 3,95 | Derivado | C |  | ~1,5 kg de ferro mais meio dia de ferreiro. |
| Píton (cravo de ferro) | unidade | 7 | 0,67 | MtD | B | 1 | Mantém o id do catálogo. |
| Escada | 3 m | 65 | 6,67 | MtD | B |  |  |
| Vara | 3 m | 17 | 1,67 | MtD | B |  |  |
| Algemas (grilhões) | par | 45 | 4,37 | Derivado | C |  | ~1 kg de ferro mais um dia de ferreiro. A MtD dá 100 d. |
| Cadeado simples | unidade | 45 | 4,43 | Derivado | C |  | ~0,3 kg de ferro mais um dia e meio de serralheiro. Não é a 'Fechadura' de segredo (Req 5) da tabela. |
| Cataplasma medicinal (emplastro) | unidade | 10 | 1,00 | Tabela do jogo | B |  | Linha 'Emplastro, tintura, tinta' (Herbalismo, Dif 7, 2 h): ~10 pc. A MtD dá 4 d. |
| Sabão (barra) | barra (~0,1 kg) | 3 | 0,29 | MtD | B | 2 | MtD 16 C por libra. Mantém o id do catálogo. |
| Apito | unidade | 20 | 2,00 | MtD | B |  |  |
| Espelho de aço | unidade | 35 | 3,33 | MtD | B |  |  |
| Sino de mão | unidade | 25 | 2,62 | Derivado | C | 10 | ~0,3 kg de bronze mais fundição. Mantém o id do catálogo. |
| Esferas de metal (1000) | 1000 unidades | 45 | 4,36 | Derivado | C | 10 | ~1 kg de ferro em bolinhas e um dia de ferreiro. |
| Saquinho de areia | unidade | 1 | 0,10 | Catálogo | B | 1 | Mantido. |
| Kit de disfarce | conjunto | 250 | 25,00 | Catálogo | B | 250 | Mantido: duas mudas de roupa usada (100), pós e tintas (~70), cabelo postiço (~50) somam ~220. |
| Vidro de perfume | unidade | 50 | 5,00 | Catálogo | B | 50 | Mantido: água de rosas e óleos em frasco de vidro. |
| Bloco de incenso | unidade (~50 g) | 10 | 1,00 | Derivado | C | 5 | Resina importada, ~2s por libra. |
| Incensário | unidade | 75 | 7,43 | Derivado | C | 30 | Latão fundido mais um dia e meio de latoeiro. |

#### Escrita

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Folha de papel | folha | 7 | 0,67 | MtD | B | 2 | Papel era raro e importado antes de 1400. Mantém o id do catálogo. |
| Folha de pergaminho | folha | 3 | 0,33 | MtD | B | 1 | Mantém o id do catálogo. |
| Folha de velino | folha | 10 | 1,00 | MtD | B |  |  |
| Pena de escrever | unidade | 1 | 0,10 | Catálogo | B | 1 | Mantido. |
| Vidro de tinta | unidade | 25 | 2,33 | Tabela do jogo | B | 80 | Linha 'Emplastro, tintura, tinta' (~10 pc) mais o frasquinho (13 pc). O catálogo cobrava 8 pp. |
| Livro de estudo | volume | 1.200 | 120,00 | MtD | B | 250 | Hodges: 7 livros por ~£5 (1479). Mantém o id do catálogo. |
| Parafina (lacre) | barra (~10 usos) | 7 | 0,67 | MtD | B | 5 | O catálogo tem 'Parafina (lacre)' a 5 pc por uso. |
| Carta náutica | unidade | 3.300 | 333,33 | MtD | B |  |  |
| Mapa de rotas comerciais | unidade | 16.700 | 1.666,67 | MtD | B |  |  |

