# Rodada 111 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia `c47ebcb` (F2), `508c92a`
(F4) e o relato (`f87485f`), e o despacho `e1b318c`. Pino: `f87485f`. Passo 0 pelo §0.1:
`git merge-base --is-ancestor HEAD origin/main` passou, e depois `git switch -C revisora f87485f`.
Toplevel `C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`, branch `revisora`, árvore
limpa antes.

**O conflito que o Arquiteto avisou não me pegou:** esta árvore não tinha `lore/economia/` solta, e o
checkout entrou limpo.

**Depois do pino** entraram o `f6ef1a3` ("adendo" da 111: o `copiar-economia.mjs` versionado) e o
`b95bca6` (despacho da 112). Os dois estão **fora desta revisão**, e o §6 diz o que isso muda.

**Veredito geral: PROCEDE, com um CORRIGE.** Nenhum número mudou, e provei isso por dois caminhos meus
(§1). A F4 confere arquivo por arquivo (§3). As três decisões de forma da Executora são defensáveis,
e eu as aceito (§2).

**O CORRIGE:** o esquema novo aceita `preco: null` em todo valor com unidade, e o gerador publica esse
null como "·" ou "ver undefined", com o `validate-data` verde (§4).

## CI (§11)

Workflow `Validar dados e regras`, lido às 01:27 e acompanhado até o fim:

- `f87485f`, run `36217539664`: `success`. O `c47ebcb` e o `508c92a` não têm run próprio, porque
  subiram junto com ele, e este run os cobre.
- O despacho `e1b318c`: `success`.

## 1 · "Zero número mudou": confere, por dois caminhos

Extraí os 7 JSONs e o capítulo de `e1b318c` para `../tmp/revisora/r111/antes/` e comparei com o pino.

**Caminho 1, o multiconjunto** (`numeros.mjs`). Juntei todo número de cada arquivo, antes e depois:

- são **iguais nos 7**: servicos 212, viagens 25, custo-de-vida 103, renda 114, pacotes 79, montarias
  44 e mercadorias 385;
- os `null` também batem, com uma exceção esperada: o `servicos` tem um `null` a mais, o `preco` do
  professor, que antes era o texto "ver aulas".

**Caminho 2, o lugar certo** (`posicao.mjs`). O multiconjunto não pega um valor trocado de campo, e
esta rodada trocou nomes: nas aulas, o `pc` virou `preco` e o `preco` virou `calculado`. Então casei
por id, nome, perfil e faixa, e conferi cada valor velho no campo novo:

- as seis tarifas de cada perfil, achadas pelo `por` mais o `regime` ou o `oficio`;
- o par preço/calculado dos serviços e das aulas;
- os criados, os escravos e o sustento;
- a renda, o livre e o custo de cada faixa por unidade;
- a curva, o valor por ponto e os tetos;
- os níveis, as cestas, as moradias e o pacote familiar;
- as viagens e os pacotes.

**559 comparações, 0 diferença.**

**O capítulo:** o diff entre `e1b318c` e o pino tem **19 linhas trocadas por 19**. Em nenhuma delas
muda um valor em dinheiro (comparei as quantias pc, pp e po de cada par de linhas). Todas são o rótulo
da unidade: 12 em Serviços e 7 em Viagens.

**O `dist/` do pino** (build verde) tem as mesmas 479 linhas de tabela que medi na 110. Li estas linhas
célula por célula:

- Braçal 6 pp, 2 po 4 pp e 7 pc;
- Nobreza 100 po e 400 po;
- Aristocrata 42 po;
- Destreinado 1 po;
- Frete por mar 1 pc;
- Balsa 2 pc;
- Adestrar cavalo de guerra 80 po;
- o professor com "ver aulas".

## 2 · O mapa de unidades e as três decisões de forma

**O mapa**, listado do dado e não do relato:

| rótulo de antes | vira |
|---|---|
| "dia (avulso)" | `por: dia`, `regime: avulso` |
| "muda", "atendimento", "consulta", "parto", "missa", "cerimônia", "noite", "apresentação" | `vez` |
| "carta", "documento", "cavalo" | `unidade` |
| "tonelada por km" | `km` com `nota` |
| "trajeto curto" | `trajeto` com `nota` |
| "pessoa; ..." | `vez` com `nota` |

**Os três termos novos** (`mes`, `ano` e `ponto`) estão justificados, e nenhum dos dez do despacho
cabia neles. Os `por` usados no dado são exatamente os 13 do `z.enum`.

**Um custo de leitura, para o humano, e não é defeito:** o vocabulário fechado deixa a coluna de
unidade do capítulo menos dita.

- "Adestrar cavalo de guerra | **unidade**" era "| cavalo".
- "Músico, noite de taverna | **vez**" era "| noite".

O nome da linha ainda diz o que é. Se o humano quiser a palavra antiga na tela, ela pode voltar como
`nota` e aparecer do mesmo jeito que já aparece nas viagens.

**As três decisões dela, que aceito:**

1. **`preco` e `calculado` como campos irmãos, com a mesma forma.** Assim, "`preco` é o que o livro
   mostra" vale em todos os arquivos. A troca de nome das aulas corrige um nome que estava ao
   contrário, e o `posicao.mjs` prova que nenhum valor trocou de lugar.
2. **`preco` também na renda.** Um vocabulário só; o nome da grandeza (`renda`, `livre`, `custo`) diz
   o que é. O `custo` só tem `semana`, porque é o que a fonte tem.
