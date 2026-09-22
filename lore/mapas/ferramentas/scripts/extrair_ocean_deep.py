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

import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from backend.coordenadas import MAX_ZOOM, TILE_SIZE  # noqa: E402

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


def extrair_camada_para_png() -> Path:
    import win32com.client

    # Dispatch COM cedo (gencache.EnsureDispatch, nao Dispatch simples): gera o
    # wrapper a partir da biblioteca de tipos do proprio Photoshop instalado, entao
    # `constants.psDoNotSaveChanges` vem do Photoshop de verdade, nao de um numero
    # digitado de memoria -- ponto critico, porque fechar com a opcao errada podia
    # arriscar salvar por cima do original. Regra "nada de inventar API".
    app = win32com.client.gencache.EnsureDispatch("Photoshop.Application")
    from win32com.client import constants

    print(f"Abrindo {CAMINHO_PSD} (leitura) ...")
    t0 = time.time()
    doc_original = app.Open(str(CAMINHO_PSD))
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
        doc_copia = doc_original.Duplicate()

        camada_na_copia = _achar_camada_recursivo(doc_copia.Layers, NOME_CAMADA)
        if camada_na_copia is None:
            raise RuntimeError("Camada sumiu na copia duplicada -- nao deveria acontecer.")

        _isolar_camada_visivel(doc_copia, camada_na_copia)

        print("Mesclando so as camadas visiveis ...")
        # MergeVisibleLayers (em vez de Flatten): Flatten sempre preenche area vazia
        # com a cor de fundo (perde transparencia); MergeVisibleLayers preserva
        # transparencia quando nao ha "Background" travado. VERIFICAR NA PRIMEIRA
        # EXECUCAO se o resultado tem alfa de verdade.
        doc_copia.MergeVisibleLayers()

        SAIDA_TILES.parent.mkdir(parents=True, exist_ok=True)
        CAMINHO_PNG_EXPORTADO.parent.mkdir(parents=True, exist_ok=True)

        opcoes_png = win32com.client.Dispatch("Photoshop.PNGSaveOptions")
        print(f"Exportando para {CAMINHO_PNG_EXPORTADO} ...")
        doc_copia.SaveAs(str(CAMINHO_PNG_EXPORTADO), opcoes_png, True)  # asCopy=True
        doc_copia.Close(constants.psDoNotSaveChanges)

        return CAMINHO_PNG_EXPORTADO
    finally:
        # Regra de ouro: o documento original nunca e alterado neste script (so
        # lido e duplicado) -- `.Saved` confirma isso antes de fechar; se por
        # algum motivo o Photoshop achar que ha mudanca nao salva, para tudo em vez
        # de arriscar fechar com a opcao errada.
        if not doc_original.Saved:
            raise RuntimeError(
                "Mapa.psd aparece como alterado (doc_original.Saved == False), e "
                "este script nunca deveria mexer nele. Nao fechando automaticamente "
                "-- feche o Photoshop a mao e confira o que aconteceu antes de "
                "rodar de novo."
            )
        doc_original.Close(constants.psDoNotSaveChanges)


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
    print(f"Camada exportada em {time.time()-t_inicio:.1f}s: {caminho_png}")

    print("Gerando piramide de tiles do Ocean Deep ...")
    gerar_piramide_de_um_arquivo(caminho_png)

    print(f"Pronto. Tempo total: {time.time()-t_inicio:.1f}s")


if __name__ == "__main__":
    main()
