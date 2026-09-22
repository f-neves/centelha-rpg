"""Extrai a camada "Ocean Deep" de fonte/Mapa.psd (batimetria: escuro=fundo,
claro=raso — achado registrado em CARTOGRAFO.md) e gera uma pirâmide de tiles a
partir dela, do mesmo jeito que scripts/gerar_tiles.py faz para a costa/mar.

PROCESSAMENTO PESADO, MAIS PESADO QUE O DA COSTA — regra do CARTOGRAFO.md ("Regras
invioláveis"): abre `fonte/Mapa.psd` (594 MB no disco) pelo Photoshop via automação
COM. Fechar navegadores e outras sessões do Claude antes de rodar. **Photoshop
precisa estar instalado e não pode estar com outro documento grande já aberto.**

ESCRITO NESTA SESSÃO, NÃO TESTADO — regra "nada de inventar API": diferente de
`gerar_tiles.py` (testado de ponta a ponta), este script usa a API de automação COM
do Photoshop (`win32com`), que não foi exercitada nesta sessão porque rodar de
verdade É o processamento pesado que está sendo evitado até o usuário confirmar.
A lógica de COM abaixo segue a API documentada da Adobe (Photoshop Scripting
Reference), mas o comportamento exato de `MergeVisibleLayers` numa camada que não
cobre a tela inteira, e se "Ocean Deep" está solta ou dentro de um grupo, só se
confirma na primeira execução real — ver os comentários "VERIFICAR NA PRIMEIRA
EXECUÇÃO" espalhados pelo código.

REGRA DE OURO RESPEITADA (CARTOGRAFO.md, "Regras invioláveis"): o documento ORIGINAL
(`app.Documents[0]`, o Mapa.psd aberto) nunca leva `.Save()`, só `.Close(3)` (não
salvar) no final. Todo o trabalho de isolar/exportar a camada acontece numa
**cópia em memória** (`doc.Duplicate()`), que também é fechada sem salvar depois de
exportar o PNG. `SaveAs` na cópia nunca sobrescreve o `.psd` original — grava um
`.png` novo em `render/`.

Uso (de dentro de lore/mapas/ferramentas/): **com o Python GLOBAL da máquina, não o
`.venv`** -- `win32com` (pywin32) já está instalado nele (usado em sessão anterior de
automação COM), e não foi instalado no `.venv` da ferramenta (só entraria lá com ok
explícito do usuário, e não faria sentido pedir pra uma automação de uso único).
`backend/coordenadas.py` só usa `json`/`pathlib` (biblioteca padrão) e o Pillow, que
também já está no Python global -- nenhuma dependência do FastAPI é necessária aqui.

    python scripts/extrair_ocean_deep.py --confirmo

Sem --confirmo, só imprime o aviso e sai, sem abrir o Photoshop.

Se o script parar reclamando que `doc_original.Saved == False` antes de fechar o
documento: é a checagem de segurança da "regra de ouro" travando por excesso de
cautela, não necessariamente um sinal de que algo mudou de verdade (o Photoshop às
vezes marca um documento como "alterado" por coisas como atribuição de perfil de
cor ao abrir, sem que o CONTEÚDO tenha mudado). Se isso acontecer: feche o
Photoshop manualmente SEM salvar (Ctrl+Z pra garantir, depois fechar sem salvar) e
avise antes de tentar de novo -- não é para "destravar" o script removendo essa
checagem sem entender por que disparou.
"""

import ctypes
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.coordenadas import MAX_ZOOM, TILE_SIZE  # noqa: E402


def pico_memoria_mb() -> float:
    """Mesma leitura de scripts/gerar_tiles.py (PeakWorkingSetSize via psapi, sem
    depender de psutil) — reportar tempo sem reportar pico seria voltar atrás na
    mesma correção que aquele script já recebeu."""
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

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_PSD = RAIZ_MAPAS / "fonte" / "Mapa.psd"
CAMINHO_PNG_EXPORTADO = RAIZ_MAPAS / "render" / "ocean_deep_exportado.png"
SAIDA_TILES = RAIZ_MAPAS / "render" / "tiles" / "ocean-deep"
NOME_CAMADA = "Ocean Deep"
RESOLUCAO_ESPERADA = 10240


