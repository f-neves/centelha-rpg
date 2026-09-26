# B14 fase 2 · respostas do autor às 3 perguntas da Executora, mais o item 10 e um campo novo

Continuação de `b14-fase2-despacho.md` (commit `3352231`), em cima do progresso parcial publicado
em `2c5530e`. Texto do autor, colado sem edição:

## O pedido, verbatim

> Arquiteto: respostas do autor às perguntas da Executora na B14 fase 2. Repasse e siga.
>
> Arquivos novos em ../tmp/arquiteto/ (abra a pasta): poderes-sugestao.md foi SUBSTITUÍDO e agora
> tem a coluna id, gerada dos próprios arquivos de src/data/bestiario (nenhum nome repetido); use
> o id, não o nome. locomocao-fonte.md é a lista das 55 criaturas com voo e das 71 com outros
> modos, vinda da auditoria de lore contra as fontes (D&D 3.5/5e, Pathfinder 1e, zoologia).
>
> 1. Subtipos: `disparo` vira entrada em `ataques` (distancia: true); `manobra` vira efeito do
>    ataque (bote, investida) ou texto em `habilidades`; `agarrao` e constrição viram efeito do
>    ataque ("agarra ao acertar"); `sentido` vira texto em `habilidades`. Poder formal
>    (resiste/area/usos) só para sopro, olhar, aura, presenca, toque, veneno, teia, regeneracao,
>    forma, travessia, invisivel, convocar, explosao, canto e dominio. Veneno e toque ganham
>    `ataque: <id do ataque>`, porque saem no golpe.
> 2. Referências a Caminho de Proeza já existentes (Águia Gigante e as outras 45 entradas tipo
>    proeza): NÃO apagar. A mecânica de hoje vem da tabela; o Caminho vai para um campo
>    `proezaFutura` ({caminho, tecnica}), inerte até as Proezas fecharem.
> 3. Casamento: pelo id da tabela.
> 4. Voo (item 10): cruze as 55 do locomocao-fonte.md com as 34 que a Executora achou. Os valores
>    vêm da auditoria: confira cada um na fonte antes de gravar (ft ÷ 10 = m/Tick de batalha, como
>    o resto do deslocamento). Terra passa a ser a velocidade de terra da fonte. Liste as que
>    discordarem. Os outros modos (natação, escalada, escavação) entram do mesmo jeito.
> 5. Esquema: acrescente `desafio.maisUm` (quantos indivíduos juntos sobem o desafio em 1), vazio
>    até a bancada. A escala de desafio vai de 0 a 12: 0 = feito para 4 personagens de Centelha 0.
>
> Commit com pathspec. No fim: arquivos tocados, as discordâncias do voo, e qualquer poder da
> tabela que não coube.

## Onde está o material

- `../tmp/arquiteto/poderes-sugestao.md` (a partir de qualquer uma das quatro árvores em
  `C:/Users/Neves/ClaudeCode/centelha/`): SUBSTITUÍDO, agora com coluna `id` (235 linhas, conferi
  que a linha 8 é o cabeçalho com `id` como primeira coluna e a primeira criatura, `mon-aboleth`,
  já traz a nota "resistência de corpo (regra em auditoria)" em vez de "Vigor + Convicção": o
  autor já ajustou a tabela por causa do achado da auditoria de Virtude).
- `../tmp/arquiteto/locomocao-fonte.md` (mesma pasta): NOVO, 139 linhas, duas seções ("Com voo
  (55)" e o resto para os outros modos), com `id`, nome e o valor em `ft` encontrado na fonte.
- Nenhum dos dois é do repositório; não commite.

## Conferência prévia (Arquiteto, antes de despachar)

Conferi que os dois arquivos substituídos têm o formato que o pedido descreve (coluna `id`
presente e preenchida na tabela de poderes; a lista de voo com cabeçalho `id | Criatura | O que a
auditoria achou`). Não conferi item a item as 226 linhas nem as 55+71 da locomoção contra os 309
arquivos: isso é o próprio trabalho desta rodada.

## Atenção especial da Executora

- **Item 2 muda o que "não apagar" significa.** Você já tinha preservado a referência da Águia
  Gigante por não ter tocado nela; agora, para as ~46 entradas `tipo: "proeza"` da tabela, o
  destino é explícito: o `caminho`/`tecnica` atuais migram para um campo NOVO `proezaFutura`
  ({caminho, tecnica}), inerte (não lido por nenhum gerador ainda), e a ficha passa a carregar a
  mecânica da tabela (provavelmente vira poder natural ou entra em `ataques`/`habilidades`,
  conforme o item 1). Confirme com o autor se `proezaFutura` substitui os campos `caminho`/
  `tecnica` do poder antigo ou convive com eles.
- **Item 1 fecha o vocabulário**: só sopro/olhar/aura/presença/toque/veneno/teia/regeneração/
  forma/travessia/invisível/convocar/explosão/canto/domínio viram poder formal
  (`resiste`/`area`/`usos`). Os quatro que você apontou (disparo, manobra, agarrão, sentido) têm
  destino próprio, fora do poder formal. Veneno e toque ganham `ataque: <id do ataque>` novo no
  esquema (não estava no despacho original desta fase 2, é adendo).
- **Item 4 pede auditoria de fonte por criatura**, não só cruzamento de lista: confira o valor em
  `ft` de `locomocao-fonte.md` contra a nota de origem já escrita em cada ficha
  (`fonte.deslocamento.nota`) antes de gravar, e liste toda discordância em vez de aplicar calado.
- **Item 5** é campo de esquema novo (`desafio.maisUm`), independente da parte B; pode sair mesmo
  que a parte B ainda não termine.

## Verificação

- `npm run validate` e `npm run build` verdes.
- Travessão: zero nas linhas novas.
- Os três caminhos sujos conhecidos continuam intactos.

## O relato

Continue em `docs/simulacao/caixa/b14-fase2-executora.md` (nova seção) ou um arquivo próprio desta
resposta, como preferir. Ao fim: arquivos tocados, a lista de discordâncias do voo, e qualquer
poder da tabela de 226 que não coube em nenhuma das rotas do item 1.
