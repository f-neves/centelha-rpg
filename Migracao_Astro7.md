# Subir para o Astro 7, e sair do GitHub Pages

Plano de migração. Escrito em 14 de agosto de 2026, depois de uma caixa de tempo
que testou o Astro 7 numa árvore separada (o registro daquele teste está em
`Auditoria_Tecnica.md`, seção 8.1).

**As duas mudanças estão amarradas**, e é por isso que este documento trata das
duas. Sair do GitHub Pages muda o que o Astro 7 vale: metade do que ele traz
serve a hospedagem com servidor, e no Pages não servia a nada.

---

## 0. A resposta curta

| | |
|---|---|
| **Dá para subir?** | Sim. O Astro 7 constrói este projeto e o site construído funciona. Testado. |
| **Quanto custa?** | Umas 8 a 12 horas, quase todas em conferência, não em código. |
| **O que trava hoje?** | Nada mais. Os dois bloqueios foram removidos em 14/08 (fases 0.1 e 0.2). |
| **Vale sozinho?** | Não. Ganha uns 15 s por deploy e nada que o leitor sinta. |
| **Vale com a mudança de casa?** | Sim, e a ordem importa: **mude de casa primeiro, suba de versão depois.** |

A razão da ordem está em 3.1. Resumo: a mudança de casa mexe no `base`, que
atravessa o site inteiro, e a subida de versão mexe no build. Fazer as duas de
uma vez é não saber qual das duas quebrou o que quebrou.

---

## 1. O que o Astro 7 traz, e quanto disso chega aqui

Medido e verificado, não copiado do anúncio.

### 1.1 Chega

- **Build mais rápido.** O anúncio fala em 15% a 61%; o que eu medi aqui foi a
  geração de páginas caindo de 24,9 s para 12,1 s. Chamo de indício e não de
  medida: uma amostra cada, configurações diferentes. O deploy inteiro leva hoje
  **55 a 61 s** (cinco execuções), então o prêmio realista são **uns 15 s por
  push**.
- **Compilador em Rust com diagnóstico melhor.** Ele passou a errar em tag não
  fechada e não conserta mais aninhamento inválido. Isso é ganho de rigor, e o
  projeto já passa: as 106 páginas construíram sem uma queixa.

### 1.2 Chega SÓ depois da mudança de casa

Estes eram inúteis no GitHub Pages e passam a fazer sentido em Netlify, Vercel ou
Cloudflare. Nenhum é obrigatório; todos pressupõem que a mesa deixe de ser
estática, o que **a auditoria não recomendou** (seção 4.5).

- **Cache de rota** e **provedores de CDN** para os três hospedeiros.
- **`src/fetch.ts`**, controle do pipeline de requisição no padrão de fetch
  handler (Workers, Deno, Bun).
- O **adaptador Cloudflare** reconstruído, que roda `workerd` em todas as etapas.

### 1.3 Não chega, e é o destaque do anúncio

O **Sätteri**, o processador de Markdown em Rust, é o que tirou "mais de um
minuto" de sites grandes de documentação. Ele substitui o pipeline `unified`, e o
`astro.config.mjs` tem três plugins remark/rehype:

| plugin | o que faz | dá para largar? |
|---|---|---|
| `remarkMermaid` | troca o bloco ```mermaid``` pelo SVG já desenhado | não, é nosso |
| `rehypeBaseLinks` | prefixa o `base` nos links da prosa | **some sozinho na mudança de casa** |
| `rehypeTableWrap` | embrulha `<table>` para não estourar no celular | não, é nosso |

Para o build passar, instala-se `@astrojs/markdown-remark` e **fica-se no
pipeline antigo**: paga-se a migração e não se pega o ganho. Pegá-lo exigiria
portar dois plugins para o formato MDAST/HAST do Sätteri. Fica como item
opcional, na fase 5.

Repare no detalhe bom: **um dos três plugins morre com a mudança de casa.** Sem
`base`, não há o que prefixar.

