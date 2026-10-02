# Correção da Reforma da Centelha (a regra do maior) · relato da Executora

Despacho: `docs/simulacao/caixa/correcao-reforma-despacho.md` (`0eecc2c7`). A regra: bônus de
Centelha = maior(Centelha, 2 × mín(Centelha, Habilidade)), na jogada, no Valor Passivo, nas três
Defesas e na Defesa parada. Um bloco por item, com o sha e o CI.

## Item 1 · O motor e o bestiário

**A conta.** `src/lib/calc.ts`: `centelhaNaJogada` = `Math.max(centelhaSoAtributo(c), 2 × mín(c, h))`.
A `centelhaSoAtributo` (+1 por ponto, a jogada só de Atributo da D12) passou a ser chamada por ela,
como o autor pediu, e foi para cima dela no arquivo. Os comentários de `:131-154` foram reescritos
(saiu o "Sem Habilidade, sem bônus"), e os quatro comentários de uma linha das Defesas e do ataque
(`defesa`, `defesaMental`, `defesaSocial`, `ataqueCentelha`) dizem a regra do maior.
`valorPassivo` (`calc.ts:415-417`) já chamava `centelhaNaJogada` e herda a regra sem mudança de
código. `bestia-editor.ts` (o editor do bestiário no navegador) também só chama `calc.ts`.

**Toda reimplementação da mesma conta** (`rtk proxy grep -rn "2 \* Math.min" src scripts`, mais uma
varredura por `min(` com Centelha):

| onde | o que é | o que fiz |
|---|---|---|
| `scripts/lib-bestiario.mjs:62` | a conta do gerador do bestiário | regra do maior, com o comentário |
| `scripts/lib-bestiario.mjs`, `inverteComCentelha` | a inversão Defesa para Esquiva/Integridade/Sociabilidade publicadas | ganhou a terceira faixa (Habilidade abaixo de metade da Centelha, bônus = Centelha). A conta sobe sempre com a Habilidade, então a inversão tem uma resposta só. Prova: as `pericias` publicadas das 309 criaturas não mudaram nenhuma (comparação antes e depois), e o `test-bestiario-integridade` (round-trip) passa |
| `scripts/test-kael.mjs:18` | a cópia do teste | regra do maior; o teste ganhou a Defesa Social, e o esperado é 20/13/7 |
| `scripts/sim/desafio-bancada.mjs:153` e `:208` | a bancada recompõe a Defesa crua para achar a penalidade de armadura (`penFisica`), subtraindo a Defesa que o motor devolve | regra do maior, nas duas. Sem isso, a `penFisica` sairia errada (até negativa) na próxima rodada da bancada, porque o motor já dá a Defesa nova. A bancada **não foi rodada** |
| `scripts/sim/desafio-bancada.mjs:270` | `2 × mín(Centelha, habEf)` com `habEf = máx(Habilidade, Centelha)` | **sem mudança**: com `habEf ≥ Centelha` a conta já dá 2 × Centelha, que é o mesmo que a regra do maior dá nesse caso |
| `src/lib/artes-grid.ts`, `desEsqDaDefesa` | inverte a Defesa da criatura para Destreza + Esquiva (o desvio de área) | só o comentário diz a fórmula nova. **A aproximação ficou** (ela subtrai 2 × Centelha, supondo Esquiva ≥ Centelha), registrada abaixo como achado |
| `scripts/sim-duelo.mjs:45-48`, `scripts/sim-pressao.mjs:37-38`, `scripts/lib-tempo.mjs:89/320`, `scripts/sim-ticks.mjs:39` | simuladores antigos, com o `centelhaMult` flat (×1 ou ×2) | **sem mudança**: são as baterias de antes da Reforma (`K35`), com a regra antiga de propósito |
| `scripts/cost-examples.mjs:205-211` | lê `defesaMental.centelhaMult` e `defesaSocial.centelhaMult` flat | **sem mudança neste item**: é o mesmo caso que a `centelhaNota` de `regras.json` já registra como desatualizado (K35). Vou conferir no item 2 se ele gera algum número dos exemplos de criação |

**`regras.json`.** As notas de `derivados.defesa.centelhaNota`, `defesaMental.nota` e `.centelhaNota`,
`defesaSocial.nota` e `.centelhaNota`, `ataque.nota` e `.centelhaNota`, e a nota das Técnicas
(`:114`, "somam por cima do ...") dizem a regra do maior. A `:2683` (Defesa parada) é do item 3, e a
`:1133` (raspão) é do item 2.

