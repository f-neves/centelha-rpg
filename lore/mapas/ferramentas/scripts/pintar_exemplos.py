"""Pinta, pela API da ferramenta, as ÁREAS DE EXEMPLO de contorno irregular (pedido do
usuário na noite de 2026-09-23): cordilheira no norte de Mére, selva no extremo sul,
deserto no interior e oeste do sul de Mére, floresta densa em Syl, temperada em Calin,
tundra e conífera em The Neck, gelo no White Wall, seguindo o guia de clima do
CARTOGRAFO. Todas vão com `"exemplo": true` e id `exemplo-*`, para o usuário substituir
quando pintar à mão. Servem para avaliar a franja da borda com contorno de verdade, e
não com o pentágono dos exemplos da noite 2.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/pintar_exemplos.py --ver       # só a prévia, sem gravar
    .venv/Scripts/python.exe scripts/pintar_exemplos.py --gravar    # apaga os exemplo-* e grava

**Como o contorno é feito**: uma forma base (elipse ou uma linha engordada), com o
contorno amostrado a cada ~45 km e cada vértice empurrado para fora ou para dentro por
uma soma de senoides de fase sorteada (lóbulos e baías de 150 km até o tamanho da forma) mais um
tremido pequeno, que é o jeito de quem desenha à mão. Dá de 36 a 110 vértices por área.
Depois, cada área é cortada pelo LADO da sua ilha (polígonos desenhados à mão pelo meio
dos canais entre Mére, Syl e Calin), para a selva de Mére não atravessar para Syl. Sem
identidade de ilha nem varredura da máscara: o cache de ilha continua proibido.

**A ordem importa**: área nova recorta a antiga da mesma camada (decisão 3), então a
lista vai do fundo para a frente (colina antes da montanha, montanha antes da alta
montanha, selva antes da floresta tropical da costa leste).

Tudo aqui (onde, quanto, que forma) é recomendação do Cartógrafo, e é descartável.
"""

import json
import math
import sys
import urllib.error
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import LineString, Point, Polygon, mapping, shape
from shapely.geometry.polygon import orient

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
SERVIDOR = "http://127.0.0.1:8420"
KM_POR_GRAU = 138.993658

# Lados das ilhas de Waning, pelo meio dos canais (lon, lat). Desenhados olhando a
# costa reduzida com grade; só servem para uma área não vazar para a ilha vizinha.
_CANAL_CALIN_MERE = [(17.3, 45), (17.0, 40), (15.5, 37), (14.0, 33), (12.5, 30), (10.5, 26)]
_CANAL_SYL_MERE = [(10.5, 26), (9.3, 22), (7.5, 18), (5.0, 14), (3.0, 11), (1.5, 8), (0.8, 5), (0.5, -3)]
_CANAL_CALIN_SYL = [(-30, 26.3), (-10, 26.5), (-4, 26.8), (0, 27.3), (5, 27.2), (9, 25.6), (10.5, 26)]
LADO = {
    "mere": Polygon(_CANAL_CALIN_MERE + _CANAL_SYL_MERE[1:] + [(40, -3), (40, 45)]),
    "syl": Polygon(_CANAL_CALIN_SYL + _CANAL_SYL_MERE[1:] + [(-30, -3)]),
    "calin": Polygon(_CANAL_CALIN_SYL + _CANAL_CALIN_MERE[::-1][1:] + [(-30, 45)]),
    "the-neck": None,
    "white-wall": None,
}


def elipse(lon, lat, rx, ry, giro=0.0):
    c, s = math.cos(math.radians(giro)), math.sin(math.radians(giro))
    pts = []
    for i in range(96):
        a = 2 * math.pi * i / 96
        x, y = rx * math.cos(a), ry * math.sin(a)
        pts.append((lon + x * c - y * s, lat + x * s + y * c))
    return Polygon(pts)


def faixa(pontos, meia_largura):
    return LineString(pontos).buffer(meia_largura, quad_segs=24)


def organico(base: Polygon, semente: int, amplitude: float) -> Polygon:
    """O contorno de `base` com lóbulos e baías: `amplitude` em graus é o desvio
    quadrático médio do empurrão."""
    rng = np.random.default_rng(semente)
    anel = orient(base, 1.0).exterior              # anti-horário: normal para fora = (ty, -tx)
    comprimento_km = anel.length * KM_POR_GRAU
    n = int(min(110, max(36, comprimento_km / 45)))
    pts = np.array([anel.interpolate(i * anel.length / n).coords[0] for i in range(n)])
    tang = np.roll(pts, -1, 0) - np.roll(pts, 1, 0)
    tang /= np.linalg.norm(tang, axis=1, keepdims=True)
    normal = np.stack([tang[:, 1], -tang[:, 0]], 1)
    fase = np.arange(n) / n
    d = np.zeros(n)
    # Harmônicos até uma onda de ~150 km de contorno, qualquer que seja o tamanho da
    # forma: senão uma faixa comprida sai lisa como uma salsicha.
    for k in range(2, max(15, int(comprimento_km / 150)) + 1):
        d += k ** -1.0 * rng.normal() * np.sin(2 * math.pi * (k * fase + rng.random()))
    d = d / d.std() + rng.normal(0, 0.15, n)
    novo = Polygon(pts + normal * (d * amplitude)[:, None]).buffer(0)
    if novo.geom_type == "MultiPolygon":
        novo = max(novo.geoms, key=lambda g: g.area)
    return novo


