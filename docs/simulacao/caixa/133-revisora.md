# 133 · Revisora · veterana-1e rodada 7, parte 1 (`028213ac`): Ofício a 3 por dado, nomes de ofício, K2b

Pino: `028213ac` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 132 é ancestral de
origin/main). Fonte: `tmp/veterana/veterana-1e.md`, seções (e) de T3a, T3b, ENGENHARIA, MOINHO, LONGA-2, C21a,
C8a, RENDA-2 e K2b, e a seção da rodada 7 de `docs/simulacao/caixa/veterana-1e-relato.md`.

**CI:** Validar 37196367500 `success` e Deploy 37196367497 `success`, os dois em
`028213ac70d4011b9539237d9f92f6ee117f0b97` (conferido por `gh run view`).

**Resultado: PROCEDE. Nenhum BLOQUEIA, nenhum CORRIGE.** A flutuação do Grid no CI vai em seção própria,
fora do 1e, como ESCALA.

## Como conferi

1. **Build próprio no pino**, verde (`../tmp/revisora/build-133.txt`), e o verificador de 127 com
   `FONTE=veterana-1e.md` sobre os nove IDs. C21a, C8a, RENDA-2 e K2b: todos os trechos achados. Os que faltaram
   nos outros cinco são de dois tipos:
   - **Linha de tabela** (o lote da LONGA-2, a muralha da T3b, as duas linhas do moinho): achadas inteiras em
     `src/` (tabela em `acoes-oficio-e-mundo.md`:59 a :64, :177, :178 e :189).
   - **Texto velho que o (e) manda trocar.** No dist inteiro, todos **0**: "Forja, moinho, oficina montada",
     "Naval, Alvenaria", "Arcos, Carpintaria", "Cobre a arma e a armadura junto com o resto", "secar, preparar e
     saber para que serve", "uma colhe o ingrediente", "média 10,5), para uma unidade", "6,3 dias", "três dias e
     meio", "a média 7 não passa", "avança 35 por estação", "6,9 dias", "quinze semanas", "Armadura órfã", "até a
     G73", "até a B14", "B14 fase 3", "limitesCriacao", "aaltura", "Armaria", "Herbalismo", "Alfaiataria",
     "Curtume".
   - Uma frase do (e) que ficou mais longa no site: ver CLAREZA (os aprendizes).
2. **A Longa a 3 por dado (D-034).** A regra no ar é `acoes-e-sistema.md`:97, "Média = 3 × (número de dados),
   + 2 se a soma for ímpar". **Atenção ao despacho:** a fórmula que ele cita, "3,5 × (soma÷2 para baixo) + 2 se
   ímpar", é a de antes da D-034. Conferi pela de 3, que é a decisão viva (D-034: "Substitui a regra de 3,5 por
   dado"). Script próprio `../tmp/revisora/longa-133.mjs` (saída em `longa-133.txt`), que lê a média como
   3 × piso(soma ÷ 2) + 2 se ímpar e o tempo como (Montagem + Peça) ÷ (média − Dificuldade), a partir das colunas
   Req, Dif, Mont. e Peça das próprias tabelas do capítulo:
   - Médias: oficial (soma 6) 9, perito (9) 14, mestre (12) 18, soma 10 15, braçal (4) 6, aprendiz (3) 5. É o que
     o parágrafo de abertura diz.
   - **Horas:** 0,6 / 1 / 1,4 / 1,2 / 4 / 3,5 / 3,5, e a chave Requisito 4. O site: "menos de 1 h", 1, 1,5, 1, 4,
     3,5, 3,5, "fechada ao oficial". **Dias:** 1,2 / 1,6 / 4,6 / 1,8 / 6 / 5,5 / 11 / 8 / 12, anel e fechadura
     Requisito 4 e 5. O site: 1, 1,5, 4,5, 2, 6, 5,5, 11, 8, 12, "fechada" nos dois. **Semanas:** 8,8 / 14 / 4,33 /
     Lamelar não avança (9 contra 9) / 12 / 23 / moinho 23, placas Requisito 4 e 5. O site: 9, 14, 4, "fechada",
     12, 23, 23, "fechada" nas duas. Os arredondamentos são os do (e): meia unidade em horas e dias, inteiro em
     semanas.
   - **Lote** (Montagem 12, Peça 10, Dificuldade 7): 22 / 11; 42 / 21 / 7; 62 / 31 / 6,2; 92 / 46 / 5,75. Bate
     com :61 a :64.
   - **Espada por grau:** Sucata 6 ÷ 8 = 0,75; Tosca 11 ÷ 5 = 2,2; Comum 22 ÷ 2 = 11; Boa (soma 10) 33 ÷ 5 = 6,6;
     Ótima (soma 12) 50 ÷ 5 = 10; Excelente 74 ÷ 2 = 37 e, na oficina de mestre (Dificuldade 12), 74 ÷ 6 = 12,3.
     Bate com :91 a :96 e com a frase da Excelente.
   - **Faz-tudo** (soma 10, Dificuldade 11): 22 ÷ 4 = 5,5 dias. **Braçal** na espada de mestre: 6 − 7 = −1, não
     soma. **Aprendizes:** soma 3 dá 0 na bem equipada e 2 na de mestre; soma 4 dá 1 e 3. **Muralha:** 3 + 10 × 2
     = 23 por estação. **Carroça:** 12 dias avulsa; lote de três, Acúmulo 64, 32 dias, 10,7 cada.
   Todos os números do (e) da LONGA-2 batem com a regra de 3 por dado e com as colunas das tabelas.
