# O Grid no telefone

**Aberto em 2026-08-21.** O tabuleiro cresceu por dezoito meses numa tela de notebook, e as oito
emendas do `Grid_Automacao.md` (a folha da ação, a ação "outra coisa", o modo TV, o arrasto que
ataca) foram todas desenhadas com mouse na mão. Este documento é o plano para a outra ponta: o
telefone, que é onde os **jogadores** estão quando a mesa é presencial e onde o **mestre** acaba
indo quando a mesa é na sala de casa.

O pedido, na frase de quem pediu: *funcionar mais próxima a um aplicativo, para permitir que o
usuário veja as informações necessárias e consiga navegar com facilidade.*

---

## 1. O que foi medido, antes de mudar qualquer coisa

Bancada (`astro.bancada.mjs` + `scripts/mesa-mock.mjs`), arena de 24×16 com 12 peças, viewport de
**390×844 com `hasTouch`**, papel de mestre. Um telefone real tem menos que isso: o Chrome do
Android come uns 110px de barra, então a tela útil fica perto de **730px**.

### A conta da vertical

| faixa | altura | começa em |
|---|---:|---:|
| barra do site (`.topbar`) | 56 px | 0 |
| barra da mesa (nome, convite, abas) | 99 px | 56 |
| barra da arena (`.gr-barra`) | **149 px**, em **6 fileiras** | 166 |
| tira da iniciativa | 124 px | 323 |
| **o tabuleiro** | 591 px | **456** |
| Em campo + Registro (`.gr-lado`) | 891 px | 1063 |

**São 456px de mobília antes do tabuleiro: 54% da tela.** O palco tem 591px de altura declarada,
mas só 388 deles estão na tela quando a página abre. A página inteira mede **1953px**, ou seja
2,3 telas de rolagem, e a lista "Em campo" começa 219px abaixo da dobra.

### O que mais apareceu

- **44 controles abaixo do piso de toque de 44px.** O `global.css:566` isenta o `.btn.mini` de
  propósito ("são os controles densos de /mesa e /admin, que viram grade se esticados"), e a
  barra da arena é feita quase só de `.btn.mini` e `.btn-fant`. No telefone a isenção se inverteu:
  **os campos incharam para 44px e os botões continuaram com 24**.
- **O tabuleiro abre a 100% de zoom.** `caber()` (`grid.astro:3604`) só roda no botão ⤢, na tela
  cheia e no `resize`. Numa arena de 24 colunas isso é mostrar 6 hexágonos de 24: o jogador chega
  numa cena e não vê a cena.
- **A folha da ação abre com 745px de altura numa janela de 844, e o conteúdo tem 813.** Ela já
  rola por dentro, e o que ficou embaixo da dobra é justamente **o par "Errou / Acertou · aplicar"**.
  A emenda que trouxe o ataque de sete toques para dois some no telefone: o último toque virou
  "rolar a caixa até achar o botão".
- **`.al-sec` quebra em 4 fileiras** ("O acerto" e "O dano"), o rótulo quebra em duas linhas, e o
  campo do motivo corta o texto no meio ("por quê (vai para o registr…").
- **O menu da peça mede 439px de altura**, 10 itens de 36px. Em retrato passa raspando; em
  **paisagem** (390px de altura) não cabe, e o encaixe de `grid.astro:4247` (`Math.min(y, innerHeight
  - r.height - 8)`) devolve um topo **negativo**: o menu sai pela borda de cima e não há rolagem
  dentro dele.
- **`.rg-acs` (`grid.astro:1263`) nasce com `opacity: 0` e só acende no `:hover`.** No dedo não há
  hover: **os botões de editar e apagar linha do registro são invisíveis no telefone**. Bug, e não
  desconforto.
- **Não existe pinça.** Não há nenhum manipulador de dois dedos em todo o `src/`. O zoom do
  tabuleiro é só pelos botões − e +, de 24px, na sexta fileira da barra.
