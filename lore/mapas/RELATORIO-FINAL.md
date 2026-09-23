# Relatório final da empreitada autônoma (começada em 2026-09-23, noite)

Este é o arquivo de reencontro: ele é atualizado ANTES de começar cada etapa nova.
Se a energia cair, a próxima sessão começa por aqui. Tudo o que for decisão neste
relatório é **recomendação do Cartógrafo**, nunca decisão do usuário.

Pedido: Parte A (fechar o que está aberto), Parte B (o editor completo: nomes,
elementos de cartografia, exportação parcial, rotas de comércio, mapas distorcidos),
Parte C (mapa de teste do mundo, mapa de jogador e distorcido, RUNBOOK, fechamento).
Fora do escopo: folhas de símbolos novas, PSD de montagem, nomes definitivos.

**Memória no começo**: 1,8 GB livres de 16 GB (medido pelo Windows). O servidor
estava parado (derrubado pelo Claude Code por falta de memória na rodada anterior).

## Estado das etapas

| etapa | estado | commit |
|---|---|---|
| A1 áreas de verdade | já feita na rodada anterior; reavaliada aqui | `4dd2d20`, `e172ce4` |
| A2 piso x densidade | já feita na rodada anterior | `37c7571` |
| A3 regiões + cache de ilha | começando | |
| A4 vértice de área e rio | já feita na rodada anterior | `4336c16` |
| A5 pincel | já feito na rodada anterior | `ac02fc3` |
| A6 braço de delta na tela | pendente | |
| B1 camada de nomes | pendente | |
| B2 elementos de cartografia | pendente | |
| B3 exportação parcial | pendente | |
| B4 rotas de comércio | pendente | |
| B5 mapas distorcidos | pendente | |
| C1 mapa de teste do mundo | pendente | |
| C2 mapa de jogador e distorcido | pendente | |
| C3 RUNBOOK | pendente | |
| C4 fechamento deste relatório | pendente | |
| C5 servidor parado | pendente | |

## Diário por etapa

### A1, A2, A4, A5 (feitas na rodada anterior, mesma noite)

- **A1**: 22 áreas `exemplo-*` de 20 a 102 vértices pintadas pela API
  (`scripts/pintar_exemplos.py`), renderizadas nas cinco regiões e avaliadas no
  CARTOGRAFO ("Etapa C"). A franja resolve com contorno irregular. Feios ainda:
  relevo x cobertura no norte de Mére, geleira em papel de parede, colina fraca.
  Esses ajustes entram nesta empreitada (ver A1-bis abaixo, quando chegar).
- **A2**: aviso "piso" e "poucos" no renderizador; decisão: manter a contagem,
  consertar a palmeira na folha (fora do escopo: folha nova), bosque como símbolo
  futuro.
- **A4**: `V` edita vértices de área e rio; o servidor valida de novo.
- **A5**: `P` pincel, funde com a área do mesmo valor.

### A1-bis · ajustes depois da avaliação das áreas irregulares (feita)

- **Relevo manda sobre cobertura** (`Estilo.relevo_manda`, ligado só no estilo
  padrão; `noite2` e `cor` não mudam, e a imagem da noite 2 continua reproduzível
  byte a byte): onde há montanha ou alta montanha, a cobertura não põe símbolo, e a
  cor dela continua embaixo. Colina fica de fora (árvore em colina é paisagem). Teste
  com controle negativo (sem a regra, a floresta põe símbolo dentro da serra).
- **Geleira**: raio 0,80 para 1,6 e franja mais rala. White Wall caiu de 445 para 73
  símbolos de geleira; as montanhas passaram a ler.
- **Decisão minha, por quê**: são as duas propostas da rodada anterior; o pedido
  desta empreitada manda "ajuste o que precisar" e escolher a opção mais recomendada.
- **Colina fraca**: não mexi. É a arte da folha (traço claro), e folha nova está fora
  do escopo; entra na lista do que o usuário deve olhar em alta resolução.
- Imagens: `render/recorte-mere-cor-densidade-rapido.png`,
  `render/recorte-white-wall-cor-densidade-rapido.png`.

### A3 · regiões com o cache de identidade de ilha (começando)
