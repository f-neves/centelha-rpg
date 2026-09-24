"""MAPAS DISTORCIDOS DE PROPÓSITO (B5 da empreitada, 2026-09-23 noite): para os
jogadores comprarem mapas ruins.

**A distorção acontece SÓ na renderização**: aqui se recebe uma CÓPIA dos dados e se
devolve outra cópia mentirosa; nenhum arquivo é tocado, e o mapa verdadeiro continua
intacto (o teste confere os bytes dos arquivos antes e depois).

**Nível de 1 a 5**: 5 é o mapa fiel (nada muda), 1 é o mapa de feira. A força
`k = (5 - nivel) / 4` vai de 0 a 1 e multiplica tudo:

- **costa deformada e distâncias erradas**: um campo de deslocamento suave, ancorado
  no mundo, soma de senoides de fase sorteada. Uma parte de onda longa (15° a 40°,
  até 1,8° de amplitude com k = 1) estica e encolhe regiões inteiras; outra de onda
  curta (3° a 6°, até 0,35°) entorta a costa. O fundo é deformado pela inversa do
  campo (malha de 32 px), e todo vetor (rio, estrada, rota, lugar, nome) pelo campo;
  as duas coisas continuam juntas, só que no lugar errado;
- **lugares deslocados** (até 0,5° a mais, cada um), **lugares faltando** (até 35%),
  **nomes trocados** entre lugares (até 25%) e **nomes escritos errado** (até 40%:
  letras trocadas, vogal errada, letra perdida);
- **rios e estradas simplificados ou desviados**: Douglas-Peucker com tolerância até
  0,6° e desvio lateral até 0,25°;
- **regiões ausentes** (o nome some, até 30%; com k >= 0,5, uma ilha pequena do recorte
  some do mapa) e **inventadas** (com k >= 0,5, uma ou duas ilhas fantasmas no mar, com
  nome inventado);
- **menos detalhe de relevo**: até 60% dos símbolos de relevo e cobertura somem;
- **borrões de tinta e papel gasto**: papel amarelado, manchas, dobras e cantos
  escurecidos.

**Semente por mapa**: sai do mercador e do recorte (`exportar.py`), então o mesmo mapa
comprado do mesmo mercador sai sempre igual, e dois mercadores erram de formas
diferentes. O NÍVEL não entra na semente: o mesmo mercador, em nível pior, erra na
mesma direção, só que mais.

**O que cada mapa mentiu** vai para o mestre (`mentiras`), gravado ao lado da imagem.

Todos os números são recomendação do Cartógrafo.
"""

from __future__ import annotations

import copy
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import LineString

from . import composicao as C

MALHA_PX = 32


def forca(nivel: int) -> float:
    return max(0.0, min(1.0, (5 - nivel) / 4))


class Campo:
    """O deslocamento suave (em graus) de cada ponto do mundo, para uma semente e uma
    força. Duas escalas: onda longa (distâncias) e onda curta (costa)."""

    def __init__(self, semente: int, k: float):
        rng = np.random.default_rng(semente)
        self.modos = []
        for amp_max, onda_min, onda_max, n in ((1.8, 15.0, 40.0, 4), (0.35, 3.0, 6.0, 6)):
            for _ in range(n):
                onda = rng.uniform(onda_min, onda_max)
                ang = rng.uniform(0, 2 * math.pi)
                self.modos.append((k * amp_max / math.sqrt(n) * rng.uniform(0.6, 1.4), 2 * math.pi / onda,
                                   math.cos(ang), math.sin(ang), rng.uniform(0, 2 * math.pi),
                                   rng.uniform(0, 2 * math.pi), rng.uniform(0, 2 * math.pi)))

    def __call__(self, lon, lat):
        dlon = np.zeros_like(np.asarray(lon, dtype=float))
        dlat = np.zeros_like(dlon)
        for amp, freq, cx, cy, f1, f2, dirg in self.modos:
            fase = freq * (np.asarray(lon) * cx + np.asarray(lat) * cy)
            dlon = dlon + amp * math.cos(dirg) * np.sin(fase + f1)
            dlat = dlat + amp * math.sin(dirg) * np.sin(fase + f2)
        return dlon, dlat

    def maximo(self) -> float:
        return sum(m[0] for m in self.modos)


