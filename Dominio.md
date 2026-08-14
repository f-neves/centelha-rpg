# Qual endereço o Centelha vai ter

Documento de decisão, 14/08/2026. Companheiro de `Migracao_Astro7.md`, que na fase 1.1
manda "escolher o hospedeiro". Este aqui responde à pergunta anterior a essa: **qual
endereço**, porque o endereço é o que fica, e o hospedeiro é o que se troca.

Hoje o site mora em `https://f-neves.github.io/centelha-rpg/`.

> **Correção de 14/08, mesma tarde.** A primeira versão deste documento recomendava
> `centelha.is-a.dev` como melhor opção grátis. Ao aprofundar a comparação, li os Termos
> de Serviço deles (atualizados em 3 de agosto de 2026) e **o Centelha muito provavelmente
> não é elegível**. A seção 8 traz o texto. A recomendação mudou.

---

## 1. A resposta curta

**`centelha.rec.br`, R$ 40 por ano.** Livre, categoria de recreação e jogos, portátil,
preço fixo em real (travável por 10 anos), e **4,6 vezes mais rápido que o `.net` na
consulta fria de DNS a partir do Brasil**, o que foi medido na seção 12.2.

**`centelha.net`, R$ 64, se o nome pesar mais.** É o único endereço viável em que
"centelha" aparece limpo num sufixo que qualquer pessoa reconhece. Troca consciente.

**Qualquer um dos dois conserta um defeito que já existe:** hoje o cadastro e a
recuperação de senha saem pelo SMTP embutido do Supabase, limitado a **2 e-mails por
hora em todos os planos**, e sair disso exige um domínio próprio. Ver seção 12.1.

**Se for grátis, e ponto: `centelha-rpg.netlify.app` (ou `.pages.dev`).** Feio e preso
à casa, mas é o único grátis que a gente tem direito de usar sem torcer.

**`centelha.eu.org` é o grátis bonito**, e a única razão de não estar em primeiro é que
a aprovação é manual, demora de semanas a meses e não é garantida. Dá para pedir hoje
sem parar nada, porque pedir não custa.

**`centelha.is-a.dev` saiu da frente.** Está livre, é portátil e seria ótimo, mas o
regulamento deles restringe o serviço a projetos ligados a desenvolvimento de software.
Um livro de RPG não é. Detalhe na seção 8.

---

## 2. O que morreu, e não volta

Toda lista de "domínio grátis" da internet ainda começa com `.tk`, `.ml`, `.ga`, `.cf`
e `.gq`, da Freenom. **Isso acabou.** Em fevereiro de 2024 a Freenom fechou acordo no
processo que a Meta moveu contra ela e saiu do negócio de registro; em março de 2024
cerca de 12,6 milhões de domínios pararam de responder. O Mali tirou o `.ml` de lá e o
Gabão tirou o `.ga`. Em julho de 2026 a Freenom voltou, **vendendo** `.tk`, `.cf` e
`.gq` a partir de € 8,22 por ano.

Não é uma opção. É uma lápide com boa colocação no Google.

---

## 3. O que eu medi, e como repetir

### 3.1 A armadilha do curinga

O primeiro teste que fiz estava errado, e vale contar porque qualquer um repetiria o
mesmo erro. Usei `nslookup` para ver se `centelha.pages.dev`, `centelha.is-a.dev` e
companhia estavam ocupados. **Todos responderam.** Conclusão aparente: tudo ocupado.

Conclusão real: **todos esses serviços usam DNS curinga.** Testei com um nome que
ninguém jamais registrou:

```bash
for n in zzqx7k3nao.is-a.dev zzqx7k3nao.pages.dev zzqx7k3nao.netlify.app \
         zzqx7k3nao.vercel.app zzqx7k3nao.js.org zzqx7k3nao.eu.org; do
  nslookup "$n" 1.1.1.1
done
# todos resolvem
```

DNS não responde essa pergunta. O que responde é **o registro** (os que guardam os
nomes em git) e **o HTTP** (comparando a resposta do nome desejado com a de um nome
aleatório).

### 3.2 Public Suffix List

Baixei a lista e conferi nome por nome. Isso importa por um motivo que a seção 5
detalha: sem estar na PSL, o site herda a reputação dos vizinhos.

```bash
curl -sL -o psl.dat https://publicsuffix.org/list/public_suffix_list.dat
grep -n -x "is-a.dev" psl.dat
```

Resultado (arquivo de 16.409 linhas; a seção privada começa na 11.277):

| sufixo | linha | na PSL? |
|---|---:|:---:|
| `pages.dev` | 12.728 | sim |
| `eu.org` | 13.415 | sim |
| `github.io` | 13.783 | sim |
| `js.org` | 14.356 | sim |
| `netlify.app` | 14.808 | sim |
| `vercel.app` | 16.172 | sim |
| `is-a.dev` | 16.272 | sim |
| `is-a.software` | — | **não** |
| `moe.page` | — | **não** |
| `runs-on.tech` | — | **não** |
| `jsid.dev` | — | **não** |

Os quatro de baixo aparecem em toda lista de "alternativas ao is-a.dev" e **estão fora
da PSL**. Isso os elimina antes de qualquer discussão de gosto.

