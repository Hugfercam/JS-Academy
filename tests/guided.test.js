import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { guidedPractices } from '../src/guided-practices.js';
import { empty, load, save, isValid } from '../src/store.js';

const source = readFileSync(new URL('../src/worker.js', import.meta.url), 'utf8');

function execute(code, entrypoint, cases) {
  let result;
  const context = vm.createContext({
    structuredClone,
    self: {
      postMessage: value => { result = value; }
    }
  });
  vm.runInContext(source, context);
  context.input = { code, entrypoint, cases };
  vm.runInContext('self.onmessage({data:input})', context, { timeout: 300 });
  return result;
}

test('las prácticas guiadas tienen estructura válida en gastos, aventureros-a y aventureros-b', () => {
  assert.equal(guidedPractices.length, 3);

  // 1. Práctica de gastos (17 etapas)
  const gastos = guidedPractices.find(p => p.id === 'gastos');
  assert.ok(gastos);
  assert.equal(gastos.parts.length, 3);
  assert.equal(gastos.stages.length, 17);

  // 2. Práctica A de aventureros (8 etapas)
  const avA = guidedPractices.find(p => p.id === 'aventureros-a');
  assert.ok(avA);
  assert.equal(avA.topicId, 'objetos');
  assert.equal(avA.parts.length, 3);
  assert.equal(avA.stages.length, 8);

  // 3. Práctica B de aventureros (8 etapas)
  const avB = guidedPractices.find(p => p.id === 'aventureros-b');
  assert.ok(avB);
  assert.equal(avB.topicId, 'objetos');
  assert.equal(avB.recommendedBefore, 'aventureros-a');
  assert.equal(avB.parts.length, 3);
  assert.equal(avB.stages.length, 8);

  for (const practice of guidedPractices) {
    const stageIds = practice.stages.map(s => s.id);
    assert.equal(new Set(stageIds).size, practice.stages.length);

    for (const s of practice.stages) {
      assert.match(s.entrypoint, /^[a-zA-Z_$][\w$]*$/);
      assert.ok(s.cases.length >= 1, `${s.id} debe tener al menos 1 caso de prueba`);
      assert.equal(s.hints.length, 3, `${s.id} debe tener exactamente 3 pistas`);
      assert.equal(new Set(s.hints).size, 3, `${s.id} debe tener 3 pistas diferentes`);
      assert.ok(s.concept && s.prompt && s.explanation && s.review);
      assert.doesNotThrow(() => new Function(s.starter), `El starter de ${s.id} tiene error de sintaxis`);
    }
  }
});

test('todas las soluciones comentadas de las 17 etapas de gastos superan sus pruebas en el evaluador', () => {
  const practice = guidedPractices.find(p => p.id === 'gastos');
  for (const stage of practice.stages) {
    const result = execute(stage.solution, stage.entrypoint, stage.cases);
    assert.ok(result, `No hay resultado de ejecución para ${stage.id}`);
    assert.ok(
      result.results.every(r => r.passed),
      `La solución de ${stage.id} (${stage.title}) falló en alguna prueba: ${JSON.stringify(result)}`
    );
  }
});

test('todas las soluciones comentadas de las 8 etapas de aventureros A superan sus pruebas en el evaluador', () => {
  const practice = guidedPractices.find(p => p.id === 'aventureros-a');
  for (const stage of practice.stages) {
    const result = execute(stage.solution, stage.entrypoint, stage.cases);
    assert.ok(result, `No hay resultado de ejecución para ${stage.id}`);
    assert.ok(
      result.results.every(r => r.passed),
      `La solución de ${stage.id} (${stage.title}) falló en alguna prueba: ${JSON.stringify(result)}`
    );
  }
});

test('todas las soluciones comentadas de las 8 etapas de aventureros B superan sus pruebas en el evaluador', () => {
  const practice = guidedPractices.find(p => p.id === 'aventureros-b');
  for (const stage of practice.stages) {
    const result = execute(stage.solution, stage.entrypoint, stage.cases);
    assert.ok(result, `No hay resultado de ejecución para ${stage.id}`);
    assert.ok(
      result.results.every(r => r.passed),
      `La solución de ${stage.id} (${stage.title}) falló en alguna prueba: ${JSON.stringify(result)}`
    );
  }
});

