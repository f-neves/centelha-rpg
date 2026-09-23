"""Cache de identidade de ilha (etapa 10, 2026-09-23 noite). Máscaras sintéticas
pequenas com resposta conhecida, e a rotulagem comparada com um preenchimento por
inundação ingênuo (a referência óbvia) em máscaras aleatórias. Cada regra com o caso
que tem de falhar: dois pixels que só se tocam na diagonal são duas ilhas
(conectividade 4), e uma ilha a 101 km da principal não entra na regra dos 100 km."""

import json
from collections import deque

import numpy as np
import pytest
from PIL import Image

from backend import coordenadas, ilhas


def _rotular(mascara, faixa=3):
    h, w = mascara.shape
    saida = np.zeros((h, w), dtype=np.uint32)

    def blocos():
        for y0 in range(0, h, faixa):
            yield mascara[y0: y0 + faixa]

    def escrever(y0, bloco):
        saida[y0: y0 + bloco.shape[0]] = bloco

    n, comps = ilhas.rotular(blocos(), h, w, escrever)
    return n, comps, saida


def _inundar(mascara):
    """Referência: BFS de conectividade 4, rótulos na ordem de varredura."""
    h, w = mascara.shape
    rot = np.zeros((h, w), dtype=np.int64)
    n = 0
    for y in range(h):
        for x in range(w):
            if mascara[y, x] and not rot[y, x]:
                n += 1
                fila = deque([(y, x)])
                rot[y, x] = n
                while fila:
                    cy, cx = fila.popleft()
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mascara[ny, nx] and not rot[ny, nx]:
                            rot[ny, nx] = n
                            fila.append((ny, nx))
    return n, rot


def test_duas_ilhas_separadas():
    m = np.zeros((6, 10), dtype=bool)
    m[1:3, 1:4] = True
    m[3:5, 6:9] = True
    n, comps, rot = _rotular(m)
    assert n == 2
    assert comps[1]["area_px"] == 6 and comps[2]["area_px"] == 6
    assert comps[1]["caixa"] == [1, 1, 4, 3] and comps[2]["caixa"] == [6, 3, 9, 5]


def test_diagonal_nao_liga():
    """Controle negativo da conectividade 4."""
    m = np.zeros((4, 4), dtype=bool)
    m[1, 1] = m[2, 2] = True
    assert _rotular(m)[0] == 2


def test_forma_de_u_vira_uma_so_ilha():
    """As duas pernas nascem com rótulos diferentes e só se juntam embaixo: é a
    união-busca que tem de fundir, e numa faixa DIFERENTE da de cima."""
    m = np.zeros((8, 7), dtype=bool)
    m[0:7, 1] = m[0:7, 5] = True
    m[6, 1:6] = True
    n, comps, rot = _rotular(m, faixa=2)
    assert n == 1 and comps[1]["area_px"] == m.sum()
    assert set(np.unique(rot[m])) == {1}


@pytest.mark.parametrize("semente", [1, 2, 3, 4, 5])
def test_igual_ao_preenchimento_por_inundacao(semente):
    rng = np.random.default_rng(semente)
    m = rng.random((40, 55)) < 0.55
    n, _, rot = _rotular(m, faixa=7)
    n_ref, ref = _inundar(m)
    assert n == n_ref
    # Mesma partição E mesma numeração (ordem de varredura).
    assert (rot.astype(np.int64) == ref).all()


def test_mar_fica_zero_e_a_area_soma_a_terra():
    rng = np.random.default_rng(9)
    m = rng.random((30, 30)) < 0.4
    n, comps, rot = _rotular(m)
    assert (rot[~m] == 0).all() and (rot[m] > 0).all()
    assert sum(c["area_px"] for c in comps.values()) == m.sum()


# --- geração no disco e a regra dos 100 km ---------------------------------------
# Mundo sintético de 1200 x 1200 px (1,25 km/px): uma ilha principal, uma ilhota a
# ~60 km dela e outra a ~140 km.

@pytest.fixture
def mundo(tmp_path, monkeypatch):
    m = np.zeros((1200, 1200), dtype=np.uint8)
    m[500:700, 300:500] = 255          # principal, x 300..499
    m[590:610, 548:568] = 255          # ilhota a 48 px = 60 km da principal
    m[590:610, 612:632] = 255          # ilhota a 112 px = 140 km
    Image.fromarray(m, "L").save(tmp_path / "costa.png")
    d = coordenadas.carregar_coordenadas()
    ppg, ref = d["projecao"]["px_por_grau"], d["referencia"]

    def lonlat(x, y):
        return (x - ref["x_meridiano_zero_px"]) / ppg, (ref["y_equador_px"] - y) / ppg

    ilhas.esquecer()
    ilhas.gerar(tmp_path / "costa.png", tmp_path / "cache", principais={"reino": lonlat(400, 600)})
    ilhas._cache["pasta"] = tmp_path / "cache"
    yield lonlat
    ilhas.esquecer()


