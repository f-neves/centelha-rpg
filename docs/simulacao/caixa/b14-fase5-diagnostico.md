# B14 Fase 5 · diagnóstico da âncora do filhote de dragão vermelho

30/09/2026. Três passos pedidos pelo Arquiteto, nesta ordem, sem mudar ficha nenhuma.
Tudo reproduzível por `node scripts/sim/desafio-diagnostico.mjs` (passo A/B) e pelos
scripts citados (passo C).

## Passo 1 · diagnóstico: filhote de dragão vermelho vs grupo Centelha 3

### A · Ataque isolado (N=3000 golpes por direção, sem Proezas/Vontade, sem P/G/R)

| direção | acerto | raspão | erro | dano médio/golpe |
|---|---|---|---|---|
| Pers.1 (C3, `6d6 +5`+4 prz) → filhote (Defesa 4) | 100,0% | 0,0% | 0,0% | 6,5 |
| Pers.2 (C3, `1d6 −1`+6 prz) → filhote (Defesa 4) | 100,0% | 0,0% | 0,0% | 6,5 |
| Filhote (`5d6+2 +8`) → Pers.1 (C3, Defesa 33) | 5,6% | 8,7% | 85,7% | 0,4 |

PV do filhote: 40. Dano médio combinado Pers.1+Pers.2/turno: 12,9 → **~3,1 turnos até o
filhote cair**, sem levar nenhum golpe de volta que importe (0,4 dano médio/turno contra
34 PV do Pers.1 → ~94 turnos para derrubá-lo). O combate não chega nem perto de "2 dos 4
caídos": o filhote morre antes de arranhar o grupo.

### B · Isolando cada alavanca (bateria C3, n=400 por linha, ficha real como base)

Linha de base (ficha real, sem alteração): vitória do grupo **100,0%** [99,0%;100,0%],
3,5 turnos médios até resolver.

| alavanca | valor testado | vitória do grupo | turnos médios |
|---|---|---|---|
| Defesa | 4 (real) | 100,0% | 3,5 |
| Defesa | 10 | 100,0% | 3,8 |
| Defesa | 15 | 100,0% | 5,8 |
| Defesa | 19 | 100,0% | 6,6 |
| Defesa | 24 | 100,0% | 6,8 |
| PV | ×1 (40, real) | 100,0% | 3,5 |
| PV | ×1,5 (60) | 100,0% | 5,1 |
| PV | ×2 (80) | 100,0% | 6,6 |
| PV | ×3 (120) | 100,0% | 9,7 |
| Absorção | +0 (real) | 100,0% | 3,5 |
| Absorção | +4 | 100,0% | 6,1 |
| Absorção | +8 | 100,0% | 7,0 |
| Absorção | +12 | 100,0% | 7,0 |
| Ataque | +0 (real) | 100,0% | 3,5 |
| Ataque | +5 | 100,0% | 3,5 |
| Ataque | +10 | 100,0% | 3,5 |
| Ataque | +15 | 100,0% | 3,5 |

**Nenhuma das quatro alavancas, sozinha, tira o grupo de 100% de vitória dentro da faixa
testada.** Isso não é teto do teste: repeti só a Defesa numa faixa maior (fora da tabela
acima, registrado à parte) e achei o ponto onde ela muda alguma coisa:

| Defesa | vitória do grupo | turnos médios |
|---|---|---|
| 4 (real) | 100,0% | 3,6 |
| 19 | 100,0% | 6,6 |
| 25 | 100,0% | 6,9 |
| 30 | 100,0% | 9,7 |
| 35 | 100,0% | 34,5 |
| **40** | **0,0%** | **censura total (60 turnos, ninguém cai)** |
| 50 | 0,0% | censura total |

**A transição é um degrau, não uma rampa.** Isso é uma propriedade do sistema de dados
(um bolo de Nd6+flat tem um teto de rolagem): abaixo do teto do pool do grupo, o acerto é
praticamente garantido; acima dele, vira impossível, e a batalha nunca resolve (censura).
Não existe uma Defesa "um pouco mais difícil de acertar" nesta régua: ou a Defesa está
dentro do alcance do pool do atacante, ou está fora dele.

**Isolando PV/Absorção/Ataque, nada muda a vitória porque o tempo não é o fator
limitante: o grupo mata o filhote rápido demais (3,5 a 9,7 turnos) para o contra-ataque
dele (5,6% de acerto, 0,4 dano médio/turno) ter chance de fazer diferença.** Fortalecer a
ofensiva do filhote sem fortalecer a Defesa dele não muda nada, porque ele já está sendo
destruído antes de essas rodadas de ataque se acumularem.

## Passo 2 · tabela comparativa das âncoras

Defesa/PV/Absorção de `monsters-mesa.json` (`combate.*`); Habilidade de combate lida da
ficha-fonte (`src/data/bestiario/*.json`). "Pers.1 equivalente" é o Pers.1 (corpo a corpo)
da MESMA Centelha da criatura: **âncoras acima de Centelha 6 não têm Pers.1 real** (a
régua de personas só vai até 6, por desenho do despacho): nesses casos a coluna usa o
Pers.1 de Centelha 6 (o teto), marcado com `*`. "Acerto" é a chance do ataque BÁSICO da
criatura acertar esse Pers.1 (N=1500 golpes, sem Proezas/Vontade de nenhum dos dois lados).

| criatura | Centelha | Força/Destreza | Esquiva | Integridade | Defesa | PV | Absorção (I/C/P) | Pers.1 eq. Defesa | acerto da criatura |
|---|---|---|---|---|---|---|---|---|---|
| Lobo | 0 | 3/4 | 1 | 2 | 10 | 37 | 4/2/2 | 16 | 0,0% |
| Worg | 1 | 5/4 | 1 | 3 | 12 | 34 | 4/2/2 | 22 | 2,5% |
| Filhote dragão vermelho | 4 | 6/2 | **0** | 4 | 4 | 40 | 9/6/6 | 36 | 0,9% |
| Dragão vermelho jovem | 5 | 9/3 | 1 | 3 | 10 | 54 | 11/10/10 | 40 | 8,7% |
| Dragão vermelho adulto | 6 | 11/2 | **0** | 5 | 4 | 80 | 15/14/14 | 43 | 13,5% |
| Dragão vermelho ancião | 7 | 14/2 | **0** | 6 | 4 | 95 | 18/19/19 | 43* | 50,1% |
| Kraken | 7 | 14/2 | **0** | 6 | 4 | 110 | 20/23/23 | 43* | 50,9% |
| Balor | 9 | 11/8 | 2 | 8 | 24 | 78 | 21/17/17 | 43* | 12,5% |
| Diabo do Fosso | 9 | 12/9 | 3 | 8 | 30 | 74 | 20/16/16 | 43* | 24,3% |
| Solar | 9 | 10/6 | 2 | 8 | 20 | 70 | 19/16/16 | 43* | 5,9% |
| Tarrasca | 10 | 16/2 | **0** | 4 | 4 | 115 | 24/27/27 | 43* | 75,3% |

