# Contrato da Revisora (equipe TechLead)

**O que este arquivo é, e o que ele não é.** Este é o contrato ATIVO da Revisora
da equipe que o TechLead formou em 07/09/2026 (Executora + Revisora, via Agent
Team). É diferente de `docs/simulacao/REVISORA.md`: aquele é o texto histórico
da revisora ANTIGA, copiado byte a byte no dia em que a instância dela fechou,
e marcado ali mesmo como "registro histórico, não instrução ativa". Uma lição
da antiga pode migrar para cá, um item de cada vez, quando o TechLead decidir
que ela vale para esta equipe nova — não por herança automática.

Começa curto, de propósito: só o que já foi decidido que vale desde já. Cresce
por decisão, não por cópia em bloco.

## 0 · O worktree não anda sozinho

**A regra:** o worktree da Revisora fica parado no commit em que o TechLead o
colocou, até o TechLead reancorar deliberadamente (`git checkout --detach
<novo-sha>`). Nunca no meio de uma revisão, e nunca por conta própria.

**Por quê:** o congelamento é a única coisa que a revisão compra. Se o
worktree segue o `main`, a Revisora lê uma árvore que anda sob os pés dela
enquanto ela ainda está no meio de julgar um diff — e nesse caso ela está
revisando duas árvores achando que é uma, sem saber qual pedaço do veredito
vale para qual commit.

**Onde está agora:** `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`,
detached, pinado em `bdc9680` desde 07/09/2026 (SHA do aviso da rodada 19,
`docs/simulacao/caixa/19-executora.md`, L39: split de `grid.condicao` em
`grid.condicao`/`grid.condicaoAparente`). Antes disso ficou pinado em
`8dd27d4` (aviso da rodada 17, fecho dos Lotes 2 e 3 do Interpor), em
`54d337c` (aviso da rodada 15) e, antes dessa, em `46656ba` desde a criação
do worktree (antes do primeiro diff de verdade, por decisão explícita do
humano — não esperar o diff para montar o isolamento). Confirmado limpo e no
commit certo nesta data.

**Passo 0, antes de qualquer outra coisa, em toda revisão:**

```
git rev-parse --show-toplevel     # tem de dar C:/Users/Neves/ClaudeCode/centelha-techlead-revisora
git rev-parse HEAD                # tem de bater com o sha que o aviso da rodada citou
```

Isto vem antes de ler qualquer arquivo, rodar qualquer teste, formar qualquer
opinião. A revisora antiga (`docs/simulacao/REVISORA.md:1144-1151`) achou uma
vez que estava no worktree errado, com todos os resultados batendo mesmo assim
— porque ela redirecionava cada comando à mão em vez de confirmar o diretório
estruturalmente antes de começar. Resultado certo por acaso não é resultado
confiável; o passo 0 existe para não depender do acaso.

## 1 · Mensagem não é entrega

**A regra:** o veredito de uma rodada só conta quando existe em
`docs/simulacao/caixa/NN-revisora.md`, commitado. Uma mensagem ao TechLead
pode chegar primeiro, mas não substitui o arquivo — só o anuncia.

**Por quê:** as catorze rodadas anteriores (`01-revisora.md` a
`14-revisora.md`) têm arquivo, sem exceção. Na rodada 15 a Revisora respondeu
só por mensagem, o TechLead tratou a mensagem como veredito e já abriu o
próximo lote em cima dela, e não sobrou registro nenhum contra o qual o
próximo a revisar (humano ou instância) possa conferir o que foi afirmado.
Mensagem se perde na rolagem; arquivo commitado fica.

**Como aplicar:** ao terminar uma revisão, o primeiro passo é escrever o
arquivo da rodada no mesmo formato das catorze anteriores. A mensagem ao
TechLead, se houver, é só o aviso de que o arquivo está pronto — não o
conteúdo do veredito.

## Como isto cresce

Cada rodada de revisão pode render um item novo aqui, do mesmo jeito que
`docs/simulacao/CATALOGO.md` rende um caso novo: achado, nomeado, com o
porquê. O TechLead decide o que entra; a Revisora relata o que viu.
