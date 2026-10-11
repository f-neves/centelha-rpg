# Registro de decisoes de regra do autor

Montado em 03/10/2026 pelo Arquiteto, a partir dos despachos de `docs/simulacao/caixa/` (86 a 118 e os
despachos nomeados) e do `git log`, lidos por tres leitores (partes A, B e C, em `rpg-system/docs/decisoes-partes/`).
A numeracao A-, B- e C- e do leitor, nao de ordem de importancia. As entradas estao em ordem de data.

**O que este registro NAO cobre (primeira versao):** decisoes que so existem em memoria do Arquiteto, em
documentos fora de `docs/simulacao/caixa/` (Reescala.md, Proezas_revisao.md, Defesas_revisao.md etc.) ou antes
do despacho 86. Muitas entradas trazem so o resumo do despacho, marcado "(resumo)", e nao a fala do autor.
Estado "no ar (nao conferido)" quer dizer que ninguem abriu o capitulo ou o JSON para confirmar.

**Regra de uso** (tambem no CLAUDE.md): antes de despachar mudanca de regra, procure o ponto aqui. Se contradiz
uma decisao registrada, pare e pergunte ao autor.

## Cadeias a conhecer (decisoes sobre o mesmo ponto)

**Resistir (segurar firme com Vontade)**
1. C-071 · 20/07/2026 · `afb818cc` · custa 1 + Margem de Vontade. **Substituida.**
2. C-070 · 02/10/2026 · `ad632f3f` (Adendo 3, item 14, pergunta 1, opcao B) · custa 1 ponto; Margem 0 segura de vez; Margem 1 ou mais cede, com o pedido 1 nivel abaixo. **No ar.** Junto, C-072: o intervalo do cortejo (8 dias ou mais) nao e uma acao.
3. D-001 · 03/10/2026 · decisao do autor, confirmou os conflitos: resistir custa 1 + Margem de Vontade, teto 4, e e um pagamento fora do limite de 1 ponto por acao. **Substitui C-070; restringe C-011.** Estado: a implementar (despacho do Resistir).

4. D-015 · 03/10/2026 · teto 4 fora do cortejo, cortejo em discussão (commit 03c1d711). **Substituída pela D-017** (04/10/2026, decisão 4 do veterana-1d): o teto 4 vale também por intervalo do cortejo, e as linhas :242 e :246 de relacoes-sociais.md remetem ao Resistir. Substitui também o item 5 da D-001 e a C-072 ("o intervalo do cortejo não é uma ação"). Entra na rodada 6.

**Dificuldade da Arte**
1. C-025 · 28/09/2026 · `adfbb5d7` · nivel da Arte × 5 + 2 × min(Centelha, nivel da Arte). **Substituida pela D-060.**
2. D-060 · 04/10/2026 · resposta do autor a duvida 6 · "(maior grau investido) × 5". **No ar desde a rodada 12** (`bd041499`); o Grid segue a conta antiga ate a passada da N (D-054).

**Desarmado**
1. C-029 · 28/09/2026 · `7bbe593d` · acerto +1 e Defesa da arma +1. **Substituida pela D-057** no desarmado; a Proeza "punho como arma media" continua a implementar.
2. D-057 · 04/10/2026 · resposta livre do autor a duvida 3 · Punhos e Chutes. **A implementar**, depois do relato das tres conferencias.
3. D-065 (05/10/2026, ids e Bloqueio) e D-067 (Chutes saem da ficha). **O P/G/R dos Punhos (0/1/4) foi substituido pela D-082** (10/10/2026): Punhos 1/1/3, Velocidade 5. Dois Punhos como par de leves: decidido em 10/10/2026 (cláusula da D-083; D-068 liberada).
4. D-088 (10/10/2026) · Bloqueio desarmado contra arma, **decisão final do autor**: "Punhos não bloqueiam o dano de NENHUMA arma, a não ser com aprovação do Mestre." O Bloqueio com as mãos tira só a Margem; o dano da arma passa sempre. **Substitui por inteiro, nesse ponto, a D-057 (a frase do contundente) e o item 2 da D-065 (lâmina).**

**Agarrado e Imobilizado**
1. D-019 item 23 · 03/10/2026 · o agarrado nao age, nao rola, so se solta quando quem controla erra; -2 contra quem esta de fora; Imobilizado a -4. **Parcialmente substituido pela D-081** (corrigida em 10/10/2026): fora, Esquiva -8 e Bloqueio -4; Imobilizado com Defesas zeradas (Esquiva e Bloqueio, nao a Defesa de agarrao). O resto do item 23 segue.
2. D-043 · 04/10/2026 · Imobilizado nao age; ordem Preso, Agarrado, Imobilizado. **Vale.** O agarrao so gera Agarrado; o Preso vem da boleadeira, da rede e de Arte de prender (D-081, D-079).

**Regua de P/G/R (Preparo, Golpe, Recuperacao)**
1. K15 · 19 e 20/08/2026 · leve 0/1/4, media 1/1/4, haste 2/1/3, pesada 2/1/4. **Baseline historico**, substituido pela D-082 (10/10/2026).
2. K16 · 20/08/2026 · Rajada e empunhadura dupla. **Registradas na D-083** (10/10/2026); a geometria vale sobre a regua da D-082.
3. A Arte no Tick do Golpe: D-084.

**Bonus de Centelha em jogada, Defesa e Valor Passivo**
1. C-024 · Reforma da Centelha (28/09/2026): 2 x min(Centelha, Habilidade).
2. B-029 · 01/10/2026: Atributo puro leva +1 por ponto de Centelha (D12).
3. C-049 · 02/10/2026 · "regra do maior" (`4aaf0fce`, `58869f2f`, `ae1889c9`): **sem decisao do autor, cancelada** pelo Adendo 1 da correcao da Reforma (`0ebc9917`, `a5d66a27`). Valem C-024 e B-029, mais o criterio de Atributo puro (`4fca4a3f`, centelha.md:44).

**Dano e Absorcao:** a Centelha inteira soma no dano do atacante (bestia-editor.ts:145) e na Absorcao do alvo uma vez (calc.ts:~297). O raspao do Quase-Acerto (regras.json `quaseAcerto.dano`) soma a do atacante e desconta a do alvo, e ignora a Absorcao (`ignoraSoak`); nao ha desconto em dobro (conferido pelo Arquiteto em 03/10/2026).

## Indice

