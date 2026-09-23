# Relatório da noite 2 (2026-09-23)

Trabalho autônomo do Cartógrafo enquanto o usuário dorme. Atualizado a cada etapa
concluída ou abandonada, ANTES de começar a próxima: se a energia cair, é por aqui
que se sabe o que existe. Tudo o que está marcado como decisão aqui é
**recomendação do Cartógrafo**, e não decisão do Direcionamento.

## Etapa 0 · Preparação (concluída)

- **Git**: `core.hooksPath = scripts/hooks`, certo (linha nova em `registro-git.jsonl`).
- **Pilha de desfazer/refazer limpa**: `dados/.operacoes/log.jsonl` e `cursor.json`
  foram MOVIDOS (não apagados) para `dados/.operacoes/arquivado-2026-09-23-noite2/`.
  `/api/pilha` responde `cursor 0, total 0`. Recomendação: guardar em vez de apagar,
  porque o log é o único registro das operações de ontem.
- **Estado dos dados conferido**: 0 vias, 0 rios, 0 áreas, e as 5 localidades de
  exemplo (`exemplo-mere`, `exemplo-syl`, `exemplo-calin`, `exemplo-the-neck`,
  `exemplo-white-wall`, todas com `exemplo: true`).
- **Achado, sem conclusão sobre quem fez**: `dados/camadas_travadas.json` está com
  a camada `rios` TRAVADA, diferente do commit. Não mexi.
- **A etapa 9 (Estrada) continua sem commit**, porque espera o seu teste. Decisão
  para esta noite: o trabalho novo vai em ARQUIVOS NOVOS (scripts e módulos), sem
  tocar `backend/main.py` nem os JS da tela, que têm edição da etapa 9 não
  commitada; `git commit -- caminho` leva o arquivo inteiro e misturaria as duas
  etapas. Pelo mesmo motivo, `CARTOGRAFO.md` e os ESPEC (que já têm o registro da
  etapa 9) são atualizados, mas **não commitados** esta noite.
- **Memória**: 6,2 GB livres de 15,9 GB no início.
- **Servidor**: no ar em `http://127.0.0.1:8420/`.

## Etapa 1 · Guardar as folhas (concluída) · commit `ed53eb2`

- **Eram 9 folhas, não 6**, e todas renomeadas pelo que mostram:
  `folha-montanhas.png`, `folha-montanhas-fundo-transparente.png` (a mesma folha de
  montanhas com o fundo tirado pelo próprio ChatGPT: RGBA, 59% do quadro
  transparente), `folha-arvores.png`, `folha-colinas.png`,
  `folha-vegetacao-quente.png`, `folha-assentamentos.png`,
  `folha-terreno-gelado.png`, `folha-terreno-seco.png`, `folha-cartografia.png`.
- **Íntegras e no git**: as 9 abrem inteiras (1254 × 1254), e o sha256 de cada blob
  no commit é igual ao do arquivo no disco.
- **A grade é 4 colunas por 3 linhas**, e não 3 por 4 (dá as mesmas 12 peças).

## Etapa 2 · Recortar a biblioteca (concluída) · commit `60fa358`

- **90 símbolos**: 12 por folha em grade e 6 na de cartografia. Tipos e quantidades:
  montanha 12, colina 12, árvore folhosa 7, conífera 5, palmeira 2, árvore tropical
  2, selva 4, pântano 4, cidade 2, vila 2, fortaleza 2, porto 2, ruína 2, marco 2
  (torre e obelisco), montanha nevada 4, geleira 4, tundra 4, duna 4, rochedo 4,
  vegetação seca 4, rosa dos ventos 2, barra de escala 1, cartela 2, monstro
  marinho 1.
- **Onde ver**: `render/analise/folha-de-contato.png`. Cada símbolo aparece nos dois
  modos sobre uma cor de papel provisória; o modo padrão tem moldura azul e a âncora
  de base é a cruz vermelha.
