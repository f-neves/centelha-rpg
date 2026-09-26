# Revisão econômica do Centelha · versão 2 (mudanças sobre a versão 1)

Estado: PROPOSTA com as decisões do autor de 25/09 à tarde e as correções aceitas da rodada A3 do Revisor. **Este documento lista só o que mudou.** O que não aparece aqui continua como na versão 1 (`revisao-economica-etapas-abc.md`). Os JSONs e o código foram gerados de novo e já trazem tudo.

## 0. Mapa para as pendências do Arquiteto

O Arquiteto registrou as 24 decisões como G47 a G70, na ordem do prompt. O mapa provável (o Arquiteto confirma):

| G | Seção | O que muda na v2 |
|---|---|---|
| G47 | A2 Equipamento de aventura | Pacotes recalculados; corda com o id `corda-canhamo` |
| G48 | A4 Moeda | Sem mudança |
| G49 | B1 ×20 | Redação: "as duas faixas de baixo", e não três |
| G50 | B2 Curva de renda | Redação corrigida (T3/T3-F); a conta não muda |
| G51 | B4 Tetos | Redação: a vila absorve até soma 8 |
| G52 | B5 Tabela de Renda | **Livre pela curva D (12% → 2%)**; nível de vida um degrau acima |
| G53 | B6 Recursos | Sem mudança |
| G54 | B8 Placa completa +39% | **Aceita pelo autor** |
| G55 | C5 Montarias | Burro, cavalo de criação, cavalo de guerra, barco de pesca, carroça |
| G56 | C6 Viagens | Sem mudança |
| G57 | C8 Servos e escravos | "Concubina" mantido como nome |
| G58 | E1 Qualidade | **Reescrita inteira** (seção 1 abaixo) |
| G59 | E4 Rações | Ração de viagem recomposta, continua 3 pc |
| G60 | E7 Correções de texto | Lista ampliada (seção 8) |
| G61 | A1 Munição | Sem mudança |
| G62 | A3 Mercadorias | Livro, papel, linho, saco de dormir, incenso, vestes |
| G63 | B3 G22 | Dias de trabalho por estação (seção 4) |
| G64 | B7 Status obrigatório | Quanto se poupa vivendo abaixo do nível |
| G65 | C4 Custo de vida | Cestas refeitas com o linho a 2 d |
| G66 | C7 Serviços | Cura mortal barata; cópia a 2 pc; soldo por dia corrido |
| G67 | E2 Reparo | Leve sem Montagem, pesado com metade, arruinada inteira |
| G68 | E3 Empréstimo de XP | Sem mudança |
| G69 | E5 Pacote inicial | Regra fechada, com os sete pacotes |
| G70 | E6 Arquivos do site | Novo `pacotes-equipamento.json`; o esquema precisa aceitar peso nulo |

**Novas, para registrar:**

1. **Renomear o Antecedente "Relíquia" para Artefato** (decisão do autor), porque "Relíquia" passa a ser rótulo de qualidade (seção 1).
2. **Revenda: metade do preço de compra, para qualquer item** (seção 2).
3. **Escopo desta revisão: só o mundano.** Preços e serviços sem Centelha, Proezas ou Magia. O sobre-humano e o modificador regional vêm depois da implementação no site.
4. **Semanas de aventura** (seção 10).

---

## 1. Qualidade (E1, reescrita) [DIVERGE]

**Decisões do autor.**

1. Graus: Sucata, Tosca, Comum, Boa, Ótima, **Excelente**. A Excelente é a antiga Excepcional: bônus +3, Requisito +3, Dificuldade +9.
2. **O degrau fica:** o intervalo sobe um degrau a cada dois graus, como hoje no texto.
3. **Preço fixo por grau:** Boa **5×**, Ótima **30×**, Excelente **70×**. Tosca até ⅓; Sucata até ⅙.
4. **Relíquia não é grau; é rótulo.** O valor dela não está na função: joias, adornos, valor sentimental, peça de exibição. Preço = a peça pela qualidade que ela tiver, mais os adornos, **com piso de 100×** a peça Comum. Uma Relíquia pode ser Comum por dentro.
5. **"Dura mais"** (a Excelente com material melhor) fica para a etapa de manutenção.
6. **Requisito máximo 6**, e cada ponto acima vira +3 na Dificuldade. Sem isso, nenhuma peça de Requisito 5 chega à Ótima.

