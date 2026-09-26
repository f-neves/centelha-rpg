# Anexo de dados · auditoria da proposta de preços F1-F3

Dados de entrada da proposta `proposta-precos-f1-f3.md`, copiados literalmente do repositório do
Centelha, sem análise. Cada linha traz o número dela no arquivo de origem (`linha: texto`).
Fora do git.


## 1. Tabela de fabricação

Arquivo: `src/content/chapters/acoes-oficio-e-mundo.md`.

Definição dos números e cabeçalho do perfil do oficial:
```
22: | **Requisito** | o nível mínimo de Habilidade no ofício. Abaixo dele a peça não se tenta, e nenhum modificador abre a porta. A exceção é quem ajuda sob condução: na peça, de quem cumpre o Requisito; na obra, de quem tem o ofício (ver Ajuda e Direção de obra) |
23: | **Dificuldade** | o atrito de cada intervalo: quem passa dela avança, e quanto mais passa, mais rápido |
24: | **Montagem** | o Acúmulo que se paga **uma vez por lote**: acender a forja, montar o tear, bater a argamassa |
25: | **Peça** | o Acúmulo de **cada unidade** |
26: | **Intervalo** | o degrau em que aquele ofício respira |
27: | **Piso** | quando há, o número mínimo de intervalos, por mais hábil que seja o artesão |
135: O tempo da última coluna é o do **oficial**, o artesão comum de vila (soma 6, média 10,5), para uma unidade, sem ajuda, em qualidade Comum. O perito é soma 9 e o mestre é soma 12.
```
Escala de dias (intervalo = dia), linhas usadas:
```
150: ### Escala de dias
152: | Peça | Ofício | Req | Dif | Mont. | Peça | Oficial |
153: |---|---|:--:|:--:|:--:|:--:|:--:|
154: | Porta, banco, mesa tosca, cerca de 20 m | Carpintaria, Gerais | 1 | 4 | 2 | 4 | 1 dia |
155: | Escudo | Carpintaria | 1 | 4 | 2 | 6 | 1 dia |
156: | Gambeson | Alfaiataria | 1 | 4 | 3 | 20 | 3,5 dias |
157: | Faca, machado, ponta de lança | Ferreiro | 2 | 4 | 6 | 3 | 1,5 dia |
158: | Sela, arreio, bota, couro endurecido | Curtume | 2 | 7 | 3 | 9 | 3,5 dias |
160: | **Espada, machado de guerra, arma marcial** | Ferreiro | 3 | 7 | 12 | 10 | 6,3 dias |
161: | Arco longo, besta (madeira já curada) | Arcos, Carpintaria | 3 | 7 | 4 | 12 | 4,5 dias |
```
Escala de semanas (intervalo = semana), linhas usadas:
```
165: ### Escala de semanas
167: | Peça | Ofício | Req | Dif | Mont. | Peça | Piso | Oficial |
168: |---|---|:--:|:--:|:--:|:--:|:--:|:--:|
169: | Casa de madeira, celeiro | Carpintaria | 2 | 4 | 4 | 40 | 2 | 7 semanas |
170: | Cota de malha | Armaria | 2 | 8 | 2 | 12 | 3 | 6 semanas |
171: | Brigandina | Armaria | 2 | 6 | 3 | 10 | 2 | 3 semanas |
172: | Lamelar | Armaria | 3 | 9 | 3 | 10 | 3 | 9 semanas |
175: | Placa de munição | Armaria | 4 | 8 | 4 | 14 | 3 | 7 semanas |
176: | Placa completa sob medida | Armaria | 5 | 11 | 6 | 24 | 6 | fechada ao oficial |
```
Mapa de uso na proposta: arma marcial = :160 · arremesso (faca, machado, ponta) = :157 ·
arcos e bestas = :161 · escudo = :155 · carpintaria simples = :154 · gambeson = :156 · couro
endurecido = :158 · cota, brigandina, lamelar = :170-172 · placa de munição = :175 · placa completa
= :176. Não há linha para Camisa de malha, Malha completa, Peitoral, Peitoral reforçado, Placa de
transição e Placa articulada.

