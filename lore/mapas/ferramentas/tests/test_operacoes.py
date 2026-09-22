"""Testes de backend/operacoes.py -- desfazer/refazer entre operações concluídas
(B1, rodada noturna de 2026-09-22; formato de patch por feature, 2026-09-23).
Isolado num tmp_path (nunca toca em dados/ de verdade). O módulo não guarda nada em
memória entre chamadas (lê log.jsonl e cursor.json do disco toda vez) -- é o que faz
a pilha sobreviver a reiniciar o servidor; `test_sobrevive_a_reiniciar_o_servidor`
prova isso recarregando o módulo (`importlib.reload`) entre as chamadas, simulando
um processo novo apontado para a mesma pasta, em vez de só reusar o mesmo objeto de
módulo em memória.

**Mudança de 2026-09-23**: cada operação agora grava só as FEATURES afetadas (por
id), não o `FeatureCollection` inteiro -- `registrar_operacao` lê o arquivo atual do
disco e recebe `mudancas = {id: {"antes": feature|None, "depois": feature|None}}` em
vez de `estado_antes`/`estado_depois` com o documento inteiro."""

import importlib
import json

import pytest

from backend import historico, operacoes


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    pasta_hist = tmp_path / ".historico"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", pasta_hist)
    return tmp_path


def _escrever_featurecollection(tmp_path, caminho_relativo, features):
    caminho = tmp_path / caminho_relativo
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}), encoding="utf-8",
    )


def _feature(id_, valor):
    return {"type": "Feature", "geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {"id": id_, "valor": valor}}


def _ler(tmp_path, caminho_relativo):
    return json.loads((tmp_path / caminho_relativo).read_text(encoding="utf-8"))


def _ids(tmp_path, caminho_relativo):
    return sorted(f["properties"]["id"] for f in _ler(tmp_path, caminho_relativo)["features"])


def test_registrar_grava_so_a_feature_criada(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [])
    operacoes.registrar_operacao(
        "criar", "dados/x.json", {"vila-1": {"antes": None, "depois": _feature("vila-1", 1)}},
    )
    assert _ids(tmp_path, "dados/x.json") == ["vila-1"]


def test_registrar_nao_mexe_em_feature_que_nao_esta_na_mudanca(ambiente_isolado):
    """Prova central da correção de 2026-09-23: uma feature JÁ EXISTENTE, que não
    faz parte da mudança desta operação, sobrevive intacta -- o patch não é um
    substituto do arquivo inteiro."""
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("vila-ja-existia", 42)])
    operacoes.registrar_operacao(
        "criar", "dados/x.json", {"vila-nova": {"antes": None, "depois": _feature("vila-nova", 1)}},
    )
    dados = _ler(tmp_path, "dados/x.json")
    existia = next(f for f in dados["features"] if f["properties"]["id"] == "vila-ja-existia")
    assert existia["properties"]["valor"] == 42, "feature que não fazia parte da mudança não pode ter mudado"
    assert _ids(tmp_path, "dados/x.json") == ["vila-ja-existia", "vila-nova"]


def test_operacao_registrada_nao_guarda_o_arquivo_inteiro(ambiente_isolado):
    """Controle negativo da mudança de formato: a operação gravada no log tem que
    conter só a(s) feature(s) da mudança, não uma cópia do documento inteiro."""
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("a", 1), _feature("b", 2), _feature("c", 3)])
    op = operacoes.registrar_operacao(
        "editar", "dados/x.json", {"b": {"antes": _feature("b", 2), "depois": _feature("b", 99)}},
    )
    assert set(op["mudancas"].keys()) == {"b"}
    assert "estado_antes" not in op and "estado_depois" not in op
    tamanho_serializado = len(json.dumps(op))
    assert tamanho_serializado < 600, "uma operação com 1 feature não pode carregar o FeatureCollection inteiro"


def test_desfazer_restaura_so_a_feature_afetada(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("a", 1)])
    operacoes.registrar_operacao(
        "editar", "dados/x.json", {"a": {"antes": _feature("a", 1), "depois": _feature("a", 2)}},
    )
    op = operacoes.desfazer()
    assert op["tipo"] == "editar"
    dados = _ler(tmp_path, "dados/x.json")
    assert dados["features"][0]["properties"]["valor"] == 1


def test_desfazer_criar_remove_a_feature(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [])
    operacoes.registrar_operacao(
        "criar", "dados/x.json", {"vila-1": {"antes": None, "depois": _feature("vila-1", 1)}},
    )
    operacoes.desfazer()
    assert _ids(tmp_path, "dados/x.json") == []


