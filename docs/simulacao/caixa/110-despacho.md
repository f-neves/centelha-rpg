# Rodada 110 · despacho · revisão econômica mundana (preços, custo de vida, renda, serviços)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 25/09/2026

Liberada pelo humano em 25/09/2026, como frente nova (economia mundana), separada da 109
(autolink/glossário). **Começa depois que a 109 fechar** (mesma Executora, uma rodada por vez).
Progresso em `progresso-110.md`, relato em `110-executora.md`. A Revisora fecha.

Fonte de verdade da ordem e do conteúdo: `lore/economia/estado-revisao.md`, seção "LISTA DE
IMPLEMENTAÇÃO — FINAL (Rodada D2, para o Arquiteto)" (`:940-1035`). Este despacho organiza essa
lista em ordem de execução; onde os dois divergirem, o `estado-revisao.md` vence.

## 0 · Onde e duas conferências antes de começar

Mesma árvore/branch da 109. Ao começar: `git status --short` vazio, `git fetch origin`,
`git merge-base --is-ancestor executora origin/main`, `git switch -C executora origin/main`.
Saída temporária em `../tmp/executora/`. "Build limpo" = build + prova no gerado (`CLAUDE.md`).

**0.1 · Fases 1-3, já conferido pelo Arquiteto antes deste despacho**: o formato `preco: { pc: N }`
já está em `armaduras.json`/`armas.json`/`escudos.json`/`municao.json` (Fases 1-3 aplicadas em
`b475ab4`). **Falta só o B8**: `placa-completa` está em `2600 pc`, e pela decisão B8 (aceita,
`estado-revisao.md:922`, +39%) tem de subir para **3.600 pc** (`armaduras.json:203-205`).
Corrija isso junto com o item 11 da lista abaixo.

**0.2 · Antecedente e ficha salva, já conferido pelo Arquiteto**: `ficha-engine.ts` guarda o
Antecedente por `S.ante[a.id]` (Únicos) e por instância `i` em lista (Nomeados), onde `a.id`/o id
salvo é o slug do JSON (`src/data/antecedentes.json:252`, `"reliquia"`). É o mesmo mecanismo do
`RENOMES` de perícia (`ficha-engine.ts:314-325`). **O rename Relíquia → Artefato exige uma entrada
equivalente**: ao carregar uma ficha salva, se existir `S.ante['reliquia']` (ou instância com esse
id) e não existir `S.ante['artefato']`, migre o valor/instância para `'artefato'` e apague a chave
velha, do mesmo jeito que o `RENOMES` de perícia faz. Teste com uma ficha de scratchpad salva com
`reliquia` antes do rename, carregada depois.

## 1 · Esquemas e JSONs novos em `src/data/` (validados antes de qualquer script apontar para eles)

Regras de formato (decisão do autor, valem para todo arquivo novo desta rodada):

- **F1.** Um esquema zod por arquivo, com `.strict()`, no validador (`validate-data.mjs` ou content
  collections, o que já existir para os outros JSONs de `src/data`).
- **F2.** Preço sempre como objeto `"preco": { "pc": N }`. Nunca número solto. Chaves futuras
  (regional, qualidade) entram dentro desse objeto quando existirem, não como campo irmão.
- **F3.** Peso pode ser nulo (1 item de `mercadorias.json`, os animais de `montarias-veiculos.json`).
- **F4.** Procedência é lore, não dado de jogo: `mercadorias.procedencia.json` vai para
  `lore/economia/`, **não** para `src/data/`. Em `montarias-veiculos.json`, tire o bloco
  `_procedencia` de cada item antes de copiar para `src/data/` e salve o que tirou em
  `lore/economia/montarias.procedencia.json`.
- **F5.** Os JSONs de `src/data` são saída do modelo em `lore/economia/*/gerar.py`. Todo arquivo
  novo leva um campo `"_nota"` dizendo isso, para ninguém editar preço à mão sem atualizar o
  modelo primeiro.
- **F6.** Corrija a `_nota` de `renda.json` para: **"Livre = Renda x 12% x (60/Renda)^0,35 (curva D:
  12% no braçal, 2% na nobreza), arredondado."** A cópia em `lore/economia/v2/` ainda cita a curva
  antiga (20%/0,2); não copie essa nota como está, escreva a corrigida.

