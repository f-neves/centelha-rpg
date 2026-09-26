# B14 fase 3 · despacho · resiste por efeito, os dois gigantes, disparo/defesa, locomoção, Artes das conjuradoras

Liberado pelo humano em 26/09/2026, depois do veredito PROCEDE da fase 2 (`b14-fase2-revisora.md`,
commit `fd489cb`). Pino: `fd489cb`. Texto do autor, colado sem edição:

## O pedido, verbatim

> Arquiteto: decisões do autor sobre a B14 fase 2. Três passos, nesta ordem.
>
> 1. AGORA: chame a Revisora sobre o 3d6c678 (parte B: poderes e locomoção) e sobre o 2c5530e
>    (parte A e C/D). Pontos que ela deve cobrar em especial: a flag constructo.semVida ainda não
>    é lida por nenhum código (registrar como pendência, não é defeito desta fase); e o `resiste`
>    padrão que a Executora definiu, que o autor está SUBSTITUINDO no passo 2 (não é para a
>    Revisora aprovar aquele padrão).
>
> 2. Depois do veredito: despache a B14 fase 3 a partir de ../tmp/arquiteto/decisoes-fase3.md
>    (abra a pasta ../tmp/arquiteto). Os apoios estão na mesma pasta: artes-criaturas.md (as 20
>    conjuradoras com Artes nomeadas) e loc-fonte.md (as 43 velocidades, Bestiary 1). O
>    decisoes-fase3.md vence o artes-criaturas.md onde discordarem (os dois gigantes). Pontos de
>    atenção para a Executora:
>    - a regra do `resiste` decide pelo EFEITO, não pela Arte de base, e reescreve os poderes já
>      gravados;
>    - poder natural é isento do portão de Centelha; é assim que os gigantes cabem sem subir a
>      Centelha;
>    - três linhas de Artes vieram de memória da 5e (Kraken, Naga Espírita): conferir na fonte,
>      listar o que discordar, não inventar;
>    - a Gárgula PERDE as resistências a corte, perfuração e fogo (não existem na fonte);
>    - modo de locomoção novo `jato` no esquema (só o Kraken por enquanto).
>
> 3. Depois da fase 3: as correções da auditoria M-virtude-somada.md, decididas pelo autor (mensagem
>    separada, dispachada depois desta).
>
> Commit com pathspec em cada passo. No fim de cada passo, arquivos tocados e o que ficou para o
> autor.

## Antes de começar: CORRIGE da Revisora, fase 2

O veredito PROCEDE trouxe 2 CORRIGE pequenos. Resolva os dois ANTES de iniciar a fase 3
(commit próprio, separado do commit da fase 3, com pathspec):

1. `src/data/recompensas.json._nota` ainda dizia "x 3 (o grupo de referência)" no pino 3d6c678,
   apesar do campo `grupo` já estar em 4. Já foi corrigido em `513f5a1` (fora da faixa julgada
   pela Revisora), então **confira se este já está resolvido** antes de mexer; se já estiver, só
   confirme no relato.
2. `src/content/chapters/combate.md:426` (parágrafo novo da Horda, item C.13): usou sintaxe
   Markdown (`**...**`) dentro de um bloco HTML cru (`<p class="muted">`), que não é reprocessado
   como Markdown. Resultado: os asteriscos aparecem literais no site
   (`dist/regras/combate`). Conserto de uma linha: trocar por `<strong>` ou tirar do wrapper.
   Prove no `dist/` depois do build.

## Onde está o material

- `../tmp/arquiteto/decisoes-fase3.md` (a partir de qualquer uma das quatro árvores em
  `C:/Users/Neves/ClaudeCode/centelha/`): o despacho central desta fase, 6 seções (resiste por
  efeito, os dois gigantes, 8 disparos, 7 defesas, locomoção, Artes das 20 conjuradoras).
- `../tmp/arquiteto/artes-criaturas.md` (mesma pasta): as 20 criaturas conjuradoras com Artes já
  nomeadas e a justificativa magia a magia. `decisoes-fase3.md` vence este arquivo onde
  discordarem (hoje só nos dois gigantes, seção "Os dois gigantes" deste arquivo, que o
  `decisoes-fase3.md` SUBSTITUI inteiramente).
- `../tmp/arquiteto/loc-fonte.md` (mesma pasta): as 43 velocidades que faltavam depois da fase 2,
  com página do Pathfinder Bestiary 1 (ou d20pfsrd/Tome of Horrors onde a criatura não está no
  B1) para cada uma.
