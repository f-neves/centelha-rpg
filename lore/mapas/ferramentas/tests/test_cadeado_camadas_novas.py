"""Cadeado de camada para regiões, nomes, elementos e rotas (item c da rodada das
pendências, 2026-09-23). Tudo numa pasta temporária: o `camadas_travadas.json` de
teste é uma cópia do de verdade, SEM as linhas das quatro camadas novas, que é o
estado em que o arquivo real está. Toda recusa confere que nenhum arquivo mudou
(controle negativo), e todo caminho recusado tem o caminho feliz ao lado."""

import json
import shutil
from pathlib import Path

import pytest

from backend import elementos, historico, main, nomes, operacoes, regioes, rotas, travas

RAIZ = Path(__file__).resolve().parents[2]
NOVAS = ("regioes", "nomes", "elementos", "rotas")


@pytest.fixture
def isolado(tmp_path, monkeypatch):
    dados = tmp_path / "dados"
    dados.mkdir()
    for nome in ("camadas_travadas.json", "regioes.json", "massas.geojson"):
        shutil.copy(RAIZ / "dados" / nome, dados / nome)
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", tmp_path / ".op")
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", tmp_path / ".op" / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", tmp_path / ".op" / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".hist")
    monkeypatch.setattr(travas, "CAMINHO_DADOS", dados / "camadas_travadas.json")
    monkeypatch.setattr(regioes, "CAMINHO_REGIOES", dados / "regioes.json")
    monkeypatch.setattr(regioes, "CAMINHO_MASSAS", dados / "massas.geojson")
    monkeypatch.setattr(nomes, "CAMINHO", dados / "nomes.json")
    monkeypatch.setattr(elementos, "CAMINHO", dados / "elementos.json")
    monkeypatch.setattr(rotas, "CAMINHO_DADOS", dados / "rotas.json")
    return tmp_path


def _foto(tmp):
    return {p.name: p.read_bytes() for p in sorted((tmp / "dados").iterdir())}


def test_o_arquivo_real_nao_tem_as_linhas_novas_e_elas_valem_livres(isolado):
    """O estado de partida: nenhuma das quatro tem linha, e todas estão livres."""
    ids = {c["id"] for c in travas.carregar()["camadas"]}
    assert not ids & set(NOVAS)
    assert not any(travas.camada_travada(c) for c in NOVAS)
    assert {c["id"] for c in travas.estado()["camadas"]} == set(travas.CAMADAS_VALIDAS)


def test_camada_fora_do_vocabulario_continua_recusada(isolado):
    with pytest.raises(KeyError):
        travas.definir_trava_camada("nuvens", True)
    with pytest.raises(KeyError):
        travas.camada_travada("nuvens")


def test_travar_cria_a_linha_e_desfazer_tira(isolado):
    antes = (isolado / "dados" / "camadas_travadas.json").read_bytes()
    travas.definir_trava_camada("rotas", True)
    assert travas.camada_travada("rotas")
    assert "rotas" in {c["id"] for c in travas.carregar()["camadas"]}
    operacoes.desfazer()
    assert not travas.camada_travada("rotas")
    assert json.loads((isolado / "dados" / "camadas_travadas.json").read_bytes()) == json.loads(antes)


def _recusa(isolado, camada, gesto):
    travas.definir_trava_camada(camada, True)
    foto = _foto(isolado)
    with pytest.raises(travas.Travado):
        gesto()
    assert _foto(isolado) == foto
    travas.definir_trava_camada(camada, False)


