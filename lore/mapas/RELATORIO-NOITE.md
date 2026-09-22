# Relatório da rodada noturna autônoma — 2026-09-22

Trabalhei sozinho seguindo as instruções da noite (Parte A + Parte B do pedido).
Este documento é o ponto de entrada pra manhã: o que foi concluído, o que falhou,
as decisões que precisam de você, e o roteiro de teste. `CARTOGRAFO.md`, seção
"Estado atual", tem o resumo; aqui está o detalhe.

## 0. O achado que mudou a noite inteira: commit bloqueado

Antes de escrever qualquer código, testei o caminho de commit com uma mudança
trivial (a linha de data em `CARTOGRAFO.md`). `npm run validate` (rodado pelo hook
`pre-commit`) falhou:

```
resolverGolpe OK · 1315 lances no despejo · 1315 conferidos com a fonte fixa e 1315
com a rolada · 11 divergiram · 48 asserções
 · e o que não depende do dado bate nas duas fontes (11 divergências)
✘ O portão falhou, e o commit não foi feito.
```

A causa é `src/lib/rolagem.ts`/`src/lib/mesa-core.ts` sujos na árvore de trabalho —
de outra frente, não relacionados ao mapa (`git status` já mostrava os dois
modificados desde o início da sessão). `--no-verify` é proibido pelas regras do
repositório, e eu não devo mexer em arquivo de outra frente. Segui a regra da noite
("bloqueio de dependência não trava as etapas seguintes") e trabalhei o resto da
noite sabendo que **nada seria commitado**, incluindo o trabalho da tarde (Ocean
Deep + as 5 correções) que já estava pronto e aprovado por você antes da rodada
noturna começar.

**O que fazer de manhã**: ou peça pra quem estiver na frente de combate commitar o
trabalho dela (destrava tudo), ou revise `resolverGolpe`/`rolagem.ts` você mesmo, ou
aceite investigar as 11 divergências antes de qualquer commit do mapa poder subir —
o portão é do repositório inteiro, não dá pra contornar só pra esta frente.

## 1. Memória: processamento pesado ficou bloqueado a noite inteira

Chequei a memória livre antes de cada processamento pesado, como pedido. Ficou
entre **1,9 GB e 2,9 GB** a noite inteira — sempre abaixo do piso de 4 GB.
Photoshop e Chrome apareceram rodando de novo (a mensagem dizia que estavam
fechados) — não fechei nada sozinho (risco de perder trabalho não salvo no
Photoshop). Por isso:

- **`scripts/gerar_rotulos.py --confirmo` (A3) NÃO RODOU.**
- **Cache de identidade de ilha NÃO RODOU** (já não estava autorizado pra hoje,
  mas registro que também não teria rodado por memória).

Tudo que dependia disso ficou pendente — ver seção 6.

## 2. Parte A — o que foi feito

### A1. Zoom fracionário — feito

- `zoomSnap`/`zoomDelta` deixaram de ser 1 inteiro (`zoomDelta = log2(1.25)`,
  ~25% por clique nos botões próprios).
- Campo de porcentagem na barra do topo, sempre mostra o valor atual, aceita
  digitação (Enter aplica), botões `-`/`+` ao lado.
- 100% = resolução nativa (zoom 6); **800% já existia** como `MAX_ZOOM_MAPA`
  (`MAX_ZOOM + SOBRE_ZOOM` = 9, `backend/coordenadas.py`) — não precisei de número
  novo, só expor.
- Piso do zoom: `mapa.getBoundsZoom(limitesMundo)`, calculado de verdade pro
  tamanho do contêiner, não mais um `0` fixo.
- **Não testado num navegador** — só `node --check` na sintaxe.

### A2. Alinhamento automático das imagens do ChatGPT — feito, com ressalva

`scripts/alinhar_chatgpt_auto.py` (no `.venv`, Pillow+numpy, nenhuma instalação
nova). Confirmei as imagens: 1254×1254px cada, como você disse — **não é
processamento pesado**, rodou em ~5s por imagem.

Método: classifica terra/mar por cor (heurística de dominância de azul — é
heurística, não groundtruth, documentado no script), reduz a costa oficial e a
imagem pra grades pequenas (128×128 e 64×64), busca escala X/Y independentes (sem
rotação) e posição que maximizam **IoU** (interseção sobre união) das áreas de
terra.

**Achado corrigido no meio da noite**: a primeira versão pontuava só por IoU
restrita à área onde a imagem tem dado, e isso deixava o otimizador encontrar
"IoU alto" numa quina minúscula da imagem que por acaso caía dentro do mundo —
um resultado chegou a propor bounds com `norte=107°N`, quando o limite real do
mundo é 68,8°N. Corrigi exigindo que a imagem mapeada cubra pelo menos 15% da
área do mundo antes de aceitar um candidato.

