import BaseTBLRController from './BaseTBLRController';
import TBLRComponent from '../components/TBLRComponent';


export default class PaddingController extends BaseTBLRController {
  constructor(el) {
    super(el);
    this.stylesPrefix = 'padding';
  }

  createComponent(value) {
    return new TBLRComponent(value, {
      arrowDirection: 'in',
      shapes: {
        inner: 'imag',
        outer: 'real'
      }
    });
  }

  get title() {
    return 'Padding';
  }
}
