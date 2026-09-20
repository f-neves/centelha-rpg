# Rodada 85 · aviso de revisão · o ritmo de mover a Régua de Relação

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `18ee12e` · a última emenda da especificação, escrita antes de o trabalho entrar |
| **SHA do trabalho** | `057b339` · a faixa é `18ee12e..057b339`, três commits, os três dela |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `057b339`, conferido por `git rev-parse origin/main` ao escrever |

## Uma coisa fora do comum, e ela muda o peso do seu veredito

**Este lote foi commitado e empurrado antes de existir revisão, e o deploy é automático.**
O capítulo reescrito já está no ar desde 19/09/2026 pela manhã. O erro de sequência é meu e não
dela: eu não abri aviso no dia. Não há o que segurar, então um BLOQUEIA aqui não impede nada de
publicar · ele vira um commit de conserto. Diga assim mesmo, com o mesmo peso de sempre: o que
muda é a pressa, não o julgamento.

## O que mudou na faixa, pelo diff e não pelo relato

`git diff --stat 18ee12e..057b339` devolve quatro arquivos:

| arquivo | de quem | precisa de revisão? |
|---|---|---|
| `src/content/chapters/relacoes-sociais.md` | Executora | **sim**, é o lote (152 linhas) |
| `docs/pendencias/E-social-mental-antecedentes.md` | Executora | sim, são os E4 a E8 que ela abriu |
| `Pendencias.md` | Executora | o placar do índice |
| `docs/simulacao/caixa/85-executora.md` | Executora | é o relato dela, não o lote |

**`src/data/regras.json` NÃO foi tocado**, e isso é de propósito: o despacho pediu proposta antes
de execução, e a proposta é a última seção do `85-executora.md`. Ela está comigo, não com você.

## O que o lote faz

A fonte única dele é `docs/simulacao/caixa/ritmo-da-regua.md` (commit `92ee772`, emendado em
`18ee12e`), que carrega os quatro itens decididos com o humano em 18 e 19/09/2026.

A decisão central: **a cena com dados deixa de mover a régua.** Conversa e Combate Social passam a
render **alcance do pedido** (+1 nível por 6 de folga, só naquela cena) e nada mais. Quem move a
régua são os **atos** (passo fixo, sem rolagem) e o **cortejo com calma**. Isso colapsa em um só os
três lugares que o capítulo antigo tinha para mover a régua.

Os quatro itens, em uma linha cada:

1. **o tempo é a moeda, sem teto de bônus**: escala parada em ×1, `Tempo do passo = máx(1, defesa
   parada − ataque parado − gestos)`. O limite emerge do piso de 1, não é decretado;
2. **o intervalo é 8 dias**, multiplicado por ½, 1, 2 ou 4 pela longevidade de quem corteja. A
   escada de seis degraus sai, com o motivo escrito no capítulo;
3. **a fronteira ato/gesto**: as linhas ±1 saem da tabela de atos e viram gesto que acumula, com
   teto de vidro ±2. A Antipatia passa a se alcançar por acúmulo;
4. **a resistência do alvo**: `1 + [máx(0, excedente) ÷ 6]` de Vontade por intervalo, com a Vontade
   **presa** enquanto o cortejo durar. O item 4 fechou na opção A, contra a minha recomendação, com
   o contra comprado por escrito: a regra fica dormente contra alvo forte.

## O que eu quero que você julgue

Nomeados, não contados.

**AS CONTAS, refeitas por você e não conferidas contra esta lista.** O capítulo publica números em
seis lugares: a tabela de Defesa parada (cinco linhas), as jornadas do Nêmesis (27/45/63/81), o
trade de dinheiro (81 → 42 → 25), a tabela de quantos intervalos a Vontade compra (vinte células),
o exemplo do mediano contra a Vesna (4 e 2 intervalos) e o exemplo dos três gestos de +4 num passo
de 15. Refaça cada um pela fórmula **publicada no capítulo**, não pela da especificação, e diga
quais fecham. A tabela de Defesa parada tem uma conferência a mais: as bases "com dado" de Kael,
Sora e Vesna são números publicados em outro lugar, e a Defesa parada só fecha se a relação entre
as duas escalas for a que o capítulo afirma.

