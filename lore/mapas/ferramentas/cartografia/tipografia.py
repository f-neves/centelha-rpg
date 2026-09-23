"""Tipografia de mapa antigo (B1 da empreitada, 2026-09-23 noite).

Texto reto e texto que acompanha uma curva, letra a letra, com halo cor de papel para
ler por cima dos símbolos. Fontes do Windows (Palatino Linotype; Georgia de reserva),
porque nada pode ser instalado. As escolhas são convenção de atlas, e recomendação do
Cartógrafo:

- região e cordilheira: MAIÚSCULAS espaçadas, Palatino;
- mar, rio e rota: itálico, azul-escuro (mar e rio) ou vermelho-terra (rota);
- lugar: Palatino normal; capital em negrito;
- tamanho pelo nível (1 a 5) em `TAMANHO_POR_NIVEL`, em px na resolução oficial.

A curva automática (`espinha`) é a linha do meio de uma forma alongada: a análise de
componentes principais dá o eixo comprido, os pontos são repartidos em fatias ao longo
dele, e a mediana de cada fatia dá um ponto da espinha. "Quando fizer sentido" virou
número: só se a forma for pelo menos `ALONGAMENTO_MINIMO` vezes mais comprida que larga.
"""

from __future__ import annotations

import math
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

PASTA_FONTES = Path("C:/Windows/Fonts")
FONTES = {
    "normal": ("pala.ttf", "georgia.ttf"),
    "italico": ("palai.ttf", "georgiai.ttf"),
    "negrito": ("palab.ttf", "georgiab.ttf"),
}
TAMANHO_POR_NIVEL = {1: 15, 2: 21, 3: 30, 4: 46, 5: 70}
TAMANHO_MINIMO_PX = 9
ALONGAMENTO_MINIMO = 1.7

COR_TINTA = (58, 42, 28)
COR_AGUA = (34, 62, 96)
COR_ROTA = (128, 42, 30)
COR_HALO = (240, 230, 206)


@lru_cache(maxsize=256)
def fonte(peso: str, tamanho: int) -> ImageFont.FreeTypeFont:
    for nome in FONTES[peso]:
        try:
            return ImageFont.truetype(str(PASTA_FONTES / nome), tamanho)
        except OSError:
            continue
    return ImageFont.load_default(size=tamanho)


def estilo_do_nome(tipo_alvo: str, subtipo: str | None = None, capital: bool = False) -> dict:
    """Peso, caixa, espaçamento (em frações do tamanho) e cor por tipo de nome."""
    if tipo_alvo == "regiao" and subtipo in ("mar", "golfo", "baia", "estreito"):
        return {"peso": "italico", "maiusculas": False, "espaco": 0.12, "cor": COR_AGUA}
    if tipo_alvo in ("regiao", "area"):
        return {"peso": "normal", "maiusculas": True, "espaco": 0.35, "cor": COR_TINTA}
    if tipo_alvo == "rio":
        return {"peso": "italico", "maiusculas": False, "espaco": 0.08, "cor": COR_AGUA}
    if tipo_alvo == "rota":
        return {"peso": "italico", "maiusculas": False, "espaco": 0.08, "cor": COR_ROTA}
    if tipo_alvo == "lugar":
        return {"peso": "negrito" if capital else "normal", "maiusculas": False, "espaco": 0.02,
                "cor": COR_TINTA}
    return {"peso": "italico", "maiusculas": False, "espaco": 0.1, "cor": COR_TINTA}   # livre


def tamanho_px(nivel: int, escala: float) -> int:
    return max(TAMANHO_MINIMO_PX, int(round(TAMANHO_POR_NIVEL.get(nivel, 30) * escala)))


def largura(texto: str, tamanho: int, estilo: dict) -> float:
    if estilo["maiusculas"]:
        texto = texto.upper()
    f = fonte(estilo["peso"], tamanho)
    return sum(_larguras(texto, f, estilo["espaco"] * tamanho)) - estilo["espaco"] * tamanho


def _larguras(texto: str, f: ImageFont.FreeTypeFont, espaco_px: float) -> list[float]:
    return [f.getlength(c) + espaco_px for c in texto]


