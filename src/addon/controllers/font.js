const { px } = require('../../utils');

module.exports = function(Editro) {
  const { tags } = Editro;
  const { Controller, FontComponent } = Editro.type;

  const enabledTags = [
    ...tags.input,
    ...tags.inline,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form
  ];

  class FontController extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      this.el = el;
      if (this.select) {
        this.select.removeAllListeners('change');
        this.node.innerHTML = '';
        this.select.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Font</h3>';

      const value = {
        color: this.el.getStyle('color'),
        textAlign: this.el.getStyle('textAlign'),
        fontWeight: this.el.getStyle('fontWeight'),
        fontStyle: this.el.getStyle('fontStyle'),
        lineHeight: this.el.getStyle('lineHeight')
     };

      this.select = new FontComponent(value, {
        i18n: this.editro.i18n
      });
      this.select.on('change', v => this._onChange(v));

      this.node.appendChild(this.select.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'style';
    }

    _onChange({ textAlign, fontWeight, fontStyle, fontSize, lineHeight, color }) {
      this.el.setStyle('color', color);
      this.el.setStyle('textAlign', textAlign);
      this.el.setStyle('fontWeight', fontWeight);
      this.el.setStyle('fontStyle', fontStyle);
      this.el.setStyle('lineHeight', px(lineHeight));
      this.el.setStyle('fontSize', px(fontSize));
    }
  }

  Editro.defineHelper('controllers', 'FontController', FontController);
};

