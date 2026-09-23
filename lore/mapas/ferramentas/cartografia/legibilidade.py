"""Tamanho mínimo legível MEDIDO (2026-09-23, decisão 7 do usuário: "troque o
julgamento a olho por uma medida").

**O que se mede**: a silhueta de cada símbolo (o alfa do modo branco-opaco) reduzida a
tamanhos decrescentes do maior lado, binarizada em 50% e apoiada pela base num quadro
de s × s px, com a âncora no meio (como o renderizador a põe no mapa). Símbolo que
espelha no mapa entra também espelhado.

**Quando dois tipos ficam indistinguíveis**: a semelhança de dois tipos A e B num
tamanho s é a MAIOR sobreposição (IoU, interseção sobre união) entre uma silhueta de
A e uma de B. O limiar é o **ruído do próprio desenho** nesse tamanho: a IoU mediana
entre cada silhueta e ela mesma deslocada MEIO PIXEL na diagonal. Meio pixel é o erro
que o renderizador já comete ao arredondar a âncora para o pixel inteiro, então uma
diferença entre dois tipos menor que a de um símbolo contra ele mesmo meio pixel ao
lado está abaixo da precisão do próprio mapa: nada no desenho permite separá-los.

A e B são indistinguíveis em s quando semelhança(A, B) >= ruído(s).

**O piso de um tipo** é o menor tamanho da grade a partir do qual ele se separa de
TODOS os outros tipos em todo tamanho maior. Se ele se confunde com algum tipo até no
maior tamanho medido, o piso é esse maior tamanho, com a marca `nunca_separa`.

Limites da medida (ditos, e não escondidos): ela olha só a SILHUETA. Dois tipos com o
mesmo contorno e miolos diferentes (hachura, neve) contam como iguais; é a leitura
pessimista, a de quem vê o mapa de longe, onde o miolo some antes do contorno.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_TABELA = RAIZ_MAPAS / "dados" / "tamanho-minimo-legivel.json"
TAMANHOS = tuple(range(8, 201, 2))


def silhueta(alfa: Image.Image, ancora_x: float, s: int, deslocar: float = 0.0,
             espelhar: bool = False) -> np.ndarray:
    """Silhueta binária em s x s, maior lado = s, base no fundo do quadro e âncora no
    meio. `deslocar` em pixels DO QUADRO (0,5 = meio pixel na diagonal)."""
    if espelhar:
        alfa = alfa.transpose(Image.FLIP_LEFT_RIGHT)
        ancora_x = alfa.width - ancora_x
    k = s / max(alfa.width, alfa.height)
    w, h = max(1, round(alfa.width * k)), max(1, round(alfa.height * k))
    d = deslocar / k
    folga = int(np.ceil(abs(d))) + 2
    larga = Image.new("L", (alfa.width + 2 * folga, alfa.height + 2 * folga), 0)
    larga.paste(alfa, (folga, folga))
    caixa = (folga - d, folga - d, folga - d + alfa.width, folga - d + alfa.height)
    menor = np.asarray(larga.resize((w, h), Image.LANCZOS, box=caixa)) >= 128
    quadro = np.zeros((s, s), dtype=bool)
    x0 = int(round(s / 2 - ancora_x * k))
    y0 = s - h
    xa, xb = max(0, x0), min(s, x0 + w)
    if xb > xa:
        quadro[max(0, y0):, xa:xb] = menor[max(0, -y0):, xa - x0: xb - x0]
    return quadro


def iou(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """IoU de todo par de linhas de a (n, p) com b (m, p), booleanos achatados."""
    a, b = a.astype(np.float32), b.astype(np.float32)
    inter = a @ b.T
    uniao = a.sum(1)[:, None] + b.sum(1)[None, :] - inter
    return np.where(uniao > 0, inter / np.maximum(uniao, 1), 1.0)


def medir(simbolos: list[dict], raiz: Path = RAIZ_MAPAS, tamanhos=TAMANHOS) -> dict:
    """Devolve {tipo: {piso, confunde_com, em, nunca_separa}} e o ruído por tamanho."""
    fontes = []
    for s in simbolos:
        with Image.open(raiz / s["arquivos"]["branco-opaco"]) as im:
            alfa = im.convert("RGBA").getchannel("A")
        k_manifesto = alfa.width / s["largura"] if s.get("largura") else 1.0
        fontes.append((s["tipo"], alfa, s["ancora"]["x"] * k_manifesto, bool(s.get("espelhavel"))))
    tipos = sorted({t for t, *_ in fontes})
    confusao = {}      # tamanho -> {tipo: (outro tipo, semelhança)} dos que se confundem
    ruido = {}
    for s in tamanhos:
        linhas, rotulos, proprias, deslocadas = [], [], [], []
        for tipo, alfa, ax, espelha in fontes:
            base = silhueta(alfa, ax, s)
            proprias.append(base.ravel())
            deslocadas.append(silhueta(alfa, ax, s, deslocar=0.5).ravel())
            linhas.append(base.ravel())
            rotulos.append(tipo)
            if espelha:
                linhas.append(silhueta(alfa, ax, s, espelhar=True).ravel())
                rotulos.append(tipo)
        p, q = np.array(proprias), np.array(deslocadas)
        limiar = float(np.median(np.diag(iou(p, q))))
        ruido[s] = limiar
        m = iou(np.array(linhas), np.array(linhas))
        rot = np.array(rotulos)
        confusao[s] = {}
        for tipo in tipos:
            meus = rot == tipo
            outros = ~meus
            if not outros.any():
                continue
            sub = m[np.ix_(meus, outros)]
            j = int(np.argmax(sub.max(0)))
            maior = float(sub.max())
            if maior >= limiar:
                confusao[s][tipo] = (str(rot[outros][j]), round(maior, 3))
    tabela = {}
    for tipo in tipos:
        piso, com, em = tamanhos[0], None, None
        for s in tamanhos:                     # o maior tamanho em que ainda confunde
            if tipo in confusao[s]:
                piso = s
                com, _ = confusao[s][tipo]
                em = s
        nunca = em == tamanhos[-1]
        if em is not None and not nunca:
            piso = tamanhos[tamanhos.index(em) + 1]
        tabela[tipo] = {"piso": piso, "confunde_com": com, "ultimo_tamanho_confuso": em,
                        "nunca_separa": nunca}
    return {"tipos": tabela, "ruido_por_tamanho": {str(k): round(v, 3) for k, v in ruido.items()}}


def carregar(caminho: Path = CAMINHO_TABELA) -> dict[str, int]:
    """{tipo: piso em px na resolução oficial}, lido da tabela gravada."""
    dados = json.loads(caminho.read_text(encoding="utf-8"))
    return {t: v["piso"] for t, v in dados["tipos"].items()}
