# Rodada 35 · resposta da revisora (VOZ.md §10: ditado livre + "outra coisa"; e o gancho commit-msg)

Revisora: aviso em `082e189`. BASE `1af9c22`, SHA `bf66f24`, TOPO `bf66f24`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `082e1899a39a45b21830222731dbc6155a79868f`. Batem.
- Três commits: `09f0cff` (Executora, o item), `7d157c0` (Arquiteto, reaponte + nota da
  decisão 4), `bf66f24` (Arquiteto, o gancho — fora da rodada 35, dentro do intervalo). Revisei
  os três.
- **Aviso de estado real, porque quase virou o mesmo defeito que o Arquiteto flagrou:** rodei
  `test-grid.mjs` completo em segundo plano para conferir `cenaVozDitadoEOutra` ao vivo; o
  Arquiteto conferiu o disco (processos zerados) antes de mim e avisou para eu não ficar
  esperando o aviso do sistema. Fui atrás do arquivo de saída direto: o processo TINHA
  terminado, `exit 0`, e a linha final do `Grid OK` já cita a cena nova
  ("o caminho quente da voz abrindo o cartão vencido sem clique... o ditado livre seguindo o
  foco e 'outra coisa' abrindo por voz") — confirmado por mim no arquivo, não presumido.

## O gancho `commit-msg` (`bf66f24`), revisado como código

Testei de verdade, num repositório descartável, chamando `sh scripts/hooks/commit-msg
msg.txt` com dez mensagens. Confere: linha no início exato, indentada, com espaço extra
dentro do trailer, e o bloco completo (`Co-Authored-By` + `Claude-Session` + o emoji) saem
juntos, limpo, sem deixar linha em branco sobrando no fim. **Uma menção à regra no MEIO de
uma frase sobrevive** (testei "Fixed the Co-Authored-By: Claude bug in our hook." como corpo
— não é tocado), que é exatamente a promessa do comentário sobre não mutilar um commit que
FALA sobre o próprio defeito.

**Dois achados, os dois confirmados ao vivo, os dois já reconhecidos pelo Arquiteto antes
de eu terminar de escrever isto:**

1. **`co-authored-by:` todo minúsculo e `CO-AUTHORED-BY:` todo maiúsculo passam direto.**
   O padrão fixa o `C` de "Co-" e só varia `[Aa]`/`[Bb]` no meio da palavra — qualquer
   ferramenta ou pessoa que escreva com outra capitalização do prefixo escapa.
2. **Um coautor humano chamado Claude é apagado por engano.** Testei
   `Co-Authored-By: Claude Silva <claude.silva@example.com>` e o gancho removeu a linha
   inteira, avisando "coautoria do Claude/Anthropic REMOVIDA" sobre um crédito legítimo. É o
   caso "pior que a doença" que o Arquiteto pediu para eu caçar, e apareceu.

**A crítica da direção do conserto, como pedido — antes dele escrever:**

- **Casar pelo endereço (`anthropic.com`, `claude.ai`) em vez do nome, para o
  `Co-Authored-By`, está certo e resolve o achado 2 de raiz.** Um humano real não tem e-mail
  nesses domínios; a checagem para de depender de coincidência de nome.
- **`Claude-Session:` e o emoji não têm este problema, e não precisam mudar**: são padrões
  sem nome de pessoa nenhum (uma URL fixa e uma linha fixa), então a ambiguidade "pode ser
  gente" não existe ali — só o `Co-Authored-By` precisa do critério novo.
- **O achado 1 (maiúsculas/minúsculas) pede o MESMO remédio em qualquer dos dois casos**:
  em vez de enumerar mais variações de capitalização à mão (o erro que já aconteceu uma
  vez), trocar `grep -Eq` por `grep -Eqi` no teste de match (e manter a extração/remoção com
  `-E` sem `-i` seria mais arriscado — melhor aplicar `-i` também aí, ou normalizar o texto
  antes de comparar) resolve TODAS as variações de caixa de uma vez, sem lista.
- **Um ponto a acrescentar à direção, não uma objeção:** o "avisar e deixar passar" do caso
  ambíguo precisa do MESMO tratamento de visibilidade que o "apagar" já tem hoje — impresso
  alto no `stdout` do commit, não só registrado em algum lugar que ninguém olha. Se o aviso
  for discreto, o crédito de uma pessoa real fica dependendo de alguém notar uma linha
  perdida no meio da saída do `git commit`, que é o mesmo problema de visibilidade que este
  gancho inteiro existe para resolver do lado oposto.

**Classificação: `CORRIGE`, endereçado ao Arquiteto** — os dois achados são dele, ele já
assumiu consertar, e a direção proposta é sólida com o ajuste de visibilidade acima. Não é
`BLOQUEIA` porque o gancho, do jeito que está, ainda cumpre a promessa principal (apaga
`noreply@anthropic.com` de verdade, que é o caso 96-de-96 do histórico real) — os dois
achados são sobre os EXTREMOS da capa, não sobre o caso comum.

## As decisões e os pontos pedidos, um a um

**Ponto 2 (a nota nova da decisão 4):** confirmada. `grid.astro:8575` tem exatamente o
comentário citado ("A 'PEÇA SELECIONADA' É `daVez()`"), e não achei nenhuma variável ou
estado de seleção por clique em `grid.astro` (busquei por "selecionada"/"SELECAO", zero
resultado). A nota do Arquiteto está certa: metade da decisão 4 ("a peça clicada") de fato
não existe no código, e ele mesmo já registrou isso no documento em vez de deixar a régua
prometendo mais do que a mesa entrega.

**Ponto 4 (`prepararReconhecedor` com gramática `undefined`, só nos três campos):**
confirmado. Só há UMA chamada a `prepararReconhecedor` em todo `src/` (`grid.astro:8963`),
e o argumento é `ditado ? undefined : gramaticaDeVoz(campos)` — `ditado` só vem de
`elementoDeDitadoLivre()`, que só devolve não-nulo para os três ids fixos
(`CAMPOS_DITADO_LIVRE = ['ou-oque', 'al-motivo', 'ag-busca']`). Em `comando-voz.ts:167`, o
`undefined` vira uma chamada a `KaldiRecognizer` SEM o segundo argumento (não um `undefined`
explícito passado à API) — cuidado correto. Não existe caminho para o reconhecedor solto
fora dos três campos da decisão 7.

**Ponto 5 (`camposAtivos()` por visibilidade real):** confirmado. `campoVisivel` lê
`e.style.display !== 'none'`; `abrirOutra` (código de antes desta rodada,
`grid.astro:9057`) escreve `quando.style.display = TEMPO.sistema === 'pgr' ? '' : 'none'`
no MESMO elemento. É a mesma propriedade, lida e escrita nos dois lados — não pode divergir
por desenho, e não é lista escrita à mão (a decisão 13 proíbe exatamente isso).

**Ponto 3 (o modo segue o foco): achado real, e concordo que é `CORRIGE`.** Fui atrás do
estado visual/textual que diferenciaria os dois modos enquanto a tecla está segurada, e não
achei nenhum: `vozStatus('ouvindo…')` (`grid.astro:8972`) é a MESMA string nos dois ramos —
comando e ditado livre não têm nenhuma pista diferente na tela. O estado que o Arquiteto
descreveu como gatilho de `CORRIGE` ("o mestre fala achando que está numa gramática e está
na outra") é inteiramente alcançável: basta o foco estar, sem o mestre perceber, num dos
três campos de ditado (por exemplo, depois de tabular pelos campos da caixa "outra coisa" e
parar em `ou-oque`) — segurar V ali entra em ditado livre silenciosamente, sem nenhum aviso
diferente de "ouvindo…". `CORRIGE`: o mínimo é o `vozStatus` dizer qual modo está ativo
("ouvindo (ditado livre)…" vs. "ouvindo…"), para o mestre ter como perceber pela tela antes
de falar.

**Ponto 6 (nada afirma que a fala foi testada):** confirmado limpo, de novo. Os dois hooks
de teste novos (`__MODO_DITADO`, `__RECEBER_DITADO`) dizem no próprio comentário "sem passar
por áudio"; a seção "O QUE FICOU EM ABERTO" do aviso repete, com todas as letras, que o
microfone não foi testado, por desenho.

## O resto, conferido

`cenaVozDitadoEOutra` rodou e passou dentro do `npm run smoke`/`test-grid.mjs` completo
(confirmado no arquivo de saída, ver acima) — não fiquei só com os 16 números que o aviso
publica. `npm run validate`: rodei eu mesma, exit 0.

## BLOQUEIA

Nada.

## CORRIGE

- **O gancho `commit-msg` (`bf66f24`)**: os dois achados acima (casar por endereço em vez de
  nome; `-i` no lugar de enumerar capitalização), endereçado ao Arquiteto, que já assumiu.
- **`vozStatus` não distingue modo comando de modo ditado livre** enquanto a tecla está
  segurada — o mestre não tem como perceber pela tela que entrou em ditado sem gramática.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo (a coautoria proibida, escalada na rodada 34, já virou o gancho desta rodada —
resolvida, não repito).

## VEREDITO

SEGUE
