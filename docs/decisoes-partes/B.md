Despachos lidos: 110, 111, 112, 113, 114, 115, 116, 117, 118, fechamento-economia-reforma, inventario-calculos, inventario-e01-e06, m-virtude-somada, revisao-regras-basicas (todos existem; nenhum faltou). Sem decisão de regra: inventario-calculos (levantamento só de leitura), inventario-e01-e06 (correção de exibição "sem mudar nenhum poder"), revisao-regras-basicas (só leitura). Origens dos despachos em docs/simulacao/caixa/, shas = commit que criou o despacho. Os capítulos citados estão em src/content/chapters/.

### B-001 · Preço sempre objeto {pc}; Livre = Renda x 12% x (60/Renda)^0,35 [tags: economia, renda, livre]
- Data: 2026-09-25
- Decisão: (resumo) formato "decisão do autor" F1-F6: preço sempre `"preco": {"pc": N}`, procedência é lore e não dado, JSONs de economia são saída do modelo `gerar.py`. F6: "_nota" de renda.json = "Livre = Renda x 12% x (60/Renda)^0,35 (curva D: 12% no braçal, 2% na nobreza), arredondado."
- Origem: docs/simulacao/caixa/110-despacho.md:36-53, commit 1860d7b3
- Estado: no ar (fórmula do Livre depois unificada, ver B-014)

### B-002 · Placa Completa sobe para 3.600 pc (B8) [tags: economia, armadura, preco]
- Data: 2026-09-25
- Decisão: (resumo) "pela decisão B8 (aceita, estado-revisao.md:922, +39%) tem de subir para 3.600 pc" (era 2.600).
- Origem: docs/simulacao/caixa/110-despacho.md:19-23, commit 1860d7b3
- Estado: no ar (não conferido)

### B-003 · Antecedente Relíquia vira Artefato [tags: antecedentes, artefato, ficha]
- Data: 2026-09-25
- Decisão: (resumo) renomear "Relíquia" para "Artefato" em antecedentes.json, com migração de ficha salva (entrada equivalente a `RENOMES`).
- Origem: docs/simulacao/caixa/110-despacho.md:25-32 e :73-74, commit 1860d7b3
- Estado: no ar (antecedentes.md:203 "### Artefato")

### B-004 · Grau de qualidade: Excepcional vira Excelente; multiplicadores fixos [tags: economia, qualidade, preco, oficio]
- Data: 2026-09-25
- Decisão: (resumo) nomes Sucata/Tosca/Comum/Boa/Ótima/Excelente; "multiplicador fixo Boa 5×, Ótima 30×, Excelente 70×" (Tosca até ⅓, Sucata até ⅙); "Excelente/Relíquia é rótulo com piso de 100×"; "Requisito máximo 6 (cada ponto acima vira +3 na Dificuldade)". Não trocar "Excepcional" do degrau 25 da escada de Dificuldade. Mantido o degrau "intervalo sobe a cada dois graus".
- Origem: docs/simulacao/caixa/110-despacho.md:93-118, commit 1860d7b3 (reaplicado na 113, :53-56)
- Estado: no ar (custo-qualidade-e-equipamento.md:25 e :29, acoes-oficio-e-mundo.md:82)

### B-005 · Régua de reparo: leve ~1/10, pesado ~1/3, arruinada ~2/3 [tags: economia, oficio, reparo, montagem]
- Data: 2026-09-25
- Decisão: (resumo) sai "A Montagem se paga igual"; entra a régua E2: leve ~1/10 do preço sem Montagem, pesado ~1/3 com meia Montagem, arruinada ~2/3 mais o material que faltar.
- Origem: docs/simulacao/caixa/110-despacho.md:103-106 (e 113-despacho.md:58-61), commit 1860d7b3
- Estado: no ar (não conferido)

### B-006 · Carroça em dias, barco de pesca em semanas [tags: economia, oficio, fabricacao]
- Data: 2026-09-25
- Decisão: (resumo) Carroça: Carpintaria, Req 3, Dif 7, Montagem 4, Peça 20, escala de dias (~267 pc avulso, 6,3 dias); barco de pesca em semanas, ~1.600 pc. Na 113 o despacho corrige para 6,9 dias.
- Origem: docs/simulacao/caixa/110-despacho.md:107-112; 113-despacho.md:63-64, commit 1860d7b3
- Estado: no ar (acoes-oficio-e-mundo.md:164 "6,9 dias")

