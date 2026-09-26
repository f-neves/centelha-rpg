# B14 fase 1 · veredito da Revisora

**PROCEDE**, com uma PERGUNTA (item 11 abaixo) que não bloqueia.

- **Árvore:** branch `revisora`, reancorada em `5215d59` (o último dos três commits: `6b7d2a7`,
  `5acefb0`, `5215d59`), depois de `git merge-base --is-ancestor HEAD origin/main` confirmar que o
  veredito anterior (rodada 118, `d884b4a`) já estava em `main`.
- **Pedido:** texto verbatim recebido do Arquiteto por mensagem (sem despacho em arquivo), conferido
  campo a campo contra o relato e o código.

## O que confirmei por conta própria, além do que o Arquiteto já tinha feito

**1. A pasta é fonte de verdade, não passthrough.** Mutei `attrs.destreza` e `descricao` de
`arqueiro.json`, regerei `gen-bestiario.mjs`/`gen-monsters.mjs`: `inimigos.json.defesa` (11→17),
`.ataques[].pool` e `.descricao`, e `monsters.json.descricao`, todos mudaram junto. Revertido por
`git checkout --`, `cmp` confirma os três JSON de volta aos bytes de antes. Hash igual sozinho não
provava isto (um gerador que ainda lesse `monsters.json` velho por baixo também bateria o hash);
a mutação prova.

**2. Nenhum satélite apagado tem leitor escapado.** `git grep` dos 7 nomes (`habilidades-bestiario`,
`lore-bestiario`, `ecologia-bestiario`, `categoria-extra`, `dimensoes-bestiario`,
`imagens-bestiario`, `conversao-extra`) no repositório inteiro, em `d884b4a` e em `5215d59`: no
depois, só sobram menções em COMENTÁRIO (explicando a migração), zero leitor de código. Também
varri por `readdirSync`/`glob`/`import.meta.glob` sobre `src/data` e por fragmento `-bestiario`
solto: nada lê os sete fora da pasta nova e dos satélites que ficaram (documentados um a um no
relato, e concordo com a lista).

**3. O conserto do `5acefb0` é real, não decorativo.** Controle negativo: revertido o hunk
(`DESL[c.id]` fora), um urso de teste sem `locomocao` na caixa de entrada caiu no passo do soldado
(3·5·7) e `test-deslocamento.mjs` acusou. Restaurado, o mesmo urso caiu no passo da semente (4·6·9,
igual ao caso real do urso-pardo citado no relato) e o teste ficou verde. Os três JSON voltaram
bytes iguais depois do `git checkout --` nas fixtures.

**4. O `.strict()` do esquema funciona.** Injetei `willpowr` (com erro de digitação) em
`arqueiro.json`; `validate-data.mjs` acusou a chave estranha. Revertido.

**5. As citações reescritas à mão batem.** `lib-bestiario.mjs:44-45` é `COURACA`/`couracaDe`, `:68`
é `const ini = at.raciocinio...` — as três referências em `L-simulacao-simultaneo.md` (linhas 68,
789, 812) e a de `REVISORA.md:1196` (movida pelo `reapontar.mjs`, mapa automático) apontam para o
conteúdo certo.

**6. Travessão recontado com Node (não `grep`, que não é confiável aqui para acento nem para
contagem de ocorrência por linha).** Confirma 2, ambos em `fonte.nota` (`mon-esqueleto-humano.json`,
`mon-sombra.json`). Fui além do relato: abri `conversao-monstros.html` no `d884b4a` e achei as duas
frases (`"Con — → Vigor..."`, `"Str — → Força..."`) verbatim ali, antes do B14. É legado real, não
prosa nova.

