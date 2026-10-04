Despachos lidos (12 de 12, todos existem em docs/simulacao/caixa/): b14-fase2-despacho, b14-fase2-resposta-despacho, b14-fase3-despacho, regra-quase-acerto-bancada-despacho, bancada-tres-consertos-despacho, bestiario-fixar-criatura-despacho, reforma-centelha-briga-despacho, reforma-centelha-briga-revisao-despacho, b14-cr-desafio-fase4-5-despacho, b14-fase5b-economia-de-acao-despacho, correcao-reforma-despacho, achados-duas-leituras-despacho. Nenhum ausente. Os blocos citam os arquivos pelo nome curto (dentro de docs/simulacao/caixa/). Estados "no ar" conferidos por Grep onde indicado; o resto vai como "(não conferido)".

Notas de leitura: (1) a fase3 do B14 tem o pedido do autor, mas as decisões de regra (resiste por efeito, gigantes, Artes das 20 conjuradoras) vivem em ../tmp/arquiteto/decisoes-fase3.md, que o despacho não cola: só entram aqui os pontos que o pedido verbatim diz. (2) reforma-centelha-briga-revisao-despacho não traz decisão nova de regra; repete as decisões 1 a 7 da Reforma (ver C-024 a C-027). (3) bestiario-fixar-criatura e bancada-tres-consertos não fixam regra do jogo (UI e bancada); entram só as decisões do autor com efeito de procedimento, marcadas.

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
- Estado: no ar (deslocamento resolvido em 28/08 e estendido; 309 criaturas, ver memória "Deslocamento do bestiário"; não conferido por criatura)

### C-010 · Orc: atributos fixos e poderes da raça [tags: bestiario, orc, racas, atributos]
- Data: 2026-09-26
- Decisão: "Orc (mon-orc): Força 5, Destreza 3, Vigor 5, Influência 2, Perspicácia 2, Compostura 1, Percepção 3, Inteligência 2, Raciocínio 2; ganha Vitalidade (+Vigor de PV) e Frenesi como poderes naturais, iguais aos da raça (racas.json)."
- Origem: b14-fase2-despacho.md:49-52 (C.11)
- Estado: no ar (não conferido)

### C-011 · Vontade em combate: 1 ponto, +1d6 ou +4 na Defesa, máximo 1 por ação [tags: vontade, defesa, combate]
- Data: 2026-09-26
- Decisão: "Vontade em combate, em regras.json: 1 ponto dá +1d6 na jogada ou +4 numa Defesa, no máximo 1 ponto por ação ou jogada (inclusive cada golpe que se defende). Ajuste o texto de aparencia-virtudes-vontade.md, que hoje diz "turbinar" sem número."
- Origem: b14-fase2-despacho.md:53-56 (C.12)
- Estado: no ar (não conferido; estendida a "inclusive resistir" em C-069)

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
- Estado: no ar (não conferido)

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
- Estado: no ar para o desarmado (não conferido); a Proeza fica a implementar

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
- Estado: a implementar (pendência)

### C-043 · Arte exige só Centelha > 0; o portão "nível N exige Centelha ≥ N" é só das Técnicas de Proeza [tags: artes, centelha, proeza, tecnica, portao]
- Data: 2026-09-29
- Decisão: (resumo; o despacho cita que a distinção veio do autor e confirma no livro) o portão "nível N exige Centelha ≥ N" é só das Técnicas de Proeza (centelha.md, regras.json:639), e Arte só exige Centelha > 0, com profundidade paga por XP (criacao-de-personagem.md, artes/regras.astro:46). Feiticeiro Menor mantém Fogo N2; Mago de Batalha com Bola de Fogo (Fogo N4) e Escudo de Força (Forças N4) sem subir a Centelha. Teto "Arte até Centelha + 2" é só da bancada.
- Origem: b14-cr-desafio-fase4-5-despacho.md:113-154 (Adendo, itens 1 e 2a-c)
- Estado: substituída por decisão posterior em parte: em 02/10 o autor decidiu que o mortal (Centelha 0) tem Mana e conjura Arte (ver C-076), logo "exige Centelha > 0" para Arte caiu

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
- Estado: no ar (relacoes-sociais.md:149 "só 1: o máximo de 1 ponto por ação ou jogada vale também para resistir")

### C-070 · Segurar firme custa 1 ponto de Vontade (substitui afb818cc) [tags: vontade, social, resistir, margem, relacoes-sociais]
- Data: 2026-10-02
- Decisão: "Item 14, pergunta 1: opção B. Segurar firme custa 1 ponto: na Margem 0 segura de vez; com Margem 1 ou mais o alvo cede, mas o pedido chega 1 nível abaixo. Corrija relacoes-sociais.md:148-156 e o resumo de :275."
- Origem: achados-duas-leituras-despacho.md:188 e :198, commit ad632f3f
- Estado: no ar (relacoes-sociais.md:149-155 e :275). Substitui C-071

