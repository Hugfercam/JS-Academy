export function runExam(code,timeout=4000) {
  return new Promise(resolve=>{
    let worker;
    try { worker=new Worker(new URL('./exam.worker.js',import.meta.url),{type:'module'}); }
    catch(error) { resolve({error:`No se pudo iniciar la evaluación: ${error.message}`}); return; }
    let settled=false;
    const finish=result=>{if(settled)return;settled=true;clearTimeout(timer);worker.terminate();resolve(result);};
    const timer=setTimeout(()=>finish({error:'Tiempo agotado (4 segundos). Revisa los bucles. Tu borrador sigue guardado; puedes corregirlo y volver a evaluar.'}),timeout);
    worker.onmessage=event=>finish(event.data);
    worker.onerror=event=>{event.preventDefault();finish({error:event.message||'Error al ejecutar la evaluación.'});};
    worker.postMessage({code});
  });
}
