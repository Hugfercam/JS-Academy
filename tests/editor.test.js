import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editCode } from '../src/editor.js';

test('envuelve la selección y conserva el texto seleccionado entre los símbolos', () => {
  assert.deepEqual(editCode('hola',0,4,'pair','()'),{value:'(hola)',start:1,end:5});
  assert.deepEqual(editCode('',0,0,'pair','{}'),{value:'{}',start:1,end:1});
});
test('Enter conserva sangrado y crea una línea interior entre llaves', () => {
  assert.deepEqual(editCode('  hola',6,6,'newline'),{value:'  hola\n  ',start:9,end:9});
  assert.deepEqual(editCode('{}',1,1,'newline'),{value:'{\n  \n}',start:4,end:4});
});
test('sangra varias líneas sin incluir la línea siguiente a la selección', () => {
  const result=editCode('a\nb\nc',0,4,'indent');
  assert.equal(result.value,'  a\n  b\nc');
  assert.equal(result.start,2);assert.equal(result.end,8);
  assert.equal(editCode(result.value,result.start,result.end,'outdent').value,'a\nb\nc');
});
test('quitar sangrado no mueve el cursor antes del inicio de la línea', () => {
  assert.deepEqual(editCode('  a',0,0,'outdent'),{value:'a',start:0,end:0});
  assert.deepEqual(editCode('\ta',1,1,'outdent'),{value:'a',start:0,end:0});
});
test('los movimientos de cursor respetan los límites y la selección', () => {
  assert.deepEqual(editCode('abc',0,0,'left'),{value:'abc',start:0,end:0});
  assert.deepEqual(editCode('abc',3,3,'right'),{value:'abc',start:3,end:3});
  assert.deepEqual(editCode('abc',0,2,'right'),{value:'abc',start:2,end:2});
});
