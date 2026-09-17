# H. Arremesso

Frente aberta em **2026-08-10** e até agora sem linha neste mapa. Três documentos:
`Arremesso_Fatos.md` é o levantamento do que se mediu no mundo real, `Arremesso.md` é a regra que
está no ar, e `Arremesso_Regra.md` é a **proposta nova**, em três regimes. A bancada
`arremesso-bench.html` compara as duas com gráfico.

- [x] **H1 · [FEITO, achado na auditoria de memória de 08/09] A regra nova foi adotada.**
  `src/data/regras.json` hoje tem `arremessoApice: 0.1` e `arremessoTeto: 0.25` (P ÷ 4), batendo com
  o que este item propunha. A curva do meio ficou como `Alcance = 7 × FAA^0,7 ÷ peso^0,4`
  (`arremessoConst`, `arremessoExpFaa`, `arremessoExpMassa`), uma calibração de dois expoentes em
  vez da raiz quadrada de expoente único escrita aqui (`2 × FAA ÷ √massa`); parece um refino
  posterior da mesma família de ajuste (`45,9 × massa^−0,488`), não uma regra diferente, mas ninguém
  atualizou este texto quando calibrou. **Conferir com o humano se o expoente 0,7/0,4 foi decisão
  consciente**, e então apagar a nota de "proposta" e deixar só o valor final.
- [x] **H2 · [FEITO] Portado.** Os campos antigos (`arremessoMassaBraco`, `arremessoParedeExp`,
  `arremessoR0`) não existem mais em `regras.json` (conferido em 08/09): só sobrou a régua nova.
- [ ] **H3 · [DECIDIR] Os quatro assuntos que a proposta levanta e não fecha** (§7). **Funda e
  ferramentas que estendem o braço**: medido +30% a +70% na funda, +58% na correia grega, +81% no
  cabo do martelo, e a funda existe como arma do jogo sem número próprio (proposta: ×1,5, ao lado
  do fator de forma). **A energia que chega**: uma pedrinha de 2 g voa 94 m e entrega 2 J, que não
  machuca ninguém, e o corte da ponta leve é energia e não distância. **Limite de pegada**: acima
  de uns 13 cm de diâmetro não sai de uma mão. **Duas mãos**: no objeto leve saem 75% da velocidade
  de uma mão, no pesado empata, ou seja, é penalidade no leve e é a única opção no pesado.
- [ ] **H4 · [DECIDIR] O degrau de baixo do fator de forma: ÷2 ou ÷3?** Ressalva já medida na §3 da
  proposta. Pela densidade seccional, um baralho de cartas e uma bola de beisebol pesam quase o
  mesmo e o baralho chega a **22% do alcance**, não aos 50% que o ÷2 promete. Fica em ÷2 por
  simplicidade; se incomodar em mesa, o conserto é uma tecla.

---

