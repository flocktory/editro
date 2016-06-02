import EventEmitter from 'events';
import {createDocumentFragment} from './utils';


const basicGroup = 'basic';
const actionsGroup = 'actions';


export default class Toolbox extends EventEmitter {
  /**
   * Toolbox constructor
   * @param {Element} el current edited DOM node
   * @param {Object} options
   * @param {Array} optionsi.controllers list of controllers to use
   * @param {Element} options.root element to render toobox in
   * @param {Function} options.i18n translation function, return localized string by key
   * @returns {undefined}
   */
  constructor(el, { controllers, root, i18n }) {
    super();
    this.i18n = i18n;
    this.root = root;
    this.controllers = this.getControllers(el, controllers);
    this.controllers.forEach(controller => controller.on && controller.on('select-element', el => this.emit('select-element', el)));
    this.render();
  }

  getControllers(el, controllers) {
    return controllers
      .filter(Controller => Controller.test(el))
      .map(Controller => Controller.create(el, { i18n: this.i18n }));
  }

  render() {
    const panel = createDocumentFragment('<section class="EditroPanel"></section>');

    // Render groups
    this.getControllerGroups(this.controllers).forEach(([groupName, controllers]) => {
      const group = createDocumentFragment(`<div class="EditroPanel-section"></div>`);

      // Render components in group
      controllers.forEach(controller => {
        if (!controller.node) {
          return;
        }

        const form = createDocumentFragment(groupName === actionsGroup ? `<span editoro-controls></span>` : `<article class="EditroForm">
          <div class="EditroForm-title">${controller.title}</div>
          <div class="EditroForm-controls" editoro-controls></div>
        </article>`);

        form.querySelector('[editoro-controls]').appendChild(controller.node);
        group.firstChild.appendChild(form);
      });

      panel.firstChild.appendChild(group);
    });

    this.root.appendChild(panel);
  }

  getControllerGroups(controllers) {
    const controllerGroups = {};

    controllers.forEach(controller => {
      const group = controller.group || basicGroup;

      controllerGroups[group] = controllerGroups[group] || [];
      controllerGroups[group].push(controller)
    });

    // Basic group at the end of list
    return Object
      .getOwnPropertyNames(controllerGroups)
      .map(key => [key, controllerGroups[key]])
      .sort((itemLeft, itemRight) =>
        itemLeft[0] === actionsGroup && itemRight[0] !== actionsGroup ? 0 :
        (itemLeft[0] === basicGroup && itemRight[0] !== basicGroup ? 1 : 0));
  }

  destroy() {
    this.controllers.forEach(controller => controller.destroy());
    this.root.innerHTML = '';
  }
}