**O padrão salta aos olhos:** toda criatura com Destreza baixa (2) tem Esquiva **0** e
Defesa **4** (filhote, adulto, ancião, Kraken, Tarrasca: cinco das onze âncoras), e são
exatamente as únicas com Defesa nesse patamar. As três planares (Balor, Diabo do Fosso,
Solar), com Destreza 6 a 9, têm Defesa 20 a 30, na faixa do Pers.1. Não é um problema do
bestiário inteiro: é um problema de UM ARQUÉTIPO (o réptil/fera grande, força alta e
destreza baixa), e ele bate exatamente com a suspeita do autor sobre o gerador antigo
(Destreza ÷ 3 → Destreza 2 vira Esquiva 0).

**O segundo padrão, novo neste levantamento:** mesmo as criaturas com Defesa "normal"
(Balor 24, Solar 20) acertam o Pers.1 equivalente pouco (12,5%/5,9%), porque a Defesa do
Pers.1 cresce MUITO rápido com a Centelha (16 em C0 → 22 em C1 → 36 em C4 → 43 em C6, pela
fórmula `(Destreza+Habilidade)×2 + 2×min(Centelha,Habilidade) + Proezas`). **Nenhuma das
onze âncoras acerta o Pers.1 de Centelha 6 mais de 76% das vezes** (a Tarrasca, a mais
precisa da lista, com pool `10d6+2 +10`). Isso sugere que a régua de Defesa do grupo pode
estar calibrada alto demais para QUALQUER criatura deste bestiário bater com folga, não só
as de Esquiva 0: mas não tirei essa conclusão sozinha: é uma leitura possível dos números
acima, para o Arquiteto/autor decidir.

## Passo 3 · Esquiva-para-metade implementada pela regra escrita

**Implementado** (`scripts/sim/desafio-bancada.mjs`, commit a seguir): poder natural e
Arte ofensiva de "dano e projéteis" (`regras.json → arcano.resistencia.tipos`) não usam
mais o bolo de ataque físico da criatura. Pela regra escrita, um efeito NÃO MIRADO não tem
rolagem de conjuração: resolve pela **Dificuldade fixa do Efeito (nível × 4)** contra a
Defesa passiva do alvo, passando pelo MESMO `resolverGolpe`/quase-acerto de sempre (então
continua havendo raspão, que é a "metade" mais próxima que a régua atual sustenta: não
inventei uma segunda régua de "sempre metade, nunca zero" paralela a essa, porque a regra
citada usa a mesma Defesa/quase-acerto de um ataque físico, só sem o bolo rolado).
Resultado prático no filhote: o sopro (nível 2) agora testa Dificuldade 8 em vez do pool de
mordida `5d6+2+8`, e sai MAIS fraco contra Defesa alta (o pool antigo tinha teto maior que
8). Rodei a curva de novo depois do conserto: ainda 100% de vitória do grupo de C1 a C4 (só
C0 mudou, de 0% para 62,5%, porque o próprio sopro do filhote passou a acertar menos o
grupo em C0 também). **Não resolve a âncora**: confirma o que o Passo 1 já mostrava: o
gargalo é o corpo a corpo do grupo contra a Defesa/PV da criatura, não o sopro.

### Proposta de `area` para os sopros (pendência de dado, NÃO gravada nos JSONs)

Nenhum dos quatro sopros de dragão vermelho (`sopro-de-fogo`, filhote/jovem/adulto/ancião)
tem `area` na ficha hoje. Fonte: PF1 (regra padrão de alento de dragão por categoria de
idade, cone ou linha, a mesma fonte do CR já usado nesta Fase 4). Conversão simples pé→
metro (×0,3048, arredondado), **não** o fator "ft÷10" da calibração de deslocamento (que é
outra conta, para outro propósito):

| criatura | categoria PF1 aproximada | cone (pés → m) |
|---|---|---|
| Filhote de dragão vermelho | jovem (young) | 30 pés → **9 m** |
| Dragão vermelho jovem | adulto jovem (young adult) | 50 pés → **15 m** |
| Dragão vermelho adulto | adulto (adult) | 60 pés → **18 m** |
| Dragão vermelho ancião | velho (old) | 80 pés → **24 m** |

Pela regra que o Arquiteto deu (área ≥10 m atinge os 4; menor, só o engajado), isto faria o
filhote continuar "só o engajado" (9 m, abaixo do limiar) e os outros três passarem a
atingir o grupo inteiro. Registrado como pendência de dado (a decidir se entra nas fichas),
não apliquei em nenhum JSON.

## O que fica para o Arquiteto decidir

Não decidi nada disto sozinha, conforme pedido:

1. **Se a Esquiva 0/1 de 275 das 309 fichas (gerador antigo) é para corrigir, e com que
   critério**, já que ela sozinha explica a Defesa baixa de 5 das 11 âncoras.
2. **Se a régua de Defesa do grupo de referência (que cresce até 43 em C6, e já bate só
   16 em C0) é a esperada para o desafio**, dado que nenhuma das onze âncoras passa de 76%
   de acerto contra o Pers.1 de Centelha 6, mesmo as de Defesa "normal" (Balor, Solar).
3. **Se o `area` proposto acima entra nas quatro fichas de dragão** (ou fica só registrado
   aqui até uma rodada própria de dados).

Não rodei mais nenhuma âncora depois disto, como pedido.

## 30/09/2026, segunda rodada · decisão do autor: Esquiva 0 é fiel à fonte

O autor decidiu: Esquiva 0 no bicho grande não é bug nem limite da bancada, é o jogo real
(no PF1 a armadura natural protege via Absorção, não via Defesa). O desafio destes bichos
tem de vir de PV, Absorção e dano devolvido. Três pedidos, sem mudar ficha, isolados um de
cada vez.

### 1 · filhote vs grupo Centelha 3, com Absorção já aplicada

| | dano médio/turno | PV | turnos até cair (estimado) |
|---|---|---|---|
| Grupo (Pers.1+Pers.2 golpeando) | 13,0 (6,5+6,5) | 40 (do filhote) | ~3,1 |
| Filhote (só no engajado) | 0,4 | 34 (do Pers.1) | ~94 |

Bateria de 400 batalhas completas (não só a estimativa por golpe): **3,54 turnos médios
até resolver, 0,00 personas caídas em média, e ZERO das 400 batalhas teve qualquer persona
caída no fim.** O grupo nunca chega nem perto de perder 1 dos 4, quanto mais 2.

### 2 · três variações isoladas (uma de cada vez), curva de Centelha 0 a 6 (n=150/célula)

| variação | C0 | C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|---|---|
| (base, ficha real) | 77% | 100% | 100% | 100% | 100% | 100% | 100% |
| PV ×1,5 (60) | 6% | 100% | 100% | 100% | 100% | 100% | 100% |
| PV ×2 (80) | 0% | 97% | 100% | 100% | 100% | 100% | 100% |
| Absorção +3 | 0% | 88% | 100% | 100% | 100% | 100% | 100% |
| Absorção +6 | 0% | 3% | 100% | 100% | 100% | 100% | 100% |
| Mordida +1d6 (2d6+10) | 53% | 100% | 100% | 100% | 100% | 100% | 100% |
| Sopro, área 9 m (em vez de só engajado) | 77% | 100% | 100% | 100% | 100% | 100% | 100% |

