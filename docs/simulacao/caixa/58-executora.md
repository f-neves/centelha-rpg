# Rodada 58 · a família do gatilho `armadilha`, medida

**Rodada de MEDIÇÃO. Nenhuma linha de `src/` mudou**, e por isso o bloco abaixo tem os
três campos iguais: a árvore que este documento mede é a mesma que já estava no ar.

## COMMIT

```
BASE  f28387ff8b66cc53f87cfeb11c953171d0854f5f
SHA   f28387ff8b66cc53f87cfeb11c953171d0854f5f
TOPO  594f9acf0a0d2a9e0f4b8e4e2ad0b3b6a1f7c1e0
```

**O `TOPO` diferente do `SHA` diz o que ele existe para dizer: entrou coisa que não é minha.**
O `594f9ac` é do Arquiteto e é só documento (o contrato da Revisora deixando de copiar o sha
do pino), então ele não muda a árvore de código que esta medição leu. A primeira versão deste
bloco trazia os três campos iguais, e estava errada: quando ela foi escrita, o `origin/main`
já tinha o `594f9ac` e eu ainda não tinha rebasado.

Não há código a revisar: o que esta rodada produz é medida e lista de perguntas. O único
arquivo novo é este, mais o `progresso-armadilha.md` ao lado.

## O QUE MUDOU

| arquivo | o que mudou nele |
|---|---|
| `docs/simulacao/caixa/58-executora.md` | novo, esta medição |
| `docs/simulacao/caixa/progresso-armadilha.md` | novo, o sinal de vida da rodada |

## AS QUATRO PREMISSAS DO DESPACHO, CONFERIDAS

Três de pé, uma caída.

| # | a premissa | veredito |
|---|---|---|
| 1 | são exatamente quatro, e são `brasa-retardada`, `semente-adormecida`, `cura-guardada`, `salvaguarda` | **de pé** |
| 2 | partem em duas sub-famílias: duas `zona`/`ponto`, duas `alvo`/`alvo` | **de pé** |
| 3 | o vocabulário tem seis valores, os outros cinco sendo `passivo`, `ao-entrar`, `imediato`, `por-turno`, `ao-tocar` | **de pé** |
| 4 | no código `armadilha` aparece em dois lugares só | **CAÍDA**, ver abaixo |

**A premissa 4 caiu por duas coisas diferentes, e a segunda importa mais que a primeira.**

São **sete** ocorrências de `armadilha` EM CÓDIGO, nomeadas em vez de contadas (a palavra
aparece muito mais vezes em prosa, em `.md`, em cabeçalho de `.sql` e em dois comentários sem
relação no `grid.astro`, e nenhuma dessas é leitura do gatilho):

| onde | o que faz ali |
|---|---|
| `src/lib/artes-grid-mesa.ts:1535` | comentário da coluna `cura_pontos` |
| `src/lib/artes-grid-mesa.ts:1544` | a gravação de `cura_pontos` (o chão da migração 39) |
| `src/lib/artes-grid-mesa.ts:2164` | a EXCLUSÃO da varredura por turno |
| `src/lib/artes-grid.ts:122` | o tipo `Gatilho`, onde a palavra é definida |
| `scripts/validate-data.mjs:155` | o vocabulário fechado que o `validate` cobra |
| `scripts/gen-grid-artes.mjs:157` | comentário: "dorme até alguém pisar, e gasta-se ao disparar" |
| `scripts/gen-grid-artes.mjs:162` | **a lista dos quatro nomes, escrita à mão** |

**E a que muda a forma do trabalho é a última.** O bloco `grid` do `efeitos.json` é
**GERADO**: `gen-grid-artes.mjs` grava o arquivo (`writeFileSync`, linha 396) e o build roda
o `--check`. Então a pertença à família, a condição de cada Efeito e o gatilho de cada um
**não moram no JSON**, moram no gerador · mexer no JSON direto morre no próximo regen, que é
exatamente a lição do `bestiario-centelha-b10`. Isto vale para qualquer rodada futura que
queira mudar um destes quatro.

## O QUE ESTE RELATÓRIO AFIRMA

Cada número com a procedência. O script de medição roda sobre `src/data/efeitos.json` e
está reproduzido no fim deste documento, para poder ser refeito.

