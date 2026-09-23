"""Cache de identidade de ilha (etapa 10, autorizado pelo usuário na empreitada de
2026-09-23 à noite).

**O que é**: o mapa de rótulos dos componentes de terra de `mascaras/costa_10240.png`
(conectividade 4, a mesma da varredura exaustiva registrada no CARTOGRAFO), gerado
UMA vez e guardado fora do git em `render/cache-ilhas/`:

- `rotulos.npy`: um inteiro por pixel (0 = mar, 1..N = componente), lido depois por
  `np.load(..., mmap_mode="r")`, então consultar um ponto não carrega os 200 a 400 MB
  na memória;
- `componentes.json`: por componente, área em pixels e caixa (x0, y0, x1, y1);
- `zonas-100km.npz`: para cada ilha principal de região, a máscara (em 1/4 da
  resolução, 5 km por pixel) dos pontos a menos de 100 km dela. É a regra dos 100 km.

**Os números de componente NÃO são identidade** (decisão antiga do CARTOGRAFO): mudam
se o método mudar. A identidade estável continua sendo o id de `massas.geojson`, que
aponta para a ilha por um ponto; este cache só responde "que ilha está neste ponto" e
"estas duas coisas são a mesma ilha".

**Como é gerado, sem estourar a memória**: rotulagem por CORRIDAS (trechos contínuos
de terra numa linha) e união-busca entre corridas que se tocam em linhas vizinhas. A
máscara é lida em faixas de linhas, e o mapa de rótulos é escrito direto no disco
(`open_memmap`), faixa a faixa: nada do tamanho da imagem inteira fica na memória além
da própria máscara em 1 byte por pixel.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
from PIL import Image

from . import coordenadas

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_COSTA = RAIZ_MAPAS / "mascaras" / "costa_10240.png"
PASTA_CACHE = RAIZ_MAPAS / "render" / "cache-ilhas"
DISTANCIA_REGRA_KM = 100.0
REDUCAO_ZONA = 4   # a zona dos 100 km mora em 1/4 da resolução (5 km por pixel)


# --- geração ---------------------------------------------------------------------

def corridas(linha: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Início e fim (exclusivo) de cada trecho contínuo de verdadeiro numa linha."""
    borda = np.diff(np.concatenate(([0], linha.astype(np.int8), [0])))
    return np.flatnonzero(borda == 1), np.flatnonzero(borda == -1)