### 1.4 O que o Astro 6 traz de aproveitável (vem junto na subida)

- **CSP embutido.** O Astro passa a gerar as somas de scripts e estilos e a
  política sozinho. No Pages só dava por `<meta>`; nos três hospedeiros novos dá
  por cabeçalho de verdade. Para um site com área de login, é endurecimento
  honesto e barato.
- **API de Fontes.** Baixa, subconjunta e gera métricas de fonte alternativa com
  preload. O ganho aqui não é byte (o `@fontsource` já entrega subconjunto
  latino), é **menos salto de layout**. Custa trocar os seis imports do
  `Base.astro`.

---

## 2. O que já foi feito (14/08/2026)

As duas fases de preparo saíram antes do resto, porque valem sozinhas e porque
sem elas não dava nem para TESTAR o Astro 7 direito.

### 2.1 Um só jeito de subir o dev server · `scripts/dev-server.mjs`

Cinco arquivos tinham a mesma função copiada para subir o `npm run dev`, achar a
URL na saída e matar a árvore de processos:

```
scripts/test-grid.mjs
scripts/test-editor-bestiario.mjs
scripts/shot-equip.mjs
.claude/skills/run-centelha-rpg/driver.mjs
.claude/skills/run-centelha-rpg/shot-forca.mjs
```

O Astro 7 quebra as cinco de uma vez: o `astro dev` virou **daemon**, imprime uma
linha de JSON, sai com código 0 e deixa o servidor de pé (`astro dev stop`). As
cinco tratavam saída antecipada como falha, e nenhuma das cinco expressões casa
com a mensagem nova, que não traz o `base` junto da URL.

Agora existe um lugar só, que aguenta as duas versões **e** carrega o caminho do
site (`BASE`, com `BASE_PATH` do ambiente vencendo), que é o que muda na saída do
Pages. Os cinco foram conferidos rodando.

### 2.2 O `@vite-pwa/astro` foi aposentado

Era o único bloqueio duro: `1.2.0` é a última versão publicada e o peer dela para
em `astro ^5.0.0`, então instalar o Astro 7 só passava com `--legacy-peer-deps`, e
um `npm ci` na integração contínua falharia.

O trabalho dele aqui era **uma** coisa: gerar um service worker "self-destroying"
de vinte linhas para matar um SW antigo preso em alguns aparelhos. Isso virou:

- `public/sw.js`, o mesmo conteúdo, escrito à mão;
- `public/manifest.webmanifest`, com **caminhos relativos** (`start_url` e `scope`
  em `./`), então o mesmo arquivo serve ao subdiretório do Pages e à raiz de um
  domínio próprio, sem edição. A versão gerada gravava `/centelha-rpg/`.

Saíram **305 pacotes** do `node_modules`. O `Base.astro` já tinha um trecho que
desregistra service workers ao carregar a página, e os dois se complementam: o
trecho só funciona quando a página CHEGA ao navegador, e um SW preso pode estar
servindo HTML velho sem ele; o `sw.js` o navegador rebusca por conta própria.

---

## 3. O plano

### 3.1 Por que mudar de casa PRIMEIRO

O `base: '/centelha-rpg/'` atravessa o projeto: `astro.config.mjs`, o `url()` de
`src/lib/site.ts`, o `rehypeBaseLinks`, o manifesto, o escopo do service worker,
o `BASE` do ferramental, o `deploy.yml` e o `Site URL` do Supabase. Tirá-lo é uma
mudança de superfície larga e risco raso: quebra é visível na hora (link 404,
imagem sumida).

A subida de versão é o contrário: superfície estreita e risco fundo. Quebra em
detalhe (espaçamento de texto, HTML antes tolerado, um script de bancada).

Misturar as duas é ficar sem saber qual delas causou o que aparecer. E há um
bônus: a mudança de casa **apaga um dos três plugins de Markdown**, que é
exatamente o obstáculo do Sätteri.

