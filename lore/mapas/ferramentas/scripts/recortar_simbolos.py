"""Recorta a biblioteca de símbolos das folhas em `lore/mapas/icons/` e monta a folha
de contato para conferência.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/recortar_simbolos.py

Saídas:
- `lore/mapas/simbolos/<tipo>/<modo>/<tipo>-NN.png` (fora do git, regenerável);
- `lore/mapas/dados/simbolos.json` (o manifesto, no git);
- `lore/mapas/render/analise/folha-de-contato.png` (fora do git).

O recorte em si mora em `cartografia/recorte.py`; este arquivo só chama e desenha a
folha de contato. Sai com código 1 se alguma folha falhar nas conferências.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from cartografia import recorte  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
PASTA_ANALISE = RAIZ_MAPAS / "render" / "analise"

# Cor de papel provisória só para a conferência: o mapa ainda não tem paleta decidida.
COR_PAPEL = (236, 226, 200)


def fonte_legivel(tamanho: int):
    """Arial do Windows, que tem acento; a fonte embutida do Pillow troca "ã" por
    caixinha. Sem a Arial (outra máquina), cai na embutida."""
    try:
        return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", tamanho)
    except OSError:
        return ImageFont.load_default(size=tamanho)


def folha_de_contato(manifesto: dict, destino: Path, raiz_mapas: Path = RAIZ_MAPAS) -> Path:
    """Cada símbolo numa célula: à esquerda o modo so-traco, à direita o branco-opaco,
    os dois sobre a cor de papel; o modo padrão tem moldura, e a âncora de base é a
    cruz vermelha. Numerados na ordem do manifesto."""
    simbolos = manifesto["simbolos"]
    lado, rotulo, colunas = 110, 28, 6
    larg_cel, alt_cel = 2 * lado + 12, lado + rotulo + 8
    linhas = (len(simbolos) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * larg_cel, linhas * alt_cel), (250, 248, 242))
    desenho = ImageDraw.Draw(folha)
    fonte = fonte_legivel(12)
    for n, s in enumerate(simbolos):
        cx, cy = (n % colunas) * larg_cel, (n // colunas) * alt_cel
        for i, modo in enumerate(("so-traco", "branco-opaco")):
            with Image.open(raiz_mapas / s["arquivos"][modo]) as im:
                im = im.convert("RGBA")
                escala = min(lado / im.width, lado / im.height)
                miniatura = im.resize((max(1, round(im.width * escala)), max(1, round(im.height * escala))),
                                      Image.LANCZOS)
            x, y = cx + 4 + i * (lado + 4), cy + 4
            fundo = Image.new("RGBA", (lado, lado), COR_PAPEL + (255,))
            ox, oy = (lado - miniatura.width) // 2, (lado - miniatura.height) // 2
            fundo.alpha_composite(miniatura, (ox, oy))
            folha.paste(fundo.convert("RGB"), (x, y))
            if modo == s["modo_padrao"]:
                desenho.rectangle([x - 1, y - 1, x + lado, y + lado], outline=(40, 90, 200), width=2)
                ax = x + ox + round(s["ancora"]["x"] * escala)
                ay = y + oy + round(s["ancora"]["y"] * escala)
                desenho.line([ax - 4, ay, ax + 4, ay], fill=(220, 0, 0), width=1)
                desenho.line([ax, ay - 4, ax, ay + 4], fill=(220, 0, 0), width=1)
        texto = f"{n + 1}. {s['id']}{'' if s['espelhavel'] else ' (não espelha)'}"
        desenho.text((cx + 4, cy + lado + 8), texto, fill=(30, 30, 30), font=fonte)
    destino.parent.mkdir(parents=True, exist_ok=True)
    folha.save(destino)
    return destino


def main() -> int:
    try:
        manifesto = recorte.recortar_tudo()
    except recorte.ErroDeRecorte as e:
        print(f"RECORTE RECUSADO: {e}")
        return 1
    for folha, n in manifesto["pecas_por_folha"].items():
        print(f"{folha}: {n} peças")
    print(f"{len(manifesto['simbolos'])} símbolos, manifesto em {recorte.CAMINHO_MANIFESTO}")
    destino = folha_de_contato(manifesto, PASTA_ANALISE / "folha-de-contato.png")
    print(f"folha de contato: {destino}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
