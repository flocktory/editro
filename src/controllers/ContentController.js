import Controller from '../Controller';
import ContentComponent from '../components/ContentComponent';
import {inputTags, listTags, definitionTags, blockTags, headersTags, contentTags, formTags, embeddedTags, inlineTags} from './tags';
import {toArray} from '../utils';


export default class ContentController extends Controller {
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
      ...embeddedTags,
      ...inlineTags
    );

    return tags.indexOf(el.tagName.toLowerCase()) !== -1;
  }

  createComponent(value) {
    return new ContentComponent(value);
  }

  get() {
    const nodes = [];
    let prevNodeIsText = true;

    toArray(this.el.childNodes).forEach(node => {
      const isText = node.nodeType === 3;

      if (isText) {
        nodes.push({
          type: 'text',
          content: node.textContent,
          node
        });
      } else if (isText !== prevNodeIsText) {
        nodes.push({
          type: 'other',
          content: node.textContent
        });
      }

      prevNodeIsText = isText;
    });

    return {nodes};
  }

  set(value) {
    value.nodes.forEach(item => {
      if (item.type === 'text') {
        item.node.textContent = item.content;
      }
    });
  }

  get group() {
    return 'priority';
  }

  get title() {
    return 'Text content';
  }
}
