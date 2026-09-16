# Progresso · rodada 77 · as regras publicadas param de mentir, e o typecheck ganha dono

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `b7274f2`. Seis itens: o furo novo do portão (falso verde, vem primeiro), o
`ladosVistos` que ninguém lê, o typecheck no gancho só quando há código no commit, os 7 segundos
do `CLAUDE.md`, as regras publicadas das três decisões, e a varredura de novo antes de dar a
lista por fechada.

- **22:33** · começo. `HEAD` = `b7274f2`, `origin/main..HEAD` = 0. Árvore limpa fora o
  `jogador-novo-prompt-executor.md`, que não é meu.
- **22:35** · item 1 FEITO, e o conserto é de JANELA e não de regex: são duas, e não uma. A do
  PV continua atravessando o exemplo anterior, de propósito, porque "o mesmo PV 37" e "um PV 41
  sem Centelha …, e com Centelha …" dizem o número uma vez só. A do RÓTULO passou a começar onde
  o exemplo anterior terminou, que é o que impede o segundo de herdar o "sem Centelha" do
  primeiro.
- **22:35** · item 2 FEITO no mesmo lugar, e o conserto do 2 saiu de dentro do 1: o `ladosVistos`
  ganhou LEITOR em vez de sumir. A conferência das duas testemunhas lia `ladoDe` de novo sobre a
  mesma janela, que é duas leituras da mesma coisa; agora ela pergunta ao `Set`. E o `Set` só
  recebe exemplo com RESTO, porque PV par não testemunha arredondamento nenhum.
- **22:36** · a falsificação DELA, refeita nas duas direções: "Um **PV 41** sem Centelha morre em
  **−20**, e com Centelha morre em **−20**" → `EXIT=1`, e a mensagem nomeia o lado certo
  (`comCentelha`, esperado −21). O mesmo texto com o segundo número CERTO (−21) → `EXIT=0`. O
  vermelho é do número e não da forma de escrever, que era o ponto.
- **22:37** · item 3 escrito: `scripts/hooks/pre-commit` roda `npx astro sync && npx tsc
  --noEmit` só quando `git diff --cached --name-only --diff-filter=ACMR` casa `^(src|scripts)/`.
  O `--cached` é a pergunta certa mesmo com pathspec: o git monta um índice temporário para o
  commit e aponta o `GIT_INDEX_FILE` para ele, então ele responde sobre o commit que está
  nascendo, e não sobre o índice compartilhado com a outra instância.
- **22:37** · PRIMEIRO SENTIDO do gancho, com o defeito de hoje como controle positivo: `esc` de
  volta no `ficha-engine.ts`, `git add`, `git commit` com pathspec → **`EXIT=1`, o gancho acendeu
  no passo do `tsc`**, com a linha exata (`ficha-engine.ts(2872,64)`), e o **`HEAD` não mudou**
  (conferido comparando o sha antes e depois, e não pela ausência de mensagem de erro). Desfeito,
  e o índice devolvido com `git restore --staged` do MEU arquivo, para o `add` da falsificação
  não pegar carona no commit de ninguém.
- **22:38** · TERCEIRO SENTIDO, que aqui é o caminho que NÃO deve pagar: commit só de documento
  (este arquivo), medido, **14.973 ms e zero menção a `astro sync`** na saída. O gancho pulou o
  typecheck, que é o que o item 3 pediu, e o pulo foi medido e não presumido.
- **22:39** · itens 4 e 5 FEITOS. O `CLAUDE.md` e o cabeçalho do próprio gancho trocaram os 7
  segundos pelos 15,2 medidos, com a data, e dizem o que o commit de código paga a mais. Os seis
  textos das três decisões entraram: a cláusula do Letal saiu de `arcano.cura.outrasArtes` e do
  `acelerar-a-cura` (`efeitos.json`), o `inquebrantavel` passou a parar em 0, o `mao-de-ferro`
  atravessa o zero (com o par na linha do Desarmado em `armas.json`), o `fechar-feridas` e a
  Arte nível 3 perderam a palavra, e o `ultimo-suspiro` nomeia a JANELA. `validate` verde.
- **22:40** · item 6, a varredura por conta própria, FEITA. Duas passadas sobre os catálogos de
  coisa comprável, e o que saiu está na seção abaixo.

## Item 6 · a varredura, o escopo dela, e DUAS achadas que eu NÃO consertei

**O escopo, dito em voz alta:** catorze JSONs de `src/data` (`tecnicas`, `artes`, `efeitos`,
`armas`, `armaduras`, `escudos`, `antecedentes`, `caminhos`, `habilidades`,
`habilidades-secundarias`, `virtudes`, `racas`, `condicoes`, `glossario`), campo de texto a campo
de texto, incluindo os aninhados (níveis de Arte, parâmetros de Efeito). Duas passadas, como ela
fez: uma pelo **vocabulário da trilha** (`letal|letais|letalidade|nocaut|trilha`) e outra pelo
**vocabulário da morte** (`limiar|morre|morrer|morte|morto|matar|mata|acumulad`). Em Python e nó,
e não por `grep`, porque classe de caractere com acento não casa neste ambiente.

**82 casamentos, e a maioria é português comum**, descartada um a um: "ambientes letais", "trilha"
de rastreio (`trilha-fria`, `faro`), "mata" de floresta (`voz-da-mata`, `a-mata-levanta`), os
nomes da Arte Morte e das condições, "morrem por ordem sua" na Liderança, "o efeito sai da mão e
morre no chão" no Acerto Arcano.

**As duas que sobraram são ACHADO e não conserto, pela regra desta rodada:**

- **A SEXTA REGRA ÓRFÃ · `tecnicas.json` · `imortalidade-tenue`** (Cerne Vital, nível 6, ativa,
  6 de Energia e 2 de Vontade): *"Volta de golpes que matariam e regenera membros; só a destruição
  total o mata."* É a MESMA família do `ultimo-suspiro` da M-21e: o gatilho é o momento da morte,
  que deixou de existir como momento, e "só a destruição total o mata" nomeia uma exceção sem
  mecanismo na régua nova. Com o limite derivado, ela precisa dizer o que acontece ao cruzá-lo.
- **E UMA QUE NÃO É REGRA ÓRFÃ, É UMA PREMISSA DA PRÓPRIA M-21b · a Arte de ressurreição NÃO é
  futura, está publicada.** A decisão 4 fecha a cura acima do limite e compra o contra dizendo
  que isso *"fecha por código uma porta que uma Arte de ressurreição futura vai querer"*. A Arte
  **Cura, nível 6**, já diz *"traz o recém-morto; expurga quase tudo"* (`src/data/artes.json`,
  último nível da Arte `cura`). Ela é comprável hoje. **Quando a trava da cura pelo número entrar,
  na rodada própria, ela vai impedir a Cura 6 de fazer o que o livro diz que ela faz**, e o
  contra que a mesa comprou era sobre uma Arte que ela não sabia que já existia.
