# New RPG System D6 — Regras Consolidadas (v0.3)

> **Status:** rascunho de trabalho. Consolida os dois guias originais, resolve inconsistências e incorpora as decisões de design. 🔧 = **proposta minha, ajustável**. 🚧 = **pilar a desenvolver**.

---

## 0. Visão e Pilares de Design

Sistema inspirado em **Exalted 2ª edição** (combate) e **Scion** (escala de poder), baseado em **D6 (pool de dados)**. A escala vai do **mortal ao semideus**: o combate "mundano" é a base; os Caminhos elevam o personagem a tiers míticos.

1. **Customização forte** — atributos, perícias, especialidades, virtudes, Centelha e o toolbox de Caminhos.
2. **Batalhas com decisões** — Ticks, Stunts, técnicas com trade-offs e gestão de guarda.
3. **Armas definem estilo, não potência bruta.**
4. **Progressão infinita** — após maximizar Atributo + Habilidade: Especialidade, Centelha, Caminhos.
5. **Personagens duráveis** — no tier mortal, ~4–5 golpes sólidos de um igual; one-shot só com grande diferença de tier/perícia.
6. **Hábil vence vários, mas perde para a multidão.**

> **Escopo:** toda calibração de combate é a **linha de base do tier mortal (Centelha 1)**. Em tiers altos os Caminhos reescrevem as regras. Fechar o combate mortal primeiro.

---

## 1. Núcleo: Resolução, Atributos e Habilidades

Toda ação soma um **Atributo + uma Habilidade** e converte o total num pool de dados (Xd6), que é **somado** e comparado a um alvo.

**Conversão da soma em dados:**
- **Quantidade de dados (X)** = ⌊soma ÷ 2⌋.
- **Bônus fixo (+2)** = se a soma for **ímpar**, +2 ao total; se par, +0.

| Soma (Atrib + Hab) | Pool |
|---|---|
| 4 | 2d6 |
| 5 | 2d6 + 2 |
| 6 | 3d6 |
| 9 | 4d6 + 2 |
| 10 | 5d6 |

### 1.1 Dificuldade e Sucesso

**Sucesso = o total (dados + bônus) SUPERA o alvo** (>). É a mesma regra do combate (onde o alvo é a Defesa). Contra o mundo, o alvo é a **Dificuldade**, calibrada em paralelo a Atributo + Habilidade:

| Dif | Rótulo | Atrib+Hab de referência | Chance nesse nível |
|---|---|---|---|
| 5 | Fácil | 3 | ~50% |
| 10 | Média | 6 | ~50% |
| 15 | Difícil | 8 | ~34% |
| 20 | Limite humano | 10 (teto) | ~22% |
| 25 | Excepcional (poucos humanos) | — | ~14% (S12) |
| 30+ | Sobre-humano | Caminhos / Centelha | — |

> Princípio: a Dificuldade ≈ o **total médio** que um personagem do nível "apropriado" rola. No nível apropriado, tarefas fáceis/médias são cara-ou-coroa; a maestria (pontos extras) traz confiabilidade. Quem tem competência baixa simplesmente **não alcança** dificuldades altas (teto rígido).

### 1.2 Margem (Graus de Sucesso)

Cada **6 pontos** acima do alvo = **+1 Margem**.
- **Em combate:** cada Margem = **+1d6 de dano** (ver §8).
- **Em outras ações:** o Mestre amplia o efeito (mais rápido, mais fino, mais duradouro; +1d6 onde aplicável).
- 🔧 Falha desastrosa (errar por muito / resultado mínimo) = complicação a critério do Mestre.

### 1.3 Rolagens Opostas e Valores Passivos

Quando há oposição, normalmente **só o lado ativo rola**, contra um **Valor Passivo** do outro:

```
Valor Passivo = (Atributo + Habilidade) × 2   (+ situacionais / stunts)
```

Ex.: o furtivo rola Destreza + Furtividade contra a **Percepção Passiva = (Percepção + Prontidão) × 2** do vigia (que não rola). Quando **ambos** agem ativamente, comparam-se as rolagens — maior vence (empate favorece o status quo / defensor).

> A **Defesa de combate** é o caso especial calibrado: `×2 − ⌊soma/4⌋` (§7.2).

