import { libraryExam as exam } from './exam.js';
import { runExam } from './exam-runner.js';
import { enhanceEditor } from './editor.js';
import { examCoaching } from './exam-coaching.js';
import { mountHelp } from './help-view.js';
import { explainResult } from './feedback.js';

export function renderExam({shell,heading,escape,progress,persist,isCurrent}) {
  const state=progress.exams[exam.id]||{};
  shell('simulacros',heading('SIMULACRO · BASADO EN TU EXAMEN',exam.title,'Un archivo, diez ejercicios y una biblioteca que construir paso a paso.')+`
    <a href="#/apuntes/objetos" class="text-link">Repasar objetos y prototipos →</a>
    <section class="panel exam-intro"><span class="pill">${exam.duration} · 10 puntos · biblioteca.js</span><p>${exam.description}</p><p class="subtle">Fuente: ${exam.source} · pp. 1–4. Modo repaso sin tiempo obligatorio. Se conserva el borrador al salir.</p>
    <details><summary>Cómo se adapta la corrección a la PWA</summary><ul>${exam.adaptations.map(a=>`<li>${escape(a)}</li>`).join('')}</ul></details></section>
    <div class="exam-layout"><section aria-label="Enunciados">${exam.tasks.map(t=>`<article class="panel exam-task"><p class="eyebrow">EJERCICIO ${t.id} · ${t.points} ${t.points===1?'PUNTO':'PUNTOS'} · PDF P. ${t.page}</p><h2>${t.title}</h2><p>${escape(t.prompt)}</p><div class="coaching" id="exam-help-${t.id}"></div></article>`).join('')}</section>
    <section class="panel editor-panel exam-editor"><label for="exam-code">biblioteca.js · Código compartido</label><textarea id="exam-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${escape(typeof state.draft==='string'?state.draft:exam.starter)}</textarea><div class="editor-actions"><button id="evaluate-exam" class="button dark">▷ Evaluar simulacro</button><button id="download-exam" class="button">Descargar .js</button></div><p class="subtle" id="exam-save" role="status">${state.updatedAt?'Borrador recuperado.':'El borrador se guarda al escribir.'}</p><p class="subtle">Cada evaluación tiene un límite de 4 segundos. Ejecuta solo tu propio código.</p><button id="reset-exam" class="text-button">Reiniciar simulacro</button><div id="exam-results" role="status" aria-live="polite"></div></section></div>`);
  const editor=document.querySelector('#exam-code'),results=document.querySelector('#exam-results');
  for(const task of exam.tasks)mountHelp(document.querySelector(`#exam-help-${task.id}`),examCoaching[task.id],escape);
  const writeDraft=()=>{progress.exams[exam.id]={...progress.exams[exam.id],draft:editor.value,updatedAt:new Date().toISOString()};const saved=persist();document.querySelector('#exam-save').textContent=saved?'Borrador guardado.':'No se pudo guardar: descarga tu archivo antes de salir.';};
  function showResult(result,stale=false){
    if(!result)return;
    if(result.error){results.innerHTML=`<div class="feedback"><strong>No se ha completado la evaluación</strong><p>${escape(result.error)}</p><p>${result.error.startsWith('SyntaxError')?escape(explainResult({kind:'syntax'})): 'Si se agotó el tiempo, revisa que los bucles puedan terminar. El borrador sigue guardado.'}</p></div>`;return;}
    results.innerHTML=`<div class="feedback"><p class="eyebrow">${stale?'ÚLTIMA EVALUACIÓN · VUELVE A EVALUAR TRAS CAMBIAR CÓDIGO':'EVALUACIÓN COMPLETADA'}</p><h2>${result.score} / 10 puntos</h2><p>Nota automática orientativa. Comprueba también la claridad y el razonamiento.</p>${result.tasks.map(t=>`<details><summary>Ej. ${t.id}: ${t.passed}/${t.total} · ${t.score.toFixed(2)} / ${t.points} puntos</summary>${t.checks.map(c=>`<p>${c.passed?'✓':'○'} ${escape(c.description)}${c.error?`<br><small>${escape(c.error)}</small>`:''}</p>${!c.passed?`<p class="case-explanation">${escape(explainResult({kind:c.error?.startsWith('ReferenceError')?'reference':c.error?.startsWith('TypeError')?'type-error':c.error?.startsWith('SyntaxError')?'syntax':'value'},exam.tasks.find(task=>task.id===t.id).hint))}</p>`:''}`).join('')}</details>`).join('')}</div>`;
  }
  // Solo se recuperan resultados generados por esta versión de la aplicación.
  if(state.result?.tasks?.length===10&&state.result.tasks.every(t=>Array.isArray(t.checks)&&typeof t.score==='number'))showResult(state.result,true);
  editor.oninput=()=>{writeDraft();results.innerHTML='<p class="subtle">Código modificado: evalúa otra vez para actualizar la nota.</p>';};
  document.querySelector('#evaluate-exam').onclick=async()=>{
    const button=document.querySelector('#evaluate-exam');button.disabled=true;button.textContent='Evaluando…';editor.readOnly=true;writeDraft();
    const result=await runExam(editor.value);
    if(!isCurrent())return;
    button.disabled=false;button.textContent='▷ Evaluar simulacro';editor.readOnly=false;
    progress.exams[exam.id]={...progress.exams[exam.id],completed:!result.error,score:result.score??0,result,attempts:(Number(progress.exams[exam.id]?.attempts)||0)+1};persist();showResult(result);
  };
  document.querySelector('#download-exam').onclick=()=>{const url=URL.createObjectURL(new Blob([editor.value],{type:'text/javascript;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='biblioteca.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  document.querySelector('#reset-exam').onclick=()=>{if(editor.readOnly)return;if(confirm('¿Reiniciar el código y la nota de Biblioteca? Puedes descargar antes tu archivo.')){editor.value=exam.starter;progress.exams[exam.id]={draft:exam.starter,completed:false,score:0};persist();results.textContent='Simulacro reiniciado.';document.querySelector('#exam-save').textContent='El borrador se guarda al escribir.';}};
  return enhanceEditor(editor);
}