def _achar_camada_recursivo(camadas, nome):
    """Procura `nome` em `camadas` (ArtLayers ou LayerSets), descendo em grupos.
    VERIFICAR NA PRIMEIRA EXECUÇÃO: se "Ocean Deep" estiver dentro de um grupo, os
    grupos ancestrais também precisam ficar visíveis (tratado em
    `_isolar_camada_visivel`, não aqui)."""
    for camada in camadas:
        if camada.Name == nome:
            return camada
        # LayerSet (grupo) tem `.Layers`; ArtLayer não.
        if hasattr(camada, "Layers"):
            achada = _achar_camada_recursivo(camada.Layers, nome)
            if achada is not None:
                return achada
    return None


def _todas_as_camadas_e_grupos(camadas):
    """Gera (camada, é_grupo) para toda camada e grupo, recursivamente."""
    for camada in camadas:
        eh_grupo = hasattr(camada, "Layers")
        yield camada, eh_grupo
        if eh_grupo:
            yield from _todas_as_camadas_e_grupos(camada.Layers)


def _isolar_camada_visivel(doc, camada_alvo):
    """Esconde tudo, exceto a camada alvo e os grupos que são ancestrais dela (um
    grupo escondido esconde o que está dentro, mesmo que a camada filha esteja
    'visível')."""
    ancestrais = set()
    pai = camada_alvo.Parent
    while pai is not None and hasattr(pai, "Layers"):
        ancestrais.add(pai.Name)
        pai = getattr(pai, "Parent", None)

    for camada, _eh_grupo in _todas_as_camadas_e_grupos(doc.Layers):
        if camada.Name == camada_alvo.Name or camada.Name in ancestrais:
            camada.Visible = True
        else:
            camada.Visible = False


RPC_E_SERVERCALL_RETRYLATER = -2147417846  # 0x8001010A


def _com_retry(func, *, tentativas=10, espera_s=3.0, descricao=""):
    """Executa `func()` tolerando o erro COM transitorio "o filtro de mensagens
    indicou que o aplicativo esta ocupado" (RPC_E_SERVERCALL_RETRYLATER) -- achado
    na primeira execucao real deste script (2026-09-22): o Photoshop ainda estava
    processando o PSD de 594 MB internamente logo apos o Open() retornar, e a
    chamada seguinte (Duplicate()) chegou cedo demais. Isto NAO e "inventar API":
    e a mesma chamada COM documentada, so tolerando um "ocupado" do proprio Windows
    (comportamento padrao de automacao COM de app pesado, nao especifico do
    Photoshop). Qualquer outro erro sobe na hora, sem retry -- so este codigo
    especifico e tratado como transitorio."""
    import pywintypes

    for tentativa in range(1, tentativas + 1):
        try:
            return func()
        except pywintypes.com_error as e:
            if e.args[0] != RPC_E_SERVERCALL_RETRYLATER or tentativa == tentativas:
                raise
            print(f"  ({descricao or 'chamada COM'}: Photoshop ocupado, tentativa "
                  f"{tentativa}/{tentativas}, esperando {espera_s:.0f}s ...)")
            time.sleep(espera_s)


