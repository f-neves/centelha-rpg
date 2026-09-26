# Rodada 117 · despacho · correções de texto em "Caça e recompensas" (resposta aos 5 pontos da Leitora-novata) e o "Parte por caçador"

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, respondendo aos cinco pontos que a leitura da Leitora-novata
trouxe na rodada 115 (confirmados de forma independente pela Revisora, no mesmo veredito, item da
criatura "fraca"), mais um sexto ponto da própria Revisora (a colisão de nome com "Livre"). **São
correções de texto**, sem mudar fórmula nem valor calculado (com uma exceção de rótulo, item 6).
Pino: `09a1deb`.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## 1 · "Recursos durante a aventura" · substituir o bloco inteiro

**Onde:** `src/content/chapters/custo-de-servico-e-itens.md`, a seção que a rodada 115 escreveu
(hoje `:67`, confira o número). **Sai o texto de lá**, entra este, **cole como o autor escreveu,
ajuste só formatação**:

> Recursos durante a aventura
> 1. O personagem nunca paga o custo de vida à parte. Ele recebe Livre, de uma ou mais fontes, e é
>    só isso que anota.
> 2. A bolsa é o Livre do trabalho inteiro. Ela ocupa as semanas estimadas no contrato.
> 3. Recursos 1 a 3 é trabalho próprio: nas semanas do contrato, não rende. O personagem recebe só
>    a bolsa.
> 4. Recursos 4 a 6 é renda de propriedade, que rende sem o dono presente: o Livre de Recursos
>    continua entrando, somado à bolsa.

Note a mudança de sentido do item 4 em relação ao texto antigo: **antes** dizia "continua
pagando" (o custo, ambíguo); **agora** diz que o Livre de Recursos **continua entrando**, somado
à bolsa. É o ponto que a Leitora-novata não entendeu, resolvido pelo autor.

## 2 · Despesas · substituir o item da comida

**Onde:** o item de "Despesas e partes" que fala de comida e pouso (dentro da seção "Caça e
recompensas", `custo-servicos.md`). Substitua por:

> Comida e pouso na estrada nunca são cobrados: fazem parte do custo de vida, que a bolsa já
> descontou. Em terra sem suprimento, o Mestre pode exigir que o grupo leve rações; aí contam o
> peso e os dias de autonomia, não o preço. Munição, cura, reparo, transporte, iscas e cães saem
> da bolsa.

(O resto do item de despesas, sobre a parte da criatura vendida, fica como está.)

## 3 · A regra de quantidade · substituir o item 1b

**Onde:** o item "1. Degrau = desafio + quantidade + Centelha", sub-item **b) Quantidade**.
Substitua por:

> Quantidade: criaturas com desafio até 2 abaixo da mais forte contam inteiras; as mais fracas que
> isso contam metade. Some tudo e ganhe +1 cada vez que o total dobra (2 +1, 4 +2, 8 +3, 16 +4).

Isto não muda a conta (a calculadora já faz exatamente isto: `fortes + fracas × 0,5`, depois
`piso(log2(...))`); só deixa a frase sem a leitura dupla que a Leitora-novata e a Revisora
apontaram. **Confira que o campo "Criaturas fracas" da calculadora** (ou o texto ao lado dele,
`src/components/CalculadoraRecompensa.astro`) diz, mesmo que resumido, o que conta como fraca
("desafio mais de 2 abaixo da mais forte"), para quem usa a página sem ler o capítulo: foi o
achado da própria Leitora-novata ("pela página sozinha, a resposta é não").

## 4 · Semanas · acrescentar uma frase

**Onde:** o item "3. Semanas", ao final. Acrescente:

> A viagem conta metade porque é tempo gasto, não perigo: paga o tempo, sem o prêmio de risco.

## 5 · Depois dos três testes · acrescentar um parágrafo

**Onde:** logo depois do item "Três testes antes de fechar o valor" (os três: Prejuízo,
Capacidade, Oferta). Acrescente:

> A bolsa por semana é alta de propósito: paga o risco e o tempo sem trabalho entre uma caçada e
> outra. Compare com os pares do grupo, não com um trabalhador: o degrau 6 paga 250 pc por semana,
> perto do Livre de uma Nobreza (200). O que impede todo mundo de virar caçador são os três
> testes, principalmente a oferta.

## 6 · "Parte por caçador" (ponto da Revisora)

**O achado:** `src/data/recompensas.json`'s `_nota` descreve o valor do degrau (a tabela de 1 a
12, arredondada por `arred`) como "**o Livre por caçador** por semana". Esse "Livre" colide com o
nome já usado nas tabelas de Renda e Serviços (que é outra grandeza, com outra regra de
arredondamento desde a 116). **Não é o mesmo valor** que o campo final da calculadora
(`bolsa ÷ grupo`), que hoje já aparece como só "por caçador" (`CalculadoraRecompensa.astro:64` e
`:73`).

Duas mudanças de nome, **nenhuma de fórmula**:

1. **No `_nota` de `recompensas.json`** (via `lore/economia/v2/gerar.py`, não editado à mão):
   troque a frase que chama o valor do degrau de "Livre por caçador" por algo que não use a
   palavra "Livre" (ex.: "o valor de base por caçador", ou "a tarifa por caçador"; escolha o que
   ficar mais claro e diga qual escolheu). **Este valor continua arredondado por `arred`, sem
   mudança de fórmula.**
2. **Na calculadora e em qualquer texto do capítulo que rotule o resultado final** (`bolsa ÷
   grupo`, hoje só "por caçador"): renomeie para **"Parte por caçador"**. **Confirme que o valor
   já é** `bolsa ÷ tamanho do grupo, inteiro, meio para cima` (não `arred`): é o que
   `recompensa.ts:57` já faz (`Math.floor(bolsa / grupo + 0.5)`); **não mude a fórmula**, só o
   rótulo, nos dois lugares que hoje dizem "por caçador" sem o "Parte" (linhas 64 e 73 do
   componente, confira se há mais alguma).

**Confira**, com um `grep` de "Livre" perto de "degrau"/"caçador"/"recompensa" em `src/`,
`scripts/` e `lore/economia/v2/`, que não sobrou nenhuma outra ocorrência da colisão de nome.

## Verificação

- `npm run validate` e `npm run build` verdes.
- Prova no `dist/`: os cinco textos novos (seções 1-5) lidos na página, palavra por palavra contra
  este despacho.
- A calculadora mostra "Parte por caçador" (ou o rótulo escolhido) com o mesmo valor de antes (os 5
  testes da 115 continuam batendo: 1.500, 2.300, 630, 680, 75, com os "por caçador" 500, 767, 210,
  227, 25 sem alteração de número).
- `recompensas.json` não tem mais a palavra "Livre" na descrição do valor do degrau.
- Travessão: zero nas linhas novas.

## O relato

Pode entrar como continuação de `115-executora.md` (uma seção "Rodada 117") ou um
`117-executora.md` próprio, como preferir: os cinco textos antes/depois (arquivo:linha), o rótulo
escolhido no item 6.1, e a prova de que os 5 valores da calculadora não mudaram.

Depois do relato: peça à **Leitora-novata** para reler só os trechos novos (não a seção inteira de
novo) e dizer se as dúvidas 1, 2 e 4 da leitura anterior (Recursos 4-6, comida na estrada, e o
"fraca") ficaram claras agora.
