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
- [ ] **D7 · [DECIDIR] Bônus de Centelha em ataque e defesa: +1 ou +2 por ponto?** Levantado em
  24/09/2026, numa leitura da frente de economia. `centelha.md:44` e `:65` dizem "+1 por ponto de
  Centelha" no ataque e nas Defesas; `regras.json:114` (nota de `escalasProeza`) diz "+2/ponto de
  Centelha". Decidir qual vale e alinhar o outro, conferindo também o que o motor usa.
- [ ] **D8 · [DECIDIR] Mãos Hábeis: +3 ou +2 em Ofícios?** Levantado em 24/09/2026.
  `tecnicas.json:6076` dá "+3 em Ofícios" (a régua de nível 1 da trilha Bônus); `Proezas_revisao.md:606`
  dá "+2". O caso é o mesmo do D2 (o doc ficou na régua velha), mas a Técnica pesa direto no
  ganho por ofício e pede confirmação antes de mexer.
- [ ] **D9 · [ADIADO] [FAZER] Esquiva Impossível: marcar `pendente: true`.** Decisão do autor
  (26/09/2026, análise externa via ChatGPT desktop, `docs/export/proezas/chatgpt/
  decisoes-entendimento.md`, item 3a): `esquiva-impossivel` (`tecnicas.json`) fica sem efeito
  determinável (não inventar a partir do nome, nível ou custo), e a Técnica deve virar
  `pendente: true` só DEPOIS que a régua (a recalibração de custo/nível das Técnicas, item D6)
  fechar. Ainda não aplicado. **Adiado até a régua fechar**, por decisão do próprio autor.

