# README · o que é instrução e o que é registro

Esta pasta mistura duas coisas que não se leem do mesmo jeito: **instrução ativa** (rege o
trabalho de hoje, muda quando o trabalho muda) e **registro histórico** (descreve o que já
aconteceu, e só se abre para conferir a procedência de um número ou de uma decisão). Quem
abre a pasta sem este arquivo não distingue as duas, e isso já aconteceu: um documento
histórico foi tratado como instrução.

A regra prática: se o arquivo está na tabela "instrução ativa" abaixo, leia antes de
trabalhar. Se está em "registro histórico", não leia de ponta a ponta — abra só quando
precisar conferir de onde um número ou uma frase saiu, geralmente porque `CATALOGO.md`,
`CONTEXTO.md` ou `Pendencias.md` cita o arquivo e a linha.

## Lista de leitura, por papel

Nem toda instrução ativa é para todo mundo. A tabela abaixo é o inventário inteiro; a lista de
leitura é o recorte por quem vai ler, e o critério é **instrução ativa para o papel**, não
"tudo que está em uso hoje" — a Auditora não precisa da régua de arremesso, e o Arquiteto não
precisa de `Grid_Mobile.md` para abrir a semana. **Fonte única: `PASSAGEM.md` §9**, os prompts
de abertura; a lista abaixo aponta para lá em vez de copiar, para as duas não divergirem.

- **Arquiteto**, ao abrir uma sessão nova: a lista e a ordem estão no prompt de abertura, em
  `PASSAGEM.md §9`, e **não são repetidas aqui de propósito** · esta cópia existiu, divergiu no
  dia em que a lista mudou, e foi tirada em 10/09/2026 (`ARQUITETO.md §5.5`). Fora da lista:
  os relatórios `00` a `09`, o `REVISORA.md` e o `docs/MAPA.md`, que se abrem sob demanda.
- **Auditora**, ao abrir: `CONTRATO-AUDITORA.md` → `PASSAGEM.md` (dois arquivos). O resto ela
  lê sob demanda, quando o Arquiteto perguntar algo específico.
- **Executora** e **Revisora** não têm lista própria aqui: nascem de um prompt do Arquiteto
  dentro da sessão dele (`PASSAGEM.md` §1), e o contrato da Revisora
  (`CONTRATO-REVISORA.md`) é o que rege o que ela lê.

