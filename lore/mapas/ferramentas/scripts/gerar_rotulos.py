"""Gera a camada "Rótulos" como tiles transparentes (só o texto, fundo
transparente), pela diferença entre fonte/Mapa Teste1.jpg (rotulado) e
fonte/Mapa Teste.jpg (sem rótulo) — mesma tela de 10240px da costa oficial.

Reescrito em 2026-09-23 (a pedido do usuário) para comparar as duas imagens POR
FAIXA HORIZONTAL, em vez de gerar um PNG de 10240x10240 intermediário e comparar
tudo de uma vez: a versão anterior materializava ~8 cópias inteiras de 10240px
além das duas imagens abertas (diff, 3 canais, diferença máxima, máscara, RGBA de
saída — cada uma ~100-300 MB), o que multiplicava o pico de memória sem
necessidade. Agora: as duas imagens de origem são abertas inteiras (isso é
inevitável — são o dado de entrada), mas cada operação de comparação roda numa
FAIXA de `ALTURA_FAIXA` px de altura por vez (256px, o mesmo tamanho de um tile),
e o resultado de cada faixa vira tiles de zoom máximo direto, sem passar por um
PNG de 10240px de saída. Os zooms menores são gerados reduzindo os TILES do zoom
acima (combinando 2x2 e reamostrando para 256x256), nunca reabrindo nem
reconstruindo uma imagem de 10240px inteira — nenhuma cópia de 10240px existe
além das duas imagens de origem, em nenhum momento.

Modo de teste (`--teste`): abre as duas imagens de verdade (é a parte que não dá
pra evitar medir) e processa só as primeiras `FAIXAS_NO_TESTE` faixas (saída numa
pasta de teste separada, nunca a pasta final), mede o pico de memória, e calcula
quanto de memória livre a versão completa provavelmente precisa (o pico não
cresce com o número de faixas processadas — cada faixa libera seus buffers antes
da próxima --, então o pico medido em poucas faixas já reflete o pico da rodada
inteira, dominado pelo custo fixo de abrir as duas imagens). NÃO roda a pirâmide
completa nem grava no destino real. Imprime a recomendação e para.

Uso (de dentro de lore/mapas/ferramentas/, com o venv ativado — só Pillow, nenhuma
automação COM aqui, ao contrário de extrair_ocean_deep.py):
    .venv/Scripts/python.exe scripts/gerar_rotulos.py --teste
    .venv/Scripts/python.exe scripts/gerar_rotulos.py --confirmo

Método por faixa: ImageChops.difference(faixa_rotulada, faixa_sem_rotulo) dá a
diferença absoluta por canal (R, G, B) -- nativo do Pillow, em C. O maior valor
entre os 3 canais, por pixel, vira a "força" da diferença; acima de
LIMIAR_DIFERENCA (provisório, ajustável -- filtra ruído de compressão JPEG sem
perder a borda antialiased do texto) o pixel entra na máscara. Cada tile de saída
usa a cor do pixel ROTULADO (preserva a cor original do texto) com alfa = 255 onde
há diferença, 0 onde não há.

Saída: lore/mapas/render/tiles/rotulos/{z}/{x}/{y}.png (fora do git, mesmo esquema
das outras pirâmides).
"""

import sys
import time
from pathlib import Path

from PIL import Image, ImageChops

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.coordenadas import MAX_ZOOM, TILE_SIZE  # noqa: E402

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_ROTULADO = RAIZ_MAPAS / "fonte" / "Mapa Teste1.jpg"
CAMINHO_SEM_ROTULO = RAIZ_MAPAS / "fonte" / "Mapa Teste.jpg"
SAIDA_TILES = RAIZ_MAPAS / "render" / "tiles" / "rotulos"
SAIDA_TILES_TESTE = RAIZ_MAPAS / "render" / "tiles_teste_rotulos"  # nunca é o destino real
RESOLUCAO_ESPERADA = 10240

LIMIAR_DIFERENCA = 30  # 0-255, provisório — ver docstring do módulo
ALTURA_FAIXA = TILE_SIZE  # 256px -- cada faixa já é exatamente uma linha de tiles
FAIXAS_NO_TESTE = 4  # ~4% da tela (4 de ~40 faixas) -- suficiente pra medir o pico
MARGEM_SEGURANCA = 1.5  # multiplicador sobre o pico medido no teste, pra recomendar


def pico_memoria_mb() -> float:
    """Mesma leitura de scripts/gerar_tiles.py e scripts/extrair_ocean_deep.py
    (PeakWorkingSetSize via psapi, sem depender de psutil)."""
    if sys.platform != "win32":
        return -1.0
    import ctypes
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


