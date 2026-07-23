# Qual sistema eu uso? (fluxogramas de roteamento)

O Centelha tem muitos subsistemas, e o novato quase nunca trava na **regra**: trava em saber
**qual regra** aplicar. Esta página é um mapa de bolso. Comece pelo fluxo grande e, na dúvida de
uma bifurcação específica, veja o fluxo dela embaixo.

Regra zero, antes de tudo: **rola-se dado só quando há oposição ou risco real.** Se a coisa é
trivial e ninguém resiste, descreva e siga. Se um pedido cabe no nível da relação, é de graça
(ver Régua). O dado entra quando o resultado é incerto e importa.

---

## O grande roteador

```mermaid
flowchart TD
  Start(["Quero fazer algo e não sei a regra"]) --> Q0{"Há oposição ou risco real?"}
  Q0 -->|"Não, é trivial"| Livre["Descreva e resolva. Sem rolagem."]
  Q0 -->|"Sim"| Q1{"Sobre o quê você age?"}
  Q1 -->|"O mundo físico ou uma tarefa"| Tarefa["Ação comum: Atributo + Perícia vs Dificuldade"]
  Q1 -->|"Ferir o corpo de alguém numa luta"| Fisico["Combate Físico (ver 'Qual defesa física')"]
  Q1 -->|"A vontade, a mente ou o vínculo de alguém"| SM["Social ou Mental? (ver fluxo)"]
  Q1 -->|"Notar ou perceber algo"| PP["Percepção ou Perspicácia? (ver fluxo)"]
  Q1 -->|"Uma tarefa longa (forjar, pesquisar, cortejar sem pressa)"| Est["Ação estendida: Dificuldade + Intervalo + Acúmulo"]
```

---

## Social ou Mental? (o teste do "como")

A pergunta não é se a coisa é mágica. É **por onde ela age**.

```mermaid
flowchart TD
  A(["Quero mexer com outra pessoa"]) --> B{"O efeito passa pelo juízo dela?"}
  B -->|"SIM: ela ouve, pondera e decide (argumento, charme, sedução, ameaça, engano, ler o rosto)"| S["SOCIAL — rola vs Defesa Social"]
  B -->|"NÃO: entra direto na mente, contorna o juízo (ordem obedecida sozinha, emoção ou visão plantada, ler pensamento, controle)"| M["MENTAL — rola vs Defesa Mental"]
  S --> S2{"É o dia a dia ou uma cena decisiva?"}
  S2 -->|"Dia a dia: um pedido, um favor, construir um vínculo"| Regua["Régua de Relação (ver fluxo)"]
  S2 -->|"Cena tensa: dobrar alguém agora, custe o que custar"| CS["Combate Social (gastar Vontade para não ceder)"]
  M --> M2["Alvo pode gastar Vontade para blindar: pontual (nega um golpe) ou por cena/dia"]
  M --> M3["Ao sair de um controle percebido, nasce inimizade (salto no Desfavor da Régua)"]
```

Atalho: **Social = você não quer ceder. Mental = tentam tirar de você a escolha de ceder.**

---

## Os três medos

Medo é o caso que mais confunde, então tem régua própria.

```mermaid
flowchart TD
  F(["Algo assusta o personagem"]) --> F1{"De onde vem o medo?"}
  F1 -->|"Alguém tentando te assustar: grito, presença, demonstração de força"| FS["Defesa Social (intimidação)"]
  F1 -->|"Pavor mágico imposto: aura de lich, medo plantado sem motivo"| FM["Defesa Mental"]
  F1 -->|"A própria cena: um abismo, uma criatura enorme, o escuro da mata"| FB["Teste de Bravura (Valor)"]
```

---

## Régua de Relação ou Combate Social?

A Régua é o **default** do social. O Combate Social é a exceção, reservado às cenas grandes. Na
dúvida, é Régua. Ele **não** tem PV social nem dano: é a mesma jogada de influência, e resistir é
gastar Força de Vontade.

