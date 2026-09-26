# -*- coding: utf-8 -*-
"""Etapas A (munição, linhas, moeda), B (renda) e C (custo de vida, montarias, viagens, serviços, servos, qualidade, reparo)."""
from base import *
import mercadorias as M
P = M.POR_ID
def pb(i): return P[i]["pc_bruto"]

OUT = {}

# =====================================================================
# ETAPA A.1 · MUNIÇÃO (tabela do jogo, jornada de artesão de 8 h)
# =====================================================================
JORNADA_H = {"leve": 6, "artesao": 8, "bracal": 10}
def custo_hora(soma, jornada="artesao"):
    return salario_x20(soma) / (JORNADAS_SEMANA * JORNADA_H[jornada])

def linha_preco(mont, peca, dif, n, soma=6, escala="hora", jornada="artesao", margem=1.8):
    prog = media(soma) - dif
    pontos = (mont + n * peca) / n
    intervalos = pontos / prog
    if escala == "hora": custo = intervalos * custo_hora(soma, jornada)
    elif escala == "dia": custo = intervalos * salario_x20(soma) / JORNADAS_SEMANA
    return custo * margem, intervalos

mun = []
for nome, mont, peca, dif, por, obs in [
    ("Flecha de guerra (dúzia)", 2, 6, 7, 12, "Arcos, Req 2"),
    ("Flecha rústica (dúzia)", 2, 5, 4, 12, "Ofícios Gerais, Req 1"),
    ("Virote (dúzia, H-peso-B 0,5/0,3)", 2, 10, 7, 12, "sem linha; Peça da flecha x peso"),
]:
    av, hav = linha_preco(mont, peca, dif, 1)
    lo, hlo = linha_preco(mont, peca, dif, 8)
    mun.append(dict(nome=nome, obs=obs, avulso_duzia=av, lote_duzia=lo, horas_avulso=hav, horas_lote=hlo,
                    avulso_10=av / 12 * 10, lote_10=lo / 12 * 10))
HIST_FLECHA_10 = d2pc(14 / 24 * 10)   # 1341: feixe de 24 flechas de ponta de aço, 14 d
HIST_VIROTE_10 = d2pc(0.16 * 10)      # 1240: 25.000 virotes por 25 marcos
OUT["municao"] = dict(linhas=mun, hist_flecha_10=HIST_FLECHA_10, hist_virote_10=HIST_VIROTE_10)

# ---- Linhas novas propostas para itens do dia a dia (Dif 4 e 7), com preço pela régua
linhas_novas = []
for nome, oficio, req, dif, mont, peca, hist_pc in [
    ("Sapato, bota de uso", "Couraria, Ofícios Gerais", 1, 4, 2, 4, pb("sapatos")),
    ("Cadeado, grilhão, dobradiça grande", "Ferreiro, Serralheria", 2, 7, 2, 4, pb("cadeado")),
]:
    av, dav = linha_preco(mont, peca, dif, 1, escala="dia")
    lo, dlo = linha_preco(mont, peca, dif, 8, escala="dia")
    linhas_novas.append(dict(nome=nome, oficio=oficio, req=req, dif=dif, mont=mont, peca=peca,
                             dias_avulso=dav, avulso=av, lote=lo, hist=hist_pc))
# O que a linha existente 'Sela, arreio, bota' dá para a bota (Curtume, Req 2, Dif 7, Mont 3, Peça 9)
bota_linha_av, _ = linha_preco(3, 9, 7, 1, escala="dia")
OUT["linhas_novas"] = dict(linhas=linhas_novas, bota_linha_existente=bota_linha_av)

# =====================================================================
# ETAPA A.3 · MOEDA
# =====================================================================
MOEDA_G = 30
moeda = []
for nome, valor in [("cobre (pc)", 1), ("prata (pp)", 10), ("ouro (po)", 100), ("platina (pl)", 1000)]:
    moeda.append(dict(nome=nome, valor_pc=valor, pc_por_100g=valor / MOEDA_G * 100))
peso_bolsa = [(n, v, v * MOEDA_G / 1000) for n, v in [("100 pc", 100), ("100 pp", 100), ("100 po", 100), ("1.000 po", 1000)]]
OUT["moeda"] = dict(moedas=moeda, cobre_mercadoria_100g=pb("cobre") / 10,
                    ferro_100g=pb("ferro") / 10, prata_hist_100g=d2pc(100 / 1.44),
                    ouro_prata_hist=11)

# =====================================================================
# ETAPA B · RENDA
# =====================================================================
curva = []
for s in range(4, 13):
    r, f = renda_ficha(s)
    curva.append(dict(soma=s, media=media(s), linear_x20=salario_x20(s), convexa=r, faixa_dif=f,
                      x_bracal=r / 60))
proezas = [(b, renda_ficha(12, 6, b)[0]) for b in (0, 3, 4, 6, 9, 12, 15)]
OUT["curva"] = dict(curva=curva, V4=V4, V7=V7, V11=V11, proezas=proezas,
                    oficial_proeza15_trava=renda_ficha(6, 3, 15)[0])