def _errar_nome(nome: str, rng) -> str:
    letras = list(nome)
    idx = [i for i, c in enumerate(letras) if c.isalpha()]
    if len(idx) < 3:
        return nome
    jeito = rng.integers(3)
    if jeito == 0:
        i = idx[int(rng.integers(len(idx) - 1))]
        j = i + 1
        if j < len(letras) and letras[j].isalpha():
            letras[i], letras[j] = letras[j], letras[i]
    elif jeito == 1:
        vogais = [i for i in idx if letras[i].lower() in "aeiouáéíóúâêôãõ"]
        if vogais:
            i = vogais[int(rng.integers(len(vogais)))]
            nova = "aeiou"[int(rng.integers(5))]
            letras[i] = nova.upper() if letras[i].isupper() else nova
    else:
        i = idx[1 + int(rng.integers(len(idx) - 1))]
        del letras[i]
    errado = "".join(letras)
    if errado == nome and len(idx) >= 2:
        # Nada mudou (letras iguais trocadas): troca as duas últimas letras.
        i, j = idx[-2], idx[-1]
        letras[i], letras[j] = letras[j], letras[i]
        errado = "".join(letras)
    if errado == nome:
        # Letras todas iguais: some a última.
        del letras[idx[-1]]
        errado = "".join(letras)
    return errado


_SILABAS = ("ar", "ven", "tal", "mor", "sil", "dra", "cos", "lum", "bre", "ga", "no", "ri", "tu", "el", "sa")


def _nome_inventado(rng) -> str:
    n = 2 + int(rng.integers(2))
    raiz = "".join(_SILABAS[int(rng.integers(len(_SILABAS)))] for _ in range(n))
    return f"Ilha de {raiz.capitalize()}"


def _simplificar(coords, tol, desvio, rng):
    if len(coords) < 3 or tol <= 0:
        return coords
    s = list(LineString(coords).simplify(tol, preserve_topology=False).coords)
    saida = [list(s[0])]
    for p in s[1:-1]:
        saida.append([p[0] + rng.normal(0, desvio), p[1] + rng.normal(0, desvio)])
    saida.append(list(s[-1]))
    return saida


def _km(dlon, dlat, lat):
    return math.hypot(dlon * math.cos(math.radians(lat)), dlat) * C.KM_POR_GRAU


