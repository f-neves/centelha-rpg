"""O medidor de desempenho grava um arquivo, então precisa dos mesmos controles.

Dois riscos de verdade num script de bancada: ele medir contra o dado REAL (e, pior,
escrever nele ao montar os cenários), e ele SUBSTITUIR a medição anterior, que é
justamente a que serve de base de comparação.
"""

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import medir_automatico  # noqa: E402

from backend import areas  # noqa: E402

AREAS_REAL = Path(areas.__file__).resolve().parents[2] / "dados" / "areas-pintadas.geojson"


@pytest.fixture(autouse=True)
def casos_pequenos(monkeypatch):
    """A bancada de verdade leva segundos; aqui só interessa o comportamento."""
    monkeypatch.setattr(medir_automatico, "CASOS", ((3, 8), (5, 8)))
    monkeypatch.setattr(medir_automatico, "REPETICOES", 1)


def test_medir_nao_toca_no_arquivo_de_areas_real():
    """CONTROLE NEGATIVO: o medidor monta cenários de centenas de polígonos. Se ele
    apontasse para o arquivo de produção, encheria o mapa de lixo e o teste de
    isolamento não pegaria, porque o medidor não é um teste."""
    antes = AREAS_REAL.read_bytes()
    caminho_no_modulo = areas.CAMINHO_DADOS
    linhas = medir_automatico.medir()
    assert len(linhas) == 2
    assert AREAS_REAL.read_bytes() == antes
    # E ele devolve o módulo ao estado anterior, senão contaminaria quem rodar depois.
    assert areas.CAMINHO_DADOS == caminho_no_modulo


def test_as_linhas_tem_os_campos_que_a_comparacao_futura_precisa():
    for linha in medir_automatico.medir():
        assert linha["areas_pintadas"] > 0
        assert linha["vertices_por_area"] > 0
        assert linha["mediana_ms"] >= 0
        assert linha["resposta_kb"] > 0


def test_gravar_acumula_em_vez_de_substituir(tmp_path, monkeypatch):
    saida = tmp_path / "medicoes_desempenho.json"
    monkeypatch.setattr(medir_automatico, "CAMINHO_SAIDA", saida)
    monkeypatch.setattr(sys, "argv", ["medir_automatico.py", "--gravar"])

    medir_automatico.main()
    medir_automatico.main()
    documento = json.loads(saida.read_text(encoding="utf-8"))
    assert len(documento["medicoes"]) == 2, "a segunda medição substituiu a primeira"
    assert documento["medicoes"][0]["quando"] <= documento["medicoes"][1]["quando"]


def test_sem_gravar_nao_escreve_nada(tmp_path, monkeypatch):
    """CONTROLE NEGATIVO da flag: o modo relatório tem que ser inofensivo."""
    saida = tmp_path / "medicoes_desempenho.json"
    monkeypatch.setattr(medir_automatico, "CAMINHO_SAIDA", saida)
    monkeypatch.setattr(sys, "argv", ["medir_automatico.py"])
    medir_automatico.main()
    assert not saida.exists()
