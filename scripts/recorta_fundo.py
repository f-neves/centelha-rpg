# Recorta o fundo liso de uma foto de museu e devolve um PNG com transparência.
#
# As peças do acervo aberto do Metropolitan são fotografadas sobre fundo neutro:
# ora uma cor só (cinza claro, cinza médio, preto), ora um degradê de estúdio
# (claro no meio, escuro nos cantos). Isso deixa o recorte por semelhança de cor
# viável: marco como fundo tudo que (a) parece com o fundo estimado e (b) está
# ligado à borda por um caminho contínuo. A segunda condição é o que impede de
# furar a peça (uma parte cinza no meio do escudo não vira buraco).
#
# Não existe um ajuste que sirva a todas as fotos: o degradê salva a armadura
# inteira e estraga a lamelar de franjas; a passada de sombra limpa o halo e come
# manga de couro claro. Por isso aqui se tenta a combinação toda (dois modelos de
# fundo × com e sem sombra) e fica a melhor que passar nos testes.
#
#   python scripts/recorta_fundo.py entrada.jpg saida.png [--lado 640]
#
# Sai um relatório JSON numa linha: se nenhuma combinação passar, "ok" vem falso
# e quem chamou cai para o ícone.

import sys, json, argparse
import numpy as np
from PIL import Image, ImageFilter

# tolerância de cor: distância máxima até o fundo para o pixel ser fundo.
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
# acima disso a peça saiu farelada. Calibrado nos recortes bons do acervo: o pior
# legítimo deu 78 pontos soltos, e a armadura estragada deu 551.
LIMITE_CONFETE = 200


