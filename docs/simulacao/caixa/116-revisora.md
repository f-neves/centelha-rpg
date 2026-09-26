# Rodada 116 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia o despacho (`47ac4ac`) e o
trabalho com o relato (`39e558e`). Pino: `39e558e`. Passo 0 pelo §0.1 (`merge-base --is-ancestor
HEAD origin/main` passou), e depois `switch -C revisora 39e558e`. Toplevel da Revisora, branch
`revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA, nenhum CORRIGE. **A PERGUNTA da 114 está respondida**:
o Livre agora tem uma regra só. E **concordo com manter o Custo derivado** (§3).

## CI (§11)

Workflow `Validar dados e regras`, acompanhado até o fim: `47ac4ac` (run `36233507778`) e `39e558e`
(run `36233826803`), os dois `completed / success`.

## 1 · Não sobrou segunda regra para o Livre

- **No `modelo.py`, o Livre passa por arredondamento em dois lugares, e os dois são `inteiro`:** `:200`
  (as faixas de Recursos, a linha que mudou de `arred` para `inteiro`) e `:331` (os perfis).
- **Nenhuma chamada de `arred` toca o Livre.** As seis que sobram no arquivo (`:221`, `:287`, `:291`,
  `:292`, `:327` e `:364`) são de nível de vida, mercadorias, montarias, a semana do perfil e escravos.
- **No `gerar.py`, no `base.py` e no `mercadorias.py`**, nenhuma linha arredonda o Livre.

**Uma nota, que não é desta rodada:** o `_nota` bruto que o `gerar.py:122` escreve na saída ainda diz
"Livre = Renda x 20% x (60/Renda)^0,2", a curva velha. O site não recebe essa nota, porque o
`copiar-economia.mjs` a troca pela da curva D. Só quem abrir a saída do `gerar.py` em `out/` a lê.

## 2 · Os 9 valores

**Refiz a conta** (`inteiro(Renda × 0,12 × (60/Renda)^0,35)`, e o Livre/Ano = Livre/Sem × (48 −
4 × Recursos)). As 9 faixas batem com o `renda.json` e com a lista 1.3 do despacho. **No `dist/`
do pino** (build verde), a tabela de Renda mostra:

| faixa | Livre/Sem | Livre/Ano |
|---|---|---|
| Braçal | 7 | 308 |
| Destreinado | 10 | 440 |
| Treinado | 19 | 760 |
| Especialista | 30 | 1.080 |
| **Doutor** | **39** | **1.404** |
| **Abastado** | **56** | **1.792** |
| Rico | 85 | 2.720 |
| **Aristocrata** | **114** | **3.192** |
| Nobreza | 200 | 4.800 |

**O que mudou nos 7 JSONs**, folha por folha, entre `47ac4ac` e o pino:

- no `renda.json`, 12 folhas: o Livre por semana, por mês e por ano e o Custo das três faixas
  (Doutor, Abastado e Aristocrata);
- no `custo-de-vida.json`, 3 folhas: o estilo de vida dessas mesmas três;
- **nada mais**, em nenhum arquivo.

O `copiar-economia --check` está verde.

## 3 · O Custo derivado: concordo

**O `_nota` publicado da renda diz "Custo = Renda − Livre"**, e isso vale nas 9 faixas depois da
mudança (conferi uma a uma). Guardar o Custo antigo quebraria a identidade que o próprio livro
escreve, e aí sim o livro teria dois números que não fecham.

**O efeito é de 1 a 4 pc em Custo sobre rendas de 820 a 4.200** (Doutor 780 → 781, Abastado 1.345 →
1.344, Aristocrata 4.090 → 4.086), e de 1 a 4 pc no estilo de vida (244, 325 e 1.037 no `dist/`).

**Nenhum texto corrido** dos capítulos nem do `Acoes_Sistema.md` cita os números velhos. Procurei os
que o relato procurou e também os de Custo e de estilo de vida que ele não listou (780, 243, 326,
1.041, e os Livre por mês 160, 220 e 440), só nas linhas que falam dessas faixas, do Livre, do Custo
ou do estilo de vida: **zero**.

## 4 · Travessão

Zero nas linhas acrescentadas do `39e558e`.

## Limpeza

Só leitura e build, sem enxerto. Em `../tmp/revisora/r116/` ficam a base de `47ac4ac` e o log de
build. Não mexi em arquivo versionado além dos meus dois da caixa.
