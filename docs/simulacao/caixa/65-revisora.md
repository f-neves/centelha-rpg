# Rodada 65 da revisora · rodada 82 do projeto · o eco nos três lugares, e o arquivo inteiro vigiado

Revisora: aviso em `593525b`. BASE `70ea0df`, SHA do trabalho `01a6461`, TOPO `593525b`.
Este arquivo revisa a **rodada 82** do projeto.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `593525b63ed11eaaa77d480c4431c6d8eca8055c`, e bate com `origin/main`.
Árvore limpa antes e depois da reancoragem, vinda de `da35cb2`.

**Coautoria:** limpa. **Travessão:** zero nas 32 linhas ADICIONADAS em `src/` e `scripts/`.
**`validate`:** verde.

**O `CORRIGE 3` da rodada 81 está fechado, conferido por mim e não pelo relato:** refiz o plantio
de `Cortante e Perfurante sao Letal.` em `dano.nota`, que passava verde na rodada 64, e agora o
portão acende nomeando `regras.json`. Restaurado, `diff` vazio.

---

## 1 · O alcance na placa foi certo, e o que sobrou nela tem um fato errado

**O gesto está certo** e eu teria feito o mesmo: consertar dois documentos e deixar a frase falsa
no código para o qual eles apontam seria fazer o trabalho pela metade, e a rodada 81 provou que
ponteiro para texto não corrigido é o jeito mais barato de a frase sobreviver.

**E a placa nova está melhor no que importa:** ela afirma o comportamento (devolve
`pv_atual = pv_max` em todas as peças, inclusive nas que passaram do limite), diz que a
legitimidade está na mesa e que o comentário não decide, e guarda a régua que achou a porta. As
três coisas são verificáveis, e a segunda é a que faltava.

**O que ela afirma de errado, e é medida:** *"as seis caixas são independentes e marcadas por
padrão"*. São **seis independentes** e **cinco marcadas**:

| caixa | rótulo | nasce marcada |
|---|---|---|
| `rs-tick` | zerar os Ticks | sim |
| `rs-ini` | rolar iniciativa de novo | sim |
| `rs-pv` | restaurar a Vida ao máximo | sim |
| `rs-cond` | limpar as condições | sim |
| `rs-fora` | trazer de volta quem estava fora | sim |
| **`rs-log`** | **apagar o registro** | **não** |

**A contagem errada foi minha primeiro, e a correção dela trocou de erro.** Eu escrevi "são cinco
caixas independentes" na rodada 64, contando as do pacote de reset e deixando a do registro de
fora. Ela corrigiu o total para seis, que está certo, e levou junto o "marcadas por padrão", que
valia para as cinco. A frase inteira e verdadeira é **seis independentes, cinco marcadas**.

**E a segunda imprecisão é a metade da régua que não foi aplicada:** *"desmarcando as outras cinco,
o clique devolve a Vida cheia de todo mundo e não faz mais nada"*. Ele também enche a **Energia**,
no mesmo `if`:

`src/pages/mesa/combate.astro` · `if (zPv && c.pv_max != null) { cols.pv_atual = c.pv_max; if (c.energia_max != null) cols.energia_atual = c.energia_max; }`

A régua que saiu da rodada 64 tem dois lados: o vizinho dentro de um `if` próprio é OPCIONAL, e o
vizinho dentro do MESMO `if` é NECESSÁRIO. A correção usou o primeiro lado para derrubar o "vem
acompanhada" e não usou o segundo para ver o que vem junto de verdade. **A Energia é o único
vizinho obrigatório desta escrita, e é o que nenhuma das versões da placa menciona.**

`CORRIGE 1`, e é a mesma oração nos **três** lugares onde a frase está hoje:
`src/pages/mesa/combate.astro`, `docs/simulacao/caixa/progresso-79.md:101` e `docs/pendencias/L-simulacao-simultaneo.md:2749`.
A quarta ocorrência (`jogador-novo-decisoes.md:2908`) é sua e diz só "independentes", sem o
"marcadas", então está certa e não entra.

## 2 · O preço foi mesmo uma frase, e a régua foi aplicada

Medido por mim, no arquivo e não no relato:

- **`regras.json` inteiro: ZERO** ocorrências de `letal`/`letais`, insensível a caixa, depois da
  troca de `arcano.fonteElemental.notaAr`. O `validate` fica verde sem exceção nenhuma, e sem
  lista de `id` a envelhecer.
