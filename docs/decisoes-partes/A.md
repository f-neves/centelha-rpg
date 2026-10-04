Despachos lidos: 86, 87, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109 (todos de docs/simulacao/caixa/NN-despacho.md; todos existem, 88 e 89 ficaram fora do recorte pedido). Sem decisão de regra: 92, 93, 94, 95, 96, 97, 99, 100, 108, 109 (ferramenta, medição, glossário ou arrumação; as decisões do 108 e do 109 são de autolink, não de regra do jogo). Fontes de apoio lidas: docs/simulacao/caixa/leitura-de-novato-decisoes.md §14 a §17 (registro das decisões de 22 a 24/09/2026 citadas pelos despachos 90, 91 e 98) e `rtk proxy git show c38f909:docs/simulacao/caixa/87-despacho.md`. Quando o despacho só resume a fala do autor, a Decisão vem marcada (resumo).

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

### A-021 · O tiro também sofre a penalidade de ferimento [tags: ferimento, arco, besta, percepcao, atirador, acao-fisica]
- Data: 2026-09-24
- Decisão: (resumo) arco e besta rolam Percepção, que fica fora de "Força, Destreza ou Vigor", mas o motor já penaliza o tiro como qualquer golpe; o livro passa a dizer que o ataque à distância sofre a penalidade. O +2 da fúria continua fora do Atirador. Nada muda na mesa. Rodada 101 corrige em racas.md:145 e FRENESI.md:116-118 com "menos o tiro".
- Origem: leitura-de-novato-decisoes.md §17 (três leituras da rodada 98); 101-despacho.md:1.4
- Estado: no ar (racas.md:146 cita o tiro; não conferido o texto exato)

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
