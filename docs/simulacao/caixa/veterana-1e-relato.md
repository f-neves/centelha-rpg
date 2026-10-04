# Veterana 1e · relato da Executora

Fonte: `../tmp/veterana/veterana-1e.md` (só leitura, fora da árvore). Rodadas 4 a 11, uma de cada vez. As
rodadas 1 a 3 e as decisões D-036 a D-040 estão em `veterana-1d-relato.md`.

## Rodada 4 · Corpo e movimento

**Antes de mexer.**
- Registro: nenhuma das D-040 a D-053 fala de queda, escalada ou Amortecer. A rodada aplica a decisão da 1b
  sobre a Escalada (Direta na Área do Mestre, Acumulada no Cap. VIII) e a decisão 7 da 1c (a tabela mede o
  0 PV, e a morte é a do Cap. IV). Nada contradiz o registro.
- As citações de (b) foram conferidas contra o main de hoje. O 1e foi conferido no deploy `03d5c00`, e as
  rodadas 2 e 3 entraram depois. Todas ainda estavam lá, e nenhum ponto estava resolvido.
  - O C4a cita o exemplo do Cap. I ("Para escalar um muro liso (Dificuldade 10)"). A rodada 3 mexeu no
    Cap. I, em outra seção, e esta frase não tinha mudado.
  - O "Chegar a 0 PV ou menos deixa você Incapacitado: fora da briga, e ainda vivo." que o QUEDA cita em
    (b) já mudou na rodada 2 do 1d ("desmaiado, fora da briga"). O QUEDA não reescreve essa frase; ele só
    a cita como regra, e a regra continua a mesma.

**Os pontos** (o texto de (e), palavra por palavra):
- **C4a**
  - Cap. VIII, Escalar: o parágrafo "**Direta**" entrou depois do **Modo**, com o link para a Área do
    Mestre;
  - `/mestre`, Dificuldades de exemplo: a coluna "Altura de referência" (5 m, 6 m, 8 m e 11 m nas quatro
    linhas de Escalar, vazia nas outras) e a nota "Escalar na Direta: Dificuldade da superfície (Cap.
    VIII) + altura em metros − 1. Para outra altura, refaça a conta." Os números 8, 12, 18 e 24 não
    mudaram;
  - Cap. I: o exemplo de Kael passou a "Para subir de uma vez uma muralha de pedra lavrada de 4 m
    (Dificuldade 7 + 4 − 1 = 10, Direta)". O resto do exemplo ficou.
- **QUEDA** · Cap. VIII, A altura que mata um não mata outro
  - a tabela ganhou a coluna "Desmaia a partir de" (15/19/24/26 m), e "Morre a partir de" passou a 23, 28,
    36 e 38 m;
  - a frase da tabela;
  - a frase da calibragem ("morre sem socorro; no jogo, [...] e a morte vem aos 23");
  - o último parágrafo do Amortecer.
- **C3a** · Amortecer: a frase da interpolação, e a tabela nova (10 m: 7; 15 m: 18 e 11; 20 m: 35, 29 e 22;
  30 m: 55, 49 e 43; 50 m: 91, 86 e 81).
- **K10** · O dano: a fórmula completa ("Dano de **Impacto**: o valor da tabela menos a Absorção. A Absorção
  natural de Impacto é o Vigor (+ Centelha), mais a da armadura.").

**As contas.**
- `scripts/a4_queda_manobra.py` da Veterana refaz o QUEDA (15/19/24/26 m e 23/28/36/38 m, com os PV finais
  da pessoa comum: 15 m 0, 20 m −10, 22 m −14, 23 m −16) e o C3a (as seis linhas novas, com os meios pontos
  13,5 e 24,5 arredondados para baixo). Bate com o texto.
- **A seção do C4a do mesmo script está desatualizada e não bate com o (e).** Ela ainda calcula "Direta =
  Dif + altura", sem o −1, e com outro pareamento ("pedra comum: 12 = 7 + 5 m", "muralha bem-feita: 18 = 7
  + 11 m", "lisa: 24 = 14 + 10 m"). O texto do 1e usa N = D + h − 1 com o pareamento pelos nomes (4, 7, 11 e
  14), e a conta dele fecha sozinha: 4 + 5 − 1 = 8, 7 + 6 − 1 = 12, 11 + 8 − 1 = 18, 14 + 11 − 1 = 24.
  Apliquei o (e). A Revisora deve conferir pelo (e), e não pela saída antiga do script.

