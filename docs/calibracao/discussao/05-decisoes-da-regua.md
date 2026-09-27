# 05 · Decisões que travam a régua

26/09/2026 · Frente A · Para decisão conjunta do autor, após segunda opinião externa.

**Status:** nenhuma opção abaixo está aprovada. Ordem: A1 → A2 → A3 → A4 → A5. Este documento não refaz `01-regua.md` nem inicia lotes. FATO indica fonte verificável; INFERÊNCIA indica interpretação ou cálculo; PROPOSTA indica escolha ainda sujeita ao autor. Probabilidades exatas antes do arredondamento a quatro casas, sem simulação aleatória.

## A1. Dificuldade por Centelha e personagem de referência

### FATO · O que existe

> **superar** (empate falha). A régua vai de 5 em 5: 5 Fácil, 10 Média, 15 Difícil, 20 Limite humano,
> 25 Excepcional, 30 Sobre-humano

Fonte: [docs/export/proezas/centelha-dossie.md:35](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:35). Dificuldade é o alvo de uma ação. Nível de desafio de criatura é outra medida, discutida em A5.

> **NÃO EXISTE** uma tabela publicada de
> "personagem nível X tem estes números"

Fonte: [docs/export/proezas/centelha-dossie.md:113](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:113). Há exemplos isolados, como Kael com Destreza 4, Esquiva 3 e Centelha 3. Não estabelecem fichas típicas por Centelha.

A fonte central acrescenta uma referência que o resumo do dossiê não detalha: `regras.dificuldade` associa D5 à soma 3 (Iniciante), D10 à soma 6 (Competente), D15 à soma 9 (Perito), D20 à soma 12 (Mestre), D25 à soma 15 (Herói) e D30 à soma 18 (Semideus). Exemplos literais do campo `aaltura`: `"12 · Mestre"`, `"18 · Semideus"`. Fonte: [src/data/regras.json:661](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:661). **É uma associação entre proficiência e tarefa, não uma tabela de Atributo/Habilidade por Centelha.** O nome Semideus não prova que todo C6 tenha soma 18.

> a metade dessa soma (arredondada para baixo) vira a quantidade de dados de 6 lados
> rolados; se a soma for **ímpar**, soma-se um bônus fixo de **+2** ao resultado

Fonte: [docs/export/proezas/centelha-dossie.md:29](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:29). Ataques somam também Acerto da Arma e Centelha; testes genéricos não recebem Centelha automaticamente (dossiê, linha 76). Não há no dossiê uma tabela de Dificuldade típica indexada por C0–C6.

### INFERÊNCIA · O que “passar” significa

Para soma S: `n=piso(S/2)` dados, mais `2×(S mod 2)` e modificadores pertinentes. Contra D15: total 15 falha; 16–20 passa sem Margem; 21 alcança uma Margem. A chance é `P(total>D)`, nunca `P(total≥D)`.

Mestre de soma 12: 6d6, média 21, mínimo 6 e máximo 36. Média 21 não significa sucesso garantido contra D20. “Passarem dificuldade para vencer, gastando recursos e se ferindo”, na definição do bestiário, não fixa porcentagem de acerto, duração, gasto ou risco de derrota. Não se pode extrair uma chance única dessa frase.

### PROPOSTA · Perfis mínimos de bancada, a aprovar junto com A1

| C | Atributo + Habilidade propostos | Soma | Rolagem | Média |
|---|---|---:|---|---:|
| 0, controle mortal | 2 + 2 | 4 | 2d6 | 7 |
| 1 | 3 + 3 | 6 | 3d6 | 10,5 |
| 2 | 4 + 3 | 7 | 3d6+2 | 12,5 |
| 3 | 4 + 4 | 8 | 4d6 | 14 |
| 4 | 5 + 4 | 9 | 4d6+2 | 16 |
| 5 | 5 + 5 | 10 | 5d6 | 17,5 |
| 6 | 6 + 6 | 12 | 6d6 | 21 |

