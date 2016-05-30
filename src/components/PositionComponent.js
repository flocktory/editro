import Component from '../Component';
import SelectComponent from './SelectComponent';
import TBLRComponent from './TBLRComponent';


export default class PositionComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    [
      this.getPositionComponent(),
      this.getCoordinatsComponent()
    ].forEach(component => {
      this.el.appendChild(component.el);
    });
  }

  collect() {
    this.emit('change', this.value);
  }

  getPositionComponent() {
    const component = new SelectComponent(this.value.position, {
      choices: [
        ['static', 'static'],
        ['relative', 'relative'],
        ['absolute', 'absolute'],
        ['fixed', 'fixed']
      ]
    });

    component.on('change', position => {
      this.value.position = position;
      this.collect();
    });

    return component;
  }

  getCoordinatsComponent() {
    const component = new TBLRComponent(this.value, {
      arrowDirection: 'in',
      shapes: {
        inner: 'real',
        outer: 'real'
      }
    });

    component.on('change', value => {
      this.value.top = value.top;
      this.value.bottom = value.bottom;
      this.value.left = value.left;
      this.value.right = value.right;
      this.collect();
    });

    return component;
  }
}
