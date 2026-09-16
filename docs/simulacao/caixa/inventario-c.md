# Inventário dos consertos `C` · o estado REAL, lido no disco de 16/09/2026

**Rodada 80, pela Executora. Medição pura: nenhum conserto entrou, nenhum arquivo de `src/` foi
tocado.** Este arquivo é ESTADO, e não ordem de serviço · quem manda o que fazer continua sendo o
`jogador-novo-consertos.md`.

**O que foi lido:** o disco, e não a marca. Onde o item traz conferência escrita, ela foi refeita;
onde não traz, procurei a frase que o item cita. As buscas rodaram em node e não por `grep` de
shell, pelos dois motivos que o `CATALOGO.md` já registra: o hook do RTK encolhe a saída, e classe
de caractere com acento não casa neste ambiente.

**Ancorado em `b4d87b4`.**

## A contagem, com o denominador

| resposta | quantos |
|---|---:|
| **FEITO** | **13** |
| **ABERTO** | **40** |
| **PREJUDICADO** | **0** |
| **NÃO SEI** | **0** |
| **soma** | **53** |

**A soma bate com as 53 seções.** Duas coisas sobre as duas categorias vazias, porque vazio
também é resposta:

- **PREJUDICADO: nenhum, e eu procurei.** Cinco itens tiveram a área reescrita por decisão
  posterior (`C-23` pela M-03, `C-29` pela M-04, `C-34` pela M-05, `C-46` pela M-06, `C-47` pela
  M-07), e em nenhum deles a PERGUNTA deixou de existir: quatro seguem abertos esperando a
  implementação da decisão, e o `C-29` fechou porque o defeito sumiu, que é FEITO e não
  prejudicado. **O caso mais próximo é o `C-97`** (a conta social duplicada em `combate.md`): ela
  não está mais lá, e eu não consegui atribuir a saída dela a nenhuma decisão nomeada, então
  contei como FEITO pela evidência e não pela causa.
- **NÃO SEI: nenhum, e a razão é boa.** Os três do balde 3 (`C-01`, `C-39`, `C-15`) continuam
  decidíveis no FONTE: o `C-01` saiu do balde na rodada 61 e hoje tem portão
  (`scripts/test-links-base.mjs`), e o `C-39` e o `C-15` ainda exibem o defeito no fonte, então o
  site publicado não tem como estar mais verde que ele.

## Os 13 FEITO

| item | evidência, lida hoje |
|---|---|
| **C-01** · link de HTML cru sem base | `href="/regras` = **0** em `src/`; o `rehypeBaseLinks()` existe (`astro.config.mjs`) e o `FichaSkeleton` usa `import.meta.env.BASE_URL`. Guardado por `test-links-base.mjs` |
| **C-02** · tetos da criação | `"Atributo máximo **4**"` = **0** |
| **C-03** · Centelha custa XP | `"O XP paga o custo"` = **0** em `src/` |
| **C-04** · duas tabelas de ferimento | `"25–50"` = **0** no capítulo |
| **C-05** · o Bram tem dois PV | o callout diz **PV 34** (`vida-ferimentos-cura.md:32`) |
| **C-06** · metade ou dois terços | `"deslocamento pela metade"` = **0** em `racas.md`; `"corre e salta metade"` = **0** em `combate.md` |
| **C-07** · Defesa Social sem ×2 | `aparencia-virtudes-vontade.md` não publica mais fórmula de Defesa Social; sobrou só a menção que aponta para a irmã |
| **C-09** · quatro redações da Defesa física | `"perícia que você escolher"` = **0** em `qual-sistema.md` |
| **C-26** · o Pavês parece dar +6 | `equipamentos.astro` passou a imprimir na coluna de projétil a palavra `bloqueia`, ou o glifo de célula vazia, em vez de repetir o número: é exatamente o conserto que o item pedia |
| **C-29** · "rodada" de um sistema que não existe | `"rodada"` = **0** nos três capítulos citados e `"turno"` = **0** em `/artes/regras`. O único "turnos" que sobra em capítulo é a frase que os NEGA (`combate.md:8`). Fechado pela M-04 |
| **C-49** · `cost-examples.mjs` devolvia NaN | roda, sai com 0 e **zero** ocorrências de `NaN` |
| **C-96** · a Defesa Social cobre duas coisas | `"protege contra quem tenta te ler"` = **0** em `src/content` |
| **C-97** · a conta social sem d6 e sem +2 | `combate.md` não tem **nenhuma** linha com "social" ou "Influência": a conta duplicada saiu do capítulo |

## Os 40 ABERTO

