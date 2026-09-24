"""Mapas distorcidos (B5, 2026-09-23 noite), contra a costa de verdade, pequenos.
As regras que precisam de controle negativo: o dado verdadeiro não muda (bytes dos
arquivos), a mesma semente dá a mesma imagem e outro mercador dá outra, e o nível 5 é
o mapa fiel."""

import hashlib

import numpy as np
import pytest

from cartografia import composicao as C
from cartografia import distorcao as D
from cartografia import exportar as X

RET = [8.0, 25.0, 24.0, 40.0]


@pytest.fixture
def saida(tmp_path, monkeypatch):
    monkeypatch.setattr(X, "PASTA_SAIDA", tmp_path / "exp")
    monkeypatch.setattr(X, "REGISTRO", tmp_path / "exp.jsonl")
    return tmp_path


@pytest.fixture(scope="module")
def dados():
    return C.carregar_dados()


def _img(saida, nome):
    from PIL import Image
    return np.asarray(Image.open(saida / "exp" / f"{nome}.png"))


def _sha_dos_dados():
    h = hashlib.sha256()
    for p in sorted((C.RAIZ_MAPAS / "dados").glob("*")):
        if p.is_file() and p.suffix in (".json", ".geojson"):
            h.update(p.read_bytes())
    return h.hexdigest()


def test_distorcao_nao_toca_o_dado(saida, dados):
    antes = _sha_dos_dados()
    copia = C.carregar_dados()
    X.exportar(X.Opcoes(retangulo=RET, largura_px=400, distorcao={"nivel": 1, "mercador": "A"}, nome="a"), copia,
               registrar=False)
    assert _sha_dos_dados() == antes
    assert copia == C.carregar_dados()          # nem a cópia em memória foi mexida


def test_mesma_semente_mesma_imagem_outro_mercador_outra(saida, dados):
    for nome, merc in (("a1", "Velho Tobias"), ("a2", "Velho Tobias"), ("b", "Dona Lia")):
        X.exportar(X.Opcoes(retangulo=RET, largura_px=400, distorcao={"nivel": 2, "mercador": merc}, nome=nome),
                   dados, registrar=False)
    assert (_img(saida, "a1") == _img(saida, "a2")).all()
    assert (_img(saida, "a1") != _img(saida, "b")).any()


def test_nivel_5_e_o_mapa_fiel(saida, dados):
    X.exportar(X.Opcoes(retangulo=RET, largura_px=400, distorcao={"nivel": 5, "mercador": "A"}, nome="n5"), dados,
               registrar=False)
    X.exportar(X.Opcoes(retangulo=RET, largura_px=400, nome="fiel"), dados, registrar=False)
    X.exportar(X.Opcoes(retangulo=RET, largura_px=400, distorcao={"nivel": 4, "mercador": "A"}, nome="n4"), dados,
               registrar=False)
    assert (_img(saida, "n5") == _img(saida, "fiel")).all()
    assert (_img(saida, "n4") != _img(saida, "fiel")).any()     # controle negativo


def test_mentiras_crescem_com_o_nivel(dados):
    def mentir(nivel):
        p = C.Pedido(*RET, 20.0, distorcao={"nivel": nivel, "semente": 99})
        _, _, _, m = D.preparar(dados, p)
        return m
    m1, m4 = mentir(1), mentir(4)
    assert m1["deslocamento_maximo_km"] > 3 * m4["deslocamento_maximo_km"] > 0
    assert m1["simbolos_de_relevo_omitidos_pct"] == 60 and m4["simbolos_de_relevo_omitidos_pct"] == 15


def test_campo_e_suave_e_ancorado_no_mundo():
    c = D.Campo(5, 1.0)
    a = c(10.0, 20.0)
    b = c(10.01, 20.0)
    assert abs(float(a[0]) - float(b[0])) < 0.01          # suave
    assert c(10.0, 20.0) == D.Campo(5, 1.0)(10.0, 20.0)   # determinístico
    assert D.Campo(5, 0.0).maximo() == 0                  # força zero, campo zero


def test_nome_escrito_errado_sempre_muda():
    rng = np.random.default_rng(1)
    for nome in ("Porto das Brumas", "Oásis de Sal", "Vila Úmida", "Aaa"):
        for _ in range(20):
            assert D._errar_nome(nome, rng) != nome
