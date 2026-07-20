# Relatório de Game Design · Centelha

Análise de um especialista externo, lendo o sistema como se fosse a primeira vez. O objetivo
declarado do Centelha é ser **D&D encontra Exalted**: personagem totalmente customizável (sem
classe nem nível), mundo coeso com criaturas e relações complexas ao estilo Exalted, mas
**combate menos mortal** do que o de Exalted (nada de a luta acabar num golpe monstro de um
dos lados).

Este documento avalia o quanto o sistema entrega essa visão, aponta o que pode ficar mais
claro para quem chega agora, e propõe ajustes. Onde afirmo um número, ele saiu de simulação
da própria matemática do jogo (pool Xd6 + 2 se soma ímpar, sucesso = supera o alvo). Todos os
achados estão priorizados no fim, na seção 12.

> Convenção deste relatório: 🟢 está bom, mantenha · 🟡 funciona mas dá para clarear ou afinar
> · 🔴 problema real de balanceamento ou de clareza que recomendo mexer.

---

## 1. Veredito geral

O Centelha é um sistema **maduro, bem pensado e surpreendentemente coeso** para um homebrew.
As três grandes apostas de design (Centelha como tier de poder no lugar de nível, o toolbox de
Proezas como customização infinita, e os três subsistemas de defesa) se sustentam e conversam
entre si. A matemática de combate está calibrada de verdade, não no chute. O sistema social é
mais fundo e mais coerente do que o de 90% dos RPGs publicados.

O risco do Centelha **não é ser fraco, é ser demais**. Ele tem muitos subsistemas paralelos
(combate físico, combate social, régua de relação, três defesas, quase-acerto, sangramento,
fôlego, energia e mana, hordas, aparência como traço próprio) e cada um deles é elegante
isoladamente. O trabalho que falta não é somar mecânica, é **sequenciar o aprendizado** e
**garantir que dois subsistemas nunca deem respostas diferentes para a mesma pergunta**. Um
jogador de primeira viagem hoje encara uma parede de sistemas sem uma trilha clara de "aprenda
isto primeiro".

A boa notícia: como especialista, mexeria em pouca coisa **de fundo**. A maioria das
recomendações é de clareza, de sequência de apresentação, e de meia dúzia de números.

---

## 2. Os nove atributos: estão claros e bem feitos?

A revisão social (trocar Carisma/Manipulação/Aparência por **Influência / Perspicácia /
Compostura**, e tirar a Aparência para um traço à parte) foi uma das melhores decisões do
projeto. 🟢

O modelo antigo do World of Darkness (Carisma vs Manipulação) sempre confundiu jogadores porque
a fronteira é borrada (todo carisma manipula). O trio novo divide por **verbo**, e isso é
limpo:

- **Influência** = eu ajo sobre você (mover, persuadir, comandar).
- **Perspicácia** = eu leio você (emoção, intenção, mentira).
- **Compostura** = eu controlo o que mostro de mim (a máscara, o aprumo).

Essa tríade "agir / ler / conter" é a mesma lógica útil que Físicos (Força potência /
Destreza precisão / Vigor aguentar) e Mentais (Percepção notar / Inteligência saber /
Raciocínio reagir). O paralelismo entre as três colunas é forte e ajuda a memorizar. 🟢

Pontos a clarear:

- 🟡 **Compostura faz trabalho pesado demais e isso não é óbvio.** Ela entra na Defesa Social,
  na Firmeza (PV social), no raio de mascaramento da Aparência, e é o "autocontrole". Para um
  novato, "Compostura" soa passivo e pouco atraente na hora de gastar pontos, mas mecanicamente
  é o Vigor do combate social. Vale um box na criação dizendo em uma linha: **"Compostura é o
  seu Vigor social: quanto você aguenta antes de ceder."**
- 🟡 **Percepção vs Perspicácia** vão se confundir na mesa (nomes parecidos, ambos "notar").
  A fronteira é boa (Percepção = o mundo físico e os sentidos; Perspicácia = as pessoas), mas o
  nome é um risco. Se não quiser renomear, ponha os dois lado a lado numa tabela de contraste na
  página de atributos: "farejar um cheiro = Percepção; farejar uma mentira = Perspicácia".
- 🟢 Manter só 9 atributos (contra os 8+ de Exalted que fundem coisas) foi acertado. Não
  aumentaria nem diminuiria.

---

## 3. A Centelha e como ela interfere no combate

