# Leitura de novato: os 23 capítulos de regras (src/content/chapters/)

Leitura feita do zero, na ordem de `ordem:` do frontmatter (coracao-do-sistema → atributos →
habilidades → habilidades-secundarias → aparencia-virtudes-vontade → vida-ferimentos-cura →
centelha → racas → antecedentes → acoes-e-sistema → acoes-corpo-e-movimento → acoes-resistir →
acoes-sentidos-e-engano → acoes-oficio-e-mundo → combate → relacoes-sociais → defesas →
quase-acerto → armas-e-armaduras → custo-de-servico-e-itens → criacao-de-personagem →
qual-sistema → folego), cruzada com `src/data/*.json`.

Nenhum arquivo do repositório foi tocado além deste. Nenhum commit, nenhum build/validate.

Todo achado abaixo foi lido diretamente no arquivo citado (não é dedução de segunda mão);
onde uma citação de um leitor auxiliar não bateu com o arquivo real, foi corrigida ou
descartada (ver nota ao final da seção (b), item sobre o link `/caminhos`).

---

## (a) ERROS OBJETIVOS: contradição factual entre capítulo e dado, ou dentro do próprio texto

1. **Longevidade do Meio-Orc.** `src/content/chapters/racas.md:106` (e a tabela de
   Envelhecimento, linha 146, coluna Venerável) diz "vida curta, pouco mais de **70 anos**".
   `src/data/racas.json` (verbete Meio-Orc, campo `descricao`) diz "vida curta, cerca de
   **60 anos**", o mesmo número do Orc puro (`racas.json`, verbete Orc; `racas.md:121`).
   Parece cópia da descrição do Orc colada no Meio-Orc sem ajustar o número.

2. **Relação social do Meio-Orc com os outros povos.** `racas.md:115` afirma sem ambiguidade
   que os demais povos recebem o Meio-Orc em "**−1 (Antipatia)**" na Régua de Relação.
   `racas.json` (verbete Meio-Orc) descreve um valor mecanicamente diferente: "**Neutro
   baixo**, a um passo da Antipatia". Pela régua do próprio sistema (−6 a +6, Antipatia = −1),
   são dois pontos de partida diferentes: um jogador não sabe se o Meio-Orc começa em
   Antipatia (já hostil) ou em Neutro (ainda não rompeu zero passos).

3. **Frenesi contido do Meio-Orc.** `racas.md:112` descreve o efeito com a mesma frase do
   Orc puro (linha 128): entrar em fúria "ignorando as penalidades de ferimento". O JSON do
   Meio-Orc (`racas.json`) descreve o mesmo traço como "sem penalidade de **dano**" ·
   frase diferente, que pode significar outra coisa (dano causado, não a penalidade de
   ação/defesa por Limiar de Ferimento).

4. **Regra geral de Antecedentes-pessoa vs. verbete de Contatos.** A regra geral de
   `antecedentes.md:71-78` diz que Reputação/Contato/Posição descontam passos do Neutro
   *proporcionalmente ao nível* do traço ("com 3 ou mais a relação já começa em +1
   Simpatia" ⇒ nível 1 não chega lá). O verbete de Contatos, no mesmo capítulo
   (`antecedentes.md:136`), afirma categoricamente "contatos ficam em **Simpatia, +1**",
   sem condicionar ao nível. Duas seções do mesmo capítulo dão resultados diferentes para
   o mesmo traço em nível baixo.

5. **"Perícia Cura".** `vida-ferimentos-cura.md:88` usa "a perícia Cura". Em todos os
   outros 22 capítulos e em `regras.json` o termo do sistema é sempre **Habilidade**
   (primária ou secundária); "perícia" não aparece em nenhum outro lugar do livro.

6. **Feras e Defesa Social: a prosa contradiz a tabela do mesmo capítulo, e o dado
   confirma qual está errada.** `defesas.md:75` diz que feras (Inteligência 1) trocam
   Sociabilidade por Sobrevivência e por isso *têm* Defesa Social. A tabela "Quem tem cada
   muralha", linhas 108-115 do mesmo capítulo, diz que Inteligência 1 tem Social = "**-**"
   (imune, sem trato social). Um comentário interno em `regras.json` resolve a favor da
   tabela: "Feras (Int 1) trocariam Sociabilidade por Sobrevivência, mas no bestiário
   Social vale só p/ Int 2+." A linha 75 é prosa antiga que não foi atualizada quando a
   regra mudou.

7. **Bloqueio: `qual-sistema.md` inventa uma escolha de Habilidade que não existe.**
   O fluxograma de `qual-sistema.md:87` escreve a fórmula como "Bloqueio = (Destreza +
   **Habilidade que você escolher**) × 2 + ...", como se qualquer Habilidade servisse.
   `defesas.md:69` é explícito: "Bloqueio é uma **Habilidade única**". `habilidades.json`
   confirma: só existe um id `bloqueio`. O "mapa de bolso" (vendido como referência rápida)
   ensina uma regra que o capítulo de Defesas nega.