| id | data | tema | estado |
|---|---|---|---|
| C-071 | 2026-07-20 | Segurar firme custava 1 + Margem de Vontade (decisão antiga) | substituida |
| A-001 | 2026-09-20 | A cena com dados não move a régua social | no ar |
| A-002 | 2026-09-20 | Bloco `social.regua` mora no `regras.json`; sai o `dias`; substitui o deslocamento de degr | sem decisao do autor |
| A-003 | 2026-09-20 | Antecedente mexe no ponto de partida da régua, não é bônus de jogada | no ar |
| A-004 | 2026-09-20 | Mecanismo: desconto nos passos para romper o Neutro | no ar |
| A-005 | 2026-09-20 | Os três traços usam o mesmo desconto, muda só quem alcança | no ar |
| A-006 | 2026-09-20 | Leitura da via dupla do Contato | sem decisao do autor |
| A-007 | 2026-09-22 | Teste de Virtude: a Virtude sozinha é a parada, sem Atributo | no ar |
| A-008 | 2026-09-23 | Régua própria do teste de Virtude, de dois em dois, com rótulos | no ar |
| A-009 | 2026-09-23 | Frenesi: teste único de Temperança, falhar é entrar em fúria, penalidade de ferimento opci | no ar |
| A-010 | 2026-09-23 | Os dois casos que forçam o teste de Frenesi | no ar (nao conferido) |
| A-011 | 2026-09-23 | Escala de Dificuldade situacional do Frenesi | no ar (nao conferido) |
| A-012 | 2026-09-23 | Sair da fúria e manutenção do Frenesi | no ar (nao conferido) |
| A-013 | 2026-09-23 | A ressaca do Frenesi passa de Crítico e nunca leva a Incapacitado | no ar |
| A-014 | 2026-09-23 | Teto de fúrias: metade do Vigor, sem piso | no ar (nao conferido) |
| A-015 | 2026-09-23 | O +2 da fúria vale em ação física; Arremesso ganha, Atirador não | substituida |
| A-016 | 2026-09-23 | "Ficar parado" do Grid: Virtude sozinha contra metade da Dificuldade | no ar |
| A-017 | 2026-09-23 | Só as resistências da alma viram Virtude sozinha; as do corpo somam Atributo | no ar (nao conferido) |
| A-018 | 2026-09-23 | A fúria racial não ativa as Técnicas "em fúria" do Caminho Sangue Fervente | no ar (nao conferido) |
| A-019 | 2026-09-23 | Meio-orc e orc: o orc puro é raça jogável, longevidade 70 anos | no ar (nao conferido) |
| A-020 | 2026-09-23 | A Força entra na definição de ação física | no ar |
| A-022 | 2026-09-23 | Tortura se divide em corpo e alma | no ar (nao conferido) |
| A-023 | 2026-09-23 | Firula negativa vale só no teste de Virtude e não devolve nada | no ar (nao conferido) |
| A-021 | 2026-09-24 | O tiro também sofre a penalidade de ferimento | no ar |
| A-024 | 2026-09-24 | A Firula Infeliz de Relações Sociais fica | no ar (nao conferido) |
| A-025 | 2026-09-24 | Nenhum número do Bram se conserta; a M-02 ganha dívida escrita | no ar (nao conferido) |
| A-026 | 2026-09-24 | A Bravura resiste ao medo, e não à intimidação | no ar |
| A-027 | 2026-09-24 | Perfuração é o nome do gate; Penetração é outra regra | substituida |
| A-028 | 2026-09-24 | A folha da ação cala para o arremesso (I12 continua com o autor) | no ar |
| A-029 | 2026-09-24 | O termo do gate vira "Nível de Perfuração" | no ar |
| A-030 | 2026-09-24 | Condução: quem ajuda a fabricar não cumpre o Requisito mas trabalha contra a Dificuldade d | no ar |
| A-031 | 2026-09-24 | A condução herda oficina e material; o +4 do sem ofício é pessoal; até dez ajudantes | no ar |
| A-032 | 2026-09-24 | Critério de obra versus fabricação | no ar (nao conferido) |
| A-033 | 2026-09-24 | Regra da metade é para apoio; condução e direção são para trabalho divisível | no ar (nao conferido) |
| A-034 | 2026-09-24 | Preços novos de armas e armaduras (Fases 1 a 3 da revisão econômica) | no ar |
| B-001 | 2026-09-25 | Preço sempre objeto {pc}; Livre = Renda x 12% x (60/Renda)^0,35 | no ar |
| B-002 | 2026-09-25 | Placa Completa sobe para 3.600 pc (B8) | no ar (nao conferido) |
| B-003 | 2026-09-25 | Antecedente Relíquia vira Artefato | no ar |
| B-004 | 2026-09-25 | Grau de qualidade: Excepcional vira Excelente; multiplicadores fixos | no ar |
| B-005 | 2026-09-25 | Régua de reparo: leve ~1/10, pesado ~1/3, arruinada ~2/3 | no ar (nao conferido) |
| B-006 | 2026-09-25 | Carroça em dias, barco de pesca em semanas | no ar |
| B-007 | 2026-09-25 | Fabricar vs alugar trabalho: só com a ressalva | no ar (nao conferido) |
| B-008 | 2026-09-25 | Semanas de aventura e Cura acelerada por nível de Cura | no ar |
| B-009 | 2026-09-26 | Âncora do sistema de preços: 1 dia de braçal = 10 pc = 1,5 penny | no ar (nao conferido) |
| B-010 | 2026-09-26 | Fórmula do ganho com o ofício (B2): curva por soma, melhor faixa, tetos | no ar |
| B-011 | 2026-09-26 | Jornada por ofício e salto entre degraus "de oito a sessenta vezes" | no ar (nao conferido) |
| B-012 | 2026-09-26 | Tudo em pc; arredondamento das taxas | no ar (nao conferido) |
| B-013 | 2026-09-26 | Recursos 0 a 6, Nobreza = 6, regra de Imprevistos | no ar |
| B-014 | 2026-09-26 | Livre: regra única, inteiro meio para cima | no ar (nao conferido) |
| B-015 | 2026-09-26 | Tabela de serviços por perfil: Renda/Sem do livro, contrato/avulsa/hora | no ar (nao conferido) |
| B-016 | 2026-09-26 | Sugestões do Comerciante (desgaste, Cura mundana, Empréstimo de XP, comércio regional) | sem decisao do autor |
| B-017 | 2026-09-26 | Recompensa de caça, versão 1 (Degrau, Centelha, quantidade) | substituida |
| B-018 | 2026-09-26 | Escalas do bestiário: desafio 1-12 e Centelha da criatura 0-12 (DECIDIR) | substituida |
| B-019 | 2026-09-26 | Recursos durante a aventura (versão 1, depois reescrita) | substituida |
| B-020 | 2026-09-26 | Recursos durante a aventura, versão final (Livre continua entrando) | no ar (nao conferido) |
| B-021 | 2026-09-26 | Despesas e quantidade na caçada (comida, fracas, semanas, bolsa alta de propósito) | outro |
| B-022 | 2026-09-26 | "Compare com personagens de Centelha parecida" | no ar |
| B-023 | 2026-09-26 | Parte por caçador arredonda para baixo, com sobra | substituida |
| B-024 | 2026-09-26 | Virtude nunca soma à parada de Atributo ou Habilidade, exceto Canalizar Virtude | no ar |
| B-025 | 2026-09-26 | "Vigor + Convicção" vira "Vigor + Resistência" | no ar (nao conferido) |
| B-026 | 2026-09-26 | Banir e Círculo resistem pela Defesa Mental passiva | no ar (nao conferido) |
| C-001 | 2026-09-26 | Poder natural: esquema, sem portão de Centelha e sem Mana | no ar (nao conferido) |
| C-002 | 2026-09-26 | Constructo: flag semVida | a implementar |
| C-003 | 2026-09-26 | Desafio do bestiário: saída individual/bando, recompensa usa só o individual | substituida |
| C-004 | 2026-09-26 | Forma e dimensões da criatura | no ar (nao conferido) |
| C-005 | 2026-09-26 | Classificação dos poderes: Arte, natural, traço social, passivo | substituida |
| C-006 | 2026-09-26 | Defesa Social para Int 1 | no ar (nao conferido) |
| C-007 | 2026-09-26 | Nenhum animal comum com Centelha | no ar (nao conferido) |
| C-008 | 2026-09-26 | Incorpóreos: resistências a corte, perfuração e impacto no lugar da imunidade | no ar (nao conferido) |
| C-009 | 2026-09-26 | Voo: locomocao.voo e velocidade de terra da fonte | no ar |
| C-010 | 2026-09-26 | Orc: atributos fixos e poderes da raça | no ar (nao conferido) |
| C-011 | 2026-09-26 | Vontade em combate: 1 ponto, +1d6 ou +4 na Defesa, máximo 1 por ação | no ar (nao conferido) |
| C-012 | 2026-09-26 | Horda: sugestão ao Mestre a partir de 2 por personagem | no ar |
| C-013 | 2026-09-26 | Grupo de referência da bolsa de 3 para 4 | no ar (nao conferido) |
| C-014 | 2026-09-26 | Subtipos de poder: o que vira poder formal e o que vira texto | no ar (nao conferido) |
| C-015 | 2026-09-26 | Proezas de criatura viram proezaFutura, inertes | no ar (nao conferido) |
| C-016 | 2026-09-26 | Escala do desafio 0 a 12 e campo maisUm | no ar |
| C-017 | 2026-09-26 | Fase 3: resiste decidido pelo EFEITO, não pela Arte de base | no ar (nao conferido) |
| C-018 | 2026-09-26 | Fase 3: poder natural isento do portão; gigantes sobem de Centelha; Gárgula perde resistên | no ar (nao conferido) |
| C-019 | 2026-09-27 | Quase-Acerto: raspão com termo de Centelha, Redução leve 1, piso do acerto | substituida |
| C-020 | 2026-09-27 | Simultâneo: quem estava de pé na abertura do Tick solta todos os golpes | no ar (nao conferido) |
| C-021 | 2026-09-27 | Vida negativa até o limite de morte M-21 | no ar |
| C-022 | 2026-09-27 | Nota do livro: mesa presencial no Simultâneo | no ar |
| C-023 | 2026-09-27 | Pendências de regra registradas, sem resolver (lote do Quase-Acerto) | a implementar |
| C-024 | 2026-09-28 | Reforma da Centelha: 2 × mín(Centelha, Habilidade) em toda jogada e Defesa | no ar |
| C-025 | 2026-09-28 | Resistência a efeito por Dificuldade: nível da Arte × 5 + 2 × mín | substituída por D-060 |
| C-026 | 2026-09-28 | Dano e Absorção: +1 por ponto de Centelha, sem limite, também em cada pulso | no ar |
| C-027 | 2026-09-28 | Raspão com Centelha de atacante e de alvo; Reduções 0/1/3/5 | no ar (nao conferido) |
| C-028 | 2026-09-28 | Escada de Dificuldade com 35, 40, 45+ e nota de alcance humano | no ar (nao conferido) |
| C-029 | 2026-09-28 | Briga: desarmado com acerto +1 e Defesa da arma +1; punho como arma média em Proeza | substituída por D-057 (desarmado) |
| C-030 | 2026-09-28 | Pendências da Reforma, sem resolver | a implementar |
| C-031 | 2026-09-28 | Fichas de referência da bancada (Centelha 0 a 6) | no ar |
| C-032 | 2026-09-28 | Padrão único 0 para Integridade ausente (bestiário) | no ar (nao conferido) |
| C-033 | 2026-09-28 | Bestiário: fixar criatura para comparar (UI, não regra) | no ar |
| C-034 | 2026-09-28 | Três consertos da bancada (não mudam regra) | no ar |
| C-035 | 2026-09-28 | Fase 4 B14: CR da fonte e correções pontuais de fichas | no ar (nao conferido) |
| C-036 | 2026-09-28 | A Centelha da criatura é eixo próprio, independente do desafio | no ar (nao conferido) |
| C-037 | 2026-09-28 | Poderes inatos com usos são naturais; Arte só para quem conjura como classe | no ar (nao conferido) |
| C-038 | 2026-09-28 | Todo poder natural ganha descricao detalhada | no ar (nao conferido) |
| C-039 | 2026-09-28 | Imunidade: dano zero do tipo; imunidade + fraqueza ao mesmo tipo = dano normal | no ar |
| C-040 | 2026-09-28 | Constructo na Fase 4: mantém Vigor, sem teste de Vigor/Resistência/Virtude | a implementar |
| C-041 | 2026-09-28 | Fantasma e Sombra: dano é fenômeno, armadura não absorve | no ar (nao conferido) |
| C-042 | 2026-09-28 | Resistências novas por criatura: só pendência, sem palavra nova | no ar |
| C-044 | 2026-09-28 | Fase 5: definição de desafio e âncoras do autor | no ar |
| C-045 | 2026-09-28 | Grupo de referência: composição, Proezas matemáticas, Vontade | no ar |
| C-043 | 2026-09-29 | Arte exige só Centelha > 0; o portão "nível N exige Centelha ≥ N" é só das Técnicas de Pro | substituida |
| C-079 | 2026-09-29 | Texto do /bestiario: Ameaça em recalibração | no ar |
| B-027 | 2026-10-01 | Reforma da Centelha: 2 × mín(Centelha, Habilidade) em jogada e Defesa; dano soma inteira | no ar |
| B-028 | 2026-10-01 | Valor Passivo, fórmula única com a Reforma | no ar |
| B-029 | 2026-10-01 | Jogada só de Atributo: +1 por ponto de Centelha, regra oficial; Centelha fora da Longa | no ar |
| B-030 | 2026-10-01 | Recompensa v2: tabela de valor por desafio, ×4, soma de criaturas (substituída) | outro |
| B-031 | 2026-10-01 | Equivalentes e desafio do encontro (+1/2 por dobra), depois 2c | substituida |
| B-037 | 2026-10-01 | Pendência de preços do sobre-humano, poções e modificador regional | sem decisao do autor |
| C-046 | 2026-10-01 | Fase 5b: múltiplos ataques só pelas regras escritas; PV não cresce com a Centelha; nova ba | no ar |
| C-047 | 2026-10-01 | Guarda sob pressão: leitura da Defesa final, feito + recebido, dupla conta 2 | no ar |
| C-048 | 2026-10-01 | Penalidade de fase (Preparo −2, Golpe −4) só vale contra golpes no mesmo instante | no ar |
| B-032 | 2026-10-02 | Recompensa é o preço de UM TRABALHO (desafio do trabalho) | no ar |
| B-033 | 2026-10-02 | Desafio do trabalho é absoluto; Semanas é a duração contratada | no ar |
| B-034 | 2026-10-02 | Trabalhos e recompensas: bolsa para qualquer trabalho pontual (Pessoas, Dificuldade, Taref | no ar |
| B-035 | 2026-10-02 | Correções do Comerciante: Dif acima de 20, bolsa vs Serviços, Pessoas, tabela provisória | no ar |
| B-036 | 2026-10-02 | Interpolação geométrica de Dificuldade; piso e Dif 5/20 pela régua | no ar (nao conferido) |
| C-049 | 2026-10-02 | Correção da Reforma, "regra do maior" (proposta do assistente, depois cancelada) | sem decisao do autor |
| C-050 | 2026-10-02 | Correção da Reforma: Defesa parada com 2 × mín(Centelha, Sociabilidade) | no ar |
| C-051 | 2026-10-02 | Regra do bônus de Centelha, versão final do autor | no ar |
| C-052 | 2026-10-02 | Passivos do grupo na mesa seguem o Valor Passivo do livro | no ar |
| C-053 | 2026-10-02 | Nota da B14 sobre bancada com regra antiga: cancelada | no ar (nao conferido) |
| C-054 | 2026-10-02 | Proeza: nível N custa o preço total do nível N; subir paga a diferença | no ar |
| C-055 | 2026-10-02 | Onde a Centelha começa: o Mestre escolhe pela campanha | no ar |
| C-056 | 2026-10-02 | Virtude: a Centelha NÃO entra em teste de Virtude | no ar |
| C-057 | 2026-10-02 | Provocação do orc: Força de Vontade × 2 + 2 × mín(Centelha, Integridade) | no ar (nao conferido) |
| C-058 | 2026-10-02 | D12: critério do Atributo puro é decisão do Mestre | no ar |
| C-059 | 2026-10-02 | Botão de Atributo puro: adiado (D15) | a implementar |
| C-060 | 2026-10-02 | Golpe no sistema Normal resolve na declaração | no ar |
| C-061 | 2026-10-02 | "Para arma Leve, Média e de Distância": restrição não decidida pelo autor, desfeita | sem decisao do autor |
| C-062 | 2026-10-02 | Pressão: o golpe não desconta a si mesmo | no ar |
| C-063 | 2026-10-02 | Armadura na Furtividade: Circunstância é o dobro da Penalidade | no ar |
| C-064 | 2026-10-02 | Corrida: ação de 3 Ticks; a seguinte continua na Velocidade de Corrida | no ar |
| C-065 | 2026-10-02 | Margem na Acumulada é só a leitura do excedente | no ar |
| C-066 | 2026-10-02 | Erro na Acumulada perde só o que passou da faixa de 6 | no ar |
| C-067 | 2026-10-02 | Soma do excedente de cada jogada | no ar |
| C-068 | 2026-10-02 | Cura acelera 10% por nível: o intervalo encurta | no ar |
| C-069 | 2026-10-02 | Vontade: máximo 1 ponto por jogada ou ação, inclusive para resistir | no ar (parte "inclusive resistir" retirada por D-001) |
| C-070 | 2026-10-02 | Segurar firme custa 1 ponto de Vontade (substitui afb818cc) | substituida |
| C-072 | 2026-10-02 | Cortejo: intervalo de 8 dias ou mais não é uma ação | substituida |
| C-073 | 2026-10-02 | Seguir alguém: Dificuldade é o Valor Passivo do alvo | no ar (nao conferido) |
| C-074 | 2026-10-02 | Suspeita no Esgueirar: 70% na Acumulada, suspeita contra o Passivo inteiro | no ar (nao conferido) |
| C-075 | 2026-10-02 | Congelar o intervalo da Margem na Acumulada: fica como está, pendência G75 | substituida (P-01) |
| C-076 | 2026-10-02 | Mortal (Centelha 0): tem Mana (a Força de Vontade) e conjura Arte; Energia não usada | no ar |
| C-077 | 2026-10-02 | Teto de Arte do mortal: não liberar no código antes de ver os números | cumprida (D-006) |
| C-078 | 2026-10-02 | Escala do desafio: de 0 a 12, nada passa de 9 exceto a Tarrasca (10); ameaça 1-6 a ajustar | a implementar |

## Entradas

### C-071 · Segurar firme custava 1 + Margem de Vontade (decisão antiga) [tags: vontade, social, resistir, margem, relacoes-sociais]
- Data: 2026-07-20
- Decisão: (resumo do commit afb818cc) "Combate Social enxuto (Vontade=1+Margem para segurar; senao cede e a regua anda)": "Para segurar firme, ele gasta Força de Vontade naquele lance, e o custo sobe com a Margem"; "Resistir: para não ceder, gaste 1 + Margem de Vontade no lance; se não pagar, cede o ponto e a régua anda Margem passos". Exemplo de Vesna: Margem 1, 2 de Vontade.
- Origem: commit afb818cc, src/content/chapters/relacoes-sociais.md (hoje :149-155)
- Estado: substituída por C-070

### A-001 · A cena com dados não move a régua social [tags: relacoes-sociais, regua, combate-social, alcance]
- Data: 2026-09-20
- Decisão: (resumo) "a cena com dados não move a régua. A jogada única rende alcance do pedido, +1 nível acima da relação a cada 6 de folga, só naquela cena. O Combate Social, quando o alvo não paga a Vontade, cede o ponto e o pedido chega Margem níveis acima, também só naquela cena. Quem move a régua são os atos e o cortejo." O despacho diz que é aplicação de texto já escrito (decisão das rodadas 84/85), não decisão nova; o 86 só corrige `qual-sistema.md` e `mestre.astro` que ainda diziam o contrário.
- Origem: docs/simulacao/caixa/86-despacho.md:27-33, commit 5128794f (abre o despacho)
- Estado: no ar (qual-sistema.md:78 e :115 dizem "Nenhum dos dois move a régua")

### A-002 · Bloco `social.regua` mora no `regras.json`; sai o `dias`; substitui o deslocamento de degrau da M-09 [tags: regua, relacoes-sociais, regras.json, longevidade, escala-intervalo]
- Data: 2026-09-20
- Decisão: (resumo) o bloco `regua` mora no dado; o par `dias` + `multiplicador` vira fonte única (sai `dias`, ficam `multiplicador` e `intervaloBaseDias`); `acoes.longevidadeFirula` ganha `intervaloBaseDias` e `porFaixa`, e a nota nova diz que isto SUBSTITUI o deslocamento de degrau da M-09 de 17/09/2026; `acoes.escalaIntervalo` deixa de citar o cortejo social. Decisão do Arquiteto, o despacho a chama de "minha decisão".
- Origem: docs/simulacao/caixa/86-despacho.md:76-118
- Estado: sem decisão do autor (no ar não conferido)

### A-003 · Antecedente mexe no ponto de partida da régua, não é bônus de jogada [tags: antecedente, regua, relacoes-sociais, xp]
- Data: 2026-09-20
- Decisão: (resumo, três decisões do humano contra a recomendação do Arquiteto) "O ANTECEDENTE MEXE NO PONTO DE PARTIDA DA RÉGUA. Deixa de ser bônus de jogada." Contra comprado: vira estado inicial em vez de bônus vivo; quem pagou XP ×3 aplica uma vez por pessoa e depois não sente mais.
- Origem: docs/simulacao/caixa/87-despacho.md:96-100 (sumário) e `git show c38f9097:docs/simulacao/caixa/87-despacho.md` (texto integral), commit c38f9097
- Estado: no ar (antecedentes.md:82 e :201 trazem o desconto)

### A-004 · Mecanismo: desconto nos passos para romper o Neutro [tags: antecedente, regua, neutro, relacoes-sociais]
- Data: 2026-09-20
- Decisão: (resumo) "Nível N tira N dos 3 passos que separam do Neutro; com 3 ou mais, rompe de cara em +1 Simpatia." Recusada a alternativa de deslocar o início travado no teto de vidro (±2). Contra comprado: acima de 3 pontos o traço não compra mais nada.
- Origem: 87-despacho.md:101-104 e c38f9097
- Estado: no ar (antecedentes.md:201)

### A-005 · Os três traços usam o mesmo desconto, muda só quem alcança [tags: antecedente, reputacao, contato, posicao, regua]
- Data: 2026-09-20
- Decisão: (resumo) Reputação com quem já ouviu falar de você, Contato com o círculo dele, Posição com quem se importa com o posto; mantém o teto de +6 e o "somam entre si". Contra comprado: o Contato passa a ter duas vias e a contradição da Posição continua de pé.
- Origem: 87-despacho.md:105-107 e c38f9097; reescrita nos itens 9 a 11 (antecedentes.md:72-74, :195, :311 e `regras.json` aparencia.nota)
- Estado: no ar (antecedentes.md:201 e :231; `regras.json` aparencia.nota não conferido)

### A-006 · Leitura da via dupla do Contato [tags: antecedente, contato, regua]
- Data: 2026-09-20
- Decisão: (resumo) o `:131` fala do contato em si (Simpatia +1) e o desconto fala do círculo dele; se a leitura estiver errada, o sintoma é um contato contando duas vezes com a mesma pessoa. O despacho a chama "minha" e manda não reabrir. Também ficaram na mesa do humano: contradição da Posição, repreçamento do Antecedente acima de 3 pontos, os três passos do Neutro (E3).
- Origem: 87-despacho.md:147-150 e c38f9097
- Estado: sem decisão do autor

### A-007 · Teste de Virtude: a Virtude sozinha é a parada, sem Atributo [tags: virtude, resistir, teste-de-virtude, parada]
- Data: 2026-09-22 (registro §14), aplicada no despacho de 2026-09-23
- Decisão: (resumo) a Virtude sozinha alimenta a conversão soma para dado de sempre (1 vale 2 fixo, 2 vale 1d6, 3 vale 1d6+2, 4 vale 2d6, 5 vale 2d6+2, 6 vale 3d6), sem somar Atributo, porque o Atributo "dilui demais o peso da Virtude". Sucesso é total maior que a Dificuldade. Zero mecanismo novo. Morre o "Virtude somada a um Atributo" de `aparencia-virtudes-vontade.md`.
- Origem: docs/simulacao/caixa/90-despacho.md:20-33; leitura-de-novato-decisoes.md §14 (:815), commit b268c235 (FRENESI.md)
- Estado: no ar (aparencia-virtudes-vontade.md traz a tabela por Virtude e Dificuldade)

### A-008 · Régua própria do teste de Virtude, de dois em dois, com rótulos [tags: virtude, dificuldade, regua-propria, teste-de-virtude]
- Data: 2026-09-23
- Decisão: (resumo) o teste de Virtude fora do Frenesi usa a régua PRÓPRIA 3, 5, 7, 9, 11, 13 (Branda, Tensa, Séria, Dura, Severa, Extrema) e não a travada 5/10/15/20/25, porque na travada só a 5 e a 10 servem. Os rótulos foram escolhidos varrendo capítulos e JSON por colisão ("Trivial" e "Leve" colidiam). Substitui a parte da §14 que usava a régua travada.
- Origem: 90-despacho.md:25-30; leitura-de-novato-decisoes.md §16 (:872 em diante)
- Estado: no ar (aparencia-virtudes-vontade.md:94-99)

### A-009 · Frenesi: teste único de Temperança, falhar é entrar em fúria, penalidade de ferimento opcional [tags: frenesi, orc, temperanca, forca-de-vontade, ferimento]
- Data: 2026-09-23
- Decisão: (resumo) o modelo do `FRENESI.md` (entrar em fúria é FALHAR no teste de Temperança) foi confirmado pelo humano, que mudou a penalidade de ferimento de obrigatória para opcional. Ela só entra se o personagem quiser ceder e neste teste PODE zerar a parada (o piso de 1d6 não vale aqui). Gastar 1 ponto de Força de Vontade soma OU tira 1d6, no máximo um por teste. O bônus de ferimento da §15 fica substituído. Entra no livro (racas.md, seção própria) e em vida-ferimentos-cura.md (exceção do piso).
- Origem: 90-despacho.md:41-62 e :72-76; leitura-de-novato-decisoes.md §16, commit b268c235
- Estado: no ar (racas.md traz a seção; o motor NÃO tem o teste de Frenesi, ver 95-despacho.md:44-45)

### A-010 · Os dois casos que forçam o teste de Frenesi [tags: frenesi, orc, dano, provocacao, influencia]
- Data: 2026-09-23
- Decisão: (resumo) só forçam o teste: (1) dano grande, um único golpe que tire 20% ou mais da Vida máxima, arredondado para cima, líquido depois da Absorção; (2) provocação importante, decidida pelo mestre, em que quem provoca rola Influência contra Força de Vontade do orc ×2 + Centelha dele. Dano acumulado NÃO dispara teste, de propósito. A provocação de cotidiano deixa de forçar.
- Origem: leitura-de-novato-decisoes.md §16; aplicado pelo 90-despacho.md:41-47
- Estado: no ar (não conferido na seção de racas.md)

### A-011 · Escala de Dificuldade situacional do Frenesi [tags: frenesi, dificuldade, orc, mestre]
- Data: 2026-09-23
- Decisão: (resumo) o mestre escolhe: calma 4; batalha com vantagem 5; estresse 6 a 7; muito desfavorecido 8 a 10; situação muito crítica acima de 10. Substitui a régua 3/5/7 e a entrada automática do `FRENESI.md` §6 antigo.
- Origem: leitura-de-novato-decisoes.md §16 (:872 em diante); 90-despacho.md:41-47
- Estado: no ar (não conferido)

### A-012 · Sair da fúria e manutenção do Frenesi [tags: frenesi, orc, manutencao, saida, forca-de-vontade]
- Data: 2026-09-23
- Decisão: (resumo) sair por vontade própria custa 1 Força de Vontade (+1d6), Temperança limpa contra a Dificuldade da situação; Crítico não bloqueia a saída. A janela da manutenção corre só fora da luta: (Força de Vontade máxima) Ticks sem ação física de combate. Fechar a janela dispara o teste de manutenção (Vigor + Resistência contra 5, 10, 15, 20 a cada renovação), e só falhar encerra.
- Origem: leitura-de-novato-decisoes.md §16; 90-despacho.md:38-47
- Estado: no ar (não conferido)

### A-013 · A ressaca do Frenesi passa de Crítico e nunca leva a Incapacitado [tags: frenesi, ressaca, ferimento, incapacitado, defesa-fisica]
- Data: 2026-09-23
- Decisão: (resumo) cada estado de ressaca além de Crítico soma mais −1d6 na ação física e −4 na Defesa Física; nunca leva a Incapacitado. Não se cria linha nova na tabela de estados, só nota.
- Origem: 90-despacho.md:67-71; leitura-de-novato-decisoes.md §16, commit c5dd3901
- Estado: no ar (vida-ferimentos-cura.md:46 traz a nota)

### A-014 · Teto de fúrias: metade do Vigor, sem piso [tags: frenesi, orc, vigor, teto]
- Data: 2026-09-23
- Decisão: (resumo) o teto fica como está: metade do Vigor, arredondado para baixo, sem piso; Vigor 1 não entra em fúria, "intencional por enquanto", pode ser revisto.
- Origem: leitura-de-novato-decisoes.md §16
- Estado: no ar (não conferido)

### A-015 · O +2 da fúria vale em ação física; Arremesso ganha, Atirador não [tags: frenesi, acao-fisica, arremesso, atirador]
- Data: 2026-09-23
- Decisão: (resumo) o +2 vale para ação física pela definição do capítulo de ferimentos, sem lista. Arremesso ganha; Atirador (arco, besta) não; Aparar é Bloqueio e em fúria leva −2. Definição depois trocada pela A-020.
- Origem: leitura-de-novato-decisoes.md §16
- Estado: substituída por A-020 (definição de ação física); a exclusão do Atirador continua (A-021)

### A-016 · "Ficar parado" do Grid: Virtude sozinha contra metade da Dificuldade [tags: virtude, grid, bravura, temperanca, arcano, area]
- Data: 2026-09-23
- Decisão: (resumo) a Virtude sozinha (Bravura ou Temperança) rola contra metade da Dificuldade da área, arredondada para cima (borda 10 vira 5, meio 15 vira 8, fundo 20 vira 10). Sai Bravura + Vigor e Temperança + Raciocínio. O humano aceitou as quatro recomendações do Arquiteto.
- Origem: docs/simulacao/caixa/91-despacho.md:14-24; leitura-de-novato-decisoes.md §16; 92-despacho.md (CORRIGE da comparação e núcleo da área 4 m, Dif 25 vira 13)
- Estado: no ar (rodada 91 PROCEDE; texto de `regras.json` não conferido)

### A-017 · Só as resistências da alma viram Virtude sozinha; as do corpo somam Atributo [tags: virtude, resistir, vigor, convicção, artes, estabilizar]
- Data: 2026-09-23
- Decisão: (resumo) Vigor + Convicção e Vontade + Convicção nos Efeitos das Artes, e o Estabilizar, continuam somando Atributo; o capítulo diz quando é uma e quando é outra (e, pela nota da 92, "os do mundo" antes de veneno e doença).
- Origem: 91-despacho.md:33-37; 92-despacho.md (nota 2)
- Estado: no ar (não conferido)

### A-018 · A fúria racial não ativa as Técnicas "em fúria" do Caminho Sangue Fervente [tags: frenesi, tecnica, sangue-fervente, furia]
- Data: 2026-09-23
- Decisão: (resumo) só a Técnica Fúria ativa as Técnicas "em fúria"; o nome "Frenesi" fica nos dois lugares (traço racial e Técnica, que é "ataques repetidos") e o livro distingue.
- Origem: 91-despacho.md:39-42
- Estado: no ar (não conferido)

### A-019 · Meio-orc e orc: o orc puro é raça jogável, longevidade 70 anos [tags: raca, orc, meio-orc, longevidade, racas.json]
- Data: 2026-09-23
- Decisão: (resumo) sai do `racas.json` a frase de que o orc puro "vive na lore como criatura, não como raça jogável" (ele é jogável, custo 40, seção no capítulo) e a longevidade do meio-orc passa de 60 para 70 anos, como no capítulo.
- Origem: 91-despacho.md:44-47
- Estado: no ar (não conferido)

### A-020 · A Força entra na definição de ação física [tags: acao-fisica, ferimento, forca, frenesi, penalidade]
- Data: 2026-09-23 (§17), aplicada no despacho de 2026-09-24
- Decisão: (resumo) a frase passa a ser "as que rolam Força, Destreza ou Vigor", em vida-ferimentos-cura.md, racas.md, FRENESI.md §5. O que muda para todos: a penalidade de ferimento passa a valer no golpe das armas que rolam Força (14 de 33 na contagem da 90). Contra comprado: penalidade mais larga para todos, não só no Frenesi. O motor, se filtrar por atributo, ganha a Força.
- Origem: docs/simulacao/caixa/98-despacho.md:28-39 e :46-49; leitura-de-novato-decisoes.md §17 (:990), commits 3b2a6014, 84228f35
- Estado: no ar (vida-ferimentos-cura.md:36, racas.md:146)

### A-022 · Tortura se divide em corpo e alma [tags: tortura, virtude, convicção, vigor, resistir, defesa-mental]
- Data: 2026-09-23 (§17), reafirmada em 2026-09-24
- Decisão: (resumo) aguentar a dor do ferro é corpo e rola Vigor + Convicção; aguentar sem falar, sem ceder, sem trair é alma e rola a Convicção sozinha no teste de Virtude. A "Tortura" da Defesa Mental continua como defesa contra quem interroga (ele rola contra ela), com uma frase ligando as duas. O "Dor e tortura: Vontade + Integridade" sai do Resistir. Contra comprado: uma cena pode pedir os dois testes.
- Origem: 98-despacho.md:31-33; leitura-de-novato-decisoes.md §17
- Estado: no ar (não conferido)

### A-023 · Firula negativa vale só no teste de Virtude e não devolve nada [tags: firula, virtude, frenesi, forca-de-vontade, habilidades]
- Data: 2026-09-23
- Decisão: (resumo) a Firula negativa vale só no teste de Virtude (e no Frenesi, que é teste de Virtude), não devolve nada e não entra no capítulo de Habilidades como regra geral; a Firula de nível 2 que devolve 1 de Força de Vontade não vale para ela. Contra comprado: a Firula passa a ter duas formas.
- Origem: 98-despacho.md:33-35 e :50-52; leitura-de-novato-decisoes.md §17; 90-despacho.md:28 (Firula negativa no teste)
- Estado: no ar (não conferido)

### A-021 · O tiro também sofre a penalidade de ferimento [tags: ferimento, arco, besta, percepcao, atirador, acao-fisica]
- Data: 2026-09-24
- Decisão: (resumo) arco e besta rolam Percepção, que fica fora de "Força, Destreza ou Vigor", mas o motor já penaliza o tiro como qualquer golpe; o livro passa a dizer que o ataque à distância sofre a penalidade. O +2 da fúria continua fora do Atirador. Nada muda na mesa. Rodada 101 corrige em racas.md:145 e FRENESI.md:116-118 com "menos o tiro".
- Origem: leitura-de-novato-decisoes.md §17 (três leituras da rodada 98); 101-despacho.md:1.4
- Estado: no ar (racas.md:146 cita o tiro; não conferido o texto exato)

### A-024 · A Firula Infeliz de Relações Sociais fica [tags: firula, relacoes-sociais, regua]
- Data: 2026-09-24
- Decisão: (resumo) é o gesto que desagrada na régua de Relação (−1/−2/−4), não a Firula que mexe na jogada; o "só no teste de Virtude" vale para a Firula de jogada. Contra comprado: dois nomes parecidos para mecânicas diferentes.
- Origem: leitura-de-novato-decisoes.md §17 (rodada 98)
- Estado: no ar (não conferido)

### A-025 · Nenhum número do Bram se conserta; a M-02 ganha dívida escrita [tags: exemplo, bram, m-02, custo, criacao-de-personagem]
- Data: 2026-09-24
- Decisão: (resumo) o a18 NÃO entra, "por decisão do humano": nenhum dos cinco números da tabela do Bram se mexe; a M-02 fica de pé e passa a dizer em voz alta por que o total não se confere (a linha de Técnicas não se confere em nenhum dos quatro exemplos, porque a lista de Técnicas deles não existe no dado; `cost-examples.mjs` carrega os 120 de Técnicas sem conferir e supõe níveis das Secundárias e Especialidades primárias de nível 1).
- Origem: docs/simulacao/caixa/101-despacho.md:41-43 e :72-90, commit d4dc84e5
- Estado: no ar (não conferido)

### A-026 · A Bravura resiste ao medo, e não à intimidação [tags: bravura, virtude, defesa, intimidacao, medo, defesa-social, defesa-mental]
- Data: 2026-09-24
- Decisão: (resumo) "vale o `defesas.md:37-39`. Intimidação na Defesa Social, medo imposto na Defesa Mental, medo da cena na Bravura. A Bravura resiste ao MEDO, e não à intimidação." Alinha `virtudes.json` valor.resiste e aparencia-virtudes-vontade.md:45. A Temperança ("provocação", defesas.md:54) NÃO foi decidida. O a2 da 101 já tinha entrado por confirmação do humano; o a3 (alvo do interrogatório sem tortura) ficou no monte B.
- Origem: 102-despacho.md:19-33 e 101-despacho.md:44-46, commit badd0874
- Estado: no ar (`virtudes.json` traz "ao medo")

### A-027 · Perfuração é o nome do gate; Penetração é outra regra [tags: perfuracao, penetracao, glossario, absorcao, tecnica, gate]
- Data: 2026-09-24
- Decisão: (resumo, "a forma do G8") o termo do gate é Perfuração (combate.md:197-204); Penetração é a trilha de Técnica `penetracao` (Absorção ignorada, regras.json:155-166). O verbete do gate passa a "Perfuração" com apelidos "nível de perfuração", "resistência à perfuração", "r.perf", "gate"; "Penetração" e "pen" viram apelido do verbete da Técnica. Valores do exemplo do Machado (custo-de-servico-e-itens.md:125) NÃO mudam, dependem da revisão econômica.
- Origem: 102-despacho.md:35-65, commit badd0874
- Estado: substituída em parte por A-029 (o termo do gate passa a "Nível de Perfuração")

### A-028 · A folha da ação cala para o arremesso (I12 continua com o autor) [tags: arremesso, alcance, grid, folha-da-acao, distmax, i12]
- Data: 2026-09-24
- Decisão: (resumo) pedido do humano após o veredito da 102: a folha da ação deixa de mostrar faixa de distância e "Além do alcance máximo" para arma de classe `arremesso`, porque o número (livre 0 m, máximo igual ao `distMax` do catálogo) é inventado; arcos e bestas ficam como estão; o `alcanceInterpor` NÃO muda. A decisão do I12 (distMax do catálogo, Força de Arremesso de quem joga, ou calar de vez) continua do humano. Mudança de produção.
- Origem: docs/simulacao/caixa/103-despacho.md:1, :24-30, :34-50
- Estado: no ar (rodada 103; I12 em aberto, não conferido)

### A-029 · O termo do gate vira "Nível de Perfuração" [tags: perfuracao, glossario, autolink, absorcao, dano]
- Data: 2026-09-24
- Decisão: (resumo) o humano subiu o CORRIGE da 102: o termo do verbete `perfuracao` passa a "Nível de Perfuração" e a palavra solta "Perfuração" deixa de casar o autolink (24 dos 50 links estavam no sentido errado, em 10 páginas). O id `perfuracao` não muda; apelidos que ficam: "resistência à perfuração", "r.perf", "gate". `.no-gloss` caso a caso NÃO é o conserto.
- Origem: docs/simulacao/caixa/104-despacho.md:1, :18-30, :37-45
- Estado: no ar (glossario.json:70 traz "Nível de Perfuração")

### A-030 · Condução: quem ajuda a fabricar não cumpre o Requisito mas trabalha contra a Dificuldade da peça [tags: oficio, fabricacao, conducao, requisito, ajuda, direcao-de-obra, g19, g20]
- Data: 2026-09-24
- Decisão: "A Direção a Dificuldade 4 é regra de OBRA (construção: alvenaria, engenharia, naval, carpintaria de construção, as obras das tabelas de semanas e estações). Na FABRICAÇÃO de peças vale a regra nova: 'Quem ajuda a fabricar sob a condução de alguém que cumpre o Requisito da peça não precisa cumprir o Requisito, mas trabalha contra a Dificuldade da peça: se a média não passar dela, não soma Acúmulo.'" E: "dez aprendizes aceleram uma espada Comum" funciona pela regra nova; "um braçal (média 7) não soma na espada".
- Origem: docs/simulacao/caixa/105-despacho.md:17-27, commit bbec609e. Fecha G19 e G20. A G24 (teto de demanda do ganho de ofício) ficou só registrada como [DECIDIR].
- Estado: no ar (acoes-oficio-e-mundo.md:123); critério de "obra" refinado por A-032

### A-031 · A condução herda oficina e material; o +4 do sem ofício é pessoal; até dez ajudantes [tags: oficio, conducao, oficina, material, ajudante, g29]
- Data: 2026-09-24
- Decisão: "A regra de condução HERDA os modificadores. Oficina e material (±2/±4 na Dificuldade) são circunstâncias da tarefa e valem para todos que trabalham nela. O +4 de quem não tem o ofício específico é pessoal e pesa sobre quem não o tem. [...] o braçal (sem ofício) não soma na espada em nenhuma oficina (7 − 4 + 4 = 7 na oficina de mestre); aprendizes (Habilidade 1 ou 2) somam numa oficina bem equipada ou de mestre. Trava nova: a condução admite até DEZ ajudantes, como a direção de obra. Trocar o exemplo por: 'numa oficina bem equipada ou de mestre, dez aprendizes aceleram uma espada Comum e não fazem uma Ótima'."
- Origem: docs/simulacao/caixa/106-despacho.md:14-24, commit 5407b382 (b396c834 traz a conta "7 − 4 + 4")
- Estado: no ar (acoes-oficio-e-mundo.md:123)

### A-032 · Critério de obra versus fabricação [tags: oficio, obra, fabricacao, direcao-de-obra, escala-de-estacoes, g29]
- Data: 2026-09-24
- Decisão: "obra = construção fixa no lugar (casa, celeiro, forja, moinho, muralha, ponte, catedral) ou peça da escala de estações. Todo o resto é fabricação. Carroça e barco de pesca são fabricação; navio de guerra é obra (escala de estações). O critério não depende do ofício da linha."
- Origem: 106-despacho.md:26-31, commit 5407b382
- Estado: no ar (não conferido na Direção de obra)

### A-033 · Regra da metade é para apoio; condução e direção são para trabalho divisível [tags: ajuda, apoio, conducao, direcao, regua-comum, acumulo, g18]
- Data: 2026-09-24
- Decisão: "As duas regras convivem com alcances diferentes. A regra da metade (ajudante contra metade da Dificuldade; +1 a cada 6 acima) vale para APOIO numa jogada única, ação indivisível. Condução (fabricação) e direção (obra) valem para trabalho DIVISÍVEL, ação Longa com Acúmulo. Deixar isso escrito na Régua Comum e no capítulo de ofício; acoes-oficio-e-mundo.md:8 passa a apontar para a condução. O modo 'Apoiar' do Acoes_Sistema.md (mesma Dificuldade, +2) se alinha à regra publicada."
- Origem: 106-despacho.md:33-39 e :60-67, commit 5407b382. Fecha G18.
- Estado: no ar (não conferido na Régua Comum, acoes-e-sistema.md:172)

### A-034 · Preços novos de armas e armaduras (Fases 1 a 3 da revisão econômica) [tags: economia, preco, armas, armaduras, custo, sabre, g25]
- Data: 2026-09-24
- Decisão: (resumo) proposta de preços aprovada pelo autor. Base: custo = tempo da tabela de fabricação × salário do produtor; preço = 1,2 × custo base, arredondado (< 100 pc múltiplo de 5; 100 a 999 múltiplo de 10; ≥ 1.000 múltiplo de 100). Mudam: sabre 170, martelo de guerra 600, machado pesado 650, arco curto 100, camisa de malha 900. Ganham preço: espada serrilhada 250, maça 250, picareta de guerra 240, adaga de arremesso 50, machado de arremesso 80, azagaia 65, pilum 50, funda 10, bumerangue 30, rede 30, dardos 5 por unidade (só se o item for unidade), gambeson 140, couro 130, brigandina 680, lamelar 700, malha 1300, placa de munição 1400, placa de transição 2100, placa completa 2600. Mantidos: escudos, machado 300, placa articulada 1400, peitoral 280, peitoral reforçado 900, malha completa 1800, as três bestas. O aviso "Provisório" do capítulo fica; seis pendências de design (brigandina domina a malha, placa articulada domina a de transição, Kite x Heater e Pavês x Scutum, Machado mais caro que a Espada Longa, preços de baixa confiança, bestas dependentes da G25) vão ao tema G como [DECIDIR].
- Origem: docs/simulacao/caixa/107-despacho.md:5, :18-44, :113-142, commit 639851e1
- Estado: no ar (armas.json traz o preço do sabre; demais não conferidos)

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

### C-001 · Poder natural: esquema, sem portão de Centelha e sem Mana [tags: bestiario, poder-natural, centelha, mana]
- Data: 2026-09-26
- Decisão: "Poder natural NÃO passa pelo portão de Centelha e NÃO usa Mana. `resiste` é categoria, sem fórmula" (poder: {id, nome, tipo: "natural", base: {arte, nivel} só parâmetro, resiste: esquiva|corpo|mente|nenhum, area, efeito, usos: {quantidade, periodo, recarga}})
- Origem: b14-fase2-despacho.md:13-22 (item A.2), pino 3e29b03
- Estado: no ar (não conferido; a regra de Imunidade e dos poderes naturais foi refeita na Fase 4, ver C-037 e C-039)

### C-002 · Constructo: flag semVida [tags: constructo, bestiario, vigor, resistir]
- Data: 2026-09-26
- Decisão: "constructo: flag `semVida: true`. Mantém Vigor (PV e Absorção pela fórmula), mas não faz teste de Vigor, Resistência nem Virtude, não cura nem regenera sozinho (conserto por Ofício), e fica imune a tudo que se resiste por "corpo". Golem de material herda a fraqueza do material (lib-materiais.mjs), escrita na ficha."
- Origem: b14-fase2-despacho.md:26-29 (A.4); reafirmado em b14-cr-desafio-fase4-5-despacho.md:32-34 (Fase 4 item 6)
- Estado: a implementar (a flag existe na ficha mas Grep em src/lib e scripts/sim acha 0 ocorrências de `semVida`: nenhum código a lê; a fase3 despacho já pedia registrar como pendência)

### C-003 · Desafio do bestiário: saída individual/bando, recompensa usa só o individual [tags: bestiario, desafio, recompensa]
- Data: 2026-09-26
- Decisão: "desafio: {individual, bando: {quantidade, desafio}} como saída (vazio até a bancada), com nota: a recompensa usa só o individual."
- Origem: b14-fase2-despacho.md:23-24 (A.3)
- Estado: substituída por decisão posterior: a recompensa passou à soma dos valores das criaturas (commits 5d068c65, 2e) nos despachos de economia, fora desta parte; decisão posterior a localizar

### C-004 · Forma e dimensões da criatura [tags: bestiario, porte, dimensoes]
- Data: 2026-09-26
- Decisão: "dimensoes: {comprimento, largura, altura} em metros, mais envergadura (quem voa) e forma (humanoide, quadrupede, serpentiforme, alado, amorfo, radial). Forma comum dá padrão; as três medidas são obrigatórias só em forma não padrão. O porte continua pela massa (M-29b)."
- Origem: b14-fase2-despacho.md:9-12 (A.1)
- Estado: no ar (não conferido)

### C-005 · Classificação dos poderes: Arte, natural, traço social, passivo [tags: bestiario, poder-natural, arte, centelha]
- Data: 2026-09-26
- Decisão: "Aplicar a classificação: Arte vira `arte` na ficha (id e nível ≤ Centelha); natural vira poder natural com os usos da tabela; "traço social" vira texto em habilidades; "passivo" de voo vai para locomocao, de defesa vira Absorção/resistência/imunidade; as 4 "alternativa mágica" saem." E: "Onde a Arte sugerida passa da Centelha da criatura, NÃO suba a Centelha: liste para o autor."
- Origem: b14-fase2-despacho.md:30-35 (B.5, B.6)
- Estado: substituída por C-037 (Fase 4 item 3: Arte só para quem conjura como classe; o resto vira poder natural) e pelo Adendo 1 da Fase 4 (C-043, Arte não tem portão de Centelha)

### C-006 · Defesa Social para Int 1 [tags: defesa, social, bestiario]
- Data: 2026-09-26
- Decisão: "Defesa Social: Int 1 passa a ter Defesa Social, com Sobrevivência no lugar de Sociabilidade (regras.json já prevê isso); "-" só para Int 0. Vale em gen-bestiario, bestia-editor.ts e onde mais calcular."
- Origem: b14-fase2-despacho.md:37-40 (C.7)
- Estado: no ar (não conferido)

### C-007 · Nenhum animal comum com Centelha [tags: centelha, bestiario]
- Data: 2026-09-26
- Decisão: "Nenhum animal comum com Centelha: Cão de Montaria, Rã Gigante e Leão Atroz vão a 0."
- Origem: b14-fase2-despacho.md:41-42 (C.8)
- Estado: no ar (não conferido). Complementado em C-036 (Centelha da criatura é eixo próprio; Worg 1, Orc 5)

### C-008 · Incorpóreos: resistências a corte, perfuração e impacto no lugar da imunidade [tags: bestiario, resistencia, imunidade, incorporeo]
- Data: 2026-09-26
- Decisão: "Incorpóreos (Sombra, Assombração, Espectro, Fantasma): sai a imunidade "só Arcano, Proteção ou arma encantada"; entram resistências a corte, perfuração e impacto (regra de resistência do regras.json). Fraquezas a luz e sagrado continuam."
- Origem: b14-fase2-despacho.md:43-45 (C.9)
- Estado: no ar (não conferido)

### C-009 · Voo: locomocao.voo e velocidade de terra da fonte [tags: bestiario, locomocao, deslocamento]
- Data: 2026-09-26
- Decisão: "as criaturas que voam na fonte ganham locomocao.voo; a velocidade em terra passa a ser a da fonte (hoje há casos com a velocidade de voo lida como terra, ex.: mon-roc)." Reforçado depois: "ft ÷ 10 = m/Tick de batalha, como o resto do deslocamento ... Terra passa a ser a velocidade de terra da fonte ... Os outros modos (natação, escalada, escavação) entram do mesmo jeito."
- Origem: b14-fase2-despacho.md:46-48 (C.10); b14-fase2-resposta-despacho.md:26-29 (item 4)
- Estado: no ar (deslocamento resolvido em 28/08 e estendido; 309 criaturas, ver memória "Deslocamento do bestiário"; não conferido por criatura). **Atualizado em 10/10/2026:** nos animais, o "ft ÷ 10" vai ser substituído pela fórmula humana × porte × anatomia (D-115) quando a ficha nova entrar no repositório; até lá, segue no ar.

### C-010 · Orc: atributos fixos e poderes da raça [tags: bestiario, orc, racas, atributos]
- Data: 2026-09-26
- Decisão: "Orc (mon-orc): Força 5, Destreza 3, Vigor 5, Influência 2, Perspicácia 2, Compostura 1, Percepção 3, Inteligência 2, Raciocínio 2; ganha Vitalidade (+Vigor de PV) e Frenesi como poderes naturais, iguais aos da raça (racas.json)."
- Origem: b14-fase2-despacho.md:49-52 (C.11)
- Estado: no ar (não conferido)

### C-011 · Vontade em combate: 1 ponto, +1d6 ou +4 na Defesa, máximo 1 por ação [tags: vontade, defesa, combate]
- Data: 2026-09-26
- Decisão: "Vontade em combate, em regras.json: 1 ponto dá +1d6 na jogada ou +4 numa Defesa, no máximo 1 ponto por ação ou jogada (inclusive cada golpe que se defende). Ajuste o texto de aparencia-virtudes-vontade.md, que hoje diz "turbinar" sem número."
- Origem: b14-fase2-despacho.md:53-56 (C.12)
- Estado: no ar (não conferido; estendida a "inclusive resistir" em C-069). NOTA de 03/10/2026 (D-001): o limite de 1 ponto por ação vale SÓ para melhorar uma ação ou uma Defesa; resistir é pagamento à parte.

### C-012 · Horda: sugestão ao Mestre a partir de 2 por personagem [tags: horda, combate, bestiario]
- Data: 2026-09-26
- Decisão: "Horda: texto sugerindo ao Mestre tratar como Horda a partir de 2 criaturas por personagem, deixando explícito que é decisão dele."
- Origem: b14-fase2-despacho.md:57-58 (C.13)
- Estado: no ar (combate.md, parágrafo da Horda; a fase3 despacho corrigiu um asterisco literal em combate.md:426)

### C-013 · Grupo de referência da bolsa de 3 para 4 [tags: economia, recompensa, grupo, desafio]
- Data: 2026-09-26
- Decisão: "lore/economia/v2/modelo.py:445 (comentário) e :466 grupo=4; src/data/recompensas.json _nota e "grupo": 4 (regerar pelo gerador, não à mão); custo-servicos.md:40 (× 4) e :42 ("grupo de 4"); CalculadoraRecompensa.astro:24, o value="3" do "Tamanho real do grupo" vira "4"; docs/pendencias/B-bestiario.md:118, a definição do desafio passa a "grupo de 4 personagens"."
- Origem: b14-fase2-despacho.md:60-66 (D.14); CORRIGE de `_nota` em b14-fase3-despacho.md:41-43 (commit 513f5a1)
- Estado: no ar (não conferido; Grep de "grupo.*4" em recompensas.json não achou texto, o campo é numérico)

### C-014 · Subtipos de poder: o que vira poder formal e o que vira texto [tags: bestiario, poder-natural, ataque]
- Data: 2026-09-26
- Decisão: "`disparo` vira entrada em `ataques` (distancia: true); `manobra` vira efeito do ataque (bote, investida) ou texto em `habilidades`; `agarrao` e constrição viram efeito do ataque ("agarra ao acertar"); `sentido` vira texto em `habilidades`. Poder formal (resiste/area/usos) só para sopro, olhar, aura, presenca, toque, veneno, teia, regeneracao, forma, travessia, invisivel, convocar, explosao, canto e dominio. Veneno e toque ganham `ataque: <id do ataque>`"
- Origem: b14-fase2-resposta-despacho.md:15-20 (item 1)
- Estado: no ar (não conferido)

### C-015 · Proezas de criatura viram proezaFutura, inertes [tags: bestiario, proeza, poder-natural]
- Data: 2026-09-26
- Decisão: "Referências a Caminho de Proeza já existentes (Águia Gigante e as outras 45 entradas tipo proeza): NÃO apagar. A mecânica de hoje vem da tabela; o Caminho vai para um campo `proezaFutura` ({caminho, tecnica}), inerte até as Proezas fecharem."
- Origem: b14-fase2-resposta-despacho.md:21-23 (item 2)
- Estado: no ar (não conferido)

### C-016 · Escala do desafio 0 a 12 e campo maisUm [tags: desafio, bestiario, escala]
- Data: 2026-09-26
- Decisão: "acrescente `desafio.maisUm` (quantos indivíduos juntos sobem o desafio em 1), vazio até a bancada. A escala de desafio vai de 0 a 12: 0 = feito para 4 personagens de Centelha 0."
- Origem: b14-fase2-resposta-despacho.md:29-31 (item 5)
- Estado: no ar (escala refinada em C-078: nada passa de 9, exceto a Tarrasca 10)

### C-017 · Fase 3: resiste decidido pelo EFEITO, não pela Arte de base [tags: resistir, bestiario, poder-natural]
- Data: 2026-09-26
- Decisão: (resumo do despacho; o texto do autor está em ../tmp/arquiteto/decisoes-fase3.md, não colado) "a regra do `resiste` decide pelo EFEITO, não pela Arte de base, e reescreve os poderes já gravados"; substitui o padrão da fase 2.
- Origem: b14-fase3-despacho.md:18-21 e :77-80
- Estado: no ar (não conferido)

### C-018 · Fase 3: poder natural isento do portão; gigantes sobem de Centelha; Gárgula perde resistências; locomoção jato [tags: bestiario, centelha, poder-natural, locomocao]
- Data: 2026-09-26
- Decisão: (resumo) poder natural é isento do portão de Centelha; Gigante da Tempestade Centelha 3 para 5 e das Nuvens 1 para 4 ("decisão do autor ... aplique direto"); a Gárgula PERDE as resistências a corte, perfuração e fogo (não existem na fonte); modo de locomoção novo `jato` (só o Kraken); 3 criaturas sem natação na fonte (Tigre, Urso Cinzento, Urso-pardo) não gravam natação; mudanças também em treant, elemental da terra grande, gigante do fogo, montão tropeçante, rakshasa e tarrasque ("As 7 defesas").
- Origem: b14-fase3-despacho.md:21-28, :83-96
- Estado: no ar (não conferido)

### C-019 · Quase-Acerto: raspão com termo de Centelha, Redução leve 1, piso do acerto [tags: quase-acerto, raspao, armadura, centelha, dano]
- Data: 2026-09-27
- Decisão: "Raspão = dano de raspão da arma − Redução de raspão da armadura − Centelha do alvo, mínimo 0. O Vigor não entra. Armadura leve passa a ter Redução de raspão 1 (regras.json, quaseAcerto.porClasseArmadura.leve.reducao). Acerto: o dano líquido nunca é menor que o raspão daquele golpe."
- Origem: regra-quase-acerto-bancada-despacho.md:27-34 (item 2), commit 1b933b55
- Estado: substituída em parte pela Reforma (C-027: o raspão passa a somar a Centelha do atacante e subtrair a do alvo; Reduções 0/1/3/5)

### C-020 · Simultâneo: quem estava de pé na abertura do Tick solta todos os golpes [tags: tick, simultaneo, combate, motor]
- Data: 2026-09-27
- Decisão: "Regra correta: quem estava de pé na abertura do Tick solta todos os golpes daquele Tick, mesmo que caia nele (o mesmo retrato que já vale para o alvo desde 03/09). Corrija no Grid e no motor" (rotulado conserto de erro, não mudança de regra)
- Origem: regra-quase-acerto-bancada-despacho.md:40-44 (item 3), commits 1b933b55 e 99652358
- Estado: no ar (não conferido)

### C-021 · Vida negativa até o limite de morte M-21 [tags: vida, morte, pv, limite]
- Data: 2026-09-27
- Decisão: "A Vida desce abaixo de zero até o limite de morte (M-21: −PV máximo ÷ 2). O motor trava em zero ... confira o Grid e corrija onde travar. Na barra de vida, mostre 0; o valor negativo aparece só no painel de detalhes da criatura ou personagem." Item 4b (autor, 27/09): o piso de `jogador_dano` no servidor também vira o limite M-21 (migração 40).
- Origem: regra-quase-acerto-bancada-despacho.md:46-50 (item 4) e :122-130 (item 4b), commits 1b933b55 e caafa029 (migração 40 aplicada em produção com -ceil(pv_max/2) para todas as peças, sem coluna centelha)
- Estado: no ar (migração 40 rodou, mas sem o arredondamento por Centelha: caminho (a) da coluna `centelha` continua pendente, ver reforma-centelha-briga-revisao-despacho.md seção I)

### C-022 · Nota do livro: mesa presencial no Simultâneo [tags: simultaneo, tick, combate, mesa]
- Data: 2026-09-27
- Decisão: "Na mesa presencial, todos que agem no mesmo Tick rolam juntos; a ordem de resolução serve só para anotar."
- Origem: regra-quase-acerto-bancada-despacho.md:51-53 (item 5), commit ffbeee0a
- Estado: no ar (combate.md; não conferido)

### C-023 · Pendências de regra registradas, sem resolver (lote do Quase-Acerto) [tags: pendencia, habilidade, quase-acerto, armadura]
- Data: 2026-09-27
- Decisão: (resumo) registrar sem resolver: (a) Atributo sugerido por Habilidade secundária; (b) Redução de raspão com armaduras vestidas juntas; (c) Cura, Acerto Arcano e Energia Espiritual comparados por pacote na etapa das Artes; (d) novo escopo da Prestidigitação: "mãos hábeis sob os olhos dos outros" (furto e plantar objetos, trapaça em jogos, sabotagem discreta, truques de mão), Abrir Mecanismos fica com fechaduras e armadilhas; (e) Proeza de Quase-acerto com duas alavancas, dano do raspão e margem; (f) interface mostrando juntos os golpes de um Tick.
- Origem: regra-quase-acerto-bancada-despacho.md:66-77 (item 7)
- Estado: a implementar (registradas como pendência; (d) texto do livro por escrever)

### C-024 · Reforma da Centelha: 2 × mín(Centelha, Habilidade) em toda jogada e Defesa [tags: centelha, reforma, defesa, margem, habilidade]
- Data: 2026-09-28
- Decisão: "Bônus de Centelha em TODA jogada e em TODA Defesa: 2 × o menor entre Centelha e a Habilidade daquela jogada ou Defesa. ... Sem Habilidade, sem bônus. Jogadas só de Atributo (sem Habilidade): +1 × Centelha (provisório; registre como pendência). Isto substitui o +1 por ponto de Centelha no ataque e nas Defesas (centelhaMult em regras.json). A pendência D7 (+1 ou +2) fica resolvida por esta regra"
- Origem: reforma-centelha-briga-despacho.md:15-26 (Fase 1 itens 1), commit adfbb5d7; reafirmada em reforma-centelha-briga-revisao-despacho.md:14-19. Conferência prévia: energia e mana também têm `centelhaMult` mas o pedido não os cobre.
- Estado: no ar (centelha.md:44, 02/10: "2 × o menor entre a Centelha e a Habilidade"; o "Atributo puro" provisório foi refinado em C-051)

### C-025 · Resistência a efeito por Dificuldade: nível da Arte × 5 + 2 × mín [tags: artes, resistir, dificuldade, centelha]
- Data: 2026-09-28
- Decisão: "Dificuldade = nível da Arte × 5 + 2 × o menor entre a Centelha do conjurador e o nível da Arte. O alvo soma 2 × o menor entre a Centelha dele e a Habilidade da jogada."
- Origem: reforma-centelha-briga-despacho.md:27-29 (Fase 1 item 2), commit adfbb5d7
- Estado: SUBSTITUÍDA por D-060 (04/10/2026): a Dificuldade passa a "maior grau investido × 5"

### C-026 · Dano e Absorção: +1 por ponto de Centelha, sem limite, também em cada pulso [tags: dano, absorcao, centelha, artes]
- Data: 2026-09-28
- Decisão: "Dano: +1 por ponto de Centelha do atacante, sem limite, em armas, Artes e em cada pulso de dano contínuo." "Absorção: continua +1 por ponto de Centelha em todos os tipos, inclusive contra magia e em cada pulso."
- Origem: reforma-centelha-briga-despacho.md:30-33 (itens 3 e 4), commit adfbb5d7
- Estado: no ar (centelha.md:44 cita dano inteiro e sem teto)

### C-027 · Raspão com Centelha de atacante e de alvo; Reduções 0/1/3/5 [tags: quase-acerto, raspao, armadura, centelha]
- Data: 2026-09-28
- Decisão: "Raspão = dano de raspão da arma − Redução da armadura + Centelha do atacante − Centelha do alvo, mínimo 0. O piso continua: o acerto nunca causa menos que o raspão do golpe." "Redução de raspão por classe de armadura: Nenhuma 0, Leve 1, Média 3, Pesada 5 (Bônus de QA sem mudança: 0/1/2/3)."
- Origem: reforma-centelha-briga-despacho.md:34-37 (itens 5 e 6), commit adfbb5d7. Pendência aberta: o card fora de combate `quaseAcerto()` não tinha a Centelha do alvo (fonte única, resolvida em 82da902d).
- Estado: no ar (não conferido nos números de regras.json)

### C-028 · Escada de Dificuldade com 35, 40, 45+ e nota de alcance humano [tags: dificuldade, escala, mestre]
- Data: 2026-09-28
- Decisão: "acrescente 35 Lendário, 40 Mítico e 45 ou mais Semidivino, com a nota de que ficam fora do alcance de pessoas comuns (um mortal no máximo, sem Especialidade, praticamente não passa de 30)."
- Origem: reforma-centelha-briga-despacho.md:52-56 (Fase 2 item 2), commit 9270be6f
- Estado: no ar (não conferido)

### C-029 · Briga: desarmado com acerto +1 e Defesa da arma +1; punho como arma média em Proeza [tags: briga, desarmado, arma, proeza]
- Data: 2026-09-28
- Decisão: "Desarmado em armas.json: acerto +1 e Defesa da arma +1. Dano, tipo e Ticks continuam (1d6 − 2 + Força, Impacto, 5 Ticks)." E a pendência: "punho como arma média", nível 1 da árvore de Briga, "Transforma o punho em classe média por inteiro (1d6 + Força, QA de classe média, 6 Ticks). Não implemente agora."
- Origem: reforma-centelha-briga-despacho.md:57-62 (Fase 3), commit 7bbe593d
- Estado: SUBSTITUÍDA por D-057 para o desarmado (Punhos e Chutes, 04/10/2026); a Proeza "punho como arma média" continua a implementar

### C-030 · Pendências da Reforma, sem resolver [tags: pendencia, centelha, bestiario, habilidade, migracao]
- Data: 2026-09-28
- Decisão: (resumo) registrar sem resolver: jogadas só de Atributo com +1 × Centelha provisório; Proeza "punho como arma média"; custo das Habilidades a revisar depois da Parte B; recalibrar o bestiário com a regra nova; migração 40 com arredondamento exato pelo caminho (a), coluna centelha em combatentes, a aplicar à mão.
- Origem: reforma-centelha-briga-despacho.md:97-103
- Estado: a implementar (o "Atributo puro" foi decidido em C-051; as demais seguem pendentes)

### C-031 · Fichas de referência da bancada (Centelha 0 a 6) [tags: bancada, calibracao, centelha]
- Data: 2026-09-28
- Decisão: (resumo) substituir a grade de soma 6/8/12 por fichas de referência, Centelha 0 a 6, armadura nenhuma/gambeson/malha: típica espada, típica montante, especialista ofensivo, defensivo; medir duração entre iguais, degrau X+1 contra X, alavancas, espada contra montante, Briga contra Armas, 1 contra 2 e 3, e o erudito de Centelha 6 (esperado: perde sem treino, resiste com Armas 2 e Esquiva 2). Sem decisão de regra do jogo, é medição.
- Origem: reforma-centelha-briga-despacho.md:72-95 (Fase 5), commit de96fa77
- Estado: no ar (bancada; medição, não regra)

### C-032 · Padrão único 0 para Integridade ausente (bestiário) [tags: bestiario, defesa, mental, integridade]
- Data: 2026-09-28
- Decisão: (resumo) o despacho de revisão registra "Padrão único (0) para Integridade ausente, decisão do autor, com prova de concordância" (commit 56a15544); o texto da decisão não está colado.
- Origem: reforma-centelha-briga-revisao-despacho.md:108-109 (item 8 da lista de commits), commit 56a15544
- Estado: no ar (não conferido)

### C-033 · Bestiário: fixar criatura para comparar (UI, não regra) [tags: bestiario, ui, localstorage]
- Data: 2026-09-28
- Decisão: (resumo) fixar até 6 criaturas no topo, persistência em `localStorage`, aparecem mesmo com filtro; a sétima é recusada com aviso. Sem regra do jogo: decisão de interface do autor.
- Origem: bestiario-fixar-criatura-despacho.md:12-19, commit 815e0e6d
- Estado: no ar

### C-034 · Três consertos da bancada (não mudam regra) [tags: bancada, calibracao, tick]
- Data: 2026-09-28
- Decisão: (resumo) o ciclo da força por Tick passa a ser o da peça depois de ajustarAnatomia; volta a medir +1 Destreza com espada; confere se o teto da Pressão chega ao motor. O autor declara "Não mude regra". Sem decisão de regra.
- Origem: bancada-tres-consertos-despacho.md:10-27, commit de35d9c2
- Estado: no ar (bancada)

### C-035 · Fase 4 B14: CR da fonte e correções pontuais de fichas [tags: bestiario, desafio, cr]
- Data: 2026-09-28
- Decisão: "`fonte.cr` e `fonte.crConf` (confirmado/conhecido/estimado) em toda ficha, do JSON. Correções: Dragão Dourado Adulto 15, Filhote de Dragão Vermelho 6, Cão de Montaria 1, Tarrasca 25, Rato Gigante 1/3 ..., Soldado Veterano 2. mon-elefante vira Elefante (CR 7); o Mamute é o mon-mastodon que já existe."
- Origem: b14-cr-desafio-fase4-5-despacho.md:9-17 (Fase 4 item 1), commit c03eb27f
- Estado: no ar (não conferido)

### C-036 · A Centelha da criatura é eixo próprio, independente do desafio [tags: centelha, bestiario, desafio]
- Data: 2026-09-28
- Decisão: "A Centelha da criatura é eixo próprio, independente do desafio. Não recalcule Centelha a partir do CR. Mudanças pontuais: Worg 1; Orc fica com Força 5; Roper fica 5." Adendo 2 (29/09): "Girallon, Centelha 1", Tarn Linnorm com cerca de 36 m e 11 t.
- Origem: b14-cr-desafio-fase4-5-despacho.md:18-20 (item 2), :163-169 (Adendo 2)
- Estado: no ar (não conferido). Vetada a regra de Centelha-a-partir-do-CR (:90-91)

### C-037 · Poderes inatos com usos são naturais; Arte só para quem conjura como classe [tags: bestiario, poder-natural, arte, mana]
- Data: 2026-09-28
- Decisão: "toda habilidade inata com usos (Sp e Su da fonte) é poder natural, com os usos da fonte e sem portão de Centelha. Arte com Mana só para quem conjura como classe (dragões, Lich, Couatl, Ninfa, Planetar, Solar, Ghaele, Rakshasa, Naga). Isto revê a fase 3: as Artes gravadas das outras criaturas viram poderes naturais, com base e nível mantidos como parâmetro."
- Origem: b14-cr-desafio-fase4-5-despacho.md:21-26 (item 3), commits cb2381c3, a4d53bdc, 0cdc06db
- Estado: no ar (não conferido). Substitui parte da C-018 e da C-005

### C-038 · Todo poder natural ganha descricao detalhada [tags: bestiario, poder-natural, texto]
- Data: 2026-09-28
- Decisão: "Todo poder natural ganha `descricao` detalhada, adaptada da fonte e escrita em texto próprio (não copiar), com o que o poder faz na ficção e nos números da fonte, mesmo quando ainda não há regra no sistema. O Mestre tem de conseguir usar só com ela."
- Origem: b14-cr-desafio-fase4-5-despacho.md:27-30 (item 4)
- Estado: no ar (não conferido)

### C-039 · Imunidade: dano zero do tipo; imunidade + fraqueza ao mesmo tipo = dano normal [tags: imunidade, fraqueza, resistencia, dano, bestiario]
- Data: 2026-09-28
- Decisão: "Imunidade: nova regra em regras.json, junto de fraqueza e resistência. Imunidade = dano zero daquele tipo; se imunidade e fraqueza ao mesmo tipo coexistirem (por efeito), o dano é normal."
- Origem: b14-cr-desafio-fase4-5-despacho.md:31-33 (item 5), commit c03eb27f
- Estado: no ar (regras.json:2125 `imunidade.nota`: "dano daquele tipo é ZERO, não metade como a resistência")

### C-040 · Constructo na Fase 4: mantém Vigor, sem teste de Vigor/Resistência/Virtude [tags: constructo, vigor, resistir, golem]
- Data: 2026-09-28
- Decisão: "Constructo: mantém Vigor; não faz teste de Vigor, Resistência nem Virtude. Golems seguem a tabela de lib-materiais.mjs como está."
- Origem: b14-cr-desafio-fase4-5-despacho.md:34-36 (item 6)
- Estado: a implementar (ver C-002: nenhum código lê `semVida`)

### C-041 · Fantasma e Sombra: dano é fenômeno, armadura não absorve [tags: dano, armadura, absorcao, incorporeo, centelha]
- Data: 2026-09-28
- Decisão: "Fantasma e Sombra: o dano é fenômeno (armadura não absorve, só a Centelha), como a regra das Artes já prevê."
- Origem: b14-cr-desafio-fase4-5-despacho.md:37-38 (item 7)
- Estado: no ar (não conferido)

### C-042 · Resistências novas por criatura: só pendência, sem palavra nova [tags: bestiario, resistencia, vocabulario]
- Data: 2026-09-28
- Decisão: "Resistências novas por criatura (ferro frio, adamantina, ácido): só anote em pendência, não crie palavra no vocabulário agora." As 67 decisões dos graves entram com os ajustes acima.
- Origem: b14-cr-desafio-fase4-5-despacho.md:39-41 (item 8)
- Estado: no ar (aplicada em 0cdc06db, B14 Fase 4) (pendência)

### C-044 · Fase 5: definição de desafio e âncoras do autor [tags: desafio, bancada, bestiario, ancora]
- Data: 2026-09-28
- Decisão: "o desafio de uma criatura (ou bando) é a Centelha X do grupo de referência de 4 que passa dificuldade para vencê-la (derrota do grupo = 2 dos 4 caídos; vitória do grupo em pelo menos 80%). Acima de 6, pelo número de personagens de Centelha 6 necessários: desafio = 6 + log_k(N/4)". Âncoras: 1 lobo não é desafio nem para C0, matilha é; 4 ou 5 worgs: desafio 2; Filhote de dragão vermelho 3 ou 4, jovens 5 ou 6, adultos 6 a 8, ancião 9; Balor, Diabo do Fosso, Solar, Kraken 6 a 8; Grande Wyrm 9 ou mais; Tarrasca 10.
- Origem: b14-cr-desafio-fase4-5-despacho.md:41-77 (Fase 5), commits 1ef85bb9 a 7993cffc
- Estado: no ar (bancada em `scripts/sim`; "Âncoras do autor = testes de aceitação", não alvo a forçar)

### C-045 · Grupo de referência: composição, Proezas matemáticas, Vontade [tags: bancada, desafio, proeza, vontade]
- Data: 2026-09-28
- Decisão: (resumo) Pers.1 corpo a corpo e Pers.2 distância com somas de ataque 9,10,11,12,12,12,12; Pers.3 suporte com Artes até nível Centelha + 2 (PROVISÓRIO, só na bancada); Pers.4 não combatente 5,6,6,8,8,9,10; Proezas como bônus matemático de 3 × Centelha pontos repartidos; "Vontade: +1d6 na jogada ou +4 numa Defesa, 1 por jogada"; cada criatura medida também sem armadura e de malha.
- Origem: b14-cr-desafio-fase4-5-despacho.md:49-65
- Estado: no ar (bancada, medição; pendência: Centelha 0 conjurando e o teto Centelha + 2 divergem do livro, ver C-076)

### C-043 · Arte exige só Centelha > 0; o portão "nível N exige Centelha ≥ N" é só das Técnicas de Proeza [tags: artes, centelha, proeza, tecnica, portao]
- Data: 2026-09-29
- Decisão: (resumo; o despacho cita que a distinção veio do autor e confirma no livro) o portão "nível N exige Centelha ≥ N" é só das Técnicas de Proeza (centelha.md, regras.json:639), e Arte só exige Centelha > 0, com profundidade paga por XP (criacao-de-personagem.md, artes/regras.astro:46). Feiticeiro Menor mantém Fogo N2; Mago de Batalha com Bola de Fogo (Fogo N4) e Escudo de Força (Forças N4) sem subir a Centelha. Teto "Arte até Centelha + 2" é só da bancada.
- Origem: b14-cr-desafio-fase4-5-despacho.md:113-154 (Adendo, itens 1 e 2a-c)
- Estado: substituída por decisão posterior em parte: em 02/10 o autor decidiu que o mortal (Centelha 0) tem Mana e conjura Arte (ver C-076), logo "exige Centelha > 0" para Arte caiu

### C-079 · Texto do /bestiario: Ameaça em recalibração [tags: bestiario, ameaca, desafio, ui]
- Data: 2026-09-29
- Decisão: (resumo) tirar "Ameaça... de 1 a 6" e "poderes traduzidos em Proezas e Feitiçarias" do topo de bestiario.astro: "os poderes são naturais (com usos) ou Artes; o desafio (Ameaça) está em recalibração, os losangos continuam mostrando o valor antigo até a bancada da Fase 5 medir de verdade"; locomoção e poderes naturais visíveis nos cards.
- Origem: b14-cr-desafio-fase4-5-despacho.md:174-199 (Adendo 3), commit 6ea979bc
- Estado: no ar (exibição; não conferido)

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
- Estado: no ar. Conferido na junta: centelha.md:44 traz a regra de Atributo puro (Centelha inteira, so quando o Mestre pede o Atributo sozinho), com o criterio do autor acrescentado em 4fca4a3f (02/10/2026). Ajustada pelo Adendo 1 da correcao da Reforma (ver C-049, cancelada, e o criterio de 02/10).

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

### B-037 · Pendência de preços do sobre-humano, poções e modificador regional [tags: economia, pendencia, pocoes, regional]
- Data: 2026-10-01
- Decisão: (resumo) anotar, sem executar: preços do sobre-humano (Centelha, Proezas, Magia), poções como estoque de emergência caro e o modificador regional.
- Origem: docs/simulacao/caixa/fechamento-economia-reforma-despacho.md:51-52, commit ad426d63
- Estado: sem decisão do autor

### C-046 · Fase 5b: múltiplos ataques só pelas regras escritas; PV não cresce com a Centelha; nova base sem Proezas [tags: economia, acao, rajada, bestiario, pv, bancada]
- Data: 2026-10-01
- Decisão: "Múltiplos ataques só pelas regras escritas (combate.md: Rajada e empunhadura dupla). Fora disso, só por Poder Especial ou Proeza." "PV não cresce com a Centelha (só a Absorção). O PV fixo da bancada está certo." "Nova base da bancada: SEM o bônus de Proezas (atual célula B2). A célula B1 (com Proezas) fica como teste de sensibilidade." Adendo: base "SEM Proezas e COM Vontade (o traço Força de Vontade real)". Pers.2: "um disparo por ação, sem Rajada nem dupla". Bando: "N criaturas individuais".
- Origem: b14-fase5b-economia-de-acao-despacho.md:14-20, :82-103 (Adendos 1), commits 2e14b3f2, 3c9f9d59
- Estado: no ar (bancada)

### C-047 · Guarda sob pressão: leitura da Defesa final, feito + recebido, dupla conta 2 [tags: guarda, pressao, defesa, combate, tick]
- Data: 2026-10-01
- Decisão: "o −2 por ataque feito ou recebido cai na **Defesa final**, e não na Habilidade Esquiva, então **não reduz** o 2 × mín(Centelha, Esquiva). Acumula até a próxima ação de quem sofre e zera quando ele age, sem teto." Adendo 2: "vale `combate.md:405`. **−2 na Defesa final por ataque FEITO ou RECEBIDO** ... **a empunhadura dupla conta 2 ataques feitos**." Ação que não é ataque (cura, estabilizar) não conta.
- Origem: b14-fase5b-economia-de-acao-despacho.md:88-97 (Adendo 1 item 2), :105-125 (Adendo 2), :139-141 (Adendo 3 item 3), commit 8c7f941f
- Estado: no ar no livro (combate.md:405); o Grid ainda cobra só o recebido (pendência K37, `defesaPerdida` em combate-tempo.ts:696)

### C-048 · Penalidade de fase (Preparo −2, Golpe −4) só vale contra golpes no mesmo instante [tags: tick, preparo, golpe, simultaneo, combate]
- Data: 2026-10-01
- Decisão: "A penalidade de fase (Preparo −2, Golpe −4) **só vale contra golpes que caem no mesmo instante do gesto**, como o sistema Normal descreve ... Numa bancada por turnos, ela não liga quando o combatente age nem dura até a próxima ação. **Preparo e Golpe são duas penalidades distintas**: não juntar num −4 só."
- Origem: b14-fase5b-economia-de-acao-despacho.md:127-144 (Adendo 3), commit 86de43ff
- Estado: no ar (livro combate.md:378-382; bancada corrigida em 86de43ff)

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

### C-049 · Correção da Reforma, "regra do maior" (proposta do assistente, depois cancelada) [tags: centelha, reforma, maior, sem-decisao-do-autor]
- Data: 2026-10-02
- Decisão: (resumo) o despacho original traz como "decisões do autor" que o bônus de Centelha é "o MAIOR entre +1 por ponto de Centelha e 2 × mín(Centelha, Habilidade)", com alcance "tudo" (jogada, Valor Passivo, três Defesas, Defesa parada). O Adendo 1 do mesmo arquivo diz: "a regra do maior (proposta do assistente, nunca decidida pelo autor)", e o relato deve registrar "a regra do maior entrou como decisão do autor pela resposta à pergunta de alcance, e o autor a cancelou: não era decisão dele".
- Origem: correcao-reforma-despacho.md:17-47 e :171-201; commits 4aaf0fce, 58869f2f, ae1889c9, 555abf60 (aplicações), 0ebc9917 e a5d66a27 (desfazem)
- Estado: sem decisão do autor (cancelada; revertida em 0ebc9917)

### C-050 · Correção da Reforma: Defesa parada com 2 × mín(Centelha, Sociabilidade) [tags: defesa, social, centelha, reforma, relacoes-sociais]
- Data: 2026-10-02
- Decisão: "Defesa parada = (Compostura + Sociabilidade) × multDefesa + 2 × menor(Centelha, Sociabilidade) + termo da régua. Motivo: o ataque social leva 2 × mín(C, Habilidade) pela Reforma, e entre Centelhas iguais o bônus tem de se cancelar". Adendo 1: "ataque social com 2 × mín, a frase do Tempo do passo restaurada". Registro obrigatório: "a troca do 8d1cbb79 foi decisão de regra tomada sem o autor, sob o nome de 'comentário desatualizado'; o resultado ficou certo, mas o caminho foi errado, e regra se pergunta."
- Origem: correcao-reforma-despacho.md:18-25, :198-199, commits ae1889c9 e a5d66a27 (relacoes-sociais.md:138, :182, :274-276; regras.json:2683)
- Estado: no ar (centelha.md:44 e a Defesa parada com 2 × mín)

### C-051 · Regra do bônus de Centelha, versão final do autor [tags: centelha, jogada, atributo-puro, habilidade, defesa, valor-passivo]
- Data: 2026-10-02
- Decisão: "1. Jogada de Atributo + Habilidade (o caso comum), Valor Passivo, as três Defesas e a Defesa parada: 2 × mín(Centelha, Habilidade). Sempre o menor. Habilidade 0 dá bônus 0. ... 2. Jogada de Atributo puro, quando o MESTRE pede só o Atributo (raro; por exemplo, "role Destreza"): + Centelha inteira. É a D12, que continua valendo. O texto precisa deixar claro que "jogada só de Atributo" é o TIPO de jogada pedida ... 3. Dano, Absorção, raspão, Energia, Mana e saltos continuam somando a Centelha inteira." Exemplo: Destreza 3, Centelha 3: "role Destreza" = 1d6 + 5; "Destreza + Atletismo" com Atletismo 0 = 1d6 + 2; com Atletismo 2 = 2d6 + 6.
- Origem: correcao-reforma-despacho.md:175-190 (Adendo 1), commits 0ebc9917, a5d66a27, 4fca4a3f
- Estado: no ar (centelha.md:44 traz exatamente estes exemplos)

### C-052 · Passivos do grupo na mesa seguem o Valor Passivo do livro [tags: valor-passivo, mesa, grupo, percepcao]
- Data: 2026-10-02
- Decisão: "O painel mostra o Valor Passivo do livro. Commit próprio, com a linha do que muda para quem joga hoje (Kael passa de 16 para 24)." Adendo 1: "Passivos do grupo na mesa seguindo o Valor Passivo do livro (Kael de 16 para 24)."
- Origem: correcao-reforma-despacho.md:42-44, :139-146 e :200, commit 555abf60
- Estado: no ar

### C-053 · Nota da B14 sobre bancada com regra antiga: cancelada [tags: desafio, bancada, bestiario, ancora]
- Data: 2026-10-02
- Decisão: "A nota da B14 sai: a bancada mediu com a regra certa, e as âncoras continuam válidas."
- Origem: correcao-reforma-despacho.md:201 (Adendo 1, item 5)
- Estado: no ar (nada a medir de novo por causa da regra do maior)

### C-054 · Proeza: nível N custa o preço total do nível N; subir paga a diferença [tags: proeza, tecnica, xp, custo, criacao]
- Data: 2026-10-02
- Decisão: "opção B. Mantém o código e o JSON: a Técnica no nível N custa o preço do nível N no total (5 + 5 × nível), e subir paga a diferença. Nenhum total de ficha muda. Corrija criacao-de-personagem.md:58 ... com uma frase explicando que a Proeza não acumula como Atributo e Habilidade porque o personagem compra muitas Técnicas, e não sobe uma trilha só. A recomendação "mesma convenção das Habilidades" foi do assistente, sem os números; não vale. O Efeito Especial fica como está."
- Origem: achados-duas-leituras-despacho.md:145 (Adendo 1), :11 (pedido original, item 1 superado), commit bd26f1b0
- Estado: no ar (texto); a "mesma convenção" do pedido original ficou superada pelo Adendo 1

### C-055 · Onde a Centelha começa: o Mestre escolhe pela campanha [tags: centelha, criacao, campanha, mestre]
- Data: 2026-10-02
- Decisão: "Onde a Centelha começa: o Mestre escolhe pela campanha. Texto padrão: Centelha 0 para campanha mortal; de 1 a 3 para campanha heroica. Criação, capítulo da Centelha e Leitora F2 alinhados." (corrigido no Adendo 1: a Leitora certa é a F1)
- Origem: achados-duas-leituras-despacho.md:13, :147, commit bd26f1b0 e 08f9df52 (ponte em criacao:33)
- Estado: no ar (criacao-de-personagem.md:23 e :33)

### C-056 · Virtude: a Centelha NÃO entra em teste de Virtude [tags: virtude, centelha, teste]
- Data: 2026-10-02
- Decisão: "Virtude e Centelha: a Centelha NÃO entra em teste de Virtude. Fecha o achado 16 da 119."
- Origem: achados-duas-leituras-despacho.md:14, commit bd26f1b0
- Estado: no ar (aparencia-virtudes-vontade.md; não conferido)

### C-057 · Provocação do orc: Força de Vontade × 2 + 2 × mín(Centelha, Integridade) [tags: orc, racas, defesa, mental, centelha, provocacao]
- Data: 2026-10-02
- Decisão: "Provocação do orc (racas.md:169): Força de Vontade × 2 + 2 × mín(Centelha, Integridade), como na Defesa Mental."
- Origem: achados-duas-leituras-despacho.md:15, commit bd26f1b0
- Estado: no ar (não conferido)

### C-058 · D12: critério do Atributo puro é decisão do Mestre [tags: centelha, atributo-puro, mestre, d12]
- Data: 2026-10-02
- Decisão: "O Mestre pede uma jogada de Atributo puro só quando nenhuma Habilidade do livro cobre a ação. É sempre o Mestre quem decide, e não o jogador. Se existe Habilidade que cubra, ela é pedida, e quem não a tem leva bônus 0."
- Origem: achados-duas-leituras-despacho.md:16, commit 4fca4a3f (centelha.md:44) e bd26f1b0 (D-proezas-tecnicas.md)
- Estado: no ar (centelha.md:44)

### C-059 · Botão de Atributo puro: adiado (D15) [tags: centelha, atributo-puro, ficha, pendencia]
- Data: 2026-10-02
- Decisão: "Botão de Atributo puro: sem botão por enquanto; registre como pendência. O Mestre faz a conta à mão."
- Origem: achados-duas-leituras-despacho.md:34, :79-81 (D15 ADIADO), commit bd26f1b0
- Estado: a implementar (adiado; `centelhaSoAtributo` sem chamador)

### C-060 · Golpe no sistema Normal resolve na declaração [tags: tick, golpe, normal, declaracao, combate]
- Data: 2026-10-02
- Decisão: "Golpe no sistema Normal: resolve na declaração (rola-se ao declarar), como combate.md, 'Dois sistemas de tempo'. Leitora B1." O despacho detalha: "Escreva, no Normal, que se rola ao declarar, para Leve, Média e Distância."
- Origem: achados-duas-leituras-despacho.md:19, :84-87, commits ac3b197e e 08f9df52
- Estado: no ar. A restrição "Leve, Média e Distância" foi desfeita em 08f9df52 (CORRIGE A, combate.md:106, ver C-061)

### C-061 · "Para arma Leve, Média e de Distância": restrição não decidida pelo autor, desfeita [tags: tick, golpe, normal, sem-decisao-do-autor]
- Data: 2026-10-02
- Decisão: (resumo) o autor disse só "rola-se ao declarar"; a restrição a Leve, Média e Distância veio do despacho do Arquiteto (item 6) e foi aplicada em ac3b197e. A Revisora 122 a apontou, o autor aprovou "os três CORRIGE (A, B e C)" e a CORRIGE A mandou: "tirar 'para arma Leve, Média e de Distância'; vale para todo golpe no Normal."
- Origem: achados-duas-leituras-despacho.md:84-87 e :171; commits ac3b197e (introduz), 08f9df52 (desfaz)
- Estado: sem decisão do autor (restrição desfeita; Grep de "Leve, Média" em combate.md: 0)

### C-062 · Pressão: o golpe não desconta a si mesmo [tags: guarda, pressao, defesa, combate]
- Data: 2026-10-02
- Decisão: "Pressão: o primeiro golpe bate na Defesa cheia; o golpe não desconta a si mesmo."
- Origem: achados-duas-leituras-despacho.md:20, :88-91, commit ac3b197e
- Estado: no ar (combate.md:405; código do Grid não mexido, K37)

### C-063 · Armadura na Furtividade: Circunstância é o dobro da Penalidade [tags: armadura, furtividade, circunstancia, penalidade]
- Data: 2026-10-02
- Decisão: pedido 1: "a Circunstância é a própria Penalidade, sem cobrar duas vezes". Adendo 3: "opção A. A Circunstância da armadura na Furtividade é o dobro da Penalidade (+4 nas de −2, +6 nas de −3), para toda armadura com Penalidade. Alinhe armas-e-armaduras.md:131 e acoes-sentidos-e-engano.md:81."
- Origem: achados-duas-leituras-despacho.md:21, :186 e :196, commit ad632f3f
- Estado: no ar (armas-e-armaduras.md; Grep de "dobro da Penalidade" não achou literal, não conferido)

### C-064 · Corrida: ação de 3 Ticks; a seguinte continua na Velocidade de Corrida [tags: corrida, tick, deslocamento, combate]
- Data: 2026-10-02
- Decisão: pedido 1: "Corrida: ação de 3 Ticks que recomeça." Adendo 3: "opção B. A Corrida é ação de 3 Ticks; a seguinte, declarada sem parar, continua na Velocidade de Corrida. "Recomeça" vale para a declaração e o custo. Corrija combate.md:297 com o exemplo do Kael (6 no Arranque, 9 m por Tick na Corrida)."
- Origem: achados-duas-leituras-despacho.md:22, :187 e :197, commit ad632f3f
- Estado: no ar (combate.md:300: "declara-se outra Corrida sem parar: a declaração e o custo recomeçam, m...")

### C-065 · Margem na Acumulada é só a leitura do excedente [tags: margem, acumulada, acoes, progresso]
- Data: 2026-10-02
- Decisão: "Margem na Acumulada: é só a forma de ler o excedente; não soma por cima do progresso."
- Origem: achados-duas-leituras-despacho.md:25, :100-102, commit 711b7b82 (CORRIGE C em 08f9df52 para Nadar)
- Estado: no ar. Pendência G75 em G-acoes-sistema.md: rever de uma vez todo efeito da Margem dentro da Acumulada (congelar do Esgueirar, qualidade do Ofício)

### C-066 · Erro na Acumulada perde só o que passou da faixa de 6 [tags: acumulada, erro, quase-acerto, acoes]
- Data: 2026-10-02
- Decisão: "Erro na Acumulada: perde só o que passou da faixa de 6 (espelho do Quase-Acerto)." Clareza 1 (Adendo 2): errar por exatamente 6 perde 0.
- Origem: achados-duas-leituras-despacho.md:26, :103-104 e :174, commits 711b7b82 e 08f9df52
- Estado: no ar (acoes-e-sistema.md:84)

### C-067 · Soma do excedente de cada jogada [tags: acumulada, dificuldade, acoes, excedente]
- Data: 2026-10-02
- Decisão: ""Os resultados somam além da Dificuldade" (acoes:168): soma-se o excedente de cada jogada."
- Origem: achados-duas-leituras-despacho.md:27, :105, commit 711b7b82
- Estado: no ar (acoes-e-sistema.md:168; não conferido)

### C-068 · Cura acelera 10% por nível: o intervalo encurta [tags: cura, vida, tempo, ferimento]
- Data: 2026-10-02
- Decisão: "Cura acelera 10% por nível: o intervalo encurta. Leitora F3."
- Origem: achados-duas-leituras-despacho.md:28, :106-108, commit 711b7b82
- Estado: no ar (vida-ferimentos-cura.md:90; não conferido)

### C-069 · Vontade: máximo 1 ponto por jogada ou ação, inclusive para resistir [tags: vontade, resistir, social, defesa]
- Data: 2026-10-02
- Decisão: "Vontade: o máximo de 1 ponto por jogada ou ação vale para tudo, inclusive resistir; corrija a tabela social que contradiz. Leitora E8."
- Origem: achados-duas-leituras-despacho.md:29, :109-114; alinhado em ad632f3f (aparencia-virtudes-vontade.md:115, defesas.md:104)
- Estado: no ar (relacoes-sociais.md:149 "só 1: o máximo de 1 ponto por ação ou jogada vale também para resistir") NOTA de 03/10/2026: a parte 'inclusive para resistir' foi retirada por D-001 (resistir é pagamento, fora do limite).

### C-070 · Segurar firme custa 1 ponto de Vontade (substitui afb818cc) [tags: vontade, social, resistir, margem, relacoes-sociais]
- Data: 2026-10-02
- Decisão: "Item 14, pergunta 1: opção B. Segurar firme custa 1 ponto: na Margem 0 segura de vez; com Margem 1 ou mais o alvo cede, mas o pedido chega 1 nível abaixo. Corrija relacoes-sociais.md:148-156 e o resumo de :275."
- Origem: achados-duas-leituras-despacho.md:188 e :198, commit ad632f3f
- Estado: substituída por D-001 (03/10/2026).

### C-072 · Cortejo: intervalo de 8 dias ou mais não é uma ação [tags: social, cortejo, vontade, relacoes-sociais]
- Data: 2026-10-02
- Decisão: "Item 14, pergunta 2: opção B. O intervalo do cortejo (8 dias ou mais) não é uma ação; o custo atual fica, e o capítulo explica a exceção ao '1 por ação'."
- Origem: achados-duas-leituras-despacho.md:189 e :199, commit ad632f3f (relacoes-sociais.md:276, regras.json social.modoDevagar.resistencia)
- Estado: substituída pela D-017 (2ab7da2e, 1e r6)

### C-073 · Seguir alguém: Dificuldade é o Valor Passivo do alvo [tags: valor-passivo, percepcao, esgueirar, trabalho, dificuldade]
- Data: 2026-10-02
- Decisão: "Dificuldade de seguir alguém num trabalho: o Valor Passivo do alvo (Percepção Passiva) é a Dificuldade, na cena e no preço do trabalho." Adendo 2: "Na cena, a regra do Esgueirar: Direta contra o Valor Passivo do alvo; Acumulada contra 70% dele, com a suspeita medida contra o Passivo inteiro. O preço do trabalho usa o Passivo inteiro. Corrija acoes-sentidos-e-engano.md:52."
- Origem: achados-duas-leituras-despacho.md:30, :116-119, :167, commits 711b7b82 e 08f9df52
- Estado: no ar (não conferido)

### C-074 · Suspeita no Esgueirar: 70% na Acumulada, suspeita contra o Passivo inteiro [tags: esgueirar, acumulada, valor-passivo, suspeita]
- Data: 2026-10-02
- Decisão: "Item 16 (suspeita no Esgueirar): opção B. Na Acumulada, a Dificuldade é 70% do Valor Passivo do vigia, e a suspeita é medida contra o Valor Passivo inteiro: quem avança abaixo do Passivo progride e deixa rastro ao mesmo tempo. Ajuste acoes-sentidos-e-engano.md:50, :61 e :63 ... exemplo do guarda (Passivo 10, Dificuldade 7, jogada 8: avança e cai em 'abaixo por menos de 6')."
- Origem: achados-duas-leituras-despacho.md:146 (Adendo 1), :155-156, commit 711b7b82
- Estado: no ar (não conferido)

### C-075 · Congelar o intervalo da Margem na Acumulada: fica como está, pendência G75 [tags: margem, acumulada, esgueirar, oficio, pendencia]
- Data: 2026-10-02
- Decisão: "Pergunta 1 da Revisora, 'congelar um intervalo': opção C. Fica como está, anotado como pendência, até se rever de uma vez todo efeito da Margem dentro da Acumulada (o congelar do Esgueirar, a qualidade do Ofício e o que mais houver). Liste os casos na pendência."
- Origem: achados-duas-leituras-despacho.md:166 e :176, commit 08f9df52 (G-acoes-sistema.md, G75)
- Estado: substituída pela P-01 de 03/10/2026 ("o Mestre decide"), aplicada em e7c06baa (pendência G75 fechada)

### C-076 · Mortal (Centelha 0): tem Mana (a Força de Vontade) e conjura Arte; Energia não usada [tags: mortal, centelha, mana, energia, artes, vontade]
- Data: 2026-10-02
- Decisão: "Leitora F2, decidida pelo autor (reenvio): o mortal (Centelha 0) tem Mana e pode usá-la, então conjura Artes; a Mana dele é a Força de Vontade (fórmula atual, sem mudança). Pode ter Energia, mas não a usa, porque Energia serve às Proezas e Proeza exige Centelha. Corrija centelha.md:19 e :30 e os lugares que dizem que Arte exige Centelha maior que 0."
- Origem: achados-duas-leituras-despacho.md:168 e :178-179, commit 08f9df52
- Estado: no ar no texto; no código ainda não: três lugares bloqueiam Arte ou Mana em Centelha 0 (ficha-engine.ts:176, grid.astro:3329, combate.astro:1693). Parcialmente suspensa por C-077

### C-077 · Teto de Arte do mortal: não liberar no código antes de ver os números [tags: mortal, mana, artes, centelha, teto]
- Data: 2026-10-02
- Decisão: "F2 no código: opção D. Antes de liberar, meça onde a Mana do mortal entra ... Junto, meça o custo de Mana por nível de Arte contra a Mana de um mortal (Força de Vontade de 1 a 6)... Não libere nada antes de o autor ver os números e decidir o teto de Arte do mortal."
- Origem: achados-duas-leituras-despacho.md:190-191 e :202-205, commit ad632f3f (medição, sem código)
- Estado: cumprida pela D-006 (código liberado em 7e0d0bb7)

### C-078 · Escala do desafio: de 0 a 12, nada passa de 9 exceto a Tarrasca (10); ameaça 1-6 a ajustar [tags: desafio, escala, bestiario, ameaca]
- Data: 2026-10-02
- Decisão: "A escala do desafio já está decidida pelo autor: de 0 a 12, e nada passa de 9, exceto a Tarrasca (10). O campo ameaca de 1 a 6 é o que precisa se ajustar a isso. Registre na B14, sem executar agora." E: o REC_FATOR (1,75 contra 1,32) "era da regra de Degrau, que saiu no 2e ... Não é decisão aberta".
- Origem: achados-duas-leituras-despacho.md:37-38
- Estado: a implementar (registrado em B-bestiario.md pelo Arquiteto; não executado)

## Entradas posteriores (registradas pelo Arquiteto em 03/10/2026)

### D-001 · Resistir: 1 + Margem de Vontade, teto 4, pagamento fora do limite de 1 ponto [tags: vontade, resistir, social, mental, margem]
- Data: 2026-10-03
- Decisão: "Resistir (Cap. X, e valendo também para efeito mental): 1. Depois que o ataque passou da Defesa, resistir custa 1 + Margem de Força de Vontade, com teto de 4: nenhum efeito obriga o defensor a pagar mais de 4 para resistir. Ex.: Margem 6 pediria 7; o defensor pode pagar 4 e resiste. Proezas podem cobrar mais que 4. 2. Resistir é um PAGAMENTO e fica fora do limite de 1 ponto por ação. O limite de 1 ponto por ação ou jogada (C-011) vale só para melhorar uma ação ou uma Defesa. 3. Contra efeito mental vale o mesmo: 1 + Margem (teto 4) recusa o efeito. Além disso, com Margem 1 ou mais, o alvo pode pagar só 1 ponto, e o efeito pega, mas dura um grau a menos na régua de Duração." Item 5: a frase do cortejo (relacoes-sociais.md:246, "o intervalo não é uma ação") NÃO se mexe, o autor decide depois.
- Origem: mensagem do autor de 03/10/2026 via Arquiteto; despacho docs/simulacao/caixa/resistir-despacho.md
- Estado: no ar (aplicada em a7bec31c, despacho do Resistir). Substitui C-070 (e, por tabela, C-072 fica substituída pela D-017). Restringe C-011. Reaproxima C-071 (1 + Margem), agora com teto 4.

Os itens abaixo vieram da "lista do veterana-1c" e NÃO foram despachados; vão juntos com o documento da Veterana.

### D-002 · Mana do mortal: reserva própria, valor da Vontade, recupera 1 por dia (2 descansando) [tags: mana, mortal, centelha, arte]
- Data: 2026-10-03
- Decisão: "a reserva tem o mesmo valor da Força de Vontade, mas é separada (recuperar uma não recupera a outra). Recupera 1 de Mana por dia, 2 se estiver descansando."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (texto em 0aca9c99; o valor da Vontade na mesa desde 7e0d0bb7). Toca a F2 (mortal conjura, pendência A32) e a recuperação de Mana por hora (regras.json arcano.recuperacaoMana).

### D-003 · Meditação: 1 de Mana por hora, até o nível de Meditação por dia [tags: mana, meditacao]
- Data: 2026-10-03
- Decisão: "Meditação (Habilidade secundária): 1 de Mana por hora meditando, até o nível de Meditação por dia, para todos. Substitui o '2 × Centelha por hora em meditação'."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 0aca9c99, 1e r8). Substitui a regra atual de 2 × Centelha por hora (não localizada no registro; conferir regras.json arcano.recuperacaoMana).

