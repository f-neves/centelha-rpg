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


def corta_em_grupos(valores, quantos):
    """Separa valores em `quantos` grupos, cortando nos maiores vazios.

    Serve para descobrir onde ficam as colunas (e as linhas) da folha a partir do
    centro dos objetos, sem supor que a IA dividiu a imagem em partes iguais."""
    if quantos <= 1 or len(valores) <= 1:
        return [min(valores) - 1] if valores else []
    ordenados = sorted(valores)
    vaos = sorted(range(len(ordenados) - 1),
                  key=lambda i: ordenados[i + 1] - ordenados[i], reverse=True)
    cortes = sorted(vaos[:quantos - 1])
    return [(ordenados[i] + ordenados[i + 1]) / 2 for i in cortes]


def agrupa_por_celula(caixas, cols, lins):
    """Junta os objetos soltos na célula da grade a que pertencem.

    Uma peça do sistema nem sempre é um desenho só: a funda saiu como bolsa mais
    corda, os dardos como três dardos separados. Contar objeto daria 10 onde a
    folha tem 8. Então descubro a grade pelos centros e ajunto o que cair no
    mesmo quadro."""
    centros_x = [(c[0] + c[2]) / 2 for c in caixas]
    centros_y = [(c[1] + c[3]) / 2 for c in caixas]
    limites_x = corta_em_grupos(centros_x, cols)
    limites_y = corta_em_grupos(centros_y, lins)

    def indice(v, limites):
        i = 0
        for lim in limites:
            if v > lim:
                i += 1
        return i

    celulas = {}
    for caixa, cx, cy in zip(caixas, centros_x, centros_y):
        chave = (indice(cy, limites_y), indice(cx, limites_x))
        if chave in celulas:
            a, b, c, d = celulas[chave]
            celulas[chave] = (min(a, caixa[0]), min(b, caixa[1]),
                              max(c, caixa[2]), max(d, caixa[3]))
        else:
            celulas[chave] = tuple(caixa)
    # ordem de leitura: linha de cima para baixo, coluna da esquerda para a direita
    return [celulas[k] for k in sorted(celulas)], celulas


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


