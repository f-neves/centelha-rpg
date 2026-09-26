# Rodada 104 · veredito

> **Errata (26/09/2026):** a página `artes` era um redirecionamento para `artes/regras` e este
> documento contava os links dela duas vezes. **Vale só para a tabela do §5** (a mesma que o
> `108-revisora.md` reaproveitou); números corrigidos em `109-revisora.md` §2. **Não cobre o §1**
> (Perfuração, 50/20/6, medida sobre a página inteira): esses números não foram reconferidos sem a
> `artes`, e quem for usá-los precisa recontar primeiro.

Pino: `c153782` (aviso), faixa `52c7fa1..66da997`. Só o `f5d563c` e o `66da997` são da rodada; o
`0a4b610` e o `6ba50a2` ficaram fora. Passo 0 pelo §0.1 corrigido: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o veredito 103, `9654fc6`, estava no main), e depois
`git switch -C revisora c153782`. Toplevel é a worktree da Revisora, HEAD `c153782734ba`,
`git branch --show-current` dá `revisora`, e a worktree estava limpa antes.

**O §0.1 corrigido e o §0.2:** li os dois inteiros. O §0.1 agora diz `HEAD` e explica por quê, e o
§0 diz "na branch `revisora`". Nada ambíguo. O §0.2 separa, de forma explícita, a reancoragem de
rotina das ordens que tocam outra frente. Esta rodada não teve ordem desse tipo.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. **O CORRIGE da 102 está fechado.**

- **O zero é resultado:** eu o medi com um medidor próprio, e o controle negativo o desmente do jeito
  certo (§1).
- **A promessa da 102, pelo outro lado:** a busca do site ainda leva "perfuração" ao verbete do gate
  (§3).
- **Uma ESCALA, que decide a prioridade do que vem:** dois verbetes da seção 5 são muito piores do que
  a Perfuração era (§5).

## CI (§11)

Workflow `Validar dados e regras`, lido às 07:14 (hora da máquina):

| commit | run | resultado |
|---|---|---|
| `f5d563c` (o conserto) | `35971932602` | `completed / success` |
| `66da997` (o relato) | `35972002605` | `completed / success` |
| `c153782` (o aviso) | `35983876514` | `completed / success` |

Os dois de fora da faixa (`0a4b610`, `6ba50a2`) também estão `success`.

## 1 · O zero: é resultado, e não ausência de medida

**O instrumento.** O `medir-autolink.mjs` do scratchpad agora é o da Executora: o dela tem o mesmo
nome e sobrescreveu o meu da 102. Escrevi outro, `medir-autolink-rev.mjs`, com duas defesas contra
o zero ambíguo:

- **ele só lê depois de o `ref-index.json` ter chegado** (o evento `requestfinished` do pedido) **e de
  a contagem de `a.ref` ficar parada em três leituras seguidas**, com 250 ms entre elas. O dela espera
  2,5 s fixos;
- **ele grava, por página, o total de `a.ref`, se o índice foi pedido e se a contagem estabilizou.**

Nas 107 páginas, **só 6 não pediram o índice nem estabilizaram**: `mesa/arquivos`, `combate`,
`diario`, `grid`, `grupo` e `mapas`. São as páginas com `data-refs="off"` (`Referencias.astro:286`),
e não uma leitura perdida. Outras 6 têm zero `a.ref` e pediram o índice: `admin`, `conta`, `entrar`,
`mesas`, `personagem` e `redefinir-senha`, telas de conta, sem prosa. Nenhuma das 12 tinha link de
Perfuração na 102.

**Os dois lados, com build limpo** (`.astro/` e `dist/` apagados antes de cada build):

| | links para `perfuracao` | no sentido do modo de dano | links para `penetracao` |
|---|---|---|---|
| **antes**: controle negativo, o `glossario.json` de `52c7fa1` posto de volta só para medir | 50 | 24 | 6 |
| **depois**: o pino | **20** | **0** | 6, os mesmos, conferidos um a um |

O "antes" bate com a minha medição da 102 e com a dela. **Desfiz o controle negativo no mesmo
comando** (`git checkout -- src/data/glossario.json`), rebuildei no estado do pino, e o
`git status` voltou a mostrar só o meu progresso.

**Os 20 de depois, lidos um a um, estão todos no sentido do gate:**