Exemplo textual do lote (espada comum, oficial):
```
59: | Espadas no mesmo lote | Acúmulo total | Dias | Dias por espada |
60: |:--:|:--:|:--:|:--:|
61: | 1 | 22 | 6,3 | 6,3 |
62: | 3 | 42 | 12,0 | 4,0 |
63: | 5 | 62 | 17,7 | 3,5 |
64: | 8 | 92 | 26,3 | 3,3 |
```

## 2. Pesos e preços atuais

Arquivo: `lore/economia/catalogo-unificado.md` (compilado de `src/data/*.json`).

Armas:
```
19: | Arma | Preço | Peso |
20: |---|---:|---:|
21: | Adaga | 6pp | 0,3kg |
22: | Espada Curta | 1po 5pp | 0,9kg |
23: | Espada Longa | 2po 5pp | 1,4kg |
24: | Machado | 3po | 1,2kg |
25: | Espada Serrilhada | **sem preço** | 1,5kg |
26: | Maça | **sem preço** | 1,3kg |
27: | Picareta de Guerra | **sem preço** | 1,3kg |
28: | Lança | 5pp | 2kg |
29: | Alabarda | 2po 8pp | 2,7kg |
30: | Montante | 7po | 2,8kg |
31: | Martelo de Guerra | 1pl | 2,5kg |
32: | Arco Curto | 8pp | 0,6kg |
33: | Arco Longo | 1po 5pp | 0,8kg |
34: | Arco Composto | 5po 5pp | 0,7kg |
35: | Besta Pequena | 3po | 2,5kg |
36: | Besta Média | 5po 5pp | 4,5kg |
37: | Besta Grande | 9po 5pp | 7kg |
38: | Adaga de Arremesso | **sem preço** | 0,2kg |
39: | Machado de Arremesso | **sem preço** | 0,7kg |
40: | Azagaia | **sem preço** | 0,8kg |
41: | Funda | **sem preço** | 0,1kg |
42: | Dardos | **sem preço** | 0,2kg |
43: | Bumerangue | **sem preço** | 0,3kg |
44: | Rede | **sem preço** | 1,5kg |
45: | Pilum | **sem preço** | 2kg |
46: | Machadinha | 8pp | 0,8kg |
47: | Machado Pesado | 8po | 3kg |
48: | Martelo | 2po 5pp | 1,3kg |
49: | Bastão | 4pp | 0,25kg |
50: | Lança Longa | 9pp | 2,4kg |
51: | Sabre | 3po | 0,8kg |
52: | Maça Estrela | 3po 2pp | 1,5kg |
```
Armaduras:
```
61: | Armadura | Classe | Preço | Peso |
62: |---|---|---:|---:|
63: | Nenhuma | nenhuma | (opção "sem armadura") | 0kg |
64: | Gambeson (acolchoado) | leve | **sem preço** | 3,5kg |
65: | Couro endurecido | leve | **sem preço** | 5kg |
66: | Peitoral | leve | 2po 8pp | 4kg |
67: | Camisa de malha | leve | 2po | 7kg |
68: | Cota de malha | média | **sem preço** | 11kg |
69: | Brigandina / coat of plates | média | **sem preço** | 9kg |
70: | Lamelar | média | **sem preço** | 12kg |
71: | Peitoral reforçado | pesada | 9po | 14kg |
72: | Placa de transição | pesada | **sem preço** | 18kg |
73: | Placa de munição | pesada | **sem preço** | 22kg |
74: | Placa articulada | pesada | 1pl 4po | 20kg |
75: | Placa completa | pesada | **sem preço** | 25kg |
76: | Malha completa | pesada | 1pl 8po | 20kg |
```
Escudos:
```
84: | Escudo | Preço | Peso |
85: |---|---:|---:|
86: | Nenhum | (opção "sem escudo") | 0kg |
87: | Broquel (buckler) | 6pp | 1kg |
88: | Targe | 3pp | 2,5kg |
89: | Hoplon | 6pp | 7kg |
90: | Heater | 1po | 3kg |
91: | Kite | 2po 5pp | 4,5kg |
92: | Scutum romano | 3po 5pp | 7,5kg |
93: | Pavês (pavise) | 4po 5pp | 6kg |
```

