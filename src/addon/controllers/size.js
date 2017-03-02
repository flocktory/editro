const { px } = require('../../utils');

module.exports = function(Editro) {
  const { tags, type: { Controller } } = Editro;

  class Size extends Controller {
    constructor(editro) {
      super(editro);
      this.editro = editro;
    }

    onElementSelected(el) {
      this.el = el;
      const enabled = !tags.system.includes(el.getTag());
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Size</h3>';

      this.component = Editro.createComponent('SizeComponent', this._getValue(el), {
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

    _onChange(el, { width, height, float }) {
      el.setStyle('width', px(width));
      el.setStyle('height', px(height));
      el.setStyle('float', float);
    }

    _getValue(el) {
      return el.getStyles(['width', 'heigth', 'float']);
    }
  }

  Editro.defineHelper('controllers', 'Size', Size);
};