- **Arquivos**: `simbolos/<tipo>/<modo>/<tipo>-NN.png` (fora do git), manifesto em
  `dados/simbolos.json`. Regerar: `cd lore/mapas/ferramentas &&
  .venv/Scripts/python.exe scripts/recortar_simbolos.py` (uns 30 s).
- **Controles negativos, todos em `tests/test_simbolos.py`** (14 testes): contagem
  por folha; nenhuma peça na borda; folha em branco, célula vazia e célula só com
  sujeira recusadas; peça encostando na borda recusada; duas peças grudadas
  recusadas; o mesmo pixel branco do miolo de um anel transparente num modo e opaco
  no outro; âncora de árvore no pé do tronco; âncora que ignora pedrinha solta.
- **Decisões minhas (recomendações)**:
  1. **Caminho de saída com o modo no meio** (`simbolos/<tipo>/<modo>/...`), e não
     `simbolos/<tipo>/<tipo>-01.png`: são dois arquivos por símbolo. O campo
     `arquivo` do manifesto aponta para o modo padrão; trocar o modo é trocar
     `modo_padrao` e `arquivo`, sem recortar de novo.
  2. **Tundra, palmeira e árvore tropical em "só traço"**: não estavam em nenhuma das
     duas listas do pedido.
  3. **Espelhamento**: NÃO espelham montanha, montanha nevada, colina, rochedo, duna
     e geleira. As gravuras têm luz da esquerda e sombra hachurada à direita, e
     espelhar põe a sombra do lado errado ao lado das vizinhas. Também não espelham
     rosa dos ventos, barra de escala e cartela, porque têm orientação. O resto
     espelha.
  4. **Âncora**: centro horizontal da caixa; linha onde a tinta acumulada de baixo
     para cima passa de 0,2%. A primeira versão, pela largura da linha, pôs a âncora
     da árvore tropical no pé da COPA; a segunda, com 1%, comia um tronco fino inteiro
     (os dois achados pelos testes).
  5. **A folha de fundo transparente não é recortada** (daria 12 montanhas
     repetidas); fica como referência.
  6. **Grupo por célula**: um símbolo é a soma dos componentes cujo centro cai na
     célula. É o que junta a hachura solta do chão, as marolas do pântano e as
     pedrinhas da tundra numa peça só.
- **As folhas servem ao propósito?** Servem: o estilo é coerente entre as 8 (gravura,
  luz da esquerda, mesmo peso de traço), o fundo é limpo, nenhuma peça encosta em
  outra nem na borda, e o recorte passou em todas. **O que eu regeneraria, em ordem
  de impacto**:
  1. **Montanha nevada: só 4**, contra 12 montanhas comuns. Uma cordilheira nevada
     vai repetir o mesmo desenho a cada 4 picos. Pedir mais 8, de preferência na
     silhueta das montanhas comuns.
  2. **Palmeira e árvore tropical: 2 de cada.** Mesma repetição numa floresta
     tropical.
  3. **Árvores: 7 folhosas e 5 coníferas**, e não 6 e 6. Uma floresta de coníferas
     tem só 5 desenhos.
  4. **"Vegetação seca" mistura quatro coisas diferentes**: arbusto seco, árvore
     morta, cacto e um CHÃO rachado. O chão rachado não é objeto, é textura; espalhado
     como símbolo, ele vai parecer um remendo. Recomendo tratá-lo à parte (textura de
     deserto) e pedir mais arbustos.
  5. Duna e rochedo têm 4 cada, o que basta para mancha pequena.

## Etapa 3 · Teste de redução (concluída) · commit `6081ba6`

- **Onde ver**: `render/analise/reducao/reducao-<tipo>.png`, uma tira por tipo, com
  todos os símbolos do tipo em 200, 100, 60 e 35 px (maior lado), apoiados pela base,
  em pixel real. Regerar: `.venv/Scripts/python.exe scripts/tiras_de_reducao.py`.
