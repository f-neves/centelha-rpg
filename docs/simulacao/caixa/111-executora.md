# Rodada 111 · Executora · F2 estendida e `lore/economia/` versionada

- **Despacho:** `docs/simulacao/caixa/111-despacho.md` (`e1b318c`).
- **Árvore:** branch `executora`, posta em `e1b318c` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-111.md`, com as horas lidas da máquina.
- **Publicado:** `c47ebcb` (F2), `508c92a` (F4), e este relato num terceiro commit.
- **Pendências:** só a G70 fechou, porque é a única que o despacho cobre. Nenhuma outra de economia foi
  tocada.

## 1 · F2 estendida

**A forma.** Todo valor em dinheiro dos cinco arquivos virou `{ por, preco: { pc } }`. Os cinco são
`servicos`, `viagens`, `custo-de-vida`, `renda` e `pacotes-equipamento`; os preços de `mercadorias`
e `montarias-veiculos` já eram `{pc}`. O `por` sai de um vocabulário fechado, conferido pelo
esquema. Quando a unidade velha dizia mais que o tempo, o resto foi para um campo próprio:
- `regime` (`contrato`/`avulso`);
- `oficio` (`leve`/`artesao`/`bracal`, a jornada da hora);
- `nota` (o resto do texto, nas viagens).

**O vocabulário.** Uso os dez do despacho. **Acrescentei três**, porque nenhum dos dez cabia:
- `mes` e `ano`: as colunas de renda e de Livre;
- `ponto`: o preço de uma aula é pelo ponto ensinado, e não por dia nem por vez.

**Como cada unidade de texto virou `por`:**

| hoje | `por` | extra |
|---|---|---|
| `dia (avulso)` | `dia` | `regime: "avulso"` |
| `dia`, `hora`, `semana`, `jornada`, `página`, `vez` | a mesma | |
| `muda`, `atendimento`, `consulta`, `parto`, `missa`, `cerimônia`, `noite`, `apresentação` | `vez` | |
| `carta`, `documento`, `cavalo` (adestrar) | `unidade` | |
| `10 km (rio abaixo); x2 rio acima` | `10 km` | `nota: "rio abaixo; x2 rio acima"` |
| `tonelada por km`, `2 toneladas por km` | `km` | `nota: "por tonelada"` / `"por 2 toneladas"` |
| `trajeto curto` | `trajeto` | `nota: "curto"` |
| `pessoa; 5 com cavalo`, `pessoa; 3 por animal; 10 por carroça` | `vez` | `nota` com o resto |

**As três decisões de forma que ficaram comigo:**

1. **O par catálogo/calculado, em serviços e aulas: dois campos irmãos com a mesma forma**,
   `preco: {pc}` (o de catálogo, que o livro mostra) e `calculado: {pc}` (o valor antes de
   arredondar, ou `null` quando o modelo não calculou). A outra saída, um objeto só com os dois
   dentro, obrigaria todo leitor a saber qual dos dois é o preço. Assim `preco` quer dizer a mesma
   coisa em todos os arquivos.
   - Aulas: `pc` (arredondado) virou `preco`, e `preco` (exato) virou `calculado`. O nome velho
     estava ao contrário do resto.
   - Escravos: `pc_catalogo_atual` virou `catalogo_anterior`, porque é o preço de antes da revisão.
   - Pacotes: `total_pc` virou `total: {pc}`, e `total_atual_pc` virou `total_anterior: {pc}`,
     pelo mesmo motivo.
   - O **professor**, cujo preço era a string `"ver aulas"` (confirmado no arquivo), ficou com
     `preco: null` e `ver: "aulas"`. O capítulo mostra "ver aulas", como antes.
2. **O nome do campo em `renda.json`: `preco`, como o despacho sugere, e não `valor`.** Renda não é
   preço de compra, mas um segundo nome para o mesmo `{pc}` com `por` obrigaria o esquema e o
   gerador a conhecer dois vocabulários. Quem lê sabe que é renda pelo nome da grandeza:
   `renda`, `livre`, `custo`, cada um um array por unidade. `custo` só tem `semana` na fonte; não
   inventei mês e ano para ele.
3. **Converti também o dinheiro que o despacho não listou**, para a regra "preço sempre objeto" não
   ter exceção:
   - em `custo-de-vida.json`: as cestas, as moradias, os criados, a manutenção do cavalo e as
     parcelas do pacote familiar;
   - em `renda.json`: a curva por soma, o valor por ponto e os tetos de demanda (o da capital é
     `preco: null`, como era `null`);
   - em `pacotes-equipamento.json`: os totais.
   Onde o nome da chave já dizia a unidade, o nome perdeu o sufixo (`cestas_semana` virou `cestas`,
   `escravo_sustento_semana` virou `escravo_sustento`), porque o `por` diz isso agora.
   `velocidades_km_dia` não mudou, porque é distância e não dinheiro.

**As camadas:**
- **`../tmp/executora/copiar-economia.mjs`** ganhou a função `f2`, que roda depois das
  transformações da 110. Uma unidade sem mapa ou um preço em texto não previsto param a cópia. O
  `--check` refaz tudo a partir da v2 e deu **igual** nos 7 JSONs e nas 2 procedências. O md5 dos 8
  JSONs da v2 não mudou desde a 110.
- **`scripts/validate-data.mjs`:** os esquemas `.strict()` da forma nova, com o `por` em
  `z.enum`.
  **Controle negativo:** um número solto no lugar de `preco`, um `por: "quinzena"`, a chave `pc`
  velha nas viagens e um `_procedencia` dentro de um custo. Os quatro foram acusados ("Expected
  object, received number", "Invalid enum value ... received 'quinzena'", "Unrecognized key(s) ...
  'pc'", "... '_procedencia'"). Os arquivos foram restaurados, e o `--check` os conferiu.
- **`scripts/gen-cap-economia.mjs`** lê `preco.pc` e `por`. A função `de(array, por, filtro)` acha o
  valor de uma unidade e falha alto se não houver exatamente um. As tabelas continuam com as mesmas
  colunas.
- **As `_nota`** descrevem a fórmula certa e não mudaram. A de montarias mudou por causa da F4 (seção
  2).

**Prova.**
- O capítulo regerado difere do da 110 em **19 linhas, todas na coluna de unidade** das tabelas de
  Serviços e de Viagens ("muda" virou "vez", "tonelada por km" virou "km (por tonelada)"). Li o diff
  linha a linha, e **nenhum número mudou**.
- `npm run validate` e `npm run build` verdes.
- Amostra lida no `dist/regras/custo-de-servico-e-itens/index.html`, valor por valor, contra o da
  110:
  - Braçal: 6 pp, 2 po 4 pp e 7 pc; Nobreza: 100 po e 400 po;
  - Perito (soma 9): 334,3 pc e 55,7 pc;
  - Atributo 5: 21 po;
  - Companhia (concubina): 108 po;
  - Sustento por semana: 14,5 pc;
  - Frete por mar: 1 pc;
  - Aristocrata, no custo de vida: 15 po;
  - Manter um cavalo: 41,6 pc;
  - Artista: 5 po 7 pp 2 pc.
- `precos.mjs` e `gen-lista-equip.mjs` rodam e dão os mesmos totais. Eles não liam os campos que
  mudaram.

## 2 · F4, `lore/economia/` versionada (fecha a G70)

**Entraram** (`508c92a`), copiados do `rpg-system/lore/economia/`, com o md5 de origem e de destino
iguais nos 15 (`../tmp/executora/md5-origem-111.txt` e `md5-destino-111.txt`, conferidos por `cmp`):
- o modelo v1 (`etapas-abc/`: `base.py`, `mercadorias.py`, `modelo.py`, `gerar.py`) e o v2 (`v2/`: os
  mesmos quatro);
- `etapas-abc/revisao-economica-etapas-abc.md` e `v2/revisao-economica-v2.md`;
- `estado-revisao.md` (md5 `c938352f3bd8386d9c4cb3f184099baa`, **gravado às 01:05 de 26/09 no
  `rpg-system`, ou seja, ele estava sendo mexido enquanto eu copiava**; ver PRECISA DE MIM 1);
- as procedências `etapas-abc/mercadorias.procedencia.json` e `v2/mercadorias.procedencia.json`, e
  as duas da 110 em `lore/economia/` (`mercadorias.procedencia.json` e `montarias.procedencia.json`,
  com os md5 anotados no relato da 110). A `mercadorias.procedencia.json` da raiz é **byte a byte
  igual** à de `v2/`: o despacho manda as duas, e a duplicata fica registrada aqui.
- `README.md` novo: os sete JSONs de `src/data` saem de `v2/gerar.py` e não se editam à mão. Ele
  também diz o que é cada arquivo e o que ficou de fora.

**Os três ambíguos, pelo critério do despacho** (entra o que um documento que já entra cita como
fonte):
- `catalogo-unificado.md` **entra**. O `estado-revisao.md` o cita como fonte de preços e pesos
  (`:17`, `:91`, `:125`).
- `anexo-auditoria-f1-f3.md` **entra**. É citado no `estado-revisao.md:468` como o anexo da
  auditoria das Fases 1 a 3, pedida pelo autor.
- `prompt-revisao-economica.md` **fica de fora**. Nenhum dos três documentos o cita; é o pedido que
  abriu a revisão, e não fonte de número nem de decisão.

**Ficaram de fora, como o despacho manda:** os dois zips, `v2/__pycache__/` (que o `.gitignore:5` já
cobria), `v2/bash.exe.stackdump`, os JSONs gerados de `etapas-abc/` e `v2/`, `gerar_mercadorias.py`,
`mercadorias.proposta.json`, `proposta-mercadorias.md` e `proposta-precos-f1-f3.md`.

**Conferências depois de versionar:**
- `test-portoes.mjs` §7 verde ("só as quatro árvores, `tmp/`, o `LEIA-ME.md` e a
  `centelha-mudanca/`").
- `git check-ignore` não esconde nenhum dos arquivos que entraram.
- Os arquivos já estavam em LF.
- A `_nota` de `montarias-veiculos.json` passou a citar `lore/economia/montarias.procedencia.json`.

**G70 fechada** em `docs/pendencias/G-acoes-sistema.md`, com os arquivos e os shas; `Pendencias.md`
regerado (221 → 220 abertos).

## PRECISA DE MIM

1. **O `rpg-system` vai recusar o próximo `git pull`.** Os 15 caminhos de `lore/economia/` que
   entraram no `main` existem lá como arquivos NÃO versionados, e o git não sobrescreve arquivo não
   versionado num pull ("untracked working tree files would be overwritten"). Quem trabalha no
   `rpg-system` precisa tirar as cópias de lá antes do pull.
   **O `estado-revisao.md` pede cuidado:** ele foi gravado no `rpg-system` às 01:05 de hoje, e o
   Revisor do autor pode estar escrevendo nele agora. Se ele mudar depois do meu md5
   (`c938352f...`), a versão dele é a mais nova, e ela precisa entrar por cima da do `main` depois
   do pull, e não ser apagada. Não mexi em nada do `rpg-system`.
2. **Rodar o `v2/gerar.py` escreve os JSONs e os `tab_*.md` ao lado dele** (`OUTDIR`), e esses
   arquivos vão aparecer como não versionados. Se quiser, um `.gitignore` para eles; não fiz, porque
   não foi pedido.
3. **O `copiar-economia.mjs` mora em `../tmp/executora/`**, e é ele que faz a ponte entre a saída do
   `gerar.py` e o `src/data`, com as transformações da 110 e da 111. Sem ele versionado, a cadeia
   "modelo → site" não se refaz por quem não tem o meu `tmp`. Sugiro guardá-lo em `lore/economia/`
   (ou em `scripts/`). Não fiz, porque não foi pedido.

## QUEBROU

Nada.

## BLOQUEADO

Nada.

## Adendo · os dois pedidos do Arquiteto depois do relato

1. **`.gitignore`:** `lore/economia/**/out/`. O `gerar.py` escreve em `out/`, relativo à pasta onde
   roda (`OUTDIR = "out"`), e lá caem os JSONs e os `tab_*.md`. Testado: rodei o modelo dentro de
   `lore/economia/v2/`, o `git status` ficou limpo, e o `check-ignore` apontou a regra nova. Depois
   apaguei o `out/` e o `__pycache__` que o teste criou.
2. **`scripts/copiar-economia.mjs`** (versionado), com o `--check` no `npm run validate`, logo antes do
   `gen-cap-economia.mjs`. **Mudou uma coisa em relação ao que morava no meu `tmp`:** a fonte agora é
   o **modelo**, e não uma cópia dos JSONs gerados. O script copia os `.py` de `lore/economia/v2/`
   para uma pasta temporária do sistema, roda o `gerar.py` lá e parte da saída. Assim o `--check`
   prova a cadeia inteira (modelo → `gerar.py` → cópia → `src/data`) e pega também o modelo mudado
   sem gerar de novo.
   - **A saída do modelo versionado é byte a byte a dos JSONs da v2** que o autor tinha no
     `rpg-system`: comparei o md5 dos 8 arquivos e deu igual em todos.
   - O `--check` deu verde nos 10 arquivos (os 7 de `src/data` e as 3 procedências).
   - Custo: o `gerar.py` roda em ~0,3 s.
   - Precisa de Python 3. No Windows o `python3` é o atalho da loja, então o script testa `python`,
     `py` e `python3` nessa ordem; no Linux do CI, `python3`. Sem Python, falha alto, e não pula.
   - **Controle negativo, dois:** um preço mudado à mão em `src/data/renda.json` (60 → 61) deu
     "fora de sincronia ... src/data/renda.json". Um número mudado no modelo (`mercadorias.py:26`,
     75 → 80, sem gerar de novo) deu "fora de sincronia ... mercadorias.procedencia.json". Os dois
     arquivos foram restaurados, com o md5 conferido.
   - O `README.md` da pasta passou a citar o script.
