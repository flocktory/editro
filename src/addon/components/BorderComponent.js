const BaseCompositeComponent = require('./BaseCompositeComponent');
const { createDocumentFragment, emitDomEvent } = require('../../utils');
const Editro = require('../../Editro');


module.exports = class BorderComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => Editro.createComponent('InputComponent', this.value.oneValue[0], {
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
        component: () => Editro.createComponent('ColorComponent', this.value.oneValue[1], {
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
        component: () => Editro.createComponent('InputComponent', this.value.components[i][0], {
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
        component: () => Editro.createComponent('ColorComponent', this.value.components[i][1], {
          label: this.config.i18n(`${side} border color`),
          class: 'EditroToggler-more'
        }),
        onChange: value => {
          this.value.components[i][1] = value;
        }
      });
    });

    subComponents.push({
      component: () => Editro.createComponent('TogglerComponent', this.value.showComponents, {
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
    // update elements values from left to right
    const updateValues = (sourceNum, ...nums) => {
      const value = el(sourceNum).value;

      return nums.reduce((isChanged, currentNum) => {
        const current = el(currentNum);
        if (current.value !== value) {
          current.value = value;
          return true;
        }

        return isChanged;
      }, false);
    };

    const isChanged = this.value.showComponents ?
      updateValues(0, 8, 6, 4, 2) || updateValues(1, 9, 7, 5, 3) :
      updateValues(2, 0) || updateValues(3, 1);


    if (isChanged) {
      emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
    }
  }
};
