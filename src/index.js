/* eslint-disable max-len, no-console, new-cap */
import './Editro.scss';
import Editro from './Editro';

const root = document.getElementById('root');
const initHtml = `
  <!doctype html>
  <html>
    <body>
      <div>
        <h1 id="x">Check</h1>
        <img height="220" src="https://assets.flocktory.com/uploads/clients/1791/55e5a0ef-9ea7-45cb-bf81-7683bc44d87c_readImage.jpg"/>
        <div style="margin: 10px;padding: 30px 10px;background: #ccc;">
        </div>
      </div>
    </body>
  </html>
`;

const options = {

};

let editro = null;
let html = initHtml;

const init = () => {
  if (editro) editro.destroy();
  editro = Editro(root, html, options);
  editro.on('change', h => {
    window.document.getElementById('html').innerText = h;
    html = h;
  });
  window.editro = editro;
};

init();

if (module.hot) {
  module.hot.accept('./Editro', () => {
    init();
  });
}
