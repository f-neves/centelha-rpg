# Progresso · contraprova do D38c (a asserção `br.pages().length` cobre o defeito de verdade?)

Sinal de vida. Não é rodada, sem aviso na caixa. Uma linha por etapa, hora lida de `date +%H:%M`.

- 03:56 — começando. Vou reproduzir a FORMA do defeito (partir uma cena em duas com uma chave a mais, deixando a cauda órfã rodar contra uma página já fechada) num arquivo isolado, fora da árvore real, e testar se `(await br.pages()).length === 1` no fim dispararia ou não.
- 03:57 — reproduzido em duas variantes (script à parte, `puppeteer` contra `about:blank`, apagado
  depois): (A) a cauda órfã toca a página JÁ FECHADA (o defeito real) — lança exceção de verdade
  ("Execution context was destroyed"), mas `br.pages().length` termina em 1 mesmo assim (a página
  fechada não conta); (B) a cauda órfã toca a página de OUTRA cena, ainda ABERTA — roda calada,
  sem lançar nada, e `br.pages().length` também termina em 1. **A checagem NÃO dispara em
  NENHUMA das duas.** O Arquiteto estava certo: a ideia mede página vazada, e o defeito de
  verdade não vaza página nenhuma — ou lança (e o crash já é o sinal, sem precisar da checagem)
  ou roda silenciosa contra estado alheio sem deixar rastro no número de páginas.
- 03:58 — registro escrito (`contraprova-d38c.md`): a ideia não deve virar item de trabalho
  como estava proposta, a classe continua sem cobertura barata conhecida, registrado com
  todas as letras em vez de comprar sossego falso. Commitando e empurrando agora. Terminado.
