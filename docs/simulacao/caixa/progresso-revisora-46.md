# Progresso · rodada 46 (as 35 marcas históricas do REVISORA.md, os 4 consertos de âncora que afirmavam a coisa errada, o portão ampliado para 12 documentos)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 17:34 · reancorada em `9c3c5297100a484608286a23d8eaa6d4cc912e0f` (passo 0 do §0 confirmado,
  tree limpa antes). Conferi o TOPO por conta própria: `git log 8949d3f..origin/main` só mostra
  o próprio commit do aviso. O ponto de ataque desta rodada, diferente dos anteriores: a marca
  `(citação histórica)` faz o portão PULAR a citação para sempre, silenciosamente, antes até de
  olhar a âncora. A pergunta certa para cada uma das 35 não é "está certa", é "é registro de um
  dia passado ou foi marcada para calar o vermelho". Lendo o aviso agora.
- 17:36 · lido `progresso-46-l80.md` e o `46-executora.md`. Conferi o território das marcas em
  uma linha de risco real (`REVISORA.md:290`, duas citações aparentes na mesma linha,
  `:1336-1340` e `:1344-1348`): descobri que ":1344-1348" sozinha (sem nome de arquivo) NÃO é
  reconhecida como citação pelo regex do portão (`CITACAO` exige `arquivo.ext:` antes do
  número), então não existe risco de marca vazando para uma segunda citação viva ali: só há
  UMA citação de verdade na linha, e ela está marcada certo. Achado de leitura, não pedido,
  registro de observação (as referências ":NNNN" soltas, usadas em toda a documentação como
  atalho de "mesma citação de cima", nunca são conferidas por nenhum instrumento, sempre
  foram assim, não é defeito desta rodada).
- 17:37 · os 4 consertos de âncora (terceira categoria) verificados contra o código real, um a
  um: `null = improviso` bate em `artes-grid-ui.ts:182` exato; `interface Efeito` bate na
  janela de `artes-grid.ts:23-33`; `interface Parametro` bate na janela de `:35-45`;
  `auth.signUp` bate em `auth.ts:54` exato, e a prosa ("confirmação de cadastro") corresponde
  ao código (`.auth.signUp` dentro de `cadastrar`). Os quatro sustentam a afirmação, não só
  aparecem na janela.
- 17:38 · o controle vermelho-antes/verde-depois, reproduzido por mim, não pelo `stash` da
  Executora: `git checkout <BASE> -- <os dez arquivos>`, rodei `node scripts/test-procedencia.
  mjs` direto (sem pipe, para pegar o código de saída de verdade): `EXIT=1`, lista de
  envelhecidas real. `git checkout HEAD -- <os dez>` para restaurar, rodei de novo: `EXIT=0`,
  254/36, batendo exato. Tree limpa depois (só o meu progresso não rastreado).
- 17:38 · `reapontar.mjs --check`: o conserto lê o BLOCO INTEIRO da atribuição de `ALVOS` por
  regex, não mais só a primeira linha, e tem controle negativo (tirar doc do `DOCS` local,
  exigir vermelho). É conserto de CAUSA para a forma exata do defeito que apareceu (array
  multi-linha), mas ainda é uma raspagem de TEXTO da fonte, não uma leitura do valor real de
  `ALVOS` em tempo de execução: se um dia `ALVOS` passar a ser montado por `spread` de outra
  lista ou por importação de outro módulo, o regex capturaria só os literais escritos ali
  dentro, acharia cobertura completa por engano, e o portão de verdade conferiria mais
  documentos do que este script sabe. Não é o MESMO sintoma se repetindo (a captura de bloco
  resolve isso), é a mesma FAMÍLIA de risco por outro caminho. Registro como sugestão de
  hardening (ESCALA), não CORRIGE: não aconteceu, e endereçar de verdade seria importar o
  valor real em vez de raspar texto, mudança maior que esta rodada pediu.
- 17:40 · `npm run validate`: `EXIT=0`. `46-revisora.md` escrito, travessão conferido nos dois
  arquivos novos antes de commitar: zero. Indo commitar.
