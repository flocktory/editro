import {createDocumentFragment} from './utils';


export default class Toolbox {
  constructor(el, {controllers, root}) {
    this.root = root;
    this.controllers = this.getControllers(el, controllers);
    this.render();
  }

  getControllers(el, controllers) {
    return controllers
      .filter(Controller => Controller.test(el))
      .map(Controller => Controller.create(el));
  }

  render() {
    const panel = createDocumentFragment(`<section class="EditroPanel"></section>`);

    // Render groups
    this.getControllerGroups(this.controllers).forEach(controllers => {
      const group = createDocumentFragment(`<div class="EditroPanel-section"></div>`);

      // Render components in group
      controllers.forEach(controller => {
        if (!controller.node) {
          return;
        }

        const isInline = controller.component && controller.component.isInline;

        const form = createDocumentFragment(`<article class="EditroForm ${(controller.modificators || []).map(m => `EditroForm--${m}`).join(' ')}">
          <div class="EditroForm-title">${controller.title}</div>
          <div class="EditroForm-controls ${isInline ? 'EditroForm-controls--inline' : ''}" editoro-controls></div>
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
    const basicGroup = 'basic';

    controllers.forEach(controller => {
      const group = controller.group || basicGroup;

      controllerGroups[group] = controllerGroups[group] || [];
      controllerGroups[group].push(controller)
    });

    // Basic group at the end of list
    return Object
      .getOwnPropertyNames(controllerGroups)
      .map(key => [key, controllerGroups[key]])
      .sort((a, b) => a[0] === basicGroup && b[0] !== basicGroup ? 1 : 0)
      .map(item => item[1]);
  }

  destroy() {
    this.controllers.forEach(controller => controller.destroy());
    this.root.innerHTML = '';
  }
}
