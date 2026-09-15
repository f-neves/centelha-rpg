# Progresso · rodada 75 · PÔR A M-21 NO AR · o limite da morte é metade do PV máximo

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `206fcef`. Quatro itens, nesta ordem: o limite vira dado em `regras.json`, o capítulo
`vida-ferimentos-cura.md` se reescreve de uma vez, um portão prende o texto ao dado, e o Grid é
MEDIDO e não construído.

- **16:09** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
  `HEAD` = `206fcef`, `origin/main..HEAD` = 0.
- **16:10** · lidos a decisão (`jogador-novo-decisoes.md`, seção "M-21 · o limite da morte é
  METADE do PV máximo") e a minha medição da 74. Lido também o estado do `regras.json`: confirmado
  que não existe bloco de morte, só `ferimentos`, que termina no estado `Caído` a ≤ 0. O PV máximo
  mora em `derivados.pv` (base + Vigor×vigorMult, com tabela por porte).
- **16:13** · conferido o leitor da tabela antes de decidir a forma do bloco: `tierDe`
  (`src/lib/mesa-core.ts`) devolve o ÚLTIMO degrau (`Caído`) para qualquer Vida ≤ 0, então Vida
  negativa não cai em buraco nenhum e a tabela `ferimentos` não precisa de linha nova. O bloco
  novo nasce IRMÃO dela, no topo, e não dentro.
- **16:14** · achado que muda o item 1: a regra velha da morte **também mora no dado**, na condição
  `morrendo` de `condicoes.json` ("antes que o Letal acumulado alcance o PV máximo"). Sem mexer
  nela, o JSON passaria a discordar de si mesmo.
- **16:15** · item 1 FEITO. `regras.json` ganhou o bloco `morte`, irmão de `ferimentos`: o limite é
  `limiteDivisor: 2` sobre o PV máximo, arredondado para baixo, e o número nunca se escreve.
  Conferido no nó: PV 34 (Vigor 3) morre em −17, que é o exemplo da decisão. Junto, e pelo mesmo
  motivo: `condicoes.json` · `morrendo` perdeu a regra velha e aponta para o bloco novo, e as duas
  notas de Sangramento (`regras.json` · `sangramento` e `condicoes.json` · `sangrando`) trocaram
  "dano Letal" por "dano", que é o que "dano é dano" quer dizer.
- **16:17** · item 2 FEITO no capítulo nomeado. `vida-ferimentos-cura.md`: a abertura perdeu as
  duas trilhas e ganhou "dano é dano, cura é cura" com o tipo escolhendo a Absorção; a seção
  "Nocaute e Morte" virou "Queda e Morte" e publica a fórmula `Morre em Vida ≤ −(PV máximo ÷ 2)`
  com os dois exemplos (PV 34 morre em −17, PV 37 em −18); o exemplo do Bram deixou de contar
  Letal separado; as três frases vizinhas de Sangramento e a da Recuperação perderam a palavra
  Letal. `test-travessao-capitulos.mjs` verde.
- **16:17** · e um vizinho FORA do arquivo nomeado, que eu consertei em vez de só anotar:
  `combate.md:107-109` classificava Cortante e Perfurante como "Letal" e dizia que o Impacto "em
  regra nocauteia", **apontando o link para o capítulo que eu acabei de reescrever**. Publicar a
  regra nova com a velha viva a um clique dali seria publicar a contradição. Trocado por "o modo
  escolhe a Absorção, e para ali", mais `:113` ("contra os letais" virou "contra o Cortante e o
  Perfurante"). Se o Arquiteto discordar do alcance, é uma linha para reverter.
- **16:18** · item 3 escrito, dentro do `validate-data.mjs` e não em arquivo novo: teste novo
  precisaria entrar no `scripts.validate` E na matriz do CI, que é a forma do teste que nasce
  fora de um dos dois portões. Ele deriva o limite do `limiteDivisor` e refaz a conta em cima de
  cada par "PV N … morre em −X" que o capítulo publica, em vez de procurar o número 17.
- **16:19** · ensaio dos sentidos, CINCO vermelhos, cada um com mensagem diferente, e o arquivo
  do portão intocado entre eles:
  · capítulo do `HEAD` de volta → 3 erros (fórmula sumida, nenhum exemplo, "Letal" de volta);
  · `regras.json` sem o bloco `morte` → 1 erro, e ele nomeia o capítulo que ficou sem régua;
  · `limiteDivisor` 4 no dado → 3 erros (a fórmula e os dois exemplos, com a conta refeita);
  · `limiteArredonda` "alto" → 1 erro, só no exemplo de PV 37, que é o único que distingue;
  · exemplo de PV ímpar apagado do capítulo → 1 erro dizendo que sem resto o arredondamento
    passa verde estando errado. Este é o controle da OCASIÃO: com PV par os dois arredondamentos
    dão a mesma resposta, e a asserção mediria nada.
  Verde com tudo no lugar, e os dois arquivos conferidos byte a byte contra a cópia de antes do
  ensaio (`diff` vazio nos dois).