### B-007 · Fabricar vs alugar trabalho: só com a ressalva [tags: economia, oficio, renda]
- Data: 2026-09-25
- Decisão: "coincidem no produtor de referência de cada faixa de Dificuldade; fora dele, divergem, e o sinal muda com a soma". Proibido escrever "fabricar e alugar rendem o mesmo" sem essa ressalva.
- Origem: docs/simulacao/caixa/110-despacho.md:119-124, commit 1860d7b3
- Estado: no ar (não conferido)

### B-008 · Semanas de aventura e Cura acelerada por nível de Cura [tags: economia, semanas, cura, recursos]
- Data: 2026-09-25
- Decisão: (resumo) seções novas: "Semanas de aventura" (renda proporcional a dias trabalhados em semana parcial, sem custo de vida de faixa para quem não tem casa fixa; depois reescrita, ver B-019 e B-020) e Cura acelerada (G66): "cada nível de Cura acelera a recuperação em 10%; 50% exige Cura 5".
- Origem: docs/simulacao/caixa/110-despacho.md:131-135, commit 1860d7b3
- Estado: no ar (cura: vida-ferimentos-cura.md:90); semanas de aventura substituída por B-019/B-020

### B-009 · Âncora do sistema de preços: 1 dia de braçal = 10 pc = 1,5 penny [tags: economia, preco, ancora]
- Data: 2026-09-26
- Decisão: (resumo) o README de lore/economia/ deve registrar "a âncora do sistema inteiro de preços: 1 dia de braçal = 10 pc = 1,5 penny". Mesmo despacho: vocabulário fechado de `por` (unidade, dia, hora, jornada, semana, mes, ano, km, 10 km, tonelada-km, trajeto, vez, pagina, carta, consulta, atendimento, noite, cerimonia, apresentacao, animal, pessoa), com `muda`=unidade e `parto`=atendimento "decidido pelo autor"; o modelo Python emite o formato direto (formato, sem mudar valor).
- Origem: docs/simulacao/caixa/112-despacho.md:25-60 (formato na 111-despacho.md:17-55), commit b95bca64
- Estado: no ar (não conferido)

### B-010 · Fórmula do ganho com o ofício (B2): curva por soma, melhor faixa, tetos [tags: economia, renda, oficio, longa, firula]
- Data: 2026-09-26
- Decisão: (resumo) sai a fórmula linear "(média − 4) × 10 pc". Entra: ganho por semana = melhor de (média − Dificuldade) × valor da faixa: simples (Dif 4) 20 pc/ponto, ofício (Dif 7) 37, arte rara (Dif 11) 67; bônus: a segunda Habilidade soma fixo, só uma, "Firula não conta"; exemplo oficial (soma 6) 130, perito (9) 330, mestre (12) 670; tetos de demanda aldeia 100, vila 300, cidade 1.000, capital sem teto, "o teto limita o ganho, não a venda bruta"; semana = 6 jornadas em 8 dias (7 ou 8 na guerra/colheita, 5 fora de estação).
- Origem: docs/simulacao/caixa/113-despacho.md:23-46, commit 8d0b281b
- Estado: no ar (acoes-oficio-e-mundo.md:250 "Firula não conta")

### B-011 · Jornada por ofício e salto entre degraus "de oito a sessenta vezes" [tags: oficio, jornada, dificuldade]
- Data: 2026-09-26
- Decisão: (resumo) jornada: leve 6 h, artesão 8 h, braçal 10 h; meia jornada = meio intervalo; apressar = dobrar a jornada do ofício. Em Acoes_Sistema.md o salto passa de "de dez a sessenta vezes" para "de oito a sessenta vezes"; relacoes-sociais.md "8 a 24" fica.
- Origem: docs/simulacao/caixa/113-despacho.md:73-80, commit 8d0b281b
- Estado: no ar (não conferido)

