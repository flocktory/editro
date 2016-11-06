const { createDocumentFragment } = require('../../utils');

const defaultFonts = [
  {
    fontFamily: 'Helvetica, Arial, sans-serif'
  },
  {
    fontFamily: 'Verdana, sans-serif'
  },
  {
    fontFamily: 'Tahoma, sans-serif'
  },
  {
    fontFamily: '"Times new roman", serif'
  },
  {
    fontFamily: 'Georgia, serif'
  },
  {
    fontFamily: '"Open Sans", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Open Sans Condensed", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Roboto, sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Roboto Condensed", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"Roboto Slab", serif',
    source: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Lora, serif',
    source: 'https://fonts.googleapis.com/css?family=Lora:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: '"PT Sans", sans-serif',
    source: 'https://fonts.googleapis.com/css?family=PT+Sans:400,700&subset=latin,cyrillic'
  },
  {
    fontFamily: 'Lobster, cursive',
    source: 'https://fonts.googleapis.com/css?family=Lobster&subset=latin,cyrillic'
  }
];

module.exports = function(Editro) {
  const { Controller, SelectComponent } = Editro.types;

  defaultFonts.map(f => Editro.defineHelper('font', f.fontFamily, f));

  class FontFamilyController extends Controller {
    constructor(editro) {
      super(editro);

      this.node = document.createElement('div');
      this.node.classList.add('EditroController');
    }

    onElementSelected(el) {
      this.el = el;
      if (this.select) {
        this.select.removeAllListeners('change');
        this.select.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Font family</h3>';

      this.select = new SelectComponent(el.getStyle('fontFamily'), {
        choices: Object.values(Editro.font)
          .map(font => [font.fontFamily, font.fontFamily]),
        label: this.editro.i18n('Font family')
      });
      this.select.on('change', v => this._onChange(v));

      this.node.appendChild(this.select.el);
    }

    getNode() {
      return this.node;
    }

    getPane() {
      return 'style';
    }

    _onChange(fontFamily) {
      this.el.setStyle('fontFamily', fontFamily);

      // TODO avoid el.getNode
      const node = this.el.getNode();
      const source = Editro.font[fontFamily].source;
      const linkToSource = node.querySelector('link[role=font-family]');

      if (source) {
        if (linkToSource) {
          linkToSource.setAttribute('href', source);
        } else {
          const link = createDocumentFragment(`<link rel="stylesheet" href="${source}" role="font-family" />`);
          node.appendChild(link);
        }
      } else if (linkToSource) {
        node.removeChild(linkToSource);
      }
    }
  }

  Editro.defineHelper('controllers', 'FontFamilyController', FontFamilyController);
};

