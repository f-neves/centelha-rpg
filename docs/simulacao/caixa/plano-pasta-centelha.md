# Plano · as quatro árvores dentro de C:/Users/Neves/ClaudeCode/centelha/

Escrito pelo Arquiteto em 25/09/2026, a pedido do humano, depois do `levantamento-pastas.md`.
**Nada foi executado.** Nenhuma pasta foi criada, movida ou apagada, e nenhum junction foi desfeito. A
única coisa rodada foi um **ensaio num repositório de brinquedo dentro do scratchpad** (seção 1b), que
não encosta em nada do Centelha. Pastas fora de escopo e as seis do "não sei": não abertas. No
Defensor rodei só uma contagem de citações às nossas pastas, que o humano pediu (seção 3).

O desenho:

    C:/Users/Neves/ClaudeCode/centelha/
        rpg-system/                   (o repositório principal, main)
        centelha-executora/           (worktree, branch executora)
        centelha-techlead-revisora/   (worktree, branch revisora)
        centelha-mapa/                (worktree, branch mapa)
        tmp/                          (novo: saída temporária, fora do git; seção 4)

## 1 · O que quebra

### (a) Os junctions: são SEIS, não dois

Varredura das quatro árvores, sem descer em nenhum atalho:

| árvore | atalho | aponta para |
|---|---|---|
| `centelha-executora` | `node_modules` | `C:\Users\Neves\ClaudeCode\rpg-system\node_modules` |
| `centelha-mapa` | `node_modules` | `C:\Users\Neves\ClaudeCode\rpg-system\node_modules` |
| `centelha-mapa` | `lore\mapas\fonte` | `C:\Users\Neves\ClaudeCode\rpg-system\lore\mapas\fonte` |
| `centelha-mapa` | `lore\mapas\photoshop` | `...\rpg-system\lore\mapas\photoshop` |
| `centelha-mapa` | `lore\mapas\referencias` | `...\rpg-system\lore\mapas\referencias` |
| `centelha-mapa` | `lore\mapas\render` | `...\rpg-system\lore\mapas\render` |
| `centelha-mapa` | `lore\mapas\simbolos` | `...\rpg-system\lore\mapas\simbolos` |

A `centelha-techlead-revisora` não tem nenhum (o `node_modules` dela é pasta real, 417 MB), e o
`rpg-system` também não. **Os dados reais dos cinco atalhos do mapa moram no `rpg-system`**: o
`render`, a `fonte` e o resto são do `rpg-system/lore` (2,37 GB), e a `centelha-mapa` só aponta para
eles.

**Como se resolve.** Junction guarda caminho absoluto, e não há junction relativo (o link simbólico de
diretório pode ser relativo, mas pede modo de desenvolvedor ou administrador; fica como opção futura,
não entra neste plano). Então os seis são **desfeitos antes e refeitos depois**, nesta ordem:

1. antes de qualquer movimento, para cada um dos seis: conferir que é atalho
   (`(Get-Item -Force <caminho>).LinkType` tem de dar `Junction`; **se der vazio, PARE**, porque é pasta
   real) e desfazer com `cmd /c rmdir "<caminho>"`, **sem `/s`**. O `rmdir` sem `/s` remove só o ponto de
   reparse e recusa pasta com conteúdo, então ele não tem como descer;
2. conferir que o alvo continua inteiro (contagem de arquivos do `rpg-system\node_modules` e dos cinco
   de `lore\mapas`, tomada antes, igual depois);
3. depois de tudo movido: `cmd /c mklink /J "<novo caminho do atalho>" "<novo alvo>"`, e conferir que
   um arquivo conhecido abre pelo atalho.

**Proibido em todo o roteiro:** `Remove-Item -Recurse`, `rm -rf`, `rmdir /s`, `git worktree remove`
(é o gesto que esvaziou o `node_modules` em 24/09) e mover por copiar-e-apagar. Com os atalhos
desfeitos antes, mesmo um gesto errado não teria por onde descer.

### (b) Os registros do git

Hoje cada lado guarda o caminho absoluto do outro:

- em cada worktree, o arquivo `.git` diz `gitdir: C:/Users/Neves/ClaudeCode/rpg-system/.git/worktrees/<nome>`;
- no repositório, `rpg-system/.git/worktrees/<nome>/gitdir` diz `C:/Users/Neves/ClaudeCode/<nome>/.git`.

