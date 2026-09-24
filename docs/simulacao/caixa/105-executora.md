# Rodada 105 · Executora · quem ajuda a fabricar, e o teto da demanda

- **Despacho:** `docs/simulacao/caixa/105-despacho.md` (`bbec609`).
- **Árvore:** branch `executora`, posta em `bbec609` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-105.md`, com as horas lidas da máquina.
- **Publicado:** o texto em `0a934cf` (fast-forward de `bbec609`); o fechamento da G19 e da G20,
  este relato e o progresso no commit seguinte, cujo sha vai na mensagem ao Arquiteto.

## As três conferências (seção 2 do despacho)

1. **A Dificuldade da espada Comum é 7.** `acoes-oficio-e-mundo.md:93`
   (`| **Comum** | 3 | 7 | 22 | dia | oficial, 6,3 dias |`, na régua da espada) e `:156` (a linha
   "Espada, machado de guerra, arma marcial", Req 3, Dif 7, na escala de dias; era `:152` antes do
   texto novo).
2. **"Aprendiz" tem número no livro, e ele não dá média acima de 7 para quem é comum.**
   `habilidades.md:13`: nível 1 de Habilidade, "Iniciado · Noções básicas. O aprendiz."; e o
   Ferreiro, em `habilidades-secundarias.json:1478`, nível 1: "Aprendiz: prego, gancho e conserto
   tosco." A soma é Destreza + Ferreiro 1, e pela régua de `acoes-e-sistema.md:94-105`: Destreza 2
   ("Comum. A média das pessoas", `atributos.md:23`) dá soma 3 e média 5,5; Destreza 3 dá soma 4 e
   média 7; só Destreza 4 ("Excepcional", `atributos.md:25`) dá soma 5 e média 9. **Vai para
   PRECISA DE MIM.** Pelo despacho, não inventei número nem reescrevi o aprendiz: o exemplo diz a
   regra ("cada um soma o que a sua média passar da Dificuldade 7") sem afirmar que a média deles
   passa.
3. **"Sucesso é total maior que a Dificuldade" é a letra do livro para a Longa.**
   `acoes-e-sistema.md:94`, "Progresso por intervalo = média − Dificuldade", e `:109`, "Média igual
   ou menor que a Dificuldade não impede tentar: o personagem simplesmente **não avança**". Média 7
   contra 7 dá progresso 0: o braçal não soma, pela letra.

## ENTROU

### 1 · A regra, nos dois lados (`0a934cf`)

**Capítulo, `src/content/chapters/acoes-oficio-e-mundo.md`:**

- `:22`, a linha Requisito da tabela: depois de "nenhum modificador abre a porta", "A exceção é
  quem ajuda sob condução: na peça, de quem cumpre o Requisito; na obra, de quem tem o ofício (ver
  Ajuda e Direção de obra)".
- `:33`, a frase "Só a Habilidade conta para o Requisito" ganhou as duas exceções, separadas: na
  fabricação, a condução de quem cumpre o Requisito, contra a Dificuldade da peça; na obra, a
  direção de quem tem o ofício, contra a Dificuldade 4.
- `:117-119`, depois do parágrafo Ajuda: a fórmula com a frase do autor, e "É por essa regra que
  os aprendizes entram na espada: sob a condução do ferreiro eles dispensam o Requisito 3, e cada
  um soma o que a sua média passar da Dificuldade 7. **Um braçal, de média 7, não soma nada na
  espada.**"
- `:121-125`, Direção de obra: abre dizendo que a regra é de obra, com a lista do autor; a fórmula
  passa a "Numa obra, sob direção de quem tem o ofício..."; e fecha com "Na forja, na bancada e no
  tear, a Dificuldade 4 não vale: quem ajuda trabalha contra a Dificuldade da peça, pela regra da
  Ajuda."

**Documento de regra, `Acoes_Sistema.md`:**

- §7.3, `:1060` (a mesma linha da tabela) e `:1079-1082`: a frase velha "O ajudante sob direção
  (§7.6) não tem Requisito nenhum: quem sabe é quem dirige" virou as duas exceções, com a mesma
  separação do capítulo.
- §7.6, `:1193-1197`: a fórmula e o parágrafo dos aprendizes e do braçal, com "Decidido pelo autor
  em 24/09/2026 (G19 e G20)"; `:1199-1211`: Direção de obra restrita a obra, com a mesma abertura, a
  mesma fórmula e o mesmo fecho do capítulo.

**Uma correção minha antes do commit:** a primeira redação do §7.3 dizia que a condução de quem
cumpre o Requisito valia "na peça e na obra". Para obra, a regra sempre disse "sob direção de quem
tem o ofício", e o autor não mudou isso; a redação publicada separa as duas condições.

### 2 · A G24 registrada, sem corrigir nada (`0a934cf`)

No `docs/pendencias/G-acoes-sistema.md`, depois da G23, com o texto do despacho. **As linhas
citadas mudaram:** o despacho dava `acoes-oficio-e-mundo.md:198-200` e `Acoes_Sistema.md:1295-1299`,
que eram as linhas de antes do texto novo. No commit elas são `:202-204` e `:1307-1311`, conferidas
contra o arquivo.

### 3 · Citações de linha deslocadas pelo texto novo (`0a934cf`)

O texto novo empurrou para baixo trechos citados por itens abertos do mesmo arquivo de tema. Só o
número mudou, sem mexer no conteúdo dos itens (que são de fora da rodada): **G17** (`:168` virou
`:172`, a linha da Placa completa sob medida), **G21** (`1260-1264` virou `1272-1276`; capítulo
`:178` virou `:182`), **G22** (`1295` virou `1307`; capítulo `:198` virou `:202`) e **G23**
(`1139-1145` virou `1141-1147`; `:1234` virou `:1246`). Varri o resto do repositório com a
ferramenta Grep: fora de `docs/simulacao/caixa/` (relatos antigos, que ficam como estão), nada mais
cita linha desses dois arquivos. **O `test-procedencia` não lê essas citações** (passou verde antes
e depois da correção), então a conferência é à mão.

### 4 · G19 e G20 fechadas (commit seguinte)

Caixa `[x]` nas duas, com a frase do autor, a data e o sha `0a934cf`. As linhas citadas no corpo das
duas ficaram como estavam, com a nota de que são do texto de antes da decisão (`bbec609`), porque o
texto que elas descrevem não existe mais. `Pendencias.md` regenerado no mesmo commit.

### 5 · A prova

- `npm run validate` verde (código 0) e `npm run build` verde (código 0), rodados depois da última
  mudança de texto, antes do `0a934cf`; o gancho de `pre-commit` passou no `0a934cf`, com o
  `astro sync` e o `tsc`, porque o commit toca `src/`.
- `node scripts/test-procedencia.mjs` verde.
- **Travessão, lendo os arquivos:** contei as linhas com o caractere em cada arquivo tocado, antes
  (`git show HEAD:`) e depois (o arquivo): 0 e 0 nos cinco (`Acoes_Sistema.md`, `Pendencias.md`,
  `G-acoes-sistema.md`, o capítulo e o progresso). Controle positivo: o mesmo `grep -c` acha 4 no
  `CLAUDE.md`. Mensagem do commit: 0.
- Nenhuma linha de coautoria nem `Claude-Session` na mensagem (conferido no `git log -1`).

## PRECISA DE MIM

1. **O aprendiz do livro não passa da Dificuldade 7, a não ser com Destreza 4.** A frase do autor
   afirma que a média dos aprendizes passa de 7; pelo livro (conferência 2), um aprendiz de Destreza
   Comum tem média 5,5 e um de Destreza 3 tem média 7, e nenhum dos dois soma na espada pela regra
   nova. O exemplo "dez aprendizes aceleram uma espada Comum" continua no texto (as palavras do
   autor), mas pela letra ele só vale para aprendizes de Destreza 4. Saídas possíveis: trocar os
   aprendizes do exemplo por oficiais (Habilidade 2 ou 3), dizer que "aprendiz" ali é quem já passa
   de 7, ou aceitar que dez aprendizes comuns não aceleram a espada.
2. **A regra nova bate de frente com `acoes-e-sistema.md:172`.** Lá o ajudante rola contra
   **metade** da Dificuldade, com "forjar" como exemplo; a regra nova diz Dificuldade **inteira** da
   peça. É o território da G18, fora desta rodada, mas o texto novo deixa a contradição mais nítida.
3. **A escala de semanas mistura obra e peça.** O autor diz que a Dificuldade 4 vale para "as obras
   das tabelas de semanas e estações", e a tabela de semanas (`acoes-oficio-e-mundo.md:163-172`) tem
   obras (casa, celeiro, forja/moinho) ao lado de peças (cota de malha, brigandina, lamelar, as duas
   placas, carroça, barco de pesca). Escrevi "as obras das escalas de semanas e de estações, como a
   casa, o moinho, a muralha e o navio", sem decidir em que lado ficam a carroça e o barco.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
