# 159 · Revisora · A 5-bis (`0a87a64d`): as duas frases de dado e os pinos do 158

Pino: `0a87a64d` (branch `revisora` reancorada com `git switch -C revisora 0a87a64d`; o 158, `c6876851`, é ancestral). Escopo: o commit único da 5-bis (`regras.json` e `test-capitulo-armas.mjs`; o resto do `git diff --stat` desde `63817b4f` são os arquivos da caixa). Fonte: o meu 158 (o CORRIGE e as sugestões 1 e 2), a D-078 e a D-087.

**Resultado: PROCEDE.** O CORRIGE do 158 está fechado, as duas exceções são as certas, o pino de "só a parte presa conta" funciona. **Mais uma coisa que achei agora, que a 5-bis não podia pegar e que o meu 158 também não pegou** (item 4): `regras.json` `combateTatico` ainda carrega o teto de ±6 e a linha "Surpreso, cego ou imobilizado −4", e **as páginas `/mesa` e `/mesa/referencia` as mostram**. Peço decisão do Arquiteto, não pino o veredito nisso.

**CI (§11):** `gh run list --commit 0a87a64d` voltou **vazio** quando consultei; não afirmo. Rodei por mim, no pino, todos verdes: `npx tsc --noEmit` (exit 0), `test-capitulo-armas` (**104 estragos**, como a mensagem diz), `test-catalogo-distancia`, `test-forca-arco`, `test-combate-tempo`, `test-contrato`, `test-travessao-capitulos`, `test-links-base`, `test-portoes`, `test-procedencia`, `test-kael`, `validate-data`. O smoke eu não rodei.

## 1 · (a) A frase nova da faixa

`regras.json` `combate.alcance.faixas.ondeEntra` passou de "Por isso não respeita o teto de +/-6 dos modificadores de Defesa" para **"Por isso não é modificador de Defesa e não entra no teto de +6 dos bônus de Defesa"**. Mantém o sentido da antiga (a penalidade da faixa entra na jogada de acerto, e não na Defesa do alvo, dito na própria frase antes) e **não cria regra**: é o mesmo desenho da tag Alcance que a rodada 5 já usava ("não modificador de Defesa: não entra no teto de +6 dos bônus de Defesa"), e `combate.md` já diz que a penalidade da mira "entra na jogada de acerto, e não na Defesa do alvo".
A do Correndo (`movimento.corrida.texto`) agora termina em "que é o mesmo −4 do Tick do Golpe." e é igual à do capítulo. Mutações minhas: o Correndo com as condições de volta **falha**; a faixa com o teto velho **falha**; a faixa com o sentido invertido ("é modificador de Defesa e entra no teto") **falha**.

## 2 · (b) As duas exceções e a varredura

As duas exceções por caminho de chave existem e são as certas: `derivados.defesaSocial.reguaNota` (a régua social tem o próprio ±6) e `porteAcerto.nota` (o porte, que a rodada 6 reescreve). Varri `regras.json` por mim, com um regex mais largo (qualquer `±`, `+/-6` com os dois sinais, `+-6`, "teto de ±/+", "condições surpreso"): as únicas cadeias que casam são essas duas, a frase nova da faixa, a linha de `combateTatico` do item 4 e `defesaReflexiva` (que diz "teto de +6", certo), mais o falso positivo `combateTatico.nota` ("Cada ±1 ≈ ∓6%", que o regex do teste, que exige `±6` colado, não pega).
**A varredura pega as três grafias** (`±6`, `+/-6` com hífen ASCII, `+-6`): mutação minha em outra chave **falha** nas três, e a de "condições surpreso" também **falha**.
**Mas há três grafias que ela não pega** (todas **PASSAM**, mutações minhas em outra chave): **"+/−6" com o sinal de menos do livro (U+2212)**, "± 6" com espaço, e "de −6 a +6". O livro inteiro escreve o menos como U+2212 ("−2", "−4"), então é a grafia que um regresso futuro teria. Sugestão 1.

## 3 · (c) O pino de "só a parte presa conta"

Agora é pinado como a **frase inteira** ("**só a parte presa conta**: quem tem uma perna presa perde Esquiva e conserva o Bloqueio dos braços.", dentro do parágrafo que abre a tabela de restrição). Mutações minhas: trocar por "a restrição vale no corpo inteiro" **falha**; deixar "**só a parte presa conta**." sem o exemplo da perna **falha**. A sugestão 1 do 158 está atendida.

