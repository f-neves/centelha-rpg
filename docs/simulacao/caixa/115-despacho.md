# Rodada 115 · despacho · recompensas de caça (regra, dados, calculadora) e a pendência do bestiário

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, **para depois de entregue a rodada 114** (que já está: `c1ce3ee`,
`90ad9f0`, `8710f28`, aguardando só o veredito da Revisora e uma resposta minha ao autor sobre a
costura Renda × Serviços, que não bloqueia esta rodada). Pino: `8710f28`.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## Regras gerais

1. **Os números de recompensa são gerados por `lore/economia/v2/gerar.py` e `modelo.py`,** como o
   resto da economia. Os parâmetros (base, fator, tabela de degraus, listas de tarefa e risco, tom,
   urgência) entram lá; a saída é `src/data/recompensas.json`, envelope `{_nota, ...}`, com schema
   `.strict()` em `scripts/validate-data.mjs`. **A calculadora lê esse JSON**; nenhum número fixo
   no código da página.
2. Sem travessão (—) em nenhum texto novo.
3. Fluxo normal: Executora implementa; a Revisora confere as contas (os 5 testes da Tarefa 5) e o
   texto; a Leitora-novata usa a calculadora com os 4 exemplos (os mesmos 4 primeiros testes da
   Tarefa 5, que ela pode rodar na página) e diz se entendeu o que a bolsa representa.

## 1 · Pendência nova (registrar, não implementar)

**Endereço:** `docs/pendencias/B-bestiario.md`, próximo número livre. **Conferido agora: o maior
ID do arquivo é B13** (`docs/pendencias/B-bestiario.md:96`); use **B14** se ainda estiver livre na
sua árvore, senão o próximo.

**Achado, para grounding (confira na sua árvore):** o campo do desafio no dado vivo se chama
**`ameaca`**, não "desafio" (`src/data/inimigos.json`, ex. `"ameaca": 1`), com **min 1 e max 6** nas
309 criaturas hoje. O campo `centelha` vai de **0 a 10** hoje (não 0-9: a Tarrasque já está em 10,
uma criatura isolada acima do que o autor lembrava). Cite isso na pendência como achado, não
como decisão.

Título: **"Recalibrar nível de desafio e Centelha das criaturas, e revisar as fichas do
bestiário"**. Texto (cole como o autor escreveu, é a proposta dele, ainda "DECIDIR"):

> Escalas desejadas pelo autor: nível de desafio de 1 a 12 (hoje 1 a 6, os losangos, campo
> `ameaca`) e Centelha da criatura de 0 a 12 (hoje 0 a 10, campo `centelha`).
> Definição do autor: nível de desafio X é feito para um grupo de 3 personagens de Centelha X, com
> habilidades variadas, passarem dificuldade para vencer, gastando recursos e se ferindo. É
> absoluto, não relativo ao grupo que joga.
> Personagem sem Centelha fere criatura com Centelha, e o inverso também.
> Revisar todas as fichas do bestiário por essa definição.
> Dependência: a recompensa de caça usa o desafio. Se a nova escala cobrir o mesmo perigo em passos
> menores, o fator da recompensa passa de 1,75 para cerca de 1,32 (um parâmetro em `modelo.py`).
> Revisar junto.

Depois de editar, `node scripts/gen-pendencias.mjs`.

## 2 · Texto da regra no livro

**Onde:** `src/content/chapters/custo-servicos.md`, dentro da seção "Serviços"
(`numeral: "XIV"`), **logo depois do bloco `<!-- /gen:economia-tarifas -->` e antes de
`<!-- gen:economia-servicos -->`** (hoje `:34-36`, confira o número na sua árvore). Seção nova,
nível `###` (mesmo nível de "Aulas", que vem depois): **"Caça e recompensas"**.

**Cole o texto abaixo, ajustando só formatação** (títulos, listas, negrito, tabela); não mude uma
palavra do conteúdo:

---
Caça e recompensas

Trabalhos pontuais, como abater uma colônia de aranhas, recuperar um hipogrifo ou buscar partes de
uma criatura para um mago, pagam uma bolsa pelo trabalho, combinada antes. O valor é o Livre: o
custo de vida de quem caça já está descontado. É esse o número do cartaz da recompensa.

Bolsa = Valor do degrau × Semanas × Tarefa × Risco × 3

A bolsa paga um grupo de 3, que é o grupo para o qual o nível de desafio é pensado. O grupo divide
como quiser: se forem mais, cada um leva menos; se forem menos, levam mais e arriscam mais.

1. Degrau = desafio + quantidade + Centelha
   a) Desafio: o da criatura mais forte.
   b) Quantidade: +1 cada vez que o número dobra (2 criaturas +1, 4 +2, 8 +3, 16 +4). Conte só as
      que têm desafio até 2 abaixo da mais forte; as mais fracas contam metade.
   c) Centelha da criatura: +1 a cada 4 pontos (0 a 3 +0, 4 a 7 +1, 8 a 11 +2, 12 +3).