### B-012 · Tudo em pc; arredondamento das taxas [tags: economia, preco, arredondamento]
- Data: 2026-09-26
- Decisão: (resumo) toda tabela de preço, renda, custo e salário mostra só pc com ponto de milhar; taxas (renda por perfil, diária, hora, salário, Livre) em pc inteiro, meio para cima; preços de loja mantêm `arred`; serviços derivados do perfil usam o inteiro da tabela de perfil; nenhuma vírgula decimal nas tabelas de economia.
- Origem: docs/simulacao/caixa/114-despacho.md:76-96, commit 54510af2
- Estado: no ar (não conferido)

### B-013 · Recursos 0 a 6, Nobreza = 6, regra de Imprevistos [tags: economia, recursos, renda, livre, antecedentes]
- Data: 2026-09-26
- Decisão: "Nobreza 6" (Braçal/Destreinado 1; Treinado 2; Especialista/Doutor 3; Abastado/Rico 4; Aristocrata 5). Texto: "Recursos 0. Sem renda contínua. Vive do que ganha em trabalhos e recompensas." Imprevistos: "A cada estação (12 semanas), o personagem perde o Livre de tantas semanas quanto o seu Recursos. Na conta do ano: Livre/Ano = Livre/Sem × (48 − 4 × Recursos)." Em jogo o Mestre pode narrar o imprevisto no lugar do desconto, "nunca os dois". Colunas da tabela: Recursos, Faixa, Renda/Sem, Custo/Sem, Livre/Sem, Livre/Ano.
- Origem: docs/simulacao/caixa/114-despacho.md:98-138, commit 54510af2
- Estado: no ar (custo-de-servico-e-itens.md:35 e :57)

### B-014 · Livre: regra única, inteiro meio para cima [tags: economia, livre, renda, arredondamento]
- Data: 2026-09-26
- Decisão: "Regra única para o Livre: pc inteiro, meio para cima, em toda tabela"; "Livre = Renda × 0,12 × (60/Renda)^0,35". Valores: Braçal 7/308; Destreinado 10/440; Treinado 19/760; Especialista 30/1.080; Doutor 39/1.404; Abastado 56/1.792; Rico 85/2.720; Aristocrata 114/3.192; Nobreza 200/4.800. Sai o `arred` do Livre da tabela de Renda. (Na 114 já fora fixada a coluna Livre/Sem por perfil com valores 7, 10, 12, 16, 19, 22, 26, 31, 35.)
- Origem: docs/simulacao/caixa/116-despacho.md:20-38 (114-despacho.md:160-163), commit 47ac4acc
- Estado: no ar (não conferido)

### B-015 · Tabela de serviços por perfil: Renda/Sem do livro, contrato/avulsa/hora [tags: economia, servicos, renda, perfil]
- Data: 2026-09-26
- Decisão: (resumo) Renda/Sem: soma 4 = 60, 5 = 100, 6 = 130, 7 = 200 (linha nova), 8 = 260, 9 = 330, 10 = 430, 11 = 570, 12 = 670. Diária por contrato = Renda/6; avulsa = Renda/4; hora = avulsa ÷ jornada (6, 8 ou 10 h). Coluna Livre/Sem. Texto: "A renda é o que o contratante gasta com quem trabalha. Quando o personagem trabalha por semanas, ele recebe o Livre/Sem, e não a renda". Nada sobre somar com Recursos (fica em aberto).
- Origem: docs/simulacao/caixa/114-despacho.md:140-169, commit 54510af2
- Estado: no ar (não conferido)

### B-016 · Sugestões do Comerciante (desgaste, Cura mundana, Empréstimo de XP, comércio regional) [tags: economia, desgaste, xp, comercio, pendencia]
- Data: 2026-09-26
- Decisão: (resumo) 1a a 1f registradas como pendências, "não aprovadas", NÃO implementar: desgaste e manutenção por marcas; Cura com Proeza/Magia encarece; Proeza na Longa; serviço mágico e raridade por lugar; Empréstimo de XP (tempo = custo em XP ÷ 2 em jornadas, dívida de metade do XP ganho, aula em grupo até 4 × 1,5); pechincha teto 20%, venda direta 70-100%. G44 tem desenho aprovado em parte pelo autor.
- Origem: docs/simulacao/caixa/114-despacho.md:29-74 e :242-300, commit 54510af2
- Estado: sem decisão do autor

