"""Ferramenta de Rio: validação por segmento, exceção da foz e tolerância de 2 km.

Os testes rodam contra a costa oficial de verdade (`mascaras/costa_10240.png`), que é
só leitura, e gravam num `tmp_path`. Cada regra tem o seu controle negativo, e o mais
importante é o da validação por SEGMENTO: um traçado cujos dois vértices estão em
terra mas cuja reta cruza água tem que ser recusado, senão a validação estaria só
olhando vértice, como antes da correção 2 do ESPEC.
"""

import json

import pytest

from backend import areas, historico, lugares, operacoes, rios, travas

# Pontos conhecidos da costa oficial, os mesmos que já servem de referência nos outros
# testes: terra firme em Mére, e oceano aberto longe de tudo.
TERRA = (17.3389, 17.7768)
MAR_ABERTO = (-37.052, 23.832)


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".historico")

    caminho = tmp_path / "dados" / "rios.json"
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(rios, "CAMINHO_DADOS", caminho)

    caminho_areas = tmp_path / "dados" / "areas-pintadas.geojson"
    caminho_areas.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(areas, "CAMINHO_DADOS", caminho_areas)

    caminho_travas = tmp_path / "dados" / "camadas_travadas.json"
    caminho_travas.write_text(
        json.dumps({"versao_esquema": 1, "camadas": [{"id": c, "travada": False} for c in travas.CAMADAS_VALIDAS]}),
        encoding="utf-8",
    )
    monkeypatch.setattr(travas, "CAMINHO_DADOS", caminho_travas)
    return tmp_path


def _dois_pontos_de_terra_vizinhos():
    """Dois pontos em terra, perto um do outro, para formar um traçado válido."""
    lon, lat = TERRA
    return [[lon, lat], [lon + 0.05, lat - 0.05]]


def _ponto_de_foz():
    """Um ponto de terra logo ao lado da água: o penúltimo vértice de um rio que
    deságua. Achado varrendo para leste a partir de terra conhecida, contra a mesma
    máscara que o servidor usa."""
    lon, lat = TERRA
    passo = 0.02
    for i in range(1, 2000):
        candidato = lon + i * passo
        if not lugares.ponto_em_terra(candidato, lat):
            return [candidato - passo, lat], [candidato + passo, lat]
    raise AssertionError("não achei costa varrendo para leste: a máscara mudou?")


# --- o que tem que passar -----------------------------------------------------

def test_rio_em_terra_terminando_no_mar_e_aceito(ambiente_isolado):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [
        [ultimo_em_terra[0] - 0.1, ultimo_em_terra[1]], ultimo_em_terra, primeiro_na_agua,
    ]}
    f = rios.criar_rio("rio-0001", linha, {"tipo": "mar", "id": None})
    assert f["properties"]["travado"] is False
    assert f["properties"]["ramo_de"] is None
    assert len(rios.carregar()["features"]) == 1


def test_foz_curta_dentro_da_tolerancia_e_aceita(ambiente_isolado):
    """O ponto final ainda em TERRA, mas a menos de 2 km da água, vale: é a folga do
    ESPEC para o usuário não precisar acertar o pixel da costa."""
    ultimo_em_terra, _ = _ponto_de_foz()
    assert lugares.ponto_em_terra(*ultimo_em_terra)
    assert rios.distancia_ate_agua_km(*ultimo_em_terra) <= rios.TOLERANCIA_FOZ_KM
    linha = {"type": "LineString", "coordinates": [
        [ultimo_em_terra[0] - 0.1, ultimo_em_terra[1]], ultimo_em_terra,
    ]}
    rios.criar_rio("rio-0002", linha, {"tipo": "mar", "id": None})
    assert len(rios.carregar()["features"]) == 1


# --- controles negativos ------------------------------------------------------

