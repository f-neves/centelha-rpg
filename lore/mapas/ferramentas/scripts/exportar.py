"""Exportação parcial do mapa (B3 da empreitada, 2026-09-23 noite). Detalhes em
`cartografia/exportar.py`. Exemplos:

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/exportar.py --regiao calin
    .venv/Scripts/python.exe scripts/exportar.py --regiao mere --versao jogador --pdf A3 --destinatario Ana
    .venv/Scripts/python.exe scripts/exportar.py --retangulo 5 20 30 42 --largura 3000 --sem grade,moldura
    .venv/Scripts/python.exe scripts/exportar.py --regiao calin --distorcao 2 --mercador "Velho Tobias"

A saída vai para `render/exportacoes/`, e cada exportação acrescenta uma linha em
`dados/exportacoes.jsonl`. `--json '{...}'` recebe as opções inteiras (é o que o
servidor usa, num processo separado, para a memória do servidor não crescer).
"""

import argparse
import json
import sys
from pathlib import Path

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from cartografia import composicao, exportar  # noqa: E402


def main(argv) -> int:
    p = argparse.ArgumentParser(description="Exporta um recorte do mapa.")
    p.add_argument("--regiao")
    p.add_argument("--retangulo", nargs=4, type=float, metavar=("OESTE", "SUL", "LESTE", "NORTE"))
    p.add_argument("--versao", choices=("mestre", "jogador"), default="mestre")
    p.add_argument("--largura", type=int, default=2400, help="largura do PNG em px")
    p.add_argument("--pdf", choices=tuple(exportar.PAPEIS_MM), help="gera PDF nesse papel em vez de PNG")
    p.add_argument("--dpi", type=int, default=300)
    p.add_argument("--sem", default="", help="camadas a tirar, separadas por vírgula: "
                                             + ",".join(composicao.CAMADAS))
    p.add_argument("--destinatario")
    p.add_argument("--titulo")
    p.add_argument("--distorcao", type=int, help="nível de 1 (mapa de feira) a 5 (fiel)")
    p.add_argument("--mercador", default="", help="quem vendeu o mapa: muda a semente da distorção")
    p.add_argument("--semente", type=int)
    p.add_argument("--nome", help="nome do arquivo, sem extensão")
    p.add_argument("--json", help="as opções inteiras em JSON (uso do servidor)")
    a = p.parse_args(argv)
    if a.json:
        o = exportar.Opcoes(**json.loads(a.json))
    else:
        sem = {c for c in a.sem.split(",") if c}
        distorcao = None
        if a.distorcao is not None:
            distorcao = {"nivel": a.distorcao, "mercador": a.mercador}
            if a.semente is not None:
                distorcao["semente"] = a.semente
        o = exportar.Opcoes(regiao=a.regiao, retangulo=a.retangulo,
                            camadas=[c for c in composicao.CAMADAS if c not in sem], versao=a.versao,
                            formato="pdf" if a.pdf else "png", largura_px=a.largura, papel=a.pdf or "A4",
                            dpi=a.dpi, destinatario=a.destinatario, titulo=a.titulo, distorcao=distorcao,
                            nome=a.nome)
    try:
        registro = exportar.exportar(o)
    except ValueError as e:
        print(json.dumps({"erro": str(e)}, ensure_ascii=False))
        return 2
    print(json.dumps(registro, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
