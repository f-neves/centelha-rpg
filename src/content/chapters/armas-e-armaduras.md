---
ordem: 10
numeral: "X"
titulo: "Armas & Armaduras"
resumo: "Classes + Tags: a arma define o estilo, não a potência bruta."
---

Cada arma é uma **classe-base** recombinada com **tags**. O pilar é simples: a arma define o *estilo*, não a potência bruta. Pegar "a mais forte" não existe — cada escolha vence umas situações e perde outras.

<div class="callout regra"><span class="lbl">Catálogo</span>Para filtrar e comparar todo o equipamento, veja a página de <a href="/equipamentos">Equipamentos</a> — e escolha arma/armadura direto na <a href="/ficha">Ficha</a> para ver o ataque, a Defesa e a Absorção já calculada.</div>

## Como ler uma arma

Antes do catálogo, o que cada número de uma arma quer dizer — e onde ele entra no [Combate](/regras/combate):

- **Speed** — quantos **Ticks** o ataque custa na linha do tempo (leve 5, média 6, pesada 7): a leve age mais vezes; a pesada bate mais forte, mas te expõe entre os golpes.
- **Dano** — o **dado de dano** do golpe (1d6/2d6/3d6), ao qual se somam a **Força** (o dobro nas de duas mãos) e cada Margem (+1d6).
- **Acerto** — um bônus que **soma no seu pool de ataque** (a leve mira melhor; a pesada, pior).
- **Def. (Defesa da Arma)** — quanto a arma acrescenta ao seu **Bloqueio**.
- **Mãos** — uma ou duas; algumas são *Versáteis* e servem nas duas formas.
- **Modos** — os **modos de ataque** da arma (Impacto, Cortante, Perfurante). A maioria das armas tem **mais de um**, e você escolhe por golpe conforme o alvo. Um deles é o **principal** (sem custo); os **secundários** saem com **−2 ao acerto e −2 ao dano**. O modo **Perfurante** carrega um **Nível de Perfuração**, escrito **(N0)–(N5)**. Ver *Os três modos de dano* em [Combate](/regras/combate).
- **Quase-Acerto** — errar por pouco ainda raspa. O valor é **fixo pela classe** (peso) da arma e da armadura; veja o capítulo [Quase-Acerto](/regras/quase-acerto).

<div class="callout exemplo"><span class="lbl">Lendo uma arma</span>A <strong>Espada Longa</strong> é <em>Média · Versátil</em>: <strong>Speed 6</strong> (ataque médio), <strong>2d6</strong> de dado de dano + Força, <strong>+1</strong> no pool de ataque e <strong>+1</strong> no Bloqueio. Como é <em>Versátil</em>, dá para empunhá-la a duas mãos por <strong>+1 dado de dano</strong> e <strong>−1</strong> de Defesa da Arma — a mesma lâmina, dois estilos.</div>

<p class="muted">Escolha pela <strong>fantasia</strong> — o duelista veloz, o brutamontes de montante, o lanceiro que controla a distância —, não pelo número "mais forte". Cada classe vence umas situações e perde outras; não existe a arma ótima.</p>

## Classes de Arma

<p class="muted">Esta tabela é um <strong>guia geral por peso</strong> — a média de cada classe. Use-a como <strong>referência para inventar armas novas</strong>; cada <em>arma de exemplo</em> (abaixo) traz os seus próprios números, que podem variar dentro da classe (duas armas da mesma classe podem diferir em Speed, Acerto ou Defesa).</p>

<div class="table-wrap">

| Classe | Speed | Dano | Acerto | Def. | Mãos | Estilo |
|---|:---:|:---:|:---:|:---:|:---:|---|
| Leve | 5 | 1d6 | +2 | +1 | 1 | tempo, precisão e defesa; habilita Técnicas ágeis |
| Média | 6 | 2d6 | +1 | +1 | 1\* | equilíbrio sem fraquezas (versátil) |
| Pesada | 7 | 3d6 | +0 | −2 | 2 | dano que vence armadura — mas lenta e te expõe, com guarda baixa |
| Haste | 6 | 2d6 | +1 | +2 | 2 | alcance: controla a distância e defende muito |
| Distância | 6 | 1–3d6 | +1 | — | 2 | domina antes do contato; depende de munição |
| Arremesso | 4–6 | 1–2d6 | +1 | — | 1 | lançar com a mão: alcance curto, uma mão, projétil recuperável |

</div>

## Tags

- **Alcance** — ataca a uma casa de distância; bônus contra quem se aproxima, penalidade colado.
- **Ágil** — usa Destreza no dano; +1 na Defesa da Arma.
- **Versátil** — 1 ou 2 mãos (em 2 mãos: +1 dado, −1 Defesa da Arma).
- **Sangramento** — um golpe que abre Margem deixa uma ferida que continua drenando: **Sangramento igual à Margem** (máx 3). Ver *Sangramento e Estabilização* em Vida & Ferimentos.
- **Arremessável · Munição · Pesada** — lançar; gastar munição; usar Força total e −1 em ações ágeis.
- **Imobiliza** — não causa dano: um acerto deixa o alvo **Imobilizado** até escapar (Força ou Atletismo vs o lançamento).

