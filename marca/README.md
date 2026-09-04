# marca

Peças da marca Centelha para uso fora do site (apresentação, redes, capa de mesa).
Nada aqui é servido pelo site: o que o site usa mora em `public/` (favicon e ícones)
e em `src/components/CentelhaSpark.astro` (a faísca viva, em SVG).

## Os GIFs

A faísca respirando, ciclo de 5 s em laço perfeito, 20 quadros por segundo,
512 × 512. Gerados por `node scripts/gera-marca-gif.mjs`, que lê a geometria de
`src/lib/centelha-spark.ts`: se o desenho mudar lá, é só rodar de novo.

| arquivo | fundo | faísca |
|---|---|---|
| `centelha-transparente.gif` | nenhum | ouro `#b08d3a` |
| `centelha-azul.gif` | petróleo `#0B3B47` | ouro `#d9b85f` |
| `centelha-claro.gif` | pergaminho `#f3e9d2` | ouro `#b08d3a` |

A versão transparente sai **sem a aura**. O GIF só tem transparência de 1 bit,
então um brilho que esmaece não esmaece: ele é cortado num limiar e vira um halo
de borda dura em volta da faísca. Sem aura, o recorte cai exatamente na silhueta.

O ouro `#b08d3a` é o do tema claro e o `#d9b85f` é o do escuro, os mesmos dois
valores do token `--gold` em `src/styles/global.css`. Na versão transparente vai
o mais escuro dos dois, que é o que se segura nos dois lados: sobre pergaminho
ainda tem contraste e sobre fundo escuro passa AA.
