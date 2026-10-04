# Rodada 126 · veredito · a rodada de pendências, blocos A a K (sem o G)

**Aviso:** a mensagem do Arquiteto. Despacho `docs/simulacao/caixa/rodada-pendencias-despacho.md`.
Relato `rodada-pendencias-relato.md`. Registro `docs/decisoes-partes/decisoes.md`: D-002, D-006, D-014,
D-015, D-016 e P-01 a P-10.

Commits, onze:

| Bloco | Commit(s) |
|---|---|
| A | `03c1d711` |
| B | `e7c06baa` |
| D | `d8f693b1` (texto) e `7e0d0bb7` (código) |
| C | `66497997` |
| E | `ce425f84` |
| F | `468a532f` |
| H | `319bf4b9` |
| I | `70dd7728` |
| J | `9013360b` |
| K | `5c18b7d3` |

**Pino** `5c18b7d3`, o último dos onze. Passo 0 pelo §0.1:
- `merge-base --is-ancestor HEAD origin/main` passou (o veredito 125, `99e97b25`, está no `main`);
- depois, `switch -C revisora 5c18b7d3`;
- toplevel da Revisora, branch `revisora`, árvore limpa.

**Julgado:** o diff de `03c1d711~1` a `5c18b7d3`. Ele traz também o `5bbef1a2` (registro D-016, do
Arquiteto), que não é da Executora.

**Veredito geral: PROCEDE com dois CORRIGE pequenos**, os dois no que o relato afirma ter varrido:
- **(A)** sobrou a regra velha de resistir a efeito mental em `qual-sistema.md:43` e `:119`;
- **(D)** a lista de conflitos com o teto de Arte não traz o `arcano.astro:63`.

Nenhum BLOQUEIA. O código, os números e as provas que conferi batem.

## CI (§11)

Workflow `Validar dados e regras`: os onze `completed / success` na tentativa 1.

| commit | run |
|---|---|
| `03c1d711` | `37168526691` |
| `e7c06baa` | `37169320767` |
| `d8f693b1` | `37169937791` |
| `7e0d0bb7` | `37170427913` |
| `66497997` | `37171337323` |
| `ce425f84` | `37172173817` |
| `468a532f` | `37172248130` |
| `319bf4b9` | `37172942688` |
| `70dd7728` | `37173731667` |
| `9013360b` | `37173779519` |
| `5c18b7d3` | `37173852179` |

Rodados por mim no pino:
- `test-kael.mjs`: Defesa 20, Mental 10, sem Fôlego, Arranque 6/Corrida 9;
- `test-recompensa.mjs`: 33 asserções;
- `gen-monsters.mjs --check`: "em dia com o inimigos.json".

Os três verdes, e `git status` limpo depois.

## Ponto 2 do aviso · Bloco A: PROCEDE no que fez, CORRIGE no que faltou

- **O teto 4 saiu do cortejo.**
  - `social.modoDevagar.resistencia` voltou a ter só `custoBase`, `divisorExcedente`,
    `excedenteComPisoZero`, `vontadePresa` e a nota.
  - O teto foi para um bloco novo, `social.modoRapido.resistencia` (`custoBase 1`, `porMargem 1`,
    `tetoCusto 4`), com uma nota que diz que vale para o Combate Social e o efeito mental, e não para o
    cortejo. É a D-015.
- **`relacoes-sociais.md` não está em nenhum dos onze commits.** Então o `:246`, o `:242` e o `:276`
  estão intactos.
- **`defesas.md:106`** (o efeito mental) diz a D-001 com a D-014. O texto: "pagar **1 + Margem** de
  Vontade (teto 4) recusa o efeito. Com Margem 1 ou mais, você pode pagar só 1: o efeito pega, mas dura
  **um grau a menos na régua de Duração do próprio efeito** (a da Arte, Breve ou Longa, ou a da Proeza);
  se ele já está no menor grau dessa régua, pagar 1 o anula".
- **As réguas citadas existem**, e nenhum nome de grau foi inventado:
  - `arcano.improviso.graus.duracaoBreve`: instantâneo, 6, 12, 24, 60, 120 e 300 Ticks;
  - `duracaoLonga`: instantâneo, 10 min, 1 h, 6 h, 1 dia, 1 semana e 1 mês;
  - `escalasProeza.parametros.duracao`: 1 ação, 6 Ticks, 1 cena, várias cenas, horas, 1 dia ou mais.
