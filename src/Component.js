import EventEmitter from 'events';
import {createDocumentFragment} from './utils';


export default class Component extends EventEmitter {
  constructor(initialValue, config={}) {
    super();
    this.value = initialValue;
    this.config = config;
    this._listeners = [];
    this.on('change', newValue => this.value = newValue);
    this.render();
  }

  template() {
    return ``;
  }

  render() {
    this.el = createDocumentFragment(this.template());
    this.watch();
  }

  watch() {}

  addListener(element, event, listener) {
    if (!element) {
      return;
    }

    element.addEventListener(event, listener);
    this._listeners.push({element, event, listener});
  }

  destroy() {
    this._listeners.forEach(({element, event, listener}) => element.removeEventListener(event, listener));
  }
}