### D-004 · Lugares de fluxo de energia: +1, +2, +3 de Mana por hora [tags: mana, lugares]
- Data: 2026-10-03
- Decisão: "+1 de Mana por hora (mediano), +2 (muito alto), +3 (enorme e preocupante)."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 0aca9c99, 1e r8)

### D-005 · A Arte Mana não usa Centelha no cálculo [tags: mana, arte, centelha]
- Data: 2026-10-03
- Decisão: "A Arte Mana não usa Centelha no cálculo."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 0aca9c99, 1e r8; a frase "a Arte Mana não usa a Centelha em conta nenhuma" entrou em 5e32204d, 1e r9)

### D-006 · Teto do nível de Arte por Centelha [tags: arte, centelha, teto]
- Data: 2026-10-03
- Decisão: "Centelha 0 → 2; 1 → 3; 2 → 4; 3 → 5; 4, 5 e 6 → 6."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em d8f693b1 e 7e0d0bb7, Bloco D de pendências). REFINA a recebida P-04 ("Centelha + 2", provisório): a tabela é Centelha + 2 com teto 6.
- Nota do autor (04/10/2026): o mago de pouca Centelha se destaca pela AMPLITUDE (muitas Artes, rituais, preparo), e não pela profundidade; ver a D-035.
- Nota do autor (03/10/2026): o teto do nível de ARTE é Centelha + 2 (a tabela acima). O teto do nível de PROEZA continua Centelha: o portão "nível N exige Centelha >= N" (regras.json notaEscalaCentelha) vale só para Proeza. Não há conflito.

