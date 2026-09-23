"""EXPORTAÇÃO PARCIAL (B3 da empreitada, 2026-09-23 noite): o mapa de um recorte, para
dar aos jogadores.

- **Recorte**: por região nomeada (a caixa das ilhas dela e das regiões filhas, pelo
  cache de ilha, com margem) ou por retângulo (oeste, sul, leste, norte).
- **Camadas**: relevo, cobertura, rios, estradas, rotas, nomes, cidades, grade,
  moldura e elementos (rosa, escala e cartela nos cantos do RECORTE; o monstro vem
  do mundo, se estiver dentro).
- **Versão**: `mestre` (tudo) ou `jogador` (sem o que está marcado
  `visivel_jogador: false`).
- **Saída**: PNG na largura pedida, ou PDF em A4 ou A3 a 300 dpi, deitado ou em pé
  conforme o recorte. A barra de escala é calibrada na latitude central do recorte, e
  diz qual é.
- **Registro**: cada exportação acrescenta uma linha em `dados/exportacoes.jsonl`
  (quando, arquivo, recorte, camadas, versão, destinatário, distorção, resolução,
  commit do repositório e impressão digital dos dados), para o mestre saber o que
  cada jogador recebeu.
"""

from __future__ import annotations

import hashlib
import json
import math
import subprocess
import time
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw

from . import composicao as C
from . import elementos_desenho, renderizador, tipografia

RAIZ_MAPAS = C.RAIZ_MAPAS
PASTA_SAIDA = RAIZ_MAPAS / "render" / "exportacoes"
REGISTRO = RAIZ_MAPAS / "dados" / "exportacoes.jsonl"
PAPEIS_MM = {"A4": (210, 297), "A3": (297, 420)}
MARGEM_PAPEL_MM = 10
COR_PAPEL_FOLHA = (244, 236, 216)
LIMITE_PX = 60_000_000      # acima disto, recusa: é trabalho para o script, fora do servidor


@dataclass
class Opcoes:
    regiao: str | None = None
    retangulo: list | None = None                  # [oeste, sul, leste, norte]
    camadas: list = field(default_factory=lambda: list(C.CAMADAS))
    versao: str = "mestre"
    formato: str = "png"                           # "png" ou "pdf"
    largura_px: int = 2400                         # PNG
    papel: str = "A4"                              # PDF
    dpi: int = 300                                 # PDF
    destinatario: str | None = None
    titulo: str | None = None
    distorcao: dict | None = None                  # {"nivel": 1..5, "mercador": str, "semente": int}
    nome: str | None = None                        # nome do arquivo (sem extensão)


def validar(o: Opcoes) -> None:
    if (o.regiao is None) == (o.retangulo is None):
        raise ValueError("escolha UMA forma de recorte: 'regiao' ou 'retangulo'")
    if o.retangulo is not None:
        if len(o.retangulo) != 4 or not all(isinstance(v, (int, float)) for v in o.retangulo):
            raise ValueError("'retangulo' é [oeste, sul, leste, norte]")
        oeste, sul, leste, norte = o.retangulo
        if not (oeste < leste and sul < norte):
            raise ValueError("'retangulo' precisa de oeste < leste e sul < norte")
    desconhecidas = set(o.camadas) - set(C.CAMADAS)
    if desconhecidas:
        raise ValueError(f"camadas desconhecidas: {sorted(desconhecidas)}")
    if o.versao not in ("mestre", "jogador"):
        raise ValueError("'versao' é 'mestre' ou 'jogador'")
    if o.formato not in ("png", "pdf"):
        raise ValueError("'formato' é 'png' ou 'pdf'")
    if o.formato == "png" and not 200 <= o.largura_px <= 20480:
        raise ValueError("'largura_px' tem que ficar entre 200 e 20480")
    if o.formato == "pdf" and o.papel not in PAPEIS_MM:
        raise ValueError(f"'papel' é um de {list(PAPEIS_MM)}")
    if o.formato == "pdf" and not 72 <= o.dpi <= 600:
        raise ValueError("'dpi' tem que ficar entre 72 e 600")
    if o.distorcao is not None:
        nivel = o.distorcao.get("nivel")
        if isinstance(nivel, bool) or not isinstance(nivel, int) or not 1 <= nivel <= 5:
            raise ValueError("'distorcao.nivel' é inteiro de 1 (mapa de feira) a 5 (fiel)")


