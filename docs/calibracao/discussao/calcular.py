"""Fases 0 e 1: apenas biblioteca padrao; escreve somente nesta pasta.
Executar: python docs/export/proezas/chatgpt/calcular.py
"""
from pathlib import Path
from collections import Counter, defaultdict
from itertools import product
from fractions import Fraction as F
from functools import lru_cache
from statistics import median
import re, json, hashlib

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / 'proezas-completas.md'
text = SOURCE.read_text(encoding='utf-8')
pattern = r'^\*\*(.+?)\*\* \(id `([^`]+)`, nível (\d)\)\s*\n(.*?)(?=^\*\*.+?\*\* \(id |\Z)'
records = []
for m in re.finditer(pattern, text, re.M | re.S):
    name, ident, level, body = m.groups()
    path = re.findall(r'^### .+?\(`([^`]+)`\)', text[:m.start()], re.M)[-1]
    effect = body.split('- Efeito (texto integral):', 1)[1].split('\n### ')[0].strip()
    cost = re.search(r'^- Custo por uso: (.*)$', body, re.M)[1]
    def amount(label):
        found = re.search(r'(\d+) '+label, cost)
        return int(found[1]) if found else 0
    records.append(dict(id=ident, nome=name, nivel=int(level), caminho=path,
                        texto=effect, energia=amount('Energia'), vontade=amount('Força de Vontade'),
                        tipo=re.search(r'^- Tipo/ação: (\w+)', body, re.M)[1],
                        trilha=re.search(r'campo `efeito`\): (\w+)', body)[1],
                        prereq=re.search(r'^- Pré-requisito de outra Técnica: (.*)$', body, re.M)[1].strip(),
                        linha=text[:m.start()].count('\n')+1))
assert len(records)==461 and len({r['id'] for r in records})==461
assert len({r['caminho'] for r in records})==50
assert Counter(r['nivel'] for r in records)=={1:146,2:51,3:107,4:56,5:52,6:49}

@lru_cache(None)
def pool(n):
    c=Counter(map(sum,product(range(1,7),repeat=n)))
    return {k:F(v,6**n) for k,v in c.items()}

def success(dist,b,d):
    return sum((p for s,p in dist.items() if s+b>d),F(0))

def reroll_min(n,keep):
    c=Counter()
    for ds in product(range(1,7),repeat=n):
        small=min(ds)
        for die in range(1,7):
            c[sum(ds)-small+(max(small,die) if keep else die)]+=1
    return {k:F(v,6**(n+1)) for k,v in c.items()}

def reroll_all(n):
    c=defaultdict(F)
    for a,pa in pool(n).items():
        for b,pb in pool(n).items(): c[max(a,b)]+=pa*pb
    return dict(c)

def damage(dist,b,d,strength,soak,extra=0,fixed=0):
    ans=F(0)
    for s,p in dist.items():
        if s+b<=d: continue
        margins=(s+b-d)//6
        for raw,pd in pool(1+margins+extra).items():
            ans+=p*pd*max(0,raw+strength-soak+fixed)
    return ans

profiles=[dict(nome='Iniciante',n=3,b=1,d=13,f=3,a=1,c=1),
          dict(nome='Veterano',n=4,b=4,d=20,f=4,a=4,c=4)]
results={}
lines=['# Memória de cálculo','',
       'INFERÊNCIA: enumeração exata, sem simulação; hipóteses descritas em 01-regua.md.',
       '', '| Medida | Iniciante | Veterano |','|---|---:|---:|']
