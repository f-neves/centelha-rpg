# Relatório final da empreitada autônoma (começada em 2026-09-23, noite)

Este é o arquivo de reencontro: ele é atualizado ANTES de começar cada etapa nova.
Se a energia cair, a próxima sessão começa por aqui. Tudo o que for decisão neste
relatório é **recomendação do Cartógrafo**, nunca decisão do usuário.

Pedido: Parte A (fechar o que está aberto), Parte B (o editor completo: nomes,
elementos de cartografia, exportação parcial, rotas de comércio, mapas distorcidos),
Parte C (mapa de teste do mundo, mapa de jogador e distorcido, RUNBOOK, fechamento).
Fora do escopo: folhas de símbolos novas, PSD de montagem, nomes definitivos.

**Memória no começo**: 1,8 GB livres de 16 GB (medido pelo Windows). O servidor
estava parado (derrubado pelo Claude Code por falta de memória na rodada anterior).

## Estado das etapas

| etapa | estado | commit |
|---|---|---|
| A1 áreas de verdade | feita (rodada anterior) e ajustada (A1-bis) | `4dd2d20`, `e172ce4`, `8f18663` |
| A2 piso x densidade | feita (rodada anterior) | `37c7571` |
| A3 regiões + cache de ilha | feita | `c37e34f` |
| A4 vértice de área e rio | feita (rodada anterior) | `4336c16` |
| A5 pincel | feita (rodada anterior) | `ac02fc3` |
| A6 braço de delta na tela | feita | `a7e2b6c` |
| B1 camada de nomes | feita | `eb0ef43` |
| B2 elementos de cartografia | feita | `f495257` |
| B3 exportação parcial | feita | `4355f27` |
| B4 rotas de comércio | feita | `6cf51dd` |
| B5 mapas distorcidos | feita | `ece7a9c` |
| C1 mapa de teste do mundo | feita | `edbb119` |
| C2 mapa de jogador e distorcido | feita (só imagens) | registrado em `edbb119` |
| C3 RUNBOOK | feita | `12e02b3` |
| C4 fechamento deste relatório | feita | o commit deste texto |
| C5 servidor parado | feito | (nenhum processo em 8420) |

## Diário por etapa

### A1, A2, A4, A5 (feitas na rodada anterior, mesma noite)

- **A1**: 22 áreas `exemplo-*` de 20 a 102 vértices pintadas pela API
  (`scripts/pintar_exemplos.py`), renderizadas nas cinco regiões e avaliadas no
  CARTOGRAFO ("Etapa C"). A franja resolve com contorno irregular. Feios ainda:
  relevo x cobertura no norte de Mére, geleira em papel de parede, colina fraca.
  Esses ajustes entram nesta empreitada (ver A1-bis abaixo, quando chegar).
- **A2**: aviso "piso" e "poucos" no renderizador; decisão: manter a contagem,
  consertar a palmeira na folha (fora do escopo: folha nova), bosque como símbolo
  futuro.
- **A4**: `V` edita vértices de área e rio; o servidor valida de novo.
- **A5**: `P` pincel, funde com a área do mesmo valor.

### A1-bis · ajustes depois da avaliação das áreas irregulares (feita)

- **Relevo manda sobre cobertura** (`Estilo.relevo_manda`, ligado só no estilo
  padrão; `noite2` e `cor` não mudam, e a imagem da noite 2 continua reproduzível
  byte a byte): onde há montanha ou alta montanha, a cobertura não põe símbolo, e a
  cor dela continua embaixo. Colina fica de fora (árvore em colina é paisagem). Teste
  com controle negativo (sem a regra, a floresta põe símbolo dentro da serra).
- **Geleira**: raio 0,80 para 1,6 e franja mais rala. White Wall caiu de 445 para 73
  símbolos de geleira; as montanhas passaram a ler.
- **Decisão minha, por quê**: são as duas propostas da rodada anterior; o pedido
  desta empreitada manda "ajuste o que precisar" e escolher a opção mais recomendada.
- **Colina fraca**: não mexi. É a arte da folha (traço claro), e folha nova está fora
  do escopo; entra na lista do que o usuário deve olhar em alta resolução.
- Imagens: `render/recorte-mere-cor-densidade-rapido.png`,
  `render/recorte-white-wall-cor-densidade-rapido.png`.

