"""Tiras de redução (noite 2): o tamanho que a tira promete é o tamanho desenhado."""

import json

import pytest
from PIL import Image

from cartografia import reducao


def _simbolo(tmp_path, nome, w, h):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    im.paste((0, 0, 0, 255), (w // 4, h // 4, 3 * w // 4, h))
    caminho = tmp_path / nome
    im.save(caminho)
    return {"id": nome, "tipo": "teste", "arquivo": nome}


@pytest.mark.parametrize("w,h", [(300, 120), (90, 400)])
def test_reduzir_poe_o_maior_lado_no_tamanho_pedido(w, h):
    im = Image.new("RGBA", (w, h))
    for t in reducao.TAMANHOS:
        r = reducao.reduzir(im, t)
        assert max(r.width, r.height) == t
        # proporção mantida (a menos de um pixel de arredondamento)
        assert abs(r.width / r.height - w / h) < 0.05 * (w / h) + 1 / min(r.width, r.height)


def test_tira_tem_uma_linha_por_simbolo(tmp_path):
    simbolos = [_simbolo(tmp_path, "a.png", 300, 200), _simbolo(tmp_path, "b.png", 100, 300)]
    tira = reducao.tira_do_tipo("teste", simbolos, raiz_mapas=tmp_path)
    tira_um = reducao.tira_do_tipo("teste", simbolos[:1], raiz_mapas=tmp_path)
    assert tira.height - tira_um.height == reducao.TAMANHOS[0] + 10


def test_simbolo_que_nao_existe_falha_alto(tmp_path):
    """Controle negativo: um manifesto apontando para arquivo ausente não pode virar
    tira em branco calada."""
    with pytest.raises(FileNotFoundError):
        reducao.tira_do_tipo("teste", [{"id": "x", "tipo": "teste", "arquivo": "sumiu.png"}],
                             raiz_mapas=tmp_path)


def test_gerar_tiras_faz_uma_por_tipo(tmp_path):
    simbolos = [_simbolo(tmp_path, "a.png", 300, 200), _simbolo(tmp_path, "b.png", 100, 300)]
    simbolos[1]["tipo"] = "outro"
    manifesto = tmp_path / "m.json"
    manifesto.write_text(json.dumps({"simbolos": simbolos}), encoding="utf-8")
    saidas = reducao.gerar_tiras(manifesto, tmp_path / "saida", raiz_mapas=tmp_path)
    assert sorted(p.name for p in saidas) == ["reducao-outro.png", "reducao-teste.png"]
