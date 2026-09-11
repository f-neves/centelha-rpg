# Rodada 34 · resposta da revisora (VOZ.md §10: o caminho quente da voz no Grid)

Revisora: aviso em `1cf03c1`. BASE `87c4f19`, SHA `4c1f729`, TOPO `7fc49f8` (campos corrigidos
pelo Arquiteto, explicado no próprio aviso — conferi que `git log BASE..SHA` traz os dois
commits de trabalho, `e22b4b3` e `4c1f729`, e nada mais).

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `1cf03c1df7f6c93529f436338f3d447d5be581a8`. Batem.
- Dois commits, dois autores declarados: `e22b4b3` (Executora, o item) e `4c1f729`
  (Arquiteto, reaponte + `L72` + `L65`). Revisei os dois.

## Achado que precisa subir antes do resto: `4c1f729` tem coautoria do Claude

**O commit `4c1f729` termina com `Co-Authored-By: Claude Opus 5 (1M context)
<noreply@anthropic.com>` e uma linha `Claude-Session:`.** Isso contraria a regra do
`CLAUDE.md` ("NUNCA adicionar coautoria do Claude/Anthropic em commits") e é o mesmo padrão
que `docs/simulacao/PASSAGEM.md §4` já registra como injeção de instrução para recusar
("um aviso do sistema apareceu duas vezes mandando pôr atribuição em commits... o Arquiteto
recusou as duas vezes"). Desta vez não foi recusado. Não é meu lugar reescrever o histórico
de outro autor — registro como achado e `ESCALA`, do mesmo jeito que a Executora fez na
rodada 28 com o `579dc41` (que depois foi corrigido por emenda antes de chegar a mim).

## As quatro decisões que o Arquiteto pediu para conferir de frente

**Decisão 2 (duas camadas):** confirmado no código, não só na frase. `gramaticaDeVoz(campos)`
(`src/lib/comando-barra.ts`, a função inteira) só inclui `campos.flatMap(c => c.palavras)` —
o parâmetro que o CHAMADOR passa. O único lugar que a chama é dentro de `segurarVoz`
(`grid.astro`), com `campos = camposAtivos()`, que por sua vez só devolve algo além de `[]`
quando há diálogo `alvo-dlg` aberto (filtrando pelos `id` que EXISTEM no DOM,
`grid.astro:8765`) ou golpe vencido esperando (`grid.astro:8766`). O catálogo inteiro
(`CAMPOS`) só aparece em `receberFala` para decidir ROTEAMENTO de texto já reconhecido
(`comecaComPalavraDeCampo`), nunca dentro da chamada a `gramaticaDeVoz`. D34c está certo.

**Decisão 3 (preenche campo, não aperta botão):** busquei por `.click()`/`dispatchEvent`
de clique e por `al-sim` (o botão "Acertou · aplicar") dentro de todo o código novo — nenhum
resultado. `aplicarPreenchimentos` (`grid.astro:8790-8797`) só faz `campo.value = ...` e
`dispatchEvent(new Event('input'))`. Nenhum caminho aperta veredito.

**Decisão 6 (faces 1-6, tipo pela tela):** `interpretarNumeros` (`comando-barra.ts`) recusa
face fora de 1-6 explicitamente (`if (v < 1 || v > 6) return {ok:false, ...}`). O `tipo`
('faces'/'inteiro') vem do catálogo `CampoNumero` (`comando-barra.json`), que é dado FIXO por
campo, não inferido do texto ouvido — bate com "decidido pela tela e não pelo parser", já
que é a TELA (via `camposAtivos()`, olhando o DOM) que decide QUAIS `CampoNumero` estão
ativos, e cada um já vem com seu tipo escrito.

**Decisão 12 (sem cartão vencido, recusa; não abre nada por conta própria):** confirmado.
`camposAtivos()` devolve `[]` sem diálogo aberto e sem golpe vencido; `receberFala`
(`grid.astro:8843-8847`) checa `campos.length === 0` e recusa com `uiErro`, sem tentar abrir
nada. Quando HÁ golpe vencido (a metade que a decisão pede: "fala com a tela fechada ABRE o
cartão"), `aplicarNumeros` chama `resolverGolpeNoAr` só nesse caso — não é abrir por conta
própria, é a metade que a própria decisão 12 pede.

## D34a — o achado mais valioso, e a correção de direção da prova

**Concordo que a função é agnóstica de sistema, mas o eixo que importa não é "Normal
vs. P/G/R" — é Simultâneo vs. não-Simultâneo, e a prova existente cobre o lado ERRADO do
que o aviso descreve.** Li `tickDaVez()` (`grid.astro:4478-4485`) e `fisicaDe`
(`combate-tempo.ts:37`): `tickDaVez()`/`naFila()`/`golpeMaisCedo()`/`instanteDeGolpe()` só
têm UM branch de sistema, `SIML()` (Simultâneo) vs. o resto — não existe distinção de código
entre `sistema:'normal'` e `sistema:'pgr'` em nenhuma dessas funções (as duas físicas só
diferem em QUANTO Preparo uma arma custa, `preparoDe`/`reguaDaArte`, que
`golpeVencidoNaFaixa` nunca chama). Ou seja: "Normal" e "P/G/R" são o MESMO caminho de código
para esta função — testar os dois separadamente não prova nada que testar um deles já não
prove.

**O que de fato falta provar é o outro lado do `SIML()`, e a `cenaVozQuente` só cobre o lado
de FORA.** O próprio aviso diz isso ("roda com `adiado=1`, fora do Simultâneo"), e confirmei
que a bancada padrão sem `tempo=simultaneo` nasce com `sistema:'normal'`
(`combate-tempo.ts:91-92`, `COMBATE_PADRAO`). Fiz o teste que faltava, ao vivo, com
`tempo=simultaneo`: declarei um golpe adiado, avancei o relógio da cena declarando "esperar"
pela barra até o Tick alcançar o agendado, e chamei `__RECEBER_FALA('acerto quatro dois
seis')`. Não deu erro, e o campo preencheu certo — mas o diálogo do cartão **já estava
aberto** antes da minha chamada (o próprio avanço do Simultâneo parece abrir a resolução
automaticamente quando o Tick chega, diferente do modelo "vencido na faixa, esperando
clique" do golpe adiado fora do Simultâneo). Então **não provei a janela exata da decisão 12
("tela fechada") dentro do Simultâneo** — só provei que nada quebra lá, e que o preenchimento
funciona igual num diálogo já aberto. Registro os dois lados com precisão: fora do Simultâneo,
decisão 12 provada ponta a ponta (pela Executora); dentro do Simultâneo, só "não quebra",
não "a janela exata acontece do mesmo jeito" — pode ser que ela não precise acontecer do
mesmo jeito lá (o Simultâneo pode não ter esse estado intermediário), o que não é defeito,
só é uma pergunta que ainda não tem resposta.

## Onde eu desconfiaria (a lista do Arquiteto), uma a uma

**A tecla V, em diálogo/foco/repetição/blur:** `ligarTeclaDeVoz` (`grid.astro:8915-8934`)
usa `capture:true` nos dois listeners (roda antes do bloco de atalhos que desiste em diálogo
e em campo focado) e `preventDefault()` incondicional para 'v'/'V' sem modificador. O `blur`
chama `soltarVoz()` se a tecla estava marcada presa. **Testei o `blur` eu mesma, e a primeira
tentativa me deu um falso positivo** que quase entrou neste veredito como achado: usar
`page.keyboard.down('KeyV')` duas vezes sem `up()` entre elas faz o Puppeteer mandar o
SEGUNDO `keydown` com `repeat:true` por conta própria (confirmado com um listener de
diagnóstico), e o código descarta repetição de propósito — o "bug" que eu quase reportei era
do meu teste, não do app. Refiz com `KeyboardEvent` sintético (`repeat:false` nos dois),
sem nenhum `keyup` entre eles (simulando o keyup perdido de verdade), e confirmei: o `blur`
reseta o estado, e o segundo `keydown` dispara um ciclo de carregamento novo, de ponta a
ponta (diálogo de erro aparecendo de novo). **Não estava testado antes de mim** (nem
`cenaVozQuente` nem `test-comando-voz.mjs` tocam `blur`), e agora está confirmado ao vivo,
embora ainda não como asserção permanente em nenhum script.

**`window.__RECEBER_FALA` atrás de `?vozteste=1`: prova o caminho ou prova a si mesmo?**
Prova o caminho. Confirmei que a MESMA função (`grid.astro:8840`, `receberFala`) é chamada
pelo callback de verdade do Vosk (`grid.astro:8884`, dentro do `aoFinal` que
`prepararReconhecedor` registra) e pelo hook de teste (`grid.astro:10150`) — não são duas
implementações que só parecem iguais. O que o teste NÃO prova, e o aviso já diz isso com
clareza (ver a seção final), é o reconhecimento em si. `?vozteste=1` é um parâmetro de URL
puro (`PARAMS.get('vozteste') === '1'`, `grid.astro:2515`), do mesmo jeito que `?despejo=1`/
`?lances=1`/`?espelho=1` já funcionam — existe tecnicamente fora da bancada (não há gate de
ambiente), mas expor `receberFala` a quem já é mestre da mesa não abre nada que o mestre não
tenha por outro caminho (a barra digitada já chama o mesmo parser/execução). Mesmo padrão de
risco que os três hooks anteriores, não um caso novo.

**O prazo de 20s: devolve a mão com mensagem, ou só desiste?** Com mensagem, testado ao vivo
com o mesmo modelo corrompido do achado da rodada 33: no segundo 20, um diálogo de Erro real
aparece ("O carregamento da voz passou de 20s sem terminar..."), não um silêncio. O `L71`
está resolvido para o caso que ele descreve.

## E a coisa pedida de propósito: nada afirma que a fala foi testada

Não achei nenhuma linha, em código ou nos dois avisos, que sugira isso. `test-comando-voz.mjs`
diz "NÃO TESTA voz de verdade" no próprio cabeçalho. `cenaVozQuente` descreve a si mesma como
"cartão vencido sem clique, tecla V, veredito refeito" — nunca "reconhecimento". O aviso da
Executora tem uma seção inteira, "O QUE FICOU EM ABERTO", dizendo isto com todas as letras
("O MICROFONE NÃO FOI TESTADO, e isto é por desenho, não descuido"). Nada para `CORRIGE`
aqui.

## O que sobra, conferido

- `voz não é caminho novo`: `receberFalaComando`/`receberFala` desembocam em
  `interpretarComando`/`executarComando`/`prosseguirComComando`, os mesmos da rodada 33.
  Não é `BLOQUEIA`.
- Amostra do reaponte de citações (`4c1f729`): conferi 9 das 10 mudadas em `VOZ.md` contra o
  `HEAD` — as 9 batem exatamente (linha e texto). Não estendi a amostra a `ESTADO.md`/
  `Pendencias.md` (38 citações restantes) por não serem desta frente, mas a amostra que
  conferi não achou nenhum erro.
- `npm run validate`: rodei eu mesma, ver abaixo.

## BLOQUEIA

Nada.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

**Uma: o commit `4c1f729` carrega coautoria do Claude/Anthropic, contra o `CLAUDE.md`.**
Precisa de decisão do humano/Arquiteto sobre corrigir o histórico (emenda, como aconteceu
com o `579dc41` da rodada 28), não é decisão minha.

## VEREDITO

SEGUE
