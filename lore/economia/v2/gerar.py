# -*- coding: utf-8 -*-
"""Gera os JSONs propostos e as tabelas em Markdown do documento final."""
import json, os
from base import *
import mercadorias as M
import modelo as m
O = m.OUT
OUTDIR = "out"; os.makedirs(OUTDIR, exist_ok=True)

# ---------------- o formato do site (rodadas 111 e 112)
# Todo valor em dinheiro sai como {"por": ..., "preco": {"pc": N}}, com `por` de um vocabulário
# fechado. Os campos que qualificam a unidade vão entre os dois: `regime` (contrato/avulso),
# `oficio` (leve/artesao/bracal), `nota` (o resto do texto). O modelo calcula com os números soltos,
# e as tabelas em Markdown do documento também usam os números soltos: a forma nova é aplicada só na
# saída, numa cópia (`dump`), e por isso não mexe em nada que o documento imprime.
# Vocabulário: unidade, dia, hora, jornada, semana, mes, ano, km, 10 km, tonelada-km, trajeto, vez,
# pagina, carta, consulta, atendimento, noite, cerimonia, apresentacao, animal, pessoa, e `ponto`
# (o preço de uma aula é pelo ponto ensinado). Decididos pelo autor em 26/09/2026: a muda de roupa
# lavada é `unidade`, o parto é `atendimento`; a missa encomendada é `cerimonia` (rodada 112).
# REGRA: um serviço novo usa um valor que já existe sempre que couber; valor novo só quando nenhum
# couber, e registrado aqui com o motivo.
UNID_SERVICO = {
    "dia (avulso)": {"por": "dia", "regime": "avulso"}, "dia": {"por": "dia"}, "hora": {"por": "hora"},
    "semana": {"por": "semana"}, "jornada": {"por": "jornada"}, "vez": {"por": "vez"}, "página": {"por": "pagina"},
    "muda": {"por": "unidade"}, "carta": {"por": "carta"}, "documento": {"por": "unidade"},
    "atendimento": {"por": "atendimento"}, "consulta": {"por": "consulta"}, "parto": {"por": "atendimento"},
    "missa": {"por": "cerimonia"}, "cerimônia": {"por": "cerimonia"}, "noite": {"por": "noite"},
    "apresentação": {"por": "apresentacao"}, "cavalo": {"por": "animal"},
}
UNID_VIAGEM = {
    "10 km": {"por": "10 km"}, "dia": {"por": "dia"},
    "10 km (rio abaixo); x2 rio acima": {"por": "10 km", "nota": "rio abaixo; x2 rio acima"},
    "tonelada por km": {"por": "tonelada-km"}, "2 toneladas por km": {"por": "tonelada-km", "nota": "2 toneladas"},
    "trajeto curto": {"por": "trajeto", "nota": "curto"},
    "pessoa; 5 com cavalo": {"por": "pessoa", "nota": "5 com cavalo"},
    "pessoa; 3 por animal; 10 por carroça": {"por": "pessoa", "nota": "3 por animal; 10 por carroça"},
}
def P(pc, por, **extra):
    return {"por": por, **extra, "preco": None if pc is None else {"pc": pc}}
def pcx(n): return None if n is None else {"pc": n}
def unid(mapa, u, onde):
    if u not in mapa: raise SystemExit(f"{onde}: unidade sem mapa no formato do site: {u!r}")
    return mapa[u]
