# Rodada 04 · aviso à revisora

## COMMIT

O código a revisar:

```
f5d5ba2f46fadf245864ad6a93ed4e964949cb3e
```

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Nenhum arquivo de código foi alterado. O trabalho desta rodada foi investigação da assimetria 1,178 identificada na rodada anterior.

## O QUE ESTE RELATÓRIO AFIRMA

Nenhum número novo foi publicado nesta rodada. O trabalho foi investigação e diagnóstico da assimetria 1,178 nas células unissono, que havia sido refutada na rodada anterior.

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D41 | **Nenhuma correção foi aplicada ao código.** A assimetria foi isolada como do HARNESS, mas a correção requer mudanças coordenadas entre o harness (cena.mjs) e a mesa (que compartilha montarCena). Só o humano pode decidir se a correção vale o acoplamento. | Zero custos de código imediatos; custos de design adiam para próxima decisão |

## O QUE FICOU EM ABERTO

- **⚠ PRECISA DO HUMANO · a assimetria 1,178 é do HARNESS.** A causa está no `ordinal` assimétrico atribuído durante a montagem da cena em `scripts/sim/cena.mjs`. Lado A recebe ordinais 0 até n-1, lado B recebe ordinais n até 2n-1. Isso faz `iniciativaDaPeca(arq, ordinal)` gerar iniciativas sistematicamente maiores para o lado B, que portanto actiona primeiro em cada Tick e declara mais vezes. A bateria de espelho confirmou que essa assimetria TAMBÉM existe na mesa, então não é um artefato do harness sozinho: a mesa compartilha o `montarCena`. A correção foi testada em three formas (ordinais iguais, intercalação, nomes simétricos) e melhorou a assimetria de 1,178 para ~1,10, mas não a eliminou completamente, sugerindo que há mais de um fator envolvido. Decisão pendente: corrigir ou aceitar como propriedade da configuração ordinal da montagem?

- **a frase refutada está ainda em quatro lugares**, conforme documentado na rodada 03: docs/simulacao/09-bateria-grande.md linhas 454-455; Pendencias.md linha 1344; scripts/sim/agregar.mjs linha 496 (comentário); docs/simulacao/09-bateria-grande.md linha 925 (D31 contradiz §2.4). Só corrijo depois que a decisão sobre a assimetria estiver clara.

## ONDE LER

1. `scripts/sim/cena.mjs` · função `montarCena` linhas 146-185 (montagem do ordinal assimétrico)
2. `scripts/sim/elenco.mjs` · função `iniciativaDaPeca` linhas 130-135 (derivação de iniciativa do ordinal)
3. `src/lib/combate-tempo.ts` · função `ordemDaFila` linhas 412-417 (desempate da fila que usa iniciativa como segundo critério)
4. A rodada anterior `docs/simulacao/caixa/03-executora.md` para contexto de como o achado foi feito
