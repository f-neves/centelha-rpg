# Rodada 116 · despacho · unifica o arredondamento do Livre (resposta à pergunta da Revisora na 114)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, respondendo à PERGUNTA da Revisora no veredito da 114
(`114-revisora.md`, §2): o "Livre" tinha duas regras de arredondamento, uma na tabela de Renda
(por Recursos, `arred`) e outra na de Serviços (por perfil, `inteiro`, decidida na própria 114).
Pino: `e9a41f1`.

## 0 · Onde

Mesma árvore/branch. Se a rodada 115 ainda estiver aberta na sua árvore (o despacho da 115,
`115-despacho.md`, está em paralelo), **aplique este primeiro**, antes de gerar
`src/data/recompensas.json`: a tabela de capacidade da 115 (Tarefa 4) deriva do `Livre/Ano` de
`renda.json`, e este despacho muda esse número em três faixas. Se você **já gerou**
`recompensas.json` com os valores antigos, regenere depois de aplicar esta mudança. `git
status --short` vazio antes de começar, `git fetch origin`, `git merge-base --is-ancestor
executora origin/main`, `git switch -C executora origin/main`.

## 1 · A decisão do autor

1. **Regra única para o Livre: pc inteiro, meio para cima, em toda tabela** (Renda por Recursos e
   Serviços por perfil). **Sai a regra `arred` do Livre da tabela de Renda.**
2. **Fórmula única, já em uso nos perfis:** `Livre = Renda × 0,12 × (60/Renda)^0,35`, inteiro meio
   para cima (a mesma `livre_frac`/`inteiro` de `lore/economia/v2/modelo.py`, hoje usada só na
   tabela de perfis).
3. **Valores esperados na tabela de Renda** (Livre/Sem e Livre/Ano = Livre/Sem × (48 − 4 ×
   Recursos)): Braçal 7 / 308; Destreinado 10 / 440; Treinado 19 / 760; Especialista 30 / 1.080;
   **Doutor 39 / 1.404**; **Abastado 56 / 1.792**; Rico 85 / 2.720; **Aristocrata 114 / 3.192**;
   Nobreza 200 / 4.800. **Só Doutor (40→39), Abastado (55→56) e Aristocrata (110→114) mudam**; as
   outras seis já batiam com o `inteiro`.
4. **Se o capítulo citar os valores antigos** (40, 55, 110, ou os Livre/Ano antigos 1.440, 1.760,
   3.080), atualize e relate cada ocorrência (arquivo:linha, antes/depois). **Já conferi**
   `Acoes_Sistema.md` (não cita nenhum destes números). **Não toque em
   `lore/economia/estado-revisao.md`**; se achar os valores antigos lá, só relate, não edite (é do
   Comerciante/autor).
5. **Coordenação com a 115:** a tabela de capacidade de `recompensas.json` deriva do `Livre/Ano`
   corrigido; a tabela de "Valor do degrau" (15 × 1,75^n) da 115 **não muda**.

## 2 · Onde mexer

**Achado, para orientar (confirme na sua árvore):** a única linha que precisa mudar é
`lore/economia/v2/modelo.py:200` (`livre = arred(renda * f)`, na montagem da tabela de faixas de
Recursos). Troque para `inteiro(renda * f)`, igual à linha 331 (a tabela de perfis, já correta
desde a 114). Regere pelo fluxo normal (`gerar.py` + `copiar-economia.mjs`); não edite
`src/data/renda.json` à mão.

## Verificação

- Os 9 valores de Livre/Sem e Livre/Ano da tabela de Renda, lidos no `dist/`, batem com a lista do
  item 1.3 acima.
- **Nenhuma outra célula da tabela de Renda muda** (Renda/Sem, Custo/Sem, Recursos, Faixa
  continuam iguais).
- `npm run validate` e `npm run build` verdes.
- **A Revisora confere os 9 valores e que não restou nenhuma segunda regra de arredondamento para
  o Livre em `modelo.py`** (grep por `arred` perto de `livre` deve mostrar só a tabela de perfis,
  que já usa `inteiro`, e nenhuma chamada de `arred` sobre `livre` em lugar nenhum).

## O relato

Pode entrar no mesmo relato da 115, numa seção própria ("Rodada 116"), ou num `116-executora.md`
curto, como preferir: os 9 valores antes/depois, as ocorrências do item 1.4 (mesmo que a resposta
seja "nenhuma"), e se `recompensas.json` precisou ser regerado por causa da ordem de execução.
