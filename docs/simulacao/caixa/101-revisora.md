# Rodada 101 · veredito

Pino: `fc67b3f` (aviso), faixa `d4dc84e..3508cac`. O `23d6aff` (do Arquiteto) ficou fora. Passo 0
conferido: toplevel é a worktree da Revisora, HEAD `fc67b3f4030b`, e a worktree estava limpa antes
de reancorar.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE.

- As dez contas batem com o dado.
- Os cinco JSONs só mudam texto, com duas exceções: o `diagramas.json`, que é gerado, e o `pool` do
  Curare, que o despacho previa.
- A tabela do Bram está intacta.
- As duas PERGUNTAS são de duas leituras de verdade. A da Bravura tem um caso gêmeo que o relato não
  viu (§4).

## CI (§11)

Workflow `Validar dados e regras`:

- **`af2ef52` (o lote):** run `35961424833`, **`in_progress`** às 02:51 (hora da máquina).
- **`3508cac` (o progresso):** run `35961474536`, `in_progress` na mesma hora.
- **`23d6aff` e `fc67b3f`:** também em andamento.
- **A base `d4dc84e`:** run `35960496479`, `success`.

**Reconferido às 03:02, antes de commitar:** `af2ef52` (run `35961424833`) e `3508cac` (run
`35961474536`) fecharam **`completed / success`**, com 19 de 19 jobs verdes cada.

## 1 · As dez contas: refiz todas, e todas batem

| item | conta publicada agora | o dado | confere |
|---|---|---|---|
| a1 | soma 5 rola 2d6 + 2 | pool = [soma ÷ 2]d6, +2 se ímpar | sim |
| a10 | Centelha 1 já apara um Enorme | `bloqueioLimite`: `porteMaxDiferenca` 1, `centelhaSobePorte` 1; Médio para Enorme são 2 degraus, e o teto fica 1 + 1 = 2 | sim |
| a15 | secundária 2 + novo, primária 4 + 2 × novo, Atributo 5 + 5 × novo, Centelha grátis | `xp`: secundária base 2 mult 1, primária 4/2, atributo 5/5, centelha `gratis` | sim |
| a17 | níveis 5 e 6 cobram +1 e +2 de Vontade | `economiaPoderes.vontade` = `{nivel5: 1, nivel6: 2}` | sim |
| a25 | arremesso 1d6−2 a 1d6+2; distância 1d6−1 a 1d6+8; Velocidade da Distância 6–15 | `armas.json`, as 33 armas lidas: arremesso `danoBonus` −2 a +2; arcos −1/0/+2 e bestas +2/+4/+8; arcos 6 Ticks e bestas 9, 12 e 15 | sim |
| a26 | alabarda na linha 6 | `alabarda.arma.ticks` = 6 (a lança longa é 7, e não está na tabela) | sim |
| a29 | 30 das 33 têm um dado só; a nota aponta para `classePorDanoMedio` | 3 armas com `dado: 2` (montante, martelo de guerra, machado pesado) | sim |
| a38 | orc de 41 PV: 9 de dano | PV Médio = 25 + Vigor × 3, e o orc tem Vitalidade +Vigor (`racas.json`, `bonusCondicional` campo `pv`): 25 + 4 × Vigor. **40 nem é alcançável** (29, 33, 37, 41, 45). 20% de 41 = 8,2, e para cima dá 9 | sim |
| c6 | 5 noites = Desgaste 4, que se paga em 4 noites ou 2 de doze horas | tabela do Sono (5 ou mais noites = 4) e "uma noite tira um degrau, doze horas tiram dois" | sim |
| c14 | Margem 0 é 1–5 | a linha seguinte é 6–11 (Margem 1), e empate não supera | sim |

**Uma nota do a38:** o relato escreve "PV do orc = 25 + 4 × Vigor" sem dizer de onde sai o 4. Sai da
Vitalidade somada à linha Médio (3 + 1), e conferi as duas pontas.

## 2 · Os cinco JSONs: texto, gerado, e um valor previsto

| JSON | o que mudou | é dado? |
|---|---|---|
| `regras.json` | a `nota` de `quaseAcerto` (a29) | não, texto. O dado (`classePorDanoMedio`) já existia e não mudou |
| `antecedentes.json` | quatro textos: níveis do Séquito sem "\| Magnitude N" (c9), e as `amarra` de Posição, Reputação e Refúgio (a8) | não, texto. A `amarra` do Séquito, que diz que o nível é a Magnitude, ficou |
| `habilidades-secundarias.json` | a `descricao` da Caligrafia (c10) | não, texto |
| `diagramas.json` | o SVG do fluxograma de `qual-sistema.md`, gravado pelo `gen-mermaid.mjs` | gerado. `--check` verde, 6 desenhos |
| `venenos.json` | Curare `pool: null` → `3` (b7) | **sim, é dado**, e é o que o despacho previa: "o b7 acrescenta um valor que o capítulo já publica". Nenhum código de `src/` lê o `venenos.json` hoje, então não muda nada na mesa |

**Os dois JSONs além do previsto** (`regras.json`, e o a8 dentro do `antecedentes.json`) são texto de
nota e de amarra, e o despacho manda consertar o texto onde ele mora. **Nenhuma mudança de dado
fora do previsto, então não há BLOQUEIA nem PERGUNTA.**

Os geradores, rodados por mim:

- `gen-cap-antecedentes.mjs --check`: 14 verbetes em dia;
- `gen-cap-pericias.mjs --check`: 24 primárias e 66 secundárias em dia;
- `gen-mermaid.mjs --check`: 6 desenhos em dia.

**O c10 entrou pela fonte.** O `--check` do capítulo II passa, então o bloco gerado é o que o gerador
produz da `descricao` nova. O c11 (o link) está na linha 15, fora do bloco, que começa na linha 19.

