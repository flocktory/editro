const { debounce } = require('../utils');
const monaco = require('monaco-editor');

module.exports = function(Editro) {
  Editro.defineInitHook((editro, _, options) => {
    const wrapper = document.createElement('div');
    wrapper.style.height = '100%';
    wrapper.style.position = 'relative';

    const { code, readOnly = false} = options;

    // Remove leading and trailing linebreaks and slashes.
    const normalizedCode = code.replace(/^\s+|\s+$/g, '').trim();

    const bottomPanel = new Editro.type.Panel(editro, {
      position: 'bottom',
      tag: 'monacoeditor',
      child: wrapper
    });
    editro.getNode().appendChild(bottomPanel.getNode());

    const monacoEditor = monaco.editor.create(wrapper, {
      language: 'html',
      value: normalizedCode,
      readOnly,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true
    });

    let isEditing = false;

    monacoEditor.onDidFocusEditorWidget(() => {
      isEditing = true;
    });

    monacoEditor.onDidBlurEditorWidget(() => {
      isEditing = false;
    });

    /* Applies changes to Monaco editor if change something with editro staff */
    editro.on('change', e => {
      if (!isEditing && e.sourceType !== 'code' && monacoEditor.getModel().getValue() !== e.html) {
        monacoEditor.getModel().setValue(e.html);
        const matches = monacoEditor.getModel().findMatches('data-editro-selection');
        const selectedItemLineNumber = matches.length && matches[0].range && matches[0].range.startLineNumber ? matches[0].range.startLineNumber : null;
        if (selectedItemLineNumber) {
          monacoEditor.revealLine(selectedItemLineNumber);
        }
      }
    });

    /* Applies changes to edtiro if changing code with Monaco editor */
    monacoEditor.getModel().onDidChangeContent(debounce(() => {
      const monacoEditorSource = monacoEditor.getModel().getValue();
      const iframeSource = editro.frame;

      if (isEditing && iframeSource && iframeSource.isDocumentReady() && monacoEditorSource !== editro.getHtml()) {
        editro.setHtml(monacoEditorSource, {
          sourceType: 'code'
        });
      }
    }, 200));

    const I = Editro.type.Instrument;
    editro.addInstrument(new I(editro, {
      icon: require('../../images/code.svg'),
      title: 'Html',
      onClick: () => editro.emit('toggle-bottom-panel'),
      group: 'panels'
    }));
  });
};


// export for tests
const pre = module.exports.pre = function pre(code) {
  const isKeepTag = s => /^<(script|style)[\s>]/i.test(s);

  // removes all text between tags
  function clear(str) {
    let n = '';
    let collecting = str.charAt(0) === '<';
    let keep = isKeepTag(str);

    for (let i = 0, l = str.length; i < l; i++) {
      let ch = str.charAt(i);
      if (ch === '<') {
        keep = isKeepTag(str.slice(i));
        collecting = true;
      }
      if (collecting || keep) {
        n += ch;
      }
      if (ch === '>') {
        if (keep) {
          keep = false;
        }
        else {
          collecting = false;
        }
      }
    }
    return n;
  }

  // remove all text between tags from open html to open body or close head if no body
  return code .replace(/(<html[^>]*>)([\s\S]*)(<(head|body)[\s>])/mi, (_, b, c, d) => {
    c = clear(c);
    return b + c + d;
  });
};

