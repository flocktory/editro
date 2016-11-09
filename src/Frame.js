const Element = require('./Element');
const EventEmmiter = require('events');

class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
    this.current = {};
    this.node = document.createElement('iframe');
    this.node.className = this.prefix;

    this.node.addEventListener('load', this._onLoad.bind(this));
    this.node.srcdoc = options.code;
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

  _onLoad() {
    const { contentDocument } = this.node;
    const body = contentDocument.body;

    this._addServiceNodes();

    // remove if few selected, select first
    const current = body.querySelectorAll('[editro-current]');
    if (current.length) {
      [].slice.call(current, 1).forEach(n => n.removeAttribute('editro-current'));
      this._select(current[0], true);
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
      this.current.node.removeAttribute('editro-current');
      this.current.el.emit('deattached');
      this.current.el.removeAllListeners('change');
    }

    this.current.node = node;
    node.setAttribute('editro-current', '');
    const el = new Element(node);
    this.current.el = el;

    el.on('change', () => {
      this.emit('change', {
        element: el,
        html: this.getHtml()
      });
    });

    this.emit('selected', el);
    if (!silenced) {
      this.emit('change', {
        html: this.getHtml()
      });
    }
  }

  _onMutate(e) {
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
          outline-color: #5020e2;
          outline-offset: 4px;
          outline-style: dashed;
          outline-width: 4px;
        }
      `;
      doc.head.appendChild(st);
    }
  }
}


module.exports = Frame;