**Os arquivos, pela lista final (itens 1-11 do `estado-revisao.md`):**

1. `mercadorias.json` (novo, 193 itens): copiar de `lore/economia/v2/mercadorias.json`. Substitui
   `precos.json` como fonte de preço de item geral.
2. `mercadorias.procedencia.json`: vai para `lore/economia/` (F4), não para `src/data/`.
3. `montarias-veiculos.json` (novo): copiar de `lore/economia/v2/`, sem `_procedencia` (F4) e sem
   `peso` (F3, campo ausente nos animais — o esquema zod aceita opcional/nulo, não force o campo).
4. `servicos.json` (novo): copiar de `lore/economia/v2/` (`tarifas_por_perfil`, `servicos`,
   `aulas`, `criados`, `escravos`, `escravo_sustento_semana`).
5. `pacotes-equipamento.json` (novo): copiar de `lore/economia/v2/` (7 pacotes).
6. `renda.json` (novo): copiar de `lore/economia/v2/` com a `_nota` corrigida (F6).
7. `custo-de-vida.json` (novo): copiar de `lore/economia/v2/`.
8. `viagens.json` (novo): copiar de `lore/economia/v2/`.
9. `precos.json`: **não apague ainda** (isso é o item 2 da ordem geral, abaixo). Antes de apagar,
   confira se algo além de `precos.mjs`/`gen-lista-equip.mjs` ainda lê `precos.json` (a varredura
   do autor foi rápida e pode ter faltado algo). Os ids antigos dos 7 pacotes (`martelo`,
   `corda-canhamo`...) têm mapa 1:1 para os ids novos em `mercadorias.json` (`martelo-ferramenta`,
   `corda-canhamo` mantido igual).
10. `antecedentes.json`: renomear "Relíquia" → "Artefato" (item 969-971 do `estado-revisao.md`,
    junto com a migração de ficha salva do 0.2 acima).
11. `armas.json`, `armaduras.json`: nenhuma mudança de preço além do B8 (0.1 acima). O rename de
    grau de qualidade (Excepcional → Excelente) não afeta esses dois arquivos, é texto de capítulo.

## 2 · Scripts que leem `precos.json` apontam para os novos, só depois aposenta `precos.json`

25. `scripts/precos.mjs`, `scripts/gen-lista-equip.mjs`: apontar para `mercadorias.json` e
    `pacotes-equipamento.json`. Rode `npm run build` e confira que o site ainda monta a lista de
    equipamento inteira antes de tocar em `precos.json`.
26. Só depois de confirmar que nada mais lê `precos.json` (0.1 acima, item 9): apague o arquivo.

## 3 · Gerador de tabelas para os capítulos (como `gen-cap-pericias.mjs`)

`scripts/gen-cap-pericias.mjs` ou um gerador novo equivalente: as tabelas de Renda, custo de vida,
serviços, viagens e servos passam a ser GERADAS dos JSONs novos, nunca digitadas nos capítulos
(mesma disciplina do catálogo de perícias). Isto vem ANTES do texto dos capítulos (seção 4), porque
o texto vai referenciar essas tabelas.

## 4 · Texto dos capítulos, pela lista da Rodada D2

**a) Rename "Excepcional" → "Excelente", só no grau de qualidade:**
- `acoes-oficio-e-mundo.md:74,85,96,98,113`
- `Acoes_Sistema.md:1126,1130,1147,1152,1174`
- `acoes-e-sistema.md:46`
- `custo-de-servico-e-itens.md:63-74,125`

**NÃO trocar** (é o degrau 25 da escada de Dificuldade, conceito diferente):
`acoes-e-sistema.md:24`, `coracao-do-sistema.md:71`, `virtude-jogada.md:40`,
`Acoes_Sistema.md:68,529,545`.

**b) `acoes-oficio-e-mundo.md:190`**: tira "A Montagem se paga igual"; entra a régua de reparo nova
(E2): leve ~1/10 do preço sem Montagem, pesado ~1/3 com meia Montagem, arruinada ~2/3 mais o
material que faltar.