# (id, camada, valor, lado, forma base, amplitude em graus, semente)
AREAS = [
    # --- Mére: metade norte montanhosa e fria, metade sul quente e densa --------------
    ("exemplo-colina-mere-norte", "relevo", "colina", "mere",
     faixa([(17.5, 34.0), (20.0, 31.2), (23.0, 28.8), (26.5, 27.2)], 1.0), 0.30, 2001),
    ("exemplo-montanha-mere-norte", "relevo", "montanha", "mere",
     faixa([(18.5, 39.8), (21.0, 37.2), (23.5, 34.6), (26.0, 32.6), (27.8, 30.2)], 1.45), 0.40, 2002),
    ("exemplo-alta-montanha-mere-norte", "relevo", "alta-montanha", "mere",
     faixa([(20.2, 38.2), (22.4, 35.9), (24.6, 33.8)], 0.6), 0.18, 2003),
    ("exemplo-boreal-mere-norte", "cobertura", "floresta-boreal", "mere",
     elipse(21.0, 37.8, 3.6, 2.4, -25), 0.55, 2004),
    ("exemplo-deserto-mere-sul", "cobertura", "deserto", "mere",
     elipse(13.8, 19.4, 5.2, 4.4, 10), 0.75, 2005),
    ("exemplo-selva-mere-sul", "cobertura", "selva", "mere",
     faixa([(3.0, 4.0), (8.0, 2.6), (14.0, 2.0), (20.5, 3.6)], 2.3), 0.50, 2006),
    ("exemplo-tropical-mere-leste", "cobertura", "floresta-tropical", "mere",
     faixa([(23.5, 5.5), (26.2, 10.0), (27.4, 15.5), (27.2, 21.5)], 1.9), 0.45, 2007),
    ("exemplo-pantano-mere-sul", "cobertura", "pantano", "mere",
     elipse(16.8, 8.2, 1.7, 1.1, 20), 0.30, 2008),
    ("exemplo-lago-mere-norte", "lago", "lago", "mere",
     elipse(19.6, 32.0, 0.55, 0.32, 30), 0.07, 2009),
    # --- Syl: a parte mais verde, florestas densas, planícies amplas, poucas montanhas -
    ("exemplo-tropical-syl-oeste", "cobertura", "floresta-tropical", "syl",
     elipse(-14.0, 12.5, 4.3, 3.8, 15), 0.70, 2101),
    ("exemplo-tropical-syl-leste", "cobertura", "floresta-tropical", "syl",
     elipse(-3.0, 16.8, 3.6, 3.0, -10), 0.60, 2102),
    ("exemplo-temperada-syl-norte", "cobertura", "floresta-temperada", "syl",
     faixa([(-8.0, 22.6), (-2.0, 23.6), (4.0, 23.2)], 1.3), 0.35, 2103),
    ("exemplo-pantano-syl", "cobertura", "pantano", "syl",
     elipse(-7.2, 8.2, 1.6, 1.0, 0), 0.28, 2104),
    ("exemplo-colina-syl", "relevo", "colina", "syl",
     elipse(-10.5, 18.2, 1.8, 1.1, 30), 0.30, 2105),
    # --- Calin: temperado, algumas montanhas, mais campo (fica papel) -----------------
    ("exemplo-temperada-calin-norte", "cobertura", "floresta-temperada", "calin",
     elipse(8.0, 38.8, 3.2, 2.5, 20), 0.55, 2201),
    ("exemplo-temperada-calin-oeste", "cobertura", "floresta-temperada", "calin",
     elipse(-1.5, 30.4, 2.7, 1.8, 0), 0.40, 2202),
    ("exemplo-colina-calin", "relevo", "colina", "calin",
     faixa([(2.5, 35.2), (5.8, 33.4), (9.2, 32.2)], 0.85), 0.25, 2203),
    ("exemplo-montanha-calin", "relevo", "montanha", "calin",
     elipse(12.3, 37.2, 1.4, 1.0, 40), 0.25, 2204),
    # --- The Neck: frio porém habitável, tundra e coníferas esparsas ------------------
    ("exemplo-tundra-the-neck", "cobertura", "tundra", "the-neck",
     elipse(-25.5, 53.6, 5.6, 2.6, 0), 0.55, 2301),
    ("exemplo-boreal-the-neck", "cobertura", "floresta-boreal", "the-neck",
     faixa([(-25.6, 53.0), (-24.2, 51.6), (-23.2, 50.3)], 1.0), 0.28, 2302),
    # --- The White Wall: as montanhas mais altas, gelo e neve -------------------------
    ("exemplo-geleira-white-wall", "cobertura", "geleira", "white-wall",
     faixa([(-38.0, 65.6), (-30.0, 66.0), (-22.0, 65.5), (-14.0, 66.0)], 3.2), 0.60, 2401),
    ("exemplo-alta-montanha-white-wall", "relevo", "alta-montanha", "white-wall",
     faixa([(-36.0, 66.6), (-28.0, 67.0), (-20.0, 66.4), (-13.0, 66.9)], 1.1), 0.45, 2402),
]


