# Contagens para o dossiê

FATO: tabela gerada por `gerar-contagens.py` a partir de `src/data/tecnicas.json`.
Regenerar a cada exportação do dossiê. Não editar os números manualmente.

| Indicador | Técnicas |
|---|---:|
| Total | 461 |
| Com pré-requisito de outra Técnica | 411 |
| Sem pré-requisito de outra Técnica | 50 |
| Com custo de recurso por uso | 373 |
| Sem custo de recurso por uso | 88 |

| Tipo | Com custo | Sem custo | Total |
|---|---:|---:|---:|
| ativa | 347 | 0 | 347 |
| passiva | 0 | 88 | 88 |
| reflexiva | 26 | 0 | 26 |

Custo significa valor positivo no campo `custo`; não inclui tempo de ação ou XP.
Pré-requisito significa lista `prereq` não vazia; não inclui o requisito geral de Centelha.

SHA256 da fonte: `67bad3949d22d034f3d908596a15b0b6320a393e7d1764c593dc21b1e146d50f`.