A Centelha é o coração da identidade do jogo e o substituto do "nível". Conceito: 🟢 excelente.
Escala mortal (0, 95% das pessoas) até semideus (5), destrava as Proezas, dimensiona os pools.
É o Scion/Exalted bem traduzido.

O ponto delicado é **o bônus de combate da Centelha**, que passou de ×2 para **+1 por ponto**,
somado igual ao ataque e às quatro defesas.

**Análise.** A simetria (o mesmo +1 no ataque e na defesa) é matematicamente correta para o
objetivo declarado: entre Centelhas iguais o bônus cancela e o duelo joga limpo; contra
Centelha menor, cada ponto de diferença vira vantagem real. Isso é elegante e evita a inflação
que o ×2 causaria. 🟢

Mas há uma consequência que precisa estar consciente:

- 🟡 **O tier, sozinho, quase não decide o combate.** Uma diferença de 2 pontos de Centelha
  (um Herói C2 contra um Tocado C0... digo C0 não tem Centelha; um C3 contra um C1) dá +2 de
  vantagem líquida no ataque e na defesa. Perto do baseline, cada ±1 vale ~6% de chance, então
  2 pontos de Centelha ≈ 12% de vantagem de acerto. É perceptível, não é esmagador. **Quem faz
  o semideus destruir o mortal são as Proezas, não o número da Centelha.** Isso está alinhado
  com o pilar "combate não começa com risco de one-shot", mas contradiz um pouco a fantasia de
  "sou um tier acima, sinto isso a cada golpe". Se você quer que a diferença de tier **pese
  mais na pele** sem voltar ao one-shot, a alavanca certa não é o bônus de acerto (que é
  simétrico), é a **Absorção**: a Centelha já soma no Soak (+1/ponto em Impacto, e é o único
  Soak natural em Corte/Perfuração). Contra um mortal sem Proezas anti-armadura, um C3 com Soak
  +3 natural em tudo já filtra os golpes fracos dos novatos. Isso, sim, faz o tier "sentir".
  Recomendo **manter o +1 de acerto/defesa como está** e comunicar bem que **a superioridade de
  tier mora no Soak e nas Proezas, não no número do ataque**. Hoje isso está implícito; deixe
  explícito.
- 🟢 O portão de Centelha (só sobe com marco de história, mesmo com XP pago) é a decisão certa
  para o tom. Mantenha.

---

## 4. Combate físico: mortalidade, durabilidade e o pilar "arma = estilo"

Aqui está a promessa central (menos mortal que Exalted) e a validação é boa.

### 4.1 Durabilidade: o pilar se cumpre 🟢

Simulei um herói de referência (Vigor 4, **PV 37**) apanhando de um par competente (soma
Destreza+perícia 8, Força 4, arma média):

| Defesa do alvo | Golpes que conectam até cair | Golpes totais (incluindo os que erram) |
|---|---|---|
| Sem armadura | ~4,6 | ~8 |
| Couro leve | ~6,2 | ~11 |
| Malha média | ~9,3 | ~17 |

Isso entrega **exatamente** o pilar: 4 a 5 golpes sólidos de um igual sem armadura, mais ainda
com armadura. Nada de one-shot. Um duelo dura de 8 a 17 trocas, que é uma cena de combate com
decisões, não uma execução. **A meta "não tão mortal quanto Exalted" está atingida.** 🟢

### 4.2 A taxa de acerto real não é a que a documentação diz 🔴

A nota de design repete que o combate entre iguais é "~40 a 45% de acerto". **Isso está errado
uma vez que se inclui o bônus de acerto da arma.** A fórmula de Defesa sozinha segura ~44% num
atacante **sem arma**, mas toda arma soma Acerto:

| Bônus de acerto da arma | P(acerto) entre iguais (soma 8) |
|---|---|
| +0 | 44,4% |
| +1 (média, haste, distância) | 55,6% |
| +2 (leve) | 66,4% |
| +3 | 76,1% |

Ou seja: **o combate real entre iguais acerta 50 a 66% das vezes, não 42%.** O defensor está em
desvantagem estrutural, e isso é normal e até saudável (torna a luta dinâmica, não uma parede),
mas **a documentação está descalibrada em relação ao jogo real** e isso enganará quem tentar
balancear inimigos pela nota. Recomendo:

