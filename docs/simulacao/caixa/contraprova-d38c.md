# Contraprova do D38c: `br.pages().length === 1` NÃO cobre o defeito

Revisora, fora de rodada, a pedido do Arquiteto — antes de a ideia do D38c (rodada 38) virar
item de trabalho, testar se ela de fato cobre o que promete.

## O que o Arquiteto pediu para eu checar

Minha sugestão no `38-revisora.md` foi: uma asserção `(await br.pages()).length === 1` no fim
de `test-grid.mjs` fecharia a classe do defeito do D38c (cauda órfã de uma cena rodando contra
o `p` errado, depois de uma chave a mais). O Arquiteto discordou por raciocínio, antes de eu
implementar: o defeito real não deixa página vazada — a página fechada não conta em
`br.pages()`, então a checagem passaria mesmo com o defeito presente. Pediu que eu
reproduzisse a FORMA do defeito e visse se a asserção dispara, em vez de discutir por
argumento.

## A reprodução

Script isolado (`puppeteer` contra `about:blank`, sem Astro/Grid, apagado depois de usar), duas
variantes:

**A · a cauda órfã toca a página JÁ FECHADA** (o que aconteceu de verdade na rodada 38):

```
EXCECAO CAPTURADA: Execution context was destroyed
br.pages().length no fim = 1
A checagem PASSARIA (não dispara, defeito passa calado)
```

**B · a cauda órfã toca a página de OUTRA cena, ainda ABERTA** (a classe vizinha que o
Arquiteto suspeitava): sem exceção nenhuma, roda calada.

```
br.pages().length no fim = 1
A checagem PASSARIA (não dispara, defeito passa calado)
```

## O resultado

**A checagem NÃO dispara em nenhuma das duas variantes.** O Arquiteto estava certo, e a
minha sugestão estava otimista pelo motivo exato que ele apontou:

- Na variante A (o defeito de verdade), a cauda órfã LANÇA uma exceção real — mas isso já é
  sinal suficiente por conta própria (o processo cai, `exit != 0`), sem precisar de nenhuma
  asserção nova. A checagem de página não acrescenta nada aqui: ela só confirmaria, depois do
  fato, que nenhuma página ficou pendurada — o que é verdade, mas irrelevante para o defeito.
- Na variante B (a classe vizinha, mais perigosa), a cauda órfã roda **sem lançar nada**,
  contra uma página que genuinamente existe e vai ser fechada normalmente pela cena dona
  dela. Não sobra página extra, não falta página nenhuma — `br.pages().length` termina exatamente
  igual ao caminho feliz. Esta é a forma silenciosa que mais importa, e a checagem proposta
  não a vê.

## A classe continua descoberta

Não achei, neste levantamento, uma checagem igualmente barata que cubra a variante B. O que
tornaria essa classe detectável precisaria de uma marca por CENA (por exemplo, cada função de
cena recebendo/gravando um identificador próprio e cada chamada a `p.evaluate`/
`p.waitForSelector` dentro dela conferindo que está operando na página que ELA abriu, não
numa emprestada) — isso é instrumentação de cada cena, não uma asserção única no fim do
arquivo, e é ordem de esforço maior do que o que motivou a sugestão original.

**Registro com todas as letras, como pedido: a classe do D38c continua sem cobertura barata
conhecida.** A defesa real contra ela, hoje, é a mesma que já existia antes desta
investigação — reler o diff com atenção ao inserir uma cena nova perto de outra, e rodar o
teste de verdade antes de reportar pronto (o que a própria Executora já fez, e foi assim que
achou o defeito original).

## Veredito da contraprova

A ideia do D38c registrada no `38-revisora.md` não deve virar item de trabalho como estava
proposta — mediria a coisa errada. Não escalo pedindo que o Arquiteto construa nada; deixo
registrado que a lacuna é real e permanece aberta, sem solução barata encontrada.
