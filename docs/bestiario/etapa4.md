# Etapa 4: A5 e A5j, fechamento de 27/10/2026

294 fontes unificadas, de 302 fichas lidas. Oito paradas: enxames cuja Vida por quadrado ainda não tem formato (plano, seção 4). As oito fontes legadas foram preservadas byte a byte; outras 22 criaturas ainda não têm ficha. Os três gerados continuam com 324 criaturas.
O motor e a integração A5j já estavam no commit 58db84be. A retomada atualiza as fontes e a referência A1, sem editar fichas MD. Retiradas 28 exceções de P3/P4 que perderam o uso depois dos ajustes da Bestiarista; permanecem oito enxames explicitamente não conferidos no PV por falta de formato.
A5j: massa em kg e levantamento pela R15; PV racial e Vitalidade, Bloqueio com arma, Iniciativa e teto de Força dos arcos nos resumos da mesa. O teste do Kael preserva seus números. Nenhuma gravação no banco.
O gerador aceita zero e decimais declarados nas fichas, mantendo os limites da semeadura legada. O conversor preserva as células de bloqueio aprovadas e o destino único de cada id antigo, sem criar redirecionamentos para fichas que só compartilham a referência.
[Comparação por criatura e chave](relatorio-a5.json), contra 252ea7bf. O teste do motor confere a ausência de revisao nos três gerados e na vista pública de cada fonte unificada.
Validação: validate completo verde; motor com 302 criaturas, seis referências de jogador e cinco casos raciais; regressões do conversor, bloqueio, defesa vestida e deslocamento verdes. O gancho também confere os tipos antes do commit.
Espera o formato: Vida dos oito enxames por quadrado, P10 em tmp/executora/fase3/perguntas.md. Não foi criada chave nem fórmula nova.
Espera as 324: fontes legadas e suas contas ainda usadas por 30 criaturas (22 sem ficha e oito sem modelo de enxame). Calc.ts conserva os leitores que só passam na etapa 8 (A9).
