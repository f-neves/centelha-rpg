---
description: Abre a frente do mapa de Uldun (lore/mapas) e carrega o contexto central antes de qualquer tarefa
---

Você está entrando na frente do **mapa de Uldun** (`lore/mapas/`). Antes de fazer
qualquer coisa nesta frente, carregue o contexto na ordem abaixo.

## 1. Leia sempre

1. `lore/mapas/CARTOGRAFO.md` — documento central: **Estado atual** (primeira seção),
   objetivo, regras invioláveis, estrutura de pastas, sistema de coordenadas,
   decisões tomadas, achados técnicos e decisões em aberto. Todas as regras e o
   estado do projeto vêm SEMPRE daqui, nunca copiados neste comando.
2. `lore/mapas/dados/coordenadas.json` — constantes e fórmulas do sistema de
   coordenadas.
3. `lore/mapas/dados/lugares.json` — lugares já marcados.
4. `lore/mapas/dados/massas.geojson`, se existir — identidade estável das ilhas
   relevantes.

## 2. Leia só se a tarefa pedir

- `lore/mapas/ESPEC-dados.md` — só quando a tarefa envolver o esquema de dados
  (lugares, rios, estradas, regiões, massas, áreas pintadas).
- `lore/mapas/ESPEC-ferramenta.md` — só quando a tarefa envolver a ferramenta de
  pintura (arquitetura, camadas, ferramentas do editor, etapas de construção).

Se algum arquivo desta lista ou da lista acima não existir ainda, siga sem ele — nem
todo estado do projeto tem todos os documentos.

## 3. Regras invioláveis

Não estão copiadas aqui de propósito. **Leia a seção "Regras invioláveis" do
`CARTOGRAFO.md` e siga exatamente o que estiver escrito lá** — copiar as regras para
este comando criaria duas fontes que podem divergir na próxima edição de qualquer
uma delas. Se a seção não existir mais com esse título, pare e diga isso ao usuário
em vez de improvisar regras.

## 4. Depois de ler

Não comece a trabalhar sozinho. Mostre primeiro a seção **Estado atual** do
CARTOGRAFO.md (etapa, pendências, próximo passo), depois pergunte o que fazer nesta
sessão — a menos que o usuário já tenha mandado a tarefa junto com o `/cartografo` na
mesma mensagem, caso em que você já resolve a tarefa direto, respeitando as regras
invioláveis lidas no passo 3.

## 5. Ao encerrar a sessão

Antes de parar de trabalhar nesta frente, atualize a seção **Estado atual** do
`CARTOGRAFO.md` (etapa, pendências, próximo passo, data) para a próxima sessão poder
retomar sem reconstruir contexto.
