# A CONJURAÇÃO COM PREPARAÇÃO · a régua

**O que este documento é:** a regra escrita, para ser implementada. Nasceu de uma descrição de
COMPORTAMENTO de mesa, feita pelo humano em 10/09/2026 depois de uma batalha, e foi passada por
um levantamento do que já existe antes de virar regra
(`docs/simulacao/caixa/levantamento-conjuracao.md`, sha `86b657c`).

**Por que o levantamento veio antes:** a descrição usava palavras de mesa, e metade delas já são
termos do sistema com implementação atrás. Escrever a régua sem conferir isso inventaria
vocabulário paralelo ao que existe, que é um defeito que este projeto já pagou caro.

**O que este documento NÃO é:** não é implementação, e não é decisão fechada em tudo. O que está
em aberto está marcado como aberto, com o nome de quem decide.

---

## 0 · O fato que decide o tamanho de tudo

**A conjuração de uma Arte pelo jogador é SÍNCRONA hoje.** `conjurar()`
(`src/lib/artes-grid-mesa.ts:789-837` · `function conjurar`) abre a caixa, posiciona a figura, paga a Mana e declara o
custo em Ticks · tudo no mesmo instante, num `finally` só. **Não existe hoje o estado "em Preparo,
esperando o Tick de saída" para Arte lançada pela interface.**

Isso muda o enquadramento inteiro: **esta régua não ajusta um número num mecanismo que já espera.
Ela abre um estado que o motor não tem.** O estado existe para o ataque físico (a escada
Preparo/Golpe/Recuperação de arma) e para o ataque de criatura que o bestiário rotula como
conjuração, e nunca para a Arte que o jogador monta na caixa.

**A consequência prática, e ela é boa:** a fórmula do tempo já está escrita e não é chamada de
lugar nenhum (`reguaDaArte`, `src/lib/combate-tempo.ts:270-274`). Não é preciso inventá-la, é
preciso ligá-la.

### O aviso que atravessa esta régua inteira

**"Já existe" pode querer dizer duas coisas muito diferentes**, e o levantamento achou o padrão
**três vezes** em pontos distintos: `reguaDaArte` (fórmula em dados e em código, sem chamador), o
teste de concentração (regra publicada, sem código), e `arcano.composta` (texto publicado, e no
código só um comentário que o cita). **Regra publicada e nunca chamada não é mecanismo pronto: é
texto.**

**Por isso toda linha desta régua que diz "já existe" diz também EM QUE NÍVEL existe** · em dados,
em código, ou só publicado. Quem implementar não pode ler "já existe" como "é só usar", e a
Revisora recomendou conferir isso peça por peça antes de escrever a primeira linha. A
recomendação está aceita e é parte da régua.

---

## 1 · O vocabulário, e ele não é novo

**Regra de escrita desta régua: onde o sistema já tem nome, o nome do sistema vence.** A descrição
do humano e o motor concordam em quase tudo; onde as palavras diferem, aqui fica o par.

| o que o humano chamou | o nome que já existe | onde |
|---|---|---|
| Efeito (Improviso) | **Improviso** · `plano.efeito === null` | `regras.json:arcano.improviso`, `artes-grid-ui.ts:182` (`null = improviso`) |
| Efeito Especial | **Efeito**, do catálogo, com `nivel` fixo | `src/data/efeitos.json`, `artes-grid.ts:23-33` (`interface Efeito`) |
| Parâmetro | **Parâmetro**, com graus de 0 a 6 | `artes-grid.ts:35-45` (`interface Parametro`), `regras.json:arcano.improviso.graus` |
| os Parâmetros declarados | **`Escolhas`**, o mapa nome→grau | `artes-grid.ts:229`, vivo só durante a caixa |
| NÍVEL do Efeito | **nível efetivo** | `gravarEfeito`, `artes-grid-mesa.ts:1376` (`function gravarEfeito`) |

**O "Nível = o maior Parâmetro declarado" JÁ EXISTE, ao pé da letra.** `gravarEfeito` calcula
`Math.max` sobre os graus investidos quando não há Efeito comprado, e chama isso de **nível
efetivo**. E há uma segunda confirmação publicada: `regras.json:arcano.composta.regra` diz que "o
nível efetivo para gating é o maior componente; os Ticks seguem a escada do maior nível". A régua
nova reusa esse nome e essa fórmula, e não inventa um terceiro.

### A armadilha que esta régua tem de preservar

