# Regra do Quase-Acerto + conserto do Simultâneo + bancada · relato da Executora

Despacho: `docs/simulacao/caixa/regra-quase-acerto-bancada-despacho.md` (commit `a4a6f33`).

## Progresso

- **Item 1 (pasta) · FEITO.** `docs/export/proezas/chatgpt/centelha/` → `docs/calibracao/`
  (raiz: 09/10/14/15; `discussao/`: 00-07, 02p, 12, decisoes-entendimento.md e os 10 arquivos
  sem número classificados pelo autor). `matriz-habilidades.json` na raiz de `docs/calibracao/`
  (decisão do autor: não é discussão do ChatGPT, é a matriz de Habilidades fechada nesta rodada).
  Caminho de saída do `calibrar.mjs` e a citação em `docs/pendencias/D-proezas-tecnicas.md:42`
  atualizados. `.gitignore:84-90` simplificado (a exceção pontual não faz mais sentido; o que
  virou histórico já mudou de casa, fora do ignore). Commits `ba01ce6`, `826aa64`, `f0155b5`,
  push feito (`a4a6f33..f0155b5`).
- Achado antes de mexer no item 2, reportado ao Arquiteto e já decidido: a "fonte única" do
  raspão da conferência prévia do despacho não era única (`grid.astro:10198` e
  `motor.mjs:407` reimplementavam a conta em vez de chamar `quaseAcertoDoEncontro`). Decisão do
  autor: refatorar os dois call-sites para chamar a função de verdade, fechando a divisão de
  `CATALOGO.md`.
- **Item 2 (regra do Quase-Acerto) · código pronto, NÃO COMMITADO ainda** (trava no item 2e,
  abaixo). Mudanças feitas, em memória de trabalho:
  - `src/lib/lance.ts`: `EntradaLance.alvo` ganhou o campo `centelha`;
    `quaseAcertoDoEncontro` agora desconta `alvo.centelha` do raspão (2a) e aceita um tipo mais
    estreito (`Pick`) em vez do `EntradaLance` inteiro, para os dois call-sites não precisarem
    montar um objeto fake; `resolverGolpe` ganhou o piso do item 2c
    (`liquido = Math.max(entrada.danoQA, bruto - soak, 0)` no ramo `acerto`).
  - `src/data/regras.json:1145`: `quaseAcerto.porClasseArmadura.leve.reducao` 0 → 1 (2b).
  - `src/pages/mesa/grid.astro`: `raspaoBase`/`margemBase` (linha ~10198) e o `alvo` de
    `entradaDoLance` (linha ~10351) agora chamam `quaseAcertoDoEncontro` de verdade, lendo a
    Centelha do alvo de `PERFIL[alvo.id]?.centelha`.
  - `scripts/sim/motor.mjs`: a entrada do golpe (linha ~394) também chama
    `L.quaseAcertoDoEncontro` (exportada agora em `lib-ponte.mjs`) em vez de reimplementar a
    conta; `alvo.centelha` lido da peça.
  - `scripts/sim/elenco.mjs` e `scripts/sim/calibrar.mjs`: as peças da bancada não carregavam
    Centelha nenhuma até agora (achado à parte, não estava no despacho: a simulação nunca
    modelou Centelha do alvo no raspão porque a fórmula antiga não usava). Acrescentei
    `centelha: ficha.centelha || 0` em `montarArquetipo` e `centelha: opts.centelha` em
    `perfilDe`.
  - `npx tsc --noEmit`: limpo.

## Item 2e · a trava do gancho, com a contagem pedida

`test-lance.mjs` roda dentro do `pre-commit` (via `npm run validate`) e compara
`resolverGolpe` contra `scripts/fixtures/lances.jsonl` campo a campo, incluindo `danoLiquido`
e `pvDepois`. Rodei `node scripts/test-lance.mjs` isolado (sem commitar, sem tocar a fixture)
para medir o efeito:

```
✗ resolverGolpe OK · 1315 lances no despejo · 1315 conferidos com a fonte fixa e 1315 com a rolada
  · 390 divergiram · 45 asserções
  · ZERO divergências com a fonte fixa (390, em danoLiquido 390, pvDepois 390)
```

