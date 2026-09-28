# Reforma da Centelha, Briga, consertos e fichas de referência · relato da Executora

Despacho: `docs/simulacao/caixa/reforma-centelha-briga-despacho.md` (commit `060bfc26`).

## Fase 1 · Regra da Centelha · FEITA

**A fórmula nova**, `centelhaNaJogada(centelha, habilidade) = 2 × min(centelha, habilidade)`,
mora em `src/lib/calc.ts` (exportada) e foi reimplementada (mesma conta, arquivos que não podem
importar TS compilado) em `scripts/lib-bestiario.mjs` (o gerador do bestiário) e
`scripts/test-kael.mjs` (a regressão que roda sem bundler). `centelhaSoAtributo(centelha)`
existe ao lado, para a regra provisória (item 1, "jogada só de Atributo"), registrada como
pendência abaixo.

**Arquivos tocados, item por item:**
- **calc.ts**: `defesa`, `defesaMental`, `defesaSocial` (Habilidade já vinha nos parâmetros,
  só troquei o termo de Centelha), `ataqueCentelha` (ganhou um segundo parâmetro,
  `habilidade`, obrigatório agora).
- **combate-resumo.ts**: `ataqueCentelha(C, habilArma)` no lugar de `ataqueCentelha(C)`; dano
  ganhou `+ C` na expressão fixa (`danoAp = forcaAp + C`).
- **ficha-engine.ts**: os três call-sites de `ataqueCentelha` (mão hábil, mão inábil na dupla)
  ganharam a Habilidade; `+ C` em todas as versões de `ap` (`versoes`, `inabilAp`).
- **lance.ts**: `EntradaLance.atacante` ganhou `centelha`; `quaseAcertoDoEncontro` agora soma a
  Centelha do atacante ao raspão (além de descontar a do alvo, que já valia desde 27/09).
- **grid.astro**: os dois construtores de `EntradaLance` (`qaEncontro`, `entradaDoLance`)
  passaram a mandar `atacante.centelha` (lido de `ra?.centelha`, o RESUMO do atacante, mesmo
  campo que o item 4 da rodada anterior já tinha acrescentado a `ResumoCombate`).
- **motor.mjs**: `entrada.atacante.centelha` lido de `c.centelha` (a peça já carrega desde a
  rodada anterior).
- **artes-grid-mesa.ts**: `morder()` (o dano de cada pulso de Arte) ganhou
  `+ centelhaConjurador` (lido de `ctx.resumo[ef.conjurador_id]?.centelha`).
- **regras.json**: `quaseAcerto.porClasseArmadura.media.reducao` 4→3, `.pesada.reducao` 6→5
  (`bonus` sem mudança, conferido igual ao pedido).
- **lib-bestiario.mjs**: as MESMAS quatro fórmulas (defesa/defesaMental/defesaSocial/ataque) e
  o dano (`+C`) do bestiário, que eram uma reimplementação PARALELA já usando o
  `centelhaMult` antigo (achado nesta rodada: não estava no despacho original nem na
  conferência prévia, mas é exatamente o padrão "dois lugares decidem a mesma conta" que já
  apareceu nas duas rodadas anteriores).

**Item 2 (Dificuldade de jogada contra efeito, Afogar/Maremoto): SEM CÓDIGO PARA TOCAR.**
Procurei em `artes-grid-mesa.ts`, `efeitos.json` (os verbetes de Afogar e Maremoto) e
`regras.json`: não existe nenhuma implementação automática dessa jogada de resistência hoje:
é um cálculo que o mestre faz à mão na mesa, sem caminho de código. A fórmula fica registrada
aqui e em `centelhaNaJogada`/`centelhaSoAtributo` (a mesma conta serve), para quando/se essa
jogada ganhar automação; não há nada a testar ou regenerar.

**Item 5, a pendência do `quase-acerto.ts` (achado do Arquiteto, confirmado): NÃO DECIDI, NÃO
TOQUEI.** `quaseAcerto()` em `src/lib/quase-acerto.ts:187-199` continua sem termo de Centelha
nenhum (nem do atacante, nem do alvo): ela é usada pelos cards de ficha fora de combate, sem
alvo real, e mudar a assinatura dela é decisão de regra que o despacho não cobre. Registrado
como pendência, como pedido; não a resolvi.

