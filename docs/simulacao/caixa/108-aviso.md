# Rodada 108 · aviso de revisão · a "Compostura" volta ao Atributo, e o "alvo" deixa de ser Dificuldade

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `626cc4e` · o despacho da 108 |
| **SHA do trabalho** | `098360b` · a faixa é `626cc4e..098360b` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §0.1, o §0.2, o §6 e o §7 do seu contrato valem. **O caminho da sua árvore mudou** (D10): o Passo 0
dá `C:/Users/Neves/ClaudeCode/centelha/centelha-techlead-revisora`, e a cópia do contrato na sua árvore
passa a dizer isso quando você reancorar. **Saída temporária em `../tmp/revisora/`** (`CLAUDE.md`,
"Saída temporária", `b7fa5b2`). Progresso em `progresso-revisora-108.md`, veredito em `108-revisora.md`.

**A faixa tem três commits:** `a26fda1` (a Compostura), `050ba5f` (o "alvo") e `098360b` (relato e
progresso). Entre a sua âncora (`ae1c526`) e a BASE há commits do Arquiteto, de registro e documento
(`0dea8a5`, `ad23b04`, `3c647fd`, `49f37cc`, `f679437`, `d0662e6`, `b7fa5b2`), fora da revisão; o
`b7fa5b2` mexe no `test-portoes.mjs` (seção 7, a rede da pasta `centelha\`), e se quiser conferir o
ensaio dos três sentidos dela, é bem-vindo, mas não é o centro.

## Duas partes

### Parte 1 · a revisão da faixa

O que eu mais quero que você aperte:

- **A prova da Compostura é o link VOLTAR ao Atributo.** A tabela do relato (§1) diz 43 → 0 para a
  Integridade e 8 → 46 para o Atributo. Meça com o SEU medidor e confira página por página. A
  Executora diz que 5 "Compostura" seguintes ficaram sem link pela regra de um link por verbete por
  bloco (o Atributo cresce 38, e não 43): confira que é isso e não outra coisa.
- **O "alvo":** 278 → 0, e 3 links novos "Dificuldade"/"Dif" que ela lê como a vaga do verbete
  liberada no mesmo bloco (mestre, acoes-e-sistema, coracao-do-sistema). Confira os três.
- **O bestiário.** Ela diz que o `bestiario` não mede: quatro medições seguidas no mesmo `dist/` deram
  493, 882, 747 e 493 links, porque o autolink roda uma vez e pega os cartões que existirem naquele
  instante; os 131 links "novos" dele na foto seriam ruído do instrumento. **Teste isso**, e diga se o
  conserto pode ter mudado algo no bestiário que o ruído esconde.
- **O controle negativo** (§4 do relato): reproduziu 43 e 278. Confira por outro caminho.
- **O CI** pelo run inteiro dos três commits.

### Parte 2 · a medição dos outros apelidos, SEM conserto

O humano quer o total de links errados dos nove apelidos antes de decidir se isso é rodada, frente ou
conserto de raiz. Meça, com build limpo e o mesmo medidor, **cada uma das linhas da tabela do seu
`104-revisora.md` §5 além do "alvo" e da "Compostura"**, uma por uma. **São oito linhas, e não sete**:
Ticks ← "Velocidade", Nível ← "Nível", Margem ← "Margem", Centelha ← "poder", Defesa ← "esquiva" /
"bloqueio", Valor Passivo ← "passiva", Técnica ← "poder", Firula ← "manobra". O "sete" do seu texto da
104 provavelmente não contou a Margem, onde a palavra é o próprio termo do verbete e não um apelido:
diga qual era a conta.

Para cada linha: o total de links, as páginas, e **quantos estão no sentido errado**, lendo, não
supondo. Onde a amostra de 10 não bastar para decidir, leia mais, e diga quantos leu. Onde o sentido
for misto (o "Nível" já era), separe. **Fora do `bestiario`**, ou com o bestiário à parte e marcado,
por causa do ruído da parte 1.

No fim, uma tabela só: verbete ← palavra, total, errados, páginas, lidos; e a soma dos errados das
oito linhas, mais os 321 da Compostura e do "alvo". **Não conserte nada**: é para o humano decidir.
