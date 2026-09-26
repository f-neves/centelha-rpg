# B14 fase 1 · Executora · a ficha de criatura num arquivo só, sem mudar número publicado

- **Pedido:** mensagem do Arquiteto de 26/09/2026 (B14 fase 1). Contexto em `docs/pendencias/B-bestiario.md` (B14).
- **Árvore:** branch `executora`, posta em `d884b4a` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** `progresso-b14.md`.
- **Publicado:** num commit só, com este relato.

## A prova byte a byte

Os três JSON gerados, antes (no `d884b4a`) e depois (lidos da pasta nova), pelo `sha256sum`:

| arquivo | antes | depois |
|---|---|---|
| `src/data/inimigos.json` | `6a51b18cdeb9f7a9f345a76d7a680908dcf7727d25c99eae04e74e5a84a68c84` | `6a51b18cdeb9f7a9f345a76d7a680908dcf7727d25c99eae04e74e5a84a68c84` |
| `src/data/monsters.json` | `829821eaa13b2e081be7f63a3eea1a7569651d0986850414015fe60c2a8fc338` | `829821eaa13b2e081be7f63a3eea1a7569651d0986850414015fe60c2a8fc338` |
| `src/data/monsters-mesa.json` | `e03a5d9e759f9fae1e0c4d0cc2d838fb1758580adf290748287119907982bec1` | `e03a5d9e759f9fae1e0c4d0cc2d838fb1758580adf290748287119907982bec1` |

- **As cópias de antes** foram guardadas em `../tmp/executora/b14/` antes de qualquer mudança.
- **O `cmp` dos três contra elas deu igual** em três momentos: depois do gerador novo, depois de
  apagar os satélites e depois do último `build`.
- **Antes de mexer**, conferi que o gerador antigo reproduzia os arquivos commitados:
  `gen-bestiario --check` verde, e `gen-monsters` com `cmp` igual.
- **O `gen-bestiario.mjs --check` continua no `validate` e no `build`**, agora contra a pasta.

**A segunda prova é do próprio migrador.** O `migrar-bestiario.mjs` calcula o stat block de cada
ficha nova pela mesma conta do gerador. Depois compara, campo a campo, com o objeto do
`inimigos.json` do `d884b4a`, e para sem escrever nada se algum divergir. Saída:

```
conferidas 309 fichas em src/data/bestiario/ · stat block igual ao do d884b4a nas 309
  a pasta é, byte a byte, a que a migração escreve
```

## O que foi feito, pelas seis tarefas

1. **Esquema:** `scripts/criatura-schema.mjs`, em zod, no molde do `ficha-schema.mjs`.
   - Diferença do molde: `.strict()` em todo objeto, porque a ficha de criatura é escrita à mão e
     `willpowr` passaria calado.
   - `conjuntos` e `equip` reusam os esquemas da ficha do jogador.
   - A validação roda no `validate-data.mjs`, num bloco novo. Ele confere:
     - o esquema;
     - que o id bate com o nome do arquivo;
     - `ordem` sem repetição;
     - as perícias de `skills` e `skills2` contra o catálogo;
     - o atributo e a perícia de cada ataque;
     - Arte, Técnica, Caminho de poder e armadura contra os catálogos;
     - o material;
     - o vocabulário de fraqueza e resistência;
     - a concordância com a semente (ver o item 5).
   - **Controle negativo:** `willpowr`, `atiradr`, `courro` e uma fraqueza a mais no aboleth foram
     acusados um a um. Os arquivos voltaram ao original, conferido por `cmp`.
2. **Materializar o derivado do desafio:**
   - Briga, Esquiva, Prontidão e Integridade estão escritas em `skills`.
   - O `papel` (o antigo `tipo`) e a Vontade (`willpower`) também estão escritos.
   - A Aparência e as Virtudes, que o `gen-monsters.mjs` somava pelo desafio, estão escritas em
     `aparencia` e `virtues`.
   - **Nenhuma linha dos dois geradores nem do `lib-bestiario.mjs` lê `ameaca`/`ameacaLegada` para
     montar a ficha.** O `ameacaLegada` só é copiado para o `ameaca` da saída.
