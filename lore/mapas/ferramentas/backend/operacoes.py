"""Registro de operações e desfazer/refazer entre operações CONCLUÍDAS
(ESPEC-ferramenta.md, "Gravação e histórico de operações", correção 5).

Decisão confirmada nesta sessão (Leaflet-Geoman free não tem desfazer histórico, só
`removeLastVertex` dentro de uma forma sendo desenhada): desfazer entre formas já
salvas é código nosso, e mora aqui.

Modelo: uma única sessão de trabalho (`dados/.operacoes/log.jsonl`, uma linha JSON
por operação concluída: tipo, arquivo afetado, MUDANÇAS, timestamp) mais um cursor
(`dados/.operacoes/cursor.json`, um inteiro) apontando para "quantas operações do
log estão aplicadas". Os dois arquivos moram em disco, não em memória do processo --
é o que faz a pilha sobreviver a fechar a aba e a reiniciar o servidor (B1 da rodada
noturna de 2026-09-22), sem precisar de sessão HTTP nem banco de dados.

**Mudado nesta rodada (2026-09-23, a pedido do usuário)**: cada operação grava só as
FEATURES AFETADAS (por id), não o arquivo `FeatureCollection` inteiro antes/depois.
Antes disso o log guardava o documento inteiro duas vezes por operação -- funcionava
para `lugares.geojson` (pequeno hoje), mas ia ficar ruim quando a Ferramenta de Área
existir e uma operação puder envolver um polígono grande: um log de operações não
devia crescer proporcional ao tamanho do ARQUIVO, só ao tamanho da MUDANÇA. Formato
de uma operação agora:
    {"tipo": str, "arquivo": str, "mudancas": {id_feature: {"antes": feature|None,
     "depois": feature|None}}, "timestamp": float}
`antes`/`depois` = None significa "a feature não existia" (criar tem antes=None,
apagar tem depois=None). Aplicar uma operação (registrar, desfazer ou refazer) lê o
`FeatureCollection` atual do disco, substitui/insere/remove só as features citadas em
`mudancas` pelo lado certo (antes ou depois, conforme o sentido), e regrava o arquivo
inteiro (isso continua — só o LOG é que não guarda mais o arquivo inteiro, o arquivo
em si sempre foi e continua sendo um FeatureCollection completo no disco).

Decisão desta rodada (não estava no ESPEC, precisou de escolha para o código
existir): **sem limite de tamanho do log** -- o ESPEC cogitava "as últimas 50
operações" mas não decidiu; um log de uso de uma ferramenta de mapa solo, guardando
só a mudança por operação (não mais o arquivo inteiro), fica pequeno por muito mais
tempo ainda. Fica para revisão se algum dia virar problema de verdade.

**Novo item de uma operação depois de desfazer**: se o cursor não está no fim do
log (o usuário desfez uma ou mais operações e então faz algo NOVO em vez de
refazer), o rabo de "refazer" é descartado -- comportamento padrão de
desfazer/refazer em editores (o ramo abandonado não fica pendurado). Decisão da IA,
documentada aqui por não estar no ESPEC.
"""

import json
import os
import time
from pathlib import Path

from . import historico

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
PASTA_OPERACOES = RAIZ_MAPAS / "dados" / ".operacoes"
CAMINHO_LOG = PASTA_OPERACOES / "log.jsonl"
CAMINHO_CURSOR = PASTA_OPERACOES / "cursor.json"


def _garantir_pasta() -> None:
    PASTA_OPERACOES.mkdir(parents=True, exist_ok=True)


def _ler_log() -> list[dict]:
    if not CAMINHO_LOG.exists():
        return []
    linhas = CAMINHO_LOG.read_text(encoding="utf-8").splitlines()
    return [json.loads(linha) for linha in linhas if linha.strip()]


def _gravar_log(operacoes: list[dict]) -> None:
    _garantir_pasta()
    tmp = CAMINHO_LOG.with_name(CAMINHO_LOG.name + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        for op in operacoes:
            f.write(json.dumps(op, ensure_ascii=False))
            f.write("\n")
    os.replace(tmp, CAMINHO_LOG)


def _ler_cursor() -> int:
    if not CAMINHO_CURSOR.exists():
        return 0
    return json.loads(CAMINHO_CURSOR.read_text(encoding="utf-8"))["cursor"]


def _gravar_cursor(valor: int) -> None:
    _garantir_pasta()
    tmp = CAMINHO_CURSOR.with_name(CAMINHO_CURSOR.name + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"cursor": valor}, f)
    os.replace(tmp, CAMINHO_CURSOR)


def _ler_documento(caminho_absoluto: Path) -> dict:
    with open(caminho_absoluto, encoding="utf-8") as f:
        return json.load(f)


