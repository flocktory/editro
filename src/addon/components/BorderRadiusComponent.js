import BaseCompositeComponent from './BaseCompositeComponent';
import InputComponent from './InputComponent';
import TogglerComponent from './TogglerComponent';
import { createDocumentFragment, emitDomEvent } from '../../utils';


module.exports = class BorderRadiusComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => new InputComponent(this.value.oneValue, {
          type: 'number',
          unit: 'px',
          label: this.config.i18n('Border radius'),
          class: 'EditroToggler-less'
        }),
        onChange: value => {
          this.value.oneValue = value;
        }
      }
    ];

    ['Top right', 'Bottom right', 'Bottom left', 'Top left'].forEach((corner, i) => {
      subComponents.push({
        component: () => new InputComponent(this.value.components[i], {
          type: 'number',
          unit: 'px',
          label: this.config.i18n(`${corner} border radius`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i] = value;
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

    const element = i => this.toggler.children[i].querySelector('input') || document.createElement('input');

    if (this.value.showComponents) {
      element(1).value = element(2).value = element(3).value = element(4).value = element(0).value;
    } else {
      element(0).value = element(1).value;
    }

    emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
  }
}