**Existem DOIS números chamados "nível", e eles não são o mesmo número.**

| para quê | qual conta | onde está |
|---|---|---|
| **quanto CUSTA** (Mana) | a **SOMA** dos graus investidos | `artes-grid.ts:231-235` (`interface Custo`) e `regras.astro:382` (`Some os níveis investidos`) |
| **quanto DEMORA** (Preparação) e o gating | o **MÁXIMO** · o nível efetivo | `artes-grid-mesa.ts:1401-1404`, `arcano.composta` |

Isto não é contradição, é uma distinção que o sistema já tem. **Toda linha desta régua diz qual
dos dois está usando.** Confundi-los é o erro mais provável da implementação, e ele sai como
número plausível.

---

## 2 · O fluxo

### 2.1 Declaração

O personagem escolhe a ação. Sendo Arte, escolhe o Efeito (um Efeito do catálogo ou Improviso) e
declara os Parâmetros.

**O que fica FIXO na declaração é o NÍVEL EFETIVO, e ele é um TETO.** A distribuição exata dos
Parâmetros e o formato da figura não precisam estar decididos ainda.

**DECISÃO MINHA, D-C1 · o teto é o nível efetivo, e não a lista de Parâmetros.** A descrição do
humano diz que o Nível fica fixo e a distribuição não. Escrevo isso como: nenhum Parâmetro pode,
no Golpe, estar acima do nível efetivo declarado, e qualquer distribuição abaixo disso é válida.
**O custo:** duas conjurações com o mesmo nível efetivo e somas de Mana muito diferentes ficam
indistinguíveis na declaração, e quem olha o tabuleiro não sabe o que vem. É o preço de deixar a
distribuição aberta, que foi o que o humano pediu.

**E O D-C1 NÃO TEM BURACO, corrigido em 10/09/2026 pelo humano, porque quem ler o §1 vai fazer
esta pergunta.** Declarar nível efetivo 3 **não** libera distribuir 3 em todos os Parâmetros de
graça. **Cada grau de cada Parâmetro é pago**, e a conta já existe (`custoDe`,
`src/lib/artes-grid.ts:250-268` · `function custoDe`): o custo é a SOMA dos graus, com dois descontos · um pela
**Centelha**, que abate do total, e outro pelo **material consumido**. Passar do nível de maestria
num Parâmetro ainda multiplica o custo dele.

**A Mana é o freio, e não há segundo teto.** O nível efetivo declarado limita a ALTURA de cada
Parâmetro; a Mana limita quantos deles você pode subir. Não é preciso inventar uma trava de
"quantos Parâmetros no teto", e inventá-la seria número novo sem régua.

**O teto por autodeclaração não existe no motor hoje, em lugar nenhum**, e a Revisora conferiu
isso com firmeza, não como "não achei". O que existe é outro conceito, o teto por **maestria**
(`regras.json:arcano.improviso.tetoPorParametro`): nenhum Parâmetro passa do nível que o
personagem TEM na Arte. **Os dois tetos convivem e são cumulativos:** o da maestria é o que o
personagem pode; o da declaração é o que ele se comprometeu a fazer neste gesto.

### 2.2 A Preparação

**Duração: `Preparo = 2 + nível efetivo`, em Ticks.**

**A escala existente vence, por instrução explícita do humano.** Ele descreveu "cada Nível a mais
custa um Tick a mais" e mandou conferir contra o que existe. O que existe é
`regras.json:2441-2444` · `preparoBase: 2, preparoPorNivel: 1`, consumido por `reguaDaArte`. **O
incremento bate; a base 2 é o que a descrição não menciona.** Fica a base 2, porque a instrução foi
"se a escala já estiver definida em outro lugar, vale a que existe", e porque ela já está publicada
no site (`src/pages/artes/regras.astro:305-322` · `A Arte sai no último Tick`, a Arte sai no ÚLTIMO Tick da montagem).

**A Arte sai no ÚLTIMO Tick, e esse Tick é o GOLPE.** É a §5.3 do Arcano, já no ar, e a régua nova
não a toca.

#### Deslocamento durante a Preparação

**Quem está em Preparação de Arte anda em CAMINHADA, e isso é automático.** Se a peça está com a
ação de magia e o mestre manda deslocar, o deslocamento sai como caminhada, sem perguntar o modo.
Para usar Deslocamento de Batalha ou Corrida, é preciso interromper a Preparação.

