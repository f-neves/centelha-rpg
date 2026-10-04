# Rodada de pendências do autor (blocos A a K) · relato da Executora

Despacho: `docs/simulacao/caixa/rodada-pendencias-despacho.md` (`4e3b929b`). Registro conferido em
`docs/decisoes-partes/decisoes.md` (D-014, D-015, D-006). Um bloco por commit, com o sha e o CI.

**Antes, uma nota do Resistir (`a7bec31c`).** O Validar daquele commit (run 37143965515) teve **1 job
vermelho**, o smoke `test-l70-ocupacao-mesa`, com "Timed out after 30000 ms while waiting for the WS
endpoint URL". É o mesmo sintoma de navegador dos `test-l84` e `test-l88` de antes, num commit que só
mexia em texto e no `regras.json`. Os outros 18 jobs e o Deploy passaram. Os commits seguintes, que
já contêm o mesmo conteúdo, passaram inteiros: `99e97b25` (Validar 37144918668) e `3ac9256c` (Validar
37166598091). Não pedi rerun.

## Bloco A · Resistir: ESCALA 2 (D-015) e o ponto 7 (D-014)

**`regras.json`.**
- `social.modoDevagar.resistencia` (o cortejo) perdeu `tetoCusto` e `tetoCustoNota`. Ficou como estava
  antes de `a7bec31c`: `custoBase 1`, `divisorExcedente 6`, `vontadePresa`.
- O teto do Combate Social ganhou um lugar próprio, no bloco do modo com dado: `social.modoRapido.resistencia`,
  com `custoBase 1`, `porMargem 1`, `tetoCusto 4` e uma nota. A nota diz que o mesmo teto vale para o
  efeito mental e que não alcança o cortejo, que está em discussão.
- Nenhum código lê esses objetos: o `grep` por `modoRapido`, `tetoCusto` e `resistencia.` em `src` e
  `scripts` só acha `arcano.resistencia`, que é outro bloco.
- `arcano.resistencia.tipos`, linha "Mente e alma": o "resiste" ganhou, depois da frase de antes,
  "; passando, o alvo ainda pode pagar Força de Vontade para recusar o efeito ou encurtá-lo (ver
  Defesas)". O texto de antes tem um travessão, que não é meu e ficou.

**`relacoes-sociais.md`.** Conferido: o teto 4 aparece só no Combate Social (`:149` e a tabela) e na
Folha (`:275`). O cortejo (`:242`, `:246`, `:276`) não traz teto. Nada a tirar. A frase "o intervalo
não é uma ação" não foi tocada.

**Ponto 7 · efeito mental.** `defesas.md`, a linha "Ataques e influências mentais":
- antes: "**Sim**: você se blinda por um tempo (uma cena ou um dia, conforme o efeito)."
- depois: "**Sim**: pagar **1 + Margem** de Vontade (teto 4) recusa o efeito. Com Margem 1 ou mais, você
  pode pagar só 1: o efeito pega, mas dura **um grau a menos na régua de Duração do próprio efeito**
  (a da Arte, Breve ou Longa, ou a da Proeza); se ele já está no menor grau dessa régua, pagar 1 o
  anula. Resistir é um pagamento, fora do limite de 1 ponto por ação."
- Nenhum nome de grau inventado: a frase aponta para as réguas, que são `arcano.improviso.graus`
  (`duracaoBreve`, `duracaoLonga`) e `escalasProeza.parametros.duracao`.
- Outro lugar que trata de resistir a efeito mental: a linha "Mente e alma" de
  `arcano.resistencia.tipos`, que ganhou a remissão. **Corrigido depois da revisão 126:** havia mais
  dois, que a minha varredura não pegou, `qual-sistema.md:43` (o nó do diagrama) e `:119` (a folha). Os
  dois ainda diziam a regra velha ("pontual ou por cena/dia"), e foram trocados no commit dos CORRIGE
  da 126 (ver o fim deste relato).

**Código e a Duração do efeito mental:** nenhum código lê a Duração do efeito mental nem cobra
Vontade para resisti-lo. `artes-grid-mesa.ts` e `artes-grid-ui.ts` citam a Defesa Mental (a conjuração
contra o número passivo), e nenhum dos dois tem Vontade nem Duração de resistência.

**Verificação** (sobre `4e3b929b`): `npm run validate` verde ("Portões OK"); `npx astro build --force`
verde. Em `dist/regras/defesas/index.html`, contado no texto sem marcação:
- "um grau a menos na régua de Duração do próprio efeito" (1) e "pagar 1 o anula" (1);
- "você se blinda" (0).
No JSON: `modoDevagar.resistencia` sem `tetoCusto`; `modoRapido.resistencia.tetoCusto` = 4.

**Arquivos do Bloco A:**
- `src/data/regras.json`
- `src/content/chapters/defesas.md`
- este relato

**Commit do Bloco A:** `03c1d711` · **CI:** Validar 37168526691 (19 de 19) e Deploy 37168526693 (2 de 2),
primeira volta.

## Bloco B · Margem na Acumulada: o Mestre decide (item 1)

- `acoes-e-sistema.md`, na Acumulada: depois de "a Margem não soma progresso por cima deles" entrou
  "**O que mais a Margem compra dentro de uma Acumulada, o Mestre decide.** Dois exemplos do que ele
  pode fazer: no Esgueirar, uma Margem congela um intervalo, com o vigia olhando para o outro lado; no
  Ofício feito às pressas, uma Margem sobe a qualidade da peça um grau."
- `acoes-sentidos-e-engano.md`, a linha "A Margem" do Esgueirar
  - antes: "Cada Margem pode, à escolha do jogador, **congelar um intervalo** [...]"
  - depois: "O que mais ela compra, o Mestre decide (a Margem na Acumulada, com link para
    `#acumulada`); um exemplo: cada Margem **congela um intervalo** [...]"
  - Saiu o "à escolha do jogador": quem decide passou a ser o Mestre.
- `regras.json`: nenhum campo trata os dois efeitos como regra fechada (o `grep` por "congel" só acha
  Artes, condições e textos de criatura). Nada a ajustar.