8. **Custo de Fôlego da Alabarda.** `folego.md` (tabela por classe de arma) diz que armas
   de classe Haste custam 24 de Fôlego por golpe, o mesmo valor da Lança, e apresenta isso
   como "fixado pela classe". `armas.json` (verbete Alabarda, `classe: "haste"`) traz
   `folego: 32`, não 24. Ou o Fôlego não é de fato fixado só pela classe (e a tabela do
   capítulo está incompleta), ou o dado da Alabarda diverge do que o capítulo promete.

9. **Nota interna do JSON contradiz o próprio capítulo que ela deveria documentar.**
   Um comentário em `regras.json` (bloco de Quase-Acerto) diz "a classe da arma sai do
   dado (1d6 leve, 2d6 média, 3d6 pesada)". Mas `quase-acerto.md:30,46` desmente
   explicitamente essa leitura, com exemplo: "hoje 24 das 26 armas têm um dado só e
   nenhuma tem três, e ao pé da letra a espada longa viraria leve e a categoria pesada
   deixaria de existir" · a classe de QA vem do **dano médio**, não do número de dados.

10. **Dois catálogos de armadura incompatíveis, um dentro do outro capítulo que os cita.**
    `custo-de-servico-e-itens.md` já avisa, em nota própria: "as listas e os preços dos
    dois capítulos não batem por completo". Na prática, `armas-e-armaduras.md` (e
    `armaduras.json`) tem 8 armaduras em 3 classes (leve/média/pesada); o catálogo de
    preços em `custo-de-servico-e-itens.md` tem 9 armaduras em **4** classes, incluindo
    "Super-pesada", uma classe que **não existe** em `quase-acerto.md` (só reconhece
    Nenhuma/Leve/Média/Pesada) nem em `armaduras.json`. Só 3 dos 9 nomes (Cota de malha,
    Lamelar, Placa completa) aparecem nos dois catálogos.

11. **O mesmo problema no catálogo de armas.** `custo-de-servico-e-itens.md` lista armas
    ("Faca", "Espada Média", "Martelo Grande", "Maça Estrela" etc.) cujos nomes não
    existem em `armas.json` (que usa Adaga, Espada Curta, Espada Longa, Machado, Montante,
    Martelo de Guerra...). Um jogador que queira comprar a arma descrita no capítulo de
    Combate não acha preço para ela.

12. **Sufocamento: o capítulo nega uma mecânica que o dado aplica.** `acoes-resistir.md`
    (seção de Sufocamento) diz explicitamente que "não se rola" e que "não há queda
    gradual nem jogada de resistir: a hipóxia derruba" antes do apagão. `condicoes.json`
    (condição "Sufocando") tem `porSeisTicks: 2`, isto é, dano crescente a cada 6 Ticks,
    que o capítulo nega existir nessa fase.