**O bestiário, regenerado pelo gerador** (`gen-bestiario.mjs`, e depois `gen-monsters.mjs`, que faz
o `monsters.json` e o `monsters-mesa.json` a partir do `inimigos.json`). Nada à mão no JSON gerado;
`gen-bestiario.mjs --check` verde.

- **189 criaturas mudaram** em alguma Defesa (o mesmo número da medição prévia do Arquiteto):
  **Defesa (Esquiva) 121, Defesa Mental 3, Defesa Social 177.** O bestiário não tem Bloqueio
  separado (a Defesa da criatura é a de Esquiva).
- **Ataques: 3 criaturas**, as três com Habilidade de ataque 0: Espantalho Desperto (`1d6+2` para
  `1d6+2 +1`, Centelha 1), Pixie (`2d6` para `2d6 +4`, Centelha 4) e Arconte Lanterna (`1d6` para
  `1d6 +2`, Centelha 2).
- **Nenhuma Defesa caiu** (a regra do maior nunca dá menos que a de antes).
- Nenhum outro campo do bestiário mudou (comparado campo a campo).
- **Os maiores saltos** (o 5º lugar empata em +9, então vão os sete com salto de 9 ou mais):

| criatura | Defesa | antes | depois | salto |
|---|---|---|---|---|
| Tarrasque | Esquiva | 4 | 14 | +10 |
| Tarrasque | Social | 8 | 18 | +10 |
| Balor | Social | 16 | 25 | +9 |
| Diabo do Fosso (Pit Fiend) | Social | 18 | 27 | +9 |
| Grande Wyrm Vermelho | Esquiva | 4 | 13 | +9 |
| Grande Wyrm Vermelho | Social | 14 | 23 | +9 |
| Solar | Social | 16 | 25 | +9 |

- O filhote de dragão vermelho (a âncora da Fase 5b) vai de Defesa 4 para **8**, como o despacho diz.

**Testes que fixavam Defesa e mudaram.**
- `scripts/test-kael.mjs`: Kael 20/10/4 vira **20/13/7**. A Defesa Social entrou no teste (antes ele
  só fixava a Mental).
- `scripts/test-contrato.mjs` (o contrato ficha e mesa, o mesmo Kael pelo código da mesa): Defesa
  Mental 10 para **13** (duas asserções: o resumo de combate e a ficha), Bloqueio 7 para **10** e
  Defesa Social 4 para **7**. Os três têm Habilidade 0 (Integridade, Bloqueio, Sociabilidade), e
  agora levam a Centelha inteira (+3). A Defesa de Esquiva (19 com o gambeson) e o pool de ataque
  (`3d6+2 +6`) não mudam, porque Esquiva 3 e Armas 3 alcançam a Centelha.
- `scripts/test-editor-bestiario.mjs` (smoke, card contra modal): ficou vermelho enquanto o
  `monsters.json` estava velho (card 4 e modal 7 no Treant) e verde depois do `gen-monsters.mjs`.

**Achados, registrados sem consertar.**
1. **O `monsters.json` velho não acende nenhum portão.** O `validate` confere o `inimigos.json`
   (`gen-bestiario --check`), mas o `gen-monsters.mjs` não tem `--check` na cadeia: ele só roda
   no `build`. Um commit com o `inimigos.json` novo e o `monsters.json` velho passaria no gancho;
   só o smoke do editor pegaria, no CI. Desta vez os dois vão juntos.
2. **`desEsqDaDefesa` (`artes-grid.ts`) é uma aproximação, e o comentário dela erra o sentido.**
   Ela subtrai 2 × Centelha da Defesa, supondo Esquiva ≥ Centelha. O comentário diz que, quando a
   suposição falha, o valor "sai um pouco ALTO"; na conta, ele sai **baixo**: o bônus real é menor
   que 2 × Centelha. Isso já valia antes. E a conta é invertível, pelo mesmo raciocínio da
   `inverteComCentelha`. Medido contra Destreza + Esquiva publicadas, a estimativa erra em **163 de
   309** criaturas antes e em **148** depois. O erro também vem da penalidade de armadura e da
   Especialidade, que a função não desconta. Consertar mexe no desvio de área do Grid, então fica
   para o Arquiteto decidir.

