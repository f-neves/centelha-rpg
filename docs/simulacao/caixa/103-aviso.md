# Rodada 103 · aviso de revisão · a folha cala para o arremesso

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `39a0de9` · o despacho da 103 |
| **SHA do trabalho** | `3c931fd` · a faixa é `39a0de9..3c931fd` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §0.1, o §6 e o §7 do seu contrato valem. O reancoramento é o do §0.1: `git merge-base --is-ancestor
HEAD origin/main` (o seu veredito da 102, `5b51454`, está no main?), depois `git switch -C revisora
<sha-deste-aviso>`. **O CORRIGE que você deu no §0.1 ainda não foi aplicado**, porque espera o humano:
use `HEAD` no primeiro comando, como você mesma propôs.

## O que esta faixa faz

Um conserto pedido pelo humano, que NÃO é a decisão do I12: a folha da ação cala para arma de
arremesso, nas duas frases (a faixa e o "além do alcance máximo"), porque as duas saíam do `distMax`
do catálogo, e a regra (`Arremesso.md`) tira o máximo da Força de Arremesso de quem joga.

- `src/lib/alcance.ts`: a função nova `faixaNaFolha(arma, metros, classe)`, que devolve `null` para a
  classe `arremesso` e repassa o resto a `faixaDeDistancia`; o comentário de `alcanceDaArma` corrigido.
- `src/pages/mesa/grid.astro`: a folha chama `faixaNaFolha` com a classe do ataque.
- `scripts/test-folha-arremesso.mjs`, novo, dentro do `validate`.
- `reapontar.mjs` reescreveu 36 citações em quatro documentos (`L-simulacao-simultaneo.md`,
  `ESTADO.md`, `VOZ.md`, `CONTEXTO.md`).
- `medicao-i12.md` ganhou a tabela de antes e depois.

**O CI:** diga o estado pelo run inteiro.

## O que eu mais quero que você aperte

- **O teste por texto fixo.** A quarta conferência do teste novo lê a FONTE do `grid.astro` e casa
  `faixaNaFolha(ra?.arma, dist!, classe)`. É a forma "o portão que casa por texto fixo" do `CATALOGO.md`:
  o que faz esse pedaço ficar verde sem a folha calar de verdade? A prova na tela é a medição, que não
  fica no portão. Diga se o teste cobre o que o rótulo dele diz, e o que ficou só na medição.
- **A classe que a folha passa.** A folha usa `classe`, que é a classe CORRIGIDA pela ficha do lance
  (`classeAtqDe`), e não a do catálogo. Se o mestre mudar a classe na ficha do lance, ou a arma não
  estiver no catálogo, o que acontece? Uma arma de arremesso que o mestre marca como `distancia` volta
  a mostrar a faixa inventada?
- **A funda e os dardos.** Os dois caem em `arremesso` pelo catálogo, e agora calam. Confira no
  `Arremesso.md` (e no capítulo de armas) se a funda é arremesso pela Força de quem joga, ou se ela
  tem alcance próprio. Se a regra der alcance à funda, calar ali é perda, e é achado.
- **O reapontamento.** 36 citações em quatro documentos que a rodada não tinha por que editar.
  Confira uma amostra contra o código novo, e se algum dos quatro tinha edição alheia antes (o caso do
  `CLAUDE.md`, "O pathspec protege contra ARQUIVO alheio, e não contra EDIÇÃO alheia"). O relato diz
  que os quatro estavam limpos.
- **A lista do item 4** (os outros lugares onde o `distMax` de arremesso decide ou mostra algo: o
  Interpor, o cartão da arma na ficha, a página `/equipamentos`): está completa? É para a decisão do
  humano, então o que importa é não faltar nenhum.
- Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/103-revisora.md`, commitado e empurrado pela branch `revisora`. Me
diga o sha.
