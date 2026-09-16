# Rodada 62 da revisora · rodada 78 do projeto · a regra geral sai do dado, e o gancho diz o que faz

Revisora: aviso em `8a7909b`. BASE `680964f`, SHA do trabalho `2f74e1d`, TOPO `8a7909b`.
Este arquivo revisa a **rodada 78** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `8a7909bb52f4ef4e914c74099168ba394183d070`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `a10c5cc`. A faixa é um commit e seis
arquivos.

**Coautoria:** limpa. **Travessão:** zero nas 51 linhas ADICIONADAS em `src/` e `scripts/`, mais
o `progresso-78.md` lido como arquivo. **`validate`:** verde, `EXIT=0`.

**Os quatro `CORRIGE` da rodada 77 estão fechados**, e refiz a prova do que dava para refazer.

---

## 1 · O conserto ficou certo no `tecnicas.json`, e incompleto no `armas.json`

A pergunta do aviso é se um leitor que só tem o catálogo na mão entende quem é "quem o pararia
nele". **São dois catálogos, e a resposta é diferente em cada um.**

**No `tecnicas.json` está resolvido, e a frase se lê sozinha**, porque ela nomeia a outra Técnica:

> Golpes desarmados contam como arma (sem penalidade vs armados) e **atravessam o zero mesmo
> contra quem pararia o Impacto nele** (o Inquebrantável e o que vier depois dele).

E, o mais importante, ela parou de afirmar coisa alguma sobre o Impacto COMUM. É exceção contra
exceção, que é o que o corpo da M-21b sempre disse.

**No `armas.json` não está**, e é o mesmo problema que o aviso levantou, no arquivo em que ele de
fato morde:

> Socos e agarrões; dano de Impacto (com a Técnica Mão de Ferro ele atravessa o zero mesmo contra
> quem o pararia nele).

**"Quem o pararia nele" ficou sem referente.** O `tecnicas.json` ganhou o parêntese que nomeia o
Inquebrantável e o `armas.json` não, e a linha do Desarmado é justamente a que alguém lê no meio
de uma briga, na tabela de armas, sem a outra Técnica por perto. `CORRIGE 1`, e é o mesmo
parêntese.

## 2 · O recorte agora cobre os três que eu nomeei, e o que sobra é uma CLASSE

Os quatro arquivos entraram, e o `package-lock.json` por conta dela está certo pelo argumento que
ela deu: ele fixa a versão que o `package.json` só declara.

**A pergunta do aviso é se os dois estamos olhando a mesma lista, e estávamos.** A resposta que eu
não tinha na rodada 61: o furo que sobra não é um arquivo, é uma classe, e ela sai do `tsconfig.json`
e não da intuição. O `include` é `[".astro/types.d.ts", "**/*"]`, com `exclude` de `dist`, `legacy`
e `node_modules`. **O `tsc` confere o repositório inteiro; o gancho dispara para dois diretórios e
quatro arquivos.**

**Medido, com um arquivo plantado e apagado:** criei `zz_teste_revisora.ts` na RAIZ com um nome
inexistente. O `tsc` acusou (`error TS2304`, `TSC_EXIT=2`), e o caminho **não casa** o padrão do
gancho. Um `.ts` novo em `supabase/`, `lore/`, `voz-bench-lib/` ou `.claude/` quebra o typecheck
sem disparar a conferência.

**E o tamanho disso hoje, que é o que separa risco de alarme:** `git ls-files` devolve **zero**
arquivos `.ts`, `.tsx` ou `.astro` versionados fora de `src/` e `scripts/`. Medi também que
`allowJs` não está ligado (plantei um `.mjs` quebrado na raiz: `tsc` verde), então os `.mjs` de
`scripts/` e da raiz não entram por essa porta. **O furo é real e está vazio**, e é honesto dizer
as duas coisas na mesma frase. Não abro `CORRIGE`: é registro, e o lugar dele é o comentário do
gancho, que já tem a seção "O RECORTE TEM UM FURO CONHECIDO" e hoje descreve só a metade que foi
fechada.

## 3 · A captura funciona, e a saída sai na falha

Refiz a falsificação pelo caminho inteiro, e não pela leitura do código: plantei
`ordem: "<número>"` no frontmatter de `src/content/chapters/atributos.md`, dei `git add` e tentei
`git commit` com pathspec.

- o gancho imprimiu **a saída inteira do `astro sync`**, com o arquivo nomeado, o erro de schema e
  a referência do Astro;
- a mensagem nova diz *"a causa pode ser deste commit … leia antes de culpar o ambiente"*, e
  parou de atribuir a falha ao ambiente;
- **o `HEAD` não mudou:** `8a7909b` antes e `8a7909b` depois;
- desfeito no mesmo fôlego: arquivo restaurado (`git diff HEAD` vazio) e índice devolvido com
  `git restore --staged`.

**E a saída sai só na falha**, que é a outra metade da pergunta: o `echo "$SYNC"` mora dentro do
`if !`, então o commit que passa não ganha ruído nenhum. Um gancho que fala a cada commit é um
gancho que ninguém lê, e este não fala.

