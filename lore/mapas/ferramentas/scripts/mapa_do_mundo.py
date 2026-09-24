"""MAPA DE TESTE do mundo inteiro (C1 da empreitada, 2026-09-23 noite): cor, relevo,
vegetação, rios, estradas, rotas, cidades, nomes, rosa, escala, cartela, monstro e
moldura, na resolução oficial (10240 x 10240, 1,25 km/px) ou menor.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/mapa_do_mundo.py               # oficial, em blocos
    .venv/Scripts/python.exe scripts/mapa_do_mundo.py --fator 4     # 1/4, para ver rápido

PROCESSAMENTO PESADO na resolução oficial: rodar com o servidor PARADO. É feito em
blocos de `--bloco` linhas (1024 por padrão) e juntado; a composição planeja os
símbolos por área, então a junção não tem costura, e o script PROVA isso no fim:
redesenha, como um bloco só, uma faixa que atravessa a junção de dois blocos e compara
byte a byte com a mesma faixa do mapa juntado. O resultado da prova vai para o
relatório (`render/mundo-relatorio.json`).

Saída: `render/mundo-<fator>.png` (e `-metade`), com a moldura; os elementos (rosa,
escala, cartela, monstro) nas posições de `dados/elementos.json`.
"""

import argparse
import json
import math
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))
sys.path.insert(0, str(RAIZ_FERRAMENTA / "scripts"))

from cartografia import composicao as C  # noqa: E402
from cartografia import exportar, renderizador, tipografia  # noqa: E402
from gerar_cache_ilhas import memoria_livre_mb, pico_do_processo_mb  # noqa: E402

Image.MAX_IMAGE_PIXELS = None


