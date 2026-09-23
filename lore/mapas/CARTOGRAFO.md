# Cartógrafo · documento central do mapa de Uldun

Este é o documento que toda sessão futura sobre o mapa do mundo lê antes de começar, e
atualiza quando uma decisão nova for tomada. Registra só o que foi decidido ou
confirmado pelo usuário; o que é recomendação de IA fica marcado como tal.

## Estado atual

*(Atualizar esta seção antes de encerrar toda sessão de trabalho no mapa — é a
primeira coisa que `/cartografo` mostra.)*

- **EMPREITADA AUTÔNOMA (2026-09-23, noite, depois da rodada abaixo). O registro
  completo, etapa a etapa, é `RELATORIO-FINAL.md`: comece por ele.** Tudo o que for
  decisão ali é recomendação do Cartógrafo.
  - **A1-bis (feita)**: relevo manda sobre cobertura (`Estilo.relevo_manda`, no estilo
    padrão): onde há montanha ou alta montanha, a cobertura não põe símbolo, e a cor
    fica. Geleira com raio 1,6 (era 0,80). As coníferas saíram dos picos do norte de
    Mére e o White Wall deixou de ser papel de parede.
  - **A3 (feita): cache de identidade de ilha gerado** (`render/cache-ilhas/`, 4,7 s,
    pico de 271 MB, 435 componentes) e ligado à ferramenta: "identificar ilha" e
    registrar massa nova com a regra dos 100 km. Achado em "Achados técnicos".
- **RODADA DA NOITE DE 2026-09-23, AUTÔNOMA (o usuário fora de casa, sem testar).**
  Pedido: montanha x nevada aprovada; piso x densidade; áreas de exemplo irregulares;
  renderizar e avaliar; etapa 10 sem cache, edição de vértice, pincel; lista do que
  espera o teste dele. Tudo o que for decisão aqui é **recomendação do Cartógrafo**.
  Commits por etapa, caminhos explícitos, sem push.
  - **Montanha x nevada: decidido pelo usuário** como recomendado (fica como está,
    sem fundo por relevo; nevada maior só se ainda se confundirem com área de verdade).
  - **Etapa A · piso x densidade (feita)**. Achado primeiro: o piso **não** reduz a
    contagem hoje. O raio do Poisson sai do tamanho pedido, então o piso só aumenta
    os mesmos símbolos, que passam a se sobrepor mais do que a densidade pedia. O
    renderizador agora mede e avisa (`renderizar(..., avisos=lista)`,
    `renderizador.Aviso`): **"piso"** quando, mantida a folga pedida, caberiam 20% ou
    mais a menos (`LIMIAR_PERDA_PELO_PISO`); **"poucos"** quando a área inteira comporta
    menos de 10 símbolos (`MINIMO_SIMBOLOS_NA_AREA`), inclusive o caso de ZERO. O
    script imprime e grava `render/avisos-<região>-<estilo>[-rapido].json`, e imprime
    antes quanto da faixa de tamanho de cada tipo o piso come: **palmeira 70%, conífera
    49%, duna 36%, folhosa 21%**, rochedo 6%, tropical 2%.
  - **Achado da etapa A**: a borda irregular da mancha de símbolos (90 km) **apaga
    inteira** uma área de até uns 110 km de lado, conforme a semente (medido: um
    quadrado de 0,8° com semente 8 fica com zero pixels). A cor aparece e os símbolos
    não, em silêncio. Agora isso sai como aviso "nenhum símbolo".
  - **Etapa B · áreas de exemplo irregulares (feita)**. `scripts/pintar_exemplos.py`
    gera 22 áreas de 20 a 102 vértices (forma base + lóbulos e baías por soma de
    senoides + tremido de mão) e grava pela API: apagou os 7 exemplos pentágono e criou
    as 22, todas com id `exemplo-*` e o campo novo **`"exemplo": true`** (a API de área
    ganhou o campo, `StrictBool`; o servidor foi reiniciado para ele valer, e o script
    confere no disco que a marca chegou). Controle negativo por HTTP: `"exemplo": "yes"`
    devolve 422 e o arquivo fica igual byte a byte. Prévia das formas:
    `render/analise/exemplos-irregulares.png`. **O dado continua sem commit**, como os
    exemplos de antes. **A pilha de desfazer tem agora 7 apagamentos e 22 criações**:
    Ctrl+Z em excesso na tela volta para os exemplos antigos.
  - **Etapa C · render e avaliação (feita)**. `renderizar_regiao.py` ganhou **Syl**
    (`-24,5 0,5 10,5 27`). Prévias em `render/recorte-<região>-cor-densidade-rapido.png`
    para mere, syl, calin, the-neck e white-wall; as de pentágono, para comparar, ficaram
    em `render/analise/pentagonos/`. Avaliação, sem maquiar:
    - **A franja resolve.** Com contorno irregular, a borda da cor e a rala dos símbolos
      somem como reta: deserto de Mére, florestas de Syl e Calin e a tropical da costa
      leste leem como manchas pintadas à mão. O que estragava era o pentágono, e a
      decisão 5 (sem mais ruído) fica de pé.
    - **O mais feio: relevo e cobertura no mesmo lugar.** No norte de Mére, a floresta
      boreal passa por cima da cordilheira, e as coníferas cobrem os picos nevados. O
      renderizador não tem regra para isso, e toda a terra pintada de verdade vai ter
      as duas camadas. **Proposta**: relevo manda. Onde há montanha ou alta montanha,
      a cobertura só entra como franja rala (ou nada), e a cor dela continua embaixo.
    - **Geleira vira papel de parede** no White Wall: a mesma peça repetida numa grade
      densa. **Proposta**: raio da geleira de 0,80 para uns 1,6, e mais rala na beira.
      Gelo em atlas é quase só cor, com pouca marca.
    - **Colina some** na prévia: são pontinhos claros e soltos. Pode ser o modo rápido
      (5 km/px), e só a alta resolução diz.
    - **Tundra no Neck**: 8 símbolos numa ilha inteira. É rala de propósito (100 px,
      raio 1,0), mas o aviso "poucos" dispara, com razão: a ilha lê como cor só.
    - **Densidade e tamanho das florestas**: bons. Tropical e selva leem densas, e a
      temperada de Calin é a melhor das imagens. A palmeira é a única com o piso agindo
      de verdade: 21% a 26% "a menos" em toda floresta tropical.
    - **Erro meu no exemplo**: a colina de Syl ficou metade no mar, numa ponta de
      costa. Tem 18 colinas (contado), e mesmo assim quase não se vê: é o mesmo
      problema da colina clara, não falta de símbolo. Não corrigi, é exemplo.
    - **Proposta para o piso x densidade** (item 2): ver "Decisões em aberto".
  - **Etapa D · etapa 10 sem o cache de ilha (feita)**: painel REGIÕES com a árvore
    de regiões, criar/editar/apagar, rótulo arrastável no mapa e a região de cada uma
    das 17 massas escolhida por lista. Clique-na-ilha e regra dos 100 km ficam para
    quando o cache for liberado. Detalhe em `ESPEC-ferramenta.md`, "Etapa 10 sem o
    cache". 19 testes; no navegador só leitura (carrega, lista, rótulos). **O
    navegador guarda o `app.js` antigo: abrir com Ctrl+F5.**
  - **Etapa E · edição de vértice de área e de rio (feita)**: selecionar, `V` (ou o
    botão "vértices"), arrastar, `Enter` salva e `Esc` descarta. A área recorta as
    vizinhas pela mesma regra da criação; o rio passa pela validação inteira e a tela
    lista afluentes e braços de delta a conferir. Detalhe em `ESPEC-ferramenta.md`.
    **A pilha de desfazer ficou com um "refazer" armado** (a minha gravação de teste,
    desfeita): a primeira ação nova do usuário o descarta.
  - **Etapa F · pincel (feito)**: `P`, pintar/apagar, raio em km. Pintar funde com a
    área do mesmo valor que o traço toca (guarda a semente dela), recorta as de outro
    valor, cede às travadas; apagar tira de toda área livre da camada. Detalhe e as
    cinco decisões em `ESPEC-ferramenta.md`, "Pincel". **297 testes verdes.**
  - **O QUE ESTÁ ACUMULADO ESPERANDO O TESTE DO USUÁRIO** (pedido desta rodada; várias
    etapas se juntaram). Nada disto foi exercitado por clique de mouse de verdade. O
    que eu consegui exercitar dispara eventos de dentro da página, e isso está dito
    item a item nos ESPEC. **Abrir com Ctrl+F5**, porque o navegador guarda os `.js`
    antigos.
    - **Da tela, ferramentas antigas** (pendentes desde as etapas 8 e 9; o usuário não
      relatou esse teste):
      1. o caminho feliz do Rio por clique;
      2. o caminho feliz da Estrada por clique: halo rosa, linha tracejada com os km,
         aviso de atração, clique em cima do marcador chegando ao desenho;
      3. um desenho, uma gravação, entre Rio e Estrada;
      4. `T` com cada tipo de seleção;
      5. a seção ESTRADAS com o "passa por" e o ⚠;
      6. desfazer e refazer de via, e o cadeado;
      7. a tecla `C` escondendo rios e vias.
    - **Da tela, desta rodada**:
      8. **Regiões**: criar uma, editar nome, tipo e pai, arrastar o nome no mapa,
         "pôr rótulo", apagar (e a recusa ao apagar `mere`), trocar a região de uma
         massa no seletor, "ver", e desfazer cada uma dessas;
      9. **Vértices** (`V`): arrastar, criar e apagar vértice de uma área e ver a
         vizinha da mesma camada ser recortada; `Esc` descartando; rio (não há
         nenhum salvo, então ainda nunca foi aberto em edição);
      10. **Pincel** (`P`): o tamanho do círculo, a fluidez do traço, espaço segurado
          no meio, pintar colando numa área do mesmo valor, apagar, e o raio.
    - **Das imagens** (`render/recorte-*-cor-densidade-rapido.png`, comparar com
      `render/analise/pentagonos/`):
      11. se a franja resolveu com contorno irregular, como eu avaliei;
      12. relevo x cobertura no norte de Mére (coníferas por cima dos picos);
      13. a geleira como papel de parede;
      14. a colina, que quase some na prévia;
      15. montanha x nevada com área de verdade (a decisão do usuário ficou para
          quando houver área pintada).
    - **Decisões minhas esperando o sim ou o não do usuário**:
      16. piso x densidade: manter a contagem, consertar a palmeira na folha, bosque
          como símbolo futuro, tundra fora do "poucos" ("Decisões em aberto");
      17. relevo manda sobre cobertura, com a cobertura só em franja rala sob a
          montanha (proposta, não implementada);
      18. raio da geleira de 0,80 para ~1,6 (proposta, não implementada);
      19. etapa 10: sem cadeado para regiões, apagar em uso recusado, rótulo novo no
          centro da tela;
      20. pincel: fundir com a área do mesmo valor tocada (e as outras quatro decisões
          no ESPEC);
      21. as 22 áreas `exemplo-*` e os 5 lugares de exemplo continuam fora do git,
          para o usuário apagar quando pintar à mão.
    - **Estado da pilha de desfazer**: 7 apagamentos e 22 criações de exemplo, e um
      "refazer" armado (a pincelada de teste, desfeita). A primeira ação nova descarta
      o refazer. Ctrl+Z em excesso volta aos exemplos pentágono.
  - **Próximo passo**: o usuário testar a lista acima e responder as decisões 16 a 20.
    Sem resposta, não começar etapa nova de ferramenta. No renderizador, a proposta 17
    (relevo manda) é a que mais muda a imagem, e é a primeira a fazer se ele aprovar.
  - **Commits desta rodada, sem push**: `37c7571` piso x densidade, `4dd2d20` área de
    exemplo pela API, `e172ce4` Syl e avaliação, `6b1d9c3` regiões, `4336c16`
    edição de vértice, `ac02fc3` pincel, e o deste registro.
- **Rodada do fim da tarde de 2026-09-23 (CONCLUÍDA e COMMITADA, sem push).** Era a
  que deixava a próxima para o usuário pintar; ele pediu a rodada autônoma acima no
  lugar.
  - **Correção 1 (tamanho mínimo)**: a tabela de contorno virou
    `dados/tamanho-minimo-silhueta.json` (campo `tamanho_minimo_silhueta`), com a
    limitação registrada em "Achados técnicos"; entrou a medida de detalhe interno,
    `dados/tamanho-minimo-detalhe.json` (campo `tamanho_minimo_detalhe`). Piso do
    renderizador = o maior dos dois: barra de escala 80, monstro marinho 66, cartela 58,
    rosa 54, duna e palmeira 46, montanha e nevada 44, pântano 40, conífera e geleira
    38, vegetação seca 36, rochedo e tundra 32, folhosa e colina 30, cidade, fortaleza,
    marco, selva e vila 28, árvore tropical 26, porto e ruína 24.
  - **Correção 2 (montanha x nevada)**: registrada em "Decisões em aberto", com a
    medida do tom e a recomendação (confiar no tom; nevada maior como segunda opção;
    não pintar fundo por relevo).
  - **239 testes verdes.** Servidor no ar em `http://127.0.0.1:8420/`.