### D-007 · Tratar (0 PV ou menos) [tags: cura, tratar, estabilizar, pv]
- Data: 2026-10-03
- Decisão: "X = PV negativo, arredondando sempre para cima: superar X/2 recupera o Vigor (até 1 PV); superar X/4 segura (nada muda); igual ou abaixo de X/4 piora 1d6 PV. O nome do teste é Tratar; Estabilizar continua sendo só o do Sangramento."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 5598adeb, 1d r2)

### D-008 · Cura: identificar é Inteligência + Cura; tratamento com a mão é Raciocínio + Cura [tags: cura, inteligencia, raciocinio]
- Data: 2026-10-03
- Decisão: "identificar o mal é Inteligência + Cura (o Mestre decide se é preciso rolar). O tratamento que exige mão (sutura, osso, cirurgia, administração intravenosa) é Raciocínio + Cura. Dar um remédio para beber não pede teste. Isso substitui a decisão anterior de que todo teste de Cura é com Inteligência."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 5598adeb, 1d r2). Substitui decisão anterior, não localizada: "todo teste de Cura é com Inteligência" foi dita pelo autor e pode não estar em despacho nenhum (não consta nas partes A, B, C).

### D-009 · Arte no Tratar: +3 por nível da Arte de Cura ou +1 por nível da Vida [tags: cura, arte, mana, tratar]
- Data: 2026-10-03
- Decisão: "+3 por nível da Arte de Cura, ou +1 por nível da Vida (não somam; vale o maior). Paga-se a Mana do nível escolhido, com o desconto da Centelha (pode sair de graça). Um Efeito específico vale o que ele disser."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 5598adeb, 1d r2)

### D-010 · Ganho bruto fora das linhas de Serviços [tags: economia, renda, livre]
- Data: 2026-10-03
- Decisão: "o Livre é o da linha de Serviços com renda mais próxima; acima de 670, bruto × 35 ÷ 670."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: a implementar

### D-011 · Preço de peças: o catálogo fica; tempo × preço vai para a reconciliação de preços [tags: economia, precos, pecas]
- Data: 2026-10-03
- Decisão: "o catálogo fica; a conta tempo × preço vai para a reconciliação de preços prometida no site."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 028213ac, 1e r7 parte 1)

### D-012 · Arte dentro da Longa [tags: arte, longa, acumulada]
- Data: 2026-10-03
- Decisão: "o Efeito só conta se durar o intervalo inteiro, ou se for relançado sem falha, pagando a Mana a cada vez. Nova rolagem e bônus atado a uma rolagem só não valem na Longa."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: no ar (aplicada em 61bf02fe, 1d r3)

### D-013 · Manobra: empurrão, pegada, agarrar e dois estados [tags: manobra, agarrar, combate]
- Data: 2026-10-03
- Decisão: "empurrão de 1 m + 1 m por Margem; +3 na pegada por Margem; levantar e escapar com Velocidade 3. Para manter o agarrão, o agarrador gasta uma ação de Velocidade 6 a cada lance, ou o alvo se solta. Dois estados: Agarrado (não se desloca, mas age; é o que a rede e a Arte de prender causam) e Imobilizado (não age, só tenta escapar; só a Técnica causa)."
- Origem: conversa do autor, 03/10, lista do veterana-1c
- Estado: SUBSTITUÍDA pela D-019 (04/10/2026: o modelo novo chegou nas decisões 20 a 27 do veterana-1d). O texto acima é o antigo e não vale mais; os acréscimos abaixo foram absorvidos pela D-019.
- Acréscimos do autor (03/10/2026), para quando a Manobra vier: errar a primeira tentativa de agarrar é um erro comum de ataque, e a inversão de controle só vale com o agarrão já formado; não existe Rajada de agarrão; uma Proeza pode transformar um soco que acerta em agarrão.

### D-014 · Resistir a efeito mental: "um grau a menos" usa a régua de Duração do próprio efeito [tags: resistir, mental, duracao]
- Data: 2026-10-03
- Decisão: o autor escolheu a opção A do ponto 7 do despacho do Resistir (D-001, item 3): o "um grau a menos" conta na régua de Duração do próprio efeito (a da Arte ou a da Proeza).
- Origem: mensagem do autor via Arquiteto, 03/10/2026
- Complemento do autor (03/10/2026): se o efeito já está no menor grau da sua régua de Duração, pagar 1 ponto ANULA o efeito. Texto completo do ponto 7: com Margem 1 ou mais, pagar 1 faz o efeito mental durar um grau a menos na régua do próprio efeito (Arte Breve/Longa ou Proeza); no menor grau, anula.
- Estado: no ar (aplicada em 03c1d711, Bloco A de pendências) (despacho de 03/10/2026, junto da D-015). Complementa D-001.

### D-015 · Teto 4 do Resistir fora do cortejo; cortejo em discussão [tags: resistir, cortejo, social, teto]
- Data: 2026-10-03
- Decisão: ESCALA 2, opção B: "Tire o tetoCusto (e a tetoCustoNota) do bloco social.modoDevagar.resistencia: o teto 4 vale para o Combate Social e para o efeito mental, e o cortejo fica como estava até o autor decidir o cortejo."
- Origem: mensagem do autor via Arquiteto, 03/10/2026 (resposta à ESCALA 2 da rodada 125)
- Estado: SUBSTITUÍDA pela D-017 (04/10/2026): o autor decidiu o cortejo, e o "tirar do cortejo" do commit 03c1d711 era provisório. Foi aplicada em 03c1d711 e será desfeita na rodada 6.

### D-016 · Fôlego: sai o motor e a condição; texto do jogador corrigido; Técnicas ocultas e armas ficam [tags: folego, tecnicas, efeitos, condicoes]
- Data: 2026-10-03
- Decisão: "Bloco C (Fôlego): variante da C. 1. Sai o motor inteiro, como a Executora mapeou (capítulo, derivados, calc.ts, ficha, mesa-ficha, Grid, módulo, site.ts, coluna de equipamentos, testes). A ficha ignora o campo velho ao carregar. 2. Sai a condição "sem-folego" (condicoes.json:166). 3. Corrigir só o que o jogador vê: Efeito do afogamento (efeitos.json:5586): em vez de perder Fôlego, remete à regra de Sufocamento do capítulo Resistir ("Janela de socorro = Vigor × 20 Ticks"). Efeito "Inverno" (efeitos.json:4372): "perde Fôlego de 6 em 6 Ticks" vira "−1d6 nas ações físicas enquanto exposto". As 2 Técnicas visíveis que citam o Fôlego (segundo-folego, fechar-feridas) perdem só a frase do Fôlego. 4. As 9 Técnicas ocultas da Coração Incansável e o campo "folego" das armas e dos schemas FICAM como estão, ocultos e inertes. Registre uma pendência: decidir o destino das 9 Técnicas da Coração Incansável e do campo folego das armas (recalibração das Proezas)."
- Origem: mensagem do autor via Arquiteto, 03/10/2026 (resposta ao escopo do Bloco C, achado da Executora)
- Estado: no ar (aplicada em 66497997, Bloco C de pendências) (Bloco C do despacho da rodada). Detalha P-02.

## Recebidas em 03/10/2026 (confirmadas pelo autor no mesmo dia; ver estado de cada uma)

Rodada de pendencias abertas, texto do autor via Arquiteto. Aguardam a confirmacao do autor sobre a leitura do Arquiteto. Antes de aplicar, conferir contra as entradas acima.

- P-01 · Margem na Acumulada: "o Mestre decide"; congelar intervalo (Esgueirar) e subir qualidade (Oficio) viram exemplos. Contradiz em parte a leitura da Executora do item 10 (achados de duas leituras) e a pendencia G75. Estado: CONFIRMADA em 03/10/2026, despachada.
- P-02 · Folego: "remover direto". Autor confirmou em 03/10/2026: remover do livro e do código (a reserva inteira); a ficha IGNORA o campo velho ao carregar, para nenhuma ficha salva quebrar; avisar no commit. Estado: despachada.
- P-03 · Ataques das 38 criaturas da lista levantada: corrigir. Estado: aprovada, despachada em 03/10/2026.
- P-04 · Teto de Arte: "Nivel maximo da Arte e Centelha + 2", provisorio, para todos; mortal chega ao nivel 2; commit F2 (Mana do mortal) junto. Pode conflitar com o portao de Proeza (nivel N exige Centelha >= N, regras.json notaEscalaCentelha) e com o texto atual da Arte. Estado: CONFIRMADA e refinada pela D-006 (tabela 0→2 ... 4 a 6→6; o teto de Proeza continua Centelha, sem conflito). Despachada.
- P-05 · Recompensa: exemplo da matilha de worgs passa a DESAFIO 1. Estado: CONFIRMADA, despachada.
- P-06 · Guarda sob pressao: adiada ate fechar o combate; lacuna da renovacao da guarda para quem nao age. Estado: adiada. Relacionada a C-011 e ao item 7 dos achados de duas leituras.
- P-07 · Ataque total: "Nao existe Ataque Total no sistema. Cada ataque e separado." Estado: CONFIRMADA, despachada.
- P-08 · Dragoes: deixar como estao. Estado: sem acao.
- P-09 · Comportamento das criaturas na bancada (9a a 9f). Estado: despachada (a traducao em politica de bancada e da Executora, com tabela no relato).
- P-10 · lore/economia/ fora do repositorio publico: **bloqueado**, o build e a validacao leem de la (scripts/copiar-economia.mjs, gen-cap-economia.mjs, validate-data.mjs:922). Autor escolheu a opcao A em 03/10/2026: tirar do git so o que o build nao le; ficam a v2/ e o .procedencia.json. Despachada.
- Adiados: K37 (Grid cobra pressao pelo ataque feito e recebido), B16 (vocabulario de resistencias), topo da tabela de recompensa (desafio 4+).

## Decisões do veterana-1d (conversa do autor, 03/10, veterana-1d; e 04/10/2026)

O autor decidiu a Parte B do veterana-1c e mais alguns pontos novos. As 37 decisões estão na tabela do topo de `tmp/veterana/veterana-1d.md` (numeração do despacho da Missão 1d, citada aqui como "decisão N do 1d"). O texto final de cada ponto está na Parte A do 1d e o plano de rodadas na Parte D. Estado de todas: **a implementar**, por rodada (a numeração das rodadas é a da Parte D do 1d). Origem: conversa do autor, 03/10, veterana-1d, salvo onde está escrito 04/10.

### Decisões que repetem entradas já registradas (ligadas, sem duplicar)

| Decisão do 1d | Entrada registrada | Observação |
|---|---|---|
| 1 e 2 (Resistir 1 + Margem, teto 4, fora do limite de 1 ponto; o limite vale só para o +1d6 e o +4) | D-001 (itens 1 e 2) | no ar desde 99e97b2; o texto do Cap. III é da rodada 2 |
| 3 (efeito mental: 1 + Margem recusa; com Margem 1 ou mais paga 1 e o efeito dura um grau a menos) | D-001 (item 3) e D-014 | a parte da Proeza espera o veterana-1e (B·RESISTIR-PROEZA) |
| 5 (Mana do mortal) | D-002 | rodada 8 |
| 6 (Meditação) | D-003 | rodada 8 |
| 7 (lugares de fluxo) | D-004 | rodada 8 |
| 8 (Arte Mana sem Centelha) | D-005 | rodada 9 |
| 9 (teto de Arte) | D-006 e P-04 | no ar; sem a palavra "provisório" (rodada 8) |
| 14 (Tratar X, X/2, X/4; recupera, segura, piora) | D-007 | rodada 2 |
| 15 (identificar é Inteligência + Cura; a mão é Raciocínio + Cura) | D-008 | rodada 2 |
| 16 (Arte no Tratar) | D-009 | rodadas 2 e 9 |
| 17 (ganho bruto fora das linhas) | D-010 | rodada 7 |
| 18 (preços de peças) | D-011 | o catálogo fica; tempo x preço vai para a reconciliação de preços |
| 19 (Arte dentro da Longa) | D-012 | rodada 3 |

### D-017 · Cortejo: o teto 4 vale também por intervalo do cortejo [tags: resistir, cortejo, social, teto]
- Data: 2026-10-04
- Decisão (decisão 4 do 1d, verbatim): "Cortejo: o teto 4 vale também por intervalo do cortejo. A frase do relacoes-sociais.md:246 ("o intervalo do cortejo não é uma ação...") passa a remeter ao Resistir." Resposta do autor ao CONFLITO·CORTEJO do 1d, 04/10/2026: o "tirar do cortejo" do commit 03c1d711 era provisório. Recolocar o `tetoCusto` em `social.modoDevagar.resistencia` (regras.json), e as linhas 242 e 246 de relacoes-sociais.md passam a remeter ao Resistir. O texto final do lado A está no CONFLITO·CORTEJO do 1d (quatro trocas: fórmula, parágrafo seguinte, frase final da Vontade presa, Folha de referência).
- Origem: conversa do autor, 03/10, veterana-1d (decisão 4); confirmada em 04/10/2026
- Estado: no ar (aplicada em 2ab7da2e, 1e r6) na rodada 6. SUBSTITUI a D-015 e o item 5 da D-001. A C-072 ("o intervalo do cortejo não é uma ação") fica substituída. O `vontadePresa` não muda (a Vontade presa continua somando de um intervalo para o outro, sem teto).

### D-018 · Régua de Duração das Proezas: publicar no capítulo das Proezas [tags: proeza, duracao, regua, resistir]
- Data: 2026-10-04
- Decisão: publicar no capítulo das Proezas a régua de Duração das Proezas (`escalasProeza.parametros.duracao`, regras.json).
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em 0aca9c99, 1e r8, antes da rodada 11 prevista). Relacionada à D-014 (o "um grau a menos" do efeito mental de Proeza usa essa régua) e ao B·RESISTIR-PROEZA do 1d.

### D-019 · Manobra: o modelo novo (agarrar, manter, dano, estados) [tags: manobra, agarrar, combate, imobilizado]
- Data: 2026-10-03
- Decisão (decisões 20 a 27 do 1d, resumo da tabela): 20. Agarrar é jogada de ataque contra a Defesa de agarrão passiva; não existe Rajada de agarrão. 21. Manter o agarrão: a cada 6 Ticks; superou, igual, abaixo. 22. Dano do agarrão: 2 x Força + Centelha, Impacto, +1d6 por Margem; a Absorção conta. 23. O agarrado não age; Defesas e penalidades do agarrão. 24. Pegada de Ferro: +3 na jogada de quem controla (sem "+3 por Margem"). 25. Três estados: Preso, Agarrado, Imobilizado. 26. Deslocamento durante o agarrão: só descrição. 27. Empurrão (1 m + 1 m por Margem) e levantar-se (Velocidade 3). Acréscimos do autor de 03/10 (da D-013), absorvidos: errar a primeira tentativa de agarrar é um erro comum de ataque, e a inversão de controle só vale com o agarrão já formado; uma Proeza pode transformar um soco que acerta em agarrão.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 3dc09c71, 1e r5) (as respostas do autor sobre Imobilizado e sobre as Técnicas do Agarrão do Urso vieram: D-043 e D-045). SUBSTITUI a D-013. O ITEM 23 foi PARCIALMENTE substituído pela D-081 (corrigida em 10/10/2026), em duas partes só: (1) o "−2 contra quem ataca de fora" vira Esquiva −8 e Bloqueio −4, só contra quem está de fora; (2) o Imobilizado, que na tabela do 1e r5 era Defesa −4, passa a ter as Defesas zeradas. **Continua valendo, no item 23: o agarrado não age, não rola, e só se solta quando quem controla erra** (nada de jogada, Tick ou custo novo para o agarrado), e entre os dois do agarrão não há penalidade de ataque nem de Defesa. Os demais itens seguem.

### D-020 · Artes de mente sem projétil: Influência + Habilidade social [tags: arte, mente, social, defesa]
- Data: 2026-10-03
- Decisão (decisão 10 do 1d): Artes de mente sem projétil rolam Influência + Habilidade social do Efeito, contra a Defesa que o Efeito nomeia (17 Efeitos de controle mental); com projétil, Percepção + Acerto Arcano contra a Defesa Mental. A Habilidade social de cada um dos 17 Efeitos e o ajuste da ficha de Bram são "escolha da Veterana" (o autor aceitou).
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 0aca9c99 e 189ddfcb, 1e r8) na rodada 8 (a linha de Artes de Bram espera o veterana-1e).

### D-021 · Sustentado de Duração 1: só presença, 6 Ticks [tags: arte, sustentado, duracao]
- Data: 2026-10-03
- Decisão (decisão 11 do 1d): o Sustentado de Duração 1 vale só enquanto o conjurador mantém a presença, 6 Ticks, e fere quem estiver nela no fim.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 0aca9c99, 1e r8) na rodada 8

### D-022 · Chão Traiçoeiro [tags: arte, chao, deslocamento]
- Data: 2026-10-03
- Decisão (decisão 12 do 1d): grau x 5 para quem corre, cavalga ou luta; a metade (para cima) para quem só anda.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 5e32204d, 1e r9) na rodada 9

### D-023 · Efeitos com Ataque e uma linha de Dificuldade: frase geral [tags: arte, efeitos, dificuldade]
- Data: 2026-10-03
- Decisão (decisão 13 do 1d): frase geral nas Artes dizendo como se lê a Dificuldade dos Efeitos que têm Ataque.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 0aca9c99, 1e r8) na rodada 8

### D-024 · Quatro regras sociais: Ameaça, Chantagem, Ruptura, Rumor [tags: social, ameaca, chantagem, ruptura, rumor]
- Data: 2026-10-03
- Decisão (decisão 28 do 1d): as quatro regras entram no Cap. X; as menções soltas remetem a elas.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 2ab7da2e, 1e r6) na rodada 6

### D-025 · Controle percebido: linha na tabela de atos [tags: social, controle, ressentimento]
- Data: 2026-10-03
- Decisão (decisão 29 do 1d): linha nova na tabela de atos, "Ter sido controlado e perceber | -2"; a "inimizade" vira "ressentimento".
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 2ab7da2e, 1e r6)

### D-026 · Interrogar fica como decidido [tags: social, interrogar]
- Data: 2026-10-03
- Decisão (decisão 30 do 1d): Influência + Interrogatório contra a Defesa Social; alcance pela relação; o prisioneiro hostil só fala sob tortura (Convicção), por ato ou diante de um interrogador muito forte.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 2ab7da2e, 1e r6) na rodada 6

### D-027 · Traços do Antecedente descontam na régua pela metade, para baixo [tags: antecedente, regua, reputacao, contato, posicao, refugio]
- Data: 2026-10-03
- Decisão (decisão 31 do 1d): Reputação, Contato, Posição e Refúgio entram na régua pela metade, para baixo; vale a metade do maior traço; só o nível 6 chega a 3 passos. Sem "teto de +6" nem "+3" soltos.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em eaca41a0, 1d r1) na rodada 1. REVISA em parte A-004 ("Nível N tira N dos 3 passos") e A-005 ("mantém o teto de +6"), que estão no ar. Não substitui A-003 (o Antecedente mexe no ponto de partida da régua).

