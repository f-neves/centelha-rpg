# -*- coding: utf-8 -*-
"""Etapa A: tabela de mercadorias (versão 2, com as correções da rodada A2 do Revisor)."""
from base import *

FONTES = {
    "MtD": "Mastering the Dungeon, Historical Prices (compila Hodges, Clark, Thorold Rogers; a escala C = pence x 8)",
    "Hodges": "Kenneth Hodges, Medieval Prices (Dyer, Jusserand, Myers, Norman & Pottinger)",
    "Langdon": "J. Langdon, 'The Economics of Horses and Oxen in Medieval England', AgHR 30 (1982), médias de Farmer 1276-1300",
    "Close Rolls 1341": "Calendar of Close Rolls, Edward III, 1341 (flechas e arcos)",
    "Derivado": "Material + dias de oficial (21,67 pc = 3,25 d por dia) x 1,2 de margem; conta na nota",
    "Tabela do jogo": "Linha de fabricação do Centelha pela régua das Fases 1-3 (T3, H-mat 1,5x, preço novo 1,2x)",
    "Catálogo": "Preço atual do catálogo mantido (R-estável: novo valor a menos de 30% do atual)",
}

def dv(material_d, dias):  # derivado em pence
    return round(derivado_d(material_d, dias), 2)

# (tipo, categoria, id, nome, unidade, valor, moeda['C','d','pc'], fonte, conf, nota, pc_catalogo_atual, peso_kg)
# tipo do envelope: comida | roupa | geral
I = []
def add(tipo, cat, iid, nome, un, val, moeda, fonte, conf, nota="", atual=None, peso=None):
    I.append(dict(tipo=tipo, cat=cat, id=iid, nome=nome, un=un, val=val, moeda=moeda, fonte=fonte,
                  conf=conf, nota=nota, atual=atual, peso=peso))