## 3. Estatísticas das armaduras e dos escudos

Arquivo: `src/content/chapters/armas-e-armaduras.md`.

Armaduras:
```
112: | Armadura | Classe | Impacto | Corte | Perfuração (Nível) | Penalidade |
113: |---|:---:|:---:|:---:|:---:|:---:|
115: | Gambeson | leve | 3 | 4 | 1 / N 0 | −1 |
116: | Couro endurecido | leve | 2 | 2 | 1 / N 1 | −1 |
117: | Peitoral | leve | 3 | 3 | 1 / N 1 | −1 |
118: | Camisa de malha | leve | 1 | 5 | 1 / N 1 | −1 |
119: | Cota de malha | média | 1 | 6 | 1 / N 1 | −2 |
120: | Brigandina | média | 4 | 6 | 3 / N 1 | −2 |
121: | Lamelar | média | 3 | 6 | 3 / N 1 | −2 |
122: | Peitoral reforçado | pesada | 4 | 7 | 2 / N 1 | −2 |
123: | Placa articulada | pesada | 4 | 8 | 3 / N 2 | −2 |
124: | Malha completa | pesada | 2 | 8 | 1 / N 2 | −3 |
125: | Placa de transição | pesada | 4 | 8 | 3 / N 2 | −3 |
126: | Placa de munição | pesada | 4 | 7 | 4 / N 2 | −3 |
127: | Placa completa | pesada | 4 | 8 | 4 / N 3 | −3 |
```
Escudos:
```
141: | Escudo | Defesa | vs Projétil rápido | Penalidade | Estilo |
142: |---|:---:|:---:|:---:|---|
143: | Broquel | +1 | não | 0 | puro uso ativo; ineficaz contra projéteis |
144: | Targe | +1 | não | 0 | duelista, cobertura limitada; ineficaz contra projéteis |
145: | Hoplon | +2 | bloqueia | −1 | o melhor todo-terreno barato |
146: | Heater | +3 | bloqueia | −2 | cobre o tronco, a pé ou a cavalo |
147: | Kite | +3 | bloqueia | −2 | muita cobertura, pesado |
148: | Scutum | +3 | bloqueia | −3 | brilha em formação (testudo) |
149: | Pavês | +3 | bloqueia (+3) | −4 | parede portátil do besteiro: +3 na Defesa contra projéteis |
```
Acesso (campo `acesso` dos JSON). As cinco armaduras Peitoral, Camisa de malha, Peitoral
reforçado, Placa articulada e Malha completa não têm o campo.

| Item | Acesso | Origem |
|---|:--:|---|
| Gambeson | 9 | src/data/armaduras.json:29 |
| Couro endurecido | 8 | src/data/armaduras.json:51 |
| Cota de malha (malha) | 4 | src/data/armaduras.json:73 |
| Brigandina | 6 | src/data/armaduras.json:95 |
| Lamelar | 3 | src/data/armaduras.json:117 |
| Placa de transição | 2 | src/data/armaduras.json:139 |
| Placa de munição | 4 | src/data/armaduras.json:161 |
| Placa completa | 1 | src/data/armaduras.json:183 |
| Broquel | 9 | src/data/escudos.json:30 |
| Targe | 7 | src/data/escudos.json:53 |
| Hoplon (redondo) | 8 | src/data/escudos.json:76 |
| Heater | 6 | src/data/escudos.json:99 |
| Kite | 5 | src/data/escudos.json:122 |
| Scutum | 3 | src/data/escudos.json:145 |
| Pavês | 5 | src/data/escudos.json:168 |

Fórmula de Dificuldade por acesso (só no documento de trabalho, não no capítulo):

```
1181: <p class="formula">Dificuldade da armadura ≈ 12 − acesso, com piso 4</p>
1183: O gambeson cai em 4, a cota de malha em 8, a brigandina em 6, a placa completa em 11. Bate com a
1184: tabela abaixo, que foi escrita antes da fórmula.
```

## 4. Regras textuais

