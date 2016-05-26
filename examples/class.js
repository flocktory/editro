import EventEmitter from 'events';
import system from './system';


class Controller extends EventEmitter {
  static test(el) {
    return false;
  }

  constructor(el) {
    this.el = el;
    this.component = this.createComponent(this.get());
    this.component.on('change', newValue => {
      this.set(newValue);
      this.emit('change');
    });
  }

  createComponent() {}

  get() {}

  set() {}
}


class FontSizeController extends Controller {
  static test(el) {
    return el.tagName === 'SPAN';
  }

  createComponent(value) {
    return new system.get('component', 'input')(value);
  }

  get() {
    return window.getComputedStyle(this.el).fontSize;
  }

  set(value) {
    this.el.style.fontSize = value;
  }
}


class Component extends EventEmitter {
  constructor(initialValue) {
    this.value = initialValue;
    this.on('change', newValue => this.value = newValue);
    this.render();
  }

  template() {
    return ``;
  }

  render() {
    this.el = document.createRange().createContextualFragment(this.template());
    this.watch();
  }

  watch() {}
}


class InputComponent extends Component {
  template() {
    return `<input class="SexyInput" type="text" value="${this.value}" />`;
  }

  watch() {
    const input = this.el.querySelector('input');

    input.addEventListener('keyup', () => {
      this.emit('change', input.value);
    });
  }
}


system.register('controller', 'font-size', FontSizeController);
system.register('component', 'input', InputComponent);


system.onElementSelected = el => {
  const controllers = system.all('controller')
    .filter(Controller => Controller.test(el))
    .forEach(Controller => new Controller(el));

  system.renderToolbar(controllers.map(controller => controller.component))
};
