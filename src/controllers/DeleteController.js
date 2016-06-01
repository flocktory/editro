import Controller from '../Controller';
import ActionButtonComponent from '../components/ActionButtonComponent';


export default class DeleteController extends Controller {
  static test(el) {
    return el.tagName.toLowerCase() !== 'body';
  }

  createComponent() {
    return new ActionButtonComponent(null, {
      type: 'delete',
      text: 'Delete'
    });
  }

  set(value) {
    this.el.parentNode.removeChild(this.el);
    this.emit('select-element');
  }

  get group() {
    return 'actions';
  }
}
