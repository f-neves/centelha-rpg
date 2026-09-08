# Rodada 26 · aviso à revisora (Fase 2.5, lote 2, item 2: a tela da lembrança)

## COMMIT

```
BASE  ae007b6f0bc242418a79dccf2e15886ea9323084  (HEAD no início desta rodada, dado pelo TechLead)
SHA   5af06f805fff245ccc8834e303135b843e46384f  (esta rodada)
TOPO  5af06f805fff245ccc8834e303135b843e46384f  (nada entrou depois; ver abaixo o que entrou ENTRE base e sha)
```

`0aa2f94` (achado da Auditora sobre `CONTRATO-REVISORA.md`) entrou no range e
não é trabalho meu, mesma explicação já dada em rodadas anteriores para
commits do TechLead/Auditora dentro do intervalo avisado.

**Escopo fechado nesta rodada, por orçamento de semana.** O TechLead pediu
dividir em duas metades se preciso; fechei uma fatia coerente: levantamento
+ mock estendido + desenho visual + a integração real em `pintarTokens()`/
`resolverAtaque()`/`naFila()`, tudo testado contra o mock. **Não fiz**:
nenhuma leitura contra o esquema real vivo (a migração não rodou, não pode
rodar), e não integrei com uma `token_visao`/`combate_visao` de produção
(não existe ainda). Isso não ficou pela metade dentro desta rodada: é o
limite que o próprio pedido da migração 33 impõe ("NAO RODE ESTA ANTES DA
VERSAO DO SITE"), não um corte por tempo.

## O LEVANTAMENTO (antes de escrever qualquer linha)

**1. O que já existe do lado do mestre.** `lembrarVistos()`/`NEVOA.vistos`
(`src/pages/mesa/grid.astro:3878-3894`, linha atual, conferida): ainda
exatamente `{q, r, em, pv, pvmax}` por combatente, escrito quando a peça sai
de vista, e vencido pela última observação (não a primeira). `salvarNevoa()`
(`grid.astro:3900-3916`) persiste em `mesa_arenas.nevoa` (jsonb), via
`SB.from('mesa_arenas').update({ nevoa })`. **Achado que o pedido não
antecipava:** essa coluna já viaja INTEIRA para o jogador hoje, antes da
migração 33: `arena_visao` (a versão corrente é a da migração 24, `supabase/
migracao-24.sql:26-30`, já que a 31 só comenta essa view) faz `select ...
nevoa ...` sem máscara nenhuma. O jogador já recebe `nevoa.vistos` no
navegador dele; só não existe nada que leia ou desenhe esse jsonb do lado
dele. A migração 33 não é o que EXPÕE a memória ao jogador, é o que faz
`token_visao`/`combate_visao` (as views que ele efetivamente consulta para
tabuleiro e fila) USAREM essa memória.

**2. O cabeçalho de `supabase/migracao-33.sql`, lido por inteiro.** O
gatilho tem três itens conferíveis por `git log`/`npm run smoke`, não por
relógio (linhas 11-21); a forma exposta: `token_visao` ganha `lembranca`
(bool) e `visto_em` (timestamptz) via `UNION ALL` (linhas 189-243): a
metade de sempre (posição agora) mais a metade nova (posição de
`nevoa->vistos`, só quando a peça NÃO está visível agora, e só existindo o
`vistos`); `combate_visao` (linhas 266-380) mascara `tick`/`iniciativa`
para `null`, `dados`/`condicoes`/`acao` para vazio, `energia`/`mana` para
`null`, e serve `pv_atual`/`pv_max`/`pv_pct` da fotografia (`f.visto`) em
vez das colunas ao vivo, tudo condicionado a `f.lembrado` (nevoa ligada,
peça não presente, tem `vistos`, não é PC, não é minha).

**3. O que hoje desenha uma peça no tabuleiro do jogador.**
`pintarTokens()` (`grid.astro:4334-4404` na versão desta rodada antes do
meu conserto, hoje deslocada pelas minhas próprias inserções): itera
`COMBS` casadas com `TOKENS` (posição), monta um `<div class="gr-token
...">` por peça. É a função que a lembrança ESTENDE (um `class`, um trecho
de `title`), não uma tela nova.

**4. `lembranca` em `src/`.** Confirmado de novo, agora: `grep -rc
"lembranca" src/` → 0 arquivos (só a palavra acentuada "lembrança" em
comentários, contando o CONCEITO, nunca lida por código). Continuava
verdade; segui para o conserto.

## O VISUAL, as três regras do humano, sem inventar uma quarta

1. **Apagada, visivelmente distinta, sem precisar do mouse.** Três sinais
   juntos, não um: `grayscale(1) brightness(.8)` no retrato, contorno
   PONTILHADO (diferente do TRACEJADO de `.oculto`, que o jogador nunca vê,
   para não reaproveitar sem querer um significado que já existe), e um
   selo `◌` no canto (`grid.astro:1666-1676`). Opacidade sozinha era
   explicitamente vetada pelo pedido; aqui ela é só um dos quatro traços.
2. **Vida da última vez.** `combate_visao` já serve `pv_atual`/`pv_max`/
   `pv_pct` da fotografia (item 2 do levantamento); o anel de Vida do token
   não precisou mudar (lê `c.pv_pct` de sempre). O que mudei foi o
   `title`: diz "lembrança, vista HH:MM" e não deixa a leitura passar por
   "isto é agora".
3. **Não é alvo.** `resolverAtaque()` (`grid.astro:7902-7907`) recusa com
   `uiErro` quando `alvo.lembranca`, cobrindo os DOIS caminhos que levam lá
   (mira e arrasto, que convergem nessa função: conferido por leitura e
   por teste, abaixo). Além disso, a lembrança sai de `naFila()`
   (`grid.astro:4443-4447`): sem isso ela concorreria pelo relógio do
   jogador com um `tick: null` mascarado como zero (`c.tick ?? 0`), o
   mesmo "zero ambíguo" de outros achados desta fase.

Nenhum quarto caso apareceu. Não precisei perguntar.

## A RÉGUA DAS TRÊS MEDIÇÕES (CONTRATO-REVISORA.md §3), as três, não duas

1. **O que a tela desenha:** `.gr-token.lembranca` existe no DOM do
   jogador, com a classe e o `title` corretos: `scripts/test-grid.mjs`,
   função `cenaLembranca`, asserções 1-3.
2. **O que chega ao navegador (o payload, não só o DOM):**
   `window.__SB.tabelas.combate_visao`/`token_visao` lidos diretamente
   (não inferidos do desenho): mesma função, asserções 5-9: `lembranca`,
   `visto_em`, `pv_atual`/`pv_max`/`pv_pct` da fotografia (15/20/75, não
   3/20 ao vivo), `tick`/`iniciativa` nulos, `acao`/`condicoes` vazios,
   posição de `token_visao` na ÚLTIMA CASA VISTA (3,1).
3. **O payload contra o esquema real, não o mock:** aqui a régua bate
   numa parede que não é minha: **não existe esquema real a consultar**,
   porque a migração 33 não rodou e não pode rodar (é a própria migração
   que exige esta tela pronta primeiro). A medição 3 desta rodada é a
   versão possível dela: cada campo do mock (`scripts/mesa-mock.mjs`,
   getters de `combate_visao`/`token_visao`) foi traduzido À MÃO, coluna a
   coluna, direto do TEXTO de `supabase/migracao-33.sql` (citado linha a
   linha nos comentários do próprio mock), e não copiado de memória nem
   inventado. Não é o mesmo padrão de `test-visao.mjs` (que lê o `.sql`
   por `fs.readFileSync` e compara automaticamente): aqui o "esquema real"
   é um arquivo no repositório que ainda não é um banco, e a conferência
   possível é a leitura pareada que fiz ao escrever, não uma automação
   nova. Registro isto como o LIMITE desta medição nesta rodada, não como
   medição completa: quando a 33 rodar, o mesmo par que `test-visao.mjs`
   já faz para `combate_visao`/migração 27 pode (e deveria) ser escrito
   para a 33.

## O CRITÉRIO DE ACEITAÇÃO (§4), pergunta a pergunta

1. **Faz o que a nota diz?** Sim: as três regras do humano, uma a uma,
   testadas.
2. **Alcançado por caminho de produção?** O CÓDIGO sim: `pintarTokens()`,
   `resolverAtaque()`, `naFila()` são as funções de produção de sempre,
   não um atalho de teste. O DADO não, por enquanto: em produção hoje
   `combate_visao`/`token_visao` não mandam `lembranca` (a 33 não rodou),
   então nenhum jogador real vê isto ainda. É o esperado e é o gatilho
   documentado da própria migração, não uma lacuna escondida.
3. **Tem algo que falha se for removido?** Sim, duas provas de regressão
   AO VIVO nesta rodada (revertido, confirmado falhando, restaurado,
   conferido no commit final): a linha de `resolverAtaque` (sem ela, a
   asserção "recusa com aviso" falha, mostra `""`) e a exclusão em
   `naFila` (sem ela, a asserção "nunca está na vez" falha, mostra a
   classe `vez` presente).
4. **Que número publicado isto invalidou?** Nenhum. Tela nova, sem
   métrica anterior sobre ela.
5. **Custo/afirmação por PAPEL (tela nova).** Toda asserção acima está
   marcada: `jog.d.*`/`mestre.d.*` no teste, e nomeada assim neste aviso:
   "o mestre NUNCA vê essa classe" é conferido no papel mestre
   explicitamente, não inferido do papel jogador.
6. **Comentário como garantia sem teste.** Reli os que escrevi: "o mestre
   nunca tem esse campo" (comentário em `pintarTokens`) tem teste
   (`!mestre.d.temNoDom`); "ela não pode segurar o relógio" (`naFila`) tem
   teste (a prova de regressão do item 3 acima). Não encontrei garantia
   nova sem par.

## ONDE LER

- `src/pages/mesa/grid.astro:1666-1676` · CSS da lembrança
- `src/pages/mesa/grid.astro:4381-4392` · `pintarTokens`, a classe e o título
- `src/pages/mesa/grid.astro:4443-4447` · `naFila`, a exclusão
- `src/pages/mesa/grid.astro:7902-7907` · `resolverAtaque`, a recusa
- `scripts/mesa-mock.mjs:180-193` (knob) e `:1090-1152` (getters) · a
  simulação da migração 33
- `scripts/test-grid.mjs`, função `cenaLembranca` · as doze asserções e as
  duas provas de regressão
