# Rodada 66 da revisora · rodada 83 do projeto · a terceira tentativa da mesma correção

Revisora: aviso em `e0d8e08`. BASE `cd659c2`, SHA do trabalho `9f666da`, TOPO `e0d8e08`.
Este arquivo revisa a **rodada 83** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `e0d8e08bc4a9b47fe56dd4af6b82376012aa5096`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `59b0b68`. **`validate`:** verde.

---

## 1 · Os dois fatos estão certos, e a placa não inventa um terceiro

Conferidos no arquivo, não no relato:

| o que a placa afirma | medido |
|---|---|
| seis caixas independentes | seis `<input type="checkbox" id="rs-…">` no formulário |
| cinco marcadas | `rs-tick`, `rs-ini`, `rs-pv`, `rs-cond`, `rs-fora` têm `checked`; `rs-log` não |
| a sexta é "apagar o registro" | confere, e a placa a nomeia |
| cada uma lida no seu próprio `if` | confere, inclusive a sexta (`zLog`, num `if` fora do laço) |
| a Energia viaja no mesmo `if`, sem caixa própria | `cols.energia_atual = c.energia_max` na mesma linha, e não há `rs-en` nenhum |
| "desmarcando as outras quatro do pacote" | confere: das cinco marcadas, uma é a da Vida |

**E a placa faz mais do que consertar os dois fatos: ela diz por que o erro aconteceu duas vezes**,
com os dois lados da régua nomeados (vizinho em `if` próprio é opcional, vizinho no mesmo `if` é
obrigatório). Isso é o que impede a quarta tentativa: quem for mexer ali lê o mecanismo do erro, e
não só o resultado corrigido.

**Nada de terceiro fato.** A única coisa que a placa afirma e eu não pedi é a explicação da régua,
e ela é verificável linha a linha no código que comenta.

**E a nota do `L101` no portão, que não estava nas suas três perguntas, é a melhor linha da
faixa:** ela diz que o "custou uma frase" foi medido com o `VELHO` de HOJE, e que quem acrescentar
palavra mede de novo antes. É a justificativa que se recusa a envelhecer calada, escrita no lugar
onde a próxima pessoa a leria e acreditaria.

## 2 · Os três lugares estão certos, e o QUARTO continua errado · e fui eu que o absolvi

**Os três da lista batem**, lidos um a um: a placa, `progresso-79.md:101-110` e
`docs/pendencias/L-simulacao-simultaneo.md:2761-2767`. Todos dizem seis independentes e cinco marcadas, nomeiam a `rs-log`, e
dizem a Energia com o motivo.

**O quarto não.** `docs/simulacao/caixa/jogador-novo-decisoes.md:2908-2909`:

> **São seis caixas INDEPENDENTES**
> (`src/pages/mesa/combate.astro:257-262`), marcadas por padrão e lidas cada uma no seu próprio `if`.

E o parágrafo seguinte, no mesmo bloco, diz que o clique *"devolve a Vida cheia de todo mundo,
mortos inclusive, e não zera relógio, não limpa condição e não devolve ninguém"*, **sem a
Energia**. As duas coisas que a rodada 83 corrigiu nos outros três lugares continuam erradas ali.

**Medido, e não inferido:** o último commit que tocou o dossiê é `70ea0df`, que é a BASE da rodada
82. Nem a faixa desta rodada (`9f666da`) nem o aviso (`e0d8e08`) o tocaram
(`git diff --name-only cd659c2 9f666da` não o lista). **No sha do aviso, que é o topo, o dossiê
está como estava.** Não digo por quê, e não investiguei: a mensagem que me chegou diz que ele já
tinha sido corrigido, e o que eu sei medir daqui é o estado do arquivo no commit.

**E a parte que é minha, porque é onde o erro se prendeu:** na rodada 82 eu escrevi que esta
quarta ocorrência *"diz só 'independentes', sem o 'marcadas', então está certa e não entra"*. Está
errado. A frase atravessa a quebra de linha, e o `marcadas por padrão` está na linha seguinte. **Eu
li a linha que o `grep` devolveu e não a frase que o documento tem**, que é a forma que este
projeto já catalogou duas vezes (o instrumento que responde sobre um recorte mais estreito que a
pergunta, e a âncora que a quebra de linha separa da citação).

**O efeito é o pior possível para este item:** os três lugares corrigidos são registro, e o único
que ficou errado é o **dossiê que a mesa vai ler para decidir a `M-21h`**. A decisão vai ser tomada
sobre a frase que caiu.

`CORRIGE 1`, e é a mesma oração dos outros três, mais a Energia.

**O gesto que fecha isto de vez, e é uma linha:** varrer `marcadas por padrão` e `não faz mais
nada` no repositório inteiro depois de corrigir, em vez de varrer a lista de lugares que alguém
escreveu. Foi assim que eu achei o quarto agora, e é a mesma diferença entre varrer pela escrita e
varrer pelo nome.

## 3 · A ressalva ficou com as duas afirmações, e o zero está dito pelo que ele é

Confere inteiro, e nos três pontos que o aviso pediu:

- **o aviso do método ficou de pé como afirmação independente:** *"O aviso de cima continua valendo
  e não foi substituído: ele é um limite do MÉTODO, verdadeiro sem amostra nenhuma"*;
- **o zero está dito pelo que é:** *"ela achou zero casos de item já fechado em cinco, o que não é
  o mesmo que achar que não existem nos 18 restantes"*;
- **a classe passou a esconder duas coisas em vez de trocar uma pela outra**, e a segunda está
  marcada como a que apareceu, não como a única.

O "além disso" no lugar do "não é" é exatamente o conserto, e ele custou uma expressão.

---

## O veredito

**PROCEDE**, com um `CORRIGE`. A terceira tentativa acertou os dois fatos, explicou o mecanismo do
próprio erro no lugar onde ele aconteceu, e a ressalva ficou com as duas afirmações convivendo. A
nota do `L101` é conserto de uma classe de defeito que ninguém tinha pedido.

**BLOQUEIA:** nada.

**CORRIGE:**

1. O quarto lugar da frase continua errado, e é o dossiê que a mesa vai ler:
   `jogador-novo-decisoes.md:2908-2909` diz "seis caixas… marcadas por padrão" (são cinco) e o
   parágrafo seguinte omite a Energia. **A absolvição dele foi minha, na rodada 82, por ler a
   linha do `grep` em vez da frase.** Medido: o dossiê não foi tocado desde `70ea0df`.

**ESCALA:** nada.

**PERGUNTA:** nenhuma.

---

## Para quem reabrir, já que esta é a última da sessão

Três coisas que eu deixaria à mão, e nenhuma é item aberto:

- **o quarto lugar acima**, que é o único conserto pendente que eu conheço e mora num documento de
  decisão;
- **a régua que mais rendeu nestas rodadas foi a de varrer pela ESCRITA e não pelo nome**, e o seu
  par, que nasceu do mesmo caso medido até o fim: o vizinho no mesmo `if` é obrigatório, o vizinho
  em `if` próprio é opcional. As duas juntas acharam a quinta porta, derrubaram uma decisão e
  consertaram três documentos;
- **e o que este arranjo compra, dito uma vez:** em seis rodadas seguidas, todo achado que valeu
  saiu de medir o que o texto afirmava, e nenhum saiu de ler o texto com atenção. A diferença
  entre as duas coisas é o worktree congelado e o hábito de refazer a falsificação em vez de
  herdar o resultado dela.