**Nenhuma das três variações pedidas chega perto do desafio 3 ou 4.** A melhor
(Absorção +6) empurra o desafio de C1 para C2, e nada mais. Fui além do pedido para medir
o TAMANHO da alavanca que faltaria: testei Absorção até +20 (mais de triplicar a Absorção
original) e PV até ×8 (320 PV): **nenhuma das duas, sozinha, passa de C2.**

| variação extra | C0 | C1 | C2 | C3 |
|---|---|---|---|---|
| Absorção +10 / +15 / +20 | 0% | 3% | 100% | 100% |
| PV ×4 (160) | 0% | 0% | 100% | 100% |
| PV ×8 (320) | 0% | 0% | 79% | 100% |

(O "sopro com área real" não mudou nada porque 9 m fica abaixo do limiar de 10 m da regra
de área; refiz o teste FORÇANDO a área a atingir os 4 personagens mesmo com 9 m, só para
medir o teto do que a área pode valer: resultado idêntico ao da tabela, porque o sopro
continua sendo um só disparo a cada ~4 turnos, e o corpo a corpo do grupo já resolve a
batalha antes disso pesar.)

**Leitura dos números:** em C2 e acima, o grupo sozinho já teria dano suficiente para
vencer batalhas com um filhote de PV/Absorção MUITO acima do que qualquer ajuste razoável
de ficha daria (320 PV é 8× o real). Isso não é mais sobre o filhote: é sobre o quanto a
ofensiva do PRÓPRIO GRUPO escala rápido com a Centelha (ver a Defesa do Pers.1 crescendo
de 16 em C0 a 43 em C6, já levantado na rodada anterior: o ataque cresce no mesmo ritmo).

### 3 · razão PV/dano · fonte (PF1) vs Centelha

**Lado Centelha** (dado exato, direto da ficha e do `monsters-mesa.json`; PV do Pers.1 é
fixo em 34 em toda Centelha, pela convenção da bancada):

| criatura | Centelha | PV criatura | PV/PV(Pers.1) | dano médio/rodada | dano/PV(Pers.1) |
|---|---|---|---|---|---|
| Filhote | 4 | 40 | 1,18 | 13,5 | 0,40 |
| Jovem | 5 | 54 | 1,59 | 21,0 | 0,62 |
| Adulto | 6 | 80 | 2,35 | 27,5 | 0,81 |
| Ancião | 7 | 95 | 2,79 | 31,5 | 0,93 |

**Lado fonte (PF1): não tenho os números confiáveis para completar esta coluna.** Não
tenho acesso a um livro de regras PF1 nesta sessão, e não vou inventar PV/dano de dragão
"de memória" travestido de dado: seria exatamente o tipo de número fabricado que este
projeto pede para nunca assumir. O que dá para calcular sem chutar é o lado "guerreiro":
PV de um guerreiro PF1 de nível = CR, pela fórmula padrão de HP de Fighter (d10, +2 de
Vigor, máximo no nível 1): `10 + 2 + (nível−1) × 7,5`.

| criatura | CR (fonte.cr) | PV guerreiro equivalente (fórmula) |
|---|---|---|
| Filhote | 6 | ~50 |
| Jovem | 10 | ~80 |
| Adulto | 14 | ~110 |
| Ancião | 19 | ~147 |

Isto é só a fórmula do guerreiro; falta o PV e o dano por rodada do PRÓPRIO DRAGÃO na
fonte para fechar a razão pedida. Se isto for necessário para a decisão, peço que o autor
(que já tem o PF1 Bestiary aberto para o resto desta Fase 4) passe os quatro números de PV
e dano por rodada da fonte, e eu completo a tabela e as razões na hora.

## O que fica para o Arquiteto/autor decidir, nesta segunda rodada

1. Confirmado pelos três testes: **nenhuma correção isolada e razoável em PV, Absorção ou
   dano do filhote chega ao desafio 3-4**; a causa dominante é o quanto a ofensiva do
   PRÓPRIO GRUPO de referência escala com a Centelha, não uma característica do filhote.
2. Falta decidir se querem os números de PV/dano do PF1 real para fechar a razão do item 3
   (eu completo assim que tiver), ou se a comparação só com o "guerreiro equivalente" já
   basta.

Não ajustei nada, não rodei mais nenhuma âncora. Parei aqui, como pedido.

## 30/09/2026, terceira rodada · decomposição pedida pelo autor (nenhum achado anterior aceito ainda)

Um bug real achado no caminho, antes de qualquer outra coisa: **`tipoDano` do ataque
básico de toda criatura estava sempre caindo em "impacto"**, porque eu usava
`tipoDaExpressao()` (lê só o sufixo `"(C)/(I)/(P)"` que as fichas de PC escrevem) na string
de dano do bestiário, que escreve o tipo por extenso ("perfurante"). Corrigido lendo
`ficha.ataques[0].tipo` direto (a fonte real do dado), mapeado para o vocabulário de
`soak`. Isso mudou a Absorção usada contra toda criatura em todo teste anterior (geralmente
para MENOS Absorção, porque `perfuracao` costuma ser menor que `impacto` nas fichas de
persona): o filhote, por exemplo, passa a bater 9,5 de dano líquido médio por acerto contra
qualquer persona (antes saía 4,5 a 6,5, dependendo da persona, com a Absorção errada).
Reflete nos números abaixo.

### 1 · filhote vs grupo C3

**(a) Chance de ACERTO por jogada** (Pers.1, pool `6d6 +5`+4 prz, N=3000/linha, contra
Defesa fixa, sem rolar dano):

| Defesa do alvo | acerto | raspão | erro |
|---|---|---|---|
| 4 | 100,0% | 0,0% | 0,0% |
| 10 | 100,0% | 0,0% | 0,0% |
| 20 | 98,8% | 0,9% | 0,2% |
| 30 | 44,7% | 18,2% | 37,1% |
| 35 | 8,9% | 11,3% | 79,8% |
| 40 | 0,4% | 1,6% | 98,0% |

**Isto corrige a leitura anterior: por JOGADA, a curva é uma rampa, não um degrau** (cai de
forma gradual de 100% a 0,4% entre Defesa 20 e 40). O que parecia degrau era a TAXA DE
VITÓRIA da luta inteira, que satura porque qualquer coisa acima de ~15-20% de acerto por
jogada já é suficiente pra vencer dentro do teto de turnos, e qualquer coisa abaixo de ~5%
raramente resolve a tempo. A confusão foi minha, entre os dois planos (jogada vs luta);
agradeço a insistência em separar os dois.

**(b) Com Ataque +15 do filhote** (dano bruto médio por acerto 13,5, tipo perfuração
corrigido):

| persona | Absorção(perfuração) | dano líquido médio/acerto | PV | acertos p/ derrubar |
|---|---|---|---|---|
| Pers.1 | 4 | 9,5 | 34 | 4 |
| Pers.2 | 4 | 9,5 | 34 | 4 |
| Pers.3 | 4 | 9,5 | 34 | 4 |
| Pers.4 | 4 | 9,5 | 34 | 4 |

