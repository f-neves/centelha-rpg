# Miniaturas no tabuleiro: o que custaria

Estudo de viabilidade, com protótipo medido. A pergunta era: dá para usar modelos
3D como miniaturas estáticas com base hexagonal, isso obriga a mudar para visão
isométrica, e o que acontece com o que já existe.

Data: agosto de 2026. Protótipo em `_shots/3d-inclinado.png` e `_shots/3d-topo.png`.

---

## 1. A contradição que vem antes de tudo

**Visão de topo e miniatura não convivem.** Uma miniatura vista de cima é um
disco com uma cabeça no meio: some o que a faz ser uma miniatura, que é a
silhueta em pé. É por isso que toda mesa virtual 2D usa arte de topo (um
símbolo, uma cara vista de cima) e toda mesa que mostra bonecos inclina a
câmera. Não é escolha estética, é geometria.

Então a pergunta "modelos 3D com visão de topo" não tem resposta boa: ou se
aceita que o modelo vira um disco, ou se inclina a câmera.

**Mas "inclinar a câmera" não quer dizer "isométrica".** Isométrica é uma
projeção específica (paralela, sem ponto de fuga, ângulos fixos), usada em jogos
2D porque permite desenhar peças que encaixam em qualquer posição. O que este
projeto precisa é mais simples e mais barato: **o tabuleiro visto de viés**, como
uma mesa de verdade vista por alguém sentado nela. Isso é uma rotação em X, e o
navegador faz sozinho.

---

## 2. Três rotas, e o que cada uma custa

### Rota A · continuar de topo, trocar só a arte da peça

Nada muda na estrutura. A peça continua sendo um hexágono, mas em vez de um
recorte da ilustração, recebe **uma imagem renderizada de cima** de um boneco na
base: sombra, contorno, um pouco de volume.

- **Custo**: só arte. Zero código.
- **Ganho**: pequeno. Continua sendo um disco, porque é o que a projeção permite.
- **Risco**: nenhum.

Serve se o incômodo for "as peças estão feias", e não "quero ver miniaturas".

### Rota B · inclinar o tabuleiro que já existe, peças em pé como cartazes

O mundo inteiro (fundo, grade, zonas das Artes, setas) ganha **uma rotação em X
por CSS**. Ele continua sendo o mesmo plano com a mesma matemática: só está
sendo olhado de viés. As peças, dentro dele, recebem a **rotação contrária**, o
que as põe em pé como cartazes recortados.

Isto é o que o protótipo faz, e o resultado está na foto. É a rota que este
documento recomenda, e a seção 4 detalha o que quebra.

- **Custo**: médio. Estimativa na seção 6.
- **Ganho**: grande, e imediato: as peças viram miniaturas de verdade.
- **Risco**: concentrado em um lugar só (a conversão ponteiro → hexágono).

### Rota C · WebGL de verdade (three.js), modelos glTF

