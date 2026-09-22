"""A conferência do git registra, e NÃO conserta.

Este é um teste de coisa que grava (a linha do registro), então vale a regra: cada
asserção positiva tem o seu controle negativo. Os dois que importam aqui:

1. valor errado tem que produzir uma linha com `certo: false` **e não mexer na
   configuração** (o script inteiro existe para não consertar calado);
2. o registro tem que ACRESCENTAR, nunca reescrever: se cada conferência apagasse a
   anterior, o arquivo não mostraria quando o valor mudou, que é para o que ele serve.
"""

import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import conferir_git  # noqa: E402


def _linhas(caminho: Path) -> list[dict]:
    return [json.loads(l) for l in caminho.read_text(encoding="utf-8").splitlines() if l]


def test_valor_certo_vira_linha_certa(tmp_path):
    registro = tmp_path / "registro-git.jsonl"
    linha = conferir_git.conferir(registro, ler=lambda: ("scripts/hooks", "file:.git/config"))
    assert linha["certo"] is True
    gravadas = _linhas(registro)
    assert len(gravadas) == 1
    assert gravadas[0]["valor"] == "scripts/hooks"
    assert gravadas[0]["origem"] == "file:.git/config"
    assert gravadas[0]["quando"][:2] == "20"  # data de verdade, não vazia


def test_valor_errado_vira_linha_errada_e_nao_conserta_nada(tmp_path):
    """CONTROLE NEGATIVO do comportamento inteiro: com valor errado, o script tem que
    ACUSAR e deixar como está. Se um dia alguém puser um `git config` aqui dentro,
    este teste continua verde na primeira metade e falha na segunda."""
    registro = tmp_path / "registro-git.jsonl"
    absoluto = r"C:\Users\Alguem\repo\scripts\hooks"
    chamadas = []

    def ler_falso():
        chamadas.append("leu")
        return absoluto, "file:.git/config"

    linha = conferir_git.conferir(registro, ler=ler_falso)
    assert linha["certo"] is False
    assert linha["valor"] == absoluto
    # O valor continua o errado depois da conferência: nada foi consertado.
    assert ler_falso()[0] == absoluto
    # E a conferência LEU a configuração em vez de adivinhar.
    assert chamadas


def test_o_registro_acumula_em_vez_de_reescrever(tmp_path):
    registro = tmp_path / "registro-git.jsonl"
    conferir_git.conferir(registro, ler=lambda: ("scripts/hooks", "file:.git/config"))
    conferir_git.conferir(registro, ler=lambda: (r"C:\errado", "file:.git/config"))
    conferir_git.conferir(registro, ler=lambda: ("scripts/hooks", "file:.git/config"))
    gravadas = _linhas(registro)
    assert [l["certo"] for l in gravadas] == [True, False, True]


def test_chave_ausente_conta_como_errado(tmp_path):
    """Sem `core.hooksPath` nenhum, o gancho não roda: é tão errado quanto o valor
    errado, e não pode virar linha 'certo: true' por None == None."""
    registro = tmp_path / "registro-git.jsonl"
    linha = conferir_git.conferir(registro, ler=lambda: (None, None))
    assert linha["certo"] is False
    assert linha["valor"] is None


def test_o_script_de_verdade_le_o_repositorio_de_verdade():
    """Controle de que a leitura real funciona (e não só a injetada): o git deste
    repositório responde alguma coisa para a chave, e a origem é um arquivo."""
    valor, origem = conferir_git.ler_config()
    assert valor is not None, "core.hooksPath não está definido neste clone"
    assert origem and origem.startswith("file:")


def test_saida_do_script_e_1_quando_esta_errado(tmp_path, monkeypatch):
    """O código de saída é o que o passo 1 do /cartografo usa para ramificar."""
    monkeypatch.setattr(conferir_git, "CAMINHO_REGISTRO", tmp_path / "r.jsonl")
    monkeypatch.setattr(conferir_git, "ler_config", lambda chave=None: (r"C:\errado", "file:.git/config"))
    assert conferir_git.main() == 1
    monkeypatch.setattr(conferir_git, "ler_config", lambda chave=None: ("scripts/hooks", "file:.git/config"))
    assert conferir_git.main() == 0
