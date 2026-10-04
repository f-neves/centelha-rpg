# Rodada 130 · veredito · rodada 4 do veterana-1e, D-037 e D-040

**Aviso:** a mensagem do Arquiteto. Commits:
- `d3ad7ca7`: D-037, a condição Morrendo vira marcador, e a pontuação da 129;
- `58b22ce4`: D-040, o limite de criação sem pico;
- `6781f6b9`: a rodada 4 do veterana-1e, com C4a, QUEDA, C3a e K10. É o foco.

Fonte: `tmp/veterana/veterana-1e.md`, Parte D, rodada 4, e `scripts/a4_queda_manobra.py`. Conferido contra
o `main` (o fonte), e também contra o gerado de um build meu.

Pino `6781f6b9`. Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou (o veredito 129, `c4ab6eac`, está no `main`);
- depois, `switch -C revisora 6781f6b9`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE nos três.** Nenhum BLOQUEIA e nenhum CORRIGE. **O aviso da Executora sobre a
seção C4a do script procede:** a seção está velha, e o (e) está certo.

**Fora do que você pediu, e não revisados:** entre o meu veredito anterior e o pino entraram também
`7ab6c733` (D-036, as faixas de Vida) e `5df8c7d5` (D-038, o mortal-tocado pela amplitude).

## CI (§11)

Workflow `Validar dados e regras`, os três `completed / success` na tentativa 1:
- `d3ad7ca7`: `37190093008`;
- `58b22ce4`: `37190844735`;
- `6781f6b9`: `37191729074`.

Rodei no pino:
- `npm run build`, verde (log em `../tmp/revisora/build-130.txt`);
- `a4_queda_manobra.py` (saída em `../tmp/revisora/a4-130.txt`);
- o verificador de (e) da 127, agora apontado para o 1e (saída em `check-e-130.txt`).

## Rodada 4 (`6781f6b9`): PROCEDE

### C4a · Escalar, Direta e Acumulada

**O (e), no fonte:**
- **Item 1:** o parágrafo **Direta** entrou em `acoes-corpo-e-movimento.md:16`, palavra por palavra. Diz
  "superar a Dificuldade da superfície mais a altura em metros, menos 1", e dá o exemplo "Direta 16: o 17
  que sobe de primeira na Acumulada supera 16 aqui". O link para a Área do Mestre também está lá.
- **Item 2:** `mestre.astro` ganhou a coluna "Altura de referência", com 5 m, 6 m, 8 m e 11 m nas quatro
  linhas de Escalar e vazia nas outras, e a nota "Escalar na Direta: Dificuldade da superfície (Cap. VIII)
  + altura em metros − 1. Para outra altura, refaça a conta." Os 8, 12, 18 e 24 não mudaram. A tabela
  social não ganhou a coluna, e está certo.
- **Item 3:** `coracao-do-sistema.md:81` diz agora "uma muralha de pedra lavrada de 4 m (Dificuldade 7 +
  4 − 1 = 10, Direta)", e o resto do exemplo ficou.

**A conta N = D + h − 1:**

| linha da Área do Mestre | N | superfície do Cap. VIII | D | h |
|---|---|---|---|---|
| parede rústica | 8 | corda com nós | 4 | 5 (4 + 5 − 1) |
| pedra comum | 12 | pedra lavrada | 7 | 6 (7 + 6 − 1) |
| muralha bem-feita | 18 | tijolo bem assentado | 11 | 8 (11 + 8 − 1) |
| lisa ou molhada | 24 | vidro, gelo sem equipamento | 14 | 11 (14 + 11 − 1) |

As quatro fecham.

**O exemplo do Cap. I:** 7 + 4 − 1 = 10, e o 17 de Kael supera 10 por 7, que é uma Margem, como o texto
diz.

**O aviso da Executora sobre o script: procede.** A seção "C4a" do `a4_queda_manobra.py` imprime "Direta =
Dif da superficie + altura":
- **Não tem o −1.**
- **Pareia de outro jeito:** pedra comum 7 + 5, muralha bem-feita **7** + 11, lisa 14 + 10.
- **Dá "Direta 17"** para a muralha de 10 m, contra 16 no (e).

O (e) justifica o −1 na seção (c), e a justificativa está certa pelo próprio livro:
- a Acumulada fecha quando o progresso (total − D) **alcança** o Acúmulo h, ou seja, total ≥ D + h;
- a Direta pede total que **supera** N, ou seja, total ≥ N + 1;
- as duas coincidem em N = D + h − 1.

A tabela do (c) pareia pelos nomes das superfícies, e a do script não: no script, a muralha bem-feita sai
da Dificuldade 7, e não da 11 do "tijolo bem assentado". Com isso, a conta do (e) fecha sozinha, e o
script é que ficou para trás. Aplicar o (e) e não o script foi o certo.

**Sugestão, para não induzir a próxima conferência ao erro:** atualizar a seção C4a do script, ou marcá-la
como superada.

### QUEDA · desmaio e morte

**O (e), no fonte:** a tabela tem as colunas "Desmaia a partir de" e "Morre a partir de":

| quem cai | desmaia | morre |
|---|---|---|
| Pessoa comum | 15 m | 23 m |
| Robusto | 19 m | 28 m |
| Herói | 24 m | 36 m |
| Colosso | 26 m | 38 m |

Logo abaixo vem a frase "Desmaia é cair a 0 PV [...] morre é chegar a −(PV máximo ÷ 2), como no Cap. IV",
e a calibragem diz "cerca de metade dos adultos morre sem socorro [...] e a morte vem aos 23".

**Contra o script:** desmaio 15/19/24/26 e "morre" 23/28/36/38, iguais.