**Sete deles já têm decisão de mesa tomada e esperam só a implementação**, e isso está dito na
linha de cada um (`C-08`, `C-23`, `C-34`, `C-46`, `C-47`, mais o `C-12` e o `C-13`, que dependiam
da M-02 e de escolha do Arquiteto).

| item | a evidência de que o defeito continua |
|---|---|
| **C-08** · Defesa Mental sem Especialidade | o glossário JÁ corrigiu ("mais a Especialidade quando o escopo nomeado dela se aplicar"), mas `criacao-de-personagem.md:73` publica "Integridade + Raciocínio + Vontade + Centelha" |
| **C-10** · três danos da espada longa | `combate.md:141` ainda traz `2d6+3` |
| **C-11** · "paga só a diferença" | `criacao-de-personagem.md:57` ainda traz "paga só o preço do nível que está comprando, sem passar pelos de baixo" |
| **C-12** · as linhas de XP do Bram | o `cost-examples.mjs` roda e acusa **cinco** divergências: Atributos 415≠496, Habilidades 222≠220, Secundárias 56≠66, Especialidades 72≠48, Virtudes 74≠63. A linha das Artes fechou pela M-02 |
| **C-13** · o Kael de cada capítulo | a metade dos números entrou em `fc76f73`; a metade de EDIÇÃO (os exemplos que dão arma ao Kael) continua |
| **C-14** · a Margem erra por um | `coracao-do-sistema.md:70` ainda diz "Se tivesse passado de 16" |
| **C-15** · "(Valor)" na prosa | **3** em `src/content` e **1** dentro do SVG gerado (`diagramas.json`) |
| **C-16** · três defesas ou quatro | `centelha.md:44` ainda diz "quatro defesas" |
| **C-17** · Miúdo contra Minúsculo | "Miúdo" aparece **79** vezes em `src/`, inclusive `vida-ferimentos-cura.md:22` e o bestiário |
| **C-18** · o rótulo cobra a Arte pela metade | `FichaSkeleton.astro:117` ainda diz `nível×10` |
| **C-19** · o Efeito custa 2× ou 4× | `artes/efeitos.astro:31` ainda diz "2 × o nível dele" |
| **C-20** · a armadura "Nenhuma" | `armaduras.json` ainda diz "Só o Soak natural (Vigor) defende você" |
| **C-21** · duas escadas na Aura | `efeitos.json:278` ainda diz "1 metro de raio por nível" |
| **C-22** · a iniciativa social no Tick 0 | `relacoes-sociais.md:121` ainda diz "começa no Tick 0" |
| **C-23** · três redações do Valor Passivo | o glossário e `acoes-e-sistema.md:105` já estão alinhados ao motor (M-03); sobra a linha **49** do mesmo arquivo, "um valor parado: 2 × (Atributo + Habilidade)", sem a Centelha |
| **C-24** · duas escalas de Firula | as duas continuam (`habilidades.md:107` com +1d6, `relacoes-sociais.md` com a régua de pontos) e nenhuma diz onde vale |
| **C-25** · penetração N0 a N5 | "N5" em `armas-e-armaduras.md:21` e `:101` |
| **C-27** · a tabela tem 25 linhas | "Desarmado" = **0** na tabela do capítulo: a linha continua faltando |
| **C-28** · ★ e * opostos | `armas-e-armaduras.md` usa ★ em 26 linhas e `/equipamentos` monta o rótulo pelo campo `principal`: a convenção dupla segue |
| **C-30** · parágrafo publicado duas vezes | `combate.md:202` e `:206` continuam idênticos |
| **C-31** · Preparo, Golpe e Recuperação | "Preparo" aparece **15** vezes em `combate.md`, e a primeira (`:189`) já usa o conceito sem que exista seção que o defina |
| **C-32** · dois sistemas de tempo | "dois sistemas" = **0** em `combate.md` |
| **C-33** · quantos golpes uma ação rende | `combate.md:85` ainda diz "cada ação rende um só ataque", e `:89` mantém hábil −1d6 / inábil −2d6 contra o `combate.dupla` |
| **C-34** · perícia 0 rola zero dados | "zero dados" = **0** nos capítulos: a regra continua sem estar escrita (a M-05 decidiu que É impossível e que passa a estar escrito) |
| **C-35** · a fórmula do pool | `coracao-do-sistema.md:16` ainda junta as duas grandezas na mesma linha |
| **C-36** · Absorção usada antes de definida | os capítulos II e IV já não usam o termo (**0**), mas `centelha.md:74` (capítulo V) usa numa tabela, e a definição continua no IX |
| **C-37** · FAA e FAH | `FAH` nos dois sentidos, em `ficha-engine.ts:1756` e `efeitos.json:419`. A sigla agora aparece aberta em `acoes-corpo-e-movimento.md:167`, mas o conflito de sentido segue |
| **C-38** · numerais de capítulo | `caminhos/index.astro:9` diz "Capítulo XIV", e as outras quatro continuam com numeral literal |
| **C-39** · `[object Object]` | `artes/regras.astro:274` ainda tem `{MOLDES.aura}` |
| **C-40** · a tabela de dificuldade da /mestre | `mestre.astro:53` ainda diz "Muito difícil" |
| **C-41** · intimidação na Defesa Mental | `mestre.astro:88` ainda diz "vs Defesa Mental do alvo" |
| **C-42** · Vontade "piso 5" | o verbete continua: "reserva (piso 5)" |
| **C-43** · Especialidade "10 XP por nível" | `glossario.json:155` continua com a frase |
| **C-44** · Mana "custa o nível do efeito" | o verbete continua: "Conjurar custa Mana = nível do efeito" |
| **C-45** · Dificuldade com três degraus | o verbete continua: "(5 fácil, 10 média, 20 limite humano)" |
| **C-46** · Vontade como Atributo da Integridade | `habilidades.json:475` ainda lista `"vontade"` (a M-06 decidiu que Virtude e Vontade não se somam a nada) |
| **C-47** · verbetes que prometem número | as frases que o item cita foram REESCRITAS (as duas conferências dão 0), e os números continuam sem existir: a M-07 decidiu os três em 16/09 e nada foi implementado |
| **C-48** · tabelas cortadas | "régua continua" = **0** nos capítulos: nenhuma ganhou o rodapé |
| **C-98** · duas contas de conjuração | `artes/efeitos.astro:31`, a mesma linha do `C-19` |
| **C-99** · "a escada de seis degraus" | `relacoes-sociais.md:185` ainda usa o nome para as duas |

