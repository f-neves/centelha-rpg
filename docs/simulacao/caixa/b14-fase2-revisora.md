# B14 fase 2 · veredito da Revisora

**PROCEDE, com 2 CORRIGE pequenos** (achados abaixo, ambos de conserto barato) **e 2 notas para
acompanhar** (não bloqueiam, não são erro desta rodada).

- **Árvore:** branch `revisora`, reancorada em `3d6c678` (o sha do aviso), depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (`3e29b03`) já
  estava em `main`. Não reancorei no `513f5a1` (posterior ao pino, fora do julgamento desta rodada,
  ver nota 1 abaixo).
- **Despachos:** `b14-fase2-despacho.md` (`3352231`) e `b14-fase2-resposta-despacho.md`
  (`2ac0d53`), lidos verbatim e conferidos item a item contra o código e as 309 fichas.
- **Os dois avisos do Arquiteto**, cobertos: (1) `constructo.semVida` é pendência, não efetiva
  hoje: confirmado, o relato diz isso explicitamente na seção A.4 ("nenhum código de combate lê
  essa flag ainda") e nenhum lugar do texto ou da doc afirma o contrário. (2) O padrão `resiste`
  sem nota explícita (item da parte B, ~106 linhas formais): não avaliei o critério em si, por ser
  escopo já superado pela fase 3. Onde olhei esses poderes foi só para achar problema de outra
  natureza (ver abaixo); não achei dado incoerente, referência quebrada nem poder duplicado nos
  que conferi por amostra.

## O que confirmei

- **A contagem da tabela fecha exatamente com a classificação do relato.** Reprocessei
  `poderes-sugestao.md` (228 linhas de dado, as 2 que o parser da Executora perdeu por célula
  vazia inclusas) e somei por coluna "Vira": Arte 56 + Adivinhação·N1 2 = **58** (bate com "58
  linhas" do relato); traço social **3** (bate); remover **4** (bate); locomoção·voo **10** (bate,
  "não tocadas aqui"); manobra 9 + agarrao 9 + sentido 12 = **30** (bate com "9+9+12=30"); disparo
  **8** (bate, todas na lista de não implementadas); defesa **7** (bate, idem); as 15 categorias
  formais somam **106** (bate). 58+3+4+10+30+8+7+106 = 226. Nenhuma linha sumiu, nenhuma foi
  contada duas vezes.
- **`proezaFutura` preserva a referência de Caminho.** 45 entradas em 38 fichas (a estimativa do
  Arquiteto era "~46 entradas tipo: proeza"). O relato só menciona "as 3" no contexto estreito das
  16 fichas que já tinham `poderes` parcial; as outras 35 vieram do processamento da tabela nova, e
  bate com a ordem de grandeza esperada. Não achei nenhuma referência de Caminho apagada.
- **O `.strict()`/`z.union` do poder natural não afrouxa a validação.** Nenhuma ficha ficou no
  formato legado depois desta rodada (as 16 antigas foram todas reconstruídas): o ramo legado do
  `poderSchema` está tecnicamente morto nos dados de hoje, mas não é um buraco. Testei nos dois
  sentidos: removi `resiste` de um poder novo (`mon-aboleth`) e o `validate-data.mjs` acusou; pus
  `resiste: "fogo"` (fora do enum) e acusou também, porque o ramo legado exige `alvo` (ausente no
  formato novo) e `.strict()` rejeita as chaves do formato novo (`id`, `usos` etc.) nesse ramo.
  Revertido, `validate` volta a verde.
- **C.7 (Defesa Social, Int 1) é regra só de fera, e só de fera.** Cheguei a suspeitar que
  `src/lib/ficha-engine.ts` (a ficha do jogador) também precisasse do mesmo desvio Sociabilidade→
  Sobrevivência, mas `defesas.md:77` e `:124` deixam explícito que a troca vale **só para feras
  (Inteligência 1 do bestiário)**, não para personagem. `ficha-engine.ts:1556` continua lendo
  `sociabilidade` puro, e está certo assim: não é lacuna.
- **C.9 (incorpóreos) está com o texto certo.** Os quatro (`mon-sombra`, `mon-espectro`,
  `mon-assombracao-wraith`, `mon-ghost`) dizem "resiste a corte, impacto e perfuração (dano pela
  metade), arma comum ainda fere" no ataque E na habilidade — a frase nova deixa claro que arma
  comum FERE (resistência, não imunidade), como o item pedia. `mon-ghost` ganhou a tag
  `incorpóreo` que faltava, e `elementos-bestiario.json` bate com a ficha nas quatro.