**390 de 1315 lances (29,7%) mudam de `danoLiquido`/`pvDepois`, e os 390 são 100% efeito do
item 2c** (o piso "o acerto nunca dói menos que o raspão daquele golpe"). Conferido à parte: os
itens 2a/2b (Centelha do alvo, Redução da leve) NÃO aparecem nesta contagem porque o replay da
fixture usa o `entrada.danoQA` GRAVADO (valor da mesa antiga, um número congelado no arquivo) e
nunca reconstrói esse número a partir de `quaseAcertoDoEncontro`: só os dois call-sites vivos
(`grid.astro`, `motor.mjs`) fazem essa conta agora, e nenhum dos dois participa do replay da
fixture. Ou seja: a fixture, do jeito que está, só pode testemunhar 2c; 2a e 2b ficam sem
oráculo automatizado até uma fixture nova ser colhida com a regra vigente.

Dois efeitos colaterais no PRÓPRIO `test-lance.mjs`, fora do replay (não é fixture, é o arquivo
de teste): as duas asserções unitárias de `quaseAcertoDoEncontro` no fim do arquivo (linhas
463-469) chamam a função com um `entrada`/objeto literal sem `alvo.centelha`, e viram `NaN` com
o campo novo obrigatório. **Não toquei no arquivo** (o despacho proíbe nesta rodada); registro
aqui para quem decidir a fixture decidir isto junto, porque as duas ficam vermelhas do jeito
que estão até `test-lance.mjs` ganhar `centelha` nesses dois literais.

**Proposta de versionamento (três opções, para decisão do autor antes de eu commitar):**

1. **Recoletar de verdade** (`node scripts/coletar-lances.mjs` contra a mesa já com a regra
   nova) depois que o item 2 estiver na mesa publicada. Fixture nova testemunha as três
   mudanças (2a/2b/2c) de uma vez, com Centelha e armadura variando de verdade. Custo: perde a
   fixture atual como evidência do comportamento ANTERIOR (a menos que eu arquive a atual à
   parte, ver opção 3), e fica um período (até a próxima coleta) em que `test-lance.mjs` não
   tem oráculo nenhum rodando no CI a não ser que se aplique a opção 2 como ponte.
2. **Re-derivar só os campos de dano, sem recolocar a mesa.** Um script descartável recalcula
   `danoLiquido`/`pvDepois`/`absorcao` de cada lance com o `resolverGolpe` novo, a partir do
   `entrada`/`sorteio` já gravados (que continuam sendo evidência real da mesa: Defesa, dados
   rolados, veredito, tudo isso não muda). Só os campos DERIVADOS da regra do dano são
   atualizados. `test-lance.mjs` volta a ficar verde sem precisar de uma coleta nova, mas o
   oráculo desses três campos passa a valer "a fórmula que eu implementei", que é exatamente a
   ressalva que o cabeçalho do arquivo pede para nunca acontecer por reflexo, e por isso a
   proposta é registrar no `lances.meta.json` (`regra: "quase-acerto-27-09-2026"` ou
   equivalente) que esses campos foram re-derivados, não recolhidos, e por quê.
3. **Congelar a fixture atual como referência histórica** (`lances.pre-quase-acerto.jsonl`,
   fora do `validate`) e deixar as asserções de dano de `test-lance.mjs` com uma tolerância
   datada e documentada (o padrão que `test-portoes.mjs` já usa: "6 tolerância(s) com condição
   escrita") até a opção 1 ou 2 se resolver. É a que menos mexe agora, mas deixa o portão
   sabendo MENOS sobre o dano por mais tempo.

Recomendo a opção 2 como ponte imediata (mantém o resto da fixture como evidência de verdade,
sem esperar uma sessão de mesa) seguida da opção 1 quando a mesa rodar de novo com a regra nova,
mas não apliquei nenhuma das três: aguardando decisão antes de commitar `lance.ts`,
`regras.json`, `grid.astro`, `motor.mjs`, `elenco.mjs`, `calibrar.mjs` e `lib-ponte.mjs` (as
sete mudanças do item 2 ficam juntas, porque a regra só faz sentido como conjunto).

### Item 2 · DECISÃO DO AUTOR e execução

Decisão: opção 2 agora (re-derivar), opção 1 depois (recoleta de verdade quando a mesa rodar com
a regra nova), com duas condições. As duas cumpridas:

1. **Testes sintéticos para 2a e 2b** em `test-lance.mjs`, seção nova "6 · a Regra do Quase-Acerto
   (27/09/2026)": Centelha 0/2/9 contra um raspão de 4 (passa inteiro, desconta 2, não fica
   negativo), leve + Centelha somando os dois descontos, e um golpe de prova para 2c (Absorção 99
   comendo o dado inteiro, e o líquido ainda vale o raspão da arma, não zero). As duas asserções
   antigas de `quaseAcertoDoEncontro` (linhas ~465-475) ganharam `centelha: 0` explícito para não
   virar `NaN` (a fixture não carrega esse campo).
