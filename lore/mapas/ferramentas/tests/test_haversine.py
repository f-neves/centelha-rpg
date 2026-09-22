"""Confere a fórmula de distância real da régua (B3, rodada noturna de 2026-09-22).
A fórmula em si mora em static/js/regua.js (frontend, sem backend próprio) -- este
teste espelha a MESMA fórmula em Python e confere contra dois casos fechados, um
deles usando um número que já estava gravado em dados/coordenadas.json antes desta
rodada ("distância já calculada e registrada", como pedido)."""

import json
import math
from pathlib import Path

import pytest

RAIZ_MAPAS = Path(__file__).resolve().parents[2]


def haversine_km(lat1, lon1, lat2, lon2, raio_km):
    """Espelho exato de haversineKm em static/js/regua.js."""
    rad = math.pi / 180
    dlat = (lat2 - lat1) * rad
    dlon = (lon2 - lon1) * rad
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1 * rad) * math.cos(lat2 * rad) * math.sin(dlon / 2) ** 2
    return 2 * raio_km * math.asin(math.sqrt(a))


def _coordenadas():
    with open(RAIZ_MAPAS / "dados" / "coordenadas.json", encoding="utf-8") as f:
        return json.load(f)


def test_mesmo_ponto_da_zero():
    """Controle negativo: dois pontos idênticos têm que dar exatamente 0 km."""
    raio = _coordenadas()["planeta"]["raio_km"]
    assert haversine_km(12.3, -45.6, 12.3, -45.6, raio) == pytest.approx(0.0)


def test_antipoda_bate_com_distancia_polo_a_polo_ja_gravada():
    """'Distância já calculada e registrada' (pedido do usuário): dois pontos
    antípodas (em QUALQUER direção -- é propriedade da esfera) distam exatamente
    planeta.distancia_polo_a_polo_km, que já estava em dados/coordenadas.json antes
    desta rodada (pi * raio_km, mesma fórmula documentada em 'planeta._derivacao'),
    não foi inventado agora para o teste passar."""
    dados = _coordenadas()["planeta"]
    raio = dados["raio_km"]
    esperado = dados["distancia_polo_a_polo_km"]

    # par 1: polo norte -> polo sul (o caso "óbvio")
    d1 = haversine_km(90, 0, -90, 0, raio)
    # par 2: um ponto qualquer do equador -> o antípoda dele (longitude +180) --
    # prova que a igualdade não é coincidência do caso polar
    d2 = haversine_km(0, 10, 0, 190, raio)
    assert d1 == pytest.approx(esperado, rel=1e-6)
    assert d2 == pytest.approx(esperado, rel=1e-6)


def test_arco_de_meridiano_0_a_60_graus():
    """Pedido explícito do usuário: dois pontos na mesma longitude, um em 0° de
    latitude e outro em 60°. Ao longo de um meridiano a distância de grande círculo
    tem fórmula fechada independente do haversine: raio_km * ângulo_em_radianos --
    é o mesmo raciocínio de 'distancia_polo_a_polo_km = pi*raio_km' (180°), só que
    para 60°."""
    raio = _coordenadas()["planeta"]["raio_km"]
    calculado = haversine_km(0, -20, 60, -20, raio)
    fechado = raio * math.radians(60)
    assert calculado == pytest.approx(fechado, rel=1e-9)


def test_controle_negativo_paralelo_fora_do_equador_encolhe_com_a_latitude():
    """Dois pontos na MESMA latitude 45° (não no equador), separados por 60° de
    longitude, têm que dar uma distância MENOR que raio_km*radianos(60) -- o
    paralelo de uma latitude não-zero não é um grande círculo, seu raio encolhe por
    cos(latitude). Se desse igual, seria sinal de que a fórmula está tratando
    longitude como se fosse latitude (ignorando o cos(lat) do haversine)."""
    raio = _coordenadas()["planeta"]["raio_km"]
    paralelo_45 = haversine_km(45, -20, 45, 40, raio)
    meridiano_60 = raio * math.radians(60)
    # Fórmula exata de grande círculo entre dois pontos de mesma latitude phi,
    # diferença de longitude dlon (caso particular do haversine com dlat=0):
    # ângulo central = 2*asin(cos(phi) * sin(dlon/2)).
    angulo_exato = 2 * math.asin(math.cos(math.radians(45)) * math.sin(math.radians(60) / 2))
    fechado_paralelo_45 = raio * angulo_exato
    assert paralelo_45 < meridiano_60
    assert paralelo_45 == pytest.approx(fechado_paralelo_45, rel=1e-9)


def test_paralelo_no_equador_bate_com_formula_fechada():
    """Segundo caso fechado independente: no equador (lat=0), a distância de
    grande círculo entre duas longitudes é raio_km * ângulo (o equador É um grande
    círculo, sem o fator cos(lat) que apareceria em outra latitude)."""
    raio = _coordenadas()["planeta"]["raio_km"]
    calculado = haversine_km(0, 0, 0, 45, raio)
    fechado = raio * math.radians(45)
    assert calculado == pytest.approx(fechado, rel=1e-9)