### D-028 · Máximo de cada Atributo vem da raça e vale na criação [tags: raca, atributo, criacao]
- Data: 2026-10-03
- Decisão (decisão 32 do 1d): o máximo racial de Atributo vale já na criação (elfo com Destreza 7 sem gastar o pico). Escrito em Atributos, em Centelha e em Criação.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em eaca41a0, 1d r1) na rodada 1 (a rodada 10 só confere o exemplo)

### D-029 · Elfo e Meio-Elfo: o texto da Resiliência Mental fica [tags: raca, elfo, resiliencia]
- Data: 2026-10-03
- Decisão (decisão 33 do 1d): o texto da Resiliência Mental fica como está; só a Aparência muda (A·ELFO). Portes: Anão, Meio-Elfo, Meio-Orc e Orc são Médio.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em eaca41a0, 1d r1) na rodada 1

### D-030 · Números da Quebra-Muralhas (D43) e da Esquiva Impossível (D49) [tags: proeza, d43, d49]
- Data: 2026-10-03
- Decisão (decisão 34 do 1d): valem os números da Veterana (D43: linhas 35 e 40 do Romper e a trilha de Bônus por nível; D49: Esquiva Impossível +6).
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 8704232a, 1e r11) na rodada 11

### D-031 · Engenharia é ofício de obra; só pedra é Alvenaria [tags: oficio, engenharia, alvenaria]
- Data: 2026-10-03
- Decisão (decisão 35 do 1d): Engenharia é ofício de obra (muralha, ponte, comporta); o que é só pedra (casa, torre) é Alvenaria.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 028213ac, 1e r7 parte 1) na rodada 7

### D-032 · Técnicas das fichas de exemplo: a contagem ao que existe no catálogo [tags: exemplos, tecnicas, xp]
- Data: 2026-10-03
- Decisão (decisão 36 do 1d): totais de XP dos exemplos: Kael 1065, Sora 1323, Veil 1864, Bram 1726 (o do Bram supõe cinco Artes no nível 5, que o teto da D-006 proíbe com Centelha 1: B·BRAM-TETO, espera o veterana-1e). Nota do 1d: três Técnicas das fichas pedem como pré-requisito uma Técnica que a ficha não tem (B·REQUER-EXEMPLOS).
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: substituída pela D-059 (exemplos de criação) e, no Bram, pela D-044

### D-033 · Rajada: a penalidade cresce golpe a golpe [tags: rajada, combate, defesa]
- Data: 2026-10-03
- Decisão (decisão 37 do 1d): 1º golpe sem penalidade, 2º a -1d6, 3º a -2d6; a Defesa cai 2 por golpe; a frase da Guarda sob pressão concorda.
- Origem: conversa do autor, 03/10, veterana-1d
- Estado: no ar (aplicada em 3dc09c71, 1e r5) na rodada 5. Conferir contra C-046 (múltiplos ataques só pelas regras escritas), C-047 e C-048 antes de despachar.

### Respostas do autor que chegam no veterana-1e (NÃO aplicar antes)

Imobilizado, Bram, Técnicas do Agarrão do Urso, Energia Espiritual, Vida 1, Mago de Batalha e moinho. A Veterana está montando o `veterana-1e.md`. Chegaram no 1e em 04/10 e estão registradas abaixo (D-042 a D-052). Sem registro de texto aqui por isso.

### D-034 · Decisões da Missão 1c aplicadas pelo 1d, sem texto verbatim no registro [tags: veterana, 1c, longa, iniciativa]
- Data: 2026-10-04
- Decisão: o veterana-1c aplicou 25 decisões do autor dadas na Missão 1c, e o 1d as herda ("decisão herdada", "decisão N da 1c"). O registro não tem o texto verbatim delas. As que as rodadas 1 a 3 aplicam: Longa a 3 por dado (o site e a memória do Arquiteto dizem 3,5), Especialidade +2 por nível na Longa, o Mestre escolhe entre Longa e Acumulada, a Longa gera Margem e ferimento/Desgaste só entram se durarem o intervalo inteiro, Iniciativa sem Centelha, Acelerar 10% não vale abaixo de 0 nem na linha "por dia".
- Origem: veterana-1c.md (Missão 1c, 03/10/2026) e veterana-1d.md
- Estado: no ar (Longa a 3 por dado em 61bf02fe, 1d r3; o bloco gerado de Ganhar a vida segue a 3,5, pendência G77). Longa a 3 por dado CONFIRMADA pelo autor em 04/10/2026: decisão dele de 02/10, reconfirmada em 03/10, com os efeitos aceitos (espada Comum do oficial em 11 dias, cota de malha em 14 semanas, Lamelar fechada ao oficial). Substitui a regra de 3,5 por dado (memória do Arquiteto, site de hoje). Antes de mexer em código que lê a média, a Executora me avisa. As demais decisões da 1c seguem sem verbatim.

### D-035 · O mago de Centelha mínima se destaca pela amplitude, não pela profundidade [tags: arte, teto, arquetipo, arcano, bram]
- Data: 2026-10-04
- Decisão: "arcano.astro:63, o arquétipo do mago de Centelha mínima: reescrever. O mago de pouca Centelha se destaca pela AMPLITUDE (muitas Artes, rituais, preparo), e não pela profundidade, porque o teto do nível de Arte é Centelha + 2 (Centelha 0 chega ao nível 2; Centelha 1, ao 3). Tire a promessa de Artes "tão fundas quanto as de um grande herói". Bram já foi resolvido do mesmo jeito (Artes no nível 3, total 1401), e isso chega no veterana-1e.md."
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em 2aa30250, antes da 1d r1) (commit pequeno antes da rodada 1 do veterana-1d). Consequência direta da D-006. O Bram (Artes no nível 3, total 1401) chega no veterana-1e; não aplicar antes.

### D-036 · K5a: as faixas de Vida arredondam a porcentagem para baixo [tags: vida, ferimentos, k5a]
- Data: 2026-10-04
- Decisão: "K5a (faixas de Vida): opção B. O texto passa a dizer o que o código já faz: 'arredonde a porcentagem para baixo'. Nenhum código muda."
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em 7ab6c733) (Executora, texto de Vida/ferimentos). Código (regras.json ferimentos, mesa-core.ts) intocado.

### D-037 · Morrendo vira só um marcador [tags: condicoes, morrendo, sangrando, tratar]
- Data: 2026-10-04
- Decisão: "Condição Morrendo (condicoes.json:181): opção A. Vira só um marcador ('0 PV ou menos, entre a vida e a morte; ver Tratar'). Tire o porSeisTicks; a perda de PV fica só na condição Sangrando."
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em d3ad7ca7) (Executora). Se código ou teste ler o porSeisTicks de Morrendo, parar e avisar o Arquiteto antes.

### D-038 · O mortal-tocado se destaca pela amplitude, não pela profundidade [tags: arte, teto, arquetipo, criacao, d-035]
- Data: 2026-10-04
- Decisão: "criacao-de-personagem.md:149 (mortal-tocado): reescrever como o arcano.astro:63. O mortal-tocado se destaca pela amplitude, e não pela profundidade (D-035). O Bram (:153) continua esperando o veterana-1e."
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em 5df8c7d5) (Executora). Estende a D-035 e a D-006. O Bram não se toca.

### D-039 · Arquivos sem dono: AGENTS.md, .agents/, inventario-limites.md, comerciante.md [tags: repositorio, agents, codex]
- Data: 2026-10-04
- Decisão: "AGENTS.md e .agents/: troque o AGENTS.md por duas linhas que mandam ler o CLAUDE.md, ponha o AGENTS.md no .gitignore e apague as cópias de .agents/. O autor usa o ChatGPT desktop com acesso às pastas, e ele pode ler esse arquivo. Commite o docs/calibracao/discussao/inventario-limites.md e o .claude/commands/comerciante.md onde estão."
- Origem: conversa do autor, 04/10/2026
- Estado: aplicada pelo Arquiteto em 04/10/2026.

### D-040 · Limite de criação: não existe limite próprio, e o "pico" deixa de existir [tags: criacao, limite, pico, ficha, atributo]
- Data: 2026-10-04
- Decisão: "Limite de criação (nova regra, substitui 'Atributo máximo 5, Habilidade máxima 4, com um pico de Atributo em 6 e um de Habilidade em 5'): Na criação não existe limite próprio. Valem os máximos normais da ficha: quase tudo vai até 6, e alguns traços vão até 12 (Força de Vontade, Aparência). Depois entram os ajustes raciais, para cima ou para baixo (o Atributo racial chega a 7 com +1, ou fica em 5 com −1). O 'pico' deixa de existir. A ficha fica toda desbloqueada, sem modo de criação limitante. Ajuste o texto da Criação (Passo a passo e Limites na criação) e tudo o que citar o pico ou o teto 5/4: capítulos, regras.json, glossário, e os pontos do 1d e do 1e que falam em 'pico' (o RACIAL-7, por exemplo). Confira se os quatro exemplos de criação continuam válidos."
- Origem: conversa do autor, 04/10/2026
- Estado: no ar (aplicada em 58b22ce4, antes da rodada 4) (commit próprio da Executora, antes da rodada 4). SUBSTITUI as regras anteriores de teto de criação 5/4 com pico (regras.json picoAtributo, picoHabilidade, picoQuantidade, notaPico). Consistente com a D-028 (máximo racial vale já na criação). Se código ou teste ler esses campos, parar e avisar o Arquiteto antes de mudar.

### D-041 · As "38 criaturas com ataques a corrigir": item cancelado [tags: bestiario, ataques, b14, pendencias]
- Data: 2026-10-04
- Decisão: "As '38 criaturas com ataques a corrigir' (item 3 da rodada de pendências): ninguém sabe de onde veio a lista. Cancele o item. A correção de ataques entra na revisão das criaturas da B14, que já prevê 'garras ou presas em criaturas sem braços ou presas'."
- Origem: conversa do autor, 04/10/2026
- Estado: item 3 da rodada de pendências CANCELADO; a correção de ataques fica dentro da B14.

### Decisões 38 a 48 do veterana-1e (respostas do autor entregues em 04/10/2026)

Origem de todas: "conversa do autor, 03/10 e 04/10, veterana-1e" (numeração do 1e, depois das 37 do 1d). Tabela do 1e: `tmp/veterana/veterana-1e.md`, "Decisões 38 a 48". O 1e foi conferido contra o deploy 03d5c00.

### D-042 · Cortejo fechado: vale a decisão 4 (D-017) [tags: cortejo, resistir, veterana-1e]
- Data: 2026-10-04
- Decisão (decisão 38 do 1e): CONFLITO·CORTEJO fechado: vale a decisão 4 (teto 4 por intervalo do cortejo).
- Estado: no ar (aplicada em 2ab7da2e, 1e r6) na rodada 6. Idêntica à D-017.

### D-043 · Imobilizado [tags: imobilizado, manobra, escapismo, agarrar]
- Data: 2026-10-04
- Decisão (decisão 39 do 1e): Imobilizado não age, nem com Firula; a penalidade grande só vale sem agarrão; a ordem dos estados é Preso, Agarrado, Imobilizado.
- Estado: no ar (aplicada em 3dc09c71, 1e r5, e 8704232a, 1e r11) nas rodadas 5 (ESCAPISMO-CAT, MANOBRA, ESCAPISMO, RAJADA) e 11. Complementa a D-019.

### D-044 · Bram: Artes no nível 3, total 1401 [tags: bram, arte, teto, criacao]
- Data: 2026-10-04
- Decisão (decisão 40 do 1e): Bram com as Artes no nível 3, total 1401. Já adiantada pelo autor na D-035.
- Estado: a implementar na rodada 10 (ART-26, BRAM). Aplica a D-006 e a D-035.

### D-045 · Prensa Crescente, Esmagar nos Braços e Abraço do Titã vão para a calibração [tags: proezas, tecnicas, calibracao, agarrao]
- Data: 2026-10-04
- Decisão (decisão 41 do 1e): as três Técnicas do Agarrão do Urso saem do texto de A·a4-1 e vão para a calibração das Proezas (D54, D55, D56).
- Estado: no ar (aplicada em 8704232a, 1e r11, só o texto de a4-1) na rodada 11 (só o texto de a4-1); as três não se tocam.

### D-046 · Régua de Duração das Proezas publicada no capítulo das Proezas [tags: proezas, duracao, regua]
- Data: 2026-10-04
- Decisão (decisão 42 do 1e): a régua de Duração das Proezas (escalasProeza.parametros.duracao) é publicada no capítulo das Proezas; a Proeza Resistir mental usa essa régua. É a decisão que o autor deu em 04/10 e o despacho anterior marcava para a rodada 11.
- Estado: no ar (aplicada em 0aca9c99, 1e r8) na rodada 8 (DURACAO-PROEZA antes de RESISTIR-MENTE) e na calibração.

### D-047 · Exemplos de criação: trocar as Técnicas sem pré-requisito, mantendo o XP [tags: criacao, exemplos, tecnicas, requer]
- Data: 2026-10-04
- Decisão (decisão 43 do 1e, corrigida pelo autor em 04/10): só entra Técnica SEM pré-requisito nenhum. "Se não houver equivalente, entra outra ou fica sem, e o XP é recalculado, seja qual for o total. Não some a Técnica de nível 1 que a nova pediria." Os totais "1075, 1333, 1874" que o despacho anterior citou foram erro de repasse, NÃO valem.
- Estado: regra geral C15a no ar (bf8bf608); a troca das três Técnicas ficou com a D-059 (fichas só no fim da revisão, D-053). Era: só a troca das três Técnicas (Encontrão Relâmpago, Comando Inspirador, Investida Devastadora) e o recálculo do XP. Ver D-053: o resto das fichas de exemplo não entra em rodada.

### D-048 · Manobra: as três leituras ficam [tags: manobra, agarrar, empate, derrubar]
- Data: 2026-10-04
- Decisão (decisão 44 do 1e): as três leituras da Manobra ficam (empate, Derrubar e Empurrar, primeiro acerto). Confirmação do autor em 04/10: "manter o agarrão é a ação de quem controla, rolada no Tick do Golpe" é a regra que o autor deu.
- Estado: no ar (aplicada em 3dc09c71, 1e r5) na rodada 5 (MANOBRA). Complementa a D-019.

### D-049 · Energia Espiritual fica como está, sem número [tags: energia-espiritual, meditacao, mana]
- Data: 2026-10-04
- Decisão (decisão 45 do 1e): a Energia Espiritual fica como está, sem número; sai a remissão de A·ART-41.
- Estado: no ar (aplicada em 0aca9c99, 1e r8) na rodada 8 (MEDITACAO, ART-41).

### D-050 · Vida 1 no catálogo [tags: vida, catalogo, arte, desgaste]
- Data: 2026-10-04
- Decisão (decisão 46 do 1e): Vida 1 no catálogo: "aliviar o cansaço: tira uma penalidade de Desgaste".
- Estado: no ar (aplicada em 5e32204d, 1e r9) na rodada 9 (VIDA-1).

### D-051 · Mago de Batalha: Fogo nível 4 [tags: bestiario, mago-de-batalha, b14]
- Data: 2026-10-04
- Decisão (decisão 47 do 1e): Mago de Batalha com Fogo no nível 4; nota de revisão na B14 (Parte C do 1e).
- Estado: a implementar com a revisão das criaturas (B14), fora da Parte A.

### D-052 · Moinho passa para Engenharia na tabela de obras [tags: oficio, engenharia, moinho, longa]
- Data: 2026-10-04
- Decisão (decisão 48 do 1e): o moinho passa para Engenharia na tabela de obras. Resposta do autor em 04/10: "o Requisito 3 fica".
- Estado: no ar (aplicada em 028213ac, 1e r7 parte 1) na rodada 7 (ENGENHARIA, MOINHO, T3b, LONGA-2).

### D-053 · Fichas de exemplo: só direcionamento, revisão ao fim do sistema [tags: criacao, exemplos, kael, sora, veil, bram]
- Data: 2026-10-04
- Decisao: "as fichas de exemplo (Kael, Sora, Veil, Bram) sao so um direcionamento. Depois desta correcao, nao gaste mais rodada nelas. Ficam como estiverem ate o fim da revisao do sistema, quando o autor volta a elas. Registre como pendencia (revisar as fichas de exemplo ao fim) e, se algum ponto do 1e mexer nelas alem disso, pule e anote."
- Origem: conversa do autor, 04/10/2026
- Estado: em vigor. Vale na rodada 10: so a troca das Tecnicas da D-047; os demais pontos sobre as fichas (totais de XP, Bram em 1401, contagens) sao pulados e anotados. Pendencia "revisar as fichas de exemplo ao fim" no Pendencias.md (pasta docs/pendencias).

### Respostas do autor às 12 dúvidas do veterana-1e (04/10/2026)

Origem de todas: "conversa do autor, 04/10/2026, respostas às 12 dúvidas da entrega final do veterana-1e". A dúvida e a letra escolhida vão em cada entrada.

### D-054 · Regra geral: o Grid fica congelado; o livro manda e o Grid se ajusta depois [tags: grid, congelado, pendencias, regra-geral]
- Data: 2026-10-04
- Decisão: "O Grid fica congelado. Nada no Grid muda até fecharmos todas as regras, Proezas, magias, criaturas etc. Toda divergência entre livro e Grid vai para uma lista única de pendências do Grid (crie, se não existir). O livro manda; o Grid se ajusta depois, numa passada só."
- Origem: regra geral nova do autor, 04/10/2026. Cobre a dúvida 11 (ART-35, ART-33, ART-11, ART-36 e ART-42 entram na lista).
- Estado: em vigor. Lista única: docs/pendencias/N-grid-pendencias.md. Vale para toda rodada daqui em diante: o que tocar o Grid se aplica só fora dele e se anota na lista.

### D-055 · Dúvida 1 (A): o teto 3 da Centelha cai na criação [tags: criacao, centelha, teto, mestre]
- Data: 2026-10-04
- Decisão: "Cai. A ficha básica não tem restrição; quem informa as restrições da campanha aos jogadores é o Mestre. Deixe isso dito no texto da Criação."
- Origem: conversa do autor, 04/10/2026, dúvida 1, opção A
- Estado: no ar (aplicada em bd041499, r12). Estende a D-040 (sem limite próprio na criação).

### D-056 · Dúvida 2 (A): cai o teto 3 de Recursos e Artefato nos Antecedentes [tags: antecedentes, recursos, artefato, teto, ficha]
- Data: 2026-10-04
- Decisão: "Cai o campo 'tetoCriacao', o aviso da ficha (ficha-engine.ts:2410-2418) e os três trechos do texto. Mesmo princípio da 1: quem limita é o Mestre."
- Origem: conversa do autor, 04/10/2026, dúvida 2, opção A
- Estado: no ar (aplicada em bd041499, r12). Estende a D-040.

### D-057 · Dúvida 3: Desarmado vira duas armas, Punhos e Chutes [tags: desarmado, punhos, chutes, armas, defesa, k4a]
- Data: 2026-10-04
- Decisão: "A linha 'Desarmado' é substituída por duas armas. Punhos: arma leve (Velocidade 5), P 0 / G 1 / R 4. Acerto +1, Defesa +1, dano 1d6−2 + Força. Chutes: arma média (Velocidade 6), P 1 / G 1 / R 3. Acerto +0, Defesa −1, dano 1d6 + Força. Defesa: o jogador escolhe com que arma defende (pernas, mãos, objeto ou arma que tenha nas mãos). Pode chutar e depois defender com as mãos, ou o contrário. Defender com as pernas é mais difícil (o −1). Mão nua contra arma cortante ou perfurante: não defende. Se tentar, toma o dano inteiro mesmo com a defesa bem-sucedida. Contra contundente e contra ataque desarmado, defende normalmente."
- Origem: conversa do autor, 04/10/2026, dúvida 3 (resposta livre, nem A nem B nem C)
- Estado: no ar (aplicada em 2dc330a2, r13; os Chutes como arma foram substituídos pela D-067 na rodada 14), DEPOIS do relato das três conferências que o autor pediu (as outras armas somam Força ao dano; o livro já tem regra de escolher com que arma defender; existe esquiva separada da defesa com arma). SUBSTITUI a C-029 (+1/+1) e o +0/+0 do 1e (K4a, item e). A Proeza "punho como arma média" da C-029 continua a implementar à parte. A mesa lê armas.json: aplicar só fora do Grid e anotar a pendência. Complementada pela D-065 (05/10/2026): ids, lâmina contra qualquer parte do corpo e escolha da arma no Bloqueio. O P/G/R dos Punhos (P 0 / G 1 / R 4) foi SUBSTITUÍDO pela D-082 (10/10/2026): 1/1/3. A frase "Mão nua contra arma cortante ou perfurante: não defende... Contra contundente e contra ataque desarmado, defende normalmente" foi SUBSTITUÍDA pela D-088 (10/10/2026, decisão final do autor): a mão nua não bloqueia o dano de nenhuma arma (cortante, perfurante ou contundente), só tira a Margem; contra ataque desarmado o Bloqueio com as mãos continua parando tudo.

### D-058 · Dúvida 4 (C): Ganhar a vida fica como está até decidir o modelo de economia [tags: economia, renda, servicos, modelo]
- Data: 2026-10-04
- Decisão: "Fica como está até decidir o modelo de economia."
- Origem: conversa do autor, 04/10/2026, dúvida 4, opção C
- Estado: em vigor. A parte 2 da rodada 7 (SERVICOS, REQUISITO-FAIXA, RENDA-1, GANHO-BRUTO, TETO) fica segurada. Consistente com a D-010 e a D-011.

### D-059 · Dúvidas 5 e 12 (A e B): as fichas ficam sem a Técnica; a aplicação espera o fim da revisão [tags: criacao, exemplos, tecnicas, d-047, kael, sora, veil, bram]
- Data: 2026-10-04
- Decisão: dúvida 5, A: "As fichas ficam sem a Técnica (Kael 1045, Sora 1303, Veil 1844). Se aplicar isso nas fichas agora conflitar com a D-053 (fichas de exemplo só no fim da revisão), registre a regra e me pergunte antes de mexer nas fichas." Dúvida 12, B: "Esperar o fim da revisão (D-053)."
- Origem: conversa do autor, 04/10/2026, dúvidas 5 e 12
- Estado: a regra está registrada, e as fichas NÃO se tocam agora (D-053 vale). O Arquiteto pergunta ao autor antes de mexer nelas, ao fim da revisão. Complementa a D-047 e confirma a D-053. Bram continua com a lembrança do corte para Artes no nível 3 (D-044, total 1401).

### D-060 · Dúvida 6 (A): a Dificuldade da Arte vale "maior grau investido × 5" [tags: artes, dificuldade, art-37, c-025, centelha]
- Data: 2026-10-04
- Decisão: "Vale o 1e ('maior grau investido × 5'), e a C-025 é substituída."
- Origem: conversa do autor, 04/10/2026, dúvida 6, opção A
- Estado: no ar (aplicada em bd041499, r12, menos a Chamar à Mão: N8 da lista do Grid) (ART-37, Dissipar, Mãos sobre a Multidão, Chamar à Mão, a linha "× 5" do ATAQUE-DIF, e reler o Chão Traiçoeiro). SUBSTITUI a C-025. Consistente com a D-022.

### D-061 · Dúvida 7 (C): ART-34, ART-5, ART-38 e ART-40 ficam para a recalibração das Artes; o Mago de Batalha continua em Fogo 4 [tags: artes, recalibracao, bola-de-fogo, mago-de-batalha, b14]
- Data: 2026-10-04
- Decisão: "Os quatro ficam para a recalibração das Artes. 7b: O Mago de Batalha continua em Fogo 4. Registre que o Efeito Bola de Fogo (ART-38) entra na recalibração das Artes ANTES das fichas de exemplo. É uma dependência de ordem entre as duas tarefas."
- Origem: conversa do autor, 04/10/2026, dúvida 7, opção C, e nota 7b
- Estado: em vigor. Ordem: recalibração das Artes (com a Bola de Fogo) ANTES da revisão das fichas de exemplo. Confirma a D-051.

### D-062 · Dúvida 8: Acelerar a Cura segue a escala dos dias, com +1 por nível no Tratar [tags: vida, acelerar-a-cura, tratar, art-47]
- Data: 2026-10-04
- Decisão: "Nem A nem B. O livro segue o que já decidi: a Vida apressa a recuperação, na escala dos dias, e no Tratar dá +1 por nível. Corrigir o texto do Efeito para isso. A diferença com o Grid (1 PV por nível) vai para a pendência do Grid."
- Origem: conversa do autor, 04/10/2026, dúvida 8 (resposta livre)
- Estado: no ar (aplicada em bd041499, r12). Consistente com a D-009 (+1 por nível da Vida no Tratar). A diferença com o Grid vai para N-grid-pendencias.md (D-054).

### D-063 · Dúvida 9 (A): Vento 3 fica cortante, com dano [tags: artes, vento, art-45, art-20]
- Data: 2026-10-04
- Decisão: "Fica cortante, com dano (ART-45). O ART-20 (rajada que derruba) é descartado."
- Origem: conversa do autor, 04/10/2026, dúvida 9, opção A
- Estado: o texto da rodada 8 já está assim. O ART-20 fica descartado.

### D-064 · Dúvida 10 (C): as condições da mesa ficam como estão; vão para a pendência do Grid e da mesa [tags: condicoes, mesa, agarrao, preso, imobilizado, grid]
- Data: 2026-10-04
- Decisão: "Fica como está. Registre na pendência do Grid/mesa: condicoes.json:19-21 (Imobilizado age com penalidade, contra a D-043), Preso inexistente, Agarrado (:25), Caído (:15, contra Velocidade 3) e a Prisão em gen-grid-artes.mjs:248."
- Origem: conversa do autor, 04/10/2026, dúvida 10, opção C
- Estado: em vigor. Os cinco itens vão para N-grid-pendencias.md (D-054). Não contradiz a D-043: o livro manda, a mesa se ajusta depois.

### D-065 · Desarmado, complemento da D-057: ids, lâmina contra o corpo e como o Bloqueio escolhe a arma [tags: desarmado, punhos, chutes, bloqueio, defesa, ficha, k4a]
- Data: 2026-10-05
- Decisão: "1. Id: A. 'desarmado' passa a ser Punhos (mesmos números de hoje: leve, 5 Ticks, P 0 / G 1 / R 4, Acerto +1, Defesa +1, 1d6−2 + Força; o nome na tela muda para 'Punhos'). 'chutes' entra como arma nova: média, 6 Ticks, P 1 / G 1 / R 3, Acerto +0, Defesa −1, 1d6 + Força. Nenhum id some, então ficha salva, mesa e Grid não quebram. 2. Lâmina contra o corpo: vale para qualquer parte do corpo. Quem Bloqueia sem arma um ataque cortante ou perfurante recebe o dano normalmente. A Esquiva não é afetada (segue a regra da melhor das duas, combate.md:265-270). 3. Como o Bloqueio escolhe a arma de defesa: Na hora de defender, o personagem usa as armas e escudos que tem nas mãos, e eles somam (dois escudos, os dois contam), como já acontece com a mão inábil. O corpo só defende quando nada nas mãos é usado. Arma ou escudo e corpo não somam. Partes do corpo: só os dois punhos somam entre si (+1 cada, +2 com as duas mãos livres). Punhos e Chutes não somam. Chutes (−1) é a opção quando as mãos não podem ser usadas (por exemplo, amarradas). A ficha mostra o Bloqueio com a melhor combinação disponível. Quem muda a escolha é a situação, e o Mestre ajusta. 4. COMO ESCREVER: só descreva a regra da luta desarmada, ou seja, como são os golpes (Punhos e Chutes) e as defesas sem arma. Não detalhe casos nem crie tabela de situações: o Mestre julga quando o jogador decidir usar. Texto curto, no Cap. XIII, com remissão em defesas.md e combate.md."
- Origem: conversa do autor, 05/10/2026, respostas após o relato da Executora sobre o Desarmado
- Estado: no ar (aplicada em 2dc330a2, r13; os itens 1 e 3 na parte dos Chutes foram substituídos pela D-067 na rodada 14). Complementa a D-057 (que substitui a C-029 e o K4a). A lâmina contra o corpo esclarece a D-057 ("mão nua") para qualquer parte do corpo. A mesa e o Grid não mudam (D-054); as diferenças vão para N-grid-pendencias.md. CORREÇÃO do autor em 05/10/2026 (dúvida 13, A): os Chutes são Velocidade 6 e R 4, como manda a régua; o "R 3" do texto acima e da D-057 foi erro de digitação. O P/G/R dos Punhos no item 1 ("P 0 / G 1 / R 4") foi SUBSTITUÍDO pela D-082 (10/10/2026): 1/1/3, Velocidade 5. O item 2 (lâmina) foi SUBSTITUÍDO pela D-088 (10/10/2026, decisão final do autor): a mão nua não bloqueia o dano de nenhuma arma, seja cortante, perfurante ou contundente, e a Margem é o que o Bloqueio tira (texto na rodada 4b). O item 3 (arma ou escudo e corpo não somam; só os dois punhos somam entre si) CONTINUA e decide a dupla mista (arma numa mão, punho na outra): vale o maior dos dois.

### D-066 · Armas naturais: criaturas bloqueiam e se defendem com elas [tags: armas-naturais, bloqueio, desarmado, criaturas, b14, bestiario]
- Data: 2026-10-05
- Decisão: "A regra 'bloquear sem arma um ataque cortante ou perfurante faz receber o dano normalmente' vale só para quem não tem armas naturais no corpo. A maior parte das criaturas com armas naturais (garras, chifres, carapaça, corpo de pedra ou ferro etc.) ataca com elas e também se defende com elas, mesmo sendo ataques desarmados. Padrão para criaturas: quase todas podem bloquear sem tomar dano. O Mestre julga os casos em que o ataque bloqueado causa dano mesmo assim. Escrever no mesmo tom da seção 'Luta desarmada': descritivo, curto, sem tabela de casos. Uma linha na própria seção do Cap. XIII e, quando chegarmos às criaturas (B14), uma linha na abertura do bestiário. Por ora, registre a linha do bestiário como pendência da B14. Golens: a fixação de Golem de Ferro e Golem de Pedra como médios (N20) fica como está; anote na B14 que o ataque e a defesa deles serão revistos com a regra das armas naturais."
- Origem: conversa do autor, 05/10/2026, junto da resposta à dúvida 13
- Estado: parcial: a linha do Cap. XIII está no ar (2dc330a2, r13); a linha do bestiário e a revisão dos golens ficam na B14. Complementa a D-065 (item 2). A conferência de linhagens, origens, Artes, Técnicas e Proezas que dão arma natural a personagem jogável é só relato; o autor decide depois.


### D-067 · Chutes saem das armas e da ficha: viram só regra de texto [tags: chutes, desarmado, armas, ficha, luta-desarmada]
- Data: 2026-10-05
- Decisão: "O chute não é arma de equipamento. Remover 'chutes' do armas.json, da ficha (incluindo a lógica do Bloqueio que trata Chutes na mão inábil) e do teste de contrato. Ele nunca esteve na mesa nem no Grid; se houver item na N-grid-pendencias.md sobre 'Chutes ausente na mesa/Grid', retire. Os Punhos ficam como estão na ficha (id 'desarmado'), como opção para quem escolhe lutar desarmado. O chute vira só regra de texto, na seção 'Luta desarmada' do Cap. XIII, para o Mestre consultar quando um jogador quiser chutar: média, Velocidade 6, Acerto +0, Defesa −1, dano 1d6 + Força. Pode ser feito mesmo com armas nas mãos, e gasta a própria ação como qualquer golpe. Defender com as pernas (−1) continua valendo quando as mãos não podem ser usadas. Antes de remover, confira se 'chutes' é lido em algum outro lugar além dos que você já listou. Se for, avise."
- Origem: conversa do autor, 05/10/2026, respostas sobre Chutes, armas naturais e manutenção, item 1
- Estado: no ar (rodada 14, e462681a; veredito 150 da Revisora: PROCEDE, 10/10/2026). SUBSTITUI, no que toca ao id `chutes` como arma e à lógica de Chutes no Bloqueio da ficha, a D-057 (Chutes como arma) e a D-065 itens 1 e 3 (parte dos Chutes). Os Punhos (D-057, D-065) e as demais regras da D-065 continuam.