def abrir_imagens_de_origem() -> tuple[Image.Image, Image.Image]:
    print(f"Abrindo {CAMINHO_ROTULADO.name} e {CAMINHO_SEM_ROTULO.name} (10240x10240 cada) ...")
    t0 = time.time()
    with Image.open(CAMINHO_ROTULADO) as im_rot_raw, Image.open(CAMINHO_SEM_ROTULO) as im_sem_raw:
        for nome, im in (("rotulado", im_rot_raw), ("sem rótulo", im_sem_raw)):
            if im.size != (RESOLUCAO_ESPERADA, RESOLUCAO_ESPERADA):
                raise RuntimeError(
                    f"{nome} tem {im.size[0]}x{im.size[1]}px, esperava "
                    f"{RESOLUCAO_ESPERADA}x{RESOLUCAO_ESPERADA}px -- parando sem "
                    "gerar nada, conferir a mudanca antes de seguir."
                )
        im_rotulado = im_rot_raw.convert("RGB")
        im_sem_rotulo = im_sem_raw.convert("RGB")
    print(f"  abertas e decodificadas em {time.time()-t0:.1f}s, pico até agora: {pico_memoria_mb():.0f} MB")
    return im_rotulado, im_sem_rotulo


def processar_faixa(im_rotulado: Image.Image, im_sem_rotulo: Image.Image, y0: int, pasta_saida: Path) -> int:
    """Compara só a faixa [y0, y0+ALTURA_FAIXA) das duas imagens JÁ ABERTAS (o
    `.crop()` de uma imagem carregada é uma view barata, não um novo decode) e
    grava os tiles de zoom máximo dessa faixa direto em `pasta_saida`. Nenhum
    buffer desta função passa de ALTURA_FAIXA x RESOLUCAO_ESPERADA -- bem menor
    que uma imagem de 10240x10240 inteira."""
    y1 = min(y0 + ALTURA_FAIXA, RESOLUCAO_ESPERADA)
    caixa = (0, y0, RESOLUCAO_ESPERADA, y1)
    faixa_rot = im_rotulado.crop(caixa)
    faixa_sem = im_sem_rotulo.crop(caixa)

    diff = ImageChops.difference(faixa_rot, faixa_sem)
    r, g, b = diff.split()
    diferenca_maxima = ImageChops.lighter(ImageChops.lighter(r, g), b)
    mascara = diferenca_maxima.point(lambda v: 255 if v > LIMIAR_DIFERENCA else 0)

    faixa_rgba = faixa_rot.convert("RGBA")
    faixa_rgba.putalpha(mascara)

    linha_tile = y0 // TILE_SIZE
    n_col = (RESOLUCAO_ESPERADA + TILE_SIZE - 1) // TILE_SIZE
    gravados = 0
    for col in range(n_col):
        x0 = col * TILE_SIZE
        tile = faixa_rgba.crop((x0, 0, x0 + TILE_SIZE, y1 - y0))
        if tile.size != (TILE_SIZE, TILE_SIZE):
            fundo = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), (0, 0, 0, 0))
            fundo.paste(tile, (0, 0))
            tile = fundo
        if tile.getextrema()[3] == (0, 0):
            continue
        destino = pasta_saida / str(MAX_ZOOM) / str(col)
        destino.mkdir(parents=True, exist_ok=True)
        tile.save(destino / f"{linha_tile}.png")
        gravados += 1
    return gravados


