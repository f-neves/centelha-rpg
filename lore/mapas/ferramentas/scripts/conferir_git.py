"""Confere a configuração do git no começo de toda sessão do mapa, e REGISTRA.

Pedido do usuário em 2026-09-23 (décima primeira rodada): "pare de consertar e pare
de só avisar". O `core.hooksPath` deste repositório já voltou sozinho para caminho
absoluto duas vezes, entre rodadas, sem ninguém saber quem reescreve. Avisar não
descobre a causa e consertar calado apaga a evidência. Então:

- toda conferência vira uma linha em `lore/mapas/registro-git.jsonl` (data e hora,
  chave, valor encontrado, valor esperado, se estava certo, e de qual arquivo de
  configuração veio o valor), inclusive quando está tudo certo, porque é a sequência
  de linhas que mostra QUANDO mudou;
- este script **nunca conserta nada**. Se estiver errado, ele diz em uma linha o que
  achar e qual é o comando, e quem decide é o usuário. Consertar só com o "sim" dele.

Uso (de dentro de lore/mapas/ferramentas/):
    .venv/Scripts/python.exe scripts/conferir_git.py

Código de saída: 0 se estava certo, 1 se estava errado (para o passo 1 do
`/cartografo` poder ramificar sem ler texto).
"""

import json
import subprocess
import sys
import time
from pathlib import Path

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
RAIZ_REPO = RAIZ_MAPAS.parents[1]
CAMINHO_REGISTRO = RAIZ_MAPAS / "registro-git.jsonl"

CHAVE = "core.hooksPath"
ESPERADO = "scripts/hooks"
COMANDO_DE_CONSERTO = f"git config {CHAVE} {ESPERADO}"


def ler_config(chave: str = CHAVE) -> tuple[str | None, str | None]:
    """Devolve (valor, origem). Origem é o arquivo de configuração que definiu o
    valor, que é a pista de QUEM mexeu (global, local, worktree)."""
    saida = subprocess.run(
        ["git", "config", "--show-origin", "--get", chave],
        cwd=RAIZ_REPO, capture_output=True, text=True,
    )
    if saida.returncode != 0 or not saida.stdout.strip():
        return None, None
    bruto = saida.stdout.strip()
    origem, _, valor = bruto.partition("\t")
    return valor.strip(), origem.strip()


def conferir(caminho_registro: Path | None = None, ler=None) -> dict:
    """Confere, grava a linha e devolve o que achou. Não conserta nada, nunca.

    Os dois parâmetros são resolvidos AQUI DENTRO, e não como valor padrão na
    assinatura: valor padrão é congelado na definição da função, e com isso nem o
    teste nem uma troca em tempo de execução alcançariam `ler_config`.
    """
    caminho_registro = caminho_registro or CAMINHO_REGISTRO
    ler = ler or ler_config
    valor, origem = ler()
    linha = {
        "quando": time.strftime("%Y-%m-%d %H:%M:%S"),
        "chave": CHAVE,
        "valor": valor,
        "esperado": ESPERADO,
        "certo": valor == ESPERADO,
        "origem": origem,
    }
    caminho_registro.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho_registro, "a", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(linha, ensure_ascii=False) + "\n")
    return linha


def main() -> int:
    linha = conferir()
    if linha["certo"]:
        print(f"git ok: {CHAVE} = {linha['valor']} (registrado em {CAMINHO_REGISTRO.name})")
        return 0
    print(
        f"ATENÇÃO: {CHAVE} = {linha['valor']!r}, esperado {ESPERADO!r} "
        f"(definido em {linha['origem']}). O portão de commit vai recusar. "
        f"Autoriza rodar `{COMANDO_DE_CONSERTO}`?"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