### D-068 · Regra geral: nada dá ataque extra sem dizer explicitamente [tags: combate, ataque-extra, armas-naturais, opcoes-de-ataque]
- Data: 2026-10-05
- Decisão: "Nada dá ataque extra se não disser explicitamente que dá. Ter várias armas, ou partes do corpo que servem de arma, é ter opções de ataque, não ataques a mais. Exemplo para o texto: um gato pode atacar com qualquer das quatro patas ou com a mordida, e isso não lhe dá ataques extras. Escreva em combate.md, onde fala de ações de ataque."
- Origem: conversa do autor, 05/10/2026, item 2
- Estado: **NO AR na rodada 4b (8a7a6eb0, 0dcb1e56, cda8845d; veredito 153 PROCEDE) e 4b-bis (2ef4f5b8; veredito 154 PROCEDE), CI verde em 2ef4f5b8; liberada pelo autor em 10/10/2026.** (Histórico: até a 4b o parágrafo NÃO estava em `combate.md`: o parágrafo entrou em e462681a e foi retirado em 0fab8b13, "até o autor decidir"; veredito 150 confirma que `combate.md` voltou byte a byte ao texto de antes). **Texto liberado, o da Executora de e462681a, como estava:** "Nada dá ataque extra sem dizer que dá... Os golpes a mais são os que uma regra dá pelo nome, como a Rajada e a empunhadura dupla, abaixo." Responde o item 19 da veterana-2. A exceção explícita que a D-068 pedia para a empunhadura dupla com os dois Punhos está dada na cláusula da D-083 (10/10/2026): só as mãos fazem par; chute, mordida, cauda e patas de animal seguem a D-068 (opções, não par). Hoje a ficha oferece DOIS ataques com Punhos/Punhos (a:desarmado entra como arma e a dupla monta a mão inábil), o que a cláusula da D-083 agora autoriza.

### D-069 · Armas naturais: Garra e Presa, Forma Bestial e Pele de Pedra (complemento da D-066) [tags: armas-naturais, metamorfose, forma-bestial, pele-de-pedra, bloqueio]
- Data: 2026-10-05
- Decisão: "Arte Metamorfose 1, 'Garra e Presa' (artes.json:1956-1962), e Técnica Forma Bestial (tecnicas.json:2341): as garras contam como arma natural enquanto durarem e defendem como armas. Proeza Pele de Pedra (caminhos.json): a partir do nível 2, conta como arma natural para bloquear golpes com o corpo. Os níveis 1 a 4 continuam com o que já dão (Absorção etc.). O nível 1 não bloqueia. O Efeito Pele de Pedra (efeitos.json:1131) e o Efeito Arma Conjurada (efeitos.json:519) não mudam."
- Origem: conversa do autor, 05/10/2026, item 3
- Estado: no ar (rodada 14, e462681a; veredito 150: PROCEDE, só texto). Complementa a D-066 e a D-065 item 2.

### D-070 · Mão que conta como arma bloqueia armas e soma com outras armas na defesa [tags: mao-de-ferro, punho, bloqueio, arma, lamina]
- Data: 2026-10-05
- Decisão: "Regra geral: sempre que uma mão contar como arma (ex.: Mão de Ferro N1, tecnicas.json:268; Punho que Parte Pedra N4), ela pode bloquear ataques de armas, inclusive cortantes e perfurantes, a não ser que a Proeza ou a magia diga o contrário. E, por contar como arma, soma com outras armas na defesa. Aplique no texto (Luta desarmada e na descrição das duas Técnicas, se precisar de ajuste). Na ficha, só aplique se ela já calcula o efeito da Mão de Ferro; se não calcula, não crie cálculo novo, só me avise."
- Origem: conversa do autor, 05/10/2026, item 4
- Estado: no ar (rodada 14, e462681a; veredito 150: PROCEDE; só texto, a ficha não calcula a Mão de Ferro, conferido). Complementa a D-065 (item 2). Sugestão da Revisora, ainda sem dono: o Punho que Parte Pedra (N4) não diz que as mãos contam como arma; frase possível "Suas mãos contam como arma (veja Luta desarmada)".

### D-071 · test-grid desligado do Validar; religa na passada única do Grid [tags: grid, ci, test-grid, flake, aquece]
- Data: 2026-10-05
- Decisão: "Não é para testar o Grid agora. Desligue o test-grid do Validar (desligar, não apagar), para o flake '[aquece]' parar de travar as rodadas. Registre na N-grid-pendencias.md que a passada única do Grid começa religando esse teste e conferindo o que quebrou com as mudanças do livro nos dados compartilhados (armas.json, condicoes.json etc.)."
- Origem: conversa do autor, 05/10/2026, item 5
- Estado: no ar (rodada 14, e462681a; veredito 150: PROCEDE; o test-grid foi desligado sem apagar, N21). Consistente com a D-054.

## Distância, precisão, Defesa e porte (veterana-2f e adendo do autor, 09/10/2026)

Fonte das entradas D-072 a D-082: `veterana-2f-distancia-e-precisao.md` (cópia nesta pasta, com cabeçalho de
correções; "2f" abaixo, com a seção), tudo o que ele marca [autor], mais o `adendo-2f.md` (nesta pasta; "adendo,
item N"). O 2f substitui o 2e, o 2d e o 2c da Veterana. Nada foi editado no livro, nos dados nem no site: os
textos esperam as rodadas da D-080. Todas seguem a D-054: o Grid e a mesa não mudam, e as diferenças vão para
`N-grid-pendencias.md` quando os dados mudarem. A D-081 e a D-082 vieram depois das D-072 a D-080, em respostas
do autor (09 e 10/10/2026) a conflitos com decisões vivas (D-019, item 23; K15); a D-081 foi corrigida em
10/10/2026. As D-083 a D-087 são do despacho do autor de 10/10/2026 (Rajada e dupla no P/G/R, a Arte no Tick do
Golpe, o preço da Plumbata, "Sem equilíbrio" × Caído e o Princípio do Mestre).
**Conflito resolvido em 10/10/2026:** a empunhadura dupla com os dois Punhos (cláusula da D-083) é a exceção explícita à D-068, que o autor liberou; as duas entram na rodada 4b. A D-088 (Bloqueio desarmado contra arma, regra do autor registrada em 10/10/2026) também entra na 4b; o autor fechou a decisão final em 10/10/2026 (punhos não bloqueiam o dano de nenhuma arma sem aprovação do Mestre) e descartou a leitura c) (dupla mista, vale a D-065 item 3).

### D-072 · Distância Efetiva por arma e penalidade de precisão incremental, sem teto [tags: distancia, efetiva, precisao, arremesso, arco, besta]
- Data: 2026-10-09
- Decisão (2f §1 itens 1, 2 e 5; §3; §4; §12; [autor]): "A Distância Efetiva (sem penalidade de acerto) é um número por arma, para alvo Médio, independente do personagem. Além dela, −3 por meia Efetiva, incremental, sem teto, sem 'zona de sorte'. A Efetiva é sempre par." A conta: com E a Efetiva da arma e d a distância ao alvo, se d ≤ E não há penalidade; se d > E, n = ⌈(d − E) ÷ (E ÷ 2)⌉ incrementos e a penalidade é −3 × n no acerto. Critério do autor: a distância em que o personagem, ao tentar acertar, usa todas as suas capacidades sem a distância atrapalhar. A Efetiva pode ser maior que a Máxima, e o personagem joga sempre sem penalidade. Rejeitada a penalidade com teto de −12 e zona de sorte: "O que determina se é sorte é quando a jogada tem poucas chances de acertar. Uma pessoa com muitos dados, especialidade, artefato, Proezas e magias consegue contornar as penalidades. Vamos aumentar até ficar quase proibitivo." As tabelas contra Defesa 0 descrevem só alvo parado; alvo em movimento a grande distância deve ser quase impossível de acertar sem magia ou Proeza. Descartado: Efetiva = Destreza + Arremesso (função do personagem). O propulsor não muda a Efetiva. Efetivas em metros (entre parênteses, o incremento): Mini-faca 8 (4) · Kunai 8 (4) · Shuriken 10 (5) · Adaga de Arremesso 10 (5) · Machado de Arremesso 12 (6) · Pilum 12 (6) · Plumbata 14 (7) · Azagaia 16 (8) · Boleadeira 16 (8) · Bumerangue de caça 16 (8) · Bumerangue de retorno 20 (10) · Rede 4 (2) · Funda 26 (13) · Arco Curto 30 (15) · Arco Longo 50 (25) · Arco Composto 70 (35) · Besta Pequena 40 (20) · Besta Média 60 (30) · Besta Grande 80 (40).
- Origem: conversa do autor com a Veterana, 06 a 09/10/2026, fechada no 2f
- Estado: **NO AR no livro, nos dados e na ficha** (rodada 1, f3d52086 e 0dcf5788, vereditos 147 e 148; rodadas 2 e 3, 5c4bb201, 53574bf0 e 9bd51dd3, vereditos 149 e 151; rodada 4a, 83d84cf5 e 6628d27b, vereditos 152 e 153; a ficha pela rodada 4d): a Efetiva por arma no catálogo e a penalidade de −3 por meia Efetiva em `combate.md`, `armas-e-armaduras.md`, `acoes-corpo-e-movimento.md`, `/equipamentos` e `regras.json`. O Grid segue a régua velha (N22). Histórico do estado: a implementar nos textos e nos dados quando o autor autorizar o plano de rodadas (D-080); a coluna "Distância" do catálogo vira "Efetiva". Responde à parte da A-028 que ficou com o autor (I12): a distância do catálogo passa a ser a Efetiva por arma, e a Máxima do arremesso vem do FAA e do peso (D-074). Para testar nas simulações: `fase-de-testes.md` (T3).

### D-073 · Tempo de voo [tags: tempo-de-voo, tick, pgr, distancia, guarda-sob-pressao, normal]
- Data: 2026-10-09
- Decisão (2f §3.1 e §1 item 3; adendo, itens 2 e 6; [autor]): "Até a Distância Efetiva, o projétil chega no mesmo Tick do Golpe. Cada incremento além da Efetiva soma 1 Tick entre o Golpe e a chegada ao alvo, o mesmo n que dá a penalidade: −3 por incremento = +1 Tick por incremento. O alvo se defende no Tick em que o projétil chega." Exemplos do 2f: faca a 25 m (E 10): n = 3, −9, chega 3 Ticks depois; Arco Longo a 150 m (E 50): n = 4, −12, +4 Ticks; Arco Longo na Máxima de 250 m: n = 8, −24, +8 Ticks. Adendo, item 2: (a) o ataque é rolado no Golpe e vale contra a Defesa do alvo no Tick da chegada (registrar para testar nas simulações); (b) a distância que vale é a do Golpe: penalidade e tempo de voo ficam fixos no disparo, e se o alvo sair da linha antes da chegada o Mestre decide se escapou; (c) na Guarda sob pressão, o ataque conta como "recebido" no Tick da chegada; (d) o sistema Normal não tem tempo de voo (o tiro continua rolado na declaração), e favorecer quem atira de longe é aceito, porque o padrão de equilíbrio é o P/G/R; (e) não há conflito com a Rajada, que é só corpo a corpo; (f) aliado, cobertura ou terreno que entra na linha durante o voo: o Mestre decide. O bumerangue de retorno volta no mesmo número de Ticks que levou para ir; até a Efetiva, a ida leva 0 Ticks e a volta também (a arma está na mão no fim do Golpe) (adendo, item 6).
- Origem: 2f §3.1; adendo, itens 2 e 6
- Estado: **NO AR no livro desde a rodada 4a** (83d84cf5 e 6628d27b; vereditos 152 e 153): o tempo de voo, a Defesa no Tick da chegada, o recebido da Guarda sob pressão na chegada e a menção no Normal, em `combate.md`. O Grid não tem tempo de voo (N22). Histórico do estado: a implementar (texto do Combate, P/G/R e menção no Normal). Complementa a C-047 (o recebido da Guarda sob pressão passa a contar na chegada) e não toca a C-048. Não tratado pelo autor: tempo de voo com empunhadura dupla de armas de arremesso (uma por mão). Para testar nas simulações: `fase-de-testes.md` (T1). O harness não modela alcance nem posição (H7 em H-arremesso.md), então o teste depende de modelar isso primeiro.

### D-074 · Máxima do arremesso, Funda e atlatl [tags: maxima, arremesso, funda, atlatl, faa, peso]
- Data: 2026-10-09
- Decisão (2f §5.1, §5.2, §6, §1 itens 4 e 6; adendo, item 11; [autor]): a fórmula do site para a Distância Máxima do arremesso fica (FAA = Força × 2 + Atletismo + Arremesso; Máxima = 7 × FAA^0,7 ÷ peso^0,4, com o peso em kg; só se arremessa o que cabe na coluna "Arremessa até" do FAH; a partir de 80% desse teto cai em linha reta até 0). A tabela de Arremesso ganha uma coluna "Peso" (pesos do 2f §6 e §10, aceitos pelo autor). A regra do site "para mirar bem, conte com algo em torno de metade" passa a valer só como teto; a distância sem penalidade é a Efetiva (D-072). **Funda:** multiplica a Máxima final por ×2 (calcula-se a Máxima normal e dobra-se); pedra de 100 g; dano 1d6, Impacto, Força inteira; substitui os 200 m do site e os 100 m fixos da reforma P/G/R. **Atlatl:** item extra, não arma; funciona só com a azagaia (a Plumbata se lança à mão e não usa atlatl); na arma lançada, ×2 na Máxima final, +1× Força no dano (a azagaia, que somava 1× Força, passa a somar 2× Força) e +2 no Preparo (azagaia com atlatl: P5/G1/R2, Velocidade 8); usa 1 mão, a mesma que lança; não muda a Efetiva. Adendo, item 11: a exposição maior (Velocidade 8) é o preço aceito pelo +2 na Preparação.
- Origem: 2f §5; adendo, item 11
- Estado: **NO AR no livro e nos dados** (rodada 1, f3d52086 e 0dcf5788, vereditos 147 e 148; rodadas 2 e 3, 5c4bb201, 53574bf0 e 9bd51dd3, vereditos 149 e 151): a coluna Peso, a Máxima pelo FAA e pelo peso, a Funda ×2 e o atlatl em `armas-e-armaduras.md`, `acoes-corpo-e-movimento.md`, `armas.json`, `armas-extras.json` e `regras.json`. Histórico do estado: a implementar (textos; ver D-080). Responde à parte da Funda do H3 e deixa a fórmula do H1 mantida (as notas de `docs/pendencias/H-arremesso.md` não foram editadas).

### D-075 · Arcos e bestas: Máxima por Força, Força máxima do arco, classes e preço [tags: arco, besta, forca, maxima, preco, pgr]
- Data: 2026-10-09
- Decisão (2f §5.3, §2, §11; adendo, item 3; [autor]): a Máxima dos arcos sai de uma tabela pela Força no arco. Força no arco = o menor valor entre a Força do personagem e a Força máxima do arco. Arco Curto: 50 · 90 · 120 · 140 · 155 · 170 · 180 · 190 m para Força 1 a 8. Arco Longo: 100 · 180 · 250 · 295 · 325 · 350 · 370 · 390 m. Arco Composto: 120 · 215 · 300 · 355 · 390 · 420 · 445 · 465 m. Bestas não usam Força, com Máxima tabelada: Pequena 100 m, Média 200 m, Grande 300 m. Só o Arco Curto tem Força máxima padrão (3); existem Curtos reforçados, com Força máxima maior e mais caros; o Longo e o Composto não têm Força máxima por padrão, e neles a Força no arco é a Força do personagem. Força acima de 8 conta como 8, no alcance E no dano (adendo, item 3). Força mínima = Força máxima do arco − 3, só nos arcos que têm Força máxima definida (reforçados, de criatura); quem não tem não consegue armar. A mesma Força no arco limita o bônus de Força no dano. A Máxima maior do Composto em qualquer Força é intencional. A Efetiva não depende da Força do arqueiro. Classes (da reforma de P/G/R): Arco Curto 4/1/1, Velocidade 6; Arco Longo e Arco Composto 4/1/2, Velocidade 7; Bestas Pequena, Média e Grande P7/G1/R1, P9/G1/R2 e P12/G1/R2, Velocidades 9, 12 e 15. Preço do arco: varia pelos três botões que ele dá, Distância Efetiva, Distância Máxima e Força máxima; os valores ficam para o modelo de economia.
- Origem: 2f §5.3, §2 e §11; adendo, item 3
- Estado: **NO AR no livro e nos dados** (rodada 1, vereditos 147 e 148: a tabela de Máxima por Força, as Máximas das bestas e a Força máxima do Curto; rodada 2, vereditos 149 e 151: o capítulo; rodada 4a, vereditos 152 e 153: as classes P/G/R do tiro e "Força acima de 8 conta como 8" no alcance e no dano). Os preços dos arcos seguem com o modelo de economia. Histórico do estado: a implementar (textos e dados; ver D-080). Responde ao H6 de `docs/pendencias/H-arremesso.md` no ponto da Força máxima do Curto (3, como o `armas.json`); o H5 (Arco de Guerra) segue aberto. A tabela de preços dos arcos espera o modelo de economia.

### D-076 · Catálogo de Arremesso: Plumbata no lugar dos Dardos, dois bumerangues, Boleadeira, Rede e as leves [tags: arremesso, plumbata, bumerangue, boleadeira, rede, catalogo, dardos]
- Data: 2026-10-09
- Decisão (2f §9, §10, §12; adendo, itens 5 e 6; [autor]): a linha **Dardos sai e a Plumbata entra** ("Dardo olímpico não existe neste mundo."). Tabela de Arremesso (classe P/G/R · Velocidade · dano, todos + Força · Acerto · Efetiva · peso): Shuriken, leve 2/1/1 · V4 · 1d6−4 · +1 · 10 m · 50 g; Mini-faca, leve 2/1/1 · V4 · 1d6−4 · +1 · 8 m · 100 g; Kunai, leve 2/1/1 · V4 · 1d6−4 · +1 · 8 m · 150 g; Adaga de Arremesso, média 3/1/1 · V5 · 1d6−2 · +1 · 10 m · 250 g; Plumbata, média 3/1/1 · V5 · 1d6−2 · +0 · 14 m · 200 g, Perfurante N1 (fura couro), munição; Bumerangue de retorno, média 3/1/1 · V5 · 1d6−2 · +1 · 20 m · 300 g; Bumerangue de caça, pesada 3/1/2 · V6 · 1d6 · +0 · 16 m · 700 g; Machado de Arremesso, pesada 3/1/2 · V6 · 1d6 · +1 · 12 m · 700 g, Cortante ou Impacto; Azagaia, pesada 3/1/2 · V6 · 1d6 · +1 · 16 m · 800 g, Perfurante N1, aceita atlatl; Pilum, pesada 3/1/2 · V6 · 1d6 · +1 · 12 m · 2 kg, Perfurante N2; Boleadeira, pesada 3/1/2 · V6 · 1d6−4 (exceção à classe) · +0 · 16 m · 600 g, Impacto; Rede, pesada 3/1/2 · V6 · sem dano · +0 · 4 m · 3 kg; Funda, 4/1/1 · V6 · 1d6 · +1 · 26 m · pedra de 100 g, Impacto. Classes de Arremesso: leve 2/1/1 (V4, 1d6−4), média 3/1/1 (V5, 1d6−2), pesada 3/1/2 (V6, 1d6). Shuriken, Mini-faca e Kunai ficam como armas separadas, mesmo quase iguais: o jogador escolhe por estilo. **Bumerangues:** o do site (uma linha, 1d6, Acerto +1, 50 m, Velocidade 5) vira dois: o de caça (0,7 kg, reto e baixo, não volta, troca alcance por dano) e o de retorno (300 g, em curva, volta à mão no fim da ação se errar, mais leve e preciso). Os dois existem em Impacto (madeira, a versão comum) ou Cortante (mais cara). Pegar o de retorno Cortante pede Destreza + Arremesso, Dificuldade Média (10); se falhar, ele cai a 1 ou 2 m; o de Impacto volta à mão sem teste. **Boleadeira:** deixa o alvo Preso pelas pernas; escapa-se por Força + Atletismo contra o total do lançamento. **Plumbata e Bloqueio** (adendo, item 5): é projétil rápido, mas é lançada à mão, então pode ser defendida também com Bloqueio (exceção à regra dos projéteis rápidos, que só admitem Esquiva ou escudo hábil).
- Origem: 2f §9, §10 e §12; adendo, itens 5 e 6
- Estado: **NO AR no catálogo e no livro** (rodada 1, f3d52086 e 0dcf5788, vereditos 147 e 148; rodada 2, 5c4bb201 e 9bd51dd3, vereditos 149 e 151; o P/G/R do Arremesso na rodada 4a; a Rede e a Boleadeira como Preso nas rodadas 3 e 7): a Plumbata no lugar dos Dardos (o id `dardos` saiu sem `RENOMES`), os dois bumerangues, as três leves, a Boleadeira e a Rede. "Dardos" não aparece mais nos capítulos, nas páginas nem nos dados (busca do Arquiteto, 10/10/2026, sem o bestiário; a varredura da rodada 8 confere o resto). Histórico do estado: a implementar (catálogo `armas.json` e textos; ver D-080). As classes P/G/R do Arremesso, dos arcos e das bestas vêm da reforma de P/G/R do `veterana-2b-reforma-pgr.md`. A reforma das armas corpo a corpo desse mesmo documento (leve 1/1/3, média 2/1/3, pesada 3/1/3) NÃO é registrada aqui: é a pergunta do Preparo mínimo (`Combate_Tempo.md` §14.11) e segue com o autor. Preços das armas novas: modelo de economia. **Preço da Plumbata: 35 pc, definitivo (D-085).** Colunas do 2f §10 que esta entrada não transcreveu e que valem como na tabela de lá: Mãos (1 em todas as linhas) e Destaque (Ágil, munição e descrições; a Funda é Munição). Boleadeira: o 2f acrescenta na descrição "tabela: Esquiva −4" (D-079).

### D-077 · Porte: sem teto, corpo a corpo só o menor ganha, à distância relativo nos dois sentidos [tags: porte, tamanho, acerto, corpo-a-corpo, distancia, bestiario]
- Data: 2026-10-09
- Decisão (2f §7 e §0 C4 e A6; adendo, item 10; [autor]): "Sem teto em ataque nenhum: +3 por categoria de diferença, sem limite" (substitui o teto de ±12 do site). **Corpo a corpo:** só o menor ganha bônus contra o maior; o maior ataca o menor sem penalidade (motivo de jogo: as criaturas grandes devem ser temidas pelas menores). **Qualquer ataque à distância** (arremesso, projétil, arco, besta, ataque mágico, Artes físicas à distância) segue a regra do tiro, relativa nos dois sentidos: alvo maior que quem ataca, +3 por categoria; alvo menor, −3 por categoria. O enxame usa o tamanho que apresenta nos dois papéis, como alvo e como atacante. Atirar num Colossal muito longe continua difícil (aceito): o porte não escala a Efetiva, entra só como bônus fixo no acerto. Criaturas maiores que Médio lutando entre si: sem bônus de Defesa, com uma nota para o Mestre sugerindo aumentar a Defesa delas nesses casos. Adendo, item 10: ataques Sociais e Mentais continuam fora do porte, e Artes de área sem rolagem de ataque também. **Defesa baixa de criaturas grandes** (o Verme Púrpura Imenso do bestiário tem Defesa 4): fica para quando as fichas forem refeitas; não se recalculam desafios agora; as fichas serão refeitas antes da fase de testes.
- Origem: 2f §7, §0; adendo, item 10
- Estado: **NO AR no livro, no glossário e na referência da mesa desde a rodada 6** (c0085104, veredito 161 PROCEDE; Validar e Deploy verdes): a seção Porte de `combate.md` (+3 por categoria sem teto, a tabela até +18, só o menor ganha no corpo a corpo, relativo à distância, enxame, exclusões e a Nota ao Mestre), a frase de Manobras, `glossario.json` (Porte), `regras.json` `porteAcerto.reforma`, `/mesa` e `/mesa/referencia`. **O Grid segue a regra velha** (teto de 4 categorias, simétrico): `modificadorPorte` em `calc.ts`, chamado só por `grid.astro`, lê `ordem`, `porDiferenca` e `capCategorias`, que ficaram intactos; `porteAcerto.gridNota` explica a coexistência, e a divergência está no N22. A ficha não calcula porte (veredito 161, item a). A Couraça de Porte e o limite do Bloqueio (`bloqueioLimite`, "Força e porte") não foram tocados. Fichas e desafios das criaturas grandes: B14. Para testar: `fase-de-testes.md` (T4).

### D-078 · Defesa sem teto de penalidades, piso 0 e Defesa 0 [tags: defesa, teto, piso, margem, surpreso, cego, furtividade, pressao]
- Data: 2026-10-09
- Decisão (2f §8.1, §8.2, §0 C3, C6, C7 e A1, A5; adendo, itens 1 e 4; [autor]): "Penalidades de Defesa não têm teto nenhum. O teto de ±6 do site deixa de existir. Tudo se soma: condição, tabela de restrição, modificadores de situação (cobertura, flanco, prono, postura), Guarda sob pressão. A Defesa nunca fica abaixo de 0." **Defesa 0 nas duas Defesas** (basta o total 1 para acertar): surpreso (não sabe do ataque), totalmente imobilizado (amarrado, soterrado), dormindo e desacordado. Regra geral: sempre que o personagem não souber do ataque ou não tiver como se defender, a Defesa correspondente é zerada; ataque imbloqueável zera só o Bloqueio, inesquivável só a Esquiva, os dois juntos zeram tudo. Alvo que se mexe e vê o ataque: Defesa normal. **Cego, vendado ou no escuro total, sabendo que vai ser atacado:** Esquiva −4 e Bloqueio −8; sem saber do ataque vale "surpreso" (Defesa 0); a penumbra fica sem regra, a critério do Mestre. **Sabe que vai ser atacado** (adendo, item 4, que decide a pergunta do 2f §8.2 e A5): o atacante rola Furtividade contra a Percepção Passiva do defendido (a que o site já tem); o atacante invisível usa o mesmo teste. **Margem contra Defesa 0** (adendo, item 1): aceita sem teto; quem está dormindo, imobilizado ou com a guarda destruída deve levar muito dano, podendo morrer com um golpe só. **Agarrado e Imobilizado:** ver D-081. **Teto nos bônus** (resposta do autor, 09/10/2026): "os bônus mantêm o teto de +6; só as penalidades ficam sem teto." **Normal × P/G/R** (2f §0 C7): o Normal soma a mesma pressão, lida como a Guarda sob pressão da C-047 (−2 por ataque feito ou recebido, até a próxima ação, sem teto); não cria penalidade de fase nova no Normal, e a C-048 fica intacta.
- Origem: 2f §8.1, §8.2 e §0; adendo, itens 1 e 4
- Estado: **NO AR no livro e na referência da mesa desde a rodada 5** (63817b4f, veredito 158; 5-bis 0a87a64d, veredito 159; 5-ter 1efe2ad9, veredito 160; Validar e Deploy verdes nos três): sem teto nas penalidades, +6 nos bônus, piso 0, "Quando a Defesa zera, e quando o alvo não vê" em `combate.md`, Furtividade contra Percepção Passiva em Sentidos e Engano, `regras.json` `defesaReflexiva` e `combateTatico`, e `/mesa` e `/mesa/referencia`. O Grid segue sem piso 0 e sem Defesa zerada (N22, `lance.ts` `defesaEfetiva`; `condicoes.json`, D-064). "O agarrado" e o Imobilizado do capítulo passaram à tabela nova na rodada 7 (f4c5f136, D-081); o porte deixou de citar o teto de ±6 na rodada 6 (c0085104, D-077). O teto de +6 dos bônus de Defesa (inclusive os reflexivos de Proeza, `regras.json` `defesaReflexiva`) continua; a exceção de `defesaReflexiva` para penalidade imposta por Proeza fica sem objeto, porque nenhuma penalidade tem teto. Se o Normal deve passar a cobrar uma Recuperação própria (leitura do `veterana-2b-reforma-pgr.md`, CONFLITO do Normal), isso contradiria a C-048 e pede pergunta antes. Para testar: `fase-de-testes.md` (T2).

### D-079 · Restrição de corpo e de lugar, Preso e Rede [tags: restricao, preso, rede, boleadeira, equilibrio, escudo, pouco-espaco]
- Data: 2026-10-09
- Decisão (2f §8.4, §8.5, §0 A2 e A4; adendo, itens 7, 9 e 12; [autor]): tabela de restrição para o Mestre. **Corpo** (só a parte presa conta), Esquiva / Bloqueio: Leve (pé enroscado, lama funda) −2 / 0; Parcial nas pernas (uma perna presa; Preso por boleadeira ou Arte) −4 / 0; Parcial nos braços (um braço preso, arma travada) 0 / −4; Grave (preso pela cintura; Agarrado, só contra quem está de fora, D-081) −8 / −4; Total (amarrado, soterrado; Imobilizado, D-081) Defesas zeradas. **Lugar:** Pouco espaço (corredor estreito, entre galhos, túnel) Esquiva −2 e Bloqueio −4, e o escudo perde o bônus (não está "apto"); Sem equilíbrio (corda bamba, telhado inclinado, convés no temporal) Esquiva −4 e Bloqueio −2. **Preso pela tabela** (Parcial, pernas): Esquiva −4; não se desloca, mas age; origens: boleadeira, rede e Arte de prender; o agarrão gera só Agarrado, como no livro (resposta do autor, 09/10/2026: "agarrão só gera Agarrado. O Preso vem da boleadeira, da rede e de Arte de prender."). **Preso pela Rede:** −2 na Esquiva e −2 no Bloqueio, mais −1 por grau de Margem do lançamento, sem teto de Margem (adendo, item 7). Os dois perfis valem, cada um na sua origem; a etiqueta "Prende" passa a dizer "deixa o alvo Preso". Para se soltar da boleadeira e da rede: Força + Atletismo contra o total do lançamento. Os exemplos "rede nas pernas" e "enrolado na rede" saem da tabela, porque a Rede tem regra própria (adendo, item 9). "Sem equilíbrio" × Caído (o Prono do site): ficava pendente (adendo, item 12); **encerrado em 10/10/2026 pela D-086**, sem regra nova: fica a cargo do Mestre.
- Origem: 2f §8.4, §8.5; adendo, itens 7, 9 e 12
- Estado: **NO AR no livro.** A tabela de restrição de corpo e de lugar desde a rodada 5 (63817b4f, veredito 158: sete linhas, "só a parte presa conta", o escudo sem bônus em Pouco espaço, sem os exemplos da Rede); o Preso em Manobras com os dois perfis (boleadeira e Arte de prender pela tabela; a Rede com regra própria) e "o agarrão comum só gera Agarrado" desde a rodada 7 (f4c5f136, veredito 162 PROCEDE; Validar e Deploy verdes). A Rede e a etiqueta Prende ("deixa o alvo Preso") já estavam em `armas-e-armaduras.md`. A fuga da Arte de prender é contra a Dificuldade do Efeito (`regras.json` `arcano.resistencia`), o que esta decisão não trata. O Grid (`condicoes.json`) não tem a condição Preso (N22). Agarrado e Imobilizado: D-081.