**Conferência pela régua** (produtor capaz mais barato, curva de renda, × 1,8):

| Peça | Comum (avulso) | Boa 5x | Ótima 30x | Excelente 70x |
|---|---|---|---|---|
| Faca (linha Dif 4) | 5 pp 5 pc | 2 po 7 pp (régua 2,8x, 0,6 sem) | 16 po (régua 37,6x, 3,4 sem) | 38 po (régua 84,6x, 3,8 sem) |
| Espada (linha Dif 7) | 2 po 5 pp | 12 po (régua 2,3x, 0,9 sem) | 74 po (régua 30,4x, 6,2 sem) | 172 po (régua 72,9x, 14,8 sem) |
| Placa completa (Dif 11) | 36 po | 181 po (régua 2,1x, 6,4 sem) | 1.083 po (régua 270,0x, 810,0 sem) | impossível |


**Leitura.**

1. **Espada:** a régua dá 30× e 73×; o preço fixo (30× e 70×) paga o tempo do mestre. A Boa sai por 5× com custo de 2,3×. É o prêmio do bom artesão, limitado pela demanda, que é pequena a esse preço (argumento do autor).
2. **Faca:** a Ótima e a Excelente ficam um pouco abaixo da régua (37× e 85×). Ninguém faz faca Ótima para vender; faz por encomenda ou para si.
3. **Placa completa:** a Boa fica em 5× (181 po). A Ótima leva ~810 semanas (15 anos) de um mestre lendário, porque a armadura já é de semana e o degrau a leva para estação. **A 30× (1.083 po), nenhum mortal a faz.** Na prática, a Placa Ótima só existe como obra de Centelha, Proeza ou Arte, ou como tesouro antigo. A Excelente é impossível para humanos. É coerente com "armadura lendária", mas o livro precisa dizer. Decisão do autor: por enquanto fica o preço de 30×.
4. **Fabricar para si** vale muito: o artesão paga só o tempo (2,3× numa Boa), e não 5×. O livro deve dizer isso de propósito.
5. **Exemplo do Machado** (base 3 po): Boa 15 po; Ótima 90 po; Excelente 210 po; Relíquia a partir de 300 po.

## 2. Revenda (nova regra)

**Decisão do autor:** vender um item usado rende **metade do preço de compra**, para qualquer item. Vale para saque, troca de equipamento e peça de qualidade. A regra de joias e cristais como moeda (A4: 80% na cidade, 60% na vila, 40% na aldeia) continua sendo a exceção: joia é reserva de valor, não equipamento.

## 3. Tabela de Renda com a curva D (B5) [DIVERGE]

Livre = Renda × 12% × (60 ÷ Renda)^0,35. Vai de 12% no braçal a 2% na nobreza (decisão do autor: recomendação D).

| Recursos | Faixa | Renda/sem | Renda/mês | Livre/sem | Livre % | Livre/mês | Livre/ano | Custo/sem | Nível de vida |
|---|---|---|---|---|---|---|---|---|---|
| ● | Braçal | 60 | 240 | 7 | 11,7% | 28 | 336 | 53 | Pobre |
| ● | Destreinado | 100 | 400 | 10 | 10,0% | 40 | 480 | 90 | Pobre |
| ●● | Treinado | 270 | 1.080 | 19 | 7,0% | 76 | 912 | 251 | Confortável |
| ●●● | Especialista | 550 | 2.200 | 30 | 5,5% | 120 | 1.440 | 520 | Abastado |
| ●●● | Doutor | 820 | 3.280 | 40 | 4,9% | 160 | 1.920 | 780 | Abastado |
| ●●●● | Abastado | 1.400 | 5.600 | 55 | 3,9% | 220 | 2.640 | 1.345 | Rico |
| ●●●● | Rico | 2.700 | 10.800 | 85 | 3,1% | 340 | 4.080 | 2.615 | Rico |
| ●●●●● | Aristocrata | 4.200 | 16.800 | 110 | 2,6% | 440 | 5.280 | 4.090 | Aristocrata |
| ●●●●● | Nobreza | 10.000 | 40.000 | 200 | 2,0% | 800 | 9.600 | 9.800 | Aristocrata |


**O que o custo compra:**

