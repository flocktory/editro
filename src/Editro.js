/* eslint-disable new-cap */
import './styles/editro.scss';
import Toolbox from './Toolbox';
import History from './History';
import editorHtml from './templates/editro.html';
import defaultHtml from './templates/default.html';
import { controllers } from './library';
import { elementSearch, click } from './utils';
import i18n from './i18n';
import EventEmitter from 'events';
import * as nav from './nav';
import { formatCss, getElementAttr } from './style';

const EDITED_ATTR = 'current-edited-element';
const stopPropagation = (e) => e.stopPropagation();


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

    this.preview = this.elem('preview');

    // Create history
    this.history = new History(this.preview, this.root)
      this.history.on('change', html => {
        this.preview.srcdoc = html;
        this.emit('change', this.sanitize(html));
      });


    // Build navigation elements
    const navigation = options.nav ? options.nav.map(a => a) : []; // copy
    navigation.unshift(nav.forward(this, this.history));
    navigation.unshift(nav.backward(this, this.history));
    this.nav = navigation.map(n => {
      const o = n(this);
      this.elem('nav').appendChild(o.node);
      return o;
    });

    this.preview.addEventListener('load', this.onPreviewLoad);

    const enrichedHtml = this.enrich(html);
    this.history.push(enrichedHtml);
    this.preview.srcdoc = enrichedHtml;

  }

  // Public API. SHould not be changed. Should be binded to this
  destroy = () => {
    this.elem('preview')
      .removeEventListener('click', stopPropagation);
    const editroElement = this.root.querySelector('.Editro');
    this.root.removeChild(editroElement);
    this.history.destroy();
    this.nav.forEach(n => n.destroy && n.destroy());
  }

  // return raw html string from preview, string contains additional data,
  // should be sanitized before output
  getHtml = () => {
    const encoded =  this.preview.contentDocument.documentElement ?
      '<!doctype html>\n' + this.preview.contentDocument.documentElement.outerHTML :
      '';

    return encoded.replace(/&amp;/gmi, '&');
  }

  setHtml = (html) => {
    if (this.sanitize(this.getHtml()) !== html) {
      this.emit('change', html);
      const enrichedHtml = this.enrich(html);
      this.history.push(enrichedHtml);
      this.preview.srcdoc = enrichedHtml;
    }
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
    click(this.elem('preview'), stopPropagation);
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


  setTarget(target) {
    if (this.toolbox) {
      this.toolbox.destroy();
    }
    this.toolbox = this.createToolbox(target);
  }

  createToolbox(target) {
    const editro = this;
    let styleProxy = null;
    const validator = {
      get(target, prop, r) {
        if (prop === 'computedStyle') {
          return window.getComputedStyle(target)
        }
        if (prop === 'style') {
          if (!styleProxy) {
            styleProxy = new Proxy(target.style, {
              set(t, prop, value) {
                t[prop] = '';
                t.removeProperty(prop)
                const st = editro.getStyleTag();

                let identy = target.dataset.editroStyle;
                if (!identy) {
                  identy = target.tagName.toLowerCase() +
                    Math.floor(Math.random() * 100000);
                  target.dataset.editroStyle = identy;
                }

                const selectorText = `[data-editro-style="${identy}"]`;
                const rule = [].find.call(st.rules, a => a.selectorText === selectorText);

                if (rule) {
                  rule.style[prop] = value;
                } else {
                  const cssProp = prop.replace(/[A-Z]/, a => '-' + a.toLowerCase());
                  st.insertRule(`${selectorText} { ${cssProp}: ${value};}`, st.rules.length)
                }
                const allCssText = [].reduce.call(st.rules, (t, r) => t + '\n\n' + r.cssText,'');
                st.ownerNode.innerHTML = formatCss(allCssText);
                const html = editro.getHtml();
                editro.history.push(html);
                editro.emit('change', editro.sanitize(html));
                return true;
              }
            });
          }
          return styleProxy;
        }
        const val = target[prop]
        return typeof val === 'function' ? val.bind(target) : val
      },
      set(target, prop, value) {
        // Only need because some set ops not work on proxy
        // (like innerHTML)
        target[prop] = value;
        return true;
      }
    };
    const proxy = new Proxy(target, validator)
    return new Toolbox(proxy, {
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

    const sre = /<script[^>]*>/gmi;

    html = html.replace(sre, (str) => str.indexOf('text/javascript') > -1 ?
        str.replace('text/javascript', 'fake/javascript') :
        str.replace(/<script/i, '<script type="fake/javascript" '));

    const re = /<head[^>]*>/gmi;
    // if no head present
    const headPos = html.search(re);
    if (headPos === -1) {
      html = html.substring(0, headPos) + '<head></head>' + html.substring(headPos);
    }
    const additionalData = `\n
      <head>
      <style id="editro-perm-style">
      </style>
      <!--EDITRO START-->
      <style id="editro-style">
      * {
        cursor: pointer;
      }
      [${EDITED_ATTR}] {
        outline: auto 5px -webkit-focus-ring-color;
      }
      </style>\n
      <style id="editro-perm-style">
      </style>\n
      <script>
        window.___editro = true;
      </script>
      <!--EDITRO END-->\n`;

    return html
      .split(re).join(additionalData);
  }

  /**
   * Clean html from work data (styles, attrs, etc)
   * @param {String} html html with data
   * @returns {String} html clean html
   */
  sanitize(html) {
    return html
      .replace(/editro-body/gmi, '')
      .replace(/\s*<!--EDITRO START-->[^]*<!--EDITRO END-->\s*/gmi, '\n')
      .replace(/type="fake\/javascript"/gmi, 'type="text/javascript"');
  }

  getStyleTag() {
    const st = this.preview.contentDocument.getElementById('editro-perm-style');
    return [].find.call(this.preview.contentDocument.styleSheets, s => s.ownerNode === st);
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