### B-017 · Recompensa de caça, versão 1 (Degrau, Centelha, quantidade) [tags: economia, recompensa, caca, bestiario, centelha]
- Data: 2026-09-26
- Decisão: (resumo) Bolsa = Valor do degrau × Semanas × Tarefa × Risco × 3 (grupo de 3); Degrau = desafio + quantidade (+1 por dobra) + Centelha (+1 a cada 4); valor do degrau 15, 25, 45, 80, 140, 250, 430, 750, 1.300, 2.300, 4.000, 7.100 (15 × 1,75^(n−1)); Tarefa (afugentar 0,75; matar, trazer parte, recuperar 1; capturar vivo 1,5; sem ferimentos/domar 2); Risco (1, 1,5, 2, 3); Tom (0,5/1/2); urgência (1/3/10); três testes (prejuízo, capacidade, oferta); aldeia 1 trabalho/ano, vila 1/estação, cidade 1/mês. Calculadora /recompensa.
- Origem: docs/simulacao/caixa/115-despacho.md:62-124 e :173-209, commit 7cd7dfe6
- Estado: substituída por B-030 e B-032 (Degrau, Centelha e quantidade saíram); tabela de risco, Tarefa, Tom, urgência e testes seguem

### B-018 · Escalas do bestiário: desafio 1-12 e Centelha da criatura 0-12 (DECIDIR) [tags: bestiario, desafio, centelha, escala]
- Data: 2026-09-26
- Decisão: "Escalas desejadas pelo autor: nível de desafio de 1 a 12 (hoje 1 a 6, os losangos, campo `ameaca`) e Centelha da criatura de 0 a 12 (hoje 0 a 10). Definição do autor: nível de desafio X é feito para um grupo de 3 personagens de Centelha X ... É absoluto, não relativo ao grupo que joga. Personagem sem Centelha fere criatura com Centelha, e o inverso também." Pendência B14, ainda "DECIDIR". Fator da recompensa 1,75 → ~1,32 se a escala mudar.
- Origem: docs/simulacao/caixa/115-despacho.md:39-53, commit 7cd7dfe6
- Estado: substituída por decisão posterior a localizar (inventario-calculos cita depois "grupo de referência 4"; B-032 usa 4 personagens)

### B-019 · Recursos durante a aventura (versão 1, depois reescrita) [tags: economia, recursos, livre, aventura]
- Data: 2026-09-26
- Decisão: (resumo) o personagem recebe Livre de uma fonte por semana, ou nenhuma, nunca paga o custo de vida à parte; Recursos 1 a 3 é trabalho próprio (na semana de aventura não paga, entra o Livre do contrato); Recursos 4 a 6 é renda de propriedade, "continua pagando". Substitui a regra antiga de "Semanas de aventura".
- Origem: docs/simulacao/caixa/115-despacho.md:118-123 e :131-144, commit 7cd7dfe6
- Estado: substituída por B-020

### B-020 · Recursos durante a aventura, versão final (Livre continua entrando) [tags: economia, recursos, livre, aventura]
- Data: 2026-09-26
- Decisão: "1. O personagem nunca paga o custo de vida à parte. Ele recebe Livre, de uma ou mais fontes ... 2. A bolsa é o Livre do trabalho inteiro. Ela ocupa as semanas estimadas no contrato. 3. Recursos 1 a 3 é trabalho próprio: nas semanas do contrato, não rende. O personagem recebe só a bolsa. 4. Recursos 4 a 6 é renda de propriedade, que rende sem o dono presente: o Livre de Recursos continua entrando, somado à bolsa."
- Origem: docs/simulacao/caixa/117-despacho.md:17-34, commit db05cae8
- Estado: no ar (não conferido)

### B-021 · Despesas e quantidade na caçada (comida, fracas, semanas, bolsa alta de propósito) [tags: economia, recompensa, caca, despesas, semanas]
- Data: 2026-09-26
- Decisão: "Comida e pouso na estrada nunca são cobrados: fazem parte do custo de vida, que a bolsa já descontou. Em terra sem suprimento, o Mestre pode exigir que o grupo leve rações; aí contam o peso e os dias de autonomia, não o preço. Munição, cura, reparo, transporte, iscas e cães saem da bolsa." Quantidade: criaturas até 2 abaixo contam inteiras, mais fracas metade, "+1 cada vez que o total dobra". Semanas: "A viagem conta metade porque é tempo gasto, não perigo". Parágrafo "A bolsa por semana é alta de propósito".
- Origem: docs/simulacao/caixa/117-despacho.md:36-77, commit db05cae8
- Estado: despesas e semanas no ar (custo-servicos.md:86 e :147); regra de quantidade substituída por B-030/B-031

