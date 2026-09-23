"""Etapa 10 sem o cache de ilha (2026-09-23, noite): regiões e pertencimento de massa.
Isolado: cópias de `regioes.json` e `massas.geojson` numa pasta temporária, nunca os de
verdade. Toda recusa confere que os dois arquivos ficaram iguais byte a byte, e cada
gravação tem ao lado o caso que precisa falhar."""

import json
import shutil

import pytest
from fastapi import HTTPException

from backend import historico, main, operacoes, regioes

RAIZ = regioes.RAIZ_MAPAS


@pytest.fixture
def isolado(tmp_path, monkeypatch):
    (tmp_path / "dados").mkdir()
    shutil.copy(RAIZ / "dados" / "regioes.json", tmp_path / "dados" / "regioes.json")
    shutil.copy(RAIZ / "dados" / "massas.geojson", tmp_path / "dados" / "massas.geojson")
    pasta_op = tmp_path / ".operacoes"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".historico")
    monkeypatch.setattr(regioes, "CAMINHO_REGIOES", tmp_path / "dados" / "regioes.json")
    monkeypatch.setattr(regioes, "CAMINHO_MASSAS", tmp_path / "dados" / "massas.geojson")
    return tmp_path


def _bytes(p):
    return (p / "dados" / "regioes.json").read_bytes() + (p / "dados" / "massas.geojson").read_bytes()


def _ids():
    return [r["id"] for r in regioes.carregar_regioes()["regioes"]]


def _massa(id_massa):
    return next(f for f in regioes.carregar_massas()["features"] if f["properties"]["id"] == id_massa)


def test_o_arquivo_de_verdade_nao_e_tocado(isolado):
    antes = (RAIZ / "dados" / "regioes.json").read_bytes()
    regioes.criar_regiao("mar-de-syl", "Mar de Syl", "mar", None, {"lon": -10, "lat": 5})
    assert (RAIZ / "dados" / "regioes.json").read_bytes() == antes
    assert "mar-de-syl" in _ids()


# --- criar ----------------------------------------------------------------------

def test_criar_regiao_com_pai_e_rotulo(isolado):
    r = regioes.criar_regiao("norte-de-mere", "Norte de Mére", "provincia", "mere", {"lon": 22.5, "lat": 36})
    assert r["pai"] == "mere" and r["geometria"] is None
    assert r["rotulo"] == {"type": "Point", "coordinates": [22.5, 36.0]}


@pytest.mark.parametrize("args", [
    ("Mar-De-Syl", "Mar", "mar", None, None),          # id fora do slug
    ("mere", "Outra", "ilha", None, None),             # id repetido
    ("x", "", "mar", None, None),                      # nome vazio
    ("x", "X", "continente", None, None),              # tipo fora do vocabulário
    ("x", "X", "mar", "atlantida", None),              # pai inexistente
    ("x", "X", "mar", None, {"lon": 80, "lat": 0}),    # rótulo fora da tela
    ("x", "X", "mar", None, {"lon": "1", "lat": 0}),   # rótulo não numérico
])
def test_criar_recusa_dado_invalido_sem_gravar(isolado, args):
    antes = _bytes(isolado)
    with pytest.raises(ValueError):
        regioes.criar_regiao(*args)
    assert _bytes(isolado) == antes


# --- editar e ciclo ----------------------------------------------------------------

def test_editar_troca_nome_tipo_e_pai(isolado):
    regioes.criar_regiao("norte", "Norte", "provincia", "mere")
    r = regioes.editar_regiao("norte", "Norte Gelado", "reino", "waning")
    assert (r["nome"], r["tipo"], r["pai"]) == ("Norte Gelado", "reino", "waning")


def test_pai_que_formaria_ciclo_e_recusado(isolado):
    """`waning` é pai de `mere`; fazer `mere` pai de `waning` fecha um ciclo."""
    antes = _bytes(isolado)
    with pytest.raises(ValueError, match="ciclo"):
        regioes.editar_regiao("waning", "Waning", "arquipelago", "mere")
    with pytest.raises(ValueError):
        regioes.editar_regiao("mere", "Mére", "ilha", "mere")
    assert _bytes(isolado) == antes
    # Controle: um pai sem ciclo passa.
    regioes.editar_regiao("the-neck", "The Neck", "arquipelago", "white-wall")