São perfis de teste, não fichas publicadas nem tetos de atributo. A futura régua deve testar também S−2/S+2 e soma 18 em C6, por causa da referência central. Sem aprovação do perfil, nenhuma probabilidade abaixo é “chance típica do personagem real”.

### PROPOSTA · Duas opções de tabela

| C | A1a: referência ligada à proficiência | A1b: desafio heroico crescente |
|---|---:|---:|
| 0 | 5 | 5 |
| 1 | 10 | 10 |
| 2 | 15 | 15 |
| 3 | 15 | 20 |
| 4 | 20 | 25 |
| 5 | 20 | 30 |
| 6 | 25 | 35 |

**Conta A1a:** em C1–C6, `D=5×piso((2S+2,5)/5)`: arredondar 2S ao múltiplo de cinco mais próximo. Inspiração: a parcela `2×(Destreza+Esquiva)` da Defesa física. Transportá-la para tarefas é **proposta**, não regra do livro nem reprodução de `aaltura`. C0 é controle separado, em D5.

**Conta A1b:** `D=5(C+1)`. Usa degraus publicados até D30; D35 é extensão proposta, sem nome publicado. Não significa que toda porta ou rastro fique mais difícil quando o personagem sobe.

| Opção | Prós | Contras | O que muda na régua |
|---|---|---|---|
| A1a | Mantém os degraus publicados; compara vantagem sobre uma base de proficiência. | Arredondamento produz patamares repetidos e chances irregulares; a escolha de 2S é uma convenção. | Mede ganho de confiabilidade; bônus altos tendem a saturar a chance. |
| A1b | Cada C enfrenta nova exigência; deixa espaço para feitos além da aptidão básica. | Perfis propostos ficam insuficientes sem poderes; inventa D35 e pode tornar a compra de bônus obrigatória. | Mede acesso a desafios novos; o mesmo bônus pode parecer necessário em vez de excessivo. |

**Recomendação, PROPOSTA:** A1a como referência principal e A1b como controle exigente, para separar confiabilidade de acesso a feitos novos. Se a intenção for que o desafio típico já exija Proeza, A1b corresponde melhor. Aprovar tabela e perfis juntos; não confundir mestre de soma 12 com todo personagem C6.

## A2. Acumular ou substituir

### FATO · Cadeias reais

Mãos Hábeis (`maos-habeis`, N1):

> +3 em Ofícios; conserta e improvisa com facilidade.

Obra Bem-Feita (`obra-bem-feita`, N2, requer `maos-habeis`):

> +4 em qualquer ofício ou reparo; enxerga a solução técnica que trava os outros.

Fontes: [docs/export/proezas/proezas-completas.md:241](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:241) e [docs/export/proezas/proezas-completas.md:280](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:280). O texto não diz “substitui” nem “mais +4”.

Rastreador (`rastreador`, N1):

> +3 para rastrear e ler sinais.

Trilha Certa (`trilha-certa`, N2, requer `rastreador`):

> +4 para rastrear e seguir; lê num relance a idade de um rastro e a pressa de quem o deixou.

Fontes: [docs/export/proezas/proezas-completas.md:846](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:846) e [docs/export/proezas/proezas-completas.md:885](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:885).

Pele Curtida (`pele-curtida`, N1):

> +2 de Absorção contra Impacto.

Couro Endurecido (`couro-endurecido`, N2, requer `pele-curtida`):

> A pele curte-se: +3 de Absorção contra Impacto e +2 contra Corte, sem pesar no movimento.

Fontes: [docs/export/proezas/proezas-completas.md:4139](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:4139) e [docs/export/proezas/proezas-completas.md:4178](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:4178).

**O último caso já tem regra específica publicada**, não detalhada no dossiê:

> **Absorção de Proeza** não soma entre passivas: vale a **maior** de cada tipo de dano (Impacto, Corte, Perfuração).