def test_desfazer_apagar_devolve_a_feature(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("vila-1", 1)])
    operacoes.registrar_operacao(
        "apagar", "dados/x.json", {"vila-1": {"antes": _feature("vila-1", 1), "depois": None}},
    )
    assert _ids(tmp_path, "dados/x.json") == []
    operacoes.desfazer()
    assert _ids(tmp_path, "dados/x.json") == ["vila-1"]


def test_desfazer_sem_nada_pra_desfazer_devolve_none(ambiente_isolado):
    """Controle negativo: pilha vazia -> desfazer tem que devolver None e não
    quebrar, não inventar uma operação."""
    assert operacoes.desfazer() is None


def test_refazer_sem_nada_pra_refazer_devolve_none(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [])
    operacoes.registrar_operacao(
        "criar", "dados/x.json", {"vila-1": {"antes": None, "depois": _feature("vila-1", 1)}},
    )
    assert operacoes.refazer() is None, "cursor já está no fim do log -- não há o que refazer"


def test_desfazer_refazer_ida_e_volta(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("a", 0)])
    operacoes.registrar_operacao("passo1", "dados/x.json", {"a": {"antes": _feature("a", 0), "depois": _feature("a", 1)}})
    operacoes.registrar_operacao("passo2", "dados/x.json", {"a": {"antes": _feature("a", 1), "depois": _feature("a", 2)}})

    def valor():
        return _ler(tmp_path, "dados/x.json")["features"][0]["properties"]["valor"]

    assert valor() == 2
    operacoes.desfazer()
    assert valor() == 1
    operacoes.desfazer()
    assert valor() == 0
    assert operacoes.desfazer() is None  # controle negativo: não há mais o que desfazer
    assert valor() == 0

    operacoes.refazer()
    assert valor() == 1
    operacoes.refazer()
    assert valor() == 2
    assert operacoes.refazer() is None  # controle negativo: não há mais o que refazer


def test_operacao_nova_depois_de_desfazer_descarta_o_rabo_de_refazer(ambiente_isolado):
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("a", 0)])
    operacoes.registrar_operacao("passo1", "dados/x.json", {"a": {"antes": _feature("a", 0), "depois": _feature("a", 1)}})
    operacoes.registrar_operacao("passo2", "dados/x.json", {"a": {"antes": _feature("a", 1), "depois": _feature("a", 2)}})
    operacoes.desfazer()  # volta pra valor=1, "passo2" vira rabo de refazer

    operacoes.registrar_operacao("passo3", "dados/x.json", {"a": {"antes": _feature("a", 1), "depois": _feature("a", 99)}})

    assert _ler(tmp_path, "dados/x.json")["features"][0]["properties"]["valor"] == 99
    assert operacoes.refazer() is None, "passo2 tinha que ter sido descartado, não refeito"
    estado = operacoes.estado_pilha()
    assert estado["total"] == 2, "log tem 'passo1' e 'passo3' -- 'passo2' foi substituído, não são 3"


def test_sobrevive_a_reiniciar_o_servidor(ambiente_isolado):
    """Simula um processo novo: recarrega o módulo (nenhum estado sobrevive em
    memória do Python) apontado para a MESMA pasta em disco, e confirma que o
    desfazer ainda funciona -- é o requisito explícito do B1 ('sobrevivendo a
    fechar a aba e a reiniciar o servidor')."""
    tmp_path = ambiente_isolado
    _escrever_featurecollection(tmp_path, "dados/x.json", [_feature("a", 0)])
    operacoes.registrar_operacao("passo1", "dados/x.json", {"a": {"antes": _feature("a", 0), "depois": _feature("a", 1)}})

    modulo_novo = importlib.reload(operacoes)
    modulo_novo.RAIZ_MAPAS = tmp_path
    modulo_novo.PASTA_OPERACOES = tmp_path / ".operacoes"
    modulo_novo.CAMINHO_LOG = modulo_novo.PASTA_OPERACOES / "log.jsonl"
    modulo_novo.CAMINHO_CURSOR = modulo_novo.PASTA_OPERACOES / "cursor.json"

    estado = modulo_novo.estado_pilha()
    assert estado == {"pode_desfazer": True, "pode_refazer": False, "cursor": 1, "total": 1}

    op = modulo_novo.desfazer()
    assert op["tipo"] == "passo1"
    assert _ler(tmp_path, "dados/x.json")["features"][0]["properties"]["valor"] == 0

    # devolve o módulo global ao estado normal para não vazar pro resto da suíte
    importlib.reload(operacoes)
