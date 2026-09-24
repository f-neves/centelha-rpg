"""Os cinco níveis de distorção do MESMO recorte, com o mesmo mercador, e uma folha
lado a lado para comparar (B5 da empreitada, 2026-09-23 noite).

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/comparar_niveis.py --regiao calin --mercador "Velho Tobias"

Saída em `render/exportacoes/`: `niveis-<regiao>-<n>.png` (e o `.mentiras.json` de
cada nível abaixo de 5) e `niveis-<regiao>-comparacao.png`. Cada um entra no registro
de exportações com o destinatário "comparação de níveis".
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from cartografia import composicao, exportar, renderizador, tipografia  # noqa: E402


def main(argv) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--regiao", default="calin")
    p.add_argument("--mercador", default="Velho Tobias")
    p.add_argument("--largura", type=int, default=1200)
    a = p.parse_args(argv)
    dados = composicao.carregar_dados()
    costa = composicao.Costa()
    bib = renderizador.Biblioteca.carregar(composicao.RAIZ_MAPAS / "dados" / "simbolos.json")
    imagens = []
    for nivel in (5, 4, 3, 2, 1):
        r = exportar.exportar(exportar.Opcoes(regiao=a.regiao, largura_px=a.largura, versao="jogador",
                                              distorcao={"nivel": nivel, "mercador": a.mercador},
                                              destinatario="comparação de níveis",
                                              nome=f"niveis-{a.regiao}-{nivel}"), dados, costa, bib)
        print(nivel, r["arquivo"], r["segundos"], "s")
        imagens.append((nivel, Image.open(composicao.RAIZ_MAPAS / r["arquivo"]).convert("RGB")))
    w, h = imagens[0][1].size
    esc = 0.5
    pw, ph = int(w * esc), int(h * esc)
    folha = Image.new("RGB", (5 * pw + 6 * 20, ph + 90), (250, 246, 236))
    d = ImageDraw.Draw(folha)
    fonte = tipografia.fonte("normal", 34)
    for i, (nivel, im) in enumerate(imagens):
        x = 20 + i * (pw + 20)
        folha.paste(im.resize((pw, ph), Image.LANCZOS), (x, 70))
        rotulo = {5: "5 · fiel", 1: "1 · mapa de feira"}.get(nivel, str(nivel))
        d.text((x, 18), f"nível {rotulo}", fill=(40, 30, 20), font=fonte)
    destino = exportar.PASTA_SAIDA / f"niveis-{a.regiao}-comparacao.png"
    folha.save(destino)
    print(destino)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
