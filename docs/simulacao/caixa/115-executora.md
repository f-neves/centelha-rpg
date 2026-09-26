# Rodada 115 · Executora · recompensas de caça (regra, dados, calculadora) e a pendência do bestiário

- **Despacho:** `docs/simulacao/caixa/115-despacho.md` (`7cd7dfe`).
- **Árvore:** branch `executora`, posta em `7cd7dfe` depois de o `merge-base --is-ancestor` dar
  verdadeiro. A rodada 116 chegou no meio. Ela foi publicada antes, em separado (`39e558e`, relato
  em `116-executora.md`), e esta rodada foi posta de volta por cima dela e regerada.
- **Progresso:** em `progresso-115.md`, com as horas lidas da máquina.
- **Publicado:** num commit só, com este relato.
- **Parada, e a decisão do autor:** o caso 2 da tarefa 5 divergia (2.250 exato contra 2.300 pelo
  `arred`). Parei, perguntei, e o autor decidiu que a bolsa segue sempre o `arred`: o caso 2 é
  **2.300**.

## Tarefa 1 · a pendência do bestiário

**B14** em `docs/pendencias/B-bestiario.md:109`. B14 estava livre (o maior era B13). O texto do
autor foi copiado do despacho por script, sem alteração, como "Proposta do autor (DECIDIR)". O achado
também foi conferido no dado, e está escrito como achado:
- o desafio é o campo `ameaca` de `src/data/inimigos.json`, de 1 a 6 nas 309 criaturas;
- a `centelha` vai de 0 a 10, e só a `mon-tarrasque` está em 10;
- o fator da recompensa é o `REC_FATOR` de `lore/economia/v2/modelo.py:447`.
`Pendencias.md` regerado (223 → 224 abertos).

## Tarefa 2 · "Caça e recompensas" no livro

`src/content/chapters/custo-servicos.md:36`, seção `###` logo depois do bloco das tarifas e antes
do dos serviços. O texto é o do autor, **só com formatação**:
- a fórmula virou `<p class="formula">`;
- as listas viraram listas, com o "a) b) c)" do item 1 mantido como está;
- os títulos dos itens foram para negrito.

**O que é gerado, e não digitado:**
- `<!-- gen:economia-recompensas -->` (`:52-62`): a tabela do Valor do degrau, de 1 a 12, de
  `recompensas.json`;
- `<!-- gen:economia-recompensas-capacidade -->` (`:77-95`): Livre/Ano × urgência por faixa, de
  `renda.json` e das urgências de `recompensas.json`.
- **São dois marcadores, e não um**, porque as duas tabelas ficam em lugares diferentes do texto (o
  item 2 e o teste de Capacidade).

**O que acrescentei ao texto do autor, e por quê** (duas frases de navegação, nenhuma regra):
- "A conta inteira, passo a passo, está na [Calculadora de Recompensa](/recompensa)." É o link que
  o despacho pede.
- No fim da seção, um link para "Recursos durante a aventura". O motivo: o bloco "Recursos durante
  a aventura" do texto do autor foi para a página 1 (tarefa 3), e **não está repetido aqui**, para
  não haver duas cópias da mesma regra.

