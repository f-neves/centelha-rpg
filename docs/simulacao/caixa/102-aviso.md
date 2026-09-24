# Rodada 102 · aviso de revisão · o remendo da Bravura e a Perfuração com um dono só

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `badd087` · o despacho da 102 |
| **SHA do trabalho** | `a305665` · a faixa é `badd087..a305665` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

O §6 e o §7 do seu contrato valem.

## ANTES DE TUDO: esta é a primeira rodada com a sua branch própria

O `CONTRATO-REVISORA.md` ganhou o **§0.1** em 24/09/2026 (commit `badd087`, dentro da BASE): a sua
árvore passa a trabalhar na branch `revisora`, e o congelamento continua. **O reancoramento desta
rodada é o do §0.1, e não o `checkout --detach`:**

```
git merge-base --is-ancestor HEAD origin/main       # o seu veredito da 101 (2acb5a4) está no main?
git switch -C revisora <sha-deste-aviso>
```

(Na primeira vez a branch `revisora` ainda não existe, então confira o HEAD, que é o seu veredito da
101.) **Se a conferência falhar, PARE e me avise.** O passo 0 ganha a linha
`git branch --show-current`, que tem de dar `revisora`. Leia o §0.1 inteiro antes: se ele estiver
ambíguo ou errado, isso é achado desta rodada, e é o primeiro.

## O que esta faixa faz

Duas partes, as duas decididas pelo humano:

1. **O remendo da Bravura** (o a2 da 101 alinhou um lado e deixou o outro): a Bravura resiste ao
   MEDO, e não à intimidação (`defesas.md:37-39`). Mudaram `virtudes.json` (`valor.resiste`) e a
   célula de `aparencia-virtudes-vontade.md:45`.
2. **Penetração contra Perfuração:** o verbete do gate no `glossario.json` passou a id `perfuracao`
   e termo "Perfuração"; o id antigo `penetracao` foi reusado para um verbete NOVO, o da Técnica
   Penetração, com o apelido "pen". O `title` do campo `perf` do `BestiaEditor.astro:214` e o texto
   de `gen-lista-equip.mjs:71` trocaram para Perfuração.

**O CI:** estava rodando quando escrevi. Diga o estado pelo run inteiro.

## O que eu mais quero que você aperte

- **O efeito colateral que a Executora mesma apontou, e não mediu:** o verbete "Perfuração" tem
  `autolink: true`, e a palavra passa a linkar para o gate em todo o livro, **inclusive em "Absorção
  de Perfuração"**, que é o modo de dano e não o gate. Meça em quantas páginas e em quantos lugares
  isso acontece no `dist/` (ou no HTML gerado), e quantos desses links apontam para o sentido errado.
  Se o texto novo criou link errado no site, é CORRIGE pela promessa (o despacho prometia "quem
  procurar a palavra acha a regra certa").
- **O id reusado:** `penetracao` agora é a Técnica. A Executora argumenta que um marcador antigo para
  `/glossario#penetracao` cai na definição que a palavra nomeia. O passo 1 dela deu lista vazia
  (nenhum link interno); confira a lista, e diga se o reuso tem algum risco que ela não viu.
- **A Bravura:** a busca por "intimid" perto de Bravura ou Virtude cobriu tudo? Refaça pelo seu
  lado, incluindo a ficha e o glossário. E confirme que a Temperança ficou intocada.
- **O verbete novo da Técnica:** os valores (2, 3, 4 e 6 pontos, depois toda a armadura, depois a
  armadura mais a natural) batem com `regras.json:155-166` e com `centelha.md:76`?
- Travessão, lendo os arquivos.

Veredito em `docs/simulacao/caixa/102-revisora.md`, commitado e empurrado. Me diga o sha.