### 3.3 Disponibilidade do nome "centelha"

Para os registros em git, a pergunta é um arquivo:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://api.github.com/repos/is-a-dev/register/contents/domains/centelha.json
# 404 = livre
```

Para os hospedeiros, é comparar o corpo da resposta com o de um nome aleatório:

```bash
curl -s -L https://centelha.pages.dev | grep -o '<title>[^<]*'
```

| nome | situação | evidência |
|---|---|---|
| `centelha.is-a.dev` | livre (mas ver seção 8) | registro devolve 404; a página curinga diz "Available Domain" |
| `centelha.js.org` | livre, porém inelegível | não consta na lista de 3.909 nomes ativos |
| `centelha.pages.dev` | **ocupado** | HTTP 200, título "Centelha · online atelier" |
| `centelha.vercel.app` | **ocupado** | HTTP 200, título "Alohomora AI" |
| `centelha.netlify.app` | **ocupado** | HTTP 200 com 10.423 bytes (nome inexistente devolve 404 com 50) |
| `centelha-rpg.pages.dev` | livre | conexão recusada (sem certificado emitido) |
| `centelha-rpg.netlify.app` | livre | HTTP 404, 50 bytes, igual ao nome aleatório |
| `centelha-rpg.vercel.app` | livre | HTTP 404, 107 bytes, igual ao nome aleatório |
| `centelha.eu.org` | indeterminado | os servidores do `eu.org` não responderam em 2 s |

**O nome limpo "centelha" está tomado nos três hospedeiros.** Nos hospedeiros sobra
`centelha-rpg`, que é mais feio e ainda por cima preso à casa.

### 3.4 Pagos, para ter o número da comparação

Consultados via RDAP e via a API do Registro.br (`status: 0` = livre, `2` = registrado):

| domínio | situação | preço/ano |
|---|---|---:|
| `centelha.rec.br` | **livre** (`rec.br` é a categoria de recreação e jogos) | R$ 40 |
| `centelha.art.br` | livre | R$ 40 |
| `centelha.wiki.br` | livre | R$ 40 |
| `centelharpg.com.br` | livre | R$ 40 |
| `centelha-rpg.com.br` | livre | R$ 40 |
| `centelha.dev` | livre | ~US$ 12 |
| `centelha.com.br` | registrado, vence em 19/04/2028 | — |
| `centelha.net.br` | registrado, vence em 07/01/2029 | — |
| `centelha.com` · `centelha.org` | registrados | — |
| `centelha.rpg.br` | **não existe**: a categoria `rpg.br` é inválida | — |

O Registro.br cobra R$ 40 por ano para qualquer categoria, no registro e na renovação,
com CPF, e aceita pagamento de até 10 anos de uma vez. (Eu tinha suposto que existia um
`rpg.br`; a API do Registro.br respondeu "Categoria inválida". Não existe. `jogos.br`
também não.)

### 3.5 Até R$ 100 por ano: o que isso abre

Preços de renovação da Cloudflare Registrar, que vende ao custo de atacado do registro,
sem margem. Convertidos em 14/08/2026 com o dólar a R$ 5,245 e **mais 3,5% de IOF**, que
é o que um cartão brasileiro cobra numa compra em moeda estrangeira.

| domínio | situação | US$/ano | **R$/ano com IOF** |
|---|---|---:|---:|
| `centelha.page` | **livre** | 10,20 | **55** |
| `centelha.xyz` | **livre** | 11,20 | **61** |
| `centelha.net` | **livre** | 11,86 | **64** |
| `centelha.dev` | **livre** | 12,20 | **66** |
| `centelha.club` | **livre** | 15,20 | **83** |
| `centelha.me` | **livre** | 16,56 | **90** |
| `centelha.com` | registrado | 10,46 | 57 |
| `centelha.app` | registrado | 14,20 | 77 |
| `centelha.blog` | livre | 20,20 | 110 · acima do teto |
| `centelha.info` · `.pro` | livres | 21,20 | 115 |
| `centelha.wiki` · `.space` · `.ink` | livres | 25,20 | 137 |
| `centelha.games` | livre | 26,20 | 142 |
| `centelha.site` | livre | 27,70 | 150 |
| `centelha.life` | livre | 28,20 | 153 |
| `centelha.fun` | livre | 30,20 | 164 |
| `centelha.world` | livre | 32,20 | 175 |

E no Registro.br, a R$ 40 fixos, todos livres: `centelha.rec.br`, `centelha.art.br`,
`centelha.wiki.br`, `centelha.tec.br`, `centelha.blog.br`, `centelharpg.com.br`,
`rpgcentelha.com.br`, `sistemacentelha.com.br`, `centelhad6.com.br`.
(`centelha.com.br`, `.net.br` e `.eco.br` estão registrados.)

**O que o teto de R$ 100 compra, em uma frase: o nome limpo "centelha" num sufixo que as
pessoas reconhecem.** De graça isso não existia, porque `centelha` está tomado nos três
hospedeiros, e no `.br` o `.com.br` já foi.

### 3.6 A conta de dez anos, que não é a de um ano

O preço de hoje engana. As duas famílias andam em direções diferentes:

- **`.br`**: R$ 40 por ano, em real, e o Registro.br mantém esse valor há anos. Dá para
  pagar 10 anos à vista e travar tudo.
- **gTLDs**: preço em dólar, com aumento contratual previsto. A Verisign **já anunciou
  alta de 7% no `.com` a partir de 1º de novembro de 2026** (de US$ 10,26 para US$ 10,97),
  e o contrato dela permite até 7% ao ano em quatro dos seis anos de cada ciclo. No `.net`
  o teto contratual é de **10% ao ano até meados de 2029**.

Ou seja, `centelha.net` a R$ 64 hoje não é R$ 64 daqui a dez anos: é isso mais os
aumentos do registro, mais o que o dólar fizer, mais IOF. O `.br` a R$ 40 é R$ 40.

### 3.7 Existe ganho técnico? Quase nenhum, e eu conferi

Vale separar o que é ganho real do que é conversa de vendedor.

**Nada na nossa arquitetura depende do sufixo.** Site estático, Supabase por websocket,
estado em `localStorage`, service worker: tudo isso enxerga a **origem**, e para a origem
tanto faz se ela termina em `.net`, `.rec.br` ou `.dev`. Não há aqui um número que
justifique pagar mais por desempenho, porque não existe diferença de desempenho.

A única diferença técnica de verdade que encontrei é o **HSTS preload**. Confirmei
direto na fonte do Chromium (`net/http/transport_security_state_static.json`):

```json
{ "name": "dev",  "policy": "public-suffix", "mode": "force-https", "include_subdomains": true },
{ "name": "app",  "policy": "public-suffix", "mode": "force-https", "include_subdomains": true },
{ "name": "page", "policy": "public-suffix", "mode": "force-https", "include_subdomains": true },
```

`.dev`, `.app` e `.page` são TLDs inteiros marcados como "force-https": o navegador se
recusa a tentar HTTP, mesmo na primeira visita. O ganho concreto é **um salto de
redirecionamento a menos** para quem digita o endereço sem `https://`. É real, e é
pequeno: um RTT, uma vez, por navegador.

