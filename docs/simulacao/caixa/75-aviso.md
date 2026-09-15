# Rodada 75 · aviso de revisão · a M-21 no ar, e o limite da morte em metade do PV

**Este arquivo é o aviso, e o sha dele é o sha do aviso.** É nele que a Revisora reancora.

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `206fcef` · a decisão da M-21 escrita no caderno, antes de qualquer código |
| **SHA do trabalho** | `8d2787b` · o topo da faixa. A faixa inteira é `206fcef..8d2787b`, três commits: `6221b4a` (itens 1 a 3), `6200893` e `8d2787b` (o item 4, que é medição) |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | conferido por `git rev-parse origin/main` no instante em que escrevo, e ele está ADIANTE da faixa: `2ac58ef` e `19afbbc` são decisões de mesa que eu commitei DEPOIS, só em `docs/simulacao/caixa/`, e **não são trabalho desta rodada** |

**O que mudou fora da faixa, e não é seu:** `19afbbc` decide as quatro perguntas que a medição
desta rodada levantou, e `2ac58ef` decide a M-24 (a Investida). As duas viram rodada própria. Se
você achar que alguma delas contradiz o que ESTA rodada entregou, isso sim é achado.

## O que a rodada prometeu, em quatro itens

Estava escrito no pedido, e é contra isto que a promessa se mede:

1. o limite da morte vira DADO em `regras.json`, derivável e sem número repetido;
2. o capítulo `vida-ferimentos-cura.md` se reescreve de uma vez, perdendo as duas trilhas, a regra
   velha da morte, a frase do Impacto sarando mais rápido e o exemplo do Bram que conta Letal;
3. um portão prende o texto ao dado, com o ensaio dos três sentidos;
4. o Grid é MEDIDO e não construído.

## O que eu quero que você julgue, e são cinco coisas

**1 · A varredura da palavra que morreu.** A regra velha vivia em mais lugares do que o pedido
nomeava, e ela achou dois por conta própria: a condição `morrendo` em `condicoes.json` ("antes que
o Letal acumulado alcance o PV máximo") e as notas de Sangramento nos dois arquivos. **A pergunta
é se sobrou um terceiro.** Afirmar que não sobrou é afirmação sobre o repositório inteiro, então
faça a sua varredura e não herde a minha nem a dela. O escopo honesto inclui `src/`, `scripts/`,
`supabase/` e os documentos que a mesa lê.

**2 · O alcance que ela estendeu sozinha, e eu quero o seu julgamento sobre ele.** Ela consertou
`combate.md:107-113`, que não era o arquivo nomeado, porque ele classificava Cortante e Perfurante
como "Letal" e apontava o link para o capítulo reescrito. **Eu concordo com o gesto** (publicar a
regra nova com a velha viva a um clique seria publicar a contradição), e o que eu quero saber é
outra coisa: o conserto dela ficou CERTO, ou trocou uma frase errada por outra? `combate.md` é
capítulo publicado e tem leitor.

**3 · O portão, e se ele sabe dizer "não olhei".** Ele mora dentro do `validate-data.mjs` (decisão
dela, para o teste não nascer fora de um dos dois portões), deriva o limite do `limiteDivisor` e
refaz a conta em cima de cada par "PV N morre em −X" que o capítulo publica. Ela relata CINCO
vermelhos com mensagens diferentes, incluindo um controle de OCASIÃO (com PV par os dois
arredondamentos dão a mesma resposta, então a asserção mediria nada). **Refaça pelo menos um dos
cinco**, o que você escolher, e diga se o portão fica verde por não achar ou por ter olhado.

**4 · O achado do item 4 que contradiz a própria rodada 74 dela.** Ela relata que o tique da
condição contínua (`artes-grid-mesa.ts:2104`) chama `gravarVida` sem piso nenhum, e que `curarPv`
só tem teto, então **o Sangramento já escreve Vida negativa hoje**, por acidente. Isso importa
porque a rodada 74 afirmou que a mesa não atravessa o zero em lugar nenhum. **Teste a afirmação**,
que é a mais cara do relatório: se for verdade, a mesa já joga fora da régua velha.

**5 · A medição como medição.** O item 4 era para MEDIR e não construir. Confira que nada foi
construído, e confira o escopo que ela declarou em voz alta (ela mesma o corrigiu no meio,
lembrando que a aba Combate é mesa e tem motor de Vida próprio). **Escopo declarado e escopo
varrido são duas coisas**, e o segundo é o que vale.

## O que NÃO é seu nesta rodada

As quatro perguntas de regra que a medição levantou **já foram decididas pela mesa** em `19afbbc`,
depois do trabalho. Não opine sobre qual leitura é melhor. Se alguma decisão contradisser o que
está no ar agora, isso é achado e entra pelo `§8`.
