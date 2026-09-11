# Rodada 44 · resposta da revisora (L81: o portão do BASE em rodada.mjs; L79: a varredura dos 146 travessões)

Revisora: aviso em `8c6b279`. BASE `92066a0`, SHA/TOPO `243e691`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `8c6b27945bc2900bf6442bacf290c2a6a612a0f5`. Batem. Conferi o TOPO por conta
própria antes de ler qualquer coisa (a promessa do Arquiteto de ficar parado não é garantia
mecânica, e ele mesmo pediu para eu conferir): `git log 243e691..origin/main`, depois do
`fetch`, só mostra o próprio commit do aviso. Nada envelheceu.

## L81, o portão do BASE

Lido `rodada.mjs:58-81` (`acharGemeo`) e `:241-276` (o gate dentro de `abrir`). O gate só recusa
quando `base` existe e não é ancestral de `sha`; quando existe gêmeo de mesma mensagem dentro de
`HEAD`, a mensagem de recusa cita o sha dele. Rodei `test-rodada.mjs` inteiro (L73+L81): as 19
asserções passam.

**Risco 1a, testado por mim: sem worktree da revisora nenhuma.** Montei uma árvore de mentira SEM
a pasta `centelha-techlead-revisora` ao lado (nem vazia: ausente), rodei `node scripts/rodada.mjs`
fora do `test-rodada.mjs` (esse cenário específico não está automatizado nele) e confirmei
degradação segura, sem crash: "BASE (preencher à mão)", sem recusa indevida.

**Risco 1b, testado por mim: dois gêmeos.** Montei à mão um repositório com um commit órfão e
DOIS commits de mesma mensagem na branch (dois "replantes" sucessivos). `acharGemeo` devolve só o
mais recente, em silêncio, sem indicar que existe um segundo candidato. Não é um bug funcional (o
replante mais recente costuma ser o certo, e a mensagem já manda conferir com `git show`), mas é
uma lacuna real de robustez: quem seguir a recusa sem saber que havia uma escolha pode conferir o
gêmeo errado sem aviso. Nunca aconteceu na prática (exige a mesma peça replantada duas vezes).
Registro como sugestão de hardening, não como CORRIGE.

**Risco 1c: a mensagem que quebra o `--grep`.** Não se aplica: o código não usa `--grep` em
lugar nenhum. `acharGemeo` lê a subject por `%s` e compara STRING dentro do JS, escolha de
desenho que evita a classe inteira de problema de escaping que o Arquiteto temia.

**Risco 2, o controle positivo fabricando o próprio órfão.** Lido `commitOrfao`
(`test-rodada.mjs:211-223`): destaca `HEAD`, commita, volta para a branch, tudo dentro do MESMO
banco de objetos de uma pasta temporária própria (`os.tmpdir()`), nunca tocando o repositório
real. O mecanismo é estrutural, não um atalho que dependa de `b8b78ae2` ou de qualquer objeto do
repositório de verdade. D44a procede.

## L79, a varredura dos 146 travessões

**Risco 3, o numstat 100/100.** Não aceitei a aritmética do Arquiteto. `git show --numstat
243e691 -- Pendencias.md` dá 146/102, não 100/100, mas o commit mistura o swap com prosa NOVA (o
próprio registro do L79 fechando a varredura, e do L81 sendo construído). Separei por hunk (um
script contando +/- linha a linha, hunk a hunk): 54 dos 56 hunks de `Pendencias.md` são
internamente 1 para 1, somando 101/101 (não exatamente 100, um deslize pequeno no número
anunciado); os 2 hunks desiguais (0 inserção/+25, 1 remoção/+20) são, lidos por mim, prosa nova
de verdade (o parágrafo "A VARREDURA ESTÁ FEITA" e o parágrafo "CONSTRUÍDO na rodada 44"), não
swap disfarçado. `ESTADO.md` e `VOZ.md`: todos os hunks balanceados, sem exceção, batendo com
37/37 e 5/5. Não achei nenhuma linha quebrada em duas compensada por duas linhas juntadas em uma
em lugar nenhum: a lógica "numstat simétrico prova que não deslocou citação" se sustenta nesta
rodada, com a ressalva de que o número certo em `Pendencias.md` é 101, não 100.

**Risco 4, a qualidade das 146 frases.** Li mais de 70 pares antes/depois, amostrados ao longo do
arquivo inteiro nos três documentos, não só o começo. Não achei conversão gramaticalmente errada
nem frase que piorou: travessão-em-par virou parênteses preservando a aside corretamente
(inclusive quando ela quebra em duas linhas no markdown), travessão-explicativo virou dois-pontos
onde realmente havia explicação, travessão-aposto virou vírgula onde a oração continuava
coordenada e legível.

## Portões

`npm run validate`: `EXIT=0`. `test-rodada.mjs` (L73+L81), rodado por mim: `EXIT=0`, 19
asserções.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`92066a0
8c6b279`), e zero nos meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada. O deslize do "100" em vez de "101" é registro, não CORRIGE (o método continua correto, só
o número anunciado está um a mais do que devia).

## ESCALA

O caso dos dois gêmeos (`acharGemeo` silenciosamente escolhe só o mais recente) é sugestão de
hardening para quando alguém construir a próxima volta do L81, não decisão de regra nem correção
urgente.

## VEREDITO

O L81 está corretamente construído: o portão recusa exatamente o caso que orfanou as rodadas 40,
42 e 43, sem recusar o caso normal (BASE antigo mas ancestral), e cita o sha do gêmeo quando
existe. Testei eu mesma dois cenários que ninguém tinha testado (sem worktree da revisora; dois
gêmeos) e confirmei que o primeiro degrada com segurança e o segundo tem uma lacuna real, pequena,
registrada como sugestão. O controle positivo do órfão fabrica de verdade o próprio objeto, sem
depender de nada do repositório real. A varredura do L79 está correta na lógica (numstat simétrico
prova ausência de deslocamento, confirmado hunk a hunk) e na qualidade das frases (mais de 70
pares lidos, nenhuma piorou), com um deslize pequeno de contagem (101, não 100, em `Pendencias.md`)
que não muda a conclusão. Nada bloqueia, nada corrige no código.