| Faixa | Custo/sem | Pacote básico | Estilo de vida (resto) | Estilo % do custo | O que o pacote cobre |
|---|---|---|---|---|---|
| Braçal | 53 | 44 | 9 | 18% | 3 adultos-equivalentes, cesta de subsistência (35); Choupana (9) |
| Destreinado | 90 | 73 | 17 | 19% | 3 AE, cesta modesta (64); Choupana (9) |
| Treinado | 251 | 178 | 73 | 29% | 3 AE, cesta respeitável (94); Casa de artesão (35); Aprendiz (19); Roupa de artesão nova para o casal, por ano (10); Mula ou cavalo dividido (meio) (21) |
| Especialista | 520 | 362 | 158 | 30% | 3 AE, cesta respeitável (94); Casa de mercador (88); 2 criados (98); Um cavalo (42); Roupa fina para o casal, por ano (42) |
| Doutor | 780 | 537 | 243 | 31% | 3 AE, cesta farta (197); Casa de mercador (88); 2 criados e 1 cozinheiro (158); Um cavalo (42); Roupa fina para o casal, por ano (42); Livros, um por ano (10) |
| Abastado | 1.345 | 1.019 | 326 | 24% | 3 AE, cesta farta (197); Casa senhorial pequena (351); 4 criados, cozinheiro, cavalariço (304); Dois cavalos (83); Roupa fina, 2 por adulto por ano (83) |
| Rico | 2.615 | 1.890 | 725 | 28% | 3 AE, cesta de luxo (693); Casa senhorial pequena (351); Valete, 4 criados, cozinheiro, 2 cavalariços (472); Quatro cavalos (166); Roupa de corte, 1 por adulto por ano (208) |
| Aristocrata | 4.090 | 3.049 | 1.041 | 25% | 3 AE, cesta de luxo (693); Casa senhorial (351); Mordomo, 2 valetes, 6 criados, cozinheiro, 2 cavalariços (929); 4 guardas (247); Cavalo de guerra e 3 cavalos (413); Roupa de corte, 2 por adulto por ano (417) |
| Nobreza | 9.800 | 7.500 | 2.300 | 23% | 3 AE, cesta de luxo (693); Paço (1.753); Casa: mordomo, capelão, 2 escudeiros, 6 valetes, 12 criados, 3 cozinheiros, 4 cavalariços (2.322); 12 guardas (740); 2 cavalos de guerra e 8 cavalos (909); Roupa de corte 2 e gala 1 por adulto por ano (1.083) |


1. O estilo de vida agora pesa 18% a 31% do custo em todas as faixas. O braçal passou a ter algum (cerveja, festa de aldeia).
2. **Nível de vida um degrau acima** (correção do Revisor): o pacote do Especialista e do Doutor é de nível Abastado, e não Confortável.
3. **Consequência para o jogador:** o salário ajuda pouco. O Treinado junta um rocim em ~2,5 anos, e o Especialista uma cota de malha em ~43 semanas. O dinheiro grande vem da aventura. O autor pediu para voltar a esse impacto depois.
4. **B7, quanto se poupa vivendo abaixo do nível:** a diferença entre os dois níveis na tabela por pessoa. Um Especialista (nível Abastado, 200) que vive como Confortável (65) poupa 135 por semana, 4,5 vezes o Livre dele. Por isso a jogada de Temperança existe.
5. **Calendários:** comparação histórica em ano de 365 dias; tabela do jogo em ano de Uldun (48 semanas). O documento anterior misturava os dois em dois lugares.

## 4. Dias de trabalho (B3) [acrescenta]

**Decisão do autor:** a semana de trabalho tem 6 dias de 8. Na guerra e na colheita, 7 ou 8; fora de estação, conforme o ofício, pode cair para 5.

1. A renda da semana é proporcional aos dias trabalhados: (renda da faixa ÷ 6) × dias.
2. O custo de vida não cai. Uma família de braçal numa semana de 5 dias ganha 50 e gasta 53: fica no vermelho e come a poupança. É a fome sazonal histórica, e dá jogo (o inverno é tempo de dívida).
3. Conferência: 6 de 8 dias = 75% do ano. O trabalhador medieval ficava em 70% a 77%.

## 5. Mercadorias e animais (A3, C5)

