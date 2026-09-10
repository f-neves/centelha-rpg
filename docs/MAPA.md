# MAPA · o que existe na raiz do repositório

A raiz tem quase oitenta entradas soltas, e nada nela distingue régua viva de rascunho. Isso já
fez alguém tratar documento histórico como instrução (mesmo defeito que `docs/simulacao/
README.md` resolve para aquela pasta). Este mapa é o equivalente para a raiz do repositório
inteiro.

Três categorias, e nada mais:

- **RÉGUA** · o que define regra de jogo. Na prática isso não mora solto na raiz: mora dentro de
  `src/data/*.json` (a fonte única, por `README.md` raiz) e `src/content/chapters/` (os
  capítulos, que descrevem e não definem). Nenhum arquivo solto da raiz é a régua; alguns
  alimentam ou discutem a régua sem ser ela.
- **TRABALHO** · em uso hoje: citado por outro documento vivo, por um script, por código, ou
  deliberadamente mantido com propósito escrito (mesmo sem citação).
- **RESTO** · rascunho, relatório antigo, bancada que ninguém abre há semanas. Para cada um,
  a linha diz se há CONSUMIDOR (algo que cita o arquivo por nome): se houver, o arquivo não sai,
  mesmo sendo resto. Se não houver nenhum, marco como **candidato a arquivar** — decisão sua.

Levantado em 08/09/2026 por citação: `grep` do nome de cada arquivo contra o repositório inteiro
(exceto `node_modules/`, `dist/`, `.astro/`, `.git/`), mais leitura do cabeçalho de quem ficou
ambíguo. Um arquivo pode não ter citação e ainda ser TRABALHO, se ele mesmo declara por que
existe (ex. `marca/`, `provas/`) — citação é evidência de uso, não é a única prova.

**Isto é RETRATO por citação de 08/09/2026, não autoridade.** O teste é mecânico (um `grep`), e um
arquivo pode ganhar ou perder citação a qualquer commit sem que este mapa saiba. A forma final é
script, não prosa: `scripts/mapa.mjs` está registrado como pendência (`Pendencias.md`), não escrito
ainda. Até existir, quem precisar do estado atual roda o `grep` de novo em vez de confiar nesta
tabela por mais que algumas semanas.

## Arquivos da raiz

