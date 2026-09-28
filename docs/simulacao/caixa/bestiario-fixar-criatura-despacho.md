# Bestiário, fixar criatura para comparação · despacho

Liberado pelo autor em 28/09/2026, para a Executora-3.

## O pedido, verbatim

> adicionar uma opção no bestiário, no topo direito de cada card de criatura vai ter uma
> opção de fixar aquela criatura. a criatura ficará fixada no início da lista e aparecerá
> até mesmo durante os filtros. Isso é para que um usuário possa comparar duas criaturas
> sem ter que ficar mudando de página.

## Decisões do autor (perguntadas por mim, respondidas agora)

1. **Persistência**: `localStorage` do navegador. Sem conta, sem Supabase, sem RLS. Fica só
   naquele navegador; limpar dados do site perde a fixação.
2. **Limite**: até 6 criaturas fixadas ao mesmo tempo. Fixar a sétima é bloqueado (não
   desfixa a mais antiga sozinho); avise o usuário de algum jeito visível quando ele tentar
   passar do limite (um aviso simples via `uiAviso`, já usado noutros lugares da página,
   serve).

## Onde mexer

`src/pages/bestiario.astro` é a página (filtro, ordenação, montagem das fichas adiadas,
tudo em `<script>` no fim do arquivo). `src/components/BestaCard.astro` é o card em si (a
`<article class="besta">`). Leia os dois inteiros antes de começar: o comportamento de
filtro (`apply()`), ordenação (`sortCards()`) e montagem preguiçosa das 268 fichas adiadas
(`montarFatia`/`montarAosPoucos`/`montarTodas`) já existe e a fixação tem de conviver com
os três, não substituir nenhum.

## O que fazer

1. **Botão de fixar**, no topo direito do card. A `figure.arte` já tem duas âncoras
   posicionadas (`.arte-ameaca` no canto inferior esquerdo, `.arte-cent` no canto superior
   esquerdo) — o canto superior direito da imagem está livre e é o lugar óbvio, mas decida
   você se cabe melhor ali ou no cabeçalho do card (`.besta-head`); não é decisão de regra,
   é de layout, e você tem o CSS na mão para testar as duas. Ícone sugerido: um pin/alfinete
   (texto ou glifo, o site já usa glifos como `✚`, `✕`, `↑` noutros botões, sem SVG externo).
   Estado fixado precisa ser visualmente distinto do não fixado (cor, preenchimento).

2. **Estado**: `localStorage`, uma chave só (ex.: `centelha:bestiario:fixadas`, mas escolha
   o nome seguindo o que já existe no projeto — procure outras chaves de `localStorage`
   usadas no site para não inventar uma convenção nova à toa) guardando um array de
   `id`s de criatura (o `id` já existe em `i.id`, é o mesmo usado no `id` do `<article>`).
   Ler/escrever com `try/catch` (o projeto já trata `localStorage` como podendo falhar:
   aba anônima, storage bloqueado). Teto de 6: ao tentar fixar a sétima, recusar e avisar
   (`uiAviso`, importado dinamicamente como já se faz para o diálogo de mesas, ou um aviso
   mais simples se não quiser puxar o módulo só para isto — sua escolha).

3. **Fixada aparece PRIMEIRO na lista, mesmo com filtro ativo.** Isto toca duas partes do
   script:
   - `apply()` decide `c.style.display = ok ? '' : 'none'`. Uma criatura fixada tem de
     aparecer mesmo que `ok` seja falso. Ajuste a condição para: fixada OU passa no filtro.
   - `sortCards()` reordena os `cards` e reinsere no `list`. Fixadas vão para o topo,
     antes de qualquer critério de ordenação escolhido no `<select id="ord-key">`; entre
     fixadas, mantenha a ordem de quando foram fixadas (ou alfabética, se for mais simples;
     não é decisão de regra, escolha a mais simples de implementar e testar).

4. **Fichas adiadas (dentro de `<template>`)**: das 308 criaturas, só as 40 primeiras
   nascem no DOM; o resto vive em `<template class="besta-adiada">` e só entra quando o
   usuário rola a tela (`montarAosPoucos`) ou chega por permalink (`montarTodas`). Se o
   usuário tinha fixado uma criatura fora das 40 primeiras numa visita anterior, ela **tem
   de aparecer fixada e no topo já na abertura da página**, sem esperar o usuário rolar até
   lá. Isto significa: ler o `localStorage` ANTES ou logo no início do script, e se algum
   `id` fixado estiver ainda dentro de um `<template>`, montar esse card específico na hora
   (não a lista toda, só os fixados), antes de rodar `apply()`/`sortCards()` pela primeira
   vez. O carregamento preguiçoso continua existindo para o resto; só os fixados furam a
   fila.

5. **Clique no botão de fixar**: alterna (fixa/desfixa), grava no `localStorage`, atualiza
   a UI do próprio botão, e reordena a lista (chame `sortCards()`, e se a criatura tiver
   sido desfixada enquanto um filtro a excluiria, reaplique `apply()` também). Delegue o
   clique na lista (`list.addEventListener('click', ...)`), pelo mesmo motivo que o
   lightbox e o modal de lore já delegam: fichas adiadas ainda não existem quando o script
   roda a primeira vez.

6. **Marca visual de "isto está fixado"** também deve aparecer no próprio card mesmo sem
   filtro nenhum ativo (uma borda, uma cor de fundo diferente, o que for consistente com o
   resto do visual `.besta` já existente) — não só o ícone do botão, para que ao rolar a
   lista comprida o usuário identifique rápido quais estão fixadas.

## Fora do escopo

- Nada de regra, nada de dado (`src/data/*.json` não muda).
- Nada de Supabase, nada de conta, nada de RLS.
- Não mexer em `mesa-*.ts` nem em `criaturas.astro` (bestiário da mesa é outra tela,
  outro dado, não é este pedido).
- Não precisa funcionar entre abas ao vivo (duas abas abertas não precisam se sincronizar
  em tempo real); só precisa persistir entre visitas/recarregamentos da mesma aba.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build` verdes (o `espelho` não se aplica
  aqui: não é código de combate/motor). CI do GitHub verde no commit final, com o link do
  run.
- Teste manual real no navegador (o projeto tem `node .claude/skills/run-centelha-rpg/driver.mjs`
  para isso, ou Chrome DevTools/claude-in-chrome): fixar 2-3 criaturas espalhadas (uma das
  40 iniciais, uma de fora, tipo um dragão perto do fim da lista alfabética), aplicar um
  filtro que excluiria as fixadas, confirmar que elas continuam visíveis e no topo. Recarregar
  a página e confirmar que as fixações sobrevivem, inclusive a de fora das 40 iniciais, sem
  esperar rolagem. Tentar fixar uma sétima e confirmar o bloqueio/aviso. Desfixar e confirmar
  que ela some do topo e volta a obedecer ao filtro normal.
- Travessão: zero em qualquer comentário/texto novo.

## O relato

Um arquivo curto em `docs/simulacao/caixa/`, dizendo o que foi feito, os arquivos tocados,
a chave de `localStorage` escolhida, e o link do run do CI verde. Diga se é seguro dar
`/clear`. Commite você mesma, com pathspec, seguindo a disciplina de rebase-antes/depois já
descrita no `CLAUDE.md` do projeto.