- **Onde cada tipo deixa de ser legível** (julgado a olho, recomendação minha; está
  em `cartografia/reducao.py`, `TAMANHO_MINIMO_LEGIVEL`, e o renderizador usa como
  piso):

  | legível até | tipos | o que acontece abaixo disso |
  |---|---|---|
  | **35 px** | árvore folhosa, conífera, palmeira, árvore tropical, selva, montanha, montanha nevada, colina, duna, rochedo, marco, fortaleza, cidade | a silhueta ainda se lê em 35; o miolo (folhas, hachura) já sumiu |
  | **60 px** | vila, porto, ruína, geleira, pântano, vegetação seca, monstro marinho | em 35 viram mancha: o barco do porto some, a vila vira três telhados, a geleira vira um borrão branco, o pântano vira um tufo |
  | **100 px** | tundra, rosa dos ventos | a tundra não se lê nem em 60 (pedrinha e mato soltos viram ruído): é mais TEXTURA do que símbolo |
  | **200 px** | barra de escala, cartela | peças de moldura; a barra em 200 px de largura tem 17 px de altura |

- **Achados que mudam o mapa**:
  1. **Colina e duna são claras demais**: em 35 px sobram poucas linhas de hachura, e
     sobre o papel elas quase somem. Legíveis, mas apagadas perto de montanha e árvore.
  2. **A cidade em 35 px ainda se distingue da vila em 35 px**, pelas torres; mas a
     vila precisa de 60.
  3. **Tundra e o "chão rachado" da vegetação seca** pedem textura, e não símbolo
     espalhado.
- **Testes**: `tests/test_reducao.py`, 5 testes; o controle negativo é o símbolo
  ausente no manifesto, que tem de falhar alto e não virar tira em branco.

## Etapa 4 · Etapa 11: rasterização com ruído de borda (concluída) · commit `8300d3d`

- **O que ficou pronto**: `ferramentas/cartografia/raster.py`. Recebe uma área
  (Polygon ou MultiPolygon em lon/lat, com buracos), a `semente_ruido` dela e uma
  JANELA do mundo (lon/lat e pixels por grau), e devolve a máscara com a borda
  irregular. Recorta pela costa se receber a máscara de terra.
- **Onde ver**: `render/analise/borda-ruido.png` (a mesma área reta, com a semente
  8821 e com a 4242).
- **Como**: polígono reto, borrão gaussiano na largura da irregularidade, soma de
  um ruído de valor de duas oitavas e corte em 0,5. **O ruído é ancorado no mundo**:
  cada nó da grade é um hash inteiro de (semente, nó, oitava), então a borda NÃO muda
  com o enquadramento. O borrão roda numa janela com folga pelo mesmo motivo.
- **Controles** (`tests/test_raster.py`, 7 testes): a mesma área duas vezes dá o
  mesmo PNG byte a byte; sementes diferentes dão bordas diferentes (mais de 500
  pixels mudam); o ruído muda a borda (controle contra um ruído que não faz nada) e
  não engorda a área (±5%); longe da borda nada muda; **duas janelas sobrepostas
  batem pixel a pixel no pedaço comum**; buraco fica vazio; a costa recorta.
- **Decisões minhas (recomendações)**: amplitude de **12 km** (uns 10 px na
  resolução oficial) e ruído com grade de **40 km e 12 km**. Sem scipy (não
  instalado): o borrão é o do PIL e o ruído é numpy puro.
- **O que ficou feio**: os **cantos vivos ficam arredondados** (o borrão arredonda
  todo canto convexo antes de o ruído agir), e numa área de 500 km a irregularidade
  é discreta. Se quiser a borda mais "rasgada", o botão é `AMPLITUDE_KM`, e o
  arredondamento pede outra técnica (deslocar o contorno vetorial em vez de borrar a
  máscara).
