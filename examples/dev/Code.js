import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/keymap/vim';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen';
import CodeMirror from 'codemirror';
import {elementSearch, click, toggleAttr} from '../../src/utils';

const html = `
  <div class="EditroCode-codeMirror"></div>
  <div class="EditroCode-actions">
    <button class="EditroButton EditroCode-fullScreen">
      <span class="EditroButton-wrapper">
        <div class="EditroIcon EditroIcon--fullScreen"></div>
        <div class="EditroIcon EditroIcon--fullScreenOut"></div>
      </span>
    </button>
    <button class="EditroButton EditroCode-close">
      <span class="EditroButton-wrapper">
        <div class="EditroIcon EditroIcon--close"></div>
      </span>
    </button>
  </div>
`;


const codeMirrorDefaultOptions = {
  mode: 'htmlmixed',
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  matchTags: true,
  continueComments: true,
  autoCloseTags: true,
  fullScreen: false,
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
};


export default class Code {
  constructor(el, { onChange, getHtml, keyMap }) {
    el.innerHTML = html;
    el.classList.add('EditroCode');

    this.codeMirrorInstance = null;
    this._el = el;
    this._elem = elementSearch(el, 'EditroCode');
    this._onChange = onChange;
    this._getHtml = getHtml;
    this._keyMap = keyMap || 'default';

    click(this._elem('close'), this.toggle.bind(this));
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
    toggleAttr(this._el, 'is-opened');

    if (!this.codeMirrorInstance) {
      this.codeMirrorInstance = this.createCodeMirrorInstance();
      this.codeMirrorInstance.on('changes', () => {
        this._onChange(this.codeMirrorInstance.getValue());
      });
    } else {
      this.codeMirrorInstance.setValue(this._getHtml());
    }
  }

  setHtml(html) {
    if (this.codeMirrorInstance && html !== this.codeMirrorInstance.getValue()) {
      this.codeMirrorInstance.setValue(html);
    }
  }

  toggleFullscreen() {
    if (!this.codeMirrorInstance) {
      return;
    }

    this.codeMirrorInstance.setOption('fullScreen', !this.codeMirrorInstance.getOption('fullScreen'));
    toggleAttr(this._el, 'is-fullScreen');
  }
}
