# Rodada 119 · veredito · regras básicas

**Aviso:** a mensagem do Arquiteto, que nomeia o despacho `docs/simulacao/caixa/revisao-regras-basicas-despacho.md`
(`db2bc0d3`) e manda congelar em `2dcae19e`. Passo 0 pelo §0.1: `merge-base --is-ancestor HEAD origin/main`
passou (o veredito anterior, `407a7443`, está no `main`), depois `switch -C revisora 2dcae19e`. Toplevel da
Revisora, branch `revisora`, árvore limpa. O despacho foi lido de `db2bc0d3`, que é posterior ao pino e só
acrescenta o próprio despacho.

**Natureza da rodada:** só leitura. Nenhum capítulo, JSON ou código foi tocado. O que segue é relato para o
autor, e não BLOQUEIA/CORRIGE sobre trabalho de alguém: não há diff a julgar, há texto publicado a cruzar.

## CI (§11)

Workflow `Validar dados e regras` no `2dcae19e`: run `37050483412`, `completed / success`. Nada vermelho.

## Escopo coberto, e o que não foi

Li inteiros, em `2dcae19e`: `coracao-do-sistema.md`, `acoes-e-sistema.md`, `criacao-de-personagem.md`,
`atributos.md`, `habilidades.md`, `defesas.md`, `quase-acerto.md`, `centelha.md`, `aparencia-virtudes-vontade.md`,
`vida-ferimentos-cura.md`, `custo-servicos.md`. `combate.md` inteiro (o escopo era `:1-174`, `:231-270` e
`:401-430`, e o resto eu li de passagem: o que achei fora do escopo vai separado no fim). Das ações, só os
trechos das quatro Habilidades: `acoes-corpo-e-movimento.md:12-39` (Escalar), `acoes-sentidos-e-engano.md:12-94`
(Sentidos, Esgueirar-se), `relacoes-sociais.md:124-199` e `:268-276` (o que mexe com Sociabilidade e Defesa
Social).

Cruzei contra `regras.json` (derivados, xp, limitesCriacao, escalaCentelha, escalaHabilidade, dificuldade,
ferimentos, morte, sangramento, quaseAcerto, combateTatico, gastoVontade, recuperacaoVontade, arcano.recuperacaoMana),
`armas.json`, `armaduras.json`, `habilidades.json`, `habilidades-secundarias.json`, `calc.ts`,
`quase-acerto.ts:189-222` e `scripts/test-kael.mjs`.

**Conferido e certo, para não voltar à lista** (cada um pela conta, não pela leitura): a tabela do pool
(`coracao:18-32`) contra `calc.ts:18`; os 56% e 55% de `acoes-e-sistema:27`; o "cara-ou-coroa" de `coracao:77`;
a Margem de `acoes:33` e `combate:21`; a média da Longa (`acoes:98-105`); a tabela de custos de XP
(`criacao:45-56`) contra `regras.json` `xp`, e os custos de Atributos, Habilidades, Virtudes, Vontade e
Aparência de Kael; Mana, Energia, PV e Iniciativa dos quatro exemplos; a tabela de Velocidade e o dado por
classe (`combate:52-58`, `:179`) contra `armas.json`; o Preparo de besta (`combate:86-88`, `:333-339`); a
iniciativa (`combate:33-40`) contra `derivados.iniciativa`; as três fórmulas de `defesas.md` e o exemplo de
Kael (`defesas:85`) contra `calc.ts` e `test-kael.mjs`; os ferimentos, a morte (Bram −17; PV 37 em −18/−19) e o
Sangramento contra o JSON; a PV por porte e o urso/elfo de `vida:18`; a tabela de chances da Virtude
(`aparencia:92-99`, onze casas conferidas, inclusive 16%, 38% e 63%); a tabela de QA (`quase-acerto:38-44`,
"30 das 33 armas"); o exemplo de couro do QA; a Dificuldade da Acumulada furtiva (70%, `sentidos:52-57`); as
tarifas de Serviços (`custo-servicos:22-30`, linhas Braçal e Oficial) e a tabela de Aulas inteira
(`custo-servicos:282-290`, nove linhas). E, no Combate, os blocos de `regras.json`: `combate.pgr` contra a
tabela de Preparo (`combate:76-84`); `combate.escada` contra o −2/−4 e o alívio da segunda mão (`:92-96`);
`combate.rajada` contra o −1d6, o +2 de Velocidade e o teto de golpes (`:143-152`); `combate.dupla` contra o
−1d6 das duas mãos (`:165`); `combate.escada.pressaoPorAtaque` (−2) e `pressaoTeto` (nulo) contra a Guarda sob
pressão (`:405`); `horda` contra a tabela de Magnitude, o PV de horda 5/10/15, a Defesa −2 e o exemplo de Sora
(`:415-430`, 19 ÷ 5 = 3 baixas e 4 acumulados); `bloqueioLimite` contra `:255-260` (porte, Força ×2 e +4,
Centelha sobe o teto, escudo grande +1); `combateTatico` contra a tabela de vantagem e o teto ±6
(`:361-374`). Todos batem.

