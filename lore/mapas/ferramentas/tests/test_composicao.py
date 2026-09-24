"""Composição (Parte B, 2026-09-23 noite), contra a costa de verdade e os dados de
verdade (só leitura), numa resolução baixa para ser rápido. O teste principal é o da
COSTURA: o mesmo recorte em um bloco e em vários blocos tem de sair igual byte a
byte; e o controle negativo tira a folga dos blocos e exige que a costura apareça."""

import numpy as np
import pytest

from cartografia import composicao as C
from cartografia import renderizador

PPG = C.PPG_OFICIAL / 8


@pytest.fixture(scope="module")
def base():
    dados = C.carregar_dados()
    return dados, C.Costa(), renderizador.Biblioteca.carregar(C.RAIZ_MAPAS / "dados" / "simbolos.json")


def _mere(**kw):
    return C.Pedido(9.0, 25.0, 30.0, 41.5, PPG, **kw)


def test_blocos_sem_costura(base):
    dados, costa, bib = base
    inteiro, _ = C.compor(_mere(altura_bloco=100000), dados, costa, bib)
    em_blocos, rel = C.compor(_mere(altura_bloco=37), dados, costa, bib)
    assert rel["blocos"] > 3
    assert inteiro.tobytes() == em_blocos.tobytes()


def test_sem_folga_a_costura_aparece(base, monkeypatch):
    """Controle negativo: sem a folga, o símbolo do bloco vizinho e o borrão da cor
    param na borda do bloco, e a imagem muda."""
    dados, costa, bib = base
    inteiro, _ = C.compor(_mere(altura_bloco=100000), dados, costa, bib)
    original = C.planejar

    def sem_folga(*a, **k):
        p = original(*a, **k)
        p.folga_px = 0
        return p

    monkeypatch.setattr(C, "planejar", sem_folga)
    em_blocos, _ = C.compor(_mere(altura_bloco=37), dados, costa, bib)
    assert inteiro.tobytes() != em_blocos.tobytes()


def test_recorte_bate_com_o_pedaco_do_recorte_maior(base):
    """O plano por área faz o recorte pequeno sair igual ao mesmo pedaço do grande."""
    dados, costa, bib = base
    grande, _ = C.compor(C.Pedido(5.0, 20.0, 30.0, 42.0, PPG), dados, costa, bib)
    pequeno, _ = C.compor(C.Pedido(15.0, 30.0, 25.0, 40.0, PPG), dados, costa, bib)
    jg = C.alinhar(5.0, 20.0, 30.0, 42.0, PPG)
    jp = C.alinhar(15.0, 30.0, 25.0, 40.0, PPG)
    (gx, gy), (px, py) = C.origem(jg), C.origem(jp)
    corte = grande.crop((px - gx, py - gy, px - gx + jp.largura, py - gy + jp.altura))
    a, b = np.asarray(corte).astype(int), np.asarray(pequeno).astype(int)
    # A grade de lat/lon muda de passo com o tamanho do recorte; o resto é igual.
    sem_grade = C.Pedido(5.0, 20.0, 30.0, 42.0, PPG, camadas=frozenset(set(C.CAMADAS) - {"grade"}))
    grande2, _ = C.compor(sem_grade, dados, costa, bib)
    pequeno2, _ = C.compor(C.Pedido(15.0, 30.0, 25.0, 40.0, PPG, camadas=sem_grade.camadas), dados, costa, bib)
    corte2 = grande2.crop((px - gx, py - gy, px - gx + jp.largura, py - gy + jp.altura))
    assert corte2.tobytes() == pequeno2.tobytes()


def test_alinhar_na_grade_global():
    j = C.alinhar(10.003, 20.001, 12.0, 21.0, PPG)
    x, y = C.origem(j)
    assert abs((j.oeste - C.LON0) * PPG - x) < 1e-6 and abs((C.LAT0 - j.norte) * PPG - y) < 1e-6
    assert j.oeste <= 10.003 and j.leste >= 12.0 and j.sul <= 20.001 and j.norte >= 21.0


def test_versao_do_jogador_tira_o_oculto(base):
    dados = dict(base[0])
    dados["lugares"] = [
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": [1, 1]},
         "properties": {"id": "a", "tipo": "cidade", "nome": "Aberta"}},
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": [2, 2]},
         "properties": {"id": "b", "tipo": "cidade", "nome": "Secreta", "visivel_jogador": False}}]
    dados["nomes"] = [{"alvo": {"tipo": "lugar", "id": "a"}, "texto": "Aberta", "nivel": 2},
                      {"alvo": {"tipo": "lugar", "id": "b"}, "texto": "Secreta", "nivel": 2}]
    j = C.para_jogador(dados)
    assert [f["properties"]["id"] for f in j["lugares"]] == ["a"]
    assert [n["texto"] for n in j["nomes"]] == ["Aberta"]
    # Controle: o mestre continua vendo as duas.
    assert len(dados["lugares"]) == 2


def test_intervalos_periodicos():
    assert list(C.intervalos_periodicos(0, 25, 10, 0, 4)) == [(0, 4), (10, 14), (20, 24)]
    assert list(C.intervalos_periodicos(12, 23, 10, 0, 4)) == [(12, 14), (20, 23)]


def test_tracejado_nao_trava_com_numero_grande():
    """O caso que travou a primeira versão (somar passos menores que a precisão do
    número): um segmento que começa muito longe na linha. Tem de terminar e dar os
    pedaços certos."""
    s0 = 1e12
    pedacos = list(C.intervalos_periodicos(s0, s0 + 30, 10, 0, 4))
    assert 2 <= len(pedacos) <= 4