O tabuleiro vira uma cena 3D: chão texturizado, modelos com malha, luz, câmera
livre. É o que a [3D Canvas do Foundry](https://foundryvtt.com/packages/JB2A_DnD5e)
e o [TaleSpire](https://alternativeto.net/software/talespire) fazem.

- **Custo**: alto. Reescrita do tabuleiro, e a aba tem 4.252 linhas.
- **Ganho**: câmera livre, altura de verdade, oclusão por parede.
- **Risco**: alto, e não é só de código. **O acervo não existe**: são 308
  criaturas no bestiário, e um modelo 3D por criatura é um projeto de arte maior
  que o sistema inteiro. Comprar acervo pronto resolve talvez um terço, com
  estilo desencontrado.

E um custo escondido: o TaleSpire tem requisito de placa de vídeo, e cenas
complexas engasgam em laptops fracos. Hoje a mesa roda em qualquer coisa.

---

## 3. O que o protótipo mediu

O protótipo monta um tabuleiro de 20 × 12 casas com as **mesmas funções do grid
de verdade** (`hex.ts`, `artes-grid.ts`, `artes-grid-fx.ts`), inclina o mundo em
56°, põe metade das peças em pé e metade deitadas, e mede.

| o que | resultado |
|---|---|
| quadros por segundo, mundo inclinado GIRANDO, 18 peças + zona de fogo acesa | **55 a 58** |
| o navegador acerta o hexágono sob o cursor | **30 de 30 · nunca devolveu a casa errada** |
| a conta ponteiro → hexágono de hoje | **erra 35 de 35 · até 7 casas de distância** |
| zonas, grade e fundo | **funcionam sem uma linha de mudança** |

Três leituras disso:

**A inclinação não pesa.** O navegador compõe a rotação na GPU, como já faz com o
zoom. O custo é o mesmo de hoje. Isto derruba a suspeita de que 3D no navegador
é caro: o que é caro é *rasterizar geometria*, e aqui não há geometria nova.

**O plano do chão sobrevive inteiro.** A zona de fogo, com o degradê e as
partículas, caiu no lugar certo sem nenhum ajuste. Faz sentido: ela É o chão, e
o chão só está sendo olhado de outro ângulo. Todo o trabalho das Artes no
tabuleiro (figuras em metros, círculo, faixa, leque, âncora em vértice)
continua valendo.

**O clique quebra, e só ele.** A aba converte pixel em casa por conta própria:
pega o retângulo do mundo, subtrai, divide pelo zoom, chama `hexEmPonto`. Essa
conta pressupõe que a tela é o plano, e depois da inclinação ela erra tudo. Mas o
NAVEGADOR acerta: `elementFromPoint` devolveu a casa certa em todas as sondagens
válidas. A grade já é desenhada como polígonos com `data-q`/`data-r`, então a
correção é trocar aritmética por consulta ao DOM.

> Nota de método: `getScreenCTM` do SVG é uma matriz 2D e **ignora** a rotação 3D
> do ancestral. `getBoundingClientRect` enxerga a transformação inteira. Errei
> nisso na primeira medição e o número saiu quatro vezes pior do que era.

---

## 4. O que quebra na rota B, item por item

Inventário contra o código de hoje.

### Sobrevive sem mexer

- **O fundo do mapa.** É uma imagem no plano do chão. Inclinada, vira exatamente
  o que é: um mapa em cima da mesa.
- **A grade de hexágonos.** Mesmos polígonos.
- **As zonas das Artes** (`artes-grid.ts`, `artes-grid-mesa.ts`,
  `artes-grid-fx.ts`, ~2.400 linhas). Círculo, faixa, retângulo, leque, aura,
  muro: tudo é chão. Medido no protótipo.
- **A seta de movimento e de ataque** (`seta.ts`). Também é chão.
- **A visibilidade e o que o jogador enxerga.** É banco de dados, não desenho.

### Quebra, e é trabalho definido

- **Ponteiro → hexágono.** 6 pontos de uso de `hexEmPonto`. Trocar por
  `elementFromPoint` sobre os polígonos da grade. É a peça central, e é pequena.
- **Arrastar peça.** Hoje soma deltas de pixel divididos pelo zoom. Com o mundo
  inclinado, um centímetro de mouse não é mais um centímetro de tabuleiro, e a
  proporção muda conforme a peça está mais perto ou mais longe. Mesma solução: a
  casa sob o cursor manda, e não o delta.
- **Ordem de pintura das peças.** Num tabuleiro inclinado, quem está atrás tem de
  ser desenhado antes, senão o boneco do fundo cobre o da frente. É o algoritmo
  do pintor: `z-index` pela coordenada Y. Uma linha, mas obrigatória.
- **Texto que precisa ficar legível.** Rótulos de linha e coluna, a distância em
  metros na seta, o nome da peça: tudo isso inclina junto e fica deitado. Cada um
  precisa da contra-rotação, como as peças.
- **As marcas de golpe** (`grid-golpe-fx.ts`). Hoje moram numa camada acima das
  peças, em espaço de tela. Vira decisão de projeto: o impacto acontece no CHÃO
  (e inclina junto) ou no CORPO (e fica em pé como a peça)? Provavelmente os
  dois, dependendo do golpe.
- **O voo do projétil.** Hoje é uma reta no plano. Num tabuleiro inclinado, uma
  flecha que corre colada no chão parece uma cobra. Precisa de altura, o que quer
  dizer sair do plano (`translateZ`) e fazer um arco.
- **O zoom.** Precisa compor com a rotação, e o "caber na tela" precisa considerar
  que o tabuleiro inclinado ocupa outra área.

### Piora, e é decisão de mesa

- **Legibilidade tática.** Na foto dá para ver: as casas do fundo ficam
  espremidas, e o tabuleiro inclinado cabe menos na tela. Contar distância a olho
  fica mais difícil. Isto é um custo de JOGO, não de código, e é o argumento mais
  forte contra a rota B.
- **Peças cobrindo peças.** Bonecos em pé se escondem uns atrás dos outros, o que
  de topo não acontece. Mesas 3D resolvem com transparência ou contorno.

---

## 5. O acervo: a descoberta que muda a conta

O bestiário tem **308 ilustrações**, 16 MB, cerca de 30 KB cada
(`public/bestiario/`, mapeadas em `imagens-bestiario.json`).

Elas são ilustrações de personagem: figura inteira, vista de lado ou de frente.
Hoje são recortadas dentro de um hexágono visto de cima, que é o pior uso
possível para elas: uma figura de corpo inteiro espremida num disco.

**Como cartaz em pé, essas mesmas imagens funcionam do jeito que foram
desenhadas.** O acervo que a rota C não tem, a rota B já tem, comprado e
nomeado. Isso inverte a economia: a rota B não precisa de arte nova nenhuma para
começar, e a rota C precisaria de 308 modelos.

O trabalho de arte da rota B é recorte de fundo (deixar a figura em PNG com
transparência). Isso é automatizável em lote com razoável qualidade, e o que
sair torto se corrige criatura a criatura, sem bloquear nada.

---

## 6. Estimativa

Rota B, em ordem de dependência:

| etapa | o que é | tamanho |
|---|---|---|
| 1 | Rotação do mundo + contra-rotação das peças + ordem de pintura | pequena |
| 2 | Ponteiro → hexágono por `elementFromPoint`, nos 6 pontos de uso | pequena |
| 3 | Arrastar peça pela casa sob o cursor | média |
| 4 | Contra-rotação de todo texto (rótulos, distância, nome) | pequena |
| 5 | Recorte de fundo das 308 ilustrações, em lote | média, e paralela |
| 6 | Marcas de golpe: decidir chão × corpo, e refazer | média |
| 7 | Projétil com altura e arco | média |
| 8 | Zoom e "caber na tela" compondo com a inclinação | pequena |
| 9 | Chave para voltar à visão de topo | pequena |

A etapa 9 não é enfeite: **a inclinação tem de ser um botão, não um caminho sem
volta**. Quem quiser ler o tabuleiro taticamente aperta e vê de cima; quem
quiser ver a cena, inclina. Isso também é a rede de segurança do projeto inteiro,
porque a visão de topo continua sendo o modo que funciona hoje.

Rota C, para comparação: reescrever o tabuleiro (4.252 linhas na aba, mais os
2.400 das Artes que hoje desenham em SVG e passariam a precisar de geometria),
mais 308 modelos, mais o custo de excluir quem tem máquina fraca. É um projeto de
outra ordem de grandeza, e não uma etapa seguinte da rota B.

---

## 7. Recomendação

**Rota B, com a inclinação como botão.**

O que decide não é o efeito visual, são três fatos medidos: o custo de quadro é
zero, o plano do chão sobrevive inteiro (com ele, todo o trabalho das Artes), e o
acervo de arte já está no repositório e é do tipo certo.

O que fazer primeiro, se for para experimentar barato: **as etapas 1, 2 e 9**, com
as peças usando as ilustrações que já existem, sem recorte de fundo. Isso cabe
numa sessão, não quebra nada (o botão volta ao que existe hoje), e responde a
única pergunta que o protótipo não responde, que é se a mesa GOSTA de jogar
assim.

O resto só vale a pena se a resposta for sim.

---

## 8. Referências

- [3D VTT Roundup and Review · Gnome Stew](https://gnomestew.com/a-3d-vtt-roundup-and-review/comment-page-1/)
- [TaleSpire e alternativas](https://alternativeto.net/software/talespire)
- [JB2A · Foundry VTT](https://foundryvtt.com/packages/JB2A_DnD5e)
- [Draw Calls: The Silent Killer · Three.js Roadmap](https://threejsroadmap.com/blog/draw-calls-the-silent-killer)
- [Three.js Instances · Codrops](https://tympanus.net/codrops/2025/07/10/three-js-instances-rendering-multiple-objects-simultaneously/)
- [Building Efficient Three.js Scenes · Codrops](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [Pre-rendering · Wikipedia](https://en.wikipedia.org/wiki/Pre-rendering)
- [Isometric Sprites for 2D/3D Games · RetroStyle](https://retrostylegames.com/outsourcing/3d-2d-game-sprites/)
- [Billboarding · Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/direct3d9/billboarding)
