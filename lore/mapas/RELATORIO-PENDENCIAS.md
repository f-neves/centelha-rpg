# Relatório da rodada das pendências (2026-09-23, 23h em diante)

Arquivo de reencontro: atualizado ANTES de começar cada item. Se a sessão cair, a
próxima começa por aqui. Tudo o que for decisão neste relatório é **recomendação do
Cartógrafo**, nunca decisão do usuário.

Pedido: seis pendências que não dependem do usuário, nesta ordem, commit por etapa com
caminhos explícitos, sem push, controle negativo no que grava dados, sem teste por
clique automatizado, servidor só quando precisar. Fora: folhas de símbolos novas, PSD
de montagem, nomes definitivos.

## Estado dos itens

| item | estado | commit |
|---|---|---|
| 0 git, push, `DECISOES-A-REVISAR.md` | feito | `4c5eedb`, `76b0c39` |
| a desvio de colisão entre nomes | feito | `76b0c39` |
| b largura do rio por afluentes | feito | (o commit deste texto) |
| c cadeado de camada (regiões, nomes, elementos, rotas) | a fazer | |
| d atração do braço de delta | a fazer | |
| e via desalinhada | a fazer | |
| f medição Neck ↔ Calin com o cache | a fazer | |

## Diário

### 0 · git, push e as decisões (feito)

- `core.hooksPath` achado absoluto às 23:21:41; às 23:34:59 já estava certo, porque a
  sessão Arquiteto `8519166b` rodou o conserto às 23:22:15. Nota de padrão recorrente
  em `registro-git.jsonl`.
- Push: nenhum feito pelo Cartógrafo. Achado em "Achados técnicos" do CARTOGRAFO.
- `DECISOES-A-REVISAR.md`: as 10 decisões, cada uma com a alternativa descartada e o
  custo de mudar de ideia. As alternativas das decisões 2 a 5 não estavam escritas em
  lugar nenhum e estão marcadas *(reconstruída)*.

### a · desvio automático de colisão entre nomes (feito)

Plano (recomendação do Cartógrafo):
- Só o nome de LUGAR se move sozinho, e só se não tiver posição dada à mão nem estiver
  travado. Nome de região (a posição mora no `rotulo`, arrastado no painel), nome
  livre, nome com curva e nome de rio e rota ficam onde estão e viram obstáculo.
- Candidatos em volta do símbolo, na ordem de preferência de atlas: direita em cima
  (a de hoje), esquerda em cima, direita embaixo, esquerda embaixo, em cima, embaixo.
  Vence o primeiro sem sobreposição com nome já posto e com símbolo de lugar; se
  nenhum estiver livre, o de menor sobreposição, e sai um aviso.
- O plano é calculado com TODOS os nomes, na grade global de pixels, sem olhar a
  janela: o mesmo nome sai no mesmo lugar em qualquer recorte e em qualquer bloco.
- Nada é gravado em `dados/`: a posição escolhida é só desenho.

Resultado:
- Código em `composicao.py` e `tipografia.py`; esquema e limites em
  `ESPEC-ferramenta.md`, "Desvio automático de colisão entre nomes". 395 testes verdes
  (8 novos).
- **Onde ver**: `render/pendencias/a-mere-antes.png` e `a-mere-depois.png` (Mére a
  metade da resolução oficial), e `a-mere-zoom.png` (o trecho do deserto, antes à
  esquerda, depois à direita). Só um nome mudou em Mére: "Oásis de Sal" saiu de baixo
  de MÉRE para a esquerda do símbolo. O aviso diz que ainda encosta 149 px² (o halo
  tocando o M); o símbolo do oásis continua debaixo do M, porque o nome de região não
  se move.
- **Decisão minha**: o nome de região não se move sozinho. A posição dele é o
  `rotulo`, que o usuário arrasta no painel; mover por cima disso seria desfazer um
  gesto dele.
- **Depende do usuário**: se o lado escolhido lê bem; e a tela não mostra o lado
  (o marcador do NOMES fica à direita).

### b · largura do rio pela soma dos afluentes (feito)

Plano (recomendação do Cartógrafo):
- Medida de "quanto rio chega" em cada ponto: o comprimento total da rede a montante,
  em km no globo (haversine): o do próprio rio até ali mais o de todo afluente (e
  afluente de afluente) que desaguou antes daquele ponto. Sem dado novo: o afluente é
  quem tem `termina_em: {"tipo": "rio", "id": ...}`, e o ponto de encontro é o trecho
  do rio-mãe mais perto da foz dele.
- Largura na resolução oficial: `1,0 + 0,9 × raiz(km a montante / 100)` px, com teto de
  6 px. Um rio sozinho de 500 km termina com uns 3 px, como hoje; com afluentes,
  engrossa depois de cada encontro.
- Braço de delta (`ramo_de`): recebe a metade do que chega ao rio-mãe no ponto em que
  ele sai, mais o próprio comprimento.
- Calculado com a rede inteira, não com a janela; nada gravado.

Resultado:
- Código em `composicao.py` (`km_a_montante`, `largura_do_rio_px`, `desenhar_rios`);
  registro em `ESPEC-dados.md`, no fim. 7 testes em `tests/test_rio_largura.py`, com
  controle negativo (a mesma linha terminando no mar não soma) e conferência em pixel
  (a jusante do encontro mais grosso; a montante igual).
- **Os dados de exemplo não têm afluente nenhum** (os 5 rios vão ao mar), então no mapa
  de hoje a mudança é só a curva nova de largura. Para ver o efeito, a demonstração
  põe dois afluentes **em memória**, sem gravar nada, no Rio Largo (exemplo): **onde
  ver**, `render/pendencias/b-rio-largo-comparacao.png` (sem afluentes à esquerda, com
  à direita; resolução oficial). Os km a montante do Rio Largo vão de 237 para 507
  depois do primeiro afluente e para 770 depois do segundo.
- **O que ficou fraco**: o degrau é discreto na resolução oficial (2,4 para 3,0 px
  antes do fator de traço); com rede de verdade (dezenas de afluentes) ele cresce.
  Se ler pouco, o número a mexer é `LARGURA_RIO_FATOR`.
