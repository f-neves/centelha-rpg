# Rodada 87 · Executora · grupo 1, o portão que ficou intermitente

Despacho: `docs/simulacao/caixa/87-despacho.md` (`fe09550`). Progresso minuto a minuto, com as
horas medidas, em `progresso-87.md`.

Este relato é só do **grupo 1**. Os grupos 2 e 3 não foram abertos, como o despacho mandou.

## O diagnóstico, na ordem em que o despacho pediu

**1 · Reproduz aqui, 1 de 1.** `node scripts/test-grid.mjs` local: **exit 1** em 3m59s, falhando
em `mover custa de 2 a 7 idas ao banco (foram 0)`. Uma máquina, uma execução, nada concorrente.

**2 · As duas leituras do zero, separadas · e nenhuma das duas era a certa.** Instrumentei a cena
com uma sonda no scratchpad e medi o log do mock em **100, 200, 400, 700, 1500 e 3000 ms** depois
de soltar a peça: **zero nos seis**, com o registro parado no mesmo número. Não é janela curta e
não é "a cena não montou". A cena montou, a peça foi arrastada, e o banco não foi chamado porque
**o movimento não aconteceu**: soltar a peça abriu a pergunta do L68, palavra por palavra,
*"Criatura 9: não é a vez dele"*. Pergunta aberta não grava nada, e está certo que não grave.

**E a asserção vizinha que passa não salva a medida:** o bloco faz duas voltas (`aquece` e `mede`)
e o `o movimento escreveu no registro` compara o total do fim contra um total capturado **antes
das duas**. Quem escreveu aquelas linhas foi o aquecimento. Medido por volta, a volta que falha
não escreve nada e não chama o banco.

**3 · Uma causa ou duas? Uma, e a segunda falha é efeito dela.** `a peça saiu do lugar` falha
porque a peça mirada não andou mesmo. Quando ela **passa** num run em que `foram 0` falha, é falso
positivo: aquela asserção lia `querySelector('#gr-tokens .gr-token')`, o **primeiro** token do
documento, que quase nunca é o arrastado. Medi o par na sonda: peça arrastada parada, primeiro
token longe do ponto de partida, asserção verde.

**Por que a peça errada:** o `pontos()` escolhia a peça pela **ordem no DOM** e o mouse pega a que
está **por cima**. `document.elementFromPoint` no ponto exato do clique devolveu `"Criatura 9"`
enquanto o teste mirava `"Herói 1"`, e os retângulos das duas cobrem aquele ponto. Na cena de 30 o
mesmo, com `"Criatura 19"` mirada e `"Criatura 6"` pega.

**4 · O que mudou entre 19/09 e hoje · nada no repositório, e a data do despacho está errada.**
No que o teste toca não mudou nada: o último commit em `src/pages/mesa/`, `scripts/mesa-mock.mjs`
ou `scripts/test-grid.mjs` é `03aebf2`, de 17/09, e `.github/`, `package.json`,
`package-lock.json`, `astro.bancada.mjs` e os três helpers não mudam desde antes de 15/09.

**E a mesma falha, palavra por palavra, está no log de 18/09** (run `35324942959`, commit
`2054f9c`, 08:34), num dia com **7 falhas em 12 execuções**. Não começou às 22:26 de 20/09.

**5 · O achado que explica os verdes, e é o pior deles.** O bloco tinha um `break` mudo: sem casa
de destino ele saía pulando as cinco asserções do movimento, e a suíte fechava **verde sem ter
medido nada**. O diálogo que fica aberto depois do arrasto errado cobre **312 dos 384 hexágonos**,
e é ele que tira a casa de destino da volta seguinte. Baixei os logs dos jobs: no verde de hoje
(`2215cfc`) e no verde de 19/09 (`057b339`) as asserções do movimento **não aparecem**. O verde de
19/09 não é prova de que a medida passava: é prova de que ela não rodou.

**Veredito: é o instrumento.** O Grid recusa mover peça fora da vez e pergunta, que é o que o L68
mandou ele fazer. Nenhum defeito de produção neste achado.

## O conserto

Quatro mudanças em `scripts/test-grid.mjs`, uma por defeito medido:

| o que mudou | por quê |
|---|---|
| o `pontos()` escolhe a peça por **quem o ponteiro pega**, e num **ponto livre** dela (o centro e mais oito em volta) | o centro da peça certa costuma estar tapado pela peça de cima |
| o enquadramento no palco deixou de valer para a peça de **origem** | ele é condição da casa de **destino**; exigi-lo da origem jogava fora justamente a peça da vez |
| o `andou` mede a peça arrastada pelo `data-c`, contra o **centro dela antes do arrasto** | media o primeiro token do documento, contra o ponto da mão |
| o `break` mudo virou falha alta que diz o que estava na frente | é o que escondeu tudo por dias |

