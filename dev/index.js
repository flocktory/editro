// In development new iframe added after editro.
// This iframe show tests results.
if (window.top === window) {
  require('../scss/index.scss');
  init();
  const i = document.createElement('iframe');
  i.src = location.href;
  i.id = 'testframe';
  function check() {
    if (i.contentDocument && i.contentDocument.body) {
      i.style.height = i.contentDocument.body.offsetHeight + 30 + 'px';
    }
    requestAnimationFrame(() => {
      check()
    });
  }
  check();
  document.body.appendChild(i)

  module.hot.accept('../src/Editro.js', () => {
    init();
  });
}
else {
  require('./test');
  module.hot.accept('./test.js', () => {
    window.location = window.location;
  });
}

function init() {
  const el = document.getElementById('editro');
  el.innerHTML = '';
  const Editro = require('../src/normalBuild');

  window.Editro = Editro;

  require('../src/addon/uploadToServer')(Editro);
  require('./addons/cutomFont')(Editro);
  require('../src/addon/codeMirror')(Editro);
  require('./addons/widgetSettings')(Editro);

  const html = `
    <!doctype html>
    <html>
      <head>
        <script>console.log('Script inside frame')</script>
      </head>
      <body>
        <h1>Hello</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          At enim, qua in vita est aliquid mali, ea beata esse non potest.
          Parvi enim primo ortu sic iacent, tamquam omnino sine animo sint.
          Et quidem, inquit, vehementer errat; Servari enim iustitia nisi a forti viro, nisi a sapiente non potest.
          Illa argumenta propria videamus, cur omnia sint paria peccata.
        </p>
        <img alt="bat" height="220" src="https://assets.flocktory.com/uploads/clients/1791/55e5a0ef-9ea7-45cb-bf81-7683bc44d87c_readImage.jpg"/>

        <form action="">
          <input type="text"/>
          <input type="email"/>
          <button type="submit">
            Submit
          </button>
        </form>
        <br/>
        <a href="https://flocktory.com" target="_blank">Flocktory.com link</a>
      </body>
    </html>
  `;

  window.EDITRO = new Editro(el, {
    code: html,
    toolboxTabsEnabled: false
  });
}