Controle negativo do próprio alinhador (antes de tentar as imagens de verdade):
costa contra ela mesma deu IoU 100,0%; costa contra uma cópia girada 90° deu
23,4% — esse valor virou a base do piso (`2× o valor da rotação, mínimo 15%`).

Resultado final, todas aceitas (IoU acima do piso de 46,8%):

| Camada | IoU | bounds novo (lat/lon) |
|---|---|---|
| chatgpt-1 | 70,4% | oeste −46,05 · leste 47,25 · sul −24,17 · norte 69,65 |
| chatgpt-2 | 70,8% | (mesmo) |
| chatgpt-3 | 55,3% | (mesmo) |
| chatgpt-4 | 63,7% | (mesmo) |

**Ressalva que você precisa avaliar**: as 4 imagens convergiram pra bounds quase
idênticos, perto dos limites do mundo inteiro. Conferi visualmente as prévias
(`render/analise/alinhamento_chatgpt-N.png`, fora do git) e o formato das massas
de terra da imagem parece seguir a costa oficial nas manchas principais — não
parece um resultado degenerado (tipo "cobre tudo e pronto"), mas não é uma
confirmação forte, e não consegui validar melhor sozinho esta noite. **Veja as
prévias antes de confiar nesses bounds** — os bounds antigos ficaram salvos em
`bounds_anterior_a_20260922` em cada camada, então é reversível.

### A3. Rótulos (processamento pesado) — NÃO RODOU

Ver seção 1 (memória). `scripts/gerar_rotulos.py` continua exatamente como estava
ontem à noite: escrito, não executado. Precisa de você: fechar Photoshop/Chrome de
verdade (ou eu rodar quando a memória estiver livre) e autorizar de novo.

### A4. Teste da etapa 2 inteira — só pela API

Sem sessão de navegador automatizado esta noite (não fazia parte do escopo,
não tentei). Testei tudo por `curl` contra o servidor real (ver seção 5) e pelos
34 testes pytest. **Preciso que você teste no navegador de verdade** — é o item
mais importante do roteiro da seção 7.

## 3. Parte B — o que foi feito

### B1. Infraestrutura de gravação — feito e testado

- `backend/historico.py`: gravação atômica (tmp + `os.replace`, `newline="\n"`
  explícito — a regra de fim de linha do `CLAUDE.md` do repositório) + cópia das
  últimas 5 versões de cada arquivo em `dados/.historico/<nome-do-arquivo>/`.
- `backend/operacoes.py`: log de operações (`dados/.operacoes/log.jsonl`, uma
  linha JSON por operação: tipo, arquivo, estado antes, estado depois, timestamp)
  + cursor (`cursor.json`). Desfazer reaplica o estado_antes e recua o cursor;
  refazer reaplica o estado_depois e avança; uma operação nova depois de um
  desfazer descarta o rabo de refazer (decisão minha, não estava no ESPEC —
  comportamento padrão de editor).
- **Decisão minha, registrada**: sem limite de tamanho do log (o ESPEC cogitava
  "as últimas 50 operações", não decidido). Um log de uso solo não passa de
  poucos MB nem em semanas de uso; podar complicaria o cursor sem necessidade
  real hoje.
- **Testado de verdade "sobrevivendo a reiniciar o servidor"**: como o módulo não
  guarda nada em memória entre chamadas (lê tudo do disco toda vez), o teste
  recarrega o módulo Python (`importlib.reload`) simulando um processo novo
  apontado pra mesma pasta, e confirma que o desfazer ainda funciona.
- `.gitignore` ganhou `lore/mapas/dados/.operacoes/` e `lore/mapas/dados/.historico/`
  (conferido com `git check-ignore -v`, os dois batem).
- 14 testes pytest, todos verdes.

### B2. Ferramenta de Lugar — feito e testado

- `backend/lugares.py`: criar/mover/editar/apagar, todos em cima do B1 (cada
  operação é desfazível). Validações:
  - `tipo` fechado: `cidade`, `vila`, `fortaleza`, `porto`, `ruina`, `marco`.
  - `capital` só pode ser `true` quando `tipo == "cidade"`.
  - Ponto tem que cair em terra: leitura de `mascaras/costa_10240.png`
    (cacheada em memória, uma vez por processo — não reabre a imagem de
    10240px a cada lugar criado).