### 1.4 Ações Estendidas

Tarefa longa = **Dificuldade + Intervalo + Acúmulo**. A cada Intervalo, role; **Progresso += (total − Dificuldade)** se positivo (0 se falhar). Conclui ao atingir o Acúmulo.

*Ex.: forjar uma lâmina fina — Dif 12, intervalo semanal, Acúmulo 30. A cada semana role; some o que passou de 12; conclui ao chegar a 30.*

### 1.5 Atributos (9, escala 1–5; teto futuro 10)

| Físicos | Sociais | Mentais |
|---|---|---|
| **Força** | **Carisma** | **Percepção** |
| **Destreza** | **Manipulação** | **Inteligência** |
| **Vigor** *(ex-Constituição)* | **Aparência** | **Raciocínio** |

### 1.6 Habilidades (30 primárias, escala 0–5; teto futuro 10)

**Combate (7):** Briga · Armas de Corte · Armas de Impacto · Armas de Haste · Armas à Distância · Esquiva · Escudos
**Físicas / Mobilidade (5):** Atletismo · Resistência · Furtividade · Prontidão · Sobrevivência
**Sociais (6):** Lábia · Oratória · Etiqueta · Empatia · Intimidação · Manha
**Saber (5):** Investigação · Conhecimentos · Ocultismo · Medicina · Ciências
**Técnicas (7):** Craft · Ladinagem · Cavalgar · Performance · Tática · Política · Comércio

**Secundárias** são ilimitadas e específicas (Apêndice A).

> 🔧 O **tipo de dano** (corte/perfuração/impacto) é propriedade da **arma**, não da perícia.

---

## 2. Especialidade (Consistência)

- **Regra:** por ponto de Especialidade, role **+1d6** e **descarte o menor**.
- **Limite:** Especialidade usada ≤ nível na Habilidade.
- **Na defesa** (valor fixo): cada ponto vale **+1 fixo**.

*Exemplo: Base 3d6+2, Especialidade 2 → role 5d6+2 e descarte os dois menores.*

---

## 3. Stunts (Ações Cinematográficas)

| Nível | Bônus |
|---|---|
| 1 | +2 fixo |
| 2 | +1d6 |
| 3 | +2d6 |

---

## 4. Centelha (Tier de Poder)

A **Centelha** (1–5; teto futuro maior) é o nível de poder pessoal — a fagulha que cresce do mortal ao semideus.

1. **Reforça defesas:** **+⌈Centelha ÷ 2⌉** à Defesa (Esquiva/Bloqueio) e à Defesa Mental. *(C1–2 → +1; C3–4 → +2; C5 → +3.)*
2. **Dimensiona os pools** de Energia e Mana (§6.2).
3. **Destrava os Caminhos:** o nível L de um Caminho exige **Centelha ≥ ⌈L/3⌉** (§12).

Principal progressão pós-cap.

---

## 5. Virtudes, Vontade, Integridade e Defesa Mental

Quatro **Virtudes** (1–5), as mesmas de Exalted 2e:

| Virtude | Governa / resiste a |
|---|---|
| **Compaixão** | empatia, misericórdia — resiste a crueldade |
| **Convicção** | determinação — resiste a dor, tortura, desânimo |
| **Temperança** | disciplina, clareza — resiste a tentação, provocação, excesso |
| **Valor** | bravura — resiste a medo e intimidação |

**Traços derivados:**
- **Força de Vontade** = soma das **duas maiores** Virtudes (~5–8 inicial).
- **Integridade** = Compaixão + Temperança (escala 2–10). Trilha moral/compostura; degrada com trauma e atrocidades.
- **Defesa Mental** = **⌊(Integridade + Força de Vontade) ÷ 2⌋ + Centelha**. Valor passivo que ataques de Voz/Mente e influência precisam superar. *(Integridade baixa → Defesa Mental menor: você fica mais manipulável.)*

**Testes de resistência** rolam **Virtude + Atributo** (medo = Valor + Vigor; provocação = Temperança + Raciocínio; suportar dor = Convicção + Vigor).

**Gastar Força de Vontade** 🔧 *(valor exato a definir)* — usos previstos: melhorar um ataque, resistir a ataques sociais/mentais, ignorar penalidades, potencializar uma ação, e conjurar feitiços Arcanos.