(Todas as quatro personas têm Absorção(perfuração)=4 nesta bancada, porque as três
armaduras usadas, malha/couro/gambeson, têm o mesmo número ali; só corte e impacto
diferem entre elas.) **4 acertos bastam para derrubar qualquer persona**, mesmo com
Ataque +15. O problema não é "o filhote não derruba ninguém quando acerta": é que ele quase
nunca chega a acertar 4 vezes dentro da janela de ~3,5 turnos em que o grupo já o matou.

**(c) 100 batalhas completas, filhote vs grupo C3:**

- Vezes que alguma persona chegou a 0 PV: **0 em 100 batalhas.**
- Vezes que alguém foi curado/estabilizado e voltou: **0** (ver item d abaixo: não existe
  esse caminho no código ainda).
- Duração: média 3,55 turnos, mínimo 3, máximo 5.

**(d) Confirmado no código** (`scripts/sim/desafio-bancada.mjs`): `caido` é marcado `true`
na primeira vez que `pv <= 0` e **nunca é desmarcado em lugar nenhum do arquivo**: nem a
Cura do Pers.3 alcança quem já caiu (o filtro de alvo da Cura exclui explicitamente
`!x.caido`) nem existe qualquer outro caminho de revivência. Ou seja: hoje **"caído" conta
"chegou a 0 PV alguma vez", não "está a 0 PV agora"**, porque não há como sair desse estado.
Isto bate com a suposição 6 já registrada (Estabilizar sem efeito numérico), mas é mais
forte do que eu tinha deixado claro antes: mesmo a Cura do Pers.3, se algum dia alguém
chegasse a cair, não o traria de volta nesta bancada. Não é um problema nestes 100 jogos
(ninguém caiu), mas fica registrado para quando alguma âncora tiver combate mais equilibrado.

### 2 · decomposição da Defesa (grupo) e do Ataque (âncoras), sem rodar bancada

**(a) Defesa do Pers.1, parcela por parcela** (fórmula `(Destreza+Esquiva)×2 + 2×min(C,Esquiva) − penalidade física(malha+broquel) + Proezas`; Vontade NÃO entra aqui, é bônus situacional de +4 só quando o personagem está em Grave, nunca somado à Defesa base):

| Centelha | (Des+Esq)×2 | 2×min(C,Esq) | − penalidade armadura/escudo | Proezas | **Defesa final** |
|---|---|---|---|---|---|
| 0 | 18 | 0 | −2 | +0 | **16** |
| 3 | 24 | 6 | −2 | +5 | **33** |
| 6 | 24 | 12 | −2 | +9 | **43** |

**(b) Ataque das 11 âncoras contra o Pers.1** (fórmula igual, `pool = ⌊(Atrib+Habilidade)/2⌋d6 + 2×min(Centelha,Habilidade)`; a perícia usada é sempre Briga):

| criatura | Centelha | Habilidade(Briga) | soma | dados | 2×min(C,Hab) |
|---|---|---|---|---|---|
| Lobo | 0 | 2 | 5 | 2d6 | 0 |
| Worg | 1 | 3 | 8 | 4d6 | 2 |
| Filhote | 4 | 5 | 11 | 5d6 | **8** |
| Jovem | 5 | 5 | 14 | 7d6 | **10** |
| Adulto | 6 | 5 | 16 | 8d6 | **10** |
| Ancião | 7 | 5 | 19 | 9d6 | **10** |
| Kraken | 7 | 5 | 19 | 9d6 | **10** |
| Balor | 9 | 5 | 16 | 8d6 | **10** |
| Diabo do Fosso | 9 | 5 | 17 | 8d6 | **10** |
| Solar | 9 | 5 | 15 | 7d6 | **10** |
| Tarrasca | 10 | 5 | 21 | 10d6 | **10** |

**O padrão salta aos olhos de novo, e é simétrico ao da Esquiva:** a Habilidade de Briga de
QUASE TODAS as âncoras está travada em 5 (só lobo e worg, os dois mais fracos, têm menos).
Como o termo de Centelha no ataque é `2×min(Centelha,Habilidade)`, a partir da Centelha 5 o
termo trava em 10 pontos e NUNCA MAIS CRESCE, mesmo para a Tarrasca (Centelha 10). Enquanto
isso, a Habilidade do Pers.1 (Esquiva) CRESCE JUNTO com a soma de ataque dele, Centelha a
Centelha (despacho: soma 9,10,11,12,12,12,12), então o termo dela nunca trava dentro da
régua 0-6. **Isto é o mesmo padrão da Defesa/Esquiva 0, só do lado do Ataque: Habilidade
de combate da criatura não escalou junto com a Centelha dela**, pelo menos nestas 9 âncoras
acima de Centelha 4.

**(c) Chance de acerto das 11 âncoras contra o Pers.1 C6** (Defesa 43 vs Defesa 34, a
segunda sem os 9 pontos de Proezas; Vontade não muda a Defesa base, como já dito em 2a, então
não há uma terceira versão "sem Vontade" diferente de "sem Proezas" aqui):

| criatura | acerto com Defesa 43 (atual) | acerto com Defesa 34 (sem Proezas) |
|---|---|---|
| Lobo | 0,0% | 0,0% |
| Worg | 0,0% | 0,0% |
| Filhote | 0,0% | 2,9% |
| Jovem | 1,8% | 49,1% |
| Adulto | 11,8% | 75,7% |
| Ancião | 47,6% | 95,8% |
| Kraken | 48,1% | 96,3% |
| Balor | 12,4% | 74,8% |
| Diabo do Fosso | 23,0% | 87,4% |
| Solar | 5,2% | 65,4% |
| Tarrasca | 73,0% | 99,2% |

**Os 9 pontos de Proezas do Pers.1 em C6, sozinhos, derrubam a chance de acerto de quase
toda âncora em dezenas de pontos percentuais** (ancião: 95,8%→47,6%; Diabo do Fosso:
87,4%→23,0%). Isto é outra cara do mesmo "degrau" da rodada anterior: perto do teto do
pool de dados de uma criatura, um punhado de pontos de Defesa vale muito mais do que o
mesmo punhado valeria no meio da curva.

### 3 · área dos sopros: aplicada

**(a) Porte PF1 usado na conversão vs porte da nossa ficha**, conferido contra a nota já
registrada pelo Arquiteto em `../tmp/arquiteto/b14-cr-desafio.md` (linha do filhote) e
contra o nome do stat block PF1 de cada um:

| criatura | nome do stat block PF1 | porte PF1 | porte da ficha | bate? |
|---|---|---|---|---|
| Filhote | Red Dragon (wyrmling) | **Pequeno** | Médio | **NÃO** (já registrado pelo Arquiteto: "porte PF1 é Pequeno, não Médio") |
| Jovem | Young Red Dragon | Grande | Grande | sim |
| Adulto | Adult Red Dragon | Enorme | Enorme | sim |
| Ancião | Ancient Red Dragon | Imenso | Imenso | sim |

