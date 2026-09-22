"""Testes de travar objeto e do cadeado geral por camada (pedido de 2026-09-23,
item 1). Reusa o `ambiente_isolado` de test_lugares.py (mesma pasta temporária,
mesma costa sintética, mesmas travas isoladas) -- nunca toca em dado de verdade.

Todo teste daqui que aprova alguma coisa tem o controle negativo do lado: a
recusa correspondente, e a prova de que o arquivo NÃO mudou depois dela.
"""

import json

import pytest

from backend import lugares, operacoes, travas
from tests.test_lugares import ambiente_isolado  # noqa: F401  (fixture)


def _criar(id_lugar="vila-teste", travado=False):
    return lugares.criar_lugar(id_lugar, lon=0, lat=5, propriedades={"tipo": "vila", "travado": travado})


def _props(id_lugar):
    return lugares._achar(lugares.carregar(), id_lugar)["properties"]


# --- Objeto travado ----------------------------------------------------------

def test_lugar_nasce_livre(ambiente_isolado):
    _criar()
    assert _props("vila-teste")["travado"] is False


def test_travado_nao_move(ambiente_isolado):
    """Controle negativo do item 1b: travado não se move, e o dado não muda."""
    _criar()
    lugares.definir_trava("vila-teste", True)
    with pytest.raises(travas.Travado):
        lugares.mover_lugar("vila-teste", lon=2, lat=6)
    assert lugares._achar(lugares.carregar(), "vila-teste")["geometry"]["coordinates"] == [0, 5]


def test_travado_nao_apaga(ambiente_isolado):
    _criar()
    lugares.definir_trava("vila-teste", True)
    with pytest.raises(travas.Travado):
        lugares.apagar_lugar("vila-teste")
    assert len(lugares.carregar()["features"]) == 1


def test_travado_nao_edita(ambiente_isolado):
    _criar()
    lugares.definir_trava("vila-teste", True)
    with pytest.raises(travas.Travado):
        lugares.editar_lugar("vila-teste", {"nome": "nome novo"})
    assert _props("vila-teste").get("nome") is None


def test_destravado_volta_a_mover(ambiente_isolado):
    """Controle POSITIVO do mesmo caminho: sem isto, um bug que recusasse tudo
    passaria nos três testes acima."""
    _criar()
    lugares.definir_trava("vila-teste", True)
    lugares.definir_trava("vila-teste", False)
    lugares.mover_lugar("vila-teste", lon=2, lat=6)
    assert lugares._achar(lugares.carregar(), "vila-teste")["geometry"]["coordinates"] == [2, 6]


def test_travado_tem_que_ser_booleano(ambiente_isolado):
    """Controle negativo do valor: 'sim' não é trava, é dado inválido -- e a
    recusa é ValueError (422), não Travado (409)."""
    with pytest.raises(ValueError):
        lugares.criar_lugar("x", lon=0, lat=5, propriedades={"tipo": "vila", "travado": "sim"})
    with pytest.raises(ValueError):
        lugares.definir_trava("x", "sim")


def test_recusa_por_trava_nao_se_confunde_com_dado_invalido(ambiente_isolado):
    """O frontend decide entre aviso discreto e faixa de erro pelo TIPO da recusa
    (409 x 422), sem ler a mensagem -- então as duas têm que ser classes
    diferentes. `Travado` não pode ser um `ValueError` disfarçado."""
    assert not issubclass(travas.Travado, ValueError)
    _criar()
    lugares.definir_trava("vila-teste", True)
    with pytest.raises(travas.Travado):
        lugares.mover_lugar("vila-teste", lon=0, lat=-5)  # travado E no mar: a trava vem antes


# --- Cadeado geral por camada ------------------------------------------------

def test_camada_travada_bloqueia_objeto_livre(ambiente_isolado):
    """O caso que define o cadeado de camada: o objeto está LIVRE e mesmo assim
    não se move, porque a camada está travada."""
    _criar()
    travas.definir_trava_camada("lugares", True)
    assert _props("vila-teste")["travado"] is False
    with pytest.raises(travas.Travado):
        lugares.mover_lugar("vila-teste", lon=2, lat=6)
    with pytest.raises(travas.Travado):
        lugares.apagar_lugar("vila-teste")
    with pytest.raises(travas.Travado):
        lugares.criar_lugar("outra", lon=1, lat=5, propriedades={"tipo": "vila"})
    assert len(lugares.carregar()["features"]) == 1


def test_camada_travada_nao_mexe_no_estado_individual(ambiente_isolado):
    """Item 1d, o teste que pega a implementação ingênua: travar a camada não
    pode escrever `travado: true` em objeto nenhum, senão destravar a camada não
    teria como devolver cada um ao que era. Ida e volta byte a byte."""
    _criar("livre", travado=False)
    _criar("preso", travado=False)
    lugares.definir_trava("preso", True)

    antes = json.dumps(lugares.carregar(), sort_keys=True)
    travas.definir_trava_camada("lugares", True)
    durante = json.dumps(lugares.carregar(), sort_keys=True)
    assert durante == antes, "travar a camada NÃO pode alterar lugares.geojson"

    travas.definir_trava_camada("lugares", False)
    assert json.dumps(lugares.carregar(), sort_keys=True) == antes
    assert _props("livre")["travado"] is False
    assert _props("preso")["travado"] is True


def test_camada_travada_nao_deixa_mudar_trava_individual(ambiente_isolado):
    _criar()
    travas.definir_trava_camada("lugares", True)
    with pytest.raises(travas.Travado):
        lugares.definir_trava("vila-teste", True)
    assert _props("vila-teste")["travado"] is False


def test_camada_desconhecida_e_recusada(ambiente_isolado):
    """Controle negativo do vocabulário: camada que não existe não vira linha nova."""
    with pytest.raises(KeyError):
        travas.definir_trava_camada("inventada", True)
    assert len(travas.carregar()["camadas"]) == len(travas.CAMADAS_VALIDAS)


def test_travada_tem_que_ser_booleano(ambiente_isolado):
    with pytest.raises(ValueError):
        travas.definir_trava_camada("lugares", "sim")
    assert travas.camada_travada("lugares") is False


# --- Desfazer (item 1f) ------------------------------------------------------

def test_desfazer_trava_de_objeto(ambiente_isolado):
    _criar()
    lugares.definir_trava("vila-teste", True)
    assert _props("vila-teste")["travado"] is True
    operacoes.desfazer()
    assert _props("vila-teste")["travado"] is False
    operacoes.refazer()
    assert _props("vila-teste")["travado"] is True


def test_desfazer_trava_de_camada(ambiente_isolado):
    travas.definir_trava_camada("lugares", True)
    assert travas.camada_travada("lugares") is True
    operacoes.desfazer()
    assert travas.camada_travada("lugares") is False
    operacoes.refazer()
    assert travas.camada_travada("lugares") is True


def test_desfazer_trava_de_camada_nao_perde_as_outras(ambiente_isolado):
    """Controle negativo do formato de lista: desfazer aplica só o item citado,
    as outras cinco camadas continuam no arquivo."""
    travas.definir_trava_camada("relevo", True)
    operacoes.desfazer()
    ids = [c["id"] for c in travas.carregar()["camadas"]]
    assert ids == list(travas.CAMADAS_VALIDAS)
