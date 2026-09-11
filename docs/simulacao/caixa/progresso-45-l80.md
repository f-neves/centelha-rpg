# Progresso · rodada 45 (L80, parte 1: as 57 âncoras)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 15:38 (sha 873c920, 0 à frente/atrás de `origin/main`): começando. Item único: as 57
  citações sem âncora, nos dez documentos que o Arquiteto listou (fora
  `Pendencias.md`/`ESTADO.md`, dele). Divisão de arquivo: eu nos dez, ele lá. Primeiro
  passo: refazer a medida sozinha, mesmo método (cópia do `test-procedencia.mjs` no
  scratchpad, `ALVOS` ampliado, nada commitado), antes de escrever âncora nenhuma.
- 15:40 · MEDIDA REFEITA E CONFIRMADA: 57 sem âncora, batendo exato com o Arquiteto
  arquivo a arquivo (REVISORA.md 18, Migracao_Dominio.md 17, CONJURACAO.md 10,
  Grid_Mobile.md 4, CATALOGO.md 4, VOZ.md 1, CONTEXTO.md 1, Auditoria_Tecnica.md 1,
  Regua_Relacao.md 1). Lista completa das 57 salva no scratchpad. Começando por
  `REVISORA.md` (18): registro histórico por declaração própria, então só âncora,
  nenhuma correção de conteúdo ou número.
- 15:47 · `REVISORA.md` FEITO: 18 âncoras, todas achando o SÍMBOLO REAL que a citação
  afirma (nome de função, chave de objeto, regex, atribuição), procurado no arquivo
  alvo, nunca inventado. Duas exigiram achar o nome mesmo sabendo que ele NÃO estaria
  na janela de hoje (`motor.mjs:39`/`:40`, sobre `temGesto`: a cópia local "saiu",
  como o próprio texto já registrava, então a citação vira "envelhecida" e não
  "inventada" · é a diferença que o Arquiteto pediu para respeitar). Duas citações
  compartilhavam a mesma linha (`:1957`, `combate-tempo.ts:181` e `motor.mjs:40`):
  uma âncora cada, dentro do território de cada uma, sem cruzar. Duas âncoras reais
  já existiam no documento mas na linha ERRADA por causa da quebra de markdown
  (`update({ condicoes: [...] })` e `/golpe caindo/i`): dupliquei a frase na linha da
  citação, sem tocar na linha original. Medida depois: `semAncora` de REVISORA.md caiu
  de 18 para 0; `git diff --stat` deu 17 inserções e 17 remoções (uma por linha
  tocada, nenhuma quebra de linha), confirmando que não editei conteúdo nenhum, só
  acrescentei âncora. Total do L80 caiu de 57 para 39. Indo para `Migracao_Dominio.md`
  (17).
- 15:49 · `Migracao_Dominio.md` FEITO: 17 âncoras. Quatorze delas compartilham a mesma
  afirmação (`import.meta.env.BASE_URL`, o item já dizia isso na linha de abertura, que
  não estava em falta), espalhadas em 4 linhas de continuação com 3-4 citações cada:
  conferi PRIMEIRO que os 14 arquivos têm exatamente uma ocorrência de `BASE_URL` cada
  (`grep -c` num só comando, antes de escrever), e depois pus a mesma âncora curta
  depois de CADA citação, respeitando o território de cada uma na linha. As outras
  três (`conta.astro:49`, `auth.ts:54`, `ficha.astro:21`) bateram exatas no arquivo real
  (`redirectTo`, `auth.signUp`, `atob(m[1])`). `git diff --stat`: 7 inserções, 7
  remoções, nenhuma linha nova. Medida: total do L80 caiu de 39 para 22,
  `Migracao_Dominio.md` em 0. Indo para `CONJURACAO.md` (10).
- 15:52 · `CONJURACAO.md` FEITO, mas com um tropeço real, exatamente o que o Arquiteto
  avisou: escrevi DOIS pares citação+âncora na mesma linha (`:73`), e a medida depois
  mostrou a segunda citação pegando a âncora da PRIMEIRA (`interface Custo` em vez de
  `Some os níveis investidos`). Contei a distância à mão: as duas âncoras estavam
  EXATAMENTE empatadas em 20 caracteres da citação, e o empate cai para a de ANTES por
  ordem de array (a mesma forma do CATALOGO.md, proximidade em bytes, não a que o olho
  vê). Consertado trocando ", " por " e " entre os dois pares (um caractere de sobra
  que desempata para o lado certo), medido de novo, confirmado verde. Rodei a medida
  DEPOIS de cada lote, não só no fim, e foi isso que pegou. As outras 9 âncoras bateram
  reais (`function conjurar`, `interface Custo`, `function custoDe`, `Some os níveis
  investidos`, `A Arte sai no último Tick`, `modo: 'corrida'`, `Abortar o gesto`,
  `ctx.gastarMana` ×2, `concentracao.aoSofrerDano`). `git diff --stat`: 9 inserções, 9
  remoções. Total do L80 caiu de 22 para 12. Indo para `Grid_Mobile.md` (4).