def test_regioes(isolado):
    _recusa(isolado, "regioes", lambda: regioes.criar_regiao("mar-teste", "Mar Teste", "mar"))
    regioes.criar_regiao("mar-teste", "Mar Teste", "mar")              # caminho feliz
    _recusa(isolado, "regioes", lambda: regioes.editar_regiao("mar-teste", "Outro", "mar", None))
    _recusa(isolado, "regioes", lambda: regioes.mover_rotulo(
        "mar-teste", {"type": "Point", "coordinates": [0.0, 0.0]}))
    _recusa(isolado, "regioes", lambda: regioes.apagar_regiao("mar-teste"))
    massa = regioes.carregar_massas()["features"][0]["properties"]["id"]
    _recusa(isolado, "regioes", lambda: regioes.atribuir_massa(massa, None))
    _recusa(isolado, "regioes", lambda: regioes.criar_massa(0.0, 0.0))
    regioes.apagar_regiao("mar-teste")                                   # livre de novo
    assert "mar-teste" not in [r["id"] for r in regioes.carregar_regioes()["regioes"]]


def _livre(texto="Mar de Teste"):
    return {"alvo": {"tipo": "livre", "id": None}, "texto": texto,
            "posicao": {"type": "Point", "coordinates": [0.0, 0.0]}}


def test_nomes(isolado):
    _recusa(isolado, "nomes", lambda: nomes.criar(_livre()))
    novo = nomes.criar(_livre())
    _recusa(isolado, "nomes", lambda: nomes.editar(novo["id"], {"nivel": 4}))
    _recusa(isolado, "nomes", lambda: nomes.apagar(novo["id"]))
    nomes.apagar(novo["id"])
    assert nomes.carregar()["nomes"] == []


def _rosa():
    return {"tipo": "rosa", "posicao": {"type": "Point", "coordinates": [30.0, 20.0]}}


def test_elementos(isolado):
    _recusa(isolado, "elementos", lambda: elementos.criar(_rosa()))
    e = elementos.criar(_rosa())
    _recusa(isolado, "elementos", lambda: elementos.editar(e["id"], {"tamanho": 500}))
    _recusa(isolado, "elementos", lambda: elementos.apagar(e["id"]))
    _recusa(isolado, "elementos", lambda: elementos.criar_padroes())
    elementos.apagar(e["id"])
    assert elementos.carregar()["elementos"] == []


def test_rotas_a_trava_vem_antes_da_validacao(isolado):
    """Com a camada travada, até um pedido inválido é recusado pela TRAVA (o aviso
    discreto), e não pelo dado; destravada, o mesmo pedido cai na validação."""
    invalido = {"pontos": [], "trechos": []}
    _recusa(isolado, "rotas", lambda: rotas.criar({"tipo": "terrestre"}, invalido))
    with pytest.raises(ValueError):
        rotas.criar({"tipo": "terrestre"}, invalido)
    _recusa(isolado, "rotas", lambda: rotas.editar("rota-0001", {"nome": "x"}))
    _recusa(isolado, "rotas", lambda: rotas.apagar("rota-0001"))
    with pytest.raises(KeyError):                                        # livre: chega no dado
        rotas.apagar("rota-0001")


def test_trava_de_camada_nao_escreve_no_objeto(isolado):
    """A regra das seis camadas antigas vale nas novas: travar e destravar a camada
    não muda o nome, e o nome travado por objeto continua travado depois."""
    novo = nomes.criar(_livre())
    nomes.editar(novo["id"], {"travado": True})
    antes = (isolado / "dados" / "nomes.json").read_bytes()
    travas.definir_trava_camada("nomes", True)
    travas.definir_trava_camada("nomes", False)
    assert (isolado / "dados" / "nomes.json").read_bytes() == antes
    with pytest.raises(travas.Travado):
        nomes.apagar(novo["id"])


def test_recusa_por_trava_vira_409_em_qualquer_rota():
    """O venv não tem httpx (TestClient); confere o tratador registrado e a resposta
    dele chamando-o direto."""
    tratador = main.app.exception_handlers[travas.Travado]
    r = tratador(None, travas.Travado("a camada 'rotas' está travada"))
    assert r.status_code == 409
    assert json.loads(r.body) == {"detail": "a camada 'rotas' está travada"}
