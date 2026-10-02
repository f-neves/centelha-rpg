# Rodada 121 · veredito · a correção da Reforma da Centelha

**Aviso:** mensagem do Arquiteto. Despacho `docs/simulacao/caixa/correcao-reforma-despacho.md`, valendo o
Adendo 1 (`:171-246`). Relato `correcao-reforma-relato.md`. Pino `a5d66a27`. Faixa: `4aaf0fce`, `58869f2f`,
`ae1889c9`, `555abf60`, `0ebc9917` (revert de `4aaf0fce`) e `a5d66a27`. Passo 0 pelo §0.1:
`merge-base --is-ancestor HEAD origin/main` passou (o veredito 120, `1a65063f`, está no `main`), depois
`switch -C revisora a5d66a27`. Toplevel da Revisora, branch `revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA, nenhum CORRIGE. Fica uma PERGUNTA para o autor (`racas.md:169`)
e três ESCALA pequenas, de texto fora do que a faixa tocou.

O estado julgado é o líquido da faixa: `0eecc2c7` (a base do despacho) contra `a5d66a27`. Os itens 1 a 4
aplicaram a regra do maior, e o Adendo 1 a desfez. Por isso a maior parte do que eles fizeram se anula no
diff líquido, e é ele que conta.

## CI (§11)

Workflow `Validar dados e regras`, os seis `completed / success` na primeira tentativa:

| commit | run |
|---|---|
| `4aaf0fce` | `37072671934` |
| `58869f2f` | `37073788547` |
| `ae1889c9` | `37074927414` |
| `555abf60` | `37075674431` |
| `0ebc9917` | `37076658436` |
| `a5d66a27` | `37077524146` |

Rodados por mim no pino (saída em `../tmp/revisora/checks-121.txt`), todos verdes e sem gravar nada:
`test-kael.mjs` (Defesa 20, Def. Mental 10), `test-sentidos.mjs`, `gen-bestiario.mjs --check` (309
criaturas), `gen-mermaid.mjs --check` (6 desenhos) e `cost-examples.mjs` (os derivados dos quatro exemplos).

## Foco 2 · O revert deixou o motor, os testes e o bestiário iguais a `0eecc2c7`: PROCEDE

`rtk proxy git diff --stat 0eecc2c7 a5d66a27` sai **vazio** em `src/data/inimigos.json`, `monsters.json`,
`monsters-mesa.json`, `src/data/bestiario/`, `scripts/lib-bestiario.mjs`, `test-kael.mjs`,
`test-contrato.mjs`, `scripts/sim/desafio-bancada.mjs` e `src/lib/artes-grid.ts`.

Os dois arquivos do item 1 que **não** voltaram byte a byte mudaram só no que o Adendo mandou mudar. Li o
diff inteiro de cada um:

- **`calc.ts`**: só os dois comentários de `centelhaNaJogada` e `centelhaSoAtributo` (`:131-154`), que agora
  dizem a decisão do Adendo (2 × mín em toda jogada de Atributo + Habilidade, Habilidade 0 dá 0, e o Atributo
  puro é o tipo de jogada pedida). O código é o de `0eecc2c7`.
- **`regras.json`**: duas mudanças, as duas pedidas. A string `quaseAcerto.dano` ganhou os dois termos da
  Centelha (119, achado 9), e a nota de `:2683` é a do foco 5.

## Foco 1 · 2 × mín em todo lugar que a faixa tocou, sem "maior" e sem "+ Centelha" velho: PROCEDE

**"Maior":** `rtk proxy git grep -n -i -E "maior\(Centelha|regra do maior|maior entre \+1" -- src scripts
'*.md' ':!docs'` dá **zero**.

**O diff líquido**, linha a linha. Cada "+ Centelha" velho virou "2 × mín(Centelha, X)", com o X certo:
- Esquiva/Bloqueio em `qual-sistema.md:87-88` e no SVG dele;
- Integridade e Sociabilidade em `aparencia:129`, `:131` e `criacao:73-75`;
- Prontidão em `acoes-sentidos-e-engano:16`;
- Habilidade e Sociabilidade em `relacoes-sociais:138`, `:182`, `:274`, `:276`;
- as quatro definições de `glossario.json` (`:93`, `:101`, `:109`, `:223`).

A explicação das Defesas na ficha (`ficha-engine.ts:1564-1575`) passou a escrever o termo pela mesma
`centelhaNaJogada` que dá o número. Para Kael, a conta agora fecha: "(Destreza 4 + Esquiva 3)×2 + Centelha 6
(2×mín(3, 3)) = 20". O comentário de `combate-resumo.ts:80` também está certo.

`defesas.md`, `combate.md:124-135`, `coracao-do-sistema.md:89-93` e `acoes-e-sistema.md:65-123` não estão
no diff líquido. Eles foram ao "maior" e voltaram ao texto de `0eecc2c7`, que já dizia 2 × mín (conferido
na 119).

**Varredura de "+ Centelha" por fora do que a faixa tocou** (`src`, `scripts`, `Regua_Relacao.md`). O que
sobra é exceção legítima:
- os saltos (`combate.md:350-351`, `ficha-engine.ts:1597-1599`);
- Energia e Mana;
- a Absorção;
- o raspão.

Mais três itens que não são regra viva:
- `calc.ts:139` cita o "+1 por ponto" antigo como o que foi substituído;
- `scripts/sim/*` são bancadas com fórmula própria de propósito;
- `sim-caps.mjs` compara variantes.

**Fora disso, três ESCALA de texto, nenhuma em linha da faixa:**

1. **`scripts/lib-bestiario.mjs:75`**: o comentário diz "Defesa Mental: Raciocínio + Integridade + Vontade
   + Centelha". O código logo abaixo (`:76-77`) já usa `centelhaNaJogada(integ)`. O arquivo voltou byte a
   byte a `0eecc2c7` pelo revert, então a sobra é de antes da faixa. É o mesmo caso do `combate-resumo.ts:80`,
   que a 120 apontou.
2. **`scripts/gen-bench-tempo.mjs:80-87`**: o cartão "A Centelha soma +1, não +2", marcado `decidido`, na
   bancada `combate-tempo-bench.html` (na raiz, fora do site). Diz que vale "+1 por ponto no ataque e nas
   quatro defesas", o que é falso desde a Reforma. Alguém precisa decidir se o cartão vira histórico.
3. **`docs/pendencias/D-proezas-tecnicas.md:66`**: a D12 fechada ainda dá como exemplos "Vontade pura,
   Resistir sem perícia", que o Adendo tirou do capítulo. É documento, e só pede a nota de que o exemplo
   mudou.

**PERGUNTA ao autor: `racas.md:169`.** O texto: "contra **Força de Vontade do orc × 2 + Centelha dele**". É
um valor parado, sem Habilidade e sem Atributo (a Vontade é reserva, não Atributo). A Centelha entra
inteira. O relato do item 2 (`relato:166`) chamou isso de "jogada só de Atributo" pela regra do maior, e o
Adendo 1 não voltou ao caso. Pela decisão final, só a jogada **pedida** de Atributo puro leva a Centelha
inteira. Há duas leituras:
- **A:** o teste do Frenesi é um caso de Atributo puro por analogia, e fica como está.
- **B:** não é, e o termo precisa de outra regra (sem Habilidade, 2 × mín dá 0).

O arquivo não está na faixa: é ESCALA com pergunta, e não CORRIGE.

## Foco 3 · `centelha.md:44` contra a decisão do autor, verbatim nos números: PROCEDE

Os seis exemplos do autor (`despacho:180-183`) estão no capítulo, com os números exatos:
- Centelha 1 e Habilidade 5, +2;
- Centelha 5 e Habilidade 3, +6;
- Centelha 6 e Habilidade 1, +2;
- Centelha 1 e Habilidade 6, +2;
- Centelha 0 e Habilidade 6, 0;
- Centelha 0 e Habilidade 0, 0.

O exemplo de `despacho:189-190` também está, com as três contas exatas:
- "role Destreza" = 1d6 + 2 + 3 = **1d6 + 5**;
- com Atletismo 0, **1d6 + 2**;
- com Atletismo 2, 2d6 + 2 + 4 = **2d6 + 6**.

Conferi as três: Destreza 3 dá 1d6 + 2; somar Atletismo 2 dá 5, ou 2d6 + 2, e 2 × mín(3, 2) = 4.

A distinção pedida está escrita: "O que conta é o tipo de jogada pedida, e não o personagem que tem
Habilidade 0". "Habilidade 0 dá bônus 0" também está, e o "Vontade pura, Resistir sem perícia, alguns
testes de Bravura" saiu. Assim os achados 1 e 16 da 119 deixam de valer como estavam. O 16 (a Virtude) fica
sem resposta escrita, mas também sem frase que o contradiga.

**Uma omissão, sem rótulo:** o item 1 do autor põe "a Defesa parada" na lista do 2 × mín. O capítulo lista
"o Valor Passivo e cada Defesa", e não nomeia a parada. Ela está em `relacoes-sociais.md:182`, então nada
contradiz, mas `centelha.md` não diz que a regra a alcança.

## Foco 4 · As contas da criação e da tabela social, à mão: PROCEDE

As fórmulas são as de `calc.ts:156-176`. As fichas são as de `criacao-de-personagem.md`.

| | Defesa | Def. Mental | Def. Social |
|---|---|---|---|
| Kael (Des 4, Esquiva 3, Rac 3, Vont 7, Integ 0, Comp 2, Soc 0, C 3) | 14 + 2×mín(3,3) = **20** | 3 + 0 + 7 + 0 = **10** | 4 + 2×mín(3,0) = **4** |
| Sora (Des 6, Esquiva 3, Rac 3, Vont 8, Integ 3, Comp 3, Soc 3, C 3) | 18 + 6 = **24** | 3 + 3 + 8 + 6 = **20** | 12 + 6 = **18** |
| Bram (Des 3, Esquiva 3, Rac 3, Vont 9, Integ 0, Comp 2, Soc 2, C 1) | 12 + 2×mín(1,3) = **14** | 3 + 0 + 9 + 0 = **12** | 8 + 2×mín(1,2) = **10** |
| Veil (Des 4, Esquiva 3, Rac 3, Vont 8, Integ 3, Comp 3, C 4) | 14 + 2×mín(4,3) = **20** | 3 + 3 + 8 + 6 = **20** | com Soc 3: 12 + 6 = **18** |

Os doze números batem com `criacao:106`, `:124`, `:145` e `:172`, com o `test-kael.mjs:35` (Kael) e com o
`cost-examples.mjs` (que agora chama as funções de `calc.ts`, e não mais o `centelhaMult`). **A Social de
Veil é pendente:** a ficha não nomeia a Sociabilidade. O `cost-examples` diz "sem dado para conferir", e o
relato marca a pendência (`relato:128-133`, `:325`). **O capítulo não marca:** `criacao:145` publica "Def.
Social 18" sem ressalva. O despacho mandou registrar e marcar como pendente sem dizer onde. O registro está
no relato e no conferidor, e por isso não rotulo.

**Tabela social** (`relacoes-sociais.md:196-197`):
- Kael: com dado, (2 + 0) × 2 + 2×mín(3, 0) = **4**; parada, 2 + 0 + 0 = **2**.
- Sora: com dado, (3 + 3) × 2 + 6 = **18**; parada, 3 + 3 + 6 = **12**.

Batem com o capítulo e com a nota de `regras.json:2683`.

**Os exemplos refeitos** no diff líquido também conferem:
- `combate.md:21`, Sora: 5d6 + 2 + 1 + 6 = **5d6 + 9**. O "soma 16" pede 7 nos cinco dados, o que é possível.
- `coracao:79`, Kael: 3d6 + 6, 11 nos dados dá **17**, 7 acima de 10, **uma Margem**. A Dificuldade 10
  contra a tabela de Escalar ficou como estava, por ordem do despacho (`:104-106`).
- `quase-acerto.md:28`, Sora com Centelha 3: 4 − 5 + 3 = **2** e 4 − 1 + 3 − 0 = **6**.

## Foco 5 · A Defesa parada e o Tempo do passo em `regras.json:2683`: PROCEDE

A nota diz "(Compostura + Sociabilidade) × multDefesa + 2×menor(Centelha,Sociabilidade) + termo da régua",
que é a resposta A do autor, e cita a decisão 1 e o Adendo 1. A frase do Tempo do passo voltou com a
redação de antes do `8d1cbb79`, palavra por palavra: "Tempo do passo, em intervalos =
máx(pisoTempoDoPasso, defesa parada − ataque parado − soma dos gestos)." O CORRIGE da 120 está fechado. O
capítulo (`:182`, `:276`) e o JSON agora dizem a mesma coisa. O registro sobre o `8d1cbb79` que o autor
pediu está verbatim no relato (`:227-229`).

## Foco 6 · Os Passivos do grupo na mesa (Kael 24): PROCEDE

`mesa-ficha.ts:44-50`: o `valor` de cada passivo é `valorPassivo(atributo, habilidade, centelha)`, de
`calc.ts`, sem a Especialidade. O campo `media` virou `valor`. Procurei os leitores: `grupo.astro:656` e
`mesa.astro:371-372` já leem `.valor`, e o `grid.astro:3332` só repassa o array. Ninguém lê `.media` de
passivo. A função `media` continua viva, mas só para a `iniciativaMedia` (`:109`).

A nota da página (`grupo.astro:27-28`) diz a fórmula do livro, e o pool aparece embaixo, como ela diz.

**Kael:** a Prontidão usa o maior entre Percepção e Raciocínio (6) mais Prontidão 3, Centelha 3:
(6 + 3) × 2 + 2 × mín(3, 3) = **24**. Antes era 16, a média de 4d6 + 2.

**Duas notas de leitura, anteriores à faixa e sem rótulo:**
- a linha "Prontidão" do painel usa o maior entre Percepção e Raciocínio, e a Percepção Passiva do livro
  usa a Percepção;
- a linha "Integridade" passa a Força de Vontade no lugar do Atributo.

Para Kael não muda nada. Fica registrado para quem for mexer no painel.

## Observações sobre o relato (sem rótulo)

- `relato:278` põe o Adendo 1 sob o sha `86b9f722`, que é o commit do despacho (o adendo do Arquiteto). O
  trabalho é `0ebc9917` e `a5d66a27`, que o próprio bloco cita a seguir.
- O relato registra o que o despacho pediu: a frase "a regra do maior entrou como decisão do autor [...] não
  era decisão dele" (`:285-286`); o que foi desfeito e por qual commit (`:288-299`); a asserção tautológica
  de `test-sentidos.mjs:74` (`:342`), que continua comparando a função com ela mesma; e os dois achados do
  item 1 que ficam valendo (`:338`).

## Não conferido

- Não rodei `npm run build` nem abri o `dist/`. O relato traz prova no gerado para cada item, e não a
  refiz.
- Os achados do item 1 que o relato mantém (o `gen-monsters` sem `--check`; o comentário de
  `desEsqDaDefesa`): li só a descrição, e não o código.
- Os smoke da mesa: estão verdes no CI, e não os rodei.

## Limpeza

Só leitura, os cinco testes e contas à mão. Saída em `../tmp/revisora/`. Nenhum arquivo versionado tocado
além deste e do `progresso-revisora-121.md`.
