class Toolbox {
  constructor(el, register, rootDomNode) {
    this.rootDomNode = rootDomNode;
    this.controllers = this.getControllers(el, register);
    this.render(rootDomNode);
  }

  getControllers(el, register) {
    const controllers = Object
      .getOwnPropertyNames(register.controllers)
      .map(name => register.controllers[name]);

    return controllers
      .filter(Controller => Controller.test(el))
      .map(Controller => new Controller(el));
  }

  render() {
    const controllerGroups = this.getControllerGroups(this.controllers);
    // ...
    Object
      .getOwnPropertyNames(controllerGroups)
      .forEach(key => {
        // ...
        controllerGroups[key].forEach(controller => groupRoot.appendChild(controller.getComponentNode()))
      })
    // ...
  }

  getControllerGroups(controllers) {
    const controllerGroups = {
      priority: [],
      basic: []
    };

    controllers.forEach(controller => controllerGroups[controller.getGroup()].push(controller));

    return controllerGroups;
  }

  destroy() {
    this.controllers.forEach(controller => controller.destroy());
    this.rootDomNode.innerHTML = '';
  }
}