| Item | v1 | v2 | Motivo |
|---|---|---|---|
| Folha de papel | 7 | **3** | Mundo letrado (autor) |
| Livro de estudo | 1.200 | **500** | Mundo letrado: ~200 páginas a 2 pc, ~100 folhas, encadernação |
| Caderno de notas | não existia | **50** | Novo |
| Livro iluminado ou raro | não existia | **2.000** (a partir de) | Novo |
| Linho comum | 20 | **13** | 2 d por jarda fecha a camisa de 8 d (Revisor) |
| Saco de dormir | 60 | **80** | 1 jarda de lona era pouco pano (Revisor); fica acima do cobertor, porque leva lona e manta |
| Bloco de incenso | 10 | **17** | A nota dava 18; o preço estava errado (Revisor) |
| Vestes (pacote Sacerdote) | 480 | **50** | As de 480 viram "Vestes eclesiásticas bordadas", item separado |
| Corda de cânhamo | id `corda` | id **`corda-canhamo`** | É o id do catálogo (Revisor) |
| Ração de viagem | 3 | **3** | Recomposta: pão grosseiro, queijo, toucinho = 0,42 d |
| Burro | 670 | **330** | Estava acima do cavalo de carga (Revisor) |
| Cavalo de criação | 1.300 | 1.300 | Nota nova: é o cavalo de tração vendido como gado; + 8 semanas de adestramento (1.000) = rocim |
| Adestrar cavalo de guerra | 5.300 | **8.000** | 24 semanas de perito sobre um rocim robusto (~3.100) = cavalo de guerra de escudeiro (11.200) (Revisor) |
| Barco de pesca | 3.000 | **1.600** | Tem linha de fabricação (acoes-oficio-e-mundo.md:173); pela regra Misto, segue a tabela |
| Carroça | 300 | **300** | Decisão do autor; a linha de fabricação (~1.600) precisa ser recalibrada, como a do sapato |

Notas corrigidas (Revisor): peixe fresco (fica abaixo do arenque salgado, e não entre ele e a carne) e óleo de lamparina (um pouco acima do sebo por peso, e não abaixo).

## 6. Serviços (C7)

1. **Cura mortal barata** (decisão do autor: sem magia, a cura é pouco eficaz). Cada nível de Cura de quem trata acelera a recuperação em **10%**; 50% exige Cura 5.

| Serviço | v1 | v2 |
|---|---|---|
| Curandeiro ou barbeiro-cirurgião, atendimento | 5 | **3** |
| Médico sem magia, consulta | 30 | **15** |
| Tratamento diário | 85 | **10** |

   Com Proeza ou Magia, o preço é outro. Fica para a etapa sobre-humana.
2. **Cópia simples:** 4 → **2 pc por página** (mundo letrado).
3. **Soldo por dia corrido** (ponto do Revisor): o soldo militar é pago todos os dias, inclusive os de descanso. O arqueiro a 20 por dia recebe 160 por semana de 8 dias, contra 130 do oficial. A diferença é o prêmio de risco. Fica assim, e o livro diz.

## 7. Pacote inicial (E5) e pacotes de equipamento

**Regra.** Na criação, o personagem ganha **um pacote de graça** (o Diplomata exige Recursos 3) mais uma **bolsa de 4 semanas de Livre** da faixa (curva D: braçal 28, Treinado 76, Especialista 120).