### B-022 · "Compare com personagens de Centelha parecida" [tags: economia, recompensa, texto]
- Data: 2026-09-26
- Decisão: troca de "Compare com os pares do grupo, não com um trabalhador" para "Compare com personagens de Centelha parecida, não com um trabalhador".
- Origem: docs/simulacao/caixa/118-despacho.md:15-23, commit 9e573a7a
- Estado: no ar (custo-servicos.md:147)

### B-023 · Parte por caçador arredonda para baixo, com sobra [tags: economia, recompensa, arredondamento]
- Data: 2026-09-26
- Decisão: "O autor decidiu: arredondar para baixo sempre, e mostrar a sobra quando houver." `Parte por caçador = piso(bolsa / tamanho do grupo)`; `Sobra = bolsa − Parte × grupo`.
- Origem: docs/simulacao/caixa/118-despacho.md:25-52, commit 9e573a7a
- Estado: substituída por B-032 (Adendo 5 tira a divisão por criatura); calculadora, no ar (não conferido)

### B-024 · Virtude nunca soma à parada de Atributo ou Habilidade, exceto Canalizar Virtude [tags: virtude, canalizar-virtude, jogada, regras-json]
- Data: 2026-09-26
- Decisão: "nenhum teste tem Virtude na parada ao lado de Atributo ou Habilidade; a Virtude se rola sozinha (teste de Virtude, Frenesi) ou entra como bônus pelo Canalizar Virtude, que continua valendo (M-18 segue aberto só quanto ao teto)". Escrever no capítulo de Virtudes e no regras.json.
- Origem: docs/simulacao/caixa/m-virtude-somada-despacho.md:8-12, commit 9596cd5d
- Estado: no ar (aparencia-virtudes-vontade.md:88)

### B-025 · "Vigor + Convicção" vira "Vigor + Resistência" [tags: resistir, vigor, virtude, convicção, artes]
- Data: 2026-09-26
- Decisão: "as 17 ocorrências de 'Vigor + Convicção' viram 'Vigor + Resistência' (dor, veneno e doença das Artes, Estabilizar sozinho, Sangramento), inclusive a tabela arcano.resistencia e src/pages/artes/regras.astro; a tortura que tenta dobrar a pessoa continua com Integridade".
- Origem: docs/simulacao/caixa/m-virtude-somada-despacho.md:13-15, commit 9596cd5d
- Estado: no ar (não conferido)

### B-026 · Banir e Círculo resistem pela Defesa Mental passiva [tags: resistir, defesa-mental, artes, efeitos]
- Data: 2026-09-26
- Decisão: "Banir e Círculo (efeitos.json, 'Vontade + Convicção') resistem pela Defesa Mental passiva".
- Origem: docs/simulacao/caixa/m-virtude-somada-despacho.md:16, commit 9596cd5d
- Estado: no ar (não conferido; efeitos.json:3687 Banir, :3781 Círculo)

### B-027 · Reforma da Centelha: 2 × mín(Centelha, Habilidade) em jogada e Defesa; dano soma inteira [tags: centelha, reforma, jogada, defesa, dano]
- Data: 2026-10-01
- Decisão: "Reescrever pela Reforma: 2 × mín(Centelha, Habilidade) em toda jogada e Defesa; dano soma a Centelha inteira." Sai "a Centelha soma +1 por ponto dos dois lados de qualquer disputa" (coracao-do-sistema.md:91); varrer sobras do "+1 por ponto" (nota de regras.json:114 e centelhaMult, só texto; código lido registra como pendência).
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:10-22, commit ad426d63
- Estado: no ar (coracao-do-sistema.md:91)

### B-028 · Valor Passivo, fórmula única com a Reforma [tags: valor-passivo, centelha, especialidade, reforma, passiva]
- Data: 2026-10-01
- Decisão: "Valor Passivo = (Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade) + Especialidade (só quando o escopo dela se aplica, somada no momento do uso)", mesma redação em coracao-do-sistema.md, no exemplo do guarda e em acoes-e-sistema.md:121; calc.ts usa `centelhaNaJogada` e continua sem a Especialidade no número parado; guarda comum (Centelha 0) = (Percepção + Prontidão) × 2.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:11-17 e :125-140, commit ad426d63
- Estado: no ar (acoes-e-sistema.md:123, coracao-do-sistema.md:89)