Fonte: [src/content/chapters/combate.md:457](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/combate.md:457). O mesmo parágrafo permite bônus reflexivos/de cena por cima, só naquele golpe. Linhas 437, 451, 458 e 459 também limitam uma reflexiva por gatilho, até C posturas, Defesa reflexiva pelo teto situacional ±6 e uma ação extra por 6 Ticks. Essas exceções precisam sobreviver à decisão geral.

### INFERÊNCIA · Máximos das cadeias citadas

Máximo de contribuição das **duas Técnicas daquela cadeia**, ambas compradas, ao mesmo uso elegível. Não é o máximo universal da ficha com armas, Firula, outras Técnicas e efeitos qualitativos.

| Cadeia real | Escopo | Somar | Maior bônus | Situação |
|---|---|---:|---:|---|
| Mãos Hábeis → Obra Bem-Feita | Ofícios | +7 | +4 | regra geral pendente |
| Rastreador → Trilha Certa | rastrear | +7 | +4 | regra geral pendente |
| Pele Curtida → Couro Endurecido | Absorção de Impacto | +5 | +3 | regra específica já determina +3 |
| Mesma cadeia de pele | Absorção de Corte | +2 | +2 | primeira Técnica não concede Corte |

Somar as passivas de pele mudaria regra existente. Substituir parcela numérica não deve apagar automaticamente capacidades distintas, como ler a idade de um rastro.

A escala central `3,4,6,9,12,15` soma **49** se interpretada como seis incrementos cumulativos ([src/data/regras.json:119](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:119)). É uma série hipotética da escala, **não uma cadeia real demonstrada de seis bônus equivalentes**. Forja dos Deuses não tem Obra Bem-Feita como antecessora e contém capacidades qualitativas: não se pode atribuir +49 a essa cadeia. “Reduz drasticamente” em Pele Adamantina tampouco determina máximo numérico.

### PROPOSTA · Opções

| Opção | Prós | Contras | O que muda na régua |
|---|---|---|---|
| A2a. Somar parcelas equivalentes salvo proibição específica | Cada compra acrescenta potência. | Total depende da quantidade de antecessores/ramos; incentiva colecionar bônus. | Orçar o total da cadeia; `3N` como incremento chegaria a 63 numa série completa. |
| A2b. Maior parcela por família e escopo, com exceções explícitas | Permite comparar patamares apesar de árvores desiguais. | Exige mapear sobreposição; compras anteriores podem perder valor numérico. | Escala expressa total final: `3N` chega a 18. |

**Recomendação, PROPOSTA:** A2b, pela comparabilidade. Não inferir família só de `caminho` ou `prereq`; uma dependência pode ser outra capacidade. Preservar exceções publicadas e registrar conflitos. Se A2a vencer, ler A3 como **total desejado**, e derivar incrementos que produzam esse total.

## A3. Escala de bônus relativa à Dificuldade

### FATO · Referências

O autor cogitou “+3 pontos por nível, chegando até +18”, sem aprovar. Escala central: `+3,+4,+6,+9,+12,+15` ([src/data/regras.json:119](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:119)). O capítulo diz:

> o alto é quase perfeito (um +15 só é contestado por outro semideus ou um abismo de atributo).

Fonte: [src/content/chapters/centelha.md:65](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/centelha.md:65). Expressa intenção de confiabilidade alta, sem fixar adversário ou chance.

### PROPOSTA · Três alternativas

| Opção | Totais N1–N6 | Prós | Contras | Consequência na régua |
|---|---|---|---|---|
| P1, candidato do autor: 3N | 3,6,9,12,15,18 | Simples; acompanha A1b com estes perfis. | Quase elimina incerteza em A1a; também amplia Margens e pode multiplicar produção em Longas. | Orçar a quase certeza e seu efeito secundário no dano. |
| P2, escala central atual | 3,4,6,9,12,15 | Referência existente; menor que P1. | Ainda satura A1a no topo; crescimento irregular. | Menor salto não dispensa avaliar os demais efeitos. |
| P3, controle conservador: N | 1,2,3,4,5,6 | Deixa espaço para dados, Habilidade e Firula em A1a. | Quase não acompanha A1b; pode contrariar a intenção “quase perfeito”. | Mais distinção entre níveis precisaria vir de capacidades e escopos, a definir depois. |

