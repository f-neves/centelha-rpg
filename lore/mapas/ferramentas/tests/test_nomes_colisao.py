"""Desvio automático de colisão entre nomes (item a da rodada das pendências,
2026-09-23). Conferido em PIXEL, e não só nas caixas do próprio plano: o nome fixo e
o nome de lugar são desenhados em telas separadas, e a tinta de um não pode cair na
do outro. O controle negativo desliga o desvio e exige a sobreposição."""

import numpy as np
import pytest
from PIL import Image

from cartografia import composicao as C

PPG = C.PPG_OFICIAL / 2
LUGAR = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [20.0, 30.0]},
         "properties": {"id": "l1", "tipo": "cidade", "nome": "Vila Teste"}}


def _dados(obstaculo_lon=21.2, obstaculo_lat=30.16, travado=False, posicao=None):
    lugar_nome = {"id": None, "alvo": {"tipo": "lugar", "id": "l1"}, "texto": "Vila Teste", "nivel": 2,
                  "posicao": posicao, "angulo": None, "curva": None, "reto": False, "travado": travado}
    obstaculo = {"id": "nome-9", "alvo": {"tipo": "livre", "id": None}, "texto": "Obstáculo", "nivel": 3,
                 "posicao": {"type": "Point", "coordinates": [obstaculo_lon, obstaculo_lat]},
                 "angulo": None, "curva": None, "reto": False, "travado": False}
    return {"lugares": [LUGAR], "areas": [], "massas": [], "regioes": [], "rios": [], "estradas": [],
            "rotas": [], "elementos": [], "nomes": [lugar_nome, obstaculo]}


def _tinta(dados, so, lados):
    """A tinta (alfa) de UM dos nomes, com o plano calculado com os dois."""
    janela = C.alinhar(18.0, 29.0, 23.0, 31.0, PPG)
    tela = Image.new("RGBA", (janela.largura, janela.altura), (0, 0, 0, 0))
    ctx = C.Contexto(janela, PPG / C.PPG_OFICIAL, None, frozenset(C.CAMADAS))
    C.desenhar_nomes(tela, ctx, [n for n in dados["nomes"] if n["texto"] == so], dados, lados)
    return np.asarray(tela)[..., 3] > 0


def _cruzamento(dados, lados):
    return int((_tinta(dados, "Vila Teste", lados) & _tinta(dados, "Obstáculo", lados)).sum())


def test_nome_de_lugar_sai_de_baixo_do_nome_fixo():
    dados = _dados()
    lados = C.planejar_nomes(dados["nomes"], dados, PPG)
    assert lados[C._chave_do_nome(dados["nomes"][0])] != 0
    assert _cruzamento(dados, lados) == 0


def test_controle_negativo_sem_desvio_a_tinta_se_cruza(monkeypatch):
    dados = _dados()
    monkeypatch.setattr(C, "DESVIO_DE_NOMES", False)
    lados = C.planejar_nomes(dados["nomes"], dados, PPG)
    assert lados == {}
    assert _cruzamento(dados, lados) > 50


def test_sem_colisao_o_lado_de_sempre():
    """Longe do obstáculo, o nome fica à direita, como antes do desvio."""
    dados = _dados(obstaculo_lon=10.0, obstaculo_lat=10.0)
    lados = C.planejar_nomes(dados["nomes"], dados, PPG)
    assert lados[C._chave_do_nome(dados["nomes"][0])] == 0


@pytest.mark.parametrize("campo", ["travado", "posicao"])
def test_nome_travado_ou_posto_a_mao_nao_se_move(campo):
    kw = {"travado": True} if campo == "travado" else {
        "posicao": {"type": "Point", "coordinates": [20.6, 30.16]}}
    dados = _dados(**kw)
    lados = C.planejar_nomes(dados["nomes"], dados, PPG)
    assert C._chave_do_nome(dados["nomes"][0]) not in lados


def test_sem_lado_livre_avisa():
    dados = _dados()
    # Cerca o lugar com obstáculos dos seis lados.
    for i, (lon, lat) in enumerate([(19.2, 30.16), (21.2, 29.84), (19.2, 29.84), (20.0, 30.45),
                                    (20.0, 29.55)]):
        dados["nomes"].append({**dados["nomes"][1], "id": f"nome-x{i}",
                               "posicao": {"type": "Point", "coordinates": [lon, lat]}})
    avisos = []
    C.planejar_nomes(dados["nomes"], dados, PPG, avisos=avisos)
    assert [a["nome"] for a in avisos] == ["Vila Teste"]


def test_o_plano_nao_depende_do_recorte():
    """A armadilha: o obstáculo tem a âncora FORA do recorte pequeno, e o nome de
    lugar desviado cai DENTRO dele. Um plano feito só com os nomes da janela deixaria
    o nome no lado de sempre e o recorte pequeno sairia diferente do pedaço do grande."""
    base = C.carregar_dados()
    dados = {**base, **_dados()}
    camadas = frozenset({"nomes", "cidades"})
    grande = C.Pedido(17.0, 28.5, 23.0, 31.5, PPG, camadas=camadas)
    pequeno = C.Pedido(18.5, 29.5, 20.5, 30.8, PPG, camadas=camadas)
    assert not (pequeno.oeste <= 21.2 <= pequeno.leste)          # âncora do obstáculo fora
    assert C.planejar_nomes(dados["nomes"], dados, PPG)[C._chave_do_nome(dados["nomes"][0])] != 0
    ig, _ = C.compor(grande, dados)
    ip, _ = C.compor(pequeno, dados)
    jg, jp = C.alinhar(grande.oeste, grande.sul, grande.leste, grande.norte, PPG), \
        C.alinhar(pequeno.oeste, pequeno.sul, pequeno.leste, pequeno.norte, PPG)
    (gx, gy), (px, py) = C.origem(jg), C.origem(jp)
    corte = ig.crop((px - gx, py - gy, px - gx + jp.largura, py - gy + jp.altura))
    assert corte.tobytes() == ip.tobytes()


def test_controle_negativo_plano_pela_janela_quebra_o_recorte(monkeypatch):
    """O mesmo par de recortes, com um plano que só olha os nomes cuja âncora cai na
    janela pedida (o erro que o teste acima existe para pegar): o recorte pequeno tem
    de sair diferente do pedaço do grande."""
    base = C.carregar_dados()
    dados = {**base, **_dados()}
    camadas = frozenset({"nomes", "cidades"})
    original = C.planejar_nomes
    caixa = {}

    def pela_janela(nomes, dados, ppg, transformar=None, avisos=None):
        o, s, l, n = caixa["v"]
        dentro = [x for x in nomes if not x.get("posicao")
                  or (o <= x["posicao"]["coordinates"][0] <= l and s <= x["posicao"]["coordinates"][1] <= n)]
        return original(dentro, dados, ppg, transformar, avisos)

    monkeypatch.setattr(C, "planejar_nomes", pela_janela)
    saidas = []
    for p in (C.Pedido(17.0, 28.5, 23.0, 31.5, PPG, camadas=camadas),
              C.Pedido(18.5, 29.5, 20.5, 30.8, PPG, camadas=camadas)):
        caixa["v"] = (p.oeste, p.sul, p.leste, p.norte)
        saidas.append((C.compor(p, dados)[0], C.alinhar(p.oeste, p.sul, p.leste, p.norte, PPG)))
    (ig, jg), (ip, jp) = saidas
    (gx, gy), (px, py) = C.origem(jg), C.origem(jp)
    corte = ig.crop((px - gx, py - gy, px - gx + jp.largura, py - gy + jp.altura))
    assert corte.tobytes() != ip.tobytes()