### B-029 · Jogada só de Atributo: +1 por ponto de Centelha, regra oficial; Centelha fora da Longa [tags: centelha, jogada, atributo, longa, d12]
- Data: 2026-10-01
- Decisão: "Jogada só de Atributo (sem Habilidade): +1 por ponto de Centelha. É regra oficial: tire de centelhaSoAtributo o rótulo de provisória/pendência, escreva a regra em centelha.md junto ao item 1 e feche a pendência correspondente (D12)." Confirmar que "A Centelha não entra na Longa" (acoes-e-sistema.md:107) segue valendo.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:17-26, commit ad426d63
- Estado: no ar (não conferido; centelha.md não achado por busca de "sem Habilidade")

### B-030 · Recompensa v2: tabela de valor por desafio, ×4, soma de criaturas (substituída) [tags: economia, recompensa, caca, desafio, bestiario]
- Data: 2026-10-01
- Decisão: "Valor por criatura (por caçador, por semana), pela tabela de desafio, PROVISÓRIA até a bancada: 0 = 40, 1 = 95, 2 = 270, 3 = 910, 4 = 3.600, 5 = 14.500, 6 = 57.900, 7 = 231.700, 8 = 926.800, 9 = 3.707.300." "Bolsa = Valor do encontro × Semanas × Tarefa × Risco × 4. Saem o Degrau, o termo de Centelha e a regra de quantidade". "A partir do desafio 5, a bolsa é paga em terra, título, direito ou favor, no valor da tabela." Desafio digitado na calculadora, sem preencher fichas (autor aprovou); exemplos com lobo = 0.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:27-44 e :120-123, commit ad426d63
- Estado: parcial: tabela e ×4 (depois "Pessoas") no ar; soma de criaturas e pagamento por bando substituídos por B-031 e B-032

### B-031 · Equivalentes e desafio do encontro (+1/2 por dobra), depois 2c [tags: economia, recompensa, magnitude, horda, desafio]
- Data: 2026-10-01
- Decisão: "cada desafio abaixo da mais forte divide por 4, sem piso"; "Desafio do encontro = desafio da mais forte + 1/2 a cada dobra dos equivalentes" (1: +0; 2-3: +1/2; 4-7: +1; 8-15: +1 1/2 ...), ligado à Magnitude da Regra de Horda; meio degrau = média geométrica, `arred`. Adendo 3: "+1/2 por dobra" fica PROVISÓRIO; worg = 0 (4 worgs = desafio 1, valor 95, bancada mediu 3); parte arredonda para baixo, sobra à mais forte; degrau na borda 127/128 aceito; fila B14: medir bando N = 1..32 com Horda e suspeita de Guarda sob pressão pesada com 2 a 4 atacantes.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:142-197, commit ad426d63
- Estado: substituída por B-032 (parte e divisão por criatura saem); equivalentes seguem como "ajuda opcional" provisória

### B-032 · Recompensa é o preço de UM TRABALHO (desafio do trabalho) [tags: economia, recompensa, trabalho, desafio, bestiario]
- Data: 2026-10-02
- Decisão: "Bolsa = Valor(desafio do trabalho) × Semanas × Tarefa × Risco × 4. O desafio do trabalho é o do pior confronto que o grupo precisa vencer." "Matar criaturas sem trabalho contratado não paga nada." "Cumprir parte do trabalho não paga parte, a não ser que o Mestre decida." Pagamento por peça fica na Tarefa "trazer parte". Saem: divisão por criatura, parte no contrato, sucesso parcial, empate, "solitária: tudo ou nada". Equivalentes viram ajuda opcional. Animal comum não tem desafio ("a ficha traz uma nota de quantos formam um desafio 0"). Worg é besta mágica com desafio próprio, lobo é animal comum; matilha de 4 worgs = desafio 3 (PROVISÓRIO; worg sozinho 0, dupla 2).
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:224-275, commit ad426d63
- Estado: no ar (custo-servicos.md:101, :115, :118); notas de ficha de animal comum: a implementar (B14/B18)