| número | o que é | de onde sai |
|---|---|---|
| `140` | Efeitos no catálogo | `src/data/efeitos.json`, contagem do script abaixo |
| `4` | Efeitos com `gatilho: "armadilha"` | idem |
| `6` | valores distintos de gatilho no dado | idem, e bate com o tipo `Gatilho` |
| `27 / 4 / 13 / 83 / 4 / 9` | Efeitos por gatilho (`ao-entrar`, `ao-tocar`, `imediato`, `passivo`, `armadilha`, `por-turno`) | idem |
| `23` | Efeitos de `forma: "alvo"` COM condição | idem |
| `18 / 2 / 2 / 1` | desses 23, por gatilho (`passivo`, `imediato`, `por-turno`, `armadilha`) | idem |
| `7` | leituras de `gatilho` em `src/` (nenhuma entre o menu e a gravação) | varredura por `Grep` em `src/` |
| `5` | pontos que baixam Vida hoje (4 escritas de cliente + 1 RPC) | nomeados na tabela do item 4 |

## OS QUATRO, ITEM A ITEM

### O retrato de dados, lado a lado

| | `brasa-retardada` | `semente-adormecida` | `cura-guardada` | `salvaguarda` |
|---|---|---|---|---|
| nível | 3 | 3 | 4 | 1 |
| forma / âncora | zona / ponto | zona / ponto | alvo / alvo | alvo / alvo |
| condição | `em-chamas` | nenhuma | nenhuma | `protegido` |
| fere / cura / teste | fere | fere, teste | cura | nenhum dos três |
| matéria | nenhuma | perfuração | nenhuma | nenhuma |
| escalonável | **não** | sim | sim | sim |

### 1 · `brasa-retardada` (Arte de Fogo, nível 3)

**A régua publicada.** Só a prosa do próprio Efeito: *"Deixa o efeito preso num ponto,
disparando quando alguém passa, toca, ou ao fim de um tempo combinado. É a armadilha do
feiticeiro."* (`src/data/efeitos.json:749`). Parâmetros: Alcance, Área, Dano, Duração
(régua longa). **Nenhum capítulo o cita**: varri `src/content/` pelos quatro nomes e o
resultado é zero. O `regras.json` não tem nada sobre disparo de armadilha.

**A condição de disparo que o texto pede.** Três portas alternativas, e nenhuma delas é a
mesma pergunta: (a) alguém PASSA pela zona, (b) alguém TOCA, (c) chega um TEMPO COMBINADO.

**O que existe de estado para responder cada uma.** A (a) já é respondida hoje:
`dentroDoEfeito` é a mesma função que a varredura usa para o `ao-entrar`, e ela já sabe
dizer quem está dentro de uma figura. A (b) não tem estado nenhum: "tocar" não é conceito do
tabuleiro. A (c) não tem campo: `ate_tick` é o VENCIMENTO da linha e `desde_tick` é quando
ela nasce, e nenhum dos dois é "a hora marcada para detonar".

**O gancho.** Nada dispara este Efeito hoje. Ele é pulado na varredura
(`artes-grid-mesa.ts:2164`) e a condição `em-chamas` não entra porque a lista de alvos de
uma zona nasce vazia (`gravarEfeito` só põe condição em `extra.alvos`).

### 2 · `semente-adormecida` (Arte de Vida, nível 3)

**A régua publicada.** *"Planta o efeito num ponto e ele dorme até alguém pisar, tocar, ou
até a hora combinada. Cresce de uma vez, agarra quem estiver em cima e fere."*
(`src/data/efeitos.json:1964`). E ela é a única das quatro que **já traz os números do
disparo**: `Jogada` fixa em `Percepção + Prontidão` "para notar a armadilha antes de pisar
nela", `Dificuldade` fixa em `(nível da Arte) × 4`, e `Dano` fixo em `1d6 por nível`.

**A condição de disparo.** As mesmas três portas da brasa, mais uma metade que a brasa não
tem: a rolagem de detecção ANTES do disparo, que é regra escrita e não tem implementação.

**O que existe.** O mesmo que na brasa para a geometria. A rolagem de perícia contra
Dificuldade existe na mesa em várias formas (`rolarPool`, `artes-grid-mesa.ts:1724`), então a
peça bruta está lá. **O que não existe é o gatilho dela**: quem rola, quando, e uma vez só
ou toda vez que alguém se aproxima.

