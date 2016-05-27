import Controller from '../Controller';
import FontComponent from '../components/FontComponent';


export default class FontController extends Controller {
  static test(el) {
    return [
      'a','address','article','aside','b','blockquote','body','button','caption','center','cite','code','dd','del','dl',
      'dt','em','fieldset','figcaption','figure','font','footer','form','h1','h2','h3','h4','h5','h6','header','i',
      'input','label','legend','li','nav','ol','p','pre','s','section','select','small','span','strike','strong','sub',
      'sup','td','textarea','th','u','ul'
    ].indexOf(el.tagName.toLowerCase()) !== -1;
  }

  createComponent(value) {
    return new FontComponent(value);
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);

    return {
      textAlign: computedStyle.textAlign
    };
  }

  set({textAlign}) {
    this.el.style.textAlign = textAlign;
  }
}
