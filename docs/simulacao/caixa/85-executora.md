# Rodada 85 · Executora · o ritmo de mover a Régua de Relação

Fonte única do lote: `docs/simulacao/caixa/ritmo-da-regua.md` (commit `92ee772`).
Alvo: `src/content/chapters/relacoes-sociais.md` e `src/data/regras.json`. Nada de motor.

- **09:37** · `git pull --rebase` ok (já em `92ee772`, nada a trazer). Árvore tem só dois
  arquivos não rastreados de outra frente (`analise-aparencia.md`, `jogador-novo-bestiario.md`),
  não encostei.
- **09:38** · li a especificação inteira (248 linhas) e medi o capítulo: 200 linhas.
- **09:44** · levantei o chão antes de escrever: `derivados.defesaSocial` (`regras.json`,
  campo `reguaNota`), `defesaSocial` em `src/lib/calc.ts`, os 8 ids de `racas.json`, e os
  portões. Achado que muda o item 8: **`acoes.longevidadeFirula` já codifica a regra que o
  item 2 derruba** (M-09, 17/09/2026, deslocamento de degrau +1/0/−1/−2), e a `nota` do
  `acoes.escalaIntervalo` cita o cortejo social como consumidor. Zero consumidores em código.
- **09:46** · conferido o alcance do portão de procedência: o `CITACAO` dele só casa
  `.ts|.astro|.mjs`, então nem `regras.json` nem `relacoes-sociais.md` deslocam citação de
  ninguém. A `caixa/` também está fora do escopo dele (varredura não recursiva + `ALVOS`).
- **09:47** · começando o capítulo, item a item da seção 5 da especificação.
- **09:58** · itens 1 a 5 escritos no capítulo: abertura e `resumo` do frontmatter, "Pedir as
  coisas" com o alcance, "Como a régua se move" (atos sem as linhas ±1, a pergunta da
  fronteira), "Conversa compra a cena, não o vínculo", "Sair do Neutro" com o teto de vidro
  ±2 e a nota do −1, a tabela do "Resistir" trocando passos por níveis de alcance, e "Ceder,
  e o alcance que a Margem compra". Dois exemplos refeitos: o do Lírio no Neutro (o presente
  virou gesto, a conta agora fecha em 2 dos 3 passos) e o do duelo da Vesna.
- **10:12** · antes de publicar número, conferi quais das tabelas medidas da especificação se
  RECONSTROEM pela fórmula (não refiz conta nenhuma: só apliquei a fórmula do item 1 aos
  números que o documento já traz). Resultado: reconstroem exatas as 20 células da tabela da
  Vontade (seção 4), a linha "Nêmesis → Neutro" das jornadas (81/63/45/27) e o trio 81 → 42 →
  25 do trade de dinheiro. **NÃO reconstrói a linha "Neutro → +2 Apreço"** em 3 das 4 células:
  a especificação diz 10/22/34 (mediano/inepto/bruto) e a fórmula dá 15/27/39, diferença de
  exatamente 5 em cada. A causa: aquela linha foi contada com o termo da régua caindo 1 por
  PASSO, inclusive dentro do Neutro, e o termo publicado é por NÍVEL e zera no Neutro. Vai
  para o relato como QUEBROU; o capítulo publica só o que fecha.
- **10:31** · item 6 escrito: a seção do cortejo reescrita inteira (escala parada com as três
  fórmulas e a tabela do elenco, o intervalo de 8 dias com os multiplicadores, os gestos com a
  trava de um por intervalo, a resistência com a Vontade presa, a leitura reancorada, dois
  exemplos novos com a conta à vista). Saíram: a tabela de média do pool (ela mora no
  `acoes-e-sistema.md`, não fica órfã), o modo Acumulada como caminho social, o teto +7 por
  período e o parágrafo da escada de seis degraus (com o motivo em uma linha, como pedido).
- **10:36** · item 7 feito (Folha de referência) e três contradições de borda consertadas no
  caminho, todas dentro de seção que eu já estava reescrevendo: o "funciona como hoje" da
  história empurrando o dado, o "sobem a régua depressa" do favor alugado, e a abertura do
  capítulo. Zero travessão no arquivo, conferido por contagem de caractere.