**Canalizar Virtude:** 1×/cena por Virtude, numa ação coerente com ela, some a Virtude à soma base — a rolagem vira **Atributo + Habilidade + Virtude** (pool maior). *(Sem sistema de Limit.)*

---

## 6. Combate I — Fluxo, Iniciativa e Ticks

Combate roda numa **linha do tempo de Ticks**. Cada ação custa **Speed** (Ticks); após agir, você só joga de novo quando passarem.

- **Iniciativa** = **1d6 + Raciocínio + Prontidão**. Quem tira o maior começa (tick 0); cada outro entra na linha em **tick = (maior iniciativa − sua iniciativa)**.

### 6.1 Escala de Speed

| Ticks | Tipo de ação | Exemplos |
|---|---|---|
| 3 | Muito rápida | Correr, abrir porta, sacar arma |
| 4 | Utilitária | Pegar item, interagir com cenário |
| 5 | Ataque leve | Faca, adaga, espada curta, bastão |
| 6 | Ataque médio | Espada longa, machado 1 mão, lança, maça |
| 7 | Ataque pesado | Martelo de guerra, montante, alabarda |

> Armas leves agem **mais vezes**; pesadas batem forte mas te **expõem**. Aqui mora o "estilo da arma".

### 6.2 Reservas: Energia e Mana

- **Energia** (Caminhos de Corpo/Voz/Mente) = **(Centelha × 3) + soma das 4 Virtudes + Força de Vontade**. Generoso.
- **Mana** (Caminho Arcano) = **(Centelha × 2) + Força de Vontade**. Enxuto.
- 🔧 **Recuperação mista:** reserva que regenera devagar em combate e enche no descanso; Energia regenera mais rápido que Mana.

---

## 7. Combate II — Ataque e Defesa

### 7.1 Ataque

1. **Atributo + Habilidade** → dados (Xd6 + Y).
2. + **Acerto da Arma** (bônus fixo).
3. Aplique **Especialidade**, **Stunts** e **Técnicas** ativas. *(A Centelha **não** soma no ataque — seu bônus é só defensivo; a escalada ofensiva vem dos Caminhos.)*
4. Role e compare com a **Defesa**.

**Sucesso:** acerta se **Ataque > Defesa**. Empate = errou/defendido.

### 7.2 Defesa (valor fixo e passivo)

```
Defesa = (Destreza + Habilidade) × 2 − ⌊(Destreza+Habilidade) ÷ 4⌋
         + Especialidade (+1/ponto) + ⌈Centelha ÷ 2⌉ + modificadores
```

- **Esquiva** → Habilidade *Esquiva*; modificador de **Mobilidade**.
- **Bloqueio** → Habilidade = a **perícia da arma** (ou *Escudos*); modificador de **Defesa da Arma** / **Escudo**.
- Calibrada para **~38–46% de acerto entre iguais** de S=4 a 20.

### 7.3 Quase Acerto (A Raspagem)

🔧 Erro **dentro da Faixa** (= peso da arma: Leve 1 / Média 2 / Pesada 3) causa **dano fixo** = peso da arma, **não reduzido por Soak**. Sem Penetração para furar a armadura, não há Quase Acerto. *(Variante: Faixa = +1 por dado rolado — a calibrar.)*

---

## 8. Combate III — Dano e Armadura

### 8.1 Dano

```
Dano Final = (Dado da Arma + Força + Margem) − Soak
```

- **Dado da Arma:** Leve 1d6 · Média 2d6 · Pesada 3d6.
- **Força:** 1 mão soma ⌊Força/2⌋; 2 mãos soma Força inteira.
- **Margem:** +1d6 por **6 pontos** acima da Defesa (ver §1.2).

**Tipos:** Impacto (*Bashing*) · Corte (*Letal*) · Perfuração (*Letal*).

### 8.2 Soak

- **Natural:** 🔧 Impacto = **Vigor**; Letal = **⌊Vigor/2⌋**.
- **Armadura:** Soak adicional + Proteção contra perfuração (🚧 equipamentos).

### 8.3 Penetração e Ruptura

