# Progresso · rodada 46 (L80, parte 2: marcas, ponteiros, ALVOS)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 16:18 (sha e20841d, 0 à frente/atrás de `origin/main`): começando. Três partes, nesta
  ordem: (1) 35 marcas `(citação histórica)` no REVISORA.md; (2) 36 ponteiros vivos
  reapontados à mão, método L72 (âncora procurada no arquivo de hoje, nunca por
  proximidade); (3) `ALVOS` do `test-procedencia.mjs` ampliado para os dez documentos,
  junto com a lista do reapontador, no mesmo commit. Antes: as três `BASE_URL` erradas
  em `Migracao_Dominio.md` (`Base.astro:369`, `bestiario.astro:671`, `mesas.astro:78`,
  achadas pela Revisora). Divisão de arquivo: eu nos dez documentos e nos dois scripts;
  Arquiteto no Pendencias.md/ESTADO.md. Refazendo a medida agora (cópia do portão,
  `ALVOS` ampliado incluindo `Dominio.md`, nada commitado) antes de tocar em nada.
- 16:19 · AS TRÊS `BASE_URL` CONSERTADAS em `Migracao_Dominio.md` (linhas 120-121):
  `Base.astro:352→369`, `bestiario.astro:666→671`, `mesas.astro:55→78`, cada uma
  confirmada contra o arquivo real antes de escrever. Medida com `Dominio.md` incluído:
  `REVISORA.md` dá exatamente 35 "velhas" (o número do Arquiteto para as marcas da
  parte 1); os outros nove documentos somam 33 (36 menos as 3 que acabei de consertar,
  confirmando a régua). `TOTAL envelhecidas`: 69. Indo para a parte 1: as 35 marcas.
- 16:25 · PARTE 1 FEITA: 35 marcas `(citação histórica)` no `REVISORA.md`, uma por
  território de citação (linha com duas citações ganhou duas marcas, cada uma no seu
  território, nunca a linha inteira). Achado próprio, corrigido antes de seguir: marquei
  por engano a citação de `gen-monsters.mjs:266` (linha 1196), que NÃO estava na lista
  das 35 (ela já é "conferida", `CAMPOS_MESA` aparece de fato na janela); revertida a
  marca na hora, medindo de novo para confirmar. Medida final: `REVISORA.md` fecha em
  `semAncora=0 velhas=0 conferidas=5 historicas=35`, exatamente o número do Arquiteto.
  `git diff --numstat`: 33/33 (linhas tocadas, nenhuma nova). Indo para a parte 2: os 33
  ponteiros vivos que restam (36 menos as 3 `BASE_URL` já consertadas), método L72.
- 16:29 · `CONJURACAO.md` FEITO (10 ponteiros): cada âncora achada por nome de função ou
  interface no arquivo alvo, número corrigido para onde ela está hoje
  (`moverSimultaneo` 5906→6082, `modo: 'corrida'` 5845→6015, `Abortar o gesto`
  7111→7394, `combateDaMesa` 2775→2820, `efeitosDisponiveis` 326→321, `custoDe`
  261→250, `gravarEfeito` 1287→1262). Três (`artes-grid-ui.ts:182`, `artes-grid.ts:23`,
  `artes-grid.ts:35`) já tinham o NÚMERO certo: o problema era só a âncora
  (`regras.json:arcano.improviso`/`src/data/efeitos.json` na linha do documento vencendo
  por proximidade, a mesma forma da rodada 45); troquei por uma âncora dentro da janela
  do próprio arquivo alvo (`null = improviso`, `interface Efeito`, `interface Parametro`).
  Medido: `CONJURACAO.md` fecha em `velhas=0`. `git diff --numstat`: 10/10.
- 16:33 · `Grid_Mobile.md` FEITO (10 ponteiros). Achado maior: a citação de `:177`
  apontava para `MesaCab.astro:341-357`, e o mecanismo inteiro (o ramo `body.grid-mob`
  para `.mesa-dlg`) MUDOU DE ARQUIVO, mora em `grid.astro:2340-2364` hoje; reponte de
  arquivo E linha, não só linha. Dois exigiram uma segunda rodada de medida: `:75`
  (duas citações na mesma linha, a segunda `ajustarAltura()` "vazando" como âncora da
  primeira depois que eu só corrigi o número; precisou de uma âncora explícita
  `max-height: 70vh` para a primeira) e `:227` (`toque longo`, ajustei o número para
  `grid.astro:7264`, mas o comentário real está em `7272`, fora da janela de 3 linhas;
  corrigido para `7272` exato). `git diff --numstat`: 10/10.
