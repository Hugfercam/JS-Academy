import {test} from 'node:test';
import assert from 'node:assert/strict';
import {libraryExam} from '../src/exam.js';
import {evaluateExam} from '../src/exam-engine.js';
import {topics} from '../src/content.js';
import {existsSync} from 'node:fs';
import {empty,isValid,save,load} from '../src/store.js';
import {examCoaching} from '../src/exam-coaching.js';

// Solución de referencia SOLO para comprobar el corrector; no se importa en producción.
const reference=`
let libros=[],idLibro=0,limiteLibros=20;
function actualizarLimite(n){if(!Number.isInteger(n)||n<=0)return -1;limiteLibros=n;return n;}
function mostrarLimite(){return 'El límite actual de la biblioteca es de '+limiteLibros+' libros';}
function CrearLibro(titulo,autor,paginas,fecha,...generos){this.titulo=titulo;this.autor=autor;this.paginas=Number.isFinite(paginas)&&paginas>0?paginas:0;const parsed=Date.parse(fecha);this.fecha=Number.isNaN(parsed)?Date.now():parsed;this.generos=[];this.anyadirGeneros(...generos);}
CrearLibro.prototype.mostrarLibro=function(){return 'Libro: '+this.titulo+' - Autor: '+this.autor+' - Páginas: '+this.paginas;};
CrearLibro.prototype.actualizarPaginas=function(p){if(Number.isFinite(p)&&p>0)this.paginas=p;};
CrearLibro.prototype.actualizarFecha=function(f){const parsed=Date.parse(f);if(!Number.isNaN(parsed))this.fecha=parsed;};
CrearLibro.prototype.anyadirGeneros=function(...g){for(const item of g)if(!this.generos.includes(item))this.generos.push(item);};
CrearLibro.prototype.borrarGeneros=function(...g){this.generos=this.generos.filter(item=>!g.includes(item));};
function listarLibros(){return libros;}
function anyadirLibro(libro){if(libros.length>=limiteLibros)return false;libro.id=idLibro++;libros.push(libro);return true;}
function borrarLibro(id){libros=libros.filter(libro=>libro.id!==id);}
function calcularTotalPaginas(){return libros.reduce((total,libro)=>total+libro.paginas,0);}
function calcularMediaPaginas(){return libros.length?calcularTotalPaginas()/libros.length:0;}
function librosDisponibles(){return limiteLibros-libros.length;}
`;
test('los cinco PDF tienen cobertura y todas las lecciones tienen fuente',()=>{
  assert.equal(topics.reduce((n,t)=>n+t.lessons.length,0),37);
  for(const topic of topics){assert.ok(existsSync(new URL(`../materiales/${topic.source.file}`,import.meta.url)));assert.equal(new Set(topic.lessons.map(l=>l.id)).size,topic.lessons.length);for(const l of topic.lessons)assert.ok(l.pages&&l.text&&l.example&&l.mistake);}
});
test('Biblioteca conserva los diez ejercicios y sus diez puntos',()=>{
  assert.equal(libraryExam.tasks.length,10);assert.equal(libraryExam.tasks.reduce((n,t)=>n+t.points,0),10);
  const result=evaluateExam(reference);assert.equal(result.score,10,JSON.stringify(result.tasks.filter(t=>t.passed!==t.total)));assert.ok(result.tasks.every(t=>t.checks.every(c=>c.passed)));
});
test('las soluciones por apartado de Biblioteca componen una solución de diez puntos',()=>{
  const code=libraryExam.tasks.map(task=>{const help=examCoaching[task.id];assert.equal(help.hints.length,3);assert.ok(help.explanation);return help.solution;}).join('\n');
  const result=evaluateExam(code);assert.equal(result.score,10,JSON.stringify(result));
});
test('admite implementaciones alternativas por comportamiento',()=>{
  const alternative=reference.replace('return libros.reduce((total,libro)=>total+libro.paginas,0);','let total=0; for(const libro of libros) total+=libro.paginas; return total;');assert.equal(evaluateExam(alternative).score,10);
});
test('los errores parciales no impiden corregir los otros apartados',()=>{
  const result=evaluateExam(reference.replace('return limiteLibros-libros.length;','return 20;'));
  assert.equal(result.score,9);assert.ok(result.tasks.slice(0,9).every(t=>t.score===t.points));
  const starter=evaluateExam(libraryExam.starter);assert.equal(starter.score,0);assert.ok(starter.tasks.some(t=>t.checks.some(c=>c.error?.includes('ReferenceError'))));
  assert.match(evaluateExam('function roto( {').error,/SyntaxError/);
});
test('el progreso de simulacro y borrador sobreviven a una recarga',()=>{
  const state=empty();state.exams[libraryExam.id]={draft:reference,result:evaluateExam(reference),score:10,attempts:1,completed:true};
  assert.equal(isValid(state),true);let stored;const storage={setItem(k,v){stored=v;},getItem(){return stored;}};assert.equal(save(storage,state),true);assert.deepEqual(load(storage),state);
  state.exams[libraryExam.id].result.tasks[0].id='<img>';assert.equal(isValid(state),false);
});
