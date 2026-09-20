# Rodada 86 · veredito da Revisora

Reancorada em `4e56aa8` (o sha do aviso), conferido por `git rev-parse HEAD` e
`git rev-parse --show-toplevel` na worktree `centelha-techlead-revisora`, com `git status --short`
limpo. Base `099d50b`, trabalho `08bf455`.

**A faixa tem 11 commits, e o aviso diz dez.** `git rev-list --count 099d50b..08bf455` devolve
**11**. Enumerados: `16377fa`, `fd4497d`, `d56dfa1`, `c38f909`, `e7fefd7`, `6509801`, `f85b09e`,
`08236a8`, `34e98a2`, `0cd062d`, `08bf455`. Três são seus, como o aviso diz, e **oito são dela**,
não sete. Nada muda com isso, e eu só percebi porque enumerei em vez de aceitar o número, que é a
forma "a contagem que vira condição de parada do outro" · a mesma que você me ensinou pelo nome na
abertura da 85. O relato dela tem a irmã: diz "**Cinco** commits, todos empurrados" (`:6`) e a
tabela logo abaixo lista **seis**.

---

## 1 · As dez correções da rodada 85, uma a uma

Refiz a conferência contra a minha própria lista de `CORRIGE`, lendo o arquivo e não o relato.

| o que a 85 pediu | onde | está? |
|---|---|---|
| `Sora (9, 7)` → `(9, 8)` e as quatro células | `:255` | ✓ `Sora (9, 8)`, `8 \| 8 \| 8 \| 8` |
| "cada degrau ... entre 8 e 24 vezes" | `:215` | ✓ "os saltos entre **os degraus que caberiam aqui** multiplicam de 8 a 24 vezes cada um" |
| a palavra "lábia" | `:106` | ✓ "(gesto e cortejo)" |
| o verbo "furar" | `:262` | ✓ "**O cortejo** não concede pedido" |
| "atos (saltos fixos, de ±2 a −5)" | `:271` | ✓ "+2 e +3 a seu favor, de −2 a −5 contra você" |
| o fluxograma do roteador | `qual-sistema.md:73`, `:74` | ✓ as duas caixas dizem "a Régua não anda", mais uma linha nova nomeando quem move |
| "dia a dia = Régua (jogada única)" | `qual-sistema.md:111` | ✓ reescrita inteira |
| "o resultado move a régua" | `mestre.astro:207` | ✓ |
| Acumulada/Longa do cortejo | `acoes-sentidos-e-engano.md:100` | ✓ |
| "o cortejo longo" e a palavra "período" | `acoes-e-sistema.md:144`, `:152` | ✓ as duas |
| a ESCALA, as três linhas do "já carrega" | `:140`, `:145`, `:274` | ✓ as três |

**A conferência da aritmética eu refiz também**, porque a linha da Sora mudou quatro células: com
Vontade 8 e custo 1 em todas as colunas, `8 / 8 / 8 / 8` é o valor certo, e a frase do `:258`
("empata em todas as colunas") continua verdadeira, porque o excedente do cortesão contra ela é 5 e
não chega a 6. As outras dezesseis células não foram tocadas e continuam fechando.

**As duas emendas estão nos DOIS lados, conferidas separadamente:**

- **"8 a 24":** capítulo `:215` e `acoes.longevidadeFirula.nota` trazem a **mesma** restrição,
  palavra por palavra ("os saltos entre os degraus que caberiam aqui").
- **"lábia":** não está no capítulo (`:106` diz "gesto e cortejo") nem em
  `social.regua.tetoDeVidroNota` (que diz "gesto e cortejo"). Busquei a palavra no `src/` inteiro:
  fora de contextos alheios, zero.

---

## 2 · O `regras.json` contra o capítulo, chave por chave, nas duas direções

Extraí **todo** valor numérico e booleano dos blocos `social` e `acoes` por caminho, com um
percurso da árvore, em vez de ler o diff a olho. São **20**, e os vinte batem.