def criado(c): return {"id": c["id"], "nome": c["nome"], "salario": P(c["salario_semana"], "semana"), "custo_total": P(c["custo_total_semana"], "semana")}
def formato_site(nome, o):
    if nome == "servicos.json":
        def servico(s):
            u = unid(UNID_SERVICO, s["unidade"], "servicos." + s["id"])
            texto = isinstance(s["pc"], str)
            if texto and s["pc"] != "ver aulas": raise SystemExit(f"servicos.{s['id']}: preço em texto não previsto {s['pc']!r}")
            d = {"grupo": s["grupo"], "id": s["id"], "nome": s["nome"], **u, "preco": None if texto else pcx(s["pc"]),
                 "calculado": pcx(s["pc_calculado"]), "base": s["base"]}
            if texto: d["ver"] = "aulas"
            return d
        return {"_nota": o["_nota"],
                "tarifas_por_perfil": [{"perfil": t["perfil"], "soma": t["soma"], "livre": P(t["livre"], "semana"), "tarifas": [
                    P(t["semana"], "semana"), P(t["contrato"], "dia", regime="contrato"), P(t["avulsa"], "dia", regime="avulso"),
                    P(t["hora_leve"], "hora", oficio="leve"), P(t["hora_artesao"], "hora", oficio="artesao"), P(t["hora_bracal"], "hora", oficio="bracal")]}
                    for t in o["tarifas_por_perfil"]],
                "servicos": [servico(s) for s in o["servicos"]],
                "aulas": [{"tipo": a["tipo"], "novo": a["novo"], "xp": a["xp"], "jornadas": a["jornadas"], "prof_soma": a["prof_soma"],
                           "por": "ponto", "preco": pcx(a["pc"]), "calculado": pcx(a["preco"])} for a in o["aulas"]],
                "criados": [criado(c) for c in o["criados"]],
                "escravos": [{"nome": e["nome"], "por": "pessoa", "preco": pcx(e["pc"]), "catalogo_anterior": pcx(e["pc_catalogo_atual"])} for e in o["escravos"]],
                "escravo_sustento": P(o["escravo_sustento_semana"], "semana")}
    if nome == "viagens.json":
        return {**o, "precos": [{"id": p["id"], "nome": p["nome"], **unid(UNID_VIAGEM, p["unidade"], "viagens." + p["id"]), "preco": pcx(p["pc"])} for p in o["precos"]]}
    if nome == "custo-de-vida.json":
        def nomeado(d): return {k: {"nome": v["nome"], **P(v["pc"], "semana")} for k, v in d.items()}
        return {"_nota": o["_nota"],
                "niveis_pessoa": [{"nivel": n["nivel"], "composicao": n["composicao"], "custo": P(n["pc_semana"], "semana"),
                                   "estalagem": None if n["estalagem_semana"] is None else P(n["estalagem_semana"], "semana")} for n in o["niveis_pessoa"]],
                "cestas": nomeado(o["cestas_semana"]), "moradias": nomeado(o["moradia_semana"]),
                "criados": [criado(c) for c in o["criados"]],
                "manutencao_cavalo": P(o["cavalo_manutencao_semana"], "semana"),
                "manutencao_cavalo_guerra": P(o["cavalo_guerra_manutencao_semana"], "semana"),
                "pacotes_familia": {k: {"itens": [{"item": i["item"], **P(i["pc_semana"], "semana")} for i in p["itens"]],
                                        "pacote": P(p["pacote"], "semana"), "estilo_de_vida": P(p["estilo_de_vida"], "semana")}
                                    for k, p in o["pacotes_familia"].items()}}
    if nome == "renda.json":
        def tri(s, m_, a): return [P(s, "semana"), P(m_, "mes"), P(a, "ano")]
        return {"_nota": o["_nota"],
                "faixas": [{"faixa": x["faixa"], "recursos": x["recursos"], "renda": tri(x["renda_semana"], x["renda_mes"], x["renda_ano"]),
                            "livre": tri(x["livre_semana"], x["livre_mes"], x["livre_ano"]), "custo": [P(x["custo_semana"], "semana")],
                            "nivel_de_vida": x["nivel_de_vida"], "origem": x["origem"]} for x in o["faixas"]],
                "curva_por_soma": [{"soma": c["soma"], "media": c["media"], "renda": P(c["renda_semana"], "semana"), "faixa_dificuldade": c["faixa_dificuldade"]} for c in o["curva_por_soma"]],
                "valor_por_ponto": {k: P(v, "semana") for k, v in o["valor_por_ponto_semana"].items()},
                "tetos_demanda": {k: P(v, "semana") for k, v in o["tetos_demanda_semana"].items()}}
    if nome == "pacotes-equipamento.json":
        return {"_nota": o["_nota"], "pacotes": {k: {"total": pcx(p["total_pc"]), "total_anterior": pcx(p["total_atual_pc"]), "itens": p["itens"]} for k, p in o["pacotes"].items()}}
    return o

