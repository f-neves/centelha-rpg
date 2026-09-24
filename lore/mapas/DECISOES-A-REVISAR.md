# Decisões a revisar (empreitada autônoma de 2026-09-23)

Todas são **recomendação do Cartógrafo**. Nenhuma está aprovada até o usuário dizer.
Detalhe de cada uma em `RELATORIO-FINAL.md` (etapa entre parênteses).

1. **Símbolos planejados por área, não por janela de saída** (B1). Descartei planejar
   por janela, como o renderizador antigo: o mesmo lugar sairia diferente em cada
   recorte e o mundo em blocos teria costura. Se mudar: volta o renderizador antigo
   (ainda existe para as prévias), e exportação e mundo em blocos perdem a prova byte a byte.
2. **Distorção: números, semente e o que não se distorce** (B5). Força de 0 (nível 5)
   a 1 (nível 1), até ~630 km de desvio; semente = mercador + recorte, sem o nível;
   título, grade e moldura intactos. Descartei semente com o nível (o mesmo mercador
   erraria em direções diferentes). Se mudar: só `cartografia/distorcao.py`, dado nenhum.
3. **Versão do jogador por `visivel_jogador`** em lugar, região, rota, nome e
   elemento (B1, B3). Descartei camada separada "só mestre" (cada objeto teria dois
   lugares para morar). Se mudar: o campo sai do esquema e as exportações de jogador
   já feitas deixam de ser reproduzíveis.
4. **Rotas** (B4): navio 120 km/dia (mercante) e 80 (galera), barco 60 rio abaixo e
   25 rio acima; fluvial segue a regra da terra sem exigir rio desenhado; só as pontas
   grudam em lugar (5 km); estilo pontilhado e traço-ponto. Descartei fluvial preso a
   rio desenhado (quase não há rio). Se mudar: números em `backend/rotas.py`, sem migrar dado.
5. **Nomes** (B1): Palatino; região e cordilheira em maiúsculas espaçadas; tamanhos
   15/21/30/46/70 px por nível; curva só em forma 1,7× mais longa que larga e até 40°
   de inclinação (Mére sai reta). Descartei curva sempre (nome de ilha em pé fica
   ilegível). Se mudar: só `cartografia/tipografia.py`; os ajustes gravados valem.
6. **Barra de escala desenhada, calibrada a 21,87° N** no mundo e na latitude central
   de cada recorte (B2). Descartei a peça da folha, que tem divisões fixas e não
   calibra. Se mudar: volta a peça, e a escala mente fora do equador (a 60° erra o dobro).
7. **Regra dos 100 km automática só com UMA região candidata** (A3). Descartei
   escolher a mais próxima: Mére e Syl estão a menos de 100 km uma da outra, e a
   escolha seria arbitrária. Se mudar: ilhas entre as duas passam a ser atribuídas
   sozinhas, e é preciso conferir as que já foram.
8. **Relevo manda sobre cobertura, e geleira com o dobro do espaçamento** (A1-bis).
   Descartei cobertura por cima do relevo (coníferas cobriam os picos). Colina fica de
   fora da regra. Se mudar: `Estilo.relevo_manda` desliga com uma linha; a geleira é um número.
9. **Limite de 60 Mpx por exportação pela tela, e exportação em processo separado**
   (B3). Descartei exportar dentro do servidor (a memória dele crescia e a máquina tem
   16 GB). Se mudar: o limite é um número; acima dele continua valendo o script.
10. **Achado, não decidido: `ilha-192` e `ilha-204`** de `massas.geojson` são pedaços
    de Syl e de Mére (mesmo componente no cache de ilha). Não mexi. As opções são
    apagar as duas, fundir nas principais ou mantê-las como marcas internas; qualquer
    uma muda o que "identificar ilha" responde nesses pontos.