### A3 · regiões com o cache de identidade de ilha (feita)

- **Pronto**: `backend/ilhas.py`, `scripts/gerar_cache_ilhas.py`; cache em
  `render/cache-ilhas/` (fora do git). Rotulagem por corridas e união-busca, lendo em
  faixas e escrevendo por memmap. **Medido**: 4,7 s, pico de 271 MB, 435 componentes,
  com o servidor parado e 2,2 GB livres antes. Não estourou nada: sem segunda
  tentativa.
- Endpoints `GET /api/ilha` e `POST /api/massas`, botão "identificar ilha" no painel.
- **Decisões minhas**: conectividade 4 (a da varredura exaustiva já registrada);
  zona dos 100 km medida a 5 km/px (erro de até uns 5 km na borda); atribuição
  automática só com UMA região candidata; massa nova recusada em ilha que já tem
  massa; id `ilha-NNN` seguindo a numeração existente.
- **Achado**: `ilha-192` e `ilha-204` são pedaços de Syl e de Mére (mesmo
  componente). Não mexi em `massas.geojson`: é decisão do usuário.
- **Não fiz**: refazer a medição "The Neck ↔ Calin" (marcada não reproduzível até o
  cache existir). Agora ela é possível, mas não foi pedida nesta lista.
- **Depende do teste do usuário**: o botão e o clique na tela. A pilha de desfazer
  tem um "refazer" armado com o meu teste (`ilha-219`, desfeito).
- Commit: (este registro vai no mesmo commit).

### A6 · campo de braço de delta na tela (feita)

- **Pronto**: seletor "braço de delta de" no painel do Rio, com "(não é braço)" como
  padrão e a lista dos rios existentes; o `POST /api/rios` manda `ramo_de` dele. Volta
  ao padrão depois de cada rio criado (o próximo não herda o rio-mãe sem querer).
- **Decisão minha**: campo separado do "termina em" (o defeito 2 da revisão da
  etapa 8 era justamente amarrar os dois). A atração do início do braço contra o
  traçado do rio-mãe (5 km) continua não feita: não foi pedida aqui.
