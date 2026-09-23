"""Elementos de cartografia (B2, 2026-09-23 noite): dados isolados, posições padrão
no mar, e a barra de escala calibrada (medida na imagem, não só na conta)."""

import math

import numpy as np
import pytest
from PIL import Image

from backend import elementos, historico, lugares, operacoes
from cartografia import elementos_desenho as D


@pytest.fixture
def isolado(tmp_path, monkeypatch):
    monkeypatch.setattr(elementos, "CAMINHO", tmp_path / "dados" / "elementos.json")
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", tmp_path / ".op")
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", tmp_path / ".op" / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", tmp_path / ".op" / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".hist")
    return tmp_path / "dados" / "elementos.json"


def _b(c):
    return c.read_bytes() if c.exists() else b""


def test_padroes_criam_os_quatro_no_mar(isolado):
    criados = elementos.criar_padroes()
    assert sorted(e["tipo"] for e in criados) == ["cartela", "escala", "monstro", "rosa"]
    for e in criados:
        assert not lugares.ponto_em_terra(*e["posicao"]["coordinates"]), e
    escala = next(e for e in criados if e["tipo"] == "escala")
    assert 15 < escala["latitude_escala"] < 30
    # De novo não duplica.
    assert elementos.criar_padroes() == []


def test_ponto_de_oceano_vazio_esta_no_mar():
    lon, lat = elementos.ponto_de_oceano_mais_vazio()
    assert not lugares.ponto_em_terra(lon, lat)
    # Controle negativo: um ponto de Mére, conhecido, é terra (o teste acima não é vazio).
    assert lugares.ponto_em_terra(17.3389, 17.7768)


@pytest.mark.parametrize("e", [
    {"tipo": "dragao", "posicao": {"type": "Point", "coordinates": [0, 0]}},
    {"tipo": "rosa", "posicao": {"type": "Point", "coordinates": [99, 0]}},
    {"tipo": "rosa", "posicao": {"type": "Point", "coordinates": [0, 0]}, "tamanho": 1},
    {"tipo": "escala", "posicao": {"type": "Point", "coordinates": [0, 0]}, "latitude_escala": 95},
    {"tipo": "rosa", "posicao": {"type": "Point", "coordinates": [0, 0]}, "visivel_jogador": "sim"},
])
def test_recusas_nao_gravam(isolado, e):
    antes = _b(isolado)
    with pytest.raises(ValueError):
        elementos.criar(e)
    assert _b(isolado) == antes


def test_editar_e_travar(isolado):
    from backend import travas
    r = elementos.criar({"tipo": "rosa", "posicao": {"type": "Point", "coordinates": [0, 0]}})
    elementos.editar(r["id"], {"tamanho": 600, "travado": True})
    antes = _b(isolado)
    with pytest.raises(travas.Travado):
        elementos.editar(r["id"], {"tamanho": 700})
    assert _b(isolado) == antes
    operacoes.desfazer()
    assert elementos.carregar()["elementos"][0]["tamanho"] == 420


def test_comprimento_redondo():
    assert D.comprimento_redondo(740) == 500
    assert D.comprimento_redondo(199) == 100
    assert D.comprimento_redondo(2.3) == 2


def test_barra_de_escala_mede_o_que_diz():
    """Mede a barra desenhada: o comprimento em pixels vezes km por pixel dá o número
    escrito. Controle negativo: a mesma barra, calibrada no equador, fica mais curta
    que a calibrada a 60° para os mesmos km (a 60°, um pixel horizontal vale metade)."""
    def medir(latitude):
        tela = Image.new("RGBA", (2000, 400), (255, 255, 255, 0))
        km_px = 139.0 * math.cos(math.radians(latitude)) / 20
        D.desenhar_escala(tela, 1000, 200, 900, km_px, latitude)
        tinta = np.asarray(tela)[200, :, 3] > 0
        xs = np.nonzero(tinta)[0]
        return (xs.max() - xs.min() + 1) * km_px, xs.max() - xs.min() + 1
    km_eq, px_eq = medir(0.0)
    km_60, px_60 = medir(60.0)
    assert km_eq == pytest.approx(D.comprimento_redondo(900 * 139.0 / 20), rel=0.02)
    assert km_60 == pytest.approx(D.comprimento_redondo(900 * 139.0 * 0.5 / 20), rel=0.02)
    assert px_eq < 900 and px_60 < 900
