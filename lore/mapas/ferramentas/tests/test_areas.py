"""Testes de backend/areas.py -- Ferramenta de Área, etapa B4 (2026-09-23).
Isolado: nunca toca em dados/areas-pintadas.geojson de verdade.

Cada validação com o controle negativo do lado, e o arquivo conferido intacto
depois de cada recusa.
"""

import json

import pytest
from shapely.geometry import shape

from backend import areas, historico, operacoes, travas


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


def _feature(id_area):
    return areas._achar(areas.carregar(), id_area)


def _area_de(id_area):
    return shape(_feature(id_area)["geometry"]).area


# --- Criar e validar ---------------------------------------------------------

def test_criar_area_grava(ambiente_isolado):
    f = areas.criar_area("area-1", "relevo", "montanha", _quadrado(0, 0, 10, 10))
    assert f["properties"]["travado"] is False
    assert isinstance(f["properties"]["semente_ruido"], int)
    assert len(areas.carregar()["features"]) == 1


def test_valor_fora_da_camada_e_recusado(ambiente_isolado):
    """Controle negativo do vocabulário: 'montanha' é relevo, não cobertura."""
    with pytest.raises(ValueError, match="valor"):
        areas.criar_area("x", "cobertura", "montanha", _quadrado(0, 0, 10, 10))
    assert areas.carregar()["features"] == []


def test_camada_inventada_e_recusada(ambiente_isolado):
    with pytest.raises(ValueError, match="camada"):
        areas.criar_area("x", "inventada", "montanha", _quadrado(0, 0, 10, 10))
    assert areas.carregar()["features"] == []


def test_geometria_sem_area_e_recusada(ambiente_isolado):
    """Controle negativo da geometria: três pontos em linha reta não são área."""
    degenerado = {"type": "Polygon", "coordinates": [[[0, 0], [5, 0], [10, 0], [0, 0]]]}
    with pytest.raises(ValueError, match="área"):
        areas.criar_area("x", "relevo", "colina", degenerado)
    assert areas.carregar()["features"] == []


def test_linha_nao_e_area(ambiente_isolado):
    with pytest.raises(ValueError, match="Polygon"):
        areas.criar_area("x", "relevo", "colina", {"type": "LineString", "coordinates": [[0, 0], [1, 1]]})


def test_id_repetido_e_recusado(ambiente_isolado):
    areas.criar_area("area-1", "relevo", "colina", _quadrado(0, 0, 10, 10))
    with pytest.raises(ValueError, match="id já existe"):
        areas.criar_area("area-1", "relevo", "montanha", _quadrado(20, 20, 30, 30))
    assert len(areas.carregar()["features"]) == 1


# --- Recorte -----------------------------------------------------------------