| Pacote | Hoje | Novo | Itens (preço x quantidade) |
|---|---|---|---|
| Artista | 360 | 572 | Mochila (100); Saco de dormir (rolo de lona e lã) (80); Fantasia x2 (100); Vela de sebo x5 (10); Ração de viagem (1 dia) x5 (15); Cantil ou odre (17); Kit de disfarce (250) |
| Assaltante | 186 | 540 | Mochila (100); Esferas de metal (1000) (45); Linha (3 m) (1); Sino de mão (25); Vela de sebo x5 (10); Pé de cabra (50); Martelo (ferramenta) (25); Píton (cravo de ferro) x10 (70); Lanterna coberta (130); Frasco de óleo de lamparina x2 (20); Ração de viagem (1 dia) x5 (15); Pederneira e fuzil (caixa de fogo) (7); Cantil ou odre (17); Corda de cânhamo (15 m) (25) |
| Aventureiro | 110 | 394 | Mochila (100); Pé de cabra (50); Martelo (ferramenta) (25); Píton (cravo de ferro) x10 (70); Tocha x10 (70); Pederneira e fuzil (caixa de fogo) (7); Ração de viagem (1 dia) x10 (30); Cantil ou odre (17); Corda de cânhamo (15 m) (25) |
| Diplomata | 1.068 | 1.068 | Baú (50); Caixa para mapas ou pergaminhos x2 (70); Conjunto de roupas finas (800); Vidro de tinta (25); Pena de escrever (1); Lâmpada (lamparina) (30); Frasco de óleo de lamparina x2 (20); Folha de papel x5 (15); Vidro de perfume (50); Parafina (lacre) (7) |
| Estudioso | 382 | 677 | Mochila (100); Livro de estudo (500); Vidro de tinta (25); Pena de escrever (1); Folha de pergaminho x10 (30); Saquinho de areia (1); Faca pequena (20) |
| Explorador | 85 | 336 | Mochila (100); Saco de dormir (rolo de lona e lã) (80); Kit de refeição (tigela, colher, caneca) (7); Pederneira e fuzil (caixa de fogo) (7); Tocha x10 (70); Ração de viagem (1 dia) x10 (30); Cantil ou odre (17); Corda de cânhamo (15 m) (25) |
| Sacerdote | 149 | 384 | Mochila (100); Cobertor de lã grossa (65); Vela de sebo x10 (20); Pederneira e fuzil (caixa de fogo) (7); Caixa de esmolas (10); Bloco de incenso x2 (34); Incensário (75); Vestes cerimoniais simples (50); Ração de viagem (1 dia) x2 (6); Cantil ou odre (17) |


A mochila (100) pesa em cinco dos sete. Se os pacotes parecerem caros, ela é o primeiro item a rever.

## 8. Reparo (E2) [DIVERGE]

O Revisor apontou que, no livro, a Montagem se paga inteira também no reparo (acoes-oficio-e-mundo.md:190). Com isso, um reparo leve de uma espada sozinha custava 44% do preço dela. **Decisão do autor: o reparo fica mais barato**, e o próprio personagem conserta coisa pequena com Ofícios Gerais.

**Regra nova:**

1. **Dano leve:** sem Montagem; um quarto da Peça. Dá para fazer no campo, sem oficina, com Ofícios Gerais ou o ofício.
2. **Dano pesado:** metade da Montagem e metade da Peça. Precisa de oficina.
3. **Arruinada, com material aproveitável:** Montagem e Peça inteiras.
4. Mesma Dificuldade e mesmo intervalo da peça. "Ofícios Gerais devolve a peça ao uso; só o ofício devolve a qualidade" continua valendo.

**Preço por encomenda, em fração do preço da peça:**

| Peça | Leve (sem Montagem) | Pesado (meia Montagem) | Arruinada (Montagem inteira, sem material) |
|---|---|---|---|
| Faca | 6% | 33% | 67% |
| Espada | 8% | 33% | 67% |
| Placa completa | 13% | 33% | 67% |


Para o livro: **leve, cerca de 1/10 do preço; pesado, 1/3; arruinada, 2/3 mais o material que faltar.** O dano pesado dá sempre 1/3, qualquer que seja a peça, porque é metade de tudo.

**Tempo de exemplo:** o dano leve numa espada soma 2,5 pontos de Acúmulo. Um personagem com média 14 e Ofícios Gerais trabalha contra Dificuldade 11 (7 da espada, mais 4 por não ter o ofício): 3 pontos por dia. Conserta em menos de um dia.

## 9. Correções de texto (E7, lista ampliada)

1. **Salto entre degraus:** o Revisor mostrou que o minuto é "dezenas de segundos" (Acoes_Sistema.md:210) e que o capítulo publicado já tirou esse parêntese (acoes-e-sistema.md:146). A correção fica **só no Acoes_Sistema.md:216**. A frase nova sai quando o Arquiteto confrontar o texto atual.
2. A fórmula do ofício aparece também em **Acoes_Sistema.md:1318**.
3. **Qualidade:** Acoes_Sistema.md:1108-1120; acoes-oficio-e-mundo.md:78-83, :89-96 (o gabarito) e :98; custo-de-servico-e-itens.md:63-74 e :125.
4. **Entram na lista:** Recursos (tabela de Renda, coluna ●), escravos (preços e sustento), viagens (km), montarias e animais, roupas, rações, Itens Gerais, Antecedente Relíquia → novo nome.

## 10. Semanas de aventura (regra nova, Jogador)

Com o Livre baixo, o livro precisa dizer o que acontece com o dinheiro enquanto o personagem aventura.

