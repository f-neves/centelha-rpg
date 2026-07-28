# Trilhas de Feitiçaria — documento de trabalho

> Doc de design. Convenção de tags como na lore: **[TRAVADO]** = decidido pelo autor ·
> **[PROPOSTA]** = sugestão minha, aguardando validação · **[EM ABERTO]** = decisão pendente.
> Nada disso está no site ainda; ao travar, porta para a página do Arcano (e talvez um `trilhas.json`).

## 1. O que é uma Trilha

**[TRAVADO]** Hoje a magia funciona assim: basta **Centelha > 0** para tocar uma Arte, a
**profundidade (nível) se compra com XP**, e conjurar rola **Ocultismo + Atributo**. A antiga trava
(Arte nível N exigia Ocultismo ≥ N) foi **removida**.

**[TRAVADO]** Uma **Trilha** é o **caminho de aprendizado de uma Arte**: responde "como este
personagem (ou criatura) chegou a lançar *isto*". Ela não substitui o portão da Centelha nem o custo em
XP; ela dá **sentido** ao aprendizado e cobra um **preço de treino/ficção** por ele.

**[TRAVADO]** A relação é **muitos-para-muitos**:
- Cada **Arte** pode ser alcançada por **várias Trilhas diferentes** (a Terra pela mão de um Druida ou
  pela de um Monge são Trilhas distintas para a mesma Arte).
- Uma **Trilha** pode abrir **mais de uma Arte** (um mesmo treino/tradição destrava um punhado de Artes
  afins).

**[TRAVADO]** O peso é **mecânico, mas não impeditivo**. Cada Trilha pede um **treino** (perícias/
virtudes) e/ou **custos de ficção** (deveres, devoção). São **guias**, não muralhas: como quase toda
Arte oferece mais de uma Trilha, ninguém fica trancado fora da magia — há sempre uma via que você já
cumpre ou pode buscar. A Trilha troca a **trava única** (Ocultismo) por um **feixe de portões temáticos
e mais macios**.

**O que muda e o que fica:**
- **[TRAVADO]** A **conjuração muda por Tradição** (não é mais Ocultismo para todos): cada Tradição molda
  a magia com a sua perícia. Além disso, entra a nova perícia **Acerto Arcano** para *mirar* efeitos
  mágicos. Como funciona: seção **"Jogadas das Artes"** abaixo.
- **[TRAVADO]** O **custo em XP** de comprar/subir uma Arte é o mesmo (×10 por nível), qualquer Trilha.
- **[TRAVADO]** **Centelha > 0** continua o único portão **universal**.

## 2. As seis Tradições (o "método de ensino")

Cada Trilha pertence a uma **Tradição**: o estilo de ensino do mundo por trás dela. As Tradições dão o
sabor e o *tipo* de exigência; as Trilhas concretas (seção 4) é que listam os traços exatos.

| Tradição | Como ensina | Tende a exigir (treino) | Custos além de perícia |
|---|---|---|---|
| **Erudição** | A Arte como **ciência**: estuda-se a fundo em universidades e centros de pesquisa. O método das grandes escolas. | **Ocultismo** + outros saberes (**Conhecimentos Gerais**, **Investigação**, **Ciências**\*) | Acesso a mestre/biblioteca; **tempo** de estudo |
| **Sangue / Antecedente** | **Herança e afinidade**: a fagulha desperta cedo e a Arte vem quase de dentro. Via natural das **criaturas mágicas bestiais**. | Em seres inteligentes, treino do **corpo** e da **alma**: **Resistência**, **Integridade**, elevação espiritual (**Temperança**/Vontade). Em bestas, quase nada (instinto). | Linhagem/origem que justifique a afinidade |
| **Pacto** | **Poder emprestado** de uma entidade (deus menor, espírito, ser de plano). | **O que menos exige em perícia** (o bastante para **alcançar e conhecer** a entidade e selar o pacto) | **Coleira**: deveres, preços, riscos, favores cobrados |
| **Iniciação** | Ligada a uma **divindade / patrono / ordem**; a Arte vem em **graus** que a ordem libera. | Pouca perícia; mais **devoção, votos, abdicações** | Conduta/voto; a ordem controla o acesso aos graus |
| **Marcial** | **Treino árduo + estudo + elevação espiritual**, ao modo dos monastérios (mas não só monges). Tende a Artes de **combate e do cotidiano**. | **Briga** (artes marciais), **Integridade** e **Temperança** (autocontrole); *"Meditação"* poderia virar perícia secundária | Disciplina longa; muitas vezes vida monástica |
| **Xamânica / Totêmica** | Comunhão com **espíritos difusos**: ancestrais, totens, forças da natureza (via de orcs e goblins). Diferente do Pacto: **não há patrono único**. | **Sobrevivência**, **Temperança**/Vontade, ritos; laço com um totem/ancestral | Ritos, tabus e obrigações com os espíritos |