def test_area_nova_recorta_a_antiga_da_mesma_camada(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.criar_area("nova", "relevo", "montanha", _quadrado(5, 0, 15, 10))
    assert _area_de("velha") == pytest.approx(50.0)
    assert _area_de("nova") == pytest.approx(100.0), "a nova entra inteira; quem cede é a antiga"


def test_recorte_nao_atravessa_camada(ambiente_isolado):
    """Controle negativo do recorte: a mesma sobreposição entre camadas
    DIFERENTES não pode recortar nada (relevo e cobertura convivem no mesmo
    pedaço de terra)."""
    areas.criar_area("relevo-1", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.criar_area("cobertura-1", "cobertura", "campo", _quadrado(0, 0, 10, 10))
    assert _area_de("relevo-1") == pytest.approx(100.0)


def test_recorte_que_parte_em_dois_vira_multipolygon(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 30, 10))
    areas.criar_area("faixa", "relevo", "montanha", _quadrado(10, -5, 20, 15))
    velha = _feature("velha")
    assert velha["geometry"]["type"] == "MultiPolygon"
    assert len(velha["geometry"]["coordinates"]) == 2
    assert _area_de("velha") == pytest.approx(200.0)


def test_antiga_totalmente_coberta_some(ambiente_isolado):
    areas.criar_area("pequena", "relevo", "colina", _quadrado(2, 2, 4, 4))
    areas.criar_area("grande", "relevo", "montanha", _quadrado(0, 0, 10, 10))
    assert [f["properties"]["id"] for f in areas.carregar()["features"]] == ["grande"]


def test_recorte_inteiro_e_uma_operacao_so(ambiente_isolado):
    """Um traço que recorta três áreas é UM desfazer, não três."""
    for i, x in enumerate([0, 10, 20]):
        areas.criar_area(f"v{i}", "relevo", "colina", _quadrado(x, 0, x + 10, 10))
    areas.criar_area("faixa", "relevo", "montanha", _quadrado(0, 4, 30, 6))
    assert sum(_area_de(f"v{i}") for i in range(3)) == pytest.approx(240.0)

    operacoes.desfazer()
    ids = sorted(f["properties"]["id"] for f in areas.carregar()["features"])
    assert ids == ["v0", "v1", "v2"]
    assert all(_area_de(f"v{i}") == pytest.approx(100.0) for i in range(3))


# --- Trava -------------------------------------------------------------------

def test_area_travada_nao_e_recortada_quem_cede_e_a_nova(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.definir_trava("velha", True)
    areas.criar_area("nova", "relevo", "montanha", _quadrado(5, 0, 15, 10))
    assert _area_de("velha") == pytest.approx(100.0), "área travada não muda nem por recorte"
    assert _area_de("nova") == pytest.approx(50.0), "quem cede é a nova"


def test_nova_engolida_por_travada_e_recusada(ambiente_isolado):
    """Controle negativo do caso acima: se não sobra nada da nova, ela não é
    gravada como polígono vazio -- a criação é recusada e o arquivo não muda."""
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.definir_trava("velha", True)
    with pytest.raises(ValueError, match="travadas"):
        areas.criar_area("nova", "relevo", "montanha", _quadrado(2, 2, 8, 8))
    assert [f["properties"]["id"] for f in areas.carregar()["features"]] == ["velha"]


def test_area_travada_nao_apaga(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.definir_trava("velha", True)
    with pytest.raises(travas.Travado):
        areas.apagar_area("velha")
    assert len(areas.carregar()["features"]) == 1


def test_camada_de_area_travada_bloqueia(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    travas.definir_trava_camada("relevo", True)
    with pytest.raises(travas.Travado):
        areas.criar_area("nova", "relevo", "montanha", _quadrado(20, 20, 30, 30))
    with pytest.raises(travas.Travado):
        areas.apagar_area("velha")
    # ...e a camada vizinha continua livre (controle positivo do alcance da trava)
    areas.criar_area("cob", "cobertura", "campo", _quadrado(0, 0, 10, 10))
    assert len(areas.carregar()["features"]) == 2


def test_destravada_volta_a_ser_recortada(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.definir_trava("velha", True)
    areas.definir_trava("velha", False)
    areas.criar_area("nova", "relevo", "montanha", _quadrado(5, 0, 15, 10))
    assert _area_de("velha") == pytest.approx(50.0)


# --- Desfazer ----------------------------------------------------------------

def test_desfazer_apagar_devolve_a_area(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.apagar_area("velha")
    assert areas.carregar()["features"] == []
    operacoes.desfazer()
    assert _area_de("velha") == pytest.approx(100.0)


def test_desfazer_criacao_desfaz_o_recorte_junto(ambiente_isolado):
    areas.criar_area("velha", "relevo", "colina", _quadrado(0, 0, 10, 10))
    areas.criar_area("nova", "relevo", "montanha", _quadrado(5, 0, 15, 10))
    operacoes.desfazer()
    ids = [f["properties"]["id"] for f in areas.carregar()["features"]]
    assert ids == ["velha"]
    assert _area_de("velha") == pytest.approx(100.0), "o recorte volta atrás junto com a área nova"
    operacoes.refazer()
    assert _area_de("velha") == pytest.approx(50.0)