for pr in profiles:
    n,b,d,f,a=(pr[k] for k in ('n','b','d','f','a'))
    p=success(pool(n),b,d); dp=success(pool(n),b+1,d)-p
    h=damage(pool(n),b,d,f,a); u=damage(pool(n),b+1,d,f,a)-h
    vals={'P(sucesso)':p,'P com +1':p+dp,'ganho P de +1':dp,'PV esperado':h,'PV de +1 fixo (U)':u}
    variants={'+1 dado':pool(n+1),'rerrolar menor, substitui':reroll_min(n,False),
              'rerrolar menor, mantém melhor':reroll_min(n,True),'parada inteira, mantém melhor':reroll_all(n)}
    for label,dist in variants.items():
        vals[label+' P']=success(dist,b,d)
        vals[label+' eqP']=(success(dist,b,d)-p)/dp
        vals[label+' eqPV']=(damage(dist,b,d,f,a)-h)/u
    vals['+1 dano eqPV']=(damage(pool(n),b,d,f,a,fixed=1)-h)/u
    vals['+1d6 dano eqPV']=(damage(pool(n),b,d,f,a,extra=1)-h)/u
    vals['+1 absorção eqPV']=(h-damage(pool(n),b,d,f,a+1))/u
    vals['+1 defesa eqPV']=(h-damage(pool(n),b,d+1,f,a))/u
    vals['+1 defesa eqP']=(p-success(pool(n),b,d+1))/dp
    vals['+4 defesa eqPV']=(h-damage(pool(n),b,d+4,f,a))/u
    vals['+1 absorção após acerto eqPV']=vals['+1 absorção eqPV']/p
    vals['cura 1 eqPV']=1/u
    vals['ação extra eqPV']=h/u
    vals['+3 fixos eqPV']=(damage(pool(n),b+3,d,f,a)-h)/u
    vals['+6 fixos eqPV']=(damage(pool(n),b+6,d,f,a)-h)/u
    vals['+9 fixos eqPV']=(damage(pool(n),b+9,d,f,a)-h)/u
    vals['+1 dificuldade eqP']=(success(pool(n),b,d+1)-p)/dp
    vals['-1 dificuldade eqP']=F(1)
    for k in (2,3,6): vals[f'ignorar -{k} eqP']=(p-success(pool(n),b-k,d))/dp
    for mult in (1,2):
        vals[f'D7 x{mult} iguais']=success(pool(n),b+(mult-1)*pr['c'],d+(mult-1)*pr['c'])
        vals[f'D7 x{mult} vs defesa fixa']=success(pool(n),b+(mult-1)*pr['c'],d)
    results[pr['nome']]=vals
for key in results['Iniciante']:
    lines.append('| '+key+' | '+' | '.join(f'{float(results[p][key]):.6f}' for p in results)+' |')
lines+=['','Frações exatas das unidades:', '']
for name,v in results.items():
    lines.append(f"* {name}: ΔP={v['ganho P de +1']}; U={v['PV de +1 fixo (U)']}; P={v['P(sucesso)']}.")
lines+=['','## Sensibilidade da dificuldade (tarefas, sem bônus de combate)','',
        '| Parada | D | P | ΔP(+1) | +1d6 em eqP |','|---|---:|---:|---:|---:|']
for n in (3,4):
    for d in (5,10,15,20):
        p=success(pool(n),0,d); dp=success(pool(n),1,d)-p
        eq=(success(pool(n+1),0,d)-p)/dp if dp else None
        lines.append(f'| {n}d6 | {d} | {float(p):.6f} | {float(dp):.6f} | {float(eq):.6f} |' if eq is not None else f'| {n}d6 | {d} | {float(p):.6f} | 0 | indefinido |')
lines+=['','## D7: adversários de Centelha diferente','',
        'INFERÊNCIA: atacante 3d6, defesa sem Centelha 12, sem outros bônus.',
        '| Centelha atacante / defensor | +1 por ponto | +2 por ponto |', '|---|---:|---:|']
for ca,cd in [(1,1),(1,4),(4,1),(4,4)]:
    lines.append(f'| {ca}/{cd} | {float(success(pool(3),ca,12+cd)):.6f} | {float(success(pool(3),2*ca,12+2*cd)):.6f} |')
lines+=['','## D8 e G15: Longa','',
        'FATO suplementar: acoes-e-sistema.md:94,109 define progresso=max(0,média-D).',
        'INFERÊNCIA: 3d6, média 10,5; Acúmulo 30; sem Centelha; G15-A soma bônus à média; G15-B apenas permite a tentativa, sem bônus numérico.',
        '| D | Sem bônus / G15-B | G15-A e D8 +2 | G15-A e D8 +3 |','|---|---:|---:|---:|']