- **Não feito nesta etapa**: rasterizar o mapa INTEIRO em alta resolução. O módulo
  aceita qualquer janela e resolução, mas nenhuma rasterização do mundo todo foi
  rodada (não fazia falta para o renderizador por região).

## Etapa 5 · Primeiro renderizador, com os símbolos de verdade (concluída) · commit `c09f4b5`

- **ONDE VER** (o que você mais queria ver):
  - `render/recorte-mere-metade.png`: Mére inteira, com a montanha no norte, o
    deserto no interior do sul e a selva no equador. É a imagem principal.
    `render/recorte-mere.png` é a mesma em resolução cheia (2725 × 4782 px, 1,25
    km/px): abra e dê zoom na cordilheira e na selva.
  - `render/recorte-calin-metade.png` (floresta temperada),
    `render/recorte-the-neck-metade.png` (coníferas),
    `render/recorte-white-wall-metade.png` (geleira), e as versões cheias.
  - Regerar: `cd lore/mapas/ferramentas && .venv/Scripts/python.exe
    scripts/renderizar_regiao.py --todas` (uns 6 min; Mére sozinha, 3 min).
- **As 6 áreas de exemplo** (criadas pela API, com o id começando por `exemplo-` para
  apagar depois; a API não aceita campo extra na área, então a marca é o id). O
  controle negativo na mesma sessão foi um valor fora do vocabulário, recusado com 422.
  | id | camada / valor | onde | semente |
  |---|---|---|---|
  | `exemplo-montanha-mere-norte` | relevo / montanha | norte de Mére, 17,5°L a 26,5°L, 29°N a 39°N ("metade norte mais montanhosa") | 1101 |
  | `exemplo-deserto-mere-sul` | cobertura / deserto | interior e oeste do sul de Mére, 12,5°L a 20°L, 15°N a 24°N ("desertos entre 15°N e 25°N") | 1102 |
  | `exemplo-selva-mere-equador` | cobertura / selva | sul de Mére, 10,5°L a 22,5°L, 1°N a 7,5°N ("florestas equatoriais") | 1103 |
  | `exemplo-floresta-temperada-calin` | cobertura / floresta-temperada | Calin, 0° a 9°L, 30,5°N a 38°N ("temperado") | 1104 |
  | `exemplo-conifera-the-neck` | cobertura / floresta-boreal | The Neck, 30,5°O a 22,5°O, 50°N a 55°N ("coníferas") | 1105 |
  | `exemplo-geleira-white-wall` | cobertura / geleira | White Wall, 35°O a 18°O, 62°N a 68°N ("gelo e neve") | 1106 |
- **O que o renderizador faz**: a máscara da área com a borda irregular (etapa 11),
  recortada pela costa; pontos por Poisson-disc com densidade por tipo; tamanho
  ±20%; espelhamento só onde o símbolo aceita; rotação leve só na vegetação; âncora
  na base; **nada no mar** (a âncora e as duas pontas da base conferidas na máscara
  oficial); desenho do norte para o sul, o que está mais ao sul na frente.
- **Controles** (`tests/test_renderizador.py`, 11 testes, mundo sintético):
  distância mínima do Poisson; máscara vazia sem ponto; manchas separadas as duas
  cobertas; **a mesma área sem terra embaixo não ganha símbolo nenhum**; nenhuma
  âncora nem ponta de base no mar; ponta da base no mar recusada; **o símbolo do sul
  fica na frente qualquer que seja a ordem da lista**; mesmos bytes duas vezes;
  semente diferente espalha diferente; valor sem símbolo (`planicie`, `campo`) não
  desenha nada.