- `.gr-palco` ganha `max-height: 70vh` abaixo de 1100px (`grid.astro:654`) e `ajustarAltura()`
  (`grid.astro:2600`) desliga abaixo de 1101px de propósito, porque a grade vira pilha. As duas
  decisões estão certas para o layout de hoje e são exatamente o que o layout novo substitui.

---

## 2. O princípio

**No telefone o tabuleiro é o aplicativo, e todo o resto é gaveta.**

No notebook o Grid mostra quatro coisas ao mesmo tempo (barra, fila, mapa, coluna), e isso é
correto: sobra largura. No telefone não sobra nada, e empilhar as mesmas quatro coisas transforma
um painel em um documento: rola-se para achar o que no notebook está sempre à vista. A saída não é
encolher, é **trocar de gramática**: uma superfície de cada vez, invocada pelo polegar, sobre um
tabuleiro que nunca sai da tela.

Três regras que decorrem disso, e que valem para cada fase adiante:

1. **A página não rola.** O que não cabe vira folha ou gaveta. Se `document.scrollHeight` for maior
   que `innerHeight`, alguma coisa foi empilhada em vez de guardada.
2. **A decisão fica ao alcance do polegar, sempre visível.** Todo diálogo tem os botões de decidir
   grudados no pé, e não no fim do conteúdo.
3. **O papel decide o que aparece.** O mestre e o jogador já são coisas diferentes no código
   (`MESTRE`, `mandoNela`, `?papel=jogador`); no telefone eles precisam ser coisas diferentes na
   tela, porque não há espaço para servir os dois de uma vez.

Já existem dois precedentes prontos no repositório, e o plano os copia em vez de inventar:

- **A ficha em abas** (`FichaSkeleton.astro:1128-1290`): `body.ficha-abas` ligada por
  `matchMedia('(max-width: 900px)')`, painel por aba, barra fixa no pé com
  `env(safe-area-inset-bottom)`, folha de ações atrás do ⋯, e linhas de 48px.
- **A mira no dedo** (`artes-grid-mesa.ts:436-470`): a pergunta certa é `pointer: coarse`, e não a
  largura, e o gesto sem hover ganha um passo de confirmação em vez de confirmar no primeiro toque.

---

## 3. As fases

Cada fase é um commit, tem prova na bancada e serve sozinha. A ordem é de baixo para cima: o chão
antes da mobília, a mobília antes dos gestos.

### Fase 1 · O chão: o app-shell do tabuleiro

**Alvo: sair de 456px de mobília para no máximo 150px, e a página parar de rolar.**

- Uma classe `body.grid-mob`, posta por `matchMedia('(max-width: 900px)')`, no mesmo molde da
  ficha. Entre 901 e 1100px fica o empilhamento de hoje, que serve bem ao tablet em retrato.
- **A barra do site sai** (56px). A barra da mesa já tem o ☰ e o ‹, que são as duas portas que ela
  oferecia. Uma linha em `grid.astro`, sem tocar no `Base.astro`.
- **A barra da mesa encolhe para uma linha de 44px**: nome da mesa e o selo do papel. O convite, o
  ↻ e o Editar descem para a folha do ⋯, que é onde eles são usados uma vez por campanha.
- **As abas da mesa saem do topo e vão para a barra de baixo** (fase 2). São 36px que voltam para o
  mapa, e o polegar não alcança o topo da tela de qualquer forma.
- **A barra da arena (149px em 6 fileiras) se parte em três**: os 3 comandos de sessão vão para a
  barra de baixo; o zoom morre como botão (vira pinça, fase 5); todo o resto (arena, medidas, fundo,
  arte, névoa, efeitos, trilha, tempo, em jogo, registro, excluir) vira **a folha "Arena"**, uma
  lista de linhas de 48px com rótulo por extenso, que é mais legível do que a fileira de ícones
  espremidos de hoje.
- **O palco toma o que sobrou**, com `100dvh` e não `vh` (a barra do navegador do celular entra e
  sai, e `vh` mede a maior das duas), mais `env(safe-area-inset-*)`. `ajustarAltura()` ganha um
  ramo para o modo telefone em vez de desligar; o `max-height: 70vh` de `grid.astro:654` sai.
