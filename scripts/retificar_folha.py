# Endireita uma folha de arte gerada por IA e monta o atlas com célula exata.
#
# O gerador de imagem não segura grade: as peças saem em escalas diferentes,
# fora do centro da célula, com a grade torta. Isso não serve para o site, que
# recorta a folha por `background-position` e mostraria pedaço da peça vizinha.
#
# Então o prompt pede só duas coisas do gerador (peças SEPARADAS e fundo MAGENTA
# chapado) e o resto é feito aqui: acha cada peça, tira o fundo, normaliza a
# escala, centra na célula e monta o atlas no pixel exato.
#
# A separação usa perfil de projeção, e não rotulagem de componentes: como o
# prompt garante corredores de fundo entre as peças, olhar onde as linhas e as
# colunas ficam vazias resolve, é exato e não depende de scipy.
#
#   python scripts/retificar_folha.py laminas folha-gerada.png
#   python scripts/retificar_folha.py laminas folha-gerada.png --aplicar
#
# Sem --aplicar nada é sobrescrito: sai tudo em D&D/armas&armaduras/folhas/.

import sys, json, argparse, shutil
from pathlib import Path
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
PLANO = RAIZ / "scripts" / "folhas-ia.json"
PASTA = RAIZ / "D&D" / "armas&armaduras"

# até onde a cor ainda conta como fundo. Folgado de propósito: o magenta chapado
# fica longe de qualquer tom de gravura sépia, e a folga come a compressão JPEG
# que o gerador costuma deixar na imagem.
TOL_FUNDO = 90
TOL_DURO = 130          # daqui para fora é peça, 100% opaca
MARGEM_CELULA = 0.06    # respiro entre a peça e a borda da célula
# uma faixa da folha conta como vazia quando quase nada nela é peça. O limiar não
# é zero porque o gerador salpica ruído de compressão no fundo.
LIMIAR_VAZIO = 0.004


def carrega_plano(folha_id):
    plano = json.loads(PLANO.read_text(encoding="utf8"))
    for f in plano["folhas"]:
        if f["id"] == folha_id:
            return plano, f
    nomes = ", ".join(f["id"] for f in plano["folhas"])
    raise SystemExit(f"Folha '{folha_id}' não existe. As que existem: {nomes}")


def faixas(perfil, limiar):
    """Devolve os trechos contínuos em que o perfil passa do limiar."""
    cheio = perfil > limiar
    saida, ini = [], None
    for i, v in enumerate(cheio):
        if v and ini is None:
            ini = i
        elif not v and ini is not None:
            saida.append((ini, i))
            ini = None
    if ini is not None:
        saida.append((ini, len(cheio)))
    return saida


def acha_pecas(mascara, esperadas):
    """Separa as peças pelos corredores de fundo: primeiro as linhas, depois as
    colunas dentro de cada linha. Aceita grade torta, desde que os corredores
    existam. Devolve as caixas em ordem de leitura."""
    h, w = mascara.shape
    caixas = []
    for y0, y1 in faixas(mascara[:, :].mean(axis=1), LIMIAR_VAZIO):
        if (y1 - y0) < h * 0.02:      # risco fino demais para ser peça
            continue
        banda = mascara[y0:y1]
        for x0, x1 in faixas(banda.mean(axis=0), LIMIAR_VAZIO):
            if (x1 - x0) < w * 0.01:
                continue
            recorte = banda[:, x0:x1]
            # aperta a caixa na vertical: dentro da banda a peça pode não ocupar
            # toda a altura (uma adaga ao lado de um montante)
            linhas_cheias = np.where(recorte.any(axis=1))[0]
            if not len(linhas_cheias):
                continue
            caixas.append((x0, y0 + linhas_cheias[0], x1, y0 + linhas_cheias[-1] + 1))
    return caixas


def alfa_por_cor(bloco, cor_fundo):
    """Alfa a partir da distância até a cor do fundo, com rampa nas bordas."""
    d = np.sqrt(((bloco.astype(np.float32) - cor_fundo) ** 2).sum(axis=2))
    return np.clip((d - TOL_FUNDO) / (TOL_DURO - TOL_FUNDO), 0, 1)


def tira_verde_do_fundo(rgb, cor_fundo):
    """Tira o eco da cor do fundo que fica na franja da peça.

    A borda da peça sai misturada com o fundo pela suavização do gerador, e a
    peça acaba com um contorno rosado que aparece feio sobre o fundo do site.
    Puxo o canal exagerado de volta para a média dos outros dois."""
    saida = rgb.astype(np.float32)
    dominante = int(np.argmax(cor_fundo))          # magenta domina R e B
    canais = [c for c in range(3) if c != dominante]
    for c in ([0, 2] if cor_fundo[0] > 100 and cor_fundo[2] > 100 else [dominante]):
        outros = [k for k in range(3) if k != c]
        teto = saida[:, :, outros].mean(axis=2)
        saida[:, :, c] = np.minimum(saida[:, :, c], teto + 12)
    return np.clip(saida, 0, 255).astype(np.uint8)


