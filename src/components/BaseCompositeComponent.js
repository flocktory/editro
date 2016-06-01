import Component from '../Component';


export default class BaseCompositeComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    this.components = this.getSubComponentsFactories().map(({component, onChange}) => {
      const componentInstance = component();

      componentInstance.on('change', data => {
        onChange(data);
        this.emit('change', this.value);
      });

      this.el.appendChild(componentInstance.el);

      return componentInstance;
    });
  }

  /**
   * @returns {Array} {component: () => new Component(...), onChange: () => {}}
   */
  getSubComponentsFactories() {
    return [];
  }

  destroy() {
    this.components.forEach(component => component.destroy());
  }
}