**Verificação** (sobre `0eecc2c7`): `npm run validate` verde ("Portões OK"); `npx astro sync && npx tsc
--noEmit` sem erro; `npm run espelho` verde ("os dois laços concordam"); `test-editor-bestiario` verde
("editor OK"); `npm run build` verde. No gerado, `dist/bestiario/index.html` traz
`data-defesa="7"` no Treant (era 4), `data-defesa="8"` no filhote de dragão vermelho (era 4) e
`data-defesa="14"` no Tarrasque (era 4).

**Produção:** as Defesas de quem tem Habilidade menor que metade da Centelha sobem na ficha e no
bestiário (Kael 20/10/4 para 20/13/7). Sem migração.

**Commit do item 1:** `4aaf0fce`.

## Item 2 · Os capítulos, o glossário e os textos da ficha

Toda fórmula que dizia "+ Centelha" (a de antes da Reforma) ou "2 × mín(Centelha, Habilidade)" passou
à regra do maior, escrita como `maior(Centelha, 2 × mín(Centelha, Habilidade))` (ou `menor`, onde o
capítulo já usava `menor`).

**A lista do despacho, feita:**
- `centelha.md:44`: o item 1 inteiro. A regra do maior dita em uma frase, com a Habilidade 0
  nomeada ("uma jogada só de Atributo: Vontade pura, Resistir sem Habilidade, alguns testes de
  Bravura") e o "quem treinou nunca recebe menos do que quem não treinou". A exceção do fim do
  parágrafo ("só Atributo [...] é a mesma exceção") saiu, porque deixou de ser exceção. O dano segue
  como estava. `:65`: "por cima do bônus de Centelha que já pesa [...] (o maior entre +1 por ponto e
  2 por ponto até o teto da Habilidade usada)".
- `coracao-do-sistema.md:89`, `:91`, `:93`: a fórmula do Valor Passivo, a frase da Centelha e a
  Percepção Passiva do guarda. O guarda comum (Centelha 0) continua dando (Percepção + Prontidão) × 2.
- `coracao-do-sistema.md:79` (o muro de Kael), **só a conta da Centelha**: 3d6 + 6 (Centelha 3,
  Atletismo 3); 11 nos dados dá 17, 7 acima de 10, então **uma Margem**, e a frase da Margem passou a
  dizer o que ele ganha. A Dificuldade 10 contra a tabela de Escalar não foi tocada.
- `acoes-e-sistema.md:65` e `:121`. O `:123` (por que a Especialidade fica fora do valor parado)
  não fala da Centelha e não mudou.
