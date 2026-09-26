# Estado da revisão econômica · revisor adversarial

Arquivo de trabalho fora do git (`lore/economia/` não é rastreada). Sem commit, sem push.
Se a sessão for limpa (/clear), reler este arquivo antes de qualquer coisa.

## Papel

Revisor ADVERSARIAL da revisão econômica do Centelha. Analista = Claude do chat do Neves.
Neves decide. Revisor externo (ChatGPT) pausado até as 22h. Tentar quebrar cada análise antes
de aceitar; não concordar por padrão; conferir TODA conta em Python e toda citação no repositório.

Legenda obrigatória em cada conclusão: [T] regra textual · [M] consequência matemática ·
[I] inferência econômica · [E] extensão proposta · [H] hipótese · [P] problema descoberto.

Formato de resposta às contestações: ACEITO / DIVERGÊNCIA (com a conta) / VERIFICAÇÃO NO TEXTO (arquivo:linha).

Fontes: `lore/economia/catalogo-unificado.md` (preços e pesos), `src/data/*.json`,
`src/content/chapters/*`, `Acoes_Sistema.md`.

## Regras do sistema em uso [T]

- Moeda: pc base; 1 pp = 10 pc; 1 po = 100; 1 pl = 1000. Moeda de 30 g.
- Calendário: semana de 8 dias; semana de trabalho = 6 dias; mês = 4 semanas.
- Média de uma soma (Atributo + Habilidade) = 3,5 × piso(soma/2) + 2 se a soma for ímpar.
- Fabricação: Acúmulo total = Montagem + n × Peça (Montagem uma vez por lote; até 8 peças de mão,
  3 grandes). Progresso por intervalo = média − Dificuldade; média ≤ Dificuldade não termina.
  Requisito = nível mínimo da Habilidade do ofício, sem Atributo; Ofícios Gerais vale metade no
  Requisito. Sem o ofício específico, Dificuldade +4. Oficina e material: ±2/±4 na Dificuldade.
  Tempos da tabela arredondados ao MAIS PRÓXIMO, passo de meio dia / meia semana (1,38 → 1,5;
  3,54 → 3,5; 7,2 → 7), corrigido na rodada 4; usar sempre o valor calculado.
- G19 (decisão do autor): Direção a Dif 4 é só de obra. Na fabricação vale a condução: quem ajuda
  sob alguém que cumpre o Requisito dispensa o Requisito, mas trabalha contra a Dificuldade da peça.
