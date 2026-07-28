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

**[PROPOSTA] O que NÃO muda com as Trilhas:**
- A **conjuração** segue **Ocultismo + Atributo** para todos (a Trilha governa como você *aprende*, não
  como *lança*). *Ver decisão em aberto nº 1 — pode ser que tradições como a Marcial conjurem com outra
  perícia.*
- O **custo em XP** de comprar/subir uma Arte é o mesmo (×10 por nível), qualquer que seja a Trilha.
- **Centelha > 0** continua o único portão **universal**.

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

## 5. Como "não impeditivo" funciona (proposta a validar)

**[PROPOSTA]**
1. Para **aprender** uma Arte (nível 1) por uma Trilha, cumpra o **treino** dela (as perícias/virtudes
   no nível sugerido) e os **custos de ficção**. Isso se resolve na **ficção / downtime**, não numa
   rolagem.
2. Como cada Arte tem **várias Trilhas**, você escolhe a que **alcança**; se não cumpre nenhuma ainda,
   a mais barata vira sua **meta de treino**. É esse leque que torna o sistema "não impeditivo".
3. **Aprofundar** (subir de nível) segue a **mesma Trilha** (ou outra que aquela Arte permita), e pode
   pedir mais treino conforme sobe (decisão nº 2).
4. **Bestas mágicas** (Sangue via instinto) e portadores de **Pacto/Iniciação** pagam **menos em
   perícia** e **mais em ficção** (afinidade inata / coleira / voto): o preço muda de moeda, não some.

## 6. Em aberto (preciso do seu martelo)

1. **Conjuração:** continua **Ocultismo + Atributo** para todas as Tradições, ou algumas conjuram com
   perícia própria (ex.: Marcial com **Briga**, Iniciação com um traço de fé)? *Recomendo manter
   Ocultismo+Atributo por ora e tratar Trilha só como aprendizado.*
2. **Nível do treino:** o treino exige a perícia **> 0** (só ter treinado), um **patamar fixo** baixo,
   ou um nível que **escala** com o nível da Arte (ex.: perícia ≥ ⌈nível da Arte ÷ 2⌉)? *Recomendo o
   escalonamento leve: torna Artes fundas um investimento de verdade sem travar a entrada.*
3. **Escopo do catálogo:** o mapa completo (todas as 21 Artes × suas Trilhas) é um trabalhão (como foi
   o bestiário). Fazemos agora, ou fixamos o framework + um punhado de Trilhas-exemplo e deixamos o
   catálogo para uma frente própria?
4. **Onde mora no site:** seção nova na página do **Arcano**, **capítulo** próprio, e/ou um
   **`trilhas.json`** estruturado (como `artes.json`) para renderizar por Arte. *Recomendo `trilhas.json`
   + um bloco na página do Arcano, listando, sob cada Arte, as Trilhas que a abrem.*
5. **"Meditação" / "Ciências":** viram **perícias secundárias** novas, ou continuam cobertas por
   Integridade+Temperança e Conhecimentos Gerais?

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
