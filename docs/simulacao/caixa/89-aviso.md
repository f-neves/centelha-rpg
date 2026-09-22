# Rodada 89 · aviso de revisão · catálogo de itens (envelope aninhado)

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `7b25211` · último ponto que você deu PROCEDE (veredito da rodada 88) |
| **SHA do trabalho** | `f7ff757` · a faixa é `7b25211..f7ff757` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `f7ff757`, conferido por `git rev-parse origin/main` ao escrever |

**O que NÃO está nesta faixa, e não deve ser revisado:** `lore/mapas/` inteiro e os arquivos de
comando/skill do Cartógrafo (frente paralela, árvore própria). `889bea1` também está fora da faixa
(já revisado na rodada 88).

## O que esta faixa faz

Fecha o catálogo de itens inteiro: a auditoria de equipamento/preços (§1-§9 de
`docs/simulacao/caixa/leitura-de-novato-revisora.md`, que você mesma escreveu) mais as decisões
que vieram dela (`leitura-de-novato-decisoes.md`, §5 e §13). Cinco commits, nesta ordem:

1. **`a492010`** · fecha as decisões em prosa: envelope aninhado (escolha do humano, registrada
   com o exemplo em `§1`/`§5`), munição com `tipo` próprio, os 12 CORRIGE da auditoria resolvidos
   em texto.
2. **`cd4bef2`** · schema Zod (`content.config.ts` e o duplicado de `scripts/validate-data.mjs`,
   que estava desatualizado) no envelope aninhado; `armas.json`/`armaduras.json`/`escudos.json`
   migrados preservando todo dado existente; `municao.json` novo (Flechas/Virotes, bloco
   `municao.aceita` amarrando com ids de arco/besta).
3. **`0c04e9f`** · migração dos consumidores: `equip.ts` ganha `achata()` (ficha/mesa continuam
   lendo formato plano por baixo), `bestia-editor.ts` para de importar `armaduras.json` direto e
   passa a usar `equip.ts`, `BestiaEditor.astro`/`bestiario.astro`/`equipamentos.astro` migrados,
   quatorze scripts via `scripts/lib-equip.mjs` novo. `vsProjetilRapido` substitui `habilProjetil`
   em 6 pontos (a auditoria original contou 4, faltava o selo da ficha e a nota do card de
   combate). Controle negativo: `inimigos.json` gerado ficou byte-a-byte igual antes e depois.
4. **`7c6ff2d`** · as sete armas que a auditoria só tinha preço, sem stat block (Machadinha,
   Machado Pesado, Martelo, Bastão, Lança Longa, Sabre, Maça Estrela): dado/acerto/defesa/ticks/
   tipo de dano desenhados pelo humano seguindo os moldes já existentes por classe, registrados em
   `leitura-de-novato-decisoes.md` §13. Peso é estimativa da Executora por comparação com arma de
   classe/mãos equivalente, não veio da decisão original.
5. **`484c33f`** · a tabela de `custo-de-servico-e-itens.md` vira gerada
   (`scripts/gen-cap-itens.mjs`, mesmo padrão de `gen-cap-pericias.mjs`, entra no
   `npm run validate` com `--check`). Isso resolve o `CORRIGE 11` sozinho ("Super-pesada" não
   existe mais no schema nem aparece mais na tabela gerada). No processo, achou e corrigiu três
   preços órfãos de uma rodada anterior (Machado 30pp, Lança 5pp, Alabarda 28pp, todos já
   confirmados como "não órfã" na §8 mas sem o campo `preco` aplicado de fato).

`f7ff757` é só o registro em prosa dessas duas últimas partes no documento de decisões; não muda
`src/`.

## O que eu mais quero que você aperte

- **O envelope aninhado bate com o que `leitura-de-novato-revisora.md` cobrou?** Você é quem
  escreveu a auditoria original; confira se os 12 CORRIGE (preços, `penalidade` como módulo
  positivo, munição com tipo próprio, `vsProjetilRapido`, as cinco armaduras órfãs da §5) foram
  todos endereçados, e se algum ficou só parcialmente resolvido.
- **A migração de `equip.ts`/`bestia-editor.ts` não quebrou Absorção/dano em silêncio.** Isto é
  exatamente o risco que ficou registrado antes de o humano escolher aninhado contra minha
  recomendação técnica: campo lido flat/na raiz de um item agora aninhado vira `undefined?.campo`
  → `nz()` → 0, sem erro. O controle negativo (`inimigos.json` byte-a-byte igual) cobre o
  bestiário; confira se cobre também o caminho da ficha de jogador (equipar arma/armadura/escudo
  na `/ficha`, ver se Defesa e dano batem com antes).
- **`gen-cap-itens.mjs`**: confira que itens sem `preco` decidido realmente somem da tabela do
  capítulo (em vez de aparecer com valor errado ou "a definir" fantasma), e que "Super-pesada" de
  fato não sobrou em lugar nenhum da prosa gerada.
- **Os pesos estimados das sete armas novas** (`7c6ff2d`): não são número de simulação nem decisão
  do humano, são estimativa da Executora. Julgue se as comparações de classe/mãos que ela usou são
  razoáveis, não se o peso exato está "certo" (não há gabarito).

## O de sempre

Veredito em `docs/simulacao/caixa/89-revisora.md`, commitado por você com pathspec e empurrado
antes de avisar. Me diga o sha e o `git rev-list --count origin/main..HEAD`. Progresso incremental
em `progresso-revisora-89.md`, uma linha por etapa, hora lida da máquina no instante em que fecha.

**Uma árvore suja que não é sua nem minha:** `docs/simulacao/caixa/jogador-novo-bestiario.md`, não
rastreado, de uma sessão fora do arranjo. Não encoste.