def recorta(caminho_entrada, caminho_saida, lado_max=640):
    im = Image.open(caminho_entrada).convert("RGB")
    original = np.asarray(im)
    a = original.astype(np.int16)
    h, w = a.shape[:2]

    naMoldura = np.zeros((h, w), dtype=bool)
    naMoldura[:2] = naMoldura[-2:] = True
    naMoldura[:, :2] = naMoldura[:, -2:] = True

    semente = np.zeros((h, w), dtype=bool)
    semente[0, :] = semente[-1, :] = True
    semente[:, 0] = semente[:, -1] = True

    # cerca de gradiente, usada pela passada de sombra
    cinza = np.asarray(im.convert("L")).astype(np.float32)
    gy = np.zeros_like(cinza); gx = np.zeros_like(cinza)
    gy[1:-1, :] = cinza[2:, :] - cinza[:-2, :]
    gx[:, 1:-1] = cinza[:, 2:] - cinza[:, :-2]
    liso = np.sqrt(gx ** 2 + gy ** 2) < GRAD_CERCA

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

    # ---- modelo 1: o fundo é uma cor só (mediana da moldura) ----
    plano = np.broadcast_to(np.median(a[naMoldura], axis=0).astype(np.float32), (h, w, 3))

    # ---- modelo 2: o fundo é uma superfície suave (degradê de estúdio) ----
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    xs /= max(w - 1, 1); ys /= max(h - 1, 1)
    base = np.stack([np.ones_like(xs), xs, ys, xs * xs, ys * ys, xs * ys], axis=-1)
    peso = naMoldura.copy()
    coef = None
    # duas rodadas: a segunda descarta a parte da moldura que destoa, que é onde
    # a peça encosta na borda e puxaria o ajuste para a cor errada.
    for _ in range(2):
        coef, *_ = np.linalg.lstsq(base[peso], a[peso].astype(np.float32), rcond=None)
        resto = np.sqrt(((a - base @ coef) ** 2).sum(axis=2))
        novo = naMoldura & (resto <= max(np.percentile(resto[naMoldura], 80), 1.0))
        if novo.sum() < 50:
            break
        peso = novo
    degrade = base @ coef

    def confete(alfa):
        """Quanto a peça virou farelo: pontos opacos soltos no vazio.

        É o teste que pega a passada de sombra comendo a peça quando ela tem
        parte clara (couro claro, aço polido) parecida com o fundo. Sem ele, uma
        armadura saiu com as mangas rendadas de buraco e passou em tudo mais."""
        op = alfa > 128
        viz = np.zeros((h, w), np.int16)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy or dx:
                    viz += np.roll(np.roll(op, dy, 0), dx, 1).astype(np.int16)
        return int((op & (viz <= 2)).sum())

    def tenta(fundo_img, usar_sombra):
        """Monta um recorte com um modelo de fundo e devolve imagem + notas."""
        dist = np.sqrt(((a - fundo_img) ** 2).sum(axis=2))
        marcado = espalha(semente, dist < TOL)
        if usar_sombra:
            marcado = marcado | espalha(marcado, (dist < TOL_SOMBRA) & (liso | marcado))

        # alfa: 0 no fundo ligado à borda, rampa na zona duvidosa, 255 na peça
        alfa = np.full((h, w), 255, dtype=np.float32)
        alfa[marcado] = 0
        vizinho_do_fundo = np.zeros((h, w), dtype=bool)
        vizinho_do_fundo[1:, :] |= marcado[:-1, :]
        vizinho_do_fundo[:-1, :] |= marcado[1:, :]
        vizinho_do_fundo[:, 1:] |= marcado[:, :-1]
        vizinho_do_fundo[:, :-1] |= marcado[:, 1:]
        zona = vizinho_do_fundo & ~marcado
        # a rampa dá o contorno suave, para a peça não sair recortada a faca
        alfa[zona] = (np.clip((dist - TOL) / (TOL_DURO - TOL), 0, 1) * 255)[zona]

        saida = Image.fromarray(np.dstack([original, alfa.astype(np.uint8)]), "RGBA")
        saida = saida.filter(ImageFilter.SMOOTH)   # suaviza o serrilhado residual
        caixa = saida.getbbox()
        if caixa:
            saida = saida.crop(caixa)
        if max(saida.size) > lado_max:
            escala = lado_max / max(saida.size)
            saida = saida.resize((max(1, round(saida.size[0] * escala)),
                                  max(1, round(saida.size[1] * escala))), Image.LANCZOS)

        # ---- testes de qualidade ----
        af = np.asarray(saida)[:, :, 3]
        transparente = float((af < 16).mean())
        molduraf = np.concatenate([af[0], af[-1], af[:, 0], af[:, -1]])
        borda_limpa = float((molduraf < 16).mean())
        # o fundo era mesmo liso? mede-se pelo que sobra depois de descontá-lo:
        # resto grande na moldura significa cenário, e aí o recorte não serve.
        variacao = float(np.median(np.sqrt(((a - fundo_img) ** 2).sum(axis=2))[naMoldura]))

        # halo: o teste que pega o recorte folgado. Olho só a casquinha de fora do
        # que sobrou opaco. Se essa casca ainda tem a cor do fundo, o que ficou em
        # volta é fundo, não peça — foi o que passou batido na 1ª versão daqui.
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
        farelo = confete(alfa)

        # Peça grande em foto apertada encosta na moldura por direito, e aí a
        # moldura suja não quer dizer fundo sobrando. Quem decide nesse caso é o
        # halo: se o contorno é peça de verdade, o encosto está perdoado.
        moldura_ok = borda_limpa >= 0.97 or (borda_limpa >= 0.88 and halo <= 0.06)

        ok = (
            0.08 <= transparente <= 0.92   # sobrou peça e sumiu fundo
            and moldura_ok
            and variacao <= 26             # o fundo original era mesmo liso
            and halo <= 0.22               # o contorno é peça, não sobra de fundo
            and farelo <= LIMITE_CONFETE   # a peça não virou renda
        )
        notas = {
            "ok": bool(ok), "transparente": round(transparente, 3),
            "borda_limpa": round(borda_limpa, 3), "halo": round(halo, 3),
            "confete": farelo, "variacao_fundo": round(variacao, 1),
            "tamanho": list(saida.size),
        }
        # nota de desempate entre as que passam: menos halo e menos farelo ganha
        return saida, notas, halo + farelo / 2000.0

    combinacoes = [
        ("degradê+sombra", degrade, True),
        ("cor única+sombra", plano, True),
        ("degradê", degrade, False),
        ("cor única", plano, False),
    ]
    melhor = None
    tentativas = {}
    for nome, fundo_img, usar_sombra in combinacoes:
        saida, notas, nota = tenta(fundo_img, usar_sombra)
        tentativas[nome] = notas["ok"]
        if notas["ok"] and (melhor is None or nota < melhor[2]):
            melhor = (saida, notas, nota, nome)

    if melhor is None:
        # nenhuma passou: devolvo as notas da primeira, só para o diagnóstico
        _, notas, _ = tenta(degrade, True)
        notas["tentativas"] = tentativas
        return notas

    saida, notas, _, nome = melhor
    saida.save(caminho_saida)
    notas["modo"] = nome
    return notas


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
