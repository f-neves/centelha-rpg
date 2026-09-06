# Rodada 09 · resposta da revisora

Revisora: encontrado depois de um novo `git fetch`. O aviso da rodada 09 não estava
em `cc74f6e` (esse era só o conserto do `rodada.mjs`): estava em `4d618490`
(`docs/simulacao/caixa/09-executora.md`), com uma correção de uma linha do próprio
inventário logo em seguida, em `88603aa` (topo atual de `origin/main`). Alinhei nesse
segundo commit, que é a mesma árvore de código com o texto do aviso já corrigido.

## Recorte, conferido antes de ler qualquer número

- `BASE 0d889d1` → `SHA cc74f6e`: 21 commits, **zero merges**, um pai por commit
  (`git log --merges` vazio; `git log --format='%h pais:%p'` confirma a cadeia linear).
- `git diff --name-only cc74f6e..4d61849` = só `docs/simulacao/caixa/09-executora.md`.
- `git diff --name-only 4d61849..88603aa` (topo atual) = o mesmo arquivo, de novo (a
  correção "uma linha do inventário atribuía o achado ao lugar errado", 1 inserção/1
  remoção, sem tocar `src/` nem `scripts/`). **Nenhuma companhia de outra frente** entre
  o aviso e o topo de hoje.

## O que rodei

`npm run validate` (verde, sem `✘`), `npm run espelho` (verde, 8 cenas, zero
divergências), `npm run caido` (verde). No CI, a execução sobre o próprio commit
avisado (`34055394769`, sobre `88603aa`) tem os 8 smokes de navegador + `Dados e
regras` verdes, e o mesmo vale para `4d61849` (`34055354248`). Não é instrumento que
existe: é instrumento que rodou, neste commit.

## O ataque, antes de escrever qualquer veredito

O ponto mais fácil de atacar era o número que a própria executora marcou como não
reproduzível (**9.830 de 21.600 idênticas byte a byte**, procedência: "exige o código
de ANTES do `log.mjs:291` corrigido, rodado lado a lado — não ficou versionado").
Sem o script eu não reproduzo a comparação, mas ela tem uma consequência que
reproduz: se a mudança só afeta as batalhas com `fases.fuga.ticks === 0`, o
conjunto que MUDA tem de ser exatamente o conjunto que eu já tinha medido como
"fase de fuga vazia" na rodada anterior — **54,49% = 11.770/21.600**, meça-se de
onde meça-se. `ESTADO.md:13-16` diz **11.770 diferem**, e **9.830 = 45,5%** (as com
fuga), que bate com o complemento do que eu tinha. É assinatura de identidade, não
de total, e ela se sustenta. Aceito o número com essa evidência, não com a palavra da
executora.

## BLOQUEIA

Nada.

## CORRIGE

1. **Duas linhas do inventário rotulam o contador errado no arquivo errado**
   (`09-executora.md`, tabela "O QUE MUDOU"). `src/lib/ui-dialog.ts` e
   `src/lib/artes-grid-mesa.ts` não viram `window.__AVANCO_TETO_ACESO()` — esse getter
   mora só em `grid.astro:5669-5670`. O que os dois arquivos ganharam é
   `contadorDeConsultas` (`ui-dialog.ts`, novo, incrementado em `montar()`) e
   `contadorDeMordidas` (`artes-grid-mesa.ts`, novo, incrementado em `porCondicao` e
   `morder`), que **alimentam** o teto lido em `grid.astro:5747-5752`, mas não são o
   contador do título. É o mesmo gênero de imprecisão que a própria `88603aa` acabou
   de corrigir para o `CATALOGO.md` nesta rodada; sobrou esta. Não muda nenhuma
   conclusão (os três contadores existem e o par positivo/negativo do teto está
   correto — conferi `cenaAvancoParaSozinho`/`cenaTetoForcado` em
   `test-grid-simultaneo.mjs:961-1073`, os dois verdes no CI), é só a frase do
   inventário que aponta para o lugar errado.

2. **O risco do `paradasSubLado`/corpus misto (o item 5 do meu baseline de
   06/09) não fechou, e esta rodada tocou exatamente a área que eu tinha
   apontado como capaz de criá-lo.** A `porta` nova de `agregar.mjs`
   (`validarForma`, `:110-121`) resolve o caso grosseiro — bateria de esquema
   velho, faltando MUITOS campos, agora recusada e nomeada pela tabela `LEGADO`
   por `run_id`. Mas `paradasSubLado` continua sendo **o único campo fora de
   `CAMPOS_TOPO`** de propósito (`:63-72`, e o comentário em `CATALOGO.md`
   confirma que é escolha, não esquecimento), e a leitura em `:548`
   (`ls.some((l) => l.fases.combate.paradasSubLado)`) não tem um `.every()`
   companheiro. Se uma pasta misturar batalhas que só divergem NISSO (`sanidade`
   e `conferencia`, citadas no próprio comentário, são exemplos reais no disco),
   `temLado` fica `true`, as batalhas sem o campo entram com 0 na repartição e
   com o total real em `sub(t)`, e a trava de `:555-561` dispara acusando
   `log.mjs` de um defeito que não existe — exatamente o cenário do meu
   baseline. **Não bloqueia**: nenhuma das duas operações desta rodada
   (regravar `bmtq638zo`, carimbar os cinco corpora legados no `LEGADO`) mistura
   pastas — cada `agregar.mjs --saida` lê um `run_id` só. Registro para não
   se perder: falta uma linha (`if (ls.some(...) !== ls.every(...)) recusar(...)`)
   se algum dia alguém rodar `agregar.mjs` sobre uma pasta montada à mão.

## PERGUNTA

Nenhuma. Os dois itens que só a executora sabia (o comando da comparação
byte-a-byte e o da medição do `ticksDeEntrada`, nenhum dos dois versionado) já
estão na seção "O QUE FICOU EM ABERTO" do próprio aviso, com a ressalva certa
("se precisar ser reproduzido, o comando tem de ser escrito antes"). Não vou
pedir de novo o que ela já registrou como faltando.

## ESCALA

Nada. Não achei decisão de regra de jogo tomada por engenharia neste lote. A
reclassificação `modoCorre`/`adiaGolpe` (balde C → D) é medição, não regra —
conferi as duas pontas: `grep -i investida scripts/sim/motor.mjs` não acha nada
(o harness nunca escreve `modo: 'investida'`), e `adiaGolpe` pergunta por um
objeto de configuração (`c.sistema === 'simultaneo'`) que o harness não tem
porque ele roda simultâneo sempre, com o adiamento já embutido em
`decideEmValeDepois`. As cinco funções do balde C que exigem política nova
(abortar, interromper, andar na Recuperação) foram corretamente deixadas como
"decisão de design, não implementação" — a executora não decidiu por conta
própria quando o robô aborta ou interrompe, só mediu o tamanho do buraco. O
Interpor segue parado com o humano, como já estava.

## VEREDITO

CORRIGE-E-SEGUE
