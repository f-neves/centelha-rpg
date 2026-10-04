# Rodada 129 · veredito · a rodada 3 do veterana-1d (a Longa a 3 por dado) e a ESCALA da 128

**Aviso:** a mensagem do Arquiteto. O que revisei:
- **`604d3a6a`**: a ESCALA da 128, a nota da condição Sangrando.
- **`61bf02fe`**: os IDs C1a, LONGA-1, ESPECIALIDADE-LONGA, K9e, ART-30 e ARTE-LONGA, mais a pendência
  G77 e o relato.

Decisões: D-012 e D-034. Fonte: `tmp/veterana/veterana-1d.md`.

Pino `61bf02fe`. Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou (o veredito 128, `eac0a4b9`, está no `main`);
- depois, `switch -C revisora 61bf02fe`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE nos dois.** Nenhum BLOQUEIA e nenhum CORRIGE. Fica uma observação de
pontuação.

## CI (§11)

Workflow `Validar dados e regras`, os dois `completed / success` na tentativa 1:
- `604d3a6a`: run `37187791960`;
- `61bf02fe`: run `37188043368`.

Rodei no pino o `npm run build`, verde (log em `../tmp/revisora/build-129.txt`), e o
`tmp/veterana/scripts/a3_1c.py` (saída em `../tmp/revisora/a3-129.txt`).

## A ESCALA da 128 (`604d3a6a`): PROCEDE

`condicoes.json:136`: "Estabilizar: **Raciocínio + Cura** contra Dif 10, ou Vigor + Resistência em si
mesmo". Agora a condição diz o mesmo que o Cap. IV (`:75`) e o `regras.json:1118`.

## (1) O texto de (e), palavra por palavra no gerado

Usei o verificador da 127, `../tmp/revisora/check-e-127.mjs`. A saída está em `check-e-129.txt`.

| ID | trechos achados | conferência à mão |
|---|---|---|
| C1a | 2 de 2 | a frase da Acumulada e da Longa, e a espada fina: 18 − 12 = 6 por semana, 30 em cinco semanas |
| ESPECIALIDADE-LONGA | 4 de 4 | nada a acrescentar |
| K9e | 1 de 1 | "Semana (8 dias, em Uldun)" |
| ART-30 | 2 de 2 | "Ação demorada" em `combate.md:59`; "numa ação Longa", com a maiúscula do modo, em `coracao:93`, `habilidades.md:93` e `artes/regras.astro:85` |
| ARTE-LONGA | 2 de 2 | nada a acrescentar |
| LONGA-1 | 9 de 16 | os 7 que faltam estão abaixo |

**Os 7 que faltam no LONGA-1:**
- **6 são as linhas da tabela** («| 4 | 2d6 | 6 |» e as outras), que o verificador não compara porque viram
  tabela HTML. No fonte (`acoes-e-sistema.md:103-108`) estão exatas: 6, 9, 11, 12, 15 e 18.
- **1 é o exemplo da página antiga** (item 8). O (e) diz «Decifrar uma página antiga é Hora (Longa). Com
  soma 12 (média 18) contra Dificuldade 5, são 13 acima: duas Margens de sobra.», e "O resto do exemplo
  fica". Ver a observação.

Os outros itens do LONGA-1 estão no gerado:
- a fórmula (1) e a simplificação (1);
- o bônus como número (3);
- a Margem na Longa (4), com o link para a tabela;
- o ferimento e o Desgaste (5);
- a altura (6);
- "Quem escolhe o modo é o Mestre" e o parágrafo (7);
- o Ajudante, "3 por dado, como na Longa" (9).

## (2) Os termos antigos no gerado

Contei com `../tmp/revisora/termos-128.mjs` no `dist/` inteiro. A saída está em `termos-129.txt`.

**Dão 0:**
- "meio ponto é real";
- "cerca de +2";
- "Quem escolhe o modo é o jogador";
- "Ação longa";
- "A cada intervalo você rola";
- "média das jogadas do ajudante";
- "17,5".

**O que sobra com 3,5, e por quê:**

