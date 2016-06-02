import BaseTBLRController from './BaseTBLRController';
import PositionComponent from '../components/PositionComponent';


export default class PositionController extends BaseTBLRController {
  createComponent(value) {
    return new PositionComponent(value, {
      i18n: this.i18n
    });
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);
    const value = super.get();

    value.position = computedStyle.position;

    return value;
  }

  set(value) {
    super.set(value);

    this.el.style.position = value.position;
  }

  normalize(value) {
    const normalizedValue = super.normalize(value);

    if (['static', 'relative', 'absolute', 'fixed'].indexOf(normalizedValue.position) === -1) {
      normalizedValue.position = 'static';
    }

    return normalizedValue;
  }

  get title() {
    return 'Position';
  }
}