- **`caber()` na primeira pintura** quando `body.grid-mob`, para a cena chegar inteira.
- **Um pedido ao `Base.astro`**: `viewport-fit=cover` no `<meta name="viewport">` (linha 60), sem o
  qual `env(safe-area-inset-bottom)` devolve zero e a barra de baixo fica debaixo da faixa do
  iPhone. É uma linha, num arquivo compartilhado com a outra frente: mexer sozinha e avisar.

### Fase 2 · A barra de baixo: o polegar manda

**Uma barra fixa no pé, `env(safe-area-inset-bottom)`, alvos de 44px, montada pelo papel.**

O relógio mora nela, à esquerda, sempre visível: **Tick e rodada**, porque todo o resto da tela se
mede a partir deles ("em quantos Ticks é a minha vez" só quer dizer alguma coisa com o Tick à
vista).

| | mestre | jogador |
|---|---|---|
| 1 | ⏭ **Próximo** (+n ticks) | ⚔ **Agir** (abre a folha da ação da peça dele) |
| 2 | ⚔ ação da peça da vez | ✶ Arte |
| 3 | ☰ Em campo · Registro | ◉ A minha peça (Vida, Mana, condições) |
| 4 | ⧉ Arena | ☰ A fila |
| 5 | ⋯ (abas da mesa, convite, tela cheia, TV) | ⋯ |

O ⏭ Próximo é, de longe, o botão mais apertado de uma sessão. Hoje ele é um `.btn.mini` de 24px de
altura na terceira fileira de um painel; na barra de baixo ele é o alvo mais gordo da tela, e a
sessão inteira passa a caber num polegar.

### Fase 3 · As gavetas: o que era coluna vira folha

- **"Em campo" e "Registro"** (891px que hoje começam abaixo da dobra) viram **uma folha de duas
  abas**, aberta pelo ☰ da barra, subindo do pé até 85% da tela, com o tabuleiro escurecido atrás.
  Arrastar para baixo fecha.
- **A tira da iniciativa** encolhe para uma faixa de 56px acima do tabuleiro, mostrando **quem age
  agora e os dois seguintes**; um toque abre a fila inteira como folha. A fila completa é consulta,
  o "de quem é a vez" é permanente, e são perguntas diferentes.
- **A linha do tempo** (que já nasce desligada) vira folha também, e não fileira da grade.
- **Regra de convivência das folhas**: uma por vez. Abrir a segunda fecha a primeira. Empilhar
  folha sobre folha é como se perde o rumo num telefone.

### Fase 4 · Os diálogos viram folhas de baixo

Esta é a parte que o pedido nomeou, e a que tem o defeito mais caro já medido.

**O molde, em `MesaCab.astro:341-357`, ganha um ramo para `body.grid-mob`:**

- `.mesa-dlg` e `.dlg-larga` deixam de ser caixas centradas de 30/44rem e viram **folha colada no
  pé**: largura inteira, cantos arredondados só em cima, `max-height: 92dvh`, entrando de baixo
  para cima. Perto do polegar, e no mesmo idioma das gavetas da fase 3.
- **O rodapé dos botões (`.dlg-btns`) fica `position: sticky; bottom: 0`**, com fundo e um fio em
  cima. Isto sozinho conserta o defeito medido: hoje, na folha da ação, **"Errou" e "Acertou ·
  aplicar" estão fora da tela** quando ela abre.
- **O título fica `sticky top`**, para a folha continuar dizendo o que é enquanto rola.
- **`88vh` vira `92dvh`**, e um ouvinte de `visualViewport` sobe a folha quando o teclado abre. Com
  o teclado aberto sobram uns 350px de tela, e uma caixa de 745px centrada some por baixo dele.
- **Piso de toque dentro das folhas**: `.btn.mini` e `.btn-fant` passam a 44px **dentro de
  `body.grid-mob`**, e não no `global.css` (a isenção de lá é deliberada e vale para /admin).
