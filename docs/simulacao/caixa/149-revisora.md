# 149 · Revisora · Armas de distância, rodadas 2 e 3: textos de Armas & Armaduras e de Corpo e Movimento (`53574bf0`)

Pino: `53574bf0` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 53574bf0`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 148, `e18be1ef`, é ancestral do pino). O pino contém
`5c4bb201` (rodada 2) e `53574bf0` (rodada 3), em cima de `1b20784e` (só a nota da arte provisória no N22).
Fonte do julgamento: o commit congelado contra o plano (rodadas 2 e 3), as D-072 a D-076, D-085, a M-32 (agora em `decisoes.md`), o
2f e `armas.json`/`regras.json`. O relato da Executora (as duas mensagens de commit) tratei como hipótese.

**Resultado: um CORRIGE (um ponto, pequeno), o resto PROCEDE.** Os textos batem com o catálogo e com as decisões, as contas dos
parágrafos refazem pela fórmula, o preço da Plumbata saiu pelo gerador, nenhum Preparo ou Recuperação foi escrito, e as contradições
com `combate.md` são as que ela listou, nenhuma grave. O CORRIGE é uma frase da mensagem de commit que atribui a um teste uma
conferência que ele não faz.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde no sha do trabalho**, `53574bf0` (run `38025179073`, 10/10/2026),
com os **18 jobs verdes**; `Deploy site` verde (`38025179175`). `1b20784e` também verde (`38024953320`).

## Como conferi

- **Os textos contra o catálogo, por leitor meu** (não pelo teste dela): extraí as duas tabelas novas de `armas-e-armaduras.md`
  (Arremesso, 13 linhas, que valem 15 ids, e Atirador, 6) e comparei célula a célula com `armas.json`: Velocidade, Dano, Acerto,
  Efetiva, Peso e Mãos, **21 linhas, 0 divergências** (a Rede sai "não causa dano" no lugar do 1d6; a Funda "pedra de 100 g" no lugar do
  peso). Os Modos da coluna, que li à mão, também batem (Shuriken, Mini-faca, Kunai e Adaga ★P(N0); Plumbata ★P(N1); bumerangues
  ★I ou ★C; Machado ★C · I; Azagaia ★P(N1); Pilum ★P(N2); Boleadeira, Funda ★I; arcos ★P(N1); Besta Grande ★P(N2)).
  A tabela da **Máxima por Força** do capítulo (Curto, Longo, Composto, Força 1 a 8) contra `regras.json` `combate.distancia`: **24 de
  24**; as bestas (100, 200, 300) e "Força acima de 8 conta como 8" idem.
- **As contas dos parágrafos, refeitas pela fórmula 7 × FAA^0,7 ÷ peso^0,4:** FAA 2 e pilum de 2 kg: **8,62 m** (o texto diz "uns 8,6 m",
  contra 12 m de Efetiva). Funda, pedra de 100 g, com o ×2: **92,8 / 176,2 / 244,9 / 325,3 m** para FAA 4, 10, 16, 24 (o texto diz 93, 176,
  245 e 325, que é o meu 92,8 arredondado; a mensagem do commit diz 92,9, 0,1 de diferença que não muda o inteiro). Azagaia de 800 g com atlatl, que o 2f cita:
  40 / 77 / 107 / 142 m (não está no capítulo). **O parágrafo da Efetiva:** faca de arremesso (10 m) contra alvo a 25 m: n = ⌈15 ÷ 5⌉ = 3,
  −9; Arco Longo (50 m) a 150 m: n = ⌈100 ÷ 25⌉ = 4, −12. Os dois conferem com o 2f §3.
- **A leitura no navegador, por amostragem minha** (`dist/` do pino, Edge): a página `/regras/armas-e-armaduras/` em **390 px e em
  1300 px**, 0 erros de página, **sem rolagem horizontal da página** (390 e 1300), as tabelas Arremesso, Atirador e Máxima por Força no
  arco legíveis (no celular rolam dentro do próprio quadro, como o resto do site; no desktop cabem inteiras, 736 de 736 px); os ids
  `arremesso` e `atirador` existem, sem id duplicado na página. Capturei as tabelas e o parágrafo da Efetiva nas duas larguras.

## 1 · Textos contra as decisões (pergunta 1)

**Procede, ponto a ponto:**
- **Tabela de Arremesso com Peso** (D-074/D-076): 13 linhas, 50 g a 3 kg, "pedra de 100 g" na Funda. **Tabela Atirador:** Velocidade
  6, 7, 7, 9, 12, 15, Efetiva 30 a 80 m, e a Máxima das bestas no Destaque e no texto.
- **Máxima por Força** (D-075): a tabela, as três frases ("Força máxima só no Curto: 3"; "o Longo e o Composto não têm"; "Força mínima
  é a Força máxima menos 3, só nos arcos que têm Força máxima definida; quem não a alcança não consegue armar"), "a mesma Força
  limita o bônus de Força no dano" e "a Máxima maior do Composto é intencional". A "Força acima de 8 conta 8" aparece só para a tabela
  de Máxima, como o plano diz (o dano é da 4a).
- **A frase do Composto (M-32):** "só rende o dobro da Força, e o +2, com Força 4 ou mais; com menos, rende como um Arco Longo. Isso não é
  a Força mínima dos arcos reforçados, que é uma regra à parte." É a frase que eu sugeri no 147, e o `armas.json` (`forcaMin: 4`) a sustenta.
- **Rede "não causa dano"** (célula e bullet) e **Preso pela Rede −2/−2, mais −1 em cada por grau de Margem, sem teto**: o "em cada"
  é a leitura que o 2f §8.5 confirma ("mais −1 e −1 por grau de Margem", e "com Margem 4 a Rede vale −6/−6"). **Boleadeira** Preso pelas
  pernas, Esquiva −4, escapa por Força + Atletismo contra o total.
- **Plumbata Bloqueável:** tag, linha da tabela, bullet de Projétil rápido e a exceção no parágrafo dos Escudos.
- **Bumerangues Impacto ou Cortante, teste Média 10:** o de retorno Cortante pede Destreza + Arremesso, Dificuldade Média (10), cai a
  1 ou 2 m se falhar; o de Impacto volta sem teste (D-076).
- **Atlatl só com a azagaia, item extra**, ×2 na Máxima, +1× Força no dano, +2 no Preparo, Velocidade 8, uma mão, não muda a Efetiva
  (D-074). **Funda ×2** no capítulo e em Corpo e Movimento. **Preço dos arcos** sem número (economia).
- **Rodada 3:** o FAA volta a "Máxima", a frase "a coluna Distância é o teto do objeto" saiu, o parágrafo "A Máxima não é a Efetiva" entra
  com a conta do pilum, e a linha de escapar de rede acrescenta a boleadeira e os dois Presos sem tocar no Agarrado (rodada 7), como o
  plano manda.

## 2 · O preço da Plumbata (pergunta 2)

**Veio por gerador, e o campo `preco` é a leitura legítima do contrato, não formato novo.** A linha "Plumbata | 35 pc" na tabela de
`custo-qualidade-e-equipamento.md` está entre Pilum e Rede (ordem do gerador) e o `gen-cap-itens.mjs --check` passa ("54 itens com preço",
eram 53). O `preco` que ela pôs em `armas.json` é `"preco": { "pc": 35 }`, **o mesmo envelope que todo item do catálogo já tem** (a Adaga
de Arremesso tem `{ "pc": 50 }`, o Pilum `{ "pc": 50 }`); o esquema o declara `preco.optional()` e é por ele que o gerador monta a tabela. O que a
Executora fez é o certo: o preço mora no dado, o capítulo é gerado. As outras armas novas seguem sem `preco`, como o plano manda. D-085 cumprida:
35 pc, em pc. O `custo-de-servico-e-itens.md` não tem preço de Dardos (busca em `src/content`: nenhuma ocorrência); as menções que restam
estão em `G-acoes-sistema.md` (G40, G42, com a nota da D-085) e em `lore/economia/` (da economia, não desta frente).

## 3 · Preparo, Recuperação e tempo de voo (pergunta 3)

**Nenhum Preparo ou Recuperação foi escrito ao arrepio da 4a.** Procurei nos dois capítulos "Recuperação", "P/G/R", "incremento", "Tick de
voo": nada. A coluna Velocidade e a tabela de Classes trazem só as Velocidades da D-082 (as somas), e o único "Preparo" do texto novo é o
**+2 do atlatl**, que é a definição do item (D-074), não a régua do P/G/R. **O tempo de voo não entrou**, com uma exceção de uma frase:
o bullet dos bumerangues diz que o de retorno volta "no mesmo número de Ticks que levou para ir; até a Efetiva, a ida leva 0 Ticks e
a volta também". É o texto da D-073 (adendo, item 6), correto, mas **fala em "Ticks que levou para ir" antes de a regra do tempo de voo
existir em `combate.md`** (4a). Não contradiz nada; só pede que a 4a defina o termo. Anoto, sem veredito.

## 4 · As contradições com `combate.md` até a 4a (pergunta 4)

Conferi cada uma contra o que o leitor encontra hoje. **Nenhuma é grave**; uma é a que mais pode custar uma discussão de mesa.
- **`combate.md:276` (a lista do projétil rápido).** Diz "flecha, virote, bala de funda, **dardo**, adaga pequena de arremesso, sopro de
  zarabatana: ninguém apara com a arma ou com a mão". Armas & Armaduras agora diz que a Plumbata (um dardo de guerra) é projétil rápido **e
  se bloqueia também com a arma**. É a mais próxima de uma contradição de regra, **mas o capítulo novo nomeia a exceção** (na tag, no
  bullet e nos Escudos), e o "dardo" do Combate já não corresponde a nenhuma arma do catálogo, então o Mestre resolve pelo específico sobre o
  geral. Moderada, não grave. **Sugestão de frase para a 4a:** "…bala de funda, faca de arremesso e as outras armas pequenas de
  arremesso, sopro de zarabatana (a Plumbata é a exceção: lançada à mão, também se bloqueia com a arma)".
- **`combate.md:55`** ("também é a Velocidade dos Dardos, uma arma de ataque"): os Dardos não existem mais; a Velocidade 4 é agora a das
  três leves (Shuriken, Mini-faca, Kunai). Estético, o leitor não acha a arma e nada mais.
- **`combate.md:83-90` (a tabela de Preparo e "o último Tick do ciclo").** Segue a fórmula de hoje (Distância P = V−1, Arremesso P = V−2),
  que é a que o Grid usa. Com as Velocidades novas (Longo e Composto 7), um leitor que aplique o texto de `combate.md` dá ao Longo P 6/G 1/R 0, e
  a D-082 diz 4/1/2. **É a divergência esperada da 4a, e está na N22**; não confunde porque o capítulo de armas não escreve P/G/R.
- **`combate.md:220`** ("dardo lançado" como exemplo de Perfurante): palavra genérica, inofensiva. **`combate.md:199`** ("Preso: o que a rede
  e a Arte de prender causam"): não cita a boleadeira, que é da rodada 7, e não contradiz os números.

## 5 · As trocas fora do pedido (pergunta 5)

**Aceitáveis, as três.** "Dardo" por "faca de arremesso" no glossário (Defesa) e na página Equipamentos (Escudos): tira a Plumbata, que agora é
exceção, da lista dos projéteis que só a Esquiva ou o escudo hábil defendem, e põe no lugar uma arma que a tabela chama de projétil rápido (a
Adaga de Arremesso e as leves). **"Dardo" por "plumbata" em `habilidades.json`** (Arremesso), com `habilidades.md` regerado (`gen-cap-pericias
--check` verde): o plano a lista ("`habilidades` via `habilidades.json` e `gen-cap-pericias`"). **A única ressalva é a que já está em 4:** o
glossário e a página Equipamentos passam a divergir de `combate.md:276` até a 4a, e vale que a 4a use a mesma redação.

## 6 · Travessão, "Perícia", links, leitura

- **Travessão:** nenhuma linha adicionada no diff inteiro tem (varri o diff, não o `git diff` encolhido); as mensagens dos dois commits também não
  têm travessão nem coautoria; `test-travessao-capitulos` verde. **"Perícia":** nenhuma linha adicionada fora da chave `"pericia"` do JSON.
- **Links:** `test-links-base` verde, o link novo `/regras/armas-e-armaduras` de Corpo e Movimento resolve, e a página não tem id duplicado.
- **Leitura:** 390 e 1300 px, descrita acima. **Um fato do site, não da rodada, que afeta o que o leitor vê:** a classe `sem-ultima-coluna`
  esconde sempre a **última coluna** (`global.css:245`), e nas duas tabelas novas essa coluna é o **Destaque**. Então as notas que só estão
  nele **nunca aparecem** na página: "Kunai... serve também de ferramenta (o Mestre julga)", "Mini-faca... fácil de esconder", "Pilum anti-escudo,
  entorta ao cravar". O que a rodada quer dizer de regra está nos bullets abaixo da tabela, e o catálogo (Equipamentos) mostra a descrição. É o
  padrão do site para as tabelas de armas (a tabela antiga também o fazia), então não é defeito da rodada. **Sugestão de frase para o
  Mestre**, se a Kunai importar: "A Kunai serve também de ferramenta (cavar, escalar, abrir): o Mestre julga" no bullet das leves.

## CORRIGE

1. **A mensagem do `5c4bb201` atribui ao `test-catalogo-distancia` uma conferência que ele não faz.** Em "Prova", diz que "as 13 linhas de
   Arremesso e as 6 de Atirador batem com armas.json (test-catalogo-distancia, 16 estragos acusados) e a tabela da Máxima dos arcos e as bestas
   com regras.json (o mesmo teste)". **O teste lê `armas.json`, `regras.json` e `armas-extras.json` (e os três arquivos de arte); nunca abre
   `armas-e-armaduras.md`** (`grep` por `armas-e-armaduras` e `chapters` no teste: 0). O que bate com o catálogo é o teste contra a TABELA DA
   DECISÃO que está escrita nele; o capítulo é texto à mão, e **nenhum teste prende os números dele ao catálogo** (o `test-contrato` lê o
   capítulo só para a Placa Completa). Os números estão certos hoje (meu leitor: 21 de 21, 24 de 24), então não há defeito de conteúdo, e sim
   uma promessa sem asserção (§4.6): a próxima mudança do catálogo que esqueça a tabela do capítulo passa verde. **Duas saídas:** corrigir a
   frase da mensagem para "conferido à mão", **ou** acrescentar um teste que extraia as duas tabelas do `.md` e as compare ao catálogo (o meu
   leitor tem uns 40 linhas e é o ponto de partida; ele é o mesmo que o plano pede para as rodadas 4a em diante, quando cada Velocidade que
   mudar tem de mudar nas duas casas).

## O que ficou sem medir, para continuar na lista de quem varrer depois (§9)

- **Só Chromium, só `dist/` local.** A leitura em 390 e 1300 px é amostra minha (as três tabelas e o parágrafo da Efetiva), não uma varredura
  da página inteira nem das outras páginas tocadas (Equipamentos, Habilidades, Corpo e Movimento no navegador).
- **Os Modos e o Destaque das 21 linhas** li à mão, não por leitor; os números, por leitor.
- **A coerência com `combate.md`** é a que a rodada declara; as contradições que listei saem da leitura dos trechos, e a rodada 4a as refaz.
- **As rodadas 4a em diante** ainda dependem de `combate.md`, e esta revisão não toca a rodada 14 das armas.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/149-revisora.md` e `docs/simulacao/caixa/progresso-revisora-149.md`. `dist/` da worktree
reconstruído (`astro build`); nenhum arquivo rastreado foi tocado.
