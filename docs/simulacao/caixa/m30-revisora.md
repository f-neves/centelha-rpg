# Revisão: M-30 (traços raciais viram campo, Vitalidade soma PV)

Reancoragem: `b4088c1` (autorizado pelo Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `8bfa3b2` (meu veredito anterior). Trabalho: `273f080..b4088c1` (dois commits).

## `racas.json → bonusCondicional`

Conferi as oito raças com `node -e` lendo o JSON direto. Contagem bate com o commit: Anão (2),
Elfo (2), Gnomo (2), Halfling (1), Meio-Elfo (1), Orc (Frenesi + Vitalidade, 2), Meio-Orc
(Vitalidade, 1) — 11 entradas cobrindo os 10 traços da tabela da decisão (a Vitalidade é uma linha
na tabela mas se aplica a duas raças).

Cada `bonus`/`escopo` conferido contra a prosa original em `tracos`:
- Anão: "+1d6 resistir a venenos" e "+1d6 qualquer Ofício em que já tenha pontos" batem.
- Elfo: "+1d6 Percepção..." bate com a parte numérica de "Sentidos naturais aguçados"; o "enxerga o
  dobro, por uma cena" da mesma frase não virou campo próprio, mas continua visível ao jogador
  porque `ficha-engine.ts:2363` imprime o array `tracos` inteiro (prosa) ANTES do bloco de bônus
  condicionais, não um substituindo o outro. "Resiliência Mental" bate ("+4 de Dificuldade, ou
  +1d6").
- Gnomo, Halfling, Meio-Elfo: batem palavra por palavra com a prosa.
- Orc: Frenesi "+2d6, Intimidar, em Frenesi" bate com "+2d6 na parada" ao intimidar em Frenesi.

## Vitalidade soma PV de verdade

`ficha-engine.ts:1543-1545`: acha o item de `bonusCondicional` com `campo === 'pv'` e
`escopo === 'sempre'`, soma `vig` ao resultado de `pv(vig, porteR)`. Reproduzi a conta à mão: Orc/
Meio-Orc têm `porte: "medio"` (mesma base de Humano/Anão), então com Vigor 2: `25 + 2×3 + 2 = 33`
contra `25 + 2×3 = 31` de quem não tem o traço. Bate com o número que o commit reporta. O tooltip
do PV (`:1555`) mostra o termo extra só quando `vitalidade` existe, então não aparece para raças
sem o traço.

## Os nove bônus situacionais

`ficha-engine.ts:2359-2363`: filtra tudo que não é `escopo === 'sempre'` (ou seja, exclui só a
Vitalidade) e monta o bloco `.raca-bonus`, oferecido e não somado, ao lado (não no lugar) da prosa
de `tracos`. `FichaSkeleton.astro` ganhou só as duas classes CSS que esse bloco usa. Consistente
com a decisão ("a ficha o oferece sem somar, como a Especialidade").

## Schema do `validate`

`scripts/validate-data.mjs`: `bonusCondicional` (array de `{bonus, escopo, campo?, nome?}`,
opcional) e `longevidade` (enum das quatro faixas da M-09, opcional) entraram no schema de `racas`.
Rodei `npm run validate`: verde, sem reclamação nas oito raças.

## Reapontamento de citação

`docs/pendencias/L-simulacao-simultaneo.md`: as duas linhas de `ficha-engine.ts` citadas (FAH/FAA)
foram de `:1633`/`:1634` para `:1639`/`:1640`. Conferi no disco: `awk 'NR==1639'` e `NR==1640` dão
exatamente `const fah = Math.max(3, Math.min(40, 3 * forca + halt));` e a linha do `faa`
equivalente. Bate.

## Achado registrado (não é desta rodada)

`src/pages/mesa/combate.astro:1687` (`adicionarPCs`) chama `pvDe(at.vigor || 0)` com um único
argumento, sem porte nem Vitalidade, antes e depois deste commit. Conferido no disco: é assim
mesmo. O aviso já registra isto como fora do escopo (a rodada pediu `ficha-engine.ts`/
`mesa-ficha.ts`, e este ponto é de `combate.astro`, da frente da mesa), então não vira CORRIGE
aqui — mas fica como achado para quando essa frente tratar de PV na mesa.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**PROCEDE.** O campo `bonusCondicional` cobre os dez traços da tabela, com bônus e escopo
corretos contra a prosa original; a Vitalidade soma PV de verdade, com a conta batendo; os nove
bônus situacionais aparecem oferecidos e não somados; o schema do `validate` ganhou os dois campos
que faltavam (`bonusCondicional`, `longevidade`); a citação reapontada bate com o disco.
