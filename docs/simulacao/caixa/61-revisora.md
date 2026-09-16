# Rodada 61 da revisora · rodada 77 do projeto · as regras compráveis, e o typecheck no gancho

Revisora: aviso em `9502fbb`. BASE `1ceb2e9`, SHA do trabalho `d6fadfc`, TOPO `9502fbb`.
Este arquivo revisa a **rodada 77** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `9502fbb7aefa66b005367c2cd3906959beac6102`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `366a887`.

**A base que ela declara não é a do aviso, e isso é inofensivo aqui, medido:** o `progresso-77.md`
diz "Ancorada em `b7274f2`", e a BASE do aviso é `1ceb2e9`. `b7274f2` é ancestral, e
`git diff --name-only b7274f2 1ceb2e9` são dois documentos (`Pendencias.md` e um progresso de
hotfix), zero arquivo de código. Todo `arquivo:NNN` dela vale no meu pino.

**Coautoria:** limpa nos dois commits. **Travessão:** zero nas 95 linhas ADICIONADAS em `src/`,
`scripts/` e `CLAUDE.md`, mais o `progresso-77.md` lido como arquivo.

**Os números do `CLAUDE.md` conferem na mesma máquina:** `validate` em **15.326 ms** contra os
15.173/15.208 dela. O `+13,4 s` do typecheck veio de uma amostra só e a minha deu **15,6 s**
(4.642 do `sync` + 10.917 do `tsc`); a ordem de grandeza está certa e não abro item.

---

## 1 · O falso verde fechou, e o que a forma nova não vê é mensagem, não mecanismo

**As duas que o aviso mandou refazer:**

| o que plantei | saída |
|---|---|
| `Um PV 41 sem Centelha morre em −20, e com Centelha morre em −20` | `EXIT=1`, e nomeia o lado CERTO: `(comCentelha) publica morte em -20, e a régua … dá -21` |
| a gêmea, com o segundo em `−21` | `EXIT=0` |

**O vermelho é do número e não da forma de escrever**, que era o ponto do conserto. O `CORRIGE 1`
da rodada 60 está fechado.

**E o que a forma nova não vê**, que é a segunda metade da pergunta. Duas redações corretas saem
vermelhas:

- `Com Centelha, um PV 41 morre em −21.` (rótulo antes do `PV N`)
- `Um PV 41 morre em −21 para quem tem Centelha.` (rótulo depois do número)

As duas erram na direção segura, e por isso **não peço conserto de mecanismo**. A mensagem é que
está errada: ela diz *"morre em −21 **sem dizer** se é de quem TEM ou de quem NÃO TEM Centelha"*,
e a frase DIZ. Quem receber esse vermelho vai procurar um rótulo que já escreveu.

