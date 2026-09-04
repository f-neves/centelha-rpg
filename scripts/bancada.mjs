// bancada.mjs · as constantes da mesa de mentira, num lugar só.
//
// POR QUE ELE EXISTE
//
// O identificador da mesa de bancada estava escrito à mão em oito arquivos:
// `mesa-mock.mjs` (que a cria) e sete que a abrem. É a mesma forma do defeito da
// política de pular: configuração copiada envelhece em ritmos diferentes, e a
// cópia errada não faz barulho, porque cada arquivo continua coerente consigo
// mesmo. Ali eram três testes cravados no Edge do Windows; aqui bastaria trocar
// o identificador num lado para o teste abrir uma mesa que não existe e falhar
// dizendo qualquer outra coisa.
//
// O QUE ENTRA AQUI: valor que o mock e quem o dirige precisam concordar. O que
// é só de um dos dois (o teto de repintura do `test-grid`, a semente do
// espelho) fica onde está: centralizar o que não é compartilhado só afasta o
// número de quem o lê.
//
//   import { MESA_BANCADA } from './bancada.mjs';

/**
 * A mesa da bancada.
 *
 * Um UUID válido e obviamente falso: versão 4, variante correta, e o resto
 * zerado. Tem de passar pela validação de uuid do PostgREST quando a bancada
 * roda contra um Supabase de verdade, e tem de ser reconhecível de relance num
 * log para ninguém a confundir com mesa de gente.
 */
export const MESA_BANCADA = '00000000-0000-4000-8000-0000000000aa';
