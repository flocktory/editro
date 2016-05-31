import Controller from '../Controller';
import BorderComponent from '../components/BorderComponent';
import {inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags} from './tags';
import {num, px} from '../utils';


export default class BorderController extends Controller {
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

  createComponent(value) {
    return new BorderComponent(value);
  }

  get() {
    const borders = [];
    const computedStyle = window.getComputedStyle(this.el);

    ['Top', 'Right', 'Bottom', 'Left'].forEach(position =>
      borders.push(['Width', 'Style', 'Color'].map((prop, i) =>
        i ? computedStyle[`border${position}${prop}`] : num(computedStyle[`border${position}${prop}`]))));

    const radius = ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].map(position =>
      num(computedStyle[`border${position}Radius`]));

    return {
      borders,
      radius
    };
  }

  set(value) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach((position, i) =>
      ['Width', 'Style', 'Color'].map((prop, j) =>
        this.el.style[`border${position}${prop}`] = j ? value.borders[i][j] : px(value.borders[i][j])));

    ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].map((position, i) =>
      this.el.style[`border${position}Radius`] = px(value.radius[i]));
  }

  get title() {
    return 'Borders';
  }
}
