# Rodada 107 · veredito

Pino: `3e1610d` (aviso), faixa `639851e..6be3ba3`, dois commits da rodada: `b475ab4` (preços,
catálogo, G36 a G41, relato) e `6be3ba3` (uma hora do progresso). Passo 0 pelo §0.1: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o veredito 106, `dc3e6ac`, estava no main), depois
`git switch -C revisora 3e1610d`. Toplevel é a worktree da Revisora, HEAD `3e1610d2d41c`,
`git branch --show-current` dá `revisora`, e a worktree estava limpa antes. Nenhuma ordem do §0.2
nesta rodada.

**Veredito geral: PROCEDE COM UM CORRIGE.** Nenhum BLOQUEIA.

- **CORRIGE:** a primeira frase do aviso "Provisório" ficou falsa com os preços novos, e o despacho §3
  mandava deixá-lo verdadeiro (§3).
- **Os 24 preços estão certos**, conferidos por outro caminho que o do Arquiteto (§1).
- **A prova dos dardos se sustenta** em todas as pernas, e nenhuma leitura do código ou do livro a
  contradiz (§2).
- **ESCALA:** "Dardos · 5 pc" embaixo de "Munição vendida em maços", o PRECISA DE MIM 1 dela.
  Nasce da faixa, mas não é defeito dela (§5).

## CI (§11)

Workflow `Validar dados e regras`, lido às 03:09 UTC de 25/09, depois de `gh run watch --exit-status`
(código 0) nos três:

| commit | run | resultado |
|---|---|---|
| `b475ab4` (preços) | `36088116521` | `completed / success`, os 19 jobs |
| `6be3ba3` (progresso) | `36088196896` | `completed / success`, os 19 jobs |
| `3e1610d` (o aviso) | `36088311998` | `completed / success`, os 19 jobs |

**O deploy:** o `Deploy site (GitHub Pages)` de `b475ab4` e o de `6be3ba3` saíram `cancelled`,
ultrapassados pelos seguintes. O de `3e1610d` saiu `success`, e ele contém a faixa inteira. Os
preços novos estão no ar.

**Um vermelho anterior à faixa, e não dela:** o `Validar` de `ca52ca6` (o fechamento da 106, do
Arquiteto) saiu `failure`, com um único job vermelho, `Smoke · test-luas`. O run seguinte, de
`639851e`, e os três da faixa passaram nesse job. Não investiguei a causa. Fica registrado como
vermelho herdado de um commit só, que não se repetiu (§11).

## 1 · Os 24 preços, por outro caminho

O Arquiteto conferiu os 32 ids contra o JSON publicado. **Eu comparei os dois lados da faixa**:
Python lendo `git show 639851e:` e `git show 6be3ba3:` de `armas.json`, `armaduras.json` e
`escudos.json`, item a item pelo `id`. O script fica em
`scratchpad/precos107.py`, na pasta da sessão. Resultado:

- **os 24 do despacho §1 saem exatamente com o `{"pc": N}` pedido** (15 armas, 9 armaduras), e
  nenhum id do despacho falta no JSON;
- **nenhum outro campo de nenhum item mudou**: comparei o objeto inteiro sem o `preco`;
- **nenhum preço mudou sem ordem**, os escudos incluídos;
- **os mantidos continuam com o preço de antes**: `machado` 300, `placa-articulada` 1400, `peitoral`
  280, `peitoral-reforcado` 900, `malha-completa` 1800, as bestas 300, 550 e 950.

O `preco` entra logo depois de `tipo`, como nos itens que já tinham preço (lido no diff do
`armaduras.json`). Rodei `node scripts/gen-cap-itens.mjs` e `node scripts/gen-pendencias.mjs` no pino:
nenhum dos dois mudou arquivo nenhum (54 itens com preço; 288 itens de pendência). O conteúdo
commitado é o gerado. A formatação confere: 50 pc sai "5 pp", 650 sai "65 pp", 900 sai "9 po".

## 2 · A prova dos dardos: cada perna, no arquivo

1. **Peso.** `dardos` 0,2 kg, `adaga-de-arremesso` 0,2 kg, "Flechas (10)" 0,3 kg
   (`municao.json`). Confere: um maço de dezenas a 0,2 kg daria dardo mais leve que flecha.
2. **Tipo.** `dardos` é `"tipo": "arma"`, e flechas e virotes são `"tipo": "municao"`, com "(10)" no
   nome e "Maço de dez" na descrição. Confere.
