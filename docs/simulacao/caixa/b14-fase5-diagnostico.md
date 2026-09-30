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