**Não conferido:** afirmações qualitativas de probabilidade (como "um dado a menos corta a chance quase pela
metade", `combate:46`) e os totais de XP de Técnicas e Artes dos quatro exemplos (o próprio `criacao:170` diz
que eles não se conferem). Ficam abertos para quem varrer depois.

## Achados, por frequência de uso na mesa

### 1 · Toda jogada com Centelha: o que o teto da Habilidade quer dizer, e a Habilidade 0

- **Onde:** `centelha.md:44`, `habilidades.md:8`, `calc.ts:140-154`.
- **Tipo:** a parte 1 é CLAREZA (uma frase solta); a parte 2 é INCONGRUÊNCIA, com duas leituras.
- **O que está escrito:** `centelha.md:44`: "a Centelha soma 2 pontos por ponto, mas nunca mais do que a
  Habilidade que sustenta aquela jogada" e, adiante, "Numa jogada que rola só Atributo, sem Habilidade que
  sustente um teto (Vontade pura, Resistir sem perícia, alguns testes de Bravura) [...] a Centelha soma
  inteira, sem teto". `habilidades.md:8`: "0 não é impedimento, é falta de treino: você ainda rola o Atributo
  sozinho".
- **Por que é problema:** são duas dúvidas, e as duas caem em toda jogada.
  1. **"Nunca mais do que a Habilidade", lida sozinha**, permite entender que o bônus inteiro não passa do
     valor da Habilidade (Centelha 3 e Habilidade 3 dariam +3). O resto do livro e o motor já dizem outra
     coisa, sem ambiguidade: conta-se a Centelha até o valor da Habilidade e cada ponto contado vale 2, ou
     seja `2 × menor(Centelha, Habilidade)` (`calc.ts:141`, `defesas.md:68-81`, `combate.md:124`), que dá +6
     no mesmo caso. Não é regra em aberto; é a frase que destoa das fórmulas.
  2. **Habilidade 0 é "jogada só de Atributo"?** `habilidades.md:8` diz que, sem treino, "você ainda rola o
     Atributo sozinho", que é quase a mesma frase que `centelha.md:44` usa para ligar a Centelha inteira.
     **Leitura A:** sim, e então quem não treinou ganha a Centelha inteira (Centelha 3, Habilidade 0: +3),
     mais do que quem treinou um ponto (Habilidade 1: +2), o que inverte o propósito do teto. **Leitura B:**
     não; "só de Atributo" é só a jogada que por definição não tem lugar de Habilidade, e a Habilidade 0 numa
     jogada normal dá `2 × menor(C, 0) = 0`. A Leitura B é a que `defesas.md:85` aplica numa Defesa (Kael,
     Sociabilidade 0, recebe 0 de Centelha), mas nenhum texto diz isso para uma jogada rolada.
  Some-se que `centelhaSoAtributo` (`calc.ts:152`) não tem chamador nenhum: procurei o nome no repositório
  inteiro (a worktree em `2dcae19e`, sem filtro de extensão), e fora da própria definição ele só aparece no
  comentário de `calc.ts:134` e em documentos de `docs/`. O motor não decide a pergunta 2 por nenhum dos dois
  lados.
