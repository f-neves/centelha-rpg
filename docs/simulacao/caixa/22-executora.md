# Rodada 22 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  bdc96802525786a4e012b670c73c045edaa49c10
SHA   cd59792cf6f2a8d87df8adeaacaa4f112056559d
TOPO  8a2fd4641eeca834c7a431c8cae8ec226cf3c6eb
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

**Este aviso cobre DUAS rodadas minhas, não uma.** A Revisora ainda não foi
reancorada além de `bdc9680` (meu aviso da rodada 19, L39), então este `BASE`
é o mesmo da rodada 21 (`docs/simulacao/caixa/21-executora.md`, já commitada
mas ainda não revisada) mais o fechamento de `gen-cap-pericias.mjs` que só
ficou liberado depois, pela decisão do usuário sobre a palavra "manobra"/
"firula". Em vez de dois avisos picados para o mesmo L31, fechei tudo aqui: a
tabela abaixo cobre o diff inteiro `bdc9680..cd59792`. `docs/simulacao/
CONTRATO-REVISORA.md` e `scripts/duo.mjs` aparecem no range mas não são
trabalho meu (commit `7e56946` do TechLead, entre `BASE` e o início da minha
frente, mesma explicação que já dei na rodada 19 e 21 para esses dois
arquivos).

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | fecha L31 nomeando o resultado de cada um dos sete geradores; registra L50 (achado colateral do `gen-arte-equip.mjs`, sem conserto por instrução do TechLead) |
| `package.json` | `gen-elementos.mjs --check`, `gen-deslocamento.mjs --check` e `gen-cap-pericias.mjs --check` entram na linha `validate` |
| `scripts/gen-cap-pericias.mjs` | ganha o bloco `--check` (compara os dois capítulos gerados, cada um com seu marcador, contra o commitado); rodado de verdade uma vez, restaurando "manobra" na frase da Política em `habilidades.md` (decisão do usuário) |
| `scripts/gen-deslocamento.mjs` | ganha o bloco `--check`, contra `deslocamento-bestiario.json` commitado |
| `scripts/gen-elementos.mjs` | o mesmo bloco `--check`, contra `elementos-bestiario.json` |
| `scripts/test-portoes.mjs` | `GERADORES_FORA` perde as três entradas que ganharam `--check`; as cinco restantes (`gen-monsters`, `gen-arte-equip`, `gen-lista-equip`, `gen-creditos-equip`, `gen-prompts-folhas`) ficam com o motivo real |
| `src/content/chapters/habilidades.md` | a descrição de "Política" volta a dizer "manobra" em vez de "firula" (regenerado por `gen-cap-pericias.mjs`, não editado à mão); é a ÚNICA mudança no arquivo, conferida linha a linha antes de commitar |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 9 de 14 geradores com `--check`, 5 declarados em `GERADORES_FORA` | fechamento do L31 | `node scripts/test-portoes.mjs`, seção "todo gerador se confere", rodado no commit avisado |
| 24 primárias, 66 secundárias | saída de `gen-cap-pericias.mjs --check`, idêntica ao commitado | `node scripts/gen-cap-pericias.mjs --check`, rodado no commit avisado |
| 100 criaturas com fraqueza/resistência, 309 com deslocamento | saída de `gen-elementos.mjs --check`/`gen-deslocamento.mjs --check` | mesmos comandos, rodados no commit avisado |
| 1 linha mudou em `habilidades.md` (firula vira manobra) | o único efeito de rodar `gen-cap-pericias.mjs` de verdade | `git diff 0f1769d..cd59792 -- src/content/chapters/habilidades.md`, conferido antes de commitar |
| `npm run validate`: exit 0 | suíte inteira | rodado no commit avisado |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D22a | fechei os dois avisos (rodada 21 e este) sem esperar a Revisora reancorar entre um e outro, já que ela não tinha mexido do `bdc9680` e o TechLead liberou o achado 1 rápido. Um aviso só cobrindo o range inteiro, em vez de dois avisos picados para o mesmo L31 | a tabela "O QUE MUDOU" cobre commits de duas rodadas minhas junto; expliquei isso no topo do COMMIT para não parecer que o range cresceu sem aviso |
| D22b | não regenerei `gen-cap-pericias.mjs` uma terceira vez "só para garantir": a segunda rodada (logo após restaurar a versão certa) já provou idempotência, e rodar de novo sem mudar a fonte não teria acrescentado nada além de reconfirmar o que o `--check` já confere sozinho agora | nenhum |

## O QUE FICOU EM ABERTO

- **Nada do L31 ficou pendente.** Os sete geradores da pendência original têm
  resultado nomeado: três ganharam `--check` de verdade (`gen-elementos`,
  `gen-deslocamento`, `gen-cap-pericias`), quatro ficam corretamente fora
  (`gen-arte-equip`, `gen-lista-equip`, `gen-creditos-equip`,
  `gen-prompts-folhas`, entrada ou saída fora do git).
- **L50 (achado colateral, `gen-arte-equip.mjs` degrada em silêncio) fica sem
  correção**, por instrução explícita do TechLead.

## ONDE LER

- `Pendencias.md`, L31 (fechado, com o resultado de cada um dos sete) e L50
- `scripts/gen-cap-pericias.mjs` · o bloco `--check` novo, dois alvos com
  marcador próprio cada
- `docs/simulacao/caixa/21-executora.md` · a primeira metade desta mesma
  frente (gen-elementos/gen-deslocamento e os quatro achados originais)
