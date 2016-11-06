const { num, px } = require('../../utils');
const directions = ['top', 'bottom', 'left', 'right'];

const getStyleName = (prefix, direction) =>
  prefix ? prefix + direction[0].toUpperCase() + direction.slice(1) : direction;

module.exports = function(Editro) {
  const { tags, type: { Controller, TBLRComponent, PositionComponent } } = Editro;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form,
    ...tags.embedded
  ];

  class BaseTBLRController extends Controller {
    constructor(editro) {
      super(editro);

      this.i18n = a => a;
    }

    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      this.el = el;

      if (this.component) {
        this.component.removeAllListeners('change');
        this.component.destroy();
      }

      this.node.innerHTML = `<h3 class="EditroController-title">${this.title}</h3>`;

      this.component = this.createComponent(this.normalize(this.get()), {
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

    get() {
      const value = {};

      directions.forEach(direction => {
        value[direction] = this.el.getStyle(getStyleName(this.stylesPrefix, direction));
      });

      return value;
    }

    normalize(value) {
      const result = Object.assign({}, value);

      directions.forEach(direction => {
        result[direction] = num(result[direction]);
      });

      return result;
    }

    _onChange(el, value) {
      directions.forEach(direction => {
        el.setStyle(getStyleName(this.stylesPrefix, direction), px(value[direction]));
      });
    }
  }

  class Margin extends BaseTBLRController {
    get stylesPrefix() {
      return 'margin';
    }

    createComponent(value) {
      return new TBLRComponent(value, {
        arrowDirection: 'out',
        shapes: {
          inner: 'real',
          outer: 'imag'
        },
        label: this.i18n('Space between element and others')
      });
    }

    get title() {
      return 'Margin';
    }
  }

  class Padding extends BaseTBLRController {
    get stylesPrefix() {
      return 'padding';
    }

    createComponent(value) {
      return new TBLRComponent(value, {
        arrowDirection: 'in',
        shapes: {
          inner: 'imag',
          outer: 'real'
        },
        label: this.i18n('Space between borders and content')
      });
    }

    get title() {
      return 'Padding';
    }
  }

  class Position extends BaseTBLRController {
    createComponent(value) {
      return new PositionComponent(value, {
        i18n: this.i18n
      });
    }

    get() {
      const value = super.get();
      value.position = this.el.getStyle('position');
      return value;
    }

    set(value) {
      super.set(value);

      this.el.setStyle('position', value.position);
    }

    normalize(value) {
      const normalizedValue = super.normalize(value);

      if (['static', 'relative', 'absolute', 'fixed'].indexOf(normalizedValue.position) === -1) {
        normalizedValue.position = 'static';
      }

      return normalizedValue;
    }

    _onChange(el, value) {
      directions.forEach(direction => {
        el.setStyle(getStyleName(this.stylesPrefix, direction), px(value[direction]));
      });
      el.setStyle('position', value.position);
    }

    get title() {
      return 'Position';
    }
  }


  Editro.defineHelper('controllers', 'Margin', Margin);
  Editro.defineHelper('controllers', 'Padding', Padding);
  Editro.defineHelper('controllers', 'Position', Position);
};
