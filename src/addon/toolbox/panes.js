const assert = require('assert');

const defaultTabs = [
  { name: 'content' },
  { name: 'style' },
  { name: 'settings' }
];

module.exports = function(Editro) {
  class Panes {
    constructor(editro) {
      this.editro = editro;
      this.toolbox = editro.getToolbox();
      this.defaultPanes = editro.getOption('defaultPanes');
      const tNode = this.toolbox.getNode();

      this.node = document.createElement('div');
      this.node.className = 'EditroPanes';

      const tabs = editro.getOption('tabs') || defaultTabs;
      this.panes = tabs.map(t => this._createPane(t));
      this.panes.forEach(p => {
        this.node.appendChild(p);
      });

      Object.values(Editro.controllers)
        .forEach(C => this._addController(C));

      this._switchPane(editro.getOption('pane'));
      editro.on('option-pane-changed', p => this._switchPane(p));

      tNode.appendChild(this.node);

      this.defaultPanes.forEach(name => this._createPane({ name }));

      this._toggleTabbed(editro.getOption('toolboxTabsEnabled'));
      editro.on('optionChanged:toolboxTabsEnabled', v => this._toggleTabbed(v));
    }

    getNode() {
      return this.node;
    }


    // setting false value makes panes flat with scroll
    // setting true makes them work with tabs
    _toggleTabbed(toggle) {
      this.node.classList.toggle('EditroPanes--tabbed', toggle);
    }

    _createPane(config) {
      const pane = document.createElement('div');
      pane.classList.add('EditroPane');
      pane.dataset.pane = config.name;
      return pane;
    }

    _switchPane(paneName) {
      this.panes.forEach(p => {
        p.dataset.active = p.dataset.pane === paneName ? 'yes' : 'no';
      });
    }

    _addController(Controller) {
      const c = new Controller(this.editro);
      const pane = c.getPane();
      const paneNode = this.node.querySelector(`[data-pane="${pane}"]`);
      if (paneNode) {
        paneNode.appendChild(c.getNode());
        c.getNode().classList.add('EditroPane-section');
      } else {
        throw new Error('controller.getPane() should return name for existed pane');
      }
    }
  }

  class Controller {
    constructor(editro, node) {
      if (!editro) {
        throw new Error('class Controler: constructor expect first param - editro. ' +
          'You probably forgot super(editro)');
      }

      assert(node ? node instanceof Element : true, 'Node should be Element or nul');

      this.editro = editro;
      if (node) {
        this.node = node;
      } else {
        this.node = document.createElement('div');
        this.node.classList.add('EditroController');
      }

      editro.on('selected', e => this.onElementSelected(e));
    }

    onElementSelected() {
      throw new Error('controller.onElementSelected should be overriden');
    }

    toggle(toggle) {
      this.getNode().dataset.enabled = toggle ? 'yes' : 'no';
    }

    getNode() {
      return this.node;
    }

    getPane() {
      throw new Error('controller.getPane should return pane name ' +
        'you probably forgot to override method');
    }
  }


  Editro.defineHelper('type', 'Controller', Controller);

  Editro.defineOption('defaultPanes', ['settings', 'content', 'style']);

  Editro.defineInitHook(editro => {
    new Panes(editro);
  });
};