### Sentido 1 · o dado contra o capítulo

| chave | valor | onde o capítulo diz |
|---|---:|---|
| `social.regua.min` / `.max` | −6 / 6 | `:20`, e a Folha `:270` |
| `social.regua.passosParaRomperNeutro` | 3 | `:102`, `:120`, `:271` |
| `social.regua.tetoDeVidro` | 2 | `:106`, `:262`, `:271` |
| `social.regua.esfriaPassosPorEstacao` | 1 | `:112`, `:271` |
| `social.modoRapido.alcancePorMargem` | 1 | `:80`, `:272` |
| `social.modoDevagar.multDefesa` | 1 | `:182` (fórmula sem ×2), justificada em `:188` |
| `social.modoDevagar.centelhaMult` | 1 | `:182` |
| `social.modoDevagar.centelhaSoNaDefesa` | `true` | `:188`, "a Centelha só entra de um lado, o de quem resiste" |
| `social.modoDevagar.pisoTempoDoPasso` | 1 | `:184` (`máx(1, …)`) e `:186` |
| `social.modoDevagar.gestosPorIntervalo` | 1 | `:230` |
| `...resistencia.custoBase` | 1 | `:242` |
| `...resistencia.divisorExcedente` | 6 | `:242`, `:244` |
| `...resistencia.excedenteComPisoZero` | `true` | `:242` (`máx(0, …)`), `:244` |
| `...resistencia.vontadePresa` | `true` | `:246` |
| `acoes.longevidadeFirula.intervaloBaseDias` | 8 | `:204` |
| `...porFaixa.*.multiplicador` | 0,5 / 1 / 2 / 4 | `:208-211` |

**Zero contradições.** E o `dias` que saiu do `porFaixa` se reconstrói: 8 × 0,5 / 1 / 2 / 4 dá
4 / 8 / 16 / 32, a coluna "Intervalo" do capítulo, célula a célula. **Tirar o `dias` foi a escolha
certa** e vale dito, porque é a única redução de dívida da rodada: quatro números que existiriam em
dois lugares passaram a ser derivados de um.

### Sentido 2 · o capítulo contra o dado, e a afirmação de "ausência e não contradição"

Ela está certa, e testei o modo como a frase poderia estar errada: uma "ausência" que na verdade é
um número gravado com outro valor. Enumerei o que o capítulo publica e o bloco não carrega: a
escala dos gestos (0/+1/+2/+4 e a Firula Infeliz simétrica), os saltos dos atos (+2, +3, −2 a −5),
a tabela de "Pedir as coisas", os treze nomes da régua, o passo que o favor cobrado desce, o custo
`1 + Margem` do Combate Social, o Peso de +0 a +3, a Iniciativa social, as três Velocidades
(5/6/7), e as tabelas de exemplo (Defesa parada e o elenco de atacantes). **Nenhum deles aparece no
`social` com outro valor. É ausência.**

**Um que eu fui checar de propósito, porque parecia meia-gravação:** o `alcancePorMargem: 1` grava
o "+1 nível" e não grava o "por 6 de folga". Procurei um dono numérico para esse 6 no `regras.json`
inteiro e **não existe em lugar nenhum do arquivo**: a Margem é prosa em `arcano.resistencia.margem`
e nos capítulos. Então a ausência aqui é a mesma que o resto do dado já pratica, e não um buraco
novo desta rodada. A `social.nota` diz "+1 nível por 6 de folga" em prosa, e o bloco fica
autoconsistente por ela.

---

## 3 · O tamanho da dívida que você comprou

Você pediu a medida e não o julgamento, e é o que está aqui.

**Vinte valores passaram a existir em dois lugares editáveis** (a prosa do capítulo e o
`regras.json`). Quinze são novos, do bloco `social`; os outros cinco (`intervaloBaseDias` e os
quatro multiplicadores) já eram duas listas antes desta rodada, no modelo da M-09 · o que a rodada
fez com eles foi tirar a divergência, não a duplicação.

