# Rodada 29 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  efd823887ccb30eb0d1e8894444cf8e27de0b4e2
SHA   7738561cae00326840d55d09ad1028f315f6ab28
TOPO  7738561cae00326840d55d09ad1028f315f6ab28
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
| `Pendencias.md` | Arquiteto: fecha L50 com o veredito SEGUE da Revisora (fora desta rodada) |
| `scripts/rodada.mjs` | **o item desta rodada**: TOPO por ancestralidade em vez de diferença (`calcularTopo`), e SHA/TOPO relidos e reescritos no `--enviar`, não congelados na abertura |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `origin/main` era ancestral do HEAD local no momento deste aviso, não o contrário | a condição de vida real do bug (origin parado) — conferida com `git merge-base --is-ancestor origin/main HEAD` antes de escrever o conserto | rodado nesta sessão, resultado no console: "origin/main eh ancestral do HEAD" |
| TOPO = SHA nesta abertura, sem aviso falso de "origin à frente" | prova de que o cálculo novo não repete o defeito no caso real de agora | `scripts/rodada.mjs` (o `calcularTopo` novo), saída do `npm run rodada` desta sessão, linha "BASE ... SHA ... TOPO ..." (os dois últimos iguais) |
| SHA do aviso reescrito de `3d400d3...` para `7738561...` no `--enviar`, depois de eu emendar o commit de propósito entre abrir e enviar | a falsificação do item 2 do L61 (emenda no meio do caminho) — reproduz o incidente real da rodada 28 sob controle | `git commit --amend` rodado nesta sessão entre o `npm run rodada` e o `-- --enviar`; o aviso "⚑ SHA/TOPO reescritos" apareceu no console do `--enviar` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D29a | escolhi reescrever SÓ as linhas `SHA`/`TOPO` no `--enviar` (por regex ancorado no rótulo, não no valor antigo), e deixar `BASE` como foi escrito na abertura, em vez de reler tudo. `BASE` é o HEAD do worktree da Revisora, e esse não muda pelo mesmo motivo que SHA/TOPO mudam (emenda do commit local) — não tem o mesmo risco, e reler exigiria o worktree existir de novo no momento do `--enviar` | custo: se o worktree da Revisora sumir ou mudar ENTRE abrir e enviar (cenário mais raro que emenda de commit), `BASE` ficaria com o valor da abertura mesmo assim. Registrado, não resolvido: não fazia parte do pedido |
| D29b | não recalculei a tabela "O QUE MUDOU" no `--enviar` (ela continua vindo só da abertura) | custo: se `SHA` mudar por emenda, a lista de arquivos do diff `BASE..SHA` teoricamente poderia diferir; na prática uma emenda de MENSAGEM não move árvore nenhuma, então o diff é o mesmo — mas se algum dia alguém emendar TROCANDO conteúdo (não só mensagem) entre abrir e enviar, a tabela ficaria desatualizada. Fora do escopo pedido (o L61 item 3, achado à parte, já registra isso como "menor, não corrigido") |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- Os outros dois achados do L61 (item 1, citação de linha errada em `27-executora.md`; item 3,
  tabela "O QUE MUDOU" dois arquivos curta) continuam sem corrigir — não fazem parte deste
  item, e o Arquiteto já registrou os dois como "menor, não corrigido" no próprio L61.
- A separação sentinela/magnitude (`teto6`) não foi tocada, como combinado.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L61, item 2, o texto completo do defeito e as duas ocorrências
- `scripts/rodada.mjs` · a função `calcularTopo` nova, e o bloco `SHA E TOPO RELIDOS AGORA` dentro do `--enviar`
