# Rodada 103 · Executora · a folha cala para o arremesso

- **Despacho:** `docs/simulacao/caixa/103-despacho.md` (`39a0de9`).
- **Árvore:** branch `executora`, que começou em `39a0de9` depois de o `merge-base --is-ancestor`
  dar verdadeiro.
- **Progresso:** em `progresso-103.md`, com as horas lidas da máquina.

## ENTROU

### 1 e 2 · O conserto, e onde ele decide

**Uma função nova, `faixaNaFolha(arma, metros, classe)`, em `src/lib/alcance.ts`.**

- Para a classe `arremesso`, ela devolve `null`.
- Para o resto, devolve o que `faixaDeDistancia` devolve.
- A folha da ação (`grid.astro`, bloco "O ALCANCE") passou a chamá-la com a classe do ataque, no
  lugar de `faixaDeDistancia(ra?.arma, dist!)`.

**Com `fx` nulo, a folha já calava sozinha:**

- o ramo `distancia || arremesso` devolve `''`, e isso cobre as duas frases: a da faixa e a de
  "Além do alcance máximo";
- a marca `al-aviso-conta` não acende, porque exige `fx`.

A classe `distancia` passa inteira.

**Por que uma função nova, e não um `null` dentro de `alcanceDaArma`.** O `alcanceInterpor` lê
`faixaDeDistancia`. Um `null` para o arremesso lá dentro faria o interpositor deixar de ser barrado
pelo máximo e pela reta, e o despacho proíbe mudar o `alcanceInterpor`.

**Por que na lib, e não um `if` solto na tela.** Fica uma função pura que o teste de portão
exercita sem navegador, e a regra de "decide a função, a tela coleta" se cumpre pela metade que
cabe aqui.

`alcanceDaArma`, `faixaDeDistancia` e `alcanceInterpor` não mudaram de comportamento.

### 3 · O comentário que mentia

O comentário de `alcanceDaArma` dizia que ela devolve `null` para "tudo que se arremessa". O
comentário novo diz o que a função faz:

- ela devolve `null` só sem `distMax`;
- as 8 de Arremesso têm `distMax`, nenhuma tem fração, e saem com livre 0 e o máximo do catálogo;
- esse número não é o da regra (é o I12);
- a folha passa por `faixaNaFolha` e cala;
- o `alcanceInterpor` continua lendo esta função.

### 4 · Os outros lugares onde o `distMax` de uma arma de arremesso decide ou mostra algo

Só listo. Nada disto foi trocado.

| arquivo e linha | o que faz | algum caminho de jogo alcança? |
|---|---|---|
| `src/lib/alcance.ts`, `alcanceInterpor` (o ramo à distância: `faixaDeDistancia`, `fx.alem`) e `src/pages/mesa/grid.astro:6608-6625` (quem chama, com a classe de `classeDeTempo`) | DECIDE: barra o interpositor além do `distMax` do catálogo ("Além do alcance da arma original (10 m, medido do agressor)") e fora da reta. Conferido no teste novo: a adaga a 11 m continua barrada | sim, quando alguém se interpõe a um golpe em curso de quem ataca com arma de arremesso no Grid (a lista de quem pode se interpor, `mesa-tempo-ui.ts:307`) |
| `src/lib/ficha-engine.ts:1379-1380` (`statsBlocos`) | MOSTRA: o cartão da arma na ficha troca o bloco Defesa por "Distância N m" sempre que a arma tem `distMax`, e isso inclui as 8 de arremesso (adaga 10 m, funda 200 m) | sim: qualquer ficha com uma dessas armas, no equipamento ou no catálogo de escolha |
| `src/pages/equipamentos.astro:25-27` e `:86` | MOSTRA e ORDENA: a página de equipamento põe arremesso junto de distância (`aDistancia`) e mostra o `distMax` na coluna de alcance, ordenando por ele | sim: a página pública `/equipamentos` |
| `src/components/BestiaEditor.astro:219`, `:446`, `:509` | o campo `alc` (`distMax`) do ATAQUE de criatura no editor do bestiário, e o "N m" na prévia. É o `distMax` do bloco de ataque da criatura, e não do catálogo de armas | só no editor do bestiário; não é o catálogo |

