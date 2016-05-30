import Controller from '../Controller';
import {inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags} from './tags';
import {num, px} from '../utils';


const direction = ['top', 'bottom', 'left', 'right'];


function getStyleName(prefix, direction) {
  return prefix ? prefix + direction[0].toUpperCase() + direction.slice(1) : direction;
}


export default class BaseTBLRController extends Controller {
  static test(el) {
    const tags = [];

    tags.push(
      ...inputTags,
      ...listTags,
      ...definitionTags,
      ...blockTags,
      ...headersTags,
      ...contentTags,
      ...formTags
    );

    return tags.indexOf(el.tagName.toLowerCase()) !== -1;
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);
    const value = {};

    direction.forEach(direction => value[direction] = computedStyle[getStyleName(this.stylesPrefix, direction)]);

    return value;
  }

  set(value) {
    direction.forEach(direction => this.el.style[getStyleName(this.stylesPrefix, direction)] = px(value[direction]));
  }

  normalize(value) {
    const result = Object.assign({}, value);

    direction.forEach(direction => result[direction] = num(result[direction]));

    return result;
  }

  get modificators() {
    return ['half'];
  }
}
