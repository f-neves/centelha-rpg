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

**Commit da rodada 6:** `2ab7da2e`.
- **CI:** o Validar 37194234726 falhou primeiro no Smoke `test-grid` ("[aquece] a peça pegável não está
  na vez"). É intermitente e não tem relação com a rodada, que é só texto. O job rerodado deu verde: 19
  de 19.
- O `c0fde3d0` da Revisora, que já contém este commit, também deu 19 de 19.
- O Deploy dele foi cancelado pelo push seguinte, e o `d558cf05` publicou.
- Revisora 131: PROCEDE na rodada 5, sem CORRIGE.

## Rodada 7 · Ofício, Renda e Serviços (parte 1: o texto)

**Antes de mexer.**
- Registro: a D-011 (o catálogo de preços fica; é a decisão 18 do 1d), a D-031 (Engenharia como ofício de obra; só pedra é
  Alvenaria), a D-052 (o moinho passa para Engenharia, Requisito 3 fica) e a D-034 (Longa a 3 por dado).
  Nada contradiz o registro.
- Citações de (b) conferidas contra o main: todas lá. Os tempos do oficial e o lote estavam a 3,5, como a
  G77 registrou.
- **A rodada se divide em duas.**
  - Esta parte aplica o que é texto escrito à mão.
  - O grupo **SERVICOS, REQUISITO-FAIXA, RENDA-1, GANHO-BRUTO e TETO** mexe no bloco gerado
    `gen:economia-ganhar-a-vida`. As faixas 26/47/96, a coluna de Requisito, a coluna de Livre e o teto em
    Livre saem de `renda.json`, que sai do modelo `lore/economia/v2`.
  - Esse grupo pede mudar o modelo e o gerador. Parei e perguntei ao Arquiteto, e ele fica para a parte 2.
  - A frase de `:253` ("É o que faz o mestre armeiro se mudar para a cidade") é a do teto, reescrita no
    TETO. Por isso o "armeiro" dela ainda está lá.

**Os pontos desta parte** (o texto de (e), palavra por palavra):
- **T3a** (`habilidades-secundarias.json`, com o capítulo regerado): o Ferreiro (a serralheria e "todo
  trabalho em ferro"), a Carpintaria ("ponte de madeira", "casco de barco e de navio", "flecha, arco,
  besta", e "Arcos e construção naval são Carpintaria; não há ofício separado."), a Herbologia e a
  Alquimia. A Caligrafia e o Escrivão não mudaram, como (e) diz.
- **T3b**: a coluna Ofício das tabelas, linha a linha:
  - Arcos → Carpintaria;
  - Herbalismo → Herbologia;
  - Iluminura → Caligrafia, Escrivão;
  - Serralheria → Ferreiro (duas linhas);
  - Alfaiataria → Costura;
  - Curtume → Couraria;
  - Armaria → Ferreiro (as cinco armaduras);
  - Naval, Alvenaria → Carpintaria, Alvenaria.
  - "armeiro" virou "ferreiro" nas duas frases que não são do teto.
  - A lista de ofícios sem "Construção Naval".
- **ENGENHARIA**: o fim da descrição da Engenharia no catálogo, e "Engenharia" na lista de ofícios. As
  linhas da muralha e da casa de pedra ficaram.
- **MOINHO**: a linha "Forja, moinho, oficina montada" virou duas (Forja, oficina montada, Alvenaria; Moinho,
  Engenharia), as duas com 23 semanas.
- **LONGA-2**:
  - o parágrafo das tabelas (oficial soma 6, Habilidade 3, média 9; perito média 14; mestre média 18; o
    que quer dizer "fechada ao oficial");
  - as três escalas com os tempos novos;
  - o lote;
  - a espada por grau, com a Sucata "Ferreiro 1 (soma 6), três quartos de dia";
  - a frase da Excelente (37 semanas; 12 na oficina de mestre);
  - o faz-tudo (cinco dias e meio);
  - o braçal (média 6);
  - os aprendizes;
  - a direção de obra;
  - a muralha (23 por estação);
  - a carroça (12 dias, 10,7 em lote).
  - O catálogo de preços não mudou (D-011).
  - A tabela gerada do Ganhar a vida (Oficial média 10,5, etc.) NÃO mudou: é da parte 2.
- **C21a**: a placa de munição "fechada ao oficial", e a Excelente no LONGA-2.
- **C8a**: "+1 ponto de qualidade, gasto na tabela de Melhoria do Cap. XIV" / "−1 ponto de qualidade", e
  a frase do que o ponto compra, com o link.
- **RENDA-2** (`custo-de-servico-e-itens.md`, fim do primeiro parágrafo de Renda): a frase da simplificação
  do Mestre.
- **K2b**:
  - "até a G73" e "até a B14" saíram de `custo-servicos.md` e de `CalculadoraRecompensa.astro` (o aviso
    do topo e a linha da conta);
  - "(`limitesCriacao.centelha`)" saiu da Criação;
  - o "`aaltura` [...] `Dif × 3/5`" do Mestre virou "a soma à altura de cada degrau (Atributo +
    Habilidade) é a Dificuldade × 3/5";
  - nas cinco armaduras de `armaduras.json` a nota "Armadura órfã resolvida (§5 [...])" saiu da
    descrição (que vira a coluna Notas da tabela), e a frase de (e) entrou uma vez, numa linha acima da
    tabela de Armaduras, nomeando as cinco. A frase tem a palavra "provisórios", então ganhou os
    marcadores `TOLERÂNCIA` e `LEVANTA QUANDO` (o balanceamento final das armaduras);
  - "(B14 fase 3)" saiu das duas notas do bestiário (`mon-gigante-das-nuvens`, `mon-gigante-do-fogo`),
    com `gen-bestiario` e `gen-monsters` rodados;
  - o `combate-tempo-bench.html`, que embute as armaduras, foi regerado.
- A pendência **G77** ganhou a atualização: o texto do Ofício já está a 3 por dado; seguem a 3,5 o bloco
  gerado do Ganhar a vida e a economia gerada. `Pendencias.md` regerado.

**Verificação** (sobre `d558cf05`):
- `npm run validate` verde, depois dos marcadores de tolerância;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r7a.py`:
  - os 35 trechos novos estão lá. O "Fechada ao oficial" aparece com aspas curvas, pelo tipógrafo do Astro;
  - os 20 velhos dão 0: Armaria, Serralheria, Herbalismo, Iluminura, Alfaiataria, Curtume, "Naval,",
    "Construção Naval", "média 10,5), para", "quinze semanas", "267 pc", "num número da peça", "35 por
    estação", G73 e B14 em Serviços e na calculadora, `limitesCriacao` na Criação, `aaltura` no Mestre,
    "órfã" em Equipamentos e "B14 fase 3" no Bestiário.

**Commit da rodada 7, parte 1:** `028213ac`. CI: Validar 37196367500, 19 de 19; Deploy 37196367497, 2 de 2. A
parte 2 (SERVICOS, REQUISITO-FAIXA, RENDA-1, GANHO-BRUTO, TETO) espera a escolha do Arquiteto entre mexer
no modelo da economia, aplicar só o texto ou segurar.

## Rodada 8 · Artes: regras, Mana e Mente

**Antes de mexer.**
- Registro conferido:
  - D-001 e D-014 (Resistir mental: 1 + Margem, ou 1 e um grau a menos);
  - D-002, D-003 e D-004 (Mana do mortal, Meditação, lugares de fluxo);
  - D-006 (teto de Arte);
  - D-020 (Artes de mente);
  - D-021 (Sustentado de Duração 1);
  - D-023 (frase geral da Dificuldade com Ataque);
  - D-046 (régua de Duração das Proezas);
  - D-049 (Energia Espiritual sem número);
  - C-025 (Dificuldade de resistir a efeito: nível da Arte × 5 + 2 × mín).
- O único choque é o do ART-37, abaixo. O resto não contradiz o registro.
- Citações de (b) conferidas contra o main: todas lá.
- Varri `scripts/` atrás de cada frase velha que troquei. Só o `test-artes-grid.mjs` lê texto de
  `regras.json`: o rótulo do grau 0 da Duração breve e as Dificuldades de ficar parado. Os dois pontos
  ficaram parados, abaixo.

**Parados, um a um, com o motivo** (nada deles entrou):
- **ART-37** (a Dificuldade pelo maior grau investido, × 5): contradiz a **C-025**, que está no ar e diz
  "nível da Arte × 5 + 2 × o menor entre a Centelha do conjurador e o nível da Arte". O (e) troca a
  variável (grau investido no lugar do nível da Arte) e tira o termo da Centelha, sem citar decisão
  numerada para isso. Com ele ficam parados:
  - as 33 linhas `(nível da Arte) × 4/× 5` de `efeitos.json`;
  - o Dissipar;
  - Mãos sobre a Multidão;
  - o parágrafo "Nível da Arte e grau investido não são a mesma coisa".
  - Do ATAQUE-DIF entraram só as duas frases sem número, que são a D-023. A linha "(maior grau
    investido) × 5" das seis entradas é do ART-37 e ficou.
  - A célula Aprisionamento já estava na redação de A·ESCAPISMO desde a rodada 5.
- **ART-34** (ficar parado contra 5, 7, 9 e 11): o número é do código. `artes-grid.ts:1882` calcula
  `difParado: Math.ceil(difMetade / 2)`, que dá os 5, 8, 10 e 13 do texto, e o
  `test-artes-grid.mjs:790` afirma "borda 10 vira 5, meio 15 vira 8, fundo 20 vira 10". Por isso ficou
  também o item 17 do Em revisão ("os números de ficar parado"), que o ART-18 tirava por causa do
  ART-34.
- **ART-5**, só as duas células do grau 0 da tabela: o `test-artes-grid.mjs:61` afirma o rótulo
  "instantâneo (no máximo 1 tick)". Além disso, `TURNOS_LONGA[0] = 1` (`artes-grid.ts:155`) é um turno,
  6 Ticks, e o comentário ali diz que os dois zeros diferem de propósito: "1 Tick" na Longa muda esse
  número. Entrou só a maiúscula de "Dura um Tick.".
- **ART-38** (o Efeito Bola de Fogo): é uma entrada nova em `efeitos.json`, com bloco `grid`, e a
  contagem 140 é lida no código do Grid e nos testes. Ficaram com ele:
  - o título do catálogo;
  - a frase "o Efeito Bola de Fogo, de nível 4";
  - as contagens Fogo 9, Gelo 14, Raio 12 e Luz 10.
- **ART-40** (a Terra dobra o dado): o "1d6 por nível" dos Efeitos não está no JSON, é o `valorPar`
  (`artes-fmt.ts:39`) que o escreve para todo parâmetro Dano, e a linha nova da tabela pede outra
  escala em `regras.json`. O (d) ainda traz a objeção de mesa ao 12d6. O catálogo também ficou, para não
  dizer 2d6 enquanto os Efeitos dizem 1d6.

**Divergências do Grid** (o texto entrou, e o tabuleiro não faz o que ele diz; nenhum número lido pelo
código mudou):
- **ART-35**: o texto diz que a Velocidade vem do maior grau investido. O `ticksDe`
  (`artes-grid.ts:389`) dá `4 + nível do Efeito` ao Efeito e `5 + esticados` fixo ao improviso.
- **ART-33**: o texto diz que o primeiro alvo da Cura é grátis e que o resto custa 2 por nível. O
  `custoDe` (`artes-grid.ts:350`) cobra 2 por nível só no parâmetro Cura, e 1 por nível no Alvos, desde
  o primeiro.
- **ART-11**: o texto diz que a escada de Defesa pesa no total de quem desvia fora da vez. A jogada do
  desvio no Grid (`artes-grid-mesa.ts:1793`) só soma o bônus de quem identificou o efeito.
- **ART-36 e ART-42**: o texto separa o projétil de Gelo, Água e Terra (matéria, a armadura absorve e
  dá para bloquear) do de Fogo e Raio. O bloco `grid` do Projétil Conjurado e da Arma Elemental tem
  `materia: null` para todas as Artes.
- **MENTE**: as 17 linhas **Conjurar** entraram em `efeitos.json` como parâmetro fixo, que o
  `parametrosAjustaveis` já filtra do custo. Só que o `RANK` de `artes-fmt.ts` não conhece "conjurar", e
  a linha sai depois da Dificuldade, e não acima dela como o (e) pede. Pôr `conjurar: 5` no `RANK` é uma
  linha de código só de ordem de exibição, e ela espera o Arquiteto.

**O que entrou**, ponto a ponto (o texto de (e), palavra por palavra, salvo onde está dito):
- **DURACAO-PROEZA**:
  - a régua de Duração das Proezas em Centelha, depois do parágrafo dos parâmetros das Técnicas;
  - a remissão em Como ler (`/caminhos`);
  - "em Centelha, Os seis níveis das Proezas" na linha mental das Defesas.
- **ART-1**: Erudição, Pacto, Iniciação, e a frase que fecha As Tradições.
- **a7-MORTAL**:
  - a abertura do Arcano;
  - o Artefato em `antecedentes.json`, com o capítulo regerado.
- **FLUXO**: a frase dos lugares de fluxo nas Escolas do Arcano.
  - O (e) diz "no fim do primeiro parágrafo (o que termina em 'a corte de um senhor')". O parágrafo
    continua depois disso ("Ela nasce dentro de uma das seis Tradições..."), e a frase entrou no fim
    dele.
- **MANA-MORTAL**:
  - a abertura das Regras das Artes, sem "provisório". O marcador `TOLERÂNCIA` / `LEVANTA QUANDO` que
    estava em cima dela saiu junto, porque já não marca nada;
  - Quando o Mana volta, mais os parágrafos Meditação e Lugares de fluxo. A "frase de A·ART-41, sobre a
    Vontade máxima" não existe no 1e: o ART-41 de lá é o da Energia Espiritual, e a decisão 45 tirou a
    remissão;
  - a linha 0 e o parágrafo do mortal em Centelha;
  - Pisos e princípios e Traços derivados na Criação;
  - a Força de Vontade em Aparência;
  - o verbete Mana do glossário, que manteve o "(Vontade máxima)" da rodada 6;
  - `recuperacaoMana.descanso` perdeu a "meditação", porque o parágrafo da página o lê.
- **MEDITACAO**:
  - o verbete Meditação (`habilidades-secundarias.json`, capítulo regerado);
  - a Arte Mana, níveis 1 a 6, e o plural do nível 1;
  - o Meditar do Cap. VIII.
- **TETO-ARTE**:
  - Custos de XP, sem "provisório" e com "O teto de Proeza continua igual à Centelha.";
  - a frase depois da Centelha máxima em Limites. A frase da Centelha 3 em si não foi tocada (D-040);
  - o passo 9;
  - as linhas 1 a 6 da tabela de Centelha e o item 4 de O que a Centelha faz;
  - a abertura do catálogo;
  - o verbete Centelha do glossário. A mesma frase velha está em `ficha-engine.ts`, que não foi tocado.
  - O mortal-tocado e Bram são da rodada 10, e a frase "que no mortal é a própria Força de Vontade" do
    mortal-tocado continua lá.
- **ART-2**: o preço em XP, no fim de Como se aprende uma Arte.
- **ART-3**: A Centelha nas Artes, depois de A Arte que toca a mente e do Resistir.
- **ART-6**: Vento no lugar de Ar em todos os trechos de (e), e "Terra (inclui o metal do nível 5)".
  - O (e) do ART-39 escreve "Terra e Metal" e "Ar" nas frases que reescreve, e ele mesmo remete os nomes
    ao ART-6. Lá entrou "Terra metade do lado, Vento e névoa o dobro" e "o Vento não tem dano no
    improviso".
- **ART-7**: a Massa lançada.
- **ART-8**: o "piso" dos 87 cm.
- **ART-9**: a Aura.
- **ART-10**:
  - o bloco com 1,26 m² contra 0,92 m²;
  - a pegada do Bloco "retangular (2 : 1)", na página: o `pegada` de `regras.json` continua
    `retangulo`, que é o que o Grid lê;
  - a Neblina "molda em esfera, cúpula, bloco ou coluna".
- **ART-11**: a escada no total, "pesando no total", "em cima do total", e o item do Em revisão com 5 +
  5 × metros.
- **ART-12**:
  - o alcance do improviso pela distância da fatia;
  - o título "O molde medido contra o Deslocamento de Batalha";
  - o "só prende, sem jogada".
- **ART-13**: a tabela com Centelha 0 e a nova com Centelha 3, em `regras.json`, com a frase de leitura
  depois das duas. A página ganhou a segunda tabela.
- **ART-14**:
  - "Volume 3 (3 m de base)" no exemplo de custo;
  - o mesmo erro no "Jorro sustentado" de `improviso.exemplos`, que a página não mostra, consertado junto.
- **ART-15**:
  - a Vida e o 0 PV em A economia da Cura, sem o "M-21b";
  - o Cura 4 do catálogo;
  - a Cura Guardada;
  - o Refazer o Corpo.
- **ART-16**: o exemplo da composta em pontos.
- **ART-17**: o "Fogo, Raio e Luz não têm nenhum de nível 1" saiu.
- **ART-18**:
  - a Área de saída;
  - a data da manifestação;
  - os moldes do volume e a §5.4;
  - os focos;
  - o "M-21b";
  - o Em revisão, itens 1, 7, 8, 10, 13, 16 e 19. O 17 ficou (ART-34, acima).
- **ART-31**:
  - o teste de concentração (Compostura + Concentração contra 10);
  - Servo de Ossos, Convocar e Invocar.
- **ART-32**:
  - a tabela vale também para as universais;
  - a nota do improviso;
  - As duas alturas;
  - a abertura dos Efeitos.
  - O `improviso.escopo` de `regras.json`, que a página não mostra e dizia o mesmo "definidos caso a
    caso", foi consertado junto.
- **ART-33**: o primeiro alvo grátis (Grid divergente, acima).
- **ART-35**: os três textos (Grid divergente, acima).
- **ART-36**:
  - o critério da matéria nos Efeitos, em Conjurar e resistir;
  - o Projétil Conjurado;
  - a Arma Elemental.
- **ART-39**: as três frases.
- **ART-41**: a Energia Espiritual sem "com que rapidez volta".
- **ART-42**: a linha da tabela, e o parágrafo de Bloquear uma Arte.
- **ART-43**:
  - a linha Sustentado;
  - as frases da janela;
  - a Labareda que fere duas vezes.
  - O parágrafo da página dizia "Sustentar cobra a cada 6 Ticks. gasta a ação do lance": com as frases
    novas no meio, ele passou a "Sustentar gasta a ação do lance".
- **ART-44**: a sobretaxa e a ordem do desconto.
- **ART-45**:
  - o Vento sem dano no improviso;
  - o Vendaval do catálogo (o Efeito Muro, 2d6).
- **ART-46**: o Ritual não falha por dado.
- **SUSTENTADO-1**: a Duração 1 compra só presença.
- **ATAQUE-DIF**: a frase geral em Conjurar e resistir, e a remissão na abertura dos Efeitos (D-023).
- **MENTE**:
  - a linha da mente na tabela;
  - A Arte que toca a mente;
  - o item 1 do Em revisão;
  - a abertura dos Efeitos;
  - as 17 linhas Conjurar, com as Habilidades da tabela;
  - Boa Impressão contra a Defesa Social;
  - o Comando do catálogo;
  - a frase do teste de Virtude em Aparência.
- **RESISTIR-MENTE**:
  - o parágrafo depois de A Arte que toca a mente;
  - Como ler (`/caminhos`);
  - a remissão em Relações Sociais.

**Citações reapontadas:** o `reapontar.mjs` moveu três citações de `docs/simulacao/CONJURACAO.md` para
`regras.astro` (`:382` virou `:401`, `:307-324` virou `:314-331`, `:151` virou `:157`). A pasta `docs/`
estava limpa antes. A frase de `CONJURACAO.md:243` ainda descreve o teste de concentração antigo, e não
foi tocada.

**Verificação** (sobre `028213ac`):
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde, 110 páginas.
- No gerado, com `../tmp/executora/prova-r8.py`, em 14 páginas:
  - os 127 trechos novos estão lá;
  - os 63 velhos dão 0.
  - A frase velha do mortal-tocado, que é da rodada 10, ficou fora da lista de propósito.

**Correção da Revisora (veredito 133), num commit à parte depois do `0aca9c99`:** em `acoes-oficio-e-mundo.md:123`, o negrito antigo "numa oficina bem equipada ou de mestre, dez aprendizes aceleram uma espada Comum e não fazem uma Ótima" tinha ficado colado à frase nova dos aprendizes. Saiu, e ficou só a frase nova ("numa bem equipada, só os de soma 4 ou mais.").

**Rodada 8, decisões do Arquiteto sobre os parados** (depois do `0aca9c99` e do `ce0f116b`):
- **MENTE, a ordem da linha Conjurar: liberada.** `conjurar: 5` entrou no `RANK` de `artes-fmt.ts`, num
  commit próprio. A linha Conjurar passa a sair acima da Dificuldade, como o (e) pede. Na Imagem Viva ela
  sai também acima da Jogada de quem duvida, porque as duas têm o mesmo peso e a Conjurar vem antes no
  JSON. Prova no gerado: `dist/artes/efeitos/index.html` tem as 17 linhas
  "Conjurar: Influência + ...", cada uma seguida da Dificuldade, e na Imagem Viva a ordem é Conjurar,
  Jogada e Dificuldade. `validate` e `tsc` passaram, e o build com `--force` também.
- **ART-37: pausado, vai ao autor.** A C-025 continua valendo e não foi mexida. O que o 1e pede:
  - a Dificuldade dos 28 Efeitos (33 entradas) passa de "(nível da Arte) × 4" ou "× 5" para "(maior grau
    investido) × 5", tabela 5, 10, 15, 20, 25 e 30, sem o termo da Centelha da C-025;
  - o Dissipar decide pelo maior grau investido de cada lado;
  - Mãos sobre a Multidão cura 1 PV por grau investido;
  - nas Regras das Artes, o parágrafo "Nível da Arte e grau investido não são a mesma coisa".
- **Parados para a lista do autor, porque mexem em número que o código ou os testes leem.** O que cada um
  pede:
  - **ART-34**: ficar parado contra a régua da Virtude, um degrau por metro, borda 5, dois metros 7, três
    metros 9 e núcleo 11, no lugar de 5, 8, 10 e 13. Hoje o código faz `Math.ceil(difMetade / 2)`
    (`artes-grid.ts:1882`), e o teste confere 5, 8 e 10 (`test-artes-grid.mjs:790`).
  - **ART-5**: o grau 0 das duas Durações passa a "instantâneo (1 Tick)". Hoje a Breve diz "no máximo
    1 tick", e o teste confere esse rótulo (`test-artes-grid.mjs:61`). A Longa diz "no máximo 6 Ticks",
    e o código conta 1 turno, 6 Ticks (`TURNOS_LONGA[0]`, `artes-grid.ts:155`).
  - **ART-38**: o Efeito novo Bola de Fogo, nível 4, em Fogo, Gelo, Raio e Luz, com Alcance normal,
    Explosão de 0,5 a 8 m de diâmetro e Dano de 1d6 por nível. As contagens mudam para Fogo 9, Gelo 14,
    Raio 12 e Luz 10, e o total de 140 para 141 Efeitos, que o código do Grid e os testes leem. Vêm junto
    o título do catálogo (Fogo 4) e a frase "o Efeito Bola de Fogo, de nível 4".
  - **ART-40**: a Terra dobra o dado em todo dano dela, com a linha nova "Dano da Terra" (2d6 a 12d6) na
    tabela de parâmetros. Pede também "2d6 por nível" em Lascas, Projétil Conjurado, Arma Conjurada e
    Muro de Terra, e 2d6 nos níveis 1 e 2 do catálogo. Hoje o "1d6 por nível" sai do `valorPar`
    (`artes-fmt.ts:39`) para todo parâmetro Dano. O (d) traz a objeção de mesa: o 12d6 do grau 6 (média
    42, contra 21 do Fogo) precisa passar por mesa.
- **O Grid contra o livro**, ponto a ponto. O Grid não foi mexido, e cada ponto é dúvida para o autor:
  - **ART-35**:
    - o livro diz que a Velocidade é 5, 6 ou 7 pelo maior grau investido, e que o esticar multiplica a do
      conjuro antes de esticar;
    - o Grid (`ticksDe`, `artes-grid.ts:389`) dá ao Efeito 4 + nível do Efeito + 1 por grau esticado, e ao
      improviso 5 + 1 por grau esticado, sem olhar o maior grau.
  - **ART-33**:
    - o livro diz que o primeiro alvo da Cura é grátis, e que do 2º em diante cada nível custa 2;
    - o Grid (`custoDe`, `artes-grid.ts:350`) cobra 2 por nível só no parâmetro Cura, e o Alvos a 1 por
      nível desde o primeiro.
  - **ART-11**:
    - o livro diz que quem desvia fora da vez leva no total a escada da Defesa (−2 no Preparo, −4 no Golpe,
      −2 por golpe pendurado na Recuperação);
    - o Grid (`artes-grid-mesa.ts:1793`) só soma o +2 ou +4 de quem identificou o efeito.
  - **ART-36**:
    - o livro diz que o Projétil Conjurado e a Arma Elemental de Gelo, Água e Terra são matéria, e que a
      armadura os absorve;
    - no Grid os dois têm `materia: null` em todas as Artes, e o tabuleiro não separa a Arte.
  - **ART-42**:
    - o livro diz que o que deixou matéria se bloqueia como a arma de arremesso do mesmo tamanho, e que
      Fogo, Raio, Luz e Sombra só se esquivam;
    - nos módulos `artes-grid*.ts` não há regra de Bloqueio contra Arte (procurei por "bloqu"), e o
      `materia: null` é o mesmo. Não conferi qual Defesa o tabuleiro usa contra o projétil.

## Rodada 9 · Artes: catálogo e Efeitos

**Antes de mexer.**
- Registro conferido:
  - D-050 (Vida 1);
  - D-022 (Chão Traiçoeiro);
  - D-020 (MENTE, já aplicada na rodada 8, com a Boa Impressão contra a Defesa Social);
  - C-025 (a Dificuldade pelo nível da Arte, que segue valendo).
- A decisão 24 da 1c (Sopro de Vida, Campo de Alívio, Mão Firme, Acelerar a Cura) não tem entrada
  própria no registro. Não achei nada que a contradiga.
- Citações de (b) conferidas contra o main: todas lá.

**Pausados ou parados** (nada deles entrou):
- **ART-47** (Acelerar a Cura encurta o intervalo em 10% por nível da Arte, até 50%; abaixo de 0 soma +1
  por nível ao Tratar): parado porque mexe no que o código lê.
  - O parâmetro Cura do Efeito tem o campo estruturado `porNivel: true`, e o Grid cura com ele 1 PV por
    nível da Arte (`artes-grid.ts`, comentário do campo; L86b). O comentário diz que o campo existe para
    que a frase e o padrão não virem duas especificações.
  - Trocar só a prosa para "encurta o intervalo em 10%" deixaria o JSON dizendo as duas coisas no mesmo
    parâmetro. Mudar o comportamento é mexer no Grid.
  - O que o 1e pede: o parágrafo novo do verbete, a linha de parâmetro e o parágrafo de baixo, já
    citados no (e) do ART-47.
  - Só o "(`M-21b`)", que é do ART-24, saiu do verbete.
- **ART-23, o Chamar à Mão**: o texto novo manda rolar "contra a Dificuldade" e acrescenta a linha
  "Dificuldade: (maior grau investido) × 5", que é do ART-37, pausado contra a C-025. Fica com ele.
  Engolir e Projétil Conjurado entraram.
- **ART-20, o Vento 3**: as duas correções finais do 1e discordam no mesmo trecho.
  - O ART-45 (rodada 8, PROCEDE no 134) pôs "rajada cortante (o Efeito Muro, 2d6)".
  - O ART-20 pede "desvia projéteis; rajada que derruba", sem dano.
  - Ficou o texto da rodada 8, e a escolha é do Arquiteto. Os outros itens do ART-20 entraram.

**O que entrou:**
- **VIDA-1**: "aliviar o cansaço: tira uma penalidade de Desgaste".
- **ART-48**: o Sopro de Vida com os 10 minutos, 1 PV, acordado e em Crítico, e o exemplo.
- **ARTE-MANA**: a frase final de Quando o Mana volta.
- **ART-19**: o "(N Mana)" saiu dos níveis do catálogo, na página (`catalogo.astro`).
  - O campo `custo.mana` continua em `artes.json`, porque o schema de `validate-data.mjs` o exige, de 1 a
    6. Tirar o campo é mudar o schema, e isso fica para o Arquiteto decidir.
  - Conferido: a ficha (`arteFx`, `artePrint`) não mostra o custo, e só a página do catálogo o lia.
- **ART-20**:
  - Fogo, Gelo e Raio 1 "a 1 m";
  - Fogo 3 "em leque", 2d6 e 4 m;
  - Gelo 3 com 2d6;
  - Raio 3 "da mão ao alvo";
  - Raio 4, o Efeito Corrente.
- **ART-21**: Estalo (Raio 1), Restauração (Cura 4), Jato Forte (Água 2).
- **ART-49**: Campo de Alívio e Mão Firme diante do Tratar.
  - Não conferi o que o Grid faz com a Mão Firme em quem está abaixo de 0. O campo `pontos: 1` dela não
    mudou.
- **ART-50**: Simpatia "(vs Defesa Social)". A Boa Impressão já tinha entrado na rodada 8. A Máscara
  (Ofuscação 2) segue "vs Defesa Mental", como o MENTE manda.
- **CHAO** (D-022):
  - o texto, a Jogada e a Dificuldade "(maior grau investido) × 5", com a metade, para cima, para quem só
    anda.
  - É o único Efeito com "maior grau investido" enquanto o ART-37 espera o autor, e o termo vem da
    própria D-022 ("grau x 5").
  - O Grid não trata o Chão de modo especial: não há código que leia essa Dificuldade.
- **ART-22**:
  - Metal Incandescente, "6 Ticks por grau de Duração" e Dano "Fixo: não sobe com o grau.";
  - Paralisia, "a cada 2 graus de Duração";
  - Fenda, "1 metro por grau de Profundidade".
  - As réguas impressas não mudaram, e o `1d6` que o Grid lê no Metal também não.
- **ART-23**:
  - Engolir, Força + Atletismo;
  - Projétil Conjurado, Destreza + Arremesso e Percepção + Atirador.
- **ART-24**:
  - a data do Metal Incandescente;
  - o "M-21b" do Acelerar a Cura;
  - o "provavelmente barato demais" de Mãos sobre a Multidão.

**Observações da Revisora (veredito 134), só anotadas, sem agir:**
- `regras.json`, `arcano.resistencia.tipos[2]` ainda diz só "Defesa Mental (passiva)". A página tem a
  linha nova do MENTE escrita direto em `regras.astro`, e esse campo não é mostrado.
- `docs/simulacao/CONJURACAO.md:243` descreve o teste de concentração antigo.

**Verificação** (sobre `663f0ef8`):
- `npm run validate` verde;
- `gen-grid-artes --check` em dia;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado, com `../tmp/executora/prova-r9.py`:
  - os 31 trechos novos estão no catálogo, nos Efeitos e nas Regras;
  - os 21 velhos dão 0.

## Rodada 10 · Criação de Personagem

**Antes de mexer.**
- Registro conferido:
  - D-053 (as fichas de exemplo ficam até o fim da revisão);
  - D-047 (só Técnica sem pré-requisito nenhum);
  - D-044 (Bram com as Artes no nível 3, total 1401);
  - D-038 (o mortal-tocado pela amplitude, texto do autor);
  - D-002 (Mana do mortal).
- Nada contradiz o C15a.

**O que entrou:**
- **C15a** (regra geral, não ficha), em `criacao-de-personagem.md`:
  - Pisos e princípios terminam em "**Centelha 0** · nenhuma **Técnica**.";
  - a frase do Modelo de custo;
  - as quatro primeiras frases do parágrafo de Custos de XP (Técnica a Técnica, o Requer continua na
    ficha).
  - O resto do parágrafo, da rodada 8, não mudou.
- **Mana do mortal no O mortal-tocado**: só a frase velha "que no mortal é a própria Força de Vontade"
  virou o trecho do (e) do BRAM, "uma reserva separada da Vontade e do mesmo valor dela" (escolha 2 do
  Arquiteto). O título e o resto da seção, que a D-038 reescreveu com texto do autor, não mudaram.
- **Pendência D17** (`docs/pendencias/D-proezas-tecnicas.md`): revisar as fichas de exemplo ao fim da
  revisão do sistema. Ela leva:
  - a nota do Bram (Artes no nível 3, total 1401, D-044; `:153` intocado);
  - os pontos pulados;
  - o caso da D-047.
- **Pendência A33** (`docs/pendencias/A-arcano-artes.md`): o `custo.mana` do catálogo, da rodada 9.
- `Pendencias.md` regerado. As 8 anomalias que o gerador acusa já existiam antes.

**Pulados pela D-053, e anotados na D17:**
- N1;
- ART-26;
- BRAM (a ficha, o título e o parágrafo do mortal-tocado);
- TECNICAS-EXEMPLOS;
- C20a;
- ART-25.

**A D-047 não tem troca possível** (escolha 1 do Arquiteto: (c), as fichas não mudam e o caso vai ao
autor):
- Pelo catálogo, o Encontrão Relâmpago (Kael), o Comando Inspirador (Sora) e a Investida Devastadora
  (Veil) pedem uma Técnica de outra Proeza que a ficha não tem.
- As outras Técnicas de nível 3 dessas Proezas já estão na contagem, e não há Técnica de nível 3 sem
  pré-requisito no catálogo.
- A conta da opção "fica sem" está na D17.

**Verificação** (sobre `5e32204d`):
- `npm run validate` verde;
- `npx astro build --force` verde.
- No gerado (`dist/regras/criacao-de-personagem/index.html`):
  - os cinco trechos novos aparecem uma vez cada;
  - "qualquer Proeza 0", "subir uma Proeza de nível" e "que no mortal é a própria" dão 0.

## Rodada 11 · Proezas (`/caminhos`)

**Antes de mexer.**
- Registro conferido:
  - D-030 (decisão 34: os números da Veterana no D43 e o +6 no D49);
  - D-019 e D-043 (Imobilizado não age, nem com Firula);
  - D-045 (Prensa Crescente, Esmagar nos Braços e Abraço do Titã vão para a calibração e não se tocam).
- Nada contradiz.
- Citações de (b) conferidas contra o main: todas lá. A Esquiva Impossível estava com o `texto` vazio.

**O que entrou:**
- **a4-1**: o texto do Imobilizar em `tecnicas.json`, que aparece em `/caminhos/agarrao-do-urso` e em
  `/tecnicas`.
  - O item 2 do (e) é só leitura nova, sem mudança de texto.
  - As três Técnicas da D-045 não foram tocadas.
- **D43**:
  - os textos de Demolidor, Pancada Destrutiva, Romper, Estilhaçar, Abrir Brecha, Esmaga-Pedra e
    Quebra-Muralhas;
  - a tabela do Romper no Cap. VIII: a parede de taipa ou de tábuas na linha 20, as linhas 35 e 40, e a
    frase "Acima de 30" no parágrafo do teto mortal.
  - Golpe que Vaza e Terremoto ficaram como estavam.
- **D49**: o texto da Esquiva Impossível.
- **Os selos novos.** O selo da página não é texto: sai do campo `efeito` da Técnica pela trilha do
  Cap. V (`modProeza`, `src/lib/data.ts:9`, que só a página de Proezas e a `/tecnicas` leem).
  - Pancada Destrutiva, Abrir Brecha, Esmaga-Pedra, Quebra-Muralhas e Esquiva Impossível passaram de
    `estado` para `bonus`, e os selos saem +3, +6, +9, +15 e +6, como o (e) pede.
  - O Demolidor continua `dano` (+1d6), mantido.
- **O parágrafo de abertura da Quebra-Muralhas.** Não havia lugar para ele: a página da Proeza só mostra
  o `descricao` do caminho. Entrou um campo opcional `nota` em `caminhos.json`, só no `quebra-muralhas`.
  Para isso:
  - o campo opcional foi aceito nos dois schemas (`src/content.config.ts` e `scripts/validate-data.mjs`);
  - `src/pages/caminhos/[id].astro` o mostra depois do subtítulo, com o negrito do "Romper".
  - É código só de exibição, e espera a liberação do Arquiteto antes de subir.

**Verificação** (sobre a árvore da rodada 10):
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.
- No gerado:
  - os 16 trechos novos estão em Quebra-Muralhas, Agarrão do Urso, Vento, `/tecnicas` e o Cap. VIII;
  - os 4 velhos dão 0 ("ignora parte da dureza", "armas inferiores ao bloquear", "gasta ação para
    escapar" nas duas páginas).
  - Os selos lidos nos cabeçalhos: Demolidor +1d6, Pancada Destrutiva +3, Abrir Brecha +6, Esmaga-Pedra
    +9, Quebra-Muralhas +15, Esquiva Impossível +6.

**Prova de que nada além da exibição lê o `efeito` das Técnicas ou o `nota` do caminho** (condição 1 do
Arquiteto). Feita com a ferramenta Grep, porque o `grep` pelo shell perdeu linhas pelo hook.
- **Quem lê `tecnicas.json`** (em `src/` e `scripts/`):
  - `content.config.ts` (o schema);
  - `src/lib/data.ts`, por `getCollection`;
  - `ArvoreTecnicas.astro`;
  - `ficha-engine.ts:14` (`TEC_D`);
  - `dados/nomes-ficha.json.ts`;
  - `dados/criatura/[id].json.ts`;
  - `marcadores.astro`;
  - `index.astro`;
  - `gen-monsters.mjs`;
  - `test-proezas-modulos.mjs`;
  - `validate-data.mjs` (o schema);
  - e os scripts de migração antigos (`add-social-trees`, `migrate-social`, `retag-bandas`, `fix-*`), que
    escrevem o arquivo e não rodam no build.
- **Nenhum `mesa-*.ts`, nenhum `artes-grid*.ts`, nem o `grid.astro` ou o `combate.astro` importam
  `tecnicas.json`.**
- **Quem lê o `efeito` de uma Técnica:**
  - só o `modProeza` (`src/lib/data.ts:9`), chamado em `TecnicaItem.astro:8` e em `tecnicas.astro:49`;
  - e a cópia dele, `modOf`, em `ArvoreTecnicas.astro:47` e `:134`.
  - Os três são o selo na tela.
  - Em `ficha-engine.ts`, o `TEC_D` só alimenta id, nome, nível, Requer e texto (`:123-133`). Os
    `.efeito` do arquivo são dos Efeitos das Artes e dos níveis do catálogo (`:592`, `:687`, `:718`).
  - `criatura/[id].json.ts:27` copia só `nome` e `caminho`.
  - O `p.efeito` de `mesa-bestiario.ts:345` e `gen-monsters.mjs:133` é o poder natural da criatura, outro
    objeto.
  - O `test-proezas-modulos.mjs` não lê `efeito`.
- **Quem lê `caminhos.json`:**
  - `content.config.ts` e `data.ts`, de onde vem o `cam` de `caminhos/[id].astro`;
  - `ArvoreTecnicas.astro`;
  - `ficha-engine.ts:124-126` (só id, nome e atributo);
  - `nomes-ficha.json.ts`.
  - O campo `nota` só é lido em `caminhos/[id].astro:28`.
- D-045 respeitada: Prensa Crescente, Esmagar nos Braços e Abraço do Titã não mudaram, e a calibração
  (D54, D55, D56) não entrou.
- A comparação de `tecnicas.json` com o HEAD, Técnica a Técnica, mostra nove mudadas: esquiva-impossivel,
  demolidor, pancada-destrutiva, romper, estilhacar, abrir-brecha, esmaga-pedra, quebra-muralhas e
  imobilizar.

## Rodada 12 · As respostas do autor (D-054 a D-064)

**Antes de mexer.** Li as entradas D-054 a D-064 (commit `5ee62d88`). C-025 e C-029 estão substituídas
por D-060 e D-057. Vale a regra geral da D-054: o Grid fica congelado, e nada em `artes-grid*.ts`,
`mesa-*.ts`, `grid.astro`, `combate.astro`, `gen-grid-artes.mjs` nem em dado que só o Grid lê mudou.

**Tarefa A (D-057, Desarmado):** só conferência, mandada ao Arquiteto por mensagem. `armas.json` não foi
tocado.

**O que entrou:**
- **D-055** (a ficha básica não tem restrição de criação):
  - em Limites na criação, "Centelha máxima **3** (...)" e o "com a Centelha 3 do teto de criação, até o
    nível 5" deram lugar a "A ficha básica não tem restrição de criação, e isso vale também para a
    Centelha: quem informa aos jogadores as restrições da campanha é o Mestre." A frase do teto de Arte
    ficou "(Centelha + 2)";
  - `regras.json` `limitesCriacao` perdeu o `centelha: 3`, e a nota diz D-040 e D-055. Nenhum código lê
    `limitesCriacao`.
  - Varri capítulos, `regras.json`, glossário e ficha atrás de "teto 3", "Centelha máxima" e "teto de
    criação". O que ficou, e por quê:
    - `criacao-de-personagem.md:33` e `centelha.md:86` dizem que o Mestre escolhe a Centelha inicial pela
      campanha, "0 numa campanha mortal; de 1 a 3 numa heroica". É orientação ao Mestre, e não teto, e
      ficou.
    - A "Exceção declarada" de Veil diz "o teto de criação é Centelha 3", mas é da ficha (D-053), e foi
      anotada na D17.
- **D-056** (cai o teto 3 de Recursos e Artefato):
  - o campo `tetoCriacao` saiu de `antecedentes.json` (Recursos e Artefato), e o schema saiu de
    `validate-data.mjs:40`;
  - o `notaFormato` "Nomeado (teto 3 na criação)" do Artefato saiu: o gerador cai no "Nomeado";
  - `antecedentes.md` regerado (`:208`);
  - os dois trechos escritos à mão (`:54-55` e `:318`) agora dizem que quem limita é o Mestre. O
    "Antecedentes.md:54 teto de +6" não foi tocado;
  - `criacao-de-personagem.md:52`: a tabela de custos perdeu o "teto **3** na criação em Recursos e
    Artefato";
  - `regras.json` (nota dos antecedentes): saiu a frase do teto 3.
  - **A ficha** (`ficha-engine.ts`, código da ficha e não do Grid): saíram o aviso "criação até 3" e o
    comentário que o explicava (antes em `:2410-2418`), e as duas chamadas `teto(a)`. Saíram também o CSS
    `.ante-teto` de `FichaSkeleton.astro` e a isenção do `test-portoes.mjs` que apontava para o comentário
    apagado (o portão acusa isenção órfã).
  - Ninguém mais lia `tetoCriacao`: só a ficha e o schema.
- **D-060** (ART-37, a Dificuldade é "maior grau investido × 5"):
  - nas Regras das Artes, o parágrafo "Nível da Arte e grau investido não são a mesma coisa", depois de
    "nenhum parâmetro passa do nível da Arte";
  - em `efeitos.json`, as 28 linhas de Dificuldade com "(nível da Arte) × 4" ou "× 5" passaram a
    "(maior grau investido) × 5", inclusive as seis do ATAQUE-DIF e o Dissipar;
  - o Dissipar ganhou "decide o maior grau investido de cada lado";
  - Mãos sobre a Multidão ganhou "o nível é o maior grau investido por quem conjurou: 1 PV por grau" e
    "Cura: 1 PV por grau investido". O campo `porNivel`, que o Grid lê, ficou (N7);
  - em `regras.json`, a conta antiga de `resistencia.rolagem` virou "(maior grau investido) × 5", e a de
    `resistencia.tipos[3]` ("nível efetivo do efeito × 5") passou à redação da célula Aprisionamento da
    página.
  - Ficaram com o nível da Arte, como o ART-37 manda: a Distância de Arremesso do Empurrão
    (`(nível da Arte) × 4`, o FAA), o Peso Erguido, a Resistência do Escudo de Força, as Penalidades e a
    altura do Muro.
  - Releitura do Chão Traiçoeiro: já está em "(maior grau investido) × 5" desde a rodada 9 (D-022), e
    concorda.
  - A fórmula da C-025 ("× 5 + 2 × mín") não aparece em lugar nenhum do livro nem do código, só em
    documentos de decisão e de rodada.
  - **Chamar à Mão, pausado de novo**: a linha nova "Dificuldade: (maior grau investido) × 5" muda o
    bloco `grid` gerado do Efeito (o `gen-grid-artes.mjs --check` acusou), e o gerador e o bloco são do
    Grid. Desfiz o trecho, e ele foi para a N8.
- **D-062** (Acelerar a Cura): o texto do ART-47 entrou.
  - O verbete diz: cada nível encurta em 10% o intervalo da tabela de Recuperação, até 50%. Abaixo de 0
    soma +1 por nível ao Tratar. A linha de parâmetro diz "Cura: encurta o intervalo em 10% por nível da
    Arte". O encurtamento não soma com o da Cura de quem cuida e não vale na linha "por dia".
  - Concorda com a C-068 (10% por nível, o intervalo encurta), com a D-034 ("Acelerar 10% não vale
    abaixo de 0 nem na linha por dia") e com a D-009 (+1 por nível da Vida no Tratar).
  - Não toca a D-050, que é o catálogo da Vida 1.
  - O `porNivel`, que o Grid lê, ficou (N6).
- **D-063**: nenhum texto diz "rajada que derruba" no Vento 3, que segue "rajada cortante (o Efeito
  Muro, 2d6)". A frase aparece só no Vento 2 (`artes.json:397`, Lufada Cortante: "rajada que derruba um
  alvo leve e desvia um projétil contra você"), que é outro nível e não é o texto do ART-20.
- **`docs/pendencias/N-grid-pendencias.md`** (novo): a lista única da D-054, com 15 itens:
  - N1 a N5: ART-35, ART-33, ART-11, ART-36, ART-42;
  - N6: Acelerar a Cura;
  - N7: Mãos sobre a Multidão;
  - N8: Chamar à Mão;
  - N9 a N13: os cinco da D-064;
  - N14: a escala do Escapismo;
  - N15: o Desarmado, a preencher.
  - Para o `Pendencias.md` listar o tema N, o `gen-pendencias.mjs` passou a ler `[A-LN]` (o M continua
    fora, como levantamento). O `test-gen-pendencias.mjs` passa.
- **A34** em `A-arcano-artes.md`: a recalibração das Artes com ART-34, ART-5, ART-38 e ART-40, e a ordem
  da D-061 (a Bola de Fogo antes da revisão das fichas; o Mago de Batalha segue em Fogo 4).
- **D17** ganhou a resposta da D-059 e a nota da Exceção declarada de Veil.

**Não entraram (D-053, D-058, D-059, D-061):** as fichas de exemplo, a parte 2 da rodada 7, ART-34,
ART-5, ART-38, ART-40, K4a e o Vento 3 do ART-20.

**Verificação:**
- `npm run validate` verde;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `node scripts/test-portoes.mjs` verde;
- os testes da ficha: o `test-contrato.mjs` passou, e o smoke da ficha
  (`.claude/skills/run-centelha-rpg/driver.mjs`) passou inteiro;
- `npx astro build --force` verde.
- No gerado:
  - os 12 trechos novos estão em Criação, Antecedentes, Regras das Artes e Efeitos;
  - os velhos dão 0: "Centelha máxima", "Centelha 3 do teto de criação", "teto 3 na criação", "param no
    3", "é o nível da Arte de cada um que decide", "a mesma conta do Acelerar a Cura", "1 PV por nível da
    Arte".
  - Na página de Efeitos sobram 5 "(nível da Arte) × 4", que são a Distância de Arremesso do Empurrão nas
    cinco Artes, e 1 "(nível da Arte) × 5", que é a Resistência do Escudo de Força. As duas ficam, como
    o ART-37 manda.
  - "(maior grau investido) × 5" aparece 37 vezes: as 33 entradas mais as 4 do Chão Traiçoeiro.
