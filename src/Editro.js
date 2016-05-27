/* eslint-disable new-cap */
import Toolbox from './Toolbox';
import History from './History';
import editorHtml from './templates/editro.html';
import defaultHtml from './templates/default.html';
import { controllers } from './library';

const EDITED_ATTR = 'current-edited-element';


// Editor itself, get node, start html (optional), options
export default function Editro(root, html = defaultHtml, options = {}) {
  if (window.getComputedStyle(root).position === 'static') {
    root.style.position = 'relative';
  }
  root.innerHTML = editorHtml;

  const $el = q => root.querySelector('.Editro-' + q);
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

  let toolbox = null;
  const createToolbox = (selected) => new Toolbox(selected, {
    controllers,
    root: root.querySelector('[editro-toolbox]')
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


  return {
    getHtml,
    on(name, h) {
      handlers[name] = handlers[name] || [];
      handlers[name].push(h);
    },
    destroy() {
      editor.parentNode.removeChild(editor);
      history.destroy();
    }
  };
}

function click(el, handler) {
  return el.addEventListener('click', handler);
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
