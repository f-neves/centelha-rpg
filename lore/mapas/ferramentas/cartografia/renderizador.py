"""Renderizador: dado + símbolos -> imagem (noite 2 e manhã de 2026-09-23).

Desenha uma JANELA do mundo com: mar, costa, a cor de fundo de cada cobertura, os
lagos e os símbolos espalhados dentro das áreas pintadas. Nada mais (rio, estrada,
rótulo e lugar ficam para depois).

**As camadas, de baixo para cima**:

1. Papel na terra, mar fora dela.
2. **Cor de fundo por cobertura** (pedido do usuário na manhã de 2026-09-23): cada área
   da camada `cobertura` pinta uma cor chapada e suave, de atlas em pergaminho
   (`CORES_COBERTURA`), com a borda irregular da etapa 11 e recortada pela costa.
   Campo não tem cor: é o próprio papel. O relevo não pinta fundo.
3. Lago (etapa 12) na cor da água, com margem.
4. A linha da costa.
5. Os símbolos, em traço, por cima.

**Como um símbolo vai parar no mapa**:

1. A área é rasterizada com uma borda mais irregular que a da cor
   (`AMPLITUDE_SIMBOLOS_KM`), recortada pela costa oficial e, se a área tem cor, pela
   mancha de cor dela (nenhum símbolo de floresta fica no papel).
2. Pontos por **Poisson-disc** (Bridson) dentro da máscara: nenhum ponto a menos de
   `raio` de outro. O raio é a densidade do tipo (`TIPOS`).
3. **Profundidade**: quanto o ponto está para dentro da área, de 0 na beira a 1 a
   `profundidade_km` dela (um borrão da máscara numa grade grossa). Ela controla o
   tamanho (`borda` na beira, `miolo` no fundo: é o que dá espinha à cordilheira) e
   quantos pontos ficam (`manter_na_borda`: a franja rala é o que esconde a reta do
   polígono).
4. Cada ponto é a ÂNCORA DE BASE de um símbolo sorteado na mistura do valor da área
   (`MISTURAS`), com o tamanho variando `±variacao`, espelhado ao acaso só se o
   símbolo aceita (a luz vem do noroeste: `recorte.ESPELHAVEL`, medido), e com
   rotação leve se o tipo aceita.
5. **Nenhum símbolo no mar**: a âncora e as duas pontas da base (35% da largura para
   cada lado) têm de cair em terra na máscara oficial, senão o ponto é descartado.
6. **Desenho de cima para baixo**: ordena pela linha da âncora, e o que está mais ao
   sul é desenhado depois, na frente. Símbolo de "só traço" leva um RECHEIO na
   silhueta, da cor do chão debaixo da âncora, senão a montanha da frente deixaria ver
   as linhas da de trás através do branco que virou transparente.

**Resolução**: tudo o que é tamanho está na resolução oficial (1,25 km/px) e é
multiplicado por `janela.px_por_grau / 111,19`. O modo rápido é o mesmo código numa
janela de resolução menor (`scripts/renderizar_regiao.py --rapido`).

**Determinismo**: todo sorteio sai de um gerador com a semente da área
(`semente_ruido`), e as áreas são processadas em ordem de id. O mesmo dado dá a
mesma imagem, byte a byte.

Tudo o que é número aqui (tamanhos, raios, misturas, cores) é RECOMENDAÇÃO do
Cartógrafo, e não decisão.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

from . import legibilidade, raster

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
PX_POR_GRAU_OFICIAL = 111.194927

COR_MAR = (158, 182, 190)
COR_TERRA = (233, 221, 189)      # o papel
COR_COSTA = (72, 62, 50)
COR_LAGO = (150, 184, 204)       # um azul mais limpo que o do mar

# Paleta de atlas em pergaminho (recomendação do Cartógrafo, 2026-09-23): tons
# chapados, dessaturados e claros, para o traço preto dos símbolos continuar lendo por
# cima. Todos mais escuros que o papel só o bastante para a mancha aparecer.
CORES_COBERTURA = {
    "floresta-temperada": (206, 213, 168),   # verde sálvia
    "floresta-boreal": (188, 201, 166),      # verde mais frio e fechado
    "floresta-tropical": (195, 211, 155),    # verde mais quente
    "selva": (170, 190, 138),                # o verde mais escuro
    "deserto": (243, 229, 172),              # amarelo claro de areia
    "pantano": (196, 203, 172),              # verde oliva acinzentado
    "tundra": (210, 212, 194),               # cinza esverdeado
    "geleira": (236, 243, 246),              # branco azulado
    # "campo" fica sem cor: é o papel.
}
# Borrão da borda da cor: suaviza a transição com o papel sem perder a mancha chapada.
SUAVE_COR_KM = 3.0

# Irregularidade da borda da MANCHA DE SÍMBOLOS, maior e mais longa que a da etapa 11
# (12 km, ondas de 40 e 12 km): com aquela, menor que um símbolo (uma árvore ocupa uns
# 45 km), a fileira de símbolos na beira da área desenhava a reta do polígono.
AMPLITUDE_SIMBOLOS_KM = 90.0
OITAVAS_SIMBOLOS = ((220.0, 0.5), (70.0, 0.3), (20.0, 0.2))


@dataclass(frozen=True)
class Tipo:
    tamanho: int                  # maior lado, em px, na resolução oficial (1,25 km/px)
    raio: float                   # distância mínima entre âncoras, em fração do tamanho
    rotacao: float = 0.0          # graus, para cada lado
    variacao: float = 0.20        # tamanho sorteado em ±variacao
    borda: float = 1.0            # multiplicador de tamanho na beira da área
    miolo: float = 1.0            # multiplicador de tamanho no fundo da área
    manter_na_borda: float = 1.0  # fração dos pontos que fica na beira
    profundidade_km: float = 80.0  # a partir de quantos km da beira é "fundo"


# Os valores da noite 2, guardados para comparar e para reproduzir a imagem daquela
# noite (`ESTILO_NOITE2`).
TIPOS_NOITE2 = {
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

# Densidade e tamanho da manhã de 2026-09-23 (pedido 8: "a cordilheira virou tapete
# uniforme e a selva ficou pesada"). Tamanho base e piso legível iguais aos da noite 2.
# - Montanha: pequena na beira (0,65) e grande no fundo (1,35) a 120 km: a espinha. A
#   variação sorteada cai para ±15%, senão ela apaga a espinha.
# - Selva: raio 0,55 -> 0,85 do tamanho (uns 40% menos peças), e a mistura ganha
#   árvore tropical, que é aberta, no lugar de parte das moitas fechadas.
# - Árvores: ±25%, um pouco menores e mais ralas na beira (a franja).
# - Deserto: ±35%, e a franja rala entra fundo (na beira ficam 35% dos pontos, e a
#   proporção sobe até 100% a 150 km para dentro), o que desmancha a grade de dunas.
TIPOS = {
    "montanha": Tipo(80, 0.50, variacao=0.15, borda=0.65, miolo=1.35,
                     manter_na_borda=0.55, profundidade_km=120),
    "montanha-nevada": Tipo(90, 0.50, variacao=0.15, borda=0.65, miolo=1.35,
                            manter_na_borda=0.55, profundidade_km=120),
    "colina": Tipo(52, 0.65, variacao=0.25, borda=0.8, miolo=1.1, manter_na_borda=0.6),
    "arvore-folhosa": Tipo(38, 0.60, 4, variacao=0.25, borda=0.85, miolo=1.1,
                           manter_na_borda=0.45, profundidade_km=60),
    "arvore-conifera": Tipo(38, 0.55, 3, variacao=0.25, borda=0.85, miolo=1.1,
                            manter_na_borda=0.45, profundidade_km=60),
    "arvore-tropical": Tipo(40, 0.70, 4, variacao=0.25, borda=0.85, miolo=1.1,
                            manter_na_borda=0.45, profundidade_km=60),
    "palmeira": Tipo(40, 0.70, 4, variacao=0.25, borda=0.85, miolo=1.1,
                     manter_na_borda=0.45, profundidade_km=60),
    "selva": Tipo(46, 0.85, 3, variacao=0.25, borda=0.85, miolo=1.1,
                  manter_na_borda=0.4, profundidade_km=60),
    "pantano": Tipo(60, 0.90, 2, variacao=0.25, manter_na_borda=0.5),
    "duna": Tipo(52, 1.10, variacao=0.35, borda=0.85, miolo=1.1,
                 manter_na_borda=0.35, profundidade_km=150),
    "rochedo": Tipo(46, 1.10, variacao=0.35),
    "vegetacao-seca": Tipo(60, 1.20, 3, variacao=0.30),
    "tundra": Tipo(100, 1.00, variacao=0.25, manter_na_borda=0.5),
    "geleira": Tipo(64, 0.80, variacao=0.25, borda=0.85, miolo=1.15, manter_na_borda=0.5),
}

# Valor da área -> (tipo, peso). O raio do Poisson e a profundidade são os do PRIMEIRO
# tipo da mistura.
MISTURAS_NOITE2 = {
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
MISTURAS = dict(MISTURAS_NOITE2)
MISTURAS[("cobertura", "selva")] = [("selva", 0.6), ("arvore-tropical", 0.25), ("palmeira", 0.15)]

# O "chão rachado" (vegetacao-seca-04) é textura, não objeto: fica fora do sorteio.
SIMBOLOS_EXCLUIDOS = {"vegetacao-seca-04"}


@dataclass(frozen=True)
class Estilo:
    tipos: dict
    misturas: dict
    cores: dict            # valor de cobertura -> cor de fundo; vazio = tudo papel


ESTILO_NOITE2 = Estilo(TIPOS_NOITE2, MISTURAS_NOITE2, {})
ESTILO_COR = Estilo(TIPOS_NOITE2, MISTURAS_NOITE2, CORES_COBERTURA)
ESTILO = Estilo(TIPOS, MISTURAS, CORES_COBERTURA)
ESTILOS = {"noite2": ESTILO_NOITE2, "cor": ESTILO_COR, "cor-densidade": ESTILO}


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

    def _sprite_base(self, s: dict, recheio: tuple) -> Image.Image:
        """O símbolo pronto para colar: no modo branco-opaco, o próprio PNG; no só
        traço, a silhueta pintada da cor do chão (`recheio`) com o traço por cima (o
        que faz a peça da frente esconder a de trás)."""
        chave = ("base", s["id"], recheio if s["modo_padrao"] == "so-traco" else None)
        if chave not in self._cache:
            with Image.open(self.raiz / s["arquivo"]) as im:
                principal = im.convert("RGBA")
            if s["modo_padrao"] == "so-traco":
                with Image.open(self.raiz / s["arquivos"]["branco-opaco"]) as im:
                    silhueta = np.asarray(im.convert("RGBA"))[..., 3]
                cheio = np.zeros(silhueta.shape + (4,), dtype=np.uint8)
                cheio[..., :3] = recheio
                cheio[..., 3] = silhueta
                sprite = Image.fromarray(cheio, "RGBA")
                sprite.alpha_composite(principal)
            else:
                sprite = principal
            self._cache[chave] = sprite
        return self._cache[chave]

    def sprite(self, s: dict, maior_lado: int, espelhar: bool, rotacao: float,
               recheio: tuple = COR_TERRA) -> tuple[Image.Image, tuple[int, int]]:
        """Imagem pronta e a âncora de base nela, em pixels."""
        chave = (s["id"], maior_lado, espelhar, round(rotacao), tuple(recheio))
        if chave not in self._cache:
            base = self._sprite_base(s, tuple(recheio))
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

_PISOS: dict[str, int] = {}


def pisos() -> dict[str, int]:
    """O piso MEDIDO de cada tipo, em px na resolução oficial: o maior entre o tamanho
    mínimo de silhueta distinguível e o de detalhe interno
    (`dados/tamanho-minimo-silhueta.json` e `dados/tamanho-minimo-detalhe.json`, gerados
    por `scripts/medir_legibilidade.py`). É o limite inferior de todo símbolo colocado."""
    if not _PISOS:
        _PISOS.update(legibilidade.carregar_pisos())
    return _PISOS

@dataclass(frozen=True)
class Colocacao:
    simbolo: str
    x: float          # âncora na janela, px
    y: float
    maior_lado: int
    espelhar: bool
    rotacao: float
    recheio: tuple = COR_TERRA


def base_em_terra(terra: np.ndarray, x: float, y: float, meia_base: float) -> bool:
    altura, largura = terra.shape
    for dx in (-meia_base, 0.0, meia_base):
        px, py = int(x + dx), int(y)
        if not (0 <= px < largura and 0 <= py < altura) or not terra[py, px]:
            return False
    return True


def profundidade(mascara: np.ndarray, alcance_px: float) -> np.ndarray:
    """0 na beira da máscara, 1 a `alcance_px` para dentro (e 0 fora). Um borrão da
    máscara: na beira ele vale 0,5, e no fundo 1. Feito numa grade grossa (um pixel
    grosso a cada ~1/6 do alcance) e ampliado, porque o borrão largo na resolução
    cheia custaria mais que o resto do mapa."""
    altura, largura = mascara.shape
    passo = max(1, int(alcance_px / 6))
    pequena = Image.fromarray((mascara > 0).astype(np.uint8) * 255).resize(
        (max(1, -(-largura // passo)), max(1, -(-altura // passo))), Image.BOX)
    borrada = pequena.filter(ImageFilter.GaussianBlur(max(0.5, alcance_px / passo / 2)))
    v = np.asarray(borrada.resize((largura, altura), Image.BILINEAR), dtype=np.float64) / 255.0
    return np.clip((v - 0.5) * 2.0, 0.0, 1.0) * (mascara > 0)


# --- piso x densidade (pedido do usuário, 2026-09-23 à noite) ------------------
#
# O raio do Poisson sai do tamanho PEDIDO (`Tipo.tamanho`), e não do desenhado. Então,
# quando o piso sobe um símbolo, a contagem NÃO cai: os mesmos pontos recebem símbolos
# maiores, e eles se sobrepõem mais do que a densidade pedia. O aviso mede isso em
# duas contas, e as duas são por área e por tipo:
#
# - `razao` = tamanho médio desenhado / tamanho médio pedido. Para manter a folga
#   entre símbolos que a densidade pede (raio em fração do tamanho), só caberiam
#   n / razao² deles. Aviso quando isso é pelo menos `LIMIAR_PERDA_PELO_PISO` a menos.
# - `cabem` = n / razao², o número que caberia com a folga pedida. Aviso quando fica
#   abaixo de `MINIMO_SIMBOLOS_NA_AREA`: a área é pequena demais para o tipo nesta
#   escala (a "floresta de quatro árvores").
#
# Os dois números são recomendação do Cartógrafo.
LIMIAR_PERDA_PELO_PISO = 0.20
MINIMO_SIMBOLOS_NA_AREA = 10


@dataclass
class _Conta:
    n: int = 0
    no_piso: int = 0
    pedido: float = 0.0
    desenhado: float = 0.0


@dataclass(frozen=True)
class Aviso:
    area: str
    valor: str
    tipo: str
    n: int                 # símbolos colocados deste tipo nesta área
    no_piso: int           # quantos deles o piso aumentou
    razao: float           # tamanho médio desenhado / pedido
    cabem: float           # quantos deste tipo caberiam com a folga pedida (n / razao²)
    cabem_na_area: float   # a mesma conta somada em todos os tipos da área
    motivos: tuple         # "piso" e/ou "poucos"
    cortada: bool = False  # a mancha encosta na borda da janela: a conta é de um pedaço

    def texto(self) -> str:
        partes = []
        if "piso" in self.motivos:
            partes.append(f"o piso aumentou {self.no_piso} de {self.n} (tamanho médio {self.razao:.2f}x "
                          f"o pedido); com a folga pedida caberiam {self.cabem:.0f}, "
                          f"{1 - self.cabem / self.n:.0%} a menos")
        if "poucos" in self.motivos and self.n == 0:
            partes.append("nenhum símbolo: a área está na janela e ficou vazia (a borda "
                          "irregular dos símbolos pode comê-la inteira)")
        elif "poucos" in self.motivos:
            partes.append(f"na área toda só {self.cabem_na_area:.0f} cabem com a folga pedida "
                          f"(mínimo {MINIMO_SIMBOLOS_NA_AREA})")
        corte = " [cortada pela janela: conta só o pedaço dentro dela]" if self.cortada else ""
        return f"{self.area} ({self.valor}), {self.tipo}: " + "; ".join(partes) + corte


def _avisos_da_area(props: dict, contas: dict[str, _Conta], principal: str,
                    cortada: bool) -> list[Aviso]:
    if not any(c.n for c in contas.values()):
        # Mancha dentro da janela e nenhum símbolo: o caso extremo de "poucos".
        return [Aviso(props["id"], props["valor"], principal, 0, 0, 1.0, 0.0, 0.0, ("poucos",), cortada)]
    saida = []
    total_cabem = 0.0
    por_tipo = []
    for tipo, c in contas.items():
        if not c.n:
            continue
        razao = (c.desenhado / c.n) / (c.pedido / c.n)
        cabem = c.n / razao ** 2
        total_cabem += cabem
        por_tipo.append((tipo, c, razao, cabem))
    for tipo, c, razao, cabem in por_tipo:
        motivos = []
        if 1 - cabem / c.n >= LIMIAR_PERDA_PELO_PISO:
            motivos.append("piso")
        # "Poucos" olha a área INTEIRA: uma floresta com 30 folhosas e 3 coníferas não é
        # pequena. O aviso sai no tipo principal da mistura, uma vez.
        if tipo == por_tipo[0][0] and total_cabem < MINIMO_SIMBOLOS_NA_AREA:
            motivos.append("poucos")
        if motivos:
            saida.append(Aviso(props["id"], props["valor"], tipo, c.n, c.no_piso, round(razao, 3),
                               round(cabem, 1), round(total_cabem, 1), tuple(motivos), cortada))
    return saida


def faixa_comida_pelo_piso(estilo: Estilo = ESTILO) -> dict[str, float]:
    """Por tipo, a fração da faixa de tamanho pedida (de `tamanho x borda x (1 -
    variacao)` a `tamanho x miolo x (1 + variacao)`) que fica abaixo do piso: é quanto
    da variação e da franja o piso apaga, antes de qualquer área."""
    saida = {}
    for tipo, t in estilo.tipos.items():
        baixo = t.tamanho * t.borda * (1 - t.variacao)
        alto = t.tamanho * t.miolo * (1 + t.variacao)
        piso = pisos().get(tipo, 0)
        saida[tipo] = round(min(1.0, max(0.0, (piso - baixo) / (alto - baixo))) if alto > baixo
                            else float(piso > baixo), 3)
    return saida


def colocar_na_area(area: dict, mascara: np.ndarray, terra: np.ndarray, bib: Biblioteca,
                    escala: float = 1.0, estilo: Estilo = ESTILO,
                    chao: np.ndarray | None = None,
                    avisos: list | None = None,
                    na_janela: np.ndarray | None = None) -> list[Colocacao]:
    """`chao` (opcional, altura x largura x 3) é a cor do chão por pixel; o recheio
    do símbolo "só traço" é a cor debaixo da âncora. `avisos` (opcional) recebe os
    `Aviso` de piso x densidade desta área; passar ou não passar não muda nada do que
    é colocado. `na_janela` é a área crua (sem ruído) em terra dentro da janela: é
    ela que diz se a área está aqui, porque a borda de 90 km dos símbolos pode comer
    uma área pequena inteira (sem ela, `mascara`)."""
    props = area["properties"]
    mistura = estilo.misturas.get((props["camada"], props["valor"]))
    if not mistura:
        return []
    rng = np.random.default_rng(int(props.get("semente_ruido") or 0))
    principal = estilo.tipos[mistura[0][0]]
    raio = principal.tamanho * principal.raio * escala
    m = mascara > 0
    pontos = poisson_disc(m, raio, rng)
    fundo_da_area = profundidade(mascara, principal.profundidade_km / 1.25 * escala)
    tipos = [t for t, _ in mistura]
    pesos = np.array([p for _, p in mistura], dtype=float)
    pesos /= pesos.sum()
    saida = []
    contas: dict[str, _Conta] = {}
    for x, y in pontos:
        tipo = tipos[int(rng.choice(len(tipos), p=pesos))]
        conf = estilo.tipos[tipo]
        candidatos = bib.simbolos.get(tipo, [])
        if not candidatos:
            continue
        s = candidatos[int(rng.integers(len(candidatos)))]
        t = float(fundo_da_area[int(y), int(x)])
        piso = pisos().get(tipo, 0) * escala
        perto = conf.borda + (conf.miolo - conf.borda) * t
        pedido = conf.tamanho * escala * perto * rng.uniform(1 - conf.variacao, 1 + conf.variacao)
        maior = int(round(max(piso, pedido)))
        espelhar = bool(s["espelhavel"] and rng.random() < 0.5)
        rot = float(rng.uniform(-conf.rotacao, conf.rotacao)) if conf.rotacao else 0.0
        fica = conf.manter_na_borda + (1 - conf.manter_na_borda) * t
        if fica < 1.0 and rng.random() >= fica:
            continue
        largura = maior * min(1.0, s["largura"] / max(s["largura"], s["altura"]))
        if not base_em_terra(terra, x, y, 0.35 * largura):
            continue
        recheio = COR_TERRA if chao is None else tuple(int(c) for c in chao[int(y), int(x)])
        saida.append(Colocacao(s["id"], x, y, maior, espelhar, rot, recheio))
        c = contas.setdefault(tipo, _Conta())
        c.n += 1
        c.no_piso += piso > pedido
        c.pedido += pedido
        c.desenhado += maior
    presente = m if na_janela is None else (na_janela > 0) | m
    if avisos is not None and presente.any():
        # Tipo principal primeiro: é nele que sai o aviso de "poucos".
        ordem = {t: i for i, t in enumerate(tipos)}
        cortada = bool(presente[0].any() or presente[-1].any() or presente[:, 0].any()
                       or presente[:, -1].any())
        avisos.extend(_avisos_da_area(props, dict(sorted(contas.items(), key=lambda kv: ordem[kv[0]])),
                                      tipos[0], cortada))
    return saida


# --- a imagem -----------------------------------------------------------------

def pintar_chao(areas: list[dict], janela: raster.Janela, terra: np.ndarray, km_por_grau: float,
                cores: dict) -> tuple[np.ndarray, np.ndarray, dict]:
    """A cor do chão da terra: papel, e por cima a cor de cada cobertura que tem cor.
    Devolve a imagem suave (float, para o fundo), a chapada (uint8, sem o borrão da
    beira, que dá o recheio dos símbolos) e a máscara da cor de cada área, por id."""
    suave = np.zeros(terra.shape + (3,), dtype=np.float32)
    suave[:] = COR_TERRA
    chapada = np.zeros(terra.shape + (3,), dtype=np.uint8)
    chapada[:] = COR_TERRA
    suaviza_px = SUAVE_COR_KM / janela.km_por_px(km_por_grau)
    folga = int(math.ceil(3 * suaviza_px)) + 1
    altura, largura = terra.shape
    mascaras = {}
    for area in sorted(areas, key=lambda a: a["properties"]["id"]):
        props = area["properties"]
        cor = cores.get(props.get("valor")) if props.get("camada") == "cobertura" else None
        if cor is None:
            continue
        m = raster.rasterizar(area["geometry"], int(props.get("semente_ruido") or 0),
                              janela, km_por_grau, terra=terra)
        linhas, colunas = np.flatnonzero(m.any(1)), np.flatnonzero(m.any(0))
        if len(linhas) == 0:
            continue
        chapada[m > 0] = cor
        mascaras[props["id"]] = m > 0
        # Só a caixa da área (com a folga do borrão): a imagem inteira em ponto
        # flutuante, uma vez por área, pesaria centenas de MB num recorte de região.
        y0, y1 = max(0, linhas[0] - folga), min(altura, linhas[-1] + folga + 1)
        x0, x1 = max(0, colunas[0] - folga), min(largura, colunas[-1] + folga + 1)
        pedaco = Image.fromarray(np.ascontiguousarray(m[y0:y1, x0:x1]))
        alfa = np.asarray(pedaco.filter(ImageFilter.GaussianBlur(suaviza_px)),
                          dtype=np.float32)[..., None] / 255.0
        suave[y0:y1, x0:x1] = suave[y0:y1, x0:x1] * (1 - alfa) + np.array(cor, dtype=np.float32) * alfa
    return suave, chapada, mascaras


def fundo(terra: np.ndarray, chao: np.ndarray | None = None,
          lagos: np.ndarray | None = None) -> Image.Image:
    """`terra` já sem os lagos. `chao` é a cor da terra por pixel (senão, o papel);
    `lagos` pinta a água deles na cor do lago (senão, na do mar)."""
    img = np.zeros(terra.shape + (3,), dtype=np.uint8)
    img[:] = COR_MAR
    if lagos is not None:
        img[lagos] = COR_LAGO
    if chao is None:
        img[terra] = COR_TERRA
    else:
        img[terra] = np.clip(np.round(chao[terra]), 0, 255).astype(np.uint8)
    engordada = np.asarray(Image.fromarray(terra.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
    img[engordada & ~terra] = COR_COSTA
    return Image.fromarray(img, "RGB").convert("RGBA")


def desenhar(terra: np.ndarray, colocacoes: list[Colocacao], bib: Biblioteca,
             chao: np.ndarray | None = None, lagos: np.ndarray | None = None) -> Image.Image:
    tela = fundo(terra, chao, lagos)
    por_id = {s["id"]: s for lista in bib.simbolos.values() for s in lista}
    # Norte primeiro, sul por cima; empate desfeito por x e pelo id, para a ordem não
    # depender de nada além do dado.
    for c in sorted(colocacoes, key=lambda c: (c.y, c.x, c.simbolo)):
        im, (ax, ay) = bib.sprite(por_id[c.simbolo], c.maior_lado, c.espelhar, c.rotacao, c.recheio)
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


def mascara_de_lagos(areas: list[dict], janela: raster.Janela, terra: np.ndarray,
                     km_por_grau: float) -> np.ndarray:
    """Etapa 12 no mapa desenhado: toda área da camada `lago`, com a borda irregular da
    etapa 11 (12 km, a mesma de qualquer área) e recortada pela costa (lago é água
    DENTRO da terra; a parte que cair no mar já é mar)."""
    lagos = np.zeros(terra.shape, dtype=bool)
    for area in sorted(areas, key=lambda a: a["properties"]["id"]):
        if area["properties"].get("camada") != "lago":
            continue
        m = raster.rasterizar(area["geometry"], int(area["properties"].get("semente_ruido") or 0),
                              janela, km_por_grau, terra=terra)
        lagos |= m > 0
    return lagos


def renderizar(areas: list[dict], janela: raster.Janela, terra: np.ndarray, bib: Biblioteca,
               km_por_grau: float, estilo: Estilo = ESTILO,
               avisos: list | None = None) -> tuple[Image.Image, list[Colocacao]]:
    """`avisos` (opcional): lista que recebe os `Aviso` de piso x densidade de cada área.
    Não muda a imagem nem as colocações."""
    escala = janela.px_por_grau / PX_POR_GRAU_OFICIAL
    # Lago vira água antes de tudo: o fundo o pinta da cor do lago com a margem
    # desenhada (a mesma regra da costa), e símbolo nenhum apoia a base dentro dele.
    lagos = mascara_de_lagos(areas, janela, terra, km_por_grau)
    terra = terra & ~lagos
    suave = chapada = None
    com_cor = {}
    if estilo.cores:
        suave, chapada, com_cor = pintar_chao(areas, janela, terra, km_por_grau, estilo.cores)
    colocacoes = []
    for area in sorted(areas, key=lambda a: a["properties"]["id"]):
        if area["properties"].get("camada") == "lago":
            continue
        mascara = raster.rasterizar(area["geometry"], int(area["properties"].get("semente_ruido") or 0),
                                    janela, km_por_grau, amplitude_km=AMPLITUDE_SIMBOLOS_KM,
                                    terra=terra, oitavas=OITAVAS_SIMBOLOS)
        if area["properties"]["id"] in com_cor:
            # A mancha de símbolos não sai da mancha de cor: sem isso a borda de 90 km
            # dos símbolos passava da de 12 km da cor, e sobrava árvore no papel.
            mascara = np.where(com_cor[area["properties"]["id"]], mascara, 0).astype(np.uint8)
        na_janela = None
        if avisos is not None:
            na_janela = (raster.rasterizar_reto(area["geometry"], janela) > 0) & terra
        colocacoes.extend(colocar_na_area(area, mascara, terra, bib, escala, estilo, chapada, avisos,
                                          na_janela))
    return desenhar(terra, colocacoes, bib, suave, lagos if estilo.cores else None), colocacoes
