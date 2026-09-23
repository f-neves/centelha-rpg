"""Recorte da biblioteca de símbolos a partir das folhas geradas no ChatGPT.

Cada folha (`lore/mapas/icons/folha-*.png`) é uma imagem de ~1254 px, fundo branco
(253 a 254 medido nas bordas), com as peças numa grade de 4 colunas por 3 linhas (a de
cartografia tem 6 peças soltas, de tamanhos diferentes).

**Como uma peça é achada** (por componentes conectados, como pedido):

1. Tinta é todo pixel com luminância abaixo de `LIMIAR_TINTA`.
2. A máscara de tinta é reduzida à metade e engordada 1 célula (uns 2 px na folha),
   só para fechar o serrilhado do traço; os componentes conectados saem dela.
3. Componente com menos de `MIN_PIXELS_COMPONENTE` é sujeira e é descartado.
4. Os componentes são agrupados por CÉLULA da grade (pelo centro de cada um): uma
   montanha com hachura de chão solta, um pântano com as marolas soltas embaixo, uma
   tundra com pedrinhas soltas são vários componentes e UMA peça. Na folha de
   cartografia o agrupamento é pelo centro esperado mais próximo de cada peça.
5. Grupo com menos de `MIN_PIXELS_PECA` de tinta é peça VAZIA e é recusado.

**Conferências que fazem o recorte FALHAR** (controle negativo da regra do projeto):
número de peças diferente do esperado, célula vazia, peça que encosta na borda da
folha, e componente que atravessa duas células (duas peças grudadas).

**Dois modos de saída**, os dois gerados para todo símbolo:

- `so-traco`: RGB preto e alfa = escuridão do pixel. O branco de dentro vira
  transparente, e o papel do mapa aparece por baixo com o traço multiplicado sobre ele.
- `branco-opaco`: a silhueta da peça (a tinta fechada e com os buracos preenchidos)
  fica opaca com o cinza original; o branco de dentro continua branco (neve, gelo).

O modo PADRÃO de cada tipo está em `MODO_PADRAO` e vai para o manifesto; trocar o
padrão é editar o manifesto, sem recortar de novo.
"""

from __future__ import annotations

import json
from collections import deque
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
PASTA_FOLHAS = RAIZ_MAPAS / "icons"
PASTA_SIMBOLOS = RAIZ_MAPAS / "simbolos"
CAMINHO_MANIFESTO = RAIZ_MAPAS / "dados" / "simbolos.json"

LIMIAR_TINTA = 200          # luminância; o fundo medido é 253-254
LIMIAR_ALFA = 250           # acima disto o pixel é papel (alfa 0) no modo so-traco
MIN_PIXELS_COMPONENTE = 6   # na folha reduzida à metade: 24 px de tinta na folha
MIN_PIXELS_PECA = 2000      # de tinta, na folha inteira
MARGEM_PECA = 3             # px de folga em volta da caixa justa

# Grade das folhas: 4 colunas por 3 linhas, lida nas imagens (o pedido dizia 3 por 4,
# e a disposição real é a transposta; o número de peças, 12, é o mesmo).
COLUNAS, LINHAS = 4, 3

# O que está em cada célula, linha a linha, da esquerda para a direita. Conferido a
# olho nas folhas em 2026-09-23.
FOLHAS_EM_GRADE = {
    "folha-montanhas.png": ["montanha"] * 12,
    "folha-arvores.png": [
        "arvore-folhosa", "arvore-conifera", "arvore-folhosa", "arvore-conifera",
        "arvore-folhosa", "arvore-conifera", "arvore-folhosa", "arvore-folhosa",
        "arvore-conifera", "arvore-folhosa", "arvore-conifera", "arvore-folhosa",
    ],
    "folha-colinas.png": ["colina"] * 12,
    "folha-vegetacao-quente.png": (
        ["palmeira", "arvore-tropical", "palmeira", "arvore-tropical"]
        + ["selva"] * 4 + ["pantano"] * 4
    ),
    "folha-assentamentos.png": [
        "cidade", "cidade", "vila", "vila",
        "fortaleza", "fortaleza", "porto", "porto",
        "ruina", "ruina", "marco", "marco",
    ],
    "folha-terreno-gelado.png": ["montanha-nevada"] * 4 + ["geleira"] * 4 + ["tundra"] * 4,
    "folha-terreno-seco.png": ["duna"] * 4 + ["rochedo"] * 4 + ["vegetacao-seca"] * 4,
}

