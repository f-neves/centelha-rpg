"""Rotas de comércio (B4, 2026-09-23 noite), contra a costa de verdade (só leitura) e
com os dados gravados numa pasta temporária. Cada regra com o caso que tem de falhar:
a rota terrestre que cruza o mar é recusada, e a MESMA linha como marítima passa."""

import json

import pytest

from backend import estradas, geo, historico, lugares, operacoes, rotas, travas

TERRA = (17.3389, 17.7768)            # Mére
MAR_ABERTO = (-37.052, 23.832)


@pytest.fixture
def isolado(tmp_path, monkeypatch):
    monkeypatch.setattr(rotas, "CAMINHO_DADOS", tmp_path / "dados" / "rotas.json")
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", tmp_path / ".op")
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", tmp_path / ".op" / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", tmp_path / ".op" / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".hist")
    monkeypatch.setattr(estradas, "_lugares_marcados", lambda: [("cidade-a", 17.30, 17.70)])
    return tmp_path / "dados" / "rotas.json"


def _b(c):
    return c.read_bytes() if c.exists() else b""


def _terrestre(pontos, trechos=None):
    return rotas.criar({"nome": "Rota do Sal", "tipo": "terrestre", "mercadorias": ["sal", "lã"]},
                       {"pontos": pontos, "trechos": trechos})


def test_interpolacao_passa_pelos_pontos_e_reto_e_reto():
    pts = [[0, 0], [1, 1], [2, 0], [3, 1]]
    t = rotas.interpolar(pts, ["curvo", "reto", "curvo"])
    for p in pts:
        assert [round(v, 5) for v in p] in t
    # O trecho reto é só os dois pontos; o curvo tem as amostras.
    i1, i2 = t.index([1, 1]), t.index([2, 0])
    assert i2 == i1 + 1
    assert t.index([1, 1]) == rotas.AMOSTRAS_POR_CURVA


def test_trecho_curvo_sai_da_reta():
    t = rotas.interpolar([[0, 0], [1, 1], [2, 0]], ["curvo", "curvo"])
    meio = t[rotas.AMOSTRAS_POR_CURVA // 2]
    # Controle negativo: na reta de (0,0) a (1,1) o meio seria (0,5; 0,5).
    assert abs(meio[0] - meio[1]) > 0.01


def test_rota_terrestre_em_mere_com_ponta_atraida(isolado):
    lon, lat = TERRA
    f = _terrestre([[17.31, 17.71], [lon + 0.4, lat - 0.3], [lon + 0.8, lat - 0.5]])
    p = f["properties"]
    assert p["lugares"] == ["cidade-a", None]
    assert p["controle"]["pontos"][0] == [17.30, 17.70]                  # grudou no lugar
    assert p["controle"]["trechos"] == ["curvo", "curvo"]
    assert f["geometry"]["coordinates"][0] == [17.30, 17.70]
    assert "km" not in p and "dias" not in p                               # medida não se grava


def test_terrestre_no_mar_e_recusada_e_maritima_passa(isolado):
    linha = [list(TERRA), [TERRA[0] + 20, TERRA[1]]]                      # atravessa o oceano a leste
    antes = _b(isolado)
    with pytest.raises(ValueError, match="mar"):
        _terrestre(linha, ["reto"])
    assert _b(isolado) == antes
    f = rotas.criar({"tipo": "maritima"}, {"pontos": linha, "trechos": ["reto"]})
    assert f["properties"]["tipo"] == "maritima"


@pytest.mark.parametrize("props,controle,erro", [
    ({"tipo": "aerea"}, {"pontos": [[0, 0], [1, 1]]}, "tipo"),
    ({"tipo": "maritima", "sentido": "para cima"}, {"pontos": [[0, 0], [1, 1]]}, "sentido"),
    ({"tipo": "maritima", "risco": "médio demais"}, {"pontos": [[0, 0], [1, 1]]}, "risco"),
    ({"tipo": "maritima", "mercadorias": "sal"}, {"pontos": [[0, 0], [1, 1]]}, "mercadorias"),
    ({"tipo": "maritima"}, {"pontos": [[0, 0]]}, "dois pontos"),
    ({"tipo": "maritima"}, {"pontos": [[0, 0], [1, 1]], "trechos": ["torto"]}, "trechos"),
    ({"tipo": "maritima"}, {"pontos": [[0, 0], [1, 1]], "trechos": ["reto", "reto"]}, "trechos"),
])
def test_recusas_nao_gravam(isolado, props, controle, erro):
    antes = _b(isolado)
    with pytest.raises(ValueError, match=erro):
        rotas.criar(props, controle)
    assert _b(isolado) == antes


def test_medidas_no_globo():
    tracado = [[0, 0], [1, 0]]
    m = rotas.medidas(tracado, "terrestre")
    assert m["km"] == pytest.approx(geo.haversine_km(0, 0, 0, 1), abs=0.1)
    assert m["dias"]["a pé"] == pytest.approx(m["km"] / 25, abs=0.1)
    # Um grau de longitude a 60° vale metade do do equador (a medida é no globo).
    assert rotas.medidas([[0, 60], [1, 60]], "terrestre")["km"] == pytest.approx(m["km"] / 2, rel=0.01)


def test_editar_trecho_e_ponto_e_travar(isolado):
    lon, lat = TERRA
    f = _terrestre([[lon, lat], [lon + 0.4, lat - 0.3], [lon + 0.8, lat - 0.5]])
    id_ = f["properties"]["id"]
    e = rotas.editar(id_, {"risco": "alto"}, {"pontos": f["properties"]["controle"]["pontos"],
                                              "trechos": ["reto", "curvo"]})
    assert e["properties"]["risco"] == "alto" and e["properties"]["mercadorias"] == ["sal", "lã"]
    assert len(e["geometry"]["coordinates"]) == 2 + rotas.AMOSTRAS_POR_CURVA
    rotas.editar(id_, {"travado": True})
    antes = _b(isolado)
    with pytest.raises(travas.Travado):
        rotas.editar(id_, {"nome": "outro"})
    with pytest.raises(travas.Travado):
        rotas.apagar(id_)
    assert _b(isolado) == antes
    rotas.editar(id_, {"travado": False})
    rotas.apagar(id_)
    operacoes.desfazer()
    assert rotas.carregar()["features"][0]["properties"]["id"] == id_


def test_rota_entra_nos_nomes(isolado):
    from backend import nomes
    lon, lat = TERRA
    _terrestre([[lon, lat], [lon + 0.4, lat - 0.3]])
    ef = [n for n in nomes.efetivos() if n["alvo"]["tipo"] == "rota"]
    assert ef and ef[0]["texto"] == "Rota do Sal" and ef[0]["linha"]["type"] == "LineString"