1. **Semana de aventura não tem renda:** o personagem não trabalhou.
2. **O custo de vida da faixa continua se ele tem casa ou família:** aluguel, criados, família. O Especialista que vive como Abastado segue gastando ~520 por semana, mesmo longe.
3. **Quem não tem casa fixa não paga o custo da faixa;** paga o que gasta na estrada (ração, estalagem, estábulo).
4. **Semana parcial:** a renda é proporcional aos dias trabalhados (seção 4).

Efeito: aventurar custa caro para quem tem vida estabelecida, e o saque precisa pagar a ausência.

## 11. Adendo da Etapa D (resposta à rodada D1 do Revisor)

**11.1 B2: o texto corrigido** (o bloqueio de redação da A3; a conta não muda). Substitui, na seção B2 da v1, a frase "o preço de um produto é dado pelo produtor mais barato que consegue fazê-lo":

> O preço de uma peça é dado pelo **produtor de referência**: o oficial da tabela (T3) onde ele alcança a peça; onde não alcança, o menor perfil capaz (T3-F). Para esse produtor, fazer a peça tem de render o mesmo que a alternativa dele. O oficial (média 10,5) escolhe entre serviço simples (6,5 × 20 = 130) e peça de Dificuldade 7: só faz a peça se ela pagar 130 ÷ 3,5 = 37,1 pc por ponto. O perito (média 16), menor perfil capaz da Dificuldade 11, escolhe entre a Dificuldade 7 (9 × 37,1 = 334) e a 11: 334 ÷ 5 = 66,9 pc por ponto.

**11.2 As "duas réguas" (achado 2 do Revisor): não há duas réguas.** A fórmula (média − 4) × 20 é a renda do **serviço simples** (Dificuldade 4), não a régua da fabricação. Um perito que fabrica espadas vende pelo preço de mercado, que é o do oficial, e faz 9 pontos por dia contra 3,5 do oficial. Ele ganha 9 × 37,1 = **334 por semana: exatamente a curva convexa**. O mesmo vale para o serviço contratado. Fabricar e alugar o trabalho rendem o mesmo em todas as faixas.
O único lugar onde a renda do perito entrou no **custo** de uma peça é a Placa completa (produtor T3-F), e ali já está a correção de +39% (B8, aceita). Munição e as linhas novas são do oficial (soma 6), onde as duas fórmulas dão 130.

**11.3 Pacote inicial (achado 5):** o pacote é **de graça**; a bolsa de 4 semanas de Livre é um extra para gastos da estrada, e não serve para comprar o pacote. A bolsa pequena é intencional: o personagem começa com o pacote e pouco dinheiro.

**11.4 "Excepcional" → "Excelente":** aceito o achado 4. O rename vale **só** para o grau de qualidade. O degrau "Excepcional" da escada de Dificuldade (25) não muda. A lista exata de linhas está no estado-revisao.md (Rodada D1).

**11.5 Carroça:** aceito a calibração do Revisor. A linha atual (Req 3, Dif 7, Montagem 4, Peça 20) passa a ser de **dia**, e não de semana: avulso ~267 pc, lote de 3 ~238 pc; o preço de 300 fica 1,12 vez o avulso, a mesma proporção do sapato. A linha compartilhada vira duas: carroça (dia) e barco de pesca (semana, ~1.600).

**11.6 B8:** fechado. A Transição e a Articulada são do oficial; só a Placa completa muda.

**11.7 "Concubina":** o autor decidiu manter o nome. Fechado.

**11.8 Cura mortal e cópia barata:** um curandeiro sem magia que vivesse só de tratamento (10 pc por dia) ganharia 60 por semana, abaixo do custo de vida do oficial. É intencional: a cura mortal é pouco eficaz, e quem a pratica vive de outra coisa (barbeiro, herbanário, parteira). O copista, a 2 pc por página e umas 8 páginas por dia, ganha ~96 por semana, entre o destreinado e o oficial: coerente com um mundo letrado, cheio de copistas.

## 12. O que continua pendente

1. **Depois do site:** sobre-humano (Centelha, Proezas, Magia) e modificador regional.
2. **Impacto do Livre baixo no jogador**, para depois.

---

