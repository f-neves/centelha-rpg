"""Confere a fórmula de distância real (B3, 2026-09-22; fonte única desde a etapa 9,
2026-09-23).

Até a etapa 9 este teste tinha uma CÓPIA da fórmula em Python, espelhando a da régua.
Agora a fórmula do servidor mora em `backend/geo.py` (a atração das estradas usa) e é
importada daqui; a do navegador mora em `static/js/geo.js` (a régua usa).
São duas implementações por necessidade (uma roda no servidor, a outra na página), e
a segunda metade deste arquivo prova que dizem o mesmo: roda o `geo.js` DE VERDADE no
node, lendo o arquivo servido, e compara com `geo.haversine_km` nos mesmos pontos.

Os casos fechados da primeira metade usam um número que já estava gravado em
`dados/coordenadas.json` antes desta fórmula existir ("distância já calculada e
registrada", pedido do usuário na B3).
"""

import json
import math
import shutil
import subprocess
from pathlib import Path

import pytest

from backend import coordenadas, geo

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
GEO_JS = RAIZ_FERRAMENTA / "static" / "js" / "geo.js"


def _raio():
    return geo.raio_km()


# --- casos fechados, contra a função do servidor --------------------------------

def test_mesmo_ponto_da_zero():
    """Controle negativo: dois pontos idênticos têm que dar exatamente 0 km."""
    assert geo.haversine_km(12.3, -45.6, 12.3, -45.6) == pytest.approx(0.0)


def test_antipoda_bate_com_distancia_polo_a_polo_ja_gravada():
    """Dois pontos antípodas (em QUALQUER direção, é propriedade da esfera) distam
    exatamente planeta.distancia_polo_a_polo_km, que já estava em
    dados/coordenadas.json (pi * raio_km, documentado em 'planeta._derivacao')."""
    esperado = coordenadas.carregar_coordenadas()["planeta"]["distancia_polo_a_polo_km"]
    d1 = geo.haversine_km(90, 0, -90, 0)
    # equador -> antípoda (longitude +180): prova que não é coincidência do caso polar
    d2 = geo.haversine_km(0, 10, 0, 190)
    assert d1 == pytest.approx(esperado, rel=1e-6)
    assert d2 == pytest.approx(esperado, rel=1e-6)


def test_arco_de_meridiano_0_a_60_graus():
    """Mesma longitude, de 0° a 60° de latitude: raio_km * ângulo_em_radianos, fórmula
    fechada independente do haversine."""
    assert geo.haversine_km(0, -20, 60, -20) == pytest.approx(_raio() * math.radians(60), rel=1e-9)


def test_controle_negativo_paralelo_fora_do_equador_encolhe_com_a_latitude():
    """Mesma latitude 45°, 60° de longitude de diferença: tem que dar MENOS que
    raio*radianos(60), porque o paralelo fora do equador não é grande círculo. Se desse
    igual, a fórmula estaria tratando longitude como latitude."""
    raio = _raio()
    paralelo_45 = geo.haversine_km(45, -20, 45, 40)
    angulo_exato = 2 * math.asin(math.cos(math.radians(45)) * math.sin(math.radians(60) / 2))
    assert paralelo_45 < raio * math.radians(60)
    assert paralelo_45 == pytest.approx(raio * angulo_exato, rel=1e-9)


def test_paralelo_no_equador_bate_com_formula_fechada():
    assert geo.haversine_km(0, 0, 0, 45) == pytest.approx(_raio() * math.radians(45), rel=1e-9)


# --- servidor e régua dizem o mesmo --------------------------------------------

# Pontos escolhidos para cobrir o que importa: o raio da atração (5 km), trechos curtos
# de régua, um arco longo, latitude alta (onde o cos(lat) pesa), um par quase antípoda
# (onde o Math.min(1, ...) decide) e o antípoda exato.
PARES = [
    (17.7768, 17.3389, 17.7768, 17.3389 + 5 / 138.993658),  # ~5 km no raio da atração
    (17.7768, 17.3389, 17.80, 17.40),                        # trecho curto em Mére
    (33.9608, 6.6643, 14.4789, -6.1602),                     # Calin -> Syl
    (65.339, -22.7415, 52.7089, -25.4436),                   # White Wall -> The Neck
    (80.0, -170.0, 79.5, 170.0),                             # latitude alta, cruzando 180°
    (0.0, 10.0, 0.0, 190.0),                                 # antípoda exato
    (45.0, 0.0, -44.9999999, 179.9999999),                   # quase antípoda
    (-30.0, 12.5, -30.0, 12.5),                              # distância zero
]


