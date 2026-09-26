# Rodada 111 · despacho · F2 estendida (preço com unidade em todo lugar) e F4 (lore/economia/ versionada)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, respondendo às duas pendências da rodada 110 (a PERGUNTA da
Revisora sobre o alcance da F2, e a F4 sobre onde mora a procedência). **Não feche nenhuma
pendência de economia como resolvida nesta rodada além das que este despacho cobre**: o Revisor
do autor está fazendo a conferência final da economia contra a lista da Rodada D2, em paralelo, e
o veredito dele chega depois.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## 1 · F2 estendida: preço sempre como objeto, com a unidade ao lado

**A resposta do autor:** sim, `{"preco": {"pc": N}, "por": "..."}` também em tarifas, serviços,
aulas e viagens (e renda, que também tem número solto de valor monetário, mesmo não sendo preço de
compra). O `"por"` é campo próprio, valores do vocabulário: **dia, hora, jornada, semana, km, 10
km, trajeto, vez, página, unidade** (adicione ao vocabulário só se um caso não couber em nenhum
desses, e diga qual no relato).

**Os arquivos e campos com número solto hoje**, achados pela Revisora na 110 e pela varredura
desta rodada:

- **`servicos.json`**
  - `servicos[].pc` (a maioria) e `servicos[].pc_calculado` (o valor antes de arredondar ao
    catálogo): viram `preco: {pc}` (o de catálogo) com um campo irmão para o calculado, se você
    decidir manter os dois (proponha a forma, registre no relato). `unidade` hoje é texto livre
    ("dia (avulso)", "dia"): separe em `por: "dia"` mais um booleano ou campo `regime: "avulso" |
    "contrato"` para o que não é só a unidade de tempo. **Um caso é texto puro** ("professor" com
    `pc` = a string "ver aulas", se for esse o caso: confirme lendo o arquivo): não vira
    `{pc: "ver aulas"}` (isso quebra o "preço sempre número"). Vira `preco: null` (ou o campo some)
    mais um campo `ver: "aulas"` apontando para onde o preço de verdade está.
  - `tarifas_por_perfil[]` tem seis preços por linha (`semana`, `contrato`, `avulsa`, `hora_leve`,
    `hora_artesao`, `hora_bracal`): vire um array por perfil, `tarifas: [{por: "semana", preco:
    {pc}}, {por: "contrato", preco: {pc}}, ...]`, uma entrada por unidade de hoje.
  - `aulas[].preco` (o valor exato) e `aulas[].pc` (arredondado ao catálogo): mesma forma do
    `servicos[].pc`/`pc_calculado`, um par preco/calculado dentro do objeto, ou dois objetos —
    decida e registre.
  - `escravos[].pc` e `escravos[].pc_catalogo_atual`: mesmo padrão.
  - `escravo_sustento_semana`: número solto, vira `{pc}` com `por: "semana"`.
  - `criados[].salario_semana` e `.custo_total_semana`: os dois têm `por: "semana"` já no nome;
    mesma forma.
- **`viagens.json`**: `velocidades_km_dia[].km_dia` não é preço (é distância, fica como está); os
  preços de passagem (`precos[].pc` ou nome equivalente, confira a chave exata no arquivo) levam
  `por` conforme a unidade real (km, 10 km, trajeto, o que o dado usar).
- **`custo-de-vida.json`**: `niveis_pessoa[].pc_semana` e `.estalagem_semana`: viram `preco: {pc},
  por: "semana"` cada.
- **`renda.json`**: `faixas[].renda_semana/mes/ano`, `.livre_semana/mes/ano`,
  `.custo_semana` (confirme se mês/ano existem para custo também): a mesma tripla vira um array
  `[{por: "semana", preco: {pc}}, {por: "mes", preco: {pc}}, {por: "ano", preco: {pc}}]` por
  grandeza (renda, livre, custo). **É valor de renda, não preço de compra**; use o mesmo nome de
  campo `preco` mesmo assim, para não inventar um segundo vocabulário — se achar que merece nome
  próprio (`valor`, por exemplo), registre a escolha no relato em vez de decidir calado.

**O que muda em cada camada:**

1. **`scripts/validate-data.mjs`**: os esquemas `.strict()` da economia mudam para aceitar a nova
   forma. Mantenha o controle negativo de antes (número solto onde devia ser objeto falha).
2. **`../tmp/executora/copiar-economia.mjs`** (o script da F5 que copia e transforma a v2):
   acrescente as transformações desta rodada (a `_procedencia`/envelope da 110 continuam). O
   `--check` continua exigindo que reaplicar o script a partir da v2 dê o mesmo `src/data`.
