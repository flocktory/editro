import Component from '../Component';
import IconRadioGroupComponent from './IconRadioGroupComponent';


export default class FontComponent extends Component {
  render() {
    this.el = document.createDocumentFragment();

    const textAlignComponent = new IconRadioGroupComponent(this.value.textAlign, {
      items: [
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
      ]
    });

    this.el.appendChild(textAlignComponent.el);

    textAlignComponent.on('change', textAlign => {
      this.value.textAlign = textAlign;
      this.emit('change', this.value);
    });
  }
}
