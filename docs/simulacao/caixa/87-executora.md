# Rodada 87 · Executora · o portão intermitente, os CORRIGE da 86, e o Antecedente

Despacho: `docs/simulacao/caixa/87-despacho.md` (`fe09550`). Progresso minuto a minuto, com as
horas medidas, em `progresso-87.md`.

Os três grupos entraram, em três commits, na ordem que o despacho fixou: o grupo 1 sozinho e
primeiro (`e94cdb6`), depois o grupo 2 (`3dd2ac6`) e o grupo 3 (`b903a26`).

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

## Grupo 2 · os CORRIGE da rodada 86 (`3dd2ac6`)

**Item 5, o parêntese do `:260`.** A Revisora disse que as duas leituras possíveis eram
defeituosas e que ela não sabia qual era a pretendida. **O dado decide, e não eu:** o
`derivados.defesaSocial.reguaNota` define o termo só em cima de um ataque que **rema contra ou a
favor** do que o alvo já sente, e a leitura do cortejo não aquece nem esfria vínculo nenhum. Então
o termo não tem direção para ter, e a leitura rola contra a Defesa Social **com dado e sem o
termo**. O capítulo passou a dizer o eixo e o porquê. **Digo alto que isto encosta em regra de
jogo:** é aplicação do que o dado já define, e não decisão minha; se a mesa quiser o contrário,
custa uma oração e eu troco.

**Item 6, o glossário contra o `regras.json`.** O verbete `defesa-social` somava o termo da régua
dentro da fórmula, sem marca, enquanto o `reguaNota` diz em tantas palavras que ele não entra no
número parado que a ficha imprime. Dois arquivos de dado do mesmo repositório discordando sobre o
mesmo número; o `regras.json` é o certo pela decisão da rodada 84, e o glossário se corrigiu.

**Itens 7 e 8, o registro da rodada 86.** A frase do CI foi reescrita para dizer o que foi medido
e com que recorte: na leitura das 20:00 o `Validar dados e regras` aparecia `in_progress` nos
quatro disparos mais recentes e o último FECHADO até ali era `d56dfa1`, em `success`. Escrever "o
último que fechou fechou em success" fez o recorte parecer veredito sobre a faixa; os quatro que
corriam fecharam depois, três em falha, e o `fd4497d` que já tinha falhado é anterior ao commit
que eu citei. As duas contagens: o relato dizia "Cinco commits" com seis na tabela (são **oito**
meus na faixa, seis com mudança), e o `86-aviso.md` dizia "dez commits, e só sete são dela"
(são **onze**, e **oito** são minhas, contados um a um).

## Grupo 3 · o Antecedente (`b903a26`)

As três decisões do humano estão inteiras na versão anterior do despacho (`c38f909`), e eu li de
lá. O que entrou: a cláusula do situacional saiu, e no lugar está o **desconto nos passos do
Neutro**, com os três escopos nomeados, o teto de +6 e o "somam entre si" preservados. A seção
mudou de nome (`O bônus na jogada` → `Onde a régua já começa`), porque o título era a afirmação
derrubada. A Folha do capítulo acompanhou, e a `aparencia.nota` do `regras.json` parou de afirmar
a regra morta no dado.

**E o achado que mudou o alvo do conserto:** a amarra da Reputação **não se edita no capítulo**.
Ela vive em `src/data/antecedentes.json`, e o catálogo do capítulo é gerado dela por
`scripts/gen-cap-antecedentes.mjs`, que roda com `--check` dentro do `validate`. Eu tinha escrito
à mão dentro do bloco gerado; a edição morreria no próximo regen e o portão teria pegado. Corrigi
na fonte e regerei.

**Item 13, a conferência, com o recorte ao lado do resultado.** Varri `src/` inteiro com
`os.walk`, **incluindo `src/data/`**, duas vezes: por linha e depois por parágrafo (para não
perder afirmação quebrada em duas linhas), casando qualquer de
`antecedent|reputaç|contato|posição` com qualquer de
`jogada|rolagem|bônus|turbina|buffa|move a régua|situacional`, e li cada acerto. Único arquivo
excluído: `src/data/diagramas.json`, que é cache de SVG e não tem prosa.

**Não há terceiro lugar.** Sobra a amarra da **Posição**, que o despacho mandou não tocar, e vale
dizer onde ela realmente mora: `antecedentes.md:183` é o texto GERADO de
`antecedentes.json:213`, então quando a mesa decidir a contradição dela, o conserto é na fonte e
não no capítulo. As buscas por `jogadas que movem`, `situacional de Antecedente` e
`pilha situacional` devolvem **zero** em `src/`.

## PRECISA DE MIM

- **A linha de fechamento do teste é texto fixo e nomeia o que não rodou.** Fica como pendência,
  com as duas saídas medidas: a barata (~10 linhas, e nasce um número escrito à mão que envelhece)
  e a fiel (~40 sítios de bloco, e todo bloco novo tem de lembrar de se registrar). Decidido com o
  Arquiteto que não é desta rodada.
- **O eixo da leitura do cortejo encosta em regra de jogo.** Escrevi "com dado e sem o termo"
  porque é o que o `reguaNota` define, e não porque eu tenha decidido. Uma oração desfaz, se a
  mesa quiser o contrário.
- **O `glossario.json` tem três travessões (U+2014)**, todos anteriores a mim e nenhum no verbete
  que eu toquei. O `J10` cobre só o `regras.json`; estes três ficam fora de qualquer lista. É a
  mesma decisão do humano, e eu não mexi.
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

Nada agora, e nada dos grupos 2 e 3 ficou de fora. Esteve bloqueado por um laço: o `pre-commit` varre o `CATALOGO.md` inteiro, a linha 40
dele estava vermelha por causa do meu conserto, e sem ela verde ninguém commitava neste
repositório, nem commit só de documento. O Arquiteto corrigiu a própria linha e destravou.