def preparar(dados: dict, pedido) -> tuple:
    """Devolve (dados mentirosos, transformar(lon, lat), pos_base(tela, janela),
    mentiras). `dados` não é alterado."""
    nivel = pedido.distorcao["nivel"]
    semente = int(pedido.distorcao.get("semente") or 0)
    k = forca(nivel)
    rng = np.random.default_rng(semente)
    campo = Campo(semente, k)
    d = copy.deepcopy(dados)
    mentiras = {"nivel": nivel, "semente": semente, "mercador": pedido.distorcao.get("mercador"),
                "forca": round(k, 2), "deslocamento_maximo_km": round(campo.maximo() * C.KM_POR_GRAU),
                "lugares_deslocados": [], "lugares_faltando": [], "nomes_trocados": [], "nomes_errados": [],
                "rios_e_vias_simplificados": 0, "nomes_de_regiao_ausentes": [], "ilhas_omitidas": [],
                "ilhas_inventadas": [], "simbolos_de_relevo_omitidos_pct": round(60 * k)}
    dentro = lambda lon, lat: pedido.oeste <= lon <= pedido.leste and pedido.sul <= lat <= pedido.norte

    # Lugares: somem, e os que ficam andam além do campo.
    extra = {}
    mantidos = []
    for f in d["lugares"]:
        p = f["properties"]
        lon, lat = f["geometry"]["coordinates"]
        if rng.random() < 0.35 * k:
            if dentro(lon, lat):
                mentiras["lugares_faltando"].append(p.get("nome") or p["id"])
            continue
        dl, dt = rng.normal(0, 0.5 * k / 1.4, 2)
        extra[p["id"]] = (dl, dt)
        cl, ct = campo(lon, lat)
        total = _km(float(cl) + dl, float(ct) + dt, lat)
        if dentro(lon, lat) and total >= 10:
            mentiras["lugares_deslocados"].append({"lugar": p.get("nome") or p["id"], "km": round(total)})
        mantidos.append(f)
    d["lugares"] = mantidos
    ids_vivos = {f["properties"]["id"] for f in mantidos}

    # Onde cada nome está (para o registro dizer só o que aparece no recorte).
    ponto_do_lugar = {f["properties"]["id"]: f["geometry"]["coordinates"] for f in dados["lugares"]}

    def no_recorte(n) -> bool:
        if n["alvo"]["tipo"] == "lugar":
            p = ponto_do_lugar.get(n["alvo"]["id"])
        elif n.get("posicao"):
            p = n["posicao"]["coordinates"]
        elif n.get("linha"):
            c = n["linha"]["coordinates"]
            p = c[len(c) // 2]
        else:
            return True
        return p is not None and dentro(*p)

    # Nomes: os de lugar sumido somem; os outros podem ser trocados ou escritos errado.
    nomes = [n for n in d["nomes"] if n["alvo"]["tipo"] != "lugar" or n["alvo"]["id"] in ids_vivos]
    de_lugar = [n for n in nomes if n["alvo"]["tipo"] == "lugar"]
    rng.shuffle(de_lugar)
    for a, b in zip(de_lugar[0::2], de_lugar[1::2]):
        if rng.random() < 0.25 * k:
            a["texto_mostrado"], b["texto_mostrado"] = b["texto"], a["texto"]
            for x, y in ((a, b), (b, a)):
                if no_recorte(x):
                    mentiras["nomes_trocados"].append({"lugar": x["texto"], "mostra": y["texto"]})
    saida_nomes = []
    for n in nomes:
        if n["alvo"]["tipo"] == "regiao" and rng.random() < 0.3 * k:
            if no_recorte(n):
                mentiras["nomes_de_regiao_ausentes"].append(n["texto"])
            continue
        if rng.random() < 0.4 * k:
            errado = _errar_nome(n.get("texto_mostrado") or n["texto"], rng)
            if no_recorte(n):
                mentiras["nomes_errados"].append({"nome": n["texto"], "escrito": errado})
            n["texto_mostrado"] = errado
        saida_nomes.append(n)
    d["nomes"] = saida_nomes

    # Rios, estradas e rotas: simplificados e desviados.
    for chave in ("rios", "estradas", "rotas"):
        for f in d[chave]:
            antes = f["geometry"]["coordinates"]
            f["geometry"]["coordinates"] = _simplificar(antes, 0.6 * k, 0.25 * k, rng)
            if len(f["geometry"]["coordinates"]) != len(antes):
                mentiras["rios_e_vias_simplificados"] += 1

    # Ilhas inventadas (no mar do recorte) e uma ilha pequena omitida.
    fantasmas = []
    omitida = None
    if k >= 0.5:
        for _ in range(1 + int(k >= 0.85)):
            for _tentativa in range(40):
                lon = rng.uniform(pedido.oeste + 1, pedido.leste - 1)
                lat = rng.uniform(pedido.sul + 1, pedido.norte - 1)
                if not _terra_perto(lon, lat):
                    raio = rng.uniform(0.25, 0.7)
                    ang = np.linspace(0, 2 * math.pi, 40, endpoint=False)
                    r = raio * (1 + 0.25 * np.sin(3 * ang + rng.uniform(0, 6)) + 0.1 * rng.normal(0, 1, 40))
                    poly = [(lon + ri * math.cos(a), lat + ri * math.sin(a)) for ri, a in zip(r, ang)]
                    nome = _nome_inventado(rng)
                    fantasmas.append({"nome": nome, "poligono": poly, "lon": lon, "lat": lat})
                    mentiras["ilhas_inventadas"].append({"nome": nome, "lon": round(lon, 2), "lat": round(lat, 2)})
                    d["nomes"].append({"alvo": {"tipo": "livre", "id": None}, "texto": nome, "nivel": 2,
                                       "posicao": {"type": "Point", "coordinates": [lon, lat - raio - 0.25]},
                                       "angulo": None, "curva": None, "reto": True, "visivel_jogador": True})
                    break
        omitida = _ilha_pequena_do_recorte(pedido, rng)
        if omitida:
            mentiras["ilhas_omitidas"].append(omitida["descricao"])

    def transformar(lon, lat):
        dl, dt = campo(lon, lat)
        return lon + float(dl), lat + float(dt)

    def transformar_lugar(id_lugar):
        return extra.get(id_lugar, (0.0, 0.0))

    # Os lugares recebem o deslocamento extra no próprio dado (cópia).
    for f in d["lugares"]:
        dl, dt = extra.get(f["properties"]["id"], (0.0, 0.0))
        lon, lat = f["geometry"]["coordinates"]
        f["geometry"]["coordinates"] = [lon + dl, lat + dt]

    def pos_base(tela: Image.Image, janela) -> Image.Image:
        if omitida is not None:
            _apagar_ilha(tela, janela, omitida)
        tela = _deformar(tela, janela, campo)
        if fantasmas:
            _desenhar_fantasmas(tela, janela, fantasmas, transformar)
        return tela

    d["_desgaste"] = {"k": k, "semente": semente}
    return d, transformar, pos_base, mentiras


def _terra_perto(lon, lat, raio=1.2) -> bool:
    import sys
    sys.path.insert(0, str(C.RAIZ_MAPAS / "ferramentas"))
    from backend import lugares
    for dl in (-raio, 0, raio):
        for dt in (-raio, 0, raio):
            if lugares.ponto_em_terra(lon + dl, lat + dt):
                return True
    return False


def _ilha_pequena_do_recorte(pedido, rng):
    """Uma ilha pequena (menos de 3.000 km²) inteira dentro do recorte, pelo cache."""
    try:
        import sys
        sys.path.insert(0, str(C.RAIZ_MAPAS / "ferramentas"))
        from backend import ilhas
        if not ilhas.existe():
            return None
        comps = ilhas.componentes()["componentes"]
    except Exception:
        return None
    x0 = C.X_MERIDIANO + pedido.oeste * C.PPG_OFICIAL
    x1 = C.X_MERIDIANO + pedido.leste * C.PPG_OFICIAL
    y0 = C.Y_EQUADOR - pedido.norte * C.PPG_OFICIAL
    y1 = C.Y_EQUADOR - pedido.sul * C.PPG_OFICIAL
    candidatas = [(int(c), v) for c, v in comps.items()
                  if 400 <= v["area_px"] <= 2000 and v["caixa"][0] > x0 and v["caixa"][2] < x1
                  and v["caixa"][1] > y0 and v["caixa"][3] < y1]
    if not candidatas:
        return None
    c, v = candidatas[int(rng.integers(len(candidatas)))]
    bx0, by0, bx1, by1 = v["caixa"]
    lon = ((bx0 + bx1) / 2 - C.X_MERIDIANO) / C.PPG_OFICIAL
    lat = (C.Y_EQUADOR - (by0 + by1) / 2) / C.PPG_OFICIAL
    return {"componente": c, "caixa": v["caixa"],
            "descricao": {"lon": round(lon, 2), "lat": round(lat, 2),
                          "area_km2": round(v["area_px"] * 1.25 * 1.25)}}


def _apagar_ilha(tela: Image.Image, janela, omitida) -> None:
    import sys
    sys.path.insert(0, str(C.RAIZ_MAPAS / "ferramentas"))
    from backend import ilhas
    rot = ilhas.rotulos()
    x0, y0, x1, y1 = omitida["caixa"]
    folga = 3
    x0, y0, x1, y1 = x0 - folga, y0 - folga, x1 + folga, y1 + folga
    mascara = (np.asarray(rot[y0:y1, x0:x1]) == omitida["componente"]).astype(np.uint8) * 255
    m = Image.fromarray(mascara).filter(ImageFilter.MaxFilter(5))
    # Caixa em lon/lat -> pixels da janela.
    lon0, lat0 = (x0 - C.X_MERIDIANO) / C.PPG_OFICIAL, (C.Y_EQUADOR - y0) / C.PPG_OFICIAL
    lon1, lat1 = (x1 - C.X_MERIDIANO) / C.PPG_OFICIAL, (C.Y_EQUADOR - y1) / C.PPG_OFICIAL
    px0, py0 = janela.para_pixel(lon0, lat0)
    px1, py1 = janela.para_pixel(lon1, lat1)
    w, h = max(1, int(round(px1 - px0))), max(1, int(round(py1 - py0)))
    m = m.resize((w, h), Image.NEAREST)
    mar = Image.new("RGBA", (w, h), C.renderizador.COR_MAR + (255,))
    tela.paste(mar, (int(round(px0)), int(round(py0))), m)


def _deformar(tela: Image.Image, janela, campo: Campo) -> Image.Image:
    """Fundo deformado pela inversa do campo, numa malha ancorada na grade global
    (o mesmo desenho em qualquer bloco)."""
    ppg = janela.px_por_grau
    ox, oy = C.origem(janela)
    w, h = tela.size
    xs = list(range(-(ox % MALHA_PX), w, MALHA_PX)) + [w]
    ys = list(range(-(oy % MALHA_PX), h, MALHA_PX)) + [h]
    xs = sorted({max(0, min(w, x)) for x in xs})
    ys = sorted({max(0, min(h, y)) for y in ys})
    malha = []
    gx = np.array(xs, dtype=float)
    gy = np.array(ys, dtype=float)
    LON = janela.oeste + gx[None, :] / ppg + 0 * gy[:, None]
    LAT = janela.norte - gy[:, None] / ppg + 0 * gx[None, :]
    DL, DT = campo(LON, LAT)
    SX = gx[None, :] - DL * ppg
    SY = gy[:, None] + DT * ppg
    for j in range(len(ys) - 1):
        for i in range(len(xs) - 1):
            if xs[i + 1] <= xs[i] or ys[j + 1] <= ys[j]:
                continue
            quad = (SX[j, i], SY[j, i], SX[j + 1, i], SY[j + 1, i],
                    SX[j + 1, i + 1], SY[j + 1, i + 1], SX[j, i + 1], SY[j, i + 1])
            malha.append(((xs[i], ys[j], xs[i + 1], ys[j + 1]), quad))
    return tela.transform(tela.size, Image.MESH, malha, Image.BILINEAR,
                          fillcolor=C.renderizador.COR_MAR + (255,))


def _desenhar_fantasmas(tela, janela, fantasmas, transformar) -> None:
    d = ImageDraw.Draw(tela)
    for f in fantasmas:
        pts = [janela.para_pixel(*transformar(lon, lat)) for lon, lat in f["poligono"]]
        d.polygon(pts, fill=C.renderizador.COR_TERRA + (255,), outline=C.renderizador.COR_COSTA + (255,))


def empobrecer_plano(plano, pedido):
    """Menos detalhe de relevo: tira até 60% dos símbolos, sempre os mesmos para a
    mesma semente."""
    k = forca(pedido.distorcao["nivel"])
    if k <= 0:
        return plano
    rng = np.random.default_rng(int(pedido.distorcao.get("semente") or 0) + 7)
    sorte = rng.random(len(plano.colocacoes))
    return C.Plano(plano.ppg, [c for c, r in zip(plano.colocacoes, sorte) if r >= 0.6 * k],
                   plano.folga_px)


def desgastar(imagem: Image.Image, distorcao: dict) -> Image.Image:
    """Papel amarelado, manchas de tinta, dobras e cantos escurecidos, na imagem
    inteira do recorte (é o papel do mapa, não o mundo)."""
    k = forca(distorcao["nivel"])
    if k <= 0:
        return imagem
    rng = np.random.default_rng(int(distorcao.get("semente") or 0) + 13)
    w, h = imagem.size
    base = imagem.convert("RGB")
    amarelo = Image.new("RGB", (w, h), (214, 190, 140))
    base = Image.blend(base, amarelo, 0.22 * k)
    lado = min(w, h)
    manchas = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(manchas)
    for _ in range(int(2 + 10 * k)):
        cx, cy = rng.uniform(0, w), rng.uniform(0, h)
        r = rng.uniform(0.02, 0.09) * lado
        d.ellipse([cx - r, cy - r * rng.uniform(0.5, 1), cx + r, cy + r * rng.uniform(0.5, 1)],
                  fill=int(rng.uniform(60, 160) * k))
    manchas = manchas.filter(ImageFilter.GaussianBlur(lado * 0.012))
    tinta = Image.new("RGB", (w, h), (92, 60, 30))
    base = Image.composite(tinta, base, manchas.point(lambda v: int(v * 0.55)))
    # Dobras: linhas claras que atravessam o papel.
    dobras = Image.new("L", (w, h), 0)
    dd = ImageDraw.Draw(dobras)
    if k >= 0.5:
        dd.line([(w / 2 + rng.normal(0, w * 0.02), 0), (w / 2 + rng.normal(0, w * 0.02), h)],
                fill=int(90 * k), width=max(2, lado // 300))
        dd.line([(0, h / 2 + rng.normal(0, h * 0.02)), (w, h / 2 + rng.normal(0, h * 0.02))],
                fill=int(90 * k), width=max(2, lado // 300))
    dobras = dobras.filter(ImageFilter.GaussianBlur(max(1, lado // 600)))
    base = Image.composite(Image.new("RGB", (w, h), (250, 244, 228)), base, dobras)
    # Cantos escurecidos.
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dist = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    vinheta = np.clip((dist - 0.75) * 1.4, 0, 1) * 0.45 * k
    arr = np.asarray(base, dtype=np.float32) * (1 - vinheta[..., None])
    # Grão do papel.
    arr += rng.normal(0, 6 * k, arr.shape[:2])[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
