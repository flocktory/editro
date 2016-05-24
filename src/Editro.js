/* eslint-disable new-cap */
import Toolbox from './Toolbox';

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
  const history = [html];
  history.pointer = 0;
  window.history = history;

  let toolbox = null;


  // work with cmd+z
  const updateByPointer = (pointer) => {
    const h = history[pointer];
    editor.srcdoc = h;
    emitChange(h);
  };
  const forward = () => {
    if (history.pointer < history.length - 1) {
      history.pointer++;
      updateByPointer(history.pointer);
    }
  };
  const back = () => {
    if (history.pointer > 0) {
      history.pointer--;
      updateByPointer(history.pointer);
    }
  };
  const keyhandler = (e) => {
    if (e.keyCode == 90 && e.metaKey) {
      if (e.shiftKey) {
        forward();
      } else {
        back();
      }
    }
  };
  window.document.addEventListener('keydown', keyhandler);

  editor.onload = () => {
    // Create toolbox when element selected
    click(editor.contentDocument.body, (e) => {
      if (toolbox) toolbox.destroy();
      toolbox = Toolbox($el('toolbox'), e.target, options);
    });

    // subscribe to all DOM changes
    const observer = new window.MutationObserver(() => {
      const h = getHtml();
      history.push(h);
      history.pointer++;
      emitChange(h);
    });
    const config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(editor.contentDocument.body, config);

    // iframe needs own listener
    editor.contentDocument.addEventListener('keydown', keyhandler);
  };

  editor.srcdoc = html;



  return {
    getHtml,
    on(name, h) {
      handlers[name] = handlers[name] || [];
      handlers[name].push(h);
    },
    destroy() {
      editor.parentNode.removeChild(editor);
      window.document.removeEventListener('keydown', keyhandler);
      editor.contentDocumen &&
        teditor.contentDocument.removeEventListener('keydown', keyhandler);
    }
  };
}

function click(el, handler) {
  return el.addEventListener('click', handler);
}