def rotular(mascara_por_faixa, altura: int, largura: int, destino) -> tuple[int, dict]:
    """Rotula os componentes (conectividade 4). `mascara_por_faixa` é um iterável de
    blocos (linhas x largura, booleano) que cobrem a imagem de cima para baixo;
    `destino(y0, bloco_de_rotulos)` recebe os rótulos finais, faixa a faixa, numa
    SEGUNDA passada (a primeira só descobre as uniões). Devolve (N, componentes).

    Os rótulos finais são numerados na ordem da primeira corrida de cada componente
    (de cima para baixo, da esquerda para a direita): o mesmo desenho dá os mesmos
    números."""
    pai: list[int] = []

    def achar(i: int) -> int:
        raiz = i
        while pai[raiz] != raiz:
            raiz = pai[raiz]
        while pai[i] != raiz:
            pai[i], i = raiz, pai[i]
        return raiz

    todas_ini, todas_fim, todas_y, rotulo_da_corrida = [], [], [], []
    ant_ini = ant_fim = np.zeros(0, dtype=np.int64)
    ant_rot: list[int] = []
    y = 0
    for bloco in mascara_por_faixa:
        for linha in bloco:
            ini, fim = corridas(linha)
            rots = []
            j = 0
            for a, b in zip(ini.tolist(), fim.tolist()):
                # Avança nas corridas da linha de cima que terminam antes desta começar.
                while j < len(ant_ini) and ant_fim[j] <= a:
                    j += 1
                meu = None
                k = j
                while k < len(ant_ini) and ant_ini[k] < b:
                    r = achar(ant_rot[k])
                    if meu is None:
                        meu = r
                    elif r != meu:
                        # A mais nova aponta para a mais antiga: a raiz fica a menor.
                        if r < meu:
                            pai[meu] = r
                            meu = r
                        else:
                            pai[r] = meu
                    k += 1
                if meu is None:
                    meu = len(pai)
                    pai.append(meu)
                rots.append(meu)
            todas_ini.append(ini)
            todas_fim.append(fim)
            todas_y.append(np.full(len(ini), y, dtype=np.int32))
            rotulo_da_corrida.extend(rots)
            ant_ini, ant_fim, ant_rot = ini, fim, rots
            y += 1
    assert y == altura, (y, altura)

    # Rótulo final por raiz, na ordem da primeira corrida.
    final = {}
    rot_final = np.empty(len(rotulo_da_corrida), dtype=np.int64)
    for i, r in enumerate(rotulo_da_corrida):
        raiz = achar(r)
        if raiz not in final:
            final[raiz] = len(final) + 1
        rot_final[i] = final[raiz]
    n = len(final)

    ini = np.concatenate(todas_ini) if todas_ini else np.zeros(0, dtype=np.int64)
    fim = np.concatenate(todas_fim) if todas_fim else np.zeros(0, dtype=np.int64)
    ys = np.concatenate(todas_y) if todas_y else np.zeros(0, dtype=np.int32)
    area = np.zeros(n + 1, dtype=np.int64)
    np.add.at(area, rot_final, fim - ini)
    x0 = np.full(n + 1, largura, dtype=np.int64); np.minimum.at(x0, rot_final, ini)
    x1 = np.zeros(n + 1, dtype=np.int64); np.maximum.at(x1, rot_final, fim)
    y0 = np.full(n + 1, altura, dtype=np.int64); np.minimum.at(y0, rot_final, ys)
    y1 = np.zeros(n + 1, dtype=np.int64); np.maximum.at(y1, rot_final, ys + 1)
    componentes = {int(c): {"area_px": int(area[c]), "caixa": [int(x0[c]), int(y0[c]), int(x1[c]), int(y1[c])]}
                   for c in range(1, n + 1)}

    # Segunda passada: escreve os rótulos, faixa a faixa, a partir das corridas.
    tipo = np.uint16 if n < 65535 else np.uint32
    ordem = np.argsort(ys, kind="stable")
    ys, ini, fim, rot_final = ys[ordem], ini[ordem], fim[ordem], rot_final[ordem]
    faixa = 1024
    for f0 in range(0, altura, faixa):
        f1 = min(altura, f0 + faixa)
        bloco = np.zeros((f1 - f0, largura), dtype=tipo)
        a, b = np.searchsorted(ys, f0), np.searchsorted(ys, f1)
        for yy, s, e, r in zip(ys[a:b].tolist(), ini[a:b].tolist(), fim[a:b].tolist(), rot_final[a:b].tolist()):
            bloco[yy - f0, s:e] = r
        destino(f0, bloco)
    return n, componentes


def _faixas_da_costa(caminho: Path, faixa: int = 512):
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(caminho) as im:
        im = im.convert("L")
        largura, altura = im.size
        for y0 in range(0, altura, faixa):
            y1 = min(altura, y0 + faixa)
            yield np.asarray(im.crop((0, y0, largura, y1))) >= 128


def gerar(caminho_costa: Path = CAMINHO_COSTA, pasta: Path = PASTA_CACHE,
          principais: dict[str, tuple[float, float]] | None = None) -> dict:
    """Gera o cache inteiro. `principais` = {id_regiao: (lon, lat) da ilha principal};
    sem ele, lê `massas.geojson` (massas `*-principal`)."""
    pasta.mkdir(parents=True, exist_ok=True)
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(caminho_costa) as im:
        largura, altura = im.size
    # A segunda passada escreve num memmap que só nasce quando o primeiro bloco chega
    # (o tipo, 16 ou 32 bits, sai de N, que só se sabe no fim da primeira).
    destino_arquivo = {"mm": None}

    def escrever(y0, bloco):
        if destino_arquivo["mm"] is None:
            destino_arquivo["mm"] = np.lib.format.open_memmap(
                pasta / "rotulos.npy", mode="w+", dtype=bloco.dtype, shape=(altura, largura))
        destino_arquivo["mm"][y0: y0 + bloco.shape[0]] = bloco

    n, componentes = rotular(_faixas_da_costa(caminho_costa), altura, largura, escrever)
    destino_arquivo["mm"].flush()
    del destino_arquivo["mm"]
    (pasta / "componentes.json").write_text(
        json.dumps({"conectividade": 4, "n": n, "largura": largura, "altura": altura,
                    "componentes": componentes}, separators=(",", ":")) + "\n", encoding="utf-8")
    if principais is None:
        principais = principais_de_massas()
    zonas = gerar_zonas(pasta, principais)
    return {"n": n, "zonas": sorted(zonas)}


# --- consulta ---------------------------------------------------------------------

