"""Testes de backend/historico.py -- gravação atômica + últimas 5 versões (B1,
rodada noturna de 2026-09-22). Roda isolado num tmp_path do pytest: nunca toca em
dados/ de verdade (monkeypatch de PASTA_HISTORICO)."""

import json

import pytest

from backend import historico


@pytest.fixture
def pasta_historico_isolada(tmp_path, monkeypatch):
    pasta = tmp_path / ".historico"
    monkeypatch.setattr(historico, "PASTA_HISTORICO", pasta)
    return pasta


def test_grava_e_le_de_volta(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    historico.gravar_json_com_historico(caminho, {"a": 1})
    assert json.loads(caminho.read_text(encoding="utf-8")) == {"a": 1}


def test_grava_com_final_de_linha_lf_explicito(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    historico.gravar_json_com_historico(caminho, {"a": 1, "b": 2})
    cru = caminho.read_bytes()
    assert b"\r\n" not in cru, "CRLF no disco -- exatamente o achado do CLAUDE.md do repositorio"


def test_nao_sobra_arquivo_tmp(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    historico.gravar_json_com_historico(caminho, {"a": 1})
    assert not (tmp_path / "arquivo.json.tmp").exists()


def test_guarda_versao_no_historico(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    historico.gravar_json_com_historico(caminho, {"a": 1})
    versoes = historico.listar_versoes(caminho)
    assert len(versoes) == 1
    assert json.loads(versoes[0].read_text(encoding="utf-8")) == {"a": 1}


def test_mantem_so_as_5_mais_recentes(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    for i in range(8):
        historico.gravar_json_com_historico(caminho, {"n": i})
    versoes = historico.listar_versoes(caminho)
    assert len(versoes) == 5, "controle negativo: gravou 8 vezes, tem que sobrar exatamente 5, não 8"
    conteudos = [json.loads(v.read_text(encoding="utf-8"))["n"] for v in versoes]
    assert conteudos == [3, 4, 5, 6, 7], "as 5 mais RECENTES, não as 5 primeiras"


def test_arquivo_atual_e_a_ultima_versao_do_historico(tmp_path, pasta_historico_isolada):
    caminho = tmp_path / "arquivo.json"
    for i in range(3):
        historico.gravar_json_com_historico(caminho, {"n": i})
    versoes = historico.listar_versoes(caminho)
    assert json.loads(versoes[-1].read_text(encoding="utf-8")) == json.loads(caminho.read_text(encoding="utf-8"))


def test_controle_negativo_arquivo_diferente_tem_historico_proprio(tmp_path, pasta_historico_isolada):
    """Dois arquivos com o mesmo conteúdo não podem compartilhar a pasta de
    histórico -- cada NOME de arquivo tem a sua."""
    caminho_a = tmp_path / "a.json"
    caminho_b = tmp_path / "b.json"
    historico.gravar_json_com_historico(caminho_a, {"x": 1})
    assert historico.listar_versoes(caminho_b) == [], "b.json nunca foi gravado -- não pode ter histórico"
    assert len(historico.listar_versoes(caminho_a)) == 1
