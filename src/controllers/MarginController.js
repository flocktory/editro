import BaseTBLRController from './BaseTBLRController';
import TBLRComponent from '../components/TBLRComponent';


export default class MarginController extends BaseTBLRController {
  constructor(el) {
    super(el);
    this.stylesPrefix = 'margin';
  }

  createComponent(value) {
    return new TBLRComponent(value, {
      arrowDirection: 'out',
      shapes: {
        inner: 'real',
        outer: 'imag'
      }
    });
  }

  get title() {
    return 'Margin';
  }
}
