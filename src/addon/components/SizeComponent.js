const BaseCompositeComponent = require('./BaseCompositeComponent');
const Editro = require('../../Editro');


module.exports = class SizeComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => Editro.createComponent('WidthHeightComponent', this.value, {
          label: this.config.i18n('Dimensions')
        }),
        onChange: value => {
          this.value.width = value.width;
          this.value.height = value.height;
        }
      },
      {
        component: () => Editro.createComponent('SelectComponent', this.value.float, {
          choices: ['none', 'left', 'right'].map(item => [item, this.config.i18n(item)]),
          label: this.config.i18n('Floating')
        }),
        onChange: float => {
          this.value.float = float;
        }
      }
    ];
  }
};
