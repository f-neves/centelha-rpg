"""Mede o custo de calcular a cobertura automática e guarda o resultado em arquivo.

Pedido do usuário em 2026-09-23 (décima primeira rodada): guardar a medição em
`dados/medicoes_desempenho.json` para poder comparar com o custo REAL quando a
pintura estiver avançada. Os números soltos na conversa envelhecem e somem; num
arquivo, a comparação futura é uma subtração.

O que é medido: `cobertura_automatica.colecao()`, que é onde mora o trabalho (montar
as faixas e subtrair a união do que está pintado). Não mede rede nem serialização da
resposta, mas guarda o tamanho da resposta junto, que é o outro custo que cresce.

**Nada aqui toca no dado real**: o arquivo de áreas usado é um temporário, apontado
por monkeypatch do mesmo jeito que os testes fazem; `dados/areas-pintadas.geojson`
não é lido nem escrito.

Uso (de dentro de lore/mapas/ferramentas/):
    .venv/Scripts/python.exe scripts/medir_automatico.py            # imprime
    .venv/Scripts/python.exe scripts/medir_automatico.py --gravar   # grava também
"""

import json
import math
import random
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend import areas, cobertura_automatica  # noqa: E402

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_SAIDA = RAIZ_MAPAS / "dados" / "medicoes_desempenho.json"

# (quantidade de áreas pintadas, vértices por área). Os quatro primeiros são os casos
# que o usuário pediu; os dois últimos são o teto, para achar onde dói.
CASOS = ((50, 12), (200, 12), (500, 12), (1000, 12), (500, 100), (500, 400))
REPETICOES = 5


def _poligono(vertices: int, sorteio: random.Random) -> dict:
    cx = sorteio.uniform(-40, 40)
    cy = sorteio.uniform(-20, 65)
    r = sorteio.uniform(0.5, 3.0)
    anel = [
        [cx + r * math.cos(2 * math.pi * k / vertices), cy + r * math.sin(2 * math.pi * k / vertices)]
        for k in range(vertices)
    ]
    anel.append(anel[0])
    return {"type": "Polygon", "coordinates": [anel]}


def medir() -> list[dict]:
    pasta = Path(tempfile.mkdtemp())
    alvo = pasta / "areas-pintadas.geojson"
    caminho_real = areas.CAMINHO_DADOS
    areas.CAMINHO_DADOS = alvo  # nunca o arquivo de verdade
    try:
        linhas = []
        for quantidade, vertices in CASOS:
            sorteio = random.Random(7)
            alvo.write_text(json.dumps({
                "type": "FeatureCollection", "properties": {},
                "features": [
                    {"type": "Feature", "geometry": _poligono(vertices, sorteio),
                     "properties": {"id": f"a-{i}", "camada": "cobertura", "valor": "campo"}}
                    for i in range(quantidade)
                ],
            }), encoding="utf-8")
            tempos = []
            for _ in range(REPETICOES):
                inicio = time.perf_counter()
                colecao = cobertura_automatica.colecao()
                tempos.append(time.perf_counter() - inicio)
            tempos.sort()
            linhas.append({
                "areas_pintadas": quantidade,
                "vertices_por_area": vertices,
                "mediana_ms": round(tempos[len(tempos) // 2] * 1000, 1),
                "resposta_kb": round(len(json.dumps(colecao)) / 1024, 1),
            })
        return linhas
    finally:
        areas.CAMINHO_DADOS = caminho_real


def main() -> int:
    linhas = medir()
    print(f"{'áreas':>7} {'vértices':>9} {'mediana (ms)':>13} {'resposta (KB)':>14}")
    for l in linhas:
        print(f"{l['areas_pintadas']:>7} {l['vertices_por_area']:>9} {l['mediana_ms']:>13} {l['resposta_kb']:>14}")

    if "--gravar" not in sys.argv:
        print("\n(modo relatório, nada gravado; use --gravar para guardar em dados/)")
        return 0

    documento = {
        "_comentario": (
            "Custo de calcular a cobertura automática, medido para comparar com o "
            "custo REAL quando a pintura estiver avançada. Gerado por "
            "scripts/medir_automatico.py --gravar; cada rodada acrescenta uma entrada "
            "em 'medicoes', nunca substitui, senão a comparação se perde."
        ),
        "versao_esquema": 1,
        "medicoes": [],
    }
    if CAMINHO_SAIDA.exists():
        documento = json.loads(CAMINHO_SAIDA.read_text(encoding="utf-8"))
    documento["medicoes"].append({
        "quando": time.strftime("%Y-%m-%d %H:%M:%S"),
        "o_que": "cobertura_automatica.colecao()",
        "repeticoes": REPETICOES,
        "criterio": "mediana",
        "poligonos": "sintéticos, espalhados pela tela, semente fixa 7",
        "limite_do_usuario_ms": 500,
        "linhas": linhas,
    })
    CAMINHO_SAIDA.write_text(
        json.dumps(documento, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8", newline="\n",
    )
    print(f"\ngravado em dados/{CAMINHO_SAIDA.name} ({len(documento['medicoes'])} medição(ões))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
