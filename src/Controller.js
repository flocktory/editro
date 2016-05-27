import EventEmitter from 'events';


/**
 * Controller must be a class or an object with two static methods (`test` & `create`)
 *   `test` returns true, if element could be customized via controller
 *   `create` returns instance of controller with next properties:
 *     `node` — dom node of controller component, required
 *     `group` — name of group in toolbox, optional
 *     `title` — title in toolbox, optional
 */
export default class Controller extends EventEmitter {
  static test(el) {
    return false;
  }

  static create(el) {
    return new this(el);
  }

  constructor(el) {
    super();
    this.el = el;
    this.component = this.createComponent(this.get());
    this.component.on('change', newValue => {
      this.set(newValue);
      this.emit('change');
    });
  }

  createComponent(value) {}

  get() {}

  set() {}

  get node() {
    return this.component.el;
  }

  get group() {
    return 'basic';
  }
}
