# Rodada 110 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia os quatro commits
(`a58e6f4`, `f9709bc`, `3ee18df`, `2333022`) e o despacho (`1860d7b`). Pino: `2333022`. Passo 0
pelo §0.1: `git merge-base --is-ancestor HEAD origin/main` passou (o `e29e2ad` da 109 estava no main),
depois `git switch -C revisora 2333022`. Toplevel `C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`,
branch `revisora`, árvore limpa antes. Saída temporária em `../tmp/revisora/`.

O `14f5ab4` (o relato atualizado com as respostas de F4 e F5) chegou depois do pino e não está nesta
revisão. F4 e F5 o Arquiteto já respondeu, e eu não julgo.

**Veredito geral: PROCEDE, com dois CORRIGE pequenos e uma PERGUNTA.** O que o aviso pediu para
apertar confere, por caminho meu:

- a migração da ficha salva;
- os esquemas com o controle negativo;
- a prova no `dist/`;
- a decisão do Machado.

Os dois CORRIGE:

- **CORRIGE 1:** a carroça leva **6,9 dias**, e não 6,3. A conta é a da própria linha, e o erro veio
  da lista final e do despacho (§5).
- **CORRIGE 2:** sobrou uma "Relíquia" no sentido do Antecedente, em `src/data/regras.json:580` (§1).

## CI (§11)

Workflow `Validar dados e regras`, lido às 22:27 e acompanhado até o fim:

| commit | run | resultado |
|---|---|---|
| `a58e6f4` | `36207071458` | `success` |
| `f9709bc` | sem run próprio | subiu junto com o `3ee18df`, e o run dele o cobre |
| `3ee18df` | `36207807077` | `success` |
| `2333022` | `36207986331` | `success` |

## 1 · Relíquia → Artefato, e a ficha salva

**O código** (`ficha-engine.ts:351-356`) move `S.ante` e `S.anteNom` de `reliquia` para `artefato`
antes do laço que normaliza os Nomeados. Nenhum outro lugar de `src/` lê antecedente por id: o
`anteNom` só aparece no `ficha-engine.ts`.

**O teste é meu** (`t-artefato-rev.mjs`) e tem outra forma que o dela. São três cargas da `/ficha`,
cada uma com o `localStorage` montado a partir da ficha que a página salva. O Artefato é de nível
3, e a coisa medida é o **XP gasto** (`#xpSpent`), além da linha da ficha:

| carga | XP | linha da ficha | o que fica gravado |
|---|---|---|---|
| A · `artefato` direto (o estado novo) | 18 | "Lâmina de Prova" | `artefato` |
| B · `reliquia` (a ficha velha) | **18** | **"Lâmina de Prova"** | **`artefato`, e `reliquia` some** |
| C · nenhum dos dois | 0 | nenhuma | `[]` |

B igual a A é a prova: a ficha velha abre com o mesmo XP (3 + 6 + 9) e a mesma linha.

**Controle negativo, por outro caminho que o dela:** ela usou `stash` do arquivo, e eu tirei só as
6 linhas do laço (`tirar-renomes-ante.mjs`). Buildei com `npx astro build`: o `npm run build` recusa,
porque o `validate` acusa as 3 citações de `ficha-engine.ts` que a remoção desloca. Na carga B, **XP 0,
sem linha, e o salvo continua com `reliquia` órfã.** O arquivo foi restaurado por `git checkout --`
no mesmo comando (md5 `2f4e2087` antes e depois), o pino buildado de novo, e a carga B deu 18 outra vez.

**CORRIGE 2 · uma menção ficou para trás.** `src/data/regras.json:580`, a nota do custo de
Antecedente: "Teto 3 na criação em Recursos e **Relíquia**". É o Antecedente, e não o rótulo de
qualidade. O `ficha-engine.ts:2399` diz a mesma regra e já foi trocado para Artefato.

**Alcance, dito com a medida:** a nota entra no bundle (`dist/_astro/regras.*.js`), mas não achei
página que a mostre. Nenhum HTML do `dist/` tem "Recursos e Relíquia", e não achei código que leia
`regras.xp.antecedente.nota`. Ninguém a lê jogando. É CORRIGE e não ESCALA porque a rodada prometeu o
rename e este é o JSON que o livro segue. O conserto é uma palavra.

**Fora do `src/`, e não é desta rodada:** o `Antecedentes.md` da raiz (documento de desenho) e o
`Relatorio.md` ainda chamam o Antecedente de Relíquia. O despacho não pediu esses.

## 2 · Os esquemas e a cópia

