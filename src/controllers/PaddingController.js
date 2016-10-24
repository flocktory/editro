import BaseTBLRController from './BaseTBLRController';
import TBLRComponent from '../components/TBLRComponent';
import { inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags } from './tags';


export default class PaddingController extends BaseTBLRController {
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

  get stylesPrefix() {
    return 'padding';
  }

  createComponent(value) {
    return new TBLRComponent(value, {
      arrowDirection: 'in',
      shapes: {
        inner: 'imag',
        outer: 'real'
      },
      label: this.i18n('Space between borders and content')
    });
  }

  get title() {
    return 'Padding';
  }
}
