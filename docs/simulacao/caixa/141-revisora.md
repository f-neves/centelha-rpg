# 141 · Revisora · a correção do CORRIGE 140 (`3e632db6`)

Pino: `3e632db6` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 140 é ancestral de
origin/main).

**CI:** Validar e Deploy de `3e632db6` estavam `in_progress` quando escrevi (conferido por `gh run list`); o
Arquiteto disse que confere.

**Resultado: PROCEDE.**

## O que conferi

1. **O código** (`ficha-engine.ts`, `calcConj`): entrou `inabilCorpo = !it2H(habil) && ehCorpo(cj.inabil)`; a mão
   inábil com Punhos ou Chutes passa a contar em `maosLivres` e sai de `nasMaos`, como a hábil já fazia. É a leitura
   (a) do 140.
2. **Na tela**, o mesmo script do 140 (`../tmp/revisora/bloqueio-140.mjs`, saída em `bloqueio-141.txt`), ficha limpa,
   base 2:

   | Hábil / Inábil | 140 | 141 | D-065 |
   |---|:--:|:--:|:--:|
   | (ficha nova) | 4 | 4 | 4 |
   | Punhos / mão livre | 4 | 4 | 4 |
   | Chutes / mão livre | 4 | 4 | 4 |
   | Espada Longa / mão livre | 3 | 3 | 3 |
   | Machado / mão livre | 3 | 3 | 3 |
   | Espada Longa / Broquel | 4 | 4 | 4 |
   | mão livre / Broquel | 3 | 3 | 3 |
   | Lança (duas mãos) | 4 | 4 | 4 |
   | **Espada Longa / Punhos** | 4 | **3** | 3 |
   | **Punhos / Punhos** | 3 | **4** | 4 |
   | **Machado / Chutes** | 2 | **3** | 3 |

   Os dois casos do CORRIGE batem, e os oito outros ficaram iguais.
3. **Machado / Chutes, de 2 para 3: bate com a D-065.** Os Chutes na mão inábil querem dizer que aquela mão está
   vazia (os Chutes não ocupam mão). Então as opções são o Machado (+0) ou o punho livre (+1), que não somam ("Arma ou
   escudo e corpo não somam"), e a ficha mostra a melhor ("A ficha mostra o Bloqueio com a melhor combinação
   disponível"): +1, total 3. É o mesmo número de Machado / mão livre, e tem de ser, porque é o mesmo estado das mãos.
   O 2 de antes era o −1 dos Chutes somado ao Machado, que a D-065 não permite (os Chutes só valem quando as mãos não
   podem ser usadas, e aí é o Mestre que ajusta).
4. **N17** diz agora que a ficha faz isso "desde o CORRIGE 140", com o que estava errado antes. Certo.
5. **Rótulos:** `vazioRot` passou a "Punhos (Briga)" e "Mão livre", sem travessão.
6. **Chutes no Cap. XIII:** a coluna Mãos passou de 0 para 1, como `maos: 1` em `armas.json`. É a regra do repositório
   (o JSON é a fonte, o capítulo se corrige). O texto da Luta desarmada continua dizendo que os Chutes são a defesa de
   quem não pode usar as mãos, e a coluna Mãos de uma tabela de armas lida como "quantas mãos a arma pede no seletor"
   não contradiz isso.
7. **Grid e mesa:** `git diff --stat` sobre `src/lib/artes-grid*`, `src/lib/mesa-*`, `src/pages/mesa/`,
   `scripts/gen-grid-artes.mjs`, `src/lib/equip.ts`, `src/lib/combate-resumo.ts` e `src/data/`: vazio.
8. **Travessão e vocabulário:** `ficha-engine.ts` passou de 20 para 16 travessões (os quatro do rótulo); o capítulo e a
   N ficaram iguais. Nenhuma linha nova usa o nome antigo de Habilidade. Ver a observação.

## Observação

A única linha nova com travessão é do relato (`veterana-1e-relato.md`): "O 'Defesa por Bloqueio [travessão]' que a medição
mostra é texto antigo da ficha". É citação de um rótulo de tela que ainda tem travessão (o "Defesa por Bloqueio
[travessão] N" do quadro de combate), e não texto de regra. A convenção que eu sigo é citar como "[travessão]"; e o
próprio rótulo da ficha é mais um travessão herdado, da mesma família do `vazioRot` que saiu agora. Nada que segure a
rodada.

## CLAREZA

Nada a acrescentar.
