# Rodada 14 · resposta da revisora, e fechamento de sessão

Revisora: aviso em `c0a2945`, `BASE e21ef3d` → `SHA ec71b4a` (`TOPO` igual).
Este arquivo também fecha a sessão, por pedido do humano antes da troca de
equipe (07/09/2026) — as duas coisas cabem no mesmo `14`, porque o aviso
chegou depois de eu já ter revisado boa parte deste intervalo em chat,
direto por commit, sem par de arquivos na caixa (ver a seção de fechamento,
mais abaixo).

## Recorte, conferido antes de ler qualquer número

- `git log --format='%h pais:%p' e21ef3d..ec71b4a`: 7 commits, zero merges,
  um pai cada.
- `git diff --stat e21ef3d..ec71b4a`: 22 arquivos. Inventário do aviso bate
  com o diff real.

## O que rodei

`npm run validate` verde (inclui o item 6 novo do `test-portoes.mjs`).
`node scripts/test-bandeiras-mesa.mjs` direto: os três sentidos passam
(`999→998`, `999→999`, lendo `pvDe`). CI no commit avisado (`ec71b4a`,
`34096574409`): `Dados e regras` e os 9 smokes da matriz (`test-bandeiras-mesa`
incluso) verdes.

## O ataque, antes de escrever qualquer veredito

Reproduzi os números da tabela em vez de aceitar prontos: `1315`/`1315`/`0`
no fixture (contado com `node -e` no commit avisado, bate exato); os 7
`.map()` de campo a campo em `gen-monsters.mjs` (linhas 165, 167, 222 já
corrigida, 224, 225, 227, 229 — contagem bate); as 9 entradas dos dois lados
da matriz/`smoke` (bate, e sabotei de propósito numa rodada anterior desta
sessão para confirmar que a trava acusa de verdade, não só hoje).

**Um número não bate, e é da tabela de procedência:** "7 de 9 armaduras
(todas exceto Placa de munição e Placa completa)". Conferi
`src/data/armaduras.json` direto: `placa-municao` tem `resistPerf: 2`,
`placa-completa` tem `resistPerf: 3` — as duas são MAIORES que a Perfuração 0
da Adaga, então as duas **resvalam**, não são exceção. A própria nota de
`placa-completa` no arquivo diz isso com todas as letras: "nenhuma flecha,
besta ou picareta (N0–N2) a vence — resvalam (Nível 3)". Os dois únicos que
de fato NÃO resvalam são `nenhuma` e `gambeson` (`resistPerf: 0` nos dois).
O `7 de 9` está certo; o parêntese que nomeia as duas exceções está invertido
— nomeia as duas armaduras mais pesadas, exatamente as que a régua descreve
como a prova da Adaga, como se fossem penetráveis por ela.

Não é erro de código (já tinha conferido `resvalaGate`/`gatePerfuracaoAbre`
em rodada anterior desta sessão, e a implementação está certa) nem de dado
(`armaduras.json` está certo). É a frase da tabela "O QUE ESTE RELATÓRIO
AFIRMA" que inverteu qual metade do par é a exceção — o tipo de coisa que o
próprio formato existe para pegar antes de virar citação em outro lugar.

## CORRIGE

1. **`14-executora.md`, tabela de números, linha "7 de 9 armaduras"**: trocar
   "(todas exceto Placa de munição e Placa completa)" por "(todas exceto
   Nenhuma e Gambeson)", que são as duas com `resistPerf: 0`. Não bloqueia
   (código e dado corretos, só a frase da tabela erra a direção).

## PERGUNTA

Nenhuma.

## ESCALA

O aviso já nomeia dois pontos que precisam do humano, e registro aqui para
não ficarem só na seção "O QUE FICOU EM ABERTO" dele:

- **A trava genérica dos sete `.map()` de campo a campo** (`gen-monsters.mjs`,
  D14b): escrever a versão genérica agora, ou consertar caso a caso conforme
  cada campo novo estourar. Custo de cada lado já está no aviso.
- **`teto6`**: soma sentinela e magnitude no mesmo campo do dado, e separar
  os dois é decisão de regra antes de poder ligar. Não é conserto de
  engenharia.

## VEREDITO

PARA

---

## Fechamento de sessão

O que segue não é resposta ao aviso: é o resumo que o humano pediu antes da
troca de equipe, para quem herdar esta frente sem ter visto a conversa.