**Isto é estado NOVO, e não a regra de hoje.** Hoje quem está comprometido com um gesto não vê
nem a caixa de modo: `moverSimultaneo` (`grid.astro:6232` · `function moverSimultaneo`) desvia direto para um
posicionamento cru, e a regra publicada para quem se mexe fora da vez no meio de um gesto é o
**desvio de emergência**, a 1 Tick por metro (`src/content/chapters/combate.md:181-184`).

**DECISÃO MINHA, D-C2 · a Preparação de Arte NÃO é o desvio de emergência.** Quem prepara uma Arte
tem uma terceira coisa: anda em caminhada, pelo preço normal de caminhar, sem pagar 1 Tick por
metro e sem sair da Preparação. **Por quê:** o desvio de emergência existe porque o corpo que
está no meio de um golpe físico não tem tempo na mão; quem monta uma Arte tem o gesto todo pela
frente e a descrição do humano diz explicitamente que ele pode se deslocar. **O custo:** são duas
regras de movimento durante gesto onde hoje há uma, e quem implementar precisa distinguir "gesto
físico" de "Preparação de Arte" em todo lugar que hoje pergunta só `faseEm(...) !== 'livre'`.
**Se você preferir uma regra só, esta é a decisão a derrubar**, e ela é sua.

**Existe precedente para forçar modo sem perguntar**, e vale citar porque é o mecanismo que a
implementação vai reusar: a fuga automática de criatura já monta o movimento com `modo: 'corrida'`
direto, sem diálogo (`grid.astro:6165` · `modo: 'corrida'`).

#### Interromper por vontade própria

**Não custa Mana, porque a Mana só é paga no Tick do Golpe.** Custa os Ticks já investidos na
Preparação, que se perdem.

**O Abortar já existe, publicado e implementado**, e é ele que se estende: `regras.json:2497-2508`
· só na fase de Preparo, custa 1 Tick por metro para a saída, e **perde o investido**
(`perdeOInvestido: true`). O código é `podeAbortar`/`abrirAbortar` e o botão "✋ Abortar o gesto"
(`grid.astro:7708` · `Abortar o gesto`).

**O que muda:** hoje o Abortar serve só a ação física, e a lista `nuncaPara: "atacar"` o proíbe
para ataque. **A Preparação de Arte entra como fase abortável**, com a mesma regra de perder o
investido, e sem custo de Mana porque não houve pagamento.

### 2.3 O Golpe

**No último Tick, o Parâmetros reabrem.**

O personagem pode **baixar** qualquer Parâmetro. Não pode pôr nenhum acima do nível efetivo
declarado. **O tempo de Preparação já gasto não muda**, seja qual for o nível que saia.

**Uma precisão que a descrição do humano junta e a régua tem de separar.** Ele escreveu que baixar
Parâmetros "pode baixar o Nível e economizar Mana". São dois efeitos diferentes, por causa da
armadilha do §1:

- **baixar um Parâmetro economiza Mana sempre**, porque a Mana é a SOMA;
- **baixar o nível efetivo (o MÁXIMO) não devolve tempo nenhum**, porque a Preparação já foi paga.

Ou seja: **abaixar o Nível, por si, não compra nada.** O que compra é abaixar os graus. O Nível no
Golpe importa só para o gating do Efeito · o que a Arte consegue fazer.

**A Mana é paga aqui, no Golpe, e não na declaração.**

**Isto é sequência nova, e não um "quando" mudado.** Hoje `gastarMana` é chamada no mesmo `finally`
da conjuração (`artes-grid-mesa.ts:834` · `ctx.gastarMana`). **Não existe hoje um intervalo em que a Mana esteja
comprometida e ainda não gasta**, e é esse intervalo que a régua cria.

**Mana insuficiente no Golpe:**

- **Mana zerada: a magia falha.** O gesto se perde, os Ticks de Preparação se perderam.
- **Mana parcial: o JOGADOR escolhe** como distribuir os Parâmetros dentro do que a Mana alcança,
  respeitando o teto declarado. É escolha dele, e não do motor, e não do mestre.

**Tudo que acontece no Tick do GOLPE acontece junto e não pode mais ser interrompido.** Golpe de
espada, Arte saindo, qualquer coisa. Esta frase não é só da magia · ela é a fronteira entre esta
régua e a ordem de resolução dentro do Tick (`Pendencias.md` L1, N4 e N5), e as duas têm de ser
escritas com ela igual dos dois lados.

---

## 3 · A interrupção por ação externa