- **Correção sugerida:** na 1, alinhar a frase às fórmulas ("conta só até o valor da Habilidade, 2 × o menor
  dos dois"). Na 2, o autor escolhe a leitura e uma frase em `centelha.md:44` nomeia o caso da Habilidade 0.

### 2 · As três Defesas em dois capítulos ainda com o "+ Centelha" de antes da Reforma

- **Onde:** `criacao-de-personagem.md:73-75`; `aparencia-virtudes-vontade.md:129` e `:131`.
- **Tipo:** CONTRADIÇÃO (contra `defesas.md:68-81`, `combate.md:131`, `calc.ts:156-176` e o
  `regras.json` `derivados.defesa*.nota`).
- **O que está escrito:** `criacao:73` "Defesa | (Destreza + Habilidade) × 2 + Especialidade + Centelha";
  `:74` "Defesa Mental | Integridade + Raciocínio + Vontade + Centelha + Especialidade"; `:75` "Defesa Social |
  (Compostura + Sociabilidade) × 2 + Especialidade + Centelha". `aparencia:129` "Defesa Mental = Integridade +
  Raciocínio + Força de Vontade + Centelha + Especialidade"; `aparencia:131` "(Compostura + Sociabilidade) × 2
  + Centelha + Especialidade".
- **Por que é problema:** é a Centelha "+1 por ponto" que a Reforma (28/09/2026) trocou por
  `2 × menor(Centelha, Habilidade)`. A tabela da criação é a que o jogador lê ao montar a ficha, e o número que
  sai dela não bate com o que a ficha imprime (Kael: 17/13/7 pela tabela, 20/10/4 pela ficha e pelo
  `test-kael.mjs:35`).
- **Correção sugerida:** reescrever as cinco fórmulas como em `defesas.md:122-125`.

### 3 · O Ataque Social e a Defesa parada com Centelha somada inteira

- **Onde:** `relacoes-sociais.md:138`, `:274` (Ataque Social); `:182`, `:276` (Defesa parada); tabela
  `:192-198`.
- **Tipo:** CONTRADIÇÃO no ataque; INCONGRUÊNCIA na Defesa parada e na tabela.
- **O que está escrito:** `:138` "Ataque = [ (Influência + Habilidade) ÷ 2 ] d6 ( +2 se a soma for ímpar ) +
  Acerto da Abordagem + Centelha". `:182` "Defesa parada = Compostura + Sociabilidade + Centelha + termo da
  régua". `:196-197`: "Kael | 7 | 5", "Sora | 15 | 9".
- **Por que é problema:** o ataque social é uma jogada com Habilidade, e `centelha.md:44` põe "o ataque" na
  regra do teto, sem exceção para o social; a fórmula de `:138` soma a Centelha inteira. A Defesa Social com
  dado da tabela (`:196-197`) está na fórmula antiga: Kael dá 4 e Sora 18 pela de `defesas.md:75`. A Defesa
  parada é caso próprio (sem o ×2, `:188` explica por quê), e por isso tem duas leituras: **A**, ela segue a
  Reforma sem o ×2, `Compostura + Sociabilidade + menor(Centelha, Sociabilidade)` (Kael 2, Sora 9); **B**, ela
  segue somando a Centelha inteira, como hoje (Kael 5, Sora 9), e o texto diz que é exceção.
- **Correção sugerida:** `:138` e `:274` passam a `+ 2 × menor(Centelha, Habilidade)`; a coluna "com dado" da
  tabela vira 4 e 18 em Kael e Sora (guarda, vendedor e Vesna precisam da ficha deles, que não está no texto);
  a Defesa parada é decisão do autor.

### 4 · A Percepção Passiva com Centelha inteira

- **Onde:** `acoes-sentidos-e-engano.md:16`.
- **Tipo:** CONTRADIÇÃO (contra `coracao:89`, `:93`, `acoes-e-sistema:65`, `:121` e `calc.ts:415-417`).
- **O que está escrito:** "O número é (Percepção + Prontidão) × 2 + Centelha".
- **Por que é problema:** é o número que decide toda tentativa de se esconder, e o Coração do Sistema dá, para o
  mesmo guarda, `(Percepção + Prontidão) × 2 + 2 × mín(Centelha, Prontidão) + Especialidade`. A tabela logo
  abaixo (`:18`) diz "(sem Centelha)" e por isso não muda.
- **Correção sugerida:** a fórmula de `coracao:93`, ou um link para ela.

### 5 · O exemplo de abertura do Combate com o ataque de antes da Reforma

- **Onde:** `combate.md:21`.
- **Tipo:** INCONGRUÊNCIA (o exemplo contra a fórmula do próprio capítulo, `combate.md:124`).
- **O que está escrito:** "Seu pool de ataque dá 5d6+6 (Destreza 6 + Armas 5, mais o acerto da espada e a
  Centelha)".