- **Achado, registrado em vez de suposto** (regra "nada de inventar API"): o
  esquema completo de `capital`/`importancia` não sobreviveu em `ESPEC-dados.md`
  além da frase "definidos na segunda rodada" — `git log -p` no arquivo não acha
  nenhum exemplo de Feature com esses campos. `capital` ficou validado como
  booleano (é o mínimo que faz a regra funcionar); `importancia` é aceito sem
  validar tipo ou faixa. **Precisa da sua decisão**: qual o tipo/faixa de
  `importancia`?
- Endpoints REST: `GET/POST /api/lugares`, `PUT /api/lugares/{id}/posicao`,
  `PUT /api/lugares/{id}`, `DELETE /api/lugares/{id}`.
- UI mínima em `static/js/lugares.js`: marcador arrastável (move), botão "+
  lugar" arma o clique-pra-criar, clique no marcador abre editar/apagar. Usa
  `prompt()`/`confirm()` nativos do navegador (não é a UI final — o alvo era
  testar B1+B2 de ponta a ponta, não desenhar formulário bonito). **Não testado
  num navegador de verdade.**
- Testado por 15 testes pytest (validações + controles negativos: criar no mar
  é recusado, mover pro mar é recusado, capital fora de cidade é recusado, id
  duplicado é recusado, apagar inexistente dá erro) **e por uma sequência real
  de chamadas `curl` contra o servidor rodando**, com pontos de terra/mar
  reais (Mère lon=9,81/lat=0 = terra; lon=−37,05/lat=23,83 = mar aberto, os
  mesmos pontos de controle negativo já usados na extração da Ocean Deep). O
  arquivo `dados/lugares.geojson` real foi conferido vazio no fim (nada ficou
  gravado — os testes limparam depois de si).

### B3. Régua + grade de lat/lon — feito

- `static/js/regua.js`: distância real por grande círculo (haversine) sobre
  `raio_km` do planeta de Uldun (novo campo em `PARAMETROS_LEAFLET`,
  `backend/coordenadas.py`) — nunca a régua da tela, que só vale distância real
  no equador (projeção equirretangular sem correção). Clique 2 pontos no mapa,
  desenha linha, mostra a distância.
- Grade de lat/lon a cada 10°, checkbox liga/desliga.
- **Testei a fórmula em Python** (`tests/test_haversine.py`, espelhando
  exatamente a fórmula JS), contra:
  - Controle negativo: mesmo ponto → 0 km.
  - **"Distância já calculada e registrada"**: dois pontos antípodas (em duas
    direções diferentes, pra provar que não é coincidência do caso polar) batem
    EXATAMENTE com `planeta.distancia_polo_a_polo_km` = 25.018,858 km, que já
    estava gravado em `dados/coordenadas.json` antes desta rodada.
  - Arco de meridiano 0°→60° de latitude (pedido explícito seu): bate com a
    fórmula fechada `raio_km × radianos(60)`.
  - Controle negativo: paralelo fora do equador (45°N, 60° de longitude) dá
    distância MENOR que o meridiano de 60°, e bate com a fórmula exata do
    paralelo (não a aproximação linear).
- **Não consegui reconstruir a medição "The Neck ↔ Calin" (2.217,9 km) já
  registrada em `CARTOGRAFO.md`.** Testei contra os pontos de referência de
  `massas.geojson` (`the-neck-principal`, `the-neck-ilha-sul`, `calin-principal`)
  e nenhum bateu (4.104,8 km e 2.876,8 km, respectivamente) — porque aqueles
  pontos são o CENTRO usado pra identificação por inundação, não o ponto de
  aproximação mais próxima entre as duas costas que a medição original usou. O
  script/pontos exatos daquela medição não sobreviveram no repositório (busquei
  em `git log -p`, `historico/`, `scripts/` — nada). **Pendente**: ou você lembra
  onde estavam aqueles pontos, ou aceitamos que aquele número específico não é
  mais reproduzível e a régua fica validada só pelos casos fechados acima.
- **Não testado num navegador de verdade.**

### B4. Ferramenta de Área (Geoman) — NÃO INICIADA

Não deu tempo dentro do orçamento da noite. Leaflet-Geoman free 2.20.0 (MIT)
continua autorizado pra quando for retomado — não baixei nada.

## 4. O que ficou pronto e testado, resumo técnico

- **34 testes pytest, todos verdes**: `cd lore/mapas/ferramentas &&
  .venv/Scripts/python.exe -m pytest -q`.
- `pytest==9.1.1` instalado no `.venv`, `requirements.txt` atualizado (autorizado
  pra esta noite).
