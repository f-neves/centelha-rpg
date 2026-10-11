# B. Bestiário

- [x] ~~**B12 · O Grid da mesa não aplica fraqueza/resistência de criatura nenhuma.**~~
  **FECHADO em 08/09/2026, sha `20daeea`.** `elementosCombate()` (`src/lib/mesa-core.ts`) passa a
  centralizar a leitura de `combate.fraquezas`/`combate.resistencias`, usada pelos quatro pontos
  (`artes-grid-mesa.ts` ×2, `mesa-bestiario.ts`, `criaturas.astro`). `scripts/test-elementos-combate.mjs`
  trava a regressão, ligado ao `npm run validate` (confirmado no `package.json`, linha do script
  `validate`). **Conferido em 08/09/2026, contra uma afirmação de fora do arranjo, que o
  achado da frente L não fica inválido:** o caminho de dano da bateria (`scripts/sim/bateria.mjs`
  → `scripts/sim/lib-ponte.mjs`) importa `resolverGolpe`/`fonteRolada`/`defesaEfetiva` de
  `src/lib/lance.ts` (zero menção a fraqueza/resistência nesse arquivo) e `tierDe`/`somarCondicoes`
  de `mesa-core.ts`, **não `elementosCombate`**. Os três call-sites reais de `elementosCombate`
  (`artes-grid-mesa.ts`, `mesa-bestiario.ts`, `criaturas.astro`) não são alcançáveis pela ponte da
  simulação. O B12 nunca afetou nenhum número da bateria, inclusive o teto de 76,7% do item de
  carga do mestre: ele só mudava o dano de Arte e a exibição no Grid ao vivo, nunca a bateria
  standalone. Não havia pré-requisito real, então nada a tirar de porta nenhuma.
- [x] ~~**B1 · Preencher `fraquezas` e `resistencias` nas 308 criaturas.**~~ **FEITO em
  2026-08-10.** Os campos não cabiam no `inimigos.json`, que é gerado, então viraram o **sétimo
  satélite** do bestiário: `src/data/elementos-bestiario.json`, semeado por
  `scripts/gen-elementos.mjs` e embutido no `monsters.json` pelo `gen-monsters.mjs`. **Três
  camadas** dentro do script, cada uma vencendo a de cima: a regra por categoria e tag (64
  criaturas), o **material** de que a criatura é feita (22) e as exceções à mão (14); o JSON de
  saída é descartável. **100 das 308 têm alguma coisa (32%)**, 101 contando a criatura de
  `inimigos-custom.json`, que traz as suas inline e não passa por este script. E a
  previsão do `Arcano_revisao.md` bateu na mosca: são **47 com fraqueza a luz e sagrado**, os 32
  Corruptores mais os 15 Mortos-vivos, os 15% do livro que o Luz mira. O vocabulário ficou fechado
  em 15 palavras e o **validador falha o build** em qualquer palavra fora dele ou em fraqueza e
  resistência ao mesmo tipo. Aparece no bloco do bestiário, em duas linhas novas.
- [x] ~~**B1b · O que a fraqueza faz em número.**~~ **Decidido em 2026-08-10**, e a resposta é uma
  só para todos os tipos: **o dano não é absorvido por nada e é agravado.** Nem armadura, nem
  resistência, nem Absorção natural, nem Centelha; e ainda não fecha com descanso nem com a
  perícia Cura. **Com isso o Luz deixa de ser exceção**: ele é agravado contra as criaturas das
  trevas porque elas têm a fraqueza, não porque a Arte seja especial, e uma criatura de água
  atingida por Raio sofre agravado pela mesma razão. Isso rendeu dado novo: **água e metal
  ganharam fraqueza a raio** (condutividade), cinco criaturas. Escrito em `Arcano_revisao.md` §9,
  pendência 4c e na tabela de dano, e explicado num callout do bestiário.
- [ ] **B4 · [DECIDIR] Nada causa dano `sagrado` nem `profano`.** As duas palavras só existem
  hoje *dentro* de dois Efeitos de Luz, como condição. São **47 criaturas com fraqueza a sagrado**
  e 8 a profano esperando uma fonte de dano que o livro não tem. Ela viria da mecânica de clérigo
  e paladino: **depende de F3**. Enquanto não vier, metade das fraquezas do bestiário é decorativa.
