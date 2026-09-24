"""Elementos de cartografia no mapa (B2 da empreitada, 2026-09-23 noite): rosa dos
ventos, barra de escala, cartela de título e monstro marinho, todos posicionáveis.

`dados/elementos.json`:

    {"id": "rosa-1", "tipo": "rosa"|"escala"|"cartela"|"monstro",
     "posicao": Point (lon, lat do CENTRO do elemento), "tamanho": px na resolução
     oficial (o lado maior), "texto": str (cartela), "latitude_escala": graus
     (escala), "visivel_jogador": bool, "travado": bool}

**A barra de escala** vale numa latitude só: a projeção é equirretangular sem correção,
então um grau de longitude tem o mesmo tamanho na tela em qualquer latitude, e no
globo ele encolhe com o cosseno dela. A barra é calibrada em `latitude_escala`
(padrão: a latitude central de Waning, medida pelas caixas das três ilhas no cache de
ilha) e escreve essa latitude junto. Nas exportações de recorte, a barra usa a
latitude central do RECORTE (B3).

**Padrões** (`criar_padroes`, recomendação do Cartógrafo): rosa no oceano a leste de
Mére, escala a sudoeste de Syl, cartela entre The Neck e Calin, e o monstro no ponto de
oceano mais longe de qualquer terra dentro da tela (medido na costa reduzida).
"""

import json
import math
import re
from pathlib import Path

from . import coordenadas, operacoes

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO = RAIZ_MAPAS / "dados" / "elementos.json"
RELATIVO = "dados/elementos.json"
TIPOS = ("rosa", "escala", "cartela", "monstro")
TAMANHO_PADRAO = {"rosa": 420, "escala": 900, "cartela": 1100, "monstro": 520}
CAMPOS = ("posicao", "tamanho", "texto", "latitude_escala", "visivel_jogador", "travado")


def carregar() -> dict:
    if not CAMINHO.exists():
        return {"versao_esquema": 1, "elementos": []}
    with open(CAMINHO, encoding="utf-8") as f:
        return json.load(f)


