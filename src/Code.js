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
import html from './templates/code.html';
import CodeMirror from 'codemirror';
import { elementSearch, click } from './utils';



const codeMirrorDefaultOptions = {
  mode: 'htmlmixed',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  matchTags: true,
  foldGutter: true,
  continueComments: true,
  autoCloseTags: true,
  fullScreen: false
};


export default class Code {
  constructor(el, { onChange, getHtml, keyMap }) {
    el.innerHTML = html;

    this.codeMirrorInstance = null;
    this._el = el;
    this._elem = elementSearch(el, 'EditroCode');
    this._onChange = onChange;
    this._getHtml = getHtml;
    this._keyMap = keyMap || 'default';

    click(this._elem('close'), this.toggle.bind(this));
    click(this._elem('resize'), this.resize.bind(this));
    click(this._elem('fullScreen'), this.toggleFullscreen.bind(this));
  }

  destroy() {
    // do nothing
  }

  createCodeMirrorInstance() {
    const options = Object.assign({
      value: this._getHtml(),
      keyMap: this._keyMap
    }, codeMirrorDefaultOptions);

    return CodeMirror(this._elem('codeMirror'), options); // eslint-disable-line
  }

  toggle() {
    this._el.firstChild.classList.toggle('is-opened');

    if (!this.codeMirrorInstance) {
      this.codeMirrorInstance = this.createCodeMirrorInstance();
      this.codeMirrorInstance.on('changes', () => {
        this._onChange(this.codeMirrorInstance.getValue());
      });
    } else {
      this.codeMirrorInstance.setValue(this._getHtml());
    }
  }

  resize() {
    this._el.firstChild.classList.toggle('is-half');
  }

  toggleFullscreen() {
    if (!this.codeMirrorInstance) {
      return;
    }

    this.codeMirrorInstance.setOption('fullScreen', !this.codeMirrorInstance.getOption('fullScreen'));
    this._el.firstChild.classList.toggle('is-fullScreen');
  }
}
