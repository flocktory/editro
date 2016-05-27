/* eslint-disable new-cap */
import Toolbox from './Toolbox';
import History from './History';

const EDITED_ATTR = 'current-edited-element';

const defaultHtml = `
  <!doctype html>
  <html>
    <body>
      <div>
        <h1>Hello world!</h1>
      </div>
    </body>
  </html>
`;

const editorHtml = `
  <div class="Editro">
    <div class="Editro-editorWrap">
      <iframe frameborder="0" class="Editro-editor"></iframe>

    </div>
    <div class="Editro-toolboxWrap">
      <div class="Editro-toolbox Toolbox">
        Click on element to select
      </div>
    </div>
  </div>
`;

// Editor itself, get node, start html (optional), options
export default function Editro(root, html = defaultHtml, options = {}) {
  root.innerHTML = editorHtml;


  const $el = q => root.querySelector('.Editro-' + q);
  const editor = $el('editor');
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

  editor.addEventListener('load', () => {
    const body = editor.contentDocument.body;
    if (toolbox) toolbox.destroy();
    const selected = body.querySelector(`[${EDITED_ATTR}]`);
    if (selected) {
      toolbox = Toolbox($el('toolbox'), selected, options);
    }
    // Create toolbox when element selected
    click(body, (e) => {
      [].forEach.call(body.querySelectorAll(`[${EDITED_ATTR}]`), e => e.removeAttribute(EDITED_ATTR));
      e.target.setAttribute(EDITED_ATTR, EDITED_ATTR);
      if (toolbox) toolbox.destroy();
      toolbox = Toolbox($el('toolbox'), e.target, options);
    });

    // subscribe to all DOM changes
    const observer = new window.MutationObserver(() => {
      const h = getHtml();
      history.push(h);
      emitChange(h);
    });
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(body, config);
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