Só o filhote diverge, e a divergência já estava documentada antes desta rodada (não é
achado novo). Usei o porte DA FICHA (Médio) em tudo, como pedido.

**(b) Os valores gravados não são um cálculo meu a partir de tabela PF1 de alento por
categoria de idade** (a proposta da rodada anterior, que eu tinha feito sem olhar com
cuidado o resto da própria ficha): achei que as quatro fichas de dragão vermelho JÁ TINHAM
a área do sopro escrita, em prosa, no campo `habilidades` (o texto solto que já existia
antes desta Fase, não gravado no campo estruturado `area` do poder). Usei ESSES números, já
decididos por quem escreveu a ficha, em vez de recalcular os meus:

| criatura | texto já existente em `habilidades` | `area` gravada agora |
|---|---|---|
| Filhote | "cone de 9m; dano alto, metade se Esquivar" | `"cone de 9 m"` |
| Jovem | "cone de 9m; 6d6 de dano..." | `"cone de 9 m"` |
| Adulto | "cone de 12m; 9d6 de dano..." | `"cone de 12 m"` |
| Ancião | "cone de 15m; 12d6 de dano..." | `"cone de 15 m"` |

O campo `area` (`poderNaturalSchema`, `scripts/criatura-schema.mjs`) já é texto livre
(`z.string().optional()`), então a forma ("cone de") entra junto com o número, sem precisar
de um campo novo nem de pendência: gravei `"cone de 9 m"`, não só `"9"`. Rodei
`gen-bestiario.mjs`/`gen-monsters.mjs` depois de editar as quatro fichas; `validate`,
`tsc` e `build` verdes, `test-editor-bestiario` e `espelho` verdes também.

**Resultado depois de gravar:** rodei a âncora do filhote de novo (C0 a C4, n=100). Com o
`tipoDano` corrigido (achado nesta mesma rodada) MAIS a área de 9 m: C0 caiu de 62,5% (valor
da rodada anterior, com o bug de tipoDano) para **34,0%** [25,5%;43,7%]; C1 a C4 continuam
**100,0%**. **A área em si não mudou nada** (9 m fica abaixo do limiar de 10 m da regra de
"atinge os 4"), então a diferença em C0 é só o conserto do `tipoDano`. Continua confirmando
o achado das rodadas anteriores: a causa não é o sopro.

## 30/09/2026, quarta rodada · matriz 2x2 nas 9 âncoras

Decisões do autor antes da matriz: 1) "caído" mantém como está (chegou a 0 PV uma vez
conta pra sempre nesta bancada); registro aqui que isso deixa o desafio medido MAIS
PESSIMISTA para o grupo do que seria com estabilização revertendo a queda de verdade.
2) Briga travada em 5 NÃO é o mesmo caso da Esquiva: a Defesa do PF1 tem canal alternativo
no Centelha (armadura natural → Absorção), o Ataque não tem esse canal (o bônus de ataque
do PF1 cresce com Dados de Vida, e o teto 5 é do gerador, não da fonte). Virou variante de
teste (Eixo A), não correção de ficha.

**Três bugs reais achados RODANDO a matriz, todos na bancada, nenhum em ficha nem regra**
(sem eles a matriz travava em censura total nos casos mais fortes, e eu teria relatado
"desafio altíssimo" por um defeito meu, não pela criatura):

1. **`morte-explosiva` (Balor) trava a criatura num loop sem ataque nenhum.** Tem `base`
   (entrava no pool de ataques) mas o `efeito` é gatilho de morte ("ao cair a 0 PV..."),
   não uma escolha de turno; como `avontade` sem `quantidade` nem `recarga` nunca fica
   indisponível, o Balor "escolhia" ela todo turno e nunca batia de verdade. Corrigido:
   poder cujo `efeito` bate com "ao cair a 0 PV" sai do pool de ações ativas (não modelo
   o gatilho em si, seria mecânica nova).
2. **Poder com `resiste: 'nenhum'` não é dano.** `teleporte-balor`, `convocar-diabos`,
   `feiticos-supremos` (Diabo do Fosso), `convocar-anjos` (Solar), `regeneracao-implacavel`
   (Tarrasca): todos têm `base` mas são utilidade (teleporte, convocação, reproduzir Arte,
   regenerar), não ataque. Rolar Nd6 contra a Defesa nesses inventaria dano que a ficha não
   descreve. Corrigido: fora do pool de ataque ativo.
3. **Entre poderes disponíveis, a escolha pegava sempre o primeiro do array, não o mais
   forte.** O Diabo do Fosso tem "doença" (nível 3, sempre disponível, `periodo:'golpe'`)
   ANTES de "labareda" (nível 6, só 3 usos/dia); a criatura nunca soltava a labareda porque
   a doença nunca ficava indisponível. Corrigido: entre os disponíveis, prefere o de maior
   nível (política de escolha da bancada, não regra nova).

**Defesa do Pers.1, parcela por parcela (C0/C3/C6): confirmada igual à rodada anterior**
(nenhuma ficha de persona mudou): **16 / 33 / 43**, com a mesma decomposição já relatada
(base + `2×mín(C,Hab)` + Proezas − penalidade de armadura/escudo).

### A matriz (N=200 batalhas/Centelha/célula)

Eixo A: A1=como está; A2=Habilidade de ataque efetiva = máx(atual, Centelha) (só na
bancada). Eixo B: B1=como está; B2=Pers.1 sem Proezas de Defesa e sem Vontade na Defesa.
"Desafio" = menor Centelha do grupo com vitória ≥80%. Quando a maioria das batalhas não
resolve em 60 turnos (nenhum lado consegue ferir o outro o bastante), marco "estagnado" com
a fração de censura, em vez de fingir uma taxa de vitória sobre poucas batalhas.

| âncora (Centelha) | célula | desafio medido | acerto vs Pers.1 C6 |
|---|---|---|---|
| Filhote (4) | A1B1 | 1 | 0,0% |
| | A1B2 | 1 | 0,0% |
| | A2B1 | 1 | 0,0% (Habilidade real 5 já ≥ Centelha 4, A2 não muda nada) |
| | A2B2 | 1 | 0,0% |
| Jovem (5) | A1B1 | 2 | 2,1% |
| | A1B2 | 2 | 2,1% |
| | A2B1 | 2 | 2,1% |
| | A2B2 | 2 | 2,1% |
| Adulto (6) | A1B1 | 5 | 12,1% |
| | A1B2 | 5 | 12,1% |
| | A2B1 | 5 | 36,4% |
| | A2B2 | **6** | 36,4% |
| Ancião (7) | A1B1 | não alcançado até C6 | 47,6% |
| | A1B2 | não alcançado até C6 | 47,6% |
| | A2B1 | não alcançado até C6 | 90,9% |
| | A2B2 | não alcançado até C6 | 90,9% |
| Balor (9) | A1B1 | não alcançado até C6 | 11,8% |
| | A1B2 | não alcançado até C6 | 11,8% |
| | A2B1 | não alcançado até C6 | 94,6% |
| | A2B2 | não alcançado até C6 | 94,6% |
| Diabo do Fosso (9) | A1B1 | 6 (maioria estagnada abaixo) | 23,0% |
| | A1B2 | 6 (idem) | 23,0% |
| | A2B1 | 6 (idem) | 98,1% |
| | A2B2 | 6 (idem) | 98,1% |
| Solar (9) | A1B1 | não alcançado até C6 | 6,6% |
| | A1B2 | não alcançado até C6 | 6,6% |
| | A2B1 | não alcançado até C6 | 93,4% |
| | A2B2 | não alcançado até C6 | 93,4% |
| Kraken (7) | A1B1 | não alcançado até C6 | 49,1% |
| | A1B2 | não alcançado até C6 | 49,1% |
| | A2B1 | não alcançado até C6 | 90,7% |
| | A2B2 | não alcançado até C6 | 90,7% |
| Tarrasca (10) | A1B1 | não alcançado até C6 | 74,5% |
| | A1B2 | não alcançado até C6 | 74,5% |
| | A2B1 | não alcançado até C6 | 100,0% |
| | A2B2 | não alcançado até C6 | 100,0% |

