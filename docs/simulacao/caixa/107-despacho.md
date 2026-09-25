# Rodada 107 · despacho · os preços das Fases 1 a 3 (armas, escudos, armaduras)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Proposta de preços da revisão econômica, **aprovada pelo autor** (o humano, 24/09/2026). Progresso em
> `progresso-107.md`, relato em `107-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, branch `executora`. Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
e `git switch -C executora origin/main`. Publicação como sempre, sem força e sem `npm install`.

**A fonte da proposta não está no git** (`lore/economia/proposta-precos-f1-f3.md`, só no `rpg-system`).
Você não a verá; tudo o que precisa está aqui, com o motivo de cada preço copiado da proposta na seção 5.

## 1 · Os preços (em pc, no campo `"preco": {"pc": N}` dos JSON)

**`src/data/armas.json`, mudam:** `sabre` 170 · `martelo-de-guerra` 600 · `machado-pesado` 650 ·
`arco-curto` 100.

**`src/data/armas.json`, ganham preço:** `espada-serrilhada` 250 · `maca` 250 · `picareta-de-guerra` 240 ·
`adaga-de-arremesso` 50 · `machado-de-arremesso` 80 · `azagaia` 65 · `pilum` 50 · `funda` 10 ·
`bumerangue` 30 · `rede` 30 · `dardos` 5 **por unidade**.

**Os dardos, ANTES de aplicar:** veja se o item `dardos` representa uma unidade ou um conjunto, pela
descrição e pela tag `munição` (hoje: peso 0,2, "Carregados às dezenas", tags `munição` e
`projétil veloz`, como a `adaga-de-arremesso`; compare com como o jogo trata a munição do arco e da
funda, e com o que a ficha e a mesa fazem com `peso` e `preco` de item `munição`). **Se for conjunto,
NÃO aplique**, e diga no PRECISA DE MIM quantas unidades ele tem e de onde tirou o número. Se for
unidade, aplique 5, e escreva no relato a prova (o trecho que decide).

**`src/data/armaduras.json`, muda:** `camisa-de-malha` 900.

**`src/data/armaduras.json`, ganham preço:** `gambeson` 140 · `couro` 130 · `brigandina` 680 ·
`lamelar` 700 · `malha` (a cota) 1300 · `placa-municao` 1400 · `placa-transicao` 2100 ·
`placa-completa` 2600.

**Mantidos, sem tocar:** todos os escudos; `machado` 300; `placa-articulada` 1400; `peitoral` 280;
`peitoral-reforcado` 900; `malha-completa` 1800; as três bestas; as demais armas.

Confira os ids contra o JSON antes de escrever (a lista acima foi lida do JSON em `ca52ca6`). Se o
envelope pedir `preco` em outro lugar do objeto que não o nível de cima, siga o formato dos itens que já
têm preço.

## 2 · Todo lugar onde o preço aparece

Procure **todos** os lugares onde esses preços aparecem além dos JSON e atualize de forma consistente:
**regenere o que é gerado, edite o que é escrito à mão.** Pontos de partida conhecidos, não a lista
fechada:

- `scripts/gen-cap-itens.mjs`, que escreve o catálogo de preços em `custo-de-servico-e-itens.md`
  (só lista item com `preco`, então os itens novos passam a aparecer);
- `scripts/gen-lista-equip.mjs` e `scripts/precos.mjs`, se lerem armas e armaduras;
- tabelas à mão em `src/content/chapters/armas-e-armaduras.md` e `custo-de-servico-e-itens.md`;
- `Acoes_Sistema.md`, os documentos de raiz e o que o `grep` achar pelo nome do item e pelo preço
  velho (`3 po` do Sabre, `1 pl` do Martelo de Guerra, `8 po` do Machado Pesado, `8 pp` do Arco Curto,
  `2 po` da Camisa de malha).

**Liste no relato cada arquivo tocado**, e cada lugar que achou e deixou como está, com o porquê
(ex.: texto de lore que cita preço de época, legado marcado como tal). Os documentos de
`docs/simulacao/` e `docs/pendencias/` não se reescrevem por preço: são histórico.

## 3 · O aviso de provisório fica

O aviso de preços provisórios do capítulo (`custo-de-servico-e-itens.md:10`, o callout "Provisório")
**fica**: a revisão das outras fases continua. Se o texto dele ficar falso com os preços novos (ele
diz que listas e preços dos dois capítulos "não batem por completo"), ajuste só o necessário para ser
verdade e diga o que mudou; não o apague.

## 4 · As pendências de DESIGN, registradas sem corrigir

No tema G (`docs/pendencias/G-acoes-sistema.md`), depois da G35, com `[DECIDIR]`, a data e "levantado
na revisão econômica, proposta de preços das Fases 1 a 3". Uma por item, com as citações conferidas
por você no arquivo:

1. **A Brigandina domina a Cota de malha e a Camisa de malha** nas estatísticas
   (`armas-e-armaduras.md:118-120`), sendo mais barata; o legado diz que a brigandina era vestida
   "sobre malha" (legado `:187`, ache qual arquivo é o legado e cite o caminho). As estatísticas dela
   supõem malha por baixo?
2. **A Placa articulada (14 po) domina a Placa de transição (21 po):** estatísticas iguais, penalidade
   menor, mais barata.
3. **Kite × Heater:** mesmas estatísticas, Kite 2,5× mais caro. **Pavês × Scutum:** o Scutum (acesso 3)
   é mais barato que o Pavês (acesso 5).
4. **O Machado (3 po) é mais caro que a Espada Longa (25 pp)**, sendo mais leve e da mesma linha de
   fabricação.
5. **Preços provisórios de baixa confiança, sem linha de fabricação:** dardos, funda, bumerangue, rede.
6. **As três bestas mantidas sem base de custo:** dependem da G25 (peça composta).

Depois `node scripts/gen-pendencias.mjs`, e o `Pendencias.md` entra no mesmo commit. Número de item
novo: confira o último do tema G no arquivo antes de numerar.

## 5 · Os motivos, copiados da proposta (para o relato e para quem ler o JSON depois)

Base: custo = tempo da tabela de fabricação (`acoes-oficio-e-mundo.md`) × salário do produtor; preço
novo = 1,2 × custo base, arredondado (< 100 pc, múltiplo de 5; 100 a 999, múltiplo de 10; ≥ 1.000,
múltiplo de 100). Irmão: item novo com custo, peso e forma iguais a um já precificado copia o preço.

| Item | Atual → novo | Motivo |
|---|---|---|
| Sabre | 3 po → 17 pp | mesmas estatísticas da Espada Curta, um modo a menos |
| Martelo de Guerra | 1 pl → 6 po | sai de 2,7-3,6× o custo, abaixo do Montante |
| Machado Pesado | 8 po → 65 pp | deixa de superar o Montante |
| Arco Curto | 8 pp → 1 po | estava abaixo do custo de lote |
| Espada Serrilhada | sem → 25 pp | 1,2 × 210,9 |
| Maça | sem → 25 pp | irmã do Martelo ("mesma anatomia da Maça") |
| Picareta de Guerra | sem → 24 pp | 1,2 × 197,7 |
| Adaga de Arremesso | sem → 50 pc | 1,2 × 40 |
| Machado de Arremesso | sem → 80 pc | 1,2 × 65 |
| Azagaia | sem → 65 pc | 1,2 × 54, condicional à G25 |
| Pilum | sem → 5 pp | irmão da Lança, condicional à G25 |
| Dardos | sem → 5 pc cada | 5× a flecha, pelo tamanho; sem base de fabricação |
| Funda | sem → 1 pp | ≈ corda de 15 m; sem base de fabricação |
| Bumerangue | sem → 3 pp | madeira entalhada, abaixo do Bastão; sem base |
| Rede | sem → 3 pp | ~3× a corda de 15 m; sem base; unidade de venda pendente |
| Gambeson | sem → 14 pp | 1,2 × 115 |
| Couro endurecido | sem → 13 pp | pela linha da tabela (Dif 7): 1,2 × 111,4 |
| Brigandina | sem → 68 pp | 1,2 × 563 |
| Lamelar | sem → 7 po | preço em casa, 1,2 × 585 |
| Camisa de malha | 2 po → 9 po | família da Cota: 1,2 × 752 |
| Cota de malha | sem → 13 po | 1,2 × 1.092 |
| Placa de munição | sem → 14 po | produzida em série: lote 1.196 × 1,2 |
| Placa de transição | sem → 21 po | malha + placas, 1,2 × 1.751, condicional à G25 |
| Placa completa | sem → 26 po | fechada ao oficial, perito, Dif 11: 1,2 × 2.160 |

Os motivos **não entram no JSON nem no livro** nesta rodada; são para o relato e a revisão.

## 6 · A prova

- `npm run validate` e `npm run build` verdes; o gancho roda o resto. Diga a saída das duas.
- O que a ficha mostra: o preço de pelo menos uma arma nova e uma armadura nova aparece onde a ficha
  mostra preço (se a ficha mostrar preço; se não mostrar, diga onde procurou).
- Travessão lendo os arquivos, zero linha nova com travessão.
- O commit que toca `src/` abre com a linha do que muda para quem joga (preços novos de armas e
  armaduras no catálogo e na ficha; itens que não tinham preço passam a ter; sem migração, e diga se
  alguma ficha salva guarda preço copiado que fica velho).

## 7 · O relato

`107-executora.md`, as quatro seções, com o que mudou em cada arquivo, os shas publicados, a prova dos
dardos e a lista dos lugares achados e deixados. **Escreva o `progresso-107.md` desde a primeira
etapa**, uma linha por etapa pequena.
