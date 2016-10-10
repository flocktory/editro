import Controller from '../Controller';
import InputComponent from '../components/InputComponent';

export default class PlaceholderController extends Controller {
  static test(el) {
  	console.log("el ---->",el)
    return ((el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') && (el.placeholder && el.placeholder !== ""));
  }

  createComponent(value) {
    return new InputComponent(value);
  }

  get() {
    return this.el.getAttribute('placeholder');
  }

  set(value) {
    this.el.setAttribute('placeholder', value);
  }

  get title() {
    return 'Placeholder';
  }
}