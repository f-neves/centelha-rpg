# Rodada 98 · veredito

Pino: `37741e4` (aviso), faixa `994aa07..bde0da6`. O `a249cc3` (a §17 decidida pelo humano) serviu de
régua e não foi julgado. Passo 0 conferido: toplevel é a worktree da Revisora, HEAD
`37741e4436aa`, worktree limpa antes de reancorar.

**Veredito geral: PROCEDE, com um CORRIGE pequeno e uma PERGUNTA.** Nenhum BLOQUEIA. O "nada muda na
mesa" se sustenta nos dois sentidos para tudo o que o motor rola. O CORRIGE é uma frase que a própria
rodada deixou falsa (§2). A PERGUNTA é uma regra que o livro novo não decide: a Arte mirada (§1). O
vermelho do `test-grid` é herdado, e vai como ESCALA (§5).

## CI (§11)

Workflow `Validar dados e regras`:

- **`bde0da6` (o trabalho, fim da faixa):** run `35942338268`, **`completed / success`**, os 19 jobs
  verdes, inclusive `Smoke · test-espelho` e `Smoke · test-grid`.
- **`a249cc3` (a §17, dentro da faixa):** run `35941955665`, `success`.
- **`575be67` (parte 1):** run `35941091164`, **`failure`, só em `Smoke · test-grid`**. Os outros 18
  estão verdes, `test-espelho` entre eles. A asserção que caiu, lida no `--log-failed`:
  `[aquece] a peça pegável não está na vez, e arrastá-la abriria pergunta em vez de mover (escolhida
  "Criatura 17"; 0 peça(s) na vez pegáveis, 1 na vez no palco, 3 no tabuleiro inteiro, 21 pegáveis
  de 10 no palco)`.
- **`37741e4` (o aviso):** run `35946980829`, **ainda `in_progress`** quando conferi, com
  `test-espelho` e `test-grid` rodando (reconferido às 23:30, hora da máquina). O commit só toca
  `98-aviso.md`.

**A classificação do vermelho está no §5: herdado, e não da rodada.**

## 1 · "Nada muda na mesa" vale nos dois sentidos? Para o que o motor rola, vale

**O lado de ataque.** Não há filtro por atributo em lugar nenhum:

- `ajAtq` (`src/pages/mesa/grid.astro:10236-10244`) soma `tf.penAcao` ao `flat` e `tf.penAcaoDados`
  ao `dados`, sem olhar a arma;
- `ataqueAtual` (`src/pages/mesa/combate.astro:880-885`) faz o mesmo;
- o laço (`scripts/sim/motor.mjs:374-381`) também;
- `penAcao` só é lido nesses três e na tabela de referência (`referencia.astro:166`).

Então a arma de Força e o tiro já sofriam a penalidade, e o livro agora diz o mesmo. Conferido.

**A Defesa Física com ferimento: motor e livro concordam.** `defesaAtual`
(`combate.astro:851-878`) e a folha do golpe (`grid.astro:10037`) somam `penDefesa` à defesa do
alvo, e as duas só existem no golpe físico. O livro diz "e na Defesa Física". Nenhum caminho aplica
`penDefesa` a outra defesa.

**A Arte mirada (Percepção + Acerto Arcano): o motor não a penaliza, porque não a rola.** Não há
caminho de código que role Acerto Arcano. `artes-grid-mesa.ts` só cita o Acerto Arcano num
comentário (`:1294-1300`), e lá ele diz justamente que o Empurrão não o usa. `tierDe` aparece nesse
arquivo só para mostrar o estado do alvo (`:1884`). Então **o livro não contradiz o motor**: nenhum
dos dois penaliza a Arte mirada.

**Mas o livro não decide, e isso é PERGUNTA.** A frase nova (`vida-ferimentos-cura.md:36`) diz que o
ataque à distância "é a única rolagem de Percepção que a dor alcança, porque o arco e a besta pedem o
corpo firme". O dado descreve a Arte mirada como "o projétil que sai da mão e voa sozinho"
(`regras.json:1357`), com jogada de Percepção + Acerto Arcano (`regras.json:1256`, e oito efeitos em
`efeitos.json`). Dá para ler das duas formas:

- é "ataque à distância", e então a dor alcança duas rolagens de Percepção e não uma;
- é magia, a justificativa do "corpo firme" é só do arco e da besta, e a Arte mirada fica fora.

