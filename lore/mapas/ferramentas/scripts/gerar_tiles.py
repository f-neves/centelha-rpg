"""Gera as pirâmides de tiles da costa oficial e do mar (ESPEC-ferramenta.md,
"Arquitetura" e correção 11) a partir de mascaras/costa_10240.png.

PROCESSAMENTO PESADO — regra do CARTOGRAFO.md ("Regras invioláveis"): lê a máscara
oficial inteira (10240x10240). Fechar navegadores e outras sessões do Claude antes de
rodar.

Uso (de dentro de lore/mapas/ferramentas/, com o venv ativado):
    .venv/Scripts/python.exe scripts/gerar_tiles.py --confirmo

Sem --confirmo, o script só imprime o que faria e sai, sem tocar em nada — é a mesma
trava de "avisar antes" aplicada no código, não só na conversa.

Saída: lore/mapas/render/tiles/costa/{z}/{x}/{y}.png e
lore/mapas/render/tiles/mar/{z}/{x}/{y}.png, esquema XYZ padrão (y=0 é a linha de
tiles mais ao norte), zoom 0..MAX_ZOOM (MAX_ZOOM = resolução nativa de 10240px — não
existe zoom mais alto que isso nos arquivos; aproximar além disso é o Leaflet
esticando o tile nativo no navegador, via `maxNativeZoom`, sem gerar bloco ampliado
aqui). Tile 100% transparente não é gravado.

Desenho de memória (correção pedida pelo usuário sobre a primeira versão deste
script): a máscara é aberta em modo "L" (escala de cinza, 1 byte por pixel, ~105 MB
para 10240x10240) — é o modo NATIVO do arquivo (conferido nesta sessão: o PNG não
tem canal alfa de verdade; um `.convert("RGBA")` anterior criava alfa=255 em TODO
pixel, e a "validação em terra" de uma sessão anterior que lia esse alfa sempre dava
verdadeiro, não testava nada — ver ESPEC-dados.md, nota da correção 6 revisada nesta
sessão). 255 = terra, 0 = mar, sem cinza intermediário fora da faixa de
antialiasing bem fina do contorno. Nunca existe uma imagem colorida (RGBA) do mapa
inteiro na memória: cada nível de zoom parte do nível de zoom acima **só em tons de
cinza** (reduzido pela metade, sem reler o arquivo), e a colorização (bege/azul, só
pra essa prévia provisória — o renderizador de verdade é fase futura) acontece
tile a tile, só no recorte de 256x256 que está sendo salvo naquele instante.
"""

import ctypes
import sys
import time
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.coordenadas import MAX_ZOOM, TILE_SIZE  # noqa: E402

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_MASCARA = RAIZ_MAPAS / "mascaras" / "costa_10240.png"
SAIDA_TILES = RAIZ_MAPAS / "render" / "tiles"

COR_TERRA = (222, 214, 184)  # bege, provisório — o renderizador de verdade (fase futura) substitui
COR_MAR = (79, 118, 138)  # azul-acinzentado, provisório
LIMIAR_CINZA_TERRA = 128  # 255=terra, 0=mar (confirmado nesta sessão, ver docstring)


def pico_memoria_mb() -> float:
    """Pico de RAM do processo (Windows: PeakWorkingSetSize via psapi), sem
    depender de nenhum pacote fora da lista aprovada (nada de psutil)."""
    if sys.platform != "win32":
        return -1.0
    import ctypes.wintypes as wintypes

    class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
        _fields_ = [
            ("cb", wintypes.DWORD),
            ("PageFaultCount", wintypes.DWORD),
            ("PeakWorkingSetSize", ctypes.c_size_t),
            ("WorkingSetSize", ctypes.c_size_t),
            ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
            ("QuotaPagedPoolUsage", ctypes.c_size_t),
            ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
            ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
            ("PagefileUsage", ctypes.c_size_t),
            ("PeakPagefileUsage", ctypes.c_size_t),
        ]

    # ctypes.windll usa restype padrão c_int pra GetCurrentProcess, que TRUNCA o
    # pseudo-handle em processo 64-bit e faz GetProcessMemoryInfo falhar calado
    # (achado nesta sessão, testado à parte antes de confiar no número). Carregar as
    # DLLs à mão com restype/argtypes explícitos evita isso.
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    psapi = ctypes.WinDLL("psapi", use_last_error=True)
    kernel32.GetCurrentProcess.restype = wintypes.HANDLE
    psapi.GetProcessMemoryInfo.argtypes = [wintypes.HANDLE, ctypes.c_void_p, wintypes.DWORD]
    psapi.GetProcessMemoryInfo.restype = wintypes.BOOL

    contadores = PROCESS_MEMORY_COUNTERS()
    contadores.cb = ctypes.sizeof(PROCESS_MEMORY_COUNTERS)
    handle = kernel32.GetCurrentProcess()
    ok = psapi.GetProcessMemoryInfo(handle, ctypes.byref(contadores), contadores.cb)
    if not ok:
        return -1.0
    return contadores.PeakWorkingSetSize / (1024 * 1024)


def colorir_tile(tile_cinza: Image.Image) -> tuple[Image.Image, Image.Image]:
    """A partir de um recorte 256x256 em tons de cinza, devolve (tile_costa,
    tile_mar) coloridos — só este pedaço pequeno vira RGBA, nunca o mapa inteiro."""
    e_terra = tile_cinza.point(lambda v: 255 if v >= LIMIAR_CINZA_TERRA else 0)
    e_mar = tile_cinza.point(lambda v: 0 if v >= LIMIAR_CINZA_TERRA else 255)

    tile_costa = Image.new("RGBA", tile_cinza.size, COR_TERRA + (255,))
    tile_costa.putalpha(e_terra)

    tile_mar = Image.new("RGBA", tile_cinza.size, COR_MAR + (255,))
    tile_mar.putalpha(e_mar)

    return tile_costa, tile_mar


