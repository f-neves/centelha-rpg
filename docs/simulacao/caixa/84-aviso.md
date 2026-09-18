# Rodada 84 · aviso de revisão · o termo de Régua de Relação na Defesa Social

**Este arquivo é o aviso, e o sha dele é o sha do aviso.**

## Os quatro campos

| campo | sha |
|---|---|
| **BASE** | `09e41bb` · o seu veredito final da curva de Aparência |
| **SHA do trabalho** | `d439fed` · a faixa é `09e41bb..d439fed`, quatro commits, dos quais **dois são meus e de documento** (ver abaixo) |
| **SHA do aviso** | este commit |
| **TOPO do repositório** | `d439fed`, conferido por `git rev-parse origin/main` ao escrever |

## O que mudou na faixa, pelo diff e não pelo relato

`git diff --stat 09e41bb..d439fed` devolve cinco arquivos:

| arquivo | de quem | precisa de revisão? |
|---|---|---|
| `src/content/chapters/relacoes-sociais.md` | Executora | **sim**, é o lote |
| `src/data/regras.json` | Executora | **sim**, é o lote |
| `src/data/glossario.json` | Executora | **sim**, é o lote |
| `docs/simulacao/caixa/checkpoint-19set.md` | Arquiteto | registro de continuidade, não é ordem de serviço |
| `docs/simulacao/CONTEXTO.md` | Arquiteto | idem, veio no `45493cf`, anterior ao lote |

Os dois últimos estão na faixa porque commitei entre o seu veredito e o trabalho dela. Digo para você não gastar tempo procurando dono.

## O que o lote faz

`defesaSocial()` (`src/lib/calc.ts:144`) não tinha termo nenhum de Régua de Relação, e a consequência era que seduzir um Nêmesis (−6) custava exatamente o mesmo Ataque Social que seduzir um estranho Neutro, com traços iguais. Entra **um termo só, com sinal**: remar contra o que o alvo já sente **soma** o nível à Defesa Social dele, remar a favor **subtrai**. Multiplicador ×1, zera no Neutro, sem teto além do próprio ±6 da régua.

**Por decisão minha, isto NÃO vira código.** O nível é por relação (quem é o alvo, contra quem), não está na ficha, e combate social não existe no Grid. É texto de capítulo mais uma nota situacional no JSON, no molde do `especialidadeNota` que já mora ao lado.

## O que eu quero que você julgue, e são cinco coisas

**1 · A regra diz a mesma coisa nos três lugares, e diz a certa.** Esta é a **segunda tentativa**: o `fc5c2b6` escreveu "a Defesa soma o **nível NEGATIVO** da régua: um Nêmesis (−6) ganha **+6**", que lido como aritmética afirma o contrário do exemplo duas linhas abaixo, e além disso deixava **a metade em que o termo subtrai sem documentação nenhuma**. Eu peguei na conferência e devolvi antes de abrir a rodada; o `d439fed` é o conserto. Confira nos três (capítulo `:79` e `:81`, `regras.json → derivados.defesaSocial.reguaNota`, `glossario.json → defesa-social`) que os quatro casos estão cobertos e concordam entre si: aquecer um Nêmesis soma 6, aquecer um Aliado (+3) subtrai 3, esfriar um Consagrado soma 6, esfriar um Nêmesis subtrai 6.

**2 · A aritmética dos dois exemplos do callout (`:83`).** Vesna, Defesa base 18, em −6: aquecer dá 24, esfriar dá 12. Tobias, Defesa base 15, em +3: aquecer dá 12. Confira as contas e confira que as bases citadas não contradizem nenhum número publicado desses personagens em outro capítulo.

**3 · Se o termo colide com o que o capítulo já promete, e eu afirmo que não colide.** Verifique você, porque a afirmação é minha e eu a fiz lendo, não testando:
   - os **atos** continuam de passo fixo e sem rolagem (tabela em "Como a régua se move"), que é a válvula que impede o termo de trancar a porta;
   - **pedir favor não é rolagem** (`:40`, o Mestre compara o pedido com o nível e o que cabe no nível sai de graça), então o lado que subtrai não vira máquina de favores;
   - o **teto de +2 para lábia** (`:91`) continua de pé;
   - **"Sair do Neutro" (3 passos)** não muda, e no nível 0 o termo vale zero, então os dois não se pisam.

**4 · Que nada foi ligado no motor.** `calc.ts` não pode ter ganhado parâmetro, e `regras.json` não pode ter ganhado campo calculável. Confira que a `reguaNota` é nota e só nota, e que ela segue mesmo o precedente do `especialidadeNota` em vez de inventar forma nova.

**5 · O que ficou de fora, e se foi certo ficar.** Ela conferiu `defesas.md` e concluiu que não precisa de mudança (a página já aponta para `relacoes-sociais.md` na linha 127, e não explica a situacionalidade da Especialidade inline tampouco, então seguiria fonte única). Ela também conferiu que `glossario.json` não tem verbete de "Régua de Relação". Julgue as duas omissões.

## Os números que sustentam o ×1, se você quiser conferir a decisão e não só o texto

Distribuição exata por convolução, alvo de Defesa Social base 18, subindo de −6 até 0 só por conversa: cortesão com Aparência +6 leva 9 trocas no ×1 e 50 no ×2; cortesão com Aparência 0 leva 72 no ×1 e trava no ×2; um atacante mediano trava nos dois. O ×2 foi descartado por fechar a porta até para o especialista. Está registrado no `checkpoint-19set.md`, junto da anotação de que **eu circulei o "9 trocas" como se fosse o caso típico quando era só o do cortesão no auge da Aparência**. Se for julgar a decisão, julgue contra os números certos, não contra aquela caracterização.

## Reancoragem

A sua worktree não se move sozinha. Se quiser revisar em `d439fed`, o gesto é seu e eu peço: pode reancorar?