1. Corrigir o texto de design: o baseline honesto é "~50 a 55% com arma típica".
2. Decidir de propósito se o defensor deve estar tão atrás. Se quiser puxar de volta para perto
   de 45 a 50%, a correção limpa é **dar +1 ou +2 fixo à Defesa base** (reabsorvendo o acerto
   médio da arma) ou tratar o Acerto da arma como um empate, não como vantagem líquida.

### 4.3 O pilar "arma = estilo, não potência" está bem resolvido, com um furo 🟡

Testei o dano por Tick (DPS) dos três pesos contra alvos diferentes:

| Arma | vs sem armadura | vs malha média |
|---|---|---|
| Leve (adaga) | 0,69 | **0,07** |
| Média (espada) | 0,88 | 0,37 |
| Pesada (montante) | 0,95 | **0,69** |

O pedra-papel-tesoura funciona lindamente: contra placa, a pesada domina (abridor de lata) e a
leve fica inútil, exatamente o desenho. 🟢

**O furo:** a arma leve é a **pior em dano em toda situação**, e o que deveria compensar (ela
age mais vezes, Speed 5 contra 7) só vira vantagem de verdade quando existe o que fazer com o
tempo extra: encadear Técnicas, aplicar status, interromper, reposicionar. **No tier mortal
(Centelha 0 a 1), sem Proezas, a arma leve não tem esse payoff e simplesmente é fraca.** Um
jogador novato que pega uma adaga "porque combina com o personagem" vai reparar que bate menos e
não ganha nada em troca. Recomendo dar à arma leve **um payoff mortal-tier concreto**, por
exemplo: o maior bônus de Quase-Acerto já ajuda (ela nica muito), mas some a isso um bônus
defensivo real (a leve já dá DefArma, confirme que é sensível) e/ou a capacidade de **fazer uma
ação utilitária no mesmo Tick** (fintar, mover, sacar) que a pesada não tem tempo de fazer. O
estilo precisa render **antes** das Proezas, não só depois.

### 4.4 Quase-Acerto: bom conceito, custo de bookkeeping alto 🟡

O Quase-Acerto (raspão que ignora Soak quando você erra por pouco) é uma boa ideia: garante que
o blindado sinta alfinetadas e que ninguém fique 100% imune. Medido, ele adiciona ~18% ao dano
esperado por golpe contra alvo descoberto (0,82 de 5,27), e vira relevante contra armadura
pesada (onde é quase o único dano que passa). Peso de design correto. 🟢

Porém: hoje o Quase-Acerto tem **quatro números por confronto** (bônus QA e dano QA da arma,
bônus QA e redução QA da armadura), e a regra "a armadura soma à margem porque o alvo é maior e
mais lento" é sutil e pouco intuitiva. Para ~18% de dano extra, é muita contabilidade para a
mesa lembrar a cada golpe. Recomendo uma de duas rotas:

