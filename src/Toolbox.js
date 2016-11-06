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
    this.node.innerHTML = `
      <div class="${this.prefix}-Toolbar">
        <div class="${this.prefix}-Header">
          <div class="${this.prefix}-Title"></div>
          <div class="${this.prefix}-Collapse">&#x232A;</div>
          <div class="${this.prefix}-Open">&#x2329;</div>
        </div>
      </div>
    `;

    elem(this, 'Collapse').addEventListener('click', this._toggle.bind(this));
    elem(this, 'Open').addEventListener('click', this._toggle.bind(this));
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
    elem(this, 'Title').innerText = element.getTag();
    if (is(this, 'collapsed')) {
      this._toggle();
    }
  }

  _toggle() {
    this.node.classList.toggle(this.prefix + '--collapsed');
  }
}


module.exports = Toolbox;
