# Rodada 21 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  bdc96802525786a4e012b670c73c045edaa49c10
SHA   9ab93fd31d9a59545f843baa91196f16cd0df4cc
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

**Nota sobre `docs/simulacao/CONTRATO-REVISORA.md` e `scripts/duo.mjs` não
estarem na tabela abaixo:** o modelo os pré-encheu porque mudam entre `BASE` e
`SHA`, mas não são trabalho meu. `git diff --stat 8a2fd46..9ab93fd` (só os
MEUS três commits, em cima do último que o TechLead empurrou) não os inclui.
Entre a `BASE` (bdc9680, o aviso da minha própria rodada 19) e `8a2fd46`
entraram a revisão do L39 (rodada 20, veredito SEGUE) e um commit do TechLead
corrigindo em `duo.mjs` o mesmo hardcode de worktree que eu já tinha corrigido
em `rodada.mjs` na rodada 19, tudo ANTES de eu começar esta frente, sem
nenhuma concorrência durante a minha janela de edição.

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | fecha L31 com o resultado por gerador (dois com `--check`, quatro em `GERADORES_FORA` com o motivo real, um virou `[DECIDIR]` à parte); registra L50 (achado colateral do `gen-arte-equip.mjs`) |
| `package.json` | `gen-elementos.mjs --check` e `gen-deslocamento.mjs --check` entram na linha `validate` |
| `scripts/gen-deslocamento.mjs` | ganha o bloco `--check` (padrão `gen-bestiario.mjs`), comparando a saída computada com `deslocamento-bestiario.json` commitado |
| `scripts/gen-elementos.mjs` | o mesmo bloco `--check`, contra `elementos-bestiario.json` |
| `scripts/test-portoes.mjs` | `GERADORES_FORA` perde as entradas de `gen-elementos.mjs`/`gen-deslocamento.mjs`; as cinco restantes (`gen-cap-pericias`, `gen-arte-equip`, `gen-lista-equip`, `gen-creditos-equip`, `gen-prompts-folhas`) ganham o motivo real, achado nesta rodada, no lugar do texto anterior |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 2 de 7 geradores fechados com `--check` (`gen-elementos`, `gen-deslocamento`) | contagem do L31 | `node scripts/test-portoes.mjs`, seção "todo gerador se confere": "8 de 14 geradores com `--check` no build; 6 declarados" (rodado no commit avisado) |
| 100 criaturas com fraqueza ou resistência, 309 com deslocamento | as saídas dos dois geradores fechados, idênticas ao commitado | `node scripts/gen-elementos.mjs --check` e `node scripts/gen-deslocamento.mjs --check`, ambos rodados no commit avisado, saída "em dia com a fonte" |
| `habilidades.json:809` diz "manobra", `habilidades.md` (capítulo) diz "firula" | a divergência do `gen-cap-pericias.mjs`, achado 1 | conferido lendo os dois arquivos; rastreado aos commits `3a7c7e9` (17/08) e `ac71ade` (18/08) via `git log --format='%h %ad %s' --date=short -- src/content/chapters/habilidades.md` |
| `D&D/armas&armaduras/folhas` e `D&D/armas&armaduras/` sem nenhum arquivo rastreado | a base dos achados 2 e 3 | `git ls-files "D&D/armas&armaduras/folhas"` e `git check-ignore -v "D&D/armas&armaduras/lista-itens.md"`, ambos rodados no commit avisado |
| `npm run validate`: exit 0 | suíte inteira | rodado no commit avisado |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D21a | segui o TechLead à risca em "para cada um dos sete, rode e compare ANTES de adicionar `--check`". Achei uma divergência de conteúdo real em `gen-cap-pericias.mjs` (habilidades.json ainda diz "manobra", o capítulo já diz "firula") e restaurei o arquivo na hora, sem regenerar por cima. Escalei; o TechLead concordou com o achado mas discorda da minha leitura de qual lado está errado (eu lia o JSON como o defasado, ele aponta que o find-replace de `ac71ade` pode ter varrido essa ocorrência genérica por engano, e é o capítulo que pode estar errado) | nenhum dos dois lados foi tocado; virou item `[DECIDIR]` de escolha de palavra em prosa publicada, que o TechLead leva ao usuário fora desta rodada |
| D21b | achei que `gen-arte-equip.mjs`, apesar de bater limpo localmente, não pode ganhar `--check` no `validate`: a pasta de origem (`D&D/armas&armaduras/folhas`) está inteira fora do git, então o CI nunca teria o que o gerador precisa para reproduzir a saída commitada. Escalei em vez de simplesmente pular a etapa. O TechLead confirmou e aprovou deixar como `GERADORES_FORA` | nenhum código mudou aqui além do motivo escrito; o achado colateral (degradação silenciosa quando a pasta falta) virou L50, registrado à parte |
| D21c | os três geradores que escrevem dentro de `D&D/armas&armaduras/` (`gen-lista-equip`, `gen-creditos-equip`, `gen-prompts-folhas`) saem do escopo prático de "sete geradores com `--check`" para "quatro geradores onde `--check` faz sentido, mais três na mesma família do `gen-monsters.mjs`". Não decidi isso sozinha: propus a reclassificação com os motivos reais e o TechLead aprovou antes de eu fechar `GERADORES_FORA` | a pendência L31, fechada, registra os sete por nome com o resultado de cada um, em vez de "sete geradores, dois viraram `--check`" |
| D21d | registrei o achado colateral do `gen-arte-equip.mjs` (degrada em silêncio, pode sobrescrever `arte-equip.css` commitado com saída quase vazia num clone sem `D&D/`) como L50 em vez de tentar consertar nesta rodada, por instrução explícita do TechLead ("não é para consertar nesta rodada") | fica sem correção até alguém pegar o L50; o risco real é baixo hoje porque `npm run build` normalmente roda na máquina de quem tem a pasta `D&D/`, mas existe |

## O QUE FICOU EM ABERTO

- **`gen-cap-pericias.mjs` continua sem `--check`, com uma divergência real e
  não corrigida entre `habilidades.json:809` e o capítulo publicado.** Isto
  precisa do HUMANO: é escolha de palavra em prosa publicada (qual das duas
  leituras da história do termo "Manobra"/"Firula" está certa), não decisão
  de engenharia nem de regra de mesa. O TechLead está levando ao usuário fora
  desta rodada.
- **`gen-arte-equip.mjs`, `gen-lista-equip.mjs`, `gen-creditos-equip.mjs` e
  `gen-prompts-folhas.mjs` continuam sem `--check`, e continuam SEM poder
  ganhar um**, porque a fonte ou o alvo deles está fora do git. Isto não é
  bloqueio: é a natureza do que eles fazem, documentada em `GERADORES_FORA`.
- **L50 (achado colateral, `gen-arte-equip.mjs` degrada em silêncio) fica sem
  correção**, por instrução explícita do TechLead nesta rodada.

## ONDE LER

- `Pendencias.md`, L31 (a seção inteira, fechada, com o resultado nomeado de
  cada um dos sete) e L50 (o achado novo)
- `scripts/test-portoes.mjs`, `GERADORES_FORA` · os motivos reais dos cinco
  que não têm `--check`
- `scripts/gen-elementos.mjs` e `scripts/gen-deslocamento.mjs` · os dois
  blocos `--check` novos, mesmo padrão do `gen-bestiario.mjs:598`-`620`
