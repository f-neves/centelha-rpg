# Mudança de endereço · `centelha.rec.br`

Roteiro executável. Decidido em 15/08/2026, depois da análise em `Dominio.md`.
Isto é a **fase 1** do `Migracao_Astro7.md`, agora com o endereço escolhido, e é para ser
seguido de cima para baixo.

**Endereço novo:** `https://centelha.rec.br`
**Endereço velho:** `https://f-neves.github.io/centelha-rpg/`

**Regra que atravessa o documento inteiro: isto não se mistura com a subida para o Astro
7.** A mudança de casa tem superfície larga e risco raso; a subida de versão tem
superfície estreita e risco fundo. Juntas, ninguém sabe qual quebrou o quê.

---

## 0. Por que este endereço

Resumo do `Dominio.md`, para quem abrir este arquivo daqui a seis meses:

- R$ 40 por ano no Registro.br, em real, com preço estável e pagamento de até 10 anos à
  vista. Sem exposição a dólar, IOF ou aumento contratual anual.
- `rec.br` é a categoria de recreação e jogos, que é literalmente o que isto é.
- **DNS 4,6× mais rápido que um `.net` a partir do Brasil**, medido em duas formas
  independentes: `a.dns.br` responde em 30,4 ms contra 140,9 ms da melhor das treze
  letras de `gtld-servers.net`.
- É domínio próprio, então **portátil**: trocar de hospedeiro passa a ser editar um
  registro de DNS, sem mexer na origem.
- **Conserta um defeito que já existe**: com domínio próprio dá para pôr SMTP próprio no
  Supabase e sair do teto de 2 e-mails por hora (fase D).

---

## 1. Antes de pagar: uma confirmação de 30 segundos

Não consegui verificar por API se a categoria `rec.br` aceita **pessoa física (CPF)** ou
exige CNPJ · as páginas de regras do Registro.br são montadas por JavaScript e não
devolvem os dados. O próprio fluxo de compra informa isso na hora.

**No ato do registro, se `rec.br` pedir CNPJ ou documentação**, os substitutos, todos
conferidos livres e pelo mesmo preço, na ordem que eu escolheria:

1. `centelha.art.br`
2. `centelha.wiki.br`
3. `centelharpg.com.br` (sufixo mais legível do Brasil, nome pior)

Se trocar, **o resto deste documento vale igual**: só muda a string.

---

## 2. Fase A · Comprar e apontar

*Meia hora de trabalho, mais o tempo do DNS. Reversível até a fase B.*

| # | o que | como se verifica |
|---|---|---|
| A1 | Registrar `centelha.rec.br` em registro.br, com CPF. Considerar pagar vários anos | o domínio aparece em "Meus domínios" |
| A2 | Criar o projeto no hospedeiro apontando para o repositório `f-neves/centelha-rpg` | um deploy de prévia sobe e abre no endereço `*.pages.dev` do hospedeiro |
| A3 | Delegar o DNS (ver 2.1) | `nslookup -type=NS centelha.rec.br` devolve os servidores novos |
| A4 | Adicionar `centelha.rec.br` como domínio personalizado no hospedeiro | o painel mostra "ativo" e emite o certificado |
| A5 | Conferir HTTPS | `curl -I https://centelha.rec.br` devolve 200 e certificado válido |
| A6 | Religar DNSSEC (ver 2.2) | `dig centelha.rec.br +dnssec` traz RRSIG |

### 2.1 Onde o DNS vai morar, e por que isso importa

`centelha.rec.br` é o **ápice** do domínio, e o DNS não permite CNAME no ápice. Isso
decide onde a zona vai ficar:

- **Cloudflare Pages** exige que a zona esteja na Cloudflare, que faz *CNAME flattening*
  no ápice. Então: registrar no Registro.br e **trocar os servidores de nome para os da
  Cloudflare**. O domínio continua sendo seu e comprado no Registro.br; só o DNS muda de
  casa. É o caminho recomendado, e de quebra dá cache, regras e Workers na frente do
  site sem depender do hospedeiro.
- **Netlify** funciona com a zona no próprio Registro.br, usando o **registro A** que a
  Netlify indicar para o ápice. Menos poder, menos passos.

**Recomendo Cloudflare Pages com a zona na Cloudflare.** A ressalva que existia contra
ela morreu junto com o `is-a.dev`: aquele problema era o painel recusar domínio cujo pai
está na Public Suffix List. Aqui o pai é `rec.br`, que é um sufixo público **da seção
ICANN** (linha 650 da lista), e `centelha.rec.br` é um domínio registrável comum. Caso
normal, sem volta pela API.