- **Conferido** na página (servidor subido só para isso e derrubado depois): o
  seletor existe com "(não é braço)", sem erro no console; e o "identificar ilha" da
  A3 respondeu na tela a um clique disparado por evento ("ilha 191 · massa:
  mere-principal, ilha-204 · a menos de 100 km da principal de: mere, syl").
- **Depende do teste do usuário**: criar um braço de delta pela tela (não há rio
  salvo para ser mãe; o servidor valida `ramo_de` desde a etapa 8).

### B1 · camada de NOMES (feita)

- **Pronto**:
  - dados: `dados/nomes.json` (ajustes e nomes livres; `backend/nomes.py`, rotas
    `/api/nomes`), campo `visivel_jogador` em lugar e região;
  - desenho: `cartografia/tipografia.py` (texto reto e texto na curva, letra a letra,
    com halo cor de papel; espinha de forma alongada) e a composição nova,
    `cartografia/composicao.py`, que é a base de toda a Parte B;
  - tela: painel NOMES (nível, reto, jogador, curva desenhada à mão, nome livre, e
    arrastar); nomes de região continuam no painel REGIÕES.
- **A composição nova** planeja os símbolos por ÁREA, na janela da própria área, e
  não por janela de saída: o mesmo recorte sai igual sozinho, dentro de um recorte
  maior ou em blocos. **Teste de costura**: Mére em 1 bloco e em blocos de 37 linhas,
  byte a byte iguais; controle negativo (sem folga nos blocos) diferente. Um defeito
  achado por esse teste: `round()` do Python arredonda ,5 para o par, e a âncora
  semeada em pixel + 0,5 caía em pixels diferentes conforme o bloco; virou
  `floor(x + 0,5)`.
- **Decisões minhas**: Palatino (Georgia de reserva); região e cordilheira em
  maiúsculas espaçadas; mar e rio em itálico azul; rota em itálico vermelho-terra;
  capital em negrito; tamanho por nível 15/21/30/46/70 px na resolução oficial;
  nome de região e cordilheira cresce com a forma (até 3 vezes o nível); curva
  automática só se a forma for 1,7 vez mais comprida que larga E a espinha tiver no
  máximo 40° de inclinação (senão o nome sai reto: Mére, em pé, sai reta).
- **O que ficou feio**: nome de cordilheira pequeno escrito por cima dos próprios
  picos; nada de desvio automático de colisão entre nomes e símbolos.
- Imagem: `render/teste-nomes-mere.png` (nomes de teste, não gravados).
- **Depende do teste do usuário**: o painel NOMES inteiro na tela (arrastar, nível,
  curva à mão, nome livre).

### B2 · elementos de cartografia (feita)

- **Pronto**: `dados/elementos.json` (`backend/elementos.py`, rotas `/api/elementos`,
  `/api/elementos/padrao`), desenho em `cartografia/elementos_desenho.py`, painel
  ELEMENTOS com marcadores arrastáveis, tamanho, texto da cartela, latitude da escala
  e visibilidade para o jogador.
- **Barra de escala desenhada, não a peça da folha**: a peça `barra-de-escala-01` tem
  divisões fixas e não calibra. A barra nova arredonda para 1, 2 ou 5 x 10^n km,
  tem 4 divisões e escreve "escala verdadeira a 21,9° N". **21,87°** é a latitude
  central de Waning, medida pelas caixas das três ilhas no cache de ilha. Teste mede a
  barra desenhada em pixels e confere o número escrito; controle negativo: a 60° a
  mesma barra tem o dobro dos km por pixel.
- **Decisões minhas**: rosa a leste de Mére (36° L, 22° N), escala a sudoeste de Syl
  (14° O, 2° N), cartela entre The Neck e Calin (12° O, 44° N) com "Uldun"
  (provisório, como o nome do mundo), monstro no ponto de mar mais longe de terra
  (25,2° O, 33,5° N, calculado). Tudo em mar aberto (teste confere contra a costa).
- Imagem: `render/teste-elementos-mundo.png` (mundo a 1/8, elementos de teste não
  gravados).
- **Depende do teste do usuário**: arrastar os marcadores e o painel.

### B3 · exportação parcial (feita)

- **Pronto**: `cartografia/exportar.py`, `scripts/exportar.py` (linha de comando),
  `POST /api/exportar` (roda o script num PROCESSO SEPARADO, para a memória do
  servidor não crescer), `GET /api/exportacoes` e o painel EXPORTAR.
  - recorte por região (caixa das ilhas dela e das filhas, pelo cache de ilha, +6%)
    ou por retângulo desenhado no mapa;
  - camadas: relevo, cobertura, rios, estradas, rotas, nomes, cidades, grade,
    moldura, elementos;
  - versões mestre e jogador (`visivel_jogador: false` some, com o nome);
  - PNG na largura pedida, ou PDF A4/A3 (deitado ou em pé pelo recorte), com moldura
    de atlas (faixa alternada e graus escritos) e, nos cantos, rosa, escala calibrada
    na latitude central do RECORTE (com a latitude escrita) e cartela com o título;
  - registro em `dados/exportacoes.jsonl`: quando, arquivo, recorte, camadas, versão,
    destinatário, distorção, resolução, commit e impressão digital dos dados.
- **Conferido**: 13 testes (opções inválidas, recorte de Calin sem Mére, registro
  gravado, PDF em A4 deitado medido no MediaBox, limite de tamanho recusando sem
  registrar, e **jogador sem o oculto**: a imagem do jogador com um lugar oculto é
  byte a byte igual à de um mapa sem esse lugar; controle negativo, a do mestre é
  diferente). Por HTTP: opção inválida dá 422; Calin a 800 px em 7 s; o arquivo é
  servido, e pedir `dados/regioes.json` pelo mesmo caminho dá 404.
- **Decisões minhas**: limite de 60 Mpx por exportação (acima, recusa e manda para o
  script); margem de 6% no recorte de região; moldura com 3,5% do lado; PDF a 300 dpi
  por padrão com 10 mm de margem; arquivos em `render/exportacoes/` (fora do git) e o
  registro em `dados/` (dado do mestre). **`dados/exportacoes.jsonl` NÃO foi
  commitado**: ele tem uma linha do meu teste por HTTP (destinatário
  "teste-do-cartografo"), e é arquivo de uso, que nasce na primeira exportação.
- Imagem: `render/exportacoes/teste-calin.png` (e `teste-calin-a4.pdf`).
- **Depende do teste do usuário**: o painel EXPORTAR na tela (desenhar retângulo,
  marcar camadas, baixar o arquivo pelo link).

### B4 · rotas de comércio (feita)

- **Pronto**: `dados/rotas.json` (`backend/rotas.py`, rotas `/api/rotas`), desenho em
  `cartografia/rotas_desenho.py`, ferramenta na tela (tecla **O**, painel ROTAS DE
  COMÉRCIO com o formulário de todos os campos, um botão por trecho para trocar
  curvo/reto, "vértices" para mover os pontos de controle).
  - traçado guardado como PONTOS DE CONTROLE + tipo por trecho (`reto`/`curvo`); o
    curvo é Catmull-Rom passando pelos pontos; a `geometry` gravada é o traçado já
    interpolado, recalculado a cada gravação;
  - terrestre e fluvial não cruzam mar (regra da estrada, por segmento do traçado
    interpolado); marítima cruza;
  - campos: nome, mercadorias, sentido (ida/volta/ambos), risco (baixo/médio/alto),
    sazonalidade, quem controla, observações, visível ao jogador, travado;
  - distância no globo (haversine) e dias por transporte, calculados e NÃO gravados;
  - pontas grudam num lugar a menos de 5 km (o meio não gruda);
  - estilo: terrestre pontilhado vermelho-terra, marítima traço-ponto, fluvial
    pontilhado azul; o nome acompanha a curva pela camada de nomes.
- **Conferido**: 14 testes (interpolação passa pelos pontos, trecho curvo sai da reta
  como controle negativo, terrestre no mar recusada e a MESMA linha marítima aceita,
  sete recusas sem gravar, medidas no globo com o grau de longitude a 60° valendo
  metade, edição de trecho e ponto, trava, desfazer, e o nome da rota nos nomes).
- **Defeito achado e consertado**: o tracejado da estrada e o traço-ponto da rota
  somavam passos, e quando o passo ficou menor que a precisão do número o laço nunca
  terminava (a primeira exportação de Mére com estradas de exemplo rodou 10 minutos e
  foi morta). Viraram contagem por índice inteiro de período, com teste do caso.
- **Dados de exemplo** (`scripts/exemplos_parte_b.py`, apaga com `--apagar`; ids em
  `render/analise/exemplos-parte-b.json`): 9 lugares com nome provisório (um oculto
  do jogador), nomes nos 5 lugares antigos, 5 rios (descendo pela distância até o
  mar), 5 vias (caminho por terra numa grade reduzida), 3 rotas (uma oculta), 5 nomes
  livres (2 cordilheiras e 3 mares) e os 4 elementos padrão. **Nada disso foi
  commitado** (`lugares.geojson`, `rios.json`, `estradas.json`, `rotas.json`,
  `nomes.json`, `elementos.json`), como os exemplos de antes.
- **Decisões minhas**: velocidades de navio (120 km/dia mercante, 80 galera) e barco
  (60 rio abaixo, 25 rio acima); fluvial com a regra da terra e sem exigir rio
  desenhado; sem cadeado de CAMADA para rotas (só por objeto), porque acrescentar
  mexeria em `camadas_travadas.json`.
- **O que ficou feio**: rio fino e da cor do mar lê pouco no recorte; nome de região
  cai por cima de nome de lugar (MÉRE sobre "Oásis de Sal"): não há desvio de
  colisão, só arrastar o rótulo.
- Imagem: `render/exportacoes/teste-mere-mestre.png`.
- **Depende do teste do usuário**: desenhar rota, o formulário, os botões de trecho,
  "vértices" da rota.

### B5 · mapas distorcidos (feita)

- **Pronto**: `cartografia/distorcao.py`, ligado à composição e à exportação
  (`--distorcao N --mercador "..."`, ou no painel EXPORTAR), e
  `scripts/comparar_niveis.py` (os cinco níveis do mesmo recorte e uma folha lado a
  lado). A distorção trabalha numa CÓPIA dos dados; o arquivo verdadeiro não muda.
- O que piora conforme o nível cai (força k de 0 no nível 5 a 1 no nível 1): costa
  deformada e distâncias erradas (campo de deslocamento suave em duas escalas, até
  ~630 km no nível 1), lugares deslocados, lugares faltando, nomes trocados e escritos
  errado, rios, vias e rotas simplificados e desviados, nomes de região ausentes, uma
  ilha pequena apagada e uma ou duas ilhas inventadas com nome inventado, até 60% menos
  símbolos, papel amarelado, manchas, dobras e cantos escuros.
- **Semente**: mercador + recorte (o nível NÃO entra: o mesmo mercador erra na mesma
  direção, mais ou menos). O mestre recebe `<arquivo>.mentiras.json` ao lado da
  imagem, com o que o mapa mentiu DENTRO do recorte, e o registro de exportações
  aponta para ele.
- **Conferido**: 6 testes. O dado não muda (hash de todos os arquivos de `dados/`
  antes e depois, e a cópia em memória igual); mesma semente, mesma imagem, e outro
  mercador, outra (controle negativo); nível 5 igual ao mapa sem distorção, e nível 4
  diferente (controle negativo); as mentiras crescem com o nível; o campo é suave,
  determinístico e zero com força zero; nome escrito errado sempre muda.
- **Imagens**: `render/exportacoes/niveis-calin-comparacao.png` (5 a 1, Velho Tobias,
  versão do jogador) e cada nível em `niveis-calin-<n>.png` com o `.mentiras.json`;
  também `teste-mere-nivel1.png` e `teste-mere-nivel3.png`.
- **Decisões minhas**: todos os números da lista acima; o título da cartela não é
  distorcido (é o que o mercador escreveu); a grade e a moldura também não (são do
  papel).
- **Depende do teste do usuário**: se o nível 2 e o 3 "leem" como mapa ruim mas
  usável na mesa, que é o uso.

### C1 · mapa de teste do mundo inteiro (feita)

- **Onde ver**: `render/mundo-1.png` (10.956 x 10.956 px: o mundo na resolução
  oficial, 1,25 km/px, mais a moldura) e `render/mundo-1-metade.png`; a prévia a 1/4
  em `render/mundo-4.png`. Relatório de cada um em `render/mundo-<fator>-relatorio.json`.
- **Tem tudo o que existe**: cor, relevo, vegetação, lagos, rios, estradas, rotas,
  cidades, nomes (regiões, lugares, rios, rotas, cordilheiras, mares), rosa, escala
  (21,9° N), cartela ("Uldun"), monstro, grade e moldura com os graus.
- **Em blocos** (10 blocos de 1.024 linhas), **medido**: 150 s no total (51 s de
  planejamento dos símbolos, 81 s de composição), pico do processo **1.124 MB**, com
  2,5 GB livres antes e o servidor parado.
- **Prova de que a costura não aparece**: `scripts/mapa_do_mundo.py` redesenha, como
  bloco único, uma faixa de 3.072 x 520 px que atravessa a junção y = 5.120 (no meio de
  Waning) e compara com a mesma faixa do mapa juntado: **igual byte a byte**. O teste
  `test_blocos_sem_costura` prova o mesmo em Mére com blocos de 37 linhas, e o controle
  negativo (sem folga) mostra a costura.
- **Defeito achado na primeira tentativa, consertado**: na resolução oficial, a terra
  do bloco que começa em y = 7.168 saía com uma linha a mais (arredondamento de
  7.650,000000001 para cima), e o mapa quebrou no bloco 8. Tolerância no
  arredondamento e teste com os três casos, inclusive esse.
- **O que ficou feio no mapa do mundo**: a maior parte da terra está sem pintura (é
  papel liso) porque só as áreas de exemplo foram pintadas; rios de exemplo curtos e
  finos; nome de região às vezes sobre nome de lugar.

### C2 · mapa de jogador e distorcido de nível 2 (feita)

- `render/exportacoes/c2-mere-jogador.png` (versão do jogador: sem a "Torre
  Esquecida" nem a rota dos contrabandistas, que estão ocultas), o mesmo em PDF A4
  (`c2-mere-jogador-a4.pdf`), e `c2-mere-jogador-nivel2.png` (mercador "Velho Tobias")
  com `c2-mere-jogador-nivel2.mentiras.json`. Lado a lado:
  `render/exportacoes/c2-mere-comparacao.png`. Os três estão no registro
  `dados/exportacoes.jsonl`.
- O nível 2 mentiu, em Mére: deslocamento máximo de 474 km, 4 lugares deslocados (até
  218 km), 4 faltando, 2 nomes trocados ("Três Rios" aparece como "Vila Úmida"), nomes
  escritos errado, vias simplificadas e 45% dos símbolos a menos.

### C3 · RUNBOOK (feita)

- `RUNBOOK.md`: do clone ao mapa final, em 10 passos, com o que o git traz e o que
  não traz (copiar à mão: `fonte/` e `referencias/`; regerar: tiles, símbolos, cache
  de ilha, `render/`), cada comando, e tempo e memória. **Os números marcados
  "medido" foram medidos nesta empreitada; os outros são estimativa e estão
  escritos assim** (não rodei de novo o recorte de símbolos nem a medição de
  legibilidade porque reescreveriam arquivo do git sem necessidade).
- Uma tabela de "se algo falhar" no fim.

### C4 · fechamento (feita) e C5 · servidor (parado)

O servidor está **parado** (nenhum processo escutando em 8420). Para subir:

    cd lore/mapas/ferramentas
    .venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420

e abrir `http://127.0.0.1:8420/` com **Ctrl+F5** (o navegador guarda os `.js` antigos).

## FECHAMENTO

### Tudo o que foi feito, com os commits (todos sem push)

`93533f8` relatório aberto · `8f18663` relevo manda sobre cobertura e geleira mais rala
· `c37e34f` cache de identidade de ilha e regra dos 100 km · `a7e2b6c` braço de delta
na tela · `eb0ef43` camada de nomes, tipografia e composição sem costura ·
`f495257` rosa, escala calibrada, cartela e monstro · `4355f27` exportação parcial ·
`6cf51dd` rotas de comércio e dados de exemplo da Parte B · `ece7a9c` mapas
distorcidos · `edbb119` mapa do mundo em blocos · `12e02b3` RUNBOOK · e o deste
fechamento. Da rodada anterior, na mesma noite: `37c7571`, `4dd2d20`, `e172ce4`,
`6b1d9c3`, `4336c16`, `ac02fc3`, `dd086fc`. **380 testes verdes** na última rodada
completa.

### Onde olhar primeiro

1. `render/mundo-1-metade.png` (o mundo inteiro, com tudo; o de tamanho cheio é
   `render/mundo-1.png`).
2. `render/exportacoes/c2-mere-comparacao.png` (Mére para o jogador, fiel e nível 2).
3. `render/exportacoes/niveis-calin-comparacao.png` (os cinco níveis de distorção).
4. `render/exportacoes/teste-calin.png` e `teste-calin-a4.pdf` (exportação com
   moldura, rosa, escala e cartela).

### O que ficou por fazer, e por quê

- **Folhas de símbolos** (fora do escopo): a palmeira precisa de folha nova (o piso
  come 70% da faixa dela); o "bosque" (símbolo de floresta pequena) seria folha nova;
  a colina lê fraco na prévia (arte clara). Tudo em `FOLHAS-A-REGENERAR.md` e
  "Decisões em aberto".
- **PSD de montagem** e **nomes definitivos** (fora do escopo, do usuário). Os nomes
  dos exemplos são provisórios e marcados.
- **Desvio automático de colisão** entre nomes (nome de região por cima de nome de
  lugar): não feito; hoje se arrasta o rótulo.
- **Largura do rio por afluentes acumulados** (ESPEC): não feito; o rio engrossa da
  nascente para a foz.
- **Cadeado de CAMADA para regiões, nomes, elementos e rotas**: não feito (só trava
  por objeto), porque mexeria em `camadas_travadas.json`.
- **Atração do início do braço de delta contra o rio-mãe**, **via desalinhada**, e a
  **medição Neck ↔ Calin** refeita com o cache: continuam na lista de pendências.
- **Dados de exemplo NÃO commitados** (de propósito, como os anteriores):
  `areas-pintadas.geojson`, `lugares.geojson`, `rios.json`, `estradas.json`,
  `rotas.json`, `nomes.json`, `elementos.json`, `exportacoes.jsonl`. Para apagar os
  da Parte B: `scripts/exemplos_parte_b.py --apagar` com o servidor no ar.

### O que SÓ o teste do usuário cobre (nada disto foi clicado com mouse de verdade)

Da tela (abrir com Ctrl+F5):
1. **REGIÕES**: criar, editar, apagar, arrastar o nome, "pôr rótulo", trocar a
   região de uma massa, e **"identificar ilha"** com um clique e "registrar".
2. **NOMES**: arrastar um nome de lugar, trocar o nível, "reto", "jogador", desenhar
   a "curva" à mão, criar um nome livre (e um de cordilheira, escolhendo a área).
3. **ELEMENTOS**: arrastar os quatro marcadores, mudar tamanho, título e latitude.
4. **EXPORTAR**: escolher região, desenhar retângulo, marcar camadas, versão, PNG e
   PDF, destinatário, distorção e mercador, e baixar pelo link.
5. **ROTAS** (tecla O): desenhar, preencher o formulário, trocar trechos, mover
   pontos de controle ("vértices"), travar com T.
6. **Rio**: o campo "braço de delta de".
7. **Vértices** (V) e **pincel** (P), da rodada anterior.
8. As ferramentas antigas ainda pendentes: Rio e Estrada pelo clique, `T` em cada
   seleção, desfazer/refazer, tecla C.
Das imagens:
9. se o mapa do mundo e as exportações leem como mapa de atlas; tamanho dos nomes;
   rios (finos e pálidos); estilo das rotas; a moldura;
10. se os níveis 2 e 3 de distorção servem na mesa (ruins mas usáveis);
11. relevo sobre cobertura (norte de Mére) e a geleira mais rala.

### Decisões que tomei e que o usuário deveria revisar (as mais importantes primeiro)

1. **A composição nova planeja os símbolos por área** (e não por janela): o mesmo
   mapa em qualquer recorte. Mudou a arquitetura do desenho final; o renderizador
   antigo continua para as prévias por região.
2. **Distorção**: o que piora e quanto (números em `cartografia/distorcao.py`), a
   semente sem o nível, e o título da cartela nunca distorcido.
3. **Versão do jogador** por `visivel_jogador` em lugar, região, rota, nome e
   elemento (campo novo no esquema).
4. **Rotas**: velocidades de navio e barco; fluvial com a regra da terra; pontas
   grudam, meio não; estilo pontilhado e traço-ponto.
5. **Nomes**: fontes, tamanhos por nível, maiúsculas espaçadas para região e
   cordilheira, curva só em forma alongada e pouco inclinada (Mére sai reta).
6. **Barra de escala** desenhada (não a peça da folha), calibrada a 21,87° N no mundo
   e na latitude central de cada recorte.
7. **Regra dos 100 km** automática só com UMA região candidata; Mére e Syl estão a
   menos de 100 km uma da outra.
8. **Relevo manda sobre cobertura** e a geleira com o dobro do espaçamento.
9. Limite de 60 Mpx para exportar pela tela; exportação em processo separado.
10. **Achado para decidir**: `ilha-192` e `ilha-204` de `massas.geojson` são pedaços
    de Syl e de Mére (não mexi).

### Roteiro de teste para o usuário (uns 30 minutos)

1. Olhar as quatro imagens de "Onde olhar primeiro".
2. Subir o servidor (comando acima), abrir com Ctrl+F5, F12 aberto: nenhum erro.
3. REGIÕES → "identificar ilha" → clicar numa ilhota perto de Calin → "registrar em
   calin" → Ctrl+Z (tem de sumir).
4. NOMES → arrastar "Porto das Brumas" → trocar para nível 5 → exportar Mére e ver o
   nome maior no lugar novo → Ctrl+Z duas vezes.
5. ROTAS (O) → desenhar uma rota marítima entre dois portos → ver km e dias no painel
   → trocar um trecho para reto → ver o traçado mudar → apagar.
6. EXPORTAR → região Calin, versão jogador, PDF A4, para "teste" → abrir o PDF pelo
   link → conferir a barra de escala e a latitude escrita.
7. EXPORTAR → a mesma, distorção 2, mercador "A", e depois mercador "B": dois mapas
   ruins diferentes; abrir os `.mentiras.json` em `render/exportacoes/`.
8. Rodar `scripts/exemplos_parte_b.py --apagar` quando quiser o mapa limpo para
   pintar à mão.
