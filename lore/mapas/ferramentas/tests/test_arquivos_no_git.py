"""Arquivo necessário que ficou de fora do git (a armadilha do `dist/`).

Nasceu de um defeito real, em 2026-09-23: o Leaflet-Geoman foi baixado para
`static/vendor/leaflet-geoman-free-2.20.0/`, commitado com caminho explícito, e os
dois arquivos que a página carrega de verdade (`dist/leaflet-geoman.css` e
`dist/leaflet-geoman.min.js`) NÃO entraram. A linha 3 do `.gitignore` da raiz é
`dist/`, escrita para o build do site em Astro, e ela casa com qualquer pasta chamada
`dist` em qualquer lugar do repositório, inclusive dentro da ferramenta do mapa. Aqui
nada quebrou: o arquivo estava no disco. Num clone novo a ferramenta abriria sem a
caneta de desenhar, sem mensagem nenhuma.

A comparação é entre o que está no DISCO e o que o git RASTREIA, dentro da ferramenta
e dos dados. O que sobra se divide em dois, e só um deles é defeito (divisão pedida
pelo usuário na décima rodada):

- **escondido pelo `.gitignore`**: invisível, e é o que `test_nada_necessario_esta_
  escondido_pelo_gitignore` FAZ FALHAR;
- **apenas ainda não commitado**: visível no `git status`, trabalho em andamento, e
  `test_lista_o_que_ainda_nao_foi_commitado` só LISTA, sem reprovar. Sem essa
  separação a suíte terminava vermelha em toda rodada que acabasse com etapa nova sem
  commit, que é quase toda.

O que fica de fora de propósito está na lista `PROPOSITAIS`, abaixo, e é a única
saída: um arquivo novo ou entra no git, ou entra nessa lista com motivo escrito.
"""

import os
import subprocess
from pathlib import Path

import pytest

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
RAIZ_REPO = RAIZ_MAPAS.parents[1]

# O que é varrido: a ferramenta inteira e os dados que ela lê e grava.
VARRIDOS = ("lore/mapas/ferramentas", "lore/mapas/dados")

# O que fica fora do git DE PROPÓSITO, com o motivo. Qualquer outra coisa no disco e
# fora do git é defeito, até prova em contrário escrita aqui.
PROPOSITAIS = {
    ".venv/": "ambiente virtual, recriado pelo requirements.txt",
    ".pytest_cache/": "cache do pytest",
    "__pycache__/": "bytecode do Python",
    ".historico/": "cópias de segurança geradas a cada gravação (estado de execução)",
    ".operacoes/": "log de desfazer/refazer (estado de execução, não fonte)",
    ".log": "saída do uvicorn",
    ".stackdump": "despejo do bash do Windows, lixo de ambiente",
}

# Arte pesada e imagem derivada vivem fora da varredura e fora do git por decisão
# antiga (CARTOGRAFO, "Regras invioláveis"): render/, mascaras/, fonte/, referencias/.
# Estão fora do escopo deste teste de propósito, e o que é preciso para regerá-las num
# clone novo está registrado no CARTOGRAFO ("Clone novo").


def _proposital(caminho_relativo: str) -> bool:
    for marca in PROPOSITAIS:
        if marca.startswith("."):
            if marca.endswith("/"):
                if f"/{marca}" in f"/{caminho_relativo}":
                    return True
            elif caminho_relativo.endswith(marca):
                return True
        elif f"/{marca}" in f"/{caminho_relativo}":
            return True
    return False


def _no_disco() -> set[str]:
    arquivos = set()
    for pasta in VARRIDOS:
        base = RAIZ_REPO / pasta
        for raiz, _dirs, nomes in os.walk(base):
            for nome in nomes:
                rel = (Path(raiz) / nome).relative_to(RAIZ_REPO).as_posix()
                if not _proposital(rel):
                    arquivos.add(rel)
    return arquivos


def _rastreados() -> set[str]:
    saida = subprocess.run(
        ["git", "ls-files", "--", *VARRIDOS],
        cwd=RAIZ_REPO, capture_output=True, text=True, check=True,
    )
    return {linha for linha in saida.stdout.splitlines() if linha}


def fora_do_git() -> set[str]:
    """O que existe no disco, é necessário, e o git não rastreia."""
    return _no_disco() - _rastreados()


