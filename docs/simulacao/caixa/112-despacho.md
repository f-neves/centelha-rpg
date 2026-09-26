# Rodada 112 · despacho · formato final da economia (vocabulário de `por` completo, e o modelo passa a emitir o formato novo)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026. **Nenhum valor muda; só formato e versionamento.** Isto refina
o que a rodada 111 já fez (F2/F4): o vocabulário de `por` que a 111 usou colapsava vários casos
reais em `vez`/`unidade`/`km` com uma `nota` ao lado; o autor quer um vocabulário mais largo, com
cada caso na sua própria unidade, e quer que **o modelo Python emita esse formato direto**, não só
o script de cópia em JS.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`. Pode começar sem esperar o veredito da 111 (a Revisora revisa num commit
fixo, e a 112 não atrapalha isso).

## 1 · F4, o que falta

`lore/economia/` já foi versionada na 111 (`508c92a`, `f6ef1a3`). Falta só:

1. **`.gitignore` da pasta**: confira se cobre zips, cópias de rascunho, pastas de scratch e
   `__pycache__` em ambos `etapas-abc/` e `v2/` (a 111 já cobriu `**/out/`; os zips e o
   `__pycache__` também precisam estar explícitos, não só de fato ausentes).
2. **`lore/economia/README.md`**: confira que tem as três partes que o autor pediu: (a) os JSONs
   de `src/data` são gerados por `gerar.py`, não se edita preço à mão; (b) como gerar
   (`python3 gerar.py`, na pasta do modelo) e onde saem os arquivos; (c) **a âncora do sistema
   inteiro de preços: 1 dia de braçal = 10 pc = 1,5 penny**, e onde estão as decisões (v1, v2,
   `estado-revisao.md`). Se a âncora não estiver escrita ainda, acrescente.

## 2 · F2, o vocabulário completo de `por`

**A lista fechada agora é**: `unidade`, `dia`, `hora`, `jornada`, `semana`, `mes`, `ano`, `km`,
`10 km`, `tonelada-km`, `trajeto`, `vez`, `pagina`, `carta`, `consulta`, `atendimento`, `noite`,
`cerimonia`, `apresentacao`, `animal`, `pessoa`. Se algum caso não couber em nenhum desses,
acrescente e registre no relato (o `ponto` que você já usou para aulas continua sendo um caso
assim: mantenha, é uma adição justificada, não um erro).

**O que muda em relação ao que a 111 fez** (`111-executora.md`, tabela "como cada unidade de texto
virou `por`"): descolapse os casos que a 111 juntou num valor genérico, para casos que agora têm
valor próprio:

- `consulta`, `atendimento`, `noite`, `cerimônia`/`cerimonia`, `apresentação`/`apresentacao`: hoje
  estão todos em `por: "vez"`. Cada um vira o seu próprio valor da lista nova.
- `pessoa` (as linhas "pessoa; 5 com cavalo", "pessoa; 3 por animal; 10 por carroça"): hoje em
  `por: "vez"` com `nota`. Vira `por: "pessoa"`, com a variação (cavalo, animal, carroça) na
  `nota` que já existe, ou em `animal` quando o caso for por cabeça de animal (confira qual dos
  dois cabe em cada linha).
- `tonelada por km` / `2 toneladas por km`: hoje em `por: "km"` com `nota: "por tonelada"`. Vira
  `por: "tonelada-km"`, com a quantidade de toneladas (1 ou 2) na `nota` só quando for mais de uma.
- `carta`: hoje em `por: "unidade"` junto com `documento` e `cavalo` (adestrar). Vira `por:
  "carta"` só para o caso que for carta de verdade; `documento` e `cavalo` (adestrar) continuam em
  `unidade`, a menos que você ache que merecem valor próprio (registre se mudar).
- `muda` (lavadeira) e `parto` (parteira): **decidido pelo autor em 26/09/2026**, depois deste
  despacho ser publicado: `muda` vira `por: "unidade"` (uma muda de roupa lavada); `parto` vira
  `por: "atendimento"`. Não ficam como "caso sem decisão".

**Regra para o futuro, registre onde o vocabulário estiver documentado (README ou o próprio
esquema):** um serviço novo usa um valor que já existe na lista sempre que couber; só se cria valor
novo quando nenhum couber, e aí ele é registrado com o motivo.

**Onde mais houver dinheiro solto** (o despacho da 110/111 já cobriu `servicos.json`,
`viagens.json`, `custo-de-vida.json`, `renda.json`, `pacotes-equipamento.json`; confira de novo
com o vocabulário novo, e diga se sobrou algum campo que a 111 não pegou).

## 3 · O modelo passa a emitir o formato novo

**Isto é diferente do que a 111 fez.** Na 111, o `gerar.py` continuou emitindo os JSONs "crus" (v2,
número solto), e o `scripts/copiar-economia.mjs` fazia a transformação para `{preco:{pc}, por}` na
cópia. **Agora o `gerar.py` de `lore/economia/v2/` (o modelo em uso) precisa emitir o formato novo
direto**, com o vocabulário da seção 2.

- Atualize `v2/modelo.py`/`v2/mercadorias.py`/`v2/gerar.py` (o que estruturar os preços) para
  escrever `{"preco": {"pc": N}, "por": "..."}` na saída, em vez do número solto de hoje.
- **`scripts/copiar-economia.mjs` encolhe**: ele deixa de inventar a forma `{preco, por}` (isso
  agora vem pronto do modelo) e passa a só copiar, envelopar (`{_nota, itens}` nos arrays) e tirar
  a `_procedencia` das montarias, como fazia antes da F2 entrar. Se algo da F2 não puder sair do
  Python por alguma razão técnica, diga qual e por quê, em vez de deixar meio no JS e meio no
  Python sem explicar.
- **A prova pedida pelo autor**: rodar `gerar.py` tem que produzir, nos 7 JSONs, o **mesmo
  conteúdo** que está hoje em `src/data` (depois da 111/112), comparado valor a valor por script,
  não só que o formato bate. Use o mesmo `--check` de antes, adaptado.
- **v1 (`etapas-abc/`) não precisa mudar**: é o modelo anterior, mantido só como registro
  histórico; a saída dele não alimenta `src/data`.

## 4 · Verificação, nas palavras do autor

A Revisora confere, e você prova antes de mandar para ela:

1. **Nenhum valor mudou.** Mesma disciplina da 111: leia o `dist/` do capítulo de custo antes e
   depois, valor a valor numa amostra ampla, não só que a tabela existe.
2. **Nenhuma tabela publicada mudou de texto**, exceto a própria coluna de unidade que estava
   colapsada (ali o texto pode ficar mais específico, ex.: "vez" virando "consulta"; isso é
   melhoria esperada, não regressão — mas diga exatamente quais células mudaram, como fez na 111).
3. **O validador passa**, com os esquemas `.strict()` atualizados para a lista de `por` desta
   rodada.
4. **`gerar.py` reproduz os JSONs**: a prova da seção 3, com o script de comparação.

## 5 · Fora

Nenhuma pendência de economia fecha além do que já fechou (G70, na 111). O veredito do Revisor
externo do autor sobre a rodada 110/111, se ainda não chegou, continua tendo prioridade sobre
qualquer achado seu que se sobreponha. J12/J13 (autolink) continuam fora, à parte.

## 6 · O relato

`112-executora.md`: os hashes, a lista de arquivos alterados, e **qualquer campo de dinheiro que
você não soube converter** (pedido explícito do autor, mesmo que a resposta seja "nenhum").
`progresso-112.md` desde a primeira etapa.