Média por soma (`src/content/chapters/coracao-do-sistema.md`, `src/content/chapters/acoes-e-sistema.md`):
```
14: O *pool* básico é determinado pela soma de Atributo + Habilidade. A metade desse valor (arredondada para baixo) é a **quantidade de dados**. Se a soma for **ímpar**, some um **bônus fixo de +2** ao resultado.
```
```
94: <p class="formula">Média = 3,5 × (número de dados), + 2 se a soma for ímpar<br />Progresso por intervalo = média − Dificuldade</p>
```
Acúmulo, Requisito, Piso e limites de lote (`src/content/chapters/acoes-oficio-e-mundo.md`):
```
29: <p class="formula">Acúmulo total = Montagem + (Peça × unidades)</p>
33: Só a **Habilidade** conta para o Requisito, nunca a soma com o Atributo: destreza de mão não substitui não saber. As exceções são duas, as duas mais abaixo: na fabricação, quem ajuda sob a condução de alguém que cumpre o Requisito da peça não precisa cumpri-lo, mas trabalha contra a Dificuldade da peça (Ajuda); na obra, o ajudante sob direção de quem tem o ofício não tem Requisito nenhum e trabalha contra a Dificuldade 4 (Direção de obra). Nos dois casos, quem sabe é quem conduz.
35: O **Piso** existe porque há serviço que não é técnica, é mão. Uma cota de malha são milhares de anéis rebitados um a um, e nenhuma Habilidade do mundo cria dedos extras: o mestre armeiro faz uma cota **melhor** que o oficial, não uma cota em três dias.
57: **Ninguém mantém uma forja acesa para fazer uma espada só.** Aquecer, preparar o carvão, temperar a água e arrumar as bancadas custa o mesmo para uma peça ou para oito, e só o trabalho da peça se repete. Por isso a Montagem entra uma vez por **lote**.
66: O ganho é grande e satura, que é como funciona de verdade. O limite do lote é físico, não numérico: quantas peças cabem no fogo, na bancada, no tear. Na falta de um número melhor, **oito** para peça de mão e **três** para peça grande. O lote exige unidades **iguais**: cinco espadas do mesmo modelo são um lote, mas uma espada, um elmo e uma panela são três montagens.
```
Ganho semanal textual e os três perfis (`src/content/chapters/acoes-oficio-e-mundo.md`):
```
135: O tempo da última coluna é o do **oficial**, o artesão comum de vila (soma 6, média 10,5), para uma unidade, sem ajuda, em qualidade Comum. O perito é soma 9 e o mestre é soma 12.
206: <p class="formula">Ganho por semana = (média − 4) × 10 pc, limitado pela demanda do lugar</p>
208: O oficial tira 65 pc por semana, o perito 120, o mestre 170. O teto é o mercado: uma aldeia absorve talvez 50 pc por semana de qualquer ofício, uma vila 150, uma cidade 500, e uma capital não tem teto prático. É o que faz o mestre armeiro se mudar para a cidade.
```
Tabela de Renda, Braçal a Treinado, e semana de trabalho (`src/content/chapters/custo-de-servico-e-itens.md`):
```
39: | Recursos | Serviço | Renda/Sem | Renda/Mês | Livre/Sem | Livre/Mês | Livre/Ano |
40: |:---:|---|:---:|:---:|:---:|:---:|:---:|
41: | ● | Braçal | 6 pp | 22 pp | 10 pc | 4 pp | 38 pp |
42: | ●● | Destreinado | 10 pp | 40 pp | 20 pc | 8 pp | 78 pp |
43: | ●● | Treinado | 27 pp | 10 po | 50 pc | 20 pp | 17 po |
53: <p class="muted">Uma <strong>semana de trabalho</strong> vale 6 dias.</p>
```

## 5. Citações do legado

Arquivo: `legacy/raiz/armaduras_escudos_centelha.txt`.