# Folha de cartografia: peças soltas, identificadas pelo centro aproximado (x, y) na
# folha de 1254 px, medido a olho. Cada componente vai para o centro mais próximo.
FOLHA_CARTOGRAFIA = "folha-cartografia.png"
PECAS_CARTOGRAFIA = [
    ("rosa-dos-ventos", (330, 290)),
    ("rosa-dos-ventos", (905, 310)),
    ("barra-de-escala", (625, 635)),
    ("cartela", (345, 840)),
    ("monstro-marinho", (950, 870)),
    ("cartela", (345, 1020)),
]

# `folha-montanhas-fundo-transparente.png` NÃO é recortada: é a mesma folha de
# montanhas com o fundo tirado pelo próprio ChatGPT, e recortá-la daria 12 montanhas
# repetidas. Fica guardada como referência de silhueta.

# Modo padrão por tipo (pedido do Direcionamento: branco opaco só onde o branco é neve
# ou gelo). Tundra, palmeira e árvore tropical não estavam em nenhuma das duas listas
# do pedido: ficaram em so-traco, recomendação do Cartógrafo.
MODO_PADRAO = {t: "so-traco" for t in (
    "montanha", "arvore-folhosa", "arvore-conifera", "colina", "palmeira",
    "arvore-tropical", "selva", "pantano", "cidade", "vila", "fortaleza", "porto",
    "ruina", "marco", "tundra", "duna", "rochedo", "vegetacao-seca",
    "rosa-dos-ventos", "barra-de-escala", "cartela", "monstro-marinho",
)}
MODO_PADRAO.update({"montanha-nevada": "branco-opaco", "geleira": "branco-opaco"})

# Espelhamento horizontal (recomendação do Cartógrafo): as gravuras têm luz vinda da
# esquerda e sombra hachurada à direita. Em relevo (montanha, colina, rochedo, duna,
# geleira) espelhar põe a sombra do lado errado, e numa cordilheira as peças
# espelhadas brigam com as vizinhas. Vegetação e construção aguentam. Rosa dos
# ventos, barra de escala e cartela têm orientação e não espelham.
ESPELHAVEL = {
    "montanha": False, "montanha-nevada": False, "colina": False, "rochedo": False,
    "duna": False, "geleira": False,
    "arvore-folhosa": True, "arvore-conifera": True, "palmeira": True,
    "arvore-tropical": True, "selva": True, "pantano": True, "tundra": True,
    "vegetacao-seca": True, "cidade": True, "vila": True, "fortaleza": True,
    "porto": True, "ruina": True, "marco": True, "monstro-marinho": True,
    "rosa-dos-ventos": False, "barra-de-escala": False, "cartela": False,
}


class ErroDeRecorte(ValueError):
    """Uma folha não passou nas conferências. A mensagem diz qual e por quê."""


# --- componentes conectados ----------------------------------------------------

def _componentes(tinta: np.ndarray) -> list[np.ndarray]:
    """Componentes 8-conectados de uma máscara booleana: lista de arrays (N, 2) com
    (linha, coluna). Busca em largura em Python puro: a máscara que chega aqui já foi
    reduzida à metade (~630 px), então são ~100 mil pixels de tinta por folha."""
    altura, largura = tinta.shape
    # Listas do Python, e não o array: indexar numpy elemento a elemento num laço é
    # umas cinco vezes mais lento.
    visto = [[False] * largura for _ in range(altura)]
    ys, xs = np.nonzero(tinta)
    tinta = tinta.tolist()
    saida = []
    for y0, x0 in zip(ys.tolist(), xs.tolist()):
        if visto[y0][x0]:
            continue
        fila = deque([(y0, x0)])
        visto[y0][x0] = True
        pontos = []
        while fila:
            y, x = fila.popleft()
            pontos.append((y, x))
            for dy in (-1, 0, 1):
                ny = y + dy
                if ny < 0 or ny >= altura:
                    continue
                linha_tinta, linha_visto = tinta[ny], visto[ny]
                for dx in (-1, 0, 1):
                    nx = x + dx
                    if 0 <= nx < largura and linha_tinta[nx] and not linha_visto[nx]:
                        linha_visto[nx] = True
                        fila.append((ny, nx))
        saida.append(np.array(pontos, dtype=np.int32))
    return saida


