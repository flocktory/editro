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
        <img alt="bat" height="220" src="https://assets.flocktory.com/uploads/clients/1791/55e5a0ef-9ea7-45cb-bf81-7683bc44d87c_readImage.jpg"/>
        <img alt="sup" height="220" src="http://3.bp.blogspot.com/-WGTtRLTo_0I/VXAKQ6GTNFI/AAAAAAAAAgk/HWAKeDLV3X8/s1600/b_a92203e1.png" alt="" style="float: right;">
        <div style="margin: 10px;padding: 30px 10px;background: #ccc;">
        </div>
      </div>
    </body>
  </html>
`;

const customController = {
  test: (el) => el.tagName.toLowerCase() === 'img',
  create: (el) => {
    let int = null;
    const node = window.document.createElement('input');
    node.setAttribute('type', 'checkbox');
    node.addEventListener('change', e => {
      if (e.target.checked) {
        int = setInterval(() => {
          el.setAttribute('height', 200 + Math.floor(Math.random() * 30));
        }, 600);
      } else {
        clearInterval(int);
      }
    });

    return {
      node,
      title: `Make ${el.getAttribute('alt')} dance!`,
      destroy() {
        int && clearInterval(int);
      }
    };
  }
};
const makeFlCloseControlle = {
  test: () => true,
  create: (el) => {
    const node = window.document.createElement('input');
    node.setAttribute('type', 'checkbox');
    node.addEventListener('change', e => {
      if (e.target.checked) {
        el.setAttribute('fl-close', '');
      } else {
        el.removeAttribute('fl-close');
      }
    });

    return {
      node,
      title: 'Make fl-close',
      destroy() {
      }
    };
  }
};

const options = {
  keyMap: process.env.KEY_MAP || 'default',
  controllers: [customController, makeFlCloseControlle]
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