**E não é exclusivo.** Qualquer domínio pode ser submetido à lista em `hstspreload.org` e
ter o mesmo efeito, bastando servir o cabeçalho `Strict-Transport-Security` com
`preload`. O `.dev` só poupa o pedido.

**Conclusão: o ganho de pagar mais é de nome e de privacidade, não de tecnologia.**

---

## 4. O que a PSL faz por nós, com um caso real

Em outubro de 2025 o `statichost.eu`, um hospedeiro de sites estáticos que dá um
subdomínio por cliente, teve **o domínio inteiro bloqueado pelo Google Safe Browsing**
por cerca de 7 horas, porque num fim de semana alguns clientes subiram páginas de
phishing. Todo mundo que hospedava lá levou a tela vermelha de "site enganoso" junto.

A causa apontada na discussão foi exatamente a ausência da PSL: sem ela, o Google não
tem como saber que `fulano.statichost.eu` e `sicrano.statichost.eu` são de donos
diferentes. A correção do provedor foi mover o conteúdo de usuário para outro domínio.

É por isso que a tabela de 3.2 é o primeiro filtro e não uma curiosidade. Todos os
nossos candidatos vivos estão na lista; as "alternativas" que circulam em blogs, não.

**A PSL não resolve tudo, e é honesto dizer.** Ela separa cookies, armazenamento e
identidade de site para o navegador. Ela **não** apaga a reputação compartilhada aos
olhos de busca: se a maioria dos vizinhos de um sufixo for lixo, o punhado de sites
sérios ali sofre para se distinguir. Isso pesa contra qualquer subdomínio grátis e a
favor de um domínio próprio.

---

## 5. O que a nossa arquitetura cobra por uma mudança de endereço

Aqui é onde a análise deixa de ser sobre domínios e passa a ser sobre este projeto.

**Tudo que dói numa mudança está preso à origem, não ao hospedeiro.**

### 5.1 O que os leitores perdem

O navegador guarda `localStorage` por origem. Trocar `f-neves.github.io` por qualquer
outra coisa apaga, para todo mundo que já usa o site, estas 7 chaves:

| chave | o que morre |
|---|---|
| `centelha:ficha` | **a ficha de personagem inteira** |
| `centelha:ficha:personagem-id` | o vínculo com a ficha salva na mesa |
| `centelha:marcadores` | os marcadores da pessoa |
| `centelha:config` | as preferências do site |
| `centelha:bestiario:elem-extra` | os elementos que o mestre acrescentou |
| `tema` | claro/escuro |
| `sidebar` | a barra aberta ou fechada |

Há um paraquedas parcial: `/ficha` sabe ler um estado vindo em base64 no *hash* da URL
(`src/pages/ficha.astro`, linha 21), então uma ficha atravessa por link. Marcadores e
configurações, não. E ninguém guarda um link antes de saber que precisava.

### 5.2 O que nós temos de mexer

