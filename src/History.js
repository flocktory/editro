import EventEmitter from 'events';

export default class History extends EventEmitter {
  constructor($iframe, root, size = 100) {
    super();

    this._$iframe = $iframe;
    this._root = root;
    this._size = size;
    this._history = [];
    this._pointer = -1;
    this._handler = this._onKeyDown.bind(this);

    // TODO add handler if already loaded
    $iframe.addEventListener('load', () => {
      $iframe.contentDocument.addEventListener('keydown', this._handler);
    });
    window.document.addEventListener('keydown', this._handler);
  }

  destroy = () => {
    this._$iframe.contentDocument &&
    this._$iframe.contentDocument.removeEventListener('keydown', this._handler);
    window.document.removeEventListener('keydown', this._handler);
  }

  current = () => this._pointer;
  total = () => this._history.length;

  push = (data) => {
    this._pointer++;
    this._history.length = this._pointer + 1; // Remove tail if we move back and push
    this._history[this._pointer] = data;
    // Shorten by size
    while (this._history.length > this._size) {
      this._history.shift();
      this._pointer--;
    }
  }

  forward = () => {
    if (this._pointer < this._history.length - 1) {
      this._pointer++;
      this.emit('change', this._history[this._pointer]);
    }
  }

  backward = () => {
    if (this._pointer > 0) {
      this._pointer--;
      this.emit('change', this._history[this._pointer]);
    }
  }

  _onKeyDown(e) {
    if (e.keyCode === 90 && e.metaKey) {
      // Check event from editro
      let t = e.target;
      while(t.parentNode) {
        if (t === this._$iframe.contentDocument.body || t === this._$iframe || t === this._root) {
          e.preventDefault();
          e.stopPropagation();
          if (e.shiftKey) {
            this.forward();
          } else {
            this.backward();
          }
          return;
        }
        t = t.parentNode;
      }
    }
  }

}
