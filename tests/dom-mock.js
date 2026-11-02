// Minimal DOM mock to test UI rendering and event handlers in Node without external dependencies

export function setupMockDOM() {
  const elements = new Map();

  class MockElement {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.id = '';
      this.className = '';
      this.attributes = new Map();
      this.children = [];
      this.parentNode = null;
      this.value = '';
      this._innerHTML = '';
      this._textContent = '';
      this.dataset = {};
      this.style = {};
      this.onclick = null;
      this.oninput = null;
      this.disabled = false;
      this.hidden = false;
    }

    setAttribute(name, val) {
      this.attributes.set(name, String(val));
      if (name === 'id') this.id = String(val);
      if (name === 'class') this.className = String(val);
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[camel] = String(val);
      }
    }

    getAttribute(name) {
      if (this.attributes.has(name)) return this.attributes.get(name);
      if (name.startsWith('data-')) {
        const camel = name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (camel in this.dataset) return this.dataset[camel];
      }
      return null;
    }

    hasAttribute(name) {
      return this.getAttribute(name) !== null;
    }

    removeAttribute(name) {
      this.attributes.delete(name);
    }

    addEventListener(event, handler) {
      this._listeners = this._listeners || {};
      this._listeners[event] = this._listeners[event] || [];
      this._listeners[event].push(handler);
    }

    removeEventListener(event, handler) {
      if (!this._listeners?.[event]) return;
      this._listeners[event] = this._listeners[event].filter(h => h !== handler);
    }

    dispatchEvent(event) {
      if (this['on' + event.type]) this['on' + event.type](event);
      if (this._listeners?.[event.type]) {
        for (const h of this._listeners[event.type]) h(event);
      }
      return true;
    }

    before(...nodes) {
      if (!this.parentNode) return;
      for (const node of nodes) {
        this.parentNode.insertBefore(node, this);
      }
    }

    after(...nodes) {
      if (!this.parentNode) return;
      const idx = this.parentNode.children.indexOf(this);
      const next = this.parentNode.children[idx + 1];
      for (const node of nodes) {
        if (next) this.parentNode.insertBefore(node, next);
        else this.parentNode.appendChild(node);
      }
    }

    remove() {
      if (!this.parentNode) return;
      const idx = this.parentNode.children.indexOf(this);
      if (idx !== -1) this.parentNode.children.splice(idx, 1);
      this.parentNode = null;
    }

    insertBefore(newNode, refNode) {
      const idx = this.children.indexOf(refNode);
      if (idx === -1) return this.appendChild(newNode);
      newNode.parentNode = this;
      this.children.splice(idx, 0, newNode);
      if (newNode.id) elements.set(newNode.id, newNode);
      return newNode;
    }

    append(...nodes) {
      for (const node of nodes) {
        if (typeof node === 'string') {
          const textEl = new MockElement('span');
          textEl.textContent = node;
          this.appendChild(textEl);
        } else if (node) {
          this.appendChild(node);
        }
      }
    }

    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      if (child.id) elements.set(child.id, child);
      return child;
    }

    closest(selector) {
      let cur = this;
      while (cur) {
        if (matches(cur, selector)) return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    get innerHTML() {
      return this._innerHTML;
    }

    set innerHTML(html) {
      this._innerHTML = html;
      this.children = [];
      parseHTML(html, this);
    }

    get textContent() {
      if (this.children.length === 0) return this._textContent ?? '';
      return this.children.map(c => c.textContent).join(' ');
    }

    set textContent(txt) {
      this._textContent = String(txt ?? '');
    }

    querySelector(selector) {
      return queryOne(this, selector);
    }

    querySelectorAll(selector) {
      const results = [];
      queryAll(this, selector, results);
      return results;
    }
  }

  function matches(el, selector) {
    if (selector.startsWith('#')) return el.id === selector.slice(1);
    if (selector.startsWith('.')) return el.className.split(/\s+/).includes(selector.slice(1));
    if (selector.startsWith('[') && selector.endsWith(']')) {
      const inside = selector.slice(1, -1);
      if (inside.includes('=')) {
        const [rawName, rawVal] = inside.split('=');
        const val = rawVal.replace(/^["']|["']$/g, '');
        return el.getAttribute(rawName.trim()) === val;
      }
      return el.hasAttribute(inside);
    }
    return el.tagName.toLowerCase() === selector.toLowerCase();
  }

  function queryOne(root, selector) {
    for (const child of root.children) {
      if (matches(child, selector)) return child;
      const found = queryOne(child, selector);
      if (found) return found;
    }
    return null;
  }

  function queryAll(root, selector, acc) {
    for (const child of root.children) {
      if (matches(child, selector)) acc.push(child);
      queryAll(child, selector, acc);
    }
  }

  function parseHTML(html, parent) {
    let index = 0;
    while (index < html.length) {
      const nextTag = html.indexOf('<', index);
      if (nextTag === -1) {
        const text = html.slice(index).trim();
        if (text) {
          const tNode = new MockElement('span');
          tNode.textContent = text;
          parent.appendChild(tNode);
        }
        break;
      }
      if (nextTag > index) {
        const text = html.slice(index, nextTag).trim();
        if (text) {
          const tNode = new MockElement('span');
          tNode.textContent = text;
          parent.appendChild(tNode);
        }
      }
      if (html.startsWith('<!--', nextTag)) {
        const endComment = html.indexOf('-->', nextTag);
        index = endComment === -1 ? html.length : endComment + 3;
        continue;
      }
      const tagEnd = html.indexOf('>', nextTag);
      if (tagEnd === -1) break;
      const tagContent = html.slice(nextTag + 1, tagEnd).trim();
      index = tagEnd + 1;

      if (tagContent.startsWith('/')) {
        continue;
      }

      const isSelfClosing = tagContent.endsWith('/') || /^(?:input|img|br|hr|meta|link)$/i.test(tagContent.split(/\s+/)[0]);
      const cleanTag = isSelfClosing && tagContent.endsWith('/') ? tagContent.slice(0, -1).trim() : tagContent;
      const tagName = cleanTag.split(/\s+/)[0];
      const el = new MockElement(tagName);
      const attrStr = cleanTag.slice(tagName.length);

      const attrRegex = /([a-z0-9-]+)(?:="([^"]*)")?/gi;
      let aMatch;
      while ((aMatch = attrRegex.exec(attrStr)) !== null) {
        const aName = aMatch[1].toLowerCase();
        const aVal = aMatch[2] !== undefined ? aMatch[2] : '';
        el.setAttribute(aName, aVal);
      }
      if (el.id) elements.set(el.id, el);
      parent.appendChild(el);

      if (!isSelfClosing) {
        const closingTag = `</${tagName}>`;
        let depth = 1;
        let searchIndex = index;
        let foundClose = -1;
        while (depth > 0 && searchIndex < html.length) {
          const nextOpen = html.toLowerCase().indexOf(`<${tagName.toLowerCase()}`, searchIndex);
          const nextClose = html.toLowerCase().indexOf(closingTag.toLowerCase(), searchIndex);
          if (nextClose === -1) break;
          if (nextOpen !== -1 && nextOpen < nextClose) {
            const charAfter = html[nextOpen + 1 + tagName.length];
            if (charAfter === '>' || charAfter === '/' || /\s/.test(charAfter)) {
              depth++;
              searchIndex = nextOpen + 1 + tagName.length;
              continue;
            }
          }
          depth--;
          if (depth === 0) {
            foundClose = nextClose;
            break;
          }
          searchIndex = nextClose + closingTag.length;
        }

        if (foundClose !== -1) {
          const innerHTML = html.slice(index, foundClose);
          parseHTML(innerHTML, el);
          index = foundClose + closingTag.length;
        }
      }
    }
  }

  const documentMock = {
    createElement: tag => new MockElement(tag),
    querySelector: sel => {
      if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (elements.has(id)) return elements.get(id);
      }
      return queryOne(documentMock.body, sel);
    },
    querySelectorAll: sel => {
      const results = [];
      queryAll(documentMock.body, sel, results);
      return results;
    },
    body: new MockElement('body')
  };

  return { document: documentMock, elements };
}
