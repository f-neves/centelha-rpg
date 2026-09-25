# Rodada 109 · despacho · o tamanho da J13 primeiro, depois o que a regra dos dois donos derruba (J12)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 25/09/2026

Liberada pelo humano em 25/09/2026, depois do veredito da 108. **Só medição, nenhum conserto.**
Progresso em `progresso-109.md`, relato em `109-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha/centelha-executora`, branch `executora`. Ao
começar: `git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora
origin/main` e `git switch -C executora origin/main`. Publicação como sempre, sem força e sem
`npm install`.

**Saída temporária em `../tmp/executora/`**, nunca em `../` sozinho (`CLAUDE.md`, "Saída
temporária"; a rede é a seção 7 do `test-portoes.mjs`).

**"Build limpo" mudou de definição** (`CLAUDE.md`, commit `a97a052`): é o build seguido da prova no
gerado (o `dist/ref-index.json`, ou o HTML da página), nunca remoção de pasta. Se o build parecer
servir HTML velho, use `npx astro build --force`.

## 1 · Parte 1 · o tamanho da J13, e vai PRIMEIRO

`docs/pendencias/J-infraestrutura.md`, item J13. Quem abre o bestiário sem `#` na URL recebe
autolink só nas fichas que já existiam quando o `ref-index.json` chegou (493 links medidos pela
Revisora, contra 1670 com a página inteira aberta por `bestiario/#medir-tudo`). Isto é anterior à
108 e atinge todo leitor que abre a página do jeito normal.

**O que trazer, medido e não estimado:**

1. **Por que o autolink roda uma vez só.** Leia `Referencias.astro` (o `start()`, linha ~288, e o
   comentário de `:263-284` sobre o índice só baixar onde há prosa). Diga se há razão técnica para
   rodar uma vez só, ou se é só como foi escrito.
2. **Pode rodar de novo quando as fichas acabam de montar?** O `bestiario.astro` expõe o fim da
   montagem (`montarAosPoucos`, `:557-563`, que para quando `restam` chega a zero). Investigue se dá
   para chamar `autolink()` de novo nesse ponto, e **o que isso duplica**: a função de `autolink`
   reconstrói o `used` do zero a cada chamada (`Referencias.astro:54-58`), então uma segunda chamada
   pode gerar link duplicado nos blocos que já tinham sido escaneados na primeira passada (o
   `main` inteiro é escopo de fallback em `DIV`/`SPAN` fora de bloco, `:57`). **Teste isso de
   verdade**: rode a segunda passada e meça se algum link dobrou, por (verbete, página, palavra),
   não só a contagem total.
3. **O custo, medido e não estimado.** `bestiario.astro:530-541` registra que a página tinha 40.146
   nós e 12,7s até a primeira ficha aparecer antes da montagem em fatias, contra 2,8s depois. Meça
   quanto tempo `autolink()` gasta rodando sobre as 309 fichas montadas de uma vez (o caso
   `#medir-tudo`), no mesmo instrumento que mediu aquilo (ou o `driver.mjs` do skill
   `run-centelha-rpg`, adaptando). Compare com o tempo do caminho de hoje (autolink rodando cedo,
   sobre 40 fichas).
4. **Quais outras páginas montam conteúdo em `main` depois do `requestIdleCallback`.** O comentário
   de `Referencias.astro:273-278` cita a Ficha (`ficha-engine.ts`, montada por JS depois do
   `load`). Liste toda página assim (procure por inserção em `main` fora do parse inicial do HTML:
   `personagem.astro`, `ficha`, o que mais achar), com uma contagem de antes/depois do autolink em
   cada uma, não só o bestiário.

**Pare aqui.** Nenhum conserto na Parte 1. `109-executora.md` §1 traz os quatro números/achados, e o
humano decide se e como o autolink roda de novo.

## 2 · Parte 2 · o que a regra dos dois donos derruba (J12)

`docs/pendencias/J-infraestrutura.md`, item J12. A regra proposta pelo humano: **o autolink não casa
palavra solta que tenha mais de um dono no glossário** (mais de uma entidade com essa palavra em
`termo`/`apelidos`). Ela se aplica a quatro palavras: `poder` (Centelha, Técnica), `esquiva`
(Defesa, Habilidade Esquiva), `bloqueio` (Defesa, Habilidade Bloqueio) e, por dono de NOME e não de
apelido, `integridade` (termo Integridade, Habilidade Integridade).

**Implemente a regra num EXPERIMENTO, sem tocar no `glossario.json`.** A forma mais simples: numa
cópia local de `Referencias.astro` (ou um script de scratchpad que reimplemente o `autolink()`
lendo o `ref-index.json`), quando uma palavra normalizada casar com mais de uma entidade
autolinkável, pule a palavra inteira (não linke nenhuma das duas). Rode contra o `dist/` do pino
(a foto por página, a mesma dos `medir-*.mjs` da 104/108, no scratchpad da sessão antiga do
Arquiteto: `medir-autolink.mjs`/`medir-autolink-rev.mjs`; copie o que usar para
`../tmp/executora/`).

**Três números, por (verbete, página, palavra), lendo e não supondo:**

1. **Quantos links ERRADOS a regra mata.** A estimativa é 54 (37 de "poder", 13 de "esquiva", 4 de
   "bloqueio"). Confirme ou corrija.
2. **Quantos links CERTOS ela mata junto, e quais.** O `integridade` é o caso conhecido (mataria os
   2 corretos da própria 108, e qualquer "Integridade" futura). Veja se há outro: qualquer palavra
   com dois donos que hoje acerta o sentido por ordem de agulha perde o link também, mesmo quando o
   sentido estava certo.
3. **O que sobra depois dela, por apelido**, nas quatro linhas afetadas (Centelha←poder,
   Técnica←poder, Defesa←esquiva, Defesa←bloqueio): quantos links ficam sem nenhum link (nem para o
   sentido certo nem para o errado), porque a regra apaga os dois lados.

**Se em algum verbete a regra matar mais link certo do que errado, diga isso explicitamente** — é o
critério que o humano deu para ela não entrar naquele verbete.

**Desfaça o experimento** (nada entra no `glossario.json` nem em `Referencias.astro` versionado)
no mesmo comando, como o controle negativo da 108. `109-executora.md` §2 traz a tabela dos três
números, o veredito por verbete ("entra" / "não entra", pelo critério acima) e nada consertado de
verdade.

## 3 · Fora

O monte B, a migração 33, a fase 4, o desfazer da voz, e os itens da lista única que esperam o
humano. Nenhum conserto nesta rodada, nas duas partes: é levantamento.

## 4 · O relato

`109-executora.md`, duas seções (Parte 1 e Parte 2), com os shas de nenhum commit de código (só
documento, se algum) e os arquivos de medição em `../tmp/executora/`. `progresso-109.md` desde a
primeira etapa, uma linha por etapa pequena.