- **Por que é problema:** Destreza 6 + Armas 5 = 11 dá 5d6 + 2; a espada (o dano "1d6" da mesma frase é o da
  Espada Longa) dá +1 (`armas.json`, `acerto: 1`); Sora tem Centelha 3 e Armas 5, então
  `2 × menor(3, 5) = 6`. O total é 5d6 + 9. O +6 do texto é 2 + 1 + 3, a Centelha "+1 por ponto". É o primeiro
  exemplo de combate que o leitor encontra.
- **Correção sugerida:** 5d6 + 9. O resto do exemplo (16 contra Defesa 10, uma Margem) continua de pé com
  qualquer rolagem que some 16.

### 6 · A Especialidade "descartando o menor", no singular

- **Onde:** `coracao-do-sistema.md:91`.
- **Tipo:** CLAREZA (uma frase solta).
- **O que está escrito:** "numa jogada com dado, ela rende +1d6 por nível, descartando o menor do pool".
- **Por que é problema:** lida sozinha, a frase permite N dados a mais e um descarte só. O resto do livro já
  diz um descarte por nível, sem ambiguidade (`habilidades.md:93`, o exemplo de `:97` e `combate.md:122`: "+N
  dados, descartando os N menores"). Não é regra em aberto; mas o Coração é o primeiro lugar onde o leitor
  encontra a regra.
- **Correção sugerida:** "+1d6 por nível, descartando um dos menores por nível (com 2 níveis, +2d6 e descarta
  os 2 menores)".

### 7 · O muro do exemplo do Coração contra o capítulo de Escalar

- **Onde:** `coracao-do-sistema.md:79` contra `acoes-corpo-e-movimento.md:14`, `:22-26`, `:33`.
- **Tipo:** INCONGRUÊNCIA.
- **O que está escrito:** `coracao:79`: "Para escalar um muro liso (Dificuldade 10), Kael [...] rola 3d6.
  Saem 11 nos dados: supera 10, ele sobe. Se tivesse chegado a 16 (6 acima do alvo), ganharia uma Margem:
  subiria mais rápido, ou alcançaria um peitoril mais alto." Em Escalar: modo "Acumulada com pressa, Longa com
  calma"; "pedra lisa e polida" é Dificuldade **12**; "Cada Margem sobe mais 3 metros".
- **Por que é problema:** "subir um muro" é uma das seis situações do pedido. O exemplo resolve numa Direta, com
  uma Dificuldade que a tabela de superfícies não tem (não há 10, e o liso é 12), e diz que ele "sobe" sem
  Acúmulo. Quem segue o Coração e depois abre Escalar acha duas regras.
- **Correção sugerida:** trocar o exemplo por uma superfície da tabela, ou dizer no exemplo que é uma
  simplificação e apontar para Escalar.
- **E a conta do mesmo exemplo esquece a Centelha.** Kael tem Centelha 3 e Atletismo 3 (`criacao:96`, `:102`),
  e o mesmo capítulo, duas linhas antes (`coracao:91`), manda somar 2 × o menor dos dois "em toda jogada": +6.
  Os 11 nos dados dão 17, que já é uma Margem; o "se tivesse chegado a 16" acontece com 10 nos dados. É o
  defeito do achado 5, no primeiro exemplo do livro. **Correção:** "3d6 + 6", e refazer a frase da Margem, ou
  trocar o exemplo por um personagem sem Centelha.

### 8 · "A cada intervalo você rola" na Longa

- **Onde:** `coracao-do-sistema.md:111` e `:113`.
- **Tipo:** CONTRADIÇÃO (contra `acoes-e-sistema.md:63`, `:92`, `:148`).
- **O que está escrito:** `:111`: "Tarefas longas [...] são os modos Acumulada e Longa [...]. A cada intervalo
  você rola; o quanto o total passar da Dificuldade soma ao Acúmulo." `:113`: "Forjar uma espada fina [...]
  intervalo semanal [...] A cada semana o ferreiro rola".
- **Por que é problema:** a Longa não rola (`acoes:63` "Rola? não"; `:92` "nenhuma jogada"), e a semana é
  "território de Longa, porque ninguém rola trinta vezes por uma espada" (`acoes:148`). O exemplo do Coração é
  exatamente o caso que o outro capítulo usa para dizer o contrário.