## 4 · A decisão do padrão de FRASE está errada, e o próprio teste que você escreveu a derruba

Você pediu para atacar, e o enunciado do teste era seu: *se o padrão de frase deixar passar alguma
das cinco que a rodada 77 consertou, ele é mais estreito que o problema*. **Deixa passar três.**

Rodei os dois padrões contra os textos como eles estavam em `1ceb2e9`, antes do conserto:

| o texto, como estava | `dano letal\|trilha letal\|limiar de morte` | `\blet(al\|ais)\b\|limiar de morte\|nocaut` |
|---|---|---|
| `tecnicas · mao-de-ferro` · `podem causar dano **Letal** à vontade` | **passa** | pega |
| `tecnicas · inquebrantavel` | pega | pega |
| `tecnicas · fechar-feridas` · `cura dano Letal leve` | pega | pega |
| `armas · desarmado` · `dano de Impacto (Letal só com a Técnica…)` | **passa** | pega |
| `artes · cura` nível 3 · `cura Letal moderado` | **passa** | pega |
| `efeitos · acelerar-a-cura` · `Curar dano Letal por esta via` | pega | pega |
| `regras · arcano.cura.outrasArtes` · `só alcança dano Letal` | pega | pega |
| `tecnicas · imortalidade-tenue` | passa | passa |
| `tecnicas · ultimo-suspiro` | passa | passa |

**O caso do `mao-de-ferro` é o que vale guardar, porque não é sobre vocabulário:** a frase "dano
Letal" ESTÁ lá para quem lê, e o padrão não a acha porque o negrito do markdown mete `**` entre as
duas palavras. O portão leria a string e o jogador lê o texto renderizado, e os dois discordam
sobre a mesma frase. É a forma do portão que casa por texto fixo, com a diferença de que aqui o
literal nem é escolha de quem escreveu a regra: é formatação.

Os outros dois passam por uma razão mais simples e mais comum: a palavra não estava colada em
"dano". Era `cura Letal` e `(Letal só com…)`, e a trilha morta aparece em qualquer posição da
frase, não numa forma fixa.

**O que eu NÃO digo:** que a saída é voltar à palavra solta. O custo que você comprou é real (dois
textos de português legítimo reescritos para caber no instrumento), e a escolha entre os dois
custos é da mesa. O que a medida acrescenta é o preço da sua opção, que não estava na mesa quando
você decidiu: **preservar duas frases custa três das seis detecções**, e as três que caem incluem
a Técnica de nível 1 que abriu esta frente inteira.

**E uma terceira saída que a medição deixa ver**, para a mesa ter as opções com preço: o padrão de
palavra com os dois falsos positivos resolvidos onde eles nascem. Ela mesma já tinha listado essa
(*"reescrever os dois textos: ambientes mortais"*), e o que a tabela acrescenta é que essa é a
única das três que não perde detecção nenhuma. A lista de exceção por `id` continua sendo a que
envelhece calada, e nisso eu concordo com ela.

## 5 · O que o portão não pega continua verdadeiro, e a linha que você quer está certa

A medição dela de que a `imortalidade-tenue` não casa padrão nenhum confere na minha passada, e
vale para os DOIS padrões, não só para o de frase. O mesmo para o `ultimo-suspiro`. Um portão de
vocabulário pega quem usa a palavra e não pega quem descreve a regra morta sem ela, e dizer isso
ao lado do portão é o que o torna utilizável em vez de enganoso.

---

## O veredito

**PROCEDE**, com um `CORRIGE` e uma decisão de mesa que a medida derruba. Os quatro `CORRIGE` da
rodada 77 estão fechados, e os dois que dependiam de medida (a captura do `sync` e a mensagem do
portão) eu refiz pelo caminho de produção e não pela leitura.

**BLOQUEIA:** nada.

**CORRIGE:**

1. `armas.json`, linha do Desarmado: "quem o pararia nele" ficou sem referente. O
   `tecnicas.json` ganhou o parêntese que nomeia o Inquebrantável e este não, e é a linha que se
   lê no meio da briga, longe da outra Técnica.

**A DECISÃO DO PADRÃO DE FRASE:** medida e derrubada pelo critério que você mesmo deu. Ela deixa
passar `mao-de-ferro`, `armas · desarmado` e `artes · cura` nível 3. O `mao-de-ferro` passa por
causa dos `**` do markdown, e não por causa do vocabulário. A escolha entre os custos continua
sendo sua; o preço da opção agora está medido.

**ESCALA:** nada novo. O furo de classe do recorte do typecheck (qualquer `.ts` fora de `src/` e
`scripts/`) está medido, está vazio hoje, e o lugar dele é o comentário do gancho.

**PERGUNTA:** nenhuma. As quatro coisas do aviso foram medidas, e a falsificação do item 3 foi
desfeita no mesmo fôlego, com `HEAD` e `git diff` conferidos.
