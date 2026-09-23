"""Camada de nomes (B1, 2026-09-23 noite): ajustes e nomes livres em
`dados/nomes.json`, isolado numa pasta temporária. Lugares, regiões e áreas são lidos
dos arquivos de verdade (só leitura). Toda recusa confere que o arquivo não mudou."""

import json

import pytest

from backend import historico, lugares, nomes, operacoes


@pytest.fixture
def isolado(tmp_path, monkeypatch):
    monkeypatch.setattr(nomes, "CAMINHO", tmp_path / "dados" / "nomes.json")
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", tmp_path / ".op")
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", tmp_path / ".op" / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", tmp_path / ".op" / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".hist")
    return tmp_path / "dados" / "nomes.json"


def _bytes(caminho):
    return caminho.read_bytes() if caminho.exists() else b""


def test_nome_livre_de_cordilheira(isolado):
    area = "exemplo-montanha-mere-norte"
    n = nomes.criar({"alvo": {"tipo": "area", "id": area}, "texto": "  Montes do Norte ",
                     "posicao": {"type": "Point", "coordinates": [23, 35]}})
    assert n["id"] == "nome-0001" and n["texto"] == "Montes do Norte" and n["reto"] is False
    ef = [e for e in nomes.efetivos() if e["alvo"]["tipo"] == "area"]
    assert ef[0]["nivel"] == 3 and ef[0]["texto"] == "Montes do Norte"


def test_ajuste_de_regiao_muda_o_nivel_e_nao_a_posicao(isolado):
    nomes.criar({"alvo": {"tipo": "regiao", "id": "mere"}, "nivel": 5, "reto": True})
    ef = {e["alvo"]["id"]: e for e in nomes.efetivos() if e["alvo"]["tipo"] == "regiao"}
    assert ef["mere"]["nivel"] == 5 and ef["mere"]["reto"] is True
    assert ef["mere"]["posicao"]["coordinates"] == [15.18, 19.60]    # o rótulo da região
    assert ef["syl"]["nivel"] == 4                                      # ilha: padrão


@pytest.mark.parametrize("n,erro", [
    ({"alvo": {"tipo": "planeta", "id": "x"}}, "alvo.tipo"),
    ({"alvo": {"tipo": "lugar", "id": "atlantida"}}, "desconhecido"),
    ({"alvo": {"tipo": "livre", "id": None}, "texto": "Mar"}, "posicao"),           # sem posição nem curva
    ({"alvo": {"tipo": "livre", "id": None}, "texto": "", "posicao": {"type": "Point", "coordinates": [0, 0]}}, "texto"),
    ({"alvo": {"tipo": "regiao", "id": "mere"}, "texto": "Outra"}, "próprio objeto"),
    ({"alvo": {"tipo": "regiao", "id": "mere"}, "posicao": {"type": "Point", "coordinates": [1, 1]}}, "rotulo"),
    ({"alvo": {"tipo": "regiao", "id": "mere"}, "nivel": 9}, "nivel"),
    ({"alvo": {"tipo": "regiao", "id": "mere"}, "nivel": True}, "nivel"),
    ({"alvo": {"tipo": "livre", "id": None}, "texto": "X", "posicao": {"type": "Point", "coordinates": [99, 0]}}, "fora da tela"),
    ({"alvo": {"tipo": "livre", "id": None}, "texto": "X", "curva": {"type": "LineString", "coordinates": [[0, 0]]}}, "curva"),
])
def test_recusas_nao_gravam(isolado, n, erro):
    antes = _bytes(isolado)
    with pytest.raises(ValueError, match=erro):
        nomes.criar(n)
    assert _bytes(isolado) == antes


def test_um_ajuste_por_alvo(isolado):
    nomes.criar({"alvo": {"tipo": "regiao", "id": "syl"}, "nivel": 3})
    antes = _bytes(isolado)
    with pytest.raises(ValueError, match="já tem ajuste"):
        nomes.criar({"alvo": {"tipo": "regiao", "id": "syl"}, "nivel": 2})
    assert _bytes(isolado) == antes
    # Controle: nomes livres podem ser muitos.
    for i in range(2):
        nomes.criar({"alvo": {"tipo": "livre", "id": None}, "texto": f"Mar {i}",
                     "posicao": {"type": "Point", "coordinates": [i, 0]}})


def test_editar_mover_e_voltar_ao_padrao(isolado):
    n = nomes.criar({"alvo": {"tipo": "livre", "id": None}, "texto": "Mar Largo",
                     "posicao": {"type": "Point", "coordinates": [-20, 20]}})
    nomes.editar(n["id"], {"posicao": {"type": "Point", "coordinates": [-21, 21]}, "angulo": 15})
    e = nomes.editar(n["id"], {"angulo": None})
    assert e["posicao"]["coordinates"] == [-21, 21] and e["angulo"] is None
    with pytest.raises(ValueError, match="alvo"):
        nomes.editar(n["id"], {"alvo": {"tipo": "regiao", "id": "mere"}})
    with pytest.raises(ValueError, match="desconhecidos"):
        nomes.editar(n["id"], {"cor": "azul"})


def test_travado_nao_edita_nem_apaga(isolado):
    from backend import travas
    n = nomes.criar({"alvo": {"tipo": "livre", "id": None}, "texto": "Mar",
                     "posicao": {"type": "Point", "coordinates": [0, 0]}, "travado": True})
    antes = _bytes(isolado)
    with pytest.raises(travas.Travado):
        nomes.editar(n["id"], {"texto": "Outro"})
    with pytest.raises(travas.Travado):
        nomes.apagar(n["id"])
    assert _bytes(isolado) == antes
    nomes.editar(n["id"], {"travado": False})     # destravar é o único gesto permitido
    nomes.apagar(n["id"])


def test_desfazer_passa_pelos_nomes(isolado):
    nomes.criar({"alvo": {"tipo": "livre", "id": None}, "texto": "Mar",
                 "posicao": {"type": "Point", "coordinates": [0, 0]}})
    operacoes.desfazer()
    assert nomes.carregar()["nomes"] == []


def test_lugar_invisivel_para_o_jogador_e_validado():
    with pytest.raises(ValueError, match="visivel_jogador"):
        lugares.validar_propriedades({"tipo": "cidade", "visivel_jogador": "não"})
    lugares.validar_propriedades({"tipo": "cidade", "visivel_jogador": False})
