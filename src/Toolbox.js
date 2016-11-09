const { elem, elems, is } = require('./utils');

/*
 * Toolbox class. Represent panel with tools.
 */
class Toolbox {
  constructor(editro) {
    this.element = null;

    this.node = document.createElement('div');
    this.node.className = 'EditroToolbox';
    this.node.innerHTML = `
      <div class="EditroToolbox-placeholder">
        Click on element to select
      </div>
    `;

    editro.on('selected',
      () => this.node.querySelector('.EditroToolbox-placeholder').style.display = 'none');
    editro.on('deselected',
      () => this.node.querySelector('.EditroToolbox-placeholder').style.display = 'block');
  }

  getNode() {
    return this.node;
  }

  addControl(paneName, node) {
    const pane = this._getPane(paneName);
    pane.appendChild(node);
  }
}


module.exports = Toolbox;