- **G75 fechada** (`G-acoes-sistema.md`): `[x]`, "[FECHADA]", com a decisão verbatim do autor e onde ela
  foi aplicada. `Pendencias.md` regerado: a G75 passou para a lista dos fechados de G.

**Verificação** (sobre `03c1d711`): `npm run validate` verde ("Portões OK"); `npx astro build --force`
verde. No HTML gerado, contado no texto sem marcação:
- `acoes-e-sistema` traz "O que mais a Margem compra dentro de uma Acumulada, o Mestre decide." e "sobe a
  qualidade da peça um grau" (1 cada), e a âncora `id="acumulada"` existe;
- `acoes-sentidos-e-engano` traz "O que mais ela compra, o Mestre decide" (1) e "à escolha do jogador,
  congelar" 0 vezes.

**Arquivos do Bloco B:**
- `src/content/chapters/acoes-e-sistema.md`
- `src/content/chapters/acoes-sentidos-e-engano.md`
- `docs/pendencias/G-acoes-sistema.md`
- `Pendencias.md`
- este relato

**Commit do Bloco B:** `e7c06baa` · **CI:** Validar 37169320767 (19 de 19) e Deploy 37169320714 (2 de 2),
primeira volta.

## Bloco C · Fôlego: PARADO (retomado abaixo, depois do D)

O Fôlego não alimenta nenhuma fórmula de Energia, de combate nem da Pressão, mas é a mecânica de conteúdo
que o pedido não mandou apagar:
- **9 Técnicas** com `modulo: "folego"`, todas da Proeza `coracao-incansavel`: `folego-profundo`,
  `segundo-vento`, `marcha-forcada`, `incansavel`, `pulmoes-de-ferro`, `sem-limites`,
  `vigor-inesgotavel`, `coracao-eterno` e `folego-de-sobra`;
- mais 2 Técnicas que citam o Fôlego no texto: `segundo-folego` e `fechar-feridas`;
- **2 Efeitos de Arte** que fazem perder Fôlego (`efeitos.json:4372`, o Inverno; `:5586`, o afogamento);
- a condição `sem-folego` (`condicoes.json:166`);
- o campo `folego` de todas as armas.

Mandei o mapa (197 linhas, `../tmp/executora/folego-mapa.txt`) e três opções ao Arquiteto. O Bloco C
espera a resposta, e nada dele foi tocado.

## Bloco D · Teto de Arte e a F2 (item 4, D-006), em dois commits

### D, texto

- **`regras.json`**: bloco novo `arcano.tetoNivelArte`, com `porCentelha: [2, 3, 4, 5, 6, 6, 6]` (o
  índice é a Centelha, de 0 a 6) e a nota. A nota diz que a tabela é provisória (D-006) e que o teto de
  Proeza continua sendo a Centelha.
- **`src/pages/artes/regras.astro:46`**: depois de "não é preciso Centelha para tocar a magia (o mortal
  conjura com a Mana [...])" entrou "e o **nível máximo** de cada Arte é **Centelha + 2**, até 6
  (Centelha 0 → 2; 1 → 3; 2 → 4; 3 → 5; 4, 5 ou 6 → 6; provisório)". O comentário `TOLERÂNCIA` com
  `LEVANTA QUANDO` vai logo acima, para o portão das tolerâncias.
- **`criacao-de-personagem.md:58`**
  - antes: "Arte de qualquer nível não exige Centelha: o mortal (Centelha 0) também aprende e conjura,
    com a Mana [...]"
  - depois: "Arte não exige Centelha para começar: o mortal (Centelha 0) também aprende e conjura, com a
    Mana [...]. O nível máximo de cada Arte é **Centelha + 2**, até 6 ([a tabela]; provisório)."
  - O negrito vai como `<strong>`, porque o parágrafo é HTML e o `**` não renderiza ali.
- **`centelha.md`**, a linha 0 da tabela: "Artes, com a Mana [...]" passou a "Artes até o nível 2, com a
  Mana [...]".
- **`combate.md:300`** (a CLAREZA da 124): "corre a **6 m por Tick** (5,5, arredondado) no Arranque e a
  **9 m por Tick** (8,5, arredondado) na Corrida". A Revisora pediu só o 5,5; pus os dois, pelo mesmo
  motivo.


**Commit do Bloco D (texto):** `d8f693b1` · **CI:** Validar 37169937791 (19 de 19) e Deploy 37169937814 (2
de 2), primeira volta.

### D, código

**Destrava o que o livro já diz.** Não entram a reserva própria de Mana do mortal (D-002) nem a Meditação
(D-003).
- **`src/lib/ficha-engine.ts:176`** (`capFor('arte2')`)
  - antes: `(S.centelha || 0) > 0 ? 6 : 0`
  - depois: lê `regras.arcano.tetoNivelArte.porCentelha[Centelha]`. Centelha 0 dá 2, 1 dá 3, ..., 4 a 6
    dão 6.
  - O `capFor` só limita a compra nova (`applyVal`): um valor salvo acima do teto não é cortado ao
    carregar, só aparece com as bolinhas marcadas como acima do teto. Nenhuma ficha salva perde nível.
  - Comentário com `TOLERÂNCIA` e `LEVANTA QUANDO`.
- **`src/components/FichaSkeleton.astro:117`**: o rótulo "(10 + nível×5 · exige Centelha > 0)" passou a
  "(10 + nível×5 · nível máximo: Centelha + 2, até 6)".
- **`src/pages/mesa/grid.astro:3329`**: `mana: R.centelha > 0 ? R.mana : 0` passou a `mana: R.mana`, que é
  a `mana` de `calc.ts` (a Vontade, no mortal).
- **`src/pages/mesa/combate.astro:1693`**: `(S.centelha || 0) > 0 ? manaDe(...) : null` passou a
  `manaDe(...)` para todo personagem.