**c) `acoes-oficio-e-mundo.md:173`** (hoje uma linha só, "Carroça, barco de pesca", em semanas):
separa em duas:
- Carroça: Carpintaria, Req 3, Dif 7, Montagem 4, Peça 20, escala de **dias**; avulso ~267 pc
  (6,3 dias), lote de 3 ~238 pc, catálogo 300 pc (1,12× o avulso).
- Barco de pesca: linha própria, continua em **semanas**, ~1.600 pc.

**d) Qualidade (`custo-de-servico-e-itens.md:63-74` e o exemplo do Machado, v2 §1.7):** nomes
Sucata/Tosca/Comum/Boa/Ótima/Excelente; multiplicador fixo **Boa 5×, Ótima 30×, Excelente 70×**
(Tosca até ⅓, Sucata até ⅙); Excelente/Relíquia é rótulo com **piso de 100×**; **Requisito máximo
6** (cada ponto acima vira +3 na Dificuldade). **NÃO mexer** no degrau "intervalo sobe a cada dois
graus" (`:98`) — já está certo, a v2 não diverge nesse ponto.

**e) Fabricar vs alugar trabalho:** se algum trecho novo ou existente falar dessa comparação, use a
formulação do adendo 11.2 da v2, não a frase solta "rendem o mesmo": **"coincidem no produtor de
referência de cada faixa de Dificuldade; fora dele, divergem, e o sinal muda com a soma"** (o
perito que fabrica de verdade ganha ~20% A MAIS que a curva promete; o mestre ganha ~7% A MENOS).
Nunca escrever "fabricar e alugar rendem o mesmo" sem essa ressalva.

**Seções novas, sem local fixo hoje (você decide onde entram, avise no relato):**
- Custo de vida por faixa e pacote familiar (`custo-de-vida.json`).
- Tarifas de serviço e a lista de 38 serviços (`servicos.json`).
- Tabela de viagens em km (`viagens.json`).
- Montarias/animais/veículos/manutenção (`montarias-veiculos.json`).
- Servos e escravos (dentro de `servicos.json`).
- Regra de "semanas de aventura" (v2 §10, Jogador): renda proporcional a dias trabalhados em
  semana parcial, sem custo de vida de faixa para quem não tem casa fixa.
- Cura acelerada por Cura (G66): "cada nível de Cura acelera a recuperação em 10%; 50% exige
  Cura 5", perto de onde o livro já fala da perícia Cura.

## 5 · Pendências

Marque como resolvidas as pendências dos itens 1-24 do `estado-revisao.md` que este despacho
cobre (G47-G70 e as quatro novas: Artefato, revenda, escopo mundano, semanas de aventura), uma a
uma, com o arquivo:linha que fechou cada uma. Deixe abertas, sem tocar:

- Achado (2) da D1/11.2: a frase "fabricar e alugar rendem o mesmo" sem a ressalva do item 4e não
  vai para lugar nenhum do livro nesta rodada; só a ressalva completa pode entrar.
- Modificador regional (A4, adiado desde a A3).
- Impacto do Livre baixo no jogador (v2 §12.2, "para depois").
- B7 ("quanto se poupa vivendo abaixo do nível") — não reconferido, sem achado contra, só não
  verificado; não feche como resolvido.

## 6 · Fora, sem confirmação do autor

**Não escreva** nota no livro sobre personagens que já têm equipamento comprado antes desta
revisão (a proposta é não recalcular o que já possuem) — isso fica para o autor decidir, fora
desta rodada.

O monte B, a migração 33, a fase 4, o desfazer da voz, e os itens da lista única que esperam o
humano continuam fora, como sempre.

## 7 · O relato

`110-executora.md`, por seção deste despacho (0 a 5), com os arquivos tocados, os shas dos
commits (`src/data` e `scripts` separados de `src/content/chapters`, se der para dividir em mais
de um commit coerente), o resultado do `npm run validate` e do `npm run build`, e a prova no
gerado (o HTML do capítulo que mudou, ou `dist/` do equipamento). `progresso-110.md` desde a
primeira etapa, uma linha por etapa pequena.