- Todo JS novo/editado passou por `node --check` (sem erro de sintaxe): `app.js`,
  `regua.js`, `lugares.js`, `camadas-referencia.js`, `minimapa.js`.
- Todo Python novo passou por `py_compile` e roda de verdade (os testes e o
  servidor usam o código real).

## 5. Servidor

**NO AR**, reiniciado várias vezes durante a noite (cada mudança de `main.py`/
`index.html`/`backend/*` exige reiniciar, uvicorn sem `--reload`). Última
verificação: `GET /` → 200, `GET /api/lugares` → 200, `GET /api/pilha` → 200.

```
http://127.0.0.1:8420/
```

Se cair, subir de novo:

```
cd lore/mapas/ferramentas
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
```

## 6. O que falhou ou ficou pela metade, com o motivo

| Item | Motivo |
|---|---|
| A3 (Rótulos) | Memória livre < 4GB a noite inteira |
| Cache de identidade de ilha | Idem (nem estava autorizado hoje) |
| B4 (Área/Geoman) | Sem tempo no orçamento da noite |
| Commit de qualquer coisa | `npm run validate` vermelho por arquivo sujo de outra frente (`rolagem.ts`) |
| Teste em navegador de verdade | Fora do escopo desta rodada (sem sessão de browser automation) |
| Medição exata "The Neck ↔ Calin" | Pontos originais não sobreviveram no repositório |
| Esquema de `importancia` (Lugar) | Não documentado em nenhuma revisão sobrevivente de `ESPEC-dados.md` |

## 7. Decisões que precisam de você (lista numerada)

1. **Resolver o bloqueio de commit** (`rolagem.ts`/`mesa-core.ts` sujos, de outra
   frente) — sem isso nada do mapa sobe, nem o trabalho da tarde que você já
   tinha aprovado.
2. **Conferir as prévias do alinhamento automático** (`render/analise/
   alinhamento_chatgpt-N.png`) e decidir se os bounds propostos (quase idênticos
   entre as 4 imagens, cobrindo quase o mundo inteiro) fazem sentido, ou se
   prefere reverter pro placeholder antigo e alinhar à mão pelo "alinhar" (2
   pontos) — os bounds antigos estão salvos em `bounds_anterior_a_20260922`.
3. **Autorizar `gerar_rotulos.py --confirmo` de novo** quando a memória estiver
   livre (feche Photoshop/Chrome de verdade desta vez, ou eu confirmo antes de
   rodar).
4. **Decidir o esquema de `capital`/`importancia`** de `dados/lugares.geojson`
   (tipo, faixa de valores) — hoje `importancia` não é validado.
5. **"The Neck ↔ Calin" 2.217,9 km**: ou você tem os pontos originais, ou
   aceitamos que esse número específico não é mais reproduzível.
6. Itens antigos, ainda abertos (sem mudança): atração de 5km pro delta contra
   rio-mãe; se o Geoman free cobre cortar/rotacionar/dividir/escalar/snap (nem
   instalado ainda); nomear massas sem nome; pertencimento das 9 ilhas `ilha-*`.

## 8. Roteiro de teste pra você, de manhã

Servidor já no ar em `http://127.0.0.1:8420/`.

1. **Zoom fracionário**: role a roda do mouse (deve ficar suave, não em saltos),
   digite um número no campo de porcentagem (ex.: `250`) e aperte Enter, confira
   se o mapa vai pra esse zoom. Teste os botões `-`/`+` ao lado do campo.
2. **Camadas de referência**: ligue cada imagem do ChatGPT uma de cada vez,
   veja se a posição faz sentido contra a costa (compare com as prévias em
   `render/analise/`). Teste o botão "alinhar" (2 pontos: clique na imagem,
   depois no mapa, duas vezes) — **nunca testado antes**, é o item mais
   arriscado da noite.
3. **Ferramenta de Lugar**: clique "+ lugar", clique no mapa (num ponto de
   terra), preencha o `prompt()` (id, tipo, nome). Confira se o marcador
   aparece. Arraste o marcador pra outro lugar em terra (deve mover) e depois
   pro mar (deve recusar e voltar). Clique no marcador, digite "apagar",
   confirme. Teste "desfazer"/"refazer" na barra lateral depois de criar/mover/
   apagar alguns lugares.
4. **Régua**: clique "régua", clique 2 pontos no mapa, confira se aparece uma
   distância em km fazendo sentido de escala.
5. **Grade lat/lon**: marque a caixa, confira se aparecem linhas a cada 10°.
6. Se tudo isso funcionar como esperado, e depois de resolver o item 1 (bloqueio
   de commit) e decidir os itens 2-5, aí sim: commitar.
