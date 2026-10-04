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
- Outro lugar que trata de resistir a efeito mental: só a linha "Mente e alma" de
  `arcano.resistencia.tipos`, que ganhou a remissão.

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

## Bloco C · Fôlego: PARADO

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
