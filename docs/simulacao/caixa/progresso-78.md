# Progresso · rodada 78 · a regra geral que ninguém tomou, e o gancho dizendo o que faz

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `680964f`. Seis itens: os dois textos de dado que publicavam regra geral, o recorte
do gancho que deixa de fora quem DECIDE o typecheck, o comentário que mente sobre árvore e
commit, o `>/dev/null` que engole a única conferência de schema do commit, a mensagem do portão
(e NÃO a janela, que está medida como carga), e a medida de um portão para as regras compráveis.

- **23:50** · começo. `HEAD` = `680964f`, `origin/main..HEAD` = 0. Árvore limpa fora o
  `jogador-novo-prompt-executor.md`, que não é meu.
- **23:50** · a cor que eu devia: run **35045136585** (`d6fadfc`, a rodada 77) fechou
  **completed success**, a run inteira, sem trabalho vermelho. O `L97` não bateu desta vez.
- **23:51** · item 1 FEITO. Os dois textos pararam de afirmar coisa sobre o Impacto COMUM: o
  `mao-de-ferro` e a linha do Desarmado agora dizem que o punho atravessa o zero **mesmo contra
  quem o pararia nele** (o `inquebrantavel`), que é a exceção contra a exceção, e não uma regra
  geral. Eu publiquei a leitura do cabeçalho da M-21b; o corpo sempre disse "quem TEM a Técnica".
- **23:51** · item 5 FEITO, e é a MENSAGEM e não a janela: o vermelho passou a dizer a regra de
  escrita (o lado tem de estar ENTRE o "PV N" e o "morre em") em vez de acusar o texto de não
  dizer o que diz. E a medição dela, de que alargar a janela QUEBRA, entrou como comentário no
  ponto exato onde a próxima pessoa teria a ideia de alargar.
- **23:52** · itens 2, 3 e 4 FEITOS no gancho. O padrão passou a casar também
  `tsconfig.json`, `package.json`, `package-lock.json` e `astro.config.mjs`, que DECIDEM o
  typecheck; o comentário passou a dizer a verdade inteira (decide pelo commit, confere a
  ÁRVORE) e diz por que checar só o staged seria errado; e o `>/dev/null` virou captura, com a
  saída impressa na falha.
- **23:52** · a falsificação DELA refeita para o item 4: `ordem: "seis"` no `folego.md`, commit
  tentado. O gancho imprimiu **a saída inteira do `astro sync`**, com o arquivo, o campo e o tipo
  esperado (`Expected type "number", received "string"`), e a mensagem parou de culpar o
  ambiente. `HEAD` conferido antes e depois: não mudou. Restaurado, e o índice devolvido com
  `git restore --staged`.
  **E uma coisa que a falsificação mostrou de graça:** na primeira tentativa o `validate` barrou
  ANTES, porque o `combate-tempo-bench.html` estava desatualizado pelos meus dois textos de dado.
  Ou seja, o gerado já cobrava a regeneração antes de o gancho chegar ao `sync`.
- **23:53** · item 6 MEDIDO, sem construir. Está na seção abaixo.

## Item 6 · o custo de um portão sobre as regras compráveis, MEDIDO

**A forma mais barata é a que já existe:** o `ondeNaoPodeVoltar` do
`scripts/validate-data.mjs` é uma lista de pares (nome, texto) varrida por um regex. Somar os
catálogos de coisa comprável é somar ENTRADAS a essa lista, e não escrever instrumento novo.

**O escopo que eu medi:** sete arquivos (`tecnicas`, `artes`, `efeitos`, `armas`, `armaduras`,
`escudos`, `antecedentes`), **6.235 campos de texto**, contando os aninhados (níveis de Arte,
parâmetros de Efeito, níveis de Antecedente).

**O custo de tempo é ruído:** **1,98 ms** por passada sobre os sete arquivos, média de dez
passadas. O `validate` custa 15,2 s, e os JSONs já estão lidos.

**O custo real é de EXCEÇÃO, e são duas linhas, medidas:** com o vocabulário da régua morta
(`\blet(al|ais)\b|limiar de morte|nocaut`), o portão acende hoje em **2 campos de 6.235**, e os
dois são português comum e não a trilha:

- `tecnicas.json` · `pele-adamantina`: *"ignora ambientes letais"*;
- `tecnicas.json` · `corpo-inospito`: *"sobrevive em ambientes letais"*.

Três saídas, e a escolha é da mesa: apertar o regex para não casar "ambientes letais"; reescrever
os dois textos ("ambientes mortais"), que os tira do caminho sem lista nenhuma; ou uma lista de
exceção por `id`, que é a que envelhece calada e eu não recomendo.

**E O QUE ESTE PORTÃO NÃO PEGA, que é a parte que decide se ele vale:** ele vigia a PALAVRA, não
o conceito. Medido contra a sexta regra órfã que eu achei na rodada 77: o texto do
`imortalidade-tenue` (*"só a destruição total o mata"*) **não casa nenhum dos padrões**, porque
ele fala da regra velha sem usar o vocabulário dela. Um portão de vocabulário teria pego as cinco
que usavam a palavra e deixado passar a sexta. **Ele é barato e parcial, e é honesto dizer as
duas coisas.**
