# Rodada 100 · despacho · o diagnóstico do L104, sem conserto

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> A 99 está em revisão (aviso `4786670`). Esta rodada é só medição: não edita teste, Grid nem
> código nenhum. Progresso em `progresso-100.md`, relato em `100-executora.md`.

## O que medir

O **L104** (`docs/pendencias/L-simulacao-simultaneo.md`): a asserção `[aquece] a peça pegável não
está na vez, e arrastá-la abriria pergunta em vez de mover` do `scripts/test-grid.mjs` caiu 3 vezes
em 60 runs do CI, sempre com "Criatura 17": runs `35911397511` (`8dc0f27`), `35914287185`
(`26f0d59`) e `35941091164` (`575be67`). O humano quer a causa antes de qualquer conserto.

1. **Leia o log das três falhas** (`gh run view <run> --log-failed`) e o bloco `[aquece]` do
   `test-grid.mjs` inteiro, com as linhas de cima e de baixo. Diga o que a asserção afirma e como a
   peça é escolhida.
2. **A conta da mensagem:** "21 pegáveis de 10 no palco" põe mais pegáveis que peças no palco.
   Diga de onde sai cada número. Se a conta estiver errada, isso já é achado, mesmo que não seja a
   causa.
3. **As três hipóteses do humano, cada uma com evidência a favor e contra:**
   - ordem de execução (a escolha depende da ordem em que as peças chegam, ou de um `[0]`);
   - tempo (a asserção lê antes de a tela assentar a vez);
   - estado que sobrou de outro bloco (algo que um bloco anterior do mesmo `test-grid` deixou).
4. **Reproduza, se der:** rode o `test-grid` localmente algumas vezes (é smoke, precisa de
   navegador) e diga quantas vezes rodou e quantas caiu. Se não cair nenhuma, diga isso e não
   conclua nada do zero.
5. **A pergunta que decide o conserto:** a falha é do Grid (a peça na vez está errada de verdade) ou
   da asserção (ela mede uma coisa que às vezes não é a que o rótulo diz)? Se não der para saber,
   diga "não sei" e o que faltaria medir.

**Não ofereça causa sem teste.** Hipótese não testada vai escrita como hipótese, com o que a
testaria.

## O relato

`100-executora.md`, as quatro seções da casa. Uma linha no L104 com o que a medida mostrou. Commit
com pathspec, `pull --rebase` antes (ou `git fetch` se o `lore/` do Cartógrafo bloquear), push
depois.
