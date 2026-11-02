import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import assert from 'node:assert/strict';

const directory=resolve('dist');
function filesAt(path){return readdirSync(path).flatMap(name=>{const full=resolve(path,name);return statSync(full).isDirectory()?filesAt(full):[relative(directory,full).replaceAll('\\','/')];});}
const files=filesAt(directory);
for(const file of ['index.html','sw.js','manifest.webmanifest','_headers','icon-192.png','icon-512.png'])assert.ok(files.includes(file),`Falta ${file}`);
assert.ok(files.some(f=>/^assets\/worker-.*\.js$/.test(f)),'Falta el Worker de retos');
assert.ok(files.some(f=>/^assets\/exam\.worker-.*\.js$/.test(f)),'Falta el Worker del simulacro');
assert.ok(files.every(f=>!/(^|\/)(materiales|tests|src|node_modules)(\/|$)|\.pdf$|\.map$/i.test(f)),'Se han incluido archivos ajenos a la compilación');
const manifest=JSON.parse(readFileSync(resolve(directory,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');assert.equal(manifest.display,'standalone');
const sw=readFileSync(resolve(directory,'sw.js'),'utf8');
for(const file of files.filter(f=>/^assets\/.*\.(js|css)$/.test(f)))assert.ok(sw.includes(file),`No está en la caché offline: ${file}`);
assert.match(readFileSync(resolve(directory,'_headers'),'utf8'),/\/sw\.js\s+Cache-Control: no-cache/);
console.log(`Paquete validado: ${files.length} archivos; manifest, contenido y ambos Workers incluidos en la caché. Sin PDF originales ni código de tests.`);