**Um resíduo do texto que o dado não carrega:** a prosa diz "agarra quem estiver em cima", e
o bloco `grid` tem `condicao: null`. A condição que representaria "agarra" não foi escolhida.

### 3 · `cura-guardada` (Arte de Cura, nível 4)

**A régua publicada, e é a mais completa das quatro.** *"Deixa a cura presa no alvo,
dormindo, sem gastar a sua ação depois e sem exigir que você esteja perto. Quem decide a hora
é o alvo, e ela dispara sozinha se ele cair incapacitado. Um alvo carrega uma cura guardada
por vez."* (`src/data/efeitos.json:1853`). Mais a decisão do humano de 13/09 ("1 PV por
ponto" é ponto de Mana GASTA) já no dado, e o chão da migração 39 de pé.

**As três peças que faltam: CONFIRMADAS, e são de fato as três.** O texto nomeia exatamente
três coisas (a hora escolhida pelo alvo, o disparo automático na incapacitação, e uma por
alvo), e nenhuma tem código. `curaPresaDe` (`src/lib/artes-grid.ts:1621`) lê a coluna e não
tem um único chamador na mesa.

**O que existe.** A leitura do valor (`curaPresaDe`) e a cura em si (`curarAlvo`,
`artes-grid-mesa.ts:1917`, que já respeita o teto de `pv_max` e marca a mordida). O que não
existe é qualquer um dos três gatilhos.

**Um resíduo de dado:** o bloco `grid` diz `alvo: "varios"` e o parâmetro `Alvos` é fixo em
`1`. Os dois discordam, e como o bloco é gerado, quem manda é o `ALVO` do gerador.

### 4 · `salvaguarda` (Arte de Proteção, nível 1) · **e este não está inerte**

**A régua publicada.** *"Deixa uma marca de guarda no alvo que engole um efeito arcano de
nível igual ou menor ao que você investiu e se gasta ao fazê-lo. Fica esperando até ser usada
ou até a duração acabar."* (`src/data/efeitos.json:3771`). Parâmetro `Absorve` fixo em "um
efeito arcano de nível igual ou menor ao investido".

**A condição de disparo.** Chegar no alvo um efeito arcano de nível ≤ o investido. É a
única das quatro cuja porta não é geográfica nem temporal: é um EVENTO de outra Arte.

**O que existe, e é mais do que eu esperava.** A comparação de nível já está escrita e roda:
`dissipar` compara `(e.nivel || 1) <= meu` contra os pontos investidos
(`src/lib/artes-grid-mesa.ts:1053`), que é literalmente a conta que a Salvaguarda pede. O
gatilho seria reúso, não mecanismo novo. O que falta é o PONTO onde um efeito arcano que
chega pergunta "este alvo carrega uma salvaguarda?".

**O que NÃO devia existir e existe.** Ver QUEBROU.

## QUEBROU

**A `salvaguarda` não é um Efeito sem gatilho: ela já age na mesa hoje, e faz outra coisa que
não a que promete.**

O mecanismo, medido e não suposto:

- o bloco `grid` dela carrega `condicao: "protegido"`, posto à mão no gerador
  (`scripts/gen-grid-artes.mjs:247`, na lista dos oito Efeitos de escudo);
- `protegido` é `soak: 3`, "Barreira arcana: soma Absorção em todos os modos enquanto durar"
  (`src/data/condicoes.json:238`);
- a condição é aplicada por **dois caminhos que não olham o gatilho**: na conjuração, o laço
  sobre `extra.alvos` (`src/lib/artes-grid-mesa.ts:1622`); e na saída adiada, o ramo
  `tipo: 'condicao'` do `planoDaSaida` (`src/lib/artes-grid.ts:1667`), cuja única guarda é
  `ef.condicao && alvos.length`.

**ALCANÇÁVEL, e esta é a conferência que faz o achado valer** (a régua da rodada 55: divergência
que nenhum caminho de jogo alcança não é defeito de comportamento). O caminho é o comum: o
mestre conjura, `conjurar` roteia `forma: 'alvo'` para `grudarNoAlvo`
(`src/lib/artes-grid-mesa.ts:838`), que pede um alvo no mapa e grava com `alvos: [alvoId]`
(`src/lib/artes-grid-mesa.ts:1025`). **Varri as sete leituras de `gatilho` em `src/` e nenhuma
fica entre o menu e a gravação**: não há filtro que impeça conjurar uma armadilha.