Nada em jogo muda hoje, porque a mesa não rola a Arte mirada. Muda o que o Mestre faz à mão, e muda o
dia em que alguém escrever esse caminho no Grid. **É regra, e não conserto: vai ao humano.**

## 2 · CORRIGE: "os mesmos" deixou de ser verdade no Frenesi

`racas.md:145`, reescrita nesta rodada:

> +2 no resultado dos testes de ação física, **que são os mesmos cuja penalidade de ferimento a fúria
> ignora**: as ações que rolam Força, Destreza ou Vigor

E o `FRENESI.md:116-118`, também reescrito na rodada: "...que é o mesmo conjunto cujas penalidades a
fúria ignora".

**A fúria ignora todas as penalidades de ferimento** (`racas.md:136`: "ignora **todas** as penalidades
de ferimento"). Desde esta rodada o tiro também sofre penalidade de ferimento (`vida-ferimentos-cura.md:36`).
Então o conjunto em que a fúria ignora a penalidade é ação física **mais o tiro**, e o conjunto que
ganha +2 é ação física **sem o tiro** (a própria frase o exclui logo depois). Os dois diferem
exatamente no tiro, e a frase diz que são iguais. Antes da rodada eram iguais, porque o livro não
penalizava o tiro.

Nada em jogo muda, porque a exceção vem nomeada na mesma frase. O que fica falso é a justificativa, e
a §17 registrou esse contra ("a definição de ação física ganha uma exceção nomeada"). Os dois textos
foram escritos nesta rodada, então pelo §8 é CORRIGE. **O conserto é uma oração em cada lugar**, por
exemplo "que são os mesmos cuja penalidade de ferimento a fúria ignora, menos o tiro" no `racas.md`
e o mesmo no `FRENESI.md`. A redação é da Executora.

## 3 · "como o Estabilizar": confere

O Estabilizar rola Vigor + Convicção nos três lugares:

- `vida-ferimentos-cura.md:75`: "Sozinho, cerrando os dentes, role **Vigor + Convicção vs Dif 10**";
- `condicoes.json:136`: "ou Vigor + Convicção em si mesmo";
- `aparencia-virtudes-vontade.md:86`, que já dizia antes da rodada que a dor física é Vigor +
  Convicção.

A rodada **desfez uma contradição que já existia**. O `acoes-resistir.md` dizia "Vontade +
Integridade", e o capítulo III já dizia Vigor + Convicção. O `regras.json:1097` (`estabilizar`) não
li além da chave.

**Um efeito da definição nova, que não é defeito:** a metade do corpo rola Vigor, e portanto é ação
física. A dor do ferro sofre a penalidade de ferimento de quem está sendo torturado, como já sofria o
Estabilizar. É coerente com a regra, e fica anotado para o Arquiteto ver que a tortura de alguém
ferido já sai mais fraca.

## 4 · Os dois formatos de link saem iguais

O `rehypeBaseLinks` (`astro.config.mjs:69-80`) prefixa `/centelha-rpg` em todo `href` que começa com
`/` e ainda não o traz, e pula o que já traz. A forma com o prefixo escrito à mão é a convenção do
HTML cru nos capítulos: 15 ocorrências em 11 arquivos, e nenhum `href="/regras/` sem prefixo em HTML
cru.

**Medido no build**, que rodei na worktree (`npm run build`, exit 0), com o `dist/` lido por arquivo:

- `defesas/index.html:201` → `/centelha-rpg/regras/acoes-resistir`;
- `acoes-resistir/index.html:504` → `/centelha-rpg/regras/aparencia-virtudes-vontade#o-teste-de-virtude`
  e `/centelha-rpg/regras/defesas`;
- `racas/index.html:283,287` → a mesma âncora do teste de Virtude;
- `aparencia-virtudes-vontade/index.html:214` → `#o-teste-de-virtude`, e o `id` existe uma vez na
  página.

As duas formas saem idênticas no HTML.

## 5 · O `test-grid` vermelho do `575be67`: herdado, e é ESCALA

**Não é da rodada.** A faixa não toca código. Os dois runs seguintes (`a249cc3` e `bde0da6`) rodaram
o mesmo `src/` e passaram no mesmo teste.

**Também não é o `L97` como ele está escrito.** O L97 registra *"a peça saiu do lugar"* e *"idas ao
banco (foram 0)"*. A asserção de hoje é outra, e é a guarda que o `6cf5449` pôs no teste (rodada 87).

**E não é a primeira vez.** Li os 60 últimos runs do workflow e o job que falhou em cada vermelho. O
`test-grid` caiu três vezes, **sempre na mesma asserção e na mesma criatura**:

| run | sha | data | contagens no fim da mensagem |
|---|---|---|---|
| `35911397511` | `8dc0f27` | 23/09 19:45 | 1 na vez no palco, 2 no tabuleiro, 21 pegáveis de 10 no palco |
| `35914287185` | `26f0d59` | 23/09 20:11 | 2 na vez no palco, 3 no tabuleiro, 21 pegáveis de 10 no palco |
| `35941091164` | `575be67` | 24/09 01:01 | 1 na vez no palco, 3 no tabuleiro, 21 pegáveis de 10 no palco |

"Criatura 17" nas três. **Onde nasceu:** o primeiro vermelho dessa forma que eu vejo é o `8dc0f27`. A
janela de 60 runs começa em 23/09 16:50, então pode haver ocorrência mais antiga fora dela. **Uma
coisa que eu vi e não investiguei:** "21 pegáveis de 10 no palco" põe mais peças pegáveis do que peças
no palco, e não sei se a conta do teste está certa. Não ofereço causa.

**Não achei item aberto para esta forma.** O Grep por "na vez pegáveis" e "peça pegável" só devolve o
teste e o `progresso-87.md`. **ESCALA:** um item novo, ou uma linha no L97 se o Arquiteto julgar que é
a mesma família.

Para completar o quadro: nos mesmos 60 runs também caíram uma vez cada o `test-l93-passocolossal-mesa`
(`ee4dce1`), o `test-l68-foradavez-mesa` (`9127df5`), o `test-editor-bestiario` (`f3b5105`) e o
`test-l88-ocupacao-detector-mesa` (`103db8a`). Todos passaram no commit seguinte. Não li as asserções
deles.

**A frase do progresso, pelo §11.** O `progresso-98.md` (22:15) cita do run `35941091164` só "Dados e
regras · success" e "Smoke · test-espelho · success", e o `98-executora.md` repete o segundo. **As
duas afirmações são verdadeiras**, e o despacho pedia exatamente o `test-espelho` verde. O que falta é
o estado do run, que fechou `failure`. Quem lê o relato entende que o run passou. É a forma que o §11
descreve: a medida certa sobre a parte, lida como se fosse sobre o todo.

**Não é CORRIGE**, porque não falsifica nada que a rodada prometeu, e a linha de CI deste veredito já
traz o estado inteiro. **Recomendo que vire hábito da Executora**, e não só da Revisora: citar um job
de um run inclui a conclusão do run.

## 6 · O resto da faixa

- **Nenhuma sobra de "Vigor ou Destreza" nem de "Vontade + Integridade" em `src/`.** Varri todos os
  arquivos de `src/` e o `FRENESI.md`. O par só aparece na nota de histórico do `FRENESI.md:117` e nas
  linhas de registro da §4b e da §16, que citam a versão velha de propósito.
- **A tortura:** as duas metades estão ditas igual nos três lugares (a nota sob a tabela das Virtudes,
  o item Resistir e o `acoes-resistir.md:188`). A frase do `defesas.md:58` separa quem interroga
  (Defesa Mental) de quem aguenta a dor (teste ativo). A célula da tabela não mudou, e casa com o
  `virtudes.json`, como o relato diz.
- **A Firula negativa:** dita no teste de Virtude (`aparencia-virtudes-vontade.md:103`) e no Frenesi
  (`racas.md:163`), sem devolução e separada da Firula Infeliz. Não entrou no capítulo de
  Habilidades. É o que a §17 manda.
- **L103:** diz o que o meu registro da 97 disse, com o laço e o espelho nomeados, e o índice foi
  regerado (250 / 162).
- **Travessão, lido nos arquivos:** conferi as linhas acrescentadas da faixa nos 11 arquivos que ela
  toca (os seis de texto, o registro, o tema L, o relato, o progresso e o aviso). Deu zero. Controle
  positivo: o mesmo varredor acusa a linha 209 do registro, que é antiga e tem travessão.

## Limpeza

O build escreveu `dist/` e `.astro/` da worktree, os dois fora do versionamento. Não mexi em arquivo
versionado. `git status --short` ao fechar: só os meus dois arquivos da caixa.
