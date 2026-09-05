# CATÁLOGO · as formas, e a pergunta que cada uma faz

**Este arquivo é a LISTA DE PERGUNTAS, e o dono dela.** Os casos continuam no princípio do
`02-projeto-harness.md`, que é onde cada forma foi achada e o que ela custou; aqui fica só o
que se pergunta ao escrever. Sem casos e sem história.

**A RÉGUA QUE ORGANIZA A LISTA: ancore a pergunta no SÍMBOLO, não no defeito.** Só sobrevive ao
instante da escrita a pergunta cujo gatilho é um símbolo que se está digitando, e não um conceito
de que seria preciso lembrar. Onde há símbolo, ele está na coluna do meio; onde não há, a coluna
diz **por gesto** e nomeia o momento, que é o mais fraco dos dois e vale saber qual é qual.

**E A LISTA NÃO É CONTADA.** Ela é lida. "Passe pelas doze formas" envelhece na forma nova
seguinte, e foi por isso que este arquivo precisou existir: a instrução citava um número, e o
catálogo não existia em lugar nenhum · morava como prosa dentro de um contrato que só uma das
partes lia.

**A REGRA DE USO:** instrumento novo passa por aqui **antes** de ser construído, e o desenho diz
quais formas se aplicam e o que fez com cada uma. Dizer "nenhuma se aplica" é resposta, desde que
seja escrita.

**E TODO GATILHO DE SÍMBOLO PRESSUPÕE QUE O OBJETO É O QUE O NOME DIZ.** Onde existe FACHADA (um
objeto que preserva a forma da chamada e troca o destino dela), ler o ponto da chamada não basta:
é preciso **resolver o que o receptor é ali**. `ctx.SB.from(...).update(...)` tem a mesma cara nas
duas abas e vai para lugares diferentes. A emenda vale para a tabela inteira, e não para uma linha
dela.

**E TODO PORTÃO NOVO PASSA PELO ENSAIO DOS TRÊS SENTIDOS**, antes de ser publicado: **vermelho
hoje**; **verde com o conserto, sem tocar no arquivo do portão**; **vermelho de novo com a
regressão**. Foi ele que reprovou duas versões do portão da migração 36 em vez de publicá-las, e a
segunda tinha ficado verde por cegueira.

---

## As formas

| a forma | o gatilho | a pergunta |
|---|---|---|
| **o zero ambíguo** | `count`, `length`, `sum`, `?? 0`, todo 0 publicado | este zero é RESULTADO ou é ausência de medida? |
| **a falha que devolve zero** | `catch`, `try`, valor de erro somado | isto é zero medido, ou é "não consegui ler"? |
| **a asserção sem ocasião** | `ok(`, `assert`, todo teste verde de primeira | a ocasião foi MONTADA, ou ela passa provando nada? |
| **a asserção negativa sozinha** | `!`, `não`, `nenhum`, `zero` numa asserção | e o PAR que mostra a coisa acontecendo? |
| **o mecanismo que nada executa** (L25) | constante exportada, bandeira, função nova | quem LÊ isto? |
| **o transporte que descarta** | `CAMPOS_*`, `pick`, `select('a,b')`, lista de chaves | a chave nova chega na OUTRA PONTA? |
| **a leitura-modificação-escrita de foto local** (L41) | `{...obj}`, `.filter`, `update({ campo: inteiro })` | quem MAIS escreve este campo? |
| **a fachada que preserva a forma e troca o destino** | `ctx.SB`, `SB`, cliente que chegou por parâmetro | quem é este SB NESTA aba, e o que a RPC faz com este campo? |
| **o portão que casa por texto fixo** | `.test(`, `includes(`, `like '`, todo portão novo | o que faz este portão ficar VERDE sem o problema ter sido resolvido? |
| **a garantia correta sobre o eixo errado** | "cobre", "uma forma nova falha alto", "isto é coberto" | verdadeira sobre QUAL dimensão, e ela é a que importa aqui? |
| **a remoção escrita como coleção inteira** | `.filter(` seguido de `update({ campo: ... })` | se este campo passar a SOMAR no servidor, esta remoção ainda remove? |
| **o escalar que descreve um conjunto** | `min(`, `max(`, `última`, "a partir de", "desde" | isto é o limite, ou é a prova de que o CONJUNTO inteiro acima dele cumpre a regra? |
| **o que não sabe dizer TIRE** | `\|\|`, `coalesce`, `filter`, `{...spread}` | isto sabe dizer TIRE, e não só PÕE? |
| **a conferência que CONTA em vez de NOMEAR** | `count(*)`, `like 'x%'`, `.length ===` | conta o mundo, ou nomeia o que este arquivo define? |
| **achar por POSIÇÃO** | `[0]`, `.at(-1)`, `limit 1`, `arquivo:123` | e se a ordem mudar? |
| **a referência por posição a lista que existe duas vezes** | "opção 1", "o segundo", numeração em prosa | esta lista existe em outro lugar, com outra ordem? |
| **a negação categórica** | "não é preciso", "não há como", "nunca" | e a OUTRA DIREÇÃO? |
| **a tolerância sem dono** | "por enquanto", "provisório", "até que" | quem decide que acabou, e o programa sabe responder? |
| **o comentário que afirma garantia** | "aparece na hora", "garante", "é impossível" | o que RODA isso? |
| **a medida batizada com o nome da causa** | nome de variável ou de coluna que afirma um porquê | o número mede o que o nome diz? |
| **o instrumento de bancada citado como prova** | `?lances=1`, mock, dublê, fixture | isto existe FORA da bancada? |
| **o dublê que não imita a forma da interface** | `async () =>` no lugar de um encadeável | o dublê tem as duas metades (aguardável E encadeável)? |
| **o `$` da regex em multilinha** | `$`, `^`, a flag `m` | o `$` casa no fim de QUAL linha? |
| **a semelhança por um elemento só** | `Set`, interseção, `1.00` | um único elemento em comum já é "o mesmo"? |
| **o texto a mais lido como sinal** | parser de seção, "a seção inteira é" | conteúdo depois da palavra muda o veredito? |
| **a janela entre a migração e o dado que ela lê** | migração que LÊ, semente, `where exists` | o dado que ela lê já EXISTE quando ela roda? |
| **o portão nunca visto vermelho** | portão novo, gate, `--check` | eu já VI este vermelho? |
| **a afirmação contra afirmação** | *por gesto:* decidir cortar alguma coisa | isto virou PROIBIÇÃO OBSERVÁVEL, ou só prosa? |
| **o fato que ninguém consegue perguntar daqui** | *por gesto:* sondar, inferir, "provavelmente rodou" | dá para trazer a resposta para DENTRO? |