**`PORQUE.md` não existe, registrado em 10/09/2026 depois de ser citado por engano.** Uma sessão
anterior escreveu texto pensado para virar esse arquivo (por que o projeto existe, os motivos das
decisões, os erros catalogados de quem coordenou), e ele nunca foi commitado — não está nesta
pasta, não está na raiz, não está em lugar nenhum do repositório. `VOZ.md §1` chegou a citá-lo
como fonte de um critério real (navegação é custo, escolha não), e a citação foi corrigida para
não apontar para um arquivo que não existe. Quem tiver esse texto (ou lembrar dele) e quiser
recuperá-lo: hoje o mais próximo que existe, comitado, é o catálogo de erros do coordenador em
`ARQUITETO.md §7` (a metade "erros catalogados de quem coordenou") — o resto ("por que o projeto
existe", "os motivos das decisões") não tem endereço nenhum.

## Instrução ativa

| arquivo | o que é |
|---|---|
| `PASSAGEM.md` | o arranjo entre as quatro instâncias (Arquiteto, Executora, Revisora, Auditora), as regras de conversa com o humano, e o prompt para reabrir uma sessão nova. Escrito para a troca de sessão, não para o projeto. |
| `PLANO.md` | as fases do projeto, o que já foi feito, a autoridade de decisão (o que o Arquiteto decide sozinho e o que escala), e as decisões do humano já tomadas que não se reabrem. |
| `ARQUITETO.md` (até 08/09/2026, `TECHLEAD.md`) | o método de coordenação: como decidir, como planejar, o catálogo de erros do coordenador e as perguntas que mais acharam defeito. Não descreve o projeto, descreve como conduzi-lo. |
| `CONTEXTO.md` | o estado corrente, para uma sessão nova retomar sem reler história. É reescrito, não empilhado: linha que deixou de valer sai. |
| `CATALOGO.md` | a lista de formas de defeito e a pergunta que cada uma faz, ancorada no símbolo que se está digitando. Todo instrumento novo passa por aqui antes de ser construído. Cresce por achado, não se conta ("as N formas" envelhece na forma seguinte). |
| `CONTRATO-REVISORA.md` | o contrato ATIVO da Revisora desta equipe (Executora + Revisora, via Agent Team, desde 07/09/2026). Começou curto de propósito e cresce por decisão do Arquiteto, um item de cada vez. |
| `CONTRATO-AUDITORA.md` | o papel da Auditora: confere afirmação contra o disco, não conserta, não commita, não decide, não abre trabalho por iniciativa. |
| `VOZ.md` (movido para cá em 10/09/2026, estava na raiz) | a frente do comando por voz no Grid: as decisões fechadas, o que está autorizado construir agora e em que ordem (§7/§8). Não é fase e não entra na numeração de fases. O código e a bancada citam este arquivo pelo nome curto (`VOZ.md §8`), sem caminho. |
| `Pendencias.md` (na raiz do repo, não nesta pasta) | os itens abertos do projeto inteiro, numerados por `L`. É a fonte de status mais corrente que existe: quando ela e `PLANO.md`/`CONTEXTO.md` divergem sobre se um item fechou, ela vence (ver nota abaixo). |

**A nota de divergência que estava aqui saiu em 10/09/2026, resolvida:** ela apontava que
`PLANO.md` §2/§8 e `CONTEXTO.md` ainda descreviam a Fase 2 como "cinco de seis". O `PLANO.md`
§8 foi corrigido em 09/09/2026 e o `CONTEXTO.md` foi reescrito em 10/09/2026. Nota de
divergência que sobrevive ao conserto vira a própria divergência.

## Registro histórico

| arquivo | o que é |
|---|---|
| `00-diagnostico.md` a `09-bateria-grande.md` | a série de relatórios da frente de simulação (medição de carga do mestre no Grid), na ordem em que foram escritos. `02-projeto-harness.md` (253,9K, o maior) é o arquivo-fonte dos casos que viraram perguntas em `CATALOGO.md`; `09-bateria-grande.md` é o relatório da bateria de 21.600 batalhas que `ESTADO.md` resume. A frente está ENCERRADA (`CONTEXTO.md`): a segunda bateria (grade de 112 células, as quinze bandeiras) não vai acontecer. Não lidos linha a linha nesta passada — cada um se abre só para checar a procedência de um número citado em outro lugar. |
| `ESTADO.md` | os números medidos pela frente de simulação, hoje. **Não é histórico no sentido de superado**: é a fonte corrente de todo `R:NNN` citado no resto do projeto, lida de `resultados/09-bmtq638zo.txt`. É histórico no sentido de que a frente que o produziu está fechada e ele não vai ganhar uma medição nova — mas enquanto alguém citar um `R:`, este arquivo está em uso. |
| `REVISORA.md` | o contrato da Revisora da frente de simulação (a equipe antiga, encerrada), copiado byte a byte de `centelha-revisora/.claude/CLAUDE.local.md` quando aquela instância fechou. Onde fala "você", fala da revisora antiga. O que dele vale para a Revisora de hoje migra para `CONTRATO-REVISORA.md`, um item por vez, por decisão do Arquiteto — não por herança automática. **Duas seções dele ainda estão sem destino decidido**: o "roteiro de itens" e "Decisões do humano que já valem" (achado da Auditora na rodada 26, `caixa/26-auditora.md`); `CONTRATO-REVISORA.md §5` responde parte, o resto segue pendência registrada. |

## `caixa/` · o canal entre Executora e Revisora

Não se apaga. É o único lugar onde as revisões existem de fato, e é o que permite conferir
depois o que cada instância afirmou em cada rodada. `caixa/README.md` documenta o mecanismo
inteiro (o par `NN-executora.md`/`NN-revisora.md`, o script `npm run duo`, os tetos, as sete
paradas); o que segue aqui é só o que esse arquivo não cobre.

`gasto-acumulado.json` vive aqui, e **não responde pelo arranjo de hoje** (corrigido em
10/09/2026, a frase anterior o chamava de fonte do custo acumulado pedido no `L52`): ele é
escrito pelo script `duo`, que esta equipe não usa; zera a cada troca de assunto declarada; e a
última execução registrada nele é de 04/09/2026, com US$ 1,32 acumulados. O custo acumulado do
arranjo Arquiteto/Executora/Revisora continua **sem fonte** — registrado no `L52`, não
construído.

`DIARIO.md` é da frente de simulação (a numeração de rodada dele é da revisora antiga, não
desta caixa) — registro histórico do que o par acertou e deixou passar naquela frente.

**Achado ao conferir esta pasta em 08/09/2026, para quem estranhar a numeração:** os pares
`NN-executora.md`/`NN-revisora.md` não são 1:1 por número. A Revisora incrementa o próprio
contador quando responde, e às vezes cobre mais de um aviso da Executora numa resposta só
(por decisão registrada no próprio arquivo, ex. `D22a`) — por isso `16-executora.md` e
`17-executora.md` são respondidos juntos em `18-revisora.md`, `19-executora.md` em
`20-revisora.md`, e `21-executora.md`/`22-executora.md` juntos em `23-revisora.md`.
`24-executora.md` não tem resposta porque não tinha código para revisar: foi um levantamento
entregue por mensagem, e o Arquiteto registrou o resultado direto em `Pendencias.md`, sem
passar pela Revisora (o próprio arquivo diz isso). Confirmado, arquivo por arquivo, contra o
`git log`: **nenhuma das seis rodadas (16, 17, 19, 21, 22, 24) ficou sem revisão** — a
aparência de buraco é só o deslocamento da numeração.

## `resultados/` · as saídas de bateria

O dono da procedência dos números. Cada citação `R:NNN` em `ESTADO.md` (e em qualquer outro
documento que citar `R:`) aponta para uma linha de um destes `.txt`. Apagar um arquivo aqui
quebra o portão de procedência de quem cita o número.

**`09-bmtmbdppb.txt` FICA**, não sai. Tinha o viés da coluna de fuga (zero falso onde a fase
de fuga não aconteceu) e foi regravada como `09-bmtq638zo.txt` em 06/09/2026, que é a fonte
que `ESTADO.md` usa hoje. Mas `bmtmbdppb` continua citada em uso ativo, não só como
curiosidade: `Pendencias.md` (a repartição 116.293/130.772 por lado, que o conserto da fuga
não mexeu) e `ESTADO.md` (a própria narrativa de como o viés foi achado e corrigido) apontam
para ela para provar a conta, não só para lembrar que existiu. Enquanto essas citações
existirem, o arquivo é a evidência que sustenta a frase — tirá-lo quebraria a procedência que
ele mesmo prova.