## Os 46 códigos que NÃO têm seção própria, e onde eles vivem

O arquivo cita **99** códigos distintos e tem **53** seções. Os outros **46** são `C-50` a `C-95`,
e eles não estão perdidos: vivem como **LINHA DE TABELA**, a partir do `LOTE 8 · varreduras de uma
palavra` (`jogador-novo-consertos.md:837`), uma linha por item, no formato
`| C-50 (75) | palavra | onde | trocar por |`. São itens de uma troca só, agrupados de propósito
porque uma passada resolve várias.

**Isso muda o denominador de qualquer contagem futura:** a lista real de consertos é de **99**
itens, dos quais 53 têm seção e 46 são linhas de tabela. Eu NÃO os inventariei, porque a rodada
pediu os 53; medir os 46 é outra passada, e eles são mais baratos de conferir (cada um é uma
palavra).

## SEGUNDA PARTE (rodada 81) · os 46 itens de tabela do `LOTE 8`

**`C-50` a `C-95`, as linhas de tabela**, medidas em 16/09/2026 com o mesmo método.

| resposta | quantos |
|---|---:|
| **FEITO** | **8** |
| **ABERTO** | **38** |
| **PREJUDICADO** | **0** |
| **NÃO SEI** | **0** |
| **soma** | **46** |

**E os 38 abertos NÃO são todos da mesma qualidade de prova, o que importa mais que o número:**