def dump(nome, obj):
    with open(os.path.join(OUTDIR, nome), "w", encoding="utf-8", newline="\n") as f:
        json.dump(formato_site(nome, json.loads(json.dumps(obj))), f, ensure_ascii=False, indent=2)
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
      "criados": [{"id": c["id"], "nome": c["nome"], "salario_semana": inteiro(c["salario_sem"]), "custo_total_semana": inteiro(c["custo_sem"])} for c in O["criados"]],
      "cavalo_manutencao_semana": inteiro(m.CAVALO_SEM), "cavalo_guerra_manutencao_semana": round(m.CAVALO_GUERRA_SEM),
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
 ("Saber", "copia-pagina", "Cópia simples", "página", 2, "Mundo letrado: metade do histórico (16-20 d o caderno de ~16 páginas)"),
 ("Saber", "iluminura-pagina", "Página iluminada, cópia fiel", "página", 2 * 130 / 36 * 1.2, "Linha da tabela: 2 h de oficial, jornada leve"),
 ("Saber", "leitura", "Ler ou traduzir um documento", "documento", hora(8, "leve"), "Uma hora, soma 8"),
 ("Saber", "advogado-consulta", "Advogado ou notário, consulta", "hora", hora(10, "leve"), "Direito, soma 10"),
 ("Saber", "advogado-causa", "Advogado numa causa", "semana", T[10]["semana"], "Contrato semanal, soma 10"),
 ("Saber", "professor", "Professor particular", "jornada", "ver aulas", "Diária avulsa do professor"),
 ("Saúde", "curandeiro", "Curandeiro ou barbeiro-cirurgião, atendimento", "atendimento", 3, "Cura mortal é pouco eficaz (decisão do autor): abaixo da tarifa do perfil; material à parte"),
 ("Saúde", "medico", "Médico sem magia, consulta", "consulta", 15, "Cura alta, mas mortal: preço baixo pela eficácia baixa"),
 ("Saúde", "medico-tratamento", "Tratamento diário (curandeiro ou médico sem magia)", "dia", 10, "Cada nível de Cura de quem trata acelera a recuperação em 10%"),
 ("Saúde", "parteira", "Parteira", "parto", av(6), "Uma jornada de oficial"),
 ("Fé", "missa", "Missa encomendada", "missa", 27, "Hist. 4 d"),
 ("Fé", "bencao", "Bênção, oração, rito simples", "vez", 5, ""),
 ("Fé", "casamento-funeral", "Casamento ou funeral", "cerimônia", 60, "Uma semana de braçal, mais esmolas"),
 ("Arte", "menestrel-taverna", "Músico ou artista, noite de taverna", "noite", av(6), "Performance de oficial"),
 ("Arte", "menestrel-corte", "Menestrel de corte, apresentação", "apresentação", av(10), "Soma 10"),
 ("Animais", "adestrar-sela", "Adestrar cavalo para sela", "cavalo", T[6]["contrato"] * 6 * 8, "8 semanas de adestrador oficial; explica rocim 2.400 - potro 1.300"),
 ("Animais", "adestrar-guerra", "Adestrar cavalo de guerra", "cavalo", T[9]["contrato"] * 6 * 24, "24 semanas de perito sobre um rocim robusto (~3.100): o par dá o cavalo de guerra de escudeiro (11.200)"),
 ("Animais", "ferrar", "Ferrar um cavalo", "vez", 40, "Ver arreios"),
]
# Rodada 114: estes saem da tabela de perfis (av, hora, T[...]), que já é inteira, e ficam em pc
# inteiro; os outros (valor histórico fixo, linha de fabricação) seguem o `arred` de preço.
DO_PERFIL = {"carregador", "bracal-contrato", "artesao-dia", "artesao-perito-dia", "mestre-dia", "lavadeira", "barbeiro",
             "guia-local", "guia-expedicao", "mensageiro-pe", "mensageiro-cavalo", "guarda-costas", "escrivao-carta",
             "leitura", "advogado-consulta", "advogado-causa", "parteira", "menestrel-taverna", "menestrel-corte",
             "adestrar-sela", "adestrar-guerra"}
serv = []
for g, iid, nome, un, v, base in SERVICOS:
    pc = (inteiro(v) if iid in DO_PERFIL else arred(v)) if isinstance(v, (int, float)) else v
    serv.append({"grupo": g, "id": iid, "nome": nome, "unidade": un, "pc": pc, "base": base, "pc_calculado": r1(v) if isinstance(v, (int, float)) else None})
dump("servicos.json", {"_nota": "PROPOSTA. Preço de contratar. Diária por contrato = renda semanal / 6; avulsa x 1,5; hora = avulsa / jornada do ofício (leve 6 h, artesão 8 h, braçal 10 h).",
                       "tarifas_por_perfil": [{k: (r1(v) if isinstance(v, float) else v) for k, v in t.items()} for t in O["servicos"]["tarifas"]],
                       "servicos": serv,
                       "aulas": [{k: (r1(v) if isinstance(v, float) else v) for k, v in a.items()} | {"pc": inteiro(a["preco"])} for a in O["aulas"]],
                       "criados": cv["criados"],
                       "escravos": [{"nome": e["nome"], "pc": e["pc"], "pc_catalogo_atual": e["atual"]} for e in O["escravos"]["lista"]],
                       "escravo_sustento_semana": inteiro(O["escravos"]["sustento"])})
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