def test_editar_regiao_inexistente_e_keyerror(isolado):
    with pytest.raises(KeyError):
        regioes.editar_regiao("atlantida", "A", "ilha", None)


# --- apagar --------------------------------------------------------------------

def test_apagar_regiao_com_filhas_ou_massas_e_recusado(isolado):
    antes = _bytes(isolado)
    with pytest.raises(regioes.EmUso, match="pai de"):
        regioes.apagar_regiao("waning")       # pai de mere, syl, calin
    with pytest.raises(regioes.EmUso, match="massas"):
        regioes.apagar_regiao("mere")         # mere-principal é dela
    assert _bytes(isolado) == antes


def test_apagar_regiao_livre(isolado):
    regioes.criar_regiao("mar-de-syl", "Mar de Syl", "mar")
    regioes.apagar_regiao("mar-de-syl")
    assert "mar-de-syl" not in _ids()


# --- massas ----------------------------------------------------------------------

def test_atribuir_e_tirar_massa(isolado):
    m = regioes.atribuir_massa("ilha-046", "white-wall")
    assert m["properties"]["regiao"] == "white-wall" and m["properties"]["status"] == "atribuida"
    m = regioes.atribuir_massa("ilha-046", None)
    assert m["properties"]["regiao"] is None and m["properties"]["status"] == "sem_regiao"
    # O resto da massa (ponto, área, nota) não muda.
    assert _massa("ilha-046")["geometry"]["coordinates"] == [-40.6496, 60.9561]


def test_atribuir_a_regiao_inexistente_e_recusado(isolado):
    antes = _bytes(isolado)
    with pytest.raises(ValueError):
        regioes.atribuir_massa("ilha-046", "atlantida")
    with pytest.raises(KeyError):
        regioes.atribuir_massa("ilha-999", "mere")
    assert _bytes(isolado) == antes


def test_tirar_a_ultima_massa_libera_o_apagar(isolado):
    regioes.criar_regiao("ilhota", "Ilhota", "ilha")
    regioes.atribuir_massa("ilha-046", "ilhota")
    with pytest.raises(regioes.EmUso):
        regioes.apagar_regiao("ilhota")
    regioes.atribuir_massa("ilha-046", None)
    regioes.apagar_regiao("ilhota")


# --- desfazer ------------------------------------------------------------------------

def test_desfazer_e_refazer_passam_pelas_duas_escritas(isolado):
    inicial = _bytes(isolado)
    regioes.criar_regiao("ilhota", "Ilhota", "ilha")
    regioes.atribuir_massa("ilha-046", "ilhota")
    operacoes.desfazer()
    assert _massa("ilha-046")["properties"]["regiao"] is None
    operacoes.desfazer()
    assert "ilhota" not in _ids()
    # Conteúdo igual ao inicial (o arquivo é regravado com outra formatação).
    assert json.loads((isolado / "dados" / "regioes.json").read_text(encoding="utf-8")) == \
        json.loads(inicial[: len((RAIZ / "dados" / "regioes.json").read_bytes())].decode("utf-8"))
    operacoes.refazer()
    operacoes.refazer()
    assert _massa("ilha-046")["properties"]["regiao"] == "ilhota"


# --- rotas ---------------------------------------------------------------------------

def test_rotas_devolvem_codigos_certos(isolado):
    assert "regioes" in json.loads(main.obter_regioes().body)
    with pytest.raises(HTTPException) as e:
        main.apagar_regiao("mere")
    assert e.value.status_code == 409
    with pytest.raises(HTTPException) as e:
        main.criar_regiao(main.NovaRegiao(id="x", nome="X", tipo="continente"))
    assert e.value.status_code == 422
    with pytest.raises(HTTPException) as e:
        main.atribuir_massa("ilha-999", main.AtribuicaoMassa(regiao="mere"))
    assert e.value.status_code == 404
    corpo = json.loads(main.criar_regiao(main.NovaRegiao(id="x", nome="X", tipo="mar")).body)
    assert "x" in [r["id"] for r in corpo["regioes"]["regioes"]]
