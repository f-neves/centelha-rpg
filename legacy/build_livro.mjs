// build_livro.mjs — gera livro.html (Centelha) com design teal/pergaminho/2-colunas/Paged.js
// Uso: node build_livro.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ========================================================================
   1. DADOS AUTORITATIVOS (espelham a ficha_interativa.html)
   ===================================================================== */
const TECH = {
'Passo Veloz':['Vento',1],'Salto do Grilo':['Vento',1],'Reflexos de Vento':['Vento',1],'Corrida Vertical':['Vento',2],'Passos sobre Folhas':['Vento',2],'Esquiva Impossível':['Vento',2],'Encontrão Relâmpago':['Vento',2],'Mil Passos':['Vento',3],'Borrão':['Vento',3],'Ataque Relâmpago':['Vento',4],'Passo do Trovão':['Vento',4],'Cavalgar o Vento':['Vento',5],'Velocidade Divina':['Vento',5],
'Golpe Pesado':['Punho de Ferro',1],'Quebrar Guarda':['Punho de Ferro',1],'Mão de Ferro':['Punho de Ferro',1],'Soco Trovejante':['Punho de Ferro',2],'Esmagar':['Punho de Ferro',2],'Investida Devastadora':['Punho de Ferro',2],'Golpe do Titã':['Punho de Ferro',3],'Punho que Parte Pedra':['Punho de Ferro',3],'Quebra-Montanhas':['Punho de Ferro',4],'Onda de Choque':['Punho de Ferro',4],'Punho do Cataclismo':['Punho de Ferro',5],
'Tom de Autoridade':['Comando',1],'Ordem Curta':['Comando',1],'Encarar':['Comando',1],'Voz de Comando':['Comando',2],'Submissão':['Comando',2],'Comando Inspirador':['Comando',2],'Comando Irresistível':['Comando',3],'Aterrorizar':['Comando',3],'Dominação':['Comando',4],'Quebrar o Espírito':['Comando',4],'Palavra de Lei':['Comando',5],
'Pressentimento':['Presságio',1],'Instinto de Sobrevivência':['Presságio',1],'Faro para Mentiras':['Presságio',1],'Reflexos Premonitórios':['Presságio',2],'Pressentir o Golpe':['Presságio',2],'Ler o Momento':['Presságio',2],'Vislumbre':['Presságio',3],'Esquiva Profética':['Presságio',3],'Caminho do Destino':['Presságio',4],'Ler o Fio':['Presságio',4],'Olho do Oráculo':['Presságio',5],
'Pele Curtida':['Pele de Pedra',1],'Aguentar o Tranco':['Pele de Pedra',1],'Tensionar':['Pele de Pedra',1],'Pele de Pedra (téc.)':['Pele de Pedra',2],'Inquebrantável':['Pele de Pedra',2],'Carne de Granito':['Pele de Pedra',3],'Fortaleza Viva':['Pele de Pedra',4],'Pele Adamantina':['Pele de Pedra',5],
'Mira Firme':['Olho de Águia',1],'Tiro Rápido':['Olho de Águia',1],'Olho de Alcance':['Olho de Águia',1],'Tiro Perfurante':['Olho de Águia',2],'Disparo Múltiplo':['Olho de Águia',2],'Tiro Impossível':['Olho de Águia',3],'Flecha que Persegue':['Olho de Águia',4],'Chuva de Mil Flechas':['Olho de Águia',5],
'Primeira Impressão':['Voz de Mel',1],'Palavra Calmante':['Voz de Mel',1],'Charme':['Voz de Mel',1],'Carisma Magnético':['Voz de Mel',2],'Desarmar':['Voz de Mel',2],'Encantamento':['Voz de Mel',3],'Coração nas Mãos':['Voz de Mel',4],'Voz que Move Multidões':['Voz de Mel',5],
'Sentidos Apurados':['Olho Aguçado',1],'Olhar do Caçador':['Olho Aguçado',1],'Visão na Penumbra':['Olho Aguçado',1],'Ler o Terreno':['Olho Aguçado',2],'Ouvido Absoluto':['Olho Aguçado',2],'Visão Verdadeira':['Olho Aguçado',3],'Clarividência':['Olho Aguçado',4],'Olho que Tudo Vê':['Olho Aguçado',5],
'Recuperação Acelerada':['Cerne Vital',1],'Ignorar a Dor':['Cerne Vital',1],'Segundo Fôlego':['Cerne Vital',1],'Fechar Feridas':['Cerne Vital',2],'Constituição Férrea':['Cerne Vital',2],'Regeneração':['Cerne Vital',3],'Recompor-se':['Cerne Vital',4],'Imortalidade Tênue':['Cerne Vital',5],
'Pisar Leve':['Sombra',1],'Esgueirar':['Sombra',1],'Mãos Sutis':['Sombra',1],'Manto de Sombras':['Sombra',2],'Bote Silencioso':['Sombra',2],'Andar entre Olhares':['Sombra',3],'Unir-se à Sombra':['Sombra',4],'Inexistência':['Sombra',5],
'Postura Fluida':['Dança da Lâmina',1],'Aparar':['Dança da Lâmina',1],'Finta':['Dança da Lâmina',1],'Riposte':['Dança da Lâmina',2],'Desarme':['Dança da Lâmina',2],'Dança entre Lâminas':['Dança da Lâmina',3],'Mil Cortes':['Dança da Lâmina',4],'Lâmina Perfeita':['Dança da Lâmina',5],
'Fúria':['Sangue Fervente',1],'Ignorar Ferimentos':['Sangue Fervente',1],'Brado de Guerra':['Sangue Fervente',1],'Sede de Sangue':['Sangue Fervente',2],'Investida Furiosa':['Sangue Fervente',2],'Frenesi':['Sangue Fervente',3],'Não Sentir Dor':['Sangue Fervente',4],'Avatar da Carnificina':['Sangue Fervente',5],
'Presença Imponente':['Lenda Viva',1],'Inspirar':['Lenda Viva',1],'Discurso':['Lenda Viva',1],'Estandarte Vivo':['Lenda Viva',2],'Temor Reverente':['Lenda Viva',2],'Carisma Heroico':['Lenda Viva',3],'Lenda em Vida':['Lenda Viva',4],'Ícone':['Lenda Viva',5],
'Memória Eidética':['Mente Afiada',1],'Cálculo Veloz':['Mente Afiada',1],'Dedução':['Mente Afiada',1],'Mente Enciclopédica':['Mente Afiada',2],'Ler a Situação':['Mente Afiada',2],'Pensamento Acelerado':['Mente Afiada',3],'Mente Palaciana':['Mente Afiada',4],'Onisciência Momentânea':['Mente Afiada',5],
'Empatia Selvagem':['Vínculo Animal',1],'Acalmar Fera':['Vínculo Animal',1],'Chamado':['Vínculo Animal',1],'Companheiro':['Vínculo Animal',2],'Falar com os Animais':['Vínculo Animal',2],'Matilha':['Vínculo Animal',3],'Forma Bestial':['Vínculo Animal',4],'Senhor das Feras':['Vínculo Animal',5],
'Rosto de Pôquer':['Máscara',1],'Fingir':['Máscara',1],'Disfarce Rápido':['Máscara',1],'Mentira Perfeita':['Máscara',2],'Identidade Falsa':['Máscara',2],'Camaleão Social':['Máscara',3],'Roubar Rosto':['Máscara',4],'Mil Faces':['Máscara',5],
'Força de Carga':['Atlas',1],'Levantamento Poderoso':['Atlas',1],'Arremesso':['Atlas',1],'Carregar o Mundo':['Atlas',2],'Esmagamento':['Atlas',2],'Arrancar':['Atlas',3],'Força Titânica':['Atlas',4],'Atlas':['Atlas',5],
'Demolidor':['Quebra-Muralhas',1],'Pancada Destrutiva':['Quebra-Muralhas',1],'Romper':['Quebra-Muralhas',1],'Estilhaçar':['Quebra-Muralhas',2],'Abrir Brecha':['Quebra-Muralhas',2],'Esmaga-Pedra':['Quebra-Muralhas',3],'Terremoto':['Quebra-Muralhas',4],'Quebra-Muralhas':['Quebra-Muralhas',5],
'Pegada de Ferro':['Agarrão do Urso',1],'Imobilizar':['Agarrão do Urso',1],'Projeção':['Agarrão do Urso',1],'Esmagar nos Braços':['Agarrão do Urso',2],'Escudo de Carne':['Agarrão do Urso',2],'Dominar':['Agarrão do Urso',3],'Aperto Esmagador':['Agarrão do Urso',4],'Abraço do Titã':['Agarrão do Urso',5],
'Equilíbrio Felino':['Gato',1],'Queda de Gato':['Gato',1],'Escalada Veloz':['Gato',1],'Contorção':['Gato',2],'Salto Acrobático':['Gato',2],'Andar de Aranha':['Gato',3],'Imponderável':['Gato',4],'Graça Sobrenatural':['Gato',5],
'Dedos Ágeis':['Mão Veloz',1],'Truque de Mão':['Mão Veloz',1],'Desarme Rápido':['Mão Veloz',1],'Mãos Borradas':['Mão Veloz',2],'Toque Preciso':['Mão Veloz',2],'Mil Dedos':['Mão Veloz',3],'Mãos Impossíveis':['Mão Veloz',4],'Mão do Prestidigitador Divino':['Mão Veloz',5],
'Fôlego Profundo':['Coração Incansável',1],'Segundo Vento':['Coração Incansável',1],'Marcha Forçada':['Coração Incansável',1],'Incansável':['Coração Incansável',2],'Pulmões de Ferro':['Coração Incansável',2],'Sem Limites':['Coração Incansável',3],'Vigor Inesgotável':['Coração Incansável',4],'Coração Eterno':['Coração Incansável',5],
'Estômago de Ferro':['Sangue Imune',1],'Resistir Doença':['Sangue Imune',1],'Aclimatação':['Sangue Imune',1],'Sangue Limpo':['Sangue Imune',2],'Pele Resiliente':['Sangue Imune',2],'Imunidade':['Sangue Imune',3],'Corpo Inóspito':['Sangue Imune',4],'Sangue Divino':['Sangue Imune',5],
'Aguentar Firme':['Carne Teimosa',1],'Cerrar os Dentes':['Carne Teimosa',1],'De Pé':['Carne Teimosa',1],'Teimosia':['Carne Teimosa',2],'Não Vou Cair':['Carne Teimosa',2],'Vontade de Viver':['Carne Teimosa',3],'Último Suspiro':['Carne Teimosa',4],'Recusa à Morte':['Carne Teimosa',5],
'Voz de Líder':['Estandarte',1],'Coordenar':['Estandarte',1],'Reunir':['Estandarte',1],'Formação':['Estandarte',2],'Grito de Guerra':['Estandarte',2],'Maestria de Campo':['Estandarte',3],'General':['Estandarte',4],'Estandarte Eterno':['Estandarte',5],
'Presença Cênica':['Musa',1],'Tocar a Alma':['Musa',1],'Distrair':['Musa',1],'Inspiração Artística':['Musa',2],'Encantar a Multidão':['Musa',2],'Obra-Prima':['Musa',3],'Voz que Cura':['Musa',4],'Canção Imortal':['Musa',5],
'Centelha':['Brasa',1],'Incitar':['Brasa',1],'Inflamar':['Brasa',1],'Discurso Ardente':['Brasa',2],'Provocação':['Brasa',2],'Fogo nos Corações':['Brasa',3],'Pavio Curto':['Brasa',4],'Incêndio':['Brasa',5],
'Trama':['Teia',1],'Plantar Ideia':['Teia',1],'Cunha':['Teia',1],'Chantagem':['Teia',2],'Rede de Favores':['Teia',2],'Virar o Jogo':['Teia',3],'Mestre dos Cordéis':['Teia',4],'Teia':['Teia',5],
'Língua de Prata':['Serpente das Palavras',1],'Torcer':['Serpente das Palavras',1],'Pechinchar':['Serpente das Palavras',1],'Contrato Capcioso':['Serpente das Palavras',2],'Confundir':['Serpente das Palavras',2],'Palavras de Veludo':['Serpente das Palavras',3],'Pacto Inquebrável':['Serpente das Palavras',4],'Voz da Serpente':['Serpente das Palavras',5],
'Sussurro':['Sussurro',1],'Semear Dúvida':['Sussurro',1],'Inquietar':['Sussurro',1],'Paranoia':['Sussurro',2],'Boato':['Sussurro',2],'Veneno na Mente':['Sussurro',3],'Pesadelo Acordado':['Sussurro',4],'Coro de Sussurros':['Sussurro',5],
'Sugestão':['Marionete',1],'Ler Desejos':['Marionete',1],'Empurrão Sutil':['Marionete',1],'Compulsão':['Marionete',2],'Fios Invisíveis':['Marionete',2],'Titereiro':['Marionete',3],'Reescrever Desejos':['Marionete',4],'Marionete':['Marionete',5],
'Magnetismo':['Beleza Cativante',1],'Sedução':['Beleza Cativante',1],'Desarmar com Charme':['Beleza Cativante',1],'Encanto Irresistível':['Beleza Cativante',2],'Olhar Cativante':['Beleza Cativante',2],'Beleza Inebriante':['Beleza Cativante',3],'Visão Divina':['Beleza Cativante',4],'Beleza que Move o Mundo':['Beleza Cativante',5],
'Porte':['Semblante',1],'Olhar Severo':['Semblante',1],'Imponência':['Semblante',1],'Aura de Comando':['Semblante',2],'Encarar a Morte':['Semblante',2],'Presença Avassaladora':['Semblante',3],'Majestade':['Semblante',4],'Semblante de Deus':['Semblante',5],
'Disfarce':['Camaleão',1],'Mudar de Cara':['Camaleão',1],'Misturar-se':['Camaleão',1],'Segunda Pele':['Camaleão',2],'Rosto Comum':['Camaleão',2],'Impostor':['Camaleão',3],'Forma Fluida':['Camaleão',4],'Mil Rostos':['Camaleão',5],
'Aura Sutil':['Aura',1],'Irradiar Calma':['Aura',1],'Irradiar Temor':['Aura',1],'Campo Emocional':['Aura',2],'Presença Tangível':['Aura',2],'Maré Emocional':['Aura',3],'Aura Avassaladora':['Aura',4],'Aura Divina':['Aura',5],
'Face Neutra':['Máscara Impassível',1],'Esconder Sentir':['Máscara Impassível',1],'Mentira de Olhos':['Máscara Impassível',1],'Inescrutável':['Máscara Impassível',2],'Calma Absoluta':['Máscara Impassível',2],'Véu da Mente':['Máscara Impassível',3],'Máscara Perfeita':['Máscara Impassível',4],'Vazio':['Máscara Impassível',5],
'Vigilância':['Sentinela',1],'Sentir Perigo':['Sentinela',1],'Olho Atento':['Sentinela',1],'Nunca Desprevenido':['Sentinela',2],'Varredura':['Sentinela',2],'Sexto Sentido':['Sentinela',3],'Olhos por Toda Parte':['Sentinela',4],'Guardião Incansável':['Sentinela',5],
'Rastreador':['Caçador',1],'Faro':['Caçador',1],'Ler o Rastro':['Caçador',1],'Trilha Fria':['Caçador',2],'Predador':['Caçador',2],'Caça Implacável':['Caçador',3],'Sentidos de Caçada':['Caçador',4],'Olho do Caçador Divino':['Caçador',5],
'Ler Pessoas':['Olho da Verdade',1],'Farejar Mentira':['Olho da Verdade',1],'Ver Através':['Olho da Verdade',1],'Olho Crítico':['Olho da Verdade',2],'Desmascarar':['Olho da Verdade',2],'Verdade Nua':['Olho da Verdade',3],'Olho que Não Erra':['Olho da Verdade',4],'Visão da Verdade':['Olho da Verdade',5],
'Sensível':['Comunhão',1],'Ver Auras':['Comunhão',1],'Sentir o Véu':['Comunhão',1],'Olho Espiritual':['Comunhão',2],'Ler o Lugar':['Comunhão',2],'Comunhão':['Comunhão',3],'Olhar Além':['Comunhão',4],'Olho do Vidente':['Comunhão',5],
'Vasto Saber':['Erudito',1],'Lembrar':['Erudito',1],'Poliglota':['Erudito',1],'Biblioteca Viva':['Erudito',2],'Decifrar':['Erudito',2],'Sábio':['Erudito',3],'Mente Universal':['Erudito',4],'Conhecimento Absoluto':['Erudito',5],
'Mãos Hábeis':['Artesão',1],'Improvisar':['Artesão',1],'Olho de Artífice':['Artesão',1],'Obra Fina':['Artesão',2],'Reparo Veloz':['Artesão',2],'Mestre Artesão':['Artesão',3],'Engenho Sobre-humano':['Artesão',4],'Forja dos Deuses':['Artesão',5],
'Mente Tática':['Estrategista',1],'Antecipar':['Estrategista',1],'Plano':['Estrategista',1],'Ler a Batalha':['Estrategista',2],'Emboscada':['Estrategista',2],'Grande Estrategista':['Estrategista',3],'Xeque-Mate':['Estrategista',4],'Mente do General Divino':['Estrategista',5],
'Olhar Investigativo':['Investigador',1],'Pista':['Investigador',1],'Conectar':['Investigador',1],'Reconstituir':['Investigador',2],'Interrogar':['Investigador',2],'Detetive':['Investigador',3],'Nada Escapa':['Investigador',4],'A Verdade Revelada':['Investigador',5],
'Mente Rápida':['Reflexo Mental',1],'Reação':['Reflexo Mental',1],'Decisão Instantânea':['Reflexo Mental',1],'Reflexos de Raio':['Reflexo Mental',2],'Pensar e Agir':['Reflexo Mental',2],'Tempo de Sobra':['Reflexo Mental',3],'Mente Acelerada':['Reflexo Mental',4],'Reflexo Divino':['Reflexo Mental',5],
'Jeitinho':['Improviso',1],'Usar o Cenário':['Improviso',1],'Virar a Mesa':['Improviso',1],'Solução Genial':['Improviso',2],'MacGyver':['Improviso',2],'Sempre uma Saída':['Improviso',3],'Improviso Magistral':['Improviso',4],'Lei de Murphy Reversa':['Improviso',5],
'Ler o Outro':['Leitura Fria',1],'Adivinhar':['Leitura Fria',1],'Ler Tells':['Leitura Fria',1],'Perfil':['Leitura Fria',2],'Antecipar a Pessoa':['Leitura Fria',2],'Mente Aberta como Livro':['Leitura Fria',3],'Conhecer de Relance':['Leitura Fria',4],'Leitor de Almas':['Leitura Fria',5],
'Calma':['Mente Serena',1],'Foco':['Mente Serena',1],'Centrar-se':['Mente Serena',1],'Mente Imperturbável':['Mente Serena',2],'Transe':['Mente Serena',2],'Fortaleza Mental':['Mente Serena',3],'Vazio Sereno':['Mente Serena',4],'Mente de Diamante':['Mente Serena',5]
};