2. **Fixture original preservada intacta**: `scripts/fixtures/lances.pre-quase-acerto-2026-09-27.jsonl`
   e o `.meta.json` irmão, cópia byte a byte de antes da re-derivação. `lances.meta.json` ganhou
   um bloco `rederivado` documentando quando, por quê, o que foi tocado (só `danoLiquido` e
   `pvDepois`), o que NÃO foi testemunhado (2a/2b, cobertos pelos sintéticos acima) e onde está o
   histórico.

Execução: script descartável (`scripts/sim/_tmp-reder.mjs`, rodado e apagado) recalcula
`danoLiquido`/`pvDepois` com o `resolverGolpe` novo a partir do `entrada`/`sorteio` já gravados,
**poupando os lances em que o Gate de Perfuração resvalou** (o mesmo predicado `gateResvalou` de
`test-lance.mjs`: o gate zera o dano por FORA de `resolverGolpe`, e re-derivar esses lances com a
função pura mentiria sobre o que a mesa faz de verdade). Primeira tentativa, sem essa exclusão,
tinha re-derivado 618 lances; com o predicado certo, **390 lances mudaram, o mesmo número exato
que `test-lance.mjs` já reportava antes desta rodada**. `node scripts/test-lance.mjs` agora fecha
com **0 divergências e 56 asserções**, incluindo a atualização da seção 5.2 (o limite
`líquido === bruto − absorção` virou `líquido === max(danoQA, bruto − absorção, 0)`, porque o
piso do item 2c mudou esse invariante de propósito, não por defeito).

## Item 4b (a migração 40) · FEITO, MAS NÃO APLICADA NO BANCO

O autor decidiu que o sexto ponto de clamp (`migracao-22.sql:146`, a RPC `jogador_dano`) NÃO é
pendência: é o valor gravado da Vida dos jogadores na mesa real, então sem ele o item 4 não vale
fora do simulador. `supabase/migracao-40.sql`, novo, substitui o `greatest(0, ...)` pela mesma
conta de `limiteDaMorte()` (`src/lib/calc.ts:69-79`), replicada em PL/pgSQL.

**O obstáculo real, confirmado**: `combatentes` não tem coluna `centelha` (conferido em todas as
migrações, `migracao-2.sql` até a `39`), e a Centelha de cada peça hoje só existe calculada no
CLIENTE. A migração aplica o limite com a Centelha DESCONHECIDA (o mesmo caso que
`limiteDaMorte()` já trata em TypeScript: `centelha == null` cai no lado mais generoso,
`comCentelha`, arredondando para cima): não é um contorno inventado, é o comportamento que a
função já define para "não sei a Centelha", e já é uma melhoria real sobre o `greatest(0, ...)`
de hoje.

**As duas opções para o arredondamento exato, relatadas no comentário da própria migração, NENHUMA
aplicada**:
1. Coluna `centelha` nova em `combatentes`, populada na entrada em jogo. Preserva a razão de ser
   da RPC (o dano é relativo porque o jogador não pode saber a Vida do inimigo; a Centelha dele
   mereceria a mesma proteção).
