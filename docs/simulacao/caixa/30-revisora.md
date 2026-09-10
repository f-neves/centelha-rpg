# Rodada 30 · resposta da revisora (VOZ.md §8 item 1: a barra de comando de texto)

Revisora: aviso em `fabba12`. BASE `dd308a8`, SHA `6368fee`, TOPO `6368fee`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `fabba12df572dae840103828300dc697f88d9533`. Batem.
- `git merge-base --is-ancestor d5ab81b fabba12` → é ancestral: o veredito da rodada 29
  (cherry-pick `d5ab81b`) chegou de verdade desta vez, conferido antes de começar.
- `git diff --stat dd308a8 6368fee`: 4 arquivos do item (`comando-barra.json`,
  `comando-barra.ts`, `hex.ts`, `grid.astro`) mais `progresso-barra-comando.md` — bate com
  o inventário.

## A pergunta do humano: recusa cobre parecido foneticamente, e a distinção com o Vosk

**Sim, a resposta da Executora está certa, e confirmei nos dois lados (código e tela, não
só o relato).**

No código (`src/lib/comando-barra.ts:63`): `VERBOS.find((v) => tokens.some((t) =>
v.palavras.includes(t)))` — casamento por PERTENCIMENTO NUM ARRAY de strings exatas, sem
distância de edição, sem soundex, nada fonético. Conferi `src/data/comando-barra.json`: a
lista do verbo `auto` é `["auto","automatico","robo"]` — `"automatica"` não está lá, então
cai no mesmo `if (!verbo) return {ok:false, motivo:'nenhum verbo da gramática', ...}` que
qualquer palavra aleatória cairia. Não existe ramo "quase casou" no código: é `.includes`
ou não é.

Na tela, com a bancada de verdade (ver seção seguinte): "automatica" devolveu as MESMAS 5
sugestões genéricas que "blablabla" devolveu, não uma lista estreitada para perto de
"auto" — confirma que não há aproximação nenhuma, nem sequer para ORDENAR as sugestões por
proximidade.

A distinção com `voz-bench.html` também está certa: aquela bancada mede o RECONHECEDOR
ACÚSTICO (Vosk ouvindo "automática" falado e decidindo se transcreve como "automático"
ou outra coisa — erro de fonética real, fora do controle deste código); este parser recebe
TEXTO já pronto e só faz igualdade de string. São camadas diferentes do mesmo pipeline
futuro (voz → texto → este parser), e testar uma não substitui testar a outra — a
Executora não confundiu as duas, e a ressalva que ela escreveu em "O QUE FICOU EM ABERTO"
está precisa.

## Testei a barra de comando eu mesma, ao vivo — porque não existe teste commitado dela

**Achado: não há nenhum `test-*.mjs`/`smoke-*.mjs` para `comando-barra` no diff nem no
repositório.** O `progresso-barra-comando.md` cita um `smoke-comando.mjs` que rodou na
sessão da Executora, mas ele não está em `git diff --stat dd308a8 6368fee` nem em
`git ls-files` — foi um script de trabalho, não commitado. Isso quer dizer que a única
prova reproduzível hoje é a que eu mesma conseguir fazer de novo, não um teste que fica no
repositório para a próxima rodada rodar.

Escrevi um script à parte (fora da árvore commitada, apagado depois de usar) reaproveitando
`dev-server.mjs`/`bancada.mjs`/`navegador.mjs` do jeito que `test-grid.mjs` já faz, e dirigi
a bancada de verdade (`astro.bancada.mjs`, `papel=mestre`):

```
✓ C abre a barra de comando ("Comando · Herói 1")
✓ texto aleatorio recusa, ecoando o que foi digitado ("Não entendi "blablabla"")
✓ e oferece as 5 sugestoes validas, nao uma aproximacao (5)
✓ "automatica" (fora da gramatica) recusa pelo MESMO caminho que texto aleatorio, sem aproximar para "auto"
✓ "mover <casa>" moveu o token de verdade (44.4449px -> 1163.35px, log e distância corretos)
✓ "tirar" (com desfazer) NAO abriu confirmacao, removeu 1 token de verdade
✓ nenhum erro de pagina
```

