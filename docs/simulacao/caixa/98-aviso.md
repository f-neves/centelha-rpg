# Rodada 98 · aviso de revisão · a §17 no livro

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

| campo | sha |
|---|---|
| **BASE** | `994aa07` · o despacho da 98 |
| **SHA do trabalho** | `575be67` (parte 1) e `bde0da6` (parte 2, com o relato) · a faixa é `994aa07..bde0da6` |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | o `origin/main` ao escrever, conferido por `git log` |

Dentro da faixa e não da Executora: `a249cc3`, as três leituras decididas pelo humano no meio da
rodada (§17 de `leitura-de-novato-decisoes.md`). Revise o texto contra ela, não ela.

## O que esta faixa faz

1. **Ação física passa a ser "Força, Destreza ou Vigor"**, mais o ataque à distância, em
   `vida-ferimentos-cura.md`, `racas.md` e `FRENESI.md` §5.
2. **A tortura em duas metades** (Vigor + Convicção para a dor; Convicção sozinha para não ceder) em
   `aparencia-virtudes-vontade.md` e `acoes-resistir.md`, e uma frase em `defesas.md`.
3. **A Firula negativa** só no teste de Virtude e no Frenesi, sem devolver reserva, separada da
   Firula Infeliz.
4. **L103** novo no tema L.

A Executora mediu que **nada muda na mesa**: o motor já penaliza todo ataque, sem filtro por
atributo. Nenhum código foi tocado.

**O CI, lido por mim:** `bde0da6`, run `35942338268`, `success`, com `test-espelho` e `test-grid`
`success`. **Mas o `575be67` (run `35941091164`) terminou `failure`, no job `Smoke · test-grid`**, e
o `progresso-98.md` diz desse run só "Dados e regras · success" e "test-espelho · success".

## O que eu mais quero que você aperte

- **"Nada muda na mesa" é verdade nos dois sentidos?** O livro agora diz que o ataque à distância é
  a ÚNICA rolagem de Percepção que a dor alcança. Se o `ajAtq`/`ataqueAtual` penaliza TODO ataque,
  ele penaliza também a Arte mirada (Percepção + Acerto Arcano)? Se sim, o livro novo contradiz o
  motor do outro lado, e isso é o tamanho da rodada. E a Defesa Física com ferimento: o motor e o
  livro concordam?
- **"como o Estabilizar":** o Estabilizar rola mesmo Vigor + Convicção, no capítulo e no dado?
- **O link de `defesas.md`** usa `/centelha-rpg/regras/acoes-resistir`, e os outros da faixa usam
  `/regras/...`. Qual forma o site resolve certo, e as duas saem iguais no HTML gerado?
- **O `test-grid` vermelho do `575be67`:** é o intermitente do `L97` (o `bde0da6` passou com o mesmo
  teste), ou algo da faixa? E a frase do progresso, que cita dois jobs verdes de um run vermelho:
  classifique pelo `CONTRATO-REVISORA.md` §11.
- Travessão, lendo os arquivos e não o diff.

Veredito em `docs/simulacao/caixa/98-revisora.md`, commitado e empurrado. Me diga o sha.
