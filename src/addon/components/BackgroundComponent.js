const Component = require('./Component');
const BaseCompositeComponent = require('./BaseCompositeComponent');
const SelectComponent = require('./SelectComponent');
const ColorComponent = require('./ColorComponent');
const ColorPlaceholderComponent = require('./ColorPlaceholderComponent');
const ImageComponent = require('./ImageComponent');
const { createDocumentFragment } = require('../../utils');


const visibleIf = isVisible => isVisible ? 'flex' : 'none';


class BackgroundColorComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ColorComponent(this.value.color1, {
          label: this.config.i18n('Main background color')
        }),
        onChange: color => {
          this.value.color1 = color;
        }
      },
      {
        component: () => new ColorPlaceholderComponent(null, {
          label: this.config.i18n('Second background color')
        }),
        onChange: () => {
          this.value.hasGradient = true;
        }
      },
      {
        component: () => new ColorComponent(this.value.color2, {
          label: this.config.i18n('Second background color')
        }),
        onChange: color => {
          this.value.color2 = color;
        }
      },
      {
        component: () => new SelectComponent(this.value.gradientDirection, {
          choices: ['to right', 'to right bottom', 'to bottom', 'to left bottom'].map(grad => [grad, this.config.i18n(grad)]),
          label: this.config.i18n('Gradient direction')
        }),
        onChange: gradientDirection => {
          this.value.gradientDirection = gradientDirection;
        }
      }
    ];
  }

  render() {
    super.render();

    const toggler = this.el.children[1];
    const color2 = this.el.children[2];
    const gradient = this.el.children[3];
    const toggle = () => {
      toggler.style.display = visibleIf(!this.value.hasGradient);
      color2.style.display = visibleIf(this.value.hasGradient);
      gradient.style.display = visibleIf(this.value.hasGradient);
    };

    toggle(this.value.hasGradient);
    this.on('change', toggle);
  }
}


class BackgroundImageComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ImageComponent(this.value.backgroundImage, {
          label: this.config.i18n('Background image'),
          upload: this.config.upload,
          current: this.value.backgroundImage
        }),
        onChange: image => {
          this.value.backgroundImage = image;
        }
      },
      {
        component: () => new SelectComponent(this.value.backgroundSize, {
          choices: ['auto', 'cover', 'contain'].map(bgSize => [bgSize, this.config.i18n(bgSize)]),
          label: this.config.i18n('Background size')
        }),
        onChange: backgroundSize => {
          this.value.backgroundSize = backgroundSize;
        }
      },
      {
        component: () => new SelectComponent(this.value.backgroundPosition, {
          choices: [
            ['0 0', this.config.i18n('Top left corner')],
            ['100% 0', this.config.i18n('Top right corner')],
            ['0 100%', this.config.i18n('Bottom left corner')],
            ['100% 100%', this.config.i18n('Bottom right corner')],
            ['50% 50%', this.config.i18n('Center')]
          ],
          label: this.config.i18n('Background position')
        }),
        onChange: backgroundPosition => {
          this.value.backgroundPosition = backgroundPosition;
        }
      }
    ];
  }

  render() {
    super.render();

    const size = this.el.children[1];
    const position = this.el.children[2];
    const toggle = () => {
      size.style.display = visibleIf(this.value.backgroundImage);
      position.style.display = visibleIf(this.value.backgroundImage);
    };

    toggle(this.value.backgroundImage);
    this.on('change', toggle);
  }
}


module.exports = class BackgroundComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();
    ([
      new BackgroundColorComponent(this.value, {
        i18n: this.config.i18n
      }),
      new BackgroundImageComponent(this.value, {
        i18n: this.config.i18n,
        upload: this.config.upload
      })
    ]).forEach(component => {
      component.on('change', value => {
        this.emit('change', value);
      });

      this.el.appendChild(component.el);
    });
  }
};
