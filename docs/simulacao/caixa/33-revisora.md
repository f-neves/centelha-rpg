# Rodada 33 · resposta da revisora (VOZ.md §8 item 3: a captura de áudio sobre a barra)

Revisora: aviso em `a261855`. BASE `6616f7c`, SHA `9c47268`, TOPO `9c47268`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `a261855f597d12060b11a81bafcc878bbbea6bc7`. Batem.
- O item de código é `0b5dd6e` (8 arquivos, `.gitignore`, os três de `public/voz-lib/`,
  `comando-barra.ts`, `comando-voz.ts` novo, `grid.astro`). O resto do intervalo é
  reapontamento de citação do Arquiteto (`ad6152a`), fora desta rodada.
- **A restrição de projeto (voz não é caminho novo) confere.** `receberFalaComando`
  (`grid.astro:8679-8712`) chama `interpretarComando` (o MESMO parser) e
  `prosseguirComComando`/`executarComando` (a MESMA execução, confirmação e desfazer) — não
  achei nenhum ramo que grave no Supabase, decida permissão ou resolva hexágono por conta
  própria fora desse caminho. Não é `BLOQUEIA`.

## Julgamento 1 · D33a — o conserto, e a moldura dele

**O achado é bom e o conserto funciona para o caso que ele visou — mas a moldura tem um
buraco, e testei para confirmar, não só para perguntar.** O `HEAD` em `carregarVoz`
(`src/lib/comando-voz.ts:88-94`) intercepta exatamente um 404 (ou qualquer resposta não-OK)
antes de entregar ao Worker. Criei um `public/voz-modelo/model.tar.gz` FALSO — não ausente,
**presente e corrompido** (2 KB de bytes aleatórios, então o `HEAD` responde 200 OK de
verdade) — e segurei o botão do microfone contra a bancada real:

```
titulo do botao ANTES: Segurar para falar um comando (carrega o modelo no primeiro toque)
t=1s: carregando o modelo de voz (31 MB)…
titulo FINAL depois de 20s: carregando o modelo de voz (31 MB)…
erros de pagina: []
```

**Trava para sempre, sem `pageerror` nenhum — pior até que o defeito original, que ao menos
soltava um erro (mesmo que inalcançável).** O `HEAD` só prova que o SERVIDOR responde à
URL; não prova que o corpo que o Worker vai buscar e decodificar por dentro está inteiro e
válido. Um modelo truncado por queda de rede no meio do download, ou corrompido por
qualquer motivo, cai exatamente no mesmo buraco que o 404 caía antes do conserto: a mesma
causa-raiz (o Worker vendorizado não rejeita a própria promise em erro de stream) continua
lá, só que agora escondida atrás de um `HEAD` que cobre só a fatia mais comum do problema.

**Isto é achado, registrado para o Arquiteto — não escrevo remendo, não é meu lugar.** O
`HEAD` vale como está (resolve o caso mais comum, modelo simplesmente ausente, que é
justamente o cenário de produção do D33b/ponto 4, abaixo). O que falta, para quem for
consertar: um TIMEOUT no carregamento (a promise de `createVoskClient` nunca resolve nem
rejeita por conta própria nesse caminho, então só um relógio externo — `Promise.race` com
um `setTimeout` — devolve o controle à mesa) ou trocar o Worker vendorizado por uma versão
que rejeite de verdade. Sem um dos dois, "modelo corrompido" e "rede caindo no meio do
download" continuam travando para sempre.

## Julgamento 2 · a gramática

**Confirmado, por leitura completa de `gramaticaDeVoz()` (`src/lib/comando-barra.ts:105-108`):**
`VERBOS.flatMap(v => v.palavras)` mais `'[unk]'` — 4+4+5+3+2 = 18 palavras dos cinco verbos
de `src/data/comando-barra.json` (que conferi de novo, inalterado desde a rodada 32 fora do
`desfaz` de `auto`/`esperar`) mais o `[unk]`, 19 no total, bate com o número do aviso. Nada
de hexágono, letra ou número na lista — a função nem tem acesso a `ARENA.cols`/`rows`, então
não tem como derivar tamanho de tabuleiro nenhum. `VOZ.md:55-63` (posição só por clique)
confere com o comentário da função linha a linha.

## Julgamento 3 · as duas ordens do "mover" falado