- **Supabase**: a Site URL e a lista de Redirect URLs. A recuperação de senha monta o
  destino com `${location.origin}${base}redefinir-senha` (`src/pages/conta.astro`,
  linha 49), ou seja, ela se adapta sozinha ao endereço novo, **mas o Supabase recusa
  um destino que não esteja na lista**. Esquecer isso não quebra nada visível: só a
  recuperação de senha para de funcionar, calada. Dá para pôr os dois endereços na
  lista durante a transição.
- **`astro.config.mjs`**: `site` e `base`, o que refaz o sitemap inteiro.
- **Buscadores**: propriedade nova no Search Console, e as 106 páginas indexadas hoje
  passam a apontar para o lugar errado. O GitHub Pages não faz redirecionamento 301 de
  servidor; o que dá para fazer é manter o repositório publicando uma árvore de páginas
  com `meta refresh`. Funciona, mas é um consolo, não um 301.

### 5.3 A conta que decide

Esse custo se paga **por mudança de origem**. Então a pergunta certa não é "qual
endereço é melhor hoje", é **quantas vezes vamos pagar isso**.

- Um subdomínio de hospedeiro solda a origem à casa. No dia em que a Cloudflare mudar o
  plano gratuito, ou em que a mesa precisar de algo que ela não faça, mudar de casa é
  mudar de origem **de novo**, e a conta da 5.1 vem pela segunda vez.
- `eu.org`, `is-a.dev` e um domínio comprado são CNAME. Trocar de hospedeiro vira editar
  um registro de DNS, e a origem não se mexe. Os leitores não perdem nada, o Supabase
  não muda, o Search Console não muda.

---

## 6. A comparação, lado a lado

| | **A · `centelha.rec.br`** | **B · `centelha.is-a.dev`** | **C · `centelha-rpg.netlify.app`** | **D · `centelha.eu.org`** |
|---|---|---|---|---|
| custo | R$ 40/ano (até 10 anos à vista) | grátis | grátis | grátis, sem vencimento |
| no ar em | minutos | horas a dias (revisão humana) | minutos | **semanas a meses** |
| podemos usar? | sim | **provavelmente não** (seção 8) | sim | sim |
| se um dia vender o livro | sem problema | **proibido** (ToS 4.8) | Netlify e Cloudflare sim; **Vercel não** | desencorajado, não proibido |
| portátil (trocar de casa) | **sim** | sim | **não** | **sim** |
| trocar o DNS às pressas | minutos, no painel | **um PR e revisão humana** | não existe: é mudar de origem | minutos, no painel |
| quem pode tirar de você | ninguém, se pagar | eles, "a qualquer tempo, por qualquer razão" | o hospedeiro, se mudar o plano | eles, se o serviço parar |
| na PSL | não precisa: é domínio próprio | sim | sim | sim |
| reputação compartilhada | **nenhuma** | herda a dos vizinhos | herda a dos vizinhos | herda a dos vizinhos |
| como se lê | limpo, e `rec` combina | "centelha **is a dev**" | carrega o nome da empresa | limpo, mas soa europeu |
| subdomínio (`mesa.centelha.x`) | sim | sim (aninhado é permitido) | não | sim |
| e-mail no domínio | sim | sim (MX permitido) | não | sim |
| privacidade do titular | **nome público** no whois, CPF mascarado | usuário do GitHub público, e-mail opcional | nada público | não verificado |
| como se perde | esquecer de pagar | violar o ToS, ou o projeto acabar | o plano grátis mudar | o serviço acabar |
| trabalho para configurar | painel + DNS | PR **escrito à mão** (seção 8) | um clique | formulário + espera |

---

## 7. Cada uma por inteiro

### A · `centelha.rec.br` · R$ 40 por ano

**A favor**

- **É seu.** Nenhum voluntário, nenhuma empresa e nenhum regulamento entre você e o
  endereço. A única forma de perder é não pagar.
- **Portátil de verdade e rápido.** Trocar de hospedeiro é editar um CNAME no painel do
  Registro.br, com efeito em minutos. Se o hospedeiro cair numa noite de sessão, você
  resolve na hora. Nas opções B e D isso depende de terceiros.
- **A categoria combina.** `rec.br` é a de recreação, entretenimento e jogos. É a caixa
  certa, e o endereço se explica sozinho.
- **Zero reputação herdada.** Nenhum vizinho pode derrubar você por phishing, como
  aconteceu no caso da seção 4.
- **Não fecha nenhuma porta.** Vender o PDF um dia, pôr `mesa.centelha.rec.br` num
  servidor separado, ter `contato@centelha.rec.br`: tudo permitido, nada a pedir.
- **Custo travável.** Dá para pagar 10 anos de uma vez e apagar o risco de esquecimento.

**Contra**

- **Custa dinheiro**, que é exatamente o que você pediu para evitar. R$ 40/ano, R$ 3,33
  por mês.
- **Esquecer de pagar tira o site do ar.** O cronograma do Registro.br: no vencimento
  ainda funciona, 14 dias depois congela (sai do ar), e fica congelado até 90 dias antes
  de ser liberado para terceiros. Ou seja, há ~104 dias de rede de segurança, mas o site
  cai já no 14º.
- **Exige CPF e expõe seu nome.** O whois do Registro.br publica o nome completo do
  titular e o CPF parcialmente mascarado. Não existe serviço de privacidade de domínio
  no `.br`, ao contrário dos registradores internacionais.
