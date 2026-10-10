# 150 · Revisora · A rodada 14 das armas: Chutes saem, armas naturais, mão que conta como arma, test-grid desligado (`e462681a` e `0fab8b13`)

**Resposta à pergunta do Arquiteto: não, eu não tinha emitido o veredito da rodada 14.** Os arquivos dizem a mesma coisa que ele achou:
o `140` é a rodada 13 (Punhos e Chutes), o `141` é a correção dela, o `142` é a limpeza dos estados do `decisoes.md`, e nenhum
deles cobre os dois commits da rodada 14. O `142` só os cita como contexto (os estados D-067 a D-071 que seguem "a implementar" com o
`e462681a` já no `main`). Este é o primeiro veredito deles. A frase da mensagem anterior ("o seu veredito da rodada 14 continua sendo o
que segura as rodadas 4a a 6") partia de um veredito que não existia; o que seguravam era a falta dele.

Pino: `0fab8b13` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 0fab8b13` depois de
`git merge-base --is-ancestor HEAD origin/main` passar; o veredito 149, `6e532be3`, é ancestral). Escopo: `e462681a` (D-067 a D-071) e
`0fab8b13` (tira o parágrafo da D-068 de `combate.md`), contra as D-067 a D-071 como estão no `decisoes.md`, e a coerência de
`combate.md`. Fonte do julgamento: o commit congelado e as decisões; a mensagem dos commits e o relato da Executora
(`veterana-1e-relato.md`) tratei como hipótese.

**Resultado: PROCEDE. Nada precisa de CORRIGE antes de liberar as rodadas 4a, 4b, 4c, 5 e 6.** Três coisas ficam para o Arquiteto
(estados do registro, o que a ficha faz hoje com Punhos nas duas mãos, e uma frase de Técnica), nenhuma bloqueia `combate.md`.

**CI da faixa (§11):** o `Validar dados e regras` está **verde no `0fab8b13`** (run `37400495466`, 18 jobs verdes) e o `Deploy` também.
**No `e462681a` o run aparece "failure" e não é falha do código:** o único job vermelho é o `Smoke · test-golpe-caido`, e o log mostra
que ele foi **cancelado no `npm ci`** ("The operation was canceled", 01:39:32) pelo push seguinte, o `0fab8b13`, que saiu logo depois (o
Deploy do `e462681a` também ficou "cancelled"). Os outros 17 jobs do `e462681a` passaram. O `test-golpe-caido` está verde no `0fab8b13`,
que tem o mesmo código de dados e de ficha.

## 1 · `combate.md` ficou coerente (o que o Arquiteto pediu)

- **O `0fab8b13` devolve `combate.md` ao texto de antes da rodada 14, byte a byte:** `git diff e462681a~1 0fab8b13 -- combate.md` é vazio. O
  commit tira o parágrafo "Nada dá ataque extra sem dizer que dá" (o do gato) e só isso; o `e462681a` tinha acrescentado duas linhas
  em `combate.md` e as duas saíram.
- **Ninguém mexeu em `combate.md` depois:** `git log 0fab8b13..origin/main -- combate.md` é vazio. Então o texto que as rodadas 4a a 6 vão
  editar é o mesmo que o pino.
- **Nenhum resto da D-068 ficou no livro nem nos dados:** busquei "nada dá ataque extra", "um gato", "opções de ataque" em `src/` e `scripts/`;
  só sobram as ocorrências de "ataque extra" que são **por nome** (a Técnica de 1× a cada 6 Ticks, os poderes de criatura do bestiário),
  que é o que a própria D-068 manda deixar (ataque extra dado explicitamente).
- **O que `combate.md` diz hoje não depende do parágrafo saído:** a Rajada, a empunhadura dupla ("uma arma em cada mão") e a Guarda sob
  pressão estão como estavam, e a remissão ao chute e ao corpo vem de Armas & Armaduras ("Sem nada nas mãos, o corpo defende pela regra
  da luta desarmada"), que o `e462681a` atualizou. O chute "gasta a própria ação, como qualquer golpe", então não cria ataque a mais e
  não contradiz o `combate.md` sem o parágrafo.

## 2 · O que o `e462681a` fez, decisão a decisão

- **D-067 (Chutes saem): feito por inteiro.** Os **seis** arquivos que liam `chutes` no pai do commit (`gen-lista-equip.mjs`,
  `armas-e-armaduras.md`, `custo-qualidade-e-equipamento.md`, `quase-acerto.md`, `armas.json`, `ficha-engine.ts`) foram **todos tocados**, e
  `git grep -i chutes` em `src/`, `scripts/`, `.github/`, `public/` e `supabase/` no pino **não devolve nada** (só `docs/`). O
  `chute` (singular) sobrevive no texto, como a D-067 manda, com os números certos (média, Velocidade 6, Acerto +0, Defesa −1,
  1d6 + Força, Impacto) e "pode ser dado mesmo com armas nas mãos, e gasta a própria ação". A defesa com as pernas (−1) continua no
  texto, para quando as mãos não podem ser usadas. Na ficha, `ehCorpo` passou a ser só `a:desarmado` (os Punhos), e o Bloqueio de mão
  livre segue a D-065 (os dois punhos somam entre si, +1 cada, e arma ou escudo não somam com o corpo). Uma ficha que tivesse `a:chutes`
  cai em `kind: 'nada'` (mão vazia), que é o que a mensagem diz. O `test-contrato`, que a D-067 mandava limpar, não tinha o id (não
  precisou mudar) e passa com "33 armas ... voltam pelo slot". A N-grid perde o N16 e o N15, o N17 e o N19 foram reescritos sem Chutes.
- **D-068 (nada dá ataque extra): não aplicada, de propósito** (ver 1). O `decisoes.md` ainda diz "a implementar (rodada 14, texto em
  combate.md)" para ela; pede o ajuste de estado (item 3 abaixo).
- **D-069 (armas naturais):** `artes.json` "Garra e Presa" ("as garras contam como arma natural enquanto durarem e defendem como armas"),
  `tecnicas.json` "Forma Bestial" (mesma frase; a Executora trocou de passagem o travessão do texto por parênteses) e `caminhos.json`
  "Pele de Pedra" ganha o campo `nota` ("a partir do nível 2, a pele conta como arma natural para bloquear golpes com o corpo; o nível
  1 não bloqueia; cada Técnica continua dando o que já dá"). **O `nota` é lido e mostrado** (`caminhos/[id].astro:28`, com `set:html`) e o
  esquema o aceita. O `efeitos.json` (Pele de Pedra e Arma Conjurada) não foi tocado, como a D-069 manda. O `gen-grid-artes --check` e o
  `validate-data` passam com o texto novo.
- **D-070 (mão que conta como arma):** o parágrafo novo de Luta desarmada diz exatamente o que a decisão diz ("ela bloqueia ataques de armas,
  inclusive cortantes e perfurantes, a não ser que a Proeza ou a magia diga o contrário, e soma com as outras armas na defesa") e fica
  depois do parágrafo das armas naturais, sem contradizer o "contra lâmina, o corpo não segura" (que é para o corpo sem arma). **A ficha não
  calcula a Mão de Ferro** (busquei `Mão de Ferro` e `Punho que Parte` em `src/**/*.ts` e `*.astro`: nada), então a D-070 manda só avisar, e a mensagem
  avisa. Não mexeu nas duas Técnicas (a decisão deixa "se precisar de ajuste").
- **D-071 (`test-grid` desligado): desligado, não apagado.** `scripts/test-grid.mjs` continua no repositório (236 KB); a linha da matriz do
  CI virou comentário com a instrução de religar; saiu do `smoke` do `package.json`; entrou no `TESTES_FORA` do `test-portoes` com
  prazo e condição ("religa na passada única do Grid, N21"), e o portão passa. N21 está na N-grid. Os outros 17 testes de mesa seguem ligados
  (jobs verdes no `0fab8b13`).
- **Os portões no pino, rodados por mim:** `test-portoes`, `test-contrato`, `test-kael`, `test-quase-acerto`, `test-procedencia`,
  `test-travessao-capitulos`, `test-links-base`, `validate-data`, `gen-cap-itens`, `gen-pendencias`, `gen-monsters`, `gen-bench-tempo`: **todos verdes**.
- **Travessão e "Perícia":** nenhuma linha adicionada em `src/`, `scripts/`, `.github/`, `package.json` e `docs/pendencias/` tem travessão (varri o diff, não o
  `git diff` encolhido); as duas mensagens de commit não têm travessão nem coautoria; "Perícia" só como chave `"pericia"` do JSON.

## 3 · O que sobra para o Arquiteto (nenhum é CORRIGE da rodada)

1. **Os estados da D-067 a D-071 seguem "a implementar" no `decisoes.md`, no pino e no `main` de hoje.** A regra do plano é que o Arquiteto os
   atualiza depois do veredito e do CI. Com este veredito: **D-067, D-069, D-070 e D-071 → no ar (`e462681a`)**, com a D-069 e a D-070 só
   texto e a D-070 sem cálculo na ficha; **D-068 → NÃO aplicada**, retirada de `combate.md` em `0fab8b13` até o autor decidir (a D-083 já
   a trata como em espera). Sem isso a próxima Revisora lerá "a implementar" sobre algo no ar, que é o defeito que o `142` corrigiu em 48 entradas.
2. **O que a ficha faz hoje com Punhos nas duas mãos é o caso da pergunta pendente da D-083, e eu o descrevo como é.** **Pela leitura do código** (não medi na tela): na
   `ficha-engine.ts` o `a:desarmado` entra por `itemDe` como `kind: 'arma'`, e, se a mão inábil o tem, `calcConj` monta `dupla` (o
   segundo ataque, a −1d6 e −2 de acerto da inábil). Ou seja, Punhos/Punhos oferece **dois ataques** na ficha agora, sem que nenhuma decisão
   o autorize (a D-083 diz que "dois Punhos como par de leves" **não está registrado** e depende da exceção explícita). O texto de `combate.md`
   ("uma arma em cada mão") também não exclui os Punhos. Isso **não é defeito da rodada 14** (vem da rodada 13) e **não bloqueia as rodadas
   que editam `combate.md`**, mas a rodada **4b** (a dupla, D-083) decide o texto, e o que a ficha oferece tem de acompanhar a resposta do autor.
3. **Uma frase de Técnica, se o autor quiser (Princípio do Mestre):** o parágrafo novo de Luta desarmada cita "a Mão de Ferro, o Punho que
   Parte Pedra" como mãos que contam como arma (nomes que a D-070 dá como exemplo), mas o texto do **Punho que Parte Pedra** (N4) não
   diz que a mão conta como arma; só o da Mão de Ferro diz ("golpes desarmados contam como arma"). Quem ler a Técnica não encontra a
   ponte. **Sugestão de frase para a Técnica:** "Suas mãos contam como arma (veja Luta desarmada)". Não é regra nova, é a D-070 dita na Técnica.

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **A medição de ficha da Executora** ("Punhos/Punhos 4, Espada/Punhos 3") **não repeti na tela**: derivei a lógica do Bloqueio no código e a
  conferi contra a D-065, e os testes de contrato passam, mas o número na tela é dela.
- **O `test-grid` desligado** não foi rodado por mim, e a razão (o flake "[aquece]") eu li no relato, não reproduzi.
- **A leitura no navegador** do capítulo XIII (Luta desarmada) não foi feita nesta rodada; a de Armas & Armaduras foi no veredito 149, depois das
  rodadas 1 a 3, que não mexeram nesse trecho.
- **Absolvição por varredura de texto:** "chutes" foi absolvido por `git grep` no pino em `src/ scripts/ .github/ public/ supabase/ package.json`, não
  em `docs/` (onde a palavra segue em decisões, relatos e revisões, de propósito).

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/150-revisora.md` e `docs/simulacao/caixa/progresso-revisora-150.md`. Nenhum arquivo rastreado
foi tocado.
