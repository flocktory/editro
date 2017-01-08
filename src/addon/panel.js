/*
 * Visual pane.
 * Can be slided from left, right, up, bottom or floated.
 * Save size. Listen to toggle-${position}-panel event
 *
 * Options:
 * position - String, required, one of left|right|bottom|top
 * fixed - Boolean, should have fixed size?
 * size - String, size if fixed, ex: 200px
 */

const assert = require('assert');

const positions = ['left', 'right', 'top', 'bottom'];

class Panel {
  constructor(editro, opts) {
    assert(positions.includes(opts.position),
      'Panel position should be in ' + positions.join(', '));

    this.editro = editro;
    this.position = opts.position;
    this.getKey = k => `panel:${this.position}:${k}`;

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
      this._restoreState();
    }

    this.node.lastChild.appendChild(opts.child);
    this.node.querySelector('.EditroPanel-move')
      .addEventListener('mousedown', this._startResize.bind(this));

    editro.on(`toggle-${this.position}-panel`, () => this._toggle());
  }

  getNode() {
    return this.node;
  }

  _toggle() {
    this._setHidden(!this._getHidden());
    this._saveState();
  }

  _startResize(e) {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const editro = this.editro;
    const old = editro.getNode().style.pointerEvents;
    editro.getNode().style.pointerEvents = 'none';

    const content = this.node.querySelector('.EditroPanel-content');
    const initialSize = this._getContentSize();
    const updated = (isRow ? e.clientX : e.clientY) + initialSize;
    const dragging = ({ clientY, clientX }) => {
      const size = updated - (isRow ? clientX : clientY);
      content.style[dim] = size + 'px';
      this._saveState();
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

  _getContentSize() {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const content = this.node.querySelector('.EditroPanel-content');
    return parseInt(getComputedStyle(content)[dim]);
  }
  _setContentSize(size) {
    const isRow = this._isRow();
    const dim = isRow ? 'width' : 'height';
    const content = this.node.querySelector('.EditroPanel-content');
    return content.style[dim] = size + 'px';
  }
  _setHidden(hidden) {
    this.node.dataset.hidden = hidden ? 'yes' : 'no';
  }
  _getHidden(hidden) {
    return this.node.dataset.hidden == 'yes';
  }
  _restoreState() {
    this._setContentSize(this.editro.getStorageItem(this.getKey('size')) || 300);
    this._setHidden(this.editro.getStorageItem(this.getKey('hidden') || false));
  }
  _saveState() {
    this.editro.setStorageItem(this.getKey('size'), this._getContentSize());
    this.editro.setStorageItem(this.getKey('hidden'), this._getHidden());
  }
}

module.exports = function(Editro) {
  Editro.defineHelper('type', 'Panel', Panel);
};