def geometrias() -> list[dict]:
    saida = []
    for id_area, camada, valor, lado, base, amplitude, semente in AREAS:
        forma = organico(base, semente, amplitude)
        if LADO[lado] is not None:
            forma = forma.intersection(LADO[lado])
            if forma.geom_type != "Polygon":
                forma = max(forma.geoms, key=lambda g: g.area)
        forma = forma.simplify(0.02)
        saida.append({"id": id_area, "camada": camada, "valor": valor, "semente_ruido": semente,
                      "exemplo": True, "geometria": mapping(forma), "_vertices": len(forma.exterior.coords) - 1})
    return saida


def _pedir(metodo, caminho, corpo=None):
    dados = None if corpo is None else json.dumps(corpo).encode("utf-8")
    req = urllib.request.Request(SERVIDOR + caminho, data=dados, method=metodo,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def gravar(lista) -> int:
    status, atual = _pedir("GET", "/api/areas")
    assert status == 200, atual
    for f in atual["features"]:
        if f["properties"]["id"].startswith("exemplo-"):
            s, r = _pedir("DELETE", f"/api/areas/{f['properties']['id']}")
            print(f"apagada {f['properties']['id']}: {s}")
            if s != 200:
                print(r)
                return 1
    for a in lista:
        corpo = {k: v for k, v in a.items() if not k.startswith("_")}
        s, r = _pedir("POST", "/api/areas", corpo)
        print(f"criada {a['id']} ({a['_vertices']} vértices): {s}")
        if s != 200:
            print(r)
            return 1
    # Conferência: a marca tem de ter chegado ao disco (um servidor antigo, sem o campo,
    # aceitaria o pedido e jogaria a marca fora em silêncio).
    _, final = _pedir("GET", "/api/areas")
    por_id = {f["properties"]["id"]: f for f in final["features"]}
    faltam = [a["id"] for a in lista if por_id.get(a["id"], {}).get("properties", {}).get("exemplo") is not True]
    if faltam:
        print(f"ERRO: sem a marca de exemplo no disco: {faltam}")
        return 1
    print(f"{len(lista)} áreas de exemplo gravadas, todas com a marca")
    return 0


def ver(lista, destino: Path) -> Path:
    """Prévia: a costa reduzida 8x com as áreas por cima, cada camada numa cor."""
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
        costa = im.convert("L").resize((1280, 1280), Image.BOX)
    base = Image.new("RGB", costa.size, (170, 190, 205))
    base.paste((235, 225, 200), mask=costa.point(lambda v: 255 if v >= 128 else 0))
    camada = Image.new("RGBA", costa.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    cores = {"relevo": (150, 60, 20), "cobertura": (20, 120, 40), "lago": (20, 60, 200)}
    ppg = 111.194927 / 8

    def px(lon, lat):
        return (5120 / 8 + lon * ppg, 7650 / 8 - lat * ppg)

    for a in lista:
        anel = [px(*p) for p in shape(a["geometria"]).exterior.coords]
        cor = cores[a["camada"]]
        d.polygon(anel, fill=cor + (50,), outline=cor + (255,))
        c = shape(a["geometria"]).representative_point()
        d.text(px(c.x, c.y), a["valor"], fill=cor + (255,))
    for lado in LADO.values():
        if lado is not None:
            d.line([px(*p) for p in lado.exterior.coords], fill=(200, 0, 200, 120))
    base = base.convert("RGBA")
    base.alpha_composite(camada)
    base.convert("RGB").save(destino)
    return destino


def main(argv) -> int:
    lista = geometrias()
    for a in lista:
        print(f"{a['id']:36s} {a['camada']:9s} {a['valor']:18s} {a['_vertices']:4d} vértices")
    if "--ver" in argv:
        print(ver(lista, RAIZ_MAPAS / "render" / "analise" / "exemplos-irregulares.png"))
    if "--gravar" in argv:
        return gravar(lista)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
