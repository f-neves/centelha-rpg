# Rodada 86 · Executora · progresso

- **19:47** · rodada aberta. `git pull --rebase` ok (já em `099d50b`, nada a trazer). Árvore com
  um arquivo não rastreado de outra frente (`caixa/jogador-novo-bestiario.md`), não encostei;
  o `analise-aparencia.md` que estava aqui às 19:31 já não aparece. Vou ler o despacho
  `86-despacho.md` e o veredito `85-revisora.md` antes de tocar em arquivo.
- **19:48** · despacho (144 linhas) e veredito (399 linhas) lidos. Antes de reescrever as caixas
  do fluxograma, levantei a regra que vale hoje no próprio capítulo, para não inventar redação:
  `relacoes-sociais.md:16`, `:55`, `:80`, `:164` e `:272`.
- **19:48** · grupo A escrito: `qual-sistema.md` `:73`, `:74` e `:110`, mais uma linha nova logo
  abaixo do fluxograma dizendo quem move a régua, e `mestre.astro:207`. Zero U+2014 e zero U+2013
  nos dois arquivos, contados com Python, não por `git diff`.
- **19:49** · varri `src/` inteiro por "move a régua" / "a régua anda" para conferir que o grupo A
  fecha, e apareceram DOIS lugares que não estão na lista do veredito:
  `src/data/regras.json:399` (`aparencia.nota`, "que só move a Régua de Relação, teto +6", que é a
  mesma afirmação do `antecedentes.md` que o despacho tirou desta rodada por ser regra de jogo) e
  `src/data/diagramas.json`, que é CACHE dos fluxogramas desenhados no build, com chave de hash do
  código mermaid. O segundo não é contradição: é consequência da minha edição.
  Como `npm run validate` roda `gen-mermaid.mjs --check`, editar o mermaid obriga a redesenhar.
- **19:50** · `node scripts/gen-mermaid.mjs` rodado, exit 0, 6 diagramas, 383 KB. **E ele reescreve
  os SEIS**, não só o que eu mudei: comparei entrada a entrada contra a versão de `099d50b` e as
  cinco de fonte intocada diferem em bytes (as curvas do traço são sorteadas a cada desenho), com o
  TEXTO idêntico nas cinco, conferido por extração dos rótulos. O desenho novo do roteador tem
  "alcance" e zero ocorrência de "move a Régua".
- **19:51** · grupo A commitado sozinho e empurrado: `16377fa`, três arquivos,
  `origin/main..HEAD` = 0. O gancho rodou (`validate` + typecheck), sem coautoria na mensagem.
- **19:53** · grupo B escrito, os seis itens do capítulo. A premissa do item 3 eu conferi em vez de
  aceitar: a Vontade 8 da Sora está em `criacao-de-personagem.md:117` (o veredito diz `:118`, e a
  `Def. Social 15` dele está em `:123`, não `:113`; a diferença de uma linha é da worktree
  congelada dela, o fato bate). "Sora" aparece em dois lugares do capítulo (`:197` e `:255`), e só
  o segundo tinha o número errado. A frase do `:258` continua verdadeira: o excedente máximo
  contra ela é 5 e nunca chega a 6. Contagem no arquivo: zero "lábia", zero "já carrega", zero
  "8 e 24", zero "(9, 7)", zero `Furar`. Os três U+2013 são os intervalos "0–5" da tabela do
  Resistir, anteriores a mim.
- **19:54** · grupo B commitado e empurrado: `fd4497d`, um arquivo, 7 linhas trocadas,
  `origin/main..HEAD` = 0.
- **19:55** · grupo D feito e empurrado: `d56dfa1`, dois arquivos. Antes de escrever, varri os 22
  capítulos por "cortejo" e por "influência estendida" para ver se eram só os três lugares do
  veredito: eram (os dois de `qual-sistema.md` são linha minha, do grupo A). Depois varri por
  `relacoes-sociais` para ver o que mais aponta para lá: 13 lugares, e os que não são meus nem do
  veredito são os quatro do `antecedentes.md`, que estão fora desta rodada por decisão do
  Arquiteto. Zero "período" nos dois arquivos, zero U+2014, zero U+2013.
- **19:58** · grupo C escrito no `regras.json` com `Edit` ancorado, e não por round-trip de JSON
  (reserializar o arquivo inteiro trocaria indentação e escapes de 35 blocos por uma mudança de
  três chaves). Antes de colar, conferi que cada caminho citado nas notas novas existe:
  `derivados.defesaSocial`, `derivados.defesaSocial.reguaNota`, `recuperacaoVontade.quantoPorSono`
  e `acoes.escalaIntervalo.degraus`, os quatro resolvem.
- **19:59** · `npm run validate` rodado por mim, **exit 0** (os 2 ⚑ de portão de navegador que
  nunca rodou nesta máquina são anteriores a mim). JSON parseia, 37 blocos de topo, zero CRLF,
  zero `\bletal\b` no texto novo, e os 23 U+2014 do arquivo são todos de linhas que eu não
  escrevi, conferidos uma a uma.
- **20:00** · grupo C commitado e empurrado: `6509801`, um arquivo. O `git pull --rebase` trouxe
  dois commits de outra frente (`c38f909`, `e7fefd7`) e o rebase passou limpo.
- **20:02** · medi o gerador de diagramas com CONTROLE NEGATIVO antes de escrever a pendência:
  rodei `gen-mermaid.mjs` sem mudar fonte nenhuma e ele reescreveu **6 de 6** entradas com bytes
  diferentes e texto idêntico nas seis. Não é efeito da minha edição. Árvore devolvida ao estado
  commitado (`git checkout --` no meu próprio arquivo, já commitado).
- **20:03** · três pendências escritas, `E9`, `E10` e `J9`, e o placar do `Pendencias.md` refeito
  contando as caixas (244 → 247, 168 → 171 abertos). Zero U+2014 nos três documentos.
  Commitadas e empurradas em `f85b09e`.
- **20:05** · `86-executora.md` escrito, com a conferência do item 12 por nome e a tabela do item
  13 (cada número do bloco novo contra a linha do capítulo de onde ele sai). Zero U+2014 e zero
  CRLF nos dois documentos desta rodada. Commitados e empurrados em `08236a8`.
- **20:07** · conferi o deploy em vez de supor: `gh run list` dá `Deploy site (GitHub Pages)`
  **completed success** no `08236a8`, que contém os grupos A a D. Conferi também que os rótulos
  `E9`, `E10` e `J9` não colidem com item nenhum dos doze arquivos de pendência.
- **20:09** · achei um buraco na minha própria conferência do item 8: a ESCALA nomeava TRÊS linhas
  e eu procurei "já carrega", que só existia em duas. A terceira (`:140`, "o número passivo da
  ficha") dizia o mesmo com outras palavras e tinha passado. Consertada e empurrada em `34e98a2`.