O resto é relativo e não quebra: a `core.hooksPath` é `scripts/hooks` (no `.git/config` e no
`config.worktree` do mapa), e o `commondir` é relativo.

**Os três gestos, e o custo de cada um:**

| gesto | serve para | custo |
|---|---|---|
| `git worktree move <velho> <novo>` | as três linkadas | conserta os dois lados sozinho, é um *rename* (instantâneo, mesmo volume), leva junto arquivo sujo e não rastreado. **Recusa a principal** ("is a main working tree", medido no ensaio) |
| mover a pasta pelo sistema + `git worktree repair` | a principal (`rpg-system`) | o *rename* é instantâneo; entre o mover e o `repair`, as linkadas ficam **quebradas** (`git status` nelas dá "not a git repository", medido). O `repair` conserta os dois lados |
| recriar (`worktree remove` + `worktree add`) | nada | **rejeitado**: perde o que não está commitado, obriga a refazer `.env` e atalhos, e o `remove` é exatamente o gesto de 24/09 |

**Trabalho não commitado durante a operação:** o *rename* leva a pasta inteira, com arquivo sujo e não
rastreado dentro. Medido no ensaio: um arquivo modificado e um não rastreado atravessaram o
`worktree move` e o `repair` com o `git status` idêntico. O risco não é perder o arquivo, é alguém rodar
git numa linkada na janela entre o passo 5 e o 6 do roteiro, por isso ninguém pode estar trabalhando.

**Uma armadilha medida:** depois de mover a principal, o `git worktree list` **parece certo** (ele lê o
lado do repositório, que ainda aponta para os caminhos novos das linkadas) enquanto as linkadas estão
quebradas. **A conferência de cada passo é o `git status` DENTRO de cada árvore**, não só o `list`.

### (c) Todo caminho escrito

Varredura de `C:/Users/Neves/ClaudeCode/<pasta de Centelha>` (barra normal ou invertida) e de
`../<pasta de Centelha>`. O histórico da caixa (`NN-revisora.md`, `progresso-*`, avisos, despachos
antigos, `plano-worktrees.md`) cita os caminhos como **registro do que aconteceu**: não se reescreve.
O que está VIVO, e precisa mudar:

**No `main` (commit do Arquiteto):**

| arquivo:linha | o que diz |
|---|---|
| `.claude/commands/arquiteto.md:24` | `cc rpg-system -papel arquiteto` |
| `.claude/commands/arquiteto.md:47` | a Executora em `C:/Users/Neves/ClaudeCode/centelha-executora` |
| `.claude/commands/arquiteto.md:52` | a Revisora em `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora` |
| `.claude/commands/arquiteto.md:87` | `cc rpg-system -papel arquiteto` |
| `.claude/commands/cartografo.md:12` | `cc rpg-system -papel cartografo` |
| `.claude/commands/cartografo.md:17` | a frente em `C:\Users\Neves\ClaudeCode\centelha-mapa` (a D9) |
| `docs/simulacao/CONTRATO-REVISORA.md:26` | "Onde está agora: `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`" |
| `docs/simulacao/CONTRATO-REVISORA.md:53` | **uma conferência**: `git rev-parse --show-toplevel  # tem de dar C:/.../centelha-techlead-revisora`. Se não mudar, a Revisora para no §0 dela |
| `docs/simulacao/PASSAGEM.md:24`, `:30` | onde a Executora e a Revisora moram |
| `docs/simulacao/PASSAGEM.md:256` | `cd C:\Users\Neves\ClaudeCode\rpg-system` (a abertura) |
| `docs/simulacao/PASSAGEM.md:353`, `:355` | o prompt de abertura, as duas árvores |
| `docs/simulacao/PASSAGEM.md:277-285` | "as pastas": nomes sem caminho, mas descreve o arranjo; ganha uma frase |
| `CLAUDE.md:97-109` | `../centelha-artes`, `cp ../rpg-system/.env .`: **continuam certos** (as árvores seguem irmãs) |

Sem caminho nenhum: `PLANO.md`, `ARQUITETO.md`, `CONTRATO-AUDITORA.md`, `aviso-cartografo-arvores.md`
(este último cita nomes, como histórico).

