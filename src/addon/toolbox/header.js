class Header {
  constructor(editro) {
    this.toolbox = editro.getToolbox();
    const tNode = this.toolbox.getNode();
    this.prefix = this.toolbox.getPrefix() + '-Tabs';
    this.tabs = editro.getOption('tabs') || defaultTabs;

    this.node = document.createElement('div');
    this.node.className = this.prefix;

    this.tabs.forEach(c => {
      this.node.appendChild(this._createTab(c));
    });

    this.node.addEventListener('click', e => {
      const pane = e.target.dataset.pane;
      if (pane) {
        editro.emit('tabs.selected', { pane });
      }
    });

    tNode.appendChild(this.node);
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
}

module.exports = function(Editro) {
  Editro.defineInitHook(editro => {
    new Tabs(editro);
  });
};