- **10:52** · portões verdes antes de commitar: `test-travessao-capitulos.mjs` verde,
  `npx astro sync && npx tsc --noEmit` sem erro, `npm run validate` verde (o único ⚑ é o
  `test-editor-bestiario` nunca ter rodado nesta máquina, anterior a mim e de portão de
  navegador). Registradas E4 a E7 no `docs/pendencias/E-social-mental-antecedentes.md` e o
  placar do índice na raiz.

---

## A emenda que chegou no meio, e já estava coberta

- **11:04** · o `git pull --rebase` de antes do push trouxe `18ee12e`, uma emenda da
  especificação escrita às 09:40, depois de eu ter começado: ela renumera a seção 5 e cria um
  **item 8 novo**, mandando consertar a primeira oração de "Quando a cena vira duelo" (que dizia
  *"na conversa comum, a influência apenas empurra a régua"*, falsa depois do item 1) e **não**
  mexer no gatilho da escalada. As duas metades já estavam feitas no commit `d73a058`: a oração
  hoje diz "compra o alcance do pedido e vai embora", e "crava os pés" e "aposta real na mesa"
  estão palavra por palavra como estavam. **O `regras.json` virou o item 9**, e é a proposta
  abaixo.

## A proposta do `regras.json` (item 9 depois da emenda, item 8 no despacho), para o Arquiteto decidir

**Não executada.** O despacho pediu proposta antes de execução, e ela é esta. Nenhuma chave
existente é renomeada, e não há consumidor em código de nada abaixo.

**Onde os números novos moram: um bloco de topo novo, `social`**, irmão de `dificuldade` e de
`combateTatico`. Ele não entra em `derivados` porque `derivados` é o que a ficha CALCULA para um
personagem parado, e nada disto é imprimível na ficha: o Tempo do passo depende de quem é o
alvo e de quantos gestos foram dados.

```json
"social": {
  "nota": "A Régua de Relação e os dois modos, decisão de 18-19/09/2026 (ver o capítulo X, relacoes-sociais.md). O modo RÁPIDO (com dado) não move a régua: a Margem compra alcance do pedido, +1 nível por 6 de folga, só naquela cena. O modo DEVAGAR é o único lugar onde a conversa move a régua. Atos movem nos dois, com passo fixo e sem rolagem.",
  "regua": {
    "min": -6, "max": 6,
    "passosParaRomperNeutro": 3,
    "tetoDeVidro": 2,
    "tetoDeVidroNota": "Vale para tudo o que ACUMULA (gesto, cortejo, lábia). Só ato atravessa para +3 e acima, ou para -3 e abaixo.",
    "esfriaPassosPorEstacao": 1
  },
  "modoRapido": {
    "alcancePorMargem": 1,
    "nota": "Alcance do pedido na tabela de Pedir as coisas, e nada mais. A régua não anda."
  },
  "modoDevagar": {
    "nota": "Sem dado. Ataque parado = Influência + Habilidade. Defesa parada = (Compostura + Sociabilidade) × multDefesa + Centelha × centelhaMult + termo da régua. Tempo do passo, em intervalos = máx(pisoTempoDoPasso, defesa parada − ataque parado − soma dos gestos). O termo da régua é o mesmo de derivados.defesaSocial.reguaNota.",
    "multDefesa": 1,
    "multDefesaNota": "1 e não 2 porque não há dado: o ×2 de derivados.defesaSocial casa com a média de um punhado de dados rolados, e ataque parado vale a própria soma. Mesma calibragem, não outro número.",
    "centelhaMult": 1,
    "centelhaSoNaDefesa": true,
    "pisoTempoDoPasso": 1,
    "gestosPorIntervalo": 1,
    "resistencia": {
      "custoBase": 1,
      "divisorExcedente": 6,
      "excedenteComPisoZero": true,
      "vontadePresa": true,
      "vontadePresaNota": "A Vontade investida em segurar fica presa enquanto o cortejo durar, e só volta quando ele acaba ou o alvo desiste. Vale SÓ para o cortejo longo, porque a Vontade se recompõe a 1 por noite (recuperacaoVontade.quantoPorSono) e o intervalo tem 8 dias ou mais: sem a trava, qualquer custo por intervalo sai de graça."
    }
  }
}
```