2. Valor do degrau (por caçador, por semana):
   Degrau: 1 15 | 2 25 | 3 45 | 4 80 | 5 140 | 6 250 | 7 430 | 8 750 | 9 1.300 | 10 2.300 | 11
   4.000 | 12 7.100
   Acima de 12: 15 × 1,75^(degrau − 1), arredondado.

3. Semanas = caçada estimada (mínimo 1) + metade da viagem de ida e volta. A semana tem 8 dias. É
   estimativa de contrato: se levar mais, azar de quem caça; se levar menos, sorte.

4. Tipo de tarefa (exemplos): afugentar ou expulsar ×0,75; matar ×1; trazer parte ou prova ×1;
   recuperar alguém ou algo levado ×1; capturar vivo ×1,5; capturar vivo e sem ferimentos, ou domar
   ×2.

5. Risco, além do que o desafio já prevê (exemplos): normal ×1; alto, um agravante sério (terreno
   hostil, alvo desconhecido, prazo curto, civis para proteger) ×1,5; muito alto, dois ou mais
   agravantes ×2; extremo, alguém provavelmente morre mesmo dando certo ×3.

Tom da campanha: numa campanha de dinheiro curto, o Valor do degrau vale metade; numa campanha
heroica, o dobro.

Três testes antes de fechar o valor:
1. Prejuízo: ninguém paga mais do que o problema custa até ser resolvido (ovelhas, colheita,
   estrada fechada, o preço do animal perdido). Se a bolsa passar disso, não há contrato, e o
   problema continua.
2. Capacidade: quem paga junta até o seu Livre/Ano × urgência (normal ×1, grave ×3, desespero ×10).
   Uma comunidade soma as casas: uma aldeia de 40 casas de Braçal junta cerca de 12.000 pc por ano.
3. Oferta: o Mestre decide quantos trabalhos existem. Referência: aldeia, 1 por ano; vila, 1 por
   estação; cidade, 1 por mês; fronteira e terra selvagem, o dobro. Caçar só vira profissão onde há
   trabalho de sobra.

Despesas e partes:
1. Comida e pouso na estrada já estão no custo de vida e não se cobram à parte. Munição, cura,
   reparo, transporte, iscas e cães saem da bolsa.
2. Se a bolsa é pela parte da criatura, a parte é de quem pagou. Parte avulsa vende no mercado pela
   metade do que um encomendante pagaria.

Recursos durante a aventura:
1. O personagem recebe Livre de uma fonte por semana, ou nenhuma. Nunca paga o custo de vida à
   parte.
2. Recursos 1 a 3 é trabalho próprio: na semana de aventura não paga, e entra o Livre do contrato,
   se houver.
3. Recursos 4 a 6 é renda de propriedade: continua pagando.
---

