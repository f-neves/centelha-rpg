# 148 · Revisora · Correção da rodada 1 de armas de distância (`0dcf5788`)

Pino: `0dcf5788` (branch `revisora` na árvore `centelha-techlead-revisora`, reancorada por `git switch -C revisora 0dcf5788`
depois de `git merge-base --is-ancestor HEAD origin/main` passar; o veredito 147, `13677d17`, é ancestral do pino).
Escopo: os dois CORRIGE do veredito 147. Entre o 147 e o pino entraram dois commits: `542b5ab4` (só documentos: registra a M-32 e
escreve no plano as frases e o teto de Força 8, que eram minhas sugestões) e `0dcf5788` (a correção). Fora de documentos, a correção
toca `scripts/folhas-ia.json`, `scripts/baixar-imagens-equip.mjs`, `src/styles/arte-equip.css`, `scripts/test-catalogo-distancia.mjs` e a N22.

**Resultado: PROCEDE.** Os dois pontos fecharam. Um risco do conserto da arte é real mas está contido (abaixo), e o veredito é do
Arquiteto aceitar ou fechar com uma linha fora do git.

**CI da faixa (§11):** workflow `Validar dados e regras` **verde no sha do trabalho**, `0dcf5788` (run `38024439514`, 10/10/2026);
`Deploy site` verde (`38024439518`). `542b5ab4` também verde (`38024300637`).

## Ponto 1 · o id `dardos` e a arte

- **As três referências agora dizem `plumbata`:** `folhas-ia.json` (id e nome da peça; a descrição em inglês, "três dardos pesados",
  serve), `baixar-imagens-equip.mjs` (`{ id: 'plumbata', met: 'dart', … }`) e `arte-equip.css` (`.arte-dardos` virou `.arte-plumbata`, a
  mesma célula 100%/100% do `haste.webp`). O diff é uma linha em cada; nenhuma outra mudou.
- **O risco do gerador, e a resposta que o Arquiteto pediu: é real, é contido, e é aceitável com uma troca fora do git.**
  - **Real, conferido:** `gen-arte-equip.mjs` escreve `.arte-<id>` a partir de `mapa.pecas[].id`, que vem do mapa retificado em
    `D&D/armas&armaduras/folhas/haste/haste.json`, e **não** do plano commitado. Esse mapa na `rpg-system` (a árvore do Arquiteto,
    fora do git) **ainda tem `"id": "dardos"`** (1 ocorrência, e o `haste.css` do lado também). Rodar o gerador lá regravaria
    `.arte-dardos` e perderia `.arte-plumbata`. Quem sabe disso é a Executora, que copiou a pasta para a worktree dela, trocou o id no
    mapa copiado e rodou o gerador (a mensagem diz que a única mudança do CSS foi essa linha; o diff do commit mostra exatamente
    uma). **Eu não repeti a geração:** minha worktree não tem `D&D/`.
  - **Contido, medido:** a queda **não é silenciosa**. O `test-catalogo-distancia` (no `validate` e no gancho de `pre-commit`) agora lê os três arquivos e
    falha se algum apontar para `dardos` ou se o CSS não citar a plumbata. Rodei a mutação que reproduz o risco (o CSS regenerado
    com `.arte-dardos`): **o teste falha** ("ainda aponta para o id dardos"), e também com a classe da Plumbata removida ("não cita a
    plumbata"). O que falta é um `--check` do gerador no `validate`; sem ele a regressão só aparece quando alguém roda o validate ou
    tenta commitar o CSS, não quando o gerador roda.
  - **E a origem do id é o plano commitado:** `retificar_folha.py` (linha 177) lê os ids de `scripts/folhas-ia.json`, que agora diz
    `plumbata`; então rodar o retificador de novo conserta o mapa de `D&D/` sozinho. A saída de uma linha é trocar `dardos` por
    `plumbata` no `haste.json` da `rpg-system` (ou rodar o retificador lá), **uma vez**, e o risco some. Recomendo fazer já, porque a
    pasta é do Arquiteto e o custo é uma linha.
- **A pendência de ARTE da N22 basta.** Ela diz as 8 armas sem arte (Plumbata herdou a célula do dardo; as outras sete esperam arte
  nova), diz que não é defeito de dado, diz de onde sai a arte (plano `folhas-ia.json`, folhas retificadas fora do git, e
  `gen-arte-equip.mjs`) e "não se inventa arte à mão". Uma observação que não muda o veredito: a célula que a Plumbata herdou
  desenha **dardos** (a descrição do plano é "três dardos pesados com cauda emplumada"), e a Plumbata tem outra silhueta (curta,
  com chumbo, sem pena); vale uma linha na N22 dizendo que a arte da Plumbata é **provisória**, para ninguém tomá-la por definitiva.

## Ponto 2 · os `distMax` legados presos e a N22 com a reta

- **O teste agora prende os sete números** (`DISTMAX_LEGADO`: adaga 10, machado 12, azagaia 40, Funda 200, bumerangue 50, Rede 5,
  pilum 25) **e exige que as oito armas novas continuem sem `distMax`** (`SEM_DISTMAX`); 5 estragos novos, 16 no total.
- **As minhas mutações do 147, refeitas sobre o pino:** azagaia 40→30, Funda 200→100 e bumerangue 50→20, que passavam, **agora
  falham**, cada uma com a mensagem da arma ("o legado que o Grid lê é N"). Acrescentei as outras quatro dos sete (adaga 10→12,
  machado 12→13, Rede 5→6, pilum 25→26) e as três de "ganhou `distMax`" (Plumbata 30, Shuriken 10, Boleadeira 16): **todas falham**.
  **14 mutações, 14 pegas** (as dez de `distMax` e as quatro de arte). O teste sem mutação sai 0 ("16 estragos acusados").
- **A N22 ficou completa:** diz que, para as 8 armas sem `distMax`, o Interpor deixa de exigir também a **reta** ("um aliado a 300 m e
  fora da linha pode se interpor"), com a atribuição ao veredito 147, e que remover o `distMax` do arremesso é da passada do Grid.
  Confere com o que eu medi (`alcanceInterpor` devolve `pode: true` antes de olhar `naLinha` quando `faixaDeDistancia` é nula).

## O que o conserto não mexe

`armas.json` e `regras.json` estão idênticos aos do `f3d52086`; os números do catálogo do 147 seguem valendo. Nenhum arquivo de
`src/` mudou além do CSS (uma linha). Travessão e "Perícia": nenhuma linha adicionada tem; a mensagem do commit não tem travessão
nem coautoria.

## Sem medir

- A geração do CSS a partir das folhas (minha árvore não tem `D&D/`); o que li é o gerador, o retificador e o diff.
- O quadro da Plumbata na ficha com a arte do dardo, em navegador; é leitura do CSS.

## Arquivos

Escritos por esta rodada: `docs/simulacao/caixa/148-revisora.md` e `docs/simulacao/caixa/progresso-revisora-148.md`. Mutei cópias do
teste e dos três arquivos de arte numa pasta fora do repositório; nenhum arquivo rastreado foi tocado.
