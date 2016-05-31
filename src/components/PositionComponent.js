import BaseCompositeComponent from './BaseCompositeComponent';
import SelectComponent from './SelectComponent';
import TBLRComponent from './TBLRComponent';


export default class PositionComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new SelectComponent(this.value.position, {
          choices: [
            ['static', 'static'],
            ['relative', 'relative'],
            ['absolute', 'absolute'],
            ['fixed', 'fixed']
          ]
        }),
        onChange: position =>  this.value.position = position
      },
      {
        component: () => new TBLRComponent(this.value, {
          arrowDirection: 'in',
          shapes: {
            inner: 'real',
            outer: 'real'
          }
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
}
