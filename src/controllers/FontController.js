import Controller from '../Controller';
import FontComponent from '../components/FontComponent';
import {inputTags, inlineTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags} from './tags';


export default class FontController extends Controller {
  static test(el) {
    const tags = [];

    tags.push(
      ...inputTags,
      ...inlineTags,
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
    return new FontComponent(value);
  }

  get() {
    const computedStyle = window.getComputedStyle(this.el);

    return {
      textAlign: computedStyle.textAlign,
      fontWeight: computedStyle.fontWeight,
      fontStyle: computedStyle.fontStyle,
      fontSize: computedStyle.fontSize
    };
  }

  set({textAlign, fontWeight, fontStyle, fontSize}) {
    this.el.style.textAlign = textAlign;
    this.el.style.fontWeight = fontWeight;
    this.el.style.fontStyle = fontStyle;
    this.el.style.fontSize = fontSize + 'px';
  }

  normalize(value) {
    const normalizedValue = Object.assign({}, value);

    normalizedValue.fontSize = parseFloat(normalizedValue.fontSize);
    if (['left', 'center', 'right'].indexOf(normalizedValue.textAlign) === -1) {
      normalizedValue.textAlign = 'left';
    }

    return normalizedValue;
  }

  get title() {
    return 'Font';
  }
}
