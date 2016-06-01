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
    return new BorderComponent(value, {
      i18n: this.i18n
    });
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);
    const components = ['Top', 'Right', 'Bottom', 'Left'].map(position =>
      ['Width', 'Color'].map((prop, i) =>
        i ? computedStyle[`border${position}${prop}`] : num(computedStyle[`border${position}${prop}`])));
    const showComponents = components.reduce(
      (condition, rad, i) => condition ||
        (i ? components[i][0] !== components[i - 1][0] || components[i][1] !== components[i - 1][1] : false),
      false
    );

    return {
      oneValue: components[0].slice(),
      showComponents,
      components
    };
  }

  set(value) {
    if (value.showComponents) {
      ['Top', 'Right', 'Bottom', 'Left'].forEach((position, i) =>
        ['Width', 'Color'].forEach((prop, j) => {
          this.el.style[`border${position}${prop}`] = {
            0: px(value.components[i][j]),
            1: value.components[i][j]
          }[j];
        }));
    } else {
      this.el.style.borderWidth = px(value.oneValue[0]);
      this.el.style.borderColor = value.oneValue[1];
    }
    this.el.style.borderStyle = 'solid';
  }

  get title() {
    return 'Borders';
  }
}