- **Manter os quatro números** mas escondê-los na ficha e no bestiário (o jogador lê só "seu
  raspão: erra por até 2 = 4 de dano"), nunca fazendo a conta na hora.
- Ou **simplificar** para "raspão = erra por até [peso da arma], dano = metade do dado da arma,
  ignora Soak; armadura pesada anula o raspão". Perde granularidade, ganha velocidade de mesa.

Para o jogador de primeira viagem, o Quase-Acerto deveria ser opcional/avançado, não parte do
primeiro combate ensinado.

---

## 5. As três defesas

O modelo de três muralhas (Física / Social / Mental) roteadas pelo **"como" o ataque chega** é
uma das partes mais fortes e mais originais do sistema. O teste do "canal" (passou pelo seu
juízo = Social; entrou direto na mente = Mental) e a régua dos três medos (intimidação = Social,
medo mágico = Mental, medo da cena = Bravura) são **excelentes** e resolvem uma ambiguidade que
sistemas grandes nunca resolveram. 🟢

Pontos de atenção:

- 🔴 **A Defesa Mental usa uma escala matemática diferente das outras duas e isso cria um degrau
  perigoso.** Física e Social são `(atributo + perícia) × 2 + Centelha`. Mental é `Raciocínio +
  Integridade + Vontade + Centelha`, **soma simples, sem o ×2**. O resultado: um herói tem
  Esquiva ~16, Social ~18 a 20, e Defesa Mental ~12. As duas primeiras crescem no dobro do ritmo
  da terceira. Como o ataque mágico à mente rola a mesma escala de pool que os outros ataques,
  **a Defesa Mental fica estruturalmente mais fácil de furar** conforme os personagens sobem. No
  tier mortal isso é ok (defesa mental é rara e cara). Mas no tier heroico/semideus, onde magia
  de controle aparece, a mente vira o ponto mais mole de todos, e um feiticeiro de Ocultismo alto
  passa quase sempre. Verifique se isso é intencional (a mente é o calcanhar) ou um acidente da
  escala. Se for acidente, a correção é alinhar a Mental à mesma família de fórmula (por exemplo
  `(Raciocínio + Integridade) × 2 ... ` ou somar Vontade por dentro do ×2) para que ela não
  fique para trás.
- 🟡 **Três defesas é muita superfície para o novato.** A folha de referência do capítulo é boa,
  mas o primeiro contato deveria ensinar **só a Física**, e apresentar Social e Mental quando a
  campanha chegar nelas. Um box "por ora, só a Defesa Física importa" no combate inicial poupa o
  novato.
- 🟢 A regra de quem tem cada muralha (por Inteligência: 0 imune, 1 fera tem Mental mas não
  Social, 2+ tem as duas) é limpa e o tratamento de "imune vs número baixo" está correto.

---

## 6. O sistema social: régua de relação + combate social

Este é o subsistema mais ambicioso e, no geral, o mais bem executado. Ter **dois modos** (a
Régua de Relação para o dia a dia, o Combate Social por Firmeza para as cenas grandes) é
exatamente como o social deveria funcionar, e a divisão "a régua é o estado, o combate é o
evento" é uma régua de ouro que muitos designers profissionais não acertam. 🟢

### 6.1 Combate Social: espelhar o físico foi a decisão certa 🟢

Firmeza = PV, Defesa Social = Esquiva, canais = modos de dano, armaduras sociais = armaduras,
abordagens = armas. Porque nasce da mesma matemática, já nasce balanceado: um duelo social entre
heróis dura de 6 a 10 trocas, como o físico. Os quatro canais (Razão / Coração / Brio / Ganho)
com absorção por Virtude, e a Compaixão virando **brecha** contra apelos de pena, é design de
altíssimo nível: a virtude que te protege de suborno é a porta aberta para a piedade. Isso é
caracterização mecânica de verdade. 🟢

### 6.2 O risco: o social pode ser mais complexo que o físico 🟡

Um combate social hoje tem canais, armaduras sociais com penalidades, tags (Finta, Ruptura,
Penetração total), recusa com Vontade, quase-acerto social, modificadores situacionais,
recuperação, e a régua por cima. É **mais** peças do que o combate físico. O perigo é que a mesa
resolva "vamos só rolar Lábia" porque o motor completo assusta. Recomendo:

- Marcar explicitamente o Combate Social como **opcional / para cenas grandes**, e deixar a
  **jogada única da Régua** (Ataque Social vs Defesa Social, move a régua) como o **default** do
  dia a dia. O texto já diz isso, mas a hierarquia precisa ser gritada, não sussurrada: 95% das
  interações sociais são uma rolagem na régua, não um combate.
- Dar um **fluxograma de uma página**: "houve aposta alta e resistência declarada? Não = jogada
  única na régua. Sim = combate social."

### 6.3 A régua de relação: sólida, com uma decisão a revisitar 🟢🟡

A régua −5 a +5 com banda neutra larga, o "sair do neutro custa 3 passos", "atos criam vínculo,
conversa refina", o "favor alugado" (suborno cai quando o dinheiro para) e o "teto de vidro"
(±2 por lábia, +3 exige vínculo real) são todos **certíssimos** e modelam relações humanas de
verdade. 🟢

- 🟡 A banda neutra de 5 casas pode parecer lenta demais na prática ("preciso de três cenas boas
  só para virar Simpatia?"). Você já tem a alternativa registrada (banda de 3). Sugiro **testar
  na mesa** antes de travar: se os jogadores acharem que relações não evoluem, encurte para 3.
- 🟡 As baselines por povo (Anão↔Elfo −2) são um ótimo gancho, mas a matriz está quase toda
  zerada. Ela é uma **ferramenta de worldbuilding** poderosa e subusada: cada célula não-zero é
  uma história implícita. Vale preencher mais algumas (a tensão herdada de Orcs da Grande Guerra,
  a afinidade Elfo↔Gnomo que você mesmo sugeriu) para o mundo ter textura de Exalted.

---

## 7. Aparência: no social e (talvez) no combate

O tratamento atual (traço próprio 1 a 10, piso 1 grátis, modificador **direcional** somado flat
à jogada social, fora do teto ±6, com o Deformado dando −4 social mas +4 ao intimidar) é
inteligente. 🟢 Tirar a Aparência do rol de atributos foi certo: como atributo ela era sempre
dump stat ou always-on demais.

Recomendações:

- 🟢 **No social, mantenha como está**, com uma clarificação: o texto diz que "a Compostura
  define o raio de quanto da Aparência real você consegue mascarar". Essa é uma regra linda mas
  **não está quantificada**. Quantifique: por exemplo, "você pode se apresentar como se sua
  Aparência fosse até [Compostura] pontos mais perto de 5 (comum) do que ela é, escondendo o
  extremo". Assim o belo pode fingir discrição e o feio pode disfarçar, ambos limitados pela
  Compostura. Sem número, cada Mestre inventa o seu.
- 🟡 **No combate, eu seria muito cauteloso.** A tentação é dar à beleza um efeito de distração
  ou à feiura um efeito de medo em combate físico. O risco é criar um segundo eixo de "acerto"
  que ninguém pediu e desbalancear. Minha recomendação: **não deixe a Aparência tocar dano ou
  defesa física diretamente.** Se quiser um gancho tático, faça-o **estreito, situacional e
  opcional**: uma vez por combate, uma presença chocante (beleza extrema **ou** deformidade
  aterradora) pode forçar um único **teste social/mental de abertura** contra um inimigo que a
  encara pela primeira vez (uma finta que dá −2 na defesa dele no próximo golpe, ou um teste de
  Bravura). Isso conecta a Aparência à Proeza **Presença Aterradora** e ao combate social sem
  criar um sistema novo. A beleza distrai, a monstruosidade apavora, mas nenhuma das duas
  "causa dano". Deixe o efeito físico para as Proezas, que é onde o sobre-humano mora.

---

## 8. Influência sobre os outros: onde o sistema já brilha e onde falta amarrar

"Influência sobre os outros" hoje se espalha por: os atributos sociais, o Combate Social, a
Régua de Relação, as Proezas de Influência (Comando, Voz de Mel, Marionete...) e a fronteira
Social/Mental. O conjunto é rico. Os pontos a amarrar:

- 🔴 **A fronteira entre "influência social forte" e "controle mental" precisa de um limite
  numérico de duração, senão as Proezas de Influência viram controle mental barato.** Comando →
  Dominação "implanta uma ordem por um dia"; Marionete → "domina corpo e vontade". Isso é
  **Mental** (tira a escolha), então deveria bater na Defesa Mental, não na Social, e custar
  caro. O documento das defesas já diz isso ("magia que substitui o argumento = Mental"), mas as
  Proezas de Influência estão descritas como se fossem sociais. **Garanta que toda Proeza que
  remove a escolha do alvo (compulsão, dominação, ordem irresistível) role contra a Defesa
  Mental**, e que a mera persuasão/sedução role contra a Social. Hoje há Proezas de Influência
  que dizem "vs Defesa Mental" e outras que não dizem nada: padronize.
- 🟡 **Falta uma página de regra que descreva a Defesa Mental e o combate mental "por dentro".**
  Hoje as três defesas existem como número, o combate social tem seu capítulo, mas o **ataque à
  mente** (controle, medo mágico, leitura) não tem um capítulo próprio de como se resolve lance a
  lance. É a maior lacuna estrutural do lado social/mental. Como as Proezas de Influência de tier
  alto e boa parte do Arcano (Fascinação, Domínio) batem ali, essa página vira necessária.
- 🟢 O "teto de vidro" (lábia leva só a ±2; lealdade de verdade exige vínculo narrativo) é a
  salvaguarda que impede o jogador de "farmar" lealdade com rolagem. Excelente. Mantenha e
  aplique o mesmo princípio às Proezas: nenhuma Proeza social deveria **criar** lealdade
  permanente por rolagem, só acelerar o que a ficção sustenta.

---

## 9. Backgrounds (Antecedentes): a lista que falta

O sistema **não tem** hoje um subsistema de Backgrounds, e isso é uma lacuna real para a proposta
"D&D com Exalted": em Exalted os Backgrounds (Aliados, Recursos, Mentor, Reputação, Manse...) são
metade da caracterização e o motor de muitas tramas. Sem eles, dois personagens só se distinguem
por atributos, perícias e Proezas, tudo interno; falta o **capital externo** (dinheiro, contatos,
posição, relíquias) que enraíza o personagem no mundo.

Abaixo proponho uma lista de Backgrounds **projetada para se conectar aos subsistemas que já
existem**, em especial à Régua de Relação (é o grande diferencial: os Aliados e Contatos de um
Background já nascem com uma posição na régua, não são estatística solta).

### 9.1 Como funcionam (proposta de economia)

- Escala **1 a 5**, como tudo no jogo.
- **Na criação:** um pequeno **pool grátis** (sugiro 5 a 7 pontos) para distribuir, ao estilo
  Exalted. Isso garante que todo personagem tenha raízes no mundo sem competir 1:1 com o XP de
  combate.
- **Com XP:** compráveis e eleváveis a **×3 por ponto** (entre a perícia secundária ×2 e a
  primária ×5). Backgrounds são poder de campanha, não de dado, então não deveriam custar como
  atributo.
- **Voláteis por design:** diferente de atributos, Backgrounds **podem subir e cair na ficção**
  (o mentor morre, a fortuna queima, a reputação vira infâmia). Perder um Background por evento de
  história devolve o XP como crédito para recomprar outro, para o jogador não sentir que perdeu
  investimento por decisão do Mestre.

### 9.2 A lista proposta

| Background | O que dá | Amarra com |
|---|---|---|
| **Recursos** | Renda e patrimônio. 1 = remediado; 3 = próspero (cavalo, boa arma, criados); 5 = fortuna nobre. Define o que você compra sem rolar. | Custo de itens; a Régua ("favor alugado" sai daqui). |
| **Aliados** | Poucos indivíduos poderosos e leais. Cada ponto = um aliado mais capaz **ou** mais dedicado. | **Nasce em +3/+4 na Régua de Relação**; some Centelha/perícia ao aliado conforme o nível. |
| **Contatos** | Muitos conhecidos úteis e espalhados (o informante, o taverneiro, o funcionário). Largura, não profundidade. | Régua em Simpatia (+1); nível = alcance da rede. |
| **Séquito / Seguidores** | Gente comum que trabalha e luta por você (guardas, criados, capangas). | **Regras de Horda** já existentes: nível = Magnitude da tropa. |
| **Mentor** | Um patrono poderoso que ensina e protege (mas cobra). Fonte de Proezas/Artes raras e de missões. | Régua alta com um NPC de Centelha superior; gancho de trama. |
| **Posição / Título** | Autoridade formal: patente militar, cargo, sangue nobre. Dá comando legítimo e portas institucionais. | Modificador de "terreno social" e de Intimidação/Etiqueta em contexto. |
| **Reputação** | O que dizem de você antes de você chegar. Direcional (herói / temido / infame). | **Modificador flat às jogadas sociais de abertura**, no espírito da curva de Aparência; alimenta Proezas como Lenda Viva. |
| **Relíquia / Artefato** | Um item além do mundano: arma encantada, joia de poder, item de Arte. Nível = potência. | Equipamento + Arcano; a única forma mortal (Centelha 0) tocar o sobrenatural. |
| **Refúgio / Solar** | Uma base: torre, oficina, santuário, esconderijo. Nível = tamanho, defesa e recursos do lugar. | Ações estendidas (Craft, Ritual) ganham bônus em casa; terreno social. |
| **Familiar / Montaria** | Um companheiro animal ou espírito ligado a você. Nível = poder da criatura. | Bestiário; Proeza Vínculo Animal. |
| **Segredo / Alavanca** | Você sabe de algo que vale poder: uma chantagem guardada, um saber proibido. | Combate Social (munição para Ruptura/Chantagem); Teia. |
| **Fé / Culto** | Seguidores devotos ou vínculo com uma ordem religiosa. Diferente de Séquito: movidos por crença, não por salário. | Régua coletiva; recuperação de Vontade em terreno sagrado. |
| **Linhagem / Sangue** | Herança de povo ou família que abre (ou fecha) portas e explica traços. | Baselines de povo da Régua; ganchos de lore. |
| **Dívida a seu favor** | Alguém te deve um favor grande, uma vez. Gasta-se e some. | Régua (capital pontual); recurso de uma cena. |

### 9.3 Por que esta lista serve à visão

Ela pega o vocabulário familiar de D&D e Exalted (Recursos, Aliados, Mentor, Reputação,
Relíquia) e **pluga cada um num motor que o Centelha já tem**, em vez de criar sistemas novos. O
mais importante: **Aliados, Contatos, Séquito, Mentor, Fé e Linhagem todos falam a língua da
Régua de Relação.** Um Aliado 4 não é "+4 em alguma coisa", é um NPC que começa em Devoção na
régua, com ficha própria. Isso mantém a promessa de mundo coeso: o capital social do personagem
é feito das mesmas peças que o resto do mundo.

Um alerta de balanceamento: **Recursos e Relíquia** são os dois que mais facilmente quebram o
jogo (dinheiro compra equipamento, artefato compra poder). Para eles, recomendo teto de criação
mais baixo (máx 3) e curadoria do Mestre, como em Exalted.

---

## 10. Coerência com a visão "D&D encontra Exalted"

| Eixo da visão | Entregue? | Comentário |
|---|---|---|
| Sem classe nem nível | 🟢 Sim | XP-comprável a partir de pisos, Centelha no lugar de nível. Exemplar. |
| Customização total | 🟢 Sim | Atributos + perícias + especialidade + Virtudes + Proezas + (futuro) Backgrounds. Talvez customização até demais; ver seção 11. |
| Mundo coeso, criaturas e relações complexas | 🟡 Em construção | O bestiário (300+), a Régua com baselines de povo e a lore existem, mas as relações complexas "tipo Exalted" dependem de preencher a matriz de povos e de amarrar os Backgrounds ao mundo. O motor está pronto; falta conteúdo relacional. |
| Combate menos mortal que Exalted | 🟢 Sim | Validado: 8 a 17 trocas para derrubar um herói, sem one-shot. Meta batida. |
| Um hábil vence vários, mas perde para a multidão | 🟢 Sim | As regras de Horda (Magnitude por log2, degradação por baixas) modelam isso bem. |
| Batalha com decisões, não "ataco e rolo" | 🟡 Parcial | O motor tático existe (Ticks, posturas, combos, modificadores, canais sociais), mas no tier mortal puro (Centelha 0 a 1, sem Proezas) as decisões ainda são poucas: as escolhas ricas vêm com as Proezas. Ver seção 11. |

O maior descompasso com a visão é sutil: **Exalted tem decisões táticas ricas já no nível
mortal** (por causa dos Combos e das Charms baratas), enquanto o Centelha concentra a riqueza
tática nas Proezas, que exigem Centelha ≥ 1. Um grupo que jogue puro mortal (Centelha 0) tem um
combate mais próximo de D&D básico "ataco e rolo" do que de Exalted. Se você quer o sabor
Exalted desde o começo, dê ao tier mortal **um punhado de manobras universais grátis** (aparar,
fintar, agarrar, empurrar, mirar, defesa total, ataque poderoso), acessíveis a todos sem Proeza.
Várias já existem espalhadas (postura agressiva, mirar, defesa total nos modificadores); só falta
**reuni-las numa página de "manobras que qualquer um pode fazer"** para o combate mortal já ter
escolhas.

---

## 11. Clareza para quem vê pela primeira vez

Esta é a área com mais retorno por esforço. O sistema é fundo; a curva de entrada é íngreme.
Recomendações concretas:

1. 🔴 **Criar uma trilha de aprendizado explícita.** Hoje o livro apresenta tudo. Proponha uma
   ordem: (a) rolar dado e dificuldade; (b) atributos e perícias; (c) só a Defesa Física e o
   combate básico; (d) Virtudes e Vontade; (e) Centelha e uma Proeza; (f) o social pela Régua;
   e só depois os subsistemas avançados (combate social completo, mental, quase-acerto,
   sangramento, fôlego, hordas). Um box "você já sabe o suficiente para jogar" no fim da parte
   (c)+(d) muda a experiência do novato.
2. 🟡 **Um personagem pré-pronto e comentado.** O Kael já existe como exemplo de cálculo. Falta
   um Kael **narrado**: "no seu turno você tem estas 3 opções, eis por que escolheria cada uma".
   Ensinar por decisão, não por fórmula.
3. 🟡 **Glossário de "qual sistema uso quando".** O jogador vai travar não na regra, mas em
   **qual das regras** aplicar (isto é Social ou Mental? é jogada única ou combate social? é
   Percepção ou Perspicácia?). Uma página só de fluxogramas de roteamento vale mais que dez
   páginas de regra.
4. 🟢 O site interativo (modais de régua por nível, hovercards, ficha auto-calculável) já faz
   muito desse trabalho de clareza. É o maior trunfo de onboarding do projeto. Investir nele
   (tooltips de "quando usar", um modo tutorial da ficha) rende mais que reescrever texto.
5. 🟡 **Vocabulário.** Alguns nomes competem: Percepção/Perspicácia, Compostura (passiva mas
   central), Energia/Mana/Fôlego/Vontade (quatro reservas é muito para lembrar qual alimenta o
   quê). Uma tabela única "as reservas e o que cada uma paga" ajuda.

Sobre as quatro reservas (Energia, Mana, Fôlego, Vontade): 🟡 é o sistema com maior carga
cognitiva do jogo. Cada uma tem justificativa, mas quatro medidores em paralelo é muito. Vale
checar se **Fôlego** (reserva física para atacar/correr) ganha o seu custo cognitivo, ou se
poderia ser dobrado dentro de outra coisa. É a candidata número um a simplificação se a mesa
reclamar de contabilidade.

---

## 12. Recomendações priorizadas

**Prioridade alta (mexem em balanceamento ou clareza estrutural):**

1. 🔴 Corrigir a documentação da taxa de acerto (o real é ~50 a 55% com arma, não 42%) e decidir
   de propósito se o defensor deve ficar tão atrás; se não, dar +1/+2 fixo à Defesa base.
   *(Seção 4.2)*
2. 🔴 Alinhar a escala da **Defesa Mental** às outras duas, ou confirmar que a mente é o
   calcanhar de propósito. Hoje ela cresce na metade do ritmo e vira o ponto mais fácil de furar
   nos tiers altos. *(Seção 5)*
3. 🔴 Padronizar que toda **Proeza/Arte que remove a escolha do alvo** (compulsão, dominação,
   ordem irresistível) role contra a **Defesa Mental**, não a Social, e escrever a página que
   descreve o combate mental por dentro. *(Seções 5 e 8)*
4. 🔴 Criar a **trilha de aprendizado** e o box "você já sabe o suficiente para jogar". *(Seção 11)*

**Prioridade média (afinam pilares centrais):**

5. 🟡 Dar à **arma leve** um payoff mortal-tier (utilitário no mesmo Tick, ou defensivo), para o
   pilar "arma = estilo" valer antes das Proezas. *(Seção 4.3)*
6. 🟡 Reunir as **manobras universais grátis** (aparar, fintar, agarrar, empurrar, mirar, ataque
   poderoso) numa página, para o combate mortal ter decisões desde o começo. *(Seção 10)*
7. 🟡 Comunicar que a **superioridade de tier mora no Soak e nas Proezas**, não no bônus de
   acerto da Centelha. *(Seção 3)*
8. 🟡 Marcar o **Combate Social como opcional/para cenas grandes** e a **jogada única da Régua**
   como o default, com um fluxograma. *(Seção 6.2)*
9. 🟡 Quantificar o **raio de mascaramento da Aparência pela Compostura**. *(Seção 7)*
10. 🟡 Implementar a **lista de Backgrounds** proposta, amarrada à Régua de Relação. *(Seção 9)*

**Prioridade baixa (polimento):**

11. 🟡 Simplificar ou esconder o bookkeeping do **Quase-Acerto** para o jogador. *(Seção 4.4)*
12. 🟡 Preencher mais da **matriz de baselines de povo** para dar textura de mundo. *(Seção 6.3)*
13. 🟡 Revisar se as **quatro reservas** (Fôlego em especial) valem o custo cognitivo. *(Seção 11)*
14. 🟢 Contrastar **Percepção vs Perspicácia** e destacar o papel central da **Compostura** na
    página de atributos. *(Seção 2)*

---

## 13. Fechamento

O Centelha não precisa de um resgate; precisa de **foco e de uma porta de entrada**. As decisões
de fundo (Centelha no lugar de nível, Proezas como toolbox, três defesas por canal, social em
duas camadas) são boas e se sustentam na matemática. Os poucos problemas reais de balanceamento
são localizados e têm correção limpa (a escala da Defesa Mental, a taxa de acerto documentada, o
roteamento das Proezas de controle para a Mental). O resto do trabalho é de **clareza**: ordenar
o que se aprende primeiro, dizer alto qual subsistema usar quando, e dar ao tier mortal decisões
táticas para ele já ter cara de Exalted antes das Proezas entrarem.

A lacuna de conteúdo mais valiosa a preencher é a dos **Backgrounds**, porque é ela que
transforma "um personagem com boas fichas" em "uma pessoa enraizada num mundo com aliados,
dívidas, fama e um mentor que um dia vai cobrar". É o que falta para o Centelha ser, de fato,
D&D encontra Exalted.