13. **Envenenado: o dado cita um relógio que o capítulo não tem.** `condicoes.json`
    (condição "Envenenado") descreve "dano a cada 6 Ticks até resistir (cap. Resistir)"
    (`porSeisTicks: 1`). Mas `acoes-resistir.md` (seção de Veneno) não tem nenhum relógio
    genérico de 6 Ticks: cada veneno declara seu próprio Início e Doses (minuto, hora,
    Tick), variando de veneno para veneno.

14. **Tabela de Amortecer não bate com a tabela de Dano de Queda do mesmo capítulo.**
    `acoes-corpo-e-movimento.md`, tabela de Dano de Queda (linhas 88-96) e tabela de
    Amortecer (linhas 119-126) deveriam concordar nas alturas efetivas que coincidem
    exatamente. Não concordam: 3 m efetivos dá 7 na tabela de Dano e 6 na de Amortecer;
    5 m efetivos dá 11 vs. 10; 10 m efetivos dá 22 vs. 20; 20 m efetivos dá 43 vs. 40;
    40 m efetivos dá 81 vs. 75. Conferido manualmente: a diferença é sistemática (a
    tabela de Amortecer está sempre um pouco abaixo do valor "oficial" da tabela de
    Dano para a mesma altura efetiva).

15. **Prazo de fabricação da "espada excepcional" não fecha com a conta que o próprio
    capítulo ensina.** `acoes-oficio-e-mundo.md` diz que uma oficina de mestre entrega
    a espada excepcional em 8 semanas. Só que, com os números dados na mesma linha
    (Dificuldade 16, Acúmulo 74, mestre com soma 12 ⇒ média de rolagem 21), o progresso
    é 21−16=5 por semana e 74÷5≈14,8 semanas, não 8. O texto credita a diferença a
    "oficina de mestre, bônus do ofício geral e Especialidade", mas não mostra a conta:
    é a única linha da tabela cujo resultado o leitor não consegue reproduzir com as
    ferramentas que o próprio capítulo acabou de ensinar (todas as outras linhas batem).

16. **Faixa de dano de armas de distância/arremesso não bate com o catálogo.**
    `combate.md` (tabela de bônus de dano por categoria) diz que distância/arremesso vai
    de "1d6 a 1d6+2". Em `armas.json`: adaga-de-arremesso tem `danoBonus: -2` (1d6−2),
    arco-curto tem `-1`, besta-media tem `+4`, besta-grande tem `+8` · todas fora da
    faixa citada, que vai na prática de −2 a +8.

17. **Alabarda na linha de Velocidade errada.** `combate.md` (tabela de Velocidade de
    Ataque) põe a Alabarda na linha de 7 Ticks, junto de martelo de guerra e montante.
    `armas.json` mostra `alabarda.classe: "haste"` e `ticks: 6` · ela pertence à linha
    de 6 Ticks (onde estão espada longa, machado, lança). A ressalva do próprio capítulo
    ("a tabela é lista de exemplos, não contrato") não resolve: ela nomeia a arma errada
    dentro da faixa errada.

18. **Descarte de dado da Especialidade: singular no capítulo 1, plural no de Combate.**
    `coracao-do-sistema.md` (nota sobre Valor Passivo) diz "+1d6 por nível, **descartando
    o menor**" (singular, um dado só). `combate.md` (seção de Especialidade em rolagem)
    diz "+N dados, **descartando os N menores**" (plural, um por nível). `glossario.json`
    concilia lendo a operação como repetida por nível (o que dá o mesmo resultado
    matemático), mas nenhum dos dois capítulos aponta essa reconciliação: um leitor que
    decorou a frase do capítulo 1 chega em Combate achando que a regra mudou.

19. **Iniciativa Social começa em Tick diferente da física, apesar de se dizer "a mesma
    regra".** `combate.md` (Iniciativa) fixa o vencedor da iniciativa física entrando no
    **Tick 1** (confirmado por `regras.json → derivados.iniciativa.tickDoPrimeiro`).
    `relacoes-sociais.md` diz: "quem lê melhor a sala toma a palavra primeiro (**começa
    no Tick 0**; os demais no Tick 1, com a mesma regra de defasagem do físico)" · dois
    pontos de partida diferentes (Tick 0 vs. Tick 1) chamados de "a mesma regra", sem
    entrada equivalente em `regras.json` para o lado social que resolva a diferença.