- **Rodada da tarde de 2026-09-23 (commitada).** O
  usuário respondeu as quatro decisões abertas da noite e mandou commitar a rodada da
  manhã junto com esta.
  - **Decisão 4 (modo de recorte)**: tundra passou a branco opaco (o branco dela é
    neve). Conferido sobre a cor de fundo (`render/analise/modos-sobre-a-cor.png`):
    rochedo, duna e pântano ficam em só traço (o branco deles é face iluminada ou cai
    nas folhas; opaco, lê como neve).
  - **Decisão 5 (borda da mancha)**: fica a franja rala, SEM mais ruído. Reavaliar
    depois que o usuário pintar áreas de verdade: o que estraga a borda hoje é o
    polígono de 5 lados do exemplo.
  - **Decisão 7 (tamanho mínimo)**: MEDIDO, não mais a olho (corrigida no fim da
    tarde: esta era só a silhueta, ver acima).
    `cartografia/legibilidade.py` + `scripts/medir_legibilidade.py` gravam
    `dados/tamanho-minimo-legivel.json`, e o renderizador usa como piso. Critério:
    silhueta binarizada; dois tipos se confundem num tamanho quando a maior IoU entre
    eles passa da IoU de um símbolo contra ele mesmo meio pixel ao lado (o erro de
    arredondamento da âncora). Pisos: montanha e montanha nevada 34 px (confundem uma
    com a outra), rochedo e selva 26, pântano/fortaleza/porto/ruína 24, cidade/duna/vila
    22, colina/geleira/vegetação seca 20, conífera/tundra 18, folhosa 14, o resto 8 a
    10. Bem abaixo dos 35 a 100 do olho: a medida olha só o contorno.
  - **Decisão 8 (costa)**: âncora e as duas pontas da base em terra, corpo pode ir
    sobre a água. Já era a regra; ganhou teste.
  - **Como o usuário pinta e renderiza** (a partir daqui quem melhora o mapa é ele):
    na ferramenta, escolher camada e valor na barra de cima, `A`, clicar o contorno e
    duplo clique; depois `cd lore/mapas/ferramentas && .venv\Scripts\python.exe
    scripts\renderizar_regiao.py mere --rapido` (4 s) ou sem `--rapido` (17 s).
  - **235 testes verdes.**
  - **Próximo passo:** o usuário pintar áreas de verdade e apagar os exemplos
    (`exemplo-*`); reavaliar a borda da mancha (decisão 5) e a paleta em cima delas.
    No código: edição de vértice (destravada pelo commit da etapa 9).
- **Rodada da manhã de 2026-09-23 (commitada junto com a da tarde).**
  - **Commitado nesta rodada, com ok do usuário**: `174614c`, a **etapa 9 (Estrada)**,
    com os dois ESPEC. Destrava a edição de vértice.
  - **Rios destravados**: `dados/camadas_travadas.json` voltou ao do commit (todas as
    camadas destravadas). O log arquivado tem a operação que travou: `travar_camada` de
    rios às 02:20, pela API.
  - **Feito na manhã** (commitado à tarde):
    1. **Cor de fundo por cobertura** (`cartografia/renderizador.py`,
       `CORES_COBERTURA`): floresta temperada (206,213,168), boreal (188,201,166),
       tropical (195,211,155), selva (170,190,138), deserto (243,229,172), pântano
       (196,203,172), tundra (210,212,194), geleira (236,243,246); campo e relevo ficam
       no papel (233,221,189); lago (150,184,204). Borda da cor = a da etapa 11 (12 km),
       borrão de 3 km. O recheio dos símbolos "só traço" passou a ser a cor do chão
       debaixo da âncora, e a mancha de símbolos é cortada pela mancha de cor.
    2. **Modo rápido** (`scripts/renderizar_regiao.py --rapido`, 5 km/px): Mére em
       **4,3 s** de parede. A alta resolução caiu de **202 s para 17 s**: o ruído fazia
       o hash por pixel e na janela inteira para cada área (90% do tempo). A versão nova
       dá os **mesmos bytes** (conferido na imagem real de Mére e por teste contra a
       versão antiga copiada). Mexi em `cartografia/raster.py` (etapa 11, `8300d3d`) por
       isso.
    3. **Espelhamento medido**: `recorte.assimetria_de_luz` (tinta da metade direita
       sobre a esquerda). Folhosa 1,53 e conífera 1,41, tão sombreadas quanto a montanha
       (1,60): pararam de espelhar, junto com selva, tundra, vegetação seca e as
       construções. Espelham só palmeira, árvore tropical, pântano e monstro marinho
       (todos abaixo de 1,15). `dados/simbolos.json` regerado (só o campo `espelhavel`
       mudou em 36 símbolos). Mexi em `cartografia/recorte.py` (`60fa358`).
    4. **Densidade nova** (`TIPOS`, valores no comentário do código): montanha 0,65× na
       beira a 1,35× a 120 km para dentro, ±15%; selva com raio 0,85 (era 0,55) e
       mistura 60% selva, 25% árvore tropical, 15% palmeira; árvores ±25% e franja rala;
       deserto ±35% e franja rala até 150 km. Mére: 1007 símbolos para 608.
    5. **Estilos para comparar**: `noite2` (reproduz a imagem da noite byte a byte, com
       o manifesto antigo), `cor`, `cor-densidade` (padrão).
    6. `FOLHAS-A-REGENERAR.md`: a lista pedida.
  - **Imagens**: `render/comparacao-mere.png` (noite 2, cor, cor + densidade, lado a
    lado); `render/recorte-mere-cor-metade.png` e `recorte-mere-cor-densidade-metade.png`
    (e as cheias sem `-metade`); prévias `render/recorte-*-cor-densidade-rapido.png` das 4
    regiões. A imagem da noite 2 (`recorte-mere.png`) ficou intocada.
  - **228 testes verdes.** Arquivos da rodada: `cartografia/raster.py`,
    `renderizador.py`, `recorte.py`, `scripts/renderizar_regiao.py`,
    `tests/test_raster.py`, `test_renderizador.py`, `test_simbolos.py`,
    `dados/simbolos.json`, `FOLHAS-A-REGENERAR.md`, este documento.
- **Atualização anterior: NOITE 2 (2026-09-23, trabalho autônomo, CONCLUÍDA).** O
  registro completo, etapa a etapa, com o roteiro de teste da manhã, as imagens, as
  decisões pendentes e o que só o teste do usuário cobre, está em
  `RELATORIO-NOITE-2.md`. **Leia esse primeiro.**
  - **Commits da noite, sem push**: `ed53eb2` as 9 folhas de símbolos em `icons/`,
    renomeadas; `60fa358` o recorte da biblioteca (90 símbolos, `dados/simbolos.json`,
    PNGs em `simbolos/` fora do git); `6081ba6` as tiras de redução e o mínimo legível
    por tipo; `8300d3d` a **etapa 11** (rasterização com ruído de borda determinístico e
    ancorado no mundo); `c09f4b5` o **primeiro renderizador** com os símbolos de verdade;
    `b841341` a **etapa 12** no renderizador (lago vira água); `eb65ff4` o relatório.
  - **Código novo** em `ferramentas/cartografia/` (recorte, redução, raster,
    renderizador) e `ferramentas/scripts/` (`recortar_simbolos.py`,
    `tiras_de_reducao.py`, `demo_borda.py`, `renderizar_regiao.py`). Nenhum deles é
    importado pelo servidor. **213 testes, todos verdes.**
  - **Imagens**: `render/recorte-mere-metade.png` (a principal), os outros
    `render/recorte-*.png`, `render/analise/folha-de-contato.png`,
    `render/analise/reducao/`, `render/analise/borda-ruido.png`.
  - **Dados de exemplo, sem commit, para apagar**: 5 localidades `exemplo-*` e 7
    áreas `exemplo-*` (montanha, deserto, selva e lago em Mére; floresta temperada em
    Calin; coníferas em The Neck; geleira no White Wall). A pilha de desfazer foi limpa
    no começo da noite (o log antigo foi guardado em
    `dados/.operacoes/arquivado-2026-09-23-noite2/`), então ela tem só as 7 áreas.
  - **Não feitas**: etapa 10 (depende do cache de identidade de ilha, proibido esta
    noite) e edição de vértice (esbarra em `areas.js`/`rios.js` com a etapa 9 sem
    commit).
  - *(resolvido na rodada da manhã: rios destravados e etapa 9 commitada)*
- **Próximo passo:** o usuário olhar as imagens e seguir o roteiro de teste do
  `RELATORIO-NOITE-2.md` (Rio e Estrada na tela), responder as 9 decisões listadas lá,
  e dar o ok para o commit da etapa 9.
- **Última atualização antes da noite 2:** 2026-09-23 (décima terceira rodada). **Etapa 9, Ferramenta
  de Estrada: FEITA, sem commit, esperando o teste do usuário junto com o Rio.**
  - **Etapa 8 (Rio) commitada** na décima segunda rodada (22/09 às 21:12): `f9a8213`
    o servidor, `53fca74` a tela, `3a6117c` o registro. Os blocos abaixo que dizem
    "Rio sem commit" são anteriores a isso. O servidor da etapa 9 foi escrito logo
    depois, e a sessão caiu com a queda de energia antes de atualizar esta seção.
  - **As três recomendações do servidor foram decididas pelo Direcionamento**: via só
    em terra aprovada como **limitação conhecida** (ponte, vau e balsa numa etapa
    futura), `lugares` derivado da atração, e atração antes da checagem de terra (por
    causa do antialiasing da costa). Registro nos dois ESPEC.
  - **Pontas soltas acertadas**: o haversine tem uma fonte de cada lado,
    `backend/geo.py` e `static/js/geo.js` (saiu de dentro de `regua.js`); a cópia de
    `tests/test_haversine.py` foi apagada, e o teste roda o `geo.js` de verdade no
    node contra o servidor em 8 pares, com controle negativo.
  - **Tela da Estrada**: botão "+ estrada", **tecla `E`**, seletor estrada/trilha,
    pane própria (z 455), seção ESTRADAS com "passa por: a → b", cadeado de camada,
    `T`, desfazer e refazer. A atração aparece de dois jeitos: halo rosa permanente no
    vértice que grudou (pane z 610, acima dos marcadores) e, logo depois de criar, linha
    tracejada do clique até o lugar com a distância. Detalhe em `ESPEC-ferramenta.md`,
    "Etapa 9".
  - **Mexi em arquivo commitado da etapa 8**: `rios.js` (o `pm:create` agora exige a
    caneta do Rio ativa, senão toda via ia também para `/api/rios`), `areas.js` e
    `lugares.js` (seleção exclusiva entre as quatro ferramentas; antes, selecionar
    área ou lugar deixava um rio selecionado e o `T` travava o rio), e o CSS (a tecla
    `C` agora esconde também rios e vias, e o botão do Rio ganhou o destaque de ativo).
  - **5 lugares de EXEMPLO criados pela API** (com `"exemplo": true` e uma `_nota`
    para apagar depois), um em cada região que não é mãe de outra, nos pontos
    principais de `massas.geojson`: `exemplo-mere` (cidade, 17,34 L 17,78 N),
    `exemplo-syl` (vila, 6,16 O 14,48 N), `exemplo-calin` (fortaleza, 6,66 L 33,96 N),
    `exemplo-the-neck` (vila, 25,44 O 52,71 N), `exemplo-white-wall` (marco,
    22,74 O 65,34 N). **Waning não tem lugar próprio**: é o arquipélago-mãe de Mére,
    Syl e Calin, e fica coberto por eles. Controle negativo na mesma sessão: um ponto
    de oceano aberto mandado ao mesmo endpoint voltou 422. **Eles estão no log de
    desfazer**: são as 5 últimas operações desfazíveis, então Ctrl+Z demais no teste
    apaga os exemplos. **E o refazer está armado com o meu teste pela API** (cursor 27
    de 32): apertar refazer ANTES de qualquer outra ação traz de volta as vias de teste
    (`estrada-9001`, `trilha-9002`). A primeira gravação nova do usuário limpa essa
    pilha.
  - **Conferido pela API no servidor real**: via a 2,86 km de `exemplo-mere` gravou o
    vértice exatamente na cidade, `lugares: ["exemplo-mere"]` e relatório com a
    distância; trilha longe de tudo gravou `lugares: []` e relatório vazio; via na água
    recusada com 422; travada, apagar recusado com 409; tudo desfeito depois (0 vias,
    5 lugares).
  - **NÃO conferido na tela**: a extensão do navegador não estava conectada nesta
    rodada, então nada da tela foi exercitado por mim. Lista do que só o teste do
    usuário cobre, no "Próximo passo".