**São 30**, e a contagem é do dia em que o arquivo nasceu (nasceu com 25, fechou o primeiro dia
com 29 e ganhou mais uma no dia seguinte, o que é o argumento contra citá-la) · ela não é para ser
citada em instrução nenhuma, pelo motivo escrito lá em cima.

**Duas se dobram conforme quem lê**, e vale dito porque explica a divergência entre contagens: a
*asserção sem ocasião* e a *asserção negativa sozinha* são a mesma cegueira em dois gestos (uma é
o cenário que não foi montado, a outra é a ausência da ausência); e o *zero ambíguo* e a *falha
que devolve zero* saem do mesmo valor por caminhos diferentes. Juntando os dois pares, 28.

**AS QUATRO NOVAS DE 05/09/2026 SAÍRAM DO MESMO DIA, e três delas de dentro do conserto das
outras**, que é o que as torna caras:

- **a fachada** custou saída dupla em produção (**L45**);
- **o portão que casa por texto fixo** é o zero ambíguo em forma de portão, e apareceu **dentro do
  instrumento feito para prevenir a família**: a segunda versão do portão da 36 procurava
  `.update({ mordidos` e ficou verde quando o próprio conserto trocou aquilo por `.update(patch)`.
  **Mudar o nome de uma coisa é o que um conserto faz o tempo todo**, e um portão que casa por
  literal fica verde exatamente quando o conserto acontece;
- **a garantia correta sobre o eixo errado** é a fachada falando de si mesma: ela promete que
  forma NOVA falha alto, e o que quebrou foi uma das cinco formas mudando de SIGNIFICADO no
  servidor. Não é meia verdade nem verdade expirada;
- **a remoção escrita como coleção inteira** é a que está escrita ANTES de custar alguma coisa, e
  é a terceira vez que o mesmo conserto quebraria uma remoção. Ver **L38**.

**E UMA QUINTA, DE UM DIA DEPOIS (06/09/2026), ACHADA NO PRÓPRIO INSTRUMENTO QUE RESOLVEU A QUARTA
CATEGORIA:** a leitura da tabela `migracoes` usava `min(numero) where not a_mao` como se essa conta
JÁ PROVASSE "tudo acima é automático", quando ela só prova "esta linha é automática". **É a
terceira vez que a mesma forma aparece no mesmo instrumento**: a 36 recusando publicar "a última
migração" (evitada por desenho), a conferencia por `count(*)` do L44 (corrigida depois de
envelhecer), e esta (corrigida antes de custar, pela revisora). O conserto: a fronteira virou uma
VIEW que afirma a ausência de exceção (`migracoes_fronteira`, migração 37), e não só um número.

**As duas últimas da tabela não têm gatilho de símbolo**, e são as mais fracas da lista justamente por
isso. A primeira já tem instrumento parcial (a lista de proibições observáveis); a segunda ganhou
o dela em 05/09/2026, com a tabela `migracoes` da migração 36.
