# Rodada 54 · resposta da revisora (L85: a régua de Força governa o empurrão elemental)

Revisora: aviso em `86e88dd`. BASE `fcf778e`, SHA/TOPO `8c63698`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `86e88ddffccf9f90f169cbb30d067100c252a520`. Batem. BASE ancestral de SHA,
SHA ancestral do commit do aviso, `git log 8c63698..origin/main` só mostra o próprio `86e88dd`:
TOPO = SHA procede. Conferido `git log fcf778e..8c63698`: os três primeiros commits (`bed2ec4`,
`971300c`, `a7bafae`) são mesmo a cauda da rodada 53 (CATALOGO, o CORRIGE dos travessões que eu
pedi, o fechamento dela), como o Arquiteto avisou; não atribuo nenhum dos três a esta rodada. Os
quatro seguintes (`6e65660`, `4b2d875`, `eb8de4e`, `8c63698`) são a rodada 54.

## Os números

`npm run validate`, rodado por mim: `EXIT=0`, "281 citação(ões)... 45 marcada(s) (citação
histórica)", exato com a mensagem do Arquiteto. `test-l85-forca-empurrao.mjs`: 27 asserções
verdes. `npx tsc --noEmit`: limpo.

## Ponto 1: os dois tetos são distintos em código, não só no comentário

Lido `resultadoDoEmpurrao` (`artes-grid-mesa.ts:1227-1232`) e o chamador `deslocar`
(`:1281-1286`). `if (peso > maxKg) return { metros: 0, pesaDemais: true };` roda ANTES de
qualquer chamada a `alcanceArremesso`; o caso "derruba" (`metros: 0, pesaDemais: false`) só
acontece quando `peso <= maxKg` mas acima do teto de arremesso, e `alcanceArremesso` é quem
devolve 0 nesse caso. No consumidor, quando `pesaDemais` é `true` o laço em `deslocar` faz
`continue` ANTES de alcançar `condicoesDoEmpurrao`, então nada é aplicado (nem movimento, nem
condição, nem dano); quando é `false` (mesmo com `metros = 0`), o fluxo chega em
`condicoesDoEmpurrao`, que aplica a condição própria da Arte (`caido`) independente de
`parouAntes`. Os dois estados são distintos tanto no produtor quanto no consumidor, não só na
prosa que os descreve.

## Ponto 2: uma implementação só, com uma imprecisão pequena na prosa

O grep de "uma implementação só" (`test-l85-forca-empurrao.mjs:164`) confere 5 nomes
(`cabeca`, `qIni`, `arremessoConst`, `arremessoExpFaa`, `arremessoExpMassa`,
`arremessoExpLeve`, `arremessoQueda`; conte de novo: são 7 itens no array, mas 2 deles
`arremessoApice`/`arremessoTeto` NÃO estão na lista). Fui ver por que faltam: `ficha-engine.ts`
(`:1573-1575`) ainda lê `F.arremessoTeto`/`F.arremessoApice` diretamente, de propósito, para
mostrar ao usuário os sub-tetos da própria conta (chão/cabeça/arremesso) na tela da ficha, não
para recalcular a distância; `dist(w)` (`:1576`) já delega inteiramente para `alcanceArremesso`.
A omissão dessas duas constantes no grep está CORRETA: incluí-las produziria um falso positivo,
já que `ficha-engine.ts` precisa mesmo delas para outro fim. O que não bate é a frase do
progresso ("conferido por grep que cabeca/qIni/as sete constantes de arremesso* sumiram de lá"):
só 5 desaparecem, 2 ficam por razão legítima. É uma imprecisão de prosa, não um problema na
implementação nem no teste, que continua bem direcionado.

## Ponto 3: a simetria ×4 não é frágil, é falsificável e passa

Calculei a tabela inteira (script ad hoc, apagado depois, `git status` limpo conferido) chamando
`alcanceArremesso`/`pesoMaximoErguido` de verdade para os seis níveis de Arte. FAH varre 5 a 40
(maxKg 60 a 1000 kg, razão 16,67×); FAA varre 4 a 24 (distância a 3 kg: 11,9 m a 41,7 m, razão
3,51×, batendo com o 6^0,7 esperado pelo expoente da fórmula de arremesso). A 70 kg: 0 m nos
níveis 1 e 2 (o teto de arremesso fica abaixo de 70 kg, só derruba), 7,3 m a 11,8 m nos níveis 3
a 6. A progressão é monotônica em todos os níveis, sem explosão nem achatamento, e o "25,7 m"
citado no aviso bate exato com o nível 3 a 3 kg da minha tabela, reproduzido de forma
independente. A simetria produz uma saída sensata na prática; não é só estética.

## Ponto 4: o L95 (peso do bestiário) foi corretamente adiado

`pesoDoPorte(c)` (`artes-grid-mesa.ts:1321-1327`) devolve `0` para quem não tem `monstro_id`
mapeado (PC, ou porte fora da tabela), e `deslocar` usa `pesoDoPorte(alvo) || 70` como
salvaguarda, consistente com a descrição ("PC empurrado não tem peso nenhum hoje"). A linha
morta que lia `?.pesoKg` (um campo que nunca existiu no bestiário) foi removida, não escondida
atrás de um fallback silencioso: o comentário no lugar aponta para o L95. É adiamento honesto,
não achado escondido.

## Portões

`npm run validate`: `EXIT=0`. `test-l85-forca-empurrao.mjs`, rodado por mim: `EXIT=0`, 27
asserções batendo com o aviso. `npx tsc --noEmit`: limpo. `npm run smoke` não roda nesta
máquina (o defeito de compilador já catalogado); aceito o controle por `git stash` da Executora
como suficiente, porque é o mesmo protocolo já usado em rounds anteriores e a bateria de
navegador depende do CI de qualquer forma.

## Travessão

Varredura pelo diff inteiro da rodada (`fcf778e..8c63698`, via `rtk proxy git diff`, 1084 linhas,
batendo com o `--stat` de 610+69): zero linhas adicionadas com o caractere de travessão. Meu
próprio arquivo novo (`progresso-revisora-54.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código. Uma frase no `progresso-54-l85.md` ("as sete constantes... sumiram de lá")
afirma mais do que o próprio grep mede (são 5, não 7, e as outras 2 ficam por razão legítima).
Documento já fechado da rodada anterior de trabalho da Executora; devolvo como nota, não como
bloqueio, seguindo a mesma regra do commit defasado (não edito o arquivo dela por cima).

## PERGUNTA

Nenhuma.

## ESCALA

Nenhuma nova.

## VEREDITO

A rodada 54 procede sem ressalva de código. Os quatro pontos pedidos se sustentam contra o
código, não só contra a prosa do aviso: os dois tetos são distintos tanto em quem produz quanto
em quem consome o resultado; a implementação é mesmo única, e a única imprecisão que achei foi
uma frase do progresso contando 7 quando o teste confere 5 (as outras 2 ficam por razão
legítima, não por descuido); a simetria ×4 do FAA, testada com números de verdade e não só
raciocínio, produz uma progressão sensata e monotônica nos seis níveis; e o L95 (peso do
bestiário) foi adiado de forma honesta, com a linha morta removida e o motivo documentado. Nada
bloqueia, nada corrige no código.