### 2.2 DNSSEC

Trocar de servidor de nome **quebra o DNSSEC** até você publicar o DS novo. Se delegar
para a Cloudflare: ligar DNSSEC lá, copiar o registro DS que ela mostrar e colar no
Registro.br. Deixar por último, depois que o site já estiver respondendo.

---

## 3. Fase B · Tirar o `base` do código

*Uma hora. Tudo isto é commit, então é reversível por `git revert`.*

### 3.1 O que precisa de edição

| arquivo | linha | hoje | depois |
|---|---:|---|---|
| `astro.config.mjs` | 7 | `const BASE = '/centelha-rpg';` | **apagar** |
| `astro.config.mjs` | 84 | `site: 'https://f-neves.github.io',` | `site: 'https://centelha.rec.br',` |
| `astro.config.mjs` | 85 | `base: BASE + '/',` | **apagar a linha** |
| `astro.config.mjs` | 89 | `redirects: { '/artes': BASE + '/artes/regras' }` | `redirects: { '/artes': '/artes/regras' }` |
| `astro.config.mjs` | 69-81 | função `rehypeBaseLinks` | **apagar inteira** |
| `astro.config.mjs` | 94 | `rehypePlugins: [rehypeBaseLinks, rehypeTableWrap]` | `rehypePlugins: [rehypeTableWrap]` |
| `astro.bancada.mjs` | 25 | `const BASE = '/centelha-rpg';` | **apagar** |
| `astro.bancada.mjs` | 28 | `site: 'https://f-neves.github.io',` | acompanhar o config de produção |
| `scripts/dev-server.mjs` | 43 | `process.env.BASE_PATH ?? '/centelha-rpg'` | `process.env.BASE_PATH ?? ''` |
| `scripts/watch-deploy.mjs` | 3, 28-31 | vigia o Actions e bate em `f-neves.github.io` | reescrever para o hospedeiro novo, ou aposentar |
| `.github/workflows/deploy.yml` | inteiro | publica no GitHub Pages | ver 3.3 |

**`rehypeBaseLinks` morre aqui, e isso é um ganho de fora do escopo:** ele é um dos três
plugins de Markdown que hoje obrigam o projeto a ficar no pipeline `unified` em vez do
Sätteri do Astro 7. Saindo ele, sobram dois. Está anotado no `Migracao_Astro7.md`.

### 3.2 O que NÃO precisa de edição, e só de conferência

Estes se ajustam sozinhos, porque leem o `base` em vez de escrevê-lo. **Mexer neles é
que seria erro.**

- **`import.meta.env.BASE_URL`, em 15 lugares** (`src/lib/site.ts:2`, `mesa-core.ts:20`,
  `ficha-card.ts:23`, `Base.astro:352`, `bestiario.astro:666`, `conta.astro:37`,
  `entrar.astro:68`, `mesas.astro:55`, `personagem.astro:123`, `admin.astro:25`,
  `marcadores.astro:14`, `redefinir-senha.astro:31`, `configuracoes.astro:407`,
  `ArvoreTecnicas.astro:41`, `Referencias.astro:11`, `BestiaEditor.astro:455`).
  Sem `base` no config, a Astro põe `/` neles e o `url()` de `site.ts` devolve caminhos
  de raiz. Nada a fazer.
- **`Astro.site`**, em `src/layouts/Base.astro:33` e `:36`, que monta `og:url` e
  `og:image`. Segue o `site` novo sozinho.
- **`public/manifest.webmanifest`**: `start_url` e `scope` já são `./`, relativos de
  propósito, exatamente para sobreviver a esta mudança. **Não mexer.**
- **Sitemap**: o `@astrojs/sitemap` regenera a partir do `site`.

### 3.3 O deploy

O workflow atual (`.github/workflows/deploy.yml`) constrói e publica no GitHub Pages via
`upload-pages-artifact` e `deploy-pages`. Duas saídas:

- **Deixar o hospedeiro construir** (mais simples): Cloudflare Pages e Netlify clonam o
  repositório e rodam `npm run build` sozinhos. Aí o `deploy.yml` **é apagado**, e as
  variáveis `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY` passam a ser cadastradas
  no painel do hospedeiro, não mais em Settings > Secrets and variables > Actions.
  **Atenção ao comando de build:** ele é `npm run build`, que já roda `pagefind --site
  dist` no fim. Sem isso a busca do site sobe vazia.
- **Continuar construindo no Actions** e mandar o `dist` pronto pela ação do hospedeiro.
  Mantém o portão do repositório no caminho, ao custo de um passo a mais.

