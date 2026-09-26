# Catálogo unificado de preços · Centelha

Arquivo de consulta do Arquiteto, gerado em 22/09/2026 a partir do estado atual do repositório.
**Não vai para o site.** Reúne tudo que tem preço (ou deveria ter) espalhado em
`src/data/*.json` e em `src/content/chapters/custo-de-servico-e-itens.md`, num lugar só, para
mandar para outra IA revisar o sistema monetário.

Fontes, por seção: onde não diz o contrário, o valor vem direto do JSON (fonte de verdade). As
seções sem JSON próprio (Hospedagem & Comida, Montarias/Veículos/Animais, Viagens, Roupas, Itens
Gerais, Escravos, Qualidade de Itens, Serviços & Renda) existem **só como prosa** no capítulo
publicado, sem arquivo de dado por trás.

Moeda: **cobre (pc)** é a unidade-base. 1 pp = 10 pc · 1 po = 100 pc · 1 pl = 1000 pc.

---

## 1. Armas (`src/data/armas.json`, 33 itens, 21 com preço / 12 sem)

| Arma | Preço | Peso |
|---|---:|---:|
| Adaga | 6pp | 0,3kg |
| Espada Curta | 1po 5pp | 0,9kg |
| Espada Longa | 2po 5pp | 1,4kg |
| Machado | 3po | 1,2kg |
| Espada Serrilhada | **sem preço** | 1,5kg |
| Maça | **sem preço** | 1,3kg |
| Picareta de Guerra | **sem preço** | 1,3kg |
| Lança | 5pp | 2kg |
| Alabarda | 2po 8pp | 2,7kg |
| Montante | 7po | 2,8kg |
| Martelo de Guerra | 1pl | 2,5kg |
| Arco Curto | 8pp | 0,6kg |
| Arco Longo | 1po 5pp | 0,8kg |
| Arco Composto | 5po 5pp | 0,7kg |
| Besta Pequena | 3po | 2,5kg |
| Besta Média | 5po 5pp | 4,5kg |
| Besta Grande | 9po 5pp | 7kg |
| Adaga de Arremesso | **sem preço** | 0,2kg |
| Machado de Arremesso | **sem preço** | 0,7kg |
| Azagaia | **sem preço** | 0,8kg |
| Funda | **sem preço** | 0,1kg |
| Dardos | **sem preço** | 0,2kg |
| Bumerangue | **sem preço** | 0,3kg |
| Rede | **sem preço** | 1,5kg |
| Pilum | **sem preço** | 2kg |
| Machadinha | 8pp | 0,8kg |
| Machado Pesado | 8po | 3kg |
| Martelo | 2po 5pp | 1,3kg |
| Bastão | 4pp | 0,25kg |
| Lança Longa | 9pp | 2,4kg |
| Sabre | 3po | 0,8kg |
| Maça Estrela | 3po 2pp | 1,5kg |
| Desarmado / Briga | **sem preço** (não deveria custar, é o corpo) | 0kg |

12 armas sem preço, quase todas de arremesso (Adaga/Machado de Arremesso, Azagaia, Funda, Dardos,
Bumerangue, Rede, Pilum) mais três corpo-a-corpo (Espada Serrilhada, Maça, Picareta de Guerra).
Desarmado não precisa de preço por natureza.

## 2. Armaduras (`src/data/armaduras.json`, 14 itens, 5 com preço / 9 sem)

| Armadura | Classe | Preço | Peso |
|---|---|---:|---:|
| Nenhuma | nenhuma | (opção "sem armadura") | 0kg |
| Gambeson (acolchoado) | leve | **sem preço** | 3,5kg |
| Couro endurecido | leve | **sem preço** | 5kg |
| Peitoral | leve | 2po 8pp | 4kg |
| Camisa de malha | leve | 2po | 7kg |
| Cota de malha | média | **sem preço** | 11kg |
| Brigandina / coat of plates | média | **sem preço** | 9kg |
| Lamelar | média | **sem preço** | 12kg |
| Peitoral reforçado | pesada | 9po | 14kg |
| Placa de transição | pesada | **sem preço** | 18kg |
| Placa de munição | pesada | **sem preço** | 22kg |
| Placa articulada | pesada | 1pl 4po | 20kg |
| Placa completa | pesada | **sem preço** | 25kg |
| Malha completa | pesada | 1pl 8po | 20kg |

