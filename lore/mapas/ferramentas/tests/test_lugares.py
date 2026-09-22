"""Testes de backend/lugares.py -- Ferramenta de Lugar, B2 da rodada noturna de
2026-09-22. Isolado (nunca toca em dados/lugares.geojson de verdade nem reabre a
costa_10240.png de 10240px -- usa uma máscara sintética pequena)."""

import json

import numpy as np
import pytest

from backend import coordenadas, historico, lugares, operacoes, travas


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    # log de operações e histórico isolados
    pasta_op = tmp_path / ".operacoes"
    pasta_hist = tmp_path / ".historico"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", pasta_hist)

    # lugares.geojson vazio, isolado
    caminho_lugares = tmp_path / "dados" / "lugares.geojson"
    caminho_lugares.parent.mkdir(parents=True, exist_ok=True)
    caminho_lugares.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(lugares, "CAMINHO_LUGARES", caminho_lugares)

    # camadas_travadas.json isolado, tudo livre (o estado de partida)
    caminho_travas = tmp_path / "dados" / "camadas_travadas.json"
    caminho_travas.write_text(
        json.dumps({"versao_esquema": 1, "camadas": [{"id": c, "travada": False} for c in travas.CAMADAS_VALIDAS]}),
        encoding="utf-8",
    )
    monkeypatch.setattr(travas, "CAMINHO_DADOS", caminho_travas)

    # costa sintética 20x20: metade de cima (y<10) é TERRA (255), metade de baixo é MAR (0)
    lugares._costa_array = None
    costa_sintetica = np.zeros((20, 20), dtype=np.uint8)
    costa_sintetica[:10, :] = 255
    monkeypatch.setattr(lugares, "_costa_array", costa_sintetica)
    monkeypatch.setattr(lugares, "_costa", lambda: costa_sintetica)

    # coordenadas simples: 1 px por grau, meridiano/equador no centro da máscara (10,10)
    def coordenadas_falsas():
        return {
            "projecao": {"px_por_grau": 1.0},
            "referencia": {"x_meridiano_zero_px": 10, "y_equador_px": 10},
        }
    monkeypatch.setattr(coordenadas, "carregar_coordenadas", coordenadas_falsas)

    return tmp_path


def test_ponto_em_terra_controle_positivo_e_negativo(ambiente_isolado):
    # y_equador_px=10, escala 1px/grau, terra é y<10 -> lat>0 é terra (norte)
    assert lugares.ponto_em_terra(lon=0, lat=5) is True, "lat=5 (ao norte) tem que cair na metade TERRA da máscara sintética"
    assert lugares.ponto_em_terra(lon=0, lat=-5) is False, "controle negativo: lat=-5 (ao sul) cai no MAR da máscara sintética"


def test_ponto_fora_da_tela_nao_e_terra(ambiente_isolado):
    assert lugares.ponto_em_terra(lon=1000, lat=1000) is False


def test_criar_lugar_em_terra(ambiente_isolado):
    feature = lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    assert feature["properties"]["id"] == "vila-1"
    dados = lugares.carregar()
    assert len(dados["features"]) == 1


def test_criar_lugar_no_mar_e_recusado(ambiente_isolado):
    """Controle negativo da validação 'cai em terra'."""
    with pytest.raises(ValueError, match="terra"):
        lugares.criar_lugar("naufragio-1", lon=0, lat=-5, propriedades={"tipo": "marco"})
    assert lugares.carregar()["features"] == [], "recusado -- não pode ter sido gravado"


def test_tipo_invalido_e_recusado(ambiente_isolado):
    with pytest.raises(ValueError, match="tipo"):
        lugares.criar_lugar("x", lon=0, lat=5, propriedades={"tipo": "castelo-voador"})


@pytest.mark.parametrize("importancia", ["pequena", "media", "grande", None])
def test_importancia_valida_e_aceita(ambiente_isolado, importancia):
    feature = lugares.criar_lugar(
        "vila-imp", lon=0, lat=5, propriedades={"tipo": "vila", "importancia": importancia},
    )
    assert feature["properties"]["importancia"] == importancia


