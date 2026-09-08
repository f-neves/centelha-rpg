# Auditoria de memória e documentação · 08/09/2026

Registro de uma sessão que começou como "liste as sessões dentro dessa pasta" e virou uma
auditoria da memória de longo prazo (as ~53 memórias em `~/.claude/projects/.../memory/`) contra
o estado real do código e dos documentos de trabalho. Este arquivo é o resumo; os commits abaixo
são a fonte primária.

## 1. Por que isto existe

A pergunta que disparou tudo: *"acredito que parte dessas sessões e arquivos antigos estão
sujando o contexto de sessões mais novas, isso pode ocorrer?"*

Resposta curta, que se confirmou na prática: os `.jsonl` de sessão antiga **não** vazam para uma
sessão nova (só entram se alguém der `/resume` nela). O que **vaza de verdade**, porque é
carregado automaticamente em toda sessão nova, é a memória de longo prazo (`MEMORY.md` + os
arquivos por tópico) e, por extensão, os documentos de trabalho que ela cita (`Pendencias.md`,
`Auditoria_Tecnica.md`, os `*_revisao.md`). Se um desses ficar para trás do código real, toda
sessão nova parte de uma foto errada do projeto.

## 2. O que foi feito

### 2.1 Auditoria (5 frentes em paralelo, uma por área)

Cada frente leu um grupo de memórias, verificou contra o código/JSON real e contra os documentos
de trabalho citados, e só reportou divergência de verdade (não relatou o que batia).

| Frente | Memórias checadas | Com problema |
|---|---|---|
| Regras base e Bestiário | 9 | 7 |
| Arcano, Proezas, Social e Lore | 9 | 7 |
| Ações, Perícias e Ofícios | 9 | 3 |
| Mesa, Grid, Combate e Simulação | 11 | 5 |
| Infraestrutura e processo | 15 | 4 (+ 2 lacunas de cobertura) |

**Total: 26 das 53 memórias com alguma desatualização**, a maioria número que envelheceu
(contagens, migrações, valores de fórmula) ou decisão que fechou sem ninguém voltar para fechar o
registro. Duas achados fora do padrão "número velho":

- uma **contradição real entre documentos** (não staleness de memória, staleness de decisão): a
  camada de Tradição das Artes (`trilhas-feiticaria.md`, proposta de 28/07) e a rolagem por
  Tradição continuavam citadas como pendência em `Pendencias.md` (C1/C2) enquanto o próprio A11
  já tinha resolvido metade da pergunta em 17/08, sem separar as duas metades;
- um **bug real documentado só num lugar** (`Auditoria_Tecnica.md` §8.2), nunca promovido ao
  `Pendencias.md`: o Grid da mesa lia fraqueza/resistência de criatura do campo errado do objeto.

### 2.2 Correções aplicadas

**24 memórias + o índice `MEMORY.md`** (fork dedicada, uma edição mecânica por achado):
`acoes-modos-de-acao`, `acoes-e-sistema`, `pericias-molde-descricao`, `escudo-do-mestre`,
`grid-mobile`, `simulacao-1000-batalhas`, `area-mestre-jogadores`, `grid-moldura-desktop`,
`arcano-mecanica-artes`, `artes-no-grid`, `lore-mundo-centelha`, `defesas-revisao`,
`rpg-d6-system`, `tabela-de-forcas`, `fraquezas-resistencias-bestiario`,
`imagens-bestiario-pathfinder`, `racas-e-export-mesa`, `reescala-d6`, `auditoria-tecnica`,
`producao-deploy-migracoes`, `pendencias-mapa-geral`, `auditoria-diagramacao-centelha`,
`auto-commit-push`, mais a linha de `analise-mental-antecedentes` no índice.

**No repositório**, seis commits em `main`:

| Commit | O quê |
|---|---|
| `b694eb6` | `Pendencias.md`: fecha H1/H2 (arremesso, já implementado sem o mapa saber), K28 (deslocamento do bestiário, idem), D2 (Proezas, já reconciliado); registra **B12** (o bug de fraqueza/resistência) |
| `77a543d` | `Auditoria_Tecnica.md` §8.1: nota que um dos três bloqueios do Astro 7 já caiu |
| `20daeea` | **Conserta o B12 de verdade**: `elementosCombate()` centraliza a leitura em `src/lib/mesa-core.ts`; quatro pontos corrigidos (2 de dano em `artes-grid-mesa.ts`, 2 de exibição em `mesa-bestiario.ts` e `criaturas.astro` achados só durante o grep de verificação); `scripts/test-elementos-combate.mjs` novo, ligado ao `npm run validate` |
| `b694eb6`…`7b8e66c` | `Pendencias.md`/`docs/simulacao/CATALOGO.md`: A11 deixa de fechar escondendo uma condição futura (vira `[~]`, metade fechada/metade aberta), C1/C2 passam de "esquecidas" para "bloqueadas pela Tradição" (razão escrita), e o `CATALOGO.md` da simulação ganha a forma **"fechado com condição pendente dentro"** |

Também apagado `src/pages/mesa/bash.exe.stackdump` (lixo gitignorado de uma queda de bash).

## 3. O bug B12, em uma frase

