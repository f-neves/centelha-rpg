# Centelha

Sistema de RPG autoral (D6), publicado como site estático em Astro 5.
Base do GitHub Pages: `/centelha-rpg/`, então toda URL local precisa do prefixo
(`http://localhost:4321/centelha-rpg/ficha`, não `/ficha`).

## Duas instâncias em paralelo

**Outra instância do Claude Code pode estar mexendo neste repositório agora.**
O trabalho é dividido por frente (bestiário, ficha, capítulos, lore), e as duas
compartilham a mesma árvore de arquivos, o mesmo `dist/` e o mesmo `main`.

Regras de convívio:

- **NUNCA `git add -A`, `git add .` ou `git commit -a`.** Adicione só os arquivos
  que você mesmo editou, nomeados um a um. Isso já deu errado duas vezes: um commit
  de ficha levou junto arquivos do bestiário, e um commit de bestiário levou junto
  arquivos da ficha. Nos dois casos a causa foi adicionar tudo.
- **`git pull --rebase` antes de commitar e antes de dar push.** As duas empurram
  para `main`; sem rebase o push é recusado, e com rebase o conflito só aparece se
  ambas tocarem a mesma linha.
- **Prefira `Edit` a `Write`** em arquivo que você não criou nesta sessão. O `Edit`
  falha alto se o trecho mudou embaixo de você; o `Write` sobrescreve inteiro e
  apaga em silêncio o que a outra instância acabou de escrever.
- **Antes de `npm run build`, considere que a outra pode estar buildando.**
  `dist/` e `.astro/` são compartilhados; build simultâneo produz saída corrompida
  e erros fantasma de "Duplicate id". Se aparecerem, apague `.astro/` e refaça.
- Ao terminar, **diga em uma linha quais arquivos você tocou**, para a outra frente
  saber o que mudou debaixo dela.

### Onde as frentes se encostam

A divisão costuma ser: uma frente cuida de `/mesa` (o painel do mestre, o Grid de
combate, o Supabase), a outra cuida das regras (dados, ficha, capítulos). Elas
quase não se cruzam, exceto em quatro lugares:

- `src/layouts/Base.astro` e `src/styles/global.css`: as duas mexem, e é o encontro
  mais provável. Edite o mínimo e diga o que mudou.
- `src/lib/equip.ts`: contrato silencioso. A ficha escreve o formato da arma; o
  rastreador de combate da mesa lê esse formato por `armaDoSlot`. Mudar a forma do
  objeto não gera conflito no git e quebra o combate sem aviso.
- `src/data/*.json`: a frente das regras escreve, a frente da mesa lê. Renomear
  perícia, atributo ou chave muda o chão da outra.
- `src/lib/site.ts` é só da frente das regras (não há entrada de `/mesa` nele), e
  `src/lib/mesa-*.ts` é só da frente da mesa.

## O essencial do repositório

- `src/data/*.json` é a fonte da verdade das regras. Os capítulos em
  `src/content/chapters/` descrevem, não definem; quando os dois discordam, o JSON
  vence e o capítulo se corrige.
- `npm run validate` é o portão rápido: integridade referencial dos dados mais a
  regressão de personagem (`test-kael.mjs`). `npm run build` roda os dois antes do
  Astro, então build verde é garantia real, não formalidade.
- Catálogos de perícias nos capítulos são **gerados**, não escritos à mão:
  `node scripts/gen-cap-pericias.mjs` depois de mexer nos JSONs de habilidades.
- A ficha (`/ficha`) é montada por JS no cliente, em `src/lib/ficha-engine.ts`.
  Estilo de elemento criado em tempo de execução precisa de `<style is:global>`;
  `<style>` com escopo não alcança e falha calado.
- Renomear a chave de um traço quebra fichas salvas (a persistência é por slug).
  Toda renomeação precisa de entrada em `RENOMES`, em `ficha-engine.ts`.
- Para ver o site de verdade: `node .claude/skills/run-centelha-rpg/driver.mjs`
  (sobe o dev server, dirige o Edge headless, roda o smoke da ficha).

## Escrita

- Sem travessão (—) em nenhum texto: prosa, capítulo, comentário, mensagem de
  commit. No lugar, vírgula, dois-pontos, parênteses, ponto ou ponto-médio (·).
  A exceção é fala de personagem em ficção.
- Sem coautoria do Claude/Anthropic em commits ou PRs.
