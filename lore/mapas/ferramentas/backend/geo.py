"""Distância real sobre Uldun (grande círculo), do lado do servidor.

É a fonte única da fórmula no Python: a atração automática das estradas
(`backend/estradas.py`) mede com ela, e `tests/test_haversine.py` a importa daqui em
vez de manter uma cópia própria (até a etapa 9 o teste tinha a sua).

No navegador a fórmula precisa existir de novo, em JavaScript, e mora num arquivo só:
`static/js/geo.js`, usado pela régua. As duas não podem ser uma só (uma roda no
servidor, a outra na página), então o que garante que dizem o mesmo é
`tests/test_haversine.py`, que roda o `geo.js` de verdade no node e compara com esta
função nos mesmos pontos, com um controle negativo que prova que a comparação pega
uma fórmula alterada.

O raio é o de Uldun (`dados/coordenadas.json`, `planeta.raio_km`), nunca o da Terra:
o planeta tem 1,25 vez o raio terrestre, e usar o número errado erraria toda
distância por 25%.
"""

import math

from . import coordenadas


def raio_km() -> float:
    return coordenadas.carregar_coordenadas()["planeta"]["raio_km"]


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float,
                 raio: float | None = None) -> float:
    raio = raio if raio is not None else raio_km()
    f1, f2 = math.radians(lat1), math.radians(lat2)
    df = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(df / 2) ** 2 + math.cos(f1) * math.cos(f2) * math.sin(dl / 2) ** 2
    return 2 * raio * math.asin(min(1.0, math.sqrt(a)))
