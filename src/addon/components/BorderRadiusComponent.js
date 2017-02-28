const BaseCompositeComponent = require('./BaseCompositeComponent');
const { createDocumentFragment, emitDomEvent } = require('../../utils');
const Editro = require('../../Editro');


module.exports = class BorderRadiusComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    const subComponents = [
      {
        component: () => Editro.createComponent('InputComponent', this.value.oneValue, {
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
        component: () => Editro.createComponent('InputComponent', this.value.components[i], {
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
      updateValues(0, 4, 3, 2, 1) :
      updateValues(1, 0);


    if (isChanged) {
      emitDomEvent(this.toggler.querySelectorAll('input'), 'change');
    }
  }
};
