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
| `Combate_Prolongado.md` | **RESTO, candidato a arquivar** | zero citação em qualquer lugar do repositório, nem em `Pendencias.md`. Já era pra estar assim: decisão anterior registra que não é regra, e que só as medições valiam guardar |
| `Combate_Referencias.md` | TRABALHO | levantamento aberto em 28/08/2026, "nada aqui é decisão", companheiro declarado de `Grid_melhorias.md`/`Grid_Automacao.md` (os dois vivos). Citado só por `docs/simulacao/00-diagnostico.md` de volta, mas alimenta decisão pendente, não é peça morta |
| `Combate_Simultaneo.md` | TRABALHO | citado por `src/pages/mesa/grid.astro`, `src/lib/combate-tempo.ts`, `src/data/regras.json`, `scripts/test-simultaneo.mjs` (código real). `Pendencias.md` já registra que, discordando de `docs/simulacao/02-projeto-harness.md`, vale o `02` |
| `Combate_Social.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `Regua_Relacao.md`, `Qual_Sistema.md` |
| `Combate_Tempo.md` | TRABALHO | o mais citado de todos (17 arquivos), incluindo `grid.astro`, `combate.astro`, `combate-tempo.ts`, `regras.json`, `ficha-engine.ts`, `supabase/migracao-27.sql` |
| `Defesas.md` | **RESTO, candidato a arquivar** | zero citação em qualquer lugar. A régua das três Defesas já está implementada (`src/data/regras.json`, capítulo); este parece ser o rascunho anterior ao `Defesas_revisao.md` |
| `Defesas_revisao.md` | RESTO, mas citado | só `Acoes_Sistema.md` cita. A revisão já foi implementada no bestiário e na ficha (registro de memória); fica por causa da citação, mas é candidato fraco |
| `Dominio.md` | TRABALHO | citado por `astro.config.mjs` (código), `Migracao_Astro7.md`, `Migracao_Dominio.md`, `Pendencias.md`. Domínio próprio já decidido (`centelha.rec.br`), migração em andamento |
| `Golpe_Tardio.md` | TRABALHO | citado por `scripts/gen-deslocamento.mjs`, `src/data/regras.json`, `Combate_Tempo.md`, `Combate_Simultaneo.md` |
| `Grid_Automacao.md` | TRABALHO | citado por `src/pages/mesa/grid.astro`, `Combate_Tempo.md`, `Grid_Mobile.md`, `CLAUDE.md` (indiretamente via `Grid_melhorias.md`) |
| `Grid_Mobile.md` | TRABALHO | citado por `grid.astro`, `scripts/test-grid.mjs`, `Grid_melhorias.md`. As 7 fases já fecharam, mas o doc segue como referência do que o mobile faz hoje |
| `Grid_melhorias.md` | TRABALHO | citado por `CLAUDE.md` e `docs/simulacao/CONTEXTO.md` diretamente — é o registro da frente "comandos por voz" |
| `Migracao_Astro7.md` | TRABALHO | citado por `astro.config.mjs` (código), `Dominio.md`. Migração ainda pendente (sair do GitHub Pages antes) |
| `Migracao_Dominio.md` | TRABALHO | citado por `Migracao_Astro7.md`, `Dominio.md`, `Pendencias.md` |
| `Miniaturas_3D.md` | **RESTO, candidato a arquivar** | zero citação. Estudo de viabilidade fechado (agosto/2026), protótipo em `_shots/` (que também é descartável) |
| `Paleta_Centelha.html` | **RESTO, candidato a arquivar** | zero citação em qualquer lugar |
| `Proezas_revisao.md` | RESTO, mas citado | só `Pendencias.md` cita, e a decisão relacionada (`D2`) fechou HOJE (commit `b694eb6`). Candidato natural a virar histórico agora que fechou — decisão sua |
| `Qual_Sistema.md` | TRABALHO | fluxograma de roteamento entre subsistemas da régua. Zero citação formal, mas é ferramenta de navegação declarada, não rascunho |
| `REVISAR.md` | RESTO, deliberado | auto-declarado "registro histórico" desde o próprio cabeçalho ("gerado por `migrate-to-json.mjs`... itens já resolvidos ficam ✅"). Citado por `README.md` raiz. Não é candidato a arquivar: já está no lugar certo, fazendo o papel de histórico |
| `Reescala.md` | TRABALHO | citado por `Bestiario_Centelha.md`, `Qual_Sistema.md`, `Antecedentes.md`, `Pendencias.md`. Bestiário/Kael da Fase 6 ainda pendentes |
| `Regua_Relacao.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `Combate_Social.md` |
| `Relacoes.md` | TRABALHO | citado por `Acoes_Sistema.md`, `Acoes_Catalogo.md` |
| `Relatorio.md` | RESTO, mas conferir antes de arquivar | zero citação por nome em qualquer lugar, nem `Pendencias.md`. Registro de memória o descreve como a análise que fundamenta `Ataques_Mentais.md`/`Antecedentes.md` (esses dois vivos) — o conteúdo pode estar vivo por trás mesmo sem citação formal. Não marquei como candidato direto por isso; peça pra alguém confirmar antes de arquivar |
| `Trilhas_Feiticaria.md` | TRABALHO | citado por `Arcano_revisao.md`, `Ataques_Mentais.md`, `Acoes_Sistema.md`, `Acoes_Catalogo.md`, `REVISAR.md`. Frente "a criar" ainda aberta |
| `XP_revisao.md` | **RESTO, candidato a arquivar** | zero citação, exceto a própria bancada (`ficha-xp-2.html`, que também é candidata) |
| `armaduras_escudos_centelha.txt` | **RESTO, candidato a arquivar** | zero citação. Era insumo para a conversão de armaduras/escudos, já feita (as 9 armaduras batem número a número com o capítulo publicado, conforme `docs/simulacao/CONTEXTO.md`) |
| `arremesso-bench.html` | TRABALHO | citado por `Pendencias.md`; bancada do arremesso, régua já aplicada |
| `combate-tempo-bench.html` | TRABALHO | citado por `scripts/test-bench-tempo.mjs`, `scripts/gen-bench-tempo.mjs`, `scripts/lib-tempo.mjs` (código real) |
| `conversao-monstros.html` | TRABALHO | citado por `scripts/gen-bestiario.mjs`, `scripts/shot-conv.mjs` (código real) |
| `ficha-xp-2.html` | RESTO, mas citado | só `XP_revisao.md` cita (que é ele mesmo candidato a arquivar). Os dois têm o mesmo destino |
| `ficha-xp.html` | RESTO, mas citado | só `REVISAR.md` cita, que já é histórico por natureza. Consumidor fraco: não é código nem doc vivo |
| `luas-bench.html` | TRABALHO | citado por `scripts/test-luas.mjs` (código real) |
| `resumo-regras.txt` | TRABALHO | citado por `scripts/replace-floor.mjs` (código real) e `Pendencias.md` |
| `simulador-batalha.html` | RESTO, mas citado | só `docs/simulacao/00-diagnostico.md` cita, e é histórico da frente encerrada. Consumidor fraco |
| `volume-bench.html` | TRABALHO | citado por `src/lib/artes-3d.ts` (código real), `Arcano_revisao.md` |
| `bash.exe.stackdump` | **RESTO, candidato a apagar (não a arquivar)** | debris de um crash do bash, já listado no próprio `.gitignore` como lixo conhecido. Nunca foi versionado. Não é documento, é o único item deste mapa que sugiro remover direto em vez de arquivar |
| `.env` / `.env.example` | TRABALHO | segredo do Supabase / molde dele |
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
| `D&D/` | TRABALHO (não versionado) | material de referência (PDFs/artes D&D/Pathfinder), gitignorado por ser pesado. Consumido por quatro geradores (`gen-arte-equip.mjs` e mais três, achado da revisora na rodada 23) |
| `_shots/` | RESTO, descartável por natureza | 449 arquivos, "temporários de inspeção" pelo próprio `.gitignore`. Não precisa decisão: é feito pra ser jogado fora quando quiser |
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
  em 08/09/2026, depois de copiar o `CLAUDE.local.md` dela para
  `docs/simulacao/CONTRATO-REVISORA-ORIGINAL.md`. Citada aqui só para quem procurar não achar e
  se perguntar se sumiu por engano: não sumiu, o conteúdo tem endereço novo.

Nada foi apagado nesta passada, exceto a sugestão pontual do `bash.exe.stackdump` (que é lixo, não
documento). O resto é para você decidir.