def extrair_camada_para_png() -> Path:
    import win32com.client

    # Dispatch COM cedo (gencache.EnsureDispatch, nao Dispatch simples): gera o
    # wrapper a partir da biblioteca de tipos do proprio Photoshop instalado, entao
    # `constants.psDoNotSaveChanges` vem do Photoshop de verdade, nao de um numero
    # digitado de memoria -- ponto critico, porque fechar com a opcao errada podia
    # arriscar salvar por cima do original. Regra "nada de inventar API".
    app = win32com.client.gencache.EnsureDispatch("Photoshop.Application")
    from win32com.client import constants

    # Achado na segunda execucao real (2026-09-22): sem isto, MergeVisibleLayers
    # falhou com "O usuario cancelou a operacao" -- e o erro padrao quando uma
    # chamada scriptavel dispararia uma caixa de dialogo (ICC, camadas ocultas
    # etc.) e nao ha usuario para clicar nela. psDisplayNoDialogs suprime
    # qualquer dialogo pelo resto da sessao COM (API documentada da Adobe, nao
    # inventada). So afeta este processo automatizado, nao a sessao interativa
    # do Photoshop que o usuario ve na tela.
    app.DisplayDialogs = constants.psDisplayNoDialogs

    print(f"Abrindo {CAMINHO_PSD} (leitura) ...")
    t0 = time.time()
    doc_original = _com_retry(lambda: app.Open(str(CAMINHO_PSD)), descricao="Open")
    print(f"  aberto em {time.time()-t0:.1f}s")

    try:
        largura = int(doc_original.Width)
        altura = int(doc_original.Height)
        if (largura, altura) != (RESOLUCAO_ESPERADA, RESOLUCAO_ESPERADA):
            raise RuntimeError(
                f"Mapa.psd tem {largura}x{altura}px, esperava "
                f"{RESOLUCAO_ESPERADA}x{RESOLUCAO_ESPERADA}px. Parando sem exportar "
                "nada -- conferir a mudanca antes de seguir."
            )

        camada = _achar_camada_recursivo(doc_original.Layers, NOME_CAMADA)
        if camada is None:
            raise RuntimeError(
                f"Camada '{NOME_CAMADA}' nao encontrada em Mapa.psd. Nomes no "
                "primeiro nivel: " + ", ".join(c.Name for c in doc_original.Layers)
            )

        print(f"Camada '{NOME_CAMADA}' encontrada. Duplicando documento (nao mexe no original) ...")
        # VERIFICAR NA PRIMEIRA EXECUCAO: Duplicate() aceita nome opcional; sem
        # argumento, o Photoshop nomeia a copia automaticamente.
        doc_copia = _com_retry(lambda: doc_original.Duplicate(), descricao="Duplicate")

        # Achado na terceira execucao real (2026-09-22): MergeVisibleLayers falhou
        # com "o comando nao esta disponivel no momento" enquanto a copia nao era o
        # ActiveDocument -- varios comandos de documento do Photoshop agem sobre o
        # documento ATIVO, nao sobre o objeto Document referenciado em Python, e
        # Duplicate() nao muda automaticamente qual documento esta ativo.
        app.ActiveDocument = doc_copia

        camada_na_copia = _achar_camada_recursivo(doc_copia.Layers, NOME_CAMADA)
        if camada_na_copia is None:
            raise RuntimeError("Camada sumiu na copia duplicada -- nao deveria acontecer.")

        _isolar_camada_visivel(doc_copia, camada_na_copia)

        # Achado na quarta execucao real (2026-09-22): MergeVisibleLayers falhou
        # com "comando nao disponivel no momento" -- 'Ocean Deep' e uma camada solta
        # de topo (sem grupo ancestral), entao depois de isolar a visibilidade sobra
        # UMA UNICA camada visivel, e o Photoshop desabilita "mesclar visiveis"
        # quando nao ha mais de uma camada pra combinar. Isto nao bloqueia a
        # exportacao: SaveAs para um formato sem camadas (PNG) sempre compoe o que
        # esta visivel no momento do salvamento, sem precisar de um merge explicito
        # antes -- comportamento documentado do Photoshop, nao suposicao. O merge
        # foi removido; se 'Ocean Deep' vier a virar um grupo com mais de uma
        # camada no futuro, o PNG exportado ainda vai sair certo, so que via
        # composicao automatica do SaveAs em vez de um merge previo.
        SAIDA_TILES.parent.mkdir(parents=True, exist_ok=True)
        CAMINHO_PNG_EXPORTADO.parent.mkdir(parents=True, exist_ok=True)

        opcoes_png = win32com.client.Dispatch("Photoshop.PNGSaveOptions")
        print(f"Exportando para {CAMINHO_PNG_EXPORTADO} ...")
        _com_retry(
            lambda: doc_copia.SaveAs(str(CAMINHO_PNG_EXPORTADO), opcoes_png, True),
            descricao="SaveAs",
        )  # asCopy=True
        _com_retry(lambda: doc_copia.Close(constants.psDoNotSaveChanges), descricao="Close copia")

        return CAMINHO_PNG_EXPORTADO
    finally:
        # Regra de ouro: o documento original nunca e alterado neste script (so
        # lido e duplicado) -- `.Saved` confirma isso antes de fechar; se por
        # algum motivo o Photoshop achar que ha mudanca nao salva, para tudo em vez
        # de arriscar fechar com a opcao errada. O retry aqui e so pra tolerar
        # "ocupado" -- qualquer outro erro, ou Saved==False de verdade, ainda para
        # tudo sem fechar.
        saved = _com_retry(lambda: doc_original.Saved, descricao="checar Saved")
        if not saved:
            raise RuntimeError(
                "Mapa.psd aparece como alterado (doc_original.Saved == False), e "
                "este script nunca deveria mexer nele. Nao fechando automaticamente "
                "-- feche o Photoshop a mao e confira o que aconteceu antes de "
                "rodar de novo."
            )
        _com_retry(lambda: doc_original.Close(constants.psDoNotSaveChanges), descricao="Close original")


