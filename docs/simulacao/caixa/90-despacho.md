# Rodada 90 · despacho · o teste de Virtude e o Frenesi entram no livro

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 23/09/2026
>
> A rodada 89 fechou com **PROCEDE** (`6bb35a3`), e o CORRIGE do peso do Bastão já foi aplicado
> (`95e1e90`). Progresso em `docs/simulacao/caixa/progresso-90.md`, relato em `90-executora.md`.
>
> **Orçamento:** o humano liberou sem limite em 23/09/2026 ("pode continuar sem limite").

## A fonte, e ela é uma só

Tudo o que esta rodada escreve já foi decidido com o humano. **Não há decisão de regra a tomar
aqui.** As duas fontes são:

- **`FRENESI.md`** (raiz, `b268c23`) · a regra inteira, seção por seção: o teste de Virtude (§1 a
  §3), os dois traços (§4 e §5), a entrada (§6), a manutenção (§7), a saída (§8), a ressaca e o
  teto (§9), o Meio-Orc (§10). O §11 lista o que foi fechado e quando; o §12 é anotação para depois
  e **não entra no livro**.
- **`leitura-de-novato-decisoes.md` §16** · o registro de cada decisão de 23/09/2026, com o porquê.
  A §14 e a §15 foram substituídas em parte pela §16: onde discordarem, vale a §16.

Se achar algo no `FRENESI.md` que contradiga a §16, ou que não feche em mesa, **pare e me diga**:
não escolha.

## Grupo 1 · o teste de Virtude, em `aparencia-virtudes-vontade.md`

**1 · O item "Resistir"** (hoje `:65`) diz "role a Virtude apropriada **somada a um Atributo**:
medo = Bravura + Vigor; provocação = Temperança + Raciocínio". Isso morreu. Entra o teste de
Virtude do `FRENESI.md`:

- a Virtude sozinha vira parada pela conversão de sempre (tabela do §1: 1 → 2 fixo, até 6 → 3d6);
- a régua **própria**, de dois em dois: 3 Branda, 5 Tensa, 7 Séria, 9 Dura, 11 Severa, 13
  Extrema (§2). Diga no texto que ela não é a régua travada 5/10/15/20/25 e por quê;
- a Firula (§3), inclusive a negativa;
- sucesso é total MAIOR que a Dificuldade.

Os exemplos de pares Virtude + Atributo saem. Se quiser exemplos, use situações e Dificuldades da
régua nova.

**2 · Não mexa** no Canalizar Virtude nem na régua moral: não fazem parte desta decisão.

## Grupo 2 · o Frenesi, em `racas.md` e `racas.json`

**3 · O texto de regra do Frenesi vai para uma seção própria de `racas.md`**, depois das duas
raças, e os dois bullets de traço (`racas.md:112` do Meio-Orc e `:128` do Orc) passam a ser curtos
e apontar para ela. A seção cobre §4 a §10 do `FRENESI.md`, na voz do livro (é texto para
jogador, não registro de decisão: sem datas, sem "decidido em", sem "a versão anterior dizia").

As tabelas de chance entram só se couberem sem pesar. Se escolher uma, a mais útil em mesa é a
de chance de ENTRAR rolando limpo por Temperança e Dificuldade (§6).

**4 · `racas.json`**, os `tracos` de `orc` e `meio-orc` (`:133` e `:153`) e o `bonusCondicional`
de Intimidar (`:128`), alinhados com a seção nova. A chave `"+2d6"` do Intimidar bate com o §5
("+2 dados"); confira e não mude se bater.

**5 · A conferência que eu quero escrita:** `tecnicas.json:1896` tem uma **Técnica** chamada
`frenesi`. Diga o que ela é, se colide com o traço racial (nome, regra ou os dois) e **não mexa
nela**: a colisão, se houver, é decisão do humano.

## Grupo 3 · as duas exceções em `vida-ferimentos-cura.md`

**6 · A ressaca abaixo de Crítico** (`FRENESI.md` §9): cada estado de ressaca além de Crítico soma
mais −1d6 na ação física e −4 na Defesa Física, e **nunca leva a Incapacitado**. A tabela de
estados (`:38-44`) ganha uma nota curta apontando para o Frenesi. Não crie linha nova na tabela: o
degrau só existe para a ressaca.

**7 · O piso de 1d6** (`:46`, "O pool nunca desce abaixo de 1d6") ganha a exceção: no teste de
Frenesi, a penalidade de ferimento e o ponto de Força de Vontade que o próprio orc aplica para
**ceder** podem zerar a parada. Uma frase, apontando para a seção do Frenesi.

## Grupo 4 · o motor, e ele pode não ter nada

**8 · Procure se algum código rola teste de Virtude ou de Frenesi hoje** (ficha, mesa, Grid,
`src/lib/`). O `FRENESI.md` diz "Zero mecanismo novo" para o teste de Virtude: é `rolarExpr` com a
Virtude no lugar da soma.

- **Se nada rola:** diga isso, com o recorte da busca ao lado do resultado, e não crie botão nem
  função. Interface nova não foi pedida.
- **Se algo rola** (um botão de Resistir na ficha, por exemplo), ajuste para a parada nova e me
  diga o que era antes. A exceção do piso em `rolagem.ts:73` só entra se houver um caminho de
  código que role o teste de Frenesi; sem esse caminho, não toque em `rolagem.ts`.

## O de sempre

- Commits com pathspec. `npm run validate` e o gancho verdes; build se tocar `src/`. Toda mensagem
  de commit que toque `src/` diz o que muda para quem joga hoje.
- Sem travessão em nada que escrever. Vocabulário: Habilidade, nunca Perícia.
- Progresso em `progresso-90.md`, uma linha por etapa pequena, hora lida da máquina.
- Relato em `90-executora.md`: arquivos tocados, commits, resultado das conferências 5 e 8.

## O que NÃO é desta rodada

- O §12 do `FRENESI.md` (a fúria fora do combate): anotação para depois.
- A Técnica `frenesi` do `tecnicas.json`: só a conferência do item 5.
- Qualquer mudança de número: se um número do `FRENESI.md` parecer errado, reporte, não corrija.
- `lore/` inteiro: frente do Cartógrafo, em andamento na mesma árvore. Não encoste.
