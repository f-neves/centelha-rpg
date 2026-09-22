"""Gravação atômica de arquivo de dados + cópia das últimas 5 versões
(ESPEC-ferramenta.md, "Gravação e histórico de operações", correção 5).

É a rede contra "gravei tudo errado por cima" -- coisa diferente do desfazer/refazer
entre operações (`operacoes.py`), que convive com este módulo sem se sobrepor: todo
desfazer/refazer também passa por `gravar_com_historico`, então uma versão
histórica existe tanto para as gravações normais quanto para as de desfazer.
"""

import json
import os
import time
from pathlib import Path

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
PASTA_HISTORICO = RAIZ_MAPAS / "dados" / ".historico"
VERSOES_MANTIDAS = 5


def gravar_json_com_historico(caminho: Path, dados: dict) -> None:
    """Grava `dados` (dict serializável) em `caminho` atomicamente (tmp + os.replace,
    LF explícito -- ver nota de fim de linha do CLAUDE.md do repositório) e guarda
    uma cópia em dados/.historico/<nome-do-arquivo>/<timestamp>.json, mantendo só as
    `VERSOES_MANTIDAS` mais recentes."""
    caminho = Path(caminho)
    tmp = caminho.with_name(caminho.name + ".tmp")
    texto = json.dumps(dados, ensure_ascii=False, indent=2)
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)
    os.replace(tmp, caminho)
    _guardar_versao(caminho, texto)


def _guardar_versao(caminho: Path, texto: str) -> None:
    pasta = PASTA_HISTORICO / caminho.name
    pasta.mkdir(parents=True, exist_ok=True)
    # Nanossegundos no nome: duas gravações no mesmo milissegundo (comuns em teste
    # automatizado) não podem colidir e uma sobrescrever a outra em silêncio.
    nome_versao = f"{time.time_ns()}.json"
    with open(pasta / nome_versao, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)
    versoes = sorted(pasta.glob("*.json"), key=lambda p: p.name)
    for antiga in versoes[:-VERSOES_MANTIDAS]:
        antiga.unlink()


def listar_versoes(caminho: Path) -> list[Path]:
    """Só para inspeção/teste: as versões guardadas de `caminho`, mais antiga primeiro."""
    pasta = PASTA_HISTORICO / Path(caminho).name
    if not pasta.exists():
        return []
    return sorted(pasta.glob("*.json"), key=lambda p: p.name)