**O que acontece na mesa hoje:** o alvo ganha **+3 de Absorção em todos os modos, pela duração
inteira, sem nunca se gastar**, num Efeito de **nível 1**. O que a régua promete é outra coisa:
engolir UM efeito arcano e se gastar. Não é a promessa cumprida pela metade, é outra promessa.

**E é por isso que UM dos quatro vaza e três não.** Dos 23 Efeitos de `forma: "alvo"` com
condição, 18 são `passivo`, 2 `imediato`, 2 `por-turno` e **1 é `armadilha`**. As outras duas
têm `condicao: null` e não têm o que vazar. A `brasa-retardada` TEM condição (`em-chamas`) e não
vaza por outro motivo, e este eu li em vez de deduzir: o caminho de chão fecha a chamada com
`alvos: []` (`src/lib/artes-grid-mesa.ts:1000`), tanto no ramo normal quanto no de escala de
região (`:912`), então a guarda `alvos.length` do `planoDaSaida` fecha o ramo e `gravarEfeito`
não tem em quem pôr a condição. **É uma ausência de alvos, e não uma trava**: qualquer rodada
futura que faça uma zona marcar alvos ao nascer liga o `em-chamas` da brasa junto, sem aviso. **O gatilho `armadilha` foi excluído da varredura e nunca foi excluído
do caminho da condição**, e só um Efeito da família cai nessa combinação.

**Não consertei.** Buff errado não é perda de dado, então a exceção permanente do congelamento
não se aplica, e a rodada é de medição. Decisão do Arquiteto.

## O CUSTO · uma rodada de código com quatro parâmetros, ou quatro rodadas?

**Resposta medida: são TRÊS itens de código, não um e não quatro**, e a partição não é a das
duas sub-famílias do despacho.

**O que os quatro compartilham, e é pequeno:** "dispara uma vez e se gasta". A metade do
"se gasta" já existe inteira (`encerrarEfeito`, `src/lib/artes-grid-mesa.ts:2360`, que já tira a
condição dos alvos e limpa a linha). O que falta é chamar o resolvedor e depois ela.

**O que cada um pede de próprio:**

| item | o que pede | tamanho |
|---|---|---|
| **A · as duas de zona** (`brasa-retardada`, `semente-adormecida`) | a geometria JÁ existe (`dentroDoEfeito`, o mesmo do `ao-entrar`). Falta tirar as duas da exclusão da varredura e resolver uma vez só. A semente soma a rolagem de detecção. | **pequeno**, e é um item só para as duas: mesmo laço, mesma pergunta |
| **B · `salvaguarda`** | um ponto onde a Arte que CHEGA pergunta se o alvo carrega guarda, mais desfazer o `protegido` de hoje, mais **uma coluna** (abaixo) | **médio, e com migração**, não o "reúso" que eu escrevi primeiro |
| **C · `cura-guardada`** | o disparo pela mão do alvo (ação de jogo que não existe), a trava de uma por alvo, e o gancho da incapacitação | **o maior dos três**, pelo motivo abaixo |

**O item B custa uma coluna, e eu quase publiquei o contrário.** Escrevi primeiro que a
comparação de nível era reúso do `dissipar` e que o gatilho sairia barato. A COMPARAÇÃO é reúso;
o LIMIAR não é. O `dissipar` compara contra `plano.custo.total` (`src/lib/artes-grid-mesa.ts:1051`),
que só existe durante aquela conjuração. A Salvaguarda tem de comparar num instante POSTERIOR, e
o número que a regra dela nomeia ("nível igual ou menor ao que você INVESTIU") **não sobrevive na
linha**: `gravarEfeito` grava `nivel: plano.efeito?.nivel` (`src/lib/artes-grid-mesa.ts:1528`),
que para a Salvaguarda é **sempre 1**, o nível de catálogo, e ela é `escalonavel: true`, então o
investido é exatamente o que varia. O `custo.total` (`base + parametros`, `src/lib/artes-grid.ts:377`)
não é gravado em campo nenhum da linha.