def _id_de(item: dict) -> str:
    """GeoJSON feature (lugares.geojson) guarda id em properties.id; um item de
    camadas_referencia.json guarda id direto -- os dois formatos convivem aqui
    desde 2026-09-23 (posição das camadas de referência também passou a ser
    desfazível)."""
    if "id" in item:
        return item["id"]
    return item["properties"]["id"]


def _aplicar_mudancas(dados: dict, mudancas: dict, lado: str, chave_lista: str) -> dict:
    """`lado` é "antes" (desfazer) ou "depois" (registrar/refazer). `chave_lista`
    é o campo do documento que é uma lista de itens com id ("features" num
    FeatureCollection, "camadas" em camadas_referencia.json). Substitui, insere
    ou remove só os itens citados em `mudancas`, por id -- o resto do documento
    não é tocado."""
    lista = dados[chave_lista]
    indice_por_id = {_id_de(item): i for i, item in enumerate(lista)}
    nova_lista = list(lista)
    for id_item, valor in mudancas.items():
        alvo = valor[lado]
        if id_item in indice_por_id:
            nova_lista[indice_por_id[id_item]] = alvo  # None é removido no filtro abaixo
        elif alvo is not None:
            nova_lista.append(alvo)
    dados[chave_lista] = [item for item in nova_lista if item is not None]
    return dados


def registrar_operacao(tipo: str, caminho_arquivo: str, mudancas: dict, chave_lista: str = "features") -> dict:
    """`mudancas`: {id_item: {"antes": item|None, "depois": item|None}} -- só os
    itens afetados por esta operação, nunca o arquivo inteiro (ver docstring do
    módulo). Lê o arquivo atual do disco, aplica o lado "depois", grava (atômico
    + histórico) e registra a operação no log, na posição do cursor --
    descartando qualquer "refazer" pendente. `caminho_arquivo` é relativo a
    RAIZ_MAPAS (ex.: "dados/lugares.geojson"). `chave_lista` (novo em
    2026-09-23): o campo do documento que é a lista de itens -- "features"
    (padrão, GeoJSON) ou "camadas" (dados/camadas_referencia.json). Devolve a
    operação registrada (com as `mudancas`, não o arquivo inteiro)."""
    caminho_absoluto = RAIZ_MAPAS / caminho_arquivo
    dados = _aplicar_mudancas(_ler_documento(caminho_absoluto), mudancas, "depois", chave_lista)
    historico.gravar_json_com_historico(caminho_absoluto, dados)

    operacoes = _ler_log()
    cursor = _ler_cursor()
    operacoes = operacoes[:cursor]  # descarta o rabo de refazer, se houver

    operacao = {
        "tipo": tipo,
        "arquivo": caminho_arquivo,
        "mudancas": mudancas,
        "chave_lista": chave_lista,
        "timestamp": time.time(),
    }
    operacoes.append(operacao)
    _gravar_log(operacoes)
    _gravar_cursor(len(operacoes))
    return operacao


def desfazer() -> dict | None:
    """Reaplica o lado "antes" das `mudancas` da última operação aplicada (lê o
    arquivo atual, substitui só os itens citados, grava atomicamente com
    histórico) e recua o cursor. Devolve a operação desfeita, ou None se não há o
    que desfazer."""
    cursor = _ler_cursor()
    if cursor <= 0:
        return None
    operacoes = _ler_log()
    operacao = operacoes[cursor - 1]
    caminho_absoluto = RAIZ_MAPAS / operacao["arquivo"]
    chave_lista = operacao.get("chave_lista", "features")
    dados = _aplicar_mudancas(_ler_documento(caminho_absoluto), operacao["mudancas"], "antes", chave_lista)
    historico.gravar_json_com_historico(caminho_absoluto, dados)
    _gravar_cursor(cursor - 1)
    return operacao


def refazer() -> dict | None:
    """Reaplica o lado "depois" das `mudancas` da próxima operação (a que o cursor
    acabou de deixar para trás) e avança o cursor. Devolve a operação refeita, ou
    None se não há o que refazer."""
    cursor = _ler_cursor()
    operacoes = _ler_log()
    if cursor >= len(operacoes):
        return None
    operacao = operacoes[cursor]
    caminho_absoluto = RAIZ_MAPAS / operacao["arquivo"]
    chave_lista = operacao.get("chave_lista", "features")
    dados = _aplicar_mudancas(_ler_documento(caminho_absoluto), operacao["mudancas"], "depois", chave_lista)
    historico.gravar_json_com_historico(caminho_absoluto, dados)
    _gravar_cursor(cursor + 1)
    return operacao


def estado_pilha() -> dict:
    """Para o frontend decidir se os botões desfazer/refazer aparecem habilitados."""
    cursor = _ler_cursor()
    total = len(_ler_log())
    return {"pode_desfazer": cursor > 0, "pode_refazer": cursor < total, "cursor": cursor, "total": total}