**Tentei fechar esta lacuna do jeito que fechei o D32b — não consegui, e é por um motivo
estrutural diferente, não por falta de tentativa.** O D32b exigia só navegar a interface que
já existe (a barra, o botão de avançar); aqui, `COMANDO_ARMADO` só é escrito por
`segurarVoz()` (depois que `vozCarregada()` é verdade) ou por `receberFalaComando` (que só é
chamado pelo callback `aoFinal` do reconhecedor Vosk de verdade) — não há NENHUM caminho de
interface que arme `COMANDO_ARMADO` sem um modelo Vosk carregado com sucesso, e não há
nenhum gancho de teste já exposto (tipo `window.__DESPEJO`, que existe para outras coisas)
que eu possa chamar sem escrever código — o que não é meu lugar. Confirmei que a bancada
(`astro.bancada.mjs`) não mocka Vosk nem `comando-voz.ts`, e que baixar um modelo real (31
MB) e simular áudio de verdade num Chrome headless é ordem de esforço diferente de "montar a
cena" do D32b — decidi que não vale o custo desta rodada, e digo com todas as letras o que
ficou sem prova: **os dois fluxos de ordem (fala-então-clique e clique-então-fala) e o
cancelamento por Esc de um comando armado NÃO foram exercitados vivos, nem por mim nem pela
Executora, porque nenhum dos dois tem como chegar a `COMANDO_ARMADO` sem um reconhecimento
de voz de verdade.**

**O que SUBSTITUI a prova viva, e até onde isso vale:** li os dois ramos por completo e eles
se espelham corretamente —

- **fala-então-clique**: `receberFalaComando` reconhece `verboParcial` (mover, sem casa),
  `hexJaMarcado` é `null` (nada clicado ainda), arma `COMANDO_ARMADO = {cid, verbo}`
  (`grid.astro:8699`); o clique seguinte, com `armado.verbo` já setado, completa e despacha
  (`grid.astro:8672-8674`).
- **clique-então-fala**: o clique primeiro, com `armado.verbo` ainda indefinido, só grava o
  hex (`grid.astro:8671`); a fala seguinte, com `hexJaMarcado` já presente, completa e
  despacha direto (`grid.astro:8693-8697`).

Os dois ramos usam a MESMA função de despacho (`prosseguirComComando`) no fim, e a lógica é
simétrica por construção — dá confiança de leitura, não prova de execução. Se o Arquiteto
quiser a prova viva de verdade, o caminho é ou baixar o modelo real e injetar áudio fake no
Chrome (esforço grande, não tentei), ou pedir que a Executora exponha um gancho de teste
(fora do meu papel escrever).

## Julgamento 4 · D33b, a decisão escrita com o custo certo

**A decisão está escrita com o custo certo, e a consequência que ela promete é a que
acontece — a que ela promete, não a mais ampla que eu testei no julgamento 1.** O aviso diz
"biblioteca versionada e modelo não" não quebra a produção, degrada; testei exatamente esse
cenário (modelo AUSENTE, que é o caso real do deploy, já que `public/voz-modelo/` está no
`.gitignore` e não existe em produção) no julgamento 1 antes de forçar o caso pior
(corrompido) — a mensagem de degradação aparece limpa. O custo (3,1 MB em todo deploy,
sempre, mesmo sem uso de voz) está escrito com o número certo (`vosk.wasm` sozinho, 2,99
MB) e a alternativa nomeada (CDN) sem a Executora decidir por conta própria — está
corretamente marcado como pergunta ao humano, não decisão de código. Nada a corrigir aqui.

## BLOQUEIA

Nada — o desenho "voz não é caminho novo" está respeitado.

## CORRIGE

Nada nesta rodada (o achado do julgamento 1 é sobre a MOLDURA do conserto, não sobre o
conserto em si — o `HEAD` faz o que promete fazer). Registro para abrir como item novo,
não para desfazer o que já foi feito.

## PERGUNTA

Nenhuma.

## ESCALA

**Sim, uma, e é sobre o julgamento 1.** "Trava para sempre" continua possível (modelo
presente e corrompido, ou rede caindo a meio do download de 31 MB) — não é regra de jogo
nem dinheiro, mas decidir SE vale consertar agora (com timeout, por exemplo) ou registrar
como risco aceito até a frente de voz voltar é escolha de prioridade que cabe ao Arquiteto,
não a mim.

## VEREDITO

SEGUE
