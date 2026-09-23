# Rodada 91 · veredito

Pino: `2021eaa` (aviso), faixa `84228f3..f3b5105`, `lore/` fora. Passo 0 conferido: toplevel é a
worktree da Revisora, HEAD `2021eaa75626`. As minhas três PERGUNTAS da 90 não foram cobradas, como
o aviso pediu.

**Veredito geral: PROCEDE, com um CORRIGE pequeno (não bloqueia) e três notas.** Nenhum BLOQUEIA.

## 1 · O controle negativo do Grid, refeito e separado

Refiz a primeira prova da Executora e a parti em três, porque o aviso pediu que PARADA e DIFICULDADE
fossem cobradas separadamente. Cada mudança foi feita em `src/lib/artes-grid.ts` na minha worktree,
rodei `node scripts/test-artes-grid.mjs` e desfiz com `git checkout --` antes da mudança seguinte
(`git diff --quiet` conferido depois de cada uma):

| controle | o que mudei | resultado |
|---|---|---|
| A · só a Dificuldade | `difParado: difMetade` | **falha 2**: `10 · 15 · 20` no lugar de `5 · 8 · 10`, e as chances `8 50 0 0` |
| B · só a parada | as opções somando `atributos.vigor` e `atributos.raciocinio` | **falha 1**: `Bravura 7 · Temperança 5` no lugar de `Bravura 4 · Temperança 3` |
| C · a semântica antiga inteira | A e B juntos | **falha 3 de 3**, o mesmo que a Executora relatou |

**As asserções cobram as duas coisas separadamente**, cada uma por uma asserção própria. A de chance
não pega o controle B, porque monta a ficha só com Virtudes; quem o pega é a asserção da parada, que
passa a ficha inteira com Vigor 3 e Raciocínio 2. Está certo assim.

**O que o teste não cobre: o chamador (CORRIGE, na seção 2).**

## 2 · CORRIGE · o chamador ainda decide qual Dificuldade usar, e nada o cobra

**Controle D:** em `src/lib/artes-grid-mesa.ts` troquei `r.total > d.difParado` de volta para
`r.total > d.difMetade`, que é a comparação que decide se o personagem aguenta. **O
`test-artes-grid` passou verde.** Procurei em `scripts/` quem mais chama `oferecerSaida`, `parado:`
ou "ficou parado" e não achei nenhum teste. Desfiz a troca e conferi.

É a pergunta 2 do `§4` do meu contrato: o teste exercita a função, mas não o caminho de produção. E
contradiz uma afirmação da rodada (`§8`), porque o relato diz (`91-executora.md`, Grupo 1) que "a
`oferecerSaida` só coleta e rola". Ela também **escolhe** entre dois campos do mesmo objeto
(`difMetade` e `difParado`), e essa escolha é justamente a decisão do humano.

**Conserto, pequeno:** tirar a comparação da caixa. Por exemplo, uma função em `artes-grid.ts` que
recebe o total rolado e o `Desvio` e diz se aguentou, com uma asserção. Assim a `oferecerSaida` não
lê `difMetade` nem `difParado` para decidir nada. O `difParado` continua servindo para mostrar a Dificuldade na
nota.

## 3 · O Grid contra a decisão, número por número

Empacotei `artes-grid.ts` com o mesmo esbuild do teste e li o `desvioDaArea` direto:

| metros | `difMetade` | `difParado` |
|:--:|:--:|:--:|
| 0,5 e 1 (borda) | 10 | **5** |
| 1,5 e 2 | 15 | **8** |
| 3 | 20 | **10** |
| 4 (núcleo) | 25 | 13 |
| 5 | 30 | 15 |

**Borda 10 → 5, meio 15 → 8, fundo 20 → 10: batem com a decisão.** As chances de referência do teste
(72, 95, 28, 50) também batem com a minha convolução. As da decisão da §16 eu já tinha conferido na
90. A parada: `pool(1)` dá 2 fixo e `pool(v)` segue a conversão. A criatura lê `MON[...].virtudes`, e
conferi que **as 309 criaturas de `monsters-mesa.json` têm `virtudes`**, com Bravura de 2 a 6. Então
nenhuma rola parada zero por falta do campo, que era o risco de tirar o Atributo da soma.

**O `regras.json:1995` diz o mesmo que o código**: a Virtude sozinha, contra metade da Dificuldade,
arredondada para cima, com os três exemplos.

**Nota 1:** o texto para no "três metros 20 vira 10", mas a escada do próprio `regras.json` tem o
núcleo (4 m, 25), e o código dá 13 ali. A regra geral cobre esse caso. Só que a decisão fala em
"fundo 20", e quem lê a lista pode achar que 10 é o teto. Uma cláusula resolve.