Mais uma asserção nova (**soltar a peça moveu, não abriu pergunta**) e uma linha de log que diz
qual peça foi arrastada, se ela estava na vez e quantas estão na vez no tabuleiro.

**O que eu NÃO fiz, e o motivo:** não montei a ocasião (o portão passaria a guardar um estado
montado por ele mesmo), não movi o bloco (consertar por posição quebra calado na primeira asserção
que alguém inserir acima), não apontei a faixa de 2 a 7 para o verbo "Corrigir posição" (o número
foi calibrado para o mover, em 21/08), e não fechei o diálogo entre as voltas: fechar esconderia
exatamente o sintoma que o conserto faz aparecer.

## O ensaio dos três sentidos

- **vermelho hoje** · o run local antes do conserto, exit 1, e o log do CI de 18/09 com a mesma
  assinatura;
- **verde com o conserto, e com as asserções APARECENDO** nas duas cenas, cada uma com
  `mover custa de 2 a 7 idas ao banco (foram 4)`, 16 repinturas, 38,8 e 39,5 KB, 25 nós;
- **vermelho de novo com a regressão de propósito** · plantei `if (1) return;` antes do
  `porNoMapa(...)` no `grid.astro` (arquivo limpo antes, revertido depois e conferido limpo), e o
  teste ficou vermelho nas duas asserções que importam, nas duas cenas, enquanto `não abriu
  pergunta` seguiu verde, que é o certo: não houve diálogo, houve movimento nenhum.

## ENTROU

Um commit, e ele leva junto o reaponte que o meu próprio conserto obrigou.

- `scripts/test-grid.mjs` · o conserto.
- `docs/pendencias/L-simulacao-simultaneo.md` · quatro citações reapontadas pelo
  `scripts/reapontar.mjs`, que se deslocaram porque eu editei o arquivo citado. O arquivo estava
  limpo antes do script.
- `docs/simulacao/CATALOGO.md` · a linha 40, que é prosa do Arquiteto, escrita hoje e corrigida
  por ele para `(citação histórica, o código mudou em 20/09/2026)` depois que o meu conserto
  reescreveu o código que ela citava. **Entra no meu commit por autorização expressa dele.**
- `docs/pendencias/J-infraestrutura.md` e `Pendencias.md` · a pendência nova, nomeada e não
  numerada, mais o placar (248 → 249 itens, 172 → 173 abertos).

## PRECISA DE MIM

- **A linha de fechamento do teste é texto fixo e nomeia o que não rodou.** Fica como pendência,
  com as duas saídas medidas: a barata (~10 linhas, e nasce um número escrito à mão que envelhece)
  e a fiel (~40 sítios de bloco, e todo bloco novo tem de lembrar de se registrar). Decidido com o
  Arquiteto que não é desta rodada.
- **Dois fatos do CI que a Revisora mediu e ninguém ligou**, e eu também não ligo: commit só de
  `docs/` cai dos dois lados, e as execuções se sobrepõem (sete ao mesmo tempo às 23:12). Um dado
  meu que encosta: a falha **reproduz local, 1 de 1, sem nenhuma execução concorrente**, o que não
  refuta a sobreposição como segundo efeito, só diz que ela não é necessária para produzir esta.
  Não investiguei a sobreposição.

## QUEBROU

- **A premissa do despacho.** "Desde as 22:26 de hoje" e "as quatro execuções de 19/09 fecharam
  todas verdes" não se sustentam: a falha é de 18/09 pelo menos, e os verdes de 19/09 são verdes
  sem medição.
- **Uma frase que me foi pedida para o relato e que a medida contradiz.** O Arquiteto pediu para
  escrever que `foram 0` era "um contador que não viu as idas que de fato aconteceram". Não
  escrevi: medido por volta, não houve ida nenhuma. Ele conferiu no código, aceitou a correção e
  trocou a frase.
- **O meu próprio arquivo de progresso tinha hora inventada.** Eu escrevia várias etapas num
  `write` só e carimbava horário aproximado, alguns minutos à frente do relógio. O Arquiteto pegou
  pelo `mtime`. Reescrevi o arquivo: hora só onde eu tenho medida, e o resto marcado
  `(sem hora medida)`. As duas fontes de hora da máquina (`date` do Git Bash e o PowerShell)
  batem entre si e com o relógio dele; o desvio era invenção minha, não defeito de fonte.

## BLOQUEADO

Nada agora. Esteve bloqueado por um laço: o `pre-commit` varre o `CATALOGO.md` inteiro, a linha 40
dele estava vermelha por causa do meu conserto, e sem ela verde ninguém commitava neste
repositório, nem commit só de documento. O Arquiteto corrigiu a própria linha e destravou.