**A cópia é fiel.** Comparei cada um dos 7 arquivos de `src/data` com a v2 (`rpg-system/lore/economia/v2/`,
só lendo). Apliquei só as transformações declaradas (o envelope `{_nota, itens}` nos dois que eram
array, e sem `_procedencia` nas montarias) e ignorei a `_nota`: **os 7 são iguais.** O `criados` do
`custo-de-vida.json` e o do `servicos.json` também são iguais entre si.

**F6:** o `livre_semana` das 9 faixas é o `arred()` do `base.py` aplicado à curva D:

- abaixo de 20, inteiro: 7,20 → 7 e 19,14 → 19;
- entre 20 e 99, múltiplo de 5: 39,40 → 40, 55,78 → 55 e 85,49 → 85;
- de 100 a 999, múltiplo de 10: 113,93 → 110 e 200,23 → 200.

Três faixas não são o inteiro mais próximo, e é a regra do modelo, que a `_nota` chama de
"arredondado". Confere.

**Os esquemas, com o meu controle negativo.** Enxertei nos JSONs, rodei o `validate-data.mjs` e
restaurei por `git checkout --` no mesmo comando. Depois o `validate-data` voltou verde.

- **Rodada 1:** preço como número num item de `mercadorias`, `_procedencia` numa montaria e uma chave
  nova na raiz do `servicos`. Os três falharam: "Expected object, received number", "Unrecognized
  key(s) in object: '_procedencia'" e "Unrecognized key(s) in object: 'chave_nova'".
- **Rodada 2:** um id falso num pacote, um `total_pc` errado e um id duplicado em `mercadorias`. Os
  três falharam: "cita "nao-existe"", "diz total_pc 999, a soma dos itens dá 540" e "id duplicado".

**Um detalhe da rodada 1:** com o `mercadorias` inválido, a conta dos pacotes não roda (ela depende do
arquivo já validado). O portão já está vermelho nesse caso, então não passa nada. Só que um segundo
defeito não aparece até o primeiro sair.

**PERGUNTA · até onde vai a F2.** O relato diz "preço sempre `{pc}`". Isso vale para `mercadorias` e
`montarias-veiculos`. Nos outros, o preço é número solto:

- `servicos[].pc`, que num caso é **texto** ("professor" = "ver aulas");
- `aulas[].preco` e `aulas[].pc`, os dois no mesmo item;
- `escravos[].pc`;
- `viagens.precos[].pc`;
- o `pc_semana` do custo de vida.

É a v2 copiada como o despacho mandou, e o esquema aceita assim de propósito. A F2 do despacho diz
"todo arquivo novo". **A F2 vale para tarifa e serviço, ou só para item?** Se valer, o formato muda em
quatro estruturas e no gerador. A frase do relato está larga demais, seja qual for a resposta.

## 3 · O gerador e a prova no `dist/`

**O gerador.**

- O `gen-cap-economia.mjs --check` está no `validate` (`package.json`) e dá verde: 12 blocos, 9
  faixas, 193 mercadorias, 44 montarias, 38 serviços e 7 pacotes.
- **Controle negativo:** troquei "7 pc" por "8 pc" dentro do bloco da renda, e o `--check` falhou
  ("fora de sincronia"). Restaurado.

**O `dist/` do pino**, buildado de novo às 22:27. `regras/custo-de-servico-e-itens/index.html` tem:

- 40 tabelas;
- "Nobreza", "Trigo", "Artista", "Relíquia não é grau", "Revenda", "Semanas de aventura" e "36 po";
- **zero** "precos.json" e zero "Hospedagem".

Os 24 `gen:economia` do HTML são os marcadores do Markdown que passam como comentário HTML, e não
aparecem na tela.

**Um cuidado meu, para o registro:** o `dist/` entre o controle negativo e o rebuild era o do
controle, e uma leitura minha caiu nesse intervalo. Refiz toda a prova depois do rebuild, e são estes
os números acima.

**Nada mais lê o `precos.json`.** Varri o repositório: as menções que sobram são texto de
`Acoes_Sistema.md` e das pendências G, e nenhuma é código.

## 4 · O Machado

**A decisão dela está certa.** O `estado-revisao.md:992` se contradiz na mesma frase:

- ele manda os multiplicadores Boa 5×, Ótima 30× e Excelente 70×;
- e, entre parênteses, dá "Boa 6 po, Ótima 15 po, Excelente 36 po pela base 3 po", que são 2×, 5× e
  12×.

Com os multiplicadores que ele mesmo manda, 3 po dá 15, 90 e 210 po, mais 300 da Relíquia (100×). É
exatamente a v2 §1, leitura 5 (`revisao-economica-v2.md:71`). A regra "o estado-revisao vence" não
decide uma frase que diverge de si mesma, e ela seguiu a parte que as duas fontes aceitam.