**Verificação** (sobre `58b22ce4`):
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r4.py`:
  - os 16 trechos novos estão lá;
  - os 6 velhos dão 0: "mais a armadura" sem o "da", "morre numa queda", "decide se você vive", "ela vira
    consolo", a linha "50 m 98 89 82 75" e "escalar um muro liso".
  - Saída: "TUDO OK".

**Para quem joga hoje:**
- a escalada ganha a forma Direta;
- a queda separa o desmaio da morte;
- o Amortecer segue a tabela de Dano;
- a Área do Mestre mostra a altura de referência.
Só texto e uma coluna na Área do Mestre. Nenhuma migração.

**Commit da rodada 4:** `6781f6b9` · **CI:** Validar 37191729074 (19 de 19) e Deploy 37191729068 (2 de 2).
Revisora: rodada 130, PROCEDE. O script `a4_queda_manobra.py` é da Veterana e mora em `tmp/`: a seção C4a
dele segue velha (sem o −1), e a nota fica só aqui.

## Rodada 5 · Combate, Manobra, Armas

**Antes de mexer.**
- Registro conferido:
  - D-033 (Rajada), D-043 (Imobilizado), D-048 (as três leituras da Manobra, e manter rolado no Tick do
    Golpe) e D-019;
  - C-046, C-047 e C-048, que a D-033 manda conferir. A Rajada continua sendo regra escrita, e o "feito +
    recebido" da Guarda (C-047) é o que o livro já diz.
  - Nenhum ponto aplicado contradiz o registro.
- Citações de (b) conferidas contra o main: todas estavam lá, e nenhum ponto estava resolvido. A tabela de
  Velocidade já dizia "Ação demorada" desde a rodada 3 do 1d; o ART-28 parte desse texto.
- **O código da Rajada já faz o que a D-033 pede.** `combate-tempo.ts:327-332` dá ao golpe i a penalidade
  `pen × i` com `penDadosAcumula: true` (`regras.json` → `combate.rajada`). Isso é 0, −1d6 e −2d6. Só o
  texto do livro dizia outra coisa. O Grid ainda não cobra o ataque FEITO na Guarda (a K37, adiada): não
  mexi nisso.

**Os pontos** (o texto de (e), palavra por palavra, salvo onde anotado):
- **MANOBRA**
  - Cap. IX: a seção nova "Manobras: agarrar, derrubar, empurrar", inteira, entre a Empunhadura dupla e
    Dano e Armadura;
  - a Vantagem tática: "(Imobilizado: ver Manobras)", e a linha nova do alvo agarrado, −2;
  - a Velocidade 3 ganhou "levantar-se";
  - Corpo e Movimento: "Agarrar, imobilizar, derrubar, empurrar vivem [...] seção Manobras";
  - Ofício e Mundo: "Agarrar, imobilizar, derrubar e empurrar também";
  - glossário: o verbete novo "Defesa de agarrão" (alias "grapple").
- **ESCAPISMO**
  - Corpo e Movimento: as duas linhas novas (Escapar de amarras; Escapar de rede, de Arte que prende e de
    agarrão);
  - Cap. XIII: a tag **Prende** e a Rede ("Prende. Deixa o alvo Preso em vez de feri-lo");
  - `armas.json`: a Rede passou a ter as tags `arremessável, prende`, e a descrição diz Preso. O filtro de
    Tag de `/equipamentos` sai do dado e mostra `prende` em ordem alfabética;
  - `artes/regras`: a linha Aprisionamento e contato;
  - Bestiário (`src/data/bestiario/mon-cobra-constritora.json` e `mon-crocodilo.json`, com o
    `gen-bestiario` e o `gen-monsters` rodados): "enquanto o agarrão se mantém". Na Cobra, o link de (e)
    "([Combate](/regras/combate), Manobras)" ficou "(Combate, Manobras)" em texto puro, porque o texto dos
    poderes do bestiário não renderiza Markdown.
  - Itens 6 e 7: sem mudança de texto, como (e) diz.
- **ESCAPISMO-CAT**: a secundária **Escapismo** entrou em `habilidades-secundarias.json` (grupo corpo; o
  `gen-cap-pericias` a põe em ordem alfabética, entre Escalada e Ginástica). O capítulo foi regerado ("24
  primárias, 67 secundárias").
  - A descrição é a de (e), sem os dois links: nenhuma descrição de secundária tem link, e a ficha mostra o
    texto puro. "[Combate](/regras/combate)" e "[Corpo e Movimento](...)" ficaram "Combate" e "Corpo e
    Movimento".
  - A entrada vai SEM a escala de níveis (0 a 6), que as outras 66 têm. O (e) não dá os textos dos níveis,
    e eu não os inventei. O campo é opcional no esquema. Fica para quem escrever os níveis.
- **T2c**: a frase da Centelha nos quatro lugares (Cap. IX, Cap. XI duas vezes, Cap. V O bônus de nível). No
  Cap. XI a data "(Reforma da Centelha, 28/09/2026)" saiu, como (e) manda.
- **K6a**: a frase da Corrida, a do arredondamento depois das fórmulas e a Investida (a tabela e o exemplo
  da Sora: "corre 7 no Arranque", "cobre 14"). Conferido: o Arranque da Sora (Força 4, Destreza 6,
  Atletismo 3) é 2 + 1 + 0,75 + 3 = 6,75, que dá 7.
- **K1b**: a marcação real nos nove lugares
  - Cap. IX: "lista de exemplos", o link para Armas & Armaduras, "destes modificadores situacionais" e
    "Guarda sob pressão";
  - Quase-Acerto: o link;
  - Criação: "Exceção declarada" e os três links;
  - `/caminhos/leitor-de-almas` (`tecnicas.json`): o itálico virou `<em>que houve</em>`, porque o texto
    das Técnicas só converte `**`.
  - Fora da lista, mesmo defeito: o `` `limitesCriacao.centelha` `` cru no parágrafo da Exceção declarada
    virou `<code>`.
- **RAJADA**
  - a frase da penalidade (0, −1d6, −2d6);
  - depois da tabela de tetos, os dois parágrafos de (e): "A Rajada é de golpes de arma [...]" e "Cada
    golpe da Rajada conta como um ataque feito [...] −6 [...] −4";
  - Guarda sob pressão: "(cada golpe de uma Rajada e cada Manobra é um ataque)".
- **ART-28**: a linha "9 a 15 | Ação demorada | recarregar uma besta", a linha nova da Arte (5 a 7, esticada
  10 em diante) e "as Artes esticadas passam de 7 pela escada do capítulo das Artes".
- **ART-29**: "em todo golpe de arma", e a frase da Arte como exceção.
- **ALCANCE**: a tag Alcance com 1 m e ±2.
- **ARMADURA-2X**
  - Nadar: "o dobro da Penalidade dela [...]";
  - `/equipamentos`: o parêntese da Furtividade e da natação;
  - Cap. XIII: "Na natação, a Circunstância da armadura [...] também substitui a Penalidade."
- **C16a**
  - Corpo e Movimento: a seção nova "Arremessar: o FAA", com a fórmula e a tabela, antes de "O que o motor
    já responde", e o "(a de Arremessar: o FAA, acima)";
  - Cap. XIII e `/equipamentos`: o parêntese da tabela de Arremessar;
  - a tag Pesada sem "ações ágeis".
  - O «O que o motor já responde» dentro do texto de (e) foi escrito com aspas retas, como o livro cita
    seções.
  - Conferido contra o código: `ficha-engine.ts:1662` (FAA = 2 × Força + Atletismo + Arremesso, de 2 a 24)
    e `forca-empurrao.ts:56-74` com as constantes de `regras.json` → `forca` (7, 0,7, 0,4, ápice 0,1 kg,
    teto 0,25, queda 0,8).
- **Arquivo gerado que mudou junto:** `combate-tempo-bench.html` traz o `armas.json` embutido; foi regerado
  (`gen-bench-tempo.mjs`), e só a Rede mudou nele.

**PARADO, à espera do Arquiteto:**
- **K4a (o Desarmado +0/0).** O (e) manda `/equipamentos` dizer +0 de Acerto e +0 de Defesa. A linha da
  página sai de `armas.json`, e o Desarmado lá tem `"acerto": 1, "defesaArma": 1`. Esses dois números são
  lidos pela ficha (o ataque e o Bloqueio de quem luta sem arma) e pela mesa (`armaDoSlot`). Mudar a página
  é mudar o dado, e mudar o dado muda o ataque e a defesa de toda ficha desarmada em 1. A "regra herdada"
  do 1c não está no registro com texto verbatim. Não mexi.

**Divergências de dado que a rodada deixa abertas** (só anoto, nada no (e) as cobre):
- `condicoes.json`:
  - **agarrado** ("Só ações de força, arma curta ou escapar", `defesa −2`): pelo livro novo, o agarrado não
    age. O −2 contra quem ataca de fora bate;
  - **imobilizado** (`defesa −4`, `acao −2`, nota "Agarrado, preso ou amarrado"): pelo livro novo, o
    Imobilizado não age (o `acao −2` diz o contrário), e "agarrado" e "preso" são outros estados;
  - **não existe a condição Preso**;
  - **caido**: a nota "Levantar consome movimento"; o livro diz ação de Velocidade 3.
  - São números que a mesa lê (`defesa`, `acao`).
- `scripts/gen-grid-artes.mjs:248` liga a Arte Prisão (e Engolir, Paralisia, Círculo) à condição
  `imobilizado`. Pelo ESCAPISMO, a Arte que prende causa Preso. É código do Grid.

**Verificação** (sobre `6781f6b9`):
- `npm run validate` verde, depois de regerar o `combate-tempo-bench.html`;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r5.py`:
  - os 45 trechos novos estão lá, em 14 páginas;
  - os 18 velhos dão 0: "conjurar uma Arte de grau alto", "até o teto da Habilidade", "50 a 67%",
    "corre 6.", `**` e "[Armas" no Cap. IX; "teto da Habilidade" no Cap. XI; "Imobiliza, não causa dano" e
    "ações ágeis" no Cap. XIII; "imobiliza" em Equipamentos; "armadura pesada +4" e "um agarrão que já não
    cede" em Corpo e Movimento; "Força/Atletismo vs o nível" em artes/regras; `**` e "](/" em Criação;
    "[Armas" no Quase-Acerto; "*que houve*" no Leitor de Almas; "(Atletismo)" no Bestiário.
  - Saída: "TUDO OK".

**Para quem joga hoje:**
- a regra de Manobras (agarrar, derrubar, empurrar) entra no Combate;
- a Rajada diz o que o Grid já fazia;
- a Rede prende em vez de imobilizar;
- a secundária Escapismo aparece na ficha, sem a escala de níveis;
- o arremesso ganha a tabela do FAA;
- o glossário ganha "Defesa de agarrão".
Nenhuma ficha salva muda, e nenhuma migração.

**Commit da rodada 5:** `3dc09c71` · **CI:** Validar 37193403973 (19 de 19) e Deploy 37193403983 (2 de 2).
O K4a ficou parado: o Arquiteto confirmou que o (e) contradiz a C-029 (Desarmado +1/+1 no `armas.json`), e o
ponto vai ao autor.

## Rodada 6 · Vontade, Defesas e Cap. X (Relações Sociais)

**Antes de mexer.**
- **A cadeia do Resistir**, conferida no registro: C-071 (1 + Margem, antiga) → C-070 (1 ponto) → D-001 (1 +
  Margem, teto 4) → D-015 (teto fora do cortejo, SUBSTITUÍDA) → D-017 (teto 4 também por intervalo do
  cortejo; a C-072 "não é uma ação" fica substituída) → D-042 (repete a D-017). E a D-014 (mental, um grau
  a menos). O RESISTIR do 1e aplica a D-017, que é a decisão viva.
- Os outros pontos aplicam decisões registradas: D-024 (decisão 28, regras sociais), D-025 (29, controle
  percebido) e D-026 (30, Interrogar), e a D-002 (a Mana do mortal como reserva própria; o NOVO-a6-1 só
  escreve a separação no Cap. X). Nada contradiz o registro.
- Citações de (b) conferidas contra o main:
  - o **K2a** já estava resolvido: as duas datas "(Reforma da Centelha, 28/09/2026)" do Cap. XI saíram na
    rodada 5, com o T2c. "Reforma da Centelha" dá 0 em `defesas.md`. Anotado e pulado;
  - o **T4d**: o nó "pontual ou por cena/dia" já tinha saído na correção da 126; o que faltava era o nó da
    "inimizade";
  - o resto estava como o (b) cita.

**Os pontos** (o texto de (e), palavra por palavra, salvo onde anotado):
- **RESISTIR** (D-017) · `relacoes-sociais.md`
  - a fórmula do custo por intervalo, "com teto de 4 por intervalo";
  - o parágrafo seguinte, com o teto e a Vontade presa sem teto;
  - a frase do "não é uma ação" (o antigo `:246`) passou a "pagar para segurar é Resistir [...] vale o teto
    de 4, por intervalo";
  - a Folha de referência: "(teto 4 por intervalo)".
  - **No dado** (`regras.json`), como a D-017 manda: `social.modoDevagar.resistencia` voltou a ter
    `tetoCusto: 4`, com uma `tetoCustoNota` que cita a D-017. A nota do `modoRapido.resistencia` deixou de
    dizer "Não alcança o cortejo [...] em discussão" e diz que o teto vale também, por intervalo, para o
    cortejo. Nenhum código lê esses campos (grep em `src/` e `scripts/`).
  - A pendência **E11** (cortejo em discussão), registrada no Bloco K, ficou FECHADA, apontando para a
    D-017; `Pendencias.md` regerado.
- **NOVO-a6-1** e **LEITURA-4** · Cap. X, Resistir
  - "A Vontade é a mesma reserva das Proezas (a Mana das Artes é outra reserva [...])";
  - "O Resistir não vale contra leitura [...] O +4 na Defesa antes do teste vale também contra leitura
    (Cap. XI).";
  - a Folha: "Não vale contra leitura (o +4 antes do teste vale)."
- **REGRAS-SOCIAIS**
  - as seções novas "Ameaça, Chantagem e Ruptura" e "Rumor e fofoca", depois de Interrogar;
  - a abertura do capítulo e "Como a régua se move";
  - "A régua não sobe em nenhuma linha desta tabela.";
  - "e fere a relação (1 passo [...])";
  - a Folha: a frase do vencer feio, e a linha nova.
- **CONTROLE-PERCEBIDO**: a linha "Ter sido controlado e perceber | −2" na tabela de atos, e o parágrafo
  depois dela.
- **INTERROGAR**
  - a seção nova Interrogar, depois do exemplo da Vesna, em Ceder;
  - a linha da Folha;
  - Sentidos e engano, Interrogar;
  - Resistir, Dor e tortura;
  - Cap. XI, Uma dúzia de casos: as duas linhas novas e o parágrafo novo, com os links em HTML, porque o
    parágrafo é `<p class="muted">`;
  - Investigação: em `habilidades.json`, com o capítulo regerado.
- **REGRAS-CITADAS**: o Segredo e os Contatos, nas linhas "Amarra com" (`antecedentes.json`, com o capítulo
  regerado).
- **T4b** · Cap. XI, Queimar Força de Vontade
  - a frase de abertura (antes e depois do teste);
  - "+4 antes do teste." nas células de Influência social e de Ataques mentais;
  - a Leitura social: "+4 antes do teste, sim. Depois, não";
  - "Não existe blindagem por cena ou por dia" ao fim da célula mental.
- **T4d** · `qual-sistema.md`: o nó "nasce ressentimento (ato de −2 passos na Régua, Cap. X)". O SVG foi
  regerado só para esse diagrama; os outros cinco ficaram iguais ao HEAD. O `gen-mermaid --check` passa no
  `validate`.
- **VONTADE-MAXIMA**: a frase-padrão no Cap. III (Força de Vontade) e na Criação (sob a tabela de derivados);
  "(a Força de Vontade é a máxima [...])" no Cap. III, Integridade, e no Cap. XI, Defesa Mental; o Orc
  ("Força de Vontade máxima do orc × 2"); o glossário (Defesa Mental, Energia e Mana).
  - **Dois ajustes de forma:**
    - no Cap. V, o "(Vontade máxima)" da Energia ficou depois da fórmula em negrito, e não dentro do
      parêntese da soma, onde (e) o põe ("depois do + Vontade"). No meio da soma ele quebraria a fórmula.
      O da Mana ficou depois de "Mana = Centelha × 2 + Vontade", como (e) diz;
    - no Orc, o (e) põe "máxima" em negrito dentro de um trecho que já é negrito. Escrevi sem o negrito
      aninhado.
  - É o ponto que eu tinha deixado para a rodada 5 na rodada 1 do 1d (ART-27): a linha da Energia agora
    leva os dois ajustes.
- **C5a** · `/mestre`: a linha de intimidar o soldado perdeu "vs Defesa Social do alvo", e o parágrafo do
  atalho ganhou as duas frases de (e).

**Verificação** (sobre `3dc09c71`):
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r6.py`:
  - os 39 trechos novos estão lá, em 13 páginas;
  - os 14 velhos dão 0: "não é uma ação", "mesma reserva das Proezas e das Artes", "A régua não se move em
    nenhuma linha", "costuma ferir", "Gastar Vontade não vale contra leitura", "para se blindar:", a
    linha "Tortura, canto [...]", "Reforma da Centelha", "inimizade" no Qual sistema, "vs Defesa Social do
    alvo" no Mestre, "contra Integridade", "Quem interroga rola contra", "munição para as abordagens" e
    "o interrogatório conduzido com método".
  - Saída: "TUDO OK".

**Para quem joga hoje:**
- o cortejo passa a ter teto de 4 por intervalo;
- o Cap. X ganha Interrogar, Ameaça, Chantagem, Ruptura e Rumor;
- ser controlado e perceber custa −2 na régua;
- o +4 antes do teste vale contra leitura;
- a Vontade das fórmulas é a máxima.
Só texto e uma nota no `regras.json`, que nenhum código lê. Nenhuma ficha muda, e nenhuma migração.