### C-071 · Segurar firme custava 1 + Margem de Vontade (decisão antiga) [tags: vontade, social, resistir, margem, relacoes-sociais]
- Data: 2026-07-20
- Decisão: (resumo do commit afb818cc) "Combate Social enxuto (Vontade=1+Margem para segurar; senao cede e a regua anda)": "Para segurar firme, ele gasta Força de Vontade naquele lance, e o custo sobe com a Margem"; "Resistir: para não ceder, gaste 1 + Margem de Vontade no lance; se não pagar, cede o ponto e a régua anda Margem passos". Exemplo de Vesna: Margem 1, 2 de Vontade.
- Origem: commit afb818cc, src/content/chapters/relacoes-sociais.md (hoje :149-155)
- Estado: substituída por C-070

### C-072 · Cortejo: intervalo de 8 dias ou mais não é uma ação [tags: social, cortejo, vontade, relacoes-sociais]
- Data: 2026-10-02
- Decisão: "Item 14, pergunta 2: opção B. O intervalo do cortejo (8 dias ou mais) não é uma ação; o custo atual fica, e o capítulo explica a exceção ao '1 por ação'."
- Origem: achados-duas-leituras-despacho.md:189 e :199, commit ad632f3f (relacoes-sociais.md:276, regras.json social.modoDevagar.resistencia)
- Estado: no ar (não conferido)

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
- Estado: a implementar (pendência G75)

### C-076 · Mortal (Centelha 0): tem Mana (a Força de Vontade) e conjura Arte; Energia não usada [tags: mortal, centelha, mana, energia, artes, vontade]
- Data: 2026-10-02
- Decisão: "Leitora F2, decidida pelo autor (reenvio): o mortal (Centelha 0) tem Mana e pode usá-la, então conjura Artes; a Mana dele é a Força de Vontade (fórmula atual, sem mudança). Pode ter Energia, mas não a usa, porque Energia serve às Proezas e Proeza exige Centelha. Corrija centelha.md:19 e :30 e os lugares que dizem que Arte exige Centelha maior que 0."
- Origem: achados-duas-leituras-despacho.md:168 e :178-179, commit 08f9df52
- Estado: no ar no texto; no código ainda não: três lugares bloqueiam Arte ou Mana em Centelha 0 (ficha-engine.ts:176, grid.astro:3329, combate.astro:1693). Parcialmente suspensa por C-077

### C-077 · Teto de Arte do mortal: não liberar no código antes de ver os números [tags: mortal, mana, artes, centelha, teto]
- Data: 2026-10-02
- Decisão: "F2 no código: opção D. Antes de liberar, meça onde a Mana do mortal entra ... Junto, meça o custo de Mana por nível de Arte contra a Mana de um mortal (Força de Vontade de 1 a 6)... Não libere nada antes de o autor ver os números e decidir o teto de Arte do mortal."
- Origem: achados-duas-leituras-despacho.md:190-191 e :202-205, commit ad632f3f (medição, sem código)
- Estado: a implementar (aguarda decisão do autor sobre o teto de Arte do mortal)

### C-078 · Escala do desafio: de 0 a 12, nada passa de 9 exceto a Tarrasca (10); ameaça 1-6 a ajustar [tags: desafio, escala, bestiario, ameaca]
- Data: 2026-10-02
- Decisão: "A escala do desafio já está decidida pelo autor: de 0 a 12, e nada passa de 9, exceto a Tarrasca (10). O campo ameaca de 1 a 6 é o que precisa se ajustar a isso. Registre na B14, sem executar agora." E: o REC_FATOR (1,75 contra 1,32) "era da regra de Degrau, que saiu no 2e ... Não é decisão aberta".
- Origem: achados-duas-leituras-despacho.md:37-38
- Estado: a implementar (registrado em B-bestiario.md pelo Arquiteto; não executado)

### C-079 · Texto do /bestiario: Ameaça em recalibração [tags: bestiario, ameaca, desafio, ui]
- Data: 2026-09-29
- Decisão: (resumo) tirar "Ameaça... de 1 a 6" e "poderes traduzidos em Proezas e Feitiçarias" do topo de bestiario.astro: "os poderes são naturais (com usos) ou Artes; o desafio (Ameaça) está em recalibração, os losangos continuam mostrando o valor antigo até a bancada da Fase 5 medir de verdade"; locomoção e poderes naturais visíveis nos cards.
- Origem: b14-cr-desafio-fase4-5-despacho.md:174-199 (Adendo 3), commit 6ea979bc
- Estado: no ar (exibição; não conferido)