// Subtítulo de cada subcaminho (atributo · âncora — tema)
const CAMINFO = {
'Punho de Ferro':'Força · âncora Briga / Impacto — o poder que esmaga guardas, ossos e muralhas',
'Atlas':'Força · âncora Atletismo — erguer, arremessar e arrancar pesos descomunais',
'Quebra-Muralhas':'Força · âncora Armas de Impacto — destruir estruturas e defesas',
'Agarrão do Urso':'Força · âncora Briga — agarrar, imobilizar, esmagar, arremessar',
'Sangue Fervente':'Força · âncora Briga — a ira que vira poder',
'Vento':'Destreza · âncora Atletismo — a graça que vira velocidade que vira voo',
'Gato':'Destreza · âncora Atletismo — acrobacia, equilíbrio, quedas, escalada',
'Mão Veloz':'Destreza · âncora Ladinagem — prestidigitação, desarmar, controle fino',
'Olho de Águia':'Destreza · âncora Armas à Distância — a flecha que nunca erra',
'Dança da Lâmina':'Destreza · âncora Armas de Corte — a esgrima que vira arte',
'Sombra':'Destreza · âncora Furtividade — estar e não estar',
'Pele de Pedra':'Vigor · âncora Resistência — a carne que vira pedra que vira lenda',
'Coração Incansável':'Vigor · âncora Resistência — fôlego, fadiga, marcha sem fim',
'Sangue Imune':'Vigor · âncora Resistência — venenos, doenças, ambientes extremos',
'Carne Teimosa':'Vigor · âncora Resistência / Convicção — ignorar ferimentos, recusar-se a cair',
'Cerne Vital':'Vigor · âncora Resistência — a vida que se recusa a apagar',
'Voz de Mel':'Carisma · âncora Lábia — palavras que abrem portas e corações',
'Lenda Viva':'Carisma · âncora Oratória — a presença que move multidões',
'Estandarte':'Carisma · âncora Oratória / Tática — liderança, coordenar, moral',
'Musa':'Carisma · âncora Performance — encantar plateias, mover emoções',
'Brasa':'Carisma · âncora Oratória — inflamar paixões, incitar',
'Comando':'Manipulação · âncora Intimidação / Oratória — a palavra que dobra a vontade alheia',
'Teia':'Manipulação · âncora Manha / Política — intriga, plantar ideias, chantagem',
'Serpente das Palavras':'Manipulação · âncora Lábia — barganha, torcer sentidos, lábia ardilosa',
'Sussurro':'Manipulação · âncora Manha — semear medo, dúvida, paranoia',
'Marionete':'Manipulação · âncora Manha — sugestão profunda, reescrever desejos',
'Máscara':'Manipulação · âncora Manha — o rosto que não se lê (disfarce e engano)',
'Beleza Cativante':'Aparência · âncora Lábia — atrair, seduzir, desarmar pela presença',
'Semblante':'Aparência · âncora Intimidação — impor respeito ou medo pela presença',
'Camaleão':'Aparência · âncora Ladinagem / Manha — alterar a própria aparência',
'Aura':'Aparência · âncora Performance — irradiar emoção à volta',
'Máscara Impassível':'Aparência · âncora Manha — esconder emoções, blefe perfeito',
'Olho Aguçado':'Percepção · âncora Prontidão — o que você percebe, ninguém esconde',
'Sentinela':'Percepção · âncora Prontidão — alerta, detectar perigo e emboscadas',
'Caçador':'Percepção · âncora Sobrevivência — rastrear, farejar, seguir trilhas',
'Olho da Verdade':'Percepção · âncora Empatia / Investigação — detectar mentiras, ilusões, disfarces',
'Comunhão':'Percepção · âncora Ocultismo — perceber o sobrenatural, auras, espíritos',
'Vínculo Animal':'Percepção · âncora Sobrevivência — a voz que as feras entendem',
'Mente Afiada':'Inteligência · âncora Conhecimentos — o intelecto que tudo decifra',
'Erudito':'Inteligência · âncora Conhecimentos — saber enciclopédico, idiomas',
'Artesão':'Inteligência · âncora Craft — crafts sobre-humanos, obras-primas',
'Estrategista':'Inteligência · âncora Tática — ler batalhas, prever, planos',
'Investigador':'Inteligência · âncora Investigação — reconstituir cenas, conectar pistas',
'Reflexo Mental':'Raciocínio · âncora Prontidão — iniciativa, reagir e pensar sob pressão',
'Improviso':'Raciocínio · âncora Manha / Craft — soluções instantâneas, usar o ambiente',
'Presságio':'Raciocínio · âncora Prontidão / Ocultismo — a intuição que sente o perigo',
'Leitura Fria':'Raciocínio · âncora Empatia — deduzir pessoas, prever ações, ler tells',
'Mente Serena':'Raciocínio · âncora Ocultismo / Autocontrole — foco, transe, blindagem mental',
};

