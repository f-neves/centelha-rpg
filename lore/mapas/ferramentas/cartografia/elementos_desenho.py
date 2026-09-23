"""Desenho dos elementos de cartografia (B2 da empreitada, 2026-09-23 noite): rosa dos
ventos, barra de escala, cartela de título e monstro marinho.

A rosa, a cartela e o monstro são as peças da biblioteca de símbolos. A barra de
escala NÃO é a peça da biblioteca (`barra-de-escala-01` tem as divisões desenhadas
à mão e não pode ser calibrada): ela é desenhada aqui, com divisões alternadas e o
comprimento arredondado para 1, 2 ou 5 vezes uma potência de dez, e escreve a
latitude em que vale.
"""

from __future__ import annotations

import math

from PIL import Image, ImageDraw

from . import renderizador, tipografia

TINTA = tipografia.COR_TINTA


def _sprite(bib, tipo: str, lado: int, indice: int = 0):
    candidatos = sorted(bib.simbolos.get(tipo, []), key=lambda s: s["id"])
    if not candidatos:
        return None
    s = candidatos[min(indice, len(candidatos) - 1)]
    im, _ = bib.sprite(s, max(8, int(lado)), False, 0.0, renderizador.COR_TERRA)
    return im


def _colar_centro(tela: Image.Image, im: Image.Image, cx: float, cy: float) -> None:
    renderizador._colar_cortado(tela, im, math.floor(cx - im.width / 2 + 0.5), math.floor(cy - im.height / 2 + 0.5))


def desenhar_rosa(tela, bib, cx, cy, lado):
    im = _sprite(bib, "rosa-dos-ventos", lado, 1)
    if im is None:
        return
    _colar_centro(tela, im, cx, cy)
    tam = max(tipografia.TAMANHO_MINIMO_PX, int(lado * 0.13))
    tipografia.texto_reto(tela, "N", cx, cy - im.height / 2 - tam * 0.55, tam,
                          {"peso": "negrito", "maiusculas": True, "espaco": 0.0, "cor": TINTA})


def comprimento_redondo(km_alvo: float) -> float:
    """O maior 1, 2 ou 5 vezes uma potência de dez que não passa de `km_alvo`."""
    if km_alvo <= 0:
        return 0.0
    e = 10 ** math.floor(math.log10(km_alvo))
    for m in (5, 2, 1):
        if m * e <= km_alvo:
            return m * e
    return e


def _km(v: float) -> str:
    if v == 0:
        return "0"
    return f"{v:,.0f}".replace(",", ".") if v >= 1 else f"{v:.1f}".replace(".", ",")


def desenhar_escala(tela, cx, cy, largura_px, km_por_px, latitude, escala=1.0):
    """Barra centrada em (cx, cy), de até `largura_px`, com 4 divisões."""
    total_km = comprimento_redondo(largura_px * km_por_px)
    if total_km <= 0:
        return
    comp = total_km / km_por_px
    alt = max(3, int(round(comp * 0.035)))
    x0, y0 = cx - comp / 2, cy - alt / 2
    d = ImageDraw.Draw(tela)
    partes = 4
    for i in range(partes):
        a, b = x0 + comp * i / partes, x0 + comp * (i + 1) / partes
        d.rectangle([a, y0, b, y0 + alt], fill=(TINTA if i % 2 == 0 else tipografia.COR_HALO) + (255,),
                    outline=TINTA + (255,), width=max(1, alt // 6))
    tam = max(tipografia.TAMANHO_MINIMO_PX, int(round(comp * 0.045)))
    estilo = {"peso": "normal", "maiusculas": False, "espaco": 0.02, "cor": TINTA}
    for i in (0, partes // 2, partes):
        valor = total_km * i / partes
        rotulo = _km(valor) + (" km" if i == partes else "")
        tipografia.texto_reto(tela, rotulo, x0 + comp * i / partes, y0 - tam * 0.9, tam, estilo)
    hemi = "N" if latitude >= 0 else "S"
    lat = f"{abs(latitude):.1f}".replace(".", ",")
    tipografia.texto_reto(tela, f"escala verdadeira a {lat}° {hemi}", cx, y0 + alt + tam * 1.1, tam,
                          {"peso": "italico", "maiusculas": False, "espaco": 0.02, "cor": TINTA})


def desenhar_cartela(tela, bib, cx, cy, lado, texto):
    im = _sprite(bib, "cartela", lado, 1)
    if im is None:
        return
    _colar_centro(tela, im, cx, cy)
    if not texto:
        return
    # O miolo liso da cartela-02: de 20% a 80% da largura, de 25% a 75% da altura.
    larg, alt = im.width * 0.58, im.height * 0.42
    estilo = {"peso": "normal", "maiusculas": True, "espaco": 0.3, "cor": TINTA}
    tam = int(alt * 0.8)
    while tam > tipografia.TAMANHO_MINIMO_PX and tipografia.largura(texto, tam, estilo) > larg:
        tam -= 1
    tipografia.texto_reto(tela, texto, cx, cy - im.height * 0.02, tam, estilo)


def desenhar_monstro(tela, bib, cx, cy, lado):
    im = _sprite(bib, "monstro-marinho", lado)
    if im is not None:
        _colar_centro(tela, im, cx, cy)


def desenhar_no_mundo(tela, ctx, elementos) -> None:
    """Os elementos nas posições do mundo (`dados/elementos.json`): é o que o mapa do
    mundo inteiro usa. Elemento não é distorcido (ele não mente sobre o terreno)."""
    from .composicao import KM_POR_GRAU
    for e in elementos:
        lon, lat = e["posicao"]["coordinates"]
        cx, cy = ctx.janela.para_pixel(lon, lat)
        lado = e["tamanho"] * ctx.escala
        if e["tipo"] == "rosa":
            desenhar_rosa(tela, ctx.bib, cx, cy, lado)
        elif e["tipo"] == "cartela":
            desenhar_cartela(tela, ctx.bib, cx, cy, lado, e.get("texto") or "")
        elif e["tipo"] == "monstro":
            desenhar_monstro(tela, ctx.bib, cx, cy, lado)
        elif e["tipo"] == "escala":
            latitude = e.get("latitude_escala") if e.get("latitude_escala") is not None else lat
            km_px = KM_POR_GRAU * math.cos(math.radians(latitude)) / ctx.janela.px_por_grau
            desenhar_escala(tela, cx, cy, lado, km_px, latitude, ctx.escala)
