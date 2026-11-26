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
    """A Longa a 3 por dado (D-034): 3 × (soma ÷ 2, para baixo) + 2 se a soma é ímpar."""
    return 3 * (soma // 2) + (2 if soma % 2 else 0)

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
def salario_x20(soma): return (media(soma) - 4) * V4

# Valor por ponto-semana em cada faixa de Dificuldade, pelo produtor marginal:
V4 = 26.0
V7 = 47.0
V11 = 96.0
FAIXAS_DIF = [(4, V4, 1), (7, V7, 3), (11, V11, 5)]    # (Dif, valor, Requisito de Habilidade da faixa)

# ---------------- SERVIÇOS CONGELADOS (Forma 1, 26/11/2026; decisão do autor de 02/10/2026)
# "Com a Longa a 3 por dado, a tabela de Serviços não muda: só os valores por ponto de 'Ganhar a vida' são reajustados."
# O modelo novo acima (média a 3 por dado, 26 / 47 / 96, Requisito 1 / 3 / 5) vale SÓ para Ganhar a vida. A curva por soma, as
# tarifas por perfil, as diárias com bônus, as aulas, os criados e os tetos continuam os de antes, byte a byte, e por isso saem
# de uma TABELA PUBLICADA FIXA (a renda por semana de cada soma, a que o livro publica) e das funções `*_v1`, que repetem a conta
# antiga com as constantes antigas (média a 3,5 por dado, V4 = 20, V7 e V11 pela indiferença do oficial e do perito, Requisito 0 / 2 / 4).
# Quem mudar V4, V7, V11 ou a média NÃO muda Serviços: o teste scripts/test-economia-servicos-congelados.mjs trava a tabela e
# acusa se a conta antiga deixar de bater com ela.
RENDA_PUBLICADA = {4: 60, 5: 100, 6: 130, 7: 200, 8: 260, 9: 330, 10: 430, 11: 570, 12: 670}   # pc por semana de trabalho, por soma

def media_v1(soma):
    return 3.5 * (soma // 2) + (2 if soma % 2 else 0)
def salario_x20_v1(soma): return (media_v1(soma) - 4) * 20
V4_V1 = 20.0
V7_V1 = salario_x20_v1(6) / (media_v1(6) - 7)
V11_V1 = (media_v1(9) - 7) * V7_V1 / (media_v1(9) - 11)
FAIXAS_DIF_V1 = [(4, V4_V1, 0), (7, V7_V1, 2), (11, V11_V1, 4)]
def renda_ficha_v1(soma, hab=None, bonus=0):
    """A conta antiga, congelada: melhor (média + bônus - Dif) x valor, entre as faixas cujo Requisito antigo a Habilidade alcança."""
    m = media_v1(soma) + bonus
    if hab is None: hab = soma // 2
    melhor, faixa = 0.0, None
    for dif, v, req in FAIXAS_DIF_V1:
        if hab >= req and m > dif:
            r = (m - dif) * v
            if r > melhor: melhor, faixa = r, dif
    return melhor, faixa

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