- **Rodada anterior (décima primeira), para referência:** 2026-09-22. **Relevo automático
  commitado**, o alinhamento das imagens do ChatGPT **regravado**, a conferência do
  git virou **registro em arquivo**, a medição de custo virou **bancada guardada**, e
  a **Ferramenta de Rio (etapa 8)** feita, sem commit.
  - **Nota de data**: os blocos anteriores deste documento datam esta sequência de
    rodadas como 2026-09-23, mas o relógio da máquina e os commits dizem
    **2026-09-22**. Passei a usar a data da máquina no que é gravado por script
    (registro do git, medições, alinhamento), que é o que se pode reproduzir depois,
    e não reescrevi os blocos antigos.
  - **Commits desta rodada, 7, sem push**: `4005854` o servidor do relevo automático
    (com `backend/automatico.py`, a máquina comum das duas camadas automáticas);
    `0435a04` o relevo automático na tela, no interruptor; `0921eeb` o alinhamento
    regravado mais dois defeitos do alinhador; `d656fc5` a conferência do git que
    registra e nunca conserta; `a7acfe6` o `/cartografo` usando essa conferência;
    `3b80a22` a bancada do custo da cobertura automática; `e16588d` o registro de
    tudo isso no ESPEC.
  - **chatgpt-2 e as outras três: alinhamento regravado** (`--gravar`). As quatro
    ficaram com `bounds == bounds_automatico`, e o botão "automático" leva à posição
    certa: conferido ponta a ponta na chatgpt-2, que era a errada (reset leva aos
    limites do mundo, automático devolve exatamente o alinhamento gravado, desfazer
    devolve o estado inicial). **Método e data ficam gravados em cada camada**, no
    campo `alinhamento_automatico`: cor terra/mar, sem rotação, IoU contra a costa
    reduzida a 128×128; IoU de 70,4% (1), 70,8% (2), 55,3% (3) e 63,7% (4).
  - **Dois defeitos do alinhador, achados por rodá-lo pela SEGUNDA vez**: ele
    reescrevia `bounds_anterior_a_20260922` a cada gravação (o nome da chave tem uma
    data dentro, então ela passava a guardar valor de outro dia · o valor histórico
    original foi restaurado do git antes de regravar), e a data do alinhamento era um
    literal no código, então toda gravação futura mentiria a data.
  - **Conferência do git (item 2)**: `scripts/conferir_git.py` acrescenta uma linha em
    `lore/mapas/registro-git.jsonl` a cada conferência, com data e hora, valor
    encontrado, valor esperado, se estava certo e **o arquivo de configuração de onde
    o valor veio**, que é a pista de quem mexeu. Ele **nunca conserta**: sai com
    código 1 e o passo 1 do `/cartografo` passa a avisar em uma linha, pedir
    autorização e seguir trabalhando no que não depende de commit. Nesta rodada o
    valor estava certo (`scripts/hooks`), e as duas primeiras linhas do registro já
    estão lá.
  - **Bancada do custo (item 3)**: `scripts/medir_automatico.py` guarda cada medição
    em `dados/medicoes_desempenho.json`, acrescentando em vez de substituir. A de hoje
    está gravada: 50 áreas 12,9 ms, 200 áreas 46,0 ms, 500 áreas 97,2 ms, 1.000 áreas
    175,7 ms, e o teto de 500 polígonos de 400 vértices em 653,0 ms. A decisão de
    seguir fica mantida, agora com o número guardado para comparar.
  - **Ferramenta de Rio, etapa 8 (etapa desta rodada, NÃO commitada)**: desenho com o
    Geoman em modo `Line` (tecla `I`, porque `R` já é a régua), validação **por
    segmento** contra a costa, exceção do último trecho quando termina no mar,
    tolerância de foz de 2 km, destino conferido (lago e rio têm que existir), trava,
    desfazer e refazer. Pane em z 460, acima da camada do mar, senão a foz sumiria
    debaixo da água. **15 testes novos, 143 no total, todos verdes.**
    - **Conferido na tela**: desenhar por cliques e o servidor recusar com a faixa
      vermelha, nos dois casos que interessam · nascente na água, e "o trecho 2 passa
      por cima da água" num traçado cujos vértices estavam todos em terra, que é
      exatamente o caso que a validação por vértice deixaria passar. O caminho feliz
      (rio válido desenhado, travado, recusado ao apagar com 409, e desfeito até zero)
      foi exercitado **pela API dentro da própria página**, porque a leitura de
      lat/lon sob o cursor parou de responder aos movimentos sintéticos no meio do
      teste e eu não tinha como mirar um ponto de terra por coordenada.
  - **Dois defeitos achados na revisão, antes de entregar, e já corrigidos**:
    (1) `pm:create` é evento do MAPA, não da ferramenta, e o handler da Área não
    filtrava a forma · desenhar um rio mandava a linha também para `/api/areas`, que
    recusava com 422 e pintava a faixa vermelha por cima do rio recém-salvo. Os dois
    handlers agora filtram por `evento.shape`. (2) A tela amarrava `ramo_de` a
    "termina em rio", o que marcaria todo AFLUENTE como braço de delta e tornaria o
    delta de verdade impossível; a tela agora manda sempre `ramo_de: null`, e braço de
    delta se cria pela API enquanto não houver campo próprio.
  - **O que NÃO consegui conferir na tela**: o caminho feliz por cliques e a correção
    (1) acima. No meio do teste o navegador parou de entregar o clique (o movimento do
    mouse continuou chegando · a leitura de lat/lon sob o cursor respondia certo, o
    que é como sei que é a automação e não a página). As duas ficam por leitura de
    código, e são a primeira coisa que o seu teste exercita.
  - **Pendência registrada e ainda de pé**: o **pincel de tamanho ajustável** para
    pintar e apagar à mão livre.
- **Rodada anterior (décima), para referência:** **Cobertura automática
  commitada, com as faixas corrigidas**, o **teste de arquivo fora do git dividido em
  dois**, o **isolamento dos testes provado**, os **comentários dos dados
  atualizados**, o **custo do desconto medido** e o **relevo automático planície**
  feito, sem commit.
  - **AVISO sobre a configuração do git**: `core.hooksPath` estava de novo com
    CAMINHO ABSOLUTO no começo desta rodada, e o portão de commit recusa assim. É a
    segunda vez: consertei na sétima rodada, e voltou sozinho entre rodadas. Rodei de
    novo o comando que o `CLAUDE.md` da raiz manda
    (`git config core.hooksPath scripts/hooks`) porque esta rodada tinha commit
    pedido, mas **não sei o que reescreve isso**, e enquanto não se souber toda
    sessão do mapa vai continuar tropeçando nele (a conferência do passo 1 do
    `/cartografo` pegou, que é o que ela existe para fazer).
  - **Commits desta rodada, 5, sem push**: `b75c5d0` o servidor da cobertura
    automática, com os testes e o controle de isolamento; `24d703d` a cobertura
    automática na tela; `13007a0` o teste de arquivo fora do git virando dois;
    `2a04bbd` os comentários dos dados; `3b6daa1` o registro no ESPEC com a correção
    das faixas e a medição.
  - **Defeito que o usuário achou, e o que ele rendeu**: um teste da cobertura
    automática chamava `colecao()` sem a fixture de isolamento e lia o
    `dados/areas-pintadas.geojson` REAL, passando só porque ele estava vazio.
    Corrigido, e a suíte inteira varrida: os outros testes sem fixture ou são
    aritmética pura (haversine), ou leem só arquivos de leitura (a máscara da costa e
    os tiles do mar), ou varrem o repositório de propósito. Nasceu daí o
    `tests/test_isolamento.py`, que prova as duas metades: **sem** a fixture os
    módulos apontam para produção (senão não haveria o que isolar), e **com** a
    fixture gravar de verdade deixa o arquivo real byte a byte igual.
  - **Faixas da cobertura automática corrigidas pelo usuário**: deserto e selva saem
    do automático, porque são exceções REGIONAIS e não regra de latitude (na faixa de
    15°N a 25°N está Syl, "a parte mais verdejante do mapa", e o automático a
    pintaria inteira de deserto). A faixa quente virou `campo` e a equatorial
    `floresta-tropical`; são 6 faixas agora, não 7. O critério que fica: **só entra no
    automático o valor que vale para a latitude inteira**.
  - **Custo do desconto, medido**: 50 áreas 12 ms, 200 áreas 44 ms, 500 áreas 99 ms,
    1.000 áreas 170 ms por pedido (polígonos de desenho à mão). Os casos pedidos ficam
    abaixo de 100 ms. **Meio segundo só aparece num caso que desenho à mão não
    alcança** (500 polígonos de 400 vértices, 658 ms), e os três caminhos de conserto
    estão escritos no ESPEC para o dia em que importar traçado existir.
  - **chatgpt-2 NÃO é recorte regional** (investigado a pedido): a imagem tem a mesma
    composição de mundo inteiro da chatgpt-1 (White Wall no alto, o crescente de
    Waning no centro, as mesmas ilhas), só com enquadramento um pouco mais fechado. O
    `bounds_automatico` de 12,7°N a 49,9°N que estava gravado é **resíduo de uma
    rodada antiga do alinhador**: rodando o alinhador hoje, chatgpt-2 alinha no mundo
    inteiro e com a MELHOR interseção das quatro (70,8%, contra 70,4, 55,3 e 63,7).
    Consequência prática: o botão "automático" dessa camada devolve uma posição
    errada. **Não regravei** (seria escrever dado sem pedido); o conserto é
    `.venv/Scripts/python.exe scripts/alinhar_chatgpt_auto.py --gravar`, e o aviso
    ficou escrito no próprio `camadas_referencia.json`.
  - **Relevo automático planície (etapa desta rodada, NÃO commitada)**: fecha a etapa
    7 da lista do ESPEC. Mesma máquina da cobertura (agora compartilhada em
    `backend/automatico.py`), uma faixa só, nunca gravada, descontada do relevo
    pintado. Na tela entra num **interruptor desligado por padrão**, e não numa camada
    sempre visível: planície é um valor único sobre toda a terra sem pintura, então
    sempre visível ele só cobriria as faixas de cobertura com cor chapada. **Decisão
    de IA, registrada no ESPEC para você derrubar se preferir.** 4 testes novos,
    **118 no total, todos verdes**.
  - **Pendência registrada na rodada anterior e ainda de pé**: o **pincel de tamanho
    ajustável** para pintar e apagar à mão livre.
