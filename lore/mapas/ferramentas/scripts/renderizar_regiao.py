"""Renderiza o recorte de uma região com mar, costa, cor de fundo das coberturas e os
símbolos espalhados nas áreas pintadas (noite 2 e manhã de 2026-09-23).

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/renderizar_regiao.py mere                 # alta resolução
    .venv/Scripts/python.exe scripts/renderizar_regiao.py mere --rapido        # prévia
    .venv/Scripts/python.exe scripts/renderizar_regiao.py mere --estilo cor    # outro estilo
    .venv/Scripts/python.exe scripts/renderizar_regiao.py --todas
    .venv/Scripts/python.exe scripts/renderizar_regiao.py mere --comparar      # folha lado a lado

**Alta resolução** = a oficial (1,25 km/px, 111,19 px/grau), para a saída final:
`render/recorte-<região>-<estilo>.png` e uma cópia com metade do tamanho,
`recorte-<região>-<estilo>-metade.png`.

**Modo rápido** (`--rapido`) = o mesmo código numa janela `FATOR_RAPIDO` vezes menor
(5 km/px), para escolher paleta e densidade: `recorte-<região>-<estilo>-rapido.png`.
Tudo o que é tamanho (símbolo, raio, piso legível, borrão) escala junto, então a
prévia tem a mesma composição da alta, só com menos pixels. Não é a mesma imagem
reduzida: o Poisson-disc sorteia outros pontos numa grade de outro tamanho.

**Estilos** (`--estilo`, em `cartografia/renderizador.py`): `noite2` (papel só, os
valores da primeira noite), `cor` (cor de fundo por cobertura, densidade da noite 2) e
`cor-densidade` (o padrão: cor e a densidade nova). A imagem da noite 2 original é
`recorte-<região>.png`, sem estilo no nome, e este script não a sobrescreve.

**Piso x densidade** (2026-09-23, noite): antes de renderizar, imprime quanto da faixa
de tamanho pedida de cada tipo fica abaixo do piso medido; depois de cada região,
imprime os avisos de área em que o piso aumentou os símbolos além da folga pedida, ou
em que cabem poucos símbolos, e grava a lista em `render/avisos-<região>-<estilo>[-rapido].json`.

Lê `mascaras/costa_10240.png` inteira uma vez (uns 100 MB na memória).
"""

import json
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from backend import areas as mod_areas, coordenadas  # noqa: E402
from cartografia import raster, renderizador  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
RENDER = RAIZ_MAPAS / "render"
FATOR_RAPIDO = 4

# Recortes em lon/lat (oeste, sul, leste, norte), pelas faixas do CARTOGRAFO.
REGIOES = {
    "mere": (7.0, -1.5, 31.5, 41.5),
    "calin": (-3.0, 24.0, 17.0, 44.0),
    "the-neck": (-34.0, 46.0, -18.0, 57.0),
    "white-wall": (-42.0, 57.0, -10.0, 68.7),
}


def janela_alinhada(oeste, sul, leste, norte, ref, px_por_grau):
    """Encosta a janela na grade de pixels da máscara oficial."""
    x0 = int(round(ref["x_meridiano_zero_px"] + oeste * px_por_grau))
    x1 = int(round(ref["x_meridiano_zero_px"] + leste * px_por_grau))
    y0 = int(round(ref["y_equador_px"] - norte * px_por_grau))
    y1 = int(round(ref["y_equador_px"] - sul * px_por_grau))
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(10240, x1), min(10240, y1)
    janela = raster.Janela(
        (x0 - ref["x_meridiano_zero_px"]) / px_por_grau,
        (ref["y_equador_px"] - y1) / px_por_grau,
        (x1 - ref["x_meridiano_zero_px"]) / px_por_grau,
        (ref["y_equador_px"] - y0) / px_por_grau,
        px_por_grau,
    )
    return janela, (x0, y0, x1, y1)


def janela_e_terra(nome, costa, ref, px_por_grau, rapido):
    janela, (x0, y0, x1, y1) = janela_alinhada(*REGIOES[nome], ref, px_por_grau)
    pedaco = costa[y0:y1, x0:x1]
    if not rapido:
        return janela, pedaco >= 128
    pequena = raster.Janela(janela.oeste, janela.sul, janela.leste, janela.norte,
                            px_por_grau / FATOR_RAPIDO)
    reduzida = Image.fromarray(pedaco).resize((pequena.largura, pequena.altura), Image.BOX)
    return pequena, np.asarray(reduzida) >= 128


