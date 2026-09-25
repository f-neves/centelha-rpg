# Rodada 107 · Executora · os preços das Fases 1 a 3 (armas, escudos, armaduras)

- **Despacho:** `docs/simulacao/caixa/107-despacho.md` (`639851e`).
- **Árvore:** branch `executora`, posta em `639851e` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-107.md`, com as horas lidas da máquina.
- **Publicado:** num commit só, o mesmo que traz este relato; o sha vai na mensagem ao Arquiteto.

## A prova dos dardos: o item é UMA unidade

O que decide, lido nos arquivos:

1. **O peso é de uma peça.** `src/data/armas.json:875`, `"peso": 0.2`, o mesmo da
   `adaga-de-arremesso` (uma lâmina, `:716`). O maço de dez flechas pesa 0,3 kg
   (`src/data/municao.json:9`, "Flechas (10)"), ou 0,03 kg por flecha. Se os dardos fossem um maço
   de dezenas a 0,2 kg, cada dardo pesaria menos que uma flecha, e o motivo da proposta ("5× a
   flecha, pelo tamanho") diz o contrário.
2. **Munição vendida em maço tem outro tipo e diz quantas vem.** Em `municao.json`, flechas e
   virotes são `"tipo": "municao"`, com "(10)" no nome e "Maço de dez" na descrição. Os dardos são
   `"tipo": "arma"` (`armas.json:871`), sem número no nome.
3. **A tag `munição` não quer dizer conjunto.** Ela está também no `arco-curto` (`armas.json`,
   tags do item de `:445`), que é uma arma só; e na `adaga-de-arremesso`, cujo preço da proposta
   (50 pc, 1,2 × o custo de fabricação de uma lâmina) é por unidade.
4. **"Carregados às dezenas"** (`armas.json:876`) diz quantos se levam, não quantos o item contém:
   a adaga de arremesso usa a mesma frase ("carregada às dezenas no cinto", `:717`).
5. **A ficha e a mesa não fazem conta com `preco` de catálogo.** O único preço na ficha é a coluna
   livre da bolsa (`src/lib/ficha-engine.ts:2095`, texto que o jogador escreve); nenhum código em
   `src/lib`, `src/pages` ou `src/components` lê `preco` de arma ou armadura.

Aplicado: `dardos` 5 pc.

## ENTROU

### 1 · Os preços (`src/data/armas.json`, `src/data/armaduras.json`)

Os 24 do despacho, todos os ids conferidos no JSON. O `preco` entra no nível de cima, logo depois de
`tipo`, como nos itens que já tinham preço; o resto do arquivo sai byte a byte igual (a ida e volta
do `JSON.stringify(…, null, 2)` reproduz o arquivo de antes, conferido antes de escrever).

| Item | Antes | Depois |
|---|---|---|
| sabre | 300 | 170 |
| martelo-de-guerra | 1000 | 600 |
| machado-pesado | 800 | 650 |
| arco-curto | 80 | 100 |
| espada-serrilhada | sem | 250 |
| maca | sem | 250 |
| picareta-de-guerra | sem | 240 |
| adaga-de-arremesso | sem | 50 |
| machado-de-arremesso | sem | 80 |
| azagaia | sem | 65 |
| pilum | sem | 50 |
| funda | sem | 10 |
| bumerangue | sem | 30 |
| rede | sem | 30 |
| dardos | sem | 5 (cada) |
| camisa-de-malha | 200 | 900 |
| gambeson | sem | 140 |
| couro | sem | 130 |
| brigandina | sem | 680 |
| lamelar | sem | 700 |
| malha | sem | 1300 |
| placa-municao | sem | 1400 |
| placa-transicao | sem | 2100 |
| placa-completa | sem | 2600 |

Os mantidos não foram tocados (escudos, `machado`, `placa-articulada`, `peitoral`,
`peitoral-reforcado`, `malha-completa`, as três bestas, as demais armas).

### 2 · O que é gerado, regenerado

- `src/content/chapters/custo-de-servico-e-itens.md`, o catálogo entre os marcadores
  `gen:catalogo-equipamento`, por `node scripts/gen-cap-itens.mjs`: 54 itens com preço (eram 35):
  32 armas, 2 munições, 13 armaduras, 7 escudos.
- `combate-tempo-bench.html`, que embute o JSON das armas e armaduras, por
  `node scripts/gen-bench-tempo.mjs` (o `validate` confere que ele está em dia).

### 3 · O que é escrito à mão

- **O aviso "Provisório"** (`custo-de-servico-e-itens.md:10`) fica. Ele dizia que "as listas e os
  preços dos dois capítulos não batem por completo". Com os preços novos, **toda arma e armadura do
  Cap. XIII tem preço no catálogo** (conferido por script: nenhum nome da tabela do Cap. XIII fica
  sem preço, fora Desarmado e Nenhuma), então a frase ficava meio falsa para as armaduras. Troquei
  só essa frase: "Toda arma e armadura de lá tem preço aqui (menos Desarmado e Nenhuma), mas as
  listas ainda não batem por completo: o catálogo traz armas que o Cap. XIII não descreve
  (Machadinha, Machado Pesado, Martelo, Bastão, Lança Longa, Sabre, Maça Estrela). Os preços são
  provisórios: use como referência de ordem de grandeza; a reconciliação final vem depois." A
  primeira frase, dos nomes traduzidos, ficou como estava (ver PRECISA DE MIM 2).

### 4 · As seis pendências de design (`docs/pendencias/G-acoes-sistema.md`)

G36 a G41, depois da G35 (a última do tema, conferida no arquivo), todas `[DECIDIR]`, com a data e
"levantado na revisão econômica, proposta de preços das Fases 1 a 3", e as citações conferidas no
arquivo de hoje:

- **G36**, a Brigandina contra a Cota e a Camisa de malha: `armas-e-armaduras.md:118-120`; o legado
  é `legacy/raiz/armaduras_escudos_centelha.txt:187`, e a descrição do JSON repete "sobre malha"
  (`src/data/armaduras.json:108`). Uma nuance que escrevi no item: a Camisa de malha tem Penalidade
  −1 e a Brigandina −2, então a Brigandina a supera "em tudo menos a Penalidade".
- **G37**, a Placa articulada contra a de transição: `armas-e-armaduras.md:123` e `:125`.
- **G38**, Kite × Heater (`armas-e-armaduras.md:146-147`) e Pavês × Scutum (acesso em
  `src/data/escudos.json:145` e `:168`).
- **G39**, o Machado contra a Espada Longa, com a nota de que a linha de fabricação do machado é a G27.
- **G40**, dardos, funda, bumerangue e rede sem linha de fabricação.
- **G41**, as três bestas, que dependem da G25.

`Pendencias.md` regenerado: 288 itens (196 abertos).

### 5 · Uma citação deslocada fora do tema G

A **H6** (`docs/pendencias/H-arremesso.md:36-37`), aberta, cita `armas.json:461` e `:443` (o
`forcaCap` e a descrição do Arco Curto). Os preços novos entram antes dele e empurram as linhas:
agora são `:470` e `:452`. Só o número mudou. Nenhum outro arquivo fora de `docs/simulacao/caixa/`
cita linha de `armas.json`, `armaduras.json` ou do trecho do catálogo.

### 6 · A prova

- `npm run validate`: verde (código 0), com "✓ catálogo de equipamento em dia com a fonte (54 itens
  com preço)", "✓ combate-tempo-bench.html em dia (127 KB)" e "✓ Pendencias.md em dia com os temas:
  288 itens".
- `npm run build`: verde (código 0), "Complete!". O aviso de `/artes/` sem `<html>` é o de sempre.
- **Onde o preço aparece para quem joga:** no catálogo do capítulo Custo de Serviço & Itens. No
  `dist/regras/custo-de-servico-e-itens/index.html`: "Dardos · 5 pc" (arma nova) e "Placa completa ·
  Pesada · 26 po" (armadura nova). **A ficha não mostra preço de catálogo:** procurei em
  `src/lib/ficha-engine.ts` (o único `preco` é a coluna livre da bolsa), em `src/lib/equip.ts` (só
  achata o envelope) e na página `/equipamentos` (`src/pages/equipamentos.astro`, sem preço).
- **Ficha salva:** nenhuma guarda preço copiado do catálogo. A arma e a armadura são salvas pelo id,
  e a bolsa guarda o texto que o próprio jogador escreveu, que não muda.
- Travessão lendo os arquivos: o número de linhas com o caractere, antes e depois, é o mesmo em cada
  arquivo tocado (6 no `combate-tempo-bench.html`, 1 em cada JSON, 0 nos outros), então nenhuma
  linha nova tem travessão.

## Achados e deixados como estão

- `src/content/chapters/armas-e-armaduras.md`: não tem preço nenhum (só estatísticas); nada a mudar.
- `scripts/gen-lista-equip.mjs`: escreve `D&D/armas&armaduras/lista-itens.md`, fora do que o
  repositório versiona (`git ls-files` vazio), e dos preços só lista o `precos.json`. Não rodei.
- `scripts/precos.mjs`: lê só `src/data/precos.json`, que não tem arma nem armadura.
- `custo-de-servico-e-itens.md:125`, o exemplo "Machado (base 30 pp)": o Machado fica em 300 pc, e o
  exemplo continua certo.
- `Acoes_Sistema.md` e os documentos da raiz: nenhum preço dos itens desta rodada (procurei pelo nome
  do item junto de preço, e pelos preços velhos).
- `legacy/Equipamentos_New_RPG_System_D6.md` e `legacy/raiz/`: legado, sem preço desses itens.
- `docs/simulacao/` e `docs/pendencias/` (por exemplo a G27, "Machado (média, 300 pc)"): histórico,
  não se reescreve por preço.

## PRECISA DE MIM

1. **"Dardos · 5 pc" embaixo de "Munição vendida em maços".** O cabeçalho do catálogo
   (`custo-de-servico-e-itens.md:129`) diz que munição é vendida em maço, e o nome do item é plural
   ("Dardos"); quem lê "Dardos · 5 pc" pode entender o maço por 5 pc. O mesmo vale para a Adaga de
   Arremesso. Saídas: o nome no JSON dizer a unidade ("Dardo"), o gerador acrescentar "(cada)" a
   item de arremesso com a tag `munição`, ou deixar.
2. **"Brigandina / coat of plates" entrou no catálogo.** A primeira frase do aviso diz que os nomes
   das armaduras "já foram traduzidos e alinhados" ao Cap. XIII, que chama a peça só de
   "Brigandina"; o catálogo mostra o nome do JSON, com o inglês, e o Gambeson como "Gambeson
   (acolchoado)". Não mexi no nome do JSON (fora da rodada) nem na frase do aviso.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
