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

  // add instruments
  Editro.defineInitHook(e => {
    const currentSelected = document.createElement('div');
    currentSelected.className = 'EditroInstruments-item';
    e.addInstrument({
      getNode: () => currentSelected
    });
    e.on('selected', el => currentSelected.innerHTML = `
      <div class="EditroInstruments-icon">${el.getTag()}</div>
      <div class="EditroInstruments-title">Current</div>
    `);

    const I = Editro.type.Instrument;
    e.addInstrument(new I(e, {
      icon: require('../../images/backward.svg'),
      title: 'Backward',
      onClick: () => e.backward()
    }));
    e.addInstrument(new I(e, {
      icon: require('../../images/forward.svg'),
      title: 'Forward',
      onClick: () => e.forward()
    }));

    let currentEl = null;
    e.on('selected', el => currentEl = el);
    e.addInstrument(new I(e, {
      icon: require('../../images/remove.svg'),
      title: 'Remove',
      onClick: () => currentEl && currentEl.remove()
    }));
  });

  // frame return &amp;
  Editro.defineHelper('codePostprocessor', 'amp', str => str.replace(/&amp;/g, '&'));

  const req = require.context('./components', true, /\.js$/);
  req.keys().forEach(c => {
    const name = c.slice(2, -3);
    const cls = req(c);
    Editro.defineHelper('types', name, cls);
  });
};
