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
    }

    getNode() {
      return this.node;
    }

    _createPane(config) {
      const paneName = config.name;
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
    constructor(editro) {
      if (!editro) {
        throw new Error('class Controler: constructor expect first param - editro. ' + 
          'You probably forgot super(editro)');
      }

      this.editro = editro;

      editro.on('selected', e => this.onElementSelected(e));
    }

    onElementSelected() {
      throw new Error('controller.onElementSelected should be overriden');
    }

    getNode() {
      throw new Error('controller.getNode should return node ' +
        'you probably forgot to override method');
    }
    getPane() {
      throw new Error('controller.getPane should return pane name ' +
        'you probably forgot to override method');
    }
  }


  Editro.defineHelper('types', 'Controller', Controller);

  Editro.defineInitHook(editro => {
    new Panes(editro);
  });
};