- **C.11: Vitalidade e os Atributos do Orc batem** com o despacho (Força 5/Destreza 3/Vigor 5/
  Influência 2/Perspicácia 2/Compostura 1/Percepção 3/Inteligência 2/Raciocínio 2; Vitalidade como
  poder natural `periodo: passivo`, "+Vigor de PV extra"). Frenesi virou texto em `habilidades`,
  não poder natural como o despacho pedia literalmente — mas conferi `racas.json` e o texto de
  Frenesi é uma mudança de estado condicional (gatilho por teste de Temperança falho, muda
  Esquiva/Bloqueio/Intimidar), que genuinamente não cabe em nenhum `periodo` do esquema
  (ticks/cena/hora/dia/à vontade/passivo/golpe). O texto em `mon-orc.json.habilidades` é cópia fiel
  do traço da raça. Deságio técnico justificado, não acho que precise voltar.
- **Travessão: zero nas linhas adicionadas** dos dois commits (contado com Node sobre o diff
  completo `3e29b03..3d6c678`, não `grep`).
- **Os três caminhos sujos conhecidos intactos** (`lore/mapas/dados/camadas_referencia.json`,
  `lore/mapas/registro-git.jsonl`, `lore/economia/prompt-revisao-economica.md`).
- **`npm run validate` e `npm run build` verdes** na árvore congelada. `dist/regras/custo-servicos`
  traz "grupo de 4"; `dist/regras/defesas` traz "Sobrevivência"; `dist/regras/
  aparencia-virtudes-vontade` traz o número da Vontade.
- **CI dos quatro commits da faixa** (`2c5530e`, `2ac0d53`, `3d6c678`, e o `513f5a1` que vem
  depois), pelo `gh run list`: **success** em todos, `Validar dados e regras`.

## CORRIGE 1: a nota de `recompensas.json` ficou dizendo "× 3" com o grupo já em 4

No pino `3d6c678`, `src/data/recompensas.json._nota` ainda diz **"Bolsa = Valor do degrau ×
Semanas × Tarefa × Risco × 3 (o grupo de referência)"**, enquanto o campo numérico `grupo` já é
`4`. A fonte da nota (`scripts/copiar-economia.mjs`, mapa `NOTAS`) também tinha o "× 3" hardcoded.
O despacho item D.14 pede explicitamente os dois: **"recompensas.json _nota e 'grupo': 4"**. O
relato afirma "Regenerado com `node scripts/copiar-economia.mjs` (`recompensas.json` confere
`'grupo': 4`)", o que é verdade só para o campo numérico, não para a frase que o joga lê. Isto já
foi corrigido depois do meu pino, em `513f5a1` ("acerta a `_nota` gerada... para grupo 4"), fora da
faixa que julgo aqui, mas confirma que o defeito existia nos dois commits revisados. **Não avaliei
`513f5a1` em si** (fora do pedido desta rodada), só usei para confirmar que o achado é real e já
tem conserto.

## CORRIGE 2: o parágrafo novo da Horda mostra `**...**` literal no site

`src/content/chapters/combate.md:426` (C.13) escreveu o parágrafo novo dentro de HTML cru
(`<p class="muted">...</p>`, no mesmo padrão do `<div class="callout exemplo">` vizinho), mas usou
sintaxe Markdown (`**2 capangas por personagem do grupo**`) dentro do bloco HTML. Bloco HTML
explícito não é reprocessado como Markdown (é comportamento padrão do parser), e isso é visível no
`dist`: `<p class="muted">Uma sugestão... a partir de **2 capangas por personagem do grupo**,
considere...</p>` — os asteriscos aparecem literais para quem lê `/regras/combate` no site, ao lado
de uma frase anterior (`<strong>perde para a multidão</strong>`) que usou a tag HTML certa e
renderizou bem. Conserto de uma linha: trocar `**...**` por `<strong>...</strong>` dentro desse
bloco (ou tirar o parágrafo do wrapper `<p class="muted">` e deixá-lo em Markdown puro, se o estilo
`.muted` não for essencial).