## 4 · O que achei agora e peço decisão: `combateTatico` ainda diz o teto velho, e a mesa mostra

O 158 disse que, fora as declaradas, só as duas frases de `regras.json` sobravam. **Estava incompleto, e o erro é meu**: a minha varredura de ±6 excluiu `pages/mesa*` (as páginas da mesa) do glob, e o `±` que a mesa mostra vem de um número interpolado (`±{modificadorCap}`), que um regex de texto não acha. O que sobra:

- **`regras.json` `combateTatico.modificadorCap: 6`** e **`combateTatico.modificadores[9]`: "Surpreso, cego ou imobilizado", valor −4** ("praticamente sem esquiva ativa"). É o dado da tabela de situações que a rodada 5 **tirou do capítulo** (as linhas "surpreso, cego ou imobilizado −4" e "agarrado −2" saíram de `combate.md`) e onde a D-078 mudou o teto e passou o surpreso a Defesa 0.
- **Quem lê e mostra:** `src/pages/mesa.astro` (l.12 `MODS` e l.127-132, a tabela e a nota "Teto de **±6** somando tudo. O porte entra no acerto, fora deste teto.") e `src/pages/mesa/referencia.astro` (l.38 e l.206, `{CT.nota} Teto de ±{CT.modificadorCap} somando tudo`). Confirmei no HTML gerado: **`dist/mesa/index.html` e `dist/mesa/referencia/index.html` trazem "Teto de ±6" e a linha "Surpreso, cego ou imobilizado" com −4.** Nenhum teste lê `combateTatico` (busquei em `scripts/`).
- **Contradiz o livro de hoje** (Combate Físico: "as penalidades não têm teto, o piso é 0"; surpreso 0/0; cego −4/−8). É a referência que o Mestre abre na mesa.
- **Por que não é só mais um CORRIGE de dado:** a correção toca a **frente da mesa** (`mesa.astro` e `mesa/referencia.astro`) porque as duas páginas lêem `modificadorCap` e `modificadores` por nome: tirar a chave sem tocar as páginas renderiza "±undefined". O CLAUDE.md dá `/mesa` à frente da mesa. A D-054 congela o Grid (e a mensagem da rodada 5 pôs o `condicoes.json` e o Grid na N22), mas **não diz nada sobre estas duas páginas de referência**, e a N22 também não as cita.
- **Opções, para o Arquiteto escolher:** (1) tratar como rodada 5-ter, com a Executora-2 corrigindo o dado e as duas páginas (tirar o teto de ±6 e a linha do −4, ou trocá-los por um remisso ao capítulo), e um pino no teste; ou (2) registrar na N22 como divergência da mesa (como as do Grid) e corrigir na passada da mesa. Eu escolheria a (1): é texto, não é motor, e é o que o Mestre lê.

## Sugestões sem veredito (D-087)

1. **Alargar o regex da varredura** para `/±\s?6|\+\s?\/\s?[-−]\s?6|\+\s?[-−]\s?6|de [-−]6 a \+6/`: pega o menos U+2212, o espaço e a faixa por extenso, e **não** pega o "∓6%" do `combateTatico.nota`.
2. **Pinar `combateTatico`** quando o item 4 for corrigido: que `modificadorCap` não exista (ou não seja 6) e que `modificadores` não tenha "Surpreso, cego ou imobilizado".

## O que ficou sem medir (§9)

- **Não medi em navegador** nesta rodada; a 5-bis só toca texto de dado que nada renderiza. **O item 4 li no HTML gerado** (`dist/mesa/index.html` e `dist/mesa/referencia/index.html`), não em captura nem a 390 e 1300 px.
- **CI do pino** (vazio na consulta) e **o smoke:** não verifiquei.
- **Não testei o efeito de tirar `modificadorCap`** nas duas páginas (afirmo só que elas interpolam o campo).
- **Travessão, "Perícia" e coautoria:** nenhum nas linhas adicionadas de `src/` e `scripts/` desde `63817b4f` nem na mensagem do commit.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/159-revisora.md` e `docs/simulacao/caixa/progresso-revisora-159.md`. Mutei `combate.md` e `regras.json` no lugar, um por vez, e os restaurei (`git status` limpo).