_cache = {}


def _pasta_atual() -> Path:
    return _cache.get("pasta", PASTA_CACHE)


def existe(pasta: Path | None = None) -> bool:
    p = pasta or _pasta_atual()
    return (p / "rotulos.npy").exists() and (p / "componentes.json").exists()


def rotulos(pasta: Path | None = None) -> np.ndarray:
    p = pasta or _pasta_atual()
    chave = ("rotulos", str(p))
    if chave not in _cache:
        _cache[chave] = np.load(p / "rotulos.npy", mmap_mode="r")
    return _cache[chave]


def componentes(pasta: Path | None = None) -> dict:
    p = pasta or _pasta_atual()
    chave = ("componentes", str(p))
    if chave not in _cache:
        _cache[chave] = json.loads((p / "componentes.json").read_text(encoding="utf-8"))
    return _cache[chave]


def esquecer() -> None:
    """Solta os arquivos abertos (o memmap segura o arquivo no Windows)."""
    _cache.clear()


def pixel(lon: float, lat: float) -> tuple[int, int]:
    d = coordenadas.carregar_coordenadas()
    p, r = d["projecao"]["px_por_grau"], d["referencia"]
    return round(r["x_meridiano_zero_px"] + lon * p), round(r["y_equador_px"] - lat * p)


def componente_em(lon: float, lat: float, pasta: Path | None = None) -> int:
    """0 = mar ou fora da tela."""
    rot = rotulos(pasta)
    x, y = pixel(lon, lat)
    if not (0 <= y < rot.shape[0] and 0 <= x < rot.shape[1]):
        return 0
    return int(rot[y, x])


def principais_de_massas() -> dict[str, tuple[float, float]]:
    from . import regioes
    saida = {}
    for f in regioes.carregar_massas()["features"]:
        p = f["properties"]
        if p["id"].endswith("-principal") and p.get("regiao") and p["regiao"] not in saida:
            saida[p["regiao"]] = tuple(f["geometry"]["coordinates"])
    return saida


def _disco(raio: int) -> np.ndarray:
    yy, xx = np.mgrid[-raio: raio + 1, -raio: raio + 1]
    return (xx * xx + yy * yy) <= raio * raio


def _dilatar(m: np.ndarray, raio: int) -> np.ndarray:
    """Dilatação por um disco, somando deslocamentos (sem scipy). O disco de 20 px da
    regra (100 km em 5 km/px) tem uns 1.300 deslocamentos, cada um uma operação OU
    sobre uma máscara pequena: rápido o bastante, e exato no disco."""
    saida = np.zeros_like(m)
    h, w = m.shape
    ys, xs = np.nonzero(_disco(raio))
    for dy, dx in zip((ys - raio).tolist(), (xs - raio).tolist()):
        ya, yb = max(0, dy), min(h, h + dy)
        xa, xb = max(0, dx), min(w, w + dx)
        saida[ya:yb, xa:xb] |= m[ya - dy: yb - dy, xa - dx: xb - dx]
    return saida