def test_a_varredura_enxerga_alguma_coisa():
    """Controle de sanidade: sem isto, uma varredura que não acha ARQUIVO NENHUM
    passaria no teste principal por vacuidade, que é o modo mais comum de um teste
    deste tipo mentir."""
    disco, rastreados = _no_disco(), _rastreados()
    assert len(disco) > 30, f"a varredura achou só {len(disco)} arquivos no disco"
    assert len(rastreados) > 30
    assert "lore/mapas/ferramentas/backend/main.py" in disco & rastreados


def test_a_lista_de_propositais_esta_de_fato_filtrando():
    """CONTROLE NEGATIVO da lista: se `.venv/` deixasse de casar (uma barra a mais,
    um separador do Windows), a varredura despejaria milhares de arquivos e o teste
    principal viraria ruído. Aqui se exige que o filtro tenha trabalho de verdade."""
    venv = RAIZ_MAPAS / "ferramentas" / ".venv"
    if not venv.exists():
        pytest.skip(".venv não existe nesta árvore")
    exemplo = next(venv.rglob("*.py"), None)
    assert exemplo is not None
    rel = exemplo.relative_to(RAIZ_REPO).as_posix()
    assert _proposital(rel), f"{rel} devia ter sido filtrado pela lista"
    assert rel not in _no_disco()


def _escondido_pelo_gitignore(rel: str) -> bool:
    return subprocess.run(
        ["git", "check-ignore", "-q", rel], cwd=RAIZ_REPO
    ).returncode == 0


def test_nada_necessario_esta_escondido_pelo_gitignore():
    """**Este é o que falha**, e só para o defeito invisível: arquivo que o
    `.gitignore` esconde, não aparece em `git status`, não dá erro nenhum na máquina
    de quem escreveu, e só quebra num clone novo. Foi o caso do `dist/` do Geoman.
    """
    escondidos = sorted(f for f in fora_do_git() if _escondido_pelo_gitignore(f))
    assert not escondidos, (
        "arquivo necessário ESCONDIDO pelo .gitignore (invisível no git status, "
        "quebra num clone novo). Ou entra no git com `git add -f`, ou entra em "
        "PROPOSITAIS com motivo:\n  " + "\n  ".join(escondidos)
    )


def test_lista_o_que_ainda_nao_foi_commitado(capsys):
    """**Este NÃO falha**: só lista. Arquivo apenas não commitado é trabalho em
    andamento, aparece em `git status` como `??` e some quando a etapa for
    commitada; fazer a suíte inteira ficar vermelha por causa dele custaria mais do
    que vale, porque quase toda rodada termina com uma etapa nova sem commit
    (decisão do usuário, 2026-09-23, décima rodada, depois de ver a suíte vermelha
    por construção no fim da rodada anterior).

    A lista sai com `pytest -s`, ou no relatório de falha de qualquer outro teste.
    """
    novos = sorted(f for f in fora_do_git() if not _escondido_pelo_gitignore(f))
    if novos:
        print("\nainda não commitado (visível no git status, não é defeito):")
        for f in novos:
            print("  " + f)
    # A única asserção é sobre o próprio levantamento ter acontecido: uma lista é
    # informação, não veredito.
    assert isinstance(novos, list)


def test_pega_um_arquivo_escondido_pelo_gitignore():
    """CONTROLE NEGATIVO do teste principal, reproduzindo o defeito de verdade: um
    arquivo dentro de uma pasta `dist/`, que o .gitignore da raiz esconde. Se o
    detector não pegar ISSO, ele não pega o defeito que o fez existir."""
    alvo = RAIZ_MAPAS / "ferramentas" / "static" / "vendor" / "_controle_negativo" / "dist"
    arquivo = alvo / "biblioteca-de-mentira.js"
    alvo.mkdir(parents=True, exist_ok=True)
    try:
        arquivo.write_text("// controle negativo do test_arquivos_no_git\n", encoding="utf-8")
        # Primeiro a prova de que o git REALMENTE o ignora (senão o controle negativo
        # estaria testando outra coisa: um arquivo simplesmente esquecido).
        ignorado = subprocess.run(
            ["git", "check-ignore", "-q", str(arquivo)], cwd=RAIZ_REPO
        ).returncode == 0
        assert ignorado, "o .gitignore parou de esconder dist/: reveja este controle"
        rel = arquivo.relative_to(RAIZ_REPO).as_posix()
        assert rel in fora_do_git(), "o detector não viu um arquivo escondido pelo .gitignore"
        assert _escondido_pelo_gitignore(rel), "e ele tem que cair no teste que FALHA, não no que só lista"
    finally:
        arquivo.unlink(missing_ok=True)
        alvo.rmdir()
        alvo.parent.rmdir()
