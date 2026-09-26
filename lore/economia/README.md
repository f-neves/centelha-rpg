# Economia mundana · o modelo e a revisão

Esta pasta guarda o **modelo** que calcula os preços, as rendas e os custos do mundo mundano de
Centelha (sem Centelha, Proeza ou Arte), e os documentos da revisão que o decidiu.

## Os JSONs do site saem daqui

Sete arquivos de `src/data/` são **gerados** por `v2/gerar.py`, a partir do modelo desta pasta:

- `mercadorias.json`
- `montarias-veiculos.json`
- `servicos.json`
- `pacotes-equipamento.json`
- `renda.json`
- `custo-de-vida.json`
- `viagens.json`

**Não edite preço à mão em nenhum deles.** Mude o modelo (`v2/modelo.py`, `v2/mercadorias.py`,
`v2/base.py`) e gere de novo. A `_nota` de cada JSON diz a mesma coisa.

O `gerar.py` já escreve todo valor em dinheiro no formato do site, `{"por": ..., "preco": {"pc": N}}`,
com `por` de um vocabulário fechado (a lista está no começo do `v2/gerar.py` e no esquema de
`scripts/validate-data.mjs`). **Regra do vocabulário:** um serviço novo usa um valor que já existe
sempre que couber; valor novo só quando nenhum couber, e registrado com o motivo no `gerar.py` e
no esquema. Entre a saída dele e o `src/data` há só uma cópia, com três
transformações declaradas e nenhuma outra mudança:
- a `_nota` de cada arquivo;
- o envelope `{_nota, itens}` nos dois que são lista;
- a procedência tirada das montarias.
Quem faz a cópia é `scripts/copiar-economia.mjs`. O `--check` dele roda no `npm run validate` e
exige que o modelo, refeito, dê exatamente o `src/data` e as procedências desta pasta. As
decisões de forma são das rodadas 110 a 112 (`docs/simulacao/caixa/110-executora.md`,
`111-executora.md` e `112-executora.md`). As tabelas do capítulo Custo de Serviço & Itens saem
desses JSONs por `scripts/gen-cap-economia.mjs`.

## Como gerar

Na pasta do modelo:

```sh
cd lore/economia/v2
python3 gerar.py        # no Windows, python gerar.py
```

Os JSONs e as tabelas em Markdown do documento (`tab_*.md`) saem em `out/`, relativo à pasta
onde roda, e o `.gitignore` ignora essa pasta. Para levar o resultado ao site, rode da raiz do
repositório `node scripts/copiar-economia.mjs`, que gera tudo de novo por conta própria, e depois
`node scripts/gen-cap-economia.mjs`, para as tabelas do capítulo.

## A âncora

**1 dia de braçal = 10 pc = 1,5 penny** (Inglaterra, 1300 a 1340). Todo preço do sistema sai dessa
âncora, e a procedência de cada mercadoria diz como se chegou a ele. As decisões estão em três
lugares: a versão 1 (`etapas-abc/revisao-economica-etapas-abc.md`), a versão 2
(`v2/revisao-economica-v2.md`) e o `estado-revisao.md`, cuja "LISTA DE IMPLEMENTAÇÃO · FINAL
(Rodada D2)" é a fonte do que entrou no livro.

## O que há na pasta

| caminho | o que é |
|---|---|
| `v2/` | o modelo em uso (`base.py`, `mercadorias.py`, `modelo.py`, `gerar.py`), o documento da versão 2 (`revisao-economica-v2.md`) e a procedência das mercadorias |
| `etapas-abc/` | o modelo e o documento da versão 1 (Etapas A, B e C), guardados como história da decisão |
| `estado-revisao.md` | o estado da revisão, rodada a rodada; a "LISTA DE IMPLEMENTAÇÃO · FINAL (Rodada D2)" é a fonte do que entrou no livro |
| `catalogo-unificado.md` | o catálogo de preços e pesos que a revisão tomou como ponto de partida (citado no `estado-revisao.md`) |
| `anexo-auditoria-f1-f3.md` | a auditoria das Fases 1 a 3 (armas, escudos, armaduras), citada no `estado-revisao.md` |
| `mercadorias.procedencia.json` | de onde vem o preço de cada mercadoria (fonte, confiança, nota); cópia da de `v2/` |
| `montarias.procedencia.json` | o mesmo para montarias, animais e veículos, tirado de `montarias-veiculos.json` na rodada 110 |

A procedência é **lore**, e não dado de jogo: nada do site a lê.

## O que não está aqui, de propósito

Os zips, o `__pycache__` e as cópias dos JSONs gerados que ficavam ao lado do modelo não entram, e o
`.gitignore` os ignora pelo nome:
- os zips são pacotes de entrega;
- o `__pycache__` é saída do Python;
- os JSONs gerados já moram em `src/data`, e duas cópias do mesmo gerado descolariam.
Os arquivos de proposta preliminar também ficam de fora.
