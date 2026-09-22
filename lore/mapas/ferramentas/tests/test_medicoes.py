"""Testes de backend/medicoes.py -- salvar medição da régua (item 3e, 2026-09-23).
Isolado (nunca toca em dados/medicoes.json de verdade)."""

import json

import pytest

from backend import historico, medicoes


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    caminho = tmp_path / "medicoes.json"
    caminho.write_text(json.dumps({"versao_esquema": 1, "medicoes": []}), encoding="utf-8")
    monkeypatch.setattr(medicoes, "CAMINHO_DADOS", caminho)
    pasta_hist = tmp_path / ".historico"
    monkeypatch.setattr(historico, "PASTA_HISTORICO", pasta_hist)
    return caminho


def _pontos(*pares):
    return [{"lat": lat, "lon": lon} for lat, lon in pares]


def test_criar_medicao_grava(ambiente_isolado):
    m = medicoes.criar_medicao(_pontos((0, 0), (10, 10)), [1500.0], 1500.0, "teste")
    assert m["descricao"] == "teste"
    assert m["reproduzivel"] is True
    dados = medicoes.carregar()
    assert len(dados["medicoes"]) == 1
    assert dados["medicoes"][0]["id"] == m["id"]


def test_criar_medicao_com_varios_pontos_guarda_trechos(ambiente_isolado):
    m = medicoes.criar_medicao(_pontos((0, 0), (10, 10), (20, 5)), [1500.0, 1200.0], 2700.0, None)
    assert m["trechos_km"] == [1500.0, 1200.0]
    assert m["pontos"] == _pontos((0, 0), (10, 10), (20, 5))


def test_nome_opcional_pode_faltar(ambiente_isolado):
    m = medicoes.criar_medicao(_pontos((0, 0), (1, 1)), [150.0], 150.0, None)
    assert m["descricao"] is None


def test_nome_so_de_espaco_vira_nulo(ambiente_isolado):
    """Controle negativo do nome (2026-09-23): "   " não pode virar uma descrição
    que parece existir na listagem e não diz nada."""
    m = medicoes.criar_medicao(_pontos((0, 0), (1, 1)), [150.0], 150.0, "   ")
    assert m["descricao"] is None


def test_nome_com_espaco_nas_pontas_e_aparado(ambiente_isolado):
    m = medicoes.criar_medicao(_pontos((0, 0), (1, 1)), [150.0], 150.0, "  travessia  ")
    assert m["descricao"] == "travessia"


def test_menos_de_2_pontos_e_recusado(ambiente_isolado):
    """Controle negativo: uma medição de 1 ponto não é medição nenhuma."""
    with pytest.raises(ValueError, match="2 pontos"):
        medicoes.criar_medicao(_pontos((0, 0)), [], 0, None)
    assert medicoes.carregar()["medicoes"] == []


def test_ponto_sem_lat_lon_e_recusado(ambiente_isolado):
    with pytest.raises(ValueError, match="lat"):
        medicoes.criar_medicao([{"lat": 0}, {"lat": 1, "lon": 1}], [100.0], 100.0, None)
    assert medicoes.carregar()["medicoes"] == []


def test_numero_de_trechos_tem_que_bater_com_pontos(ambiente_isolado):
    """Controle negativo: 3 pontos precisam de 2 trechos, não 1 nem 3."""
    with pytest.raises(ValueError, match="trechos_km"):
        medicoes.criar_medicao(_pontos((0, 0), (10, 10), (20, 5)), [1500.0], 1500.0, None)
    assert medicoes.carregar()["medicoes"] == []


def test_distancia_nao_positiva_e_recusada(ambiente_isolado):
    with pytest.raises(ValueError, match="distancia_total_km"):
        medicoes.criar_medicao(_pontos((0, 0), (1, 1)), [0.0], 0, None)
    assert medicoes.carregar()["medicoes"] == []


def test_medicoes_registradas_a_mao_nao_sao_tocadas(ambiente_isolado):
    """As entradas com origem/destino null (achado de 2026-09-23, não
    reproduzíveis) continuam intactas quando a ferramenta salva uma nova."""
    caminho = ambiente_isolado
    doc = json.loads(caminho.read_text(encoding="utf-8"))
    doc["medicoes"].append({"id": "antiga", "reproduzivel": False, "origem": None, "destino": None})
    caminho.write_text(json.dumps(doc), encoding="utf-8")

    medicoes.criar_medicao(_pontos((0, 0), (1, 1)), [150.0], 150.0, "nova")

    dados = medicoes.carregar()
    assert len(dados["medicoes"]) == 2
    antiga = next(m for m in dados["medicoes"] if m["id"] == "antiga")
    assert antiga["reproduzivel"] is False
    assert antiga["origem"] is None
