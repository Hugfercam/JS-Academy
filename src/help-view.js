export function mountHelp(container, help, escape) {
  let revealed=0;
  container.innerHTML='<h3>Una ayuda, paso a paso</h3><p class="subtle">Pide solo lo que necesites. Las pistas no restan puntos.</p><ol class="hint-steps"></ol><button type="button" class="button" data-hint>Ver pista 1 de 3</button><div class="solution-request"><button type="button" class="text-button" data-solution>Solicitar solución comentada</button><div data-confirm hidden><p>Se mostrará una posible solución. Tu código no se sustituye.</p><button type="button" class="button" data-reveal>Mostrar solución</button> <button type="button" class="text-button" data-cancel>Seguir intentándolo</button></div><div data-answer></div></div>';
  const hintButton=container.querySelector('[data-hint]');
  hintButton.onclick=()=>{
    if(revealed>=help.hints.length)return;
    const item=document.createElement('li');item.textContent=help.hints[revealed++];container.querySelector('.hint-steps').append(item);
    hintButton.textContent=revealed<help.hints.length?`Ver pista ${revealed+1} de ${help.hints.length}`:'Has visto todas las pistas';hintButton.disabled=revealed===help.hints.length;
  };
  container.querySelector('[data-solution]').onclick=()=>{container.querySelector('[data-confirm]').hidden=false;};
  container.querySelector('[data-cancel]').onclick=()=>{container.querySelector('[data-confirm]').hidden=true;};
  container.querySelector('[data-reveal]').onclick=()=>{
    container.querySelector('[data-confirm]').hidden=true;container.querySelector('[data-solution]').hidden=true;
    container.querySelector('[data-answer]').innerHTML=`<h4>Una posible solución</h4><pre><code>${escape(help.solution)}</code></pre><p>${escape(help.explanation)}</p><p class="subtle">Otras implementaciones que cumplan el contrato también son válidas. Compárala con tu código y prueba tus propios cambios.</p>`;
  };
}
