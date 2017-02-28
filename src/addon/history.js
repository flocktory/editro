/*
 * Simple linear history.
 * You can move forward and backward.
 * If you move backward and push new state you loose items.
 *
 * Upper case - current
 * Push states      a b c D
 * Move basck       a b C d
 * Push new         a b c F
 */

const EventEmitter = require('events');
const { debounce } = require('../utils');

class History extends EventEmitter {
  constructor(size) {
    super();

    this._size = size || 100;
    this._history = [];
    this._pointer = -1;
  }

  push(data) {
    // return if new data the same as current
    if (this._history[this._pointer] === data) {
      return;
    }

    this._pointer++;
    this._history.length = this._pointer + 1; // Remove tail if we move back and push
    this._history[this._pointer] = data;
    // Shorten by size
    while (this._history.length > this._size) {
      this._history.shift();
      this._pointer--;
    }
  }

  forward() {
    if (this._pointer < this._history.length - 1) {
      this._pointer++;
      this._emitChange();
    }
    return this._current();
  }

  backward() {
    if (this._pointer > 0) {
      this._pointer--;
      this._emitChange();
    }
    return this._current();
  }

  _emitChange() {
    this.emit('change', {
      current: this._current()
    });
  }

  _current() {
    return this._history[this._pointer];
  }
}

module.exports = function(Editro) {
  const key = Symbol('history');

  Editro.defineOption('historySize', 100);
  Editro.defineHelper('type', 'History', History);

  Editro.defineInitHook((editro, root, code) => {
    editro[key] = new Editro.type.History(editro.getOption('historySize'));
    editro._h = editro[key];
    editro[key].push(code);
    editro.on('change', debounce(e => editro[key].push(e.html), 300));
  });

  Editro.defineExtension('forward', function() {
    const html = this[key].forward();
    this.setHtml(html);
  });
  Editro.defineExtension('backward', function() {
    const html = this[key].backward();
    this.setHtml(html);
  });
};