9 armaduras sem preço, entre elas duas leves de entrada (Gambeson, Couro) e a Placa completa (o
topo da linha pesada) sem preço nenhum, o que é uma lacuna grande: hoje a armadura mais protetora
do jogo não tem número de compra.

## 3. Escudos (`src/data/escudos.json`, 8 itens, 7 com preço / 1 sem)

| Escudo | Preço | Peso |
|---|---:|---:|
| Nenhum | (opção "sem escudo") | 0kg |
| Broquel (buckler) | 6pp | 1kg |
| Targe | 3pp | 2,5kg |
| Hoplon | 6pp | 7kg |
| Heater | 1po | 3kg |
| Kite | 2po 5pp | 4,5kg |
| Scutum romano | 3po 5pp | 7,5kg |
| Pavês (pavise) | 4po 5pp | 6kg |

## 4. Munição (`src/data/municao.json`, 2 itens, 2 com preço)

| Munição | Preço | Peso | Aceita |
|---|---:|---:|---|
| Flechas (10) | 1pp | 0,3kg | Arco Curto, Arco Longo, Arco Composto |
| Virotes (10) | 1pp | 0,5kg | Besta Pequena, Besta Média, Besta Grande |

## 5. Equipamento de aventura (`src/data/precos.json`, 38 itens + 7 pacotes, todos com preço)

| Item | Preço |
|---|---:|
| Mochila | 2pp |
| Saco de dormir | 1pp |
| Cobertor | 5pc |
| Cantil | 5pc |
| Rações (1 dia) | 2pc |
| Kit de refeição | 5pc |
| Caixa de fogo | 5pc |
| Tocha | 1pc |
| Vela | 1pc |
| Lanterna coberta | 5pp |
| Lâmpada | 3pp |
| Frasco de óleo | 1pp |
| Corda de cânhamo (15 m) | 1pp |
| Linha (3 m) | 1pc |
| Pé de cabra | 2pp |
| Martelo (ferramenta) | 1pp |
| Píton | 1pc |
| Sino | 1pp |
| Esferas de metal (1000) | 1pp |
| Faca pequena | 2pp |
| Kit de disfarce | 25pp |
| Fantasia | 3pp |
| Baú | 5pp |
| Caixa para mapas/pergaminhos | 1pp |
| Conjunto de roupas finas | 8po |
| Vestes (cerimoniais) | 5pp |
| Vidro de tinta | 8pp |
| Caneta tinteiro | 1pc |
| Folha de papel | 2pc |
| Folha de pergaminho | 1pc |
| Livro de estudo | 25pp |
| Saquinho de areia | 1pc |
| Vidro de perfume | 5pp |
| Parafina (lacre) | 5pc |
| Sabão | 2pc |
| Caixa de esmolas | 1pp |
| Bloco de incenso | 5pc |
| Incensário | 3pp |

**Pacotes prontos** (soma dos itens acima): Artista (3po 6pp), Assaltante (1po 8pp 6pc),
Aventureiro (1po 1pp), Diplomata (10po 6pp 8pc), Estudioso (3po 8pp 2pc), Explorador (8pp 5pc),
Sacerdote (1po 4pp 9pc).

## 6. Hospedagem & Comida (só prosa, `custo-de-servico-e-itens.md:209-240`, sem JSON)

| Estalagem (noite) | Preço | | Refeição | Preço |
|---|---:|---|---|---:|
| Pobre | 3pc | | Rações | 1pc |
| Modesto | 7pc | | Modesto | 3pc |
| Confortável | 15pc | | Confortável | 8pc |
| Abastada | 2pp | | Farta | 2pp |
| Rica | 5pp | | Rica | 8pp |
| Aristocrata | 3po | | Aristocrata | 16pp |

| Comida & Bebida | Preço |
|---|---:|
| Cerveja ruim | ½pc |
| Cerveja média | 2pc |
| Cerveja ótima | 1pp |
| Cerveja (barril) | ×100 |
| Vinho ruim | 2pc |
| Vinho médio | 8pc |
| Vinho fino | 2po |
| Frango | 2pc |
| Queijo | 2pc |
| Pão | ½pc |
| Frutas | 3pc |

