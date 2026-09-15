# Rodada 59 da revisora · rodada 75 do projeto · a M-21 no ar, e o limite da morte em metade do PV

Revisora: aviso em `0b81484`. BASE `206fcef`, SHA do trabalho `8d2787b`, TOPO `0b81484`.
Os dois contadores são o mesmo (`58-revisora.md` ao lado de `progresso-revisora-58.md`), e
este arquivo revisa a **rodada 75** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `0b8148431b1bc3774d85c76c7a5883b3af5184df`. Batem com o aviso. Árvore
limpa antes e depois da reancoragem, vinda de `d181d8b`.

A faixa `206fcef..8d2787b` são três commits e seis arquivos, 288 inserções. Os arquivos de
código são dois (`scripts/validate-data.mjs`, e os dois `.json` de dados), mais os dois
capítulos e o arquivo de progresso dela.

**Coautoria:** os três commits da faixa estão limpos, procurando `co-authored`, `anthropic` e
`claude` na mensagem inteira pelo `rtk proxy git log`, que é o caminho que não encolhe.

**Travessão:** zero. O escopo, dito junto com o número: contei nas **137 linhas ADICIONADAS**
do diff de `src/data/`, `scripts/` e `src/content/` na faixa, lido pelo proxy, mais o
`progresso-75.md` lido como arquivo. Os arquivos tocados têm travessão antigo (21 em
`regras.json`, 15 em `validate-data.mjs`, 6 em `combate.md`) e nenhum dele é desta rodada.

---

## 1 · A varredura da palavra que morreu · SOBROU UM TERCEIRO

**O escopo da minha varredura, e ele não é o dela:** `letal|letais|letalidade`, insensível a
caixa, em `src/`, `scripts/`, `supabase/` e nos `.md` fora de `docs/simulacao` e de `legacy/`.
Insensível a caixa de propósito: o portão dela casa `\bLetal\b`, e a frase que ela mesma
corrigiu em `combate.md` dizia "contra os **letais**", em minúscula. Um portão que só vê a
maiúscula não veria a forma que de fato existia no repositório.

**O terceiro lugar existe, e é tela da mesa:** `src/pages/mesa/referencia.astro:170` ·
`de Letal a cada 6 Ticks desde o ferimento`, escrito na prosa fixa da página, enquanto os
números em volta vêm do JSON (`SANG.gatilhoEstado`, `SANG.valorEstado`, de
`regras.sangramento`, `:40`). Cinco linhas abaixo, `:175` imprime `{SANG.nota}`, que é
exatamente o campo que ela corrigiu para "sofre N de dano".

**O efeito é o pior possível para uma página de consulta:** a mesma seção da tela publica as
duas redações, uma acima da outra, e é a página que o mestre abre na mesa para conferir regra.
É `CORRIGE 1`, e é uma palavra.