### 3.2 Fase 1 · Sair do GitHub Pages

*Meia a um dia. Reversível enquanto o DNS não virar.*

| # | o que | como se verifica |
|---|---|---|
| 1.0 | Escolher o **endereço** (ver `Dominio.md`, que é anterior a isto) | há um domínio decidido |
| 1.1 | Escolher o hospedeiro (ver 4) e criar o projeto apontando para o repositório | um deploy de prévia sobe |
| 1.1b | Pôr o endereço novo na Site URL e nas Redirect URLs do Supabase | "esqueci minha senha" chega com link certo |
| 1.2 | `base` some do `astro.config.mjs`; `site` passa a ser o domínio novo | `npm run build` verde |
| 1.3 | `rehypeBaseLinks` é apagado, junto do `BASE` que ele usava | os links da prosa continuam certos no build |
| 1.4 | `redirects` do `/artes` perde o `BASE` escrito à mão | `/artes` cai em `/artes/regras` |
| 1.5 | `BASE` de `scripts/dev-server.mjs` vira `''` | `npm run smoke` e o driver verdes |
| 1.6 | `deploy.yml` sai; entra a configuração do hospedeiro (ou o workflow dele) | o site aparece no domínio |
| 1.7 | No Supabase, *Site URL* e *Redirect URLs* passam a apontar para o domínio novo | entrar, sair e recuperar senha funcionam |
| 1.8 | Redirecionar o endereço velho do Pages para o novo | o link antigo continua chegando |

**Não esquecer:** a `PUBLIC_SUPABASE_URL` e a `PUBLIC_SUPABASE_ANON_KEY` são
variáveis do build. Elas viram variáveis de ambiente do hospedeiro novo.

**Verificação de ponta a ponta desta fase:** `npm run validate && npm run smoke`,
o `driver.mjs` do skill, e uma volta à mão no site publicado passando por
`/ficha`, `/bestiario`, um capítulo, e o login da mesa.

### 3.3 Fase 2 · Subir para o Astro 7

*Meio dia. Reversível: é um `git revert` mais um `npm ci`.*

Num ramo, nunca em `main`.

| # | o que | como se verifica |
|---|---|---|
| 2.1 | `npm i astro@7 @astrojs/markdown-remark` | `npm ci` limpo, sem `--legacy-peer-deps` |
| 2.2 | `npm run validate` | os oito verificadores verdes |
| 2.3 | `npm run smoke` e `driver.mjs` | o Grid e a ficha respondem no Astro 7 |
| 2.4 | `npm run build` | 106 páginas, sitemap e pagefind no lugar |
| 2.5 | **Comparar o HTML gerado, página a página, com o do Astro 5** | ver 3.4 |
| 2.6 | Olhar o espaçamento do texto em três capítulos e no bestiário | ver 3.4 |
| 2.7 | Prévia no hospedeiro, e a volta à mão da fase 1 | tudo desenha |

### 3.4 O que precisa de OLHO, e não de teste

Duas mudanças do Astro 7 são silenciosas por natureza:

- **`compressHTML` mudou de padrão** de "ciente de HTML" para "estilo JSX", que
  corta espaço entre elementos em linha com mais agressividade. O risco é texto
  grudado: `<strong>Ataque</strong> pronto` virando `Ataquepronto`. Isso não
  aparece em teste nenhum que exista aqui.
- **O compilador não conserta mais aninhamento inválido.** Ele passa a marcação
  adiante como está. O build já provou que não há tag aberta, mas aninhamento
  semanticamente torto (um `<div>` dentro de um `<p>`) pode mudar de desenho.

A defesa barata é um **diff de HTML**: construir com o Astro 5, guardar o `dist/`,
construir com o 7, e comparar os 106 arquivos normalizando o espaço em branco. O
que sobrar de diferença é o que merece olho. São umas 20 linhas de script e vale
mais do que ler as páginas uma a uma.

