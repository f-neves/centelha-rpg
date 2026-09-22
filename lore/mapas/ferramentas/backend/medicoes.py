"""Medições salvas pela régua da ferramenta (item 3e do pedido de 2026-09-23).
Grava em dados/medicoes.json, mesma regra criada em 2026-09-23 ("Regras
invioláveis" do CARTOGRAFO.md): toda distância registrada guarda os pontos que
a calcularam. Medições salvas pela ferramenta são sempre `"reproduzivel":
true` (o ponto forte de nascerem aqui: os pontos SÃO os que geraram o número,
não uma reconstrução).

Gravação direta (atômica, com histórico via `historico.py`), não passa pelo
desfazer/refazer de `operacoes.py`: uma medição salva é um registro histórico
avulso (como uma nota), não um objeto do mundo que faça sentido "desfazer" no
mesmo sentido de um lugar ou uma área.
"""

import json
import time
import uuid
from pathlib import Path

from . import historico

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "medicoes.json"


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _validar_pontos(pontos: list) -> None:
    if not isinstance(pontos, list) or len(pontos) < 2:
        raise ValueError("uma medição precisa de pelo menos 2 pontos")
    for p in pontos:
        if not isinstance(p, dict) or "lat" not in p or "lon" not in p:
            raise ValueError("cada ponto precisa de 'lat' e 'lon'")
        if not isinstance(p["lat"], (int, float)) or not isinstance(p["lon"], (int, float)):
            raise ValueError("'lat'/'lon' de cada ponto têm que ser número")


def criar_medicao(pontos: list, trechos_km: list, distancia_total_km: float, nome: str | None) -> dict:
    """`pontos`: lista de {"lat":, "lon":}, na ordem clicada. `trechos_km`: a
    distância de cada segmento consecutivo (tem que ter um a menos que
    `pontos`). Controle negativo coberto por `_validar_pontos` (menos de 2
    pontos, ponto sem lat/lon, lat/lon não numérico)."""
    _validar_pontos(pontos)
    if not isinstance(trechos_km, list) or len(trechos_km) != len(pontos) - 1:
        raise ValueError(f"'trechos_km' tem que ter {len(pontos) - 1} valor(es) para {len(pontos)} pontos")
    if not isinstance(distancia_total_km, (int, float)) or distancia_total_km <= 0:
        raise ValueError("'distancia_total_km' tem que ser um número positivo")

    # Nome só de espaço é o mesmo que nome nenhum: `"descricao": "   "` seria um
    # nome que parece existir na listagem e não diz nada. O modal já manda null
    # nesse caso, mas a API é chamável direto -- a garantia mora aqui.
    nome_limpo = nome.strip() if isinstance(nome, str) else None

    dados = carregar()
    id_medicao = f"regua-{time.strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:6]}"
    medicao = {
        "id": id_medicao,
        "descricao": nome_limpo or None,
        "distancia_km": round(distancia_total_km, 1),
        "trechos_km": [round(t, 1) for t in trechos_km],
        "metodo": "grande círculo (haversine), medido na régua da ferramenta",
        "pontos": pontos,
        "reproduzivel": True,
        "registrada_em": "ferramenta (régua), salva pelo usuário",
    }
    dados["medicoes"].append(medicao)
    historico.gravar_json_com_historico(CAMINHO_DADOS, dados)
    return medicao