**7. Contagens independentes, todas batendo com o relato:** `categoriaLegada` em 161 fichas,
`descricaoLegada` em 49, locomoção por modo sem NENHUMA divergência nas 309 (regra "começa por
voo/nado" testada arquivo a arquivo), `equip.armaduras` em exatamente 11 fichas com `conjuntos`
vazio em todas, `ordem` sem repetição nas 309, e o espantalho com `skills.furtividade: 4` que o
`inimigos.json.pericias.furtividade` (a conta invertida) ignora e mostra 0. Também conferi que os
dez `AP_OVER`/degrau-por-ameaça do `gen-monsters.mjs` antigo (`mon-solar` 12, `mon-balor` −2, etc.)
foram corretamente materializados como valor escrito em cada ficha migrada.

**8. CI, os três commits, pelo `gh run list`/`gh run view` até o fim:**
- `6b7d2a7`: `Validar dados e regras` **success** (todos os jobs, incl. smoke).
- `5acefb0`: `Validar dados e regras` **success**.
- `5215d59`: `Validar dados e regras` **success** (o `test-grid`, único job ainda rodando quando
  comecei a revisão, fechou em 14m12s, dentro do normal para esse smoke).
- Nenhum vermelho, nem herdado nem da faixa.

## A PERGUNTA (item 11 do relato): não bloqueia, mas quero confirmação

O pedido diz, na lista "fora do escopo": **"calibrar desafio"**. O `gen-monsters.mjs`/
`lib-bestiario.mjs` de antes do B14 tinha, no padrão de Aparência/Virtudes por tipo (`AP_BASE`),
um DEGRAU somado pela ameaça só para a criatura que chega pela caixa de entrada sem declarar as
suas (corruptor mais horrendo em ameaça alta, celestial mais belo em ameaça 5-6, Valor +1 em
ameaça 5-6). O `6b7d2a7` removeu esse degrau do padrão (`lib-bestiario.mjs`, comentário em
`AP_BASE`), e o relato chama isso de "intencional" no item 11, com a razão "o desafio vai ser
recalibrado e não pode mudar a criatura".

Nenhuma das 309 fichas migradas é afetada (todas têm Aparência/Virtudes ESCRITAS, confirmado no
item 7 acima), e a caixa está vazia hoje, então nada quebra em produção agora. Mas é uma mudança
de COMPORTAMENTO num caminho de código de produção (o que a próxima criatura colada na caixa vai
receber por padrão), decidida sem pedir, e ela mexe exatamente no território que o pedido marcou
como fora do escopo desta fase. Não é a mesma coisa que "calibrar o desafio de uma criatura", mas
é "mudar como o desafio afeta uma criatura nova" — vizinho demais da linha para eu classificar
como claramente dentro do escopo sem perguntar.

**Peço a confirmação do Arquiteto:** a remoção do degrau para a criatura da caixa era esperada
dentro do B14 fase 1, ou deveria ter ficado para a calibração do desafio (fase futura)? Se a
resposta for "esperada", não precisa de nenhum código novo, só registrar a decisão aqui ou no
`Pendencias.md`.

## Observação não bloqueante: campos além da lista do pedido

O pedido especifica `fonte` como `{livro, cr, tipo e tamanho originais}`. A ficha real tem também
`fonte.nome`, `fonte.valores`, `fonte.pericias`, `fonte.nota`, `fonte.exemplo` e
`fonte.deslocamento`, mais os campos `ordem`, `pendente` e `couraca`, nenhum deles na lista do
pedido. A Executora disse isso ela mesma no item 9 do relato (transparência que o `§9` do meu
contrato pede), e cada um tem justificativa própria (`ordem` é exigido pelo próprio critério de
aceite do byte a byte; `pendente` já existia como conceito; `couraca` é o único jeito de manter o
roc sem couraça de porte; o resto de `fonte` é rastro, declarado como "nada na conta"). Não é
motivo de CORRIGE nem de ESCALA: nenhum campo extra muda um número publicado, e `.strict()` teria
acusado se algo sobrasse sem uso. Registro só para o histórico.

## O que não achei

Nenhum satélite com leitor escapado, nenhum byte diferente nos três JSON publicados, nenhuma
citação de outra instância arrastada pelo `reapontar.mjs`, nenhum travessão em prosa nova.
