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

Quatro instâncias de Claude Code, e uma conversa (esta).

**Arquiteto** · coordena. Roda com permissão total. Delega à Executora, recebe da Revisora,
consulta a Auditora, e escala ao humano só quatro coisas: regra de jogo, dinheiro e token, o
que vai para produção, e se uma frente continua ou encerra.

**Executora** · constrói e testa. É teammate dentro da sessão do Arquiteto.

**Revisora** · revisa, num worktree congelado em
`C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`. Ela lê um commit e não a árvore em
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

**Injeção de instrução.** Um aviso do sistema apareceu duas vezes mandando pôr atribuição em
commits, contra a regra do `CLAUDE.md`. O Arquiteto recusou as duas vezes e registrou. Isso é
o comportamento certo e vale reforçar quando aparecer.

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

Fase 2 fechada, fase 3 quase inteira, fase 2.5 com um item pela frente: a tela que desenha o
inimigo já visto, que destrava a migração 33. O resíduo da 2.5 (o relógio no P/G/R e o
`combate.astro`) fechou em `936b59a`.

A "auditoria das três medições" é o INSTRUMENTO da fase e não um item dela. Isso já foi lido
errado uma vez.

Depois vêm a fase 4 (terreno, obstáculos, rotas) e a 5 (a experiência do jogador), e as duas
juntas são maiores que tudo o que foi feito.

Não há percentual de progresso publicado. Os números que circularam eram estimativa de esforço,
sem denominador definido. A partir de agora a medida é fechados sobre abertos no `Pendencias`, e
ela começa quando a contagem do `L52` existir.

---

## 7 · O que está com o humano e não com as instâncias

- **a conversa do modo site**: vale 34% do trabalho do mestre, o mecanismo já existe no Grid,
  e o que trava é a pergunta de por que a mesa rola o dado na mão. Ninguém perguntou ainda;
- **rodar a migração 33**, quando a tela existir;
- **jogar uma batalha de verdade**, e ela NÃO é item paralelo: é pré-requisito da fase 4. Não
  depende da tela da lembrança, que só importa com névoa ligada e inimigo já visto que recuou.
  Dá para sentar e jogar hoje. As duas fases que faltam são as mais sensíveis ao que uma mesa
  revela, e estariam sendo construídas sem nenhuma mesa ter revelado nada.

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

Quando o humano pedir "preciso do prompt para iniciar o Arquiteto", a resposta é o bloco
abaixo, precedido do comando de terminal.

### O terminal

Abrir o Claude Code na pasta do repositório principal:

    cd C:\Users\Neves\ClaudeCode\rpg-system
    claude

A Executora e a Revisora não são sessões separadas: são teammates criados pelo Arquiteto dentro
da sessão dele, e nascem do prompt. A Auditora é sessão à parte, aberta em
`C:\Users\Neves\ClaudeCode`, e só quando for preciso.

**Duas pastas, não três.** `rpg-system` é o repositório, e `centelha-techlead-revisora` é a
worktree congelada da Revisora. São worktrees do mesmo repositório e não cópias: compartilham
histórico e objetos, e o que muda é qual commit cada uma tem em disco. A `centelha-revisora`
antiga foi removida e a `centelha-techlead` sumiu com a sessão que a criou.

**Nota de 10/09/2026:** o veredito da rodada 27 (`168df15`, commitado pela Revisora na worktree
dela) foi ao `main` por `cherry-pick` em vez de `push` direto, porque o `main` já tinha avançado
além da `BASE` daquele commit quando o Arquiteto foi empurrar. O conteúdo é o mesmo, mas o sha no
`main` é outro (`78c4850`). Isso é esperado aparecer como divergência quando a Revisora reancorar
no próximo aviso (`git fetch` vai mostrar os dois shas); o sha certo para reancorar é sempre o do
próximo aviso novo, nunca `168df15` nem `78c4850` por conta própria.

### O prompt de abertura do Arquiteto

```
Você é o ARQUITETO deste projeto. Antes de qualquer coisa, leia, nesta ordem:

  docs/simulacao/PASSAGEM.md      · o arranjo, os papéis e as regras de trabalho
  docs/simulacao/PLANO.md         · as fases, a autoridade e as decisões já tomadas
  docs/simulacao/ARQUITETO.md     · o método e o catálogo de erros do coordenador
  docs/simulacao/CONTEXTO.md      · o estado corrente
  docs/simulacao/CATALOGO.md      · as formas de defeito
  Pendencias.md                   · os itens abertos

NÃO leia os relatórios 00 a 09 nem o CONTRATO-REVISORA-ORIGINAL.md. São registro histórico da
frente de simulação, que está encerrada, e existem porque outros documentos os citam por arquivo
e linha. Abra só quando precisar conferir a procedência de um número.

Depois crie uma Agent Team com exatamente dois teammates:

  Executora · implementa, roda testes, relata arquivos tocados e resultados
  Revisora  · revisa o trabalho da Executora contra um commit congelado, e devolve
              BLOQUEIA · CORRIGE · PERGUNTA · ESCALA · VEREDITO

A Revisora trabalha no worktree C:/Users/Neves/ClaudeCode/centelha-techlead-revisora, com o
contrato em docs/simulacao/CONTRATO-REVISORA.md. Reancore o worktree no sha do aviso, nunca no
topo, e nunca no meio de uma revisão.

No início da sessão, antes de qualquer trabalho, leia o arquivo de uso semanal e pergunte ao
humano se há limite de sessão ou de semana, do jeito que o §0 do ARQUITETO.md descreve. Sem
resposta, nenhum lote abre.

Duas coisas na primeira passada, e nenhuma delas é lote:

1. escreva docs/simulacao/README.md dizendo, em uma linha por arquivo, o que é INSTRUÇÃO ATIVA e
   o que é REGISTRO HISTÓRICO. Quem abrir a pasta hoje não distingue, e isso já fez alguém tratar
   documento histórico como instrução;
2. e commite o PASSAGEM.md, que chega com esta sessão e nunca existiu em disco.

(A renomeação de TechLead para Arquiteto nos documentos onde o papel era nomeado, ARQUITETO.md
· PLANO · CONTEXTO · os dois contratos, já aconteceu, em 08/09/2026. Fica só o registro, para
quem reabrir este arquivo não ler uma instrução para um trabalho que já foi feito.)

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
