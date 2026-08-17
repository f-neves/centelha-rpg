# A Centelha do bestiário · o item B10

> Aberto em **2026-08-17**, a partir do **B10** do `Pendencias.md`. Este documento é a fonte de
> verdade da régua de Centelha das criaturas: o que aconteceu, o que foi decidido e como o conserto
> se sustenta sozinho daqui para a frente.

## 1. O que aconteceu

Em 10/08/2026 o `inimigos.json` foi regerado, e **148 criaturas mudaram de Centelha, todas em −1**,
levando junto Defesa, Defesa Social, Defesa Mental, as Absorções e o acerto do pool. Isso entrou no
repositório dentro de um commit sobre fraquezas (`7aad98e`), sem ninguém decidir nada.

A leitura registrada no `Pendencias.md` era que "os números novos são os que a bancada manda; os
antigos é que estavam velhos". **É o contrário.** O regen desfez a Reescala.

### As provas

**A distribuição tem a assinatura do +1.** Antes do regen: 106 no 0, 54 no 1, **nada no 2**, 57 no 3,
41 no 4, 24 no 5, 16 no 6, 5 no 7, 4 no 9, 1 no 10. Depois: o buraco no 2 se fecha e todo mundo
desce uma casa. Um buraco exatamente no degrau que a Reescala **inseriu** só existe se o +1 tiver
sido aplicado por cima do gerado.

**O aviso estava escrito.** `Reescala.md`, Fase 6, no item do bestiário migrado: *"A fonte
`gen-bestiario.mjs` (17 builds inline + `conversao-monstros.html`) ainda tem os valores antigos: se
regerar do zero, reaplicar o +1 nos ≥2."* O regen de 10/08 foi exatamente o "regerar do zero", e o
passo do +1 não foi refeito.

**O Campeão desmente sozinho.** O `Campeão (herói inimigo)`, cujo conceito no próprio gerador é
*"um adversário à altura dos PJs"*, lê **Centelha 2 · Desperto** hoje, e lia 3 antes. Kael, o herói
de referência do `test-kael.mjs`, é Centelha 3 · Herói. O Golem de Ferro conta a mesma história: a
bancada o pôs em 3 na escala velha (16/07), a migração o levou a 4, e hoje ele lê 3.

**Quatro criaturas ficaram tecnicamente impossíveis.** O gerador corta poder por `nivel <= centelha`,
e há quatro criaturas em Centelha 2 carregando Técnica ou Arte de **nível 3**: Assassino das Sombras,
Duelista, Campeão e Mago de Batalha. Uma Centelha 2 não sustenta nível 3.

**Os derivados não têm defeito próprio.** Eles saem da fórmula: a Tarrasque perdeu Defesa 14→13 e
Defesa Mental 28→27 *porque* a Centelha caiu de 10 para 9. Corrigir a Centelha na fonte reconstrói o
resto sozinho, sem delta à mão.

## 2. A decisão

**A régua da Reescala é a válida**, e a correção é a mesma de julho: **+1 em toda criatura com
Centelha ≥ 2**, porque a Reescala **inseriu** um degrau (Desperto, nível 2) e empurrou os de cima.
Quem era Herói continua Herói; o que mudou foi o número do degrau, não a potência.

**Com uma exceção, decidida em 17/08: o degrau 2 passa por triagem, caso a caso.** As 57 criaturas
que hoje leem 2 não sobem em bloco. O motivo é que a régua velha (0 a 5) não tinha onde pôr
"sobrenatural, mas não heroico": tudo que não era Tocado caía no 2. O Desperto existe justamente
para isso, e o `Reescala.md` o deixou vazio à espera de conteúdo. Um Worg, um Dretch e um Lobisomem
não são heróis por decreto de migração.

**A consequência, dita em voz alta:** as criaturas que ficarem no 2 saem uma casa mais fracas do que
estavam em julho, e não só renomeadas. Os jogadores subiram +1 na Reescala (Kael foi de 2 para 3);
quem não subir junto fica um degrau atrás em Defesa, Absorção e acerto. Para tropa é o efeito
desejado, e é por isso que a triagem existe.

### O corte

Sobe para 3 (Herói) quem satisfaz **qualquer** destes:

- **Piso técnico 3.** Carrega Técnica ou Arte de nível 3. Não é julgamento, é aritmética: a Centelha
  2 não sustenta o poder que a criatura já tem na ficha.
- **Ameaça 4 ou mais.** É a régua que o próprio livro usa para dizer o tamanho da briga, e ela
  coincide com o papel: toda `elite` e todo `chefe` do lote está em ameaça 4+, e junto vêm três
  feras de ameaça 4 que o papel sozinho deixaria de fora (Aranha das Fases, Basilisco e Quimera),
  as três criaturas de uma cena inteira.

Fica em 2 (Desperto) o resto: **ameaça 3 ou menos**, que no lote é sempre `soldado` ou `fera`. É
tropa, emboscada e bicho de estrada, sobrenatural sem ser o centro da mesa.