(Curvas completas Centelha a Centelha, com a fração de censura de cada célula, na saída
bruta de `node scripts/sim/desafio-matriz.mjs`, não reproduzidas aqui por tamanho; posso
colar sob pedido.)

### Leitura

**B2 (tirar Proezas/Vontade da Defesa do Pers.1) quase não muda nada sozinho**: só move o
desafio do Adulto (A2B2: 5→6) e a taxa de acerto em alguns pontos no meio da curva
(Adulto A1B1→A1B2: C5 99,0%→93,5%). Nunca muda o "não alcançado até C6" de nenhuma âncora
grande.

**A2 (Habilidade de ataque = máx(atual,Centelha), tirando o teto do gerador antigo) muda
MUITO a chance de ACERTO** (Ancião 47,6%→90,9%; Balor 11,8%→94,6%; Diabo do Fosso
23,0%→98,1%; Solar 6,6%→93,4%; Kraken 49,1%→90,7%; Tarrasca 74,5%→100,0%), mas **quase não
muda o "desafio" medido**, porque a maioria das âncoras grandes segue presa em
"estagnado"/"não alcançado até C6" mesmo acertando quase sempre. A causa: mesmo acertando
90%+ das vezes, o dano por acerto das âncoras (Absorção do Pers.1 descontada) não é grande
o bastante para derrubar 34 PV rápido o suficiente dentro de 60 turnos, enquanto o Pers.1
raramente fere a criatura de volta (Defesa 20-30 das âncoras grandes é alta demais pro
grupo de Centelha baixa).

**Achado metodológico que não estava no pedido, mas é importante registrar:** boa parte
das células de âncora grande (Ancião, Balor, Diabo do Fosso, Solar, Kraken, Tarrasca) tem
a MAIORIA das 200 batalhas em censura (nenhum lado resolve em 60 turnos), em quase toda
Centelha do grupo de 0 a 5 ou 6. **O teto de 60 turnos pode ser curto demais pra medir
desafio de verdade nestas âncoras**: não dá pra saber se "não alcançado até C6" é porque o
grupo realmente não venceria com mais tempo, ou porque nenhum dos dois lados fere o outro
rápido o bastante dentro da janela. Não estendi o teto por conta própria (mudaria a medida
sem pedido); fica registrado como uma quarta variável a testar, se fizer sentido.

## Pendente desta rodada

Nada decidido sozinha. Três bugs reais de bancada corrigidos no caminho (documentados
acima, nenhum mexeu em ficha ou regra). O autor ainda não aceitou a leitura de que "nenhuma
correção isolada resolve"; os números desta e da rodada anterior (rampa de acerto,
Habilidade de Briga travada em 5, Proezas valendo dezenas de % de acerto, e agora a matriz
A/B mostrando que nem tirar o teto da Habilidade nem tirar Proezas/Vontade do Pers.1
resolvem sozinhos) são material novo para essa conversa. Parei aqui, como pedido.

## 30/09/2026, quinta rodada · a censura contra a Tarrasca era leitura errada minha

**Correção antes de tudo:** a célula Tarrasca×C0×A1B1 NUNCA esteve em censura. Reli a
minha própria tabela da rodada anterior: ela diz "não alcançado até C6" para a Tarrasca em
toda célula, e essa frase significa "o grupo nunca vence", não "a luta não resolve". A
curva bruta (que eu tinha, mas não colei) mostra `q2.00` em toda Centelha da Tarrasca:
**resolvida, grupo perde, 2 caídos, toda vez.** Só o Diabo do Fosso teve células genuínas
em censura (`n/d`) na matriz. Eu misturei os dois na mensagem de chat da rodada anterior
("boa parte das células... Tarrasca... censura total"), e isso é o que mandou a
investigação atrás de uma luta longa que não existe. Peço desculpa pelo ruído; os três
itens pedidos, com o par certo (Tarrasca não tem o problema; o Diabo do Fosso tem).

### 1 · os 10 primeiros golpes, Tarrasca×grupo C0, célula A1B1

**Tarrasca ataca Pers.1** (pool `10d6+2 +10`, dano `4d6 +26 perfurante`; Defesa do Pers.1
em C0 = 16; Absorção dele em perfuração = 1):

| golpe | soma | defesa | veredito | dano bruto | absorção | dano líquido |
|---|---|---|---|---|---|---|
| 1 | 52 | 16 | acerto | 47 | 1 | 46 |
| 2 | 52 | 16 | acerto | 34 | 1 | 33 |
| 3 | 42 | 16 | acerto | 41 | 1 | 40 |
| 4 | 50 | 16 | acerto | 40 | 1 | 39 |
| 5 | 42 | 16 | acerto | 46 | 1 | 45 |
| 6 | 44 | 16 | acerto | 40 | 1 | 39 |
| 7 | 57 | 16 | acerto | 44 | 1 | 43 |
| 8 | 37 | 16 | acerto | 45 | 1 | 44 |
| 9 | 48 | 16 | acerto | 35 | 1 | 34 |
| 10 | 49 | 16 | acerto | 46 | 1 | 45 |

Todo golpe acerta e mata (34 PV do Pers.1, dano líquido sempre ≥33): a Tarrasca fere o
grupo, rápido. Não é isto que trava a luta.

**Pers.1 ataca a Tarrasca** (pool `4d6+2 −1`, dano `1d6 +5`; Defesa da Tarrasca = 4;
Absorção dela em corte = 27):

| golpe | soma | defesa | veredito | dano bruto | absorção | dano líquido |
|---|---|---|---|---|---|---|
| 1 | 18 | 4 | acerto | 8 | 8 | **0** |
| 2 | 16 | 4 | acerto | 7 | 7 | **0** |
| 3 | 8 | 4 | acerto | 11 | 11 | **0** |
| 4 | 11 | 4 | acerto | 6 | 6 | **0** |
| 5 | 15 | 4 | acerto | 8 | 8 | **0** |
| 6 | 12 | 4 | acerto | 11 | 11 | **0** |
| 7 | 15 | 4 | acerto | 11 | 11 | **0** |
| 8 | 14 | 4 | acerto | 10 | 10 | **0** |
| 9 | 11 | 4 | acerto | 6 | 6 | **0** |
| 10 | 15 | 4 | acerto | 10 | 10 | **0** |