- **Campos numéricos** ganham `inputmode="numeric"`, e os de Tick e de dano ganham **− e +** ao
  lado: a setinha do `input[type=number]` tem 12px e não existe para um dedo.

**Por diálogo:**

- **`alvo-dlg`, a folha da ação.** A mais usada e a mais alta (813px de conteúdo). Ordem nova:
  cabeçalho com alvo e Defesa, o acerto, o dano, botões grudados no pé. O bloco **Ajuste** vira um
  `<details>` fechado (é a exceção, não a regra, e custa 44px de altura em toda abertura). O
  `.al-sec` deixa de ser `flex-wrap` e vira grade de duas colunas (`4.6rem 1fr`), para o rótulo
  parar de quebrar em duas linhas. O `al-motivo` ganha a linha inteira.
- **`outra-dlg`.** Mesmo tratamento, é irmã da folha da ação.
- **`arte-dlg`, o ajuste da arte.** O caso difícil, e o único que muda de ideia. Ele é **de
  propósito** um painel não modal (`grid.astro:320`), porque o gesto principal do ajuste é arrastar
  a arte no tabuleiro **atrás** dele. No telefone não existe "atrás": a proposta é uma **meia
  folha** (40% da tela, o mapa vivo nos 60% de cima), com o d-pad e os controles de zoom e giro
  dentro dela.
- **`fundo-dlg`.** A grade de miniaturas já responde bem a 2 colunas em 360px. Falta o piso de
  toque nos chips ↺ ↻ ✕ da miniatura, que hoje têm cerca de 24px, e nesse tamanho o ✕ (excluir a
  arte) fica **encostado** no ↻: um erro de dedo de 4px apaga um mapa. Chips de 44px, e o ✕
  separado dos outros dois.
- **`reg-dlg`, o registro.** Corrigir o `opacity: 0` de `.rg-acs` com `@media (hover: none)`. Hoje
  a caixa que existe **para arrumar o registro** não mostra no telefone os botões de arrumar.
- **`arena-dlg`.** `.grade3` vira uma coluna abaixo de 480px; três campos numéricos em 360px de
  largura não cabem sem cortar o rótulo.
- **`tok-menu`, o menu da peça.** No `pointer: coarse` ele deixa de ser menu flutuante junto do dedo
  e vira **folha de baixo**, com o retrato e o nome no topo e linhas de 44px. Resolve as três coisas
  de uma vez: o alvo pequeno (36px medidos), o menu maior que a tela em paisagem, e o dedo que tapa
  justamente a área onde o menu nasce.

### Fase 5 · Os gestos do tabuleiro

- **Pinça para o zoom.** Não existe hoje. Dois ponteiros no `.gr-palco`, `touch-action: none`
  enquanto durar, a distância entre os dedos mapeada em `mudarZoom`, e o ponto médio como âncora
  para o mapa não fugir da mão. É o gesto que todo mundo tenta primeiro num mapa.
- **Toque duplo = caber**, que é o par natural da pinça.
- **Um dedo arrasta**: a peça, se começou em cima de uma peça (já funciona, por `pointerdown`); o
  mapa, no resto (a rolagem nativa do palco já dá conta).
- **Toque longo** já abre o menu (`grid.astro:4155`, 400ms com folga de 8px). Fica, e ganha
  `navigator.vibrate(10)`, que é o que diz ao dedo que o gesto pegou.
- **Escolher alvo no dedo**: depois do menu, o alvo é confirmado no primeiro `pointerdown`, sem
  prévia. Estender o padrão da **mira no dedo** que as Artes já usam (posicionar, ver, confirmar).

### Fase 6 · O jogador no telefone, que é a razão de tudo isto

O mestre no telefone é o caso raro (ele tem notebook, e agora tem o modo TV). **O jogador no
telefone é o caso comum**, e hoje ele chega numa tela que é o painel de controle de outra pessoa.

