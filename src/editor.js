// Operaciones puras: permiten comprobar sangrado y selección sin un navegador.
export function editCode(value, start, end, action, text = '') {
  const replace = (from, to, inserted, cursorStart, cursorEnd = cursorStart) => ({
    value: value.slice(0, from) + inserted + value.slice(to), start: cursorStart, end: cursorEnd
  });
  if (action === 'pair') {
    const selected = value.slice(start, end);
    return replace(start, end, text[0] + selected + text[1], start + 1, end + 1);
  }
  if (action === 'newline') {
    const lineStart = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
    const before = value.slice(lineStart, start);
    const indent = before.match(/^[\t ]*/)[0];
    const opensBlock = /[\{\[\(]\s*$/.test(before);
    const nextIndent = indent + (opensBlock ? '  ' : '');
    const closesBlock = opensBlock && /^[\}\]\)]/.test(value.slice(end));
    const inserted = '\n' + nextIndent + (closesBlock ? '\n' + indent : '');
    return replace(start, end, inserted, start + 1 + nextIndent.length);
  }
  if (action === 'indent' || action === 'outdent') {
    const from = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
    // Una selección que termina al inicio de una línea no incluye esa línea.
    const last = end > start && value[end - 1] === '\n' ? end - 1 : end;
    const nextBreak = value.indexOf('\n', last);
    const to = nextBreak === -1 ? value.length : nextBreak;
    let offset = from, startDelta = 0, endDelta = 0;
    const changed = value.slice(from, to).split('\n').map(line => {
      const removed = action === 'outdent' ? (line.match(/^(?: {1,2}|\t)/)?.[0].length || 0) : 0;
      const delta = action === 'indent' ? 2 : -removed;
      if (offset <= start) startDelta += action === 'indent' ? 2 : -Math.min(removed, start - offset);
      if (offset < end || (start === end && offset === end)) endDelta += action === 'indent' ? 2 : -Math.min(removed, end - offset);
      offset += line.length + 1;
      return action === 'indent' ? '  ' + line : line.slice(removed);
    }).join('\n');
    return replace(from, to, changed, start + startDelta, end + endDelta);
  }
  if (action === 'left' || action === 'right') {
    const cursor = action === 'left' ? Math.max(0, start - (start === end ? 1 : 0)) : Math.min(value.length, end + (start === end ? 1 : 0));
    return { value, start: cursor, end: cursor };
  }
  return replace(start, end, text, start + text.length);
}

export function enhanceEditor(editor) {
  const panel = editor.closest('.editor-panel');
  const toolbar = document.createElement('div');
  toolbar.className = 'code-toolbar';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', 'Herramientas del editor de JavaScript');
  const tools = [
    ['indent','⇥','Aumentar sangrado'], ['outdent','⇤','Reducir sangrado'],
    ['pair','{}','Insertar llaves','{}'], ['pair','()','Insertar paréntesis','()'],
    ['pair','[]','Insertar corchetes','[]'], ['pair','""','Insertar comillas dobles','""'],
    ['pair',"''",'Insertar comillas simples',"''"], ['pair','``','Insertar backticks','``'],
    ['insert','=>','Insertar flecha',' => '], ['insert',';','Insertar punto y coma',';'],
    ['insert','=','Insertar igual','='], ['insert',',','Insertar coma',','],
    ['newline','↵','Nueva línea con sangrado'], ['left','←','Mover cursor a la izquierda'],
    ['right','→','Mover cursor a la derecha'], ['undo','↶','Deshacer'], ['redo','↷','Rehacer'],
    ['expand','⛶','Ampliar editor']
  ];
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let history = [], position = -1;
  const snapshot = () => ({ value: editor.value, start: editor.selectionStart, end: editor.selectionEnd });
  function remember() {
    const current = snapshot();
    if (history[position]?.value === current.value) { history[position] = current; return; }
    history = history.slice(0, position + 1);
    history.push(current);
    if (history.length > 100) history.shift();
    position = history.length - 1;
    updateButtons();
  }
  function updateButtons() {
    toolbar.querySelector('[data-action="undo"]').disabled = position <= 0;
    toolbar.querySelector('[data-action="redo"]').disabled = position >= history.length - 1;
  }
  function apply(result, record = true) {
    const top = editor.scrollTop, left = editor.scrollLeft;
    const changed = editor.value !== result.value;
    editor.value = result.value;
    editor.focus({ preventScroll: true });
    editor.setSelectionRange(result.start, result.end);
    editor.scrollTop = top; editor.scrollLeft = left;
    if (record) remember();
    // Dispara el guardado habitual tanto en retos como en simulacros.
    if (changed) editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  let restoring = false;
  for (const [action, label, title, text] of tools) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = label; button.title = title;
    button.setAttribute('aria-label', title); button.dataset.action = action;
    if (action === 'expand') button.setAttribute('aria-pressed', 'false');
    // En pantallas táctiles no cerrar el teclado al insertar símbolos.
    button.addEventListener('pointerdown', event => { if (document.activeElement === editor) event.preventDefault(); }, options);
    button.addEventListener('click', () => {
      if (action === 'expand') {
        const expanded = panel.classList.toggle('editor-expanded');
        button.setAttribute('aria-pressed', String(expanded));
        button.setAttribute('aria-label', expanded ? 'Reducir editor' : title);
        button.title = expanded ? 'Reducir editor' : title;
        button.textContent = expanded ? '✕' : label;
        return;
      }
      if (editor.readOnly || editor.disabled) return;
      // Sincroniza reinicios realizados por la pantalla y la selección actual.
      remember();
      if (action === 'undo' || action === 'redo') {
        const next = position + (action === 'undo' ? -1 : 1);
        if (!history[next]) return;
        position = next; restoring = true;
        apply(history[position], false); restoring = false; updateButtons(); return;
      }
      apply(editCode(editor.value, editor.selectionStart, editor.selectionEnd, action, text));
    }, options);
    toolbar.append(button);
  }
  editor.before(toolbar);
  const help = document.createElement('p');
  help.className = 'editor-help'; help.id = `${editor.id}-help`;
  help.textContent = 'Selecciona texto para envolverlo con símbolos o sangrar varias líneas. Enter mantiene el sangrado. Tab permite salir del editor.';
  editor.setAttribute('aria-describedby', help.id);
  editor.after(help);
  editor.wrap = 'off';
  editor.addEventListener('beforeinput', event => {
    if (restoring) return;
    remember();
    // Algunos teclados Android emiten beforeinput sin un keydown Enter normal.
    if (event.cancelable && !event.isComposing && !editor.readOnly && ['insertLineBreak', 'insertParagraph'].includes(event.inputType)) {
      event.preventDefault();
      apply(editCode(editor.value, editor.selectionStart, editor.selectionEnd, 'newline'));
    }
  }, options);
  editor.addEventListener('input', () => { if (!restoring) remember(); }, options);
  editor.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || editor.readOnly) return;
    event.preventDefault(); remember();
    apply(editCode(editor.value, editor.selectionStart, editor.selectionEnd, 'newline'));
  }, options);
  remember();
  return () => { controller.abort(); toolbar.remove(); help.remove(); panel.classList.remove('editor-expanded'); };
}