from math import ceil
for d in (10,12,13):
    def intervals(b):
        progress=10.5+b-d
        return str(ceil(30/progress)) if progress>0 else 'sem avanço'
    lines.append(f'| {d} | {intervals(0)} | {intervals(2)} | {intervals(3)} |')

# Checagens matemáticas independentes e casos de borda.
assert success(pool(3),0,10)==F(1,2)
assert success(pool(1),0,6)==0 and success(pool(1),0,5)==F(1,6)
assert success(pool(3),1,13)==F(7,27)
assert damage({12:F(1)},1,13,3,1)==0  # empate falha
assert damage({18:F(1)},1,13,3,1)==9  # sobra 6, exatamente uma Margem
for n in range(1,6):
    assert sum(pool(n).values())==1
    assert sum(F(s)*p for s,p in pool(n).items())==F(7*n,2)
    for d in range(0,6*n+2):
        p=success(pool(n),0,d)
        assert success(pool(n),1,d)-p==pool(n).get(d,F(0))
        assert success(reroll_all(n),0,d)==1-(1-p)**2

# Codificação editorial manual pelo TEXTO, na ordem de cada Caminho no export.
# 0 = componente numérico separado; 1..5 = classe qualitativa; -1 = texto vazio.
# Não há consulta ao nível para atribuir classe ou valor. Nível só agrupa resultados.
q_by_path={
'agarrao-do-urso':[0,2,2,2,2,2,3,4,5],
'artesao':[0,1,1,0,2,2,3,4,5],
'atlas':[2,2,2,3,3,2,3,4,5],
'aura':[1,1,1,2,3,3,4,4,5],
'beleza-cativante':[0,1,1,2,3,2,3,4,5],
'brasa':[0,1,1,2,3,2,4,4,5],
'cacador':[0,1,1,0,2,2,3,3,5],
'camaleao':[0,1,1,1,3,3,3,4,5],
'carne-teimosa':[0,2,2,2,0,2,3,2,5],
'cerne-vital':[2,2,2,2,2,0,0,4,5],
'comando':[0,2,1,2,3,3,0,3,4,4,4,5],
'comunhao':[1,1,2,2,3,3,3,4,5],
'coracao-incansavel':[2,2,2,2,0,3,4,4,5],
'danca-da-lamina':[0,0,0,2,0,2,2,3,4,5],
'erudito':[0,1,2,1,2,2,3,4,5],
'estandarte':[0,2,1,0,0,0,3,4,5],
'estrategista':[0,1,1,0,2,2,3,4,5],
'gato':[1,2,2,3,2,2,3,3,4],
'improviso':[0,1,2,2,2,2,3,4,5],
'investigador':[0,1,1,2,2,2,3,4,5],
'leitor-de-almas':[1,1,2,2,1,0,3],
'leitura-fria':[0,1,1,2,2,2,3,4,5],
'lenda-viva':[0,0,2,2,2,2,4,3,5],
'mao-veloz':[0,1,2,2,2,3,3,4,5],
'marionete':[2,1,1,2,2,3,4,4,5],
'mascara':[1,1,1,2,2,2,3,3,5],
'mascara-impassivel':[1,1,2,3,3,3,4,5,5],
'mente-afiada':[2,1,1,0,2,2,3,4,5],
'mente-serena':[0,2,1,3,0,2,3,4,5],
'musa':[0,1,2,3,2,3,3,4,5],
'olho-agucado':[1,1,2,0,2,2,4,4,5],
'olho-da-verdade':[0,1,1,2,2,2,3,4,5],
'olho-de-aguia':[0,2,2,0,0,2,3,4,4],
'pele-de-pedra':[0,0,0,0,0,3,3,4,5],
'porte-inabalavel':[0,1,0,2,0,2,3],
'pressagio':[1,2,1,0,0,2,2,3,0,0,3,5],
'punho-de-ferro':[0,0,2,0,2,0,2,0,2,4,4,5],
'quebra-muralhas':[1,2,1,1,2,2,3,3,4],
'reflexo-mental':[0,1,1,2,2,2,3,4,3],
'sangue-fervente':[0,2,1,2,2,0,3,4,5],
'sangue-imune':[0,1,1,2,2,3,3,4,5],
'semblante':[0,1,1,1,2,2,3,4,5],
'sentinela':[0,1,1,2,2,2,3,4,4],
'serpente-das-palavras':[0,1,1,2,2,2,3,4,5],
'sombra':[1,2,1,2,3,0,3,4,4],
'sussurro':[0,1,1,1,2,2,3,3,4],
'teia':[0,2,1,2,2,3,3,4,5],
'vento':[1,0,0,3,3,-1,2,3,3,3,0,4,4,0],
'vinculo-animal':[1,1,1,2,3,2,3,4,5],
'voz-de-mel':[0,1,1,2,0,2,3,4,5],
}
grouped=defaultdict(list)
for r in records: grouped[r['caminho']].append(r)
assert grouped.keys()==q_by_path.keys()
for path,rs in grouped.items():
    assert len(rs)==len(q_by_path[path]),path
    for r,q in zip(rs,q_by_path[path]):r['q']=q