- "Nível de Perfuração" (10, dois deles o "+1 nível de Perfuração" da tabela de custos);
- "Resistência à Perfuração" (4);
- "gate" (6: "Gate natural de Perfuração", "Passa por gate?", "Impacto (sem gate)", "o gate abre"
  duas vezes, "não passam pelo gate").

**A conta fecha:** saíram 34 links (24 do modo de dano e 10 do gate) e entraram 4. 50 − 34 + 4 = 20.

## 2 · Os links novos e o "Gate" solto

**Entraram quatro, e o relato conta três mais uma troca.** Os quatro estão no sentido do gate:

- "Resistência à Perfuração" em `equipamentos` ("O Nível entre parênteses é a Resistência à
  Perfuração");
- "Resistência à Perfuração" em `regras/armas-e-armaduras` ("cada armadura tem um Nível (Resistência
  à Perfuração, 0–3)");
- "o gate abre" em `regras/armas-e-armaduras`;
- "Gate", em "Gate natural de Perfuração" (`mesa/referencia`), que antes linkava pela palavra
  "Perfuração" do mesmo cabeçalho.

**O "gate" solto não casa em outro sentido.** Varri `src/content`, `src/pages`, `src/data` e
`src/lib` por "gate" como palavra inteira, e separei o que não estava perto de perfuração, placa ou
armadura:

- a nota do Quase-Acerto em `grid.astro`;
- a bandeira `"gate": true` do `regras.json`;
- a frase "o gate nao e chamado".

As três são o mesmo gate. O livro não usa "gate" em outro sentido.

## 3 · A promessa da 102: quem procura "perfuração" ainda acha o gate

**A "consulta" do `Referencias.astro` não é busca.** O filtro dela (`:233-247`) só filtra as entidades
já fixadas, então ela não entra nesta pergunta.

**A busca do site é o Pagefind.** Medi carregando o `pagefind.js` do `dist/` no navegador e
chamando `search()` (`busca-pagefind.mjs`, no scratchpad):

| o que se digita | páginas | onde sai o Glossário |
|---|---|---|
| perfuração | 10 | **1º**, com o trecho "Nível de Perfuração · Nível de Perfuração da arma (0–3) vs Resistência à Perfuração da armadura" |
| perfuracao | 10 | 2º |
| nível de perfuração | 8 | 1º |
| gate | 12 | 3º |

**A promessa se cumpre pela busca.** O que mudou é a ordem alfabética da página do glossário: o
verbete saiu do P e foi para o N, e quem descer a lista procurando "Perfuração" no P acha a
Penetração, cuja definição diz "Não é o gate de Perfuração", sem link. É pequeno, e não é defeito.

## 4 · Os 9 acertos do gate que perderam o link, e os dois caminhos

**A lista está completa.** A minha diferença entre antes e depois dá exatamente os 10 trechos do gate
que saíram. Um deles volta pela palavra "Gate". Os 9 da tabela do relato conferem.

**O caminho 1, os apelidos de expressão, é seguro, e respondo o que ela não mediu.** Varri o livro
inteiro (`src/content`, `src/pages`, `src/data`, `src/lib`) por "perfuração natural" e "perfuração
nível 3". São 9 ocorrências, e **todas estão no sentido do gate**:

- a coluna "Perfuração natural" da Couraça de Porte, que é a coluna do Nível, e não da Absorção;
- "resvala na Perfuração natural 2";
- "Nível de Perfuração natural";
- os três "Perfuração nível 3+" e o do `armaduras.json`;
- "Resistência à Perfuração natural", no glossário.

**Nenhuma é a Absorção natural de Perfuração.** Então os dois apelidos recuperariam 5 dos 9 sem
reabrir o defeito.

**O caminho 2** (escrever "Resistência à Perfuração" no lugar de "Perfuração (Nível)" e "Rest.
Perfuração") é texto de capítulo. Ele faz sentido e é do humano.

## 5 · Os outros verbetes com a mesma forma: dois saltam aos olhos, e muito

Medi os 10 verbetes da seção 5 com o mesmo medidor (2474 links ao todo) e contei só os links cuja
palavra é o apelido ambíguo:

| verbete ← palavra | links | páginas | amostra de 10, lida |
|---|---|---|---|
| **Dificuldade ← "alvo"** | **278** | **43** | **10 de 10 são o alvo do ataque**: "derruba o alvo", "rola para continuar de pé", "enfraquece o alvo por uma cena" |
| **Integridade ← "Compostura"** | **43** | **25** | **10 de 10 são o Atributo Compostura**: "Energia = (Vigor + Compostura + …)", "Compostura + Meditação", as âncoras dos Caminhos |
| Ticks ← "Velocidade" | 385 | 24 | a amostra caiu toda no bestiário ("· Velocidade 6"), onde a palavra É a Velocidade em Ticks; não li as outras 23 páginas |
| Nível (banda) ← "Nível" | 382 | 26 | misto: "nível de poder" é o sentido do verbete, e "o mesmo nível" da Arte fica no limite |
| Margem ← "Margem" | 82 | 24 | não li |
| Centelha ← "poder" | 33 | 15 | não li |
| Defesa ← "esquiva" / "bloqueio" | 32 / 28 | 15 / 16 | não li |
| Valor Passivo ← "passiva" | 22 | 11 | não li |
| Técnica ← "poder" | 12 | 8 | não li |
| Firula ← "manobra" | 7 | 7 | não li |

**O pior é o "alvo"**, com 278 links errados em 43 páginas, mais de dez vezes os 24 da Perfuração.
**O segundo é a "Compostura"**, e por um motivo que vale nomear: ela rouba o link do próprio Atributo.
O Atributo Compostura também é agulha, com o mesmo comprimento. Na ordem estável do `sort`
(`Referencias.astro:42`), o glossário entra antes no índice e ganha o empate. Então nenhuma
"Compostura" do livro leva ao Atributo.

**ESCALA:** os dois vêm antes dos outros sete, e o conserto é o mesmo desta rodada (tirar a palavra
solta das agulhas). A amostra é de 10; a contagem inteira está em `al104-amb.json`, no scratchpad.

## 6 · A resposta do J11

**O fato está certo:** não há portão que confira link automático. Conferi os três lugares que ela
cita, e nenhum olha o sentido.

**O desenho do instantâneo é o certo para pegar MUDANÇA.** Uma ressalva: ele tem de comparar pela
chave (verbete, página, palavra), e não pela contagem por página. Uma troca que mantenha o número
(um link sai, outro entra) passaria por contagem, e foi exatamente o que aconteceu no cabeçalho
"Gate natural de Perfuração" desta rodada.

**O tempo:** o meu medidor leva **303 s** nas 107 páginas, esperando a estabilidade, contra os 376 s
dela com 2,5 s fixos. O custo é de job de `smoke`, como ela diz.

**O argumento contra a versão sem navegador se sustenta só contra uma REIMPLEMENTAÇÃO.** A segunda
cópia da regra some se o casamento sair do `autolink()` para uma função pura em `src/lib`, que o
`Referencias.astro` e o portão importem. É a regra da casa "ações recebem objeto", aplicada aqui.
Sobram duas coisas de verdade:

- a extração do texto por bloco, fora do navegador, pede um analisador de HTML;
- a ficha é montada por JS e não entra.

A decisão é do humano. **Mas a alternativa não é só "navegador ou cópia divergente": há a terceira,
com uma fonte só.**

## 7 · Travessão, lendo os arquivos

- **Linhas acrescentadas:** zero, nos quatro arquivos da faixa e do aviso.
- **O relato** (`104-executora.md`) tem **zero** no arquivo inteiro, depois do `66da997`.
- **O `glossario.json`** tem 3 no arquivo, e nenhum na linha mudada. São anteriores à rodada.
- **Controle positivo:** o mesmo varredor acusou `combate.md:35` nas rodadas anteriores. Nesta,
  acusou os 3 do `glossario.json` na contagem do arquivo inteiro.

## Limpeza

**O controle negativo foi desfeito no mesmo comando** e registrado no progresso: o `glossario.json`
foi restaurado e o site rebuildado no estado do pino.

Ficaram no scratchpad:

- `medir-autolink-rev.mjs` e `busca-pagefind.mjs`;
- as medições `al104-antes.json`, `al104-depois.json`, `al104-outros.json`, `al104-amb.json` e
  `busca104.json`.

O `.astro/` e o `dist/` da worktree foram apagados e refeitos. Não mexi em arquivo versionado.
`git status --short` ao fechar: só os meus dois arquivos da caixa.