- **Rodada anterior (nona), para referência:** **Recorte pela costa
  commitado** (o usuário testou e aprovou: "pintou só a terra"), **o achado do
  `dist/` virou teste permanente e teste de clone limpo**, e a **cobertura automática
  por latitude** feita e conferida na tela, sem commit.
  - **Commits desta rodada, 3, sem push**: `74b2c01` o recorte pela costa na
    renderização (`app.js`, `estilo.css`, `tests/test_mar.py`); `dd6663f` o teste que
    pega arquivo necessário fora do git, mais a seção "Clone novo" deste documento;
    `28f4d53` a mensagem desse teste separando "escondido pelo `.gitignore`" de
    "ainda não commitado".
  - **Clone limpo, rodado de verdade** (não estimado): clone em pasta temporária,
    `venv` pelo `requirements.txt`, servidor no ar em outra porta, cada peça sondada
    por HTTP. **A ferramenta sobe e a validação de terra funciona** (a máscara da
    costa está no git); faltam só os tiles e as imagens de referência, e a tabela do
    que copiar ou regerar está na seção "Clone novo", abaixo. Clone e venv apagados
    depois.
  - **Cobertura automática por latitude (etapa desta rodada, NÃO commitada)**: sete
    faixas derivadas do guia de clima, calculadas em
    `backend/cobertura_automatica.py` e desenhadas numa pane própria (z 390) abaixo
    da área pintada e abaixo da camada do mar, que já recorta pela costa · então
    terra sem pintura mostra o automático e o mar não mostra nada. **O automático
    nunca é gravado**: não existe uma só chamada de gravação no módulo, e a coleção é
    recalculada a cada pedido. As faixas saem do servidor **já descontadas** do que
    está pintado de cobertura, porque área pintada tem `fillOpacity` 0,35 e
    empilhar por cima daria mistura de cor, não sobrescrita. **Conferido na tela e ao
    vivo**: pintar um polígono de 8 graus² dentro da faixa de deserto abriu um buraco
    de exatamente 8 graus² nela, e o desfazer fechou o buraco e zerou as áreas. 6
    testes novos, **110 no total**.
  - **A suíte fica vermelha enquanto a etapa nova não for commitada, e isso vai se
    repetir**: o teste do item 2 acusa `backend/cobertura_automatica.py` e
    `tests/test_cobertura_automatica.py` como "ainda não commitado", que é
    exatamente o que o pedido descreve ("falha se houver arquivo necessário fora do
    git"). Como quase toda rodada termina com uma etapa nova sem commit, isso não é
    um estado passageiro desta vez, é o fim de rodada padrão. **Decisão em aberto,
    do usuário**: manter a forma estrita, ou estreitar o teste para só o caso
    ESCONDIDO pelo `.gitignore` (que é o defeito invisível; arquivo apenas não
    commitado já aparece no `git status`). Não estreitei por conta própria.
  - **Pendência nova, pedida pelo usuário**: uma versão em **pincel** da pintura de
    área, com tamanho ajustável, para pintar e apagar à mão livre. Registrada para
    uma etapa futura, não construída nesta.
- **Rodada anterior (oitava), para referência:** **B4 commitada**, três
  regras novas registradas, e o **recorte pela costa na renderização** feito e
  conferido na tela (commitado na nona rodada, em `74b2c01`).
  - **Commits desta rodada, 6, sem push** (os quatro primeiros são a B4, em ordem de
    dependência): `d9167a9` o Geoman free em `static/vendor`; `f7677cd` o `dist/` do
    Geoman, que o `.gitignore` da raiz escondia (a linha 3 é `dist/`, posta para o
    build do Astro, e casa com QUALQUER pasta chamada `dist` · os dois arquivos que a
    página carrega ficaram de fora do primeiro commit e entraram com `git add -f`, só
    esses dois caminhos); `7c63e08` o servidor da Área (backend, `main.py`, o dado
    vazio e os 18 testes); `00194ce` a Área na tela; `abc7b67` os documentos;
    `092b3fb` o `/cartografo` conferindo `core.hooksPath`, separado por ser arquivo
    fora do mapa.
  - **Recorte pela costa na renderização** (commitado depois, em `74b2c01`): o
    polígono continua gravado cru, exatamente como desenhado, e quem esconde a parte
    que caiu na água é a pirâmide `render/tiles/mar`, que já existia, posta numa pane
    própria (z 450) acima da área vetorial e abaixo dos marcadores, com
    `pointerEvents: "none"` (sem isso ela engoliria todo clique destinado aos
    polígonos embaixo). **Conferido na tela**: um retângulo desenhado atravessando a
    costa aparece pintado só na parte de terra, com a borda acompanhando a praia; o
    **controle negativo** (desligar a pane e olhar o mesmo lugar) mostra o retângulo
    inteiro, sobre mar e terra, provando que o dado está cru e que é só a imagem que
    esconde. Clique ainda seleciona a área através da pane, e a tecla `C` ("só a
    costa") também apaga a camada do mar.
    - **Controle negativo do lado do arquivo**, em `tests/test_mar.py` (3 testes, 100
      no total): a pirâmide do mar é comparada com a máscara oficial
      `costa_10240.png` em terra conhecida (transparente), em oceano aberto
      conhecido (sólido) e numa faixa de 200 amostras que OBRIGATORIAMENTE cruza a
      costa (senão o teste falha dizendo que não testou nada). A varredura completa
      dos 10240×10240 pixels deu **zero divergência** entre a imagem e a máscara.
    - **Um susto que valeu a lição**: a primeira versão do teste "achou" uma
      divergência que não existia · ela escolhia o pixel com `int()` e o servidor
      escolhe com `round()`, então os dois liam pixels VIZINHOS, um de cada lado da
      praia. Nada estava errado na pirâmide.
  - **Três regras novas, todas decididas pelo usuário** (em "Regras invioláveis"): o
    travessão é proibido no que eu escrevo PARA ELE na conversa e não nos documentos
    e no código do projeto (nenhuma varredura, os documentos seguem como estão);
    histórico do git não se reescreve por cosmética (a linha com `@` fica);
    e toda sessão do mapa começa conferindo `core.hooksPath` (já no passo 1 de
    `.claude/commands/cartografo.md` · nesta rodada estava certo, `scripts/hooks`).
  - **Atração de 5 km: decidida como NOSSA**, no servidor, ao salvar, e não do
    Geoman (a atração do plugin mede distância em pixels de tela, que muda de
    significado a cada zoom, e não serve para uma regra escrita em quilômetros).
    Registrada no ESPEC; **implementar quando as estradas chegarem**, porque hoje não
    existe traçado nenhum para atrair.
  - **Escalar e dividir não existem no Geoman free**, e o ESPEC agora registra o que
    faríamos: `shapely.affinity.scale` e `shapely.ops.split`, do nosso lado, como já é
    o recorte. Nenhum dos dois justifica pagar o Pro: o que o Pro venderia é a
    interação, e a parte difícil continuaria sendo nossa.
- **Rodada anterior (sétima), para referência:** **Travar objeto**,
  **tema claro/escuro** e **o acúmulo de três rodadas finalmente commitado**.
  - **Travar objeto (item 1)**: esquema definido em `ESPEC-dados.md`
    ("Travamento") **para todos os objetos editáveis de uma vez** · lugar, rio,
    estrada e área · não só para o que existe hoje. Duas travas independentes:
    `travado` no objeto (padrão `false`) e o **cadeado por camada**
    (`dados/camadas_travadas.json`, arquivo novo), sendo a trava efetiva a OU das
    duas. **O cadeado de camada nunca escreve no objeto** · é o que faz
    "destravar a camada devolve cada um ao que era" ser verdade sem restaurar
    nada. Recusa por trava é **409** e não 422, para a interface dar aviso
    discreto em vez da faixa vermelha de erro. Tecla `T`, cadeadinho no mapa e na
    lista, as duas travas passam pelo desfazer. 15 testes novos.
  - **Tema (item 2)**: botão `☾`/`☀` na barra de cima, tecla `D`, escolha
    lembrada em `localStorage`, lida num script inline no `<head>` para a página
    não piscar. Nenhum dos temas toca em `#mapa`.
  - **Commits (item 3): 3 commits, e não os 9 itens listados.** `index.html`,
    `app.js` e `estilo.css` carregam as quatro rodadas juntos, e
    `git commit -- caminho` leva o arquivo inteiro: separar por pedaço exigiria
    mexer no índice compartilhado com as outras frentes (proibido pelo
    `CLAUDE.md` da raiz). A lista do pedido foi lida como CONTEÚDO, e a ordem
    é a da dependência, que o próprio pedido fixou: `172c6ca` backend e testes,
    `4035ce5` interface, `3c7e160` documentos. Sem push.
    - **Defeito nas três mensagens**: elas começam com uma linha solta com um
      `@`, de uma citação de shell que saiu errada. O conteúdo está inteiro e
      legível; consertar exigiria reescrever os três commits, e o rebase é
      recusado enquanto houver árvore suja de outra frente, que é o caso.
  - **B4, Ferramenta de Área (item 4): FEITA, não commitada.** Geoman free
    2.20.0 (MIT) baixado pronto para `static/vendor/`, sem npm e sem CDN; o
    plugin entra só como a caneta, e recorte (shapely), gravação, desfazer e
    trava são nossos. Conferida no navegador de verdade: desenho por clique,
    recorte sem vão nem sobreposição, `MultiPolygon` quando o corte parte a
    área, área travada intacta com a nova cedendo, e tudo desfeito depois (o
    dado real voltou a zero). 18 testes novos, **97 no total**.
  - **O que o Geoman free tem e o que é pago (item 5)**: conferido lendo a API
    num mapa de verdade, não de memória. **Tem**: desenho (7 formas), editar
    vértice, arrastar, apagar, **cortar**, **rotacionar** e **atração**
    (`snappable: true`, `snapDistance: 20` · mas a atração só gruda em camada
    registrada no `pm`, e as áreas daqui não são, então hoje ela não tem em que
    grudar). **Não tem**: **escalar** (só o
    rótulo da tradução vem no free, sem implementação) e **dividir** (não
    existe). Tabela e o método da conferência em `ESPEC-ferramenta.md`.
  - **Mudei uma configuração do git fora do mapa, e é preciso saber**: o portão
    recusou o primeiro commit desta rodada porque `core.hooksPath` estava com
    caminho ABSOLUTO (`C:\Users\...\scripts\hooks`) e o `test-portoes.mjs`
    cobra o relativo. Rodei o comando que a própria mensagem do portão manda
    (`git config core.hooksPath scripts/hooks`), que é o do `CLAUDE.md` da raiz
    e o certo para worktree. **Isso é `.git/config`, não o hook**, e a
    autorização desta frente era só o hook · fica registrado. Não sei quem pôs
    o absoluto nem quando (na quarta rodada o mesmo portão passou com ele).
  - **Correção depois do primeiro teste no navegador**: a tecla `T` ficava
    presa na última área clicada (a seleção de área não se limpava sozinha), e
    nenhum lugar voltava a travar pelo teclado. Seleção de área e de lugar
    agora são mutuamente exclusivas, e clique no fundo do mapa desmarca as
    duas. **Esta correção foi conferida só lendo o código**: a automação do
    navegador parou de responder no meio do teste dela, e o resto da B4 tinha
    sido conferido antes disso.
  - **Tamanho do log de operações (item 6): medido, e não cresce demais.** Uma
    operação custa cerca de 2× a geometria que toca. Polígono de 100 vértices:
    9 KB por recorte. De 2000: 159 KB. Desenho à mão tem dezenas de vértices,
    então o problema só apareceria com traçado importado. Tabela no ESPEC.
- **Rodada anterior (sexta), para referência:** Três itens: regra
  nova contra inferir o que o usuário fez a partir de rastro de uso (e remoção
  da inferência que eu tinha escrito); **a ressalva de "terra ou mar sob o
  cursor" estava ERRADA e foi corrigida E implementada**; e a régua deixou de
  usar `prompt()` pro nome da medição. **Nada commitado** (pedido explícito).
  - **Terra/mar sob o cursor, implementado** (`static/js/terra-ou-mar.js`): o
    usuário apontou que não precisa da máscara de 10240px — o bloco da costa
    que o navegador já baixou JÁ é a resposta (terra tem alfa 255, mar tem 0).
    Canvas oculto, `ImageData` guardado por bloco (teto de 60, descarte do mais
    antigo), leitura no zoom nativo, nenhuma chamada ao servidor por movimento
    do mouse. Dois achados do caminho: **bloco ausente (404) = mar** (o gerador
    não grava tile totalmente transparente) e **o único impedimento real seria
    CORS** (tile de outra origem deixaria o canvas "tainted") — não é o caso
    aqui, mesma origem, mas o código trata. Conferido com controle negativo
    contra os mesmos arquivos de tile: terra conhecida → alfa 255; mar aberto →
    bloco ausente; e mar DENTRO de um bloco que existe → alfa 0 (o controle que
    prova que a regra não é "bloco existe = terra"). **O caminho do canvas no
    navegador em si só um teste no navegador exercita.**
  - **Régua: `prompt()` → `#modal-medicao`**, mesmo padrão do de Lugar (Enter
    salva, Esc cancela, foco no campo, resumo da medição no topo, erro dentro
    do modal). Não sobra nenhum `prompt()` na ferramenta. Guarda nova no
    servidor com controle negativo: nome só de espaço vira `null`
    (`test_medicoes.py`, 2 testes novos — 64 no total, todos verdes).
- **Rodada anterior (quinta):** Modal de Lugar no
  lugar dos `prompt()`/`confirm()`, e as 10 melhorias de interface pedidas
  (atalhos + ajuda, lista lateral, barra inferior, indicador de salvamento,
  seções que abrem/fecham, símbolo por tipo, tecla da costa, teclas de
  opacidade, confirmação só onde não há desfazer, tema escuro). **Nada
  commitado nesta rodada** (pedido explícito). **3 ressalvas registradas** em
  `ESPEC-ferramenta.md` ("Ressalvas registradas") em vez de forçar — item 4 do
  pedido. Dívida de processo dos commits da rodada anterior registrada em
  "Dívida técnica registrada", e a regra nova ("ordem dos commits segue a
  dependência; se a ordem pedida conflitar, avisar ANTES") em "Regras
  invioláveis".
- **O que o usuário testou e aprovou das rodadas anteriores: EM ABERTO.** Os
  relatos vieram em branco ("[escreva o que funcionou e o que não]") em três
  rodadas. **Nada foi aprovado explicitamente**, então nada das rodadas de
  interface (quarta, quinta e sexta) está commitado.
  - **Correção registrada em 2026-09-23 (sexta rodada)**: a versão anterior
    deste bloco concluía, a partir do `dados/.operacoes/log.jsonl`, que o
    usuário "tinha exercitado o reset e o ciclo editar/apagar". Isso era
    inferência sobre rastro de uso: o log mostra que as OPERAÇÕES aconteceram,
    não que ele as tenha feito, testado ou aprovado. A conclusão saiu daqui e
    virou regra em "Regras invioláveis".
  - O que continua sendo FATO sobre o estado dos arquivos (sem conclusão sobre
    quem fez nem sobre aprovação): `dados/lugares.geojson` está vazio;
    `chatgpt-2` está invisível e com os limites do mundo, e o
    `bounds_automatico` dela preserva os limites do alinhamento automático.
- **Rodada anterior (quarta), para referência:** **O portão de
  commit foi aprovado, corrigido e ATIVADO** (`scripts/hooks/pre-commit` já é
  a versão isolada do índice); **5 commits do mapa feitos** (etapa 2 com
  correções, B1, B2, B3, recuperação do ESPEC-dados — sem push); e os **4
  ajustes de UI pedidos foram feitos, mas NÃO commitados** (pedido explícito:
  servidor no ar pra você testar antes). Ver detalhe completo abaixo.
- **Hook de `pre-commit`: corrigido, testado com controle negativo de
  segurança, e ATIVO.** Achado ao testar a versão anterior: `rm -rf` na pasta
  de validação, que contém um JUNCTION pro `node_modules` real, arriscava
  descer no link e apagar o `node_modules` de verdade. Corrigido: a limpeza
  primeiro remove só o link (`[System.IO.Directory]::Delete(caminho, $false)`
  — `Remove-Item` do PowerShell lança exceção nesta máquina, achado testando),
  confere que sumiu, e só então apaga o resto; se a remoção do link falhar, a
  pasta fica intacta (nunca `rm -rf` às cegas). **Contagem de arquivos do
  `node_modules` real, idêntica nos três cenários testados**: validação que
  passa (23.278 antes/depois), que falha (23.278/23.278), e interrompida com
  `kill -9` no meio — o pior caso, trap nunca roda — (23.278/23.278, só uma
  pasta temporária órfã sobrou, sem nenhum dano, limpa à mão). Ativado
  (`scripts/hooks/pre-commit.proposto` → `pre-commit`) e commitado sozinho
  (`1925029`), com uma nota curta no `CLAUDE.md` da raiz explicando a mudança
  para as outras frentes (`76d6afc`) — autorizado pelo usuário mexer nesses
  dois arquivos fora do mapa, só para isto.
- **5 commits do mapa, sem push** (`git show --stat` de cada um mostrado ao
  usuário na resposta desta rodada):
  1. `281186e` — B1 (infraestrutura de gravação e desfazer/refazer).
  2. `57083af` — B2 (Ferramenta de Lugar, esquema de importância restaurado).
  3. `0716791` — B3 (régua e grade de lat/lon).
  4. `939f07d` — etapa 2 com correções (Ocean Deep, Rótulos, alinhamento
     automático, zoom fracionário, persistência de camadas) — **inclui
     `main.py`/`app.js`/`index.html`/`estilo.css` inteiros**, mesmo tendo
     endpoints/wiring de B1/B2/B3 também: são arquivos compartilhados, e
     `git commit -- pathspec` não separa por hunk sem tocar o índice
     compartilhado (regra do CLAUDE.md) — registrado na mensagem do commit.
  5. `30b0164` — recuperação de `ESPEC-dados.md` + `historico/ESPEC-dados-
     revisao2.md` + criação de `dados/medicoes.json`.
  - **Ordem escolhida por dependência, não a ordem literal do pedido** (que
    era etapa2→B1→B2→B3→recuperação): B1/B2/B3 vieram primeiro porque o
    commit 4 (`main.py` etc.) IMPORTA os módulos deles (`lugares.py`,
    `operacoes.py`) — na ordem pedida, o commit da etapa 2 teria uma árvore
    com import quebrado. Registrado aqui por transparência.
- **4 ajustes de UI (2026-09-23, quarta rodada) — feitos, NÃO commitados**:
  1. **Zoom por lista de níveis**: `NIVEIS_ZOOM_PCT` (5% a 800%, 33 degraus)
     substitui o passo fixo de ~25%; botões e roda do mouse vão pro nível mais
     próximo NA DIREÇÃO do clique/rolagem (`scrollWheelZoom` nativo desligado,
     tratado à mão com `setZoomAround` ancorado no cursor); campo de
     porcentagem continua aceitando qualquer valor digitado.
  2. **ChatGPT — alinhamento manual por 2 pontos REMOVIDO da UI**; troca por
     "reset" (encaixa nos limites do mundo) e "automático" (volta pra
     `bounds_automatico`, campo próprio que `scripts/alinhar_chatgpt_auto.py`
     grava e NUNCA sobrescreve num ajuste manual posterior — as 4 imagens já
     têm esse campo, retropreenchido a partir do `bounds` atual). Toda mudança
     de posição (numérica, reset, automático) agora passa pelo desfazer:
     `operacoes.py` foi generalizado (`chave_lista`, "features" ou "camadas")
     pra também gravar patches de `dados/camadas_referencia.json`, não só
     GeoJSON.
  3. **Régua reescrita**: vários pontos por medição (trecho a trecho + total);
     rótulo de distância escrito sobre a linha, ângulo calculado uma vez em
     espaço de tela (invariante a pan/zoom nesta CRS) e somado 180° se cairia
     de cabeça pra baixo; clique na linha apaga (com confirmação); botão
     "limpar" apaga todas; Esc cancela a medição em andamento; tempo de viagem
     de referência (a pé/caravana/cavalo/barco) junto do total; botão "salvar"
     grava em `dados/medicoes.json` via `POST /api/medicoes`
     (`backend/medicoes.py`, novo, `"reproduzivel": true`, todos os pontos).
  4. **Cursor em cruz** (`.cursor-cruz` no container do Leaflet) enquanto
     Lugar ou a régua esperam um clique de ponto.
  - **Testado**: 62 testes pytest (18 novos: `test_referencias.py` — 10,
    incluindo bounds_automatico nunca sobrescrito por ajuste manual, tile
    recusa mudar posição; `test_medicoes.py` — 8, incluindo menos de 2 pontos,
    ponto sem lat/lon, contagem de trechos errada, distância não positiva).
    Testado também por API real (`curl`): reset/automático/desfazer em
    `chatgpt-1`, medição inválida e válida — tudo revertido depois, sem sobra
    nos dados reais.
- **Interface, quinta rodada (2026-09-23) — feita, NÃO commitada**:
  - **Modal de Lugar** (`static/js/lugares.js` reescrito + `#modal-lugar` no
    HTML): nome, id, tipo, importância, capital, lat e lon, todos editáveis;
    `Enter` salva, `Esc` cancela, foco no nome ao abrir, "salvar e criar
    outro"; o mesmo modal edita, com "apagar" dentro. Validação sempre no
    modal, nunca `alert` — inclusive a que só o servidor sabe (id repetido,
    ponto no mar), que volta pela resposta e aparece no mesmo campo de erro.
  - **`static/js/interface.js` (novo)**: atalhos (`L`, `R`, `Esc`, `Ctrl+Z/Y`,
    espaço segurado pra arrastar, `C` segurado pra ver só a costa, `[`/`]`
    opacidade da camada ativa, `+`/`-` zoom, `?` ajuda) + tela de ajuda + barra
    inferior (coordenada, zoom, sob o cursor, salvamento) + seções do painel
    que abrem/fecham com o estado em `localStorage` + indicador de salvamento
    ("✓ salvo" some sozinho; "✘ NÃO SALVOU" fica).
  - **Lista lateral de lugares** com busca e destaque recíproco com o mapa;
    **símbolo por tipo** (◉ cidade, ● vila, ▲ fortaleza, ⚓ porto, ✖ ruína,
    ★ marco) e **tamanho por importância**; **tema escuro** sem tocar nas cores
    do mapa (nenhum filtro sobre `#mapa`); **apagar lugar não pergunta mais**
    (o desfazer cobre), confirmação ficou só em "limpar todas as medições".
  - **3 ressalvas registradas em vez de forçar** (item 4 do pedido), detalhe em
    `ESPEC-ferramenta.md`: (1) "sob o cursor" mostra o LUGAR, não terra/mar —
    terra/mar exigiria consultar a máscara de 10240px a cada `mousemove`; (2) a
    tecla `C` depende da ordem das camadas no DOM; (3) a régua ainda usa
    `prompt()` pro nome da medição (o pedido do modal era só da Lugar).
  - **Conferência**: 62 testes pytest verdes (nenhum caminho novo de gravação
    no backend nesta rodada — o modal usa os mesmos endpoints já cobertos com
    controle negativo em `test_lugares.py`); `node --check` em todos os JS; e
    uma checagem de que todo `getElementById` dos JS existe no HTML novo (o
    risco real de uma reestruturação de HTML desse tamanho).
- **Pendente:**
  - **Usuário testar a B4 no navegador** (desenhar área, recorte, travar,
    desfazer) · é a única coisa desta rodada que ficou sem commit, por pedido
    explícito. O que o usuário aprovou das rodadas anteriores continua **EM
    ABERTO** (o relato veio em branco pela quarta vez); o que autorizou foi o
    commit, e só isso.
  - **Recorte pela costa** das áreas pintadas · a etapa seguinte da B4.
  - Edição de vértice de área já salva (o Geoman tem `editMode`; a ferramenta
    ainda não usa).
  - Confirmar a suposição de que a atração automática de 5km vale também pro
    início de um braço de delta contra o rio-mãe.
  - Gerar o cache de identidade de ilha: processamento pesado, ainda não
    rodado — é o que destrava reconstruir "The Neck ↔ Calin" em
    `dados/medicoes.json`.
  - ~~Confirmar na prática se o Leaflet-Geoman free cobre
    cortar/rotacionar/dividir/escalar/snap~~ · **RESOLVIDO em 2026-09-23**:
    corta, rotaciona e tem atração; escalar e dividir são pagos/inexistentes.
    Cortar e rotacionar existem mas ainda não foram usados pela ferramenta.
  - Nomear as massas de terra sem nome; decidir pertencimento das 9 ilhas `ilha-*`.
- **Servidor: NO AR** em 2026-09-23 (décima terceira rodada), `http://127.0.0.1:8420/`,
  subido por esta sessão: se a sessão fechar, ele cai junto. Para subir de novo:
  ```
  cd lore/mapas/ferramentas
  .venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
  ```
  **Sem `--reload`**: nesta rodada o `--reload` recarregou uma vez e depois ficou
  servindo o `main.py` antigo sem avisar (a rota nova respondia no formato velho).
  Mudou código do servidor, derrube e suba de novo.
- **172 testes pytest, todos verdes** (`cd ferramentas &&
  .venv/Scripts/python.exe -m pytest`).
- **Instalação e código da etapa 1** — sem mudança desde a última atualização
  (commitados): `.venv` próprio, Leaflet 1.9.4 baixado pronto (sem npm/CDN),
  Geoman e `leaflet-minimap` de fora, minimapa próprio, CRS verificada contra o
  código-fonte do Leaflet, 3.184 tiles de costa/mar gerados (10,4s, pico 298 MB).
  Detalhe completo em `ESPEC-ferramenta.md`.
- **Commit da etapa 1** (`96e41882`, sem push): `.gitignore` (mais a regra nova de
  `__pycache__/`), `CARTOGRAFO.md`, `ESPEC-dados.md`, `ESPEC-ferramenta.md`,
  `dados/regioes.json`, `dados/lugares.geojson` (criado) e `dados/lugares.json`
  (removido), `dados/massas.geojson`, `dados/coordenadas.json`, e todo
  `lore/mapas/ferramentas/` (sem `.venv/` nem `render/tiles/`, os dois fora do git).
- **Commit da etapa 2, primeira versão** (`f8565f8`, sem push): `CARTOGRAFO.md`,
  `ESPEC-ferramenta.md`, `dados/camadas_referencia.json` (criado),
  `ferramentas/backend/main.py`, `ferramentas/backend/referencias.py` (criado),
  `ferramentas/scripts/extrair_ocean_deep.py` (criado), `ferramentas/static/css/estilo.css`,
  `ferramentas/static/js/app.js`, `ferramentas/static/js/camadas-referencia.js`
  (criado), `ferramentas/templates/index.html`. Nada de `render/tiles/` nem
  `.venv/`.
- **Próximo passo:** o usuário abrir `http://127.0.0.1:8420/` e testar o **Rio e a
  Estrada juntos**. **Nada desta rodada está commitado**, como pedido. Fora do git:
  `backend/estradas.py`, `backend/geo.py`, `tests/test_estradas.py`,
  `dados/estradas.json`, `static/js/estradas.js`, `static/js/geo.js` (novos); e
  `backend/main.py`, `static/js/{app,areas,lugares,regua,rios}.js`,
  `static/css/estilo.css`, `templates/index.html`, `tests/test_haversine.py`,
  `dados/lugares.geojson` (os 5 exemplos), `CARTOGRAFO.md`, `ESPEC-dados.md`,
  `ESPEC-ferramenta.md` (modificados).
  **O que só o teste do usuário cobre, item a item** (nada da tela foi exercitado por
  mim nesta rodada, porque nem a extensão do Chrome nem o `chrome-devtools-mcp`
  conectaram):
  0. A página abre: a seção ESTRADAS diz "nenhuma via ainda", os 5 lugares aparecem, e
     o F12 não mostra erro. `node --check` só prova que os arquivos são JavaScript
     válido; se a Estrada estourar ao iniciar, régua, atalhos e `T` caem junto.
  1. Caminho feliz do Rio por clique (pendente desde a etapa 8).
  2. Caminho feliz da Estrada por clique: `E`, clicar em cima de um lugar de exemplo
     e terra adentro, duplo clique. Tem que aparecer a via, o halo rosa no lugar, a
     linha tracejada com os km e o aviso "atração: ... grudaram".
  3. Um desenho, UMA gravação: desenhar via não pode criar rio, e desenhar rio não
     pode criar via (a separação dos dois `pm:create`). Sinal de erro: faixa vermelha
     logo depois de um desenho que deu certo.
  4. O clique em cima do marcador chega ao Geoman com a caneta da Estrada ligada (o
     marcador fica sem clique enquanto ela está ligada).
  5. O halo rosa aparece por cima do símbolo do lugar, e não escondido embaixo dele.
  6. `T` com cada tipo de seleção (via, rio, área, lugar) trava o objeto certo.
  7. A seção ESTRADAS mostra "passa por" na ordem, e o ⚠ ao arrastar um lugar que a
     via usa.
  8. Desfazer e refazer de via pelo botão e por Ctrl+Z/Y, e o cadeado da camada.
  9. A tecla `C` escondendo rios e vias junto.
  **Limite do teste com os exemplos**: há um lugar por ilha e a via não atravessa
  água, então nenhuma via consegue passar por DOIS lugares, e a lista "passa por" com
  mais de um nome não aparece. Para ver isso é preciso um segundo lugar na mesma ilha
  (Mére é a maior); posso criar, se quiser.
  Depois do teste: commit da etapa 9 (com o ok do usuário). Etapas seguintes
  registradas: ponte, vau e balsa; o **pincel de tamanho ajustável**; a **edição de
  vértice** de área, rio e via; e o **cache de identidade de ilha** (processamento
  pesado, com aviso antes).

## Clone novo · o que a ferramenta precisa e o git não traz

Medido em 2026-09-23 (nona rodada), **rodando de verdade**: clone do repositório numa
pasta temporária, `python -m venv .venv`, `pip install -r requirements.txt`, servidor
no ar numa porta separada, e cada peça sondada por HTTP. O resultado, e não a
suposição:

**Funciona sem nenhum arquivo extra**: a página abre (HTTP 200), o Leaflet e o Geoman
carregam de `static/vendor/` (é o conserto do `dist/`, ver abaixo), a API de lugares
responde, e a **validação de terra funciona** (`lon 17,34 / lat 17,78` aceito, o ponto
de oceano aberto recusado com 422), porque `mascaras/costa_10240.png` está no git.
**100 testes: 97 passam e 3 pulam** (os do mar, que precisam dos tiles).

**Falta, e o que fazer:**

| o que falta | sintoma no clone novo | como repor |
|---|---|---|
| `render/tiles/costa` e `render/tiles/mar` | mapa em branco, HTTP 500 em `/tiles/...` | **regerar**: `cd lore/mapas/ferramentas && .venv/Scripts/python.exe scripts/gerar_tiles.py --confirmo`, a partir de `mascaras/costa_10240.png`, que o git traz (3.184 blocos, cerca de 10 s) |
| `render/tiles/rotulos` | camada de rótulos vazia | **regerar** com `scripts/gerar_rotulos.py`, que exige `fonte/Mapa Teste.jpg` e `fonte/Mapa Teste1.jpg`, **copiados à mão** (não estão no git) |
| `render/tiles/ocean-deep` | camada de batimetria vazia | **regerar** com `scripts/extrair_ocean_deep.py`, que exige `referencias/ocean_deep_exportado.png` (400 MB), **copiado à mão** |
| `referencias/*.png` (as 4 imagens do ChatGPT) | HTTP 500 na camada de referência | **copiar à mão**: são originais, e original não vai para o git |
| `fonte/Mapa.psd` e demais originais | nada quebra sozinho | **copiar à mão** quando for preciso regerar a máscara |
| `dados/.operacoes/` e `dados/.historico/` | nenhum | nascem sozinhos na primeira gravação |

Ou seja: **o único arquivo pesado indispensável para a ferramenta rodar já está no
git** (a máscara da costa), e tudo o mais é derivado dela ou de original que se copia.
Um clone novo fica utilizável com um comando.

### A lição do `.gitignore`, que vale para toda a frente do mapa

O `.gitignore` da raiz **foi escrito para o site em Astro e alcança a ferramenta do
mapa**, que nasceu depois e mora dentro do mesmo repositório. A linha 3 é `dist/`,
posta para a saída do build, e ela casa com **qualquer** pasta chamada `dist` em
qualquer profundidade: foi assim que `static/vendor/.../dist/leaflet-geoman.min.js`
ficou fora de um commit feito com caminho explícito, sem erro nenhum, porque o arquivo
continuava no disco aqui. Quem pagaria seria um clone novo, meses depois, com a
ferramenta abrindo sem a caneta e sem mensagem.

**A regra que fica**: arquivo de terceiro trazido para `static/vendor/` é conferido
contra o git depois de commitado, e não só copiado para a pasta. Quem confere agora é
`tests/test_arquivos_no_git.py`, que compara o disco com o que o git rastreia dentro
de `ferramentas/` e `dados/` e falha nomeando o que sobrou; o que fica de fora de
propósito (`.venv/`, `__pycache__/`, `.pytest_cache/`, `.historico/`, `.operacoes/`,
`*.log`, `*.stackdump`) está numa lista explícita dentro do teste, e o controle
negativo dele **recria o defeito** (um arquivo dentro de uma pasta `dist/`) para
provar que o detector o pega.

## Objetivo e estilo

Mapa de fantasia medieval clássico, estilo Faerûn (Forgotten Realms). Por enquanto só
geografia e cidades; fronteiras de reino podem vir no futuro, e o formato de dados
precisa aceitar isso sem refazer nada. Tudo que o usuário marcar recebe um
identificador; nome é opcional e entra depois.

## Papéis desta frente

Registrado a pedido do usuário em 2026-09-22 (décima segunda rodada), para não ficar
implícito:

- **Direcionamento** é a conversa externa, com o usuário. **Ele decide e revisa.**
- **Cartógrafo** é quem executa dentro do repositório: código, dados, documentos,
  commits, medições.
- **Decisão vem do Direcionamento.** Tudo que o Cartógrafo propõe (arquitetura,
  ordem das etapas, valor padrão, o que fica de fora de uma etapa) é
  **recomendação até ser aprovada**, e deve estar marcada como tal no documento onde
  aparecer · é a mesma regra da abertura deste arquivo ("o que é recomendação de IA
  fica marcado como tal"), agora com os nomes dos dois lados.
- O que o Cartógrafo decide sozinho é o que o pedido não fixa e o código precisa para
  existir; mesmo isso vira registro escrito, com o motivo, para o Direcionamento
  poder derrubar.

## Regras invioláveis

- A costa de terra e mar é **definitiva**. Nenhuma etapa altera, cria ou apaga terra.
- Originais nunca são modificados ou sobrescritos. `fonte/Mapa.psd` só é aberto para
  leitura por automação COM e fechado sem salvar.
- Nada é instalado sem ok explícito do usuário (pacote Python, Node, etc.).
- Nenhum commit sem ok do usuário. Arte pesada nunca vai para o git.
- Antes de processamento pesado — o PSD inteiro, qualquer imagem de 10240px ou mais,
  ou varredura sobre a máscara inteira (preenchimento por inundação, contagem de
  componentes, etc.) — avisar para fechar navegadores e outras sessões do Claude
  (máquina com 16 GB de RAM) e esperar confirmação antes de rodar. O computador já
  travou uma vez por isso (rodada de 2026-09-21).
- Nada de inventar API: o que não estiver documentado ou testado, dizer isso
  explicitamente em vez de supor.
- **Toda validação precisa de um controle negativo**: um caso que OBRIGATORIAMENTE
  falha (por exemplo, um ponto conhecido no meio do mar, testado contra "cai em
  terra"). Validação que nunca reprova nada é considerada quebrada, não aprovada —
  mesmo que a conclusão pareça certa. Motivo: em 2026-09-21 a validação dos 17 pontos
  de `massas.geojson` lia um canal alfa sintético (criado por um `.convert("RGBA")`
  numa máscara que não tinha alfa de verdade, sempre 255) e aprovava **qualquer**
  ponto, terra ou mar — a conclusão até bateu por sorte, mas o teste não testava
  nada. Registrado por pedido explícito do usuário depois desse achado.
- **Reescrita de ESPEC nunca apaga decisão registrada sem o usuário ter decidido
  isso.** Motivo: em 2026-09-23 o usuário pediu para restaurar o esquema de
  `importancia` (`"pequena"/"media"/"grande"`) de `ESPEC-dados.md`, supondo que
  uma reescrita tinha apagado — a investigação (`git log -p` em todo o histórico
  do arquivo) mostrou que na verdade a decisão nunca chegou a ser escrita em
  nenhum commit (as duas revisões existentes são idênticas nessa seção), não que
  foi apagada. A regra fica de qualquer forma: se uma reescrita de ESPEC (não só
  a de dados) precisar remover ou substituir uma decisão já registrada, isso exige
  o usuário decidir explicitamente, não uma inferência da IA de que "a versão
  nova substitui a antiga".
- **Toda distância real registrada neste documento guarda os pontos de origem e
  destino (lat/lon) em `dados/medicoes.json`.** Regra criada em 2026-09-23 depois
  de descobrir que a medição "The Neck ↔ Calin" (e, na mesma investigação, as duas
  extensões de Waning) tinham o número final registrado mas os pontos usados para
  chegar nele, não — impossível de reproduzir ou conferir depois. Uma medição sem
  pontos guardados entra em `dados/medicoes.json` como `"reproduzivel": false`
  com o motivo, nunca fica só como número solto no CARTOGRAFO.
- **O travessão (—) é proibido no que eu ESCREVO PARA O USUÁRIO na conversa, e não
  nos documentos e no código deste projeto.** Decidido pelo usuário em 2026-09-23
  (oitava rodada), depois de eu ter oferecido uma varredura para trocar os
  travessões dos documentos do mapa: **não fazer varredura nenhuma**. Reescrever
  documento recém-commitado por causa de pontuação é risco sem ganho, e este projeto
  já perdeu decisão numa reescrita. Os documentos do mapa seguem usando travessão
  normalmente. **Isto ESTREITA a regra geral do `CLAUDE.md` da raiz** (que proíbe
  travessão também em documentação e comentário): fica registrado aqui para uma
  sessão futura não "consertar" de volta e sair varrendo.
- **Histórico do git não se reescreve para consertar cosmética.** Decidido pelo
  usuário na mesma rodada, sobre a linha solta com `@` no começo das mensagens de
  `172c6ca`, `4035ce5` e `3c7e160`: ficam como estão. Rebase e `filter-branch` num
  repositório compartilhado com outra frente custam mais do que uma mensagem feia.
- **Toda sessão do mapa começa conferindo a configuração do git**, junto com a
  leitura deste documento, antes de qualquer trabalho: se `git config
  core.hooksPath` não devolver `scripts/hooks`, avisar o usuário ANTES de começar,
  em vez de descobrir no primeiro commit recusado. Pedido do usuário em 2026-09-23,
  depois de o portão ter recusado o primeiro commit da sétima rodada por
  `core.hooksPath` estar com caminho absoluto. A conferência está no passo 1 de
  `.claude/commands/cartografo.md`.
- **Teste de tela que só exercita RECUSA não verifica nada além da recusa.** Um erro
  diferente aparece igual: mesma faixa vermelha, mesma sensação de "funcionou". Todo
  teste na tela precisa incluir o **caminho feliz**; se ele não puder ser exercitado,
  isso se diz como **não verificado**, nunca como "conferido na tela". Registrado a
  pedido do usuário em 2026-09-22, depois de a etapa 8 ser entregue com duas recusas
  conferidas na tela e um defeito real escondido atrás delas (o `pm:create` da Área
  respondendo à linha do Rio, que pintava a faixa vermelha por cima de um rio salvo
  com sucesso · as duas recusas esperadas tornavam a faixa indistinguível).
- **A automação de navegador desta máquina não entrega clique de forma confiável**
  (três ocorrências registradas: sétima, décima primeira e décima segunda rodadas · o
  movimento do mouse continua chegando, e por isso a leitura de lat/lon sob o cursor
  responde certo enquanto o clique some). **Não insistir em testar caminho feliz por
  clique automatizado.** O que der, exercitar pela API, inclusive de dentro da própria
  página; o resto é declarado como dependente do teste do usuário. **Toda entrega
  termina com a lista exata do que depende dele**, item a item, e não com um aviso
  genérico.
- **Nunca inferir o que o usuário fez, testou ou aprovou a partir de rastro de
  uso** — log de operações, arquivo de dados, histórico, horário de gravação,
  nada disso. Esses rastros dizem no máximo que uma AÇÃO ACONTECEU, nunca quem
  a fez, com que intenção, nem que o resultado foi aprovado. **Se o usuário não
  disse, fica em aberto** e é escrito como em aberto. Regra criada em
  2026-09-23 (sexta rodada) depois de eu concluir, a partir do
  `dados/.operacoes/log.jsonl`, que ele "tinha exercitado o reset e o ciclo
  editar/apagar" — o log mostrava as operações, e eu transformei isso em
  conclusão sobre o teste dele, que ele não tinha relatado.
- **A ordem dos commits segue a DEPENDÊNCIA: base primeiro, quem usa depois.**
  Regra criada em 2026-09-23 (quinta rodada) a partir de uma dívida real, ver
  "Dívida técnica registrada" abaixo. **Se a ordem que o usuário pedir conflitar
  com a dependência, avisar ANTES de commitar**, não resolver sozinho — foi
  exatamente o que faltou na rodada que criou a dívida (eu reordenei por conta
  própria e só avisei depois).

## Estrutura de pastas (`lore/mapas/`)

| Pasta | Conteúdo | No git? |
|---|---|---|
| `fonte/` | `Mapa.psd`, os dois SVGs de traçado da costa, `Mapa Teste.jpg` (sem rótulo, 10240px), `Mapa Teste1.jpg` (mesma imagem rotulada, 10240px) — todos intocáveis | não |
| `referencias/` | as 4 imagens do ChatGPT, `teste.png`, `teste1.png` | não |
| `historico/` | os dois `PROMPT-*.md` da abordagem anterior (IA pintando o mapa inteiro), mantidos como registro | sim |
| `mascaras/` | máscaras de controle, incluindo `costa_10240.png` (a costa oficial) | sim |
| `dados/` | JSON/GeoJSON de lugares, rios, estradas, regiões, massas de terra, coordenadas — esquema completo em `ESPEC-dados.md` | sim |
| `simbolos/` | biblioteca de símbolos gerada por IA | não |
| `render/` | saídas do gerador, incluindo `render/analise/` (prévias e conferências) | não |
| `photoshop/` | PSD de montagem final (não é o `Mapa.psd` original) | não |
| `ferramentas/` | código da ferramenta de pintura e do gerador (`backend/`, `static/`, `templates/`, `scripts/`, `requirements.txt`) | sim, exceto `.venv/` (ambiente Python local, no `.gitignore`) |
| raiz de `mapas/` | `Uldun_parte-jogavel.jpg` e `Uldun_parte-jogavel_rotulado.jpg` (cópias reduzidas, 2560px, já publicadas no site) | sim |

## Sistema de coordenadas

Definição completa, com fórmulas, em `dados/coordenadas.json`. Resumo:

- Planeta esférico, raio 1,25× a Terra (7.963,75 km). Circunferência 50.037,7 km.
  Distância polo a polo (meridiano) 25.018,9 km.
- Projeção equirretangular: 1 pixel vale os mesmos graus em qualquer latitude ou
  longitude (não corrigido por cos(latitude)).
- Resolução de referência: 10240px. 1,25 km/px ao longo dos meridianos. 111,2 px por
  grau, 139,0 km por grau.
- Equador fixado no pixel de terra mais ao sul de Mére: `y = 7650` (medido em
  `mascaras/costa_10240.png`, limite de 50% de alfa sobre a camada Land do PSD).
- Meridiano de referência (longitude 0°) no centro horizontal da tela: `x = 5120`.
- Limites da tela: latitude do topo ≈ 68,79°N, da base ≈ -23,29°S (23,29°S).
  Longitude da borda esquerda ≈ -46,04° (46,04°O), da direita ≈ +46,04° (46,04°L).
- **Coordenadas de tudo (cidades, rios, regiões) são gravadas em latitude/longitude,
  nunca em pixel da tela**, para o mapa poder crescer além da tela sem renumerar nada.
  Desde 2026-09-21 (decisão 1, ver "Decisões tomadas › Técnica"), o formato de
  gravação é GeoJSON, com a ordem `[longitude, latitude]` do padrão GeoJSON — invertida
  em relação à ordem em que este documento costuma escrever "latitude/longitude" em
  prosa; ao converter entre os dois, atenção à ordem.
- Faixas de latitude aproximadas das regiões nomeadas (por caixa delimitadora, não
  pelo contorno exato): Mére 0,1°N–41,1°N · Syl 1,4°N–25,4°N · Calin 26,2°N–43,7°N ·
  The Neck 49,2°N–55,3°N · The White Wall até 68,8°N no topo da tela (terra segue além
  da borda). **Atenção**: essas faixas vêm da caixa delimitadora da MASSA DE TERRA
  inteira; a posição de cada rótulo em `dados/lugares.geojson` é a posição do TEXTO do
  nome no mapa, não o centro nem os limites da região — as duas coisas medem coisas
  diferentes e não devem ser confundidas.
- Extensão de Waning (arquipélago Calin+Syl+Mére): **norte-sul** (sul de Mére até norte
  de Calin) **6.074,9 km**; **leste-oeste** (oeste de Syl até leste de Mére)
  **7.124,8 km** — a maior das duas. Tempos de referência (linha reta, não rota real):

  | Extensão | Distância | A pé (25 km/dia) | Caravana (30 km/dia) | A cavalo (50 km/dia) |
  |---|---|---|---|---|
  | Norte-sul (sul de Mére ↔ norte de Calin) | 6.074,9 km | 243,0 dias | 202,5 dias | 121,5 dias |
  | Leste-oeste (oeste de Syl ↔ leste de Mére) | 7.124,8 km | 285,0 dias | 237,5 dias | 142,5 dias |

  Ver `render/analise/rotas_distancias.png` (norte-sul) e
  `render/analise/waning_leste_oeste.png` (leste-oeste). **Marcada como NÃO
  REPRODUZÍVEL em `dados/medicoes.json` (achado de 2026-09-23)**: os pontos
  (lat/lon) usados nesta medição não sobreviveram em nenhum arquivo versionado —
  só as imagens acima, sem coordenada legível. Mesmo achado da medição "The Neck
  ↔ Calin" abaixo, encontrado ao investigar aquela.

## Decisões tomadas

### Mundo
- O mundo se chama **Uldun** (nome provisório). A tela de 10240px é a parte jogável de
  um mundo maior, como Faerûn dentro de Toril; terra cortada nas bordas continua além
  da tela.
- Nomes existentes: **The White Wall**, **The Neck**, **Waning** (arquipélago de três
  ilhas: **Calin**, **Syl**, **Mére**).
- **The Neck fica isolada de Waning por mar aberto, sem ilhas no caminho.** Intencional.
  Medido e corrigido: a primeira medição (3.177 km) usava só a ilha principal do Neck;
  refeita usando a ilha do arquipélago do Neck mais próxima de Calin, dá
  **2.217,9 km** em linha reta / **2.772,3 km** de rota real (+25%) — ver
  `render/analise/rota_neck_calin_corrigida.png`. **Marcada como NÃO
  REPRODUZÍVEL em `dados/medicoes.json` até o cache de identidade de ilha
  existir** (pedido do usuário, 2026-09-23) — os pontos de referência de cada
  ilha em `massas.geojson` são o centro de identificação, não o ponto de
  aproximação mais próxima entre as duas costas que esta medição usou.

### Clima e bioma
As descrições de clima e bioma por região em `historico/PROMPT-mapa-completo-svg.md` e
`historico/PROMPT-relevo-mapa.md` continuam valendo como guia (a abordagem desses
prompts, IA pintando o mapa inteiro, está superada — ver seção Técnica). Resumo:

- **The White Wall** (extremo norte): as montanhas mais altas do mundo, todas cobertas
  de gelo e neve. Terra gélida.
- **The Neck** (aglomerado de ilhas a noroeste): frio, porém habitável. Costas nevadas,
  tundra, coníferas esparsas. Menos gelo que o White Wall.
- **Calin** (lobo norte de Waning): temperado. Algumas montanhas, florestas e rios,
  porém menos que nas outras partes; mais ocupação (campos e estradas).
- **Syl** (braço oeste/sudoeste de Waning): clima mais quente e exuberante. Muitas
  florestas verdes densas, lagos e rios, planícies amplas. Poucas montanhas. A parte
  mais verdejante do mapa.
- **Mére** (leste/sudeste de Waning, a maior): dividida. Metade norte mais montanhosa,
  mais fria e menos habitada. Metade sul mais quente, com mais rios, vegetação densa e
  sinais de civilização.
- Demais massas sem nome: gradiente por latitude (mais frio e nevado ao norte, mais
  verde e temperado ao sul).
- **Clima adicional** (decidido nesta sessão): o extremo sul de Mére fica sobre o
  equador, com florestas equatoriais. O interior e o lado oeste do sul de Mére, entre
  15°N e 25°N, são a região de desertos e áreas áridas. Costas leste dos trópicos
  tendem a ser úmidas.
- Rios e lagos sempre em azul fino, contidos na terra, descendo das montanhas para o
  mar. Sombreamento de relevo com luz vindo do noroeste. Estilo pintado à mão, tipo
  atlas em pergaminho, nunca fotorrealista.

### Conteúdo e dados
- Rios e cidades são marcados pelo usuário. Geração automática (rios por acumulação de
  fluxo, cidades por pontuação) só entra como **sugestão opcional que o usuário aceita
  ou apaga**, nunca automática por padrão. Sem grade Voronoi (a fonte é máscara
  pintada, não uma malha gerada).
- Símbolos (montanhas, árvores, cidades etc.): biblioteca gerada por IA **em nuvem**,
  uma vez; o código espalha os símbolos nas regiões pintadas por Poisson-disc sampling.
  Nada de IA pintando o mapa inteiro. Geração local descartada (a GTX 1660 da máquina
  tem defeito conhecido de hardware em fp16 e só 6 GB de VRAM).
- Tempos de viagem são **referência**, não regra do sistema — o Centelha ainda não tem
  regra própria de km por dia.

### Técnica
- Resolução de trabalho 10240px; resolução final alvo **20480px** (0,625 km/px), em
  blocos se necessário.
- Ferramenta de pintura: servidor Python (FastAPI) + **Leaflet** no navegador
  (`L.CRS.Simple` com a transformação de `coordenadas.json`, não o CRS padrão baseado
  no raio da Terra real), com o plugin **Leaflet-Geoman free** (MIT) para
  desenhar/editar polígono. Decidido em 2026-09-21, substituindo a ideia anterior de
  canvas próprio ou Konva.js — nenhum impedimento concreto foi encontrado para usar
  Leaflet no lugar deles. Sem mesa digitalizadora — prioriza laço poligonal e
  preenchimento limitado pela costa. Especificação completa em `ESPEC-ferramenta.md`.
- Photoshop só para montagem final e retoques. O PSD de montagem é criado pelo próprio
  usuário, uma vez, com um passo a passo escrito pela IA, usando objetos inteligentes
  vinculados. **Nada de API não documentada** — a automação de smart object vinculado
  não tem API oficial da Adobe (achado da sessão anterior), então essa etapa é manual.
- **Todo dado de posição (não só área pintada) é GeoJSON, `[longitude, latitude]`**
  (decisão 1, 2026-09-21): lugares em `Point`, rios/estradas em `LineString`, regiões
  em `Polygon`/`MultiPolygon` (ou sem geometria própria, quando definida por massas),
  áreas pintadas em `Polygon` **ou `MultiPolygon`** (correção 4, 2026-09-21, terceira
  rodada — um valor pode cobrir pedaços de terra desconexos numa feature só). Esquema
  completo em `ESPEC-dados.md`.
- **`dados/regioes.json` criado** (decisão 1, 2026-09-21, terceira rodada): as 6
  regiões nomeadas, cada uma com `rotulo` (`Point`, posição do nome no mapa) — os 6
  registros `tipo: "regiao"` que existiam em `lugares.geojson` (herança da segunda
  rodada) foram movidos para lá. `lugares.geojson` fica vazio, dedicado só a
  assentamento de verdade (tipo fechado: cidade, vila, fortaleza, porto, ruína,
  marco).
- **Pertencimento de ilha a região mora só em `massas.geojson`** (campo `regiao` de
  cada massa; correção 7, 2026-09-21, terceira rodada) — `regioes.json` não lista mais
  suas massas, pra não ter a mesma informação em dois lugares que podem divergir. Os 9
  ids que eram `amb-*` (de "ambíguo", herdado do tempo do `status: "duvidosa"`) viraram
  `ilha-*`, mesmo número (correção 9). Formato de id de região padronizado: slug
  minúsculo com hífen (`mere`, `syl`, `calin`, `the-neck`, `white-wall`, `waning`),
  igual em `massas.geojson` e `regioes.json`.
- **Áreas pintadas (relevo, cobertura, lagos, regiões-sobre-água) são guardadas como
  vetor** — não como máscara raster de controle. **O polígono é gravado exatamente como
  desenhado** (decisão 5, 2026-09-21): o recorte pela costa oficial só acontece na hora
  de rasterizar (prévia ou final), nunca ao salvar — o dado pode ter um traço que
  avança sobre o mar, e isso é esperado, não é erro. **Área nova recorta a área antiga
  da MESMA camada ao salvar** (decisão 3, 2026-09-21; shapely `difference`) — relevo
  nunca corta cobertura, e vice-versa, porque são independentes. Operações de unir,
  subtrair e apagar área usam a biblioteca **shapely** (Python), instalada em
  2026-09-21 (versão 2.1.2, autorizado pelo usuário).
- Relevo e cobertura são **camadas separadas**. Relevo: planície, colina, montanha,
  alta montanha. Cobertura: floresta temperada, floresta tropical, floresta boreal,
  selva, campo, deserto, pântano, tundra, geleira. Todo pedaço de terra tem os dois ao
  mesmo tempo (um relevo e uma cobertura), nunca só um.
- Terra que o usuário não pintou recebe **cobertura automática por latitude**, seguindo
  o guia de clima da seção "Clima e bioma" acima; e **relevo automático `planície`**
  (decisão 4, 2026-09-21, novo — antes só cobertura tinha padrão). Qualquer pintura do
  usuário sobrescreve o valor automático naquele trecho, nas duas camadas.
- **Lagos internos** podem ser criados pelo usuário na ferramenta. É a única exceção à
  regra da costa: o contorno do lago pode ser editado livremente, a costa do mar
  continua intocável.
- O ruído que deixa a borda de uma área pintada com aparência natural (em vez de um
  polígono reto) usa **semente fixa por área** (guardada no dado da própria área), para
  a borda sair sempre idêntica em qualquer renderização, não mudar a cada rasterização.
- Identificador de ilha estável: massas de terra **não** são identificadas por número
  de componente conectado (esse número muda se o método de detecção mudar). Cada massa
  relevante recebe um **id curto permanente e um ponto de referência** (latitude e
  longitude); a ilha correspondente é achada consultando a máscara oficial nesse ponto
  em tempo de execução. Formato e dados em `dados/massas.geojson`. **Correção
  2026-09-21**: a consulta não roda mais por preenchimento por inundação a cada clique
  — um cache (mapa de rótulos de componente, ou contorno vetorial) é gerado **uma vez**
  a partir da máscara oficial inteira e fica salvo em `render/` (fora do git),
  regenerável a qualquer momento. Isso é processamento pesado (varre a máscara inteira)
  e cai na regra de aviso/confirmação da seção "Regras invioláveis"; ainda não foi
  gerado. Detalhe em `ESPEC-ferramenta.md`.
- Pertencimento de ilha a região é decidido pelo usuário na ferramenta.
  **Atribuição automática só quando a ilha estiver a menos de 100 km da ilha PRINCIPAL
  da região** (não da região inteira); todas as demais ficam `"sem_regiao"` até o
  usuário decidir (vocabulário de `status` fechado a `"atribuida"`/`"sem_regiao"` desde
  2026-09-21 — a palavra `"duvidosa"` foi removida por ser redundante com
  `"sem_regiao"`). Testado nesta sessão com a regra dos 100km sobre as 5 regiões
  nomeadas: **nenhuma massa de terra além das já nomeadas caiu dentro de 100km de uma
  ilha principal** — os arquipélagos são isolados por mar aberto na escala do mundo,
  então a atribuição automática praticamente não vai disparar sozinha; a maior parte da
  decisão de pertencimento vai ser manual mesmo.
- **Validação dos pontos de referência de `massas.geojson`** (2026-09-21): os 17 pontos
  caem em terra (leitura de pixel único contra `costa_10240.png`) e dentro da faixa de
  latitude da região nomeada que cada um declara. Não confirma conectividade de
  componente (depende do cache do item acima). Detalhe completo em `ESPEC-dados.md`.
- **`dados/coordenadas.json` reescrito em 2026-09-21 (terceira rodada)**: `px_por_grau`
  e `km_por_grau` passam a ser **derivados** de `raio_km` e `km_por_px_latitude`
  (único valor medido diretamente), gravados uma vez com precisão total em vez de
  repetidos arredondados em três lugares do arquivo; `limites_da_tela` também passa a
  ser derivado das mesmas fórmulas. As fórmulas citam os campos pelo nome
  (`referencia.y_equador_px`, `projecao.px_por_grau`) em vez de repetir o número.
- **Salvamento automático a cada operação concluída** (correção 5, 2026-09-21,
  terceira rodada): fechar um polígono, terminar um rio, criar um lugar, confirmar um
  apagamento — cada um já grava sozinho, sem botão "Salvar" manual. Desfazer/refazer
  **entre operações concluídas é código próprio** (registro de operações no servidor,
  `dados/.operacoes/`), não o plugin de desenho — **verificado nesta sessão**: o
  Leaflet-Geoman free só tem `removeLastVertex` (desfazer vértice dentro de uma forma
  ainda sendo desenhada), não desfazer entre formas já salvas. Gravação atômica
  (arquivo temporário + `os.replace`) e cópia das últimas 5 versões de cada arquivo em
  `dados/.historico/` continuam valendo, como decisão separada (rede contra "salvei
  errado por cima", não é o mesmo mecanismo do desfazer).
- **Ocean Deep também vira tiles** (correção 10, 2026-09-21, terceira rodada), extraída
  do `Mapa.psd` uma vez e convertida do mesmo jeito que a costa oficial — processamento
  pesado, mesmo aviso. As 4 imagens do ChatGPT continuam entrando inteiras (posição,
  escala e opacidade ajustáveis à mão), sem virar tile.
- **Camada do mar desenhada por cima da pintura na visualização ao vivo** (correção 11,
  2026-09-21, terceira rodada): um tile de água opaca (gerado junto com o tile da
  costa, mesma varredura) fica acima da camada vetorial de área pintada no navegador,
  cobrindo visualmente qualquer trecho de polígono que avance sobre o mar — dá a
  impressão de recorte pela costa sem rodar shapely a cada pan/zoom. O recorte de
  verdade continua só acontecendo na rasterização (decisão 5, mantida).
- **Instalação da etapa 1, decidida em 2026-09-21**: Python isolado num `.venv`
  próprio (não o Python global da máquina); Leaflet **baixado pronto, sem npm e sem
  CDN** (a ferramenta tem que funcionar offline); Leaflet-Geoman só entra na etapa 5;
  minimapa é **código próprio** (imagem fixa + retângulo clicável), não um plugin de
  terceiro.
- **Etapa 1 testada e aprovada pelo usuário em 2026-09-21.** Sem animação de
  zoom/pan (`zoomAnimation`/`fadeAnimation`/`markerZoomAnimation: false`) — sugestão
  da sessão, aprovada depois do teste: numa ferramenta de edição de precisão, zoom
  instantâneo é melhor que animado enquanto o usuário posiciona algo.

### Fases do projeto depois da ferramenta pronta

**Ferramenta pronta não é mapa pronto.** Depois das 12 etapas da ferramenta (ver
`ESPEC-ferramenta.md`), faltam três fases, sem especificação própria ainda:

1. **Biblioteca de símbolos**, gerada por IA em nuvem, uma vez.
2. **Renderizador no estilo Faerûn**: pega os dados vetoriais + a biblioteca de
   símbolos e pinta o mapa final (Poisson-disc sampling, sombreamento, rios finos).
3. **Montagem no Photoshop**, manual, passo a passo escrito pela IA (sem API
   automatizada de smart object vinculado — não existe API oficial documentada).

## Achados técnicos registrados (não são decisões, são fatos medidos)

- **Duas "ilhas" de `massas.geojson` são pedaços das principais** (2026-09-23 noite,
  cache de identidade de ilha, conectividade 4 na resolução oficial): `ilha-192` cai
  no MESMO componente que `syl-principal`, e `ilha-204` no mesmo que `mere-principal`.
  Na análise antiga (2048 px) elas pareciam separadas; na costa oficial, estão ligadas
  por terra. **Não mexi no arquivo**: tirar ou renomear massa é decisão do usuário. A
  ferramenta mostra as duas massas quando se identifica essa ilha. Também medido:
  `mere-principal` e `syl-principal` estão a menos de 100 km uma da outra, então a
  regra dos 100 km nunca atribui sozinha uma ilha que esteja perto das duas.

- **A medida de silhueta mede CONTORNO, não legibilidade** (2026-09-23, correção do
  usuário). A primeira tabela de tamanho mínimo (`dados/tamanho-minimo-silhueta.json`,
  antes chamada `tamanho-minimo-legivel.json`) deu 14 px para a árvore folhosa, e o
  usuário viu a folhosa virar mancha cinza muito antes disso: a hachura de dentro
  some antes do contorno. Por isso ela ganhou o nome de **tamanho mínimo de silhueta
  distinguível** e uma segunda medida, o **tamanho mínimo de detalhe interno**
  (`dados/tamanho-minimo-detalhe.json`: o símbolo reduzido comparado com ele mesmo
  borrado na escala da própria hachura; equivalentes abaixo de 0,03 de diferença RMS
  de luminância). O renderizador usa o MAIOR dos dois. A folhosa foi de 14 para 30 px;
  o detalhe manda em quase todo tipo (só porto e ruína ficam no contorno, 24 px).
  Critérios completos em `ferramentas/cartografia/legibilidade.py`.

- **`mascaras/costa_10240.png` é modo "L" (escala de cinza, 1 canal), não RGBA — não
  tem canal alfa de verdade.** Achado em 2026-09-21 (sessão de geração de tiles):
  255 = terra, 0 = mar, confirmado por amostragem (5000 pixels aleatórios, só esses
  dois valores) e por checagem pontual (pontos de terra conhecidos deram 255, dois
  pontos de oceano aberto deram 0). **Isto corrige uma leitura errada de sessão
  anterior**: a validação dos 17 pontos de `massas.geojson` (registrada como
  "correção 6" numa rodada passada do `ESPEC-dados.md`) tinha sido feita com
  `Image.open(...).convert("RGBA")`, e esse `.convert` cria um canal alfa **sintético,
  sempre 255**, em cima de uma imagem que não tinha alfa — a checagem "alfa ≥ 128 ⇒
  terra" dava sempre verdadeiro, para qualquer pixel, terra ou mar; não testava nada.
  **Refeita nesta sessão com o canal certo (valor de cinza, não alfa)**: a conclusão
  não mudou (os 17 pontos continuam todos em terra), mas o método da vez passada
  estava quebrado por sorte, não por acerto — registrado aqui porque é exatamente o
  tipo de "não investigado vira explicação errada" que este projeto tenta evitar.
  **Refeita de novo, com controle negativo** (pedido do usuário depois deste achado,
  ver a regra nova em "Regras invioláveis"): um ponto de oceano aberto conhecido
  (`px=(1000,5000)`, `lat=23.832`, `lon=-37.052`, longe de qualquer massa marcada)
  testado contra o mesmo código — devolveu `terra=False`, valor L = 0, como tem que
  devolver. Só depois desse controle passar é que os 17 pontos de `massas.geojson`
  foram checados de novo: os 17 continuam `terra=True`. Agora sim é uma validação de
  verdade, não uma que não reprova nada.
- A camada `Land` do `Mapa.psd` bate com o traçado vetorial da costa: 1,27% de
  divergência contra `fonte/Mapa Teste.jpg` limiarizado, concentrada numa faixa fina de
  antialiasing ao redor do contorno, não em manchas soltas em alto-mar (ver
  `render/analise/diff_costa_oficial_vs_jpg.png`).
- `Ocean Deep` é a camada de batimetria (escuro = fundo, claro = raso) — vai ser usada
  para o sombreamento do mar.
- `Paint Layer copy` e `Plano de Fundo`, dentro do `Mapa.psd`, são as camadas de
  geração da costa original (manchas pintadas sobre ruído e limiar) — ficam só como
  histórico, não entram no pipeline novo.
- `Mapa Teste1.jpg` não é uma variante do mapa: é `Mapa Teste.jpg` com os rótulos de
  nome desenhados por cima, mesma resolução (10240px).
- `Uldun_parte-jogavel.jpg`/`_rotulado.jpg` (2560px, na raiz de `mapas/`) são o mapa
  grande inteiro reduzido 4×, não um recorte de sub-região (99,52% de concordância
  pixel a pixel contra `Mapa Teste.jpg` reduzido, sem precisar deslocar).
- Os dois SVGs de traçado (`Mapa Teste.svg` e `Mapa-Teste.svg`) são o mesmo contorno
  (0,11% de diferença entre si); ambos vêm de `Mapa Teste.jpg`, não de `Mapa Teste1.jpg`.
- `fonte/Mapa Teste.jpg` **não é um raster simples em preto e branco**: ao recortar em
  resolução nativa (item 4 da verificação de 2026-09-21) apareceu como uma imagem já
  colorida (terra bege, mar azul-acinzentado com textura), no mesmo estilo dos
  `Uldun_parte-jogavel*.jpg`. A suposição anterior de que era um raster binário (base
  direta do traçado potrace) não tinha sido conferida visualmente — só numericamente
  (limiar de cinza), o que funcionou para medir a costa mas descrevia a imagem errado.
  Vale revisitar antes de usá-la como "máscara crua" em qualquer texto futuro.
- **Calin e Syl são massas de terra separadas, e Syl e Mére também.** Confirmado por
  varredura exaustiva (preenchimento por inundação de toda a máscara oficial de
  10240px, conectividade 4, a partir de um pixel de terra dentro de cada ilha): a
  região pintada a partir da semente de Calin nunca alcança a semente de Syl, nem a de
  Syl alcança a de Mére — são três componentes conectados distintos em toda a extensão
  do mapa, não só no ponto de maior aproximação medido antes. Isto substitui a suspeita
  de istmo registrada em rodadas anteriores (baseada numa análise em 2048px, já
  corrigida) e a verificação por amostragem da rodada passada (que só olhava o ponto
  mais próximo, não o contorno inteiro). Ver `render/analise/istmo_costa_oficial.png` e
  `istmo_mapa_teste_jpg.png` para o recorte nativo do ponto de maior aproximação entre
  Calin e Syl.

## Dívida técnica registrada

- **Os commits `281186e` (B1), `57083af` (B2) e `0716791` (B3) não compilam
  sozinhos** (2026-09-23, registrado a pedido do usuário; **não vai ser
  refeito**, o histórico fica como está). Cada um deles introduz módulos
  (`historico.py`/`operacoes.py`, `lugares.py`, `regua.js`) que só passam a ser
  IMPORTADOS/incluídos no commit seguinte (`939f07d`, a etapa 2, que carrega
  `main.py`, `app.js`, `index.html`, `estilo.css` inteiros) — então, olhando
  cada um isolado, `main.py` daquele ponto do histórico ainda não conhece os
  módulos novos, e os módulos novos ainda não são chamados por ninguém. Não
  quebra nada na prática (nenhum deles deixa um import pendurado; o que falta é
  a ligação, não a base), mas um `git checkout` num desses commits não dá uma
  ferramenta funcional com aquelas etapas ligadas.
  - **Por que passou pelo portão**: o `pre-commit` valida o ÍNDICE com HEAD por
    baixo (o estado do repositório DEPOIS daquele commit), e nesse estado nada
    está quebrado — o portão não tem como ver "este commit isolado não faz
    sentido sozinho", porque não é isso que ele mede.
  - **Causa**: eu reordenei os commits por dependência (B1→B2→B3→etapa 2) em vez
    da ordem que o usuário pediu (etapa 2→B1→B2→B3), e a reordenação resolveu
    METADE do problema (evitou import quebrado) sem resolver a outra metade
    (`main.py`/`app.js` continuam entrando todos de uma vez no fim, porque
    `git commit -- pathspec` é arquivo inteiro). A regra nova em "Regras
    invioláveis" (ordem por dependência, e avisar ANTES se a ordem pedida
    conflitar) vem daqui.

## Decisões em aberto

- **Piso x densidade: o que fazer quando o piso aperta** (pedido do usuário em
  2026-09-23 à noite; o aviso já existe, ver "Estado atual", etapa A). **O que o
  código faz hoje**: não reduz a contagem. Os pontos saem da densidade pedida e o piso
  só aumenta o símbolo, então eles se sobrepõem mais. **O que as áreas de exemplo
  mostraram**: o piso só pesa de verdade na **palmeira** (piso 46 contra tamanho 40,
  70% da faixa pedida abaixo do piso, 21% a 26% "a menos" em toda floresta tropical);
  na conífera ele come metade da faixa, mas quase não dispara aviso. O "poucos"
  disparou na tundra do Neck (rala de propósito) e em pedaços de área cortados pela
  janela. **Recomendação do Cartógrafo**, em três partes:
  1. **Manter a contagem, aceitar a sobreposição.** Árvores que se encostam leem como
     copa de floresta, que é a convenção de atlas; tirar símbolo para respeitar a
     folga faria a floresta pequena ficar rala, que é o contrário do pedido.
  2. **Consertar a palmeira na folha, não no número.** Aumentar o tamanho dela até o
     piso parar de morder exigiria uns 70 px, grande demais ao lado da árvore
     tropical (40). O conserto é regenerar a folha com hachura mais grossa, e ela já
     está em `FOLHAS-A-REGENERAR.md`. Até lá, o aviso fica aparecendo.
  3. **Área pequena demais para o tipo (o "poucos")**: a cor carrega o sentido e os
     poucos símbolos ficam. Se o usuário achar muitas florestas pequenas assim, o
     próximo passo é um símbolo de **bosque** (uma peça com 3 a 5 árvores juntas),
     que diz "floresta" com um símbolo só; seria uma folha nova. Tundra fica fora do
     "poucos" se o usuário confirmar que rala é o que ela deve ser.
- **Montanha comum x montanha nevada no mapa pequeno** (achado de 2026-09-23). As
  duas têm a MESMA silhueta (a medida de contorno as confunde até 32 px), e a
  diferença é a neve. Medi o tom: a luminância média dentro da silhueta, sobre o papel,
  é 0,57 na comum e 0,65 na nevada em 40 px, e a diferença (0,08 a 0,09) se mantém até 12 px,
  três vezes o limiar de detalhe (0,03). Ou seja, a neve continua lendo como TOM
  depois que a hachura some. **Recomendação do Cartógrafo**: não pintar fundo por
  relevo (a área de alta montanha fica por cima de coberturas, e uma cor de relevo
  brigaria com a cor da floresta ou da tundra embaixo) e confiar no tom, com duas
  garantias que já existem: a nevada em branco opaco e o piso medido (44 px, o mesmo
  da comum). Se, pintando, as duas ainda se confundirem, a segunda opção é a nevada
  maior (hoje 90 px contra 80), o que também diz "mais alto". Decisão do usuário.
- Nome definitivo do mundo (hoje "Uldun" é provisório).
- Nomes das massas de terra sem rótulo (a maioria do mapa).
- Esquema completo de dados além de `lugares.geojson` (cidades, rios, estradas, marcos,
  fronteiras futuras) — **recomendação da IA pendente de aprovação**, não decidido
  ainda. Proposta revisada (terceira rodada) completa em `ESPEC-dados.md`.
- Resto do mapa sem nome (grande aglomerado a sudoeste, terras a leste, ilhas nas
  bordas) — nomear conforme a campanha pedir.
- Se `Leaflet-Geoman free` cobre cortar/rotacionar/dividir/escalar/snap, ou só a versão
  Pro (a documentação pública não deixou isso claro) — não bloqueia a decisão de usar
  o Geoman (a arquitetura já não depende desses botões), mas vale confirmar na prática
  na etapa 5 da ferramenta (renumerada na terceira rodada).
- **Suposição a confirmar (terceira rodada)**: a atração automática de 5km ao desenhar
  uma estrada perto de um lugar (correção 3 do `ESPEC-dados.md`) foi estendida para o
  início de um braço de delta contra o traçado do rio-mãe, pela mesma distância — o
  pedido original só deu o número para o caso do lugar. Confirmar ou corrigir quando a
  etapa 8 (rio) da ferramenta for construída.
- **Lista de instalação da etapa 1** (`ESPEC-ferramenta.md`, seção final): proposta,
  não aprovada ainda — é o bloqueio imediato para o código começar.