\* *"Ciências" ainda não é perícia formal; hoje o saber científico cai em **Conhecimentos Gerais**.
Decidir se vira secundária.*

**[PROPOSTA] Diferença fina entre as três "espirituais":**
- **Pacto** = uma **barganha** com **uma** entidade por poder emprestado (transacional, com coleira).
- **Iniciação** = você **pertence** a uma fé/ordem e **sobe por devoção**; a ordem te ensina os graus.
- **Xamânica** = **comunhão** com espíritos **difusos** (ancestrais, natureza, totem), animista, sem
  patrono único nem ordem organizada.

## 2b. Jogadas das Artes (proposta — decisão nº 1 + nº 5)

Toda Arte que precisa **vencer um alvo** faz uma jogada de **Atributo + perícia**. A perícia depende do
que o efeito *faz*. Duas famílias:

**A. Efeito MIRADO** (você joga / atira / manipula algo contra o alvo): dardo de fogo, raio, lança de
gelo, jato, agarrão telecinético. Rola **Acerto Arcano** + **Percepção** (à distância, mira) ou
**Destreza** (perto, manipulação fina). É o "ataque" da magia, gêmeo de Atirador/Arremesso, e **não muda
com a Tradição** (mirar uma labareda é mirar uma labareda). O alvo opõe **Defesa (Esquiva)**; depois
dano − Absorção. *Ex.: rajada de fogo = **Percepção + Acerto Arcano** vs a Defesa dos alvos.*

**B. Efeito MOLDADO** (invade o corpo/mente ou molda o mundo): transmutação, veneno, medo, ilusão,
domínio, muralha, cura, escudo. Rola a **perícia de conjuração da sua Tradição** + o Atributo temático.
É aqui que **"a conjuração muda por Tradição"** vive. Resistência conforme a natureza (Vigor+Convicção,
Defesa Mental) ou sem resistência (aliado/objeto/cenário).

**Acerto Arcano** [TRAVADO, perícia a criar]: perícia usada com **Percepção ou Destreza** para
**Atirar / Arremessar / Manipular** efeitos mágicos. É o "acerto" de toda magia mirada, em qualquer
Tradição.

**Perícia de conjuração por Tradição** (efeitos moldados) [PROPOSTA]:

| Tradição | Conjura efeitos moldados com |
|---|---|
| **Erudição** | **Ocultismo** |
| **Sangue / Antecedente** | **Integridade** (autoconhecimento / instinto; bestas usam o próprio Atributo, sem perícia) |
| **Marcial** | **Briga** (ou Integridade) |
| **Xamânica / Totêmica** | **Sobrevivência** |
| **Pacto** | **Ocultismo** (conhecer/invocar a entidade) — ou um traço de vínculo |
| **Iniciação** | um traço de **Fé/Devoção** — *não existe ainda; ver aberto* |

**[EM ABERTO] Onde o Acerto Arcano mora na estrutura de perícias.** Só há 24 primárias (4 grupos × 6).
Candidatos: **(a)** uma perícia **mágica** fora do 4×6, um trilho só de quem tem Centelha (gêmea de
Atirador); **(b)** entrar no grupo Combate (viraria 7). *Recomendo (a).*

**[EM ABERTO] Como se determinam de vez as jogadas das Artes** (você marcou isto na decisão nº 1). O
esquema A/B acima é a proposta; falta decidir os casos de fronteira: um efeito mirado que também invade
(uma flecha de gelo que congela por dentro) rola uma vez (Acerto Arcano) ou duas? *Recomendo uma só: o
Acerto Arcano acerta, a Margem decide a intensidade do efeito secundário, sem 2ª rolagem.*

## 3. Anatomia de uma Trilha (o registro)