3. **A tag `munição`.** Está em nove armas: os três arcos, as três bestas, a funda, a adaga de
   arremesso e os dardos. Nos arcos, nas bestas e na funda ela marca a arma que GASTA munição, e não
   um conjunto. Confere. A leitura mais forte a favor dela está no livro, e ela não a citou:
   `armas-e-armaduras.md:51` define a tag como "**Munição**: gastar munição". Num item arremessável, o
   que se gasta é o próprio item, uma unidade por lançamento.
4. **"Carregados às dezenas"** e "carregada às dezenas no cinto" (a adaga) estão nas descrições.
   Confere.
5. **A ficha e a mesa não leem o `preco` de catálogo.** Procurei `preco?.pc`, `.preco` e `['preco']`
   em `src/**/*.ts`, `src/**/*.astro` e `scripts/**/*.mjs`. Só o `gen-cap-itens.mjs` lê o preço de
   item. Os dois `preco` do `ficha-engine.ts` (`:221`, `:2095`) são a coluna livre da bolsa. O
   `lib-equip.mjs` e o `src/lib/equip.ts` só achatam o envelope. Confere.

**Contradição, nenhuma.** Também não há código que trate a tag `munição` como pilha, quantidade ou
maço: ela só aparece em dado e em texto. Uma nota sem classificação: a mesma tag quer dizer "gasta
munição" no arco e "é a munição" no dardo. A leitura do capítulo (`:51`) cobre as duas, e a
ambiguidade é anterior à faixa.

## 3 · O aviso "Provisório": as duas afirmações contadas, e uma terceira que ficou falsa (CORRIGE)

Contei por Python os nomes das tabelas do Cap. XIII (`armas-e-armaduras.md`, armas corpo a corpo, à
distância e armaduras) contra os nomes do catálogo gerado:

- **"o catálogo traz armas que o Cap. XIII não descreve (Machadinha, Machado Pesado, Martelo, Bastão,
  Lança Longa, Sabre, Maça Estrela)": verdadeira, e a lista é exata.** São sete, as mesmas sete. Fora
  delas, só as duas munições e os escudos, que a frase não menciona.
- **"Toda arma e armadura de lá tem preço aqui (menos Desarmado e Nenhuma)": verdadeira na
  substância, falsa pelo nome.** Das armas, só Desarmado fica sem preço. Das armaduras, Nenhuma, e
  mais duas que o catálogo tem com outro nome: **Gambeson** (catálogo "Gambeson (acolchoado)") e
  **Brigandina** (catálogo "Brigandina / coat of plates").

**CORRIGE, `custo-de-servico-e-itens.md:10`, primeira frase:** "Os nomes das armaduras já foram
**traduzidos** e alinhados ao vocabulário de Armas & Armaduras (Cap. XIII)". Até esta faixa a frase
era verdadeira para o que o catálogo mostrava, porque Gambeson e Brigandina não tinham preço e não
apareciam. **Com os preços novos as duas entram com o nome de trabalho, uma com o inglês, e a frase
fica falsa.** O despacho §3 mandava: "Se o texto dele ficar falso com os preços novos [...] ajuste só
o necessário para ser verdade". A Executora viu o caso e o trouxe como PRECISA DE MIM 2, mas não
ajustou a frase.

**Por que é CORRIGE (§8):** o despacho prometeu um aviso verdadeiro, este achado o falsifica, e o
conserto pequeno está dentro da rodada: uma oração dizendo que Gambeson e Brigandina ainda aparecem
aqui com o nome de trabalho. Renomear os dois no JSON também tornaria a frase verdadeira, mas
renomear é fora da rodada e mexe em dado que a ficha e a mesa leem. Essa escolha fica com o Arquiteto.

**O PRECISA DE MIM 2, antes ou depois da faixa:** os nomes do JSON e a frase já existiam em
`639851e`, e nenhum dos dois está no diff. **A contradição nasceu nesta faixa**, porque só agora os
dois itens aparecem no catálogo.

## 4 · "Todo lugar onde o preço aparece", por outro caminho

- **Nome do item junto de preço, no repositório inteiro:** Python com os 24 nomes (mais "Dardo",
  "Placa" e "Couro") e a moeda (`N po|pp|pc|pl` ou `"pc": N`) na mesma linha. Ficaram fora
  `node_modules`, `dist`, `.astro`, `docs/simulacao`, `docs/pendencias` e `legacy`. **Achou dois
  arquivos:**
  - `custo-de-servico-e-itens.md`: todos os achados dentro do bloco gerado (`:131` a `:226`), mais o
    `:125`, "Machado (base 30 pp)", que continua certo;
  - `combate-tempo-bench.html`: o JSON embutido, que o `validate` confere que está em dia.
