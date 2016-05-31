import EventEmitter from 'events';


/**
 * Controller must be a class or an object with two static methods (`test` & `create`)
 *   `test` returns true, if element could be customized via controller
 *   `create` returns instance of controller with next properties:
 *     `node` — dom node of controller component, required
 *     `destroy` — destroy callback, required
 *     `group` — name of group in toolbox, optional
 *     `title` — title in toolbox, optional
 */
export default class Controller extends EventEmitter {
  static test(el) {
    return false;
  }

  static create(...params) {
    return new this(...params);
  }

  constructor(el, { i18n }) {
    super();
    this.i18n = i18n;
    this.el = el;
    this.component = this.createComponent(this.normalize(this.get()));
    this.component.on('change', newValue => {
      this.set(this.normalize(newValue));
      this.emit('change');
    });
  }

  createComponent(value) {}

  get() {}

  set() {}

  normalize(value) {
    return value;
  }

  get node() {
    return this.component.el;
  }

  get group() {
    return 'basic';
  }

  get modificators() {
    return [];
  }

  destroy() {
    this.component.destroy();
  }
}
