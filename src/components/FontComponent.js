import Component from '../Component';
import IconRadioGroupComponent from './IconRadioGroupComponent';
import InputComponent from './InputComponent';
import ColorComponent from './ColorComponent';


const textAligns = [
  {
    value: 'left',
    icon: 'tal'
  },
  {
    value: 'center',
    icon: 'tac'
  },
  {
    value: 'right',
    icon: 'tar'
  }
];
const styleAndWeights = [
  {
    value: 'normal normal',
    icon: 'fwn'
  },
  {
    value: 'bold normal',
    icon: 'fwb'
  },
  {
    value: 'normal italic',
    icon: 'fsi'
  },
  {
    value: 'bold italic',
    icon: 'fwbfsi'
  }
];


export default class FontComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();
    [
      this.getColorComponent(),
      this.getFontSizeComponent(),
      this.getLineHeightComponent(),
      this.getTextAlignComponent(),
      this.getStyleAndWeightComponent()
    ].forEach(component => {
      this.el.appendChild(component.el);
    });
  }

  collect() {
    this.emit('change', this.value);
  }

  getColorComponent() {
    const component = new ColorComponent(this.value.color);

    component.on('change', color => {
      this.value.color = color;
      this.collect();
    });

    return component;
  }

  getFontSizeComponent() {
    const component = new InputComponent(this.value.fontSize, {
      type: 'number',
      unit: 'px',
      icon: 'fz'
    });

    component.on('change', fontSize => {
      this.value.fontSize = fontSize;
      this.collect();
    });

    return component;
  }

  getLineHeightComponent() {
    const component = new InputComponent(this.value.lineHeight, {
      type: 'number',
      icon: 'lh',
      unit: 'px'
    });

    component.on('change', lineHeight => {
      this.value.lineHeight = lineHeight;
      this.collect();
    });

    return component;
  }

  getTextAlignComponent() {
    const isInitialValueAllowed = !!textAligns.find(i => i.value === this.value.textAlign);
    const initialValue = isInitialValueAllowed ? this.value.textAlign : textAligns[0];
    const component = new IconRadioGroupComponent(initialValue, {
      items: textAligns
    });

    component.on('change', textAlign => {
      this.value.textAlign = textAlign;
      this.collect();
    });

    return component;
  }

  getStyleAndWeightComponent() {
    const component = new IconRadioGroupComponent([this.value.fontWeight, this.value.fontStyle].join(' '), {
      items: styleAndWeights
    });

    component.on('change', styleAndWeight => {
      const [fontWeight, fontStyle] = styleAndWeight.split(' ');
      this.value.fontWeight = fontWeight;
      this.value.fontStyle = fontStyle;
      this.collect();
    });

    return component;
  }

  get isInline() {
    return true;
  }
}
