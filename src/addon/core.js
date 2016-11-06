module.exports = function(Editro) {
  Editro.defineOption('notificationTimeout', 3000);
  Editro.defineExtension('showNotification', function({ type, title, text, timeout }) {
    const t = type || 'Info';
    const node = document.createElement('div');
    const prefix = this.getOption('prefix') + 'Notification';
    node.className = prefix + ' ' + prefix + '--' + t.toLowerCase();
    node.innerHTML = `
      <h3 class="${prefix}-Title">${title || ''}</h3>
      <div class="${prefix}-Text">${text || ''}</div>
    `;

    this.getNode().appendChild(node);

    setTimeout(() => {
      node.classList.add(prefix + '--hidden');
      setTimeout(() => this.getNode().removeChild(node), 1000);
    }, timeout || this.getOption('notificationTimeout'));
  });
  Editro.defineExtension('i18n', a => a);

  const req = require.context('./components', true, /\.js$/);
  req.keys().forEach(c => {
    const name = c.slice(2, -3);
    const cls = req(c);
    Editro.defineHelper('types', name, cls);
  });
};
