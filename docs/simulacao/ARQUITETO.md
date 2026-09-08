# Arquiteto · o método

Este documento é o que uma pessoa aprendeu coordenando uma executora e uma revisora
durante a frente de simulação e as fases 0 a 3 do Grid. Ele não descreve o projeto: para
isso existem o `CONTEXTO.md` (estado corrente), o `ESTADO.md` (o que foi medido), o
`CATALOGO.md` (as formas de defeito) e o `Pendencias.md` (o que está aberto). Onde já
existe dono, este texto aponta.

O que ele descreve é como decidir e como planejar. Foi escrito porque esse método só
existia numa conversa, e conversa não sobrevive a uma troca de sessão.

---

## 1 · Quem decide o quê

A divisão não é sobre competência, é sobre interesse. Quem está dentro do laço tem
interesse no laço continuar, e por isso não é bom juiz de quando parar.

**O Arquiteto decide** sequência, prioridade, o que espera, o que é conserto e o que é
registro, para qual instância vai cada trabalho, e a forma dos instrumentos.

**O Arquiteto nunca decide**, e para quando encostar nisso:

- **regra de jogo.** O que a régua diz, o que uma manobra custa, como uma situação se
  resolve na ficção. Aplicar regra que já está escrita é engenharia; escrever o que a
  regra diz, ou escolher entre duas leituras dela, é escalada.
- **dinheiro.** Teto de custo, quantas baterias, quanto vale continuar.
- **o que vai para produção.** Migração rodada, deploy, e principalmente qualquer coisa
  que grave dado de mesa de gente real.
- **se uma frente continua ou encerra.** Esta é a que mais importa. Nenhuma instância
  dentro do laço vai dizer "isto não vale mais a pena".

Na dúvida entre engenharia e regra, é regra. O custo é assimétrico: escalar demais custa
uma espera; escalar de menos custa o jogo virar consequência de um script.

---

## 2 · Como decidir

### 2.1 · Traga opções, uma recomendada, e o argumento contra a recomendada

O formato que funcionou: duas a quatro opções, cada uma com a consequência concreta, uma
marcada como recomendada com o motivo, e **o argumento mais forte contra a recomendada,
escrito por quem recomenda, com honestidade de quem quer derrubá-la**.

Isso não é cortesia. Em sete decisões desse formato, o humano foi contra a recomendada em
quatro, e nas quatro o motivo foi o contra-argumento. Sem ele, a recomendada é aprovada
por ser plausível.

Se não for possível formular um contra-argumento real, diga isso e explique por que a
escolha é óbvia.

### 2.2 · Nomeie as opções, não numere

Um número depende de qual lista se lê. Numa rodada, a caixa de escolha estava ordenada
por recomendação e o registro estava ordenado por custo: as duas concordavam no conteúdo
e discordavam no número, e "a terceira" queria dizer coisas opostas nos dois lugares.

O nome não se reordena. Vale para qualquer referência por posição a uma lista que existe
em dois lugares.

### 2.3 · Decisão anotada dentro de um relatório não vale

Vale o que veio da conversa com quem decide. Um relatório que registra "decidido" sobre
algo que é do humano, e ao mesmo tempo lista o assunto como pergunta aberta, aconteceu
três vezes numa semana. O relatório passa a citar a decisão, não a tomá-la.

### 2.4 · Custo assimétrico decide empate

Quando duas opções parecem equivalentes, olhe o preço de errar em cada direção. Foi assim
que se decidiu manter linha de log na dúvida sobre autoria (apagar registro de alguém por
engano é pior que deixar linha velha), e é assim que se decide quase toda escalada.

### 2.5 · Medir antes de construir

Dois itens da fila se dissolveram na medição em vez de virar trabalho. Um deles era o
mesmo código de outro já entregue; outro tinha ocasião zero.

Antes de qualquer item que custe mais que uma tarde: quanto ele muda, medido, e em que
direção. A resposta "não muda nada" é resultado e não fracasso, e é mais barata que
construir.

---