**É o mesmo argumento que o cabeçalho da migração 39 faz para o `cura_pontos`**, com outro
número: entrada que não sobrevive vira coluna, ou a regra fica sem o número que ela nomeia. Fica
aberta uma pergunta que é de regra e não minha: se o `nivel_arte` da migração 38 (que JÁ está na
linha) serve de "o que você investiu", a coluna não é necessária · mas é outro número, e quem
decide qual dos dois a regra quis dizer é a mesa.

**E o preço do C não é o que o nome sugere.** "Um gancho no caminho do dano" pressupõe que
existe UM caminho. **São cinco pontos que baixam Vida hoje**, nomeados:

| onde | o que é |
|---|---|
| `src/pages/mesa/grid.astro:11175` | `baixarVida`, o caminho principal do Grid |
| `src/pages/mesa/grid.astro:11188` | a RPC `jogador_dano`, dentro da mesma função, para o lado do jogador |
| `src/lib/artes-grid-mesa.ts:1871` | `morder`, escrita crua |
| `src/lib/artes-grid-mesa.ts:1905` | `aplicarDano`, escrita crua (colisão do empurrão) |
| `src/pages/mesa/combate.astro:1335` | `mexerVida`, o caminho próprio da aba Combate |

E o próprio código já diz que isto é dívida conhecida: o comentário do `curarPv`
(`src/pages/mesa/grid.astro:2685`) registra que `morder`/`aplicarDano` continuam com escrita
crua, dívida do `L87`. **Quem for fazer o C escolhe entre pagar essa dívida primeiro (um ponto
único de baixar Vida) ou pendurar o mesmo gancho em cinco lugares.** É a forma do catálogo "o
segundo ponto de decisão, dentro da MESMA função", multiplicada por cinco arquivos.

## O QUE FALTA DE REGRA · a lista única, para o humano

São DEZ (as nove numeradas mais a `P7b`), nenhuma decidida por mim, todas cabendo em duas
leituras ou mais.

**P1 · O "tempo combinado" das duas armadilhas de zona existe?** Os dois textos dizem
"ou ao fim de um tempo combinado" / "ou até a hora combinada", e não há campo para isso.
As duas leituras: **(X)** existe, e é um parâmetro novo que a conjuração pergunta;
**(Y)** não existe, a única porta é alguém entrar, e a frase sai do texto.

**P2 · A armadilha que vence sem disparar, some ou explode?** Hoje `ate_tick` só apaga a
linha. **(X)** vence e some, gasta à toa; **(Y)** vence e DETONA, o que resolve o P1 de graça
(a hora combinada vira a própria Duração comprada).

**P3 · "Passa" e "toca" são a mesma porta?** O tabuleiro só sabe responder posição.
**(X)** são a mesma coisa, e "tocar" é prosa de sabor; **(Y)** são portas diferentes, e
"tocar" espera um verbo de mesa que não existe.

**P4 · Quem rola a detecção da `semente-adormecida`, e quando?** O número está escrito
(`Percepção + Prontidão` contra `(nível da Arte) × 4`) e o momento não.
**(X)** rola quem vai entrar, no instante em que entra, uma vez; **(Y)** rola todo mundo que
chega perto, uma vez por criatura, valendo para a cena inteira; **(Z)** rola só quem declara
que está procurando.

**P5 · O que a `semente-adormecida` faz com quem ela "agarra"?** A prosa promete agarrar e o
dado não nomeia condição nenhuma. **(X)** é uma condição existente do catálogo (a família de
`prisao`); **(Y)** é só sabor, e o Efeito fere e pronto; **(Z)** é condição nova.

**P6 · A `salvaguarda` de hoje foi escolhida ou herdada?** Ela está na lista do `protegido` ao
lado de sete escudos de verdade. **(X)** a classificação está certa e o texto do Efeito é que
está velho (então a Salvaguarda É um escudo de +3 e a regra se corrige);
**(Y)** o texto está certo e a classificação é que erra (então `protegido` sai dela e o gatilho
vira trabalho); **(Z)** as duas coisas valem, e ela dá +3 ENQUANTO espera e some ao engolir.
**Esta é a que eu levaria primeiro**, porque enquanto ela não for respondida a mesa está
jogando com um Efeito de nível 1 que dá +3 de Absorção permanente.