- Nenhum dos três é do repositório; não commite.

## Conferência prévia (Arquiteto, antes de despachar)

Conferi que os três arquivos de apoio têm o formato que o pedido descreve: `decisoes-fase3.md`
com as 6 seções numeradas, `artes-criaturas.md` com a coluna "Artes (id Nnível)" preenchida para
as 20 linhas mais a seção "Os dois gigantes", `loc-fonte.md` com `id | Criatura | fonte (livro) |
terra ft | voo ft | natação ft | escalada ft | escavação ft | outro | observação` e 43 linhas de
dado. Não conferi item a item as citações de fonte (Archives of Nethys, d20pfsrd, d20srd) contra o
site: isso é o próprio trabalho desta rodada, e o próprio `decisoes-fase3.md` já marca como não
conferidas as três linhas de memória da 5e (Kraken, Naga Espírita, Gigante das Nuvens antigo).

## Atenção especial da Executora

- **A regra do `resiste` (seção 1) substitui o padrão que você definiu na fase 2**, não é
  acréscimo: reescreva os poderes já gravados cujo `resiste` estava certo pelo padrão antigo mas
  erra pelo novo. Os quatro casos que o despacho já aponta como discordantes (Bodak, os 4 drenos,
  as auras de fogo/frio, o fedor de Ghast/Hezrou/Dretch) são exemplo, não lista fechada: releia
  todo poder `tipo: "natural"` gravado na fase 2 contra a tabela de efeito → resiste.
- **Os dois gigantes mudam de Centelha** (Tempestade 3→5, Nuvens 1→4): isto é decisão do autor,
  não um item 6 novo para listar. A lore e o CR sustentam o salto; aplique direto.
- **Kraken ganha o modo de locomoção `jato`**, novo no esquema (`scripts/criatura-schema.mjs`,
  `locomocao`). É só para o Kraken por enquanto: não generalize para outra criatura nesta fase.
- **Três linhas de Artes são "de memória", não conferidas**: Kraken, Naga Espírita, e o
  "control weather" antigo do Gigante das Nuvens que este despacho descarta. Confira cada uma na
  fonte (Archives of Nethys para Pathfinder; SRD oficial para 5e) antes de gravar, e liste no
  relato o que a fonte confirmar ou desmentir.
- **Gárgula perde 3 resistências** (corte, perfuração, fogo): é remoção, não adição. Confirme que
  nenhum outro lugar (ficha-engine.ts, algum teste) supõe essas resistências antes de tirar.
- **`mon-treant`, `mon-elemental-da-terra-grande`, `mon-gigante-do-fogo`, `mon-montao-tropecante`,
  `mon-rakshasa`, `mon-tarrasque` também mudam** na seção "As 7 defesas": não é só a Gárgula.
- **As 3 criaturas sem natação na fonte** (Tigre, Urso Cinzento, Urso-pardo) NÃO gravam
  `locomocao.natacao`: nadam pela regra geral de Atletismo, como qualquer criatura sem o campo.
  Não escreva um valor "por analogia".
- **Notas não bloqueantes da Revisora, fase 2, para aproveitar se for barato**: (a) `mon-roc` e
  mais 18 fichas no mesmo padrão nunca entraram em `locomocao-fonte.md` (o arquivo da fase 2), e
  continuam com a velocidade de voo lida como terra no Grid; o valor já está em
  `fonte.deslocamento.nota` de cada ficha, então o conserto é ler dali. (b) a herança de fraqueza
  por material dos 9 construtos (item 4 da fase 2) não ganhou o campo `material` em si (os valores
  batiam por coincidência). Nenhuma das duas é exigida por este despacho; se o tempo permitir,
  resolva, senão liste como pendência igual às outras.

## Verificação

- `npm run validate` e `npm run build` verdes.
- Prova no `dist/`: o parágrafo da Horda sem asterisco literal (o CORRIGE 2).
- Travessão: zero nas linhas novas.
- Os três caminhos sujos conhecidos continuam intactos.

## O relato

Continue em `docs/simulacao/caixa/b14-fase2-executora.md` (nova seção, "B14 fase 3") ou um
arquivo próprio desta fase, como preferir. Ao fim: arquivos tocados, os dois commits separados
(CORRIGE da fase 2 primeiro, fase 3 depois), as três linhas de Arte conferidas contra a fonte (o
que bateu e o que discordou), e qualquer item das 6 seções que não coube.
