# Especificação da ferramenta de pintura do mapa de Uldun

Proposta da IA, revisada em 2026-09-21. Nada aqui foi construído; é especificação para
o usuário revisar e aprovar antes de qualquer código.

## Arquitetura

Servidor local em Python (FastAPI) servindo uma página com canvas (JS puro ou
Konva.js). O canvas manda a geometria desenhada para o servidor; o servidor grava em
`dados/*.json`/`*.geojson` e devolve uma renderização em baixa resolução para prévia.
Nenhum estado importante mora só no navegador — fechar a aba não perde trabalho, porque
cada ação já foi salva no servidor.

## Vetor, não grade de controle

Diferente da especificação anterior, **não existe mais resolução de controle fixa
(2048px)**. Área pintada é polígono em lat/lon (GeoJSON), guardado sem perda. A
rasterização (transformar polígono em pixels coloridos) acontece sob demanda: baixa
resolução para prévia ao vivo, alta resolução (10240 ou 20480px) só quando pedida. Isso
também resolve o problema antigo de ilha pequena/canal fino sumir no grid de controle:
o polígono desenhado não é arredondado para nenhuma grade, só a imagem final é.

## Camadas de pintura

- **Relevo** (uma por pedaço de terra): planície, colina, montanha, alta montanha.
- **Cobertura** (uma por pedaço de terra, independente do relevo): floresta temperada,
  floresta tropical, floresta boreal, selva, campo, deserto, pântano, tundra, geleira.
- **Lago**: única exceção à costa travada — o usuário desenha e edita o contorno
  livremente.
- Terra sem cobertura pintada usa a automática por latitude (guia de clima do
  CARTOGRAFO); pintar por cima sobrescreve, sempre.

## Ferramentas

- **Área** (laço poligonal, clique a clique, não arrasto livre): preenchimento sempre
  recortado pela costa oficial (nunca pinta em cima do mar). Operações de somar,
  subtrair e apagar pedaço de área usam shapely.
- **Linha**: rio (encadeia pontos; ferramenta valida que termina em mar/lago/outro rio
  antes de deixar salvar) e estrada/trilha (encadeia pontos e lugares).
- **Ponto**: lugar (cidade, vila, fortaleza, porto, ruína, marco, capital).
- Todas com desfazer/refazer. Sem borracha de pixel — apagar é sempre apagar a
  área/linha/ponto inteiro ou parte dela pelo laço, nunca risco livre.

## Travamento da costa (confirmado nesta sessão — item 5 do relatório)

Toda operação de preenchimento consulta **sempre** `mascaras/costa_10240.png` (a
máscara oficial, nativa), nunca uma versão reduzida. Ilha pequena ou canal fino não
desaparece porque não existe mais redução de resolução no meio do caminho: o polígono
desenhado pelo usuário é recortado pixel a pixel contra a máscara de 10240px na hora de
rasterizar, em qualquer resolução de saída.

## Identificação de ilha e pertencimento a região

- Cada massa de terra relevante tem id e ponto de referência em `massas.geojson`; a
  ferramenta descobre a extensão da ilha clicando o ponto de referência contra a
  máscara oficial (preenchimento por inundação), não guarda o contorno.
- Ao abrir uma ilha sem região (`status: "sem_regiao"` ou `"duvidosa"`), a ferramenta
  destaca o contorno dela e mostra um menu: atribuir a uma região existente, criar
  região nova, ou deixar sem região. Atribuição automática só roda para ilha a menos de
  100km da ilha PRINCIPAL de alguma região (testado nesta sessão: quase nunca dispara
  sozinha nas 5 regiões atuais, então a maior parte da atribuição vai ser manual).
- O painel lateral de regiões (ver esboço abaixo) lista toda ilha sem região marcada em
  magenta; clicar nela abre o mesmo menu.

## O que acontece se o usuário apagar uma área com rio ou cidade dentro

Rio e cidade são objetos independentes (linha e ponto), não fazem parte da área
pintada. Apagar uma área de relevo/cobertura **não apaga** o rio ou a cidade que estava
por cima — eles continuam existindo, só que agora sobre terra sem relevo/cobertura
definidos (volta ao automático por latitude, ou fica sem relevo até o usuário pintar de
novo). A ferramenta avisa antes de confirmar o apagamento se houver rio ou lugar dentro
da área ("esta área tem 1 rio e 2 lugares por cima; eles não serão apagados"), para o
usuário não ser pego de surpresa.

## Esboço visual da tela

Ver `render/analise/esboco_ferramenta.png`.

