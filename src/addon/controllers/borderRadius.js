const { combination, num, px } = require('../../utils');

const sides = ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'];

module.exports = function(Editro) {
  const { tags, type: { Controller, BorderRadiusComponent } } = Editro;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  class BorderRadius extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }


      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Border radius</h3>';

      this.component = new BorderRadiusComponent(this._getValue(el), {
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
        sides.forEach((position, i) => {
          el.setStyle(`border${position}Radius`, px(value.components[i]));
        });
      } else {
        el.setStyle('borderRadius', px(value.oneValue));
      }
    }

    _getValue(el) {
      const computedStyle = el.getStyles(sides.map(s => 'border' + s + 'Radius'));
      const components = sides.map(position =>
        num(computedStyle[`border${position}Radius`]));

      // TODO refactor .some
      const showComponents = components.reduce(
        (condition, rad, i) => condition || (i ? components[i] !== components[i - 1] : false),
        false
      );

      return {
        oneValue: components[0],
        showComponents,
        components
      };
    }
  }

  Editro.defineHelper('controllers', 'BorderRadius', BorderRadius);
};