**E a janela está em ótimo local, medido, para ninguém "consertar" alargando:** tirei o piso do
`inicioPv` e rodei contra o capítulo com os dois exemplos do PV 37 em ordem inversa (redação
igualmente correta). Sem o piso, o exemplo `comCentelha` é classificado como `semCentelha`, porque
a janela alcança a prosa da regra (*"quem não tem Centelha arredonda para baixo, quem tem
arredonda para cima"*), que traz a negativa e é testada primeiro. **Alargar para trás vaza para a
regra; alargar para a frente vazaria para o exemplo seguinte.** O piso é carga.

`CORRIGE 1`, e é uma oração: a mensagem diz a regra de escrita ("o rótulo precisa estar entre o
`PV N` e o `morre em`") em vez de afirmar que o texto não diz o que diz.

## 2 · O `ladosVistos` ganhou leitor, e o `Set` só recebe quem testemunha

Confere, e as duas coisas que o aviso pediu:

- a conferência das duas testemunhas lê o `Set` (`if (!ladosVistos.has(l))`) em vez de chamar
  `ladoDe` de novo sobre a mesma janela. **Duas leituras da mesma coisa viraram uma**, e isto é
  melhor que apagar: a segunda leitura era a cópia que já tinha divergido uma vez;
- o `Set` só recebe exemplo com resto (`if (lado && sobraResto(p.pvMax))`). Com PV par os dois
  arredondamentos dão o mesmo número, e contá-lo como testemunha deixaria um lado meio provado.

## 3 · O recorte do typecheck: um caso RESOLVE, o outro é furo, e há um terceiro

**(a) Commit só de `src/content/**` pagar o typecheck NÃO é desperdício, e é medida.** As coleções
carregam os JSONs e os capítulos com schema `zod` (`src/content.config.ts`), e a coleção
`chapters` valida o frontmatter. Plantei `ordem: "seis"` num capítulo e rodei: o `astro sync`
**falha**, nomeando o arquivo. É a única conferência automática de frontmatter que existe no
commit, e ela só roda porque o caminho casa.

**(b) O furo do recorte são os arquivos que DECIDEM o typecheck**, e nenhum deles casa
`^(src|scripts)/`: `tsconfig.json` (que é quem diz `extends: astro/tsconfigs/strict`, o `include`
e o `exclude`), `package.json` (a versão do `typescript` e do `astro`) e `astro.config.mjs`.
Trocar o `strict` por um preset frouxo muda o resultado do `tsc` sobre o repositório inteiro, e o
gancho não roda para conferir. **O recorte cobre o que é checado e deixa de fora o que decide a
checagem.**

**(c) E um terceiro, que nenhuma das duas perguntas nomeia: o gancho decide pelo COMMIT e confere
a ÁRVORE.** O comentário novo tem por cabeçalho *"O QUE VAI NO COMMIT, e não o que está na
árvore"*, e isso é verdadeiro sobre o `--cached` (a decisão de rodar) e falso sobre o `tsc`.
Medido: plantei um erro de tipo em `src/lib/mesa-core.ts` **sem nada no índice**
(`git diff --cached --name-only` vazio) e o `tsc` acusou. Num diretório compartilhado por duas
frentes, que é o que o `CLAUDE.md` descreve, o commit de uma pode ser recusado por erro não
commitado da outra, e pode passar por uma correção que não está nele.

**O conserto é o COMENTÁRIO, e não o mecanismo:** checar só os arquivos staged seria errado,
porque tipo é global. Sem esta frase alguém vai tentar. `CORRIGE 2`.

## 4 · O `>/dev/null` engole o `astro sync` inteiro, e a mensagem põe a causa errada no lugar

O gancho chama `npx astro sync >/dev/null`. Com o frontmatter inválido plantado, rodei exatamente
assim: **zero saída**, e só o código de erro. O que o autor do commit vê é isto, e mais nada:

```
✘ O `astro sync` falhou, e sem ele o `tsc` acusaria erro que não é seu.
  O commit não foi feito.
```

**A frase atribui a ambiente uma falha que pode ser dado do próprio commit**, e a causa real (o
arquivo e o campo) foi jogada fora. É a garantia que ninguém mediu ocupando o lugar da medição, e
custa caro por um motivo específico: como o item (a) acima mostra, **o `astro sync` é a única
conferência de schema que os `src/data/*.json` e o frontmatter recebem no commit**. Quando ele
recusar por dado errado, o autor vai procurar problema de instalação.

`CORRIGE 3`, e são duas linhas: guardar a saída e imprimi-la na falha, e a mensagem parar de
afirmar a causa.

## 5 · A Mão de Ferro publica uma regra geral que nenhuma decisão tomou

**Este é o achado da rodada.** Comparei os seis textos campo a campo entre a BASE e o topo, e
quatro estão certos na régua nova: o `inquebrantavel` ("derruba e PARA em 0", e o "+1 ao limiar"
saiu), o `fechar-feridas` ("cura dano leve"), a Arte Cura nível 3 ("cura moderado"), e os dois da
Arte Vida (`efeitos.json` e `arcano.cura.outrasArtes`, "em qualquer nível e em qualquer
profundidade, inclusive abaixo do zero"). O `ultimo-suspiro` nomeia a janela, que é o que a M-21e
pediu.

**Os dois que sobram dizem, sobre o Impacto COMUM, o contrário do que o capítulo publicado diz:**

- `src/data/tecnicas.json` · `mao-de-ferro` · `atravessam o zero: não param como o Impacto comum, e matam como qualquer outro dano`
- `src/data/armas.json` · Desarmado · `dano de Impacto (com a Técnica Mão de Ferro ele atravessa o zero, em vez de parar nele)`

As duas afirmam que o Impacto comum **para no zero**. O capítulo que está no ar desde a rodada 75
diz o contrário, e em duas vozes: `src/content/chapters/combate.md:111` · `o dano que passa é um só, e qualquer um dos três mata`,
e a M-21 inteira, que é "dano é dano". Se o Impacto comum parasse no zero, a Técnica
`inquebrantavel`, de nível 4, compraria nada, porque todo mundo já teria o efeito dela.

**Onde nasceu, e o mecanismo é o que torna isto diagnosticável em vez de opinião:** a decisão da
M-21b tem por CABEÇALHO *"2 · INQUEBRANTÁVEL · o Impacto não atravessa o zero"*, que é uma
afirmação geral, e por CORPO *"golpe de Impacto derruba **quem tem a Técnica**, e para em 0"*, que
é sobre o portador. A M-21d citou a leitura do cabeçalho (*"passa a conversar com o
`inquebrantavel` da M-21b, que diz que o Impacto derruba e para em zero"*) e a rodada publicou
essa leitura em dois arquivos de dado comprável. Cabeçalho contra corpo, e está a um `git show` de
quem quiser conferir.

**E o que faz disto mais do que dois textos discordando é a regra de desempate deste repositório.**
O `CLAUDE.md` diz que quando o JSON e o capítulo discordam, o JSON vence e o capítulo se corrige.
Aplicada aqui, ela manda o próximo reescrever `combate.md:111` para dizer que o Impacto comum para
no zero, **revogando a M-21 para um dos três modos por um caminho que ninguém decidiu**. O
`CATALOGO.md` já registra as duas formas vizinhas disto (o termo que o dado mandava e o domínio
não aceitava, e a hierarquia de fontes que não ordena o tempo); esta é a terceira, e o que ela
acrescenta é que o desempate **propaga** o erro em vez de só não resolvê-lo.

`CORRIGE 4`. A causa está fora da faixa, e isso não compra ESCALA: a faixa tocou os dois arquivos,
o item da rodada nomeou exatamente estes textos, e a pergunta 5 do aviso é se cada frase nova está
certa. **Qual das duas leituras vale é da mesa, e eu não digo qual.** O que é conserto da rodada é
o texto no ar não poder afirmar as duas.

**E uma frase que o registro precisa ter:** nenhum portão lê nenhum dos seis textos editados. O
`ondeNaoPodeVoltar` vigia cinco lugares e nenhum é `tecnicas.json`, `armas.json`, `artes.json` ou
`efeitos.json`, o que é deliberado e está escrito no comentário dele. **A conferência à mão foi a
única que estes seis receberam.**

## 6 · O gancho passou a escrever `.astro/` a cada commit de código

`astro sync` gera `.astro/`, e o `CLAUDE.md:54` declara `.astro/` compartilhado entre as duas
frentes, com o sintoma nomeado: *build simultâneo produz saída corrompida e erros fantasma de
"Duplicate id"*. Antes desta rodada essa escrita acontecia quando alguém buildava; agora acontece
**em todo commit que toca `src/` ou `scripts/`**.

**O que eu medi:** `git worktree list` devolve duas árvores, `rpg-system` e a minha, e o
`.astro/` de `rpg-system` existe. **O que eu NÃO medi:** se há hoje duas instâncias trabalhando
dentro de `rpg-system` ao mesmo tempo. Se houver, a colisão que o `CLAUDE.md` descreve passou a ter
um gatilho novo e muito mais frequente; se todas as frentes já estiverem em worktrees próprias,
não há nada aqui. **Não afirmo qual dos dois é o caso**, e a rodada criou a escrita sem medir
nenhum dos dois ramos.

`ESCALA 1`, porque depende de um fato do arranjo que não se lê do meu pino.

---

## O veredito

**PROCEDE**, com quatro `CORRIGE` e um `ESCALA`. Os seis itens foram entregues, o falso verde que
eu achei na rodada 60 está fechado com a prova refeita nas duas direções, o `ladosVistos` ganhou
leitor em vez de sumir (que é o conserto melhor), e o typecheck no gancho é instrumento novo que
passou pelos três sentidos com controle positivo de verdade.

**BLOQUEIA:** nada.

**CORRIGE:**

1. A mensagem do portão diz "sem dizer se é" sobre um texto que diz. A regra real é que o rótulo
   fique entre o `PV N` e o `morre em`, e ela não está escrita em lugar nenhum que o autor leia.
   **Não alargue a janela:** medi que o piso é carga.
2. O cabeçalho do comentário do gancho ("o que vai no commit, e não o que está na árvore") é
   verdadeiro sobre o `--cached` e falso sobre o `tsc`, que confere a árvore. Medido com o índice
   vazio. O conserto é o comentário.
3. O `>/dev/null` engole a saída do `astro sync` inteira, e a mensagem afirma uma causa de
   ambiente para uma falha que pode ser dado do commit. Medido: zero saída com frontmatter
   inválido.
4. `mao-de-ferro` e a linha do Desarmado publicam que o Impacto comum para no zero, contra
   `combate.md:111` e contra a M-21. Nasceu de um cabeçalho da M-21b que diz mais que o corpo
   dele, e a regra "o JSON vence" propaga o erro para o capítulo se ninguém parar.

**ESCALA:**

1. O gancho escreve `.astro/`, que o `CLAUDE.md` declara compartilhado, a cada commit de código.
   Não medi se `rpg-system` ainda tem duas instâncias dentro.

**PERGUNTA:** nenhuma. As cinco coisas do aviso foram medidas, e cada falsificação foi desfeita no
mesmo fôlego, com `diff` vazio conferido.
