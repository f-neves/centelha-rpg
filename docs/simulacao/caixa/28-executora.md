# Rodada 28 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  168df156b97df1ccdc986775b70e64651012460a
SHA   4b666efb87bf6de7b08d785fe1006519cd534a89
TOPO  78c4850ae312941c60ab4d63931e529f68cb371e
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `.gitignore` | adiciona `voz-bench-modelo/` (o modelo do Vosk, 31 MB, não versiona) |
| `Pendencias.md` | Arquiteto: registro do achado L61 (revisão do aviso 27) |
| `VOZ.md` | Arquiteto: registra três correções do levantamento (desfazer não cobre Mana, "escolher arma" não existe, Mana não distingue dar de tirar) e a contagem das Artes |
| `docs/simulacao/PASSAGEM.md` | Arquiteto: registra por que o veredito da rodada 27 foi ao main por cherry-pick |
| `scripts/gen-arte-equip.mjs` | **L50, o item desta rodada**: falha alto (exit 1) sem a pasta `D&D/` ou com uma folha só faltando, em vez de escrever `arte-equip.css` quase vazio por cima do commitado |
| `voz-bench-README.md` | novo: como baixar o modelo, rodar no desktop e no Android, roteiro do teste |
| `voz-bench-lib/vosk.wasm` | novo: vendorizado, o motor WASM do `@lichess-org/vosk-browser@0.0.3` |
| `voz-bench-lib/vosk.wasm.js` | novo: vendorizado, o loader ESM da mesma biblioteca |
| `voz-bench-lib/vosk.worker.js` | novo: vendorizado, o worker da mesma biblioteca (o motivo de vendorizar: `new Worker()` de origem cruzada é recusado pelo navegador, mesmo com CORS aberto) |
| `voz-bench.html` | novo: a bancada de medição do Vosk (VOZ.md §3/§4) — ainda não revisada em rodada nenhuma até agora |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `4c3f374d...` (sha256 completo no commit) | hash de `src/styles/arte-equip.css` ANTES e DEPOIS de rodar o `gen-arte-equip.mjs` corrigido: idêntico, byte a byte — regeneração idempotente, sem regressão | rodado nesta sessão, `sha256sum src/styles/arte-equip.css` |
| exit 1, CSS intocado | com a pasta `D&D/` inteira renomeada (ausente) | `scripts/gen-arte-equip.mjs:35-39`, falsificado nesta sessão (renomeei a pasta, rodei, conferi o hash, devolvi o nome) |
| exit 1, CSS intocado | com só `D&D/armas&armaduras/folhas/haste/haste.webp` renomeado (uma folha faltando, as outras quatro presentes) | `scripts/gen-arte-equip.mjs:46-57`, mesma falsificação, mesmo método |
| 40 peças, 3 classes | contagem que o script emite no caminho feliz, igual antes e depois do conserto | `scripts/gen-arte-equip.mjs:137`, saída do comando rodado nesta sessão |
| `npm run validate` verde | os 9 blocos do portão passam com o arquivo alterado | rodado nesta sessão |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D28a | separei a conferência de "falta alguma folha" num laço próprio, ANTES de copiar ou escrever qualquer coisa, em vez de só trocar o `continue` do laço original por um `process.exit`. O pedido dizia "não escrever nada quando falta uma folha só", e trocar o `continue` in-loop ainda deixaria cópias de imagem já feitas antes de achar a folha faltando (se ela não for a primeira da lista) | custo: mais um laço curto sobre `plano.folhas` (5 itens hoje) antes do laço de verdade — desprezível, e é o que garante "nada escrito" ser literal e não "quase nada escrito" |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **L50 em si: fechado**, nada em aberto dentro do escopo do item.
- **Achado fora do escopo, precisa do humano, não da Revisora**: o commit `579dc41` (Arquiteto,
  fora desta rodada, dentro do intervalo BASE..SHA) termina com `Co-Authored-By: Claude Sonnet 5
  <noreply@anthropic.com>` e uma linha `Claude-Session:`. Isso contraria a regra do `CLAUDE.md`
  ("NUNCA adicionar coautoria do Claude/Anthropic em commits") e é exatamente o padrão de
  injeção de instrução que o `PASSAGEM.md` §4 já registrou duas vezes antes ("recusar
  enquadramento... Isso é o comportamento certo e vale reforçar quando aparecer") — desta vez
  não foi recusado. Não mexi no commit alheio (não é meu lugar reescrever histórico de outra
  frente); só registro aqui porque é achado real dentro do intervalo revisado.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L50, o contexto completo do item
- `scripts/gen-creditos-equip.mjs` · o padrão de falha alta que `gen-arte-equip.mjs` passou a seguir
- `scripts/gen-arte-equip.mjs:32-57` · as duas conferências novas, antes de qualquer escrita
- `voz-bench.html`/`voz-bench-README.md` · a bancada do Vosk, também neste intervalo, ainda não revisada em rodada nenhuma