TETOS = {"aldeia": 100, "vila": 300, "cidade": 1000, "capital": None}

FAIXAS = [  # nome, recursos, renda/sem (mantida), soma de referência / origem
    ("Braçal", 1, 60, "soma 4, trabalho simples"),
    ("Destreinado", 1, 100, "soma 5, trabalho simples"),
    ("Treinado", 2, 270, "soma 8 (260 pela curva)"),
    ("Especialista", 3, 550, "soma 11 (568 pela curva)"),
    ("Doutor", 3, 820, "soma 12 + Proeza ou reputação (669 a 869)"),
    ("Abastado", 4, 1400, "renda de capital: oficina com empregados, comércio"),
    ("Rico", 4, 2700, "capital e posição"),
    ("Aristocrata", 5, 4200, "terra, cargo, título"),
    ("Nobreza", 5, 10000, "senhorio de terras e rendas"),
]
import math
LIVRE_A, LIVRE_B = 0.12, 0.02   # curva D (decisão do autor): 12% no braçal, 2% na nobreza
LIVRE_K = math.log(LIVRE_A / LIVRE_B) / math.log(10000 / 60)
def livre_frac(renda): return LIVRE_A * (60 / renda) ** LIVRE_K

# ---- cestas por adulto-equivalente (ano de 365 dias), preços da tabela de mercadorias
u = dict(
    aveia_kg=pb("aveia") / 15, feijao_kg=(pb("feijao") + pb("ervilha")) / 2 / 27, carne_kg=pb("carne"),
    manteiga_kg=pb("manteiga") / LB, queijo_kg=pb("queijo") / LB, ovo=pb("ovos") / 12,
    cerveja_l=pb("cerveja-jarra") / 2, vinho_l=pb("vinho-galao") / 4.5, vinho_bom_l=pb("vinho-bom-galao") / 4.5,
    sabao_kg=pb("sabao") / 0.1, linho_m=pb("linho-grosso") / 0.9144, tecido_m=pb("tecido-comum") / 0.9144,
    la_fina_m=pb("la-fina") / 0.9144, linho_fino_m=pb("linho") / 0.9144,
    vela_kg=pb("vela-sebo-libra") / LB, vela_cera_kg=pb("vela-cera") / LB, oleo_l=pb("frasco-oleo") / 0.5,
    pao_kg=pb("pao"), pimenta_kg=pb("pimenta") * 10, acucar_kg=pb("acucar") / LB, acafrao_g=pb("acafrao") / 10,
)
def cesta(itens, fuel_share):
    linhas = [(n, q, un, q * u[k]) for n, q, un, k in itens]
    sub = sum(l[3] for l in linhas)
    total = sub / (1 - fuel_share)
    linhas.append(("Combustível", None, "", total - sub))
    return linhas, total
CESTAS_DEF = {
    "S": ("Subsistência", 16.77 / 213.0, [
        ("Aveia", 155, "kg", "aveia_kg"), ("Feijão/ervilha", 20, "kg", "feijao_kg"), ("Carne", 5, "kg", "carne_kg"),
        ("Manteiga", 3, "kg", "manteiga_kg"), ("Sabão", 1.3, "kg", "sabao_kg"), ("Linho comum", 3, "m", "linho_m"),
        ("Velas de sebo", 1.3, "kg", "vela_kg"), ("Óleo de lamparina", 1.3, "L", "oleo_l")]),
    "R": ("Respeitável", 27.95 / 558.6, [
        ("Pão", 182, "kg", "pao_kg"), ("Feijão/ervilha", 34, "kg", "feijao_kg"), ("Carne", 26, "kg", "carne_kg"),
        ("Manteiga", 5.2, "kg", "manteiga_kg"), ("Queijo", 5.2, "kg", "queijo_kg"), ("Ovos", 52, "un", "ovo"),
        ("Cerveja", 182, "L", "cerveja_l"), ("Sabão", 2.6, "kg", "sabao_kg"), ("Linho comum", 5, "m", "linho_m"),
        ("Velas de sebo", 2.6, "kg", "vela_kg"), ("Óleo de lamparina", 2.6, "L", "oleo_l")]),
    "F": ("Farta", 0.05, [
        ("Pão", 182, "kg", "pao_kg"), ("Feijão/ervilha", 20, "kg", "feijao_kg"), ("Carne", 52, "kg", "carne_kg"),
        ("Manteiga", 8, "kg", "manteiga_kg"), ("Queijo", 10, "kg", "queijo_kg"), ("Ovos", 104, "un", "ovo"),
        ("Cerveja", 91, "L", "cerveja_l"), ("Vinho comum", 91, "L", "vinho_l"), ("Sabão", 4, "kg", "sabao_kg"),
        ("Linho comum", 5, "m", "linho_m"), ("Tecido comum", 5, "m", "tecido_m"), ("Velas de sebo", 2.6, "kg", "vela_kg"),
        ("Velas de cera", 1, "kg", "vela_cera_kg"), ("Óleo de lamparina", 2.6, "L", "oleo_l"),
        ("Pimenta e especiarias", 0.5, "kg", "pimenta_kg"), ("Açúcar", 1, "kg", "acucar_kg")]),
    "L": ("Luxo", 0.05, [
        ("Pão fino", 182, "kg", "pao_kg"), ("Carne, caça e peixe", 90, "kg", "carne_kg"),
        ("Manteiga", 10, "kg", "manteiga_kg"), ("Queijo", 15, "kg", "queijo_kg"), ("Ovos", 150, "un", "ovo"),
        ("Vinho bom", 270, "L", "vinho_bom_l"), ("Sabão", 6, "kg", "sabao_kg"), ("Linho fino", 8, "m", "linho_fino_m"),
        ("Lã fina", 5, "m", "la_fina_m"), ("Velas de cera", 6, "kg", "vela_cera_kg"),
        ("Pimenta e especiarias", 2, "kg", "pimenta_kg"), ("Açúcar", 3, "kg", "acucar_kg"), ("Açafrão", 20, "g", "acafrao_g")]),
}
CESTAS = {}
for k, (nome, fs, itens) in CESTAS_DEF.items():
    linhas, tot = cesta(itens, fs)
    CESTAS[k] = dict(nome=nome, linhas=linhas, ano=tot, semana=ano_terra_para_semana(tot), dia=tot / 365)
