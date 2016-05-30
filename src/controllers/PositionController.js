import BaseTBLRController from './BaseTBLRController';
import PositionComponent from '../components/PositionComponent';


export default class PositionController extends BaseTBLRController {
  createComponent(value) {
    return new PositionComponent(value);
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

    console.log("normalizedValue.position", normalizedValue.position);
    if (['static', 'relative', 'absolute', 'fixed'].indexOf(normalizedValue.position) === -1) {
      normalizedValue.position = 'static';
    }

    return normalizedValue;
  }

  get title() {
    return 'Position';
  }

  get modificators() {
    return ['half', 'controls-separated'];
  }
}
