# Qual endereço o Centelha vai ter

Documento de decisão, 14/08/2026. Companheiro de `Migracao_Astro7.md`, que na fase 1.1
manda "escolher o hospedeiro". Este aqui responde à pergunta anterior a essa: **qual
endereço**, porque o endereço é o que fica, e o hospedeiro é o que se troca.

Hoje o site mora em `https://f-neves.github.io/centelha-rpg/`.

---

## 1. A resposta curta

**O melhor endereço grátis disponível é `centelha.is-a.dev`.** Está livre (verifiquei
por dois caminhos independentes), está na Public Suffix List, é um CNAME, e por ser um
CNAME ele sobrevive a qualquer troca de hospedeiro no futuro.

**Mas eu discordo da premissa, e o número é R$ 40 por ano.** A seção 6 explica: a nossa
arquitetura cobra um preço concreto por cada mudança de endereço, e esse preço se paga
uma vez por endereço, não uma vez por hospedeiro. Um domínio comprado é o único que
garante que a conta seja paga uma vez só. `centelha.rec.br` está livre no Registro.br.

Se a resposta for "grátis, e ponto", a seção 7 tem o passo a passo do `is-a.dev`.

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
| `centelha.is-a.dev` | **LIVRE** | registro devolve 404; a página curinga diz "Available Domain" |
| `centelha.js.org` | livre, porém inelegível | não consta na lista de 3.909 nomes ativos |
| `centelha.pages.dev` | **ocupado** | HTTP 200, título "Centelha · online atelier" |
| `centelha.vercel.app` | **ocupado** | HTTP 200, título "Alohomora AI" |
| `centelha.netlify.app` | **ocupado** | HTTP 200 com 10.423 bytes (nome inexistente devolve 404 com 50) |
| `centelha-rpg.pages.dev` | livre | conexão recusada (sem certificado emitido) |
| `centelha-rpg.netlify.app` | livre | HTTP 404, 50 bytes, igual ao nome aleatório |
| `centelha-rpg.vercel.app` | livre | HTTP 404, 107 bytes, igual ao nome aleatório |
| `centelha.eu.org` | indeterminado | os servidores do `eu.org` não responderam em 2 s |

**O nome limpo "centelha" está tomado nos três hospedeiros e livre no `is-a.dev`.** Nos
hospedeiros sobra `centelha-rpg`, que é mais feio e ainda por cima preso à casa.

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
`rpg.br`; a API do Registro.br respondeu "Categoria inválida". Não existe.)

---

## 4. Os candidatos que sobram

| | endereço | grátis | raiz do site | portátil | espera | risco |
|---|---|:---:|:---:|:---:|---|---|
| A | ficar em `f-neves.github.io/centelha-rpg/` | sim | **não** | não | zero | nenhum, mas trava a fase 1 |
| B | `centelha-rpg.pages.dev` (ou `.netlify.app`) | sim | sim | **não** | zero | preso ao hospedeiro |
| C | **`centelha.is-a.dev`** | sim | sim | **sim** | horas a dias | projeto voluntário |
| D | `centelha.eu.org` | sim | sim | **sim** | semanas a meses | aprovação manual, sem garantia |
| E | `centelha.js.org` | sim | sim | sim | — | **inelegível** |
| F | `centelha.rec.br` | R$ 40/ano | sim | **sim** | minutos | nenhum |

**E está fora por regra, não por gosto.** O js.org exige, com todas as letras, que o
site seja "*diretamente* relacionado ao ecossistema/comunidade JavaScript (como pacotes
NPM e ferramentas JS, não páginas pessoais nem portfólios)". Um livro de RPG em pt-BR
não passa. Pedir seria gastar o tempo de um voluntário para levar um não.

**A está fora porque é justamente o que a fase 1 existe para desfazer.** Enquanto o site
viver num subdiretório, o `base` continua atravessando o `astro.config.mjs`, o `url()`
de `src/lib/site.ts`, o manifesto, o escopo do service worker, o ferramental e o
workflow, e o `rehypeBaseLinks` continua sendo um dos três plugins que nos prendem ao
pipeline `unified` em vez do Sätteri do Astro 7.

---

## 5. O que a PSL faz por nós, com um caso real

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

## 6. O que a nossa arquitetura cobra por uma mudança de endereço

Aqui é onde a análise deixa de ser sobre domínios e passa a ser sobre este projeto.

**Tudo que dói numa mudança está preso à origem, não ao hospedeiro.**

### 6.1 O que os leitores perdem

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

### 6.2 O que nós temos de mexer

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

### 6.3 A conta que decide

Esse custo se paga **por mudança de origem**. Então a pergunta certa não é "qual
endereço é melhor hoje", é **quantas vezes vamos pagar isso**.

- Opção B (`centelha-rpg.pages.dev`) solda a origem à casa. No dia em que a Cloudflare
  mudar o plano gratuito, ou em que a mesa precisar de algo que ela não faça, mudar de
  casa é mudar de origem **de novo**, e a conta da 6.1 vem pela segunda vez.
- Opções C, D e F são CNAME. Trocar de hospedeiro vira editar um registro de DNS, e a
  origem não se mexe. Os leitores não perdem nada, o Supabase não muda, o Search
  Console não muda.