**O Pers.1 acerta TODO golpe (Defesa 4 é trivial) e nunca causa dano nenhum**, porque a
Absorção da Tarrasca em corte (27) é maior que qualquer coisa que o dano dele (`1d6+5`,
teto 11) consiga rolar. Isto não é "nenhum lado fere o outro": é UM lado ferindo o outro
rápido (a Tarrasca) e o outro lado acertando sem nunca perfurar a Absorção. A luta resolve
em poucos turnos, com a Tarrasca vencendo.

### 2 · chance de acerto e dano médio EXATOS (convolução dos dados, não simulação)

| direção | Centelha do grupo | acerto | raspão | dano líq. médio SE acerto | dano médio/golpe (com raspão) |
|---|---|---|---|---|---|
| Tarrasca → Pers.1 | 0 | 100,0% | 0,0% | 39,0 | 39,0 |
| Pers.1 → Tarrasca | 0 | 100,0% | 0,0% | **0,0** | **0,0** |
| Tarrasca → Pers.1 | 6 | 73,9% | 10,5% | 33,0 | 24,5 |
| Pers.1 → Tarrasca | 6 | 100,0% | 0,0% | **0,0** | **0,0** |
| Balor → Pers.1 | 0 | 100,0% | 0,0% | 21,0 | 21,0 |
| Pers.1 → Balor | 0 | 0,1% | 1,1% | 0,0 | ~0,0 |
| Balor → Pers.1 | 6 | 13,0% | 10,8% | 15,0 | 1,9 |
| Pers.1 → Balor | 6 | 100,0% | 0,0% | 1,0 | 1,0 |

### 3 · o cálculo bate com a simulação; não há acerto nem dano "perdido" no código

Comparei cada número da tabela acima com a mesma conta rodada dentro do `resolverGolpe`
de verdade (os 10 golpes do item 1 têm 100% de acerto e dano líquido 0 nos dois lados da
Tarrasca, exatamente como a conta exata prevê). **Não achei divergência nenhuma entre
calculado e observado em nenhum dos 8 pares.** O que existe, e é real, não bug:

- **Tarrasca: não trava nada.** Resolve rápido, a Tarrasca vence. O "Pers.1 acerta sempre
  e nunca fere" é uma curiosidade (Absorção 27 > teto do dano dele), mas não impede a luta
  de terminar, porque a Tarrasca já mata o grupo antes de isso importar.
- **Diabo do Fosso (a célula que REALMENTE tem censura na matriz) é outra causa,
  confirmada com a mesma conta exata:** o ataque BÁSICO dele (`Golpe planar`) acerta
  99,99% do Pers.1 C0 e causa 22,0 de dano médio (mataria rápido), **mas a criatura nunca
  usa o básico**: minha escolha de ação sempre prefere QUALQUER poder com `base` sobre o
  ataque básico, mesmo quando o básico seria mais forte. Com "Labareda" (nível 6,
  Dificuldade 24, acerto garantido) limitada a 3 usos por dia, ela mata rápido nos 3
  primeiros turnos e depois a criatura cai pra "Doença" (nível 3, Dificuldade 12 < Defesa
  16, raramente conecta) pelos 57 turnos restantes, enquanto o Pers.1 C0 tem **0,0% de
  chance exata** de acertar a Defesa 30 dele. Sobra 1 persona caída (não 2) em 60 turnos:
  estagnado de verdade, não bug, mas **exposto por uma política de escolha que nunca
  considera o ataque básico como alternativa**, o que não estava no escopo desta
  investigação e não mudei.

## Pendente desta rodada

Não estendi o teto. Não mudei ficha nem regra. Corrigi publicamente o erro da rodada
anterior (Tarrasca não tem censura; só o Diabo do Fosso tem, e é real). A política "nunca
considerar o ataque básico" fica anotada como possível ajuste futuro da bancada, sem
decidir nada sozinha. Parei aqui, como pedido.

## 30/09/2026, sexta rodada · escolha por dano esperado, matriz final, FECHA A FASE 5

### 1 · a política de escolha corrigida

Antes: a criatura sempre preferia QUALQUER poder com `base` sobre o ataque básico
(corrigido na rodada 4 pra pegar o de maior nível, não o primeiro do array). Agora: em
cada turno, a criatura compara o **dano esperado** de TODA opção disponível (ataque
básico, cada poder ofensivo, cada Arte ofensiva de caster) e usa a de maior valor. Dano
esperado = chance de acerto × dano líquido médio (com o piso do raspão), somado sobre os
alvos atingidos se for área, calculado por convolução exata dos dados (mesma conta das
rodadas 4 e 5), não simulação nem aproximação. Poder de controle/apoio sem dano (Proteção,
Cura-em-si) continua fora dessa comparação, seguindo o roteiro já combinado.
Implementado em `scripts/sim/desafio-bancada.mjs` (`escolherAcaoCriatura`, `pmfDado`,
`danoEsperadoContra`, `danoEsperadoOpcao`).

**Efeito: a censura sumiu por completo.** Rodei a matriz inteira de novo (200
batalhas/Centelha/célula, todas as 36 células): **nenhuma célula ficou em censura desta
vez** (zero "estagnado" em toda a tabela). O Diabo do Fosso, que antes travava com censura
total em quase toda Centelha, agora resolve em poucos turnos (confirmado: C0/A1B1, antes
100% censura, agora resolve em 4 turnos, grupo perde). Isto sustenta a leitura da rodada
5: a censura real (só no Diabo do Fosso) era causada pela política de escolha, não por uma
luta genuinamente longa.

**Vários "desafio" mudaram**, quase sempre pra CIMA (criatura ficou mais difícil, porque
agora usa sua melhor opção de verdade):

| âncora | célula | desafio ANTES (rodada 4) | desafio AGORA |
|---|---|---|---|
| Filhote | A1B1/A2B1 | 1 | **2** |
| | A1B2/A2B2 | 1 | **2** |
| Jovem | A1B1/A2B1 | 2 | **4** |
| | A1B2/A2B2 | 2 | **5** |
| Adulto | A1B1 | 5 | **6** |
| | A1B2 | 5 | **não alcançado até C6** |
| | A2B1 | 5 | **não alcançado até C6** |
| | A2B2 | 6 | **não alcançado até C6** |
| Ancião, Balor, Diabo do Fosso, Solar, Kraken, Tarrasca | todas | não alcançado até C6 | não alcançado até C6 (sem mudança: já eram as âncoras mais fortes, a política nova não tinha onde melhorar mais) |

### 2 · a matriz final × a faixa do despacho original

