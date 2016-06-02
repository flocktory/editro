import BaseCompositeComponent from './BaseCompositeComponent';
import SelectComponent from './SelectComponent';
import WidthHeightComponent from './WidthHeightComponent';


export default class PositionComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new WidthHeightComponent(this.value, {
          label: this.config.i18n('Dimensions')
        }),
        onChange: value => {
          this.value.width = value.width;
          this.value.height = value.height;
        }
      },
      {
        component: () => new SelectComponent(this.value.float, {
          choices: ['none', 'left', 'right'].map(item => [item, this.config.i18n(item)]),
          label: this.config.i18n('Floating')
        }),
        onChange: float => {
          this.value.float = float;
        }
      }
    ];
  }
}