- **As citações que a linha nova empurrou** (o `test-procedencia` acusou três; reapontadas à mão):
  - `K-combate-linha-do-tempo.md:335`: `ficha-engine.ts:1545` passou a `:1552`;
  - `L-simulacao-simultaneo.md:5702` e `:5703`: `:1655` e `:1656` passaram a `:1664` e `:1665`.

**Prova na ficha** (`../tmp/executora/teste-arte-mortal.mjs`, Edge headless sobre o dev server):
- ficha nova, Centelha 0: o teto da Arte é 2; clicar no 3 não muda nada, e clicar no 2 dá 2;
- Centelha 1: o teto vira 3; clicar no 4 não passa, e clicar no 3 dá 3;
- saída: "✓ teto da Arte na ficha: Centelha 0 → 2, Centelha 1 → 3".
O smoke da ficha (`driver.mjs`) também passa: "✓ all checks passed".

### Acima do teto (listado, sem alterar)

- **Criaturas: nenhuma.** As 58 criaturas com Arte em `inimigos.json` estão dentro do teto da própria
  Centelha.
- **Fixtures:** a do Kael não tem Arte.
- **Exemplos do livro:**
  - **Bram** (`criacao-de-personagem.md:151-172`, Centelha 1, teto 3): Artes **5, 5, 5, 5, 5, 3, 3**.
    Cinco Artes passam do teto, cada uma 2 níveis acima.
  - Veil (Centelha 4, teto 6): 4, 4, 3, 3, 3, 3, dentro.

### Outra regra escrita que conflita com o teto novo

- **O arquétipo do mortal-tocado** (`criacao-de-personagem.md:149` e o Bram): "a Centelha só engorda
  essa reserva; ela não é a medida da profundidade", e "Conjura Artes de nível 5 com Centelha 1: a mesma
  profundidade que Veil [...] porque a profundidade vem do estudo". Com o teto Centelha + 2, a Centelha
  passa a limitar a profundidade, e o Bram não existe como está. Não mexi no texto nem na ficha: é para o
  autor.
- **O exemplo do magus de academia** (`src/pages/arcano.astro:63`, acrescentado depois da revisão 126):
  "um magus de academia de Centelha mínima que, só com estudo, conjura Artes tão fundas quanto as de um
  grande herói". Com o teto Centelha + 2, Centelha mínima dá Arte 2 ou 3 no máximo (Centelha 0 ou 1), e o "tão fundas quanto
  as de um grande herói" deixa de valer. É o mesmo conflito do Bram. Não mexi no texto. O autor já
  decidiu (D-035, 04/10/2026): reescrever pela amplitude, e não pela profundidade. Reescrito depois, ver "A D-035 no
  arcano.astro:63" no fim deste relato.
- A memória de projeto "Trilhas de Feitiçaria" (a Arte só exige Centelha > 0, e a profundidade vem do
  XP) é anterior à F2 e a esta decisão. Registro para quem a ler.

**Verificação** (sobre `e7c06baa`):
- `npm run validate` verde ("Portões OK"), depois dos marcadores de tolerância e das citações
  reapontadas;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde.

No gerado:
- `dist/artes/regras/index.html` traz "nível máximo de cada Arte é Centelha + 2" (1);
- `criacao-de-personagem` traz "O nível máximo de cada Arte é Centelha + 2" (1);
- `centelha` traz "Artes até o nível 2" (1);
- `combate` traz "6 m por Tick (5,5, arredondado)" (1);
- `dist/ficha/index.html` traz o rótulo novo (1), e "exige Centelha > 0" aparece 0 vezes;
- os scripts gerados citam `tetoNivelArte` (2).

**Commit do Bloco D (código):** `7e0d0bb7` · **CI:** Validar 37170427913 (19 de 19) e Deploy 37170427933 (2
de 2), primeira volta.

## Bloco C, retomado · Fôlego: sai o motor (D-016)

Parei antes (registro acima), e o autor decidiu a D-016, a "variante da C". Aplicado:

**1. Sai o motor inteiro.**
- O capítulo `src/content/chapters/folego.md`, com `git rm`. Saem com ele o Esforço e o Tomar Fôlego, que
  só existiam ali.
- `regras.json`: o bloco `derivados.folego`. A nota da recuperação da Vontade dizia "a única das quatro
  reservas sem relógio: o Fôlego volta por Tick [...]" e passou a "das três reservas [...]: a Mana volta
  por hora [...] e a Energia por cena".
- `calc.ts`: a função `folego()`.
- A ficha:
  - `ficha-engine.ts`: o import, o cálculo, a linha "Fôlego" dos derivados e, no bloco de combate, o
    "· Fôlego N" e a linha "Custa N de Fôlego por golpe [...] Esforço [...]";
  - `ficha-card.ts`: o número no cartão.
- A mesa:
  - `mesa-ficha.ts`: o campo `folego` do resumo e do `resumoParaBanco`;
  - `grid.astro`: o `folego` do perfil do PC e da criatura, mais o comentário;
  - `grupo.astro`: o "Fôlego" do painel.
- O módulo: `src/lib/modulos.ts` perdeu o `MODULOS` (a bandeira só servia ao Fôlego). Os usos saíram de
  `site.ts` (a entrada XX da navegação), de `equipamentos.astro` (a coluna Fôlego das duas tabelas de
  armas) e de `regras/[slug].astro` (os capítulos ocultos).
- O texto: o callout "Regra opcional: O Fôlego [...]" de `combate.md`, que linkava para o módulo, saiu
  inteiro. Em `custo-qualidade-e-equipamento.md:82`, saiu o "baixar o custo de Fôlego" da lista de
  melhorias de qualidade.
- O simulador `scripts/sim-folego.mjs` (`git rm`), que lia o `derivados.folego` e quebraria se rodasse.
  O `scripts/add-folego.mjs` FICA: é o gerador do campo `folego` das armas, que fica.
- Os testes:
  - `test-kael.mjs`: sem o Fôlego (era 44);
  - `test-contrato.mjs`: sem `F.folego`, e o resumo gravado no banco perdeu a chave `folego`;
  - `test-porte-raca.mjs`: sai o item 4 (a nota do Fôlego sem base por raça, `M-26`);
  - `test-proezas-modulos.mjs`: reescrito. As nove seguem ocultas, sem a "reativação", que não existe
    mais.
  - A nota da fixture `kael.json` não fala mais do Fôlego.

