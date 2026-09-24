"""Dados de EXEMPLO da Parte B (2026-09-23 noite): lugares com nome, rios, estradas,
rotas de comércio, nomes livres (cordilheira e mar) e os elementos de cartografia,
gravados pela API da ferramenta, para o mapa de teste ter tudo e as camadas novas
poderem ser vistas. Tudo é descartável e está marcado:

- lugares: `"exemplo": true` e nomes provisórios (os nomes do mundo são do usuário);
- rios, estradas e rotas: a palavra "exemplo" no nome ou nas observações;
- os ids criados ficam em `render/analise/exemplos-parte-b.json`, e `--apagar` apaga
  todos pela API (o desfazer também desfaz, um a um).

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/exemplos_parte_b.py            # cria (servidor no ar)
    .venv/Scripts/python.exe scripts/exemplos_parte_b.py --apagar   # apaga o que criou

**Como os rios são traçados** (nada aqui é gerado por máquina no mapa de verdade; é só
exemplo): a distância até o mar é medida na costa reduzida 4 vezes, e o rio desce por
ela, da nascente até a costa, com um desvio lateral suave para serpentear. O servidor
valida cada rio como se fosse desenhado à mão.
"""

import json
import math
import sys
import urllib.error
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))
from backend import coordenadas, lugares as mod_lugares, rios as mod_rios  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
SERVIDOR = "http://127.0.0.1:8420"
REGISTRO = RAIZ_MAPAS / "render" / "analise" / "exemplos-parte-b.json"
REDUCAO = 4

# (id, nome provisório, tipo, importancia, capital, lon, lat, visível ao jogador)
LUGARES = [
    ("exemplo-porto-mere", "Porto das Brumas", "porto", "grande", True, 26.6, 12.5, True),
    ("exemplo-deserto-mere", "Oásis de Sal", "vila", "media", False, 13.0, 19.5, True),
    ("exemplo-norte-mere", "Forte do Passo", "fortaleza", "media", False, 21.0, 31.5, True),
    ("exemplo-sul-mere", "Três Rios", "cidade", "media", False, 15.5, 6.5, True),
    ("exemplo-oculto-mere", "Torre Esquecida", "ruina", "pequena", False, 24.0, 36.8, False),
    ("exemplo-syl-leste", "Vale Verde", "cidade", "grande", True, -3.0, 16.5, True),
    ("exemplo-syl-oeste", "Bosque Alto", "vila", "pequena", False, -15.0, 12.0, True),
    ("exemplo-calin-norte", "Pedra Alta", "cidade", "media", True, 8.5, 38.5, True),
    ("exemplo-calin-porto", "Cais do Norte", "porto", "pequena", False, 12.8, 33.4, True),
]
NOMES_DOS_EXEMPLOS_ANTIGOS = {"exemplo-mere": "Porto Velho", "exemplo-syl": "Vila Úmida",
                              "exemplo-calin": "Forte Calmo", "exemplo-the-neck": "Vila Fria",
                              "exemplo-white-wall": "Marco Branco"}
# Nascentes dos rios (lon, lat) e o nome provisório.
NASCENTES = [("Rio Cinzento", 22.6, 35.0), ("Rio Largo", 16.0, 10.5), ("Rio das Folhas", -9.0, 18.5),
             ("Rio do Forte", 7.5, 37.0), ("Rio Branco", 25.8, 30.8)]


