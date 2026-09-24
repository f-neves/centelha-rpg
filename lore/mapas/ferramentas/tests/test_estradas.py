"""Ferramenta de Estrada: a atração de 5 km e a lista de lugares derivada dela.

O controle negativo que decide se a atração existe de verdade é o do RAIO: um ponto
logo dentro dos 5 km tem que grudar, e um ponto logo fora tem que ficar exatamente
onde estava. Sem a segunda metade, uma atração que puxasse tudo (ou nada) passaria.
"""

import json

import pytest

from backend import estradas, geo, historico, lugares, operacoes, rios, travas

# Terra conhecida na costa oficial, a mesma dos outros testes.
TERRA_LON, TERRA_LAT = 17.3389, 17.7768


@pytest.fixture
def ambiente_isolado(tmp_path, monkeypatch):
    pasta_op = tmp_path / ".operacoes"
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", pasta_op)
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", pasta_op / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", pasta_op / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".historico")

    caminho = tmp_path / "dados" / "estradas.json"
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(estradas, "CAMINHO_DADOS", caminho)

    caminho_lugares = tmp_path / "dados" / "lugares.geojson"
    caminho_lugares.write_text(
        json.dumps({"type": "FeatureCollection", "properties": {}, "features": []}),
        encoding="utf-8",
    )
    monkeypatch.setattr(lugares, "CAMINHO_LUGARES", caminho_lugares)

    caminho_travas = tmp_path / "dados" / "camadas_travadas.json"
    caminho_travas.write_text(
        json.dumps({"versao_esquema": 1, "camadas": [{"id": c, "travada": False} for c in travas.CAMADAS_VALIDAS]}),
        encoding="utf-8",
    )
    monkeypatch.setattr(travas, "CAMINHO_DADOS", caminho_travas)
    return tmp_path


def _por_um_lugar(id_lugar, lon, lat):
    """Escreve direto no arquivo isolado: criar pelo módulo exigiria terra, e alguns
    testes querem o lugar exatamente onde mandam."""
    doc = lugares.carregar()
    doc["features"].append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon, lat]},
        "properties": {"id": id_lugar, "nome": id_lugar, "tipo": "vila",
                       "importancia": "pequena", "capital": False, "travado": False},
    })
    lugares.CAMINHO_LUGARES.write_text(json.dumps(doc), encoding="utf-8")


def _graus_para_km(km):
    """Quantos graus de LONGITUDE, no equador da projeção, valem esses km."""
    return km / geo.haversine_km(0, 0, 0, 1)


# --- a atração ----------------------------------------------------------------

def test_ponto_dentro_dos_5_km_assume_a_coordenada_exata_do_lugar(ambiente_isolado):
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    quase = TERRA_LON + _graus_para_km(4.0)
    pontos, ids = estradas.atrair([[quase, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT]])
    assert pontos[0] == [TERRA_LON, TERRA_LAT], "não assumiu a coordenada exata do lugar"
    assert ids == ["vila-do-vau"]


def test_ponto_fora_dos_5_km_nao_e_movido(ambiente_isolado):
    """CONTROLE NEGATIVO do raio: sem ele, uma atração que puxasse qualquer ponto
    passaria no teste de cima."""
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    longe = TERRA_LON + _graus_para_km(6.0)
    pontos, ids = estradas.atrair([[longe, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT]])
    assert pontos[0] == [longe, TERRA_LAT], "moveu um ponto que estava fora do raio"
    assert ids == []


def test_entre_dois_lugares_no_raio_vence_o_mais_proximo(ambiente_isolado):
    _por_um_lugar("perto", TERRA_LON + _graus_para_km(1.0), TERRA_LAT)
    _por_um_lugar("longe", TERRA_LON + _graus_para_km(4.0), TERRA_LAT)
    pontos, ids = estradas.atrair([[TERRA_LON, TERRA_LAT]])
    assert ids == ["perto"]


