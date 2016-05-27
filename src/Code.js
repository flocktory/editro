import 'codemirror/lib/codemirror.css'
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/keymap/vim');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/comment/continuecomment');
require('codemirror/addon/display/fullscreen.css');
require('codemirror/addon/display/fullscreen');
import CodeMirror from 'codemirror';

export default class Code {
  constructor(el, { onChange, getHtml, keyMap }) {
    this._cm = null;
    this._el = el;
    this._isOn = false;
    this._onChange = onChange;
    this._getHtml = getHtml;
    this._keyMap = keyMap || 'default';

    this._el.style.display = 'none';
  }

  toggle() {
    this._isOn = !this._isOn;
    this._el.style.display = this._isOn ? 'block' : 'none';

    if (!this._cm) {
      this._cm = CodeMirror(this._el, { // eslint-disable-line
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
}
