class Element {
  constructor(node) {
    this.node = node;
  }

  getNode() {
    return this.node;
  }
  getAttribute(name) {
    return this.node.getAttribute(name);
  }
  setAttribute(name, value) {
    return this.node.setAttribute(name, value);
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
  }
  setHtml(html) {
    this.node.innerHTML = html;
  }
  getTag() {
    return this.node.tagName.toLowerCase();
  }
}

module.exports = Element;

