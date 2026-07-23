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

- **Dificuldade:** proposta **×1,2** → **6 / 12 / 18 / 24 / 30 / 36** (Fácil/Média/Difícil/Limite
  humano/Excepcional/Sobre-humano), re-derivando as chances-alvo por simulação.
- **Armas, armaduras, stunts, modificadores situacionais, Quase-Acerto, Penetração:** decidir por
  peça se sobem junto ou se aceitamos que o "talento bruto" ganhou peso. Proposta inicial: manter
  como está e reavaliar após a simulação de durabilidade (o dano por Força já sobe com o teto).
- **Orçamentos e curva de XP:** maxar um atributo passa de 150 para 210 XP; revisar
  `orcamentoPadrao/Veterano/Heroico` e o ritmo por sessão para a criação não empobrecer.

Tudo isso será **re-simulado** (durabilidade, taxa de acerto, curva de XP) antes de travar, e o
`test-kael` (trava de regressão no build) atualizado junto.

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
- [ ] Fase 1 · réguas e textos
- [ ] Fase 2 · números fixos
- [ ] Fase 3 · Proezas renumeradas
- [ ] Fase 4 · fórmulas/derivados
- [ ] Fase 5 · re-simulação + test-kael
- [ ] Fase 6 · conteúdo (bestiário, Kael) — rodada seguinte
