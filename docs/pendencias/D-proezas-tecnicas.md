# D. Proezas e Técnicas

Detalhe em `Proezas_revisao.md`.

- [x] **D1 · [FAZER] Fase 3 da migração.** Matar a **banda** de vez (Velocidade independente por nível,
  apagar o campo `banda` e tirar do schema) e **surfar o modificador da trilha na UI**, mostrando o
  valor ao lado da Técnica.
  **Fechado na revisão da rodada 94 (23/09/2026), com prova:** `971b6f4` (17/07/2026) tirou a banda de dado, schema, validador e código e pôs o modificador ao lado da Técnica. Conferido hoje: nenhuma entrada de `tecnicas.json` tem `banda`, e a árvore de Técnicas mostra o modificador.
- [x] **D2 · [FEITO, achado na auditoria de memória de 08/09] Reconciliado.** O texto já bate com a
  régua (`tecnicas.json` traz "+3 em Furtividade", nível×3), não "+2" como este item ainda dizia.
- [ ] **D3 · [ADIADO] [DECIDIR] Densidade dos funis.** Caminhos reaproveitados têm ~3 Técnicas no nível 1
  (funil 3·2·1·1·1), mais enxuto que o padrão de Força. Alargar ou aceitar.
  **Adiado na rodada 96 (23/09/2026), por proposta do humano:** refinamento que ninguém sentiu falta em mesa.
- [x] **D4 · [SEM CAUSA 2026-08-17] O retag já estava feito; o item nasceu de uma leitura errada.**
  A frase da auditoria (**"Defesa Mental agora só aparece em Comando e Marionete"**) fala dos dois
  **Caminhos**, não de duas Técnicas, e "Marionete" ser também o nome de uma Técnica de nível 6 é a
  armadilha. Conferido no dado vivo: as **15 Técnicas** que citam Defesa Mental estão **todas** em
  Comando (9) e Marionete (6), que é exatamente o que o doc manda. As 12 que a auditoria nomeia
  estão lá; a 13ª é **Tom de Autoridade**, que **baixa** a Defesa Mental em 3 em vez de rolar contra
  ela, como o próprio doc prevê; e as outras duas são **Ordem que Pesa** e **Impulso Plantado**, as
  de nível 2 nascidas depois, na Fase 6 da Reescala, nos mesmos dois Caminhos. Nenhuma Técnica que
  a auditoria manda para a Social cita Defesa Mental. **O lado Social não precisa de marcação:** o
  capítulo de Relações Sociais faz da Defesa Social o alvo padrão, e a Mental é a exceção, que é o
  que se marca. O Arcano também está tagueado, com 15 Efeitos citando Defesa Mental. Sobra só um
  detalhe cosmético, registrado e não corrigido: 17 Técnicas sociais marcam o alvo padrão e 15
  vizinhas, de mesmo efeito, não marcam.
- [ ] **D5 · [FAZER] Reorg de conteúdo.** As árvores novas do doc (Atlas reorganizado, Força de
  Guerra, Presença Aterradora, Arremesso, Salto, Vigarista/Confessor, as novas de Perspicácia) ainda
  não entraram na data viva.
- [ ] **D6 · [ADIADO] [DECIDIR] Custo de Técnica e de Arte em ×10.** Ficou de fora da recalibração de XP de
  propósito (largura segue sendo o gasto caro). Confirmar que fica.
  **Adiado na rodada 96 (23/09/2026), por proposta do humano:** refinamento que ninguém sentiu falta em mesa.
