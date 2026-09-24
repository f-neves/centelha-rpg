"""Composição do mapa (Parte B da empreitada, 2026-09-23 noite): o mapa final de um
recorte qualquer, com as camadas escolhidas, na versão do mestre ou do jogador, com
ou sem distorção, em blocos quando for grande.

**Por que um módulo novo, e não o `renderizador.renderizar`**: lá os símbolos são
sorteados DENTRO da janela, então duas janelas diferentes (o mundo inteiro e um
recorte de Calin, ou dois blocos vizinhos) sorteariam árvores diferentes no mesmo
lugar, e a junção de blocos teria costura. Aqui o sorteio é **planejado por área**,
na janela da própria área (a caixa dela com folga, alinhada à grade global de
pixels): o resultado não depende de qual recorte se pede. O mesmo mapa de Calin sai
com as mesmas árvores sozinho, dentro do mundo inteiro, ou costurado em blocos, e é
isso que o teste de costura confere byte a byte.

**Grade global de pixels**: numa resolução `ppg` (pixels por grau), o pixel global
(0, 0) é o canto noroeste da tela (`limites_da_tela` de `coordenadas.json`). Toda
janela é alinhada a essa grade, e o ruído de borda da etapa 11 já é ancorado no mundo:
máscaras de janelas diferentes coincidem no pedaço comum.

**Ordem das camadas**: papel e mar, cor de cobertura, lagos, costa, símbolos de relevo
e cobertura, rios, estradas, rotas, lugares, nomes, grade, elementos (rosa, escala,
cartela, monstro), moldura.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass, field, replace
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import shape

from . import raster, renderizador, tipografia

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
PPG_OFICIAL = renderizador.PX_POR_GRAU_OFICIAL
CAMADAS = ("relevo", "cobertura", "rios", "estradas", "rotas", "nomes", "cidades", "grade", "moldura",
           "elementos")

COR_RIO = (70, 110, 150)
COR_ESTRADA = (112, 72, 42)
COR_GRADE = (120, 100, 80)


def _coords() -> dict:
    return json.loads((RAIZ_MAPAS / "dados" / "coordenadas.json").read_text(encoding="utf-8"))


_C = _coords()
LON0 = _C["limites_da_tela"]["longitude_esquerda"]
LAT0 = _C["limites_da_tela"]["latitude_topo"]
KM_POR_GRAU = _C["projecao"]["km_por_grau"]
X_MERIDIANO = _C["referencia"]["x_meridiano_zero_px"]
Y_EQUADOR = _C["referencia"]["y_equador_px"]


# --- grade global e janelas ------------------------------------------------------

def alinhar(oeste: float, sul: float, leste: float, norte: float, ppg: float) -> raster.Janela:
    """A janela que cobre o retângulo, com as bordas na grade global de `ppg`."""
    x0 = math.floor((oeste - LON0) * ppg + 1e-9)
    x1 = math.ceil((leste - LON0) * ppg - 1e-9)
    y0 = math.floor((LAT0 - norte) * ppg + 1e-9)
    y1 = math.ceil((LAT0 - sul) * ppg - 1e-9)
    return janela_de_pixels(x0, y0, x1, y1, ppg)


def janela_de_pixels(x0: int, y0: int, x1: int, y1: int, ppg: float) -> raster.Janela:
    return raster.Janela(LON0 + x0 / ppg, LAT0 - y1 / ppg, LON0 + x1 / ppg, LAT0 - y0 / ppg, ppg)


def origem(janela: raster.Janela) -> tuple[int, int]:
    """Pixel global do canto noroeste da janela."""
    return (int(round((janela.oeste - LON0) * janela.px_por_grau)),
            int(round((LAT0 - janela.norte) * janela.px_por_grau)))


def para_pixel_global(lon: float, lat: float, ppg: float) -> tuple[float, float]:
    return (lon - LON0) * ppg, (LAT0 - lat) * ppg


class Costa:
    """`mascaras/costa_10240.png`, lida uma vez (100 MB), e a terra de qualquer janela."""

    def __init__(self, caminho: Path | None = None, matriz: np.ndarray | None = None):
        if matriz is None:
            Image.MAX_IMAGE_PIXELS = None
            with Image.open(caminho or RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
                matriz = np.asarray(im.convert("L"))
        self.m = matriz

    def terra(self, janela: raster.Janela) -> np.ndarray:
        x0 = X_MERIDIANO + janela.oeste * PPG_OFICIAL
        x1 = X_MERIDIANO + janela.leste * PPG_OFICIAL
        y0 = Y_EQUADOR - janela.norte * PPG_OFICIAL
        y1 = Y_EQUADOR - janela.sul * PPG_OFICIAL
        h, w = self.m.shape
        saida = np.zeros((janela.altura, janela.largura), dtype=bool)
        # Pedaço da janela que cai dentro da imagem oficial; fora dela é mar.
        cx0, cy0, cx1, cy1 = max(0.0, x0), max(0.0, y0), min(float(w), x1), min(float(h), y1)
        if cx1 <= cx0 or cy1 <= cy0:
            return saida
        escala = janela.largura / (x1 - x0)
        dx0, dy0 = int(round((cx0 - x0) * escala)), int(round((cy0 - y0) * escala))
        dx1, dy1 = int(round((cx1 - x0) * escala)), int(round((cy1 - y0) * escala))
        if dx1 <= dx0 or dy1 <= dy0:
            return saida
        # Tolerância no arredondamento: na resolução oficial, 7650,000000001 não pode
        # virar mais uma linha (achado no mapa do mundo, que quebrou por uma linha).
        ix0, iy0 = int(math.floor(cx0 + 1e-6)), int(math.floor(cy0 + 1e-6))
        ix1, iy1 = int(math.ceil(cx1 - 1e-6)), int(math.ceil(cy1 - 1e-6))
        pedaco = Image.fromarray(self.m[iy0:iy1, ix0:ix1])
        if abs(escala - 1.0) < 1e-6 and abs(cx0 - ix0) < 1e-6 and abs(cy0 - iy0) < 1e-6:
            reduzido = np.asarray(pedaco)[: dy1 - dy0, : dx1 - dx0]
        else:
            reduzido = np.asarray(pedaco.resize((dx1 - dx0, dy1 - dy0), Image.BOX,
                                                box=(cx0 - ix0, cy0 - iy0, cx1 - ix0, cy1 - iy0)))
        saida[dy0:dy1, dx0:dx1] = reduzido >= 128
        return saida


# --- dados ------------------------------------------------------------------------

def carregar_dados() -> dict:
    """Tudo o que o mapa desenha, lido dos arquivos (os módulos do servidor são a
    fonte de verdade de como ler cada um)."""
    import sys
    sys.path.insert(0, str(RAIZ_MAPAS / "ferramentas"))
    from backend import areas, estradas, lugares, nomes, regioes, rios
    dados = {
        "areas": areas.carregar()["features"],
        "lugares": lugares.carregar()["features"],
        "rios": rios.carregar()["features"],
        "estradas": estradas.carregar()["features"],
        "regioes": regioes.carregar_regioes()["regioes"],
        "massas": regioes.carregar_massas()["features"],
        "nomes": nomes.efetivos(),
        "rotas": [],
        "elementos": [],
    }
    try:
        from backend import rotas
        dados["rotas"] = rotas.carregar()["features"]
    except ImportError:
        pass
    try:
        from backend import elementos
        dados["elementos"] = elementos.carregar()["elementos"]
    except ImportError:
        pass
    return dados


def _visivel(obj: dict) -> bool:
    p = obj.get("properties", obj)
    return p.get("visivel_jogador", True) is not False


def para_jogador(dados: dict) -> dict:
    """A versão do jogador: sai tudo o que está marcado `visivel_jogador: false`
    (lugar, rio, estrada, rota, região, nome, elemento), e o nome de quem saiu."""
    fora = set()
    saida = dict(dados)
    for chave, tipo in (("lugares", "lugar"), ("rios", "rio"), ("estradas", "estrada"), ("rotas", "rota")):
        mantidos = []
        for f in dados[chave]:
            if _visivel(f):
                mantidos.append(f)
            else:
                fora.add((tipo, f["properties"]["id"]))
        saida[chave] = mantidos
    regioes = []
    for r in dados["regioes"]:
        if _visivel(r):
            regioes.append(r)
        else:
            fora.add(("regiao", r["id"]))
    saida["regioes"] = regioes
    saida["nomes"] = [n for n in dados["nomes"] if n.get("visivel_jogador", True)
                      and (n["alvo"]["tipo"], n["alvo"]["id"]) not in fora]
    saida["elementos"] = [e for e in dados["elementos"] if e.get("visivel_jogador", True)]
    return saida


# --- o planejamento dos símbolos, por área -------------------------------------------

@dataclass
class Plano:
    ppg: float
    colocacoes: list          # renderizador.Colocacao, com x, y em pixel GLOBAL
    folga_px: int             # quanto um símbolo pode passar da âncora (para os blocos)


def _janela_da_area(area: dict, ppg: float, folga_graus: float) -> raster.Janela:
    oeste, sul, leste, norte = shape(area["geometry"]).bounds
    return alinhar(oeste - folga_graus, sul - folga_graus, leste + folga_graus, norte + folga_graus, ppg)


def planejar(areas: list[dict], ppg: float, costa: Costa, bib: renderizador.Biblioteca,
             estilo: renderizador.Estilo = renderizador.ESTILO, avisos: list | None = None) -> Plano:
    """Sorteia os símbolos de cada área na janela da própria área. O resultado é o
    mesmo qualquer que seja o recorte pedido depois."""
    escala = ppg / PPG_OFICIAL
    folga_graus = (renderizador.AMPLITUDE_SIMBOLOS_KM * 3 + 50) / KM_POR_GRAU
    lagos_todos = [a for a in areas if a["properties"].get("camada") == "lago"]
    colocacoes = []
    for area in sorted(areas, key=lambda a: a["properties"]["id"]):
        p = area["properties"]
        if p.get("camada") == "lago" or not estilo.misturas.get((p.get("camada"), p.get("valor"))):
            continue
        jan = _janela_da_area(area, ppg, folga_graus)
        terra = costa.terra(jan)
        lagos = renderizador.mascara_de_lagos(lagos_todos, jan, terra, KM_POR_GRAU)
        terra &= ~lagos
        chapada = None
        mascara = raster.rasterizar(area["geometry"], int(p.get("semente_ruido") or 0), jan, KM_POR_GRAU,
                                    amplitude_km=renderizador.AMPLITUDE_SIMBOLOS_KM, terra=terra,
                                    oitavas=renderizador.OITAVAS_SIMBOLOS)
        if estilo.cores:
            _, chapada, com_cor = renderizador.pintar_chao(areas, jan, terra, KM_POR_GRAU, estilo.cores)
            if p["id"] in com_cor:
                mascara = np.where(com_cor[p["id"]], mascara, 0).astype(np.uint8)
        if estilo.relevo_manda and p.get("camada") == "cobertura":
            for outra in areas:
                q = outra["properties"]
                if q.get("camada") == "relevo" and q.get("valor") in renderizador.RELEVO_QUE_MANDA:
                    m = raster.rasterizar(outra["geometry"], int(q.get("semente_ruido") or 0), jan, KM_POR_GRAU,
                                          amplitude_km=renderizador.AMPLITUDE_SIMBOLOS_KM, terra=terra,
                                          oitavas=renderizador.OITAVAS_SIMBOLOS)
                    mascara = np.where(m > 0, 0, mascara).astype(np.uint8)
        ox, oy = origem(jan)
        for c in renderizador.colocar_na_area(area, mascara, terra, bib, escala, estilo, chapada, avisos):
            colocacoes.append(replace(c, x=c.x + ox, y=c.y + oy))
    folga = int(math.ceil(160 * escala * 1.4)) + 4
    return Plano(ppg, colocacoes, folga)


# --- desenho de uma janela -------------------------------------------------------------

@dataclass
class Contexto:
    """O que uma janela precisa para desenhar as camadas vetoriais: a transformação
    de lon/lat para pixel da janela (com a distorção, se houver), a escala, a
    biblioteca e as camadas pedidas."""
    janela: raster.Janela
    escala: float
    bib: renderizador.Biblioteca
    camadas: frozenset
    transformar: object = None     # f(lon, lat) -> (lon, lat), a distorção (B5)
    chao: np.ndarray | None = None

    def px(self, lon: float, lat: float) -> tuple[float, float]:
        if self.transformar is not None:
            lon, lat = self.transformar(lon, lat)
        return self.janela.para_pixel(lon, lat)


def intervalos_periodicos(s0: float, s1: float, periodo: float, a: float, b: float):
    """Os pedaços [k*periodo + a, k*periodo + b] que caem em [s0, s1], para k inteiro.
    Por índice inteiro, e não somando passos: a versão que somava passos travou num
    laço infinito quando o passo ficou menor que a precisão do número (achado ao
    desenhar a primeira estrada de exemplo)."""
    k0 = math.floor((s0 - b) / periodo)
    k1 = math.floor(s1 / periodo)
    for k in range(k0, k1 + 1):
        x, y = max(s0, k * periodo + a), min(s1, k * periodo + b)
        if y > x:
            yield x, y


def _linha_tracejada(d: ImageDraw.ImageDraw, pts, cor, largura, traco, vao):
    """Linha em traços (PIL não tem tracejado), contados a partir do primeiro ponto:
    o mesmo desenho em qualquer bloco."""
    s = 0.0
    for (ax, ay), (bx, by) in zip(pts[:-1], pts[1:]):
        comp = math.hypot(bx - ax, by - ay)
        if comp > 0:
            for x, y in intervalos_periodicos(s, s + comp, traco + vao, 0.0, traco):
                u, v = (x - s) / comp, (y - s) / comp
                d.line([(ax + (bx - ax) * u, ay + (by - ay) * u), (ax + (bx - ax) * v, ay + (by - ay) * v)],
                       fill=cor, width=largura)
        s += comp


def _pontilhado(d: ImageDraw.ImageDraw, pts, cor, raio, espaco):
    s_prox = 0.0
    s = 0.0
    for (ax, ay), (bx, by) in zip(pts[:-1], pts[1:]):
        comp = math.hypot(bx - ax, by - ay)
        while s_prox <= s + comp and comp > 0:
            t = (s_prox - s) / comp
            x, y = ax + (bx - ax) * t, ay + (by - ay) * t
            d.ellipse([x - raio, y - raio, x + raio, y + raio], fill=cor)
            s_prox += espaco
        s += comp


def desenhar_rios(tela: Image.Image, ctx: Contexto, rios: list[dict]) -> None:
    """Linha fina que engrossa da nascente para a foz (de 1,2 a 3 px na resolução
    oficial). Recomendação do Cartógrafo; a largura por afluentes acumulados do ESPEC
    fica para quando houver rede de rios."""
    d = ImageDraw.Draw(tela)
    for f in rios:
        pts = [ctx.px(*c) for c in f["geometry"]["coordinates"]]
        n = len(pts) - 1
        for i, (a, b) in enumerate(zip(pts[:-1], pts[1:])):
            larg = max(1, int(round((1.2 + 1.8 * (i + 0.5) / max(1, n)) * ctx.escala * 1.6)))
            d.line([a, b], fill=COR_RIO + (255,), width=larg, joint="curve")


def desenhar_estradas(tela: Image.Image, ctx: Contexto, estradas: list[dict]) -> None:
    d = ImageDraw.Draw(tela)
    for f in estradas:
        pts = [ctx.px(*c) for c in f["geometry"]["coordinates"]]
        if f["properties"].get("tipo") == "trilha":
            _pontilhado(d, pts, COR_ESTRADA + (255,), max(1.0, 1.1 * ctx.escala * 1.5), max(4.0, 7 * ctx.escala * 1.5))
        else:
            _linha_tracejada(d, pts, COR_ESTRADA + (255,), max(1, int(round(1.8 * ctx.escala * 1.5))),
                             max(4.0, 12 * ctx.escala * 1.5), max(2.0, 5 * ctx.escala * 1.5))


TAMANHO_LUGAR = {"cidade": 40, "vila": 30, "fortaleza": 36, "porto": 34, "ruina": 30, "marco": 30}


def tamanho_do_lugar(p: dict) -> int:
    base = TAMANHO_LUGAR.get(p.get("tipo"), 30)
    base *= {"grande": 1.3, "media": 1.1, "pequena": 0.9}.get(p.get("importancia"), 1.0)
    return int(base * (1.25 if p.get("capital") else 1.0))


def desenhar_lugares(tela: Image.Image, ctx: Contexto, lugares: list[dict]) -> None:
    for f in lugares:
        p = f["properties"]
        candidatos = ctx.bib.simbolos.get(p.get("tipo"), [])
        if not candidatos:
            continue
        # Sempre o mesmo desenho para o mesmo lugar (o primeiro da folha, por id).
        s = sorted(candidatos, key=lambda c: c["id"])[sum(map(ord, p["id"])) % len(candidatos)]
        lado = max(8, int(round(max(tamanho_do_lugar(p), renderizador.pisos().get(p.get("tipo"), 0)) * ctx.escala)))
        x, y = ctx.px(*f["geometry"]["coordinates"])
        im, (ax, ay) = ctx.bib.sprite(s, lado, False, 0.0, renderizador.COR_TERRA)
        renderizador._colar_cortado(tela, im, math.floor(x + 0.5) - ax, math.floor(y + 0.5) - ay)


def _pontos_de_espinha_de_area(area: dict) -> np.ndarray:
    """Amostra o interior de um polígono numa grade de ~0,25 grau, para a espinha."""
    forma = shape(area["geometry"])
    oeste, sul, leste, norte = forma.bounds
    passo = max(0.08, min(leste - oeste, norte - sul) / 40)
    xs, ys = np.meshgrid(np.arange(oeste, leste, passo), np.arange(sul, norte, passo))
    from shapely import contains_xy
    dentro = contains_xy(forma, xs.ravel(), ys.ravel())
    return np.stack([xs.ravel()[dentro], ys.ravel()[dentro]], 1)


def _pontos_de_espinha_de_regiao(regiao_id: str, dados: dict) -> np.ndarray | None:
    """Os pontos da(s) ilha(s) da região, pelo cache de ilha (em 1/16 da resolução
    oficial). Sem cache, None: o nome sai reto."""
    try:
        import sys
        sys.path.insert(0, str(RAIZ_MAPAS / "ferramentas"))
        from backend import ilhas
        if not ilhas.existe():
            return None
        rot = ilhas.rotulos()
        comps = ilhas.componentes()["componentes"]
    except Exception:
        return None
    pontos = []
    for f in dados["massas"]:
        if f["properties"].get("regiao") != regiao_id:
            continue
        c = ilhas.componente_em(*f["geometry"]["coordinates"])
        if not c:
            continue
        x0, y0, x1, y1 = comps[str(c)]["caixa"]
        passo = 16
        sub = np.asarray(rot[y0:y1:passo, x0:x1:passo]) == c
        ys, xs = np.nonzero(sub)
        lon = ((x0 + xs * passo) - X_MERIDIANO) / PPG_OFICIAL
        lat = (Y_EQUADOR - (y0 + ys * passo)) / PPG_OFICIAL
        pontos.append(np.stack([lon, lat], 1))
    return np.concatenate(pontos) if pontos else None


INCLINACAO_MAXIMA = 40.0
# Nome de região e cordilheira que acompanha a espinha cresce até ocupar esta fração
# dela, sem passar de `CRESCIMENTO_MAXIMO` vezes o tamanho do nível.
OCUPACAO_DA_ESPINHA = 0.55
CRESCIMENTO_MAXIMO = 3.0


OCUPACAO_RETA = 0.35


def _largura_da_forma(n: dict, dados: dict) -> float | None:
    """Largura (em graus de longitude) da ilha da região ou da área do nome."""
    tipo = n["alvo"]["tipo"]
    if tipo == "regiao" and n.get("subtipo") not in ("mar", "golfo", "baia", "estreito"):
        pts = _pontos_de_espinha_de_regiao(n["alvo"]["id"], dados)
        if pts is not None and len(pts):
            return float(np.quantile(pts[:, 0], 0.95) - np.quantile(pts[:, 0], 0.05))
    if tipo == "area":
        area = next((a for a in dados["areas"] if a["properties"]["id"] == n["alvo"]["id"]), None)
        if area is not None:
            a, _, c, _ = shape(area["geometry"]).bounds
            return c - a
    return None


def curva_do_nome(n: dict, dados: dict) -> list[tuple[float, float]] | None:
    """A linha (lon, lat) que o nome acompanha, ou None se ele sai reto."""
    if n.get("curva"):
        return [tuple(c) for c in n["curva"]["coordinates"]]
    if n.get("linha"):          # rio e rota: o miolo do próprio traçado
        c = n["linha"]["coordinates"]
        if len(c) < 2:
            return None
        a, b = int(len(c) * 0.25), int(math.ceil(len(c) * 0.75))
        trecho = c[a: max(a + 2, b)]
        return [tuple(p) for p in trecho]
    if n.get("reto"):
        return None
    tipo = n["alvo"]["tipo"]
    pontos = None
    if tipo == "regiao" and n.get("subtipo") not in ("mar", "golfo", "baia", "estreito"):
        pontos = _pontos_de_espinha_de_regiao(n["alvo"]["id"], dados)
    elif tipo == "area":
        area = next((a for a in dados["areas"] if a["properties"]["id"] == n["alvo"]["id"]), None)
        if area is not None:
            pontos = _pontos_de_espinha_de_area(area)
    if pontos is None:
        return None
    e = tipografia.espinha(pontos)
    if e is None:
        return None
    # Espinha em pé demais vira texto em pé demais: acima de INCLINACAO_MAXIMA o nome
    # sai reto (recomendação do Cartógrafo; em atlas o nome deitado lê melhor).
    dx, dy = e[-1, 0] - e[0, 0], e[-1, 1] - e[0, 1]
    if abs(math.degrees(math.atan2(dy, abs(dx) + 1e-12))) > INCLINACAO_MAXIMA:
        return None
    if n.get("posicao"):
        # A espinha passa pelo rótulo: desloca a linha para o centro dela cair nele.
        lon, lat = n["posicao"]["coordinates"]
        centro = e[len(e) // 2]
        e = e + (np.array([lon, lat]) - centro)
    return [tuple(p) for p in e]


def desenhar_nomes(tela: Image.Image, ctx: Contexto, nomes: list[dict], dados: dict) -> None:
    lugares = {f["properties"]["id"]: f for f in dados["lugares"]}
    # Maiores primeiro: o nome pequeno fica por cima do grande quando se cruzam.
    for n in sorted(nomes, key=lambda n: -n["nivel"]):
        tipo = n["alvo"]["tipo"]
        capital = False
        if tipo == "lugar":
            lugar = lugares.get(n["alvo"]["id"])
            if lugar is None:
                continue
            capital = bool(lugar["properties"].get("capital"))
        estilo = tipografia.estilo_do_nome(tipo, n.get("subtipo"), capital)
        tam = tipografia.tamanho_px(n["nivel"], ctx.escala)
        texto = n.get("texto_mostrado") or n["texto"]
        curva = curva_do_nome(n, dados)
        if curva is not None:
            pts = [ctx.px(*p) for p in curva]
            if tipo in ("regiao", "area") and not n.get("curva"):
                comp = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts[:-1], pts[1:]))
                w1 = tipografia.largura(texto, 100, estilo) / 100
                tam = int(max(tam, min(tam * CRESCIMENTO_MAXIMO, comp * OCUPACAO_DA_ESPINHA / max(w1, 1e-6))))
            desloca = tam * 0.9 if tipo in ("rio", "rota") else 0.0
            if tipografia.texto_na_curva(tela, texto, pts, tam, estilo, deslocamento=desloca):
                continue
        largura_da_forma = _largura_da_forma(n, dados)
        if largura_da_forma and tipo in ("regiao", "area"):
            # Nome reto de ilha grande também cresce com ela (até 3 vezes o nível).
            w1 = tipografia.largura(texto, 100, estilo) / 100
            larg_px = largura_da_forma * ctx.janela.px_por_grau
            tam = int(max(tam, min(tam * CRESCIMENTO_MAXIMO, larg_px * OCUPACAO_RETA / max(w1, 1e-6))))
        if n.get("posicao"):
            x, y = ctx.px(*n["posicao"]["coordinates"])
        elif tipo == "area":
            area = next((a for a in dados["areas"] if a["properties"]["id"] == n["alvo"]["id"]), None)
            if area is None:
                continue
            c = shape(area["geometry"]).representative_point()
            x, y = ctx.px(c.x, c.y)
        elif tipo == "lugar":
            lugar = lugares[n["alvo"]["id"]]
            x, y = ctx.px(*lugar["geometry"]["coordinates"])
            lado = tamanho_do_lugar(lugar["properties"]) * ctx.escala
            # À direita do símbolo, na altura do meio dele.
            f = tipografia.fonte(estilo["peso"], tam)
            larg = f.getlength(texto)
            x, y = x + lado * 0.45 + larg / 2 + tam * 0.3, y - lado * 0.45
        else:
            continue
        tipografia.texto_reto(tela, texto, x, y, tam, estilo, n.get("angulo") or 0.0)


def _passo_da_grade(janela: raster.Janela) -> int:
    lado = max(janela.leste - janela.oeste, janela.norte - janela.sul)
    return 2 if lado <= 12 else 5 if lado <= 40 else 10


def desenhar_grade(tela: Image.Image, janela: raster.Janela, escala: float, passo: int | None = None) -> None:
    passo = passo or _passo_da_grade(janela)
    camada = Image.new("RGBA", tela.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    larg = max(1, int(round(escala * 1.2)))
    for lon in range(math.ceil(janela.oeste / passo) * passo, int(math.floor(janela.leste)) + 1, passo):
        x, _ = janela.para_pixel(lon, 0)
        d.line([(x, 0), (x, tela.height)], fill=COR_GRADE + (110,), width=larg)
    for lat in range(math.ceil(janela.sul / passo) * passo, int(math.floor(janela.norte)) + 1, passo):
        _, y = janela.para_pixel(0, lat)
        d.line([(0, y), (tela.width, y)], fill=COR_GRADE + (110,), width=larg)
    tela.alpha_composite(camada)


def _cruza(area: dict, oeste, sul, leste, norte) -> bool:
    a, b, c, d = shape(area["geometry"]).bounds
    return not (c < oeste or a > leste or d < sul or b > norte)


# --- a composição -------------------------------------------------------------------------

@dataclass
class Pedido:
    oeste: float
    sul: float
    leste: float
    norte: float
    ppg: float
    camadas: frozenset = frozenset(CAMADAS)
    versao: str = "mestre"                  # "mestre" ou "jogador"
    distorcao: dict | None = None           # {"nivel": 1..5, "semente": int} (B5)
    titulo: str | None = None               # texto da cartela
    altura_bloco: int = 1536                # linhas por bloco, para caber na memória


def estilo_das_camadas(camadas: frozenset) -> renderizador.Estilo:
    e = renderizador.ESTILO
    misturas = {k: v for k, v in e.misturas.items()
                if (k[0] == "relevo" and "relevo" in camadas) or (k[0] == "cobertura" and "cobertura" in camadas)}
    cores = e.cores if "cobertura" in camadas else {}
    return renderizador.Estilo(e.tipos, misturas, cores, relevo_manda=e.relevo_manda)


def compor_janela(janela: raster.Janela, dados: dict, plano: Plano, costa: Costa, bib, pedido: Pedido,
                  transformar=None, pos_base=None) -> Image.Image:
    """Uma janela (um bloco, ou o recorte inteiro se ele couber), SEM moldura. Desenha
    com folga em volta e corta, para o símbolo e o borrão que vêm do vizinho entrarem."""
    escala = janela.px_por_grau / PPG_OFICIAL
    folga = plano.folga_px
    ox, oy = origem(janela)
    larga = janela_de_pixels(ox - folga, oy - folga, ox + janela.largura + folga, oy + janela.altura + folga,
                             janela.px_por_grau)
    lx, ly = origem(larga)
    estilo = estilo_das_camadas(pedido.camadas)
    terra = costa.terra(larga)
    areas = [a for a in dados["areas"]
             if a["properties"].get("camada") == "lago"
             or (a["properties"].get("camada") in pedido.camadas)]
    lagos = renderizador.mascara_de_lagos(areas, larga, terra, KM_POR_GRAU)
    terra &= ~lagos
    suave = None
    if estilo.cores:
        suave, _, _ = renderizador.pintar_chao(areas, larga, terra, KM_POR_GRAU, estilo.cores)
    tela = renderizador.fundo(terra, suave, lagos)
    del suave
    for c in sorted(plano.colocacoes, key=lambda c: (c.y, c.x, c.simbolo)):
        x, y = c.x - lx, c.y - ly
        if -folga <= x <= larga.largura + folga and -folga <= y <= larga.altura + folga:
            s = bib.por_id(c.simbolo)
            im, (ax, ay) = bib.sprite(s, c.maior_lado, c.espelhar, c.rotacao, c.recheio)
            # floor(x + 0,5), e não round(): o round do Python arredonda o ,5 para o par,
            # e a mesma âncora (Poisson semeia em pixel + 0,5) cairia num pixel num bloco
            # e no vizinho no outro, porque a origem do bloco muda a paridade.
            renderizador._colar_cortado(tela, im, math.floor(x + 0.5) - ax, math.floor(y + 0.5) - ay)
    if pos_base is not None:
        tela = pos_base(tela, larga)
    ctx = Contexto(larga, escala, bib, pedido.camadas, transformar)
    if "rios" in pedido.camadas:
        desenhar_rios(tela, ctx, dados["rios"])
    if "estradas" in pedido.camadas:
        desenhar_estradas(tela, ctx, dados["estradas"])
    if "rotas" in pedido.camadas and dados["rotas"]:
        from . import rotas_desenho
        rotas_desenho.desenhar_rotas(tela, ctx, dados["rotas"])
    if "cidades" in pedido.camadas:
        desenhar_lugares(tela, ctx, dados["lugares"])
    if "nomes" in pedido.camadas:
        nomes = [n for n in dados["nomes"] if n["alvo"]["tipo"] != "lugar" or "cidades" in pedido.camadas]
        desenhar_nomes(tela, ctx, nomes, dados)
    if "grade" in pedido.camadas:
        desenhar_grade(tela, larga, escala, _passo_da_grade(raster.Janela(pedido.oeste, pedido.sul, pedido.leste,
                                                                          pedido.norte, pedido.ppg)))
    if "elementos" in pedido.camadas and dados["elementos"]:
        from . import elementos_desenho
        elementos_desenho.desenhar_no_mundo(tela, ctx, dados["elementos"])
    return tela.crop((folga, folga, folga + janela.largura, folga + janela.altura))


def compor(pedido: Pedido, dados: dict | None = None, costa: Costa | None = None,
           bib: renderizador.Biblioteca | None = None, plano: Plano | None = None,
           avisos: list | None = None) -> tuple[Image.Image, dict]:
    """O recorte inteiro, em blocos de `altura_bloco` linhas. Devolve a imagem (sem
    moldura e sem os elementos de canto, que são do `exportar`) e um relatório."""
    dados = dados if dados is not None else carregar_dados()
    if pedido.versao == "jogador":
        dados = para_jogador(dados)
    costa = costa or Costa()
    bib = bib or renderizador.Biblioteca.carregar(RAIZ_MAPAS / "dados" / "simbolos.json")
    transformar = pos_base = None
    relatorio = {}
    if pedido.distorcao and pedido.distorcao.get("nivel", 5) < 5:
        from . import distorcao
        dados, transformar, pos_base, relatorio["mentiras"] = distorcao.preparar(dados, pedido)
    if plano is None:
        # Só as áreas que podem pôr símbolo no recorte: o plano de cada área não
        # depende das outras, então deixar as de longe de fora não muda nada aqui.
        margem = 3.0
        areas_simbolo = [a for a in dados["areas"]
                         if a["properties"].get("camada") in ("lago", *pedido.camadas)
                         and _cruza(a, pedido.oeste - margem, pedido.sul - margem,
                                    pedido.leste + margem, pedido.norte + margem)]
        plano = planejar(areas_simbolo, pedido.ppg, costa, bib, estilo_das_camadas(pedido.camadas), avisos)
        if pedido.distorcao and pedido.distorcao.get("nivel", 5) < 5:
            from . import distorcao
            plano = distorcao.empobrecer_plano(plano, pedido)
    if "mentiras" in relatorio:
        # A deformação puxa pixels de até `deslocamento_maximo` longe: a folga do bloco
        # cresce na mesma medida, senão a borda do bloco puxaria "nada".
        extra = math.ceil(relatorio["mentiras"]["deslocamento_maximo_km"] / KM_POR_GRAU * pedido.ppg) + 4
        plano = Plano(plano.ppg, plano.colocacoes, plano.folga_px + extra)
    janela = alinhar(pedido.oeste, pedido.sul, pedido.leste, pedido.norte, pedido.ppg)
    ox, oy = origem(janela)
    saida = Image.new("RGB", (janela.largura, janela.altura))
    blocos = 0
    for y0 in range(0, janela.altura, pedido.altura_bloco):
        y1 = min(janela.altura, y0 + pedido.altura_bloco)
        bloco = janela_de_pixels(ox, oy + y0, ox + janela.largura, oy + y1, pedido.ppg)
        saida.paste(compor_janela(bloco, dados, plano, costa, bib, pedido, transformar, pos_base).convert("RGB"),
                    (0, y0))
        blocos += 1
    if "mentiras" in relatorio:
        from . import distorcao
        saida = distorcao.desgastar(saida, pedido.distorcao)
    relatorio.update({"janela": [janela.oeste, janela.sul, janela.leste, janela.norte], "blocos": blocos,
                      "simbolos": len(plano.colocacoes), "largura": janela.largura, "altura": janela.altura})
    return saida, relatorio
