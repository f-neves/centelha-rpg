# Rodada 91 · despacho · o grupo 4 da rodada 90, agora com as decisões

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 90 está na Revisora (aviso `c88b93a`), e esta rodada anda em paralelo, sobre o que ficou
> de fora dela. Progresso em `docs/simulacao/caixa/progresso-91.md`, relato em `91-executora.md`.
>
> **As decisões estão em `leitura-de-novato-decisoes.md` §16**, no bloco "Quatro decisões a mais"
> (`a8ce2bc`). O humano aceitou as quatro recomendações. Não há decisão de regra a tomar aqui.

## Grupo 1 · o "ficar parado" do Grid

**1 · `src/lib/artes-grid-mesa.ts`, `paresDeCoragem` (`:1707-1716`) e `oferecerSaida`
(`:1763-1796`).** Sai Bravura + Vigor e Temperança + Raciocínio. Entra a **Virtude sozinha**
(Bravura ou Temperança), pela conversão de sempre, contra **metade da Dificuldade da linha
"metade", arredondada para cima** (`Math.ceil(d.difMetade / 2)`). A citação "os dois pares do
capítulo III" morre junto.

**2 · O texto que descreve isso**, onde estiver: `regras.json:1995` e qualquer capítulo ou
página que diga a Dificuldade desse teste. Hoje o `regras.json` diz "contra a mesma Dificuldade da
linha metade"; passa a dizer metade dela, arredondada para cima.

**3 · A prova.** Se o `test-grid.mjs` (ou outro teste) exercita esse caminho, a asserção nova tem
de cobrar a parada e a Dificuldade novas, com o controle negativo: guarde a mudança do seu arquivo
(`git stash push -- caminho`), a asserção tem de falhar contra o código antigo. Se nenhum teste
exercita, diga isso e escreva um que exercite a função que decide (não a caixa de diálogo).

Números de referência, para conferir o seu teste (Dificuldade da área → a do teste; chance de
passar): borda 10 → 5, Bravura 4 72%, Bravura 6 95%; meio 15 → 8, Bravura 4 28%; fundo 20 → 10,
Bravura 6 50%.

## Grupo 2 · o capítulo diz quando a Virtude vai sozinha

**4 · `aparencia-virtudes-vontade.md`, o "Resistir".** Hoje ele é o teste de alma (medo,
provocação, tentação). Uma frase a mais: **as resistências do corpo continuam somando Atributo**
(Vigor + Convicção, Vontade + Convicção nas Artes; o Estabilizar), com link para onde elas estão.
Não mexa em `efeitos.json`, em `artes/regras.astro` nem no Estabilizar: eles ficam como estão, por
decisão.

## Grupo 3 · o nome Frenesi em dois lugares

**5 · `racas.md`, seção do Frenesi.** Uma frase: a fúria racial **não** ativa as Técnicas que dizem
"em fúria" no Caminho Sangue Fervente; só a Técnica Fúria ativa. E a Técnica Frenesi do mesmo
Caminho é outra coisa (ataques repetidos), não o traço. Não mexa em `tecnicas.json`.

## Grupo 4 · o achado do `racas.json`

**6 · A descrição do meio-orc:** sai a frase que diz que o orc puro "vive na lore como criatura,
não como raça jogável"; a longevidade passa de 60 para 70 anos, como em `racas.md`. Confira se o
`longevidade`/outros campos ou o capítulo repetem os 60 em algum lugar.

## O de sempre

- Commits com pathspec, gancho verde, build se tocar `src/`. A mensagem de commit que toca o Grid
  diz o que muda para quem joga hoje (o "ficar parado" fica mais difícil ou mais fácil conforme a
  Virtude, e deixa de usar Vigor/Raciocínio).
- Sem travessão. Habilidade, nunca Perícia. `lore/` é do Cartógrafo: não encoste.
- Pode empurrar mesmo que o push leve commits já feitos do Cartógrafo.
- Relato em `91-executora.md` com arquivos, commits e o resultado do controle negativo.
