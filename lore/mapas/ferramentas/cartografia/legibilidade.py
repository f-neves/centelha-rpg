"""Tamanho mínimo de cada tipo de símbolo, MEDIDO em duas partes (2026-09-23).

O renderizador usa como piso o MAIOR dos dois (`carregar_pisos`):

1. **Tamanho mínimo de silhueta distinguível** (decisão 7 do usuário: "troque o
   julgamento a olho por uma medida"): abaixo dele o CONTORNO de um tipo se confunde
   com o de outro. Tabela `dados/tamanho-minimo-silhueta.json`.
2. **Tamanho mínimo de detalhe interno** (correção do usuário no mesmo dia: a folhosa
   "vira mancha cinza bem antes dos 14 px" que a silhueta deu, porque a hachura some
   antes do contorno): abaixo dele a hachura de dentro não informa mais nada. Tabela
   `dados/tamanho-minimo-detalhe.json`.

## 1. Silhueta distinguível

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

**O tamanho mínimo de silhueta de um tipo** é o menor tamanho da grade a partir do
qual ele se separa de TODOS os outros tipos em todo tamanho maior. Se ele se confunde
com algum tipo até no maior tamanho medido, é esse maior tamanho, com a marca
`nunca_separa`.

**Limite, dito e não escondido**: ela olha só o CONTORNO, e por isso NÃO é medida de
legibilidade. Dois tipos com o mesmo contorno e miolos diferentes (a montanha comum e
a nevada) contam como iguais, e um tipo cujo contorno ainda se separa pode já ter
virado mancha por dentro (a folhosa). É a segunda medida que cobre isso.

## 2. Detalhe interno

**O que se mede**: o símbolo no modo padrão, sobre o papel, em cinza (luminância 0 a
1), reduzido ao maior lado s; e o MESMO símbolo borrado na origem na escala da
própria hachura e só então reduzido. O borrão tem sigma = metade do PERÍODO DA
HACHURA, medido em cada símbolo: a mediana da distância entre o começo de um traço e
o do seguinte, ao longo das linhas do miolo da silhueta (5 a 8,5 px nas folhas
atuais). Um borrão desse tamanho apaga a hachura e guarda as massas de claro e escuro.

**Quando os dois ficam equivalentes**: a diferença RMS de luminância entre os dois,
dentro da silhueta, fica abaixo de `LIMIAR_DETALHE` = 0,03. Justificativa: numa tela
comum vista a 60 cm, um pixel é ~1,4 minuto de arco, e uma hachura de 2 px de
período fica perto de 20 ciclos por grau, onde a vista humana só DETECTA uma grade a
partir de uns 3% a 5% de contraste (Michelson). RMS 0,03 sobre um cinza médio é ~8%
de Michelson: umas duas vezes o limiar de detecção, que é a margem entre ver que há
algo e reconhecer que é hachura. Abaixo disso a hachura existe nos pixels, mas lê
como cinza.

**O tamanho mínimo de detalhe de um tipo** é o menor s a partir do qual a diferença
MEDIANA dos símbolos do tipo fica >= o limiar em todo tamanho maior.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_SILHUETA = RAIZ_MAPAS / "dados" / "tamanho-minimo-silhueta.json"
CAMINHO_DETALHE = RAIZ_MAPAS / "dados" / "tamanho-minimo-detalhe.json"
TAMANHOS = tuple(range(8, 201, 2))
LIMIAR_DETALHE = 0.03
COR_PAPEL = (233, 221, 189)


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


def medir_silhueta(simbolos: list[dict], raiz: Path = RAIZ_MAPAS, tamanhos=TAMANHOS) -> dict:
    """Devolve {tipo: {tamanho_minimo_silhueta, confunde_com, ultimo_tamanho_confuso,
    nunca_separa}} e o ruído por tamanho."""
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
        tabela[tipo] = {"tamanho_minimo_silhueta": piso, "confunde_com": com, "ultimo_tamanho_confuso": em,
                        "nunca_separa": nunca}
    return {"tipos": tabela, "ruido_por_tamanho": {str(k): round(v, 3) for k, v in ruido.items()}}


def periodo_da_hachura(cinza: np.ndarray, miolo: np.ndarray) -> float:
    """Mediana da distância, em px da origem, entre o começo de um traço escuro e o do
    seguinte, ao longo de uma a cada 3 linhas, só dentro do miolo. 6 se não houver."""
    tinta = cinza < 0.5
    distancias = []
    for y in range(0, tinta.shape[0], 3):
        inicios = np.flatnonzero(np.diff(tinta[y].astype(np.int8)) == 1) + 1
        inicios = inicios[miolo[y, inicios]]
        distancias.extend(np.diff(inicios).tolist())
    return float(np.median(distancias)) if distancias else 6.0


def diferenca_de_detalhe(simbolo: dict, raiz: Path, tamanhos) -> tuple[float, list[float]]:
    """(período da hachura, [diferença RMS entre o reduzido e o borrado-e-reduzido, por
    tamanho]), dentro da silhueta."""
    with Image.open(raiz / simbolo["arquivo"]) as im:
        rgba = im.convert("RGBA")
    with Image.open(raiz / simbolo["arquivos"]["branco-opaco"]) as im:
        alfa = im.convert("RGBA").getchannel("A")
    papel = Image.new("RGBA", rgba.size, COR_PAPEL + (255,))
    papel.alpha_composite(rgba)
    cinza = papel.convert("L")
    miolo = np.asarray(alfa.filter(ImageFilter.MinFilter(9))) >= 250
    periodo = periodo_da_hachura(np.asarray(cinza, dtype=np.float64) / 255, miolo)
    borrado = cinza.filter(ImageFilter.GaussianBlur(periodo / 2))
    saida = []
    for s in tamanhos:
        k = s / max(rgba.width, rgba.height)
        tam = (max(1, round(rgba.width * k)), max(1, round(rgba.height * k)))
        r = np.asarray(cinza.resize(tam, Image.LANCZOS), dtype=np.float64) / 255
        b = np.asarray(borrado.resize(tam, Image.LANCZOS), dtype=np.float64) / 255
        dentro = np.asarray(alfa.resize(tam, Image.LANCZOS)) >= 128
        saida.append(float(np.sqrt(((r - b)[dentro] ** 2).mean())) if dentro.any() else 0.0)
    return periodo, saida


def medir_detalhe(simbolos: list[dict], raiz: Path = RAIZ_MAPAS, tamanhos=TAMANHOS,
                  limiar: float = LIMIAR_DETALHE) -> dict:
    """Devolve {tipo: {tamanho_minimo_detalhe, hachura_some_sempre, periodo_hachura_px,
    diferenca_em}}."""
    por_tipo: dict[str, list] = {}
    for s in simbolos:
        por_tipo.setdefault(s["tipo"], []).append(diferenca_de_detalhe(s, raiz, tamanhos))
    tabela = {}
    for tipo, medidas in sorted(por_tipo.items()):
        mediana = np.median([d for _, d in medidas], axis=0)
        minimo = None
        for s, d in sorted(zip(tamanhos, mediana), reverse=True):
            if d < limiar:
                break
            minimo = s
        tabela[tipo] = {
            "tamanho_minimo_detalhe": minimo if minimo is not None else max(tamanhos),
            "hachura_some_sempre": minimo is None,   # nem no maior tamanho passa do limiar
            "periodo_hachura_px": round(float(np.median([p for p, _ in medidas])), 1),
            "diferenca_em": {str(s): round(float(d), 4) for s, d in zip(tamanhos, mediana)
                             if s in (200, 100, 60, 40, 30, 20, 12)},
        }
    return {"tipos": tabela}


def carregar_pisos(silhueta: Path = CAMINHO_SILHUETA, detalhe: Path = CAMINHO_DETALHE) -> dict[str, int]:
    """{tipo: piso em px na resolução oficial} = o MAIOR entre o tamanho mínimo de
    silhueta distinguível e o de detalhe interno."""
    a = json.loads(silhueta.read_text(encoding="utf-8"))["tipos"]
    b = json.loads(detalhe.read_text(encoding="utf-8"))["tipos"]
    return {t: max(a[t]["tamanho_minimo_silhueta"], b.get(t, {}).get("tamanho_minimo_detalhe", 0))
            for t in a}
