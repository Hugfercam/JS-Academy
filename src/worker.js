function equal(a, b) { if (typeof a === 'number' && typeof b === 'number') return Number.isFinite(a) && Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(b)); if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equal(v, b[i])); if (a && b && typeof a === 'object' && typeof b === 'object') { const keys = Object.keys(a); return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && equal(a[k], b[k])); } return a === b; }
function type(value) { if (value === null) return 'null'; if (Array.isArray(value)) return 'array'; return typeof value; }
function display(value, seen = new Set(), depth = 0) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'number') return Object.is(value, -0) ? '-0' : String(value);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'string') return JSON.stringify(value.length > 1500 ? value.slice(0, 1500) + '…' : value);
  if (typeof value === 'function') return '[función]';
  if (typeof value === 'symbol') return String(value);
  if (value === null || typeof value === 'boolean') return String(value);
  if (seen.has(value)) return '[referencia circular]'; if (depth > 4) return '[…]'; seen.add(value);
  const parts = Array.isArray(value) ? value.slice(0, 30).map(v => display(v, seen, depth + 1)) : Object.keys(value).slice(0, 30).map(k => `${JSON.stringify(k)}: ${display(value[k], seen, depth + 1)}`);
  seen.delete(value); return (Array.isArray(value) ? '[' : '{') + parts.join(', ') + (Array.isArray(value) ? ']' : '}');
}
self.onmessage = ({ data }) => {
  try {
    const results = data.cases.map(test => {
      const logs = [];
      const base = { input: test.description || test.args.map(v => display(v)).join(', '), expected: display(test.expected), expectedType: type(test.expected) };
      const localConsole = {};
      for (const method of ['log', 'info', 'warn', 'error', 'debug']) localConsole[method] = (...args) => { if (logs.length < 15) logs.push(args.map(v => display(v)).join(' ')); };
      try {
        const fn = new Function('console', `"use strict";\n${data.code}\n;return typeof ${data.entrypoint} === 'function' ? ${data.entrypoint} : null;`)(localConsole);
        if (!fn) return { ...base, passed: false, kind: 'missing-function', error: `No se encuentra la función ${data.entrypoint}.`, logs };
        const args = structuredClone(test.args), before = structuredClone(args);
        let actual;
        if (test.eval) {
          actual = new Function('fn', 'args', 'console', `"use strict";\n${data.code}\n;return (${test.eval})(fn, args, console);`)(fn, args, localConsole);
        } else if (data.construct || test.construct) {
          actual = new fn(...args);
        } else {
          actual = fn(...args);
        }
        const actualType = type(actual);
        const returnedPromise = actual !== null && (typeof actual === 'object' || typeof actual === 'function') && typeof actual.then === 'function';
        if (returnedPromise && typeof actual.catch === 'function') actual.catch(() => { });
        const mutated = Boolean(test.unchangedArgs) && !equal(args, before);
        const passed = !returnedPromise && !mutated && equal(actual, test.expected);
        const kind = returnedPromise ? 'async' : mutated ? 'mutation' : passed ? 'passed' : actual === undefined ? (logs.length ? 'printed-not-returned' : 'undefined') : typeof actual === 'number' && !Number.isFinite(actual) ? 'invalid-number' : actualType !== base.expectedType ? 'type' : 'value';
        return { ...base, passed, kind, actual: display(actual), actualType, logs };
      } catch (error) { return { ...base, passed: false, kind: error.name === 'SyntaxError' ? 'syntax' : error.name === 'ReferenceError' ? 'reference' : error.name === 'TypeError' ? 'type-error' : 'runtime', error: `${error.name}: ${error.message}`, logs }; }
    }); self.postMessage({ results });
  } catch (error) { self.postMessage({ error: `${error.name}: ${error.message}` }); }
};
