export function explainResult(result, review) {
  switch(result.kind){
    case 'syntax':return 'JavaScript no puede interpretar el código. Revisa llaves, paréntesis, comillas y la estructura de la función. El mensaje técnico aparece arriba.';
    case 'reference':return 'Se está usando un nombre que no existe en este ámbito. Comprueba la escritura, las mayúsculas y dónde declaraste la variable.';
    case 'type-error':return 'Una operación no es válida para el valor recibido. Revisa si estás usando un método de array sobre otro tipo o accediendo a una propiedad de null/undefined.';
    case 'missing-function':return 'La función solicitada no está disponible. Usa el nombre del enunciado y declárala en el nivel principal del editor.';
    case 'printed-not-returned':return 'La función devuelve undefined y ha escrito en consola. console.log muestra información, pero no devuelve el resultado al corrector. Revisa si falta un return en la función principal.';
    case 'undefined':return 'La función devuelve undefined. Puede faltar return, estar dentro de un callback o quedar algún camino sin devolver un valor. En una flecha con llaves, el retorno no es implícito.';
    case 'async':return 'Se ha devuelto una promesa. Este reto espera un resultado síncrono: una función async devuelve una promesa aunque uses return.';
    case 'invalid-number':return 'El resultado numérico es NaN o infinito. Revisa conversiones fallidas, operaciones con undefined y divisiones por cero; no basta con que typeof diga number.';
    case 'mutation':return 'Se ha modificado un argumento que el enunciado pide conservar. Construye un array nuevo antes de añadir o quitar elementos.';
    case 'type':return `El tipo no coincide: se esperaba ${result.expectedType} y se obtuvo ${result.actualType}. "true" es texto, true es booleano y [2, 4] es un array. Comprueba qué estás devolviendo.`;
    case 'passed':return 'Este caso cumple el resultado esperado. Repasa también por qué funciona con los casos límite.';
    default:return `El código se ejecutó, pero el valor no coincide. ${review}`;
  }
}
export function renderFeedback(result, challenge, help, escape) {
  if(result.error)return `<div class="feedback"><strong>La ejecución se ha detenido</strong><p>${escape(result.error)}</p><p>Tu borrador se conserva. Si hay un bucle, comprueba que su condición pueda terminar y que el contador avance.</p></div>`;
  const passed=result.results.filter(r=>r.passed).length;
  return `<div class="feedback"><h3>${passed} de ${result.results.length} pruebas superadas</h3><p>${passed===result.results.length?'Tu solución supera los casos preparados. No tiene que coincidir con una solución textual única.':'Abre una prueba para seguir el recorrido: entrada → esperado → obtenido.'}</p></div><div class="case-results">${result.results.map((r,i)=>`<details class="case-result" ${!r.passed?'open':''}><summary>${r.passed?'✓':'○'} Prueba ${i+1} · ${r.passed?'Correcta':'Por revisar'}</summary><dl><dt>Llamada</dt><dd><code>${escape(`${challenge.entrypoint}(${r.input})`)}</code></dd><dt>Esperado · ${escape(r.expectedType)}</dt><dd><code>${escape(r.expected)}</code></dd><dt>${r.error?'Error':'Obtenido · '+escape(r.actualType)}</dt><dd><code>${escape(r.error||r.actual)}</code></dd></dl><p class="case-explanation">${escape(explainResult(r,help.review))}</p>${r.logs?.length?`<details><summary>Lo que has mostrado en consola</summary><pre><code>${escape(r.logs.join('\n'))}</code></pre></details>`:''}</details>`).join('')}</div>`;
}