## 3. A triagem das 57

### Sobem para 3 (Herói) · 19

| Criatura | Ameaça | Tipo | Categoria | Fica em | Por quê |
|---|---|---|---|---|---|
| Campeão (herói inimigo) | 6 | chefe | Humano | **3 · Herói** | piso técnico 3 |
| Mago de Batalha | 6 | chefe | Conjurador | **3 · Herói** | piso técnico 3 |
| Gigante da Tempestade | 5 | chefe | Gigante | **3 · Herói** | ameaça 5, chefe |
| Golem de Argila | 5 | chefe | Monstro | **3 · Herói** | ameaça 5, chefe |
| Golem de Pedra | 5 | chefe | Monstro | **3 · Herói** | ameaça 5, chefe |
| Górgona (touro de ferro) | 5 | chefe | Besta mágica | **3 · Herói** | ameaça 5, chefe |
| Treant | 5 | chefe | Planta | **3 · Herói** | ameaça 5, chefe |
| Aranha das Fases | 4 | fera | Besta mágica | **3 · Herói** | ameaça 4, fera |
| Assassino das Sombras | 4 | elite | Humano | **3 · Herói** | piso técnico 3 |
| Assombração | 4 | elite | Morto-vivo | **3 · Herói** | ameaça 4, elite |
| Basilisco | 4 | fera | Besta mágica | **3 · Herói** | ameaça 4, fera |
| Duelista | 4 | elite | Humano | **3 · Herói** | piso técnico 3 |
| Elemental da Terra (Grande) | 4 | elite | Elemental | **3 · Herói** | ameaça 4, elite |
| Golem de Carne | 4 | elite | Monstro | **3 · Herói** | ameaça 4, elite |
| Medusa | 4 | elite | Monstro | **3 · Herói** | ameaça 4, elite |
| Quimera | 4 | fera | Besta mágica | **3 · Herói** | ameaça 4, fera |
| Salamandra | 4 | elite | Elemental | **3 · Herói** | ameaça 4, elite |
| Wyvern | 4 | elite | Dragão | **3 · Herói** | ameaça 4, elite |
| Xorn | 4 | elite | Elemental | **3 · Herói** | ameaça 4, elite |

### Ficam em 2 (Desperto) · 38

| Criatura | Ameaça | Tipo | Categoria | Fica em | Por quê |
|---|---|---|---|---|---|
| Ankheg | 3 | fera | Besta mágica | 2 · Desperto | ameaça 3, fera |
| Barghest | 3 | soldado | Exterior | 2 · Desperto | ameaça 3, soldado |
| Besta Deslocadora | 3 | fera | Besta mágica | 2 · Desperto | ameaça 3, fera |
| Bruxa do Mar | 3 | soldado | Monstro | 2 · Desperto | ameaça 3, soldado |
| Cão Infernal | 3 | soldado | Elemental | 2 · Desperto | ameaça 3, soldado |
| Centauro | 3 | soldado | Monstro | 2 · Desperto | ameaça 3, soldado |
| Cocatriz | 3 | fera | Besta mágica | 2 · Desperto | ameaça 3, fera |
| Dark Stalker | 3 | soldado | Humanoide | 2 · Desperto | ameaça 3, soldado |
| Derro | 3 | soldado | Humanoide | 2 · Desperto | ameaça 3, soldado |
| Doppelganger | 3 | soldado | Monstro | 2 · Desperto | ameaça 3, soldado |
| Drow Noble | 3 | soldado | Humanoide | 2 · Desperto | ameaça 3, soldado |
| Ettercap | 3 | soldado | Aberração | 2 · Desperto | ameaça 3, soldado |
| Harpia | 3 | soldado | Monstro | 2 · Desperto | ameaça 3, soldado |
| Janni | 3 | soldado | Exterior | 2 · Desperto | ameaça 3, soldado |
| Mephit | 3 | soldado | Exterior | 2 · Desperto | ameaça 3, soldado |
| Otyugh | 3 | soldado | Aberração | 2 · Desperto | ameaça 3, soldado |
| Sátiro | 3 | soldado | Fada | 2 · Desperto | ameaça 3, soldado |
| Sombra | 3 | soldado | Morto-vivo | 2 · Desperto | ameaça 3, soldado |
| Wight | 3 | soldado | Morto-vivo | 2 · Desperto | ameaça 3, soldado |
| Yeth Hound | 3 | soldado | Exterior | 2 · Desperto | ameaça 3, soldado |
| Yeti | 3 | soldado | Monstro | 2 · Desperto | ameaça 3, soldado |
| Arconte Lanterna | 2 | soldado | Celestial | 2 · Desperto | ameaça 2, soldado |
| Boggard | 2 | soldado | Humanoide | 2 · Desperto | ameaça 2, soldado |
| Dark Creeper | 2 | soldado | Humanoide | 2 · Desperto | ameaça 2, soldado |
| Diabrete (Imp) | 2 | soldado | Diabo | 2 · Desperto | ameaça 2, soldado |
| Dretch | 2 | soldado | Demônio | 2 · Desperto | ameaça 2, soldado |
| Estrangulador | 2 | soldado | Aberração | 2 · Desperto | ameaça 2, soldado |
| Ghast | 2 | soldado | Morto-vivo | 2 · Desperto | ameaça 2, soldado |
| Homem-Rato (forma humana) | 2 | soldado | Humanoide | 2 · Desperto | ameaça 2, soldado |
| Lobisomem | 2 | soldado | Humanoide | 2 · Desperto | ameaça 2, soldado |
| Morlock | 2 | soldado | Monstro | 2 · Desperto | ameaça 2, soldado |
| Quasit | 2 | soldado | Demônio | 2 · Desperto | ameaça 2, soldado |
| Sahuagin | 2 | soldado | Monstro | 2 · Desperto | ameaça 2, soldado |
| Shocker Lizard | 2 | fera | Besta mágica | 2 · Desperto | ameaça 2, fera |
| Skeletal Champion | 2 | soldado | Morto-vivo | 2 · Desperto | ameaça 2, soldado |
| Skum (Ulat-Kini) | 2 | soldado | Monstro | 2 · Desperto | ameaça 2, soldado |
| Vargouille | 2 | soldado | Exterior | 2 · Desperto | ameaça 2, soldado |
| Worg | 2 | fera | Besta mágica | 2 · Desperto | ameaça 2, fera |