- **Decisões minhas (recomendações)**, todas em `cartografia/renderizador.py`:
  1. **Recheio da cor da terra na silhueta de todo símbolo "só traço".** Sem ele a
     montanha da frente deixava ver as linhas da de trás pelo branco que virou
     transparente, e a cordilheira virava uma teia. Com ele a peça da frente esconde a
     de trás, e é o que faz a ordem norte-sul aparecer.
  2. **Tamanhos na resolução oficial**: montanha 80 px (100 km), montanha nevada 90,
     colina 52, árvores 38 a 40, selva 46, duna 52, rochedo 46, vegetação seca 60,
     geleira 64, tundra 100. Nenhum abaixo do mínimo legível da etapa 3.
  3. **Misturas por valor**: floresta temperada 85% folhosa e 15% conífera; floresta
     tropical 60% árvore tropical e 40% palmeira; selva 85% selva e 15% palmeira;
     deserto 70% duna, 15% rochedo, 15% vegetação seca. **O chão rachado
     (`vegetacao-seca-04`) fica fora do sorteio** (é textura).
  4. **Rotação só na vegetação** (2° a 4°): girar montanha, duna ou geleira entorta o
     horizonte do desenho.
  5. **A mancha de símbolos usa uma borda mais irregular que a da etapa 11**: 90 km de
     amplitude e ondas de 220, 70 e 20 km. Com os 12 km da etapa 11, menos que o
     tamanho de uma árvore, a fileira de símbolos da beira desenhava a reta do
     polígono; com 40 km ainda desenhava. Ficou melhor, e ainda não ficou bom (ver
     abaixo).
  6. **Cores provisórias**: mar (158, 182, 190), terra (233, 221, 189), costa
     (72, 62, 50) com 1 px.
- **O QUE FICOU FEIO OU ERRADO, sem maquiagem**:
  1. **A borda da mancha ainda denuncia o polígono.** No lado sul da floresta de Calin
     e no topo da selva ainda se vê a reta do desenho. O ruído na máscara ajudou, mas
     o que resolveria é afinar a densidade perto da borda (menos símbolos e menores na
     franja) em vez de só deixar a borda irregular.
  2. **O deserto parece uma GRADE de pontinhos.** Com o raio grande que as dunas
     pedem, o Poisson deixa as peças regulares demais, e sobre a terra bege não há
     nada que diga "areia" entre elas. Falta uma **cor de fundo por cobertura**
     (areia no deserto, branco na geleira, verde escuro na selva), que ficou de fora
     porque o pedido era "cor base da terra e nada mais".
  3. **A geleira no White Wall parece gelo solto sobre terra bege**: as placas brancas
     boiam em cima do papel. É o mesmo ponto 2: geleira pede o chão branco.
  4. **A cordilheira é um tapete uniforme**: montanha do mesmo tamanho em toda a
     área, sem espinha dorsal. Mapa de fantasia desenha a cordilheira com picos maiores
     no meio e menores na beira. Ideia para depois: tamanho crescendo com a distância
     da borda da área.
  5. **A selva ficou pesada**: 427 símbolos escuros colados viram uma mancha quase
     preta na redução pela metade. Raio maior ou menos símbolos resolveriam, mas é
     gosto: você decide.
  6. **Montanha pendurada no mar**: a base fica em terra, mas o corpo de uma montanha
     na costa passa por cima da água. Em mapa de fantasia é comum; se incomodar,
     basta exigir que a caixa inteira fique em terra.
  7. **O tempo**: Mére leva 3 minutos, quase tudo no borrão grande da borda da
     mancha. Para o mapa inteiro vai precisar de outro caminho (borrar numa resolução
     menor e ampliar).
- **Mexi em arquivo de etapa já commitada**: `cartografia/raster.py` (etapa 11,
  commit `8300d3d`) ganhou o parâmetro `oitavas`, com o padrão igual ao de antes. A
  mudança é mínima e os 7 testes da etapa 11 continuam passando.
- **As áreas de exemplo NÃO foram commitadas** (`dados/areas-pintadas.geojson`), do
  mesmo jeito que as localidades de exemplo: são para apagar.