def descendentes(regiao: str, regioes: list[dict]) -> set[str]:
    saida, fila = {regiao}, [regiao]
    while fila:
        pai = fila.pop()
        for r in regioes:
            if r.get("pai") == pai and r["id"] not in saida:
                saida.add(r["id"])
                fila.append(r["id"])
    return saida


def recorte_da_regiao(regiao: str, dados: dict, margem: float = 0.06) -> tuple[float, float, float, float]:
    """A caixa das ilhas da região (e das filhas), pelo cache de ilha, com margem."""
    import sys
    sys.path.insert(0, str(RAIZ_MAPAS / "ferramentas"))
    from backend import ilhas
    ids = {r["id"] for r in dados["regioes"]}
    if regiao not in ids:
        raise ValueError(f"região desconhecida: {regiao}")
    alvo = descendentes(regiao, dados["regioes"])
    caixas = []
    if ilhas.existe():
        comps = ilhas.componentes()["componentes"]
        for f in dados["massas"]:
            if f["properties"].get("regiao") in alvo:
                c = ilhas.componente_em(*f["geometry"]["coordinates"])
                if c:
                    caixas.append(comps[str(c)]["caixa"])
    if caixas:
        x0 = min(c[0] for c in caixas); y0 = min(c[1] for c in caixas)
        x1 = max(c[2] for c in caixas); y1 = max(c[3] for c in caixas)
        oeste, leste = (x0 - C.X_MERIDIANO) / C.PPG_OFICIAL, (x1 - C.X_MERIDIANO) / C.PPG_OFICIAL
        norte, sul = (C.Y_EQUADOR - y0) / C.PPG_OFICIAL, (C.Y_EQUADOR - y1) / C.PPG_OFICIAL
    else:
        r = next(r for r in dados["regioes"] if r["id"] == regiao)
        if not r.get("rotulo"):
            raise ValueError(f"a região {regiao} não tem ilha registrada nem rótulo: use um retângulo")
        lon, lat = r["rotulo"]["coordinates"]
        oeste, sul, leste, norte = lon - 6, lat - 6, lon + 6, lat + 6
    dx, dy = (leste - oeste) * margem, (norte - sul) * margem
    lim = C._C["limites_da_tela"]
    return (max(lim["longitude_esquerda"], oeste - dx), max(lim["latitude_base"], sul - dy),
            min(lim["longitude_direita"], leste + dx), min(lim["latitude_topo"], norte + dy))


# --- moldura e elementos de canto ------------------------------------------------------

def _rotulo_grau(v: float, eixo: str) -> str:
    if eixo == "lon":
        return f"{abs(v):g}° {'L' if v > 0 else 'O' if v < 0 else ''}".strip()
    return f"{abs(v):g}° {'N' if v > 0 else 'S' if v < 0 else ''}".strip()