```
+-------------------------------------------------------------------------------------+
| Uldun - editor | camada: RELEVO [Planicie|Colina|Montanha|Alta montanha] | laco...  |
+-----------------+---------------------------------------------------+---------------+
| FERRAMENTAS      |                                                   | REGIOES/ILHAS |
| [ ] Laco (area)  |                                                   | Mere          |
| [ ] Rio          |             canvas do mapa                       | Syl           |
| [ ] Estrada      |          (terra pintada, rio, lugar)              | Calin         |
| [ ] Lugar        |                                                   | The Neck      |
| [ ] Regua         |                                                  | White Wall    |
| [ ] Grade lat/lon |                                                  | ilha #84 -    |
|                   |                                                  |  sem regiao   |
| CAMADAS DE FUNDO  |  previa de baixa resolucao ao arrastar;          |               |
| [x] Ocean Deep    |  renderizacao final so sob pedido                | clique numa   |
| [x] ChatGPT ref   |                                                  | ilha sem      |
| [x] Rotulos       |                                                  | regiao        |
+-------------------+---------------------------------------------------+---------------+
| PAINEL DA SELECAO                                                                    |
| area selecionada: id=area-0042 relevo=colina cobertura=floresta-temperada (auto)     |
| semente de ruido da borda: 8821 (fixa por area)                                      |
| [Salvar]  [Rasterizar previa]  [Rasterizar final 20480px]                            |
+-------------------------------------------------------------------------------------+
```

## Régua, grade e prévia

- Régua de distância real, usando a definição de `coordenadas.json` (haversine, não a
  régua da tela).
- Grade de lat/lon ligável.
- Prévia: rerender da região visível em poucos segundos, resolução baixa. Tela inteira
  em alta resolução só sob pedido explícito (aviso antes, por causa da RAM da máquina).

## Camadas de referência com transparência

Ocean Deep, as 4 imagens do ChatGPT, rótulos extraídos de `Mapa Teste1.jpg` — todas
ligáveis/desligáveis, com opacidade ajustável, nunca editáveis.

## Divisão da construção em etapas pequenas, cada uma testável

Cada etapa entrega algo que o usuário consegue **usar e ver funcionando**, sem esperar
a ferramenta inteira. Nenhuma etapa mexe na costa.

1. **Servidor + canvas vazio com a costa oficial de fundo.** Ao fim: o usuário abre a
   página no navegador e vê o contorno de Uldun (a partir de `costa_10240.png`), pode
   dar zoom e navegar, mas ainda não desenha nada.
2. **Ferramenta de Lugar (ponto).** Ao fim: o usuário clica no mapa, cria um lugar, dá
   um nome, e ele fica salvo em `lugares.json` (reaproveita o arquivo que já existe) —
   fecha o navegador e reabre, o ponto continua lá.
3. **Régua e grade de lat/lon.** Ao fim: o usuário mede a distância real entre dois
   cliques no mapa e vê a grade de coordenadas por cima.
4. **Ferramenta de Área (relevo), sem costa travada ainda.** Ao fim: o usuário desenha
   um polígono de relevo em qualquer lugar do canvas (inclusive sobre o mar, por
   enquanto) e vê ele salvo em `areas-pintadas.geojson` e colorido na tela.
5. **Travamento da área pela costa oficial.** Ao fim: o mesmo desenho do passo 4 agora
   é recortado automaticamente pela costa — desenhar atravessando o mar só pinta a
   parte que é terra.
6. **Camada de Cobertura + cobertura automática por latitude.** Ao fim: terra sem
   pintura mostra a cor da cobertura automática; pintar por cima sobrescreve; apagar a
   pintura volta a mostrar a automática.
7. **Ferramenta de Rio**, com validação de destino (mar/lago/outro rio). Ao fim: o
   usuário desenha um rio, a ferramenta recusa salvar se ele não terminar em um destino
   válido, e a largura visual muda conforme afluentes forem adicionados.
8. **Ferramenta de Estrada**, com lista de lugares no meio do caminho. Ao fim: o usuário
   desenha uma estrada passando por 3+ lugares já marcados.
9. **Camadas de referência com transparência** (Ocean Deep, ChatGPT, rótulos). Ao fim: o
   usuário liga/desliga cada uma e ajusta opacidade.
10. **Identidade de ilha e painel de regiões** (`massas.geojson`, atribuição manual e a
    regra dos 100km). Ao fim: o usuário abre o painel de regiões, vê as ilhas sem
    região marcadas, clica numa e atribui a uma região ou cria uma nova.
11. **Ruído de borda com semente fixa + rasterização em alta resolução.** Ao fim: o
    usuário pede uma renderização em 10240 ou 20480px de uma área e recebe um arquivo,
    com borda naturalmente irregular e idêntica se pedir de novo.
12. **Lago** (exceção à costa travada). Ao fim: o usuário desenha um lago dentro da
    terra e a costa do mar continua intocável.

Cada etapa pode ser interrompida e retomada depois sem perder as anteriores, porque
cada uma grava em arquivo de dados próprio, não em estado descartável.
