# -*- coding: utf-8 -*-
"""Gera os JSONs propostos e as tabelas em Markdown do documento final."""
import json, os
from base import *
import mercadorias as M
import modelo as m
O = m.OUT
OUTDIR = "out"; os.makedirs(OUTDIR, exist_ok=True)
def dump(nome, obj):
    with open(os.path.join(OUTDIR, nome), "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
def r1(x): return None if x is None else round(x, 1)

# ---------------- mercadorias.json (envelope do site) + procedência (lore)
merc, proc = [], []
for it in M.I:
    merc.append({"id": it["id"], "nome": it["nome"], "tipo": it["tipo"], "preco": {"pc": it["pc"]},
                 "peso": None if it["peso"] is None else round(it["peso"], 2),
                 "tags": [it["cat"]], "mercadoria": {"categoria": it["cat"], "unidade": it["un"]}})
    orig = {"C": f'{it["val"]:g} C (MtD)', "d": f'{it["val"]:.2f} d', "pc": f'{it["val"]:g} pc'}[it["moeda"]]
    proc.append({"id": it["id"], "fonte": it["fonte"], "valor_original": orig, "confianca": it["conf"],
                 "pc_calculado": round(it["pc_bruto"], 2), "dias_bracal": round(it["dias_bracal"], 3),
                 "regra": it["regra"], "pc_catalogo_atual": it["atual"], "nota": it["nota"]})
dump("mercadorias.json", merc)
dump("mercadorias.procedencia.json", {"_nota": "Procedência da tabela de mercadorias. Fica no lore, não vai para o site.",
                                      "ancora": "1 dia de braçal = 10 pc = 1,5 penny (Inglaterra 1300-1340)",
                                      "fontes": M.FONTES, "categorias": M.CATEGORIAS, "itens": proc})

# ---------------- montarias e veículos
mv = []
for grupo, tipo in (("montarias", "montaria"), ("criacao", "animal"), ("arreios", "arreio"), ("veiculos", "veiculo")):
    for x in O[grupo]:
        mv.append({"id": x["id"], "nome": x["nome"], "tipo": tipo, "preco": {"pc": x["pc"]}, "tags": [tipo],
                   "_procedencia": {"fonte": x["fonte"], "confianca": x["conf"], "nota": x["nota"], "pc_catalogo_atual": x.get("atual")}})
dump("montarias-veiculos.json", mv)

# ---------------- renda.json
renda = {"_nota": "PROPOSTA. Renda por semana de trabalho (6 jornadas). Livre = Renda x 20% x (60/Renda)^0,2, arredondado. Custo = Renda - Livre; inclui o estilo de vida obrigatório da faixa.",
         "faixas": [{"faixa": r["faixa"], "recursos": r["recursos"], "renda_semana": r["renda"], "renda_mes": r["renda_mes"],
                     "renda_ano": r["renda_ano"], "livre_semana": r["livre"], "livre_mes": r["livre_mes"], "livre_ano": r["livre_ano"],
                     "custo_semana": r["custo"], "nivel_de_vida": m.FAIXA_NIVEL[r["faixa"]], "origem": r["origem"]} for r in O["renda"]],
         "curva_por_soma": [{"soma": c["soma"], "media": c["media"], "renda_semana": arred(c["convexa"]), "faixa_dificuldade": c["faixa_dif"]} for c in O["curva"]["curva"]],
         "valor_por_ponto_semana": {"dif4": V4, "dif7": round(V7, 2), "dif11": round(V11, 2)},
         "tetos_demanda_semana": m.TETOS}
dump("renda.json", renda)

# ---------------- custo-de-vida.json
cv = {"_nota": "PROPOSTA. Semana de Uldun (8 dias). Cestas por adulto-equivalente (Allen). Criança = meio adulto-equivalente.",
      "niveis_pessoa": [{"nivel": n["nivel"], "pc_semana": n["proposto"], "composicao": n["comp"], "estalagem_semana": n["estalagem"]} for n in O["niveis"]],
      "cestas_semana": {k: {"nome": v["nome"], "pc": round(v["semana"], 1)} for k, v in m.CESTAS.items()},
      "moradia_semana": {k: {"nome": n, "pc": round(m.mor[k], 1)} for k, (n, _) in m.MORADIA.items()},
      "criados": [{"id": c["id"], "nome": c["nome"], "salario_semana": round(c["salario_sem"], 1), "custo_total_semana": round(c["custo_sem"], 1)} for c in O["criados"]],
      "cavalo_manutencao_semana": round(m.CAVALO_SEM, 1), "cavalo_guerra_manutencao_semana": round(m.CAVALO_GUERRA_SEM),
      "pacotes_familia": {r["faixa"]: {"itens": [{"item": n, "pc_semana": round(v, 1)} for n, v in r["pacote"]],
                                       "pacote": round(r["pacote_total"], 1), "estilo_de_vida": round(r["estilo"], 1)} for r in O["renda"]}}
dump("custo-de-vida.json", cv)

# ---------------- serviços
T = {t["soma"]: t for t in O["servicos"]["tarifas"]}
def av(s): return T[s]["avulsa"]
def hora(s, j): return T[s]["hora_" + j]
SERVICOS = [
 # grupo, id, nome, unidade, pc_bruto, base
 ("Trabalho", "carregador", "Carregador, cavador, braçal", "dia (avulso)", av(4), "Braçal avulso: 10 x 1,5"),
 ("Trabalho", "bracal-contrato", "Braçal por contrato", "dia", T[4]["contrato"], "Braçal: 60 / 6"),
 ("Trabalho", "artesao-dia", "Artesão (oficial) avulso", "dia", av(6), "Oficial: 130 / 6 x 1,5"),
 ("Trabalho", "artesao-perito-dia", "Artesão perito avulso", "dia", av(9), "Soma 9"),
 ("Trabalho", "mestre-dia", "Mestre de ofício avulso", "dia", av(12), "Soma 12"),
 ("Trabalho", "lavadeira", "Lavar uma muda de roupa", "muda", hora(4, "bracal") * 1, "Uma hora de braçal"),
 ("Trabalho", "barbeiro", "Barba e cabelo", "vez", hora(5, "leve") / 2, "Meia hora, destreinado"),
 ("Trabalho", "banho", "Banho de tina (casa de banhos)", "vez", 2, "Lenha e água aquecida, meia hora de servente"),
 ("Viagem", "guia-local", "Guia local", "dia", av(6), "Sobrevivência de oficial, avulso"),
 ("Viagem", "guia-expedicao", "Guia de expedição (contrato)", "dia", T[8]["contrato"], "Soma 8, contrato, mais comida"),
 ("Viagem", "mensageiro-pe", "Mensageiro a pé", "dia", av(4), "Braçal avulso; ~40 km/dia. Hist.: 2 d/dia"),
 ("Viagem", "mensageiro-cavalo", "Mensageiro a cavalo", "dia", av(4) + m.CAVALO_SEM / 8 * 2 + 10, "Braçal avulso, cavalo e desgaste; ~60 km/dia"),
 ("Guerra", "arqueiro", "Arqueiro ou besteiro (mercenário)", "dia", 20, "Hist. 3 d (1346). = oficial por contrato"),
 ("Guerra", "infante", "Infante com lança", "dia", 15, "Hist. 2 d (1346)"),
 ("Guerra", "arqueiro-montado", "Arqueiro montado ou batedor", "dia", 40, "Hist. 6 d; inclui o próprio cavalo"),
 ("Guerra", "homem-armas", "Homem de armas (armadura e cavalo próprios)", "dia", 80, "Hist. 12 d; soma 8 (43) + cavalo de guerra (36) + desgaste"),
 ("Guerra", "cavaleiro", "Cavaleiro", "dia", 160, "Hist. 2s"),
 ("Guerra", "capitao", "Capitão de companhia", "dia", 320, "Hist. cavaleiro bandeirado, 4s"),
 ("Guerra", "guarda-costas", "Guarda-costas (escolta na cidade)", "dia", av(8), "Soma 8 avulso"),
 ("Saber", "escrivao-carta", "Carta redigida (com pergaminho)", "carta", hora(6, "leve") + 3, "Uma hora de escrivão e uma folha"),
 ("Saber", "copia-pagina", "Cópia simples", "página", 4, "Hist. 16-20 d o caderno (~16 páginas)"),
 ("Saber", "iluminura-pagina", "Página iluminada, cópia fiel", "página", 2 * 130 / 36 * 1.2, "Linha da tabela: 2 h de oficial, jornada leve"),
 ("Saber", "leitura", "Ler ou traduzir um documento", "documento", hora(8, "leve"), "Uma hora, soma 8"),
 ("Saber", "advogado-consulta", "Advogado ou notário, consulta", "hora", hora(10, "leve"), "Direito, soma 10"),
 ("Saber", "advogado-causa", "Advogado numa causa", "semana", T[10]["semana"], "Contrato semanal, soma 10"),
 ("Saber", "professor", "Professor particular", "jornada", "ver aulas", "Diária avulsa do professor"),
 ("Saúde", "curandeiro", "Curandeiro ou barbeiro-cirurgião, atendimento", "atendimento", hora(6, "leve") * 1, "Uma hora de Cura, oficial; material à parte"),
 ("Saúde", "medico", "Médico, consulta", "consulta", hora(12, "leve"), "Uma hora de mestre (jornada leve)"),
 ("Saúde", "medico-tratamento", "Médico, tratamento diário", "dia", av(12) / 2, "Meia jornada de mestre por dia de recuperação"),
 ("Saúde", "parteira", "Parteira", "parto", av(6), "Uma jornada de oficial"),
 ("Fé", "missa", "Missa encomendada", "missa", 27, "Hist. 4 d"),
 ("Fé", "bencao", "Bênção, oração, rito simples", "vez", 5, ""),
 ("Fé", "casamento-funeral", "Casamento ou funeral", "cerimônia", 60, "Uma semana de braçal, mais esmolas"),
 ("Arte", "menestrel-taverna", "Músico ou artista, noite de taverna", "noite", av(6), "Performance de oficial"),
 ("Arte", "menestrel-corte", "Menestrel de corte, apresentação", "apresentação", av(10), "Soma 10"),
 ("Animais", "adestrar-sela", "Adestrar cavalo para sela", "cavalo", T[6]["contrato"] * 6 * 8, "8 semanas de adestrador oficial; explica rocim 2.400 - potro 1.300"),
 ("Animais", "adestrar-guerra", "Adestrar cavalo de guerra", "cavalo", T[9]["contrato"] * 6 * 16, "16 semanas de perito, sobre um corcel"),
 ("Animais", "ferrar", "Ferrar um cavalo", "vez", 40, "Ver arreios"),
]
serv = []
for g, iid, nome, un, v, base in SERVICOS:
    pc = arred(v) if isinstance(v, (int, float)) else v
    serv.append({"grupo": g, "id": iid, "nome": nome, "unidade": un, "pc": pc, "base": base, "pc_calculado": r1(v) if isinstance(v, (int, float)) else None})
dump("servicos.json", {"_nota": "PROPOSTA. Preço de contratar. Diária por contrato = renda semanal / 6; avulsa x 1,5; hora = avulsa / jornada do ofício (leve 6 h, artesão 8 h, braçal 10 h).",
                       "tarifas_por_perfil": [{k: (r1(v) if isinstance(v, float) else v) for k, v in t.items()} for t in O["servicos"]["tarifas"]],
                       "servicos": serv,
                       "aulas": [{k: (r1(v) if isinstance(v, float) else v) for k, v in a.items()} | {"pc": arred(a["preco"])} for a in O["aulas"]],
                       "criados": cv["criados"],
                       "escravos": [{"nome": e["nome"], "pc": e["pc"], "pc_catalogo_atual": e["atual"]} for e in O["escravos"]["lista"]],
                       "escravo_sustento_semana": round(O["escravos"]["sustento"], 1)})
SERV = serv

# ---------------- viagens
V = O["viagens"]
viag = {"_nota": "PROPOSTA. Distâncias em km.",
        "velocidades_km_dia": [{"modo": a, "km_dia": b} for a, b in V["vel"]],
        "precos": [
            {"id": "caravana-carroca", "nome": "Caravana, lugar em carroça (bagagem até 20 kg)", "pc": 6, "unidade": "10 km"},
            {"id": "caravana-pe", "nome": "Caravana, a pé junto (proteção e bagagem leve)", "pc": 5, "unidade": "dia"},
            {"id": "navio", "nome": "Navio, passagem no convés", "pc": 3, "unidade": "10 km"},
            {"id": "navio-cabine", "nome": "Navio, lugar coberto", "pc": 10, "unidade": "10 km"},
            {"id": "barco-rio", "nome": "Barco de rio, passagem", "pc": 1, "unidade": "10 km (rio abaixo); x2 rio acima"},
            {"id": "cavalo-aluguel", "nome": "Cavalo de aluguel (hackney)", "pc": arred(V["cavalo_aluguel_km"] * 10), "unidade": "10 km"},
            {"id": "carroca-aluguel", "nome": "Carroça com carroceiro e parelha", "pc": V["carroca_dia"], "unidade": "dia"},
            {"id": "frete-terra", "nome": "Frete por terra", "pc": 4, "unidade": "tonelada por km"},
            {"id": "frete-rio", "nome": "Frete por rio", "pc": 2, "unidade": "tonelada por km"},
            {"id": "frete-mar", "nome": "Frete por mar", "pc": 1, "unidade": "2 toneladas por km"},
            {"id": "transporte-cidade", "nome": "Transporte na cidade (barqueiro, carroceiro, liteira)", "pc": 2, "unidade": "trajeto curto"},
            {"id": "balsa", "nome": "Balsa", "pc": 2, "unidade": "pessoa; 5 com cavalo"},
            {"id": "pedagio", "nome": "Pedágio de ponte ou estrada", "pc": 1, "unidade": "pessoa; 3 por animal; 10 por carroça"},
        ]}
dump("viagens.json", viag)

# ---------------- tabelas em Markdown
def tab(cab, linhas):
    s = "| " + " | ".join(cab) + " |\n|" + "|".join("---" for _ in cab) + "|\n"
    for l in linhas: s += "| " + " | ".join("" if x is None else str(x) for x in l) + " |\n"
    return s
def n(x, d=1):
    if x is None: return ""
    if isinstance(x, int): return f"{x:,}".replace(",", ".")
    return f"{x:,.{d}f}".replace(",", "X").replace(".", ",").replace("X", ".")
MD = {}
# mercadorias por categoria
s = ""
for cat, nome in M.CATEGORIAS.items():
    s += f"\n#### {nome}\n\n"
    s += tab(["Item", "Unidade", "pc", "Dias de braçal", "Fonte", "Conf.", "Catálogo", "Nota"],
             [(it["nome"], it["un"], n(it["pc"]), n(it["dias_bracal"], 2), it["fonte"], it["conf"], n(it["atual"]) if it["atual"] is not None else "",
               it["nota"] + (" **R-estável.**" if it["regra"].startswith("R-") else "")) for it in M.I if it["cat"] == cat])
MD["mercadorias"] = s
MD["municao"] = tab(["Linha", "Horas (avulso)", "Por 10, avulso", "Por 10, lote", "Histórico por 10"],
    [(l["nome"], n(l["horas_avulso"], 2), n(l["avulso_10"]), n(l["lote_10"]),
      n(O["municao"]["hist_flecha_10"]) if "Flecha de guerra" in l["nome"] else (n(O["municao"]["hist_virote_10"]) if "Virote" in l["nome"] else "")) for l in O["municao"]["linhas"]])
MD["linhas_novas"] = tab(["Linha nova", "Ofício", "Req", "Dif", "Mont", "Peça", "Dias (avulso)", "Avulso", "Lote", "Histórico"],
    [(l["nome"], l["oficio"], l["req"], l["dif"], l["mont"], l["peca"], n(l["dias_avulso"], 2), n(l["avulso"]), n(l["lote"]), n(l["hist"])) for l in O["linhas_novas"]["linhas"]])
MD["curva"] = tab(["Soma", "Média", "Linear (x20)", "Proposta", "Faixa de Dif", "x braçal"],
    [(c["soma"], n(c["media"]), n(c["linear_x20"], 0), n(arred(c["convexa"])), c["faixa_dif"], n(c["x_bracal"])) for c in O["curva"]["curva"]])
MD["proezas"] = tab(["Bônus de Proeza (mestre, soma 12)", "Renda por semana"], [(f"+{b}", n(arred(v))) for b, v in O["curva"]["proezas"]])
MD["renda"] = tab(["Recursos", "Faixa", "Renda/sem", "Renda/mês", "Livre/sem", "Livre %", "Livre/mês", "Livre/ano", "Custo/sem", "Nível de vida"],
    [("●" * r["recursos"], r["faixa"], n(r["renda"]), n(r["renda_mes"]), n(r["livre"]), n(r["livre"] / r["renda"] * 100) + "%", n(r["livre_mes"]), n(r["livre_ano"]), n(r["custo"]), m.FAIXA_NIVEL[r["faixa"]]) for r in O["renda"]])
MD["pacotes"] = tab(["Faixa", "Custo/sem", "Pacote básico", "Estilo de vida (resto)", "Estilo % do custo", "O que o pacote cobre"],
    [(r["faixa"], n(r["custo"]), n(r["pacote_total"], 0), n(r["estilo"], 0), n(r["estilo_frac"] * 100, 0) + "%", "; ".join(f"{a} ({n(b, 0)})" for a, b in r["pacote"])) for r in O["renda"]])
MD["cestas"] = tab(["Cesta (por adulto-equivalente)", "pc por ano (365 d)", "pc por semana", "pc por dia"],
    [(v["nome"], n(v["ano"], 0), n(v["semana"]), n(v["ano"] / 365, 2)) for k, v in m.CESTAS.items()])
MD["cesta_itens"] = ""
for k in ("S", "R"):
    MD["cesta_itens"] += f"\n{m.CESTAS[k]['nome']}:\n\n" + tab(["Item", "Quantidade/ano", "pc/ano"], [(a, "" if b is None else f"{n(b)} {c}", n(d, 0)) for a, b, c, d in m.CESTAS[k]["linhas"]])
MD["moradia"] = tab(["Moradia", "Aluguel anual (hist.)", "pc por semana"], [(nm, f"{d} d", n(m.mor[k])) for k, (nm, d) in m.MORADIA.items()])
MD["niveis"] = tab(["Nível", "pc/sem (pessoa)", "Composição", "Estalagem + 3 refeições, por semana"],
    [(x["nivel"], n(x["proposto"]), x["comp"], n(x["estalagem"]) if x["estalagem"] else "") for x in O["niveis"]])
MD["criados"] = tab(["Criado", "Salário/ano (hist.)", "Salário/sem", "Casa e comida", "Custo total/sem"],
    [(c["nome"], f'{c["salario_ano_d"]} d', n(c["salario_sem"]), {"S": "subsistência", "R": "respeitável", "F": "farta"}[c["cesta"]], n(c["custo_sem"])) for c in O["criados"]])
def lista_animais(lst): return tab(["Id", "Nome", "pc", "Catálogo", "Fonte", "Conf.", "Nota"], [(x["id"], x["nome"], n(x["pc"]), n(x.get("atual")) if x.get("atual") else "", x["fonte"], x["conf"], x["nota"]) for x in lst])
MD["montarias"] = lista_animais(O["montarias"]); MD["criacao"] = lista_animais(O["criacao"])
MD["arreios"] = tab(["Id", "Nome", "pc", "Fonte", "Nota"], [(x["id"], x["nome"], n(x["pc"]), x["fonte"], x["nota"]) for x in O["arreios"]])
MD["veiculos"] = lista_animais(O["veiculos"])
MD["velocidades"] = tab(["Modo", "km por dia"], V["vel"])
MD["viagens_precos"] = tab(["Id", "Serviço", "pc", "Unidade"], [(p["id"], p["nome"], p["pc"], p["unidade"]) for p in viag["precos"]])
MD["tarifas"] = tab(["Perfil", "Soma", "Renda/sem", "Diária (contrato)", "Diária avulsa", "Hora (leve 6 h)", "Hora (artesão 8 h)", "Hora (braçal 10 h)"],
    [(t["perfil"], t["soma"], n(t["semana"], 0), n(t["contrato"]), n(t["avulsa"]), n(t["hora_leve"]), n(t["hora_artesao"]), n(t["hora_bracal"])) for t in O["servicos"]["tarifas"]])
MD["servicos"] = tab(["Grupo", "Serviço", "pc", "Unidade", "Base"], [(x["grupo"], x["nome"], x["pc"], x["unidade"], x["base"]) for x in SERV])
MD["militar"] = tab(["Posto (1340s)", "Pagamento", "pc/dia"], [(a, f"{b} d", n(c)) for a, b, c in O["servicos"]["militar"]])
MD["aulas"] = tab(["Ponto", "Novo nível", "XP", "Jornadas de aula", "Professor (soma)", "Preço (pc)"],
    [(a["tipo"], a["novo"], a["xp"], n(a["jornadas"]), a["prof_soma"], n(arred(a["preco"]))) for a in O["aulas"]])
MD["escravos"] = tab(["Condição", "Preço proposto", "Catálogo", "Renda do trabalho/sem", "Nota"],
    [(e["nome"], fmt(e["pc"]), fmt(e["atual"]) if e["atual"] else "", n(e["renda_trab"]), e["nota"]) for e in O["escravos"]["lista"]])
q = []
for l in O["qualidade"]:
    for regra, rot in (("texto", "Texto atual (intervalo sobe)"), ("piso_rmax", "Proposta (Piso, Req máx. 6)")):
        cel = []
        for g in ("Boa", "Ótima", "Excepcional"):
            v = l[regra][g]
            cel.append("impossível" if v is None else f'{n(v["mult"])}x ({n(v["semanas"], 1)} sem, soma {v["soma"]})')
        q.append((l["peca"], rot, n(arred(l["comum"])), *cel))
MD["qualidade"] = tab(["Peça", "Regra", "Comum (avulso)", "Boa", "Ótima", "Excepcional"], q)
for k, v in MD.items():
    with open(os.path.join(OUTDIR, f"tab_{k}.md"), "w", encoding="utf-8", newline="\n") as f: f.write(v)
print("ok", len(merc), len(mv), len(serv))
