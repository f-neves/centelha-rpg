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

Entre a saída do `gerar.py` e o `src/data` há uma cópia com transformações declaradas, e nenhuma
outra mudança:
- a `_nota` de cada arquivo;
- o envelope `{_nota, itens}` nos dois que são lista;
- a procedência tirada das montarias;
- todo valor em dinheiro como `{por, preco: {pc}}`.
Essa cópia foi feita nas rodadas 110 e 111 (`docs/simulacao/caixa/110-executora.md` e
`111-executora.md`). As tabelas do capítulo Custo de Serviço & Itens saem desses JSONs por
`scripts/gen-cap-economia.mjs`.

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

Os zips, o `__pycache__` e as cópias dos JSONs gerados que ficavam ao lado do modelo não entram:
- os zips são pacotes de entrega;
- o `__pycache__` é saída do Python;
- os JSONs gerados já moram em `src/data`, e duas cópias do mesmo gerado descolariam.
Os arquivos de proposta preliminar também ficam de fora.