### D-080 · Textos do site: a reescrita espera o fim da parte de armas de arremesso e distância, em rodadas autorizadas pelo autor [tags: texto, reescrita, rodadas, preco, fase-de-testes, pendencia]
- Data: 2026-10-09
- Decisão (2f §1 item 12, §11, §13, §14; [autor]; despacho de 09/10/2026): "Os textos do site são reescritos depois que a parte de armas de arremesso e distância estiver fechada." Nada se reescreve agora. O Arquiteto monta o plano de rodadas a partir da seção 14 do 2f e o entrega ao autor para autorizar (`plano-reescrita-armas-distancia.md`). A tabela de preços dos arcos e das armas novas fica com o modelo de economia. O artefato `alcance-e-precisao.html` da Veterana segue desatualizado e só se atualiza se o autor pedir. Fichas e Defesas das criaturas grandes e o recálculo de desafios ficam fora desta fase (D-077). Os itens a testar nas simulações estão em `fase-de-testes.md`.
- Origem: 2f §1, §11, §13, §14; despacho do autor ao Arquiteto, 09/10/2026
- Estado: plano de rodadas **autorizado inteiro pelo autor em 10/10/2026**, na ordem 1, 2 e 3, 4a, 4b, 4c, 5, 6, 7, 8, com as travas registradas no plano (`plano-reescrita-armas-distancia.md`). A pendência de "Sem equilíbrio" × Caído foi encerrada (D-086) e a dos Punhos na reforma de P/G/R foi fechada pela D-082. A Plumbata deixou de esperar o modelo de economia (D-085). **Andamento (10/10/2026):** rodada 1 (dados) no ar em f3d52086 + 0dcf5788, veredito 147 CORRIGE e ESCALA, fechado no 148 PROCEDE; rodadas 2 e 3 (textos) em 5c4bb201 e 53574bf0, veredito 149 CORRIGE (teste do capítulo, em andamento); veredito da rodada 14 das armas (150) PROCEDE, que libera as rodadas 4a a 6. Os Estados das D-072 a D-079 só fecham quando as rodadas de texto correspondentes (4a a 7) estiverem no ar. **Andamento (10/10/2026, fim da rodada 7):** as rodadas 1 a 7 estão no ar, todas fecharam em PROCEDE (três com correção antes: 147 CORRIGE e ESCALA, fechado no 148; 149 CORRIGE, fechado no 151; 152 CORRIGE, fechado no 153; e 158 PROCEDE com um CORRIGE, fechado no 159; o 155 é a conferência da conta da Arte, não veredito de rodada) e CI verde; os Estados das D-072 a D-079 e D-081 a D-085 foram atualizados. A rodada 8 fechou em 10/10/2026 (5d2cfeea e 8-bis 9aaa04cf; vereditos 163 e 164 PROCEDE; CI verde): **o plano de rodadas está CONCLUÍDO.** Os pontos que ficaram com o autor foram respondidos em 10/10/2026: o Bordão na Haste média (D-089), a frase da Máxima do arco e da besta (D-090, já no ar), o Tick de decisão do esticar como Preparo (leitura registrada na D-084, já no ar) e a mão inábil sem penalidade (D-091, fecha a K18). A verificação externa (`tmp/verificadora/relatorio-fechamento.md`, sobre b8c143da) abriu a **rodada 9** do plano. O Grid segue a régua velha em tudo isso até a passada única (N22).

### D-081 · Agarrado e Imobilizado: Defesas do agarrado contra os de fora e Imobilizado com Defesas zeradas [tags: agarrado, imobilizado, agarrao, defesa, manobra, preso]
- Data: 2026-10-09; corrigida em 2026-10-10
- Decisão (texto corrigido pelo autor em 10/10/2026): do item 23 da D-019 mudam **duas coisas**, e só duas. (1) O "−2 contra quem está de fora" vira **Esquiva −8 e Bloqueio −4, só contra quem está de fora**. (2) O **Imobilizado** passa de Defesa −4 para **Defesas zeradas**. Continua valendo o resto do item 23: **o agarrado não age, não rola, e só se solta quando quem controla erra.** A mecânica já decidida está em `veterana-1e.md`, A·MANOBRA (decisões 20 a 27, 39 e 44; texto final no bloco "(e) Correção final") e A·a4-1: a cada 6 Ticks, quem controla rola o Manter (5 Ticks de Preparo e 1 de Golpe) contra a Defesa de agarrão do agarrado, que é passiva. Superou: mantém e causa dano. Igual: durante 6 Ticks ninguém controla e ninguém causa dano. Abaixo: os papéis se invertem. **Não há jogada, Tick nem custo novo para o agarrado.** Origem do Imobilizado: a Técnica Imobilizar (Agarrão do Urso, N1, 1 Energia) e as parecidas (Constrição), mais quem está amarrado ou preso no gelo; **o agarrão comum não imobiliza**. Sobre o Preso (resposta de 09/10/2026, mantida): "agarrão só gera Agarrado. O Preso vem da boleadeira, da rede e de Arte de prender." **Leitura do autor** (registrada como leitura): "Defesas zeradas" vale para a Esquiva e o Bloqueio, **não para a Defesa de agarrão**; senão a manutenção nunca falharia e o imobilizado nunca se soltaria, o que contradiria a decisão 39 do 1e.
- Histórico: a resposta de 09/10/2026 ("O agarrado só pode agir contra quem está o agarrando, para tentar controlar o agarrão. Se ele conseguir controlar o agarrão ele pode decidir continuar, agora no controle, ou soltar. Contra outros oponentes o agarrado sofre −8 de Esquiva e −4 de Bloqueio. Imobilizado tem as defesas zeradas contra todo mundo que atacar. Um agarrão normal não pode imobilizar alguém.") foi lida pelo Arquiteto como "o agarrado passa a agir contra quem o agarra" e registrada assim. O autor corrigiu em 10/10/2026: **essa leitura sai**; o que a frase descreve é a inversão de controle da Manobra (quem controla erra o Manter e o agarrado passa a controlar), que já existe.
- Origem: resposta do autor ao Arquiteto, 09/10/2026, e correção de 10/10/2026; `veterana-1e.md` A·MANOBRA e A·a4-1; 2f §8.3 e §8.4 (com o cabeçalho de correção da cópia); adendo, item 8
- Estado: **NO AR no livro desde a rodada 7** (f4c5f136, veredito 162 PROCEDE; Validar e Deploy verdes): em `combate.md`, Manobras, "O agarrado" com Esquiva −8 e Bloqueio −4 contra quem ataca de fora (o resto do parágrafo intacto) e o Imobilizado com Esquiva e Bloqueio zerados, não a Defesa de agarrão. O "sem dobro" do parágrafo (redação da Veterana, 1d l.953 e 1e r5, que entrou em 3dc09c71; não é frase do autor) ganhou o parêntese "a linha *Corpo, grave* da tabela de restrição é esta mesma penalidade, contada uma vez": esclarecimento, não regra (veredito 162, item b); sai inteiro se o autor ler outra coisa. O Grid (`condicoes.json`: agarrado −2, imobilizado −4 e age com −2) segue no N22. Histórico do estado: a implementar (rodada 7 do plano, D-080). **Substitui PARCIALMENTE o item 23 da D-019**: só o "−2 contra quem está de fora" (agora Esquiva −8 e Bloqueio −4, só contra quem está de fora) e o Imobilizado a −4 (agora Defesas zeradas); o resto do item 23 (o agarrado não age, não rola, só se solta quando quem controla erra; sem penalidade entre os dois) segue. Não toca a D-043 (Imobilizado não age, nem com Firula; a ordem dos estados é Preso, Agarrado, Imobilizado). Como "um agarrão normal não pode imobilizar", não há choque entre "Defesas zeradas contra todos" e "entre os dois não há penalidade". **Não há pendência de mecânica do agarrado:** a jogada que "tenta controlar" é o Manter de quem controla, que o agarrado sofre (Defesa de agarrão passiva); o parágrafo "O agarrado" já está no ar (3dc09c71, 1e r5) e a rodada 7 só troca nele as duas partes acima. **Constrição:** os textos do bestiário que dizem que a Constrição deixa o alvo Imobilizado (`bestiario l.12061`) batem com esta decisão (poder da criatura, não agarrão normal); o bestiário não se edita agora, e a divergência que houver de redação vai para a B14 (as fichas de criatura serão refeitas). O `condicoes.json` (Imobilizado age com penalidade, Agarrado) segue em N-grid-pendencias.md (D-064).

### D-082 · Reforma de P/G/R: Preparo mínimo de 1 Tick, Recuperação 3 nas armas corpo a corpo, Arte, Investida e Normal [tags: pgr, preparo, recuperacao, velocidade, investida, normal, arte, haste]
- Data: 2026-10-09
- Decisão (resposta do autor, 09/10/2026: "registrar a reforma inteira"; `veterana-2b-reforma-pgr.md` §0 a §3, "A reforma, como ficou", lido em `tmp/veterana/`): regra geral **Preparo = Velocidade − 1 − Recuperação, com o Golpe sempre em 1 Tick** (toda arma passa a ter ao menos 1 Tick de Preparo). Classes (P/G/R · Velocidade · dano · Acerto · Defesa): Leve 1/1/3 · 5 · sem mudança; Média 2/1/3 · 6 · sem mudança; Haste média (Lança, Bastão, Bordão, Cajado, Tridente, Arpão) 2/1/3 · 6 · 1d6 · +1 · +2 (Força×2 em duas mãos); Haste de Guerra (Foice Grande, Lança Longa, Alabarda, Glaive, Guisarme, Poleaxe) 3/1/3 · 7 · 1d6+2 · +0 · +0; Pesada 3/1/3 · 7 · sem mudança; Arco Curto 4/1/1 · 6 · 1d6−2 · +2; Arco Longo 4/1/2 · 7 · 1d6 · +0; Arco Composto 4/1/2 · 7 · 1d6+2 · +0; Bestas 7/1/1, 9/1/2 e 12/1/2 · 9, 12 e 15; Arremesso leve 2/1/1 · 4, médio 3/1/1 · 5, pesado 3/1/2 · 6; Funda 4/1/1 · 6 (Arremesso, arcos, bestas e Funda valem como nas D-075 e D-076, que prevalecem sobre o 2b onde diferem: Dardos, bumerangues, Máxima da Funda); **Arte** graus 0 a 3 3/1/1 · 5, grau 4 4/1/1 · 6, graus 5 e 6 5/1/1 · 7, e a Recuperação da Arte cobra −2 como qualquer ataque. **Investida** (opção "a" do autor): vale para todas as armas, inclusive a leve com 1 Tick de Preparo e o +1d6; o Preparo é o orçamento de deslocamento (Sora, 4 m por Tick andando e 7 m investindo: Leve, 1 Tick, 4 m e 7 m; Média e Haste média, 2, 8 m e 14 m; Haste de Guerra e Pesada, 3, 12 m e 21 m). **Normal:** a Velocidade é a soma do P/G/R e a penalidade de ataque é −2 por ataque durante todos os ticks da ação (a leitura do autor, que o 2f §0 C7 confirma como "o Normal soma a mesma pressão"; custo total 2 × Velocidade + 2, independente da divisão entre Preparo e Recuperação).
- Origem: 2b §0 a §3; 2f §0 C7 e §2; resposta do autor ao Arquiteto, 09/10/2026
- Estado: **NO AR no livro e na ficha desde a rodada 4c (b56d78f5, veredito 157); o Grid segue o K15 até a passada única (N22).** No ar: a Arte (rodada 4c, D-084), a Distância e a Recarga (rodada 4a, 6628d27b) e o corpo a corpo (rodada 4b (8a7a6eb0, 0dcb1e56, cda8845d; veredito 153 PROCEDE) e 4b-bis (2ef4f5b8; veredito 154 PROCEDE), CI verde em 2ef4f5b8), com a tabela P/G/R, a Investida de toda arma, as Hastes e os Punhos 1/1/3; e a ficha com uma régua só (rodada 4d, 8748735d; veredito 156 PROCEDE; Validar verde em 8748735d): a ficha lê a régua nova em todas as armas, corpo a corpo, tiro e arremesso, e o Grid segue a velha (N22). Os textos do 2b §4 (tabela de Preparo, Distância, tabela de Velocidades, Recarga, exemplo do Bram, Golpes no mesmo instante, Investida, Normal, Arte) estão todos no livro (mapa item por item em `plano-reescrita-armas-distancia.md`). SUBSTITUI a régua do K15 (`K-combate-linha-do-tempo.md`: leve 0/1/4, média 1/1/4, haste 2/1/3, pesada 2/1/4, arco (Vel−1)/1/0, Arremesso (Vel−2)/1/1), que passa a baseline histórico; encerra a pergunta do Preparo mínimo (`Combate_Tempo.md` §14.11, 20/08). **Punhos** (resposta do autor, 10/10/2026, ao conflito com a D-057 e a D-065 item 1: "A: seguem a classe Leve"): os Punhos passam de P0/G1/R4 para **1/1/3, Velocidade 5**, o resto igual (Acerto +1, Defesa +1, 1d6−2 + Força); a D-057 e a D-065 item 1 ficam SUBSTITUÍDAS nesse número (marcado nelas). **Arte** (resposta do autor, 10/10/2026): a Arte passa a sair no Tick do Golpe, o penúltimo; essa decisão tem entrada própria, a **D-084**. O Grid segue o K15 até a passada única (D-054, N-grid-pendencias.md), inclusive os Punhos (o 1/1/3 mora em `regras.json` `combate.pgr.reforma.corpoACorpo`, perto da l.2642; a linha `desarmado` de `armas.json` não tem P/G/R; o Grid lê `combate.pgr.preparo`, 0/1/4).

### D-083 · Rajada e empunhadura dupla no P/G/R: a geometria decidida em 20/08, registrada agora [tags: rajada, empunhadura-dupla, pgr, ataque-multiplo, k16, ambidestria, punhos]
- Data: 2026-10-10 (decisões de 20/08/2026, sem número no registro até aqui)
- Decisão (`Combate_Tempo.md` §14.12 e §14.13, decididas pelo autor em 20/08/2026, K16 em `docs/pendencias/K-combate-linha-do-tempo.md`; despacho do autor de 10/10/2026, A2): **Rajada**: atacar de novo com a mesma arma é `P → G → G → … → R`, declarada de uma vez, sem parar no meio. Preço de cada golpe além do primeiro: **−1d6 acumulativo no ataque** (1º golpe 0, 2º −1d6, 3º −2d6, a mesma escala da D-033) e **+1 Tick de Recuperação** (no Normal, +2 de Velocidade por golpe extra). **Teto: 3 golpes com arma leve ou média, 2 com haste ou pesada.** **Só corpo a corpo** (arco, besta e arremesso não fazem Rajada). Ciclo em Ticks para 1, 2 e 3 golpes: leve 5, 7, 9; média 6, 8, 10; haste 6, 8; pesada 7, 9. Bordas: (1) alvos diferentes, golpe a golpe, qualquer um ao alcance; (2) **interrupção: só o Preparo é interrompível; o espelho de quem pagou ação fora de hora empurra os golpes restantes, não os cancela**; (3) sem alvo ao alcance, os golpes restantes se perdem e a Recuperação começa, sem reembolso; (4) não acumula com a empunhadura dupla nem com Técnicas de ataques extras: uma só fonte de golpes múltiplos por ação (fonte: `Combate_Tempo.md` §14.12, "As bordas da rajada", item 4, l.1161, seção "Decidida"); (5) Carga voluntária e Mirar valem só para o primeiro golpe. **Empunhadura dupla (uma arma em cada mão):** um Tick de Golpe para cada mão, **ambas a −1d6**; **par de armas leves: o segundo Golpe come a Recuperação, o ciclo não muda; com arma média na mão hábil, o ciclo cresce 1.** Segurando a segunda arma (ou o escudo) sem golpear com ela, o Tick de Golpe fica a −2 em vez de −4. Cada ataque conta como feito para a Guarda sob pressão (C-047: a dupla conta 2 ataques feitos). Razão do autor: o tempo é a identidade da dupla e os dados são o custo dela; a dupla tem de ser mais interessante que atacar duas vezes com a mesma arma.
- Origem: `Combate_Tempo.md` §14.12 e §14.13 (20/08/2026); K16; despacho do autor ao Arquiteto, 10/10/2026
- Estado: **NO AR na rodada 4b (8a7a6eb0, 0dcb1e56, cda8845d; veredito 153 PROCEDE) e 4b-bis (2ef4f5b8; veredito 154 PROCEDE), CI verde em 2ef4f5b8 (Rajada e empunhadura dupla P/G/R, cláusula dos dois Punhos).** Registrada em 10/10/2026 (o registro tinha só a D-033 e a C-046 sobre o assunto). O livro já traz a Rajada (`combate.md`, "Rajada: golpes extras com a mesma arma", +2 de Velocidade por golpe extra, teto 3/3/2/2, e duas linhas de P/G/R) e a empunhadura dupla no Normal (mesma Velocidade, −1d6); o texto P/G/R da dupla (par de leves no mesmo ciclo; média na hábil com ciclo +1; ambas −1d6; −2 em vez de −4 segurando a segunda arma) está em `combate.md` l.209-216 desde a rodada 4b. A frase da cláusula "A mão inábil vale para qualquer coisa usada nessas mãos" não entrou no livro; com a D-091 (sem penalidade na inábil) ela perde o objeto. Leituras do Arquiteto com a D-082, a confirmar na rodada: o ciclo continua igual à Velocidade da arma; "haste" no teto de 2 vale para as duas hastes (média e de Guerra), pela letra do autor ("haste e pesada: 2"); a "Carga voluntária" da leve some com a Investida para todas as armas (D-082). **Fora desta entrada:** a **Ambidestria** (K18) estava em aberto, com a pergunta **se há penalidade por atacar com a mão inábil**; **fechada pela D-091** (10/10/2026: sem penalidade extra, −1d6 nas duas). A **D-068** foi liberada pelo autor em 10/10/2026 e entra na rodada 4b.
- **Cláusula dos DOIS PUNHOS (decisão do autor, 10/10/2026; responde o item 17 da veterana-2 e "Punhos nas duas mãos" da veterana-2b, l.87):** "Dois punhos contam como **duas armas leves**, cada um com as estatísticas de Punhos (1/1/3, D-082). Contam como empunhar duas armas para a **empunhadura dupla**, para a **Rajada** (teto de 3 golpes, o da classe leve) e para o **Bloqueio** (+1 cada, D-065 item 3). Contam como **2 ataques** para a Guarda sob pressão (C-047). **Só as mãos fazem par:** os dois punhos e qualquer mão que conta como arma (D-070). Chute, mordida, cauda e patas de animal seguem a D-068 (são opções, não par). A mão inábil vale para qualquer coisa usada nessas mãos." Esta é a exceção explícita que a D-068 pedia. Leitura do Arquiteto, a confirmar na 4b: a Rajada de Punhos segue a Rajada acima (a mesma arma golpeando de novo, teto 3 por ser leve) e não acumula com a dupla (D-083 item 4).
- **Dado e teto da mistura (pendência "dado e teto da mistura" da veterana-2b, l.87; item 16 da veterana-2: dupla com armas de Velocidade diferente), passada pelos três filtros em 10/10/2026:** (1) **dado: coberto**, "ambas a −1d6" acima (a mão inábil ter ou não um dado a mais é a K18, não a mistura); (2) **teto: coberto**, a dupla é um golpe por mão (dois golpes), e a Rajada, que tem o teto 3/3/2/2, não acumula com a dupla, então não há "teto da mistura" a decidir; (3) **ciclo da mistura: coberto pelo "+1 para média"** acima. O resíduo (a média na mão INÁBIL, e a leve e a média de Velocidades diferentes) é caso de borda do bom senso do Mestre (D-087): leitura do Arquiteto para a 4b escrever com uma frase e um exemplo, sem regra nova: **o ciclo da dupla é o da arma mais lenta das duas, não importa em que mão ela esteja** (uma leve com uma média: o ciclo da dupla com média, 7 Ticks, que é a Velocidade 6 da média mais 1, como na tabela da D-083). **Nenhuma pergunta ao autor.** **Conferência na fonte (10/10/2026, a pedido do usuário):** (a) o "+1 para a média" é sobre a Velocidade da média, e não sobre o ciclo da leve: `Combate_Tempo.md` §14.13, l.1173 ("Com arma média na mão hábil: o ciclo cresce 1") e a tabela de l.1186 a 1188 (média, um golpe, 6t; média, dupla, **7t**), que repete em l.1263 ("com média: ciclo +1"); (b) **"o ciclo é o da arma mais lenta, em qualquer mão" NÃO sai do §14**: o §14.13 só trata da média na mão HÁBIL, e não diz nada da média na inábil nem da leve com média de Velocidades diferentes. A frase está no livro (`combate.md`, "A dupla de armas de Velocidades diferentes fica a critério do Mestre") como leitura do Arquiteto sob o Princípio do Mestre (D-087), não como regra do autor; **Fechada em 10/10/2026 (ordem do usuário, opção A):** a frase fica em `combate.md` como critério do Mestre (filtro 3 da D-087); é leitura do Arquiteto, não regra do autor, e não é pergunta aberta.

### D-084 · A Arte sai no Tick do Golpe, o penúltimo [tags: arte, tick, golpe, pgr, tempo-da-arte, recalibracao, 2b]
- Data: 2026-10-10 (resposta do autor de 10/10/2026, que antes constava só na D-082)
- Decisão (resposta do autor, 10/10/2026, "A: sim, no Tick do Golpe"; `veterana-2b-reforma-pgr.md` §3 e §4 item 7): a Arte passa a sair no **Tick do Golpe, o penúltimo**, e não no último (consequência de "Velocidades do livro, Preparação −1, Recuperação 1"). Uma conjuração de 7 Ticks acontece no **sexto**; o sinal se anuncia por **4 a 6 Ticks** (não 5 a 7); a janela de sair do caminho perde **1 Tick**; esticar a conjuração decide nos Ticks **4, 9 e 14** (não 5, 10 e 15; é o exemplo da Velocidade 5, e a regra geral é o Tick do Golpe de cada Velocidade, n × V − 1, conta do Arquiteto conferida pela Revisora no veredito 155, `adee7295`). As contas por metro e a Dificuldade não mudam. Mudam o texto dos Pilares das Artes ("A Arte resolve no ÚLTIMO Tick") e as passagens listadas no 2b §4, item 7. Nota do autor (10/10/2026): se a medição mostrar Artes fortes demais, a alternativa a testar é manter a Preparação de hoje com **Recuperação 1** (T6 em `fase-de-testes.md`).
- Origem: resposta do autor ao Arquiteto, 10/10/2026; 2b §3 e §4 item 7; o "último Tick" vinha de `Arcano_revisao.md` §5.5 (via `Combate_Tempo.md` l.44)
- Estado: **NO AR na rodada 4c** (b56d78f5; veredito 157 PROCEDE; Validar e Deploy verdes em b56d78f5): no livro (`combate.md`, a tabela de P/G/R com as três linhas da Arte e o parágrafo do Tick do Golpe), na página das Artes (`artes/regras.astro`) e no dado (`regras.json` `arcano.tempoDaArte`, `esticar.decisaoTardia`, `combate.pgr.reforma.arte`). O Tick em que se decide esticar conta como Preparo (−2) e só o Tick em que a Arte sai é Golpe (−4), para o custo seguir 2 × T + 2 (conta da Revisora, veredito 155; frase em parágrafo próprio, removível). Separada da D-082, que só aponta para esta. **A recalibração das Artes (ART-34, ART-5, ART-38, ART-40; D-061, A34 em `docs/pendencias/A-arcano-artes.md`) parte do novo tempo**: a nota está no A34. O Grid segue o Tick antigo até a passada do Grid (D-054). Texto do livro hoje: `combate.md` l.95-97 (as três linhas da Arte na tabela) e l.101 (o parágrafo), e "Passar do seu limite" em As Artes (`artes/regras.astro` l.477-495, o esticar). **Leitura registrada em 10/10/2026 (o autor não objetou): o Tick de decisão do esticar é Preparo.** Pela D-082 o Golpe é o Tick em que a ação se resolve; no Tick em que se decide esticar nada se resolve, então ele é Preparo (−2), e só o Tick em que a Arte sai é Golpe (−4). Fonte: 2b §3 (`veterana-2b-reforma-pgr.md` l.65: "a decisão de soltar ou segurar cai no Tick do Golpe de cada Velocidade (4, 9, 14...). Só o ciclo final leva Recuperação"). O 2b chama esse Tick de "Tick do Golpe" porque é ali que o Golpe cai SE o feiticeiro soltar; ele não diz a penalidade de quem segura, e a leitura não o contradiz. A frase já está no ar em `artes/regras.astro` l.494 e `regras.json` `esticar.decisaoTardia` e `reforma.arte.esticar.nota`; não está em `combate.md`. **O 19:** os Golpes da V5 são 4, 9, 14 e 19 (n × V − 1, n de 1 a 4); o teto de quatro ciclos vem da tabela do esticar (`regras.json` `arcano.esticar.tabela`, "acima" de 0 a 3, ×1 a ×4; `combate.md` l.60, "duas, três ou quatro vezes"; `Arcano_revisao.md` §6.5). Os Ticks de DECISÃO são só 4, 9 e 14: no 19, Golpe do quarto ciclo, não há mais o que esticar. `decisaoTardia` diz "decide de novo no 9 (14, 19)" e se corrige na rodada 9; `reforma.arte.esticar` (Golpe do 4º ciclo) está certo.

### D-085 · Preço da Plumbata: 35 peças de cobre, definitivo [tags: preco, plumbata, economia, arremesso, dardos]
- Data: 2026-10-10
- Decisão (despacho do autor, 10/10/2026, A7): "Preço da Plumbata: 35 peças de cobre, definitivo." Em `pc` do livro (cobre). Substitui o "Dardos 5 pc" do catálogo (a Plumbata ocupa o lugar dos Dardos, D-076).
- Origem: despacho do autor ao Arquiteto, 10/10/2026
- Estado: **NO AR desde a rodada 2** (5c4bb201; vereditos 149 e 151): "Plumbata 35 pc" em `custo-qualidade-e-equipamento.md` l.132, o único lugar (a tabela gerada por `gen-cap-itens`). As linhas citadas abaixo são de antes da rodada 2: `custo-de-servico-e-itens.md` não tem tabela de armas. Histórico do estado: a implementar (**rodada 2**, que deixa de esperar o modelo de economia por causa da Plumbata). Os preços das armas novas e dos arcos continuam com o modelo de economia (D-075, D-076). O "Dardos 5 pc" mora em `custo-qualidade-e-equipamento.md` (l.129) e em `custo-de-servico-e-itens.md` (l.170); a Executora localiza a fonte (preço gerado não se edita à mão) antes de trocar. Os itens G40 e G42 de `G-acoes-sistema.md` falam do preço dos Dardos e perdem o objeto com esta troca (o G42 vale ainda para a Adaga de Arremesso).

### D-086 · "Sem equilíbrio" × Caído: fechado, sem regra nova, a cargo do Mestre [tags: sem-equilibrio, caido, prono, restricao, mestre, tabela-de-situacoes]
- Data: 2026-10-10
- Decisão (despacho do autor, 10/10/2026, A6; adendo, item 12): fechado, **sem regra nova**. Fica a cargo do Mestre (D-087). A tabela de situações do livro deve dizer que alguns estados se **substituem** em vez de se somar, com o exemplo de "Sem equilíbrio" e Prono (Caído).
- Origem: despacho do autor ao Arquiteto, 10/10/2026; adendo, item 12; 2f §8.5 e §13, item 3
- Estado: encerrada como decisão. **Aviso de conferência:** o trecho que o autor citou como já existente ("a tabela de situações já diz que alguns estados se substituem") **não está no livro de hoje**: `combate.md` l.397-411 da época (Vantagem tática; hoje l.444-460) só traz o teto de ±6 do empilhamento, e a busca em `src/`, nos documentos da Veterana (1e, 2b a 2f) e no registro não achou frase parecida. A **rodada 5** escreve essa frase (uma só, deixando o caso ao critério do Mestre, com o exemplo), na tabela de situações; o "Sem equilíbrio" da tabela de restrição (D-079) fica sem soma automática com Caído. **Escrita na rodada 5** (63817b4f, veredito 158), no parágrafo da tabela de restrição (hoje `combate.md` l.491) e não na tabela de situações (a 158 achou que faz sentido; levar a frase também para a tabela de situações é caso do Mestre, D-087).

### D-087 · Princípio do Mestre: o bom senso resolve o caso de borda, e três filtros antes de perguntar ao autor [tags: mestre, regra-de-trabalho, bom-senso, pergunta, filtros]
- Data: 2026-10-10
- Decisão (despacho do autor, 10/10/2026, "regra de trabalho nova"): "O jogo tem um Mestre, responsável por entender as regras e aplicá-las com bom senso. Caso de borda que o bom senso resolve não vira regra nova nem pergunta ao autor; quando muito, vira uma frase no livro que deixa o caso ao critério do Mestre, com um exemplo. Antes de levar qualquer pergunta ao autor, passe por três filtros, nesta ordem: (1) o registro de decisões; (2) os documentos da Veterana (1b a 1e, 2, 2b a 2f); (3) se é caso para o bom senso do Mestre. Só pergunte o que passar pelos três."
- Origem: despacho do autor ao Arquiteto, 10/10/2026
- Estado: em vigor para o Arquiteto, a Executora e a Revisora. Escrita em `CLAUDE.md` (seção "Decisões de regra do autor") e repassada às duas teammates em 10/10/2026. Convive com a regra de parar e perguntar quando uma mudança contradiz decisão registrada: o filtro 1 acha a contradição, e a contradição real continua indo ao autor.

### D-088 · Bloqueio desarmado contra arma: o dano da arma passa, a Margem não [tags: bloqueio, desarmado, punhos, arma, margem, lamina, luta-desarmada]
- Data: 2026-10-10 (regra dada pelo autor antes, sem número no registro; a busca de 10/10/2026 não a achou nem em `decisoes.md` nem nos documentos da Veterana)
- **Decisão FINAL (autor, 10/10/2026, fecha a D-088):** "Punhos não bloqueiam o dano de NENHUMA arma, a não ser com aprovação do Mestre." O Bloqueio com as mãos, se supera o acerto, tira só a Margem; o dano da arma passa sempre, seja ela cortante, perfurante ou contundente. A exceção só existe com aprovação do Mestre e entra no livro como frase do Mestre (D-087), sem regra nova. Substitui por inteiro, nesse ponto, a D-057 e o item 2 da D-065. Continuam valendo as leituras a, b e d. **A dupla mista (arma numa mão, punho na outra) está fechada pelo registro: vale a D-065 item 3, "arma ou escudo e corpo não somam"; a leitura c é DESCARTADA.**
- Regra dada antes pelo autor (repassada em 10/10/2026), da qual a decisão final é a forma curta: "Os punhos podem bloquear um ataque armado. Se o Bloqueio supera o acerto, o ataque **não ganha os dados de Margem**, mas o personagem **toma o dano da arma normalmente**." Exemplo do autor: Defesa 14 + 1 + 1 dos punhos = Bloqueio 16; Esquiva 8; ataque com 15 de acerto: se esquivar, toma o dano mais 1d6 de Margem (15 − 8 = 7, uma Margem); se bloquear com as mãos, toma só o dano da arma.
- Origem: despacho do autor ao Arquiteto, 10/10/2026 (item 3 da resposta sobre a D-068 e os dois Punhos). A regra mais próxima que já estava registrada é a da lâmina: D-057 ("Mão nua contra arma cortante ou perfurante: não defende... toma o dano inteiro") e D-065 item 2 ("Quem Bloqueia sem arma um ataque cortante ou perfurante recebe o dano normalmente, mesmo que o Bloqueio supere o ataque"). Não diziam nada da Margem, e a D-057 dizia que contra contundente a mão "defende normalmente".
- Estado: **NO AR na rodada 4b (8a7a6eb0, 0dcb1e56, cda8845d; veredito 153 PROCEDE) e 4b-bis (2ef4f5b8; veredito 154 PROCEDE), CI verde em 2ef4f5b8** (decisão final do autor: o dano da arma passa sempre; frase de Mestre da exceção na 4b-bis). Histórico: registrada, **não estava no livro**: o texto entra na rodada 4b (em "Luta desarmada", `armas-e-armaduras.md`, no lugar do parágrafo "Contra lâmina, o corpo não segura", e a remissão em `combate.md`, Esquivar ou Bloquear). **Substitui, no que toca a contundente e à Margem, a D-057 e o item 2 da D-065** (contra lâmina o resultado já era o dano normal; agora vale para todo ataque armado, e a Margem é o que se perde). A Esquiva não muda (melhor das duas, como na D-065). Leituras do autor, registradas como leituras: **a)** "arma" é todo ataque que não seja desarmado: garra, mordida e chifre contam como arma, e contra soco o Bloqueio com as mãos para tudo; **b)** a armadura funciona normalmente contra o dano que passa; **d)** a "mão que conta como arma" (Mão de Ferro, Punho que Parte Pedra) bloqueia como arma e para tudo (é a D-070, sem mudança). **Leitura c) DESCARTADA** (autor, 10/10/2026: vale a D-065 item 3, "arma ou escudo e corpo não somam"; a ficha já mostra o maior dos dois e o teste da Executora-2 prende isso). **Conferência contra a D-069 e a D-070: não diverge.** A D-070 manda a mão que conta como arma bloquear como arma, inclusive lâmina (leitura d); a D-069 faz as garras de Garra e Presa e de Forma Bestial e o corpo da Pele de Pedra (nível 2 em diante) defenderem como armas, e a D-066 faz as criaturas com armas naturais bloquearem sem tomar o dano; nenhuma delas é "bloquear sem arma", então a D-088 não as toca. **Conferência na ficha e no Grid: nenhum código pede mudança.** A ficha só calcula o valor do Bloqueio (`ficha-engine.ts`, `calcConj`, `defSum`: punhos livres +1 cada, +2 com as duas mãos), nunca resolveu lâmina nem Margem, e `lance.ts`, `mesa-*.ts`, `grid.astro` e `combate.astro` não leem cortante, perfurante nem "sem arma"; o efeito é de TEXTO e de mesa de papel. Se o Grid um dia resolver o Bloqueio, a regra vira item da passada do Grid (N-grid-pendencias.md). **Nenhuma pergunta aberta.** O texto da 4b (`armas-e-armaduras.md`, Luta desarmada) já diz que o dano da arma passa; a 4b-bis acrescenta a frase do Mestre da exceção.