---

## (b) PONTOS NÃO DEFINIDOS: lacunas

20. **"Proezas" é usado dezenas de vezes e nunca ganha capítulo próprio na leitura em
    ordem.** O termo aparece com peso mecânico (níveis 1-6, Técnicas, Energia, Ticks) em
    `centelha.md`, `combate.md`, `quase-acerto.md`, `relacoes-sociais.md`,
    `antecedentes.md`, `acoes-e-sistema.md` e `criacao-de-personagem.md`, mas não existe
    nenhum arquivo em `src/content/chapters/` que defina o que é uma Proeza, como se
    escolhe uma, ou o que é uma Técnica estruturalmente. `criacao-de-personagem.md`
    (Passo 9) manda o jogador "gastar o restante em Proezas, Técnicas e Artes" e linka
    `/caminhos` e `/arcano` · páginas que **existem** de fato (`src/pages/caminhos/`,
    `src/pages/arcano.astro`), mas ficam fora da coleção de capítulos e fora da ordem de
    leitura que o próprio livro define (`ordem`/`numeral` pulam de XIV para XVIII,
    saltando XV-XVII, que correspondem a essas páginas fora de `chapters/`). Um leitor
    que siga só "os capítulos", como o próprio sumário do site sugere, nunca chega lá.

21. **Buraco de numeração (`ordem` 21-23) nunca explicado.** A sequência de `ordem` no
    frontmatter dos 23 capítulos pula de 20 (`custo-de-servico-e-itens.md`) para 24
    (`criacao-de-personagem.md`), e o `numeral` correspondente pula de XIV para XVIII.
    Nenhum capítulo comenta o salto; ele corresponde às páginas de Arcano/Artes/Caminhos
    fora da coleção (item 20), mas isso não é dito em lugar nenhum do texto.

22. **Leitura ("ler" o oponente) dentro de um duelo de Combate Social não tem mecânica
    própria.** `relacoes-sociais.md` estabelece que a Defesa Social cobre duas coisas,
    influência (te mover) e leitura (te ler), e que "gastar Vontade não vale contra
    leitura, vale só contra os golpes que tentam te mover" · implicando que dá para
    tentar ler alguém dentro de um duelo rápido. Mas a seção inteira de Combate Social
    só descreve Ataque/Resistir para mover a régua; a única "leitura" com fórmula escrita
    (Perspicácia + Empatia vs. Defesa Social) pertence ao Cortejo, um sistema por
    intervalos completamente diferente. Um mestre arbitrando "quero perceber se o NPC
    está blefando" no meio de um lance social rápido não acha onde procurar.

23. **Condições que penalizam a própria ação não são mencionadas na tabela de combate
    que as usa.** `condicoes.json` dá `acao: -2` (Caído), `acao: -3` (Cego) e
    `acao: -2` (Imobilizado) · essas condições também reduzem o pool de quem as sofre.
    A tabela de "Vantagem tática" em `combate.md` apresenta as mesmas três condições só
    como modificador da coluna "Defesa do alvo", sem uma palavra sobre a penalidade à
    própria ação de quem está caído, cego ou imobilizado.

24. **Ataque Social com Habilidade Secundária "solta": não fica claro como o pool é
    montado.** `relacoes-sociais.md` lista "Persuasão, Sedução, Intimidação, Manha" como
    exemplos intercambiáveis de "a Habilidade da abordagem". Persuasão e Manha são
    primárias (`habilidades.json`); Sedução e Intimidação só existem em
    `habilidades-secundarias.json`, sem elo explícito a uma primária. O mesmo padrão se
    repete em vários pontos dos capítulos de Ações (Cura, Religião, Ritualismo,
    Meditação, Adestramento, Ocultação, "o Ofício da peça", Cavalgar): a secundária
    aparece sozinha, no lugar onde a regra geral (`acoes-e-sistema.md`) diz que "a maior
    das duas entra no pool... onde nenhuma secundária é nomeada, a primária trabalha
    sozinha" · pressupondo sempre uma primária nomeada, o que não acontece nesses casos.

