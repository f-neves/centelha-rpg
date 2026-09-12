# Rodada 56 · resposta da revisora (L86b: Acelerar a Cura, por nível da Arte)

Revisora: aviso em `bbb67b2`. BASE `3cc14b5`, SHA/TOPO `819f0d7`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `bbb67b296a38995a65a1d0f8a59d8feea95a07f0`. Batem. BASE ancestral de SHA,
`git log 819f0d7..origin/main` só mostra o próprio `bbb67b2`: TOPO = SHA procede.
`git log 3cc14b5..819f0d7` tem seis commits, não dois: os quatro primeiros (`bcc40bd`,
`ea8a899`, `b534e27`, `f0d8e0b`) são do Arquiteto, fechando a rodada 55 e decidindo as duas
perguntas do L86 antes desta rodada abrir. Não os atribuo a esta rodada. Os dois que o aviso
declara (`65d9b7a`, código; `819f0d7`, migração) são os revisados.

## Os números

`npm run validate`: `EXIT=0`, 290 citações, bate. `test-l86b-acelerar-cura.mjs`: 22/22.
`test-l86a-cura.mjs`: 32/32, sem regressão. `npx tsc --noEmit`: limpo.

## Ponto 1: a D03, correção de citação à mão

`Grep` em `artes-grid-mesa.ts` por "ATIVOS.push": uma ocorrência só, linha 1524, exata com a
citação corrigida (1515 → 1524). Fui também ver o padrão que `test-procedencia.mjs` exige de uma
citação formal: o formato `arquivo.ts:linha`. A outra menção a "ATIVOS.push" no mesmo documento
(`Pendencias.md:2701`, dentro de "`gravarEfeito` (`:1324`, `ATIVOS.push`)") não tem esse formato
(o `:1324` não tem arquivo antes do dois-pontos), então não é uma segunda citação formal e não
colide com a corrigida. Unicidade confirmada por mim, de forma independente. `(citação
histórica)` teria sido a escolha ERRADA aqui: essa marca exime uma citação de verificação porque
ela descreve um estado superado, e esta continua afirmando um fato atual e checável
(`ATIVOS.push` roda depois da gravação, é a única ocorrência) que não deixou de ser verdade.

## Ponto 2: a degradação nos dois caminhos de escrita

Lido `gravarEfeito` inteiro (`artes-grid-mesa.ts:1437-1531`). O caminho comum (degradação com
retorno de linha) está correto: `data`/`error` são reatribuídos pela segunda tentativa de insert
(sem `nivel_arte`), e `ATIVOS.push` usa esse `data` quando existe, nunca o valor que o cliente
computou antes da coluna recusar.

Achado residual real, não coberto pelo teste: o fallback final, `(data || [])[0] || linha`, usa a
variável `linha` ORIGINAL, que nunca é mutada (a desestruturação que tira `nivel_arte` cria um
objeto NOVO, `semNivelArte`, usado só no segundo insert; `linha` continua com o `nivel_arte` do
cliente do início ao fim da função). Se a gravação degradada tiver sucesso mas a tabela não
devolver a linha de volta (o comentário do próprio código, linhas 1512-1514, já trata esse
cenário como real e esperado para o caso geral, não como hipótese minha), o fallback resgataria o
`nivel_arte` do cliente mesmo na sessão degradada: exatamente o formato de inconsistência que D01
diz ter evitado. Não confirmei que esse caminho é alcançável em produção hoje (depende de como a
RLS de `arena_efeitos` responde a um INSERT+SELECT sem a coluna, que não vejo daqui), e o mock do
teste nunca simula essa combinação (o `insert` falso sempre devolve a linha inserida). Reporto
como risco condicional, verificado no código, não como defeito confirmado em comportamento.

