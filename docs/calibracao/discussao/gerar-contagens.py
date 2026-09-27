"""Gera a tabela documental a partir do catálogo vivo, sem alterar as fontes."""
from pathlib import Path
from collections import Counter
import hashlib
import json

here = Path(__file__).resolve().parent
source = here.parents[3] / 'src/data/tecnicas.json'
raw = source.read_bytes()
records = json.loads(raw.decode('utf-8'))
assert len({r['id'] for r in records}) == len(records), 'IDs duplicados'
counts = Counter()
for r in records:
    assert isinstance(r['prereq'], list), r['id']
    assert isinstance(r['custo'], dict), r['id']
    values = list(r['custo'].values())
    assert all(isinstance(v, (int, float)) and v >= 0 for v in values), r['id']
    counts[(r['tipo'], any(v > 0 for v in values))] += 1
with_prereq = sum(bool(r['prereq']) for r in records)
with_cost = sum(n for (kind, paid), n in counts.items() if paid)
lines = [
    '# Contagens para o dossiê', '',
    'FATO: tabela gerada por `gerar-contagens.py` a partir de `src/data/tecnicas.json`.',
    'Regenerar a cada exportação do dossiê. Não editar os números manualmente.', '',
    '| Indicador | Técnicas |', '|---|---:|',
    f'| Total | {len(records)} |',
    f'| Com pré-requisito de outra Técnica | {with_prereq} |',
    f'| Sem pré-requisito de outra Técnica | {len(records)-with_prereq} |',
    f'| Com custo de recurso por uso | {with_cost} |',
    f'| Sem custo de recurso por uso | {len(records)-with_cost} |', '',
    '| Tipo | Com custo | Sem custo | Total |', '|---|---:|---:|---:|',
]
for kind in sorted({r['tipo'] for r in records}):
    paid, free = counts[kind, True], counts[kind, False]
    lines.append(f'| {kind} | {paid} | {free} | {paid+free} |')
lines += ['', 'Custo significa valor positivo no campo `custo`; não inclui tempo de ação ou XP.',
          'Pré-requisito significa lista `prereq` não vazia; não inclui o requisito geral de Centelha.',
          '', f'SHA256 da fonte: `{hashlib.sha256(raw).hexdigest()}`.', '']
with open(here / 'contagens-dossie.md', 'w', encoding='utf-8', newline='\n') as out:
    out.write('\n'.join(lines))
print(f'{len(records)} Técnicas; {with_prereq} com pré-requisito; {with_cost} com custo.')
