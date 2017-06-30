const shadowRegex = /(rgba?\([^)]+\))\s(-?\d+)px\s(-?\d+)px\s(-?\d+)px/;
const getValue = shadowStr => {
  let dx = 0;
  let dy = 0;
  let size = 0;
  let color = 'rgba(0, 0, 0, 0)';

  const match = shadowRegex.exec(shadowStr);
  if (match) {
    dx = match[2];
    dy = match[3];
    size = match[4];
    color = match[1];
  }

  return {dx, dy, size, color};
};


module.exports = function(Editro) {
  const { tags } = Editro;
  const { Controller, InputComponent, ColorComponent } = Editro.type;

  const enabledTags = [
    ...tags.input,
    ...tags.list,
    ...tags.definition,
    ...tags.block,
    ...tags.headers,
    ...tags.content,
    ...tags.form,
    'a'
  ];

  class BoxShadowController extends Controller {
    onElementSelected(el) {
      const enabled = enabledTags.includes(el.getTag());
      this.toggle(enabled);

      if (!enabled) {
        return;
      }

      this.el = el;

      this.node.innerHTML = '<h3 class="EditroController-title">Box shadow</h3>';

      this.value = getValue(el.getStyle('boxShadow'));

      [
        {
          attr: 'dx',
          component: InputComponent,
          label: 'X-offset'
        },
        {
          attr: 'dy',
          component: InputComponent,
          label: 'Y-offset'
        },
        {
          attr: 'size',
          component: InputComponent,
          label: 'Size'
        },
        {
          attr: 'color',
          component: ColorComponent,
          label: 'Color'
        }
      ].forEach(({attr, component, label}) => {
        const subComponent = new component(this.value[attr], {label, type: 'number'});

        subComponent.on('change', v => this.updateValue({[attr]: v}));
        this.node.appendChild(subComponent.el);
      });
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'style';
    }

    updateValue(update) {
      Object.assign(this.value, update);
      this.el.setStyle('box-shadow', `${this.value.dx}px ${this.value.dy}px ${this.value.size}px ${this.value.color}`);
    }
  }

  Editro.defineHelper('controllers', 'BoxShadowController', BoxShadowController);
};