- [x] **D7 · [FECHADO por substituição, 28/09/2026] Bônus de Centelha em ataque e defesa.** Levantado em
  24/09/2026: `centelha.md:44` e `:65` diziam "+1 por ponto de Centelha" no ataque e nas Defesas;
  `regras.json:114` (nota de `escalasProeza`) dizia "+2/ponto de Centelha". A Reforma da Centelha
  (despacho `docs/simulacao/caixa/reforma-centelha-briga-despacho.md`) não escolheu um dos dois:
  substituiu a fórmula inteira por **2 × menor(Centelha, Habilidade)** em toda jogada e Defesa, com
  a Centelha do atacante somando inteira (sem teto) só no dano. `calc.ts`, `combate-resumo.ts`,
  `lance.ts`, `grid.astro`, `motor.mjs`, `lib-bestiario.mjs` e os capítulos `centelha.md`,
  `combate.md`, `defesas.md` foram alinhados nessa rodada (commit `adfbb5d7` e o commit desta Fase
  2). Ver **D12** para a jogada só-de-Atributo, que ainda usa a regra antiga.
- [ ] **D8 · [DECIDIR] Mãos Hábeis: +3 ou +2 em Ofícios?** Levantado em 24/09/2026.
  `tecnicas.json:6076` dá "+3 em Ofícios" (a régua de nível 1 da trilha Bônus); `Proezas_revisao.md:606`
  dá "+2". O caso é o mesmo do D2 (o doc ficou na régua velha), mas a Técnica pesa direto no
  ganho por ofício e pede confirmação antes de mexer.
- [ ] **D9 · [ADIADO] [FAZER] Esquiva Impossível: marcar `pendente: true`.** Decisão do autor
  (26/09/2026, análise externa via ChatGPT desktop, `docs/calibracao/discussao/
  decisoes-entendimento.md`, item 3a): `esquiva-impossivel` (`tecnicas.json`) fica sem efeito
  determinável (não inventar a partir do nome, nível ou custo), e a Técnica deve virar
  `pendente: true` só DEPOIS que a régua (a recalibração de custo/nível das Técnicas, item D6)
  fechar. Ainda não aplicado. **Adiado até a régua fechar**, por decisão do próprio autor.
- [ ] **D10 · [DECIDIR] Novo escopo da Prestidigitação.** Registrado pelo autor em 27/09/2026
  (item 7d do despacho da Regra do Quase-Acerto), sem resolver. Proposta: "mãos hábeis sob os
  olhos dos outros" (furto e plantar objetos, trapaça em jogos, sabotagem discreta, truques de
  mão); Abrir Mecanismos continua com fechaduras e armadilhas. Texto do livro ainda por escrever;
  hoje Prestidigitação e Abrir Mecanismos já existem como conceitos em
  `src/content/chapters/acoes-sentidos-e-engano.md:87-94` e `habilidades-secundarias.md:107`, sem
  o reescopo.
- [ ] **D11 · [DECIDIR] Proeza de Quase-acerto, com duas alavancas.** Registrado pelo autor em
  27/09/2026 (item 7e do despacho da Regra do Quase-Acerto), sem resolver. Uma Proeza/Técnica que
  mexa no Quase-Acerto teria duas alavancas possíveis e independentes: o **dano do raspão** (a
  metade que a arma carrega) e a **Margem** (a metade que soma arma e armadura). Decidir se a
  Proeza mexe numa, na outra, ou nas duas, e o preço de cada caminho.
- [x] **D12 · [FECHADA] Jogada só-de-Atributo, sem Habilidade que sirva de teto.** Registrado em
  28/09/2026, item 1 da Reforma da Centelha. A fórmula nova (2 × menor(Centelha, Habilidade)) exige
  uma Habilidade para travar o bônus; jogadas que rolam **só Atributo** (Vontade pura, Resistir sem
  perícia, alguns testes de Bravura) não têm esse segundo termo. **Decidido pelo autor em
  01/10/2026**: fica assim de propósito, +1 por ponto de Centelha sem teto, como regra oficial (não
  mais "regra de primeira versão" sobrevivendo por acaso). `calc.ts` traz
  `centelhaSoAtributo(centelha)`; a regra está escrita em `src/content/chapters/centelha.md`, junto
  ao item 1 da Reforma.
  **Precisado pelo autor em 02/10/2026** (correção da Reforma, Adendo 1): "jogada só de Atributo" é o
  TIPO de jogada que o Mestre pede ("role Destreza"), e não o personagem com Habilidade 0. "Role
  Destreza + Atletismo" com Atletismo 0 leva bônus 0, pelo 2 × menor; só a jogada de Atributo puro
  pedida leva a Centelha inteira. Os exemplos acima ("Vontade pura", "Resistir sem perícia",
  "testes de Bravura") são de antes dessa precisão e não valem como lista. O critério, verbatim do
  autor (o mesmo de `centelha.md:44`): "O Mestre pede uma jogada de Atributo puro só quando nenhuma
  Habilidade do livro cobre a ação. É sempre o Mestre quem decide, e não o jogador. Se existe
  Habilidade que cubra, ela é pedida, e quem não a tem leva bônus 0." Os dois casos que seguiam com
  o autor foram decididos em 02/10/2026 (despacho dos achados de duas leituras): a provocação do orc
  (`racas.md:169`) é Força de Vontade × 2 + 2 × mín(Centelha, Integridade), como na Defesa Mental;
  e o teste de Virtude não leva a Centelha (achado 16 da Revisão 119).
