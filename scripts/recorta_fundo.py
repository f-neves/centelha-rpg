# Recorta o fundo liso de uma foto de museu e devolve um PNG com transparência.
#
# As peças do acervo aberto do Metropolitan são fotografadas sobre fundo neutro
# uniforme (cinza claro, cinza médio ou preto). Isso deixa o recorte por
# semelhança de cor viável: marco como fundo tudo que (a) parece com a cor das
# bordas e (b) está ligado à borda por um caminho contínuo. A segunda condição é
# o que impede de furar a peça (uma parte cinza no meio do escudo não vira buraco).
#
#   python scripts/recorta_fundo.py entrada.jpg saida.png [--lado 640]
#
# Sai um relatório JSON numa linha: se o recorte não passar nos testes de
# qualidade, o campo "ok" vem falso e quem chamou cai para o ícone.

import sys, json, argparse
import numpy as np
from PIL import Image, ImageFilter

# tolerância de cor: distância máxima até a cor do fundo para o pixel ser fundo.
# 34 segura o cinza de estúdio sem comer o aço claro da peça.
TOL = 34
# quanto o pixel precisa se afastar do fundo para ficar 100% opaco. A faixa entre
# TOL e TOL_DURO vira alfa parcial, o que dá a borda suave (sem serrilhado).
TOL_DURO = 62
# A sombra que a peça projeta no fundo foge da tolerância de cor e sobra como um
# halo cinza em volta do recorte. Ela é pega numa segunda passada, bem mais
# tolerante, que só pode andar por onde a imagem é lisa: sombra tem transição
# suave, contorno de peça tem degrau. O gradiente é a cerca.
TOL_SOMBRA = 110
GRAD_CERCA = 18


def recorta(caminho_entrada, caminho_saida, lado_max=640):
    im = Image.open(caminho_entrada).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    h, w = a.shape[:2]

    # cor do fundo = mediana da moldura de 2px. Mediana e não média: se a peça
    # encostar na borda, ela não puxa a estimativa.
    moldura = np.concatenate([
        a[:2].reshape(-1, 3), a[-2:].reshape(-1, 3),
        a[:, :2].reshape(-1, 3), a[:, -2:].reshape(-1, 3),
    ])
    fundo = np.median(moldura, axis=0)

    dist = np.sqrt(((a - fundo) ** 2).sum(axis=2))
    parecido = dist < TOL

    # propaga a partir da borda: só é fundo o que está ligado à moldura.
    semente = np.zeros((h, w), dtype=bool)
    semente[0, :] = semente[-1, :] = True
    semente[:, 0] = semente[:, -1] = True
    marcado = semente & parecido

    def espalha(inicial, permitido):
        """Cresce a mancha pelos 4 vizinhos, sem sair do que é permitido."""
        m = inicial & permitido
        for _ in range(4000):
            anterior = m.sum()
            d = m.copy()
            d[1:, :] |= m[:-1, :]
            d[:-1, :] |= m[1:, :]
            d[:, 1:] |= m[:, :-1]
            d[:, :-1] |= m[:, 1:]
            m = d & permitido
            if m.sum() == anterior:
                break
        return m

    marcado = espalha(semente, parecido)

    # segunda passada: come a sombra projetada. Anda com tolerância larga, mas o
    # gradiente forte do contorno da peça funciona de cerca.
    cinza = np.asarray(im.convert("L")).astype(np.float32)
    gy = np.zeros_like(cinza); gx = np.zeros_like(cinza)
    gy[1:-1, :] = cinza[2:, :] - cinza[:-2, :]
    gx[:, 1:-1] = cinza[:, 2:] - cinza[:, :-2]
    grad = np.sqrt(gx ** 2 + gy ** 2)
    liso = grad < GRAD_CERCA
    sombra = espalha(marcado, (dist < TOL_SOMBRA) & (liso | marcado))
    marcado = marcado | sombra

    # alfa: 0 no fundo ligado à borda, rampa suave na zona duvidosa, 255 na peça.
    alfa = np.full((h, w), 255, dtype=np.float32)
    rampa = np.clip((dist - TOL) / (TOL_DURO - TOL), 0, 1) * 255
    alfa[marcado] = 0
    # os vizinhos do fundo ganham a rampa, para o contorno não sair recortado a faca
    borda_fundo = np.zeros((h, w), dtype=bool)
    borda_fundo[1:, :] |= marcado[:-1, :]
    borda_fundo[:-1, :] |= marcado[1:, :]
    borda_fundo[:, 1:] |= marcado[:, :-1]
    borda_fundo[:, :-1] |= marcado[:, 1:]
    zona = borda_fundo & ~marcado
    alfa[zona] = rampa[zona]

    rgba = np.dstack([np.asarray(im), alfa.astype(np.uint8)])
    saida = Image.fromarray(rgba, "RGBA")
    saida = saida.filter(ImageFilter.SMOOTH)  # suaviza o serrilhado residual

    # corta a sobra de fundo em volta da peça
    caixa = saida.getbbox()
    if caixa:
        saida = saida.crop(caixa)

    if max(saida.size) > lado_max:
        escala = lado_max / max(saida.size)
        novo = (max(1, round(saida.size[0] * escala)), max(1, round(saida.size[1] * escala)))
        saida = saida.resize(novo, Image.LANCZOS)

    # ---- testes de qualidade ----
    af = np.asarray(saida)[:, :, 3]
    transparente = float((af < 16).mean())
    # a moldura da imagem final tem de estar limpa: sobra de fundo ali é recorte falho
    molduraf = np.concatenate([af[0], af[-1], af[:, 0], af[:, -1]])
    borda_limpa = float((molduraf < 16).mean())
    # fundo uniforme? se a moldura original varia muito, a foto tem cenário e o
    # recorte por cor não serve.
    variacao = float(np.sqrt(((moldura - fundo) ** 2).sum(axis=1)).mean())

    # halo: o teste que pega o recorte folgado. Olho só a casquinha de fora do que
    # sobrou opaco. Se essa casca ainda tem a cor do fundo, o que ficou em volta da
    # peça é fundo, não peça — foi o que passou batido na primeira versão daqui.
    opaco = alfa > 128
    dentro = opaco.copy()
    for _ in range(3):
        e = dentro.copy()
        e[1:, :] &= dentro[:-1, :]
        e[:-1, :] &= dentro[1:, :]
        e[:, 1:] &= dentro[:, :-1]
        e[:, :-1] &= dentro[:, 1:]
        dentro = e
    casca = opaco & ~dentro
    halo = float((dist[casca] < TOL * 1.3).mean()) if casca.any() else 1.0

    ok = (
        0.08 <= transparente <= 0.92   # sobrou peça e sumiu fundo
        and borda_limpa >= 0.97        # nenhuma faixa de fundo na moldura
        and variacao <= 26             # o fundo original era mesmo liso
        and halo <= 0.22               # o contorno é peça de verdade, não sobra
    )

    if ok:
        saida.save(caminho_saida)

    return {
        "ok": bool(ok),
        "transparente": round(transparente, 3),
        "borda_limpa": round(borda_limpa, 3),
        "halo": round(halo, 3),
        "variacao_fundo": round(variacao, 1),
        "fundo": [int(v) for v in fundo],
        "tamanho": list(saida.size),
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("saida")
    p.add_argument("--lado", type=int, default=640)
    args = p.parse_args()
    try:
        print(json.dumps(recorta(args.entrada, args.saida, args.lado)))
    except Exception as e:
        print(json.dumps({"ok": False, "erro": str(e)}))