A régua do grupo só vai até Centelha 6 (é o teto da tabela de soma do despacho). Para as
âncoras cuja faixa esperada é **acima de 6** (Ancião=9, Balor/Diabo do Fosso/Solar/
Kraken=6-8, Tarrasca=10), "não alcançado até C6" é **consistente** com a faixa esperada,
mas **não a confirma**: precisaria da fórmula de escala além de Centelha 6 (`6 +
log_k(N/4)`, grupo de N personagens de Centelha 6), que esta bancada não implementa (não
estava no pedido de nenhuma das seis rodadas). Marco essas seis como **não determinável
nesta régua**, não como "passou" nem "falhou".

| âncora | Centelha | faixa do despacho | A1B1 | A1B2 | A2B1 | A2B2 |
|---|---|---|---|---|---|---|
| Filhote | 4 | 3 ou 4 | 2 ✗ | 2 ✗ | 2 ✗ | 2 ✗ |
| Jovem | 5 | 5 ou 6 | 4 ✗ | **5 ✓** | 4 ✗ | **5 ✓** |
| Adulto | 6 | 6 a 8 | **6 ✓** | não det.¹ | não det.¹ | não det.¹ |
| Ancião | 7 | =9 | não determinável (régua para em C6) |
| Balor | 9 | 6 a 8 | não determinável (régua para em C6) |
| Diabo do Fosso | 9 | 6 a 8 | não determinável (régua para em C6) |
| Solar | 9 | 6 a 8 | não determinável (régua para em C6) |
| Kraken | 7 | 6 a 8 | não determinável (régua para em C6) |
| Tarrasca | 10 | =10 | não determinável (régua para em C6) |

¹ "Não alcançado até C6" pra uma âncora cuja faixa esperada É 6-8: o desafio pode estar
em 7 ou 8 (dentro da faixa, sem eu conseguir confirmar) ou genuinamente acima da régua.
Marquei "não determinável" porque a tabela aqui não distingue os dois casos, não porque o
teste tenha "passado" ou "falhado".

### 2b · quantas das 9 âncoras caem na faixa, por célula

Só 3 das 9 âncoras têm faixa esperada dentro de 0-6 (as únicas onde dá pra dizer
passou/falhou de verdade: Filhote, Jovem, Adulto). Das outras 6, nenhuma célula permite
dizer se passou.

| célula | das 3 determináveis, quantas passam |
|---|---|
| A1B1 | 1 de 3 (só Adulto) |
| A1B2 | 1 de 3 (só Jovem) |
| A2B1 | 0 de 3 |
| A2B2 | 1 de 3 (só Jovem) |

**Nenhuma célula acerta as 3.** O Filhote fica sempre abaixo da faixa (desafio 2, esperado
3-4) em toda célula; nem A2 (tirar o teto da Habilidade) nem B2 (tirar Proezas/Vontade do
Pers.1) resolvem isso sozinhos, confirmando o achado da rodada 4: o gargalo é a Defesa do
Pers.1 crescendo rápido (16→33→43) contra qualquer criatura, não uma característica
isolada do bestiário.

### 3 · Defesa do Pers.1, parcela por parcela (C0/C3/C6): confere com as rodadas 4 e 5

Fórmula: `(Destreza+Esquiva)×2 + 2×mín(Centelha,Esquiva) − penalidade de armadura/escudo
(malha+broquel) + Proezas`.

| Centelha | (Des+Esq)×2 | 2×mín(C,Esq) | − penalidade | Proezas | **Defesa final** |
|---|---|---|---|---|---|
| 0 | 18 | 0 | −2 | +0 | **16** |
| 3 | 24 | 6 | −2 | +5 | **33** |
| 6 | 24 | 12 | −2 | +9 | **43** |

### 4 · lacunas corrigidas nesta fase (bancada, não ficha nem regra)

1. `tipoDano` do ataque básico sempre caindo em "impacto" (parser lia só o sufixo de PC).
2. `resolverGolpe`/`danoNoAlvo` sem checar fraqueza/resistência/imunidade do dano físico
   das personas contra a criatura (elemento vinha `null` sempre).
3. Poder com `usos.periodo:'ticks'`+`recarga` virando teto vitalício (1 uso na batalha
   inteira) em vez de reiniciar a cada recarga.
4. "Dano e projéteis" (poder natural/Arte ofensiva) usando o bolo de ataque físico da
   criatura, em vez da regra escrita (Dificuldade fixa = nível×4 contra a Defesa).
5. Vontade defensiva (+4 em Grave) calculada mas nunca aplicada (dead code).
6. Poder-gatilho-de-morte (`morte-explosiva`) entrando no pool de ataques ativos.
7. Poder de utilidade (`resiste:'nenhum'`: teleporte, convocar, reproduzir Arte,
   regenerar) rolando dano que a ficha não descreve.
8. Escolha de ação sempre preferindo poder sobre básico, depois só por nível; agora por
   dano esperado de verdade (item 1 desta rodada), o que eliminou toda censura observada.
9. Área dos 4 sopros de dragão gravada (`"cone de N m"`, valores já existentes em prosa
   na própria ficha, não recalculados).

### 5 · lacunas que ficam abertas (não mexidas, fora do escopo de cada rodada)

- **Habilidade de Briga travada em 5** em quase toda âncora forte (gerador antigo): não é
  bug de bancada (decisão do autor, rodada 4); vira variante A2 de teste, não correção.
- **Reserva de Vontade / nível de Arte do Pers. 3**: ainda a suposição provisória
  (Centelha+2), sem número real do autor.
- **Desafio acima de Centelha 6** (6 das 9 âncoras): a fórmula `6 + log_k(N/4)` do
  despacho original não está implementada; sem ela, não dá pra confirmar nem negar a
  faixa esperada dessas seis.
- **"Caído" não reverte** (decisão do autor, rodada 4: fica assim, deixa o desafio medido
  mais pessimista que com estabilização/cura de verdade revertendo queda).
- **Controle de Arte (Fascinação/Morte que domina ou paralisa)** ainda vira dano puro, não
  efeito de controle (suposição 4, nunca revisada).
- **Dano em área do Pers.3 (Centelha 3+)** não modelado (suposição 5, despacho não fixa
  qual Arte ela usaria).
- **Custo de Mana aproximado** em 1/nível (2 na Cura), não o `custoDe` inteiro com escolha
  de parâmetro por parâmetro (suposição 3).
- **Teto de 60 turnos**: preocupação da rodada 4 (achava que podia ser curto demais);
  ficou sem sentido depois do item 1 desta rodada (zero censura na matriz final), mas não
  testei explicitamente um teto maior pra confirmar que 60 é suficiente em todo caso.

## É seguro fechar a Fase 5?

Os seis passos pedidos nesta rodada estão feitos: política de escolha corrigida (item 1),
matriz completa rerrodada (item 2), tabela de 9 âncoras × 4 células com a faixa do
despacho e se passou (item 2, 2b), Defesa do Pers.1 decomposta (item 3), lacunas
corrigidas e abertas listadas (item 4, 5). Não mudei ficha nem regra em nenhum passo desta
rodada. `validate`/`tsc`/`build`/`espelho` verdes; confirmo CI do commit antes de
considerar fechado de verdade. Por pedido do Arquiteto, NÃO sigo para as 309 criaturas
nesta rodada.
