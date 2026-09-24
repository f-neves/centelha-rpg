# Rodada 105 · despacho · quem ajuda a fabricar, e o teto da demanda

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> Pedido do humano em 24/09/2026, vindo da revisão econômica: aplicar a decisão do autor sobre a
> G19 e a G20, e registrar (sem corrigir) a G24. Progresso em `progresso-105.md`, relato em
> `105-executora.md`. A Revisora fecha.

## 0 · Onde

Na sua árvore, `C:/Users/Neves/ClaudeCode/centelha-executora`, na branch `executora`. Ao começar:
`git status --short` vazio, `git fetch origin`, `git merge-base --is-ancestor executora origin/main`
(tem de dar verdadeiro) e `git switch -C executora origin/main`. Publicação como sempre: fetch, rebase
`origin/main`, `git push origin HEAD:main`, e aviso em vez de força se não for fast-forward. Nada de
`npm install`.

## 1 · A decisão do autor, com as palavras dele (G19 e G20)

> A Direção a Dificuldade 4 é regra de OBRA (construção: alvenaria, engenharia, naval, carpintaria
> de construção, as obras das tabelas de semanas e estações). Na FABRICAÇÃO de peças vale a regra
> nova: "Quem ajuda a fabricar sob a condução de alguém que cumpre o Requisito da peça não precisa
> cumprir o Requisito, mas trabalha contra a Dificuldade da peça: se a média não passar dela, não
> soma Acúmulo."

E o que ele pediu que fique explícito: o parágrafo de Direção vale para **obra**; o exemplo "dez
aprendizes aceleram uma espada Comum" (parágrafo Ajuda) funciona pela regra nova (os aprendizes
dispensam o Requisito sob condução e somam porque a média deles passa da Dificuldade 7), e **um
braçal (média 7) não soma na espada**.

## 2 · Onde mexer

Os dois lados, capítulo e documento de regra, dizendo a mesma coisa:

- `src/content/chapters/acoes-oficio-e-mundo.md`: o bloco do Requisito (cerca de `:18-47`, e a linha
  da tabela que diz "nenhum modificador abre a porta" tem de acomodar a condução) e os parágrafos
  **Ajuda** e **Direção de obra** (cerca de `:115-121`);
- `Acoes_Sistema.md`: o espelho no §7.3 (cerca de `:1077-1080`, a frase "O ajudante sob direção
  (§7.6) não tem Requisito nenhum", que hoje só conhece a obra) e o §7.6 (cerca de `:1165-1203`).

Os números acima são do `origin/main` em `ec23403`; ache por texto e não por linha.

**Três conferências antes de escrever, e o resultado vai no relato:**

1. **A Dificuldade da espada Comum é 7**, pela tabela do próprio capítulo? Cite a linha.
2. **"Aprendiz" tem número no livro?** A frase do autor afirma que a média deles passa de 7. Pela
   régua da média da Longa (soma 4 dá 7, soma 5 dá 9), isso quer dizer soma 5 ou mais. Se o livro
   define o aprendiz com uma soma (ou uma Habilidade de ofício) que dá média 7 ou menos, **não
   invente número nem reescreva o aprendiz**: escreva a regra, e traga a contradição no relato como
   PRECISA DE MIM. Se o livro não define, escreva o exemplo sem inventar a soma dele além do que a
   frase do autor já diz.
3. **"Sucesso é total maior que a Dificuldade"** (a média 7 contra 7 não passa): confira que é a
   régua escrita do livro, para "um braçal (média 7) não soma" estar certo pela letra.

**Fora desta rodada:** a G18 (a regra de apoio, documento contra site), que é decisão separada; a
G21, a G22 e a G23; e qualquer outro texto do capítulo.

## 3 · A G24, só registro

No `docs/pendencias/G-acoes-sistema.md`, depois da G23, um item novo, **sem corrigir nada**:

> **G24 · [DECIDIR] Semântica do teto de demanda do ganho de ofício.** Levantado em 24/09/2026.
> `acoes-oficio-e-mundo.md:198-200` e `Acoes_Sistema.md:1295-1299`: "uma aldeia absorve talvez 50
> pc por semana de qualquer ofício" representa o valor bruto das mercadorias vendidas, ou o
> ganho (valor adicionado) do artesão? O texto diz "Ganho por semana [...] limitado pela demanda do
> lugar"; "absorve" sugere gasto bruto. Muda quantas peças o mercado absorve (numa cidade, 500 pc:
> 2 espadas se for bruto, cerca de 3 se for líquido).

As linhas citadas conferidas contra o arquivo no momento do commit (o portão de procedência lê).

## 4 · Fechar G19 e G20

Caixa `[x]` nas duas, com a decisão citada no próprio item (a frase do autor, a data 24/09/2026 e o
sha do commit que a aplicou). Depois `node scripts/gen-pendencias.mjs`, e o `Pendencias.md`
regenerado entra no mesmo commit.

## 5 · A prova

- `npm run validate` e `npm run build` verdes; o gancho de `pre-commit` roda o resto.
- **Travessão lendo os arquivos**, não o diff: zero linha acrescentada com travessão.
- O commit que toca `src/` abre com a linha do que muda para quem joga (quem ajuda a forjar uma peça
  sob condução não precisa do Requisito mas precisa passar da Dificuldade dela; a Dificuldade 4 da
  direção fica só para obra; sem migração).

## 6 · O relato

`105-executora.md`, as quatro seções (ENTROU · PRECISA DE MIM · QUEBROU · BLOQUEADO), com o que
mudou em cada arquivo e o sha publicado, e as três conferências da seção 2.