**INFERÊNCIA · Método:** N=C, Técnica máxima acessível. `P(soma dos nd6 + 2(S mod 2) + B > D)`. Sem Firula, arma, ferimentos, especialidade, Centelha ou outro poder: são **testes genéricos, não ataques**. Bônus são totais finais, sob A2b ou sob incrementos equivalentes em A2a.

**Contra A1a**

| C / N | Soma | D | Sem Técnica | P1: +3N | P2: atual | P3: +N |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 6 | 10 | 50,0000% | 83,7963% | 83,7963% | 62,5000% |
| 2 | 7 | 15 | 16,2037% | 83,7963% | 62,5000% | 37,5000% |
| 3 | 8 | 15 | 33,5648% | 98,8426% | 90,2778% | 66,4352% |
| 4 | 9 | 20 | 9,7222% | 98,8426% | 90,2778% | 44,3673% |
| 5 | 10 | 20 | 22,1451% | 99,9871% | 99,2798% | 69,4830% |
| 6 | 12 | 25 | 14,4633% | 99,9850% | 99,5499% | 63,6896% |

**Contra A1b**

| C / N | Soma | D | Sem Técnica | P1: +3N | P2: atual | P3: +N |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 6 | 10 | 50,0000% | 83,7963% | 83,7963% | 62,5000% |
| 2 | 7 | 15 | 16,2037% | 83,7963% | 62,5000% | 37,5000% |
| 3 | 8 | 20 | 2,7006% | 76,0802% | 44,3673% | 15,8951% |
| 4 | 9 | 25 | 0,0772% | 76,0802% | 44,3673% | 5,4012% |
| 5 | 10 | 30 | 0,0000% | 69,4830% | 39,9691% | 1,6204% |
| 6 | 12 | 35 | 0,0021% | 79,4153% | 54,6425% | 1,9676% |

Os recuos entre níveis não são erros: tamanho do pool, paridade e saltos de D mudam juntos.

**INFERÊNCIA · Soma 12:** com +18, média 21 vira 39, aumento de 85,71%. Contra D25, sucesso vai de 14,4633% a 99,9850%; contra D35, de 0,0021% a 79,4153%. Dobrar quase a média não significa dobrar a chance.

**INFERÊNCIA · Sensibilidade ao perfil:** soma 18, referência central “Semideus”, dá 9d6, média 31,5. Contra D30: sem bônus 57,6148%; P3 (+6) 91,2892%; P2 (+15) 99,9504%; P1 (+18) 99,9978%. Contra D35, P1 dá 99,7637%. A1 precisa fixar perfil, não só D.

### INFERÊNCIA · Combate, Margens e Longas

Para ataque contra Esquiva, somas iguais S, sem arma/especialidade: `ataque=nd6+paridade+C+B_atq`; `Defesa=2S+C+B_def`. C igual cancela: limiar `2S+B_def−B_atq`. Bônus igual nos dois lados não melhora o acerto entre iguais; só no ataque, melhora muito. D7 (+1 ou +2 por Centelha) continua pendente: controles usam +1 vigente; com Centelhas diferentes, recalcular a sensibilidade. Não transplantar as tabelas genéricas para combate.

+6 pode acrescentar uma Margem a um sucesso já existente; +18, três. Nas falhas convertidas em acerto, calcular a distribuição completa: não são +3d6 garantidos por tentativa. Fonte: [docs/export/proezas/centelha-dossie.md:38](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:38).

