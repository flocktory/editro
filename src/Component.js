import EventEmitter from 'events';
import {createDocumentFragment} from './utils';


export default class Component extends EventEmitter {
  constructor(initialValue, config={}) {
    super();
    this.value = initialValue;
    this.config = config;
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

  destroy() {}
}
