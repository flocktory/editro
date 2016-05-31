import Controller from '../Controller';
import InputComponent from '../components/InputComponent';


export default class HrefController extends Controller {
  static test(el) {
    return el.tagName.toLowerCase() === 'a';
  }

  createComponent(value) {
    return new InputComponent(value, {
      size: 'full'
    });
  }

  get() {
    return this.el.getAttribute('href');
  }

  set(value) {
    this.el.setAttribute('href', value);
  }

  get group() {
    return 'priority';
  }

  get title() {
    return 'Link address';
  }
}