`morder`/`aplicarDano` (dano de Arte no Grid), `cardCriaturaHTML` (modal de 3 abas) e a lista de
`criaturas.astro` liam `m.fraquezas`/`m.resistencias` do **topo** do objeto da criatura; o dado
mora em `m.combate.fraquezas`/`resistencias` desde que a B1 foi feita (10/08). `|| []` nunca
lançava, então o defeito era mudo: nenhuma das 309 criaturas era agravada por fraqueza no Grid.
Confirmado que o harness da simulação em massa (`scripts/sim/bateria.mjs`) não toca nesse código
em nenhum ponto, então nenhum número da frente L fica inválido por causa disso: o defeito estava
isolado no Grid ao vivo. **Muda comportamento em produção** (101/309 criaturas passam a reagir),
por isso entrou como pré-requisito do portão da batalha, não como exceção ao congelamento.

## 4. Minha análise: por que isto se acumulou

Nenhum dos 26 casos foi um erro isolado. Três padrões se repetem:

1. **Fechar uma frente não fecha os documentos que a citam.** H1/H2/K28/D2/B1b foram implementados
   de verdade, mas quem implementou não voltou ao `Pendencias.md` para riscar o item. Como o mapa
   é lido no início de toda sessão nova, cada um desses vira uma mentira de repetição: uma sessão
   nova recebe "isto ainda está em aberto" para algo que já saiu há semanas.
2. **"Fechado" com condição escondida dentro** (o padrão que virou entrada nova no `CATALOGO.md`,
   A11 sendo o caso). Uma pendência que nomeia um evento futuro dentro do próprio texto de
   fechamento não fechou, fechou pela metade e escreveu isso em prosa em vez de em estado.
3. **O `|| []` que nunca lança é o pior tipo de bug de dado**: ele não aparece em teste nenhum que
   não pense especificamente em testá-lo, porque toda leitura "funciona" (devolve array, o `.map`
   roda, nada quebra). Achar o B12 exigiu grep cego em `.fraquezas`/`.resistencias`, não rodar a
   suíte. Isso é generalizável: qualquer `campo || []`/`campo?.algo` no código é, por definição,
   um lugar onde ler do caminho errado não avisa ninguém.

O denominador comum: **não existe hoje um mecanismo que force a volta ao documento quando o
código muda**, nem um que force checar se um `|| []`/`?? 0` está escondendo um caminho errado.
Os dois são trabalho de auditoria manual, e auditoria manual só acontece quando alguém pergunta
"isto ainda está certo?", como aconteceu aqui.

## 5. O que eu recomendo

**Curto prazo, baixo custo:**
- Sempre que um item do `Pendencias.md` for de fato implementado, marcar `[x]` **no mesmo commit**
  que fecha o trabalho, não depois. O hábito de "implemento, documento depois" é a causa direta de
  H1/H2/K28/D2.
- A forma nova do `CATALOGO.md` ("fechado com condição pendente dentro") vale generalizar: ao
  escrever `[FEITO]`/`[DECIDIDO]`, se a frase de fechamento contém "quando", "assim que" ou
  "depois que", ela não fechou, é duas pendências com um checkbox só. Vale reler os `[x]` mais
  antigos do `Pendencias.md` com esse filtro; não fiz essa varredura completa aqui.

**Médio prazo:**
- Considerar uma variante do `test-procedencia.mjs` (que já existe e já pegou dois `file:line`
  envelhecidos nesta sessão) para checar **estado**, não só citação de linha: um item `[x]` cujo
  texto cita um arquivo/campo que não existe mais é um sinal auditável automaticamente, mesmo que
  parcial.
- `Auditoria_Tecnica.md` e `Pendencias.md` guardam achados que se sobrepõem (o B12 é o exemplo:
  vivia inteiro na auditoria, ausente do mapa). Não recomendo fundir os dois documentos (têm papéis
  diferentes: um é auditoria pontual, o outro é o índice vivo), mas vale uma revisão futura
  perguntando "todo achado de `Auditoria_Tecnica.md` §8.2 em diante tem uma linha correspondente
  no `Pendencias.md`?" — só conferi o item das fraquezas, não os demais.
- Repetir esta auditoria de memória **periodicamente** (sugestão: a cada marco grande de uma
  frente fechar, não em intervalo fixo de tempo) em vez de esperar a pergunta do usuário. O custo
  foi ~5 sub-agentes em paralelo, minutos de trabalho; o retorno foi um bug de produção real e
  contradições que já estavam gerando trabalho perdido (C1/C2 pareciam esquecidas, e não estavam).

**Registrado mas fora do escopo desta sessão** (não fiz nada a respeito, só nomeando):
- Esta worktree tem um `.claude/CLAUDE.local.md` com uma regra de formato de resposta
  ("Executora:") que esta conversa não seguiu, porque a tarefa não era rodada de simulação.
  Vale confirmar com o humano se a regra deveria valer para qualquer sessão nesta pasta ou só para
  o papel de Executora.
- O terceiro papel do fluxo de simulação ("Auditora", desde 08/09) ainda não tem memória de
  formato/auto-commit própria, ao contrário de Executora e Revisora.

## 6. O que não foi tocado

Esta auditoria não mexeu em nenhuma regra de jogo. As duas únicas mudanças de comportamento em
produção foram o conserto do B12 (dano de Arte agora agravado por fraqueza no Grid, como sempre
deveria ter sido) e a documentação correspondente. Tudo o mais foi correção de registro: memória,
`Pendencias.md`, `Auditoria_Tecnica.md`, `CATALOGO.md`.
