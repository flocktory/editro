const Element = require('./Element');
const EventEmmiter = require('events');
const { debounce } = require('./utils');
const DOCUMENT_READYSTATE_LOADING = 'loading';

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
      this.isDocumentReady() && this.emit('change', {
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

  // Find and select element, return undefined if no element
  selectByQuery(query) {
    const doc = this.node.contentDocument;
    if (doc) {
      const el = doc.querySelector(query);
      if (el) {
        return this._select(el);
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

  isDocumentReady() {
    const doc = this.node.contentDocument;

    return doc && doc.readyState && doc.readyState !== DOCUMENT_READYSTATE_LOADING;
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
    return el;
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
        @-webkit-keyframes pulsate {
          50% {
            outline-color: #0022df;
          }
          75% {
            outline-color: rgba(0, 34, 223, 0.2);
          }
          100% {
            outline-color: #0022df;
          }
        }
        [editro-current] {
          outline-color: #0022df;
          outline-offset: 0px;
          outline-style: dotted;
          outline-width: 1px;
          animation: pulsate 1s infinite;
        }
      `;
      doc.head.appendChild(st);
    }
  }
}


module.exports = Frame;