## 4. O conserto

O que falhou não foi o número, foi o **lugar** onde ele foi corrigido. Em julho o +1 entrou como
delta por cima do `inimigos.json`, que é arquivo **gerado**; a fonte ficou na escala velha, e o
primeiro regen apagou a correção sem dizer nada.

Desta vez o +1 entra **onde os números nascem**:

- `conversao-monstros.html`, o campo `cent` de cada criatura da bancada;
- `src/data/conversao-extra.json`, as importadas do Bestiary 1;
- os 17 builds inline do `scripts/gen-bestiario.mjs`.

Com isso `node scripts/gen-bestiario.mjs` ficou **idempotente**, e isso foi verificado byte a byte:
rodar de novo devolve o mesmo arquivo, e não a escala de antes.

**A guarda.** Regerar deixou de ser um ato de fé. O `gen-bestiario.mjs` ganhou um **`--check`** que
gera em memória, compara com o `inimigos.json` commitado e **falha o build na divergência**, dizendo
quantas criaturas divergem e nomeando as cinco primeiras. Ele entrou no `npm run validate` e no
`npm run build`, ao lado dos `--check` que já existiam para os blocos `grid` e para os diagramas.

É esse o conserto do defeito de fundo do B10: o `inimigos.json` continua gerado e continua
commitado, mas agora **mexer na fonte sem regerar quebra o build**, em vez de vazar para o site
dentro do próximo commit sobre outro assunto.

## 5. O que foi feito, em números

**110 criaturas subiram +1**, e nenhuma outra mudou: 91 que já estavam em 3 ou mais, e 19 das 57 do
degrau 2. Os campos alterados são todos os que dependem da Centelha por fórmula, e nada além:
Defesa (110), Absorção (110), acerto do pool (110), Defesa Mental (106), Vontade (101, o resto
esbarra no teto 12), Defesa Social (85, as demais são `-` por Inteligência baixa), e o nível das
Artes (11) e das Técnicas (3), que subiu porque o filtro `nivel <= centelha` afrouxou.

A distribuição final: 106 no 0, 55 no 1, **38 no 2 (Desperto)**, **19 no 3 (Herói)**, 41 no 4,
24 no 5, 16 no 6, 5 no 7, 4 no 9, 1 no 10.

Dois resquícios da escala velha foram corrigidos junto, no `gen-bestiario.mjs`, porque o +1 os fez
morder na hora:

- A nota **"Centelha acima do teto mortal (entidade)"** disparava em `> 5`. Como o teto passou a ser
  6 (Semideus), ela marcaria **16 Semideus como entidade**: Lich, Fênix, Deva Astral, os dragões
  adultos e companhia. Passou a `> 6`, e com isso a nota voltou a cair exatamente sobre as **mesmas
  10 criaturas** de antes da migração, que é o que um deslocamento de régua tem de fazer.
- O nível de Arte da criatura era cortado em `Math.min(..., 5)`, e as Artes têm **seis** níveis desde
  a Fase 6. Passou a 6. **Não muda nenhuma criatura hoje**: nenhuma alcança Arte 6.

## 6. Fica para depois

- **O `inimigos-custom.json` não passa pela régua.** A criatura de exemplo está em Centelha 1, então
  a migração não a tocaria de todo modo, mas o arquivo é escrito à mão e nada garante que a próxima
  entre na escala certa. O `--check` também não a cobre, porque ela é entrada legítima do gerador.
- **O editor de criaturas (`B9`) escreve no `localStorage`**, não na fonte. Criatura ajustada por lá
  continua fora do alcance do `--check`.
