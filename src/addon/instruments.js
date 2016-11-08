const key = Symbol('instruments');

module.exports = function(Editro) {
  class Instrument {
    constructor(editro, { icon, title, onClick }) {
      const i = document.createElement('div');
      i.className = 'EditroInstruments-item';
      i.innerHTML = `
        <img class="EditroInstruments-icon" src="${icon}" alt="${title}">
        <div class="EditroInstruments-title">${title}</div>
      `;
      i.addEventListener('click', onClick);
      this.node = i;
    }
    getNode() {
      return this.node;
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
      this.node.appendChild(instrument.getNode());
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