**A ficha ignora o campo velho.** O Fôlego nunca foi guardado na ficha (era derivado), mas foi para o
`resumo` do banco (`resumoParaBanco`) e para o perfil do Grid. Hoje nada lê esse campo, então resumo
velho com `folego` abre e o campo some. Prova: `../tmp/executora/teste-folego-velho.mjs` monta o Kael da
fixture COM `folego: 44` e `derivados.folego`, chama `resumoFicha` e `resumoParaBanco`, e sai "resumo: sem
folego · banco: sem folego · PV 37 · ✓ ficha com o Fôlego velho abre, e o campo é ignorado". O smoke da
ficha (`driver.mjs`) também passa. Não precisa de `RENOMES` nem de migração.

**2. Sai a condição "Sem fôlego"** (`condicoes.json`, id `sem-folego`). Combatente da mesa que tenha a
condição gravada não quebra: `mesa-condicoes.ts:56` monta a condição com `COND[k.id] || {}`, e o que
falta no catálogo só fica sem os dados dele.

**3. O que o jogador vê:**
- `efeitos.json`, o afogar: "perde Fôlego a cada 6 Ticks enquanto durar" passou a "sufoca enquanto
  durar, mesmo em terra seca, pela regra de Sufocamento do capítulo Resistir (Janela de socorro = Vigor
  × 20 Ticks)".
- `efeitos.json`, o Inverno: "quem fica exposto perde Fôlego de 6 em 6 Ticks" passou a "quem fica
  exposto sofre −1d6 nas ações físicas enquanto exposto".
- As duas Técnicas visíveis, `segundo-folego` e `fechar-feridas`: **não têm frase do Fôlego no
  texto**. O mapa as achou pelo id; o nome "Segundo Fôlego" é a expressão de "segundo fôlego" e ficou.

**4. Ficam, ocultos e inertes:**
- as nove Técnicas da Coração Incansável. `tecnicaDisponivel` (`modulos.ts`) as mantém fora, agora sem
  bandeira;
- o campo `folego` das armas e dos schemas (`validate-data.mjs:106`, `content.config.ts:201`, mais o
  `modulo: "folego"` de `content.config.ts:84`).
Pendência nova **D16** em `D-proezas-tecnicas.md`; `Pendencias.md` regerado.

**Os "fôlego" que ficaram, porque são a palavra comum e não a reserva:**
- `atributos.md:45` e `atributos.json`, o Vigor;
- `habilidades.md`;
- `habilidades-secundarias` (Canto);
- `acoes-corpo-e-movimento.md:183`;
- `caminhos.json:104`;
- `artes.json:852`;
- nomes de poderes de criaturas ("Fôlego Longo" e outros).

