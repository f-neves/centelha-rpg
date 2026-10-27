# Etapa 4: A5 e A5j (26/10/2026)

155 fontes unificadas, de 302 fichas lidas; 147 paradas. As outras 169 fontes seguem no caminho anterior (147 com parada e 22 sem ficha).
O gerador usa o motor nas fontes unificadas; a ficha e os resumos do jogador compartilham conjunto, derivados, massa e levantamento. O PV dos simuladores passa ao motor.
A massa em kg é escolhida pelo jogador; PV pelo Tamanho racial. A mesa corrige Vitalidade, Bloqueio, Iniciativa e teto dos arcos (D-234, D-237). A Arte de força conserva sua escala aprovada, chamada pelo motor.
Validação: validate completo e tsc sem erros; 5969 contas, 302 criaturas, 6 referências de jogador e 5 casos raciais. Kael conserva seus números. Revisao não chega aos três gerados.
[Relatório por criatura e chave](relatorio-a5.json), contra dd7a9cc4, reproduzido com scripts/comparar-criaturas.mjs. Só as 155 convertidas mudaram nos três gerados.
Espera as 324: stat, periciasDe, furtividadeCriatura, régua de porte, conversor antigo e seus leitores ainda usados pelas 169 fontes restantes. Calc.ts conserva leitores do editor, tratado na A9.
Espera ajustes da Bestiarista: 24 diferenças P4, quatro linhas de Sociabilidade, oito enxames e paradas do conversor. Fichas MD intactas. Nenhuma publicação ou acesso ao banco.
O conversor recusa texto copiado da Rajada, omite o teto da classe já calculado e preserva só o limite próprio menor. A leitura final incorporou novos ajustes recebidos durante a validação.