3. **D-052:** `acoes-oficio-e-mundo.md`:177 "Forja, oficina montada | Alvenaria | 3 | 7 | 6 | 40 | 4 | 23
   semanas" e :178 "Moinho | Engenharia | 3 | 7 | 6 | 40 | 4 | 23 semanas". O moinho foi para a Engenharia com o
   **Requisito 3**, como o autor mandou.
4. **Preços (D-011, a "decisão 18" na numeração do 1e).** Nenhum preço de catálogo mudou: a carroça só perdeu os
   preços da frase de tempo, e a frase nova cita os 300 pc e os 1.600 pc do catálogo como estão. Observação de
   nome: o despacho chama essa decisão de D-018, mas no registro a D-018 é a régua de Duração das Proezas; a do
   catálogo é a **D-011** ("o catálogo fica; a conta tempo × preço vai para a reconciliação de preços").
5. **T3a e T3b:** Ferreiro, Carpintaria, Herbologia e Alquimia em `habilidades-secundarias.json` e no capítulo
   gerado, como o (e); a coluna Ofício das tabelas usa só nomes do catálogo (Arcos, Naval, Serralheria, Armaria,
   Herbalismo, Alfaiataria e Curtume dão 0 no dist).
6. **K2b:** "até a revisão do valor das recompensas" e "até a revisão das criaturas" (`custo-servicos.md`,
   `custo-de-servico-e-itens.md` e `CalculadoraRecompensa.astro`), "o teto de criação é Centelha 3", a frase do
   Mestre sem `aaltura`, a nota única das cinco armaduras em `equipamentos.astro` (com as cinco `descricao`
   esvaziadas em `armaduras.json`) e "(B14 fase 3)" fora dos dois gigantes. `gen-bestiario --check` e
   `gen-monsters --check` verdes.
7. **Travessão:** a contagem por arquivo tocado é igual antes e depois. **Vocabulário:** nenhuma linha
   acrescentada usa o nome antigo de Habilidade.

## A parte 2 que ficou de fora (SERVICOS, REQUISITO-FAIXA, RENDA-1, GANHO-BRUTO, TETO)

Não contei como defeito. Conferi só se o texto que ficou aponta para número ou coluna que ainda não existe. **Não
aponta:** no dist, "96 pc", "Livre 12", "Livre 22", "Livre 35", "Requisitos 1, 3 e 5", "coluna Livre" e
"| Livre |" dão 0. "26 pc" e "47 pc" aparecem uma vez cada, e as duas já estavam lá antes da rodada (contagem em
`028213ac~1`): são preços de serviço antigos, não a coluna nova da parte 2.