25. **Criação de personagem não distingue Esquiva de Bloqueio.** `defesas.md` deixa claro
    que existem duas Defesas Físicas (Esquiva e Bloqueio), com fórmulas diferentes. A
    tabela de Traços Derivados de `criacao-de-personagem.md` define só uma "Defesa"
    (que bate com a fórmula de Esquiva nos quatro exemplos do capítulo), sem indicar que
    um personagem com escudo precisa calcular uma segunda Defesa Física à parte.

26. **Orçamentos de XP de criação (1500/2000/2600) não existem em nenhum dado, e o
    próprio capítulo admite que estão desatualizados.** `criacao-de-personagem.md` diz
    que os orçamentos "ainda serão reajustados" (sugerindo algo como ~1050 como valor
    real). Não aparecem em `regras.json` nem em nenhum script de validação: nada
    verifica se um personagem estourou o orçamento.

27. **Bloqueio não tem, no capítulo de Defesas, a restrição de porte que o glossário
    documenta.** `glossario.json` traz a regra de que não se apara um atacante 2+
    categorias de porte maior, nem quem tem Força ≥2× e +4 acima. `defesas.md`, o
    capítulo dedicado à Defesa Física, não menciona essa restrição em nenhum momento.

28. **Ajudante: com que pool ele rola?** `acoes-e-sistema.md` diz que o ajudante "rola
    contra metade da Dificuldade", mas nunca diz qual Atributo/Habilidade ele usa (a
    mesma do ajudado? uma perícia própria de "ajudar"?). Os exemplos sugerem que é a
    mesma perícia, mas isso não é dito como regra.

29. **"Passiva" é usado com sentidos diferentes ao longo dos capítulos de Ações.** Em
    `acoes-e-sistema.md` Passiva é estritamente o valor parado (Atributo+Habilidade)×2.
    Em `acoes-resistir.md` (Sono), "Modo · Passiva" descreve uma tabela de Desgaste por
    noites sem dormir, sem fórmula de valor parado nenhuma. Em
    `acoes-sentidos-e-engano.md` (Disfarçar-se, Contrabandear, Etiqueta), "Passiva contra
    quem olha/revista" não deixa claro qual dos dois lados da rolagem é quem não rola.

30. **Sufocamento introduz um sexto "modo" fora da lista fechada.** `acoes-resistir.md`
    rotula Sufocamento como "Modo · nenhum", fora dos cinco modos definidos em
    `acoes-e-sistema.md` (Direta/Acumulada/Longa/Reflexiva/Passiva), sem explicar como
    esse "nenhum" se encaixa no sistema.

31. **Fé entra e sai da lista de "Antecedentes-pessoa".** `antecedentes.md` (introdução)
    lista "Antecedentes que são pessoas: Aliados, Contatos, Mentor, Séquito". A Folha de
    referência do mesmo capítulo lista "Pessoas: Aliados, Contatos, Mentor, Séquito,
    **Fé**". O próprio verbete de Fé diz que ela amarra com a régua "de forma coletiva",
    sugerindo que não segue as mesmas regras de "esfriar se maltratada" dos outros
    quatro, mas isso nunca é dito explicitamente.

32. **Tabela do Séquito com coluna fantasma.** A tabela de níveis do Séquito em
    `antecedentes.md` declara só duas colunas no cabeçalho ("Nível | O que significa"),
    mas todas as linhas têm um terceiro campo colado ("... | Magnitude 1" etc.). Vem do
    próprio dado: `antecedentes.json` tem, no campo `texto`, um `|` literal embutido
    dentro do texto ("Uns poucos serviçais ou capangas (2 a 3). | Magnitude 1"), que
    quebra o parsing da tabela Markdown.