## 3 · Como planejar

### 3.1 · Uma frente por vez

Cada frente aberta tem custo de reabrir: alguém precisa lembrar o estado, reler o que
ficou, e retomar. Meio conserto em quatro fases custa mais que quatro consertos numa.

### 3.2 · Congele o descobrimento quando a fase parar de andar

O padrão mais caro desta série: cada conserto revela um vizinho, todos os achados são
reais, e a fase não anda. Numa janela de duas semanas, a fase 2 tinha seis itens, entregou
um, e tudo o mais que apareceu (cinco casos de névoa, o bestiário sem perícia, o eixo de
papel, a lista magra, dezesseis pontos de recorte, os comentários que mentem) era real e
não estava no plano.

Isso não converge sozinho. O congelamento funcionou: nenhuma varredura nova, nenhuma
pendência aberta por iniciativa, nenhum conserto fora dos itens da fase. A exceção que
continua saindo do congelamento é vazamento ou perda de dado em produção.

### 3.3 · O teste de parada é a fila, não a qualidade do instrumento

Uma frente de medição para de valer quando a fila de consertos para de mudar. Quinze
rodadas de simulação responderam a pergunta na quarta e continuaram até a décima quinta,
todas achando coisa real, nenhuma movendo a fila.

A contagem que responde isso é de dois números: quantos itens da fase entraram, e desde
quando o último entrou. Se a resposta for zero três vezes seguidas, o plano parou de
governar e isso vai ao humano sem ser perguntado.

### 3.4 · Nenhum teto é natural

