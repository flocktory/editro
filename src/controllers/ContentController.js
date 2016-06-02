import Controller from '../Controller';
import ContentComponent from '../components/ContentComponent';
import {
  listTags,
  headersTags,
  contentTags,
  inlineTags
} from './tags';
import {
  toArray
} from '../utils';


const allowedContentEditableTags = [];
allowedContentEditableTags.push(...inlineTags, ...headersTags, ...listTags, ...contentTags);


const hasOnlyTags = (html, tags) => {
  const search = /<(\w+)>|<(\w+)\s/gim;

  for (let match = search.exec(html); match; match = search.exec(html)) {
    if (tags.indexOf(match[1] || match[2]) === -1) {
      return false;
    }
  }

  return true;
};


const clearTags = (html, allowedTags) => {
  function clear(node) {
    toArray(node.children).forEach(child => {
      if (allowedTags.indexOf(child.tagName.toLowerCase()) === -1) {
        const placeholder = document.createElement('span');
        placeholder.innerHTML = '<&hellip;>';
        node.replaceChild(placeholder, child);
      } else if (child.children) {
        clear(child);
      }
    });

    return node;
  }

  const root = document.createElement('div');
  root.innerHTML = html;

  return clear(root).innerHTML;
};


export default class ContentController extends Controller {
  static test(el) {
    return el.textContent.trim() && hasOnlyTags(el.innerHTML, allowedContentEditableTags);
  }

  createComponent(value) {
    return new ContentComponent(value, {
      i18n: this.i18n
    });
  }

  get() {
    const disabled = !hasOnlyTags(this.el.innerHTML, allowedContentEditableTags);
    const content = disabled ? clearTags(this.el.innerHTML, allowedContentEditableTags) : this.el.innerHTML;

    return {
      content,
      disabled
    };
  }

  set(value) {
    if (!value.disabled) {
      this.el.innerHTML = value.content;
    }
  }

  get group() {
    return 'priority';
  }

  get title() {
    return 'Text content';
  }
}
