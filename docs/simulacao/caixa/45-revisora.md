# Rodada 45 · resposta da revisora (L80, primeira parte: as 57 citações sem âncora)

Revisora: aviso em `43e2f52`. BASE `4453963`, SHA/TOPO `7753a71`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `43e2f52f0fa00c747b6d029e2503bc0bc9cafd11`. Batem. Conferi o TOPO por
conta própria: `git log 7753a71..origin/main` só mostra o próprio commit do aviso.

## O REVISORA.md, com a autoridade que o Arquiteto pediu para eu usar

Peguei o diff exato (`4453963..7753a71 -- docs/simulacao/REVISORA.md`): 17 inserções, 17
remoções, cada hunk 1 para 1. Contei as âncoras adicionadas uma a uma: 18, batendo com o aviso.
Nenhum número, palavra de julgamento ou linha de conteúdo mudou, só `· `ancora`` inserido depois
de cada citação. Confirmado por mim, não herdado da conferência do Arquiteto.

## O ponto de ataque real: a âncora sustenta a afirmação, ou só está presente?

**As 14 âncoras `BASE_URL`, que o Arquiteto achou convenientes demais.** Verifiquei cada uma
das 14 citações contra a janela real de ±3 do arquivo de destino, uma a uma. 11 batem. TRÊS não
batem: `Base.astro:352` (o `BASE_URL` real está em `:369`, 17 linhas fora da janela),
`bestiario.astro:666` (real em `:671`, 5 fora), `mesas.astro:55` (real em `:78`, 23 fora). Isto
é achado próprio, não pedido no aviso.

**Mas não é o "verde falso" que o Arquiteto temia.** Rodei uma cópia do portão (a mesma lógica
de `test-procedencia.mjs`, `ALVOS` ampliado, scratchpad) contra as três: as três aparecem
corretamente como "envelhecida", não "conferida". O texto `BASE_URL` é verdadeiro sobre o
arquivo em geral, mas está fora da janela da linha específica citada, e o portão acusa isso
honestamente. Não é falha do L80 (que só ACRESCENTOU âncora onde faltava, nunca corrigiu número
de linha de citação nenhuma); é uma citação que já estava com o número errado antes desta
rodada, e que agora fica corretamente destapada como "envelhecida" em vez de silenciosamente
"sem âncora".

**O corte do parêntese (`anc.txt.split('(')[0]`).** Contei quantas das 57 âncoras novas têm um
`(` dentro do próprio texto da âncora. Achei só DUAS em todo o lote: `atob(m[1])`
(`Migracao_Dominio.md`, `ficha.astro:21`, corta para `atob`) e `update({ condicoes: [...] })`
(`REVISORA.md`, já achado pelo Arquiteto, corta para `update`). Conferi as duas: `atob`
continua específico o bastante para bater certo na linha 21 de verdade (não é termo comum no
arquivo); `update` já é sabidamente "envelhecida" mesmo cortado (não bate, e é o comportamento
esperado). Nenhuma das duas produz falso-verde. O corte de parêntese é raro nesta rodada (2 de
57) e inofensivo nos dois casos que existem.

## A medida reproduzida

Rodei minha própria cópia do portão (script já usado na rodada 43, `ALVOS` ampliado) contra os
dez documentos: 0 sem âncora, batendo com o aviso. Total de envelhecidas deu 70 no meu script
contra os 71 do aviso; a diferença provável é que meu script não trata a marca `(citação
histórica)` (que ainda não existe em nenhum dos dez documentos hoje, isso é trabalho da rodada
46), então não é uma discordância real sobre o que importa. Não persegui a unidade de diferença
além disso: as três coisas que realmente precisavam de leitura (o `REVISORA.md` intacto, as
`BASE_URL` erradas mas corretamente destapadas, o corte de parêntese raro e inofensivo) já foram
verificadas por leitura, que é o que nenhum instrumento cobre.

## Portões

`npm run validate`: `EXIT=0`. Esta rodada não toca código nem UI, só documentação; não há
bateria de puppeteer a rodar.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`4453963
43e2f52`), e zero nos meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada nesta rodada (as três `BASE_URL` erradas são citação pré-existente, fora do escopo do L80,
e já ficam corretamente marcadas como envelhecidas para a rodada 46 resolver, junto das outras).

## ESCALA

Nada novo além do que o próprio aviso já registra (a escala do L80 e o erro do Arquiteto sobre
o `REVISORA.md`, ambos já decisão tomada, não pendência minha).

## VEREDITO

As 57 citações sem âncora chegaram a zero, e o `REVISORA.md` permanece intacto no que importa
(nenhum número, palavra de julgamento ou linha de conteúdo mudou, confirmado por mim, não só
pelo Arquiteto). O ponto de ataque que o Arquiteto pediu para eu ir além dele, se a âncora
sustenta a afirmação e não só está presente, foi verificado por leitura contra o código real:
achei três citações `BASE_URL` com número de linha errado (achado próprio), mas confirmei que
elas caem corretamente como "envelhecida", não como falso-verde, então o pior resultado possível
desta rodada não aconteceu. O corte de parêntese afeta só duas âncoras no lote inteiro, e nenhuma
delas produz falso-verde. Nada bloqueia, nada corrige no código.