CESTAS["M"] = dict(nome="Modesta (meio a meio)", ano=(CESTAS["S"]["ano"] + CESTAS["R"]["ano"]) / 2)
CESTAS["M"]["semana"] = ano_terra_para_semana(CESTAS["M"]["ano"])
cs = {k: v["semana"] for k, v in CESTAS.items()}

MORADIA = {  # aluguel anual em pence (Hodges; casa senhorial e paço: extrapolação)
    "choupana": ("Choupana", 60), "artesao": ("Casa de artesão com oficina", 240),
    "mercador": ("Casa de mercador", 600), "senhorial": ("Casa senhorial pequena", 2400),
    "paco": ("Paço, solar fortificado", 12000),
}
mor = {k: ano_terra_para_semana(d2pc(v)) for k, (n, v) in MORADIA.items()}

CRIADOS = {  # salário anual em pence, mais casa e comida (cesta do nível da casa)
    "aprendiz": ("Aprendiz, menino de recados", 48, "S"),
    "criado": ("Criado ou criada de casa", 120, "R"),
    "cavalarico": ("Cavalariço", 120, "R"),
    "cozinheiro": ("Cozinheiro", 200, "R"),
    "valete": ("Valete, criado de casa rica", 360, "F"),
    "guarda": ("Guarda armado da casa", 208, "R"),
    "escudeiro": ("Escudeiro da casa", 240, "F"),
    "mordomo": ("Mordomo (administrador)", 1200, "F"),
    "capelao": ("Capelão", 960, "F"),
}
def custo_criado(k):
    n, sal, c = CRIADOS[k]
    return ano_terra_para_semana(d2pc(sal)) + cs[c]
crd = {k: custo_criado(k) for k in CRIADOS}

CAVALO_SEM = ano_terra_para_semana(d2pc(284.5))       # Langdon: 23s 8,5d por ano (cavalo de carroça)
CAVALO_GUERRA_SEM = 5.4 * DIAS_SEMANA * PC_POR_D      # 1287: 5,4 d por dia
def roupa_ano(id_, n): return pb(id_) * n / SEMANAS_ANO   # roupa de status por ano (gasta em 48 semanas)

