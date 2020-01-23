const key = Symbol('instruments');

module.exports = function(Editro) {
  class Instrument {
    constructor(editro, { className, icon, title, onClick, group }) {
      this.group = group || 'none';
      const containerNode = document.createElement('div');
      const iconNode = icon ? `<img class="EditroInstruments-icon" src="${icon}" alt="${title}">` : '';
      const titleNode = title ? `<div class="EditroInstruments-title">${title}</div>` : '';

      containerNode.className = `EditroInstruments-item ${className ? className : ''}`;
      containerNode.innerHTML = `${iconNode}${titleNode}`;
      containerNode.addEventListener('click', onClick);
      this.node = containerNode;
    }
    getNode() {
      return this.node;
    }
    getGroup() {
      return this.group;
    }
  }

  class Instruments {
    constructor(editro) {
      editro[key] = this;

      this.node = document.createElement('div');
      this.node.className = 'EditroInstruments';

      Object.values(Editro.instrument || {}).forEach(I => {
        this.addInstrument(new I(editro));
      });
    }

    getNode() {
      return this.node;
    }

    /**
     * Add new instrument into panel
     * @param Object opts options
     */
    addInstrument(instrument) {
      const group = instrument.getGroup();

      let gEl = this.node.querySelector(`[data-group="${group}"]`);
      if (!gEl) {
        gEl = document.createElement('div');
        gEl.className = 'EditroInstruments-group';
        gEl.dataset.group = group;
        this.node.appendChild(gEl);
      }
      gEl.appendChild(instrument.getNode());
    }


    _createWrapper(node) {
      const w = document.createElement('div');
      w.className = 'Instruments-item';
      w.appendChild(node);
      return w;
    }
  }


  Editro.defineHelper('type', 'Instrument', Instrument);
  Editro.defineHelper('type', 'Instruments', Instruments);

  Editro.defineExtension('addInstrument', function(i) {
    this[key].addInstrument(i);
  });
};
