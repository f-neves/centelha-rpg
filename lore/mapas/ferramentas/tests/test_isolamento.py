"""O controle negativo da própria infraestrutura de teste.

Todo teste que grava usa uma fixture `ambiente_isolado` que aponta os módulos para um
`tmp_path`. A fixture é a coisa em que todo o resto confia, e ninguém a testava: se um
`monkeypatch.setattr` errasse o nome do atributo, ou um módulo passasse a ler o caminho
de outro jeito, os testes continuariam VERDES enquanto escrevessem no dado de
produção. Foi o que quase aconteceu em 2026-09-23: um teste de cobertura automática
chamava `colecao()` sem a fixture e lia o `dados/areas-pintadas.geojson` de verdade;
passava só porque o arquivo estava vazio naquele momento.

Estes testes provam as duas metades:

1. **sem a fixture**, os módulos apontam para o arquivo de produção (senão a fixture
   não estaria consertando nada, e o "isolamento" seria ilusão de nome);
2. **com a fixture**, escrever de verdade não muda um byte do arquivo de produção.
"""

import json
from pathlib import Path

import pytest

from backend import areas, cobertura_automatica, historico, lugares, operacoes, travas

RAIZ_MAPAS = Path(areas.__file__).resolve().parents[2]
AREAS_REAL = RAIZ_MAPAS / "dados" / "areas-pintadas.geojson"
LUGARES_REAL = RAIZ_MAPAS / "dados" / "lugares.geojson"


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".historico")

    caminho = tmp_path / "dados" / "areas-pintadas.geojson"
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(areas, "CAMINHO_DADOS", caminho)

    caminho_travas = tmp_path / "dados" / "camadas_travadas.json"
    caminho_travas.write_text(
        json.dumps({"versao_esquema": 1, "camadas": [{"id": c, "travada": False} for c in travas.CAMADAS_VALIDAS]}),
        encoding="utf-8",
    )
    monkeypatch.setattr(travas, "CAMINHO_DADOS", caminho_travas)
    return tmp_path


def test_sem_fixture_os_modulos_apontam_para_producao():
    """A metade que prova que há o que isolar. Se um dia este teste falhar, é porque
    algum módulo mudou de caminho, e todas as fixtures precisam ser revistas."""
    assert areas.CAMINHO_DADOS == AREAS_REAL
    assert lugares.CAMINHO_LUGARES == LUGARES_REAL
    assert AREAS_REAL.exists()


def test_com_fixture_gravar_nao_toca_no_arquivo_de_producao(ambiente_isolado):
    """A outra metade, e o controle negativo de verdade: grava, apaga, desfaz, e o
    arquivo real fica byte a byte igual."""
    antes = AREAS_REAL.read_bytes()
    assert areas.CAMINHO_DADOS != AREAS_REAL

    areas.criar_area("area-isolamento", "relevo", "montanha", {
        "type": "Polygon",
        "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    })
    assert len(areas.carregar()["features"]) == 1
    operacoes.desfazer()

    assert AREAS_REAL.read_bytes() == antes


def test_a_cobertura_automatica_le_o_arquivo_isolado(ambiente_isolado):
    """O defeito de 2026-09-23 em forma de teste: `colecao()` desconta o que está
    pintado, então ela LÊ o arquivo de áreas. Com a fixture, tem que ler o de
    mentira: pintar aqui muda o resultado, e o arquivo real não muda nada."""
    antes_real = AREAS_REAL.read_bytes()
    faixas_limpas = len(cobertura_automatica.colecao()["features"])

    areas.criar_area("area-isolamento-2", "cobertura", "campo", {
        "type": "Polygon",
        "coordinates": [[[0, 19], [2, 19], [2, 21], [0, 21], [0, 19]]],
    })
    colecao = cobertura_automatica.colecao()
    # A faixa que levou o furo continua existindo, mas com um anel a mais (o buraco).
    assert len(colecao["features"]) == faixas_limpas
    assert any(len(f["geometry"]["coordinates"]) > 1 for f in colecao["features"])
    assert AREAS_REAL.read_bytes() == antes_real
