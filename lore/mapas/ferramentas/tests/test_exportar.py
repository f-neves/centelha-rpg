"""Exportação parcial (B3, 2026-09-23 noite), contra a costa de verdade e em tamanho
pequeno. O registro de cada exportação, a versão do jogador sem o oculto (com o
mestre como controle negativo), o recorte por região e o PDF em tamanho de papel."""

import json

import numpy as np
import pytest
from PIL import Image

from cartografia import composicao as C
from cartografia import exportar as X


@pytest.fixture
def saida(tmp_path, monkeypatch):
    monkeypatch.setattr(X, "PASTA_SAIDA", tmp_path / "exportacoes")
    monkeypatch.setattr(X, "REGISTRO", tmp_path / "exportacoes.jsonl")
    monkeypatch.setattr(X, "RAIZ_MAPAS", tmp_path)
    return tmp_path


@pytest.fixture(scope="module")
def dados():
    return C.carregar_dados()


@pytest.mark.parametrize("o,erro", [
    (X.Opcoes(), "UMA forma"),
    (X.Opcoes(regiao="calin", retangulo=[0, 0, 1, 1]), "UMA forma"),
    (X.Opcoes(retangulo=[5, 5, 1, 1]), "oeste < leste"),
    (X.Opcoes(regiao="calin", camadas=["relevo", "dragões"]), "desconhecidas"),
    (X.Opcoes(regiao="calin", versao="rei"), "versao"),
    (X.Opcoes(regiao="calin", formato="gif"), "formato"),
    (X.Opcoes(regiao="calin", formato="pdf", papel="Carta"), "papel"),
    (X.Opcoes(regiao="calin", distorcao={"nivel": 7}), "nivel"),
])
def test_opcoes_invalidas(o, erro):
    with pytest.raises(ValueError, match=erro):
        X.validar(o)


def test_recorte_de_calin_cobre_calin_e_nao_mere(dados):
    oeste, sul, leste, norte = X.recorte_da_regiao("calin", dados)
    assert oeste < 6.66 < leste and sul < 33.96 < norte           # calin-principal dentro
    assert not (oeste < 17.34 < leste and sul < 17.78 < norte)     # mere-principal fora
    with pytest.raises(ValueError, match="desconhecida"):
        X.recorte_da_regiao("atlantida", dados)


def test_exportacao_registra_e_grava(saida, dados):
    r = X.exportar(X.Opcoes(retangulo=[0, 28, 12, 38], largura_px=400, destinatario="Ana", nome="t"), dados)
    assert (saida / "exportacoes" / "t.png").exists()
    linhas = (saida / "exportacoes.jsonl").read_text(encoding="utf-8").splitlines()
    assert len(linhas) == 1
    reg = json.loads(linhas[0])
    assert reg["destinatario"] == "Ana" and reg["versao"] == "mestre" and reg["arquivo"].endswith("t.png")
    assert reg["dados_sha256"] and reg["escala_na_latitude"] == pytest.approx(33.0, abs=0.1)


def test_jogador_nao_ve_o_oculto(saida, dados):
    d = dict(dados)
    d["lugares"] = [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [6.0, 33.5]},
                     "properties": {"id": "segredo", "tipo": "cidade", "nome": "Segredo",
                                    "importancia": "grande", "visivel_jogador": False}}]
    d["nomes"] = [{"alvo": {"tipo": "lugar", "id": "segredo"}, "texto": "Segredo", "nivel": 4, "posicao": None,
                   "angulo": None, "curva": None, "reto": False, "visivel_jogador": True}]
    base = dict(retangulo=[3, 31, 9, 36], largura_px=500, camadas=["cidades", "nomes"])
    X.exportar(X.Opcoes(**base, versao="jogador", nome="j"), d)
    X.exportar(X.Opcoes(**base, versao="mestre", nome="m"), d)
    X.exportar(X.Opcoes(**base, versao="jogador", nome="j2"), {**d, "lugares": [], "nomes": []})
    j = np.asarray(Image.open(saida / "exportacoes" / "j.png"))
    m = np.asarray(Image.open(saida / "exportacoes" / "m.png"))
    vazio = np.asarray(Image.open(saida / "exportacoes" / "j2.png"))
    assert (j == vazio).all()           # o jogador vê o mapa como se o lugar não existisse
    assert (m != vazio).any()           # controle negativo: o mestre vê o lugar


def test_pdf_no_tamanho_do_papel(saida, dados):
    X.exportar(X.Opcoes(retangulo=[0, 28, 12, 38], formato="pdf", papel="A4", dpi=100, nome="p"), dados)
    import re
    conteudo = (saida / "exportacoes" / "p.pdf").read_bytes()
    assert conteudo.startswith(b"%PDF")
    caixa = [float(v) for v in re.search(rb"/MediaBox\s*\[\s*([\d.\s]+)\]", conteudo).group(1).split()]
    # Deitado (recorte mais largo que alto): 297 x 210 mm = 841,9 x 595,3 pontos.
    assert caixa[2] == pytest.approx(297 / 25.4 * 72, abs=2)
    assert caixa[3] == pytest.approx(210 / 25.4 * 72, abs=2)


def test_recorte_grande_demais_e_recusado(saida, dados, monkeypatch):
    monkeypatch.setattr(X, "LIMITE_PX", 1000)
    with pytest.raises(ValueError, match="grande demais"):
        X.exportar(X.Opcoes(retangulo=[0, 28, 12, 38], largura_px=400), dados)
    assert not (saida / "exportacoes.jsonl").exists()