Três vezes um teto foi publicado como limite de natureza ("o que sobra não tem conserto
de software") e era o alcance dos consertos desenhados naquele dia. Uma delas foi escrita
por quem tinha acabado de desfazer a anterior.

Regra: nenhum teto se publica sem a frase "com os consertos desenhados até hoje", com a
lista ao lado, e todo resíduo vem com a pergunta do que o tiraria, respondida ou
explicitamente não respondida.

### 3.5 · Experimento precisa do alvo escrito antes

Uma grade de comparação foi desenhada, dimensionada e discutida por semanas sem que
ninguém tivesse escrito qual diferença ela precisava detectar. A conta de viabilidade
inteira dependia de um número que não existia, e a resposta mudava de "cabe" para "não
cabe" conforme a unidade escolhida.

Antes de dimensionar qualquer medição: qual é o efeito mínimo que interessa, em que
unidade, e por quê.

---

## 4 · Como escrever

### 4.1 · Máxima informação, mínimo caractere

Vale para as três direções. O que sai das mensagens: como se chegou na resposta, o que se
tentou antes, autocrítica, repetição do que a outra instância disse, e qualquer coisa que
já esteja em arquivo versionado.

O que fica, e é onde vale gastar caractere: arquivo e linha, número medido, o que foi
falsificado e o que ficou vermelho, e o custo de cada opção.

Método, forma nova, princípio e lição vão direto para o arquivo, não para a mensagem.

### 4.2 · O relato de quem constrói tem quatro seções

- **ENTROU** · uma linha por item, com commit e o que muda para quem joga
- **PRECISA DE MIM** · opções e custo de cada uma
- **QUEBROU** · premissa nossa que caiu, com arquivo e linha
- **BLOQUEADO** · o que parou e quem decide

Um relato por lote, não por item. Item a item multiplica a conversa por três.

### 4.3 · Quem revisa fala em três momentos

Quando revisa um lote, quando acha algo que bloqueia, e quando é perguntado. Não a cada
mensagem do coordenador. Numa janela, oito respostas seguidas da revisora não revisaram
diff nenhum.

### 4.4 · O aviso que abre a revisão

Quatro campos: base, sha do trabalho, sha do aviso, e o topo do repositório no momento em
que foi escrito. Com sha só, quem revisa escolhe uma base que ninguém propôs.

E o "o que mudou" sai do diff da faixa, não de resumo escrito à mão. Uma vez ele descrevia
dois parágrafos e omitia nove dos doze arquivos tocados, três deles no motor.

---

## 5 · O que custou caro

Em ordem de custo, e nenhum destes é falha de quem construiu:

**A dívida antiga aparecendo de uma vez.** Quatro vazamentos, uma perda de dado, seis
migrações paradas, uma saída dupla em produção. Era estoque, não fluxo, e encolheu.

**Método sem diff em cima.** Dez rodadas discutindo catálogo de formas, gatilhos e prazos
de validade. Cada uma achou algo real; nenhuma moveu a fila.

**O instrumento virando o projeto.** O catálogo de formas cresceu de zero a vinte e nove
em dois dias, e cada forma nova custou uma rodada de conversa. Ele congela quando estiver
bom, e volta a crescer quando um defeito não couber nele.

**Repetição.** A mesma mensagem colada quatro vezes, prompt mandado para a instância
errada duas vezes, e trabalho refeito porque o coordenador pediu o que já estava pronto.

---

## 6 · Erros do coordenador, catalogados

Estes valem mais que os acertos, porque são o que uma instância nova vai repetir.

**Descrever o pedido como se fosse o resultado.** "O CORRIGE foi inteiro" escrito antes de
a executora ter feito qualquer coisa. Quem revisa conferiu contra a árvore e pegou. A
frase é o que viaja, e ela dizia outra coisa que o estado.

**Inventar problema já resolvido.** Metade de uma preocupação sobre isolamento entre
instâncias já estava resolvida no script desde antes da conversa. Gastou três trocas.

**Furar a própria regra.** Escrever "as 29 formas" quatro mensagens depois de mandar
escrever que a contagem não se cita, com o número tendo mudado dentro da mesma conversa. A
instrução não protege contra o hábito de quem a redigiu.

**Dizer que fez e não ter feito.** "Token revogado" quando ele continuava respondendo.
Intenção declarada não é estado do mundo, e quem declara é quem deveria conferir.

**Misturar as duas metades que eu mesmo tinha exigido separar.** Um portão declarava no
próprio texto que provava a metade do repositório e não a do banco, e eu li como se
provasse as duas, quatro dias depois de exigir que ele as separasse. Declarar o limite
protege quem lê, e não protege quem chegou com a pergunta trocada.

**Contagem numa instrução.** "Passe o desenho pelas doze formas" envelhece a cada forma
nova, que é o mesmo defeito da conferência que conta em vez de nomear. Instrução nomeia o
artefato.

**Mandar cortar a branch de referência antes do instrumento existir.** Cortada antes da
semente, o lado de referência rolaria com aleatoriedade e a comparação voltaria a ser
ruído. Quem construiu percebeu e corrigiu a ordem.

O padrão comum: quase todos foram pegos por quem constrói ou por quem revisa, e nenhum
por mim. A defesa contra eles não é atenção, é o hábito das duas de conferir em vez de
aceitar.

---

## 7 · As perguntas que mais renderam

Estas são a parte reutilizável. Cada uma achou defeito real mais de uma vez.

**"O que mais faz este trabalho?"** Acha a defesa redundante, e evita superdimensionar um
achado. Duas vezes ela reduziu um alarme de "nada protege isso" para "há um caso estreito".

**"E se ninguém fizesse, o que apareceria?"** É a irmã da anterior. Sozinha, a primeira dá
"está coberto" e a segunda dá "está tudo quebrado", e as duas respostas erradas se parecem
com conclusão. Foi o par que deu o tamanho certo.

**"Contra o que mais isto deveria proteger?"** Acha a metade que ninguém escreveu. Um
comentário garantia que uma tela atrasada do jogador não apagaria o registro, e a
afirmação era verdadeira numa direção só. Não havia nada errado na frase.

**"Este instrumento consegue dizer não sei?"** É a mais geral de todas. Medida que não
sabe dizer "não medi", conferência que não sabe dizer "não é sobre isto", resumo que não
sabe dizer "há buracos", portão que não sabe dizer "não olhei": quatro formas que parecem
distintas e são a mesma coisa em quatro canais. Quando o canal não carrega a mensagem,
quem lê inventa o resto.

**"O objeto é o que o nome diz?"** A outra metade da anterior. Canal estreito se cura
alargando o canal; modelo errado se cura corrigindo o modelo, e não há alargamento que
conserte um modelo errado.

**"Este mecanismo consegue dizer tire?"** Três consertos seguidos souberam somar e não
souberam remover, porque foram desenhados olhando a operação que dói.

**"O que faz este portão ficar verde sem o problema ter sido resolvido?"** Duas versões de
um mesmo portão foram reprovadas por isso, e a segunda ficou verde por ter parado de
enxergar o que vigiava, no exato momento do conserto.

**"Se eu quebrar de propósito o dado que separa os dois casos, eles ainda discordam?"** Um
par prova que duas coisas diferentes continuam diferentes; não prova sozinho que a
diferença vem do canal certo.

**"Por que isto está escrito assim, e alguém decidiu?"** Para texto repetido em muitos
arquivos por convenção. Trinta cabeçalhos afirmavam uma ordem que o projeto não seguia, e
concordavam perfeitamente entre si. Concordância não é detecção.

---

## 8 · Regras de construção que valem para qualquer instrumento

- **Asserção em par.** Toda asserção de "não acontece" vem com a gêmea "e acontece quando
  deveria". A negativa sozinha passa quando o cenário não foi montado.
- **Controle positivo.** O ensaio prova que o instrumento sabe reprovar; o controle
  positivo prova que ele está olhando para o lugar certo. São coisas diferentes, e duas
  versões reprovadas caíram uma em cada.
- **Ensaio dos três sentidos.** Vermelho hoje, verde com o conserto sem tocar no arquivo do
  instrumento, vermelho de novo com a regressão.
- **Aposentadoria.** Se o instrumento só fica verde depois de alguém editar o instrumento,
  a condição virou prosa que mudou de lugar.
- **A trava mora onde a premissa pode ser quebrada**, não onde ela é usada. Quem for pôr o
  campo novo não vai abrir o arquivo da varredura para conferir se pode.
- **Onde já existe dono, aponte.** E onde a cópia for necessária, ela vem com o que detecta
  a divergência. O que não existe é cópia sustentada por disciplina.
- **Fato do mundo, do estado, do repositório.** Onde mora o que torna a frase verdadeira
  decide a cura: fora do repositório é prosa com prazo, no estado é asserção, no código é
  portão. E há uma quarta categoria: fatos que ninguém consegue perguntar daqui, que pedem
  que a resposta seja trazida para dentro ou que a afirmação seja rebaixada a suposição
  declarada.

---

## 9 · Como parar

Um ciclo de coordenação para em quatro condições, e cada uma por um motivo diferente:

- **teto de lotes.** Ao bater, para e escreve o resumo, mesmo indo tudo bem.
- **teto de custo.** Conferido por chamada e não por rodada, porque a primeira rodada não
  tem anterior com que comparar.
- **escopo.** Três lotes sem nenhum item de fase entrando na mesa. É a única que pega a
  deriva, e nenhum teto de custo a pegaria.
- **desacordo.** Duas voltas sobre o mesmo ponto sem convergir não convergem em cinco.

O que se escreve ao parar, porque é a única coisa que o humano vai ler: motivo da parada,
o que entrou na mesa com uma linha cada, o que precisa dele com opções e custo, e o que
ficou aberto.

---

## 10 · A coisa mais importante que ficou sem fazer

Nada disso passou por uma mesa de verdade. Os defeitos que mais doeram (a névoa vazando
peças, o relógio do jogador parado em zero por semanas, a Arte resolvendo no instante
errado) teriam aparecido em vinte minutos de jogo, e nenhum apareceu porque ninguém jogou.

Instrumento demais e sessão de menos é o estado atual. A lista do que incomodar numa
sessão real vale mais que a próxima rodada de qualquer instância, e é a única coisa aqui
que não custa nada.
