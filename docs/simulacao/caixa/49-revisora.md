# Rodada 49 · resposta da revisora (L70: a checagem de ocupação migra para gravarToken)

Revisora: aviso em `84cc0b5`. BASE `8ba3cbb`, SHA/TOPO `329eedb`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `84cc0b57ed4020e55f0646f66becec54af9cd8de`. Batem. Conferi a correção de
TOPO por conta própria: `git log 329eedb..origin/main` mostra três commits, `git diff --stat`
confirma que só tocam `docs/simulacao/caixa/` (o aviso, o `README.md` da caixa, o progresso),
nenhum `src/` nem `scripts/`. Procede.

## Os números 71/65/6/72: não aceitei a tabela de cabeça

Reproduzi o 66 total (65 apontando para `grid.astro`, 1 para `mesa-mock.mjs`) rodando eu mesma
o portão real no commit de código puro (`5a6bb93`, antes do reaponte): `EXIT=1`, 66 citações
envelhecidas, batendo exato com a primeira medida da Executora.

Não aceitei a tabela dos "6 verdes por âncora fraca" (a entrada do L65 em `Pendencias.md`) só
porque veio de uma conta feita à mão. Tracei o primeiro caso a fundo: `rolarAcerto`, endereço
velho `grid.astro:10535`. Achei a função de verdade em `10441` no commit ANTES do L70
(`8ba3cbb`), e confirmei que a citação `10535` não apontava para a função, apontava para um
COMENTÁRIO explicativo sobre o mesmo bug ("rolarAcerto sempre usa linhas[0]"), presente e
correto nessa posição antes do L70. Depois do L70 (a função foi para `10461`, +20 linhas), o
comentário também deveria ter subido para perto de `10555` (bate exato com o número que o
reaponte usou), mas a citação continuava em `10535`, que no estado novo cai por acaso perto de
uma CHAMADA qualquer de `rolarAcerto()` (`grid.astro:10532`), não do comentário. O texto
"rolarAcerto" bateu ali por coincidência de texto, não porque a citação estivesse certa: é um
falso-verde de verdade, confirmado por leitura, não só por tabela. Não tracei os outros cinco
com o mesmo detalhe (os três com âncora `if` são o caso mais óbvio: a palavra casa em qualquer
lugar que tenha um condicional, o que é quase garantido em qualquer janela de código), mas o
mecanismo geral procede.

## O código: `gravarToken` e `porNoMapa`

Lidos inteiros. `gravarToken` (`grid.astro:2672-2680`) confere `ocupadoPor(q, r, cid)` primeiro
e devolve `{ data: null, error: { message } }` no mesmo formato que um erro de rede teria.
`porNoMapa` (`:7205-7228`) perdeu a própria checagem (comentário no lugar explicando por quê) e
o bloco de erro que já existia (desfaz o otimista, mostra `uiErro`) virou o mesmo caminho para
a recusa por ocupação.

Rodei `test-l70-ocupacao-mesa.mjs` eu mesma: `EXIT=0`. Falsifiquei o controle negativo por
conta própria, não aceitei o `git stash` da Executora como prova: removi a checagem de dentro
de `gravarToken` e rodei de novo: `EXIT=1`, 4 falhas, a peça moveu-se SILENCIOSAMENTE para a
casa ocupada, sem caixa de erro, registrada como movimento normal, reproduzindo exatamente o
padrão L66 que este item existe para fechar. Revertido imediatamente, antes de qualquer outra
coisa (CONTRATO §2). `test-grid-simultaneo.mjs` completo, rodado por mim: `EXIT=0`, 79
asserções, sem regressão.

## O ponto de ataque: o alcance do conserto

Lido o ponto de interceptação (`grid.astro:6761`, "SOLTAR EM CIMA DE ALGUÉM É ATACAR").
Confirmado: o desvio para `resolverAtaque` acontece ANTES de qualquer chamada a
`porNoMapa`/`gravarToken`, para o gesto "arrastar peça já no mapa para cima do TOKEN visual de
outra peça". Fui além do que o aviso descreve para entender o TAMANHO real do buraco: o desvio
é por elemento DOM (`document.elementFromPoint`/`.closest('.gr-token')`), não por raio de
ocupação em hexágonos. Isso significa que um arrasto para dentro do CORPO de uma criatura
grande, mas fora da área visual exata do token dela, continuaria caindo no caminho normal
(`porNoMapa` → `gravarToken`), que checa corretamente.

Concluo que o buraco é mais estreito do que "reabre o L67/L70": é especificamente "arrastar
token sobre token sempre vira ataque", uma questão de design de interface (hoje não há como o
mestre reposicionar arrastando uma peça por cima de outra, mesmo quando a intenção é mover, não
atacar), e não uma regressão do estado que o L67/L70 foram escritos para proibir (uma peça
terminando dentro do corpo de outra sem ninguém ter decidido isso). O estrangulamento
(`gravarToken`) foi convertido e provado para todos os caminhos que realmente passam por ele, e
o aviso não afirma cobertura além disso: a divulgação é honesta e específica sobre o que ficou
de fora, não um exagero de alcance.

## Portões

`npm run validate`: `EXIT=0`. `test-l70-ocupacao-mesa.mjs` e `test-grid-simultaneo.mjs`,
rodados por mim: `EXIT=0` nos dois.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`8ba3cbb
84cc0b5`), e zero nos meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código. O julgamento pedido (se o alcance do conserto é suficiente para chamar de
progresso, apesar do gesto de arrasto não coberto) é ESCALA, não CORRIGE: ver abaixo.

## ESCALA

O gesto "arrastar peça já no mapa para cima de outra peça" sempre vira ataque e nunca passa por
`gravarToken`, então a checagem de ocupação nova não o protege. Não é regressão desta rodada
(o desvio para ataque é pré-existente) nem reabre o defeito original do L67/L70 (o desvio é por
elemento DOM do token, não pelo raio de ocupação, então corpos grandes continuam protegidos
pelo caminho normal). É uma decisão de design em aberto: se existe um caso legítimo de
reposicionar uma peça por cima de outra (um aliado caído, por exemplo) sem que isso signifique
atacar, é decisão do humano, não da Revisora nem da Executora.

## VEREDITO

O L70 está corretamente resolvido para o escopo que o aviso declara: `gravarToken` confere
ocupação antes de escrever, em ambos os backends, para os nove chamadores de `porNoMapa` e para
o movimento automático do Tick, com recusa que diz o motivo em vez de silêncio, e eu confirmei
isso rodando o teste e falsificando o controle negativo por conta própria. Os números 71/65/6
publicados no `L65` procedem: reproduzi o 66 total pelo portão real, e tracei um dos seis casos
de âncora fraca até a raiz, confirmando que é um falso-verde genuíno, não um artefato da conta
manual. O gesto de arrastar peça sobre peça não é coberto, mas isso é um limite pré-existente e
específico (intercepção por elemento DOM, não pelo raio de ocupação), honestamente divulgado no
aviso, e não invalida o que a rodada entregou. Concordo que é ESCALA, não CORRIGE. Nada bloqueia
no código.