## Etapa 6 · Se sobrasse tempo (10, 12 e edição de vértice)

- **Etapa 10 (regiões): NÃO feita, de propósito.** O painel de regiões do ESPEC
  depende do cache de identidade de ilha ("atribuição manual e a regra dos 100 km"
  sobre as ilhas), e o cache foi proibido esta noite. Fazer o painel sem ele seria
  construir em cima do que ainda não existe.
- **Etapa 12 (lagos): feita na parte do MAPA DESENHADO** · commit `b841341`. A
  ferramenta de desenhar lago na tela já existia (camada `lago` da ferramenta de Área);
  o que faltava era o lago virar água no renderizador. Agora vira: borda da etapa 11,
  recortado pela costa, pintado da cor da água com margem, e nenhum símbolo apoia a base
  dentro dele. 4 testes, com o controle de que, sem o lago, o mesmo miolo recebe âncora.
  **Criei um 7º exemplo para mostrar**: `exemplo-lago-mere-norte` (lago, 21,6°L a
  24,2°L, 32,3°N a 34,6°N, semente 1107), no meio da cordilheira de Mére. Aparece em
  `render/recorte-mere.png`. **O que ficou feio**: com os 12 km da etapa 11, a
  margem do lago ainda mostra o polígono de 5 lados.
- **Editar vértice de área e de rio: NÃO feita.** Mexe em `static/js/areas.js` e
  `static/js/rios.js`, que carregam edição NÃO commitada da etapa 9 (a seleção
  exclusiva e o filtro do `pm:create`). Commitar a edição de vértice levaria junto a
  etapa 9, que ainda espera o seu teste. Fica para depois do commit da etapa 9.

## FECHAMENTO

### Concluído, com os commits (todos sem push)

| etapa | commit |
|---|---|
| 1 · as folhas de símbolos no git, renomeadas | `ed53eb2` |
| 2 · recorte da biblioteca (90 símbolos, manifesto) | `60fa358` |
| 3 · tiras de redução e mínimo legível por tipo | `6081ba6` |
| 4 · etapa 11: rasterização com ruído de borda | `8300d3d` |
| 5 · primeiro renderizador com os símbolos | `c09f4b5` |
| 6 · etapa 12 no renderizador: lago vira água | `b841341` |
| este relatório | commit próprio, o último da noite |

Testes: **213 no total, todos verdes** (eram 172 no começo da noite).

### O servidor

No ar em `http://127.0.0.1:8420/`, subido pela sessão da tarde; **cai quando a sessão
fechar**. Para subir de novo:

```
cd lore/mapas/ferramentas
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
```

### As imagens para olhar de manhã

1. `render/recorte-mere-metade.png`: **a principal**. Depois a cheia,
   `render/recorte-mere.png`, com zoom na cordilheira, no lago e na selva.
2. `render/recorte-calin-metade.png`, `render/recorte-the-neck-metade.png` e
   `render/recorte-white-wall-metade.png`.
3. `render/analise/folha-de-contato.png`: os 90 símbolos, nos dois modos.
4. `render/analise/reducao/reducao-<tipo>.png`: uma tira por tipo.
5. `render/analise/borda-ruido.png`: a borda reta e com duas sementes.

### Roteiro de teste para a manhã (o que clicar e o que ver)

1. **Abrir** `http://127.0.0.1:8420/`. Tem de aparecer a seção ESTRADAS dizendo
   "nenhuma via ainda", as 5 localidades de exemplo no mapa, e **7 áreas de exemplo**
   pintadas: montanha, deserto, selva e lago em Mére, floresta temperada em Calin,
   coníferas em The Neck e geleira no White Wall. F12 sem erro.
2. **Desfazer está armado com as 7 áreas de exemplo** (a pilha foi limpa no começo da
   noite, então as localidades de exemplo NÃO se desfazem mais; as áreas, sim: são as
   7 operações da pilha). Ctrl+Z sete vezes apaga as áreas de exemplo, se quiser.