def reduzir_piramide_a_partir_dos_tiles(pasta_saida: Path) -> None:
    """Gera os zooms MAX_ZOOM-1 .. 0 combinando 2x2 tiles do zoom acima e
    reamostrando para TILE_SIZE -- nunca reconstrói uma imagem de 10240px, só
    manipula canvases de até 2*TILE_SIZE (512px), tile a tile."""
    for zoom in range(MAX_ZOOM, 0, -1):
        zoom_novo = zoom - 1
        pasta_origem = pasta_saida / str(zoom)
        if not pasta_origem.exists():
            print(f"  zoom {zoom_novo}: 0 tiles (zoom {zoom} vazio, nada pra reduzir)")
            continue

        pares_destino = set()
        for pasta_col in pasta_origem.iterdir():
            if not pasta_col.is_dir():
                continue
            col = int(pasta_col.name)
            for arquivo in pasta_col.glob("*.png"):
                lin = int(arquivo.stem)
                pares_destino.add((col // 2, lin // 2))

        gravados = 0
        for col_novo, lin_novo in pares_destino:
            canvas = Image.new("RGBA", (TILE_SIZE * 2, TILE_SIZE * 2), (0, 0, 0, 0))
            algum = False
            for dcol in (0, 1):
                for dlin in (0, 1):
                    caminho = pasta_origem / str(col_novo * 2 + dcol) / f"{lin_novo * 2 + dlin}.png"
                    if caminho.exists():
                        with Image.open(caminho) as t:
                            canvas.paste(t, (dcol * TILE_SIZE, dlin * TILE_SIZE))
                        algum = True
            if not algum:
                continue
            reduzido = canvas.resize((TILE_SIZE, TILE_SIZE), Image.LANCZOS)
            if reduzido.getextrema()[3] == (0, 0):
                continue
            destino = pasta_saida / str(zoom_novo) / str(col_novo)
            destino.mkdir(parents=True, exist_ok=True)
            reduzido.save(destino / f"{lin_novo}.png")
            gravados += 1
        print(f"  zoom {zoom_novo}: {gravados} tiles (reduzido de zoom {zoom})")


def main() -> None:
    args = sys.argv[1:]
    teste = "--teste" in args
    confirmo = "--confirmo" in args

    if not teste and not confirmo:
        print(__doc__)
        print("Nada foi feito. Rode com --teste primeiro (mede memória, não mexe no")
        print("destino real) ou com --confirmo (roda tudo) depois de saber quanto precisa.")
        sys.exit(1)

    if confirmo:
        pasta_saida = SAIDA_TILES
        if pasta_saida.exists() and any(pasta_saida.iterdir()):
            print(f"A pasta {pasta_saida} já existe e não está vazia. Apague ou renomeie")
            print("a pasta à mão antes de rodar de novo -- este script não sobrescreve.")
            sys.exit(1)
    else:
        pasta_saida = SAIDA_TILES_TESTE
        print(f"MODO TESTE: saída em {pasta_saida} (nunca o destino real), só as primeiras")
        print(f"{FAIXAS_NO_TESTE} faixas de {ALTURA_FAIXA}px, sem gerar a pirâmide completa.\n")

    t_inicio = time.time()
    im_rotulado, im_sem_rotulo = abrir_imagens_de_origem()

    n_faixas_total = (RESOLUCAO_ESPERADA + ALTURA_FAIXA - 1) // ALTURA_FAIXA
    n_faixas = n_faixas_total if confirmo else min(FAIXAS_NO_TESTE, n_faixas_total)

    print(f"Comparando {n_faixas} de {n_faixas_total} faixa(s) de {ALTURA_FAIXA}px ...")
    total_tiles = 0
    for i in range(n_faixas):
        total_tiles += processar_faixa(im_rotulado, im_sem_rotulo, i * ALTURA_FAIXA, pasta_saida)
    print(f"  zoom {MAX_ZOOM}: {total_tiles} tiles, pico até agora: {pico_memoria_mb():.0f} MB")

    if confirmo:
        print("Reduzindo pirâmide a partir dos tiles de zoom máximo ...")
        reduzir_piramide_a_partir_dos_tiles(pasta_saida)
        print(f"\nPronto. Tempo total: {time.time()-t_inicio:.1f}s")
        print(f"Pico de memória do processo: {pico_memoria_mb():.0f} MB")
    else:
        pico = pico_memoria_mb()
        necessario_mb = pico * MARGEM_SEGURANCA
        print(f"\n=== Resultado do teste ({n_faixas} de {n_faixas_total} faixas) ===")
        print(f"Tempo do teste: {time.time()-t_inicio:.1f}s")
        print(f"Pico de memória medido: {pico:.0f} MB")
        print(f"Recomendação (pico x {MARGEM_SEGURANCA}, margem de segurança): "
              f">= {necessario_mb:.0f} MB (~{necessario_mb/1024:.2f} GB) de memória livre "
              "antes de rodar --confirmo.")
        print("\nO pico não deve crescer muito com o número de faixas (cada faixa libera seus")
        print("buffers antes da próxima) -- o custo dominante é abrir as duas imagens inteiras,")
        print("que já aconteceu neste teste. Ainda assim, isto é uma extrapolação, não uma")
        print("garantia. Não rodei --confirmo. Me diga se posso rodar com a memória recomendada acima.")
        print(f"\n(Saída de teste em {pasta_saida}, fora do git -- pode apagar quando quiser.)")


if __name__ == "__main__":
    main()
