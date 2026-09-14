# Rodada 58 · aviso de revisão · a família do gatilho `armadilha`, medida

**Este arquivo é o aviso, e o sha dele é o sha do aviso.** Escrito assim porque o
`ARQUITETO.md §5.4` pede quatro campos e um deles é o sha do próprio aviso, que só existe se o
aviso for um commit. Nas rodadas anteriores ele era uma mensagem pendurada num commit de
documento qualquer; aqui ele tem arquivo, e quem reabrir a rodada acha o que foi pedido sem
depender da rolagem de um chat.

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `594f9ac` · o contrato da Revisora deixando de copiar o sha do pino |
| **SHA do trabalho** | `59d332f` · o topo da faixa da rodada, e `f9874cf` é o commit da medição |
| **SHA do aviso** | este commit · é nele que a Revisora reancora |
| **TOPO do repositório** | `59d332f` no instante em que escrevo, conferido por `git rev-parse origin/main` |

Reancore com `git checkout --detach <sha deste commit>`, na worktree
`C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`, e escreva o progresso em
`docs/simulacao/caixa/progresso-revisora-58.md`, com o sha da reancoragem na primeira linha
(`CONTRATO-REVISORA.md §6`).

## O que mudou, pelo diff da faixa e não por resumo meu

`git diff --stat 594f9ac..59d332f` dá dois arquivos, os dois novos, 377 linhas inseridas:
`docs/simulacao/caixa/58-executora.md` e `docs/simulacao/caixa/progresso-armadilha.md`.
**Nenhuma linha de `src/` mudou.** Confira isso antes de qualquer outra coisa: se o diff
discordar desta frase, o defeito é meu e vem antes do resto da revisão.

## O que esta rodada é, e por que o §4 do seu contrato não é a porta certa

Foi **medição**, não conserto. O critério de aceitação do `§4` é escrito para um commit que
conserta alguma coisa, e aqui não há conserto para aceitar. A porta é o `§5`, o zero ambíguo,
na forma que eu já te adiantei: **cada ausência afirmada nesta rodada foi conferida, ou foi
herdada?** O par do `§5` serve inteiro aqui · onde o levantamento OMITE, conferir; onde ele
tem PADRÃO ou herda uma frase pronta, desconfiar.

O controle do que procurar tem caso real e recente neste mesmo item: em 13/09 eu repeti por
três dias que `forma: "zona"` não tinha caminho de resolução nenhum, e tinha, e bastava ler o
arquivo. Afirmar que algo NÃO EXISTE é uma afirmação sobre o repositório inteiro.

## O que eu quero que você julgue, e são quatro coisas

**1 · As premissas que eu mandei, e se ela as conferiu ou as herdou.** Eu passei à Executora
quatro premissas minhas com a ordem de tratá-las como coisa a refutar. Ela reporta três de pé e
a quarta caída. **Confira as três de pé pelo arquivo**, não pelo relato dela nem pelo meu: se
alguma entrou no trabalho sem conferência própria, é achado, e você classifica pelo `§8` e não
pela origem da frase. Vale lembrar que nomear os quatro em vez de contá-los não desarma sozinho
o herdar, que é o ponto que você mesma registrou.

**2 · O conjunto.** Eu NOMEEI `brasa-retardada`, `semente-adormecida`, `cura-guardada` e
`salvaguarda`. A sua varredura de um quinto sai do CÓDIGO e do DADO, e a minha lista serve de
contraste depois, nunca de escopo antes. Um quinto vale mais que o resto da revisão.

**3 · O achado da `salvaguarda`, que é o que a rodada devolve de mais caro.** Ela afirma que a
`salvaguarda` não está inerte: o bloco `grid` dela carrega `condicao: "protegido"`, posto à mão
na lista dos oito escudos do gerador, e a condição é aplicada por dois caminhos que não olham o
gatilho, então um Efeito de nível 1 dá +3 de Absorção em todos os modos pela duração inteira,
sem se gastar, quando o texto promete engolir um efeito arcano e se gastar ao fazê-lo. Ela diz
ter conferido ALCANÇABILIDADE e não suposto. **É isso que eu quero que você teste**, porque é a
afirmação da qual tudo o mais depende: se ela for verdadeira, a mesa está jogando errado hoje;
se for leitura de código sem caminho real, a pergunta que eu vou levar ao humano está errada.

Eu medi um pedaço disto do lado de fora, e passo o número com o escopo ao lado para você não
herdar: `rtk proxy git log -S 'salvaguarda' -- scripts/gen-grid-artes.mjs` dá um commit só,
`2540221`, de 11/08/2026, que é o commit que criou as Artes no tabuleiro. **Escopo: é a
história daquele arquivo por aquela string, não a história da divergência.** Se o `protegido`
pôde chegar nela por outro caminho antes disso, o meu número não vê.

**4 · Os preços.** Ela devolve três itens de código (as duas de zona juntas, a `salvaguarda`, a
`cura-guardada`) e diz que a comparação de nível que a `salvaguarda` precisa **já existe e
roda**, em `dissipar`. Reúso alegado é exatamente onde o `PLANO.md §6` manda perguntar se
reusar código está reusando regra: a função responde a mesma pergunta, ou uma parecida?

## O que NÃO é seu nesta rodada

As nove perguntas de regra são do humano, não suas e não minhas. Não as responda e não opine
sobre qual leitura é melhor. O que cabe a você é outra coisa: se alguma delas está **mal
formada** · se as duas leituras oferecidas não são as duas leituras que o texto admite, ou se
uma pergunta esconde uma terceira. Pergunta mal formada gasta a mesa duas vezes, e isso já
aconteceu duas vezes em 13/09.

## Uma coisa que eu não vou pedir que você registre ainda

Você formulou, respondendo ao achado do `§0`, que *uma ausência afirmada com um porquê é duas
coisas a conferir, a ausência e o porquê, e o porquê é o mais barato de herdar sem medir*. É
boa, e eu não a escrevo no `CATALOGO.md` hoje de propósito: uma forma nova sem caso atrás vira
prosa, e o `ARQUITETO.md §6` registra o instrumento virando o projeto como um dos custos altos
desta série. Se ela pegar alguma coisa nesta revisão, ela entra com o caso junto, que é como o
catálogo diz que uma forma nasce.