PACOTES = {
    "Braçal": [("3 adultos-equivalentes, cesta de subsistência", 3 * cs["S"]), ("Choupana", mor["choupana"])],
    "Destreinado": [("3 AE, cesta modesta", 3 * cs["M"]), ("Choupana", mor["choupana"])],
    "Treinado": [("3 AE, cesta respeitável", 3 * cs["R"]), ("Casa de artesão", mor["artesao"]),
                 ("Aprendiz", crd["aprendiz"]), ("Roupa de artesão nova para o casal, por ano", roupa_ano("roupa-artesao", 2)),
                 ("Mula ou cavalo dividido (meio)", CAVALO_SEM / 2)],
    "Especialista": [("3 AE, cesta respeitável", 3 * cs["R"]), ("Casa de mercador", mor["mercador"]),
                     ("2 criados", 2 * crd["criado"]), ("Um cavalo", CAVALO_SEM),
                     ("Roupa fina para o casal, por ano", roupa_ano("roupas-finas", 2))],
    "Doutor": [("3 AE, cesta farta", 3 * cs["F"]), ("Casa de mercador", mor["mercador"]),
               ("2 criados e 1 cozinheiro", 2 * crd["criado"] + crd["cozinheiro"]), ("Um cavalo", CAVALO_SEM),
               ("Roupa fina para o casal, por ano", roupa_ano("roupas-finas", 2)), ("Livros, um por ano", pb("livro-estudo") / SEMANAS_ANO)],
    "Abastado": [("3 AE, cesta farta", 3 * cs["F"]), ("Casa senhorial pequena", mor["senhorial"]),
                 ("4 criados, cozinheiro, cavalariço", 4 * crd["criado"] + crd["cozinheiro"] + crd["cavalarico"]),
                 ("Dois cavalos", 2 * CAVALO_SEM), ("Roupa fina, 2 por adulto por ano", roupa_ano("roupas-finas", 4))],
    "Rico": [("3 AE, cesta de luxo", 3 * cs["L"]), ("Casa senhorial pequena", mor["senhorial"]),
             ("Valete, 4 criados, cozinheiro, 2 cavalariços", crd["valete"] + 4 * crd["criado"] + crd["cozinheiro"] + 2 * crd["cavalarico"]),
             ("Quatro cavalos", 4 * CAVALO_SEM), ("Roupa de corte, 1 por adulto por ano", roupa_ano("roupa-nobre", 2))],
    "Aristocrata": [("3 AE, cesta de luxo", 3 * cs["L"]), ("Casa senhorial", mor["senhorial"]),
                    ("Mordomo, 2 valetes, 6 criados, cozinheiro, 2 cavalariços", crd["mordomo"] + 2 * crd["valete"] + 6 * crd["criado"] + crd["cozinheiro"] + 2 * crd["cavalarico"]),
                    ("4 guardas", 4 * crd["guarda"]), ("Cavalo de guerra e 3 cavalos", CAVALO_GUERRA_SEM + 3 * CAVALO_SEM),
                    ("Roupa de corte, 2 por adulto por ano", roupa_ano("roupa-nobre", 4))],
    "Nobreza": [("3 AE, cesta de luxo", 3 * cs["L"]), ("Paço", mor["paco"]),
                ("Casa: mordomo, capelão, 2 escudeiros, 6 valetes, 12 criados, 3 cozinheiros, 4 cavalariços", crd["mordomo"] + crd["capelao"] + 2 * crd["escudeiro"] + 6 * crd["valete"] + 12 * crd["criado"] + 3 * crd["cozinheiro"] + 4 * crd["cavalarico"]),
                ("12 guardas", 12 * crd["guarda"]), ("2 cavalos de guerra e 8 cavalos", 2 * CAVALO_GUERRA_SEM + 8 * CAVALO_SEM),
                ("Roupa de corte 2 e gala 1 por adulto por ano", roupa_ano("roupa-nobre", 4) + roupa_ano("roupa-gala", 2))],
}
tabela_renda = []
for nome, rec, renda, orig in FAIXAS:
    f = livre_frac(renda)
    livre = arred(renda * f)
    custo = renda - livre
    pac = PACOTES[nome]; base = sum(v for _, v in pac)
    tabela_renda.append(dict(faixa=nome, recursos=rec, renda=renda, origem=orig, livre_frac=f, livre=livre,
                             custo=custo, pacote=pac, pacote_total=base, estilo=custo - base,
                             estilo_frac=(custo - base) / custo, renda_mes=renda * 4, renda_ano=renda * 48,
                             livre_mes=livre * 4, livre_ano=livre * 48))
OUT["renda"] = tabela_renda

# ---- Níveis de vida por pessoa (NPC viajante, personagem sem casa; e regra de viver abaixo do nível)
NIVEIS = [
    ("Miserável", cs["S"], "Cesta de subsistência; dorme onde der."),
    ("Pobre", cs["S"] + mor["choupana"] / 2, "Subsistência e meia choupana (ou canto alugado)."),
    ("Modesto", cs["R"] + mor["artesao"] / 3, "Cesta respeitável e um quarto."),
    ("Confortável", cs["R"] + mor["artesao"] / 2 + crd["criado"] / 3, "Respeitável, meia casa, parte de um criado."),
    ("Abastado", cs["F"] + mor["mercador"] / 2 + crd["criado"] + CAVALO_SEM, "Farta, meia casa de mercador, um criado, um cavalo."),
    ("Rico", cs["L"] + mor["mercador"] + 2 * crd["valete"] + CAVALO_SEM + roupa_ano("roupa-nobre", 1), "Luxo, casa de mercador, dois valetes, cavalo, roupa de corte."),
    ("Aristocrata", cs["L"] + mor["senhorial"] + crd["mordomo"] + 3 * crd["valete"] + 2 * CAVALO_SEM + roupa_ano("roupa-nobre", 2), "Casa senhorial própria e séquito doméstico."),
]
ESTALAGEM_SEM = {"Pobre": (3 + 3 * 1) * 8, "Modesto": (7 + 3 * 3) * 8, "Confortável": (15 + 3 * 8) * 8,
                 "Abastado": (20 + 3 * 20) * 8, "Rico": (50 + 3 * 80) * 8, "Aristocrata": (300 + 3 * 160) * 8}
OUT["niveis"] = [dict(nivel=n, semana=v, proposto=arred(v), comp=c, estalagem=ESTALAGEM_SEM.get(n)) for n, v, c in NIVEIS]
FAIXA_NIVEL = {"Braçal": "Pobre", "Destreinado": "Pobre", "Treinado": "Confortável", "Especialista": "Abastado",
               "Doutor": "Abastado", "Abastado": "Rico", "Rico": "Rico", "Aristocrata": "Aristocrata", "Nobreza": "Aristocrata"}

