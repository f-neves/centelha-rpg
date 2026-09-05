# CONTEXTO · o estado corrente, para reabrir e continuar

**Para a Executora reabrir uma sessão e saber onde está**, e não para contar história.
Três regras que o mantêm útil:

- **só estado corrente, sem história.** O que fechou mora no `Pendencias.md` e nos commits.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
- **ONDE JÁ EXISTE DONO, APONTA; onde não existe, escreve.** Restabelecer aqui um estado
  que já tem dono é institucionalizar a divergência · foi assim que o registro da migração
  33 passou a dizer menos do que o cabeçalho dela já dizia. **O que este documento carrega
  de próprio é o que veio do chat e não mora em arquivo nenhum.**

Última reescrita: **05/09/2026**.

---

## A fase corrente

**Fase 2 · o tabuleiro como experiência completa de combate.** Fechada em **cinco de
seis**. Falta o **item 6, Interpor e desviar**, e ele está **parado por decisão da mesa,
não por trabalho**.

→ o levantamento inteiro, com o que falta para virar mecanismo: **L34 §6 do
`Pendencias.md`**.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com
coisa funcionando na mesa.*

## O congelamento

**A fase 3 não começou e não começa** até a mesa reavaliar o plano.

**A regra do que sai:** dado se perdendo em produção sai; o resto espera. Saíram por ela o
**L40** (registro do jogador · mitigado) e o **L43** (a marca da mordida · migração 35
escrita).

**Fica congelado mesmo com material pronto:** a **Corrida** pelo desenho da Investida
(fase 3), mesmo com o `marcarInvestida` sendo o molde · molde pronto não é motivo para
antecipar. E a **fase 2.5**, que é a tela da lembrança da névoa.

## As decisões da mesa que não moram em arquivo nenhum

Pelo NOME, porque número de opção depende de qual lista se está lendo.

- **A INVESTIDA VALE −4**, e não −6: investir é forma de aproximação, mesma família da
  Corrida, e gasta a guarda dela e nada mais.
- **O GRID ALIMENTA A CONDIÇÃO**: o motor não cobra a Investida, o número mora só na
  condição, e o tabuleiro a põe e a tira.
- **NÃO HÁ TERCEIRO PREÇO** · *onde a mesa corrige o próprio registro, não cobra; onde a
  mesa muda o que aconteceu na ficção, cobra.* É o teste para o resto do Grid.
- **A CONDIÇÃO COM PRAZO VENCE SOZINHA, A POSTA À MÃO NÃO VENCE NUNCA.**
- **O REFAZER NÃO APAGA LINHA DE JOGADOR**: ele reconstrói o que o motor escreveu; a Arte
  que o jogador conjurou é ação dele.
- **REVELAR QUEM JÁ FOI MORDIDO É DECISÃO DE JOGO, e não se toma de passagem** · foi por
  isso que a migração 35 funde o `mordidos` em vez de a view passar a mandá-lo.
- **OPÇÃO DE DECISÃO SE CHAMA PELO NOME, nunca pelo número**, e a generalização: qualquer
  referência por posição a uma lista que existe em dois lugares vai divergir.
- **DECISÃO DA MESA VEM EM MÚLTIPLA ESCOLHA, três opções ou mais**, feita na hora em que a
  decisão aparece e sem pedir licença.

## O que espera resposta da mesa

**1 · Interpor e desviar** (fase 2, item 6). *O capítulo publicado não tem regra de
interpor, desviar nem abortar, e o Abortar que está na tela saiu do `regras.json` e do
motor sem nunca ter chegado ao livro. Escrever a regra é da mesa. Qual é ela?*

**2 · O `grid.condicao` com dois sentidos.* *Lido como "a condição que isto aplica" em 57
Efeitos, escrito como "a condição com que isto se parece" em 9. Separa em dois campos, um
que o motor executa e um que só classifica?* → o enquadramento inteiro: **L39**.

**3 · A migração 34** (as quatro funções do log). *Escrevo o arquivo?* → a proposta gesto a
gesto: **L40**.

## O que está começado e não terminado

- **A saída da área** · o lado do MESTRE está feito (o `marcarMordido` relê e funde por
  chave); o lado do JOGADOR depende da **migração 35**, escrita e ainda não rodada. → o
  defeito, o levantamento e o que falta: **L43**, e a família em **L41**.

## As migrações

**Quem manda é o cabeçalho de cada `supabase/migracao-NN.sql`**, e ele costuma dizer mais
do que qualquer resumo. O levantamento das pendentes, com o que cada uma muda de formato
para quem está com a mesa aberta, está no **L42**.

Estado em 05/09/2026: **1 a 28 aplicadas**; a mesa vai rodar **31, 32, 29, 30 e 35** numa
sentada, com **31 e 32 coladas** (a única ordem obrigatória é 31 antes de 32). A **33 fica**
· o que falta nela é a tela, não o SQL, e isso é fase 2.5. A **34 ainda não existe** como
arquivo.

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta começa com `Executora:`.**
- **Nunca coautoria do Claude/Anthropic em commit nem em PR.**
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec**, nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Quando a mesa levanta um defeito, a resposta não é o conserto: é o TAMANHO primeiro.**
  Quantas mesas, desde quando, e é certeza ou corrida. E a diferença entre as duas muda o
  conserto · no `mordidos` ela mudou tudo.
- **Gate que nunca foi visto vermelho é garantia escrita, não prova.** Falsificar uma de
  cada vez, restaurando a árvore, e dizer qual não deu para falsificar.
- **Falsificação que a máquina não roda se faz num RAMO DESCARTÁVEL**, porque o portão
  roda em qualquer ramo: empurra, lê o vermelho, apaga o ramo. O ramo some, **a execução
  vermelha fica no histórico**: a de `f4ff1ec` (ramo `falsif/l40-refazer`) é falsificação
  e não defeito, e é a única vermelha entre verdes.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado: a coisa que
  cai E a coisa que fica.
- **Achar linha por CHAVE e nunca por posição**, em teste e em prosa.
- **O compilador do Astro cai nesta máquina** (`UnknownCompilerError`,
  `WebAssembly.instantiate(): size ... > maximum function size`), e vem e vai com a memória
  livre. Matar os `node` deixados por rodadas anteriores costuma resolver; quando não
  resolve, **o CI decide**, e o `validate` não usa Astro.
- **O hook do RTK estraga `grep`/`rg` e heredoc no Bash.** Arquivo multilinha vai pelo
  `Write`; busca vai pela ferramenta `Grep` ou por `awk`.
- **O portão de procedência exige âncora e citação NA MESMA LINHA**, e pareia a citação com
  o ÚLTIMO trecho entre crases da linha.
