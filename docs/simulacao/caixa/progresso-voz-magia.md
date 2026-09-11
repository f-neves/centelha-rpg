# Progresso · a voz na tela de conjurar (rodada 38)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa, no instante em que ela fecha, hora lida
da máquina (`date +%H:%M`).

- 02:49 (sha 8bbd25a, pós `git pull --rebase`) — começando. Item já dimensionado na rodada 35
  (`progresso-voz-ditado.md`, 00:06): MÉDIO-GRANDE, ~8-9 setters dentro de `pintar()`
  (`artes-grid-ui.ts`, 600+ linhas), sem repintura isolada reaproveitável. Antes de escrever
  código, levantamento de verdade: ler `abrirConjuracao`/`pintar()` inteira, o bloco `arcano` de
  `regras.json` (para os vocabulários DERIVADOS, não inventados, por instrução explícita do
  Arquiteto), e os `data-par` de Alcance/Dano/Duração/Área/Alvos. NÃO toco nas quatro funções do
  tabuleiro (marcarNoChao/grudarNoAlvo/encadear/deslocar). Sem espera de carregamento de modelo em
  cena nova (a da rodada 37 já paga essa cobertura).
- 02:53 — levantamento detalhado feito, antes de codar. Base confirmada do tamanho esperado: os 5
  `data-par` (Alcance/Dano/Duração/Área/Alvos) generalizam de graça via `escalaDe()`
  (`artes-grid.ts:119-127`), já centralizada; `ag-vel` é um `<input>` comum, do tamanho de
  qualquer campo já feito. molde/sólido/saída/fatias/abrir/ângulo/curvatura são 7 setters
  distintos (closures separados dentro de `pintar()`, não generalizáveis sem refatorar a função —
  fora de escopo), mas cada um é um one-liner. Os vocabulários JÁ DERIVAM de `regras.json`
  (`MOLDES_DE_CHAO`/`SOLIDOS`/etc., `artes-grid.ts:690,714,876`), sem tradução no meio — a
  instrução do Arquiteto se confirma correta e sem custo extra.
  ACHADO QUE PRECISA DE CONFIRMAÇÃO antes de construir largo (reportando ao Arquiteto, não
  decidindo sozinha): `ABERTURAS`/`CURVATURAS`/`SAIDAS` são listas FECHADAS com valores fora do
  que a gramática numérica de hoje compõe (90/120/180 graus, passam de "sessenta"; 1,5, decimal) —
  e alguns nomes de Efeito são compostos ("Arma Elemental", `efeitos.json:72`). As duas coisas
  pedem a MESMA capacidade nova: casar uma OPÇÃO falada de MAIS DE UM TOKEN (hoje `escolha` só
  casa um token). Não é inventar sinônimo (os valores continuam vindo de `regras.json`/do
  catálogo, sem tradução), é estender o parser para reconhecer frase em vez de palavra única.
- 03:39 — aprovado (SAIDAS sai de escopo — é só desenho, "EM METROS E SÓ NO DESENHO", nunca entra
  no plano; o 1,5 decimal deixa de existir como problema). Código escrito e testado.
  `comando-barra.ts`/`.json`: centena nova (`cento`=100, `oitenta`=80/`noventa`=90 em dezenas —
  só o que `ABERTURAS`/`CURVATURAS` exigem), `permitido?: number[]` em `CampoNumero` (conjunto
  fechado, diferente de min/max), e o ramo `escolha` casando MAIS DE UMA PALAVRA (longest-match,
  ambiguidade de verdade → recusa). `artes-grid-ui.ts`: extraí `trocarArte`/`trocarEfeito`/
  `ajustarPar`/`setPar`/`setMolde`/`setSolido`/`setFatias`/`setAbrir`/`setAngulo`/`setCurvatura`
  do que vivia solto dentro de `onclick`, e pendurei `dlg.__vozConjurar` com elas (não toquei nas
  quatro funções do tabuleiro nem em `conjurar`/`usarArte`). `grid.astro`: `camposDaMagia`/
  `aplicarNaMagia` (dinâmicos, lendo o próprio diálogo — Arte/Efeito/molde/sólido mudam com o
  conjurador, não têm JSON fixo), `camposAtivos`/`receberFala` estendidos para a terceira tela.
  Testes: `test-comando-voz.mjs` de 34 para 42 asserções (centena, `permitido`, escolha
  multi-palavra, longest-match, ambiguidade real). `cenaVozMagia` em `test-grid.mjs` (5
  asserções, via `window.__ABRIR_CONJURAR`/`__RECEBER_FALA`): Arte troca por fala, Efeito
  composto ("arma elemental", catálogo de verdade) casa certo, um parâmetro numérico escreve o
  grau, "efeito improviso" desmarca. ACHADO NO CAMINHO: um erro meu de edição partiu
  `cenaVozConsentimento` (rodada 37) em duas por engano ao inserir a cena nova no meio dela — vi
  o `p.close()` órfão e os testes rodando contra página fechada, e consertei antes de seguir;
  registrado porque é exatamente o tipo de erro silencioso que "reler antes de confiar" existe
  para pegar. `npm run validate`: só procedência vermelha (10 citações, deslocamento de sempre).
- 03:44 — reaponte do Arquiteto (cd31b74), rodada enviada em um único `--enviar` (sha do aviso
  bc7a64f, sha de trabalho f4df8f7). No aviso: os nove setters como extração sem mudança de
  comportamento (D38b, com a prova), o achado D38c com a mesma clareza do L74, e a lacuna
  registrada de cobertura (só Arte/Efeito/um parâmetro testados ao vivo; molde/sólido/etc. só
  pelo parser puro). Registrando o vão sem linha (02:53 a 03:39) como lição: a próxima etapa
  intermediária ganha uma linha própria, mesmo curta, em vez de esperar o fim do bloco.