def separa_do_fundo(bloco, cor_fundo):
    """Devolve (cor da peça, alfa) desfazendo a mistura com o fundo.

    O gerador entrega a peça já misturada ao magenta em toda borda e em todo
    traço fino: o pixel de uma malha de rede é meia tinta e meio fundo. Tratar
    isso como opaco pinta a rede de roxo, que foi o que aconteceu na primeira
    versão daqui (41% dos pixels da rede com cast de magenta).

    Então a conta é a da chave de cor: o que se vê é `obs = a·peça + (1−a)·fundo`.
    A distância até o fundo, normalizada pela distância típica da tinta, dá o `a`;
    com ele em mãos, inverter a mistura devolve a cor real da peça."""
    obs = bloco.astype(np.float32)
    d = np.sqrt(((obs - cor_fundo) ** 2).sum(axis=2))

    # referência: o quanto a tinta desta peça se afasta do fundo. Sai do miolo,
    # onde não há mistura nenhuma, e não de um número fixo.
    miolo = d > max(d.max() * 0.7, TOL_DURO)
    d_tinta = float(np.median(d[miolo])) if miolo.any() else max(d.max(), 1.0)

    alfa = np.clip(d / (d_tinta * 0.85), 0, 1)
    alfa[d < TOL_FUNDO] = 0            # ruído de compressão no fundo não vira peça

    # inverte a mistura. O piso no divisor evita estourar onde quase não há peça.
    a = np.maximum(alfa, 0.22)[:, :, None]
    peca = (obs - (1 - a) * cor_fundo) / a
    return np.clip(peca, 0, 255).astype(np.uint8), alfa


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

    bruta = Image.open(caminho_imagem)
    rgba = np.asarray(bruta.convert("RGBA"))

    # Dois caminhos. Se a folha JÁ vem com transparência (alguém tirou o fundo
    # antes, num editor ou noutra ferramenta), o alfa dela é a palavra final:
    # separar por cor de novo só teria como piorar. Sem alfa, vale a chave de
    # cor sobre o fundo chapado que o prompt pediu.
    pronta = (rgba[:, :, 3] < 16).mean() > 0.05
    cor_fundo = None
    if pronta:
        mascara = rgba[:, :, 3] > 64
    else:
        a = rgba[:, :, :3]
        # a cor do fundo vem da moldura da folha, não do prompt: se o gerador
        # entregou um magenta torto, é o dele que vale.
        moldura = np.concatenate([a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
                                  a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3)])
        cor_fundo = np.median(moldura, axis=0).astype(np.float32)
        dist = np.sqrt(((a.astype(np.float32) - cor_fundo) ** 2).sum(axis=2))
        mascara = dist > TOL_FUNDO

    objetos = acha_pecas(mascara, len(ids))
    caixas, celulas = agrupa_por_celula(objetos, cols, lins)
    if len(caixas) != len(ids):
        ocupadas = sorted(celulas)
        print(json.dumps({
            "ok": False,
            "motivo": f"achei {len(caixas)} quadros ocupados, a folha '{folha_id}' pede {len(ids)}",
            "dica": "peças de células vizinhas encostaram, ou a grade saiu torta demais "
                    "para ser lida. Sai mais barato gerar a folha de novo do que remendar.",
            "objetos_soltos": len(objetos),
            "celulas_ocupadas": [[int(l), int(c)] for l, c in ocupadas],
            "fonte": "alfa da própria folha" if pronta else "chave de cor",
            "cor_fundo": None if cor_fundo is None else [int(v) for v in cor_fundo],
        }, ensure_ascii=False))
        return False

    saida = PASTA / "folhas" / folha_id
    saida.mkdir(parents=True, exist_ok=True)
    atlas = Image.new("RGBA", (cw * cols, ch * lins), (0, 0, 0, 0))
    mapa = []

    for i, (caixa, peca_id) in enumerate(zip(caixas, ids)):
        x0, y0, x1, y1 = caixa
        if pronta:
            recorte = Image.fromarray(rgba[y0:y1, x0:x1].copy(), "RGBA")
        else:
            rgb, alfa = separa_do_fundo(rgba[y0:y1, x0:x1, :3], cor_fundo)
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
    # o webp é o que vai para o site: atlas grande em png pesa demais. 80 é onde
    # a gravura para de ganhar nitidez visível e o arquivo ainda cai bem.
    atlas.save(saida / f"{folha_id}.webp", quality=80, method=6)

    # A escala vem da altura do quadro na ficha, não de um divisor fixo: as células
    # não têm todas a mesma densidade, porque cada uma foi limitada ao que a arte
    # gerada aguentava sem ser ampliada à força.
    alvo = folha.get("altura_tela", ch // 2)
    escala = alvo / ch
    px = lambda v: f"{round(v * escala, 2):g}"
    css = [f"/* Folha {folha_id}: {len(ids)} peças. Célula {cw}×{ch}px no arquivo,",
           f"   exibida a {px(cw)}×{px(ch)}px ({ch / alvo:.2f}× de densidade). */",
           f".eq-folha-{folha_id} {{ background-image: url('{folha_id}.webp');",
           f"  background-size: {px(cw * cols)}px {px(ch * lins)}px;",
           f"  background-repeat: no-repeat; width: {px(cw)}px; height: {px(ch)}px; }}"]
    for m in mapa:
        css.append(f".eq-{m['id']} {{ background-position: -{px(m['x'])}px -{px(m['y'])}px; }}")
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
            guardado = antigo / f"{peca_id}.png"
            # o backup é do acervo ORIGINAL (museu e ícone). Numa segunda rodada
            # de arte, sobrescrevê-lo trocaria o original pela arte anterior e o
            # acervo de verdade se perderia.
            if atual.exists() and not guardado.exists():
                shutil.move(str(atual), str(guardado))
            shutil.copy(str(saida / "pecas" / f"{peca_id}.png"), str(atual))

    print(json.dumps({
        "ok": True, "folha": folha_id, "pecas": len(ids),
        "fonte": "alfa da própria folha" if pronta else "chave de cor",
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