- **Correção sugerida:** "A cada intervalo, você rola (Acumulada) ou soma a média do pool (Longa)"; no
  exemplo, "a cada semana o ferreiro soma a média do pool".

### 9 · O Quase-Acerto: o JSON sem a Centelha, e a Sora com Centelha 2

- **Onde:** `regras.json:1133`; `quase-acerto.md:28`.
- **Tipo:** INCONGRUÊNCIA nos dois.
- **O que está escrito:** `regras.json:1133` `"dano": "Dano QA da arma − Redução QA da armadura do alvo
  (mínimo 0)"`. `quase-acerto.md:22` soma "+ Centelha do atacante − Centelha do alvo", e o motor também
  (`quase-acerto.ts:201`). `quase-acerto.md:28`: "Sora (Centelha 2)".
- **Por que é problema:** a Centelha no raspão é decisão datada da Reforma, escrita no comentário do motor
  (`quase-acerto.ts:189-190`: "e a Centelha do atacante somando desde a Reforma da Centelha, 28/09/2026"), e o
  campo do JSON é texto descritivo que não é lido por conta nenhuma; quem ficou para trás foi a string. E a Sora tem Centelha 3 em toda outra página (`criacao:108`, `:120`).
  Com 3, o raspão do exemplo dá 2 (placa) e 6 (couro), e não 1 e 5.
- **Correção sugerida:** acrescentar os dois termos da Centelha à string do JSON; no exemplo, ou Centelha 3
  com 2 e 6, ou outro nome de personagem.

### 10 · Os derivados dos quatro exemplos de criação

- **Onde:** `criacao-de-personagem.md:106`, `:124`, `:145`, `:172`.
- **Tipo:** INCONGRUÊNCIA.
- **O que está escrito:** Kael "Defesa 17 · Def. Mental 13 · Def. Social 7"; Sora "Defesa 21 · Def. Mental 17
  · Def. Social 15"; Veil "Defesa 18 · Def. Mental 18 · Def. Social 16"; Bram "Defesa 13 · Def. Mental 13 ·
  Def. Social 9".
- **Por que é problema:** os doze números são os da fórmula antiga (cada um é a conta nova com a Centelha
  somada inteira). Pela fórmula viva: Kael 20/10/4 (é o `test-kael.mjs:35`); Sora 24/20/18; Bram 14/12/10;
  Veil 20/20 e a Social 18 se a Sociabilidade for 3, que é o que o 16 de hoje implica (a ficha de Veil não
  nomeia a Sociabilidade). PV, Energia, Mana e Iniciativa dos quatro conferem.
- **Correção sugerida:** os números acima, e para Veil nomear a Sociabilidade.

### 11 · A Energia e a Mana do mortal

- **Onde:** `centelha.md:19` contra `centelha.md:30`, `:32` e `regras.json:48` (`escalaCentelha[1]`).
- **Tipo:** CONTRADIÇÃO interna.
- **O que está escrito:** `:19`: "a Energia e a Mana que todo mortal já tem passam a servir". `:30`: "É aqui
  que se ganham as primeiras reservas de Energia e Mana". `:32`: "suas reservas de Energia e Mana crescem".
  JSON: "Proezas de nível 1; ganha Energia e Mana."
- **Por que é problema:** uma frase diz que o mortal já tem as reservas, a outra que o Tocado as ganha. Pelas
  fórmulas (`criacao:76-77`), o mortal tem Energia e Mana (a Mana de Centelha 0 é a Vontade), o que sustenta
  `:19`.
- **Correção sugerida:** `:30` e o JSON passam a "as reservas que já tinha passam a servir"; `:32` ("crescem")
  continua certo, porque a Centelha 2 soma mais.

### 12 · O preço de subir uma Proeza de nível

- **Onde:** `regras.json:639` e `calc.ts:370` contra `criacao-de-personagem.md:35` e `:58`.
- **Tipo:** CONTRADIÇÃO, com duas leituras.
- **O que está escrito:** JSON: "Subir uma Proeza de nível paga só a diferença." `calc.ts:370`: o mesmo, em
  comentário. `criacao:58`: "subir uma Proeza do nível 2 para o 3 custa os 20 do nível 3 inteiro, não a
  diferença entre os dois".