Sugiro a primeira, e manter o `.github/workflows/validate.yml`, que roda `npm run
validate` e `npm run smoke` nos *pushes* que não são para a `main`. O portão continua
existindo; só quem publica é que muda.

### 3.4 Documentação a corrigir

Não quebra nada, e mentir na documentação custa caro depois:

- `README.md:4`
- `CLAUDE.md:4`, `:5` e `:62`
- `.claude/skills/run-centelha-rpg/SKILL.md`, linhas 10, 55, 75, 80 e 89
- `.claude/skills/run-centelha-rpg/driver.mjs:9` (comentário do `BASE_PATH`)
- `supabase/README.md:229` (o exemplo de Redirect URL)
- `astro.config.mjs:104`, no comentário que explica a saída do `@vite-pwa/astro`
- `public/sw.js`, no bloco "QUANDO APAGAR" (ver fase F)

---

## 4. Fase C · Supabase

*Dez minutos, e é a peça que quebra em silêncio se for esquecida.*

O site é estático e as chaves são públicas por design, então **nada aqui é segredo**. O
que muda é a lista de destinos que o Supabase aceita.

| # | o que | onde | como se verifica |
|---|---|---|---|
| C1 | **Site URL** → `https://centelha.rec.br` | Authentication > URL Configuration | o campo salva |
| C2 | **Additional Redirect URLs**: acrescentar `https://centelha.rec.br/**` e **manter o endereço velho e o `http://localhost:4321/**`** | mesma tela | os três aparecem na lista |
| C3 | Testar "esqueci minha senha" no endereço novo | `/conta` | o e-mail chega e o link abre `/redefinir-senha` do domínio novo |

**Por que manter o endereço velho na lista por um tempo:** durante a transição há gente
com aba aberta no endereço antigo, e um link de recuperação gerado lá tem de continuar
funcionando. Tirar depois, junto da fase F.

**O que exatamente quebra se esquecer:** `src/pages/conta.astro:49` monta o destino com
`${location.origin}${base}redefinir-senha`, ou seja, ele **se adapta sozinho** ao endereço
novo. O Supabase é que recusa um destino fora da lista. O sintoma é o pior possível:
nenhuma mensagem de erro na tela, e o link do e-mail vai para o lugar errado ou não vem.

---

## 5. Fase D · SMTP próprio · o defeito que já existe hoje

*Uma hora, e é o único ganho técnico da compra que se paga sozinho. Pendência J1b.*

Hoje o cadastro (`src/lib/auth.ts:54`) e a recuperação de senha (`:65`) saem pelo SMTP
embutido do Supabase, **limitado a 2 e-mails por hora, em todos os planos, inclusive no
pago**. Três pessoas criando conta na mesma hora e a terceira não recebe a confirmação.
O `traduzErro` da linha 93 já tem tradução para "rate limit", o que sugere que isso já
apareceu alguma vez.

Isto só é possível com domínio próprio, e é por isso que fica nesta migração:

| # | o que | como se verifica |
|---|---|---|
| D1 | Criar conta num provedor de envio (Resend, Brevo, Postmark · os três têm faixa gratuita) | conta criada |
| D2 | Adicionar `centelha.rec.br` lá e publicar os registros **SPF, DKIM e DMARC** no DNS | o provedor marca o domínio como verificado |
| D3 | Pôr o host, porta, usuário e senha em Authentication > SMTP Settings, com remetente `nao-responda@centelha.rec.br` | a tela salva |
| D4 | Subir o teto em Authentication > Rate Limits (o padrão vira 30/h ao configurar SMTP) | o número novo aparece |
| D5 | Testar cadastro e recuperação, e conferir que **não caiu em spam** | e-mail na caixa de entrada, com DKIM válido |

**Ordem importa:** fazer isto depois da fase C, para o link do e-mail já apontar para o
domínio novo.

---

## 6. Fase E · O rastro do endereço antigo

*O GitHub Pages não faz redirecionamento 301 de servidor. Só dá para atenuar.*

As 106 páginas indexadas hoje apontam para `f-neves.github.io/centelha-rpg/`.

| # | o que | observação |
|---|---|---|
| E1 | Manter o repositório publicando no Pages uma árvore de páginas com `meta refresh` + `<link rel="canonical">` para o endereço novo | é consolo, não é 301; o buscador entende, mas mais devagar |
| E2 | Criar a propriedade nova no Search Console e enviar o `sitemap-index.xml` | |
| E3 | Usar a ferramenta de mudança de endereço do Search Console, se ela aceitar sem 301 | pode recusar |
| E4 | Deixar o rastro no ar por pelo menos **6 meses** | depois disso, desligar o Pages |