def pedir(metodo, caminho, corpo=None):
    dados = None if corpo is None else json.dumps(corpo).encode("utf-8")
    req = urllib.request.Request(SERVIDOR + caminho, data=dados, method=metodo,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


# --- o campo de distância até o mar ------------------------------------------------

def campo_de_distancia():
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
        n = im.width // REDUCAO
        terra = np.asarray(im.convert("L").resize((n, n), Image.BOX)) >= 128
    dist = np.where(terra, -1, 0).astype(np.int32)
    atual = ~terra
    passo = 0
    while (dist < 0).any() and passo < 2000:
        passo += 1
        viz = atual.copy()
        viz[1:] |= atual[:-1]; viz[:-1] |= atual[1:]; viz[:, 1:] |= atual[:, :-1]; viz[:, :-1] |= atual[:, 1:]
        novos = viz & ~atual
        dist[novos] = passo
        atual = viz
    return dist


def _px(lon, lat):
    d = coordenadas.carregar_coordenadas()
    p, r = d["projecao"]["px_por_grau"], d["referencia"]
    return (r["x_meridiano_zero_px"] + lon * p) / REDUCAO, (r["y_equador_px"] - lat * p) / REDUCAO


def _lonlat(x, y):
    d = coordenadas.carregar_coordenadas()
    p, r = d["projecao"]["px_por_grau"], d["referencia"]
    return (x * REDUCAO - r["x_meridiano_zero_px"]) / p, (r["y_equador_px"] - y * REDUCAO) / p


def tracar_rio(dist, lon, lat, semente):
    """Desce pelo campo de distância até o mar, serpenteando."""
    rng = np.random.default_rng(semente)
    x, y = (int(round(v)) for v in _px(lon, lat))
    caminho = [(x, y)]
    fase = rng.uniform(0, 2 * math.pi)
    for k in range(4000):
        if dist[y, x] <= 1:
            break
        melhor = None
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx or dy:
                    v = dist[y + dy, x + dx] + 0.35 * math.sin(fase + k / 18) * (dx - dy)
                    if melhor is None or v < melhor[0]:
                        melhor = (v, x + dx, y + dy)
        if dist[melhor[2], melhor[1]] >= dist[y, x] and k > 5:
            # platô: segue a descida mais forte sem o desvio
            melhor = min(((dist[y + dy, x + dx], x + dx, y + dy) for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                          if dx or dy), key=lambda t: t[0])
        x, y = melhor[1], melhor[2]
        caminho.append((x, y))
    # A foz: um passo para dentro da água, para a tolerância de 2 km não depender do
    # arredondamento da costa reduzida.
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dist[y + dy, x + dx] == 0:
                caminho.append((x + dx, y + dy))
                break
        else:
            continue
        break
    # Um vértice a cada ~6 px reduzidos (30 km), mais o último.
    pontos = caminho[::6] + [caminho[-1]]
    return [list(_lonlat(px + 0.5, py + 0.5)) for px, py in pontos]


def caminho_em_terra(dist, a, b, folga_graus=6.0):
    """O caminho mais curto por terra (longe da costa: distância >= 2 na grade
    reduzida) entre dois pontos, por busca em largura numa caixa em volta deles, já
    simplificado a um vértice a cada ~5 células. None se não houver."""
    from collections import deque
    (ax, ay), (bx, by) = (tuple(int(round(v)) for v in _px(*a)), tuple(int(round(v)) for v in _px(*b)))
    f = int(folga_graus * coordenadas.carregar_coordenadas()["projecao"]["px_por_grau"] / REDUCAO)
    x0, x1 = max(0, min(ax, bx) - f), min(dist.shape[1] - 1, max(ax, bx) + f)
    y0, y1 = max(0, min(ay, by) - f), min(dist.shape[0] - 1, max(ay, by) + f)
    livre = dist[y0:y1 + 1, x0:x1 + 1] >= 3
    antes = -np.ones(livre.shape, dtype=np.int64)
    ini, fim = (ay - y0, ax - x0), (by - y0, bx - x0)
    # As pontas podem estar na costa (porto): abre um raio de 4 células em volta delas,
    # desde que seja terra.
    terra_local = dist[y0:y1 + 1, x0:x1 + 1] >= 1
    for cy, cx in (ini, fim):
        livre[max(0, cy - 4): cy + 5, max(0, cx - 4): cx + 5] |= terra_local[max(0, cy - 4): cy + 5,
                                                                             max(0, cx - 4): cx + 5]
    if not (livre[ini] and livre[fim]):
        return None
    fila = deque([ini])
    antes[ini] = ini[0] * livre.shape[1] + ini[1]
    while fila:
        y, x = fila.popleft()
        if (y, x) == fim:
            break
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < livre.shape[0] and 0 <= nx < livre.shape[1] and livre[ny, nx] and antes[ny, nx] < 0:
                antes[ny, nx] = y * livre.shape[1] + x
                fila.append((ny, nx))
    if antes[fim] < 0:
        return None
    caminho = [fim]
    while caminho[-1] != ini:
        k = antes[caminho[-1]]
        caminho.append((k // livre.shape[1], k % livre.shape[1]))
    caminho.reverse()
    pontos = caminho[::3] + ([caminho[-1]] if (len(caminho) - 1) % 3 else [])
    saida = [list(_lonlat(x + x0 + 0.5, y + y0 + 0.5)) for y, x in pontos]
    saida[0], saida[-1] = list(a), list(b)
    return saida


def no_ar(lon, lat, raio=0.6):
    """O ponto de terra mais perto de (lon, lat), numa busca em espiral."""
    if mod_lugares.ponto_em_terra(lon, lat):
        return lon, lat
    for r in np.linspace(0.05, raio, 12):
        for a in np.linspace(0, 2 * math.pi, 24, endpoint=False):
            p = (lon + r * math.cos(a), lat + r * math.sin(a))
            if mod_lugares.ponto_em_terra(*p):
                return p
    return None


# --- criação -------------------------------------------------------------------------

def _pontos_de_controle(caminho, a_cada=3):
    """Poucos pontos de controle a partir de um caminho denso."""
    if caminho is None:
        return None
    return caminho[::a_cada] + ([caminho[-1]] if (len(caminho) - 1) % a_cada else [])


def criar() -> int:
    criados = {"lugares": [], "rios": [], "estradas": [], "rotas": [], "nomes": [], "elementos": []}
    pos = {}
    for id_, nome, tipo, imp, capital, lon, lat, visivel in LUGARES:
        p = no_ar(lon, lat)
        if p is None:
            print(f"sem terra perto de {nome}")
            continue
        props = {"tipo": tipo, "nome": nome, "importancia": imp, "capital": capital and tipo == "cidade",
                 "exemplo": True, "visivel_jogador": visivel,
                 "_nota": "lugar de EXEMPLO da Parte B (2026-09-23); nome provisório; apagar depois"}
        s, r = pedir("POST", "/api/lugares", {"id": id_, "lon": p[0], "lat": p[1], "propriedades": props})
        print(f"lugar {id_}: {s}" + ("" if s == 200 else f" {r}"))
        if s == 200:
            criados["lugares"].append(id_)
            pos[id_] = p
    for id_, nome in NOMES_DOS_EXEMPLOS_ANTIGOS.items():
        s, r = pedir("PUT", f"/api/lugares/{id_}", {"propriedades": {"nome": nome}})
        print(f"nome de {id_}: {s}")
    dist = campo_de_distancia()
    for i, (nome, lon, lat) in enumerate(NASCENTES):
        linha = tracar_rio(dist, lon, lat, 50 + i)
        s, r = pedir("POST", "/api/rios", {"id": f"rio-exemplo-{i + 1}", "nome": f"{nome} (exemplo)",
                                           "geometria": {"type": "LineString", "coordinates": linha},
                                           "termina_em": {"tipo": "mar", "id": None}})
        print(f"rio {nome}: {s} ({len(linha)} vértices)" + ("" if s == 200 else f" {str(r)[:160]}"))
        if s == 200:
            criados["rios"].append(f"rio-exemplo-{i + 1}")
    vias = [("exemplo-deserto-mere", "exemplo-porto-mere", "estrada"), ("exemplo-deserto-mere", "exemplo-sul-mere", "estrada"),
            ("exemplo-norte-mere", "exemplo-oculto-mere", "trilha"), ("exemplo-calin-norte", "exemplo-calin-porto", "estrada"),
            ("exemplo-syl-leste", "exemplo-syl-oeste", "estrada")]
    for k, (a, b, tipo) in enumerate(vias):
        if a not in pos or b not in pos:
            continue
        coords = caminho_em_terra(dist, pos[a], pos[b])
        if coords is None:
            print(f"via {a} -> {b}: sem caminho por terra")
            continue
        id_ = f"{tipo}-{9100 + k}"
        s, r = pedir("POST", "/api/estradas", {"id": id_, "tipo": tipo, "nome": f"via de exemplo {k + 1}",
                                               "geometria": {"type": "LineString", "coordinates": coords}})
        print(f"via {a} -> {b}: {s}" + ("" if s == 200 else f" {str(r)[:160]}"))
        if s == 200:
            criados["estradas"].append(id_)
    rotas = [
        ({"nome": "Rota do Estreito", "tipo": "maritima", "mercadorias": ["tecidos", "sal"], "sentido": "ambos",
          "risco": "medio", "sazonalidade": "fecha no inverno", "controlada_por": "guilda dos pilotos",
          "observacoes": "EXEMPLO da Parte B"},
         [pos.get("exemplo-porto-mere", (26.6, 12.5)), (31.0, 18.0), (30.5, 30.0), (20.0, 42.5), (14.5, 36.5),
          pos.get("exemplo-calin-porto", (12.8, 33.4))]),
        ({"nome": "Rota do Sal", "tipo": "terrestre", "mercadorias": ["sal", "tâmaras"], "sentido": "ida",
          "risco": "alto", "observacoes": "EXEMPLO da Parte B"},
         _pontos_de_controle(caminho_em_terra(dist, pos["exemplo-deserto-mere"], pos["exemplo-porto-mere"]))
         if "exemplo-deserto-mere" in pos and "exemplo-porto-mere" in pos else None),
        ({"nome": "Rota dos Contrabandistas", "tipo": "maritima", "mercadorias": ["armas"], "risco": "alto",
          "visivel_jogador": False, "observacoes": "EXEMPLO da Parte B; oculta do jogador"},
         [(-1.0, 4.5), (-8.0, 1.0), (-16.0, 4.0), (-20.0, 9.0)]),
    ]
    for props, pontos in rotas:
        if pontos is None:
            print(f"rota {props['nome']}: sem caminho")
            continue
        pontos = [list(p) for p in pontos]
        # Terrestre: trechos RETOS entre pontos do caminho por terra (a curva de
        # Catmull-Rom poderia cortar uma baía); marítima: curvos.
        trechos = ["reto" if props["tipo"] == "terrestre" else "curvo"] * (len(pontos) - 1)
        s, r = pedir("POST", "/api/rotas", {"propriedades": props,
                                             "controle": {"pontos": pontos, "trechos": trechos}})
        print(f"rota {props['nome']}: {s}" + ("" if s == 200 else f" {str(r)[:200]}"))
        if s == 200:
            criados["rotas"].append(r["rotas"]["features"][-1]["properties"]["id"])
    nomes = [
        {"alvo": {"tipo": "area", "id": "exemplo-montanha-mere-norte"}, "texto": "Montes do Norte"},
        {"alvo": {"tipo": "area", "id": "exemplo-alta-montanha-white-wall"}, "texto": "Serra Branca"},
        {"alvo": {"tipo": "livre", "id": None}, "texto": "Mar Interior", "nivel": 3, "angulo": 55,
         "posicao": {"type": "Point", "coordinates": [6.3, 18.5]}},
        {"alvo": {"tipo": "livre", "id": None}, "texto": "Oceano Ocidental", "nivel": 5,
         "posicao": {"type": "Point", "coordinates": [-28.0, 22.0]}},
        {"alvo": {"tipo": "livre", "id": None}, "texto": "Mar das Névoas", "nivel": 4,
         "posicao": {"type": "Point", "coordinates": [36.0, 30.0]}},
    ]
    for n in nomes:
        s, r = pedir("POST", "/api/nomes", n)
        print(f"nome {n['texto']}: {s}" + ("" if s == 200 else f" {str(r)[:160]}"))
        if s == 200:
            criados["nomes"].append(next(x["id"] for x in r["nomes"]["nomes"] if x.get("texto") == n["texto"]))
    s, r = pedir("POST", "/api/elementos/padrao", {})
    print(f"elementos padrão: {s}")
    if s == 200:
        criados["elementos"] = [e["id"] for e in r["elementos"]]
    REGISTRO.parent.mkdir(parents=True, exist_ok=True)
    REGISTRO.write_text(json.dumps(criados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: len(v) for k, v in criados.items()}))
    return 0


def apagar() -> int:
    criados = json.loads(REGISTRO.read_text(encoding="utf-8"))
    caminhos = {"lugares": "/api/lugares/{}", "rios": "/api/rios/{}", "estradas": "/api/estradas/{}",
                "rotas": "/api/rotas/{}", "nomes": "/api/nomes/{}", "elementos": "/api/elementos/{}"}
    for chave, modelo in caminhos.items():
        for id_ in criados.get(chave, []):
            s, _ = pedir("DELETE", modelo.format(id_))
            print(f"apagar {chave} {id_}: {s}")
    return 0


if __name__ == "__main__":
    sys.exit(apagar() if "--apagar" in sys.argv else criar())
