const assert = require('assert');

/*
 * Visual pane.
 * Can be slided from left, right, up, bottom or floated
 */
const positions = ['left', 'right', 'top', 'bottom'];

class Panel {
  constructor(opts) {
    assert(positions.includes(opts.position),
      'Panel position should be in ' + positions.join(', '));

    this.position = opts.position;
    this.tag = opts.tag;

    this.node = document.createElement('div');
    this.node.className = `EditroPanel EditroPanel--${this.position}`;

    this.node.appendChild(opts.child);
  }

  getNode() {
    return this.node;
  }
}

module.exports = function(Editro) {
  Editro.defineHelper('type', 'Panel', Panel);
}