- [ ] **B5 · [DECIDIR] `prata` não é representável.** `armas.json` não tem campo de material, então
  "adaga de prata" não existe como dado. Vampiro e lobisomem têm fraqueza que nenhuma arma do livro
  dispara. Ou entra um campo `material` na arma, ou vira etiqueta narrativa que o Mestre aplica.
- [ ] **B6 · [DECIDIR] `sol` é ambiente, não ataque.** Só o vampiro tem, e quem dispara é a cena.
  Talvez pertença à ficha de **Ambiente** (`Acoes_Sistema.md` §8.5) em vez da régua de dano.
- [ ] **B2 · [FAZER] Modificadores de Defesa por porte.** Criatura não média não tem ajuste de
  Defesa hoje; o porte já mexe em PV e Absorção, falta a esquiva.
- [ ] **B3 · [FAZER] Rebalancear os brutos grandes.** O pool de ataque deles está acima da régua da
  Centelha (registrado em `Proezas_revisao.md` e `REVISAR.md`).

**O editor de criaturas** entrou em 2026-08-10 (`BestiaEditor.astro` + `src/lib/bestia-editor.ts`):
botão no bloco de cada criatura e um "Nova criatura", os dois só para o ADM, abrindo um modal de
cinco abas que cobre o esquema inteiro e recalcula os derivados ao vivo. Ele nasceu com três
limitações conhecidas, que são as três de baixo.

- [ ] **B7 · [FAZER] O ataque da criatura do livro não volta para o formulário.** O `monsters.json`
  guarda o ataque **já calculado** (`pool: "2d6 +1"`, `dano: "1d6 +2 corte"`, `speed`) e não a
  origem dele (atributo, perícia, dados, mão, penetração), então não há como repopular a linha sem
  adivinhar. O modal mostra o ataque do livro em leitura, marcado como tal, em vez de deixar a
  lista vazia fingindo que a criatura não ataca. **O conserto é no gerador**: o `gen-monsters.mjs`
  preservar os campos de origem ao lado do calculado. Criatura nova não sofre disso, porque ela
  nasce com os campos de origem.
- [ ] **B8 · [FAZER] O modal não edita poderes, técnicas nem artes.** As três listas existem no
  `monsters.json` e o formulário não as toca, então criatura cadastrada por ele sai sem nenhuma das
  três. Encosta em **A9** (como uma criatura carrega Efeito Especial no stat block): não vale
  desenhar a UI das artes antes de A9 dizer o formato.
- [ ] **B9 · [DECIDIR] Onde a criatura editada mora.** O site é estático: o modal guarda a edição no
  `localStorage` do navegador e oferece o bloco pronto para colar no `inimigos-custom.json`, que é
  o único caminho que entra no build. Duas pontas soltas nisso. A primeira: **editar criatura do
  livro não tem para onde ir**, porque o `inimigos.json` é gerado, e a correção teria de voltar à
  bancada `conversao-monstros.html`. A segunda: o portão de ADM é `ehAdmin()`, **portão de
  interface e não de segurança**, o que basta enquanto o dado é estático e deixa de bastar no dia
  em que a edição escrever no Supabase, como as fichas já escrevem.
- [x] **B10 · [RESOLVIDO 2026-08-17] `inimigos.json` saía de sincronia calado.** Detalhe em
  `Bestiario_Centelha.md`. A suspeita registrada aqui (**"os números novos são os que a bancada
  manda; os antigos é que estavam velhos"**) estava invertida: **o regen de 10/08 desfez a
  Reescala**. A prova é tripla: a distribuição antes do regen tinha um buraco exatamente no degrau
  que a Reescala **inseriu** (nada em Centelha 2); o `Reescala.md` já avisava, na Fase 6, *"se
  regerar do zero, reaplicar o +1 nos ≥2"*, e o passo não foi refeito; e o **Campeão (herói
  inimigo)**, cujo conceito é "um adversário à altura dos PJs", lia Desperto 2 enquanto Kael, o
  herói de referência, é 3. Quatro criaturas ficaram até impossíveis, carregando Técnica de nível 3
  com Centelha 2. **110 criaturas subiram +1**: as 91 de Centelha ≥3 e 19 das 57 do degrau 2, que
  passou por **triagem** em vez de subir em bloco (sobe quem tem piso técnico 3 ou ameaça 4+; ficam
  no Desperto as 38 de tropa, emboscada e bicho de estrada). Os derivados vieram por fórmula, sem
  delta à mão. **O conserto de fundo:** o +1 passou a morar **na fonte** (bancada,
  `conversao-extra.json` e os builds inline), o gerador ficou idempotente (verificado byte a byte) e
  o novo **`gen-bestiario.mjs --check`** falha o `validate` e o `build` se o JSON commitado divergir
  da fonte, nomeando as criaturas. De quebra, dois resquícios da régua velha saíram do gerador: a
  nota de "acima do teto mortal" ia marcar 16 Semideus como entidade, e o nível de Arte era cortado
  em 5 quando as Artes já têm 6.