### 3.1 O modal, e quem decide

**Qualquer ação que afete o conjurador durante a Preparação abre um modal avisando que ela está em
risco.** Golpe, empurrão, efeito em área, alguém que se joga contra ele, chão que se abre.

**Destes, só o chão que se abre espera a fase 4.** Todo o resto é golpe, empurrão e efeito em área,
que o motor já resolve hoje · esta seção inteira é implementável sem esperar frente nenhuma, e a
única exceção é o terreno (ver §5).

**Quem decide se interrompe é o MESTRE, não o motor.** O modal oferece opções para ele escolher, e
algumas com campo livre para descrever, e o que ele escrever entra no registro.

**O modal abre por padrão.** Existe um botão na aba Tempo para o mestre desligar os modais enquanto
quiser: desliga tudo, e ele religa quando quiser. Simples, sem granularidade.

**Onde isso mora, e o precedente já existe:** "não me pergunte" não existe hoje em nenhuma forma.
O que existe é o **Tempo da mesa**, que já é configuração persistida POR MESA e não por navegador
· `combateDaMesa` (`grid.astro:2869`), o botão `#gr-tempo` e `abrirEscolhaDoTempo`
(`src/lib/mesa-tempo-ui.ts`). O botão novo entra ao lado, no mesmo lugar e no mesmo mecanismo de
persistência, sem inventar armazenamento.

### 3.2 O teste

**O teste é por TICK, e não por ataque.** Se várias coisas atingem o conjurador no mesmo Tick, é
**um teste só**, com a dificuldade aumentada pela quantidade de dano sofrido no Tick.

**O teste é reusado, e não inventado:** `regras.json:arcano.tempo` →
`improviso.combinacoes.concentracao.aoSofrerDano` · **Vontade + Acerto Arcano** para segurar;
falhando, cai. Está publicado em `src/pages/artes/regras.astro:151` (`concentracao.aoSofrerDano`).

**Três ressalvas honestas sobre esse reuso:**

1. **Ele é regra publicada e não código.** A segunda passada do levantamento conferiu: o teste de
   concentração **também não tem implementação em `src/`**, e `abortarGesto` só é chamado por
   clique explícito, nunca a partir da resolução de dano. **Não existe hoje, rodando no motor,
   nenhum teste para não perder um gesto por ter sido atingido** · nem o genérico, nem o de
   sustentar. Reusar aqui é escrever o primeiro.
2. **O escopo de hoje é outro.** O teste publicado é para SUSTENTAR um efeito por concentração (o
   Jorro que continua), não para segurar uma montagem. Estender o mesmo teste à Preparação é
   decisão, não leitura.
3. **A escala pelo dano estava explicitamente em aberto, e esta régua a fecha.** O próprio dado
   marca `concentracao.aRevisar`: "a dificuldade do teste (fixa ou crescendo com o tamanho do
   golpe)". **A resposta do humano é: cresce com o dano.** Quem implementar atualiza esse
   `aRevisar` no mesmo commit, porque deixar a pergunta aberta ao lado da resposta é como se perde
   uma decisão.

**A curva exata da dificuldade contra o dano NÃO está decidida**, e não a invento aqui. É número, e
número desta régua sai da mesa ou de medição, não da minha cabeça. **Fica com o humano, e ele
confirmou em 10/09/2026 que continua com ele e que não decide agora. É o único número que falta
para este §3.2 fechar** · todo o resto dele está decidido.

**Golpe absorvido, dano zero: não pede teste, mas o modal abre mesmo assim**, porque a decisão é do
mestre e ele pode querer interromper por ficção mesmo sem dano.

### 3.3 As condições que derrubam a Preparação sem teste

**Condição que torna impossível continuar não pede teste: a Preparação simplesmente cai.**

**O critério é a pergunta, e não a lista:** *ele tem chance de continuar depois da condição?* Se
não, não há teste.

**E aqui a régua encontra uma discordância que precisa ser resolvida na implementação.** O humano
deu como exemplos imobilizado, adormecido, incapacitado e desmaiado. O motor tem um campo que
responde a uma pergunta PARECIDA e não igual: `foraDeCombate`, em `src/data/condicoes.json`,
marcado em quatro condições · `inconsciente`, `morrendo`, `estabilizado`, `morto`.

**`imobilizado` NÃO tem a marca, e não a tem de propósito:** quem está preso tem chance de voltar a
agir depois de solto, que é exatamente a distinção que o critério do humano descreve. Pelo critério
dele, portanto, **imobilizado não derruba a Preparação**, ainda que apareça na lista de exemplos.