- **`regras.json` `arcano.resistencia.tipos`**, a linha "Mente e alma": ganhou a remissão para Defesas.

**CORRIGE (A) · `qual-sistema.md:43` e `:119` ainda dão a regra velha.**

| linha | o que diz |
|---|---|
| `:43` (nó do diagrama) | "Alvo pode gastar Vontade para blindar: pontual (nega um golpe) ou por cena/dia" |
| `:119` (a folha) | "**Blindar a mente:** gastar Força de Vontade (pontual ou por cena/dia)" |

- É a regra que a `defesas.md:106` acabou de trocar (o antigo "se blinda por um tempo, uma cena ou um
  dia").
- O relato afirma: "Outro lugar que trata de resistir a efeito mental: só a linha 'Mente e alma' de
  `arcano.resistencia.tipos`". A afirmação é falsa nestas duas linhas, e o despacho (A.3) mandava
  escrever a regra "onde o livro tratar de resistir a efeito mental". É §8: a rodada prometeu a
  varredura, e o conserto é pequeno.
- **Correção:** as duas linhas dizem "1 + Margem (teto 4) recusa; pagar 1 encurta um grau na régua de
  Duração do próprio efeito, e no menor grau anula". O SVG sai do `gen-mermaid`.
- O "Contra leitura não dá para se recusar" de `:119` continua certo.

**Observação, sem rótulo.** A linha que o Bloco A reescreveu em `regras.json:1294` (`"resiste":
"Defesa Mental (passiva) [travessão] a conjuração [...]"`) conserva um travessão que já estava lá. Não é
travessão novo: a contagem do arquivo caiu de 22 para 21 na faixa, com a saída do Fôlego. Mas a linha
foi reescrita e o travessão ficou.

## Bloco B · Margem na Acumulada: PROCEDE

- `acoes-e-sistema.md:79` diz a P-01: "**O que mais a Margem compra dentro de uma Acumulada, o Mestre
  decide.** Dois exemplos [...]: no Esgueirar, uma Margem congela um intervalo [...]; no Ofício feito às
  pressas, uma Margem sobe a qualidade da peça um grau".
- `acoes-sentidos-e-engano.md:77` virou "o Mestre decide [...]; um exemplo: cada Margem congela um
  intervalo".
- A G75 foi fechada com a fala do autor (`G-acoes-sistema.md`), e o `Pendencias.md` regerado diz
  "Fechados (25): [...] G75".
- `regras.json` não tem campo que feche os dois efeitos como regra: procurei.

## Ponto 3 do aviso · Bloco D: PROCEDE, com CORRIGE no relato

**Teto de Arte e Proeza (D-006):**
- `regras.json` `arcano.tetoNivelArte.porCentelha` é `[2, 3, 4, 5, 6, 6, 6]`, a tabela do autor;
- `capFor('arte2')` (`ficha-engine.ts:180-183`) lê esse campo com o índice preso entre 0 e 6;
- o teto de Proeza não mudou: `notaEscalaCentelha` e `escalaCentelha` estão intactos, e "o nível N exige
  Centelha ≥ N" continua.

**O mortal destravado só nos quatro pontos:**
- `ficha-engine.ts:174-183`;
- `grid.astro:3329`: `mana: R.mana`;
- `combate.astro:1690-1693`: `manaDe(...)` para todo personagem;
- `FichaSkeleton.astro:117`: "nível máximo: Centelha + 2, até 6".

Nenhum outro arquivo de código entrou no `7e0d0bb7`.

**Sem Mana própria (D-002) e sem Meditação (D-003).** A Mana do mortal é a `mana()` de `calc.ts` (a
Vontade), não há reserva separada e a recuperação não mudou. Isso casa com "a implementar" no registro.

**A lista de quem passa do teto** (relato) traz o Bram, com cinco Artes no nível 5 e Centelha 1 (teto
3), e diz que nenhuma criatura passa. Não reconferi as 58 criaturas.

**CORRIGE (D) · a lista "Outra regra escrita que conflita com o teto novo" não traz o
`arcano.astro:63`.**
- O texto: "*Exemplo:* um magus de academia de **Centelha mínima** que, só com estudo, conjura Artes
  tão fundas quanto as de um grande herói".
- Com o teto Centelha + 2, Centelha mínima dá Arte 3 no máximo, e o "tão fundas quanto as de um grande
  herói" deixa de valer. É o mesmo conflito do Bram e do `criacao:149`, que o relato lista. Este falta.
- O despacho (D.5) manda "aponte no relato qualquer outra regra escrita que conflite". O conserto é
  acrescentar a linha à lista para o autor, sem mexer no texto.

## Ponto 1 do aviso · Bloco C, o Fôlego (D-016): PROCEDE

**A ficha ignora o Fôlego velho: conferido, e a prova é parcial mas basta.**
- A prova do relato (`../tmp/executora/teste-folego-velho.mjs`) exercita o `resumoFicha` e o
  `resumoParaBanco` da mesa, e não a carga da `/ficha`.
- Conferi a carga lendo o código de antes (`66497997~1`). O `ficha-engine.ts` nunca guardou Fôlego no
  objeto da ficha: ele só o calculava (`:1567`) e o mostrava (`:1586`, `:1646`, `:1649`). O único campo
  `folego` persistente era o das armas, que fica, e o `IMPROV` de `:795` o mantém em 0.
- Logo, ficha salva não traz o campo e não há o que ignorar. O resumo do banco trazia, e é o que a prova
  cobre.
- No Supabase, a view da `migracao-18.sql` (`:65`, `:70`) continua citando `resumo->'folego'` com
  `coalesce`. Resumo novo sem a chave cai no 0, sem erro. Não precisa de migração.

**O que o jogador ainda vê com a palavra.** Varri `src` lendo os arquivos com normalização de acento,
porque o `grep` com `[oô]` não casa neste ambiente.
- **Nada que fale da reserva.**
- **Sobra a palavra comum:**
  - Vigor, em `atributos.md:45`;
  - Atletismo e Resistência, em `habilidades.md`;
  - Firulas, em `habilidades.md:102`;
  - Canto;
  - `acoes-corpo:183`;
  - `regras.json:404` e `:451`;
  - `artes.json:852`;
  - nomes de poder de criaturas.
- **As 9 Técnicas ocultas** (`modulo: "folego"`, com os textos que falam da reserva) não aparecem:
  - `tecnicaDisponivel` as filtra, e `data.ts:35-37` tira da navegação a Proeza Coração Incansável
    inteira, porque ela fica sem técnica;
  - a descrição dela ("fôlego, fadiga, marcha sem fim", `caminhos.json:104`) também some.
- **O campo `folego` das armas** e dos schemas (`validate-data.mjs:106`, `content.config.ts:84` e
  `:201`) **fica**, inerte, como a D-016 manda.

**Afogamento e Inverno** (`efeitos.json`):
- `:5586`: "sufoca enquanto durar, mesmo em terra seca, pela regra de Sufocamento do capítulo Resistir
  (Janela de socorro = Vigor × 20 Ticks)". A regra existe em `acoes-resistir.md:160`.
- `:4372`: "sofre −1d6 nas ações físicas enquanto exposto".

Os dois dizem o que a D-016 diz.

**`segundo-folego` e `fechar-feridas`:** o texto das duas não cita a reserva. O relato diz que nunca
citou, e o nome "Segundo Fôlego" ficou.

**A condição `sem-folego` saiu de `condicoes.json`.** A pendência D16 foi registrada.

## Ponto 4 do aviso · Bloco E, a matilha de worgs em desafio 1: PROCEDE

- **A conta:** proteger, desafio 1 (Valor 95), 1 semana, ×1, ×1, 4 pessoas: 95 × 4 = **380 pc**, que já
  está na régua (passo 10).
- `custo-servicos.md:113` diz isso, e troca a referência velha por "matilha de 4 worgs, desafio 1".
- `test-recompensa.mjs:71` tem o 380/380. Rodei, e passa.
- **Não sobra "worg 0, dupla 2, matilha 3" em `src`, `scripts` nem `lore/economia`** (procurei "worg" e
  "matilha").

## Ponto 5 do aviso · Bloco F, o Ataque Total: PROCEDE

- `scripts/sim/desafio-bancada.mjs`: a variante saiu toda. Saíram o ramo de escolha, o retorno, o
  `c.ataqueTotal`, o cooldown e o `ataqueTotal: false` do bando, e no lugar ficou um comentário de duas
  linhas.
- `Pendencias.md` e `docs/pendencias/` não citam o termo.
- **O histórico ficou:**
  - `b14-fase5b-economia-de-acao-relato.md`, com a decisão anotada na `:193`;
  - `b14-fase5b-economia-de-acao-despacho.md`;
  - `fechamento-economia-reforma-despacho.md:5`.
- O "Multiataque total" do Grande Wyrm é outro nome, e ficou.

## Bloco H: PROCEDE

- **`gen-monsters.mjs --check`.**
  - Em modo `--check` nada é gravado: o `emitir` só grava fora dele, e esses dois são os únicos
    `writeFileSync` do script.
  - O check está no `validate` (`package.json`), e a entrada `gen-monsters.mjs` saiu de
    `GERADORES_FORA` (`test-portoes.mjs`).
  - O `build` continua rodando o gerador sem `--check`.
  - Rodado por mim: verde.
- **Kael, Percepção 3 → 6** na fixture. A certa é a do livro (`criacao-de-personagem.md:95`, "Percepção
  6 (pico)"). O `test-kael` continua verde.
- **Sora, `combate.md:21`:** agora são Defesa 20, 17 nos dados e 5d6 + 9 = 26. 26 − 20 = 6, uma Margem.
  Confere.
- **`desEsqDaDefesa`** (`artes-grid.ts:1857-1858`). O comentário novo diz que, com Esquiva < Centelha, o
  valor sai **baixo**. Fiz a conta:
  - Defesa = 2(D + E) + 2E;
  - a função tira 2C > 2E e divide por 2, o que dá D + 2E − C < D + E.

  O "baixo" está certo, e o "alto" de antes estava errado.
- **Observação, sem rótulo.** A linha nova empurrou uma citação em `docs/simulacao/REVISORA.md:1196`, o
  contrato histórico da revisora antiga, que se guarda byte a byte. Ela foi reapontada (`:217` → `:228`)
  porque o portão de procedência exige. Fica o registro de que o portão alcança até o documento
  histórico.

## Blocos I, J e K: PROCEDE

- **I:**
  - `docs/itens-magicos/itens-magicos-pesquisa.md` foi commitado;
  - a G76 está em `G-acoes-sistema.md` e no `Pendencias.md`, sem desenho;
  - o arquivo novo não tem travessão. Não li a pesquisa inteira.
- **J**, só relato. Conferi cada citação:
  - `CalculadoraRecompensa.astro:36` e `:41`, com `value={REC.pessoas_padrao}`;
  - `recompensas.json:263`, com `"pessoas_padrao": 4`;
  - `modelo.py:509`;
  - `recompensa.ts:128`.

  O "4 no confronto, 1 na perícia" não existe no código, como o relato diz.
- **K**, as seis entradas:
  - Guarda sob pressão, nova K38;
  - K37, anotada na K;
  - B16, adiada na B;
  - topo da tabela, anotado na G;
  - Dragões, B19, sem ação;
  - Cortejo, nova E11, que cita o `vontadePresa` em `social.modoDevagar.resistencia`.

  O `Pendencias.md` foi regerado.

## Travessão (sem confiar no relato)

Contei o caractere no arquivo inteiro, antes (`03c1d711~1`) e no pino, em todo arquivo que a faixa
tocou, fora os JSON gerados do bestiário e o `diagramas.json`.
- Só três números mudaram, e nenhum subiu:
  - `regras.json`, de 22 para 21;
  - `folego.md` e `sim-folego.mjs`, que foram apagados.
- Os arquivos novos (`itens-magicos-pesquisa.md` e o relato) têm 0.
- Nenhum travessão novo.

## Não conferido

- Se as 58 criaturas com Arte estão todas dentro do teto (o relato diz que sim).
- A pesquisa de itens mágicos, que não li inteira.
- O Bloco G, ainda não publicado.
- `npm run build` e o `dist/`.
- As provas em Edge headless do relato (`teste-arte-mortal.mjs`, `driver.mjs`).

## Depois do pino (§10)

Entre o pino e o push entrou `822be8b1`, o Bloco G (`lore/economia` fora do git). Ele toca o
`.gitignore`, `lore/economia/` (fora da `v2/`) e o relato. Não muda nenhum arquivo que julguei aqui:
- o `modelo.py:509` que o Bloco J cita é da `v2/`, que fica;
- o relato só ganha a seção do G.

Por isso rebaseei. O Bloco G não foi revisado nesta rodada.

## Limpeza

Só leitura, três testes e contas com `node -e`. Nenhum arquivo versionado tocado além deste e do
`progresso-revisora-126.md`.
