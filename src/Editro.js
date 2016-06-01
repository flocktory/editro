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

const EDITED_ATTR = 'current-edited-element';

const stopPropagation = (e) => e.stopPropagation();

// Editor itself, get node, start html (optional), options
export default function Editro(root, html = defaultHtml, options = {}) {
  const rootComputedStyle = window.getComputedStyle(root);
  if (!rootComputedStyle || rootComputedStyle.position === 'static') {
    root.style.position = 'relative';
  }
  root.innerHTML = editorHtml;
  click(root, stopPropagation);

  const i18nFunction = i18n(options.i18n);
  const $el = elementSearch(root, 'Editro');
  const preview = $el('preview');
  const getHtml = () => '<!doctype html>\n' + preview.contentDocument.documentElement.outerHTML;
  const handlers = { change: [] };
  const emitChange = html => handlers.change.forEach(handler => handler(html));
  const findEdited = () => preview.contentDocument.body.querySelector(`[${EDITED_ATTR}]`);

  const history = new History(preview, html => {
    preview.srcdoc = html;
    emitChange(html);
  });
  history.push(html);
  click($el('backward'), () => history.backward());
  click($el('forward'), () => history.forward());

  let toolbox = null;
  const createToolbox = (selected) => new Toolbox(selected, {
    controllers: controllers.concat(options.controllers || []),
    root: root.querySelector('[editro-toolbox]'),
    i18n: i18nFunction
  });

  preview.addEventListener('load', () => {
    const body = preview.contentDocument.body;
    if (toolbox) {
      toolbox.destroy();
    }
    const selected = body.querySelector(`[${EDITED_ATTR}]`);
    if (selected) {
      toolbox = createToolbox(selected);
    }
    // Create toolbox when element selected
    click(body, (e) => {
      [].forEach.call(body.querySelectorAll(`[${EDITED_ATTR}]`), el => el.removeAttribute(EDITED_ATTR));
      e.target.setAttribute(EDITED_ATTR, EDITED_ATTR);
      if (toolbox) {
        toolbox.destroy();
      }
      toolbox = createToolbox(e.target);
    });

    observeMutation(body, () => {
      const html = getHtml();
      history.push(html);
      emitChange(html);
      if (!findEdited()) {
        toolbox.destroy();
        toolbox = null;
      }
    });
  });

  preview.srcdoc = html;

  // Code editor
  const codeEditor = new Code($el('code'), {
    getHtml,
    keyMap: options.keyMap,
    onChange(html) {
      preview.srcdoc = html;
      emitChange(html);
    }
  });
  click($el('html'), () => codeEditor.toggle());


  return {
    getHtml,
    // TODO А мы не хотим нормальный EventEmitter?
    on(name, handler) {
      handlers[name] = handlers[name] || [];
      handlers[name].push(handler);
    },
    destroy() {
      root.removeEventListener(stopPropagation);
      const e = root.querySelector('.Editro');
      root.removeChild(e);
      history.destroy();
      codeEditor.destroy();
    }
  };
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