| quem cai | limite de morte | dano bruto para morrer |
|---|---|---|
| Pessoa comum | −15 | 48 |
| Robusto | −18 | 59 |
| Herói | −22 | 73 |
| Colosso | −22 | 77 |

A Centelha decide o arredondamento: o Herói, com Centelha 2, morre em −22 (43 ÷ 2 = 21,5, para cima), e o
Robusto, com Centelha 0, em −18 (37 ÷ 2 = 18,5, para baixo).

**A pessoa comum, metro a metro** (script): 15 m dá PV 0, 22 m dá −14 (viva) e 23 m dá −16 (morta).

### C3a · Amortecer

**A tabela no fonte** (`:141-149`):

| altura | sem jogada | sucesso | uma Margem | duas Margens |
|---|---|---|---|---|
| 7 m | 16 | 7 | 0 | 0 |
| 10 m | 22 | 13 | 7 | 0 |
| 15 m | 33 | 24 | 18 | 11 |
| 20 m | 43 | 35 | 29 | 22 |
| 30 m | 63 | 55 | 49 | 43 |
| 50 m | 98 | 91 | 86 | 81 |

É a coluna "novo" do script, linha a linha. A frase da interpolação para baixo entrou antes da tabela.

**O último parágrafo do Amortecer:** "um sucesso empurra 4 m para cima a altura do desmaio e a da morte (a
pessoa comum passa de 15 para 19 m e de 23 para 27)". O script dá "sucesso tira o desmaio de 15 a 18 m;
tira a morte de 23 a 26 m": as alturas novas são 19 e 27. Confere.

### K10

`acoes-corpo-e-movimento.md:104`: "Dano de **Impacto**: o valor da tabela menos a Absorção. A Absorção
natural de Impacto é o Vigor (+ Centelha), mais a da armadura." É o (e).

### No gerado

O verificador achou K10 inteiro, os parágrafos de C4a e QUEDA e as frases do C3a. O que ele não achou:
- as linhas das tabelas, que ele não compara porque viram tabela HTML. Conferi no fonte, acima;
- o texto velho "Para escalar um muro liso (Dificuldade 10)", que sumiu.

**Termos velhos no `dist/`, todos 0:**
- "muro liso";
- "morre numa queda";
- "decide se você vive";
- "vira consolo";
- a frase cortada "mais a armadura" sem ponto.

"Morre a partir de" aparece 1 vez, que é a coluna nova.

## D-037 (`d3ad7ca7`): PROCEDE

- **A condição Morrendo** (`condicoes.json:181-183`): saiu o `porSeisTicks: 1`, e a nota ficou na
  redação da decisão, "0 PV ou menos, entre a vida e a morte; ver Tratar."
- **Ninguém lê o `porSeisTicks` de Morrendo pelo nome.** O `mesa-core.ts:227` soma o `porSeisTicks` de
  qualquer condição aplicada: com a Morrendo sem o campo, ela passa a somar 0, e a perda fica só na
  Sangrando (`:135`), como a D-037 manda. O `grid.astro` só usa "morrendo" como estado fora da fila. O
  `test-sangramento.mjs` não cita a Morrendo.
- **A pontuação da 129:** `acoes-e-sistema.md:54` agora diz "duas Margens de sobra. O jogador pode
  dividir...". Fechado.

## D-040 (`58b22ce4`): PROCEDE

- **Criação.**
  - O Passo 4 e o Passo 5 dizem que vale o máximo normal da ficha, 6, com o ajuste da raça (+1 vai a
    7, −1 não passa de 5).
  - "Limites na criação" diz a decisão: nenhum limite próprio, quase tudo até 6, Vontade e Aparência até
    12, e os ajustes raciais.
  - O parágrafo do pico saiu, e os "(pico)" saíram dos quatro exemplos.
  - Os quatro exemplos continuam válidos: nenhum traço passa de 6.
- **Raças** (`racas.md:10`, `:21`): saíram o "sem gastar o pico" e o "5 na criação fora do pico".
- **`regras.json` `limitesCriacao`:** saíram `atributo`, `habilidade`, `picoAtributo`, `picoHabilidade`,
  `picoQuantidade` e `notaPico`, e entrou uma `nota` da D-040.
  - Nenhum código nem teste lê esses campos: procurei o nome de cada um em `src` e `scripts`. Só o
    `criacao-de-personagem.md:126` cita `limitesCriacao.centelha`, que ficou.
  - A ficha já não tinha modo de criação: o `capFor` dá teto 6 mais o racial.
- **Varredura de "pico" e de teto 5/4 em `src`:** o que sobra é a palavra comum. Exemplos: "o pico do
  esforço", em Atributos; "o pico mortal", em Centelha; "Pico humano", na régua dos Atributos; "típico".
  Não sobra nenhum teto de criação.
- **A Centelha com teto 3 e o teto 3 de Recursos e Artefato ficaram, de propósito:** são escolhas do autor
  ainda abertas, e não defeito.
- **Uma frase a mais, sem rótulo:** em "Limites na criação" entrou "O que segura o personagem novo é o
  orçamento de XP.", que não está na fala do autor. É consequência direta da regra, e não muda número
  nenhum.

## Travessão e "Perícia"

- **Travessão no arquivo inteiro,** antes (`d3ad7ca7~1`) e no pino: só o `regras.json` mudou, de 21 para
  20, porque a `notaPico` que saiu tinha um.
- **Linhas acrescentadas pelos três commits** (`rtk proxy git show`): 0 travessão e 0 "Perícia".

## Limpeza

O build ficou no meu `dist/`. Ajustei o verificador da 127 para ler a fonte por variável de ambiente
(`FONTE`). As saídas estão em `../tmp/revisora/`. Nenhum arquivo versionado tocado além deste e do
`progresso-revisora-130.md`.
