"""Recorte da biblioteca de símbolos (noite 2, 2026-09-23).

Duas metades: o recorte das folhas REAIS (uma vez por sessão de teste, numa pasta
temporária, sem tocar `simbolos/` nem `dados/simbolos.json`), e folhas SINTÉTICAS que
existem para falhar: folha em branco, folha só de sujeira, peça na borda, duas peças
grudadas. Uma conferência que nunca reprova nada é conferência quebrada.
"""

import numpy as np
import pytest
from PIL import Image, ImageDraw

from cartografia import recorte

FUNDO = 253


@pytest.fixture(scope="module")
def recorte_real(tmp_path_factory):
    pasta = tmp_path_factory.mktemp("simbolos")
    manifesto = recorte.recortar_tudo(pasta_saida=pasta / "simbolos",
                                      caminho_manifesto=pasta / "simbolos.json")
    return pasta, manifesto


# --- as folhas reais ----------------------------------------------------------

def test_cada_folha_da_o_numero_esperado_de_pecas(recorte_real):
    _, m = recorte_real
    esperado = {nome: 12 for nome in recorte.FOLHAS_EM_GRADE}
    esperado[recorte.FOLHA_CARTOGRAFIA] = 6
    assert m["pecas_por_folha"] == esperado
    assert len(m["simbolos"]) == 90


def test_nenhuma_peca_encosta_na_borda_da_folha(recorte_real):
    _, m = recorte_real
    for s in m["simbolos"]:
        x0, y0, x1, y1 = s["caixa_na_folha"]
        assert x0 > 0 and y0 > 0 and x1 < 1254 and y1 < 1254, s["id"]


def test_manifesto_bate_com_os_arquivos(recorte_real):
    pasta, m = recorte_real
    for s in m["simbolos"]:
        assert s["arquivo"] == s["arquivos"][s["modo_padrao"]]
        for modo, rel in s["arquivos"].items():
            caminho = pasta / "simbolos" / rel.removeprefix("simbolos/")
            with Image.open(caminho) as im:
                assert im.mode == "RGBA"
                assert (im.width, im.height) == (s["largura"], s["altura"]), (s["id"], modo)
        assert 0 <= s["ancora"]["x"] < s["largura"] and 0 <= s["ancora"]["y"] < s["altura"]
        # a âncora é de BASE: na metade de baixo da peça
        assert s["ancora"]["y"] > s["altura"] / 2, s["id"]


def test_modos_padrao_pedidos(recorte_real):
    _, m = recorte_real
    padroes = {s["tipo"]: s["modo_padrao"] for s in m["simbolos"]}
    assert padroes["montanha-nevada"] == "branco-opaco"
    assert padroes["geleira"] == "branco-opaco"
    assert padroes["tundra"] == "branco-opaco"          # decisão de 2026-09-23
    for tipo in ("montanha", "colina", "arvore-folhosa", "selva", "pantano", "duna",
                 "rochedo", "cidade", "ruina", "marco", "rosa-dos-ventos",
                 "palmeira", "arvore-tropical"):
        assert padroes[tipo] == "so-traco", tipo


def test_nenhum_simbolo_real_e_vazio(recorte_real):
    """Todo PNG recortado tem tinta de verdade (e não só a margem)."""
    pasta, m = recorte_real
    for s in m["simbolos"]:
        with Image.open(pasta / "simbolos" / s["arquivos"]["so-traco"].removeprefix("simbolos/")) as im:
            alfa = np.asarray(im)[..., 3]
        assert (alfa > 128).sum() > 1000, s["id"]


# --- folhas sintéticas, que existem para falhar -------------------------------

def _folha(desenhar) -> np.ndarray:
    im = Image.new("L", (1254, 1254), FUNDO)
    desenhar(ImageDraw.Draw(im))
    return np.asarray(im)


def _doze_pecas(d, exceto=None):
    for lin in range(3):
        for col in range(4):
            if (lin, col) == exceto:
                continue
            cx, cy = int((col + 0.5) * 1254 / 4), int((lin + 0.5) * 1254 / 3)
            d.ellipse([cx - 80, cy - 60, cx + 80, cy + 60], fill=40)


def test_folha_sintetica_certa_passa():
    """O controle positivo das sintéticas: sem ele, as recusas abaixo poderiam ser o
    recorte recusando tudo."""
    pecas = recorte.pecas_da_folha("folha-colinas.png", _folha(_doze_pecas))
    assert len(pecas) == 12


def test_folha_em_branco_nao_vira_simbolo():
    with pytest.raises(recorte.ErroDeRecorte, match="vazia"):
        recorte.pecas_da_folha("folha-colinas.png", _folha(lambda d: None))


def test_celula_vazia_e_recusada():
    with pytest.raises(recorte.ErroDeRecorte, match="vazia"):
        recorte.pecas_da_folha("folha-colinas.png", _folha(lambda d: _doze_pecas(d, exceto=(1, 2))))


