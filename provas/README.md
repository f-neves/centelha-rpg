# Provas

Páginas de bancada que respondem a uma pergunta cada.

## Por que existem

Ao longo do trabalho no tabuleiro foram escritas várias provas visuais: os
efeitos elementais lado a lado, os seis tipos de golpe em quatro instantes, as
figuras das Artes, o painel de conjuração. Todas viveram no diretório de rascunho
da sessão em que foram feitas e **se perderam**. Meses depois, a pergunta volta
("a mancha de fogo ainda cobre o que devia?") e a resposta tem de ser reconstruída
do zero.

Aqui elas ficam. Uma prova não é um teste: o teste diz *passou* ou *falhou*, a
prova mostra a coisa e deixa o olho decidir. As duas servem a perguntas
diferentes, e o repositório precisava das duas.

## Como rodar

```
node provas/roda.mjs            # todas, com as fotos em _shots/
node provas/roda.mjs camadas    # só a que casar com o nome
```

Cada prova também abre sozinha no navegador, sem servidor e sem build: é um
arquivo HTML autocontido. Os parâmetros de cena vão na barra de endereço.

## O que há hoje

| prova | a pergunta que ela responde |
|---|---|
| `camadas.html` | Repintar uma camada do tabuleiro por `innerHTML` custa quanto, e quanto se ganha mexendo só no que mudou? |

## Como acrescentar uma

1. Um arquivo HTML autocontido em `provas/`, com um comentário no topo dizendo
   **qual é a pergunta** e o que decidiu.
2. A página termina definindo `window.__PRONTO` (com o texto do resultado, se
   houver número).
3. Uma linha em `PROVAS`, dentro de `roda.mjs`, e outra na tabela acima.

Duas regras aprendidas na marra, e que valem para qualquer medida daqui:

- **Descarte a primeira leitura.** A primeira volta paga o que só acontece uma
  vez (compilação, cálculo inicial dos filtros do SVG). Foi assim que uma medida
  de quadros leu 35 fps onde eram 57.
- **Force o layout dentro da janela de medição.** Escrever no DOM e parar o
  cronômetro mede só a escrita; o custo de verdade aparece no quadro seguinte, e
  fora da conta.

## O que ainda falta trazer

As provas antigas, que se perderam nos rascunhos: efeitos elementais, os seis
golpes, as figuras das Artes e o painel de conjuração. Quando alguma delas
precisar ser refeita, o lugar dela é aqui.
