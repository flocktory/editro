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
      <div class="Editro-controls">
        <button class="Editro-save">Save</button>
      </div>
    </div>
  </div>
`;

// Editor itself, get node, start html (optional), options
export default function Editro(root, html = defaultHtml, options = {}) {
  root.innerHTML = editorHtml;

  const handlers = [];
  const $el = q => root.querySelector('.Editro-' + q);
  const editor = $el('editor');
  const getHtml = () => '<!doctype html>\n' +
    editor.contentDocument.documentElement.outerHTML;

  let toolbox = null;

  editor.onload = () => {
    // Create toolbox when element selected
    editor.contentDocument.body.addEventListener('click', (e) => {
      if (toolbox) toolbox.destroy();
      toolbox = Toolbox($el('toolbox'), e.target, options);
    });

    let previous = html;
    $el('save').addEventListener('click', () => {
      const updatedHtml = getHtml();
      if (previous !== updatedHtml) {
        previous = updatedHtml;
        handlers.change.forEach(h => h(updatedHtml));
      }
    });
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
    }
  };
}