3. **Rio** (pendente da etapa 8): botão "+ rio" ou `I`, clicar da nascente até o
   mar, duplo clique. **Atenção**: a camada `rios` está TRAVADA em
   `dados/camadas_travadas.json` (achado no começo da noite, não mexi); destrave no
   botão "rios travados" antes, ou o desenho será recusado.
4. **Estrada** (etapa 9): `E`, clicar em cima de uma localidade de exemplo e depois
   terra adentro, duplo clique. Tem de aparecer a via, o halo rosa na localidade, a
   linha tracejada com os km e o aviso "atração: ... grudaram".
5. **Um desenho, uma gravação**: desenhar via não cria rio, e rio não cria via.
6. **`T`** com cada seleção (via, rio, área, localidade) trava o objeto certo.
7. Olhar as imagens da lista acima.

### Decisões que precisam de você

1. **As folhas a regenerar** (etapa 2): mais montanhas nevadas (só 4), mais palmeiras
   e árvores tropicais (2 de cada), coníferas (5), e o que fazer com o "chão rachado"
   da vegetação seca (tirei do sorteio: é textura).
2. **Cor de fundo por cobertura** (areia no deserto, branco na geleira, verde na
   selva): é o que mais falta no mapa, e ficou de fora porque o pedido era "cor base
   da terra e nada mais". Libera?
3. **Espelhamento**: travei em relevo (montanha, colina, duna, rochedo, geleira) por
   causa da sombra à direita. Concorda?
4. **Modo padrão** de tundra, palmeira e árvore tropical: deixei "só traço".
5. **A borda da mancha de símbolos**: ruído maior (90 km) ou afinar a densidade na
   franja? O segundo resolve melhor a reta do polígono.
6. **Cordilheira com espinha** (picos maiores no meio da área) e **selva mais
   leve**: gosto seu.
7. **Tamanho mínimo legível por tipo** (etapa 3): foi julgado a olho por mim.
8. **Montanha com o corpo sobre a água** na costa: deixo, ou exijo a caixa inteira
   em terra?
9. **Commit da etapa 9 (Estrada)**, depois do seu teste. Ela destrava a edição de
   vértice, que ficou parada por isso.

### O que falhou, e por quê

- **Nada falhou duas vezes.** Três coisas precisaram de segunda tentativa: a âncora da
  árvore (a regra por largura pegava a copa; com 1% comia o tronco; ficou em 0,2%), a
  borda da mancha de símbolos (12 km e 40 km deixavam a reta; ficou em 90 km com ondas
  longas, melhor mas não resolvido), e a rotulagem da folha de contato (a fonte
  embutida não tinha "ã"; troquei pela Arial).
- **Não feitas**: etapa 10 (depende do cache, proibido); editar vértice (esbarra na
  etapa 9 sem commit).

### O que só o seu teste cobre

Da tela (nada disso eu exercitei, porque clique automatizado não funciona nesta
máquina):

1. A página abre, as seções aparecem e o F12 fica sem erro.
2. **Rio**: o caminho feliz por clique, pendente desde a etapa 8 (lembre de
   destravar a camada `rios`).
3. **Estrada**: o caminho feliz por clique, o halo rosa por cima do símbolo, a linha
   tracejada e o aviso de atração.
4. Um desenho, uma gravação, entre Rio e Estrada.
5. O clique em cima do marcador da localidade chegando ao desenho com a caneta da
   Estrada ligada.
6. `T` com cada tipo de seleção.
7. A seção ESTRADAS com "passa por" e o ⚠ ao arrastar uma localidade usada por uma via.
8. Desfazer e refazer de via, e o cadeado das camadas.
9. A tecla `C` escondendo rios e vias.

Do mapa desenhado (é julgamento de olho, e o olho que decide é o seu): se os
símbolos, os tamanhos, as misturas e as cores servem.