# =====================================================================
# ETAPA C.5 · MONTARIAS, ANIMAIS, VEÍCULOS
# =====================================================================
def dpc(d): return d2pc(d)
MONTARIAS = [  # id, nome, pence, fonte, conf, nota, atual_pc
    ("ponei", "Pônei ou garrano", 60, "Derivado", "C", "Abaixo do cavalo de carga; montaria de criança e de terreno difícil.", 400),
    ("burro", "Burro ou jumento", 50, "Derivado", "C", "Abaixo do cavalo de carga (a MtD dá 100 d, acima dele). O catálogo tem 12 pp.", 120),
    ("cavalo-carga", "Cavalo de carga (sumpter)", 90, "Hodges", "B", "5 a 10s (séc. XIII).", None),
    ("cavalo-tracao", "Cavalo de tração ou de arado", 202, "Langdon", "A", "Farmer 1276-1300: compra média 16s 10d.", None),
    ("boi-tracao", "Boi de arado", 138, "Langdon", "A", "Farmer 1276-1300: 11s 6,5d.", None),
    ("mula", "Mula de sela", 360, "Derivado", "C", "Montaria de clérigo e mercador; valia como um rocim.", None),
    ("rocim", "Rocim (cavalo de montaria comum)", 360, "Derivado", "C", "Entre o cavalo de tração (16s) e o palafrém (£4-5); £1 10s. É o 'Cavalo' do catálogo.", 600),
    ("palafrem", "Palafrém (montaria fina, de passo)", 1080, "Hodges", "B", "£4 a 5.", None),
    ("corcel", "Corcel (courser, caça e guerra leve)", 2400, "Hodges", "B", "Cavalo de montaria de alta classe, £10 (séc. XIII).", None),
    ("cavalo-guerra", "Cavalo de guerra de escudeiro", 1680, "Ayton", "A", "Cavalo de escudeiro ~£7 (1282); avaliação mínima de campanha £5; a média dos homens de armas ia de £7,6 a £16,4 (1282-1364).", None),
    ("destrier", "Destrier (cavalo de guerra de cavaleiro)", 7200, "Ayton", "A", "£30 (típico de cavaleiro: £15 a £40; excepcionais £60 a £100).", None),
    ("camelo", "Camelo", 900, "Derivado", "C", "Sem fonte europeia. Posto entre o rocim e o palafrém; região de origem com modificador forte para baixo.", 500),
    ("elefante", "Elefante adestrado", 14400, "Derivado", "C", "Presente de reis. Sem fonte: posto no dobro de um destrier. Na região de origem, modificador forte para baixo.", 2800),
    ("cao-comum", "Cão comum", 3, "Derivado", "C", "Vira-lata ou cão de pastor sem treino.", None),
    ("cao-guarda", "Cão de guarda adestrado", 22.5, "Derivado", "C", "Cão comum (20) mais uma semana de adestrador oficial (130). A MtD dá ~1.300 pc, preço de cão de raça.", None),
    ("cao-caca", "Cão de caça adestrado", 90, "Derivado", "C", "Luxo de senhor.", None),
    ("cao-guerra", "Cão de guerra", 150, "Derivado", "C", "", None),
    ("falcao", "Falcão adestrado", 500, "MtD", "B", "Luxo nobre; falcoaria.", None),
    ("pombo", "Pombo-correio treinado", 250, "MtD", "B", "", None),
]
CRIACAO = [
    ("galinha", "Galinha", 0.5, "Hodges", "A", "2 por 1 d (séc. XIV).", 2),
    ("ganso", "Ganso", 6, "Hodges", "A", "Preço legal em Londres, 1375.", None),
    ("porco", "Porco", 30, "Hodges", "A", "2s em Somerset, 3s em Londres (1338).", 30),
    ("ovelha", "Ovelha", 17, "Hodges", "A", "1s 5d (meados do séc. XIV).", 30),
    ("carneiro", "Carneiro capado", 12, "MtD", "B", "9 a 10 d em Somerset, 1s 5d em Londres.", None),
    ("cabra", "Cabra", 10, "MtD", "B", "", 50),
    ("vaca", "Vaca", 113, "Hodges", "A", "9s 5d (meados do séc. XIV).", 160),
    ("touro", "Touro", 150, "Derivado", "C", "1301: touro 8s contra vaca 6s; aplicada a mesma razão (4/3) à vaca de 9s 5d.", 100),
    ("potro", "Cavalo de criação (não adestrado para sela)", 200, "Langdon", "B", "É o cavalo de tração vendido como gado. Com 8 semanas de adestramento (1.000) vira rocim (2.400).", 140),
]
ARREIOS = [
    ("sela", "Sela comum", 130, "Tabela do jogo", "B", "Linha 'Sela, arreio, bota' (Curtume, Req 2, Dif 7, Mont 3, Peça 9) avulsa: ~134."),
    ("sela-guerra", "Sela de guerra (qualidade Boa)", 290, "Tabela do jogo", "C", "Sela Boa pela régua de qualidade (~2,2x)."),
    ("arreio", "Arreio e rédeas", 60, "Derivado", "C", "Metade da sela."),
    ("cangalha", "Cangalha (sela de carga)", 45, "Derivado", "C", ""),
    ("ferradura", "Ferragem completa (4 ferraduras, cravos, ferrador)", 40, "Hodges", "B", "4 ferraduras a ~1,2 d, 32 cravos (20 d o milheiro, 1299-1300) e o ferrador: ~5,6 d. Langdon: 14 d por ano num cavalo de carroça (já incluído na manutenção semanal)."),
    ("racao-cavalo", "Ração de cavalo (grão e feno)", 4, "Langdon", "A", "6,65 quarters de aveia por ano a 2s 4d: ~3,4 pc por dia, mais feno."),
    ("estabulo", "Estábulo com ração, por noite (estalagem)", 7, "Hodges", "B", "Fodder de estalagem, 1331."),
]
VEICULOS = [
    ("carroca", "Carroça de duas rodas", 300, "Catálogo", "B", "Hodges: carroça ferrada 4s (c. 1350) = 320. Mantido 3 po (decisão do autor). A linha de fabricação que dá ~1.600 precisa ser recalibrada.", 300),
    ("carro-quatro-rodas", "Carroção de quatro rodas", 800, "Derivado", "C", "Dobro de peças e eixos da carroça, com margem.", None),
    ("carruagem", "Carruagem", 12800, "Hodges", "B", "'Chariot' £8 (1381). O catálogo tem 20 po.", 2000),
    ("carruagem-luxo", "Carruagem de luxo", 640000, "Hodges", "B", "Carruagem de rainha, £400. Tesouro, não mercadoria.", None),
    ("treno", "Trenó", 100, "Catálogo", "B", "Mantido.", 100),
    ("barco-remo", "Barco a remo", 400, "Derivado", "C", "Sem fonte. Uma semana de carpinteiro naval e madeira.", None),
    ("barco-pesca", "Barco de pesca com vela", 1600, "Tabela do jogo", "B", "Linha de barco de pesca (acoes-oficio-e-mundo.md:173), avulso ~1.600.", None),
    ("coca", "Navio mercante (coca)", 400000, "Derivado", "C", "Sem preço direto antes de 1450; posto perto das galeras reais de 1295.", None),
    ("galera", "Galera de guerra (~120 remos)", 688000, "Exchequer 1295", "A", "£321 a £540 cada (1295); média ~£430.", None),
]
def fecha_lista(lst):
    out = []
    for row in lst:
        iid, nome, val, fonte, conf, nota = row[:6]
        atual = row[6] if len(row) > 6 else None
        pc = d2pc(val)
        out.append(dict(id=iid, nome=nome, pc_bruto=pc, pc=arred(pc), fonte=fonte, conf=conf, nota=nota, atual=atual))
    return out
