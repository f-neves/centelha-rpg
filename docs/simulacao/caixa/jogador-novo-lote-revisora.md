# Revisão do lote das 11 decisões do dossiê (16-17/09/2026)

Reancoragem: `1765fed` (confirmado por `git rev-parse HEAD`, e `git rev-parse --show-toplevel`
bate com `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`).

Base: `eef234e` (rodada 83). Sha do trabalho: `4df5f5b`. Sha do aviso: `1765fed` (mesmo que o
topo). Faixa lida inteira: `eef234e..1765fed`.

Escopo: os 11 itens FEITO em `docs/simulacao/caixa/jogador-novo-decisoes.md`, seção "As 19 do
dossiê", contra a PROMESSA de cada um (`CONTRATO-REVISORA.md §8`) — M-21h, M-17, M-20, M-23,
M-36, M-38, M-16, M-34, M-35, M-40, M-44.

## Etapas

- Reli `CONTRATO-REVISORA.md` inteiro.
- Reli a seção "As 19 do dossiê" completa (offset 2951-3151 de `jogador-novo-decisoes.md`).
- Conferi cada um dos 11 shas marcados FEITO contra `git log eef234e..1765fed`: todos existem,
  todos na faixa, nenhum órfão.
- Diff arquivo a arquivo do lote de trabalho (`eef234e..4df5f5b`) e do commit final de carimbo
  (`4df5f5b..1765fed`).
- `npm run validate` rodado aqui: verde.

## Os 11, um a um

**M-21h (`2492336`) · FEITO, correto.** A confirmação mora no `onclick` de `rs-ok`, antes de
`dlg.close()`, cobrindo exatamente os dois gatilhos prometidos (caixa da Vida sozinha, ou clique
que alcança alguém abaixo do limite de morte). Usa `passouDoLimite` e `uiConfirmar`, os dois já
importados e já usados em outro ponto do mesmo arquivo — não é função nova sem chamador. O
comentário antigo que descrevia a premissa caída foi reescrito para descrever a decisão nova, como
prometido.

**M-17 (`e4fe156`) · FEITO, correto.** `habilidades-secundarias.md` ganhou a frase "não há teto de
quantidade... a trava real é o orçamento de XP", exatamente o texto mandado.

**M-16 (`e4fe156`) · FEITO, correto.** `habilidades-secundarias.json · acerto-arcano` perdeu a
frase "sem ela o feitiço mais devastador do mundo passa a um palmo do inimigo" e ganhou a que nomeia
os efeitos MIRADOS. Bate com a promessa.

**M-20 (`903c99d`) · FEITO, correto, dentro do que foi prometido.** `aparenciaMod(nivel,
mascararCom?)` ganha o parâmetro opcional e a fórmula de redução até o piso zero.
`aparencia-virtudes-vontade.md:16` ganha o parágrafo com o par de rolagem Compostura+Furtividade e
a regra do ponto a ponto. O parâmetro `mascararCom` não é chamado em lugar nenhum hoje (varri
`src/`): mas a promessa da M-20 era só "a função ganha um caminho" + "o capítulo ganha a frase", não
"a ficha aplica a rolagem" — não prometeu UI nova, então não é zero por ausência de mecanismo, é
capacidade escrita para quando a UI existir.

**M-23 + M-38 (`83dcadd`) · FEITO, correto.** `acoes-e-sistema.md` ganhou a tabela dos três eixos
(Tempo/Qualidade/Duração) com exemplo, e as três subseções nomeadas (Trabalho em Grupo, Ajudante,
Teste Coletivo) substituindo o parágrafo antigo de "duas formas". Os números batem com o que a mesa
decidiu (metade da Dificuldade arredondado pra cima, +1 a cada 6; +2 por participante, +1d6 a cada
6 do líder).

**M-36 (`976afa8`) · FEITO, correto.** O exemplo do Lírio cortou a frase "Uma conversa boa sobe 1
passo: ainda Neutro" e a soma dos atos que sobraram fecha em 3 (presente +1, serviço +2), batendo
com a banda decidida.

**M-34 (`f76b00f`) · FEITO, correto.** `regras.json`, tabela de resistências: "vs o nível efetivo
do efeito" virou "vs Dificuldade = nível efetivo do efeito × 5", a fórmula exata da decisão.

**M-40 (`f76b00f`) · FEITO, correto.** `empilhamentoProezas.defesaReflexiva` ganhou a exceção
nomeada (Quebrar Guarda e penalidade imposta por Proeza de outro) fora do teto de ±6, mesma régua
da Pressão, como prometido.

**M-44 (`f76b00f`) · FEITO, correto.** `xp.tecnica.nota` ganhou a frase afirmando que o portão
`Centelha ≥ N` é intencional, com o motivo (marco de história, não XP).

**M-35 (`743cdb1`) · FEITO, com um CORRIGE.** Ver seção própria abaixo — o Dano fixo e a Penalidade
nomeada saíram certos, e o conserto de `dadosDeDano`/`planoAtual` que a Executora achou no caminho
está testado e correto. O que falha é o campo `unidade` da Duração, que ninguém pediu para mudar.