## Nota 1, não bloqueia: o exemplo que deu origem ao item 10 continua sem conserto

O despacho nomeou `mon-roc` como o caso canônico do defeito que o item 10 queria resolver
("velocidade de voo lida como terra"). Hoje `mon-roc.json` tem só `locomocao: {voo: 8}`, sem
`terra` — o que significa que a peça dele no Grid **continua andando a 8 m/Tick também no chão**
(`passoDaPeca`, sem `terra`, usa o maior dos outros modos), o mesmo sintoma que o despacho descreveu.
`mon-roc` nunca aparece no relato, nem na lista dos 83 arquivos tocados nem na dos 43 sem número:
ele simplesmente não está em `locomocao-fonte.md`, o arquivo de auditoria que o Arquiteto preparou.
Achei outras **18 fichas no mesmo padrão** (locomoção só em voo/natação, sem `terra`, com
`fonte.deslocamento.nota` já dizendo "em terra N" desde a migração da fase 1) e nenhuma delas
também está em `locomocao-fonte.md`: `mon-aboleth`, `mon-cloaker`, `mon-cocatriz`,
`mon-diabrete-imp`, `mon-dire-bat`, `mon-elasmosaurus`, `mon-giant-wasp`, `mon-harpia`, `mon-hawk`,
`mon-homunculus`, `mon-pixie`, `mon-pseudodragon`, `mon-pteranodon`, `mon-quasit`, `mon-raven`,
`mon-sea-serpent`, `mon-stirge`, `mon-wyvern`. **Não é falha da Executora**: ela processou
corretamente tudo o que a auditoria trouxe, e disse isso com honestidade ("só gravei quando a
auditoria trouxe um número"). É um buraco no material de origem que a fase 2 usou. O conserto é
barato porque o valor já está escrito em cada ficha (`fonte.deslocamento.nota`, ex. "voo 80; em
terra 20" no roc): é só extrair e gravar `locomocao.terra = round(N/10)`, sem pesquisa nova. Deixo
para o Arquiteto decidir se entra como adendo da fase 3 ou uma rodada própria.

## Nota 2, não bloqueia: a herança de fraqueza por material (despacho item 4) não foi aplicada

O despacho pede, para os construtos: "Golem de material herda a fraqueza do material
(`lib-materiais.mjs`), escrita na ficha." Os 9 construtos marcados com `constructo.semVida` não têm
o campo `material` escrito (conferi os 5 golens de material: barro/argila, carne, gelo, ferro,
pedra). O relato (seção A.4) só fala da flag `semVida`; a herança de material não é mencionada, nem
como feita nem como pendência. **Hoje isto não quebra nada**: os `fraquezas`/`resistencias` que já
estavam nas 5 fichas (herdados da migração da fase 1) já batem, campo a campo, com o que
`lib-materiais.mjs` produziria (ex. `mon-iron-golem`: fraqueza raio + resistências corte/fogo/
perfuração = exatamente `POR_MATERIAL.metal`). O que falta é só o campo `material` em si, que o
despacho pedia por nome e que faz `gen-elementos.mjs` reconhecer a ficha como dona da própria
fraqueza (fase 1, item 12) em vez de semear por cima. Conserto também barato: nomear o material de
cada um dos 9 e conferir contra a tabela que já existe.

## O que não achei

Nenhuma referência de Caminho de Proeza apagada, nenhuma Arte além da Centelha da criatura
aplicada sem listar (as 2 do item 6 batem), nenhum poder da tabela sem destino (226 contados,
zero perdidos fora dos 2 já documentados pelo parser), nenhuma regressão nos golpes/paradas dos
poderes com `ataque:`, nenhum travessão em prosa nova, nenhum caminho sujo de outra frente tocado.