| ocorrência | onde | por quê |
|---|---|---|
| "3,5 por dado" (1) | `acoes-e-sistema`, na frase nova do (e) ("rende um pouco menos do que rolar (3,5 por dado)") | é o próprio texto de (e) |
| "10,5" (1) | `acoes-oficio-e-mundo`, o oficial "soma 6, média 10,5" | mantido de propósito, a G77 lista |
| "3,5" | `acoes-oficio-e-mundo`, a tabela do lote (`:63`) e os tempos "3,5 dias" (`:158`, `:160`) | mantidos, G77: a tabela do lote e os tempos do Ofício |
| "× 3,5" (2) | `quase-acerto` e `mesa/referencia` | é o dano médio da arma no Quase-Acerto (`dado × 3,5 + danoBonus`), e não a Longa |
| "12,5" (2) | `custo-servicos` e `artes/regras` | em `custo-servicos` são as jornadas de aula do Atributo 4 (XP 25 ÷ 2); em `artes/regras`, uma célula de chance da tabela de sair da área. Nenhum dos dois é a Longa |

Fora disso, a economia gerada continua a 3,5 por construção (`lore/economia/v2/base.py:22-23`,
`media(soma)`), como a G77 registra. Ninguém mexeu nela.

## (3) A tabela, contra `a3_1c.py`

| soma | dados | o script ("nova") | o livro |
|---|---|---|---|
| 4 | 2d6 | 6 | 6 |
| 6 | 3d6 | 9 | 9 |
| 7 | 3d6+2 | 11 | 11 |
| 8 | 4d6 | 12 | 12 |
| 10 | 5d6 | 15 | 15 |
| 12 | 6d6 | 18 | 18 |

Os números do texto também conferem:
- a altura: soma 12 (18) avança até a Dificuldade 17, e soma 6 (9) até a 8;
- Decifrar: 18 − 5 = 13, duas Margens;
- a espada fina: 18 − 12 = 6, cinco semanas.

## (4) Referências cruzadas

- **`#longa`.** É usado por `artes/regras.astro:85`, e o `dist/regras/acoes-e-sistema/` tem
  `id="longa"`.
- **`#o-que-a-margem-compra-fora-do-combate`.** É o link novo da seção Longa, e o id existe.
- **`#acumulada`.** É usado pelo Esgueirar (`acoes-sentidos-e-engano.md:77`), e o id existe.
- **O Cap. I e o Cap. VIII dizem a mesma conta**, "3 por dado, mais 2 se a soma for ímpar".
- **A Especialidade +2 na Longa** está dita igual em três lugares: Cap. I (`:93`), Habilidades (`:93`) e
  Ofício (`:102`).

## (5) Economia e calculadora: não foram tocados

`git diff --stat eac0a4b9 61bf02fe` sai vazio em:
- `lore/economia`;
- `scripts/copiar-economia.mjs` e `scripts/gen-cap-economia.mjs`;
- `src/data/recompensas.json` e `scripts/test-recompensa.mjs`;
- `src/lib`.

Os dois commits não mexem em código nenhum.

## (6) Travessão e "Perícia"

- **Travessão.** Contei o caractere no arquivo inteiro, no `eac0a4b9` e no pino, em todo arquivo que os
  dois commits tocam. Os números ficaram iguais em todos.
- **"Perícia".** Nas linhas acrescentadas pelos dois commits, contada em `rtk proxy git diff`, dá zero.

## Observação, sem rótulo

**O exemplo da página antiga** (`acoes-e-sistema.md:54`):
- **O que ficou:** "[...] são 13 acima: duas Margens de sobra: o jogador pode dividir entre eixos
  [...]". São dois dois-pontos seguidos.
- **O que o (e) diz:** "duas Margens de sobra." com ponto, e "o resto do exemplo fica".
- **Como ler:** as palavras estão lá, e o ponto do (e) virou dois-pontos para emendar o resto, que
  começa com "o jogador". O conserto é trocar o segundo dois-pontos por ponto e pôr maiúscula em "O
  jogador". Fica para quem mexer na página.

## Depois do pino (§10)

Entre o pino e o push entrou `5c296040` (registro D-036 a D-039, `.gitignore` e dois arquivos sem dono). Ele não toca nada do que julguei, e por isso rebaseei.

## Limpeza

O build ficou só no meu `dist/`. Os scripts e as saídas estão em `../tmp/revisora/`. Nenhum arquivo
versionado tocado além deste e do `progresso-revisora-129.md`.
