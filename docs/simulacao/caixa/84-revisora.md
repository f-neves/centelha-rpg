# Rodada 84 · veredito da Revisora

Reancoragem: `f56a52f` (a pedido explícito do Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `09e41bb`. Trabalho: `d439fed` (dois commits de conteúdo, `fc5c2b6` + `d439fed`, dentro da
faixa de quatro). Aviso: `f56a52f` (o próprio `84-aviso.md`, lido inteiro antes de qualquer
diff). Os dois commits do Arquiteto (`45493cf`, `1d63800`) não são ordem de serviço e não entraram
na revisão, como o aviso pediu.

## 1 · A regra nos três lugares

Reconstruí a tabela dos quatro casos a partir da prosa e testei contra `derivados.defesaSocial.
reguaNota` (`regras.json`) e `defesa-social.definicao` (`glossario.json`):

| ação | alvo | termo |
|---|---|---|
| Aquecer | hostil (nível negativo) | soma \|nível\| |
| Aquecer | favorável (nível positivo) | subtrai nível |
| Esfriar | favorável (nível positivo) | soma nível |
| Esfriar | hostil (nível negativo) | subtrai \|nível\| |

Isso é `termo = -nível` ao aquecer e `termo = +nível` ao esfriar, em qualquer caso — conferi que os
quatro exemplos do capítulo (`:81`) batem com essa fórmula única: Nêmesis (−6) aquecendo dá
`-(-6)=+6`; Aliado (+3) aquecendo dá `-(+3)=-3`; Consagrado (+6) esfriando dá `+6`; Nêmesis (−6)
esfriando dá `-6`. Os quatro batem. `reguaNota` e a `definicao` do glossário não contradizem essa
fórmula (o glossário é mais compacto, mas não afirma nada que a discorde). O erro do `fc5c2b6`
("nível NEGATIVO... Nêmesis ganha +6", que é aritmeticamente a mesma coisa só para o caso hostil,
mas nunca dizia o que acontece com nível positivo) não sobrevive em lugar nenhum: busquei "nível
NEGATIVO" em `src/` inteiro, zero ocorrência.

## 2 · Aritmética do callout

Recalculei sem olhar o texto primeiro, só a fórmula acima:
- Vesna, Defesa 18, nível −6: aquecer → 18+6=**24** ✓; esfriar → 18−6=**12** ✓.
- Tobias, Defesa 15, nível +3: aquecer → 15−3=**12** ✓.

As bases citadas (Vesna 18, Tobias 15) não aparecem publicadas em nenhum outro capítulo com valor
diferente — os dois são personagens de exemplo só deste callout, não fichas completas citadas em
outro lugar do livro.

## 3 · As quatro promessas do capítulo

- **Atos de passo fixo, sem rolagem:** a tabela ("O que mais move uma relação") não foi tocada, e
  o próprio parágrafo novo cita ela para dizer que o termo "não tranca a porta sozinho". Sem
  colisão.
- **Pedir favor não é rolagem:** a seção "Pedir as coisas" resolve por comparação de nível, sem
  Ataque nem Defesa Social nenhuma envolvida; o termo só existe dentro de uma jogada de Ataque
  Social, que é a seção "Conversa refina", vizinha mas distinta. Sem colisão.
- **Teto de +2 para lábia** (hoje em `:99`, não `:91` — o arquivo cresceu umas linhas desde que o
  aviso mediu, nada a ver com este commit): é uma trava narrativa incondicional ("lábia e presentes
  levam alguém só até +2"), não depende da margem de nenhuma rolagem. O termo muda se o Ataque
  acerta e por quanto, não muda o teto em si. Sem colisão.
- **"Sair do Neutro" (3 passos) e nível 0 = termo zero:** conferido na própria frase do capítulo
  ("No Neutro (nível 0) o termo vale zero, e a conversa funciona exatamente como já funciona
  hoje"). Os dois "não se pisam" porque um rege o nível 0 e o outro rege todo o resto da régua.

Concordo com a leitura do Arquiteto: nenhuma das quatro promessas é contradita.

## 4 · O motor ficou intocado

`git diff --stat 09e41bb..f56a52f` não lista `src/lib/calc.ts` nem nenhum arquivo de `src/lib`. A
assinatura de `defesaSocial()` (`calc.ts:144`) continua `{compostura, sociabilidade, centelha,
especialidade?}`, sem parâmetro novo, e a função não lê `reguaNota`. O campo novo em `regras.json`
é só `reguaNota: string`, no mesmo formato de `especialidadeNota` (uma string ao lado dos campos
calculáveis, não um número nem uma fórmula que algum código possa vir a consumir sem querer).

## 5 · As duas omissões

- **`defesas.md` não mudou:** conferido que a linha da Defesa Social ali (`Social = (Compostura +
  Sociabilidade)×2 + Centelha + Esp`) já não explicava a situacionalidade da Especialidade antes
  desta rodada, e o capítulo já aponta para `relacoes-sociais.md` para o resto. Mesmo padrão,
  mesma fonte única. Concordo em não mexer.
- **`glossario.json` sem verbete de "Régua de Relação":** confirmado, zero entrada com esse id ou
  variação. A Régua de Relação já tem capítulo próprio (`relacoes-sociais.md`) e o termo aparece
  citado dentro de outros verbetes (como `defesa-social`, agora) sem precisar de entrada própria —
  mesmo padrão de vários outros mecanismos com capítulo dedicado. Concordo em não mexer.

## Sobre a decisão de não virar código

Concordo com o raciocínio: o nível da régua é por par de personagens, não é um campo da ficha nem
do bestiário, e Combate Social não tem representação no Grid hoje. Não há lugar no motor onde esse
número morasse sem inventar estado novo (uma tabela de relações por par de personagens) que nada
mais no sistema tem hoje. Registrar como nota ao lado do campo que ela modifica, no mesmo molde já
usado pela Especialidade, é a escolha certa para o estágio atual do projeto.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**PROCEDE.** A regra é a mesma nos três lugares e é a certa; a aritmética dos dois exemplos bate;
nenhuma das quatro promessas do capítulo é contradita; o motor está intocado (`reguaNota` é nota
e só nota, seguindo o precedente do `especialidadeNota`); as duas omissões são julgamento correto,
não descuido. O erro do `fc5c2b6` (a "nível NEGATIVO" que contradizia o próprio exemplo) não
sobrevive em lugar nenhum do estado atual.