def moldura(mapa: Image.Image, janela, borda: int) -> Image.Image:
    """Moldura de atlas: faixa com segmentos alternados a cada passo da grade, e os
    graus escritos por fora. Aumenta a imagem em `borda` de cada lado."""
    w, h = mapa.size
    folha = Image.new("RGBA", (w + 2 * borda, h + 2 * borda), COR_PAPEL_FOLHA + (255,))
    folha.paste(mapa.convert("RGBA"), (borda, borda))
    d = ImageDraw.Draw(folha)
    faixa = max(4, borda // 4)
    tinta = tipografia.COR_TINTA + (255,)
    branco = tipografia.COR_HALO + (255,)
    x0, y0, x1, y1 = borda - faixa, borda - faixa, borda + w + faixa - 1, borda + h + faixa - 1
    d.rectangle([x0, y0, x1, y1], fill=branco)
    folha.paste(mapa.convert("RGBA"), (borda, borda))
    passo = C._passo_da_grade(janela)
    tam = max(tipografia.TAMANHO_MINIMO_PX, int(borda * 0.32))
    estilo = {"peso": "normal", "maiusculas": False, "espaco": 0.02, "cor": tipografia.COR_TINTA}
    # Segmentos alternados em cima/embaixo (longitude) e dos lados (latitude).
    lons = [janela.oeste] + list(range(math.ceil(janela.oeste / passo) * passo, math.floor(janela.leste) + 1,
                                      passo)) + [janela.leste]
    for i, (a, b) in enumerate(zip(lons[:-1], lons[1:])):
        xa, xb = borda + (a - janela.oeste) * janela.px_por_grau, borda + (b - janela.oeste) * janela.px_por_grau
        cor = tinta if i % 2 == 0 else branco
        d.rectangle([xa, y0, xb, borda - 1], fill=cor)
        d.rectangle([xa, borda + h, xb, y1], fill=cor)
    lats = [janela.norte] + list(range(math.floor(janela.norte / passo) * passo,
                                       math.ceil(janela.sul) - 1, -passo)) + [janela.sul]
    for i, (a, b) in enumerate(zip(lats[:-1], lats[1:])):
        ya, yb = borda + (janela.norte - a) * janela.px_por_grau, borda + (janela.norte - b) * janela.px_por_grau
        cor = tinta if i % 2 == 0 else branco
        d.rectangle([x0, ya, borda - 1, yb], fill=cor)
        d.rectangle([borda + w, ya, x1, yb], fill=cor)
    d.rectangle([x0, y0, x1, y1], outline=tinta, width=max(1, faixa // 5))
    d.rectangle([borda - 1, borda - 1, borda + w, borda + h], outline=tinta, width=1)
    for lon in lons[1:-1]:
        x = borda + (lon - janela.oeste) * janela.px_por_grau
        tipografia.texto_reto(folha, _rotulo_grau(lon, "lon"), x, y0 - tam * 0.9, tam, estilo)
        tipografia.texto_reto(folha, _rotulo_grau(lon, "lon"), x, y1 + tam * 0.9, tam, estilo)
    for lat in lats[1:-1]:
        y = borda + (janela.norte - lat) * janela.px_por_grau
        tipografia.texto_reto(folha, _rotulo_grau(lat, "lat"), x0 - tam * 1.6, y, tam, estilo, angulo=90)
        tipografia.texto_reto(folha, _rotulo_grau(lat, "lat"), x1 + tam * 1.6, y, tam, estilo, angulo=-90)
    return folha


def elementos_de_canto(mapa: Image.Image, janela, bib, titulo: str | None) -> None:
    """Rosa no canto nordeste, escala no sudoeste (calibrada na latitude central do
    recorte) e cartela com o título no noroeste. Tamanho pela imagem, não pelo mundo."""
    w, h = mapa.size
    lado = min(w, h)
    elementos_desenho.desenhar_rosa(mapa, bib, w - lado * 0.1, lado * 0.12, lado * 0.13)
    lat_c = (janela.norte + janela.sul) / 2
    km_px = C.KM_POR_GRAU * math.cos(math.radians(lat_c)) / janela.px_por_grau
    elementos_desenho.desenhar_escala(mapa, lado * 0.2, h - lado * 0.06, lado * 0.3, km_px, lat_c)
    if titulo:
        elementos_desenho.desenhar_cartela(mapa, bib, lado * 0.2, lado * 0.07, lado * 0.34, titulo)


# --- a exportação ----------------------------------------------------------------------

def _relativo(p: Path) -> str:
    try:
        return str(p.relative_to(RAIZ_MAPAS)).replace("\\", "/")
    except ValueError:
        return str(p).replace("\\", "/")


def _impressao_digital() -> dict:
    h = hashlib.sha256()
    for nome in ("areas-pintadas.geojson", "lugares.geojson", "rios.json", "estradas.json", "rotas.json",
                 "regioes.json", "massas.geojson", "nomes.json", "elementos.json"):
        p = RAIZ_MAPAS / "dados" / nome
        if p.exists():
            h.update(nome.encode())
            h.update(p.read_bytes())
    try:
        commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=RAIZ_MAPAS, capture_output=True,
                                text=True, timeout=10).stdout.strip()
    except Exception:
        commit = None
    return {"commit": commit, "dados_sha256": h.hexdigest()[:16]}


def _tamanho_do_mapa(o: Opcoes, oeste, sul, leste, norte) -> tuple[float, int]:
    """(ppg, borda da moldura em px)."""
    larg_g, alt_g = leste - oeste, norte - sul
    if o.formato == "png":
        ppg = o.largura_px / larg_g
        borda = int(o.largura_px * 0.035) if "moldura" in o.camadas else 0
        return ppg, borda
    mm_w, mm_h = PAPEIS_MM[o.papel]
    if larg_g > alt_g:
        mm_w, mm_h = mm_h, mm_w
    px_w, px_h = (int((mm - 2 * MARGEM_PAPEL_MM) / 25.4 * o.dpi) for mm in (mm_w, mm_h))
    borda = int(min(px_w, px_h) * 0.035) if "moldura" in o.camadas else 0
    ppg = min((px_w - 2 * borda) / larg_g, (px_h - 2 * borda) / alt_g)
    return ppg, borda


def exportar(o: Opcoes, dados: dict | None = None, costa=None, bib=None, registrar: bool = True) -> dict:
    validar(o)
    t0 = time.perf_counter()
    dados = dados if dados is not None else C.carregar_dados()
    if o.regiao:
        oeste, sul, leste, norte = recorte_da_regiao(o.regiao, dados)
        titulo = o.titulo or next(r["nome"] for r in dados["regioes"] if r["id"] == o.regiao)
    else:
        oeste, sul, leste, norte = o.retangulo
        titulo = o.titulo
    ppg, borda = _tamanho_do_mapa(o, oeste, sul, leste, norte)
    total_px = (leste - oeste) * ppg * (norte - sul) * ppg
    if total_px > LIMITE_PX:
        raise ValueError(f"recorte grande demais para uma exportação ({total_px / 1e6:.0f} Mpx; limite "
                         f"{LIMITE_PX / 1e6:.0f} Mpx): diminua a largura ou o recorte")
    camadas = frozenset(o.camadas)
    # No recorte, rosa, escala e cartela vão para os cantos; do mundo, só o monstro.
    dados = dict(dados)
    dados["elementos"] = [e for e in dados["elementos"] if e["tipo"] == "monstro"]
    semente = None
    if o.distorcao:
        semente = o.distorcao.get("semente")
        if semente is None:
            semente = int(hashlib.sha256(json.dumps([o.distorcao.get("mercador", ""), o.regiao, o.retangulo],
                                                    sort_keys=True).encode()).hexdigest()[:8], 16)
        o.distorcao = {**o.distorcao, "semente": semente}
    pedido = C.Pedido(oeste, sul, leste, norte, ppg, camadas, o.versao, o.distorcao, titulo)
    bib = bib or renderizador.Biblioteca.carregar(C.RAIZ_MAPAS / "dados" / "simbolos.json")
    mapa, rel = C.compor(pedido, dados, costa, bib)
    janela = C.alinhar(oeste, sul, leste, norte, ppg)
    mapa = mapa.convert("RGBA")
    if "elementos" in camadas:
        elementos_de_canto(mapa, janela, bib, titulo)
    if borda:
        mapa = moldura(mapa, janela, borda)
    mapa = mapa.convert("RGB")
    PASTA_SAIDA.mkdir(parents=True, exist_ok=True)
    carimbo = time.strftime("%Y%m%d-%H%M%S")
    nome = o.nome or f"{carimbo}-{o.regiao or 'recorte'}-{o.versao}" + (
        f"-nivel{o.distorcao['nivel']}" if o.distorcao else "")
    if o.formato == "pdf":
        mm_w, mm_h = PAPEIS_MM[o.papel]
        if mapa.width > mapa.height:
            mm_w, mm_h = mm_h, mm_w
        folha = Image.new("RGB", (int(mm_w / 25.4 * o.dpi), int(mm_h / 25.4 * o.dpi)), (255, 255, 255))
        folha.paste(mapa, ((folha.width - mapa.width) // 2, (folha.height - mapa.height) // 2))
        destino = PASTA_SAIDA / f"{nome}.pdf"
        folha.save(destino, "PDF", resolution=o.dpi)
    else:
        destino = PASTA_SAIDA / f"{nome}.png"
        mapa.save(destino)
    registro = {
        "quando": time.strftime("%Y-%m-%d %H:%M:%S"),
        "arquivo": _relativo(destino),
        "formato": o.formato, "papel": o.papel if o.formato == "pdf" else None,
        "dpi": o.dpi if o.formato == "pdf" else None,
        "recorte": {"regiao": o.regiao, "retangulo": [round(v, 4) for v in (oeste, sul, leste, norte)]},
        "camadas": sorted(camadas), "versao": o.versao, "destinatario": o.destinatario, "titulo": titulo,
        "distorcao": o.distorcao, "px_por_grau": round(ppg, 4), "largura": mapa.width, "altura": mapa.height,
        "escala_na_latitude": round((norte + sul) / 2, 2), "segundos": round(time.perf_counter() - t0, 1),
        **_impressao_digital(),
    }
    if "mentiras" in rel:
        mentiras = destino.with_suffix(".mentiras.json")
        mentiras.write_text(json.dumps(rel["mentiras"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        registro["mentiras"] = _relativo(mentiras)
    if registrar:
        with open(REGISTRO, "a", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(registro, ensure_ascii=False) + "\n")
    return registro
