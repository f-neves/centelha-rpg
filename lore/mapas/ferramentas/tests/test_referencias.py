"""Testes de backend/referencias.py -- posição das camadas de referência agora
passa pelo desfazer (B1), e "reset"/"automático" (2026-09-23). Isolado (nunca
toca em dados/camadas_referencia.json de verdade)."""

import json

import pytest

from backend import coordenadas, historico, operacoes, referencias


def _camada_imagem(id_, bounds, bounds_automatico=None):
    c = {
        "id": id_, "nome": id_, "tipo": "imagem", "arquivo": "x.png",
        "visivel": False, "opacidade": 1.0, "bounds": bounds,
    }
    if bounds_automatico is not None:
        c["bounds_automatico"] = bounds_automatico
    return c


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    pasta_hist = tmp_path / ".historico"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", pasta_hist)

    caminho = tmp_path / "dados" / "camadas_referencia.json"
    caminho.parent.mkdir(parents=True, exist_ok=True)
    doc = {
        "versao_esquema": 2,
        "camadas": [
            _camada_imagem("chatgpt-1", {"sul": -10, "norte": 10, "oeste": -10, "leste": 10},
                            bounds_automatico={"sul": 1, "norte": 2, "oeste": 3, "leste": 4}),
            _camada_imagem("chatgpt-2", {"sul": -5, "norte": 5, "oeste": -5, "leste": 5}),
            {"id": "rotulos", "nome": "Rótulos", "tipo": "tile", "arquivo": None,
             "visivel": False, "opacidade": 1.0},
        ],
    }
    caminho.write_text(json.dumps(doc), encoding="utf-8")
    monkeypatch.setattr(referencias, "CAMINHO_DADOS", caminho)
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)  # garante mesmo RAIZ_MAPAS pro caminho relativo
    return tmp_path


def _bounds_de(tmp_path, id_camada):
    doc = json.loads((tmp_path / "dados" / "camadas_referencia.json").read_text(encoding="utf-8"))
    return next(c for c in doc["camadas"] if c["id"] == id_camada)["bounds"]


def test_mudar_posicao_atualiza_bounds(ambiente_isolado):
    tmp_path = ambiente_isolado
    referencias.mudar_posicao("chatgpt-2", {"sul": 20, "norte": 30, "oeste": 20, "leste": 30})
    assert _bounds_de(tmp_path, "chatgpt-2") == {"sul": 20, "norte": 30, "oeste": 20, "leste": 30}


def test_mudar_posicao_parcial_mantem_o_resto(ambiente_isolado):
    tmp_path = ambiente_isolado
    referencias.mudar_posicao("chatgpt-2", {"leste": 40})
    assert _bounds_de(tmp_path, "chatgpt-2") == {"sul": -5, "norte": 5, "oeste": -5, "leste": 40}


def test_mudar_posicao_e_desfazivel(ambiente_isolado):
    tmp_path = ambiente_isolado
    bounds_original = _bounds_de(tmp_path, "chatgpt-2")
    referencias.mudar_posicao("chatgpt-2", {"sul": 20, "norte": 30, "oeste": 20, "leste": 30})
    assert _bounds_de(tmp_path, "chatgpt-2") != bounds_original
    operacoes.desfazer()
    assert _bounds_de(tmp_path, "chatgpt-2") == bounds_original


def test_mudar_posicao_bounds_invalido_e_recusado(ambiente_isolado):
    """Controle negativo: sul >= norte tem que ser recusado, sem gravar nada."""
    tmp_path = ambiente_isolado
    bounds_original = _bounds_de(tmp_path, "chatgpt-2")
    with pytest.raises(ValueError, match="sul"):
        referencias.mudar_posicao("chatgpt-2", {"sul": 50, "norte": 10})
    assert _bounds_de(tmp_path, "chatgpt-2") == bounds_original


def test_mudar_posicao_em_camada_tile_e_recusado(ambiente_isolado):
    """Controle negativo: tile não tem bounds -- não pode aceitar mudar posição."""
    with pytest.raises(ValueError, match="tile"):
        referencias.mudar_posicao("rotulos", {"sul": 1, "norte": 2, "oeste": 1, "leste": 2})


def test_resetar_posicao_encaixa_no_mundo(ambiente_isolado):
    tmp_path = ambiente_isolado
    referencias.resetar_posicao("chatgpt-2")
    limites = coordenadas.carregar_coordenadas()["limites_da_tela"]
    bounds = _bounds_de(tmp_path, "chatgpt-2")
    assert bounds["norte"] == limites["latitude_topo"]
    assert bounds["sul"] == limites["latitude_base"]
    assert bounds["oeste"] == limites["longitude_esquerda"]
    assert bounds["leste"] == limites["longitude_direita"]


def test_resetar_posicao_e_desfazivel(ambiente_isolado):
    tmp_path = ambiente_isolado
    bounds_original = _bounds_de(tmp_path, "chatgpt-2")
    referencias.resetar_posicao("chatgpt-2")
    operacoes.desfazer()
    assert _bounds_de(tmp_path, "chatgpt-2") == bounds_original


def test_usar_alinhamento_automatico_restaura_bounds_automatico(ambiente_isolado):
    tmp_path = ambiente_isolado
    referencias.usar_alinhamento_automatico("chatgpt-1")
    assert _bounds_de(tmp_path, "chatgpt-1") == {"sul": 1, "norte": 2, "oeste": 3, "leste": 4}


def test_usar_alinhamento_automatico_sem_dado_gravado_e_recusado(ambiente_isolado):
    """Controle negativo: chatgpt-2 não tem bounds_automatico neste teste --
    "automático" não pode inventar um valor."""
    with pytest.raises(ValueError, match="automático"):
        referencias.usar_alinhamento_automatico("chatgpt-2")


def test_alinhamento_automatico_nunca_e_sobrescrito_por_ajuste_manual(ambiente_isolado):
    """O ponto central do pedido: bounds_automatico é um campo PRÓPRIO, ajuste
    manual (mudar_posicao) não pode tocar nele -- senão o botão 'automático'
    deixaria de servir depois do primeiro ajuste fino."""
    tmp_path = ambiente_isolado
    referencias.mudar_posicao("chatgpt-1", {"sul": 99, "norte": 100, "oeste": 99, "leste": 100})
    doc = json.loads((tmp_path / "dados" / "camadas_referencia.json").read_text(encoding="utf-8"))
    camada = next(c for c in doc["camadas"] if c["id"] == "chatgpt-1")
    assert camada["bounds_automatico"] == {"sul": 1, "norte": 2, "oeste": 3, "leste": 4}
    assert camada["bounds"] == {"sul": 99, "norte": 100, "oeste": 99, "leste": 100}