# P = pontos de projeto, ponte editorial linearizada: +1 fixo = 1 P.
# Valores físicos usam U do iniciante. Não são equivalências universais.
base=results['Iniciante']
D=float(base['+1 dano eqPV']); A=float(base['ação extra eqPV'])
DD=float(base['+1d6 dano eqPV']); R=float(base['parada inteira, mantém melhor eqPV'])
SO=float(base['+1 absorção eqPV'])
Q={0:0,1:3,2:6,3:10,4:18,5:30}
# Substituições explícitas para componentes que uma extração de números confundiria.
numeric={
'golpe-pesado':DD,'pele-curtida':2*SO,'tensionar':2*SO,
'couro-endurecido':3*SO,'pele-de-pedra':4*SO+1,
'aguentar-firme':1,'aguentar-o-tranco':1,'teimosia':1,
'regeneracao':3*float(base['cura 1 eqPV']),
'incansavel':float(base['+1 dado eqPV']),'ambidestria':float(base['+1 dado eqPV']),
'formar-fileira':2*3,'formacao':6*2*3,
'comando-inspirador':6*3,'carisma-magnetico':6*3,'inspirar':3*3,'voz-de-lider':3*3,
'grito-de-guerra':2*DD*3,'bote-silencioso':2*DD,
'investida-furiosa':2*DD,'golpe-do-tita':3*DD,
'tiro-certeiro':DD+D,'tiro-perfurante':DD+4*D,
'esmagar':4*D,'punho-que-parte-pedra':6*D,
'demolidor':DD,'golpe-que-vaza':3*D,
'pancada-atordoante':DD+2*float(base['P(sucesso)']),
'furia':DD-1,'quebrar-guarda':3*float(base['P(sucesso)']),
'brecha-emocional':6,'reflexos-premonitorios':6,
'esquiva-profetica':A,'caminho-do-destino':R,
'ataque-relampago':A,'velocidade-divina':A,
}
extra_action={'mira-firme','finta','ler-a-sala','brecha-emocional'}
numeric_zero_q=set(numeric)
ledger=['# Inventário de hipóteses para a Fase 1','',
        'INFERÊNCIA CONDICIONAL, não avaliação da Fase 2. Um uso, uma oportunidade relevante; três beneficiários nos bônus coletivos. P não é regra existente.',
        'Q é classificação editorial do efeito no texto. Num é componente quantitativo linearizado. Bruto = Num + ponte(Q); líquido = bruto - 0,25E - 3,5FV - ação adicional. Sem desconto por ação que carrega o próprio efeito.',
        'Intervalo é sensibilidade editorial descrita em 01-regua.md, não intervalo estatístico nem limite possível do texto. Q=0 não significa efeito fraco. ND não foi contado como zero.',
        '', '| Técnica (id e nome) | N | Q | Num | E | FV | Ação adicional (P) | Bruto P | Líquido P | Sensibilidade P | Fonte |',
        '|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|']
