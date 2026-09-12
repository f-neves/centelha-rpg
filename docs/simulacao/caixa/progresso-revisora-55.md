# Progresso · revisão da rodada 55

Sinal de vida, hora lida de `date +%H:%M`.

- 13:32: checkout em `6f141ac` (aviso), HEAD/toplevel conferidos. BASE
  `873b772` é ancestral de SHA `974925b`; SHA é ancestral do commit do
  aviso; `git log 974925b..origin/main` só mostra o próprio `6f141ac`,
  TOPO = SHA procede. Lido `55-executora.md` e `progresso-55-l86a.md`
  inteiros. Três pontos de ceticismo pedidos: (1) o teto de pv_max mora
  num lugar só, por COMPORTAMENTO, não só por grep de texto; (2) a cura
  não pode disparar por acidente nas outras três Artes, verificar se
  existe caminho que chegue ao ramo sem passar pela régua; (3) a
  asserção do chão (-5 curando 1 = -4, foraDaFila continua true) usa a
  função REAL, não uma reimplementação no teste.
- 13:33: `npm run validate` verde, "284 citação(ões)... 46 marcada(s)
  (citação histórica)". `test-l86a-cura.mjs`: 32 asserções verdes (bate).
  `npx tsc --noEmit` limpo.
- 13:33: Ponto 3, o mais direto. Lido o teste inteiro: a seção 4 (o
  "chão") NÃO chama `foraDaFila` em lugar nenhum; ela só testa o número
  que `gravarVida` produz (-4, sem piso) e cita, em comentário, que
  `foraDaFila` foi conferida por LEITURA no levantamento, não por
  execução aqui. O próprio cabeçalho do arquivo (linhas 32-44) admite
  isso sem esconder. Fui eu mesma ler `foraDaFila` (`grid.astro:7365
  -7368`) de novo, agora no commit desta rodada: `if (c.pv_max != null
  && (c.pv_atual ?? 0) <= 0) return true;` confirma que -4 realmente
  fica fora da fila e 4 realmente volta, batendo com o que o teste
  assume. A suspeita do Arquiteto procede como GAP METODOLÓGICO real
  (o teste não amarra a asserção à função de verdade, só ao número), mas
  o FATO que ele assume está correto hoje, verificado por mim de forma
  independente.
- 13:34: Ponto 2. Lido o ponto exato da guarda (`artes-grid-mesa.ts:2019
  -2020`): `const cura = ef.efeito_id ? curaDoEfeito(EFEITO[ef.efeito_id]
  || null) : null; if (!ef.dano_dados && !ef.condicao && cura == null)
  continue;`. `curaDoEfeito` (`artes-grid.ts:249-252`) só lê
  `Parametro.pontos` com `typeof === 'number'`, devolve null em qualquer
  outro caso. `curarAlvo` (único call site, `:2078`) só é chamado dentro
  de `else if (p.cura != null)`, e `p.cura` vem do MESMO `cura` calculado
  na linha 2019. Não achei nenhum outro caminho para `curarAlvo`. A
  guarda é airtight: não há como disparar cura sem passar por
  `curaDoEfeito` lendo o catálogo real.
- 13:34: Ponto 1, o mais rendoso. `curarAlvo` (`artes-grid-mesa.ts:1800
  -1809`) não clampa nada, delega inteiro a `ctx.gravarVida`. MAS
  achei DOIS outros lugares com clamp de pv_max independente, que a
  varredura por texto da seção 7 do teste (regex só dentro do CORPO de
  `curar()`) nunca poderia achar: (a) `src/pages/mesa/combate.astro:1286`
  (`Math.max(0, Math.min(c.pv_max, c.pv_atual + delta))`), a aba Combate
  mais antiga, que a cura das Artes nunca escreve, mas É uma segunda
  conta de teto de verdade, com uma diferença semântica (tem piso em 0,
  `curarPv` não tem); (b) `grid.astro:11665`, dentro de `desfazer()`, o
  ramo `'vida-menos'` (desfazer dano relativo de jogador): calcula
  `Math.min(c.pv_max ?? Infinity, ...)` NA MÃO antes de chamar
  `devolverVida`, que por si não clampa nada. Isto é dentro do MESMO
  arquivo que a seção 7 varreu, mas função DIFERENTE de `curar()`, fora
  do alcance do regex. Nenhum dos dois é tocado pela cura das Artes
  desta rodada (Artes só chamam `curarAlvo`→`ctx.gravarVida`→`curarPv`),
  então a claim específica do teste ("curar() não copia o teto")
  continua verdadeira; mas a impressão mais larga ("o teto mora num
  lugar só") não vale para o app inteiro, só para o caminho que esta
  rodada toca.
- 13:34: varredura de travessão pelo diff inteiro da rodada (`873b772..
  974925b`, via `rtk proxy git diff`, 2115 linhas, batendo com o
  `--stat` de 1074+145): zero linhas adicionadas com "—". Meu próprio
  arquivo novo varrido: limpo. Escrevendo o veredito.