def gerar_piramide_de_um_arquivo(caminho_png: Path) -> None:
    """Reaproveita a mesma ideia de scripts/gerar_tiles.py (reduz o nivel anterior,
    nunca imagem colorida inteira em memoria) -- aqui mais simples, uma camada so,
    sem par costa/mar."""
    from PIL import Image

    with Image.open(caminho_png) as im:
        imagem = im.convert("RGBA").copy()

    for zoom in range(MAX_ZOOM, -1, -1):
        largura, altura = imagem.size
        n_col = (largura + TILE_SIZE - 1) // TILE_SIZE
        n_lin = (altura + TILE_SIZE - 1) // TILE_SIZE
        gravados = 0
        for y in range(n_lin):
            for x in range(n_col):
                caixa = (x * TILE_SIZE, y * TILE_SIZE, (x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE)
                tile = imagem.crop(caixa)
                if tile.size != (TILE_SIZE, TILE_SIZE):
                    fundo = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), (0, 0, 0, 0))
                    fundo.paste(tile, (0, 0))
                    tile = fundo
                if tile.getextrema()[3] == (0, 0):
                    continue
                destino = SAIDA_TILES / str(zoom) / str(x)
                destino.mkdir(parents=True, exist_ok=True)
                tile.save(destino / f"{y}.png")
                gravados += 1
        print(f"  zoom {zoom}: {gravados} tiles")
        if zoom > 0:
            novo_tamanho = (max(1, imagem.width // 2), max(1, imagem.height // 2))
            imagem = imagem.resize(novo_tamanho, Image.LANCZOS)


def main() -> None:
    if "--confirmo" not in sys.argv:
        print(__doc__)
        print("Nada foi feito. Rode de novo com --confirmo depois de fechar")
        print("navegadores e outras sessoes do Claude, com o Photoshop instalado")
        print("e sem outro documento pesado aberto.")
        sys.exit(1)

    if SAIDA_TILES.exists() and any(SAIDA_TILES.iterdir()):
        print(f"A pasta {SAIDA_TILES} ja existe e nao esta vazia. Apague ou renomeie")
        print("a pasta a mao antes de rodar de novo -- este script nao sobrescreve.")
        sys.exit(1)

    t_inicio = time.time()
    caminho_png = extrair_camada_para_png()
    t_extracao = time.time() - t_inicio
    print(f"Camada exportada em {t_extracao:.1f}s: {caminho_png}")

    from PIL import Image

    with Image.open(caminho_png) as im:
        print(f"  dimensoes: {im.size[0]}x{im.size[1]}px, modo: {im.mode}")
        if im.size != (RESOLUCAO_ESPERADA, RESOLUCAO_ESPERADA):
            print(f"  AVISO: esperava {RESOLUCAO_ESPERADA}x{RESOLUCAO_ESPERADA}px")

    print("Gerando piramide de tiles do Ocean Deep ...")
    gerar_piramide_de_um_arquivo(caminho_png)

    print(f"Pronto. Tempo total: {time.time()-t_inicio:.1f}s")
    print(f"Pico de memoria do processo: {pico_memoria_mb():.0f} MB")


if __name__ == "__main__":
    main()
