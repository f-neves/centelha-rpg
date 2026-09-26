# Correções do inventário externo (E01, E03, E04, E06) · despacho

Liberado pelo humano em 26/09/2026, a partir do inventário de divergências que a análise externa
das Proezas (ChatGPT desktop) levantou. Pino: `64e8c37` (o commit do módulo Fôlego, que também
veio dessa mesma análise externa). Texto do autor, colado sem edição:

## O pedido, verbatim

> Rodada de correções vindas do inventário externo das Proezas
> (docs/export/proezas/chatgpt/06-especificacao-dados.md, seção B2, tabela de divergências). Só
> estes quatro, cada um confirmado antes de corrigir e corrigido sem mudar nenhum poder:
>
> 1. E01: src/components/ArvoreTecnicas.astro:46 lê xp.tecnica.valor, que não existe em
>    regras.json:634 (o dado tem tipo flat, base 5, mult 5); a linha 120 multiplica por ele.
>    Confirmar se o custo aparece como NaN na árvore. Corrigir para usar custoTecnica(nivel), a
>    mesma função da ficha.
> 2. E03: XP dos Efeitos Especiais. Texto em src/pages/artes/efeitos.astro:31 diz 4 × nível; o
>    tooltip na linha 61 usa nivel * 2; o dado em regras.json:648 tem mult 4. Tooltip e texto
>    passam a ler do dado. Relatar se alguma ficha ou calculadora usava o ×2.
> 3. E04: src/pages/caminhos/[id].astro:17 monta a lista com length: 5, mas os níveis vão até 6.
>    Confirmar no site publicado se Técnicas de nível 6 somem da página do Caminho. Derivar a
>    quantidade de níveis do dado.
> 4. E06: o campo grid existe em artes.json:91 e efeitos.json:53, mas não está nos schemas de
>    src/content.config.ts:98 e :121. Testar se ele é descartado na leitura pela collection e se
>    o Grid (tabuleiro) recebe o campo. Se for descartado, incluir no schema.
>
> Para cada um: prova antes (o que aparece hoje) e depois, validate, tsc, build e prova no dist.
> Revisora confere. Não mexer em mais nada do inventário: o resto espera a régua.

## Conferência prévia (Arquiteto, antes de despachar)

Conferi as quatro citações antes de despachar:

| item | conferido | resultado |
|---|---|---|
| E01 | `ArvoreTecnicas.astro:45` (`perNivel = (regras as any).xp.tecnica.valor`), `regras.json` chave `xp.tecnica` | bate: `{tipo:"flat", base:5, mult:5}`, sem chave `valor`. `perNivel` fica `undefined`, e a linha ~120 (`nivel * perNivel`) vira `NaN` na soma de XP da cadeia. `custoTecnica` existe em `src/lib/calc.ts:344` (`(nivel) => custoPontos('tecnica', undefined, nivel)`), é a função certa a usar. |
| E03 | `efeitos.astro:31` (prosa "4 × o nível dele"), `:61` (tooltip `${e.nivel * 2}`), `regras.json` chave `xp.efeito` | bate: dado é `{tipo:"flat", base:0, mult:4}`, a prosa está certa e o tooltip está errado (usa `nivel * 2`, deveria ser `nivel * 4`, ou melhor, ler do dado como a prosa faz). |
| E04 | `caminhos/[id].astro:16` (`Array.from({ length: 5 }, ...)`) | bate: hardcoded em 5, mas `TIER_NOME` (`src/lib/data.ts`) tem 6 tiers (Tocado…Semideus) e o schema de Técnica permite `nivel` até 6. Toda Técnica de nível 6 fica fora do `niveis` computado e some da página do Caminho. |
| E06 | `artes.json` (bloco `grid: {elemento, cor, dadoPorNivel, danoBruto, ...}`), `efeitos.json` (bloco `grid: {forma, ancora, gatilho, ...}`), `content.config.ts` (schema de `artes` e de `efeitos`, nenhum dos dois com `grid`) | bate: campo existe no dado, ausente dos dois schemas. **Achado à parte, não pedido pelo autor:** `src/lib/artes-grid.ts:10-11` importa `artes.json`/`efeitos.json` DIRETO (`import ARTES_D from '../data/artes.json'`), não via `getCollection`, então o Grid pode já estar recebendo o campo por esse caminho e o problema ser só quem usa `getCollection('artes')`/`getCollection('efeitos')` (`loadData()`, `src/lib/data.ts`). Confirme empiricamente os dois caminhos antes de decidir o que precisa do schema. |

## Atenção especial da Executora

- **Escopo é só estes 4 itens.** O resto da tabela B2 do inventário espera a régua (a recalibração
  de custo/nível de Técnicas e Artes, pendência D6). Não corrija nem toque em nenhum outro item
  dessa tabela, mesmo que pareça óbvio ou barato.
- **"Corrigido sem mudar nenhum poder"**: nenhum destes 4 itens deve mudar quanto XP um jogador
  paga por Técnica/Efeito, quanto poder um Caminho concede, nem o que o Grid desenha. São
  correções de exibição/leitura que devem fazer o site mostrar o número/campo que o dado JÁ TEM,
  não introduzir um número novo.
- **E01 e E03 são a mesma família de bug**: uma UI lendo uma chave de `regras.json` que não existe
  (`.valor`) ou reimplementando a conta com um número errado (`* 2`) em vez de chamar a função de
  `calc.ts` ou ler o `mult`/`base` do próprio dado. Prefira reusar a função/leitura que já existe
  em vez de escrever a conta de novo no `.astro`, para não abrir um terceiro lugar que possa
  divergir de novo no futuro.
- **E04**: derive a quantidade de níveis de algo vivo (o maior `nivel` das Técnicas do Caminho, ou
  o tamanho de `TIER_NOME`), não troque `5` por `6` hardcoded: essa foi exatamente a categoria de
  erro que causou o bug.
- **E06**: se o achado à parte (Grid já lendo direto do JSON, sem passar pela collection) se
  confirmar, ainda pode valer incluir `grid` no schema por consistência (outros lugares podem vir
  a usar `getCollection` no futuro), mas relate os DOIS fatos separados: (a) o schema descarta o
  campo hoje, e (b) o Grid publicado recebe ou não recebe o campo na prática. Não são a mesma
  pergunta.
- **Prova antes/depois por item**: para E01 e E03, screenshot ou trecho de HTML do `dist/` mostrando
  o número errado (antes) e certo (depois). Para E04, a lista de Técnicas nível 6 que sumiam e a
  prova de que aparecem agora. Para E06, a prova de que o Grid recebe o campo (ou já recebia).

## Verificação

- `npm run validate`, `npx tsc --noEmit` e `npm run build` verdes.
- Prova no `dist/`, por item, como descrito acima.
- Travessão: zero nas linhas novas.
- Os três caminhos sujos conhecidos continuam intactos.

## O relato

`docs/simulacao/caixa/inventario-e01-e06-executora.md` (ou continuação de outro arquivo da
rodada, como preferir). Ao fim: arquivos tocados, prova antes/depois de cada um dos 4 itens, e
se alguma ficha ou calculadora usava o `×2` do E03 (para o autor saber se afeta personagem já
salvo).
