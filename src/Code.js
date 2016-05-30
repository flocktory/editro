import './Code.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/keymap/vim';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen';
import CodeMirror from 'codemirror';
import { elementSearch, click } from './utils';

const HTML = `<section class="Code-codeMirror"></section>
  <div class="Code-close">[&times;]</div>
  <div class="Code-fullScreen">[Full screen]</div>`;

export default class Code {
  constructor(el, { onChange, getHtml, keyMap }) {
    this._cm = null;
    this._el = el;
    this._onChange = onChange;
    this._getHtml = getHtml;
    this._keyMap = keyMap || 'default';
    this._elem = elementSearch(this._el, 'Code');

    this._el.innerHTML = HTML;
    this._el.classList.add('Code');
    click(this._elem('close'), this.toggle.bind(this));
    click(this._elem('fullScreen'), this.toggleFullscreen.bind(this));
  }

  toggle() {
    this._el.classList.toggle('Code--on');

    if (!this._cm) {
      this._cm = CodeMirror(this._elem('codeMirror'), { // eslint-disable-line
        value: this._getHtml(),
        mode: 'htmlmixed',
        lineNumbers: true,
        keyMap: this._keyMap,
        autoCloseBrackets: true,
        matchBrackets: true,
        matchTags: true,
        foldGutter: true,
        continueComments: true,
        autoCloseTags: true,
        fullScreen: false
      });
      this._cm.on('changes', () => {
        const h = this._cm.getValue();
        this._onChange(h);
      });
    } else {
      this._cm.setValue(this._getHtml());
    }
  }

  toggleFullscreen() {
    const cm = this._cm;
    cm && cm.setOption('fullScreen', !cm.getOption('fullScreen'));
  }
}
