# Folhas de símbolos a regenerar

Lista pedida pelo usuário em 2026-09-23, para gerar quando o limite de imagem voltar.
Não é urgente: com o que existe já dá para avaliar o mapa. Todas as folhas novas no
mesmo estilo das atuais (`icons/folha-*.png`): gravura em preto sobre fundo branco
limpo, **luz do noroeste** (lado esquerdo claro, sombra hachurada à direita), grade de
4 colunas por 3 linhas, 1254 × 1254 px, nenhuma peça encostando em outra nem na borda.

| folha | tem hoje | falta | por quê |
|---|---|---|---|
| montanha nevada | 4 (na `folha-terreno-gelado.png`) | uma folha de 12 | uma cordilheira nevada repete o mesmo desenho a cada 4 picos; de preferência na silhueta das 12 montanhas comuns, com o cume branco |
| palmeira e árvore tropical | 2 palmeiras e 2 tropicais (na `folha-vegetacao-quente.png`) | uma folha de 12: 6 palmeiras e 6 árvores tropicais | floresta tropical e selva repetem o mesmo desenho a cada 2 peças |
| conífera | 5 (na `folha-arvores.png`, que tem 7 folhosas) | uma folha de 12 coníferas | a floresta boreal inteira sai de 5 desenhos |
| "chão rachado" da vegetação seca | 1 peça (`vegetacao-seca-04`), fora do sorteio | a folha de terreno seco refeita sem ele, com mais arbustos secos, árvores mortas e cactos no lugar | chão rachado é textura, não objeto: espalhado como símbolo parece remendo. Se quiser a textura, ela vem à parte, como fundo de deserto, e não como símbolo |

Depois de gerar: salvar em `icons/` com nome pelo conteúdo, acrescentar a folha em
`cartografia/recorte.py` (tipos por célula) e rodar `scripts/recortar_simbolos.py`.
A conferência de espelhamento (`recorte.assimetria_de_luz`) mede a sombra de cada
peça nova sozinha.
