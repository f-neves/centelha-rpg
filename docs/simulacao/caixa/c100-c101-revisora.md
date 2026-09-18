# Revisão: C-100/C-101 (Especialidades de Sora e Veil)

Reancoragem: `1b7fe74` (autorizado pelo Arquiteto, worktree movido por mim). Confirmado por
`git rev-parse HEAD` e `git rev-parse --show-toplevel`.

Base: `21304e2` (meu veredito anterior). Trabalho: `fa132bd..1b7fe74` (dois commits).

## C-100 · Sora, "Liderança" → "Política"

Conferido: "Liderança" é Habilidade secundária (`habilidades-secundarias.json`, id
`lideranca`), com preço pela metade de uma primária no mesmo nível (`regras.json → xp.
especialidadeSecundaria`, base 4/mult 2, contra `especialidadePrimaria` base 8/mult 4). "Política" é
primária (`habilidades.json`, id `politica`) e já aparece na linha de Habilidades de Sora, nível 3.
A troca é só de rótulo no exemplo; o total publicado (60 XP = 5 primárias de nível 1 × 12) não
muda e continua consistente com a suposição do `cost-examples.mjs` (que trata as cinco como
primárias de nível 1).

## C-101 · Veil, "Fogo" → "Integridade"

Conferido: "Fogo" não existe em `habilidades.json` nem em `habilidades-secundarias.json` (busquei
os dois arquivos inteiros por id e por nome) — só existe em `artes.json`, e é uma das Artes que a
própria ficha de Veil já lista. Especialidade só se amarra a Habilidade, por `regras.json → xp.
especialidadePrimaria.limite` e pelo glossário; "Fogo" nunca poderia ser alvo de Especialidade.
"Integridade" é primária de Veil, nível 3, já citada na linha de Habilidades dele. Mesma conta,
60 XP intactos.

## O resto do `jogador-novo-consertos-2.md`

O documento também reconfere os quatro alvos da rodada anterior (degrau Campeão, renome de
orçamento, M-09/M-46, nomes repetidos) e os dá como já fechados. Não recontei os quatro do zero
aqui porque já são exatamente os que revisei e dei PROCEDE nas duas rodadas passadas; a segunda
leitura chegou às mesmas conclusões que eu.

A "Pergunta encontrada" no fim (se `cost-examples.mjs` deveria aceitar Especialidade secundária de
verdade em vez de supor tudo primária) fica registrada como aberta, sem decisão minha — é escopo
que cabe ao Arquiteto/humano escolher, como o próprio documento já diz.

**Nota pequena, não bloqueia:** `jogador-novo-consertos-2.md:99` tem um caractere fora do
português ("as duas są plausíveis", devia ser "são") — artefato de digitação isolado num documento
de caixa, não em texto publicado. Não afeta o jogador nem o motor; sinalizo para quem for editar
esse arquivo de novo.

## Verificação

`npm run validate` rodado aqui: verde.

## Veredito

**PROCEDE.** As duas trocas (C-100, C-101) são exatamente o que a inconsistência pedia: nome de
Especialidade trocado por uma Habilidade primária de verdade que o personagem já tem, sem mexer no
total de XP publicado. Os shas `<pendente>` do segundo commit foram preenchidos certos.
