import Component from '../Component';
import IconRadioGroupComponent from './IconRadioGroupComponent';
import WidthHeightComponent from './WidthHeightComponent';


export default class PositionComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    [
      this.getFloatComponent(),
      this.getWidthHeightComponent()
    ].forEach(component => {
      this.el.appendChild(component.el);
    });
  }

  collect() {
    this.emit('change', this.value);
  }

  getFloatComponent() {
    const component = new IconRadioGroupComponent(this.value.float, {
      position: 'right',
      items: [
        {
          value: 'none',
          icon: 'fln'
        },
        {
          value: 'left',
          icon: 'fll'
        },
        {
          value: 'right',
          icon: 'flr'
        }
      ]
    });

    component.on('change', float => {
      this.value.float = float;
      this.collect();
    });

    return component;
  }

  getWidthHeightComponent() {
    const component = new WidthHeightComponent(this.value);

    component.on('change', value => {
      this.value.width = value.width;
      this.value.height = value.height;
      this.collect();
    });

    return component;
  }
}