**A tabela de "Valor do degrau" (item 2) e a "tabela de capacidade" (item de Capacidade, "Livre/Ano
× urgência") devem ser geradas** de `src/data/recompensas.json` e `renda.json`, com marcador
`<!-- gen:economia-recompensas -->`, no mesmo padrão dos outros blocos de `gen-cap-economia.mjs`;
não digite os 12 valores do degrau nem os 9 de capacidade à mão no `.md`.

## 3 · Substituir a regra antiga

**Achado (confirme na sua árvore):** a regra antiga está em **duas frentes**:
- `custo-de-servico-e-itens.md:67-74` (seção "Semanas de aventura"): "Semana de aventura não tem
  renda... O custo de vida da faixa continua... Quem não tem casa fixa não paga...". **É aqui que
  entra o bloco novo**, substituindo o conteúdo (o texto "Recursos durante a aventura" do Task 2,
  acima). Mantenha o título da seção ou troque por um que descreva o bloco novo; se trocar,
  **atualize a âncora** usada em `acoes-oficio-e-mundo.md:254` (o link
  `custo-de-servico-e-itens#semanas-de-aventura`).
- **Não achei mais nenhuma outra ocorrência do texto completo da regra antiga** em `src/`; só essa
  seção e o link que aponta para ela. Se achar mais alguma (busque por "custo de vida da faixa
  continua" e "não tem renda"), relate e substitua também.

Relate cada ocorrência trocada, com arquivo:linha antes e depois.

## 4 · Dados (`modelo.py` / `gerar.py` → `src/data/recompensas.json`)

Parâmetros, na fonte:
- base 15; fator 1,75; tabela de degraus 1 a 12 (15, 25, 45, 80, 140, 250, 430, 750, 1.300, 2.300,
  4.000, 7.100), arredondada pela regra `arred` já existente em `base.py` (confirme que os 12
  batem com `arred(15 × 1,75^(n-1))`; se algum não bater exatamente, documente o desvio no
  `_nota`, não force o valor);
- passo de Centelha: +1 a cada 4 pontos, de 0 a 12 (ou mais, se a pendência da Tarefa 1 mudar a
  escala depois; por ora, mantenha coerente com o `ameaca` 1-6/`centelha` 0-10 de hoje);
- regra de quantidade: `passo = piso(log2(quantidade efetiva))`, mínimo 0, quantidade efetiva =
  fortes + fracas ÷ 2;
- listas de **tarefa** (id, nome, multiplicador, descrição): afugentar/expulsar 0,75; matar 1;
  trazer parte ou prova 1; recuperar 1; capturar vivo 1,5; capturar vivo sem ferimentos (ou domar)
  2;
- listas de **risco** (id, nome, multiplicador, descrição): normal 1; alto 1,5; muito alto 2;
  extremo 3;
- **tom**: dinheiro curto 0,5; padrão 1; heroico 2;
- **urgência**: normal 1; grave 3; desespero 10;
- dias por semana: 8; grupo de referência: 3;
- **tabela de capacidade**: Livre/Ano por faixa, lida de `renda.json` (a tabela da rodada 114, já
  em `curva_por_soma`/`faixas`), não duplicada à mão.

Envelope `{_nota, ...}` (confira o formato exato contra os outros arquivos de `src/data/economia`,
ex. `renda.json`), schema `.strict()` novo em `validate-data.mjs`. O `--check` do
`copiar-economia.mjs` deve cobrir este arquivo também (ele já roda o `gerar.py` inteiro; confirme
que `recompensas.json` entra na lista de arquivos comparados).

## 5 · Calculadora de recompensa

**Página nova**, no padrão de `src/pages/rolador.astro` (página fina + componente próprio, ex.
`src/components/CalculadoraRecompensa.astro`), registrada em **`FERRAMENTAS`**
(`src/lib/site.ts:92-102`), com um link a partir da seção "Caça e recompensas" do capítulo
(Tarefa 2).

**Entradas:** desafio da mais forte; Centelha; nº de criaturas fortes; nº de criaturas fracas;
semanas de caçada; dias de viagem (ida e volta); tipo de tarefa (lista); risco (lista); campo
"outro ×" opcional (padrão 1); tom da campanha; tamanho real do grupo.

**Conta**, na ordem:
1. quantidade efetiva = fortes + fracas ÷ 2; passo = piso(log2(quantidade efetiva)), mínimo 0.
2. degrau = desafio + passo + piso(Centelha ÷ 4).
3. semanas = max(1, caçada) + dias de viagem ÷ 16; mostrar com uma casa decimal.
4. bolsa = valor do degrau × tom × semanas × tarefa × risco × outro × 3, arredondada pela regra
   `arred`.
5. por caçador = bolsa ÷ tamanho do grupo, inteiro (meio para cima, como o resto da economia desta
   rodada).

**Saída:** a bolsa, o valor por caçador, **a conta passo a passo** (não só o resultado final: mostre
cada fator, como um recibo), e a tabela de capacidade (Livre/Ano × urgência) ao lado, para o Mestre
comparar contra a bolsa calculada.

**Os 5 testes obrigatórios** (tom 1, outro 1, grupo 3), confira um a um e relate a tabela
esperado/calculado:

| # | entradas | degrau | semanas | bolsa esperada |
|---|---|:---:|:---:|:---:|
| 1 | desafio 5, Centelha 5, 1 forte, 0 fracas, caçada 1, viagem 16 dias, matar, normal | 6 | 2,0 | 1.500 |
| 2 | igual ao 1, mas capturar vivo | 6 | 2,0 | 2.250 |
| 3 | desafio 2, Centelha 0, 8 fortes, caçada 1, viagem 0, matar, alto | 5 | 1,0 | 630 |
| 4 | desafio 3, Centelha 0, 1 forte, caçada 2, viagem 8 dias, capturar sem ferimentos, normal | 3 | 2,5 | 680 (675 arredondado) |
| 5 | desafio 2, Centelha 0, 1 forte, caçada 1, viagem 0, trazer parte, normal | 2 | 1,0 | 75 |

(Conferi as contas dos 5 à mão antes de despachar: todas batem com a fórmula acima, degrau por
degrau. Se o seu cálculo divergir de algum, pare e mostre a conta, não force o número esperado.)

## Verificação

- `npm run validate` e `npm run build` verdes.
- `src/data/recompensas.json` só existe pelo `gerar.py` (o `--check` do `copiar-economia.mjs`
  cobre); nenhum número fixo à mão no componente da calculadora.
- Prova no `dist/`: a seção "Caça e recompensas" com a tabela de degraus e a de capacidade geradas,
  lidas célula a célula; a página da calculadora existe, com link a partir da seção; os 5 testes
  rodados na própria calculadora (ou num teste automatizado que chame a mesma função), com o
  resultado batendo.
- A seção "Semanas de aventura" (ou o nome novo dela) mostra o texto novo, e o link de
  `acoes-oficio-e-mundo.md:254` resolve.
- Travessão: zero nas linhas novas.

## O relato

`115-executora.md`: as ocorrências trocadas na Tarefa 3 (arquivo:linha, antes/depois), a tabela dos
5 testes (esperado × calculado) da Tarefa 5, e onde a pendência da Tarefa 1 ficou (arquivo:linha).
`progresso-115.md` desde a primeira etapa.

Depois do relato: peça à **Leitora-novata** para abrir a calculadora, rodar os 4 primeiros testes
da tabela acima e dizer, com as próprias palavras, o que a bolsa representa e por que ela muda de
um teste para o outro.
