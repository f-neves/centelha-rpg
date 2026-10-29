// A Defesa Mental usa Integridade zero quando a Habilidade falta.
import {carregarTS} from './lib-ts.mjs';
const M=await carregarTS('src/lib/motor.ts'), E=await carregarTS('src/lib/bestia-editor.ts');
const c=E.novaCriatura();c.atributos.raciocinio=4;c.atributos.inteligencia=3;c.vontade=6;c.centelha=3;
for(const campo of ['fisiologia','comportamento','descricao']) if(campo in c) throw Error('Rascunho novo inventou '+campo);
let recusouRascunho=false;try{E.validarFonte(c);}catch{recusouRascunho=true;}if(!recusouRascunho)throw Error('Controle negativo: rascunho incompleto foi salvo como fonte');
for(const h of [0,5]){
  if(h)c.habilidades.integridade=h;else delete c.habilidades.integridade;
  const esperado=M.defesaMental({raciocinio:4,integridade:h,vontade:6,centelha:3});
  const motor=M.criatura(c).defesaMental;
  const card=M.vistaPublicaCriatura(c).motor.stat.defesaMental;
  if(motor!==esperado||card!==esperado)throw Error('Integridade '+h+': motor '+motor+', card '+card+', esperado '+esperado);
}
console.log('✓ Defesa Mental: Integridade ausente vale zero; Integridade 5 permanece 5');