def test_segmento_que_cruza_agua_e_recusado_mesmo_com_os_vertices_em_terra(ambiente_isolado):
    """O CONTROLE NEGATIVO da correção 2, e a razão de ela existir: os dois vértices
    ficam em terra, e a reta entre eles atravessa o mar. Validação por vértice
    aceitaria; por segmento, não."""
    lon, lat = TERRA
    # Um salto grande o bastante para sair da ilha e voltar: os extremos são terra
    # conhecida da mesma massa, e o meio é água.
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    outro_lado = None
    passo = 0.02
    for i in range(1, 4000):
        candidato = primeiro_na_agua[0] + i * passo
        if lugares.ponto_em_terra(candidato, lat):
            outro_lado = [candidato, lat]
            break
    if outro_lado is None:
        pytest.skip("não achei terra do outro lado da água nesta latitude")
    assert lugares.ponto_em_terra(*ultimo_em_terra) and lugares.ponto_em_terra(*outro_lado)
    assert not rios.segmento_em_terra(ultimo_em_terra, outro_lado)

    linha = {"type": "LineString", "coordinates": [ultimo_em_terra, outro_lado, [outro_lado[0] + 0.05, lat]]}
    with pytest.raises(ValueError, match="água"):
        rios.criar_rio("rio-pulador", linha, {"tipo": "mar", "id": None})
    assert rios.carregar()["features"] == [], "recusou e mesmo assim gravou"


