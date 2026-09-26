# Rodada 115 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto. Ela nomeia o despacho (`7cd7dfe`) e o
trabalho com o relato (`8e49a7d`). O `86b3dd8`, que tira um travessão do relato, também entra.
Pino: `86b3dd8`. Passo 0 pelo §0.1 (`merge-base --is-ancestor HEAD origin/main` passou), depois
`switch -C revisora 86b3dd8`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. O que o Arquiteto pediu confere, por
conta minha: os 12 degraus e as 5 contas. Há duas observações, e nenhuma é defeito (§5).

## CI (§11)

Workflow `Validar dados e regras`, acompanhado até o fim, os dois `completed / success`:

| commit | run |
|---|---|
| `8e49a7d` | `36234189011` |
| `86b3dd8` | `36234229708` |

## 1 · Os 12 degraus e os 5 testes

**A conta é minha**, escrita à parte, e não a `recompensa.ts` dela.

**Os degraus:** `arred(15 × 1,75^(n − 1))` para n de 1 a 12 dá **15, 25, 45, 80, 140, 250, 430,
750, 1.300, 2.300, 4.000 e 7.100**. É o que está no `recompensas.json` e na tabela gerada do
`dist/regras/custo-servicos`, célula por célula. O 13 dá 12.400 pela mesma fórmula.

**Os 5 testes** (tom 1, outro 1, grupo 3), com a regra do despacho: quantidade efetiva, passo
`piso(log2)`, Centelha ÷ 4, semanas = máx(1, caçada) + viagem ÷ 16, e a bolsa pelo `arred`:

| # | degrau | semanas | exata | bolsa | por caçador |
|---|:---:|:---:|:---:|:---:|:---:|
| 1 | 6 | 2,0 | 1.500 | **1.500** | 500 |
| 2 | 6 | 2,0 | 2.250 | **2.300** | 767 |
| 3 | 5 | 1,0 | 630 | **630** | 210 |
| 4 | 3 | 2,5 | 675 | **680** | 227 |
| 5 | 2 | 1,0 | 75 | **75** | 25 |

**Batem com o relato**, inclusive o caso 2 pela decisão do autor (o `arred` de 2.250 na faixa de
passo 100 sobe para 2.300). O `scripts/test-recompensa.mjs` está verde no pino (9 asserções) e roda no
`validate`.

**A `recompensa.ts` não tem número da regra:** base, fator, degraus, multiplicadores e a régua do
arredondamento vêm todos do JSON, e a régua é a mesma tabela `ARRED_DEGRAUS` do `base.py`.

## 2 · O texto do autor e a regra antiga

- **O texto de "Caça e recompensas" é o do autor.** Comparei palavra por palavra, em ordem, contra o
  bloco do despacho: 561 das 572 palavras estão no livro na mesma sequência. As 11 que faltam são os
  valores da tabela de degraus, que foi gerada e não digitada, como o despacho manda.
- **A regra antiga saiu:** "custo de vida da faixa continua" e "não tem renda" não existem mais em
  `src/`.
- **A seção virou "Recursos durante a aventura"** (`custo-de-servico-e-itens.md:67`). A âncora
  `recursos-durante-a-aventura` existe no `dist/`, e os links do Ofício e Mundo e da seção de caça
  apontam para ela.

## 3 · Os dados e a capacidade

- **O `recompensas.json` só existe pelo `gerar.py`:** o `copiar-economia --check` compara 11
  arquivos, e está verde.
- **A tabela de capacidade no `dist/`** é o Livre/Ano do `renda.json` vezes a urgência. Ela já usa o
  Livre da 116: Doutor 1.404 / 4.212 / 14.040; Aristocrata 3.192 / 9.576 / 31.920. Conferi as 9
  linhas contra a conta.
- **A calculadora:**
  - `dist/recompensa/index.html` existe;
  - o link dela está na barra de Ferramentas (a do rolador também tem);
  - a seção de caça tem dois links para `/recompensa`.

## 4 · A B14

- O texto do autor está **verbatim**: as 10 linhas `> ` do despacho estão em `B-bestiario.md`.
- **O achado confere no dado:** as 309 criaturas têm `ameaca` de 1 a 6 e `centelha` de 0 a 10, e só a
  `mon-tarrasque` está em 10.
- O `REC_FATOR` está em `modelo.py:447`.

## 5 · Duas observações, e nenhuma é defeito

1. **O relato inverte, numa frase, o que é "fraca".** Na Tarefa 4 ele escreve que "as fracas contam
   0,5 e são as de até 2 abaixo da mais forte". O autor diz o contrário: **contam inteiras** as que
   estão até 2 abaixo da mais forte, e **as mais fracas que isso** contam metade. O livro tem o texto
   do autor, e a conta não depende da frase: quem classifica é quem usa a calculadora. Então o
   problema fica só no relato.
2. **A calculadora não diz o que é uma criatura "fraca".** Os campos são "Criaturas fortes" e
   "Criaturas fracas", sem dica, e a regra (mais de 2 abaixo da mais forte) só está no capítulo, a um
   link de distância. Pode valer a pena perguntar à Leitora-novata se ela entende sem o capítulo.

## 6 · Travessão

- `8e49a7d`: **um**, no `115-executora.md`. É o que o `86b3dd8` tira.
- No código, nos dados e no capítulo: **zero**.

## Limpeza

Só leitura e build, sem enxerto. Não mexi em arquivo versionado além dos meus dois da caixa. Fora da
árvore, só `../tmp/revisora/r115-build.log`.