2. Passar a Centelha como parâmetro extra de `jogador_dano`. Mais barato, mas **tem um problema de
   privacidade que vale a pena pesar**: a RPC é relativa exatamente porque a visão do jogador
   esconde a Vida do inimigo, e hoje, pela mesma visão, um jogador atacando um inimigo não tem a
   Centelha dele carregada no próprio navegador (`PERFIL[alvo.id]` só existe para fichas que ele
   pode ler). Passar a Centelha por parâmetro decidiria, de carona, que ela deixa de ser
   informação escondida.

**O que foi testado**: a fórmula em si, localmente, contra `limiteDaMorte(pvMax, null)` de verdade
(`scripts/sim/lib-ponte.mjs`, que já exporta `limiteDaMorte`), para os PV máximos 1, 5, 20, 34, 35,
40 e 41: os sete bateram exatamente com `-Math.ceil(pvMax/2)`, a mesma conta que a migração faz em
SQL. **O que NÃO foi testado**: a migração rodando no banco de produção (sem acesso de escrita
daqui). Os passos exatos (SQL Editor, o `create or replace`, a conferência antes/depois com uma
peça de teste, o registro em `Pendencias.md` como as migrações 29/30) estão no final do próprio
arquivo `migracao-40.sql`, para o autor rodar à mão.

### Item 2 · achados a mais (ripple), todos corrigidos

- **`quase-acerto.ts` `quaseAcerto()` é uma QUARTA implementação** da conta do raspão (a
  conferência prévia só via duas). É usada por cards de bestiário/comparação de arma fora de
  combate, sem alvo específico, então não ganha o desconto de Centelha (não tem alvo). Ganhou o
  2b (leve 0 → 1) automaticamente, por ler `regras.json`. Isso quebrou
  `scripts/test-quase-acerto.mjs` (o exemplo do capítulo XII, "contra couro... 4"), que também é
  o texto do capítulo (item 2d): corrigido para 3, na prosa e no teste juntos.
