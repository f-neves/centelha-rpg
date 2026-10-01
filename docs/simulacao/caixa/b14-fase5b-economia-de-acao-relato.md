# B14 Fase 5b (economia de ação na bancada de desafio) · relato

01/10/2026. Despacho: `docs/simulacao/caixa/b14-fase5b-economia-de-acao-despacho.md`. Segue
a Fase 5, fechada em `7993cffc` (`docs/simulacao/caixa/b14-fase5-diagnostico.md`). Nenhuma
ficha nem regra mudou nesta rodada; tudo dentro de `scripts/sim/desafio-bancada.mjs`.

## 1 · Rajada e empunhadura dupla, implementadas pela régua escrita

Linhas de `src/content/chapters/combate.md` usadas: **Rajada**, `:137-155` (vários golpes
com a MESMA arma, corpo a corpo, −1d6 acumulativo por golpe extra, +2 de Velocidade por
golpe extra, teto por classe); **empunhadura dupla**, `:157-173` (um ataque por mão, as
duas a −1d6, mesma Velocidade); **Guarda sob pressão**, `:405` (preço da exposição, ver
item abaixo). Os números exatos (`−1d6`, `+2` por golpe, o teto por classe, o `−2` por
ataque recebido) vêm de `regras.json → combate.rajada/dupla/escada`, não digitados à mão:
usei as funções que `src/lib/combate-tempo.ts` já expõe (`anatomia`, `tetoDaRajada`,
`cicloExtraDaDupla`), não reimplementei a conta.

**Escolha por dano esperado:** cada opção (golpe simples, Rajada de 2..teto golpes, dupla
quando disponível, poder, Arte) entra na mesma comparação de dano esperado da Fase 5
(convolução exata dos dados), agora somando o dano de TODOS os golpes da manobra. Conferi
o cálculo contra o `resolverGolpe` de verdade: Rajada de 3 golpes, Pers.1 Centelha 3 contra
o filhote, exato = 19,50 de dano esperado total; simulado (N=5.000 sequências de 3 golpes)
= 19,56. Bate dentro do ruído de amostra.

### Pers.2 e a Rajada: a divergência registrada, não inventada

Como o próprio despacho pede: **segui a regra escrita**, não o pedido literal do item 1.
A Rajada é corpo a corpo (`:140`, `regras.json → combate.rajada.corpoACorpo: true`), e o
código de `L0.anatomia` já força `golpes=1` quando a classe é `distancia`. O Pers.2 (arco)
fica sem Rajada E sem dupla (o arco ocupa as duas mãos). Nenhuma persona desta bancada tem
dupla disponível, de resto: Pers.1 leva um broquel na mão inábil (não uma segunda arma),
Pers.4 vai com a mão inábil vazia. Só a Rajada entra para Pers.1/Pers.4, quando a arma
permitir (espada-longa e adaga, ambas corpo a corpo, teto 3 golpes cada).

### Criatura com garras = duas armas naturais

