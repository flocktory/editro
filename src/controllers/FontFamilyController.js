import Controller from '../Controller';
import SelectComponent from '../components/SelectComponent';
import {toArray, createDocumentFragment} from '../utils';


export default class FontFamilyController extends Controller {
  static test(el) {
    return el.tagName.toLowerCase() === 'body';
  }

  get fonts() {
    return [
      {
        fontFamily: ''
      },
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
        fontFamily: "'Times new roman', serif"
      },
      {
        fontFamily: 'Georgia, serif'
      },
      {
        fontFamily: "'Open Sans', sans-serif",
        source: 'https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Open Sans Condensed', sans-serif",
        source: 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Roboto', sans-serif",
        source: 'https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Roboto Condensed', sans-serif",
        source: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Roboto Slab', serif",
        source: 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Lora', serif",
        source: 'https://fonts.googleapis.com/css?family=Lora:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'PT Sans', sans-serif",
        source: 'https://fonts.googleapis.com/css?family=PT+Sans:400,700&subset=latin,cyrillic'
      },
      {
        fontFamily: "'Lobster', cursive",
        source: 'https://fonts.googleapis.com/css?family=Lobster&subset=latin,cyrillic'
      }
    ];
  }

  getSource(fontFamily) {
    const font = this.fonts.find(font => font.fontFamily === fontFamily);

    return font && font.source;
  }

  createComponent(value) {
    return new SelectComponent(value, {
      choices: this.fonts.map(font => [font.fontFamily, font.fontFamily])
    });
  }

  get() {
    return window.getComputedStyle(this.el).fontFamily;
  }

  set(value) {
    this.el.style.fontFamily = value;

    const source = this.getSource(value);
    const linkToSource = toArray(this.el.children).find(node =>
      node.tagName.toLowerCase() === 'link' && node.getAttribute('role') === 'font-family');

    if (source) {
      if (linkToSource) {
        linkToSource.setAttribute('href', source);
      } else {
        var link = createDocumentFragment(`<link rel="stylesheet" href="${source}" role="font-family" />`);
        this.el.appendChild(link);
      }
    } else if (linkToSource) {
      this.el.removeChild(linkToSource);
    }
  }

  get title() {
    return 'Font family';
  }
}
