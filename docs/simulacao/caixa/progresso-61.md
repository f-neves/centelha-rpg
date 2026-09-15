# Progresso · rodada 61 · C-12 destravado, C-01 à mão com portão, e os consertos do M-10

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `6dcbe8b`. Na árvore há um `jogador-novo-prompt-executor.md` NÃO RASTREADO que não
é meu: não encosto.

Três frentes: `C-12` (M-02 decidido), `C-01` (os doze `href` à mão mais um portão novo, com o
ensaio dos três sentidos) e os consertos do `M-10`.

- **00:47** · começo. Li as duas entradas de `jogador-novo-decisoes.md`. A primeira coisa é
  conferir no arquivo a leitura em que a decisão do `M-02` se apoia (a Especialidade "Ocultismo:
  invocação" na tabela do Bram): se ela não estiver lá, o achado vem antes do conserto.
- **00:48** · a leitura do Arquiteto CONFERE no arquivo: `criacao-de-personagem.md:149` traz
  "Especialidades | seis (Ocultismo: invocação · Adivinhação · Conhecimentos…)". A
  Especialidade existe e não tinha Arte por trás. Sem achado, sigo para o conserto.
- **00:48** · `C-12` feito: a linha de Artes do Bram passou a 745 com "Fascinação e Conjuração no
  3", e o Total a 1868. Atualizei junto o `cost-examples.mjs` (`artesPub` e `totalPub`), senão o
  conferidor passaria a acusar o conserto como divergência. Rodado e lido: a linha de Artes ficou
  **✓ 745** e as divergências caíram de 6 para 5, que são exatamente as cinco que a mesa decidiu
  deixar de pé.
- **00:51** · **O MEU ACHADO `A-04` DA RODADA 60 ESTAVA ERRADO, e o controle negativo do `C-01`
  também.** Prefixei os doze `href` no fonte, rodei `npm run build`, e o `dist/` continuou com os
  MESMOS doze. O fonte dizia `/centelha-rpg/equipamentos` e o HTML gerado dizia `/equipamentos`:
  **o build estava servindo página velha de cache.** Apagando `.astro/`, `node_modules/.astro/` e
  `dist/` e refazendo do zero, sobraram **2**, que são exatamente os dois que eu tinha declarado
  "já saem prefixados". Eles nunca saíam: eu media um build anterior. **Os quinze eram quinze**, o
  documento estava certo, e as duas medições da rodada 60 concordavam entre si pelo motivo errado.
- **00:52** · os dois que faltavam prefixados à mão. Agora são 14 em markdown mais o
  `FichaSkeleton.astro` da rodada 60, que fecham os quinze.
- **00:54** · portão novo escrito, `scripts/test-links-base.mjs`. Ele olha o FONTE e não o
  `dist/`, de propósito: assim roda no `validate`, ou seja, no gancho de `pre-commit`, antes de o
  commit existir. A equivalência entre fonte e gerado foi conferida com o cache apagado.
- **00:54** · ENSAIO DOS TRÊS SENTIDOS, com o que eu vi em cada um:
  · **vermelho hoje** · `git stash push --` nos dez arquivos de capítulo (só os meus, com
    pathspec), portão rodado: `exit 1`, **14 links listados**, nome e linha, e a lista bate com a
    do documento original;
  · **verde com o conserto, sem tocar no portão** · `git stash pop` e rodar de novo: `exit 0`;
  · **vermelho de novo com a regressão** · plantei um `href="/regras/folego"` num `<p class=
    "muted">` do `combate.md`: `exit 1`. Removida, voltou a `exit 0`.
  Ele tem CONTROLE POSITIVO embutido, que é outra prova: um `href` sintético sabidamente errado
  tem de ser reprovado pela mesma regra, senão um `RAIZES` apontando para pasta vazia daria verde
  silencioso.
- **00:55** · o portão entrou no `validate` (não precisa de `dist/`, então não é do `smoke` e não
  toca na matriz do CI). `npm run validate` LIDO com ele dentro: `exit 0`, e o `test-portoes`
  continua verde, que é quem cobra que todo teste esteja em algum portão.
- **00:57** · `M-10` feito nos três lugares que a decisão nomeia (`arcano.astro`, a linha do
  mapa das Escolas, e o item "Em revisão" de `artes/regras.astro`), **e em três que ela não
  nomeia**: a descrição da página do Arcano, o `lead` de `artes/regras.astro` e o parágrafo
  `artes/regras.astro:63`, que usava "Trilha" três vezes E repetia a promessa cancelada. Deixar
  esses três seria publicar o contrário da decisão na mesma passada. **Zero ocorrências de
  "Trilha" sobram no Arcano**, conferido lendo os arquivos.
- **00:57** · a conferência do vocabulário das Proezas: **não existe capítulo das Proezas** em
  `src/content/chapters/`. O que publica os 50 Caminhos são páginas (`caminhos/`, `arvore.astro`),
  e elas usam "Trilha" para as TRÊS (corpo, voz, mente), que é o sentido da tabela da decisão.
  **Não mexi.** Dois usos divergentes achados e registrados sem conserto, no fim do documento.
- **00:57** · `npm run validate` LIDO depois do `M-10`: `exit 0`.
