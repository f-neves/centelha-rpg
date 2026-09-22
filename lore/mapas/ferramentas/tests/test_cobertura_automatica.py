"""Cobertura automática por latitude: cobre a tela inteira, e NUNCA vira dado.

O controle negativo que importa aqui não é sobre geometria: é sobre gravação. A
decisão registrada diz que o automático nunca é gravado como feature, e a forma de
provar isso é exigir que o arquivo de áreas fique byte a byte igual depois de pedir o
automático quantas vezes for.
"""

import json

import pytest
from shapely.geometry import Point, shape
from shapely.ops import unary_union

from backend import areas, cobertura_automatica, coordenadas, historico, operacoes, travas


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    """Mesma receita do `test_areas.py`: dados, log e histórico em tmp_path."""
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


def _limites():
    return coordenadas.carregar_coordenadas()["limites_da_tela"]


def test_as_faixas_cobrem_a_tela_inteira_sem_vao_nem_sobreposicao():
    faixas = cobertura_automatica.faixas()
    limites = _limites()
    assert faixas[0]["lat_max"] == limites["latitude_topo"]
    assert faixas[-1]["lat_min"] == limites["latitude_base"]
    for cima, baixo in zip(faixas, faixas[1:]):
        # O fim de uma é o começo da outra: sem vão (terra sem cobertura) e sem
        # sobreposição (duas coberturas no mesmo ponto).
        assert cima["lat_min"] == baixo["lat_max"]
    for faixa in faixas:
        assert faixa["lat_max"] > faixa["lat_min"]


def test_todo_valor_de_faixa_existe_no_vocabulario_da_camada():
    """CONTROLE NEGATIVO do vocabulário: um valor inventado na tabela passaria
    despercebido na tela (cor cinza) e só apareceria na rasterização."""
    validos = areas.VALORES_POR_CAMADA["cobertura"]
    for faixa in cobertura_automatica.faixas():
        assert faixa["valor"] in validos
    assert "planicie" not in validos  # o controle: relevo não vale como cobertura
    # Decisão do usuário (décima rodada): deserto e selva existem no vocabulário e são
    # pintados à mão, mas NÃO são padrão de nenhuma faixa, porque são exceções de
    # região e não de latitude (a faixa de 15°N a 25°N contém Syl, a parte mais
    # verdejante do mapa).
    automaticos = {f["valor"] for f in cobertura_automatica.faixas()}
    assert "deserto" not in automaticos and "selva" not in automaticos
    assert {"deserto", "selva"} <= validos


def test_um_ponto_de_terra_conhecido_cai_na_faixa_esperada(ambiente_isolado):
    """Sem isto, "as faixas cobrem tudo" passaria mesmo com a tabela invertida de
    norte para sul.

    **Precisa da fixture** (defeito achado pelo usuário em 2026-09-23): `colecao()`
    desconta o que está pintado, logo LÊ `dados/areas-pintadas.geojson`. Sem ambiente
    isolado este teste lia o arquivo de produção, passava por ele estar vazio, e
    quebraria sozinho no dia em que alguém pintasse cobertura nestas latitudes. A
    prova de que a fixture resolve está em `test_isolamento.py`.
    """
    colecao = cobertura_automatica.colecao()
    def valor_em(lon, lat):
        ponto = Point(lon, lat)
        achados = [
            f["properties"]["valor"] for f in colecao["features"]
            if shape(f["geometry"]).contains(ponto)
        ]
        assert len(achados) == 1, f"{lon},{lat} caiu em {len(achados)} faixas"
        return achados[0]

    assert valor_em(0.0, 60.0) == "geleira"            # extremo norte, White Wall
    assert valor_em(0.0, 20.0) == "campo"              # faixa quente, onde fica Syl
    assert valor_em(0.0, 0.0) == "floresta-tropical"   # equador, sul de Mére


def test_pintar_por_cima_tira_o_automatico_daquele_pedaco(ambiente_isolado):
    antes = cobertura_automatica.colecao()
    area_antes = unary_union([shape(f["geometry"]) for f in antes["features"]]).area

    areas.criar_area("area-0001", "cobertura", "pantano", {
        "type": "Polygon",
        "coordinates": [[[0, 19], [2, 19], [2, 21], [0, 21], [0, 19]]],
    })
    depois = cobertura_automatica.colecao()
    area_depois = unary_union([shape(f["geometry"]) for f in depois["features"]]).area
    assert area_depois == pytest.approx(area_antes - 4.0)
    # E o buraco está onde a pintura está, não em qualquer outro lugar.
    dentro = [f for f in depois["features"] if shape(f["geometry"]).contains(Point(1, 20))]
    assert dentro == []

    # Apagar devolve o automático, que é a outra metade do pedido.
    areas.apagar_area("area-0001")
    devolvido = cobertura_automatica.colecao()
    area_devolvida = unary_union([shape(f["geometry"]) for f in devolvido["features"]]).area
    assert area_devolvida == pytest.approx(area_antes)


def test_relevo_pintado_nao_abre_buraco_na_cobertura(ambiente_isolado):
    """CONTROLE NEGATIVO do desconto: as camadas são independentes, então pintar
    RELEVO não pode tirar cobertura automática. Se este passar junto com o anterior,
    o desconto está olhando a camada certa e não qualquer feature."""
    antes = unary_union([shape(f["geometry"]) for f in cobertura_automatica.colecao()["features"]]).area
    areas.criar_area("area-0002", "relevo", "montanha", {
        "type": "Polygon",
        "coordinates": [[[0, 19], [2, 19], [2, 21], [0, 21], [0, 19]]],
    })
    depois = unary_union([shape(f["geometry"]) for f in cobertura_automatica.colecao()["features"]]).area
    assert depois == pytest.approx(antes)


def test_o_automatico_nunca_e_gravado(ambiente_isolado):
    """O controle negativo da gravação: pedir o automático não pode tocar em arquivo
    nenhum. Comparação byte a byte do documento de áreas, e do log de operações, que
    é onde uma gravação apareceria mesmo que o arquivo final coincidisse."""
    antes = json.dumps(areas.carregar(), sort_keys=True)
    log = operacoes.CAMINHO_LOG
    tamanho_log_antes = log.stat().st_size if log.exists() else 0

    for _ in range(3):
        colecao = cobertura_automatica.colecao()
        assert colecao["features"], "a coleção veio vazia: o teste não testou nada"
        # Nenhuma feature calculada tem id: id é coisa de dado gravado.
        assert all("id" not in f["properties"] for f in colecao["features"])
        assert all(f["properties"]["automatico"] is True for f in colecao["features"])

    assert json.dumps(areas.carregar(), sort_keys=True) == antes
    tamanho_log_depois = log.stat().st_size if log.exists() else 0
    assert tamanho_log_depois == tamanho_log_antes
    assert areas.carregar()["features"] == []