**Mais quatro cópias escritas dentro das próprias notas do bloco novo**, que a contagem por chave
não pega:

- `multDefesaNota` escreve "1 e não **2**" · o 2 é `derivados.defesaSocial.mult`;
- `vontadePresaNota` escreve "a Vontade se recompõe a **1** por noite" e "o intervalo tem **8** dias
  ou mais" · são `recuperacaoVontade.quantoPorSono` e `longevidadeFirula.intervaloBaseDias`;
- `social.nota` escreve "+**1** nível por **6** de folga".

**Nenhuma das vinte e quatro está divergente hoje**, conferido uma a uma, nas duas direções.

**O `E3` é pior do que "dois lugares", e é o caso que mede a dívida de verdade.** Os três passos do
Neutro estão em **quatro** lugares do capítulo (`:102`, `:120` no callout do Lírio, `:264` no
callout do Nêmesis, `:271` na Folha) mais o `regras.json`: **cinco**. Uma decisão do `E3` que troque
3 por 5 tem cinco lugares para mudar e zero detector, e dois deles são callouts cujas contas
mudariam junto (o Lírio "fica a um passo", o Nêmesis "o meio largo de três passos é da subida").

**E há um lugar onde a dívida foi desenhada para fora, que vale como padrão:** a `modoDevagar.nota`
escreve as fórmulas citando **as próprias chaves pelo nome** (`multDefesa`, `centelhaMult`,
`pisoTempoDoPasso`) em vez de copiar os valores, e a `vontadePresaNota` cita
`recuperacaoVontade.quantoPorSono` pelo nome. É o "onde já existe dono, aponte" do `ARQUITETO.md
§5.5`, aplicado dentro do JSON. As outras três notas copiam o número ao lado do nome, e é aí que as
quatro cópias acima nascem.

---

## 4 · `src/data/diagramas.json`, conferido por mim

**A medição dela está certa em todas as três metades, e eu refiz cada uma.**

**As chaves:** seis antes, seis depois; saiu `e1e8bd2d4cf6`, entrou `b1176116625b`. As cinco que
ficaram têm bytes diferentes, e eu medi o quanto: `70258→70272`, `71668→71678`, `62559→62504`,
`60835→60862`, `61385→61372`.

**O texto:** extraí o conteúdo visível das cinco (tirando o bloco `<style>` e todas as tags,
normalizando espaço) e comparei antigo contra novo. **Idêntico nas cinco**, 622 / 826 / 368 / 341 /
273 caracteres. Fui além em uma delas para saber o que muda: o bloco `<style>` é idêntico byte a
byte, o `viewBox` é idêntico, a quantidade de números é **a mesma** (3.262 dos dois lados), e a
diferença está fora do `<style>`. É churn de formatação de ponto flutuante na geometria, não
conteúdo.

**O mecanismo, que eu li no código e não infiri do sintoma:** `gen-mermaid.mjs:87` monta
`id: hash(fonte)`, o sha1 dos doze primeiros hex do **código mermaid**; e o `--check`
(`:95-105`) compara só `faltam` (bloco sem desenho) e `sobram` (desenho órfão). **Ele nunca lê o
SVG.** Então a garantia que ele dá é "todo bloco tem desenho e nenhum desenho é órfão", que é
verdadeira, e não é "os desenhos estão em dia com a fonte". É a forma "a garantia correta sobre o
eixo errado" do `CATALOGO`, e o `J9` está classificado certo.

**O desenho novo diz a regra certa.** Extraí o texto do `b1176116625b` e as duas caixas dizem, em
tantas palavras: "Jogada única: Ataque Social vs Defesa Social compra alcance do pedido (+1 nível a
cada 6 de folga), só naquela cena; a Régua não anda" e "Combate Social: ... Cede e o pedido chega
Margem níveis acima, só naquela cena; a Régua não anda". Bate palavra por palavra com a fonte em
`qual-sistema.md:73-74`.