def test_nascente_na_agua_e_recusada(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": [list(MAR_ABERTO), list(TERRA)]}
    with pytest.raises(ValueError, match="nascente"):
        rios.criar_rio("rio-0003", linha, {"tipo": "mar", "id": None})
    assert rios.carregar()["features"] == []


def test_rio_solto_no_meio_da_terra_e_recusado(ambiente_isolado):
    """Sem chegar ao mar nem a lago nem a outro rio: recusado, como o ESPEC manda."""
    linha = {"type": "LineString", "coordinates": _dois_pontos_de_terra_vizinhos()}
    with pytest.raises(ValueError, match="foz"):
        rios.criar_rio("rio-0004", linha, {"tipo": "mar", "id": None})
    assert rios.carregar()["features"] == []


def test_um_ponto_so_nao_e_rio(ambiente_isolado):
    with pytest.raises(ValueError, match="dois pontos"):
        rios.criar_rio("rio-0005", {"type": "LineString", "coordinates": [list(TERRA)]},
                       {"tipo": "mar", "id": None})


def test_poligono_nao_e_rio(ambiente_isolado):
    with pytest.raises(ValueError, match="LineString"):
        rios.criar_rio("rio-0006", {"type": "Polygon", "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 0]]]},
                       {"tipo": "mar", "id": None})


def test_tipo_de_fim_inventado_e_recusado(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": _dois_pontos_de_terra_vizinhos()}
    with pytest.raises(ValueError, match="termina_em"):
        rios.criar_rio("rio-0007", linha, {"tipo": "pantano-magico", "id": None})


def test_terminar_em_lago_inexistente_e_recusado(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": _dois_pontos_de_terra_vizinhos()}
    with pytest.raises(KeyError, match="lago"):
        rios.criar_rio("rio-0008", linha, {"tipo": "lago", "id": "area-nao-existe"})


def test_terminar_em_lago_que_existe_e_aceito(ambiente_isolado):
    lon, lat = TERRA
    areas.criar_area("area-lago-1", "lago", "lago", {
        "type": "Polygon",
        "coordinates": [[[lon, lat], [lon + 1, lat], [lon + 1, lat + 1], [lon, lat + 1], [lon, lat]]],
    })
    linha = {"type": "LineString", "coordinates": _dois_pontos_de_terra_vizinhos()}
    rios.criar_rio("rio-0009", linha, {"tipo": "lago", "id": "area-lago-1"})
    assert len(rios.carregar()["features"]) == 1


def test_braco_de_delta_precisa_de_rio_mae_existente(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": _dois_pontos_de_terra_vizinhos()}
    with pytest.raises(KeyError, match="rio desconhecido"):
        rios.criar_rio("rio-0010", linha, {"tipo": "rio", "id": "rio-fantasma"}, ramo_de="rio-fantasma")


def test_id_repetido_e_recusado(ambiente_isolado):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [ultimo_em_terra, primeiro_na_agua]}
    rios.criar_rio("rio-0011", linha, {"tipo": "mar", "id": None})
    with pytest.raises(ValueError, match="já existe"):
        rios.criar_rio("rio-0011", linha, {"tipo": "mar", "id": None})
    assert len(rios.carregar()["features"]) == 1


# --- trava e desfazer ---------------------------------------------------------

def test_rio_travado_nao_se_apaga(ambiente_isolado):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [ultimo_em_terra, primeiro_na_agua]}
    rios.criar_rio("rio-0012", linha, {"tipo": "mar", "id": None})
    rios.definir_trava("rio-0012", True)
    with pytest.raises(travas.Travado):
        rios.apagar_rio("rio-0012")
    assert len(rios.carregar()["features"]) == 1
    # E a recusa por trava NÃO é dado inválido: os dois canais continuam separados.
    assert not issubclass(travas.Travado, ValueError)


def test_camada_travada_impede_criar_sem_tocar_no_objeto(ambiente_isolado):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [ultimo_em_terra, primeiro_na_agua]}
    rios.criar_rio("rio-0013", linha, {"tipo": "mar", "id": None})
    antes = json.dumps(rios.carregar(), sort_keys=True)

    travas.definir_trava_camada("rios", True)
    with pytest.raises(travas.Travado):
        rios.criar_rio("rio-0014", linha, {"tipo": "mar", "id": None})
    # O cadeado de camada não escreve no objeto: byte a byte igual.
    assert json.dumps(rios.carregar(), sort_keys=True) == antes


def test_criar_e_apagar_passam_pelo_desfazer(ambiente_isolado):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [ultimo_em_terra, primeiro_na_agua]}
    rios.criar_rio("rio-0015", linha, {"tipo": "mar", "id": None})
    rios.apagar_rio("rio-0015")
    assert rios.carregar()["features"] == []

    operacoes.desfazer()
    assert len(rios.carregar()["features"]) == 1
    operacoes.desfazer()
    assert rios.carregar()["features"] == []
    operacoes.refazer()
    assert len(rios.carregar()["features"]) == 1


# --- Edição de vértice (2026-09-23, noite) ------------------------------------------

def _rio_valido(id_rio="rio-0001"):
    ultimo_em_terra, primeiro_na_agua = _ponto_de_foz()
    linha = {"type": "LineString", "coordinates": [
        [ultimo_em_terra[0] - 0.1, ultimo_em_terra[1]], ultimo_em_terra, primeiro_na_agua]}
    rios.criar_rio(id_rio, linha, {"tipo": "mar", "id": None})
    return linha


def test_editar_rio_valida_de_novo_e_grava(ambiente_isolado):
    linha = _rio_valido()
    nova = {"type": "LineString", "coordinates": [[linha["coordinates"][0][0] - 0.1,
            linha["coordinates"][0][1]]] + linha["coordinates"]}
    rio, dependentes = rios.editar_geometria("rio-0001", nova)
    assert len(rio["geometry"]["coordinates"]) == 4 and dependentes == []
    assert rios.carregar()["features"][0]["properties"]["termina_em"] == {"tipo": "mar", "id": None}


def test_editar_rio_para_um_traçado_na_agua_e_recusado(ambiente_isolado):
    """O controle negativo: a mesma validação da criação vale na edição."""
    _rio_valido()
    antes = rios.CAMINHO_DADOS.read_bytes()
    na_agua = {"type": "LineString", "coordinates": [list(MAR_ABERTO), [MAR_ABERTO[0] + 0.1, MAR_ABERTO[1]]]}
    with pytest.raises(ValueError, match="nascente"):
        rios.editar_geometria("rio-0001", na_agua)
    assert rios.CAMINHO_DADOS.read_bytes() == antes


def test_rio_travado_nao_se_edita(ambiente_isolado):
    linha = _rio_valido()
    rios.definir_trava("rio-0001", True)
    antes = rios.CAMINHO_DADOS.read_bytes()
    with pytest.raises(travas.Travado):
        rios.editar_geometria("rio-0001", linha)
    assert rios.CAMINHO_DADOS.read_bytes() == antes


def test_editar_rio_devolve_afluentes_e_bracos(ambiente_isolado):
    linha = _rio_valido("mae")
    lon, lat = TERRA
    afluente = {"type": "LineString", "coordinates": [[lon, lat], [lon + 0.05, lat - 0.05]]}
    rios.criar_rio("afluente", afluente, {"tipo": "rio", "id": "mae"})
    rios.criar_rio("braco", linha, {"tipo": "mar", "id": None}, ramo_de="mae")
    rios.criar_rio("solto", linha, {"tipo": "mar", "id": None})
    _, dependentes = rios.editar_geometria("mae", linha)
    assert sorted((d["id"], d["ligacao"]) for d in dependentes) == [
        ("afluente", "afluente"), ("braco", "braco-de-delta")]