## Armas de Exemplo

<div class="table-wrap">

| Arma | Classe | Modos | Speed | Dano | Acerto | Defesa | Mãos | Destaque |
|---|:---:|---|:---:|:---:|:---:|:---:|:---:|---|
| Adaga | Leve | ★P(N0) · C | 5 | 1d6 | +2 | +1 | 1 | Ágil, arremessável. Rápida e precisa; só fura pele (mira na fresta) |
| Espada Curta | Leve | ★C · P(N1) | 5 | 1d6 | +2 | +1 | 1 | Veloz e defensiva |
| Espada Longa | Média | ★C · P(N1) | 6 | 2d6 | +1 | +1 | 1 | Versátil (2 mãos: +1 dado, −1 Def.). A clássica adaptável |
| Machado | Média | ★C · I | 6 | 2d6 | +1 | 0 | 1 | Corta ou bate de chapa. Guarda menor que a espada, mas alterna pro Impacto |
| Espada Serrilhada | Média | ★C · P(N1) | 6 | 2d6 | +0 | +1 | 1 | Sangramento (−Acerto): feridas que continuam drenando |
| Maça | Média | ★I | 6 | 2d6 | +1 | +1 | 1 | Anti-placa: o Impacto quase não é absorvido |
| Picareta de Guerra | Média | ★P(N2) · I | 6 | 2d6 | +1 | +1 | 1 | O bico vence a placa pelo ponto |
| Lança | Haste | ★P(N1) | 6 | 2d6 | +1 | +2 | 2 | Alcance, arremessável. Estocada que controla a distância; resvala na placa |
| Alabarda | Haste | ★C · ★P(N1) · ★I | 6 | 2d6 | +1 | +2 | 2 | Alcance, pesada (lenta). Três modos principais num cabo; cobre tudo |
| Montante | Pesada | ★C · P(N1) · I | 7 | 3d6 | +0 | −2 | 2 | Espadão; dano alto, guarda baixa — te expõe entre os golpes |
| Martelo de Guerra | Pesada | ★I · P(N2) | 7 | 3d6 | +0 | −2 | 2 | Esmaga placas; o bico fura quando precisa. Pouca defesa |
| Arco | Distância | ★P(N1) | 6 | 2d6 | +1 | 0 | 2 | Munição, distância. Precisão à distância; resvala na placa |
| Besta Pesada | Distância | ★P(N2) | 6 | 3d6 | +1 | 0 | 2 | Munição, recarga, distância. O virote fura até a placa |
| Adaga de Arremesso | Arremesso | ★P(N1) | 4 | 1d6 | +2 | 0 | 1 | Ágil, munição. Facas às dezenas |
| Machado de Arremesso | Arremesso | ★C · I | 5 | 2d6 | +1 | 0 | 1 | Gira no ar; golpe forte e curto |
| Azagaia | Arremesso | ★P(N1) | 5 | 2d6 | +1 | 0 | 1 | Javelina: fura à distância ou na estocada em punho |
| Funda | Arremesso | ★I | 6 | 1d6 | +1 | 0 | 1 | Munição. Pedras a longa distância; Impacto (sem gate) |
| Dardos | Arremesso | ★P(N1) | 4 | 1d6 | +2 | 0 | 1 | Ágil, munição. Velozes em sequência |
| Bumerangue | Arremesso | ★I | 5 | 1d6 | +1 | 0 | 1 | Atinge em curva e volta à mão se erra |
| Rede | Arremesso | ★I | 5 | 1d6 | +0 | 0 | 1 | Imobiliza. Prende o alvo em vez de ferir |
| Pilum | Arremesso | ★P(N2) | 5 | 2d6 | +1 | 0 | 1 | Anti-escudo: fura placa e entorta ao cravar |

</div>

<p class="muted"><strong>Modos:</strong> <strong>I</strong> = Impacto · <strong>C</strong> = Cortante · <strong>P</strong> = Perfurante (estocada ou projétil, sem distinção). <strong>★</strong> = modo principal (sem custo); os secundários saem com <strong>−2 ao acerto e −2 ao dano</strong>. O <strong>(N0)–(N5)</strong> após o P é o <strong>Nível de Perfuração</strong>. <strong>Speed</strong> = Ticks da ação · <strong>Defesa</strong> = bônus de Bloqueio da arma · <strong>Mãos</strong> = empunhadura (a <em>Versátil</em> vira 2 mãos por +1 dado e −1 Defesa). O <strong>Quase-Acerto</strong> sai do dado de Dano (1d6 leve, 2d6 média, 3d6 pesada) — ver <a href="/regras/quase-acerto">capítulo próprio</a>.</p>

## Armaduras