**O custo que não tem conserto e já está contabilizado:** quem tem ficha salva em
`localStorage` no endereço antigo **perde a ficha**, porque `localStorage` é por origem.
São 7 chaves (`centelha:ficha`, `centelha:ficha:personagem-id`, `centelha:marcadores`,
`centelha:config`, `centelha:bestiario:elem-extra`, `tema`, `sidebar`).

**Atenuação possível, se valer o trabalho:** a `/ficha` já sabe ler um estado em base64
no *hash* da URL (`src/pages/ficha.astro:21`). Dá para pôr um aviso na página antiga
oferecendo um link de mudança que carrega a ficha para o domínio novo. É uma tela e um
botão. Vale a pena se houver gente usando; se o site ainda é só seu, não vale.

---

## 7. O portão

Rodar tudo isto antes de considerar a fase B pronta:

```bash
npm run validate     # dados + Kael + contrato ficha↔mesa + artes/seta/golpe
npm run build        # inclui o validate e o pagefind
npm run smoke        # o Grid, com teto de repintura
npx tsc --noEmit     # tem de continuar em 0 erros
node .claude/skills/run-centelha-rpg/driver.mjs
node scripts/test-editor-bestiario.mjs
```

E abrir na mão, no endereço novo, conferindo que **nenhuma URL tem `/centelha-rpg/`**:

- `/` · `/ficha` · `/bestiario` · `/mesa/grid` · `/arcano` · `/artes/regras`
- `/artes` (tem de cair em `/artes/regras`, pelo `redirects`)
- um capítulo com link interno na prosa (era o trabalho do `rehypeBaseLinks`)
- um capítulo com diagrama (os seis do `gen-mermaid`)
- a busca do Pagefind, com um termo que exista
- entrar, sair e recuperar senha
- `/sitemap-index.xml`, conferindo que as URLs saem com o domínio novo
- `/manifest.webmanifest`, conferindo `start_url` e `scope` relativos

---

## 8. Se der errado

A ordem das fases foi montada para que cada uma volte sozinha:

| até onde foi | como voltar | quanto custa |
|---|---|---|
| fase A | não fazer nada: o site velho continua no ar, intocado | R$ 40 |
| fase B | `git revert` do commit e refazer o deploy pelo Actions | minutos |
| fase C | repor a Site URL antiga (o endereço velho nunca saiu da lista) | minutos |
| fase D | desligar o SMTP próprio; volta ao embutido, com o teto de 2/h | minutos |
| fase E | não há o que voltar: é acréscimo | — |

**O ponto sem volta é o primeiro leitor que salvar ficha no endereço novo.** Depois
disso, voltar atrás custa a mesma conta da fase E, ao contrário.

---

## 9. Fase F · Limpeza, semanas depois

- Apagar `public/sw.js`. O comentário dentro dele já prevê exatamente isto: o escopo do
  service worker preso morre junto com o endereço antigo, então no domínio novo o arquivo
  não tem função. **Só depois** de desligar o Pages.
- Tirar o endereço velho das Redirect URLs do Supabase.
- Aposentar ou reescrever `scripts/watch-deploy.mjs`, que hoje só sabe olhar o GitHub
  Actions e bater em `f-neves.github.io`.
- Desligar o GitHub Pages no repositório.

---

## 10. O que não fazer

- **Não misturar com o Astro 7.** Uma coisa de cada vez, com um deploy verde no meio.
- **Não mexer nos `import.meta.env.BASE_URL`.** Eles se ajustam sozinhos; trocar por
  caminho fixo é criar trabalho e bug.
- **Não editar `public/manifest.webmanifest`.** Os caminhos relativos são de propósito.
- **Não esquecer o `pagefind`** se o hospedeiro passar a construir: o comando é
  `npm run build`, e não `astro build`.
- **Não deixar o Supabase para depois.** É a única peça que quebra sem avisar.
- **Não desligar o GitHub Pages junto com a virada.** Ele é a rede de segurança e o
  rastro para os buscadores.

---

## 11. Depois disto

Com o site fora do subdiretório e num domínio próprio, o `Migracao_Astro7.md` volta a
ser o documento da vez, e a fase 1 dele está cumprida. Os dois bloqueios técnicos da
subida já saíram em 14/08 (o `scripts/dev-server.mjs` unificado e a aposentadoria do
`@vite-pwa/astro`), e o `rehypeBaseLinks` sai aqui, na fase B.
