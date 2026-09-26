# -*- coding: utf-8 -*-
"""Constantes e utilidades comuns da revisão econômica do Centelha (Etapas A, B e C)."""

# ---------------- Âncora ----------------
D_POR_DIA_BRACAL = 1.5            # pence por dia de braçal (Inglaterra 1300-1340)
PC_POR_DIA_BRACAL = 10.0          # tabela de Renda: 60 pc por semana de 6 dias
PC_POR_D = PC_POR_DIA_BRACAL / D_POR_DIA_BRACAL   # 6,667 pc por penny
C_POR_D = 8.0                     # Mastering the Dungeon: 8 C por penny (MtD compila Hodges x8)

def d2pc(d): return d * PC_POR_D
def C2pc(C): return C / C_POR_D * PC_POR_D

# ---------------- Calendário de Uldun ----------------
DIAS_SEMANA = 8
JORNADAS_SEMANA = 6
SEMANAS_MES = 4
SEMANAS_ANO = 48
def ano_terra_para_semana(v_ano):   # valores históricos anuais (365 dias) -> semana de 8 dias
    return v_ano / 365 * DIAS_SEMANA

# ---------------- Média de uma soma (regra do sistema) ----------------
def media(soma):
    return 3.5 * (soma // 2) + (2 if soma % 2 else 0)

# ---------------- Arredondamento ----------------
# A régua do `arred` em tabela (rodada 115): (abaixo de, passo), a última sem teto. O site recebe a
# mesma tabela em recompensas.json, para a calculadora arredondar igual ao modelo.
ARRED_DEGRAUS = [(20, 1), (100, 5), (1000, 10), (None, 100)]
def arred(pc):
    """< 20: inteiro (mínimo 1) · 20-99: múltiplo de 5 · 100-999: múltiplo de 10 · >= 1000: múltiplo de 100."""
    import math
    def r(x, passo): return int(math.floor(x / passo + 0.5) * passo)   # meio para cima
    for teto, passo in ARRED_DEGRAUS:
        if teto is None or pc < teto:
            return max(1, r(pc, passo)) if passo == 1 else r(pc, passo)

def inteiro(pc):
    """Taxa (renda por perfil, diária, hora, salário e custo de criado, Livre dos perfis): pc inteiro, meio
    para cima. Rodada 114: o `arred` de degraus (5, 10, 100) é só para preço de loja."""
    import math
    return int(math.floor(pc + 0.5))

def fmt(pc):
    """Formata pc em po/pp/pc como no livro."""
    pc = int(round(pc))
    if pc == 0: return "0"
    partes = []
    po, r = divmod(pc, 100)
    pp, c = divmod(r, 10)
    if po: partes.append(f"{po:,}".replace(",", ".") + " po")
    if pp: partes.append(f"{pp} pp")
    if c: partes.append(f"{c} pc")
    return " ".join(partes)

# ---------------- Produtores de referência (H-x20 e curva por faixa) ----------------
# Salário pelo trabalho simples (Dif 4): (média - 4) x 20 por semana
def salario_x20(soma): return (media(soma) - 4) * 20

# Valor por ponto-semana em cada faixa de Dificuldade, pelo produtor marginal:
V4 = 20.0
V7 = salario_x20(6) / (media(6) - 7)                 # oficial indiferente entre Dif 4 e Dif 7 = 37,14
V11 = (media(9) - 7) * V7 / (media(9) - 11)            # perito indiferente entre Dif 7 e Dif 11 = 66,86
FAIXAS_DIF = [(4, V4, 0), (7, V7, 2), (11, V11, 4)]    # (Dif, valor, Requisito mínimo típico da faixa)

def renda_ficha(soma, hab=None, bonus=0):
    """Melhor (média + bônus - Dif) x valor, entre as faixas cujo Requisito a Habilidade alcança."""
    m = media(soma) + bonus
    if hab is None: hab = soma // 2
    melhor, faixa = 0.0, None
    for dif, v, req in FAIXAS_DIF:
        if hab >= req and m > dif:
            r = (m - dif) * v
            if r > melhor: melhor, faixa = r, dif
    return melhor, faixa

# custo de um dia de artesão (oficial, H-x20): 130/6
PC_DIA_OFICIAL = salario_x20(6) / JORNADAS_SEMANA        # 21,67 pc
D_DIA_OFICIAL = PC_DIA_OFICIAL / PC_POR_D                 # 3,25 d

def derivado_d(material_d, dias_artesao, margem=1.2):
    """Preço derivado em pence: (material + dias de oficial) x margem de venda."""
    return (material_d + dias_artesao * D_DIA_OFICIAL) * margem

FERRO_D_LB = 1.0      # ferro em barra, 1 d por libra (MtD 8 C)
LB = 0.4536