**DECISÃO MINHA, D-C3 · o critério vence a lista, porque o humano disse que vence.** E daí sai uma
consequência que é trabalho: **`foraDeCombate` não serve como resposta, porque responde outra
pergunta.** "Está fora da luta" e "não consegue continuar ESTA montagem" são coisas diferentes ·
alguém agarrado continua fora de combate falso e pode muito bem não conseguir conjurar. **Precisa
de uma marca própria na condição**, respondendo ao critério, e as 55 condições precisam ser
triadas por ela. **O custo:** é uma passada por 55 entradas com julgamento em cada uma, e não uma
linha de código. **Respondido em 10/09/2026: a triagem é do humano**, e a Executora só extrai a
tabela com a coluna vazia · ver §4.2, incluindo a proibição de pré-preencher com `foraDeCombate`.

**E não achamos hoje código que cancele um gesto em andamento quando a condição chega.** A Revisora
registrou isso como "não achei" e não como "não existe", porque não esgotou todos os caminhos de
aplicação de condição. Quem implementar confere antes de escrever.

---

## 4 · O que esta régua NÃO decide

**Respondido pelo humano em 10/09/2026.** Dois fecharam, dois seguem abertos, e nenhum deles abre
implementação · a régua continua parada até ele mandar.

### 4.1 · A curva da dificuldade contra o dano · ABERTA, e é dele

Continua com o humano, que confirmou não decidir agora. **É o único número que falta para o §3.2
fechar.** Todo o resto daquela seção está decidido: o teste é por Tick e não por ataque, é um só
quando várias coisas atingem no mesmo Tick, reusa Vontade + Acerto Arcano, e cresce com o dano. Só
a curva falta.

### 4.2 · A triagem das 55 condições · FECHADA no método, e a decisão é dele

**A decisão é do humano; o trabalho braçal não.** A Executora extrai as 55 numa tabela com três
colunas: **nome da condição, o texto dela, e uma coluna em branco.** O humano preenche a terceira.

**Duas restrições explícitas, e a segunda é a que importa:** não se pede julgamento à Executora, e
**`foraDeCombate` não entra como palpite inicial.** A coluna nasce vazia. O motivo, nas palavras
dele: com um palpite na coluna, ele lê o palpite em vez de decidir. É a mesma razão pela qual
`foraDeCombate` não serve como resposta (o `D-C3` acima) · ela responde outra pergunta, e sugeri-la
contamina a triagem inteira.

### 4.3 · O `D-C2` FICA DE PÉ · fechada

**A Preparação de Arte tem movimento próprio: caminhada, pelo preço normal, sem sair da
Preparação.** Não cai no desvio de emergência.

**O motivo, e ele é de jogo:** a 1 Tick por metro o conjurador não se mexe. A Preparação viraria
ficar parado esperando, que é o oposto do que dá jogo à espera. Uma espera em que se pode andar é
uma decisão; uma espera em que não se pode é uma contagem.

**O custo fica registrado, e é o que eu mesmo escrevi ao propor:** quem implementar tem de
distinguir **gesto físico** de **Preparação de Arte** em todo lugar que hoje pergunta só se a fase
é livre (`faseEm(acaoNo(c), T) !== 'livre'`). São duas regras de movimento durante gesto onde hoje
há uma, e o ponto onde isso é decidido não é único.

### 4.4 · Abaixar o nível efetivo · FECHADA, e a pergunta era outra

**Abaixar o nível efetivo não compra nada, e está certo assim.** O que se comprou foi tempo, e o
tempo já passou. Quem economiza Mana é quem baixa GRAU, porque a Mana é a soma. Baixar o nível
efetivo é situacional: significa que o plano mudou, e o custo em Ticks já foi pago.

**A pergunta que eu tinha escrito aqui estava mal formulada**, e o humano a reescreveu como a que
importa: **se o gating não punir Nível alto, baixar o nível efetivo no Golpe é gesto sem função, e
a interface estaria oferecendo uma escolha vazia.**

**O que o gating faz hoje com o nível efetivo, levantado em 10/09/2026:**

- **o `nivel` gravado na linha do efeito É LIDO, e num lugar só:** `dissipar`
  (`src/lib/artes-grid-mesa.ts:1011`) · `const alcanca = (e.nivel || 1) <= meu;`. Um efeito de
  nível N só pode ser dissipado por quem investiu pelo menos N pontos na Dissipar. Quem não
  alcança recebe recusa com o motivo escrito no registro;