Ao abrir, sem rolar nada, ele precisa ver quatro coisas: **a peça dele** (Vida, Mana, condições),
**de quem é a vez**, **quantos Ticks faltam para a dele**, e **o botão de agir**. As três primeiras
cabem na faixa de 56px da fase 3 mais a barra da fase 2; a quarta é o ⚔ da barra de baixo.

Junto: **"é a sua vez" precisa chegar**. Uma faixa larga acima do tabuleiro, `navigator.vibrate`, e
o título da aba mudando para quem estiver com o telefone noutra coisa. O tempo real já entrega o
aviso (`mesa-tempo-real.ts`); falta apresentá-lo.

### Fase 7 · A prova

Uma cena nova no `scripts/test-grid.mjs`, `cenaCelular(br, url)`, em 390×844 com `isMobile` e
`hasTouch`, e um segundo passe em paisagem (844×390), cobrando:

- a mobília antes do tabuleiro **≤ 150px** (teto escrito, no molde do `TETOS` que já existe);
- `document.scrollHeight === innerHeight`: a página não rola;
- **zero** controles visíveis abaixo de 44px, dentro das folhas também;
- na folha da ação, `botões.getBoundingClientRect().bottom <= innerHeight` **sem rolar**;
- o menu da peça inteiro dentro da tela, **nas duas orientações**;
- o tabuleiro enquadrado ao abrir (zoom < 1 numa arena de 24×16);
- a mesma bateria com `?papel=jogador`.

E fotos, como os `shot-*.mjs` já fazem, para a diferença ser olhada e não só medida.

---

## 4. O que não entra

- **Aplicativo de verdade** (PWA, instalável, empacotado). O pedido é "mais próximo a um
  aplicativo", e isso é gramática de tela, não empacotamento. Um `manifest.json` e um service
  worker são outra conversa, e ela depende do domínio próprio (`Dominio.md`).
- **Refazer o desenho do tabuleiro.** Hexágono, peça, névoa e efeitos ficam exatamente como estão.
- **Mexer no que a outra frente está escrevendo.** `alcance.ts`, `combate-tempo.ts` e as regras do
  tempo não são tocados: este plano é de superfície, e nenhuma fase muda uma decisão de regra.

## 5. As decisões que faltam

- **[DECIDIR] O corte.** `max-width: 900px` (o mesmo da ficha e do `global.css`) ou
  `pointer: coarse` (a pergunta da mira no dedo)? A largura é previsível e casa com o resto do
  site; a capacidade acerta o tablet de 1024px sem mouse, que hoje cai no layout de notebook.
  Provavelmente os dois, com papéis distintos: a **largura** decide o layout, a **capacidade**
  decide os gestos e os pisos de toque.
- **[DECIDIR] O tablet em paisagem.** Entre 901 e 1100px o Grid empilha. Um iPad em paisagem tem
  1024px e uma tela larguíssima: ele quereria as duas colunas do notebook, e não a pilha. Vale
  baixar o corte das duas colunas para ~900px e deixar a pilha só para o telefone?
- **[DECIDIR] A barra de baixo do mestre.** Os cinco alvos propostos são um chute informado.
  Confirmar com uma sessão de verdade quais são os cinco gestos mais repetidos.

## 6. Ordem e tamanho

| | fase | tamanho | depende de |
|---|---|---|---|
| 1 | O chão (app-shell, 456px → 150px) | médio | nada |
| 2 | A barra de baixo | médio | 1 |
| 3 | As gavetas (Em campo, Registro, fila) | médio | 2 |
| 4 | **Os diálogos viram folhas** | médio | 1 |
| 5 | Os gestos (pinça, toque duplo, vibrar) | pequeno | nada |
| 6 | O jogador no telefone | pequeno | 2, 3 |
| 7 | A prova na bancada | pequeno | acompanha cada fase |

**A fase 4 não depende da 2 nem da 3**, e carrega três correções de defeito (os botões da folha da
ação fora da tela, os botões invisíveis do registro, o ✕ colado no ↻ no fundo). Se for para
entregar uma coisa só e ver como fica na mão, é ela.
