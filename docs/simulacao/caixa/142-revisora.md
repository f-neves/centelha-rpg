# 142 · Revisora · limpeza dos estados de `decisoes.md` (`816bca10`)

Pino: `816bca10` (branch `revisora` na árvore `centelha-techlead-revisora`; o veredito 141 é ancestral de
origin/main). Fonte: o diff `816bca10~1..816bca10` de `docs/decisoes-partes/decisoes.md`, os commits citados, e o mapa
`../tmp/arquiteto/limpeza-estados.md`, que tratei como hipótese.

**Atenção à ordem:** `816bca10` vem **depois** de `48c02e58` (registro D-067 a D-071) e de `e462681a` (rodada 14 da
Executora), e os dois são ancestrais dele (`git merge-base --is-ancestor`). Isso pesa nos itens 4 e 5 do CORRIGE.

**Resultado: um CORRIGE (cinco pontos, todos de texto do registro). O resto PROCEDE.**

## Como conferi

1. **Só a linha "- Estado:" mudou:** o diff tem 48 linhas tiradas e 48 postas, e todas as 96 são linhas `- Estado:` (a
   varredura das linhas mudadas que não começam por `- Estado:` deu vazio). Nenhum texto de decisão mudou.
2. **Entrada por entrada** (`../tmp/revisora/estados-142.mjs`, saída em `estados-142.txt`): para cada uma das 48, o
   estado antigo, o novo, os shas citados, se cada sha existe (`git log`), o assunto dele, e se o id da decisão aparece
   na mensagem ou no diff do commit. **Todos os shas existem.** Onde o id não aparece no commit, conferi pelo conteúdo e
   pelos meus vereditos daquelas rodadas (127 a 141).

## As 48 trocadas

**Certas no sha e no conteúdo (41, mais a D-018):** D-001 (`a7bec31c`), D-003, D-004, D-021, D-023, D-046, D-049 (`0aca9c99`), D-006 (`d8f693b1` e
`7e0d0bb7`), D-007, D-008, D-009 (`5598adeb`), D-011, D-031, D-052 (`028213ac`), D-012 (`61bf02fe`), D-014 (`03c1d711`),
D-016 (`66497997`), D-017, D-024, D-026, D-042 (`2ab7da2e`), D-020 (`0aca9c99` e `189ddfcb`, o RANK do Conjurar), D-022,
D-050 (`5e32204d`), D-027, D-028, D-029 (`eaca41a0`), D-030, D-045 (`8704232a`), D-033, D-048 (`3dc09c71`), D-043
(`3dc09c71` e `8704232a`), D-035 (`2aa30250`), D-036 (`7ab6c733`), D-037 (`d3ad7ca7`), D-038 (`5df8c7d5`), D-040
(`58b22ce4`), D-055, D-056, D-062 (`bd041499`), C-042 (`0cdc06db`: o commit registra as resistências fora do
vocabulário, "ferro frio", "adamantina", "ácido", como pendência na B16, que é o que a C-042 manda). D-018 também está
certa no sha (`0aca9c99` publicou a régua em `centelha.md`, conferido na 134), mas ver o item 3.

Duas certas que pediriam o segundo sha, sem ser erro: a D-055 foi completada em `76e9510e` (o "Teto 3" do passo 8, CORRIGE
138) e a D-065 em `3e632db6` (a mão inábil, CORRIGE 140).

## CORRIGE · cinco pontos no texto dos estados