- **`centelha.com.br` está tomado** (vence em 2028). Se `.com.br` for inegociável para
  você, sobra `centelharpg.com.br` ou `centelha-rpg.com.br`, que são piores que
  `centelha.rec.br`.

### B · `centelha.is-a.dev` · grátis, e quase certamente fora

**A favor**

- **O nome limpo está livre**, o que não acontece em nenhum hospedeiro.
- Portátil, na PSL, com DNS completo (A, AAAA, CNAME, MX, TXT, NS, SRV, CAA), subdomínio
  aninhado permitido, e-mail permitido, tudo grátis.
- Roda sobre a Cloudflare, com patrocínio declarado (programa Project Alexandria).

**Contra**

- **O regulamento provavelmente nos exclui.** Ver seção 8. Este é o item que decide.
- **Uso comercial é proibido** (ToS 4.8). Se o Centelha um dia virar um PDF à venda, ou
  ganhar uma vaquinha, o endereço vira irregular.
- **Toda mudança de DNS é um pull request com revisão humana.** Em dia normal isso é
  irrelevante. No dia em que o hospedeiro cai e você precisa apontar para outro lugar,
  é a diferença entre cinco minutos e três dias.
- **Eles podem encerrar "a qualquer tempo, por qualquer razão"**, e o ToS diz com todas
  as letras que fazem esforço razoável para avisar antes, mas não são obrigados.
- **O serviço é "as-is", sem garantia de disponibilidade nem permanência**, e vive de
  patrocínio.
- **Eu não posso abrir esse PR por você.** O ToS deles, seção 5, diz que são fortemente
  contra o uso de IA para criar pull requests e que podem fechar o PR e bloquear o autor.
  Teria de ser escrito e enviado por você, à mão.

### C · `centelha-rpg.netlify.app` ou `centelha-rpg.pages.dev` · grátis e imediato

**A favor**

- **Zero atrito.** Um clique no painel, no ar em minutos, sem pedir nada a ninguém, sem
  revisão, sem espera, sem CPF.
- **Tira o site do subdiretório hoje**, que é o que destrava a fase 1 da migração e mata
  o `rehypeBaseLinks`.
- Na PSL, com HTTPS automático.
- **Nada público sobre você.**
- **Reversível para cima:** se depois comprar um domínio, o endereço antigo continua
  funcionando e dá para redirecionar de verdade (aqui o hospedeiro faz 301, coisa que o
  GitHub Pages não faz).

**Contra**

- **Solda a origem à casa.** Este é o defeito estrutural, e é o mais caro: trocar de
  hospedeiro passa a custar a conta inteira da seção 5.1, fichas de personagem inclusas.
- **O nome bom já foi.** `centelha` está ocupado nos três; sobra `centelha-rpg`.
- **Carrega a marca de outra empresa** no endereço do seu livro, para sempre.
- **Depende de um plano gratuito continuar existindo** com as regras de hoje. Nenhum dos
  três prometeu isso a ninguém.
- **No Vercel, uso comercial é proibido** no plano Hobby. Netlify e Cloudflare Pages não
  têm essa cláusula.
- Herda reputação de vizinhança, como qualquer sufixo compartilhado.

### D · `centelha.eu.org` · grátis, bonito, e lento

**A favor**

- **O melhor nome entre os grátis:** neutro, sem piada, sem marca de empresa.
- **Sem custo e sem vencimento**, desde 1996. Não há renovação para esquecer.
- **Delegação de DNS completa**, com liberdade total.
- **Sem restrição de conteúdo relevante para nós.** A política proíbe spam, phishing e
  malware, e diz explicitamente que **não europeus são bem-vindos**. Comércio pequeno é
  desencorajado ("apenas como último recurso"), não proibido.
- Portátil, como A e B.

**Contra**

- **A espera é o problema.** Aprovação manual, e os relatos vão de dias a semanas a
  meses, sem garantia de aceitação. Isso não combina com destravar a fase 1 agora.
- **O único teste que fiz não animou:** os servidores de `eu.org` não responderam uma
  consulta em 2 s pelo 1.1.1.1. É uma amostra de um, e não é prova de nada, mas combina
  com a fama.
- **É um serviço voluntário de trinta anos.** Isso é ao mesmo tempo o melhor argumento a
  favor (durou trinta anos) e o risco (depende de gente).
- Reputação de vizinhança compartilhada.

---

## 8. Por que o `is-a.dev` saiu da frente

Os Termos de Serviço deles, atualizados em **3 de agosto de 2026**, seção 3:

> "Subdomains are intended solely for individuals, software developer groups and
> non-commercial projects that are **related to software development** [...]
> We reserve the right to deny any subdomain registration request for any reason."

E na seção 4, entre as atividades proibidas:

> "8. Commercial, for-profit, or political purposes"
> "14. Blogs that are not primarily related to software development"

O Centelha é um livro de regras de RPG em português. O site tem um motor de ficha, um
bestiário e uma mesa virtual, então há software de verdade aqui, e dá para argumentar.
Mas o texto não fala em "projeto que usa software", fala em projeto **relacionado a
desenvolvimento de software**, e a decisão é de um revisor humano que pode negar por
qualquer razão.

