const { combination, num, px } = require('../../utils');

module.exports = function(Editro) {
  const { types: { Controller, BorderComponent } } = Editro;

  class Border extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;

      this.node = document.createElement('div');
      this.node.classList.add('EditroController');
    }

    onElementSelected(el) {
      this.el = el;

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Border</h3>';

      this.component = new BorderComponent(this._getValue(el), {
        i18n: a => a
      });

      this.component.on('change', v => this._onChange(el, v));
      this.node.appendChild(this.component.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'settings';
    }

    _onChange(el, value) {
      if (value.showComponents) {
        const sides = ['Top', 'Right', 'Bottom', 'Left'];
        sides.forEach((s, i) => {
          el.setStyle('border' + s + 'Width', px(value.components[i][0]));
          el.setStyle('border' + s + 'Color', value.components[i][1]);
        });
      } else {
        el.setStyle('borderWidth', px(value.oneValue[0]));
        el.setStyle('borderColor', value.oneValue[1]);
      }
      el.setStyle('borderStyle', 'solid');
    }

    _getValue(el) {
      const requiredProps = combination(['Top', 'Right', 'Bottom', 'Left'], ['Width', 'Color'])
        .map(c => 'border' + c.join(''));
      const computedStyle = el.getStyles(requiredProps);
      const components = ['Top', 'Right', 'Bottom', 'Left'].map(position =>
        ['Width', 'Color'].map((prop, i) =>
          i ? computedStyle[`border${position}${prop}`] : num(computedStyle[`border${position}${prop}`])));
      const showComponents = components.reduce(
        (condition, rad, i) => condition ||
          (i ? components[i][0] !== components[i - 1][0] || components[i][1] !== components[i - 1][1] : false),
        false
      );

      return {
        oneValue: components[0].slice(),
        showComponents,
        components
      };
    }
  }

  Editro.defineHelper('controllers', 'Border', Border);
};
