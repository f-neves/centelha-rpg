# Reescala para régua D6 (0–6 e 0–12)

Documento-mestre da migração das escalas do Centelha, do formato **0–5 / 0–10** para
**0–6 / 0–12**, mais harmônico com o D6 (o dado é d6; a régua passa a caber nele). Aqui ficam as
decisões travadas, o mapa antes/depois, a re-ancoragem dos números fixos, o escopo desta rodada e
a lista de implementações futuras. É o plano de execução; conforme cada fase roda, marco aqui.

---

## Decisões travadas (jul/2026)

1. **Traços não-Centelha (Atributos, Perícias, Virtudes, Antecedentes): estender o teto.** Os
   números das fichas atuais **ficam iguais**; o **6** é um novo degrau de **pico humano** no topo.
   Só re-descrevemos os níveis e re-ancoramos as dificuldades. Migração mínima de fichas.
2. **Centelha: aceitar o micro-bump.** Mantemos os multiplicadores limpos (Centelha ×1 nas
   defesas e no ataque, ×3 na Energia, ×2 na Mana). Renumerar a Centelha dá +1 pequeno degrau
   nesses derivados no mesmo tier; **o combate entre pares não muda** (o bônus é simétrico).
3. **Proezas: renumerar para 6 níveis.** As Técnicas sobem (N2→N3, N3→N4, N4→N5, N5→N6),
   deixando o **slot N2 (Desperto) vazio** para conteúdo futuro. Custos e trilhas acompanham.
4. **Escopo desta rodada: só réguas, regras e custos.** NÃO migramos as 300+ criaturas nem o
   Kael agora; fica como passo seguinte, com notas neste doc.

**Nota de subsistema (jul/2026):** o Combate Social foi **simplificado** e não usa mais Firmeza
(PV social), dano, armadura nem canais. É a mesma jogada de influência (Ataque Social vs Defesa
Social); resistir = gastar **1 + Margem** de Vontade. Logo, **Firmeza sai do inventário de
reescala** (não existe mais como derivado). A versão canônica é a do site
(`src/content/chapters/relacoes-sociais.md`).

---

## A reclassificação da Centelha

Insere-se um degrau (**Desperto**) nos primeiros níveis. O topo (Semideus) **não fica mais
poderoso**: só é renumerado de 5 para 6. Um personagem que era Centelha 2 (Herói) passa a ser
Centelha 3 (Herói), mesma potência de tier.

| Valor novo | Rótulo | Era |
|:---:|---|---|
| **0** | Mortal | 0 Mortal |
| **1** | Tocado | 1 Tocado |
| **2** | **Desperto** | *(novo degrau)* |
| **3** | Herói | 2 Herói |
| **4** | Grande Herói | 3 Grande Herói |
| **5** | Lendário | 4 Lendário |
| **6** | Semideus | 5 Semideus |

**Gating Proeza↔Centelha preservado:** a regra "nível N de Proeza exige Centelha ≥ N" continua
1-para-1. Com a renumeração, a Proeza N3 (Herói) exige Centelha 3 (Herói), exatamente como a
antiga N2 exigia a antiga Centelha 2. O slot **N2 (Desperto)** existe mas fica **sem Técnicas**
até o conteúdo do tier ser criado.

---

## Mapa antes/depois (o que muda em cada escala)

| Escala | Arquivo/chave | Antes | Depois |
|---|---|---|---|
| Atributos (9) | `atributos.json` `niveis` | 1–5 (add descrição do 6) | 1–6, pico humano = 6 |
| Perícias | `regras.escalaHabilidade` | 0–5 (Leigo→Mestre) | 0–6 (novo topo acima de Mestre) |
| Virtudes (4) | `virtudes.json` `niveis`+`conduta` | 1–5 (add 6) | 1–6 |
| Centelha | `regras.escalaCentelha` | 0–5 | 0–6 + Desperto (tabela acima) |
| Antecedentes | `Antecedentes.md` | 1–5 | 1–6 |
| Níveis de Proeza | `tecnicas.json.nivel`, `escalasProeza.trilhas`/`mostradores` | 1–5 | 1–6 (renumera 2→3…5→6; N2 vazio) |
| Níveis de Arte | `artes.json`, gating | 1–5 | segue a Centelha (ver "futuras") |
| Aparência | `regras.escalaAparencia`+`aparencia.curva` | 1–10 (−4…+4) | 1–12, curva re-spread |
| Força de Vontade | `regras.escalaVontade` | ~1–10 | 1–12 |
| `limitesCriacao` | `regras.json` | atrib 4 / hab 3 / cent 2 / pico 5/4 | remapear (proposta: 5 / 4 / 3 / pico 6/5) |
| Dificuldade | `regras.dificuldade` | 5/10/15/20/25/30 | **re-ancorar** (ver abaixo) |
| Especialidade | ≤ perícia | ≤ 5 | ≤ 6 |

