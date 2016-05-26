import EventEmitter from 'events';
import system from './system';


function Controller(config) {
  const test = config.test || (() => false);
  const createComponent = config.createComponent || (el => EmptyComponent.create(el));
  const get = config.get || (() => null);
  const set = config.createComponent || (() => {});

  return {
    test,
    create(el) {
      const events = new EventEmitter();
      const component = createComponent(get(el));

      component.on('change', newValue => {
        set(el, newValue);
        events.emit('change');
      });
      events.component = component;

      return events;
    }
  }
}


const FontSizeController = Controller({
  test(el) {
    return el.tagName === 'SPAN';
  },

  createComponent(value) {
    return new system.get('component', 'input')(value);
  },

  get(el) {
    return window.getComputedStyle(el).fontSize;
  },

  set(el, value) {
    el.style.fontSize = value;
  }
});


function Component(config) {
  const template = config.template || (value => `<span>${value}</span>`);
  const watch = config.watch || (() => {});

  return {
    create(value) {
      const events = new EventEmitter();
      const el = document.createRange().createContextualFragment(template(value));

      watch(el, events);
      events.el = el;
      events.value = value;
      events.on('change', newValue => events.value = newValue);

      return events;
    }
  }
}


const InputComponent = Component({
  template(value) {
    return `<input class="SexyInput" type="text" value="${value}" />`;
  },

  watch(el, events) {
    const input = el.querySelector('input');

    input.addEventListener('keyup', () => {
      events.emit('change', input.value);
    });
  }
});


system.register('controller', 'font-size', FontSizeController);
system.register('component', 'input', InputComponent);


system.onElementSelected = el => {
  const controllers = system.all('controller')
    .filter(controller => controller.test(el))
    .forEach(controller => controller.create(el));

  system.renderToolbar(controllers.map(controller => controller.component))
};
