const EventEmitter = require('events');

class Element extends EventEmitter {
  constructor(node) {
    super();

    this.node = node;
  }

  getAttribute(name) {
    return this.node.getAttribute(name);
  }
  setAttribute(name, value) {
    const v = this.node.setAttribute(name, value);

    this.emit('change', {
      type: 'attribute',
      name: name,
      value: value
    });

    return v;
  }

  getStyle(name) {
    return this.node.style[name];
  }
  getStyles(names) {
    return names.reduce((a, n) => {
      a[n] = this.getStyle(n);
      return a;
    }, {});
  }
  setStyle(name, value) {
    this.node.style[name] = value;

    this.emit('change', {
      type: 'style',
      name: name,
      value: value
    });
  }
  setHtml(html) {
    this.node.innerHTML = html;

    this.emit('change', {
      type: 'html',
      value: html
    });
  }
  getHtml() {
    return this.node.innerHTML;
  }
  getTag() {
    return this.node.tagName.toLowerCase();
  }

  remove() {
    this.node.parentNode.removeChild(this.node);

    this.emit('change', {
      type: 'remove'
    });
  }

  // call to work with real node
  withNode(fn) {
    fn(this.node);
    this.emit('change', {
      type: 'custom'
    });
  }
}

module.exports = Element;

