# Rodada 27 · resposta da revisora (fase 2.5, L32/L33: a tela da lembrança, reverificação)

Revisora: aviso em `a5b74f7`. BASE `ae007b6f`, SHA `457ca82`, TOPO declarado `f8f72d0`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `a5b74f71f43fc8bba2dcb84b5299ea4a4789833b`. Batem.
- `git diff --stat ae007b6f 457ca82`: 35 arquivos tocados. O inventário da seção "O QUE
  MUDOU" do aviso lista 32 — faltam `docs/simulacao/caixa/26-auditora.md` e
  `docs/simulacao/caixa/26-executora.md` (a caixa da própria rodada 26). Não muda nenhum
  número revisado nesta rodada; registrado em CORRIGE, pela mesma família de defeito do
  próximo item.
- **O campo `TOPO` está errado.** `MODELO-executora.md` define TOPO como "sha do topo do
  main quando este aviso foi escrito" — ou seja, deveria ser ≥ SHA. Conferi:
  `git merge-base --is-ancestor f8f72d0 457ca82` → **é ancestral**, não descendente.
  `f8f72d0` é um commit ANTERIOR ao próprio SHA (`457ca82`) na história linear
  (`ae007b6f..a5b74f7`, ordem cronológica: ...`f8f72d0`→`d1d70e4`→`9e66158`→`457ca82`→
  `a5b74f7`). Isso inverte o que o campo promete: `git log SHA..TOPO` sai vazio, e quem
  confiar só no campo (em vez da prosa de ENTROU, que está certa) concluiria "nada de outra
  frente entrou" quando na verdade os 28 commits de backlog estão todos dentro de
  `BASE..TOPO`, ANTES do SHA, não depois. Não bloqueia esta rodada porque a seção ENTROU já
  lista tudo à mão e corretamente; registro em CORRIGE para quem preenche o cabeçalho não
  repetir.

## O que revisei de verdade: o ensaio dos três sentidos, refeito por mim

Não aceitei o relato de graça — rodei eu mesma, no commit avisado.

**Verde (main como está):** `node scripts/test-grid.mjs` sozinho, exit 0. A cena `a tela da
lembrança` passou as 12 asserções, com os mesmos valores que o aviso cita: classe
`lembranca` presente e nunca `vez`, título com "lembrança"/"não é alvo", mestre sem a
classe, `combate_visao.lembranca === true` e `visto_em` certo, `pv_atual/pv_max` 15/20 (não
3/20), `tick`/`iniciativa` nulos, `token_visao` em `(3,1)`, recusa da mira com aviso.

**Vermelho (falsificação, `${lembranca ? ' lembranca' : ''}` removido à mão em
`grid.astro:4390`):** as três asserções que dependem da classe caíram, palavra por palavra:

```
✘ a peça lembrada chega a ter um `.gr-token` desenhado, do lado do jogador
✘ a classe marca a lembrança, e ela nunca está "na vez" ()
✘ o título diz que é lembrança e que não é alvo, sem precisar do mouse (achado no ato de ler) ("")
```

As de payload (`combate_visao`, `token_visao`, Vida da fotografia) continuaram verdes,
como deveria — não dependem da classe CSS, só da coluna do banco. Depois disso o script
morreu com excepção não tratada (`Cannot read properties of null (reading
'getBoundingClientRect')`, `test-grid.mjs:3541`, a etapa de mira que assume o elemento
existindo) e saiu com 1. **Achado de robustez do harness, fora do escopo do L32/L33:** o
teste crasha em vez de reportar mais um `✘` e seguir; não invalida a prova (as três
asserções relevantes falharam pelo motivo certo antes do crash), mas deixa a cena
incompleta se algo quebrar mais adiante numa falsificação futura. Registro, não bloqueia.

**Verde de novo (linha restaurada):** exit 0, as 12 asserções voltando a passar, valores
idênticos aos do primeiro verde. `git status` limpo nos três momentos em que confirmei
(antes, durante — só o esperado `M grid.astro` — e depois).

## O mecanismo, contra o código, não só contra o relato

- `naFila` exclui a peça lembrada: `TOKENS[c.id] && !c.lembranca` (`grid.astro:4447`) — bate.
- `resolverAtaque` é o ponto único que recusa a lembrança como alvo, e cobre os dois
  caminhos (mira e arrasto): `if (alvo?.lembranca) { uiErro(...); return; }`
  (`grid.astro:7902-7907`) — bate com "não declara golpe, não move até ela, não mira nela".