**Verificação** (sobre `7e0d0bb7`):
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npm run validate` verde ("Portões OK"), com o `test-kael`, o `test-contrato`, o `test-porte-raca`
  e o `test-proezas-modulos` novos;
- `npx astro build --force` verde.

No `dist/`:
- a página `regras/folego` não existe mais;
- nenhum HTML traz "regras/folego", "módulo Fôlego" ou "Tomar Fôlego" (0);
- a tabela de `equipamentos` não tem coluna "Fôlego" (0);
- o callout "Regra opcional O Fôlego" sumiu de `combate` (0).

**Para quem joga hoje:**
- o Fôlego sai do livro, da ficha e da mesa;
- fichas e resumos salvos com ele abrem normalmente, e o campo some;
- a condição "Sem fôlego" deixa de existir;
- nenhuma migração.

**Commit do Bloco C:** `66497997` · **CI:** Validar 37171337323 (19 de 19) e Deploy 37171337317 (2 de 2),
primeira volta.

## Bloco E · Recompensa: a matilha de worgs passa a desafio 1 (item 5, P-05)

A conta, pela regra do capítulo (Valor × Semanas × tarefa × risco × Pessoas):
- antes: proteger, **desafio 3** (Valor 910), 1 semana, ×1, ×1, 4 pessoas: 910 × 1 × 1 × 1 × 4 = 3.640,
  arredondada a **3.600 pc**;
- depois: proteger, **desafio 1** (Valor 95), 1 semana, ×1, ×1, 4 pessoas: 95 × 1 × 1 × 1 × 4 = **380 pc**,
  que já é redondo na régua.

O que mudou:
- **`custo-servicos.md:113`**
  - antes: "(proteger, desafio 3, 1 semana, ×1, 4 pessoas): 910 × 1 × 1 × 1 × 4 = 3.640, arredondada:
    **3.600 pc**. O desafio 3 da matilha foi medido na bancada e é **provisório** até a medição de bando com
    a Regra de Horda. Referência para o Mestre: worg sozinho, desafio 0; dupla, desafio 2; matilha de 4,
    desafio 3."
  - depois: "(proteger, desafio 1, 1 semana, ×1, 4 pessoas): 95 × 1 × 1 × 1 × 4 = **380 pc**. Referência
    para o Mestre: matilha de 4 worgs, desafio 1."
  - A referência antiga (worg 0, dupla 2, matilha 3) saiu inteira: ela era a medição da bancada, e o autor
    fixou o número do exemplo. O "provisório" saiu junto, porque o número agora é decisão, e não medição.
- **`scripts/test-recompensa.mjs`**
  - o exemplo passou de `{ desafio: 3 }`, 3.640 / 3.600, a `{ desafio: 1 }`, 380 / 380;
  - o cabeçalho deixou de dizer "worgs 3.600 [...] por decisão do autor" e diz que a matilha é desafio 1
    desde 03/10/2026 (P-05);
  - a mensagem da ajuda de estimar ("4 de desafio 0 [...]: 1, contra o 3 medido") perdeu o "contra o 3
    medido". A asserção é a mesma: 4 criaturas de desafio 0 estimam desafio 1, que agora casa com o exemplo.
  - saída: "✓ recompensa de trabalho OK · 33 asserções".
- **A calculadora** (`CalculadoraRecompensa.astro`) não tem o exemplo nem a referência dos worgs: a única
  menção é "Um grupo veterano que pega uma matilha de worgs recebe o mesmo [...]", sem número, e ficou.
  Ela lê a tabela de `recompensa`, que não mudou.
- **`docs/pendencias/B-bestiario.md`**, B18 (a medição de bando): acrescentei que o exemplo foi fixado em
  desafio 1 pela P-05, e que a medição segue na fila sem mexer nele. O `Pendencias.md` regerado não muda.

Ficam, por serem registro do que foi medido ou decidido na época: `docs/decisoes-partes/B.md` e `C.md`,
`120-revisora.md`, `b14-cr-desafio-fase4-5-despacho.md`, `fechamento-economia-reforma-despacho.md` e os
arquivos de `docs/calibracao/discussao/`.

**Commit do Bloco E:** `ce425f84` · **CI:** Validar 37172173817 (19 de 19) e Deploy 37172173810 (2 de 2), primeira volta.

## Bloco F · Ataque Total não existe (item 7, P-07)

- **`scripts/sim/desafio-bancada.mjs`**: saiu a variante inteira.
  - Em `escolherAcaoCriatura`, saiu a opção `ataque-total` (3 golpes sem a penalidade da Rajada, 1 uso a
    cada 3 turnos) e o retorno dela. No lugar ficou um comentário de duas linhas: "Não existe Ataque Total
    no sistema: cada ataque é separado (P-07, decisão do autor de 03/10/2026). A variante de teste da
    Fase 5b (`opts.ataqueTotal`) saiu daqui."
  - Em `rodarBatalha`, saiu o `c.ataqueTotal = !!opts.ataqueTotal` com o comentário; o ramo
    `acao.tipo === 'basico' || acao.tipo === 'ataque-total'` voltou a ser só `'basico'`, e o cooldown saiu.
  - Em `rodarBatalhaBando`, saiu o `ataqueTotal: false` das criaturas e o mesmo ramo.
  - Nenhum outro script passava a opção: `desafio-5b-bateria`, `desafio-diagnostico` e `desafio-matriz`
    importam a bancada e não a citam.
  - Prova (`../tmp/executora/teste-bancada-F.mjs`): `node --check` ok; 40 batalhas do Filhote de dragão
    vermelho contra Centelha 3, passando de propósito a opção velha `{ ataqueTotal: true }` (é ignorada), e
    20 batalhas de bando com 4 worgs, todas sem erro.
- **Documentos onde aparecia como decisão pendente:**
  - `Pendencias.md` e `docs/pendencias/*`: não citam o termo (conferido por `grep -i "ataque total"`).
  - `b14-fase5b-economia-de-acao-relato.md:192-193`, em "O que fica pendente desta rodada": "Se 'Ataque
    total' vira ficha de verdade (poder natural) [...]: decisão do autor." Acrescentei na mesma linha
    "**Decidido em 03/10/2026 (P-07): não existe Ataque Total no sistema, cada ataque é separado; a
    variante saiu da bancada.**" Sem linha nova, para não mexer em citação.
- **Ficam, porque citam o termo como fato passado:**
  - `b14-fase5b-economia-de-acao-despacho.md:27` e `:71` (o pedido da variante);
  - o resto do `b14-fase5b-economia-de-acao-relato.md` (`:121-135`, `:251`, `:258-264`, `:369`, os
    números medidos com a variante);
  - `fechamento-economia-reforma-despacho.md:5`;
  - `docs/decisoes-partes/decisoes.md:1199` (a própria P-07).
- O "Multiataque total" do Grande Wyrm é habilidade de criatura, de outro nome, e fica.

**Commit do Bloco F:** `468a532f` · **CI:** Validar 37172248130 (19 de 19) e Deploy 37172248140 (2 de 2),
primeira volta.

## Bloco H · Pequenas pendências técnicas (item 15)

- **`gen-monsters` sem `--check`.** `scripts/gen-monsters.mjs` ganhou `--check`, no molde do
  `gen-bestiario.mjs --check`: gera em memória, compara com o `monsters.json` e o `monsters-mesa.json` do
  disco e sai com código 1 e a lista do que diverge, sem gravar. O `validate` (`package.json`) passou a
  rodá-lo logo depois do `gen-bestiario.mjs --check`, e o `test-portoes.mjs` tirou o `gen-monsters.mjs` da
  lista `GERADORES_FORA` (os geradores que não se conferiam). A linha nova empurrou a citação de
  `docs/simulacao/REVISORA.md:1196`: `gen-monsters.mjs:217` passou a `:228`. Controle negativo: com o
  `monsters.json` alterado à mão, o `--check` saiu com código 1; desfeito, saiu 0.
- **O comentário de `desEsqDaDefesa`** (`src/lib/artes-grid.ts:1857-1858`):
  - antes: "o valor sai um pouco ALTO, nunca inventa um negativo, e o teto de 12 continua batendo o
    bestiário inteiro."
  - depois: "o valor sai um pouco BAIXO (tira 2×Centelha, e a Defesa só tinha 2×Esquiva), nunca
    negativo, e o teto de 12 continua batendo o bestiário inteiro."
  - Só o comentário, o mesmo número de linhas. A aproximação em si (a função subtrai 2 × Centelha
    cheio) ficou, como no achado da correção da Reforma (`correcao-reforma-relato.md:78-85`).
- **A Percepção do Kael na fixture.** A certa é **6**: é a do Kael do capítulo de criação
  (`criacao-de-personagem.md:95`, "Percepção 6 (pico)"), que é a ficha. Corrigi a **fixture**
  (`scripts/fixtures/kael.json`, `"percepcao": 3` passou a `6`). O `test-kael.mjs` não lê Percepção. O
  `test-contrato.mjs` segue verde sem mudança ("Contrato ficha↔mesa OK [...] Defesa 19"), porque nenhum
  número que ele confere passa pela Percepção. A fixture também alimenta o `mesa-mock.mjs` dos smokes.
  `npm run smoke` local com a fixture nova: 17 dos 18 verdes. O `test-grid` falhou num item de toque
  ("nada dentro dela fica abaixo de 44px", o botão `mesa-sair` com 40,55 de largura). **Controle:** com a
  fixture velha (Percepção 3) o `test-grid` falha no MESMO item, com o mesmo número, então a falha é da
  máquina (largura de fonte), e não da fixture; no CI o `test-grid` está verde. O `test-espelho`, que o
  `&&` do `smoke` não chegou a rodar, rodei à parte: "os dois laços concordam".
  - Fica registrado, sem mexer: a fixture e o capítulo divergem também nas Habilidades (a fixture tem
    Armas 3 e Furtividade 2; o capítulo tem Atirador 3, Briga 2 e Furtividade 5). O despacho pediu só a
    Percepção, e a nota da fixture diz que as Habilidades são as do `test-kael.mjs` de propósito.
- **O "16" da Sora** (`combate.md:21`). O pool é 5d6 + 9, e somar 16 pede 7 nos cinco dados: possível,
  mas longe da média (17,5), e com Defesa 10 o golpe não tinha como errar (o mínimo é 14).
  - antes: "Sora ataca um bandido de **Defesa 10**. [...] ela rola e soma **16**. 16 supera 10 → acerta,
    com diferença de 6, exatamente uma Margem"
  - depois: "Sora ataca um bandido de **Defesa 20**. [...] ela rola 17 nos dados e soma **26**. 26 supera
    20 → acerta, com diferença de 6, exatamente uma Margem"
  - A diferença segue 6 (uma Margem), e o resto do exemplo não muda.

**Verificação** (sobre `468a532f`):
- `npm run validate` verde ("Portões OK"), já com o `gen-monsters.mjs --check` dentro;
- `npx astro sync && npx tsc --noEmit` sem erro;
- `npx astro build --force` verde. No gerado, `dist/regras/combate/index.html` traz "Defesa 20" no
  exemplo da Sora (1) e "soma 26" (1), e "soma 16" aparece 0 vezes.

**Commit do Bloco H:** `319bf4b9` · **CI:** Validar 37172942688 (19 de 19) e Deploy 37172942666 (2 de 2), primeira volta.

## Bloco I · Itens mágicos (item 16)

- **`docs/itens-magicos/itens-magicos-pesquisa.md`**: lido inteiro antes (70 linhas) e commitado sem
  mudança. O arquivo estava sem rastrear na árvore `rpg-system`; copiei para a minha e conferi por `cmp`
  que as duas cópias são iguais. É pesquisa de referência, sem desenho: os modelos de D&D 5e, Pathfinder 2e
  e Exalted 3e por categoria (poções, pergaminhos, itens mágicos, armas e armaduras encantadas,
  artefatos), uma tabela do que cada modelo resolve e custa, e seis perguntas de contato com Centelha.
  Nenhum travessão no arquivo.
- **Pendência nova G76** (`docs/pendencias/G-acoes-sistema.md`): "Itens mágicos: poções, pergaminhos,
  itens mágicos, armas e armaduras encantadas, artefatos", em [DECIDIR], apontando para a pesquisa e
  cruzando com a G73 (preço do sobre-humano) e a G74 (poções). `Pendencias.md` regerado: G passa de 77
  para 78 itens, e o total de 353 para 354.
- **Para a árvore `rpg-system`:** a cópia sem rastrear de `docs/itens-magicos/itens-magicos-pesquisa.md`
  que está lá vai colidir com este commit no próximo `pull` ("untracked working tree files would be
  overwritten"). Como as duas são iguais, basta apagar a de lá antes do `pull`.

**Commit do Bloco I:** `70dd7728` · **CI:** no fim do relato.

## Bloco J · Economia, resumo (item 17)

Só leitura, nada mudou.

**1. O "tempo gasto".** O passo 1 de `custo-servicos.md:86` usa a expressão duas vezes, em sentidos
diferentes:
- "Terminar antes ou depois não muda a bolsa: quem contrata paga pelo resultado, e não pelo **tempo
  gasto**." Aqui é o tempo REAL do trabalho, que não entra na conta.
- "A viagem conta metade porque é **tempo gasto**, não perigo: paga o tempo, sem o prêmio de risco." Aqui
  é a viagem PREVISTA, que entra na conta (metade, em Semanas).
- A primeira frase se repete, verbatim, no aviso do topo da calculadora (`CalculadoraRecompensa.astro:14`).
- Não há conta errada: o leitor atento separa os dois. A ambiguidade é só de palavra, e foi apontada no
  fechamento da economia (`fechamento-economia-reforma-relato.md:592-596`) sem troca de redação.

**2. O padrão de Pessoas não chegou à calculadora.**
- O capítulo (`custo-servicos.md:97`) diz: "Na caça, o padrão é 4, o grupo de referência para o qual o
  desafio é pensado." Para a perícia ele não fixa padrão; os exemplos de perícia usam 1 e 2 pessoas.
- A calculadora abre com **4 em todo tipo de trabalho**. Os dois campos, "Pessoas (pagas no contrato)"
  (`CalculadoraRecompensa.astro:36`) e "Quantos vão de fato" (`:41`), nascem com
  `value={REC.pessoas_padrao}`. Esse valor é único e global: `recompensas.json:263`, `"pessoas_padrao": 4`,
  que vem de `lore/economia/v2/modelo.py:509` (`pessoas_padrao=4`). Trocar o tipo de trabalho não mexe
  no campo: o script da página só LÊ `pessoas` e `grupo` (`:145`), e nunca os reescreve.
- A biblioteca faz o mesmo: `recompensa.ts:128`, `const pessoas = e.pessoas ?? P.pessoas_padrao;`, sem
  olhar se o caminho é confronto ou perícia.
- Resultado: o "4 no confronto, 1 na perícia" não existe no código. Quem abre a calculadora para
  investigar uma carta começa com 4 pessoas e precisa trocar à mão. É a mesma leitura da ressalva 3 da
  rodada 120 (`120-revisora.md:179-182`), que segue aberta.

**Commit do Bloco J:** `9013360b` · **CI:** no fim do relato.

## Bloco K · Só registrar

Nenhuma regra, ficha ou código mudou. As entradas, com o texto do despacho e do registro (P-06, P-08 e
os adiados de `decisoes.md`):
- **Guarda sob pressão**: entrada nova **K38** [DECIDIR] em `K-combate-linha-do-tempo.md`. Adiada até
  fechar as regras de combate, "com grandes chances de no final manter como está"; registra a lacuna (o
  livro não diz como a guarda se renova para quem não age, esperando a vez, atordoado ou preso, nem o que
  conta como "agir"). Aponta para a K37, a C-011 e o item 7 dos achados de duas leituras.
- **K37**: a entrada que já existia ganhou o encaminhamento do autor. O Grid passa a cobrar a pressão pelo
  ataque feito e pelo recebido, junto com as regras de combate; até lá a mesa fica como está. Segue em
  aberto, porque não está aplicada.
- **B16**: a entrada que já existia (`B-bestiario.md`) ganhou "Adiada pelo autor em 03/10/2026: o
  vocabulário de resistências fica para depois".
- **Topo da tabela de recompensa (desafio 4 em diante)**: sub-item na **G73** (`G-acoes-sistema.md`), que
  é a pendência da qual a tabela depende ("provisória até a G73", no capítulo e na calculadora). Adiado,
  "sem pressa".
- **Dragões (Filhote, Jovem, Adulto)**: entrada nova **B19**, já fechada como [SEM AÇÃO]: "deixar do
  jeito que estão, sem mexer". Nenhuma alteração de ficha.
- **Cortejo**: entrada nova **E11** [DECIDIR] em `E-social-mental-antecedentes.md`. Em discussão pelo
  autor; ficam a frase "o intervalo do cortejo (8 dias ou mais) não é uma ação" (`relacoes-sociais.md`,
  Quando o alvo segura) e a Vontade presa (`vontadePresa` e `vontadePresaNota`, em
  `regras.json` → `social.modoDevagar.resistencia`).

`Pendencias.md` regerado.

## Bloco G · lore/economia fora do git (item 13, opção A, P-10)

**A prova antes.** Para cada arquivo que sai, `grep -rln` em `scripts/`, `src/`, `.github/`,
`package.json` e `astro.config.*`, pelo nome (`economia/README`, `anexo-auditoria`, `catalogo-unificado`,
`estado-revisao`, `etapas-abc`, `revisao-economica-etapas`): **0 leitores** em todos. Os três leitores
da economia leem só a v2/ e a procedência:
- `scripts/copiar-economia.mjs:27-28`: `MODELO = lore/economia/v2` e `LORE = lore/economia`, onde ele só
  escreve e confere os `*.procedencia.json`; o laço da `:42` copia os `.py` da v2/;
- `scripts/gen-cap-economia.mjs:4`: os JSONs de `src/data` que saem da v2/;
- `scripts/validate-data.mjs:922`: o comentário e os esquemas da economia gerada pela v2/.
Nenhum script varre `lore/` inteiro, e nenhum documento de `docs/` nem o `Pendencias.md` cita os
arquivos que saem por `arquivo:linha` (o `test-procedencia` pula arquivo que não existe, de qualquer
jeito).

**Saem do índice** (`git rm --cached`; continuam no disco, e a história não muda):
- `lore/economia/README.md`, `anexo-auditoria-f1-f3.md`, `catalogo-unificado.md`, `estado-revisao.md`;
- `lore/economia/etapas-abc/base.py`, `gerar.py`, `mercadorias.py`, `modelo.py` e
  `revisao-economica-etapas-abc.md`.

**Ficam versionados:** a `v2/` inteira (`base.py`, `gerar.py`, `mercadorias.py`, `modelo.py`,
`revisao-economica-v2.md`, `mercadorias.procedencia.json`) e os três `*.procedencia.json` fora dela
(`lore/economia/`, os de mercadorias e de montarias; e o de `etapas-abc/`).

**`.gitignore`**, depois das linhas que já existiam para a economia:
- `lore/economia/*.md`: os documentos da raiz. Pega também o `prompt-revisao-economica.md`, que está sem
  dono e sem rastrear na árvore `rpg-system`: passa a ser ignorado, e não foi commitado;
- `lore/economia/etapas-abc/*` com a exceção `!lore/economia/etapas-abc/*.procedencia.json`.
- A v2/ não é atingida: o `*` do gitignore não atravessa `/`, então `lore/economia/*.md` não casa
  `v2/revisao-economica-v2.md`. Conferido com `git check-ignore -v`: os dois arquivos que saem casam a
  regra nova, e `v2/gerar.py`, `v2/revisao-economica-v2.md` e `etapas-abc/mercadorias.procedencia.json`
  não casam nada.

**CI de I, J e K:**
- I `70dd7728`: Validar 37173731667 (19 de 19); o Deploy 37173731658 foi cancelado pelo push seguinte
  (`deploy.yml`, `concurrency: pages`, `cancel-in-progress: true`).
- J `9013360b`: Validar 37173779519 (19 de 19); o Deploy 37173779504 foi cancelado do mesmo jeito.
- K `5c18b7d3`: Validar 37173852179 (19 de 19) e Deploy 37173852183 (2 de 2). Esse deploy publicou
  tudo.

**O G foi liberado pelo Arquiteto (opção 1)** depois do aviso de que o `pull` apaga os 9 arquivos do
disco das outras árvores. Antes do commit, na minha árvore, `git status --short -- lore/economia`
mostrava só as 9 deleções preparadas, e nenhuma mudança na pasta de trabalho. Os 9 arquivos do disco são
iguais aos do `HEAD` (`cmp`, um por um).

**Para quem tem outra árvore (a `rpg-system` e a da Revisora):** o `pull` deste commit apaga os 9
arquivos do disco. Para trazê-los de volta sem que entrem de novo no índice (o pai do G é `5c18b7d3`):

    git restore --source=5c18b7d3 --worktree -- lore/economia/README.md lore/economia/anexo-auditoria-f1-f3.md lore/economia/catalogo-unificado.md lore/economia/estado-revisao.md lore/economia/etapas-abc/base.py lore/economia/etapas-abc/gerar.py lore/economia/etapas-abc/mercadorias.py lore/economia/etapas-abc/modelo.py lore/economia/etapas-abc/revisao-economica-etapas-abc.md

Depois, `git status --short -- lore/economia` tem de sair vazio, porque os 9 passam a ser ignorados.
**Revisora:** restaure a sua árvore por conta própria, com o mesmo comando.

**Como o commit saiu, para quem repetir:** o `git commit -- <caminhos>` NÃO serve para `git rm --cached`.
Com pathspec, o git monta o commit a partir da pasta de trabalho daqueles caminhos. Como os 9 arquivos
continuam no disco, ele os pôs de volta e o commit saiu só com o `.gitignore` e o relato (2 arquivos, nenhuma
deleção). Não publiquei esse commit: refiz o `git rm --cached`, conferi por `git diff --cached
--name-status` que o índice da minha árvore tinha só as 9 deleções (e o relato), e corrigi o commit pelo
índice com `--amend`. Isso é seguro aqui porque cada worktree tem índice próprio.

**Commit do Bloco G:** `822be8b1` · **CI:** Validar 37174631521 (19 de 19, checkout limpo, sem os 9 arquivos) e
Deploy 37174631532 (2 de 2), primeira volta. Com isso, A a K estão publicados.

## Os dois CORRIGE da revisão 126

**(A) `qual-sistema.md`, a regra velha de blindar a mente.** Só este trecho; o teto do cortejo não foi
tocado.
- `:43`, o nó do diagrama:
  - antes: "Alvo pode gastar Vontade para blindar: pontual (nega um golpe) ou por cena/dia"
  - depois: "Alvo pode gastar Vontade: 1 + Margem (teto 4) recusa; pagar 1 encurta um grau na régua de
    Duração do efeito, e no menor grau anula"
- `:119`, a folha:
  - antes: "**Blindar a mente:** gastar Força de Vontade (pontual ou por cena/dia)."
  - depois: "**Blindar a mente:** pagar **1 + Margem** de Força de Vontade (teto 4) recusa o efeito; com
    Margem 1 ou mais, pagar só 1 encurta um grau na régua de Duração do próprio efeito, e no menor grau o
    anula (ver [Defesas](/regras/defesas))."
  - O "Contra **leitura** não dá para se recusar" ficou.
- O SVG saiu do `gen-mermaid.mjs`. Na minha máquina ele redesenha os outros cinco diagramas com
  diferenças de poucos caracteres (medida de fonte), sem mudança de fonte. Mantive os cinco iguais aos do
  `HEAD` e troquei só a entrada do diagrama editado (`7b7b23843517` passou a `9d02a48ac089`); o
  `gen-mermaid.mjs --check` dá "diagramas em dia · 6 desenhos".
- A frase do Bloco A que dizia que não havia outro lugar foi corrigida lá em cima.
- Varredura depois: "por cena/dia" aparece 0 vezes em `src/content/` e em `src/data/`.

**(D) A lista do Bloco D** ganhou o `arcano.astro:63` (o magus de academia de Centelha mínima), sem
mudança no texto.

**Commit dos CORRIGE da 126:** `da98f8b1` · **CI:** Validar 37175588407 (19 de 19) e Deploy 37175588365 (2 de 2).

## A D-035 no arcano.astro:63

O Arquiteto mandou reescrever o arquétipo no commit pequeno dos CORRIGE. A ordem chegou depois de `da98f8b1`
(CORRIGE) e de `eaca41a0` (rodada 1 do veterana-1d) já estarem publicados, e por isso sai num commit à
parte.

- **`src/pages/arcano.astro:63`**, a Erudição:
  - antes: "*Exemplo:* um magus de academia de Centelha mínima que, só com estudo, conjura Artes tão fundas
    quanto as de um grande herói."
  - depois: "*Exemplo:* um magus de academia de Centelha mínima que se destaca pela **amplitude**: muitas
    Artes, rituais e preparo para cada ocasião. A pouca Centelha segura o nível de cada Arte (o teto é
    Centelha + 2: Centelha 0 chega ao nível 2, Centelha 1 ao 3), e não o quanto ele sabe."
- **`criacao-de-personagem.md:149`**, só relatado, sem mudança. Diz:
  > Os três acima sobem a Centelha junto com a magia, como manda a intuição. Mas a regra de Arcano **separa
  > as duas coisas**: para aprender e conjurar uma Arte **não é preciso Centelha**: o mortal conjura com a
  > Mana, que no mortal é a própria Força de Vontade, e a Centelha só engorda essa reserva; ela não é a
  > medida da profundidade. A profundidade (o nível da Arte) vem do estudo, comprada com XP. Isso abre um
  > arquétipo que os exemplos anteriores escondem: o feiticeiro **mortal-tocado**, que estudou fundo o que
  > quase não tem por natureza.
  - Com a D-006 e a D-035, "ela não é a medida da profundidade" e "A profundidade (o nível da Arte) vem do
    estudo" deixam de valer: a Centelha passa a limitar o nível da Arte. E "estudou fundo" promete o
    mesmo.
- **Outra frase que promete profundidade à Centelha baixa:** só a ficha do Bram, `criacao-de-personagem.md:153`:
  "a fagulha que carrega é mínima, mas o que sabe fazer com ela humilha conjuradores de tier maior. Conjura
  Artes de **nível 5** com Centelha **1**: a mesma profundidade que Veil". É do Bram, e não mexi: chega no
  veterana-1e.
- Varri `src/` por "profundidade", "tão fundas", "vem do estudo", "não é a medida", "só com estudo" e "grande
  herói". O resto que aparece é de outro assunto: o Contato ("largura, não profundidade"), o efeito
  Profundidade, a nota de Proeza do `regras.json:639`, que é a Centelha limitando a Proeza, e código de
  desenho 3D.
