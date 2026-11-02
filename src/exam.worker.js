import { evaluateExam } from './exam-engine.js';
self.onmessage=({data})=>self.postMessage(evaluateExam(data.code));
