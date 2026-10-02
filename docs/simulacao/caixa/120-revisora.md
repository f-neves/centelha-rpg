# Rodada 120 · veredito · economia (fechamento, itens 1 a 5b)

**Aviso:** a mensagem do Arquiteto que trouxe a 119 e a 120 juntas, com o mesmo pino. Despacho da leitura:
`docs/simulacao/caixa/revisao-regras-basicas-despacho.md` (`db2bc0d3`), seção 3. Pino: `2dcae19e`. A worktree
foi reancorada nele para a 119 (§0.1). Depois, o push da 119 rebaseou o meu commit sobre `e2b01ac6`
(§10). `git diff --stat 2dcae19e HEAD -- src scripts` deu vazio, então o código e os capítulos que li são os do
pino. Faixa: `8d1cbb79`, `ed3ebadd`, `5d068c65`, `2ea408a0`, `87494847`, `c09261ce`, `d8d2fd27`,
`601e1ce8`, `ed289426`, `38008870`, `d2237ae2`, `03149413`, `2dcae19e`. Relato:
`fechamento-economia-reforma-relato.md`.

**Veredito geral: PROCEDE nos focos 1, 3 e 4; um CORRIGE (o item 1d mexeu numa regra da Defesa parada);
o foco 2 não fecha: há sobras do "+1 por ponto" no site, todas fora das linhas que a faixa tocou e do que o
relato prometeu, e por isso são ESCALA.** O rótulo não é leniência: a conferência prévia do Arquiteto
(`fechamento-economia-reforma-despacho.md:74-82`) limitou a varredura do item 1d ao `regras.json`, e foi
isso que a faixa fez. Rodada só de leitura: nada foi alterado, e os CORRIGE e ESCALA são para a próxima
rodada de execução.

## CI (§11)

Workflow `Validar dados e regras`, todos `completed / success`:

| commit | run |
|---|---|
| `8d1cbb79` | sem run próprio: subiu junto com `f963cbf5` (o adendo do despacho), cujo run `36922729878` passou e cobre os dois (conferi que `8d1cbb79` é ancestral de `f963cbf5`) |
| `ed3ebadd` | `36925496143` |
| `5d068c65` | `36926866092` |
| `2ea408a0` | `36928039875` |
| `87494847` | `36929563237` |
| `c09261ce` | `36932066683` |
| `d8d2fd27` | `36962462391` |
| `601e1ce8` | `37026268471` |
| `ed289426` | `37033400033` |
| `38008870` | `37037626301` |
| `d2237ae2` | `37048010428` |
| `03149413` | `37048406249` |
| `2dcae19e` | `37050483412` |

**O run do `d8d2fd27` está verde na tentativa 2, e a tentativa 1 foi vermelha:** o job `Smoke ·
test-l84-caidofila-mesa` falhou e todos os outros passaram (`gh api .../runs/36962462391/attempts/1/jobs`). É o
`test-l84` intermitente que o Adendo 4, item 4, mandou registrar. O `d8d2fd27` só toca economia, pendências e
o relato, e o smoke é da mesa: **ESCALA**, como vermelho intermitente herdado, sem ter nascido na faixa
(não procurei o commit em que ele nasceu).

Rodado por mim no pino: `node scripts/test-recompensa.mjs`, verde, 33 asserções; `node
scripts/copiar-economia.mjs --check` ("economia do site em dia com o modelo, 11 arquivos, refeitos a partir do
gerar.py") e `node scripts/gen-cap-economia.mjs --check` ("16 blocos em 5 páginas"), os dois verdes, e
nenhum deles gravou nada (`git status` limpo depois). Os três estão no `npm run validate` (`package.json`),
então o CI também os cobre. Saídas em `../tmp/revisora/test-recompensa-120.txt` e `cadeia-economia-120.txt`.

## Foco 1 · O Valor Passivo com uma fórmula só nos dois capítulos: PROCEDE

`coracao-do-sistema.md:89`, o guarda de `:93` e `acoes-e-sistema.md:65` e `:121` trazem a mesma fórmula,
`(Atributo + Habilidade) × 2 + 2 × mín(Centelha, Habilidade) + Especialidade (só quando o escopo dela se aplica,
somada no momento do uso)`. A explicação de `acoes:123` casa com ela. `calc.ts:415-417` calcula a mesma
coisa sem a Especialidade, como o adendo mandou. Uma diferença de redação, que não muda a regra: `coracao:89`
termina com "(+ modificadores)", e `acoes:121` não.

**O que o foco não alcança, e que contradiz a fórmula única fora dos dois capítulos:**

- **`glossario.json:223`** (o verbete "Valor Passivo", que o site mostra ao passar o mouse no termo): "(Atributo +
  Habilidade) × 2 + Centelha". **ESCALA** (a faixa não tocou o glossário nem o prometeu). Vai com o foco 2.