### O que está fechado

- **Rodadas 10 a 14** revisadas, vereditos em `10-revisora.md` a este arquivo.
- **A frente de simulação encerrou** (`b3be51b`): L25 medido por inteiro,
  nove das quinze bandeiras são regra a escrever e seis são o núcleo do Tick,
  sem rodar isoladas. A grade de 112 células fica desenhada e não executada.
  Motivo em `ESTADO.md`/`Pendencias.md`, não repetido aqui.
- **`porte` e `gate` ligados na mesa e provados na Vida**, não só no log
  (`1a6d816`, `4400f4c`, reforçados por `875b7bc`): conferido que os dois
  entram no total que decide o veredito e nos três pontos de decisão de dano
  (`contaDoLance`, `fim`, `pintarDano`), não só na pintura.
- **O CORRIGE do CI cego para `test-bandeiras-mesa`**, aberto e fechado
  nesta sessão (`2fe37cd`, registrado em `CATALOGO.md` por `ec71b4a`):
  conferido por mim com sabotagem de propósito, acusa vermelho e volta ao
  verde.

### O que está aberto

- **A trava genérica dos sete `.map()`** em `gen-monsters.mjs` (D14b): só o
  tamanho está registrado, a escrita não aconteceu.
- **`margem`, `bloqueio`, `teto6`** continuam desligados; `teto6` tem
  obstáculo de regra (sentinela e magnitude no mesmo campo), não só de
  engenharia.
- **`grid.astro` não importa `lance.ts`**: duas implementações independentes
  da mesma conta, sincronizadas só por uma fixture com 0% de cobertura de
  bandeira viva. Risco registrado, não conserto pendente desta rodada.
- **O piloto da bandeira `margem`** nunca rodou; o `n=2.527` planejado vem de
  `ticksDeEntrada` (substituto). Não bloqueia hoje porque a grade nem
  executa, mas precisa de nova conferência se `margem` for ligada.

### O que a próxima revisora precisa saber que não está no contrato

**O contrato completo mora em `.claude/CLAUDE.local.md`, dentro deste
worktree, e ele NÃO é versionado** (`.git/info/exclude` do git-dir comum).
Se você está lendo isto sem esse arquivo à mão — worktree novo, clone novo,
equipe nova — ele pode não existir mais. Este documento, `ESTADO.md`,
`Pendencias.md` e `docs/simulacao/CATALOGO.md` são o que sobrevive de
qualquer jeito.

**Desde 06/09/2026 nem todo trabalho revisado passa pela caixa de correio.**
Depois do encerramento da frente de simulação, o humano ligou bandeiras do
L25 direto na mesa por commit direto, sem `NN-executora.md` correspondente
para cada um — o pedido de revisão e a resposta aconteceram em chat, no
formato de sempre (`Revisora:` dentro de um bloco de código). Este aviso
(`14-executora.md`) retomou o formato da caixa para o MESMO intervalo que eu
já tinha revisado em pedaços no chat; por isso o CORRIGE 1 (CI cego) já
chegou aqui fechado, e o único achado novo desta rodada formal foi a linha
da tabela de armaduras. Trate o modo "commit direto + revisão em chat" como
normal quando a caixa não tiver aviso — mesma disciplina de conferência, sem
o par de arquivos.

**Você commita a própria resposta agora**, inclusive esta (instrução direta
de 06/09/2026, depois de arquivos ficarem `??` repetidas vezes). Pathspec
sempre, nunca `-A`/`.`/`-a`; se `git checkout main` falhar por a executora
estar usando o branch no próprio worktree, fique em detached HEAD e empurre
com `git push origin HEAD:main`, conferindo `origin/main` antes de cada
commit e de cada push (a executora escreve em `main` a qualquer momento,
inclusive no meio desta mesma sessão de fechamento).

**Duas formas novas valem atenção no próximo diff**: um par de teste
"liga"/"desliga" que passa ou falha JUNTO pode estar provando que as duas
metades dependem do mesmo insumo quebrado, não que o mecanismo funciona
(quebre de propósito o dado que separa os dois casos e veja se colapsam); e
uma trava de duas listas pode auditar o nível errado (chave de topo, quando
o vazamento mora um `.map()` abaixo). As duas estão no `CATALOGO.md`.
