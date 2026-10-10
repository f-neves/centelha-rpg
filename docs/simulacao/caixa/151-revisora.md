# 151 · Revisora · Correção do CORRIGE 149: o teste que prende o capítulo de armas ao catálogo (`9bd51dd3`)

Pino: `9bd51dd3` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 9bd51dd3` depois de
`git merge-base --is-ancestor HEAD origin/main` passar; o veredito 150, `e1eb45b4`, é ancestral). Escopo: o único CORRIGE do 149. O commit
traz `scripts/test-capitulo-armas.mjs` (novo, no `validate`), a frase nova em `armas-e-armaduras.md` e a correção da frase da mensagem do
`5c4bb201`.

**Resultado: PROCEDE.** O teste pega as mutações, nomeia a arma e os dois valores, e a frase da Kunai e da Mini-faca basta. O que o teste
deixa de fora não está na promessa da mensagem; vai como lista para quem estender na 4a e na 4b.

**CI da faixa (§11):** `Validar dados e regras` **verde no sha do trabalho**, `9bd51dd3` (run `38026026969`, 10/10/2026); `Deploy` verde
(`38026027037`). O teste novo está no `validate` (posição 66 de 67, entre o `test-catalogo-distancia` e o `test-portoes`), e o `test-portoes` passa.

## 1 · O teste pega as mutações? Sim, nos três arquivos

Rodei cada mutação **no arquivo de verdade, numa cópia da árvore fora do repositório** (o teste, o capítulo, `armas.json` e `regras.json`
copiados; uma mutação por vez; `git status` limpo ao fim). Sem mutação, o teste sai 0 ("18 estragos acusados").

| Onde | Mutação | O teste |
|---|---|---|
| capítulo | Velocidade da Kunai 4 para 5 | **falha:** "Kunai: Velocidade 5 no capítulo, 4 no catálogo" |
| capítulo | Efetiva do Composto 70 para 72 | **falha:** "Arco Composto: Efetiva 72 m no capítulo, 70 m no catálogo" |
| capítulo | Mãos da Azagaia 1 para 2 | **falha**, nomeia a arma e os dois valores |
| capítulo | Peso da Shuriken 50 g para 60 g | **falha:** "Peso "60 g" no capítulo, 0.05 kg no catálogo" |
| capítulo | Máxima do Curto na Força 8, 190 para 191 | **falha**, com os dois vetores inteiros |
| capítulo | dano da Besta Pequena 1d6+2 para 1d6+3 | **falha** |
| catálogo | ticks do Arco Longo 7 para 6 | **falha:** "Arco Longo: Velocidade 7 no capítulo, 6 no catálogo" |
| catálogo | dano da Funda 1d6 para 1d6+1 | **falha** |
| catálogo | Acerto da Boleadeira 0 para 1 | **falha:** "Acerto +0 no capítulo, 1 no catálogo" |
| catálogo | modo principal do Pilum de perfurante para impacto | **falha:** "modo principal P no capítulo, impacto no catálogo" |
| `regras.json` | Máxima da Besta Pequena 100 para 110 | **falha:** "Máxima 100 m no capítulo, 110 m em regras.json" |
| `regras.json` | Máxima do Longo na Força 3, 250 para 249 | **falha**, com os dois vetores |

As quatro que a mensagem diz ter feito (Kunai, Composto, Arco Longo, Besta Pequena) falham do jeito que ela diz. **Uma imperfeição de
mensagem, só estética:** quando o bônus do catálogo é positivo, a mensagem mostra `1d61` e `1d62` no lugar de `1d6+1` e `1d6+2`
(`${a.dado}d6${a.danoBonus || ''}` não põe o sinal); os dois valores continuam identificáveis, mas um `+` tornaria a linha legível.

## 2 · Há tabela do capítulo que ele deixa de fora?

**Nenhuma tabela de arma de distância ou de arremesso.** O teste cobre as quatro: Arremesso, Atirador, a Máxima por Força no arco e a de
Classes, e exige que toda arma de tiro e de arremesso do catálogo (menos os bumerangues Cortantes, que o capítulo descreve em texto) tenha
linha. **Colunas e linhas que ele não confere**, e eu mutei para ver:
- **A coluna Classe** das duas tabelas (Leve, Média, Pesada, Distância): trocar a Azagaia de Pesada para Leve **passa**; trocar o Arco Curto
  de Distância para Arremesso **passa**. A classe é derivável da Velocidade (4 leve, 5 média, 6 pesada), então um cruzamento barato fecha.
- **O modo secundário** (o `· I` do Machado, `★C · I`): tirá-lo **passa**. O teste lê só o principal e o Nível de Perfuração.
- **A tabela de Classes, fora da Velocidade:** a coluna Dano (arremesso leve `1d6−4`), o Acerto e a faixa de Efetiva do texto ("Efetiva de 4 a 16 m")
  **não são conferidas**; mutar o dano do leve e a faixa do pesado **passa**. E as linhas de corpo a corpo (Leve, Média, Pesada, Haste) **não entram**: só as
  sete de tiro e arremesso. Isso importa na **4b**, que muda o corpo a corpo (Punhos 1/1/3 etc.).
- **O Destaque e a prosa:** "Força 4+" do Composto, "Curto tem Força máxima 3", as Máximas das bestas escritas no parágrafo ("Pequena 100 m ...")
  e os números dos exemplos (o 8,6 m do pilum em Corpo e Movimento, o −9 do parágrafo da Efetiva) **não são pinados**; mutar cada um **passa**. O que é número
  de tabela está preso; o que é número de frase, não. (A Máxima das bestas está presa pelo Destaque da tabela, não pelo parágrafo.)
- **Tabelas de outras classes de peça** (corpo a corpo, armaduras, escudos): fora do escopo deste conserto (a Placa Completa e as armaduras
  têm `test-contrato` e `test-bandeiras`).

**Nada disso desmente a mensagem do commit**, que lista exatamente o que o teste faz (Velocidade, dado e bônus, Acerto, Efetiva, Peso, Mãos, modo
principal e N, a Máxima fixa das bestas, a Velocidade de cada linha de Classes, as três linhas da Máxima por Força) e **é fiel a ela**. Por
isso o veredito é PROCEDE. A lista é o que a 4a e a 4b deveriam acrescentar quando mudarem Velocidades e P/G/R: a Classe contra a Velocidade, e a
tabela de Classes inteira (inclusive o corpo a corpo, na 4b).

## 3 · A frase da Kunai e da Mini-faca basta?

**Basta.** O bullet novo ("As três leves", `armas-e-armaduras.md:110`) diz: quase iguais, o jogador escolhe pelo estilo; a Shuriken é fina e
rasa, a Mini-faca é fácil de esconder, a Kunai, mais pesada e com argola, serve também de ferramenta (o Mestre julga); as três só furam pele (N0).
Cobre as três notas que o Destaque escondido não mostrava (a da Kunai que eu apontei, a da Mini-faca e a da Shuriken), não inventa número nem exemplo
de ferramenta (deixa o caso ao Mestre, que é o Princípio do Mestre) e o "N0" confere com o catálogo (`pen` 0, modo P(N0)). Não pede mais.

## Sem medir

- **O teste só confere o que o capítulo traz em tabela de pipes** e o que `regras.json` e `armas.json` dizem; ele não sabe se o capítulo **deveria**
  trazer uma arma que ninguém pôs no catálogo (só o contrário, arma do catálogo sem linha).
- **Só rodei as mutações numa cópia da árvore, não no `validate` inteiro**; o `validate` completo roda no CI, verde.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/151-revisora.md` e `docs/simulacao/caixa/progresso-revisora-151.md`. Nenhum arquivo rastreado foi tocado.
