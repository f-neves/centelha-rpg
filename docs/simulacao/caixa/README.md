# A caixa de correio

**Este é o ÚNICO canal entre a executora e a revisora.** Duas instâncias, dois
worktrees, nenhuma memória compartilhada: **o que não está escrito aqui não existe
para a outra.** Contexto de chat, raciocínio que ficou na cabeça, decisão tomada e
não anotada · nada disso atravessa. Se importa, está num arquivo desta pasta.

## Quem é quem

| | o que faz | o que escreve |
|---|---|---|
| **executora** | roda, mede, implementa, escreve os documentos | o repositório inteiro, e o `NN-executora.md` |
| **revisora** | lê o código e os documentos no commit avisado, e responde | **só** `NN-revisora.md`, e nada fora desta pasta |

**A revisora nunca escreve código.** Não corrige, não commita fora daqui, não roda
bateria. Ela lê um commit congelado e escreve um arquivo.

## Os arquivos

```
docs/simulacao/caixa/
  README.md              este arquivo
  MODELO-executora.md    o formato fixo do aviso
  01-executora.md        o aviso da rodada 1
  01-revisora.md         a resposta da rodada 1
  02-executora.md        ...
```

`NN` de **01** em diante, dois dígitos, sempre em par: um aviso, uma resposta.

## O fluxo de uma rodada

**Da executora, ao terminar:**

1. commitar tudo · código, testes, documentos, resultados de bateria;
2. `npm run rodada` · cria o `NN-executora.md` a partir do modelo, com o sha do
   HEAD já preenchido, e recusa rodar se a árvore estiver suja;
3. preencher as seis seções do arquivo;
4. `npm run rodada -- --enviar` · commita com `rodada NN · aviso à revisora`.

**Da revisora, ao ser chamada:**

```
git -C <worktree> fetch && git -C <worktree> checkout <sha>
```

O `<sha>` é o que o `--enviar` imprime, e ele é o **commit do aviso**, e não o da
seção COMMIT do arquivo. **São dois shas e isso é de propósito:** um commit não
pode conter o próprio sha, então o aviso escrito antes de ser commitado só sabe o
do código. Os dois têm a **mesma árvore de código** (o commit do aviso só
acrescenta um arquivo de texto), então mandar a revisora para o do aviso é o que
faz ela ver, com um checkout só, o código avisado **e** o aviso sobre ele.

O checkout congela a visão dela naquele commit, que é o certo: **ela revisa o que
foi avisado, e não um alvo em movimento.**

## A regra do commit defasado

O congelamento tem um preço, e ele cai inteiro do lado da executora. Se ela
continuar commitando enquanto a revisora lê, a resposta chega sobre um commit que
já não é o topo, e o erro previsível é sempre o mesmo: **tratar a revisão como se
fosse sobre o estado atual, e descartar um item dizendo "isso já mudou".**

As cinco regras, e as cinco são obrigação da executora:

1. **toda resposta da revisora é sobre o commit avisado, e vale sobre ele.** Ela
   não errou por não ver o que veio depois: ela viu exatamente o que lhe foi
   mandado ver;
2. **ao ler a resposta, a primeira coisa é conferir se o HEAD ainda é o commit
   avisado.** Se não for, **listar o que mudou entre os dois ANTES de responder
   qualquer item**:
   ```
   git log --oneline <sha-avisado>..HEAD
   git diff --stat <sha-avisado>..HEAD
   ```
3. **item que deixou de valer porque o código mudou não é item respondido: é item
   RESPONDIDO NOUTRO COMMIT.** A resposta diz o sha em que ele deixou de valer,
   para ninguém achar depois que a revisora estava errada;
4. **"isso já mudou" nunca é resposta suficiente.** Ou o item continua valendo e é
   tratado, ou se mostra o commit e o diff que o resolveu;
5. **o padrão é NÃO commitar na branch entre o aviso e a resposta.** Se for
   preciso trabalhar, trabalha-se noutra branch e traz-se depois, para que o
   commit avisado continue sendo o topo quando a resposta chegar.

## O que o aviso tem de trazer

O formato está em `MODELO-executora.md` e é fixo. A seção que carrega o peso é
**O QUE ESTE RELATÓRIO AFIRMA**: cada número publicado na rodada, com o arquivo e
a linha de onde ele sai. **Número sem procedência não entra**, porque a revisora
não tem como conferir o que não sabe de onde veio, e um número sem origem é
exatamente o tipo de coisa que atravessa sete rodadas sem ninguém notar.
