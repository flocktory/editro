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


// Editor itself, get node, start html (optional), options
export default function Editro(root, html = defaultHtml, options = {}) {
  const rootComputedStyle = window.getComputedStyle(root);
  if (!rootComputedStyle || rootComputedStyle.position === 'static') {
    root.style.position = 'relative';
  }
  root.innerHTML = editorHtml;
  click(root, (ev) => {
    ev.stopPropagation();
  });

  const i18nFunction = i18n(options.i18n);
  const $el = elementSearch(root, 'Editro');
  const editor = $el('preview');
  const getHtml = () => '<!doctype html>\n' +
    editor.contentDocument.documentElement.outerHTML;
  const handlers = { change: [] };
  const emitChange = (h) => handlers.change.forEach(f => f(h));

  const history = new History(editor, (h) => {
    editor.srcdoc = h;
    emitChange(h);
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

  editor.addEventListener('load', () => {
    const body = editor.contentDocument.body;
    if (toolbox) toolbox.destroy();
    const selected = body.querySelector(`[${EDITED_ATTR}]`);
    if (selected) {
      toolbox = createToolbox(selected);
    }
    // Create toolbox when element selected
    click(body, (e) => {
      [].forEach.call(body.querySelectorAll(`[${EDITED_ATTR}]`), el => el.removeAttribute(EDITED_ATTR));
      e.target.setAttribute(EDITED_ATTR, EDITED_ATTR);
      if (toolbox) toolbox.destroy();
      toolbox = createToolbox(e.target);
    });

    observeMutation(body, () => {
      const h = getHtml();
      history.push(h);
      emitChange(h);
    });
  });

  editor.srcdoc = html;

  // Code editor
  const cm = new Code($el('code'), {
    getHtml,
    keyMap: options.keyMap,
    onChange(h) {
      editor.srcdoc = h;
      emitChange(h);
    }
  });
  click($el('html'), () => cm.toggle());


  return {
    getHtml,
    on(name, h) {
      handlers[name] = handlers[name] || [];
      handlers[name].push(h);
    },
    destroy() {
      const e = root.querySelector('.Editro');
      root.removeChild(e);
      history.destroy();
      cm.destroy();
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
