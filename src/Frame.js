const Element = require('./Element');
const EventEmmiter = require('events');

class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
    this.current = null;
    this.node = document.createElement('iframe');
    this.node.className = this.prefix;

    this.node.addEventListener('load', this._onLoad.bind(this));
    this.node.srcdoc = options.code;
  }

  getNode() {
    return this.node;
  }

  getHtml() {
    return this.node.contentDocument.documentElement ?
      '<!doctype html>\n' + this.node.contentDocument.documentElement.outerHTML :
      '';
  }

  setHtml(code) {
    this.node.srcdoc = code;
  }

  _onLoad() {
    const { contentDocument } = this.node;
    const body = contentDocument.body;

    body.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this._select(e.target);
    }, true);

    this.emit('load');
  }

  _select(node) {
    if (this.current) {
      this.current.emit('deattached');
      this.current.removeAllListeners('change');
    }

    const el = new Element(node);
    this.current = el;

    el.on('change', () => {
      this.emit('change', {
        element: el,
        html: this.getHtml()
      });
    });

    this.emit('selected', el);
  }

  _onMutate(e) {
    this.emit('change', {
      mutations: e,
      html: this.getHtml()
    });
  }
}


module.exports = Frame;