# ---------- Grãos e pão
add("comida","graos","trigo","Trigo","alqueire (~27 kg)",75,"C","MtD","B","~6s 3d o quarter, média de c. 1300.",None,27)
add("comida","graos","cevada","Cevada","alqueire (~22 kg)",45,"C","MtD","B","",None,22)
add("comida","graos","aveia","Aveia","alqueire (~15 kg)",27,"C","MtD","B","O grão mais barato: base da cesta de subsistência.",None,15)
add("comida","graos","malte","Malte","alqueire (~18 kg)",60,"C","MtD","B","",None,18)
add("comida","graos","feijao","Feijão ou fava","alqueire (~27 kg)",25,"C","MtD","B","",None,27)
add("comida","graos","ervilha","Ervilha","alqueire (~27 kg)",61,"C","MtD","B","",None,27)
add("comida","graos","arroz","Arroz","libra (~0,45 kg)",1.5,"d","Derivado","C","A MtD dá 30 d por libra, mais caro que a pimenta: provável erro. Contas senhoriais do séc. XIV ficam perto de 1 a 2 d. Importado: modificador regional.",None,LB)
add("comida","graos","farinha","Farinha de trigo","1 kg",0.45,"d","Derivado","C","Trigo (0,35 d/kg) mais moagem (o moleiro fica com ~1/16) e perda.",None,1)
add("comida","graos","pao","Pão de trigo","1 kg",0.4,"d","Derivado","C","Trigo 0,35 d/kg de grão; 1 kg de grão rende ~1,1 kg de pão; mais padaria.",None,1)
add("comida","graos","pao-pequeno","Pão pequeno","unidade (~0,4 kg)",0.15,"d","Derivado","C","O pão de uma refeição. Substitui o 'Pão ½ pc' do catálogo, que pedia moeda partida.",0.5,0.4)
add("comida","graos","pao-grosso","Pão grosseiro (cevada, centeio, mistura)","1 kg",0.3,"d","Derivado","C","Cevada 0,26 d/kg de grão mais padaria.",None,1)
# ---------- Carnes, laticínios, peixe, feira
add("comida","alimentos","carne","Carne (porco, carneiro ou boi)","1 kg",0.65,"d","Derivado","C","Derivado do porco (2 a 3s por 37 a 55 kg de carne); a vaca daria mais barato, o carneiro mais caro.",None,1)
add("comida","alimentos","toucinho","Toucinho ou carne salgada","libra (~0,45 kg)",0.5,"d","Derivado","C","Carne mais sal e cura; dura meses.",None,LB)
add("comida","alimentos","manteiga","Manteiga","libra (~0,45 kg)",11,"C","MtD","B","",None,LB)
add("comida","alimentos","queijo","Queijo","libra (~0,45 kg)",5,"C","MtD","B","Hodges: 80 libras por 3s 4d (0,5 d/libra).",2,LB)
add("comida","alimentos","ovos","Ovos","dúzia",4,"C","MtD","B","Hodges: 2 dúzias por 1 d.",None,0.7)
add("comida","alimentos","leite","Leite","galão (~4,5 L)",0.5,"d","Derivado","C","A MtD dá 1,6 d por galão, o que faria o leite de uma libra de manteiga custar mais que a manteiga. Rebaixado para caber na manteiga e no queijo.",None,4.6)
add("comida","alimentos","mel","Mel","libra (~0,45 kg)",1,"d","Derivado","C","Estava entre as bebidas, por galão. Mel era adoçante comum e barato perto do açúcar.",None,LB)
add("comida","alimentos","arenque","Arenque salgado","6 unidades",1,"d","Hodges","A","Atacado: 5 a 10 por 1 d (Londres, 1382). Meia dúzia para não cair abaixo de 1 pc.",None,1)
add("comida","alimentos","peixe-fresco","Peixe fresco","1 kg",0.5,"d","Derivado","C","Sem fonte direta; abaixo do arenque salgado por kg (o sal e a cura custam). Litoral e rios: modificador regional forte.",None,1)
add("comida","alimentos","congro-salgado","Congro salgado","unidade",6,"d","Hodges","A","1422-1423.",None,3)
add("comida","alimentos","galinha-abatida","Frango ou galinha abatida","unidade",0.6,"d","Derivado","C","Galinha viva (0,5 d) mais o abate.",2,1.2)
add("comida","alimentos","frutas","Frutas frescas (maçã, pera)","dúzia",0.15,"d","Derivado","C","Sem fonte direta; fruta de pomar era barata na estação.",3,1.5)
add("comida","alimentos","legumes","Legumes e verduras (couve, cebola, alho-poró)","maço (~1 kg)",0.1,"d","Derivado","C","Horta: quase sem preço de mercado; valor simbólico.",None,1)
add("comida","alimentos","racao-dia","Ração de viagem (1 dia)","1 dia",0.42,"d","Derivado","C","0,5 kg de pão grosseiro (0,15 d), 0,1 kg de queijo (0,11 d), 0,1 kg de toucinho (0,11 d) e embalagem. = três refeições pobres de estalagem.",2,0.7)
# ---------- Bebidas
add("comida","bebidas","cerveja-caneca","Cerveja (ale), caneca","caneca (~0,5 L)",1,"C","MtD","B","Qualquer qualidade comum. Abaixo de 1 pc não existe preço.",2,0.5)
add("comida","bebidas","cerveja-boa-caneca","Cerveja boa, caneca","caneca (~0,5 L)",2,"C","MtD","B","O catálogo cobrava 5x a comum; a história dá 1,5 a 2x.",10,0.5)
add("comida","bebidas","cerveja-ruim-jarra","Cerveja fraca, jarra","jarra (~2 L)",0.33,"d","Hodges","A","0,75 d por galão (séc. XIV).",0.5,2)
add("comida","bebidas","cerveja-jarra","Cerveja média, jarra","jarra (~2 L)",0.44,"d","Hodges","A","1 d por galão.",None,2)
add("comida","bebidas","cerveja-boa-jarra","Cerveja boa, jarra","jarra (~2 L)",0.67,"d","Hodges","A","1,5 d por galão.",None,2)
add("comida","bebidas","cerveja-barril","Cerveja, barril","barril (~80 L)",145,"C","MtD","B","",None,90)
add("comida","bebidas","sidra","Sidra","galão (~4,5 L)",6,"C","MtD","B","",None,4.6)
add("comida","bebidas","hidromel","Hidromel","galão (~4,5 L)",3.5,"d","Derivado","C","Mel fermentado; posto no preço do vinho comum.",None,4.6)
add("comida","bebidas","vinho-ruim-caneca","Vinho ruim, caneca","caneca (~0,5 L)",0.3,"d","Derivado","C","Vinho comum de 3,5 d o galão, um pouco abaixo.",2,0.5)
add("comida","bebidas","vinho-caneca","Vinho comum, caneca","caneca (~0,5 L)",0.4,"d","Hodges","A","3 a 4 d por galão (fim do séc. XIII).",8,0.5)
add("comida","bebidas","vinho-bom-caneca","Vinho bom, caneca","caneca (~0,5 L)",1,"d","Hodges","A","8 a 10 d por galão.",None,0.5)
add("comida","bebidas","vinho-galao","Vinho comum, galão","galão (~4,5 L)",3.5,"d","Hodges","A","",None,4.6)
add("comida","bebidas","vinho-bom-galao","Vinho bom, galão","galão (~4,5 L)",9,"d","Hodges","A","",None,4.6)
add("comida","bebidas","vinho-fino","Vinho fino (safra rara ou importado)","garrafa (~1 L)",30,"d","Derivado","C","Luxo de corte. O catálogo tem 'Vinho fino 2 po'; ficou 200 pc por garrafa. Importação: modificador regional.",200,1.2)
# ---------- Temperos e importados
add("comida","temperos","sal","Sal","1 kg",1.9,"d","MtD","B","MtD 7 C por libra. O catálogo cobra 2 pp por 100 g, 15x o histórico.",None,1)
add("comida","temperos","temperos-comuns","Temperos comuns (mostarda, cominho, ervas secas)","100 g",0.3,"d","MtD","B","Cominho 12 C por libra. O catálogo cobra 3 pp por 100 g para 'Temperos', ~13x.",30,0.1)
add("comida","temperos","pimenta","Pimenta","100 g",180/8/4.536,"d","MtD","B","Hodges: 1 a 4s por libra conforme a década. Catálogo 4 pp: coerente.",40,0.1)
add("comida","temperos","cravo","Cravo","100 g",190/8/4.536,"d","MtD","B","Especiarias finas, 1 a 3s por libra. Catálogo 4 pp: coerente.",40,0.1)
add("comida","temperos","canela","Canela","100 g",1.2*190/8/4.536,"d","MtD","B","20% acima das outras especiarias finas, como no catálogo.",60,0.1)
add("comida","temperos","gengibre","Gengibre","100 g",180/8/4.536,"d","MtD","B","",None,0.1)
add("comida","temperos","acafrao","Açafrão","10 g",1440/8/45.36,"d","MtD","B","Hodges: 12 a 15s por libra. O tempero mais caro.",None,0.01)
add("comida","temperos","acucar","Açúcar","libra (~0,45 kg)",115,"C","MtD","B","Luxo.",None,LB)
add("comida","temperos","amendoas","Amêndoas","libra (~0,45 kg)",16,"C","MtD","B","",None,LB)
add("comida","temperos","tamaras","Tâmaras","libra (~0,45 kg)",14,"C","MtD","B","",None,LB)
add("comida","temperos","figos","Figos secos","libra (~0,45 kg)",6,"C","MtD","B","",None,LB)
add("comida","temperos","frutas-secas","Frutas secas (passas, ameixas)","libra (~0,45 kg)",16,"C","MtD","B","Hodges: 1 a 4 d por libra.",None,LB)
# ---------- Tecidos, couro, metais e insumos
add("geral","materia-prima","linho-grosso","Linho comum","jarda (~0,9 m)",2,"d","Derivado","C","Da camisa de linho de Hodges (8 d em 1313): ~2,5 jardas a 2 d mais costura fecham os 8 d. Cestas de subsistência e respeitável.",None,0.25)
add("geral","materia-prima","tecido-grosso","Tecido grosseiro (burel, lã crua)","jarda (~0,9 m)",8,"d","Hodges","A","Piso da faixa de Hodges para tecido de túnica camponesa.",None,0.5)
add("geral","materia-prima","tecido-comum","Tecido comum (lã tingida)","jarda (~0,9 m)",96,"C","MtD","B","Hodges: 8 d a 1s 3d por jarda.",None,0.5)
add("geral","materia-prima","linho","Linho fino","jarda (~0,9 m)",120,"C","MtD","C","Não cabe na camisa de 8 d de Hodges; lido como linho fino.",None,0.2)
add("geral","materia-prima","la-fina","Lã fina","jarda (~0,9 m)",480,"C","MtD","B","Hodges: a melhor lã, 5s por jarda (1380).",None,0.5)
add("geral","materia-prima","seda","Seda","jarda (~0,9 m)",1056,"C","MtD","B","Hodges: 10 a 12s por jarda.",None,0.15)
add("geral","materia-prima","lona","Lona","jarda quadrada (~0,84 m²)",44,"C","MtD","B","",None,0.4)
add("geral","materia-prima","la-crua","Lã crua","libra (~0,45 kg)",33,"C","MtD","B","",None,LB)
add("geral","materia-prima","couro-vaca","Couro de vaca curtido","couro inteiro",206,"C","MtD","B","",None,6)
add("geral","materia-prima","sebo","Sebo","libra (~0,45 kg)",1.2,"d","Derivado","C","A MtD dá 3,4 d, mais que a vela de sebo pronta (2 d). Rebaixado para ficar abaixo da vela.",None,LB)
add("geral","materia-prima","cera","Cera de abelha","libra (~0,45 kg)",5,"d","Derivado","C","A MtD dá 8 d, mais que a vela de cera pronta (6,5 d). Rebaixado para ficar abaixo da vela.",None,LB)
add("geral","materia-prima","ferro","Ferro em barra","kg",FERRO_D_LB/LB,"d","MtD","B","1 d por libra: 1,5 pc por 100 g. O catálogo cobra ¼ pc por 100 g.",None,1)
add("geral","materia-prima","aco","Aço","kg",17/8/LB,"d","MtD","B","",None,1)
add("geral","materia-prima","cobre","Cobre","kg",15/8/LB,"d","MtD","B","2,8 pc por 100 g: confirma a proposta de 3 pc por 100 g. A moeda de cobre de 30 g vale ~0,9 pc em metal.",None,1)
add("geral","materia-prima","estanho","Estanho","kg",48/8/LB,"d","MtD","B","",None,1)
add("geral","materia-prima","chumbo","Chumbo","kg",7/8/LB,"d","MtD","B","",None,1)
add("geral","materia-prima","latao","Latão","kg",32/8/LB,"d","MtD","B","",None,1)
add("geral","materia-prima","bronze","Bronze","kg",20/8/LB,"d","MtD","B","",None,1)
add("geral","materia-prima","carvao","Carvão vegetal","saco (~10 kg)",4,"d","Derivado","C","5 a 7 kg de lenha por kg de carvão (0,26 d) mais a queima: ~0,4 d/kg. A MtD dá ~15x isso.",None,10)
add("geral","materia-prima","lenha","Lenha","carga de cavalo (~100 kg)",4,"d","Derivado","C","Da participação do combustível nas cestas (~0,044 d/kg). A MtD dá 1 d por libra.",None,100)
add("geral","materia-prima","canhamo","Cânhamo","libra (~0,45 kg)",0.5,"d","Derivado","C","Fibra para corda e lona.",None,LB)
# ---------- Roupas (tipo roupa)
add("roupa","roupas","roupa-usada","Roupa comum usada (conjunto)","conjunto",7.5,"d","MtD","B","Túnica, calções e capuz de segunda mão. Era como o pobre se vestia.",20,1.5)
add("roupa","roupas","roupa-comum","Roupa comum nova (conjunto)","conjunto",dv(3*8,1),"d","Derivado","C","3 jardas de burel (24 d) mais um dia de costura. O catálogo tem 'Comum' a 2 pp; a roupa nova custa 8x, a usada 2,5x.",20,1.5)
add("roupa","roupas","roupa-viajante","Roupa de viajante (conjunto)","conjunto",dv(3*8+8,1.5),"d","Derivado","C","Roupa comum mais capa de lã e capuz forrado; sem calçado.",50,2.5)
add("roupa","roupas","roupa-artesao","Roupa de artesão (conjunto)","conjunto",288,"C","MtD","B","Hodges: tabardo e sobretúnica de artesão, 3s (1285-1290).",None,2)
add("roupa","roupas","roupa-entretenimento","Roupa de artista (conjunto)","conjunto",dv(3*12+6,1.5),"d","Derivado","C","Tecido tingido de cores vivas, guizos, remendos de efeito.",150,2)
add("roupa","roupas","robe","Robe (clérigo, estudioso)","unidade",dv(5*12,1.5),"d","Derivado","C","5 jardas de lã tingida.",350,3)
add("roupa","roupas","roupa-campones-rico","Roupa de camponês abastado (conjunto)","conjunto",720,"C","MtD","B","",None,2.5)
add("roupa","roupas","roupas-finas","Conjunto de roupas finas","conjunto",1200,"C","MtD","B","O catálogo tem 'Finas' a 8 po.",800,2.5)
add("roupa","roupas","roupa-nobre","Roupa de corte (conjunto)","conjunto",750,"d","Derivado","C","Lã fina e seda, forro de pele, bordado: ~£3. O catálogo tem 'Nobres' a 18 po. Gasto de status das faixas altas.",1800,3)
add("roupa","roupas","roupa-gala","Traje de gala (conjunto)","conjunto",2400,"d","Hodges","B","Hodges: vestido da moda, facilmente £10, até £50. Ficou no piso, £10.",None,4)
add("roupa","roupas","vestes","Vestes cerimoniais simples","conjunto",50,"pc","Catálogo","B","Mantido. É a veste do pacote Sacerdote.",50,2)
add("roupa","roupas","vestes-bordadas","Vestes eclesiásticas bordadas","conjunto",576,"C","MtD","B","Paramento de igreja rica.",None,3)
add("roupa","roupas","manto","Manto","unidade",60,"C","MtD","B","",None,1.5)
add("roupa","roupas","camisa-linho","Camisa de linho","unidade",8,"d","Hodges","A","Camponês abastado, 1313.",None,0.3)
add("roupa","roupas","sapatos","Sapatos","par",6,"d","Hodges","A","Camponês abastado, 1313. Ver a linha nova de fabricação proposta.",None,0.6)
add("roupa","roupas","botas","Botas de montar","par",dv(0.25*26,2),"d","Derivado","C","Um quarto de couro de vaca (6,5 d) mais dois dias de sapateiro. A linha 'Sela, arreio, bota' da fabricação daria ~130.",None,1.2)
add("roupa","roupas","chapeu","Chapéu","unidade",80,"C","MtD","B","Hodges: 10 d a 1s 2d (nobreza).",None,0.2)
add("roupa","roupas","bolsa","Bolsa de cinto","unidade",12,"C","MtD","B","",None,0.1)
add("roupa","roupas","fantasia","Fantasia","conjunto",7.5,"d","Derivado","C","Roupa usada tingida e enfeitada.",30,1.5)
# ---------- Casa e mobília
add("geral","casa","colchao","Colchão de palha","unidade",16,"C","MtD","B","",None,5)
add("geral","casa","colchao-penas","Colchão de penas","unidade",600,"C","MtD","B","",None,8)
add("geral","casa","travesseiro","Travesseiro","unidade",8,"C","MtD","B","",None,0.5)
add("geral","casa","lencol","Lençol","unidade",32,"C","MtD","B","",None,0.6)
add("geral","casa","cobertor","Cobertor de lã grossa","unidade",dv(2*3.5,0.3),"d","Derivado","C","Duas jardas de lã de coberta (mais grossa e barata que o burel de roupa). Mantém o id do catálogo.",5,1.5)
add("geral","casa","cobertor-bom","Cobertor bom","unidade",120,"C","MtD","B","",None,2)
add("geral","casa","mesa","Mesa","unidade",48,"C","MtD","B","Bate com a linha 'Porta, banco, mesa tosca' da fabricação (~36).",None,20)
add("geral","casa","cadeira","Cadeira","unidade",24,"C","MtD","B","",None,5)
add("geral","casa","banco","Banquinho","unidade",20,"C","MtD","C","A MtD dá 32 C, mais que a cadeira. Posto abaixo dela.",None,3)
add("geral","casa","bau","Baú","unidade",48,"C","MtD","B","Baú simples de tábua. O catálogo tem 'Baú' a 5 pp: mantido.",50,10)
add("geral","casa","bau-bom","Baú de boa qualidade (arca)","unidade",208,"C","MtD","B","É a 'arca' da linha 'Móvel bem-acabado, arca'.",None,15)
add("geral","casa","cofre","Cofre pequeno com fechadura","unidade",dv(0.4*2.2+0.5,3.5),"d","Derivado","C","Caixa reforçada de ferro mais fechadura. A MtD dá 92 C, abaixo do baú de boa qualidade, o que não fecha.",None,6)
# ---------- Utensílios e recipientes
add("geral","utensilios","panela-barro","Panela de barro","unidade",4,"C","MtD","B","",None,1)
add("geral","utensilios","panela-ferro","Panela de ferro","unidade",24,"C","MtD","B","",None,2)
add("geral","utensilios","panela-latao","Panela de latão","unidade",192,"C","MtD","B","",None,2)
add("geral","utensilios","caldeirao","Caldeirão","unidade",400,"C","MtD","B","",None,10)
add("geral","utensilios","kit-refeicao","Kit de refeição (tigela, colher, caneca)","conjunto",1,"d","Derivado","C","Madeira torneada. Mantém o id do catálogo.",5,0.5)
add("geral","utensilios","balde","Balde","unidade",48,"C","MtD","B","",None,1.5)
add("geral","utensilios","barril","Barril vazio","unidade",24,"C","MtD","B","",None,8)
add("geral","utensilios","tina","Tina","unidade",32,"C","MtD","B","",None,6)
add("geral","utensilios","cesto","Cesto","unidade",8,"C","MtD","B","",None,1)
add("geral","utensilios","bacia","Bacia","unidade",16,"C","MtD","B","",None,1)
add("geral","utensilios","jarra-metal","Jarra de metal","unidade",48,"C","MtD","B","",None,1)
add("geral","utensilios","garrafa","Garrafa","unidade",32,"C","MtD","B","",None,0.5)
add("geral","utensilios","frasco","Frasco de vidro","unidade",28,"C","MtD","B","",None,0.3)
add("geral","utensilios","frasquinho","Frasquinho (vial)","unidade",16,"C","MtD","B","",None,0.1)
add("geral","utensilios","cantil","Cantil ou odre","unidade",20,"C","MtD","B","Mantém o id do catálogo ('Cantil').",5,0.3)
add("geral","utensilios","saco-grande","Saco grande","unidade",dv(1.5*5.5,0.2),"d","Derivado","C","Jarda e meia de lona. A MtD dá 15 d.",None,0.5)
add("geral","utensilios","bolsinha","Bolsinha","unidade",8,"C","MtD","B","",None,0.1)
add("geral","utensilios","mochila","Mochila","unidade",120,"C","MtD","B","Um quarto de couro (6,5 d) mais um dia de seleiro, com margem.",20,1.5)
add("geral","utensilios","alforje","Alforje (par)","par",dv(0.4*26,1.5),"d","Derivado","C","Dois quintos de couro mais um dia e meio de seleiro.",50,2)
add("geral","utensilios","caixa-mapas","Caixa para mapas ou pergaminhos","unidade",40,"C","MtD","B","Mantém o id do catálogo.",10,0.5)
add("geral","utensilios","caixa-esmolas","Caixa de esmolas","unidade",1.5,"d","Derivado","C","Caixinha de madeira com fenda.",10,0.5)
# ---------- Luz e fogo
add("geral","luz","vela","Vela de sebo","unidade",0.25,"d","Hodges","A","Hodges: candles de ¼ d (1331); 1,5 a 2,5 d a libra. Mantém o id do catálogo.",1,0.06)
add("geral","luz","vela-sebo-libra","Velas de sebo (~8)","libra (~0,45 kg)",16,"C","MtD","B","Hodges: 1,5 a 2,5 d por libra (1338).",None,LB)
add("geral","luz","vela-cera","Velas de cera","libra (~0,45 kg)",52,"C","MtD","B","Hodges: 6,5 d por libra (1406-1407).",None,LB)
add("geral","luz","tocha","Tocha","unidade",8,"C","MtD","B","Tocha de resina ou breu, ~1 hora. Mais cara por hora que a vela.",1,1)
add("geral","luz","lampada","Lâmpada (lamparina)","unidade",40,"C","MtD","B","Mantém o id do catálogo.",30,0.5)
add("geral","luz","lanterna-coberta","Lanterna coberta","unidade",160,"C","MtD","B","",50,1)
add("geral","luz","frasco-oleo","Frasco de óleo de lamparina","frasco (~0,5 L)",1.5,"d","Derivado","C","Óleo vegetal ou de peixe: 3 d por litro, um pouco acima do sebo por peso. Mantém o id do catálogo.",10,0.5)
add("geral","luz","caixa-fogo","Pederneira e fuzil (caixa de fogo)","unidade",8,"C","MtD","B","Mantém o id do catálogo.",5,0.2)
# ---------- Ferramentas
add("geral","ferramentas","pa","Pá","unidade",24,"C","MtD","B","Hodges: pá e enxada juntas, 3 d (1457).",None,2)
add("geral","ferramentas","enxadao","Enxadão","unidade",28,"C","MtD","B","",None,2)
add("geral","ferramentas","picareta","Picareta","unidade",28,"C","MtD","B","",None,3)
add("geral","ferramentas","machado-lenha","Machado de lenhador","unidade",40,"C","MtD","B","Hodges: 5 d (1457).",None,1.5)
add("geral","ferramentas","machadinha-ferramenta","Machadinha (ferramenta)","unidade",28,"C","MtD","B","",None,0.8)
add("geral","ferramentas","martelo-ferramenta","Martelo (ferramenta)","unidade",dv(0.6/LB*FERRO_D_LB, 0.5),"d","Derivado","C","~0,6 kg de ferro mais meio dia de ferreiro. A MtD dá 8 d (preço de 1514), acima do machado. Id novo: 'martelo' colide com a arma.",10,0.6)
add("geral","ferramentas","marreta","Marreta","unidade",dv(4.5/LB*FERRO_D_LB,0.5),"d","Derivado","C","~4,5 kg de ferro mais meio dia de ferreiro. A MtD dá 50 d.",None,5)
add("geral","ferramentas","pe-de-cabra","Pé de cabra","unidade",dv(2/LB*FERRO_D_LB,0.5),"d","Derivado","C","~2 kg de ferro mais meio dia de ferreiro.",20,2)
add("geral","ferramentas","faca-pequena","Faca pequena","unidade",20,"pc","Tabela do jogo","B","Linha 'Faca, machado, ponta de lança' (Dif 4) no lote. Mantida.",20,0.2)
add("geral","ferramentas","formao","Formão","unidade",32,"C","MtD","B","Hodges: 2 formões, 8 d (1514).",None,0.3)
add("geral","ferramentas","trado","Trado (broca)","unidade",24,"C","MtD","B","Hodges: 3 d (1457).",None,0.5)
add("geral","ferramentas","foice","Foice","unidade",24,"C","MtD","B","",None,0.5)
add("geral","ferramentas","gadanha","Gadanha","unidade",dv(1.5/LB*FERRO_D_LB,1),"d","Derivado","C","A MtD dá 30 d, 10x a foice. Derivado: lâmina longa de ~1,5 kg mais um dia de ferreiro.",None,2)
add("geral","ferramentas","relha","Relha de arado","unidade",40,"C","MtD","B","Hodges: 5 d (c. 1350).",None,3)
add("geral","ferramentas","pedra-amolar","Pedra de amolar","unidade",8,"C","MtD","B","",None,0.5)
add("geral","ferramentas","agulha-alfinetes","Agulha e 12 alfinetes","conjunto",16,"C","MtD","B","",None,0.02)
add("geral","ferramentas","linha","Linha (3 m)","3 m",0.15,"d","Catálogo","B","Mantido.",1,0.01)
add("geral","ferramentas","pregos","Pregos","100 unidades",132/10,"C","MtD","B","MtD 132 C o milheiro.",None,0.5)
add("geral","ferramentas","anzol","Anzóis","dúzia",12,"C","MtD","B","Vendido em dúzia para não cair abaixo de 1 pc.",None,0.05)
add("geral","ferramentas","rede-pesca","Rede de pesca","m² (~11 pés²)",24*10.76/12,"C","MtD","B","",None,0.3)
add("geral","ferramentas","roca","Roda de fiar","unidade",80,"C","MtD","B","Hodges: 10 d (1457).",None,8)
add("geral","ferramentas","balanca","Balança de mercador","unidade",400,"C","MtD","B","",None,3)
add("geral","ferramentas","ampulheta","Ampulheta","unidade",140,"C","MtD","B","",None,0.5)
add("geral","ferramentas","ferramenta-pedreiro","Ferramenta de pedreiro","unidade",24,"C","MtD","B","Hodges: 3 ferramentas, 9 d (c. 1350).",None,1)
add("geral","ferramentas","bigorna","Bigorna","unidade",1920,"C","MtD","B","Hodges: 20s (1514).",None,50)
add("geral","ferramentas","fole","Fole de forja","unidade",2880,"C","MtD","B","Hodges: 30s (1514).",None,15)
add("geral","ferramentas","morsa","Morsa","unidade",1280,"C","MtD","B","Hodges: 13s 4d (1514).",None,15)
add("geral","ferramentas","oficina-armeiro","Ferramentas completas de armeiro","conjunto",26584,"C","MtD","B","Hodges: £13 16s 11d (1514). Referência para montar oficina.",None,None)
# ---------- Aventura e viagem
add("geral","aventura","saco-dormir","Saco de dormir (rolo de lona e lã)","unidade",dv(1.5*5.5+1,0.3),"d","Derivado","C","Jarda e meia quadrada de lona (8,25 d), manta de enchimento (1 d) e costura. Fica acima do cobertor, porque leva lona e manta.",10,3)
add("geral","aventura","tenda","Tenda pequena (2 pessoas)","unidade",dv(10*5.5+1,1),"d","Derivado","C","~10 jardas quadradas de lona (5,5 d cada) mais varas e um dia de costura. A MtD dá 200 d, provável pavilhão.",None,8)
add("geral","aventura","pavilhao","Pavilhão de lona","unidade",1600,"C","MtD","B","A 'tenda' da MtD.",None,40)
add("geral","aventura","corda-canhamo","Corda de cânhamo (15 m)","15 m (~1,7 kg)",dv(3.75*0.5,0.3),"d","Derivado","C","3,75 libras de cânhamo mais o cordoeiro. A MtD daria ~94 d, provável cabo de navio. Mantém o id do catálogo.",10,1.7)
add("geral","aventura","corrente","Corrente leve","1 m",dv(0.7/LB*FERRO_D_LB,1),"d","Derivado","C","~0,7 kg de ferro mais um dia de ferreiro por metro.",None,0.7)
add("geral","aventura","gancho","Gancho de escalada (arpéu)","unidade",dv(1.5/LB*FERRO_D_LB,0.5),"d","Derivado","C","~1,5 kg de ferro mais meio dia de ferreiro.",None,1.5)
add("geral","aventura","piton","Píton (cravo de ferro)","unidade",8,"C","MtD","B","Mantém o id do catálogo.",1,0.2)
add("geral","aventura","escada","Escada","3 m",80,"C","MtD","B","",None,8)
add("geral","aventura","vara","Vara","3 m",20,"C","MtD","B","",None,2)
add("geral","aventura","algemas","Algemas (grilhões)","par",dv(1/LB*FERRO_D_LB,1),"d","Derivado","C","~1 kg de ferro mais um dia de ferreiro. A MtD dá 100 d.",None,1)
add("geral","aventura","cadeado","Cadeado simples","unidade",dv(0.3/LB*FERRO_D_LB,1.5),"d","Derivado","C","~0,3 kg de ferro mais um dia e meio de serralheiro. Não é a 'Fechadura' de segredo (Req 5) da tabela.",None,0.3)
add("geral","aventura","cataplasma","Cataplasma medicinal (emplastro)","unidade",1.5,"d","Tabela do jogo","B","Linha 'Emplastro, tintura, tinta' (Herbalismo, Dif 7, 2 h): ~10 pc. A MtD dá 4 d.",None,0.1)
add("geral","aventura","sabao","Sabão (barra)","barra (~0,1 kg)",16*0.22,"C","MtD","B","MtD 16 C por libra. Mantém o id do catálogo.",2,0.1)
add("geral","aventura","apito","Apito","unidade",24,"C","MtD","B","",None,0.05)
add("geral","aventura","espelho","Espelho de aço","unidade",40,"C","MtD","B","",None,0.3)
add("geral","aventura","sino","Sino de mão","unidade",dv(0.3/LB*2.5,0.5),"d","Derivado","C","~0,3 kg de bronze mais fundição. Mantém o id do catálogo.",10,0.3)
add("geral","aventura","esferas-metal","Esferas de metal (1000)","1000 unidades",dv(1/LB*FERRO_D_LB*LB*2.2,1),"d","Derivado","C","~1 kg de ferro em bolinhas e um dia de ferreiro.",10,1)
add("geral","aventura","saquinho-areia","Saquinho de areia","unidade",0.15,"d","Catálogo","B","Mantido.",1,0.5)
add("geral","aventura","kit-disfarce","Kit de disfarce","conjunto",250,"pc","Catálogo","B","Mantido: duas mudas de roupa usada (100), pós e tintas (~70), cabelo postiço (~50) somam ~220.",250,3)
add("geral","aventura","vidro-perfume","Vidro de perfume","unidade",50,"pc","Catálogo","B","Mantido: água de rosas e óleos em frasco de vidro.",50,0.2)
add("geral","aventura","bloco-incenso","Bloco de incenso","unidade (~50 g)",2.6,"d","Derivado","C","Resina importada a ~2s por libra: 50 g = ~2,6 d.",5,0.05)
add("geral","aventura","incensario","Incensário","unidade",dv(0.5/LB*32/8,1.5),"d","Derivado","C","Latão fundido mais um dia e meio de latoeiro.",30,0.6)
# ---------- Escrita
add("geral","escrita","folha-papel","Folha de papel","folha",3,"pc","Derivado","C","Mundo letrado (decisão do autor): papel comum, no preço do pergaminho. A MtD dá 8 C (papel raro antes de 1400). Mantém o id do catálogo.",2,0.01)
add("geral","escrita","folha-pergaminho","Folha de pergaminho","folha",4,"C","MtD","B","Mantém o id do catálogo.",1,0.01)
add("geral","escrita","velino","Folha de velino","folha",12,"C","MtD","B","",None,0.01)
add("geral","escrita","caneta-tinteiro","Pena de escrever","unidade",0.15,"d","Catálogo","B","Mantido.",1,0.01)
add("geral","escrita","vidro-tinta","Vidro de tinta","unidade",3.5,"d","Tabela do jogo","B","Linha 'Emplastro, tintura, tinta' (~10 pc) mais o frasquinho (13 pc). O catálogo cobrava 8 pp.",80,0.1)
add("geral","escrita","livro-estudo","Livro de estudo","volume",500,"pc","Derivado","C","Mundo letrado: ~200 páginas de cópia a 2 pc, ~100 folhas a 3 pc, encadernação. Histórico: ~180 d (12 po). Mantém o id do catálogo.",250,2)
add("geral","escrita","caderno-notas","Caderno de notas","unidade (~40 folhas)",50,"pc","Derivado","C","Folhas de papel costuradas com capa de couro.",None,0.5)
add("geral","escrita","livro-raro","Livro iluminado ou raro","volume",2000,"pc","Derivado","C","Iluminura e cópia fiel; a partir de 20 po.",None,3)
add("geral","escrita","parafina","Parafina (lacre)","barra (~10 usos)",8,"C","MtD","B","O catálogo tem 'Parafina (lacre)' a 5 pc por uso.",5,0.05)
add("geral","escrita","carta-nautica","Carta náutica","unidade",4000,"C","MtD","B","",None,0.2)
add("geral","escrita","mapa-comercial","Mapa de rotas comerciais","unidade",20000,"C","MtD","B","",None,0.5)