## 3 · O Bram: nenhum número mudou

O diff de `criacao-de-personagem.md` só **acrescenta** duas coisas: a linha do Antecedente na tabela
de custos (b18) e a nota logo abaixo da tabela do Bram. Nada da tabela dele foi removido nem trocado.

Rodei o `node scripts/cost-examples.mjs` nesta árvore, e a saída do Bram é **idêntica** à que o relato
cola (415, 222, 56, 72, 74; Técnicas 120; 1694 + 120 = 1814 contra 1868). O texto novo da M-02 bate
com o conferidor nos três pontos:

- as Técnicas "NÃO CONFERÍVEL" dos quatro, com 450, 590, 615 e 120, exatamente os números da nota;
- "[níveis supostos: o capítulo dá só a contagem]" nas Secundárias;
- "[supõe todas primárias de nível 1]" nas Especialidades.

Kael, Sora e Veil fecham o total publicado, como a M-02 diz.

**A linha nova do b18** ("0→1 = 3 · 2→3 = 9 · 5→6 = 18 · teto 3 na criação em Recursos e Relíquia")
confere com `xp.antecedente` (acum, mult 3) e com a nota dele.

## 4 · As duas PERGUNTAS: as duas são de duas leituras, e a primeira tem um caso gêmeo

**A Bravura (a2).** Há dois dados que discordam, e não um dado contra um texto:

- **`virtudes.json`:** o `valor.resiste` diz "ao medo e à intimidação";
- **`regras.json`:** o `derivados.defesaSocial.reguaNota` trata intimidar como ataque social ("Ataque
  que ESFRIA (intimidar, ameaçar...)"). A régua de `defesas.md:37-39` manda a intimidação numa
  interação para a Defesa Social.

Como os dois dados discordam entre si, "o JSON vence" não decide nada. **É PERGUNTA, e a Executora
classificou certo.**

**O que o relato não viu:** a Temperança tem a mesma forma. O `temperanca.resiste` é "à tentação e à
provocação", e a tabela de casos de `defesas.md:54` diz "Provocação em combate ("vem, covarde!") →
Social". A pergunta de verdade é qual é o papel da coluna "resiste":

- **leitura A:** a coluna lista o que o teste de Virtude resolve;
- **leitura B:** a coluna diz de que pressão a Virtude cuida, e o ataque em si continua batendo na
  Defesa Social.

**Recomendo que a decisão cubra as duas Virtudes de uma vez.** Decidir só a Bravura deixa a
Temperança na leitura oposta.

**A tabela de renda (b17).** Não há fonte no dado: o Grep por "Braçal" nos JSONs e nos scripts não
acha nada. As razões não fecham em calendário nenhum:

- Mês/Sem do Braçal: 22/6 = 3,67;
- Mês/Sem do Destreinado: 40/10 = 4,0;
- Ano/Mês livre do Braçal: 38/4 = 9,5, e não 12.

Então não é a semana de 7 nem a de 8, e as colunas não concordam nem entre si. **As duas leituras
são reais, e é PERGUNTA.** Uma terceira leitura, que o relato não lista, é a tabela ser anterior ao
calendário de Uldun e as três colunas terem sido estimadas uma por uma. Ela não muda a pergunta,
mas explica por que nenhuma coluna manda.

## 5 · As correções da 98 e da 99: resolvidas como pedi

- **"Menos o tiro":** está em `racas.md:146` e no `FRENESI.md` §5, na oração da equivalência.
- **C-102:** a marca dá a causa medida. O Espantalho Desperto está em `inimigos-custom.json`,
  conferido pelo Grep, e a marca termina em "Não é o satélite que cresceu".
- **C-23:** a coluna de `acoes-sentidos-e-engano.md:18` passou a "Valor Passivo (sem Centelha)".
  - **Uma observação, e não CORRIGE:** a segunda tabela (`:52`, "Quem vigia | Valor Passivo | Dif na
    Acumulada") herda os mesmos números e não ganhou o parêntese. No 99 eu disse que ela herdava a
    suposição, mas o CORRIGE pedia a de 18-23, e foi o que o despacho mandou. Fica para quem mexer ali.

## 6 · O resto do monte A, por amostra

Conferi contra o dado:

- **a7:** `combate.escada.zeraEm` = "livre".
- **a12:** o `bonusCondicional` do anão é "qualquer Ofício em que já tenha pontos".
- **b11:** a `horda` tem a faixa 64–127 = 6 e `ataquesPorSeisTicks`.
- **b20:** o halfling é porte `pequeno`, e a linha Pequeno é 20 + Vigor × 2.
- **a19:** a frase nova da Centelha 1 não afirma número.
- **c1:** os links novos saem no capítulo.

**Não conferi um por um os outros 25.** Eles continuam na lista de quem varrer depois (`§9` do
contrato).

## 7 · Travessão, lendo os arquivos

Varri as 374 linhas acrescentadas da faixa, nos 31 arquivos mais o aviso. Aparecem quatro linhas com
o caractere U+2014, e **nenhuma é travessão novo**:

- duas no relato, citando o caractere entre aspas;
- a célula vazia da linha do Curare (a coluna Intervalo), marcada com ele desde antes;
- a célula vazia da linha Distância (a coluna Def.), marcada com ele desde antes.

Contagem do arquivo inteiro, antes e depois: `acoes-resistir.md` 4 → 3 e `armas-e-armaduras.md` 3 →
3. Controle positivo: o mesmo varredor acusa `combate.md:35`.

## Limpeza

Não buildei o site: os três `--check` e o `cost-examples.mjs` só leem. Não mexi em arquivo
versionado. `git status --short` ao fechar: só os meus dois arquivos da caixa.
