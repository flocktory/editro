/*
 * Main class. Response for whole editor.
 * Provide static methods for extendind.
 *
 *
 */

const EventEmmiter = require('events');
const Frame = require('./Frame');
const Toolbox = require('./Toolbox');

const tabs = require('./addon/toolbox/tabs');
const panes = require('./addon/toolbox/panes');
const wysiwyg = require('./addon/controllers/wysiwyg');

const initHooks = [];

class Editro extends EventEmmiter {
  constructor(root, code) {
    super();

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
    this.frame.on('change', this._onFrameChanged.bind(this));

    this.toolbox = new Toolbox({
      prefix: this.options.prefix + 'Toolbox'
    });


    // Build DOM
    // top
    const instruments = new Editro.type.Instruments(this);
    const topPanel = new Editro.type.Panel({
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
    const rightPanel = new Editro.type.Panel({
      position: 'right',
      tag: 'toolbox',
      child: this.toolbox.getNode()
    });
    center.appendChild(rightPanel.getNode());
    this.node.appendChild(center);
    root.appendChild(this.node);

    initHooks.forEach(h => h(this));
  }

  setOption(name, val) {
    const old = this.options[name];
    if (old !== val) {
      this.options[name] = val;
      this.emit(`option-${name}-changed`, val, old);
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

    const cp = Object.values(Editro.codePostprocessor);
    return cp.length ?
      cp.reduce((c, p) => p(c), raw) :
      raw;
  }

  setHtml(code) {
    // pass code through preprocessors
    const cp = Object.values(Editro.codePreprocessor);
    const prepared = cp.length ?
      cp.reduce((c, p) => p(c), code) :
      code;

    this.frame.setHtml(prepared);
  }

  _onElementSelected(element) {
    this.emit('selected', element);
    this.toolbox.setElement(element);
  }

  _onFrameChanged(e) {
    this.emit('change', {
      html: e.html,
      sourceType: 'frame',
      source: this.frame
    });
  }
}

Editro.prototype.options = {
  prefix: 'Editro-'
};

Editro.defineOption = (name, d) => {
  Editro.prototype.options[name] = d;
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

module.exports = Editro;

// add tags
const tags = require('./tags');
Object.keys(tags).forEach(g => Editro.defineHelper('tags', g, tags[g]));

require('./addon/panel')(Editro);
require('./addon/instruments')(Editro);
tabs(Editro);
panes(Editro);
require('./addon/core')(Editro);
require('./addon/history')(Editro);
require('./addon/clearScripts')(Editro);
require('./addon/upload')(Editro);
wysiwyg(Editro);
require('./addon/controllers/background')(Editro);
require('./addon/controllers/src')(Editro);
require('./addon/controllers/href')(Editro);
require('./addon/controllers/border')(Editro);
require('./addon/controllers/borderRadius')(Editro);
require('./addon/controllers/placeholder')(Editro);
require('./addon/controllers/size')(Editro);
require('./addon/controllers/position')(Editro);
require('./addon/controllers/fontFamily')(Editro);
require('./addon/controllers/font')(Editro);