**RENDA-2 e K2b não dependem da parte 2.** A frase da RENDA-2 (`custo-de-servico-e-itens.md`:33, "Quem trabalha
embolsa só a Renda Livre … É uma simplificação, decisão do Mestre") usa a coluna Livre que já existe na tabela de
Recursos (:41, "Livre/Sem", "Livre/Ano"). O K2b só troca rótulos.

**Uma consequência visível, que não é defeito pela decisão do Arquiteto:** o mesmo capítulo agora diz, na abertura
das tabelas, que o oficial tem média **9**, e a tabela de Ganhar a vida (`acoes-oficio-e-mundo.md`:232 a :234)
continua com Oficial 6 / **10,5**, Perito 9 / 16, Mestre 12 / 21, os números de 3,5 por dado. Quem lê o capítulo
inteiro vê as duas médias. É a SERVICOS da parte 2 que refaz essa tabela; anoto para que ela não fique segurada
por muito tempo.

## ESCALA, fora do 1e · a flutuação do `test-grid` no CI

**Não é da rodada nem do conteúdo.** A prova mais forte é o **mesmo commit** rodado duas vezes:

| Run | Commit | Tentativa | Cena de 30 peças, volta `[aquece]` | Resultado |
|---|---|:--:|---|---|
| 37194234726 | `2ab7da2e` | 1 | "0 peça(s) na vez pegáveis, 1 na vez no palco, **1** no tabuleiro inteiro" | falha |
| 37194234726 | `2ab7da2e` | 2 | "vou arrastar "Criatura 30", na vez · **3** na vez no tabuleiro" | passa |
| 37195336815 | `19e1470a` | 1 | "0 peça(s) na vez pegáveis, 0 na vez no palco, **2** no tabuleiro inteiro" | falha |
| 37196367500 | `028213ac` | 1 | "vou arrastar "Criatura 27", na vez · **2** na vez no tabuleiro" | passa |

(Lido nos logs por `gh run view <run> --attempt N --log`.)

O que isso prova:
- **O mesmo código dá resultados diferentes.** `2ab7da2e` falhou na tentativa 1 e passou na 2, sem mudar nada.
- **O que varia é quantas peças estão "na vez" na cena de 30, e onde elas estão:** 1, 3, 2, 2 nas quatro rodadas.
  Quando a peça na vez está fora do palco ou coberta por outra (sem ponto livre para o ponteiro), o `pontos()` de
  `scripts/test-grid.mjs`:100 escolhe uma peça pegável fora da vez, e a asserção de :1202 falha, como foi escrita
  para fazer (arrastar fora da vez abriria a pergunta do L68).
- **A cena em si não sorteia nada:** em `scripts/mesa-mock.mjs`:334 a :364 a ação, o `tick` e a `iniciativa` de
  cada peça saem do índice (`20 - i`, `i % 3`, `i % 4`), sem `Math.random`.

**A causa da variação: não investigado.** Não sei o que faz o número de peças na vez mudar entre duas execuções da
mesma cena determinística, e não ofereço palpite. O que dá para afirmar é o lugar onde a falha aparece (a escolha da
peça no `pontos()`) e que ela não depende do commit. Quem decide: o dono do `test-grid`. Duas leituras possíveis
para ele, sem escolher: achar a fonte da variação, ou fazer o teste trazer a peça na vez para dentro do palco antes
de medir.

Detalhe do diagnóstico da própria mensagem: "21 pegáveis de 10 no palco" lê estranho, porque `pegaveis` conta também
peças fora do palco (:128, a soma de `noPalco` com as de fora) e o "de 10" é só o palco.

## CLAREZA

**Os aprendizes** (`acoes-oficio-e-mundo.md`:123). O (e) troca a primeira frase por «Os aprendizes, de Habilidade 1
ou 2, somam numa oficina de mestre; numa bem equipada, só os de soma 4 ou mais.», com ponto final. No site a frase
nova ficou colada ao negrito que já vinha depois dela: "…só os de soma 4 ou mais: **numa oficina bem equipada ou de
mestre, dez aprendizes aceleram uma espada Comum e não fazem uma Ótima**". O negrito é o resumo antigo, escrito
quando os dois tipos de oficina se comportavam igual, e agora vem logo depois de uma frase que os separa. Não é
falso (dez aprendizes de soma 4 aceleram na bem equipada), mas lê como contradição para quem pensou no aprendiz de
soma 3. Se alguém mexer, "numa oficina de mestre, dez aprendizes aceleram…" resolve.
