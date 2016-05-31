import Component from '../Component';
import BaseCompositeComponent from './BaseCompositeComponent';
import IconRadioGroupComponent from './IconRadioGroupComponent';
import ColorComponent from './ColorComponent';
import ColorPlaceholderComponent from './ColorPlaceholderComponent';
import ImageComponent from './ImageComponent';
import {createDocumentFragment} from '../utils';


const visibleIf = isVisible => isVisible ? 'inline-block' : 'none';


class BackgroundColorComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ColorComponent(this.value.color1),
        onChange: color => this.value.color1 = color
      },
      {
        component: () => new ColorPlaceholderComponent(),
        onChange: () => this.value.hasGradient = true
      },
      {
        component: () => new ColorComponent(this.value.color2),
        onChange: color => this.value.color2 = color
      },
      {
        component: () => new IconRadioGroupComponent(this.value.gradientDirection, {
          items: [
            {
              value: 'to right',
              icon: 'gradr'
            },
            {
              value: 'to right bottom',
              icon: 'gradbr'
            },
            {
              value: 'to bottom',
              icon: 'gradb'
            },
            {
              value: 'to left bottom',
              icon: 'gradbl'
            }
          ]
        }),
        onChange: backgroundSize => this.value.gradientDirection = backgroundSize
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
        component: () => new ImageComponent(this.value.backgroundImage),
        onChange: image => this.value.backgroundImage = image
      },
      {
        component: () => new IconRadioGroupComponent(this.value.backgroundSize, {
          items: [
            {
              value: 'auto',
              icon: 'bgsn'
            },
            {
              value: 'cover',
              icon: 'bgscov'
            },
            {
              value: 'contain',
              icon: 'bgscon'
            }
          ]
        }),
        onChange: backgroundSize => this.value.backgroundSize = backgroundSize
      },
      {
        component: () => new IconRadioGroupComponent(this.value.backgroundPosition, {
          items: [
            {
              value: '0 0',
              icon: 'bgptl'
            },
            {
              value: '100% 0',
              icon: 'bgptr'
            },
            {
              value: '0 100%',
              icon: 'bgpbl'
            },
            {
              value: '100% 100%',
              icon: 'bgpbr'
            },
            {
              value: '50% 50%',
              icon: 'bgpc'
            }
          ]
        }),
        onChange: backgroundPosition => this.value.backgroundPosition = backgroundPosition
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


export default class BackgroundComponent extends Component {
  render() {
    this.el = createDocumentFragment(`<div class="EditroSubForm"></div><div class="EditroSubForm"></div>`);
    ([
      new BackgroundColorComponent(this.value),
      new BackgroundImageComponent(this.value)
    ]).forEach((component, i) => {
      component.on('change', value => {
        this.emit('change', value);
      });

      this.el.children[i].appendChild(component.el);
    });
  }

  get isInline() {
    return true;
  }
}