- **A troca é legítima como português:** "o elemento que menos mata" diz a mesma coisa que "o
  elemento menos letal" no contexto (a nota compara o Vento aos outros elementos por dano), e não
  empresta vocabulário de regra nenhuma.

**E eu varri o que ela não varreu, que é o outro lado da pergunta:** nos JSONs de dado FORA da
vigia, `letal` ainda aparece em três, e os três são bestiário: `habilidades-bestiario.json` (4),
`lore-bestiario.json` (3) e `monsters.json` (7, gerado). Todos são adjetivo de descrição traduzida
("dano não letal", "precisão letal", "choque letal"), nenhum é a trilha, e o escopo declarado do
portão é coisa comprável. **Não é furo, é fora de escopo por decisão escrita**, e digo porque a
pergunta era se acende em algum lugar que ela não viu.

**Sobre ser a decisão que você recusou em 15/09:** as duas decisões são coerentes entre si, e o
que mudou não foi o critério, foi o preço. Em 15/09 a conta era duas frases reescritas para
comprar um padrão mais largo, e havia uma terceira saída (o padrão de palavra) que custava zero
frases. Aqui a conta é uma frase para comprar o arquivo inteiro, e a alternativa é uma lista de
quatro nomes que já vazou duas vezes. **Preço diferente, resposta diferente, mesma régua:** medir
antes de decidir, e não comprar o instrumento com texto publicado quando houver saída mais barata.

## 3 · A ressalva nova promete um pouco mais do que cinco itens sustentam

O que ela escreveu confere com o que eu medi, item por item: quatro abertos, um parcial, o `C-70`
nomeado com a citação conferida no arquivo e não herdada de mim, e a decisão de não estender a
amostra dita com o motivo. Isso está certo.

**O que passa do que a amostra dá é uma palavra:** *"O RISCO REAL DESTA CLASSE NÃO É O QUE EU
ESCREVI PRIMEIRO"*, e depois *"o que esta classe esconde é 'item menor do que a linha dele diz', e
não 'item já fechado'"*.

Cinco itens amostrados mostraram **um** caso de item menor e **zero** de item fechado. Isso
sustenta *"apareceu um caso de item menor, e nenhum de item fechado nos cinco que olhei"*. Não
sustenta *não é* sobre os 23, porque 18 não foram olhados.

**E o detalhe que torna isto mais do que preciosismo:** a frase original continua verdadeira, e
ela é verdadeira por OUTRO motivo · ela é um limite do MÉTODO ("quem escrevesse com outras palavras
continuaria contado como aberto"), que vale sem depender de amostra nenhuma. A frase nova a
desautoriza ("não é o que eu escrevi primeiro") usando uma generalização de cinco casos. **Trocou
uma verdade de método por uma inferência de amostra**, e as duas deveriam conviver: o método diz o
que a classe não prova, e a amostra diz o que apareceu quando alguém olhou.

`CORRIGE 2`, e é trocar "não é" por "além disso", mantendo as duas.

---

## O veredito

**PROCEDE**, com dois `CORRIGE`. Os três itens da rodada 81 foram feitos, o do portão está fechado
com a minha falsificação anterior agora vermelha, o eco foi corrigido nos três lugares em vez de
um, e o alcance que ela estendeu para a placa foi a decisão certa.

**BLOQUEIA:** nada.

**CORRIGE:**

1. "As seis caixas são independentes e marcadas por padrão": são seis independentes e **cinco**
   marcadas (`rs-log`, "apagar o registro", nasce desmarcada). E "não faz mais nada" omite a
   **Energia**, que é escrita no mesmo `if` e é o único vizinho obrigatório desta escrita. Está
   nos três lugares: a placa, o `progresso-79.md:101` e o `docs/pendencias/L-simulacao-simultaneo.md:2749`. A contagem errada
   começou comigo.
2. A ressalva nova diz que o risco "não é" o que a primeira versão dizia. Cinco itens dão um caso
   de item menor e zero de item fechado, e 18 não foram olhados. A frase original é um limite de
   método e continua válida sem amostra: as duas convivem, e a troca é de "não é" para "além
   disso".

**ESCALA:** nada.

**PERGUNTA:** nenhuma. As três coisas do aviso foram medidas, e a falsificação de conferência foi
desfeita no mesmo fôlego, com a árvore conferida limpa.
