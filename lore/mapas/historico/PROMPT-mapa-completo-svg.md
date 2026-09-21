# Prompt: mapa completo (água + terreno) a partir do SVG

Ferramenta: Claude ou ChatGPT (geração/edição de imagem).
Arquivo base: `Mapa Teste.svg` (vetor preto e branco, 10240 × 10240 pt, quadrado).
Se o modelo não aceitar SVG direto, rasterize para PNG antes (mantendo o quadrado e alta resolução).

**Semântica das cores do arquivo (verificada):**
- **BRANCO = TERRA (terreno).**
- **PRETO = ÁGUA (mar / oceano).**

Cole o texto abaixo junto com o arquivo.

---

Gere um mapa de fantasia **colorido e completo (água E terreno)** usando a imagem em preto e branco como **máscara exata de terra e mar**.

**LEITURA DA MÁSCARA (obrigatória):**
- As áreas BRANCAS são TERRA. As áreas PRETAS são ÁGUA (mar).
- Use o contorno da máscara como litoral DEFINITIVO. Não redesenhe as costas, não invente terra nova, não apague terra existente, não mude o formato das massas.

**ATENÇÃO MÁXIMA ÀS BORDAS EXTERNAS (o pedido central):**
- Preserve cada faixa preta (mar) entre massas de terra. **Continentes e ilhas separados por mar devem permanecer separados.** Não deixe a cor de terreno atravessar estreitos, canais ou pequenos vãos de mar; nunca funda duas ilhas numa só.
- Trate cada mancha branca como uma massa de terra independente, com sua própria linha de costa fechada. Ilha pequena continua ilha. Onde houver dúvida, mantenha o mar (não conecte terras).
- Não crie pontes de terra, istmos ou baixios que já não estejam na máscara.

**ÁGUA (as áreas pretas):**
- Pinte todo o mar como oceano de atlas de fantasia: azul profundo em mar aberto, clareando para um azul-esverdeado nas águas rasas junto às costas. Sombreamento suave e sutil textura de correntes. Sem texto, sem rosa-dos-ventos, sem molduras.

**TERRENO (as áreas brancas), com relevo e biomas (norte = topo da imagem):**
- **Extremo norte (borda superior) e a grande massa de terra no alto / canto superior esquerdo (The White Wall):** as montanhas mais altas do mundo, TODAS cobertas de gelo e neve. Branco e branco-azulado, geleiras e cristas nevadas densas. Terra gélida.
- **Aglomerado de ilhas logo abaixo e à direita do White Wall (The Neck), no quadrante superior esquerdo-central:** frio, porém habitável. Costas nevadas, tundra, coníferas esparsas, verde-acinzentado frio, picos brancos baixos. Menos gelo que o White Wall.
- **Massa central em forma de lua minguante (Waning):**
  - **Lobo NORTE do crescente (Calin):** temperado. Algumas montanhas, florestas e rios, porém MENOS que nas outras partes; sugira mais ocupação (manchas de campos e estradas). Verde temperado com serras moderadas.
  - **Braço OESTE / SUDOESTE do crescente (Syl):** clima mais quente e exuberante. Muitas florestas verdes densas, vários lagos e rios, planícies amplas. Poucas montanhas. A parte mais verdejante do mapa.
  - **Grande massa LESTE / SUDESTE do crescente (Mére):** dividida em duas. A metade NORTE é mais montanhosa, mais fria e menos habitada (montanhas marrom e cinza, alguns picos nevados, pouca vegetação). A metade SUL é mais quente, com mais rios, vegetação densa e sinais de civilização (verde exuberante, vales fluviais).
- **Demais massas de terra sem nome (bordas esquerda e direita, canto inferior esquerdo, cantos):** gradiente por latitude. Quanto mais ao NORTE (topo), mais frio e nevado; quanto mais ao SUL (base), mais verde e temperado. Coerente com as regiões nomeadas.

**ESTILO:** mapa de fantasia pintado à mão, atlas em pergaminho, coeso; sombreamento de relevo delicado (luz vindo do noroeste); rios e lagos em azul fino DENTRO da terra (descendo das montanhas para o mar, sempre contidos na terra); nada fotorrealista, parece desenhado à mão.

**DETALHES:** preserve o enquadramento quadrado; transições suaves; o resultado deve parecer um único mapa ilustrado coeso; sem rótulos (os nomes entram depois).

**SAÍDA / FORMATO DO ARQUIVO (obrigatório):**
- **Sem compressão com perdas.** Entregue a imagem em formato sem perdas (PNG, TIFF ou SVG). Nada de JPG.
- **Mesmas dimensões do arquivo de entrada:** o arquivo final deve ter exatamente **10240 × 10240** (mesma largura e altura do original, quadrado). Não reduza a resolução.
- **Pode retornar um arquivo SVG** (vetorial). Se retornar SVG, preserve o `viewBox` / dimensões de 10240 × 10240 e mantenha a fidelidade dos contornos da máscara (a separação entre terra e mar).

---

Observações de uso:
- O ponto mais crítico é a separação das terras. Se o modelo fundir ilhas, reforce na conversa: "as áreas pretas são mar e NÃO podem virar terra; mantenha cada mancha branca isolada pelo mar ao redor".
- Se o editor perder detalhe fazendo tudo de uma vez, rode em etapas (primeiro só definir água x terra fiel à máscara, depois adicionar biomas e relevo).
- Funciona igual em inglês, se preferir mandar para um modelo em inglês.