# Anexo · Tabela de mercadorias v2


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
| Peixe fresco | 1 kg | 3 | 0,33 | Derivado | C |  | Sem fonte direta; abaixo do arenque salgado por kg (o sal e a cura custam). Litoral e rios: modificador regional forte. |
| Congro salgado | unidade | 40 | 4,00 | Hodges | A |  | 1422-1423. |
| Frango ou galinha abatida | unidade | 4 | 0,40 | Derivado | C | 2 | Galinha viva (0,5 d) mais o abate. |
| Frutas frescas (maçã, pera) | dúzia | 1 | 0,10 | Derivado | C | 3 | Sem fonte direta; fruta de pomar era barata na estação. |
| Legumes e verduras (couve, cebola, alho-poró) | maço (~1 kg) | 1 | 0,07 | Derivado | C |  | Horta: quase sem preço de mercado; valor simbólico. |
| Ração de viagem (1 dia) | 1 dia | 3 | 0,28 | Derivado | C | 2 | 0,5 kg de pão grosseiro (0,15 d), 0,1 kg de queijo (0,11 d), 0,1 kg de toucinho (0,11 d) e embalagem. = três refeições pobres de estalagem. |

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
| Linho comum | jarda (~0,9 m) | 13 | 1,33 | Derivado | C |  | Da camisa de linho de Hodges (8 d em 1313): ~2,5 jardas a 2 d mais costura fecham os 8 d. Cestas de subsistência e respeitável. |
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
| Vestes cerimoniais simples | conjunto | 50 | 5,00 | Catálogo | B | 50 | Mantido. É a veste do pacote Sacerdote. |
| Vestes eclesiásticas bordadas | conjunto | 480 | 48,00 | MtD | B |  | Paramento de igreja rica. |
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
| Frasco de óleo de lamparina | frasco (~0,5 L) | 10 | 1,00 | Derivado | C | 10 | Óleo vegetal ou de peixe: 3 d por litro, um pouco acima do sebo por peso. Mantém o id do catálogo. **R-estável.** |
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
| Saco de dormir (rolo de lona e lã) | unidade | 80 | 8,18 | Derivado | C | 10 | Jarda e meia quadrada de lona (8,25 d), manta de enchimento (1 d) e costura. Fica acima do cobertor, porque leva lona e manta. |
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
| Bloco de incenso | unidade (~50 g) | 17 | 1,73 | Derivado | C | 5 | Resina importada a ~2s por libra: 50 g = ~2,6 d. |
| Incensário | unidade | 75 | 7,43 | Derivado | C | 30 | Latão fundido mais um dia e meio de latoeiro. |

#### Escrita

| Item | Unidade | pc | Dias de braçal | Fonte | Conf. | Catálogo | Nota |
|---|---|---|---|---|---|---|---|
| Folha de papel | folha | 3 | 0,30 | Derivado | C | 2 | Mundo letrado (decisão do autor): papel comum, no preço do pergaminho. A MtD dá 8 C (papel raro antes de 1400). Mantém o id do catálogo. |
| Folha de pergaminho | folha | 3 | 0,33 | MtD | B | 1 | Mantém o id do catálogo. |
| Folha de velino | folha | 10 | 1,00 | MtD | B |  |  |
| Pena de escrever | unidade | 1 | 0,10 | Catálogo | B | 1 | Mantido. |
| Vidro de tinta | unidade | 25 | 2,33 | Tabela do jogo | B | 80 | Linha 'Emplastro, tintura, tinta' (~10 pc) mais o frasquinho (13 pc). O catálogo cobrava 8 pp. |
| Livro de estudo | volume | 500 | 50,00 | Derivado | C | 250 | Mundo letrado: ~200 páginas de cópia a 2 pc, ~100 folhas a 3 pc, encadernação. Histórico: ~180 d (12 po). Mantém o id do catálogo. |
| Caderno de notas | unidade (~40 folhas) | 50 | 5,00 | Derivado | C |  | Folhas de papel costuradas com capa de couro. |
| Livro iluminado ou raro | volume | 2.000 | 200,00 | Derivado | C |  | Iluminura e cópia fiel; a partir de 20 po. |
| Parafina (lacre) | barra (~10 usos) | 7 | 0,67 | MtD | B | 5 | O catálogo tem 'Parafina (lacre)' a 5 pc por uso. |
| Carta náutica | unidade | 3.300 | 333,33 | MtD | B |  |  |
| Mapa de rotas comerciais | unidade | 16.700 | 1.666,67 | MtD | B |  |  |