// Trilhas → atributos → subcaminhos (ordem do livro)
const TRILHAS = [
  ['Corpo','força, agilidade e resiliência do corpo',[
    ['Força',['Punho de Ferro','Atlas','Quebra-Muralhas','Agarrão do Urso','Sangue Fervente']],
    ['Destreza',['Vento','Gato','Mão Veloz','Olho de Águia','Dança da Lâmina','Sombra']],
    ['Vigor',['Pele de Pedra','Coração Incansável','Sangue Imune','Carne Teimosa','Cerne Vital']],
  ]],
  ['Voz','a alma social — inspirar, dobrar e encantar',[
    ['Carisma',['Voz de Mel','Lenda Viva','Estandarte','Musa','Brasa']],
    ['Manipulação',['Comando','Teia','Serpente das Palavras','Sussurro','Marionete','Máscara']],
    ['Aparência',['Beleza Cativante','Semblante','Camaleão','Aura','Máscara Impassível']],
  ]],
  ['Mente','perceber, saber e reagir',[
    ['Percepção',['Olho Aguçado','Sentinela','Caçador','Olho da Verdade','Comunhão','Vínculo Animal']],
    ['Inteligência',['Mente Afiada','Erudito','Artesão','Estrategista','Investigador']],
    ['Raciocínio',['Reflexo Mental','Improviso','Presságio','Leitura Fria','Mente Serena']],
  ]],
];

const BANDLABEL = {1:'Mortal+',2:'Herói',3:'Semideus',4:'Semideus',5:'Quase-deus'};

// Arcano (espelha ficha)
const ARTE_DESC = {'Fogo':'chamas, calor, combustão','Gelo':'frio, congelar, neve','Raio':'eletricidade, relâmpago, tempestade','Água':'líquidos, marés, névoa','Vento':'ar, rajadas, voo','Terra':'pedra, metal, terremoto','Cura':'sarar feridas, doenças, venenos','Vida':'crescimento, biologia, plantas e carne','Morte':'decadência, necromancia, espíritos','Fascinação':'mente, encanto, ilusão, comando','Adivinhação':'premonição, ver à distância, ler o oculto','Fortuna':'sorte, azar, probabilidade','Conjuração':'mover, teleportar, dobrar o espaço','Forças':'energia cinética, telecinese, escudos','Matéria':'transmutar, moldar e criar substância','Tempo':'acelerar, retardar, vislumbrar','Espírito':'invocar e pactuar com entidades','Proteção':'wards, barreiras, dissipar magia'};
const ARTE_FX = {'Fogo':['Faísca — acende/apaga fogo; dardo flamejante (1d6)','Labareda — jato de fogo em linha (2d6)','Bola de Fogo — explosão em área (3d6); parede de chamas','Tempestade Ígnea — área grande, dano contínuo; imune a fogo','Cataclismo — mar de fogo; coluna/elemental de chamas'],'Cura':['Sarar — estanca sangramento, cura dano leve','Fechar Feridas — cura Letal moderado; suspende a dor','Restaurar — ferimentos graves, doenças, venenos','Regenerar — recompõe membros; doenças mortais','Sopro de Vida — traz o recém-morto; expurga quase tudo'],'Fascinação':['Sugestão — impulso sutil; distrai','Encanto — o alvo o vê como amigo','Comando — ordem resistível só com Vontade','Ilusão Plena — ilusões convincentes ou domínio','Reescrever a Mente — altera memórias e lealdades'],'Fortuna':['Empurrãozinho — re-role um dado ou imponha −1','Sorte & Azar — +1d6 a um aliado ou −1d6 a um inimigo','Destino Torto — força repetir uma rolagem','Maré da Sorte — coincidências favoráveis por uma cena','Senhor do Acaso — torna o quase-impossível certo'],
'Gelo':['Lasca de Gelo — resfria, congela água rasa; dardo (1d6)','Rajada Gélida — cone de frio (2d6), desacelera','Prisão de Gelo — aprisiona um alvo; muralha de gelo','Nevasca — tempestade gélida em área','Inverno Eterno — congela uma grande área; imobiliza um campo'],
'Raio':['Faísca — choque que atordoa; dardo (1d6)','Relâmpago — raio em linha (2d6)','Corrente — salta entre vários alvos (3d6 dividido)','Tempestade — relâmpagos do céu numa área','Fúria de Zeus — descarga cataclísmica'],
'Água':['Manipular Água — move e molda água; jato sob pressão','Onda — empurra/derruba; cria névoa','Respirar Água — respira submerso; controla correntes','Maremoto — grande onda; afoga uma área','Senhor dos Mares — comanda rios e mares'],
'Vento':['Brisa — rajadas que empurram, apagam, carregam som','Vendaval — desvia projéteis; rajada cortante (2d6)','Sustentar — plana e levita por curtos períodos','Ciclone — tornado que ergue e arremessa','Senhor dos Céus — voa; comanda tempestades de vento'],
'Terra':['Moldar Terra — molda terra/pedra; arremessa pedras (1d6)','Muralha de Pedra — ergue barreiras; abre o chão','Terremoto Local — sacode e fende o solo','Moldar Metal — dobra e molda metal','Senhor da Terra — remodela o terreno'],
'Vida':['Acelerar Vida — faz plantas crescerem; cura leve','Despertar — anima plantas para enredar','Moldar Carne — altera corpos vivos','Florescer — transforma um ermo em floresta','Dádiva da Vida — cura em massa; vida exuberante'],
'Morte':['Toque Mórbido — decomposição; dreno (1d6 + cura você)','Enfraquecer — adoece o alvo; fala com mortos recentes','Erguer Morto — anima um cadáver; aura de medo','Praga — doença e murchez numa área','Ceifador — ceifa a vida; ergue uma legião'],
'Adivinhação':['Pressentir — sente perigo e mentiras','Vidência — vê eventos distantes','Ler o Destino — vislumbra futuros prováveis','Olho Distante — observa lugar conhecido em tempo real','Oráculo — responde sobre passado e futuro'],
'Conjuração':['Telecinese Leve — move objetos pequenos','Passo Brusco — teletransporte curto visível','Convocar — traz objeto distante; fenda curta','Portal — entre dois lugares próximos','Dobrar o Espaço — teletransporte longo de grupo'],
'Forças':['Empurrão de Força — empurra/segura; escudo breve','Telecinese — move e arremessa objetos pesados','Escudo de Força — barreira; impacto cinético (3d6)','Esmagar — comprime alvo/objeto','Dominar Forças — manipula gravidade e cinética'],
'Matéria':['Alterar Matéria — cor, textura, temperatura','Transmutar — converte material em semelhante','Moldar — reformula objetos; cria itens simples','Criar Substância — conjura matéria','Alquimia Suprema — transmuta qualquer matéria'],
'Tempo':['Apressar/Retardar — acelera ou atrasa um alvo','Instante — ação extra; congela objeto por segundos','Bolha Temporal — acelera/retarda área pequena','Reverter — desfaz alguns segundos','Senhor do Tempo — para o tempo brevemente'],
'Espírito':['Sentir Espíritos — percebe e fala com espíritos','Pacto Menor — invoca espírito/elemental menor','Vincular — liga espírito a objeto; bane fracos','Invocar — chama espírito poderoso como aliado','Senhor dos Espíritos — comanda hostes; abre portas'],
'Proteção':['Salvaguarda — ward pessoal; dissipa magia fraca','Barreira — campo protetor contra ataques','Refúgio — área segura que repele ameaças','Dissipar — anula/enfraquece magias','Santuário — protege um local; barreira quase impenetrável']};
const ARTE_ELEM = ['Fogo','Gelo','Raio','Água','Vento','Terra'];
const ARTE_UNIV = ['Cura','Vida','Morte','Fascinação','Adivinhação','Fortuna','Conjuração','Forças','Matéria','Tempo','Espírito','Proteção'];

/* ========================================================================
   2. PARSER — extrai efeito + meta de cada Técnica do .md de Caminhos
   ===================================================================== */