def test_celula_so_com_sujeira_nao_vira_simbolo():
    """Uma peça sabidamente vazia (só pontinhos de sujeira) não pode virar símbolo."""
    def desenhar(d):
        _doze_pecas(d, exceto=(2, 3))
        cx, cy = int(3.5 * 1254 / 4), int(2.5 * 1254 / 3)
        for i in range(6):
            d.rectangle([cx + i * 20, cy, cx + i * 20 + 5, cy + 5], fill=40)
    with pytest.raises(recorte.ErroDeRecorte, match="sujeira|vazia"):
        recorte.pecas_da_folha("folha-colinas.png", _folha(desenhar))


def test_peca_na_borda_e_recusada():
    def desenhar(d):
        _doze_pecas(d, exceto=(0, 0))
        d.ellipse([-20, 100, 150, 250], fill=40)
    with pytest.raises(recorte.ErroDeRecorte, match="borda"):
        recorte.pecas_da_folha("folha-colinas.png", _folha(desenhar))


def test_duas_pecas_grudadas_sao_recusadas():
    def desenhar(d):
        _doze_pecas(d)
        y = int(0.5 * 1254 / 3)
        d.rectangle([150, y - 10, 480, y + 10], fill=40)  # ponte entre (0,0) e (0,1)
    with pytest.raises(recorte.ErroDeRecorte, match="atravessa"):
        recorte.pecas_da_folha("folha-colinas.png", _folha(desenhar))


# --- os dois modos e a âncora -------------------------------------------------

def _anel():
    lum = _folha(lambda d: None).copy()
    im = Image.fromarray(lum)
    ImageDraw.Draw(im).ellipse([500, 500, 700, 700], outline=20, width=8)
    lum = np.asarray(im)
    rgb = np.stack([lum] * 3, axis=-1)
    peca = {"caixa": (495, 495, 705, 705), "mascara": np.ones_like(lum, dtype=bool)}
    return rgb, lum, peca


def test_so_traco_deixa_o_miolo_transparente_e_branco_opaco_nao():
    """O mesmo pixel branco do miolo de um anel: transparente num modo, opaco no outro.
    Cada modo é o controle negativo do outro."""
    rgb, lum, peca = _anel()
    modos = recorte.gerar_modos(rgb, lum, peca)
    x0, y0 = peca["caixa_com_margem"][:2]
    miolo = (600 - y0, 600 - x0)
    assert np.asarray(modos["so-traco"])[miolo][3] == 0
    assert np.asarray(modos["branco-opaco"])[miolo][3] == 255
    assert tuple(np.asarray(modos["branco-opaco"])[miolo][:3]) == (FUNDO,) * 3
    # fora do anel, os dois são transparentes
    fora = (1, 1)
    assert np.asarray(modos["so-traco"])[fora][3] == 0
    assert np.asarray(modos["branco-opaco"])[fora][3] == 0


def test_ancora_de_arvore_fica_no_pe_do_tronco():
    """Copa larga em cima e tronco fino até embaixo: a base é o pé do tronco. Uma
    regra por largura de linha pararia na base da copa."""
    alfa = np.zeros((300, 200), dtype=np.uint8)
    alfa[20:160, 10:190] = 255   # copa
    alfa[160:290, 95:105] = 255  # tronco
    assert recorte.ancora_na_base(alfa)["y"] >= 280


def test_ancora_ignora_pedrinha_solta_embaixo():
    alfa = np.zeros((300, 200), dtype=np.uint8)
    alfa[50:250, 20:180] = 255   # a peça
    alfa[290:293, 100:103] = 255  # uma pedrinha solta
    assert 240 <= recorte.ancora_na_base(alfa)["y"] <= 250



# --- espelhamento medido pela luz (2026-09-23, rodada da manhã) ------------------

def _medidas_por_tipo(pasta, manifesto):
    por_tipo = {}
    for s in manifesto["simbolos"]:
        with Image.open(pasta / s["arquivos"]["branco-opaco"]) as im:
            rgba = np.asarray(im.convert("RGBA"))
        por_tipo.setdefault(s["tipo"], []).append(recorte.assimetria_de_luz(rgba))
    return por_tipo


def test_so_espelha_o_tipo_que_a_luz_nao_denuncia(recorte_real):
    pasta, m = recorte_real
    for tipo, medidas in _medidas_por_tipo(pasta, m).items():
        if recorte.ESPELHAVEL[tipo]:
            assert max(medidas) < recorte.LIMIAR_ASSIMETRIA, (tipo, medidas)


def test_a_regra_antiga_espelhava_arvore_sombreada(recorte_real):
    """Controle negativo: a tabela da noite 2 (toda vegetação espelhava) reprova na
    mesma medida. Se a medida não pegasse a folhosa, o teste de cima seria vazio."""
    pasta, m = recorte_real
    medidas = _medidas_por_tipo(pasta, m)
    assert max(medidas["arvore-folhosa"]) > recorte.LIMIAR_ASSIMETRIA
    assert max(medidas["arvore-conifera"]) > recorte.LIMIAR_ASSIMETRIA


def test_assimetria_ve_a_sombra_e_o_espelho_a_inverte():
    rgba = np.zeros((40, 40, 4), dtype=np.uint8)
    rgba[..., 3] = 255
    rgba[..., :3] = 230
    rgba[:, 20:, :3] = 90                     # metade direita hachurada
    assert recorte.assimetria_de_luz(rgba) > 2
    assert recorte.assimetria_de_luz(rgba[:, ::-1]) < 0.5