Longa: progresso por intervalo `max(0,média−D)` ([src/content/chapters/acoes-e-sistema.md:92](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/content/chapters/acoes-e-sistema.md:92)). **Se G15 permitir soma direta**, soma 12 e D20 dariam progresso 1 sem bônus, 7 com +6, 16 com +15, 19 com +18. É cálculo condicional, não decisão de G15. Não aprovar equivalências de Longa antes de fechar essa regra; a comparação de rolagens pode avançar separadamente.

### PROPOSTA · Protocolo de comparação vinculado a A3

Usar uma ação e uma janela de quatro ações elegíveis, sem afirmar frequência real de mesa. Comparar: sem Firula; uma Firula 1 na janela; uma Firula 2 na janela. Uma ação com Firula 3 é controle extremo, não frequência presumida. Janelas contam ações: durações em Ticks usam o tempo publicado de cada ação, sem supor Velocidade igual para todas.

**FATO:** Firulas dão +2/+1d6/+2d6 e recuperam reservas, sem teto por cena ([docs/export/proezas/centelha-dossie.md:50](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:50)). **INFERÊNCIA:** soma 12, D25, P3: 63,6896% sem Firula; 79,4153% com Firula 1; 86,2837% com Firula 2; 96,1130% com Firula 3.

Efeito pago por ação cobra quatro vezes na janela; postura de cena cobra uma ativação. Recuperação respeita teto e recurso escolhido, sem contar a mesma Firula duas vezes. Não atribuir custo líquido médio sem frequência e reserva inicial. Na nova régua, completar PV, Absorção e reservas de cada perfil antes de comparar dano/cura/economia: estes cálculos de acerto não fingem resolver isso.

**Recomendação, PROPOSTA:** sob A1a/A2b, começar a nova régua por P3 como controle numérico principal, com P1/P2 para comparação, pois mantém incerteza antes de Firulas. Sob A1b e soma máxima 12, P1 é a mais compatível das três; P3 exigiria rever o perfil ou a intenção do desafio. O autor precisa decidir se quer acerto ainda disputado ou quase perfeito. Nenhuma redução de poder está aprovada.

## A4. XP: Técnica inteira ou diferença

### FATO · Texto e cálculo atual

> XP para os níveis 1 a 6, "subir uma Proeza de nível paga só a diferença"

Fonte: [docs/export/proezas/centelha-dossie.md:184](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:184). Os preços são 10/15/20/25/30/35. Dado vivo: `tipo:"flat"`, `base:5`, `mult:5`, portanto `P(N)=5+5N` ([src/data/regras.json:634](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/data/regras.json:634)).

A ficha soma `custoTecnica(nivel)` para **cada id possuído**, sem deduzir antecessores ([src/lib/ficha-engine.ts:2139](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/ficha-engine.ts:2139); [src/lib/calc.ts:327](C:/Users/Neves/ClaudeCode/centelha/rpg-system/src/lib/calc.ts:327)). É comportamento do código, não decisão sobre qual intenção deve vencer. A frase não define sucessão entre ids nem ramos.

### INFERÊNCIA · Cadeia real completa até N6

| Técnica (id) | N | Inteira | Diferença proposta |
|---|---:|---:|---:|
| Pele Curtida (`pele-curtida`) | 1 | 10 | 10 |
| Pele de Pedra (`pele-de-pedra`) | 3 | 20 | 20−10=10 |
| Carne de Granito (`carne-de-granito`) | 4 | 25 | 25−20=5 |
| Fortaleza Viva (`fortaleza-viva`) | 5 | 30 | 30−25=5 |
| Pele Adamantina (`pele-adamantina`) | 6 | 35 | 35−30=5 |
| **Total** | | **120 XP** | **35 XP** |

Fontes: [docs/export/proezas/proezas-completas.md:4139](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:4139), entradas N3–N6 a partir da linha 4191; fecho conferido no JSON por id. A cadeia **não passa por N2**. Couro Endurecido é ramo opcional, não requisito escondido.