### D-089 · Bordão (Cajado) na Haste média; o Bastão leve fica [tags: bordao, cajado, bastao, haste, catalogo, pgr]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "O Bastão leve de 22/09 continua como está. O 'bastão' do 2b é o de duas mãos que o próprio texto agrupa com Bordão e Cajado; como a reforma do 2b foi aprovada inteira (D-082), entra no catálogo o Bordão (Cajado como outro nome), na Haste média, com os números da classe e preço pelo gerador."
- Origem: resposta do autor ao Arquiteto, 10/10/2026; colisão de nome achada pela Leitora-novata (rodada 8, relato 3.6) e pela Revisora (veredito 164, item i): o Bastão leve vem da `leitura-de-novato-decisoes.md` (item 13, 7c6ff2db); a lista da D-082 copia o 2b §0 ("Lança, Bastão, Bordão, Cajado, Tridente, Arpão").
- Estado: **NO AR desde a rodada 9** (d5be1e7b, veredito 165 PROCEDE), sem preço até a 9-bis (o preço é a D-092). As escolhas que a classe não fixava (Impacto sem perfuração, 2 kg, fôlego 24, Destreza, tag `alcance`) foram do Arquiteto pela D-087 (veredito 165, a PERGUNTA). O que estava a implementar: catálogo (`armas.json`, Haste média, 2/1/3, Velocidade 6, 1d6, Acerto +1, Defesa +2, Força×2 em duas mãos, como a classe na D-082), capítulo, ficha e teste. "Cajado" não é nome de outro item no repositório (busca em `src/`, 10/10/2026: só prosa do bestiário e as listas da Haste média em `combate.md` l.99 e `armas-e-armaduras.md` l.39), então entra como outro nome. Na lista da Haste média da D-082, "Bastão" passa a ler-se "Bordão"; o Grid herda o catálogo novo e a divergência vai para o N22.

### D-090 · Passada a Máxima, não há jogada, também no arco e na besta [tags: maxima, arco, besta, alcance, mestre]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): a frase "passada a Máxima, o projétil cai antes de chegar e não há jogada, no arco e na besta como no Arremesso" fica, sem frase extra; o Mestre sempre pode abrir exceção pela D-087.
- Origem: resposta do autor ao Arquiteto, 10/10/2026; frase escrita na 8-bis (9aaa04cf, relato da Leitora-novata §5), conferida no veredito 164 (item j: conclusão do que "Máxima" quer dizer). Completa a D-075, que só tabelava a Máxima de arcos e bestas.
- Estado: **NO AR desde a 8-bis** (9aaa04cf, veredito 164; `armas-e-armaduras.md` l.86).

### D-091 · Mão inábil sem penalidade extra; a Ambidestria vai para a recalibração das Proezas (fecha a K18) [tags: ambidestria, mao-inabil, empunhadura-dupla, ficha, tecnica, k18]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Sem penalidade extra por atacar com a mão inábil: a dupla fica em −1d6 nas duas, como na D-083 e no livro. A ficha passa a seguir o livro (hoje cobra −2d6 na inábil e −1d6 com Ambidestria). O efeito da Ambidestria vai para a recalibração das Proezas, onde já estava a candidata 'alívio de defesa'."
- Origem: resposta do autor ao Arquiteto, 10/10/2026; K18 (`K-combate-linha-do-tempo.md`); a candidata "alívio defensivo mesmo golpeando com as duas (Golpes a −2 em vez de −4)" está em `Combate_Tempo.md` l.1234-1236.
- Estado: **NO AR desde a rodada 9** (08c5e0ce, veredito 165 PROCEDE): a ficha usa `inabilPen: 1` e não lê a Ambidestria; a Técnica fica na lista com "efeito em recalibração". O que estava a implementar: `combate.md` l.203-204 perde "a Técnica Ambidestria apaga esse dado extra"; a ficha (`ficha-engine.ts`, `dupla.inabilPen`) deixa de cobrar a inábil e de ler a Ambidestria; a Técnica Ambidestria (`tecnicas.json`) perde o "em vez de −2d6, sai a −1d6" e o "−4 pelos próximos 6 Ticks" e fica na lista com a descrição e "efeito em recalibração", para não quebrar ficha salva. A K18 fecha; a Ambidestria passa ao D18 de `D-proezas-tecnicas.md`. A cláusula da D-083 ("a mão inábil vale para qualquer coisa usada nessas mãos") perde o objeto.

### D-092 · Preço do Bordão: 30 pc [tags: bordao, preco, catalogo]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026, escolha entre 30, 40 e 50 pc): 30 pc, mais barato que a Lança (50) e que o Bastão leve (40), por ser haste de madeira sem ponta de metal.
- Origem: pergunta do Arquiteto depois da rodada 9; a D-089 pedia "preço pelo gerador", e não existe gerador de preço de arma (os preços estão escritos item a item em `armas.json`; confirmado pela Executora-2 e pelo veredito 165, item B3).
- Estado: **NO AR desde a 9-bis** (2fecd972, veredito 166): o Bordão está a 30 pc na tabela de preços gerada.

### D-093 · Atlatl na ficha: as duas linhas da azagaia, sem campo novo [tags: atlatl, azagaia, ficha, tiro, b7]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026, escolha entre lacuna registrada, as duas linhas e um campo "com atlatl"): quem tem azagaia vê na ficha a linha normal e a "com atlatl" (`regras.json`, `reforma.tiro`, `azagaia-com-atlatl`); o jogador escolhe qual vale.
- Origem: o B7 da rodada 9 parou porque a ficha não guarda o atlatl (item de `armas-extras.json` que a ficha, a mesa e o Grid não leem); relato da Executora-2 e veredito 165, item B7.
- Estado: **NO AR desde a 9-bis** (2fecd972, `linhasComExtra` em `ficha-pgr.ts`; veredito 166, visto no navegador: só a azagaia ganha a linha "Com Atlatl", V8, 5/1/2). O Grid não muda (D-054); a lacuna vai no N22.

### D-094 · Sem travessão também no texto de tela [tags: travessao, escrita, interface, titulo]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026, escolha entre trocar todos, só os de frase e deixar como está): trocar todos os travessões do texto visível fora das células vazias de tabela, inclusive o título das páginas ("X · Centelha") e os rótulos da ficha e do rolador.
- Origem: o B11 da rodada 9 tirou o travessão da prosa dos dados e deixou uns 25 rótulos de interface (relato da Executora-2); o veredito 165 (a ESCALA) achou também prosa de página fora da lista (`index.astro` l.24, `caminhos/index.astro` l.11, `tecnicas.astro` l.18, `glossario.astro` l.9, `equipamentos.astro` l.35 e l.103, `ficha.astro` l.5, `mesa/combate.astro` l.1997).
- Estado: **NO AR desde a 9-ter** (1b605f3e e 4c7067f4, vereditos 166 e 167): títulos "X · Centelha", rótulos e prosa de página sem travessão, e o teste falha se ele voltar. Ficam de fora as células vazias de tabela, o `monsters.json` e o bestiário (B14) e o que só o Grid lê (D-054).

### D-095 · Bestiário novo: a ficha de criatura sai das descrições da ficha humana, sem fórmula única [tags: bestiario, metodo, criatura, atributos, conversao, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): a ficha de criatura sai das descrições da ficha humana (Atributos, Habilidades, Força de Vontade etc.), porque o sistema se baseia no mundo real. Não há fórmula única. Cada número leva justificativa (qual descrição do sistema ele cumpre) e passa por um teste de ordem entre criaturas (exemplo do autor: o gorila mais fraco é mais forte que qualquer humano, ao contrário do Pathfinder). Ordem do trabalho: regra de construção; fichas de referência aprovadas pelo autor; bancada; comparação com D&D e Pathfinder; tabela de conversão; conversão do resto com validador.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026, depois do diagnóstico do bestiário (`../tmp/arquiteto/bestiario/diagnostico.md`, fora do repositório), que mostrou que as 309 fichas vieram de uma tabela de equivalência a partir dos valores de D&D e Pathfinder.
- Estado: a implementar (pendência B20). Substitui, para as fichas refeitas, o método da conversão de 2026 (tabela de equivalência D&D → Centelha, `conversao-monstros.html`), que passa a ser só um passo de comparação.

### D-096 · O trabalho do bestiário é todo em P/G/R [tags: bestiario, pgr, normal, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): tudo em P/G/R; o sistema Normal fica de lado por enquanto, em todo o trabalho.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026.
- Estado: vale para a B20. Não revoga a D-082 nem o Normal no livro; diz só em que sistema as fichas novas se constroem e se medem.

### D-097 · Um ataque por ação, também para as criaturas [tags: bestiario, ataque, acao, d-068, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): um ataque por ação (D-068), também para as criaturas.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026; confirma para o bestiário a D-068 e a cláusula dos dois Punhos da D-083 (só as mãos fazem par), já anotadas na B14.
- Estado: vale para a B20. O diagnóstico conta 11 fichas com 2 ataques e 15 com "multiataque" na prosa; elas se refazem por esta regra.

### D-098 · Todo animal comum tem Centelha 0; o piloto são todos os animais adultos, inclusive os pré-históricos [tags: bestiario, animal, centelha, piloto, pre-historico, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): todo animal comum tem Centelha 0. O piloto são todos os animais, inclusive os pré-históricos (dinossauros de vários tipos e portes, pterossauros, répteis marinhos, mamute e outros), na versão adulta. Filhote, atroz e de guerra ficam para depois.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026. Hoje há 84 fichas na categoria Animal, todas com Centelha 0 (diagnóstico, seção g).
- Estado: a implementar (B20). Nove pré-históricos já têm ficha, e os outros são criaturas novas (inventário de 10/10/2026, `../tmp/arquiteto/bestiario/inventario.md`, item 10). As bordas do inventário fecharam em 10/10/2026: os 16 "gigantes" entram no piloto como animais, com Centelha 0 (D-105); os "atroz" com nome de espécie extinta entram como pré-históricos, e não como "versão atroz" (D-106, leitura g). Ficam para depois só os atroz sem espécie real (Morcego, Rato e Carcaju Atroz).

### D-099 · Habilidades dos animais: Briga, Bloqueio e Esquiva sempre; nunca Atirador, Armas ou Arremesso [tags: bestiario, animal, habilidades, briga, bloqueio, esquiva, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): todo animal tem Briga, Bloqueio e Esquiva; nenhum tem Atirador, Armas ou Arremesso. Percepção, Furtividade e Atletismo entram quando o animal real se destaca nisso (leitura aceita pelo autor). Criaturas complexas e humanoides têm também as outras Habilidades e os conhecimentos.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026.
- Estado: a implementar (B20). Leitura de 10/10/2026 (D-106, a): "Percepção" aqui quer dizer Prontidão, a Habilidade de notar (Percepção é Atributo). Pela D-106 (d), Prontidão e Integridade ficam ao lado de Briga, Bloqueio e Esquiva, e a regra de construção decide em quais animais. Pela D-109 (10/10/2026), todo animal ganha também Sobrevivência; pela D-111, criaturas podem ter Habilidades secundárias.

### D-100 · Bloqueio de animal: como a mão nua; chifre, galhada e carapaça bloqueiam como arma [tags: bestiario, animal, bloqueio, mao-nua, d-088, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): a maioria dos animais prefere esquivar, mas todos têm algum Bloqueio (o gato apara com a pata). O animal bloqueia como a mão nua (D-088): tira a Margem e toma o dano. Chifre, galhada e carapaça bloqueiam como arma.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026. Ajusta a linha da D-066 anotada na B14 ("quase todas bloqueiam sem tomar dano"): para os animais, só chifre, galhada e carapaça bloqueiam sem tomar dano.
- Estado: a implementar (B20). O efeito continua este; o VALOR do Bloqueio passou a sair do quanto o animal bloqueia na vida real (D-110).

### D-101 · O que não é ponto vai num campo próprio, por categoria; armadura natural, veneno, constrição, enxame, montaria e comportamento [tags: bestiario, esquema, veneno, absorcao, agarrao, enxame, montaria, carga, comportamento, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): o que não é ponto na ficha vai num campo próprio, padronizado e por categoria, para ser consultado depois (por exemplo, puxar todos os venenos). Armadura natural é absorção extra, não Defesa. Veneno: só o id do veneno, num catálogo próprio de venenos, sem a regra completa por enquanto. Constrição é Agarrão; o animal só imobiliza com toxina ou algo que paralise. Enxame é uma criatura só. Montaria e animal de carga são duas marcas separadas, sem regra agora. Comportamento vem do animal real; no extinto, da pesquisa, ou de extrapolação marcada como tal.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026. O esquema proposto sai do inventário (`../tmp/arquiteto/bestiario/inventario.md`).
- Estado: a implementar (B20). O Grid lê `monsters.json`, `monsters-mesa.json` e `inimigos.json` e está congelado (D-054): a ficha nova continua gerando esses arquivos no formato velho, ou a diferença vai para o N22. A primeira entrada nova do catálogo de venenos é a peçonha botrópica, só com o nome (D-112).

### D-102 · Imagens do bestiário: as atuais ficam até a troca; as novas saem do ChatGPT com guia de estilo [tags: bestiario, imagens, estilo, licenca, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): as imagens atuais (a maioria do Pathfinder) ficam até serem substituídas uma a uma, começando pelas que vieram dos livros. As novas saem do ChatGPT, com um guia de estilo escrito e um arquivo de descrição visual por criatura (só traços físicos, texto próprio); as imagens atuais não entram no gerador. Fundo chapado com remoção, se o gerador não entregar transparência.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026; o diagnóstico conta 308 imagens WebP, quase todas extraídas de livros fechados, e nenhum guia de estilo.
- Estado: a implementar (B20).

### D-103 · Fontes do bestiário fora do repositório [tags: bestiario, fontes, livros, pesquisa, licenca, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): as fontes ficam em `C:\Users\Neves\ClaudeCode\centelha\fontes-bestiario\`, com três subpastas: `livros\` (os livros que o autor fornecer, que nunca entram no rpg-system), `pesquisa\` (dados de animais reais e extintos, um arquivo por animal, com o link de cada dado) e `fatos\` (o que foi extraído dos livros e da pesquisa, um arquivo por criatura). Só a ficha final entra no repositório; texto de livro não é copiado para ficha nem para site, só os fatos.
- Origem: mensagem do autor ao Arquiteto, 10/10/2026.
- Estado: a pasta espera um ajuste do portão: a seção 7 de `scripts/test-portoes.mjs` (l.480-481) só aceita as quatro árvores, `tmp/`, `LEIA-ME.md` e `centelha-mudanca/` na pasta `centelha\`, e uma pasta nova ali deixa vermelho o `pre-commit` de todas as frentes. O ajuste é acrescentar `fontes-bestiario` à lista. **Feito em 10/10/2026** (019f0298, autorizado pelo autor, CI verde): nenhuma pasta acima de `centelha\` é repositório, então não precisou de `.gitignore`; a pasta, as três subpastas e o `README.md` existem.

### D-104 · Atributo acima de 6: o teto 6 é o humano, e cada espécie tem a sua faixa natural [tags: bestiario, atributos, teto, especie, centelha, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): o teto 6 é o teto humano. Cada espécie tem a sua faixa natural, que vem da realidade, e a Centelha abre o que passa da faixa da espécie.
- Origem: resposta do autor ao inventário do bestiário (`../tmp/arquiteto/bestiario/inventario.md`, item 8): 27 dos 84 animais têm Força acima de 6 com Centelha 0, contra `atributos.md` l.74 ("acima de 6 só se abrem pela Centelha"). Completa a D-095 (o gorila mais fraco é mais forte que qualquer humano).
- Estado: a implementar. O livro (`src/content/chapters/atributos.md` l.74) ganha uma frase dizendo isso, numa rodada de texto (item anotado na B20); nada escrito ainda. Os extremos (o animal mais forte que qualquer humano) se corrigem por Habilidades secundárias de criatura (D-111). **Atualizado em 10/10/2026 (D-115):** os extremos se corrigem pelo porte, pela anatomia e pelas secundárias.

### D-105 · Animal gigante continua animal, com Centelha 0 [tags: bestiario, gigante, animal, centelha, porte, piloto, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): animal gigante continua animal, com Centelha 0. Centelha é sobrenatural, não tamanho nem força. Os 16 gigantes entram no piloto; a ficha parte do animal real e escala pelo porte, e o motivo de existirem fica na descrição, não na mecânica.
- Origem: resposta do autor ao inventário do bestiário (item 10, `bordas.gigantesSemAnimalReal`): formiga, vespa, centopeia, caranguejo, aranha, escorpião, louva-a-deus, besouro-veado, sanguessuga, lesma, rã, rato, lagarto de gola, moreia, polvo e lula.
- Estado: a implementar (B20). Ajusta o Estado da D-098, que listava os gigantes como borda aberta.

### D-106 · Leituras do inventário do bestiário (o autor não vetou) [tags: bestiario, leitura, prontidao, atributos, vontade, absorcao, visual, pre-historico, b20]
- Data: 2026-10-10
- Leituras (Arquiteto e instância de leitura, apresentadas ao autor em 10/10/2026; o autor não vetou):
  - a) A D-099 troca "Percepção" por "Prontidão", que é a Habilidade de notar.
  - b) Nenhum Atributo fica em 0 (o livro, `atributos.md` l.18): os 13 animais com algum Atributo em 0 sobem para 1. A Inteligência 1 de um animal é instinto. O 0 fica para quem não tem a faculdade (construto, limo), quando chegarmos neles.
  - c) A Vontade 5 de 81 animais é o padrão do código, não a régua do livro. A regra de construção recalcula a Vontade de cada animal.
  - d) Prontidão e Integridade ficam ao lado de Briga, Bloqueio e Esquiva; a regra de construção decide em quais animais.
  - e) A armadura natural é "absorção extra" (D-101): soma com a couraça do porte, não a substitui.
  - f) A descrição visual de cada criatura (D-102) fica em `docs/bestiario/visual/<id>.md`.
  - g) Os "atroz" com nome de espécie extinta são animais reais e entram como pré-históricos, não como "versão atroz": Símio Atroz (`mon-dire-ape-gigantopithecus`, gigantopiteco), Urso Atroz (`mon-dire-bear-cave-bear`, urso-das-cavernas), Javali Atroz (`mon-dire-boar-daeodon`, daeodon), Hiena Atroz (`mon-dire-hyena-hyaenodon`, hienodonte), Leão Atroz (`mon-dire-lion-spotted-lion`, leão-das-cavernas), Tubarão Atroz (`mon-dire-shark-megalodon`, megalodonte) e Lobo Atroz (`mon-lobo-atroz`, o lobo-terrível que o autor cita). Ficam como "versão atroz", para depois (D-098): Morcego Atroz, Rato Atroz e Carcaju Atroz, sem espécie real no nome.
- Origem: inventário do bestiário (`../tmp/arquiteto/bestiario/inventario.md`, itens 8 a 10 e a ressalva sobre a D-099); resposta do autor de 10/10/2026.
- Estado: leituras registradas para a regra de construção da B20. O inventário e o `escala.md` (`../tmp/arquiteto/bestiario/`) ficam como base. A próxima etapa (pesquisa e regra de construção) espera a lista de referência do autor e não começou. **Atualizado em 10/10/2026:** a leitura c) foi fechada pela D-108 (Vontade do animal de 3 a 6).

## Respostas do autor à regra de construção e às fichas piloto do bestiário (10/10/2026)

As D-107 a D-114 são a resposta do autor ao rascunho da regra de construção e às três fichas piloto (lobo, cavalo e urso-pardo), que estão fora do repositório em `../tmp/arquiteto/bestiario/` (`regra-construcao.md`, `fichas-piloto.md`, `tabela-comparada.md`, `resumo-pesquisa.md`). Nada disso foi para `src/`. Ficaram abertas, para análise antes de decidir, a curva dos Atributos acima de 6 (a Força acima de 13 entra aqui) e a velocidade dos animais (`../tmp/arquiteto/bestiario/crescimento-atributos.md`).

### D-107 · Aparência dos animais: régua de comparação humana, a maioria no 6 [tags: bestiario, animal, aparencia, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Aparência dos animais: régua de comparação humana. A maioria fica no 6 (comum), alguns acima ou abaixo pela pelagem, pele, penas e cuidado. A faixa vai de 4 (Feio) a 8 (Atraente), e alguns podem ter Aparência bem baixa, medonha. A repulsa humana (aranha, rato, cobra) não precisa entrar na mecânica."
- Origem: questão 6 do rascunho da regra de construção (opções: manter 4 em todos, tirar a Aparência do animal, faixa pela reação humana).
- Estado: a implementar (B20). Substitui, para as fichas novas, o padrão 4 do código (`AP_BASE`, `scripts/lib-bestiario.mjs` l.246). Os rótulos são os de `regras.json` `escalaAparencia` (4 Feio, 6 Comum, 8 Atraente).

### D-108 · Força de Vontade dos animais: de 3 a 6, a maioria perto de 3 [tags: bestiario, animal, vontade, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Força de Vontade dos animais: de 3 a 6, a maioria perto de 3. Isso substitui a escala de 1 a 5 da seção 4 da regra."
- Origem: seção 4 do rascunho da regra de construção (1 a presa que foge, 2 ou 3 o predador comum, 4 ou 5 a espécie que não desiste).
- Estado: a implementar (B20). Fecha a leitura c) da D-106 (a Vontade 5 de 81 animais era o padrão do código). Nenhum animal fica abaixo de 3.

### D-109 · Defesa Social do animal: ele ganha Sobrevivência, e a fórmula da fera fica como está [tags: bestiario, animal, defesa-social, sobrevivencia, habilidades, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Defesa Social: o animal ganha Sobrevivência, e a fórmula da fera no livro fica como está. Um dos motivos de refazer as fichas é cobrir Habilidades que não estavam contadas."
- Origem: questão 4 do rascunho (a Defesa Social da fera é (Compostura + Sobrevivência) × 2, `defesas.md` l.75, e a D-099 não dava Sobrevivência ao animal).
- Estado: a implementar (B20). Acrescenta Sobrevivência à lista fixa da D-099 (Briga, Bloqueio e Esquiva, com Prontidão e Integridade ao lado, D-106 d). Não muda fórmula nenhuma do livro.

### D-110 · Bloqueio do animal: o valor sai do quanto ele bloqueia na vida real; o efeito segue a D-100 [tags: bestiario, animal, bloqueio, d-100, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Bloqueio: o VALOR mede o quanto o animal bloqueia na vida real (o lobo quase não bloqueia, porque a mordida não defende; o gato apara com patadas; o alce bloqueia muito com a galhada e pode ter 3). O EFEITO segue a D-100 (pata, focinho e corpo: tira só a Margem; chifre, galhada e carapaça: param o golpe). A tabela da seção 3 deixa de decidir o valor pelo tipo de defesa. O urso com Bloqueio 2 está certo."
- Origem: linha do Bloqueio na tabela da seção 3 do rascunho (1 para quem apara com pata ou corpo, 2 a 3 para chifre, galhada ou carapaça) e o Bloqueio 2 do urso-pardo piloto.
- Estado: a implementar (B20). Não muda a D-100 nem a D-088 (o efeito). "Quase não bloqueia" é 1, e não 0, porque a D-100 diz que todos os animais têm algum Bloqueio. Essa leitura ficou (D-116 e, 10/10/2026).

### D-111 · Criaturas podem ter Habilidades secundárias, inclusive próprias; é por elas que se corrigem os extremos [tags: bestiario, criatura, habilidades-secundarias, forca, d-095, d-104, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Habilidades secundárias: criaturas podem ter Habilidades secundárias, inclusive algumas que não existem na ficha de personagem. É por elas que se corrigem os extremos (por exemplo, o animal mais forte que qualquer humano). Isso substitui a questão 2 do seu rascunho."
- Origem: questão 2 do rascunho (em qual régua o animal é "mais forte que qualquer humano": Força crua, peso máximo P acima de 500 kg, ou Halterofilismo equivalente). O conflito: o humano de Força 6 e Halterofilismo 6 levanta 500 kg, o mesmo que um animal de Força 8 sem Halterofilismo.
- Estado: a implementar (B20). Completa a D-095 e a D-104. Quais secundárias, e com que números, depende da análise da curva dos Atributos (em aberto). **Atualizado em 10/10/2026:** as secundárias são a terceira camada da D-115, para o que o porte e a anatomia não encaixam; sem secundária de Corrida por enquanto (D-116 c).

### D-112 · Jararaca é a quarta ficha piloto; o catálogo de venenos ganha a peçonha botrópica só com o nome [tags: bestiario, animal, jararaca, veneno, piloto, d-101, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Jararaca: entra como a quarta ficha piloto. Ela ganha uma entrada no catálogo de venenos só com o nome (peçonha botrópica), sem regra nem números, como o autor já tinha decidido para os venenos."
- Origem: questão 5 do rascunho (`src/data/venenos.json` não tem entrada para ela). "Como o autor já tinha decidido" é a D-101 (veneno só por id, num catálogo próprio, sem a regra completa por enquanto).
- Estado: a implementar (B20). A entrada em `venenos.json` entra quando a ficha for para o repositório, e não antes: a ordem de 10/10/2026 é que nada vá para `src/` nesta etapa. A ficha rascunho aponta o id `peconha-botropica`.

### D-113 · Urso-pardo piloto aprovado como está [tags: bestiario, animal, urso, piloto, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Urso-pardo: aprovado como está."
- Origem: ficha piloto do urso-pardo (`../tmp/arquiteto/bestiario/fichas-piloto.md`, seção 3): Força 8, Destreza 3, Vigor 5, Briga 4, Bloqueio 2, Vontade 4, patada 1d6 + 8.
- Estado: aprovado, fora do repositório. Leitura do Arquiteto: as regras gerais da mesma resposta valem por cima da ficha aprovada, e a ficha ganha Sobrevivência (D-109) e Aparência pela D-107, que ela não tinha. O deslocamento dela (8/12/17 m por Tick) fica fora da aprovação, porque a velocidade dos quadrúpedes ficou aberta (D-114). A leitura ficou (D-116 e, 10/10/2026).

### D-114 · Cavalo: o recorde do puro-sangue não vale para o cavalo de sela; a velocidade dos animais fica aberta [tags: bestiario, animal, cavalo, deslocamento, velocidade, c-009, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Cavalo e quadrúpedes: o recorde do puro-sangue não vale como velocidade do cavalo de sela. A questão de velocidade fica aberta."
- Origem: o deslocamento 9/14/20 do cavalo piloto, tirado do recorde do puro-sangue em 402 m (70,35 km/h), e a questão 3 do rascunho (a velocidade real contra a C-009, que diz "ft ÷ 10 = m/Tick de batalha").
- Estado: aberta. A C-009 segue no ar. O autor levantou três caminhos, nenhum decidido: velocidade por criatura a partir do dado real; bônus de velocidade por criatura somado à fórmula humana; uma Habilidade secundária Corrida com Especialização. A análise com os números vai em `../tmp/arquiteto/bestiario/crescimento-atributos.md`. **Atualizado em 10/10/2026:** o modelo da velocidade foi decidido pela D-115 (fórmula humana × porte × anatomia, e a camada 3 para o resto), e a secundária Corrida saiu por enquanto (D-116 c). Os números (os modificadores e a velocidade do cavalo de sela) seguem em rascunho, em `../tmp/arquiteto/bestiario/porte-anatomia.md`.

## Três camadas para o tamanho e a anatomia das criaturas (10/10/2026)

### D-115 · Três camadas: modificador de porte, modificador de anatomia e Habilidades; a Força é universal [tags: bestiario, criatura, porte, anatomia, forca, peso, arremesso, deslocamento, velocidade, agarrao, habilidades-secundarias, d-104, d-111, d-114, b20]
- Data: 2026-10-10
- Decisão (autor, 10/10/2026): "Três camadas, usadas juntas:
  1. MODIFICADOR DE PORTE: criaturas maiores erguem mais peso e correm mais rápido que as menores. É um multiplicador acima de 1 para os portes maiores que Médio e entre 0 e 1 para os menores. O arremesso segue o peso que se ergue, então leva o mesmo modificador. O porte também afeta o agarrar (o grande agarra o pequeno com mais facilidade que o contrário) e já afeta o acerto (regra existente). O autor deu esses exemplos sem entrar nas regras: o agarrar e o resto ficam para depois; não escreva regra para eles agora, só anote.
  2. MODIFICADOR DE ANATOMIA: criaturas com anatomia diferente do humanoide puro têm modificadores para a velocidade e, se for o caso, para o peso erguido, o arremesso e o resto. Também é multiplicador, acima de 1 ou entre 0 e 1. Exemplo do autor: pelo porte, o gorila correria mais que o humano, mas a anatomia dele não deixa; o modificador de anatomia corrige isso.
  3. Habilidades, Habilidades secundárias e Especialidades (em ambas) cobrem os casos que os modificadores não encaixam.
  A Força é universal: Força 4 bate como Força 4 em qualquer criatura (dano, limite do Bloqueio, agarrão). O porte muda o peso, não o dano."
- Origem: resposta do autor à análise da curva dos Atributos e da velocidade (`../tmp/arquiteto/bestiario/crescimento-atributos.md`), 10/10/2026.
- Estado: a implementar (B20). Os números (faixas de massa, os modificadores de cada porte e de cada anatomia, as quatro fichas refeitas) estão em rascunho em `../tmp/arquiteto/bestiario/porte-anatomia.md`, esperando o autor. **O agarrar pelo porte fica anotado, sem regra**, como o autor pediu. Completa a D-104 e a D-111; dá modelo à velocidade aberta pela D-114.

### D-116 · Leituras da D-115 (o autor não vetou) [tags: bestiario, leitura, porte, gorila, arranque, forca, corrida, dano, bancada, b20]
- Data: 2026-10-10
- Leituras (Arquiteto, apresentadas ao autor em 10/10/2026; o autor não vetou):
  - a) O gorila é Grande (dito pelo autor). A fronteira entre Médio e Grande da régua de porte por massa se ajusta para que ele caia em Grande.
  - b) Na criatura, a Força entra no Arranque só até 6; acima disso a velocidade vem do porte e da anatomia. Nos humanos nada muda.
  - c) Sem secundária de Corrida por enquanto.
  - d) A Força dos animais grandes se escolhe pelo dano que eles devem causar, conferido na bancada; o peso vem do porte. Saem as faixas de Força 30 a 100 (tiranossauro) e similares.
  - e) As leituras do Arquiteto na D-113 (o urso ganha Sobrevivência e Aparência) e na D-110 (o lobo com Bloqueio 1) ficam.
- Origem: mensagem do autor de 10/10/2026, junto da D-115.
- Estado: leituras registradas para a regra de construção da B20. Pelo rascunho (`../tmp/arquiteto/bestiario/porte-anatomia.md`), a fronteira da leitura a) desce de 220 para 130 kg (o gorila macho pesa em média de 136 a 180 kg); isso ainda é proposta, não decisão.

### M-32 · Sem a Força, o Arco Composto rende como um Arco Longo (registro retroativo, achado na revisão 147) [tags: arco-composto, forca, forcaMin, calc, ficha]
- Data: 2026-09-15
- Decisão (texto completo em `docs/simulacao/caixa/jogador-novo-decisoes.md`, seção "M-32"): abaixo de Força 4, o Arco Composto soma `Força×1` e parte de `+0`, os números do Arco Longo; a arma não fica proibida, fica "um arco comum caro". O campo é `forcaMin: 4` em `armas.json`, lido por `calc.ts` (`comRequisitoDeForca`), `ficha-engine.ts` e `combate-resumo.ts`.
- Origem: decisão do autor de 15/09/2026 (jogador-novo)
- Estado: no ar. **Convive com a D-075**: a "Força mínima" da D-075 (Força máxima do arco − 3, só em arco com Força máxima definida) é outra regra, sobre armar o arco; o `forcaMin: 4` do Composto NÃO é essa Força mínima e não se remove por causa dela (revisão 147, ponto 6). Frase sugerida para o texto da rodada 2: "O Arco Composto só rende o dobro da Força, e o bônus de +2, com Força 4 ou mais; com menos, rende como um Arco Longo. Isso não é a Força mínima dos arcos reforçados, que é uma regra à parte."