- **Id do item fora dos dois JSON de origem:** 21 arquivos, quase todos teste, simulação ou lista
  de imagens. Nenhum deles lê `preco` (a varredura de leitores está no §2, perna 5).
- **Os três scripts do despacho:**
  - o `gen-lista-equip.mjs` escreve `D&D/armas&armaduras/lista-itens.md`, e `git ls-files "D&D"` sai
    vazio; do preço, ele só lê o `precos.json`;
  - o `precos.mjs` lê só o `src/data/precos.json`, que não tem nenhum dos 22 ids de arma e armadura
    que procurei;
  - o `armas-e-armaduras.md` não tem coluna de preço.

**O que ela disse confere, e não achei lugar nenhum a mais.** O `lore/economia/` não está no git
desta árvore, e não o varri.

## 5 · Os dois PRECISA DE MIM: da faixa, ou de antes

- **1, "Dardos · 5 pc" embaixo de "Munição vendida em maços" (`custo-de-servico-e-itens.md:129`).**
  O cabeçalho é de antes da faixa. O dardo e a adaga de arremesso entram agora, **então a
  ambiguidade nasce desta faixa, mas não é defeito dela**. O despacho mandou 5 pc por unidade, e o
  catálogo não tem campo para dizer "cada". Nada que o livro afirma ficou falso: o cabeçalho fala de
  munição, e os dardos estão listados entre as armas, na mesma tabela. **ESCALA ao Arquiteto**, com
  as três saídas dela (nome no singular, "(cada)" gerado, ou deixar).
- **2, os nomes das armaduras:** ver o §3. É o CORRIGE.

## 6 · G36 a G41 e a H6: as citações

Conferi **todas**, e não uma amostra, lendo a linha de destino no pino: 25 citações de linha (um intervalo conta como uma).

- **G36:**
  - `armas-e-armaduras.md:118-120`: Camisa, Cota e Brigandina, com os números que o item repete;
  - `custo-de-servico-e-itens.md:190`, `:194-195`: 9 po, 68 pp, 13 po;
  - `legacy/raiz/armaduras_escudos_centelha.txt:187`: "vestidas sobre malha";
  - `armaduras.json:108`: "sobre malha".
- **G37:** `:123` e `:125` (−2 contra −3); catálogo `:199` e `:202` (14 po, 21 po).
- **G38:**
  - `:146-147`: Heater e Kite iguais;
  - catálogo `:213` e `:215`: 1 po e 25 pp, que dá 2,5 vezes;
  - `escudos.json:145` e `:168`: acesso 3 do `scutum` e acesso 5 do `paves`, conferidos pelo `id`
    logo acima de cada linha;
  - catálogo `:216-217`: 45 pp e 35 pp.
- **G39:**
  - catálogo `:148` e `:152`;
  - os pesos 1,2 e 1,4 kg, lidos no `armas.json`;
  - `acoes-oficio-e-mundo.md:157` e `:160`.
- **G40:** catálogo `:169-171`, `:174`: Bumerangue, Dardos, Funda, Rede.
- **G41:** catálogo `:164-166`: as três bestas.
- **H6:**
  - `armas.json:470`, `"forcaCap": 3`;
  - `armas.json:452`, a descrição do Arco Curto, "Soma Força até +3";
  - o `Arremesso.md:253` que o item cita (Arco Curto, 2) não mudou.

**Todas certas.** A conta da G36 também confere: a Brigandina supera a Camisa em Impacto, Corte e
Perfuração, e perde na Penalidade (−2 contra −1). O item diz exatamente isso.

## 7 · O resto da prova

- **Travessão:** conferido lendo os ARQUIVOS (ver o fecho).
- **Nada chegou ao `origin/main` depois do pino** até a leitura do CI.

**Fecho, travessão:** contei as linhas com o caractere lendo os arquivos. Deu 0 neste veredito, no
progresso, nos dois temas de pendência, no capítulo de custo e no `Pendencias.md`. Nos três arquivos
que já tinham o caractere, a contagem antes e depois da faixa é a mesma: `armas.json` 1 e 1,
`armaduras.json` 1 e 1, `combate-tempo-bench.html` 6 e 6. Controle positivo: `CLAUDE.md` dá 4.