A armadura **absorve dano depois do acerto**, com **três Absorções**: **Impacto**, **Corte** e **Perfuração** (calibrados em pontos). O dano **Perfurante** usa a **Absorção de Perfuração**. Repare na lógica histórica: a **placa** quase zera o **corte** (ninguém corta bom aço), mas o **impacto** atravessa o aço e quebra o corpo dentro. A **Perfuração** funciona ao contrário: é **difícil de furar** — cada armadura tem um **Nível** (Resistência à Perfuração, 0–5) que o Nível de Perfuração da arma precisa alcançar, senão o golpe **resvala** —, mas, **quando furada, absorve pouco** (a Absorção de Perfuração é baixa de propósito). A **Penalidade** incide nas ações físicas. O efeito da armadura no **Quase-Acerto** (bônus de margem + redução do raspão) é fixo pela classe — ver [Quase-Acerto](/regras/quase-acerto).

<div class="table-wrap">

| Armadura | Classe | Impacto | Corte | Perfuração (Nível) | Penalidade |
|---|:---:|:---:|:---:|:---:|:---:|
| Nenhuma | — | 0 | 0 | 0 / N 0 | 0 |
| Gambeson | leve | 3 | 6 | 1 / N 0 | −1 |
| Couro endurecido | leve | 2 | 4 | 1 / N 1 | −1 |
| Cota de malha | média | 1 | 8 | 1 / N 1 | −2 |
| Brigandina | média | 4 | 8 | 3 / N 1 | −2 |
| Lamelar | média | 3 | 8 | 3 / N 1 | −2 |
| Placa de transição | pesada | 4 | 10 | 3 / N 2 | −3 |
| Placa de munição | pesada | 4 | 9 | 4 / N 2 | −3 |
| Placa completa | pesada | 6 | 11 | 4 / N 3 | −3 |

</div>

<p class="muted"><strong>Penalidade:</strong> incide em qualquer ação física, incluindo <strong>Ataque, Esquiva, Bloqueio, Deslocamento e Salto</strong>; para <strong>Furtividade e atividades delicadas, dobra</strong>. <strong>Empilhar:</strong> dá para vestir mais de uma peça (gambeson sob malha, p.ex.) — vale o <strong>maior Absorção de cada categoria</strong>, o <strong>maior Nível</strong> (a Resistência à Perfuração NUNCA soma) e a <strong>soma das Penalidades</strong>. A placa te torna um tanque, mas mais fácil de acertar e furtivo péssimo. Armadura não reduz o Bloqueio diretamente — mas a Penalidade dela, sim.</p>

## Escudos

O escudo não absorve: é **bônus de Defesa** (ajuda a *não* ser acertado), e só quando usado. Tem **dois valores** conforme o ataque — **CaC** (corpo a corpo) e **Projétil**. A **Penalidade** incide nas outras ações físicas (esquiva etc.), **nunca** no bloqueio do próprio escudo. É o antiprojétil onde o escudo humilha a armadura.

<div class="table-wrap">

| Escudo | Bloq. CaC | Bloq. Projétil | Penalidade | Estilo |
|---|:---:|:---:|:---:|---|
| Broquel | +3 | +1 | 0 | puro uso ativo; péssimo contra flecha |
| Targe / rodela | +3 | +2 | −1 | duelista, cobertura limitada |
| Escudo redondo | +4 | +3 | −1 | o melhor todo-terreno barato |
| Heater | +4 | +4 | −2 | cobre o tronco, a pé ou a cavalo |
| Kite normando | +4 | +4 | −2 | muita cobertura, pesado |
| Scutum | +4 | +4 | −3 | brilha em formação (testudo) |
| Pavês | +3 | +5 | −4 | parede portátil do besteiro (antiprojétil) |

</div>

## A Interação Arma × Armadura

A pedra-papel-tesoura sai dos números acima:

- **Placa completa × Corte** = 11 de Absorção: uma espada (3d6+10 no topo) faz **~7**; uma lâmina leve, quase nada. **Ninguém corta placa de leve.**
- **Placa × Perfurante nível 0–2** (flecha, lança, adaga, besta, picareta) = **resvala**: o Nível 3 não é vencido. A placa completa é à prova de qualquer arma de mão.
- **Placa × Impacto** (maça, martelo) = só 6 de Absorção: o malho **passa** (a vulnerabilidade nunca resolvida — a principal via contra placa).
- **Placa × Perfuração nível 3+** (cerco, magia, armas épicas) = o gate abre — e aí a placa só tem **4** de Absorção de Perfuração: dificílimo de furar, mas quando fura, fura fundo.
- Sem armadura, o **corte** brilha; a **malha** mata o corte mas cede ao impacto; cada armadura tem seu furo.

<div class="callout"><span class="lbl">Como derrotar cada armadura</span>O cavaleiro de placas é quase intocável por gume, flecha e estocada, mas um camponês com um malho (Impacto) ainda o amassa — e três deles o derrubam pela lentidão. Contra o topo da placa, o caminho é Impacto, Perfuração nível 3+ (cerco/magia), Proeza ou feitiçaria.</div>