**Essa é a razão técnica da recomendação, e ela não tem nada a ver com o preço.** Entre
grátis-preso e grátis-portátil, portátil ganha por uma diferença que se mede em fichas
de personagem perdidas.

E é a mesma razão pela qual eu ponho os R$ 40 na mesa. C e D são portáteis **enquanto
existirem**. O `is-a.dev` vive de um patrocínio da Cloudflare, declarado no README
deles: "não conseguiríamos operar sem essa ajuda". O `eu.org` é um serviço voluntário
desde 1996, que responde e-mail "quando houver intervenção humana". Nenhum dos dois vai
sumir amanhã, e os dois podem sumir. Um domínio comprado é o único em que a promessa de
"uma mudança de origem só, para sempre" depende apenas de a gente lembrar de pagar.

R$ 40 por ano são R$ 3,33 por mês. A conta da 6.1, paga uma vez a mais, custa mais que
dez anos disso.

---

## 7. Se for grátis: `centelha.is-a.dev`, passo a passo

O `is-a.dev` guarda os nomes num repositório público no GitHub, um arquivo JSON por
nome, e publica na infraestrutura da Cloudflare. Mudança é *pull request* com revisão
humana, o que leva de algumas horas a alguns dias.

1. Escolher e criar o projeto no hospedeiro (fase 1.1 do `Migracao_Astro7.md`) e anotar
   o endereço `*.pages.dev` ou `*.netlify.app` que ele der.
2. Adicionar o domínio `centelha.is-a.dev` como domínio personalizado no hospedeiro.
3. Abrir PR em `is-a-dev/register` criando `domains/centelha.json`:

```json
{
  "owner": { "username": "f-neves", "email": "neves.mecanica@gmail.com" },
  "records": { "CNAME": "centelha-rpg.pages.dev" }
}
```

4. Esperar a revisão.

**Um detalhe que morde, e é específico da Cloudflare Pages:** justamente por o
`is-a.dev` estar na PSL, **o painel da Cloudflare não aceita adicionar esse domínio**.
Tem de ser pela API, e a documentação do próprio `is-a.dev` traz o procedimento e uma
interface pronta em `cf-pages.is-a.dev` para fazer isso. Com **Netlify ou Vercel o
problema não existe**: é CNAME e pronto, e há guia oficial do `is-a.dev` para os dois.

Ou seja: se a escolha for `is-a.dev`, **Netlify é o caminho com menos atrito**, ao
contrário do que a auditoria sugeriu quando só se olhava banda. Se a escolha for
Cloudflare Pages, é uma volta a mais, uma vez só.

O preço estético, que eu não vou disfarçar: `centelha.is-a.dev` se lê "centelha is a
dev". A piada é de portfólio de programador e não combina com um livro de RPG em
português. Para quem joga, é um endereço estranho. Para nós, é um CNAME perfeito.

---

## 8. Se der para esperar: `centelha.eu.org`

É o melhor nome entre os grátis: neutro, sem piada, sem marca de hospedeiro. Registro
sem custo e sem vencimento, com delegação de DNS completa, desde 1996.

O que atrapalha: a aprovação é manual, e os relatos vão de "alguns dias" a semanas ou
meses, sem garantia de aceitação. E o único teste que fiz não foi animador: os
servidores de `eu.org` não responderam uma consulta em 2 s pelo 1.1.1.1. É uma amostra
de um, não é prova de nada, mas combina com a fama.

Caminho razoável se quiser esse nome: **pedir o `eu.org` hoje e não esperar por ele.**
Subir no `is-a.dev` ou no subdomínio do hospedeiro enquanto isso e, se sair, aí sim
decidir se vale a mudança de origem (que custa a conta da 6.1). Ou seja: pedir é grátis,
mas trocar depois não é.

---

## 9. O que não fazer

- **Não usar Freenom.** Ver seção 2.
- **Não usar sufixo fora da PSL** (`is-a.software`, `moe.page`, `runs-on.tech`,
  `jsid.dev` e a maioria dos que aparecem em listas de blog). Ver seção 5.
- **Não pedir `js.org`.** A regra deles exclui este site explicitamente.
- **Não subir num subdomínio do hospedeiro "por enquanto".** Não existe "por enquanto"
  numa origem: cada troca cobra a conta da 6.1 outra vez.
- **Não misturar a mudança de endereço com a subida para o Astro 7.** Continua valendo
  o que está no `Migracao_Astro7.md`: superfícies diferentes, riscos de natureza
  diferente, e juntas ninguém sabe qual quebrou o quê.
- **Não deixar o Supabase para depois.** É a única peça que quebra em silêncio.

---

## 10. Decisão

Precisa de uma escolha, e ela é sua. As três que fazem sentido:

1. **`centelha.rec.br`**, R$ 40/ano no Registro.br. Melhor nome, categoria certa
   (recreação e jogos), portátil, sem depender de voluntário nenhum. É o que eu faria.
2. **`centelha.is-a.dev`**, grátis, disponível hoje, portátil, com nome esquisito para
   o público do site. Melhor opção grátis, e melhor com Netlify que com Cloudflare.
3. **`centelha-rpg.pages.dev`**, grátis e imediato, sem nenhuma espera nem PR, ao preço
   de amarrar a origem à Cloudflare para sempre.

Escolhido o endereço, a fase 1 do `Migracao_Astro7.md` executa sozinha, e eu verifico.
