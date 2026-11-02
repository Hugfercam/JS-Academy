export const KEY='js-academy:progress:v1';
export const empty=()=>({version:1,answers:{},coding:{},exams:{},guided:{},preferences:{}});
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>Number.isSafeInteger(v)&&v>=0;
const score=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=10;
function validExam(exam){
  if(!record(exam)||(exam.draft!==undefined&&typeof exam.draft!=='string')||(exam.score!==undefined&&!score(exam.score))||(exam.attempts!==undefined&&!count(exam.attempts)))return false;
  const result=exam.result;
  if(result===undefined)return true;
  if(!record(result))return false;
  if(typeof result.error==='string')return true;
  return score(result.score)&&Array.isArray(result.tasks)&&result.tasks.length===10&&result.tasks.every(t=>record(t)&&Number.isInteger(t.id)&&t.id>=1&&t.id<=10&&score(t.score)&&score(t.points)&&count(t.passed)&&count(t.total)&&Array.isArray(t.checks)&&t.checks.every(c=>record(c)&&typeof c.description==='string'&&typeof c.passed==='boolean'&&(c.error===undefined||typeof c.error==='string')));
}
function validGuided(g){
  if(!record(g))return false;
  if(g.unlockedStage!==undefined&&!count(g.unlockedStage))return false;
  if(g.currentStage!==undefined&&!count(g.currentStage))return false;
  if(g.stages!==undefined&&!record(g.stages))return false;
  return true;
}
export function isValid(value){return record(value)&&value.version===1&&['answers','coding','exams','preferences'].every(k=>record(value[k]))&&(!value.guided||(record(value.guided)&&Object.values(value.guided).every(validGuided)))&&Object.values(value.answers).every(a=>record(a)&&typeof a.correct==='boolean'&&count(a.attempts)&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<4)&&Object.values(value.coding).every(c=>record(c)&&(c.draft===undefined||typeof c.draft==='string')&&['passed','total','attempts'].every(k=>c[k]===undefined||count(c[k])))&&Object.values(value.exams).every(validExam);}
export function load(storage){try{const value=JSON.parse(storage.getItem(KEY));if(isValid(value)){if(!value.guided)value.guided={};return value;}}catch{}return empty();}
export function save(storage,value){try{storage.setItem(KEY,JSON.stringify(value));return true;}catch{return false;}}