const CAM_MD = read('Caminhos_New_RPG_System_D6.md');
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function reEscape(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
// converte **x** -> <strong> depois de escapar entidades
function mdInline(s){ return esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>'); }

function extract(name){
  const searchName = name.replace(/\s*\(téc\.\)\s*$/,'');
  const re = new RegExp('\\*\\*'+reEscape(searchName)+'\\*\\*\\s*\\(');
  const m = re.exec(CAM_MD);
  if(!m) return {meta:'',tags:'',effect:'<em>(efeito a detalhar)</em>',missing:true};
  let i = m.index + m[0].length; // após '('
  let depth=1, j=i;
  while(j<CAM_MD.length && depth>0){ const c=CAM_MD[j]; if(c==='(')depth++; else if(c===')')depth--; j++; }
  const meta = CAM_MD.slice(i, j-1); // dentro dos parênteses
  let chunk = CAM_MD.slice(j);
  // limita o chunk até o próximo delimitador
  let end = chunk.length;
  for(const pat of ['\n\n','\n- ','\n**','\n#','\n```',' · **','\n>']){
    const k = chunk.indexOf(pat);
    if(k>=0 && k<end) end = k;
  }
  chunk = chunk.slice(0,end);
  // captura tipo (*...*) no formato A/C
  let type='';
  const tm = /^\s*—\s*\*([^*]+)\*/.exec(chunk);
  if(tm){ type = tm[1].replace(/\.$/,'').trim(); chunk = chunk.slice(tm[0].length); }
  else { chunk = chunk.replace(/^\s*:\s*/,''); } // formato B
  // remove setas e anotações em itálico (*cruzamento*…)
  chunk = chunk.replace(/⟵/g,'');
  // proteger negrito antes de remover itálicos soltos
  chunk = chunk.replace(/\*\*([^*]+)\*\*/g,'§§$1§§');
  chunk = chunk.replace(/\*[^*]+\*/g,'');
  chunk = chunk.replace(/§§([^§]+)§§/g,'**$1**');
  let effect = chunk.replace(/\s+/g,' ').trim();
  effect = mdInline(effect);
  // monta tags (meta sem "Cent N ·")
  let metaClean = meta.replace(/\*\*\+\*\*/g,'+').replace(/\*/g,'').replace(/\s+/g,' ').trim();
  metaClean = metaClean.replace(/^Cent\s*\d+\s*·\s*/i,'');
  let tags = metaClean;
  if(type) tags = (metaClean? metaClean+' · ':'') + type;
  return {meta:metaClean, tags: esc(tags), effect, missing:false};
}

/* ========================================================================
   3. RENDER — Caminhos
   ===================================================================== */
const missing = [];
function renderCaminho(nome){
  const techs = Object.entries(TECH).filter(([,v])=>v[0]===nome).map(([t,v])=>[t,v[1]]);
  techs.sort((a,b)=>a[1]-b[1]);
  let bands = {};
  for(const [t,b] of techs){ (bands[b]=bands[b]||[]).push(t); }
  let html = `<div class="path"><div class="path-title">Caminho ${prep(nome)}</div>`;
  html += `<div class="path-sub">${esc(CAMINFO[nome]||'')}</div>`;
  for(let b=1;b<=5;b++){
    if(!bands[b]) continue;
    html += `<div class="band">Banda ${b} — ${BANDLABEL[b]}</div>`;
    for(const t of bands[b]){
      const {tags,effect,missing:miss} = extract(t);
      if(miss) missing.push(t);
      const dname = t.replace(/\s*\(téc\.\)\s*$/,'');
      html += `<div class="tech"><span class="tech-name">${esc(dname)}</span>`;
      if(tags) html += ` <span class="tech-tags">· ${tags}</span>`;
      html += `<div class="tech-eff">${effect}</div></div>`;
    }
  }
  html += `</div>`;
  return html;
}
// "Caminho do/da ..." — gênero do subcaminho
const FEM = new Set(['Pele de Pedra','Dança da Lâmina','Voz de Mel','Lenda Viva','Mente Afiada','Máscara','Sombra','Teia','Serpente das Palavras','Marionete','Beleza Cativante','Aura','Máscara Impassível','Comunhão','Leitura Fria','Mente Serena','Musa','Brasa','Mão Veloz','Carne Teimosa']);
function prep(n){ return (FEM.has(n)?'da ':'do ')+n; }

let caminhosHtml = '';
for(const [trilha,trilhaSub,atributos] of TRILHAS){
  caminhosHtml += `<h2 class="trilha">Trilha ${trilha}</h2><p class="trilha-sub">${esc(trilhaSub)}.</p>`;
  for(const [attr,lista] of atributos){
    caminhosHtml += `<h3 class="attr-head">${esc(attr)}</h3>`;
    for(const nome of lista){ caminhosHtml += renderCaminho(nome); }
  }
}

/* ========================================================================
   4. RENDER — Arcano
   ===================================================================== */
function renderArte(nome){
  const fx = ARTE_FX[nome]||[];
  let html = `<div class="arte"><div class="arte-title">${esc(nome)}</div><div class="arte-desc">${esc(ARTE_DESC[nome]||'')}</div>`;
  fx.forEach((e,idx)=>{
    const [head,...rest] = e.split(' — ');
    html += `<div class="arte-lvl"><span class="lvl-n">${idx+1}</span> <span class="lvl-name">${esc(head)}</span>`;
    if(rest.length) html += ` <span class="lvl-eff">— ${esc(rest.join(' — '))}</span>`;
    html += `</div>`;
  });
  html += `</div>`;
  return html;
}
let arcanoElem = ARTE_ELEM.map(renderArte).join('');
let arcanoUniv = ARTE_UNIV.map(renderArte).join('');

/* ========================================================================
   5. CSS + ASSETS
   ===================================================================== */
// textura de pergaminho — VETORIAL (fibras finas + pontinhos), renderiza em qualquer visor
const fiberSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>`
  + `<g stroke='%23b39a5c' stroke-width='0.5' fill='none' opacity='0.30'>`
  + `<path d='M-5 24 Q75 19 155 26'/><path d='M-5 58 Q75 63 155 55'/><path d='M-5 95 Q75 90 155 99'/><path d='M-5 130 Q75 135 155 128'/>`
  + `<path d='M22 -5 Q18 75 25 155' opacity='0.5'/><path d='M118 -5 Q123 75 116 155' opacity='0.5'/>`
  + `</g>`
  + `<g fill='%23a3884e' opacity='0.22'>`
  + `<circle cx='34' cy='42' r='0.9'/><circle cx='104' cy='73' r='0.8'/><circle cx='64' cy='112' r='1'/><circle cx='126' cy='30' r='0.7'/><circle cx='14' cy='86' r='0.7'/><circle cx='88' cy='18' r='0.8'/></g>`
  + `</svg>`;
const fiberURI = `data:image/svg+xml,${encodeURIComponent(fiberSVG).replace(/'/g,'%27')}`;
// cantoneira decorativa (vetorial) para a capa
const CORNER = `<svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#1f6f6b' stroke-width='1.4'><path d='M3 30 Q3 3 30 3'/><path d='M3 30 Q3 14 14 7'/><path d='M30 3 Q16 3 9 14'/></g><circle cx='3' cy='30' r='2.2' fill='#b8973f'/><circle cx='30' cy='3' r='2.2' fill='#b8973f'/><path d='M11 11 l7 7 M11 11 l9 1 M11 11 l1 9' stroke='#1f6f6b' stroke-width='1' fill='none'/></svg>`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

:root{
  --ink:#2c2a22; --ink-soft:#5c5340; --parch:#f5ecd4; --parch-2:#efe3c4;
  --teal:#1f6f6b; --teal-dk:#0e4a47; --teal-lt:#2f9e98; --teal-soft:#3f8a85;
  --rule:#c9b277; --gold:#b8973f; --box:#ece0bd;
}

*{ box-sizing:border-box; }
html{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }

@page{
  size:A4;
  margin:21mm 20mm 19mm 20mm;
  @bottom-center{
    content:counter(page);
    font-family:'Cinzel',serif; color:var(--teal); font-size:9pt; letter-spacing:.18em;
    margin-top:4mm;
  }
  @top-center{
    content:string(chaptitle);
    font-family:'Cinzel',serif; color:var(--ink-soft); font-size:7.6pt; letter-spacing:.28em;
    text-transform:uppercase; margin-bottom:4mm;
  }
}
@page cover{ margin:0; @bottom-center{content:none} @top-center{content:none} }
@page front{ @bottom-center{content:none} @top-center{content:none} }

/* ---- pergaminho + moldura por página (Paged.js) ---- */
.pagedjs_sheet{
  background-color:var(--parch);
  background-image:url("${fiberURI}");
  background-size:150px 150px;
  box-shadow: inset 0 0 15mm rgba(80,58,20,.085);
}
.pagedjs_pagebox{ position:relative; }
.pagedjs_pagebox::before{ content:''; position:absolute; inset:8mm; border:1.5px solid var(--teal); pointer-events:none; }
.pagedjs_pagebox::after{ content:''; position:absolute; inset:9.6mm; border:.7px solid var(--gold); pointer-events:none; }

body{
  font-family:'EB Garamond', Constantia, 'Palatino Linotype', Georgia, serif;
  color:var(--ink); font-size:10.2pt; line-height:1.5; margin:0;
  overflow-wrap:break-word; word-wrap:break-word; hyphens:auto;
}

p{ margin:0 0 .6em 0; text-align:justify; }
em{ color:var(--ink-soft); font-style:italic; }
strong{ color:var(--teal-dk); }
h1,h2,h3,h4{ font-family:'Cinzel', Georgia, serif; color:var(--teal); font-weight:700; line-height:1.16; }

/* ---- duas colunas por capítulo ---- */
.chapter{ break-before:page; column-count:2; column-gap:7mm; column-fill:auto; }
.chapter > .chapter-head, .span{ column-span:all; }
.lead{ margin-top:1mm; }
.lead::first-letter{
  font-family:'Cinzel'; font-weight:900; float:left; font-size:3.6em; line-height:.74;
  padding:4px 7px 0 0; color:var(--teal); text-shadow:0 1px 0 rgba(255,255,255,.55);
}

/* ---- cover ---- */
.cover{ page:cover; break-after:page; height:267mm; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center; position:relative; }
.cover .corner{ position:absolute; width:20mm; height:20mm; }
.cover .corner svg{ width:100%; height:100%; display:block; }
.cover .c-tl{ top:13mm; left:13mm; } .cover .c-tr{ top:13mm; right:13mm; transform:scaleX(-1); }
.cover .c-bl{ bottom:13mm; left:13mm; transform:scaleY(-1); } .cover .c-br{ bottom:13mm; right:13mm; transform:scale(-1,-1); }
.cover .kicker{ font-family:'Cinzel'; letter-spacing:.5em; font-size:11pt; color:var(--ink-soft); text-transform:uppercase; margin-bottom:7mm; padding-left:.5em; }
.cover h1{ font-family:'Cinzel'; font-weight:900; font-size:42pt; letter-spacing:.02em; margin:0; color:var(--teal); line-height:1.04; text-shadow:0 1px 0 rgba(255,255,255,.6); }
.cover .d6{ font-size:66pt; display:block; color:var(--teal-dk); }
.cover .sub{ font-style:italic; font-size:15pt; color:var(--ink-soft); margin-top:6mm; }
.cover .tagline{ margin-top:13mm; max-width:118mm; font-style:italic; color:var(--ink-soft); text-align:center; }
.cover .ed{ margin-top:16mm; font-family:'Cinzel'; font-size:9.5pt; letter-spacing:.25em; color:var(--ink-soft); }

.dline{ width:70mm; height:0; margin:6mm auto; position:relative; }
.dline::before,.dline::after{ content:""; position:absolute; left:0; right:0; border-top:1.2px solid var(--teal); }
.dline::before{ top:0; } .dline::after{ top:3px; border-top:.6px solid var(--gold); }
.dline span{ position:absolute; left:50%; top:-9px; transform:translateX(-50%); background:var(--parch); padding:0 8px; color:var(--teal); font-size:13pt; }

/* ---- chapter openers ---- */
.chapter-head{ text-align:center; margin:2mm 0 6mm 0; position:relative; padding:6mm 0 4mm; }
.chapter-head .num{ font-family:'Cinzel'; letter-spacing:.4em; font-size:10pt; color:var(--ink-soft); text-transform:uppercase; padding-left:.4em; }
.chapter-head h1{ font-size:26pt; margin:2mm 0 0 0; }
.chapter-head .orn{ color:var(--teal); font-size:14pt; margin-top:2mm; letter-spacing:.4em; }
.chapter-head::before{ content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
  width:46mm; border-top:1px solid var(--gold); }

h2{ font-size:14.5pt; margin:5mm 0 1.5mm 0; padding-bottom:1mm; border-bottom:1.2px solid var(--rule); break-after:avoid; }
h3{ font-size:11.5pt; margin:3.5mm 0 1mm 0; color:var(--teal-dk); letter-spacing:.02em; break-after:avoid; }
h4{ font-size:10.4pt; margin:3mm 0 1mm 0; color:var(--teal-dk); font-variant:small-caps; letter-spacing:.04em; break-after:avoid; }
h2.trilha{ font-size:16pt; text-align:center; border:none; column-span:all; margin:6mm 0 0; color:var(--teal); letter-spacing:.06em; }
h2.trilha::after{ content:'❦'; display:block; color:var(--gold); font-size:12pt; margin-top:1mm; }
.trilha-sub{ text-align:center; font-style:italic; color:var(--ink-soft); column-span:all; margin:0 0 3mm; font-size:9.6pt; }
h3.attr-head{ text-align:center; font-family:'Cinzel'; font-size:11.5pt; color:var(--teal);
  font-variant:small-caps; letter-spacing:.1em; margin:3.5mm 0 1.5mm; border-bottom:none; break-after:avoid; }
h3.attr-head::before, h3.attr-head::after{ content:' ◆ '; color:var(--gold); font-size:7.5pt; vertical-align:middle; }

/* ---- tables ---- */
table{ width:100%; border-collapse:collapse; margin:2mm 0 3mm 0; font-size:8.9pt; break-inside:avoid; }
table.span{ column-span:all; }
thead th{ background:var(--teal); color:#f5ecd2; font-family:'Cinzel'; font-weight:600; font-size:8.3pt;
  letter-spacing:.02em; text-align:left; padding:1.6mm 2.2mm; }
tbody td, tbody th{ padding:1.3mm 2.2mm; border-bottom:.6px solid var(--rule); vertical-align:top; text-align:left; }
tbody th{ font-family:'Cinzel'; font-weight:600; font-size:8.4pt; color:var(--teal-dk); width:33%; }
tbody tr:nth-child(even){ background:rgba(31,111,107,.055); }
td.c,th.c{ text-align:center; }

/* ---- callouts ---- */
.box{ background:var(--box); border:1px solid var(--rule); border-left:3.5px solid var(--teal);
  padding:2.4mm 3mm; margin:2mm 0 3mm 0; break-inside:avoid; font-size:9.5pt; }
.box .lbl{ font-family:'Cinzel'; font-size:8.4pt; letter-spacing:.1em; text-transform:uppercase; color:var(--teal); display:block; margin-bottom:.8mm; }
.box.example{ background:rgba(31,111,107,.07); font-style:italic; }
.box.rule{ background:#efe7cd; border-left-color:var(--gold); }
.box.rule .lbl{ color:#8a6d22; }

.formula{ display:block; text-align:center; font-family:'Cinzel'; font-weight:600; color:var(--teal-dk);
  background:rgba(31,111,107,.08); border:1px solid var(--rule); padding:2mm 2.4mm; margin:2.4mm 0; font-size:9pt;
  line-height:1.4; break-inside:avoid; }

.orn-div{ text-align:center; color:var(--teal); font-size:12pt; margin:4mm 0; letter-spacing:.5em; column-span:all; }
.subtle{ color:var(--ink-soft); font-style:italic; font-size:9.2pt; }
ul.skills{ columns:2; column-gap:6mm; margin:1mm 0 2mm 0; padding-left:4.5mm; font-size:9.4pt; }
ul.skills li{ margin-bottom:.3mm; break-inside:avoid; }
ul.plain{ margin:1mm 0 2mm; padding-left:4.5mm; }
ul.plain li{ margin-bottom:.6mm; text-align:justify; }

/* ---- TOC ---- */
.toc{ page:front; break-after:page; }
.toc h1{ text-align:center; font-size:22pt; margin:6mm 0 7mm 0; color:var(--teal); }
.toc .row{ display:flex; align-items:baseline; gap:3mm; margin:2.4mm 0; }
.toc .row .num{ font-family:'Cinzel'; color:var(--teal); flex:0 0 12mm; font-size:10.5pt; }
.toc .row .t{ font-family:'Cinzel'; font-size:10.5pt; color:var(--teal-dk); flex:0 1 auto; min-width:0; }
.toc .row .l{ flex:1 1 6mm; min-width:6mm; border-bottom:1px dotted var(--rule); transform:translateY(-3px); }
.toc .row .n{ color:var(--ink-soft); flex:0 1 auto; min-width:0; text-align:right; font-size:9.6pt; font-style:italic; }

/* ---- caminhos / técnicas ---- */
.path{ break-inside:avoid; margin:0 0 3.5mm; }
.path-title{ font-family:'Cinzel'; font-weight:700; font-size:12.5pt; color:var(--teal); break-after:avoid; }
.path-sub{ font-style:italic; color:var(--ink-soft); margin-bottom:1mm; font-size:8.8pt; break-after:avoid; }
.band{ font-variant:small-caps; letter-spacing:.05em; color:var(--teal-dk); border-bottom:.7px solid var(--rule);
  margin:2mm 0 1mm; padding-bottom:.4mm; font-size:9.4pt; break-after:avoid; break-inside:avoid; }
.tech{ margin:0 0 1.4mm 0; break-inside:avoid; }
.tech-name{ font-family:'Cinzel'; font-weight:600; font-size:9.5pt; color:var(--ink); }
.tech-tags{ font-size:7.8pt; color:var(--teal); font-variant:small-caps; letter-spacing:.02em; }
.tech-eff{ font-size:9.2pt; display:block; }
.cross{ color:#8a6d22; font-weight:600; }

/* ---- arcano ---- */
.arte{ break-inside:avoid; margin:0 0 3mm; border-left:2.5px solid var(--teal-lt); padding-left:2.6mm; }
.arte-title{ font-family:'Cinzel'; font-weight:700; font-size:11pt; color:var(--teal); }
.arte-desc{ font-style:italic; color:var(--ink-soft); font-size:8.4pt; margin-bottom:1mm; }
.arte-lvl{ font-size:9pt; margin-bottom:.5mm; }
.arte-lvl .lvl-n{ display:inline-block; width:4.2mm; height:4.2mm; line-height:4.2mm; text-align:center;
  background:var(--teal); color:#f5ecd2; font-family:'Cinzel'; font-size:7.6pt; border-radius:50%; }
.arte-lvl .lvl-name{ font-family:'Cinzel'; font-weight:600; color:var(--teal-dk); font-size:8.8pt; }
.arte-lvl .lvl-eff{ color:var(--ink); }
`;

/* ========================================================================
   6. CAPÍTULOS AUTORADOS (regras, equipamentos, arcano-intro, criação)
   ===================================================================== */
const chCore = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo I</div><h1>O Coração do Sistema</h1><div class="orn">❖</div></div>
  <p class="lead">Toda ação significativa nasce de uma soma simples: um <strong>Atributo</strong> (talento bruto) somado a uma <strong>Habilidade</strong> (treino). Esse total vira um punhado de dados de seis lados — o seu <em>pool</em> — que você rola e soma para enfrentar o mundo.</p>
  <h2>Montando o Pool</h2>
  <p>Some Atributo + Habilidade. A metade desse valor (arredondada para baixo) é a <strong>quantidade de dados</strong>. Se a soma for <strong>ímpar</strong>, some um <strong>bônus fixo de +2</strong> ao resultado.</p>
  <span class="formula">Dados = ⌊(Atributo + Habilidade) ÷ 2⌋ &nbsp;•&nbsp; +2 se a soma for ímpar</span>
  <table><thead><tr><th>Soma</th><th>Você rola</th></tr></thead><tbody>
    <tr><td class="c">4</td><td>2d6</td></tr><tr><td class="c">5</td><td>2d6 + 2</td></tr><tr><td class="c">6</td><td>3d6</td></tr><tr><td class="c">9</td><td>4d6 + 2</td></tr><tr><td class="c">10</td><td>5d6</td></tr>
  </tbody></table>
  <h2>Sucesso e Dificuldade</h2>
  <p>Você tem <strong>sucesso</strong> quando o total <strong>supera</strong> o alvo — a Defesa de um inimigo ou a <strong>Dificuldade</strong> de uma tarefa. A Dificuldade usa a mesma régua de Atributo + Habilidade.</p>
  <table><thead><tr><th class="c">Dif.</th><th>Desafio</th><th>À altura</th></tr></thead><tbody>
    <tr><td class="c">5</td><td>Fácil</td><td>3 — competente</td></tr><tr><td class="c">10</td><td>Média</td><td>6 — bom no ofício</td></tr><tr><td class="c">15</td><td>Difícil</td><td>8 — perito</td></tr><tr><td class="c">20</td><td>Limite humano</td><td>10 — mestre</td></tr><tr><td class="c">25</td><td>Excepcional</td><td>raros humanos</td></tr><tr><td class="c">30+</td><td>Sobre-humano</td><td>Centelha / Caminhos</td></tr>
  </tbody></table>
  <p class="subtle">No nível "à altura", tarefas fáceis e médias são cara-ou-coroa; a maestria traz confiabilidade.</p>
  <h2>Margem: graus de sucesso</h2>
  <p>Passar raspando é diferente de passar com sobra. A cada <strong>6 pontos</strong> acima do alvo, você ganha <strong>uma Margem</strong>. Em combate, cada Margem vira <strong>+1d6 de dano</strong>; em outras ações, o Mestre a converte num efeito melhor — mais rápido, mais fino, mais duradouro.</p>
  <h2>Opostas e Valores Passivos</h2>
  <p>Quando alguém se opõe, em geral só o lado <em>ativo</em> rola, contra um <strong>Valor Passivo</strong> do outro.</p>
  <span class="formula">Valor Passivo = (Atributo + Habilidade) × 2 (+ mods)</span>
  <div class="box example"><span class="lbl">Exemplo</span>Um ladrão se esgueira (Destreza + Furtividade) contra a <strong>Percepção Passiva</strong> do guarda, igual a (Percepção + Prontidão) × 2. O guarda não rola — sua vigilância é um muro a superar.</div>
  <p>Quando ambos agem de fato (queda de braço, corrida), os dois rolam e o maior vence; empates favorecem quem defende.</p>
  <h2>Ações Estendidas</h2>
  <p>Tarefas longas usam três valores: uma <strong>Dificuldade</strong>, um <strong>Intervalo</strong> e um <strong>Acúmulo</strong>. A cada intervalo você rola; o quanto passar da Dificuldade soma ao Acúmulo. Ao alcançá-lo, a obra está pronta.</p>
  <div class="box example"><span class="lbl">Exemplo</span>Forjar uma espada fina: Dificuldade 12, intervalo semanal, Acúmulo 30. A cada semana o ferreiro soma o excedente sobre 12 — chegando a 30, a lâmina nasce.</div>
</section>`;

const chAttr = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo II</div><h1>Atributos &amp; Perícias</h1><div class="orn">❖</div></div>
  <p class="lead">Nove <strong>Atributos</strong> descrevem o que o corpo, a alma social e a mente conseguem fazer. Trinta <strong>Habilidades</strong> primárias descrevem o que o personagem aprendeu a fazer com eles.</p>
  <h2>Os Nove Atributos</h2>
  <p>Variam de 1 a 5 (teto futuro 10), em três tríades.</p>
  <table><thead><tr><th>Físicos</th><th>Sociais</th><th>Mentais</th></tr></thead><tbody>
    <tr><td>Força</td><td>Carisma</td><td>Percepção</td></tr><tr><td>Destreza</td><td>Manipulação</td><td>Inteligência</td></tr><tr><td>Vigor</td><td>Aparência</td><td>Raciocínio</td></tr>
  </tbody></table>
  <h2>As Trinta Habilidades</h2>
  <p>Variam de 0 a 5. Além destas, há <em>Habilidades Secundárias</em> ilimitadas e específicas (Herbologia, Falsificação, Navegação…), criadas conforme a história pede.</p>
  <h4>Combate</h4><ul class="skills"><li>Briga</li><li>Armas de Corte</li><li>Armas de Impacto</li><li>Armas de Haste</li><li>Armas à Distância</li><li>Esquiva</li><li>Escudos</li></ul>
  <h4>Físicas &amp; Mobilidade</h4><ul class="skills"><li>Atletismo</li><li>Resistência</li><li>Furtividade</li><li>Prontidão</li><li>Sobrevivência</li></ul>
  <h4>Sociais</h4><ul class="skills"><li>Lábia</li><li>Oratória</li><li>Etiqueta</li><li>Empatia</li><li>Intimidação</li><li>Manha</li></ul>
  <h4>Saber</h4><ul class="skills"><li>Investigação</li><li>Conhecimentos</li><li>Ocultismo</li><li>Medicina</li><li>Ciências</li></ul>
  <h4>Técnicas</h4><ul class="skills"><li>Craft</li><li>Ladinagem</li><li>Cavalgar</li><li>Performance</li><li>Tática</li><li>Política</li><li>Comércio</li></ul>
  <p class="subtle">O tipo de dano (corte, perfuração, impacto) é da arma, não da perícia: "Armas de Corte" cobre a espada que retalha e a adaga que perfura.</p>
  <h2>Especialidade</h2>
  <p>Treino focado: não eleva o teto, mas torna os resultados mais confiáveis. Para cada ponto, role <strong>+1d6</strong> e <strong>descarte o menor</strong> dado — até o seu nível na Habilidade. Em valores fixos (como a Defesa), cada ponto vale <strong>+1</strong>.</p>
  <div class="box example"><span class="lbl">Exemplo</span>Base 3d6+2 com Especialidade 2: role 5d6+2 e descarte os dois dados mais baixos.</div>
  <h2>Stunts</h2>
  <p>Descrever uma ação com criatividade e uso do cenário rende um Stunt. O Mestre define o nível:</p>
  <table><thead><tr><th class="c">Nível</th><th>Bônus</th></tr></thead><tbody>
    <tr><td class="c">1</td><td>+2 fixo</td></tr><tr><td class="c">2</td><td>+1d6</td></tr><tr><td class="c">3</td><td>+2d6</td></tr>
  </tbody></table>
</section>`;

const chSoul = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo III</div><h1>Centelha, Virtudes &amp; Vontade</h1><div class="orn">❖</div></div>
  <p class="lead">Além de músculo e treino, o herói carrega uma <strong>Centelha</strong> — seu nível de poder pessoal — e quatro <strong>Virtudes</strong> que movem sua alma e alimentam suas façanhas.</p>
  <h2>Centelha — a fagulha que cresce</h2>
  <p>Vai de 0 a 5 (e além, no futuro). Em <strong>0</strong> está o mortal comum — cerca de 95% das pessoas. Cada ponto eleva a estatura na escala do mortal ao semideus. Ela faz três coisas:</p>
  <table><thead><tr><th>A Centelha…</th><th>Efeito</th></tr></thead><tbody>
    <tr><td>Reforça defesas</td><td>+⌈Centelha÷2⌉ à Defesa e à Defesa Mental</td></tr>
    <tr><td>Dimensiona os pools</td><td>determina as reservas de Energia e Mana</td></tr>
    <tr><td>Destrava os Caminhos</td><td>cada banda exige uma Centelha mínima</td></tr>
  </tbody></table>
  <p>É a principal forma de progredir depois que Atributos e Habilidades chegam ao teto.</p>
  <h2>As Quatro Virtudes</h2>
  <p>Cada uma vai de 1 a 5 e governa o que move — e o que resiste dentro de — você.</p>
  <table><thead><tr><th>Virtude</th><th>Governa e resiste a…</th></tr></thead><tbody>
    <tr><td>Compaixão</td><td>empatia e misericórdia; resiste à crueldade</td></tr>
    <tr><td>Convicção</td><td>determinação; resiste à dor e ao desânimo</td></tr>
    <tr><td>Temperança</td><td>disciplina e clareza; resiste à tentação e à provocação</td></tr>
    <tr><td>Valor</td><td>bravura; resiste ao medo e à intimidação</td></tr>
  </tbody></table>
  <p>Para <strong>resistir</strong>, role a Virtude apropriada somada a um Atributo (medo = Valor + Vigor; provocação = Temperança + Raciocínio).</p>
  <h3>Traços derivados</h3>
  <p><strong>Força de Vontade</strong> começa em 5 e cresce com a experiência — gasta para melhorar um ataque, resistir a poderes mentais, ignorar penalidades e conjurar.</p>
  <p><strong>Integridade</strong> (Compaixão + Temperança) é a bússola moral e a compostura.</p>
  <span class="formula">Defesa Mental = ⌊(Integridade + Vontade) ÷ 2⌋ + Centelha</span>
  <p class="subtle">Quem está quebrado por dentro é mais fácil de dobrar.</p>
  <div class="box rule"><span class="lbl">Canalizar Virtude</span>Uma vez por cena, por Virtude, numa ação coerente com ela, some o valor da Virtude à soma base: a rolagem vira <strong>Atributo + Habilidade + Virtude</strong>. O herói movido por suas paixões transcende.</div>
</section>`;

const chCombat = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo IV</div><h1>Combate</h1><div class="orn">❖</div></div>
  <p class="lead">O combate corre numa linha de <strong>Ticks</strong>, não em turnos rígidos. Cada ação custa um tempo — sua <strong>Speed</strong> — e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher <em>quando</em> agir vale tanto quanto <em>como</em>.</p>
  <h2>Iniciativa e Speed</h2>
  <p>No início, role <strong>Iniciativa = 1d6 + Raciocínio + Prontidão</strong>. Quem tira o maior age primeiro; a diferença vira a distância, em Ticks, até a vez de cada um.</p>
  <table><thead><tr><th class="c">Ticks</th><th>Ação</th><th>Exemplos</th></tr></thead><tbody>
    <tr><td class="c">3</td><td>Muito rápida</td><td>correr, sacar arma</td></tr><tr><td class="c">4</td><td>Utilitária</td><td>pegar item, interagir</td></tr><tr><td class="c">5</td><td>Ataque leve</td><td>adaga, espada curta</td></tr><tr><td class="c">6</td><td>Ataque médio</td><td>espada longa, lança</td></tr><tr><td class="c">7</td><td>Ataque pesado</td><td>martelo, montante</td></tr>
  </tbody></table>
  <p class="subtle">Armas leves agem mais vezes e defendem melhor; as pesadas batem como trovão, mas deixam você exposto entre os golpes.</p>
  <h2>Ataque e Defesa</h2>
  <p>Para atacar: monte o pool de Atributo + Habilidade, some o <strong>Acerto da Arma</strong>, aplique Especialidade, Stunts e Técnicas, e role. Acerta se <strong>superar a Defesa</strong> (empate erra). A Defesa é <strong>fixa e passiva</strong> — quem rola é o atacante.</p>
  <span class="formula">Defesa = (Destreza + Habilidade) × 2 − ⌊soma ÷ 4⌋ + Espec. + ⌈Centelha ÷ 2⌉ + mods</span>
  <p>Use <strong>Esquiva</strong> (perícia Esquiva + mobilidade) ou <strong>Bloqueio</strong> (perícia da arma ou Escudos + Defesa da Arma). Escolha a melhor — mas nem tudo se bloqueia.</p>
  <div class="box"><span class="lbl">Quase Acerto</span>Errar por pouco — numa <strong>Faixa</strong> igual ao peso da arma (leve 1, média 2, pesada 3) — ainda raspa o alvo, causando dano fixo igual ao peso, sem Soak (se a arma furar a armadura).</div>
  <h2>Dano e Armadura</h2>
  <span class="formula">Dano = (Dado da Arma + Força + Margem) − Soak</span>
  <p>O <strong>Dado da Arma</strong> é 1d6 (leve), 2d6 (média) ou 3d6 (pesada). Uma mão soma metade da Força; duas mãos, a Força inteira. Cada Margem acrescenta +1d6. O dano vem em três sabores: <strong>Impacto</strong> (contundente), <strong>Corte</strong> e <strong>Perfuração</strong> (letais).</p>
  <p>O <strong>Soak</strong> absorve o golpe — igual ao Vigor contra Impacto, metade do Vigor contra letal; armaduras somam mais. Armas perfurantes têm <strong>Penetração</strong>: se não vencer a Proteção, o dano é anulado. As armas com <strong>Ruptura</strong> (Crush) ignoram o Soak de impacto da armadura.</p>
  <h2>Pressão: muitos contra um</h2>
  <p>Você pode dividir a ação em vários golpes, ao custo de precisão; cada inimigo extra desgasta sua guarda.</p>
  <table><thead><tr><th>Ataques</th><th>Penalidade</th></tr></thead><tbody>
    <tr><td>2 ataques</td><td>1º −1d6, 2º −2d6</td></tr><tr><td>3 ataques</td><td>1º −2d6, 2º −3d6, 3º −4d6</td></tr>
  </tbody></table>
  <p>Cada ataque extra também reduz Esquiva (−1) e Bloqueio (−2) até a próxima ação. Um oponente brilhante resiste a muitos fracos — mas a maré da multidão fura qualquer guarda.</p>
</section>`;

const chLife = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo V</div><h1>Vida, Ferimentos &amp; Cura</h1><div class="orn">❖</div></div>
  <p class="lead">Heróis aguentam o tranco. O combate não começa com a morte à espreita a cada golpe — salvo diferença gritante de poder. Os Pontos de Vida medem quanto você suporta antes de cair.</p>
  <h2>Pontos de Vida</h2>
  <span class="formula">PV = 25 + (Vigor × 3)</span>
  <p>O dano é marcado em duas trilhas: <strong>Impacto</strong> (em geral nocauteia) e <strong>Letal</strong> (corte e perfuração, que ferem de verdade). A soma das duas determina seu estado.</p>
  <h2>Limiares de Ferimento</h2>
  <table><thead><tr><th>Vida</th><th>Estado</th><th>Penalidade</th></tr></thead><tbody>
    <tr><td>76–100%</td><td>Saudável</td><td>nenhuma</td></tr><tr><td>51–75%</td><td>Machucado</td><td>−1 em ações</td></tr><tr><td>26–50%</td><td>Ferido</td><td>−2 ações, −1 Defesa</td></tr><tr><td>11–25%</td><td>Grave</td><td>−3 ações, −2 Defesa</td></tr><tr><td>1–10%</td><td>Crítico</td><td>−4 ações, −3 Defesa</td></tr><tr><td>≤ 0</td><td>Caído</td><td>incapacitado</td></tr>
  </tbody></table>
  <h2>Nocaute e Morte</h2>
  <p>Cair a 0 PV incapacita; se o golpe final foi sobretudo de Impacto, você só desmaia. A morte verdadeira só chega quando o <strong>dano Letal acumulado iguala o PV máximo</strong> — dá para nocautear sem matar, mas tirar uma vida exige sangue suficiente.</p>
  <h2>Recuperação</h2>
  <p>Você recupera o equivalente ao Vigor em PV a cada intervalo — mais lento quanto pior o estado:</p>
  <table><thead><tr><th>Estado</th><th>Recupera o Vigor…</th></tr></thead><tbody>
    <tr><td>Saudável</td><td>por dia</td></tr><tr><td>Machucado / Ferido</td><td>a cada 3 dias</td></tr><tr><td>Grave</td><td>a cada 5 dias</td></tr><tr><td>Crítico</td><td>por semana</td></tr>
  </tbody></table>
  <p class="subtle">Impacto sara muito mais rápido que o Letal; Medicina e magia aceleram a cura.</p>
</section>`;

const chCaminhosIntro = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo VI</div><h1>Os Caminhos</h1><div class="orn">❖</div></div>
  <p class="lead">Tudo o que um personagem aprende de extraordinário — uma manobra marcial, um dom social, um sentido sobre-humano — é uma Técnica de um <strong>Caminho</strong>. Cada Caminho é uma árvore temática que cresce do mundano ao divino, e só floresce em quem tem <strong>Centelha</strong>.</p>
  <h2>Como os Caminhos se organizam</h2>
  <p>Cada um dos nove atributos ancora vários <strong>subcaminhos</strong>; cada subcaminho é uma <strong>árvore de Técnicas</strong>, com pré-requisitos que ramificam e <em>se cruzam</em> — uma Técnica pode exigir outras anteriores, inclusive de atributos diferentes, abrindo espaço para combos. A trilha do <strong>Arcano</strong> (a feitiçaria) vem no capítulo seguinte.</p>
  <h3>As Bandas de Poder</h3>
  <p>A Centelha destrava as bandas: uma Técnica de banda <em>N</em> exige Centelha ≥ ⌈N ÷ 3⌉.</p>
  <table class="span"><thead><tr><th class="c">Centelha</th><th class="c">Bandas</th><th>Estatura</th><th>Sabor</th></tr></thead><tbody>
    <tr><td class="c">1</td><td class="c">1–3</td><td>Mortal+</td><td>salto aprimorado, charme, percepção aguçada</td></tr>
    <tr><td class="c">2</td><td class="c">4–6</td><td>Herói</td><td>correr em paredes, craft sobre-humano</td></tr>
    <tr><td class="c">3</td><td class="c">7–9</td><td>Semideus</td><td>andar na água, invisibilidade, encantar armas</td></tr>
    <tr><td class="c">4</td><td class="c">10–12</td><td>Semideus</td><td>levitar, clarividência, forçar a verdade</td></tr>
    <tr><td class="c">5</td><td class="c">13–15</td><td>Quase-deus</td><td>voar, teletransporte, cortar aço, curar doenças</td></tr>
  </tbody></table>
  <h3>Energia, Mana e custo</h3>
  <p>Caminhos mundanos (Corpo, Voz, Mente) gastam <strong>Energia</strong>; a feitiçaria gasta <strong>Mana</strong>. Ativar uma Técnica custa, em pontos, a mesma Centelha que ela exige; passivas são gratuitas, e as mais poderosas pedem ainda +1 de Vontade.</p>
  <span class="formula">Energia = (Centelha × 3) + soma das Virtudes + Vontade<br>Mana = (Centelha × 2) + Vontade</span>
  <div class="box rule"><span class="lbl">Como ler o catálogo</span>Cada subcaminho traz suas Técnicas agrupadas por banda. A linha em versalete sob cada nome traz a perícia-âncora, os pré-requisitos e o custo (En = Energia; "+1 Vontade" quando exigido). Passivas não custam Energia.</div>
  <p class="subtle">São 48 subcaminhos — um ponto de partida vasto, e sempre há espaço para mais.</p>
  ${caminhosHtml}
</section>`;

const chArcano = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo VII</div><h1>O Arcano</h1><div class="orn">❖</div></div>
  <p class="lead">A feitiçaria é a quarta trilha dos Caminhos — e a única que de fato <em>quebra</em> as regras do mundo. Ela se aprende em <strong>Artes</strong>: domínios mágicos comprados e evoluídos um a um, como linhas de poder distintas.</p>
  <h2>Como o Arcano funciona</h2>
  <p>Cada <strong>Arte</strong> — Fogo, Cura, Fortuna… — é aprendida em separado; saber Fogo não dá Gelo. Cada uma tem <strong>5 níveis</strong>: o nível <em>N</em> exige <strong>Centelha ≥ N</strong> e <strong>Ocultismo ≥ N</strong>, e custa mais XP que uma Técnica mundana. Dentro do seu nível, você <strong>improvisa</strong> efeitos compatíveis — os exemplos guiam a escala.</p>
  <h3>Conjurar</h3>
  <p>Escolha uma Arte que possui e um efeito de nível até o seu. Role <strong>Ocultismo + Atributo</strong> (em geral Inteligência; Manipulação para a mente) e gaste <strong>Mana = nível do efeito</strong>. O alvo resiste conforme o tipo: dano pelo Soak e Esquiva; mente pela Defesa Mental, gastando Vontade contra comandos.</p>
  <div class="box rule"><span class="lbl">Os dois modos</span><strong>Feitiço</strong> — rápido, serve em combate: custa Ticks como uma ação, mais o Mana. &nbsp; <strong>Ritual</strong> — lento (minutos a horas), fora de combate: custa metade do Mana ou alcança efeitos muito maiores, em troca de tempo, componentes e preparo.</div>
  <p class="subtle">Sem backlash por padrão: uma falha apenas desperdiça a ação e parte do Mana. Conjurações compostas (2 Artes numa só) custam a soma das duas.</p>
  <h2 class="span" style="text-align:center;border:none;color:var(--teal)">As Seis Artes Elementais</h2>
  <p class="subtle span" style="text-align:center">Os elementos são granulares — Fogo e Gelo são Artes distintas.</p>
  ${arcanoElem}
  <h2 class="span" style="text-align:center;border:none;color:var(--teal)">As Doze Artes Universais</h2>
  ${arcanoUniv}
</section>`;

const chEquip = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo VIII</div><h1>Armas &amp; Armaduras</h1><div class="orn">❖</div></div>
  <p class="lead">Cada arma é uma <strong>classe-base</strong> recombinada com <strong>tags</strong>. O pilar é simples: a arma define o <em>estilo</em>, não a potência bruta. Pegar "a mais forte" não existe — cada escolha vence umas situações e perde outras.</p>
  <h2>Classes de Arma</h2>
  <table class="span"><thead><tr><th>Classe</th><th class="c">Speed</th><th class="c">Dano</th><th class="c">Acerto</th><th class="c">Def.</th><th class="c">Mãos</th><th>Estilo</th></tr></thead><tbody>
    <tr><td>Leve</td><td class="c">5</td><td class="c">1d6</td><td class="c">+2</td><td class="c">+1</td><td class="c">1</td><td>tempo, precisão e defesa; habilita Técnicas ágeis</td></tr>
    <tr><td>Média</td><td class="c">6</td><td class="c">2d6</td><td class="c">+1</td><td class="c">+1</td><td class="c">1*</td><td>equilíbrio sem fraquezas (versátil)</td></tr>
    <tr><td>Pesada</td><td class="c">7</td><td class="c">3d6</td><td class="c">+0</td><td class="c">−1</td><td class="c">2</td><td>dano que vence armadura — mas lenta e te expõe</td></tr>
    <tr><td>Haste</td><td class="c">6</td><td class="c">2d6</td><td class="c">+1</td><td class="c">+2</td><td class="c">2</td><td>alcance: controla a distância e defende muito</td></tr>
    <tr><td>Distância</td><td class="c">6</td><td class="c">1–3d6</td><td class="c">+1</td><td class="c">—</td><td class="c">2</td><td>domina antes do contato; depende de munição</td></tr>
  </tbody></table>
  <h2>Tags</h2>
  <ul class="plain">
    <li><strong>Crush</strong> — ignora <em>todo</em> o Soak de armadura (só o natural conta). A resposta às placas.</li>
    <li><strong>Alcance</strong> — ataca a uma casa de distância; bônus contra quem se aproxima, penalidade colado.</li>
    <li><strong>Ágil</strong> — usa Destreza no dano; +1 na Defesa da Arma.</li>
    <li><strong>Perfurante (Pen 1–3)</strong> — se Pen ≤ Proteção, o dano perfurante é anulado.</li>
    <li><strong>Versátil</strong> — 1 ou 2 mãos (em 2: +1 dado, −1 Defesa da Arma).</li>
    <li><strong>Arremessável · Munição · Pesada</strong> — lançar; gastar munição; usar Força total e −1 em ações ágeis.</li>
  </ul>
  <h2>Armas de Exemplo</h2>
  <table class="span"><thead><tr><th>Arma</th><th>Construção</th><th class="c">Dano</th><th>Destaque</th></tr></thead><tbody>
    <tr><td>Adaga</td><td>Leve · Ágil · Perf. 2 · Arremessável</td><td class="c">1d6</td><td>rápida, precisa, perfura leve</td></tr>
    <tr><td>Espada Curta</td><td>Leve</td><td class="c">1d6</td><td>veloz e defensiva</td></tr>
    <tr><td>Espada Longa</td><td>Média · Versátil</td><td class="c">2d6</td><td>a clássica adaptável</td></tr>
    <tr><td>Machado</td><td>Média</td><td class="c">2d6</td><td>corte pesado</td></tr>
    <tr><td>Maça</td><td>Média · Crush</td><td class="c">2d6</td><td>abre armaduras</td></tr>
    <tr><td>Picareta de Guerra</td><td>Média · Perf. 3</td><td class="c">2d6</td><td>fura malha e placa</td></tr>
    <tr><td>Lança</td><td>Haste · Perf. 2</td><td class="c">2d6</td><td>alcance + estocada</td></tr>
    <tr><td>Alabarda</td><td>Haste · Crush · Pesada</td><td class="c">2d6</td><td>alcance e impacto, lenta</td></tr>
    <tr><td>Montante</td><td>Pesada</td><td class="c">3d6</td><td>espadão de duas mãos</td></tr>
    <tr><td>Martelo de Guerra</td><td>Pesada · Crush</td><td class="c">3d6</td><td>esmaga placas</td></tr>
    <tr><td>Arco</td><td>Distância · Munição · Perf. 2</td><td class="c">2d6</td><td>precisão à distância</td></tr>
    <tr><td>Besta Pesada</td><td>Distância · Munição · Perf. 3 · recarga</td><td class="c">3d6</td><td>fura quase tudo</td></tr>
  </tbody></table>
  <h2>Armaduras</h2>
  <p>A armadura soma <strong>Soak</strong> (Impacto e Corte) e dá <strong>Proteção</strong> (o nível que a Penetração precisa vencer). Mas o peso se paga.</p>
  <table class="span"><thead><tr><th>Armadura</th><th class="c">Soak</th><th class="c">Prot.</th><th class="c">Esquiva</th><th>Lentidão</th><th>Furtiv. / Técnicas</th></tr></thead><tbody>
    <tr><td>Nenhuma</td><td class="c">0</td><td class="c">0</td><td class="c">—</td><td>—</td><td>—</td></tr>
    <tr><td>Leve (couro)</td><td class="c">+2</td><td class="c">1</td><td class="c">−0</td><td>—</td><td>−0</td></tr>
    <tr><td>Média (malha)</td><td class="c">+4</td><td class="c">2</td><td class="c">−1</td><td>−1 Iniciativa</td><td>−2 Furtividade</td></tr>
    <tr><td>Pesada (placas)</td><td class="c">+6</td><td class="c">3</td><td class="c">−2</td><td>+1 Tick · −3 Inic.</td><td>−4 Furt.; bloqueia Técnicas ágeis</td></tr>
  </tbody></table>
  <p class="subtle">A placa te torna um tanque, mas mais fácil de acertar, mais lento e barulhento — e desliga estilos ágeis e furtivos. Armadura não reduz o Bloqueio: o blindado troca esquivar por aparar.</p>
  <h4>Escudos (ocupam uma mão)</h4>
  <p>Broquel <strong>+1</strong> · Escudo <strong>+2</strong> · Pavês <strong>+3</strong> ao Bloqueio (o Pavês dá −1 em ataques).</p>
  <h2>Arma × Armadura</h2>
  <p>Dano médio que conecta (Força 3, Vigor 3, margem 0) — a pedra-papel-tesoura validada por cálculo:</p>
  <table class="span"><thead><tr><th>Arma ↓ \\ Armadura →</th><th class="c">Nenhuma</th><th class="c">Leve</th><th class="c">Média</th><th class="c">Pesada</th></tr></thead><tbody>
    <tr><td>Espada média (corte)</td><td class="c">7</td><td class="c">5</td><td class="c">3</td><td class="c"><strong>1</strong></td></tr>
    <tr><td>Arma pesada (corte)</td><td class="c">12</td><td class="c">10</td><td class="c">8</td><td class="c">6</td></tr>
    <tr><td>Lança (Perf. 2)</td><td class="c">9</td><td class="c">7</td><td class="c"><strong>0</strong></td><td class="c"><strong>0</strong></td></tr>
    <tr><td>Maça (Crush)</td><td class="c">5</td><td class="c">5</td><td class="c">5</td><td class="c"><strong>5</strong></td></tr>
  </tbody></table>
  <div class="box"><span class="lbl">Como derrotar cada armadura</span>O cavaleiro de placas é quase intocável por estocadas, mas um camponês com um malho (Crush) ainda o amassa — e três deles o derrubam pela lentidão. Lanças e flechas ricocheteiam na placa.</div>
</section>`;

const chCreation = `
<section class="chapter">
  <div class="chapter-head"><div class="num">Capítulo IX</div><h1>Criação de Personagem</h1><div class="orn">❖</div></div>
  <p class="lead">Um personagem é construído gastando <strong>Experiência</strong> (XP) a partir de valores-piso. Não há pacotes por categoria: você recebe um bolo de XP e o investe onde a sua história pede.</p>
  <h2>Pisos e princípios</h2>
  <p>Tudo começa no mínimo: <strong>Atributos 2</strong> · <strong>Habilidades 0</strong> · <strong>Virtudes 1</strong> · <strong>Vontade 5</strong> · <strong>Centelha 0</strong> · qualquer <strong>Caminho 0</strong>. A Centelha 0 é o mortal comum; comprar <strong>Centelha 1</strong> é o que torna alguém especial. Orçamento inicial sugerido: <strong>~400 XP</strong> (cru ~300; heroico ~500).</p>
  <h2>Custos de XP</h2>
  <p>O custo é para subir ao próximo ponto, em função do <em>novo</em> valor.</p>
  <table class="span"><thead><tr><th>Traço</th><th>Custo do próximo ponto</th><th>Exemplos</th></tr></thead><tbody>
    <tr><td>Atributo</td><td>novo × 10</td><td>2→3 = 30 · 3→4 = 40</td></tr>
    <tr><td>Habilidade primária</td><td>novo × 5</td><td>0→1 = 5 · 2→3 = 15</td></tr>
    <tr><td>Habilidade secundária</td><td>novo × 2</td><td>0→1 = 2 · 2→3 = 6</td></tr>
    <tr><td>Especialidade (prim. / sec.)</td><td>10 / 5 por ponto</td><td>limite = nível na Habilidade</td></tr>
    <tr><td>Virtude</td><td>novo × 5</td><td>1→2 = 10 · 2→3 = 15</td></tr>
    <tr><td>Força de Vontade</td><td>novo × 2</td><td>5→6 = 12</td></tr>
    <tr><td>Centelha</td><td>novo × 15</td><td>0→1 = 15 · 2→3 = 45</td></tr>
    <tr><td>Técnica de Caminho</td><td>banda × 5</td><td>banda 1 = 5 · banda 3 = 15</td></tr>
    <tr><td>Nível de Arte (Arcano)</td><td>nível × 10</td><td>nível 1 = 10 · nível 3 = 30</td></tr>
  </tbody></table>
  <p class="subtle">A Centelha cara reflete a raridade: alcançar Centelha 3 custa 90 XP acumulados; a Centelha 5, 225 — o trabalho de uma vida. Técnica de banda <em>N</em> exige Centelha ≥ ⌈N/3⌉; Arte de nível <em>N</em> exige Centelha ≥ N e Ocultismo ≥ N.</p>
  <h2>Limites na criação</h2>
  <p>Atributo máximo <strong>4</strong>; Habilidade máxima <strong>3</strong>; Centelha máxima <strong>2</strong> (a maioria começa em 1). O 5º ponto e tiers maiores vêm com o jogo.</p>
  <h2>Traços derivados</h2>
  <table><tbody>
    <tr><th>Pontos de Vida</th><td>25 + (Vigor × 3)</td></tr>
    <tr><th>Defesa</th><td>(Des + Hab) × 2 − ⌊soma÷4⌋ + Espec. + ⌈Cent÷2⌉</td></tr>
    <tr><th>Defesa Mental</th><td>⌊(Integridade + Vontade)÷2⌋ + Centelha</td></tr>
    <tr><th>Energia</th><td>(Cent × 3) + Virtudes + Vontade</td></tr>
    <tr><th>Mana</th><td>(Cent × 2) + Vontade</td></tr>
    <tr><th>Iniciativa</th><td>1d6 + Raciocínio + Prontidão</td></tr>
  </tbody></table>
  <h2>Exemplo: Kael, o Batedor</h2>
  <p>Um herói de Centelha 1, montado com ~375 XP.</p>
  <table class="span"><thead><tr><th>Compra</th><th>Detalhe</th><th class="c">XP</th></tr></thead><tbody>
    <tr><td>Atributos</td><td>Destreza 4 · Percepção, Vigor, Raciocínio 3 · demais 2</td><td class="c">160</td></tr>
    <tr><td>Habilidades</td><td>Furtividade 3, Armas à Distância 3 · Prontidão, Atletismo, Sobrevivência 2 · Investigação, Briga, Esquiva 1</td><td class="c">120</td></tr>
    <tr><td>Especialidades</td><td>Furtividade, Armas à Distância</td><td class="c">20</td></tr>
    <tr><td>Virtudes</td><td>Valor 3 · Temperança, Convicção 2</td><td class="c">45</td></tr>
    <tr><td>Centelha</td><td>0 → 1</td><td class="c">15</td></tr>
    <tr><td>Técnicas</td><td>Sombra: Pisar Leve, Esgueirar · Olho de Águia: Mira Firme</td><td class="c">15</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td class="c"><strong>375</strong></td></tr>
  </tbody></table>
  <p class="subtle">Derivados: PV 34 · Defesa 10 · Energia 16 · Mana 7 · Iniciativa 1d6+6. Com 400 XP, sobram ~25 para uma 4ª Técnica.</p>
  <div class="orn-div">❖</div>
  <p class="subtle" style="text-align:center">Que a sua centelha cresça.</p>
</section>`;

/* ========================================================================
   7. CAPA + SUMÁRIO + MONTAGEM
   ===================================================================== */
const cover = `
<section class="cover">
  <span class="corner c-tl">${CORNER}</span><span class="corner c-tr">${CORNER}</span><span class="corner c-bl">${CORNER}</span><span class="corner c-br">${CORNER}</span>
  <div class="kicker">Sistema de Interpretação</div>
  <h1>Centelha<span class="d6">D6</span></h1>
  <div class="dline"><span>❖</span></div>
  <div class="sub">Do mortal ao semideus, um dado de cada vez</div>
  <p class="tagline">Um sistema de pool de dados que equilibra realismo tático e agilidade cinematográfica — onde a perícia, a vontade e a centelha de poder decidem o destino.</p>
  <div class="ed">Livro de Regras &bull; Edição de Trabalho</div>
</section>`;

const toc = `
<section class="toc">
  <h1>Sumário</h1>
  ${[
    ['I','O Coração do Sistema','Rolagens, dificuldade e margem'],
    ['II','Atributos &amp; Perícias','O que define o personagem'],
    ['III','Centelha, Virtudes &amp; Vontade','A alma e o poder'],
    ['IV','Combate','Ticks, ataque, defesa e dano'],
    ['V','Vida, Ferimentos &amp; Cura','Aguentar e se recuperar'],
    ['VI','Os Caminhos','48 subcaminhos, do mortal ao divino'],
    ['VII','O Arcano','As 18 Artes da feitiçaria'],
    ['VIII','Armas &amp; Armaduras','Classes, tags e o estilo de luta'],
    ['IX','Criação de Personagem','Montar um herói com XP'],
  ].map(([n,t,d])=>`<div class="row"><span class="num">${n}</span><span class="t">${t}</span><span class="l"></span><span class="n">${d}</span></div>`).join('')}
  <div class="orn-div">❖ &nbsp; ❖ &nbsp; ❖</div>
  <p class="subtle" style="text-align:center">Uma edição viva e jogável de ponta a ponta: do primeiro dado ao último feitiço, passando pelos Caminhos que vão do mortal ao semideus.</p>
</section>`;

// string-set para o cabeçalho de capítulo: aplicado via script no DOM (Paged.js lê string(chaptitle))
const STRINGSET = `
<style>
  .chapter > .chapter-head h1{ string-set: chaptitle content(text); }
  .cover, .toc{ string-set: chaptitle ""; }
</style>`;

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Centelha — Livro de Regras</title>
<style>${CSS}</style>
${STRINGSET}
</head>
<body>
${cover}
${toc}
${chCore}
${chAttr}
${chSoul}
${chCombat}
${chLife}
${chCaminhosIntro}
${chArcano}
${chEquip}
${chCreation}
<script>window.PagedConfig = { auto:true, after:()=>{ window.__pagedDone = true; } };</script>
<script src="paged.polyfill.js"></script>
</body>
</html>`;

// dados + parser reaproveitáveis pela migração (src/data) — import sem efeito colateral
export { TECH, CAMINFO, TRILHAS, BANDLABEL, ARTE_DESC, ARTE_FX, ARTE_ELEM, ARTE_UNIV, extract, FEM, prep, CAM_MD };

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  fs.writeFileSync(path.join(ROOT,'livro.html'), html, 'utf8');
  const techCount = Object.keys(TECH).length;
  console.log(`livro.html gerado — ${techCount} Técnicas, ${Object.keys(CAMINFO).length} subcaminhos, ${ARTE_ELEM.length+ARTE_UNIV.length} Artes.`);
  if(missing.length){ console.log(`\\n⚠ ${missing.length} Técnicas SEM efeito extraído:\\n` + missing.join(', ')); }
  else { console.log('✓ Todas as Técnicas tiveram efeito extraído do .md.'); }
}