test('distingue implementaciones incorrectas en Práctica A y Práctica B', () => {
  const avA = guidedPractices.find(p => p.id === 'aventureros-a');
  const avB = guidedPractices.find(p => p.id === 'aventureros-b');

  // Práctica A - Etapa 1: Objeto sin ataque
  const stageA1 = avA.stages.find(s => s.id === 'av-a1');
  const wrongA1 = execute('function crearPersonaje(nombre, vida, ataque) { return { nombre, vida }; }', stageA1.entrypoint, stageA1.cases);
  assert.equal(wrongA1.results.some(r => !r.passed), true);

  // Práctica A - Etapa 7: Daño que permite valores negativos
  const stageA7 = avA.stages.find(s => s.id === 'av-a7');
  const wrongA7 = execute(`
    function Personaje(n, v, a) {
      this.nombre = n; this.vida = v; this.ataque = a; this.vidaMaxima = v;
      this.mostrarEstado = function() { return ''; };
      this.recibirDanyo = function(c) { this.vida -= c; return this.vida; };
    }
  `, stageA7.entrypoint, stageA7.cases);
  assert.equal(wrongA7.results.some(r => !r.passed), true);

  // Práctica B - Etapa 3: Método definido en el constructor en vez de en prototype
  const stageB3 = avB.stages.find(s => s.id === 'av-b3');
  const wrongB3 = execute(`
    function Personaje(n, v, a) {
      this.nombre = n; this.vida = v; this.ataque = a;
      this.mostrarEstado = function() { return \`\${this.nombre} tiene \${this.vida} puntos de vida.\`; };
    }
  `, stageB3.entrypoint, stageB3.cases);
  assert.equal(wrongB3.results.some(r => !r.passed), true);

  // Práctica B - Etapa 6: No conectar la herencia prototípica con Object.create
  const stageB6 = avB.stages.find(s => s.id === 'av-b6');
  const wrongB6 = execute(`
    function Personaje(n, v, a) { this.nombre = n; this.vida = v; this.ataque = a; }
    Personaje.prototype.mostrarEstado = function() { return ''; };
    Personaje.prototype.recibirDanyo = function(c) { return this.vida; };
    Personaje.prototype.curar = function(c) { return this.vida; };
    function Guerrero(n, v, a, arm) { this.nombre = n; this.vida = v; this.ataque = a; this.armadura = arm; }
  `, stageB6.entrypoint, stageB6.cases);
  assert.equal(wrongB6.results.some(r => !r.passed), true);
});

test('la persistencia guarda y recupera el progreso de las tres prácticas guiadas', () => {
  const map = new Map();
  const storage = { getItem: k => map.get(k), setItem: (k, v) => map.set(k, v) };
  const state = empty();

  state.guided.gastos = {
    currentStage: 2,
    unlockedStage: 3,
    completed: false,
    stages: {
      'g-a1': { draft: 'function esGastoGrande(){ return true; }', passed: 4, total: 4, completed: true, attempts: 1 }
    }
  };

  state.guided['aventureros-a'] = {
    currentStage: 1,
    unlockedStage: 2,
    completed: false,
    stages: {
      'av-a1': { draft: 'function crearPersonaje(){}', passed: 3, total: 3, completed: true, attempts: 1 }
    }
  };

  state.guided['aventureros-b'] = {
    currentStage: 0,
    unlockedStage: 0,
    completed: false,
    stages: {}
  };

  assert.equal(save(storage, state), true);
  const loaded = load(storage);
  assert.deepEqual(loaded, state);
  assert.equal(loaded.guided.gastos.unlockedStage, 3);
  assert.equal(loaded.guided['aventureros-a'].unlockedStage, 2);
  assert.equal(loaded.guided['aventureros-a'].stages['av-a1'].completed, true);
  assert.ok(loaded.guided['aventureros-b']);
});

test('las etapas de aventureros-a y aventureros-b tienen actividad múltiple choice interactiva válida (3 opciones, 1 correcta)', () => {
  const avA = guidedPractices.find(p => p.id === 'aventureros-a');
  const avB = guidedPractices.find(p => p.id === 'aventureros-b');
  const targetPractices = [avA, avB];

  for (const practice of targetPractices) {
    for (const stage of practice.stages) {
      assert.ok(stage.multipleChoiceCode, `La etapa ${stage.id} debe incluir multipleChoiceCode`);
      const mcq = stage.multipleChoiceCode;
      assert.equal(mcq.options.length, 3, `La etapa ${stage.id} debe mostrar exactamente 3 alternativas`);

      const correctOptions = mcq.options.filter(o => o.isCorrect === true);
      const incorrectOptions = mcq.options.filter(o => o.isCorrect === false);
      assert.equal(correctOptions.length, 1, `La etapa ${stage.id} debe tener exactamente 1 opción correcta`);
      assert.equal(incorrectOptions.length, 2, `La etapa ${stage.id} debe tener exactamente 2 opciones incorrectas`);

      const codes = mcq.options.map(o => o.code.trim());
      assert.equal(new Set(codes).size, 3, `Las 3 alternativas de ${stage.id} deben tener códigos distintos`);

      for (let i = 0; i < mcq.options.length; i++) {
        const opt = mcq.options[i];
        assert.ok(opt.code && opt.code.length > 5, `La opción ${i} de ${stage.id} debe tener código no vacío`);
        assert.ok(opt.explanation && opt.explanation.length > 10, `La opción ${i} de ${stage.id} debe tener una explicación pedagógica detallada`);
      }
    }
  }
});

