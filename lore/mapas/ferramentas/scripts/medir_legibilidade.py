"""Mede o tamanho mínimo legível de cada tipo de símbolo e grava a tabela em
`dados/tamanho-minimo-legivel.json`, que o renderizador usa como piso. O critério está
em `cartografia/legibilidade.py`.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/medir_legibilidade.py
"""

import json
import sys
import time
from pathlib import Path

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from cartografia import legibilidade, renderizador  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent

CRITERIO = (
    "Silhueta (alfa do modo branco-opaco) reduzida ao maior lado s, binarizada em 50%, "
    "apoiada pela base num quadro s x s com a âncora no meio; símbolo espelhável entra "
    "também espelhado. Dois tipos são indistinguíveis em s quando a maior IoU entre uma "
    "silhueta de um e uma do outro é >= a IoU mediana de cada silhueta contra ela mesma "
    "deslocada meio pixel (o erro de arredondamento da âncora no renderizador). Piso = "
    "menor s a partir do qual o tipo se separa de todos os outros em todo tamanho maior. "
    "Grade: 8 a 200 px, de 2 em 2. Tamanhos em px na resolução oficial (1,25 km/px)."
)


def main() -> int:
    t = time.perf_counter()
    manifesto = json.loads((RAIZ_MAPAS / "dados" / "simbolos.json").read_text(encoding="utf-8"))
    simbolos = [s for s in manifesto["simbolos"] if s["id"] not in renderizador.SIMBOLOS_EXCLUIDOS]
    resultado = legibilidade.medir(simbolos, RAIZ_MAPAS)
    saida = {"versao_esquema": 1, "_comentario": CRITERIO,
             "medido_em": time.strftime("%Y-%m-%d %H:%M"),
             "simbolos_fora": sorted(renderizador.SIMBOLOS_EXCLUIDOS), **resultado}
    legibilidade.CAMINHO_TABELA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n",
                                           encoding="utf-8", newline="\n")
    for tipo, v in sorted(resultado["tipos"].items(), key=lambda kv: -kv[1]["piso"]):
        extra = f" (confunde com {v['confunde_com']} até {v['ultimo_tamanho_confuso']} px)" if v["confunde_com"] else ""
        print(f"{tipo:18s} {v['piso']:4d} px{' NUNCA SEPARA' if v['nunca_separa'] else ''}{extra}")
    print(f"{time.perf_counter() - t:.1f} s -> {legibilidade.CAMINHO_TABELA}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