OUT["montarias"] = fecha_lista(MONTARIAS)
OUT["criacao"] = fecha_lista(CRIACAO)
OUT["arreios"] = [dict(id=a, nome=b, pc=arred(c), pc_bruto=c, fonte=d, conf=e, nota=f) for a, b, c, d, e, f in ARREIOS]
vei = [dict(id=iid, nome=nome, pc_bruto=val, pc=arred(val), fonte=fonte, conf=conf, nota=nota, atual=atual)
       for iid, nome, val, fonte, conf, nota, atual in VEICULOS]
OUT["veiculos"] = vei
OUT["manutencao_animais"] = dict(cavalo_sem=CAVALO_SEM, cavalo_dia=CAVALO_SEM / 8, cavalo_guerra_sem=CAVALO_GUERRA_SEM,
                                 boi_ano_pc=d2pc(7 * 12 + 2.5), boi_sem=ano_terra_para_semana(d2pc(86.5)))

# =====================================================================
# ETAPA C.6 · VIAGENS (km)
# =====================================================================
VELOCIDADES = [("A pé", 25), ("A pé, marcha forçada", 40), ("Caravana", 30), ("Carroça pesada ou carro de bois", 15),
               ("A cavalo, comitiva grande", 30), ("A cavalo, grupo pequeno", 50), ("Mensageiro a cavalo, sem troca", 60), ("Mensageiro com troca de cavalos", 110),
               ("Navio mercante", 120), ("Galera", 80), ("Barco, rio abaixo", 60), ("Barco, rio acima", 25)]
CARROCA_DIA = 60   # carroça com carroceiro e parelha, por dia (entre a construção 30 e 1342 147)
PASSAGEIROS_CARROCA = 4
frete_terra_tkm = d2pc(1) / (1.609 * 1.016)   # ~1 d por tonelada-milha
viagens = dict(
    carroca_dia=CARROCA_DIA, lugar_carroca_dia=CARROCA_DIA / PASSAGEIROS_CARROCA,
    lugar_carroca_km=CARROCA_DIA / PASSAGEIROS_CARROCA / 30, a_pe_caravana_dia=5,
    catalogo_caravana_km=100 / 160.9, catalogo_navio_km=50 / 160.9, catalogo_municipal_km=6 / 1.609,
    frete_terra_tkm=frete_terra_tkm, frete_rio_tkm=frete_terra_tkm / 2, frete_mar_tkm=frete_terra_tkm / 8,
    frete_vinho_bordeaux_tkm=d2pc(96) / 900,   # 8s por tonel ~ 900 km
    cavalo_aluguel_km=d2pc(12) / 48, cavalo_aluguel_dia=d2pc(12) / 48 * 40,
)
OUT["viagens"] = dict(vel=VELOCIDADES, **viagens)