---

## 5 · A quarta afirmação, procurada pela afirmação e não pelo literal

Ela achou a terceira do jeito certo e escreveu por que tinha errado. Segui a instrução: em vez de
procurar "já carrega", listei **todas** as vinte menções de "Defesa Social" e "Defesa parada" no
capítulo e julguei uma a uma.

### A quarta é `:260`, na leitura do cortejo

> você rola **Perspicácia + Empatia** contra a Defesa Social dele (**a com dado, a da ficha**)

O parêntese põe duas distinções diferentes como se fossem uma. "A com dado" opõe-se a "a parada", e
é o eixo do ×2. "A da ficha" opõe-se a "a da ficha mais o termo", e é exatamente o eixo que o
`34e98a2` acabou de separar cinco parágrafos antes, onde o `:145` agora diz "o número da ficha é um
só, e a mesa soma em cima dele o termo".

**As duas leituras são defeituosas, e eu não sei qual é a pretendida:**

- **se a leitura usa mesmo o número cru**, há uma razão para isso (ler não é aquecer nem esfriar, e
  o termo é definido por "remar contra ou a favor", que pressupõe direção), mas o capítulo nunca a
  diz, e o parêntese apresenta "a da ficha" como **sinônimo** de "a com dado" em vez de como
  **exceção** àquela regra;
- **se a leitura carrega o termo**, como o `:128` sugere ao dizer que a Defesa Social cobre
  "influência (te mover) e leitura (te ler)", o parêntese está simplesmente errado.

Custa uma oração nos dois casos, e é regra de jogo pequena mas é regra: decide o número contra o
qual se rola.

### E uma quinta, fora do capítulo, onde dois arquivos de dado discordam

`glossario.json`, verbete `defesa-social`:

> Muro passivo contra a influência e a leitura social: (Compostura + Sociabilidade) × 2 + Centelha,
> mais a Especialidade **quando o escopo nomeado dela se aplicar**, mais o termo de história da
> Régua de Relação (soma ou subtrai o nível, conforme o ataque aquece ou esfria o vínculo).

Repare na assimetria dentro da própria frase: a Especialidade ganha a cláusula que a marca como
condicional, e o termo entra na lista sem nenhuma. E o vizinho dele no outro arquivo de dado,
`regras.json → derivados.defesaSocial.reguaNota`, diz o contrário em tantas palavras: *"É
situacional e por relação (quem é o alvo, contra quem), então **não entra no número parado que a
ficha imprime; entra por cima, como a Especialidade acima**."*

**Os dois arquivos de dado do mesmo repositório afirmam coisas diferentes sobre o mesmo número**, e
o do `regras.json` é o certo. O efeito prático: quem ler o glossário põe o termo dentro da Defesa
Social da ficha, e a ficha imprime sem ele.

Classifico as duas como `CORRIGE` porque a rodada promete, por escrito, ter fechado o item 8, e a
afirmação sobrevive em dois lugares. Mas digo o que as separa: o `:260` é o mesmo arquivo e a mesma
varredura que produziu as três; o `glossario.json` é arquivo que esta rodada não abriu, e talvez
caiba melhor junto do `E9`, que é da mesma família (cláusula velha viva num arquivo de dado).

---

## 6 · O CI está vermelho, e o relato o declara verde citando a execução errada

**O que o relato diz** (`86-executora.md:21-24`): *"O deploy está no ar, e isto é lido e não
suposto ... O workflow `Validar dados e regras` aparece `in_progress` nos disparos mais recentes e
o último que fechou (`d56dfa1`) fechou em **success**."*

**O que `gh run list` devolve agora**, lido por mim:

| execução | sha | resultado |
|---|---|---|
| a última que FECHOU | `f85b09e` | **failure** |
| a anterior que fechou | `6509801` | **failure** |
| `e7fefd7`, `c38f909`, `d56dfa1` | | success |
| `fd4497d` | | **failure** |
| `16377fa` | | success |