test('la pista 3 interactiva se renderiza con 3 alternativas y es accesible con roles ARIA', async () => {
  const { setupMockDOM } = await import('./dom-mock.js');
  const { renderGuidedPage } = await import('../src/guided-view.js');

  const { document } = setupMockDOM();
  globalThis.document = document;
  globalThis.location = { hash: '#/guiada/aventureros-a/0' };
  globalThis.Event = class { constructor(type) { this.type = type; } };

  const shell = (page, body) => { document.body.innerHTML = body; };
  const heading = (e, t, d) => '<h1>' + t + '</h1>';
  const escape = s => s;
  const progress = { guided: {} };
  const persist = () => true;

  renderGuidedPage({
    id: 'aventureros-a',
    stageIndex: 0,
    guidedPractices,
    shell,
    heading,
    escape,
    progress,
    persist,
    isCurrent: () => true
  });

  const btnNextHint = document.querySelector('#btn-next-hint');
  btnNextHint.onclick(); // Pista 1
  btnNextHint.onclick(); // Pista 2
  btnNextHint.onclick(); // Pista 3 interactiva

  const hint3 = document.querySelector('#hint-3-interactive');
  assert.ok(hint3, 'Debe renderizarse la pista 3 interactiva');

  const radioGroup = hint3.querySelector('[role="radiogroup"]');
  assert.ok(radioGroup, 'Debe tener un contenedor con role="radiogroup" para accesibilidad');

  const options = hint3.querySelectorAll('[data-mcq-option]');
  assert.equal(options.length, 3, 'Debe renderizar exactamente 3 alternativas de código');

  for (const optBtn of options) {
    assert.equal(optBtn.getAttribute('role'), 'radio', 'Cada alternativa debe tener role="radio"');
    assert.ok(optBtn.hasAttribute('aria-checked'), 'Cada alternativa debe tener atributo aria-checked');
  }
});

test('responder correctamente el test interactivo no completa automáticamente la etapa ni muta el editor', async () => {
  const { setupMockDOM } = await import('./dom-mock.js');
  const { renderGuidedPage } = await import('../src/guided-view.js');

  const { document } = setupMockDOM();
  globalThis.document = document;
  globalThis.location = { hash: '#/guiada/aventureros-a/0' };
  globalThis.Event = class { constructor(type) { this.type = type; } };

  const shell = (page, body) => { document.body.innerHTML = body; };
  const heading = (e, t, d) => '<h1>' + t + '</h1>';
  const escape = s => s;
  const progress = { guided: {} };
  const persist = () => true;

  renderGuidedPage({
    id: 'aventureros-a',
    stageIndex: 0,
    guidedPractices,
    shell,
    heading,
    escape,
    progress,
    persist,
    isCurrent: () => true
  });

  const stage = guidedPractices.find(p => p.id === 'aventureros-a').stages[0];
  const stageState = progress.guided['aventureros-a'].stages[stage.id];

  // Desplegar hasta la pista 3
  const btnNextHint = document.querySelector('#btn-next-hint');
  btnNextHint.onclick();
  btnNextHint.onclick();
  btnNextHint.onclick();

  assert.equal(stageState.hint3Consulted, true, 'Debe registrar que se consultó la pista 3');
  assert.equal(stageState.completed, false, 'La etapa NO debe estar completada antes del test');

  // Localizar la opción correcta
  const correctIdx = stage.multipleChoiceCode.options.findIndex(o => o.isCorrect);
  assert.ok(correctIdx >= 0);

  // Seleccionar la opción correcta
  const correctBtn = document.querySelector(`[data-mcq-option="${correctIdx}"]`);
  correctBtn.onclick();

  // Comprobar la respuesta
  const btnCheck = document.querySelector('#btn-check-mcq');
  btnCheck.onclick();

  // Verificaciones críticas
  assert.equal(stageState.quizAttempts, 1, 'Debe incrementar los intentos del test interactivo a 1');
  assert.equal(stageState.quizSolved, true, 'Debe registrar que se resolvió el test correctamente');
  assert.equal(stageState.completed, false, 'CRÍTICO: Acertar el test NO debe completar la etapa automáticamente');
  assert.equal(stageState.draft, stage.starter, 'CRÍTICO: No debe inyectar automáticamente el código en el borrador');

  // Comprobar mensaje de feedback positivo y recordatorio del editor
  const feedback = document.querySelector('#mcq-feedback-container');
  assert.ok(feedback.textContent.includes('¡Respuesta correcta!'), 'Debe mostrar feedback positivo');
  assert.ok(feedback.textContent.includes('editor'), 'Debe recordar volver al editor para escribir la solución');
});

