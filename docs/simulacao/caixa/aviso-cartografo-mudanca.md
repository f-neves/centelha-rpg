# Aviso ao Cartógrafo · a mudança das árvores para ClaudeCode/centelha/

Escrito pelo Arquiteto em 25/09/2026, pela D10 do `decisoes.md` (`f679437`). O plano inteiro está em
`docs/simulacao/caixa/plano-pasta-centelha.md`.

## O que vai acontecer

As quatro árvores passam para dentro de `C:\Users\Neves\ClaudeCode\centelha\`. A sua fica em
**`C:\Users\Neves\ClaudeCode\centelha\centelha-mapa`**, na mesma branch `mapa`. Quem move é o humano,
por um script, com **todas** as sessões fechadas, a sua inclusive, e o servidor do mapa (`uvicorn`)
parado.

## O que você faz ANTES, e nada se move sem isto

1. **Commite na branch `mapa` todo o trabalho em andamento.** Na foto de hoje, a sua árvore tem:
   - modificados: `lore/mapas/dados/camadas_referencia.json`, `lore/mapas/dados/camadas_travadas.json`,
     `lore/mapas/dados/rios.json`, `lore/mapas/registro-git.jsonl`;
   - não rastreados: `lore/mapas/dados/elementos.json`, `lore/mapas/dados/exportacoes.jsonl`,
     `lore/mapas/dados/gerado/`, `lore/mapas/dados/nomes.json`, `lore/mapas/dados/rotas.json`.
   **Zip não vale**, por decisão do humano: o que está na branch atravessa, o que está em zip depende de
   alguém lembrar. Se houver coisa que você não quer commitar ainda, diga o quê e por quê, e o humano
   decide caso a caso.
2. **Confirme por escrito** em `docs/simulacao/caixa/cartografo-confirma-mudanca.md`, na sua branch:
   o sha do commit, o `git status --short` depois dele (vazio, ou com a lista do que ficou de fora e o
   porquê), e a frase "pode mover". Avise o humano na sua janela.
3. Pare o servidor do mapa e feche a sessão quando o humano pedir.

## O que muda para você depois

- **Os atalhos.** Os seis junctions da sua árvore (`node_modules` e `lore/mapas/{fonte,photoshop,
  referencias,render,simbolos}`) são desfeitos antes do movimento, com `cmd /c rmdir` depois de
  conferir que são atalho, e refeitos depois, apontando para `...\centelha\rpg-system\...`. Os dados
  reais continuam no `rpg-system` e não são copiados.
- **O `.venv` quebra em parte.** Os lançadores `.exe` (`pip.exe`, `uvicorn.exe`, `pytest.exe` e os
  outros) e os scripts `activate` guardam o caminho absoluto antigo e deixam de funcionar. O
  `.venv\Scripts\python.exe` continua funcionando, então `python.exe -m uvicorn ...`, `python.exe -m
  pytest` e `python.exe scripts\...` rodam. **Quando precisar dos lançadores, recrie o `.venv` pelo
  `requirements.txt`** (`python -m venv .venv` e `.venv\Scripts\python.exe -m pip install -r
  requirements.txt`, na pasta `ferramentas`).
- **Os textos da sua branch que citam caminho** são seus: `lore/mapas/CARTOGRAFO.md` (`:57`, `:137`,
  `:139`, `:171`, `:240`, `:468`), `lore/mapas/RUNBOOK.md` (`:35-36`), e a cópia velha de
  `.claude/commands/arquiteto.md` que mora na `mapa`. O `.claude/commands/cartografo.md` do `main` o
  Arquiteto corrige agora (é a D9 de novo, coberta pela D10). O seu `.claude/CLAUDE.local.md` (`:5`,
  `:15`) é seu.
- **A sua memória** mora em `~/.claude/projects/C--Users-Neves-ClaudeCode-centelha-mapa/`, e o humano a
  copia para `C--Users-Neves-ClaudeCode-centelha-centelha-mapa`. Se a sua sessão abrir na pasta nova e
  não achar a memória, diga ao humano antes de trabalhar.
- **O comando para reabrir** passa a ser `cc centelha\rpg-system -papel cartografo` (o registro do
  `papeis.json` é atualizado pelo script).
- **Saída temporária**, depois da mudança: `..\tmp\cartografo\` (a regra entra depois, junto com a
  limpeza da raiz).