3. **Migrador:** `scripts/migrar-bestiario.mjs`. **Ele lê tudo do git, no `d884b4a`:**
   - o `gen-bestiario.mjs` antigo, cujo trecho que monta as builds roda como estava, com o `stat()`
     trocado por "devolva a build";
   - o HTML, os satélites e o `monsters.json`.
   - Por ler do git, continua reproduzível depois de as fontes terem sido apagadas.
   - `--check` confere sem escrever. Ele não está no `validate`, de propósito: ficha editada à mão
     depois de hoje vai divergir da migração, e isso é o esperado.
4. **Os geradores lendo a pasta:**
   - A conta do stat block saiu do `gen-bestiario.mjs` para `scripts/lib-bestiario.mjs`, igual ao
     que era, com duas trocas: o porte vem do rótulo da ficha em vez do mapa por id, e a couraça de
     porte aceita a substituição da ficha.
   - O `gen-monsters.mjs` passou a tomar o card da ficha, e não de seis satélites. Saíram dele as
     tabelas de categoria, descrição, Aparência e Virtudes, que agora estão escritas.
5. **Satélites e fontes antigas:** ver a tabela abaixo.
6. **Documentação:** `docs/bestiario/ficha-criatura.md`. Tem cada campo, o que ele alimenta e o que
   é padrão por categoria, com onde a tabela mora.

## Satélites e fontes: quem lê cada um

Procurei em código (`.mjs`, `.ts`, `.astro`, `.js`, `.json`, `.yml`, `.html`) no repositório
inteiro, fora `dist/`, `node_modules/`, `.git/` e `legacy/`. Menção em `.md` não conta como leitor,
e menção em comentário também não. Um exemplo: o `gen-deslocamento.mjs` citava `ecologia` e
`dimensoes` só em comentário, e o comentário foi atualizado.

**Apagados, sem leitor depois da migração:**

| arquivo | quem lia |
|---|---|
| `habilidades-bestiario.json` | só `gen-monsters.mjs` |
| `lore-bestiario.json` | só `gen-monsters.mjs` |
| `ecologia-bestiario.json` | só `gen-monsters.mjs` |
| `categoria-extra.json` | só `gen-monsters.mjs` |
| `dimensoes-bestiario.json` | `gen-bestiario.mjs` e `gen-monsters.mjs`; o `regras.json` só o citava na nota da couraça, e a nota foi atualizada |
| `imagens-bestiario.json` | `gen-monsters.mjs`, e o `converter-imagens.mjs` o escrevia. O conversor passou a gravar o `imagem` direto nas fichas |
| `conversao-extra.json` | só `gen-bestiario.mjs`. Os valores crus das 171 viajam em `fonte.valores` de cada ficha |

**Ficaram:**

| arquivo | por quê |
|---|---|
| `conversao-monstros.html` | `scripts/shot-conv.mjs` o abre, e ele é uma página de ferramenta (a tabela de conversão D&D→Centelha). Deixou de ser fonte: editar o `DATA` dele não muda mais criatura nenhuma. O `docs/MAPA.md` foi atualizado |
| `elementos-bestiario.json` | é a saída do `gen-elementos.mjs`, que está no `validate` com `--check`, e o `validate-data.mjs` o lê. As fraquezas também estão escritas na ficha, e o bloco novo do `validate-data.mjs` exige que as duas concordem |
| `deslocamento-bestiario.json` | é a saída do `gen-deslocamento.mjs` (`--check` no `validate`), e o `test-deslocamento.mjs` o compara com o `monsters.json`. O passo também está na ficha, e o teste que já existia é quem cobra que concordem |
| `inimigos-custom.json` | é a caixa de entrada do botão "copiar JSON" do editor do /bestiario, que ainda entrega o formato antigo. Também o leem o `validate-data.mjs`, o `test-editor-bestiario.mjs` e o `gen-elementos.mjs`. O espantalho de exemplo virou ficha e a caixa ficou `[]`. O `lib-bestiario.mjs` converte o que for colado nela numa ficha, na leitura |

