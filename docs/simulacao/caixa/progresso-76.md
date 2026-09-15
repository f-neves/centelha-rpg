# Progresso · rodada 76 · a régua do arredondamento, e os três furos do portão

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `6d26844`. A ordem é da Revisora e não é sugestão: **o portão primeiro**, porque
exemplo escrito antes do extrator consertado nasce fora da conferência sem ninguém ver.

Cinco itens: os três furos do portão, a palavra saindo da tela (`referencia.astro:170`), a M-21c
no dado e no capítulo (com a ressalva do `fail` que acumula), a nota que escreve o número que
mandou não escrever, e as duas citações erradas do `progresso-75.md`, que são minhas.

- **18:37** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
  `HEAD` = `6d26844`, igual ao `origin/main`, e `origin/main..HEAD` = 0.
- **18:39** · item 1 FEITO, os três furos. O `VELHO` ganhou a flag `i` (a forma real do
  repositório era minúscula), `referencia.astro` virou a quinta entrada de `ondeNaoPodeVoltar`, e
  o extrator deixou de ser um regex maior: ele acha cada "morre em −X", caminha PARA TRÁS até o
  `PV N` mais próximo (janela de 400 caracteres) e tira as tags HTML antes, que era a segunda
  causa de o callout do Bram escapar. A trava nova é de contagem: "morre em" sem par vira erro,
  não silêncio.
- **18:39** · PRIMEIRO SENTIDO, de graça, como ela previu: com o portão consertado e o texto
  ainda velho, `EXIT=1` com um erro só, e é `referencia.astro`.
- **18:40** · e a falsificação DELA, refeita: `−17` do callout trocado por `−99` → `EXIT=1`, "o
  exemplo de PV 34 publica morte em -99". Era o buraco do `CORRIGE 3` e está fechado. Restaurado
  do arquivo guardado antes, `diff` vazio.
- **18:40** · item 2 FEITO. `referencia.astro:170` diz "dano" e não mais "Letal", cinco linhas
  acima do `{SANG.nota}` que já dizia o certo. Portão VERDE, `EXIT=0`, e o verde veio do texto,
  sem tocar no portão.
- **18:41** · itens 3 e 4 no dado: `limiteArredonda` deixou de ser escalar e virou as duas
  direções (`semCentelha: baixo`, `comCentelha: alto`), a régua ganhou campo próprio
  (`limiteArredondaNota`), e a `limiteNota` perdeu os dois pares que ela mesma prometia não
  escrever. O portão passou a derivar por lado, e **a ressalva dela está fechada**: com o campo
  em forma errada o bloco PARA (`arredondaOk`), em vez de seguir conferindo com `Math.floor` por
  baixo do pano.
- **18:41** · o capítulo publica os dois lados, cada um com exemplo de PV ÍMPAR, que é o único
  que distingue: PV 37 sem Centelha morre em −18, com Centelha em −19. O portão exige o rótulo
  só no ímpar, porque no par as duas direções dão a mesma resposta e cobrar ali seria cobrar o
  que não se mede.
- **18:42** · ensaio da régua nova, cinco vermelhos, cada um com mensagem própria:
  · antes do capítulo mudar → 3 erros (o PV 37 sem lado, e os dois lados sem testemunha ímpar);
  · lados TROCADOS no dado → 2 erros, um por lado, com a conta refeita nos dois;
  · campo de volta a escalar → **1 erro só**, e nenhuma conferência de exemplo depois dele;
  · um lado apagado do capítulo → 1 erro nomeando o lado que ficou sem testemunha;
  · `PV 34 morre em −17` de volta na `limiteNota`, com o número CERTO → 1 erro, porque o lugar do
    exemplo é o capítulo. Verde com tudo no lugar, e `diff` vazio contra as cópias de antes.
