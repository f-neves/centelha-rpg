"""Primeiro renderizador: dado + símbolos -> imagem (noite 2, 2026-09-23).

Desenha uma JANELA do mundo com: mar, costa, cor base da terra e os símbolos
espalhados dentro das áreas pintadas. Nada mais (rio, estrada, rótulo e lugar ficam
para depois).

**Como um símbolo vai parar no mapa**:

1. A área é rasterizada com a borda irregular da etapa 11 (`raster.py`) e recortada
   pela costa oficial.
2. Pontos por **Poisson-disc** (Bridson) dentro da máscara: nenhum ponto a menos de
   `raio` de outro, o que dá a mancha regular sem parecer grade. O raio é a densidade
   de cada tipo (`TIPOS`).
3. Cada ponto é a ÂNCORA DE BASE de um símbolo sorteado na mistura do valor da área
   (`MISTURAS`), com o tamanho variando ±20%, espelhado ao acaso se o símbolo aceita,
   e com rotação leve se o tipo aceita.
4. **Nenhum símbolo no mar**: a âncora e as duas pontas da base (35% da largura para
   cada lado) têm de cair em terra na máscara oficial, senão o ponto é descartado.
5. **Desenho de cima para baixo**: ordena pela linha da âncora, e o que está mais ao
   sul é desenhado depois, na frente. Símbolo de "só traço" leva um RECHEIO da cor da
   terra na silhueta dele, senão a montanha da frente deixaria ver as linhas da de
   trás através do branco que virou transparente.

**Determinismo**: todo sorteio sai de um gerador com a semente da área
(`semente_ruido`), e as áreas são processadas em ordem de id. O mesmo dado dá a
mesma imagem, byte a byte.

Tudo o que é número aqui (tamanhos, raios, misturas, cores) é RECOMENDAÇÃO do
Cartógrafo para a primeira vez que o mapa aparece, e não decisão.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

from . import raster, reducao

RAIZ_MAPAS = Path(__file__).resolve().parents[2]

COR_MAR = (158, 182, 190)
COR_TERRA = (233, 221, 189)
COR_COSTA = (72, 62, 50)

# Irregularidade da borda da MANCHA DE SÍMBOLOS, maior e mais longa que a da etapa 11
# (12 km, ondas de 40 e 12 km): com aquela, menor que um símbolo (uma árvore ocupa uns
# 45 km), a fileira de símbolos na beira da área desenhava a reta do polígono. Achado
# olhando o primeiro recorte; 40 km com as mesmas ondas ainda deixava a reta.
AMPLITUDE_SIMBOLOS_KM = 90.0
OITAVAS_SIMBOLOS = ((220.0, 0.5), (70.0, 0.3), (20.0, 0.2))


@dataclass(frozen=True)
class Tipo:
    tamanho: int          # maior lado, em px, na resolução oficial (1,25 km/px)
    raio: float           # distância mínima entre âncoras, em fração do tamanho
    rotacao: float = 0.0  # graus, para cada lado


# Tamanhos a partir das tiras de redução: nenhum abaixo do mínimo legível do tipo.
TIPOS = {
    "montanha": Tipo(80, 0.50),
    "montanha-nevada": Tipo(90, 0.50),
    "colina": Tipo(52, 0.60),
    "arvore-folhosa": Tipo(38, 0.55, 4),
    "arvore-conifera": Tipo(38, 0.50, 3),
    "arvore-tropical": Tipo(40, 0.60, 4),
    "palmeira": Tipo(40, 0.60, 4),
    "selva": Tipo(46, 0.55, 3),
    "pantano": Tipo(60, 0.80, 2),
    "duna": Tipo(52, 1.10),
    "rochedo": Tipo(46, 1.10),
    "vegetacao-seca": Tipo(60, 1.20, 3),
    "tundra": Tipo(100, 0.90),
    "geleira": Tipo(64, 0.75),
}

# Valor da área -> (tipo, peso). O raio do Poisson é o do PRIMEIRO tipo da mistura.
MISTURAS = {
    ("relevo", "montanha"): [("montanha", 1.0)],
    ("relevo", "alta-montanha"): [("montanha-nevada", 1.0)],
    ("relevo", "colina"): [("colina", 1.0)],
    ("cobertura", "floresta-temperada"): [("arvore-folhosa", 0.85), ("arvore-conifera", 0.15)],
    ("cobertura", "floresta-boreal"): [("arvore-conifera", 1.0)],
    ("cobertura", "floresta-tropical"): [("arvore-tropical", 0.6), ("palmeira", 0.4)],
    ("cobertura", "selva"): [("selva", 0.85), ("palmeira", 0.15)],
    ("cobertura", "deserto"): [("duna", 0.7), ("rochedo", 0.15), ("vegetacao-seca", 0.15)],
    ("cobertura", "pantano"): [("pantano", 1.0)],
    ("cobertura", "tundra"): [("tundra", 1.0)],
    ("cobertura", "geleira"): [("geleira", 1.0)],
}

# O "chão rachado" (vegetacao-seca-04) é textura, não objeto: fica fora do sorteio.
SIMBOLOS_EXCLUIDOS = {"vegetacao-seca-04"}


# --- Poisson-disc (Bridson) -------------------------------------------------------

def poisson_disc(mascara: np.ndarray, raio: float, rng: np.random.Generator,
                 tentativas: int = 20) -> list[tuple[float, float]]:
    """Pontos (x, y) dentro de `mascara` (verdadeiro = pode), a pelo menos `raio` uns
    dos outros. Semeado em vários pontos da máscara, para cobrir manchas desconexas."""
    altura, largura = mascara.shape
    celula = raio / math.sqrt(2)
    gw, gh = int(math.ceil(largura / celula)), int(math.ceil(altura / celula))
    grade = -np.ones((gh, gw), dtype=np.int64)
    pontos: list[tuple[float, float]] = []
    ativos: list[int] = []

    def cabe(x: float, y: float) -> bool:
        if not (0 <= x < largura and 0 <= y < altura) or not mascara[int(y), int(x)]:
            return False
        gx, gy = int(x / celula), int(y / celula)
        for yy in range(max(0, gy - 2), min(gh, gy + 3)):
            for xx in range(max(0, gx - 2), min(gw, gx + 3)):
                k = grade[yy, xx]
                if k >= 0:
                    px, py = pontos[k]
                    if (px - x) ** 2 + (py - y) ** 2 < raio * raio:
                        return False
        return True

    def por(x: float, y: float) -> None:
        grade[int(y / celula), int(x / celula)] = len(pontos)
        ativos.append(len(pontos))
        pontos.append((x, y))

    ys, xs = np.nonzero(mascara)
    if len(xs) == 0:
        return []
    # Sementes: uma a cada tantos pixels da máscara, em ordem sorteada.
    n_sementes = max(1, len(xs) // int(max(1, (raio * 6) ** 2)))
    for k in rng.permutation(len(xs))[: n_sementes * 4]:
        x, y = xs[k] + 0.5, ys[k] + 0.5
        if cabe(x, y):
            por(x, y)
        while ativos:
            i = int(rng.integers(len(ativos)))
            bx, by = pontos[ativos[i]]
            achou = False
            for _ in range(tentativas):
                ang = rng.uniform(0, 2 * math.pi)
                dist = rng.uniform(raio, 2 * raio)
                nx, ny = bx + dist * math.cos(ang), by + dist * math.sin(ang)
                if cabe(nx, ny):
                    por(nx, ny)
                    achou = True
                    break
            if not achou:
                ativos.pop(i)
    return pontos


# --- biblioteca ---------------------------------------------------------------

@dataclass
class Biblioteca:
    simbolos: dict[str, list[dict]]
    raiz: Path
    _cache: dict = field(default_factory=dict)

    @classmethod
    def carregar(cls, caminho_manifesto: Path, raiz: Path = RAIZ_MAPAS) -> "Biblioteca":
        manifesto = json.loads(caminho_manifesto.read_text(encoding="utf-8"))
        por_tipo: dict[str, list[dict]] = {}
        for s in manifesto["simbolos"]:
            if s["id"] not in SIMBOLOS_EXCLUIDOS:
                por_tipo.setdefault(s["tipo"], []).append(s)
        return cls(por_tipo, raiz)

    def _sprite_base(self, s: dict) -> Image.Image:
        """O símbolo pronto para colar: no modo branco-opaco, o próprio PNG; no só
        traço, a silhueta pintada da cor da terra com o traço por cima (o recheio que
        faz a peça da frente esconder a de trás)."""
        chave = ("base", s["id"])
        if chave not in self._cache:
            with Image.open(self.raiz / s["arquivo"]) as im:
                principal = im.convert("RGBA")
            if s["modo_padrao"] == "so-traco":
                with Image.open(self.raiz / s["arquivos"]["branco-opaco"]) as im:
                    silhueta = np.asarray(im.convert("RGBA"))[..., 3]
                recheio = np.zeros(silhueta.shape + (4,), dtype=np.uint8)
                recheio[..., :3] = COR_TERRA
                recheio[..., 3] = silhueta
                sprite = Image.fromarray(recheio, "RGBA")
                sprite.alpha_composite(principal)
            else:
                sprite = principal
            self._cache[chave] = sprite
        return self._cache[chave]

    def sprite(self, s: dict, maior_lado: int, espelhar: bool, rotacao: float) -> tuple[Image.Image, tuple[int, int]]:
        """Imagem pronta e a âncora de base nela, em pixels."""
        chave = (s["id"], maior_lado, espelhar, round(rotacao))
        if chave not in self._cache:
            base = self._sprite_base(s)
            escala = maior_lado / max(base.width, base.height)
            im = base.resize((max(1, round(base.width * escala)), max(1, round(base.height * escala))),
                             Image.LANCZOS)
            ax, ay = s["ancora"]["x"] * escala, s["ancora"]["y"] * escala
            if espelhar:
                im = im.transpose(Image.FLIP_LEFT_RIGHT)
                ax = im.width - ax
            if round(rotacao):
                # Gira em volta da âncora: o pé do símbolo não sai do lugar.
                im = im.rotate(round(rotacao), resample=Image.BICUBIC, expand=False,
                               center=(ax, ay))
            self._cache[chave] = (im, (int(round(ax)), int(round(ay))))
        return self._cache[chave]


# --- colocação ----------------------------------------------------------------

@dataclass(frozen=True)
class Colocacao:
    simbolo: str
    x: float          # âncora na janela, px
    y: float
    maior_lado: int
    espelhar: bool
    rotacao: float


def base_em_terra(terra: np.ndarray, x: float, y: float, meia_base: float) -> bool:
    altura, largura = terra.shape
    for dx in (-meia_base, 0.0, meia_base):
        px, py = int(x + dx), int(y)
        if not (0 <= px < largura and 0 <= py < altura) or not terra[py, px]:
            return False
    return True


def colocar_na_area(area: dict, mascara: np.ndarray, terra: np.ndarray, bib: Biblioteca,
                    escala: float = 1.0) -> list[Colocacao]:
    props = area["properties"]
    mistura = MISTURAS.get((props["camada"], props["valor"]))
    if not mistura:
        return []
    rng = np.random.default_rng(int(props.get("semente_ruido") or 0))
    principal = TIPOS[mistura[0][0]]
    raio = principal.tamanho * principal.raio * escala
    pontos = poisson_disc(mascara > 0, raio, rng)
    tipos = [t for t, _ in mistura]
    pesos = np.array([p for _, p in mistura], dtype=float)
    pesos /= pesos.sum()
    saida = []
    for x, y in pontos:
        tipo = tipos[int(rng.choice(len(tipos), p=pesos))]
        conf = TIPOS[tipo]
        candidatos = bib.simbolos.get(tipo, [])
        if not candidatos:
            continue
        s = candidatos[int(rng.integers(len(candidatos)))]
        piso = reducao.TAMANHO_MINIMO_LEGIVEL.get(tipo, 0)
        maior = max(piso, int(round(conf.tamanho * escala * rng.uniform(0.8, 1.2))))
        espelhar = bool(s["espelhavel"] and rng.random() < 0.5)
        rot = float(rng.uniform(-conf.rotacao, conf.rotacao)) if conf.rotacao else 0.0
        largura = maior * min(1.0, s["largura"] / max(s["largura"], s["altura"]))
        if not base_em_terra(terra, x, y, 0.35 * largura):
            continue
        saida.append(Colocacao(s["id"], x, y, maior, espelhar, rot))
    return saida


# --- a imagem -----------------------------------------------------------------

def fundo(terra: np.ndarray) -> Image.Image:
    img = np.zeros(terra.shape + (3,), dtype=np.uint8)
    img[:] = COR_MAR
    img[terra] = COR_TERRA
    engordada = np.asarray(Image.fromarray(terra.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
    img[engordada & ~terra] = COR_COSTA
    return Image.fromarray(img, "RGB").convert("RGBA")


def desenhar(terra: np.ndarray, colocacoes: list[Colocacao], bib: Biblioteca) -> Image.Image:
    tela = fundo(terra)
    por_id = {s["id"]: s for lista in bib.simbolos.values() for s in lista}
    # Norte primeiro, sul por cima; empate desfeito por x e pelo id, para a ordem não
    # depender de nada além do dado.
    for c in sorted(colocacoes, key=lambda c: (c.y, c.x, c.simbolo)):
        im, (ax, ay) = bib.sprite(por_id[c.simbolo], c.maior_lado, c.espelhar, c.rotacao)
        _colar_cortado(tela, im, int(round(c.x)) - ax, int(round(c.y)) - ay)
    return tela.convert("RGB")


def _colar_cortado(tela: Image.Image, im: Image.Image, x: int, y: int) -> None:
    """Cola com alfa; `alpha_composite` não aceita destino fora da tela, então o
    pedaço que sobra além da borda é cortado antes."""
    x0, y0 = max(0, -x), max(0, -y)
    x1, y1 = min(im.width, tela.width - x), min(im.height, tela.height - y)
    if x1 <= x0 or y1 <= y0:
        return
    tela.alpha_composite(im.crop((x0, y0, x1, y1)), (x + x0, y + y0))


def renderizar(areas: list[dict], janela: raster.Janela, terra: np.ndarray, bib: Biblioteca,
               km_por_grau: float) -> tuple[Image.Image, list[Colocacao]]:
    escala = janela.px_por_grau / 111.194927
    colocacoes = []
    for area in sorted(areas, key=lambda a: a["properties"]["id"]):
        mascara = raster.rasterizar(area["geometry"], int(area["properties"].get("semente_ruido") or 0),
                                    janela, km_por_grau, amplitude_km=AMPLITUDE_SIMBOLOS_KM,
                                    terra=terra, oitavas=OITAVAS_SIMBOLOS)
        colocacoes.extend(colocar_na_area(area, mascara, terra, bib, escala))
    return desenhar(terra, colocacoes, bib), colocacoes
