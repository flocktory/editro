const Element = require('./Element');
const EventEmmiter = require('events');
const { debounce } = require('./utils');

class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
    this.current = {};
    this.node = document.createElement('iframe');
    this.node.className = 'EditroFrame';
    this.node.setAttribute('sandbox', 'allow-same-origin allow-scripts');

    this.node.addEventListener('load', this._onLoad.bind(this));
    this.node.srcdoc = options.code;

    this._emitChange = debounce(() =>
      this.emit('change', {
        html: this.getHtml()
      }),
      1
    );
  }

  getNode() {
    return this.node;
  }

  getHtml() {
    const doc = this.node.contentDocument;
    if (!doc) {
      return '';
    }
    const root = doc.documentElement;
    if (!root) {
      return '';
    }

    const st = doc.getElementById('editro-frame-style');
    if (st) {
      st.parentNode.removeChild(st);
    }
    const html = root.outerHTML;
    this._addServiceNodes();

    return '<!doctype html>\n' + html;
  }

  setHtml(code) {
    this.node.srcdoc = code;
  }

  selectByQuery(query) {
    const doc = this.node.contentDocument;
    if (doc) {
      const el = doc.querySelector(query);
      if (el) {
        this._select(el);
      }
    }
  }

  _onLoad() {
    const { contentDocument } = this.node;
    const body = contentDocument.body;

    this._addServiceNodes();

    // remove if few selected, select first
    const current = body.querySelectorAll('[editro-current]');
    if (current.length) {
      [].slice.call(current, 1).forEach(n => n.removeAttribute('editro-current'));
      this._select(current[0], true);
    } else {
      this.emit('deselected');
    }

    body.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._select(e.target);
    }, true);

    this.emit('load', {
      html: this.getHtml()
    });
  }

  _select(node, silenced) {
    if (this.current.el) {
      if (this.current.node === node) {
        return;
      }

      this.current.node.removeAttribute('editro-current');
      this.current.el.emit('deattached');
      this.current.el.removeAllListeners('change');
    }

    this.current.node = node;
    node.setAttribute('editro-current', '');
    const el = new Element(node);
    this.current.el = el;

    el.on('change', this._emitChange);

    this.emit('selected', el);
    if (!silenced) {
      this._emitChange();
    }
  }

  _onMutate() {
    this.emit('change', {
      html: this.getHtml()
    });
  }

  _addServiceNodes() {
    const doc = this.node.contentDocument;
    let st = doc.getElementById('editro-frame-style');
    if (!st) {
      st = doc.createElement('style');
      st.id = 'editro-frame-style';
      st.innerHTML = `
        * {
          cursor: pointer;
        }
        [editro-current] {
          outline-color: #0022df;
          outline-offset: 0px;
          outline-style: dotted;
          outline-width: 1px;
        }
      `;
      doc.head.appendChild(st);
    }
  }
}


module.exports = Frame;