- 15:56 · `Grid_Mobile.md` FEITO: 4 âncoras. Achado igual ao da rodada 41: a âncora
  `Math.min(y, innerHeight - r.height - 8)` estava quebrada em DUAS linhas dentro das
  próprias crases (o markdown envolvendo o parágrafo), então nem uma âncora válida
  existia em nenhuma das duas linhas · troquei por `innerHeight - r.height - 8` (sem
  `(` no meio, porque o portão usa `split('(')[0]` para achar a "chave" da âncora, e
  um `Math.min(` cortaria para só "Math.min", genérico demais). O `toque longo`
  (mecanismo real, achado em `grid.astro:7264-7277`, um `pointerdown` com
  `setTimeout`, não onde a citação aponta) prova a régua do Arquiteto: quando a busca
  por nome não acha nada na janela, procurar o MECANISMO pelo que ele faz
  (`pointerdown`+temporizador+vibração), não desistir. `git diff --stat`: 5/5. Total
  caiu de 12 para 8. Indo para `CATALOGO.md` (4).
- 15:57 · `CATALOGO.md` FEITO: 4 âncoras (`dica: btn.title`, `x.fracaoSemGolpe || 0`,
  `function grupoDaVez` reaproveitada num segundo uso ilustrativo da mesma citação, e
  `chip.addEventListener`, esta última era outro caso de âncora-na-linha-seguinte
  exatamente como o próprio CATALOGO.md descreve como forma). `git diff --stat`: 4/4.
  Total caiu de 8 para 4. Faltam VOZ.md, CONTEXTO.md, Auditoria_Tecnica.md e
  Regua_Relacao.md, um cada.
- 15:59 · OS QUATRO ÚLTIMOS FEITOS (`VOZ.md`, `CONTEXTO.md`, `Auditoria_Tecnica.md`,
  `Regua_Relacao.md`): `bateContagem: rolls.length === dadosExpr`, `function desfazer`,
  `function verificarEfeitos`, `function defesaSocial`. Medida final: as 57 sem âncora
  chegaram a ZERO, nos dez documentos. Conferido arquivo a arquivo, `git diff
  --numstat` em cada um dos nove tocados: inserções == remoções em todos (17, 7, 9, 5,
  4, 2, 1, 1, 1), nenhum ganhou ou perdeu linha, então nenhuma citação de OUTRA pessoa
  nestes documentos foi deslocada por mim. `REVISORA.md` continua "texto original, sem
  edição" no sentido que importa: nenhum número, nenhuma palavra de julgamento e
  nenhuma linha movida, só âncora acrescentada.
- 16:03 · CONFERÊNCIA MAIS FORTE DO ARQUITETO, E UM ACHADO DELE PARA A 46, REGISTRANDO
  ANTES DE COMMITAR. Ele comparou o CONJUNTO INTEIRO de citações de cada arquivo contra
  o `HEAD` (não só a contagem de linha): os nove conjuntos são idênticos, byte a byte,
  o que prova que só acrescentei âncora, nenhum número mudou. Portão de verdade
  (cópia dele, `ALVOS` ampliado): as 57 chegaram a 0, confirmado. Achado dele: `anc.txt
  .split('(')[0]` corta a âncora no primeiro parêntese na hora de COMPARAR (não na hora
  de escrever), então `` `update({ condicoes: [...] })` `` que escrevi em REVISORA.md
  vale, na prática, só como `` `update` ``, específico na leitura, genérico na
  conferência. Não deu falso verde aqui (a citação já estava podre e acusou "velha"
  mesmo assim), mas poderia dar em outro arquivo. Lição para a 46: preferir âncora sem
  parêntese, ou o que vem ANTES do primeiro parêntese já específico. Não fui autorizada
  a corrigir agora (é achado para a próxima rodada, não desta). Achado dele também: das
  57, 18 (as do REVISORA.md) não precisavam de âncora, porque a marca `(citação
  histórica)` é conferida ANTES da âncora no portão (`test-procedencia.mjs:337` vem
  antes do `:345`), instrução dele, especificada errado, registrada como erro dele, e
  ele decidiu NÃO desfazer o trabalho (a âncora ainda documenta o que a citação afirmava
  historicamente). E o efeito lateral bom: as 57 âncoras destravaram a conferência de
  "envelhecida" para 28 citações que estavam PULADAS silenciosamente por falta de
  âncora (43 → 71 no total dos dez documentos), reescalando a rodada 46 (36 ponteiros
  vivos, eram 21; 35 marcas históricas, eram 22).