**Isso põe o `is-a.dev` na mesma prateleira do `js.org`:** tecnicamente perfeito,
regulamentarmente do lado de fora. A diferença é que o `js.org` é um não evidente e o
`is-a.dev` é um talvez. Apostar num talvez para depois ter o endereço revogado é o pior
dos mundos, porque revogação depois de publicado custa a conta da seção 5.1.

Some-se a cláusula 4.8: se o Centelha um dia for vendido, ou tiver apoio recorrente, o
endereço fica irregular por consequência do sucesso.

E há a seção 5 do ToS, que me atinge diretamente: eles são **fortemente contra pull
requests criados com IA** e podem fechar o PR e bloquear o autor. Então, se você quiser
tentar mesmo assim, o pedido tem de ser escrito e enviado por você, à mão. Eu não faço
essa parte.

---

## 9. Quando cada uma ganha

- **A (`rec.br`) ganha** se o site vai continuar existindo daqui a três anos, se um dia
  pode ter qualquer forma de dinheiro envolvido, ou se você quer poder trocar de casa
  numa madrugada sem depender de ninguém.
- **C (`netlify.app`) ganha** se a prioridade é destravar a fase 1 esta semana sem gastar
  nada nem esperar, e você aceita conscientemente pagar a conta da 5.1 mais uma vez lá na
  frente.
- **D (`eu.org`) ganha** se você quer o nome bonito de graça e o calendário não aperta.
- **B (`is-a.dev`) ganha** só se você tentar, for aceito, e o projeto nunca ganhar
  dinheiro. Três condições, e a primeira não depende de nós.

**Combinação que eu acho a mais sensata das grátis:** pedir o `eu.org` hoje, subir em
`centelha-rpg.netlify.app` enquanto ele não sai, e mudar quando (e se) sair. O custo
disso é honesto e conhecido: **duas mudanças de origem em vez de uma**, ou seja, a conta
da 5.1 paga duas vezes. É por isso que os R$ 40 continuam parecendo baratos.

---

## 10. O que não fazer

- **Não usar Freenom.** Ver seção 2.
- **Não usar sufixo fora da PSL** (`is-a.software`, `moe.page`, `runs-on.tech`,
  `jsid.dev` e a maioria dos que aparecem em listas de blog). Ver seção 4.
- **Não pedir `js.org`.** A regra deles exclui este site explicitamente.
- **Não pedir `is-a.dev` sem ler a seção 8**, e, se pedir, escrever o PR você mesmo.
- **Não usar Vercel** se houver qualquer chance de o Centelha gerar receita: o plano
  Hobby proíbe uso comercial. Netlify e Cloudflare Pages não proíbem.
- **Não misturar a mudança de endereço com a subida para o Astro 7.** Continua valendo
  o que está no `Migracao_Astro7.md`: superfícies diferentes, riscos de natureza
  diferente, e juntas ninguém sabe qual quebrou o quê.
- **Não deixar o Supabase para depois.** É a única peça que quebra em silêncio.

---

## 11. Com teto de R$ 100, a escolha muda

Com o teto novo, os finalistas passam a ser dois, e a diferença entre eles é de R$ 24 por
ano no primeiro ano.

### `centelha.net` · R$ 64/ano

**A favor**

- **É o nome limpo.** "Centelha ponto net" se diz inteiro numa mesa de jogo, cabe na capa
  de um PDF e ninguém pergunta como se escreve. Nenhuma outra opção viável tem isso: no
  grátis o nome está tomado, e no `.br` o `.com.br` já foi.
- **Sufixo que todo mundo reconhece**, sem precisar explicar o que é.
- **Privacidade de graça.** Registradores internacionais dão ocultação de whois sem
  custo, então seu nome completo não vira registro público. No `.br` isso não existe.
- **Sem CPF, sem cadastro no Registro.br.**
- Portátil, como qualquer domínio próprio.

**Contra**

- **Custa 60% mais que o `.br` hoje, e a distância aumenta.** O `.net` tem teto contratual
  de 10% de aumento ao ano até 2029. Somando dólar e IOF, o valor de daqui a dez anos é
  desconhecido por três motivos ao mesmo tempo.
- **Exposição ao câmbio.** Se o dólar for a R$ 6,50, o mesmo domínio custa R$ 80 sem que
  nada tenha mudado.
- Herda um sufixo genérico, sem a marca de "brasileiro" que o `.br` carrega.

### `centelha.rec.br` · R$ 40/ano

**A favor**

- **R$ 40, em real, e estável.** Dá para travar 10 anos à vista e nunca mais pensar.
- **`rec.br` é a categoria de recreação e jogos**, o que é literalmente o que isto é.
- Diz "brasileiro" sozinho, o que para um livro em português é informação, não enfeite.
- Portátil, e o painel do Registro.br muda DNS em minutos.

**Contra**

- **`.rec.br` é obscuro.** A maioria dos brasileiros nunca viu, e vai achar que faltou
  alguma coisa entre o "centelha" e o "br". `centelha.com.br` resolveria isso e está
  tomado até 2028.
