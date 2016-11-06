const Element = require('./Element');
const EventEmmiter = require('events');

export default class Frame extends EventEmmiter {
  constructor(options) {
    super();
    this.prefix = options.prefix;
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
      this.emit('selected', new Element(e.target));
    }, true);

    this.emit('load');

    const observer = new window.MutationObserver(e => this._onMutate(e));
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(body, config);
  }

  _onMutate(e) {
    this.emit('change', {
      mutations: e,
      html: this.getHtml()
    });
  }
}