- `defesas.md:68-81`: as quatro fórmulas e a frase da Mental ("mais o bônus de Centelha, que aqui
  se mede pela Integridade"; antes, "limitada pela"). `:85`, Kael: Esquiva 20, Social **7**, Mental
  **13** (antes 4 e 10). `:122-126`: a folha de referência.
- `combate.md:124` e `:131`; o exemplo de `:21`, Sora: o pool passa a **5d6+9**.
- `criacao-de-personagem.md:73-75` e os quatro exemplos, recalculados por `calc.ts`:

| exemplo | Defesa | Def. Mental | Def. Social |
|---|---|---|---|
| Kael (C3, Esquiva 3, Integridade 0, Sociabilidade 0) | 17 para **20** | 13 | 7 |
| Sora (C3, Esquiva 3, Integridade 3, Sociabilidade 3) | 21 para **24** | 17 para **20** | 15 para **18** |
| Veil (C4, Esquiva 3, Integridade 3, Sociabilidade **não publicada**) | 18 para **20** | 18 para **20** | 16 para **18**, **pendente** |
| Bram (C1, Esquiva 3, Integridade 0, Sociabilidade 2) | 13 para **14** | 13 | 9 para **10** |

  **Veil, pendente:** a ficha dele lista só quatro das oito Habilidades de nível 3 e não nomeia a
  Sociabilidade. O 16 de hoje, pela fórmula antiga ((3 + S) × 2 + 4), implica Sociabilidade 3, e com
  ela a regra do maior dá 18. Ficou 18, marcado aqui como pendente até a ficha nomear a Sociabilidade.
  Não inventei a Habilidade na ficha.
  O Kael e o Bram já davam 13 e 7 na Mental e na Social pela conta flat de antes, e a regra do
  maior dá o mesmo (Habilidade 0, Centelha inteira). O Kael tinha **Defesa 17 aqui e 20 em
  `defesas.md:85`**: os dois capítulos já se contradiziam, e agora os dois dizem 20.
- `aparencia-virtudes-vontade.md:129` e `:131`.
- `acoes-sentidos-e-engano.md:16` (Percepção Passiva).
- `qual-sistema.md:87-88` e o SVG gerado, pelo `gen-mermaid.mjs` (`diagramas.json`; `--check` verde).
- `glossario.json:93`, `:101`, `:109`, `:223`.
- `ficha-engine.ts:1570-1573`: a explicação das quatro Defesas escreve o bônus de Centelha que a
  conta usou, como `Centelha 3 (maior entre 3 e 2×mín(3, 0))`, e a conta da linha fecha. O número
  não muda. **Produção:** muda só o texto da explicação.
- `quase-acerto.md:28`: Sora com Centelha 3, raspão **2** (placa) e **6** (couro). `regras.json:1133`:
  a string do dano do raspão ganha os dois termos ("+ Centelha do atacante − Centelha do alvo").
- `combate-resumo.ts:80` (comentário; "Perícia" virou "Habilidade", porque a linha foi reescrita).
- `scripts/test-sentidos.mjs:66`: a fórmula da passiva passa à regra do maior. **A asserção de
  `:74` compara a função com ela mesma**: `passiva(p, pr, c)` contra a mesma expressão escrita de
  novo, então ela não pega uma fórmula errada, só uma função que deixou de devolver número. Quem
  prova a Prontidão é a gêmea logo abaixo (`mexem`). Registrado, sem mudar o teste.
- `Regua_Relacao.md:120` (a Defesa Social).

**Achados da varredura, fora da lista, que mudei porque diziam a mesma regra:**
- `combate.md:135`: o parágrafo da Centelha ("2 pontos por ponto [...] até o teto da Habilidade").
- `defesas.md:62`: o parágrafo de abertura da Centelha nas Defesas, com o mesmo texto.
- `calc.ts:384`: o comentário da `valorPassivo`.
- `combate-resumo.ts:156`: o comentário da Defesa física.
- `scripts/cost-examples.mjs` (o conferidor dos quatro exemplos, que não é portão): somava a Centelha
  flat pelo `centelhaMult`. Agora chama `defesa`, `defesaMental` e `defesaSocial` de `calc.ts`. Ganhou
  a Defesa física, com a Esquiva 3 que o capítulo lista, e os números publicados novos. Rodado: os
  derivados dos quatro batem. As 5 divergências que ele aponta são as linhas de XP de antes (o
  C-12 do Bram); nenhuma é derivado.

**Vistos e deixados como estão:**
- `racas.md:169`: "Força de Vontade do orc × 2 + Centelha dele" é jogada só de Atributo. A regra do
  maior com Habilidade 0 dá a Centelha inteira, o mesmo número.
- O dano, a Absorção natural, o raspão, Energia, Mana e os saltos somam a Centelha inteira por regra
  própria (`combate.md:177`, `:193`, `:350-351`, `glossario.json:52`, `ficha-engine.ts:1569/1577/1597-1599`,
  `mesa/referencia.astro:262`). Não mudam.
- `relacoes-sociais.md:138`, `:182`, `:274`, `:276`, `regras.json:2683` e `Regua_Relacao.md:119` (o
  ataque social): são do item 3.

**Registrado, sem consertar:**
- **Sora em `combate.md:21`:** com o pool 5d6+9, o "ela rola e soma 16" quer dizer 7 nos cinco dados
  (o mínimo é 5). É possível, mas improvável. Com o 5d6+6 de antes eram 10 nos dados. Não troquei o
  16, porque o despacho só pede o pool, e o resto da conta (diferença 6, uma Margem) depende dele.
- `centelha.md:44`: o "Resistir sem perícia" da frase velha virou "Resistir sem Habilidade", porque
  a frase foi reescrita. É o vocabulário da regra, e não o conserto de outro achado.

**Verificação** (sobre `4aaf0fce`): `npm run validate` verde ("Portões OK", com `gen-mermaid --check` e
`test-sentidos`); `npx astro sync && npx tsc --noEmit` sem erro; `npm run build` verde. No HTML gerado,
contado no texto sem marcação: `centelha` traz "pela regra do maior", "Com Habilidade 0" e "do bônus
de Centelha que já pesa" (1 cada); `coracao-do-sistema` traz "total 17" e as duas fórmulas novas;
`acoes-e-sistema` traz a fórmula nova 2 vezes; `defesas` traz "= 7 (com Sociabilidade zero", "= 13 ,
pelo mesmo motivo" e "regra do maior" (3); `combate` traz "5d6+9" e as duas fórmulas; `criacao-de-personagem`
traz as quatro linhas de derivados novas (1 cada); `aparencia-virtudes-vontade`, `acoes-sentidos-e-engano`
e `quase-acerto` ("Sora (Centelha 3)", "4 − 1 + 3 − 0 = 6") também. O SVG de `qual-sistema` traz
"maior(Centelha" 2 vezes. O `dist/ref-index.json` (glossário) traz a fórmula nova 8 vezes, e o bundle
da ficha traz a explicação nova. Nenhuma página de `dist/regras/` sobra com "2 × menor(Centelha,
Habilidade)", "nunca mais do que a Habilidade" ou "Centelha 2) ataca" fora de um `maior(`.

