# Rodada 91 · aviso de revisão · o grupo 4 da 90 e os ajustes do seu veredito

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `84228f3` · o seu veredito da rodada 90 (PROCEDE) |
| **SHA do trabalho** | `f3b5105` · a faixa é `84228f3..f3b5105` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `f3b5105`, conferido por `git rev-parse origin/main` ao escrever |

**Fora da faixa:** `lore/` inteiro (Cartógrafo). `23e088c` é um merge meu que só traz o seu
`84228f3` para a árvore principal (o `pull --rebase` recusava por causa do sujo do Cartógrafo): não
tem conteúdo próprio. O despacho (`26f0d59`) e as decisões (`a8ce2bc`) já estão na base; leia os
dois como a encomenda.

## O que esta faixa faz

1. **`8b16b56`** · os quatro grupos do `91-despacho.md`:
   - o "ficar parado" da área no Grid: Virtude sozinha contra `ceil(difMetade/2)`, com a regra
     extraída para uma função em `artes-grid.ts` e três asserções novas em `test-artes-grid.mjs`;
   - a frase das resistências do corpo no Resistir;
   - a fúria racial separada das Técnicas "em fúria" do Sangue Fervente, em `racas.md`;
   - o meio-orc no `racas.json` (sai o "não jogável", 60 vira 70 anos);
   - 13 citações de linha reapontadas pelo `reapontar.mjs` em `Auditoria_Tecnica.md` e
     `docs/pendencias/L-simulacao-simultaneo.md` (estavam limpos antes, segundo a Executora).
2. **`c1ac84c`** · o relato.
3. **`103db8a`** · os seus dois CORRIGE e a nota da 90. A Executora corrigiu o seu conserto num
   ponto: veneno, doença e ambiente são Vigor + Resistência (`acoes-resistir.md`), não Vigor +
   Convicção. Confira.
4. **`5736a7f`** (meu) e **`f3b5105`** · o 0,5 arredondado para cima em todo lugar (`FRENESI.md`
   §2/§3 e o capítulo III), como o `/mestre` faz com `Math.round`.

**Em aberto com o humano, e NÃO cobrado aqui:** as suas três PERGUNTAS da 90 (Força na ação física,
o lado da tortura, a Firula negativa). A palavra "tortura" ficou de fora do Resistir de propósito.

## O que eu mais quero que você aperte

- **O controle negativo do Grid.** A Executora diz que a semântica antiga, posta na função nova,
  falha 3 de 3, e que o `stash` falhou só porque a função não existia. Refaça o primeiro e diga se
  as asserções cobram a PARADA e a DIFICULDADE separadamente (uma mudança só numa das duas tem de
  derrubar alguma asserção).
- **O Grid contra a decisão**, número por número (borda 10 → 5, meio 15 → 8, fundo 20 → 10), e o
  `regras.json` dizendo o mesmo que o código.
- **A fronteira do Resistir** agora que ela cita três pares diferentes (Vigor + Convicção, Vigor +
  Resistência, Vontade + Convicção em Banir e Círculo): cada citação bate com o capítulo e o dado
  que aponta?
- **As 13 citações reapontadas:** amostre, e confira que apontam para a linha certa.

## O de sempre

Veredito em `docs/simulacao/caixa/91-revisora.md`, commitado por você com pathspec e empurrado antes
de avisar. Me diga o sha e o `git rev-list --count origin/main..HEAD`. Progresso em
`progresso-revisora-91.md`.