## Campos cujo significado ficou ambíguo na migração

1. **Duas categorias e duas descrições.**
   - O `inimigos.json` sempre trouxe a categoria crua da conversão ("Fera", "Monstro", "Humano"),
     e o card sempre trouxe a do Bestiary 1 ("Animal", "Construto", "Humanoide").
   - `categoria` ficou com a do card. `categoriaLegada` guarda a outra nas 161 fichas em que ela
     difere.
   - **A de legado não é só rótulo:** a Furtividade da tabela soma pela categoria, e é por ela.
   - O mesmo vale para a descrição, com `descricaoLegada` em 49 fichas.
   - Unificar muda o `inimigos.json` e a Furtividade de algumas criaturas, e fica para decidir.
2. **`locomocao` não existia por modo.**
   - O dado era um passo só por criatura (as três velocidades da mesa saem dele). Quando o bicho
     não anda, o passo era o de voo ou de nado, dito na nota da semeadura.
   - Migrei **um modo por ficha**: `voo` ou `natacao` quando a nota começa por "voo"/"nado",
     `terra` no resto.
   - A regra de qual modo a peça usa é minha: `terra`, senão o maior dos outros. Ela respeita o
     comentário da semeadura: o gênio e o anjo caminham, e o falcão voa.
   - Os modos secundários do material de origem ("nado 30", "escalada 20") estavam só em
     comentário e não foram migrados. O passo continua sendo semeado pelo `gen-deslocamento.mjs`.
3. **Fraquezas e deslocamento têm duas casas: a ficha e a semente.** Fica para decidir se as
   sementes se aposentam. Até lá, o `validate` para se as duas divergirem.
4. **`skills` da ficha não é o `pericias` do `inimigos.json`.**
   - O primeiro é o que a criatura TEM, e entra na conta.
   - O segundo é a conta invertida dos derivados, com a Furtividade pela tabela.
   - Caso concreto: o espantalho declara `furtividade: 4`, e a conta nunca leu esse valor. Ele sai
     com o número da tabela, hoje e antes.
   - O ataque dele usa a perícia `armas`, que ele não tem, e por isso a parada conta 0 de perícia.
     Isto também é de antes.
5. **Perícias com nome antigo.**
   - `armas-uma-mao`, `armas-duas-maos`, `escudos` e `tatica` (dos 15 NPCs escritos à mão) ficaram
     como estavam, porque renomear não muda número mas é decisão de conteúdo.
   - O esquema aceita só essas, pela lista `PERICIAS_LEGADAS`, que já diz o destino provável:
     `armas`, `armas`, `bloqueio` e `estrategia`.
6. **`spec`.**
   - As criaturas tinham `especialidades` numéricas (`{esquiva, social}`, que somam na Defesa).
     Nenhuma das 309 usava.
   - Não sei se a `spec` da ficha do jogador tem a mesma forma: a do Kael é `{}`.
   - O esquema aceita número, e o gerador lê como antes. Nada é afetado hoje.
7. **`equip` e `conjuntos` no NPC humano.**
   - A armadura dos 11 NPCs de armadura foi para `equip.armaduras`, na forma de texto (o modelo
     antigo da ficha, que continua válido), e só a primeira conta.
   - As armas continuaram em `ataques`. Passá-las para `conjuntos` mudaria as paradas.
   - `conjuntos` existe no esquema e está vazio.
8. **`tech` e não `tecnicas`.** O pedido listava `arte`, e não a lista de Técnicas. Usei o `tech` da
   ficha do jogador (`{id: true}`), que é o nome que a ficha grava.
9. **Campos que não estavam na lista do pedido:**
   - `ordem`: a posição no `inimigos.json`, sem a qual o byte a byte não fecha;
   - `pendente`;
   - `couraca`: só o roc, o antigo `COURACA_OVERRIDE`;
   - em `fonte`, além de livro/cr/tipo/tamanho, entraram `nome`, `valores` (os seis valores crus),
     `pericias`, `nota`, `exemplo` e `deslocamento` (`ft`, `origem` e `nota` da semeadura).