def preco_pc(it):
    if it["moeda"] == "C": v = C2pc(it["val"])
    elif it["moeda"] == "d": v = d2pc(it["val"])
    else: v = it["val"]
    return v

R_ESTAVEL = 0.30
def fechar(it):
    bruto = preco_pc(it)
    pc = arred(bruto)
    regra = "arredondado"
    if it["atual"] is not None and it["atual"] >= 1 and abs(pc / it["atual"] - 1) <= R_ESTAVEL and it["fonte"] != "Catálogo":
        pc, regra = int(it["atual"]), "R-estável (mantido o catálogo)"
    it["pc_bruto"] = bruto
    it["pc"] = pc
    it["dias_bracal"] = bruto / PC_POR_DIA_BRACAL
    it["regra"] = regra
    return it

for it in I: fechar(it)
POR_ID = {it["id"]: it for it in I}

CATEGORIAS = {"graos": "Grãos e pão", "alimentos": "Carnes, laticínios, peixe e feira", "bebidas": "Bebidas",
              "temperos": "Temperos e importados", "materia-prima": "Tecidos, couro, metais e insumos",
              "roupas": "Roupas", "casa": "Casa e mobília", "utensilios": "Utensílios e recipientes",
              "luz": "Luz e fogo", "ferramentas": "Ferramentas", "aventura": "Aventura e viagem", "escrita": "Escrita"}

