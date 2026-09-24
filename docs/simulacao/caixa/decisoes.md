# Decisões que tocam duas frentes

**Este arquivo existe desde 24/09/2026, por decisão do humano, depois de três ocorrências no mesmo dia
da forma "o humano como canal único que decide em duas janelas" (`docs/simulacao/CATALOGO.md`).** O
arranjo tem cinco sessões e o único canal entre elas é o humano, e isso não se conserta com atenção.

## A regra, em três linhas

1. **Decisão que toca duas frentes é escrita AQUI primeiro**, numa linha com data, hora, as frentes e a
   frase exata, e só depois é dita em qualquer janela.
2. **A instância que recebe uma ordem que toca outra frente só executa citando a linha deste
   arquivo.** Se não houver linha, ela mesma escreve aqui a frase que recebeu, com a hora e a janela, e
   ESPERA: a outra frente lê, e o humano confirma aqui. O controle sai da memória do humano e passa às
   instâncias.
3. **O arquivo só cresce.** Uma decisão nova sobre o mesmo assunto cita a linha que substitui, e não
   apaga a antiga: a divergência entre janelas fica visível num lugar só.

**"Tocar outra frente"** quer dizer: mudar a árvore, a branch, o diretório, o `node_modules`, o
`.git/config` ou os arquivos de outra instância, ou mandar uma instância fazer ou deixar de fazer algo
que outra também recebeu ordem sobre. Decisão de regra de jogo que só uma frente executa não entra
aqui: vai para a lista única e para o `Pendencias.md`, como sempre.

**Quem escreve:** o humano, ou a instância que recebeu a frase (linha 2). Commit com pathspec, só deste
arquivo. **Formato da linha:** `- **D<n>** · <data> <hora> · janela <quem ouviu> · frentes <quais> · "<a
frase exata>" · substitui D<m>, se for o caso · <o que aconteceu>`.

## As linhas

### As três ocorrências que criaram este arquivo (24/09/2026, registradas depois, com os horários do disco)

- **D1** · 24/09/2026, antes de 02:20 · janela do Arquiteto · frentes Arquiteto, Executora, mapa ·
  o humano aprova o `plano-worktrees.md`: o Arquiteto e a Executora saem do `rpg-system`, o mapa
  fica. Registrado em `8ac4ddc`, às 02:20:17.
- **D2** · 24/09/2026, antes de 02:33:20 · janela do Cartógrafo · frentes mapa, Arquiteto · o humano
  autoriza a proposta do Cartógrafo: o mapa sai para a `centelha-mapa`, numa branch própria. **Contradiz
  a D1.** O Cartógrafo cria a árvore; às 02:38:56 lê o aviso do Arquiteto (a D1) e a desfaz; `e90a69a`,
  às 02:43:50.
- **D3** · 24/09/2026, depois de 02:43:50 · janela do Arquiteto · frentes mapa, Arquiteto · "valem os
  dois", e a `centelha-mapa` FICA. **Substitui D1 e D2, e chegou sobre um estado que já tinha andado**:
  a árvore já não existia. O Arquiteto conferiu o disco e não repassou a ordem.
- **D4** · 24/09/2026, antes de 03:14 · janela do Arquiteto · frentes mapa, Arquiteto · a saída (a): o
  Cartógrafo recria a `centelha-mapa` na branch `mapa`, levando os commits do mapa, e o `main` local
  do `rpg-system` volta ao `origin/main`. **Substitui D3.** Aviso na caixa em `badd087` (03:14:11); a
  `mapa` recriada em `88bf598` (03:26:58).
- **D5** · 24/09/2026, antes de 03:26 · janela do Cartógrafo · frentes mapa, Arquiteto · ao confirmar a
  D4: "o passo 5 não é seu: o main local do rpg-system fica como está, e o reset, se acontecer, é
  feito por mim ou pelo Arquiteto depois".
- **D6** · 24/09/2026, antes de 03:54 · janela do Arquiteto · frentes mapa, Arquiteto · "Não faça você.
  É a árvore dele e a decisão de quando é dele." **Contradiz a D5.** O Arquiteto cobrou o Cartógrafo
  (`39a0de9`, 03:54:54); o Cartógrafo recusou citando a D5; nenhum dos dois executou.
- **D7** · 24/09/2026, depois de 04:05 · janela do Arquiteto · frentes mapa, Arquiteto · "opção (1), você
  faz": o Arquiteto faz o reset. **Substitui D5 e D6.** Feito: `4643529` → `276bcad` e a
  `centelha-arq-tmp` removida, às 04:07:40 (a remoção apagou o `node_modules` compartilhado; ver
  `plano-worktrees.md`, seção 11).

- **D8** · 24/09/2026, depois de 14:55 · janela do Arquiteto · frentes Arquiteto, mapa · "quero (a) e
  (c)": um papel fixo por pasta. O gancho global `~/.claude/hooks/papel-fixo.mjs` dá o nome à sessão e,
  se a pasta já tem aquele papel noutra sessão, bloqueia e diz como abrir a que existe
  (`cc rpg-system -papel <comando>`) ou como criar outra (`/<comando> novo`). Toca a frente do mapa numa
  linha só: o cabeçalho do `.claude/commands/cartografo.md` ganha `papel: "Cartógrafo"`. A cópia do
  arquivo na branch `mapa` não muda; quem decide levar a linha para lá é o Cartógrafo.

- **D9** · 24/09/2026, antes de 17:33 · janela do Arquiteto · frentes Arquiteto, mapa · "Acrescente,
  logo abaixo de '1. Leia sempre', que a frente mora em C:\Users\Neves\ClaudeCode\centelha-mapa
  (branch mapa) e que todo caminho lore/mapas/... do comando é lido e escrito lá, inclusive o passo
  de conferência do git, e que o lore/mapas do rpg-system está congelado em 23/09 e não deve ser
  lido. Só isso, e só nesse arquivo." · feito no `.claude/commands/cartografo.md` do `main`
  (`db8245b`, 17:33). **Registrado depois de executado**, às 17:55, por pedido do humano: a regra da
  linha 2 pedia o registro antes, e o Arquiteto executou sem ele porque a ordem dizia "só nesse
  arquivo". A cópia do comando na branch `mapa`, se existir, é do Cartógrafo.

**As três ocorrências da forma, contadas como o humano contou:** D1 contra D2 (os dois desenhos), D3
(a decisão que reconciliava, escrita sobre um estado que já tinha andado) e D5 contra D6 (quem faz o
reset).
