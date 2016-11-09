const assert = require('assert');
const { elem } = require('../utils');

/*
 * Visual pane.
 * Can be slided from left, right, up, bottom or floated
 */
const positions = ['left', 'right', 'top', 'bottom'];

class Panel {
  constructor(editro, opts) {
    assert(positions.includes(opts.position),
      'Panel position should be in ' + positions.join(', '));
    this.editro = editro;

    this.position = opts.position;
    this.tag = opts.tag;

    this.node = document.createElement('div');
    this.node.className = 'EditroPanel';
    this.node.dataset.position = this.position;
    this.node.innerHTML = `
      <div class="EditroPanel-pick">
        <div class="EditroPanel-move">...</div>
        <div class="EditroPanel-collapse"></div>
      </div>
      <div class="EditroPanel-content"></div>`;

    this.node.dataset.fixed = opts.fixed ? 'yes' : 'no';

    if (!opts.fixed) {
      this.node
        .querySelector('.EditroPanel-content')
        .style[this._isRow() ? 'width' : 'height'] = opts.size || '300px';
    }

    this.elem = elem(this);

    this.node.lastChild.appendChild(opts.child);
    this.node.querySelector('.EditroPanel-move')
      .addEventListener('mousedown', this._startResize.bind(this));
  }

  getNode() {
    return this.node;
  }

  _startResize(e) {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const editro = this.editro;
    const old = editro.getNode().style.pointerEvents;
    editro.getNode().style.pointerEvents = 'none';

    const content = this.node.querySelector('.EditroPanel-content');
    const initialSize = parseInt(getComputedStyle(content)[dim]);
    const updated = (isRow ? e.clientX : e.clientY) + initialSize;
    const dragging = ({ clientY, clientX }) => {
      const size = updated - (isRow ? clientX : clientY);
      content.style[dim] = size + 'px';
    };
    document.addEventListener('mousemove', dragging, false);
    const onUp = () => {
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('mouseup', onUp);
      editro.getNode().style.pointerEvents = old;
    };
    document.addEventListener('mouseup', onUp, false);
  }

  _isRow() {
    return ['left', 'right'].includes(this.position);
  }
}

module.exports = function(Editro) {
  Editro.defineHelper('type', 'Panel', Panel);
};