- **Publica seu nome completo** no whois, com CPF mascarado. Não há privacidade de
  domínio no `.br`.
- Exige CPF e cadastro.

### As que perdem, e por quê

- **`centelha.dev` (R$ 66)**: é o mesmo defeito que derrubou o `is-a.dev`, só que
  pagando. `.dev` sinaliza "programador" para um público de jogadores. Seria incoerente
  eu criticar `centelha.is-a.dev` pelo nome e recomendar `centelha.dev`.
- **`centelha.page` (R$ 55)** e **`centelha.xyz` (R$ 61)**: baratos, mas `.page` é uma
  palavra em inglês sem sentido aqui, e `.xyz` carrega fama de sufixo descartável.
- **`centelha.club` (R$ 83)**: "clube" funciona em português e combina com jogo de mesa.
  Perde por preço e por ser menos legível que `.net`.
- **`centelharpg.com.br` (R$ 40)**: o sufixo mais legível do Brasil, com o nome piorado.
  Troca um problema pelo outro.

---

## 12. Diferenças técnicas de verdade, além do nome

A pergunta é justa e a resposta tem três partes: o que muda mesmo, o que muda pouco, e o
que as pessoas acham que muda mas é do hospedeiro e não do domínio.

### 12.1 O maior achado: e-mail · hoje estamos em 2 por hora

Este é o item mais concreto de todo o documento, e não tem a ver com velocidade.

O `/entrar` manda e-mail em dois momentos: confirmação de cadastro (`signUp`, em
`src/lib/auth.ts:54`) e recuperação de senha (`resetPasswordForEmail`, linha 65). Os dois
saem hoje pelo **SMTP embutido do Supabase**, que é limitado a **2 e-mails por hora**, e
esse limite **é igual em todos os planos, inclusive no pago**. O próprio `traduzErro`, na
linha 93, já tem uma tradução para "rate limit", o que sugere que isso já apareceu.

O efeito prático: se três pessoas criarem conta na mesma hora, a terceira não recebe o
e-mail de confirmação e fica sem conseguir entrar, sem entender por quê.

**A saída é SMTP próprio** (Resend, Brevo e afins têm faixa gratuita), e o Supabase sobe
o limite assim que houver um configurado. **Mas SMTP próprio exige um domínio seu**, para
publicar SPF, DKIM e DMARC. Sem isso, ou o provedor recusa, ou a mensagem cai em spam.

Em `centelha-rpg.netlify.app` isso é impossível: os registros de e-mail teriam de estar
na zona da Netlify, que não é sua. Em `centelha.rec.br`, `centelha.net` ou qualquer
domínio próprio, é um punhado de registros TXT e MX.

**Ou seja: comprar o domínio conserta um defeito que já existe hoje**, e não é um luxo
para o futuro. É o único ganho técnico desta análise que se paga sozinho.

### 12.2 Velocidade de DNS: medida, e o `.br` ganha de longe

Medi de duas formas independentes, desta máquina, no Brasil.

**Primeira**, ponta a ponta pelo 1.1.1.1, com nomes aleatórios (que forçam a consulta a
chegar ao servidor do TLD em vez de sair do cache), 7 amostras, mediana:

| sufixo | mediana | mín | máx |
|---|---:|---:|---:|
| `.rec.br` | **38,5 ms** | 34,0 | 43,8 |
| `.com.br` | 42,1 ms | 33,3 | 46,7 |
| `.xyz` | 43,2 ms | 40,3 | 50,5 |
| `.club` | 45,8 ms | 38,8 | 62,2 |
| `.me` | 91,8 ms | 85,3 | 292,4 |
| `.dev` | 95,3 ms | 88,3 | 101,5 |
| `.page` | 96,1 ms | 88,5 | 107,0 |
| `.net` | **160,4 ms** | 154,1 | 532,7 |

**Segunda**, batendo direto nos servidores autoritativos de cada registro, para tirar o
1.1.1.1 do meio. E, no caso do `.net`, testei **as treze letras** de `gtld-servers.net`,
porque seria desonesto condenar o sufixo por uma amostra ruim:

| servidor | mediana |
|---|---:|
| `a.dns.br` (o `.br`) | **30,4 ms** |
| `ns-tld1.charlestonroadregistry.com` (o `.dev`, do Google) | 80,8 ms |
| melhor das 13 letras do `.net`/`.com` (`j.gtld-servers.net`) | **140,9 ms** |
| pior das 13 (`b.gtld-servers.net`) | 263,8 ms |
| `a0.nic.me` | 178,0 ms |

Os dois métodos concordam, e a conclusão é robusta: **do Brasil, o `.br` responde cerca
de 4,6 vezes mais rápido que o `.net`.** Os 140 ms são a cara de uma ida aos Estados
Unidos: esta conexão não está alcançando nó local da Verisign.

**Agora a parte honesta, que é o tamanho disso.** Esse custo só é pago na consulta fria
da delegação, e a delegação fica em cache no resolvedor por cerca de 48 horas. Depois
disso, as consultas vão direto ao nosso DNS autoritativo e o sufixo não entra mais na
conta. Então não são 110 ms por visita: são 110 ms uma vez a cada dois dias, por
resolvedor, e só para quem chegar primeiro.