def _garantir_arquivo() -> None:
    if not CAMINHO.exists():
        CAMINHO.parent.mkdir(parents=True, exist_ok=True)
        CAMINHO.write_text(json.dumps({
            "_comentario": "Elementos de cartografia (B2, 2026-09-23): rosa, escala, cartela e monstro. "
                           "Esquema em backend/elementos.py.",
            "versao_esquema": 1, "elementos": []}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8", newline="\n")


def validar(e: dict) -> dict:
    tipo = e.get("tipo")
    if tipo not in TIPOS:
        raise ValueError(f"'tipo' tem que ser um de {list(TIPOS)}")
    pos = e.get("posicao")
    if not (isinstance(pos, dict) and pos.get("type") == "Point" and len(pos.get("coordinates") or []) == 2):
        raise ValueError("'posicao' tem que ser um Point GeoJSON")
    lon, lat = pos["coordinates"]
    lim = coordenadas.carregar_coordenadas()["limites_da_tela"]
    if not (lim["longitude_esquerda"] <= lon <= lim["longitude_direita"]
            and lim["latitude_base"] <= lat <= lim["latitude_topo"]):
        raise ValueError("'posicao' cai fora da tela do mapa")
    tamanho = e.get("tamanho", TAMANHO_PADRAO[tipo])
    if isinstance(tamanho, bool) or not isinstance(tamanho, (int, float)) or not 40 <= tamanho <= 5000:
        raise ValueError("'tamanho' tem que ser um número de 40 a 5000 (px na resolução oficial)")
    texto = e.get("texto")
    if texto is not None and not isinstance(texto, str):
        raise ValueError("'texto' tem que ser texto")
    lat_escala = e.get("latitude_escala")
    if lat_escala is not None and (isinstance(lat_escala, bool) or not isinstance(lat_escala, (int, float))
                                   or not -80 <= lat_escala <= 80):
        raise ValueError("'latitude_escala' tem que ser um número de -80 a 80")
    for campo in ("visivel_jogador", "travado"):
        if not isinstance(e.get(campo, True if campo == "visivel_jogador" else False), bool):
            raise ValueError(f"'{campo}' tem que ser booleano")
    return {"tipo": tipo, "posicao": {"type": "Point", "coordinates": [round(float(lon), 4), round(float(lat), 4)]},
            "tamanho": float(tamanho), "texto": texto, "latitude_escala": lat_escala,
            "visivel_jogador": e.get("visivel_jogador", True), "travado": e.get("travado", False)}


def _achar(dados: dict, id_elemento: str) -> dict:
    for e in dados["elementos"]:
        if e["id"] == id_elemento:
            return e
    raise KeyError(f"elemento desconhecido: {id_elemento}")


CAMADA = "elementos"   # cadeado geral (travas.py), rodada das pendências de 2026-09-23


def criar(e: dict) -> dict:
    from . import travas
    travas.exigir_camada_livre(CAMADA, "criar um elemento")
    limpo = validar(e)
    dados = carregar()
    maior = max([int(m.group(1)) for x in dados["elementos"]
                 if (m := re.match(rf"^{limpo['tipo']}-(\d+)$", x["id"]))] + [0])
    novo = {"id": f"{limpo['tipo']}-{maior + 1}", **limpo}
    _garantir_arquivo()
    operacoes.registrar_operacao("criar_elemento", RELATIVO, {novo["id"]: {"antes": None, "depois": novo}},
                                 chave_lista="elementos")
    return novo


def editar(id_elemento: str, mudancas: dict) -> dict:
    from . import travas
    travas.exigir_camada_livre(CAMADA, "editar este elemento")
    dados = carregar()
    antes = _achar(dados, id_elemento)
    if antes.get("travado") and mudancas.get("travado") is not False:
        from .travas import Travado
        raise Travado("este elemento está travado · não dá para editar")
    desconhecidos = set(mudancas) - set(CAMPOS)
    if desconhecidos:
        raise ValueError(f"campos desconhecidos: {sorted(desconhecidos)}")
    depois = {"id": id_elemento, **validar({**antes, **mudancas})}
    operacoes.registrar_operacao("editar_elemento", RELATIVO, {id_elemento: {"antes": antes, "depois": depois}},
                                 chave_lista="elementos")
    return depois


def apagar(id_elemento: str) -> None:
    from . import travas
    travas.exigir_camada_livre(CAMADA, "apagar este elemento")
    dados = carregar()
    antes = _achar(dados, id_elemento)
    if antes.get("travado"):
        from .travas import Travado
        raise Travado("este elemento está travado · não dá para apagar")
    operacoes.registrar_operacao("apagar_elemento", RELATIVO, {id_elemento: {"antes": antes, "depois": None}},
                                 chave_lista="elementos")


# --- padrões -------------------------------------------------------------------------

def latitude_central_de_waning() -> float:
    """Latitude do meio da caixa das ilhas filhas de Waning, pelo cache de ilha; sem
    cache, a das faixas de `coordenadas.json`."""
    from . import regioes
    filhas = {r["id"] for r in regioes.carregar_regioes()["regioes"] if r.get("pai") == "waning"}
    try:
        from . import ilhas
        if ilhas.existe():
            comps = ilhas.componentes()["componentes"]
            ys = []
            for f in regioes.carregar_massas()["features"]:
                if f["properties"].get("regiao") in filhas:
                    c = ilhas.componente_em(*f["geometry"]["coordinates"])
                    if c:
                        _, y0, _, y1 = comps[str(c)]["caixa"]
                        ys += [y0, y1]
            if ys:
                d = coordenadas.carregar_coordenadas()
                p, r = d["projecao"]["px_por_grau"], d["referencia"]
                return round((r["y_equador_px"] - (min(ys) + max(ys)) / 2) / p, 2)
    except Exception:
        pass
    faixas = coordenadas.carregar_coordenadas()["faixas_de_latitude_das_regioes"]
    norte = max(faixas[k]["lat_norte"] for k in ("Mere", "Syl", "Calin"))
    sul = min(faixas[k]["lat_sul"] for k in ("Mere", "Syl", "Calin"))
    return round((norte + sul) / 2, 2)


def ponto_de_oceano_mais_vazio(reducao: int = 32) -> tuple[float, float]:
    """O ponto de mar mais longe de qualquer terra, dentro da tela (sem a faixa da
    borda). Na costa reduzida `reducao` vezes, dilatando a terra até cobrir tudo."""
    import numpy as np
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
        n = im.width // reducao
        terra = np.asarray(im.convert("L").resize((n, n), Image.BOX)) > 0
    dist = np.where(terra, 0, -1)
    atual = terra.copy()
    passo = 0
    while (dist < 0).any() and passo < n:
        passo += 1
        viz = atual.copy()
        viz[1:] |= atual[:-1]; viz[:-1] |= atual[1:]; viz[:, 1:] |= atual[:, :-1]; viz[:, :-1] |= atual[:, 1:]
        novos = viz & ~atual
        dist[novos] = passo
        atual = viz
    borda = n // 12
    miolo = dist[borda:-borda, borda:-borda]
    y, x = np.unravel_index(int(np.argmax(miolo)), miolo.shape)
    d = coordenadas.carregar_coordenadas()
    p, r = d["projecao"]["px_por_grau"], d["referencia"]
    px, py = (x + borda + 0.5) * reducao, (y + borda + 0.5) * reducao
    return float(round((px - r["x_meridiano_zero_px"]) / p, 3)), float(round((r["y_equador_px"] - py) / p, 3))


def criar_padroes() -> list[dict]:
    """Cria os tipos que ainda não existem, nas posições padrão."""
    existentes = {e["tipo"] for e in carregar()["elementos"]}
    criados = []
    lat_waning = latitude_central_de_waning()
    # Oceano aberto em volta de Waning: rosa a leste de Mére, escala a sudoeste de
    # Syl, cartela entre The Neck e Calin (conferidos contra a costa no teste).
    posicoes = {
        "rosa": (36.0, 22.0),
        "escala": (-14.0, 2.0),
        "cartela": (-12.0, 44.0),
    }
    for tipo in TIPOS:
        if tipo in existentes:
            continue
        if tipo == "monstro":
            lon, lat = ponto_de_oceano_mais_vazio()
        else:
            lon, lat = posicoes[tipo]
        e = {"tipo": tipo, "posicao": {"type": "Point", "coordinates": [lon, lat]}}
        if tipo == "escala":
            e["latitude_escala"] = lat_waning
        if tipo == "cartela":
            e["texto"] = "Uldun"
        criados.append(criar(e))
    return criados


def escala_km_por_px(ppg: float, latitude: float) -> float:
    """Quilômetros por pixel na HORIZONTAL, na latitude dada, numa imagem de `ppg`
    pixels por grau (a vertical vale sempre km_por_grau / ppg)."""
    km_grau = coordenadas.carregar_coordenadas()["projecao"]["km_por_grau"]
    return km_grau * math.cos(math.radians(latitude)) / ppg