## 7. Montarias, Veículos & Animais (só prosa, `custo-de-servico-e-itens.md:242-271`, sem JSON)

| Montaria (treinada) | Preço | | Veículo & Apetrecho | Preço |
|---|---:|---|---|---:|
| Pônei | 4po | | Trenó | 1po |
| Camelo | 5po | | Carroça | 3po |
| Cavalo | 6po | | Carruagem | 20po |
| Elefante | 28po | | Alforje | 5pp |
| | | | Ração (dia) | 2pc |

| Animal (não treinado, criação/abate) | Preço |
|---|---:|
| Galinha | 2pc |
| Porco | 3pp |
| Ovelha | 3pp |
| Cabra | 5pp |
| Touro | 10pp |
| Burro | 12pp |
| Cavalo | 14pp |
| Vaca | 16pp |

Nota do próprio capítulo: o Cavalo de montaria (6po) é treinado para sela; o Cavalo de criação
(14pp) é gado. A diferença de preço é só o adestramento.

## 8. Viagens (só prosa, `custo-de-servico-e-itens.md:273-283`, sem JSON)

| Viagem | Preço |
|---|---:|
| Municipal (por milha) | 6pc |
| Caravana (por 100 milhas) | 1po |
| Navio (por 100 milhas) | 5pp |

## 9. Roupas (só prosa, `custo-de-servico-e-itens.md:285-298`, sem JSON)

| Roupa | Preço |
|---|---:|
| Comum | 2pp |
| Viajante | 5pp |
| Entretenimento | 15pp |
| Robe | 35pp |
| Finas | 8po |
| Nobres | 18po |

## 10. Itens Gerais (só prosa, `custo-de-servico-e-itens.md:300-318`, sem JSON)

Preço por 100g, salvo indicação.

| Item (100g) | Preço | | Droga (dose) | Preço |
|---|---:|---|---|---:|
| Ferro | ¼pc | | Barato | ¼pp |
| Cobre | 2pc | | Caro | 2pp |
| Sal | 2pp | | | |
| Temperos | 3pp | | | |
| Prata | 3pp | | | |
| Cravo | 4pp | | | |
| Pimenta | 4pp | | | |
| Canela | 6pp | | | |
| Ouro | 3po | | | |

## 11. Escravos (só prosa, `custo-de-servico-e-itens.md:320-334`, sem JSON)

Tabela de ambientação sombria: o tráfico de pessoas existe no mundo, uso na mesa é decisão do
grupo. Não há distinção "escravo/servo" no sistema hoje, só a tabela de escravidão abaixo.

| Escravo | Preço |
|---|---:|
| Destreinado | 8po |
| Doméstico | 14po |
| Treinado | 20po |
| Concubina | 30po |
| Custo/mês (sustento) | 3po |

## 12. Serviços & Renda (só prosa, `custo-de-servico-e-itens.md:33-55`, sem JSON)

Isto **não é** preço de contratar alguém: é quanto o personagem GANHA exercendo um ofício.
Recursos é a faixa social; Renda é o bruto; Livre é o que sobra depois do custo de vida.

| Recursos | Serviço | Renda/Sem | Renda/Mês | Livre/Sem | Livre/Mês | Livre/Ano |
|:---:|---|---:|---:|---:|---:|---:|
| ● | Braçal | 6pp | 22pp | 10pc | 4pp | 38pp |
| ●● | Destreinado | 10pp | 40pp | 20pc | 8pp | 78pp |
| ●● | Treinado | 27pp | 10po | 50pc | 20pp | 17po |
| ●●● | Especialista | 55pp | 20po | 84pc | 30pp | 25po |
| ●●● | Doutor | 82pp | 30po | 14pp | 50pp | 40po |
| ●●●● | Abastado | 14po | 50po | 22pp | 75pp | 56po |
| ●●●● | Rico | 27po | 100po | 5po | 15po | 100po |
| ●●●●● | Aristocrata | 42po | 150po | 7po | 18po | 110po |
| ●●●●● | Nobreza | 100po | 380po | 14po | 38po | 210po |