def _node_ou_falha():
    node = shutil.which("node")
    if node is None:
        # Falha, e não `skip`: uma conferência que some em silêncio numa máquina sem
        # node é uma conferência quebrada (regra do controle negativo, CARTOGRAFO.md).
        pytest.fail("node não está no PATH: sem ele não há como conferir static/js/geo.js "
                    "contra backend/geo.py")
    return node


def _rodar_js(fonte: str, pares, raio: float) -> list:
    """Avalia `fonte` (o texto de um geo.js) no node e devolve haversineKm de cada par."""
    script = (
        "const vm = require('vm');"
        "const ctx = {};"
        "vm.createContext(ctx);"
        f"vm.runInContext({json.dumps(fonte)}, ctx);"
        f"const pares = {json.dumps(pares)};"
        f"const raio = {json.dumps(raio)};"
        "console.log(JSON.stringify(pares.map(p => "
        "vm.runInContext('haversineKm', ctx)(p[0], p[1], p[2], p[3], raio))));"
    )
    saida = subprocess.run([_node_ou_falha(), "-e", script], capture_output=True, text=True,
                           timeout=30, check=True)
    return json.loads(saida.stdout)


def _divergencias(valores_js, pares):
    ruins = []
    for (lat1, lon1, lat2, lon2), v_js in zip(pares, valores_js):
        v_py = geo.haversine_km(lat1, lon1, lat2, lon2)
        if v_js is None or not math.isclose(v_js, v_py, rel_tol=1e-12, abs_tol=1e-9):
            ruins.append(((lat1, lon1, lat2, lon2), v_py, v_js))
    return ruins


def test_regua_e_servidor_dao_o_mesmo_resultado_nos_mesmos_pontos():
    fonte = GEO_JS.read_text(encoding="utf-8")
    valores = _rodar_js(fonte, PARES, _raio())
    assert _divergencias(valores, PARES) == []


def test_controle_negativo_a_comparacao_pega_uma_formula_alterada():
    """Sem este teste, uma comparação que nunca reprovasse nada (lendo o arquivo
    errado, comparando o Python com ele mesmo) passaria igual. Troca UM termo do
    geo.js real (cos da latitude 1 vira cos da longitude 1) e exige divergência."""
    fonte = GEO_JS.read_text(encoding="utf-8")
    original = "Math.cos(lat1 * rad)"
    assert original in fonte, "o termo que o controle negativo altera sumiu do geo.js"
    alterada = fonte.replace(original, "Math.cos(lon1 * rad)")
    valores = _rodar_js(alterada, PARES, _raio())
    assert _divergencias(valores, PARES), "a comparação não pegou a fórmula alterada"


def test_o_raio_injetado_na_pagina_e_o_mesmo_do_servidor():
    """Mesma fórmula com raios diferentes ainda discordaria: a página recebe o raio por
    PARAMETROS_LEAFLET.raio_km, e ele tem que ser o que o servidor usa."""
    assert coordenadas.parametros_leaflet()["raio_km"] == geo.raio_km()


def test_a_pagina_carrega_geo_js_antes_de_quem_usa():
    """Se o <script> do geo.js sumir, ou vier depois da régua, haversineKm não existe
    quando a régua mede. Confere a ordem no template."""
    html = (RAIZ_FERRAMENTA / "templates" / "index.html").read_text(encoding="utf-8")
    pos_geo = html.find('src="/static/js/geo.js"')
    assert pos_geo != -1, "index.html não carrega static/js/geo.js"
    for quem in ("regua.js",):
        pos = html.find(f'src="/static/js/{quem}"')
        assert pos != -1, f"index.html não carrega {quem}"
        assert pos_geo < pos, f"geo.js tem que vir antes de {quem}"
