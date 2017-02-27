const EventEmitter = require('events');
const { createDocumentFragment } = require('../../utils');


module.exports = class Component extends EventEmitter {
  constructor(initialValue, config={}) {
    super();
    this.value = initialValue;
    this.config = config;
    this._listeners = [];
    this.on('change', newValue => {
      this.value = newValue;
    });
    this.render();
  }

  template() {
    return '';
  }

  render() {
    this.el = createDocumentFragment(this.template());
    if (this.config.class) {
      this.el.firstChild.classList.add(this.config.class);
    }
    this.watch();
  }

  watch() {}

  addListener(element, event, listener) {
    if (!element) {
      return;
    }

    element.addEventListener(event, listener);
    this._listeners.push({ element, event, listener });
  }

  destroy() {
    this._listeners.forEach(({ element, event, listener }) => element.removeEventListener(event, listener));
  }
};