**Um percalço que vale registrar, porque é exatamente o tipo de coisa que o `progresso-
barra-comando.md` também documentou sobre o próprio teste da Executora:** minha primeira
tentativa de "mover B2" não moveu nada — não por bug do app, mas porque escolhi mal a casa
de destino no meu próprio script. Troquei para uma casa claramente livre e confirmou. Não
subo isso como achado sozinho, mas o que descobri INVESTIGANDO esse percalço é um achado
de verdade, abaixo.

## Achado: "mover" para casa ocupada falha em silêncio total pela barra de texto

Lendo `porNoMapa` (`grid.astro:6920-6921`) para entender por que "B2" não tinha efeito:
`if (ocupadoPor(q, r, cid)) return;` — sem diálogo de erro, sem `logar`, sem nada. Isso já
existia ANTES desta rodada (é o mesmo caminho que o arrasto usa), então não é regressão
introduzida aqui. Mas pelo ARRASTO o mestre vê a peça não sair do lugar na hora — feedback
ambiente, mesmo sem mensagem. **Pela barra de texto o diálogo do comando fecha no
`submit` (antes de `despacharComando` rodar) e depois disso não sobra NENHUM sinal**: sem
erro, sem entrada no registro, sem a peça se mexer. Quem digitou "mover B2" com B2 ocupada
não tem como saber, sem olhar o tabuleiro com atenção, se o comando rodou ou não.

**Julgamento: não bloqueia esta rodada** (o item pedia despachar para as cinco funções já
existentes, sem tocar a lógica delas — D30a já registra esse limite de escopo para outra
decisão, e mexer em `porNoMapa` seria o mesmo tipo de refatoração fora do combinado).
**Registro para rodada própria**, porque é exatamente a classe de coisa que o VOZ.md se
importa (feedback claro de comando, não silêncio ambíguo) e fica pior justamente na
interface nova que este item criou.

## Os quatro `D`s, conferidos no código

- `D30a` (`daVez()`, não seleção por clique): `abrirComando` chama `daVez()` na abertura
  (`grid.astro:8545`) e usa o mesmo padrão das teclas A/O. Bate.
- `D30b` (gramática por palavra): `comando-barra.json` tem 5 verbos com listas curtas de
  sinônimo, nenhuma frase. Bate, e a nota "trocar é só editar o JSON" é verdade — nenhum
  código depende dos valores das palavras, só de `v.palavras.includes(t)`.
- `D30c` (`mover` usa `nomeHex`, escreveu o inverso): `hexDoNome` (`hex.ts:239-246`) é
  mesmo o inverso de `nomeHex` (mesma convenção coluna-letra/linha-número), testado acima
  com "B2"/"T15" batendo com a posição visual esperada.
- `D30d` (permissões replicadas à mão): `permissaoComando` (`grid.astro:8501-8510`)
  reproduz exatamente as condições que citei ao ler o menu (`mandoNela` para
  mover/esperar; `MESTRE` + `SIML()`/`tipo==='criatura'` para os outros três). O risco que
  a própria decisão descreve (duas cópias divergindo no futuro) é real e está bem
  nomeado, não preciso acrescentar nada.

`npm run validate`: rodei eu mesma, exit 0.

## BLOQUEIA

Nada.

## CORRIGE

- Não existe teste automatizado commitado para a barra de comando. Sugestão concreta:
  levar os 6 casos que rodei (abrir por C, recusa genérica com 5 sugestões, recusa de
  "parecido mas fora da gramática" sem aproximar, mover move de verdade com log e
  distância, verbo sem-desfazer confirma citando o verbo certo, verbo com-desfazer executa
  direto) para dentro de `scripts/test-grid.mjs`, do jeito que `cenaLembranca` já faz para
  a fase 2.5 — sem isso, a próxima mudança em `interpretarComando`/`despacharComando`/
  `permissaoComando` não tem rede.
- Registro (não bloqueia): "mover" contra casa ocupada, pela barra de texto, falha em
  silêncio total (sem erro, sem registro, sem movimento) — feedback pior que o do arrasto
  para o mesmo caminho de código. Não é regressão desta rodada; é uma aresta que a
  interface nova expôs.

## PERGUNTA

Nenhuma.

## ESCALA

Nada.

## VEREDITO

SEGUE