33. **Porte narrativo das raças não corresponde ao porte mecânico.** `racas.md` descreve
    Meio-Elfo como "médio-alto", Meio-Orc e Orc como "alto, robusto" na tabela de
    resumo, mas o campo mecânico `porte` em `racas.json` para as três é **"medio"**,
    igual ao Humano · o mesmo campo que decide a fórmula de PV. Um leitor pode concluir,
    errado, que um Orc usa a fórmula de PV da categoria "Grande".

34. **Meio-Elfo não recebe, no texto corrido, as idades que as outras seis raças
    recebem.** Todas as outras raças declaram no parágrafo de abertura a idade de
    maturidade; o Meio-Elfo só cita o teto de vida (200 anos) no texto corrido · os
    números de Adulto (15) e Maturidade (55) aparecem só na tabela separada de
    Envelhecimento, sem serem citados no parágrafo da raça.

35. **Arredondamento de Ofícios Gerais em nível ímpar não definido.** "Ofícios Gerais
    vale metade ao conferir o Requisito" (`acoes-oficio-e-mundo.md`) não diz o que fazer
    quando o nível é ímpar (ex. nível 3 → 1,5).

36. **"Ofício" usado antes de ser definido, na ordem de leitura do próprio livro.**
    O termo mecânico "Ofício" (perícia secundária + "Ofícios Gerais" primária) só é
    explicado em `acoes-oficio-e-mundo.md` (capítulo 14, lido por último do bloco), mas
    já aparece sem explicação em `acoes-sentidos-e-engano.md` (capítulo 13, lido antes):
    "Inteligência + o Ofício da peça".

37. **Categorias de dano de item ("dano leve", "dano pesado", "peça arruinada") não
    definidas nem linkadas.** Usadas em `acoes-oficio-e-mundo.md` (Reparar) sem remissão,
    diferente do resto do capítulo, que sempre linka a fonte de um termo técnico.

38. **"Sustentar" sem número de Dificuldade**, ao contrário de toda outra entrada da
    mesma família (Escalar, Nadar, Cair, Romper, todas com tabela numérica) em
    `acoes-corpo-e-movimento.md`: só diz "Metade de P é Difícil; o P inteiro é quase
    impossível passar de dois Ticks".

39. **Vontade "5 ou mais" citada sem referência de orçamento.** `aparencia-virtudes-vontade.md`
    diz que "um herói típico leva a Vontade para 5 ou mais", sem ligar esse número a
    nenhuma tabela de custo em XP nem a nenhum nível de campanha, tornando a afirmação
    impossível de verificar ou aplicar no momento em que aparece.

---

## (c) PROPOSTAS DE CLAREZA: nada errado no conteúdo, mas o texto travou a leitura

40. **Colisão de terminologia: "Margem" e "Margem de Quase-Acerto" são conceitos
    diferentes com o mesmo nome.** Em todo o livro, "Margem" significa "cada 6 pontos
    acima do alvo" (definida em `coracao-do-sistema.md`, usada em `combate.md`,
    `acoes-e-sistema.md`, `relacoes-sociais.md`). Em `quase-acerto.md`, "**Margem de
    Quase-Acerto**" é um número completamente diferente: uma soma fixa de bônus de arma
    + bônus de armadura (`Bônus QA da arma + Bônus QA da armadura`), que não nasce de
    uma rolagem nem se relaciona com "6 pontos acima de nada". O capítulo nunca avisa
    explicitamente que está reaproveitando um nome já ocupado; um leitor que aprendeu
    "Margem" no capítulo 1 tende a tentar aplicar a fórmula errada (dividir por 6) à
    Margem de Quase-Acerto.

