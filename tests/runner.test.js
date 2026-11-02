import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Worker as NodeWorker} from 'node:worker_threads';
import {runCode} from '../src/runner.js';
import {runExam} from '../src/exam-runner.js';

// Adaptador de la API Worker al hilo nativo de Node: ejecuta los módulos reales.
class WorkerAdapter {
  constructor(url){this.worker=new NodeWorker(new URL('./worker-harness.js',import.meta.url),{workerData:{url:url.href}});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.({message:error.message,preventDefault(){}}));}
  postMessage(data){this.worker.postMessage(data);}
  terminate(){this.worker.terminate();}
}
test('el runner termina un bucle infinito y permite la siguiente ejecución',async()=>{
  const previous=globalThis.Worker;globalThis.Worker=WorkerAdapter;
  try{
    const challenge={entrypoint:'f',cases:[{args:[],expected:1}]};
    assert.match((await runCode('function f(){while(true){}}',challenge,350)).error,/Tiempo agotado/);
    assert.equal((await runCode('const f=()=>1',challenge)).results[0].passed,true);
    assert.match((await runExam('while(true){}',350)).error,/Tiempo agotado/);
  }finally{globalThis.Worker=previous;}
});