### B-033 · Desafio do trabalho é absoluto; Semanas é a duração contratada [tags: economia, recompensa, desafio, semanas, grupo-referencia]
- Data: 2026-10-02
- Decisão: "O desafio do trabalho é absoluto: é o da ameaça, medido contra o grupo de referência (4 personagens de Centelha igual ao desafio), e não muda conforme o grupo que aceita o trabalho." E: "Semanas é a duração prevista no contrato, combinada antes do trabalho. Terminar antes ou depois não muda a bolsa: quem contrata paga pelo resultado, e não pelo tempo gasto." Pendência G73: preço de partes de criatura precisa de teto próprio.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:277-308, commit ad426d63
- Estado: no ar (custo-servicos.md:86 para Semanas; absoluto não conferido)

### B-034 · Trabalhos e recompensas: bolsa para qualquer trabalho pontual (Pessoas, Dificuldade, Tarefa) [tags: economia, recompensa, trabalho, pericia, dificuldade, servicos]
- Data: 2026-10-02
- Decisão: "Bolsa = Valor por pessoa × Semanas × Tarefa × Risco × Pessoas" (padrão de caça 4). Dois caminhos: confronto (tabela de desafio) e perícia (Dificuldade dos testes decisivos), "vale o maior". Frase obrigatória: "A bolsa é Livre: durante o trabalho, o custo de vida do personagem continua saindo dos Recursos dele. Contratar um profissional de fora, por diária, custa a renda dele, pela tabela de Serviços, e não a bolsa." Tarefas por tipo (Caçar com 5 variações; Escoltar, Proteger, Invadir, Roubar, Investigar, Entregar, Recuperar). É guia para o Mestre, não regra de mundo. Bolsa arredondada pela régua (matilha de worgs 3.600, torre do mago 7.300).
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:310-386, commit ad426d63
- Estado: no ar (custo-servicos.md:44 e :97)

### B-035 · Correções do Comerciante: Dif acima de 20, bolsa vs Serviços, Pessoas, tabela provisória [tags: economia, recompensa, dificuldade, servicos, pessoas]
- Data: 2026-10-02
- Decisão: A) acima de Dif 20, "desafio = (Dificuldade − 19) ÷ 2, arredondado para cima" (21 = desafio 1 ... 30-31 = desafio 6). B) "Se um profissional faria o trabalho como serviço comum do ofício dele ... o preço é o de Serviços. A bolsa é para o trabalho pontual fora da rotina de um ofício: com sigilo, ilegal, perigoso, recusado pelos profissionais, ou quando não há profissional ao alcance. Acima de Dificuldade 20 nunca há." C) "Pessoas é quantas o contratante decide pagar, combinado no contrato, como as Semanas." D) desafios 0 a 3 deixam de ser provisórios (vêm da escada de capacidade), de 4 em diante provisório até a G73.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:388-444, commit ad426d63
- Estado: no ar (custo-servicos.md:97)

### B-036 · Interpolação geométrica de Dificuldade; piso e Dif 5/20 pela régua [tags: economia, recompensa, dificuldade, arredondamento]
- Data: 2026-10-02
- Decisão: "interpola geometricamente entre os degraus vizinhos, como o meio degrau de desafio, e arredonda pela régua"; fórmula segue até o desafio 9 (Dif 36-37) e recusa acima. Item 5b: Dif 5 = 13 (arred de 7 × 1,8) e Dif 20 = 65 (arred de 35 × 1,8), "Dif 20 deixa de ser o meio degrau 0,5"; piso 13 abaixo de Dif 5. Exemplos: espião 195, nobre 390. Frase única nos três lugares: "Os desafios 0 a 3 da tabela de valor não são provisórios ... Do desafio 4 em diante a tabela é provisória até a G73. O desafio de cada criatura segue provisório até a B14."
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:420-464, commit ad426d63
- Estado: no ar (não conferido)

### B-037 · Pendência de preços do sobre-humano, poções e modificador regional [tags: economia, pendencia, pocoes, regional]
- Data: 2026-10-01
- Decisão: (resumo) anotar, sem executar: preços do sobre-humano (Centelha, Proezas, Magia), poções como estoque de emergência caro e o modificador regional.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:51-52, commit ad426d63
- Estado: sem decisão do autor
