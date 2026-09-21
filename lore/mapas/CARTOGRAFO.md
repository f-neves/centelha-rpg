# Cartógrafo · documento central do mapa de Uldun

Este é o documento que toda sessão futura sobre o mapa do mundo lê antes de começar, e
atualiza quando uma decisão nova for tomada. Registra só o que foi decidido ou
confirmado pelo usuário; o que é recomendação de IA fica marcado como tal.

## Objetivo e estilo

Mapa de fantasia medieval clássico, estilo Faerûn (Forgotten Realms). Por enquanto só
geografia e cidades; fronteiras de reino podem vir no futuro, e o formato de dados
precisa aceitar isso sem refazer nada. Tudo que o usuário marcar recebe um
identificador; nome é opcional e entra depois.

## Regras invioláveis

- A costa de terra e mar é **definitiva**. Nenhuma etapa altera, cria ou apaga terra.
- Originais nunca são modificados ou sobrescritos. `fonte/Mapa.psd` só é aberto para
  leitura por automação COM e fechado sem salvar.
- Nada é instalado sem ok explícito do usuário (pacote Python, Node, etc.).
- Nenhum commit sem ok do usuário. Arte pesada nunca vai para o git.
- Antes de processamento pesado (o PSD inteiro, imagens de 10240px ou mais), avisar
  para fechar navegadores e outras sessões do Claude (máquina com 16 GB de RAM).
- Nada de inventar API: o que não estiver documentado ou testado, dizer isso
  explicitamente em vez de supor.

## Estrutura de pastas (`lore/mapas/`)

| Pasta | Conteúdo | No git? |
|---|---|---|
| `fonte/` | `Mapa.psd`, os dois SVGs de traçado da costa, `Mapa Teste.jpg` (sem rótulo, 10240px), `Mapa Teste1.jpg` (mesma imagem rotulada, 10240px) — todos intocáveis | não |
| `referencias/` | as 4 imagens do ChatGPT, `teste.png`, `teste1.png` | não |
| `historico/` | os dois `PROMPT-*.md` da abordagem anterior (IA pintando o mapa inteiro), mantidos como registro | sim |
| `mascaras/` | máscaras de controle, incluindo `costa_10240.png` (a costa oficial) | sim |
| `dados/` | JSON de lugares, rios, estradas, regiões, coordenadas | sim |
| `simbolos/` | biblioteca de símbolos gerada por IA | não |
| `render/` | saídas do gerador, incluindo `render/analise/` (prévias e conferências) | não |
| `photoshop/` | PSD de montagem final (não é o `Mapa.psd` original) | não |
| `ferramentas/` | código da ferramenta de pintura e do gerador | sim |
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
- Faixas de latitude aproximadas das regiões nomeadas (por caixa delimitadora, não
  pelo contorno exato): Mére 0,1°N–41,1°N · Syl 1,4°N–25,4°N · Calin 26,2°N–43,7°N ·
  The Neck 49,2°N–55,3°N · The White Wall até 68,8°N no topo da tela (terra segue além
  da borda).

## Decisões tomadas

### Mundo
- O mundo se chama **Uldun** (nome provisório). A tela de 10240px é a parte jogável de
  um mundo maior, como Faerûn dentro de Toril; terra cortada nas bordas continua além
  da tela.
- Nomes existentes: **The White Wall**, **The Neck**, **Waning** (arquipélago de três
  ilhas: **Calin**, **Syl**, **Mére**).
- **The Neck fica isolada de Waning por mar aberto, sem ilhas no caminho.** Intencional.
  Medido nesta sessão: a travessia mais curta entre as duas é de aproximadamente
  3.177 km em linha reta (ver `dados/` e `render/analise/rotas_distancias.png`).

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
- Ferramenta de pintura: editor em canvas no navegador, com Python gerando o mapa. Sem
  mesa digitalizadora — prioriza laço poligonal e preenchimento limitado pela costa
  (ver `historico/` para a especificação completa da Fase seguinte).
- Photoshop só para montagem final e retoques. O PSD de montagem é criado pelo próprio
  usuário, uma vez, com um passo a passo escrito pela IA, usando objetos inteligentes
  vinculados. **Nada de API não documentada** — a automação de smart object vinculado
  não tem API oficial da Adobe (achado da sessão anterior), então essa etapa é manual.

## Achados técnicos registrados (não são decisões, são fatos medidos)

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

## Decisões em aberto

- Nome definitivo do mundo (hoje "Uldun" é provisório).
- Nomes das massas de terra sem rótulo (a maioria do mapa).
- Esquema completo de dados além de `lugares.json` (cidades, rios, estradas, marcos,
  fronteiras futuras) — **recomendação da IA pendente de aprovação**, não decidido
  ainda.
- Se Calin e Syl são de fato duas ilhas separadas por um istmo estreito ou uma massa só
  na resolução de trabalho atual (na base vetorial de 10240px aparecem conectadas por
  uma faixa fina de terra; o usuário já confirmou que no Lore elas são três ilhas
  separadas — vale conferir visualmente antes de tratar como definitivo).
- Resto do mapa sem nome (grande aglomerado a sudoeste, terras a leste, ilhas nas
  bordas) — nomear conforme a campanha pedir.
