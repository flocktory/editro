const { px } = require('../../utils');

/* Text properties with modifiers available to edit in Editro */
const FONT_EDITABLE_PROPERTIES_WITH_MODIFIERS = [
  ['color'],
  ['textAlign'],
  ['fontWeight'],
  ['fontStyle'],
  ['fontSize', px],
  ['lineHeight', px],
  ['textTransform']
];

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

      const value = FONT_EDITABLE_PROPERTIES_WITH_MODIFIERS.reduce((styles, cssPropertyArr) => {
        const [cssProperty] = cssPropertyArr;
        styles[cssProperty] = this.el.getStyle(cssProperty);

        return styles;
      }, {});


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

    _onChange(cssValuesObject = {}) {
      FONT_EDITABLE_PROPERTIES_WITH_MODIFIERS.forEach(cssPropsMap => {
        const [cssProp, modifier] = cssPropsMap;
        const value = cssValuesObject[cssProp];

        if (value) {
          const shouldModified = modifier && typeof modifier === 'function';

          this.el.setStyle(cssProp, shouldModified ? modifier(value) : value);
        }
      });
    }
  }

  Editro.defineHelper('controllers', 'FontController', FontController);
};