# =====================================================================
# ETAPA C.7 · SERVIÇOS CONTRATADOS
# =====================================================================
def diaria(soma, bonus=0, hab=None):
    r, _ = renda_ficha(soma, hab, bonus)
    return r / JORNADAS_SEMANA
PERFIS = [("Braçal", 4), ("Destreinado", 5), ("Oficial", 6), ("Profissional (soma 8)", 8), ("Perito (soma 9)", 9),
          ("Especialista (soma 10)", 10), ("Especialista (soma 11)", 11), ("Mestre (soma 12)", 12)]
tarifas = []
for nome, s in PERFIS:
    d = diaria(s)
    tarifas.append(dict(perfil=nome, soma=s, semana=renda_ficha(s)[0], contrato=d, avulsa=d * 1.5,
                        hora_leve=d * 1.5 / 6, hora_artesao=d * 1.5 / 8, hora_bracal=d * 1.5 / 10))
MILITAR_HIST = [("Arqueiro a pé", 3), ("Lanceiro galês", 2), ("Arqueiro montado, hobelar", 6), ("Homem de armas, escudeiro", 12),
                ("Cavaleiro", 24), ("Cavaleiro bandeirado", 48), ("Conde", 80)]
OUT["servicos"] = dict(tarifas=tarifas, militar=[(n, d, d2pc(d)) for n, d in MILITAR_HIST])

# ---- Empréstimo de XP: aula
XP = {"Atributo": lambda n: 5 + 5 * n, "Habilidade primária": lambda n: 4 + 2 * n,
      "Habilidade secundária": lambda n: 2 + n, "Especialidade primária": lambda n: 8 + 4 * n,
      "Virtude": lambda n: 4 + 2 * n}
aulas = []
for tipo, novo, prof_soma in [("Habilidade primária", 2, 6), ("Habilidade primária", 3, 8), ("Habilidade primária", 4, 9),
                              ("Habilidade primária", 5, 11), ("Habilidade secundária", 3, 8), ("Atributo", 3, 8),
                              ("Atributo", 4, 9), ("Atributo", 5, 11), ("Especialidade primária", 1, 9)]:
    xp = XP[tipo](novo)
    jornadas = xp / 2
    preco = jornadas * diaria(prof_soma) * 1.5
    aulas.append(dict(tipo=tipo, novo=novo, xp=xp, jornadas=jornadas, prof_soma=prof_soma, preco=preco))
OUT["aulas"] = aulas

# =====================================================================
# ETAPA C.8 · SERVOS E ESCRAVOS
# =====================================================================
SUSTENTO_ESCRAVO = cs["S"] + mor["choupana"] / 3
escravos = []
for nome, renda_trab, mult, nota, atual in [
    ("Destreinado", 60, 1.5, "Trabalho braçal.", 800),
    ("Doméstico", 100, 1.5, "Serviço de casa, cozinha, recados.", 1400),
    ("Treinado (ofício)", 130, 1.5, "Artesão comum, soma 6.", 2000),
    ("Especializado", 260, 1.5, "Soma 8: escriba, músico, artesão fino. Raro.", None),
    ("Companhia (concubina)", 100, 2.25, "Os maiores preços dos registros eram de mulheres jovens (Florença 1366-97: 30 a 50 florins).", 3000),
]:
    preco = renda_trab * SEMANAS_ANO * mult
    escravos.append(dict(nome=nome, preco=preco, pc=arred(preco), renda_trab=renda_trab, nota=nota, atual=atual))
ESCRAVO_HIST = [("Candia 1301, mulher", d2pc(504)), ("Florença 1366, mulher de 18-25 (30-50 florins)", (d2pc(1080), d2pc(1800))),
                ("Veneza 1394, menina", d2pc(1368)), ("Referência: braçal por ano", 60 * SEMANAS_ANO)]
OUT["escravos"] = dict(lista=escravos, sustento=SUSTENTO_ESCRAVO, sustento_mes=SUSTENTO_ESCRAVO * 4, hist=ESCRAVO_HIST)
OUT["criados"] = [dict(id=k, nome=n, salario_ano_d=s, salario_sem=ano_terra_para_semana(d2pc(s)), cesta=c, custo_sem=crd[k])
                  for k, (n, s, c) in CRIADOS.items()]