- **`contaDoLance` (grid.astro, o lance ROLADO À MÃO) e a caixa `pintarDano` (a prévia "Vida
  ficaria X/Y") são uma QUINTA e SEXTA implementação**, paralelas a `resolverGolpe`, para o
  caminho em que o mestre digita o resultado do dado em vez do Grid rolar sozinho. Sem o item
  2c (o piso) nelas, o lance ROLADO teria o piso e o DIGITADO não, dependendo do modo de
  rolagem ("site"/"mesa"/"misto") escolhido na mesa. Apliquei o mesmo piso nas duas.
- **A bancada (`elenco.mjs`/`calibrar.mjs`) nunca carregava a Centelha da peça** (já reportado
  acima): sem isso o item 2a não tinha o que descontar em simulação nenhuma.
- **O espelho de motor acusou o problema de verdade**: rodei `node scripts/test-espelho.mjs`
  antes de saber de nada disso, e ele mostrou `danoQA: mesa 2 × laço 0` em duas células: a
  mesa (browser) não sabia a Centelha do alvo (`PERFIL[alvo.id]` é nulo nos combatentes
  sintéticos do espelho, que não têm `personagem_id` nem `monstro_id` reais) enquanto o laço
  (`motor.mjs`) sabia. Resolvido acrescentando `centelha` ao contrato `ResumoCombate`
  (`src/lib/mesa-bestiario.ts`: `baseResumo`/`resumoDe`, com override por `combatentes.dados`,
  igual ao `qa`) e trocando a leitura em `grid.astro` de `PERFIL[alvo.id]?.centelha` para
  `r?.centelha` (o RESUMO do alvo, sempre presente para quem é alvo de um lance).
  `scripts/mesa-mock.mjs` passou a injetar `centelha: arq.centelha` em `dados`, do mesmo jeito
  que já injeta `qa`. **`node scripts/test-espelho.mjs` agora fecha limpo**, as 16 células, sem
  nenhuma divergência.

## Item 3 (Simultâneo) · FEITO

O pedido: "quem estava de pé na abertura do Tick solta todos os golpes daquele Tick, mesmo que
caia nele". Achei DUAS reimplementações do erro, não uma:

- `scripts/sim/motor.mjs` (fase 4 da resolução): trocado o laço de `for (const c of dePe())`
  (reconsulta quem está vivo AGORA) mais `if (!vivo(c)) continue;` para `for (const c of emPe)`
  (o retrato já congelado na fase 2 de declaração, de antes de qualquer golpe deste Tick
  resolver). Removida a guarda.
- `src/pages/mesa/grid.astro`: o bug aqui não é um `if` explícito, é o filtro `foraDaFila`
  (que também sai quando a Vida chega a zero) dentro de `golpeMaisCedo`/`golpeVencidoNaFaixa`
  (as funções que decidem "há golpe caindo agora" e "qual é"), reconsultado a cada chamada. Um
  atacante que morre no meio da resolução do Tick some dessas duas funções, e o cartão do golpe
  dele nunca mais aparece para o mestre resolver. Acrescentei `DE_PE_AO_ABRIR` (o par de
  `CAIDOS_AO_ABRIR`, que já existe para o ALVO desde 03/09): um retrato de quem estava de pé na
  abertura do Tick, e as duas funções passam a ignorar `foraDaFila` para quem está nesse
  conjunto. A faixa visual dos golpes no ar (`pintarGolpesNoAr`) também lia a lista errada
  (`emPe` sem quem acabou de cair) e recebeu o mesmo ajuste, senão o cartão sumiria da TELA
  mesmo com a lógica corrigida por baixo.

**Verificação**: `node scripts/test-espelho.mjs` (16 células, zero divergência, incluindo duas
que ANTES do conserto do item 3 divergiam de verdade em PV/chão/Defesa perdida no Tick 25-26 da
célula `4x4-media`/`4x4-aberto` semente 771107), mais `node scripts/test-golpe-caido.mjs`,
`node scripts/test-l84-caidofila-mesa.mjs` e `node scripts/test-l84-levantar-mesa.mjs` (para não
contradizer o L84, que a conferência prévia apontou como vizinho): todos verdes.

## Item 4 (Vida negativa) · FEITO no front-end, achado um SEXTO ponto no banco

Os 5 pontos do clamp que a conferência prévia achou, todos corrigidos com
`Math.max(limiteDaMorte(pvMax, centelha) ?? -Infinity, pv - dano)` no lugar de
`Math.max(0, ...)`:

- `scripts/sim/motor.mjs` (a resolução do golpe): antes/depois abaixo.
- `src/pages/mesa/grid.astro` (duas): `baixarVida` (a função que GRAVA de verdade, dois ramos:
  mestre via `gravarPeca`, jogador via RPC + eco local) e `pintarDano` (a prévia "Vida ficaria
  X/Y" antes do mestre confirmar).
- `src/lib/artes-grid-mesa.ts` (duas): `morder` e `aplicarDano`, as Artes que ferem no Grid.

Antes/depois de `scripts/sim/motor.mjs`:
```
- alvo.pv = Math.max(0, alvo.pv - s.danoLiquido);
+ const limite = L.limiteDaMorte(alvo.pvMax, alvo.centelha) ?? -Infinity;
+ alvo.pv = Math.max(limite, alvo.pv - s.danoLiquido);
```

**Achado a mais, NÃO corrigido, fora do escopo de código deste despacho**: existe um SEXTO
clamp em zero, no BANCO, em `supabase/migracao-22.sql:146`, dentro da função `jogador_dano`
(a RPC que o jogador chama para se ferir sozinho): `set pv_atual = greatest(0, coalesce(pv_atual,
0) - p_quanto)`. Isso significa que, até uma migração nova rodar à mão, o caminho do JOGADOR
(não o do mestre) continua gravando Vida travada em zero no servidor, mesmo com o eco local do
cliente (`grid.astro`, `baixarVida`, ramo jogador) já mostrando o valor negativo certo por um
instante, até a próxima leitura do banco desfazer essa mentira. Registrado como pendência (ver
item 7 abaixo); não escrevi a migração porque o despacho não pediu mudança de banco e migração
não roda sozinha neste projeto.

Verificação: `node scripts/test-artes-grid.mjs` e `node scripts/test-arte-na-mesa.mjs` verdes
(as Artes que ferem continuam corretas com o alvo inteiro); não achei teste automatizado que
exercite Vida abaixo de zero de verdade nesses dois arquivos (a fixture não tem golpe grande o
bastante), então a prova principal aqui é de leitura de código + `tsc --noEmit` limpo, não de
teste vermelho→verde.

## Item 5 (nota do livro) · FEITO

`src/content/chapters/combate.md`, logo depois da frase que descreve o Simultâneo (Tick a Tick):
o texto exato que o despacho deu, sem alteração.

## Item 6 (bancada) · código pronto e validado com `--n` baixo; falta só o `--n 1000` final

`scripts/sim/calibrar.mjs` reescrito:

- **6a.** Os cenários `CENARIOS` (V1/V2/V3/V1+V2/V1+V3) saíram por inteiro: a fórmula do V1 (o
  piso do item 2c) já é incondicional em `lance.ts`, então o wrapper de `resolverGolpe` em
  `libDaBancada` virou código morto e foi removido, junto com a variação de Absorção por tipo
  (`cenario.absorcao`) em `perfilDe` e o parâmetro `cenario` espalhado por todas as funções. A
  camada exata (`golpeExato`) também deixou de ramificar por cenário: o piso agora é incondicional
  lá também, espelhando `resolverGolpe`.
- **6b.** Força por Tick nova (`cicloDaPeca` via `L0.anatomia`, `golpesParaTicks`,
  `forcaTick` em `rodarEspelho`), reportada ao lado da força por tentativa antiga (mantida,
  renomeada só na leitura), com uma coluna ⚑ quando as duas discordam (sinal oposto, ou diferença
  relativa > 20%). As duas SÓ discordam quando os dois lados usam armas de ciclo diferente
  (confirmado rodando com `--n 20`: nas tabelas onde os dois lados usam a MESMA arma, força e
  força/Tick saem idênticas, porque o ciclo é o mesmo dos dois lados; na tabela nova de Briga ×
  Armas, que cruza desarmado com espada longa, elas divergem de verdade).
- **6c.** Duas alavancas novas, `atributo+1-forca-montante` (seção 6a do relatório) e Briga
  (desarmado, `skills2.briga`) contra Armas (seção 6b do relatório, arquétipo novo
  `fichaBrigaDe`/`perfilBrigaDe`, usando a MESMA chave `pericia: 'briga'` que o bestiário já lê em
  `combate-resumo.ts:85`, sem precisar entrar no catálogo de Habilidades secundárias para
  funcionar). Arremesso contra Atirador **NÃO RODADO**: o motor não modela alcance além da
  distância inicial fixa da cena (peças sempre nascem adjacentes; a penalidade por faixa é só
  exibida na mesa, o mestre soma à mão), então rodar essa alavanca mediria o mesmo duelo corpo a
  corpo com nomes diferentes de arma. Registrado como `docs/pendencias/H-arremesso.md` H7, novo.
- **6d.** O relatório regenerado traz uma nota explícita sobre o viés de lado esperado cair
  depois do conserto do item 3 (a coluna "viés" já existia; o texto novo explica o que mudou e
  por quê a comparação com o "antes" não é possível a partir só deste arquivo, já que a rodada
  anterior media os cenários V1/V2/V3 e não a regra viva).
- **6e.** AINDA NÃO RODADO com `--n 1000`: rodei só com `--n 20` (`node scripts/sim/calibrar.mjs
  --n 20 --saida ../tmp/executora/15-teste.md`) para validar que a reescrita gera as 8 seções sem
  erro e que os números fazem sentido (conferido à mão: força/tentativa == força/Tick quando os
  dois lados usam a mesma arma; force/Tick correndo para valores mais extremos que
  força/tentativa quando Armas enfrenta Briga, na direção certa). `node scripts/sim/calibrar.mjs
  --teste` verde (3 asserções manuais mais 2 pontos de concordância, ajustados para incluir a
  Centelha do alvo no piso). A regeneração final com `--n 1000` fica para o momento do commit
  (junto com o item 2, que ainda está represado), porque regenerar agora e de novo depois que a
  fixture do item 2e for decidida seria bateria em dobro sem necessidade.

Achado à parte, sem gravidade: o helper `qex` já estava sem uso ANTES desta rodada (não é
código que a reescrita deixou órfão); não mexi nele.