Não achei outro consumidor. A busca por `distMax`, `alcanceDaArma`, `faixaDeDistancia` e
`alcanceInterpor` em `src` e `scripts` não devolveu mais nada, fora os testes, os esquemas
(`content.config.ts:177`, `validate-data.mjs:95`) e o tipo de `bestia-editor.ts:58`.

### 5 · Quais armas caem na classe `arremesso`

Pelo `classeDaArma` (a `classe` do catálogo), são 8:

| arma | `distMax` |
|---|---|
| `adaga-de-arremesso` | 10 |
| `machado-de-arremesso` | 12 |
| `azagaia` | 40 |
| `funda` | 200 |
| `dardos` | 30 |
| `bumerangue` | 50 |
| `rede` | 5 |
| `pilum` | 25 |

- **A funda e os dardos caem em `arremesso`**, e não em `distancia`.
- **Nenhuma das 8 tem `alcanceLivreFrac`.** Conferi o campo em cada uma, e o teste novo lista as 8
  pelo catálogo.

### A prova

**O teste, no portão.** É `scripts/test-folha-arremesso.mjs`, em node, sem navegador. Entrou no
`npm run validate` logo depois do `test-combate-tempo.mjs`, e por isso roda no gancho e no CI. Ele
confere quatro coisas:

1. as 8 armas de arremesso saem caladas a 4 m e além do máximo;
2. o **par positivo**: a besta pequena a 60 m continua na 2ª faixa (−6), dentro do livre continua
   sem faixa, e além dos 100 m continua com "não chega";
3. o `alcanceInterpor` continua barrando a adaga a 11 m;
4. a fonte da folha chama `faixaNaFolha(ra?.arma, dist!, classe)`, e não mais
   `faixaDeDistancia(ra?.arma`.

**Os três sentidos, lidos:**

| estado | resultado |
|---|---|
| com o conserto | verde, 16 ✓, exit 0 |
| contra o código de hoje (`git stash push -- src/lib/alcance.ts src/pages/mesa/grid.astro`, só os meus dois arquivos, depois `stash pop`) | **vermelho**, exit 1, 3 ✘: "existe a função que a folha chama", "a folha do Grid lê a faixa por `faixaNaFolha`", "e não lê mais `faixaDeDistancia` direto" |
| conserto desfeito só na função (sem a linha do `arremesso`) | **vermelho**, 8 ✘, uma por arma |
| conserto desfeito só na tela (a folha de volta a `faixaDeDistancia`) | **vermelho**, 2 ✘ |
| restaurado | verde |

**A medição na tela**, refeita e anotada na `medicao-i12.md`, na seção "Refeita na rodada 103", com a
tabela de antes e de depois:

- **Antes:** a adaga saía com faixa a 3, 4 e 7 m, e com "Além do alcance máximo (10 m)" a 15 e 30 m.
  A azagaia saía com 1ª a 3ª faixa.
- **Depois:** as duas saem caladas em todos os casos.
- **A besta:** calada dentro do livre nos dois estados. A 54 m (bench 30, 120 colunas), depois do
  conserto, ela mostra "1ª faixa de distância (livre até 40 m, máximo 100 m): -3 no acerto, para
  somar à mão.". É o par positivo na tela.
- **O caminho da arma vinda da ficha de um PC equipado ficou sem medir.** A bancada não tem PC com
  arma de arremesso, e montar um seria mexer no `mesa-mock.mjs`.

**O portão:**

- O primeiro `npm run validate` ficou **vermelho**: 7 citações de documento a linhas de `alcance.ts`
  envelheceram com as linhas novas, todas em `L-simulacao-simultaneo.md`.
- `node scripts/reapontar.mjs` reapontou 36 citações pelo mapa do diff, em quatro arquivos:
  `L-simulacao-simultaneo.md`, `ESTADO.md`, `VOZ.md` e `CONTEXTO.md`. Os quatro estavam limpos
  antes.
- O script avisou 4 citações ambíguas em `grid.astro` e não as tocou. O portão não acusa nenhuma
  delas.
- O segundo `validate` deu exit 0, e o `npx astro build` também.

**Travessão:** contei "—" em cada arquivo tocado, contra o `HEAD`, lendo os arquivos. Nenhum aumentou, e os três arquivos novos têm zero.

## PRECISA DE MIM

Nada. A lista do item 4 é para a decisão do I12, que é do humano.

## QUEBROU

Nada. O vermelho do portão foi o de citação, reapontado dentro da rodada.

## BLOQUEADO

Nada.
