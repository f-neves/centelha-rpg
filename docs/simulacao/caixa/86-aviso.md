# Rodada 86 · aviso de revisão · as correções da 85, e o item 9 no `regras.json`

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `099d50b` · o despacho da 86, que é o commit imediatamente anterior ao trabalho |
| **SHA do trabalho** | `08bf455` · a faixa é `099d50b..08bf455`, **dez commits, e só sete são dela** |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `08bf455`, conferido por `git rev-parse origin/main` ao escrever |

**Três commits da faixa são meus e não são o lote**, e digo para você não gastar tempo procurando
dono: `c38f909` (as três decisões do humano sobre o Antecedente, registro), `e7fefd7` (o conserto
da colisão de numeração no seu contrato, mais 27 travessões) e `08bf455` (a Vontade da Sora na
especificação, que era a fonte do erro que você achou).

## O que mudou na faixa, pelo diff e não pelo relato

`git diff --stat 099d50b..08bf455` devolve catorze arquivos. Os sete do lote dela:

| arquivo | precisa de revisão? |
|---|---|
| `src/data/regras.json` | **sim**, é o item 9, o miolo desta rodada |
| `src/content/chapters/relacoes-sociais.md` | sim, os seis consertos do capítulo |
| `src/content/chapters/qual-sistema.md` | sim, o fluxograma do roteador |
| `src/pages/mestre.astro` | sim, a página que o Mestre abre em sessão |
| `src/content/chapters/acoes-e-sistema.md` e `acoes-sentidos-e-engano.md` | sim, as referências penduradas |
| `src/data/diagramas.json` | **sim, e é o mais estranho da rodada** (ver abaixo) |
| `docs/pendencias/*`, `Pendencias.md` | os `E9`, `E10`, `J9` e o placar |

## O que o lote faz

É a sua própria lista de CORRIGE da rodada 85, executada, mais o item 9 (o `regras.json`), que
estava fora do seu escopo naquela rodada e entra nesta. O despacho é `86-despacho.md` (`099d50b`),
e ele agrupa por urgência, não por lugar: o **grupo A** (`qual-sistema.md` e `mestre.astro`) foi
commitado sozinho e empurrado primeiro porque publicava em produção a regra que a 85 revogou.

Ela entregou em sete commits e fechou o deploy por leitura e não por suposição
(`gh run list` dá `success` para `08236a8`).

## O que eu quero que você julgue

Nomeados, não contados.

**O `regras.json` contra o capítulo, nos dois sentidos, e é a metade que a 85 não teve.** O bloco
`social` grava no dado a mesma regra que o capítulo publica em prosa. Refaça a comparação chave por
chave, e nas duas direções: que nenhum número do dado contradiz o capítulo, e que nenhum número do
capítulo foi gravado errado. Ela afirma no relato que a divergência restante é **ausência e não
contradição** (o capítulo tem números que o bloco não carrega); confira se é mesmo ausência.

**As duas emendas que eu mandei aplicar nos DOIS lados.** A frase dos "8 a 24 vezes" (falsa no
salto minuto → hora, que é 60) e a palavra "lábia" na lista do que acumula. A instrução foi
explícita: entram no `regras.json` já corrigidas ou não entram, porque um erro no capítulo é um
erro e o mesmo erro no dado é a fonte da verdade afirmando-o. Confira os dois lados.

**A dívida que eu assumi por escrito ao decidir, e quero saber o tamanho dela.** Decidi que o
bloco `regua` mora no dado mesmo sem nenhum consumidor em código, e comprei com isso duas listas
que precisam concordar sem detector. A Executora já nomeou uma consequência
(`passosParaRomperNeutro: 3` agora tem dois lugares para mudar, e o `E3` é a decisão de trocá-lo).
**Não julgue a decisão, que é minha:** meça quantos números passaram a existir em dois lugares, e
diga se algum deles já está divergente hoje.

**`src/data/diagramas.json`, e este é o achado dela que mais me interessa.** É cache dos
fluxogramas desenhados no build, com chave de hash do mermaid, e o `validate` roda
`gen-mermaid.mjs --check`. Ela mediu com **controle negativo** (rodou sem mudar fonte nenhuma) que
o gerador reescreve **6 de 6** entradas com bytes diferentes e texto idêntico, e que o `--check`
compara só a chave, então fica verde. O commit `16377fa` carrega cinco redesenhos que ninguém
pediu. Ela registrou como `J9` e não abriu trabalho. **O que eu quero de você:** que o texto
publicado dos cinco diagramas intocados é mesmo idêntico, conferido por você e não pela afirmação
dela, e que o desenho novo do roteador diz a regra certa.

**A conferência dela que fechou pela metade, e ela mesma reabriu.** No item 8 (a tensão de redação)
ela conferiu procurando o literal "já carrega", que existia em duas das três linhas; a terceira
(`:140`, "o número passivo da ficha") dizia o mesmo com outras palavras e passou. Consertada em
`34e98a2`. **Procure a quarta**, pela afirmação e não pelo literal.

**O `item 12`, que eu pedi por nome e não por contagem.** Ela devolveu: `curta` = orc, meio-orc ·
`padrao` = humano, meio-elfo · `longa` = anão, gnomo, halfling · `muito-longa` = elfo, nenhuma das
oito de fora. E achou que `longevidade` é `.optional()` no schema (`validate-data.mjs:66`), então
raça nova pode nascer sem o campo e cair fora das quatro faixas sem portão reclamar. Confira as
duas coisas contra o `racas.json`.

## O que está fora do seu escopo nesta rodada

- **`antecedentes.md`, `E4` a `E8`** · regra de jogo, na mesa do humano. Três decisões dele já
  saíram e estão em `87-despacho.md` (`c38f909`), que **não está aberto**;
- **os 23 travessões do `regras.json`**, todos anteriores a esta rodada, seis deles células de
  tabela que só contêm o caractere. Ela perguntou e eu segurei: seis são marcador semântico e não
  prosa, e mexer em dado publicado por isso precisa da palavra do humano. Está na lista dele;
- **o meu `e7fefd7`**, que mexeu no seu contrato. Se a renumeração ou os 27 travessões atrapalharem
  alguma citação sua, diga, mas não é trabalho desta rodada.

## O de sempre

Veredito em `docs/simulacao/caixa/86-revisora.md`, commitado por você com pathspec e empurrado
antes de avisar. Me diga o sha e o `git rev-list --count origin/main..HEAD`. Progresso incremental
em `progresso-revisora-86.md`, uma linha por etapa, hora lida da máquina no instante em que fecha.

**Uma árvore suja que não é sua nem minha:** `docs/simulacao/caixa/jogador-novo-bestiario.md`, não
rastreado, de uma sessão fora do arranjo. Não encoste.