**[PROPOSTA]** Cada Trilha concreta traz:
- **Nome** (evocativo: "A Terra pela Mão do Druida").
- **Tradição** (uma das seis).
- **Arte(s) que abre** (uma ou mais).
- **Treino exigido**: perícias/virtudes (com um nível sugerido — ver decisão nº 2).
- **Custos de ficção**: deveres/voto/coleira, quando houver (Pacto, Iniciação, Xamânica).
- **Sabor**: uma linha de como esse ensino acontece no mundo.

## 4. Exemplos (os seus + alguns para calibrar)

**A Terra pela Mão do Druida** · *Sangue/Antecedente ou Xamânica* · abre **Terra** (e afins de
natureza). Treino: **Resistência + Integridade**. Custo: laço com o ciclo natural / bosque-mestre.
*A pedra se move para quem aprende a resistir como ela e a se manter inteiro sob peso.*

**A Terra pela Disciplina do Monge** · *Marcial* · abre **Terra** (uso de combate/cotidiano). Treino:
**Briga + Integridade + Temperança** (autocontrole; *"Meditação"* se virar perícia). Custo: disciplina
monástica. *A mesma Arte, alcançada não pelo laço com o mundo, mas pelo domínio de si.*

**A Cátedra do Fogo** · *Erudição* · abre **Fogo** (e talvez **Raio**). Treino: **Ocultismo +
Conhecimentos Gerais**. Custo: acesso a uma universidade blindada e tempo de estudo. *O fogo dissecado
como fenômeno, não como fúria.*

**O Pacto da Chama Emprestada** · *Pacto* · abre **Fogo**. Treino: mínimo (**Ocultismo** só para
alcançar e nomear a entidade). Custo: **coleira** — a entidade cobra tributos e favores, e pode negar o
poder num momento crítico. *Rápido e barato de aprender, caro de manter.*

**Os Graus da Ordem da Lua** · *Iniciação* · abre **Adivinhação** (e **Proteção**). Treino: pouca
perícia; **voto e devoção** à ordem. Custo: abdicações, obediência aos graus. *A Arte vem em degraus
que só a ordem libera, a cada prova de fé.*

## 4b. Mapa exemplo: a Arte da TERRA × suas Trilhas (decisão nº 3)

Isto é **uma** linha do catálogo completo, para você ver o que quero dizer com "mapear as 21 Artes ×
Trilhas". Cada Arte listaria as Trilhas que a abrem. O **treino** traz o nível pedido em **cada perícia**,
e esse nível **escala leve com o nível N de Terra que se quer aprender** — e **nem toda perícia no mesmo
passo** (decisão nº 2). Notação: `Resistência ⌈N/2⌉` = para aprender Terra até o nível N, tenha
Resistência ao menos ⌈N/2⌉.

**ARTE: TERRA** · efeitos moldados (muralha, moldar rocha) conjuram com a perícia da Tradição; jatos de
cascalho **miram com Acerto Arcano**.

| Trilha | Tradição | Treino (escala com o nível N) | Custos de ficção | Também abre |
|---|---|---|---|---|
| **A Terra pela Mão do Druida** | Sangue/Antec. | Resistência ⌈N/2⌉ · Integridade ⌈N/3⌉ | laço com o ciclo natural | Natureza, Água |
| **A Terra pela Disciplina do Monge** | Marcial | Briga ⌈N/2⌉ · Integridade ⌈N/2⌉ · Temperança ⌈N/3⌉ | disciplina monástica | Forças, Metamorfose |
| **A Cátedra da Pedra** | Erudição | Ocultismo ⌈N/2⌉ · Conhec. Gerais ⌈N/3⌉ | universidade blindada + tempo | Matéria, Fogo |
| **O Totem da Montanha** | Xamânica | Sobrevivência ⌈N/2⌉ · Temperança ⌈N/3⌉ | ritos e tabus do totem | Vento |

Leitura: a mesma Arte (Terra) tem **4 portas**. Um Monge com Briga 3 / Integridade 3 alcança Terra até o
nível ~5 por essa Trilha; um Erudito chega pela Cátedra, com Ocultismo. E cada Trilha **encurta o caminho
para Artes vizinhas** ("Também abre"), porque uma Trilha serve mais de uma Arte. Multiplicado por 21
Artes, o catálogo vira uma frente própria de conteúdo (ver decisão nº 3).