def _fonte(tamanho):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", tamanho)
    except OSError:
        return ImageFont.load_default(size=tamanho)


def comparar(nome) -> Path:
    """Folha lado a lado: a imagem da noite 2, a com cor e a com cor e densidade nova,
    todas a partir das versões '-metade' já renderizadas."""
    paineis = [
        ("noite 2 (como estava)", RENDER / f"recorte-{nome}-metade.png"),
        ("cor de fundo", RENDER / f"recorte-{nome}-cor-metade.png"),
        ("cor + densidade nova", RENDER / f"recorte-{nome}-cor-densidade-metade.png"),
    ]
    imagens = []
    for titulo, caminho in paineis:
        if not caminho.exists():
            raise SystemExit(f"falta {caminho.name}: renderize esse estilo antes de comparar")
        with Image.open(caminho) as im:
            imagens.append((titulo, im.convert("RGB")))
    w, h = imagens[0][1].size
    folha = Image.new("RGB", (len(imagens) * (w + 20) + 20, h + 60), (250, 248, 242))
    d = ImageDraw.Draw(folha)
    for i, (titulo, im) in enumerate(imagens):
        folha.paste(im.resize((w, h), Image.LANCZOS), (20 + i * (w + 20), 50))
        d.text((20 + i * (w + 20), 12), titulo, fill=(0, 0, 0), font=_fonte(28))
    destino = RENDER / f"comparacao-{nome}.png"
    folha.save(destino)
    return destino


def main(argv) -> int:
    rapido = "--rapido" in argv
    estilo_nome = argv[argv.index("--estilo") + 1] if "--estilo" in argv else "cor-densidade"
    estilo = renderizador.ESTILOS[estilo_nome]
    livres = [a for i, a in enumerate(argv) if not a.startswith("-") and (i == 0 or argv[i - 1] != "--estilo")]
    nomes = list(REGIOES) if "--todas" in argv else livres or ["mere"]
    if "--comparar" in argv:
        for nome in nomes:
            print(comparar(nome))
        return 0
    t0 = time.perf_counter()
    coords = coordenadas.carregar_coordenadas()
    ref, proj = coords["referencia"], coords["projecao"]
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
        costa = np.asarray(im.convert("L"))
    bib = renderizador.Biblioteca.carregar(RAIZ_MAPAS / "dados" / "simbolos.json")
    todas = mod_areas.carregar()["features"]
    print(f"carregar a costa, a biblioteca e as áreas: {time.perf_counter() - t0:.1f} s")
    comida = {t: f for t, f in renderizador.faixa_comida_pelo_piso(estilo).items() if f > 0}
    if comida:
        print("faixa de tamanho pedida que fica abaixo do piso: "
              + ", ".join(f"{t} {f:.0%}" for t, f in sorted(comida.items(), key=lambda kv: -kv[1])))
    for nome in nomes:
        t = time.perf_counter()
        janela, terra = janela_e_terra(nome, costa, ref, proj["px_por_grau"], rapido)
        assert terra.shape == (janela.altura, janela.largura), (terra.shape, janela)
        avisos = []
        imagem, colocacoes = renderizador.renderizar(todas, janela, terra, bib, proj["km_por_grau"], estilo,
                                                     avisos=avisos)
        base = f"recorte-{nome}-{estilo_nome}" + ("-rapido" if rapido else "")
        destino = RENDER / f"{base}.png"
        imagem.save(destino)
        if not rapido:
            imagem.resize((imagem.width // 2, imagem.height // 2), Image.LANCZOS).save(
                RENDER / f"{base}-metade.png")
        por_tipo = {}
        for c in colocacoes:
            tipo = c.simbolo.rsplit("-", 1)[0]
            por_tipo[tipo] = por_tipo.get(tipo, 0) + 1
        print(f"{nome}: {imagem.width}x{imagem.height} px, {len(colocacoes)} símbolos {por_tipo}, "
              f"{time.perf_counter() - t:.1f} s -> {destino}")
        (RENDER / f"avisos-{base.removeprefix('recorte-')}.json").write_text(
            json.dumps([{**a.__dict__, "texto": a.texto()} for a in avisos], ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8")
        for a in avisos:
            print(f"  AVISO {a.texto()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