def encaixa(peca, celula):
    """Reduz a peça para caber na célula com margem e centra num quadro exato."""
    cw, ch = celula
    util_w, util_h = cw * (1 - 2 * MARGEM_CELULA), ch * (1 - 2 * MARGEM_CELULA)
    escala = min(util_w / peca.width, util_h / peca.height)
    novo = (max(1, round(peca.width * escala)), max(1, round(peca.height * escala)))
    peca = peca.resize(novo, Image.LANCZOS)
    quadro = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    quadro.paste(peca, ((cw - novo[0]) // 2, (ch - novo[1]) // 2), peca)
    return quadro


def retificar(folha_id, caminho_imagem, aplicar=False):
    plano, folha = carrega_plano(folha_id)
    cols, lins = folha["colunas"], folha["linhas"]
    cw, ch = folha["celula"]
    ids = [p["id"] for p in folha["pecas"]]

    im = Image.open(caminho_imagem).convert("RGB")
    a = np.asarray(im)

    # a cor do fundo vem da moldura da folha, não do prompt: se o gerador
    # entregou um magenta torto, é o dele que vale.
    moldura = np.concatenate([a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
                              a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3)])
    cor_fundo = np.median(moldura, axis=0).astype(np.float32)

    dist = np.sqrt(((a.astype(np.float32) - cor_fundo) ** 2).sum(axis=2))
    mascara = dist > TOL_FUNDO

    caixas = acha_pecas(mascara, len(ids))
    if len(caixas) != len(ids):
        print(json.dumps({
            "ok": False,
            "motivo": f"achei {len(caixas)} peças, a folha '{folha_id}' pede {len(ids)}",
            "dica": "duas peças encostaram uma na outra, ou o fundo não ficou chapado. "
                    "Sai mais barato gerar a folha de novo do que remendar.",
            "caixas": [[int(v) for v in c] for c in caixas],
            "cor_fundo": [int(v) for v in cor_fundo],
        }, ensure_ascii=False))
        return False

    saida = PASTA / "folhas" / folha_id
    saida.mkdir(parents=True, exist_ok=True)
    atlas = Image.new("RGBA", (cw * cols, ch * lins), (0, 0, 0, 0))
    mapa = []

    for i, (caixa, peca_id) in enumerate(zip(caixas, ids)):
        x0, y0, x1, y1 = caixa
        bloco = a[y0:y1, x0:x1]
        alfa = alfa_por_cor(bloco, cor_fundo)
        rgb = tira_verde_do_fundo(bloco, cor_fundo)
        recorte = Image.fromarray(np.dstack([rgb, (alfa * 255).astype(np.uint8)]), "RGBA")
        caixa_apertada = recorte.getbbox()
        if caixa_apertada:
            recorte = recorte.crop(caixa_apertada)

        quadro = encaixa(recorte, (cw, ch))
        col, lin = i % cols, i // cols
        atlas.paste(quadro, (col * cw, lin * ch), quadro)
        (saida / "pecas").mkdir(exist_ok=True)
        quadro.save(saida / "pecas" / f"{peca_id}.png")
        mapa.append({"id": peca_id, "coluna": col, "linha": lin,
                     "x": col * cw, "y": lin * ch, "largura": cw, "altura": ch})

    atlas.save(saida / f"{folha_id}.png")
    # o webp é o que vai para o site: atlas grande em png pesa demais
    atlas.save(saida / f"{folha_id}.webp", quality=88, method=6)

    # o site mostra a metade do atlas (a célula é o dobro, para tela retina)
    css = [f"/* Folha {folha_id}: {len(ids)} peças, célula {cw//2}×{ch//2}px na tela */",
           f".eq-folha-{folha_id} {{ background-image: url('{folha_id}.webp');",
           f"  background-size: {cw * cols // 2}px {ch * lins // 2}px; background-repeat: no-repeat; }}"]
    for m in mapa:
        css.append(f".eq-{m['id']} {{ background-position: -{m['x']//2}px -{m['y']//2}px; }}")
    (saida / f"{folha_id}.css").write_text("\n".join(css) + "\n", encoding="utf8")
    (saida / f"{folha_id}.json").write_text(json.dumps({
        "folha": folha_id, "colunas": cols, "linhas": lins,
        "celula": [cw, ch], "atlas": [cw * cols, ch * lins], "pecas": mapa,
    }, ensure_ascii=False, indent=2), encoding="utf8")

    if aplicar:
        antigo = PASTA / "acervo-museu"
        antigo.mkdir(exist_ok=True)
        for peca_id in ids:
            atual = PASTA / f"{peca_id}.png"
            if atual.exists():
                shutil.move(str(atual), str(antigo / f"{peca_id}.png"))
            shutil.copy(str(saida / "pecas" / f"{peca_id}.png"), str(atual))

    print(json.dumps({
        "ok": True, "folha": folha_id, "pecas": len(ids),
        "atlas": f"{cw * cols}×{ch * lins}",
        "png_kb": round((saida / f"{folha_id}.png").stat().st_size / 1024),
        "webp_kb": round((saida / f"{folha_id}.webp").stat().st_size / 1024),
        "aplicado": bool(aplicar),
        "saida": str(saida),
    }, ensure_ascii=False))
    return True


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("folha", help="id da folha em scripts/folhas-ia.json")
    p.add_argument("imagem", help="a folha crua que a IA gerou")
    p.add_argument("--aplicar", action="store_true",
                   help="instala as peças na pasta principal (guarda as atuais em acervo-museu/)")
    args = p.parse_args()
    sys.exit(0 if retificar(args.folha, args.imagem, args.aplicar) else 1)