10. **O ajuste à mão do objeto animado (`HAND_OVERRIDE`) substituía a Absorção.** Virou
    `bonus.absorcao_impacto 1`, `absorcao_corte 3` e `absorcao_perfuracao 3`, que somam e ficam
    visíveis.
    - A Defesa Mental "-" já saía da Inteligência 0.
    - A Percepção 2 foi escrita em `attrs`.
    - A soma dá o mesmo número de antes, provado pelo `cmp`.
11. **O padrão por tipo para criatura nova.** A criatura que chega pela caixa sem declarar
    Aparência e Virtudes recebe o padrão por `ecologia.tipo`, **sem** o degrau pelo desafio. Nas
    309 da migração nada muda, porque o valor está escrito. Para criatura nova da caixa, o degrau
    sumiu, e é intencional (o desafio vai ser recalibrado).
12. **`material` do espantalho.** As fraquezas e resistências que ele dava estão escritas na ficha,
    e o que está escrito vence, como vencia antes. O `material` ficou como descrição. O
    `gen-elementos.mjs` passou a reconhecer como "sua" a ficha que declara material, para não semear
    por cima.

13. **O passo da criatura da caixa (achado depois do `6b7d2a7`, consertado no commit seguinte).**
    - A criatura colada no `inimigos-custom.json` sem `deslocamento` não tem `locomocao`. No
      `6b7d2a7` ela caía no passo do soldado (3 · 5 · 7), enquanto a semente dava o da tabela
      (um Animal Grande anda 4 · 6 · 9). O `test-deslocamento` acusaria a diferença.
    - Antes do B14, ela tomava o passo da semente. O `gen-monsters.mjs` voltou a fazer isso só
      para ficha sem `locomocao`, o que hoje quer dizer só a caixa.
    - Prova: um urso de teste na caixa, regerado na ordem de sempre, saiu 4 · 6 · 9 e o teste
      ficou verde. Depois os arquivos voltaram, e os três JSON seguem iguais por `cmp`.

## Fora da conta, mas no mesmo commit

- **`regras.json`, nota da couraça de porte:** "Porte lido de `dimensoes-bestiario.json`" virou
  "Porte lido do campo porte da ficha de criatura (`src/data/bestiario/<id>.json`)". Na mesma linha,
  o travessão virou dois-pontos.
  - A nota aparece em `/mesa/referencia`, e esse é o único texto do site que muda. Conferido no
    `dist/mesa/referencia/index.html`.
- **`Bestiario_Centelha.md`:** um aviso datado no topo, dizendo que a fonte da Centelha mudou de
  lugar.
- **Citações:** o `reapontar.mjs` moveu 4. As 3 que apontavam `COURACA` e `const ini` no
  `gen-bestiario.mjs` eu reescrevi à mão para o `lib-bestiario.mjs:44-45`, `:68` e `:44`, porque o
  mapa do diff não segue código que troca de arquivo. Estão em
  `docs/pendencias/L-simulacao-simultaneo.md:68`, `:789` e `:812`. A quarta foi
  `docs/simulacao/REVISORA.md:1196`, pelo mapa.

## Verificação

- `npm run validate` e `npm run build` verdes.
- `test-editor-bestiario.mjs` (smoke, fora do `validate`) verde, com o espantalho vindo da pasta.
- Fim de linha: LF nos arquivos novos.
- Travessão: zero nas linhas acrescentadas (`rtk proxy git diff`).

## PRECISA DE MIM

Nada para esta fase. Três decisões ficam abertas para a próxima:

- unificar categoria e descrição (item 1 acima);
- aposentar as sementes de fraqueza e deslocamento (item 3);
- renomear as perícias antigas (item 5).

## QUEBROU

Nada.

## BLOQUEADO

Nada.
