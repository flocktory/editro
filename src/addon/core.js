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
    currentSelected.style.minWidth = '50px';
    currentSelected.style.display = 'inline-block';
    const I = Editro.type.Instrument;
    let currentEl = null;
    e.on('selected', el => currentEl = el);

    e.addInstrument({
      getNode: () => currentSelected,
      getGroup: () => 'element'
    });
    e.on('selected', el => currentSelected.innerHTML = `
      <div class="EditroInstruments-icon" style="text-transform: uppercase;">${el.getTag()}</div>
    `);

    e.addInstrument(new I(e, {
      icon: require('../../images/undo.svg'),
      title: 'Backward',
      onClick: () => e.backward(),
      group: 'history'
    }));
    e.addInstrument(new I(e, {
      icon: require('../../images/repeat.svg'),
      title: 'Forward',
      onClick: () => e.forward(),
      group: 'history'
    }));


    e.addInstrument(new I(e, {
      icon: require('../../images/ban.svg'),
      title: 'Remove',
      onClick: () => currentEl && currentEl.remove(),
      group: 'element'
    }));
    e.addInstrument(new I(e, {
      icon: require('../../images/sliders.svg'),
      title: 'Toolbox',
      onClick: () => e.emit('toggle-right-panel'),
      group: 'panels'
    }));
    e.addInstrument(new I(e, {
      icon: require('../../images/arrows-alt.svg'),
      title: 'Fullscreen',
      onClick: () => e.setOption('fullScreen', !e.getOption('fullScreen')),
      group: 'panels'
    }));
  });

  // frame return &amp;
  Editro.defineHelper('codePostprocessor', 'amp', str => str.replace(/&amp;/g, '&'));

  const req = require.context('./components', true, /\.js$/);
  req.keys().forEach(c => {
    const name = c.slice(2, -3);
    const cls = req(c);
    Editro.defineHelper('type', name, cls);
  });
};
