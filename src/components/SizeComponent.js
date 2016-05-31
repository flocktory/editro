import BaseCompositeComponent from './BaseCompositeComponent';
import IconRadioGroupComponent from './IconRadioGroupComponent';
import WidthHeightComponent from './WidthHeightComponent';


export default class PositionComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new IconRadioGroupComponent(this.value.float, {
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
        }),
        onChange: float => this.value.float = float
      },
      {
        component: () => new WidthHeightComponent(this.value),
        onChange: value => {
          this.value.width = value.width;
          this.value.height = value.height;
        }
      }
    ];
  }
}