- [ ] **B11 · [FAZER] Palavra nova de fraqueza precisa de rito para virar oficial.** O vocabulário
  vive em `src/data/elementos-vocab.json` (15 palavras, lido pelo validador, pelo gerador e pelo
  editor) e o **validador falha o build** em qualquer palavra fora dele. O modal aceita palavra
  avulsa e a guarda no `localStorage`, o que serve para rascunhar mas não atravessa: quem quiser
  oficializar tem de editar o JSON à mão. Falta o passo que promove a palavra rascunhada.
- [x] **B13 (renumerado de B12 em 08/09/2026) · [FAZER] `roladaManual` dobra o bônus fixo em pool
  "0d6" literal.** Colidia de código com o B12 da fraqueza/resistência: as rodadas 17-18 já o
  citavam como "D16c/B12" (`docs/simulacao/caixa/17-executora.md:53`, `18-revisora.md:99`) antes de
  este item entrar no mapa, e quando entrou o código já estava em uso por outro achado. Renumerado
  para não haver dois itens com o mesmo código; o conteúdo não mudou. Achado colateral
  da rodada 16 do Interpor (`docs/simulacao/caixa/16-executora.md`), fora de escopo daquela
  frente. `roladaManual` (`src/lib/rolagem.ts:131`) trata qualquer expressão sem `d6` como "total já
  pronto" quando só um número é digitado, certo para dano fixo de verdade, mas quando a expressão
  é um pool escrito como `"0d6+2"` (caso real de `mon-bat`/`mon-toad`) e a rolagem sai por
  `rolagem=site` e é relida como digitação manual, o `+2` fixo entra duas vezes: uma dentro do
  total rolado, outra somada de novo por `flatDeExpr`. Não corrigido ainda; a Executora contornou
  no teste novo usando um pool com dado de verdade (`3d6+21`) em vez de reproduzir o caso "0d6".
  **Fechado na revisão da rodada 94 (23/09/2026), com prova:** `888a196` (22/09/2026), "roladaManual dobrava o bonus fixo de qualquer golpe com o bolo em zero dado", com asserção em `scripts/test-rolada-manual.mjs`.