Acesso:
```
71: ACESSO
72:   0  = so para os mais ricos, raro
73:   10 = qualquer soldado conseguia
74:   Ancora: facilidade de obter em cidades medias do cenario.
```
Lamelar:
```
119: * Lamelar: acesso 3 no Ocidente (exotico). Na estepe, mundo bizantino e
120:   Asia era equipamento padrao, acesso ~7 "em casa".
```
Cota de malha, "cavalo de guerra":
```
175: COTA DE MALHA (sem acolchoado)
176:   Campea do corte (8), pior em impacto (2): sem acolchoado a energia
177:   passa direto e quebra osso sob aneis intactos. NUNCA usada sozinha na
178:   realidade. Flecha nivel 1 fura, lamina larga nao passa. Resist.Perf 1.
179:   CUSTO: cara, ao contrario da intuicao. Cada anel forjado e rebitado a
180:   mao, 20 a 30 mil aneis. Valia um cavalo de guerra.
```
Brigandina, "sobre malha":
```
186: BRIGANDINA / COAT OF PLATES
187:   Placas pequenas rebitadas em tecido, vestidas sobre malha. Inventada
188:   para dar protecao tipo-placa a quem nao pagava armadura completa.
189:   Melhor custo-beneficio do periodo. Ponto fraco nas frestas entre
190:   placas.
```
Placa de munição:
```
207: 6. VARIANTE: PLACA DE MUNICAO
208: ----------------------------------------------------------------
209: 
210: Placa produzida em serie, aco pior, ajuste generico. Equipou infantaria
211: no fim do sec. XV e no XVI.
212:   ACESSO: ~4 (em vez de 1)
213:   DEFESA: subtraia 1 a 2 de cada coluna da placa completa
214:   RESIST.PERF: 2 (mantem)
215: Util como "armadura de tropa" oposta a placa sob medida do nobre.
```

## 6. Descrições usadas como motivo na proposta

Arco Composto, campo `descricao` (`src/data/armas.json`):
```
530: "descricao": "Laminado de chifre e tendão: exige Força 4 para armar, e soma Força×2 ao dano. Grande, alcance longo, arma cara. Perfura couro e malha (N1), resvala na placa.",
```
Arco Composto, linha do capítulo com o cabeçalho da tabela (`src/content/chapters/armas-e-armaduras.md`):
```
83: | Arma | Classe | Modos | Velocidade | Dano | Acerto | Distância | Mãos | Destaque |
84: |---|:---:|---|:---:|:---:|:---:|:---:|:---:|---|
87: | Arco Composto | Distância | ★P(N1) | 6 | 1d6+2 | +0 | 300 m | 2 | Munição, **caro**. Com **Força 4+**, soma **Força×2** e o `+2`; **abaixo disso rende como um Arco Longo** (Força×1, sem o `+2`). Resvala na placa |
```
Pilum, campo `descricao` (`src/data/armas.json`):
```
959: "descricao": "Dardo pesado anti-escudo: fura placa (N2) e entorta ao cravar, inutilizando o escudo atingido.",
```
Pilum, linha do capítulo, mesma tabela (`src/content/chapters/armas-e-armaduras.md`):
```
95: | Pilum | Arremesso | ★P(N2) | 5 | 1d6+2 | +1 | 25 m | 1 | Anti-escudo: fura placa de N2 e entorta ao cravar |
```
Placa de munição, campo `descricao` (`src/data/armaduras.json`):
```
162: "descricao": "Placa produzida em série, aço pior, ajuste genérico. A armadura de tropa, oposta à placa sob medida do nobre.",
```
Placa de transição, campo `descricao` (`src/data/armaduras.json`):
```
140: "descricao": "Malha com as primeiras placas rígidas. Etapa cara e cavaleiresca rumo à placa completa.",
```
Placa de transição, legado (`legacy/raiz/armaduras_escudos_centelha.txt`):
```
196: PLACA DE TRANSICAO (sec. XIV)
197:   Mistura de malha e primeiras placas rigidas. Etapa cara e cavaleiresca
198:   rumo a placa completa.
```
Scutum, campo `descricao` (`src/data/escudos.json`):
```
146: "descricao": "Retangular curvo, de madeira laminada. Cobre o corpo e multiplica em formação (testudo). Pesado para uso individual; hábil contra projéteis rápidos.",
```