**P7 · A `salvaguarda` engole o quê, exatamente?** O texto diz "um efeito arcano de nível igual
ou menor". **(X)** qualquer Arte que mire o alvo, inclusive a que fere; **(Y)** só as que deixam
condição ou prisão, e o dano passa; **(Z)** qualquer uma, e o `Alvos` comprado diz em quantos
aliados a marca pode ser posta.

**P7b · "Nível igual ou menor ao que você INVESTIU" é qual número?** Nenhum dos dois candidatos
está resolvido, e a resposta decide se o item B leva migração. **(X)** é o `custo.total` da
conjuração, que é o que o `dissipar` usa e o que NÃO está gravado na linha (então precisa de
coluna nova, pelo mesmo argumento da migração 39); **(Y)** é o `nivel_arte`, que a migração 38 já
gravou (então sai de graça, e o Efeito passa a medir outra coisa); **(Z)** é o nível do Efeito,
que para a Salvaguarda é sempre 1 (então ela nunca engole nada acima de 1, e a escalabilidade
dela serve só para os outros parâmetros).

**P8 · A `cura-guardada` dispara em qual limiar?** O texto diz "se ele cair incapacitado", e a
mesa tem escada de estados (`tierDe`). **(X)** ao chegar a zero PV; **(Y)** ao entrar no estado
que a tabela de ferimento chama de incapacitado, que é antes do zero; **(Z)** o mestre decide na
hora.

**P9 · "Um alvo carrega uma cura guardada por vez": a segunda é recusada ou substitui?**
**(X)** recusa e devolve a Mana; **(Y)** recusa e cobra do mesmo jeito; **(Z)** substitui a
antiga, que se perde.

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | Não abri o `Pendencias.md`. O achado da `salvaguarda` está DENTRO do item da rodada, então ele é relato e não linha de congelamento, e a linha de `Pendencias.md` é do Arquiteto absorver com o resto. | se a rodada for engavetada antes de ele absorver, o achado vive só neste arquivo da caixa. |
| D02 | Contei os sete pontos de `armadilha` no código, mas NOMEIEI todos na tabela, e nomeei os cinco pontos de baixar Vida em vez de dizer "cinco lugares". | nenhum, e é de propósito: contagem passada adiante vira condição de parada de quem confere. |
| D03 | Não medi o resto da lista do `protegido` (os outros sete Efeitos). A pergunta era sobre a família `armadilha`, e varrer se os outros escudos também divergem do próprio texto é frente vizinha. | se houver o mesmo defeito nos outros sete, ele continua invisível. |

## O ao-tocar, em uma linha, como pedido

**Não é a mesma forma de buraco.** Os quatro `ao-tocar` (`arma-elemental`, `arma-conjurada`,
`projetil-conjurado`, `metal-incandescente`) são armas: são pulados na varredura por turno
porque quem cobra o dano deles é o GOLPE da arma e não o relógio, e os `passivo` são pulados
porque o ramo de condição do `planoDaSaida` já os pega. **O `armadilha` é o único pulado na
varredura sem que ninguém mais o pegue.**

## O SCRIPT DA MEDIÇÃO

Roda sobre o disco, sem banco, e reproduz toda a tabela de números acima:

```js
import { readFileSync } from 'node:fs';
const lista = JSON.parse(readFileSync('src/data/efeitos.json', 'utf8'));
const arm = lista.filter((e) => e.grid && e.grid.gatilho === 'armadilha');
const alvoComCond = {};
for (const e of lista) {
  const g = e.grid; if (!g) continue;
  if (g.forma === 'alvo' && g.condicao) (alvoComCond[g.gatilho] ||= []).push(e.id);
}
const porGatilho = {};
for (const e of lista) if (e.grid) porGatilho[e.grid.gatilho] = (porGatilho[e.grid.gatilho] || 0) + 1;
console.log(lista.length, arm.map((e) => e.id), porGatilho, alvoComCond);
```

## ONDE LER

- `docs/simulacao/caixa/progresso-armadilha.md` · o sinal de vida, com a ordem em que as
  premissas caíram e a hora de cada etapa.
- `supabase/migracao-39.sql` · o cabeçalho dela já enuncia as três peças que faltam à
  `cura-guardada`, e esta medição confirma que são as três.