- **Penetração (0–3)** vs **Proteção:** se **Penetração ≤ Proteção**, perfuração **anulada (0)**.
- **Ruptura (Crush):** impacto pesado com tag *Crush* ignora o Soak de Impacto da armadura.

---

## 9. Combate IV — Pressão, Múltiplas Ações e 1-vs-Muitos 🚧

### 9.1 Múltiplos Ataques

| Ataques | Penalidades |
|---|---|
| 2 | 1º −1d6, 2º −2d6 |
| 3 | 1º −2d6, 2º −3d6, 3º −4d6 |

- **Penalidade defensiva:** cada ataque extra reduz **Esquiva −1** e **Bloqueio −2** até a próxima ação.

### 9.2 Desgaste de Defesa (onslaught)

- Um ataque só **desgasta** sua Defesa se valer **≥ metade** dela.
- **Bloqueio** degrada mais rápido; **Esquiva** resiste melhor a vários.
- 🔧 Cada atacante adicional corrói cumulativamente a Defesa → a multidão fura a guarda. A diferença de **Centelha** deixa o veterano ignorar golpes de novatos individualmente.

### 9.3 Modificadores Situacionais 🔧 (sugestões a calibrar)

- **Cobertura:** +2/+4/+6 na Defesa conforme parcial/boa/total.
- **Prono:** −Defesa contra corpo-a-corpo, +Defesa contra disparos.
- **Flanqueamento / pego de surpresa:** acelera o Desgaste de Defesa.
- **Alcance (disparos):** penalidade por faixa de distância (curta/média/longa).

---

## 10. Saúde, Ferimentos e Morte

### 10.1 Pontos de Vida
🔧 **PV = 25 + (Vigor × 3).**

### 10.2 Duas Trilhas de Dano
- **Impacto (Bashing)** — geralmente nocauteia.
- **Letal (Corte/Perfuração)** — fere de verdade.

O **total** (Bashing + Letal) determina os limiares.

### 10.3 Limiares de Ferimento (híbrido) 🔧

| Vida restante | Estado | Penalidade |
|---|---|---|
| 76–100% | Saudável | nenhuma |
| 51–75% | Machucado | −1 em ações |
| 26–50% | Ferido | −2 em ações, −1 Defesa |
| 11–25% | Grave | −3 em ações, −2 Defesa |
| 1–10% | Crítico | −4 em ações, −3 Defesa |
| ≤ 0 | Caído | incapacitado |

### 10.4 Nocaute vs Morte 🔧
- **Cair (≤0 PV):** incapacitado. Se o dano que derrubou for majoritariamente **Bashing**, está **inconsciente** (estabiliza/acorda).
- **Conversão:** Bashing após encher a trilha transborda como Letal.
- **Morte real:** somente quando **dano Letal acumulado ≥ PV Máximo**.
- 🔧 *Sugestões a fechar:* acerto que conecta causa no mínimo **1** de dano; quem está Grave/Crítico por dano Letal perde 1 PV por cena (sangramento) até ser estabilizado (teste de Medicina).

---

## 11. Recuperação e Cura 🔧

Recupera **Vigor** em PV por intervalo:

| Estado | Intervalo |
|---|---|
| Saudável (>75%) | por dia |
| Machucado/Ferido (50–75%) | a cada 3 dias |
| Grave (25–50%) | a cada 5 dias |
| Crítico (<25%) | por semana |

*(Bashing recupera muito mais rápido que Letal; Medicina e magia aceleram.)*

---

## 12. Caminhos — O Toolbox Unificado 🚧

Toda capacidade especial é um **Caminho**: track temático de até **15 níveis de Técnicas**. Unifica manobras marciais, perks sociais/mentais e feitiçaria.

### 12.1 Estrutura

- **Metacategorias mundanas:** **Corpo** (físicos) · **Voz** (sociais) · **Mente** (mentais). E o **Arcano** (feitiçaria).
- Cada metacategoria reúne **dezenas de Caminhos temáticos** — ex.: *Vento, Punho de Ferro, Pele de Pedra* (Corpo); *Voz de Mel, Máscara, Comando* (Voz); *Olho Aguçado, Mente Afiada, Vínculo Animal* (Mente).
- Cada Caminho: até **15 níveis**; o nível **L** exige **Centelha ≥ ⌈L/3⌉** e o nível anterior.
- Comprar uma Técnica custa **XP** + pré-requisito de Atributo/Perícia.