**O exemplo novo confere de ponta a ponta** (`custo-de-servico-e-itens.md:396`):

- Sucata até 50 pc (⅙ de 300);
- Tosco até 1 po (⅓);
- Bom 15, Ótimo 90, Excelente 210 po;
- Relíquia a partir de 300 po.

**Não sei de onde vêm os 6, 15 e 36** do estado-revisao. O livro de antes, nesse exemplo, estava em
pp e com outra régua (Péssimo, Ruim, Bom, Ótimo, Relíquia), e nada ali dá esses números. Não chuto
causa.

## 5 · CORRIGE 1 · a carroça leva 6,9 dias, e não 6,3

`acoes-oficio-e-mundo.md:162` dá a carroça com Mont. 4, Peça 20 e **"6,3 dias"**, e o parágrafo do
`:179` repete "cerca de 267 pc em 6,3 dias do oficial".

**A conta da própria tabela.** O oficial tem média 10,5 (`:135`). Contra a Dificuldade 7, rende 3,5
por dia, e o Acúmulo é Mont. + Peça = 24. Então **24 ÷ 3,5 = 6,86 dias**. É a mesma conta que dá
certo em todas as outras linhas da escala:

| linha | Acúmulo | conta | a tabela diz |
|---|---|---|---|
| espada | 22 | 22 ÷ 3,5 = 6,29 | 6,3 |
| arco | 16 | 16 ÷ 3,5 = 4,57 | 4,5 |
| sela | 12 | 12 ÷ 3,5 = 3,43 | 3,5 |
| gambeson | 23 | 23 ÷ 6,5 = 3,54 | 3,5 |

**A fonte diz a mesma coisa:** o achado 8 do `estado-revisao.md:838` escreve "oficial avulso =
267,4 pc (**6,86** "dias")". O "6,3" entrou na lista final (`:983`, "avulso ~267 pc / 6,3 dias"),
passou ao despacho 4c, e a Executora copiou certo o que recebeu. Parece ser o tempo da espada, na
linha de cima, mas isso não confirmei.

**O preço não muda:** os 267 pc já foram calculados com 6,86 dias. **O conserto:** "6,3 dias" vira
"6,9 dias" em `acoes-oficio-e-mundo.md:162` e `:179`. A prova "6,3 dias três vezes" do relato conta
a espada e as duas da carroça.

**Vizinho, e não é desta rodada:** o `Acoes_Sistema.md:1270` ainda tem a linha "Carroça, barco de
pesca" junta, em semanas. O achado 8 pedia separar "nas duas tabelas", e a lista final só nomeou o
capítulo.

## 6 · O resto do texto

- **Excepcional → Excelente:** as 11 trocas do despacho conferem. Todo "Excepcional" que sobra em
  `src/` é o degrau 25 (`acoes-e-sistema.md:24`, `coracao-do-sistema.md:71`, `regras.json`) ou o
  rótulo de Atributo 4 (`atributos.md`, `atributos.json`).
- **O preço que dobrava** (`acoes-oficio-e-mundo.md:82`) virou o preço fixo por grau, e o `:78` ganhou
  o Requisito máximo 6. Sem isso, o livro teria duas regras de preço.
- **Reparo** (`:193`), **Cura acelerada** (`vida-ferimentos-cura.md:90`) e **as seções novas**: as
  linhas que o relato e as pendências citam (`custo-de-servico-e-itens.md:8, 33, 61, 65, 74, 120,
  259, 283, 345, 499, 808, 896, 941`) são as seções que dizem ser.
- **Pendências:** os 9 itens fechados (G52, G54 a G59, G62 e G65) citam linhas que conferem com as
  seções. Conferi por amostra da citação, e não li cada registro inteiro.

## 7 · Travessão

**Linhas acrescentadas nos quatro commits: um travessão só**, no `a58e6f4`. É o
`combate-tempo-bench.html` regerado, que embute o `armaduras.json`, e esse travessão já estava lá: o
`armaduras.json` de antes tem 1, e o bench tem 9 antes e 9 depois.

**Os três commits seguintes: zero.**

## Limpeza

Os três enxertos (`ficha-engine.ts`, os JSONs e o capítulo) foram desfeitos no mesmo comando, e o
pino foi buildado de novo com a prova no gerado. Em `../tmp/revisora/` ficam:

- `t-artefato-rev.mjs` e `tirar-renomes-ante.mjs`;
- `val-neg110.txt`, `val-neg110b.txt` e `gen-neg.txt`;
- os logs de build e de CI.

Não mexi em arquivo versionado além dos meus dois da caixa.