**Commit do item 2:** `58869f2f`.

## Item 3 · Relações sociais e a Defesa parada

- `relacoes-sociais.md:138` e `:274` (o ataque social): `+ maior(Centelha, 2 × mín(Centelha,
  Habilidade))` no lugar de `+ Centelha`.
- `:182` e `:276` (a Defesa parada): `Compostura + Sociabilidade + maior(Centelha, 2 × mín(Centelha,
  Sociabilidade)) + termo da régua`, a fórmula da seção "Como as decisões se juntam" do despacho.
  O `multDefesa` é 1 (`regras.json`), então o capítulo continua escrevendo a soma sem multiplicador.
- `:188`, a explicação de por que a Centelha entra "só de um lado", **relida contra a fórmula nova e
  deixada como está**. Ela segue fazendo sentido:
  - o ataque parado continua sem Centelha;
  - o "sem o ×2" fala da soma (Compostura + Sociabilidade), e na Defesa Social com dado o bônus de
    Centelha também fica fora do ×2, então os dois modos levam o mesmo termo de Centelha e a
    "mesma calibragem" continua valendo.
- A tabela `:192-198`, Kael e Sora recalculados nas duas colunas:

| alvo | Defesa Social (com dado) | Defesa parada |
|---|---|---|
| Kael (Compostura 2, Sociabilidade 0, Centelha 3) | 7, igual: (2 + 0) × 2 + maior(3, 0) | 5, igual: 2 + 0 + 3 |
| Sora (Compostura 3, Sociabilidade 3, Centelha 3) | 15 para **18**: (3 + 3) × 2 + maior(3, 6) | 9 para **12**: 3 + 3 + 6 |

  O Kael já dava 7 e 5 pela conta flat de antes, e a regra do maior com Sociabilidade 0 dá o mesmo.
  **O guarda, o vendedor e a Dama Vesna não têm ficha no texto**: os números deles (6/3, 8/4, 18/11)
  ficaram como estavam, sem conferência possível. Registrado.
- `regras.json:2683` (`relacoes.modoDevagar.nota`): a Defesa parada pela regra do maior, e **a frase
  do Tempo do passo voltou**, na redação de antes do `8d1cbb79`: "Tempo do passo, em intervalos =
  máx(pisoTempoDoPasso, defesa parada − ataque parado − soma dos gestos)."
- Varrido por mais: `Regua_Relacao.md:119` (o Ataque Social do documento de desenho), que somava
  `+ Centelha`, passa a `maior(Centelha, 2 × mín(Centelha, Habilidade))`. O resto da linha diz
  "Perícia", e não mexi: não era a frase que eu estava reescrevendo. Nenhum código calcula o ataque
  social nem a Defesa parada (procurado `multDefesa`, `centelhaSoNaDefesa`, `modoDevagar` e
  "Defesa parada" em `src` e `scripts`): a mesa só registra o lance social.

**O registro que o autor pediu, verbatim:** a troca do 8d1cbb79 foi decisão de regra tomada sem o
autor, sob o nome de "comentário desatualizado"; o resultado ficou certo, mas o caminho foi errado, e
regra se pergunta.

**Verificação** (sobre `58869f2f`): `npm run validate` verde ("Portões OK"); `npm run build` verde. No
HTML de `dist/regras/relacoes-sociais/index.html`, contado no texto sem marcação: o ataque com
"+ Acerto da Abordagem + maior(Centelha, 2 × mín(Centelha, Habilidade))" e a Defesa parada nova
aparecem 2 vezes cada (a fórmula e o resumo do fim); a tabela traz "Sora 18 12" e "Kael 7 5"; "Acerto
da Abordagem + Centelha" e "Sociabilidade + Centelha +" aparecem 0 vezes.
