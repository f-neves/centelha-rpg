"""Relevo automático `planicie`: uma faixa só, e nunca gravado.

Mesmo contrato do automático de cobertura, com dois controles negativos próprios: a
independência entre as camadas (pintar cobertura não pode abrir buraco no relevo) e a
gravação (pedir o automático não pode tocar em arquivo nenhum).
"""

import json

import pytest
from shapely.geometry import Point, shape
from shapely.ops import unary_union

from backend import (areas, cobertura_automatica, coordenadas, historico, operacoes,
                     relevo_automatico, travas)


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".historico")

    caminho = tmp_path / "dados" / "areas-pintadas.geojson"
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(areas, "CAMINHO_DADOS", caminho)

    caminho_travas = tmp_path / "dados" / "camadas_travadas.json"
    caminho_travas.write_text(
        json.dumps({"versao_esquema": 1, "camadas": [{"id": c, "travada": False} for c in travas.CAMADAS_VALIDAS]}),
        encoding="utf-8",
    )
    monkeypatch.setattr(travas, "CAMINHO_DADOS", caminho_travas)
    return tmp_path


def _quadrado(x0, y0, x1, y1):
    return {"type": "Polygon", "coordinates": [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]]}


def test_e_uma_faixa_so_cobrindo_a_tela_inteira(ambiente_isolado):
    faixas = relevo_automatico.faixas()
    limites = coordenadas.carregar_coordenadas()["limites_da_tela"]
    assert len(faixas) == 1
    assert faixas[0]["valor"] == "planicie"
    assert faixas[0]["lat_max"] == limites["latitude_topo"]
    assert faixas[0]["lat_min"] == limites["latitude_base"]
    assert faixas[0]["valor"] in areas.VALORES_POR_CAMADA["relevo"]


def test_pintar_relevo_tira_o_automatico_e_apagar_devolve(ambiente_isolado):
    antes = unary_union([shape(f["geometry"]) for f in relevo_automatico.colecao()["features"]]).area

    areas.criar_area("area-r1", "relevo", "montanha", _quadrado(0, 19, 2, 21))
    depois = relevo_automatico.colecao()
    assert unary_union([shape(f["geometry"]) for f in depois["features"]]).area == pytest.approx(antes - 4.0)
    assert not [f for f in depois["features"] if shape(f["geometry"]).contains(Point(1, 20))]

    areas.apagar_area("area-r1")
    devolvido = unary_union([shape(f["geometry"]) for f in relevo_automatico.colecao()["features"]]).area
    assert devolvido == pytest.approx(antes)


def test_cobertura_pintada_nao_abre_buraco_no_relevo(ambiente_isolado):
    """CONTROLE NEGATIVO da independência entre camadas, nos dois sentidos: aqui
    pintando cobertura e olhando o relevo (o teste espelhado, pintando relevo e
    olhando a cobertura, está em test_cobertura_automatica.py)."""
    antes = unary_union([shape(f["geometry"]) for f in relevo_automatico.colecao()["features"]]).area
    areas.criar_area("area-c1", "cobertura", "campo", _quadrado(0, 19, 2, 21))
    depois = unary_union([shape(f["geometry"]) for f in relevo_automatico.colecao()["features"]]).area
    assert depois == pytest.approx(antes)
    # E a cobertura, essa sim, perdeu o pedaço: a prova de que a pintura aconteceu e o
    # teste não passou por não ter pintado nada.
    cobertura = unary_union([shape(f["geometry"]) for f in cobertura_automatica.colecao()["features"]])
    assert not cobertura.contains(Point(1, 20))


def test_o_automatico_de_relevo_nunca_e_gravado(ambiente_isolado):
    antes = json.dumps(areas.carregar(), sort_keys=True)
    log = operacoes.CAMINHO_LOG
    tamanho_antes = log.stat().st_size if log.exists() else 0

    for _ in range(3):
        colecao = relevo_automatico.colecao()
        assert colecao["features"], "a coleção veio vazia: o teste não testou nada"
        assert all("id" not in f["properties"] for f in colecao["features"])
        assert all(f["properties"]["automatico"] is True for f in colecao["features"])
        assert all(f["properties"]["camada"] == "relevo" for f in colecao["features"])

    assert json.dumps(areas.carregar(), sort_keys=True) == antes
    assert (log.stat().st_size if log.exists() else 0) == tamanho_antes
    assert areas.carregar()["features"] == []
