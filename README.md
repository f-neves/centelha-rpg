# Centelha — site 

Site estático de regras do **Centelha**, em **Astro**, publicado no **GitHub Pages**
em `https://f-neves.github.io/centelha-rpg/`.

100% estático, sem backend e sem nenhuma chave de API. Conteúdo pré-renderizado (bom para SEO e
para a busca do Pagefind); a interatividade — ficha, rolador, árvore de Técnicas, filtros, busca,
glossário e marcadores — vem como ilhas de JS leve.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321/centelha-rpg/
npm run build      # gera dist/ + índice do Pagefind
npm run preview    # serve o dist/ como em produção
```

> O build **falha de propósito** se um dado estiver inconsistente: `prereq` apontando para uma
> Técnica inexistente, `id` duplicado, ou campo obrigatório faltando (validação via Astro Content
> Collections + `zod`, com `reference()` checando os vínculos entre coleções).

## Fluxo dos dados (fonte única)

Toda a mecânica vive em **`src/data/*.json`** — é a **única** fonte de verdade. O site de leitura
**e** a ficha leem desses arquivos; nada de número ou regra hardcoded em componente.

```
src/data/
  atributos.json   habilidades.json  virtudes.json
  caminhos.json    tecnicas.json     artes.json
  glossario.json   regras.json        ← XP, fórmulas dos derivados, tabelas
```

- **`src/content.config.ts`** define as coleções (loader `file()`), os esquemas `zod` e as
  referências (`reference()`), que viram o portão de validação do build.
- **`src/lib/calc.ts`** lê `regras.json` e implementa os derivados (PV, Defesa, Defesa Mental,
  Energia, Mana, Iniciativa) e os custos de XP. Regressão de referência — **Kael**: 375 XP ·
  PV 34 · Defesa 10 · Energia 16 · Mana 7 · Iniciativa 1d6+5 (botão *Carregar Kael* na ficha).
- **`src/lib/data.ts`** monta os mapas e agrupamentos usados pelas páginas.

### Como adicionar uma Técnica

1. Acrescente um objeto em `src/data/tecnicas.json`:

   ```json
   {
     "id": "novo-golpe",
     "nome": "Novo Golpe",
     "caminho": "punho-de-ferro",
     "atributo": "forca",
     "banda": 2,
     "tipo": "ativa",
     "custo": { "energia": 2 },
     "prereq": ["golpe-pesado"],
     "aliases": [],
     "texto": "Descrição do efeito (markdown simples; **negrito** funciona).",
     "pendente": false
   }
   ```
2. `id` em kebab-case e único; `caminho`/`atributo`/`prereq` precisam existir (senão o build falha).
3. `npm run build` valida tudo. A Técnica aparece sozinha na página do Caminho, na árvore, nos
   filtros, na busca e na ficha.

> Prosa provisória: marque `"pendente": true` e registre em [`REVISAR.md`](./REVISAR.md). Ela
> ganha o selo **“Rascunho — revisar”** no site.

## Publicação

`.github/workflows/deploy.yml` faz `npm ci && npm run build` e publica `dist/` no GitHub Pages a
cada push na `main`. O `base` é `/centelha-rpg/` (configurado em `astro.config.mjs`); todos os
links internos passam por ele.

## Legado (impressão)

O pipeline antigo de PDF (Paged.js + Edge headless) e os documentos-fonte ficam em **`legacy/`**.
Os JSON canônicos foram gerados uma única vez por `legacy/migrate-to-json.mjs` a partir do
`build_livro.mjs` e dos `.md`; daí em diante os JSON em `src/data/` são a fonte editável.
Para regerar os JSON do zero: `npm run data`.