def test_a_lista_de_lugares_sai_na_ordem_do_tracado(ambiente_isolado):
    _por_um_lugar("a", TERRA_LON, TERRA_LAT)
    _por_um_lugar("b", TERRA_LON + 0.5, TERRA_LAT)
    _por_um_lugar("c", TERRA_LON + 1.0, TERRA_LAT)
    _, ids = estradas.atrair([
        [TERRA_LON + 1.0, TERRA_LAT], [TERRA_LON + 0.5, TERRA_LAT], [TERRA_LON, TERRA_LAT],
    ])
    assert ids == ["c", "b", "a"], "a ordem é a do traçado, não a do arquivo de lugares"


def test_dois_cliques_no_mesmo_lugar_viram_um_ponto_so(ambiente_isolado):
    _por_um_lugar("a", TERRA_LON, TERRA_LAT)
    d = _graus_para_km(1.0)
    pontos, ids = estradas.atrair([
        [TERRA_LON - d, TERRA_LAT], [TERRA_LON + d, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT],
    ])
    assert pontos == [[TERRA_LON, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT]]
    assert ids == ["a"]


# --- gravação -----------------------------------------------------------------

def test_criar_estrada_grava_o_tracado_ATRAIDO(ambiente_isolado):
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    quase = TERRA_LON + _graus_para_km(3.0)
    f = estradas.criar_estrada("estrada-0001", {
        "type": "LineString", "coordinates": [[quase, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
    })
    gravado = estradas.carregar()["features"][0]
    assert gravado["geometry"]["coordinates"][0] == [TERRA_LON, TERRA_LAT]
    assert gravado["properties"]["lugares"] == ["vila-do-vau"]
    assert gravado["properties"]["tipo"] == "estrada"
    assert f["properties"]["travado"] is False


def test_via_sem_nenhum_lugar_perto_grava_lista_vazia(ambiente_isolado):
    """Controle do derivado: sem lugar no raio, a lista é vazia, e não inventada."""
    estradas.criar_estrada("estrada-0002", {
        "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
    })
    assert estradas.carregar()["features"][0]["properties"]["lugares"] == []


def test_trilha_tambem_vale(ambiente_isolado):
    estradas.criar_estrada("trilha-0001", {
        "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
    }, tipo="trilha")
    assert estradas.carregar()["features"][0]["properties"]["tipo"] == "trilha"


# --- controles negativos ------------------------------------------------------

def test_tipo_inventado_e_recusado(ambiente_isolado):
    with pytest.raises(ValueError, match="tipo"):
        estradas.criar_estrada("estrada-0003", {
            "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
        }, tipo="ferrovia")
    assert estradas.carregar()["features"] == []


def test_trecho_sobre_a_agua_e_recusado(ambiente_isolado):
    """Mesma amostragem por segmento do rio: os dois extremos em terra não bastam."""
    outro_lado = None
    passo = 0.02
    for i in range(1, 4000):
        c = TERRA_LON + i * passo
        if not lugares.ponto_em_terra(c, TERRA_LAT):
            for j in range(1, 4000):
                d = c + j * passo
                if lugares.ponto_em_terra(d, TERRA_LAT):
                    outro_lado = d
                    break
            break
    if outro_lado is None:
        pytest.skip("não achei terra do outro lado da água nesta latitude")
    with pytest.raises(ValueError, match="água"):
        estradas.criar_estrada("estrada-0004", {
            "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [outro_lado, TERRA_LAT]],
        })
    assert estradas.carregar()["features"] == []


def test_um_ponto_so_nao_e_via(ambiente_isolado):
    with pytest.raises(ValueError, match="dois pontos"):
        estradas.criar_estrada("estrada-0005", {
            "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT]],
        })


def test_via_que_some_na_atracao_e_recusada(ambiente_isolado):
    """Os dois pontos dentro do raio do MESMO lugar: depois de fundir sobra um só, e
    uma via de um ponto não é via. Recusa, e nada gravado."""
    _por_um_lugar("a", TERRA_LON, TERRA_LAT)
    d = _graus_para_km(1.0)
    with pytest.raises(ValueError, match="atração"):
        estradas.criar_estrada("estrada-0006", {
            "type": "LineString", "coordinates": [[TERRA_LON - d, TERRA_LAT], [TERRA_LON + d, TERRA_LAT]],
        })
    assert estradas.carregar()["features"] == []


def test_id_repetido_e_recusado(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]]}
    estradas.criar_estrada("estrada-0007", linha)
    with pytest.raises(ValueError, match="já existe"):
        estradas.criar_estrada("estrada-0007", linha)
    assert len(estradas.carregar()["features"]) == 1