def mascara_de_tinta(luminancia: np.ndarray) -> np.ndarray:
    return luminancia < LIMIAR_TINTA


def achar_componentes(luminancia: np.ndarray) -> list[dict]:
    """Componentes da folha, em coordenadas da folha inteira, sem a sujeira."""
    tinta = mascara_de_tinta(luminancia)
    h, w = tinta.shape
    # Reduz à metade (um pixel reduzido é tinta se QUALQUER um dos 4 for) e engorda 1.
    reduzida = tinta[: h // 2 * 2, : w // 2 * 2].reshape(h // 2, 2, w // 2, 2).any(axis=(1, 3))
    engordada = np.asarray(
        Image.fromarray(reduzida.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))
    ) > 0
    saida = []
    for pontos in _componentes(engordada):
        if len(pontos) < MIN_PIXELS_COMPONENTE:
            continue
        ys, xs = pontos[:, 0] * 2, pontos[:, 1] * 2
        saida.append({
            "pontos": pontos,
            "caixa": (int(xs.min()), int(ys.min()), int(xs.max()) + 2, int(ys.max()) + 2),
            "centro": (float(xs.mean()) + 1, float(ys.mean()) + 1),
        })
    return saida


# --- agrupamento em peças ------------------------------------------------------

def _agrupar_por_grade(componentes: list[dict], tamanho: tuple[int, int]) -> dict:
    w, h = tamanho
    larg_cel, alt_cel = w / COLUNAS, h / LINHAS
    grupos: dict[tuple[int, int], list[dict]] = {}
    for c in componentes:
        cx, cy = c["centro"]
        col = min(COLUNAS - 1, int(cx // larg_cel))
        lin = min(LINHAS - 1, int(cy // alt_cel))
        # Duas peças grudadas: um componente GRANDE que avança bem sobre a célula
        # vizinha. (Componente pequeno perto da divisa não conta: é hachura.)
        x0, y0, x1, y1 = c["caixa"]
        if len(c["pontos"]) > 4000:
            if x0 < (col - 0.25) * larg_cel or x1 > (col + 1.25) * larg_cel \
                    or y0 < (lin - 0.25) * alt_cel or y1 > (lin + 1.25) * alt_cel:
                raise ErroDeRecorte(
                    f"um componente na célula linha {lin + 1}, coluna {col + 1} atravessa "
                    f"para a célula vizinha (caixa {c['caixa']}): duas peças grudadas?"
                )
        grupos.setdefault((lin, col), []).append(c)
    return grupos


def _agrupar_por_centros(componentes: list[dict], centros: list) -> dict:
    grupos: dict[int, list[dict]] = {}
    for c in componentes:
        cx, cy = c["centro"]
        melhor = min(range(len(centros)),
                     key=lambda i: (centros[i][1][0] - cx) ** 2 + (centros[i][1][1] - cy) ** 2)
        grupos.setdefault(melhor, []).append(c)
    return grupos


def _caixa_do_grupo(grupo: list[dict]) -> tuple[int, int, int, int]:
    return (min(c["caixa"][0] for c in grupo), min(c["caixa"][1] for c in grupo),
            max(c["caixa"][2] for c in grupo), max(c["caixa"][3] for c in grupo))


def _mascara_do_grupo(grupo: list[dict], tamanho: tuple[int, int]) -> np.ndarray:
    """Onde o grupo tem tinta, na folha inteira (para a peça não levar pedaço da
    vizinha que caia dentro da caixa dela)."""
    w, h = tamanho
    m = np.zeros((h // 2, w // 2), dtype=bool)
    for c in grupo:
        m[c["pontos"][:, 0], c["pontos"][:, 1]] = True
    # Engorda mais 2 células (4 px) para não cortar o antisserrilhado do traço.
    m = np.asarray(Image.fromarray(m.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0
    cheia = np.zeros((h, w), dtype=bool)
    cheia[: h // 2 * 2, : w // 2 * 2] = m.repeat(2, axis=0).repeat(2, axis=1)
    return cheia


def pecas_da_folha(nome_folha: str, luminancia: np.ndarray) -> list[dict]:
    """Devolve as peças da folha, na ordem da leitura, já conferidas."""
    h, w = luminancia.shape
    componentes = achar_componentes(luminancia)
    if nome_folha == FOLHA_CARTOGRAFIA:
        esperados = [t for t, _ in PECAS_CARTOGRAFIA]
        grupos = _agrupar_por_centros(componentes, PECAS_CARTOGRAFIA)
        chaves = list(range(len(PECAS_CARTOGRAFIA)))
        celula_de = {i: None for i in chaves}
    elif nome_folha in FOLHAS_EM_GRADE:
        esperados = FOLHAS_EM_GRADE[nome_folha]
        grupos = _agrupar_por_grade(componentes, (w, h))
        chaves = [(lin, col) for lin in range(LINHAS) for col in range(COLUNAS)]
        celula_de = {k: [k[0] + 1, k[1] + 1] for k in chaves}
    else:
        raise ErroDeRecorte(f"folha desconhecida: {nome_folha}")

    tinta = mascara_de_tinta(luminancia)
    pecas = []
    for chave, tipo in zip(chaves, esperados):
        grupo = grupos.get(chave, [])
        if not grupo:
            raise ErroDeRecorte(f"{nome_folha}: a peça {celula_de[chave] or chave} está vazia")
        mascara = _mascara_do_grupo(grupo, (w, h))
        n_tinta = int((tinta & mascara).sum())
        if n_tinta < MIN_PIXELS_PECA:
            raise ErroDeRecorte(
                f"{nome_folha}: a peça {celula_de[chave] or chave} tem só {n_tinta} px de "
                f"tinta, é sujeira ou peça vazia, não símbolo"
            )
        x0, y0, x1, y1 = _caixa_do_grupo(grupo)
        if x0 <= 0 or y0 <= 0 or x1 >= w or y1 >= h:
            raise ErroDeRecorte(
                f"{nome_folha}: a peça {celula_de[chave] or chave} encosta na borda da folha "
                f"(caixa {x0},{y0},{x1},{y1}); pode estar cortada"
            )
        pecas.append({"tipo": tipo, "celula": celula_de[chave], "caixa": (x0, y0, x1, y1),
                      "mascara": mascara, "pixels_de_tinta": n_tinta})
    sobras = set(grupos) - set(chaves)
    if sobras:
        raise ErroDeRecorte(f"{nome_folha}: tinta fora das peças esperadas em {sorted(sobras)}")
    if len(pecas) != len(esperados):
        raise ErroDeRecorte(f"{nome_folha}: {len(pecas)} peças, esperadas {len(esperados)}")
    return pecas


# --- os dois modos ------------------------------------------------------------

def _alfa_do_traco(lum: np.ndarray) -> np.ndarray:
    return np.clip((LIMIAR_ALFA - lum.astype(np.float32)) / LIMIAR_ALFA, 0.0, 1.0)


def _silhueta(tinta: np.ndarray) -> np.ndarray:
    """Tinta fechada (engorda e emagrece 9 px) e com os buracos preenchidos: tudo o
    que o fundo, entrando pelas bordas, não alcança."""
    img = Image.fromarray(tinta.astype(np.uint8) * 255)
    fechada = img.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
    com_borda = Image.new("L", (fechada.width + 2, fechada.height + 2), 0)
    com_borda.paste(fechada, (1, 1))
    ImageDraw.floodfill(com_borda, (0, 0), 128)
    arr = np.asarray(com_borda)[1:-1, 1:-1]
    return arr != 128


def gerar_modos(rgb: np.ndarray, lum: np.ndarray, peca: dict) -> dict[str, Image.Image]:
    x0, y0, x1, y1 = peca["caixa"]
    h, w = lum.shape
    x0, y0 = max(0, x0 - MARGEM_PECA), max(0, y0 - MARGEM_PECA)
    x1, y1 = min(w, x1 + MARGEM_PECA), min(h, y1 + MARGEM_PECA)
    peca["caixa_com_margem"] = (x0, y0, x1, y1)
    L = lum[y0:y1, x0:x1]
    dono = peca["mascara"][y0:y1, x0:x1]
    alfa = _alfa_do_traco(L) * dono

    traco = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.uint8)
    traco[..., 3] = np.round(alfa * 255).astype(np.uint8)

    dentro = _silhueta((L < LIMIAR_TINTA) & dono) & dono
    opaco = np.zeros_like(traco)
    opaco[..., :3] = rgb[y0:y1, x0:x1]
    opaco[..., 3] = np.maximum(dentro * 255, np.round(alfa * 255)).astype(np.uint8)
    return {"so-traco": Image.fromarray(traco, "RGBA"),
            "branco-opaco": Image.fromarray(opaco, "RGBA")}


def ancora_na_base(alfa: np.ndarray) -> dict:
    """Base = a linha, subindo a partir de baixo, onde já passou 0,2% de toda a tinta da
    peça, com 0,2% (1% comia um tronco fino inteiro, achado pelo teste da árvore sintética). Pega o pé do tronco numa árvore (a copa larga não engana, como enganaria uma
    regra por largura), o chão hachurado numa montanha e a lâmina d'água num pântano,
    e ignora a última pedrinha ou marola solta, que é menos de 0,2% da tinta."""
    massa = (alfa.astype(np.float64) / 255.0).sum(axis=1)
    acumulada = np.cumsum(massa[::-1])
    total = acumulada[-1]
    linha_de_baixo = int(np.searchsorted(acumulada, 0.002 * total))
    y = alfa.shape[0] - 1 - linha_de_baixo
    return {"x": int(round(alfa.shape[1] / 2)), "y": int(y),
            "metodo": "centro horizontal da caixa; linha onde a tinta acumulada de baixo para cima passa de 0,2%"}


# --- a biblioteca inteira ------------------------------------------------------

def recortar_tudo(pasta_folhas: Path = PASTA_FOLHAS, pasta_saida: Path = PASTA_SIMBOLOS,
                  caminho_manifesto: Path = CAMINHO_MANIFESTO) -> dict:
    nomes = sorted(FOLHAS_EM_GRADE) + [FOLHA_CARTOGRAFIA]
    contadores: dict[str, int] = {}
    simbolos = []
    por_folha = {}
    for nome in nomes:
        with Image.open(pasta_folhas / nome) as im:
            rgb = np.asarray(im.convert("RGB"))
        lum = np.asarray(Image.fromarray(rgb).convert("L"))
        pecas = pecas_da_folha(nome, lum)
        por_folha[nome] = len(pecas)
        for peca in pecas:
            tipo = peca["tipo"]
            contadores[tipo] = contadores.get(tipo, 0) + 1
            id_simbolo = f"{tipo}-{contadores[tipo]:02d}"
            modos = gerar_modos(rgb, lum, peca)
            arquivos = {}
            for modo, imagem in modos.items():
                rel = Path("simbolos") / tipo / modo / f"{id_simbolo}.png"
                destino = pasta_saida / tipo / modo / f"{id_simbolo}.png"
                destino.parent.mkdir(parents=True, exist_ok=True)
                imagem.save(destino, optimize=True)
                arquivos[modo] = rel.as_posix()
            alfa = np.asarray(modos["so-traco"])[..., 3]
            padrao = MODO_PADRAO[tipo]
            simbolos.append({
                "id": id_simbolo,
                "tipo": tipo,
                "folha": f"icons/{nome}",
                "celula": peca["celula"],
                "caixa_na_folha": list(peca["caixa_com_margem"]),
                "largura": modos["so-traco"].width,
                "altura": modos["so-traco"].height,
                "ancora": ancora_na_base(alfa),
                "espelhavel": ESPELHAVEL[tipo],
                "modo_padrao": padrao,
                "arquivo": arquivos[padrao],
                "arquivos": arquivos,
            })
    manifesto = {
        "_comentario": (
            "Biblioteca de símbolos recortada das folhas em icons/ por "
            "ferramentas/cartografia/recorte.py (regenerável: "
            "`.venv/Scripts/python.exe scripts/recortar_simbolos.py`). Os PNGs moram em "
            "simbolos/, fora do git. 'arquivo' é o do modo_padrao; para trocar o modo de "
            "um símbolo, troque modo_padrao e arquivo pelo outro valor de 'arquivos', sem "
            "recortar de novo. Âncora em pixels do próprio PNG, a partir do canto de cima "
            "à esquerda. Modo padrão e espelhável por tipo: recomendação do Cartógrafo "
            "(ver o docstring do recorte.py)."
        ),
        "versao_esquema": 1,
        "gerado_em": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "limiar_tinta": LIMIAR_TINTA,
        "limiar_alfa": LIMIAR_ALFA,
        "pecas_por_folha": por_folha,
        "simbolos": simbolos,
    }
    caminho_manifesto.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho_manifesto, "w", encoding="utf-8", newline="\n") as f:
        json.dump(manifesto, f, ensure_ascii=False, indent=1)
        f.write("\n")
    return manifesto