- **`acoes-sentidos-e-engano.md:16`**: "(Percepção + Prontidão) × 2 + Centelha" (achado 4 da 119). **ESCALA.**
- **A mesa chama de "valor passivo" um terceiro número.** "Passivos do grupo" (`src/pages/mesa/grupo.astro:22-28`,
  calculado em `mesa-ficha.ts:41-45` e `:67-78`) é a **média do pool** (`dados × 3,5 + bônus`), sem o ×2 e sem
  Centelha, e o texto da página diz que ela "serve de valor passivo". Para Kael (Percepção 6, Prontidão 3,
  Centelha 3), a Prontidão da mesa dá 16 e a Percepção Passiva do capítulo dá 24. **INCONGRUÊNCIA, ESCALA**
  (código anterior à faixa). Há duas leituras: **A**, a tela da mesa é outra coisa e precisa de outro nome
  ("média do pool"); **B**, ela deveria mostrar o Valor Passivo da regra.
- **O valor parado "que a ficha imprime"** (`acoes:123`) não existe hoje: `valorPassivo` não tem chamador
  nenhum (procurei o nome no repositório inteiro fora de `docs/`: só a definição e dois comentários, em
  `combate-resumo.ts:46` e `mesa-bestiario.ts:143`). O relato diz o mesmo (`relato:22-24`). A frase de
  `acoes:123` está certa como regra e descreve uma tela que não há. **CLAREZA**, sem urgência.

## Foco 2 · Nenhuma sobra do "+1 por ponto" fora da jogada só de Atributo: NÃO FECHA

O que a faixa prometeu, ela cumpriu: o relato diz que o item 1d varreu as notas de `regras.json`
(`relato:37-45`), e varreu. A nota de `escalasProeza` está certa, e os quatro `centelhaMult` mortos têm a
ressalva e a K35. **As sobras abaixo estão fora disso**, então nenhuma falsifica uma promessa da faixa, e
todas são **ESCALA**. Em ordem de quanto a mesa as vê:

1. **A ficha explica as Defesas com a conta antiga, e a conta não fecha na própria frase.**
   `ficha-engine.ts:1570-1573`. O número vem certo: `defEsq` e `defBlq` saem de `defesa()`
   (`ficha-engine.ts:1544`, `:1546`), `soc` e `men` de `defesaSocial()` e `defesaMental()` (`:1561-1562`), e
   as três já usam a Reforma. Mas o texto que explica é `(Destreza ${dex} + Esquiva ...)×2 + Centelha ${C} = ${defEsq}`. Para
   Kael, a ficha mostra "(Destreza 4 + Esquiva 3)×2 + Centelha 3 = 20", e 14 + 3 não dá 20. O mesmo vale para
   o Bloqueio, a Social ("(Compostura 2 + Sociabilidade 0)×2 + Centelha 3 = 4") e a Mental ("Raciocínio 3 +
   Integridade 0 + Vontade 7 + Centelha 3 = 10"). É o defeito que o comentário de `calc.ts:33-36`
   descreve no PV ("uma conta que não fecha dentro da própria frase"), e é o que todo jogador lê ao abrir a
   ficha. **Correção:** `2×mín(Centelha ${C}, Esquiva ${...})` nas quatro linhas.
2. **O glossário do site:** `glossario.json:93` (Defesa), `:101` (Defesa Mental), `:109` (Defesa Social),
   `:223` (Valor Passivo), todos com "+ Centelha". Aparecem como dica em todo capítulo que cita o termo.
3. **Capítulos**, já relatados na 119 com linha e conta: `criacao-de-personagem.md:73-75` e os derivados dos
   quatro exemplos; `aparencia-virtudes-vontade.md:129`, `:131`; `acoes-sentidos-e-engano.md:16`;
   `relacoes-sociais.md:138`, `:182`, `:196-197`, `:274`, `:276`; e os exemplos `combate.md:21` e
   `coracao-do-sistema.md:79`. **E mais um, fora do escopo da 119:** `qual-sistema.md:87-88`, o diagrama
   "Esquiva = (Destreza + Esquiva) x2 + Centelha + Esp." (e o SVG gerado dele, em `diagramas.json`).
4. **Comentário de código:** `combate-resumo.ts:80` ("+ acerto da arma + Centelha − armadura"), com o código
   da linha 88 já certo (`ataqueCentelha`). O relato consertou o comentário vizinho, o de `:156`, e não este.
5. **Teste que fixa a fórmula antiga:** `scripts/test-sentidos.mjs:66`, `passiva = (p + pr) * 2 + c`. A
   asserção de `:74` compara a função com ela mesma (`v === (p + pr) * 2 + c`) e passa com qualquer fórmula,
   então ela não protege o Valor Passivo nem o fixa no valor velho de um jeito que quebre. Mas é a única
   "Passiva" que um teste escreve, e ela escreve a regra de antes.
6. **Documento da raiz, fora do site:** `Regua_Relacao.md:120`.

**O que NÃO é sobra:** Absorção natural (`Vigor + Centelha`, `combate.md:193`, `calc.ts:296`), dano, raspão
(`quase-acerto.ts:201`), Energia e Mana (×2) e os saltos (`combate.md:349-351`) somam a Centelha inteira
por regra própria, e não pela regra da jogada. `racas.md:169` ("Força de Vontade do orc × 2 + Centelha dele")
é o único lugar do site que encontrei com a Vontade sem Habilidade, e a Centelha inteira ali casa com a
exceção da jogada só de Atributo, se "Vontade pura" quiser dizer isso.

**A exceção em si** (`centelha.md:44`, `calc.ts:144-154`): a regra está escrita e a D12 está fechada, como
o relato diz. Duas ressalvas, as duas já na 119 (achados 1 e 16): `centelhaSoAtributo` não tem chamador
nenhum, e o texto não diz se a Habilidade 0 numa jogada comum é "só de Atributo". Na Leitura A dessa
pergunta, o "+1 por ponto" volta em toda jogada sem treino.

## CORRIGE · o item 1d mudou a regra da Defesa parada e apagou uma frase

- **Onde:** `regras.json:2683` (bloco `social.modoDevagar`), commit `8d1cbb79`.
- **O que mudou:** de "Defesa parada = (Compostura + Sociabilidade) × multDefesa + Centelha × centelhaMult +
  termo da régua. Tempo do passo, em intervalos = máx(pisoTempoDoPasso, defesa parada − ataque parado − soma
  dos gestos)." para "Defesa parada = (Compostura + Sociabilidade) × multDefesa + 2×menor(Centelha,Sociabilidade)
  + termo da régua (Reforma da Centelha, ...)".
- **Por que é CORRIGE (§8):** o relato promete uma correção de texto, "igual ao resto da Reforma"
  (`relato:42-45`), e o resultado é outra coisa.
  1. **Ficou uma contradição com o capítulo.** `relacoes-sociais.md:182` e `:276` dizem "Compostura +
     Sociabilidade + Centelha + termo da régua", e a tabela de `:194-198` foi calculada assim. Agora o JSON
     diz 2 × menor, e para Sora a Defesa parada dá 12 pelo JSON e 9 pelo capítulo.
  2. **"Igual ao resto da Reforma" não decide a escala.** A Defesa parada é a Social sem o ×2 (`multDefesa:
     1`, e a `multDefesaNota` diz "Mesma calibragem, não outro número"). A Social com dado é 2 × (Compostura +
     Sociabilidade) + 2 × menor; a metade dela, que seria a "mesma calibragem", é (Compostura +
     Sociabilidade) + menor, e não + 2 × menor. Há três leituras para o autor: **A**, 2 × menor (o JSON de
     hoje); **B**, menor (a metade); **C**, a Centelha inteira (o capítulo de hoje, e o `relacoes:188`, que
     explica por que ela entra só de um lado).
  3. **A frase do Tempo do passo sumiu do JSON** e o relato não diz isso. A regra continua no capítulo
     (`relacoes:184`) e o campo `pisoTempoDoPasso` continua no bloco, mas a nota que ligava os dois foi
     embora.
- **Correção sugerida:** devolver a frase do Tempo do passo à nota. Na Centelha, ou reverter para uma redação
  que não decida (por exemplo, "a Centelha da Defesa parada segue a decisão pendente, ver
  relacoes-sociais.md:182"), ou levar as leituras A, B e C ao autor. É conserto de uma linha. A decisão é do
  autor.

## Foco 3 · Capítulo, calculadora, JSON e teste dizendo a mesma coisa: PROCEDE, com três ressalvas de texto

Conferido ponto a ponto, no pino:

- **Fórmula:** `custo-servicos.md:44`, `recompensa.astro:15`, `recompensa.ts:129` e a `_nota` dizem Valor ×
  Semanas × Tarefa × Risco × Pessoas, e o Tom entra como multiplicador (`custo-servicos:99`, `recompensas.json`
  `tons` 0,5 / 1 / 2).
- **Tabela de desafio e meios degraus** (`custo-servicos:56-59`) = `recompensas.json` `desafios` e `meios` =
  `TABELA` do teste. Os nove meios degraus conferem como `arred(√(vizinho × vizinho))`, inclusive 60
  (√3.800 = 61,6, passo 5) e 115.800.
- **Tabela de perícia** (`custo-servicos:73-76`) = `recompensas.json` `pericia` = `PERICIA` do teste. A
  fórmula (Dif − 19) ÷ 2, para cima, confere nas faixas 21 a 37. O piso de 13 e o "segue até 36-37" de
  `custo-servicos:82` conferem com `recompensa.ts:96` e `:100`.
- **A frase da correção D** é idêntica nos três lugares: `custo-servicos.md:65`, `CalculadoraRecompensa.astro:14`
  (com `provisorio_desde` = 4) e a `_nota`.
- **Tarefa, Risco e Urgência:** as 8 listas de `custo-servicos:88-95`, os 4 riscos de `:96` e as urgências de
  `:123` batem com o JSON. O teste fixa as Tarefas (`test-recompensa.mjs:94`).
- **Semanas:** `custo-servicos:86` (mínimo 1, mais metade da viagem, semana de 8 dias) = `recompensa.ts:127`.
- **Frases verbatim do autor**, no capítulo e na calculadora: desafio absoluto, Semanas do contrato, parte não
  paga parte, terra/título a partir do 5, favor acima do 3.
- **A ajuda de estimar** (`custo-servicos:103`) = `desafioDoEncontro` (`recompensa.ts:72-86`) = os casos do
  teste (`:109-115`). Os degraus de Magnitude são os de `combate.md:415-417`.
- **Âncora:** `recompensa.astro:15` aponta `#trabalhos-e-recompensas`, que é o título de `custo-servicos:36`.
  Não sobrou link para `#caça-e-recompensas`, nem "grupo de 3", nem "Valor do degrau" em `src/`, `scripts/` e
  `lore/economia/`.

**As ressalvas, todas de CLAREZA no capítulo:**

1. **A régua de arredondamento não está no capítulo.** `custo-servicos:105` diz "a bolsa sai arredondada" e
   `:67` diz "o Livre do ofício à altura × 1,8", mas o "como" só mora no JSON (`arredondamento`: passo 1
   abaixo de 20, 5 abaixo de 100, 10 abaixo de 1.000, 100 daí em diante). Quem refaz a conta à mão chega a 22
   na Dif 10 (12 × 1,8 = 21,6) e a 63 na Dif 20, e o livro diz 20 e 65; e não sabe por que 195 vira 200 e
   3.640 vira 3.600. **Correção:** uma frase com a régua, perto de `:105`.
2. **"Livre do ofício à altura" na Dif 5.** `custo-servicos:67` liga a Dif 5 ao Braçal, e o teste também
   (`test-recompensa.mjs:57`: Livre 7, soma 4). Mas a soma "à altura" da Dif 5 é 3 (`coracao:67`,
   `acoes-e-sistema:20`), e a tabela de perfis começa na 4. O número (13) é o que o autor decidiu no 5b, então
   isto é só redação: "o Braçal, o perfil mais baixo da tabela".
3. **Pessoas.** `custo-servicos:97` diz "Na caça, o padrão é 4". A calculadora abre com 4 em todo tipo de
   trabalho (`CalculadoraRecompensa.astro:36`, `pessoas_padrao` global), e os exemplos de perícia usam 1 e 2.
   Não é conta errada, porque o Mestre digita. Mas a página sugere 4 para investigar uma carta.
   **Correção:** ou a frase do capítulo diz que 4 é o padrão da calculadora para todo trabalho, ou a
   calculadora troca o padrão pelo tipo.

(E o "especialista de soma 12" de `custo-servicos:67`, que a tabela de `:30` chama de "Mestre (soma 12)", já
está no achado 13 da 119. A frase é verbatim da correção A do autor.)

## Foco 4 · Os oito exemplos, à mão, com a régua: PROCEDE

Régua: `arred` de `recompensa.ts:44-51`, com as faixas do JSON. Tom padrão, sem viagem.

| exemplo (`custo-servicos`) | Valor | conta | exata | régua | livro | teste |
|---|---|---|---|---|---|---|
| `:107` seguir e achar onde mora | Dif 15 = 40 | 40 × 1 × 1 × 1 × 1 | 40 | passo 10: 40 | 40 | 40 |
| `:108` espião, com prova | Dif 20 = 65 | 65 × 2 × 1,5 × 1 × 1 | 195 | passo 10: 200 | 200 | 200 |
| `:109` nobre, sem notar | Dif 20 = 65 | 65 × 1 × 2 × 1,5 × 2 | 390 | passo 10: 390 | 390 | 390 |
| `:110` carta sigilosa | Dif 15 = 40 | 40 × 2 × 1,5 × 1 × 1 | 120 | passo 10: 120 | 120 | 120 |
| `:111` criança e goblins | desafio 1 = 95 | 95 × 1 × 1 × 1 × 4 | 380 | passo 10: 380 | 380 | 380 |
| `:112` escolta do mercador | desafio 1 = 95 | 95 × 2 × 1 × 1 × 4 | 760 | passo 10: 760 | 760 | 760 |
| `:113` worgs na aldeia | desafio 3 = 910 | 910 × 1 × 1 × 1 × 4 | 3.640 | passo 100: 3.600 | 3.600 | 3.600 |
| `:114` torre do mago | Dif 25 = desafio 3 = 910 | 910 × 1 × 1 × 2 × 4 | 7.280 | passo 100: 7.300 | 7.300 | 7.300 |

Os oito batem nos três lugares. Os valores de perícia vêm da régua sobre o Livre × 1,8: Dif 15 = arred(22 ×
1,8 = 39,6) = 40; Dif 20 = arred(35 × 1,8 = 63) = 65 (passo 5). A Dif 25 cai na faixa 24-25 = desafio 3 =
910, e (25 − 19) ÷ 2 = 3. Conferi também os interpolados do 5b: Dif 7 = arred(13 × (20/13)^0,4 = 15,4) = 15;
Dif 12 = arred(20 × 2^0,4 = 26,4) = 25; Dif 17 = arred(40 × (65/40)^0,4 = 48,6) = 50. Batem com o teste
(`:54`).

## Não conferido

Os quatro focos não são a faixa inteira. O PROCEDE acima vale para eles e não cobre:

- o item 3 (`2ea408a0`, a bancada de lobos e worgs) e os números medidos que o relato e o capítulo citam
  (worg 0, dupla 2, matilha 3);
- o item 4 (`87494847`) e as entradas de pendência em `B-bestiario.md` e `G-acoes-sistema.md` (`d8d2fd27`,
  `601e1ce8`, `ed289426`), que não li contra a fala do autor;
- o diff de `modelo.py`, `gerar.py`, `gen-cap-economia.mjs` e `validate-data.mjs`. Só conferi que a cadeia
  está em dia (os dois `--check` acima), e não a lógica de cada mudança;
- o "que foi desfeito e o que ficou" do 2b, do 2c e do 2d (Adendo 5, item 10), que não cruzei contra os
  commits;
- a página renderizada: não rodei build nem abri `dist/recompensa` nesta rodada (a 118 abriu, antes do item 5).
  A calculadora está conferida pela leitura do componente e pela função que o teste exercita.

## Observações sobre o relato (sem rótulo)

- `relato:59-63`, "Produção", diz na mesma frase que a ficha "muda o número exibido" e que "o comportamento ao
  vivo não muda". A segunda é a certa (o resumo já usava `defesa()`, e `valorPassivo` não tem chamador).
- `relato:73` chama de "Adendo do autor (commit `f963cbf5`...)" o commit do despacho. O trabalho do adendo é o
  `ed3ebadd`, e a linha do CI (`relato:89`) já diz isso.

## Limpeza

Só leitura, o `test-recompensa.mjs` e contas com `node -e`. Saída em `../tmp/revisora/`. Nenhum arquivo
versionado tocado além deste e do `progresso-revisora-119.md` (que serve às duas rodadas).