- **15 têm evidência DIRETA**: o item cita um texto, e o texto está lá. São `C-50` (Soak em 1
  página, 2 capítulos e 3 lugares de `tecnicas.json`), `C-51` (dials), `C-52` (cast, 2 em
  `/artes/regras`), `C-53` (baseline, no traço do humano em `racas.json:12` e em `racas.md:18`),
  `C-54` (knockback, 2 em `tecnicas.json`), `C-56` (as datas de decisão), `C-61` ("Esp.", 4),
  `C-64` ("empates favorecem quem defende"), `C-67` ("[nível ÷ 2]", 2), `C-73` ("ou aqui no
  texto"), `C-77` ("Utilitária"), `C-90` ("30+"), `C-93` ("e o multiplicador"), `C-94` ("Sem
  teto") e `C-95` (o Veil em `Centelha 4`, contra `limitesCriacao.centelha = 3`).
- **23 têm evidência NEGATIVA, e ela é mais fraca**: são os itens cujo defeito é uma frase, um
  link ou um número que FALTA (`C-59`, `C-60`, `C-62`, `C-63`, `C-66`, `C-68`, `C-69`, `C-70`,
  `C-72`, `C-74`, `C-75`, `C-76`, `C-78`, `C-79`, `C-80`, `C-83`, `C-84`, `C-85`, `C-86`, `C-87`,
  `C-88`, `C-89`, `C-91`). Procurei no arquivo que cada um nomeia um termo que a explicação
  pedida teria, e não achei. **Isso não é a mesma prova que achar o defeito**: quem escreveu a
  explicação com outras palavras que as minhas continuaria contado como aberto aqui. Digo o
  método junto com o número porque a diferença é essa.

  > **E ALÉM DISSO, com o que uma amostra achou quando alguém olhou** (a Revisora, rodada 64;
  > cinco dos 23, pela IDEIA e não pelo termo): quatro conferem como abertos, e um está
  > **parcial**. **O aviso de cima continua valendo e não foi substituído:** ele é um limite do
  > MÉTODO, verdadeiro sem amostra nenhuma, e a amostra não o contradiz · ela achou zero casos de
  > item já fechado em cinco, o que não é o mesmo que achar que não existem nos 18 restantes. O
  > `C-70`
  > (Destreza e Força em verbetes separados) pede que se escreva a regra da escolha, e
  > `habilidades.md:70` já diz "o Atributo (Destreza ou Força)": o conserto dele encolheu de
  > "escrever a regra" para "acrescentar três palavras", e a linha que o descreve está errada
  > sobre o próprio tamanho.
  >
  > **Então esta classe esconde DUAS coisas, e a segunda foi a que apareceu: "item MENOR do que a
  > linha dele diz".** É mais barata e mais difícil de ver que a primeira: um item já fechado some
  > da fila na primeira vez que alguém abre o arquivo, e um item superdimensionado atravessa o
  > planejamento inteiro custando o que não custa. **A amostra não foi estendida aos 23 de propósito** (dela e do
  > Arquiteto): refazer 23 leituras para achar meia frase em uma é caro, e quem for executar cada
  > item confere o tamanho dele no ato.

**Os 8 FEITO, com a evidência:**

| item | evidência |
|---|---|
| **C-55** · "banda" como sinônimo de Nível | `"banda"` = **0** em `combate.md`; o "banda morta" de `acoes-e-sistema.md`, que o item mandava MANTER, é outro sentido |
| **C-57** · "uma Técnica de um Proeza" | `"de um Proeza"` = **0** e `"uma Técnica de um"` = **0** |
| **C-58** · `8 + 2 × metros` | `"8 + 2"` = **0** em `/artes/regras` |
| **C-65** · "Ação Estendida" | `"Ação Estendida"` = **0** nos capítulos |
| **C-71** · "Conhec. Gerais" | `"Conhec. Gerais"` = **0** nos capítulos |
| **C-81** · "Artes Universais 15" | o número literal saiu: `efeitos.astro:22` traz só o rótulo, e a contagem da página vem de `d.efeitos.length` |
| **C-82** · o índice soma 189 | `"189"` = **0** na página |
| **C-92** · a escala de Centelha vai de 0 a 6 | `centelha.md:14` publica "A régua vai de **0 a 12**, e a **faixa do jogador é de 0 a 6**". Fechado pela `M-08`, e é o item que mais se aproxima de PREJUDICADO: ele foi respondido por uma decisão, e não executado como conserto |

**O denominador final das duas partes juntas: 99 itens · 21 FEITO · 78 ABERTO · 0 PREJUDICADO ·
0 NÃO SEI.**

## Três achados de passagem, que não são conserto e não foram consertados

1. **A conferência escrita do `C-05` virou falso positivo, e a culpa é da rodada 79.** Ela manda
   `grep "PV 37" vida-ferimentos-cura.md` = 0. Hoje dá **1**, e não é o Bram: é o exemplo de PV
   ímpar que eu publiquei para a régua de arredondamento da `M-21c`. O item está FEITO e a
   conferência dele acusa vermelho.
2. **Três arquivos estão com CRLF no disco**, com o índice em LF. `jogador-novo-consertos.md` é um
   deles (`git ls-files --eol` diz `i/lf w/crlf`). É o sintoma que o `CLAUDE.md` descreve na seção
   "Fim de linha · o clone que já existia", e o conserto é o procedimento de lá, uma vez por
   clone. **Não mexi:** o arquivo é ordem de serviço de outra frente.
3. **O `cost-examples.mjs` mostra duas linhas do Bram que o `C-12` não lista** (Especialidades e
   Secundárias), o que o próprio item já registra no bloco de citação. Elas continuam divergindo.