def moldura_rgb(mapa: Image.Image, janela, borda: int) -> Image.Image:
    """A moldura de `exportar.moldura`, desenhada direto em RGB (sem cópia RGBA do
    mapa inteiro, que na resolução oficial custaria mais 400 MB)."""
    w, h = mapa.size
    folha = Image.new("RGB", (w + 2 * borda, h + 2 * borda), exportar.COR_PAPEL_FOLHA)
    d = ImageDraw.Draw(folha)
    faixa = max(4, borda // 4)
    tinta, branco = tipografia.COR_TINTA, tipografia.COR_HALO
    x0, y0, x1, y1 = borda - faixa, borda - faixa, borda + w + faixa - 1, borda + h + faixa - 1
    d.rectangle([x0, y0, x1, y1], fill=branco)
    passo = C._passo_da_grade(janela)
    lons = [janela.oeste] + list(range(math.ceil(janela.oeste / passo) * passo, math.floor(janela.leste) + 1,
                                      passo)) + [janela.leste]
    lats = [janela.norte] + list(range(math.floor(janela.norte / passo) * passo,
                                       math.ceil(janela.sul) - 1, -passo)) + [janela.sul]
    for i, (a, b) in enumerate(zip(lons[:-1], lons[1:])):
        xa, xb = borda + (a - janela.oeste) * janela.px_por_grau, borda + (b - janela.oeste) * janela.px_por_grau
        cor = tinta if i % 2 == 0 else branco
        d.rectangle([xa, y0, xb, borda - 1], fill=cor)
        d.rectangle([xa, borda + h, xb, y1], fill=cor)
    for i, (a, b) in enumerate(zip(lats[:-1], lats[1:])):
        ya, yb = borda + (janela.norte - a) * janela.px_por_grau, borda + (janela.norte - b) * janela.px_por_grau
        cor = tinta if i % 2 == 0 else branco
        d.rectangle([x0, ya, borda - 1, yb], fill=cor)
        d.rectangle([borda + w, ya, x1, yb], fill=cor)
    d.rectangle([x0, y0, x1, y1], outline=tinta, width=max(1, faixa // 5))
    folha.paste(mapa, (borda, borda))
    d.rectangle([borda - 1, borda - 1, borda + w, borda + h], outline=tinta, width=1)
    tam = max(tipografia.TAMANHO_MINIMO_PX, int(borda * 0.32))
    estilo = {"peso": "normal", "maiusculas": False, "espaco": 0.02, "cor": tinta}

    def rotulo(texto, cx, cy, angulo=0):
        pedaco = Image.new("RGBA", (tam * (len(texto) + 2), tam * (len(texto) + 2)), (0, 0, 0, 0))
        tipografia.texto_reto(pedaco, texto, pedaco.width / 2, pedaco.height / 2, tam, estilo, angulo)
        folha.paste(pedaco, (int(cx - pedaco.width / 2), int(cy - pedaco.height / 2)), pedaco)

    for lon in lons[1:-1]:
        x = borda + (lon - janela.oeste) * janela.px_por_grau
        rotulo(exportar._rotulo_grau(lon, "lon"), x, y0 - tam * 0.9)
        rotulo(exportar._rotulo_grau(lon, "lon"), x, y1 + tam * 0.9)
    for lat in lats[1:-1]:
        y = borda + (janela.norte - lat) * janela.px_por_grau
        rotulo(exportar._rotulo_grau(lat, "lat"), x0 - tam * 1.6, y, 90)
        rotulo(exportar._rotulo_grau(lat, "lat"), x1 + tam * 1.6, y, -90)
    return folha


def main(argv) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--fator", type=int, default=1, help="1 = oficial (10240 px); 2, 4, 8 = menor")
    p.add_argument("--bloco", type=int, default=1024)
    a = p.parse_args(argv)
    livre = memoria_livre_mb()
    print(f"memória livre antes: {livre} MB")
    if a.fator == 1 and livre < 1800:
        print("menos de 1,8 GB livres: não começo a resolução oficial (use --fator 2)")
        return 2
    t0 = time.perf_counter()
    lim = C._C["limites_da_tela"]
    ppg = C.PPG_OFICIAL / a.fator
    dados = C.carregar_dados()
    costa = C.Costa()
    bib = renderizador.Biblioteca.carregar(C.RAIZ_MAPAS / "dados" / "simbolos.json")
    pedido = C.Pedido(lim["longitude_esquerda"], lim["latitude_base"], lim["longitude_direita"],
                      lim["latitude_topo"], ppg, altura_bloco=a.bloco, titulo="Uldun")
    avisos = []
    plano = C.planejar([x for x in dados["areas"]], ppg, costa, bib, C.estilo_das_camadas(pedido.camadas), avisos)
    t_plano = time.perf_counter() - t0
    mapa, rel = C.compor(pedido, dados, costa, bib, plano)
    t_compor = time.perf_counter() - t0 - t_plano
    janela = C.alinhar(pedido.oeste, pedido.sul, pedido.leste, pedido.norte, ppg)

    # A prova da costura: uma faixa que atravessa a junção entre o 1º e o 2º bloco
    # (no meio de Waning, na altura dela), desenhada como bloco único.
    ox, oy = C.origem(janela)
    y_waning = (C.LAT0 - 22.0) * ppg
    juncao = a.bloco * max(1, min(rel["blocos"] - 1, int(round(y_waning / a.bloco))))
    y0, y1 = max(0, juncao - 200 // a.fator - 60), min(janela.altura, juncao + 200 // a.fator + 60)
    x0, x1 = int(janela.largura * 0.45), int(janela.largura * 0.75)
    faixa = C.janela_de_pixels(ox + x0, oy + y0, ox + x1, oy + y1, ppg)
    sozinha = C.compor_janela(faixa, dados, plano, costa, bib, pedido).convert("RGB")
    igual = sozinha.tobytes() == mapa.crop((x0, y0, x1, y1)).tobytes()
    print(f"prova da costura na junção y={juncao}: {'IGUAL byte a byte' if igual else 'DIFERENTE'}")

    borda = int(janela.largura * 0.035)
    final = moldura_rgb(mapa, janela, borda)
    del mapa
    destino = C.RAIZ_MAPAS / "render" / f"mundo-{a.fator}.png"
    final.save(destino, optimize=False, compress_level=6)
    final.resize((final.width // 2, final.height // 2), Image.LANCZOS).save(
        C.RAIZ_MAPAS / "render" / f"mundo-{a.fator}-metade.png")
    medida = {"quando": time.strftime("%Y-%m-%d %H:%M"), "fator": a.fator, "px_por_grau": round(ppg, 4),
              "largura": final.width, "altura": final.height, "blocos": rel["blocos"], "simbolos": len(plano.colocacoes),
              "segundos_plano": round(t_plano, 1), "segundos_composicao": round(t_compor, 1),
              "segundos_total": round(time.perf_counter() - t0, 1), "livre_antes_mb": livre,
              "pico_do_processo_mb": pico_do_processo_mb(),
              "prova_da_costura": {"juncao_y": juncao, "faixa": [x0, y0, x1, y1], "igual": igual},
              "avisos_piso_densidade": len(avisos), "arquivo": str(destino.relative_to(C.RAIZ_MAPAS))}
    (C.RAIZ_MAPAS / "render" / f"mundo-{a.fator}-relatorio.json").write_text(
        json.dumps(medida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(medida, ensure_ascii=False))
    return 0 if igual else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
