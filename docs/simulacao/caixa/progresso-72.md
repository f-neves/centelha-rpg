# Progresso · rodada 72 · sem a Força, o Arco Composto rende como um Arco Longo

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `95d93f1`. Três leitores de `forcaMult` e **dois precisam concordar**, senão a ficha
diz `1d6+1` e o Grid diz `1d6+4` para o mesmo personagem. Mais o texto da tabela e o aviso da
ficha, que hoje dizem "Requer Força 4" e a arma não fica proibida.

NÃO inventar campo de preço. NÃO mexer no `forcaCap: 3` do Arco Curto. Se eu achar uma QUARTA
leitura de `forcaMult`, relato ANTES de consertar, porque a lista de três é a base do custo dele.

- **14:30** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **14:33** · varri `forcaMult`/`forcaMin`/`forcaCap` por mim mesma em `src/` e `scripts/`, e a
  lista dele de TRES arquivos esta certa: nao ha quarto ARQUIVO. Mas dentro do primeiro a faixa
  `879-885` para cedo: quatro linhas abaixo, em `:892-893`, ha a MESMA conta para a mao INABIL
  da empunhadura dupla (`capFI`, `multI`, `inabilAp`), e o Arco Composto pode estar naquele
  slot. Nao e um quarto leitor: e o mesmo leitor, com a faixa curta. Vou consertar junto, porque
  deixar de fora criaria a meia-regra (o Composto na mao habil freado e na inabil nao).
- **14:33** · e o `:879` (a versao de duas maos da arma VERSATIL) NAO alcanca o Composto: ele
  esta dentro de `if (!dist && ...)` e o arco tem a tag `distancia`.
- **14:33** · o `lib-tempo.mjs` nao pode importar de `src/lib`: ele e INLINADO dentro do
  `combate-tempo-bench.html` pelo `gen-bench-tempo.mjs`, e a bancada e uma pagina solta. Entao
  ali a regra e uma segunda escrita por necessidade, e quem mantem as duas honestas e o
  `test-espelho`. Alem disso a traducao dele (`:192`) HOJE descarta o `forcaMin`: ele precisa
  passar a carregar o campo para a conta de `:331` poder ver.
- **14:36** · a regra escrita UMA vez, em `calc.ts`: `comRequisitoDeForca(w, forca)` devolve a
  arma com `forcaMult` e `danoBonus` rebaixados ao patamar comum quando o braco nao alcanca o
  requisito. Cada chamador aplica no TOPO e todo o resto da conta dele (o `capF`, o `mult`, o
  `danoBonus`) ja sai certo, sem espalhar um `if` por formula. Os dois que PRECISAM concordar
  chamam a mesma funcao.
- **14:36** · o `lib-tempo.mjs` recebeu a regra ESCRITA DE NOVO, por necessidade, e a traducao
  dele passou a carregar o `forcaMin` (ela o descartava). Quem mantem as duas escritas honestas e
  o `test-espelho`, que rodei: verde.
- **14:38** · o TEXTO: a linha da tabela dizia `Requer Forca 4` e a arma nao fica proibida.
  Passou a dizer o que acontece: com Forca 4+ soma Forca x2 e o +2; abaixo disso rende como um
  Arco Longo. E o aviso da ficha dizia so o requisito; passou a dizer a consequencia
  (`sem a Forca 4: rende o comum`), com o porque no title.
- **14:40** · a resposta a pergunta dele sobre o portao: o `test-contrato` NAO pegava sozinho. A
  ficha de fixacao usa espada longa e arco longo, e nenhuma das duas tem `forcaMin`. Acrescentei
  um bloco la, que e o lugar certo porque o que precisa de portao e a JUNTA e nao a regra.
- **14:40** · ENSAIO DOS TRES SENTIDOS: (1) guardando os quatro arquivos, NOVE falhas, e uma
  delas mostra o defeito com o numero da decisao (`veio 1d6 +4 (P)`); (2) verde; (3) plantei a
  regressao que ele nomeou, consertar SO a ficha e deixar o `combate-resumo` para tras, e caiu a
  assercao da junta sozinha. Tive de deixar o teste TOLERAR a funcao ausente, senao o primeiro
  sentido estourava na primeira linha e ficava cego para a junta, que e o que importa.
- **14:41** · e um defeito MEU que o teste pegou: escrevi `\b` dentro de string Python nao-crua
  e o Python o transformou em BACKSPACE (0x08). O regex virou `/^1d6 \+1<0x08>/` e nao casava
  com nada. O teste ficou vermelho dizendo `veio 1d6 +1 (P)`, que era o valor CERTO, e por dois
  minutos eu procurei o defeito no codigo em vez de no teste. Tres bytes removidos, e varri os
  seis arquivos da rodada atras de outros caracteres de controle: zero.