- [ ] **D13 · [DECIDIR] Proeza "punho como arma média".** Registrado em 28/09/2026, Fase 3 da
  Reforma da Centelha/Briga (item 3). O desarmado (`armas.json:1278`, id `desarmado`) subiu de
  acerto 0 → 1 e defesaArma 0 → 1 nessa rodada, mas continua classe **leve** no Quase-Acerto (dano
  médio 1,5) e na régua de dano (1d6−2). Uma Proeza/Técnica que fizesse o punho valer como arma
  **média** (Briga séria, estilo de combate desarmado avançado) foi cogitada e não implementada:
  decidir se existe, o que ela muda exatamente (classe de QA? dado de dano? as duas?) e o custo.

- [ ] **D14 · [ADIADO] [DECIDIR] Custo de Habilidades a revisar depois da Parte B.** Registrado
  em 28/09/2026, no despacho da Reforma da Centelha ("Pendências a registrar"): a regra nova
  (2×menor(Centelha,Habilidade) em toda jogada/Defesa, sem teto no dano) valoriza a Habilidade
  alta mais do que a régua antiga (+1×Centelha flat), porque agora é ela quem decide o teto do
  bônus de Centelha, não só o próprio valor da perícia. O preço de XP das Habilidades (capítulo
  de Criação de Personagem) não foi revisado para refletir esse ganho a mais no topo. Adiado
  pelo próprio despacho até a Parte B (a rodada de recalibração econômica, ainda não retomada
  nesta frente) fechar; não decidir nem mexer em preço agora.
- [ ] **D15 · [ADIADO] Botão de Atributo puro.** Registrado em 02/10/2026, decisão do autor no
  despacho dos achados de duas leituras (item 17): sem botão de jogada de Atributo puro na ficha nem
  no Grid por enquanto. O Mestre faz a conta à mão (a Centelha inteira, pela D12).
  `centelhaSoAtributo` (`src/lib/calc.ts`) segue sem chamador.
- [ ] **D16 · [DECIDIR] O que sobrou do Fôlego: as nove Técnicas da Coração Incansável e o campo
  `folego` das armas.** Registrado em 03/10/2026 (D-016, rodada de pendências, Bloco C). O Fôlego saiu
  do sistema (capítulo, reserva, ficha, mesa, condição "Sem fôlego"), mas, por decisão do autor, ficam
  nos dados, ocultos e inertes:
  - as nove Técnicas com `modulo: "folego"` da Proeza `coracao-incansavel` (`folego-profundo`,
    `segundo-vento`, `marcha-forcada`, `incansavel`, `pulmoes-de-ferro`, `sem-limites`,
    `vigor-inesgotavel`, `coracao-eterno`, `folego-de-sobra`), que `src/lib/modulos.ts`
    (`tecnicaDisponivel`) mantém fora da ficha e das listas;
  - o campo `folego` de cada arma (`armas.json`) e dos schemas (`scripts/validate-data.mjs`,
    `src/content.config.ts`), que nenhuma tela mostra mais.
  Decidir o destino de cada um junto com a recalibração das Proezas.
