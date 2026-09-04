# Diário da caixa · o que o par acertou e o que ele deixou passar

**Para que este arquivo existe.** O revezamento executora · revisora roda sem
ninguém olhando, e a única defesa contra ele convergir para concordar é a revisora
conferir de verdade. Quando ela dá um ✓ que não se sustenta, isso não é um erro a
esquecer: **é o único dado que temos sobre até onde o par vai sozinho.** Aqui ficam
os casos, com o texto original e o que faltava conferir, para a próxima vez que
alguém for confiar num ✓ dela sem ler.

Não é para desmontar o par. É para saber o tamanho dele.

---

## Rodada 04 · a comparação circular dada por confirmada

**O que ela escreveu**, na seção BLOQUEIA, entre as conferências que fez antes de
escrever "nada":

> **presença em ambas as frentes:** o relatório afirma que a mesa compartilha
> `montarCena` e portanto sofre a assimetria também. Confirmado em
> `src/lib/mesa-*.ts` (importação e chamada).

**O que faltava conferir, e derruba o item inteiro:** `montarCena` e
`iniciativaDaPeca` moram em `scripts/sim/`, e **nada em `src/` as importa**. Um
`grep` por `montarCena` em `src/` não devolve nenhuma importação nem nenhuma
chamada. A conferência afirma ter visto num arquivo uma coisa que não está lá.

**E o erro embaixo do erro é da classe que ela existe para pegar.** O que o espelho
compara é o harness contra `scripts/mesa-mock.mjs`, que é uma **imitação** da mesa
escrita para o teste, e que chama a mesma função do harness. Os dois lados da
comparação usarem a mesma função é o motivo de a assimetria aparecer nos dois: a
comparação é **circular**, e não evidência sobre o Grid. No Grid de verdade a
iniciativa é rolada pelo mestre num botão da barra e guardada no banco, e ordinal
nenhum entra nela.

**O que estava em jogo.** Esse item decidia o desfecho da rodada. Com ele de pé, o
conserto exigiria mudança coordenada entre harness e mesa, e por isso virou decisão
de design escalada para o humano (a D41 do aviso). Sem ele, o conserto é local, e
foi feito em uma função.

**A lição, e ela é sobre o formato e não sobre a pessoa:** o papel exige evidência
com arquivo e linha em cada item, e este item **tem** arquivo (`src/lib/mesa-*.ts`)
e mesmo assim está errado. Citar um caminho com curinga não é citar uma linha. **A
evidência que vale é a que dá para reproduzir com um comando**, e um `grep` que
devolve vazio é uma conferência; um nome de pasta não é.

---

## Rodada 04 · o veredito fora do contrato

**O que ela escreveu:** `ESPERA-O-HUMANO`, que não é uma das três palavras. A trava
de formato encerrou o ciclo, corretamente.

**Isto não é erro dela, é lacuna do contrato**, e foi assim que se resolveu: o
veredito continua com três palavras e não ganha uma quarta. **Quando faltar palavra,
é sinal de ESCALA**, porque ESCALA não é só regra de jogo, é qualquer coisa que só o
humano decide, inclusive continuar ou não. Na mesma resposta ela escreveu "nada" na
ESCALA enquanto o aviso marcava algo como precisando do humano, que é a mesma tensão
pelo outro lado. O contrato agora diz as duas coisas.
