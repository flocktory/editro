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

    this.node = document.createElement('div');
    this.node.className = 'EditroTabs';

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

    let current = localStorage.getItem('EditroTabs-current');
    if (!tabs.find(t => t.name === current)) {
      current = tabs[0].name;
    }
    this._switchTab(current);
  }

  _createTab(config) {
    const paneName = config.name;
    const title = config.title;
    const tab = document.createElement('button');
    tab.className = 'EditroTabs-tab';
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
      localStorage.setItem('EditroTabs-current', paneName);
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
