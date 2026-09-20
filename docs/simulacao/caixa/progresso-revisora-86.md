# Progresso da Revisora · rodada 86

Reancorada em `4e56aa82c3539cb4c34385918cbbc87cdbe9f804`, conferido por `git rev-parse HEAD` na
worktree `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`. `git status --short` limpo.

- 20:13 · passo 0 feito, sha bate com o do aviso. Vou ler o `86-aviso.md`.
- 20:14 · aviso lido, faixa conferida por `git log --oneline 099d50b..08bf455`: dez commits,
  sete dela e tres seus, como o aviso diz. Diff dos seis arquivos de `src/` lido por
  `rtk proxy git diff`. Os seis consertos do capitulo e os quatro de fora dele estao aplicados,
  e as duas emendas (labia e "8 a 24") aparecem nos DOIS lados. Proximo: a comparacao chave por
  chave do bloco `social` contra o capitulo, nas duas direcoes.
- 20:18 · comparacao chave por chave feita: 20 valores (15 no `social`, 5 no `longevidadeFirula`),
  todos batendo com o capitulo, zero contradicoes nas duas direcoes. `diagramas.json` conferido
  POR MIM e nao pela afirmacao dela: as 5 chaves que ficaram tem bytes diferentes e texto
  publicado identico (extraido e comparado), e li o `gen-mermaid.mjs:87,95-105` para ver que o
  `--check` so compara presenca de chave. O desenho novo do roteador diz a regra certa.
  Achei tambem que a faixa tem **11** commits e nao 10, e que uma citacao minha da rodada 85
  estava mesmo errada, mas nao pela causa que ela registrou. Proximo: a quarta afirmacao, a
  divida das duas listas, e os portoes.
- 20:22 · portoes locais verdes (`validate` exit 0, `astro sync && tsc --noEmit` exit 0). Zero
  travessao em tudo que esta rodada escreveu, inclusive no bloco `social` novo. Placar do E e do J
  conferido item a item e as tres colunas somam. **Achado grande no CI:** as duas ultimas execucoes
  do "Validar dados e regras" que FECHARAM fecharam em FALHA (`6509801` e `f85b09e`), as duas no
  job `Smoke · test-grid`, e o relato declara o CI citando uma execucao que nao e a ultima.
  Medido: dez execucoes fecharam desde 22:26 e cinco falharam, inclusive em commits so de `docs/`,
  entao a falha nao acompanha conteudo. Nao investiguei a causa. Escrevendo o veredito.
- 20:25 · veredito escrito: PROCEDE, com tres CORRIGE de linha e um ESCALA. Zero travessao no meu
  proprio texto. A 1a conferencia do §10 DISPAROU (`2215cfc` mexe no `Pendencias.md` e no
  `J-infraestrutura.md`, que eu acabei de recontar): medi o delta, e o que chegou toca uma
  verificacao datada e nenhum achado, entao escrevi o delta dentro do veredito e vou rebasear.
  Falta commitar e empurrar.
- 20:31 · quatro execucoes do CI fecharam depois do veredito sair, e a tabela da §6 envelheceu.
  Apliquei em mim o remedio da propria secao: carimbei a leitura com a hora e reescrevi a tabela
  completa. A proporcao nao mudou (10 fechadas, 5 em falha) e a evidencia melhorou, porque agora
  commit so de `docs/` cai dos DOIS lados. O `4e56aa8`, que e o meu pino, falhou. Acrescentei
  tambem a medida da sobreposicao das execucoes, como FATO e sem ligar a nada.