def _glifo(c: str, f, cor, halo, angulo_graus: float) -> Image.Image:
    t = f.size
    lado = int(t * 2.2) + 4
    im = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    borda = max(1, t // 9)
    d.text((lado / 2, lado / 2), c, font=f, fill=cor + (255,), anchor="mm",
           stroke_width=borda, stroke_fill=halo + (200,))
    if angulo_graus:
        im = im.rotate(angulo_graus, resample=Image.BICUBIC)
    return im


def _colar(tela: Image.Image, im: Image.Image, cx: float, cy: float) -> None:
    # floor(+0,5) e não round(): o mesmo texto em dois blocos cai no mesmo pixel.
    x, y = math.floor(cx - im.width / 2 + 0.5), math.floor(cy - im.height / 2 + 0.5)
    x0, y0 = max(0, -x), max(0, -y)
    x1, y1 = min(im.width, tela.width - x), min(im.height, tela.height - y)
    if x1 > x0 and y1 > y0:
        tela.alpha_composite(im.crop((x0, y0, x1, y1)), (x + x0, y + y0))


def texto_reto(tela: Image.Image, texto: str, cx: float, cy: float, tamanho: int, estilo: dict,
               angulo: float = 0.0, halo=COR_HALO) -> tuple[float, float, float, float]:
    """Desenha centrado em (cx, cy). Devolve a caixa aproximada (x0, y0, x1, y1)."""
    if estilo["maiusculas"]:
        texto = texto.upper()
    f = fonte(estilo["peso"], tamanho)
    larg = _larguras(texto, f, estilo["espaco"] * tamanho)
    total = sum(larg) - estilo["espaco"] * tamanho
    rad = math.radians(angulo)
    ux, uy = math.cos(rad), -math.sin(rad)
    pos = -total / 2
    for c, w in zip(texto, larg):
        meio = pos + (w - estilo["espaco"] * tamanho) / 2
        if c.strip():
            _colar(tela, _glifo(c, f, estilo["cor"], halo, angulo), cx + ux * meio, cy + uy * meio)
        pos += w
    meia = total / 2
    return (cx - meia, cy - tamanho, cx + meia, cy + tamanho)


def texto_na_curva(tela: Image.Image, texto: str, pontos: list[tuple[float, float]], tamanho: int,
                   estilo: dict, halo=COR_HALO, deslocamento: float = 0.0) -> bool:
    """Desenha o texto centrado ao longo da linha `pontos` (px), letra a letra. Se o
    texto não cabe, encolhe até caber ou até o mínimo. `deslocamento` afasta o texto
    da linha, para o lado de cima (rio e rota não escrevem em cima do próprio traço).
    Devolve False se a linha é curta demais até para o tamanho mínimo."""
    if estilo["maiusculas"]:
        texto = texto.upper()
    p = np.asarray(pontos, dtype=float)
    if len(p) < 2:
        return False
    if p[-1, 0] < p[0, 0]:
        p = p[::-1]             # sempre da esquerda para a direita: nada de cabeça para baixo
    seg = np.hypot(*np.diff(p, axis=0).T)
    acum = np.concatenate(([0.0], np.cumsum(seg)))
    comprimento = acum[-1]
    while True:
        f = fonte(estilo["peso"], tamanho)
        larg = _larguras(texto, f, estilo["espaco"] * tamanho)
        total = sum(larg) - estilo["espaco"] * tamanho
        if total <= comprimento * 0.95 or tamanho <= TAMANHO_MINIMO_PX:
            break
        tamanho = max(TAMANHO_MINIMO_PX, int(tamanho * 0.9))
    if total > comprimento:
        return False

    def ponto_e_angulo(s):
        s = min(max(s, 0.0), comprimento)
        i = min(len(seg) - 1, int(np.searchsorted(acum, s, side="right") - 1))
        t = 0.0 if seg[i] == 0 else (s - acum[i]) / seg[i]
        x, y = p[i] + (p[i + 1] - p[i]) * t
        # Tangente média numa janela do tamanho da letra: a curva não quebra a palavra.
        a = p[max(0, i)] if s - tamanho < 0 else _em(s - tamanho)
        b = p[-1] if s + tamanho > comprimento else _em(s + tamanho)
        return x, y, math.degrees(math.atan2(-(b[1] - a[1]), b[0] - a[0]))

    def _em(s):
        i = min(len(seg) - 1, int(np.searchsorted(acum, s, side="right") - 1))
        t = 0.0 if seg[i] == 0 else (s - acum[i]) / seg[i]
        return p[i] + (p[i + 1] - p[i]) * t

    pos = (comprimento - total) / 2
    for c, w in zip(texto, larg):
        meio = pos + (w - estilo["espaco"] * tamanho) / 2
        if c.strip():
            x, y, ang = ponto_e_angulo(meio)
            if deslocamento:
                r = math.radians(ang)
                x, y = x - math.sin(r) * deslocamento, y - math.cos(r) * deslocamento
            _colar(tela, _glifo(c, f, estilo["cor"], halo, ang), x, y)
        pos += w
    return True


def espinha(pontos: np.ndarray, fatias: int = 9, miolo: float = 0.8) -> np.ndarray | None:
    """A linha do meio de uma nuvem de pontos (x, y) de uma forma alongada, ou None
    se ela não for alongada o bastante. `miolo`: fração do comprimento usada (o nome
    não encosta nas pontas)."""
    p = np.asarray(pontos, dtype=float)
    if len(p) < 20:
        return None
    centro = p.mean(axis=0)
    q = p - centro
    val, vec = np.linalg.eigh(np.cov(q.T))
    eixo, normal = vec[:, 1], vec[:, 0]
    if val[0] <= 0 or math.sqrt(val[1] / val[0]) < ALONGAMENTO_MINIMO:
        return None
    ao_longo, ao_lado = q @ eixo, q @ normal
    lo, hi = np.quantile(ao_longo, [(1 - miolo) / 2, 1 - (1 - miolo) / 2])
    bordas = np.linspace(lo, hi, fatias + 1)
    saida = []
    for a, b in zip(bordas[:-1], bordas[1:]):
        sel = (ao_longo >= a) & (ao_longo < b)
        if sel.sum() < 3:
            continue
        s, n = (a + b) / 2, float(np.median(ao_lado[sel]))
        saida.append(centro + eixo * s + normal * n)
    if len(saida) < 3:
        return None
    saida = np.asarray(saida)
    # Suaviza (média móvel de 3) para a letra não dançar.
    suave = saida.copy()
    suave[1:-1] = (saida[:-2] + saida[1:-1] + saida[2:]) / 3
    return suave