3. **`scripts/gen-cap-economia.mjs`**: os 12 blocos que leem essas estruturas passam a ler
   `preco.pc` e `por`, não o número solto. Onde havia várias colunas de unidade na mesma linha da
   tabela (tarifas, aulas), a tabela do capítulo continua com várias colunas; só a fonte que ela lê
   muda de forma.
4. **`_nota`** de cada arquivo tocado: sem mudança de conteúdo, só confira que ainda descreve a
   fórmula certa depois da forma nova.

**Prova:** `npm run validate` verde, `npm run build` verde, e o `dist/` do capítulo de custo com os
mesmos números de antes (a rodada 110 já tem a prova de referência no relato dela; compare
valor por valor numa amostra, não só que a tabela existe).

## 2 · F4: `lore/economia/` passa a ser versionada

**O que entra no git**, pela decisão do autor:

- `lore/economia/etapas-abc/base.py`, `mercadorias.py`, `modelo.py`, `gerar.py` (o modelo v1);
- `lore/economia/v2/base.py`, `mercadorias.py`, `modelo.py`, `gerar.py` (o modelo v2);
- `lore/economia/etapas-abc/revisao-economica-etapas-abc.md` (documento v1);
- `lore/economia/v2/revisao-economica-v2.md` (documento v2);
- `lore/economia/estado-revisao.md`;
- os arquivos de procedência: `lore/economia/etapas-abc/mercadorias.procedencia.json`,
  `lore/economia/v2/mercadorias.procedencia.json`, e os dois que a rodada 110 deixou parados em
  `../tmp/executora/procedencia/` (`mercadorias.procedencia.json` e `montarias.procedencia.json`,
  este a saída da F4 da 110): eles se juntam aqui, em `lore/economia/`. **Isto fecha a G70.**

**O que NÃO entra** (rascunho e zip, pela instrução do autor):

- `lore/economia/etapas-abc/economia-etapas-abc.zip`, `lore/economia/v2/economia-v2.zip`;
- `lore/economia/v2/__pycache__/`, `lore/economia/v2/bash.exe.stackdump`;
- os JSONs de saída em `etapas-abc/` e `v2/` (`mercadorias.json`, `custo-de-vida.json`,
  `montarias-veiculos.json`, `renda.json`, `servicos.json`, `viagens.json`,
  `pacotes-equipamento.json`): são a mesma saída que já mora em `src/data`, versionar as duas
  seria duplicar o gerado; a fonte de verdade do gerado é o modelo + `gerar.py`, não a cópia solta;
- `lore/economia/gerar_mercadorias.py`, `mercadorias.proposta.json`, `proposta-mercadorias.md`,
  `proposta-precos-f1-f3.md`: nomeados "proposta"/versões preliminares, não citados pelo autor.

**Ambíguos, decida e registre a razão** (não pergunte, o despacho já disse "não invente calado":
registre a escolha e o porquê):

- `lore/economia/catalogo-unificado.md`, `anexo-auditoria-f1-f3.md`, `prompt-revisao-economica.md`:
  não são "modelo" nem "os documentos v1 e v2" citados por nome, mas também não são
  claramente rascunho descartável. Sugestão, se quiser um critério: entra se for referenciado por
  algum dos documentos que já entram (o `estado-revisao.md` ou os dois `revisao-economica-*.md`)
  como fonte de um número ou decisão citada; fica de fora se for só material de apoio superado.

**README novo**, `lore/economia/README.md`: registre que os JSONs de `src/data` (mercadorias,
montarias-veiculos, servicos, pacotes-equipamento, renda, custo-de-vida, viagens) são gerados por
`v2/gerar.py` a partir do modelo desta pasta, e não devem ser editados à mão sem atualizar o
modelo e gerar de novo (mesma frase que já está na `_nota` de cada JSON, resumida aqui para quem
abrir a pasta sem ver o site).

**Depois de versionar:** verifique que o `test-portoes.mjs` §7 (nada solto na pasta mãe das
árvores) continua verde, e que nada em `.gitignore` está escondendo por engano os arquivos que
agora deveriam entrar.

## 3 · Fora

Nenhuma pendência de economia fecha nesta rodada além do que as seções 1 e 2 cobrem
explicitamente. O Revisor do autor está conferindo a rodada 110 inteira contra a lista da D2, em
paralelo; se o veredito dele chegar antes de você terminar, ele tem prioridade sobre qualquer
achado que se sobreponha ao seu.

As decisões de J12/J13 (autolink) continuam fora, em rodada separada, esperando o autor.

## 4 · O relato

`111-executora.md`, com as três decisões de forma que ficaram por sua conta (o par
preço/calculado em serviços e aulas, o nome do campo em `renda.json`, os três arquivos ambíguos da
F4) explicadas com o motivo escolhido. `progresso-111.md` desde a primeira etapa.
