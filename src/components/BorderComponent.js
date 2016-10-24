import BaseCompositeComponent from './BaseCompositeComponent';
import InputComponent from './InputComponent';
import ColorComponent from './ColorComponent';
import TogglerComponent from './TogglerComponent';
import { createDocumentFragment, emitDomEvent } from '../utils';


export default class BorderComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new InputComponent(this.value.oneValue[0], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Border width'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue[0] = value;
        }
      },
      {
        component: () => new ColorComponent(this.value.oneValue[1], {
          label: this.config.i18n('Border color'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue[1] = value;
        }
      }
    ];

    ['Top', 'Right', 'Bottom', 'Left'].forEach((side, i) => {
      subComponents.push({
        component: () => new InputComponent(this.value.components[i][0], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n(`${side} border width`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][0] = value;
        }
      });
      subComponents.push({
        component: () => new ColorComponent(this.value.components[i][1], {
          label: this.config.i18n(`${side} border color`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][1] = value;
        }
      });
    });

    subComponents.push({
      component: () => new TogglerComponent(this.value.showComponents, {
        label: this.config.i18n('expand')
      }),
      onChange: value => {
        this.value.showComponents = value;
        this.toggle();
      }
    });

    return subComponents;
  }

  render() {
    super.render();

    const newEl = createDocumentFragment('<div class="EditroToggler EditroToggler--full"></div>');
    this.toggler = newEl.firstChild;
    this.toggler.appendChild(this.el);
    this.el = newEl;

    this.toggle();
  }

  toggle() {
    this.toggler.setAttribute('collapsed', String(!this.value.showComponents));

    const el = i => this.toggler.children[i].querySelector('input') || document.createElement('input');

    if (this.value.showComponents) {
      el(2).value = el(4).value = el(6).value = el(8).value = el(0).value;
      el(3).value = el(5).value = el(7).value = el(9).value = el(1).value;
    } else {
      el(0).value = el(2).value;
      el(1).value = el(3).value;
    }

    emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
  }
}