Derivados que **acompanham sozinhos** (a fórmula não muda, só o teto do insumo sobe): PV
(25+Vig×3, máx 40→43), Defesas, Defesa Mental, Energia, Mana, Fôlego, Integridade (2–10 → 2–12).

---

## Re-ancoragem dos números fixos (o ponto sensível)

O combate **entre pares** é imune à reescala (ataque e defesa saem do mesmo Atributo+Perícia).
O que precisa de mão são os números **absolutos**, que ficam relativamente mais fracos com pools
maiores (até 6d6, média 21 contra 17,5):

- **Dificuldade (RESOLVIDO):** sob "estender o teto", o mundo comum não muda, então a régua
  **mantém os valores 5 / 10 / 15 / 20 / 25 / 30**; só o **topo** se re-descreve, porque o pico
  humano subiu de soma 10 para **soma 12** (6d6). Verificado por simulação: Dif 20 = "Muito
  difícil" (mestre, soma 10, ~22%); Dif 25 = "Limite humano" (pico soma 12, ~14%); Dif 30 =
  "Sobre-humano" (~1%, exige Centelha). Nada de ×1,2: aquilo valeria para um "esticão", não para a
  extensão de teto escolhida.
- **Armas, armaduras, stunts, modificadores situacionais, Quase-Acerto, Penetração:** mantidos
  como estão nesta rodada; o dano por Força já sobe com o teto. Reavaliar se a mesa achar que o
  stat cru pesou demais.
- **Orçamentos e curva de XP (provisório):** maxar um atributo passa de 150 para 210 XP;
  `orcamentoPadrao/Veterano/Heroico` subiram para **1700 / 2200 / 2900** (provisório, afinar com o
  jogo). `limitesCriacao` agora **atributo 5 / habilidade 4 / centelha 3 / pico 6 / 5**.

**Observação de balanceamento (expert):** a fórmula de Defesa **atual** do `calc.ts` é `(Des+per)×2
+ Centelha` (SEM o `−⌊soma/4⌋` do doc antigo), então o combate entre iguais já era defensivo e
fica mais no topo: ~37% de acerto em soma 6, ~28% em soma 12. A reescala estende o topo até soma 12
(28%). A durabilidade do pilar segue (pico Vig 6, PV 43, cai em ~4,3 golpes que conectam), mas
lutas no topo têm muitas erradas. Não é bug da reescala; se incomodar, revisitar a fórmula de
Defesa (reintroduzir o `−⌊soma/4⌋` ou baixar o mult) numa passada à parte.

---

## Plano em fases

- **Fase 1 · Réguas e textos:** `escalaCentelha` (+Desperto), `escalaHabilidade`, `escalaAparencia`,
  `escalaVontade`, `niveis` de atributos e virtudes (add o 6), nomes dos tiers de Proeza. Só
  descrição/rótulo; risco baixo.
- **Fase 2 · Números fixos:** re-ancorar Dificuldade, `limitesCriacao`, orçamentos, mostradores;
  decidir armas/armaduras/stunts/situacionais.
- **Fase 3 · Proezas (renumerar):** `tecnicas.json.nivel` 2→3…5→6; `escalasProeza.trilhas` e
  `mostradores` ganham a 6ª entrada (valores do N2/Desperto provisórios, ver "futuras");
  custos por nível acompanham. Gating checado.
