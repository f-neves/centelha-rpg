"""Testes de backend/areas.py -- Ferramenta de Área, etapa B4 (2026-09-23).
Isolado: nunca toca em dados/areas-pintadas.geojson de verdade.

Cada validação com o controle negativo do lado, e o arquivo conferido intacto
depois de cada recusa.
"""

import json
import math

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


# --- Área de exemplo (2026-09-23, noite) ----------------------------------------------

def test_area_de_exemplo_grava_a_marca(ambiente_isolado):
    areas.criar_area("exemplo-1", "cobertura", "selva", _quadrado(0, 0, 5, 5), exemplo=True)
    assert _feature("exemplo-1")["properties"]["exemplo"] is True


def test_area_comum_nao_tem_a_marca(ambiente_isolado):
    """Controle negativo: sem pedir, o campo não aparece (nem como false)."""
    areas.criar_area("area-1", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    assert "exemplo" not in _feature("area-1")["properties"]


def test_marca_de_exemplo_que_nao_e_booleana_e_recusada(ambiente_isolado):
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(ValueError):
        areas.criar_area("exemplo-1", "cobertura", "selva", _quadrado(0, 0, 5, 5), exemplo="sim")
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_a_rota_nao_aceita_marca_de_exemplo_em_texto():
    """O pydantic em modo frouxo converteria "yes" em True; o campo é StrictBool."""
    from pydantic import ValidationError
    from backend.main import NovaArea
    base = {"id": "x", "camada": "cobertura", "valor": "selva", "geometria": _quadrado(0, 0, 1, 1)}
    assert NovaArea(**base, exemplo=True).exemplo is True
    assert NovaArea(**base).exemplo is False
    with pytest.raises(ValidationError):
        NovaArea(**base, exemplo="yes")


# --- Edição de vértice (2026-09-23, noite) ------------------------------------------

def test_editar_area_troca_a_geometria_e_guarda_o_resto(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5), semente_ruido=42, exemplo=True)
    areas.editar_geometria("a", _quadrado(0, 0, 8, 5))
    f = _feature("a")
    assert shape(f["geometry"]).area == pytest.approx(40)
    assert f["properties"]["semente_ruido"] == 42 and f["properties"]["exemplo"] is True