**Pedido extra do autor, conferido:** o texto do capítulo **não tem nenhum exemplo de bolsa acima
de 1.000 pc**. O único número acima de 1.000 fora das tabelas é a capacidade da aldeia ("40 casas de
Braçal junta cerca de 12.000 pc por ano"), que não é bolsa. Pela conta de hoje, 40 × 308 = 12.320;
o texto do autor diz "cerca de" e ficou como está.

## Tarefa 3 · a regra antiga substituída

**Só uma ocorrência**. Procurei "custo de vida da faixa continua", "não tem renda" e "Semanas de
aventura" em `src/`, e o resto era o link.

| onde | antes | depois |
|---|---|---|
| `src/content/chapters/custo-de-servico-e-itens.md:67-74` | "### Semanas de aventura", com os quatro itens: não tem renda; o custo de vida da faixa continua; quem não tem casa fixa não paga; semana parcial proporcional. E a frase "Aventurar custa caro..." | "### Recursos durante a aventura" (`:67`), com os três itens do autor |
| `src/content/chapters/acoes-oficio-e-mundo.md:254` | `[Semanas de aventura](/regras/custo-de-servico-e-itens#semanas-de-aventura)` | `[Recursos durante a aventura](/regras/custo-de-servico-e-itens#recursos-durante-a-aventura)` |

O título mudou para dizer o que o bloco novo é. A âncora nova (`recursos-durante-a-aventura`) existe
no `dist/`, e os dois links que apontam para ela (o do Ofício e Mundo e o da seção de caça)
resolvem.

## Tarefa 4 · os dados

- **`lore/economia/v2/modelo.py`**, seção "RECOMPENSAS DE CAÇA":
  - base 15, fator 1,75, e os 12 degraus por `arred(15 × 1,75^(n − 1))`;
  - passo de Centelha 4, até 12;
  - as fracas contam 0,5 e são as de até 2 abaixo da mais forte;
  - 8 dias por semana e grupo de 3;
  - as listas de tarefa e risco (id, nome, multiplicador, descrição), de tom e de urgência.
  **Os 12 degraus batem exatamente com o `arred` da fórmula**: 15, 25, 45, 80, 140, 250, 430, 750,
  1.300, 2.300, 4.000 e 7.100 (os crus eram 15; 26,2; 45,9; 80,4; ...; 7.071,5). Não houve desvio a
  documentar.
- **`lore/economia/v2/base.py`**: a régua do `arred` passou a ser uma tabela (`ARRED_DEGRAUS`), com
  o mesmo comportamento. **Por quê:** o `recompensas.json` leva essa tabela em `arredondamento`, e a
  calculadora arredonda pela mesma régua sem digitar os degraus de novo. A troca não mudou nenhum
  outro JSON (o `copiar-economia` regerou os sete antigos iguais).
- **`lore/economia/v2/gerar.py`** escreve `recompensas.json`. O **`scripts/copiar-economia.mjs`**
  ganhou a `_nota` dele, e o `--check` agora compara 11 arquivos, este incluído. O arquivo só existe
  pelo `gerar.py`.
- **A tabela de capacidade não é duplicada:** o `recompensas.json` guarda só as urgências, e o
  Livre/Ano vem de `renda.json`, tanto no capítulo quanto na calculadora.
- **`scripts/validate-data.mjs`**: esquema `.strict()` novo para `recompensas.json` (o valor do
  degrau como `{por, preco}`, e o resto como parâmetro numérico).

## Tarefa 5 · a calculadora

- **A conta** está em `src/lib/recompensa.ts` (`calcularRecompensa`, `valorDoDegrau`, `arred`).
  Ela recebe o objeto de entrada e os parâmetros do JSON, sem ler o DOM, e sem nenhum número da
  regra no código.
- **A página** é `src/pages/recompensa.astro`, fina, no padrão do rolador, com o componente
  `src/components/CalculadoraRecompensa.astro`. Ela mostra:
  - as entradas pedidas;
  - a bolsa e o valor por caçador;
  - o recibo passo a passo (quantidade, Centelha, degrau, valor, semanas, multiplicadores, conta
    exata, arredondamento e divisão);
  - abaixo, a tabela de capacidade.
- **Registro:** `FERRAMENTAS` em `src/lib/site.ts:98`. O link a partir do capítulo está na seção de
  caça, e a página aponta de volta para `custo-servicos#caça-e-recompensas`.
- **O teste automático:** `scripts/test-recompensa.mjs`, no `npm run validate`, chama a mesma
  função que a página. Ele tem os 5 casos, a igualdade dos 12 degraus com a fórmula, o degrau 13
  pela fórmula e a regra de quantidade.

**Os 5 testes, esperado contra calculado** (tom padrão, outro ×1, grupo 3). Rodados na função e,
por puppeteer, **na própria página** (`../tmp/executora/t-calc115.mjs`), com o mesmo resultado e
nenhum erro de página:

| # | degrau | semanas | bolsa exata | bolsa esperada | calculada | por caçador |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 6 | 2,0 | 1.500 | 1.500 | 1.500 | 500 |
| 2 | 6 | 2,0 | 2.250 | **2.300** (decisão do autor; o despacho dizia 2.250) | 2.300 | 767 |
| 3 | 5 | 1,0 | 630 | 630 | 630 | 210 |
| 4 | 3 | 2,5 | 675 | 680 | 680 | 227 |
| 5 | 2 | 1,0 | 75 | 75 | 75 | 25 |

## Verificação

- `npm run validate` e `npm run build` verdes.
- **Prova no `dist/`:**
  - `regras/custo-servicos`: a tabela de degraus (15 ... 7.100) e a de capacidade, lidas célula a
    célula (Braçal 308 / 924 / 3.080; Doutor 1.404 / 4.212 / 14.040; Aristocrata 3.192 / 9.576 /
    31.920; Nobreza 4.800 / 14.400 / 48.000, já com o Livre da 116); e o link para `/recompensa`.
  - `recompensa/index.html` existe, e o link dela aparece na barra de Ferramentas.
  - A seção "Recursos durante a aventura" mostra o texto novo.
- Travessão: zero nos arquivos novos e tocados. O " — Centelha" do título da aba vem do `Base.astro`
  de sempre, e não é texto meu.

## PRECISA DE MIM

Nada. Para a Leitora-novata: depois deste relato, peço que ela rode os 4 primeiros casos na
calculadora e diga o que a bolsa representa.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
