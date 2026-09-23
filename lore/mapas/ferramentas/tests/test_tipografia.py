"""Tipografia (B1): a espinha de forma alongada, o texto que acompanha a curva e o
reto. Cada um com o caso que tem de falhar."""

import numpy as np
from PIL import Image

from cartografia import tipografia as T


def test_espinha_de_forma_alongada_segue_a_curva():
    rng = np.random.default_rng(1)
    x = rng.uniform(0, 100, 4000)
    y = 0.004 * (x - 50) ** 2 + rng.uniform(-3, 3, 4000)    # banana deitada
    e = T.espinha(np.stack([x, y], 1))
    assert e is not None and len(e) >= 5
    # O meio da espinha fica embaixo das pontas: ela curva como a forma.
    assert e[len(e) // 2, 1] < e[0, 1] and e[len(e) // 2, 1] < e[-1, 1]


def test_forma_redonda_nao_tem_espinha():
    """Controle negativo: "quando fizer sentido" é forma alongada; disco sai reto."""
    rng = np.random.default_rng(2)
    a, r = rng.uniform(0, 2 * np.pi, 4000), np.sqrt(rng.uniform(0, 1, 4000)) * 50
    assert T.espinha(np.stack([r * np.cos(a), r * np.sin(a)], 1)) is None


def _tinta(im):
    return (np.asarray(im)[..., 3] > 0)


def test_texto_na_curva_escreve_ao_longo_da_linha():
    tela = Image.new("RGBA", (600, 300), (0, 0, 0, 0))
    pts = [(50, 250), (200, 120), (400, 120), (550, 250)]
    estilo = T.estilo_do_nome("regiao")
    assert T.texto_na_curva(tela, "Montanhas", pts, 30, estilo)
    ys, xs = np.nonzero(_tinta(tela))
    # Tinta nas duas pontas e mais alta no meio, como a linha.
    esq, meio = ys[xs < 200].mean(), ys[(xs > 250) & (xs < 350)].mean()
    assert meio < esq


def test_linha_curta_demais_nao_escreve():
    tela = Image.new("RGBA", (200, 100), (0, 0, 0, 0))
    assert not T.texto_na_curva(tela, "Um nome muito comprido", [(10, 50), (30, 50)], 30,
                                T.estilo_do_nome("regiao"))
    assert not _tinta(tela).any()


def test_texto_reto_centrado():
    tela = Image.new("RGBA", (400, 100), (0, 0, 0, 0))
    T.texto_reto(tela, "Calin", 200, 50, 30, T.estilo_do_nome("lugar"))
    ys, xs = np.nonzero(_tinta(tela))
    assert abs(xs.mean() - 200) < 15 and abs(ys.mean() - 50) < 10