Uma semana de trabalho vale 6 dias.

**LACUNA CONHECIDA, confirmada de novo hoje:** não existe em lugar nenhum do repositório uma
tabela de preço para CONTRATAR um serviço (curandeiro, guia, mercenário, professor etc), nem
preço de servo (livre, contratado) distinto do escravo. Só existe o que o próprio personagem
ganha trabalhando (esta seção) e o que custa possuir um escravo (seção 11).

## 13. Qualidade de Itens (explicação, `custo-de-servico-e-itens.md:57-125`)

Toda arma ou armadura tem uma **qualidade**, que muda **dois eixos ao mesmo tempo**: o preço
(multiplicador sobre a base "Comum") e quantos pontos de melhoria (ou piora obrigatória) o item
carrega.

| Qualidade | Preço (× base) | Pontos |
|---|---:|---:|
| Péssimo | menos de ½× | −2 a −3 |
| Ruim | até ½× | −1 a −2 |
| Comum | 1× (base) | 0 |
| Boa | a partir de 3× | +1 |
| Ótima | a partir de 6× | +2 |
| Relíquia | a partir de 10× | +2 (mecanicamente igual à Ótima; o preço extra é valor agregado: joias, materiais nobres, lavor artístico) |

A soma dos modificadores tem de fechar no orçamento da qualidade (uma Boa leva uma melhoria de
+1; uma Ótima leva duas, ou uma de +2, ou uma de +2 paga em parte com uma piora).

**Pioras disponíveis** (pontos negativos): −1 Dano (−1pt), −2 Acerto (−1pt), −1 Bloqueio (−1pt),
+1 Velocidade/mais lenta (−2pt), −1 nível Resist. Perfuração (−2pt), −1 Absorção (−1pt), +1
Penalidade (−2pt), −20% Alcance (−1pt), +30% Peso (−1pt).

**Melhorias disponíveis** (pontos positivos): +1 Dano (+1pt), +2 Acerto (+1pt), +1 Bloqueio
(+2pt), +1 nível Perfuração (+2pt), +1 nível Resist. Perfuração (+2pt), +1 Absorção (+1pt), −1
Penalidade (+2pt), +20% Alcance (+1pt), −30% Peso (+1pt).

Não existe como deixar a arma **mais rápida** (−1 Velocidade) só com qualidade. A critério do
Narrador, melhorar a qualidade também pode reduzir peso, aumentar alcance, baixar custo de
Fôlego etc., cada um valendo uma melhoria de +1.

**Exemplo do próprio capítulo** (Machado, base 30pp): Péssimo sai por menos de 15pp; Ruim por até
15pp; Bom por ao menos 45pp; Ótimo por ao menos 90pp; Relíquia por ao menos 150pp. Um Machado Bom
(+1) pode vir com +1 Dano ou +2 Acerto; um Ótimo (+2) com +1 Dano e +2 Acerto, ou +1 nível de
Penetração.

**Nota de procedência do próprio capítulo, linha 10:** "as listas e os preços dos dois capítulos
não batem por completo: use como referência de ordem de grandeza; a reconciliação final vem
depois" (referência a Armas & Armaduras, Cap. XI, vs. este capítulo). Ainda marcado como
provisório.

---

## Resumo das lacunas de preço, para quem for revisar

- **12 armas sem preço** (seção 1), a maioria de arremesso.
- **9 armaduras sem preço** (seção 2), incluindo a Placa completa, o topo da linha pesada.
- **1 escudo sem preço** ("Nenhum", opção null, não é lacuna real).
- **Nenhuma tabela de preço para CONTRATAR serviço**, nem para servo/empregado livre (só existe
  renda de quem exerce o ofício, seção 12, e preço de escravo, seção 11).
- **Preço x30 armas/armaduras publicado no capítulo XI (Armas & Armaduras) ainda não reconciliado
  com este capítulo** (nota provisória, linha 10 do capítulo fonte). Vale conferir se o Cap. XI
  tem números de preço próprios que divergem dos JSONs acima antes de fechar qualquer revisão.