def tile_e_transparente(tile: Image.Image) -> bool:
    return tile.getextrema()[3] == (0, 0)


def cortar_e_colorir_nivel(imagem_cinza: Image.Image, zoom: int) -> tuple[int, int]:
    """Corta um nível de zoom (já em tons de cinza, do tamanho certo pra esse zoom)
    em tiles de 256x256, colorindo e gravando cada um nas duas pastas de saída
    (costa/mar). Devolve (tiles_costa_gravados, tiles_mar_gravados)."""
    largura, altura = imagem_cinza.size
    n_col = (largura + TILE_SIZE - 1) // TILE_SIZE
    n_lin = (altura + TILE_SIZE - 1) // TILE_SIZE
    gravados_costa = gravados_mar = 0

    for y in range(n_lin):
        for x in range(n_col):
            caixa = (x * TILE_SIZE, y * TILE_SIZE, (x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE)
            recorte = imagem_cinza.crop(caixa)
            if recorte.size != (TILE_SIZE, TILE_SIZE):
                fundo = Image.new("L", (TILE_SIZE, TILE_SIZE), 0)
                fundo.paste(recorte, (0, 0))
                recorte = fundo

            tile_costa, tile_mar = colorir_tile(recorte)

            if not tile_e_transparente(tile_costa):
                destino = SAIDA_TILES / "costa" / str(zoom) / str(x)
                destino.mkdir(parents=True, exist_ok=True)
                tile_costa.save(destino / f"{y}.png")
                gravados_costa += 1

            if not tile_e_transparente(tile_mar):
                destino = SAIDA_TILES / "mar" / str(zoom) / str(x)
                destino.mkdir(parents=True, exist_ok=True)
                tile_mar.save(destino / f"{y}.png")
                gravados_mar += 1

    return gravados_costa, gravados_mar


def gerar_piramide(imagem_cinza_nativa: Image.Image) -> tuple[int, int]:
    """Desce de MAX_ZOOM (resolução nativa) até 0, reduzindo pela metade a cada
    passo — cada nível reduz o nível ANTERIOR (já reduzido), nunca relê nem
    reamostra a máscara original. Sem imagem colorida do mapa inteiro em nenhum
    momento (ver colorir_tile)."""
    total_costa = total_mar = 0
    imagem = imagem_cinza_nativa
    for zoom in range(MAX_ZOOM, -1, -1):
        t0 = time.time()
        c, m = cortar_e_colorir_nivel(imagem, zoom)
        total_costa += c
        total_mar += m
        print(f"  zoom {zoom}: {c} tiles de costa, {m} de mar ({time.time()-t0:.1f}s, "
              f"pico até agora: {pico_memoria_mb():.0f} MB)")
        if zoom > 0:
            novo_tamanho = (max(1, imagem.width // 2), max(1, imagem.height // 2))
            imagem_reduzida = imagem.resize(novo_tamanho, Image.LANCZOS)
            if imagem is not imagem_cinza_nativa:
                imagem.close()
            imagem = imagem_reduzida
    return total_costa, total_mar


def contar_arquivos_e_tamanho(pasta: Path) -> tuple[int, int]:
    n = 0
    total_bytes = 0
    for caminho in pasta.rglob("*.png"):
        n += 1
        total_bytes += caminho.stat().st_size
    return n, total_bytes


def main() -> None:
    if "--confirmo" not in sys.argv:
        print(__doc__)
        print("Nada foi feito. Rode de novo com --confirmo depois de fechar")
        print("navegadores e outras sessões do Claude, como pede o CARTOGRAFO.md.")
        sys.exit(1)

    if SAIDA_TILES.exists() and any(SAIDA_TILES.iterdir()):
        print(f"A pasta {SAIDA_TILES} já existe e não está vazia.")
        print("Este script nunca sobrescreve: apague ou renomeie a pasta à mão e")
        print("rode de novo. (Sem prompt interativo aqui de propósito — este script")
        print("também roda a partir de um agente, onde input() trava esperando uma")
        print("resposta que nunca chega; a trava é recusar em vez de perguntar.)")
        sys.exit(1)

    t_inicio = time.time()

    print(f"Lendo {CAMINHO_MASCARA} em modo L (tons de cinza, ~105 MB) ...")
    t0 = time.time()
    with Image.open(CAMINHO_MASCARA) as im:
        assert im.mode == "L", f"esperava modo L, veio {im.mode} — conferir a máscara antes de seguir"
        mascara = im.copy()
    print(f"  lida em {time.time()-t0:.1f}s, tamanho {mascara.size}, pico: {pico_memoria_mb():.0f} MB")

    print(f"Gerando pirâmide (zoom {MAX_ZOOM} até 0, {MAX_ZOOM+1} níveis, costa+mar juntos)...")
    total_costa, total_mar = gerar_piramide(mascara)
    mascara.close()

    n_arquivos, tamanho_bytes = contar_arquivos_e_tamanho(SAIDA_TILES)
    tempo_total = time.time() - t_inicio

    print("Pronto.")
    print(f"Tempo total: {tempo_total:.1f}s")
    print(f"Pico de memória do processo: {pico_memoria_mb():.0f} MB")
    print(f"Tiles gravados: {total_costa} de costa + {total_mar} de mar = "
          f"{total_costa + total_mar} (conferido em disco: {n_arquivos})")
    print(f"Tamanho da pasta {SAIDA_TILES}: {tamanho_bytes/1024/1024:.1f} MB")


if __name__ == "__main__":
    main()
