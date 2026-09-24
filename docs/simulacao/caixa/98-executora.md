# Rodada 98 · Executora · a §17 no livro, no dado e no motor

Despacho: `docs/simulacao/caixa/98-despacho.md` (`994aa07`). As três leituras que pediram escolha
foram decididas pelo humano no meio da rodada (§17, `a249cc3`). Progresso com as horas lidas da
máquina em `progresso-98.md`.

## ENTROU

Em dois commits: `575be67` (a ação física e o L103) e o commit deste relato (o resto).

| arquivo | o que mudou nele |
|---|---|
| `src/content/chapters/vida-ferimentos-cura.md` | ação física "Força, Destreza ou Vigor"; o ataque à distância também sofre |
| `src/content/chapters/racas.md` | a mesma definição no +2 da fúria; a Firula negativa do Frenesi não devolve nada |
| `src/content/chapters/aparencia-virtudes-vontade.md` | a tortura nas duas metades (nota sob a tabela e item Resistir); a Firula negativa só do teste de Virtude, sem devolução, e distinta da Firula Infeliz |
| `src/content/chapters/acoes-resistir.md` | "Dor e tortura" deixa "Vontade + Integridade" e passa às duas metades |
| `src/content/chapters/defesas.md` | uma frase ligando a Tortura da Defesa Mental ao teste ativo do Resistir |
| `FRENESI.md` | §5 com a definição nova e a nota da troca |
| `docs/simulacao/caixa/leitura-de-novato-decisoes.md` | uma linha "trocado pela §17" na §4b e na §16 |
| `docs/pendencias/L-simulacao-simultaneo.md`, `Pendencias.md` | o L103 (item 0) e o índice regerado |
| `docs/simulacao/caixa/progresso-98.md`, `98-executora.md` | progresso e relato |

### A medição do item 1

**Ação física.** "Vigor ou Destreza" como critério estava em três lugares vivos: a definição
(`vida-ferimentos-cura.md`), o +2 da fúria (`racas.md`) e o `FRENESI.md` §5. Estava também nas linhas
de registro da §4b e da §16. Nenhum dado usava o par como critério. **Hoje sobra só nas linhas de
registro**, que citam a versão velha de propósito e ganharam a nota da troca.

**O motor, que decide o tamanho: não há filtro por atributo em lugar nenhum.** A penalidade de
ferimento do atacante entra em todo ataque:

- `ajAtq` (`grid.astro`) e `ataqueAtual` (`combate.astro`) somam `tierDe(...)` no `flat` e no `dados`;
- o laço do harness faz o mesmo;
- a ficha não aplica ferimento nenhum.

`armas.json` tem hoje 33 armas: **14 de Força**, 13 de Destreza e 6 de Percepção (os três arcos e as
três bestas, Atirador).

**Tortura:** a tabela das Virtudes (a Convicção resiste "à dor, à tortura e ao desânimo", igual ao
`virtudes.json`), o item Resistir, e mais duas regras que o despacho não listava:
`acoes-resistir.md`, "Dor e tortura: Vontade + Integridade"; e `defesas.md`, a Tortura na Defesa
Mental.

**Firula negativa:** introduzida no teste de Virtude (capítulo III) e no Frenesi (`racas.md`). O
capítulo de Habilidades não a menciona. A Firula Infeliz das Relações Sociais é outra mecânica, e
está no capítulo, no glossário e no G8.

### O tamanho da mudança em mesa: nenhuma

O motor já penalizava todo ataque, inclusive das armas de Força e do tiro. **A §17 alinha o livro ao
que a mesa já fazia.** Nenhum número muda para quem joga. Por isso o motor, o laço e o espelho não
foram tocados, e não há teste em par: não há código novo para provar.

### As três leituras, decididas no meio da rodada

1. **O tiro:** o livro diz que o ataque à distância também sofre a penalidade, e que é a única
   rolagem de Percepção que a dor alcança. O motor fica. O +2 da fúria continua fora do Atirador.
2. **A Firula negativa:** "só no teste de Virtude (e no Frenesi), e não devolve nada", dito onde ela
   é introduzida, com uma frase separando-a da Firula Infeliz das Relações Sociais, que fica. No
   Frenesi, a mesma nota curta.
3. **A tortura:**
   - as duas metades estão numa nota logo abaixo da tabela das Virtudes, no item Resistir e em
     `acoes-resistir.md`, de onde saiu "Vontade + Integridade": a dor do ferro é Vigor + Convicção,
     e aguentar sem falar é a Convicção sozinha no teste de Virtude;
   - a Tortura da Defesa Mental fica como a defesa contra quem interroga, com uma frase ligando as
     duas;
   - **a célula da tabela não mudou.** "Resiste à dor, à tortura e ao desânimo" continua certo, porque
     as duas metades passam pela Convicção, e é o mesmo texto do `virtudes.json` (o dado vence).

### Item 0

O **L103** entrou no tema L, `[ANOTADO]` e sem conserto. O laço do harness não soma ao ataque as
condições nem o porte que a mesa soma, e o espelho concorda só porque as cenas dele não têm nenhum
dos dois.

### A prova

- `npm run validate` exit 0 nos dois commits. `npm run build` exit 0, com 23 capítulos, e os links
  novos saem com o prefixo e com a âncora existindo.
- **O espelho no CI**, lido no `gh run view`:
  - parte 1 (`575be67`, execução 35941091164): "Smoke · test-espelho · success";
  - commit deste relato: o resultado vai na mensagem ao Arquiteto, pelo mesmo caminho.

## PRECISA DE MIM

Nada.

## QUEBROU

Nada.

## BLOQUEADO

Nada. As três leituras que pararam a rodada foram decididas no meio dela.