**INFERÊNCIA · Árvore ramificada real:** Forja dos Deuses exige Mãos Hábeis N1, Improvisar N1, Obra Fina N3, Reparo Veloz N3, Mestre Artesão N4, Engenho Sobre-humano N5 e Forja dos Deuses N6. Inteiras: `10+10+20+20+25+30+35=150 XP`. Fonte: [docs/export/proezas/proezas-completas.md:241](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/proezas-completas.md:241), até a entrada da linha 345. Não exige Obra Bem-Feita nem Olho de Artífice.

**PROPOSTA para calcular diferença em ramos:** crédito somente em evolução marcada, nunca em todo pré-requisito; crédito anterior não pode ser reutilizado. Exemplo de marcação para esta árvore: Mãos Hábeis → Obra Fina → Mestre → Engenho → Forja = 35 XP; Improvisar → Reparo Veloz = 20 XP; **total 55 XP**. Improvisar paga 10 por ser outra capacidade N1; Mestre não desconta simultaneamente os dois pais. Essas marcações **não existem** no dado. Sem política de ramos, o total por diferença é indefinido, não automaticamente 35 por terminar em N6.

| Opção | Prós | Contras | O que muda na régua |
|---|---|---|---|
| A4a. Cada id custa P(N) inteiro | Corresponde à soma atual; capacidades independentes têm custo. | Árvores longas ficam mais caras; pode cobrar por bônus já substituído. | Avaliar potência também pelo fecho: 120/150 XP nos exemplos. |
| A4b. Diferença em evoluções marcadas; demais compras inteiras | Evita pagar repetidamente pelo mesmo patamar. | Exige mapa de evolução, crédito sem duplicação e política para fichas existentes. | Investimento ilustrativo 35/55 XP; muda fortemente a velocidade de acesso. |

**Recomendação, PROPOSTA:** A4b apenas para evolução que substitui uma progressão, mantendo compra inteira para capacidade independente. Pagar diferença por qualquer pré-requisito baratearia capacidades distintas sem critério. A2 e A4 são independentes: substituir bônus não autoriza desconto, apagar ids ou reembolso. Os números são simulações, não migração aprovada.

## A5. Grupo de referência: três ou quatro

### FATO · Decisão reaberta pelo autor

> **grupo de 4 personagens** de Centelha X, com habilidades variadas, passarem dificuldade para
> vencer, gastando recursos e se ferindo. É absoluto, não relativo ao grupo que joga.

Fonte: [docs/export/proezas/centelha-dossie.md:169](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/export/proezas/centelha-dossie.md:169); registro citado: [docs/pendencias/B-bestiario.md:118](C:/Users/Neves/ClaudeCode/centelha/rpg-system/docs/pendencias/B-bestiario.md:118).

Instrução atual do autor: “O dossiê aponta 4 nas pendências do bestiário; o autor tinha dito 3. Não decida”. Não tratar a afirmação histórica de que quatro já estava decidido como aprovação atual.

### INFERÊNCIA · Consequências isoladas

Com uma oportunidade por personagem idêntico, quatro oferecem 4/3 das oportunidades de três: **33,33% a mais**. Isso não autoriza multiplicar o PV da criatura por 4/3: funções, controle e cura mudam o encontro.

Se uma recompensa total fixa R for dividida igualmente, parcelas seriam R/3 ou R/4: em quatro, 25% menos por pessoa. É aritmética condicional, **não afirmação sobre a fórmula vigente de caça**. Se a regra premiar cada personagem, muda o total distribuído. Aplicar a fórmula aprovada quando houver decisão.

### PROPOSTA · Opções, sem escolher tamanho

| Opção | Prós | Contras | O que muda na régua |
|---|---|---|---|
| A5a. Três | Corresponde à referência anterior do autor; maior peso individual. | Menor cobertura de funções; exige conciliar o registro do bestiário para quatro. | Três agentes; recalcular encontro, sobrevivência, controle e caça. |
| A5b. Quatro | Corresponde ao registro citado; mais cobertura de funções. | Mais ações, reservas e combinações; apoio/área podem valer mais. | Quatro agentes; recalcular as mesmas métricas, não só PV da criatura. |