- [ ] **B14 · [DECIDIR] Recalibrar nível de desafio e Centelha das criaturas, e revisar as fichas do
  bestiário.** **Desde 10/10/2026, a revisão das fichas segue a B20 (o bestiário novo, D-095 a D-103).** Registrado em 26/09/2026, na rodada 115, a partir da proposta do autor, que segue
  abaixo como ele escreveu. **Achado, e não decisão:** no dado vivo, o desafio é o campo `ameaca` de
  `src/data/inimigos.json`, de 1 a 6 nas 309 criaturas; a `centelha` vai de 0 a 10 (só a
  `mon-tarrasque` está em 10). O fator da recompensa de caça é `REC_FATOR` em
  `lore/economia/v2/modelo.py:447`.
  - **Proposta do autor (DECIDIR):**
    > Escalas desejadas pelo autor: nível de desafio de 1 a 12 (hoje 1 a 6, os losangos, campo
    > `ameaca`) e Centelha da criatura de 0 a 12 (hoje 0 a 10, campo `centelha`).
    > Definição do autor: nível de desafio X é feito para um grupo de 4 personagens de Centelha X, com
    > habilidades variadas, passarem dificuldade para vencer, gastando recursos e se ferindo. É
    > absoluto, não relativo ao grupo que joga.
    > Personagem sem Centelha fere criatura com Centelha, e o inverso também.
    > Revisar todas as fichas do bestiário por essa definição.
    > Dependência: a recompensa de caça usa o desafio. Se a nova escala cobrir o mesmo perigo em passos
    > menores, o fator da recompensa passa de 1,75 para cerca de 1,32 (um parâmetro em `modelo.py`).
    > Revisar junto.
  - **A escala do desafio, DECIDIDA pelo autor (registrado em 02/10/2026, sem executar):** de 0 a
    12, e nenhuma criatura passa de 9, exceto a Tarrasca (10). O campo `ameaca` (1 a 6, os
    losangos) é o que precisa se ajustar a isso, quando a B14 gravar o desafio nas fichas.
  - **O `REC_FATOR` (1,75 contra 1,32) não é decisão aberta** (autor, 02/10/2026): era da regra de
    Degrau, que saiu no item 2e do fechamento da economia, trocada pela tabela de valor por
    desafio. Conferido em 02/10/2026: o `REC_FATOR` já não existe em `lore/economia/v2/modelo.py`
    (saiu em `5d068c65`, 01/10/2026) nem em outro código do repositório; a citação
    `modelo.py:447` do achado acima é histórica.
  - **Armas naturais (D-066, 05/10/2026), para quando a B14 chegar às criaturas:**
    - uma linha na abertura do bestiário, no tom da Luta desarmada do Cap. XIII: quem tem armas naturais
      (garras, chifres, carapaça, corpo de pedra ou ferro) ataca e se defende com elas, quase todas
      bloqueiam sem tomar dano, e o Mestre julga as exceções;
    - o ataque e a defesa do Golem de Ferro e do Golem de Pedra são revistos com essa regra. A fixação
      dos dois como "media" no `gen-monsters.mjs` (N20) fica como está até lá.
  - **Criatura não tem dupla de garras ou patas (D-068 e a cláusula dos dois Punhos da D-083, 10/10/2026).**
    Só as mãos fazem par (os dois punhos e a mão que conta como arma); chute, mordida, cauda e patas de animal
    são opções de ataque, não par. **As medições da bancada de 01/10/2026 que modelaram "duas armas naturais,
    uma por pata" estão infladas** (davam à criatura o segundo golpe da empunhadura dupla que ela não tem).
    Não as use como base de desafio. **As fichas refeitas nascem com uma arma natural por ação.** O bestiário
    não se edita agora; a divergência fica aqui até a B14 chegar nas fichas.
- [x] **B15 · [CORRIGIDO em 28/09/2026, achado da própria rodada estava ERRADO] O bônus de
  Centelha NÃO sai 0 em toda criatura.** Registrado em 28/09/2026, Fase 1 da Reforma da
  Centelha, como "as 309 fichas do bestiário não têm bloco `pericias`, o bônus de Centelha em
  Defesa/ataque de TODA criatura sai 0". **Essa conclusão estava errada**, achado ao investigar
  o CI vermelho do editor de bestiário na mesma rodada: eu tinha testado passando a ficha SOURCE
  (`src/data/bestiario/<id>.json`, campo `skills`) direto para `stat()`, sem passar por
  `paraStat()` primeiro, que é quem converte `skills`→`pericias` e `willpower`→`vontade`.
  Conferido agora pelo caminho real (`lerCriaturas()` → `paraStat()` → `stat()`): **0 das 309
  fichas** ficam sem Esquiva ou Integridade (as duas têm valor em `skills` sempre), e o bônus de
  Centelha nessas duas Defesas funciona normalmente (ex.: Treant, Centelha 3, Integridade 4,
  `centelhaNaJogada` = 6, Defesa Mental publicada 22). A única lacuna real: **309 de 309 sem
  `skills.sociabilidade`**, mas `stat()` já tem um fallback (linha ~82, igual ao de
  `bestia-editor.ts`) que usa a melhor perícia social presente (Oratória/Manha/Persuasão/
  Liderança/Política) em vez de zerar, então Defesa Social também não sai capada por omissão na
  maioria dos casos. Não há lacuna de dado a preencher aqui; fechado.
