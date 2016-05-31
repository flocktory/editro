import Controller from '../Controller';
import ImageComponent from '../components/ImageComponent';


export default class SrcController extends Controller {
  static test(el) {
    return el.tagName.toLowerCase() === 'img';
  }

  createComponent(value) {
    return new ImageComponent(value);
  }

  get() {
    return this.el.getAttribute('src');
  }

  set(value) {
    this.el.setAttribute('src', value);
  }

  get group() {
    return 'priority';
  }

  get title() {
    return 'Image';
  }
}