## 5. Como "não impeditivo" funciona (proposta a validar)

**[PROPOSTA]**
1. Para **aprender** uma Arte **até o nível N** por uma Trilha, cumpra o **treino** dela e os **custos
   de ficção**. O treino **escala leve com N** e **cada perícia tem seu próprio patamar** (decisão nº 2):
   nem toda perícia da Trilha precisa estar no nível da Arte. Notação `Perícia ⌈N/2⌉`, `Perícia ⌈N/3⌉`
   etc. — uma pesa mais, outra é só um alicerce. Resolve-se na **ficção / downtime**, não numa rolagem.
2. Como cada Arte tem **várias Trilhas**, você escolhe a que **alcança**; se não cumpre nenhuma ainda,
   a mais barata vira sua **meta de treino**. É esse leque que torna o sistema "não impeditivo".
3. **Aprofundar** (subir N) segue a **mesma Trilha** (ou outra que aquela Arte permita) e pede mais
   treino conforme sobe — os patamares ⌈N/2⌉/⌈N/3⌉ crescem com N.
4. **Bestas mágicas** (Sangue via instinto) e portadores de **Pacto/Iniciação** pagam **menos em
   perícia** e **mais em ficção** (afinidade inata / coleira / voto): o preço muda de moeda, não some.

## 6. Decisões (2026-07-28)

**Resolvidas:**
1. ✅ **Conjuração muda por Tradição** (não é mais Ocultismo para todos). Modelo na seção "Jogadas das
   Artes". *Como as jogadas se resolvem de vez segue em aberto (fronteiras) — ver lá.*
2. ✅ **Treino escala leve com o nível da Arte**, e **cada perícia com seu próprio patamar** (não precisam
   todas no nível da Arte). Notação ⌈N/2⌉, ⌈N/3⌉.
3. ✅ **Só um exemplo de mapa por ora** (seção "4b. Terra × Trilhas"). O catálogo completo das 21 Artes
   fica como **frente própria** (trabalho grande, tipo o bestiário).
4. ✅ **Onde mora:** `trilhas.json` estruturado + bloco na página do **Arcano**, listando sob cada Arte
   as Trilhas que a abrem.
5. ✅ **Nova perícia: Acerto Arcano** — usada com **Percepção ou Destreza** para **Atirar/Arremessar/
   Manipular** efeitos mágicos (rajada de fogo = Percepção + Acerto Arcano vs Defesa). "Meditação/
   Ciências" **não** viram perícia (cobertas por Integridade+Temperança e Conhecimentos Gerais).

**Ainda em aberto (para fechar antes de portar ao site):**
- **A. Jogadas das Artes, casos de fronteira** (decisão nº 1 continua): o esquema **Mirado (Acerto Arcano
  + Perc/Des)** vs **Moldado (perícia da Tradição)** está proposto; falta bater o martelo nele e nos
  híbridos (uma só rolagem, recomendo). Ver "Jogadas das Artes".
- **B. Perícia de conjuração de cada Tradição** — a tabela [PROPOSTA] em "Jogadas das Artes" precisa de
  aval; e a **Iniciação** provavelmente pede um traço de **Fé/Devoção** que não existe (criar?).
- **C. Onde Acerto Arcano mora** na estrutura (fora do 4×6, como perícia mágica própria — recomendo — ou
  no grupo Combate virando 7).

## 7. Ganchos com o resto do sistema

- Substitui a antiga trava de **Ocultismo** (removida) por um feixe temático — fecha a pendência
  "melhorar a relação Feitiçaria × Ocultismo": Ocultismo deixa de ser portão universal e passa a ser o
  **treino típico da Erudição** (e a perícia de conjuração, se a decisão nº 1 mantiver isso).
- Conecta com a **lore** [TRAVADO]: mundo que teme magia (supressão), universidades blindadas, afinidade
  mágica por raça, despertar por método cultural / evento / ser poderoso. Cada Tradição é uma dessas
  portas.
- O **mortal-tocado** (Bram) é a Tradição **Erudição** levada ao extremo: profundidade por estudo, não
  por Centelha.
- O **clérigo/paladino/monge** da lore (mecânica [EM ABERTO] lá) encaixa aqui: clérigo/paladino =
  **Iniciação**; monge = **Marcial**. Feche os dois juntos.