- **portanto o gesto NÃO é vazio.** Baixar o nível efetivo no Golpe **torna o próprio efeito mais
  fácil de dissipar**. É uma consequência real, e negativa para quem conjura · o que faz dela um
  motivo para NÃO baixar, e não um prêmio por baixar;
- **e o resto do gating não olha para ele.** O que filtra quais Efeitos o personagem pode escolher
  é o `nivelArte`, a maestria da ficha (`efeitosDisponiveis`, `artes-grid.ts:321`), e o que
  encarece Parâmetro acima da maestria também é o `nivelArte` (`custoDe`, `artes-grid.ts:250`).
  Nenhum dos dois enxerga o nível efetivo da conjuração.

**Uma coisa achada de passagem que quem implementar precisa saber:** o `dissipar` compara
`e.nivel` (que é o MÁXIMO) contra `plano.custo.total` (que é a SOMA). **É a armadilha do §1 viva em
código de produção**, comparando os dois números que não são o mesmo. Não é escopo desta régua
consertar, mas quem tocar o nível efetivo passa por ali.

**Fica com o humano:** com o gating fazendo só isso, a escolha de baixar o nível efetivo é
oferecida na interface ou é só consequência automática de baixar graus? Ele decide.

---

## 5 · O que fica pendente e depende de outra frente

- **Só a interrupção por TERRENO depende da fase 4** (chão que se abre, ponte que desmorona), que
  não começou. Registrado nos dois lugares, aqui e no `Pendencias.md`.

  **Corrigido em 10/09/2026, e a correção é do humano:** a versão anterior desta linha dizia que a
  interrupção por ação externa dependia da fase 4, e isso fazia a régua nascer bloqueada numa parte
  que é implementável hoje. **"Alguém que se joga contra ele" e "explosão perto" não dependem de
  nada** · são golpe, empurrão e efeito em área, que o motor já tem. Eles estão na mesma frase do
  §3.1 e seguem por ele, sem esperar fase nenhuma. O que espera é o terreno, e só ele.
- **Criaturas que se teleportam ou se deslocam por baixo da terra** não seguem o caminho normal, e
  isso toca esta régua **e** o item do corpo a corpo. → `Pendencias.md` `L69`, e por ele `L67`.
- **A ordem de resolução dentro do Tick** (`Pendencias.md` `L1`, N4 e N5) é a outra metade da
  frase "tudo no Tick do Golpe acontece junto". As duas régua não podem ser escritas em
  desacordo, e a de lá ainda tem duas discordâncias abertas com o humano.

---

## 6 · O tamanho, para quem for implementar

Nesta ordem, e nenhuma parte começa antes de o humano aprovar a régua.

| # | o que é | onde | tamanho |
|---|---|---|---|
| 1 | ligar `reguaDaArte` ao fluxo real | `artes-grid-mesa.ts`, `conjurar()` | a fórmula existe e está morta · é chamada, não escrita |
| 2 | abrir o estado "Arte em Preparo" | `conjurar()` deixa de ser síncrona | **é o grosso do trabalho**, e é estado novo no motor |
| 3 | a Mana sair da declaração para o Golpe | `artes-grid-mesa.ts:834` (`ctx.gastarMana`) | pequeno, e perigoso: é onde o gasto pode sumir |
| 4 | a reabertura dos Parâmetros no Golpe | caixa nova, com o teto | médio |
| 5 | caminhada automática na Preparação | `moverSimultaneo` | pequeno, se `D-C2` ficar de pé |
| 6 | o Abortar aceitar Preparação de Arte | `podeAbortar` e a lista `nuncaPara` | pequeno |
| 7 | o modal de risco e o botão da aba Tempo | `mesa-tempo-ui.ts`, ao lado do Tempo | médio, e o precedente de persistência já existe |
| 8 | a marca nova nas condições e a triagem das 55 | `condicoes.json` | pequeno em código, longo em julgamento |
| 9 | o teste de Vontade + Acerto Arcano rodando de verdade | onde o dano é resolvido | **é o primeiro**, e não a extensão de um que já rode |

**Antes do passo 1, um passo zero:** conferir, peça por peça, se o que esta régua chama de "já
existe" existe em código ou só em texto. Três das peças citadas aqui são texto publicado sem
chamador, e a régua diz quais são.
