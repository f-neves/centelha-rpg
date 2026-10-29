import { build } from 'esbuild';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const src = JSON.parse(readFileSync('scripts/fixtures/kael.json','utf8'));
src.id.altura = '1,85 m'; src.id.peso = '90 kg';
src.id.nome = 'Teste local F4.1'; src.corpo = {};
src.skills2['livre-1'] = 2; src.livreNome = { 'livre-1': 'Cartografia' };
src.spec2['livre-1'] = [{ s: 'mapas', v: 1 }];
src.tech = { 'forca-1': true, 'forca-2': false };
src.efeito = { neblina: true, escuro: false };
src.anteNom = { aliado: [{ u: 'a1', n: 'Ari', v: 2 }] };
const out = join(tmpdir(), `centelha-ficha41-local-${process.pid}.mjs`);
await build({ entryPoints: ['src/lib/ficha-formato.ts'], outfile: out, bundle: true, format: 'esm', platform: 'node', logLevel: 'error' });
const { fichaParaGravar, fichaParaLeitura } = await import(pathToFileURL(out).href);
const novo = fichaParaGravar(src);
const esperado = { nome: novo.nome, altura: novo.corpo.altura, massa: novo.corpo.massa,
  bravura: novo.virtudes.bravura, livre: novo.habilidadesSec.habilidadeSecLivre1,
  especialidade: novo.especialidadesSec.habilidadeSecLivre1,
  proezas: novo.proezas, efeitos: novo.efeitos, antecedente: novo.antecedentesNomeados.aliado[0],
  primeiraArma: novo.equipamento.conjuntos[0].maoHabil.ref,
  idaEVolta: fichaParaGravar(fichaParaLeitura(novo)).nome === novo.nome };
writeFileSync('../tmp/executora/fase3/teste-local-41.json', JSON.stringify({ id: '00000000-0000-4000-8000-000000000041', ficha: src }, null, 2));
writeFileSync('../tmp/executora/fase3/saida-local-41.json', JSON.stringify({ id: '00000000-0000-4000-8000-000000000041', ficha: novo, esperado }, null, 2));
unlinkSync(out);
console.log(JSON.stringify(esperado));