```mermaid
flowchart TD
  R(["Cena social com um alvo"]) --> R1{"O pedido cabe no nível atual da relação?"}
  R1 -->|"Sim (está dentro do que a disposição já dá)"| RFree["Concedido, sem rolar"]
  R1 -->|"Não, quero mais do que a relação dá"| R2{"Tem aposta alta E resistência declarada?"}
  R2 -->|"Não: um pedido, um favor, um papo, uma sedução comum"| RJ["Jogada única: Ataque Social vs Defesa Social move a Régua (+1 por sucesso, +1 a cada 6 de folga)"]
  R2 -->|"Sim: um julgamento, uma sedução decisiva, quebrar um inimigo"| RC["Combate Social: a mesma jogada de influência; para não ceder, o alvo gasta Força de Vontade (1 + Margem) por lance. Sem Vontade, cede e a régua anda"]
```

---

## Qual defesa física? (Esquiva ou Bloqueio)

```mermaid
flowchart TD
  D(["Vão te acertar no corpo"]) --> D1{"Como você se protege deste golpe?"}
  D1 -->|"Desviando com corpo e reflexo"| DE["Esquiva = (Destreza + Esquiva) x2 + Centelha + Esp."]
  D1 -->|"Aparando com arma ou escudo"| DB["Bloqueio = (Destreza + perícia que você escolher) x2 + Centelha + Esp. + defesa da arma/escudo"]
  DE --> N["Você usa a maior das duas; a ficha mostra ambas"]
  DB --> N
```

---

## Percepção ou Perspicácia?

Nomes parecidos, fronteira simples: **o mundo x as pessoas.**

```mermaid
flowchart TD
  P(["Quero notar algo"]) --> P1{"O que você tenta notar?"}
  P1 -->|"O mundo físico: um som, um cheiro, uma pegada, uma emboscada, um detalhe do cenário"| PPe["Percepção"]
  P1 -->|"Uma pessoa: o humor dela, a intenção, a mentira, o clima da sala"| PSa["Perspicácia"]
```

---

## Folha de bolso (sem diagrama)

- **Rola dado?** Só com oposição ou risco. Trivial, não. Pedido dentro do nível da relação, não.
- **Ação comum:** Atributo + Perícia vs Dificuldade (5 fácil / 10 média / 15 difícil / 20 limite
  humano). Supera o alvo = sucesso; cada 6 acima = +1 Margem.
- **Social x Mental:** passa pelo juízo = Social; contorna o juízo = Mental.
- **Régua x Combate Social:** dia a dia = Régua (jogada única); cena tensa = Combate Social
  (gastar Força de Vontade, 1 + Margem, para não ceder). Sem PV social nem dano.
- **Três medos:** intimidação = Social; medo mágico = Mental; medo da cena = Bravura (Valor).
- **Defesa física:** desviou = Esquiva; aparou = Bloqueio (usa a maior).
- **Percepção x Perspicácia:** o mundo = Percepção; as pessoas = Perspicácia.
- **Blindar a mente:** gastar Força de Vontade (pontual ou por cena/dia). Contra **leitura** não
  dá para se recusar: só o número da Defesa protege.

---

## Para futuras alterações

- **Reescala D6 (0–6 e 0–12):** em andamento. Plano de execução, mapa antes/depois e a lista de
  implementações futuras (Proezas/Feitiçarias do tier Desperto, re-ancoragem das dificuldades,
  migração do bestiário) estão em `Reescala.md`. Quando as escalas mudarem, os números citados
  neste fluxograma (Dificuldade 5/10/15/20, Defesa ×2, etc.) precisam ser revisados por lá.
- **Combate Social:** a versão canônica é a simplificada do site (`relacoes-sociais.md`), sem
  Firmeza/PV social. O doc de trabalho antigo `Combate_Social.md` (com Firmeza/canais) está
  **obsoleto**; não usar.