| arquivo | categoria | por quê |
|---|---|---|
| `CLAUDE.md` | TRABALHO | as regras de convívio do repositório; instrução ativa |
| `Pendencias.md` | TRABALHO | o índice único dos itens abertos, numerados por `L`; citado em quase tudo |
| `README.md` | TRABALHO | como rodar, o fluxo dos dados, o que é `legacy/` |
| `Acoes_Catalogo.md` | TRABALHO | um dos três docs da frente "ações fora do combate" (lista); citado por `Acoes_Sistema.md`, `Acoes_Texto.md`, `Combate_Referencias.md`, `Pendencias.md` |
| `Acoes_Sistema.md` | TRABALHO | o mesmo trio (mecânica); mesma teia de citação |
| `Acoes_Texto.md` | TRABALHO | o mesmo trio (texto/referência); citado pelos outros dois |
| `Antecedentes.md` | TRABALHO | 14 antecedentes, XP ×3; citado em `Reescala.md`, `Acoes_Sistema.md`, `Acoes_Catalogo.md` |
| `Arcano_revisao.md` | TRABALHO | citado por `scripts/gen-elementos.mjs`, `scripts/test-artes-grid.mjs`, `src/lib/artes-3d.ts` (código real) |
| `Arremesso.md` | TRABALHO | citado por `src/lib/alcance.ts`, `src/data/regras.json` (código real); a régua de arremesso já foi adotada, mas a proposta que este doc registra ainda tem H3/H4 abertos no `Pendencias` |
| `Arremesso_Fatos.md` | TRABALHO | companheiro do `Arremesso.md`; citado por `arremesso-bench.html` |
| `Arremesso_Regra.md` | TRABALHO | citado por `src/lib/combate-resumo.ts` (código real) e `arremesso-bench.html` |
| `Ataques_Mentais.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Arcano_revisao.md`, `Acoes_Catalogo.md`, `Trilhas_Feiticaria.md` |
| `Auditoria_Tecnica.md` | TRABALHO | citado por `supabase/migracao-26.sql` (código); mexido HOJE (commit `77a543d`) |
| `Bestiario_Centelha.md` | TRABALHO | citado por `Reescala.md` |
| `Combate_Prolongado.md` | **ARQUIVADO** em 08/09/2026 → `legacy/raiz/Combate_Prolongado.md` | zero citação; motivo em `legacy/raiz/README.md` |
| `Combate_Referencias.md` | TRABALHO | levantamento aberto em 28/08/2026, "nada aqui é decisão", companheiro declarado de `Grid_melhorias.md`/`Grid_Automacao.md` (os dois vivos). Citado só por `docs/simulacao/00-diagnostico.md` de volta, mas alimenta decisão pendente, não é peça morta |
| `Combate_Simultaneo.md` | TRABALHO | citado por `src/pages/mesa/grid.astro`, `src/lib/combate-tempo.ts`, `src/data/regras.json`, `scripts/test-simultaneo.mjs` (código real). `Pendencias.md` já registra que, discordando de `docs/simulacao/02-projeto-harness.md`, vale o `02` |
| `Combate_Social.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `Regua_Relacao.md`, `Qual_Sistema.md` |
| `Combate_Tempo.md` | TRABALHO | o mais citado de todos (17 arquivos), incluindo `grid.astro`, `combate.astro`, `combate-tempo.ts`, `regras.json`, `ficha-engine.ts`, `supabase/migracao-27.sql` |
| `Defesas.md` | **ARQUIVADO** em 08/09/2026 → `legacy/raiz/Defesas.md` | zero citação; motivo em `legacy/raiz/README.md` |
| `Defesas_revisao.md` | RESTO, mas citado | só `Acoes_Sistema.md` cita. A revisão já foi implementada no bestiário e na ficha (registro de memória); fica por causa da citação, mas é candidato fraco |
| `Dominio.md` | TRABALHO | citado por `astro.config.mjs` (código), `Migracao_Astro7.md`, `Migracao_Dominio.md`, `Pendencias.md`. Domínio próprio já decidido (`centelha.rec.br`), migração em andamento |
| `Golpe_Tardio.md` | TRABALHO | citado por `scripts/gen-deslocamento.mjs`, `src/data/regras.json`, `Combate_Tempo.md`, `Combate_Simultaneo.md` |
| `Grid_Automacao.md` | TRABALHO | citado por `src/pages/mesa/grid.astro`, `Combate_Tempo.md`, `Grid_Mobile.md`, `CLAUDE.md` (indiretamente via `Grid_melhorias.md`) |
| `Grid_Mobile.md` | TRABALHO | citado por `grid.astro`, `scripts/test-grid.mjs`, `Grid_melhorias.md`. As 7 fases já fecharam, mas o doc segue como referência do que o mobile faz hoje |
| `Grid_melhorias.md` | TRABALHO | citado por `CLAUDE.md` e `docs/simulacao/CONTEXTO.md` diretamente — é o registro da frente "comandos por voz" |
| `Migracao_Astro7.md` | TRABALHO | citado por `astro.config.mjs` (código), `Dominio.md`. Migração ainda pendente (sair do GitHub Pages antes) |
| `Migracao_Dominio.md` | TRABALHO | citado por `Migracao_Astro7.md`, `Dominio.md`, `Pendencias.md` |
| `Miniaturas_3D.md` | **ARQUIVADO** em 08/09/2026 → `legacy/raiz/Miniaturas_3D.md` | zero citação; motivo em `legacy/raiz/README.md` |
| `Paleta_Centelha.html` | **ARQUIVADO** em 08/09/2026 → `legacy/raiz/Paleta_Centelha.html` | zero citação; motivo em `legacy/raiz/README.md` |
| `Proezas_revisao.md` | TRABALHO, fica | conferido por inteiro em 08/09/2026 (pedido do humano): é o documento de trabalho da revisão das Proezas nos 9 atributos (48 subcaminhos); só Força fechou. `D2` (uma linha sobre Furtividade da Técnica) fechou hoje, mas `D1` (matar o campo `banda` do schema) e `D3` (densidade dos funis) continuam abertos no `Pendencias.md`, na mesma seção "D. Proezas e Técnicas · detalhe em Proezas_revisao.md" — o documento não foi absorvido, é a referência viva desses dois itens |
| `Qual_Sistema.md` | TRABALHO | fluxograma de roteamento entre subsistemas da régua. Zero citação formal, mas é ferramenta de navegação declarada, não rascunho |
| `REVISAR.md` | RESTO, deliberado | auto-declarado "registro histórico" desde o próprio cabeçalho ("gerado por `migrate-to-json.mjs`... itens já resolvidos ficam ✅"). Citado por `README.md` raiz. Não é candidato a arquivar: já está no lugar certo, fazendo o papel de histórico |
| `Reescala.md` | TRABALHO | citado por `Bestiario_Centelha.md`, `Qual_Sistema.md`, `Antecedentes.md`, `Pendencias.md`. Bestiário/Kael da Fase 6 ainda pendentes |
| `Regua_Relacao.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `Combate_Social.md` |
| `Relacoes.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md` |
| `Relatorio.md` | TRABALHO, fica | lido por inteiro em 08/09/2026 (pedido do humano): análise externa de game design, 14 recomendações priorizadas. Parte virou trabalho concreto (a seção 9, "Backgrounds", é a origem direta dos 14 antecedentes de `Antecedentes.md`; as seções 5 e 8, sobre a escala da Defesa Mental e o roteamento de Proezas de controle para ela, viraram `Defesas_revisao.md`/`Ataques_Mentais.md`; a recomendação de um "glossário de qual sistema uso quando" é `Qual_Sistema.md`). Mas metade do relatório segue sem eco em lugar nenhum (taxa de acerto documentada errada, payoff da arma leve, bookkeeping do Quase-Acerto, trilha de aprendizado, as quatro reservas) — não é "conteúdo absorvido", é fonte parcialmente usada, e fica |
| `Trilhas_Feiticaria.md` | TRABALHO | citado por `Arcano_revisao.md`, `Ataques_Mentais.md`, `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `REVISAR.md`. Frente "a criar" ainda aberta |
| `XP_revisao.md` | **RESTO, candidato a arquivar** | zero citação, exceto a própria bancada (`ficha-xp-2.html`, que também é candidata) |
| `armaduras_escudos_centelha.txt` | **ARQUIVADO** em 08/09/2026 → `legacy/raiz/armaduras_escudos_centelha.txt` | zero citação; motivo em `legacy/raiz/README.md` |
| `arremesso-bench.html` | TRABALHO | citado por `Pendencias.md`; bancada do arremesso, régua já aplicada |
| `combate-tempo-bench.html` | TRABALHO | citado por `scripts/test-bench-tempo.mjs`, `scripts/gen-bench-tempo.mjs`, `scripts/lib-tempo.mjs` (código real) |
| `conversao-monstros.html` | TRABALHO | citado por `scripts/gen-bestiario.mjs`, `scripts/shot-conv.mjs` (código real) |
| `ficha-xp-2.html` | RESTO, mas citado | só `XP_revisao.md` cita (que é ele mesmo candidato a arquivar). Os dois têm o mesmo destino |
| `ficha-xp.html` | RESTO, mas citado | só `REVISAR.md` cita, que já é histórico por natureza. Consumidor fraco: não é código nem doc vivo |
| `luas-bench.html` | TRABALHO | citado por `scripts/test-luas.mjs` (código real) |
| `resumo-regras.txt` | TRABALHO | citado por `scripts/replace-floor.mjs` (código real) e `Pendencias.md` |
| `simulador-batalha.html` | RESTO, mas citado | só `docs/simulacao/00-diagnostico.md` cita, e é histórico da frente encerrada. Consumidor fraco |
| `volume-bench.html` | TRABALHO | citado por `src/lib/artes-3d.ts` (código real), `Arcano_revisao.md` |
| `bash.exe.stackdump` | **APAGADO** em 08/09/2026 | debris de um crash do bash, listado no `.gitignore`, nunca versionado. Removido direto, sem passar por `legacy/` |
| `.env` (não versionado) | TRABALHO | segredo do Supabase. Conferido em 08/09/2026: nunca esteve no histórico do git (`git log --all -- .env` vazio, `git ls-files` não o acha) e está listado em `.gitignore:9`. Sem vazamento — a classificação anterior deste mapa não dizia "não versionado" como diz para `node_modules`/`dist`, e isso ficou corrigido aqui |
| `.env.example` | TRABALHO | molde do `.env`, versionado de propósito (sem segredo dentro) |
| `.gitattributes` / `.gitignore` | TRABALHO | fim de linha (LF) e o que não versiona |
| `astro.config.mjs` / `astro.bancada.mjs` | TRABALHO | configuração do Astro (site e bancada) |
| `package.json` / `package-lock.json` / `tsconfig.json` | TRABALHO | dependências e build |

## Pastas da raiz

| pasta | categoria | por quê |
|---|---|---|
| `src/` | RÉGUA + TRABALHO | a régua mora dentro (`data/*.json`, `content/chapters/`); o motor e as páginas também (`lib/`, `pages/`, `components/`) |
| `scripts/` | TRABALHO | geradores, testes, bancadas — a ferramentação inteira |
| `supabase/` | TRABALHO | as migrações, numeradas; `Pendencias.md` `L42`/`L45` diz o que cada uma muda |
| `public/` | TRABALHO | o que o site serve direto (favicon, ícones) — distinto de `marca/`, que é só uso fora do site |
| `docs/` | TRABALHO | hoje só contém `simulacao/` (mapeada em `docs/simulacao/README.md`) e este `MAPA.md` |
| `.github/` | TRABALHO | os workflows (`deploy.yml`, `validate.yml`) |
| `.claude/` | TRABALHO | configuração da sessão Claude Code neste repositório (hooks, settings locais) |
| `.vscode/` | TRABALHO | configuração do editor |
| `marca/` | TRABALHO, deliberado | assets de marca fora do site (apresentação, redes); README próprio explica; gerado por `scripts/gera-marca-gif.mjs` |
| `provas/` | TRABALHO, deliberado | bancadas de prova visual que já se perderam uma vez (README próprio conta a história) |
| `lore/` | TRABALHO | worldbuilding (`Lore_Centelha.md`, `creatures/`, `mapas/`); citado por `scripts/test-luas.mjs` |
| `legacy/` | RESTO, deliberado | "guarda apenas o material-fonte histórico" (README raiz, textual). O site lê só de `src/data/`. Arquivo de propósito, não candidato a arquivar de novo — já é o arquivo |
| `D&D/` | TRABALHO (não versionado) | material de referência (PDFs/artes D&D/Pathfinder), gitignorado por ser pesado. Conferido em 08/09/2026: só dois dos quatro geradores dependem de conteúdo PRÉ-EXISTENTE ali (`gen-arte-equip.mjs`, `gen-creditos-equip.mjs`); os outros dois (`gen-lista-equip.mjs`, `gen-prompts-folhas.mjs`) só usam a pasta como destino de escrita e a criam sozinhos. Risco real, já registrado como `L50` (`Pendencias.md`, `[FAZER]`): `gen-arte-equip.mjs`, num clone sem `D&D/`, roda com `exit 0` e sobrescreve o `src/styles/arte-equip.css` versionado por um quase-vazio, sem erro nenhum — falha CALADA. `gen-creditos-equip.mjs` falha ALTO (`process.exit(1)` com mensagem) quando falta o relatório do baixador |
| `_shots/` | TRABALHO, deliberado | limpa em 08/09/2026 (449 arquivos descartados); `_shots/README.md` (exceção ao `.gitignore`) lista os oito scripts que a regeneram e o que cada um fotografa |
| `node_modules/` | TRABALHO (não versionado) | dependências instaladas |
| `dist/` | TRABALHO (não versionado) | saída do build |
| `.astro/` | TRABALHO (não versionado) | cache do compilador Astro |
| `.bancada/` | TRABALHO (não versionado) | saída/cache da bancada (banco de mentira) |
| `.portoes/` | TRABALHO (não versionado) | cache/saída dos portões de validação |
| `.sim/` | TRABALHO (não versionado) | saída das baterias de simulação; "cada uma tem o seu manifesto e é refeita" (`.gitignore`) |
| `.git/` | infraestrutura | o repositório em si |

## Pastas fora do repositório

Em `C:/Users/Neves/ClaudeCode/`, só as que têm relação com este projeto (o diretório tem outras
dezenas de projetos sem nenhuma ligação com o Centelha, fora do escopo deste mapa):

- **`rpg-system/`** · este repositório, a raiz que este mapa descreve.
- **`centelha-techlead-revisora/`** · **fica.** É o worktree congelado da Revisora
  (`git worktree list` confirma: `ae007b6`, detached HEAD). O congelamento é a única coisa que a
  revisão compra — não pode virar branch nem sumir enquanto a equipe Executora/Revisora existir.
- **`centelha-techlead/`** · **pode ir embora quando a sessão que a prende fechar.** Não é
  worktree (sem `.git`, não aparece no `git worktree list`). Hoje só tem `.claude/` (config da
  sessão) e um `bash.exe.stackdump` solto. O conteúdo de valor que morava aqui (`PLANO.md`,
  `TECHLEAD.md`) já foi movido para `docs/simulacao/` no commit `c0e46dc`, exatamente porque essa
  pasta não tinha git e não tinha histórico.
- **`centelha-revisora`** (a antiga) · não existe mais. Foi removida com `git worktree remove`
  em 08/09/2026, depois de copiar o `CLAUDE.local.md` dela para `docs/simulacao/REVISORA.md`.
  Citada aqui só para quem procurar não achar e se perguntar se sumiu por engano: não sumiu, o
  conteúdo tem endereço novo. (A cópia foi feita duas vezes, e a segunda,
  `CONTRATO-REVISORA-ORIGINAL.md`, foi apagada em 10/09/2026: era o mesmo texto, e o cabeçalho
  dela afirmava o contrário. Ver `CATALOGO.md`.)

**Atualização de 08/09/2026, segunda passada:** os cinco candidatos com zero citação (`Combate_
Prolongado.md`, `Defesas.md`, `Miniaturas_3D.md`, `Paleta_Centelha.html`,
`armaduras_escudos_centelha.txt`) foram movidos para `legacy/raiz/` com `git mv`, histórico
preservado; `bash.exe.stackdump` foi apagado (nunca versionado); `_shots/` foi esvaziada e ganhou
README. `Relatorio.md` e `Proezas_revisao.md` foram lidos por inteiro e ficam: conteúdo não
absorvido por completo em nenhum dos dois. Nada mais foi movido, apagado nem arquivado — o resto
segue para você decidir.