41. **Defesa Mental quebra silenciosamente o padrão do Valor Passivo ensinado no
    capítulo 1.** `coracao-do-sistema.md` ensina UMA fórmula universal de valor passivo:
    `(Atributo + Habilidade) × 2 + Especialidade + Centelha`. `defesas.md` usa essa forma
    para Esquiva, Bloqueio e Defesa Social, mas a Defesa Mental é uma soma simples de
    TRÊS atributos sem o ×2 (`Raciocínio + Integridade + Força de Vontade + Centelha +
    Especialidade`). O capítulo 1 nunca avisa que existe essa exceção; o leitor só
    descobre ao chegar em Defesas (capítulo 17), depois de ter memorizado a fórmula
    "universal" por dezesseis capítulos.

42. **"Peso" é reusado para dois conceitos diferentes dentro do mesmo assunto (combate
    social).** Em `combate.md`, "peso" da arma decide a Velocidade (leve/média/pesada =
    5/6/7 Ticks). `relacoes-sociais.md` reaproveita de propósito essa mesma lógica
    ("as abordagens vêm em três pesos", espelhando a Velocidade), mas, poucas linhas
    depois, aparece um SEGUNDO "Peso": um bônus discricionário de +0 a +3 que o Mestre
    concede, sem relação com a classificação leve/média/pesada. Na primeira leitura,
    "Peso do argumento" soa como se fosse reler a classificação já apresentada.

43. **Duas taxonomias "leve/média/pesada" coexistem sem aviso destacado.**
    `armas-e-armaduras.md:32` (nota em `<p class="muted">`) avisa que a classe de
    Quase-Acerto é "uma régua PRÓPRIA... e não a mesma classe" de Armas & Armaduras
    (que decide Preparo e Velocidade). O aviso existe, mas fica enterrado no meio do
    capítulo de Quase-Acerto, não no capítulo de Armas & Armaduras, onde a tabela
    "Classes de Arma" é lida primeiro; exige reler três vezes para não confundir as duas.

44. **Tabela de Velocidades mistura dois eixos de leitura sem avisar de cara.**
    `combate.md` (tabela de Velocidade de Ataque) tem uma coluna "Tipo de ação"
    (rotulada) e usa por baixo dos panos a "classe" real da arma (leve/média/haste/
    pesada/distância/arremesso/arte) só explicitada na tabela de Preparo, mais adiante.
    Só a nota de rodapé ("o 'Tipo de ação' é só orientação de leitura") esclarece que a
    coluna central não é a chave usada no resto do capítulo.

45. **Investida e Recarga soam como ações com Velocidade própria, mas não são.**
    `combate.md` apresenta as duas como "espelho" uma da outra, gastando o Preparo (não
    a Velocidade inteira), mas o texto ao redor trata livremente de "Velocidade" e
    "Tick" sem reforçar que a ação-base continua sendo simplesmente atacar. Ao lado, no
    mesmo capítulo, Corrida e Salto realmente têm Velocidade própria (3), o que facilita
    a confusão por proximidade.

46. **"Errou por" exige lembrar um detalhe de duas linhas atrás para não errar a conta.**
    `quase-acerto.md` define `Errou por = (Defesa + 1) − total` (por causa do empate não
    contar como acerto), mas o exemplo logo abaixo não repete o motivo do "+1"; um
    leitor rápido tende a calcular a diferença crua (`Defesa − total`) e chegar num
    valor de Margem de QA diferente do capítulo.

47. **Exemplo do cavaleiro de placa em `armas-e-armaduras.md` omite um passo da conta.**
    O exemplo usa números de "atravessa 6 / atravessa 5 / atravessa zero" que só fecham
    se o leitor lembrar, de um parágrafo anterior qualquer, que a Força entra em dobro
    em armas de duas mãos; sem isso, o resultado parece surgir do nada.

48. **Passo "Atributo máximo 5" seguido, duas frases depois, de uma exceção que o
    revoga.** `criacao-de-personagem.md` diz "Atributo máximo 5; Habilidade máxima 4" e,
    logo em seguida, "cada herói pode ter um pico" (Atributo 6, Habilidade primária 5).
    Na primeira leitura, "máximo" soa como teto absoluto; só a frase seguinte revela que
    é o teto padrão, com uma exceção nomeada.

