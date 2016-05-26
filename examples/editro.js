import EventEmitter from 'events';
import Controller from './Controller';
import Component from './Component';
import Toolbox from './toolbox';
import HistoryPlugin from './HistoryPlugin';
import RawHtmlEditPlugin from './RawHtmlEditPlugin';


class Editro extends EventEmitter {
  constructor(root, content='', options={}) {
    this.buildInterface(root, content);

    [
      HistoryPlugin,
      RawHtmlEditPlugin
    ].forEach(Plugin => new Plugin(this, options[Plugin.optionsKey] || {}));

    let toolbox = null;
    const register = this.createRegister(options);
    this.on('element-selected', el => {
      if (toolbox) {
        toolbox.destroy();
      }

      toolbox = new Toolbox(el, register, root.querySelector('[toolbox]'));
    });
  }

  buildInterface(root, content) {
    // ...
  }

  createRegister(options) {
    const register = {
      controllers: {
        // ...
      },
      components: {
        // ...
      }
    };

    options.controllers.forEach(config => register.controllers[config.name] = Controller.extend(config));
    options.components.forEach(config => register.components[config.name] = Component.extend(config));

    return register;
  }
}


const editro = new Editro(
  document.getElementById('root'),

  `<!doctype html>
  <html>
    <body>
      <div>
        <h1 id="x">Check</h1>
        <img height="220" src="https://assets.flocktory.com/uploads/clients/1791/55e5a0ef-9ea7-45cb-bf81-7683bc44d87c_readImage.jpg"/>
        <div style="margin: 10px;padding: 30px 10px;background: #ccc;">
        </div>
      </div>
    </body>
  </html>`,

  {
    history: {
      maxLength: 10
    },
    rawHtmlEdit: {
      indentSize: 2
    }
  }
);
editro.on('change', content =>
  $scope.apply(() =>
    $scope.widget.version.content = content));