**E uma mudança de conteúdo dentro de `acoes.longevidadeFirula`**, que é chave existente e por
isso não se renomeia: as quatro faixas (`curta`, `padrao`, `longa`, `muito-longa`) batem uma a
uma com as quatro linhas do item 2, e são exatamente os valores do campo `longevidade` de
`racas.json`, então o nome de povo nenhum precisa ser escrito em lugar nenhum.

```json
"longevidadeFirula": {
  "nota": "O intervalo do cortejo social (capítulo X) escala com a longevidade da raça de quem corteja (racas.json -> longevidade). SUBSTITUI o deslocamento de degrau da M-09 (17/09/2026): a escada de seis degraus não serve para isto, porque o ajuste racial precisa de quatro degraus seguidos, cada degrau multiplica entre 8 e 24 vezes, e a única base plausível produzia um orc saindo de estranho a Apreço em quatro horas.",
  "intervaloBaseDias": 8,
  "porFaixa": {
    "curta":       { "multiplicador": 0.5, "dias": 4,  "exemplo": "orc, meio-orc" },
    "padrao":      { "multiplicador": 1,   "dias": 8,  "exemplo": "humano, meio-elfo" },
    "longa":       { "multiplicador": 2,   "dias": 16, "exemplo": "anão, gnomo, halfling" },
    "muito-longa": { "multiplicador": 4,   "dias": 32, "exemplo": "elfo" }
  }
}
```

Mais **uma oração a menos** na `nota` do `acoes.escalaIntervalo`, que hoje cita "o
intervalo-base do cortejo social (Firula, capítulo X)" como consumidor da escada. A escada
continua valendo para os modos Acumulada e Longa do capítulo VIII; o cortejo social sai da
lista.

**O custo, medido e não estimado:**

- **`deslocamento` sai e `multiplicador` entra** em `porFaixa`. Zero consumidores em código
  (conferido por varredura em `src/` e `scripts/`: as duas únicas ocorrências de
  `longevidadeFirula` e `escalaIntervalo` são o próprio `regras.json`), então a troca não
  quebra nada e não há teste para atualizar.
- **`dias` é redundante com `multiplicador` × `intervaloBaseDias`**, e é a forma "duas listas
  que precisam concordar" do `CATALOGO`. Sustentei os dois porque o capítulo publica os dias e
  ler `4/8/16/32` do dado é melhor que multiplicar na cabeça; se o Arquiteto preferir uma
  fonte só, tiro o `dias` e fica o multiplicador.
- **Nenhuma linha do portão de procedência se desloca**, porque o `CITACAO` dele só casa
  `.ts`, `.astro` e `.mjs`.
- **`validate-data.mjs` varre o `regras.json` INTEIRO** procurando `\bletal\b` (`:481`,
  `const VELHO`); nenhuma palavra do texto acima cai nisso, conferido.
- **Tempo de portão:** commit que toque `src/` paga os 15,2 s do `validate` mais os 13,4 s do
  typecheck, como este pagou.

**O que eu NÃO sei e não decidi:** se a régua em si (o `regua`) deveria morar aqui ou ficar só
no capítulo. Pus no dado porque os três números dela (±6, 3 passos, teto ±2) são citados por
três seções do capítulo e por nenhum código, que é a situação em que a fonte única compensa.

**Enquanto o item 8 não roda, o capítulo e o `regras.json` se contradizem**, e pela regra da
casa (o JSON vence, o capítulo se corrige) quem ganha é o lado velho: o
`acoes.longevidadeFirula` continua afirmando o modelo de deslocamento de degrau que o item 2
derrubou. Se o Arquiteto quiser cobrir isso em uma linha sem abrir a decisão da forma, dá para
commitar só a `nota` do `longevidadeFirula` dizendo que ela está superada pela decisão de
18/09/2026 e apontando para a seção do capítulo.