def test_gerar_grava_e_consulta(mundo):
    assert ilhas.existe()
    assert ilhas.componentes()["n"] == 3
    assert ilhas.componente_em(*mundo(400, 600)) == 1
    assert ilhas.componente_em(*mundo(100, 100)) == 0        # mar


def test_regra_dos_100_km(mundo):
    perto = ilhas.componente_em(*mundo(558, 600))
    longe = ilhas.componente_em(*mundo(622, 600))
    assert ilhas.regioes_a_100km(perto) == ["reino"]
    # Controle negativo: a 140 km não entra.
    assert ilhas.regioes_a_100km(longe) == []
    assert ilhas.regioes_a_100km(ilhas.componente_em(*mundo(400, 600))) == ["reino"]


def test_descrever_sugere_so_com_uma_candidata(mundo, monkeypatch):
    from backend import regioes
    monkeypatch.setattr(regioes, "carregar_massas", lambda: {"features": []})
    d = ilhas.descrever(*mundo(558, 600))
    assert d["regiao_sugerida"] == "reino" and d["terra"] and d["area_km2"] == round(400 * 1.25 * 1.25)
    assert ilhas.descrever(*mundo(622, 600))["regiao_sugerida"] is None
    assert ilhas.descrever(*mundo(100, 100)) == {"componente": 0, "terra": False}


# --- massa nova pelo cache ----------------------------------------------------------

@pytest.fixture
def com_dados(mundo, tmp_path, monkeypatch):
    from backend import historico, operacoes, regioes
    (tmp_path / "dados").mkdir()
    (tmp_path / "dados" / "regioes.json").write_text(json.dumps({"regioes": [
        {"id": "reino", "nome": "Reino", "tipo": "ilha", "pai": None, "geometria": None, "rotulo": None},
        {"id": "outro", "nome": "Outro", "tipo": "ilha", "pai": None, "geometria": None, "rotulo": None}]}),
        encoding="utf-8")
    (tmp_path / "dados" / "massas.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": [
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": list(mundo(400, 600))},
         "properties": {"id": "reino-principal", "regiao": "reino", "status": "atribuida"}}]}), encoding="utf-8")
    monkeypatch.setattr(regioes, "CAMINHO_REGIOES", tmp_path / "dados" / "regioes.json")
    monkeypatch.setattr(regioes, "CAMINHO_MASSAS", tmp_path / "dados" / "massas.geojson")
    monkeypatch.setattr(operacoes, "RAIZ_MAPAS", tmp_path)
    monkeypatch.setattr(operacoes, "PASTA_OPERACOES", tmp_path / ".op")
    monkeypatch.setattr(operacoes, "CAMINHO_LOG", tmp_path / ".op" / "log.jsonl")
    monkeypatch.setattr(operacoes, "CAMINHO_CURSOR", tmp_path / ".op" / "cursor.json")
    monkeypatch.setattr(historico, "PASTA_HISTORICO", tmp_path / ".hist")
    return mundo, tmp_path / "dados" / "massas.geojson"


def test_massa_perto_ganha_a_regiao_pela_regra(com_dados):
    from backend import regioes
    mundo, _ = com_dados
    f = regioes.criar_massa(*mundo(558, 600))
    assert f["properties"]["id"] == "ilha-001" and f["properties"]["regiao"] == "reino"
    assert f["properties"]["status"] == "atribuida" and f["properties"]["area_px_2048"] == 16


def test_massa_longe_fica_sem_regiao(com_dados):
    """Controle negativo da regra: a 140 km, ninguém."""
    from backend import regioes
    mundo, _ = com_dados
    f = regioes.criar_massa(*mundo(622, 600))
    assert f["properties"]["regiao"] is None and f["properties"]["status"] == "sem_regiao"
    # A escolha explícita do usuário vale mesmo longe.
    assert regioes.atribuir_massa(f["properties"]["id"], "outro")["properties"]["regiao"] == "outro"


@pytest.mark.parametrize("ponto,erro", [((100, 100), "mar"), ((400, 600), "já tem massa")])
def test_massa_recusada_nao_grava(com_dados, ponto, erro):
    from backend import regioes
    mundo, caminho = com_dados
    antes = caminho.read_bytes()
    with pytest.raises(ValueError, match=erro):
        regioes.criar_massa(*mundo(*ponto))
    assert caminho.read_bytes() == antes