1. **D-005: o sha está errado.** Diz "no ar (aplicada em 0aca9c99, 1e r8)". A frase que aplica a decisão, "a Arte Mana
   não usa a Centelha em conta nenhuma", entrou em `artes/regras.astro` no **`5e32204d`** (1e r9, ARTE-MANA): `git show
   5e32204d -- src/pages/artes/regras.astro` a acrescenta, e o `0aca9c99` não a tem. O `artes.json` da Arte Mana não tem
   "Centelha" no texto nem antes nem depois de nenhum dos dois commits. O próprio mapa avisava ("atribuí a `0aca9c99` pelo
   relato da r8 … sem rodar `git blame`"). Deve dizer: **"no ar (aplicada em 5e32204d, 1e r9)"**.
2. **O índice ficou desencontrado das entradas.** A tabela do topo ainda diz "a implementar" para as duas entradas C que
   a limpeza trocou: **C-042** (`decisoes.md`:145) e **C-077** (:191). As outras 46 são D, que o índice não lista. O
   índice é o que se lê primeiro, e agora diz o contrário da entrada.
3. **Três estados ficaram se contradizendo**, porque o script trocou só o começo e deixou o resto da frase antiga:
   - **C-077:** "no ar (resolvida pela D-006) (aguarda decisão do autor sobre o teto de Arte do mortal)". A C-077 é uma
     ordem de processo ("não libere nada antes de o autor ver os números e decidir"); o autor decidiu (D-006) e o código
     liberou (`7e0d0bb7`). Deve dizer algo como **"cumprida: o autor decidiu o teto na D-006, e o código liberou em
     7e0d0bb7"**, sem o "aguarda".
   - **D-018:** "no ar (aplicada em 0aca9c99, 1e r8, antes da rodada 11 prevista) na rodada 11". Sobra o "na rodada 11".
   - **D-019:** "no ar (aplicada em 3dc09c71, 1e r5) na rodada 5 (aguarda o veterana-1e: as respostas do autor sobre
     Imobilizado e sobre as Técnicas do Agarrão do Urso podem mexer na redação)". As respostas vieram (D-043, D-045) e
     foram aplicadas; o "aguarda" ficou.
4. **D-066 perdeu a parte que falta.** O antes dizia "(rodada 13: uma linha no Cap. XIII; linha do bestiário e revisão dos
   golens ficam na B14)"; o depois diz só "no ar (aplicada em 2dc330a2, r13)". A linha do bestiário e os golens continuam
   pendentes (`docs/pendencias/B-bestiario.md`). Deve dizer **"no ar no Cap. XIII (2dc330a2, r13); a linha do bestiário e
   os golens ficam na B14"**. É parcial, como as nove que ficaram.
5. **D-057 e D-065 dizem "no ar" sem a D-067**, que já estava registrada e aplicada antes deste commit. A D-067 (`48c02e58`)
   diz "SUBSTITUI, no que toca ao id `chutes` como arma e à lógica de Chutes no Bloqueio da ficha, a D-057 … e a D-065
   itens 1 e 3 (parte dos Chutes)", e no pino o `armas.json` já não tem `chutes` (0 ocorrências de `"id": "chutes"`). Pela
   regra do registro (quem aplica a nova marca a antiga), as duas devem dizer **"no ar para os Punhos (2dc330a2, r13;
   3e632db6); os Chutes como arma substituídos pela D-067"**. O mesmo vale, quando a rodada 14 for revisada, para a D-067 a
   D-071, que ainda dizem "a implementar" com `e462681a` já no `main`.

**Por que CORRIGE (§8):** a promessa do commit é que cada estado diz onde a decisão foi aplicada. Os cinco pontos
falsificam isso em entradas concretas, e o conserto é de texto, no mesmo arquivo.

## As que ficaram "a implementar", e as três que o script não trocou

**Parciais (9), certo deixar como estão:** C-002 e C-040 (`semVida` existe na ficha e nenhum código lê), C-023 e C-030
(pendências registradas, sem resolver), C-078 (registrada na B14, não executada), D-051 (B14). Três pediriam só a linha
atualizada, sem mudar a classe:
- **D-034:** a Longa a 3 por dado está no ar (`61bf02fe`, 1d r3); as outras decisões da 1c seguem sem verbatim. A linha
  ainda diz "a implementar nas rodadas 1 a 3".
- **D-047:** "a implementar na rodada 10" já passou. Deve dizer que a troca não existe (nenhuma Técnica de nível 3 sem
  pré-requisito, D17) e que a regra ficou com a **D-059** (as fichas ficam sem a Técnica, aplicação no fim da revisão,
  D-053).
- **D-060:** está no ar em `bd041499` (os 28 Efeitos, Dissipar, Mãos sobre a Multidão, o parágrafo do nível da Arte), e
  falta só o Chamar à Mão (N8, que depende do Grid). A linha ainda diz "a implementar (rodada 12: …)".

**Não aplicadas:** D-010 (economia, segurada pela D-058), D-044 (Bram, espera o fim da revisão, D-053 e D-059), C-059
(botão adiado): certo. **D-032 não é "a implementar": está substituída.** Os totais dela (Kael 1065, Sora 1323, Veil
1864, Bram 1726) foram trocados pela D-047 e pela **D-059** (1045, 1303, 1844; Bram pela D-044, 1401). Deve dizer
"substituída pela D-059 (e, no Bram, pela D-044)". **D-067 a D-071:** ver o CORRIGE, item 5.

**As três que o script não trocou:**
- **C-075** ("fica como está, pendência G75"): foi **substituída pela P-01** ("Margem na Acumulada: o Mestre decide;
  congelar intervalo e subir qualidade viram exemplos", na seção Recebidas em 03/10/2026, "CONFIRMADA … despachada"),
  aplicada em `e7c06baa` (Bloco B de pendências: "O Esgueirar passa a tratar o congelar como exemplo. G75 fechada"), e a
  G75 está `[FECHADA]` em `G-acoes-sistema.md`:529. Deve dizer **"substituída pela P-01 (03/10/2026), aplicada em
  e7c06baa; G75 fechada"**, na entrada e no índice (:189). A reserva do mapa procede: não é "no ar".
- **D-002** (Mana do mortal, reserva própria, 1 por dia ou 2 descansando): o texto está no ar desde `0aca9c99` (1e r8,
  MANA-MORTAL; o texto renderizado conferido na 134). No código, a mesa já trata a Mana como contador próprio, e o mortal
  entra com o valor da Vontade desde `7e0d0bb7` (que diz, ele mesmo, que "não entram a reserva própria … (D-002)": a parte
  que faltava era o texto). A recuperação por dia não tem relógio no código, mas a recuperação de Mana de ninguém tem
  (`arcano.recuperacaoMana` só é lido pela página, conferido na 134): é regra de mesa para todos. Deve dizer **"no ar
  (texto em 0aca9c99, 1e r8; o valor da Vontade na mesa desde 7e0d0bb7)"**. A reserva do mapa não pede PARCIAL.
- **D-025** (controle percebido): aplicada em `2ab7da2e` (1e r6, CONTROLE-PERCEBIDO, conferido na 132: a linha "Ter sido
  controlado e perceber | −2" e o parágrafo; o nó do `qual-sistema.md` com "ressentimento"). Deve dizer **"no ar
  (aplicada em 2ab7da2e, 1e r6)"**.

**As três fora da contagem:**
- **Cadeia do Resistir** (`decisoes.md`:17-22): o item 2 ainda diz que a C-070 está "**No ar.**" e o item 3 que a D-001
  está "a implementar (despacho do Resistir)". Devem dizer: C-070 "**Substituída pela D-001**" e D-001 "**no ar (aplicada em
  a7bec31c)**"; e o item 4, "Entra na rodada 6", vira "aplicada em 2ab7da2e". Junto, a **C-072** (entrada e índice, :186)
  diz "no ar (não conferido)", e a D-017 a substituiu: deve dizer "substituída pela D-017 (2ab7da2e)". A **C-070** (entrada)
  diz "Texto no ar até o despacho do Resistir ser aplicado", e ele foi (`a7bec31c`): basta "substituída por D-001".
- **C-029:** "SUBSTITUÍDA por D-057 para o desarmado …; a Proeza 'punho como arma média' continua a implementar". Está
  certo; pode ganhar "(Punhos pela D-057 e D-065; os Chutes como arma saíram pela D-067)".
- **B-032:** "no ar (custo-servicos.md:101, :115, :118); notas de ficha de animal comum: a implementar (B14/B18)". Está
  certo como está (parcial dito por extenso).

## Observação

A **C-065** (`decisoes.md`:1022) diz "Pendência G75 em G-acoes-sistema.md: rever de uma vez…", e a G75 está fechada desde
`e7c06baa`. Fora do que este commit mexeu; anoto junto da C-075.

## CLAREZA

Nada a acrescentar.

## Nota de delta (§10)

No push, o rebase trouxe `0fab8b13` (rodada 14: tira o parágrafo da D-068 de `combate.md`). Ele toca só `combate.md` e o relato, e não `decisoes.md`: a conclusão fica.
