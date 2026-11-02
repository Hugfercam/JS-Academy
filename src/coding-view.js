import { enhanceEditor } from './editor.js';
import { runCode } from './runner.js';
import { coaching } from './coaching.js';
import { mountHelp } from './help-view.js';
import { renderFeedback } from './feedback.js';

export function renderCodingPage({challenge:c,challenges,shell,heading,escape,progress,persist,isCurrent}) {
  const help=coaching[c.id];
  let running=false;
  shell('codigo',heading('MANOS AL TECLADO','Las ideas se entienden practicando.','Prueba tu idea, entiende el resultado y pide una pista cuando la necesites.')+`
    <div class="coding-layout"><section class="panel"><label for="challenge">Elige tu reto</label><select id="challenge">${challenges.map(item=>`<option value="${item.id}" ${item.id===c.id?'selected':''}>${item.title}</option>`).join('')}</select><h2>${c.title}</h2><p>${escape(c.prompt)}</p><p class="subtle">${escape(c.sourceSection)} · pp. ${c.sourcePages}</p>${c.adaptation?`<p class="subtle">${escape(c.adaptation)}</p>`:''}<section class="coaching" id="challenge-help" aria-label="Pistas y solución"></section><p class="subtle">${c.cases.length} pruebas · límite de 2 segundos<br>Ejecuta solo código escrito por ti.</p></section>
    <section class="panel editor-panel"><label for="editor">Tu solución · JavaScript</label><textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${escape(progress.coding[c.id]?.draft??c.starter)}</textarea><div class="editor-actions"><button id="run" class="button dark">▷ Ejecutar pruebas</button><button id="reset" class="text-button">Reiniciar</button></div><p id="draft-state" class="subtle" role="status">El borrador se guarda al escribir.</p><div id="code-results" role="status" aria-live="polite"></div></section></div>`);
  mountHelp(document.querySelector('#challenge-help'),help,escape);
  const editor=document.querySelector('#editor'),results=document.querySelector('#code-results');
  const cleanup=enhanceEditor(editor);
  editor.oninput=()=>{
    progress.coding[c.id]={...progress.coding[c.id],draft:editor.value};
    const saved=persist();document.querySelector('#draft-state').textContent=saved?'Borrador guardado.':'No se pudo guardar. Exporta el progreso antes de salir.';
    results.innerHTML='<p class="subtle">Código modificado: ejecuta las pruebas para actualizar la corrección.</p>';
  };
  document.querySelector('#challenge').onchange=e=>{location.hash=`#/codigo/${e.target.value}`;};
  document.querySelector('#reset').onclick=()=>{if(running)return;if(confirm('¿Reiniciar el código de este reto?')){editor.value=c.starter;editor.dispatchEvent(new Event('input',{bubbles:true}));}};
  document.querySelector('#run').onclick=async()=>{
    if(running)return;running=true;
    const button=document.querySelector('#run');button.disabled=true;editor.readOnly=true;button.textContent='Ejecutando…';
    // Guarda también un intento ejecutado sin haber tocado la plantilla.
    progress.coding[c.id]={...progress.coding[c.id],draft:editor.value};persist();
    let result;
    try{result=await runCode(editor.value,c);}catch(error){result={error:`No se pudo iniciar la ejecución: ${error.message}`};}
    if(!isCurrent())return;
    running=false;button.disabled=false;editor.readOnly=false;button.textContent='▷ Ejecutar pruebas';
    const passed=result.results?.filter(r=>r.passed).length||0;
    progress.coding[c.id]={...progress.coding[c.id],draft:editor.value,passed,total:c.cases.length,attempts:(Number(progress.coding[c.id]?.attempts)||0)+1};persist();
    results.innerHTML=renderFeedback(result,c,help,escape);
  };
  return cleanup;
}
