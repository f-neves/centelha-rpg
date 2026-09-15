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
- **16:20** · `npm run validate` verde, lido pelo código de saída e não pela última linha
  (`EXIT=0`, sem cano na frente da guarda).
- **16:21** · itens 1 a 3 no ar: `6221b4a`, empurrado. `origin/main..HEAD` = 0, conferido, e sem
  coautoria nenhuma na mensagem (conferido por `grep` na mensagem já commitada).
- **16:21** · começa o item 4, que é MEDIÇÃO e não construção.
- **16:22** · varridos os pontos de escrita da Vida, contados por mim e não herdados de contagem
  de ninguém. O escopo da varredura, dito em voz alta: `src/pages/mesa/grid.astro`,
  `src/lib/artes-grid-mesa.ts` e os arquivos de `supabase/`, por `pv_atual`.

## ITEM 4 · o custo de ensinar o limite à mesa, MEDIDO

**Escopo da medição:** os pontos que ESCREVEM `pv_atual`, no cliente e no servidor. Não olhei o
que só LÊ (a barra de Vida, a fila, o oráculo), porque ler Vida negativa já funciona: `tierDe`
(`src/lib/mesa-core.ts`) devolve `Caído` para qualquer valor ≤ 0 e `pctDe` prende a barra em 0.

### Os SEIS pontos que BAIXAM a Vida

| onde | o piso de hoje | `pv_max` à mão? |
|---|---|---|
| `grid.astro:11175` · `baixarVida`, ramo do MESTRE | `Math.max(0, …)` | sim, usado duas linhas abaixo |
| `grid.astro:11188` · `baixarVida`, eco local do JOGADOR | `Math.max(0, …)` | **não**: a view esconde a Vida do inimigo e `pv_max` chega nulo |
| `supabase/migracao-22.sql:146` · `jogador_dano` | `greatest(0, …)` **no servidor** | sim, é coluna da mesma tabela |
| `artes-grid-mesa.ts:1872` · `morder` | `Math.max(0, …)`, escrita crua por `ctx.SB` | sim |
| `artes-grid-mesa.ts:1906` · dano de Efeito pela outra via | `Math.max(0, …)`, escrita crua | sim |
| `artes-grid-mesa.ts:2104` · condição contínua (o Sangramento) | **nenhum** | sim |

**O sexto é o achado da medição, e ele contradiz o que eu mesma escrevi na rodada 74** ("a mesa
não implementa morte nenhuma", que continua verdadeiro, e "tem um `pv_atual` só", idem): o tique
da condição contínua chama `gravarVida(c.id, −total)`, e `curarPv` (`grid.astro:2682`) só tem
TETO (`Math.min(pv_max, …)`), nunca piso. **O Sangramento já escreve Vida negativa hoje**, sem
que nada no desenho tenha decidido isso. É o único caminho que atravessa o zero, e atravessa por
acidente.

### Os QUATRO pontos que SOBEM a Vida, e é onde a morte não pode se desfazer

`curarPv` (`grid.astro:2682`, menu do mestre e Artes de cura), `curarAlvo`
(`artes-grid-mesa.ts:1921`, que chama o primeiro), `devolverVida` (`grid.astro:11626`, o desfazer,
que escreve valor absoluto cru) e `jogador_muda_peca` (`supabase/migracao-22.sql:123`, que escreve
o `pv_atual` que o cliente mandar, sem piso e sem teto). Nenhum dos quatro tem noção de morto:
curar um morto o traz de volta em silêncio.

### Coluna nova? NÃO. Migração? UMA, e de uma linha

- **Coluna:** nenhuma. `pv_max` já existe (`supabase/migracao-2.sql:135`) e `pv_atual` é
  `integer` **sem check constraint** (`:136`), então Vida negativa já é armazenável hoje. O limite
  deriva de `pv_max` e não precisa ser guardado.
- **Migração:** uma, e pequena. O piso `greatest(0, …)` do `jogador_dano` mora no SERVIDOR: é um
  `create or replace function` com uma linha alterada. Enquanto ele estiver lá, **nenhum golpe de
  jogador leva ninguém abaixo de zero**, e a régua nova simplesmente não existe do lado deles.
- **Cliente:** cinco pisos a trocar, e nenhum deles é o mesmo gesto. Quatro viram
  `Math.max(limite, …)` com o limite derivado de `pv_max`; o quinto (`grid.astro:11188`) não
  tem `pv_max` para derivar, e o caminho honesto ali é não adivinhar, deixando o número vir da
  campainha depois da RPC.

### O que NÃO está medido, porque é decisão e não conta

Quem MARCA a morte. A condição `morto` existe em `condicoes.json` e o mestre a põe à mão; marcar
sozinho no caminho do dano é gancho novo, e ninguém decidiu se a mesa deve fazer isso ou se a
morte é anúncio do mestre. **Não construí nada disto.**