- **Por que é problema:** as duas frases dizem o oposto sobre a mesma compra. O código (`custoPontos`, tipo
  `flat`) cobra o preço cheio do nível, e a ficha soma cada Técnica pelo próprio nível
  (`ficha-engine.ts:2143`), sem "subir" uma Técnica de nível. **Leitura A:** vale o capítulo, e a nota do JSON e
  o comentário do `calc.ts` estão errados. **Leitura B:** vale a nota, e o capítulo e a criação precisam mudar.
- **Correção sugerida:** o autor escolhe; o código já faz A.

### 13 · Os mesmos rótulos em quatro réguas

- **Onde:** `coracao:65-75` e `acoes-e-sistema:18-25` (coluna "Nível" da Dificuldade); `habilidades.md:10-18`
  (régua da Habilidade); `centelha.md:16-24` (estatura da Centelha); `custo-servicos.md:22-30` e `:67`
  (perfis de Serviços).
- **Tipo:** INCONGRUÊNCIA (termo com vários sentidos).
- **O que está escrito:** "Competente" é Habilidade 2 e soma 6; "Profissional" é Habilidade 3 e soma 8;
  "Perito" é Habilidade 4 e soma 9; "Mestre" é Habilidade 5 e soma 12; "Lendário" é Habilidade 6, Centelha 5 e
  Dificuldade 35 ("além do teto do jogador"); "Herói" é Centelha 3 e soma 15; "Semideus" é Centelha 6 e soma
  18. E em `custo-servicos.md:67` "o especialista de soma 12" é quem a tabela da linha 30 chama de "Mestre
  (soma 12)" (lá, "Especialista" é soma 10 e 11).
- **Por que é problema:** "um Perito" na mesa pode ser Habilidade 4 ou soma 9, e "Herói" pode ser a Centelha 3
  ou a Dificuldade 25, que a Centelha 3 não alcança com soma 12 (`acoes:27` liga os dois nomes de propósito).
  "Lendário" é alcançável pelo jogador numa régua e "além do teto do jogador" na outra.
- **Correção sugerida:** nenhuma é obrigatória; o mínimo é `custo-servicos.md:67` dizer "o Mestre de ofício
  (soma 12)", e uma nota em `coracao:65` dizendo que a coluna Nível é da soma, não da Habilidade.

### 14 · "Desperto": o degrau 2, ou qualquer Centelha

- **Onde:** `quase-acerto.md:24` contra `centelha.md:20`, `:32` e `criacao:103`.
- **Tipo:** CLAREZA.
- **O que está escrito:** "quem já Despertou sente menos o arranhão, a Centelha desconta ponto a ponto".
- **Por que é problema:** Desperto é o nome do degrau 2. O desconto vale com qualquer Centelha (o Tocado também
  desconta 1), e "quem já Despertou" sugere que o Tocado não.
- **Correção sugerida:** "quem tem a fagulha acesa".

### 15 · Onde a Centelha começa

- **Onde:** `criacao-de-personagem.md:23`, `:64` contra `:33`.
- **Tipo:** INCONGRUÊNCIA, com duas leituras.
- **O que está escrito:** `:23`: "A maioria começa em 1"; `:64`: "a maioria dos heróis começa em 1". `:33`:
  "Alcançar Centelha 1 é o que torna alguém especial, e isso se conquista na história, não na planilha."
- **Por que é problema:** **Leitura A:** o personagem jogador já nasce Tocado (a criação concede o 1, e `:33`
  fala do mundo). **Leitura B:** nasce mortal e a Centelha 1 vem em jogo (e então "a maioria começa em 1" está
  errado). Os quatro exemplos começam em 1, 3, 3 e 4, o que não decide.
- **Correção sugerida:** uma frase em `:33` dizendo para quem vale o "na história".

### 16 · A Virtude no teste e na regra da Centelha

- **Onde:** `centelha.md:44` contra `aparencia-virtudes-vontade.md:73`, `:86`.
- **Tipo:** INCONGRUÊNCIA, com duas leituras.
- **O que está escrito:** `centelha:44` põe "alguns testes de Bravura" e "Vontade pura" entre as jogadas "só
  de Atributo", que recebem a Centelha inteira. `aparencia:73`: o teste de Virtude rola "a Virtude que resiste
  a ela sem somar Atributo nenhum".
