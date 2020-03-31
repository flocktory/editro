/*
 * Main class. Response for whole editor.
 * Provide static methods for extendind.
 *
 *
 */

const EventEmmiter = require('events');
const assert = require('assert');
const Frame = require('./Frame');
const Toolbox = require('./Toolbox');

const initHooks = [];

class Editro extends EventEmmiter {
  constructor(root, options) {
    super();

    Object.assign(this.options, options);
    const code = options.code;

    this.setMaxListeners(1000);

    this.node = document.createElement('div');
    this.node.className = 'Editro';

    // pass code through preprocessors
    const cp = Object.values(Editro.codePreprocessor);
    const prepared = cp.length ?
      cp.reduce((c, p) => p(c), code) :
      code;
    this.frame = new Frame({
      prefix: this.options.prefix + 'Frame',
      code: prepared
    });
    this.frame.on('selected', this._onElementSelected.bind(this));
    this.frame.on('deselected', () => this.emit('deselected'));
    this.frame.on('change', this._onFrameChanged.bind(this));

    this.toolbox = new Toolbox(this);

    // Build DOM
    // top
    const instruments = new Editro.type.Instruments(this);
    const topPanel = new Editro.type.Panel(this, {
      fixed: true,
      position: 'top',
      tag: 'instruments',
      child: instruments.getNode()
    });
    this.node.appendChild(topPanel.getNode());
    // center
    const center = document.createElement('div');
    center.className = 'Editro-center';
    center.appendChild(this.frame.getNode());
    // right
    const rightPanel = new Editro.type.Panel(this, {
      size: '400px',
      position: 'right',
      tag: 'toolbox',
      child: this.toolbox.getNode()
    });
    center.appendChild(rightPanel.getNode());
    this.node.appendChild(center);
    root.appendChild(this.node);

    initHooks.forEach(h => h(this, root, options));
  }

  setOption(name, val) {
    const old = this.options[name];
    if (old !== val) {
      this.options[name] = val;
      this.emit(`optionChanged:${name}`, val, old);

      if (this.optionsHandlers[name]) {
        this.optionsHandlers[name].call(null, this, val, old);
      }
    } else {
      return false;
    }
  }
  getOption(name) {
    return this.options[name];
  }

  getNode() {
    return this.node;
  }

  getToolbox() {
    return this.toolbox;
  }

  getHtml() {
    const raw = this.frame.getHtml();

    return this._postprocess(raw);
  }

  setHtml(code, o={}) {
    if (!o.forceUpdate && code === this.getHtml()) {
      return;
    }

    // pass code through preprocessors
    const cp = Object.values(Editro.codePreprocessor);
    const prepared = cp.length ?
      cp.reduce((c, p) => p(c), code) :
      code;

    this.frame.setHtml(prepared);

    // Previously, an event was emitted after the frame was loaded, but this sometimes takes a long time
    this.emit('change', {
      html: code,
      sourceType: o.sourceType || 'setHtml',
      source: o.source
    });
  }

  selectByQuery(q) {
    return this.frame.selectByQuery(q);
  }

  _onElementSelected(element) {
    this.emit('selected', element);
  }

  _onFrameChanged(e) {
    this.emit('change', {
      html: this._postprocess(e.html),
      sourceType: 'frame',
      source: this.frame
    });
  }

  _postprocess(raw) {
    const cp = Object.values(Editro.codePostprocessor);
    return cp.length ?
      cp.reduce((c, p) => p(c), raw) :
      raw;
  }
}

Editro.prototype.options = { };
Editro.prototype.optionsHandlers = {};

Editro.defineOption = (name, value, f) => {
  Editro.prototype.options[name] = value;
  if (f) {
    assert(typeof f === 'function', 'Option handler should be falsy or function');
    Editro.prototype.optionsHandlers[name] = f;
  }
};

Editro.defineInitHook = (f) => {
  initHooks.push(f);
};

Editro.defineExtension = (name, value) => {
  Editro.prototype[name] = value;
};

Editro.helpers = [];
Editro.defineHelper = (type, name, value) => {
  Editro.helpers[type] = Editro[type] = Editro.helpers[type] || {};
  Editro.helpers[type][name] = value;
};

Editro.createComponent = (component, value, options) => {
  assert(Editro.type[component], `Component type ${component} doesn't exist.`);
  return new Editro.type[component](value, options);
};

module.exports = Editro;