# ---------------- recompensas.json (rodada 115)
RC = O["recompensas"]
dump("recompensas.json", {
    "_nota": "Recompensa de caça.",
    "base": RC["base"], "fator": RC["fator"],
    "degraus": [{"degrau": n + 1, "por": "semana", "preco": {"pc": v}} for n, v in enumerate(RC["degraus"])],
    "centelha_passo": RC["centelha_passo"], "centelha_max": RC["centelha_max"],
    "fracas_contam": RC["fracas_contam"], "fracas_abaixo": RC["fracas_abaixo"],
    "dias_semana": RC["dias_semana"], "grupo": RC["grupo"],
    "tarefas": [{"id": i, "nome": n, "mult": x, "descricao": d} for i, n, x, d in RC["tarefas"]],
    "riscos": [{"id": i, "nome": n, "mult": x, "descricao": d} for i, n, x, d in RC["riscos"]],
    "tons": [{"id": i, "nome": n, "mult": x} for i, n, x in RC["tons"]],
    "urgencias": [{"id": i, "nome": n, "mult": x} for i, n, x in RC["urgencias"]],
    "arredondamento": [{"abaixo_de": teto, "passo": passo} for teto, passo in ARRED_DEGRAUS],
})

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
    [(a["tipo"], a["novo"], a["xp"], n(a["jornadas"]), a["prof_soma"], n(inteiro(a["preco"]))) for a in O["aulas"]])
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
q2 = []
for l in O["qualidade_v2"]:
    cel = []
    for gn in ("Boa", "Ótima", "Excelente"):
        v = l["graus"][gn]
        cel.append("impossível" if v is None else f'{fmt(arred(v["preco"]))} (régua {n(v["regua"])}x, {n(v["semanas"], 1)} sem)')
    q2.append((l["peca"], fmt(arred(l["comum"])), *cel))
MD["qualidade_v2"] = tab(["Peça", "Comum (avulso)", "Boa 5x", "Ótima 30x", "Excelente 70x"], q2)
MD["reparo_v2"] = tab(["Peça", "Leve (sem Montagem)", "Pesado (meia Montagem)", "Arruinada (Montagem inteira, sem material)"],
    [(k, *(f"{n(v[d][0]*100, 0)}%" for d in ("leve", "pesado", "arruinado"))) for k, v in O["reparo_v2"].items()])
PAC = {"Artista":(360,[("mochila",1),("saco-dormir",1),("fantasia",2),("vela",5),("racao-dia",5),("cantil",1),("kit-disfarce",1)]),
"Assaltante":(186,[("mochila",1),("esferas-metal",1),("linha",1),("sino",1),("vela",5),("pe-de-cabra",1),("martelo-ferramenta",1),("piton",10),("lanterna-coberta",1),("frasco-oleo",2),("racao-dia",5),("caixa-fogo",1),("cantil",1),("corda-canhamo",1)]),
"Aventureiro":(110,[("mochila",1),("pe-de-cabra",1),("martelo-ferramenta",1),("piton",10),("tocha",10),("caixa-fogo",1),("racao-dia",10),("cantil",1),("corda-canhamo",1)]),
"Diplomata":(1068,[("bau",1),("caixa-mapas",2),("roupas-finas",1),("vidro-tinta",1),("caneta-tinteiro",1),("lampada",1),("frasco-oleo",2),("folha-papel",5),("vidro-perfume",1),("parafina",1)]),
"Estudioso":(382,[("mochila",1),("livro-estudo",1),("vidro-tinta",1),("caneta-tinteiro",1),("folha-pergaminho",10),("saquinho-areia",1),("faca-pequena",1)]),
"Explorador":(85,[("mochila",1),("saco-dormir",1),("kit-refeicao",1),("caixa-fogo",1),("tocha",10),("racao-dia",10),("cantil",1),("corda-canhamo",1)]),
"Sacerdote":(149,[("mochila",1),("cobertor",1),("vela",10),("caixa-fogo",1),("caixa-esmolas",1),("bloco-incenso",2),("incensario",1),("vestes",1),("racao-dia",2),("cantil",1)])}
pac_rows, pac_json = [], {}
for k, (old, its) in PAC.items():
    tot = sum(M.POR_ID[i]["pc"] * q for i, q in its)
    desc = "; ".join(f'{M.POR_ID[i]["nome"]}{" x" + str(q) if q > 1 else ""} ({M.POR_ID[i]["pc"] * q})' for i, q in its)
    pac_rows.append((k, n(old), n(tot), desc))
    pac_json[k] = {"total_pc": tot, "total_atual_pc": old, "itens": [[i, q] for i, q in its]}
MD["pacotes_equip"] = tab(["Pacote", "Hoje", "Novo", "Itens (preço x quantidade)"], pac_rows)
dump("pacotes-equipamento.json", {"_nota": "PROPOSTA v2. Soma dos itens de mercadorias.json. Regra: um pacote de graça na criação (Diplomata exige Recursos 3) mais bolsa de 4 semanas de Livre.", "pacotes": pac_json})
for k, v in MD.items():
    with open(os.path.join(OUTDIR, f"tab_{k}.md"), "w", encoding="utf-8", newline="\n") as f: f.write(v)
print("ok", len(merc), len(mv), len(serv))