**Scripts: continuam valendo, sem mudança.** `scripts/rodada.mjs:47` e `scripts/duo.mjs:47` acham a
Revisora como IRMÃ (`path.resolve(RAIZ, '..', 'centelha-techlead-revisora')`), e dentro de `centelha/`
ela continua irmã. O `pre-commit` acha o `node_modules` em tempo de execução. Nenhum script, `.json`
de configuração ou workflow tem caminho absoluto nosso.

**Na branch `mapa` (é do Cartógrafo, não do Arquiteto):**

| arquivo:linha | o que diz |
|---|---|
| `lore/mapas/CARTOGRAFO.md:57` | o `render` é junção para `...\rpg-system\lore\mapas\render\` |
| `lore/mapas/CARTOGRAFO.md:137`, `:139`, `:171`, `:240`, `:468` | a frente mora em `...\centelha-mapa`, e o `cd` para subir o servidor |
| `lore/mapas/RUNBOOK.md:35-36`, `:41`, `:46` | onde tudo roda; `worktree add ../centelha-mapa`, `cp ../rpg-system/.env` (os dois relativos continuam certos) |
| `.claude/commands/arquiteto.md:34`, `:37` | a cópia VELHA do comando do Arquiteto que vive na `mapa` |
| `lore/mapas/ferramentas/tests/test_conferir_git.py:103` | string de teste; **não quebra** (é dado de entrada do teste) |
| `RELATORIO-NOITE-3.md`, `PROPOSTA-WORKTREE.md` | histórico |

O código da ferramenta do mapa (Python e JS) não tem caminho absoluto: é independente de lugar.

**Fora do git (untracked ou fora do repositório):**

| arquivo:linha | o que diz |
|---|---|
| `rpg-system/.claude/CLAUDE.local.md:5`, `:8` | "esta pasta é a do ARQUITETO (`...\rpg-system`)" e a Revisora em `...\centelha-techlead-revisora` |
| `centelha-mapa/.claude/CLAUDE.local.md:5`, `:15` | "esta pasta é a do CARTÓGRAFO (`...\centelha-mapa`)", e os atalhos para o `rpg-system` |
| memória do Arquiteto, `equipe-arquiteto-executora-revisora.md:16`, `:24` | as duas árvores |
| memória do Arquiteto, `papel-fixo-sessoes.md:17-18` e `MEMORY.md:74` | `cc rpg-system -papel ...` |
| memória da `centelha-mapa`, `equipe-arquiteto-executora-revisora.md:16`, `:18` | `rpg-system` e a Revisora |
| `~/.claude/papeis.json:4`, `:18` | `"projeto": "C:/Users/Neves/ClaudeCode/rpg-system"` (Arquiteto e **Cartógrafo**), e as chaves `c:/users/neves/claudecode/rpg-system::...` |
| perfil do PowerShell, função `cc` (`:73`, `:107`, `:170`, `:182`) | a raiz `C:\Users\Neves\ClaudeCode` e o `Join-Path` de UM nível; o autocompletar lista só o primeiro nível |
| `~/.claude/hooks/papel-fixo.mjs:20`, `:26-29` | se a pasta do papel não é filha direta da raiz, a mensagem passa a sugerir `cd "<pasta>"; claude --resume <id>` em vez de `cc`: **degrada sem quebrar** |
| `~/.claude.json`, chave `C:/Users/Neves/ClaudeCode/rpg-system` | a confiança no projeto; a pasta nova pede o diálogo de confiança uma vez |
| `C:/Users/Neves/ClaudeCode/CENTELHA-PASTAS.md` | o guia do humano; envelhece inteiro |

**E o maior, que não é arquivo nosso: o estado do Claude Code é indexado pelo CAMINHO da pasta.**
`~/.claude/projects/C--Users-Neves-ClaudeCode-rpg-system/` (793 MB) guarda os transcritos (é deles que
o `claude --resume` e o Remote Control reabrem a sessão) e a **memória** (75 arquivos). Aberta em
`...\ClaudeCode\centelha\rpg-system`, a sessão procura em `C--Users-Neves-ClaudeCode-centelha-rpg-system`,
não acha, e **nasce sem memória e sem as sessões antigas**. O mesmo para a `centelha-mapa` (a memória
do Cartógrafo mora em `C--Users-Neves-ClaudeCode-centelha-mapa`). Nada quebra calado no repositório;
quebra calado a continuidade das instâncias. O conserto é **copiar** (não mover) as duas pastas de
projeto para o nome novo, antes de abrir qualquer sessão lá.

### (d) O que fica fora do git

| o quê | onde | no movimento |
|---|---|---|
| `.env` | nas quatro árvores | vai junto no *rename*; **preservar**, nada a recriar. Conferir por hash antes e depois |
| `node_modules` real | `rpg-system` (417 MB) e `centelha-techlead-revisora` (417 MB) | vai junto; nada a reinstalar, **sem `npm install`** |
| `node_modules` atalho | executora e mapa | refeito (1a) |
| `lore/mapas/{fonte,photoshop,referencias,render,simbolos}` reais | `rpg-system` | vão junto no *rename* do `rpg-system`; **preservar**: não se copia nada disso |
| os mesmos, atalhos | `centelha-mapa` | refeitos (1a) |
| `.venv` do mapa | `centelha-mapa/lore/mapas/ferramentas/.venv` e uma cópia antiga em `rpg-system/...` | vai junto, **e quebra em parte**: os lançadores `.exe` (`pip.exe`, `uvicorn.exe`, `pytest.exe`) e o `activate` gravam o caminho absoluto do `.venv`. O `.venv/Scripts/python.exe <script>`, que é como o `CARTOGRAFO.md` manda rodar, continua funcionando. **Recriar** pelo `requirements.txt` quando o Cartógrafo precisar dos lançadores |
| `D&D/` (779 MB), `.sim/` (1,19 GB), `voz-bench-modelo/` (82 MB), `_shots/`, `.bancada/`, `.portoes/` | `rpg-system` | vão junto no *rename*, custo zero |
| `dist/`, `.astro/` | nas árvores | vão junto; se der "Duplicate id", apagar `.astro/` da própria árvore e refazer (regra do CLAUDE.md) |
| `lore/economia/` (não rastreada) | `rpg-system` | vai junto |

**Tudo está em C:, o mesmo volume, então todo movimento é *rename*, instantâneo e atômico:** ou a
pasta muda de nome inteira, ou nada muda. Se algum arquivo estiver aberto por um processo, o *rename*
falha sem mover nada. **Nada precisa ser copiado.** O que precisa ser recriado: os seis atalhos, o
`.venv` do mapa (quando precisar) e as duas pastas de projeto do Claude (cópia).

## 1b · O ensaio (feito, no scratchpad, com um repositório de brinquedo)

Repositório com uma principal, uma linkada com junction para uma pasta da principal, um arquivo
modificado e um não rastreado na linkada:

- `git worktree move` da linkada para `centelha/`: o junction foi junto intacto, o alvo ficou intacto,
  o `git status` da linkada ficou idêntico;
- `git worktree move` da principal: **recusado** ("is a main working tree");
- `Move-Item` da principal para `centelha/`: o `worktree list` parecia certo, e o `git status` na
  linkada deu "not a git repository";
- `git worktree repair <linkada>`: consertou ("repair: .git file broken" e corrigiu); status idêntico;
- o junction passou a apontar para o caminho velho; `cmd /c rmdir` tirou só o atalho, o alvo real
  ficou; `mklink /J` refez, e o arquivo abriu pelo atalho novo.

## 2 · O roteiro

**Quem para, e por quanto tempo: TODAS as instâncias do Centelha, fechadas, não ociosas.** Um processo
com a pasta como diretório de trabalho impede o *rename* no Windows. São: esta sessão do Arquiteto (a
Executora, a Revisora e a Leitora-novata morrem com ela), o Cartógrafo, o servidor do mapa (`uvicorn`),
qualquer `astro dev`/`preview`, VS Code e Explorer abertos nas pastas. **O roteiro roda de um
PowerShell comum, aberto em `C:\Users\Neves\ClaudeCode`**, fora de todas as árvores: pelo humano, ou
por um script que eu escrevo e o humano revisa e roda. Estimativa: **30 a 45 minutos de parada**,
quase todos de conferência; os movimentos são segundos. O tempo do `test-portoes.mjs` por árvore não
foi medido, e é o passo mais longo.

**Passo 0 · antes de fechar as sessões**

1. A D10 em `docs/simulacao/caixa/decisoes.md` (a mudança toca a frente do mapa), com a frase do humano.
2. Trabalho não commitado, árvore por árvore (`git status --short` em cada uma):
   - `rpg-system`: `lore/mapas/dados/camadas_referencia.json` e `lore/mapas/registro-git.jsonl`, que
     esperam a sua decisão ("descarta" ou "descarta e guarda a linha"); e `lore/economia/`, não rastreada.
     Os três vão junto no *rename* sem risco; decidir antes só deixa a árvore limpa para a conferência;
   - `centelha-mapa`: **muito trabalho em andamento do Cartógrafo** (quatro arquivos modificados em
     `lore/mapas/dados/` e cinco não rastreados, entre eles `elementos.json`, `nomes.json`, `rotas.json` e
     a pasta `gerado/`). Ele commita na `mapa`, ou faz um zip, antes de fechar. É o único risco real de
     perda, e só se alguém errar a mão;
   - `centelha-executora` e `centelha-techlead-revisora`: limpas hoje.
3. A foto de antes, gravada num arquivo fora das árvores (o scratchpad de quem roda o roteiro), para
   comparar depois:
   `git worktree list`; `git status --short` de cada árvore; o hash dos quatro `.env`; a contagem de
   arquivos do `rpg-system\node_modules` e das cinco pastas reais de `lore\mapas`; os seis atalhos com
   o alvo.
4. Fechar todas as sessões e processos acima.

**Passo 1 · a pasta mãe**: `New-Item -ItemType Directory C:\Users\Neves\ClaudeCode\centelha`.

**Passo 2 · desfazer os seis atalhos** (1a, com a conferência de `LinkType` antes de cada `rmdir`).
Conferir: as seis entradas sumiram, as contagens dos alvos são as da foto.

**Passo 3 · a Executora**: `git -C C:\Users\Neves\ClaudeCode\rpg-system worktree move
C:\Users\Neves\ClaudeCode\centelha-executora C:\Users\Neves\ClaudeCode\centelha\centelha-executora`.
Conferir: `git worktree list`; `git status --short` dentro dela igual à foto; `.env` presente com o
mesmo hash.

**Passo 4 · a Revisora e o mapa**, o mesmo gesto, um de cada vez, com a mesma conferência. O mapa é o
último dos três, porque é o que tem sujeira.

**Passo 5 · o `rpg-system`**: `Move-Item C:\Users\Neves\ClaudeCode\rpg-system
C:\Users\Neves\ClaudeCode\centelha\rpg-system`. Se falhar por arquivo em uso, **nada se moveu**: achar o
processo e repetir. Nesta janela, ninguém roda git nas linkadas.

**Passo 6 · o repair**: `git -C C:\Users\Neves\ClaudeCode\centelha\rpg-system worktree repair
..\centelha-executora ..\centelha-techlead-revisora ..\centelha-mapa` (caminhos resolvidos a partir da
pasta nova). Conferir: `git worktree list` com os quatro caminhos novos, e **`git status` dentro de cada
uma** igual à foto (a armadilha da seção 1b).

**Passo 7 · refazer os seis atalhos**, apontando para `C:\Users\Neves\ClaudeCode\centelha\rpg-system\...`.
Conferir: um arquivo conhecido de cada alvo abre pelo atalho.

**Passo 8 · os portões**: `node scripts/test-portoes.mjs` em cada uma das quatro, verde. E
`git ls-files --eol | awk ...` dando 0 (a conferência do CLAUDE.md), por garantia.

**Passo 9 · o estado do Claude Code** (antes de abrir qualquer sessão nas pastas novas):
copiar `~/.claude/projects/C--Users-Neves-ClaudeCode-rpg-system` para
`~/.claude/projects/C--Users-Neves-ClaudeCode-centelha-rpg-system`, e a do `centelha-mapa` para
`~/.claude/projects/C--Users-Neves-ClaudeCode-centelha-centelha-mapa`; atualizar o `papeis.json` (as duas chaves e os dois `"projeto"`); ajustar
a função `cc` (o perfil é do humano; seção 3). As pastas velhas de projeto ficam, como estão, até a
primeira sessão nova provar que a memória carregou.

**Passo 10 · reabrir e conferir**: abrir o Arquiteto em `centelha\rpg-system`, conferir que a memória
carregou e que a equipe nasce; a Executora e a Revisora conferem o `rev-parse --show-toplevel` delas.

**Passo 11 · os textos**: os caminhos da seção 1c, no `main` pelo Arquiteto (um commit com pathspec), e
na `mapa` pelo Cartógrafo. As memórias e os `CLAUDE.local.md`, cada papel os seus.

**Volta atrás.** Cada passo tem o gesto inverso, e o roteiro para no primeiro que não casar com a foto:

- depois do passo 3 ou 4: `git worktree move` de volta para o caminho velho;
- depois do passo 5 ou 6: `Move-Item` do `rpg-system` de volta, e `git worktree repair` com os caminhos
  em que as linkadas estiverem;
- os atalhos: `rmdir` do atalho novo e `mklink /J` com o alvo velho;
- o estado do Claude: as pastas de projeto velhas não foram tocadas (passo 9 copia), então voltar é só
  abrir no caminho velho.

Gatilhos de parar: um `LinkType` que não seja `Junction`; um `git status` diferente da foto; um `.env`
com hash diferente; um `repair` com erro; qualquer contagem de alvo que mude.

## 3 · Os apontamentos de cada papel

Os papéis de hoje: os três do `papeis.json` (Arquiteto, Cartógrafo, Defensor), os três teammates do
Arquiteto (Executora, Revisora, Leitora-novata) e a Auditora (contrato existe, não está ativa).

| papel | onde trabalha hoje | quem diz isso | o que muda |
|---|---|---|---|
| **Arquiteto** | `rpg-system` | `papeis.json:4`; `CLAUDE.local.md:5`; `PASSAGEM.md:256`; `arquiteto.md:24`, `:87` (o `cc`); a pasta de projeto do Claude | as cinco linhas, a cópia da pasta de projeto, o `cc` |
| **Executora** | `centelha-executora` | `arquiteto.md:47` (o prompt de nascimento); `PASSAGEM.md:24`, `:353`; memória `equipe-...:16` | o caminho nas quatro; ela lê do prompt de nascimento, que é a fonte |
| **Revisora** | `centelha-techlead-revisora` | `arquiteto.md:52`; `CONTRATO-REVISORA.md:26` e **`:53`, a conferência**; `PASSAGEM.md:30`, `:355`; `CLAUDE.local.md:8`; memória `equipe-...:24` | o caminho em todas; `rodada.mjs` e `duo.mjs` não mudam (irmã continua irmã) |
| **Leitora-novata** | lê o `origin/main` por git, do diretório do Arquiteto | `arquiteto.md` (o prompt dela não cita caminho) | nada além do diretório do Arquiteto |
| **Cartógrafo** | trabalha na `centelha-mapa`, mas **está registrado com o `rpg-system` como projeto** (`papeis.json:18`): a sessão abre no `rpg-system` e trabalha por caminho absoluto | `cartografo.md:12`, `:17`; `papeis.json:18`; `centelha-mapa/.claude/CLAUDE.local.md:5`, `:15`; na `mapa`: `CARTOGRAFO.md` e `RUNBOOK.md` (seção 1c); a memória em `C--...-centelha-mapa` | o `cartografo.md` do `main` pelo Arquiteto (é a D9 de novo, e vai com linha nova no `decisoes.md`); a `mapa` e o `CLAUDE.local.md` dele, por ele; os atalhos (passo 7) |
| **Auditora** | sem casa: confere de onde for chamada | `CONTRATO-AUDITORA.md` não cita caminho | nada |
| **Defensor** | `C:/Users/Neves/ClaudeCode/defensor`, outro projeto | contei as citações às nossas pastas no `defensor.md`, no `CLAUDE.md` dele e na memória dele: **zero** | **não tocar** |

## 4 · A sujeira na raiz: a regra

**Concordo com a pasta fixa, com um ajuste: uma subpasta por papel.** O nome:
**`C:\Users\Neves\ClaudeCode\centelha\tmp\<papel>\`**, e de dentro de qualquer árvore ela é
**`../tmp/<papel>/`** (`../tmp/executora/`, `../tmp/revisora/`, `../tmp/arquiteto/`, `../tmp/cartografo/`).

- **Curta e igual em toda sessão**: não depende da sessão do Arquiteto nem do scratchpad, que muda a
  cada sessão nova (o problema 3 do levantamento);
- **uma pasta por papel**, porque a Executora e a Revisora rodam `validate` e `build` na mesma rodada, e
  `../tmp/val.txt` de uma sobrescreveria o da outra em silêncio;
- **fora de toda worktree e fora do git**: não suja `git status`, e não precisa de `.gitignore`;
- **limpável**: nada dentro dela é prova. A prova vai colada no arquivo commitado (a regra que a
  Executora já segue, "prova no arquivo"). Pode ser esvaziada entre rodadas por quem é dono dela.

**O `git commit -F`:** a mensagem mora em `../tmp/<papel>/msg.txt`, e o gesto é
`git commit -F ../tmp/executora/msg.txt -- <arquivos>`. O `git commit -F -` com a mensagem pela entrada
padrão dispensaria o arquivo, mas o heredoc falha pelo gancho do RTK neste ambiente, e o arquivo é o
caminho que já funciona.

**Como cada papel aprende:**

1. **uma frase no `CLAUDE.md` do repositório**, na seção das instâncias em paralelo: "Saída temporária
   (log de build, de validate, mensagem de commit, cópia de controle negativo) vai para
   `../tmp/<papel>/`. Nunca para `../` sozinho: é a raiz de outra coisa." Todo papel lê o `CLAUDE.md` ao
   nascer, inclusive os teammates;
2. **no prompt de nascimento** da Executora e da Revisora (`arquiteto.md`), uma linha com o caminho
   dela; os teammates não leem o `CLAUDE.local.md`;
3. **no `CONTRATO-REVISORA.md` e no `cartografo.md`**, a mesma linha;
4. **uma rede mecânica, opcional**: o `test-portoes.mjs` (que já roda no `pre-commit`) passa a acusar
   arquivo solto em `centelha/` que não seja uma das quatro árvores nem `tmp/`. É o mesmo jeito da regra
   da coautoria: a regra em prosa sozinha produziu os 17 arquivos.

O `../` sozinho continua caindo em `centelha/` depois da mudança. Sem a regra, a sujeira só troca de
pasta; com a rede, ela aparece no próximo commit.

## 5 · As duas perguntas

**(a) O `.sim/`.** Movê-lo **não custa nada**: ele vai dentro do *rename* do `rpg-system`, sem cópia.
Tirá-lo é outra decisão, e é apagar. O que se perde se ele for embora:

- 28 pastas de bateria crua (a maior parte de 03 e 04/09);
- os agregados continuam no git, em `docs/simulacao/resultados/*.txt`;
- para refazer: rodar a bateria no commit antigo, com a semente do manifesto. São horas por bateria;
- nenhum documento vivo nem portão lê arquivo de lá. O `scripts/sim/agregar.mjs:170-190` nomeia cinco
  pastas de lá (`LEGADO`), mas só para a mensagem de recusa. Os documentos (`07-caminho-curto.md`,
  `09-bateria-grande.md`, `CATALOGO.md`, `REVISORA.md`) citam o comando que a recria, como histórico.

Recomendo mover junto (grátis), e decidir o apagar à parte, se o espaço fizer falta.

**(b) A `centelha-techlead` e o `backup-mapa`.**

- **`centelha-techlead`:** o que se perde é um `bash.exe.stackdump` de 08/09 (o despejo de um bash que
  caiu) e uma `.claude/` vazia. Nada do projeto. O transcrito da sessão que trabalhou nela mora em
  `~/.claude/projects/C--Users-Neves-ClaudeCode-centelha-techlead/` (10 MB), fora da pasta, e não é
  afetado. O `~/.claude.json` tem uma entrada para ela (confiança `false`), que fica órfã sem dano.
- **`backup-mapa`:** 30 dos 31 arquivos estão na `mapa`. O `camadas_referencia.json` exclusivo é o
  estado de 22/09 às 12:25, **anterior ao alinhador automático**: o comentário ainda descreve as quatro
  imagens nascendo num "retângulo-placeholder pequeno" e os rótulos como "script escrito, ainda NÃO
  RODADO", e os limites são os do placeholder. A `mapa` commitou quatro versões do arquivo depois dele
  (`939f07d` 22/09 13:05, `172c6ca` 15:56, `2a04bbd` 18:13, `0921eeb` 18:59), e a atual descreve o estado
  que substituiu aquele. **Pelo conteúdo, não importa.** Quem decide é o Cartógrafo, que fez o zip.
  O `git-diff-lore-mapas.txt` do zip é o diff do trabalho sem commit daquele instante, e o conteúdo
  dele é o dos 31 arquivos.

Os 17 arquivos soltos e o `CENTELHA-PASTAS.md` também ficam fora do desenho; ficam para a arrumação da
raiz, que é outra conversa.
