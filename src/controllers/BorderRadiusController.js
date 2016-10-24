import Controller from '../Controller';
import BorderRadiusComponent from '../components/BorderRadiusComponent';
import { inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags } from './tags';
import { num, px } from '../utils';


export default class BorderRadiusController extends Controller {
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
    return new BorderRadiusComponent(value, {
      i18n: this.i18n
    });
  }

  get() {
    const computedStyle = this.el.computedStyle;
    const components = ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].map(position =>
      num(computedStyle[`border${position}Radius`]));
    const showComponents = components.reduce(
      (condition, rad, i) => condition || (i ? components[i] !== components[i - 1] : false),
      false
    );

    return {
      oneValue: components[0],
      showComponents,
      components
    };
  }

  set(value) {
    if (value.showComponents) {
      ['TopRight', 'BottomRight', 'BottomLeft', 'TopLeft'].forEach((position, i) => {
        this.el.style[`border${position}Radius`] = px(value.components[i]);
      });
    } else {
      this.el.style.borderRadius = px(value.oneValue);
    }
  }

  get title() {
    return 'Border radius';
  }
}
