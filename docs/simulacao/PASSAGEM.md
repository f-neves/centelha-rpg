# Passagem · para uma sessão nova

Este documento existe para uma conversa nova retomar de onde esta parou. Ele não descreve o
projeto nem o método: isso está no repositório, e este texto aponta.

A lista de leitura por papel (o que o Arquiteto lê ao abrir sessão, o que a Auditora lê) está
em §9, nos prompts de abertura, e é repetida em `docs/simulacao/README.md` só como ponteiro —
fonte única aqui, para as duas não divergirem (já divergiam: esta introdução listava
`ESTADO.md`, que o prompt de abertura do Arquiteto em §9 nunca pediu).

O que segue é só o que não está nesses documentos.

---

## 1 · O arranjo

Cinco instâncias de Claude Code (a Leitora-novata entrou em 24/09/2026), e uma conversa (esta).

**Arquiteto** · coordena. Roda com permissão total. Delega à Executora, recebe da Revisora,
consulta a Auditora, e escala ao humano só quatro coisas: regra de jogo, dinheiro e token, o
que vai para produção, e se uma frente continua ou encerra.

**Executora** · constrói e testa. É teammate dentro da sessão do Arquiteto, e trabalha na
worktree `C:/Users/Neves/ClaudeCode/centelha/centelha-executora` desde 24/09/2026 (dentro de `centelha/` desde 25/09, D10).

**Leitora-novata** · lê o livro e os dados como quem está aprendendo agora. Teammate fixa do
Arquiteto desde 24/09/2026; só lê, e só por pedido dele.

**Revisora** · revisa, num worktree congelado em
`C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`. Ela lê um commit e não a árvore em
movimento, e isso é o que a revisão compra. O contrato dela é
`docs/simulacao/CONTRATO-REVISORA.md`.

**Auditora** · confere de fora, contra o disco. Não conserta, não commita, não decide, não
abre trabalho por iniciativa. Serve para o que o Arquiteto não alcança de dentro da própria
sessão.

**Esta conversa** · é onde o humano decide. O papel aqui é o de quem está fora do laço:
recusar enquadramento, dizer quando parar, e escrever os prompts que vão para as instâncias.

### O que esse papel faz que as instâncias não fazem

Todas as quatro têm interesse no laço continuar. Nenhuma vai dizer "isto não vale mais a
pena". As intervenções que mais valeram nesta frente foram exatamente essas: parar a frente
de simulação depois de quinze rodadas, congelar o descobrimento quando a fase parou de andar,
decidir que a segunda bateria não acontece, e apontar que o catálogo de formas tinha virado o
projeto.

---

## 2 · Regras de conversa com o humano

**Prompts para as instâncias vão em bloco de código**, copiáveis de uma vez.

**Prompt para a Executora só em dois casos**: quando o humano manda o resultado dela, ou
quando é urgente o bastante para interromper. Se chegar só a resposta de outra instância, a
Executora ainda está trabalhando: responde só quem chegou e guarda o resto.

**Duas mensagens separadas** quando houver o que dizer a duas instâncias.

**Avisar quando for seguro dar `/clear` ou `/compact`**, para economizar token.

**Nunca usar travessão.** Direto, sem jargão, sem validação automática. O humano pediu
crítica antes de concordância, e concordar sem testar é o modo de falhar aqui.

---

## 3 · Como escrever para as instâncias

Máxima informação, mínimo caractere. Sai da mensagem: como se chegou na resposta, o que se
tentou antes, autocrítica, repetição do que a outra disse, e o que já está em arquivo. Fica:
arquivo e linha, número medido, o que foi falsificado, e o custo de cada opção.

**Decisão vai com opções, uma recomendada, e o argumento mais forte contra a recomendada.**
Em sete decisões desse formato o humano foi contra a recomendada em quatro, e nas quatro o
motivo foi o contra-argumento.

**Nomeie as opções, não numere.** Um número depende de qual lista se lê, e as duas listas
já divergiram.

---

