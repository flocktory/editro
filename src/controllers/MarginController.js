import BaseTBLRController from './BaseTBLRController';
import TBLRComponent from '../components/TBLRComponent';


export default class MarginController extends BaseTBLRController {
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