3. **Os três ambíguos da F4**, pelo critério do despacho, conferido nos três documentos que entram:
   - o `catalogo-unificado.md` é citado 7 vezes no `estado-revisao.md` (`:17`, `:91`, `:125`, `:302`,
     `:452`, `:497` e `:543`), e entra;
   - o `anexo-auditoria-f1-f3.md` é citado em `:468`, e entra;
   - o `prompt-revisao-economica.md` não é citado em nenhum dos três, e fica de fora.

## 3 · F4: `lore/economia/` versionada

- **Os 15 arquivos que vieram do `rpg-system`** batem com a lista de md5 de origem dela
  (`md5sum -c ../tmp/executora/md5-origem-111.txt`, 15 OK).
- **As duas procedências da raiz:**
  - `mercadorias.procedencia.json` tem o md5 `a2ee208f`, o da 110, e é **byte a byte** a de `v2/`. A
    duplicata é a que o despacho mandou, e ela está declarada;
  - `montarias.procedencia.json` tem o md5 `c7223d4b`, o da 110, e as **44** `_procedencia` são
    iguais às de `rpg-system/lore/economia/v2/montarias-veiculos.json`, uma a uma.
- **O `estado-revisao.md` não mudou depois da cópia:** o `rpg-system` está em `f87485f` e sem
  alteração local em nenhum dos 18 caminhos.
- **O que ficou fora** (zips, `__pycache__`, `bash.exe.stackdump`, os JSONs gerados e as propostas)
  não está no git, e o `git check-ignore` não esconde nenhum arquivo que entrou.
- **O README** diz que existe uma cópia com transformações entre o `gerar.py` e o `src/data`, e diz
  quais são. O `_nota` de `montarias-veiculos.json` aponta para o arquivo de procedência certo.

**ESCALA · travessão importado.** O `508c92a` trouxe **43 travessões**, todos em
`lore/economia/estado-revisao.md`, o documento do autor e do Revisor dele. A cópia é byte a byte de
propósito, e tirar o travessão quebra essa identidade num arquivo que o Revisor do autor pode estar
editando agora. É o humano quem decide: ou esse documento é exceção à regra, ou ele é limpo na fonte.
O portão automático não cobre `lore/`, e o CI está verde.

## 4 · CORRIGE · `preco: null` passa em todo lugar, e o gerador o publica

O esquema novo (`validate-data.mjs:919`) define `valor = { por, ..., preco: preco.nullable() }`, e
todo valor com unidade usa esse `valor()`: renda, livre, custo, cestas, moradias, criados, tarifas e
pacote familiar. O `servicos[].preco` é `nullable` sem amarração com o `ver`. **No dado, só dois
valores são `null` de propósito:** o teto da capital e o professor (que tem `ver: "aulas"`).

**O meu controle negativo** (enxerto e restauro por `git checkout --` no mesmo comando):

| enxerto | `validate-data` | o gerador escreve |
|---|---|---|
| `por: "quinzena"`, preço como texto `{pc: "ver aulas"}`, número no lugar do objeto nas aulas | **falha**, os três | · |
| `preco: null` na renda do Braçal, num serviço comum e numa cesta | **verde** | "Braçal \| **·** \| 2 po 4 pp ..." e "Carregador \| dia (avulso) \| **ver undefined**" |

O `--check` do gerador acusa "fora de sincronia", mas só porque a saída mudou. Quem regerar publica o
buraco, com o portão verde.

**Por que é CORRIGE:** a regra desta rodada é "preço sempre número", e o esquema que a rodada escreveu
deixa passar um não-número em todos os lugares. É o zero ambíguo com o sinal trocado: um "·" plausível
no lugar de um preço que falta. Nenhum dado de hoje chega lá, então a prioridade é baixa; o conserto é
pequeno, e é da rodada.

**O conserto:**

- `valor()` sem o `nullable`;
- `nullable` só onde o dado tem `null` (os tetos, e o `servicos[].preco` com `ver` obrigatório quando é
  `null`, por um `.refine`);
- no gerador, um `null` sem `ver` falha alto em vez de escrever "ver undefined".

## 5 · Travessão, fora do §3

- `c47ebcb` e `f87485f`: **zero** nas linhas acrescentadas.
- `508c92a`: só os 43 do `estado-revisao.md` (§3).

## 6 · O que ficou fora do pino

**O `f6ef1a3`** versiona o `copiar-economia.mjs` em `scripts/`, e mexe no `README`, no `package.json`
e no `.gitignore`. É a resposta ao PRECISA DE MIM 3 dela: sem o script no repositório, a cadeia "modelo
→ `src/data`" não se refazia por quem não tivesse o `tmp` dela. Eu levaria isso como ESCALA, e o
`f6ef1a3` pode ter fechado o assunto, mas **não o revisei**: ele está depois do pino. Se é para eu
revisá-lo, diga, que eu reancoro.

## Limpeza

Todos os enxertos (nos JSONs e no capítulo) foram desfeitos no mesmo comando, e o `validate-data`
voltou verde. O pino foi buildado de novo.

Em `../tmp/revisora/r111/` ficam:

- a base de `e1b318c`;
- `numeros.mjs` e `posicao.mjs`;
- as saídas dos controles negativos: `valA.txt`, `valB.txt`, `genB.txt` e `genC.txt`;
- o log de build.

Não mexi em arquivo versionado além dos meus dois da caixa.
