# Rodada 53 · resposta da revisora (L93: o passo automático confere ocupação de verdade)

Revisora: aviso em `62e09f4`. BASE `17facd9`, SHA/TOPO `e9fdcf6`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `62e09f45b54143de98bbc3ad485ba0a3e91a2141`. Batem. BASE ancestral de SHA,
SHA ancestral do commit do aviso, `git log e9fdcf6..origin/main` só mostra o próprio `62e09f4`:
TOPO = SHA procede.

## Os números

`npm run validate`, rodado por mim: `EXIT=0`, "280 citação(ões)... 42 marcada(s) (citação
histórica)". `test-l93-passocolossal-mesa.mjs`: 5 asserções verdes. `test-grid-simultaneo.mjs`:
79/79.

## Ponto 0 (prioridade do Arquiteto): o cenário consertado ainda testa o que existia para testar

Li `cenaAlvoQueFoge` inteira (`test-grid-simultaneo.mjs:570-704`) e o comentário que documenta a
troca de `bench=12` para `bench=8`. O propósito declarado da cena é a agenda reprojetando durante
uma perseguição, não um corredor de obstáculos; a segunda fileira que `bench=12` acrescentava
(uma parede de Grande/Enorme, não um aperto) nunca foi parte do que a cena queria medir, era um
efeito colateral do tamanho do bench padrão colidindo com o defeito que o L93 fechou. Rodei a
bateria eu mesma e capturei a saída desta cena especificamente: o golpe foi agendado no Tick 2 e
só se resolveu no Tick 9, um adiamento real de 7 Ticks por causa da fuga, não um artefato de
diferença 0 ou 1. O cenário continua exigindo reprojeção genuína; não virou um caminho trivial.

## Ponto 1: o laço de nova tentativa termina, e o teto é outra coisa

Lido o laço inteiro (`grid.astro:5943-5973`, o `for (;;)` dentro de `avancarTickSimultaneo`). Só
continua quando `casaExata` está setado E o erro devolvido é especificamente `.ocupada === true`;
cada volta acrescenta a casa recusada a `vetadas` e pede uma nova candidata evitando TODAS as
vetadas; para assim que a candidata nova repete a posição original ou uma casa já vetada. `passos`
é fixo dentro do Tick e o conjunto de casas alcançáveis é finito, `vetadas` só cresce: termina por
geometria, não por número escolhido, e nunca gira indefinidamente. Confirmei que este laço inteiro
é interno a UMA chamada de `avancarTickSimultaneo`, nunca atravessa um Tick.

O teto de 50 é um laço diferente, de fora: `avancarAteParar` (`:6118-6153`) chama
`avancarTickSimultaneo()` uma vez por Tick, incrementa `avancos`, e
`if (avancos >= TETO_AVANCO_SEM_PARADA) { ...; return; }` (`:6144-6151`) é um `return` de
verdade, com o log de aviso ("isto não deveria acontecer: avise quem mantém o código"). Lida
`TETO_AVANCO_SEM_PARADA` (`:6041-6044`): 50 por padrão, sem override fora da bancada. Os dois
laços são independentes e cada um tem sua própria garantia de parada.

## Ponto 2: a prova do registro existe e falha contra o código de antes

`test-l93-passocolossal-mesa.mjs` tem exatamente essa prova: "md NÃO se move: a gravação recusou
e o cache foi desfeito, não corrompido" e "nenhuma linha de avança/atravessa para md". Não aceitei
isso de segunda mão. Troquei `src/pages/mesa/grid.astro` pela versão de `17facd9` (a árvore de
ANTES desta rodada), mantendo o teste novo por cima, e rodei. Contra o código velho, exatamente
essas duas asserções caem (`{q:7,r:9}` em vez de desfeito; a linha "Peça md avança 1 m (batalha)
até L10" presente no registro apesar da gravação ter recusado), enquanto as outras três (a mesa
carrega, a peça nasce no lugar certo, nenhum erro de página) continuam passando. A prova existe e
discrimina de verdade. Restaurei o arquivo imediatamente e confirmei verde nos dois lados de novo.

## Ponto 3: a medida "inimigo, não aliado" é correta, mas não é o que salva o cenário

`mesa-mock.mjs:349` (`grupo: ehPC ? 'aliado' : 'inimigo'`) confirma que a fileira de índice 8-11
(fora do corte de 4 PCs) é mesmo 'inimigo': a medida procede como fato. Mas fui além e conferi se
essa distinção MUDA alguma coisa no código de hoje: lidos `podeDividir` (`:7324-7325`) e
`ocupadoPor` (`:7389-7401`), nenhum dos dois lê `grupo` em lugar nenhum; `casaExata`
(`:5916-5917`) também não. A regra "aliado passa" do `L94` é uma decisão do humano, ainda sem
código nenhum por trás. Então, hoje, a fileira precisaria do MESMO conserto de `bench=8` fosse
ela aliada ou inimiga: o grupo não é o que decide se o vão fecha. A medida em si está certa e é
um dado útil para quando o `L94` for implementado, mas a frase "o caso aliado não resolve esse
cenário" fica mais precisa como "nenhum grupo resolve esse cenário hoje, porque grupo ainda não
é lido em lugar nenhum da checagem de ocupação": o achado não é um erro, é uma imprecisão pequena
no motivo, não no número.

## Portões

`npm run validate`: `EXIT=0`. `test-l93-passocolossal-mesa.mjs` e `test-grid-simultaneo.mjs`,
rodados por mim: `EXIT=0` nos dois, batendo com o aviso.

## Travessão

Varredura pelo diff inteiro da rodada (`17facd9..e9fdcf6`, via `rtk proxy git diff`, 1146 linhas,
batendo com o `--stat` de 500+95). TRÊS achados reais em linha adicionada:
`docs/simulacao/caixa/progresso-53-l93.md` (um) e `scripts/test-grid-simultaneo.mjs` (dois, no
comentário novo sobre a agenda ao vivo do cartão da faixa). Meu próprio arquivo novo
(`progresso-revisora-53.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Os três travessões acima. Mecânico, sem mudança de comportamento.

## PERGUNTA

Nenhuma.

## ESCALA

O achado do Ponto 3 (a distinção aliado/inimigo ainda não é lida em nenhuma checagem de
ocupação, então "aliado passa" do L94 precisa de código próprio quando for implementado, e não
vai bastar marcar o grupo certo) não é regressão desta rodada nem pendência dela: é contexto para
quando o L94 for escrito, registrado aqui para não se perder entre rodadas.

## VEREDITO

A rodada 53 procede, com CORRIGE mecânico (três travessões). No ponto de maior risco que o
próprio Arquiteto nomeou (o cenário consertado virar um caminho fácil em vez de testar o que
existia para testar), medi ao vivo: o adiamento real de 7 Ticks (2 → 9) na cena `cenaAlvoQueFoge`
mostra que a reprojeção continua genuína, o conserto do cenário não esvaziou o teste. O laço de
nova tentativa termina por geometria finita, fica inteiro dentro de um Tick, e o teto de 50 é uma
garantia separada e real, verificada linha a linha nos dois laços. A prova do registro (o item que
o Arquiteto mais queria ver) existe e eu mesma a falsifiquei contra o código de antes: as duas
asserções centrais caem exatamente como deveriam. A medida "inimigo, não aliado" procede como
fato, mas não é ela que torna o conserto necessário, porque nenhum código hoje lê grupo para
decidir ocupação: registrado como ESCALA, contexto para o L94, não erro desta rodada.