No lado do jogador (`jogador_conjura`, migração 38), conferi que o código client-side
(`sbDoJogador()`) manda a linha inteira como `p_dados` para a RPC, então se a função ainda não
souber `nivel_arte` (versão antiga da RPC, migração não rodada), o campo simplesmente não volta
na resposta, e a mesma regra de "nulo é não sei" se aplica sem precisar de um ramo de erro
dedicado. Bate com o que o progresso da Executora já media.

## Ponto 3: o aviso de cena não colide com mordida real nem com Dissipar

`SEM_NIVEL_ARTE`/`A_SAIR` (`artes-grid.ts:1538,1550`) são strings com prefixo `__`, que nunca
colidem com um id de combatente real (UUID do Supabase). `jaMordido` (`:1596-1597`) faz um
lookup por chave exata, nunca itera nem conta todas as chaves de `mordidos`. `MORDIDAS` (o
contador global) só incrementa dentro de `porCondicao` e da função de dano, nunca dentro de
`marcarMordido` nem no bloco do aviso novo (`artes-grid-mesa.ts:2044-2066`). `dissipar`
(`:1012-1024`) filtra `ATIVOS` por `venceu`/`conjurador_id`, nunca lê `mordidos` em lugar nenhum.
Sem colisão com mordida de combatente nem com Dissipar.

## Ponto 4: as mensagens corrigidas descrevem o código de hoje

Conferidas as duas mensagens de asserção corrigidas contra `efeitos.json` no commit avisado:
`acelerar-a-cura` tem mesmo `"porNivel": true` no parâmetro Cura (`:6038`); `maos-sobre-a
-multidao` tem `"valor": "1 PV por nível da Arte"` sem `porNivel` (`:4733-4737`), batendo exato
com o texto corrigido da asserção. A frase "fato mais conferência" do log de produção
(`artes-grid-mesa.ts:2063`, "esta linha não guarda o nível da Arte (confira se a migração 38
rodou)") bate literalmente, palavra por palavra, com o que o teste espera encontrar no registro.

## Portões

`npm run validate`: `EXIT=0`. `test-l86b-acelerar-cura.mjs` e `test-l86a-cura.mjs`, rodados por
mim: `EXIT=0` nos dois, contagens batendo com o aviso. `npx tsc --noEmit`: limpo. `npm run smoke`
não roda nesta máquina (defeito de compilador já catalogado), aceito sem reconferir.

## Travessão

Varredura pelo diff inteiro (`3cc14b5..819f0d7`, via `rtk proxy git diff`, 1598 linhas, batendo
com o `--stat` de 1047+75): zero linhas adicionadas com o caractere de travessão. Meu próprio
arquivo novo (`progresso-revisora-56.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código.

## PERGUNTA

Nenhuma.

## ESCALA

O achado do Ponto 2 (o fallback `|| linha` de `gravarEfeito` pode devolver o `nivel_arte` do
cliente mesmo numa gravação degradada, se o insert sem essa coluna tiver sucesso e a tabela não
devolver a linha) não bloqueia esta rodada porque não confirmei que é alcançável em produção hoje,
e o comportamento comum (com retorno de linha) está correto. Registro para quando alguém tiver
acesso para conferir a RLS de `arena_efeitos` em INSERT+SELECT sem `nivel_arte`, ou para quando o
mock ganhar um caso de "insert sem retorno" que hoje nenhum teste deste repositório simula.

## VEREDITO

A rodada 56 procede sem bloqueio. Os quatro pontos pedidos se sustentam contra o código: a D03
está corretamente justificada (unicidade confirmada por mim, e marcá-la histórica teria sido
errado, porque ainda afirma um fato vivo); a degradação funciona no caminho comum dos dois
escritores (mestre e jogador), com um risco residual real mas não confirmado no fallback sem
retorno de linha, que registro como ESCALA; o aviso de cena não colide com mordida nem com
Dissipar, conferido pelas três estruturas que poderiam colidir (chave, contador, filtro); e as
mensagens de asserção corrigidas batem exatamente com o `efeitos.json` e o log de produção de
hoje. Nada bloqueia, nada corrige no código.
