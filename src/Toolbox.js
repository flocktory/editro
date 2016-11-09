const { elem, elems, is } = require('./utils');

/*
 * Toolbox class. Represent panel with tools.
 */
class Toolbox {
  constructor(options) {
    this.prefix = options.prefix;
    this.element = null;

    this.node = document.createElement('div');
    this.node.className = this.prefix;
  }

  getNode() {
    return this.node;
  }
  getPrefix() {
    return this.prefix;
  }

  addControl(paneName, node) {
    const pane = this._getPane(paneName);
    pane.appendChild(node);
  }

  setElement(element) {
    //if (is(this, 'collapsed')) {
      //this._toggle();
    //}
  }

  _toggle() {
    this.node.classList.toggle(this.prefix + '--collapsed');
  }
}


module.exports = Toolbox;