# --- trava e desfazer ---------------------------------------------------------

def test_via_travada_nao_se_apaga(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]]}
    estradas.criar_estrada("estrada-0008", linha)
    estradas.definir_trava("estrada-0008", True)
    with pytest.raises(travas.Travado):
        estradas.apagar_estrada("estrada-0008")
    assert len(estradas.carregar()["features"]) == 1


def test_camada_travada_nao_escreve_no_objeto(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]]}
    estradas.criar_estrada("estrada-0009", linha)
    antes = json.dumps(estradas.carregar(), sort_keys=True)
    travas.definir_trava_camada("estradas", True)
    with pytest.raises(travas.Travado):
        estradas.criar_estrada("estrada-0010", linha)
    assert json.dumps(estradas.carregar(), sort_keys=True) == antes


def test_criar_e_apagar_passam_pelo_desfazer(ambiente_isolado):
    linha = {"type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]]}
    estradas.criar_estrada("estrada-0011", linha)
    estradas.apagar_estrada("estrada-0011")
    assert estradas.carregar()["features"] == []
    operacoes.desfazer()
    assert len(estradas.carregar()["features"]) == 1
    operacoes.desfazer()
    assert estradas.carregar()["features"] == []
    operacoes.refazer()
    assert len(estradas.carregar()["features"]) == 1


# --- o relatório da atração (a tela mostra quando a atração agiu) -------------

def test_relatorio_diz_quem_grudou_em_que_e_a_quantos_km(ambiente_isolado):
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    quase = TERRA_LON + _graus_para_km(3.0)
    _, ids, relatorio = estradas.atrair_detalhado([[quase, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT]])
    assert ids == ["vila-do-vau"]
    assert len(relatorio) == 1
    r = relatorio[0]
    assert r["indice"] == 0 and r["lugar"] == "vila-do-vau" and r["fundido"] is False
    assert r["de"] == [quase, TERRA_LAT] and r["para"] == [TERRA_LON, TERRA_LAT]
    # `_graus_para_km` mede no equador; a 17,8° de latitude o mesmo grau de longitude
    # vale menos (cos da latitude), então o esperado sai da mesma fórmula da atração.
    assert r["km"] == pytest.approx(geo.haversine_km(TERRA_LAT, quase, TERRA_LAT, TERRA_LON), abs=0.001)
    assert r["km"] < 5.0


def test_relatorio_vazio_quando_nada_grudou(ambiente_isolado):
    """CONTROLE NEGATIVO do relatório: ponto fora do raio não pode aparecer, senão a
    tela anunciaria uma atração que não aconteceu."""
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    longe = TERRA_LON + _graus_para_km(6.0)
    _, _, relatorio = estradas.atrair_detalhado([[longe, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT]])
    assert relatorio == []


def test_relatorio_marca_o_ponto_fundido(ambiente_isolado):
    _por_um_lugar("a", TERRA_LON, TERRA_LAT)
    d = _graus_para_km(1.0)
    _, _, relatorio = estradas.atrair_detalhado([
        [TERRA_LON - d, TERRA_LAT], [TERRA_LON + d, TERRA_LAT], [TERRA_LON + 1.0, TERRA_LAT],
    ])
    assert [(r["indice"], r["fundido"]) for r in relatorio] == [(0, False), (1, True)]


def test_relatorio_nao_e_gravado(ambiente_isolado):
    """O relatório volta na resposta e some: no disco ficam só o traçado e `lugares`."""
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    quase = TERRA_LON + _graus_para_km(3.0)
    _, relatorio = estradas.criar_estrada_relatando("estrada-0020", {
        "type": "LineString", "coordinates": [[quase, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
    })
    assert relatorio
    texto = estradas.CAMINHO_DADOS.read_text(encoding="utf-8")
    assert "fundido" not in texto and '"de"' not in texto


# --- a rota (chamada direto: o venv não tem httpx para o TestClient) ----------

def _corpo(resposta):
    return json.loads(resposta.body)


def test_rota_de_criar_devolve_colecao_e_relatorio(ambiente_isolado):
    from backend import main
    _por_um_lugar("vila-do-vau", TERRA_LON, TERRA_LAT)
    quase = TERRA_LON + _graus_para_km(3.0)
    corpo = _corpo(main.criar_estrada(main.NovaEstrada(
        id="estrada-0030",
        geometria={"type": "LineString", "coordinates": [[quase, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]]},
    )))
    assert set(corpo) == {"estradas", "atracao"}
    assert corpo["estradas"]["features"][0]["properties"]["lugares"] == ["vila-do-vau"]
    assert corpo["atracao"][0]["lugar"] == "vila-do-vau"


def test_rotas_de_apagar_e_travar_devolvem_a_colecao_pura(ambiente_isolado):
    """O recarregar depois do desfazer espera a coleção; só a criação muda de forma."""
    from backend import main
    estradas.criar_estrada("estrada-0031", {
        "type": "LineString", "coordinates": [[TERRA_LON, TERRA_LAT], [TERRA_LON + 0.3, TERRA_LAT]],
    })
    corpo = _corpo(main.travar_estrada("estrada-0031", main.MudancaTrava(travado=True)))
    assert corpo["type"] == "FeatureCollection"
    corpo = _corpo(main.travar_estrada("estrada-0031", main.MudancaTrava(travado=False)))
    corpo = _corpo(main.apagar_estrada("estrada-0031"))
    assert corpo["type"] == "FeatureCollection" and corpo["features"] == []


def test_rota_recusa_estrada_na_agua_com_422_e_nao_grava(ambiente_isolado):
    from fastapi import HTTPException
    from backend import main
    with pytest.raises(HTTPException) as erro:
        main.criar_estrada(main.NovaEstrada(
            id="estrada-0032",
            geometria={"type": "LineString", "coordinates": [[-60.0, 0.0], [-59.0, 0.0]]},
        ))
    assert erro.value.status_code == 422
    assert estradas.carregar()["features"] == []


def test_a_pagina_nao_deixa_nenhum_espaco_reservado_sem_trocar():
    """Um `/*__X__*/` que sobra vira erro de sintaxe e derruba o bloco de script
    inteiro da página (todas as constantes iniciais somem juntas). Lê os dados reais,
    sem gravar nada."""
    from backend import main
    html = main.pagina_inicial()
    assert "/*__" not in html
    assert "const ESTRADAS_INICIAL = {" in html


def test_controle_negativo_espaco_reservado_orfao_seria_pego(tmp_path, monkeypatch):
    """Prova que a conferência de cima enxerga a sobra: o mesmo template com um espaço
    reservado que ninguém troca TEM que deixar `/*__` na página."""
    from backend import main
    original = (main.TEMPLATES_DIR / "index.html").read_text(encoding="utf-8")
    (tmp_path / "index.html").write_text(original + "/*__NINGUEM_TROCA__*/", encoding="utf-8")
    monkeypatch.setattr(main, "TEMPLATES_DIR", tmp_path)
    assert "/*__" in main.pagina_inicial()


# --- via desalinhada: ajustar o traçado até o lugar (rodada das pendências, item e) ---

def _mover_lugar(id_lugar, lon, lat):
    doc = lugares.carregar()
    for f in doc["features"]:
        if f["properties"]["id"] == id_lugar:
            f["geometry"]["coordinates"] = [lon, lat]
    lugares.CAMINHO_LUGARES.write_text(json.dumps(doc), encoding="utf-8")


def _via_a_b():
    _por_um_lugar("a", TERRA_LON, TERRA_LAT)
    _por_um_lugar("b", TERRA_LON + 0.5, TERRA_LAT)
    linha = {"type": "LineString", "coordinates": [
        [TERRA_LON, TERRA_LAT], [TERRA_LON + 0.25, TERRA_LAT], [TERRA_LON + 0.5, TERRA_LAT]]}
    via = estradas.criar_estrada("via-ab", linha)
    assert via["properties"]["lugares"] == ["a", "b"]
    return via


def test_ajustar_move_so_o_vertice_do_lugar_movido(ambiente_isolado):
    _via_a_b()
    novo = [TERRA_LON + 0.5, TERRA_LAT + 0.05]
    assert lugares.ponto_em_terra(*novo)
    _mover_lugar("b", *novo)
    via = estradas._achar(estradas.carregar(), "via-ab")
    assert estradas.desalinhados(via) == ["b"]
    antes = estradas.CAMINHO_DADOS.read_bytes()
    depois, rel = estradas.ajustar_ate_lugar("via-ab", "b")
    assert rel["vertice"] == 2 and rel["para"] == novo and 5 < rel["km"] < 8
    assert depois["geometry"]["coordinates"] == [
        [TERRA_LON, TERRA_LAT], [TERRA_LON + 0.25, TERRA_LAT], novo]
    assert estradas.desalinhados(depois) == []
    # Passa pelo desfazer: volta byte a byte.
    operacoes.desfazer()
    assert estradas.CAMINHO_DADOS.read_bytes() == antes


def test_ajustar_ate_o_mar_e_recusado_sem_gravar(ambiente_isolado):
    """Controle negativo: o lugar foi parar no mar (dado de teste, escrito direto);
    o trecho novo cruzaria água, e nada é gravado."""
    _via_a_b()
    _mover_lugar("b", -37.052, 23.832)
    antes = estradas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(ValueError, match="água"):
        estradas.ajustar_ate_lugar("via-ab", "b")
    assert estradas.CAMINHO_DADOS.read_bytes() == antes


def test_ajustar_via_alinhada_ou_lugar_apagado_e_recusado(ambiente_isolado):
    _via_a_b()
    antes = estradas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(ValueError, match="não está desalinhada"):
        estradas.ajustar_ate_lugar("via-ab", "b")
    with pytest.raises(ValueError, match="não passa"):
        estradas.ajustar_ate_lugar("via-ab", "outro")
    doc = lugares.carregar()
    doc["features"] = [f for f in doc["features"] if f["properties"]["id"] != "b"]
    lugares.CAMINHO_LUGARES.write_text(json.dumps(doc), encoding="utf-8")
    with pytest.raises(ValueError, match="não existe mais"):
        estradas.ajustar_ate_lugar("via-ab", "b")
    assert estradas.CAMINHO_DADOS.read_bytes() == antes


def test_ajustar_via_travada_e_recusado(ambiente_isolado):
    _via_a_b()
    _mover_lugar("b", TERRA_LON + 0.5, TERRA_LAT + 0.05)
    estradas.definir_trava("via-ab", True)
    antes = estradas.CAMINHO_DADOS.read_bytes()
    with pytest.raises(travas.Travado):
        estradas.ajustar_ate_lugar("via-ab", "b")
    assert estradas.CAMINHO_DADOS.read_bytes() == antes