- 16:34 · `CATALOGO.md` FEITO (4 ponteiros): `test-grid.mjs:2407→2480`,
  `agregar.mjs:307→481`, e as DUAS citações de `grupoDaVez` (`:575` e `:582`,
  `grid.astro:4563→4584`, a própria descrição do L72 sobre a função). `VOZ.md` FEITO (2):
  `artes-grid-ui.ts:678→792` (`id="ag-busca"`), `:577→689` (`data-par`). `CONTEXTO.md`
  FEITO (2): `desfazer` `10240→11237`, `ajustarMana` `9944→10930`. `Auditoria_Tecnica.md`
  FEITO (2): `verificarEfeitos` `1034→1759`, `semearMana` `1483→3269`. `Migracao_Dominio.md`
  FEITO (o último, `Astro.site` `Base.astro:33→44` e `:36→47`). `Dominio.md` FEITO
  (`auth.ts:54`, número já certo, precisou só de âncora explícita `auth.signUp` porque
  `resetPasswordForEmail` da mesma linha vencia por proximidade). `Regua_Relacao.md`
  FEITO (`defesaSocial` `calc.ts:49→87`).
- 16:36 · PARTES 1 E 2 COMPLETAS: os dez documentos fecham em `semAncora=0 velhas=0`
  (REVISORA.md com `historicas=35`). `git diff --numstat` simétrico nos dez (2,1,10,3,
  1,4,10,2,33,2, todos inserções=remoções): nenhuma linha nova em documento nenhum,
  então nenhuma citação de terceiro foi deslocada. Sem travessão em nenhuma linha
  adicionada (varredura no diff inteiro dos dez). Indo para a parte 3: o `ALVOS`
  ampliado, com o controle vermelho-antes/verde-depois.
- 17:17 · PARTE 3: `ALVOS` de `scripts/test-procedencia.mjs` ampliado de 2 para 12
  documentos (`ESTADO.md`/`Pendencias.md` originais + os dez do L80). CONTROLE
  OBRIGATÓRIO feito com `git stash` (não achei "o reapontador" como script separado
  em `scripts/`, só o próprio `test-procedencia.mjs`; escalando essa dúvida ao
  Arquiteto antes de fechar a parte): stashei os dez documentos, ampliei o `ALVOS`,
  rodei o portão real → VERMELHO de verdade (código 1, lista as mesmas 33 velhas
  medidas antes), depois `git stash pop` e rodei de novo → deveria estar VERDE, mas
  achei um ÚLTIMO envelhecimento, autoinfligido: as próprias linhas que acrescentei
  em `test-procedencia.mjs` (o comentário do escopo, o `ALVOS` maior) empurraram o
  arquivo, e `Pendencias.md` cita `test-procedencia.mjs:337`/`:345` (o próprio
  Arquiteto, no L80 que ele acabou de escrever) para as linhas do `MARCA_HISTORICA`/
  `!anc`. Números certos hoje: `:337→352`, `:345→360`. NÃO toquei em Pendencias.md
  (território dele); escalando por mensagem antes de continuar.
- 17:23 · RESPOSTAS DO ARQUITETO: o reapontador não existia no repositório (vivia no
  scratchpad dele há dezenas de rodadas); agora existe, `scripts/reapontar.mjs`,
  commitado por ele em `601bce1`. Minhas duas contas (`:337→352`, `:345→360`) bateram
  com as dele, e ele já reapontou o Pendencias.md com o script novo (dogfood), pronto
  para commitar depois de mim. Achado dele ao construir o `--check` do reapontador: a
  primeira versão lia só a primeira linha da atribuição de `ALVOS` e imprimia
  "0 de 12" como VERDE (zero ambíguo dentro do instrumento que existe para evitá-lo);
  o controle negativo dele (tirar um documento do `DOCS`) pegou. Consertado, três
  controles agora. Achei e corrigi mais um travessão que tinha entrado no MEU próprio
  comentário do `ALVOS` (linha do escopo), antes de fechar. `npm run validate` inteiro:
  verde. `node scripts/test-procedencia.mjs`: 250 conferidas em 12 documentos, 36
  `(citação histórica)`, batendo exato com a medida do Arquiteto. Fechando a parte 3 e
  commitando.
