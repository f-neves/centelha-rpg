# 152 · Revisora · Armas de distância, rodada 4a: o tempo de voo e o tiro no Combate (`83d84cf5`)

Pino: `83d84cf5` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 83d84cf5` depois de
`git merge-base --is-ancestor HEAD origin/main` passar; o veredito 151, `cb537563`, é ancestral). Escopo: o commit único da rodada 4a.
Fonte do julgamento: o commit congelado contra o plano (rodada 4a), as D-073 (itens a a f), D-082 (a parte do tiro), D-075, D-076, D-078, D-054,
C-047/C-048, o 2f §3.1 e §14.8 e o 2b §4 (lido em `tmp/veterana/`, `veterana-2b-reforma-pgr.md`). A mensagem do commit tratei como hipótese.

**Resultado: um CORRIGE (dois pontos pequenos); o resto PROCEDE.** O texto do tempo de voo bate com a D-073 e os exemplos refazem; a
tabela de Preparo, Golpe e Recuperação bate com a D-082 no tiro e deixou o corpo a corpo intacto; nada de Rajada, dupla, Punhos, D-068, Arte, Defesa ou porte
entrou; o Grid não muda; a conta de `forcaNoArco` está certa. Os dois pontos são um texto de regra que o capítulo já não acompanha, escondido em
`regras.json`, e uma asserção do `test-forca-arco` que verifica uma cópia da fórmula, não a ficha.

**CI da faixa (§11):** `Validar dados e regras` **verde no sha do trabalho**, `83d84cf5` (run `38026932542`, 10/10/2026, **18 jobs verdes**);
`Deploy` verde (`38026932600`). Rodei no pino, por mim, todos verdes: `test-combate-tempo`, `test-contrato`, `test-kael`, `test-capitulo-armas`
(26 estragos), `test-catalogo-distancia` (17), `test-forca-arco`, `validate-data`, `test-portoes`, `test-procedencia`, `test-travessao-capitulos`,
`test-links-base`, `test-quase-acerto`, `test-folha-arremesso`, `gen-cap-itens`, `gen-pendencias`, `gen-monsters`, `gen-bench-tempo`, `gen-cap-pericias`.

## 1 · `combate.md` (pergunta 1)

- **"Distância e tempo de voo" contra a D-073 (itens a a f):** a Efetiva e o −3 por meia Efetiva com n = ⌈(d − E) ÷ (E ÷ 2)⌉ ✓; até a Efetiva o projétil
  chega no Tick do Golpe e cada incremento soma 1 Tick ✓; "rolado no Golpe e vale contra a Defesa do alvo no Tick da chegada" ✓ (a); "a distância e o n
  ficam fixos no disparo; se o alvo sair da linha o Mestre decide se escapou, e o mesmo para aliado, cobertura ou terreno" ✓ (b, f); "na Guarda sob pressão
  o ataque conta como recebido no Tick da chegada", dito na subseção e de novo logo depois do callout da pressão ✓ (c); o bumerangue de retorno
  "volta no mesmo número de Ticks que levou para ir; até a Efetiva, a ida leva 0 Ticks e a volta também" ✓ (adendo 6); **"O sistema Normal não tem tempo de voo:
  o tiro continua rolado na declaração... Isso favorece um pouco quem atira de longe, e é aceito"** ✓ (d). O item (e), a Rajada, não precisa de texto.
- **Os exemplos, refeitos por mim:** Adaga de Arremesso (E = 10) a 25 m: n = ⌈15 ÷ 5⌉ = 3, **−9**, 3 Ticks ✓; Arco Longo (E = 50) a 150 m: n = ⌈100 ÷ 25⌉ = 4, **−12**,
  4 Ticks ✓; a 250 m: n = ⌈200 ÷ 25⌉ = 8, **−24**, 8 Ticks ✓. (Uma sugestão de frase abaixo: "a Máxima do arco, a 250 m" é a do Arco Longo com Força 3.)
- **A tabela de Preparo, Golpe e Recuperação contra a D-082:** Arremesso leve 4 = 2/1/1, médio 5 = 3/1/1, pesado 6 = 3/1/2, Funda 6 = 4/1/1, Arco Curto 6 = 4/1/1, Longo e
  Composto 7 = 4/1/2, Besta Pequena 9 = 7/1/1, Média 12 = 9/1/2, Grande 15 = 12/1/2, azagaia com atlatl 8 = 5/1/2: **todas as dez batem** com a D-082 e
  com o 2b §0, e P + G + R = V em cada uma. **O corpo a corpo ficou como estava:** Leve 5 = 0/1/4, Média 6 = 1/1/4, Haste 6 = 2/1/3, Pesada 7 = 2/1/4 são
  exatamente o K15 (a régua antiga, em que a Recuperação é o que sobra do Preparo fixo); a Arte (Velocidade − 1, Golpe 1, Recuperação 0) também é a de antes. A Haste de Guerra,
  o Punhos 1/1/3 e o resto da reforma do corpo a corpo não entraram (4b).
- **"O Golpe cai no Tick imediatamente antes da Recuperação": é a D-082, não extrapolação.** É a frase literal do 2b §4, item 2 ("O Golpe cai no Tick imediatamente antes da
  Recuperação: a Besta Grande (Velocidade 15) passa doze Ticks armando, com a guarda aberta, um de Golpe e dois de Recuperação"), e decorre da ordem P → G → R que a D-082 define
  com "o Golpe sempre em 1 Tick". A retirada de "no Arremesso sobra um Tick de Recuperação" também é a do item 2.
- **Recarga e o Bram:** "o Preparo dela é de **doze Ticks**" para a Besta Grande (P12) ✓; Bram, Besta Média V12: Preparo dos Ticks 0 ao 8 (nove Ticks, P9), Golpe no 9 com a guarda
  em −4, Recuperação nos 10 e 11 (R2) ✓, que é o texto do 2b §4 item 4 palavra por palavra.
- **Os Dardos fora, com a mesma redação:** os quatro lugares dizem "faca de arremesso e as outras armas pequenas de arremesso": `combate.md` (projéteis rápidos), o glossário, a página
  Equipamentos e Armas & Armaduras (Escudos), mais "faca ou plumbata lançada" no Perfurante, a Velocidade 4 da Shuriken, Mini-faca e Kunai, e a Plumbata como exceção Bloqueável no
  `combate.md` (a frase nomeia a razão: lançada à mão). O bumerangue lento passa a "o de caça e o de retorno".
- **O que não entrou, conferido hunk a hunk:** nada de Rajada, empunhadura dupla, Punhos, D-068, a Arte além da linha que já existia, Defesa, restrição, porte. A frase da Guarda sob
  pressão é só a do tiro. Nenhum hunk toca a seção de Manobras nem a de porte.
- **Contradição com o corpo a corpo antigo na mesma página:** nenhuma que um leitor note. Busquei por "último Tick", "catorze", "Velocidade menos 1", "faixa" e "Dardo" em `combate.md`: o que sobra
  é a Arte (4c, "no último Tick da Velocidade") e o texto do Normal ("não há um Tick isolado de Recuperação", que é do Normal e vale), ambos de outra rodada. O parágrafo da linha 64 ("quem se
  compromete por doze Ticks...") continua certo.

## 2 · Os dados, o Grid e a N22 (pergunta 2)

- **`regras.json` `combate.pgr.reforma.tiro`** (10 classes, com as armas de cada uma) bate com a D-082 classe a classe (conferi cada V/P/G/R e a lista de armas contra a decisão). A
  fórmula velha `combate.pgr.preparo` **ficou intacta**, o `combate-tempo.ts` e o `test-combate-tempo` também (`git diff --stat`: nenhum arquivo do Grid, da mesa, do motor ou de
  `alcance.ts` aparece). O motor lê `C?.pgr?.preparo?.[classe]` e `C?.pgr?.arte` e **nada lê `reforma`** (busquei `pgr` em `src/` e `scripts/`), então **o Grid não muda de comportamento (D-054)**.
- **A N22 tem as três divergências:** a reforma do tiro só no dado e no livro (o Grid segue 6/1/0 no Longo, 4/1/1 na pesada de arremesso, bestas P = V − 1, e passa a ler `reforma` na passada do Grid);
  o tempo de voo não existe no Grid (chega no Tick do Golpe, mira em quatro faixas, recebido no Golpe); e a Força 9+ (ficha aplica, mesa não, só criaturas e não mortais; o teste exige que a
  mesa NÃO chame, e muda de sentido na passada).

## 3 · `forcaNoArco` (pergunta 3)

**A conta está certa.** `forcaNoArco(w, forca)` devolve `min(forca, 8)` só quando `w.classe === 'distancia'` e `w.forcaMult > 0`, e a Força que entra nela já passou pelo `forcaCap`
(`forcaNoArco(atk, atk.forcaCap != null ? Math.min(forca, atk.forcaCap) : forca)`), então o menor dos dois vale: o **Curto continua limitado a 3**, o Longo e o Composto
param em 8. **Não afeta a besta** (`forcaMult` 0), **nem o arremesso** (sem `forcaMult` no catálogo), **nem o corpo a corpo** (classe diferente), e **não mexe em Força ≤ 8** (Força 8, 6 e 1
passam como vieram). O `calc.ts` só ganhou uma função exportada; o `combate-resumo.ts` (a mesa) **não foi tocado** e divergência da ficha para Força 9+ é aceitável (só criaturas e não mortais) e **está
registrada** (N22, e o teste a grava). O uso só entra em `capF` e `capFI`, que só alimentam o dano.

**Minhas mutações no `test-forca-arco`** (uma por vez em `calc.ts`, `ficha-engine.ts` e `combate-resumo.ts`, tudo restaurado, `git status` limpo):

| Mutação | O teste |
|---|---|
| `calc`: sem o teto | **falha** ("arco-longo: Força 9 conta 8") |
| `calc`: teto 9; teto 7 | **falha** |
| `calc`: sem checar a classe | **falha** |
| `calc`: besta incluída (`forcaMult >= 0`) | **falha** ("a besta não usa Força") |
| `calc`: arremesso incluído | passa, mas é **mutante equivalente**: o catálogo não dá `forcaMult` ao arremesso |
| `ficha`: `capF` sem a função; `capFI` sem a função | **falha** (conta das duas chamadas) |
| `ficha`: chamada com a arma errada (`habil` no lugar de `atk`) | **falha** |
| `combate-resumo` passa a chamar a função (a mesa) | **falha**, como o teste manda ("muda de sentido") |
| **`ficha`: `forcaNoArco(atk, forca)`, sem passar pelo `forcaCap` do Curto** | **PASSA (o teste não pega)** |

A última é o CORRIGE 2.

## 4 · Os testes (pergunta 4)

Rodei **24 mutações** em cópias da árvore (o capítulo de Combate, o de Armas, `armas.json`, `regras.json`), cada uma contra `test-capitulo-armas` e `test-catalogo-distancia`.
**Pegos (o que a mensagem diz):** Preparo e Recuperação da Besta Média, do Haste (corpo a corpo, "intacto"), "doze Ticks" da Besta Grande, o Golpe do Bram, n do exemplo de 25 m, o −24 do exemplo
de 250 m, Recuperação do Longo/Composto em `regras.json`, o Pilum movido de classe, a Rede fora de toda classe, o atlatl a V9, Velocidade da Funda e da Besta Grande no catálogo.
**Não pegos, todos em prosa que o teste não lê:** "3 Ticks depois do Golpe" e "8 Ticks de voo" dos exemplos (o teste confere n e o −3n, não os Ticks); a **fórmula do texto** ("−3 × n" trocado por "−4 × n"
passa, porque os exemplos seguem com −9, −12, −24); "soma 1 Tick" trocado por "soma 2 Ticks"; **a frase do Normal** invertida ("o Normal também tem tempo de voo", a D-073 d); a linha do arco longo da
tabela de Velocidades; **a exceção da Plumbata** em `combate.md`; a frase do bumerangue que volta. **Nenhuma contradiz a mensagem do commit**, que lista o que o teste faz (tabela, "doze Ticks", Bram, n e −3n dos
exemplos), e é exata nisso; mas a **constante da regra (−3 por meia Efetiva, +1 Tick por incremento, o Normal sem tempo de voo) é o coração da D-072/D-073 e só está presa nos dados**
(`regras.json` `distancia.efetiva` e `test-catalogo-distancia`), não no texto. Entra como sugestão, não como CORRIGE (não é promessa da rodada).
**As lacunas do 151 seguem como estavam** (Classe contra Velocidade, o modo secundário, a tabela de Classes do capítulo de Armas fora da Velocidade, a de corpo a corpo): o aviso diz que são da 4b.

## 4b · Os bumerangues (pergunta 4b)

**Bate com a D-076 e com o 2f, e não é decisão de regra.** O 2f e a D-076 dizem do bumerangue de retorno "em curva", "volta à mão no fim da ação se errar" e nada sobre rápido ou lento; a única exceção
registrada para a regra do projétil rápido é a Plumbata (adendo 5). A regra de antes, no próprio `combate.md`, dizia "armas de arremesso lentas (a lança ou o machado lançado, o pilum, **o bumerangue**, uma pedra
grande): você bloqueia normalmente", e a Executora a manteve, trocando só o nome ("o de caça e o de retorno"). **O catálogo não dá `projétil veloz` a nenhum dos dois** (as que têm: arcos, bestas, Adaga de
Arremesso, Funda, Plumbata, Shuriken, Mini-faca, Kunai). Se o autor quiser o de retorno como rápido seria decisão nova, com pergunta; pelos três filtros do D-087 não há o que perguntar agora (o registro e a Veterana
silenciam, e o Mestre resolve o caso). O que existe é uma **tensão de desenho**, não de regra: o bumerangue de retorno é média V5 como a Adaga de Arremesso, que é rápida; é o tipo de coisa para a fase de testes.

## CORRIGE

1. **`regras.json` `combate.movimento.recarga.texto` e `.porque` dizem o contrário do capítulo.** O texto diz "O tiro sai **no último Tick do ciclo**, como em qualquer arma de distância" e o `porque`
   diz "o Preparo de distância é `velocidade - 1`, então quem declara o tiro da Besta Grande fica **catorze Ticks** comprometido". O capítulo agora diz "o tiro sai no Tick do Golpe" e "**doze Ticks**". A regra do repositório é
   que o JSON vence e o capítulo se corrige; aqui o JSON ficou com o texto velho **e é o único que o capítulo não corrige**, porque o commit atualizou os trechos de `combate.md` e de `armas-e-armaduras.md` e deixou este. Ninguém
   lê esses dois campos por código (só `investida` do mesmo bloco é lido; busquei `movimento.recarga` e `permiteDeslocamento` em `src/` e `scripts/`), então não muda comportamento, mas é a documentação das regras no dado, e o
   `test-capitulo-armas` não olha para ela. Conserto: trocar as duas frases ("sai no Tick do Golpe" e "doze Ticks, P = V − 1 − R"), e, se quiser, uma asserção de que `regras.json` não diz "catorze".
2. **O `test-forca-arco` afirma que o Curto continua limitado a 3 (e que o menor dos dois vale), mas verifica uma cópia da fórmula, não a ficha.** `danoArco` dentro do teste reescreve a composição `forcaNoArco(w, min(forca, forcaCap))`,
   e a parte que olha o `ficha-engine.ts` só casa a **forma** `capF = forcaNoArco(atk,` e `capFI = forcaNoArco(inabilArma,`. Medido: trocar na ficha o segundo argumento por `forca` (sem o `forcaCap`) **passa**, e com isso o Arco Curto de
   Força 6 faria dano por 6 em vez de 3 (o limite do 2f §5.3), sem que nada acuse. Hoje a ficha está certa (li a linha). Conserto: casar a expressão inteira
   (`forcaNoArco\(atk, atk\.forcaCap != null \? Math\.min\(forca, atk\.forcaCap\) : forca\)` e a da mão inábil) ou exercitar a conta pela ficha.

## Sugestões de frase e de teste (D-087), sem veredito

- **Exemplo da Máxima:** "Na Máxima do arco, a 250 m" é o Arco Longo com Força 3; dizer "(Arco Longo com Força 3: 250 m)" evita que o leitor ache que a Máxima é única.
- **Pinar a constante da regra no texto**, para a 4b e seguintes: que `combate.md` contenha "−3 × n" e "soma 1 Tick" (derivados de `regras.json` `distancia.efetiva.penPorIncremento` e `ticksDeVooPorIncremento`), a frase do Normal sem tempo de
  voo, "3 Ticks" e "8 Ticks" dos exemplos, e a exceção da Plumbata. Custo: umas dez linhas no teste que já lê o `combate.md`.

## O que ficou sem medir (§9)

- **Só Chromium e `dist/` local.** Leitura em 390 e 1300 px da página Combate Físico (tabela de Preparo, Golpe e Recuperação, e o exemplo do tempo de voo): sem erro de página, **sem rolagem horizontal da página** (390 e 1300), a tabela
  de 15 linhas e o exemplo legíveis. Foi amostra, não varredura da página inteira.
- **A ficha ao vivo com Força 9+ e um arco** não foi medida na tela; a conta li no código e o teste exercita a função.
- **Travessão e "Perícia":** nenhuma linha adicionada tem (varri o diff; o "pericia" que aparece é a chave de `gen-cap-pericias` no `package.json`); a mensagem do commit não tem travessão nem coautoria e **traz a linha de quem joga hoje**.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/152-revisora.md` e `docs/simulacao/caixa/progresso-revisora-152.md`. Mutei cópias do capítulo, de `armas.json`, de `regras.json` e do teste fora do repositório; nos três
arquivos de `src/lib` (`calc.ts`, `ficha-engine.ts`, `combate-resumo.ts`) mutei o arquivo no lugar e o restaurei na hora; nenhum arquivo rastreado foi tocado ao final (`git status` limpo).
