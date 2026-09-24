"""Desenho das rotas de comércio (B4 da empreitada, 2026-09-23 noite).

Estilo diferente da estrada (que é tracejado marrom), escolha do Cartógrafo:
- terrestre: pontilhado vermelho-terra;
- marítima: traço-ponto vermelho-terra, a "rota de navegação" dos portulanos;
- fluvial: pontilhado azul-escuro.
O nome vai pela camada de nomes, acompanhando a curva do traçado.
"""

from __future__ import annotations

import math

from PIL import ImageDraw

from . import tipografia

COR_TERRESTRE = tipografia.COR_ROTA
COR_FLUVIAL = (40, 70, 110)


def _traco_ponto(d, pts, cor, largura, traco, raio, periodo):
    """Traço, ponto, traço, ponto... ao longo da linha (por índice inteiro de período,
    ver `composicao.intervalos_periodicos`)."""
    from .composicao import intervalos_periodicos
    centro = traco + (periodo - traco) / 2
    s = 0.0
    for (ax, ay), (bx, by) in zip(pts[:-1], pts[1:]):
        comp = math.hypot(bx - ax, by - ay)
        if comp > 0:
            for x, y in intervalos_periodicos(s, s + comp, periodo, 0.0, traco):
                u, v = (x - s) / comp, (y - s) / comp
                d.line([(ax + (bx - ax) * u, ay + (by - ay) * u), (ax + (bx - ax) * v, ay + (by - ay) * v)],
                       fill=cor, width=largura)
            for x, _ in intervalos_periodicos(s, s + comp, periodo, centro, centro + 1e-9):
                u = (x - s) / comp
                px, py = ax + (bx - ax) * u, ay + (by - ay) * u
                d.ellipse([px - raio, py - raio, px + raio, py + raio], fill=cor)
        s += comp


def desenhar_rotas(tela, ctx, rotas: list[dict]) -> None:
    from .composicao import _pontilhado
    d = ImageDraw.Draw(tela)
    e = max(ctx.escala * 1.5, 0.3)
    for f in rotas:
        pts = [ctx.px(*c) for c in f["geometry"]["coordinates"]]
        if len(pts) < 2:
            continue
        tipo = f["properties"].get("tipo")
        if tipo == "maritima":
            _traco_ponto(d, pts, COR_TERRESTRE + (255,), max(1, int(round(1.6 * e))), max(4.0, 14 * e),
                         max(1.0, 1.4 * e), max(8.0, 24 * e))
        else:
            cor = COR_FLUVIAL if tipo == "fluvial" else COR_TERRESTRE
            _pontilhado(d, pts, cor + (255,), max(1.0, 1.5 * e), max(3.5, 6 * e))