def gerar_zonas(pasta: Path, principais: dict[str, tuple[float, float]]) -> dict:
    """Para cada região, a zona dos 100 km em volta da ilha principal, em 1/4 da
    resolução. Só a caixa da ilha (com folga) é lida do mapa de rótulos."""
    rot = rotulos(pasta)
    comps = componentes(pasta)["componentes"]
    km_px = coordenadas.carregar_coordenadas()["projecao"]["km_por_px_latitude"] * REDUCAO_ZONA
    raio = int(math.ceil(DISTANCIA_REGRA_KM / km_px))
    folga = (raio + 2) * REDUCAO_ZONA
    zonas = {}
    for regiao, (lon, lat) in principais.items():
        c = componente_em(lon, lat, pasta)
        if not c:
            continue
        x0, y0, x1, y1 = comps[str(c)]["caixa"]
        x0, y0 = max(0, x0 - folga), max(0, y0 - folga)
        x1, y1 = min(rot.shape[1], x1 + folga), min(rot.shape[0], y1 + folga)
        # Alinha a janela à grade de 1/4.
        x0, y0 = x0 - x0 % REDUCAO_ZONA, y0 - y0 % REDUCAO_ZONA
        dentro = np.asarray(rot[y0:y1, x0:x1]) == c
        h, w = dentro.shape
        h4, w4 = -(-h // REDUCAO_ZONA), -(-w // REDUCAO_ZONA)
        pad = np.zeros((h4 * REDUCAO_ZONA, w4 * REDUCAO_ZONA), dtype=bool)
        pad[:h, :w] = dentro
        pequena = pad.reshape(h4, REDUCAO_ZONA, w4, REDUCAO_ZONA).any(axis=(1, 3))
        zonas[regiao] = {"componente": c, "origem": [x0, y0], "zona": _dilatar(pequena, raio)}
    np.savez_compressed(pasta / "zonas-100km.npz",
                        **{f"{r}__zona": z["zona"] for r, z in zonas.items()},
                        **{f"{r}__meta": np.array([z["componente"], *z["origem"]]) for r, z in zonas.items()})
    _cache.pop(("zonas", str(pasta)), None)
    return zonas


def zonas(pasta: Path | None = None) -> dict:
    p = pasta or _pasta_atual()
    chave = ("zonas", str(p))
    if chave not in _cache:
        saida = {}
        if (p / "zonas-100km.npz").exists():
            with np.load(p / "zonas-100km.npz") as z:
                for nome in z.files:
                    regiao, parte = nome.rsplit("__", 1)
                    saida.setdefault(regiao, {})[parte] = z[nome]
        _cache[chave] = saida
    return _cache[chave]


def regioes_a_100km(c: int, pasta: Path | None = None) -> list[str]:
    """As regiões cuja ilha principal está a menos de 100 km do componente `c`
    (tocando a zona). A própria ilha principal entra na sua região."""
    if not c:
        return []
    rot = rotulos(pasta)
    x0, y0, x1, y1 = componentes(pasta)["componentes"][str(c)]["caixa"]
    saida = []
    for regiao, z in sorted(zonas(pasta).items()):
        comp, ox, oy = (int(v) for v in z["meta"])
        if comp == c:
            saida.append(regiao)
            continue
        zona = z["zona"]
        # Caixa do componente na grade da zona.
        zx0, zy0 = (x0 - ox) // REDUCAO_ZONA, (y0 - oy) // REDUCAO_ZONA
        zx1, zy1 = -(-(x1 - ox) // REDUCAO_ZONA), -(-(y1 - oy) // REDUCAO_ZONA)
        if zx1 <= 0 or zy1 <= 0 or zx0 >= zona.shape[1] or zy0 >= zona.shape[0]:
            continue
        cx0, cy0 = max(zx0, 0), max(zy0, 0)
        cx1, cy1 = min(zx1, zona.shape[1]), min(zy1, zona.shape[0])
        # Pixels do componente dentro dessa caixa, reduzidos a 1/4.
        px0, py0 = ox + cx0 * REDUCAO_ZONA, oy + cy0 * REDUCAO_ZONA
        px1, py1 = min(rot.shape[1], ox + cx1 * REDUCAO_ZONA), min(rot.shape[0], oy + cy1 * REDUCAO_ZONA)
        pedaco = np.asarray(rot[py0:py1, px0:px1]) == c
        h, w = cy1 - cy0, cx1 - cx0
        pad = np.zeros((h * REDUCAO_ZONA, w * REDUCAO_ZONA), dtype=bool)
        pad[: pedaco.shape[0], : pedaco.shape[1]] = pedaco
        reduzido = pad.reshape(h, REDUCAO_ZONA, w, REDUCAO_ZONA).any(axis=(1, 3))
        if (reduzido & zona[cy0:cy1, cx0:cx1]).any():
            saida.append(regiao)
    return saida


def descrever(lon: float, lat: float, pasta: Path | None = None) -> dict:
    """O que o painel mostra ao clicar: a ilha, a massa registrada nela (se houver),
    a área e a região sugerida pela regra dos 100 km."""
    from . import regioes
    c = componente_em(lon, lat, pasta)
    if not c:
        return {"componente": 0, "terra": False}
    info = componentes(pasta)["componentes"][str(c)]
    massas = [f["properties"]["id"] for f in regioes.carregar_massas()["features"]
              if componente_em(*f["geometry"]["coordinates"], pasta=pasta) == c]
    perto = regioes_a_100km(c, pasta)
    km_px = coordenadas.carregar_coordenadas()["projecao"]["km_por_px_latitude"]
    return {
        "componente": c, "terra": True, "massas": massas,
        "area_km2": round(info["area_px"] * km_px * km_px),
        "regioes_a_100km": perto,
        # A regra: automática só com UMA região candidata; duas ou mais é decisão do
        # usuário, como sempre foi.
        "regiao_sugerida": perto[0] if len(perto) == 1 else None,
    }