Para comparar com a régua da própria auditoria: lá, hospedagem estática custava de 52 a
168 ms de FCP e isso foi considerado aceitável. Este número é da mesma ordem, e mais
raro. **É real, é a favor do `.br`, e é pequeno.**

### 12.3 O resto, do maior para o menor

**Subdomínios, e o que eles destravam.** Com domínio próprio dá para pôr
`mesa.centelha.net` num hospedeiro diferente do resto do site, ou atrás de um Worker, sem
tocar na origem principal. Isso é a "facilidade de mudanças" de verdade: se um dia a mesa
precisar de servidor (a auditoria não recomendou, mas o dia pode chegar), ela migra
sozinha e o livro fica onde está. Em `centelha-rpg.netlify.app` não existe subdomínio.

**Pôr um proxy na frente.** Com domínio próprio, a zona pode ficar na Cloudflare
independentemente de onde o site está hospedado, o que dá cache, regras de
redirecionamento, Workers e WAF sem trocar de casa. No subdomínio do hospedeiro, você tem
o que o hospedeiro der, e ponto.

**CAA.** Só em domínio próprio dá para declarar quais autoridades certificadoras podem
emitir certificado para você. É uma linha de DNS que fecha uma porta de emissão indevida.
Em subdomínio de terceiro, quem decide isso é o dono da zona.

**DNSSEC.** O Registro.br assina e liga em um clique, e a adoção no `.br` é alta (o
`centelha.com.br` que consultei está assinado). Nos gTLDs depende do registrador e do
provedor de DNS, e a Cloudflare também faz em um clique. Empate técnico, com vantagem de
simplicidade para o `.br`.

**Trava de transferência.** Domínio gTLD fica **60 dias travado** para transferência
depois do registro e depois de mudança de titular, por regra da ICANN. O `.br` não tem
essa trava. Só importa se você precisar trocar de registrador às pressas.

**HSTS preload.** Coberto em 3.7: `.dev`, `.app` e `.page` já vêm forçando HTTPS. Vale um
redirecionamento, e qualquer domínio consegue o mesmo pedindo em `hstspreload.org`.

**Uma ressalva sobre a Cloudflare Registrar:** ela vende ao custo, mas **obriga o domínio
a usar os servidores de nome dela**. Para nós não atrapalha, e é bom saber antes.

### 12.4 O que NÃO é diferença de domínio, e é fácil confundir

Vale dizer com todas as letras, porque é aqui que a conversa costuma escorregar:

| coisa | de quem é |
|---|---|
| cabeçalhos de segurança (CSP, HSTS, X-Frame-Options, Permissions-Policy) | **do hospedeiro** (`_headers`), e o GitHub Pages não deixa |
| HTTP/3, Brotli, cache, otimização de imagem | **do hospedeiro** |
| redirecionamento 301 de verdade | **do hospedeiro** |
| banda, tempo de build, prévia por PR | **do hospedeiro** |
| velocidade do site depois do primeiro acesso | **do hospedeiro** |
| tamanho do JS, número de nós, repintura do Grid | **nosso**, e a auditoria já mexeu nisso |

Tudo o que está nessa tabela você ganha **saindo do GitHub Pages**, com qualquer endereço,
inclusive o grátis. Não é argumento para pagar por domínio.

---

## 13. Decisão

**A medição da seção 12.2 mexeu na minha recomendação.** Eu vinha defendendo
`centelha.net` por causa do nome. O nome continua sendo o melhor argumento a favor dele,
e agora existe um argumento medido do outro lado: do Brasil, o `.br` responde 4,6 vezes
mais rápido na consulta fria, e custa R$ 24 a menos por ano, num preço que não sobe.

Pesando os dois, eu iria de **`centelha.rec.br`**, e mudei de ideia por três razões
somadas, não por uma:

1. **O número existe e aponta para lá** (30 ms contra 141 ms). É pequeno, e é o único
   número técnico que apareceu separando um domínio do outro. A regra da auditoria vale
   nos dois sentidos: se eu não recomendo mudança sem número, também não ignoro o número
   quando ele aparece.
2. **O público é brasileiro.** O `.br` no fim de um livro em português informa em vez de
   atrapalhar, e o `.rec` deixa de ser obscuro no minuto em que alguém pergunta e a
   resposta é "recreação, é a categoria de jogos".
3. **R$ 40 fixos em real, travados por até 10 anos.** O `.net` sobe até 10% ao ano por
   contrato, mais câmbio, mais IOF.

**`centelha.net` continua a escolha certa se o nome pesar mais que tudo**, e é uma
posição defensável: é o único endereço viável em que "centelha" aparece limpo num sufixo
que qualquer pessoa reconhece. Não é um erro escolhê-lo. É uma troca consciente de
110 ms frios e R$ 24 por ano por um nome melhor.

Se for grátis mesmo assim, **`centelha-rpg.netlify.app`**, sabendo que a conta da seção
5.1 será paga de novo no dia da próxima mudança.

Escolhido o endereço, a fase 1 do `Migracao_Astro7.md` executa sozinha, e eu verifico.