- As três regras de visual do caso D (`Pendencias.md:1992-1998`) contra o CSS
  (`grid.astro:1666-1676`): grayscale + contorno pontilhado + nome itálico + selo `◌` no
  canto (não é só opacidade, bate com a regra 1); Vida da fotografia confirmada pelo teste
  (regra 2); recusa de alvo confirmada pelo teste e pelo código (regra 3). As três passam
  o critério de alcançabilidade (§4.2 do contrato): função real, chamada pelo caminho real
  de produção, não só exercitada direto por um teste que pula a UI.

## As linhas erradas que a Executora me pediu para julgar

**A citação de linha em "O QUE ESTE RELATÓRIO AFIRMA" está errada, não só desatualizada.**
O aviso cita `scripts/test-grid.mjs:533-545` (ensaio três sentidos) e `:542` (a asserção
`(3,1)`). A função `cenaLembranca` de verdade está em `test-grid.mjs:3481-3545`, e a
asserção `(3,1)` em `:3524`. As linhas 533-545 reais pertencem a outro teste (`golpes no
mesmo instante`, iniciativa), sem relação com a lembrança. `grid.astro:4390` está certo.
Isto é procedência ERRADA, não ausente — pior do ponto de vista do §"número sem
procedência não entra", porque quem for confirmar sem rodar o teste (só lendo o arquivo
citado) cai em código errado e pode concluir, por engano, que o número não tem onde
aterrissar. A afirmação em si é verdadeira (confirmei rodando); a citação, não.
**CORRIGE.**

## A asserção `(3,1)` fraca, que a Executora deixou para eu julgar

Confirmei a leitura dela: `c-lembr` é empurrado para `COMBS` DEPOIS que `POSTOS` já fixou o
teto do laço que gera `TOKENS` (`mesa-mock.mjs:156` e `:391`, `Math.min(POSTOS,
COMBS.length)` com `POSTOS` calculado ANTES do `push` da lembrança) — então ela nunca entra
em `arena_tokens`, e a asserção só prova ausência de posição viva + presença da posição
congelada, não o contraste "sai de X, aparece em Y≠X" que o nome do teste sugere. A leitura
da Executora está certa.

**Julgamento: registro para rodada própria, não BLOQUEIA nem CORRIGE agora.** Três motivos:
(1) a migração 33 não rodou — a peça inteira é inerte em produção hoje, não há jogador
exposto a um `token_visao` que possa estar errado; (2) reforçar exigiria uma segunda
criatura no mock com token vivo numa casa diferente de `vistos`, que é escopo de bancada
novo, não desta reverificação; (3) nada no código sob teste mudou nesta rodada — é uma
lacuna de cobertura que já existia desde `5af06f8` (07/09), não algo que este lote
introduziu. Sugestão de registro: `Pendencias.md`, junto de L32/L33, uma linha dizendo que
o par completo de posições (viva ≠ lembrada) só será provado quando/se o mock ganhar essa
segunda criatura — decisão do Arquiteto se vale abrir agora ou esperar a migração rodar.

## O resto do escopo (`d1d70e4`, `9e66158`)

`d1d70e4` (L34/L39): conferido texto contra código nas rodadas anteriores (17/18), aqui é
só correção de documento alcançando o que já era verdade; nada de código para reverificar.
`9e66158` (regra de orçamento, `ARQUITETO.md §0`): é regra de processo entre Arquiteto e
humano, sem código; texto lido, consistente com a mensagem do commit (pergunta no início da
sessão, três respostas possíveis, avisos em 90%/95% mesmo com "sem limite").

## BLOQUEIA

Nada.

## CORRIGE

- A citação de linha de `test-grid.mjs` em "O QUE ESTE RELATÓRIO AFIRMA" (aviso 27): deveria
  ser `:3481-3545` (cena) e `:3524` (asserção `(3,1)`), não `:533-545`/`:542`.
- O campo `TOPO` do cabeçalho COMMIT (aviso 27): `f8f72d0` é ancestral de `SHA`, não o topo
  do main na hora em que o aviso foi escrito — inverte o que `MODELO-executora.md` promete
  para o campo. A prosa de ENTROU já cobre certo; o campo, não.
- O inventário "O QUE MUDOU" (aviso 27) fica dois arquivos curto do diff real
  (`docs/simulacao/caixa/26-auditora.md`, `docs/simulacao/caixa/26-executora.md`).

Nenhum dos três afeta a validade do que foi de fato revisado nesta rodada — são acertos de
procedência para a próxima aviso, não achados que troquem o veredito.

## PERGUNTA

Nenhuma.

## ESCALA

Nada. A única decisão do humano (rodar a migração 33 em produção) já está marcada como tal
em `CONTEXTO.md`/`Pendencias.md` e não precisa de nova aprovação aqui; a asserção fraca
`(3,1)` também não é ESCALA — é julgamento de engenharia que fiz acima (registro para
rodada própria), não algo que só o humano decide.

## VEREDITO

SEGUE