- G18/G29 APLICADAS na rodada 106 (decisão do autor 24/09/2026), conferido em Acoes_Sistema.md:
  apoio da metade só em jogada única (:1190-1193); condução herda oficina e material, o +4 é
  pessoal, até dez ajudantes por artesão (:1197-1200, e :1207 "G19 e G20; a herança, o +4 pessoal
  e a trava de dez na G29"); obra = construção fixa no lugar ou escala de estações, o resto é
  fabricação, carroça/barco de pesca fabricação, navio de guerra obra (:1209-1212). No livro:
  src/content/chapters/acoes-oficio-e-mundo.md:121 (herança).

## Convenções e hipóteses da régua de preços

- Contabilidade: renda de trabalho sai da ficha pela fórmula; o excedente é de quem é dono da
  produção e entra em Recursos, pelo Mestre. Excedente ≠ lucro.
- H-×20: salário semanal = (média − 4) × 20 pc (apoio: subsistência 6 pc/dia = estalagem Pobre 3
  + três refeições de Rações a 1).
- H-mat: material ≈ 1/3 do preço, logo P_min = 1,5 × custo de trabalho (fechamento, não medição).
- Produtor de referência T3 = oficial da tabela (soma 6, média 10,5; 130 pc/semana = 21,67 pc/dia).
  T3-F: se o oficial não consegue, o menor perfil capaz. T1 (menor soma capaz) só sensibilidade.
  T2 REJEITADO como âncora.
- Custo avulso (n=1) e em lote (n=8) por peça = (Montagem + n × Peça) ÷ n, convertido pela
  produção diária do produtor. Preço entre lote e avulso = esperado para item comum de série.
  Preço abaixo do lote = ALERTA a explicar, não contradição automática.
- Peso como indicador de tempo, só dentro da classe (definições corrigidas na rodada 2):
  H-peso-A (A-total): Acúmulo total = Acúmulo_ref × peso/peso_ref; Montagem e Peça escalam juntas.
  A': total escala como em A, Montagem fica no valor da tabela, Peça = total − Montagem.
  H-peso-B: Montagem no valor da tabela; Peça = Peça_ref × peso/peso_ref; total = Montagem + Peça.
  Nunca peso → preço direto, nunca calibrar pelo preço.
- A tabela dá a referência da CLASSE, não do item; a escala intra-classe é [H] declarada, e vale
  para todas as classes ou nenhuma (aceito na rodada 2).
- H-comp: peça composta = soma dos componentes, cada um com sua Montagem e sua Peça. Regra
  textual não existe (G25).

## Adiados (não usar agora)

Tetos de mercado (textual 50/150/500 × dobrado 100/300/1000), G22, G24, convexidade da renda,
Recursos. Adiado: o VALOR POR PONTO da faixa de Dif 11 no modelo de renda (85, extrapolado; número
do analista, não está no repositório). A Dif 11 da Placa completa é dado da tabela de fabricação [T]
(acoes-oficio-e-mundo.md:176) e é usada com o salário H-×20 do perito, sem o 85. (Rótulo trocado na
rodada 8; antes dizia "Dificuldade 11".)

## Estado da Fase 1 (armas), como recebido

- Classe marcial (Dif 7, Mont 12, Peça 10), ref. Espada Longa 1,4 kg: grupo central (preço/avulso
  ~1,1 a 1,5) = Espada Curta, Espada Longa, Martelo, Maça Estrela. Explicação adicional: Martelo de
  Guerra (2,7 a 3,6), Sabre (1,8 a 2,6), Machado (1,6 a 1,7). Duas mãos dependem de A × B. Ordem
  invariante a T1/T3 e à referência; nível absoluto não.
- Haste: Lança robusta às duas hipóteses; Lança/Lança Longa não explicada; Alabarda no grupo
  central só se a cabeça for da linha marcial.
- Distância (Arcos/Carpintaria, Dif 7, Mont 4, Peça 12): Arco Longo âncora (1,01× avulso); Arco
  Curto no lote ou ~9% abaixo; Arco Composto com prêmio textual sem número; Bestas abaixo do lote
  pela extrapolação de peso = falha do modelo (composição = G25).
- Arremesso: só referências mínimas. Dardos, funda, bumerangue e rede sem base de fabricação.

---

## Rodada 1 · Tarefa 1 (calibragem do arremesso) · VEREDITO

Base conferida: linha "Faca, machado, ponta de lança | Ferraria | Req 2 | Dif 4 | Mont 6 | Peça 3 |
1,5 dia" em `Acoes_Sistema.md:1254` e `src/content/chapters/acoes-oficio-e-mundo.md:157`.
Oficial soma 6, média 10,5 em `Acoes_Sistema.md:1230`. 10,5 − 4 = 6,5 pontos/dia [M];
P_min = 1,5 × (130/6) ÷ 6,5 = 5,000 pc/ponto exatos [M]. Pesos em `catalogo-unificado.md:21,28,39,40,46`.

(a) Machado de Arremesso 0,7 kg, B: Peça = 3 × 0,7/0,3 = 7; lote = (6 + 56)/8 = 7,75 pts = 38,75 ≈ 39.
    ANALISTA CERTO [M]. O 44 do revisor é 43,75 = H-peso-A (Montagem 14 também escalada), ou é o
    lote B da Machadinha trocado de linha. Avulso B = 65.
(b) Machadinha 0,8 kg, B: Peça 8; avulso 14 pts = 70 (os dois concordam); lote = 70/8 = 8,75 pts =
    43,75 ≈ 44. ANALISTA CERTO [M]. 42,5 não sai de B com n=8; só sai com n=12 (acima do teto de 8)
    ou com Peça 7,75. Não reproduzido.
(c) Azagaia, k = 0,4: cabeça 6 + 1,2n, haste 2 + 1,6n; n=8 → 30,4/8 = 3,8 pts = 19,0; avulso 10,8
    pts = 54. CONTA CERTA sob H-comp [M]. Objeção PROCEDE EM PARTE: não contra a aritmética, e sim
    porque H-comp não tem Montagem de junção (encabar) e porque a haste pode ser "peça grande"
    (lote 3, não 8: dá ≈ 21,1) [H]. O 19 é piso condicional a H-comp, não número.

[P] novo, contra a BASE das três contas: a própria linha 1254 dá o MESMO Acúmulo (6/3) a "faca,
machado, ponta de lança". Com Adaga 0,3 kg como unidade de peso, um machado da linha (0,7 a 1,2 kg)
teria Peça 7 a 12, e o texto diz 3. A H-peso-B com referência Adaga contradiz [T] dentro da própria
linha. Leitura textual direta (machado = item da linha, sem escala): Machado de Arremesso e
Machadinha avulso 9 pts = 45, lote 3,75 pts = 18,75. Machadinha a 80 pc ficaria 1,8× o avulso.
A escala por peso só se sustenta se "machado" da linha for machadinha leve de ferramenta e a ponta
de lança/faca definirem a unidade; o texto não diz o peso de nenhum dos três [H]. Levar ao Neves.

Resposta do analista (rodada 2): (a),(b) registrados, revisor externo errou as duas. (c) ACEITO
como piso condicionado à H-comp. [P] da linha 1254: rebatido ("prova demais", a linha da espada
também junta espada e machado de guerra); ACEITO pelo revisor: escala intra-classe é [H] declarada
para todas as classes. Machadinha registrada nas duas leituras: sem escala 80/45 = 1,78× avulso e
80/18,75 = 4,27× lote; com B 80/70 = 1,14× avulso e 80/43,75 = 1,83× lote [M]. G18/G29 e A'×B
corrigidos acima.

---

## Rodada 2 · Fase 2, escudos · VEREDITO

Citações conferidas: linha "Escudo | Carpintaria | 1 | 4 | 2 | 6 | 1 dia" em Acoes_Sistema.md:1252 e
acoes-oficio-e-mundo.md:155. "Ferradura, corrente, grampo" em acoes-oficio-e-mundo.md:142.
Preços/pesos em catalogo-unificado.md:87-93; acesso em src/data/escudos.json. Fórmula do acesso
SÓ em Acoes_Sistema.md:1181 ("Dificuldade da armadura ≈ 12 − acesso, com piso 4"), e não está no
capítulo publicado [P]. Legado: legacy/raiz/armaduras_escudos_centelha.txt:329-332 (a citação
está certa, 331-332).

Teste 1: contas certas, exceto Targe/lote = 30/31,25 = 0,96, não 0,97 [M] (menor).
Teste 2: DIVERGÊNCIA. (i) viola a convenção da própria régua (nunca peso → preço direto); o teste
certo é peso → tempo (H-peso-B). (ii) "peso não ordena nada" é falso: Spearman peso×preço = +0,60
[M]. (iii) Sob B, a amplitude das razões preço/avulso é ~8,7× com QUALQUER referência (Broquel 8,8,
Hoplon 8,7, Heater 8,6), no mesmo nível do H-acesso (9,55×). O peso não fica rejeitado; empata.
Teste 3: contas certas (40; 47,27; 57,78; 74,29; 173,33; amplitude 9,55×) [M]. Acesso ordena melhor
(Spearman acesso×preço = −0,82) [M]. Mas: [P] contradiz o [T] da linha (Dif 4) em 5 de 7 escudos;
[P] circularidade: no legado acesso é variável de raridade/proteção ("DEFESA e ACESSO são quase
inversos", legado :325-326; e a DEFINIÇÃO do acesso, legado :71-74: "0 = só para os mais ricos, raro ·
10 = qualquer soldado conseguia · Âncora: facilidade de obter em cidades médias"), então usá-lo como Dif pode estar explicando preço de mercado com variável
de mercado; [P] a fórmula nem está no livro. O próprio texto valida a fórmula contra a tabela nas
armaduras (:1183-1184); nos escudos ela só bate com Dif 4 para acesso ≥ 8 (Broquel, Hoplon), o que
APOIA a leitura 1 (a linha "Escudo" é o escudo simples de acesso 8-9) [I].

Leitura 1: [P] o legado (:301-304, tabela 7.1) põe "Madeira (prancha + couro + umbo)" como material
BASE, e "madeira c/ borda e umbo de metal" como "padrão medieval comum". Couro e umbo não tornam o
escudo composto; a linha pode já contê-los. Distinção "madeira simples × composto" não tem apoio.
Leitura 2: citação certa, mas o alcance é menor: fala de "gambeson e escudo redondo" contra malha,
e de "acesso 8 ou 9". Apoia Broquel/Hoplon baratos, não escudo barato em geral.
Leitura 3: ACEITO os três candidatos; acrescentar Kite × Heater (mesma Defesa +3, mesma penalidade,
2,5× o preço) e Hoplon sob B (o mais pesado dos baratos vira o outlier se o peso for tempo).

Material nas descrições [T]: Scutum "madeira laminada" (escudos.json, legado); Hoplon "umbo" (sem
material); Targe "às vezes com espigão" (sem material); Broquel, Heater, Kite, Pavês: nada. O
capítulo armas-e-armaduras.md:141-149 não fala de material. Os caros não têm metal declarado.

H-comp com ferragem (Mont 3, Peça 2), uma unidade [H] em Hoplon e Targe: avulso 13 pts = 65 →
Targe 0,46×, Hoplon 0,92×; lote 43,1 → Targe 0,70×, Hoplon 1,39× [M]. Anda na direção ERRADA:
encarece justo os baratos. Para levar os caros a 1,5× o avulso seriam [H] ferragens: Heater 1,2,
Kite 11,2, Scutum 17,8, Pavês 24,5 [M]. Só o Heater fecha com hipótese plausível. Não fecha a amplitude.

FECHO DA FASE 2 (rodada 3). Aceitos pelo analista: Teste 2 (i)(ii)(iii), circularidade, fórmula só
no doc de trabalho, contradição em 5/7, leitura 1 derrubada, alcance menor do legado, Kite × Heater,
H-comp na direção errada. DIVERGÊNCIA do analista na minha síntese, ACEITA pelo revisor: tetos de
mercado limitam RENDA, não PREÇO; o lugar do prêmio é a camada de ESCASSEZ/disponibilidade (acesso),
adiada pelo autor. Régua: piso → escala → prêmio.
Estado da Fase 2: a linha explica Broquel, Hoplon, Heater; Targe = único alerta de custo; Kite,
Scutum, Pavês acima do custo, escassez (acesso) candidata ao prêmio [I], pendente da camada adiada.
Pares a explicar: Kite × Heater; Pavês × Scutum; Hoplon × Broquel. Ressalva do revisor: o par
Pavês × Scutum CONTRARIA a escassez (Scutum acesso 3, mais escasso, é mais barato que Pavês acesso 5),
e o Targe também (acesso 7, o mais barato). A camada de escassez não fecha esses dois.

---

## Rodada 3 · Fase 3, armaduras · VEREDITO

Contas [M], todas reproduzidas (script em Python, média = 3,5 × piso(s/2) + 2 se ímpar, salário
(m − 4) × 20 por semana, ÷ 6 por dia, P = 1,5 × tempo × salário, Piso aplicado):
Gambeson 115 / lote3 105 · Couro 111,4 / 92,9 · Cota 1.092 / 988 · Brigandina 563,3 / 476,7 ·
Lamelar 1.690 / 1.430 · Munição 1.404 / 1.196 · Completa T3-F (soma 7) 5.100, mestre 3.060.
Camisa (A) 694,9 / 628,7; Malha completa (A) 1.985,5 / 1.796,4; pc/kg munição 63,82; Peitoral 255,3;
Reforçado 893,5; Articulada 1.276,4 / 4.080 / 2.448. ACEITAS.

Premissas atacadas:
[M] Sob H-×20 o custo por ponto é 1,5 × 20(m − 4)/(m − D), DECRESCENTE em m para todo D > 4. O
  oficial é sempre o produtor capaz MAIS CARO, e o efeito cresce com D. D8: soma 6 = 78 pc/pt, soma 7
  = 56,7, soma 9 = 45. Cota: T3 1.092 × soma 7 793 (+38%). Lamelar (D9): T3 1.690 × soma 7 947 (+78%).
  O "Cota ≈ 1.100 compatível com o legado" depende do T3.
[P] Placa completa: T3-F (soma 7) = 5.100 e é o MAIS caro de todos; soma 9 = 2.160; soma 12 = 3.060
  (travado pelo Piso 6). "Menor perfil capaz" dá o teto do custo, não um custo representativo. E a
  Dif 11 está na lista de ADIADOS do próprio briefing. "Sob medida" [T] exclui lote (unidades iguais,
  acoes-oficio-e-mundo.md:66) e sugere o mestre como produtor [I].
[H] Piso × salário: cobrar o mestre por 6 semanas quando o trabalho é de 3 supõe que ele fica preso à
  peça no Piso inteiro. Se paga só o trabalho: 1.530.
Lote 3: [T] acoes-oficio-e-mundo.md:66 "oito para peça de mão e três para peça grande", "o limite é
  físico: fogo, bancada, tear", "unidades iguais". O texto NÃO diz que armadura é peça grande [H].
  Apoio para a Munição: "produzida em série, ajuste genérico" (armaduras.json; legado :207-213).
Req 4 da Munição: a tabela dá tempo de oficial (7 semanas) sem comentar o Req 4
  (acoes-oficio-e-mundo.md:175). Soma 6 = Hab 4 + Atr 2 é possível [M]; o texto não sustenta nem
  proíbe [T silencioso]. "Fechada ao oficial" coincide em todos os casos com Dif 11, nunca com o Req.
[P] menor: 18/2,5 = 7,2 semanas e a tabela diz 7 (arredondou para baixo). O capítulo não diz
  "arredondado para cima" em lugar nenhum (grep "arredond" vazio em acoes-oficio-e-mundo.md); a
  tabela arredonda ao mais próximo (4,57 → 4,5 no arco; 13,1 → 13 na forja). Premissa do briefing corrigida.
Família por peso: [P] a escolha de família das 5 precificadas é calibração pelo preço disfarçada, se
  não houver texto: Peitoral via Couro (111,4/5 kg) = 89 → 280 = 3,1×; via Munição 1,1×; via
  Brigandina 1,12×. Brigandina e Munição coincidem (62,6 e 63,8 pc/kg), então essas duas escolhas
  são robustas entre si; Couro e Completa não.

Verificação no texto:
- As 5 precificadas: armaduras.json dá a mesma descrição às cinco: "Armadura órfã resolvida (§5,
  leitura de novato): números de simulação, sujeitos a balanceamento final, exceto o preço (herdado
  da tabela antiga)". Nenhum material, nenhum acesso. O preço só aparece em
  custo-de-servico-e-itens.md:177-183, sob o aviso "Provisório ... use como referência de ordem de
  grandeza" (:10). O "4 de 5 perto do custo" compara com números declarados provisórios.
- Placa de transição: armaduras.json "Malha com as primeiras placas rígidas. Etapa cara e
  cavaleiresca rumo à placa completa"; legado :196-198. Sem linha de fabricação.
- Placa articulada: nenhum texto além da nota de órfã. [P] Nas estatísticas
  (armas-e-armaduras.md:123 e :125) ela é IDÊNTICA à Placa de transição (4/8/3, N2), só com
  penalidade −2 × −3. Pelas estatísticas a família dela seria a transição, que não tem linha.
- "Valia um cavalo de guerra": citação EXATA, legacy/raiz/armaduras_escudos_centelha.txt:180. Mas o
  sistema não tem preço de cavalo de guerra: só Cavalo de montaria 6 po e de criação 14 pp
  (custo-de-servico-e-itens.md:250, 266, 271). Comparar com o de montaria (600) troca o cavalo; a
  conferência é [I] fraca.

Camisa de malha: NENHUMA explicação textual (nem processo mais simples, nem anéis menores, nem
"só tronco"). As estatísticas (Corte 5 × 6, penalidade −1 × −2, classe leve) são compatíveis com uma
peça menor, e isso já está no peso. O alerta resiste a tudo [M]: B 751,6 / 647,6; melhor produtor
em lote 3 = soma 9, 363 → 200 = 0,55×; só o trabalho do oficial, sem material, já dá 463. O único
texto pertinente é a procedência: preço herdado da tabela antiga, declarado provisório.

---

## Rodada 4 · aceites, novo T3-F e proposta de preços das armaduras · VEREDITO

Aceites do analista: ressalva da escassez (Pavês × Scutum, Targe); lote 3 = [H] com apoio só na
Munição; arredondamento ao mais próximo (regra corrigida acima); família só Brigandina/Munição
para o Peitoral; Placa articulada = família da TRANSIÇÃO, sem linha; cavalo de guerra [I] fraca;
Camisa robusta. Premissa 1 aceita como SENSIBILIDADE (T3 mantido, reportar o intervalo).
Novo T3-F (analista): se o oficial não faz, o próximo perfil de referência (perito 9, mestre 12).

AUTOCORREÇÃO do revisor [M]: na rodada 3 eu disse que o oficial é "sempre" o produtor capaz mais
caro. Falso quando o Piso trava: Cota soma 12 = 1.530 > oficial 1.092; Brigandina soma 9 = 720 e
soma 12 = 1.020 > oficial 563. Vale só sem Piso ativo.

(1) Contas. Perito na Placa completa: média 16 (Hab 5 + Atr 4 = 9, possível), 30/5 = 6 semanas =
Piso, 6 × 240 × 1,5 = 2.160 [M] ACEITO. Faixas 1,3× conferidas (149,5; 144,8; 732; 1.420; 1.825;
2.197; 2.808; Camisa 903) [M].
[P] Os pisos do Peitoral (255) e do Reforçado (894) são o AVULSO, não o lote. Pela regra do próprio
analista: Peitoral 217 a 332 (via Munição) ou 212 a 325 (via Brigandina); Reforçado 761 a 1.161.
[P] A sensibilidade "~790" (Cota) e "~950" (Lamelar) é soma 7, o perfil que o próprio analista
acabou de rejeitar por falta de âncora no T3-F. Com os perfis de referência (6/9/12): Cota 1.092 /
1.080 / 1.530; Lamelar 1.690 / 1.080 / 1.530; Munição 1.404 / 1.080 / 1.530. Mínimo = perito 1.080
nas três.
[P] O próprio texto não segue a regra "próximo perfil de referência": a régua da espada dá a Boa a
"Ferreiro 4 e soma 10" (acoes-oficio-e-mundo.md:94), perfil que não é nenhum dos três; a Ótima ao
mestre (:95). O novo T3-F é [E], não [T]; é menos arbitrário que "menor capaz", só isso.

(2) Faixa lote → 1,3 × avulso contra as 20 armas precificadas calculáveis (Alabarda indeterminada):
marcial em A: DENTRO 6 (Espada Curta 1,14, Espada Longa 1,22, Machadinha B 1,14, Arco Longo 1,01,
Lança 0,67, Lança Longa 1,14*), FORA 14. Marcial em B: DENTRO 7 (+ Martelo 1,26), FORA 13.
Acima de 1,3×: Machado, Martelo (A 1,32), Maça Estrela (1,46/1,52), Sabre, Martelo de Guerra,
Montante, Machado Pesado, Adaga (1,33), Bastão (1,33), Arco Composto. Abaixo do lote: Arco Curto
(0,91× lote), Bestas P/M/G (0,85/0,87/0,97× lote).
(* Lança Longa = cabeça igual + haste × 2,4/2,0 é [H] do revisor.)
[P] O teto 1,3 corta o próprio grupo central que o justificou: Martelo (A) e Maça Estrela ficam
fora. E o piso "custo de lote" não tem apoio na Fase 1: nenhuma arma do grupo central estava perto
do lote; só a Lança fica entre lote e avulso. A faixa é [E] normativa; nas armas ela descreve 6-7
de 20. Se armadura vai ter a faixa e arma não, dizer por quê.

(3) Ordem contra o texto:
[P] Cota < Munição < Lamelar é artefato da âncora: no perito as três valem 1.080 (Piso 3 trava as
três); no mestre, 1.530 as três. A ordem só existe com o oficial.
[P] Âncoras misturadas: Completa ancorada no perito, o resto no oficial. Tudo no perito: Cota =
Lamelar = Munição 1.080, Completa 2.160 (2×). A mistura comprime a distância da "placa de nobre".
[P] Couro endurecido: 12 − acesso 8 = Dif 4, mas a linha dá Dif 7 (linha dividida com "sela,
arreio, bota"). É a única armadura em que tabela e fórmula discordam. Com Dif 4: 60 / 50, metade do
Gambeson; "Couro ≈ Gambeson" depende da linha.
[P] Placa articulada (família transição, legado "etapa cara e cavaleiresca", acesso 2 < Lamelar 3)
custa hoje 1.400, abaixo do PISO proposto do Lamelar (1.430). O texto a põe acima.
Sem contradição: Brigandina < Cota (legado :187-189 "vestidas sobre malha", "a quem não pagava
armadura completa"; o "sobre malha" do json :96 é vestir por cima, não conter); Camisa > Brigandina
(a Brigandina domina a Camisa em toda estatística menos penalidade, armas-e-armaduras.md:118 × :120,
coerente com "melhor custo-benefício"); Completa no topo.

(4) Lamelar: SIM, o texto contradiz a leitura "Dif 9 = fabricar é mais difícil". Legado :119-120:
"acesso 3 no Ocidente (exótico). Na estepe, mundo bizantino e Ásia era equipamento padrão, acesso ~7
'em casa'". E todas as Difs das armaduras menos o Couro batem exatamente 12 − acesso (Gambeson 4 pelo
piso, Cota 8, Brigandina 6, Lamelar 9, Munição 8, Completa 11). A Dif 9 do Lamelar é a raridade
ocidental embutida na produção: a circularidade da Fase 2, agora dentro do [T]. "Em casa" (Dif 5):
585 avulso (Piso trava) / 390 lote, abaixo da Brigandina. Uldun não tem "Ocidente" definido; qual
das duas vale é decisão de cenário [H]. armaduras.json:118 diz "Padrão no Oriente e na estepe".

---

## Rodada 5 · proposta de preços F1-F3 · VEREDITO

Proposta salva em lore/economia/proposta-precos-f1-f3.md (texto do analista, sem alteração).

(1) Contas [M], reproduzidas: Machado 1,26/1,15 · Sabre 1,46/1,03 · M. de Guerra 1,64/2,16 · Machado
Pesado 1,48/2,09 · Montante 1,71/2,36 · Maça Estrela 1,46/1,52 · Serrilhada 1,23/1,28 · Maça e Picareta
1,21/1,16 · Arco Curto 0,90(A)/0,83(B), 1,13× lote · Targe 1,25 · Camisa 827 → 800 = 1,15× · Malha
completa 2.364 → 2.400 = 1,21× · armaduras 1,2×: 138, 133,7, 676, 702, 1.310, 1.685, 2.592. ACEITAS.
Treinado 1.300/50 = 26 semanas ACEITO, mas Treinado é Recursos ●● (catalogo-unificado.md:255), não 3;
o Especialista (●●●) junta em 15,5 semanas.
[P] "Arredondado para valor exibível na maior unidade exata" não é regra de arredondamento: o fmt de
scripts/precos.mjs:14-22 exibe qualquer inteiro (138 → "138 pc"). O arredondamento é [E] e está
incoerente: armaduras ao mais próximo com 2 algarismos; Serrilhada 263/253 → 270 (para cima);
arremesso para baixo: Adaga de Arremesso 48 → 40 (1,00× avulso), Machado de Arremesso 78 → 70
(1,08×), Azagaia 64,8 → 60 (1,11×). Os de arremesso NÃO estão a 1,2×.
[P] Pilum 7 pp não reproduzível: com 2 kg e H-comp como a Lança, avulso 75, 1,2× = 90; 70 é 0,93×.

(2) Contras mais fortes que o analista não escreveu:
D1: a regra depende de A × B para decidir quem é "normal" (Sabre 1,46 × 1,03; Montante 1,71 × 2,36), e
"motivo com nome" sem número não é falseável: o Montante fica (1,71/2,36) com motivo de USO
("versátil") e o Martelo de Guerra (1,64/2,16) cai. Dois pesos: existentes até 1,5×, novos a 1,2×,
então item novo ao lado de item igual sai mais barato (Maça 230 × Martelo 250, mesma linha, 1,3 kg).
D2: 6 das 7 Difs de armadura = 12 − acesso. Se o acesso é escassez, TODAS estão contaminadas (Completa
Dif 11 = acesso 1 "só para os mais ricos"), não só o Lamelar. D2 aplicado só ao Lamelar é seletivo, e
o "em casa" ainda usa a fórmula que D2 declara circular, só com outro acesso (~7).
D3: sem contra forte; é COERENTE com D2 (a linha é produção, a fórmula tem escassez). Aceitável.
D4: "produzida em série" (armaduras.json) é o [T] mais forte sobre a Munição, e a proposta a precifica
como avulsa do oficial: 1.700 = 1,57× o avulso do perito (1.080) e 2,5× o lote do perito (690).
Qualquer perito de cidade vende abaixo. O mercado é ancorado no produtor mais barato disponível [I].
D5: a 8 po a Camisa é DOMINADA: a Brigandina (7 po) é melhor em Impacto 4×1, Corte 6×5, Perfuração 3×1,
mesmo Nível (armas-e-armaduras.md:118 × :120). Só a penalidade (−1 × −2) e a classe leve a salvam.
O número está certo pelo método (1,2 × 695 = 834 → 8 po), mas o método escrito ("Cota proposta ×
7/11") é peso → preço direto, proibido pela convenção. Trocar o método; o número fica.
D6: a Transição é "malha com as primeiras placas rígidas" (armaduras.json; legado :196-198) e sai a
2.000, ABAIXO da Malha completa (2.400). Sob H-comp ela custa no mínimo a malha. E ordenar por
estatística (Articulada acima por penalidade menor) contradiz a convenção usada para baixar a Lança
Longa ("estatísticas não entram no preço").

(3) Inversões novas:
- Transição 2.000 < Malha completa 2.400 (contém a malha) [T contra].
- Articulada 2.200 < Malha completa 2.400, com a Articulada melhor em tudo (Imp 4×2, Perf 3×1, pen
  −2×−3; armas-e-armaduras.md:123 × :124); D6 usa estatística só num sentido.
- Maça 230 = Picareta 230 < Martelo 250, mesmo peso e mesma linha: artefato dos dois pesos (1,2 × 1,5).
- Pilum 70 = Lança Longa 70 > Lança 50; o Pilum "fura placa de N2 e entorta ao cravar" (armas-e-armaduras.md:95),
  o que sugere haste de ferro [I], e fica abaixo do próprio avulso.
- Pavês 350 > Kite 250 com o mesmo acesso 5, depois da troca feita em nome do acesso.
- Camisa 800 > Brigandina 700 = Lamelar 700 (dominância, não inversão de processo).

(4) Bloqueios antes de ir ao autor:
B1 Malha completa 18 → 24 po: viola a regra 1 (1.800 ≥ lote 1.796, dentro da faixa); o motivo é
   falso (o custo de lote não depende do preço da Cota); o método é preço × peso.
B2 Lança Longa 9 → 7 pp: viola a regra 1 (1,14×, dentro da faixa).
B3 Hoplon 6 → 9 pp: a 60 ele é 1,5× o avulso da linha (dentro); "único abaixo do avulso sob B" é
   falso em qualquer referência (Broquel: Hoplon 0,27 e Targe 0,35; Heater: 0,75 e 0,86).
B4 D6 (Transição/Articulada abaixo da Malha completa): inversão contra o texto.
B5 D2 só no Lamelar: seletivo; ou vale para todas as Difs de armadura, ou para nenhuma.
B6 Arremesso e Pilum: não seguem o 1,2× declarado; regra de arredondamento indefinida.
Não bloqueio, mas corrigir o texto: método da Camisa; Treinado = ●●; Munição 17 po com a nota de
"série" (D4) exposta ao autor.

Resposta do analista: rodada 6.

---

## Rodada 6 · revisão da proposta depois dos bloqueios · VEREDITO

Proposta reescrita em proposta-precos-f1-f3.md com o texto do analista (versão corrente; a da
rodada 5 fica descrita acima). Aceitos pelo analista: Treinado ●●; B1 (Malha completa 18 po);
B2 (Lança Longa 9 pp); B3 (Hoplon 6 pp); B6 (R-arred, arremesso recalculado); método da Camisa
reescrito; troca Scutum ↔ Pavês desfeita; D4 → R-série na Placa de munição. Regras novas: R-arred,
R-irmão, R-hipótese de peso (B para valores novos), R-série.

(1) Contas [M], reproduzidas: Serrilhada B 210,9 → 253,1 → 250 · Adaga de Arremesso 40 → 48 → 50 ·
Machado de Arremesso 65 → 78 → 80 · Azagaia 64,8 → 65 · Pilum 90 · Maça/Picareta = Martelo (mesmo
peso, mesma linha: custo idêntico, R-irmão válido) · Targe 40 → 48 → 50 · Munição lote 1.196 → 1.435
→ 1.400, perito lote 690 → 2,03× · Gambeson 140 · Couro 130 · Lamelar 700 · Cota 1.300 · Completa
2.600 · Transição (A) 1.538,7 → 1.846,5 → 1.800 · Articulada (A) 1.709,7 → 2.051,6 → 2.100, lote
1.520,6 · Malha completa 1.800 = 0,91× avulso A (1.985,5), acima do lote A (1.796,4). ACEITAS.
[P] R-arred aplicado errado em dois itens: Brigandina 1,2 × 563,3 = 676 → 680 (68 pp), não 7 po;
  Camisa 1,2 × 694,9 = 833,9 → 830 (83 pp), não 8 po. A faixa 100-1.000 pede múltiplo de 10.
[P] R-hipótese de peso contradiz D5 e D6 na mesma rodada. "Custo por kg × kg" escala o custo
  inteiro, Montagem incluída: é H-peso-A, justo o que R-hipótese declara contrário ao texto. Sob B:
  Camisa 751,6 → 902 → 900 (= Peitoral reforçado 9 po); Malha completa avulso 1.857,8, lote 1.753,8
  (1.800 = 0,97×, segue dentro); Transição H-comp 1.751,5 → 2.100; Articulada 1.894,1 → 2.300. A
  ORDEM de D6 sobrevive a B (Transição 1.751 < Malha completa 1.858) [M]; os números não.
Pontos por kg, mesma Dif 8: Cota 14/11 = 1,27, Munição 18/22 = 0,82 (Peça/kg 1,09 × 0,64). "A malha
dá mais trabalho por kg que a placa" confere nas duas hipóteses [M].

(2a) D2. VERIFICAÇÃO NO TEXTO: legado :74 "Ancora: facilidade de obter em cidades medias do
cenario" (o texto diz "do cenário", não "um mercado de referência"; o mercado ocidental é [I] tirado
da nota do Lamelar). Única marca regional de armadura no legado: Lamelar (:113 "bizantino/estepe",
:119-120, :193); grep de Ocidente/Oriente/exótico/casa/estepe/Ásia não acha outra. Parte procede:
"seletivo" CAI, D2 agora é regra para todas e só o Lamelar tem casa ≠ referência.
DIVERGÊNCIA em "contaminação nula por construção": a mesma definição (:72) diz "0 = so para os mais
ricos, raro"; raridade é escassez, e "só para os mais ricos" é preço. E a Munição (:210-212) tem
"ACESSO: ~4 (em vez de 1)" por ser de série: o acesso segue o custo. Logo a cadeia preço → acesso →
Dif → preço existe em casa também; o que o argumento mostra é ausência de escassez REGIONAL, não de
escassez. Nulo é [H], não [I] por construção. O que salva D2 na prática é outra coisa: as Difs de
armadura estão no livro como [T] (acoes-oficio-e-mundo.md:170-176) e a fórmula só em
Acoes_Sistema.md:1181; para precificar vale a linha, venha de onde vier. Não bloqueia.
Consequência que o analista não tirou: se as Difs pela fórmula são de produção para item nativo,
a Placa de transição (acesso 2, sem asterisco, armaduras.json:139) é Dif 10, não 8. Oficial a Dif 10
faz 0,5 pt/semana: a mesma composição sai 7.694 (A) a 8.757 (B), 77 a 88 po; perito 1.184/1.347;
mestre 915/1.041. D2 como defendido e D6 a Dif 8 não fecham juntos.

(2b) D6. A conta sob H-comp confere, e B4 como "inversão contra o texto" CAI: conter malha não
implica mais trabalho se tiver menos malha [M]. Ataques restantes:
- Duas [H] empilhadas: a composição 11 + 7 kg (o analista registrou) e a família das placas. As
  placas vêm da Munição, "produzida em serie, aco pior, ajuste generico" (legado :210), numa peça
  "cara e cavaleiresca" (:196-197). É a placa mais barata por kg disponível. Pela família da Completa
  (perito, 86,4 pc/kg): 1.092 + 605 = 1.697, ainda < 1.985. A ordem resiste às duas famílias a Dif 8;
  só quebra a Dif 10 com o oficial (acima).
- A Articulada não tem acesso nem texto (armaduras.json não tem a entrada); "família da transição"
  vem só das estatísticas iguais (armas-e-armaduras.md:123 × :125), que é usar estatística para
  escolher família, embora não para o preço. Registrar como [H].
- Dominância nova: Transição 18 po = Malha completa 18 po, e a Transição é melhor em Impacto 4×2 e
  Perfuração 3×1, mesmo Corte 8, mesma penalidade −3, 2 kg mais leve (:124 × :125). Ninguém compra a
  Malha completa. Mesma categoria da Camisa: questão de design ao autor, não bloqueio de custo.

(3) Inversões e dominâncias que restam:
- Transição = Malha completa, Transição domina (acima). NOVA.
- Camisa dominada pela Brigandina: 830 × 680 por R-arred (8 × 7 po como escrito); sob B, 900 × 680.
- Targe 50 < Broquel 60 sendo 2,5× mais pesado; o 40 do Targe é a linha SEM escala, contra
  R-hipótese B. Sob B depende da referência: Broquel → avulso 85, lote 76,25, e 50 segue ABAIXO do
  lote (o alerta não se resolve); Heater → 35 / 26,25. "Acesso mais fácil" é a camada adiada, o mesmo
  motivo usado para desfazer Scutum ↔ Pavês.
- Serrilhada = Espada Longa (mais pesada, mais trabalho): empate de arredondamento (253 × 245 a
  1,2×), menor.
- Pilum = Lança Longa 9 pp: não inversão; 90 é piso se a haste for de ferro [I].
- Abertos da Fase 2, não novos: Kite × Heater, Pavês × Scutum.
- Resolvidas: Maça/Picareta × Martelo; Pilum abaixo do avulso; Pavês > Kite; Articulada < Malha
  completa; Transição < Malha completa como contradição de texto.
R-série: "produzida em série" só existe em armaduras.json:162 (grep em src/data e capítulos), então é
regra com uma aplicação; e o lote 3 dela continua [H].

(4) Bloqueios:
B7 · R-arred: Brigandina 680 e Camisa 830, ou a regra muda. Conserto de uma linha.
B8 · R-hipótese B × métodos A de D5/D6: escolher. Ou B vale e a Camisa vai a 9 po, a Transição a
     21 po, a Articulada a 23 po; ou o método por kg da família é exceção declarada a R-hipótese.
Não bloqueiam, vão ao autor como expostos: D2 com "nula" rebaixado a [H] e a Dif 10 da Transição;
D6 com as duas [H] (composição, família das placas); Articulada sem acesso; dominâncias Camisa e
Malha completa; Targe sem referência de peso declarada; sensibilidade da Munição (2,0× o perito).
Livres para o autor: toda a Fase 1, a Fase 2 (com a nota do Targe), e na Fase 3 Gambeson, Couro,
Lamelar, Cota, Munição, Completa, Peitoral, Reforçado, Malha completa.

Resposta do analista: rodada 7.

---

## Rodada 7 · B7, B8 e fechamento · VEREDITO: SEM BLOQUEIO NOVO

B7 ACEITO (Brigandina 68 pp). B8: "B vale para tudo". Contas [M]: Camisa 751,6 × 1,2 = 902 → 900 ·
Transição 1.751,5 × 1,2 = 2.101,7 → 2.100 · Articulada 1.894,1 × 1,2 = 2.272,9 → 2.300 · Malha completa
0,97× (lote 1.754). Dominância Transição = Malha completa desfeita (21 > 18 po). ACEITAS.
Targe ref. Hoplon: 5 × (2 + 6 × 2,5/7) = 20,71; lote 11,96; 30/20,71 = 1,45× [M] ACEITO. Heater: 35 /
26,25 (dentro); Broquel: 85 / 76,25 (abaixo). Duas de três referências dentro; o princípio "alerta
dependente da referência não muda" é o mesmo que manteve a Camisa como robusta. ACEITO.
Transição Dif 8 pelas partes: ACEITO como escolha [E] exposta (usa as linhas [T] que existem).
Lista final conferida contra o catálogo (catalogo-unificado.md:21-52, 64-76, 87-93): bate item a item.

Achados desta rodada, corrigidos no arquivo final e expostos (não bloqueiam):
[P] B para tudo muda o Peitoral: pela Munição sob B o Piso de 3 semanas trava, avulso 585, lote 302,5,
  280 = 0,93× o lote (abaixo); pela Brigandina 390 / 235,9, 0,72× / 1,19× (dentro). O "1,1× nas duas
  famílias" era A. Pela regra de D1 (alerta dependente da referência) fica 28 pp. Reforçado sob B:
  Munição 1.007 / 799, Brigandina 804 / 717, 900 dentro nas duas.
[P] AUTOCORREÇÃO: não apontei nas rodadas 4-6 que a Brigandina domina a Cota (Imp 4×1, Perf 3×1, Corte
  6 igual, pen −2 igual, média as duas, 9 × 11 kg; armas-e-armaduras.md:119 × :120), agora a 68 pp
  contra 13 po. O Lamelar também. Na rodada 4 li "sobre malha" (legado :187) como vestir por cima; se
  as estatísticas da Brigandina supõem a malha por baixo, é questão do autor. Exposto.
Arquivo final: proposta-precos-f1-f3.md reescrito no formato pedido (tabelas atual → proposto, motivo,
classe; regras e decisões com prós e contras; 10 pontos expostos). Impresso na resposta.

Próximo: parecer do revisor externo e decisão do autor.

Anexo para o revisor externo (pedido do Neves, ajustes 1-3 aceitos): lore/economia/anexo-auditoria-f1-f3.md,
só dados literais com arquivo:linha, gerado por script a partir das fontes (tabela de fabricação,
pesos e preços, estatísticas, acessos, regras textuais, Renda, legado). Linha "Nenhuma" da tabela de
armaduras omitida (tem travessão e não é usada).
Seção 6 acrescentada (descrições usadas como motivo): armas.json:530 e :959, armaduras.json:140 e :162,
escudos.json:146, armas-e-armaduras.md:83-84, :87, :95, legado :196-198. "Arma cara" está no JSON; o
capítulo diz "caro".

---

## Rodada 8 · auditoria externa (nenhum erro de conta; 4 bloqueios de redação, 2 menores) · APLICADA

Seis mudanças aplicadas em proposta-precos-f1-f3.md: R-ref com tabela; marca "piso condicional a
H-comp (G25)" em Azagaia, Pilum, Transição e Articulada; D2/D6 com a fórmula 12 − acesso fora de peça
sem linha; rótulo da Dif 11 trocado (aqui em Adiados e na Base de cálculo da proposta, onde o rótulo
não existia e foi acrescentado); R-arred em faixas < 100 · 100 a 999 · ≥ 1.000; R-irmão como igualdade.
Contas [M] conferidas: nenhum valor 1,2× cai em fronteira do R-arred (48; 78; 64,8; 90; 253,1; 138;
133,7; 676; 702; 902; 1.310; 1.435; 2.102; 2.273; 2.592): zero diferença entre as duas redações.
Completa perito 1,5 × 6 × 240 = 2.160. "85" não existe no repositório (capítulos, Acoes_Sistema.md,
lore/economia): marcado como número do analista.

Preços que mudam [M], por R-irmão como igualdade (varredura por script: mesma linha, mesmo peso, mesmo
custo de modelo): Espada Serrilhada 25 → 32 pp (irmão Maça Estrela, :160, 1,5 kg, B 210,9); Pilum 9 →
5 pp (irmão Lança, H-comp, 2 kg, 75). Maça e Picareta × Martelo já estavam. AUTOCORREÇÃO: os dois
pares valiam desde a redação antiga do R-irmão (rodada 6) e não os apontei nas rodadas 6 e 7. Saída
exposta: cravos ou haste de ferro contados como custo desfazem os pares.

Correções na tabela R-ref, conferidas nas linhas:
- :154 é "Porta, banco, mesa tosca, cerca de 20 m"; não nomeia haste. Usá-la para a haste é [H].
- "haste da Lança, 2 kg" errado: 2 kg é a Lança inteira (catalogo-unificado.md:28). Lança = ponta
  :157 sem escala (6 + 3) + haste :154 sem escala (2 + 4) = 15 pts = 75; lote 40. Azagaia escala as
  duas partes por 0,8/2.
- :160 nomeia "machado de guerra" além de "espada". Se for o Machado do catálogo, sem escala: custo
  204,3, 3 po = 1,47×, inversão some, corte sem motivo. E a razão do Machado depende da referência
  espada: Curta 0,9 kg dá 1,28× (dentro); Longa 1,57; Serrilhada 1,62. Motivo reescrito: a inversão
  (mais leve, mesma linha) é robusta a qualquer referência única. Sabre (1,55/1,82/1,86), Martelo
  de Guerra (2,71/3,61/3,76) e Machado Pesado (1,90/2,58/2,69) resistem às três espadas.
- :157 nomeia "machado": sem escala, Machado de Arremesso 45 → 55 pc (exposto).
- :161 nomeia "besta": motivo das bestas passou a [H] [P], retidas por D1.
- Famílias: a linha é [T], pertencer à família é [H]; separado na tabela.
D1 mantido amplo (vale para referência [H] e família alternativa): se protegesse só a indeterminada,
o Peitoral subiria a 7 po pela Munição. Exposto.
D2: citação literal do legado :72 ("0  = so para os mais ricos, raro"), escala que vai a 0; a
Transição tem acesso 2 (armaduras.json:139). [P] exposto: o Lamelar em casa (Dif 5 = 12 − 7) é o único
lugar em que a fórmula vence a linha (:172, Dif 9), ao contrário de D3.
Proposta: pontos expostos 9 reescrito, 11 e 12 novos. Arquivo final impresso na resposta.

---

## Rodada 9 · forma no R-irmão e Machado por D1 · APLICADA

R-irmão com restrição de forma e sem copiar motivo próprio: Espada Serrilhada 32 → 25 pp (1,2 × 210,9
= 253,1 → 250); Maça = Martelo 25 pp, com apoio [T] ("mesma anatomia da Maça", armas.json:1073);
Picareta de Guerra FORA (armas.json:236 "bico concentrado (N2)" e "lado do martelo": cabeça de ponta,
não só de impacto; a lista de formas do analista não tem "cabeça de ponta"): 1,2 × 197,7 = 237,2 → 240
= 24 pp. Pilum = Lança 5 pp mantido (haste com ponta; Lança sem motivo próprio).
Machado 22 pp → 3 po por D1; inversão com a Espada Longa vira exposto 12 (gatilho seria regra nova).
Conferência pedida [M], B, razão do preço ANTIGO com as três espadas (Curta 0,9 / Longa 1,4 /
Serrilhada 1,5): Sabre 1,55 / 1,82 / 1,86; Martelo de Guerra 2,71 / 3,61 / 3,76; Machado Pesado 1,90 /
2,58 / 2,69. Os três resistem sob B. Margem fina no Sabre (1,55 com a Curta). Sob A (só
sensibilidade), Machado Pesado com a Curta dá 1,17, dentro. Nenhuma outra arma dependia de inversão.
Achado [P], não aplicado: a alta da Placa articulada (14 → 23 po) depende da família. Transição: lote
1.582 (abaixo); Malha completa 20 kg: lote 1.754 (abaixo); Munição sozinha 20 kg: avulso 1.305, lote
1.097, 1.400 = 1,07×, dentro. Por D1 (família alternativa) a alta não é robusta. Exposto no ponto 5;
decisão do analista/autor.

---

## Rodada 10 · só redação · APLICADA

Rodada 9 já estava aplicada. Quatro mudanças: R-irmão herda condicionalidade (Pilum: igualdade
condicional a H-comp, como o custo da Lança); R-ref (1) "EXPLICITAMENTE" e (2) "ESCOLHIDO", com a
regra marcada em cada linha da tabela (marcial e arremesso = regra 2; Arco Longo, ponta de lança e
armaduras com linha própria = regra 1; Escudo = regra 3); Machado "PERMANECE em 3 po", retenção e não
resultado da regra, no motivo e no exposto 12; R-irmão "mesmo peso DECLARADO no catálogo (igualdade
exata)": Maça 1,3 = Martelo 1,3 (catalogo-unificado.md:26 e :48), Pilum 2 = Lança 2 (:45 e :28).
Conferência por script: as 55 colunas "atual → proposto" idênticas antes e depois. Nenhum preço mudou.
Travessões: 0. Próximo: decisão do autor (inclusive a Articulada, exposto 5).

---

## Fases 1-3 FECHADAS (25/09/2026)

Proposta final: lore/economia/proposta-precos-f1-f3.md (versão da rodada 10). Enviada ao Arquiteto
para aplicação. Pendente só o que está nos pontos expostos, entre eles a Articulada (exposto 5).

## Etapa A · munição, equipamento de aventura, mercadorias, decisões pendentes da moeda

Rodada A1 (levantamento, sem análise), feito. Fontes lidas:
- Intervalos: acoes-e-sistema.md:133-148; Acoes_Sistema.md:207-218 ("de dez a sessenta vezes");
  relacoes-sociais.md:215 ("de 8 a 24 vezes"); acoes-oficio-e-mundo.md:131 (Apressar, "Dobrar as
  horas"); custo-de-servico-e-itens.md:53 (semana de trabalho 6 dias). Nenhum número de horas por
  dia de trabalho.
- Escala de horas: acoes-oficio-e-mundo.md:137-148 (= Acoes_Sistema.md:1234-1245, que diz "Ferraria"
  e "Culinária" onde o capítulo diz "Ferreiro" e "Gastronomia"). Improvisar tocha: :198.
- precos.json:1-53 (41 itens, 7 pacotes; somas conferidas em Python, batem com
  custo-de-servico-e-itens.md:427-433).
- municao.json:1-44 (Flechas (10) e Virotes (10), 10 pc cada); capítulo custo:175-176 (1 pp). Nenhum
  texto sobre perder, recuperar ou quebrar flecha/virote; "gastar munição" armas-e-armaduras.md:51;
  Machado de Arremesso "Recuperável" armas.json:758.
- Itens Gerais: custo-de-servico-e-itens.md:319-337 (100 g; drogas por dose).
- Qualidade: custo:57-76 (3×/6×/10×) e :125 (Machado 1,5×/3×/5×); acoes-oficio-e-mundo.md:68-83 e
  Acoes_Sistema.md:1108-1126 ("Preço dobra").
- Distância: custo:292-300 (milhas); lore/mapas/CARTOGRAFO.md:1037-1068 e :1131-1132 (km; "o Centelha
  ainda não tem regra própria de km por dia"); DECISOES-A-REVISAR.md:23-24.

---

## Etapa A · Rodada A2 · mercadorias e custo de vida · VEREDITO

Arquivos do autor copiados de Downloads para lore/economia/ (fora do git): proposta-mercadorias.md,
mercadorias.proposta.json, gerar_mercadorias.py. Script rodado numa cópia no scratchpad (ele grava
no diretório corrente e sobrescreveria o JSON do autor).
(1) Reprodução: JSON gerado = JSON enviado, conteúdo idêntico (json.load igual). Bytes diferem só no
fim de linha: o script grava com open(..., "w") e sai CRLF no Windows (2.187 CRLF); o enviado é LF.
[P] menor: usar newline="\n" (regra do CLAUDE.md). REFERENCIA_MONTARIAS é definida e nunca gravada.
(2a) Calibração 1 d = 8 C. Das 34 comparações MtD × Hodges que as próprias notas permitem, 20 dão
exatamente 8,00: a MtD converteu Hodges por ×8. A conferência é circular para esses itens (MtD compila
Hodges, FONTES). Dos quatro "que batem", o queijo dá 10,0 (5 C contra 0,5 d/libra): 25% fora. Fora do
8: ganso 9,33, boi 7,63, ovelha 8,53, carneiro 10,1, pimenta 3,75 ou 15 conforme a data, pá 16. Um
quinto item independente exige fonte fora da MtD/Hodges (Clark ou Rogers, ex. trigo); não há no
repositório. Trigo MtD 75 C = 6s 3d o quarter: compatível com o que lembro de Clark, NÃO conferido.
(2b) 17 itens C: 15 Derivado + 2 MtD. [P] Linho comum é Derivado com confiança B (contra a própria
definição de C). Contas: pão e pão grosso ACEITOS (grão 0,347 e 0,256 d/kg); tenda, marreta, sino,
arroz ACEITOS como [H]; carne: vaca 113 d / 0,65 = 174 kg de carne (alto), porco 37-55 kg (ok);
carvão: "30×" é 15,4× (1,4 d/lb = 3,09 d/kg contra 0,2), e 0,2 d/kg paga só a lenha (~5 kg), sem a
queima; óleo: 4,4 d/kg é o preço da VELA de sebo, o sebo da tabela é 7,44 d/kg (daria 3,4 d → 25 pc);
roupa pobre 50 pc < 1 jarda de burel 55. Dia de artesão implícito nos derivados de ferro (ferro 1 d/lb):
corrente 5,46 d, gancho 5,39, algemas 7,80, marreta 10,16, cadeado 4 a 8: de 2,7× a 6,8× o braçal, sem
salário único. O oficial do jogo (H-×20) é 2,17× o braçal.
(2c) Renda: Livre/Renda fica entre 0,140 e 0,200 nas NOVE faixas (média ≈ 1/6). Leitura melhor: taxa de
poupança proporcional, com o custo de vida escalando com a renda (o próprio capítulo, :55). "Dízimo"
não existe no repositório (só na proposta). Destreinado "entre as cestas" não é teste; Especialista
fecha com parâmetro livre (125). Braçal: família 54,4 > custo 50; com linho no lugar do burel a cesta de
subsistência cai de 15,2 para 12,6 pc/semana e a família para 46,6 (cabe).
(2d) Incoerências: sebo 44 pc/kg > vela de sebo 29; cera 121 > vela de cera 99; manteiga 9/lb com o
leite de uma libra a ~24; queijo 4/lb com o leite a ~11; roupa pobre < 1 jarda de burel; tecido da
cesta de subsistência (175 pc/ano) > da respeitável (109); saco de dormir 10 < lençol 25; ração de
viagem 5/dia > comida inteira da cesta respeitável (2,96/dia) e > 3 rações da estalagem (3); martelo 55
> machado de lenhador 35 (datas 1514 × 1457); "Mel" em Bebidas por galão (hidromel?). "Aventureiro
gasta 2-3 semanas": o pacote Aventureiro a preços do JSON dá 489 pc = 8,2 semanas de braçal.
(3a) precos.json NÃO tem esquema zod: não é coleção do Astro (content.config.ts) nem entra no S do
validate-data.mjs. Leem-no só scripts/precos.mjs e scripts/gen-lista-equip.mjs (usam id, nome, pc).
(3b) Colisões com precos.json: cobertor, bau, mochila, tocha, lanterna-coberta, martelo, pe-de-cabra,
saco-dormir, piton, sabao, sino (11); martelo também com armas.json. Fora do catálogo: mesa
(regras.json), corrente (efeitos.json).
(3c) Com linha de fabricação: pregos, gancho (:141), corrente (:142), cataplasma (:146 emplastro),
mesa, banco (:154), botas (:158), bau, bau-bom (:159 arca), machado-lenha, machadinha-ferramenta
(:157 machado), cadeado (:163 fechadura), livro (:147 página, por página). Escala de horas sem horas
por dia definidas (A1): pregos, gancho, corrente, cataplasma e livro não têm preço pela tabela ainda.
Pela tabela (H-×20) botas 111 e baú 102 contra 40 históricos (2,5-2,8×).
Complementos da rodada A2 (depois da consulta):
- Datas das notas de Hodges: o ×8 exato aparece antes e depois de 1350 (vela de sebo 1338, porco
  1338, roupa de artesão 1285-1290; machado 1457, lã fina 1380, vela de cera 1406, ferramentas 1514):
  é a unidade da MtD. Mas das 12 ferramentas com data, 10 são de 1457 a 1514: preço pós-Peste contra
  salário de 1300-1340 (ponto aberto 2 do autor, agora contado). Entre os A: congro 1422-1423, botas
  anos 1470. Quinto item independente: não existe no repositório; precisa de série de Clark ou Thorold
  Rogers. (Retirei do veredito o trigo de memória.)
- Misto cruzado: pela tabela (H-×20, avulso) botas 111 contra sapatos 40 (lista); baú 102 contra
  cofre 75; banquinho 30 contra cadeira 20; cadeado pela :163 (perito) 168 contra algemas 65. [H], e
  não [T]: o "gancho" da :141 (Peça 1, gancho pequeno) e a "Fechadura" da :163 (fechadura de
  segredo, Req 5) não são claramente o gancho de escalada e o cadeado.
- Colisões, dois tipos. Mesmo item, preço em conflito: mochila, tocha, bau, lanterna-coberta,
  pe-de-cabra, saco-dormir, piton, sino. Mesmo id com objeto diferente: cobertor (5 pc × "Cobertor
  bom" 100), sabao (barra 2 pc × libra 13), martelo (ferramenta × arma de armas.json). Mesmo item com
  id diferente: odre/cantil, pederneira/caixa-fogo, racao-viagem/racao-dia, papel/folha-papel,
  pergaminho/folha-pergaminho, lamparina/lampada, lacre/parafina, porta-pergaminhos/caixa-mapas,
  vestes-oficiais/vestes, roupa-fina/roupas-finas, oleo-lamparina/frasco-oleo, livro/livro-estudo,
  vela-sebo/vela. Sem id duplicado dentro do JSON.
- 3d, sem correspondente no JSON: de precos.json kit-refeicao, linha, esferas-metal, faca-pequena,
  kit-disfarce, fantasia, vidro-tinta, caneta-tinteiro, saquinho-areia, vidro-perfume, caixa-esmolas,
  bloco-incenso, incensario (13). Do catálogo: estalagens e refeições (fora do esquema de item por
  decisão, leitura-de-novato-decisoes.md:44-45), cerveja ruim, vinho ruim, frutas frescas, roupas
  Viajante, Entretenimento e Robe, prata, ouro, "temperos" genérico, drogas barata e cara, alforje,
  burro e cavalo de criação (só em REFERENCIA_MONTARIAS, que não é gravada). Montarias, veículos,
  viagens e escravos ficam fora desta etapa.
- Formato: decisão anterior existe. leitura-de-novato-decisoes.md:46-56 (arquivos separados por
  categoria; tipos geral/comida/roupa/montaria/veiculo/servo em arquivo próprio ou num de "itens não
  combatentes"; precos.json deixa de ser a fonte; pacotes vão para pacotes-equipamento.json) e
  :690-715 (envelope aninhado, "itens em geral" e "serviços" no estilo estruturado).
- Linho no lugar do burel na cesta de subsistência: 12,6 pc/semana; Miserável 13, Pobre 20 (eram 15 e
  25); família do braçal 46,6.
Vereditos: §1 [P] · §2 ACEITO · §3 [P] (óleo corrigir 13 → 25) · §4 [P] ("2-3 semanas" é 8,2) ·
§5.1-5.3 [P] · §5.4 BLOQUEIO (conclusão apoiada em dízimo inexistente) · §6 ACEITO · §7 [P].

---

## Rodada A3 · proposta completa das Etapas A, B e C · VEREDITO

Arquivos (fora do git): lore/economia/etapas-abc/ com revisao-economica-etapas-abc.md (idêntico ao de
Downloads, cmp), economia-etapas-abc.zip e o conteúdo dele (7 JSONs, base.py, mercadorias.py,
modelo.py, gerar.py). Script do revisor: scratchpad abc/a3.py.
(1) gerar.py numa cópia: os 7 JSONs saem BYTE-IDÊNTICOS (cmp; o script já grava newline="\n"). As 24
tabelas geradas (tab_*.md) estão todas, literalmente, no documento.
(2a) B2 BLOQUEIO de redação (a conta passa). Curva reproduzida: V7 = 130/3,5 = 37,14; V11 = 334,3/5 = 66,86; empates exatos nas
fronteiras (soma 6: Dif 4 = Dif 7 = 130; soma 9: Dif 7 = Dif 11 = 334,3). O oficial fica em 130, então
nenhum preço das Fases 1-3 feito pelo oficial muda. MAS: (i) "produtor mais barato ... é a mesma regra
T3/T3-F" cita errado: T3 = oficial da tabela, T1 (menor capaz) só sensibilidade (este arquivo :47-48;
D4 da proposta-precos-f1-f3.md:107). (ii) Dif 8 fica fora das três faixas: perito a 334 custa 41,8 por
ponto contra 52,0 do oficial. Pela regra escrita no B2 o perito vira o produtor de Malha completa
(1.504 × 1.858, preço fica 18 po), Transição (1.504 com Piso 3 [H], 1.407 sem; × 1.751) e Articulada
(1.522 × 1.894). A Munição NÃO se move: R-série fixa o lote do OFICIAL (proposta-precos-f1-f3.md:77).
Pela T3, os itens ROBUSTOS de Dif 8 pagam ao perito até 334 (Cota 241, Malha completa 333, Munição
avulsa 259): a curva fecha. Só itens não robustos pagam mais (Articulada 421, Munição em lote 406,
Transição 389; H-comp :205-206, exposto 5, lote 3 [H]); V11 78 a 84 por eles é [I] sobre [H].
(2d) B8 [P] condicional. Só a Placa completa usa o perito (proposta-precos-f1-f3.md:207); Transição
(:205) e Articulada (:206) são do oficial (1.751 e 1.894 conferidos); nada pelo mestre. Com o B2
corrigido para T3, 36 po é o único preço que muda. Se o autor adotar "mais barato" como regra,
Transição 21 → 17-18 po e Articulada 23 → 18 po, e a ordem Malha < Transição < Articulada some.
BLOQUEIO de redação vai para a frase do B2.
(2b) B5: fórmula do Livre reproduz as 9 linhas; pacotes conferem. [P] rótulo do nível contra o pacote
(Especialista e Doutor têm casa de mercador, criados e cavalo, que é o nível Abastado da C4, e o
rótulo diz Confortável); B7 não diz quanto se poupa ao viver um nível abaixo (família da faixa de
baixo ou nível por pessoa); libras por ano em 48 semanas (432 d) contra 411 d da C4 (365 dias).
(2c) E1 [P]. §7.5 literal em Acoes_Sistema.md:1108-1120 e acoes-oficio-e-mundo.md:78-83; citação
"nenhum modificador abre a porta" em acoes-oficio-e-mundo.md:22. Tabela reproduzida. O "10×" do
capítulo é Relíquia (custo-de-servico-e-itens.md:70, "vale o mesmo que uma Ótima", :74), não
Excepcional. Tirar o degrau contraria acoes-oficio-e-mundo.md:98 e muda o gabarito :89-96 (Ótima
6,3 → 1,03 semana; Excepcional ~15 → 2,47); a E7 não lista esses trechos.
(2e) 54 itens C (52 Derivado, 2 MtD). Contas reproduzidas. [P]: ração de viagem (ingredientes 3,71 >
3); linho comum (camisa de 8 d fecha com ~2 d/jarda, não 3); peixe fresco (nota "entre arenque e
carne" falsa: 0,5 < 0,65 < 1,0 d/kg); óleo (nota "abaixo do sebo por litro" falsa: 3,0 × 2,38 d/L);
incenso (nota 2s/libra dá 18 pc, preço 10); saco de dormir (1 jarda² = 0,84 m²; com 2 jardas² sai 100
> cobertor 65); fantasia = roupa usada; cadeado abaixo do lote da própria linha nova. Animais: cavalo
de guerra 11.200 < corcel 16.000 + adestrar 5.300; potro = cavalo de tração (1.300 os dois); burro 670
> cavalo de carga 600; carroça e barco de pesca têm linha (acoes-oficio-e-mundo.md:173): 1.600 avulso.
(3) Pacotes com mercadorias.json: Artista 360 → 552 · Assaltante 186 → 540 · Aventureiro 110 → 394 ·
Diplomata 1.068 → 1.091 · Estudioso 382 → 1.377 · Explorador 85 → 316 · Sacerdote 149 → 800 (com o
mapa da E6 mais corda-canhamo → corda). Pela busca direta faltam martelo e corda-canhamo; pelo mapa
da E6 (martelo → martelo-ferramenta) falta só corda-canhamo (Assaltante, Aventureiro, Explorador); a
nota da corda diz "Mantém o id do catálogo" e o id é corda. Saltos: Sacerdote por vestes 50 → 480,
Estudioso por livro-estudo 250 → 1.200 (conferir se as entradas da MtD são o mesmo objeto).
Mais: A2.3 cria linha de fabricação calibrada no preço histórico, contra :57 deste arquivo ("nunca
calibrar pelo preço"); o cadeado abaixo do lote da própria linha é sintoma. A3.6 diz que prata e ouro
ganharam preço: nenhum id no mercadorias.json (só a prosa da A4); drogas nem aparecem. Manteiga: "~1,1
galão" por libra é metade do real (~2,2); o teste passa assim mesmo (6,6 < 9), [P] menor.
(4) E7: citações conferem (Acoes_Sistema.md:216; relacoes-sociais.md:215; custo:39-49; :63-70; :125;
:325-335). [P] Minuto = "dezenas de segundos" (Acoes_Sistema.md:210), o capítulo publicado já tirou o
parêntese (acoes-e-sistema.md:146), e "oito" não vale com a jornada leve de 5-6 h (G45); fórmula
também em Acoes_Sistema.md:1318; lista sem Recursos, escravos, viagens, montarias, roupas, rações.
Outros: B4 "vila absorve até soma 9 (330)" com teto 300 [P]; B1 "três faixas" são duas [P]; C7 cópia
simples 4 contra a própria nota (7 a 8) [P], soldo por dia corrido contra diária por jornada [P]; E2
omite "A Montagem se paga igual" (acoes-oficio-e-mundo.md:190) [P]; E5 bolsa de 4 semanas não compra
pacote nenhum até o Especialista [P]; E6 envelope atual recusa os 190 (descricao, blocos nulos,
mercadoria) e os 44 (tipos animal e arreio, sem peso, _procedencia) [P].
Vereditos: A1 ACEITO · A2 [P] · A3 [P] · A4 ACEITO · B1 [P] · B2 BLOQUEIO (redação: a frase "produtor
mais barato ... T3") · B3 ACEITO · B4 [P] · B5 [P] · B6 ACEITO · B7 [P] · B8 [P] condicional · C4 ACEITO · C5 [P] · C6 ACEITO · C7 [P] · C8 ACEITO · E1 [P] ·
E2 [P] · E3 ACEITO · E4 ACEITO · E5 [P] · E6 [P] · E7 [P].
Reconferida em sessão nova (pedido repetido): Downloads = cópia (md5 do .md e do .zip iguais);
gerar.py numa cópia limpa, 7 JSONs byte-idênticos (cmp); a3.py roda com os mesmos números; pacotes
recalculados de novo (direto: faltam martelo e corda-canhamo; E6: falta corda-canhamo; E6+corda: os
totais acima); citações de B2 (:178), B8 (proposta-precos-f1-f3.md:205-207) e E1 (acoes-oficio-e-mundo.md:22,
:78-83, :98; custo:70, :74) conferidas. Nenhum veredito mudou.

---

## Etapa D · Rodada D1 · auditoria final v1+v2, antes da implementação · VEREDITO

Arquivos (fora do git): lore/economia/v2/ com revisao-economica-v2.md (cmp = Downloads, byte-idêntico) e
economia-v2.zip (13 arquivos). gerar.py numa cópia: os 8 JSONs saem BYTE-IDÊNTICOS (cmp) aos enviados.
Scripts do revisor: lore/economia/v2/ids_check2.py, carroca.py.

**(1) Pendências da A3 confirmadas fechadas pela v2 (§0 da v2, G47-G70):** martelo/corda-canhamo nos
pacotes (E6, conferido: os 7 totais recalculados batem exatamente com os declarados em
pacotes-equipamento.json); nível de vida do Especialista/Doutor corrigido para Abastado (B5); rações
recompostas (E4); cavalo de guerra/potro/burro corrigidos (C5); qualidade reescrita sem "intervalo sobe"
como divergência nova: ver (3f) abaixo, achado importante.
**Seguem ABERTAS** (não tocadas pela v2, continuam valendo o veredito da A3): B2 BLOQUEIO de redação (a
v2 não reproduz o parágrafo corrigido em lugar nenhum: G50 diz "redação corrigida" mas o texto não
está em revisao-economica-v2.md nem nos JSONs; não dá para conferir se a frase "é a mesma regra T3/T3-F"
foi mesmo trocada); B8 condicional (Transição/Articulada pelo oficial ou pelo mestre); a inconsistência
de escravo especializado sem correspondente na v1; C7 "soldo por dia corrido" (G66, redação, conta não
verificada aqui por falta de tempo).

**(2) Achado novo, não estava em nenhuma rodada anterior: duas réguas de salário coexistindo sem
reconciliação [P].** `modelo.py`/`gerar.py` da v2 usa DUAS fórmulas de salário diferentes para a mesma
Habilidade, sem nenhuma nota cruzando as duas:

- **Fabricação** (munição, as duas linhas novas de A2, e por herança as Fases 1-3 já aprovadas em
  `b475ab4`): `salario_x20(soma)` = (média − 4) × 20, LINEAR. Base do preço de toda peça com linha de
  fabricação.
- **Serviço contratado** (C7, `servicos.json`, `renda_ficha` em `base.py`): a curva CONVEXA de B2
  (V4=20, V7≈37,14, V11≈66,86 por ponto-semana), a mesma que está com BLOQUEIO de redação desde a A3.

Conferido em Python (`diaria(soma)*6` contra `salario_x20(soma)`):

| Soma | Convexa (C7)/sem | Linear (fabricação)/sem | Razão |
|---|---|---|---|
| 6 | 130,0 | 130,0 | 1,00 |
| 8 | 260,0 | 200,0 | 1,30 |
| 9 | 334,3 | 240,0 | 1,39 |
| 10 | 434,6 | 270,0 | 1,61 |
| 11 | 568,3 | 310,0 | 1,83 |
| 12 | 668,6 | 340,0 | 1,97 |

As duas réguas coincidem exatamente em soma 6 (onde as faixas de Dificuldade 4 e 7 ainda não se separam
no B2) e DIVERGEM a partir de soma 8, chegando a quase o dobro no soma 12. Consequência: pela v2, um
perito (soma 9) ganha 39% mais alugando o próprio trabalho como "Perito (soma 9)" avulso (C7) do que
fabricando peças de Dif 7 pela tabela do ofício (munição, e por extensão as armas e armaduras das Fases
1-3, aprovadas com a régua linear). Um mestre (soma 12) ganha quase o dobro. Isso é o argumento oposto
ao que a própria B2 usa para se justificar ("o oficial só faz espada se render o mesmo que o serviço
simples"): aqui o serviço simples de Dif mais alta paga MAIS que fabricar a peça de mesma Dificuldade,
então o artesão racional abandona a bancada. Nenhuma nota da v2 assume as duas réguas conscientemente;
parece um resíduo do B2 nunca ter sido levado às Fases 1-3 quando elas foram fechadas (rodada 7-10,
antes da v2 existir). Vai para o autor: ou B2 se aplica também à fabricação (e as Fases 1-3 precisam ser
revistas outra vez), ou C7 usa a régua linear (e os `servicos.json`/`aulas` recalculam), ou as duas
convivem por design e o livro precisa dizer por quê um perito fabrica por menos do que aluga o próprio
tempo.

**(3) E1, Qualidade: a v2 NÃO diverge do livro atual no ponto que v1 tinha mudado [I], achado positivo.**
Conferido: `acoes-oficio-e-mundo.md:74` já tem a régua Sucata/Tosca/Comum/Boa/Ótima/Excepcional com
"intervalo sobe um degrau a cada dois graus" (:98). A v2 (§1.2) diz "o intervalo fica... como hoje no
texto": isso DESFAZ a mudança que a v1 tinha proposto (tirar o degrau, entrar um Piso de 6/12
intervalos) e volta ao texto atual. Logo, ao contrário do que a v1 dizia (E1 [DIVERGE] no multiplicador
E no degrau), a v2 diverge SÓ no multiplicador (preço fixo 5×/30×/70×, e não "dobra") e no Requisito
máximo 6. Conferido em Python (`qual2` de `modelo.py`, PERFIS_Q = soma 6/9/9/12): os números batem com
a tabela do §1 da v2 (Espada Ótima 30,4× régua ≈ 74 po declarado; Placa completa Ótima: 810 semanas,
~15 anos, EXATAMENTE o número que a v2 cita em prosa no §1.3). Ou seja a v2 reabriu, conscientemente e
por decisão do autor ("por enquanto fica"), o mesmo problema numérico que a v1 tinha resolvido tirando o
degrau (Placa completa Ótima inviável para um mortal). Não é erro de conta; é uma escolha diferente da
v1, e como o livro JÁ tem o degrau, a mudança de texto fica pequena (só o multiplicador e o Requisito
máximo), o que é bom para a implementação, mas precisa estar registrado que a v2 abandonou a solução
do Piso da v1.

**(4) Renomear "Excepcional" → "Excelente" (E1, ponto 1) colide com outro sentido da mesma palavra
[P].** "Excepcional" aparece em DOIS vocabulários sem relação no repositório: o grau de qualidade
(`acoes-oficio-e-mundo.md:74,85,96,98,113`; `Acoes_Sistema.md:1126,1130,1147,1152,1174`;
`acoes-e-sistema.md:46`), ESTE é o que a v2 quer renomear, e o degrau da escada de Dificuldade
("25 = Excepcional", `acoes-e-sistema.md:24`, `coracao-do-sistema.md:71`, `virtude-jogada.md:40`,
`Acoes_Sistema.md:68,529,545`), que é um conceito diferente (dificuldade de uma jogada, não qualidade de
item) e NÃO deve mudar de nome. Um `sed`/busca-e-substitui cego por "Excepcional" pega os dois. A lista
de implementação abaixo isola os arquivo:linha certos.

**(5) Pacote inicial (E5/E5-v2) piora com a curva D, não melhora [P], atualiza a A3.** A A3 já achava
que a bolsa de 4 semanas de Livre não comprava pacote nenhum até o Especialista. Com a curva D (G52,
Livre 12%→2%, mais apertada que a curva anterior 20%→7%), o quadro piora: recalculado com
`renda.json`/`pacotes-equipamento.json` da v2:

| Faixa | Livre/sem | Bolsa (4 sem) | Pacote mais barato (Explorador, 336) cabe? |
|---|---|---|---|
| Braçal | 7 | 28 | não (12% do preço) |
| Destreinado | 10 | 40 | não |
| Treinado | 19 | 76 | não |
| Especialista | 30 | 120 | não |
| Doutor | 40 | 160 | não |
| Abastado | 55 | 220 | não |
| Rico | 85 | 340 | sim, só o Explorador (336) |
| Aristocrata | 110 | 440 | Explorador, Sacerdote (384), Aventureiro (394) |
| Nobreza | 200 | 800 | todos menos o Diplomata (1.068) |

Com a curva D, a bolsa de 4 semanas só compra QUALQUER pacote a partir do Recursos 4 (Rico), contra
"até o Especialista" que já era ruim na A3. G69 diz "regra fechada, com os sete pacotes", mas o número
que fecha a regra (4 semanas) não foi reconferido contra a curva nova. Fica para o autor: aumentar a
bolsa, ou aceitar que o personagem novo começa endividado/mal equipado nas faixas baixas (o que pode
ser a intenção, dado o tom do resto da v2 sobre "o começo de campanha fica mais caro").

**(6) Ids:** nenhuma colisão NOVA entre os 4 arquivos novos (`mercadorias.json`, `montarias-veiculos.json`,
`servicos.json`, `pacotes-equipamento.json`) nem entre eles e `armas.json`/`armaduras.json`/`escudos.json`/
`municao.json`/`regras.json`/`efeitos.json`/`antecedentes.json`/`racas.json` (script `ids_check2.py`).
As três colisões que aparecem (`linha`×regras.json, `mesa`×regras.json, `corrente`×efeitos.json) já
eram conhecidas da A3 e continuam sem id trocado (decisão pendente do Arquiteto, não é ids duplicados
dentro do mesmo array).

**(7) Reparo, pacotes, munição e reparo_v2 reproduzidos em Python e batem com a v2 palavra por palavra**
(6%/33%/67%, 8%/33%/67%, 13%/33%/67%; os 7 totais de pacote; a linha de munição). `E2` contradiz
`acoes-oficio-e-mundo.md:190` ("A Montagem se paga igual") de propósito (G67); essa frase precisa sair
no mesmo commit que aplicar a regra nova.

**(8) Carroça, calibração recalculada.** Testado com a linha ATUAL do livro (Carpintaria, Req 3, Dif 7,
Mont 4, Peça 20), só trocando a leitura do intervalo de SEMANA para DIA (mesmos números, sem criar linha
nova): oficial avulso = 267,4 pc (6,86 "dias"), lote 3 = 237,7 pc. 300 pc fica a **1,12× o avulso**, a
mesma proporção do precedente do sapato (A2, 1,1×). É a calibração mais simples possível (não precisa
linha nova, só a unidade do intervalo), mas ela DIVIDE a linha do barco de pesca, que hoje está na
mesma entrada da tabela ("Carroça, barco de pesca", escala de semanas) e cujo preço (1.600, mantido pela
v2) foi calculado como semanas. Separar em duas linhas nas duas tabelas (`acoes-oficio-e-mundo.md` e
`Acoes_Sistema.md`), marcado [E] porque calibra pelo preço (o autor já fechou 300 antes da conta, como
no sapato).

**Vereditos:** A1 ACEITO (sem mudança) · A2 ACEITO (regra R-estável e linhas novas reproduzidas) ·
A3 ACEITO (190 itens, correções da A2/A3 absorvidas) · A4 sem mudança na v2 · B1/B4/B5(nível)/B6 ACEITOS
como redação · B2 BLOQUEIO de redação AINDA ABERTO (texto corrigido não localizado) + [P] novo (2) sobre
a convivência com a fabricação · B7 [P] arrastado da A3 (não recalculado nesta rodada, falta de tempo) ·
B8 condicional, sem mudança · C4/C5/C6 ACEITOS (reproduzidos) · C7 ACEITO nos números, [P] (2) na régua ·
C8 ACEITO nos números (payback do escravo vs. criado livre calculado, sem achado: os dois são
economicamente coerentes entre si) · E1 ACEITO nos números, [I] (3) achado positivo (menos divergência
que a v1), [P] (4) no escopo do rename · E2 ACEITO, contradiz o livro de propósito (7) · E4/E6 ACEITOS ·
E5 [P] (5), piorou com a curva D · E7 não reconferido nesta rodada (sem mudança de conteúdo na v2 além
do já listado em (1)).

**Depende do autor:** (2) qual régua de salário vale para fabricação: a linear das Fases 1-3 ou a
convexa de B2, hoje inconsistentes; (5) aumentar a bolsa do pacote inicial ou aceitar o personagem
pobre; B2 (BLOQUEIO antigo, ainda sem o texto corrigido para conferir); B8 (Transição/Articulada pelo
oficial ou mestre, arrastado da A3); "Concubina" (nome, arrastado da A3); modificador regional (adiado).

Nada alterado em `src/`. Sem commit, sem push.

---

## Etapa D · Rodada D2 · resposta à seção 11 (Adendo) e lista final · VEREDITO

`revisao-economica-v2.md` reposto em Downloads (só o documento mudou; os 8 JSONs conferidos
byte-idênticos aos de antes, cmp). Cópia trocada em `lore/economia/v2/`. Confirmado: tem a seção
"11. Adendo da Etapa D" (:218-237).

**11.1 (texto do B2): ACEITO.** O parágrafo novo distingue T3 (oficial, onde alcança) de T3-F (menor
capaz, onde não alcança), que era exatamente a parte (i) do bloqueio da A3 ("cita errado: T3 = oficial
da tabela, T1 só sensibilidade"). Contas conferidas: 10,5 − 4 = 6,5 × 20 = 130; 130 ÷ 3,5 = 37,1;
16 − 7 = 9 × 37,1 = 334 (333,9); 334 ÷ 5 = 66,9 (66,8). Batem com V7/V11 de `base.py`.
A parte (ii) do bloqueio (itens de Dif 8 fora das três faixas nomeadas, o perito virando produtor de
Malha completa/Transição/Articulada) **não é resolvida pelo texto do 11.1**, que não fala de Dif 8; quem
fecha essa parte é a DECISÃO do 11.6 (Transição e Articulada ficam do oficial, só a Completa muda), não
uma correção de redação. As duas juntas fecham o bloqueio da A3 por completo; separadas, nenhuma fecha
sozinha.

**11.2 (não há duas réguas): DIVERGÊNCIA, testada em Python.** O 11.2 mostra que a fórmula do B2
((média−Dif)×V) é uma identidade fechada consigo mesma (é assim que V7 e V11 foram definidos). Isso é
verdade, mas não é o teste que decide a questão: o achado (2) da D1 não questionava a definição de V7/V11,
questionava se um perito que FABRICA de verdade (Acúmulo/dias, a régua que decidiu os preços das Fases
1-3) ganha o mesmo que a curva convexa promete. Testado com `linha_preco` (espada: Mont 12, Peça 10,
Dif 7, avulso, preço de mercado fixado no custo do oficial, ~245 pc, e material a ⅓ do preço, como o
próprio texto define em A2):

| Soma | dias/peça | peças/semana | receita bruta/sem | líquido (− material)/sem | curva convexa (C7) | linear (H-×20) |
|---|---|---|---|---|---|---|
| 6 (oficial) | 6,29 | 0,955 | 234,0 | 156,0 | 130,0 | 130,0 |
| 9 (perito) | 2,44 | 2,455 | 601,7 | **401,1** | 334,3 | 240,0 |
| 12 (mestre) | 1,57 | 3,818 | 936,0 | **624,0** | 668,6 | 340,0 |

Fabricar e vender ao preço do oficial NÃO rende o mesmo que a curva convexa em nenhuma das duas faixas
testadas, e o sinal da diferença **não é constante**: o perito que fabrica ganha 20% A MAIS que a curva
convexa promete (401 contra 334); o mestre ganha 7% A MENOS (624 contra 669). O motivo é que a fórmula
do B2 é uma abstração de "renda por semana ao nível de referência daquela Dificuldade", e a fabricação
real mistura a velocidade do produtor (que sobe com a soma) com um preço travado no custo do produtor
MAIS LENTO (o oficial); as duas coisas só coincidem por construção no ponto exato em que o produtor É a
referência da própria régua (por isso bate em soma 6, onde oficial = oficial). Isso não reabre o
bloqueio da A3 (que era só de redação) nem muda preço nenhum já fechado (Fases 1-3, munição), porque
nenhum desses preços foi recalculado ao vivo pela fórmula do B2, mas a FRASE "fabricar e alugar o
trabalho rendem o mesmo em todas as faixas" (11.2) é falsa como generalização e deveria virar "coincidem
no produtor de referência de cada faixa; fora dele, divergem, e o sinal muda com a soma" antes de entrar
no livro ou em qualquer nota que cite essa equivalência. Fica **[P] exposto ao autor**, não bloqueio.

**11.3 (pacote de graça, achado 5): ACEITO, invalida o achado (5) da D1.** A regra sempre disse
"ganha um pacote de graça ... **mais** uma bolsa de 4 semanas de Livre" (v2 §7). O achado (5) tratava a
bolsa como se precisasse comprar o pacote, o que a própria frase já não pedia; o mesmo enquadramento
errado vinha carregado desde a A3 ("a bolsa não compra pacote nenhum"). Aceito o 11.3 e retiro o achado
(5) da D1 como problema: ele não sobrevive à releitura da regra.

**11.4 (rename): ACEITO**, sem ressalva: é a mesma lista de arquivo:linha que eu já tinha levantado na
D1 (achado 4), com a exclusão explícita do degrau de Dificuldade.

**11.5 (carroça): ACEITO**, é a própria calibração que propus na D1 (achado 8): linha em dias
(Req 3, Dif 7, Mont 4, Peça 20), avulso ~267, lote 3 ~238, 300 a 1,12× o avulso; barco de pesca separado,
em semanas, ~1.600.

**11.6 (B8 fechado): ACEITO como decisão**; fecha também a parte (ii) do bloqueio de B2, como registrado
acima em 11.1.

**11.7 ("Concubina"): ACEITO como decisão** do autor; fechado.

**11.8 (cura mortal e cópia): ACEITO, contas conferidas.** Curandeiro: 10 × 6 = 60/semana, abaixo da
renda do oficial por contrato (130) e mesmo da renda do Destreinado (100); só acima do Braçal (60=60,
empate). Copista: 2 × 8 × 6 = 96/semana, entre o Destreinado (100) e o Oficial (130), como o texto diz.
Ressalva pequena, não bloqueio: "custo de vida do oficial" não tem faixa própria na tabela de Renda
(soma 6 fica entre Destreinado e Treinado); o texto quis dizer a RENDA do oficial (130), não um "custo
de vida" tabelado; troca de palavra a fazer se o trecho for para o livro.

**Decisões do autor que fecham itens da D1** (2, do resumo do Revisor): B8 fechado (11.6); "Concubina"
mantida (11.7); carroça pela calibração do Revisor (11.5); rename só no grau de qualidade (11.4). Todas
conferidas acima.

---

## LISTA DE IMPLEMENTAÇÃO FINAL (Rodada D2, para o Arquiteto)

Fecha as Etapas A a E (v1 + v2) e a Etapa D (auditoria). Nada pendente de redação além do que está
listado em "Depende do autor" no fim. Ordenada por arquivo.

### `src/data/` (novos e substituições)

1. **`mercadorias.json`** (novo): copiar de `lore/economia/v2/mercadorias.json` (193 itens, conferido
   byte-idêntico ao gerado por `gerar.py`). Substitui `precos.json` como fonte de preço de item geral.
2. **`mercadorias.procedencia.json`** (novo, fora do site): copiar para `lore/economia/`, não para
   `src/data/` (é lore, não dado do jogo, por decisão já registrada em E6).
3. **`montarias-veiculos.json`** (novo): copiar de `lore/economia/v2/`. Contém `_procedencia` por item
   e não tem campo `peso`; **o esquema zod precisa aceitar isso ou o campo precisa ser acrescentado**
   (pendência de schema, não de preço).
4. **`servicos.json`** (novo): copiar de `lore/economia/v2/`. Inclui `tarifas_por_perfil`, `servicos`,
   `aulas`, `criados`, `escravos`, `escravo_sustento_semana`.
5. **`pacotes-equipamento.json`** (novo): copiar de `lore/economia/v2/` (7 pacotes, totais recompu­tados
   e conferidos nesta rodada e na D1).
6. **`renda.json`** (novo): copiar de `lore/economia/v2/`. **Antes de copiar, corrigir a `_nota`**: ainda
   diz "Livre = Renda × 20% × (60/Renda)^0,2", que é a curva antiga; a curva usada de fato é a curva D
   (12% → 2%, `LIVRE_A=0.12, LIVRE_B=0.02` em `modelo.py`). Achado da D1 (item 1), não corrigido pela v2
   até agora: reconferir se sobrevive na hora de gerar o JSON final.
7. **`custo-de-vida.json`** (novo): copiar de `lore/economia/v2/`.
8. **`viagens.json`** (novo): copiar de `lore/economia/v2/`.
9. **`precos.json`**: aposentar (decisão da A3, E6). Os ids únicos que os 7 pacotes antigos usavam
   (`martelo`, `corda-canhamo` etc.) têm mapa 1:1 para os novos ids em `mercadorias.json`
   (`martelo-ferramenta`, `corda-canhamo` mantido); conferir se algo fora de `precos.mjs`/
   `gen-lista-equip.mjs` ainda lê `precos.json` antes de apagar (a busca desta rodada não achou mais
   nada, mas foi rápida).
10. **`antecedentes.json`**: renomear "Relíquia" → "Artefato" (G-novo 1 da v2 §0). **Checar `RENOMES` em
    `src/lib/ficha-engine.ts`** se o slug do antecedente for persistido em ficha salva (regra do projeto:
    renomear traço sem entrada em `RENOMES` quebra ficha salva).
11. **`armas.json`**, **`armaduras.json`**: nenhuma mudança de preço nesta rodada (Fases 1-3 já fechadas
    em `b475ab4`); só o rename de grau de qualidade os afeta indiretamente, e ele não está nesses
    arquivos (é texto de capítulo).

### `src/content/chapters/`

12. **`acoes-oficio-e-mundo.md:190`**: tirar a frase "A Montagem se paga igual" (contradiz a regra nova
    de reparo, G67: leve sem Montagem, pesado com metade, arruinada com tudo).
13. **`acoes-oficio-e-mundo.md:173`** (linha "Carroça, barco de pesca", hoje na escala de semanas),
    separar em duas linhas:
    - **Carroça**: Carpintaria, Req 3, Dif 7, Montagem 4, Peça 20, **escala de dias** (não de semanas);
      avulso ~267 pc / 6,3 dias; lote de 3 ~238 pc; preço de catálogo 300 pc (1,12× o avulso, a mesma
      proporção do sapato).
    - **Barco de pesca**: mesma linha de origem, continua na **escala de semanas**; preço ~1.600 pc,
      mantido.
14. **`acoes-oficio-e-mundo.md:74,85,96,98,113`**: trocar "Excepcional" por "Excelente" (grau de
    qualidade, régua de seis graus).
15. **`Acoes_Sistema.md:1126,1130,1147,1152,1174`**: mesma troca ("Excepcional" → "Excelente"), mesma
    régua.
16. **`acoes-e-sistema.md:46`**: mesma troca (menção à régua de qualidade).
17. **`custo-de-servico-e-itens.md:63-74`** (tabela de graus) e o exemplo do Machado (§1.7 da v2:
    Boa 6 po, Ótima 15 po, Excelente 36 po pela base 3 po), trocar para a régua v2: nomes
    Sucata/Tosca/Comum/Boa/Ótima/**Excelente**; multiplicador fixo **Boa 5×, Ótima 30×, Excelente 70×**
    (Tosca até ⅓, Sucata até ⅙); acrescentar a regra do **Requisito máximo 6** (cada ponto acima vira
    +3 na Dificuldade). **NÃO mexer** no degrau "intervalo sobe a cada dois graus" (:98), porque ele já está
    certo no livro e a v2 não diverge nesse ponto (achado 3f/11.4 da D1/D2).
18. **`custo-de-servico-e-itens.md:125`**: mesma régua de qualidade, segunda ocorrência (E7 da v2).
19. **NÃO trocar** "Excepcional" em: `acoes-e-sistema.md:24`, `coracao-do-sistema.md:71`,
    `virtude-jogada.md:40`, `Acoes_Sistema.md:68,529,545`: é o degrau 25 da escada de Dificuldade,
    conceito diferente do grau de qualidade.
20. **Tabela de Renda** (`custo-de-servico-e-itens.md`, seção "Serviços & Renda"): regerar da nova
    `renda.json` (9 faixas, curva D, colunas de mês/ano em 4/48 semanas exatas).
21. **Novas seções de capítulo** (sem local fixo hoje, decisão do Arquiteto onde entram): custo de vida
    por faixa e pacote familiar (`custo-de-vida.json`), tarifas de serviço e a lista de 38 serviços
    (`servicos.json`), tabela de viagens em km (`viagens.json`), montarias/animais/veículos/manutenção
    (`montarias-veiculos.json`), servos e escravos (dentro de `servicos.json`).
22. **Regra de reparo** (E2, provavelmente perto de `acoes-oficio-e-mundo.md:190`), entra a régua nova:
    leve ~1/10 do preço (sem Montagem), pesado ~1/3 (meia Montagem), arruinada ~2/3 + material que
    faltar.
23. **Regra de "semanas de aventura"** (seção 10 da v2, Jogador), nova, sem custo de vida da faixa para
    quem não tem casa fixa; renda proporcional a dias trabalhados em semana parcial.
24. **Cura acelerada por Cura** (C7/G66): "cada nível de Cura acelera a recuperação em 10%; 50% exige
    Cura 5", perto de onde o livro já fala da perícia Cura.

### Scripts

25. **`scripts/gen-cap-pericias.mjs`** (ou um gerador novo equivalente): as tabelas de Renda, custo de
    vida, serviços, viagens e servos passam a ser GERADAS dos JSONs novos, e não escritas à mão nos
    capítulos (mesma disciplina que já vale para o catálogo de perícias).
26. **`scripts/precos.mjs`**, **`scripts/gen-lista-equip.mjs`**: apontar para `mercadorias.json` /
    `pacotes-equipamento.json` em vez de `precos.json`.

### Depende do autor (não bloqueia a lista acima, mas falta decisão)

- **Achado (2) da D1, revisto pelo 11.2/D2**: a frase "fabricar e alugar rendem o mesmo" não sobrevive
  ao teste com a régua real de fabricação (perito +20%, mestre −7%, sinais opostos). Se essa frase for
  para o livro ou para qualquer nota de design, precisa da ressalva ("coincidem no produtor de
  referência; fora dele, divergem"). Não impede a implementação dos preços já fechados.
- **Modificador regional** (A4, adiado desde a A3, confirmado adiado na v2 §12).
- **Impacto do Livre baixo no jogador** (v2 §12.2, "para depois").
- **B7** ("quanto se poupa vivendo abaixo do nível"): não reconferido nesta rodada nem na D1 por falta
  de tempo; sem achado contra, só não verificado.

Nada alterado em `src/`. Sem commit, sem push.

## Etapa D · Rodada D3 · conferência da implementação (rodada 110) · VEREDITO

O Arquiteto aplicou a LISTA FINAL da D2 em `main` (commits `2333022`..`949d9e1`, rodada 110). Conferido
item por item da lista, com contas em Python onde havia número. Nenhum arquivo de `src/` foi tocado
nesta rodada D3; a conferência rodou `node scripts/gen-cap-economia.mjs` e `npm run validate` sobre a
árvore de trabalho e não deixou diff (`git status --short` limpo antes e depois).

1. **JSONs de `src/data` vs `lore/economia/v2/`**: ACEITO. Comparado o CONTEÚDO dos itens (não os
   bytes): `mercadorias.json` e `montarias-veiculos.json` idênticos item a item; `servicos.json`,
   `pacotes-equipamento.json`, `custo-de-vida.json` e `viagens.json` idênticos em todas as chaves
   (`aulas`, `criados`, `tarifas_por_perfil`, `pacotes`, `cestas_semana`, `precos`, etc). Só a `_nota`
   muda em texto (tirou "PROPOSTA", trocou pela citação de `gerar.py`), e em `renda.json` a `_nota` foi
   CORRIGIDA na cópia para a curva D (12%→2%), resolvendo o achado (1) da D1 que a v2 nunca corrigiu na
   fonte. Envelope: `mercadorias`/`montarias-veiculos` usam `{_nota, itens}`; os demais mantêm a forma
   aninhada própria de cada categoria (não é regressão, é o envelope por categoria já decidido em E6).
   `mercadorias.procedencia.json` ficou fora de `src/data/`, como mandava o item 2. Schema: `peso`
   virou `nullable().optional()` em `validate-data.mjs:924`, resolvendo a pendência do item 3.
2. **B8 (Placa completa)**: ACEITO. `armaduras.json`: só `placa-completa` mudou (2.600→3.600 pc,
   commit `a58e6f4`); as outras 12 armaduras do arquivo, intactas. Tabela velha de
   `custo-de-servico-e-itens.md:471` ("Placa completa | Pesada | 36 po") bate exatamente com 3.600 pc
   pela conversão do próprio capítulo (1 po = 100 pc, linha 14); não é preço divergente, é outra unidade
   da mesma tabela "Provisório" (nota de linha 10), que já avisa o leitor e está fora do escopo desta
   rodada (ela cobre armas/armaduras/escudos/munição, não itens gerais). Nenhum capítulo de combate
   (`armas-e-armaduras.md`, `combate.md`, `vida-ferimentos-cura.md`) cita preço, só a mecânica de
   Absorção, que não muda.
3. **Rename Relíquia → Artefato**: ACEITO. Zero ocorrências de "Relíquia/reliquia" sobrando em
   `src/` (a que tinha ficado em `regras.json:580` já foi tirada na 110, commit `63897c6`).
   `ficha-engine.ts:351` tem `RENOMES_ANTE = [['reliquia','artefato']]`, aplicado antes do laço que lê
   `S.ante`/`S.anteNom`; a migração está no lugar certo (migra e não trava a leitura de ficha antiga).
   Não testei no navegador uma ficha salva de verdade com Relíquia antiga (não tenho uma à mão), mas o
   código e o comentário da migração (`ficha-engine.ts:348-350`) são coerentes com o padrão que o
   projeto já usa para os outros `RENOMES`.
4. **Rename Excepcional → Excelente**: ACEITO, escopo certo. Nos 4 lugares da régua de qualidade
   (`acoes-oficio-e-mundo.md:74,82,85,96,98,113`, `acoes-e-sistema.md:46`,
   `custo-de-servico-e-itens.md:337,396`) o texto já diz "Excelente". Nos 2 lugares do degrau de
   Dificuldade 25 que ainda existem (`acoes-e-sistema.md:24`, `coracao-do-sistema.md:71`), continua
   "Excepcional", intacto, como devia. **Achado sobre a própria lista**: `Acoes_Sistema.md` (os itens
   15 e 19 da lista D2, linhas 1126 etc.) não existe em lugar nenhum do repositório hoje, nem em
   `src/content/chapters`, nem fora. Não é uma sobra da rodada 110: é uma citação errada que já vinha
   da D1, provavelmente de um documento de trabalho anterior que foi incorporado a `acoes-e-sistema.md`
   antes mesmo da 110 e nunca existiu com esse nome no `src/` atual. Retiro a citação; não há ação
   pendente para o Arquiteto aqui, porque não há arquivo para corrigir.
5. **Qualidade, reparo, carroça/barco, Renda, custo de vida/serviços/viagens/montarias, semanas de
   aventura, cura, revenda**: ACEITO em bloco, item por item:
   - Qualidade: `custo-de-servico-e-itens.md:330-345` traz Boa 5×/Ótima 30×/Excelente 70× (Tosca ⅓,
     Sucata ⅙), "Requisito máximo 6" com a regra dos +3 de Dificuldade por ponto excedente, Relíquia
     como rótulo com piso de 100×, e Revenda pela metade do preço. O degrau "intervalo sobe a cada dois
     graus" (`acoes-oficio-e-mundo.md:98`) não foi mexido, como mandava o item 17.
   - Reparo: `acoes-oficio-e-mundo.md:193` tem a régua nova por inteiro (leve sem Montagem e ¼ da Peça;
     pesado com metade da Montagem e metade da Peça; arruinada com Montagem e Peça inteiras; 1/10, 1/3
     e 2/3+material por encomenda) e a frase "A Montagem se paga igual" não existe mais no capítulo.
   - Carroça/barco: `acoes-oficio-e-mundo.md:162` (Carroça, Carpintaria, Req 3, Dif 7, Mont 4, Peça 20,
     **6,9 dias**) separada de `:174` (Barco de pesca, mesma linha de origem, **7 semanas**). O número
     é 6,9 dias, não 6,3: bate com o CORRIGE que a própria Revisora já tinha apontado na rodada 110
     (`estado-revisao.md` não precisa repetir a conta, já está no commit `63897c6`).
   - Renda: `custo-de-servico-e-itens.md:57` cita a curva certa (Livre 12%→2%, braçal→nobreza).
   - Cura acelerada: `vida-ferimentos-cura.md:90` tem "cada nível de Cura... acelera em 10%... 50%
     exigem Cura 5", igual ao G66.
   - Semanas de aventura: seção própria em `custo-de-servico-e-itens.md:65`.
6. **Tabelas geradas, não digitadas**: ACEITO, testado de verdade: rodei
   `node scripts/gen-cap-economia.mjs` de novo sobre a árvore já commitada e `git status --short` ficou
   limpo (nenhuma diferença entre o que está commitado e o que o gerador produz agora). `npm run
   validate` também confirma sozinho: "tabelas da economia em dia com a fonte (12 blocos: 9 faixas de
   renda, 193 mercadorias, 44 montarias e veículos, 38 serviços, 7 pacotes)", com `--check` no portão.
7. **Preço antigo sobrando**: ACEITO, nada achado. Testei os 37 ids do extinto `precos.json` contra
   `mercadorias.json`: todos sobrevivem por id (só `martelo` virou `martelo-ferramenta`, como o item 9
   da lista já previa), os preços mudaram onde a v2 mandava mudar (ex.: mochila 20→100 pc, corda de
   cânhamo 10→25 pc) e o texto do capítulo (`custo-de-servico-e-itens.md:694-953`) já reflete os valores
   novos, inclusive os 7 totais de pacote (Artista 572 pc = "5 po 7 pp 2 pc" etc., conferido um a um). A
   tabela velha de armas/armaduras/escudos/munição em unidade po/pp (linhas ~380-490) bate 1:1 com
   `armas.json`/`armaduras.json`/`escudos.json`/`municao.json` pela conversão de moeda do próprio
   capítulo; ela é pré-existente à Etapa D inteira (rótulo "Provisório" desde antes da rodada 110) e
   nunca esteve no escopo de `precos.json`, então não é uma sobra desta rodada.

### Veredito

Todos os itens da LISTA FINAL: **ACEITO**. Zero BLOQUEIO, zero [P] novo. A única correção é sobre a
própria lista da D2 (a citação a `Acoes_Sistema.md`, que não existe e não precisa existir).

### Depende do autor (sem mudança desde a D2)

- Achado (2)/11.2: a frase "fabricar e alugar rendem o mesmo" ainda precisa da ressalva se for para
  o livro ou nota de design (não bloqueia nada já implementado).
- Modificador regional, impacto do Livre baixo, B7: adiados, sem reconferência nesta rodada.

Etapa D encerrada, salvo o "Depende do autor" acima. Nada alterado em `src/`. Sem commit, sem push.

## Etapa D · Rodada D4 · o Acoes_Sistema.md que eu tinha dado por sumido · VEREDITO

**Correção da D3.** Meu achado (4) da D3 estava errado: `Acoes_Sistema.md` NUNCA saiu do lugar. Ele
mora na RAIZ do repositório (`C:\Users\Neves\ClaudeCode\centelha\rpg-system\Acoes_Sistema.md`, 1.684
linhas), não em `src/content/chapters/`, e por isso a minha varredura da D3 (que só olhou
`src/content/chapters` e depois um `find` que falhou em achar arquivo de raiz por um motivo que não
apurei) não o encontrou. `git log --all --oneline -- 'Acoes_Sistema.md'` mostra o arquivo vivo desde
`bdc58d0` (a abertura da frente de Ações & Sistema) até hoje, com o commit mais recente sendo
`f9709bc` (a própria Rodada 110, "texto dos Ofícios pela revisão econômica"), que já mexeu nele.

**O que `f9709bc` mudou em `Acoes_Sistema.md`**: só o rename Excepcional → Excelente, nas mesmas 5
linhas (`:1126,:1130,:1147,:1152,:1174`) e preservando o degrau 25 intacto (`:68,:529,:545`), exatamente
como a mensagem do commit diz. **O resto do arquivo não foi tocado**, e é aí que a divergência mora:

- **§7.5 "A qualidade move os cinco números de uma vez" (`:1108-1128`)**: ainda descreve a régua VELHA:
  "Preço **dobra**" por grau acima, "Preço **cai pela metade**" por grau abaixo (`:1119`). Não fala em
  multiplicador fixo (5×/30×/70×) nem em "Requisito máximo 6". A tabela dos seis graus (`:1122-1126`)
  já tem "Excelente" no lugar de "Excepcional", mas a REGRA de preço por trás dela é a antiga.
- **§7.8 "Reparar, melhorar, improvisar, desmontar" (`:1291-1293`)**: ainda tem a frase **"A Montagem
  se paga igual"** (linha 1293), a mesma frase que a D2 mandou tirar e que SAIU de
  `acoes-oficio-e-mundo.md:190` mas não daqui. A régua descrita aqui (¼/½/inteiro do Acúmulo) também não
  menciona "sem Montagem" no dano leve, diferente do texto novo do outro capítulo.
- **A linha da carroça (`:1270`)**: ainda é **"Carroça, barco de pesca | Carpintaria | 3 | 7 | 4 | 20 |
  2 | 7 semanas"**, uma linha só, na escala de semanas. Não foi separada em Carroça (dias, 6,9) e Barco
  de pesca (semanas, 7), como já está em `acoes-oficio-e-mundo.md:162,174`.
- **§7.9 "Ganhar a vida com o ofício" (`:1313-1322`)**: divergência que também existe **no site**, e
  é a mais grave das quatro. Ver item 2 abaixo: a fórmula, os exemplos e os tetos estão desatualizados
  tanto aqui quanto em `acoes-oficio-e-mundo.md:209-211`. Ninguém, em nenhuma rodada da Etapa D (nem a
  minha D3), tinha reconferido esse parágrafo especificamente.
- **Relíquia/Artefato**: não se aplica, o arquivo não cita Relíquia como antecedente.

**Veredito do item 1**: o arquivo existe, na raiz, nunca foi movido. **[P]**: falta aplicar nele a
régua de qualidade nova (preço fixo + Requisito máximo 6), tirar "A Montagem se paga igual", separar
a linha da carroça, e corrigir §7.9 (item 2 abaixo). Não é BLOQUEIO porque `Acoes_Sistema.md` é um
documento de trabalho fora de `src/` (a bancada da frente de Ações & Sistema, não uma página do site);
mas ele é citado como referência viva em commits recentes, e ficar com quatro pontos desatualizados
depois de uma rodada que mexeu justamente nesse capítulo é o tipo de deriva que rende confusão.

**Item 2 (`acoes-oficio-e-mundo.md`, "Ganhar a vida com o ofício", `:205-211`)**: **BLOQUEIO**, achado
novo, confirmado nos dois lugares (site e Acoes_Sistema.md). O texto do SITE ainda diz:

```
Ganho por semana = (média − 4) × 10 pc, limitado pela demanda do lugar
O oficial tira 65 pc por semana, o perito 120, o mestre 170. [...] uma aldeia absorve talvez 50 pc
por semana [...] uma vila 150, uma cidade 500, e uma capital não tem teto prático.
```

Isso é a fórmula de ANTES de Fases 1-3 fixarem `salario_x20` (`(média−4)×20`, `base.py`). Fazendo a
conta com a fórmula nova, pelas mesmas somas que o texto velho já usava (oficial soma 6 média 10,5,
perito soma 9 média 16, mestre soma 12 média 21):

| Produtor | soma | média | (média−4)×20 |
|---|:--:|:--:|:--:|
| oficial | 6 | 10,5 | **130 pc** |
| perito | 9 | 16 | **240 pc** |
| mestre | 12 | 21 | **340 pc** |

Esses três números batem exatamente com a coluna "linear (H-×20)" da tabela que eu já tinha levantado
na Rodada D2 (11.2). Os tetos: `src/data/renda.json` já tem o campo `tetos_demanda` pronto e
correto (**aldeia 100, vila 300, cidade 1.000, capital sem teto** = `null`), que bate com o número que
o autor/Comerciante deu (100/300/1000). O texto do capítulo nunca foi atualizado para ler esse campo.
Correção sugerida (mesma frase, números trocados):

```
Ganho por semana = (média − 4) × 20 pc, limitado pela demanda do lugar
O oficial tira 130 pc por semana, o perito 240, o mestre 340. O teto é o mercado: uma aldeia absorve
talvez 100 pc por semana de qualquer ofício, uma vila 300, uma cidade 1.000, e uma capital não tem
teto prático.
```

A mesma correção vale para `Acoes_Sistema.md:1318-1322`, que tem a frase quase idêntica.

**Item 3 (`custo-de-servico-e-itens.md:471`, tabela "Provisório" de armas/armaduras)**: **ACEITO**,
não é digitada à mão. Está dentro do bloco `<!-- gen:catalogo-equipamento --> ... <!-- /gen:catalogo-
equipamento -->` (`:402-497`), gerado por `scripts/gen-cap-itens.mjs`, que lê `armas.json`,
`armaduras.json`, `escudos.json` e `municao.json` direto (não uma cópia) e converte pc → po/pp na
saída. Rodei `gen-cap-itens.mjs --check` (dentro do `npm run validate`, que já tinha passado) e ele
confere sozinho. A "Placa completa | Pesada | 36 po" bate com os 3.600 pc de `armaduras.json` pela
própria tabela de conversão do capítulo (1 po = 100 pc): não é preço velho, é a mesma fonte em outra
unidade. O aviso "Provisório" (`:10`) é sobre a lista de itens não bater 1:1 com o Cap. XIII, não
sobre preço desatualizado.

Varri as outras tabelas de preço dos capítulos (busquei o padrão `pc/po/pp/pl |` fora de
`custo-de-servico-e-itens.md`): **nenhuma outra tabela de preço existe em nenhum outro capítulo do
site.** Dentro do próprio `custo-de-servico-e-itens.md`, toda tabela com preço está dentro de um bloco
`<!-- gen:... -->`; não sobrou nenhuma tabela de preço digitada à mão nesse arquivo.

### Veredito da D4

1. `Acoes_Sistema.md`: existe, na raiz, nunca foi movido; **[P]**, 4 pontos por aplicar (régua de
   qualidade, "Montagem se paga igual", carroça, §7.9).
2. §7.9 "Ganhar a vida com o ofício", no site E em Acoes_Sistema.md; **BLOQUEIO**: fórmula, exemplo
   e tetos ainda são os de antes de Fases 1-3 (×10, 65/120/170, 50/150/500), enquanto o resto do
   capítulo já usa a régua nova. Números corretos calculados acima (130/240/340 pc; tetos 100/300/1000,
   já presentes em `renda.json.tetos_demanda`).
3. `custo-de-servico-e-itens.md:471`: gerado por `gen-cap-itens.mjs` a partir dos JSONs de armas/
   armaduras/escudos/munição, não digitado; nenhuma outra tabela de preço nos capítulos é digitada à
   mão.

Nada alterado. Sem commit, sem push.
