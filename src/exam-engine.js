import { libraryExam } from './exam.js';

// Cada comprobación ejecuta de nuevo el archivo: no comparte mutaciones con otras.
// Solo se llama dentro del Worker; el tiempo límite lo controla el hilo principal.
export function evaluateExam(code) {
  try { new Function(code); } catch(error) { return {error:`${error.name}: ${error.message}`}; }
  const tasks=libraryExam.tasks.map(task=>{
    const checks=task.checks.map(check=>{
      try { return {description:check.description,passed:new Function(`"use strict";\n${code}\nreturn (() => {\n${check.code}\n})();`)()===true}; }
      catch(error) { return {description:check.description,passed:false,error:`${error.name}: ${error.message}`}; }
    });
    const passed=checks.filter(c=>c.passed).length;
    return {id:task.id,title:task.title,points:task.points,passed,total:checks.length,score:task.points*passed/checks.length,checks};
  });
  return {tasks,score:Math.round(tasks.reduce((sum,t)=>sum+t.score,0)*100)/100,total:10};
}