A ficha do bestiário não separa mordida de garra (um só `ataques[0]`, "Garras e
mordida"), diferente do que o despacho supõe ("se a ficha tem mordida E duas garras").
**Interpretação, registrada aqui**: Rajada e dupla da criatura reusam o MESMO perfil de
`ataques[0]`, repetido (dois ou três golpes idênticos, cada um com seu próprio acerto e
dano), em vez de inventar um segundo perfil que a ficha não tem. É a leitura mais próxima
de "duas armas naturais, uma por pata" dado o dado disponível.

### Guarda sob pressão: implementada, porque ainda não existia

**Conferido primeiro, como pedido**: `rolarContraDefesa` hardcodeava `defesaPerdida: 0`
sempre, em TODA rodada da Fase 5 inteira. Não existia Guarda sob pressão nenhuma até
agora. Implementada seguindo o que `src/lib/combate-tempo.ts`/`grid.astro` já fazem de
verdade (não o texto solto, que fala em "faz ou recebe"): **só o ataque RECEBIDO conta**
(`pressao: (base.pressao||0)+1` em `resolverContra`/`tirarDaAgenda`, nunca somado em quem
ataca). A bancada agora soma 1 de pressão no alvo a cada golpe que ele recebe (acerto,
raspão ou erro, sem distinção, igual ao motor da mesa), zera a pressão de quem AGE no
momento em que age (mesmo gatilho de `declarar()`, `pressao: 0`), e aplica `pressão × −2`
como `defesaPerdida` na Defesa do alvo (`regras.json → combate.escada.pressaoPorAtaque`).

**Isto mudou TODO resultado desta rodada** (não é uma correção isolada: a matriz inteira
rodou de novo com ela ligada, porque ela não existia antes). Pesa mais em dois lugares: um
alvo que já levou vários golpes no mesmo turno (Rajada/dupla contra ele, ou vários membros
de um bando) fica mais fácil de acertar nos golpes seguintes DENTRO do mesmo ciclo, e
continua mais fácil até a própria próxima ação dele. É o preço que o texto da dupla cita
(`:171`) e que sem ele a Rajada/dupla sairia de graça, como o despacho avisou.

### O +2 de Velocidade da Rajada, convertido em turnos

A bancada usa turno = 6 Ticks (mesma convenção das rodadas anteriores). `L0.anatomia`
devolve o ciclo em Ticks (ex.: espada-longa simples = 5 Ticks; Rajada de 3 golpes = 10
Ticks, uma diferença de +4 pelos dois golpes extras). Essa diferença vira `atrasoTicks`
em quem usou a Rajada; a cada turno, `atrasoTicks -= 6` (o relógio passa pra todo mundo);
enquanto `atrasoTicks > 0` no início do turno dessa peça, ela NÃO age (pula a vez), sem
zerar a própria pressão (que só zera "quando você age"). A dupla não soma atraso nenhum:
`cicloExtraDaDupla(classe,'normal') = 0` pra toda classe (`regras.json →
combate.dupla.cicloExtraNoNormal`), a régua confirma "mesma Velocidade" também no número,
não só na prosa.

**Não uso o alívio de −4 para −2** no Tick do Golpe (`combate.md:95-96`, empunhar duas
armas e golpear só com uma): é uma regra do sistema de Ticks (P/G/R), e esta bancada nunca
modelou Preparo/Golpe/Recuperação por fase (é turno simples desde a Fase 5). Registrado
como não usado, não como esquecido.

## 2 · Filhote, Jovem e Adulto: A1/A2 × base(B2)/B1

Base nova = B2 (Pers.1 sem Proezas de Defesa, sem Vontade na Defesa dele): **conferido
exatamente como a Fase 5 tinha**, só essas duas coisas saem; Pers.1 mantém as Proezas de
ATAQUE, e Pers.2/Pers.4 mantêm as deles (ataque e defesa), sem mudança nenhuma. B1 (com
as duas coisas de volta) é a variante de sensibilidade agora, invertendo o papel das duas
células da Fase 5.

N=200 batalhas/Centelha/célula. "Desafio" = menor Centelha do grupo com vitória ≥80%.

| criatura (Centelha) | faixa do autor | A1, base(B2) | A1, B1 | A2, base(B2) | A2, B1 |
|---|---|---|---|---|---|
| Filhote (4) | 3 ou 4 | 2 ✗ | 2 ✗ | 2 ✗ | 2 ✗ |
| Jovem (5) | 5 ou 6 | **5 ✓** | 4 ✗ | **5 ✓** | 4 ✗ |
| Adulto (6) | 6 a 8 | não alcançado ✗ | **6 ✓** | não alcançado ✗ | não alcançado ✗ |

A2 não muda nada no Filhote (Habilidade real dele, 5, já é ≥ Centelha, 4: o teto do
gerador antigo não estava mordendo nele, só nas âncoras de Centelha mais alta, como a
Fase 5 já tinha achado). No Jovem e no Adulto, A2 também não muda o desafio medido nesta
bateria (só muda a chance de acerto deles, como na Fase 5).

**Leitura**: com Rajada/dupla/Guarda sob pressão, **Jovem e Adulto já alcançam a própria
faixa em pelo menos uma célula** (Jovem em A1/base e A1/A2-base; Adulto em A1/B1). **O
Filhote continua abaixo da faixa em TODAS as quatro células** (desafio 2, precisa de 3 ou
4): é o único dos três que não chega, e por isso é o único testado no item 3.

## 3 · "Ataque total" (Poder Especial de teste), só no Filhote

Variante condicional (despacho item 3): mordida e as duas garras na MESMA ação (3 golpes,
mesmo perfil repetido, sem a penalidade de −1d6 da Rajada), 1 uso a cada 3 turnos.
Implementada como opção extra na escolha por dano esperado, ligada só quando pedida
(`opts.ataqueTotal`), nunca parte da base.

| célula | desafio SEM Ataque total | desafio COM Ataque total |
|---|---|---|
| A1, base(B2) | 2 ✗ | **3 ✓** |
| A1, B1 | 2 ✗ | 2 ✗ |
| A2, base(B2) | 2 ✗ | **3 ✓** (A2 não muda nada no Filhote, ver item 2) |
| A2, B1 | 2 ✗ | 2 ✗ |

**Com "Ataque total", o Filhote entra na faixa (3 ou 4) nas duas células de base (B2)**,
continua abaixo nas duas de sensibilidade (B1, que já reduz o desafio de todo o resto por
dar mais Defesa ao Pers.1). É dado pro autor decidir se isto vira ficha (um poder natural
novo) ou fica só a confirmação de que o modelo de ação é a causa, não a criatura.

## 4 · Bando: 1 lobo, 4 lobos, 4 e 5 worgs

**Nova batalha** (`rodarBatalhaBando`, não é `rodarBatalha`): N criaturas INDIVIDUAIS (é a
definição de `maisUm`/"quantos iguais" da Fase 5, não a Regra de Horda). Política de
bancada, registrada por não estar no despacho: vitória do bando só quando as N criaturas
caem todas; toda criatura mira a persona engajada (nenhuma destas é voadora/à distância);
as personas sempre fazem foco de fogo na criatura viva mais ferida; a ordem dentro do
turno é a mesma do 1×1 (bando age, depois as personas), o que importa pra pilha de
pressão: N criaturas batendo na mesma persona empilham N pontos nela antes das personas
agirem de volta. Base nova (B2), sem variante nenhuma, como pedido.

| grupo | desafio medido | âncora do autor | bate? |
|---|---|---|---|
| 1 lobo | 0 (100% já em C0) | "não é desafio nem pro grupo C0" | **sim** |
| 4 lobos | 0 (100% já em C0) | (sem âncora específica) | | 
| 4 worgs | **2** | "4 a 5 worgs são desafio 2" | **sim** |
| 5 worgs | **2** | "4 a 5 worgs são desafio 2" | **sim** |

As três âncoras do despacho batem exatas. **Não apliquei a Regra de Horda**
(`combate.md:409`, o bando virar um esquadrão com Magnitude): é outra leitura possível,
que o próprio despacho pede pra só registrar, não aplicar.

## O que fica pendente desta rodada

- Se "Ataque total" vira ficha de verdade (poder natural) ou fica só o diagnóstico de que
  o Filhote precisa de economia de ação pra chegar na faixa: decisão do autor.
- Vontade do Pers.3/reserva de Vontade das personas: mesma suposição provisória de
  sempre (Centelha+2), sem número do autor ainda.
- Regra de Horda pro bando: registrada como não aplicada, não testada.
- Desafio acima de Centelha 6 continua fora de escopo (nenhuma das âncoras desta rodada
  precisou disso).

## Verificação

`npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho`: verdes.
Regressão conferida: 1 lobo contra o grupo Centelha 0 continua sem ser desafio (100% de
vitória do grupo), com a Guarda sob pressão e a Rajada ligadas. CI do GitHub: confirmo
job a job depois do commit, como sempre.