O `d56dfa1` não é a última que fechou: fecharam **cinco** depois dele, e duas em falha. E o
`fd4497d`, que fechou em falha, é **anterior** ao `d56dfa1` que o relato cita como referência.

**O job que falha é o mesmo nas duas**, conferido por `gh run view --json jobs`: `Smoke · test-grid`,
com duas asserções · *"a peça saiu do lugar"* e *"mover custa de 2 a 7 idas ao banco (foram 0)"*. É
o smoke de navegador do Grid, da frente da mesa.

**A falha não é desta rodada, e isto é medido e não suposto.** Desde 09-20T22:26, dez execuções
fecharam e **cinco** falharam, e as falhas caem em commits que não tocam `src/` nenhum: `b22129f`
(o meu veredito da 85), `099d50b` (o seu despacho) e `f85b09e` (as três pendências). Um commit só de
`docs/` não pode quebrar o validador de dados. E as quatro execuções de 09-19, na faixa da rodada
85, fecharam **todas** em success. **Não investiguei a causa**, e não vou oferecer uma: é a frente
da mesa e é fora do meu escopo aqui.

**O que é desta rodada é a frase.** O relato declara o estado do CI com a marca "isto é lido e não
suposto", e a leitura escolhida não é a mais recente; a mais recente estava vermelha. Pelo `§8`, um
achado que contradiz o que a rodada afirma é conserto da rodada · então **`CORRIGE` a afirmação** e
**`ESCALA` a instabilidade**.

**O deploy, esse está bom, e eu confirmei em vez de herdar.** O relato observa honestamente que o
`34e98a2` foi empurrado depois de ele ser escrito, e o `34e98a2` **toca `src/`**, então a leitura
dela não cobria o último commit de código. Conferido agora: `Deploy site (GitHub Pages)` para
`4e56aa8`, que contém o `34e98a2`, fechou em **completed success**. O que está no ar é o estado
corrigido.

---

## 7 · O item 12, e um erro meu que ela achou

**As quatro faixas contra o `racas.json`, conferidas por mim e por nome:** o campo `longevidade` das
oito raças dá `curta` = orc, meio-orc · `padrao` = humano, meio-elfo · `longa` = anão, gnomo,
halfling · `muito-longa` = elfo. **Nenhuma das oito fica de fora, e nenhuma faixa fica vazia.** E o
`.optional()` é real: `scripts/validate-data.mjs:66` marca `longevidade` como opcional, então raça
nova nasce sem o campo e cai fora das quatro sem portão nenhum reclamar. A observação dela está
certa nas duas metades.

**O erro é meu, e ela está certa sobre o fato.** A Vontade 8 da Sora está em
`criacao-de-personagem.md:117`, e eu citei `:118` (que é a linha da Aparência). E o meu `:113` para
"Compostura 3, Sociabilidade 3, Centelha 3" aponta para **uma** das três: a Sociabilidade está no
`:113` (Habilidades), a Compostura no `:112` (Atributos) e a Centelha no `:119`. Citação de uma
linha para uma premissa de três é citação pela metade, e é minha.

