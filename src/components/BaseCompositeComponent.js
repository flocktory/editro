import Component from '../Component';


export default class BaseCompositeComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    this.getSubComponentsFactories().forEach(({component, onChange}) => {
      const componentInstance = component();

      componentInstance.on('change', data => {
        onChange(data);
        this.emit('change', this.value);
      });

      this.el.appendChild(componentInstance.el);
    });
  }

  /**
   * @returns {Array} {component: () => new Component(...), onChange: () => {}}
   */
  getSubComponentsFactories() {
    return [];
  }
}