# =====================================================================
# EXTRA · QUALIDADE (régua T3-F com a curva de renda)
# =====================================================================
PERFIS_Q = [(6, 3), (9, 4), (9, 5), (12, 6)]   # (soma, Habilidade)
INTERVALO_SEM = {"dia": 1 / 6, "semana": 1.0, "estação": 12.0}
DEGRAUS = ["dia", "semana", "estação"]
def custo_qualidade(req, dif, mont, peca, intervalo, grau, regra="texto", piso=0, req_max=None):
    r = req + grau; d = dif + 3 * grau; ac = (mont + peca) * 1.5 ** grau
    if req_max and r > req_max:
        d += 3 * (r - req_max); r = req_max
    iv = intervalo
    if regra == "texto" and grau >= 2:
        iv = DEGRAUS[min(DEGRAUS.index(intervalo) + grau // 2, 2)]
    melhores = []
    for soma, hab in PERFIS_Q:
        m = media(soma)
        if hab >= r and m > d:
            n_int = ac / (m - d)
            if regra == "piso" and grau >= 2: n_int = max(n_int, piso * (grau - 1))
            semanas = n_int * INTERVALO_SEM[iv]
            sal = renda_ficha(soma, hab)[0]
            melhores.append((semanas * sal * 1.8, soma, hab, semanas))
    if not melhores: return None
    return min(melhores)
qual = []
for nome, req, dif, mont, peca, iv in [("Faca (linha Dif 4)", 2, 4, 6, 3, "dia"), ("Espada (linha Dif 7)", 3, 7, 12, 10, "dia"),
                                       ("Placa completa (Dif 11)", 5, 11, 6, 24, "semana")]:
    base = custo_qualidade(req, dif, mont, peca, iv, 0)
    linha = dict(peca=nome, comum=base[0])
    for regra, piso, rmax in [("texto", 0, None), ("piso", 6, None), ("piso", 6, 6)]:
        chave = regra + ("_rmax" if rmax else "")
        linha[chave] = {}
        for g, gnome in [(1, "Boa"), (2, "Ótima"), (3, "Excepcional")]:
            c = custo_qualidade(req, dif, mont, peca, iv, g, regra, piso, rmax)
            linha[chave][gnome] = None if c is None else dict(preco=c[0], mult=c[0] / base[0], soma=c[1], hab=c[2], semanas=c[3])
    qual.append(linha)
OUT["qualidade"] = qual
MULT_V2 = {"Boa": 5, "Ótima": 30, "Excelente": 70}
qual2 = []
for nome, req, dif, mont, peca, iv in [("Faca (linha Dif 4)", 2, 4, 6, 3, "dia"), ("Espada (linha Dif 7)", 3, 7, 12, 10, "dia"),
                                       ("Placa completa (Dif 11)", 5, 11, 6, 24, "semana")]:
    base = custo_qualidade(req, dif, mont, peca, iv, 0)
    linha = dict(peca=nome, comum=base[0], graus={})
    for g, gnome in [(1, "Boa"), (2, "Ótima"), (3, "Excelente")]:
        c = custo_qualidade(req, dif, mont, peca, iv, g, "texto", 0, 6)
        linha["graus"][gnome] = None if c is None else dict(regua=c[0] / base[0], semanas=c[3], soma=c[1], preco=base[0] * MULT_V2[gnome])
    qual2.append(linha)
OUT["qualidade_v2"] = qual2
abaixo = []
for nome, req, dif, mont, peca in [("Faca", 2, 4, 6, 3), ("Espada", 3, 7, 12, 10)]:
    base = custo_qualidade(req, dif, mont, peca, "dia", 0)[0]
    for g, gn in ((1, "Tosca"), (2, "Sucata")):
        r = max(1, req - g); d = max(1, dif - 3 * g); ac = (mont + peca) * 0.5 ** g
        c = min(ac / (media(s) - d) / 6 * renda_ficha(s, h)[0] * 1.8 for s, h in PERFIS_Q if h >= r and media(s) > d)
        abaixo.append(dict(peca=nome, grau=gn, preco=c, mult=c / base))
OUT["qualidade_abaixo"] = abaixo

# ---- Reparo (regra do texto: 1/4, 1/2, inteiro do Acúmulo; mesma Dif e intervalo)
def reparo_frac(frac, material=0.1):
    # preço = trabalho da fração do Acúmulo (avulso) x 1,2 + material; relação com o preço da peça (1,8 x trabalho total)
    return frac * 1.2 / 1.8 + material * (frac > 0.9)
OUT["reparo"] = dict(leve=reparo_frac(0.25), pesado=reparo_frac(0.5), arruinado=reparo_frac(1.0, 0.1))
def reparo_mont(mont, peca, frac, n=1, material=0.0):
    trab = (mont + n * frac * peca) / n / (mont + peca)
    return trab * 1.2 / 1.8 + material
def reparo_v3(mont, peca, dano):
    frac_m, frac_p = {"leve": (0, .25), "pesado": (.5, .5), "arruinado": (1, 1)}[dano]
    return (frac_m * mont + frac_p * peca) / (mont + peca) * 1.2 / 1.8
OUT["reparo_v2"] = {nome: {d: (reparo_v3(mo, pe, d), reparo_v3(mo, pe, d)) for d in ("leve", "pesado", "arruinado")}
                    for nome, mo, pe in (("Faca", 6, 3), ("Espada", 12, 10), ("Placa completa", 6, 24))}

if __name__ == "__main__":
    import json
    print(json.dumps({k: OUT[k] for k in ("municao", "linhas_novas", "moeda", "curva")}, ensure_ascii=False, indent=1, default=str)[:6000])