**O diagnóstico dela, porém, está errado, e cai numa linha.** Ela escreve: *"A diferença é da
worktree congelada da Revisora."* Não é. `git diff --quiet 03e5274 4e56aa8 --
src/content/chapters/criacao-de-personagem.md` passa: **o arquivo é byte a byte idêntico nas duas
árvores**, e as linhas 117 e 123 são as mesmas nas duas. Conferi as quatro linhas nos dois shas, uma
por uma, antes de escrever isto. Foi erro meu de contagem, e não da árvore.

Digo porque é a forma que o `CONTRATO-REVISORA.md` me ensinou na rodada 45 e vale nos dois sentidos:
**causa provável não testada é pior do que "não investigado"**, porque um erro atribuído à worktree
congelada fica no registro afirmando que o arranjo tem um defeito que ele não tem, e a próxima
citação errada de alguém ganha uma desculpa pronta.

---

## 8 · O `E9` é um achado dela sobre uma falha minha, e a falha é a segunda da mesma família

`regras.json → aparencia.nota` carrega, dentro de si, a cláusula do Antecedente que a rodada 87 vai
derrubar no capítulo: *"separado da pilha situacional dos Antecedentes (**que só move a Régua de
Relação, teto +6**)"*. É a frase do `antecedentes.md:72-74` do meu veredito da 85, escrita no dado.

**Por que a minha varredura não a alcançou, e é preciso dizer o mecanismo.** Na rodada 85 eu corrigi
uma absolvição feita com uma palavra só e refiz a varredura. A refeita rodou em
`src/content/chapters/`, `src/pages/` e `src/lib/` · e **deixou `src/data/` de fora**. A varredura
larga anterior, que incluía `src/` inteiro, teve a saída truncada por tamanho e eu li só a prévia,
que não chegava até lá. Ou seja: **eu consertei o recorte de PADRÃO e mantive um recorte de
DIRETÓRIO**, e não disse no veredito qual era.

São duas na mesma família em duas rodadas, e o que elas têm em comum não é distração: é eu declarar
o resultado de uma varredura sem declarar o recorte dela junto. **A regra que eu recebi na abertura
("diga o ESCOPO junto do número") cobre exatamente isto**, e nas duas vezes eu dei o número e não o
escopo. Nesta rodada escrevi o recorte de cada varredura ao lado de cada resultado, inclusive
quando ele é o repositório inteiro.

A decisão sobre o `E9` é sua e do humano, e ela está certa em não ter consertado: é a mesma regra de
jogo que você tirou desta rodada.

---

## 9 · Portões, travessão e placar

**Portões locais, nesta worktree:** `npm run validate` **exit 0**, e
`npx astro sync && npx tsc --noEmit` **exit 0**. (O `validate` local não roda o `Smoke · test-grid`
do CI, que é o job da §6.)

**Travessão (U+2014), contado com Python arquivo a arquivo, e não com `git diff`:** zero em
`relacoes-sociais.md`, `qual-sistema.md`, `acoes-e-sistema.md`, `acoes-sentidos-e-engano.md`,
`mestre.astro`, `86-executora.md`, `86-despacho.md`, `E-social-mental-antecedentes.md`,
`J-infraestrutura.md`, `Pendencias.md` e `CONTRATO-REVISORA.md`. O `regras.json` tem **23**, todos
anteriores a esta rodada, e **nenhum deles está no que esta rodada escreveu**: serializei os blocos
`social` e `acoes` sozinhos e contei **zero**. Estão na sua lista e eu não encosto.

**Placar, recontado por mim pelas caixas:** o arquivo E tem 10 itens (E1 fechado, E2 a E10 abertos)
e a linha diz **10 / 9 / 1** ✓; o J tem 9 (J1 e J5 fechados) e a linha diz **9 / 7 / 2** ✓. E as
três colunas somam: 247, 171 e 76, conferidos somando as doze linhas. O `247 = 171 + 76` também
fecha.

**E o placar já andou desde o meu pino, então digo o delta em vez de deixar a conferência
envelhecer calada.** A primeira conferência do `§10` do contrato (o que chegou toca o que eu
julguei?) **disparou**: entre `4e56aa8` e o `origin/main` de agora entraram `2215cfc` (abre o
`J10`, os 23 travessões do `regras.json`) e `fb9310c` (marca o que caiu da M-09, que é o `E10`), e
o `2215cfc` mexe em dois arquivos que eu acabei de recontar. Medi antes de decidir: a linha do J
vai de `9 / 7 / 2` para `10 / 8 / 2` e o total de `247 / 171 / 76` para `248 / 172 / 76`, que é o
`J10` somado certo nos dois lugares. **Nenhum achado meu muda**, porque o que chegou toca uma
verificação datada e não uma conclusão · os três `CORRIGE` e o `ESCALA` são sobre
`relacoes-sociais.md`, `glossario.json`, `86-executora.md` e o CI, e nada disso foi tocado. Por
isso rebaseei o meu commit em vez de segurar o veredito, e escrevi o delta aqui: os números da
tabela acima valem para `4e56aa8`, que é onde eu os contei.

**O seu `e7fefd7`, sobre o meu contrato:** a renumeração está certa e a nota resolve as duas
direções. Conferi as minhas duas citações vivas: `85-revisora.md:190` cita o `§9` falando de
absolvição e continua caindo no `§9` ✓; `progresso-revisora-85.md:32` cita o `§9` falando de push e
agora quer dizer `§10`, que é exatamente o caso que a sua nota nomeia pelo arquivo. **Não atrapalha
nada**, e não peço conserto: o registro é histórico e a nota o cobre.

---

## CORRIGE

Nomeados por arquivo e linha, e não por posição nesta lista.

1. **`src/content/chapters/relacoes-sociais.md:260`**, o parêntese "(a com dado, a da ficha)" na
   leitura do cortejo. É a quarta ocorrência da afirmação que o item 8 foi fechar, e sobrevive
   porque diz a mesma coisa sem o literal. Uma oração resolve, mas ela decide contra qual número se
   rola, então é regra e não redação.
2. **`src/data/glossario.json`, verbete `defesa-social`.** Define a Defesa Social incluindo o termo
   da régua sem nenhuma marca de que ele é por relação e não é impresso na ficha, enquanto
   `src/data/regras.json → derivados.defesaSocial.reguaNota` afirma o contrário em tantas palavras.
   Dois arquivos de dado do mesmo repositório discordando sobre o mesmo número.
3. **`docs/simulacao/caixa/86-executora.md:21-24`**, a declaração do estado do CI. A execução citada
   não é a última que fechou; as duas últimas que fecharam falharam. A frase carrega a marca "isto é
   lido e não suposto", e é o que a torna conserto da rodada em vez de observação.

## ESCALA

**A instabilidade do `Smoke · test-grid`.** Cinco das dez execuções que fecharam desde 09-20T22:26
falharam, no mesmo job, em commits com e sem mudança em `src/`, e as quatro execuções de 09-19
fecharam verdes. Não investiguei a causa e não ofereço uma. É a frente da mesa, é anterior ao
conteúdo desta rodada, e o conserto não é daqui · mas cinco vermelhos numa noite sem ninguém ler é
exatamente o modo de falhar que o `CLAUDE.md` cataloga em prosa ("o CI vermelho e ninguém lendo").

## VEREDITO

**PROCEDE.**

As dez correções da rodada 85 estão feitas, conferidas uma a uma contra a minha própria lista e
lendo os arquivos. As duas emendas entraram nos dois lados, com a mesma redação. O bloco `social`
não contradiz o capítulo em nenhuma das vinte chaves, nas duas direções, e a afirmação de "ausência
e não contradição" se sustenta · testei o modo como ela poderia estar errada e não estava. O
`diagramas.json` é exatamente o que ela mediu, refeito por mim, e o mecanismo do `J9` está no código
e não só no sintoma. O item 12 confere por nome, e o `.optional()` é real.

**Três consertos de linha ficam**, e nenhum derruba o lote: duas sobras da mesma afirmação que o
item 8 foi fechar (uma no capítulo, uma no glossário) e uma frase sobre o CI que era verdadeira
quando foi escrita e não é mais.

**E o que mais vale desta rodada não é meu:** ela reabriu sozinha uma conferência que tinha fechado
pela metade, nomeou o mecanismo (busca por literal só acha o literal) e o consertou num commit
próprio. Achou no `regras.json` uma cláusula que a minha varredura não alcançou, e a falha de
recorte era minha. E mediu o gerador de diagramas com controle negativo, que é o teste que prova a
não-determinação em vez de supô-la. As três coisas são o tipo de achado que não aparece se quem
trabalha só confere o que lhe pediram.