Se o espaçamento incomodar, `compressHTML: true` no config devolve o comportamento
antigo, e isso é uma linha.

### 3.5 Fase 3 · O que só faz sentido depois

*Opcional, cada item por si, nenhum urgente.*

| # | o que | por que |
|---|---|---|
| 3.1 | CSP por cabeçalho de verdade (`_headers`, `vercel.json` ou regra do Cloudflare), gerado pelo Astro | o Pages não deixava; o site tem área de login |
| 3.2 | API de Fontes no lugar dos seis imports do `@fontsource` | menos salto de layout enquanto a fonte carrega |
| 3.3 | Portar `remarkMermaid` e `rehypeTableWrap` para o Sätteri e largar o `@astrojs/markdown-remark` | pega o ganho de build que a fase 2 deixa na mesa |
| 3.4 | Cache de rota e provedor de CDN | **só se** a mesa virar SSR, o que a auditoria não recomendou |

---

## 4. Escolher o hospedeiro

Os três servem, e o site é estático hoje. O que os separa aqui:

| | Netlify | Vercel | Cloudflare Pages |
|---|---|---|---|
| adaptador Astro oficial | sim | sim | sim, reconstruído no Astro 6 |
| cabeçalhos por arquivo | `_headers` | `vercel.json` | `_headers` |
| limite do plano grátis | 100 GB/mês de banda | 100 GB/mês | **banda ilimitada** |
| bom para um `dist/` de 20 MB com 300 imagens | sim | sim | sim, e é o mais generoso |
| se um dia a mesa virar SSR | funções | funções | Workers, com o adaptador melhor dos três |

**Sugestão:** Cloudflare Pages, por dois motivos concretos: a banda não é
medida (o bestiário tem 7,8 MB de arte, e um dia isso conta), e é o caminho com
menos atrito se a mesa algum dia precisar de servidor. Netlify é o mais simples
de configurar dos três, se a preferência for essa.

**Ressalva vinda do `Dominio.md`:** essa sugestão olhava só para banda. Se o
endereço escolhido for um subdomínio grátis que esteja na Public Suffix List
(caso do `is-a.dev`), **o painel da Cloudflare não aceita adicioná-lo** e o
caminho passa pela API. Com Netlify ou Vercel é CNAME e pronto. Nesse cenário,
Netlify passa à frente. A escolha do endereço vem antes da escolha da casa.

**Isto não é urgente e não bloqueia nada.** O que bloqueava já saiu.

---

## 5. Riscos, e o que fazer com cada um

| risco | tamanho | defesa |
|---|---|---|
| Texto grudado pelo `compressHTML` | médio, e invisível para os testes | diff de HTML (3.4); `compressHTML: true` desfaz |
| Aninhamento de HTML antes tolerado | baixo (o build já passa) | o mesmo diff |
| A mesa nunca rodou no Astro 7 | **era o maior**, e caiu: com a fase 0.1 feita, `npm run smoke` agora roda lá | rodar o smoke no ramo |
| Link antigo do Pages morrer | alto para quem tem o endereço salvo | redirecionar o Pages para o domínio novo (1.8) |
| Login quebrar na mudança de casa | alto, e silencioso | trocar *Site URL* e *Redirect URLs* no Supabase ANTES de virar o DNS |
| Algum script de bancada quebrar | baixo agora | os cinco passam por `dev-server.mjs`, que aguenta as duas versões |

---

## 6. O que NÃO fazer

- **Não subir de versão e mudar de casa no mesmo commit.** Ver 3.1.
- **Não migrar para SSR junto.** A auditoria mediu e não achou motivo (seção
  4.5): o tempo real é websocket direto ao Supabase, a segurança é RLS, e a
  hospedagem estática não cobra pedágio de runtime. Mudar de casa é mudar de
  hospedeiro, não de arquitetura.
- **Não tocar no `@vite-pwa/astro` de novo.** Ele saiu; o que ele fazia são dois
  arquivos estáticos em `public/`.
