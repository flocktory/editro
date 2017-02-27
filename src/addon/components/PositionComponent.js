const BaseCompositeComponent = require('./BaseCompositeComponent');
const Editro = require('../../Editro');


module.exports = class PositionComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => Editro.createComponent('SelectComponent', this.value.position, {
          choices: [
            ['static', 'static'],
            ['relative', 'relative'],
            ['absolute', 'absolute'],
            ['fixed', 'fixed']
          ],
          label: this.config.i18n('Type of positioning')
        }),
        onChange: position => {
          this.value.position = position;
        }
      },
      {
        component: () => Editro.createComponent('TBLRComponent', this.value, {
          arrowDirection: 'in',
          shapes: {
            inner: 'real',
            outer: 'real'
          },
          label: this.config.i18n('Offset relative to the container')
        }),
        onChange: value => {
          this.value.top = value.top;
          this.value.bottom = value.bottom;
          this.value.left = value.left;
          this.value.right = value.right;
        }
      }
    ];
  }
};