**Recomendação de procedimento, PROPOSTA:** manter ambos os cenários até a decisão do autor; **não recomendar três nem quatro**. Depois, bestiário, régua e recompensa de caça devem consumir a mesma referência. Chance de uma ação isolada não muda; contribuição no encontro muda.

## Decisão em bloco e parada

| Item | O autor precisa fechar | Estado |
|---|---|---|
| A1 | Dificuldades e perfis, incluindo papel do controle exigente | Aguardando |
| A2 | Soma ou maior bônus por família/escopo e exceções | Aguardando |
| A3 | Escala, intenção de confiabilidade e protocolo de comparação | Aguardando |
| A4 | Preço inteiro ou crédito em evoluções, incluindo ramos | Aguardando |
| A5 | Três ou quatro, propagado a bestiário/régua/caça | Aguardando |

Somente após essas decisões e a segunda opinião: refazer `01-regua.md`, obter aprovação e iniciar lotes. Campos sem número continuam pendentes; este documento não fornece uma régua aprovada por antecipação.

## Apêndice · Reprodução das probabilidades

Código usado nas contas desta entrega. Só imprime resultados; não altera arquivos. Conta todos os resultados equiprováveis por convolução, preserva frações exatas e arredonda apenas a apresentação.

```python
from collections import Counter
from fractions import Fraction
from functools import lru_cache

@lru_cache(None)
def distribuicao(n):
    c = Counter({0: 1})
    for _ in range(n):
        proxima = Counter()
        for total, quantidade in c.items():
            for face in range(1, 7):
                proxima[total + face] += quantidade
        c = proxima
    assert sum(c.values()) == 6**n
    return c

def sucesso(s, d, b=0, extra=0):
    n = s//2 + extra
    fixo = 2*(s % 2) + b
    return Fraction(sum(q for t, q in distribuicao(n).items()
                        if t + fixo > d), 6**n)

somas = [6, 7, 8, 9, 10, 12]
atual = [3, 4, 6, 9, 12, 15]
for ds in ([10, 15, 15, 20, 20, 25], [10, 15, 20, 25, 30, 35]):
    for c, (s, d) in enumerate(zip(somas, ds), 1):
        vals = [sucesso(s, d, b) for b in (0, 3*c, atual[c-1], c)]
        print(c, s, d, [f'{100*float(p):.4f}%' for p in vals])
for b in (0, 6, 15, 18):
    print('S18 D30', b, sucesso(18, 30, b))
print('S18 D35 +18', sucesso(18, 35, 18))
for extra, fixo in ((0, 0), (0, 2), (1, 0), (2, 0)):
    print('Firula', extra, fixo, sucesso(12, 25, 6+fixo, extra))
assert sucesso(2, 6) == 0
assert sucesso(2, 5) == Fraction(1, 6)
assert sucesso(12, 25, 18) == Fraction(46649, 46656)
```

## Fotografia das fontes de cálculo

SHA-256 dos arquivos lidos. Identificam a versão, sem presumir que o trabalho paralelo manterá as fontes paradas.

| Arquivo | SHA-256 |
|---|---|
| `docs/export/proezas/centelha-dossie.md` | `3c27e1af7a6ff1b5fb648e7f0fb7e191c81fc31bfaf68c18c5c0d62c4240d52b` |
| `docs/export/proezas/proezas-completas.md` | `cf17662d5921a32d5f634fd27ce34144d5ee3cc313d54da36ba21375b1100335` |
| `src/data/tecnicas.json` | `c41f45f2aa9b0fb60dd08accecbcec1fbb15cbadfddc2618224752042c97005f` |
| `src/data/regras.json` | `56d75812acc680a15f926f7453f70861771b46670aa863784577b10c6976dbf3` |