- **Fase 4 · Fórmulas/derivados:** `calc.ts`, gating, `regras.json`.
- **Fase 5 · Re-simulação e regressão:** durabilidade, acerto, XP; atualizar `test-kael`.
- **Fase 6 (passo seguinte, fora desta rodada):** migrar bestiário (300+), Kael, exemplos.

---

## Implementações necessárias futuras (anotado)

- **Proezas do tier Desperto (Proeza N2):** criar as Técnicas do novo degrau em cada subcaminho
  (hoje o slot N2 fica vazio após a renumeração). É a maior lacuna de conteúdo criada pela
  reclassificação.
- **Feitiçarias/Artes do tier Desperto:** idem para o Arcano, conforme o gating Centelha↔Arte for
  redefinido para 6 tiers.
- **Valores das trilhas/mostradores de Proeza no N2 (Desperto):** hoje entram provisórios
  (interpolados entre N1 e N3); afinar quando o conteúdo do tier for desenhado.
- **Migração do bestiário e do Kael:** remapear builds que codificam Centelha 2–5 (viram 3–6) e
  regerar via `gen-bestiario.mjs`; atualizar exemplos do livro (Kael/Sora/Veil).
- **Re-ancoragem final dos números fixos:** travar Dificuldade e o resto após a simulação.
- **Descrição do novo topo dos traços (o "6"):** o pináculo humano acima do antigo "Mestre/5"
  precisa de texto próprio em cada atributo, perícia e virtude.

---

## Estado

- [x] Firmeza removida do inventário; fluxograma corrigido.
- [x] **Fase 1 · réguas e textos** — `escalaCentelha` (0–6 + Desperto), `escalaHabilidade` (+6),
  `escalaAparencia` (1–12), `escalaVontade` (+12), níveis 6 de atributos e virtudes. Capítulos
  `centelha.md` (tiers, tabelas, prosa), `atributos-e-pericias.md`, `aparencia-virtudes-vontade.md`
  (curva 1–12), `criacao-de-personagem.md` alinhados.
- [x] **Fase 2 · números fixos** — dificuldade re-descrita (topo), `limitesCriacao` (5/4/3, pico
  6/5), orçamentos (1700/2200/2900), `escalasProeza` trilhas+mostradores com 6 entradas (Desperto
  provisório), `aparencia.curva` 1–12.
- [x] **Fase 3 · Proezas renumeradas** — 264 Técnicas: `nivel` 2→3…5→6, mesmo delta no
  `custo.energia`. Nível 2 (Desperto) fica vazio. Schemas (`validate-data.mjs` e `content.config.ts`)
  subiram para max 6.
- [x] **Fase 4 · fórmulas/derivados** — `ficha-engine.ts` (bolinhas até 6/12, caps de criação e
  evolução, especialidade até 6, labels). `calc.ts` não muda (fórmulas agnósticas de escala).
- [x] **Fase 5 · re-simulação** — dificuldade e durabilidade validadas; `test-kael` verde (Kael
  intocado, por Q4). Build completo verde.
- [~] **Fase 6 · conteúdo** (em andamento):
  - [x] **Bestiário migrado** — 148 criaturas com Centelha ≥2 bumpadas +1 (delta linear direto em
    `inimigos.json`: +1 em defesa/defM/defSocial/cada soak e no acerto do pool); `monsters.json`
    regenerado. A fonte `gen-bestiario.mjs` (17 builds inline + `conversao-monstros.html`) ainda tem
    os valores antigos: se regerar do zero, reaplicar o +1 nos ≥2.
  - [x] **Kael migrado** — Centelha 2→3 (Herói); `test-kael.mjs` atualizado (Defesa 17, Def.M 13,
    Energia 27, Mana 13, Salto V256/HP5/HC14). Build verde.
  - [ ] **Redesenhar as 3 fichas de exemplo** (Kael/Sora/Veil no cap. de Criação): custos, tiers e
    derivados mudaram; hoje marcadas com callout "Em recalibração".
  - [ ] **Criar as Proezas/Feitiçarias do tier Desperto** (nível 2, hoje vazio) e afinar os valores
    provisórios das trilhas no N2.
  - [ ] **Alinhar gating das Artes** (ainda 1–5) à Centelha 6, se forem renumeradas como as Proezas.
  - [ ] Varrer menções de escala restantes em `combate.md`/`arcano`.