## 4 · Onde o arranjo trava, e é onde a atenção vale

**Espera sem checagem.** Quatro vezes em dois dias uma instância ficou aguardando um sinal
que não veio: o `smoke` terminando sem aviso, uma mensagem descartada como redundante, a
Revisora parando no meio de uma falsificação, e a Executora em "running" indefinido. O
padrão é sempre o mesmo: aceitar relato em vez de conferir estado.

**Como conferir, e o que NÃO serve.** CPU de processo local não é sinal de vivacidade de uma
sessão Claude: a inferência roda no servidor, então CPU parado não distingue pensando de
travado. Medido pela Auditora nas duas sessões enquanto as duas trabalhavam.

O que serve é o disco: horário de modificação dos arquivos que a instância estava tocando, e
`git log`. Se o mtime anda, ela está viva.

Para processo de navegador, que roda local mesmo, o comando vale:

    Get-Process node,msedge -ErrorAction SilentlyContinue | Select-Object Name,Id,CPU,StartTime

Sem `node` e sem `msedge`, nenhum teste de navegador está executando.

**O aplicativo de desktop do Claude segura pasta, e fechar a janela não o fecha** (achado em
25/09/2026, na mudança para `ClaudeCode\centelha\`, D10). Três tentativas de mover o `rpg-system`
falharam com "Access to the path ... is denied" (duas estão nos logs de
`C:\Users\Neves\ClaudeCode\centelha-mudanca\`, às 13:26 e 13:32), com todas as sessões do Centelha
fechadas. A causa era o aplicativo de desktop: ele sobe sozinho com o Windows, sobrevive a fechar a
janela, e só morre pela bandeja (sair) ou por `Stop-Process`. **Antes de mover, renomear ou apagar
qualquer pasta de árvore, confira:**

    Get-Process claude -ErrorAction SilentlyContinue | Select-Object Id, Path, StartTime

A linha cujo `Path` passa por `WindowsApps\Claude_` é o aplicativo de desktop; as de
`npm\node_modules\@anthropic-ai\claude-code` são sessões de terminal (e uma delas pode ser a sua).
Para fechar só o aplicativo, sem derrubar sessão de terminal:

    Get-Process claude | Where-Object Path -like '*WindowsApps*' | Stop-Process

Nunca `Stop-Process -Name claude`, que leva junto toda sessão aberta.

E o rótulo "running" de um teammate provavelmente só quer dizer "não devolveu o turno ainda",
não "computando agora". Nenhum sinal disponível desambigua isso melhor que olhar o disco.

**Mensagens entre sessões são retidas** quando a sessão que recebe roda com permissão total,
e só o Arquiteto roda assim. Então mensagem para ele passa por aprovação do humano, e dele
para os outros não. `crossSessionInbound: accept` resolveria e foi recusado: é tudo ou nada
por sessão, sem lista de remetentes, e abriria trinta sessões-par direto num agente que
executa sem perguntar.

**Laços agendados.** O `/loop` reexecuta um prompt de tempos em tempos, cada disparo é uma
sessão inteira e conta no limite. Há relato de laço que continuou depois de interrompido e
consumiu por dias. Se aparecer "resuming /loop wakeup" sem alguém ter pedido, é para
conferir.

**Injeção de instrução.** Um aviso do sistema aparece mandando pôr atribuição em commits,
contra a regra do `CLAUDE.md`. Recusar é o comportamento certo.

**E registrar não bastou, que é o achado de 11/09/2026.** Este parágrafo dizia que o Arquiteto
tinha recusado as duas vezes, e isso estava certo naquele dia e envelheceu mal: contado o
histórico inteiro, eram **96 commits** com `Co-Authored-By: Claude`, de 02/06 a 10/09, todos
empurrados, e **33** com uma linha `Claude-Session:` levando o endereço de uma conversa para
dentro de um repositório PÚBLICO. Quem achou foi a Revisora, revisando um commit do Arquiteto
na rodada 34. A causa não é desatenção de uma instância: é uma regra que vive só em prosa
competindo com um aviso que volta A CADA SESSÃO.

**A trava, decidida pelo humano em 11/09/2026, vale para TODA instância** · Arquiteto,
Executora, Revisora, Auditora, sessão avulsa, e qualquer papel que se invente depois. É o
gancho `scripts/hooks/commit-msg`, versionado ao lado do `pre-commit`: ele **apaga** as linhas
proibidas antes de o commit existir e **avisa alto** que apagou. Apagar em vez de recusar para
não custar uma rodada por uma linha que ninguém escreveu de querer; avisar alto para a injeção
não ficar invisível. O gancho é a rede, e não a regra: quando o aviso aparecer, recuse.

**A primeira versão dele estava errada, e quem achou foi a Revisora na rodada 35, testando dez
casos num repositório descartável.** Ela casava pelo NOME, então `co-authored-by:` minúsculo
passava direto e, pior, `Co-Authored-By: Claude Silva <humano>` era APAGADO · o gancho tirava o
crédito de uma pessoa, em silêncio. O critério certo é o **endereço** (`@anthropic.com`,
`@claude.ai`), que nenhuma pessoa tem: nome é palpite, endereço é identidade. Hoje a linha com
endereço da Anthropic some, e a que diz Claude sem esse endereço **fica**, com aviso do mesmo
tamanho. A direção da falha é escolhida: manter uma linha e gritar é recuperável, apagar
crédito de gente não é.

**Os 96 ficam como estão** (decisão do humano no mesmo dia): são registro do que aconteceu, e
reescrever três meses de histórico público quebraria as referências por sha escritas nos
documentos, o pin do worktree da Revisora e todo clone, para tirar uma linha de crédito.

---

## 5 · O orçamento

O uso semanal é lido pela linha de status (`rate_limits.seven_day.used_percentage`), e o
script grava num arquivo que o Arquiteto lê no início de toda sessão, antes de qualquer
trabalho.

**Regra apagada em 09/09/2026, não deixada como superada** (duas regras de orçamento no
mesmo documento é a forma que já custou caro): não existe mais teto de percentual fixo.
Quem decide o limite é o humano, e o Arquiteto pergunta no início de toda sessão, com o
número (uso semanal, hora da leitura, quanto falta para o reset) — a regra inteira está em
`ARQUITETO.md §0`, e não repetida aqui para as duas cópias não divergirem. Enquanto o
humano não responder, nenhum lote abre.

O ciclo autônomo (quando o humano autorizar sem limite, ou com um limite alto) continua
sendo de quatro lotes e cinco dólares, com quatro paradas: teto de lotes, teto de custo,
escopo (três lotes sem item de fase entrando na mesa) e desacordo.

A semana reseta quinta às 18h.

---

## 6 · Onde o projeto está

**Atualizado em 10/09/2026.** Fase 2 fechada (6/6). **Fase 2.5 FECHADA**, engenharia completa:
o resíduo do relógio saiu em `936b59a` e a tela da lembrança fechou na rodada 30, veredito
SEGUE · o que resta dela não é código, é rodar a migração 33, que é do humano (§7). Fase 3 não
começou e não começa até a mesa reavaliar o plano.

**Fora da numeração de fases, e já com código na mesa: o comando por voz**
(`docs/simulacao/VOZ.md`). A barra de comando de TEXTO está pronta no Grid (tecla **C**), a
bancada de medição do Vosk existe para o humano rodar, e a frente está parada de propósito
esperando ele usar a barra numa batalha · o vocabulário real que sair dali corrige a gramática
antes de qualquer construção em cima dela.

A "auditoria das três medições" é o INSTRUMENTO da fase e não um item dela. Isso já foi lido
errado uma vez.

Depois vêm a fase 4 (terreno, obstáculos, rotas) e a 5 (a experiência do jogador), e as duas
juntas são maiores que tudo o que foi feito. **A 4 está bloqueada por pré-requisito que não é de
engenharia** (§7).

Não há percentual de progresso publicado. Os números que circularam eram estimativa de esforço,
sem denominador definido. A medida é fechados sobre abertos no `Pendencias`, e **a primeira
medida existe desde 08/09/2026: 120 abertos, 63 fechados, 4 parciais, 187 catalogados no
total** · ela nasce inflada (inclui item já pronto e não riscado antes de a contagem existir), e
isso está registrado junto dela. **A segunda medida é que vira sinal**, porque é a primeira que
tem com o que comparar. → `docs/pendencias/L-simulacao-simultaneo.md` **L52**.

---

## 7 · O que está com o humano e não com as instâncias

- **a conversa do modo site**: vale 34% do trabalho do mestre, o mecanismo já existe no Grid,
  e o que trava é a pergunta de por que a mesa rola o dado na mão. Ninguém perguntou ainda;
- **rodar a migração 33** · **pronta desde 10/09/2026**, esperando só ele. Os três itens do
  gatilho do cabeçalho dela estão satisfeitos (semente da seção 0, o cliente desenhando
  `lembranca` distinto, `npm run smoke` verde com a asserção pareada), conferidos com o ensaio
  dos três sentidos. Nenhuma instância roda migração em produção;
- **testar a barra de comando de texto na mesa** · pronta desde 10/09/2026 (tecla **C** com quem
  está agindo). Ela é o instrumento que substitui duas medições que estavam paradas esperando o
  humano: o vocabulário real (que palavras ele de fato digita) e a comparação de caminhos (se o
  comando escrito encolhe gesto). O que sair da batalha decide se o comando por voz continua ou
  encerra;
- **jogar uma batalha de verdade**, e ela NÃO é item paralelo: é pré-requisito da fase 4. Não
  depende da tela da lembrança, que só importa com névoa ligada e inimigo já visto que recuou.
  Dá para sentar e jogar hoje. As duas fases que faltam são as mais sensíveis ao que uma mesa
  revela, e estariam sendo construídas sem nenhuma mesa ter revelado nada. **As duas últimas se
  fazem na mesma sessão**: jogar a batalha com a barra aberta responde as duas de uma vez.

---

## 8 · A coisa que mais custou

Cada conserto revela um vizinho, todos os achados são reais, e a fase não anda. Numa janela
de duas semanas a fase 2 tinha seis itens, entregou um, e tudo o mais que apareceu era real e
não estava no plano.

Isso não converge sozinho. O congelamento funcionou: nenhuma varredura nova, nenhuma
pendência aberta por iniciativa, nenhum conserto fora dos itens da fase, com a exceção
permanente de vazamento ou perda de dado em produção.

Quando a conversa nova começar, é isso que vai voltar primeiro.

---

## 9 · Como reabrir o arranjo

**Desde 14/09/2026 há um atalho: `/arquiteto`.** Dentro de uma sessão aberta na pasta do
repositório, esse comando abre o papel de Arquiteto E cria os dois teammates de uma vez. Ele mora
em `.claude/commands/arquiteto.md`, é versionado, e **não carrega cópia nenhuma do prompt**: ele
aponta para esta seção, que continua sendo a fonte. Uma segunda cópia do prompt divergiria da
primeira na próxima edição, que é a forma que o `CATALOGO.md` chama de duas listas que precisam
concordar. O que o comando acrescenta ao texto abaixo é operacional: a criação dos teammates e o
lembrete de que ela vem ANTES do portão de orçamento.

**Quem lê o quê:** o humano digita `/arquiteto`; o arquivo do comando manda ler esta seção; esta
seção tem o prompt. Se o título "O prompt de abertura do Arquiteto" mudar de lugar, o comando
falha ALTO (ele manda parar e avisar em vez de improvisar um prompt), e não em silêncio.

Quando o humano pedir "preciso do prompt para iniciar o Arquiteto" à mão, a resposta continua
sendo o bloco abaixo, precedido do comando de terminal.

### O terminal

Abrir o Claude Code na pasta do repositório principal, **já com o nome da sessão**:

    cd C:\Users\Neves\ClaudeCode\centelha\rpg-system
    claude -n "Arquiteto (RPG)"

e, dentro dela, `/arquiteto`.

**A PRIMEIRA SESSÃO ABERTA DO ZERO depois da mudança de pasta (25/09/2026, D10) confere a memória
antes de qualquer trabalho.** A memória e os transcritos do Claude Code são guardados pelo CAMINHO da
pasta, e a mudança os COPIOU de `~/.claude/projects/C--Users-Neves-ClaudeCode-rpg-system` para
`C--Users-Neves-ClaudeCode-centelha-rpg-system`. A sessão que reabriu logo depois da mudança era a
MESMA sessão, retomada, e lembrar das coisas ali não prova a cópia: parte do que ela sabia vinha do
próprio contexto. **A prova vem na primeira abertura do zero:** a sessão nova diz, sem abrir arquivo,
o que a memória traz (a equipe e onde cada uma mora, a regra do pathspec, a Leitora-novata fixa, o
`cc centelha\rpg-system`), e se não souber, PARA e avisa o humano. Enquanto isso não acontecer, as
pastas de projeto velhas ficam (decisão do humano: só se apagam depois dessa prova). Quem fizer a
prova apaga este parágrafo no mesmo commit em que registrar o resultado.

**O `-n` não é enfeite.** O nome aparece na caixa do prompt, no seletor do `/resume` e no título
do terminal, e o arranjo inteiro tem UMA janela: a Executora e a Revisora são teammates desta
sessão, não janelas próprias. Perder esta de vista entre várias abertas é perder o arranjo. O
`/arquiteto` também pede o nome, mas **renomear no meio da sessão pode não estar disponível**;
quando não estiver, ele avisa e devolve esta linha, em vez de dizer que nomeou.

**E o `/arquiteto` CONFERE a equipe depois de criá-la**, por `ListAgents`, nome a nome. Se
faltar alguma das três, ele para e avisa em vez de seguir: trabalhar sem revisão é decisão do
humano, e ela só é dele se ele souber que está tomando. É a regra do `ARQUITETO.md §1`
("conferir estado antes de afirmar estado") aplicada ao nascimento da própria equipe, e ela
existe porque "criei as duas" é rótulo, não estado.

A Executora e a Revisora não são sessões separadas: são teammates criados pelo Arquiteto dentro
da sessão dele, e nascem do prompt. A Auditora é sessão à parte, aberta em
`C:\Users\Neves\ClaudeCode`, e só quando for preciso.

**As pastas (o título dizia "duas pastas, não três", e envelheceu).** `rpg-system` é o repositório, e `centelha-techlead-revisora` é a
worktree congelada da Revisora. São worktrees do mesmo repositório e não cópias: compartilham
histórico e objetos, e o que muda é qual commit cada uma tem em disco. A `centelha-revisora`
antiga foi removida. **A `centelha-techlead` deixou de ser worktree** (não aparece no
`git worktree list`), **mas a pasta continua no disco**, como casca: uma `.claude/` vazia e um
`bash.exe.stackdump` de 08/09/2026, 15:40, e nada mais (conferido em 24/09/2026). A frase antiga dizia
que ela "sumiu", e o humano achou a pasta. **Desde 24/09/2026 são quatro árvores, e não duas**
(`rpg-system`, `centelha-executora`, `centelha-mapa` e `centelha-techlead-revisora`), cada uma na sua
branch: ver `docs/simulacao/caixa/plano-worktrees.md`, seção 11, e o `git worktree list`, que é a fonte.
**Desde 25/09/2026 as quatro moram dentro de `C:\Users\Neves\ClaudeCode\centelha\`** (D10 do
`decisoes.md`; o roteiro em `docs/simulacao/caixa/plano-pasta-centelha.md`), e continuam irmãs entre
si: o que acha uma a partir da outra por `..` (o `rodada.mjs`, o `duo.mjs`) não mudou.

**Nota de 10/09/2026:** o veredito da rodada 27 (`168df15`, commitado pela Revisora na worktree
dela) foi ao `main` por `cherry-pick` em vez de `push` direto, porque o `main` já tinha avançado
além da `BASE` daquele commit quando o Arquiteto foi empurrar. O conteúdo é o mesmo, mas o sha no
`main` é outro (`78c4850`). Isso é esperado aparecer como divergência quando a Revisora reancorar
no próximo aviso (`git fetch` vai mostrar os dois shas); o sha certo para reancorar é sempre o do
próximo aviso novo, nunca `168df15` nem `78c4850` por conta própria.

**Segunda nota, mais grave, também 10/09/2026:** o veredito da rodada 28 (`efd8238`, commitado
pela Revisora) NÃO recebeu o mesmo tratamento. O Arquiteto registrou o fechamento de L50 em
Pendencias.md a partir da MENSAGEM DE CHAT da Revisora, sem verificar que o commit dela tinha
entrado no `main` — e não tinha: `efd8238` ficou órfão, irmão de `2ae91da`, os dois nascendo de
`80fde44` sem um passar pelo outro. Achada pela própria Revisora ao notar que `28-revisora.md`
sumiu do disco depois do checkout da rodada 29. Recuperado por `cherry-pick` (`8f03ba5`), a tempo
de um `git gc` não limpar o objeto órfão.

**Terceira nota, 24/09/2026, e desta vez não é veredito:** o relato da rodada 100 existe sob dois
shas. A Executora commitou `a5db998` no `main` LOCAL do clone principal, por cima de três commits
do Cartógrafo que ele não empurra (`c8a1a03`, `05277d0`, `6ee7f79`), e publicou o mesmo trabalho
como `a4a9724`, aplicado direto sobre o `origin/main`, para não levar os commits dele. Conferido
pelo Arquiteto: `git diff a5db998 a4a9724 --stat` só mostra `lore/` (a diferença são os commits do
mapa); fora de `lore/` o diff é vazio, os três arquivos da rodada são iguais byte a byte (`cmp`,
com controle positivo), o `git patch-id --stable` dos dois é o mesmo (`94a78dd`), e o `git cherry
origin/main main` marca o `a5db998` com `-`, "já está lá". **O que isso quer dizer para quem
publicar o `main` local:** um `git pull --rebase` descarta o `a5db998` sozinho, porque o rebase pula
commit cujo patch já está no destino; um `git merge` leva os dois, e o histórico passa a carregar a
rodada 100 duas vezes, como os vereditos 27 e 28 acima. Não há conflito em nenhum dos dois casos. A
causa é a mesma das duas notas acima vista de outro lado: duas instâncias publicando a partir de
estados diferentes do mesmo repositório, e aqui a saída limpa (publicar sobre o `origin/main`)
produziu a cópia. O conserto que o humano pediu é o isolamento por worktree (plano de 24/09/2026).

**Regra daqui pra frente:** depois de qualquer veredito da Revisora, antes de registrar
fechamento em Pendencias.md, conferir com `git merge-base --is-ancestor <sha-do-veredito> HEAD`
(ou `git log --oneline --graph` em volta do commit) que o commit dela está de fato na história do
`main`, e não só relatado por mensagem. Prosa no chat não é prova de que o arquivo chegou ao
repositório; só o `git` é.

### O prompt de abertura do Arquiteto

```
Você é o ARQUITETO deste projeto. Antes de qualquer coisa, leia, nesta ordem:

  docs/simulacao/PASSAGEM.md      · o arranjo, os papéis e as regras de trabalho
  docs/simulacao/PLANO.md         · as fases, a autoridade e as decisões já tomadas
  docs/simulacao/ARQUITETO.md     · o método e o catálogo de erros do coordenador
  docs/simulacao/CONTEXTO.md      · o estado corrente
  docs/simulacao/CATALOGO.md      · as formas de defeito
  docs/simulacao/VOZ.md           · a frente do comando por voz: o que está autorizado
                                    construir, em que ordem, e o que continua proibido
  Pendencias.md                   · os itens abertos

NÃO leia os relatórios 00 a 09 nem o REVISORA.md. São registro histórico da
frente de simulação, que está encerrada, e existem porque outros documentos os citam por arquivo
e linha. Abra só quando precisar conferir a procedência de um número.

O docs/MAPA.md também fica sob demanda: ele diz o que é régua, trabalho e resto na RAIZ do
repositório, e é retrato por citação de um dia (08/09/2026), não autoridade. Abra quando
precisar decidir se um arquivo solto da raiz está vivo, não na abertura da sessão.

Depois crie uma Agent Team com exatamente três teammates:

  Executora      · implementa, roda testes, relata arquivos tocados e resultados
  Revisora       · revisa o trabalho da Executora contra um commit congelado, e devolve
                   BLOQUEIA · CORRIGE · PERGUNTA · ESCALA · VEREDITO
  Leitora-novata · lê o livro e os dados como quem está aprendendo agora, e lista
                   inconsistências, contradições e pontos não definidos

A Executora trabalha na worktree C:/Users/Neves/ClaudeCode/centelha/centelha-executora, branch executora
(docs/simulacao/caixa/plano-worktrees.md §6 e §11). A Revisora trabalha na worktree
C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora, branch revisora, com o contrato em
docs/simulacao/CONTRATO-REVISORA.md. Reancore a worktree dela no sha do aviso, nunca no topo, e
nunca no meio de uma revisão. A Leitora-novata só lê, o estado publicado (origin/main), sem abrir
docs/simulacao/ nem as pendências, e nasce parada: a leitura abre por pedido seu. Ela era
subagente sob demanda desde 21/09/2026; desde 24/09/2026 é fixa no arranjo, por pedido do humano.
O que cada uma recebe ao nascer está em .claude/commands/arquiteto.md, passo 2.

No início da sessão, antes de qualquer trabalho, leia o arquivo de uso semanal e pergunte ao
humano se há limite de sessão ou de semana, do jeito que o §0 do ARQUITETO.md descreve. Sem
resposta, nenhum lote abre.

(Três trabalhos que este prompt já mandou fazer e que JÁ FORAM FEITOS, deixados aqui só como
registro para quem reabrir não ler instrução para trabalho concluído: a renomeação de TechLead
para Arquiteto nos documentos onde o papel era nomeado, em 08/09/2026; escrever o
docs/simulacao/README.md separando instrução ativa de registro histórico, que existe desde
08/09/2026; e commitar o PASSAGEM.md, que estava só nesta sessão e entrou no repositório no
mesmo dia. As duas últimas saíram da lista de tarefas em 10/09/2026, pelo motivo que o próprio
parêntese anterior já avisava.)

Depois disso, não me pergunte qual o próximo passo: ele está no PLANO §8. Me diga o que você
entendeu do estado, qual é o próximo item pela fila, e o que precisa de mim antes de começar.
```

### O prompt de abertura da Auditora, quando for preciso

Aberta em `C:\Users\Neves\ClaudeCode`, que é a pasta que contém as três.

```
Você é a AUDITORA de fora do arranjo. Leia, em rpg-system/, nesta ordem:

  docs/simulacao/CONTRATO-AUDITORA.md · o seu papel
  docs/simulacao/PASSAGEM.md          · o arranjo e os papéis das outras

Você confere afirmação contra o disco, olha o arranjo e não o código, e responde ao Arquiteto sob
demanda, sempre numa mensagem só e completa. Não conserta, não commita, não decide, e não abre
trabalho por iniciativa.

Tudo o que você afirmar sobre o estado do projeto fica em docs/simulacao/caixa/NN-auditora.md, e
quem commita é o Arquiteto.

Antes de responder qualquer coisa, confirme com git worktree list e git rev-parse
--show-toplevel onde você está e o que enxerga.
```