## 4 · A fronteira do Resistir, citação por citação

A frase nova (`aparencia-virtudes-vontade.md:84`) cita três pares, e conferi cada um contra o
capítulo ou o dado que aponta:

- **Vigor + Convicção, Artes que invadem o corpo:** `artes/regras.astro:74` ("Corpo e veneno ·
  Vigor + Convicção") e `regras.json:1265`. Bate.
- **Vigor + Convicção, Estabilizar:** `vida-ferimentos-cura.md:75`, `condicoes.json:136`,
  `regras.json:1100`. Bate. O link `#sangramento-e-estabilização` existe no HTML gerado.
- **Vigor + Resistência, veneno, doença e ambiente:** `acoes-resistir.md:34` (veneno, contra a
  Potência), `:68` (doença, contra a Virulência), `:112` (ambiente, contra a Severidade). Bate. **A
  correção que a Executora fez no meu conserto está certa**: eu tinha escrito Vigor + Convicção para
  os três, e o capítulo de Resistir diz Vigor + Resistência.
- **Vontade + Convicção:** os únicos dois Efeitos com o par em `efeitos.json` são **Banir** e
  **Círculo**, e são exatamente os dois exemplos da frase. Bate. Também está certa a leitura dela de
  que esse par não é do corpo.

**Nota 2:** a tabela das Artes põe veneno e doença na linha "Corpo e veneno", com Vigor + Convicção,
e a frase diz, sem qualificar, que "veneno, doença e ambiente hostil [...] são Vigor + Resistência".
Lida inteira, a frase separa os dois casos: o que é efeito de Arte está na oração anterior. Mas a
doença de uma Arte aparece nas duas. Um "os do mundo" antes de "veneno, doença e ambiente" tira a
dúvida.

## 5 · As 13 citações reapontadas

Não amostrei, conferi **todas**, por conteúdo: para cada uma, a linha antiga em `84228f3` contra a
linha nova em `f3b5105`, lendo o texto da linha e não só o número. **As 13 apontam para a mesma linha
de código de antes.**

**Nota 3, e não é desta rodada:** na mesma frase de `L-simulacao-simultaneo.md:5492` há uma
citação sem nome de arquivo, "o mesmo em `:1787`", e o `reapontar.mjs` não a vê, porque ela não tem
nome de arquivo. **Ela já estava errada na base:** em `84228f3` a linha 1787 era
`const c = coragem.find(...)`, e o `Math.max(0, ... - golpe.liquido)` a que a frase se refere estava
em 1906. Hoje está em `artes-grid-mesa.ts:1901`. É um conserto de um número. E a lição é sobre a
ferramenta: citação só com o número da linha fica fora da varredura.

## 6 · O resto da faixa

- **O 0,5 para cima (`5736a7f`, `f3b5105`):** Virtude 6 na Dura 63 (3d6 > 9 = 62,5%) e na Severa 38
  (37,5%), no `FRENESI.md` §2 e no capítulo III. O "Firula 2, Virtude 4 na Dura" do §3 também foi
  para 63, porque é o mesmo 3d6 > 9. Varri os dois arquivos e a seção de `racas.md` atrás de 62 e 37
  que tivessem sobrado: zero. O livro agora arredonda por um critério só, o mesmo do `Math.round` do
  `/mestre`.
- **A fúria racial e o Sangue Fervente (`racas.md`):** as quatro Técnicas citadas são as quatro que
  pedem "em fúria" em `tecnicas.json`. A frase diz que só a Técnica Fúria as ativa e que a Técnica
  Frenesi é outra coisa, como a decisão manda. Procede.
- **`racas.json`, meio-orc:** saiu o "não jogável" e ficou "pouco mais de 70 anos", como o capítulo.
  Procede.
- **Os ajustes da 90:** o "ser obrigado a" voltou ao gatilho 3 da manutenção, que era de onde a minha
  nota falava, e a Executora leu isso certo, contra a descrição do despacho. O 17% virou 8% em
  `90-executora.md`, com a nota de correção no lugar. Procede.
- **Build:** `npm run build` exit 0 na minha worktree, com os 23 capítulos (desta vez sem o cache
  velho). Conferi no HTML os links novos: `/centelha-rpg/artes/regras`, `/centelha-rpg/caminhos`,
  `/centelha-rpg/regras/acoes-resistir` e o do Estabilizar, e os destinos existem.

## Limpeza

Os quatro controles negativos foram desfeitos um a um, com `git diff --quiet` conferido depois de
cada um e antes de escrever este arquivo. `git status --short` ao fechar: só os meus dois arquivos da
caixa.