for r in records:
    ident=r['id']; q=r['q']; clean=r['texto'].replace('**','')
    if q==-1:
        r.update(num=None,bruto=None,liquido=None,low=None,high=None)
        ledger.append(f"| `{ident}` · {r['nome']} | {r['nivel']} | ND | ND | {r['energia']} | {r['vontade']} | ND | ND | ND | ND | export:{r['linha']} |")
        continue
    # Um +n explícito só conta quando o campo é bonus; nunca extrair Ticks ou dados como bônus.
    match=re.search(r'(?:\+|−)(\d+)(?!\d|d)',clean)
    num=numeric.get(ident, float(match[1]) if match and r['trilha']=='bonus' else 0)
    if ident in numeric_zero_q and ident not in {'demolidor','punho-que-parte-pedra','golpe-que-vaza'}:
        # Os pacotes com Q>0 explicitamente anotados somam capacidade ao componente.
        pass
    action=A if ident in extra_action else 0
    gross=num+Q[q]
    cost=.25*r['energia']+3.5*r['vontade']+action
    net=gross-cost
    # Testa custo escasso e ponte qualitativa -50%, versus abundante e ponte +50%.
    low=num+.5*Q[q]-.5*r['energia']-4*r['vontade']-action
    high=num+1.5*Q[q]-0*r['energia']-0*r['vontade']-action
    r.update(num=num,bruto=gross,liquido=net,low=low,high=high,acao=action)
    ledger.append(f"| `{ident}` · {r['nome']} | {r['nivel']} | {q} | {num:.3f} | {r['energia']} | {r['vontade']} | {action:.3f} | {gross:.3f} | {net:.3f} | {low:.3f} a {high:.3f} | export:{r['linha']} |")

summary=['# Distribuição condicional do catálogo','',
         'INFERÊNCIA: estatística da codificação em inventario.md. Faixa = mínimo a máximo, não percentis. Não representa um poder líquido objetivo já definido pelo livro.',
         '', '| N | Total | Com estimativa | ND | Mediana P | Faixa P | Mediana cenário escasso | Mediana cenário abundante |',
         '|---|---:|---:|---:|---:|---|---:|---:|']
for n in range(1,7):
    allr=[r for r in records if r['nivel']==n]; rr=[r for r in allr if r['liquido'] is not None]
    v=[r['liquido'] for r in rr]
    summary.append(f'| {n} | {len(allr)} | {len(rr)} | {len(allr)-len(rr)} | {median(v):.3f} | {min(v):.3f} a {max(v):.3f} | {median(r["low"] for r in rr):.3f} | {median(r["high"] for r in rr):.3f} |')
summary+=['','## Contagens verificadas','',f'* Trilhas: {dict(Counter(r["trilha"] for r in records))}',
          f'* Tipos: {dict(Counter(r["tipo"] for r in records))}',
          f'* Com pré-requisito: {sum(r["prereq"] != "nenhum." for r in records)}',
          f'* Texto vazio: {[r["id"] for r in records if not r["texto"]]}',
          f'* SHA256 do export: {hashlib.sha256(SOURCE.read_bytes()).hexdigest()}',
          f'* SHA256 do dossiê: {hashlib.sha256((HERE.parent/"centelha-dossie.md").read_bytes()).hexdigest()}']
summary+=['','## Cobertura da interpretação','',
          '| N | Q=0 (sem ponte qualitativa) | Q>0 (inclui ponte editorial) | ND |',
          '|---|---:|---:|---:|']
for n in range(1,7):
    rs=[r for r in records if r['nivel']==n]
    summary.append(f'| {n} | {sum(r["q"]==0 for r in rs)} | {sum(r["q"]>0 for r in rs)} | {sum(r["q"]<0 for r in rs)} |')
for name,content in [('calculos.md',lines),('inventario.md',ledger),('distribuicao.md',summary)]:
    with open(HERE/name,'w',encoding='utf-8',newline='\n') as out:out.write('\n'.join(content)+'\n')
with open(HERE/'auditoria.json','w',encoding='utf-8',newline='\n') as out:
    json.dump({'registros':records,'calculos':{p:{k:{'fracao':str(v),'decimal':float(v)} for k,v in vs.items()} for p,vs in results.items()}},out,ensure_ascii=False,indent=2)
print('\n'.join(summary))
print('\n'.join(lines[:40]))
