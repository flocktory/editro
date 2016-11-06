const defaultTabs = [
  { name: 'content' },
  { name: 'style' },
  { name: 'settings' }
];

class Tabs {
  constructor(editro) {
    this.editro = editro;
    this.toolbox = editro.getToolbox();
    const tNode = this.toolbox.getNode();
    this.prefix = this.toolbox.getPrefix() + '-Tabs';

    this.node = document.createElement('div');
    this.node.className = this.prefix;

    const tabs = editro.getOption('tabs') || defaultTabs;
    this.tabs = tabs.map(c => this._createTab(c));
    this.tabs.forEach(t => this.node.appendChild(t));

    this.node.addEventListener('click', e => {
      const pane = e.target.dataset.pane;
      if (pane) {
        this._switchTab(pane);
      }
    });

    tNode.appendChild(this.node);

    let current = localStorage.getItem(this.prefix + '-current');
    if (!tabs.find(t => t.name === current)) {
      current = tabs[0].name;
    }
    this._switchTab(current);
  }

  _createTab(config) {
    const paneName = config.name;
    const title = config.title;
    const tab = document.createElement('button');
    tab.className = this.prefix + '-Tab';
    tab.dataset.pane = config.name;
    tab.setAttribute('data-pane', paneName);
    tab.innerHTML = title || paneName;
    return tab;
  }

  _switchTab(paneName) {
    this.tabs.forEach(t => {
      t.dataset.active = t.dataset.pane === paneName ? 'yes' : 'no';
    });
    this.editro.setOption('pane', paneName);
    try {
      localStorage.setItem(this.prefix + '-current', paneName);
    } catch(e) {
      // do nothing
    }
  }
}

module.exports = function(Editro) {
  Editro.defineInitHook(editro => {
    new Tabs(editro);
  });
};
