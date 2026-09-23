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
| A1 áreas de verdade | já feita na rodada anterior; reavaliada aqui | `4dd2d20`, `e172ce4` |
| A2 piso x densidade | já feita na rodada anterior | `37c7571` |
| A3 regiões + cache de ilha | feita | ver diário |
| A4 vértice de área e rio | já feita na rodada anterior | `4336c16` |
| A5 pincel | já feito na rodada anterior | `ac02fc3` |
| A6 braço de delta na tela | feita | ver diário |
| B1 camada de nomes | feita | ver diário |
| B2 elementos de cartografia | feita | ver diário |
| B3 exportação parcial | feita | ver diário |
| B4 rotas de comércio | pendente | |
| B5 mapas distorcidos | pendente | |
| C1 mapa de teste do mundo | pendente | |
| C2 mapa de jogador e distorcido | pendente | |
| C3 RUNBOOK | pendente | |
| C4 fechamento deste relatório | pendente | |
| C5 servidor parado | pendente | |

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

### B4 · rotas de comércio (começando)
