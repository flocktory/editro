/* eslint-disable new-cap */
import './styles/editro.scss';
import Toolbox from './Toolbox';
import History from './History';
import editorHtml from './templates/editro.html';
import defaultHtml from './templates/default.html';
import { controllers } from './library';
import Code from './Code';
import { elementSearch, click } from './utils';
import i18n from './i18n';
import EventEmitter from 'events';

const EDITED_ATTR = 'current-edited-element';
const stopPropagation = (e) => e.stopPropagation();


// чистые
// - снаружи
// - на выход
// - в кодредакторе
// грязные
// - в истории
// - в ифрейме
//

class Editro extends EventEmitter {
  constructor(root, html = defaultHtml, options = {}) {
    super();

    this.options = options;
    this.root = root;
    this.i18n = i18n(options.i18n);
    this.elem = elementSearch(this.root, 'Editro');

    const rootComputedStyle = window.getComputedStyle(root);
    if (!rootComputedStyle || rootComputedStyle.position === 'static') {
      this.root.style.position = 'relative';
    }
    this.root.innerHTML = editorHtml;
    click(this.root, stopPropagation);

    this.preview = this.elem('preview');

    // Create history
    this.history = new History(this.preview, html => {
      this.preview.srcdoc = html;
      this.emit('change', this.sanitize(html));
    });
    click(this.elem('backward'), () => this.history.backward());
    click(this.elem('forward'), () => this.history.forward());

    this.preview.addEventListener('load', this.onPreviewLoad);

    const enrichedHtml = this.enrich(html);
    this.history.push(enrichedHtml);
    this.preview.srcdoc = enrichedHtml;

    // Code editor
    this.codeEditor = new Code(this.elem('code'), {
      getHtml: () => this.sanitize(this.getHtml()),
      keyMap: this.options.keyMap,
      onChange: (html) => {
        this.emit('change', html);
        const enrichedHtml = this.enrich(html);
        this.history.push(enrichedHtml);
        this.preview.srcdoc = enrichedHtml;
      }
    });
    click(this.elem('html'), () => this.codeEditor.toggle());
  }

  // Public API. SHould not be changed. Should be binded to this
  destroy = () => {
    this.root.removeEventListener('click', stopPropagation);
    const editroElement = this.root.querySelector('.Editro');
    this.root.removeChild(editroElement);
    this.history.destroy();
    this.codeEditor.destroy();
  }
  // end public API

  onPreviewLoad = () => {
    const { contentDocument } = this.preview;
    const body = contentDocument.body;
    if (this.toolbox) {
      this.toolbox.destroy();
    }
    const selected = contentDocument.querySelector(`[${EDITED_ATTR}]`);
    if (selected) {
      this.toolbox = this.createToolbox(selected);
    }
    // Create toolbox when element selected
    click(body, (e) => {
      e.preventDefault();
      [].forEach.call(body.querySelectorAll(`[${EDITED_ATTR}]`), el => el.removeAttribute(EDITED_ATTR));
      e.target.setAttribute(EDITED_ATTR, EDITED_ATTR);
      this.setTarget(e.target)
    });

    observeMutation(body, this.onPreviewMutated);
  }

  onPreviewMutated = () => {
    const html = this.getHtml();
    this.history.push(html);
    this.emit('change', this.sanitize(html));
    if (!this.preview.contentDocument.body.querySelector(`[${EDITED_ATTR}]`)) {
      this.toolbox.destroy();
      this.toolbox = null;
    }
  }

  // return raw html string from preview, string contains additional data,
  // should be sanitized before output
  getHtml = () => {
    return '<!doctype html>\n' + this.preview.contentDocument.documentElement.outerHTML;
  }

  setTarget(target) {
    if (this.toolbox) {
      this.toolbox.destroy();
    }
    this.toolbox = this.createToolbox(target);
  }

  createToolbox(target) {
    return new Toolbox(target, {
      controllers: controllers.concat(this.options.controllers || []),
      root: this.elem('toolbox'),
      i18n: this.i18n
    });
  }

  /**
   * Add usefull data to html (styles, attributs, etc)
   * @param {String} html clean html
   * @returns {String} html with additional data
   */
  enrich = (html) => {
    const re = /<head[^>]*>/gmi;
    // if no head present
    const headPos = html.search(re);
    if (headPos === -1) {
      html = html.substring(0, headPos) + '<head></head>' + html.substring(headPos);
    }
    const additionalData = `
      <head>
      <!--EDITRO START-->
      <style id="editro-style">
        * {
          cursor: pointer;
        }
        [${EDITED_ATTR}] {
           outline: auto 5px -webkit-focus-ring-color;
        }
      </style>
      <!--EDITRO END-->`;

    return html.split(re).join(additionalData);
  }

  /**
   * Clean html from work data (styles, attrs, etc)
   * @param {String} html html with data
   * @returns {String} html clean html
   */
  sanitize(html) {
    return html
      .replace(/editro-body/gmi, '')
      .replace(/\s*<!--EDITRO START-->[^]*<!--EDITRO END-->\s*/gmi, '');
  }
}

export default function(...params) {
  return new Editro(...params);
}



/**
 * Subscribe to element mutation
 * @param {Element} element
 * @param {Function} onMutate
 */
function observeMutation(element, onMutate) {
  const observer = new window.MutationObserver(() => {
    onMutate();
  });
  const config = { attributes: true, childList: true, characterData: true, subtree: true };
  observer.observe(element, config);
}