49. **Repetição tripla da régua de Centelha sem indicar que é a mesma informação.**
    `centelha.md` repete a tabela de tiers, o texto de cada degrau e um callout final
    com a mesma progressão 1-6, em formulações ligeiramente diferentes a cada vez ·
    redundante mas não incoerente; ainda assim, um leitor de primeira viagem pode achar
    que está perdendo alguma nuance nova a cada repetição.

50. **Termo "módulo" (valor absoluto) usado sem alternativa em linguagem comum.**
    `aparencia-virtudes-vontade.md` explica que a Compostura "mascara um ponto do módulo
    do modificador de Aparência... até o piso zero" · matematicamente correto, mas
    "módulo" não é vocabulário comum de livro de mesa, e a frase precisa ser relida
    concentrando no termo técnico para não se interpretar errado (achar que o efeito
    pode inverter o sinal em vez de só zerar).

51. **"Quem escolhe o par" remete a informação já dada, mas obriga a voltar ao capítulo 1
    para confirmar.** `habilidades.md` reafirma que "quem escolhe o par é o Mestre, pela
    descrição da ação", sem repetir, mesmo resumidamente, a nuance já dada no capítulo 1
    (o jogador descreve, o Mestre nomeia o par, e pode aceitar combinações fora da
    inclinação padrão se a ficção sustentar).

52. **Fórmula com colchetes sem explicar a notação.** `habilidades.md` (fórmula de nível
    de Especialidade, `[N ÷ 2]`) usa colchetes sem dizer, ali, que significam
    arredondamento para baixo (como acontece em outras fórmulas do livro). Só dá para
    inferir pelos exemplos logo abaixo.

53. **Ligações "sim/não" quebram o padrão numa célula.** A tabela dos cinco modos de ação
    em `acoes-e-sistema.md` tem, na linha da Longa, "Custa a ação? → fora de cena",
    enquanto as outras quatro linhas respondem só "sim" ou "não" na mesma coluna.

54. **Tabelas de Dificuldade de Escalar/Nadar usam números fora da régua redonda.**
    `acoes-corpo-e-movimento.md` usa Dificuldades como 4, 7, 11, 12, 14, 18, que não
    seguem a escala 5/10/15/20/25/30 apresentada como "a régua comum" em
    `acoes-e-sistema.md`, sem nota explicando o porquê do desvio.

55. **Silêncio comprado por dois caminhos diferentes, sem dizer se empilham.**
    Em `acoes-corpo-e-movimento.md`, a Margem compra silêncio numa ação, e a
    circunstância "tentar sem fazer barulho +4" mira o mesmo efeito · não fica claro se
    as duas se somam, se uma substitui a outra, ou se são mutuamente exclusivas.

56. **Mesma frase ("a Margem faz o próximo intervalo não rolar") com escopos bem
    diferentes.** Em `acoes-resistir.md`, essa frase pula só o próximo intervalo
    individual numa jogada de Resistência, e pula o dia inteiro para o grupo todo numa
    jogada de Sobrevivência do batedor, sem o texto destacar a diferença de escala.

---

## Nota de verificação

Os achados 16-19, 28-30 e 35-39 (bloco de Ações) e 1-19 vieram de uma leitura setorizada
(dividida por blocos de capítulos para cobrir o livro inteiro) e foram conferidos por
amostragem contra os arquivos citados; os itens 6, 14 e 40-41 foram reconferidos
manualmente linha a linha antes de entrar neste documento. Um achado da leitura original
("o link para `/caminhos` em `criacao-de-personagem.md` está morto") foi **descartado**
depois de conferência: a página `src/pages/caminhos/index.astro` existe de fato. O que
permanece válido dessa observação é o item 20 (Proezas fica fora da coleção de capítulos
e fora da ordem de leitura do livro), que é uma lacuna estrutural real, mas diferente de
"link morto".