**O resto do que a varredura achou, classificado, para o escopo ficar honesto:** quatro regras
publicadas que perderam o chão (abaixo, `CORRIGE 2`); `scripts/sim-caps.mjs:96`,
`sim-defesas.mjs:190` e `sim-grupo.mjs:72`, que usam uma variável `letal` para dizer "não é
impacto" ao escolher a Absorção, que é o que a M-21 MANTÉM, e são bateria de simulação
congelada; e adjetivo comum em bestiário e prosa ("ambientes letais", "mais letal", "dano não
letal" nas descrições traduzidas), que não é a trilha. `nocaut` em `src/`, `scripts/` e
`supabase/` só aparece no `inquebrantavel`.

## 2 · A lista de regras órfãs diz DUAS, e são QUATRO

O relatório fecha com "**Duas** regras PUBLICADAS que a M-21 deixou sem chão", e nomeia o
`inquebrantavel` e a Arte Vida. A minha varredura acha mais duas, do mesmo tipo (regra que um
jogador compra, escrita em cima das duas trilhas):

- **`mao-de-ferro`** (`src/data/tecnicas.json:278` · `podem causar dano **Letal** à vontade`),
  nível 1. A Técnica existe para trocar a trilha do soco; sem trilhas, a segunda metade dela
  compra nada. E ela tem **par no dado das armas**: `src/data/armas.json:819` ·
  `dano de Impacto (Letal só com a Técnica Mão de Ferro)`.
- **`fechar-feridas`** (`src/data/tecnicas.json:1449` · `cura dano Letal leve em minutos`),
  nível 3, com o irmão em `src/data/artes.json:778` · `cura Letal moderado`. Com "cura é cura",
  a restrição deixa de restringir coisa nenhuma.

**Por que isto é CORRIGE e não observação, e a medida está no repositório:** a decisão de mesa
que saiu DEPOIS do trabalho (`19afbbc`, fora da faixa) decidiu sobre **as duas** que o relatório
nomeou, e sobre nenhuma das outras duas. O número não descreveu, **mandou**: foi a condição de
parada de quem decidiu. É a forma que o `CATALOGO.md` registra em 12/09/2026, e desta vez ela
fechou o circuito dentro de um dia.

O conserto é de registro e é pequeno (nomear as quatro), e a decisão sobre elas continua sendo
da mesa, não minha. Não digo o que decidir.

## 3 · O portão · ele OLHA, e tem um buraco medido

**Refiz dois dos cinco vermelhos**, com o arquivo do portão intocado:

| falsificação | saída | bate com o relatado |
|---|---|---|
| `limiteArredonda: "alto"` | `EXIT=1`, 1 erro, só no exemplo de PV 37 | sim |
| `limiteDivisor: 4` | `EXIT=1`, 3 erros: a fórmula, PV 34 e PV 37, com a conta refeita | sim |

As mensagens nomeiam arquivo, o valor publicado e o valor derivado. O vermelho do `alto` cair
**só** no PV 37 é a prova de que a ocasião do ímpar existe de verdade, e não é retórica do
comentário. Verde hoje, `EXIT=0` lido pelo código de saída.

**A resposta à pergunta do aviso, e ela tem as duas metades:** o portão fica verde **por ter
olhado**, nos dois pares que enxerga, e fica verde **por não achar** no terceiro.

**Medido, não deduzido.** O capítulo publica **três** `morre em`; o extrator devolve **dois**
pares, `(34, −17)` e `(37, −18)`. O que falta é o callout do exemplo do Bram
(`src/content/chapters/vida-ferimentos-cura.md:32` · `só morre em <strong>−17</strong>`): o
`[^.]*?` do regex não atravessa ponto, e entre o `PV 34` do começo do callout e o `morre em` do
fim há três.

**A falsificação, feita e desfeita no mesmo fôlego (contrato §2):** troquei o `−17` do callout
por `−99` e rodei. `EXIT=0`, verde, sem uma linha de reclamação. Restaurei do arquivo guardado
antes e conferi `diff` vazio. Um número de morte errado, publicado no capítulo, no exemplo que
é a primeira coisa que um jogador lê, e o portão não o vê. É `CORRIGE 3`.

O conserto cabe nas duas direções e quem escolhe é ela: afrouxar o separador entre o `PV N` e o
`morre em`, ou reescrever o callout para o par ficar na mesma oração, como está na seção "Queda
e Morte". A segunda é a mais barata e não mexe no instrumento.

## 4 · O número que a promessa dizia não repetir está no arquivo que a rodada criou

O item 1 prometeu o limite "derivável e **sem número repetido**", e `regras.json` · `morte`
cumpre isso na régua. Só que o `limiteNota` do mesmo bloco escreve, duas frases depois de
**O NÚMERO NÃO SE ESCREVE em lugar nenhum**, isto: `PV 34 morre em −17 e PV 37 morre em −18`.

**E isso é medida, não leitura:** no ensaio com `limiteDivisor: 4` os três erros saíram
**todos do capítulo**, e nenhum do JSON. O campo de onde o portão deriva a conta continua
publicando a conta antiga, calado, dentro do arquivo que é a fonte da verdade. É o mesmo par
"PV N morre em −X" que o instrumento já sabe conferir, num lugar que ele não lê.

`CORRIGE 4`, e o conserto reusa a máquina que já existe: passar o mesmo extrator de pares sobre
`M.limiteNota`, ou tirar os dois exemplos de lá e deixá-los só no capítulo, que é onde o portão
os confere.

## 5 · O achado do Sangramento · PROCEDE, e ele é maior do que o relatório diz

A afirmação mais cara do relatório está certa, e a cadeia inteira confere:

1. `src/pages/mesa/grid.astro:2828` · `gravarVida: curarPv` · o `ctx` das Artes recebe `curarPv`
   como `gravarVida`, então os dois nomes são a mesma função;
2. `src/pages/mesa/grid.astro:2686` · `const pv = Math.min(c.pv_max ?? antesPv + quanto, antesPv + quanto)`
   · teto e nada mais. Com `quanto` negativo não há piso nenhum;
3. `src/lib/artes-grid-mesa.ts:2104` · `await ctx.gravarVida(c.id, -p.total)` · o tique da
   condição contínua chama justamente com delta negativo;
4. `src/lib/mesa-core.ts:331` · `total += n * porTique` · a conta do tique não olha a Vida
   restante, então o total pode passar dela;
5. `src/pages/mesa/grid.astro:2667` · `SB.from('combatentes').update(campos)` · no ramo do
   mestre a escrita é direta, sem passar por RPC;
6. `supabase/migracao-2.sql:136` · `pv_atual      integer` · sem `check`. O único
   `greatest(0, …)` do esquema está no `jogador_dano` (`supabase/migracao-22.sql:146`), que este
   caminho não usa.

**O escopo da minha medida, dito em voz alta:** li o código e o esquema, e **não exercitei o
caminho em produção**. O que ele exige para acontecer: mestre com o Grid aberto
(`src/lib/artes-grid-mesa.ts:2093` · `if (!ctx.mestre) return`), uma peça com condição contínua,
o relógio andando, e Vida menor que o tique. Um Caído que continua sangrando é o caso comum,
não o raro. Nenhum teste do repositório cobre: `scripts/test-sangramento.mjs` mede a conta pura
e não toca `pv_atual` em lugar nenhum.

**E o que o relatório não viu, que muda o tamanho do achado:** a MESMA varredura existe na aba
Combate. `src/pages/mesa/combate.astro:1529` · `await mexerVida(p.cid, -p.total, true)`, e
`mexerVida` (`src/pages/mesa/combate.astro:1338` · `Math.max(0, Math.min(c.pv_max, c.pv_atual + delta))`)
prende no zero. **Mesma conta, dois gravadores, dois resultados.** E como o `pago` torna o tique
idempotente de propósito (o comentário em `src/lib/artes-grid-mesa.ts:2085` cita as duas abas
abertas como o caso normal), **quem varre primeiro decide** se aquela peça vai a −1 ou para em 0.
A Vida final de um sangrando depende de qual aba o mestre tinha na frente.

Isto não é conserto desta rodada: é `ESCALA 1`. A rodada não tocou nenhum dos dois motores e
prometeu o contrário de construir. O que ela entregou aqui, medindo, foi o número certo e a
direção certa; o que eu acrescento é que a divergência entre as duas telas já existe hoje, e
ela é anterior a qualquer decisão sobre o limite.

Sobre a rodada 74 dela: "a mesa não atravessa o zero em lugar nenhum" está falsificada, pelo
Grid. Ela mesma reportou, com o mecanismo. Não abro item por isso, e vale dito que reportar
contra o próprio relatório anterior é o gesto caro.

## 6 · A medição como medição · nada foi construído

**Estrutural, e não por leitura:** `git diff --name-only 206fcef 8d2787b` devolve seis
arquivos, e nenhum é `src/pages/mesa/`, `src/lib/` ou `supabase/`. Não havia como construir.

**Escopo declarado contra escopo varrido**, refeito por mim: `pv_atual` aparece em seis arquivos
de `src/`. Além dos quatro que ela cobriu, sobram `src/pages/mesa/criaturas.astro:350`
(`pv_atual: pvv`, que CRIA o combatente com a Vida cheia) e `src/pages/mesa.astro:311,358`, que
só lê. Nenhum dos dois baixa Vida, então **a conta de oito pontos fica de pé**, e a correção que
ela fez no meio do item 4 (a aba Combate) era de fato a que faltava.

A correção declarada em voz alta, no instante em que ela percebeu, é o que torna esta medição
utilizável. O escopo primeiro dito estava errado; o corrigido está certo.

## 7 · Duas citações do relatório que não resolvem, e uma delas já viajou

- **`combate.astro:1348` não põe `caido`.** O relatório diz que ali está "o único lugar do
  projeto com gancho de estado no zero (`:1348` põe a condição `caido`…)". O código põe
  `inconsciente` (`src/pages/mesa/combate.astro:1351` · `{ id: 'inconsciente' }`), e `caido`
  existe como **outra** condição em `condicoes.json`. **O molde existe como ela diz**, e o
  argumento sobrevive inteiro; o nome está errado.
  **E ele já saiu do relatório:** `19afbbc`, a decisão da mesa commitada depois do trabalho,
  repete "a mesa já põe `caido` sozinha ao chegar a zero (`src/pages/mesa/combate.astro:1348`)"
  e usa isso como o argumento de que o molde é da própria casa. O argumento continua válido com
  o nome certo, e é por isso que ninguém vai reconferir.
- **`regras.json · arcano.outrasArtes` não existe.** O caminho é `arcano.cura.outrasArtes`
  (conferido no nó). A decisão da mesa acertou o caminho; o relatório não.

`CORRIGE 5`, e é de citação, não de mecanismo.

## 8 · O que os commits FORA da faixa mostram, já que o aviso convidou

Não opino sobre qual leitura de regra é melhor, e as quatro decisões de `19afbbc` não são minhas.
Duas coisas, e as duas são sobre ALCANCE e não sobre conteúdo:

- **A lista "O QUE ISTO MANDA FAZER" manda tirar a cláusula do Letal de `regras.json`, e não
  menciona `src/data/efeitos.json:6049`**, que publica a MESMA cláusula com outras palavras
  (`Curar dano Letal por esta via exige Vida 3`). O relatório dela citava os dois lugares; a
  decisão herdou um. Mesmo defeito de alcance do item 2 acima, no outro sentido.
- **`src/content/chapters/combate.md:111` não está na lista, e é frase NOVA desta rodada:**
  `o dano que passa é um só, e qualquer um dos três mata`. A decisão 2 acabou de criar a exceção
  comprável (o Impacto para no zero para quem tem a Técnica). Uma exceção comprada não falsifica
  a regra geral, e eu **não** estou dizendo que a frase está errada; estou dizendo que ela é
  capítulo publicado que fala de morte por tipo de dano, e que quando o item 2 da lista for feito
  o `combate.md` precisa ser olhado junto, e hoje ele não está escrito em lugar nenhum.

`ESCALA 2`, para o Arquiteto, porque é documento fora da faixa.

---

## O veredito

**PROCEDE**, com cinco `CORRIGE` e dois `ESCALA`. Os quatro itens prometidos foram entregues, e
o mais caro deles (a medição do item 4) está certo no mecanismo e certo na direção. O portão
tem ocasião de verdade, e os vermelhos que eu refiz saem como ela relatou.

**BLOQUEIA:** nada. Nenhum dos cinco impede o que está no ar de ficar no ar.

**CORRIGE**, por ordem de custo para quem lê o jogo hoje:

1. `src/pages/mesa/referencia.astro:170` · a regra velha viva na tela da mesa, cinco linhas
   acima da nova. Uma palavra.
2. a lista de regras órfãs diz duas e são quatro (`mao-de-ferro` + `armas.json:819`,
   `fechar-feridas` + `artes.json:778`). Registro, não regra.
3. o portão não vê o terceiro exemplo do capítulo, medido por falsificação.
4. `regras.json` · `morte.limiteNota` repete os dois pares que a promessa dizia não repetir, e
   nenhum portão o lê.
5. as duas citações que não resolvem (`caido`/`inconsciente`, `arcano.outrasArtes`), sendo que a
   primeira já está dentro de um documento de decisão.

**ESCALA:**

1. as duas varreduras de dano contínuo escrevem por motores diferentes, um com piso e outro sem,
   e quem varre primeiro decide o resultado. Anterior a esta rodada, e a rodada não prometeu
   nada sobre isso.
2. o alcance da lista de `19afbbc`: falta `efeitos.json:6049`, e falta decidir se
   `combate.md:111` entra junto.

**PERGUNTA:** nenhuma. As cinco coisas que o aviso mandou julgar foram medidas, e onde eu não
exercitei o caminho (o Sangramento em produção) está escrito que não exercitei, em vez de
afirmado.