**A PROMESSA DESTA RODADA, que é o que separa CORRIGE de ESCALA.** Ela afirma, no `85-executora.md`
às 10:12, que o capítulo **publica só o número que se reconstrói pela fórmula**, e por isso deixou
de fora a linha "Neutro → +2 Apreço" (que a especificação trazia como 10/22/34 e a fórmula dá
15/27/39), registrando a divergência como `E4`. Confira que não sobrou nenhum outro número
irreconstruível no capítulo. Um que sobrou é falsificação direta da promessa da rodada.

**A DECISÃO CENTRAL VALENDO NO CAPÍTULO INTEIRO, e não só nas seções reescritas.** "A cena com
dados não move a régua" precisa ser verdade em toda seção, inclusive nas que o lote não tocou.
Ela diz às 10:36 ter consertado três contradições de borda no caminho (a história empurrando o
dado, o favor alugado, a abertura do capítulo). Procure a quarta.

**UMA TENSÃO DE REDAÇÃO QUE EU ACHEI LENDO, e quero saber se é minha ou do texto.** O Combate
Social chama a Defesa Social de "o número passivo da ficha", e três parágrafos abaixo diz que
"essa Defesa já carrega o peso da história entre vocês". O termo da régua é **por relação**, contra
quem se fala, e por decisão da rodada 84 não está na ficha nem vira código. As duas frases podem
estar dizendo coisas compatíveis e me parecerem incompatíveis; diga qual é o caso.

**O QUE O LOTE DEIXOU CONTRADIZENDO FORA DELE.** Um eu já conheço e é meu: `acoes.longevidadeFirula`
no `regras.json` continua afirmando o deslocamento de degrau que o item 2 derrubou, e pela regra da
casa (o JSON vence, o capítulo se corrige) quem lê o dado hoje lê o modelo morto. Está no item 9 da
proposta e eu decido. O que eu quero de você é o que eu **não** sei: outro capítulo, o
`glossario.json`, os personagens publicados, qualquer lugar que o lote deixou apontando para a regra
velha.

**O TRAVESSÃO, e ele tem um buraco conhecido de cobertura.** O `test-travessao-capitulos.mjs` só
cobre `src/content/**`, então o capítulo está coberto por portão. Os documentos desta rodada
(`85-executora.md`, `E-social-mental-antecedentes.md`, `ritmo-da-regua.md`) **não** estão, e
dependem de conferência à mão. Não varra com `git diff`: o hook encolhe a saída. Leia os arquivos.

## O que está fora do seu escopo nesta rodada

- **o item 9** (onde os números novos moram no `regras.json`): proposta não executada, decisão minha;
- **a escala de Firula deste capítulo (0/+1/+2/+4) contra a canônica do `habilidades.md`**: é um
  C-item anterior a esta conversa, já registrado, e misturá-lo aqui alargaria a rodada;
- **os dois arquivos não rastreados na árvore do repositório principal**
  (`caixa/analise-aparencia.md`, `caixa/jogador-novo-bestiario.md`): não são deste lote, e um deles
  é de outra frente. Não encoste.

## O de sempre

O veredito mora em `docs/simulacao/caixa/85-revisora.md`, commitado por você com pathspec. Depois de
commitar, me diga o sha **e** se ele já saiu da sua máquina
(`git rev-list --count origin/main..HEAD`): commit em `HEAD` destacado que não chegou ao `origin`
já ficou órfão duas vezes neste projeto. O progresso incremental vai em
`docs/simulacao/caixa/progresso-revisora-85.md`, uma linha por etapa, com a hora lida da máquina no
instante em que a etapa fecha.
