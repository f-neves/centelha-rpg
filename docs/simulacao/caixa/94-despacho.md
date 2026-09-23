# Rodada 94 · despacho · o `Pendencias.md` completo

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 93 fechou com **PROCEDE** (`9127df5`, adendo `d23600a`). Progresso em `progresso-94.md`,
> relato em `94-executora.md`.

## O pedido, na frase do humano

*"quero que formate e revise o arquivo de Pendências, é para ser um arquivo muito completo para que
outra instância dê os próximos direcionamentos"*

Hoje o `Pendencias.md` é só índice: a tabela de temas com contagem, e uma "Ordem sugerida" de agosto.
Quem abre não sabe o que está aberto, quem decide cada coisa, o que está pronto para executar, nem o
que trava o quê. **Ao fim desta rodada, uma instância nova lê o `Pendencias.md` e consegue propor a
próxima rodada sem abrir mais nada.** Os arquivos de tema (`docs/pendencias/A..L`) continuam sendo o
detalhe, e a divisão de 17/09 foi pedido do humano: não se desfaz.

## 1 · Medir antes de escrever

- **A contagem do índice já diverge das caixas.** Por `grep` de `- [ ]`/`- [x]` em 23/09: A tem 19
  abertos (o índice diz 20), I tem 10 (diz 12), K tem 18 (diz 19). Explique cada diferença: pode ser
  caixa aninhada, "parcial", item sem caixa, ou erro de uma das duas.
- **O formato de cada arquivo de tema:** como o item é marcado (caixa, sigla em negrito, subitens,
  `[DECIDIR]`/`[FAZER]`/`[AUTOR]`), e se é regular o bastante para um script ler.
- **Quem cita o `Pendencias.md` por linha** (`Pendencias.md:` em qualquer documento). Reescrever o
  arquivo desloca essas citações.

Escreva o resultado no progresso antes de desenhar.

## 2 · A forma: gerado onde der, escrito à mão só a direção

A régua da casa (`ARQUITETO.md §5.5` e a forma "duas listas que precisam concordar", no
`CATALOGO.md`) diz que um resumo de 250 itens escrito à mão é uma segunda lista que diverge. A
contagem do item 1 prova que já divergiu.

- **Se o formato for regular:** a tabela de itens (sigla, título, estado, marcação, arquivo) e as
  contagens saem de um script, entre marcadores, no molde de `gen-cap-pericias.mjs`/`gen-cap-itens.mjs`,
  com `--check` no `validate`.
- **Se não for:** a tabela é escrita, e um detector confere sigla e estado nas duas direções (todo
  item aberto dos temas está no índice, e todo item do índice existe no tema com o mesmo estado), com
  controle positivo.
- **Nos dois casos, o portão novo passa pelo ensaio dos três sentidos** e entra em toda lista que
  precisa dele (o `validate` e a matriz do CI, que o `test-portoes.mjs` confere).

Escrito à mão fica só a CAMADA DE DIREÇÃO, abaixo.

## 3 · A camada de direção, e ela inclui o que não mora em `docs/pendencias/`

Para cada item ou bloco: **quem decide** (humano, Arquiteto, ou só execução), **o que trava ou
destrava**, e **o arquivo onde o detalhe mora** (por nome e sigla, nunca por `arquivo:NNN`).

O que precisa estar lá, e hoje não está no `Pendencias.md`:

- **As frentes abertas, uma linha de estado cada:** Frenesi e teste de Virtude, jogador novo,
  Relações Sociais, o Grid (fila do `PLANO.md §8`), voz (`VOZ.md`), mapa de Uldun, economia (`lore/`).
- **O que está pronto para executar, sem decisão pendente:** a implementação da §16 e da §17 do
  `leitura-de-novato-decisoes.md`; as seis decisões M que o `CONTEXTO.md` diz esperarem mão de obra
  (M-01, M-05, M-07, M-24, M-33, M-42 · confira se alguma rodada de 82 a 93 já fez alguma); o item 9 de
  Relações Sociais (`regras.json`, `acoes.longevidadeFirula`), que o `CONTEXTO.md` marca como não
  reconferido depois das rodadas 85 a 89.
- **O jogador novo:** as perguntas `M` e os consertos `C`, com a contagem **remedida** (a de 18 e 78 é
  de 16/09). E as marcas do humano no dossiê publicado
  (`https://claude.ai/artifact/2H8aDMgNmU7A6hP5wo26s4`: resolver agora, depois do reset, não mexer),
  lidas pela ferramenta `Artifact` (ação `read`) e, se a página tiver banco, pela `ArtifactData`, com
  a data da leitura ao lado. Essas marcas são a ordem que ele deu, e elas moram fora do repositório.
- **O que está com o humano:** `PASSAGEM.md §7`, `PLANO.md §8` itens 3 e 4, os `E4` a `E8`, e toda
  pergunta de regra aberta nos temas (`[DECIDIR]`).
- **Os bloqueios de produção e de mesa:** migrações (`L42`), a barra sem teste (`L62`), o modelo de voz
  que trava (`L71`), o gatilho `armadilha` (`L86b`), a batalha de verdade que a fase 4 espera.
- **A "Ordem sugerida" reescrita**, marcada como **proposta do Arquiteto** e não como decisão, com o
  porquê de cada posição. A de agosto sai (ela lista A21 e A22 como abertos, e os dois fecharam em
  19/08). Escreva a proposta; eu reviso antes de o humano ver.

## 4 · Revisar, e o alcance da revisão

- **Não reconfira os 250 itens contra o código.** A zona provável de caixa velha é o que as rodadas 75
  a 93 tocaram, e o que o `CONTEXTO.md` marca como não reconferido. Procure a forma "fechar a frente sem
  fechar o documento" (`CATALOGO.md`).
- **Caixa só muda com prova:** um sha de commit, ou uma entrada de decisão, citados ao lado. Sem isso,
  o item fica aberto e ganha a marca de **suspeito de fechado**, com a evidência que você achou.
- **O congelamento vale.** O que a revisão achar vira linha no arquivo, e não conserto.

## 5 · Como trabalhar

- O `L-simulacao-simultaneo.md` tem 446 KB. **Você pode usar subagentes para extrair dele**
  (medição pura, pergunta autocontida, e você confere a saída antes de usar). A redação final é sua.
- Sem `arquivo:NNN` no `Pendencias.md` novo, a não ser que precise mesmo · e então âncora e citação
  na mesma linha. Travessão: confira lendo o arquivo (`Grep`), nunca pelo `git diff`.
- Se editar arquivo por Python, `newline="\n"`.
- **Progresso em `progresso-94.md`, uma linha por etapa pequena, no instante em que ela fecha**, com
  a hora lida da máquina.
- Commit com pathspec. `lore/` está sujo de outra frente: não toque.

## 6 · O relato

`94-executora.md`, com as quatro seções da casa (ENTROU · PRECISA DE MIM · QUEBROU · BLOQUEADO), e:
a medição do item 1; a forma escolhida no item 2 e por quê; o ensaio dos três sentidos do portão; a
lista dos suspeitos de fechado; e o que você achou e não consertou.
