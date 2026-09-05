# CONTEXTO · o estado corrente, para reabrir e continuar

**Este documento é para a Executora reabrir uma sessão e saber onde está**, e não para
contar a história de nada. Duas regras que o mantêm útil:

- **só estado corrente, sem história.** O que já foi feito e fechado mora no
  `Pendencias.md` e nos commits. Aqui fica o que ainda vale.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
  Documento que cresce por adição vira registro, e registro ninguém relê ao reabrir.

**Atualizar ao fim de cada entrega.** Última reescrita: **05/09/2026**.

---

## A fase corrente

**Fase 2 · o tabuleiro como experiência completa de combate.** Fechada em **cinco de
seis**.

O que falta é **o item 6, Interpor e desviar**, e ele está **parado por decisão da mesa,
não por trabalho**. O levantamento está entregue (L34 §6 do `Pendencias.md`) e o primeiro
fato é o que decide: **o capítulo publicado não tem uma linha sobre interpor, desviar nem
abortar**. Então não é implementar regra existente, é escrever regra nova, e isso é da
mesa.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com
coisa funcionando na mesa.*

## O congelamento

**A fase 3 não começou e não começa** até a mesa reavaliar o plano.

**O que SAI do congelamento, e a regra é uma só:** dado se perdendo em produção sai; o
resto espera. Saíram por essa regra:

- o **L40** (o registro do jogador que o mestre apagava) · **mitigado**, o conserto é a
  migração 34;
- a **saída da área** (duas abas escrevendo `mordidos`) · **autorizada, ainda não feita**,
  e é a próxima coisa a construir.

**O que fica congelado mesmo tendo material pronto:**

- a **Corrida** pelo desenho da Investida (fase 3), mesmo com o `marcarInvestida` sendo o
  molde pronto. Molde pronto não é motivo para antecipar;
- a **fase 2.5**, que é a tela da lembrança da névoa (ver a migração 33 abaixo).

## As decisões da mesa que valem e não estão em documento nenhum

Pelo NOME, porque número de opção depende de qual lista se está lendo.

- **A INVESTIDA VALE −4**, e não −6: investir é uma forma de aproximação, mesma família da
  Corrida, e gasta a guarda dela e nada mais.
- **O GRID ALIMENTA A CONDIÇÃO** (a dupla cobrança do −2): o motor não cobra, o número mora
  só na condição, e o tabuleiro a põe e a tira.
- **NÃO HÁ TERCEIRO PREÇO**, e a frase é o teste para o resto do Grid: *onde a mesa corrige
  o próprio registro, não cobra; onde a mesa muda o que aconteceu na ficção, cobra.*
- **A CONDIÇÃO COM PRAZO VENCE SOZINHA, A POSTA À MÃO NÃO VENCE NUNCA.** Ele a pôs, ele a
  tira: a régua não calcula por cima do mestre.
- **O REFAZER NÃO APAGA LINHA DE JOGADOR.** Ele reconstrói o que o motor escreveu sobre
  efeitos; a Arte que o jogador conjurou é ação dele, não escrituração do motor.
- **OPÇÃO DE DECISÃO SE CHAMA PELO NOME, nunca pelo número** · e a generalização que a mesa
  tirou disso: qualquer referência por posição a uma lista que existe em dois lugares vai
  divergir. É a mesma família da busca por posição em teste.
- **DECISÃO DA MESA VEM EM MÚLTIPLA ESCOLHA, com três opções ou mais.** Nunca pergunta
  aberta, e a pergunta é feita na hora em que a decisão aparece, sem pedir licença.

## O que está esperando resposta da mesa

**1 · Interpor e desviar** (fase 2, item 6). *O capítulo não tem regra de interpor,
desviar nem abortar, e o Abortar que está na tela saiu do `regras.json` e do motor sem
nunca ter chegado ao livro. Escrever a regra é da mesa. Qual é ela?*

**2 · O `grid.condicao` com dois sentidos** (L39). *Ele é lido como "a condição que isto
aplica" em 57 Efeitos e escrito como "a condição com que isto se parece" em 9. Nenhum
conserto uniforme serve: apagar o campo nos nove quebra Lapso e Instante, ligar a
aplicação nos nove quebra os outros sete. Separa em dois campos, um que o motor executa e
um que só classifica?*

**3 · A migração 34** (L40). *O conserto de verdade do log é ela, com quatro funções
(`mestre_registra`, `log_apaga`, `log_edita`, `log_refaz_efeitos`). Escrevo o arquivo?*

## O que está começado e não terminado

- **A saída da área** · autorizada a sair do congelamento, **nada construído ainda**. Duas
  abas escrevem `arena_efeitos.mordidos`, as duas por vetor inteiro a partir de foto local,
  com um diálogo humano entre a leitura e a escrita. A RPC `jogador_muda_efeito` aceita
  `mordidos` desde a migração 22, o que prova que a aba do jogador resolvendo foi
  construída de propósito. **A consequência que o jogador sente: ele rola a fuga duas vezes
  sem entender por quê**, porque a marca da mordida se perde.
- **A terceira falsificação do L40** · devendo. Trocar o `minha` do `refazerLogEfeitos` por
  `e.ef` e ver a cena ficar vermelha. **Não roda nesta máquina** (o compilador do Astro cai
  em `UnknownCompilerError`, seis tentativas), então **fazer quando o CI estiver verde, em
  ambiente limpo**. Falsificação devida que ninguém volta para fazer vira asserção que
  nunca foi vista vermelha.

## As migrações

**1 a 28 aplicadas.** As cinco pendentes estão levantadas no **L42**, com o que cada uma
muda de formato para quem está com a mesa aberta.

**A mesa vai rodar quatro, nesta ordem: 31, 32, 29, 30.** A única ordem obrigatória é
**31 antes de 32** (a view da 32 chama a `tick_da_arena`, que nasce na 31).

**A 33 fica, e o que falta nela não é SQL: é a TELA.** A `lembranca` aparece zero vezes no
`grid.astro` e nenhum commit a introduziu. Isso é fase 2.5.

**A 34 ainda não existe** como arquivo · ver "esperando resposta".

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta começa com `Executora:`.**
- **Nunca coautoria do Claude/Anthropic em commit nem em PR.**
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec** (`git commit -m "..." -- arquivo1 arquivo2`), nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Regra de gente e não de código: quando a mesa levanta um defeito, a resposta não é o
  conserto, é o TAMANHO primeiro.** Quantas mesas, desde quando, e é certeza ou corrida.
  Foi assim no −6, na condição vencida e no log.
- **Gate que nunca foi visto vermelho é garantia escrita e não prova.** Falsificar uma de
  cada vez, restaurando a árvore, e dizer qual não deu para falsificar.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado: a coisa que
  cai E a coisa que fica.
- **Achar linha por CHAVE e nunca por posição**, em teste e em prosa.
- **O compilador do Astro cai nesta máquina** (`UnknownCompilerError`,
  `WebAssembly.instantiate(): size ... > maximum function size`), e vem e vai com a memória
  livre. Matar os `node` deixados por rodadas anteriores costuma resolver; quando não
  resolve, **o CI é quem decide**, e o `validate` não usa Astro.
- **O hook do RTK estraga `grep`/`rg` e heredoc no Bash.** Arquivo multilinha vai pelo
  `Write`; busca vai pela ferramenta `Grep` ou por `awk`.
- **O portão de procedência exige âncora e citação NA MESMA LINHA**, e pareia a citação com
  o ÚLTIMO trecho entre crases da linha.