- **Por que é problema:** a Bravura é Virtude, e o teste dela não tem Atributo; nenhum capítulo do escopo
  define uma jogada de "Vontade pura", e o capítulo da Vontade não fala em rolar Vontade. O teste de Virtude
  não diz se a Centelha entra. **Leitura A:** a Centelha entra inteira em todo teste de Virtude. **Leitura B:**
  não entra, e os exemplos de `centelha:44` precisam de outra lista.
- **Correção sugerida:** o autor escolhe, e a escolha vai escrita em `aparencia:73` e nos exemplos de
  `centelha:44`.

### 17 · "Uma haste +2"

- **Onde:** `combate.md:238`.
- **Tipo:** INCONGRUÊNCIA (contra `armas.json`).
- **O que está escrito:** "uma haste +2 (o alcance afasta o golpe)".
- **Por que é problema:** a Lança Longa, que é haste, tem `defesaArma: 3`. Lança e Alabarda têm 2.
- **Correção sugerida:** "uma haste +2 ou +3".

### 18 · "O capítulo já usa os três nomes antes de defini-los"

- **Onde:** `combate.md:67-68` e `:94`.
- **Tipo:** CLAREZA.
- **O que está escrito:** "o capítulo já usa os três nomes antes de defini-los (a Investida, a Recarga, 'Golpes
  no mesmo instante')"; "É a régua que já apareceu em Correndo [...] na Investida e na Recarga".
- **Por que é problema:** as quatro seções vêm depois (`:288`, `:306`, `:322`, `:378`). A frase descreve uma
  ordem antiga do arquivo.
- **Correção sugerida:** "que o capítulo usa adiante".

### 19 · A Convicção resiste "à dor"

- **Onde:** `aparencia-virtudes-vontade.md:43` contra `:86`.
- **Tipo:** CLAREZA.
- **O que está escrito:** a tabela diz que a Convicção resiste "à dor, à tortura e ao desânimo"; `:86` diz que
  a dor física é Vigor + Resistência "mesmo quando a tabela acima põe a dor na Convicção".
- **Por que é problema:** o próprio texto reconhece a tensão em vez de tirá-la; quem lê só a tabela rola a
  Virtude para aguentar a dor.
- **Correção sugerida:** na tabela, "à dor da alma, à tortura (a metade da alma) e ao desânimo".

### 20 · A Centelha na Absorção, fora da lista do que ela faz

- **Onde:** `centelha.md:42-46` contra `combate.md:193` e `regras.json` `dano.centelhaNoSoak`.
- **Tipo:** CLAREZA.
- **O que está escrito:** a lista "O que a Centelha faz" tem jogada, Defesa, dano e reservas; não tem a
  Absorção natural, que soma a Centelha inteira ("Vigor + Centelha" no Impacto, "só a Centelha" no Corte e
  na Perfuração).
- **Por que é problema:** quem procura no capítulo da Centelha não acha uma das coisas que ela mais faz em
  combate, e pode ler a regra do teto (`:44`) como valendo para a Absorção também.
- **Correção sugerida:** uma linha no item 1: "Na Absorção natural ela também soma inteira, como no dano."

## Fora do escopo, visto de passagem (não varrido)

- `combate.md:316`: "Sora [...] anda 4 m por Tick e corre 6". Pelas fórmulas (`combate:301-302`,
  `derivados.deslocamento`) e com a ficha dela (Força 4, Destreza 6, Atletismo 3), o Arranque dá 6,75 (7) e a
  Corrida 10. O 4 confere.
- `combate.md:351`: Salto horizontal correndo = "Velocidade atual + (Atletismo ÷ 2) + Centelha"; o JSON
  (`saltoHorizontalCorrendo`) é `1,5 × Destreza + 1,5 × Atletismo + Centelha`, sem base. Para Kael os dois
  quase coincidem (13 a 13,5 contra 13,5), e para Sora não (14,5 contra 16,5).
- `criacao-de-personagem.md:159`: a linha de Habilidades de Bram põe Cura e Ciências, que são secundárias, no
  meio das primárias, e o 220 de XP não fecha com nenhuma das duas leituras que tentei (222 e 208). Não
  investiguei mais.

## Limpeza

Só leitura e contas com `node -e` sobre os JSONs, no próprio terminal. Nenhum arquivo versionado tocado além
deste e do `progresso-revisora-119.md`.