## CORRIGE · M-35, o campo `unidade` da Duração mentiu sobre o que está no array

**O que a rodada prometeu tocar na Duração:** nada. A entrada da decisão diz "Duração: 6 Ticks por
ponto (de Mana investido, presumivelmente — **confirmar com o humano se a unidade de investimento
mudar antes de escrever**)", e o "O que isto manda fazer" da M-35 fala em trocar a escala do Dano
pelos três campos novos — não em mexer no `unidade` da Duração. O próprio commit `743cdb1` afirma:
"A Duração não mudou: já era 6 Ticks por ponto de Mana investido."

**O que o diff mostra:** `src/data/efeitos.json`, Efeito `metal-incandescente`, parâmetro
`Duração`, campo `unidade` foi de `"Ticks"` para `"pontos de Mana"`. O array `escala` continua
exatamente igual: `["1 tick","6 Ticks","12 Ticks","18 Ticks","24 Ticks","30 Ticks","36 Ticks"]` —
valores em Ticks, não em pontos de Mana.

**Por que isso é defeito e não só rótulo.** A convenção do próprio arquivo (conferida em outro
Efeito, o do choque em `efeitos.json:1640`, `unidade: "Ticks"` com escala `["—","—","6
Ticks",...]`) é que `unidade` descreve a unidade dos VALORES dentro de `escala`, não a variável que
indexa o nível. E o código lê os dois campos juntos em dois lugares que o jogador vê:
`src/lib/ficha-engine.ts:664` (popup de hover do Efeito na ficha) e
`src/pages/artes/efeitos.astro:71` (a página pública `/artes/efeitos`) montam
`` `${escala.join(' · ')}${unidade ? ` (${unidade})` : ''}` `` sempre que o parâmetro tem `nota`
preenchida — e a Duração do Metal Incandescente tem. O resultado que aparece nas duas telas é:

> 1 tick · 6 Ticks · 12 Ticks · 18 Ticks · 24 Ticks · 30 Ticks · 36 Ticks **(pontos de Mana)**

Uma lista de valores em Ticks, rotulada como se estivesse em pontos de Mana. Antes do commit, o
mesmo trecho mostrava `(Ticks)` — redundante com o texto do próprio array, mas certo. Agora está
errado, e é o jogador quem lê essa tela, não só o mestre.

**O que consertar:** `src/data/efeitos.json`, `metal-incandescente`, parâmetro `Duração`, campo
`unidade`: devolver para `"Ticks"` (ou remover o campo, já que o `nota` já carrega a frase
completa e os dois lugares que leem `unidade` só o usam quando querem a unidade dos números do
`escala`, que continuam sendo Ticks).

## Achado à parte, não bloqueia: reorganização silenciosa em `Pendencias.md`

O commit `4df5f5b` também moveu as seções `## H. Arremesso`, `## I. Mesa virtual · tempo real` e
`## J. Infraestrutura` de onde estavam (fora de ordem, coladas ao fim do arquivo desde uma rodada
antiga) para a posição alfabética correta, entre G e K. Conferido por comparação de conteúdo
(ordenando as duas versões e comparando): nenhum texto de item mudou além do que as 11 decisões e
o `L102` já explicam — é reordenação pura, sem perda nem alteração de conteúdo. Não está mencionado
na mensagem do commit, que fala só do fechamento dos 11 itens. Não é ESCALA nem CORRIGE (não há
promessa que isso contradiga, e o conteúdo confere), só registro de que um commit descrito como "o
lote das 11 decisões" carregou uma arrumação estrutural não anunciada.

## Veredito

**CORRIGE.** Os 11 itens batem com a promessa de cada um, com a única exceção do rótulo `unidade`
da Duração em `metal-incandescente` (M-35), que ninguém pediu para mudar, contradiz a própria
mensagem do commit que a trouxe, e produz um texto errado nas duas telas onde o jogador lê o
Efeito. Conserto de uma linha em `efeitos.json`; não precisa reabrir nada além dele.

## Conferência do conserto · reancorada em `5f119aa`

`git diff 3538388..5f119aa` mostra só a linha esperada: `unidade` de `metal-incandescente ·
Duração` voltou de `"pontos de Mana"` para `"Ticks"`, nada mais no commit. O array `escala`
continua igual (valores em Ticks), então a leitura conjunta escala+unidade em
`ficha-engine.ts:664` e `efeitos.astro:71` volta a mostrar `(Ticks)`, correto e sem redundância
nova. `npm run validate` rodado aqui: verde.

Sobre a reordenação H/I/J: registrado que não foi intencional, e a Executora anotou o hábito de
conferir o diff antes de commitar. Sem promessa contradita e sem perda de conteúdo (já conferido
acima), não muda o veredito.

**VEREDITO FINAL: PROCEDE.** O lote das 11 decisões (M-21h, M-17, M-20, M-23, M-36, M-38, M-16,
M-34, M-35, M-40, M-44) está correto contra a promessa de cada item, com o CORRIGE da M-35 já
aplicado e conferido.