def test_importancia_sem_o_campo_tambem_e_aceita(ambiente_isolado):
    """'importancia' ausente é equivalente a null (não classificado) -- não é
    obrigatório informar na criação."""
    feature = lugares.criar_lugar("vila-sem-imp", lon=0, lat=5, propriedades={"tipo": "vila"})
    assert feature["properties"].get("importancia") is None


def test_importancia_invalida_e_recusada(ambiente_isolado):
    """Controle negativo do esquema fechado de importancia (pequena/media/grande)."""
    with pytest.raises(ValueError, match="importancia"):
        lugares.criar_lugar(
            "vila-imp-errada", lon=0, lat=5, propriedades={"tipo": "vila", "importancia": "gigantesca"},
        )
    assert lugares.carregar()["features"] == [], "recusado -- não pode ter sido gravado"


def test_capital_so_em_cidade(ambiente_isolado):
    with pytest.raises(ValueError, match="capital"):
        lugares.criar_lugar("vila-2", lon=0, lat=5, propriedades={"tipo": "vila", "capital": True})


def test_capital_em_cidade_e_aceito(ambiente_isolado):
    feature = lugares.criar_lugar("cidade-1", lon=0, lat=5, propriedades={"tipo": "cidade", "capital": True})
    assert feature["properties"]["capital"] is True


def test_id_duplicado_e_recusado(ambiente_isolado):
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    with pytest.raises(ValueError, match="já existe"):
        lugares.criar_lugar("vila-1", lon=1, lat=5, propriedades={"tipo": "vila"})


def test_mover_lugar(ambiente_isolado):
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    lugares.mover_lugar("vila-1", lon=2, lat=6)
    dados = lugares.carregar()
    assert dados["features"][0]["geometry"]["coordinates"] == [2, 6]


def test_mover_lugar_para_o_mar_e_recusado(ambiente_isolado):
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    with pytest.raises(ValueError, match="terra"):
        lugares.mover_lugar("vila-1", lon=0, lat=-5)
    dados = lugares.carregar()
    assert dados["features"][0]["geometry"]["coordinates"] == [0, 5], "não pode ter se movido"


def test_editar_lugar(ambiente_isolado):
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila", "nome": "Vau"})
    lugares.editar_lugar("vila-1", {"nome": "Vau Novo"})
    dados = lugares.carregar()
    assert dados["features"][0]["properties"]["nome"] == "Vau Novo"
    assert dados["features"][0]["properties"]["tipo"] == "vila", "editar não pode apagar campo que não mudou"


def test_editar_lugar_quebrando_capital_e_recusado(ambiente_isolado):
    lugares.criar_lugar("cidade-1", lon=0, lat=5, propriedades={"tipo": "cidade", "capital": True})
    with pytest.raises(ValueError, match="capital"):
        lugares.editar_lugar("cidade-1", {"tipo": "vila"})


def test_apagar_lugar(ambiente_isolado):
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    lugares.apagar_lugar("vila-1")
    assert lugares.carregar()["features"] == []


def test_apagar_lugar_inexistente_e_recusado(ambiente_isolado):
    with pytest.raises(KeyError):
        lugares.apagar_lugar("fantasma")


def test_criar_mover_apagar_sao_desfaziveis(ambiente_isolado):
    """Prova que a Ferramenta de Lugar está de verdade em cima do B1: cada operação
    vira uma entrada desfazível, não só uma gravação direta do arquivo."""
    lugares.criar_lugar("vila-1", lon=0, lat=5, propriedades={"tipo": "vila"})
    lugares.mover_lugar("vila-1", lon=1, lat=6)
    lugares.apagar_lugar("vila-1")
    assert lugares.carregar()["features"] == []

    operacoes.desfazer()  # desfaz apagar
    assert len(lugares.carregar()["features"]) == 1

    operacoes.desfazer()  # desfaz mover
    assert lugares.carregar()["features"][0]["geometry"]["coordinates"] == [0, 5]

    operacoes.desfazer()  # desfaz criar
    assert lugares.carregar()["features"] == []

    assert operacoes.desfazer() is None  # controle negativo