**Item 8 (bestiário): achado sistêmico, não uma lista de exceções.** Rodei um script
descartável (`scripts/sim/_tmp-faltando.mjs`, apagado) conferindo as 309 fichas de
`src/data/bestiario/` contra os campos que a fórmula nova precisa. **309 de 309 fichas não têm
bloco `pericias` NENHUM** (`b.pericias === undefined`, não é um valor 0 escrito, é o campo
inteiro ausente). Isso significa que, hoje, a fórmula `2×min(Centelha,Habilidade)` sai **0 em
toda Defesa/ataque de criatura**, não porque a Centelha não valha para elas, mas porque a
Habilidade que a limitaria nunca foi gravada: a régua de combate das 309 fichas usa só
Atributo (+ um flat da arma), nunca perícia. Não inventei valor nenhum: a fórmula lê `pe.esquiva
|| 0` como sempre leu, e o resultado (bônus de Centelha zero em toda criatura) é uma
CONSEQUÊNCIA visível da ausência, não um erro escondido. Isto é um achado grande demais para
recalibração isolada, e confirma a nota do próprio despacho ("a recalibração do bestiário é
outro trabalho") e fica registrado aqui com a contagem exata para quem for abrir essa frente.

**Achado a mais, duas fórmulas INVERSAS que pararam de ser exatas.** A fórmula nova não é
invertível sem saber a Habilidade de antemão (o `min()` esconde se o termo foi capeado pela
Centelha ou pela própria Habilidade). Duas funções fazem essa inversão e ficaram só
APROXIMADAS, documentado no próprio código:
- `periciasDe()` (`scripts/lib-bestiario.mjs`, gera `inimigos.json`): deriva Esquiva/
  Integridade/Sociabilidade a partir da Defesa/Defesa Mental/Defesa Social publicadas. Não
  toquei a fórmula (mudar a conta ali é decisão de regra sobre COMO aproximar, que o despacho
  não cobre), mas registro que ela está lendo o termo de Centelha do jeito ANTIGO
  (`centelhaMult` linear) e por isso vai ficar levemente errada quando o termo novo for
  capeado. **Na prática não mudou nada agora**, porque nenhuma das 309 fichas tem `pericias`
  escrito (achado acima): a Esquiva/Integridade/Sociabilidade que ENTRAM na fórmula de verdade
  já são 0 hoje, e min(Centelha,0)=0 nos dois formatos, então a mesma ausência que zera o bônus
  também torna a inversão inofensiva por ora.
- `desEsqDaDefesa()` (`src/lib/artes-grid.ts`, o desvio de área contra Artes): esta EU
  atualizei, porque um teste (`test-artes-grid.mjs`) já cobrava o valor e ficou vermelho.
  Escolhi a aproximação "assume Esquiva ≥ Centelha" (usa o termo cheio, 2×Centelha, não
  capeado): quando a suposição for falsa, o número sai um pouco ALTO, nunca negativo, e o teto
  de 12 continua batendo em todo o bestiário (conferido: `fora.length === 0`). Documentado no
  próprio código como aproximação, não como fórmula exata.

## O BUG REAL que a Fase 1 escancarou (achado, não pedido, mas corrigido)

Ao testar `npm run espelho` com a Reforma aplicada, `1v1-unissono` (dois `escudeiro` se
enfrentando) ficou vermelho: a Vida do lado `a0` na MESA parava de descer depois do primeiro
golpe, enquanto o LAÇO continuava baixando normalmente. Isolei por bissecção (revertendo um
arquivo de cada vez com `git stash push -- <arquivo>`) até achar a causa em
`src/pages/mesa/grid.astro`.

**O achado**: o item 2c da rodada anterior ("o acerto nunca dói menos que o raspão do mesmo
golpe") só tinha sido aplicado na PRÉVIA (`contaDoLance`/`pintarDano`, a caixa que o mestre vê
antes de confirmar). O valor de dano que REALMENTE ia para `aplicarDano` (e dali para
`baixarVida`, a escrita de verdade) vinha de uma conta SEPARADA
(`Math.max(0, rdDanoFim.total)`, dentro do `fim()` que fecha a folha), sem o piso nenhum. Ou
seja: **o piso do item 2c nunca valeu no jogo de verdade**, só na tela: um bug da rodada
anterior (já com veredito PROCEDE da Revisora), que só ficou grande o bastante para o espelho
notar agora, porque a Centelha do atacante somando ao raspão (item 5 desta rodada) aumentou o
piso o suficiente para ele discordar do dano rolado com frequência.

**O conserto**: `fim()` agora devolve um campo `piso` (o `danoQA()` da prévia, só no acerto
normal; no raspão o próprio `dano` já É o piso, e não precisa de mais nada); os dois
call-sites de `aplicarDano` passam esse `piso` adiante; `aplicarDano` aplica
`Math.max(opts.piso || 0, bruto - s, 0)` no lugar de `Math.max(0, bruto - s)`.

**Controle negativo, feito e desfeito**: revertendo só a linha do `Math.max` em `aplicarDano` (a
peça central do conserto), `1v1-unissono` volta a ficar vermelho nas duas sementes padrão;
restaurando, fecha limpo. `npm run espelho` inteiro (16 células + a `1v1-fatal-simultaneo` da
rodada anterior) fecha sem divergência.

## Item 9 (fixture): 0 lances afetados, mesma razão estrutural de antes

`node scripts/test-lance.mjs`: **0 divergências**, 58 asserções (56 da rodada anterior mais 2
novas, assinaladas "Reforma da Centelha", testando a soma do lado do atacante em
`quaseAcertoDoEncontro`: `resolverGolpe` não lê `atacante.centelha` diretamente, só
`quaseAcertoDoEncontro` lê, e por isso a cobertura sintética dela bastou). A fixture
(`scripts/fixtures/lances.jsonl`) guarda `entrada.atacante.ataque` como STRING JÁ CONGELADA e
`entrada.danoQA` como valor já calculado no dia da coleta: nenhum dos dois se recalcula a
partir da ficha ao rodar o replay, então uma mudança de FÓRMULA (como toda a Fase 1) não tem
como aparecer no replay de um registro antigo, a mesma limitação estrutural que a rodada
anterior já tinha identificado para os itens 2a/2b. Não há nada para versionar ou propor nesta
rodada: zero é o número certo, não um zero por acidente.

## Fase 4 · já estava coberta

Os três itens da Fase 4 batem exatamente com os três consertos já fechados no despacho anterior
(`docs/simulacao/caixa/bancada-tres-consertos-despacho.md`, commit `de35d9c2`, ainda aguardando
veredito da Revisora quando este despacho chegou): força por Tick com o ciclo pós-ajuste,
`atributo+1-destreza-espada` de volta à seção E, e o teto de Pressão confirmado ligado (com
distribuição real provando que ele só não é alcançado nesta cena). Não refiz nada; só confirmo
aqui, como pedido.

## Verificação da Fase 1

- `npx tsc --noEmit`: limpo.
- `npm run validate`: verde (precisou de `node scripts/gen-bestiario.mjs` depois da mudança de
  fórmula, e de duas rodadas de `node scripts/reapontar.mjs`: a primeira ficou com citações
  quebradas por ter rodado ANTES do conserto do bug do piso, que moveu mais linhas; corrigido
  revertendo os documentos ao commit e reapontando uma vez só, depois de todo o código da fase
  estar pronto).
- `npm run build`: 111 páginas.
- `npm run espelho`: 17 células (as 16 de sempre + `1v1-fatal-simultaneo`), zero divergência.
- Travessão: zero nas linhas novas (conferido por `git diff` + `grep`, não por `git diff` puro).

## Pendências registradas (Fase 1, sem resolver)

- Jogadas só de Atributo: `+1 × Centelha` (a regra provisória do item 1), implementada em
  `centelhaSoAtributo` mas sem caminho de código nenhum a chamando ainda (não há jogada
  identificada no motor que seja "só Atributo" hoje).
- `quase-acerto.ts`'s `quaseAcerto()`: decisão sobre incluir a Centelha do alvo, não tomada.
- O bestiário inteiro (309/309 fichas) sem bloco `pericias`: o bônus de Centelha em jogada/
  Defesa de criatura sai 0 até essa frente ser aberta.
- `periciasDe()` (inimigos.json): a inversão usa o termo de Centelha linear antigo; inofensivo
  hoje (nenhuma ficha tem pericias), mas ficaria errado se alguma ganhasse.

Continuando para a Fase 2 (livro e página do Mestre) em seguida, na mesma sessão, com commit
separado ao fim dela.
