import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {coaching} from '../src/coaching.js';
import {challenges} from '../src/content.js';
import {explainResult,renderFeedback} from '../src/feedback.js';
const source=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
function execute(code,entrypoint,cases){let result;const context=vm.createContext({structuredClone,self:{postMessage:value=>{result=value;}}});vm.runInContext(source,context);context.input={code,entrypoint,cases};vm.runInContext('self.onmessage({data:input})',context,{timeout:200});return result;}
test('el evaluador admite soluciones alternativas y tolerancia decimal',()=>{for(const code of ['function f(p){return p*1.21}','const f = p => p + p*0.21']){const result=execute(code,'f',[{args:[19.99],expected:24.1879}]);assert.equal(result.results[0].passed,true);}});
test('distingue sintaxis inválida y resultados incorrectos',()=>{assert.match(execute('function f( {','f',[{args:[],expected:1}]).results[0].error,/SyntaxError/);assert.equal(execute('function f(){return 2}','f',[{args:[],expected:1}]).results[0].passed,false);});
test('compara arrays y cada prueba recibe datos independientes',()=>{const result=execute('function f(a){return a.filter(n=>n%2===0)}','f',[{args:[[1,2,4]],expected:[2,4]}]);assert.equal(result.results[0].passed,true);});
test('todas las soluciones comentadas superan sus contratos y casos límite',()=>{
  for(const c of challenges){const help=coaching[c.id];assert.ok(help,`Falta ayuda para ${c.id}`);assert.equal(help.hints.length,3);assert.equal(new Set(help.hints).size,3);assert.ok(help.explanation&&help.review);const result=execute(help.solution,c.entrypoint,c.cases);assert.ok(result.results.every(r=>r.passed),`${c.id}: ${JSON.stringify(result)}`);}
});
test('distingue imprimir de devolver y conserva la entrada y la consola por prueba',()=>{
  const result=execute('function f(n){console.log(n*2)}','f',[{args:[3],expected:6},{args:[4],expected:8}]);
  assert.equal(result.results[0].kind,'printed-not-returned');assert.equal(result.results[0].actual,'undefined');assert.equal(result.results[0].input,'3');assert.equal(result.results[0].logs[0],'6');assert.equal(result.results[1].logs.length,1);assert.equal(result.results[1].logs[0],'8');
  assert.match(explainResult(result.results[0],''),/console.log.*return/);
  assert.equal(execute('function f(){console.log(1);return 1}','f',[{args:[],expected:1}]).results[0].passed,true);
});
test('diferencia tipos, NaN, null, promesas y funciones que faltan',()=>{
  const run=code=>execute(code,'f',[{args:[],expected:1}]).results[0];
  assert.equal(run('function f(){return "1"}').kind,'type');
  assert.equal(run('function f(){return NaN}').actual,'NaN');assert.equal(run('function f(){return NaN}').kind,'invalid-number');
  assert.equal(run('function f(){return null}').actual,'null');
  assert.equal(run('async function f(){return 1}').kind,'async');
  assert.equal(run('function otra(){return 1}').kind,'missing-function');
  assert.equal(run('function f(){return desconocida}').kind,'reference');
  assert.equal(run('function f(){return null.nombre}').kind,'type-error');
});
test('detecta mutación prohibida aunque el valor devuelto sea correcto',()=>{
  const result=execute('function f(a){a.push("B");return a}','f',[{args:[['A']],expected:['A','B'],unchangedArgs:true}]).results[0];assert.equal(result.passed,false);assert.equal(result.kind,'mutation');assert.equal(result.input,'["A"]');
});
test('un resultado circular y logs abundantes no impiden informar del fallo',()=>{
  const result=execute('function f(){const x={};x.x=x;for(let i=0;i<100;i++)console.log(i);return x}','f',[{args:[],expected:1}]).results[0];assert.equal(result.passed,false);assert.match(result.actual,/circular/);assert.equal(result.logs.length,15);
});
test('la corrección escapa el código devuelto y no revela una solución',()=>{
  const challenge=challenges[0],help=coaching.iva;
  const result=execute('function calcularPrecioIVA(){return "<img src=x onerror=alert(1)>"}',challenge.entrypoint,challenge.cases);
  const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const html=renderFeedback(result,challenge,help,escape);assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));assert.ok(!html.includes(help.solution));assert.ok(html.includes('calcularPrecioIVA(100)'));
});
