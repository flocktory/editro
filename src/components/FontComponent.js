import BaseCompositeComponent from './BaseCompositeComponent';
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


export default class FontComponent extends BaseCompositeComponent {
  getSubComponentsFactories() {
    return [
      {
        component: () => new ColorComponent(this.value.color),
        onChange: color => this.value.color = color
      },
      {
        component: () => new InputComponent(this.value.fontSize, {
          type: 'number',
          unit: 'px',
          icon: 'fz'
        }),
        onChange: fontSize => this.value.fontSize = fontSize
      },
      {
        component: () => new InputComponent(this.value.lineHeight, {
          type: 'number',
          icon: 'lh',
          unit: 'px'
        }),
        onChange: lineHeight => this.value.lineHeight = lineHeight
      },
      {
        component: () => {
          const isInitialValueAllowed = !!textAligns.find(i => i.value === this.value.textAlign);
          const initialValue = isInitialValueAllowed ? this.value.textAlign : textAligns[0];

          return new IconRadioGroupComponent(initialValue, {
            items: textAligns
          });
        },
        onChange: textAlign => this.value.textAlign = textAlign
      },
      {
        component: () => new IconRadioGroupComponent([this.value.fontWeight, this.value.fontStyle].join(' '), {
          items: styleAndWeights
        }),
        onChange: styleAndWeight => {
          const [fontWeight, fontStyle] = styleAndWeight.split(' ');
          this.value.fontWeight = fontWeight;
          this.value.fontStyle = fontStyle;
        }
      }
    ];
  }

  get isInline() {
    return true;
  }
}
