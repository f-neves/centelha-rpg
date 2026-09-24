# Rodada 103 · despacho · a folha cala para o arremesso

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Um conserto só, pedido pelo humano em 24/09/2026 depois do veredito da 102 (`5b51454`). Progresso
> em `progresso-103.md`, relato em `103-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, na branch `executora`. Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
(tem de dar verdadeiro) e `git switch -C executora origin/main`. Publicação como na 102: fetch, rebase
`origin/main`, `git push origin HEAD:main`, e aviso em vez de força se não for fast-forward. Nada de
`npm install`.

## 1 · O defeito, que é produção

A sua medição (`medicao-i12.md`, `8ffc7e0`) respondeu a leitura (c) do I12: a folha da ação **não cala**
para arma de arremesso. Ela escreve uma faixa com **livre 0 m e máximo igual ao `distMax` do
catálogo**, e a adaga de arremesso a 4 m já sai com "2ª faixa ... -6 no acerto". Nenhuma regra dá esse
número: o `Arremesso.md` diz que o máximo de uma arma atirada sai da Força de Arremesso de QUEM joga, e
as frações do livre dessas armas não estão no catálogo. É número inventado na tela do mestre.

**O que o humano decidiu, e o que NÃO decidiu.** O conserto desta rodada é o que o próprio I12 dizia
que a folha fazia: **ela CALA para o arremesso enquanto o número certo não chegar.** Calar é honesto;
faixa inventada não é. **A decisão do I12** (o `distMax` do catálogo, a Força de Arremesso de quem joga
com o `RESUMO` carregando, ou calar de vez) **continua do humano**, na lista única. Este conserto não a
toma: só tira da tela o que ninguém escolheu pôr lá.

## 2 · O que fazer

1. **A folha da ação** (`src/pages/mesa/grid.astro`, o bloco "O ALCANCE", em volta de
   `faixaDeDistancia(ra?.arma, dist!)`): quando a classe do ataque é `arremesso`, a caixa de aviso de
   alcance fica calada. **As duas frases**, a da faixa E a de "Além do alcance máximo da arma", porque
   o máximo também é o `distMax` do catálogo. A marca `al-aviso-conta` também não acende. A classe
   `distancia` (arcos, bestas) continua exatamente como está.
2. **Onde decidir.** A régua do repositório é que a função pura decide. Mas `alcanceDaArma` e
   `faixaDeDistancia` (`src/lib/alcance.ts`) também servem o `alcanceInterpor` (o teto de quem se
   interpõe à distância, chamado em `grid.astro` perto da linha 6617, com a classe da linha 6608), e
   devolver `null` ali para o arremesso MUDA COMPORTAMENTO: o interpositor deixaria de ser barrado
   pelo máximo e pela linha reta. **Não mude o `alcanceInterpor` nesta rodada.** Então o corte é na
   folha, ou numa função nova que só a folha chama; a escolha é sua, e diga no relato qual e por quê.
3. **O comentário que mente.** O comentário de `alcanceDaArma` diz que ela "devolve `null` para ...
   tudo que se arremessa". Não devolve: as 8 armas de Arremesso do `armas.json` têm `distMax`.
   Corrija o comentário para dizer o que a função faz, e onde a folha cala.
4. **Liste, e não troque:** todo outro lugar onde o `distMax` do catálogo de uma arma de arremesso
   decide ou mostra alguma coisa no Grid ou na ficha (o `alcanceInterpor` é o primeiro; procure os
   outros). Para cada um: arquivo e linha, o que mostra ou decide, e se algum caminho de jogo o
   alcança. Isso vai para a decisão do I12, que é do humano.
5. **Quais armas caem na classe `arremesso`:** liste os ids pelo `classeDaArma`, e diga se alguma
   delas tem `alcanceLivreFrac` (a medição diz que nenhuma das 8 tem; confira). A funda e os dardos
   estão no `armas.json`: em que classe caem?

## 3 · A prova

- **Um teste que fica no portão**, com os três sentidos do `CATALOGO.md`: vermelho contra o código de
  hoje (o controle negativo, pelo `git stash push -- caminho` do SEU arquivo, como no `L84`), verde com
  o conserto, e vermelho de novo se o conserto for revertido. **E o par positivo** (a forma "a asserção
  negativa sozinha"): uma arma de `distancia` fora do alcance livre continua mostrando a faixa. Se o
  teste for de navegador, diga em qual suíte ele entrou e confirme que ela está em toda lista que
  precisa dele.
- **A medição refeita na tela**, a mesma da `medicao-i12.md` (bancada 12, Herói 2, adaga e azagaia
  contra os mesmos alvos, e a besta): a tabela de antes e a de depois. **Se der, meça também o caminho
  que ficou de fora:** a arma de arremesso vinda da ficha de um PC equipado, e não do campo Arma.
- `npm run validate` e `npm run build` verdes no fim. O commit que toca `src/` traz a linha do que muda
  para quem joga (a folha da ação deixa de mostrar faixa de distância para arma de arremesso; sem
  migração). Travessão lendo os arquivos.

## 4 · O relato

`103-executora.md`, as quatro seções.

**Fora:** a decisão do I12, o `alcanceInterpor`, o link automático de "Perfuração" (CORRIGE da 102,
esperando o humano), o K31, o monte B, a migração 33, a fase 4 e o desfazer da voz.