- [ ] **D17 · [DECIDIR] Revisar as fichas de exemplo (Kael, Sora, Veil, Bram) ao fim da revisão do sistema.**
  Registrado em 04/10/2026, rodada 10 do veterana-1e (D-053). As fichas são só direcionamento. Elas ficam
  como estão até o fim da revisão do sistema, quando o autor volta a elas.
  - Bram precisa do corte das Artes ao nível 3, com total 1401 (D-044). A seção dele na Criação
    (`criacao-de-personagem.md:151` em diante, a linha de abertura em `:153`) continua com as Artes no
    nível 5 e não foi tocada.
  - Pontos do veterana-1e pulados por D-053, para quando o autor voltar às fichas:
    - N1 (a Sociabilidade de Veil);
    - ART-26 (Derivados, "Cabe no orçamento", nota Pendente com "quatro exemplos", Exceção declarada de
      Veil);
    - BRAM (abertura, Secundárias, Artes, frase final, Total);
    - TECNICAS-EXEMPLOS (as contagens e os totais da decisão 36: 1065, 1323, 1864);
    - C20a (Atributos 415, Habilidades 208, Virtudes 74 de Bram);
    - ART-25 (Acerto Arcano nas Secundárias de Veil e de Bram).
  - BRAM também pede o título novo da seção O mortal-tocado ("magia como estudo, com teto de Centelha") e
    o parágrafo de abertura reescrito. A seção já foi reescrita pela D-038, com texto do autor, e na
    rodada 10 entrou só a troca da frase da Mana ("uma reserva separada da Vontade e do mesmo valor dela").
    O título e o resto do parágrafo do BRAM esperam o autor.
  - **A D-047 precisa ser revista pelo autor: a troca não existe.** A linha de Técnicas das fichas não
    nomeia Técnicas, só dá uma contagem (Kael "29 | 450", Sora "35 | 590", Veil "34 | 615", Bram "12 |
    120").
    - No catálogo (`tecnicas.json`), "todas as de" cada Proeza até o nível da ficha dão Kael 19 (285 XP),
      Sora 19 (270), Veil 23 (375) e Bram 6 (60).
    - Três delas pedem uma Técnica de outra Proeza que a ficha não tem:
      - Encontrão Relâmpago (Kael, Vento 3) pede o Golpe Pesado, de Punho de Ferro;
      - Comando Inspirador (Sora, Comando 3) pede a Presença Imponente, de Lenda Viva;
      - Investida Devastadora (Veil, Punho de Ferro 3) pede o Salto do Grilo, de Vento.
    - As outras Técnicas de nível 3 dessas Proezas já estão na contagem, e no catálogo inteiro não há
      nenhuma Técnica de nível 3 sem pré-requisito.
    - A opção "fica sem" daria Kael 18 (265 XP, total 1045), Sora 18 (250, total 1303) e Veil 22 (355,
      total 1844).
    - Escolha do Arquiteto na rodada 10: (c), as fichas não mudam e o caso vai ao autor.
    - Respondido pelo autor em 04/10/2026 (D-059): as fichas ficam sem a Técnica (Kael 1045, Sora 1303,
      Veil 1844), aplicado só ao fim da revisão, e o Arquiteto pergunta antes de mexer.
  - A "Exceção declarada" de Veil (`criacao-de-personagem.md`, seção Veil) ainda diz "o teto de criação é
    Centelha 3". A D-055 tirou esse teto, mas a frase é da ficha (D-053) e espera a revisão.
  - Fora das fichas de exemplo, na ficha do site: `src/lib/ficha-engine.ts:174-175` ainda marca o teto
    de Arte Centelha + 2 como TOLERÂNCIA ("ainda não é definitivo", LEVANTA QUANDO o autor fechar o
    teto do mortal), e o comentário de `:177` diz "provisório". O teto foi fechado pela D-006 e saiu do
    livro como "provisório" na rodada 8. O código não foi tocado (rodada 12, ordem do Arquiteto).