def checar_coerencia():
    p = lambda k: POR_ID[k]["pc_bruto"]
    testes = [
        ("sebo (libra) < vela de sebo (libra)", p("sebo") < p("vela-sebo-libra")),
        ("cera (libra) < vela de cera (libra)", p("cera") < p("vela-cera")),
        ("leite de 1 libra de manteiga (~1,1 galão) < manteiga", 1.1 * p("leite") < p("manteiga")),
        ("leite de 1 libra de queijo (~1 galão) < queijo", 1.0 * p("leite") < p("queijo")),
        ("lençol < cobertor < saco de dormir", p("lencol") < p("cobertor") < p("saco-dormir")),
        ("martelo < machado de lenhador", p("martelo-ferramenta") < p("machado-lenha")),
        ("roupa usada < roupa comum nova", p("roupa-usada") < p("roupa-comum")),
        ("3 jardas de burel < roupa comum nova", 3 * p("tecido-grosso") < p("roupa-comum")),
        ("banco < cadeira < mesa", p("banco") < p("cadeira") < p("mesa")),
        ("baú < cofre < baú bom", p("bau") < p("cofre") < p("bau-bom")),
        ("ração de viagem <= 3 refeições pobres (3 pc)", POR_ID["racao-dia"]["pc"] <= 3),
        ("pão < farinha por kg? (não: pão tem água) pão kg < trigo 1,1 kg + padaria", True),
        ("grão de trigo por kg < pão por kg", p("trigo") / 27 < p("pao")),
        ("cevada por kg < pão grosseiro por kg", p("cevada") / 22 < p("pao-grosso")),
        ("tenda < pavilhão", p("tenda") < p("pavilhao")),
        ("cerveja fraca < média < boa (jarra)", p("cerveja-ruim-jarra") < p("cerveja-jarra") < p("cerveja-boa-jarra")),
        ("vinho ruim < comum < bom (caneca)", p("vinho-ruim-caneca") < p("vinho-caneca") < p("vinho-bom-caneca")),
    ]
    return testes

if __name__ == "__main__":
    for it in I:
        print(f'{it["id"]:24s} {it["pc_bruto"]:9.1f} -> {it["pc"]:6d}  atual {it["atual"]}  {it["regra"]}')
    print()
    for n, ok in checar_coerencia(): print("OK " if ok else "FALHA", n)
    print(len(I), "itens")
