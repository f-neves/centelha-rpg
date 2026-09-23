"""Mede, para cada tipo de símbolo, o tamanho mínimo de SILHUETA DISTINGUÍVEL e o de
DETALHE INTERNO, e grava as duas tabelas em `dados/tamanho-minimo-silhueta.json` e
`dados/tamanho-minimo-detalhe.json`. O renderizador usa como piso o maior dos dois. Os
critérios estão em `cartografia/legibilidade.py`.

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

CRITERIO_SILHUETA = (
    "Tamanho mínimo de SILHUETA DISTINGUÍVEL: mede contorno, NÃO legibilidade (o miolo "
    "pode já ter virado mancha; ver tamanho-minimo-detalhe.json). "
    "Silhueta (alfa do modo branco-opaco) reduzida ao maior lado s, binarizada em 50%, "
    "apoiada pela base num quadro s x s com a âncora no meio; símbolo espelhável entra "
    "também espelhado. Dois tipos são indistinguíveis em s quando a maior IoU entre uma "
    "silhueta de um e uma do outro é >= a IoU mediana de cada silhueta contra ela mesma "
    "deslocada meio pixel (o erro de arredondamento da âncora no renderizador). Mínimo = "
    "menor s a partir do qual o tipo se separa de todos os outros em todo tamanho maior. "
    "Grade: 8 a 200 px, de 2 em 2. Tamanhos em px na resolução oficial (1,25 km/px)."
)
CRITERIO_DETALHE = (
    "Tamanho mínimo de DETALHE INTERNO: abaixo dele a hachura não informa. O símbolo no "
    "modo padrão, em cinza sobre o papel, reduzido ao maior lado s, comparado com o mesmo "
    "símbolo borrado na origem (sigma = metade do período da hachura medido no próprio "
    "símbolo) e então reduzido. Equivalentes quando a diferença RMS de luminância dentro "
    "da silhueta fica abaixo de 0,03 (~8% de contraste Michelson num cinza médio, umas "
    "duas vezes o limiar de detecção de uma grade de ~20 ciclos por grau, que é uma "
    "hachura de 2 px numa tela vista a 60 cm). Mínimo = menor s a partir do qual a "
    "mediana do tipo fica >= 0,03 em todo tamanho maior. Grade: 8 a 200 px, de 2 em 2."
)


def _gravar(caminho: Path, criterio: str, resultado: dict) -> None:
    saida = {"versao_esquema": 1, "_comentario": criterio,
             "medido_em": time.strftime("%Y-%m-%d %H:%M"),
             "simbolos_fora": sorted(renderizador.SIMBOLOS_EXCLUIDOS), **resultado}
    caminho.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n",
                       encoding="utf-8", newline="\n")


def main() -> int:
    t = time.perf_counter()
    manifesto = json.loads((RAIZ_MAPAS / "dados" / "simbolos.json").read_text(encoding="utf-8"))
    simbolos = [s for s in manifesto["simbolos"] if s["id"] not in renderizador.SIMBOLOS_EXCLUIDOS]
    silhueta = legibilidade.medir_silhueta(simbolos, RAIZ_MAPAS)
    detalhe = legibilidade.medir_detalhe(simbolos, RAIZ_MAPAS)
    _gravar(legibilidade.CAMINHO_SILHUETA, CRITERIO_SILHUETA, silhueta)
    _gravar(legibilidade.CAMINHO_DETALHE, CRITERIO_DETALHE, detalhe)
    pisos = legibilidade.carregar_pisos()
    print(f"{'tipo':18s} {'silhueta':>8s} {'detalhe':>8s} {'piso':>6s}")
    for tipo in sorted(pisos, key=lambda t: -pisos[t]):
        s = silhueta["tipos"][tipo]["tamanho_minimo_silhueta"]
        d = detalhe["tipos"][tipo]["tamanho_minimo_detalhe"]
        print(f"{tipo:18s} {s:8d} {d:8d} {pisos[tipo]:6d}")
    print(f"{time.perf_counter() - t:.1f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
