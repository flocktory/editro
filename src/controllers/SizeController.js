import Controller from '../Controller';
import SizeComponent from '../components/SizeComponent';
import {inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags, embeddedTags} from './tags';


export default class SizeController extends Controller {
  static test(el) {
    const tags = [];

    tags.push(
      ...inputTags,
      ...listTags,
      ...definitionTags,
      ...blockTags,
      ...headersTags,
      ...contentTags,
      ...formTags,
      ...embeddedTags
    );

    return tags.indexOf(el.tagName.toLowerCase()) !== -1;
  }

  createComponent(value) {
    return new SizeComponent(value);
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);

    return {
      width: computedStyle.width,
      height: computedStyle.height,
      float: computedStyle.float
    };
  }

  set({width, height, float}) {
    this.el.style.width = width + 'px';
    this.el.style.height = height + 'px';
    this.el.style.float = float;
  }

  normalize(value) {
    const normalizedValue = Object.assign({}, value);

    normalizedValue.width = parseInt(normalizedValue.width, 10);
    normalizedValue.height = parseInt(normalizedValue.height, 10);
    if (['left', 'none', 'right'].indexOf(normalizedValue.float) === -1) {
      normalizedValue.float = 'none';
    }

    return normalizedValue;
  }

  get title() {
    return 'Size';
  }
}