- [ ] **B16 · [DECIDIR] Tipos de dano fora do vocabulário fechado (ácido, e possivelmente
  outros).** Registrado em 29/09/2026, B14 Fase 4, processando o Pudim Negro: a nota dos
  graves diz "dano principal passa a ser ácido", e "ácido" não está no vocabulário de
  `fraquezas`/`resistencias`/`imunidades` (`elementos-vocab.json`) nem é um dos três tipos
  físicos (`corte`/`perfuracao`/`impacto`) que o `tipoDano` de um ataque aceita hoje. Não
  criei palavra nova no vocabulário, conforme o item 8 do despacho original ("resistências
  novas... só anote em pendência, não crie palavra agora"). O Pudim Negro e a Lesma
  Gigante (língua raspadora) ficaram com o tipo de dano físico que já tinham (impacto/
  perfurante) até esta pendência fechar. Achados aplicando o resto das notas mecânicas
  (29/09/2026): a mesma lacuna aparece em "resistência contornada por ferro frio" (Crag
  Linnorm, Sátiro), "resistência contornada por prata ou pelo bem" (Diabo Barbado),
  "resistência contornada por adamantina" (Golem de Argila, Golem de Carne) e "imunidade a
  magia" (Golem de Argila, Fogo-fátuo): nenhuma dessas quatro entrou na ficha, ficam só
  documentadas aqui. "Efeitos mentais" (Crag Linnorm, Cubo Gelatinoso) também não tem
  palavra própria no vocabulário; usei o mais próximo que já existe (nenhum, nestes dois
  casos) em vez de forçar uma palavra errada.
  - **Adiada pelo autor em 03/10/2026** (rodada de pendências de 03/10/2026, Bloco K): o vocabulário de resistências fica
    para depois.
- [ ] **B17 · [DECIDIR] Descrições faltando (item 4 inteiro) + 38 criaturas com Arte
  ainda para reverter a poder natural, sem nota dos graves.** Registrado em 29/09/2026,
  B14 Fase 4, item 3/4/8; **unificado em 29/09/2026** por decisão do autor (as duas
  pendências eram separadas antes e viraram uma só). Cobre:
  - **86 poderes naturais sem `descricao`** (contagem em 29/09/2026, depois de fechar os
    52 graves mecânicos e Balor/Diabo do Fosso/Kraken): poderes de fases anteriores
    (golems, elementais pequenos, dragões, etc.) e das próprias 38 criaturas abaixo, uma
    vez revertidas. Os campos MECÂNICOS (`efeito`, `resiste`, `usos.periodo`, `base`
    quando aplicável) estão completos em 100% dos poderes naturais hoje (conferido por
    varredura própria); só a prosa do `descricao` falta.
  - **38 criaturas com `arte` gravada ainda para reverter a poder natural**, sem nota dos
    graves: não são caster de verdade (não estão na lista fixa dragões/Lich/Couatl/Ninfa/
    Planetar/Solar/Ghaele/Rakshasa/Naga, nem são as três NPCs humanas Cultista/Feiticeiro
    Menor/Mago de Batalha): `mon-aranha-das-fases, mon-archon-cao, mon-assombracao-wraith,
    mon-behir, mon-besta-deslocadora, mon-bodak, mon-bruxa-verde-hag, mon-ciclope,
    mon-cocatriz, mon-diabo-osseo, mon-diabrete-imp, mon-doppelganger, mon-dretch,
    mon-driade, mon-erinia, mon-espectro, mon-ghast, mon-ghoul, mon-glabrezu,
    mon-gorgona-touro-de-ferro, mon-harpia, mon-hezrou, mon-lamia, mon-marilith,
    mon-medusa, mon-monstro-da-ferrugem, mon-mumia, mon-ogro-mago-oni, mon-pegaso,
    mon-pixie, mon-quasit, mon-quimera, mon-sucubo, mon-unicornio, mon-vampiro, mon-vrock,
    mon-wight, mon-xorn`.

  Decisão do autor (29/09): ele vai mandar um arquivo pronto com efeito, usos, resiste e
  descrição de cada poder das 38 criaturas, e as descrições que faltam nas fichas já
  revertidas; a aplicação inteira vira uma rodada própria, fora desta Fase 4. A Fase 5
  não depende disso: lê os campos mecânicos, que já estão completos.
- [ ] **B18 · [FAZER] Fila da B14: medir o bando por N, com a Regra de Horda a partir de 8.**
  Registrado em 01/10/2026, Adendo 3 do fechamento da economia
  (`docs/simulacao/caixa/fechamento-economia-reforma-despacho.md`, item 2c), só anotado: medir fica
  para a B14, sem decidir nada. A recompensa de caça usa hoje "+1/2 desafio a cada dobra dos
  equivalentes", marcado como provisório no capítulo e na calculadora, e a bancada do item 3
  (`docs/simulacao/caixa/fechamento-economia-reforma-relato.md`) contradiz: para N = 1, 2, 4 e 8,
  lobos 0, 0, 1, 2 e worgs 0, 2, 3, 5. Ressalva: o N = 8 rodou como indivíduos
  (`rodarBatalhaBando`), e não como Horda.
  - **Medir** o bando com N = 1, 2, 4, 8, 16 e 32 para lobos, worgs e uma criatura de desafio 2,
    usando a Regra de Horda (`src/content/chapters/combate.md:409`, o esquadrão com Magnitude) a
    partir de 8 (2 por personagem).
  - **Informar** o desafio por N e se a curva casa com "+1/2 por dobra".
  - **Suspeita a registrar:** a Guarda sob pressão (`combate.md:405`) pode pesar demais com 2 a 4
    atacantes (1 worg = 0, 2 worgs = 2).
  - **Ajuste do Adendo 5 (02/10/2026, item 9):** a medição de bando (N = 1 a 32, com Horda a
    partir de 8) passa a informar **quantos indivíduos são precisos para desafio 0, 1 e 2**, para
    lobos, worgs, gatos, cães e ratos. Esse número vai para a nota das fichas de animal comum. As
    fichas de animal comum do bestiário ficam **sem desafio e com a nota** (aplicar quando a B14
    chegar nas 309). A regra que o capítulo já traz: "Animal comum não tem desafio próprio; a ficha
    traz uma nota de quantos formam um desafio 0 para um grupo de Centelha 0, como referência."
  - **Worg é besta mágica, com desafio próprio; lobo é animal comum, sem desafio próprio**
    (Complemento do autor, 02/10/2026, item 11).
  - **Nota da ficha do lobo** (aplicar quando a B14 chegar nas fichas; agora só registrada),
    verbatim do autor: "Animal comum, sem desafio próprio. 1 ou 2 lobos não chegam a desafio 0 para
    um grupo de Centelha 0; uma matilha de 4 é desafio 1; 8, desafio 2 (medição provisória, Fase
    5b)."
  - **A matilha de worgs** (Complemento, item 14): o autor esperava a matilha de worgs em desafio 1
    ou 2; a bancada mede 3, com salto de 0 (1 worg) para 2 (2 worgs). A medição de bando com Horda
    (N = 1 a 32) deve dizer se o salto vem da Guarda sob pressão com 2 a 4 atacantes. Só medir,
    sem decidir.
    **Decidido em 03/10/2026 (P-05):** o exemplo da recompensa passa a tratar a matilha de 4 worgs
    como **desafio 1** (380 pc em `custo-servicos.md`, `test-recompensa.mjs`). A medição continua
    na fila, e não mexe no exemplo.
- [x] **B19 · [SEM AÇÃO] Dragões (Filhote, Jovem, Adulto) ficam como estão.** Registrado em
  03/10/2026 (rodada de pendências de 03/10/2026, Bloco K, P-08). Decisão do autor: "deixar do jeito que estão, sem mexer".
  Nenhuma alteração de ficha.
- [ ] **B20 · [FAZER] Bestiário novo: refazer as fichas pelas descrições da ficha humana, começando pelos animais.**
  Registrado em 10/10/2026, a partir das decisões do autor D-095 a D-103 (`docs/decisoes-partes/decisoes.md`).
  Etapa atual: só leitura e registro. Nada de conversão de ficha nem de despacho à Executora.
  - **Método (D-095):** cada número sai de uma descrição do sistema, com justificativa e teste de ordem entre
    criaturas. Ordem: regra de construção; fichas de referência aprovadas pelo autor; bancada; comparação com D&D e
    Pathfinder; tabela de conversão; conversão do resto com validador.
  - **Sistema (D-096):** tudo em P/G/R; o Normal fica de lado neste trabalho.
  - **Ataques (D-097):** um ataque por ação (D-068), também para as criaturas.
  - **Piloto (D-098):** todos os animais adultos com Centelha 0, inclusive os pré-históricos. Filhote, atroz e de
    guerra ficam para depois.
  - **Habilidades (D-099) e Bloqueio (D-100):** Briga, Bloqueio e Esquiva sempre; nunca Atirador, Armas ou
    Arremesso. O animal bloqueia como a mão nua (D-088); chifre, galhada e carapaça, como arma.
  - **Campos próprios (D-101):** absorção extra, veneno por id (catálogo de venenos), constrição como Agarrão,
    enxame como uma criatura, marcas de montaria e de carga, comportamento do animal real ou extrapolação marcada.
  - **Imagens (D-102):** as atuais ficam até a troca, uma a uma, começando pelas que vieram dos livros; as novas
    saem do ChatGPT, com guia de estilo e descrição visual por criatura.
  - **Fontes (D-103):** `C:\Users\Neves\ClaudeCode\centelha\fontes-bestiario\` (livros, pesquisa, fatos), fora do
    repositório. Espera o ajuste do portão da pasta mãe (`test-portoes.mjs` seção 7).
  - **Respostas ao inventário (10/10/2026):** o teto 6 é o humano, e cada espécie tem a sua faixa natural (D-104);
    animal gigante continua animal, com Centelha 0, e os 16 entram no piloto (D-105); leituras de Prontidão,
    Atributo mínimo 1, Vontade recalculada, absorção que soma com a couraça, `docs/bestiario/visual/<id>.md` e os
    sete "atroz" que são espécie extinta e entram como pré-históricos (D-106).
  - **Rodada de texto (anotada, sem escrever):** `src/content/chapters/atributos.md` l.74 ganha a frase da D-104
    (o teto 6 é o humano; cada espécie tem a sua faixa natural; a Centelha abre o que passa dela).
  - **Pesquisa, regra de construção e pilotos (10/10/2026):** 30 animais pesquisados (`fontes-bestiario/pesquisa/`),
    tabela comparada, regra de construção e três fichas piloto (lobo, cavalo, urso-pardo), tudo fora do repositório
    em `../tmp/arquiteto/bestiario/`. Respostas do autor (D-107 a D-114): Aparência pela régua humana, a maioria no 6;
    Vontade do animal de 3 a 6; Sobrevivência entra na lista fixa; o valor do Bloqueio sai do quanto o animal bloqueia
    na vida real; criaturas podem ter Habilidades secundárias, inclusive próprias; a jararaca é a quarta piloto, e a
    peçonha botrópica entra no catálogo só com o nome quando a ficha entrar; o urso-pardo está aprovado; o recorde do
    puro-sangue não vale para o cavalo de sela.
  - **Curva e velocidade (10/10/2026):** a análise (`../tmp/arquiteto/bestiario/crescimento-atributos.md`) e a ficha
    da jararaca foram entregues. Resposta do autor (D-115): três camadas, modificador de porte (peso, arremesso e
    velocidade), modificador de anatomia e Habilidades, secundárias e Especialidades para o resto; a Força é
    universal e o porte muda o peso, não o dano. Leituras (D-116): o gorila é Grande; a Força entra no Arranque da
    criatura só até 6; sem secundária de Corrida; a Força dos grandes sai do dano, conferido na bancada.
  - **Próxima etapa:** o autor responde ao rascunho das tabelas de porte e de anatomia e às quatro fichas refeitas
    (`../tmp/arquiteto/bestiario/porte-anatomia.md`, com três questões). Depois, a bancada da Força dos grandes. Os
    outros 26 animais esperam.
  - **Anotado, sem regra (D-115):** o porte afeta o agarrar (o grande agarra o pequeno com mais facilidade).
  - **N22, quando a ficha entrar:** o Grid não multiplica o P por porte nem anatomia; o `pesoDoPorte` do Grid
    (`artes-grid-mesa.ts` l.1362) usa pesos que não batem com as faixas novas; o Grid lê só `locomocao.terra` e
    carrega a criatura com `skills2: {}`.
  - **Absorve:** a B14 (desafio, Centelha e revisão das fichas) e a N20 (classe de ataque dos golems) passam a ser
    feitas dentro desta frente quando ela chegar a essas criaturas.
  - **Leitura de apoio, fora do repositório:** `../tmp/arquiteto/bestiario/diagnostico.md`,
    `animais-centelha-0.md` e `inventario.md` (o esquema proposto e as descrições da ficha humana com linha).