### 12.2 Bandas de Poder (mortal→semideus, ref. Scion)

| Centelha | Níveis | Banda | Sabor |
|---|---|---|---|
| 1 | 1–3 | Mortal+ | salto aprimorado, sedução, pensamento afiado, percepção animal |
| 2 | 4–6 | Herói | correr em paredes, equilíbrio em cordas, craft sobre-humano |
| 3 | 7–9 | Semideus | saltos de dezenas de m, andar na água, invisibilidade, encantar armas |
| 4 | 10–12 | Semideus | levitação, manipular memórias, ataque relâmpago, forçar a verdade |
| 5 | 13–15 | Quase-deus | voar, super força, teletransporte, curar doenças, cortar aço |

### 12.3 Ativação

- Técnicas de **Corpo/Voz/Mente** gastam **Energia** (não Mana). Passivas não custam; ativas custam Energia e/ou custo tático (Ticks, brecha na guarda).
- Técnicas de **Voz/Mente** ofensivas rolam **Atributo + Perícia** vs a **Defesa Mental** do alvo (§5). Comandos contra a natureza do alvo permitem gastar **Vontade** para resistir.

### 12.4 O Arcano (Feitiçaria) 🚧

- **Não** vinculado a atributo/perícia fixos; pré-requisito de **Ocultismo** + XP elevado.
- **Mais versátil** que os mundanos: efeitos amplos e combináveis, não lista rígida.
- Gasta **Mana**. Mergulho próprio.

---

## 13. Progressão & Criação 🚧

- **Eixos de XP:** Atributos (→10), Habilidades (→10), Especialidade, **Centelha**, **Caminhos/Técnicas**.
- **Centelha** é a progressão pós-cap principal.
- **Criação:** pontos iniciais, Centelha inicial, nº de Caminhos — a definir.

---

## Apêndice A — Habilidades Secundárias (ilimitada)

- **Sociais:** Atuação, Sedução, Liderança, Disfarce, Interrogatório.
- **Conhecimento:** Burocracia, Herbologia, História, Religião, Heráldica, Astronomia, Geografia, Alquimia, Arquitetura, Direito, Bestiário, Estratégia, Genealogia, Folclore.
- **Ofício/Profissão:** Ferraria, Carpintaria, Costura, Culinária, Joalheria, Couraria, Alvenaria, Mineração, Pesca, Agricultura, Navegação, Marcenaria, Armadureiro, Armeiro, Escrivania, Cartografia, Veterinário, Adestramento.
- **Expressão/Cultura:** Tocar Instrumento, Canto, Dança, Poesia, Pintura, Escultura, Caligrafia, Contação de Histórias.
- **Subterfúgio/Rua:** Jogos, Falsificação, Prestidigitação, Abrir Fechaduras, Contrabando, Apostar, Roubo, Ocultação, Vigilância Urbana.
- **Interior/Disciplina/Espírito:** Meditação, Ritualismo, Concentração, Leitura Corporal, Interpretação de Sonhos.

---

## Apêndice B — Pendências de Design

| # | Item | Status |
|---|---|---|
| 1 | Técnicas exemplares dos Caminhos (começar por Centelha 1) | 🚧 próximo |
| 2 | Sistema Arcano (feitiçaria versátil) | 🚧 |
| 3 | Custo das Técnicas + valor exato de gasto de Vontade + regen dos pools | 🔧 calibrar |
| 4 | Matriz de armas (estilo ≠ dano) + equipamentos/armaduras | 🚧 |
| 5 | Onslaught / 1-vs-muitos — formalizar e calibrar | 🚧 |
| 6 | Modificadores situacionais (§9.3) — fechar valores | 🔧 |
| 7 | Dano mínimo / sangramento / estabilização (§10.4) — confirmar | 🔧 |
| 8 | Criação de personagem (pontos, Centelha inicial, nº Caminhos) | 🚧 |

---

*v0.3 — documento vivo. Tudo marcado 🔧/🚧 está aberto a ajuste.*