def test_editar_area_recorta_a_vizinha_da_mesma_camada(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    areas.criar_area("b", "cobertura", "deserto", _quadrado(5, 0, 10, 5))
    areas.criar_area("r", "relevo", "montanha", _quadrado(5, 0, 10, 5))
    areas.editar_geometria("a", _quadrado(0, 0, 7, 5))
    assert _area_de("b") == pytest.approx(15)
    assert _area_de("r") == pytest.approx(25)       # outra camada não se recorta
    # Um desfazer devolve as duas de uma vez: é uma operação só.
    operacoes.desfazer()
    assert _area_de("a") == pytest.approx(25) and _area_de("b") == pytest.approx(25)


def test_editar_area_cede_a_vizinha_travada(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    areas.criar_area("b", "cobertura", "deserto", _quadrado(5, 0, 10, 5))
    areas.definir_trava("b", True)
    areas.editar_geometria("a", _quadrado(0, 0, 7, 5))
    assert _area_de("a") == pytest.approx(25) and _area_de("b") == pytest.approx(25)


def test_area_travada_nao_se_edita(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    areas.definir_trava("a", True)
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(travas.Travado):
        areas.editar_geometria("a", _quadrado(0, 0, 8, 5))
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_editar_area_com_camada_travada_e_recusado(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    travas.definir_trava_camada("cobertura", True)
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(travas.Travado):
        areas.editar_geometria("a", _quadrado(0, 0, 8, 5))
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_editar_area_com_geometria_invalida_nao_grava(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 5, 5))
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(ValueError):
        areas.editar_geometria("a", {"type": "LineString", "coordinates": [[0, 0], [1, 1]]})
    with pytest.raises(KeyError):
        areas.editar_geometria("nao-existe", _quadrado(0, 0, 5, 5))
    assert areas.CAMINHO_DADOS.read_bytes() == antes


# --- Pincel (2026-09-23, noite) --------------------------------------------------------
# 139 km é 1 grau (km_por_grau de coordenadas.json), então os raios abaixo são em graus
# redondos.
UM_GRAU_KM = 138.993658


def _ids_da_camada(camada):
    return sorted(f["properties"]["id"] for f in areas.carregar()["features"] if f["properties"]["camada"] == camada)


def test_pincelada_no_vazio_cria_area_nova(ambiente_isolado):
    r = areas.pincelar("cobertura", "selva", [[0, 0], [4, 0]], UM_GRAU_KM, "pintar")
    assert r == {"id": "area-0001", "mudou": True}
    forma = shape(_feature("area-0001")["geometry"])
    assert forma.area == pytest.approx(4 * 2 + math.pi, rel=0.05)   # cápsula de 4 x 2 graus


def test_pincelada_funde_com_a_area_do_mesmo_valor_e_guarda_a_semente(ambiente_isolado):
    areas.criar_area("b", "cobertura", "selva", _quadrado(0, 0, 3, 3), semente_ruido=77)
    r = areas.pincelar("cobertura", "selva", [[3, 1.5], [6, 1.5]], UM_GRAU_KM / 2, "pintar")
    assert r["id"] == "b" and _ids_da_camada("cobertura") == ["b"]
    assert _feature("b")["properties"]["semente_ruido"] == 77
    assert _area_de("b") > 9 + 2.5


def test_pincelada_que_liga_duas_irmas_absorve_a_segunda(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 2, 2))
    areas.criar_area("c", "cobertura", "selva", _quadrado(5, 0, 7, 2))
    areas.pincelar("cobertura", "selva", [[1, 1], [6, 1]], UM_GRAU_KM / 2, "pintar")
    assert _ids_da_camada("cobertura") == ["a"]
    # Uma operação só: um desfazer devolve as duas separadas.
    operacoes.desfazer()
    assert _ids_da_camada("cobertura") == ["a", "c"]


def test_pincelada_recorta_outro_valor_e_nao_funde_com_ele(ambiente_isolado):
    """Controle negativo da fusão: valor diferente é recortado, nunca absorvido."""
    areas.criar_area("d", "cobertura", "deserto", _quadrado(0, 0, 4, 4))
    areas.pincelar("cobertura", "selva", [[2, 2]], UM_GRAU_KM, "pintar")
    assert _ids_da_camada("cobertura") == ["area-0001", "d"]
    assert _area_de("d") == pytest.approx(16 - math.pi, rel=0.05)


def test_pincelada_cede_a_area_travada_e_nao_funde_com_irma_travada(ambiente_isolado):
    areas.criar_area("t", "cobertura", "selva", _quadrado(0, 0, 4, 4))
    areas.definir_trava("t", True)
    antes = _feature("t")
    r = areas.pincelar("cobertura", "selva", [[2, 2], [8, 2]], UM_GRAU_KM, "pintar")
    assert r["id"] == "area-0001"
    assert _feature("t") == antes
    assert not shape(_feature("area-0001")["geometry"]).intersection(shape(antes["geometry"])).area > 1e-9


def test_pincelada_toda_sobre_travada_nao_grava(ambiente_isolado):
    areas.criar_area("t", "cobertura", "deserto", _quadrado(0, 0, 10, 10))
    areas.definir_trava("t", True)
    antes = areas.CAMINHO_DADOS.read_bytes()
    assert areas.pincelar("cobertura", "selva", [[5, 5]], UM_GRAU_KM, "pintar") == {"id": None, "mudou": False}
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_apagar_com_pincel_tira_das_livres_e_poupa_travadas(ambiente_isolado):
    areas.criar_area("a", "cobertura", "selva", _quadrado(0, 0, 4, 4))
    areas.criar_area("t", "cobertura", "deserto", _quadrado(4, 0, 8, 4))
    areas.criar_area("r", "relevo", "montanha", _quadrado(0, 0, 8, 4))
    areas.definir_trava("t", True)
    areas.pincelar("cobertura", None, [[0, 2], [8, 2]], UM_GRAU_KM / 2, "apagar")
    assert _area_de("a") == pytest.approx(16 - 4, rel=0.05)
    assert _area_de("t") == pytest.approx(16)
    assert _area_de("r") == pytest.approx(32)     # outra camada não é tocada


def test_apagar_onde_nao_ha_nada_nao_grava(ambiente_isolado):
    antes = areas.CAMINHO_DADOS.read_bytes()
    assert areas.pincelar("cobertura", None, [[50, 50]], UM_GRAU_KM, "apagar") == {"id": None, "mudou": False}
    assert areas.CAMINHO_DADOS.read_bytes() == antes


@pytest.mark.parametrize("args", [
    ("cobertura", "selva", [[0, 0]], 1.0, "pintar"),            # raio abaixo do mínimo
    ("cobertura", "selva", [[0, 0]], 1000.0, "pintar"),         # raio acima do máximo
    ("cobertura", "selva", [], 50.0, "pintar"),                 # traço vazio
    ("cobertura", "selva", [[0, "x"]], 50.0, "pintar"),         # ponto torto
    ("cobertura", "montanha", [[0, 0]], 50.0, "pintar"),        # valor de outra camada
    ("cobertura", "selva", [[0, 0]], 50.0, "borrar"),           # modo inventado
    ("nuvem", "selva", [[0, 0]], 50.0, "pintar"),               # camada inventada
])
def test_pincelada_invalida_nao_grava(ambiente_isolado, args):
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(ValueError):
        areas.pincelar(*args)
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_pincel_com_camada_travada_e_recusado(ambiente_isolado):
    travas.definir_trava_camada("cobertura", True)
    antes = areas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(travas.Travado):
        areas.pincelar("cobertura", "selva", [[0, 0]], 50.0, "pintar")
    assert areas.CAMINHO_DADOS.read_bytes() == antes


def test_pinceladas_repetidas_nao_incham_os_vertices(ambiente_isolado):
    for i in range(30):
        areas.pincelar("cobertura", "selva", [[i * 0.3, 0], [i * 0.3 + 0.5, 0.4]], UM_GRAU_KM / 2, "pintar")
    f = _feature("area-0001")
    anel = f["geometry"]["coordinates"][0]
    assert len(areas.carregar()["features"]) == 1
    assert len(anel) < 400