test('responder incorrectamente muestra la explicación del error y permite reintentar otra opción', async () => {
  const { setupMockDOM } = await import('./dom-mock.js');
  const { renderGuidedPage } = await import('../src/guided-view.js');

  const { document } = setupMockDOM();
  globalThis.document = document;
  globalThis.location = { hash: '#/guiada/aventureros-a/0' };
  globalThis.Event = class { constructor(type) { this.type = type; } };

  const shell = (page, body) => { document.body.innerHTML = body; };
  const heading = (e, t, d) => '<h1>' + t + '</h1>';
  const escape = s => s;
  const progress = { guided: {} };
  const persist = () => true;

  renderGuidedPage({
    id: 'aventureros-a',
    stageIndex: 0,
    guidedPractices,
    shell,
    heading,
    escape,
    progress,
    persist,
    isCurrent: () => true
  });

  const stage = guidedPractices.find(p => p.id === 'aventureros-a').stages[0];
  const stageState = progress.guided['aventureros-a'].stages[stage.id];

  const btnNextHint = document.querySelector('#btn-next-hint');
  btnNextHint.onclick();
  btnNextHint.onclick();
  btnNextHint.onclick();

  // Localizar una opción incorrecta
  const wrongIdx = stage.multipleChoiceCode.options.findIndex(o => !o.isCorrect);
  assert.ok(wrongIdx >= 0);

  // Seleccionar la opción errónea
  const wrongBtn = document.querySelector(`[data-mcq-option="${wrongIdx}"]`);
  wrongBtn.onclick();

  // Comprobar
  const btnCheck = document.querySelector('#btn-check-mcq');
  btnCheck.onclick();

  assert.equal(stageState.quizAttempts, 1);
  assert.equal(stageState.quizSolved, false);
  assert.equal(stageState.completed, false);

  const feedback = document.querySelector('#mcq-feedback-container');
  assert.ok(feedback.textContent.includes('Esta alternativa contiene un error'), 'Debe indicar que la opción contiene un error');
  assert.ok(feedback.textContent.includes(stage.multipleChoiceCode.options[wrongIdx].explanation), 'Debe mostrar la explicación específica de la opción fallida');

  // Reintentar seleccionando otra opción
  const btnRetry = document.querySelector('#btn-retry-mcq');
  assert.ok(btnRetry, 'Debe permitir reintentar con el botón correspondiente');
  btnRetry.onclick();

  assert.equal(stageState.quizSelected, null, 'Al reintentar se limpia la selección para volver a elegir');
});

test('las etapas sin multipleChoiceCode conservan su tercera pista de texto sin regresiones', async () => {
  const { setupMockDOM } = await import('./dom-mock.js');
  const { renderGuidedPage } = await import('../src/guided-view.js');

  const { document } = setupMockDOM();
  globalThis.document = document;
  globalThis.location = { hash: '#/guiada/gastos/0' };
  globalThis.Event = class { constructor(type) { this.type = type; } };

  const shell = (page, body) => { document.body.innerHTML = body; };
  const heading = (e, t, d) => '<h1>' + t + '</h1>';
  const escape = s => s;
  const progress = { guided: {} };
  const persist = () => true;

  renderGuidedPage({
    id: 'gastos',
    stageIndex: 0,
    guidedPractices,
    shell,
    heading,
    escape,
    progress,
    persist,
    isCurrent: () => true
  });

  const gastosStage1 = guidedPractices.find(p => p.id === 'gastos').stages[0];

  const btnNextHint = document.querySelector('#btn-next-hint');
  btnNextHint.onclick();
  btnNextHint.onclick();
  btnNextHint.onclick();

  const hint3Mcq = document.querySelector('#hint-3-interactive');
  assert.equal(hint3Mcq, null, 'Las etapas sin multipleChoiceCode no deben tener contenedor interactivo');

  const hintsList = document.querySelector('#hints-list');
  assert.ok(hintsList.textContent.includes(gastosStage1.hints[2]), 'Debe mostrar el texto clásico de la Pista 3');
});

